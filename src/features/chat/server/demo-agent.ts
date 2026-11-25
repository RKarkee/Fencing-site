import "server-only";
import { createUIMessageStream, type UIMessageStreamWriter } from "ai";
import { getAvailability } from "@/lib/booking/service";
import { content } from "@/lib/data";
import { estimatePrice } from "@/lib/pricing/estimate";
import type { Region } from "@/lib/schemas";
import { formatCurrency } from "@/lib/utils";
import type { ChatUIMessage } from "../types";

/**
 * Rule-based "demo mode" used when no ANTHROPIC_API_KEY is set, so the prototype
 * works offline. It speaks the same UI-message protocol (text + tool parts) as the real model,
 * so the chat UI is identical either way.
 */

const SERVICE_KEYWORDS: [RegExp, string][] = [
  [/colou?rbond|steel|boundary|dividing/, "colorbond-fencing"],
  [/pool|glass/, "pool-fencing"],
  [/pvc|vinyl|picket/, "pvc-fencing"],
  [/slat/, "aluminium-slat-fencing"],
  [/blade|vertical/, "blade-fencing"],
  [/security|garrison|commercial|palisade|chain ?mesh/, "security-fencing"],
  [/retain|sleeper/, "retaining-walls"],
  [/gate|motor|automat/, "gates-automation"],
];
const SOUTH_WEST = /bunbury|australind|busselton|dunsborough|capel|harvey|collie|donnybrook|eaton|dalyellup|south ?west/;

