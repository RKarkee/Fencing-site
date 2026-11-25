import type { UIDataTypes, UIMessage } from "ai";
import type { ChatTools } from "./server/tools";

/** Fully typed chat message — tool parts are typed from the server tool definitions */
export type ChatUIMessage = UIMessage<never, UIDataTypes, ChatTools>;
export type ChatToolName = keyof ChatTools;
export type BookingFormOutput = ChatTools["showBookingForm"]["output"];
export type EstimateOutput = ChatTools["estimatePrice"]["output"];
export type AvailabilityOutput = ChatTools["checkAvailability"]["output"];
export type HandoffOutput = ChatTools["handoffToHuman"]["output"];
