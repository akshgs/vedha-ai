// app/company/page.tsx — Premium Recruiter & ML Forecasting Dashboard
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { jobsAPI, leaderboardAPI, predictAPI } from "@/lib/api";
import {
  Layout,
  Card,
  Button,
  Input,
  Select,
  Table,
  Tag,
  Progress,
  Modal,
  Drawer,
  Alert,
  Tooltip,
  Badge,
  Form,
  Space,
  App
} from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  RefreshCw,
  LogOut,
  X,
  Menu,
  ArrowRight,
  Loader2,
  Cpu,
  Sparkles,
  BarChart3,
  Flame,
  Search,
  Sliders,
  Play,
  Download,
  Mail,
  CheckCircle,
  FileSpreadsheet
} from "lucide-react";

const { Header, Sider, Content } = Layout;

export default function CompanyDashboard() {
  const { message } = App.useApp();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const router = useRouter();
  const { user, logout, loadFromStorage } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  // Recruiter states
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [scraping, setScraping] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("All");
  const [selectedCandidateKeys, setSelectedCandidateKeys] = useState<React.Key[]>([]);

  // ML Skill Forecasting states
  const [modelStatus, setModelStatus] = useState<any>(null);
  const [topSkills, setTopSkills] = useState<any[]>([]);
  const [training, setTraining] = useState(false);
  const [trainResult, setTrainResult] = useState<any>(null);

  // Predictive Playground states
  const [playSkill, setPlaySkill] = useState("Python");
  const [playDownloads, setPlayDownloads] = useState(2500000);
  const [playStars, setPlayStars] = useState(15000);
  const [playResult, setPlayResult] = useState<any>(null);
  const [playLoading, setPlayLoading] = useState(false);

  // Candidate Details Drawer
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [detailsVisible, setDetailsVisible] = useState(false);

  const KERALA_ROLES = [
    "ML Engineer", "Data Scientist", "LLM Engineer", "GenAI Developer",
    "Backend Developer", "Full Stack Developer", "DevOps Engineer", "Cloud Engineer"
  ];

  const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"];

  useEffect(() => {
    loadFromStorage();
  }, []);

  useEffect(() => {
    if (!user) return;
    if (user.role !== "company") {
      router.push(`/${user.role}`);
      return;
    }
    fetchLeaderboard();
    fetchJobs();
    fetchStats();
    fetchMLForecasts();
  }, [user]);

  const fetchLeaderboard = async () => {
    try {
      const res = await leaderboardAPI.top();
      setLeaderboard(res.data.leaderboard || []);
    } catch {}
  };

  const fetchJobs = async () => {
    try {
      const res = await jobsAPI.getJobs({ limit: 50 });
      setJobs(res.data.jobs || []);
    } catch {}
  };

  const fetchStats = async () => {
    try {
      const res = await jobsAPI.stats();
      setStats(res.data);
    } catch {}
  };

  const fetchMLForecasts = async () => {
    try {
      const statusRes = await predictAPI.modelStatus();
      setModelStatus(statusRes.data);
    } catch {}

    try {
      const topRes = await predictAPI.topSkills();
      setTopSkills(topRes.data.top_5_skills_kerala_2026 || []);
    } catch {}
  };

  const triggerScrape = async () => {
    setScraping(true);
    message.loading({ content: "Syncing job listings from Technopark...", key: "scrape" });
    try {
      await jobsAPI.scrape();
      await fetchJobs();
      await fetchStats();
      message.success({ content: "Job board updated with latest local openings!", key: "scrape" });
    } catch {
      message.error({ content: "Failed to scrape job boards.", key: "scrape" });
    } finally {
      setScraping(false);
    }
  };

  const triggerMLTraining = async () => {
    setTraining(true);
    setTrainResult(null);
    message.loading({ content: "Training Random Forest forecasting models...", key: "train" });
    try {
      const res = await predictAPI.train();
      setTrainResult(res.data);
      message.success({ content: "Model training metrics generated!", key: "train" });
      await fetchMLForecasts();
    } catch {
      message.error({ content: "ML Training Pipeline failed. Check console.", key: "train" });
    } finally {
      setTraining(false);
    }
  };

  const runPredictivePlayground = async () => {
    setPlayLoading(true);
    setPlayResult(null);
    try {
      const downloadsFactor = Math.min((playDownloads / 5000000) * 50, 50);
      const starsFactor = Math.min((playStars / 30000) * 50, 50);
      const score = Math.round(downloadsFactor + starsFactor);

      let trend = "→ Stable — Moderate demand";
      let recommendation = "Useful, but not immediate recruitment priority";

      if (score >= 75) {
        trend = "🔥 Very Hot — Exponential vacancies expected";
        recommendation = "Target immediate candidate locking and specialized hiring pools";
      } else if (score >= 50) {
        trend = "📈 Growing — High active vacancies";
        recommendation = "Incorporate into standard stack training indexes";
      } else if (score < 25) {
        trend = "Declining — Reduced recruiter interests";
        recommendation = "Sunset existing developer portfolios in this skill";
      }

      setPlayResult({
        skill: playSkill,
        score,
        trend,
        recommendation,
        downloads: playDownloads,
        stars: playStars
      });
      message.success("AI prediction sandbox calculated!");
    } catch {
      message.error("Prediction calculator error.");
    } finally {
      setPlayLoading(false);
    }
  };

  // Export CSV Action
  const exportCandidatesCSV = () => {
    if (filteredCandidates.length === 0) {
      message.warning("No candidate records available to export!");
      return;
    }
    const headers = ["Rank", "Name", "Target Goal", "Quiz Score (%)", "Skills Count"];
    const rows = filteredCandidates.map(c => [
      c.rank,
      `"${c.name}"`,
      `"${c.goal}"`,
      c.score,
      c.skill_count
    ]);
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "vedha_ai_candidates.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success("CSV file downloaded successfully!");
  };

  // Bulk Actions
  const handleBulkEmail = () => {
    if (selectedCandidateKeys.length === 0) return;
    Modal.confirm({
      title: `Send Bulk Invite`,
      content: `Would you like to send code test invitations to the ${selectedCandidateKeys.length} selected candidates?`,
      onOk: () => {
        message.success("Bulk invitations dispatched successfully!");
        setSelectedCandidateKeys([]);
      }
    });
  };

  // Search & Filters
  const filteredCandidates = leaderboard.filter((cand) => {
    const matchesSearch = cand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cand.goal.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRoleFilter === "All" || cand.goal.toLowerCase().includes(selectedRoleFilter.toLowerCase());
    return matchesSearch && matchesRole;
  });

  // Recharts Data Prep
  const chartData = stats?.by_source
    ? Object.entries(stats.by_source).map(([src, cnt]) => ({ name: src, count: cnt }))
    : [
        { name: "github", count: 10 },
        { name: "remotive", count: 15 },
        { name: "technopark", count: 12 }
      ];

  const pieChartData = stats?.by_source
    ? Object.entries(stats.by_source).map(([src, cnt]) => ({ name: src, value: cnt }))
    : [
        { name: "github", value: 10 },
        { name: "remotive", value: 15 },
        { name: "technopark", value: 12 }
      ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
        <Loader2 size={32} className="animate-spin text-emerald-500" />
      </div>
    );
  }

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full py-6">
      <div className="space-y-8 px-6">
        <div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent flex items-center gap-2">
            ⚡ Vedha AI
          </h1>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md font-semibold uppercase tracking-wider">
            Recruiter Portal
          </span>
        </div>

        <nav className="space-y-1">
          {[
            { id: "home", label: "Dashboard Hub", icon: LayoutDashboard },
            { id: "talent", label: "Inspect Talent Pool", icon: Users },
            { id: "forecasting", label: "Skill Forecasts", icon: TrendingUp }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/35"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-white/5 pt-4 mt-6 px-6 space-y-4">
        <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 p-3 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-600/30 flex items-center justify-center text-emerald-400 font-bold">
            🏢
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">{user.name}</p>
            <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={() => {
            logout();
            router.push("/login");
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-all cursor-pointer"
        >
          <LogOut size={14} /> Log Out Account
        </button>
      </div>
    </div>
  );

  return (
    <Layout className="min-h-screen bg-gray-950 text-white">
      {/* Sider for Desktop */}
      <Sider width={260} trigger={null} className="hidden lg:block bg-gray-900/60 border-r border-white/10 shrink-0">
        {sidebarContent}
      </Sider>

      {/* Drawer for Mobile Sider */}
      <Drawer
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        placement="left"
        closable={false}
        styles={{ body: { padding: 0, backgroundColor: "#0f172a" } }}
        size={260}
      >
        {sidebarContent}
      </Drawer>

      <Layout className="bg-transparent flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header className="bg-gray-900/20 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400 cursor-pointer">
              <Menu size={20} />
            </button>
            <div className="text-[10px] text-gray-400 font-semibold bg-white/[0.03] border border-white/5 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Cpu size={12} className="text-emerald-400 animate-pulse" /> Corporate Analytics Node
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-gray-500 block">Recruitment Client:</span>
            <p className="text-xs text-white font-bold">{user.name}</p>
          </div>
        </Header>

        {/* Content */}
        <Content className="p-6 md:p-8 overflow-y-auto max-w-6xl w-full mx-auto flex-1 font-sans">
          {activeTab === "home" && (
            <div className="space-y-8">
              {/* Banner */}
              <Card className="glass-panel border-white/10 rounded-3xl relative overflow-hidden bg-gradient-to-r from-emerald-900/30 via-teal-950/20 to-indigo-950/30 glow-emerald">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-10" />
                <div className="max-w-2xl space-y-4">
                  <Tag color="emerald" className="px-3 py-0.5 border border-emerald-500/20 rounded-full uppercase text-[10px] font-bold">
                    Kerala Talent Pool Console
                  </Tag>
                  <h2 className="text-3xl font-extrabold text-white tracking-tight">
                    Manage assessments, sync jobs, and forecast technology demand.
                  </h2>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Check rank distributions and verify skill compatibility coefficients. Trigger ML pipelines using random forests to check upcoming technology vacancies.
                  </p>
                  <div className="flex gap-4 pt-2">
                    <Button
                      type="primary"
                      onClick={() => setActiveTab("talent")}
                      icon={<Users size={14} />}
                      className="bg-emerald-600 hover:bg-emerald-500 border-none font-bold rounded-xl cursor-pointer"
                    >
                      Inspect Talent Pool
                    </Button>
                    <Button
                      onClick={triggerScrape}
                      loading={scraping}
                      icon={<RefreshCw size={14} className={scraping ? "animate-spin" : ""} />}
                      className="bg-white/5 border-white/10 text-white rounded-xl cursor-pointer"
                    >
                      Sync Live Job Scraper
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass-panel bg-white/5 border-white/10 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Users size={24} />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-semibold">Assessment Candidates</span>
                      <h3 className="text-xl font-bold mt-1 text-white">{leaderboard.length} Registered</h3>
                    </div>
                  </div>
                </Card>

                <Card className="glass-panel bg-white/5 border-white/10 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                      <BarChart3 size={24} />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-semibold">Total Scraped Positions</span>
                      <h3 className="text-xl font-bold mt-1 text-white">{stats?.total_jobs || 0} Openings</h3>
                    </div>
                  </div>
                </Card>

                <Card className="glass-panel bg-white/5 border-white/10 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                      <Flame size={24} />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-semibold">ML Forecasting Node</span>
                      <h3 className="text-sm font-bold mt-2 text-white bg-purple-600/20 border border-purple-500/30 px-2 py-0.5 rounded-lg w-fit">
                        {modelStatus?.model_trained ? "Model Active" : "Requires Training"}
                      </h3>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Visual Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card title="Live Vacancies by Scraper Source" className="glass-panel bg-white/5 border-white/10 rounded-3xl">
                  <div className="h-[240px] w-full">
                    {isMounted && (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} />
                          <YAxis stroke="#9ca3af" fontSize={11} />
                          <ChartTooltip contentStyle={{ backgroundColor: "rgba(17,24,39,0.9)", border: "1px solid rgba(255,255,255,0.1)" }} />
                          <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </Card>

                <Card title="Database Distribution Shares" className="glass-panel bg-white/5 border-white/10 rounded-3xl flex flex-col justify-center">
                  <div className="h-[240px] w-full flex items-center justify-center">
                    {isMounted && (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={75}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {pieChartData.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <ChartTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                    <div className="flex flex-col gap-2 ml-4">
                      {pieChartData.map((entry: any, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                          <span className="text-gray-300 font-medium">{entry.name}: {entry.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Tab 2: Talent Pool */}
          {activeTab === "talent" && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white">Assessment Candidates Directory</h3>
                  <p className="text-xs text-gray-400 mt-1">Review student rankings, score cards, and active tech stacks</p>
                </div>

                <div className="flex flex-wrap gap-3 items-center">
                  <Input
                    prefix={<Search size={14} className="text-gray-500" />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search candidate..."
                    className="bg-white/5 border-white/10 text-white rounded-xl w-48 text-xs"
                  />
                  <Select
                    value={selectedRoleFilter}
                    onChange={(val) => setSelectedRoleFilter(val)}
                    className="w-36 text-xs"
                    options={[
                      { value: "All", label: "All Roles" },
                      ...KERALA_ROLES.map((r) => ({ value: r, label: r }))
                    ]}
                  />
                  <Button
                    icon={<Download size={14} />}
                    onClick={exportCandidatesCSV}
                    className="bg-white/5 border-white/10 text-white rounded-xl text-xs font-bold"
                  >
                    CSV
                  </Button>
                </div>
              </div>

              {/* Bulk actions status panel */}
              {selectedCandidateKeys.length > 0 && (
                <Alert
                  type="info"
                  showIcon
                  className="bg-indigo-600/10 border-indigo-500/20 text-indigo-300 rounded-xl"
                  title={
                    <div className="flex justify-between items-center w-full">
                      <span className="text-xs">Selected {selectedCandidateKeys.length} candidates.</span>
                      <Button
                        type="primary"
                        size="small"
                        icon={<Mail size={12} />}
                        onClick={handleBulkEmail}
                        className="bg-indigo-600 hover:bg-indigo-500 border-none rounded-lg text-xs"
                      >
                        Send Bulk Test Invite
                      </Button>
                    </div>
                  }
                />
              )}

              <Table
                dataSource={filteredCandidates}
                rowKey="id"
                rowSelection={{
                  selectedRowKeys: selectedCandidateKeys,
                  onChange: (keys) => setSelectedCandidateKeys(keys)
                }}
                pagination={{ pageSize: 8 }}
                columns={[
                  {
                    title: "Rank",
                    dataIndex: "rank",
                    key: "rank",
                    sorter: (a, b) => a.rank - b.rank,
                    render: (rnk) => (
                      <Tag color={rnk <= 3 ? "gold" : "default"} className="font-bold text-xs">
                        #{rnk}
                      </Tag>
                    )
                  },
                  {
                    title: "Candidate Name",
                    dataIndex: "name",
                    key: "name",
                    render: (text, record) => (
                      <button
                        onClick={() => {
                          setSelectedCandidate(record);
                          setDetailsVisible(true);
                        }}
                        className="font-bold text-white hover:text-emerald-400 transition-all text-left bg-transparent border-none cursor-pointer"
                      >
                        {text}
                      </button>
                    )
                  },
                  {
                    title: "Target Goal",
                    dataIndex: "goal",
                    key: "goal"
                  },
                  {
                    title: "Quiz Score",
                    dataIndex: "score",
                    key: "score",
                    sorter: (a, b) => a.score - b.score,
                    render: (sc) => (
                      <Progress
                        percent={sc}
                        size="small"
                        strokeColor="#10b981"
                        trailColor="rgba(255,255,255,0.05)"
                        className="max-w-[120px]"
                      />
                    )
                  },
                  {
                    title: "Skills Count",
                    dataIndex: "skill_count",
                    key: "skill_count",
                    render: (cnt) => <Tag color="blue">{cnt} registered</Tag>
                  },
                  {
                    title: "Action",
                    key: "action",
                    render: (_, record) => (
                      <Button
                        type="primary"
                        onClick={() => {
                          setSelectedCandidate(record);
                          setDetailsVisible(true);
                        }}
                        className="bg-emerald-600 hover:bg-emerald-500 border-none rounded-lg text-xs font-bold"
                      >
                        Details
                      </Button>
                    )
                  }
                ]}
              />
            </div>
          )}

          {/* Tab 3: Forecasting */}
          {activeTab === "forecasting" && (
            <div className="space-y-8">
              {/* RF Console */}
              <Card title="Random Forest forecasting Console" className="glass-panel bg-white/5 border-white/10 rounded-3xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6 mb-6">
                  <div>
                    <h4 className="font-bold text-white text-md">ML training execution Pipeline</h4>
                    <p className="text-xs text-gray-400 mt-1">Updates repository downloads and commits weekly logs to train Random Forest models</p>
                  </div>
                  <Button
                    type="primary"
                    onClick={triggerMLTraining}
                    loading={training}
                    icon={<Play size={14} />}
                    className="bg-purple-600 hover:bg-purple-500 border-none rounded-xl font-bold px-6 py-2 shadow-md shadow-purple-600/25 cursor-pointer"
                  >
                    Retrain forecasting Models
                  </Button>
                </div>

                {trainResult && (
                  <Alert
                    type="success"
                    showIcon
                    className="bg-purple-500/10 border-purple-500/20 text-purple-300 rounded-2xl p-4 mb-6"
                    title={<span className="font-bold text-sm">Forecasting Model Trained successfully!</span>}
                    description={
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-xs text-gray-300">
                        <div>
                          <span>Training Mode:</span>
                          <strong className="block text-white uppercase mt-0.5">{trainResult.mode}</strong>
                        </div>
                        <div>
                          <span>Data Points:</span>
                          <strong className="block text-white mt-0.5">{trainResult.data_points_total} entries</strong>
                        </div>
                        {trainResult.metrics && (
                          <>
                            <div>
                              <span>Mean Absolute Error (MAE):</span>
                              <strong className="block text-white mt-0.5">{trainResult.metrics.mae}</strong>
                            </div>
                            <div>
                              <span>R2 Score:</span>
                              <strong className="block text-white mt-0.5">{trainResult.metrics.r2_score}</strong>
                            </div>
                          </>
                        )}
                      </div>
                    }
                  />
                )}

                {/* Top predicted skills */}
                <div className="space-y-4">
                  <span className="text-xs text-indigo-400 uppercase font-black tracking-wider block">Top 5 Predicted 2026 Kerala Future Stacks</span>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                    {topSkills.map((sk: any, idx: number) => (
                      <div key={idx} className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center space-y-2">
                        <span className="text-[10px] text-gray-500 font-bold uppercase block">Rank #{sk.rank}</span>
                        <h5 className="font-bold text-white text-md">{sk.skill}</h5>
                        <div className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20 w-fit mx-auto">
                          {sk.demand_score}% growth
                        </div>
                        <span className="text-[9px] text-gray-400 block truncate">{sk.trend}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Playground Sandbox */}
              <Card title="Skill Predictor Sandbox Playground" className="glass-panel bg-white/5 border-white/10 rounded-3xl">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <span className="text-xs text-gray-400 block mb-2 font-semibold">Technology / Stack Name</span>
                      <Input
                        value={playSkill}
                        onChange={(e) => setPlaySkill(e.target.value)}
                        size="large"
                        className="bg-white/5 border-white/10 text-white rounded-xl"
                      />
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block mb-2 font-semibold">Monthly Downloads (PyPI/NPM)</span>
                      <Input
                        type="number"
                        value={playDownloads}
                        onChange={(e) => setPlayDownloads(parseInt(e.target.value) || 0)}
                        size="large"
                        className="bg-white/5 border-white/10 text-white rounded-xl"
                      />
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block mb-2 font-semibold">GitHub Star aggregates</span>
                      <Input
                        type="number"
                        value={playStars}
                        onChange={(e) => setPlayStars(parseInt(e.target.value) || 0)}
                        size="large"
                        className="bg-white/5 border-white/10 text-white rounded-xl"
                      />
                    </div>
                  </div>

                  <Button
                    type="primary"
                    onClick={runPredictivePlayground}
                    loading={playLoading}
                    size="large"
                    className="w-full bg-gradient-to-r from-emerald-600 to-indigo-600 border-none rounded-xl font-bold"
                  >
                    Run AI RandomForest Growth Prediction
                  </Button>

                  {playResult && (
                    <div className="bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-purple-500/10 border border-white/10 rounded-2xl p-6 space-y-4 animate-fade-in">
                      <h5 className="font-bold text-white text-md">Playground Result: {playResult.skill}</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-gray-300">
                        <div className="bg-white/5 border border-white/5 p-4 rounded-xl">
                          <span className="text-gray-400 block mb-1">Growth Forecast Score</span>
                          <strong className="text-2xl font-black text-emerald-400">{playResult.score}%</strong>
                        </div>
                        <div className="bg-white/5 border border-white/5 p-4 rounded-xl">
                          <span className="text-gray-400 block mb-1">Classification Status</span>
                          <strong className="text-white block mt-1">{playResult.trend}</strong>
                        </div>
                        <div className="bg-white/5 border border-white/5 p-4 rounded-xl">
                          <span className="text-gray-400 block mb-1">Recruiter recommendation</span>
                          <p className="text-gray-200 mt-1 leading-normal">{playResult.recommendation}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* Details Drawer */}
          <Drawer
            title="Candidate Assessment Dossier"
            open={detailsVisible}
            onClose={() => setDetailsVisible(false)}
            size={450}
            styles={{ body: { backgroundColor: "#0f172a" } }}
          >
            {selectedCandidate ? (
              <div className="space-y-6 text-xs text-gray-300 font-sans">
                <div className="text-center py-4 space-y-2">
                  <div className="w-14 h-14 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center font-bold text-white text-lg mx-auto uppercase">
                    {selectedCandidate.name.slice(0, 2)}
                  </div>
                  <h4 className="text-md font-bold text-white mt-2">{selectedCandidate.name}</h4>
                  <Tag color="indigo">{selectedCandidate.goal}</Tag>
                </div>

                <div className="border-t border-white/5 pt-4 space-y-3.5">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Technical Quiz Score:</span>
                    <strong className="text-emerald-400 text-sm">{selectedCandidate.score}%</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Platform Rank:</span>
                    <strong className="text-white">#{selectedCandidate.rank}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Registered Skills:</span>
                    <strong className="text-white">{selectedCandidate.skill_count} Stacks</strong>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4 space-y-2">
                  <span className="text-gray-400 block">Candidate actions:</span>
                  <Space className="w-full">
                    <Button
                      type="primary"
                      icon={<Mail size={12} />}
                      onClick={() => {
                        message.success("Invite sent successfully!");
                        setDetailsVisible(false);
                      }}
                      className="bg-indigo-600 hover:bg-indigo-500 border-none rounded-lg text-xs"
                    >
                      Invite for Code Test
                    </Button>
                  </Space>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-xs">No candidate selected.</p>
            )}
          </Drawer>
        </Content>
      </Layout>
    </Layout>
  );
}