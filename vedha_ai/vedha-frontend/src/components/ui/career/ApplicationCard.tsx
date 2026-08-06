import { Calendar, Briefcase } from "lucide-react";
import Card from "@/components/ui/card/Card";

interface ApplicationCardProps {
  id: number;
  jobTitle: string;
  companyName: string;
  location: string;
  status: "Applied" | "Resume Review" | "Interviewing" | "Offered" | "Rejected";
  appliedAt: string;
  step: number;
}

export default function ApplicationCard({
  jobTitle,
  companyName,
  location,
  status,
  appliedAt,
}: ApplicationCardProps) {
  const statusColors = {
    Applied: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/25",
    "Resume Review": "bg-violet-500/10 text-violet-400 border border-violet-500/25",
    Interviewing: "bg-amber-500/10 text-amber-400 border border-amber-500/25 animate-pulse",
    Offered: "bg-emerald-500/10 text-emerald-450 border border-emerald-500/25",
    Rejected: "bg-red-500/10 text-red-400 border border-red-500/25",
  };

  return (
    <Card variant="glass" className="p-5 space-y-4">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h4 className="text-xs font-bold text-white leading-snug">{jobTitle}</h4>
          <p className="text-[10px] text-slate-500 mt-0.5">{companyName} • {location}</p>
        </div>
        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${statusColors[status]}`}>
          {status}
        </span>
      </div>

      <div className="flex justify-between items-center text-[10px] text-slate-500 select-none font-semibold border-t border-slate-900 pt-3">
        <span className="flex items-center gap-1.5">
          <Calendar size={12} className="text-cyan-400" />
          Applied: {appliedAt}
        </span>
        <span className="flex items-center gap-1">
          <Briefcase size={12} className="text-cyan-400" />
          Fulltime role
        </span>
      </div>
    </Card>
  );
}
