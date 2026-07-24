import { useEffect, useState } from "react";
import { Users, FileText, RefreshCw, X } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { toast } from "sonner";
import { getCompanyJobs, getJobApplications, updateApplicationStatus, type CompanyJob, type ApplicationResponse } from "@/services/company";

export default function Applicants() {
  const [jobs, setJobs] = useState<CompanyJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number | "">("");
  const [applicants, setApplicants] = useState<ApplicationResponse[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [activeApp, setActiveApp] = useState<ApplicationResponse | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  async function loadJobs() {
    try {
      setLoadingJobs(true);
      const list = await getCompanyJobs();
      setJobs(list);
      if (list.length > 0) {
        setSelectedJobId(list[0].id);
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load jobs list.");
    } finally {
      setLoadingJobs(false);
    }
  }

  async function loadApplicants(jobId: number) {
    try {
      setLoadingApplicants(true);
      const list = await getJobApplications(jobId);
      setApplicants(list);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load candidate applications.");
    } finally {
      setLoadingApplicants(false);
    }
  }

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    if (selectedJobId) {
      loadApplicants(selectedJobId);
    } else {
      setApplicants([]);
    }
  }, [selectedJobId]);

  async function handleStatusChange(appId: number, status: string) {
    setUpdatingStatus(true);
    try {
      await updateApplicationStatus(appId, status);
      toast.success(`Candidacy status updated to: ${status}`);
      if (selectedJobId) {
        await loadApplicants(selectedJobId);
      }
      setActiveApp(null);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to update candidate status.");
    } finally {
      setUpdatingStatus(false);
    }
  }

  if (loadingJobs) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center text-slate-400">
          <RefreshCw size={24} className="animate-spin mr-2" />
          Loading jobs filter...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8 font-sans">
        <div>
          <h1 className="text-3xl font-bold">Applicants Tracker</h1>
          <p className="mt-2 text-slate-400">
            Review candidate applications and manage screening status pipelines.
          </p>
        </div>

        {jobs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center">
            <Users className="mx-auto mb-4 text-slate-600" size={48} />
            <h3 className="text-lg font-bold">No Active Openings</h3>
            <p className="mt-2 text-slate-400 max-w-sm mx-auto text-sm">
              You must have posted job listings before you can receive applicant profiles.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Filter Row */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center bg-slate-900/40 p-4 rounded-xl border border-slate-800">
              <label className="text-sm font-semibold text-slate-300">Select Job Listing:</label>
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(Number(e.target.value))}
                className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-slate-300 outline-none focus:border-emerald-500 max-w-md"
              >
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title} ({job.location})
                  </option>
                ))}
              </select>
            </div>

            {loadingApplicants ? (
              <div className="flex h-48 items-center justify-center text-slate-400">
                <RefreshCw size={24} className="animate-spin mr-2" />
                Loading applicants...
              </div>
            ) : applicants.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-800 p-12 text-center text-slate-400 text-sm">
                No candidates have applied to this job posting yet.
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl backdrop-blur-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/60 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      <th className="p-4">Candidate ID</th>
                      <th className="p-4">Apply Date</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-sm">
                    {applicants.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-900/40 transition">
                        <td className="p-4 font-semibold text-white">Student Account #{app.student_id}</td>
                        <td className="p-4 text-slate-400">
                          {new Date(app.created_at).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="p-4">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                              app.status === "offer" || app.status === "accepted"
                                ? "bg-emerald-500/10 text-emerald-400"
                                : app.status === "rejected"
                                ? "bg-red-500/10 text-red-400"
                                : "bg-amber-500/10 text-amber-400"
                            }`}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => setActiveApp(app)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
                          >
                            <FileText size={12} />
                            Review Cover Letter & Status
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Review Candidate cover letter / status update modal */}
        {activeApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                <h3 className="text-lg font-bold">Review Candidate #{activeApp.student_id}</h3>
                <button onClick={() => setActiveApp(null)} className="text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Candidacy Status</h4>
                  <p className="text-sm font-semibold text-white">Current status is: <span className="text-amber-400 uppercase">{activeApp.status}</span></p>
                </div>

                <div className="border-t border-slate-800 pt-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Update Stage</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      disabled={updatingStatus}
                      onClick={() => handleStatusChange(activeApp.id, "screening")}
                      className="px-3 py-2 bg-slate-800 text-xs font-bold rounded-xl text-slate-300 hover:bg-slate-700 transition"
                    >
                      Move to Screening
                    </button>
                    <button
                      disabled={updatingStatus}
                      onClick={() => handleStatusChange(activeApp.id, "interview")}
                      className="px-3 py-2 bg-indigo-600/20 border border-indigo-500/30 text-xs font-bold rounded-xl text-indigo-300 hover:bg-indigo-600/30 transition"
                    >
                      Schedule Interview
                    </button>
                    <button
                      disabled={updatingStatus}
                      onClick={() => handleStatusChange(activeApp.id, "offer")}
                      className="px-3 py-2 bg-emerald-600/20 border border-emerald-500/30 text-xs font-bold rounded-xl text-emerald-300 hover:bg-emerald-600/30 transition"
                    >
                      Extend Offer
                    </button>
                    <button
                      disabled={updatingStatus}
                      onClick={() => handleStatusChange(activeApp.id, "rejected")}
                      className="px-3 py-2 bg-red-600/20 border border-red-500/30 text-xs font-bold rounded-xl text-red-300 hover:bg-red-600/30 transition"
                    >
                      Reject Application
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
