import { useState } from "react";
import { BookOpen, Quote, Bookmark, Sparkles } from "lucide-react";
import { toast } from "sonner";
import Card from "@/components/ui/card/Card";
import AIChatLayout, { type ChatMessage } from "@/components/ui/chat/AIChatLayout";
import { queryResearchPapers, type ResearchPaper } from "@/ai";

export default function ResearchAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      sender: "ai",
      text: "Welcome to AI Research Assistant! Query academic databases, extract semantic insights from arXiv/IEEE papers, and synthesize literature reviews.",
      timestamp: "Just now",
    },
  ]);
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSendMessage(text: string) {
    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await queryResearchPapers(text);
      setPapers(res.papers);

      const aiMsg: ChatMessage = {
        id: Math.random().toString(36).substring(7),
        sender: "ai",
        text: res.summaryMarkdown,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      toast.success("Literature synthesis completed!");
    } catch {
      toast.error("Failed to query research database.");
    } finally {
      setLoading(false);
    }
  }

  const rightPanelContent = (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b border-[#1F2937] pb-3">
        <Sparkles size={18} className="text-[#8B5CF6]" />
        <h4 className="font-bold text-white text-sm">Matched Academic Literature</h4>
      </div>

      {papers.length === 0 ? (
        <div className="text-center text-xs text-[#94A3B8] py-8">
          No papers retrieved yet. Send a research topic query in chat to inspect citations.
        </div>
      ) : (
        <div className="space-y-4">
          {papers.map((paper) => (
            <Card key={paper.id} variant="default" className="p-4 bg-[#111827] border border-[#1F2937] space-y-3 shadow-xl">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <h5 className="font-bold text-white text-xs hover:text-[#3B82F6] transition cursor-pointer leading-snug">
                    {paper.title}
                  </h5>
                  <p className="text-[10px] text-[#94A3B8] mt-1">
                    {paper.authors} • {paper.year}
                  </p>
                </div>
                <span className="text-[9px] bg-[#0F172A] border border-[#1F2937] px-2 py-0.5 rounded text-[#3B82F6] font-bold flex items-center gap-1 shrink-0">
                  <Quote size={10} />
                  {paper.citationCount}
                </span>
              </div>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed line-clamp-3">
                {paper.abstract}
              </p>
              <button
                onClick={() => toast.success("Paper reference bookmarked!")}
                className="text-[10px] text-[#3B82F6] hover:underline flex items-center gap-1 font-semibold"
              >
                <Bookmark size={10} />
                Save Reference
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <AIChatLayout
      title="AI Research Assistant"
      subtitle="Search academic papers, extract semantic literature trends, and synthesize research outlines."
      icon={<BookOpen size={22} className="text-[#8B5CF6]" />}
      modelName="Semantic Scholar & arXiv AI Synthesis"
      messages={messages}
      onSendMessage={handleSendMessage}
      loading={loading}
      placeholder="Ask about transformer scaling laws, Redis caching, or attention mechanism optimization..."
      suggestedPrompts={[
        "Synthesize recent papers on Low-Rank Adaptation (LoRA)",
        "Explain transformer self-attention complexity vs Mamba architecture",
        "Compare vector DB indexing strategies (HNSW vs IVF)",
      ]}
      rightPanelContent={rightPanelContent}
    />
  );
}
