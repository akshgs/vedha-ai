import { Star, MessageSquare } from "lucide-react";
import Card from "@/components/ui/card/Card";
import Button from "@/components/ui/button/Button";

interface MentorCardProps {
  id: string;
  name: string;
  role: string;
  company: string;
  rating: number;
  reviewsCount: number;
  skills: string[];
  bio: string;
  onBook: () => void;
  onChat: () => void;
}

export default function MentorCard({
  name,
  role,
  company,
  rating,
  reviewsCount,
  skills,
  bio,
  onBook,
  onChat,
}: MentorCardProps) {
  return (
    <Card variant="glass" className="p-5 flex flex-col justify-between min-h-[240px] space-y-4">
      <div className="space-y-2.5">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h4 className="text-sm font-bold text-white leading-snug">{name}</h4>
            <p className="text-[10px] text-cyan-400 mt-0.5">{role} at {company}</p>
          </div>
          <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1 shrink-0">
            <Star size={12} className="fill-current" />
            {rating} ({reviewsCount} reviews)
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
          {bio}
        </p>
      </div>

      <div className="space-y-3 pt-3 border-t border-slate-900">
        <div className="flex flex-wrap gap-1">
          {skills.map((s) => (
            <span
              key={s}
              className="text-[8px] font-bold uppercase bg-slate-950 border border-slate-900 px-2 py-0.5 rounded text-slate-500"
            >
              {s}
            </span>
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <Button
            onClick={onChat}
            variant="outline"
            className="text-[10px] py-1.5 px-3 border-slate-800 text-slate-400 hover:text-white"
          >
            <MessageSquare size={10} className="mr-1" />
            Chat
          </Button>
          <Button onClick={onBook} className="text-[10px] py-1.5 px-4 bg-gradient-to-r from-cyan-600 to-blue-600">
            Schedule Session
          </Button>
        </div>
      </div>
    </Card>
  );
}
