import { convertToModelMessages, createUIMessageStreamResponse, stepCountIs, streamText } from "ai";
import { createDemoStream } from "@/features/chat/server/demo-agent";
import { getChatModel, isDemoMode } from "@/features/chat/server/model";
import { buildSystemPrompt } from "@/features/chat/server/system-prompt";
import { chatTools } from "@/features/chat/server/tools";
import type { ChatUIMessage } from "@/features/chat/types";
import { rateLimit } from "@/lib/http";
import { connection } from "next/server";

export const maxDuration = 30;

const MAX_MESSAGES = 30;
const MAX_TEXT_LENGTH = 1500;

/** Lets the UI show whether the real AI or demo mode is answering */
export async function GET() {
  await connection(); // read env at request time, not build time
  return Response.json({ mode: isDemoMode() ? "demo" : "ai" });
}

/**
 * A booking card the customer abandoned (they typed something else instead) would leave a
 * tool call with no result, which model APIs reject. Mark those as dismissed.
 */
function closeAbandonedToolCalls(messages: ChatUIMessage[]): ChatUIMessage[] {
  return messages.map((m, i) => {
    if (m.role !== "assistant" || i === messages.length - 1) return m;
    return {
      ...m,
      parts: m.parts.map((p) =>
        p.type === "tool-showBookingForm" && (p.state === "input-available" || p.state === "input-streaming")
          ? { ...p, state: "output-available" as const, input: p.input ?? {}, output: { status: "dismissed" as const } }
          : p,
      ),
    } as ChatUIMessage;
  });
}

export async function POST(request: Request) {
  if (!rateLimit(request, 30)) {
    return Response.json({ error: "You're sending messages too quickly — please wait a moment." }, { status: 429 });
  }

  const { messages: raw } = (await request.json()) as { messages: ChatUIMessage[] };
  const tooLong = raw.some((m) => m.parts.some((p) => p.type === "text" && p.text.length > MAX_TEXT_LENGTH));
  if (!Array.isArray(raw) || tooLong) {
    return Response.json({ error: "Message too long." }, { status: 400 });
  }
  const messages = closeAbandonedToolCalls(raw.slice(-MAX_MESSAGES));

  const model = getChatModel();
  if (!model) {
    return createUIMessageStreamResponse({ stream: createDemoStream(messages) });
  }

  const result = streamText({
    model,
    system: await buildSystemPrompt(),
    messages: await convertToModelMessages(messages),
    tools: chatTools,
    stopWhen: stepCountIs(5),
    temperature: 0.4,
  });

  return result.toUIMessageStreamResponse({
    onError: (error) => {
      console.error("[chat]", error);
      return "Sorry — I hit a snag. You can still book on the Book page or call us.";
    },
  });
}
