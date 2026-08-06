import { Calendar, Clock, User, Link as LinkIcon } from "lucide-react";
import Card from "@/components/ui/card/Card";

interface ScheduledInterview {
  id: string;
  jobTitle: string;
  companyName: string;
  date: string;
  time: string;
  interviewerName: string;
  status: "Scheduled" | "Completed" | "Cancelled";
}

interface InterviewCardProps {
  interview: ScheduledInterview;
}

export default function InterviewCard({ interview }: InterviewCardProps) {
  return (
    <Card variant="glass" className="p-5 space-y-4">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h4 className="text-xs font-bold text-white leading-snug">{interview.jobTitle}</h4>
          <p className="text-[10px] text-cyan-400 mt-0.5">{interview.companyName}</p>
        </div>
        <span className="px-2 py-0.5 rounded text-[8px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold uppercase select-none">
          {interview.status}
        </span>
      </div>

      <div className="flex flex-col gap-2 pt-2 border-t border-slate-900 text-[10px] text-slate-500 font-semibold select-none">
        <span className="flex items-center gap-1.5">
          <Calendar size={12} className="text-slate-655" />
          Date: {interview.date}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock size={12} className="text-slate-655" />
          Time: {interview.time}
        </span>
        <span className="flex items-center gap-1.5">
          <User size={12} className="text-slate-655" />
          Interviewer: {interview.interviewerName}
        </span>
        <span className="flex items-center gap-1.5 text-cyan-400 cursor-pointer hover:underline">
          <LinkIcon size={12} />
          Join Meeting Lobby
        </span>
      </div>
    </Card>
  );
}
