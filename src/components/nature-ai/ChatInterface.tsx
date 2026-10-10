"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChatMessage } from "@/types";
import { db } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";
import { getAIProvider } from "@/lib/ai/provider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Send,
  Trash2,
  Bot,
  User,
  Sparkles,
  WifiOff,
  Cpu,
  Info,
  Compass,
  Trees,
} from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

export function ChatInterface() {
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [modelName, setModelName] = useState("Local AI");
  const [isOfflineEngine, setIsOfflineEngine] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const history = useLiveQuery(async () => {
    return await db.chatHistory.orderBy("timestamp").toArray();
  }, []);

  useEffect(() => {
    async function fetchModel() {
      try {
        const provider = await getAIProvider();
        const health = await provider.checkHealth();
        setModelName(health.activeModel);
        setIsOfflineEngine(health.status !== "online");
      } catch {
        setModelName("Local Heuristics");
        setIsOfflineEngine(true);
      }
    }
    fetchModel();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history?.length]);

  const quickPrompts = [
    "What birds might I see in this area?",
    "How do I identify Poison Ivy vs Virginia Creeper?",
    "What should I look for on a 20-minute morning walk?",
    "Explain this woodland ecosystem in simple language.",
    "Which native flowers attract wild bumblebees?",
  ];

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isSending) return;

    setInputText("");
    setIsSending(true);

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    await db.chatHistory.add(userMsg);

    try {
      const provider = await getAIProvider();

      const messagesForProvider = (history || [])
        .slice(-6)
        .concat(userMsg)
        .map((m) => ({ role: m.role, content: m.content }));

      const reply = await provider.chat(messagesForProvider);

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: reply,
        timestamp: Date.now(),
        model: modelName,
        isOfflineFallback: isOfflineEngine,
      };

      await db.chatHistory.add(assistantMsg);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      const fallbackMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: `🌿 Local offline response: While checking the field guide, here is a helpful principle: observe living species respectfully, keep phones stored in your pocket during nature immersion, and record notes upon return. (${msg})`,
        timestamp: Date.now(),
        model: "Local Offline Fallback",
        isOfflineFallback: true,
      };
      await db.chatHistory.add(fallbackMsg);
    } finally {
      setIsSending(false);
    }
  };

  const handleClearHistory = async () => {
    if (confirm("Clear local chat history?")) {
      await db.chatHistory.clear();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-4xl mx-auto rounded-3xl border border-nature-200 dark:border-nature-800 bg-white/70 dark:bg-nature-950/70 backdrop-blur-md shadow-nature overflow-hidden">
      {/* Header bar */}
      <div className="px-5 py-3.5 border-b border-nature-200 dark:border-nature-800 bg-nature-50/70 dark:bg-nature-900/40 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-forest-light text-white flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-forest dark:text-nature-100 flex items-center gap-2">
              <span>Nature AI Field Assistant</span>
              <Badge variant={isOfflineEngine ? "amber" : "forest"}>
                {isOfflineEngine ? (
                  <span className="flex items-center gap-1">
                    <WifiOff className="w-3 h-3" />
                    Offline Heuristics
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-emerald-500" />
                    {modelName}
                  </span>
                )}
              </Badge>
            </h3>
            <p className="text-[11px] text-nature-600 dark:text-nature-400">
              Private, local open-source intelligence. Real data stays on device.
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearHistory}
          className="text-xs text-nature-600 hover:text-rose-600 p-2"
          title="Clear chat history"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {(!history || history.length === 0) && (
          <div className="py-10 text-center max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-forest/10 dark:bg-nature-800 text-forest-light dark:text-emerald-300 mx-auto flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-forest dark:text-nature-100">
                Ask about the living world
              </h4>
              <p className="text-xs text-nature-600 dark:text-nature-400 mt-1 leading-relaxed">
                TerraQuest AI answers questions about local fauna, flora, trail navigation, garden tips, and mindful outdoor immersion.
              </p>
            </div>

            {/* Quick Prompts */}
            <div className="flex flex-wrap gap-2 justify-center pt-2">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="text-xs py-1.5 px-3 rounded-full border border-nature-200 dark:border-nature-800 bg-white dark:bg-nature-900 text-nature-800 dark:text-nature-200 hover:border-forest-light hover:bg-nature-50 transition-all text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {history?.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-forest-light text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <Trees className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed space-y-1.5 ${
                  isUser
                    ? "bg-forest-light text-white rounded-tr-none shadow-nature"
                    : "bg-white dark:bg-nature-900 border border-nature-200/80 dark:border-nature-800 text-nature-900 dark:text-nature-100 rounded-tl-none shadow-sm"
                }`}
              >
                <div className="whitespace-pre-line">{msg.content}</div>
                <div
                  className={`text-[10px] flex items-center gap-2 pt-1 ${
                    isUser ? "text-emerald-100/70 justify-end" : "text-nature-500 justify-start"
                  }`}
                >
                  <span>{formatRelativeTime(msg.timestamp)}</span>
                  {msg.model && <span>• {msg.model}</span>}
                </div>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isSending && (
          <div className="flex gap-3 items-center text-xs text-nature-500 italic p-2">
            <span className="w-2 h-2 rounded-full bg-forest-light animate-ping" />
            <span>Consulting local nature model...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-3.5 border-t border-nature-200 dark:border-nature-800 bg-white/90 dark:bg-nature-950/90">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            placeholder="Ask about birds, plants, tracks, or outdoor trails..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isSending}
            className="flex-1 rounded-2xl border border-nature-200 dark:border-nature-800 px-4 py-2.5 text-sm bg-nature-50/50 dark:bg-nature-900/50 text-nature-900 dark:text-nature-100 focus:outline-none focus:ring-2 focus:ring-forest-light"
          />
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isSending || !inputText.trim()}
            className="rounded-2xl px-5 bg-forest hover:bg-forest-dark"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
