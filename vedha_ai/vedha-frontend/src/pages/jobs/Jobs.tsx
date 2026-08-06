import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  RefreshCw,
  Briefcase,
  Bookmark,
  Send,
  Compass,
  AlertCircle,
  Building,
  MapPin,
  Clock,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/layouts/DashboardLayout";
import Button from "@/components/ui/button/Button";
import Card from "@/components/ui/card/Card";
import Modal from "@/components/ui/modal/Modal";
import { getRecommendedJobs, refreshJobs, getJobMatchScore, type Job } from "@/services/jobs";
import { getRoadmap } from "@/services/roadmap";


// Mock saved and tracking data
const INITIAL_TRACKED_JOBS = [
  { id: 201, title: "Backend Developer", company: "Google DeepMind", location: "Bangalore (Remote)", status: "Interviewing", date: "2026-07-22", step: 3 },
  { id: 202, title: "Full Stack Engineer", company: "Meta", location: "Hyderabad", status: "Applied", date: "2026-07-24", step: 1 },
  { id: 203, title: "Machine Learning Dev", company: "Vedha AI Inc", location: "Mumbai", status: "Offered", date: "2026-07-18", step: 5 },
];

interface CompanyPreview {
  name: string;
  industry: string;
  size: string;
  location: string;
  website: string;
  desc: string;
  openRoles: number;
}

const MOCK_COMPANIES: Record<string, CompanyPreview> = {
  "Google DeepMind": {
    name: "Google DeepMind",
    industry: "Artificial Intelligence",
    size: "10,000+ employees",
    location: "Bangalore / London",
    website: "https://deepmind.google",
    desc: "We are a team of scientists, engineers, machine learning experts and more, working together to build the next generation of AI systems safely.",
    openRoles: 14,
  },
  "Meta": {
    name: "Meta",
    industry: "Social Technology",
    size: "50,000+ employees",
    location: "Hyderabad / Menlo Park",
    website: "https://meta.com",
    desc: "Meta builds technologies that help people connect, find communities, and grow businesses. We are focusing on AI infrastructure and virtual workspaces.",
    openRoles: 8,
  },
  "Vedha AI Inc": {
    name: "Vedha AI Inc",
    industry: "EdTech & Career Intelligence",
    size: "50-200 employees",
    location: "Mumbai",
    website: "https://vedha.ai",
    desc: "Vedha AI is leading the charge in student evaluation, placement automation, and interactive coding sandboxes driven by advanced LLMs.",
    openRoles: 5,
  },
};

import PageHeader from "@/components/ui/layout/PageHeader";

