import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Edit2, Trash2, Calendar, MapPin, Briefcase, RefreshCw, X, AlertCircle } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import Button from "@/components/ui/button/Button";
import { toast } from "sonner";
import { getCompanyJobs, createCompanyJob, updateCompanyJob, deleteCompanyJob, type CompanyJob, type CompanyJobCreate } from "@/services/company";

export default function Jobs() {
  const [jobs, setJobs] = useState<CompanyJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<CompanyJob | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm<CompanyJobCreate>();

  async function loadJobs() {
    try {
      setLoading(true);
      setError("");
      const list = await getCompanyJobs();
      setJobs(list);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load jobs. Please check if your company profile is created.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJobs();
  }, []);

  function openCreateModal() {
    setEditingJob(null);
    reset({
      title: "",
      description: "",
      location: "",
      employment_type: "Full-Time",
      experience_level: "Entry-Level",
      salary: "",
      skills: "",
      vacancies: 1,
      application_deadline: "",
      is_active: true,
    });
    setIsModalOpen(true);
  }

  function openEditModal(job: CompanyJob) {
    setEditingJob(job);
    setValue("title", job.title);
    setValue("description", job.description);
    setValue("location", job.location);
    setValue("employment_type", job.employment_type);
    setValue("experience_level", job.experience_level);
    setValue("salary", job.salary ?? "");
    setValue("skills", job.skills ?? "");
    setValue("vacancies", job.vacancies);
    setValue("is_active", job.is_active);
    if (job.application_deadline) {
      setValue("application_deadline", job.application_deadline.split("T")[0]);
    } else {
      setValue("application_deadline", "");
    }
    setIsModalOpen(true);
  }

  async function handleFormSubmit(data: CompanyJobCreate) {
    try {
      const payload = {
        ...data,
        vacancies: Number(data.vacancies) || 1,
        application_deadline: data.application_deadline ? new Date(data.application_deadline).toISOString() : null,
      };

      if (editingJob) {
        await updateCompanyJob(editingJob.id, payload);
        toast.success("Job posting updated successfully!");
      } else {
        await createCompanyJob(payload);
        toast.success("Job posting created successfully!");
      }
      setIsModalOpen(false);
      loadJobs();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.detail ?? "Failed to save job posting.");
    }
  }

  async function handleDeleteJob(jobId: number) {
    if (!window.confirm("Are you sure you want to delete this job posting? This action cannot be undone.")) return;
    try {
      await deleteCompanyJob(jobId);
      toast.success("Job posting deleted!");
      loadJobs();
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to delete job posting.");
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8 font-sans">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Job Postings</h1>
            <p className="mt-2 text-slate-400">
              Create and manage job advertisements to start screening matching students.
            </p>
          </div>
          <div>
            <Button onClick={openCreateModal} className="bg-emerald-600 hover:bg-emerald-500 flex items-center gap-2">
              <Plus size={18} />
              Create Job Posting
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center text-slate-400">
            <RefreshCw size={24} className="animate-spin mr-2" />
            Loading job postings...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 text-center text-amber-400">
            <AlertCircle className="mx-auto mb-2" size={32} />
            <h2 className="text-lg font-bold mb-1">Recruiter Profile Required</h2>
            <p className="text-sm max-w-md mx-auto mb-4">{error}</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center">
            <Briefcase className="mx-auto mb-4 text-slate-600" size={48} />
            <h3 className="text-lg font-bold">No Jobs Posted Yet</h3>
            <p className="mt-2 text-slate-400 max-w-sm mx-auto text-sm">
              Publish your first corporate job posting to recruit talent with matched resume skills.
            </p>
            <Button onClick={openCreateModal} className="mt-6 bg-emerald-600 hover:bg-emerald-500">
              Create Job Listing
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="relative rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm transition duration-300 hover:border-emerald-500/50"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">{job.title}</h3>
                    <p className="text-xs text-emerald-400 font-semibold mt-1 uppercase tracking-wider">
                      {job.experience_level} • {job.employment_type}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      job.is_active ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-800 text-slate-500"
                    }`}
                  >
                    {job.is_active ? "Active" : "Draft"}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-400 border-t border-slate-800/60 pt-4">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {job.location}
                  </span>
                  {job.salary && (
                    <span className="flex items-center gap-1">
                      <span className="font-bold text-slate-300">Est. Salary:</span> {job.salary}
                    </span>
                  )}
                  {job.application_deadline && (
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      Deadline: {new Date(job.application_deadline).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <div className="mt-3">
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{job.description}</p>
                </div>

                {job.skills && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {job.skills.split(",").map((s) => (
                      <span key={s} className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-6 flex justify-end gap-2 border-t border-slate-800/60 pt-4">
                  <button
                    onClick={() => openEditModal(job)}
                    className="flex items-center gap-1 rounded-lg border border-slate-800 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-slate-800 hover:text-white"
                  >
                    <Edit2 size={12} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    className="flex items-center gap-1 rounded-lg border border-red-500/20 px-3 py-1.5 text-xs text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                  >
                    <Trash2 size={12} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
            <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                <h3 className="text-lg font-bold">{editingJob ? "Edit Job Posting" : "New Job Posting"}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Job Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="Software Engineer"
                      {...register("title", { required: true })}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-white placeholder-slate-700 outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Location *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Remote, or New Delhi"
                      {...register("location", { required: true })}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-white placeholder-slate-700 outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Employment Type *</label>
                    <select
                      {...register("employment_type")}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-slate-300 outline-none focus:border-emerald-500"
                    >
                      <option value="Full-Time">Full-Time</option>
                      <option value="Part-Time">Part-Time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Experience Level *</label>
                    <select
                      {...register("experience_level")}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-slate-300 outline-none focus:border-emerald-500"
                    >
                      <option value="Entry-Level">Entry-Level</option>
                      <option value="Mid-Level">Mid-Level</option>
                      <option value="Senior-Level">Senior-Level</option>
                      <option value="Lead/Director">Lead/Director</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Salary Range</label>
                    <input
                      type="text"
                      placeholder="e.g. ₹8,00,000 - ₹12,00,000"
                      {...register("salary")}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-white placeholder-slate-700 outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Vacancies</label>
                    <input
                      type="number"
                      min={1}
                      placeholder="1"
                      {...register("vacancies")}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-white placeholder-slate-700 outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Application Deadline</label>
                    <input
                      type="date"
                      {...register("application_deadline")}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-slate-300 outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="flex items-center gap-2 h-full pt-6">
                    <input
                      type="checkbox"
                      id="is_active"
                      {...register("is_active")}
                      className="h-4 w-4 rounded border-slate-800 bg-slate-950 text-emerald-500 outline-none focus:ring-0 focus:ring-offset-0"
                    />
                    <label htmlFor="is_active" className="text-xs font-semibold text-slate-300 select-none cursor-pointer">
                      Active open listing
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Required Skills (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="Python, React, TypeScript, FastAPI"
                    {...register("skills")}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-white placeholder-slate-700 outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Job Description *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide full description of job role responsibilities..."
                    {...register("description", { required: true })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-white placeholder-slate-700 outline-none focus:border-emerald-500 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 border-t border-slate-800 pt-4 mt-6">
                  <Button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-slate-800 hover:bg-slate-700 text-white"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-500 flex items-center gap-2">
                    {isSubmitting ? <RefreshCw size={16} className="animate-spin" /> : null}
                    Save Listing
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
