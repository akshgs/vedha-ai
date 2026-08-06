import { MessageSquare, UserPlus, GraduationCap, Briefcase, Bell } from "lucide-react";
import type { NotificationItem } from "@/services/notifications";

interface NotificationCardProps {
  item: NotificationItem;
  onRead: (id: string) => void;
}

export default function NotificationCard({ item, onRead }: NotificationCardProps) {
  const icons = {
    message: <MessageSquare size={14} className="text-cyan-400" />,
    connection: <UserPlus size={14} className="text-violet-400" />,
    mentorship: <GraduationCap size={14} className="text-amber-400 animate-pulse" />,
    interview: <GraduationCap size={14} className="text-emerald-400" />,
    job: <Briefcase size={14} className="text-red-400" />,
    course: <GraduationCap size={14} className="text-cyan-400" />,
    system: <Bell size={14} className="text-slate-400" />,
  };

  return (
    <div
      onClick={() => {
        if (!item.read) onRead(item.id);
      }}
      className={`rounded-xl border p-4 flex gap-3.5 items-start transition text-xs select-none ${
        item.read
          ? "border-slate-900 bg-slate-950/20 text-slate-400"
          : "border-cyan-500/20 bg-cyan-500/5 text-slate-200 cursor-pointer shadow-inner"
      }`}
    >
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-2.5 shrink-0">
        {icons[item.type]}
      </div>

      <div className="flex-1 space-y-1">
        <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold">
          <span className="uppercase tracking-wider text-slate-500">{item.type} alert</span>
          <span>{item.timestamp}</span>
        </div>
        <h4 className="font-bold text-white leading-snug">{item.title}</h4>
        <p className="text-[10px] text-slate-400 leading-relaxed mt-1">{item.message}</p>
      </div>
    </div>
  );
}