const detectService = (t: string) => SERVICE_KEYWORDS.find(([re]) => re.test(t))?.[1];
const detectRegion = (t: string): Region | undefined => (SOUTH_WEST.test(t) ? "south-west" : /perth|joondalup|rockingham|mandurah|fremantle|baldivis|scarborough/.test(t) ? "perth" : undefined);
const detectLength = (t: string) => {
  const m = t.match(/(\d{1,4})\s*(m\b|metre|meter|lm|linear)/) ?? t.match(/(\d{1,4})/);
  return m ? Number(m[1]) : undefined;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
let idCounter = 0;
const id = (prefix: string) => `${prefix}_${Date.now().toString(36)}_${(idCounter++).toString(36)}`;

async function streamText(writer: UIMessageStreamWriter<ChatUIMessage>, text: string) {
  const partId = id("txt");
  writer.write({ type: "text-start", id: partId });
  for (const chunk of text.match(/\S+\s*/g) ?? []) {
    writer.write({ type: "text-delta", id: partId, delta: chunk });
    await sleep(18);
  }
  writer.write({ type: "text-end", id: partId });
}

function writeTool(writer: UIMessageStreamWriter<ChatUIMessage>, toolName: string, input: unknown, output?: unknown) {
  const toolCallId = id("call");
  writer.write({ type: "tool-input-available", toolCallId, toolName, input });
  if (output !== undefined) {
    writer.write({ type: "tool-output-available", toolCallId, output });
    // Close the tool step like a real model would, so the client doesn't treat it as awaiting a follow-up
    writer.write({ type: "finish-step" });
    writer.write({ type: "start-step" });
  }
}

function lastUserText(messages: ChatUIMessage[]) {
  const last = [...messages].reverse().find((m) => m.role === "user");
  return (last?.parts ?? [])
    .map((p) => (p.type === "text" ? p.text : ""))
    .join(" ")
    .toLowerCase();
}

/** If the latest assistant message ends with a completed booking card, we're being asked to follow up on it */
function completedBooking(messages: ChatUIMessage[]) {
  const last = messages.at(-1);
  if (last?.role !== "assistant") return null;
  const part = last.parts.findLast((p) => p.type === "tool-showBookingForm");
  if (part?.type === "tool-showBookingForm" && part.state === "output-available") return part.output;
  return null;
}

export function createDemoStream(messages: ChatUIMessage[]) {
  return createUIMessageStream<ChatUIMessage>({
    execute: async ({ writer }) => {
      writer.write({ type: "start" });
      writer.write({ type: "start-step" });
      await sleep(350);

      const [site, services, pricing, faqs] = await Promise.all([
        content.getSite(),
        content.getServices(),
        content.getPricing(),
        content.getFaqs(),
      ]);
      const nameOf = (slug?: string) => services.find((s) => s.slug === slug)?.name;

      // 1. Follow-up after the booking card was submitted or dismissed
      const booking = completedBooking(messages);
      if (booking) {
        if (booking.status === "booked") {
          await streamText(
            writer,
            `All locked in! 🎉 Your **free ${nameOf(booking.serviceSlug)?.toLowerCase() ?? "measure"}** visit in ${booking.suburb} is booked for **${booking.slotLabel}** (ref **${booking.reference}**).\n\nWe'll SMS a reminder the day before, and your fixed written quote lands in your inbox within 48 hours of the visit. Anything else I can help with?`,
          );
        } else {
          await streamText(writer, "No worries — the booking card is closed. If you'd like to look at prices first, just tell me the fence type and rough length.");
        }
        writer.write({ type: "finish-step" });
        writer.write({ type: "finish" });
        return;
      }

      const text = lastUserText(messages);
      const service = detectService(text);
      const region = detectRegion(text);
      const length = detectLength(text);

      // 2. Booking intent
      if (/book|measure|appointment|visit|quote|come out|site/.test(text) && !/how much|price|cost/.test(text)) {
        await streamText(
          writer,
          `Happy to help with that! Our measure and quote is **completely free** and there's no obligation. Pop your details in below and pick a time that suits${
            region === "south-west" ? " — our South West estimator visits on Tuesdays and Thursdays" : ""
          }.`,
        );
        writeTool(writer, "showBookingForm", { serviceSlug: service, region, approxLength: length });
        writer.write({ type: "finish-step" });
        writer.write({ type: "finish" });
        return;
      }

      // 3. Pricing intent
      if (/how much|price|cost|estimate|\$|budget|quote for/.test(text)) {
        const slug = service ?? "colorbond-fencing";
        const isGate = slug === "gates-automation";
        const quantity = isGate ? 1 : (length ?? 30);
        const split = /neighbou?r|split|share/.test(text);
        const estimate = estimatePrice(pricing, { serviceSlug: slug, type: /diy|supply/.test(text) ? "supply-only" : "installed", quantity, splitWithNeighbour: split });
        if (estimate) {
          writeTool(writer, "estimatePrice", { serviceSlug: slug, quantity }, { ...estimate, serviceName: nameOf(slug) ?? slug });
          await streamText(
            writer,
            `${!service ? "I've assumed a standard **Colorbond** fence — tell me if you meant something else. " : ""}${
              !length && !isGate ? "I've used **30m** as a typical boundary. " : ""
            }That works out around **${formatCurrency(estimate.low)} – ${formatCurrency(estimate.high)}** including GST${
              estimate.yourShare ? `, or roughly **${formatCurrency(estimate.yourShare)}** each if you split it with your neighbour` : ""
            }.\n\nWant me to book a free measure so we can give you a fixed price?`,
          );
        }
        writer.write({ type: "finish-step" });
        writer.write({ type: "finish" });
        return;
      }

      // 4. Availability
      if (/availab|when can|how soon|earliest|next week|this week/.test(text)) {
        const r = region ?? "perth";
        const slots = (await getAvailability(r)).filter((s) => s.available).slice(0, 6);
        writeTool(writer, "checkAvailability", { region: r }, { region: r, slots });
        await streamText(writer, `Here are the next free measure times${r === "south-west" ? " in the South West" : " in Perth"}. Say "book" and I'll pull up the booking card.`);
        writer.write({ type: "finish-step" });
        writer.write({ type: "finish" });
        return;
      }

      // 5. Talk to a person / commercial
      if (/human|person|call|speak|phone|manager|complain|tender|mine|mining/.test(text)) {
        writeTool(
          writer,
          "handoffToHuman",
          { reason: text.slice(0, 80) },
          { offices: site.offices.map((o) => ({ name: o.name, phone: o.phone, phoneE164: o.phoneE164, hours: o.hours })), email: site.email, commercialEmail: site.commercialEmail },
        );
        await streamText(writer, "Of course — here's how to reach the team directly. For commercial or tender work, emailing drawings to our projects address is fastest.");
        writer.write({ type: "finish-step" });
        writer.write({ type: "finish" });
        return;
      }

      // 6. Area check
      if (/service|cover|area|suburb|do you (go|come|work)/.test(text) && (region || /\b[a-z]+\b/.test(text))) {
        await streamText(
          writer,
          region === "south-west"
            ? "Yes! Our **Bunbury depot** covers the South West — Australind, Eaton, Capel, Busselton, Dunsborough, Harvey and surrounds. Measures run Tuesdays and Thursdays."
            : "We cover **all of Perth metro** (Two Rocks to Mandurah, the hills to the coast) from Osborne Park, plus the **South West** from our Bunbury depot. Tell me your suburb and I'll confirm.",
        );
        writer.write({ type: "finish-step" });
        writer.write({ type: "finish" });
        return;
      }

      // 7. FAQ match (simple keyword overlap)
      const words = new Set(text.split(/\W+/).filter((w) => w.length > 3));
      const scored = faqs
        .map((f) => ({ f, score: f.question.toLowerCase().split(/\W+/).filter((w) => words.has(w)).length }))
        .sort((a, b) => b.score - a.score);
      if (scored[0]?.score >= 1) {
        await streamText(writer, `${scored[0].f.answer}\n\nAnything else you'd like to know?`);
        writer.write({ type: "finish-step" });
        writer.write({ type: "finish" });
        return;
      }

      // 8. Service info
      if (service) {
        const s = services.find((x) => x.slug === service)!;
        const p = pricing.find((x) => x.serviceSlug === service)?.options[0];
        await streamText(
          writer,
          `**${s.name}** — ${s.summary}\n\n${s.features.map((f) => `• ${f}`).join("\n")}\n\nInstalled from **${formatCurrency(p?.from ?? 0)}/${p?.unit}** (GST incl.) with a ${s.warranty.toLowerCase()}. Want a price for your length, or shall I book a free measure?`,
        );
        writer.write({ type: "finish-step" });
        writer.write({ type: "finish" });
        return;
      }

      // 9. Fallback
      await streamText(
        writer,
        `G'day! I'm the ${site.shortName} assistant. I can:\n\n• **Book a free measure & quote**\n• **Estimate a price** — e.g. "How much is 25m of Colorbond?"\n• Answer questions about pool compliance, dividing fences, warranty and areas\n\nWhat are you working on?`,
      );
      writer.write({ type: "finish-step" });
      writer.write({ type: "finish" });
    },
  });
}
