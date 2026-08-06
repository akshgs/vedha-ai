import { useNavigate } from "react-router-dom";
import { CheckCircle2, ChevronRight } from "lucide-react";
import Card from "@/components/ui/card/Card";

interface ProblemCardProps {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  solved: boolean;
  companyTags: string[];
}

export default function ProblemCard({
  id,
  title,
  difficulty,
  category,
  solved,
  companyTags,
}: ProblemCardProps) {
  const navigate = useNavigate();

  const difficultyColors = {
    Easy: "text-emerald-450 bg-emerald-500/10",
    Medium: "text-amber-450 bg-amber-500/10",
    Hard: "text-red-450 bg-red-500/10",
  };

  return (
    <Card
      onClick={() => navigate(`/coding/problems/${id}`)}
      variant="interactive"
      className="p-4 flex items-center justify-between border-slate-850 hover:border-cyan-550/30 bg-slate-950/20"
    >
      <div className="flex items-center gap-3">
        {solved ? (
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
        ) : (
          <div className="h-4 w-4 rounded-full border border-slate-800 shrink-0" />
        )}
        <div>
          <h4 className="text-xs font-bold text-white flex items-center gap-2 hover:text-cyan-400 cursor-pointer">
            {title}
          </h4>
          <div className="flex gap-2 items-center mt-1 text-[10px] text-slate-500">
            <span>{category}</span>
            <span>•</span>
            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${difficultyColors[difficulty]}`}>
              {difficulty}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex gap-1">
          {companyTags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[8px] bg-slate-900 border border-slate-850 px-1.5 py-0.5 rounded text-slate-455"
            >
              {tag}
            </span>
          ))}
        </div>
        <ChevronRight size={14} className="text-slate-550" />
      </div>
    </Card>
  );
}
