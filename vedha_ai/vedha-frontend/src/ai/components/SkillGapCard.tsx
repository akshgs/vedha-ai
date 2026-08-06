import { AlertTriangle, CheckCircle, Briefcase } from "lucide-react";
import Card from "@/components/ui/card/Card";

interface SkillGapCardProps {
  matchPercentage: number;
  presentSkills: { name: string; proficiency: number }[];
  missingSkills: { name: string; priority: "High" | "Medium" | "Low" }[];
  onAction?: (skillName: string) => void;
}

export default function SkillGapCard({
  matchPercentage,
  presentSkills,
  missingSkills,
  onAction,
}: SkillGapCardProps) {
  return (
    <Card variant="glass" className="p-6 space-y-5">
      <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Role Compatibility</h3>
          <p className="text-[10px] text-slate-500 mt-0.5">Skill overlaps targeting your preferred job</p>
        </div>
        <span className="text-xl font-black text-cyan-400">{matchPercentage}% Match</span>
      </div>

      <div className="space-y-4">
        {/* Present Skills */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Matching Competencies</span>
          <div className="flex flex-wrap gap-1.5">
            {presentSkills.map((s) => (
              <span
                key={s.name}
                className="inline-flex items-center gap-1 text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold"
              >
                <CheckCircle size={10} />
                {s.name} ({s.proficiency}%)
              </span>
            ))}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Missing Key Gaps</span>
          <div className="space-y-1.5">
            {missingSkills.map((s) => (
              <div
                key={s.name}
                className="flex items-center justify-between bg-slate-950/60 p-2.5 px-3 rounded-xl border border-slate-900 text-xs"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle size={12} className="text-amber-500" />
                  <span className="font-semibold text-slate-300">{s.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded border ${
                      s.priority === "High"
                        ? "bg-red-500/10 text-red-400 border-red-500/20"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}
                  >
                    {s.priority} Priority
                  </span>
                  {onAction && (
                    <button
                      onClick={() => onAction(s.name)}
                      className="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-0.5 transition"
                    >
                      <Briefcase size={10} />
                      Jobs
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
