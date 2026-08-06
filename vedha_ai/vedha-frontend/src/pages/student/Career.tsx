import { useState, useEffect } from "react";
import {
  Sparkles,
  Award,
  AlertTriangle,
  TrendingUp,
  FileText,
  BookOpen,
  DollarSign,
  Briefcase,
} from "lucide-react";
import { toast } from "sonner";
import Card from "@/components/ui/card/Card";
import AIChatLayout, { type ChatMessage } from "@/components/ui/chat/AIChatLayout";
import { sendMentorMessage } from "@/services/career";
import { queryMatchedMentors, type Mentor } from "@/services/mentorship";

export default function Career() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      sender: "ai",
      text: "Welcome to your AI Career Intelligence Workspace! Ask me about target role roadmaps, ATS resume optimization, missing skills, or salary predictions.",
      timestamp: "Just now",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [matchedMentors, setMatchedMentors] = useState<Mentor[]>([]);

  useEffect(() => {
    async function loadMentors() {
      try {
        const data = await queryMatchedMentors();
        setMatchedMentors(data);
      } catch (err) {
        console.error(err);
      }
    }
    void loadMentors();
  }, []);

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
      const response = await sendMentorMessage(text, []);
      const aiMsg: ChatMessage = {
        id: Math.random().toString(36).substring(7),
        sender: "ai",
        text: response,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      toast.error("Failed to query AI Career Mentor.");
    } finally {
      setLoading(false);
    }
  }

  // Right panel context content
  const rightPanelContent = (
    <div className="space-y-6">
      {/* Advisor Quick Prompts */}
      <Card variant="glass" className="p-5 bg-[#111827] border border-[#1F2937] space-y-3">
        <div className="flex items-center gap-2 border-b border-[#1F2937] pb-3">
          <Sparkles size={16} className="text-[#3B82F6]" />
          <h4 className="font-bold text-white text-xs uppercase tracking-wider">Ask Career Mentor...</h4>
        </div>
        <div className="space-y-2 text-xs text-[#94A3B8]">
          <button
            onClick={() => handleSendMessage("What courses should I take next to become a Senior Backend Engineer?")}
            className="w-full text-left p-2 rounded-xl bg-[#0F172A] border border-[#1F2937] hover:border-[#3B82F6]/50 hover:text-white transition"
          >
            💡 "What courses should I take next?"
          </button>
          <button
            onClick={() => handleSendMessage("What is the average salary expectation for Full Stack roles in Bangalore?")}
            className="w-full text-left p-2 rounded-xl bg-[#0F172A] border border-[#1F2937] hover:border-[#3B82F6]/50 hover:text-white transition"
          >
            💡 "Average salary for Full Stack roles?"
          </button>
          <button
            onClick={() => handleSendMessage("Synthesize my ATS resume keyword gaps for Top Tech companies.")}
            className="w-full text-left p-2 rounded-xl bg-[#0F172A] border border-[#1F2937] hover:border-[#3B82F6]/50 hover:text-white transition"
          >
            💡 "Synthesize my resume gaps"
          </button>
        </div>
      </Card>

      {/* Matched Mentors Widget */}
      <Card variant="glass" className="p-5 bg-[#111827] border border-[#1F2937] space-y-4">
        <div className="flex items-center gap-2 border-b border-[#1F2937] pb-3">
          <Briefcase size={16} className="text-[#8B5CF6]" />
          <h4 className="font-bold text-white text-xs uppercase tracking-wider">Ecosystem Mentors</h4>
        </div>
        <div className="space-y-3">
          {matchedMentors.slice(0, 3).map((mentor) => (
            <div key={mentor.id} className="p-3 rounded-xl bg-[#0F172A] border border-[#1F2937] space-y-1.5">
              <div className="flex justify-between items-center">
                <h5 className="font-bold text-white text-xs">{mentor.name}</h5>
                <span className="text-[10px] font-bold text-[#3B82F6] bg-[#3B82F6]/10 px-2 py-0.5 rounded">
                  ★ {mentor.rating}
                </span>
              </div>
              <p className="text-[11px] text-[#94A3B8]">{mentor.role} @ {mentor.company}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  return (
    <div className="w-full max-w-[1440px] mx-auto space-y-6">
      
      {/* 1. TOP CARDS SECTION: [Career Score] [Skill Gap] [Market Demand] */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Career Score Card */}
        <Card variant="glass" className="p-6 bg-[#111827] border border-[#1F2937] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Career Score</span>
            <Award className="text-[#3B82F6]" size={20} />
          </div>
          <p className="text-3xl font-black text-white">88%</p>
          <p className="text-xs text-[#22C55E] font-medium">+3% readiness index this month</p>
        </Card>

        {/* Skill Gap Card */}
        <Card variant="glass" className="p-6 bg-[#111827] border border-[#1F2937] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Skill Gap</span>
            <AlertTriangle className="text-[#F59E0B]" size={20} />
          </div>
          <p className="text-3xl font-black text-white">3 Skills</p>
          <p className="text-xs text-[#F59E0B] font-medium">Missing: FastAPI, Docker, Kubernetes</p>
        </Card>

        {/* Market Demand Card */}
        <Card variant="glass" className="p-6 bg-[#111827] border border-[#1F2937] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Market Demand</span>
            <TrendingUp className="text-[#8B5CF6]" size={20} />
          </div>
          <p className="text-3xl font-black text-white">+24% YoY</p>
          <p className="text-xs text-[#8B5CF6] font-medium">High Recruiter Hiring Volume</p>
        </Card>
      </div>

      {/* 2. AI CAREER INSIGHTS SECTION */}
      <Card variant="glass" className="p-6 bg-[#111827] border border-[#1F2937] space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-[#1F2937] pb-3 flex items-center gap-2">
          <Sparkles className="text-[#3B82F6]" size={18} />
          AI Career Insights
        </h3>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Resume Strength */}
          <div className="p-4 rounded-xl bg-[#0F172A] border border-[#1F2937] space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <FileText size={16} className="text-[#3B82F6]" />
              Resume Strength
            </div>
            <p className="text-xl font-bold text-white">85 / 100</p>
            <p className="text-[11px] text-[#94A3B8]">Strong ATS keyword alignment</p>
          </div>

          {/* Missing Skills */}
          <div className="p-4 rounded-xl bg-[#0F172A] border border-[#1F2937] space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <AlertTriangle size={16} className="text-[#F59E0B]" />
              Missing Skills
            </div>
            <p className="text-xs font-bold text-white">FastAPI • Docker • K8s</p>
            <p className="text-[11px] text-[#94A3B8]">Required for Senior Backend role</p>
          </div>

          {/* Salary Prediction */}
          <div className="p-4 rounded-xl bg-[#0F172A] border border-[#1F2937] space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <DollarSign size={16} className="text-[#22C55E]" />
              Salary Prediction
            </div>
            <p className="text-xl font-bold text-white">₹18 - ₹24 LPA</p>
            <p className="text-[11px] text-[#94A3B8]">India Tier-1 Tech Curve</p>
          </div>

          {/* Recommended Learning */}
          <div className="p-4 rounded-xl bg-[#0F172A] border border-[#1F2937] space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <BookOpen size={16} className="text-[#8B5CF6]" />
              Recommended Learning
            </div>
            <p className="text-xs font-bold text-white">Distributed Architecture</p>
            <p className="text-[11px] text-[#94A3B8]">FastAPI & Redis Caching Module</p>
          </div>
        </div>
      </Card>

      {/* 3. INTERACTIVE CHAT WORKSPACE SECTION */}
      <AIChatLayout
        title="AI Career Intelligence Workspace"
        subtitle="Consult the AI Career Mentor to analyze skill gaps, simulate salary trajectory, and optimize ATS resume fit."
        icon={<Sparkles size={22} className="text-[#3B82F6]" />}
        modelName="Vedha AI Career Intelligence LLM"
        messages={messages}
        onSendMessage={handleSendMessage}
        loading={loading}
        placeholder="Ask Career Mentor..."
        suggestedPrompts={[
          "Synthesize my missing skills for Senior Backend roles",
          "What courses should I take next?",
          "Explain Redis cache invalidation strategies",
        ]}
        rightPanelContent={rightPanelContent}
      />
    </div>
  );
}
