import type { ReactNode } from "react";
import {
  Briefcase,
  FileText,
  GraduationCap,
  Sparkles,
} from "lucide-react";

export default function DashboardPreview() {
  return (
    <div className="w-full max-w-lg rounded-3xl border border-slate-800/60 bg-slate-900/70 p-6 shadow-2xl backdrop-blur-xl">

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">

        <div>
          <h3 className="text-2xl font-bold text-white">
            AI Dashboard
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            Career Intelligence
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />

          <span className="text-xs font-semibold text-emerald-400">
            Live
          </span>
        </div>

      </div>

      <div className="space-y-4">

        <DashboardCard
          icon={<FileText size={18} />}
          title="Resume Score"
          value="95%"
          progress={95}
          color="bg-blue-500"
        />

        <DashboardCard
          icon={<Briefcase size={18} />}
          title="Job Match"
          value="91%"
          progress={91}
          color="bg-cyan-500"
        />

        <DashboardCard
          icon={<GraduationCap size={18} />}
          title="Roadmap"
          value="78%"
          progress={78}
          color="bg-violet-500"
        />

        <DashboardCard
          icon={<Sparkles size={18} />}
          title="Interview AI"
          value="Ready"
          progress={100}
          color="bg-emerald-500"
        />

      </div>

    </div>
  );
}

type DashboardCardProps = {
  icon: ReactNode;
  title: string;
  value: string;
  progress: number;
  color: string;
};

function DashboardCard({
  icon,
  title,
  value,
  progress,
  color,
}: DashboardCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 transition-all duration-300 hover:border-slate-700 hover:bg-slate-900">

      <div className="mb-3 flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className={`rounded-xl p-2 text-white ${color}`}>
            {icon}
          </div>

          <span className="text-sm font-medium text-slate-300">
            {title}
          </span>

        </div>

        <span className="text-lg font-bold text-white">
          {value}
        </span>

      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-800">

        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${progress}%` }}
        />

      </div>

    </div>
  );
}