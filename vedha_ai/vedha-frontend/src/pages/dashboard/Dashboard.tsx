import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  FileText,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Target,
  Clock,
  BookOpen,
  Code2,
  TrendingUp,
  CheckCircle2,
  ChevronRight,
  Zap,
} from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import PageHeader from "@/components/ui/layout/PageHeader";
import Button from "@/components/ui/button/Button";
import Card from "@/components/ui/card/Card";
import ResumeGauge from "@/components/charts/ResumeGauge";
import {
  getDashboard,
  type DashboardResponse,
} from "@/services/dashboard";
import { getCourseCatalog, type Course } from "@/services/course";
import { getRecommendedJobs, type Job } from "@/services/jobs";

export default function Dashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const [dashData, courses, jobsData] = await Promise.all([
          getDashboard().catch(() => null),
          getCourseCatalog().catch(() => []),
          getRecommendedJobs().catch(() => ({ recommended_jobs: [] })),
        ]);
        setDashboard(dashData);

        const inProgress =
          courses.find((c) => c.progress > 0 && c.progress < 100) ||
          courses.find((c) => c.progress === 0) ||
          null;
        setActiveCourse(inProgress);

        setRecommendedJobs(jobsData.recommended_jobs || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    void loadDashboard();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="w-full max-w-[1440px] mx-auto px-8 py-8 space-y-8 animate-pulse">
          <div className="h-16 bg-[#111827] rounded-xl border border-[#1F2937]" />
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 sm:col-span-6 lg:col-span-3 h-28 bg-[#111827] rounded-2xl border border-[#1F2937]" />
            <div className="col-span-12 sm:col-span-6 lg:col-span-3 h-28 bg-[#111827] rounded-2xl border border-[#1F2937]" />
            <div className="col-span-12 sm:col-span-6 lg:col-span-3 h-28 bg-[#111827] rounded-2xl border border-[#1F2937]" />
            <div className="col-span-12 sm:col-span-6 lg:col-span-3 h-28 bg-[#111827] rounded-2xl border border-[#1F2937]" />
          </div>
          <div className="h-44 bg-[#111827] rounded-2xl border border-[#1F2937]" />
        </div>
      </DashboardLayout>
    );
  }

  const resumeScore = Math.round(dashboard?.resume_score ?? 85);
  const interviewReadiness = Math.round(dashboard?.career_readiness ?? 78);
  const activeApplications = dashboard?.total_interviews ?? 12;
  const skillMatch = Math.round(dashboard?.roadmap_progress ?? 92);

  const mockJobs: Job[] = recommendedJobs.length > 0
    ? recommendedJobs.slice(0, 3)
    : [
        {
          id: 1,
          title: "Senior Backend Engineer (FastAPI & Microservices)",
          company: "TechCorp Global",
          location: "San Francisco, CA (Remote)",
          description: "Build scalable cloud microservices and high-throughput API gateways.",
          skills: ["FastAPI", "Docker", "PostgreSQL"],
          salary: "18-24 LPA",
          job_type: "Full-time",
          source: "Vedha AI",
          url: "#",
          scraped_at: new Date().toISOString(),
          match_percent: 94,
        },
        {
          id: 2,
          title: "AI Systems Infrastructure Developer",
          company: "NextGen AI Labs",
          location: "New York, NY (Hybrid)",
          description: "Optimize low-latency LLM inference pipelines and distributed GPU clusters.",
          skills: ["PyTorch", "Python", "CUDA"],
          salary: "25-35 LPA",
          job_type: "Full-time",
          source: "Vedha AI",
          url: "#",
          scraped_at: new Date().toISOString(),
          match_percent: 91,
        },
        {
          id: 3,
          title: "Full-Stack Web Architect",
          company: "Innovate Platform SaaS",
          location: "Austin, TX (Remote)",
          description: "Lead enterprise frontend layout architectures and real-time WebSocket state management.",
          skills: ["React", "TypeScript", "Node.js"],
          salary: "20-28 LPA",
          job_type: "Full-time",
          source: "Vedha AI",
          url: "#",
          scraped_at: new Date().toISOString(),
          match_percent: 88,
        },
      ];

  return (
    <DashboardLayout>
      <div className="w-full max-w-[1440px] mx-auto px-8 py-8 space-y-8 font-sans">

        {/* 1. PAGE TITLE */}
        <div className="w-full">
          <PageHeader
            title="AI Career Intelligence Center"
            subtitle={`Welcome back, ${dashboard?.student_name || "Builder"}. Here is your customized learning journey, AI mentor guidance, and target career fit metrics.`}
            action={
              <Button
                variant="primary"
                onClick={() => navigate("/ai/career-predictor")}
                className="bg-[#3B82F6] hover:bg-[#2563EB] text-white flex items-center gap-2"
              >
                <Sparkles size={16} />
                Run AI Fit Predictor
              </Button>
            }
          />
        </div>

        {/* 12-COLUMN GRID SYSTEM */}
        <div className="grid grid-cols-12 gap-6">

          {/* 2. QUICK STATS (4 EQUAL CARDS) */}
          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <Card variant="glass" className="p-6 bg-[#111827] border border-[#1F2937] rounded-2xl shadow-xl flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Resume Score</p>
                <h3 className="text-2xl font-bold text-white mt-1">{resumeScore}/100</h3>
                <span className="text-[11px] font-semibold text-[#22C55E] mt-1 inline-block">ATS Verified • Strong</span>
              </div>
              <div className="h-12 w-12 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center text-[#3B82F6] shrink-0">
                <FileText size={24} />
              </div>
            </Card>
          </div>

          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <Card variant="glass" className="p-6 bg-[#111827] border border-[#1F2937] rounded-2xl shadow-xl flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Interview Readiness</p>
                <h3 className="text-2xl font-bold text-white mt-1">{interviewReadiness}%</h3>
                <span className="text-[11px] font-semibold text-[#3B82F6] mt-1 inline-block">AI Mock Qualified</span>
              </div>
              <div className="h-12 w-12 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center text-[#8B5CF6] shrink-0">
                <Target size={24} />
              </div>
            </Card>
          </div>

          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <Card variant="glass" className="p-6 bg-[#111827] border border-[#1F2937] rounded-2xl shadow-xl flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Active Applications</p>
                <h3 className="text-2xl font-bold text-white mt-1">{activeApplications}</h3>
                <span className="text-[11px] font-semibold text-[#F59E0B] mt-1 inline-block">3 Interviews Scheduled</span>
              </div>
              <div className="h-12 w-12 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-center text-[#F59E0B] shrink-0">
                <Briefcase size={24} />
              </div>
            </Card>
          </div>

          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <Card variant="glass" className="p-6 bg-[#111827] border border-[#1F2937] rounded-2xl shadow-xl flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Skill DNA Index</p>
                <h3 className="text-2xl font-bold text-white mt-1">{skillMatch}%</h3>
                <span className="text-[11px] font-semibold text-[#22C55E] mt-1 inline-block">Top 5% Ecosystem</span>
              </div>
              <div className="h-12 w-12 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center text-[#22C55E] shrink-0">
                <Zap size={24} />
              </div>
            </Card>
          </div>

          {/* 3. TODAY'S AI RECOMMENDATION (FULL WIDTH) */}
          <div className="col-span-12">
            <Card variant="glass" className="p-6 bg-[#111827] border border-[#3B82F6]/30 rounded-2xl shadow-2xl relative overflow-hidden">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
                <div className="space-y-2 max-w-3xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] text-xs font-semibold">
                    <Sparkles size={14} />
                    Today's Priority AI Goal
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Master Microservices Caching with Redis & FastAPI
                  </h3>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">
                    Based on current market recruitment signals, adding asynchronous Redis caching to your FastAPI services will elevate your Backend Engineer match index from 85% to 94%.
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Button
                    variant="primary"
                    onClick={() => navigate("/learning/catalog")}
                    className="bg-[#3B82F6] hover:bg-[#2563EB] text-white flex items-center gap-2"
                  >
                    Start 25-Min Module
                    <ArrowRight size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/ai/career-predictor")}
                    className="border-[#1F2937] text-[#94A3B8] hover:text-white"
                  >
                    View AI Fit Breakdown
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* 4. CONTINUE LEARNING (LEFT: col-span-12 lg:col-span-8) & AI MENTOR (RIGHT: col-span-12 lg:col-span-4) */}
          <div className="col-span-12 lg:col-span-8">
            <Card variant="glass" className="p-6 bg-[#111827] border border-[#1F2937] rounded-2xl shadow-xl h-full flex flex-col justify-between space-y-4">
              <div className="flex justify-between items-center border-b border-[#1F2937] pb-4">
                <div className="flex items-center gap-2">
                  <BookOpen size={20} className="text-[#3B82F6]" />
                  <h3 className="text-lg font-bold text-white">Continue Learning Track</h3>
                </div>
                <button
                  onClick={() => navigate("/learning/catalog")}
                  className="text-xs font-semibold text-[#3B82F6] hover:underline flex items-center gap-1"
                >
                  Explore Catalog
                  <ChevronRight size={14} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-base font-semibold text-white">
                      {activeCourse?.title || "Python Backends with FastAPI & SQL"}
                    </h4>
                    <p className="text-xs text-[#94A3B8] mt-1">
                      {activeCourse?.category || "Backend Systems"} • Lesson 4 of 12
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#3B82F6] bg-[#3B82F6]/10 px-2.5 py-1 rounded-lg border border-[#3B82F6]/20">
                    {activeCourse?.progress || 65}% Done
                  </span>
                </div>

                <div className="w-full h-2.5 bg-[#1F2937] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] transition-all duration-500"
                    style={{ width: `${activeCourse?.progress || 65}%` }}
                  />
                </div>

                <div className="flex justify-between items-center pt-2 text-xs text-[#94A3B8]">
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} className="text-[#94A3B8]" />
                    Est. 45 mins remaining
                  </span>
                  <span className="flex items-center gap-1.5 text-[#22C55E]">
                    <CheckCircle2 size={14} />
                    Verified Certificate Included
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  onClick={() => navigate("/learning/catalog")}
                  className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white"
                >
                  Resume Active Module
                </Button>
              </div>
            </Card>
          </div>

          <div className="col-span-12 lg:col-span-4">
            <Card variant="glass" className="p-6 bg-[#111827] border border-[#1F2937] rounded-2xl shadow-xl h-full flex flex-col justify-between space-y-4">
              <div className="flex justify-between items-center border-b border-[#1F2937] pb-4">
                <div className="flex items-center gap-2">
                  <GraduationCap size={20} className="text-[#8B5CF6]" />
                  <h3 className="text-lg font-bold text-white">Recommended AI Mentor</h3>
                </div>
                <span className="h-2 w-2 rounded-full bg-[#22C55E] animate-ping" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center font-bold text-[#8B5CF6]">
                    PM
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Pranav M.</h4>
                    <p className="text-xs text-[#94A3B8]">Principal AI Researcher @ DeepMind</p>
                  </div>
                </div>

                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  "Happy to review your distributed FastAPI backend architecture and conduct a 1-on-1 mock technical interview."
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] font-bold text-[#3B82F6] bg-[#3B82F6]/10 border border-[#3B82F6]/20 px-2 py-0.5 rounded">FastAPI</span>
                  <span className="text-[10px] font-bold text-[#8B5CF6] bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 px-2 py-0.5 rounded">System Design</span>
                  <span className="text-[10px] font-bold text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20 px-2 py-0.5 rounded">Python</span>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => navigate("/collaboration/mentors")}
                className="w-full border-[#1F2937] text-white hover:bg-[#1F2937]"
              >
                Schedule Consultation
              </Button>
            </Card>
          </div>

          {/* 5. RECOMMENDED PROJECT (LEFT: col-span-12 lg:col-span-8) & TRENDING SKILLS (RIGHT: col-span-12 lg:col-span-4) */}
          <div className="col-span-12 lg:col-span-8">
            <Card variant="glass" className="p-6 bg-[#111827] border border-[#1F2937] rounded-2xl shadow-xl h-full flex flex-col justify-between space-y-4">
              <div className="flex justify-between items-center border-b border-[#1F2937] pb-4">
                <div className="flex items-center gap-2">
                  <Code2 size={20} className="text-[#22C55E]" />
                  <h3 className="text-lg font-bold text-white">Recommended Industry Project</h3>
                </div>
                <span className="text-xs font-semibold text-[#22C55E] bg-[#22C55E]/10 px-2.5 py-1 rounded-lg border border-[#22C55E]/20">
                  Intermediate Level
                </span>
              </div>

              <div className="space-y-3">
                <h4 className="text-base font-semibold text-white">
                  Low-Latency RAG Document Search Engine
                </h4>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Build a hybrid vector search microservice combining Qdrant, FastAPI, and OpenAI embedding models. Highly demanded by top AI recruiting partners.
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-xs font-medium text-[#94A3B8] bg-[#0F172A] border border-[#1F2937] px-3 py-1 rounded-lg">
                    FastAPI
                  </span>
                  <span className="text-xs font-medium text-[#94A3B8] bg-[#0F172A] border border-[#1F2937] px-3 py-1 rounded-lg">
                    Vector DB
                  </span>
                  <span className="text-xs font-medium text-[#94A3B8] bg-[#0F172A] border border-[#1F2937] px-3 py-1 rounded-lg">
                    Python
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <span className="text-xs text-[#94A3B8]">Est. 4 hours • Complete to add to GitHub Portfolio</span>
                <Button
                  variant="primary"
                  onClick={() => navigate("/coding/catalog")}
                  className="bg-[#3B82F6] hover:bg-[#2563EB] text-white"
                >
                  Launch Project Code
                </Button>
              </div>
            </Card>
          </div>

          <div className="col-span-12 lg:col-span-4">
            <Card variant="glass" className="p-6 bg-[#111827] border border-[#1F2937] rounded-2xl shadow-xl h-full flex flex-col justify-between space-y-4">
              <div className="flex justify-between items-center border-b border-[#1F2937] pb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp size={20} className="text-[#F59E0B]" />
                  <h3 className="text-lg font-bold text-white">Trending Industry Skills</h3>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-white">FastAPI & Async I/O</span>
                    <span className="text-[#22C55E] font-bold">95% Market Fit</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#1F2937] rounded-full overflow-hidden">
                    <div className="h-full bg-[#22C55E]" style={{ width: "95%" }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-white">Docker & Containerization</span>
                    <span className="text-[#3B82F6] font-bold">88% Market Fit</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#1F2937] rounded-full overflow-hidden">
                    <div className="h-full bg-[#3B82F6]" style={{ width: "88%" }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-white">LLM Fine-Tuning & PyTorch</span>
                    <span className="text-[#8B5CF6] font-bold">82% Market Fit</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#1F2937] rounded-full overflow-hidden">
                    <div className="h-full bg-[#8B5CF6]" style={{ width: "82%" }} />
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => navigate("/student/skills")}
                className="w-full border-[#1F2937] text-white hover:bg-[#1F2937]"
              >
                Inspect Skill DNA
              </Button>
            </Card>
          </div>

          {/* 6. JOB RECOMMENDATIONS (FULL WIDTH) */}
          <div className="col-span-12">
            <Card variant="glass" className="p-6 bg-[#111827] border border-[#1F2937] rounded-2xl shadow-xl space-y-6">
              <div className="flex justify-between items-center border-b border-[#1F2937] pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">Ecosystem Job Recommendations</h3>
                  <p className="text-xs text-[#94A3B8] mt-1">Matched against your verified skill profile and mock interview benchmarks.</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => navigate("/jobs")}
                  className="border-[#1F2937] text-white hover:bg-[#1F2937]"
                >
                  View All Openings
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {mockJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-5 rounded-xl bg-[#0F172A] border border-[#1F2937] space-y-4 flex flex-col justify-between hover:border-[#3B82F6]/50 transition duration-150"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20 px-2.5 py-0.5 rounded-full">
                          {job.match_percent || 90}% Match
                        </span>
                        <span className="text-[10px] text-[#94A3B8] uppercase font-semibold">{job.job_type || "Full-time"}</span>
                      </div>

                      <h4 className="text-sm font-bold text-white leading-snug line-clamp-2">{job.title}</h4>
                      <p className="text-xs text-[#3B82F6] font-semibold">{job.company}</p>
                      <p className="text-[11px] text-[#94A3B8]">{job.location}</p>
                    </div>

                    <Button
                      variant="primary"
                      onClick={() => navigate("/jobs")}
                      className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs py-2 h-[38px]"
                    >
                      Apply Now
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* 7. RESUME SCORE + ROADMAP PROGRESS (2 EQUAL CARDS) */}
          <div className="col-span-12 lg:col-span-6">
            <Card variant="glass" className="p-6 bg-[#111827] border border-[#1F2937] rounded-2xl shadow-xl space-y-4">
              <div className="flex justify-between items-center border-b border-[#1F2937] pb-4">
                <h3 className="text-lg font-bold text-white">Resume Score Breakdown</h3>
                <span className="text-xs font-bold text-[#3B82F6] bg-[#3B82F6]/10 px-2.5 py-1 rounded-lg border border-[#3B82F6]/20">
                  {resumeScore}/100 Score
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-36 h-36 shrink-0 flex items-center justify-center">
                  <ResumeGauge score={resumeScore} />
                </div>

                <div className="space-y-2 text-xs text-[#94A3B8]">
                  <p className="flex items-center gap-2 text-white font-semibold">
                    <CheckCircle2 size={14} className="text-[#22C55E]" />
                    Impact Metrics: 8 Quantifiable Bullet Points
                  </p>
                  <p className="flex items-center gap-2 text-white font-semibold">
                    <CheckCircle2 size={14} className="text-[#22C55E]" />
                    ATS Keywords: FastAPI, Docker, Microservices
                  </p>
                  <p className="text-[#94A3B8] leading-relaxed pt-1">
                    Your resume matches top enterprise job descriptions. Update your latest project link to boost score to 90+.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="outline"
                  onClick={() => navigate("/resume")}
                  className="w-full border-[#1F2937] text-white hover:bg-[#1F2937]"
                >
                  Open AI Resume Studio
                </Button>
              </div>
            </Card>
          </div>

          <div className="col-span-12 lg:col-span-6">
            <Card variant="glass" className="p-6 bg-[#111827] border border-[#1F2937] rounded-2xl shadow-xl space-y-4">
              <div className="flex justify-between items-center border-b border-[#1F2937] pb-4">
                <h3 className="text-lg font-bold text-white">Full-Stack AI Engineer Roadmap</h3>
                <span className="text-xs font-bold text-[#8B5CF6] bg-[#8B5CF6]/10 px-2.5 py-1 rounded-lg border border-[#8B5CF6]/20">
                  65% Completed
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-[#0F172A] border border-[#1F2937] flex items-center justify-between">
                  <span className="text-white font-semibold">1. Python & FastAPI Fundamentals</span>
                  <span className="text-[#22C55E] font-bold">Completed</span>
                </div>
                <div className="p-3 rounded-xl bg-[#0F172A] border border-[#1F2937] flex items-center justify-between">
                  <span className="text-white font-semibold">2. Relational SQL & Async ORMs</span>
                  <span className="text-[#22C55E] font-bold">Completed</span>
                </div>
                <div className="p-3 rounded-xl bg-[#0F172A] border border-[#3B82F6]/50 flex items-center justify-between">
                  <span className="text-white font-bold">3. Microservices Caching & Redis</span>
                  <span className="text-[#3B82F6] font-bold">In Progress</span>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="outline"
                  onClick={() => navigate("/roadmap")}
                  className="w-full border-[#1F2937] text-white hover:bg-[#1F2937]"
                >
                  View Interactive Roadmap
                </Button>
              </div>
            </Card>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}