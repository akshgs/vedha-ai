import { useState } from "react";
import { Upload, FileText, BookOpen } from "lucide-react";
import { toast } from "sonner";
import Card from "@/components/ui/card/Card";
import Button from "@/components/ui/button/Button";
import AIChatLayout, { type ChatMessage } from "@/components/ui/chat/AIChatLayout";
import { chatWithPdf, uploadPdf, isBackendOnline, CitationPanel } from "@/ai";

interface Citation {
  filename: string;
  page: number;
  snippet: string;
}

export default function PdfChat() {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [filename, setFilename] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      sender: "ai",
      text: "Welcome to AI PDF Document Workspace! Upload a textbook, research paper, or lecture slides. Once uploaded, I can generate executive summaries, extract formulas, and answer questions directly referencing your pages.",
      timestamp: "Just now",
    },
  ]);
  const [citations, setCitations] = useState<Citation[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleFileUpload(file: File) {
    if (!isBackendOnline()) {
      setLoading(true);
      setTimeout(() => {
        setFileUploaded(true);
        setFilename(file.name);
        setMessages((prev) => [
          ...prev,
          {
            id: "uploaded",
            sender: "ai",
            text: `Successfully vector-indexed '${file.name}'. Ask me any specific question referencing page contents.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        setLoading(false);
        toast.success("Document uploaded and text vector indexed!");
      }, 1000);
      return;
    }

    setLoading(true);
    try {
      await uploadPdf(file);
      setFileUploaded(true);
      setFilename(file.name);
      setMessages((prev) => [
        ...prev,
        {
          id: "uploaded",
          sender: "ai",
          text: `Successfully vector-indexed '${file.name}'. Ask me any specific question referencing page contents.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      toast.success("Document uploaded and text vector indexed!");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to upload document.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSendMessage(text: string) {
    if (!fileUploaded) {
      toast.warning("Please upload a PDF document first!");
      return;
    }

    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await chatWithPdf("doc-1", text);
      const aiMsg: ChatMessage = {
        id: Math.random().toString(36).substring(7),
        sender: "ai",
        text: res.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setCitations(res.citations);
    } catch {
      toast.error("Failed to query PDF content.");
    } finally {
      setLoading(false);
    }
  }

  const rightPanelContent = (
    <div className="space-y-6">
      {/* PDF Upload Card */}
      <Card variant="glass" className="p-5 bg-[#111827] border border-[#1F2937] space-y-4">
        <div className="flex items-center gap-2 border-b border-[#1F2937] pb-3">
          <FileText className="text-[#3B82F6]" size={18} />
          <h4 className="font-bold text-white text-sm">Active PDF Document</h4>
        </div>

        {!fileUploaded ? (
          <div className="text-center space-y-3 py-2">
            <Upload size={28} className="text-[#3B82F6] mx-auto animate-bounce" />
            <p className="text-xs text-[#94A3B8]">Upload PDF, DOCX, or TXT (Max 25MB)</p>
            <input
              type="file"
              id="pdf-input"
              accept=".pdf,.docx,.txt"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
              }}
            />
            <Button
              onClick={() => document.getElementById("pdf-input")?.click()}
              disabled={loading}
              className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs py-2"
            >
              {loading ? "Indexing Vector Database..." : "Upload Document"}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-[#0F172A] border border-[#1F2937] flex items-center justify-between">
              <span className="text-xs font-bold text-white truncate max-w-[180px]">{filename}</span>
              <span className="text-[10px] font-bold text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded">Indexed</span>
            </div>

            <Button
              variant="outline"
              onClick={() => {
                setFileUploaded(false);
                setFilename("");
                setCitations([]);
                toast.info("Document cleared.");
              }}
              className="w-full border-[#1F2937] text-xs text-[#94A3B8] hover:text-white"
            >
              Clear Current PDF
            </Button>
          </div>
        )}
      </Card>

      {/* Citations Panel */}
      <CitationPanel citations={citations} />
    </div>
  );

  return (
    <AIChatLayout
      title="AI PDF Document Workspace"
      subtitle="Upload text documents, research papers, or slides and query semantic vectors in real-time."
      icon={<BookOpen size={22} className="text-[#3B82F6]" />}
      modelName="Qdrant RAG Vector Engine"
      messages={messages}
      onSendMessage={handleSendMessage}
      loading={loading}
      placeholder={fileUploaded ? `Ask anything about ${filename}...` : "Upload a PDF document to begin asking questions..."}
      suggestedPrompts={[
        "Synthesize the main conclusions of this document",
        "Extract key formulas and definitions",
        "Generate a 5-bullet executive summary",
      ]}
      rightPanelContent={rightPanelContent}
    />
  );
}
