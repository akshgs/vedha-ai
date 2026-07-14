import { useEffect, useState } from "react";

import DashboardLayout from "@/layouts/DashboardLayout";
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

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold">
            Dashboard Overview
          </h2>

          <p className="mt-2 text-slate-400">
            Welcome back{" "}
            <span className="font-semibold text-cyan-400">
              {dashboard?.student_name ?? "Student"}
            </span>
            .
          </p>
        </div>

        {loading && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-300">
            Loading dashboard...
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        {!loading && dashboard && (
          <>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <p className="text-slate-400">
                  Resume Score
                </p>

                <h3 className="mt-3 text-4xl font-bold text-cyan-400">
                  {dashboard.resume_score}%
                </h3>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <p className="text-slate-400">
                  Total Jobs
                </p>

                <h3 className="mt-3 text-4xl font-bold text-emerald-400">
                  {dashboard.total_jobs}
                </h3>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <p className="text-slate-400">
                  Roadmap Progress
                </p>

                <h3 className="mt-3 text-4xl font-bold text-violet-400">
                  {dashboard.roadmap_progress}%
                </h3>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <p className="text-slate-400">
                  Interviews
                </p>

                <h3 className="mt-3 text-4xl font-bold text-amber-400">
                  {dashboard.total_interviews}
                </h3>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h3 className="mb-4 text-xl font-bold">
                Career Summary
              </h3>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div>
                  <p className="text-slate-400">
                    Completed Interviews
                  </p>

                  <p className="mt-2 text-2xl font-bold">
                    {dashboard.completed_interviews}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400">
                    Average Score
                  </p>

                  <p className="mt-2 text-2xl font-bold">
                    {dashboard.average_interview_score}%
                  </p>
                </div>

                <div>
                  <p className="text-slate-400">
                    Best Score
                  </p>

                  <p className="mt-2 text-2xl font-bold">
                    {dashboard.best_interview_score}%
                  </p>
                </div>

                <div>
                  <p className="text-slate-400">
                    Career Readiness
                  </p>

                  <p className="mt-2 text-2xl font-bold text-cyan-400">
                    {dashboard.career_readiness}%
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h3 className="mb-4 text-xl font-bold">
                Recent Interviews
              </h3>

              {dashboard.recent_interviews.length === 0 ? (
                <p className="text-slate-400">
                  No interview history yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {dashboard.recent_interviews.map(
                    (interview) => (
                      <div
                        key={interview.interview_id}
                        className="flex items-center justify-between rounded-xl bg-slate-800 p-4"
                      >
                        <div>
                          <p className="font-semibold">
                            {interview.target_role}
                          </p>

                          <p className="text-sm text-slate-400">
                            {interview.status}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-xl font-bold text-cyan-400">
                            {interview.overall_score}%
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}