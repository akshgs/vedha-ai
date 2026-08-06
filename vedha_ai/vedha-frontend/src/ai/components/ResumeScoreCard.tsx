import { FileText, AlertTriangle } from "lucide-react";
import Card from "@/components/ui/card/Card";

interface FeedbackItem {
  section: string;
  score: number;
  suggestions: string[];
}

interface ResumeScoreCardProps {
  atsScore: number;
  feedback: FeedbackItem[];
}

export default function ResumeScoreCard({ atsScore, feedback }: ResumeScoreCardProps) {
  return (
    <Card variant="glass" className="p-6 space-y-5">
      <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-cyan-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">AI Resume Review</h3>
        </div>
        <span className="text-xl font-black text-cyan-450">{atsScore} Score</span>
      </div>

      <div className="space-y-4">
        {feedback.map((item, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex justify-between items-center text-xs border-b border-slate-900 pb-1">
              <span className="font-bold text-slate-350">{item.section}</span>
              <span className={`font-bold ${item.score >= 80 ? "text-emerald-400" : "text-amber-400"}`}>
                {item.score}/100
              </span>
            </div>
            <ul className="space-y-1.5 pl-1">
              {item.suggestions.map((sug, sIdx) => (
                <li key={sIdx} className="flex gap-2 items-start text-slate-400 text-[10px] leading-relaxed">
                  <AlertTriangle size={11} className="text-amber-500 shrink-0 mt-0.5" />
                  <span>{sug}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Card>
  );
}
