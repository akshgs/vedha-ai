import { useNavigate } from "react-router-dom";
import { MessageSquare, ExternalLink } from "lucide-react";
import Card from "@/components/ui/card/Card";
import Button from "@/components/ui/button/Button";
import FollowButton from "./FollowButton";

interface ProfileCardProps {
  id: string;
  name: string;
  role: string;
  bio: string;
  skills: string[];
  followed?: boolean;
}

export default function ProfileCard({ id, name, role, bio, skills, followed }: ProfileCardProps) {
  const navigate = useNavigate();

  return (
    <Card variant="interactive" className="p-5 flex flex-col justify-between min-h-[220px] space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h4
              onClick={() => navigate(`/collaboration/profile/${id}`)}
              className="text-sm font-bold text-white hover:text-cyan-400 cursor-pointer transition flex items-center gap-1.5"
            >
              {name}
              <ExternalLink size={12} className="text-slate-500" />
            </h4>
            <p className="text-[10px] text-cyan-400 mt-0.5">{role}</p>
          </div>
          <FollowButton userId={id} initialFollowed={followed} />
        </div>

        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
          {bio}
        </p>
      </div>

      <div className="space-y-3 pt-3 border-t border-slate-900">
        <div className="flex flex-wrap gap-1">
          {skills.slice(0, 3).map((s) => (
            <span
              key={s}
              className="text-[8px] font-bold uppercase bg-slate-900 border border-slate-850 px-2 py-0.5 rounded text-slate-500"
            >
              {s}
            </span>
          ))}
        </div>
        <div className="flex justify-end pt-1">
          <Button
            onClick={() => navigate("/collaboration/messages")}
            className="text-[10px] py-1.5 px-4 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1"
          >
            <MessageSquare size={10} />
            Chat
          </Button>
        </div>
      </div>
    </Card>
  );
}
