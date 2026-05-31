// app/company/page.tsx — Company Dashboard
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { jobsAPI, leaderboardAPI } from "@/lib/api";

export default function CompanyDashboard() {
  const router   = useRouter();
  const { user, logout, loadFromStorage } = useAuthStore();
  const [activeTab,    setActiveTab]    = useState("talent");
  const [leaderboard,  setLeaderboard]  = useState<any[]>([]);
  const [jobs,         setJobs]         = useState<any[]>([]);
  const [scraping,     setScraping]     = useState(false);
  const [stats,        setStats]        = useState<any>(null);

  useEffect(() => { loadFromStorage(); }, []);

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    if (user.role !== "company") { router.push(`/${user.role}`); return; }
    fetchLeaderboard();
    fetchJobs();
    fetchStats();
  }, [user]);

  const fetchLeaderboard = async () => {
    try { const res = await leaderboardAPI.top(); setLeaderboard(res.data.leaderboard || []); } catch {}
  };

  const fetchJobs = async () => {
    try { const res = await jobsAPI.getJobs({ limit: 20 }); setJobs(res.data.jobs || []); } catch {}
  };

  const fetchStats = async () => {
    try { const res = await jobsAPI.stats(); setStats(res.data); } catch {}
  };

  const triggerScrape = async () => {
    setScraping(true);
    try { await jobsAPI.scrape(); await fetchJobs(); await fetchStats(); } catch {}
    finally { setScraping(false); }
  };

  const tabs = [
    { id: "talent", label: "🎯 Talent Pool" },
    { id: "jobs",   label: "💼 Job Market" },
  ];

  if (!user) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-green-400">⚡ Vedha AI</h1>
          <p className="text-xs text-gray-400">Company Portal</p>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sm">{user.name}</p>
          <button onClick={() => { logout(); router.push("/login"); }}
            className="text-xs text-gray-400 hover:text-white px-3 py-1 rounded-lg border border-gray-700">
            Logout
          </button>
        </div>
      </header>

      {/* Stats bar */}
      {stats && (
        <div className="bg-gray-900/50 border-b border-gray-800 px-6 py-3 flex gap-6 text-sm">
          <span className="text-gray-400">Total Jobs: <span className="text-white font-medium">{stats.total_jobs}</span></span>
          {Object.entries(stats.by_source || {}).map(([src, cnt]: any) => (
            <span key={src} className="text-gray-400">{src}: <span className="text-green-400 font-medium">{cnt}</span></span>
          ))}
          <button onClick={triggerScrape} disabled={scraping}
            className="ml-auto bg-green-700 hover:bg-green-600 disabled:bg-gray-700 px-4 py-1 rounded-lg text-xs font-medium transition-all">
            {scraping ? "Scraping..." : "🔄 Refresh Jobs"}
          </button>
        </div>
      )}

      <div className="border-b border-gray-800 px-6">
        <div className="flex gap-1">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                activeTab === t.id ? "border-green-500 text-green-400" : "border-transparent text-gray-400 hover:text-white"
              }`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 max-w-5xl mx-auto">
        {/* Talent Pool */}
        {activeTab === "talent" && (
          <div>
            <h2 className="text-lg font-semibold text-green-400 mb-4">Top Talent — Kerala IT</h2>
            <div className="space-y-3">
              {leaderboard.map((student, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-4 hover:border-green-800 transition-all">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                    i === 0 ? "bg-yellow-500 text-black" :
                    i === 1 ? "bg-gray-400 text-black" :
                    i === 2 ? "bg-amber-700 text-white" : "bg-gray-700 text-white"
                  }`}>
                    #{student.rank}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-gray-400">{student.goal}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-bold">{student.score}%</p>
                    <p className="text-xs text-gray-500">{student.skill_count} skills</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Job Market */}
        {activeTab === "jobs" && (
          <div>
            <h2 className="text-lg font-semibold text-green-400 mb-4">Live Job Market Data</h2>
            <div className="space-y-3">
              {jobs.map((job, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-green-800 transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{job.title}</h3>
                      <p className="text-sm text-gray-400 mt-1">{job.company} • {job.location}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {job.skills?.slice(0, 4).map((s: string, j: number) => (
                          <span key={j} className="text-xs bg-green-900/40 text-green-300 px-2 py-1 rounded-lg">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-4 text-right">
                      <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-lg">{job.source}</span>
                      <p className="text-xs text-gray-500 mt-1">{job.salary}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}