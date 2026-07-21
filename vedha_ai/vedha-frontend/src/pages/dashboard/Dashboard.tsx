import { useEffect, useState } from "react";
import {
  Briefcase,
  FileText,
  GraduationCap,
  MessageSquare,
} from "lucide-react";

import DashboardLayout from "@/layouts/DashboardLayout";

import StatCard from "@/components/dashboard/StatCard";
import SectionCard from "@/components/dashboard/SectionCard";
import LoadingCard from "@/components/dashboard/LoadingCard";
import QuickActions from "@/components/dashboard/QuickActions";
import ProgressCard from "@/components/dashboard/ProgressCard";
import AIInsights from "@/components/dashboard/AIInsights";
import ActivityTimeline from "@/components/dashboard/ActivityTimeline";
import InterviewChart from "@/components/charts/InterviewChart";
import ResumeGauge from "@/components/charts/ResumeGauge";
import WeeklyProgress from "@/components/charts/WeeklyProgress";
import {
  getDashboard,
  type DashboardResponse,
} from "@/services/dashboard";

export default function Dashboard() {
  const [dashboard, setDashboard] =
    useState<DashboardResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const data = await getDashboard();
        setDashboard(data);
      } catch (err: any) {
        console.error(err);

        setError(
          err?.response?.data?.detail ??
            "Failed to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
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

  if (error) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-400">
          {error}
        </div>
      </DashboardLayout>
    );
  }

  if (!dashboard) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-300">
          No dashboard data available.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}

        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">
              Welcome back, {dashboard.student_name} 👋
            </h1>

            <p className="mt-2 text-slate-400">
              Ready to continue your AI career journey?
            </p>
          </div>

          <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-5 py-3">
            <p className="text-sm text-cyan-300">
              Career Readiness
            </p>

            <h2 className="text-3xl font-bold text-cyan-400">
              {dashboard.career_readiness}%
            </h2>
          </div>
        </div>

        {/* Stats */}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          <StatCard
            title="Resume Score"
            value={`${dashboard.resume_score}%`}
            icon={<FileText size={28} className="text-white" />}
            color="bg-cyan-600"
            textColor="text-cyan-400"
          />

          <StatCard
            title="Total Jobs"
            value={dashboard.total_jobs}
            icon={<Briefcase size={28} className="text-white" />}
            color="bg-emerald-600"
            textColor="text-emerald-400"
          />

          <StatCard
            title="Roadmap Progress"
            value={`${dashboard.roadmap_progress}%`}
            icon={<GraduationCap size={28} className="text-white" />}
            color="bg-violet-600"
            textColor="text-violet-400"
          />

          <StatCard
            title="Interviews"
            value={dashboard.total_interviews}
            icon={<MessageSquare size={28} className="text-white" />}
            color="bg-amber-600"
            textColor="text-amber-400"
          />

        </div>

        {/* Quick Actions */}

        <SectionCard title="Quick Actions">
          <QuickActions />
        </SectionCard>

        {/* Progress */}

        <div className="grid gap-6 lg:grid-cols-2">

          <ProgressCard
            title="Career Readiness"
            value={dashboard.career_readiness}
            color="bg-cyan-500"
          />

          <ProgressCard
            title="Roadmap Progress"
            value={dashboard.roadmap_progress}
            color="bg-violet-500"
          />

        </div>

        {/* AI Insights */}

        <SectionCard title="AI Insights">
          <AIInsights
            resumeScore={dashboard.resume_score}
            roadmapProgress={dashboard.roadmap_progress}
            completedInterviews={dashboard.completed_interviews}
            totalJobs={dashboard.total_jobs}
          />
        </SectionCard>

        {/* Analytics */}

        <div className="grid gap-6 lg:grid-cols-2">
          <WeeklyProgress />

          <ResumeGauge
            score={dashboard.resume_score}
          />
        </div>

        <div className="mt-6">
          <InterviewChart
            score={dashboard.average_interview_score}
          />
        </div>

        {/* Career Summary */}

        <SectionCard title="Career Summary">

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

            <div>
              <p className="text-slate-400">
                Completed Interviews
              </p>

              <h3 className="mt-2 text-3xl font-bold text-cyan-400">
                {dashboard.completed_interviews}
              </h3>
            </div>

            <div>
              <p className="text-slate-400">
                Average Score
              </p>

              <h3 className="mt-2 text-3xl font-bold text-emerald-400">
                {dashboard.average_interview_score}%
              </h3>
            </div>

            <div>
              <p className="text-slate-400">
                Best Score
              </p>

              <h3 className="mt-2 text-3xl font-bold text-violet-400">
                {dashboard.best_interview_score}%
              </h3>
            </div>

            <div>
              <p className="text-slate-400">
                Career Readiness
              </p>

              <h3 className="mt-2 text-3xl font-bold text-amber-400">
                {dashboard.career_readiness}%
              </h3>
            </div>

          </div>

        </SectionCard>

        {/* Recent Interviews */}

        <SectionCard title="Recent Interviews">

          {dashboard.recent_interviews.length === 0 ? (

            <div className="rounded-xl border border-dashed border-slate-700 p-10 text-center">
              <MessageSquare className="mx-auto mb-4 h-12 w-12 text-slate-500" />

              <h3 className="text-lg font-semibold">
                No Interviews Yet
              </h3>

              <p className="mt-2 text-slate-400">
                Start your first AI interview from the Interview AI page.
              </p>
            </div>

          ) : (

            <div className="space-y-4">

              {dashboard.recent_interviews.map((item) => {

                const statusLabel =
                  item.status === "in_progress"
                    ? "In Progress"
                    : item.status === "completed"
                    ? "Completed"
                    : item.status;

                return (
                  <div
                    key={item.interview_id}
                    className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-5 transition-all duration-300 hover:scale-[1.02] hover:border-cyan-500 hover:bg-slate-900"
                  >

                    <div>

                      <h3 className="text-lg font-semibold text-white">
                        {item.target_role}
                      </h3>

                      <p className="mt-1 text-sm text-slate-400">
                        {new Date(item.created_at).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </p>

                    </div>

                    <div className="text-right">

                      <span
                        className={`rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-wide ${
                          item.status === "completed"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {statusLabel}
                      </span>

                      <p className="mt-3 text-xl font-bold text-cyan-400">
                        {item.overall_score !== null
                          ? `${item.overall_score}%`
                          : "Pending"}
                      </p>

                    </div>

                  </div>
                );
              })}

            </div>

          )}

        </SectionCard>

        {/* Recent Activity */}

        <SectionCard title="Recent Activity">
          <ActivityTimeline />
        </SectionCard>

        {/* Footer */}

        <footer className="border-t border-slate-800 py-6 text-center text-sm text-slate-500">
          Vedha AI © 2026 • Career Intelligence Platform
        </footer>

      </div>
    </DashboardLayout>
  );
}