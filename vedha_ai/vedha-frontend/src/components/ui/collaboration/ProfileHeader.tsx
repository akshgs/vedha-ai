import { Shield } from "lucide-react";
import Card from "@/components/ui/card/Card";
import FollowButton from "./FollowButton";

interface ProfileHeaderProps {
  userId: string;
  name: string;
  role: string;
  bio: string;
  connections: number;
  followers: number;
  following: number;
  followed?: boolean;
}

export default function ProfileHeader({
  userId,
  name,
  role,
  bio,
  connections,
  followers,
  following,
  followed,
}: ProfileHeaderProps) {
  return (
    <Card variant="glass" className="p-6 space-y-6 relative overflow-hidden border-cyan-550/10">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 h-44 w-44 rounded-full bg-cyan-500/5 blur-3xl" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between relative">
        <div className="flex gap-4 items-start">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center text-white text-2xl font-black shrink-0 border border-slate-800">
            {name[0]}
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              {name}
              <Shield size={14} className="text-cyan-400" />
            </h2>
            <p className="text-xs text-cyan-400 font-semibold">{role}</p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xl pt-1">
              {bio}
            </p>
          </div>
        </div>

        <div className="shrink-0 pt-2 sm:pt-0">
          <FollowButton userId={userId} initialFollowed={followed} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 border-t border-slate-900 pt-5 text-center text-xs relative">
        <div>
          <span className="text-slate-500 block uppercase font-bold text-[9px] tracking-wider">Connections</span>
          <span className="text-white font-extrabold text-sm mt-0.5 block">{connections}</span>
        </div>
        <div>
          <span className="text-slate-500 block uppercase font-bold text-[9px] tracking-wider">Followers</span>
          <span className="text-white font-extrabold text-sm mt-0.5 block">{followers}</span>
        </div>
        <div>
          <span className="text-slate-500 block uppercase font-bold text-[9px] tracking-wider">Following</span>
          <span className="text-white font-extrabold text-sm mt-0.5 block">{following}</span>
        </div>
      </div>
    </Card>
  );
}
