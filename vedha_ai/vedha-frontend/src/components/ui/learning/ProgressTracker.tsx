import { GraduationCap, Award } from "lucide-react";
import Card from "@/components/ui/card/Card";

interface ProgressTrackerProps {
  completion: number;
  totalLessons: number;
  completedLessons: number;
}

export default function ProgressTracker({
  completion,
  totalLessons,
  completedLessons,
}: ProgressTrackerProps) {
  return (
    <Card variant="glass" className="p-6 space-y-4">
      <div className="flex justify-between items-center text-xs">
        <div className="flex gap-2 items-center text-slate-400">
          <GraduationCap size={16} className="text-cyan-400" />
          <span className="font-bold uppercase tracking-wider">Lesson Progress Tracker</span>
        </div>
        <span className="text-sm font-black text-cyan-400">{completion}% Done</span>
      </div>

      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
          style={{ width: `${completion}%` }}
        />
      </div>

      <div className="flex justify-between items-center text-[10px] text-slate-500">
        <span>Lessons: {completedLessons}/{totalLessons} completed</span>
        {completion === 100 && (
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <Award size={10} /> Certified
          </span>
        )}
      </div>
    </Card>
  );
}
