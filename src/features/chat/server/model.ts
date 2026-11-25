import "server-only";
import { anthropic } from "@ai-sdk/anthropic";

/**
 * The only file that knows which AI provider we use.
 * Swap to OpenAI etc. by installing its @ai-sdk/* package and returning that model here.
 */
export function getChatModel() {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  return anthropic(process.env.ANTHROPIC_MODEL ?? "claude-sonnet-5-5");
}

export const isDemoMode = () => !process.env.ANTHROPIC_API_KEY;
