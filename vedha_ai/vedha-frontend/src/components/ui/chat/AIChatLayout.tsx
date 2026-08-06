import { useState, useRef, useEffect, type ReactNode } from "react";
import {
  Sparkles,
  Send,
  Plus,
  MessageSquare,
  Bot,
  User,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import Button from "@/components/ui/button/Button";
import PageHeader from "@/components/ui/layout/PageHeader";

export interface ChatMessage {
  id: string;
  sender: "user" | "ai" | "system";
  text: string;
  timestamp?: string;
}

export interface ConversationThread {
  id: string;
  title: string;
  timestamp: string;
}

export interface AIChatLayoutProps {
  title: string;
  subtitle: string;
  icon?: ReactNode;
  modelName?: string;
  threads?: ConversationThread[];
  activeThreadId?: string;
  onSelectThread?: (id: string) => void;
  onNewThread?: () => void;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  loading?: boolean;
  placeholder?: string;
  suggestedPrompts?: string[];
  rightPanelContent?: ReactNode;
}

export default function AIChatLayout({
  title,
  subtitle,
  icon,
  modelName = "Vedha AI GPT-4o Engine",
  threads = [
    { id: "t-1", title: "Distributed System Architecture", timestamp: "Today" },
    { id: "t-2", title: "ATS Resume Keyword Tuning", timestamp: "Yesterday" },
  ],
  activeThreadId = "t-1",
  onSelectThread,
  onNewThread,
  messages,
  onSendMessage,
  loading = false,
  placeholder = "Message Vedha AI Assistant...",
  suggestedPrompts = [
    "Synthesize my missing skills for Senior Backend roles",
    "Explain Redis cache invalidation strategies",
    "Generate 3 system design mock interview questions",
  ],
  rightPanelContent,
}: AIChatLayoutProps) {
  const [input, setInput] = useState("");
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function handleSend() {
    if (!input.trim() || loading) return;
    onSendMessage(input.trim());
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <DashboardLayout>
      <div className="w-full flex-1 flex flex-col min-h-0 space-y-6 font-sans">
        {/* Header */}
        <PageHeader
          title={title}
          subtitle={subtitle}
          icon={icon || <Sparkles size={22} className="text-[#3B82F6]" />}
          action={
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] text-xs font-semibold">
                <Sparkles size={14} className="animate-pulse" />
                {modelName}
              </div>
              <button
                onClick={() => setLeftOpen(!leftOpen)}
                className="p-2 rounded-xl bg-[#111827] border border-[#1F2937] text-[#94A3B8] hover:text-white transition"
                title="Toggle History Sidebar"
              >
                {leftOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
              </button>
              {rightPanelContent && (
                <button
                  onClick={() => setRightOpen(!rightOpen)}
                  className="p-2 rounded-xl bg-[#111827] border border-[#1F2937] text-[#94A3B8] hover:text-white transition"
                  title="Toggle Context Panel"
                >
                  {rightOpen ? <PanelRightClose size={18} /> : <PanelRightOpen size={18} />}
                </button>
              )}
            </div>
          }
        />

        {/* 3-PANEL WORKSPACE CONTAINER (PURE FLEXBOX FLEX-1 MIN-H-0) */}
        <div className="flex gap-6 flex-1 min-h-0 rounded-2xl bg-[#0B1220] border border-[#1F2937] overflow-hidden shadow-2xl relative">

          {/* LEFT PANEL: NAVIGATION & HISTORY (EXACT 280PX) */}
          {leftOpen && (
            <div className="w-[280px] bg-[#0F172A] border-r border-[#1F2937] p-4 flex flex-col justify-between shrink-0 transition-all">
              <div className="space-y-4">
                <Button
                  variant="primary"
                  onClick={onNewThread}
                  className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white flex items-center justify-center gap-2 text-xs font-semibold py-2.5"
                >
                  <Plus size={16} />
                  New Chat Session
                </Button>

                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider px-2">
                    Recent Conversations
                  </span>
                  <div className="space-y-1 overflow-y-auto max-h-[500px] pr-1">
                    {threads.map((t) => {
                      const isActive = t.id === activeThreadId;
                      return (
                        <button
                          key={t.id}
                          onClick={() => onSelectThread?.(t.id)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs text-left transition ${
                            isActive
                              ? "bg-[#3B82F6]/15 border border-[#3B82F6]/30 text-white font-semibold"
                              : "text-[#94A3B8] hover:bg-[#111827] hover:text-white"
                          }`}
                        >
                          <MessageSquare size={14} className={isActive ? "text-[#3B82F6]" : "text-[#94A3B8]"} />
                          <span className="truncate flex-1">{t.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#1F2937] text-[11px] text-[#94A3B8] flex items-center justify-between">
                <span>Vedha Assistant v2.4</span>
                <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
              </div>
            </div>
          )}

          {/* CENTER PANEL: CONVERSATION FLOW (MAX 900PX, FLEX-1) */}
          <div className="flex-1 flex flex-col justify-between bg-[#0B1220] overflow-hidden relative min-w-0">

            {/* MESSAGE FEED SCROLL AREA (MIN-H-0 FLEX-1, 20PX BETWEEN MESSAGES) */}
            <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-[20px]">
              <div className="w-full max-w-[900px] mx-auto space-y-[20px]">
                {messages.map((msg) => {
                  const isUser = msg.sender === "user";
                  const isSystem = msg.sender === "system";

                  if (isSystem) {
                    return (
                      <div key={msg.id} className="flex justify-center my-4">
                        <div className="px-4 py-1.5 rounded-full bg-[#111827] border border-[#1F2937] text-xs text-[#94A3B8] font-medium">
                          {msg.text}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-4 items-start ${isUser ? "flex-row-reverse" : "flex-row"}`}
                    >
                      {/* Avatar */}
                      <div
                        className={`h-9 w-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 shadow-md ${
                          isUser
                            ? "bg-[#3B82F6] text-white"
                            : "bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#8B5CF6]"
                        }`}
                      >
                        {isUser ? <User size={18} /> : <Bot size={18} />}
                      </div>

                      {/* Message Bubble (MAX 70% WIDTH, 18PX PADDING) */}
                      <div
                        className={`p-[18px] rounded-2xl max-w-[70%] text-sm leading-relaxed border shadow-xl ${
                          isUser
                            ? "bg-[#3B82F6] border-[#3B82F6] text-white rounded-tr-none"
                            : "bg-[#111827] border-[#1F2937] text-[#F1F5F9] rounded-tl-none space-y-2"
                        }`}
                      >
                        <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                        {msg.timestamp && (
                          <div
                            className={`text-[10px] mt-2 text-right ${
                              isUser ? "text-white/70" : "text-[#94A3B8]"
                            }`}
                          >
                            {msg.timestamp}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {loading && (
                  <div className="flex items-center gap-3 text-xs text-[#3B82F6] bg-[#111827] border border-[#1F2937] p-4 rounded-2xl max-w-[240px]">
                    <Sparkles size={16} className="animate-spin" />
                    <span>Reasoning response...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* SUGGESTED PROMPTS CHIPS */}
            {suggestedPrompts.length > 0 && messages.length <= 2 && (
              <div className="px-6 pb-2">
                <div className="w-full max-w-[900px] mx-auto flex flex-wrap gap-2">
                  {suggestedPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => onSendMessage(prompt)}
                      className="text-xs text-[#94A3B8] hover:text-white bg-[#111827] border border-[#1F2937] hover:border-[#3B82F6]/50 px-3.5 py-1.5 rounded-full transition"
                    >
                      💡 {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* PINNED STICKY INPUT COMPOSER (HEIGHT 64PX, PADDING 16PX, CENTERED SEND BUTTON) */}
            <div className="sticky bottom-0 bg-[#0B1220] border-t border-[#1F2937] p-4 z-10">
              <div className="w-full max-w-[900px] mx-auto">
                <div className="h-16 flex items-center gap-3 rounded-2xl bg-[#111827] border border-[#1F2937] px-4 shadow-2xl focus-within:border-[#3B82F6]/50 transition">
                  <textarea
                    ref={textareaRef}
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent text-sm text-white placeholder-[#94A3B8] outline-none resize-none py-1 leading-relaxed"
                  />

                  <Button
                    variant="primary"
                    onClick={handleSend}
                    disabled={!input.trim() || loading}
                    className="self-center bg-[#3B82F6] hover:bg-[#2563EB] text-white px-4 h-9 text-xs flex items-center justify-center gap-1.5 rounded-xl shrink-0"
                  >
                    <span>Send</span>
                    <Send size={14} />
                  </Button>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT PANEL: CONTEXT & CAREER INSIGHTS (EXACT 320PX) */}
          {rightOpen && rightPanelContent && (
            <div className="w-[320px] bg-[#0F172A] border-l border-[#1F2937] p-6 overflow-y-auto shrink-0 space-y-6 transition-all">
              {rightPanelContent}
            </div>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
}
