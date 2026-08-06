import { useState } from "react";
import { Calendar, Clock } from "lucide-react";
import { toast } from "sonner";
import Card from "@/components/ui/card/Card";
import Button from "@/components/ui/button/Button";

interface SessionCardProps {
  id: string;
  mentorName: string;
  role: string;
  date: string;
  time: string;
  status: "Pending" | "Scheduled" | "Completed" | "Cancelled";
  notes?: string;
  goal?: string;
  onReviewSubmit?: (rating: number, text: string) => void;
}

export default function SessionCard({
  mentorName,
  role,
  date,
  time,
  status,
  notes,
  goal,
  onReviewSubmit,
}: SessionCardProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  const statusColors = {
    Pending: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    Scheduled: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
    Completed: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    Cancelled: "bg-red-500/10 text-red-400 border border-red-500/20",
  };

  function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reviewText.trim()) return;
    if (onReviewSubmit) onReviewSubmit(rating, reviewText);
    toast.success("Review submitted!");
    setShowReviewForm(false);
    setReviewText("");
  }

  return (
    <Card variant="glass" className="p-5 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <h4 className="text-xs font-bold text-white">{mentorName}</h4>
          <p className="text-[10px] text-slate-500 mt-0.5">{role}</p>
        </div>
        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${statusColors[status]}`}>
          {status}
        </span>
      </div>

      {/* Date & Time */}
      <div className="flex gap-4 text-[10px] text-slate-450 select-none font-semibold">
        <span className="flex items-center gap-1">
          <Calendar size={12} className="text-cyan-400" />
          {date}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={12} className="text-cyan-400" />
          {time}
        </span>
      </div>

      {goal && (
        <div className="bg-slate-950/65 border border-slate-900 rounded-xl p-3 text-[11px] leading-relaxed text-slate-350">
          <span className="text-[9px] uppercase font-bold text-slate-550 block mb-1">Session Goals:</span>
          {goal}
        </div>
      )}

      {notes && (
        <div className="bg-slate-950/65 border border-slate-900 rounded-xl p-3 text-[11px] leading-relaxed text-slate-350 border-emerald-500/10">
          <span className="text-[9px] uppercase font-bold text-slate-550 block mb-1">Mentor Feedback notes:</span>
          {notes}
        </div>
      )}

      {/* Review trigger */}
      {status === "Completed" && onReviewSubmit && !showReviewForm && (
        <div className="flex justify-end pt-2 border-t border-slate-900">
          <Button onClick={() => setShowReviewForm(true)} className="text-[9px] py-1.5 px-4">
            Leave Feedback Review
          </Button>
        </div>
      )}

      {showReviewForm && (
        <form onSubmit={handleReviewSubmit} className="space-y-3 pt-3 border-t border-slate-900">
          <div className="flex gap-2 items-center">
            <span className="text-[9px] uppercase font-bold text-slate-550">Rating:</span>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="bg-slate-900 border border-slate-850 text-xs text-white rounded px-2 py-0.5"
            >
              <option value={5}>5 Stars</option>
              <option value={4}>4 Stars</option>
              <option value={3}>3 Stars</option>
            </select>
          </div>
          <textarea
            placeholder="Write a brief review..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="w-full bg-slate-900 border border-slate-850 rounded-xl p-2.5 text-xs text-slate-300 outline-none"
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              onClick={() => setShowReviewForm(false)}
              variant="outline"
              className="text-[9px] py-1 px-3"
            >
              Cancel
            </Button>
            <Button type="submit" className="text-[9px] py-1 px-4">
              Submit Review
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
}
