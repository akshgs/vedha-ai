import { useEffect, useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart2, Users, FileText, Clock, Zap } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/layouts/DashboardLayout";
import Card from "@/components/ui/card/Card";
import { getEmployeeStats, type EmployeeDashboardStats } from "@/services/employee";

const MOCK_MONTHLY_HOURS = [
  { month: "Jan", hours: 4 },
  { month: "Feb", hours: 8 },
  { month: "Mar", hours: 10 },
  { month: "Apr", hours: 12 },
  { month: "May", hours: 15 },
  { month: "Jun", hours: 18 },
];

const MOCK_REVIEWS_TREND = [
  { week: "Wk 1", count: 2 },
  { week: "Wk 2", count: 5 },
  { week: "Wk 3", count: 8 },
  { week: "Wk 4", count: 9 },
];

export default function EmployeeAnalytics() {
  const [stats, setStats] = useState<EmployeeDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const data = await getEmployeeStats();
        setStats(data);
      } catch {
        toast.error("Failed to load statistics logs.");
      } finally {
        setLoading(false);
      }
    }
    void loadStats();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-8 text-center text-slate-500 animate-pulse">
          Loading analytics metrics...
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
            Mentor Analytics Dashboard
          </h1>
          <p className="mt-2 text-slate-400 text-sm">
            Monitor your mentorship metrics, review distributions, and blog reader metrics over time.
          </p>
        </div>

        {/* Aggregate Cards */}
        {stats && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card variant="glass" className="p-6 space-y-1">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-[10px] uppercase font-bold tracking-wider">Total Mentoring Hours</span>
                <Clock size={16} className="text-cyan-400" />
              </div>
              <p className="text-3xl font-black text-white">{stats.mentoringHours} hrs</p>
            </Card>

            <Card variant="glass" className="p-6 space-y-1">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-[10px] uppercase font-bold tracking-wider">Resumes Audited</span>
                <FileText size={16} className="text-emerald-400" />
              </div>
              <p className="text-3xl font-black text-white">{stats.resumesReviewed}</p>
            </Card>

            <Card variant="glass" className="p-6 space-y-1">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-[10px] uppercase font-bold tracking-wider">Active Bookings</span>
                <Users size={16} className="text-violet-400" />
              </div>
              <p className="text-3xl font-black text-white">{stats.mockInterviewsScheduled}</p>
            </Card>

            <Card variant="glass" className="p-6 space-y-1">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-[10px] uppercase font-bold tracking-wider">Overall Engagement</span>
                <Zap size={16} className="text-amber-400" />
              </div>
              <p className="text-3xl font-black text-white">{stats.blogEngagement} clicks</p>
            </Card>
          </div>
        )}

        {/* Charts */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Mentoring Hours growth */}
          <Card variant="glass" className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-850 pb-2">Monthly hours logged</h3>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_MONTHLY_HOURS}>
                  <XAxis dataKey="month" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b" }} />
                  <Bar dataKey="hours" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Resume Review Growth */}
          <Card variant="glass" className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-850 pb-2">Evaluations progress</h3>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_REVIEWS_TREND}>
                  <XAxis dataKey="week" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b" }} />
                  <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

      </div>
    </DashboardLayout>
  );
}
