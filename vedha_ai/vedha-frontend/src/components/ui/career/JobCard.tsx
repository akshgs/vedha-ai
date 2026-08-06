import { Briefcase, MapPin, DollarSign, Bookmark, ArrowRight } from "lucide-react";
import Card from "@/components/ui/card/Card";
import Button from "@/components/ui/button/Button";

interface JobCardProps {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  job_type: string;
  match_percent: number;
  onApply: () => void;
  onSave?: () => void;
}

export default function JobCard({
  title,
  company,
  location,
  salary,
  job_type,
  match_percent,
  onApply,
  onSave,
}: JobCardProps) {
  return (
    <Card variant="glass" className="p-5 flex flex-col justify-between min-h-[220px] space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h4 className="text-xs font-bold text-white leading-snug">{title}</h4>
            <p className="text-[10px] text-cyan-400 mt-0.5">{company}</p>
          </div>
          <span className="text-[10px] text-cyan-400 font-extrabold bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded select-none">
            {match_percent}% match
          </span>
        </div>

        <div className="flex flex-wrap gap-3 pt-1 text-[10px] text-slate-500 select-none font-semibold">
          <span className="flex items-center gap-1">
            <MapPin size={12} className="text-slate-600" />
            {location}
          </span>
          <span className="flex items-center gap-1">
            <DollarSign size={12} className="text-slate-600" />
            {salary}
          </span>
          <span className="flex items-center gap-1">
            <Briefcase size={12} className="text-slate-600" />
            {job_type}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center border-t border-slate-900 pt-3 text-xs">
        {onSave ? (
          <button onClick={onSave} className="text-slate-500 hover:text-white transition p-1.5" title="Save Job">
            <Bookmark size={14} />
          </button>
        ) : (
          <div />
        )}
        <Button
          onClick={onApply}
          className="text-[9px] py-1.5 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl flex items-center gap-1.5"
        >
          Quick Apply
          <ArrowRight size={10} />
        </Button>
      </div>
    </Card>
  );
}
