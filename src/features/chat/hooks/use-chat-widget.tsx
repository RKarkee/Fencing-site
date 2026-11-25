"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from "ai";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { ChatUIMessage } from "../types";

type ChatApi = ReturnType<typeof useChat<ChatUIMessage>>;

type ChatWidgetState = {
  isOpen: boolean;
  openChat: (prompt?: string) => void;
  closeChat: () => void;
  toggleChat: () => void;
  chat: ChatApi;
};

const ChatWidgetContext = createContext<ChatWidgetState | null>(null);
const transport = new DefaultChatTransport<ChatUIMessage>({ api: "/api/chat" });

/**
 * Owns the single chat session for the whole site, so any CTA can open the assistant
 * with a prompt ("Book a free measure") and the conversation survives page navigation.
 */
export function ChatWidgetProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const chat = useChat<ChatUIMessage>({
    id: "saltbush-assistant", // fixed id: avoids random ids during prerender
    transport,
    // After the booking card returns its result, let the assistant respond automatically
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
  });
  const { sendMessage, status } = chat;

  const openChat = useCallback(
    (prompt?: string) => {
      setIsOpen(true);
      if (prompt && (status === "ready" || status === "error")) void sendMessage({ text: prompt });
    },
    [sendMessage, status],
  );
  const closeChat = useCallback(() => setIsOpen(false), []);
  const toggleChat = useCallback(() => setIsOpen((v) => !v), []);

  const value = useMemo(() => ({ isOpen, openChat, closeChat, toggleChat, chat }), [isOpen, openChat, closeChat, toggleChat, chat]);

  return <ChatWidgetContext.Provider value={value}>{children}</ChatWidgetContext.Provider>;
}

export function useChatWidget() {
  const ctx = useContext(ChatWidgetContext);
  if (!ctx) throw new Error("useChatWidget must be used inside <ChatWidgetProvider>");
  return ctx;
}
