import { useEffect, useState } from "react";
import { Compass, Send, ThumbsUp, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/layouts/DashboardLayout";
import Card from "@/components/ui/card/Card";
import Button from "@/components/ui/button/Button";
import { getForumPosts, publishForumPost, type ForumPost } from "@/services/employee";

export default function Community() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [postInput, setPostInput] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      try {
        setLoading(true);
        const data = await getForumPosts();
        setPosts(data);
      } catch {
        toast.error("Failed to load community logs.");
      } finally {
        setLoading(false);
      }
    }
    void loadPosts();
  }, []);

  async function handlePublish() {
    if (!postInput.trim()) return;
    try {
      const added = await publishForumPost(postInput);
      setPosts([added, ...posts]);
      setPostInput("");
      toast.success("Forum post updated successfully!");
    } catch {
      toast.error("Failed to publish post.");
    }
  }

  function handleLike(id: number) {
    setPosts(posts.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p)));
    toast.success("Post liked!");
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Compass className="text-cyan-400" />
            Ecosystem Community Feed
          </h1>
          <p className="mt-2 text-slate-400 text-sm">
            Discuss technical issues, review code architecture, and network with mentors across domains.
          </p>
        </div>

        {/* Input Form */}
        <Card variant="glass" className="p-6">
          <div className="flex gap-3 items-start">
            <div className="h-8 w-8 rounded-full bg-cyan-600 font-bold text-white flex items-center justify-center text-xs shrink-0">
              ME
            </div>
            <div className="w-full space-y-3">
              <textarea
                placeholder="Share tech updates, request code architectures, or ask questions to mentors..."
                value={postInput}
                onChange={(e) => setPostInput(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-xs text-white focus:border-cyan-500 outline-none focus:ring-1 focus:ring-cyan-500/20"
              />
              <div className="flex justify-end pt-1">
                <Button onClick={handlePublish} className="text-xs py-2 px-6">
                  Post to Feed
                  <Send size={12} className="ml-1.5" />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Feed List */}
        {loading ? (
          <div className="text-center text-xs text-slate-500 py-12 animate-pulse">Loading feed...</div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Card key={post.id} variant="default" className="p-6 space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <h4 className="font-bold text-slate-200">{post.author}</h4>
                    <span className="text-[10px] text-slate-500">{post.role}</span>
                  </div>
                  <span className="text-slate-500 text-[10px]">{post.timestamp}</span>
                </div>

                <p className="text-xs text-slate-350 leading-relaxed bg-slate-900/10 p-3 rounded-xl border border-slate-850/50">
                  {post.content}
                </p>

                <div className="flex items-center gap-6 border-t border-slate-900 pt-3 text-slate-400 text-xs select-none">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-1.5 hover:text-cyan-400 transition"
                  >
                    <ThumbsUp size={14} />
                    <span>{post.likes} Likes</span>
                  </button>
                  <button
                    onClick={() => toast.info("Opening replies interface...")}
                    className="flex items-center gap-1.5 hover:text-cyan-400 transition"
                  >
                    <MessageSquare size={14} />
                    <span>{post.replies} Replies</span>
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
