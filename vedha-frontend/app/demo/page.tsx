// app/demo/page.tsx — Premium Dashboard Sandbox / Demo Page
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import {

  LayoutDashboard,
  Brain,
  FileText,
  TrendingUp,
  Video,
  Compass,
  Settings,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  Award,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Moon,
  Sun,
  Eye,
  Trash2,
  ExternalLink,
  Sliders,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Briefcase,
  Layers,
  ArrowLeft,
  RefreshCw
} from "lucide-react";
import VedhaLogo from "@/components/shared/VedhaLogo";

// Safe dynamic imports for Recharts to prevent hydration errors in Next.js
const ResponsiveContainer = dynamic(() => import("recharts").then((m) => m.ResponsiveContainer), { ssr: false });
const AreaChart = dynamic(() => import("recharts").then((m) => m.AreaChart), { ssr: false });
const Area = dynamic(() => import("recharts").then((m) => m.Area), { ssr: false });
const BarChart = dynamic(() => import("recharts").then((m) => m.BarChart), { ssr: false });
const Bar = dynamic(() => import("recharts").then((m) => m.Bar), { ssr: false });
const XAxis = dynamic(() => import("recharts").then((m) => m.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then((m) => m.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then((m) => m.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((m) => m.Tooltip), { ssr: false });

// Mock Data for the Sandbox
const mockChartData = [
  { name: "Week 1", readiness: 42, matches: 3 },
  { name: "Week 2", readiness: 58, matches: 7 },
  { name: "Week 3", readiness: 65, matches: 12 },
  { name: "Week 4", readiness: 78, matches: 19 },
  { name: "Week 5", readiness: 84, matches: 28 },
];

const mockActivities = [
  { id: 1, type: "resume", title: "Resume scanned successfully", detail: "Scanned Rahul_CV_Data.pdf against ML Engineer role. ATS match score: 84%.", time: "10 mins ago", status: "success" },
  { id: 2, type: "quiz", title: "FastAPI skills check cleared", detail: "Scored 90% on FastAPI intermediate test. Gained 15 XP points.", time: "2 hours ago", status: "success" },
  { id: 3, type: "interview", title: "Mock Recruiter loop finished", detail: "Completed technical simulation. Feedback checklist generated.", time: "1 day ago", status: "warning" },
  { id: 4, type: "opportunities", title: "New job matches discovered", detail: "3 new jobs crawled from Infopark Kochi matching your score.", time: "2 days ago", status: "info" },
];

export default function DashboardDemo() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Layout states
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Interactive Sandbox Controls
  const [isDemoDark, setIsDemoDark] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [isDemoEmpty, setIsDemoEmpty] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals & Drawers
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Custom Form fields inside Modal
  const [targetRole, setTargetRole] = useState("Machine Learning Engineer");
  const [targetCgpa, setTargetCgpa] = useState("8.5");

  // Custom Toast State
  const [toasts, setToasts] = useState<Array<{ id: number; title: string; desc: string; type: "success" | "info" | "warning" }>>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const addToast = (title: string, desc: string, type: "success" | "info" | "warning" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, title, desc, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfigModal(false);
    addToast("Target Config Updated", `Target set to ${targetRole} with target CGPA of ${targetCgpa}.`, "success");
  };

  // Filter activities
  const filteredActivities = mockActivities.filter((act) =>
    act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    act.detail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <p className="text-sm font-semibold text-slate-500 animate-pulse">Loading Sandbox Ecosystem...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-inter ${isDemoDark ? "dark bg-slate-950" : "bg-slate-50"}`}>
      
      {/* Dynamic Toast Portal */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`p-4 rounded-2xl shadow-xl border flex items-start gap-3 pointer-events-auto bg-white dark:bg-slate-900 ${
                toast.type === "success"
                  ? "border-emerald-250 dark:border-emerald-900/50"
                  : toast.type === "warning"
                  ? "border-yellow-250 dark:border-yellow-900/50"
                  : "border-blue-250 dark:border-blue-900/50"
              }`}
            >
              <div className="mt-0.5">
                {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                {toast.type === "warning" && <AlertCircle className="w-5 h-5 text-amber-500" />}
                {toast.type === "info" && <Sparkles className="w-5 h-5 text-blue-500" />}
              </div>
              <div className="flex-1">
                <h5 className="text-xs font-bold text-slate-950 dark:text-white leading-none mb-1">{toast.title}</h5>
                <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 leading-normal">{toast.desc}</p>
              </div>
              <button
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Control Panel Header (Floating Sandbox controls bar) */}
      <div className="bg-brand-primary text-white py-3.5 px-6 sticky top-0 z-40 shadow-md flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-700/50"
          >
            <ArrowLeft size={14} /> Back to Site
          </button>
          <span className="h-4 w-px bg-slate-800" />
          <span className="text-xs font-black tracking-wider uppercase text-brand-accent">DEMO SANDBOX CONTROLS:</span>
        </div>

        {/* Action Toggles */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Theme Simulation */}
          <button
            onClick={() => {
              setIsDemoDark(!isDemoDark);
              addToast("Theme Sim Toggled", `Switched workspace sandbox to ${!isDemoDark ? "Dark" : "Light"} mode.`, "info");
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer"
          >
            {isDemoDark ? <Sun size={12} className="text-yellow-400" /> : <Moon size={12} />}
            Mode: {isDemoDark ? "Dark" : "Light"}
          </button>

          {/* Skeleton Toggle */}
          <button
            onClick={() => {
              setIsDemoLoading(!isDemoLoading);
              addToast("Load State Sim Toggled", `Skeletons are now ${!isDemoLoading ? "Enabled" : "Disabled"}.`, "info");
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
              isDemoLoading
                ? "bg-[#0B5FFF] border-transparent text-white"
                : "bg-slate-800/80 border-slate-700 hover:bg-slate-700"
            }`}
          >
            <Sliders size={12} />
            {isDemoLoading ? "Skeletons: ON" : "Simulate Loading"}
          </button>

          {/* Empty State Toggle */}
          <button
            onClick={() => {
              setIsDemoEmpty(!isDemoEmpty);
              addToast("Data State Toggled", `Mock data set to ${!isDemoEmpty ? "Empty" : "Populated"}.`, "info");
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
              isDemoEmpty
                ? "bg-[#0B5FFF] border-transparent text-white"
                : "bg-slate-800/80 border-slate-700 hover:bg-slate-700"
            }`}
          >
            <Trash2 size={12} />
            {isDemoEmpty ? "Data: Empty" : "Simulate Empty State"}
          </button>

          {/* Alert Trigger */}
          <button
            onClick={() => addToast("Alert Discovered", "Real-time Technopark crawlers found 3 matching vacancies.", "info")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer text-brand-accent"
          >
            <Bell size={12} />
            Test Toast Alert
          </button>
        </div>
      </div>

      {/* Main Workspace Frame */}
      <div className="flex min-h-[calc(100vh-60px)]">
        
        {/* Collapsible Left Sidebar */}
        <aside
          className={`shrink-0 border-r border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 transition-all duration-350 flex flex-col justify-between ${
            sidebarCollapsed ? "w-16" : "w-64"
          } hidden md:flex`}
        >
          <div className="py-6 flex flex-col gap-6 overflow-hidden">
            {/* Branding logo */}
            <div className={`px-4 ${sidebarCollapsed ? "justify-center" : ""}`}>
              {sidebarCollapsed ? (
                <div className="w-8 h-8 rounded-lg bg-brand-secondary flex items-center justify-center text-white font-black text-sm">V</div>
              ) : (
                <div className="filter dark:invert dark:brightness-100">
                  <VedhaLogo showText={true} size="sm" />
                </div>
              )}
            </div>

            {/* Navigation links */}
            <nav className="px-3 space-y-1">
              {[
                { id: "overview", label: "Dashboard Hub", icon: LayoutDashboard },
                { id: "mentoring", label: "AI Career Coach", icon: Brain },
                { id: "resumes", label: "Resume Scanner", icon: FileText },
                { id: "placement", label: "Placement Engine", icon: TrendingUp },
                { id: "interviews", label: "Video Interview", icon: Video },
                { id: "settings", label: "Target Settings", icon: Settings, action: () => setShowConfigModal(true) },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.action) {
                        item.action();
                      } else {
                        setActiveTab(item.id);
                        addToast("Navigation Action", `Routed to sandbox tab: ${item.label}`, "info");
                      }
                    }}
                    className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                      isActive
                        ? "bg-[#0B5FFF]/10 text-[#0B5FFF] dark:bg-[#0B5FFF]/15"
                        : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <Icon size={16} />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sider Collapse Trigger */}
          <div className="p-4 border-t border-slate-200/85 dark:border-slate-800/85 flex justify-end">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-500 dark:text-slate-400 transition-all cursor-pointer"
            >
              {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
          </div>
        </aside>

        {/* Main Work Area Layout */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-950">
          
          {/* Top Navbar */}
          <header className="h-16 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md px-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="md:hidden text-slate-500 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <Menu size={20} />
              </button>
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input
                  type="text"
                  placeholder="Search sandbox activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800/60 border-none rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-[#0B5FFF]"
                />
              </div>
            </div>

            {/* Top Navigation Right tools */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-500 dark:text-slate-400 rounded-xl relative transition-all cursor-pointer"
                >
                  <Bell size={16} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-brand-secondary rounded-full" />
                </button>

                {/* Notifications Drawer (Dropdown) */}
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl p-4 z-50 text-xs"
                    >
                      <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
                        <span className="font-bold text-slate-850 dark:text-white">Alert Notifications</span>
                        <button
                          onClick={() => {
                            setShowNotifications(false);
                            addToast("Alerts Cleared", "Cleared all recent notification items.", "success");
                          }}
                          className="text-[10px] text-brand-secondary hover:underline cursor-pointer"
                        >
                          Clear All
                        </button>
                      </div>
                      <div className="mt-3 space-y-3 max-h-60 overflow-y-auto pr-1">
                        <div className="p-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl relative">
                          <h6 className="font-bold text-slate-800 dark:text-white">Placement Odds Improved</h6>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Your scores now hit the Technopark search parameters.</p>
                          <span className="text-[9px] text-slate-400 block mt-1">2 mins ago</span>
                        </div>
                        <div className="p-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl relative">
                          <h6 className="font-bold text-slate-800 dark:text-white">FastAPI Core test added</h6>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">TPO coordinator assigned a new backend programming quiz.</p>
                          <span className="text-[9px] text-slate-400 block mt-1">1 hour ago</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile button */}
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200/40 dark:border-slate-700/40">
                <div className="w-6 h-6 rounded-full bg-brand-secondary text-white text-[10px] font-black flex items-center justify-center">JD</div>
                <span className="text-[10px] font-bold text-slate-800 dark:text-white hidden sm:block">Jane Doe (Student)</span>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="p-6 overflow-y-auto flex-1 max-w-6xl w-full mx-auto space-y-8">
            
            {/* Header Title */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Jane's Technical Switch Hub</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Target Role: <strong className="text-brand-secondary dark:text-brand-accent">{targetRole}</strong> • Target CGPA: {targetCgpa}</p>
              </div>
              <button
                onClick={() => setShowConfigModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-brand-secondary hover:bg-[#084bca] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all"
              >
                <Sliders size={14} /> Adjust Config Settings
              </button>
            </div>

            {/* Metrics cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { title: "Hiring compatibility", value: "84%", icon: Award, progress: 84, color: "text-[#0B5FFF] bg-blue-50 dark:bg-blue-900/10", stroke: "#0B5FFF" },
                { title: "Quiz Score Average", value: "78%", icon: Brain, progress: 78, color: "text-purple-500 bg-purple-50 dark:bg-purple-900/10", stroke: "#a855f7" },
                { title: "Crawled Job Matches", value: "28 Opportunities", icon: Briefcase, progress: null, trend: "+8 new paths today", color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/10" },
                { title: "Skill gap index", value: "3 Critical Gaps", icon: Compass, progress: null, trend: "Requires PyTorch, Docker", color: "text-amber-500 bg-amber-50 dark:bg-amber-900/10", desc: "Target: ML Engineer" },
              ].map((card, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all relative overflow-hidden h-36 flex flex-col justify-between">
                  {isDemoLoading ? (
                    <div className="space-y-3 w-full">
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-3/4" />
                      <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-1/2" />
                      <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-full" />
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">{card.title}</span>
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${card.color}`}>
                          <card.icon size={16} />
                        </div>
                      </div>
                      <div className="mt-2">
                        <h4 className="text-xl font-black text-slate-900 dark:text-white leading-none">{card.value}</h4>
                        {card.progress !== null && (
                          <div className="mt-2">
                            <div className="w-full bg-slate-100 dark:bg-slate-850 h-1.5 rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${card.progress}%`, backgroundColor: card.stroke }} />
                            </div>
                          </div>
                        )}
                        {card.trend && (
                          <p className="text-[10px] font-semibold text-emerald-500 dark:text-emerald-400 mt-2 flex items-center gap-1">
                            <ArrowUpRight size={12} /> {card.trend}
                          </p>
                        )}
                        {card.desc && (
                          <p className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 mt-2">
                            {card.desc}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Area Chart */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm lg:col-span-2">
                <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="text-sm font-bold text-slate-950 dark:text-white">Career Readiness Progress Tracker</h4>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                    <span className="flex h-2 w-2 bg-[#0B5FFF] rounded-full" />
                    <span>Readiness Percentage (%)</span>
                  </div>
                </div>

                <div className="h-64 w-full">
                  {isDemoLoading ? (
                    <div className="h-full bg-slate-150 dark:bg-slate-850 rounded animate-pulse flex items-center justify-center">
                      <span className="text-[10px] text-slate-400">Loading chart vector coordinates...</span>
                    </div>
                  ) : isDemoEmpty ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-4">
                      <TrendingUp size={28} className="text-slate-300 dark:text-slate-700" />
                      <p className="text-xs font-bold text-slate-500 mt-2">No historical analytics logged</p>
                      <p className="text-[10px] text-slate-400 max-w-xs mt-1">Complete resume checkers or quiz topics to populate data.</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={mockChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0B5FFF" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#0B5FFF" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDemoDark ? "#1e293b" : "#f1f5f9"} />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                        <Tooltip />
                        <Area type="monotone" dataKey="readiness" stroke="#0B5FFF" strokeWidth={2} fillOpacity={1} fill="url(#chart-glow)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Matches Bar Chart */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="text-sm font-bold text-slate-950 dark:text-white">Active Job Matches</h4>
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-500 font-black px-2 py-0.5 rounded-full">LIVE FEED</span>
                </div>

                <div className="h-64 w-full">
                  {isDemoLoading ? (
                    <div className="h-full bg-slate-150 dark:bg-slate-850 rounded animate-pulse" />
                  ) : isDemoEmpty ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-4">
                      <Sliders size={28} className="text-slate-300 dark:text-slate-700" />
                      <p className="text-xs font-bold text-slate-500 mt-2">No jobs matched currently</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mockChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDemoDark ? "#1e293b" : "#f1f5f9"} />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                        <Tooltip />
                        <Bar dataKey="matches" fill="#2DA8FF" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>

            {/* Activity Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h4 className="text-sm font-bold text-slate-950 dark:text-white">Recent Sandbox Activities</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Click any row below to view detailed metadata drawer.</p>
                </div>
                <button
                  onClick={() => {
                    addToast("Checking status...", "Querying backend database modules.", "info");
                  }}
                  className="flex items-center gap-1.5 text-xs text-brand-secondary hover:underline font-bold cursor-pointer"
                >
                  <RefreshCw size={12} /> Refetch logs
                </button>
              </div>

              <div className="overflow-x-auto w-full">
                {isDemoLoading ? (
                  <div className="space-y-4 py-4 w-full">
                    {[1, 2, 3].map((s) => (
                      <div key={s} className="grid grid-cols-4 gap-4 animate-pulse">
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded" />
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded col-span-2" />
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded" />
                      </div>
                    ))}
                  </div>
                ) : isDemoEmpty || filteredActivities.length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center">
                    <Sliders size={32} className="text-slate-300 dark:text-slate-700 mb-2" />
                    <p className="text-xs font-bold text-slate-500">No activities found</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Try clearing your search query filter.</p>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="pb-3 w-1/4">Action Title</th>
                        <th className="pb-3 w-1/2">Execution Log Details</th>
                        <th className="pb-3">Time Run</th>
                        <th className="pb-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredActivities.map((act) => (
                        <tr
                          key={act.id}
                          onClick={() => {
                            setSelectedActivity(act);
                            addToast("Drawer Opened", `Loading details for log ID #${act.id}`, "info");
                          }}
                          className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-all"
                        >
                          <td className="py-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              act.status === "success" ? "bg-emerald-500" : act.status === "warning" ? "bg-amber-500" : "bg-blue-500"
                            }`} />
                            {act.title}
                          </td>
                          <td className="py-4 text-slate-500 dark:text-slate-400 pr-4 truncate max-w-xs">{act.detail}</td>
                          <td className="py-4 text-slate-400">{act.time}</td>
                          <td className="py-4 text-right">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                              act.status === "success"
                                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400"
                                : act.status === "warning"
                                ? "bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400"
                                : "bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400"
                            }`}>
                              {act.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </main>

        </div>
      </div>

      {/* Drawer Panel Details View */}
      <AnimatePresence>
        {selectedActivity && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedActivity(null)}
              className="fixed inset-0 bg-black z-50 pointer-events-auto"
            />
            {/* Slide-out drawer content */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-slate-900 z-50 shadow-2xl p-6 flex flex-col justify-between border-l border-slate-200 dark:border-slate-800"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-[9px] bg-[#0B5FFF]/10 text-brand-secondary font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {selectedActivity.type} Details
                    </span>
                    <h3 className="text-sm font-bold text-slate-950 dark:text-white mt-1.5">{selectedActivity.title}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedActivity(null)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-slate-500 dark:text-slate-400"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Execution Time</label>
                    <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Clock size={12} /> {selectedActivity.time}
                    </p>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Execution Details</label>
                    <p className="text-slate-600 dark:text-slate-350 leading-relaxed font-medium bg-slate-50 dark:bg-slate-850 p-3.5 rounded-xl border border-slate-100 dark:border-slate-850">
                      {selectedActivity.detail}
                    </p>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Status Verification</label>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      selectedActivity.status === "success"
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20"
                        : "bg-amber-50 text-amber-600 dark:bg-amber-950/20"
                    }`}>
                      <span className={`w-1 h-1 rounded-full ${selectedActivity.status === "success" ? "bg-emerald-500" : "bg-amber-500"}`} />
                      Verification {selectedActivity.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex gap-3">
                <button
                  onClick={() => {
                    setSelectedActivity(null);
                    addToast("Activity re-run requested", "Check status logs in a moment.", "success");
                  }}
                  className="flex-1 py-3 bg-[#0B5FFF] hover:bg-[#084bca] text-white font-bold rounded-xl text-xs transition-all cursor-pointer text-center"
                >
                  Re-Execute Step
                </button>
                <button
                  onClick={() => setSelectedActivity(null)}
                  className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs transition-all cursor-pointer text-center"
                >
                  Close Panel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modal Dialog Form */}
      <AnimatePresence>
        {showConfigModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfigModal(false)}
              className="fixed inset-0 bg-black/60 z-50 pointer-events-auto"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="fixed inset-0 m-auto w-full max-w-md h-fit bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-3xl p-6 z-50 overflow-hidden"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-950 dark:text-white flex items-center gap-1.5">
                  <Settings size={16} className="text-brand-secondary" /> Settings Configuration Form
                </h3>
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4 mt-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Target Professional Role</label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0B5FFF] font-semibold text-slate-800 dark:text-white"
                  >
                    <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                    <option value="Full Stack React Developer">Full Stack React Developer</option>
                    <option value="Data Analytics Consultant">Data Analytics Consultant</option>
                    <option value="Cloud Architect (AWS/GCP)">Cloud Architect (AWS/GCP)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Target Aggregate CGPA</label>
                  <input
                    type="number"
                    step="0.1"
                    min="5.0"
                    max="10.0"
                    value={targetCgpa}
                    onChange={(e) => setTargetCgpa(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0B5FFF] font-semibold text-slate-800 dark:text-white"
                  />
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowConfigModal(false)}
                    className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-brand-secondary hover:bg-[#084bca] text-white font-bold rounded-xl cursor-pointer shadow-md"
                  >
                    Save Target Config
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Sidebar Sider Drawer */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black z-50 pointer-events-auto md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-slate-900 z-50 shadow-2xl p-6 flex flex-col justify-between border-r border-slate-200 dark:border-slate-800 md:hidden"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-2">
                  <div className="filter dark:invert dark:brightness-100">
                    <VedhaLogo showText={true} size="sm" />
                  </div>
                  <button
                    onClick={() => setMobileSidebarOpen(false)}
                    className="text-slate-500 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>
                <nav className="space-y-1">
                  {[
                    { id: "overview", label: "Dashboard Hub", icon: LayoutDashboard },
                    { id: "mentoring", label: "AI Career Coach", icon: Brain },
                    { id: "resumes", label: "Resume Scanner", icon: FileText },
                    { id: "placement", label: "Placement Engine", icon: TrendingUp },
                    { id: "interviews", label: "Video Interview", icon: Video },
                    { id: "settings", label: "Target Settings", icon: Settings, action: () => { setMobileSidebarOpen(false); setShowConfigModal(true); } },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (item.action) {
                            item.action();
                          } else {
                            setActiveTab(item.id);
                            setMobileSidebarOpen(false);
                            addToast("Navigation Action", `Routed to sandbox tab: ${item.label}`, "info");
                          }
                        }}
                        className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                          isActive
                            ? "bg-[#0B5FFF]/10 text-[#0B5FFF] dark:bg-[#0B5FFF]/15"
                            : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50"
                        }`}
                      >
                        <Icon size={16} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
