import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Calendar, BookOpen, Clock, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/layouts/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import SectionCard from "@/components/dashboard/SectionCard";
import LoadingCard from "@/components/dashboard/LoadingCard";
import Button from "@/components/ui/button/Button";
import {
  getEmployeeStats,
  getResumeReviewRequests,
  getMentorshipSlots,
  type EmployeeDashboardStats,
  type ResumeReviewRequest,
  type MentorshipSlot,
} from "@/services/employee";

export default function EmployeeDashboard() {
  const [stats, setStats] = useState<EmployeeDashboardStats | null>(null);
  const [reviews, setReviews] = useState<ResumeReviewRequest[]>([]);
  const [slots, setSlots] = useState<MentorshipSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const data = await getEmployeeStats();
        setStats(data);
        const revs = await getResumeReviewRequests();
        setReviews(revs.filter(r => r.status === "Pending"));
        const mentorshipSlots = await getMentorshipSlots();
        setSlots(mentorshipSlots);
      } catch {
        toast.error("Failed to load employee metrics.");
      } finally {
        setLoading(false);
      }
    }
    void loadDashboard();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Welcome Header */}
        <div className="border-b border-[#1F2937] pb-8">
          <h1 className="text-[36px] font-bold text-white tracking-tight">
            Mentor Workspace 💼
          </h1>
          <p className="mt-2 text-[#94A3B8] text-[14px]">
            Review student resumes, host mentorship meetings, schedule sessions, and share technical insights.
          </p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Mentorship Hours"
              value={`${stats.mentoringHours} hrs`}
              icon={<Clock size={20} className="text-cyan-400" />}
              color="bg-cyan-500/10 border-cyan-500/20"
              textColor="text-cyan-400"
            />
            <StatCard
              title="Resumes Reviewed"
              value={stats.resumesReviewed}
              icon={<FileText size={20} className="text-emerald-400" />}
              color="bg-emerald-500/10 border-emerald-500/20"
              textColor="text-emerald-400"
            />
            <StatCard
              title="Interviews Set"
              value={stats.mockInterviewsScheduled}
              icon={<Calendar size={20} className="text-violet-400" />}
              color="bg-violet-500/10 border-violet-500/20"
              textColor="text-violet-400"
            />
            <StatCard
              title="Blog Pageviews"
              value={stats.blogEngagement}
              icon={<BookOpen size={20} className="text-amber-400" />}
              color="bg-amber-500/10 border-amber-500/20"
              textColor="text-amber-400"
            />
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Queue column */}
          <div className="lg:col-span-2 space-y-8">
            <SectionCard title="Pending Resume Reviews">
              {reviews.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center text-slate-500 text-xs">
                  All caught up! No pending student resume reviews assigned.
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="flex items-center justify-between rounded-xl border border-slate-850 p-4 bg-slate-950/40"
                    >
                      <div>
                        <h4 className="font-bold text-white text-sm">{rev.studentName}</h4>
                        <p className="text-xs text-slate-400 mt-1">Target role: {rev.targetRole}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Submitted: {rev.submittedAt}</p>
                      </div>
                      <Link to="/employee/resumes">
                        <Button className="text-xs py-1.5 px-4 flex items-center gap-1">
                          Review
                          <ChevronRight size={12} />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>

          {/* Right sidebar */}
          <div className="space-y-8">
            {/* Booked sessions */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                <Calendar size={18} className="text-cyan-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">Upcoming Bookings</h3>
                  <p className="text-[10px] text-slate-500">Mentees schedule bookings</p>
                </div>
              </div>
              
              {slots.filter(s => s.status === "Booked").length === 0 ? (
                <p className="text-xs text-slate-500 italic">No mentorship bookings set for today.</p>
              ) : (
                <div className="space-y-3">
                  {slots.filter(s => s.status === "Booked").map((slot) => (
                    <div key={slot.id} className="rounded-xl bg-slate-950/60 p-3 border border-slate-900">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-white">{slot.studentName}</span>
                        <span className="text-[9px] text-cyan-400">{slot.dateTime}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">Topic: {slot.topic}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
