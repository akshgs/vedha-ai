import { useNavigate } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import Card from "@/components/ui/card/Card";
import Button from "@/components/ui/button/Button";
import FollowButton from "./FollowButton";

interface ConnectionCardProps {
  id: string;
  name: string;
  role: string;
  avatar: string;
  followed?: boolean;
}

export default function ConnectionCard({ id, name, role, followed }: ConnectionCardProps) {
  const navigate = useNavigate();

  return (
    <Card variant="default" className="p-4 flex items-center justify-between border-slate-850 bg-slate-900/30">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 flex items-center justify-center text-cyan-400 font-bold border border-slate-800">
          {name[0]}
        </div>
        <div>
          <h4
            onClick={() => navigate(`/collaboration/profile/${id}`)}
            className="text-xs font-bold text-white hover:text-cyan-400 cursor-pointer flex items-center gap-1 transition"
          >
            {name}
            <ExternalLink size={10} className="text-slate-500" />
          </h4>
          <p className="text-[10px] text-slate-500 mt-0.5">{role}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <FollowButton userId={id} initialFollowed={followed} />
        <Button
          onClick={() => navigate("/collaboration/messages")}
          className="text-[10px] py-1.5 px-3 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
        >
          Chat
        </Button>
      </div>
    </Card>
  );
}
