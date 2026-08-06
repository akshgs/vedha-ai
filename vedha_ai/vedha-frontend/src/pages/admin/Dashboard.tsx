import { useEffect, useState } from "react";
import { Users, Building, Briefcase, FileText, CheckSquare, GraduationCap, Award, BookOpen, Clock, Activity } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import SectionCard from "@/components/dashboard/SectionCard";
import LoadingCard from "@/components/dashboard/LoadingCard";
import { getAdminDashboard } from "@/services/admin";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

import PageHeader from "@/components/ui/layout/PageHeader";

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await getAdminDashboard();
        setDashboard(data);
      } catch (error) {
        console.error("Failed to load admin dashboard", error);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="w-full max-w-[1440px] mx-auto px-8 py-8 space-y-6">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
          </div>
          <div className="h-64 rounded-2xl bg-slate-900/40 border border-slate-800 animate-pulse" />
        </div>
      </DashboardLayout>
    );
  }

  // Active Users chronological trend
  const growthData = dashboard?.active_users_trend ?? [
    { name: "Jan", users: 15 },
    { name: "Feb", users: 35 },
    { name: "Mar", users: 60 },
    { name: "Apr", users: 95 },
    { name: "May", users: 140 },
    { name: "Jun", users: 210 },
    { name: "Jul", users: 320 }
  ];

  return (
    <DashboardLayout>
      <div className="w-full max-w-[1440px] mx-auto px-8 py-8 space-y-8 font-sans">
        {/* Header */}
        <PageHeader
          title="Operations Console"
          subtitle="System administration cockpit monitoring portal users, recruiters, active jobs, learning progress, and verification lines."
          icon={<Activity size={24} />}
        />

        {/* Telemetry Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Registered Students"
            value={dashboard?.total_students ?? 0}
            icon={<GraduationCap size={24} className="text-white" />}
            color="bg-cyan-600"
            textColor="text-cyan-400"
          />

          <StatCard
            title="Ecosystem Mentors / Employees"
            value={dashboard?.total_employees ?? 0}
            icon={<Users size={24} className="text-white" />}
            color="bg-violet-600"
            textColor="text-violet-400"
          />

          <StatCard
            title="Total Companies"
            value={dashboard?.total_companies ?? 0}
            icon={<Building size={24} className="text-white" />}
            color="bg-emerald-600"
            textColor="text-emerald-400"
          />

          <StatCard
            title="Active Jobs Listings"
            value={dashboard?.active_jobs ?? 0}
            icon={<Briefcase size={24} className="text-white" />}
            color="bg-teal-600"
            textColor="text-teal-400"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Submitted Applications"
            value={dashboard?.total_applications ?? 0}
            icon={<FileText size={24} className="text-white" />}
            color="bg-indigo-600"
            textColor="text-indigo-400"
          />

          <StatCard
            title="Mock Interviews Scheduled"
            value={dashboard?.total_interviews ?? 0}
            icon={<Clock size={24} className="text-white" />}
            color="bg-blue-600"
            textColor="text-blue-400"
          />

          <StatCard
            title="Active Hiring Offers"
            value={dashboard?.total_offers ?? 0}
            icon={<Award size={24} className="text-white" />}
            color="bg-pink-600"
            textColor="text-pink-400"
          />

          <StatCard
            title="Total Learning Courses"
            value={dashboard?.total_courses ?? 0}
            icon={<BookOpen size={24} className="text-white" />}
            color="bg-amber-600"
            textColor="text-amber-400"
          />
        </div>

        {/* Dynamic section */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Growth Trend Area Chart */}
          <div className="lg:col-span-2">
            <SectionCard title="Active User Growth Trend">
              <div className="h-72 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={growthData}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", borderColor: "#1e293b", color: "#f8fafc" }}
                    />
                    <Area type="monotone" dataKey="users" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#colorUsers)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>
          </div>

          {/* Pending Approvals & Learning telemetry cards */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Learning telemetry progress */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 flex flex-col justify-between">
              <div className="space-y-1">
                <h3 className="text-xs uppercase font-bold text-slate-500 tracking-wider">Average Learning Progress</h3>
                <p className="text-2xl font-black text-white">{dashboard?.learning_progress_avg ?? 0.0}%</p>
              </div>
              <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-850 border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-500"
                  style={{ width: `${dashboard?.learning_progress_avg ?? 0}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-2">Aggregated syllabus completion rate across all active student cohorts.</p>
            </div>

            {/* Verification queue card */}
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 flex flex-col justify-between h-full">
              <div className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                  <CheckSquare size={20} />
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Verification Queue</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Recruiter profiles awaiting authorization review to list company jobs.
                </p>
              </div>

              <div className="mt-6">
                <div className="flex items-baseline gap-2">
                  <h4 className="text-4xl font-black text-amber-400">
                    {dashboard?.pending_companies ?? 0}
                  </h4>
                  <span className="text-xs font-semibold text-slate-400">pending profiles</span>
                </div>

                <a
                  href="/admin/approvals"
                  className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-amber-400"
                >
                  Open Audit Queue
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}