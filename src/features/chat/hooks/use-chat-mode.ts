"use client";

import { useQuery } from "@tanstack/react-query";

/** "ai" when an API key is configured on the server, otherwise "demo" */
export function useChatMode(enabled: boolean) {
  return useQuery({
    queryKey: ["chat-mode"],
    queryFn: async () => {
      const res = await fetch("/api/chat");
      return ((await res.json()) as { mode: "ai" | "demo" }).mode;
    },
    enabled,
    staleTime: Infinity,
  });
}
