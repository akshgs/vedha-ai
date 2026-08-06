import { useEffect, useState } from "react";
import { ClipboardList, Star, FileText, Send, Eye } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/layouts/DashboardLayout";
import Card from "@/components/ui/card/Card";
import Button from "@/components/ui/button/Button";
import Modal from "@/components/ui/modal/Modal";
import { getResumeReviewRequests, submitResumeReview, type ResumeReviewRequest } from "@/services/employee";

export default function ResumeReviews() {
  const [requests, setRequests] = useState<ResumeReviewRequest[]>([]);
  const [selectedReview, setSelectedReview] = useState<ResumeReviewRequest | null>(null);
  const [loading, setLoading] = useState(true);

  // Review response inputs
  const [comments, setComments] = useState("");
  const [rating, setRating] = useState(5);

  useEffect(() => {
    async function loadRequests() {
      try {
        setLoading(true);
        const data = await getResumeReviewRequests();
        setRequests(data);
      } catch {
        toast.error("Failed to load review requests.");
      } finally {
        setLoading(false);
      }
    }
    void loadRequests();
  }, []);

  async function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedReview) return;
    if (!comments.trim()) {
      toast.error("Please add review comments.");
      return;
    }

    try {
      await submitResumeReview(selectedReview.id, comments, rating);
      
      // Update local state
      setRequests(
        requests.map((r) =>
          r.id === selectedReview.id
            ? { ...r, status: "Reviewed" as const, comments, rating }
            : r
        )
      );
      
      setSelectedReview(null);
      setComments("");
      setRating(5);
      toast.success("Resume scorecard feedback submitted to candidate.");
    } catch {
      toast.error("Failed to submit feedback.");
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <ClipboardList className="text-cyan-400" />
            Resume review queue
          </h1>
          <p className="mt-2 text-slate-400 text-sm">
            Read candidate resumes, evaluate keywords alignment, and submit score feedback cards.
          </p>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="text-center text-xs text-slate-500 py-12 animate-pulse">Loading queue...</div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left Column: Pending reviews queue */}
            <Card variant="glass" className="p-6 space-y-4">
              <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2 mb-4">Pending Requests</h3>
              {requests.filter((r) => r.status === "Pending").length === 0 ? (
                <div className="text-slate-500 text-xs italic py-6">All assigned requests reviewed!</div>
              ) : (
                <div className="space-y-4">
                  {requests.filter((r) => r.status === "Pending").map((req) => (
                    <div key={req.id} className="rounded-xl border border-slate-850 p-4 bg-slate-950/40 flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-white text-xs">{req.studentName}</h4>
                        <p className="text-[10px] text-slate-400 mt-1">Target: {req.targetRole}</p>
                        <p className="text-[9px] text-slate-500 mt-0.5">Submitted: {req.submittedAt} • {req.resumeFilename}</p>
                      </div>
                      <Button
                        onClick={() => setSelectedReview(req)}
                        className="text-xs py-1.5 px-4"
                      >
                        Start Review
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Right Column: Reviewed history logs */}
            <Card variant="glass" className="p-6 space-y-4">
              <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2 mb-4">Completed Evaluations</h3>
              {requests.filter((r) => r.status === "Reviewed").length === 0 ? (
                <div className="text-slate-500 text-xs italic py-6">No historical reviews loaded.</div>
              ) : (
                <div className="space-y-4">
                  {requests.filter((r) => r.status === "Reviewed").map((req) => (
                    <div key={req.id} className="rounded-xl border border-slate-850/40 p-4 bg-slate-900/10 space-y-3">
                      <div className="flex justify-between items-center text-xs border-b border-slate-950 pb-2">
                        <div>
                          <h4 className="font-bold text-slate-300">{req.studentName}</h4>
                          <span className="text-[10px] text-slate-500">Target: {req.targetRole}</span>
                        </div>
                        <span className="text-cyan-400 font-bold flex items-center gap-0.5">
                          <Star size={12} className="fill-current text-cyan-400" />
                          {req.rating}/5
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-serif italic">
                        "{req.comments}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

      </div>

      {/* Review Dialog modal */}
      {selectedReview && (
        <Modal isOpen={true} onClose={() => setSelectedReview(null)} title="Evaluation Scorecard & Feedback Panel">
          <form onSubmit={handleReviewSubmit} className="space-y-5">
            <div>
              <h4 className="text-sm font-bold text-white">{selectedReview.studentName}</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Target Job: {selectedReview.targetRole}</p>
            </div>

            {/* Simulated file download */}
            <div className="rounded-xl bg-slate-950 p-4 border border-slate-900 flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-cyan-400" />
                <span className="text-slate-300 truncate max-w-[180px]">{selectedReview.resumeFilename}</span>
              </div>
              <button
                type="button"
                onClick={() => toast.success("Resume downloaded locally!")}
                className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 text-[10px]"
              >
                <Eye size={12} />
                Open File
              </button>
            </div>

            <hr className="border-slate-900" />

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Score Alignment (1-5 Stars)</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white outline-none focus:border-cyan-500"
                >
                  <option value={5}>5 Stars (Exceptional alignment)</option>
                  <option value={4}>4 Stars (Strong candidate)</option>
                  <option value={3}>3 Stars (Average competency)</option>
                  <option value={2}>2 Stars (Needs substantial adjustments)</option>
                  <option value={1}>1 Star (Poor fit)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Review Comments</label>
                <textarea
                  placeholder="Provide precise comments on formatting adjustments, missing keywords, project metrics etc."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs text-white focus:border-cyan-500 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-900 pt-3">
              <Button type="button" variant="outline" onClick={() => setSelectedReview(null)} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" className="text-xs bg-cyan-600 hover:bg-cyan-500">
                Submit Feedback Card
                <Send size={12} className="ml-1.5" />
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </DashboardLayout>
  );
}
