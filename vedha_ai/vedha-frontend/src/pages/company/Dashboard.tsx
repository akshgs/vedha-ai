import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Users, FileText, CheckCircle, Plus } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import SectionCard from "@/components/dashboard/SectionCard";
import LoadingCard from "@/components/dashboard/LoadingCard";
import { getCompanyJobs, getJobApplications, type CompanyJob, type ApplicationResponse } from "@/services/company";

export default function CompanyDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [jobs, setJobs] = useState<CompanyJob[]>([]);
  const [applications, setApplications] = useState<(ApplicationResponse & { jobTitle: string })[]>([]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        setError("");
        const companyJobs = await getCompanyJobs();
        setJobs(companyJobs);

        // Fetch applications for each job
        const allApps: (ApplicationResponse & { jobTitle: string })[] = [];
        await Promise.all(
          companyJobs.map(async (job) => {
            try {
              const apps = await getJobApplications(job.id);
              apps.forEach((app) => {
                allApps.push({ ...app, jobTitle: job.title });
              });
            } catch (err) {
              console.error(`Failed to fetch apps for job ${job.id}`, err);
            }
          })
        );
        setApplications(allApps);
      } catch (err: any) {
        console.error(err);
        setError("Failed to load dashboard data. Ensure your company profile is created.");
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
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
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 text-center text-amber-400">
          <h2 className="text-xl font-bold mb-2">Setup Required</h2>
          <p className="mb-4">{error}</p>
          <Link
            to="/company/profile"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-500"
          >
            Create Company Profile
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const activeJobs = jobs.filter((j) => j.is_active).length;
  const totalApplicants = applications.length;
  const screeningApps = applications.filter((a) => a.status === "screening" || a.status === "applied").length;

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">Recruitment Hub 🏢</h1>
            <p className="mt-2 text-slate-400">
              Manage corporate job listings, screen candidate matches, and review scheduled interviews.
            </p>
          </div>
          <div>
            <Link
              to="/company/jobs"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-emerald-500"
            >
              <Plus size={18} />
              Post a New Job
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Job Postings"
            value={jobs.length}
            icon={<Briefcase size={28} className="text-white" />}
            color="bg-emerald-600"
            textColor="text-emerald-400"
          />

          <StatCard
            title="Active Job Openings"
            value={activeJobs}
            icon={<CheckCircle size={28} className="text-white" />}
            color="bg-teal-600"
            textColor="text-teal-400"
          />

          <StatCard
            title="Total Applications"
            value={totalApplicants}
            icon={<Users size={28} className="text-white" />}
            color="bg-indigo-600"
            textColor="text-indigo-400"
          />

          <StatCard
            title="Screening Required"
            value={screeningApps}
            icon={<FileText size={28} className="text-white" />}
            color="bg-amber-600"
            textColor="text-amber-400"
          />
        </div>

        {/* Dynamic Lists */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Active Job Openings List */}
          <SectionCard title="Active Jobs List">
            {jobs.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center text-slate-500 text-sm">
                No jobs posted yet. Create your first listing to start hiring!
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.slice(0, 5).map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-900/20 p-4 transition duration-200 hover:border-emerald-500/40 hover:bg-slate-900/60"
                  >
                    <div>
                      <h4 className="font-semibold text-white text-sm">{job.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        {job.location} • {job.employment_type}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        job.is_active ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-800 text-slate-500"
                      }`}
                    >
                      {job.is_active ? "Active" : "Closed"}
                    </span>
                  </div>
                ))}
                {jobs.length > 5 && (
                  <div className="text-center pt-2">
                    <Link to="/company/jobs" className="text-xs text-emerald-400 hover:underline">
                      View all {jobs.length} jobs →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </SectionCard>

          {/* Recent Applications List */}
          <SectionCard title="Recent Candidate Applications">
            {applications.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center text-slate-500 text-sm">
                No candidates have applied to your active listings yet.
              </div>
            ) : (
              <div className="space-y-4">
                {applications.slice(0, 5).map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-900/20 p-4 transition duration-200 hover:border-indigo-500/40 hover:bg-slate-900/60"
                  >
                    <div>
                      <h4 className="font-semibold text-white text-sm">Candidate ID: #{app.student_id}</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Applied to: <span className="text-indigo-300 font-medium">{app.jobTitle}</span>
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        app.status === "offer" || app.status === "accepted"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : app.status === "rejected"
                          ? "bg-red-500/10 text-red-400"
                          : "bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                ))}
                {applications.length > 5 && (
                  <div className="text-center pt-2">
                    <Link to="/company/applicants" className="text-xs text-indigo-400 hover:underline">
                      Manage all applicants →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </SectionCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
