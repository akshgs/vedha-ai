import { Play, CheckCircle2, Lock } from "lucide-react";

interface LessonCardProps {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
  locked?: boolean;
  isActive?: boolean;
  onSelect: () => void;
}

export default function LessonCard({
  title,
  duration,
  completed,
  locked,
  isActive,
  onSelect,
}: LessonCardProps) {
  return (
    <div
      onClick={() => {
        if (!locked) onSelect();
      }}
      className={`flex items-center justify-between rounded-xl border p-3.5 transition text-xs select-none ${
        locked
          ? "border-slate-900 bg-slate-950/20 text-slate-600 cursor-not-allowed"
          : isActive
          ? "border-cyan-500 bg-cyan-500/5 text-cyan-300 cursor-pointer shadow-inner"
          : "border-slate-850 bg-slate-900/40 text-slate-350 hover:border-slate-750 hover:text-white cursor-pointer"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`h-6 w-6 rounded-full flex items-center justify-center border shrink-0 ${
            completed
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : locked
              ? "bg-slate-900 border-slate-800 text-slate-600"
              : "bg-slate-850 border-slate-700 text-slate-400"
          }`}
        >
          {completed ? (
            <CheckCircle2 size={12} />
          ) : locked ? (
            <Lock size={10} />
          ) : (
            <Play size={10} className="fill-current ml-0.5" />
          )}
        </div>
        <span className="font-semibold">{title}</span>
      </div>
      <span className="text-[10px] text-slate-500 shrink-0">{duration}</span>
    </div>
  );
}
