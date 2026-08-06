import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Briefcase, Star, Calendar, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/layouts/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import SectionCard from "@/components/dashboard/SectionCard";
import LoadingCard from "@/components/dashboard/LoadingCard";
import Button from "@/components/ui/button/Button";
import Card from "@/components/ui/card/Card";
import { getRecruiterStats, searchCandidates, type RecruiterStats, type Candidate } from "@/services/recruiter";

export default function RecruiterDashboard() {
  const [stats, setStats] = useState<RecruiterStats | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const data = await getRecruiterStats();
        setStats(data);
        const list = await searchCandidates("", 85);
        setCandidates(list);
      } catch {
        toast.error("Failed to load recruiter dashboard metrics.");
      } finally {
        setLoading(false);
      }
    }
    void loadDashboard();
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

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Header */}
        <div className="border-b border-[#1F2937] pb-8">
          <h1 className="text-[36px] font-bold text-white tracking-tight">
            Recruiter Console 🎯
          </h1>
          <p className="mt-2 text-[#94A3B8] text-[14px]">
            Access advanced candidate query search, inspect AI-driven similarity rankings, schedule invites, and track pipeline metrics.
          </p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Open Job Openings"
              value={stats.openPostings}
              icon={<Briefcase size={20} className="text-cyan-400" />}
              color="bg-cyan-500/10 border-cyan-500/20"
              textColor="text-cyan-400"
            />
            <StatCard
              title="Total Applicants"
              value={stats.totalApplicants}
              icon={<Users size={20} className="text-violet-400" />}
              color="bg-violet-500/10 border-violet-500/20"
              textColor="text-violet-400"
            />
            <StatCard
              title="Shortlisted Candidates"
              value={stats.shortlistedCount}
              icon={<Star size={20} className="text-emerald-400" />}
              color="bg-emerald-500/10 border-emerald-500/20"
              textColor="text-emerald-400"
            />
            <StatCard
              title="Mock Sessions Scheduled"
              value={stats.interviewsHeld}
              icon={<Calendar size={20} className="text-amber-400" />}
              color="bg-amber-500/10 border-amber-500/20"
              textColor="text-amber-400"
            />
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          
          {/* Main Top Candidates list */}
          <div className="lg:col-span-2 space-y-8">
            <SectionCard title="Top Matching Talent Pool">
              {candidates.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-6">No matching candidates currently registered.</p>
              ) : (
                <div className="space-y-4">
                  {candidates.map((cand) => (
                    <div key={cand.id} className="flex justify-between items-center bg-slate-950/40 p-4 rounded-xl border border-slate-850">
                      <div>
                        <h4 className="font-bold text-white text-sm">{cand.name}</h4>
                        <p className="text-xs text-slate-400 mt-1">Role: {cand.targetRole}</p>
                        <div className="flex gap-1.5 flex-wrap mt-2">
                          {cand.skills.map((s) => (
                            <span key={s} className="text-[9px] bg-slate-905 border border-slate-850 px-1.5 py-0.5 rounded text-slate-300">{s}</span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">ATS SCORE</span>
                          <span className="text-cyan-400 font-extrabold text-sm block">{cand.resumeScore}%</span>
                        </div>
                        <Link to="/recruiter/search">
                          <Button className="text-xs py-1 px-3">
                            View Profile
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>

          {/* Quick Actions sidebar */}
          <div className="space-y-8">
            <Card variant="glass" className="p-6 space-y-4">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">Recruitment Shortcuts</h3>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <Link to="/recruiter/search" className="flex items-center justify-between p-2 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-850 transition">
                  <span className="font-semibold text-slate-300">Candidate Directory</span>
                  <ArrowRight size={12} className="text-cyan-400" />
                </Link>
                <Link to="/recruiter/ranking" className="flex items-center justify-between p-2 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-850 transition">
                  <span className="font-semibold text-slate-300">AI Scoring Matrix</span>
                  <ArrowRight size={12} className="text-cyan-400" />
                </Link>
                <Link to="/recruiter/pipeline" className="flex items-center justify-between p-2 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-850 transition">
                  <span className="font-semibold text-slate-300">Hiring Pipeline (Kanban)</span>
                  <ArrowRight size={12} className="text-cyan-400" />
                </Link>
              </div>
            </Card>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
