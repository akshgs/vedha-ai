import { BookOpen, GraduationCap } from "lucide-react";
import Card from "@/components/ui/card/Card";
import Button from "@/components/ui/button/Button";

interface RecommendationCardProps {
  skillGap: string;
  courseTitle: string;
  lpaImpact: string;
  onNavigate: () => void;
}

export default function RecommendationCard({
  skillGap,
  courseTitle,
  lpaImpact,
  onNavigate,
}: RecommendationCardProps) {
  return (
    <Card variant="glass" className="p-5 space-y-3.5 border-violet-500/10">
      <div className="flex gap-2 items-center">
        <GraduationCap size={16} className="text-violet-400 animate-pulse" />
        <span className="text-[10px] uppercase font-bold text-slate-500">AI Placement Upskill Target</span>
      </div>
      <div className="space-y-1">
        <p className="text-[11px] text-slate-400">
          To resolve your missing <span className="text-cyan-400 font-bold">{skillGap}</span> gap:
        </p>
        <h4 className="text-xs font-bold text-white leading-snug">{courseTitle}</h4>
      </div>
      <p className="text-[10px] text-emerald-400">
        Estimated Career Boost: <span className="font-bold">+{lpaImpact} Salary LPA</span>
      </p>
      <Button
        onClick={onNavigate}
        className="w-full text-xs py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 flex justify-center items-center gap-1.5"
      >
        <BookOpen size={12} />
        Start Course Track
      </Button>
    </Card>
  );
}
