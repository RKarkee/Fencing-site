"use client";

import { ArrowUp, MessageCircle, RotateCcw, Square, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { LogoMark } from "@/components/layout/logo";
import { cn } from "@/lib/utils";
import { useChatMode } from "../hooks/use-chat-mode";
import { useChatWidget } from "../hooks/use-chat-widget";
import { ChatMessages } from "./chat-messages";

const SUGGESTIONS = [
  "Book a free measure",
  "How much is 30m of Colorbond?",
  "Do you service Bunbury?",
  "Will my pool fence pass inspection?",
];

type Props = { businessName: string; services: { slug: string; name: string }[] };

export function ChatWidget({ businessName, services }: Props) {
  const { isOpen, toggleChat, closeChat, chat } = useChatWidget();
  const { messages, sendMessage, status, stop, error, regenerate, setMessages } = chat;
  const { data: mode } = useChatMode(isOpen);
  const [input, setInput] = useState("");

  const busy = status === "submitted" || status === "streaming";
  const lastIsUser = messages.at(-1)?.role === "user";

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    void sendMessage({ text: trimmed });
    setInput("");
  };
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };

  return (
    <>
      {/* Launcher (desktop — mobile uses the bottom action bar) */}
      <button
        type="button"
        onClick={toggleChat}
        aria-label={isOpen ? "Close chat" : "Chat with us"}
        aria-expanded={isOpen}
        className={cn(
          "fixed bottom-6 right-6 z-50 hidden items-center gap-2.5 rounded-full bg-forest-800 py-3 pl-3 pr-5 font-semibold text-white shadow-lift transition-all hover:-translate-y-0.5 hover:bg-forest-700 lg:flex",
          isOpen && "pr-3",
        )}
      >
        <span className="relative grid size-9 place-items-center rounded-full bg-ochre-500">
          {isOpen ? <X className="size-5" /> : <MessageCircle className="size-5" />}
          {!isOpen && <span className="absolute -right-0.5 -top-0.5 size-3 rounded-full border-2 border-forest-800 bg-emerald-400" aria-hidden />}
        </span>
        {!isOpen && <span>Chat & book</span>}
      </button>

      {isOpen && (
        <section
          role="dialog"
          aria-label={`${businessName} assistant`}
          className="fixed inset-0 z-50 flex animate-pop flex-col overflow-hidden bg-sand-50 sm:inset-auto sm:bottom-24 sm:right-6 sm:h-[min(680px,calc(100dvh-8rem))] sm:w-[410px] sm:rounded-3xl sm:border sm:border-ink/10 sm:shadow-lift"
        >
          {/* Header */}
          <header className="pickets flex items-center gap-3 bg-forest-900 px-4 py-3.5 text-white">
            <LogoMark className="size-10" />
            <div className="flex-1">
              <p className="font-display font-bold leading-tight">{businessName} Assistant</p>
              <p className="flex items-center gap-1.5 text-xs text-white/65">
                <span className="size-1.5 rounded-full bg-emerald-400" aria-hidden />
                {mode === "demo" ? "Demo mode · no API key set" : "Online · books measures instantly"}
              </p>
            </div>
            {messages.length > 0 && (
              <button
                type="button"
                onClick={() => setMessages([])}
                className="grid size-9 place-items-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
                aria-label="Start a new conversation"
                title="New conversation"
              >
                <RotateCcw className="size-4" />
              </button>
            )}
            <button type="button" onClick={closeChat} className="grid size-9 place-items-center rounded-full hover:bg-white/10" aria-label="Close chat">
              <X className="size-5" />
            </button>
          </header>

          {/* Messages — column-reverse keeps the view pinned to the newest message without scroll effects */}
          <div className="flex flex-1 flex-col-reverse overflow-y-auto px-4 py-5">
            <div>
              {messages.length === 0 ? (
                <div className="animate-fade-up">
                  <div className="flex gap-2.5">
                    <LogoMark className="mt-0.5 size-7 shrink-0" />
                    <div className="rounded-2xl rounded-tl-md bg-white px-4 py-3 text-[14.5px] leading-relaxed shadow-soft">
                      G&apos;day! 👋 I can price your fence, answer questions, and <strong>book a free measure & quote</strong> in under a minute. What can I help with?
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 pl-9">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => send(s)}
                        className="rounded-full border border-forest-700/20 bg-white px-3.5 py-2 text-[13px] font-semibold text-forest-800 transition hover:border-forest-700 hover:bg-sage-100"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <ChatMessages messages={messages} services={services} isThinking={status === "submitted" && lastIsUser} />
              )}

              {error && (
                <div className="mt-4 rounded-2xl bg-red-50 p-3 text-sm text-red-700" role="alert">
                  Sorry, something went wrong.{" "}
                  <button type="button" onClick={() => regenerate()} className="font-semibold underline">
                    Try again
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Composer */}
          <form onSubmit={onSubmit} className="border-t border-ink/8 bg-white p-3">
            <div className="flex items-end gap-2 rounded-2xl border border-ink/10 bg-sand-50 p-1.5 focus-within:border-forest-600 focus-within:ring-4 focus-within:ring-forest-600/10">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                rows={1}
                maxLength={1500}
                placeholder="Ask a question or book a measure…"
                className="max-h-32 min-h-10 flex-1 resize-none bg-transparent px-2.5 py-2 text-[15px] outline-none placeholder:text-ink/40"
                aria-label="Message"
              />
              {busy ? (
                <button type="button" onClick={() => stop()} className="grid size-10 place-items-center rounded-xl bg-ink text-white" aria-label="Stop">
                  <Square className="size-3.5 fill-current" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="grid size-10 place-items-center rounded-xl bg-ochre-500 text-white transition hover:bg-ochre-600 disabled:bg-ink/15"
                  aria-label="Send"
                >
                  <ArrowUp className="size-5" />
                </button>
              )}
            </div>
            <p className="mt-2 text-center text-[11px] text-muted">AI assistant · prices are indicative · we never ask for payment details</p>
          </form>
        </section>
      )}
    </>
  );
}
