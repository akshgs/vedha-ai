import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { BarChart2, Users, Briefcase, Star, Clock } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/layouts/DashboardLayout";
import Card from "@/components/ui/card/Card";
import { getRecruiterStats, type RecruiterStats } from "@/services/recruiter";

const MOCK_FUNNEL_DATA = [
  { stage: "Applied", candidates: 142 },
  { stage: "Screened", candidates: 65 },
  { stage: "Technical", candidates: 32 },
  { stage: "HR Round", candidates: 12 },
  { stage: "Offers", candidates: 4 },
];

const MOCK_TIME_TO_HIRE = [
  { month: "Jan", days: 25 },
  { month: "Feb", days: 22 },
  { month: "Mar", days: 19 },
  { month: "Apr", days: 18 },
  { month: "May", days: 16 },
  { month: "Jun", days: 15 },
];

export default function RecruiterAnalytics() {
  const [stats, setStats] = useState<RecruiterStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const data = await getRecruiterStats();
        setStats(data);
      } catch {
        toast.error("Failed to query recruitment analytics.");
      } finally {
        setLoading(false);
      }
    }
    void loadStats();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl bg-slate-905 border border-slate-800 p-8 text-center text-slate-500 animate-pulse">
          Loading metrics...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Title */}
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <BarChart2 className="text-cyan-400" />
            Recruitment Funnel Analytics
          </h1>
          <p className="mt-2 text-slate-400 text-sm">
            Evaluate time-to-hire trends, stage-by-stage candidate conversions, and overall team recruitment speed.
          </p>
        </div>

        {/* Aggregate Cards */}
        {stats && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card variant="glass" className="p-6 space-y-1">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-[10px] uppercase font-bold tracking-wider">Active Postings</span>
                <Briefcase size={16} className="text-cyan-400" />
              </div>
              <p className="text-3xl font-black text-white">{stats.openPostings}</p>
            </Card>

            <Card variant="glass" className="p-6 space-y-1">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-[10px] uppercase font-bold tracking-wider">Total Pool</span>
                <Users size={16} className="text-violet-400" />
              </div>
              <p className="text-3xl font-black text-white">{stats.totalApplicants}</p>
            </Card>

            <Card variant="glass" className="p-6 space-y-1">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-[10px] uppercase font-bold tracking-wider">Shortlisted Candidates</span>
                <Star size={16} className="text-emerald-400" />
              </div>
              <p className="text-3xl font-black text-white">{stats.shortlistedCount}</p>
            </Card>

            <Card variant="glass" className="p-6 space-y-1">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-[10px] uppercase font-bold tracking-wider">Avg Time-to-Hire</span>
                <Clock size={16} className="text-amber-400" />
              </div>
              <p className="text-3xl font-black text-white">15.5 Days</p>
            </Card>
          </div>
        )}

        {/* Charts */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Funnel Conversions */}
          <Card variant="glass" className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-850 pb-2">Hiring stage conversion count</h3>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_FUNNEL_DATA}>
                  <XAxis dataKey="stage" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b" }} />
                  <Bar dataKey="candidates" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Time to fill jobs */}
          <Card variant="glass" className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-850 pb-2">Time-to-Hire duration trends (days)</h3>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_TIME_TO_HIRE}>
                  <XAxis dataKey="month" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b" }} />
                  <Area type="monotone" dataKey="days" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.15} strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

      </div>
    </DashboardLayout>
  );
}
