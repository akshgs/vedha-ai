import { SlidersHorizontal } from "lucide-react";
import Card from "@/components/ui/card/Card";

interface FilterPanelProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  title?: string;
}

export default function FilterPanel({
  categories,
  selectedCategory,
  onSelectCategory,
  title = "Filter Directory",
}: FilterPanelProps) {
  return (
    <Card variant="glass" className="p-4 flex items-center justify-between gap-4 flex-wrap">
      <div className="flex gap-2 items-center text-xs font-bold text-slate-400">
        <SlidersHorizontal size={14} className="text-cyan-400" />
        <span>{title}</span>
      </div>

      <div className="flex gap-2 select-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`rounded-lg border px-3 py-1.5 text-[10px] font-bold uppercase transition ${
                isActive
                  ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                  : "bg-slate-900/60 border-slate-850 text-slate-500 hover:text-white"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </Card>
  );
}
