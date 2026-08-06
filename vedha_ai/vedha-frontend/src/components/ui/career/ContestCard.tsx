import { Calendar, Users, Award } from "lucide-react";
import Card from "@/components/ui/card/Card";
import Button from "@/components/ui/button/Button";

interface ContestCardProps {
  id: string;
  title: string;
  startTime: string;
  duration: string;
  participantsCount: number;
  status: "Upcoming" | "Active" | "Completed";
  onRegister?: (id: string) => void;
}

export default function ContestCard({
  id,
  title,
  startTime,
  duration,
  participantsCount,
  status,
  onRegister,
}: ContestCardProps) {
  const statusColors = {
    Upcoming: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
    Active: "bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 animate-pulse",
    Completed: "bg-slate-900 text-slate-500 border border-slate-800",
  };

  return (
    <Card variant="glass" className="p-5 flex flex-col justify-between min-h-[180px] space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-start gap-4">
          <h4 className="text-xs font-bold text-white leading-snug">{title}</h4>
          <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${statusColors[status]}`}>
            {status}
          </span>
        </div>

        <div className="flex flex-col gap-1.5 text-[10px] text-slate-450 select-none">
          <span className="flex items-center gap-1.5">
            <Calendar size={12} className="text-cyan-400" />
            Start: {new Date(startTime).toLocaleString()}
          </span>
          <span className="flex items-center gap-1.5">
            <Award size={12} className="text-cyan-400" />
            Duration: {duration}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center border-t border-slate-900 pt-3 text-xs">
        <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
          <Users size={12} />
          {participantsCount} coders registered
        </span>
        {status !== "Completed" && onRegister && (
          <Button
            onClick={() => onRegister(id)}
            className="text-[9px] py-1.5 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl"
          >
            Register Now
          </Button>
        )}
      </div>
    </Card>
  );
}
