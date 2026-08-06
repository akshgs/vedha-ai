import { CheckCircle2, Circle, Clock } from "lucide-react";
import Card from "@/components/ui/card/Card";

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  status: "completed" | "current" | "upcoming";
}

interface ActivityTimelineProps {
  events: TimelineEvent[];
}

export default function ActivityTimeline({ events }: ActivityTimelineProps) {
  return (
    <Card variant="glass" className="p-6">
      <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2.5 mb-6">
        Session Milestones Track
      </h3>
      <div className="relative border-l border-slate-850 ml-3 pl-6 space-y-6">
        {events.map((event) => {
          const isCompleted = event.status === "completed";
          const isCurrent = event.status === "current";

          return (
            <div key={event.id} className="relative">
              {/* Bullet */}
              <div
                className={`absolute -left-9 top-0.5 h-6 w-6 rounded-full border flex items-center justify-center transition-all duration-300 ${
                  isCompleted
                    ? "bg-emerald-500/25 border-emerald-500 text-emerald-400"
                    : isCurrent
                    ? "bg-cyan-500/25 border-cyan-500 text-cyan-400 animate-pulse"
                    : "bg-slate-900 border-slate-800 text-slate-600"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 size={12} />
                ) : isCurrent ? (
                  <Clock size={12} />
                ) : (
                  <Circle size={8} className="fill-current" />
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold text-white">{event.title}</h4>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{event.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
