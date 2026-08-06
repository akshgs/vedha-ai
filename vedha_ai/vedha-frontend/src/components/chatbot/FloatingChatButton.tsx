import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles, CheckSquare, Bell, Zap } from "lucide-react";
import { sendMentorMessage, type CareerMentoringMessage } from "@/services/career";
import { toast } from "sonner";

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "goals" | "alerts">("chat");
  const [messages, setMessages] = useState<CareerMentoringMessage[]>([
    { sender: "mentor", text: "👋 Welcome to your AI Universe! I am your career pilot. Ask me anything about your learning roadmap, resume feedback, or technical skill match." }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Local state for goals & reminders
  const [goals, setGoals] = useState([
    { id: 1, text: "Revise FastAPI Yield dependency injections", completed: false },
    { id: 2, text: "Practice Python technical mock interview session", completed: true },
    { id: 3, text: "Review resume compatibility for Google DeepMind role", completed: false },
  ]);

  const [reminders] = useState([
    { id: 1, text: "Next AI Mock Interview slot at 02:30 PM", time: "in 2 hours" },
    { id: 2, text: "Recommended: complete 'Vite + React Complete Guide'", time: "today" },
  ]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  async function handleSend() {
    if (!inputVal.trim() || sending) return;
    const userMsg = inputVal.trim();
    setInputVal("");
    setMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    setSending(true);

    try {
      // Map format for API call: sender: "user" | "mentor" -> service expects: sender: "user" | "mentor"
      const historyToSend = messages.map(m => ({
        sender: m.sender,
        text: m.text
      }));
      const reply = await sendMentorMessage(userMsg, historyToSend);
      setMessages(prev => [...prev, { sender: "mentor", text: reply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { sender: "mentor", text: "I'm having trouble reaching the main AI model network. Ensure container backend systems are functional." }]);
    } finally {
      setSending(false);
    }
  }

  function toggleGoal(id: number) {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
    toast.success("Ecosystem progress updated!");
  }

  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 1000 }}>
      {/* ── Chat Launcher Orb ────────────────────────────────── */}
      <motion.button
        onClick={() => setIsOpen(prev => !prev)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          width: 56, height: 56, borderRadius: "50%",
          background: "linear-gradient(135deg, #00d4ff, #a855f7)",
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "white", boxShadow: "0 0 25px rgba(0, 212, 255, 0.5)",
          position: "relative",
        }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={22} />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageSquare size={22} />
            </motion.div>
          )}
        </AnimatePresence>
        <span style={{
          position: "absolute", top: -2, right: -2,
          width: 12, height: 12, borderRadius: "50%",
          background: "#06ffd4", border: "2px solid #040714",
          boxShadow: "0 0 10px #06ffd4",
        }} />
      </motion.button>

      {/* ── AI Assistant Drawer ────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "absolute", bottom: 72, right: 0,
              width: 360, height: 500,
              borderRadius: 20, overflow: "hidden",
              background: "rgba(4, 7, 20, 0.96)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6)",
              display: "flex", flexDirection: "column",
            }}
          >
            {/* Header */}
            <div style={{
              padding: "16px", borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "linear-gradient(90deg, rgba(0,212,255,0.06), transparent)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: "linear-gradient(135deg, #00d4ff, #a855f7)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, fontWeight: 900,
                }}>V</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800 }}>Vedha AI Assistant</div>
                  <div style={{ fontSize: 9, color: "#06ffd4", fontWeight: 700, textTransform: "uppercase", trackingKey: "0.1em" } as any}>Copilot Active</div>
                </div>
              </div>
              <Sparkles size={16} style={{ color: "#ca8a04", animation: "pulse 2s infinite" }} />
            </div>

            {/* Navigation Tabs */}
            <div style={{
              display: "flex", borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
              background: "rgba(0,0,0,0.2)",
            }}>
              {[
                { id: "chat", label: "Mentor Chat", icon: MessageSquare },
                { id: "goals", label: "Goals", icon: CheckSquare },
                { id: "alerts", label: "Reminders", icon: Bell },
              ].map(tab => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    style={{
                      flex: 1, padding: "10px 0", border: "none", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      fontSize: 11, fontWeight: 700,
                      background: isSelected ? "rgba(255,255,255,0.03)" : "transparent",
                      color: isSelected ? "#00d4ff" : "rgba(255,255,255,0.4)",
                      borderBottom: isSelected ? "2px solid #00d4ff" : "2px solid transparent",
                      transition: "all 0.2s",
                    }}
                  >
                    <Icon size={12} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* View Body */}
            <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              
              {/* Tab 1: Chat */}
              {activeTab === "chat" && (
                <>
                  <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 12 }}>
                    {messages.map((m, idx) => {
                      const isBot = m.sender === "mentor";
                      return (
                        <div key={idx} style={{
                          alignSelf: isBot ? "flex-start" : "flex-end",
                          maxWidth: "85%",
                          borderRadius: 14,
                          padding: "10px 14px",
                          fontSize: 12,
                          lineHeight: 1.5,
                          background: isBot ? "rgba(255,255,255,0.04)" : "#00bcd41a",
                          border: isBot ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,188,212,0.25)",
                          color: isBot ? "rgba(255,255,255,0.85)" : "#00d4ff",
                        }}>
                          {m.text}
                        </div>
                      );
                    })}
                    {sending && (
                      <div style={{ alignSelf: "flex-start", color: "rgba(255,255,255,0.35)", fontSize: 10, fontStyle: "italic", marginLeft: 4 }}>
                        Vedha AI is thinking...
                      </div>
                    )}
                  </div>
                  {/* Chat Input */}
                  <div style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 8 }}>
                    <input
                      type="text"
                      value={inputVal}
                      onChange={e => setInputVal(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleSend()}
                      placeholder="Ask your AI Career Mentor..."
                      style={{
                        flex: 1, padding: "8px 12px", borderRadius: 10,
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        color: "white", fontSize: 12, outline: "none",
                      }}
                    />
                    <button
                      onClick={handleSend}
                      style={{
                        padding: "8px 12px", borderRadius: 10,
                        background: "rgba(0,212,255,0.15)",
                        border: "1px solid rgba(0,212,255,0.3)",
                        color: "#00d4ff", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >
                      <Send size={13} />
                    </button>
                  </div>
                </>
              )}

              {/* Tab 2: Goals */}
              {activeTab === "goals" && (
                <div style={{ overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Daily Learning Checklist</div>
                  {goals.map(g => (
                    <label key={g.id} style={{
                      display: "flex", gap: 10, alignItems: "flex-start",
                      padding: "12px", borderRadius: 12,
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.04)",
                      cursor: "pointer",
                    }}>
                      <input
                        type="checkbox"
                        checked={g.completed}
                        onChange={() => toggleGoal(g.id)}
                        style={{ marginTop: 2, accentColor: "#00d4ff" }}
                      />
                      <span style={{
                        fontSize: 12, color: g.completed ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.85)",
                        textDecoration: g.completed ? "line-through" : "none",
                        lineHeight: 1.4,
                      }}>{g.text}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* Tab 3: Reminders / Alerts */}
              {activeTab === "alerts" && (
                <div style={{ overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Ecosystem Reminders</div>
                  {reminders.map(r => (
                    <div key={r.id} style={{
                      padding: "12px", borderRadius: 12,
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.04)",
                      display: "flex", gap: 10, alignItems: "center",
                    }}>
                      <Zap size={14} style={{ color: "#ca8a04", flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", lineHeight: 1.4 }}>{r.text}</div>
                        <div style={{ fontSize: 10, color: "#ca8a04", marginTop: 2 }}>{r.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
