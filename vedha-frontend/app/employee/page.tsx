// app/employee/page.tsx — Premium Admin Dashboard
"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { skillsAPI, chatAPI, jobsAPI, leaderboardAPI, predictAPI, knowledgeAPI, trendsAPI } from "@/lib/api";
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
  App,
  Switch,
  Statistic,
  Skeleton,
  Upload
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
  Database,
  Terminal,
  Activity,
  FileText,
  UserPlus,
  BookOpen,
  UploadCloud
} from "lucide-react";

const { Header, Sider, Content } = Layout;

export default function EmployeeDashboard() {
  const { message } = App.useApp();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    document.body.classList.remove("light-theme");
    document.body.classList.add("dark-theme");
    return () => {
      document.body.classList.remove("dark-theme");
    };
  }, []);

  const router = useRouter();
  const { user, logout, loadFromStorage } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  // Admin User List
  const [usersList, setUsersList] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [addUserVisible, setAddUserVisible] = useState(false);
  const [addUserForm] = Form.useForm();
  const [searchUserQuery, setSearchUserQuery] = useState("");

  // System status logs
  const [dbStatus, setDbStatus] = useState("CONNECTED");
  const [apiLatency, setApiLatency] = useState(25); // mock ms
  const [modelTrained, setModelTrained] = useState(true);
  const [stats, setStats] = useState<any>(null);

  // Switch Planner inputs (retained as career transitions feature)
  const [skills, setSkills] = useState("");
  const [targetRole, setTargetRole] = useState("ML Engineer");
  const [analysis, setAnalysis] = useState<any>(null);
  const [analysing, setAnalysing] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);

  // AI Chat inputs (retained)
  const [chatMsg, setChatMsg] = useState("");
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Knowledge Base RAG states
  const [knowledgeStats, setKnowledgeStats] = useState<any>(null);
  const [loadingKbStats, setLoadingKbStats] = useState(false);
  const [kbText, setKbText] = useState("");
  const [kbLabel, setKbLabel] = useState("Manual Entry");
  const [addingText, setAddingText] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadingTxt, setUploadingTxt] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [txtFile, setTxtFile] = useState<File | null>(null);
  const [searchQueryKb, setSearchQueryKb] = useState("");
  const [searchResultsKb, setSearchResultsKb] = useState<any[]>([]);
  const [searchingKb, setSearchingKb] = useState(false);

  // Background jobs states
  const [trainingModel, setTrainingModel] = useState(false);
  const [refreshingTrends, setRefreshingTrends] = useState(false);

  const ROLES = [
    "ML Engineer", "GenAI Developer", "LLM Engineer", "Full Stack Developer",
    "DevOps Engineer", "Data Scientist", "NLP Engineer", "Cloud Engineer", "Cybersecurity Analyst"
  ];

  const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"];

  useEffect(() => {
    loadFromStorage();
  }, []);

  useEffect(() => {
    if (!user) return;
    if (user.role !== "employee") {
      router.push(`/${user.role}`);
      return;
    }
    fetchUsers();
    fetchStats();
    fetchKnowledgeStats();
  }, [user]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await leaderboardAPI.top();
      const mapped = (res.data.leaderboard || []).map((cand: any) => ({
        id: cand.id,
        name: cand.name,
        email: `${cand.name.toLowerCase().replace(" ", "")}@vedha.ai`,
        role: "student",
        goal: cand.goal,
        status: "active",
        score: cand.score
      }));
      // Seed with some mock recruiters/admins
      mapped.push(
        { id: 991, name: "IBS Recruiter", email: "recruitment@ibs.in", role: "company", goal: "Talent Search", status: "active", score: 0 },
        { id: 992, name: "Admin Officer", email: "admin@vedha.ai", role: "employee", goal: "System Ops", status: "active", score: 0 }
      );
      setUsersList(mapped);
    } catch {
      message.error("Failed to load user directories.");
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await jobsAPI.stats();
      setStats(res.data);
      const mStatus = await predictAPI.modelStatus();
      setModelTrained(mStatus.data?.model_trained || false);
    } catch {}
  };

  const fetchKnowledgeStats = async () => {
    setLoadingKbStats(true);
    try {
      const res = await knowledgeAPI.stats();
      setKnowledgeStats(res.data);
    } catch (e) {
      console.error("Error loading knowledge base stats", e);
    } finally {
      setLoadingKbStats(false);
    }
  };

  const handleAddText = async () => {
    if (kbText.trim().length < 50) return;
    setAddingText(true);
    try {
      const res = await knowledgeAPI.addText({ text: kbText, label: kbLabel });
      message.success(res.data.message || "Content ingested successfully!");
      setKbText("");
      fetchKnowledgeStats();
    } catch (e: any) {
      message.error(e.response?.data?.detail || "Ingestion failed.");
    } finally {
      setAddingText(false);
    }
  };

  const handleUploadPdf = async () => {
    if (!pdfFile) return;
    setUploadingPdf(true);
    const formData = new FormData();
    formData.append("file", pdfFile);
    try {
      const res = await knowledgeAPI.uploadPdf(formData);
      message.success(res.data.message || "PDF content ingested successfully!");
      setPdfFile(null);
      fetchKnowledgeStats();
    } catch (e: any) {
      message.error(e.response?.data?.detail || "PDF upload failed.");
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleUploadTxt = async () => {
    if (!txtFile) return;
    setUploadingTxt(true);
    const formData = new FormData();
    formData.append("file", txtFile);
    try {
      const res = await knowledgeAPI.uploadText(formData);
      message.success(res.data.message || "TXT content ingested successfully!");
      setTxtFile(null);
      fetchKnowledgeStats();
    } catch (e: any) {
      message.error(e.response?.data?.detail || "TXT upload failed.");
    } finally {
      setUploadingTxt(false);
    }
  };

  const handleSearchKb = async () => {
    if (!searchQueryKb.trim()) return;
    setSearchingKb(true);
    setSearchResultsKb([]);
    try {
      const res = await knowledgeAPI.search({ question: searchQueryKb, top_k: 4 });
      setSearchResultsKb(res.data.results || []);
    } catch (e: any) {
      message.error(e.response?.data?.detail || "RAG search failed.");
    } finally {
      setSearchingKb(false);
    }
  };

  const handleRetrainModel = async () => {
    setTrainingModel(true);
    message.loading({ content: "Retraining Random Forest model...", key: "retrain_model" });
    try {
      await predictAPI.train();
      message.success({ content: "Forecasting model trained successfully!", key: "retrain_model" });
      fetchStats();
    } catch (e) {
      message.error({ content: "Retraining failed.", key: "retrain_model" });
    } finally {
      setTrainingModel(false);
    }
  };

  const handleRefreshTrends = async () => {
    setRefreshingTrends(true);
    message.loading({ content: "Refreshing tech trends database...", key: "refresh_trends_admin" });
    try {
      await trendsAPI.refresh();
      message.success({ content: "Tech market trends updated successfully!", key: "refresh_trends_admin" });
    } catch (e) {
      message.error({ content: "Scraper refresh failed.", key: "refresh_trends_admin" });
    } finally {
      setRefreshingTrends(false);
    }
  };

  // User list actions
  const toggleUserStatus = (id: number) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === "active" ? "blocked" : "active";
        message.info(`User status updated to: ${nextStatus.toUpperCase()}`);
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const handleAddUser = (values: any) => {
    const newUser = {
      id: Date.now(),
      name: values.name,
      email: values.email,
      role: values.role,
      goal: values.goal || "Not specified",
      status: "active",
      score: 0
    };
    setUsersList(prev => [newUser, ...prev]);
    setAddUserVisible(false);
    addUserForm.resetFields();
    message.success("New user profile created!");
  };

  // Switch transition planner
  const analyseSkills = async () => {
    if (!user || !skills.trim()) return;
    setAnalysing(true);
    try {
      const skillList = skills.split(",").map((s) => s.trim()).filter(Boolean);
      const res = await skillsAPI.analyse({
        student_id: user.id,
        skills: skillList,
        target_role: targetRole
      });
      setAnalysis(res.data);
      const jobsRes = await jobsAPI.matchJobs(user.id);
      setJobs(jobsRes.data.matched_jobs || []);
    } catch (e: any) {
      message.error("Error parsing skill parameters.");
    } finally {
      setAnalysing(false);
    }
  };

  const sendChat = async () => {
    if (!chatMsg.trim() || !user) return;
    const userMsg = { role: "user", message: chatMsg };
    setChatHistory((h) => [...h, userMsg]);
    setChatMsg("");
    setChatLoading(true);
    try {
      const res = await chatAPI.send({ student_id: user.id, message: chatMsg });
      setChatHistory((h) => [...h, { role: "assistant", message: res.data.reply }]);
    } catch {
      setChatHistory((h) => [...h, { role: "assistant", message: "Error contacting Upskilling Mentor." }]);
    } finally {
      setChatLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
        <Loader2 size={32} className="animate-spin text-purple-500" />
      </div>
    );
  }

  const chartData = stats?.by_source
    ? Object.entries(stats.by_source).map(([src, cnt]) => ({ name: src, count: cnt }))
    : [
        { name: "github", count: 10 },
        { name: "remotive", count: 15 },
        { name: "technopark", count: 12 }
      ];

  const filteredUsers = usersList.filter(u =>
    u.name.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchUserQuery.toLowerCase())
  );

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full py-6">
      <div className="space-y-8 px-6">
        <div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent flex items-center gap-2">
            ⚡ Vedha AI
          </h1>
          <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-md font-semibold uppercase tracking-wider">
            Admin Console
          </span>
        </div>

        <nav className="space-y-1">
          {[
            { id: "home", label: "Dashboard Hub", icon: LayoutDashboard },
            { id: "users", label: "User Management", icon: Users },
            { id: "knowledge", label: "Knowledge Base", icon: BookOpen, action: fetchKnowledgeStats },
            { id: "monitor", label: "System Monitoring", icon: Activity },
            { id: "roadmap", label: "Switch Planner", icon: Sliders },
            { id: "chat", label: "Upskilling Mentor", icon: RefreshCw }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSidebarOpen(false);
                  if (tab.action) tab.action();
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer ${
                  isActive
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/35"
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
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-600/30 flex items-center justify-center text-purple-400 font-bold">
            ⚙️
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
              <Cpu size={12} className="text-purple-400 animate-pulse" /> System Controller Node
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-gray-500 block">Operator ID:</span>
            <p className="text-xs text-white font-bold">{user.name}</p>
          </div>
        </Header>

        {/* Content */}
        <Content className="p-6 md:p-8 overflow-y-auto max-w-6xl w-full mx-auto flex-1 font-sans">
          {activeTab === "home" && (
            <div className="space-y-8 animate-fade-in">
              {/* Banner */}
              <Card className="glass-panel border-white/10 rounded-3xl relative overflow-hidden bg-gradient-to-r from-purple-900/30 via-indigo-950/20 to-pink-950/30 glow-purple">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10" />
                <div className="max-w-2xl space-y-4">
                  <Tag color="purple" className="px-3 py-0.5 border border-purple-500/20 rounded-full uppercase text-[10px] font-bold">
                    System Control Centre
                  </Tag>
                  <h2 className="text-3xl font-extrabold text-white tracking-tight">
                    Welcome to the Admin Dashboard Hub.
                  </h2>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Verify server configurations, toggle active user account permissions, or inspect ML model parameters and RAG scraping statistics.
                  </p>
                  <div className="flex gap-4 pt-2">
                    <Button
                      type="primary"
                      onClick={() => setActiveTab("users")}
                      icon={<Users size={14} />}
                      className="bg-purple-600 hover:bg-purple-500 border-none font-bold rounded-xl cursor-pointer"
                    >
                      Manage User Base
                    </Button>
                    <Button
                      onClick={() => setActiveTab("monitor")}
                      icon={<Activity size={14} />}
                      className="bg-white/5 border-white/10 text-white rounded-xl cursor-pointer"
                    >
                      System Monitor logs
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Quick statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="glass-panel bg-white/5 border-white/10 rounded-2xl">
                  <Statistic title={<span className="text-gray-400 text-xs">Total Registered Accounts</span>} value={usersList.length} styles={{ content: { color: "#fff", fontWeight: "bold" } }} />
                </Card>
                <Card className="glass-panel bg-white/5 border-white/10 rounded-2xl">
                  <Statistic title={<span className="text-gray-400 text-xs">Scraped Vacancies</span>} value={stats?.total_jobs || 51} styles={{ content: { color: "#fff", fontWeight: "bold" } }} />
                </Card>
                <Card className="glass-panel bg-white/5 border-white/10 rounded-2xl">
                  <Statistic title={<span className="text-gray-400 text-xs">API Latency Node</span>} value={apiLatency} suffix="ms" styles={{ content: { color: "#10b981", fontWeight: "bold" } }} />
                </Card>
                <Card className="glass-panel bg-white/5 border-white/10 rounded-2xl">
                  <Statistic title={<span className="text-gray-400 text-xs">Database Connection</span>} value={dbStatus} styles={{ content: { color: "#10b981", fontSize: "16px", fontWeight: "bold" } }} />
                </Card>
              </div>

              {/* Graphs splits */}
              <Card title="Live jobs by IT Park Aggregations" className="glass-panel bg-white/5 border-white/10 rounded-3xl">
                <div className="h-[250px] w-full">
                  {isMounted && (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} />
                        <YAxis stroke="#9ca3af" fontSize={11} />
                        <ChartTooltip contentStyle={{ backgroundColor: "rgba(17,24,39,0.9)", border: "1px solid rgba(255,255,255,0.1)" }} />
                        <Bar dataKey="count" fill="#a855f7" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* Tab 2: User management */}
          {activeTab === "users" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white">Registered User Database</h3>
                  <p className="text-xs text-gray-400 mt-1">Review active students, recruiters, and employee permissions</p>
                </div>
                <div className="flex gap-3">
                  <Input
                    prefix={<Search size={14} className="text-gray-500" />}
                    value={searchUserQuery}
                    onChange={(e) => setSearchUserQuery(e.target.value)}
                    placeholder="Search name or email..."
                    className="bg-white/5 border-white/10 text-white rounded-xl w-56 text-xs"
                  />
                  <Button
                    type="primary"
                    icon={<UserPlus size={14} />}
                    onClick={() => setAddUserVisible(true)}
                    className="bg-purple-600 hover:bg-purple-500 border-none rounded-xl text-xs font-bold"
                  >
                    Add mock user
                  </Button>
                </div>
              </div>

              <Table
                dataSource={filteredUsers}
                rowKey="id"
                pagination={{ pageSize: 8 }}
                columns={[
                  {
                    title: "User ID",
                    dataIndex: "id",
                    key: "id",
                    render: (id) => <span className="font-mono text-[10px] text-gray-500">#{id}</span>
                  },
                  {
                    title: "Full Name",
                    dataIndex: "name",
                    key: "name",
                    render: (text) => <span className="font-bold text-white">{text}</span>
                  },
                  {
                    title: "Email",
                    dataIndex: "email",
                    key: "email"
                  },
                  {
                    title: "Role Platform",
                    dataIndex: "role",
                    key: "role",
                    render: (role) => (
                      <Tag color={role === "employee" ? "purple" : role === "company" ? "orange" : "blue"} className="font-bold uppercase text-[10px]">
                        {role}
                      </Tag>
                    )
                  },
                  {
                    title: "Goal Stack",
                    dataIndex: "goal",
                    key: "goal"
                  },
                  {
                    title: "Status",
                    dataIndex: "status",
                    key: "status",
                    render: (st) => <Badge status={st === "active" ? "success" : "error"} text={<span className="text-xs capitalize">{st}</span>} />
                  },
                  {
                    title: "Permissions",
                    key: "permission",
                    render: (_, record) => (
                      <Switch
                        checked={record.status === "active"}
                        onChange={() => toggleUserStatus(record.id)}
                        className="bg-gray-800"
                      />
                    )
                  }
                ]}
              />
            </div>
          )}

          {/* Tab 3: Monitor logs */}
          {activeTab === "monitor" && (
            <div className="space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card title="Live Server logs & API Status" className="glass-panel bg-white/5 border-white/10 rounded-3xl">
                  <div className="flex flex-col">
                    {[
                      { title: "FastAPI Engine status", desc: "ONLINE", icon: Cpu, color: "text-emerald-400" },
                      { title: "PostgreSQL Database URL", desc: "CONNECTED (port 5432)", icon: Database, color: "text-emerald-400" },
                      { title: "RAG Vector FAISS Index", desc: "LOADED FROM DISK (CAREER_KNOWLEDGE loaded)", icon: Database, color: "text-indigo-400" },
                      { title: "RandomForest forecast Model", desc: modelTrained ? "ACTIVE & SAVED" : "UNINITIALIZED", icon: Sliders, color: modelTrained ? "text-emerald-400" : "text-amber-400" },
                    ].map((item, idx, arr) => (
                      <div key={item.title} className={`flex items-start gap-4 py-4 ${idx !== arr.length - 1 ? "border-b border-white/5" : ""}`}>
                        <item.icon className={`w-8 h-8 ${item.color} shrink-0`} />
                        <div className="flex-1">
                          <span className="font-bold text-white text-xs block">{item.title}</span>
                          <span className="text-gray-400 text-xs block mt-0.5">{item.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card title="RAG bot top search reports" className="glass-panel bg-white/5 border-white/10 rounded-3xl">
                  <div className="flex flex-col">
                    {[
                      { query: "How to crack UST Global machine learning rounds?", count: 42 },
                      { query: "Best free NLP/Transformers resources for 2026", count: 28 },
                      { query: "Kerala Startup Mission grants application", count: 24 },
                      { query: "What MLOps skills does IBS Trivandrum request?", count: 19 },
                    ].map((item, idx, arr) => (
                      <div key={item.query} className={`py-3.5 flex justify-between items-center text-xs ${idx !== arr.length - 1 ? "border-b border-white/5" : ""}`}>
                        <div>
                          <span className="text-gray-500 font-bold block">Query Rank #{idx + 1}</span>
                          <span className="text-white italic mt-1 block">"{item.query}"</span>
                        </div>
                        <Badge count={item.count} overflowCount={999} showZero color="#6366f1" />
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card title="Background Job Controllers" className="glass-panel bg-white/5 border-white/10 rounded-3xl">
                  <div className="space-y-4">
                    <p className="text-xs text-gray-400">
                      Trigger background scrapers and predictive models training pipelines.
                    </p>
                    <div className="flex gap-4">
                      <Button
                        type="primary"
                        onClick={handleRetrainModel}
                        loading={trainingModel}
                        icon={<Play size={14} />}
                        className="bg-purple-650 hover:bg-purple-500 border-none rounded-xl text-xs font-bold"
                      >
                        Retrain Forecasting Model
                      </Button>
                      <Button
                        onClick={handleRefreshTrends}
                        loading={refreshingTrends}
                        icon={<RefreshCw size={14} />}
                        className="bg-white/5 border-white/10 text-white rounded-xl text-xs"
                      >
                        Refresh Tech Market Scrapers
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Tab 4: Career Planner (Retained) */}
          {activeTab === "roadmap" && (
            <div className="space-y-8 animate-fade-in">
              <Card title="Transition planner diagnostics" className="glass-panel bg-white/5 border-white/10 rounded-3xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <span className="text-xs text-gray-400 block mb-2 font-semibold">Transition Target Role</span>
                    <Select
                      value={targetRole}
                      onChange={(val) => setTargetRole(val)}
                      className="w-full"
                      size="large"
                      options={ROLES.map((r) => ({ value: r, label: r }))}
                    />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block mb-2 font-semibold">Diagnosis Skills List (comma separated)</span>
                    <Input
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      placeholder="e.g. Python, SQL, REST APIs, Git"
                      size="large"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>

                <Button
                  type="primary"
                  onClick={analyseSkills}
                  loading={analysing}
                  size="large"
                  className="w-full bg-purple-600 hover:bg-purple-500 border-none rounded-xl font-bold mt-6 shadow-md shadow-purple-600/25 cursor-pointer"
                >
                  Analyze Career Transition blueprint
                </Button>
              </Card>

              {analysis && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <Card title="Module Gap assessments" className="glass-panel bg-white/5 border-white/10 rounded-2xl">
                      <div className="flex flex-wrap gap-2">
                        {analysis.missing_skills?.map((s: string, idx: number) => (
                          <Tag color="error" key={idx} className="font-bold text-xs uppercase px-2.5 py-0.5 border border-red-500/25 rounded-md">
                            {s}
                          </Tag>
                        ))}
                      </div>
                    </Card>

                    <Card title="Retained technical capital" className="glass-panel bg-white/5 border-white/10 rounded-2xl">
                      <div className="flex flex-wrap gap-2">
                        {analysis.matched_skills?.map((s: string, idx: number) => (
                          <Tag color="success" key={idx} className="font-bold text-xs uppercase px-2.5 py-0.5 border border-emerald-500/25 rounded-md">
                            {s}
                          </Tag>
                        ))}
                      </div>
                    </Card>
                  </div>

                  <Card title="Syllabus Readiness Index" className="glass-panel bg-white/5 border-white/10 rounded-2xl text-center h-fit">
                    <span className="text-xs text-gray-400 uppercase block mb-1">Fit Index Score</span>
                    <div className="text-5xl font-black text-purple-400 my-4">{analysis.score}%</div>
                    <div className="border-t border-white/5 pt-4 text-left space-y-3 text-xs text-gray-300">
                      <div className="flex justify-between">
                        <span>Expected Study:</span>
                        <span className="text-white font-bold">{analysis.estimated_timeline}</span>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* Tab 5: Upskilling Mentor Chat (Retained) */}
          {/* Tab: Knowledge Base Manager */}
          {activeTab === "knowledge" && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/[0.02] border border-white/5 p-6 rounded-[24px]">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <BookOpen className="text-purple-400 w-6 h-6 animate-pulse" /> RAG Knowledge Base Manager
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Upload documents or insert reference manuals into the FAISS semantic vector store for AI Mentor retrieval.
                  </p>
                </div>
                <div className="bg-purple-900/20 border border-purple-500/30 px-4 py-2 rounded-xl text-center shrink-0">
                  <span className="text-[10px] text-purple-300 block uppercase font-bold">Total Chunks Indexed</span>
                  <strong className="text-lg text-white font-mono mt-0.5 block">
                    {knowledgeStats ? knowledgeStats.total_chunks : "..."}
                  </strong>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Data ingestion forms */}
                <div className="space-y-6">
                  {/* Copy-paste text */}
                  <Card title={<span className="text-xs font-bold text-gray-200">Copy-Paste Technical Text Reference</span>} className="glass-panel bg-white/5 border-white/10 rounded-2xl">
                    <div className="space-y-4">
                      <div>
                        <span className="text-[10px] text-gray-400 block mb-1">Document Label / Description</span>
                        <Input
                          value={kbLabel}
                          onChange={(e) => setKbLabel(e.target.value)}
                          placeholder="e.g., UST Global ML Rounds Guide"
                          className="bg-white/5 border-white/10 text-white rounded-lg"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block mb-1">Text Contents (min 50 chars)</span>
                        <Input.TextArea
                          value={kbText}
                          onChange={(e) => setKbText(e.target.value)}
                          rows={6}
                          placeholder="Paste reference text here. It will be split into chunks and added to the vector index..."
                          className="bg-white/5 border-white/10 text-white rounded-lg font-sans text-xs"
                        />
                      </div>
                      <Button
                        type="primary"
                        onClick={handleAddText}
                        loading={addingText}
                        disabled={kbText.trim().length < 50}
                        className="bg-purple-650 hover:bg-purple-500 border-none rounded-lg text-xs font-bold w-full"
                      >
                        Ingest Plain Text
                      </Button>
                    </div>
                  </Card>

                  {/* PDF Upload */}
                  <Card title={<span className="text-xs font-bold text-gray-200">Upload PDF Manual (.pdf, max 5MB)</span>} className="glass-panel bg-white/5 border-white/10 rounded-2xl">
                    <div className="space-y-4">
                      <Upload
                        beforeUpload={(file) => {
                          setPdfFile(file);
                          return false;
                        }}
                        maxCount={1}
                        onRemove={() => setPdfFile(null)}
                        accept=".pdf"
                      >
                        <Button className="bg-white/5 border-white/10 text-gray-300 rounded-lg text-xs">
                          Select PDF Document
                        </Button>
                      </Upload>
                      <Button
                        type="primary"
                        onClick={handleUploadPdf}
                        loading={uploadingPdf}
                        disabled={!pdfFile}
                        className="bg-purple-650 hover:bg-purple-500 border-none rounded-lg text-xs font-bold w-full mt-2"
                      >
                        Ingest PDF Chunks
                      </Button>
                    </div>
                  </Card>

                  {/* Text File Upload */}
                  <Card title={<span className="text-xs font-bold text-gray-200">Upload Text Document (.txt)</span>} className="glass-panel bg-white/5 border-white/10 rounded-2xl">
                    <div className="space-y-4">
                      <Upload
                        beforeUpload={(file) => {
                          setTxtFile(file);
                          return false;
                        }}
                        maxCount={1}
                        onRemove={() => setTxtFile(null)}
                        accept=".txt"
                      >
                        <Button className="bg-white/5 border-white/10 text-gray-300 rounded-lg text-xs">
                          Select TXT Document
                        </Button>
                      </Upload>
                      <Button
                        type="primary"
                        onClick={handleUploadTxt}
                        loading={uploadingTxt}
                        disabled={!txtFile}
                        className="bg-purple-650 hover:bg-purple-500 border-none rounded-lg text-xs font-bold w-full mt-2"
                      >
                        Ingest TXT Chunks
                      </Button>
                    </div>
                  </Card>
                </div>

                {/* Right Column: Search sandbox */}
                <div className="space-y-6">
                  <Card title={<span className="text-xs font-bold text-gray-200">FAISS Index Search Sandbox</span>} className="glass-panel bg-white/5 border-white/10 rounded-3xl">
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          value={searchQueryKb}
                          onChange={(e) => setSearchQueryKb(e.target.value)}
                          placeholder="Type query to test index retrieval..."
                          className="bg-white/5 border-white/10 text-white rounded-lg"
                        />
                        <Button
                          type="primary"
                          onClick={handleSearchKb}
                          loading={searchingKb}
                          disabled={!searchQueryKb.trim()}
                          className="bg-indigo-650 hover:bg-indigo-500 border-none rounded-lg"
                        >
                          Search
                        </Button>
                      </div>

                      {searchResultsKb.length > 0 && (
                        <div className="space-y-3.5 mt-4 max-h-[500px] overflow-y-auto pr-2">
                          <span className="text-[10px] text-gray-500 uppercase font-black block">Retrieved Documents Chunks</span>
                          {searchResultsKb.map((res: any, idx: number) => (
                            <div key={idx} className="bg-white/[0.02] border border-white/5 p-3 rounded-xl space-y-1.5">
                              <div className="flex justify-between items-center text-[9px]">
                                <span className="text-indigo-400 font-bold font-mono">CHUNK #{idx + 1}</span>
                                <span className="text-gray-500">Distance Score: {res.score ? res.score.toFixed(4) : "N/A"}</span>
                              </div>
                              <p className="text-[10px] text-gray-300 leading-normal font-mono italic">
                                "{res.text || res[0]}"
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {activeTab === "chat" && (
            <Card title="Salary & transition negotiation Sandbox" className="glass-panel bg-white/5 border-white/10 rounded-3xl h-[70vh] flex flex-col animate-fade-in">
              <div className="flex flex-col h-[52vh] justify-between">
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-4">
                  {chatHistory.length === 0 && (
                    <div className="text-center text-gray-500 py-12 max-w-sm mx-auto space-y-4">
                      <div className="text-4xl">🤖</div>
                      <h4 className="font-bold text-white text-md">AI Transition advisor</h4>
                      <p className="text-xs">
                        Discuss salary trends, relocation timelines, or certification directories with the administrative AI mentor agent.
                      </p>
                    </div>
                  )}

                  {chatHistory.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} items-end gap-2`}>
                      {msg.role !== "user" && <span className="text-xl">🤖</span>}
                      <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                        msg.role === "user"
                          ? "bg-purple-600 text-white rounded-br-none"
                          : "bg-white/5 border border-white/10 text-gray-100 rounded-bl-none"
                      }`}>
                        <p className="whitespace-pre-line">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex items-center gap-2 text-xs text-purple-400">
                      <Skeleton.Button active size="small" shape="round" />
                      <span>Negotiating parameters...</span>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <div className="flex gap-3 border-t border-white/5 pt-4">
                  <Input
                    value={chatMsg}
                    onChange={(e) => setChatMsg(e.target.value)}
                    onPressEnter={sendChat}
                    placeholder="Ask about transition advice or Technopark recruitment strategies..."
                    className="bg-white/5 border-white/10 text-white rounded-xl focus:border-purple-500"
                    size="large"
                  />
                  <Button
                    type="primary"
                    onClick={sendChat}
                    loading={chatLoading}
                    className="bg-purple-600 hover:bg-purple-500 border-none rounded-xl"
                    size="large"
                  >
                    Send
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Add Mock User Modal */}
          <Modal
            title="Create mock user profile"
            open={addUserVisible}
            onCancel={() => setAddUserVisible(false)}
            onOk={() => addUserForm.submit()}
            okText="Create User"
            cancelText="Cancel"
            okButtonProps={{ className: "bg-purple-600 hover:bg-purple-500 border-none rounded-lg" }}
            cancelButtonProps={{ className: "rounded-lg" }}
          >
            <Form
              form={addUserForm}
              layout="vertical"
              onFinish={handleAddUser}
              className="mt-4 text-xs font-sans"
            >
              <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true, message: "Please input full name!" }]}
              >
                <Input placeholder="e.g. John Doe" className="bg-white/5 border-white/10 text-white rounded-lg" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email address"
                rules={[
                  { required: true, message: "Please input email address!" },
                  { type: "email", message: "Please enter a valid email!" }
                ]}
              >
                <Input placeholder="e.g. john@vedha.ai" className="bg-white/5 border-white/10 text-white rounded-lg" />
              </Form.Item>

              <Form.Item
                name="role"
                label="User Role"
                rules={[{ required: true }]}
                initialValue="student"
              >
                <Select
                  options={[
                    { value: "student", label: "Student" },
                    { value: "company", label: "Recruiter" },
                    { value: "employee", label: "Employee / Admin" }
                  ]}
                />
              </Form.Item>

              <Form.Item
                name="goal"
                label="Goal / Stack Target"
              >
                <Input placeholder="e.g. ML Engineer / Recruiter Ops" className="bg-white/5 border-white/10 text-white rounded-lg" />
              </Form.Item>
            </Form>
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
}