import { useState } from "react";
import { UserPlus, UserMinus } from "lucide-react";
import { toggleFollowUser } from "@/services/networking";
import Button from "@/components/ui/button/Button";

interface FollowButtonProps {
  userId: string;
  initialFollowed?: boolean;
  onToggle?: (followed: boolean) => void;
}

export default function FollowButton({ userId, initialFollowed = false, onToggle }: FollowButtonProps) {
  const [followed, setFollowed] = useState(initialFollowed);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    try {
      const res = await toggleFollowUser(userId);
      setFollowed(res);
      if (onToggle) onToggle(res);
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={handleToggle}
      disabled={loading}
      variant={followed ? "outline" : "primary"}
      className={`text-xs py-1.5 px-4 rounded-xl flex items-center gap-1 ${
        followed
          ? "border-slate-800 text-slate-400 hover:text-white"
          : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white"
      }`}
    >
      {followed ? (
        <>
          <UserMinus size={12} />
          Unfollow
        </>
      ) : (
        <>
          <UserPlus size={12} />
          Follow
        </>
      )}
    </Button>
  );
}
