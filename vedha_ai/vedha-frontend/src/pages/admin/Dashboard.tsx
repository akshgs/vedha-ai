import { useEffect, useState } from "react";
import { Users, Building, Briefcase, FileText, CheckSquare } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import SectionCard from "@/components/dashboard/SectionCard";
import LoadingCard from "@/components/dashboard/LoadingCard";
import { getAdminDashboard } from "@/services/admin";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

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
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
        </div>
      </DashboardLayout>
    );
  }

  // Generate chart data based on stats
  const chartData = [
    { name: "Users", count: dashboard?.total_users ?? 0 },
    { name: "Companies", count: dashboard?.total_companies ?? 0 },
    { name: "Jobs", count: dashboard?.total_jobs ?? 0 },
    { name: "Applications", count: dashboard?.total_applications ?? 0 },
  ];

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8 font-sans">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-white">Operations Console 🛡️</h1>
          <p className="mt-2 text-slate-400">
            System administration cockpit monitoring portal users, recruiters, active jobs, and verification lines.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Users"
            value={dashboard?.total_users ?? 0}
            icon={<Users size={28} className="text-white" />}
            color="bg-indigo-600"
            textColor="text-indigo-400"
          />

          <StatCard
            title="Total Companies"
            value={dashboard?.total_companies ?? 0}
            icon={<Building size={28} className="text-white" />}
            color="bg-emerald-600"
            textColor="text-emerald-400"
          />

          <StatCard
            title="Active Job Listings"
            value={dashboard?.total_jobs ?? 0}
            icon={<Briefcase size={28} className="text-white" />}
            color="bg-teal-600"
            textColor="text-teal-400"
          />

          <StatCard
            title="Total Applications"
            value={dashboard?.total_applications ?? 0}
            icon={<FileText size={28} className="text-white" />}
            color="bg-violet-600"
            textColor="text-violet-400"
          />
        </div>

        {/* Dynamic section */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Chart Section */}
          <div className="lg:col-span-2">
            <SectionCard title="System Activity Indicators">
              <div className="h-72 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", borderColor: "#334155" }}
                    />
                    <Bar dataKey="count" fill="#818cf8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>
          </div>

          {/* Pending Approvals quick card */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 shadow-xl backdrop-blur-sm flex flex-col justify-between h-full">
              <div className="space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                  <CheckSquare size={24} />
                </div>
                <h3 className="text-lg font-bold text-white">Pending Verification</h3>
                <p className="text-xs text-slate-400">
                  New corporate accounts waiting to register job postings. Inspect details to approve access.
                </p>
              </div>

              <div className="mt-8">
                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Awaiting action</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <h4 className="text-5xl font-black text-amber-400">
                    {dashboard?.pending_companies ?? 0}
                  </h4>
                  <span className="text-sm font-semibold text-slate-400">companies</span>
                </div>

                <a
                  href="/admin/approvals"
                  className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-amber-400"
                >
                  Review Queue
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}