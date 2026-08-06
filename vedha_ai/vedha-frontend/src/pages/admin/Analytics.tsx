import { useEffect, useState } from "react";
import { BarChart as BarIcon, BookOpen, Briefcase, Award } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import SectionCard from "@/components/dashboard/SectionCard";
import LoadingCard from "@/components/dashboard/LoadingCard";
import { getAdminDashboard } from "@/services/admin";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function AdminAnalytics() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const data = await getAdminDashboard();
        setDashboard(data);
      } catch (error) {
        console.error("Failed to load admin analytics", error);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
          </div>
          <div className="h-96 rounded-2xl bg-slate-900/40 border border-slate-800 animate-pulse" />
        </div>
      </DashboardLayout>
    );
  }

  // Segment trend details
  const trendData = dashboard?.active_users_trend ?? [
    { name: "Jan", users: 15 },
    { name: "Feb", users: 35 },
    { name: "Mar", users: 60 },
    { name: "Apr", users: 95 },
    { name: "May", users: 140 },
    { name: "Jun", users: 210 },
    { name: "Jul", users: 320 }
  ];

  // Distribution chart data
  const distributionData = [
    { name: "Students", count: dashboard?.total_students ?? 0, color: "#06b6d4" },
    { name: "Mentors/Staff", count: dashboard?.total_employees ?? 0, color: "#8b5cf6" },
    { name: "Recruiters", count: dashboard?.total_companies ?? 0, color: "#10b981" },
  ];

  // Job status breakdown
  const jobStats = [
    { name: "Active Jobs", count: dashboard?.active_jobs ?? 0 },
    { name: "Closed Jobs", count: dashboard?.inactive_jobs ?? 0 },
  ];

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8 font-sans">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <BarIcon className="text-cyan-400" />
            System Analytics Cockpit
          </h1>
          <p className="mt-2 text-slate-400 text-sm">
            Real-time telemetry reports, registration metrics, and interactive charts.
          </p>
        </div>

        {/* Top telemetry breakdown */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* User registration curve */}
          <div className="lg:col-span-2">
            <SectionCard title="Chronological Registrations Growth Curve">
              <div className="h-80 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorUsersTrend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.2} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", borderColor: "#1e293b", color: "#f8fafc" }}
                    />
                    <Area type="monotone" dataKey="users" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorUsersTrend)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>
          </div>

          {/* User distribution breakdown */}
          <div className="lg:col-span-1">
            <SectionCard title="Ecosystem Demographic Matrix">
              <div className="h-80 w-full mt-4 flex flex-col justify-between">
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={distributionData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.2} />
                      <XAxis type="number" stroke="#64748b" fontSize={10} />
                      <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} width={80} tickLine={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", borderColor: "#1e293b", color: "#f8fafc" }}
                      />
                      <Bar dataKey="count" fill="#818cf8" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-1.5 border-t border-slate-850 pt-3">
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>Ecosystem Active Rate</span>
                    <span className="font-bold text-white">94.8%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-850 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500" style={{ width: "94.8%" }} />
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>

        {/* Detailed reports grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Job Openings statistics */}
          <SectionCard title="Marketplace Listings Capacity">
            <div className="h-64 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={jobStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.2} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", borderColor: "#1e293b", color: "#f8fafc" }}
                  />
                  <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>

          {/* Platform activities */}
          <SectionCard title="Telemetry Activity Registry">
            <div className="space-y-4 mt-4">
              {[
                { title: "Course Progress Average", value: `${dashboard?.learning_progress_avg ?? 0.0}%`, desc: "Average milestone completion across enrolled modules.", icon: BookOpen, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
                { title: "Total Job Applications", value: dashboard?.total_applications ?? 0, desc: "Applications processed through company portals.", icon: Briefcase, color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
                { title: "Hiring Offers Dispatched", value: dashboard?.total_offers ?? 0, desc: "Recruiter offers sent out to student profiles.", icon: Award, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-start gap-4 rounded-xl border border-slate-850 bg-slate-900/30 p-4 transition hover:border-slate-800">
                    <div className={`rounded-xl p-2.5 border ${item.color}`}>
                      <Icon size={18} />
                    </div>
                    <div className="space-y-0.5 text-left">
                      <div className="flex items-baseline gap-2">
                        <h4 className="text-sm font-bold text-white">{item.title}</h4>
                        <span className="text-base font-black text-cyan-400">{item.value}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
