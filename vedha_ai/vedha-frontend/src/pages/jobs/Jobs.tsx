import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

import DashboardLayout from "@/layouts/DashboardLayout";
import JobCard from "@/components/jobs/JobCard";

import {
  getRecommendedJobs,
  refreshJobs,
  type Job,
} from "@/services/jobs";

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [targetRole, setTargetRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  async function loadJobs() {
    try {
      setLoading(true);
      setError("");

      const response = await getRecommendedJobs();

      setJobs(response?.recommended_jobs ?? []);
      setTargetRole(response?.target_role ?? "");
    } catch (err: any) {
      console.error(err);
      setError("Failed to load jobs.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleRefresh() {
    try {
      setRefreshing(true);

      await refreshJobs();
      await loadJobs();
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadJobs();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">
              AI Job Recommendations
            </h1>

            <p className="mt-2 text-slate-400">
              Target Role:
              <span className="ml-2 font-semibold text-cyan-400">
                {targetRole || "Not Available"}
              </span>
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 font-semibold text-white transition hover:bg-cyan-500 disabled:opacity-60"
          >
            <RefreshCw
              size={18}
              className={refreshing ? "animate-spin" : ""}
            />

            {refreshing ? "Refreshing..." : "Refresh Jobs"}
          </button>
        </div>

        {loading && (
          <div className="rounded-2xl bg-slate-900 p-8 text-center text-white">
            Loading jobs...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-400">
            {error}
          </div>
        )}

        {!loading && !error && jobs.length === 0 && (
          <div className="rounded-2xl bg-slate-900 p-8 text-center">
            <h2 className="text-2xl font-bold text-white">
              No Jobs Found
            </h2>

            <p className="mt-2 text-slate-400">
              Click <strong>Refresh Jobs</strong> to fetch the latest jobs.
            </p>
          </div>
        )}

        {!loading && !error && jobs.length > 0 && (
          <div className="grid gap-6">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}