import { useEffect, useState } from "react";
import { BookOpen, Plus, Send, Flame, Eye, ThumbsUp } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/layouts/DashboardLayout";
import Card from "@/components/ui/card/Card";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/input/Input";
import { getBlogPosts, createBlogPost, type BlogPost } from "@/services/employee";

export default function Blogs() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [writing, setWriting] = useState(false);
  const [loading, setLoading] = useState(true);

  // New Blog form
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Backend Development");
  const [content, setContent] = useState("");

  useEffect(() => {
    async function loadBlogs() {
      try {
        setLoading(true);
        const data = await getBlogPosts();
        setBlogs(data);
      } catch {
        toast.error("Failed to load blog feed.");
      } finally {
        setLoading(false);
      }
    }
    void loadBlogs();
  }, []);

  async function handlePublish(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Please provide blog title and content.");
      return;
    }

    try {
      const newPost = await createBlogPost(title, category, content);
      setBlogs([newPost, ...blogs]);
      setTitle("");
      setContent("");
      setWriting(false);
      toast.success("Blog article published successfully!");
    } catch {
      toast.error("Failed to publish blog.");
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-900 pb-6">
          <div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <BookOpen className="text-cyan-400" />
              Technical Blogs Feed
            </h1>
            <p className="mt-2 text-slate-400 text-sm">
              Publish technical tutorials, share system designs, and guide students on developer patterns.
            </p>
          </div>
          <Button
            onClick={() => setWriting(!writing)}
            className="flex items-center gap-1.5 text-xs py-2 px-5"
          >
            {writing ? "Cancel Workspace" : "Write an Article"}
            <Plus size={14} />
          </Button>
        </div>

        {/* Editor workspace */}
        {writing && (
          <Card variant="glass" className="p-6">
            <h3 className="text-base font-bold text-white mb-4 border-b border-slate-800 pb-2">Publish New Tutorial</h3>
            <form onSubmit={handlePublish} className="space-y-4">
              <Input
                label="Article Title"
                placeholder="e.g. Scaling WebSockets in Node.js"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Topic Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-xs text-white outline-none focus:border-cyan-500"
                >
                  <option>Backend Development</option>
                  <option>Frontend Design</option>
                  <option>Cloud Infrastructure</option>
                  <option>Data Structures & Algorithms</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Markdown Content</label>
                <textarea
                  placeholder="Draft your blog content here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-white focus:border-cyan-500 outline-none focus:ring-1 focus:ring-cyan-500/20"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setWriting(false)} className="text-xs">
                  Discard Draft
                </Button>
                <Button type="submit" className="text-xs bg-gradient-to-r from-cyan-600 to-blue-600">
                  Publish Article
                  <Send size={12} className="ml-1.5" />
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Blog listing feed */}
        {loading ? (
          <div className="text-center text-xs text-slate-500 py-12 animate-pulse">Loading publications...</div>
        ) : blogs.length === 0 ? (
          <Card variant="glass" className="p-8 text-center text-slate-500">
            No articles published yet. Be the first to share!
          </Card>
        ) : (
          <div className="grid gap-6">
            {blogs.map((blog) => (
              <Card key={blog.id} variant="default" className="p-6 space-y-4">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/25">
                      {blog.category}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-2 hover:text-cyan-400 transition cursor-pointer">{blog.title}</h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">By {blog.author} • Published on {blog.createdAt}</p>
                  </div>
                  <div className="flex items-center gap-4 text-slate-400 text-xs">
                    <span className="flex items-center gap-1"><Eye size={14} /> {blog.views}</span>
                    <span className="flex items-center gap-1"><ThumbsUp size={12} /> {blog.likes}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {blog.content}
                </p>

                <div className="flex justify-between items-center border-t border-slate-900 pt-3">
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Flame size={12} className="text-amber-500 animate-pulse" /> Hot topic
                  </span>
                  <button
                    onClick={() => {
                      toast.success("Article link copied!");
                    }}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-bold"
                  >
                    Read Article →
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
