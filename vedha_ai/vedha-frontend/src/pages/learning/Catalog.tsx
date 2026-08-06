import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Compass,
  Bookmark,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Users,
  Star,
  Target,
  ExternalLink,
  Code,
  Video,
  FileText,
  Briefcase
} from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/layouts/DashboardLayout";
import Card from "@/components/ui/card/Card";
import Button from "@/components/ui/button/Button";
import PageHeader from "@/components/ui/layout/PageHeader";
import { getCourseCatalog, toggleBookmark, type Course } from "@/services/course";
import CourseCard from "@/components/ui/learning/CourseCard";
import { getDashboard } from "@/services/dashboard";
import { queryMatchedMentors, type Mentor } from "@/services/mentorship";
import { getOnboardingTrends, completeOnboardingSkill } from "@/services/onboarding";

export default function Catalog() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeTab, setActiveTab] = useState<"intelligence" | "all" | "saved">("intelligence");
  const [loading, setLoading] = useState(true);
  const [completingSkill, setCompletingSkill] = useState(false);
  const [nextSkill, setNextSkill] = useState<string>("");
  const [roadmapProgress, setRoadmapProgress] = useState(0);
  const [resumeScore, setResumeScore] = useState(0);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [targetRole, setTargetRole] = useState("Full Stack Developer");
  
  // Industry outlook metrics
  const [outlook, setOutlook] = useState("Strong market growth for containerized full-stack engineers.");
  const [companiesHiring, setCompaniesHiring] = useState<string[]>(["Google", "Meta", "Spotify"]);
  const [avgSalary, setAvgSalary] = useState(12.5);

  async function loadAll() {
    try {
      setLoading(true);
      const [data, dash, mentorData] = await Promise.all([
        getCourseCatalog(),
        getDashboard().catch(() => null),
        queryMatchedMentors().catch(() => []),
      ]);
      setCourses(data);

      if (dash) {
        setNextSkill(dash.next_skill || "");
        setRoadmapProgress(dash.roadmap_progress || 0);
        setTargetRole(dash.target_role || "Full Stack Developer");
        setResumeScore(dash.resume_score || 0);
      }

      setMentors(mentorData.slice(0, 3));

      try {
        const trends = await getOnboardingTrends(dash?.target_role || "Full Stack Developer");
        if (trends) {
          setOutlook(trends.outlook);
          setCompaniesHiring(trends.companies_hiring || ["Google", "Meta"]);
          setAvgSalary(trends.average_salary || 12.0);
        }
      } catch {
        /* keep fallback */
      }
    } catch {
      toast.error("Failed to query career catalog.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadAll();
  }, []);

  async function handleBookmarkToggle(id: number) {
    try {
      const isSaved = await toggleBookmark(id);
      setCourses(courses.map((c) => (c.id === id ? { ...c, saved: !c.saved } : c)));
      toast.success(isSaved ? "Saved to bookmarks." : "Removed from bookmarks.");
    } catch {
      toast.error("Bookmark toggle failed.");
    }
  }

  async function handleCompleteSkill() {
    if (!nextSkill || nextSkill === "Ecosystem Onboarding") {
      toast.info("Onboarding milestone completed. Build a resume to unlock target skills.");
      return;
    }

    try {
      setCompletingSkill(true);
      const data = await completeOnboardingSkill(nextSkill);
      toast.success(data.message || `Skill '${nextSkill}' completed successfully!`);
      // Reload dashboard metrics
      await loadAll();
    } catch {
      toast.error("Failed to update skill completion status.");
    } finally {
      setCompletingSkill(false);
    }
  }

  const displayedCourses = activeTab === "all" ? courses : courses.filter((c) => c.saved);

  // Dynamic pathway recommendations based on next target skill
  const getPathwayRecommendations = (skillName: string) => {
    const name = skillName || "FastAPI & Python";
    return {
      doc: {
        title: `${name} Official Documentation`,
        url: name.toLowerCase().includes("react") ? "https://react.dev" : "https://fastapi.tiangolo.com",
        desc: "Read official specs, basic guides, and reference API manuals."
      },
      repo: {
        title: `${name} Practical Boilerplate`,
        url: name.toLowerCase().includes("react") ? "https://github.com/facebook/react" : "https://github.com/tiangolo/fastapi",
        desc: "Inspect open-source code architecture, dependencies, and testing suites."
      },
      video: {
        title: `${name} Complete Tutorial for Beginners`,
        url: "https://youtube.com",
        desc: "High-quality video walkthrough explaining modular setup and routing rules."
      },
      project: {
        title: `${name} Cloud Microservices Deployment`,
        desc: "Implement docker containerization and deploy backend endpoints onto AWS ECS."
      },
      challenge: {
        title: `Design and Optimize ${name} Middleware`,
        desc: "Build rate-limiter logic using redis cache connection limits."
      }
    };
  };

  const pathway = getPathwayRecommendations(nextSkill);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-8 text-center text-slate-500 animate-pulse">
            Indexing Career Intelligence Database...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Master Page Header */}
        <PageHeader
          title="AI Career Intelligence Center"
          subtitle="Connecting target role hiring metrics, dynamic skill gaps, and social mentorship to guide you from learning to employment."
          icon={<Sparkles size={22} />}
          action={
            <div className="flex items-center gap-4 bg-[#111827] px-5 py-3 rounded-xl border border-[#1F2937] shadow-sm">
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-widest text-[#94A3B8] font-bold">Roadmap Progress</div>
                <div className="text-xl font-bold text-[#3B82F6]">{roadmapProgress.toFixed(0)}%</div>
              </div>
              <div className="h-9 w-9 rounded-full border border-[#3B82F6]/30 flex items-center justify-center bg-[#3B82F6]/10 text-[#3B82F6]">
                <Target size={18} />
              </div>
            </div>
          }
        />

        {/* Console / Catalog Tabs */}
        <div className="flex rounded-xl bg-slate-900/60 p-1 border border-slate-800 self-start max-w-md">
          <button
            onClick={() => setActiveTab("intelligence")}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === "intelligence"
                ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Sparkles size={14} />
            AI Career Coach
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === "all"
                ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Compass size={14} />
            Full Catalog
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === "saved"
                ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Bookmark size={14} />
            Saved Modules
          </button>
        </div>

        {activeTab === "intelligence" ? (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left/Middle: Career Console Gaps & Recommendations */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Target Role & Market Demand Card */}
              <div className="rounded-2xl border border-slate-850 bg-slate-900/40 p-6 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="text-cyan-400" size={18} />
                  Target Goal Market Intelligence
                </h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850">
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Target Profession</span>
                    <span className="text-sm font-bold text-white mt-1 block">{targetRole}</span>
                  </div>
                  <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850">
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Average Salary Band</span>
                    <span className="text-sm font-bold text-cyan-400 mt-1 block">₹{avgSalary} LPA</span>
                  </div>
                  <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850">
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Hiring Employers</span>
                    <span className="text-sm font-bold text-emerald-400 mt-1 block">{companiesHiring.join(", ")}</span>
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/20 border border-slate-850/60 text-xs text-slate-400">
                  <strong className="text-slate-300">Industry Outlook:</strong> {outlook}
                </div>
              </div>

              {/* Dynamic Skill Gap & AI Relevance Coach */}
              <div className="rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-950/20 via-slate-900/40 to-indigo-950/15 p-6 space-y-4">
                <div className="flex justify-between items-start gap-4 flex-wrap">
                  <div>
                    <span className="text-[9px] uppercase font-extrabold tracking-widest px-2.5 py-1 rounded-lg bg-violet-500/10 text-violet-300 border border-violet-500/20">
                      🎯 AI NEXT RECOMMENDED SKILL
                    </span>
                    <h2 className="text-xl font-extrabold text-white mt-2">
                      Master {nextSkill || "Ecosystem Onboarding"}
                    </h2>
                  </div>
                  <Button
                    onClick={handleCompleteSkill}
                    disabled={completingSkill || !nextSkill || nextSkill === "Ecosystem Onboarding"}
                    className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 text-xs py-2 px-5 font-bold cursor-pointer"
                  >
                    {completingSkill ? "Syncing..." : "Mark Skill Completed"}
                  </Button>
                </div>

                <div className="space-y-2 bg-slate-950/40 p-4 rounded-xl border border-slate-850">
                  <h4 className="text-xs font-bold text-violet-400 flex items-center gap-1.5">
                    <Sparkles size={13} className="animate-pulse" />
                    Relevance Explanation: Why this is recommended for you
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Based on companies hiring for the <strong className="text-cyan-400">{targetRole}</strong> role, possessing skills in <strong className="text-white">{nextSkill}</strong> is currently required by {companiesHiring[0] || "top firms"}. Completing this module will bridge your skill gap, automatically raise your Resume ATS score by <strong className="text-emerald-400">+10%</strong>, and unlock targeted job recommendations in your Marketplace.
                  </p>
                </div>
              </div>

              {/* Recommendations Pathways Channels */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">AI Curated Learning Pathways</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  
                  {/* Doc Recommendation */}
                  <a
                    href={pathway.doc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="ve-card p-5 block space-y-2 border border-slate-850 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition text-left cursor-pointer"
                  >
                    <div className="flex justify-between items-center text-cyan-400">
                      <FileText size={20} />
                      <ExternalLink size={13} />
                    </div>
                    <h4 className="text-xs font-bold text-white">{pathway.doc.title}</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{pathway.doc.desc}</p>
                  </a>

                  {/* GitHub Recommendation */}
                  <a
                    href={pathway.repo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="ve-card p-5 block space-y-2 border border-slate-850 hover:border-purple-500/30 hover:bg-purple-500/5 transition text-left cursor-pointer"
                  >
                    <div className="flex justify-between items-center text-purple-400">
                      <Code size={20} />
                      <ExternalLink size={13} />
                    </div>
                    <h4 className="text-xs font-bold text-white">{pathway.repo.title}</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{pathway.repo.desc}</p>
                  </a>

                  {/* YouTube Recommendation */}
                  <a
                    href={pathway.video.url}
                    target="_blank"
                    rel="noreferrer"
                    className="ve-card p-5 block space-y-2 border border-slate-850 hover:border-red-500/30 hover:bg-red-500/5 transition text-left cursor-pointer"
                  >
                    <div className="flex justify-between items-center text-red-400">
                      <Video size={20} />
                      <ExternalLink size={13} />
                    </div>
                    <h4 className="text-xs font-bold text-white">{pathway.video.title}</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{pathway.video.desc}</p>
                  </a>

                  {/* Code Challenge */}
                  <div className="ve-card p-5 space-y-2 border border-slate-850 hover:border-amber-500/30 hover:bg-amber-500/5 transition text-left">
                    <div className="text-amber-400">
                      <Code size={20} />
                    </div>
                    <h4 className="text-xs font-bold text-white">{pathway.challenge.title}</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{pathway.challenge.desc}</p>
                  </div>

                </div>

                {/* Portfolio Project recommendation */}
                <div className="rounded-2xl border border-slate-850 bg-slate-900/30 p-6 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Briefcase size={14} className="text-emerald-400" />
                    AI Assigned Portfolio Project
                  </h4>
                  <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850">
                    <h5 className="text-xs font-bold text-white">{pathway.project.title}</h5>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{pathway.project.desc}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => navigate("/student/resume")} className="text-xs py-1.5 px-4 bg-emerald-600 hover:bg-emerald-500 font-semibold cursor-pointer">
                      Add to Resume Projects
                    </Button>
                  </div>
                </div>

              </div>

            </div>

            {/* Right Sidebar: Telemetry & Social Mentors */}
            <div className="space-y-6">
              
              {/* Interactive Skill DNA */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Star size={16} className="text-amber-400" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300">
                    Ecosystem Stats
                  </h3>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                    <span className="text-slate-400">Roadmap Progress</span>
                    <span className="font-bold text-cyan-400">{roadmapProgress.toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                    <span className="text-slate-400">Resume ATS Score</span>
                    <span className="font-bold text-emerald-400">{resumeScore.toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Next Target Skill</span>
                    <span className="font-bold text-violet-400">{nextSkill || "None"}</span>
                  </div>
                </div>
              </div>

              {/* Matched Expertise Employees / Alumni */}
              {mentors.length > 0 && (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                    <Users size={16} className="text-violet-400" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300">
                      Employees with expertise
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {mentors.map((mentor) => (
                      <div
                        key={mentor.id}
                        className="flex items-start gap-3 rounded-xl p-3 border border-slate-800 hover:border-violet-500/30 hover:bg-violet-500/5 transition-all cursor-pointer"
                        onClick={() => navigate("/student/mentorship")}
                      >
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-sm font-black text-white shrink-0">
                          {mentor.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white truncate">{mentor.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">{mentor.role} @ {mentor.company}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Star size={10} className="text-amber-400 fill-amber-400" />
                            <span className="text-[9px] text-amber-400 font-bold">{mentor.rating}</span>
                            <span className="text-[9px] text-slate-500">({mentor.reviewsCount} reviews)</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {mentor.skills.slice(0, 2).map(s => (
                              <span key={s} className="text-[8px] px-1.5 py-0.5 rounded bg-slate-850 text-slate-400">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={() => navigate("/student/mentorship")}
                    className="w-full text-xs py-2 bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/20 cursor-pointer"
                  >
                    Schedule Mentor Session
                    <ChevronRight size={14} className="ml-1" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 space-y-6">
            {displayedCourses.length === 0 ? (
              <Card variant="glass" className="p-12 text-center text-slate-500 italic">
                No courses match your current filter.
              </Card>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {displayedCourses.map((c) => (
                  <CourseCard
                    key={c.id}
                    id={c.id}
                    title={c.title}
                    category={c.category}
                    duration={c.duration}
                    progress={c.progress}
                    saved={c.saved}
                    level={c.level}
                    onSelect={() => navigate(`/student/learning/course/${c.id}`)}
                    onBookmark={() => handleBookmarkToggle(c.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
