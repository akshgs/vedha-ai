import {
  Brain,
  Star,
  Calendar,
  Clock3,
  Pencil,
  Trash2,
} from "lucide-react";

import type { Skill } from "@/services/skillService";

interface SkillCardProps {
  skill: Skill;
  onEdit?: (skill: Skill) => void;
  onDelete?: (id: number) => void;
}

export default function SkillCard({
  skill,
  onEdit,
  onDelete,
}: SkillCardProps) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Brain className="h-5 w-5 text-cyan-400" />
            {skill.skill_name}
          </h3>

          <p className="mt-1 text-slate-300">
            {skill.category ?? "General"}
          </p>
        </div>

        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(skill)}
              className="rounded-md p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <Pencil className="h-4 w-4" />
            </button>
          )}

          {onDelete && skill.id !== undefined && (
            <button
                onClick={() => onDelete(skill.id!)}
                className="rounded-md p-2 text-red-400 hover:bg-red-900/20"
    >
        <Trash2 className="h-4 w-4" />
    </button>
        )}
        </div>
      </div>

      <div className="mt-4 space-y-2 text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-yellow-400" />
          <span>{skill.proficiency_level}</span>
        </div>

        <div className="flex items-center gap-2">
          <Clock3 className="h-4 w-4" />
          <span>
            {skill.years_of_experience ?? 0} Years Experience
          </span>
        </div>

        {skill.last_used && (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Last Used: {skill.last_used}</span>
          </div>
        )}

        {skill.is_primary && (
          <span className="inline-flex rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-medium text-cyan-300">
            Primary Skill
          </span>
        )}
      </div>
    </div>
  );
}