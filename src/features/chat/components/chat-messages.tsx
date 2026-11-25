"use client";

import { Loader2, Search } from "lucide-react";
import { LogoMark } from "@/components/layout/logo";
import { cn } from "@/lib/utils";
import { useChatWidget } from "../hooks/use-chat-widget";
import type { BookingFormOutput, ChatUIMessage } from "../types";
import { MessageText } from "./message-text";
import { AvailabilityCard, BookingCard, ContactCard, EstimateCard } from "./tool-cards";

type Props = { messages: ChatUIMessage[]; services: { slug: string; name: string }[]; isThinking: boolean };

export function ChatMessages({ messages, services, isThinking }: Props) {
  const {
    chat: { addToolOutput, sendMessage },
  } = useChatWidget();

  const submitBooking = (toolCallId: string, output: BookingFormOutput) =>
    void addToolOutput({ tool: "showBookingForm", toolCallId, output });

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div key={message.id} className={cn("flex gap-2.5", message.role === "user" && "justify-end")}>
          {message.role === "assistant" && <LogoMark className="mt-0.5 size-7 shrink-0" />}
          <div className={cn("flex max-w-[85%] flex-col gap-2", message.role === "user" && "items-end")}>
            {message.parts.map((part, i) => {
              const key = `${message.id}-${i}`;
              switch (part.type) {
                case "text":
                  if (!part.text.trim()) return null;
                  return (
                    <div
                      key={key}
                      className={cn(
                        "rounded-2xl px-4 py-2.5 text-[14.5px] leading-relaxed",
                        message.role === "user" ? "rounded-br-md bg-forest-800 text-white" : "rounded-tl-md bg-white text-ink shadow-soft",
                      )}
                    >
                      <MessageText text={part.text} />
                    </div>
                  );

                case "tool-showBookingForm":
                  if (part.state === "input-streaming") return <ToolPending key={key} label="Preparing booking card…" />;
                  if (part.state === "output-error") return null;
                  return (
                    <BookingCard
                      key={key}
                      input={part.input}
                      output={part.state === "output-available" ? part.output : undefined}
                      services={services}
                      onResult={(output) => submitBooking(part.toolCallId, output)}
                    />
                  );

                case "tool-estimatePrice":
                  if (part.state !== "output-available") return <ToolPending key={key} label="Crunching the numbers…" />;
                  return <EstimateCard key={key} output={part.output} />;

                case "tool-checkAvailability":
                  if (part.state !== "output-available") return <ToolPending key={key} label="Checking the calendar…" />;
                  return <AvailabilityCard key={key} output={part.output} onPick={(label) => void sendMessage({ text: `Book me in for ${label}` })} />;

                case "tool-handoffToHuman":
                  if (part.state !== "output-available") return null;
                  return <ContactCard key={key} output={part.output} />;

                case "tool-getServiceInfo":
                  return part.state === "output-available" ? null : <ToolPending key={key} label="Looking up our products…" icon="search" />;

                case "tool-createEnquiry":
                  if (part.state === "output-available")
                    return (
                      <p key={key} className="rounded-full bg-sage-100 px-3 py-1 text-xs font-semibold text-forest-700">
                        Enquiry sent · Ref {part.output.reference}
                      </p>
                    );
                  return <ToolPending key={key} label="Sending your enquiry…" />;

                default:
                  return null;
              }
            })}
          </div>
        </div>
      ))}

      {isThinking && (
        <div className="flex gap-2.5">
          <LogoMark className="size-7 shrink-0" />
          <div className="flex items-center gap-1 rounded-2xl rounded-tl-md bg-white px-4 py-3.5 shadow-soft" aria-label="Assistant is typing">
            {[0, 150, 300].map((d) => (
              <span key={d} className="size-1.5 animate-bounce rounded-full bg-forest-600" style={{ animationDelay: `${d}ms` }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ToolPending({ label, icon }: { label: string; icon?: "search" }) {
  return (
    <p className="flex items-center gap-2 text-xs font-medium text-muted">
      {icon === "search" ? <Search className="size-3.5" aria-hidden /> : <Loader2 className="size-3.5 animate-spin" aria-hidden />}
      {label}
    </p>
  );
}
