import { useNavigate } from "react-router-dom";
import { CheckCircle2, Circle } from "lucide-react";
import type { CodingProblem } from "@/services/problems";

interface ProblemTableProps {
  problems: CodingProblem[];
}

export default function ProblemTable({ problems }: ProblemTableProps) {
  const navigate = useNavigate();

  const difficultyColors = {
    Easy: "text-emerald-400",
    Medium: "text-amber-400",
    Hard: "text-red-400",
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-900 bg-slate-950/20">
      <table className="w-full text-left border-collapse text-xs select-none">
        <thead>
          <tr className="border-b border-slate-900 text-slate-500 font-bold uppercase text-[9px] tracking-wider bg-slate-900/30">
            <th className="p-3.5 pl-5">Status</th>
            <th className="p-3.5">Title</th>
            <th className="p-3.5">Difficulty</th>
            <th className="p-3.5">Category</th>
            <th className="p-3.5 pr-5 text-right">Discussion</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-900">
          {problems.map((p) => (
            <tr
              key={p.id}
              onClick={() => navigate(`/coding/problems/${p.id}`)}
              className="hover:bg-slate-900/40 cursor-pointer transition text-slate-300 font-medium"
            >
              <td className="p-3.5 pl-5">
                {p.solved ? (
                  <CheckCircle2 size={14} className="text-emerald-450" />
                ) : (
                  <Circle size={10} className="text-slate-800" />
                )}
              </td>
              <td className="p-3.5 font-bold text-white hover:text-cyan-400">
                {p.title}
                <div className="flex gap-1 mt-1">
                  {(p.companyTags || []).map((tag) => (
                    <span
                      key={tag}
                      className="text-[7px] bg-slate-900 border border-slate-850 px-1 py-0.2 rounded text-slate-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </td>
              <td className={`p-3.5 font-bold ${difficultyColors[p.difficulty]}`}>
                {p.difficulty}
              </td>
              <td className="p-3.5 text-slate-450">{p.category}</td>
              <td className="p-3.5 pr-5 text-right text-slate-500 font-mono">
                {p.discussionCount || 0} comments
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
