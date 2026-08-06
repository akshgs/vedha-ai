import { useState } from "react";
import { Users, UserCheck } from "lucide-react";
import { toggleJoinCommunity } from "@/services/networking";
import Card from "@/components/ui/card/Card";
import Button from "@/components/ui/button/Button";

interface CommunityCardProps {
  id: string;
  name: string;
  description: string;
  membersCount: number;
  joined?: boolean;
}

export default function CommunityCard({
  id,
  name,
  description,
  membersCount,
  joined = false,
}: CommunityCardProps) {
  const [isJoined, setIsJoined] = useState(joined);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    try {
      const nextState = await toggleJoinCommunity(id);
      setIsJoined(nextState);
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card variant="glass" className="p-5 flex flex-col justify-between min-h-[160px] space-y-4">
      <div className="space-y-1.5">
        <h4 className="text-xs font-bold text-white leading-snug">{name}</h4>
        <p className="text-[10px] text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="flex justify-between items-center border-t border-slate-900 pt-3 text-xs select-none">
        <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
          <Users size={12} />
          {membersCount} members
        </span>
        <Button
          onClick={handleToggle}
          disabled={loading}
          variant={isJoined ? "outline" : "primary"}
          className={`text-[9px] py-1.5 px-4 rounded-xl flex items-center gap-1 ${
            isJoined ? "border-slate-800 text-slate-400 hover:text-white" : ""
          }`}
        >
          {isJoined ? (
            <>
              <UserCheck size={10} />
              Joined
            </>
          ) : (
            "Join Group"
          )}
        </Button>
      </div>
    </Card>
  );
}