export default function Jobs() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"recommended" | "saved" | "applied">("recommended");

  const [jobs, setJobs] = useState<Job[]>([]);
  const [targetRole, setTargetRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // Saved / Tracked states
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [trackedJobs, setTrackedJobs] = useState(INITIAL_TRACKED_JOBS);
  const [selectedJobMatch, setSelectedJobMatch] = useState<any>(null);
  async function handleViewJobGaps(jobId: number) {
    try {
      const match = await getJobMatchScore(jobId);
      setSelectedJobMatch(match);
    } catch {
      toast.error("Failed to load AI job compatibility assessment.");
    }
  }

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedType, setSelectedType] = useState("All");

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.company ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.description ?? "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLocation =
      selectedLocation === "All" ||
      (job.location ?? "").toLowerCase().includes(selectedLocation.toLowerCase());

    const matchesType =
      selectedType === "All" ||
      (job.job_type ?? "fulltime").toLowerCase() === selectedType.toLowerCase() ||
      (job.job_type ?? "fulltime").toLowerCase().replace("-", "") === selectedType.toLowerCase();

    return matchesSearch && matchesLocation && matchesType;
  });

  // Modals state
  const [selectedCompany, setSelectedCompany] = useState<CompanyPreview | null>(null);
  const [timelineJob, setTimelineJob] = useState<typeof INITIAL_TRACKED_JOBS[0] | null>(null);

  const [roadmapProgress, setRoadmapProgress] = useState(0);

  async function loadJobs() {
    try {
      setLoading(true);
      setError("");
      const [response, roadmapData] = await Promise.all([
        getRecommendedJobs(),
        getRoadmap().catch(() => ({ completion: 0 } as any))
      ]);
      setJobs(response?.recommended_jobs ?? []);
      setTargetRole(response?.target_role ?? "");
      setRoadmapProgress(roadmapData.completion);
    } catch (err) {
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
      toast.success("Job listings refreshed based on your latest resume analysis!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to refresh jobs.");
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    const init = async () => {
      await loadJobs();
    };
    void init();
  }, []);

  function handleSaveJob(job: Job) {
    if (savedJobs.some((s) => s.id === job.id)) {
      setSavedJobs(savedJobs.filter((s) => s.id !== job.id));
      toast.info("Job removed from saved bookmarks.");
    } else {
      setSavedJobs([...savedJobs, job]);
      toast.success("Job saved to your profile!");
    }
  }

  function handleApplyJob(job: Job) {
    if (trackedJobs.some((t) => t.id === job.id)) {
      toast.warning("You have already applied for this job!");
      return;
    }
    
    const newTrack = {
      id: job.id,
      title: job.title,
      company: job.company ?? "Enterprise Corp",
      location: job.location ?? "Remote",
      status: "Applied",
      date: new Date().toISOString().split("T")[0],
      step: 1,
    };
    
    setTrackedJobs([newTrack, ...trackedJobs]);
    toast.success(`Application sent to ${job.company}! Track status in Application Tracker.`);
  }

  function openCompanyModal(companyName: string) {
    const info = MOCK_COMPANIES[companyName] || {
      name: companyName,
      industry: "Information Technology",
      size: "1,000-5,000 employees",
      location: "India (Remote)",
      website: "https://google.com",
      desc: "Leading technological systems and digital transformations integrations.",
      openRoles: 3,
    };
    setSelectedCompany(info);
  }

  const TIMELINE_STEPS = [
    { title: "Applied", desc: "Resume submitted and shared with recruitment desk." },
    { title: "Resume Screening", desc: "ATS checklist verification score assessment." },
    { title: "Technical Round", desc: "Algorithms evaluation sandbox coding session." },
    { title: "Managerial / HR", desc: "Behavioral compatibility discussion." },
    { title: "Decision / Offer", desc: "Final negotiations package dispatch." },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        
        {/* Master Page Header */}
        <PageHeader
          title="Ecosystem Job Board"
          subtitle={`Target Role: ${targetRole || "Software Engineer"} • Explore AI-matched opportunities across active partners.`}
          icon={<Briefcase size={22} />}
          action={
            <div className="flex rounded-xl bg-[#111827] p-1 border border-[#1F2937]">
              {[
                { id: "recommended", label: "AI Recommended", icon: Compass },
                { id: "saved", label: "Saved Jobs", icon: Bookmark },
                { id: "applied", label: "Application Tracker", icon: Send },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as "recommended" | "saved" | "applied")}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-[#3B82F6] text-white shadow-md"
                        : "text-[#94A3B8] hover:text-white"
                    }`}
                  >
                    <Icon size={13} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          }
        />

        {roadmapProgress < 30 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-slate-800 bg-slate-900/40 shadow-2xl backdrop-blur-xl max-w-2xl mx-auto space-y-6 mt-12 animate-fade-in">
            <div className="rounded-2xl bg-cyan-500/10 p-4 border border-cyan-500/20 text-cyan-400">
              <Lock size={36} className="animate-pulse" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white tracking-tight">Job Board Locked</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                To protect student ecosystem preparation, the Job Marketplace only unlocks after completing at least <strong className="text-cyan-400">30%</strong> of your personal learning roadmap milestones.
              </p>
            </div>
            <div className="rounded-xl bg-slate-950/60 p-4 border border-slate-850 text-[11px] text-slate-500 text-left w-full">
              <span className="block font-bold text-slate-400 uppercase tracking-wider mb-1">Unlock Requirements</span>
              <ul className="list-disc pl-4 space-y-1">
                <li>Your current roadmap progress is: <strong className="text-cyan-400">{roadmapProgress}%</strong></li>
                <li>Prerequisites: Complete foundations and core technology modules first.</li>
              </ul>
            </div>
            <Button
              onClick={() => navigate("/student/learning")}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 text-xs px-8 py-2.5 font-bold"
            >
              Resume My Learning Roadmap
            </Button>
          </div>
        ) : (
          <>
            {/* Tab 1: AI Recommended Jobs */}
        {activeTab === "recommended" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">

              <Button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 text-xs"
              >
                <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
                {refreshing ? "Re-matching..." : "Refresh Matches"}
              </Button>
            </div>

            {loading ? (
              <div className="ve-card p-12 text-center text-slate-400 animate-pulse">
                Analyzing match metrics and loading jobs...
              </div>
            ) : error ? (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-red-400 text-xs">
                {error}
              </div>
            ) : jobs.length === 0 ? (
              <Card variant="glass" className="ve-empty-state">
                <AlertCircle size={28} className="ve-empty-state-icon" />
                <h3 className="ve-empty-state-title">No Recommendations Found</h3>
                <p className="ve-empty-state-desc">Upload a resume or check skills gap suggestions to fetch matched roles.</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {/* Search & Filters Controls */}
                <div className="grid gap-3 md:grid-cols-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-850">
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      placeholder="Search jobs by title, company, or keywords..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500/50 transition-colors cursor-pointer"
                    >
                      <option value="All">All Locations</option>
                      <option value="Remote">Remote</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Hyderabad">Hyderabad</option>
                    </select>
                  </div>
                  <div>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500/50 transition-colors cursor-pointer"
                    >
                      <option value="All">All Job Types</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                </div>

                {filteredJobs.length === 0 ? (
                  <Card variant="glass" className="ve-empty-state py-12">
                    <AlertCircle size={28} className="ve-empty-state-icon" />
                    <h3 className="ve-empty-state-title">No Matching Jobs Found</h3>
                    <p className="ve-empty-state-desc">Try modifying or clearing your search term and filters.</p>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {filteredJobs.map((job) => {
                      const isSaved = savedJobs.some((s) => s.id === job.id);
                      return (
                        <Card key={job.id} variant="interactive" className="p-5 flex flex-col justify-between sm:flex-row sm:items-center gap-4">
                          <div className="space-y-1.5 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm font-semibold text-white truncate">{job.title}</h4>
                              <span className="rounded bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 px-2 py-0.5 text-xs font-bold">
                                {job.match_percent ?? 85}% Match
                              </span>
                              <button
                                onClick={() => handleViewJobGaps(job.id)}
                                className="text-[10px] text-cyan-400 hover:text-cyan-300 font-extrabold underline ml-2 transition"
                              >
                                View AI Gaps Analysis
                              </button>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                              <button
                                onClick={() => openCompanyModal(job.company ?? "Google")}
                                className="flex items-center gap-1 hover:text-cyan-400 transition text-left cursor-pointer"
                              >
                                <Building size={12} /> <span className="underline">{job.company ?? "Corporate"}</span>
                              </button>
                              <span className="flex items-center gap-1"><MapPin size={12} /> {job.location ?? "Remote"}</span>
                            </div>
                            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed pt-1.5">
                              {job.description || "Seeking developer to configure REST APIs and web interfaces."}
                            </p>
                          </div>

                          <div className="flex gap-2 items-center shrink-0 self-end sm:self-auto">
                            <button
                              onClick={() => handleSaveJob(job)}
                              className="rounded-xl border border-slate-800 bg-slate-900/40 p-2 text-slate-400 hover:text-white hover:border-slate-700 transition cursor-pointer"
                            >
                              <Bookmark size={14} className={isSaved ? "fill-cyan-400 text-cyan-400" : ""} />
                            </button>
                            <Button onClick={() => handleApplyJob(job)} className="text-xs">
                              Apply Now
                            </Button>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Saved Jobs */}
        {activeTab === "saved" && (
          <div className="space-y-6">
            {savedJobs.length === 0 ? (
              <Card variant="glass" className="ve-empty-state">
                <Bookmark size={28} className="ve-empty-state-icon" />
                <h3 className="ve-empty-state-title">No Saved Jobs</h3>
                <p className="ve-empty-state-desc">Bookmark recommended roles to view them later.</p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {savedJobs.map((job) => (
                  <Card key={job.id} variant="default" className="p-5 flex justify-between items-center gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-white">{job.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">{job.company} • {job.location}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleApplyJob(job)} className="text-xs py-1.5 px-4">
                        Apply Now
                      </Button>
                      <button
                        onClick={() => handleSaveJob(job)}
                        className="rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Application Tracker */}
        {activeTab === "applied" && (
          <Card variant="default" className="p-6">
            <h3 className="text-base font-semibold text-white border-b border-slate-800 pb-3 mb-5">Application Tracker</h3>
            <div className="grid gap-2 divide-y divide-slate-800/60">
              {trackedJobs.map((track) => (
                <div key={track.id} className="py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between first:pt-0">
                  <div>
                    <h4 className="text-sm font-semibold text-white">{track.title}</h4>
                    <button
                      onClick={() => openCompanyModal(track.company)}
                      className="text-xs text-slate-400 mt-1 hover:text-cyan-400 underline block text-left cursor-pointer"
                    >
                      {track.company} • {track.location}
                    </button>
                  </div>

                  <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
                    <span className="text-xs text-slate-500">Applied {track.date}</span>
                    <span
                      className={`rounded px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                        track.status === "Offered"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"
                          : track.status === "Interviewing"
                          ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/25"
                          : "bg-slate-850 text-slate-400 border border-slate-800"
                      }`}
                    >
                      {track.status}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => setTimelineJob(track)}
                      className="text-xs h-8 px-3 border-slate-800 hover:bg-slate-900"
                    >
                      Track Timeline
                      <ChevronRight size={11} className="ml-1" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

      {/* Company Preview Modal */}
      {selectedCompany && (
        <Modal isOpen={true} onClose={() => setSelectedCompany(null)} title="Company Profile Details">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-900 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">{selectedCompany.name}</h3>
                <p className="text-xs text-cyan-400 mt-0.5">{selectedCompany.industry}</p>
              </div>
              <a
                href={selectedCompany.website}
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-white"
              >
                <ExternalLink size={15} />
              </a>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="rounded-xl bg-slate-900/60 p-3.5 border border-slate-850">
                <span className="text-xs text-slate-500 uppercase block font-semibold tracking-wider">Company Size</span>
                <span className="text-white font-medium mt-1 block">{selectedCompany.size}</span>
              </div>
              <div className="rounded-xl bg-slate-900/60 p-3.5 border border-slate-850">
                <span className="text-xs text-slate-500 uppercase block font-semibold tracking-wider">Headquarters</span>
                <span className="text-white font-medium mt-1 block">{selectedCompany.location}</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <h4 className="text-xs font-semibold uppercase text-slate-400">About</h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/30 p-4 border border-slate-850/40 rounded-xl">
                {selectedCompany.desc}
              </p>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-slate-500">{selectedCompany.openRoles} active roles listed</span>
              <Button onClick={() => setSelectedCompany(null)} className="text-xs h-8 px-4">
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Application Timeline Modal */}
      {timelineJob && (
        <Modal isOpen={true} onClose={() => setTimelineJob(null)} title="Application Progress Track">
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-white">{timelineJob.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{timelineJob.company} • {timelineJob.location}</p>
            </div>
            <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800/80">
              {TIMELINE_STEPS.map((step, idx) => {
                const stepNum = idx + 1;
                const isCompleted = stepNum < timelineJob.step;
                const isCurrent = stepNum === timelineJob.step;
                return (
                  <div key={idx} className="flex gap-4 items-start relative pl-1">
                    <div
                      className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 border z-10 transition ${
                        isCompleted
                          ? "bg-emerald-600 border-emerald-500 text-white"
                          : isCurrent
                          ? "bg-cyan-500 border-cyan-400 text-slate-950 animate-pulse font-bold"
                          : "bg-slate-950 border-slate-850 text-slate-600"
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 size={12} /> : <Clock size={10} />}
                    </div>
                    <div>
                      <h4
                        className={`text-xs font-bold ${
                          isCompleted ? "text-emerald-400" : isCurrent ? "text-cyan-400" : "text-slate-500"
                        }`}
                      >
                        {step.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end pt-3 border-t border-slate-900">
              <Button onClick={() => setTimelineJob(null)} className="text-xs h-8 px-4">
                Close Tracker
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* AI Job Gaps Analysis Modal */}
      {selectedJobMatch && (
        <Modal isOpen={true} onClose={() => setSelectedJobMatch(null)} title="AI Job Gaps Analysis">
          <div className="space-y-4">
            <div className="text-center py-2">
              <div className="h-20 w-20 rounded-full border-4 border-cyan-500 flex items-center justify-center mx-auto bg-cyan-500/5">
                <span className="text-2xl font-black text-white">{selectedJobMatch.match_percent}%</span>
              </div>
              <p className="text-xs text-slate-300 font-semibold mt-2">{selectedJobMatch.suitability}</p>
            </div>
            
            <div className="space-y-3">
              <div className="rounded-xl bg-slate-900/60 p-3.5 border border-slate-850">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold tracking-wider">Matched Skills</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedJobMatch.matched_skills.map((s: string) => (
                    <span key={s} className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded">{s}</span>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-slate-900/60 p-3.5 border border-slate-850">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold tracking-wider">Missing Skills</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedJobMatch.missing_skills.length === 0 ? (
                    <span className="text-[9px] text-emerald-400 italic">None! You match all requirements.</span>
                  ) : (
                    selectedJobMatch.missing_skills.map((s: string) => (
                      <span key={s} className="text-[9px] bg-red-500/10 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded">{s}</span>
                    ))
                  )}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed text-center italic bg-slate-900/20 p-3 rounded-xl border border-slate-850/60 mt-2">
              {selectedJobMatch.action_recommendation}
            </p>

            <div className="flex justify-end pt-2">
              <Button onClick={() => setSelectedJobMatch(null)} className="text-xs h-8 px-4">
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}