import { Target, Sparkles } from "lucide-react";
import Card from "@/components/ui/card/Card";

interface CareerScoreCardProps {
  score: number;
  delta: string;
  verdict: string;
}

export default function CareerScoreCard({ score, delta, verdict }: CareerScoreCardProps) {
  return (
    <Card variant="glass" className="p-6 space-y-3 border-cyan-500/10">
      <div className="flex justify-between items-center text-slate-500">
        <span className="text-[10px] uppercase font-bold tracking-wider">Career Readiness Score</span>
        <Target size={16} className="text-cyan-400" />
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-black text-white">{score}%</span>
        <span className="text-[10px] text-emerald-400 font-bold">{delta}</span>
      </div>
      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-cyan-400" style={{ width: `${score}%` }} />
      </div>
      <div className="flex items-center gap-1.5 pt-1 text-[10px] text-slate-400">
        <Sparkles size={12} className="text-violet-400 animate-pulse" />
        <span>AI Verdict: <span className="font-semibold text-white">{verdict}</span></span>
      </div>
    </Card>
  );
}
