import { Trophy, Star } from "lucide-react";
import Card from "@/components/ui/card/Card";

interface LeaderboardUser {
  rank: number;
  name: string;
  points: number;
  solvedCount: number;
}

interface LeaderboardProps {
  users: LeaderboardUser[];
}

export default function Leaderboard({ users }: LeaderboardProps) {
  return (
    <Card variant="glass" className="p-5">
      <div className="flex gap-2 items-center border-b border-slate-800 pb-2.5 mb-4 select-none">
        <Trophy size={16} className="text-cyan-400" />
        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Top Contest Coders</h4>
      </div>

      <div className="space-y-2">
        {users.map((user) => (
          <div
            key={user.rank}
            className="flex justify-between items-center bg-slate-950/60 p-2.5 border border-slate-900 rounded-xl text-xs"
          >
            <div className="flex items-center gap-3">
              <span className="font-mono font-bold text-slate-500 w-4">#{user.rank}</span>
              <span className="font-bold text-white">{user.name}</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400 select-none">
              <span className="text-[10px] text-slate-500">{user.solvedCount} Solved</span>
              <span className="text-cyan-400 font-extrabold flex items-center gap-1">
                <Star size={12} className="fill-current text-cyan-400" />
                {user.points} pts
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
