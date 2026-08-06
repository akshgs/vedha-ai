import { CheckCircle2, Clock, Circle } from "lucide-react";
import Card from "@/components/ui/card/Card";

interface Step {
  label: string;
  desc: string;
  completed: boolean;
  active: boolean;
}

interface TimelineProps {
  steps: Step[];
  title?: string;
}

export default function Timeline({ steps, title = "Application Stages Tracker" }: TimelineProps) {
  return (
    <Card variant="glass" className="p-6">
      <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2.5 mb-6">
        {title}
      </h4>

      <div className="relative border-l border-slate-850 ml-3 pl-6 space-y-6">
        {steps.map((step, idx) => {
          return (
            <div key={idx} className="relative">
              {/* Bullet */}
              <div
                className={`absolute -left-9 top-0.5 h-6 w-6 rounded-full border flex items-center justify-center transition-all duration-300 ${
                  step.completed
                    ? "bg-emerald-500/25 border-emerald-500 text-emerald-450"
                    : step.active
                    ? "bg-cyan-500/25 border-cyan-500 text-cyan-400 animate-pulse"
                    : "bg-slate-900 border-slate-800 text-slate-600"
                }`}
              >
                {step.completed ? (
                  <CheckCircle2 size={12} />
                ) : step.active ? (
                  <Clock size={12} />
                ) : (
                  <Circle size={8} className="fill-current" />
                )}
              </div>

              <div>
                <h5 className="text-xs font-bold text-white">{step.label}</h5>
                <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
