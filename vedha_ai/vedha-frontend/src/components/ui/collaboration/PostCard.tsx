import { useState } from "react";

import Card from "@/components/ui/card/Card";
import ReactionBar from "./ReactionBar";
import CommentThread from "./CommentThread";
import ShareDialog from "./ShareDialog";
import { toggleLikePost, type Post } from "@/services/networking";
import { toast } from "sonner";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const [likes, setLikes] = useState(post.likes);
  const [liked, setLiked] = useState(post.liked || false);
  const [saved, setSaved] = useState(post.saved || false);
  const [showComments, setShowComments] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  // Mock comments list
  const [comments, setComments] = useState([
    { id: "c-1", author: "Pranav M.", text: "This is a great milestone. Highly recommended to learn Docker next.", timestamp: "2 hours ago" },
  ]);

  async function handleLike() {
    try {
      const nextLiked = await toggleLikePost(post.id);
      setLiked(nextLiked);
      setLikes((prev) => (nextLiked ? prev + 1 : prev - 1));
    } catch {
      // Ignore
    }
  }

  function handleAddComment(text: string) {
    const newComment = {
      id: Math.random().toString(36).substring(7),
      author: "You (Student)",
      text,
      timestamp: "Just now",
    };
    setComments([...comments, newComment]);
    toast.success("Comment added.");
  }

  return (
    <Card variant="glass" className="p-5 space-y-4">
      {/* Author details header */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex gap-3 items-center">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 flex items-center justify-center text-cyan-400 font-bold border border-slate-800 text-sm">
            {post.author.name[0]}
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">{post.author.name}</h4>
            <p className="text-[9px] text-slate-500 mt-0.5">{post.author.role} • {post.timestamp}</p>
          </div>
        </div>
      </div>

      {/* Post body */}
      <p className="text-xs text-slate-350 leading-relaxed font-semibold">
        {post.text}
      </p>

      {/* React bar action links */}
      <ReactionBar
        likes={likes}
        commentsCount={comments.length}
        liked={liked}
        saved={saved}
        onLike={handleLike}
        onCommentToggle={() => setShowComments(!showComments)}
        onShare={() => setShareOpen(true)}
        onSave={() => {
          setSaved(!saved);
          toast.success(!saved ? "Post saved to bookmarks!" : "Post removed from bookmarks.");
        }}
      />

      {/* Comments Drawer panel */}
      {showComments && (
        <CommentThread comments={comments} onAddComment={handleAddComment} />
      )}

      {/* Share dialog modal */}
      {shareOpen && (
        <ShareDialog isOpen={true} onClose={() => setShareOpen(false)} postId={post.id} />
      )}
    </Card>
  );
}
