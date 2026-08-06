import { Bookmark, BookmarkCheck } from "lucide-react";
import Card from "@/components/ui/card/Card";

interface CourseCardProps {
  id: number;
  title: string;
  category: string;
  duration: string;
  progress: number;
  saved: boolean;
  level: string;
  onSelect: () => void;
  onBookmark: () => void;
}

export default function CourseCard({
  title,
  category,
  duration,
  progress,
  saved,
  level,
  onSelect,
  onBookmark,
}: CourseCardProps) {
  return (
    <Card variant="interactive" className="p-6 flex flex-col justify-between h-[250px] space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-start gap-2">
          <span className="rounded bg-slate-900 border border-slate-850 px-2 py-0.5 text-[9px] font-semibold text-slate-500 uppercase tracking-wide">
            {level}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBookmark();
            }}
            className="text-slate-400 hover:text-white transition"
          >
            {saved ? (
              <BookmarkCheck size={16} className="text-cyan-400" />
            ) : (
              <Bookmark size={16} />
            )}
          </button>
        </div>
        <h4
          onClick={onSelect}
          className="text-sm font-bold text-white leading-snug line-clamp-2 hover:text-cyan-400 transition cursor-pointer"
        >
          {title}
        </h4>
        <p className="text-[10px] text-slate-500">{category} • {duration}</p>
      </div>

      <div className="space-y-3 pt-3 border-t border-slate-900">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400">Lesson Progress</span>
          <span className="font-bold text-cyan-400">{progress}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-cyan-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </Card>
  );
}
