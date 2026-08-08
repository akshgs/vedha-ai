import { useEffect, useState, useRef } from "react";
import { Circle } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/layouts/DashboardLayout";
import Card from "@/components/ui/card/Card";
import ConversationList from "@/components/ui/collaboration/ConversationList";
import MessageBubble from "@/components/ui/collaboration/MessageBubble";
import MessageComposer from "@/components/ui/collaboration/MessageComposer";
import { useChatSocket } from "@/hooks/useChatSocket";
import { getConversations, type Conversation } from "@/services/messages";
import PageHeader from "@/components/ui/layout/PageHeader";

export default function Messages() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState("");
  const [loading, setLoading] = useState(true);

  // Hook chat messages socket connection
  const { messages, status, sendSocketMessage, setMessages } = useChatSocket(selectedConversationId);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadConversations() {
      try {
        setLoading(true);
        const data = await getConversations();
        setConversations(data);
        
        const params = new URLSearchParams(window.location.search);
        const queryConvId = params.get("conversationId");
        
        if (queryConvId && data.some(c => c.id === queryConvId)) {
          setSelectedConversationId(queryConvId);
        } else if (data.length > 0) {
          setSelectedConversationId(data[0].id);
        }
      } catch {
        toast.error("Failed to query chats.");
      } finally {
        setLoading(false);
      }
    }
    void loadConversations();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const activeConversation = conversations.find((c) => c.id === selectedConversationId);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl bg-slate-905 border border-slate-800 p-8 text-center text-slate-500 animate-pulse">
          Opening secure chat buffers...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        
        <PageHeader
          title="Vedha Messaging Hub"
          subtitle="Real-time direct messaging, peer code exchange, and mentorship channel threads."
        />

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Left contacts list */}
          <div className="lg:col-span-1 space-y-4">
            <Card variant="glass" className="p-4 flex flex-col h-[500px]">
              <div className="border-b border-slate-800 pb-3 mb-3 text-xs font-bold text-slate-455 uppercase tracking-wider select-none">
                Inbox Conversations
              </div>
              <ConversationList
                conversations={conversations}
                selectedId={selectedConversationId}
                onSelect={(id) => {
                  setSelectedConversationId(id);
                  setMessages([]); // Clear previous socket message buffer
                }}
              />
            </Card>
          </div>

          {/* Right chat logs feed */}
          <div className="lg:col-span-3">
            {activeConversation ? (
              <Card variant="glass" className="flex flex-col h-[500px] overflow-hidden">
                {/* Header */}
                <div className="border-b border-slate-800 p-4 bg-slate-950/40 flex justify-between items-center shrink-0 select-none">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 font-bold text-xs">
                      {activeConversation.recipient.name[0]}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1">
                        {activeConversation.recipient.name}
                        <Circle size={8} className="fill-current text-emerald-500 border-none shrink-0" />
                      </h4>
                      <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mt-0.5">
                        Presence: {activeConversation.recipient.presence}
                      </p>
                    </div>
                  </div>
                  <span className="text-[9px] bg-slate-900 border border-slate-850 px-2 py-0.5 rounded text-cyan-500 font-extrabold uppercase select-none">
                    Socket Status: {status}
                  </span>
                </div>

                {/* Messages feed */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 bg-slate-950/20">
                  {messages.map((msg) => (
                    <MessageBubble
                      key={msg.id}
                      message={msg}
                      isMe={msg.senderId === (localStorage.getItem("user_id") ?? "current-user")}
                    />
                  ))}
                  <div ref={bottomRef} />
                </div>

                {/* Composer footer */}
                <div className="border-t border-slate-850 p-3 bg-slate-950/40 shrink-0">
                  <MessageComposer onSend={(text) => sendSocketMessage(text)} />
                </div>
              </Card>
            ) : (
              <Card variant="glass" className="h-[500px] flex items-center justify-center text-slate-500 italic text-xs select-none">
                Select a conversation contact from the list sidebar to read direct messages.
              </Card>
            )}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
