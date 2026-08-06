import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MessageSquare, Save } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/layouts/DashboardLayout";
import Card from "@/components/ui/card/Card";
import Button from "@/components/ui/button/Button";
import {
  getCourseDetails,
  updateLessonProgress,
  getDiscussionThreads,
  postDiscussionComment,
  type Lesson,
  type DiscussionThread,
} from "@/services/course";
import VideoPlayer from "@/components/ui/learning/VideoPlayer";

export default function LessonPlayerPage() {
  const { id, lessonId } = useParams<{ id: string; lessonId: string }>();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [discussions, setDiscussions] = useState<DiscussionThread[]>([]);
  const [commentText, setCommentText] = useState("");
  const [userNotes, setUserNotes] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!id || !lessonId) return;
      try {
        setLoading(true);
        const res = await getCourseDetails(Number(id));
        setLessons(res.lessons);
        const current = res.lessons.find((l) => l.id === Number(lessonId));
        if (current) {
          setLesson(current);
          setUserNotes(current.notes || "");
        }
        const threads = await getDiscussionThreads(Number(id));
        setDiscussions(threads);
      } catch {
        toast.error("Failed to query lesson parameters.");
      } finally {
        setLoading(false);
      }
    }
    void loadData();
  }, [id, lessonId]);

  async function handleVideoEnded() {
    if (!lesson || !id) return;
    try {
      await updateLessonProgress(Number(id), lesson.id, true);
      setLesson({ ...lesson, completed: true });
      setLessons(
        lessons.map((l) => (l.id === lesson.id ? { ...l, completed: true } : l))
      );
      toast.success("Lesson marked completed! Progress updated.");
    } catch {
      toast.error("Failed to update progress.");
    }
  }

  function handleSaveNotes() {
    toast.success("Notes saved for this lesson.");
  }

  async function handlePostComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText.trim() || !id) return;

    try {
      const added = await postDiscussionComment(Number(id), commentText);
      setDiscussions([...discussions, added]);
      setCommentText("");
      toast.success("Comment added to thread.");
    } catch {
      toast.error("Failed to post comment.");
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl bg-slate-905 border border-slate-800 p-8 text-center text-slate-500 animate-pulse">
          Connecting media players...
        </div>
      </DashboardLayout>
    );
  }

  if (!lesson) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center text-red-400">
          Lesson content not found.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Back navigation */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <button
            onClick={() => navigate(`/student/learning/course/${id}`)}
            className="flex items-center gap-1 text-slate-500 hover:text-white transition text-xs font-semibold"
          >
            <ArrowLeft size={12} />
            Back to Course Syllabus
          </button>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-450 font-semibold">Playlist:</span>
            {lessons.map((l) => (
              <button
                key={l.id}
                onClick={() => navigate(`/student/learning/course/${id}/lesson/${l.id}`)}
                className={`h-6 px-2.5 rounded text-[10px] font-bold border transition ${
                  l.id === lesson.id
                    ? "bg-cyan-500/10 border-cyan-500 text-cyan-400"
                    : l.completed
                    ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-450 hover:bg-emerald-500/10"
                    : "bg-slate-900 border-slate-850 text-slate-500 hover:border-slate-700 hover:text-white"
                }`}
              >
                L{l.id}
              </button>
            ))}
          </div>
        </div>

        {/* Video Player & Left Column */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <VideoPlayer url={lesson.videoUrl} onEnded={handleVideoEnded} />

            <div className="border-b border-slate-900 pb-2">
              <h2 className="text-xl font-bold text-white leading-tight">{lesson.title}</h2>
              <span className="text-[10px] text-slate-500 block mt-1">Duration: {lesson.duration}</span>
            </div>

            {/* Discussion Boards */}
            <Card variant="glass" className="p-6 space-y-5">
              <div className="flex gap-2 items-center border-b border-slate-800 pb-2.5">
                <MessageSquare size={16} className="text-cyan-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Lesson Q&A Discussion Forum</h3>
              </div>

              <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
                {discussions.map((disc) => (
                  <div key={disc.id} className="rounded-xl bg-slate-950/60 p-3.5 border border-slate-900 text-xs">
                    <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold">
                      <span>{disc.author}</span>
                      <span>{disc.timestamp}</span>
                    </div>
                    <p className="text-slate-350 mt-1.5 leading-relaxed">
                      {disc.text}
                    </p>
                  </div>
                ))}
              </div>

              <form onSubmit={handlePostComment} className="flex gap-2 border-t border-slate-900 pt-3">
                <input
                  type="text"
                  placeholder="Ask questions about this lecture segment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white outline-none focus:border-cyan-500"
                />
                <Button type="submit" className="shrink-0 p-2.5 px-5 text-xs">
                  Post
                </Button>
              </form>
            </Card>
          </div>

          {/* Sidebar Notes Logbook */}
          <div className="space-y-6">
            <Card variant="glass" className="p-6 flex flex-col h-[400px] justify-between">
              <div className="space-y-4 flex-1 flex flex-col min-h-0">
                <div className="flex gap-2 items-center border-b border-slate-850 pb-2 shrink-0">
                  <Save size={14} className="text-cyan-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Lesson Notes Logbook</h3>
                </div>
                <textarea
                  placeholder="Jot down key conceptual takeaways, terminal snippets, or links..."
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  className="w-full flex-1 bg-slate-950/60 border border-slate-850 rounded-xl p-3 text-xs text-slate-300 outline-none focus:border-cyan-500 resize-none min-h-0 focus:ring-1 focus:ring-cyan-500/10"
                />
              </div>
              <div className="pt-3 border-t border-slate-900 shrink-0">
                <Button onClick={handleSaveNotes} className="w-full text-xs py-2 flex items-center justify-center gap-1.5">
                  <Save size={12} />
                  Save Notes
                </Button>
              </div>
            </Card>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
