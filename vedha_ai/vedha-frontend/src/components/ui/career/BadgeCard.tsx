import { Award } from "lucide-react";
import Card from "@/components/ui/card/Card";

interface BadgeCardProps {
  id: string;
  title: string;
  desc: string;
  unlocked: boolean;
}

export default function BadgeCard({ title, desc, unlocked }: BadgeCardProps) {
  return (
    <Card
      variant="glass"
      className={`p-4 flex items-center gap-4 ${
        unlocked ? "border-amber-500/10 bg-amber-500/5" : "border-slate-900 bg-slate-950/20 opacity-60"
      }`}
    >
      <div className={`rounded-xl p-3 border shrink-0 ${unlocked ? "bg-amber-500/15 border-amber-500/30 text-amber-400" : "bg-slate-900 border-slate-800 text-slate-600"}`}>
        <Award size={18} />
      </div>
      <div>
        <h4 className="text-xs font-bold text-white leading-tight">{title}</h4>
        <p className="text-[10px] text-slate-450 mt-1 leading-relaxed">{desc}</p>
        <span className="text-[8px] uppercase font-bold text-slate-600 tracking-wider block mt-1.5 select-none">
          {unlocked ? "Unlocked Milestone" : "Locked Milestone"}
        </span>
      </div>
    </Card>
  );
}
