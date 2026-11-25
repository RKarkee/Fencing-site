"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { ChatWidgetProvider } from "@/features/chat/hooks/use-chat-widget";

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  const create = () => new QueryClient({ defaultOptions: { queries: { staleTime: 60_000, refetchOnWindowFocus: false } } });
  if (typeof window === "undefined") return create();
  browserQueryClient ??= create();
  return browserQueryClient;
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={getQueryClient()}>
      <ChatWidgetProvider>{children}</ChatWidgetProvider>
    </QueryClientProvider>
  );
}
