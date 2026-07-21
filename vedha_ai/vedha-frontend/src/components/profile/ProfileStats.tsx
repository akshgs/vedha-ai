import { Layers, Briefcase } from "lucide-react";

interface StatProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

function Stat({ icon, label, value }: StatProps) {
  return (
    <div className="flex flex-1 items-center gap-3 px-4 py-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
        {icon}
      </div>
      <div>
        <p className="text-base font-semibold text-white">{value}</p>
        <p className="text-xs text-slate-400">{label}</p>
      </div>
    </div>
  );
}

interface ProfileStatsProps {
  skillsCount: number;
  experience?: string;
}

export default function ProfileStats({
  skillsCount,
  experience,
}: ProfileStatsProps) {
  return (
    <div className="flex flex-wrap divide-y divide-slate-800 rounded-2xl border border-slate-800 bg-[#0f172a] sm:divide-x sm:divide-y-0">
      <Stat
        icon={<Layers className="h-4 w-4" />}
        label="Skills"
        value={skillsCount}
      />

      <Stat
        icon={<Briefcase className="h-4 w-4" />}
        label="Experience"
        value={experience || "—"}
      />
    </div>
  );
}