import { Activity, Clock } from "lucide-react";
import Card from "@/components/ui/card/Card";

interface TimelineItem {
  id: string;
  activity: string;
  timestamp: string;
}

interface ProfileTimelineProps {
  items: TimelineItem[];
}

export default function ProfileTimeline({ items }: ProfileTimelineProps) {
  return (
    <Card variant="glass" className="p-6">
      <div className="flex gap-2 items-center border-b border-slate-800 pb-3 mb-6">
        <Activity size={16} className="text-cyan-400" />
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">Recent Activity Timeline</h3>
      </div>

      <div className="relative border-l border-slate-850 ml-3 pl-6 space-y-5">
        {items.map((item) => (
          <div key={item.id} className="relative">
            <div className="absolute -left-9 top-0.5 h-6 w-6 rounded-full bg-slate-900 border border-slate-850 flex items-center justify-center text-slate-500">
              <Clock size={11} />
            </div>
            <div>
              <p className="text-xs text-slate-300 font-semibold">{item.activity}</p>
              <span className="text-[9px] text-slate-500 mt-1 block">{item.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
