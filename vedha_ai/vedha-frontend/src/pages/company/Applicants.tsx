import { useEffect, useState } from "react";
import { Users, FileText, RefreshCw, X } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { toast } from "sonner";
import { getCompanyJobs, getJobApplications, updateApplicationStatus, type CompanyJob, type ApplicationResponse } from "@/services/company";

import { api } from "@/services/api";

export default function Applicants() {
  const [jobs, setJobs] = useState<CompanyJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number | "">("");
  const [applicants, setApplicants] = useState<ApplicationResponse[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [activeApp, setActiveApp] = useState<ApplicationResponse | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [studentProfile, setStudentProfile] = useState<any | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    const app = activeApp;
    if (app) {
      async function fetchProfile(targetApp: typeof app) {
        if (!targetApp) return;
        try {
          setLoadingProfile(true);
          const res = await api.get(`/profile/student/${targetApp.student_id}`);
          setStudentProfile(res.data);
        } catch (err) {
          console.error(err);
          toast.error("Failed to load candidate verified scorecard.");
        } finally {
          setLoadingProfile(false);
        }
      }
      fetchProfile(app);
    } else {
      setStudentProfile(null);
    }
  }, [activeApp]);

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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Review Candidate: {studentProfile?.name || `Student #${activeApp.student_id}`}</h3>
                  <p className="text-xs text-slate-450 mt-0.5">{studentProfile?.degree} • {studentProfile?.college}</p>
                </div>
                <button onClick={() => setActiveApp(null)} className="text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              {loadingProfile ? (
                <div className="flex h-48 items-center justify-center text-slate-400">
                  <RefreshCw size={20} className="animate-spin mr-2 text-emerald-400" />
                  Retrieving candidate verified career scorecard...
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Scorecard Layout */}
                  <div className="grid gap-6 md:grid-cols-2">
                    
                    {/* Left Column: Bio, Skills & Projects */}
                    <div className="space-y-4 text-xs">
                      <div>
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target Objective</h4>
                        <p className="text-sm font-bold text-cyan-400 mt-1">{studentProfile?.target_role}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Candidate Bio</h4>
                        <p className="text-slate-350 leading-relaxed mt-1">{studentProfile?.about}</p>
                      </div>

                      <div>
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Verified Ecosystem Skills</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {studentProfile?.skills?.map((s: string) => (
                            <span key={s} className="rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-400 font-semibold">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Verified Project Portfolio</h4>
                        <div className="space-y-1.5">
                          {studentProfile?.projects?.map((p: string, idx: number) => (
                            <div key={idx} className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-850 text-slate-350">
                              {p}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Column: AI & Performance Scores */}
                    <div className="space-y-4 rounded-xl bg-slate-950/40 border border-slate-850 p-4">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-850 pb-2 mb-2">Verified Performance Metrics</h4>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400">Career Readiness Quotient</span>
                        <span className="text-sm font-black text-cyan-400">{studentProfile?.career_readiness}%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: `${studentProfile?.career_readiness}%` }} />
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs font-semibold text-slate-400">Resume Quality (ATS Alignment)</span>
                        <span className="text-sm font-black text-orange-400">{studentProfile?.resume_score}%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${studentProfile?.resume_score}%` }} />
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs font-semibold text-slate-400">AI Mock Interview Score</span>
                        <span className="text-sm font-black text-pink-400">{studentProfile?.interview_score}%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-pink-500 h-1.5 rounded-full" style={{ width: `${studentProfile?.interview_score}%` }} />
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs font-semibold text-slate-400">Learning Roadmap Progress</span>
                        <span className="text-sm font-black text-violet-400">{studentProfile?.learning_progress}%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-violet-500 h-1.5 rounded-full" style={{ width: `${studentProfile?.learning_progress}%` }} />
                      </div>
                    </div>

                  </div>

                  {/* Status Action Row */}
                  <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Application Status</h4>
                      <p className="text-xs font-semibold text-slate-300 mt-0.5">Current stage is: <span className="text-amber-400 uppercase font-black">{activeApp.status}</span></p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        disabled={updatingStatus}
                        onClick={() => handleStatusChange(activeApp.id, "screening")}
                        className="px-3.5 py-2 bg-slate-800 text-xs font-bold rounded-lg text-slate-350 hover:bg-slate-700 transition"
                      >
                        Screening
                      </button>
                      <button
                        disabled={updatingStatus}
                        onClick={() => handleStatusChange(activeApp.id, "interview")}
                        className="px-3.5 py-2 bg-indigo-650/20 border border-indigo-500/30 text-xs font-bold rounded-lg text-indigo-400 hover:bg-indigo-650/30 transition"
                      >
                        Schedule Interview
                      </button>
                      <button
                        disabled={updatingStatus}
                        onClick={() => handleStatusChange(activeApp.id, "offer")}
                        className="px-3.5 py-2 bg-emerald-650/20 border border-emerald-500/30 text-xs font-bold rounded-lg text-emerald-400 hover:bg-emerald-650/30 transition"
                      >
                        Extend Offer
                      </button>
                      <button
                        disabled={updatingStatus}
                        onClick={() => handleStatusChange(activeApp.id, "rejected")}
                        className="px-3.5 py-2 bg-red-650/20 border border-red-500/30 text-xs font-bold rounded-lg text-red-400 hover:bg-red-650/30 transition"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
