import { Link } from "react-router-dom";
import {
  Target,
  Users,
  Award,
  Activity,
  Sparkles,
  Code,
  Brain,
  ChevronRight
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0B1220] text-white font-sans overflow-x-hidden relative">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[#0B1220] -z-10 pointer-events-none" />

      {/* Header Navigation */}
      <header className="border-b border-[#1F2937] backdrop-blur-md sticky top-0 z-50 bg-[#0F172A]/90">
        <div className="mx-auto max-w-[1440px] px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3B82F6] text-lg font-bold text-white shadow-sm">
              V
            </div>
            <span className="text-md font-bold tracking-tight text-white">
              Vedha AI
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-[#94A3B8]">
            <a href="#overview" className="hover:text-white transition">Platform Overview</a>
            <a href="#roles" className="hover:text-white transition">Ecosystem Roles</a>
            <a href="#stats" className="hover:text-white transition">Ecosystem Metrics</a>
            <a href="#workflows" className="hover:text-white transition">AI Workflows</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/login" className="px-4 py-2 rounded-xl text-xs font-semibold text-[#94A3B8] hover:text-white transition">
              Sign In
            </Link>
            <Link to="/register" className="px-5 py-2.5 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-semibold shadow-sm transition">
              Join Ecosystem
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-[1440px] px-8 pt-20 pb-16 text-center space-y-8 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] text-[11px] font-semibold">
          <Sparkles size={14} />
          The AI-Powered Career Intelligence Ecosystem
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-none">
          Connect Talent, Learning, and Hiring into <span className="text-[#3B82F6]">One Ecosystem</span>
        </h1>

        <p className="text-sm sm:text-base text-[#94A3B8] max-w-2xl mx-auto leading-relaxed">
          Vedha AI bridges the gap between Students, Corporate Partners, Mentors, and Recruiters. Powered by real-time industry intelligence, dynamic skill-gaps matching, and automated career acceleration pipelines.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link to="/register" className="px-8 py-3.5 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold text-sm flex items-center gap-2 shadow-sm transition cursor-pointer">
            Launch Career Portal
            <ChevronRight size={16} />
          </Link>
          <Link to="/login" className="px-8 py-3.5 rounded-xl border border-[#1F2937] hover:bg-[#1F2937] text-sm font-semibold text-[#94A3B8] hover:text-white transition cursor-pointer">
            Enterprise Console
          </Link>
        </div>
      </section>

      {/* Statistics counters */}
      <section id="stats" className="border-t border-b border-[#1F2937] bg-[#0F172A] py-12">
        <div className="mx-auto max-w-[1440px] px-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-center">
          <div className="space-y-1">
            <div className="text-3xl font-bold text-white">12,500+</div>
            <div className="text-xs text-[#94A3B8] uppercase tracking-wider font-semibold">Active Students</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-bold text-[#3B82F6]">1,200+</div>
            <div className="text-xs text-[#94A3B8] uppercase tracking-wider font-semibold">Expert Mentors</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-bold text-white">250+</div>
            <div className="text-xs text-[#94A3B8] uppercase tracking-wider font-semibold">Corporate Partners</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-bold text-[#22C55E]">94.8%</div>
            <div className="text-xs text-[#94A3B8] uppercase tracking-wider font-semibold">Placement Precision</div>
          </div>
        </div>
      </section>

      {/* Platform Overview */}
      <section id="overview" className="mx-auto max-w-[1440px] px-8 py-20 space-y-16">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">The Ecosystem Lifecycle</h2>
          <p className="text-sm text-[#94A3B8] max-w-lg mx-auto leading-relaxed">
            A continuous loop of professional growth: Industry demand instructs learning pathways, learning creates projects, and employment creates future mentors.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="p-6 rounded-2xl border border-[#1F2937] bg-[#111827] space-y-4 shadow-xl">
            <div className="h-10 w-10 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] flex items-center justify-center">
              <Brain size={20} />
            </div>
            <h3 className="text-base font-bold text-white">1. Industry & AI Analysis</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              AI constantly indexes tech stacks and real recruiter job requirements, formulating immediate learning roadmap objectives tailored to industry demand.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-[#1F2937] bg-[#111827] space-y-4 shadow-xl">
            <div className="h-10 w-10 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#8B5CF6] flex items-center justify-center">
              <Activity size={20} />
            </div>
            <h3 className="text-base font-bold text-white">2. Micro-Resource Prep</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Students acquire skills using official documentation, curated GitHub code templates, interactive coding challenges, and mock developer tasks.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-[#1F2937] bg-[#111827] space-y-4 shadow-xl">
            <div className="h-10 w-10 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] flex items-center justify-center">
              <Award size={20} />
            </div>
            <h3 className="text-base font-bold text-white">3. Recruiter Placement</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Resume optimization pipelines matching ATS metrics unlock recruiter queues. Candidates interview and get placed in active partner roles.
            </p>
          </div>
        </div>
      </section>

      {/* Ecosystem Roles Section */}
      <section id="roles" className="mx-auto max-w-[1440px] px-8 py-20 border-t border-[#1F2937] space-y-16">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Four Roles. One Unified Workspace.</h2>
          <p className="text-sm text-[#94A3B8] max-w-lg mx-auto leading-relaxed">
            Vedha AI hosts dedicated modules with customized dashboards for each participant role.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="p-6 rounded-2xl border border-[#1F2937] bg-[#111827] space-y-3 shadow-xl">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="text-lg">🎓</span> Students
            </h4>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Analyze career matches, assess skills, complete learning steps, write resumes, schedule mock sessions, and review applications.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-[#1F2937] bg-[#111827] space-y-3 shadow-xl">
            <h4 className="text-sm font-bold text-[#8B5CF6] flex items-center gap-2">
              <span className="text-lg">💼</span> Employees
            </h4>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Provide domain expertise, host live workshops, write blogs, review student portfolios, and conduct mock technical sessions.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-[#1F2937] bg-[#111827] space-y-3 shadow-xl">
            <h4 className="text-sm font-bold text-[#3B82F6] flex items-center gap-2">
              <span className="text-lg">🏢</span> Companies
            </h4>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Post jobs and internships, publish technology stack expectations, audit candidates, and dispatch formal offers.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-[#1F2937] bg-[#111827] space-y-3 shadow-xl">
            <h4 className="text-sm font-bold text-[#F59E0B] flex items-center gap-2">
              <span className="text-lg">📊</span> Admins
            </h4>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Review corporate onboarding credentials, approve pending accounts, trace active growth graphs, and check system diagnostics.
            </p>
          </div>
        </div>
      </section>

      {/* AI Workflows (Brain of Platform) */}
      <section id="workflows" className="mx-auto max-w-[1440px] px-8 py-20 border-t border-[#1F2937] space-y-16">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">AI Workflows & Assistant Engines</h2>
          <p className="text-sm text-[#94A3B8] max-w-lg mx-auto leading-relaxed">
            Dynamic agent subsystems sharing a common, unified student profile.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="p-6 rounded-2xl border border-[#1F2937] bg-[#111827] space-y-3 flex items-start gap-4 shadow-xl">
            <div className="h-10 w-10 rounded-xl bg-[#3B82F6]/10 text-[#3B82F6] flex items-center justify-center shrink-0">
              <Target size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Dynamic Skill Gap Analysis</h4>
              <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
                Matches target career roles against existing profile skills to index missing competencies, recommending resources to bridge the gap.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-[#1F2937] bg-[#111827] space-y-3 flex items-start gap-4 shadow-xl">
            <div className="h-10 w-10 rounded-xl bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center shrink-0">
              <Award size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">ATS Resume AI & Alignment</h4>
              <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
                Upload resumes and query ATS match rates against system job listings, detecting keyword alignment gaps and advising on text rewrites.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-[#1F2937] bg-[#111827] space-y-3 flex items-start gap-4 shadow-xl">
            <div className="h-10 w-10 rounded-xl bg-[#EF4444]/10 text-[#EF4444] flex items-center justify-center shrink-0">
              <Users size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Interview AI Simulator</h4>
              <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
                Interactive mock interview portal with voice/text simulation that scores responses and details improvement checklists.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-[#1F2937] bg-[#111827] space-y-3 flex items-start gap-4 shadow-xl">
            <div className="h-10 w-10 rounded-xl bg-[#22C55E]/10 text-[#22C55E] flex items-center justify-center shrink-0">
              <Code size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Self-Healing Recruiter Matching</h4>
              <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
                Automatically extracts required skills from job postings and matches candidates dynamically based on academic progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Companies */}
      <section className="mx-auto max-w-[1440px] px-8 py-12 border-t border-[#1F2937] text-center space-y-6">
        <span className="text-xs uppercase font-semibold tracking-wider text-[#94A3B8]">
          Trusted by Industry Employers
        </span>
        <div className="flex flex-wrap items-center justify-center gap-12 opacity-60">
          <span className="text-xs font-bold text-white">Google DeepMind</span>
          <span className="text-xs font-bold text-white">Meta</span>
          <span className="text-xs font-bold text-white">Stripe</span>
          <span className="text-xs font-bold text-white">Microsoft</span>
          <span className="text-xs font-bold text-white">Spotify</span>
        </div>
      </section>

      {/* Call to Action (CTA) */}
      <section className="mx-auto max-w-[1440px] px-8 py-20 border-t border-[#1F2937] text-center space-y-6">
        <h2 className="text-3xl font-extrabold text-white">Accelerate Your Engineering Career</h2>
        <p className="text-sm text-[#94A3B8] max-w-md mx-auto leading-relaxed">
          Access specialized roadmaps, write ATS-compliant resumes, practice mock interview scenarios, and apply to top placements.
        </p>
        <div>
          <Link to="/register" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold text-sm shadow-sm transition cursor-pointer">
            Get Started Now
            <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1F2937] bg-[#0F172A] py-12">
        <div className="mx-auto max-w-[1440px] px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#94A3B8]">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#3B82F6] text-xs font-bold text-white">
              V
            </div>
            <span className="font-semibold text-white">Vedha AI Ecosystem</span>
          </div>
          <div>
            &copy; {new Date().getFullYear()} Vedha AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}