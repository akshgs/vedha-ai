import { ThumbsUp, MessageSquare, Share2, Bookmark } from "lucide-react";

interface ReactionBarProps {
  likes: number;
  commentsCount: number;
  liked?: boolean;
  saved?: boolean;
  onLike: () => void;
  onCommentToggle: () => void;
  onShare: () => void;
  onSave: () => void;
}

export default function ReactionBar({
  likes,
  commentsCount,
  liked,
  saved,
  onLike,
  onCommentToggle,
  onShare,
  onSave,
}: ReactionBarProps) {
  return (
    <div className="flex justify-between items-center text-slate-500 border-t border-slate-900 pt-3 select-none text-[11px] font-bold">
      <div className="flex gap-4">
        <button
          onClick={onLike}
          className={`flex items-center gap-1.5 transition ${
            liked ? "text-cyan-400" : "hover:text-white"
          }`}
        >
          <ThumbsUp size={13} className={liked ? "fill-current" : ""} />
          {likes}
        </button>

        <button
          onClick={onCommentToggle}
          className="flex items-center gap-1.5 hover:text-white transition"
        >
          <MessageSquare size={13} />
          {commentsCount}
        </button>
      </div>

      <div className="flex gap-3">
        <button onClick={onShare} className="p-1 hover:text-white transition" title="Share Post">
          <Share2 size={13} />
        </button>
        <button
          onClick={onSave}
          className={`p-1 transition ${saved ? "text-cyan-400" : "hover:text-white"}`}
          title="Save Post"
        >
          <Bookmark size={13} className={saved ? "fill-current" : ""} />
        </button>
      </div>
    </div>
  );
}
