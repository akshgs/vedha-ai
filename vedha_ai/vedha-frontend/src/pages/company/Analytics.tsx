import { useEffect, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import { RefreshCw } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import SectionCard from "@/components/dashboard/SectionCard";
import { getCompanyJobs, getJobApplications } from "@/services/company";

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [jobsData, setJobsData] = useState<{ name: string; applicants: number }[]>([]);
  const [statusData, setStatusData] = useState<{ name: string; value: number }[]>([]);

  const COLORS = ["#38bdf8", "#818cf8", "#34d399", "#f87171", "#fbbf24"];

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        const companyJobs = await getCompanyJobs();

        const barChartList: { name: string; applicants: number }[] = [];
        const statusMap: Record<string, number> = {
          applied: 0,
          screening: 0,
          interview: 0,
          offer: 0,
          rejected: 0,
        };

        await Promise.all(
          companyJobs.map(async (job) => {
            try {
              const apps = await getJobApplications(job.id);
              barChartList.push({
                name: job.title.length > 15 ? job.title.slice(0, 15) + "..." : job.title,
                applicants: apps.length,
              });

              apps.forEach((app) => {
                const s = app.status.toLowerCase();
                if (statusMap[s] !== undefined) {
                  statusMap[s]++;
                } else {
                  statusMap[s] = 1;
                }
              });
            } catch (err) {
              console.error(err);
            }
          })
        );

        setJobsData(barChartList);

        const pieChartList = Object.entries(statusMap)
          .map(([key, val]) => ({
            name: key.toUpperCase(),
            value: val,
          }))
          .filter((item) => item.value > 0);

        setStatusData(pieChartList);
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center text-slate-400">
          <RefreshCw size={24} className="animate-spin mr-2" />
          Analyzing hiring statistics...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8 font-sans">
        <div>
          <h1 className="text-3xl font-bold">Hiring Analytics</h1>
          <p className="mt-2 text-slate-400">
            Monitor applicant conversion rates, popular job openings, and pipeline flow metrics.
          </p>
        </div>

        {jobsData.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center text-slate-500 text-sm">
            Insufficient hiring data to analyze. Post active jobs and collect applicant resumes to populate metrics.
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Applicants per Job */}
            <SectionCard title="Applicants count per Job Listing">
              <div className="h-80 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={jobsData}>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", borderColor: "#334155" }}
                    />
                    <Bar dataKey="applicants" fill="#34d399" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>

            {/* Candidate Pipeline Status Distribution */}
            <SectionCard title="Candidate Pipeline Stage Distribution">
              {statusData.length === 0 ? (
                <div className="h-80 flex items-center justify-center text-slate-500 text-xs">
                  No applicant applications gathered.
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mt-4">
                  <div className="h-64 w-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {statusData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", borderColor: "#334155" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-3">
                    {statusData.map((item, idx) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                        />
                        <span className="text-xs text-slate-300 font-semibold">{item.name}:</span>
                        <span className="text-xs text-slate-400 font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </SectionCard>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
