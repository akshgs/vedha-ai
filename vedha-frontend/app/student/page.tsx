// app/student/page.tsx — Premium Ant Design Student Dashboard
"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import {
  chatAPI,
  skillsAPI,
  quizAPI,
  leaderboardAPI,
  jobsAPI,
  resumeAPI,
  interviewAPI,
  leetcodeAPI,
  agentAPI,
  opportunitiesAPI,
  dashboardAPI,
  placementAPI,
  roadmapAPI,
  jobRecommendationAPI,
  trendsAPI
} from "@/lib/api";
import {
  Layout,
  Card,
  Button,
  Input,
  Select,
  Progress,
  Table,
  Modal,
  Drawer,
  Upload,
  Tooltip,
  Badge,
  Tag,
  Skeleton,
  App,
  ConfigProvider,
  theme
} from "antd";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  MessageSquare,
  Compass,
  Briefcase,
  Award,
  Code,
  Video,
  FileText,
  LogOut,
  User,
  Menu,
  ChevronRight,
  ArrowRight,
  Play,
  UploadCloud,
  Sparkles,
  BookOpen,
  Star,
  Cpu,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Flame
} from "lucide-react";

const { Header, Sider, Content } = Layout;

export default function StudentDashboard() {
  const { message } = App.useApp();
  const router = useRouter();
  const { user, logout, loadFromStorage } = useAuthStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  // Global State / Quick Stats
  const [rank, setRank] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [skillsList, setSkillsList] = useState<string[]>([]);
  const [targetRole, setTargetRole] = useState("");
  const [readinessScore, setReadinessScore] = useState<number>(30);
  const [statsLoading, setStatsLoading] = useState(true);

  // 1. AI Chat Coach State
  const [chatMsg, setChatMsg] = useState("");
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 2. Skill Gap & Roadmap State
  const [roadmapSkillsText, setRoadmapSkillsText] = useState("");
  const [roadmapRole, setRoadmapRole] = useState("ML Engineer");
  const [roadmapAnalysis, setRoadmapAnalysis] = useState<any>(null);
  const [roadmapAnalysing, setRoadmapAnalysing] = useState(false);

  // 3. Quiz State
  const [quizTopics, setQuizTopics] = useState<string[]>([]);
  const [selectedQuizTopic, setSelectedQuizTopic] = useState("");
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [quizActive, setQuizActive] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitting, setQuizSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState<any>(null);

  // 4. DSA Practice State
  const [dsaTracks, setDsaTracks] = useState<string[]>([]);
  const [selectedDsaTrack, setSelectedDsaTrack] = useState("");
  const [dsaTopics, setDsaTopics] = useState<string[]>([]);
  const [selectedDsaTopic, setSelectedDsaTopic] = useState("");
  const [dsaLoading, setDsaLoading] = useState(false);
  const [dsaProblem, setDsaProblem] = useState<any>(null);
  const [studentCode, setStudentCode] = useState("");
  const [hintLevel, setHintLevel] = useState(1);
  const [hintResult, setHintResult] = useState<any>(null);
  const [hintLoading, setHintLoading] = useState(false);
  const [dsaHistory, setDsaHistory] = useState<any[]>([]);

  // 5. Mock Interview State
  const [interviewRole, setInterviewRole] = useState("Machine Learning Engineer");
  const [interviewQuestions, setInterviewQuestions] = useState<any[]>([]);
  const [activeQuestion, setActiveQuestion] = useState<any>(null);
  const [interviewLoading, setInterviewLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [mockVideoFile, setMockVideoFile] = useState<File | null>(null);
  const [interviewResult, setInterviewResult] = useState<any>(null);
  const [interviewSubmitting, setInterviewSubmitting] = useState(false);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const recordIntervalRef = useRef<any>(null);

  // 6. Resume Scanner State
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeRole, setResumeRole] = useState("Machine Learning Engineer");
  const [resumeScanResult, setResumeScanResult] = useState<any>(null);
  const [resumeScanning, setResumeScanning] = useState(false);
  const [activeScheduleTab, setActiveScheduleTab] = useState("today");

  // Extended States
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [placementScoreInfo, setPlacementScoreInfo] = useState<any>(null);
  const [structuredRoadmap, setStructuredRoadmap] = useState<any>(null);
  const [roadmapGenerating, setRoadmapGenerating] = useState(false);
  const [semanticRecommendations, setSemanticRecommendations] = useState<any[]>([]);
  const [semanticLoading, setSemanticLoading] = useState(false);
  const [oppsTabType, setOppsTabType] = useState<"keyword" | "semantic">("keyword");
  const [trendsData, setTrendsData] = useState<any>(null);
  const [trendsLoading, setTrendsLoading] = useState(false);
  const [trendsRefreshing, setTrendsRefreshing] = useState(false);

  const ROLES_LIST = [
    "ML Engineer", "Data Scientist", "LLM Engineer", "GenAI Developer",
    "Backend Developer", "Full Stack Developer", "DevOps Engineer",
    "Computer Vision Engineer", "Prompt Engineer", "MLOps Engineer",
    "Data Analyst", "Android Developer", "Cloud Engineer", "Cybersecurity Analyst", "NLP Engineer"
  ];

  useEffect(() => {
    loadFromStorage();
    document.body.classList.remove("dark-theme");
    document.body.classList.add("light-theme");
    return () => {
      document.body.classList.remove("light-theme");
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    if (user.role !== "student") {
      router.push(`/${user.role}`);
      return;
    }
    setTargetRole(user.goal || "ML Engineer");
    setRoadmapRole(user.goal || "ML Engineer");
    fetchStats();
    fetchInitialData();
  }, [user]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  const fetchStats = async () => {
    if (!user) return;
    setStatsLoading(true);
    try {
      const [rankRes, jobsRes, oppsRes, dashRes, placeRes] = await Promise.allSettled([
        leaderboardAPI.myRank(user.id),
        jobsAPI.matchJobs(user.id),
        opportunitiesAPI.match(user.id),
        dashboardAPI.getDashboard(user.id),
        placementAPI.getPlacementScore(user.id)
      ]);

      if (rankRes.status === "fulfilled") {
        setRank(rankRes.value.data);
      }
      if (jobsRes.status === "fulfilled") {
        setJobs(jobsRes.value.data.matched_jobs || []);
      }
      if (oppsRes.status === "fulfilled") {
        setOpportunities(oppsRes.value.data.opportunities || []);
      }
      if (dashRes.status === "fulfilled" && !dashRes.value.data.error) {
        setDashboardStats(dashRes.value.data);
      }
      if (placeRes.status === "fulfilled") {
        setPlacementScoreInfo(placeRes.value.data);
        if (placeRes.value.data.placement_readiness !== undefined) {
          setReadinessScore(placeRes.value.data.placement_readiness);
        }
      } else if (rankRes.status === "fulfilled" && rankRes.value.data?.score) {
        setReadinessScore(rankRes.value.data.score);
      }

      // Pre-fetch semantic recommendations
      fetchSemanticRecommendations(user.id);
    } catch (e) {
      console.error("Error loading profile stats", e);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchSemanticRecommendations = async (studentId: number) => {
    setSemanticLoading(true);
    try {
      const res = await jobRecommendationAPI.recommend({ student_id: studentId });
      setSemanticRecommendations(res.data.recommended_jobs || []);
    } catch (e) {
      console.error("Error loading semantic job recommendations", e);
    } finally {
      setSemanticLoading(false);
    }
  };

  const handleGenerateStructuredRoadmap = async () => {
    if (!user) return;
    setRoadmapGenerating(true);
    setStructuredRoadmap(null);
    try {
      const res = await roadmapAPI.generate({ student_id: user.id });
      setStructuredRoadmap(res.data);
      message.success("Structured 30/60/90 day roadmap generated successfully!");
    } catch (e: any) {
      message.error(e.response?.data?.detail || "Failed to generate learning roadmap. Ensure a resume has been parsed first.");
    } finally {
      setRoadmapGenerating(false);
    }
  };

  const fetchTrends = async () => {
    setTrendsLoading(true);
    try {
      const res = await trendsAPI.getTrends();
      setTrendsData(res.data);
    } catch (e) {
      message.error("Failed to load tech market trends.");
    } finally {
      setTrendsLoading(false);
    }
  };

  const handleRefreshTrends = async () => {
    setTrendsRefreshing(true);
    message.loading({ content: "Re-crawling active tech trends...", key: "refresh_trends" });
    try {
      await trendsAPI.refresh();
      await fetchTrends();
      message.success({ content: "Market trends successfully updated!", key: "refresh_trends" });
    } catch (e) {
      message.error({ content: "Failed to refresh market trends.", key: "refresh_trends" });
    } finally {
      setTrendsRefreshing(false);
    }
  };

  const fetchInitialData = async () => {
    try {
      const [topicsRes, tracksRes] = await Promise.all([
        quizAPI.topics(),
        leetcodeAPI.tracks()
      ]);
      setQuizTopics(topicsRes.data.topics || []);
      setDsaTracks(tracksRes.data.tracks || []);
    } catch (e) {
      console.error("Error loading dropdown data", e);
    }
  };

  // 1. AI Chat Coach Actions
  const fetchChatHistory = async () => {
    if (!user) return;
    try {
      const res = await chatAPI.history(user.id);
      setChatHistory(res.data.history || []);
    } catch {}
  };

  const sendChat = async () => {
    if (!chatMsg.trim() || !user) return;
    const userMsg = { role: "user", message: chatMsg };
    setChatHistory((h) => [...h, userMsg]);
    const inputMsg = chatMsg;
    setChatMsg("");
    setChatLoading(true);
    try {
      const res = await chatAPI.send({ student_id: user.id, message: inputMsg });
      setChatHistory((h) => [...h, { role: "assistant", message: res.data.reply }]);
    } catch {
      setChatHistory((h) => [...h, { role: "assistant", message: "Error contacting Coach. Please check GROQ_API_KEY." }]);
    } finally {
      setChatLoading(false);
    }
  };

  // 2. Skill Gap & Roadmap Actions
  const handleRoadmapAnalysis = async () => {
    if (!roadmapSkillsText.trim() || !user) {
      message.warning("Please type your current skills first!");
      return;
    }
    setRoadmapAnalysing(true);
    try {
      const res = await agentAPI.careerAnalysis({
        resume_text: roadmapSkillsText,
        target_role: roadmapRole
      });
      setRoadmapAnalysis(res.data);
      setReadinessScore(res.data.career?.score || 0);
      setSkillsList(res.data.resume?.skills || []);
      setTargetRole(roadmapRole);
      message.success("Career switch planner updated!");
      fetchStats();
    } catch (error) {
      message.error("Career Analysis Failed. Try again.");
    } finally {
      setRoadmapAnalysing(false);
    }
  };

  // 3. Quiz Actions
  const loadQuizQuestions = async (topic: string) => {
    if (!topic) return;
    setQuizActive(false);
    setQuizResult(null);
    setQuizAnswers({});
    setCurrentQuizIndex(0);
    try {
      const res = await quizAPI.questions(topic);
      setQuizQuestions(res.data.questions || []);
      setQuizActive(true);
    } catch {
      message.error("Failed to load quiz questions.");
    }
  };

  const handleSelectAnswer = (qId: number, optionIdx: number) => {
    setQuizAnswers((prev) => ({ ...prev, [qId.toString()]: optionIdx }));
  };

  const submitQuiz = async () => {
    if (!user) return;
    setQuizSubmitting(true);
    try {
      const res = await quizAPI.submit({
        student_id: user.id,
        topic: selectedQuizTopic,
        answers: quizAnswers
      });
      setQuizResult(res.data);
      setQuizActive(false);
      message.success("Quiz score submitted!");
      fetchStats();
    } catch {
      message.error("Error submitting quiz answers.");
    } finally {
      setQuizSubmitting(false);
    }
  };

  // 4. DSA Practice Actions
  const selectDsaTrack = async (track: string) => {
    setSelectedDsaTrack(track);
    setDsaTopics([]);
    setSelectedDsaTopic("");
    setDsaProblem(null);
    setHintResult(null);
    try {
      const res = await leetcodeAPI.topics(track);
      setDsaTopics(res.data.topics || []);
    } catch {}
  };

  const loadDsaProblem = async () => {
    if (!user || !selectedDsaTrack || !selectedDsaTopic) return;
    setDsaLoading(true);
    setDsaProblem(null);
    setHintResult(null);
    setStudentCode("");
    try {
      const res = await leetcodeAPI.practice({
        student_id: user.id,
        track: selectedDsaTrack,
        topic: selectedDsaTopic,
        difficulty: "Intermediate"
      });
      setDsaProblem(res.data);
      setStudentCode(
        selectedDsaTrack.toLowerCase().includes("python")
          ? "def solve():\n    # Write your Python solution here\n    pass"
          : "// Write your code here"
      );
      fetchDsaHistory();
    } catch {
      message.error("Failed to load problem. Ensure Groq Key is set.");
    } finally {
      setDsaLoading(false);
    }
  };

  const fetchDsaHistory = async () => {
    if (!user) return;
    try {
      const res = await leetcodeAPI.history(user.id);
      setDsaHistory(res.data.history || []);
    } catch {}
  };

  const requestDsaHint = async (level: number) => {
    if (!user || !dsaProblem) return;
    setHintLevel(level);
    setHintLoading(true);
    setHintResult(null);
    try {
      const res = await leetcodeAPI.hint({
        student_id: user.id,
        track: selectedDsaTrack,
        topic: selectedDsaTopic,
        problem: dsaProblem.problem,
        hint_level: level,
        code: studentCode
      });
      setHintResult(res.data);
      fetchDsaHistory();
    } catch {
      message.error("Failed to fetch hints.");
    } finally {
      setHintLoading(false);
    }
  };

  // 5. Mock Interview Actions
  const loadInterviewQuestions = async () => {
    setInterviewLoading(true);
    setInterviewQuestions([]);
    setActiveQuestion(null);
    setInterviewResult(null);
    try {
      const res = await interviewAPI.questions(interviewRole);
      setInterviewQuestions(res.data.questions || []);
      if (res.data.questions?.length > 0) {
        setActiveQuestion(res.data.questions[0]);
      }
    } catch {
      message.error("Failed to generate custom mock questions.");
    } finally {
      setInterviewLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setMediaStream(stream);
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
      }
    } catch (e) {
      message.warning("Cam access denied. Simulating interview inputs.");
    }
  };

  const stopCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }
  };

  const startRecording = async () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    await startCamera();
    recordIntervalRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    clearInterval(recordIntervalRef.current);
    stopCamera();
  };

  const handleInterviewUpload = async () => {
    if (!user || !activeQuestion) return;
    setInterviewSubmitting(true);
    setInterviewResult(null);

    let uploadFile = mockVideoFile;
    if (!uploadFile) {
      // Simulate file upload with dummy blob
      const dummyBlob = new Blob(["mock_video_bytes"], { type: "video/mp4" });
      uploadFile = new File([dummyBlob], "mock_interview_recording.mp4", { type: "video/mp4" });
    }

    const formData = new FormData();
    formData.append("video", uploadFile);
    formData.append("question", activeQuestion.question);
    formData.append("role", interviewRole);

    try {
      const res = await interviewAPI.analyze(formData);
      setInterviewResult(res.data);
      message.success("Interview report generated!");
    } catch (e: any) {
      message.error(e.response?.data?.detail || "Error evaluating video response.");
    } finally {
      setInterviewSubmitting(false);
    }
  };

  // 6. Resume Scanner Actions
  const handleResumeScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile) {
      message.warning("Select a file first!");
      return;
    }
    setResumeScanning(true);
    setResumeScanResult(null);

    const formData = new FormData();
    formData.append("file", resumeFile);
    formData.append("target_role", resumeRole);

    try {
      const res = await resumeAPI.scan(formData);
      setResumeScanResult(res.data);
      message.success("Resume parsed successfully!");
    } catch (e: any) {
      message.error(e.response?.data?.detail || "Failed to scan resume.");
    } finally {
      setResumeScanning(false);
    }
  };

  // UI Tabs Config
  const tabs = [
    { id: "home", label: "Dashboard Hub", icon: LayoutDashboard },
    { id: "chat", label: "AI Coach Chat", icon: MessageSquare, action: fetchChatHistory },
    { id: "roadmap", label: "Skill Roadmap", icon: Compass },
    { id: "opportunities", label: "Career Opportunities", icon: Briefcase },
    { id: "trends", label: "Tech Trends", icon: TrendingUp, action: fetchTrends },
    { id: "quiz", label: "Quiz Hub", icon: Award },
    { id: "dsa", label: "DSA Practice", icon: Code, action: fetchDsaHistory },
    { id: "resume", label: "Resume Checker", icon: FileText },
    { id: "interview", label: "Video Interview", icon: Video }
  ];

  const handleTabChange = (tabId: string, action?: () => void) => {
    setActiveTab(tabId);
    setMobileDrawerOpen(false);
    if (action) action();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center">
        <Skeleton active paragraph={{ rows: 4 }} className="max-w-md p-6 bg-white/5 rounded-3xl" />
      </div>
    );
  }

  // Sidebar Layout elements
  const sidebarContent = (
    <div className="flex flex-col justify-between h-full py-6">
      <div className="space-y-8 px-6">
        <div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
            ⚡ Vedha AI
          </h1>
          <span className="text-[10px] bg-indigo-50 text-indigo-600 border border-indigo-100/60 px-2 py-0.5 rounded-md font-semibold uppercase tracking-wider">
            Student Portal
          </span>
        </div>

        <nav className="space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id, tab.action)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100/50"
                    : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-slate-100 pt-4 mt-6 px-6 space-y-4">
        <div className="flex items-center gap-3 bg-[#F8FAFC] border border-slate-200/50 p-3 rounded-2xl">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 font-bold">
            🎓
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
            <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={() => {
            logout();
            router.push("/login");
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold text-red-500 border border-red-200/50 hover:bg-red-50/50 hover:text-red-600 transition-all cursor-pointer"
        >
          <LogOut size={14} /> Log Out Account
        </button>
      </div>
    </div>
  );

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "#6366f1",
          borderRadius: 20,
          colorBgBase: "#ffffff",
          colorBgContainer: "#ffffff",
          colorBgElevated: "#ffffff",
          colorText: "#0f172a",
          colorTextPlaceholder: "#94a3b8",
        },
      }}
    >
      <Layout className="min-h-screen bg-[#F4F5F7] text-[#0F172A] font-sans light-theme">
        {/* Sider for Desktop */}
        <Sider
          collapsible
          collapsed={sidebarCollapsed}
          onCollapse={(val) => setSidebarCollapsed(val)}
          width={260}
          trigger={null}
          className="hidden lg:block bg-white/90 border-r border-slate-200/80 shrink-0"
        >
          {sidebarContent}
        </Sider>

        {/* Drawer for Mobile Sider */}
        <Drawer
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          placement="left"
          closable={false}
          styles={{ body: { padding: 0, backgroundColor: "#ffffff" } }}
          size={260}
        >
          {sidebarContent}
        </Drawer>

        <Layout className="bg-transparent flex-1 flex flex-col min-w-0">
          {/* Header */}
          <Header className="bg-white/60 backdrop-blur-md border-b border-slate-200/80 px-6 py-4 flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileDrawerOpen(true)}
                className="lg:hidden text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <Menu size={20} />
              </button>
              <div className="text-sm font-bold text-slate-800 tracking-tight">
                Good morning, {user.name}
              </div>
              <div className="hidden md:block text-[10px] text-[#64748B] font-semibold bg-[#F1F5F9] border border-slate-200/50 px-3 py-1.5 rounded-full">
                Vedha AI has handled {jobs.length + opportunities.length} matching openings for you today.
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/60 text-emerald-600 text-[10px] font-bold px-3 py-1.5 rounded-full animate-pulse">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> AI Agent Live
              </div>
              <Badge dot status="success">
                <AvatarIcon className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-500 border border-indigo-200 flex items-center justify-center font-bold text-xs uppercase">
                  {user.name.slice(0, 2)}
                </AvatarIcon>
              </Badge>
            </div>
          </Header>

          {/* Content Area */}
          <Content className="p-6 md:p-8 overflow-y-auto max-w-6xl w-full mx-auto flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "home" && (
                  <div className="space-y-8">
                    {/* Hero Agent Highlight Card */}
                    <Card className="light-panel border-indigo-100 bg-gradient-to-r from-violet-950 via-slate-900 to-indigo-950 text-white rounded-[24px] overflow-hidden relative p-6 border-none light-glow-indigo">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-3">
                          <span className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit">
                            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" /> AI Agent Activity • active
                          </span>
                          <h2 className="text-xl font-bold text-white">
                            Vedha is tracking {jobs.length} career paths for you right now
                          </h2>
                          <p className="text-indigo-250/80 text-xs max-w-xl">
                            Currently analyzing your skillset gap models, crawling technopark job openings, and simulating mock recruiter interview loops.
                          </p>
                        </div>
                        <div className="flex gap-3 shrink-0">
                          <Button
                            type="primary"
                            icon={<Compass size={14} />}
                            onClick={() => handleTabChange("roadmap")}
                            className="bg-indigo-600 hover:bg-indigo-500 border-none font-bold rounded-xl text-xs h-10 px-5 shadow-lg shadow-indigo-600/20 cursor-pointer"
                          >
                            Check Skill Gap
                          </Button>
                          <Button
                            icon={<MessageSquare size={14} />}
                            onClick={() => handleTabChange("chat", fetchChatHistory)}
                            className="bg-white/10 border-white/10 hover:border-indigo-500 text-white hover:bg-white/20 rounded-xl text-xs h-10 px-5 cursor-pointer"
                          >
                            AI Coach
                          </Button>
                        </div>
                      </div>
                    </Card>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                      {/* Compatibility */}
                      <Card className="light-panel rounded-[24px] p-4 flex flex-col justify-between h-32 border-[#e2e8f0]/60">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] text-[#64748B] uppercase font-semibold">Hiring Compatibility</span>
                          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                            <Award size={16} />
                          </div>
                        </div>
                        <div className="mt-2">
                          <h3 className="text-2xl font-black text-[#0f172a]">{readinessScore}%</h3>
                          <Progress percent={readinessScore} size="small" showInfo={false} strokeColor="#6366f1" railColor="rgba(0,0,0,0.04)" className="mt-2" />
                        </div>
                      </Card>

                      {/* Quiz loop */}
                      <Card className="light-panel rounded-[24px] p-4 flex flex-col justify-between h-32 border-[#e2e8f0]/60">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] text-[#64748B] uppercase font-semibold">Quiz Loop Average</span>
                          <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                            <Sparkles size={16} />
                          </div>
                        </div>
                        <div className="mt-2">
                          <h3 className="text-2xl font-black text-[#0f172a]">{rank ? `${rank.score}%` : "0%"}</h3>
                          <Progress percent={rank ? rank.score : 0} size="small" showInfo={false} strokeColor="#10b981" railColor="rgba(0,0,0,0.04)" className="mt-2" />
                        </div>
                      </Card>

                      {/* Scraped vacancies */}
                      <Card className="light-panel rounded-[24px] p-4 flex flex-col justify-between h-32 border-[#e2e8f0]/60">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] text-[#64748B] uppercase font-semibold">Scraped Vacancies</span>
                          <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
                            <Briefcase size={16} />
                          </div>
                        </div>
                        <div className="mt-2">
                          <h3 className="text-2xl font-black text-[#0f172a]">{jobs.length}</h3>
                          <Progress percent={Math.min(jobs.length * 10, 100)} size="small" showInfo={false} strokeColor="#8b5cf6" railColor="rgba(0,0,0,0.04)" className="mt-2" />
                        </div>
                      </Card>

                      {/* Readiness Level */}
                      <Card className="light-panel rounded-[24px] p-4 flex flex-col justify-between h-32 border-[#e2e8f0]/60">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] text-[#64748B] uppercase font-semibold">Readiness Level</span>
                          <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
                            <Code size={16} />
                          </div>
                        </div>
                        <div className="mt-2">
                          <h3 className="text-xl font-black text-[#0f172a]">{readinessScore >= 80 ? "Strong" : readinessScore >= 60 ? "Moderate" : "Needs Practice"}</h3>
                          <Progress percent={readinessScore} size="small" showInfo={false} strokeColor="#f59e0b" railColor="rgba(0,0,0,0.04)" className="mt-2" />
                        </div>
                      </Card>
                    </div>

                    {placementScoreInfo && (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Placement readiness scorecard */}
                        <Card title={<span className="text-slate-800 font-extrabold text-sm">Placement Readiness Diagnostics</span>} className="light-panel rounded-[24px] lg:col-span-2 border-[#e2e8f0]/60">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <span className="text-xs text-[#64748B] block font-semibold mb-3">Assessment Weights breakdown</span>
                              <div className="space-y-3 text-xs">
                                <div className="space-y-1">
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">Resume Score (40%)</span>
                                    <strong className="text-indigo-600">{placementScoreInfo.resume_score}%</strong>
                                  </div>
                                  <Progress percent={placementScoreInfo.resume_score} size="small" strokeColor="#6366f1" showInfo={false} />
                                </div>
                                <div className="space-y-1">
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">Technical Assessments (30%)</span>
                                    <strong className="text-emerald-600">{placementScoreInfo.quiz_score}%</strong>
                                  </div>
                                  <Progress percent={placementScoreInfo.quiz_score} size="small" strokeColor="#10b981" showInfo={false} />
                                </div>
                                <div className="space-y-1">
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">Mock Interview Score (20%)</span>
                                    <strong className="text-purple-600">{placementScoreInfo.interview_score}%</strong>
                                  </div>
                                  <Progress percent={placementScoreInfo.interview_score} size="small" strokeColor="#8b5cf6" showInfo={false} />
                                </div>
                                <div className="space-y-1">
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">LeetCode Sync Index (10%)</span>
                                    <strong className="text-amber-600">{placementScoreInfo.leetcode_score}%</strong>
                                  </div>
                                  <Progress percent={placementScoreInfo.leetcode_score} size="small" strokeColor="#f59e0b" showInfo={false} />
                                </div>
                              </div>
                            </div>
                            <div className="border-l border-slate-100 pl-6 space-y-4">
                              <div>
                                <span className="text-xs text-emerald-600 font-extrabold uppercase tracking-wider block mb-2">Key Strengths</span>
                                {placementScoreInfo.strengths?.length > 0 ? (
                                  <div className="flex flex-col gap-1.5">
                                    {placementScoreInfo.strengths.map((str: string, i: number) => (
                                      <div key={i} className="flex items-center gap-2 text-xs text-slate-800">
                                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                                        <span>{str}</span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-xs text-slate-400">Complete more quizzes or polish your resume to show strengths.</span>
                                )}
                              </div>
                              <div className="pt-2">
                                <span className="text-xs text-amber-600 font-extrabold uppercase tracking-wider block mb-2">Improvement Targets</span>
                                {placementScoreInfo.improvement_areas?.length > 0 ? (
                                  <div className="flex flex-col gap-1.5">
                                    {placementScoreInfo.improvement_areas.map((imp: string, i: number) => (
                                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                                        <AlertCircle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                                        <span>{imp}</span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2 text-xs text-emerald-600">
                                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                                    <span>No immediate improvement actions needed!</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </Card>

                        {/* General fit summary */}
                        <Card title={<span className="text-slate-800 font-extrabold text-sm">Target Switch Profile</span>} className="light-panel rounded-[24px] text-center h-full border-[#e2e8f0]/60">
                          <span className="text-xs text-slate-400 block uppercase mb-1">Weighted Placement Index</span>
                          <div className="text-5xl font-black text-indigo-600 my-4">{placementScoreInfo.placement_readiness}%</div>
                          <Tag color="indigo" className="font-extrabold text-[10px] px-3 py-1 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700">
                            Status: {placementScoreInfo.readiness_level}
                          </Tag>
                          <div className="border-t border-slate-100 pt-4 mt-4 text-left text-xs text-slate-500 space-y-2">
                            <div className="flex justify-between">
                              <span>Target Candidate:</span>
                              <span className="font-bold text-slate-800">{placementScoreInfo.student_name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Goal Focus:</span>
                              <span className="font-bold text-slate-800">{dashboardStats?.target_role || targetRole}</span>
                            </div>
                          </div>
                        </Card>
                      </div>
                    )}

                    {/* Dual Grid: Activity Log vs Sprints Checklist */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Left: AI Agent Activity Log (takes 2 cols) */}
                      <Card title={<span className="text-slate-800 font-extrabold text-sm">AI Agent Activity Log</span>} extra={<Button type="text" onClick={() => handleTabChange("chat", fetchChatHistory)} className="text-indigo-600 hover:text-indigo-500 font-bold text-xs cursor-pointer">View All</Button>} className="light-panel rounded-[24px] lg:col-span-2 border-[#e2e8f0]/60">
                        <div className="flex flex-col gap-4">
                          <div className="flex items-start gap-3 bg-[#F8FAFC] border border-slate-100 p-3.5 rounded-2xl hover:bg-slate-50 transition-all">
                            <div className="w-8 h-8 rounded-lg bg-[#E6F4EA] flex items-center justify-center text-[#137333] shrink-0">
                              <CheckCircle2 size={16} />
                            </div>
                            <div>
                              <p className="text-xs text-[#1f2937] leading-normal">
                                Parsed CV resume and calculated <strong>{readinessScore}% match index</strong> for target goal <strong>{targetRole}</strong>.
                              </p>
                              <span className="text-[10px] text-gray-500 block mt-1">AI agent • Just now</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 bg-[#F8FAFC] border border-slate-100 p-3.5 rounded-2xl hover:bg-slate-50 transition-all">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                              <Sparkles size={16} />
                            </div>
                            <div>
                              <p className="text-xs text-[#1f2937] leading-normal">
                                Evaluated mock technical quiz score: <strong>{rank ? rank.score : 0}%</strong> for tech stacks assessment.
                              </p>
                              <span className="text-[10px] text-gray-500 block mt-1">AI agent • 18 min ago</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 bg-[#F8FAFC] border border-slate-100 p-3.5 rounded-2xl hover:bg-slate-50 transition-all">
                            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-500 shrink-0">
                              <Briefcase size={16} />
                            </div>
                            <div>
                              <p className="text-xs text-[#1f2937] leading-normal">
                                Matched <strong>{jobs.length} local IT vacancies</strong> matching your target skills criteria.
                              </p>
                              <span className="text-[10px] text-gray-500 block mt-1">AI agent • 1 hour ago</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 bg-[#F8FAFC] border border-slate-100 p-3.5 rounded-2xl hover:bg-slate-50 transition-all">
                            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
                              <Code size={16} />
                            </div>
                            <div>
                              <p className="text-xs text-[#1f2937] leading-normal">
                                Synchronized active LeetCode & DSA practice track modules in <strong>{selectedDsaTrack || "Python & DSA"}</strong>.
                              </p>
                              <span className="text-[10px] text-gray-500 block mt-1">AI agent • 2 hours ago</span>
                            </div>
                          </div>
                        </div>
                      </Card>

                      {/* Right: Study Checklist Sprints */}
                      <Card title={<span className="text-slate-800 font-extrabold text-sm">Today's Study Checklist</span>} className="light-panel rounded-[24px] flex flex-col border-[#e2e8f0]/60">
                        <div className="flex bg-[#F1F5F9] border border-slate-100 rounded-xl p-1 mb-4">
                          {["today", "tomorrow", "week"].map((tab) => (
                            <button
                              key={tab}
                              onClick={() => setActiveScheduleTab(tab)}
                              className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                activeScheduleTab === tab
                                  ? "bg-white text-indigo-600 shadow-sm"
                                  : "text-[#64748B] hover:text-[#0f172a]"
                              }`}
                            >
                              {tab}
                            </button>
                          ))}
                        </div>

                        {activeScheduleTab === "today" && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between bg-[#F8FAFC] border border-slate-100 p-3 rounded-2xl hover:bg-slate-50 transition-all">
                              <div className="flex items-center gap-3">
                                <div className="border-r border-slate-200 pr-3 text-center shrink-0">
                                  <span className="text-xs text-slate-800 font-bold block">09:30</span>
                                  <span className="text-[9px] text-[#64748B] block">30m</span>
                                </div>
                                <div>
                                  <span className="font-bold text-slate-800 text-xs block">Arrays & Lists</span>
                                  <span className="text-[9px] text-slate-500 block mt-0.5">Practice Track</span>
                                </div>
                              </div>
                              <Tag color="success" className="text-[9px] font-bold border-none bg-emerald-100 text-emerald-700">Done</Tag>
                            </div>

                            <div className="flex items-center justify-between bg-[#EEF2FF] border border-[#C7D2FE]/60 p-3 rounded-2xl hover:bg-indigo-50/50 transition-all shadow-sm shadow-indigo-100/50">
                              <div className="flex items-center gap-3">
                                <div className="border-r border-[#C7D2FE]/60 pr-3 text-center shrink-0">
                                  <span className="text-xs text-indigo-600 font-bold block">10:00</span>
                                  <span className="text-[9px] text-slate-400 block">45m</span>
                                </div>
                                <div>
                                  <span className="font-bold text-indigo-950 text-xs block">Attempt ML Quiz</span>
                                  <span className="text-[9px] text-indigo-500 block mt-0.5">Topic Assessment</span>
                                </div>
                              </div>
                              <Tag color="processing" className="text-[9px] font-bold animate-pulse border-none bg-indigo-200 text-indigo-800">Active</Tag>
                            </div>

                            <div className="flex items-center justify-between bg-white border border-slate-200/60 p-3 rounded-2xl hover:bg-[#F8FAFC] transition-all">
                              <div className="flex items-center gap-3">
                                <div className="border-r border-slate-200 pr-3 text-center shrink-0">
                                  <span className="text-xs text-slate-800 font-bold block">11:45</span>
                                  <span className="text-[9px] text-slate-400 block">90m</span>
                                </div>
                                <div>
                                  <span className="font-bold text-slate-800 text-xs block">AI Mock Interview</span>
                                  <span className="text-[9px] text-slate-500 block mt-0.5">Video Loop Simulator</span>
                                </div>
                              </div>
                              <Button type="link" onClick={() => handleTabChange("interview")} className="text-[9px] font-bold p-0 text-indigo-600 hover:text-indigo-700">Start</Button>
                            </div>
                          </div>
                        )}

                        {activeScheduleTab === "tomorrow" && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between bg-white border border-slate-200/60 p-3 rounded-2xl hover:bg-[#F8FAFC] transition-all">
                              <div className="flex items-center gap-3">
                                <div className="border-r border-slate-200 pr-3 text-center shrink-0">
                                  <span className="text-xs text-slate-800 font-bold block">09:30</span>
                                  <span className="text-[9px] text-slate-400 block">60m</span>
                                </div>
                                <div>
                                  <span className="font-bold text-slate-800 text-xs block">Resume Keyword Sync</span>
                                  <span className="text-[9px] text-slate-500 block mt-0.5">Parser Check</span>
                                </div>
                              </div>
                              <Tag color="default" className="text-[9px] font-bold border-none bg-slate-100 text-slate-600">Pending</Tag>
                            </div>

                            <div className="flex items-center justify-between bg-white border border-slate-200/60 p-3 rounded-2xl hover:bg-[#F8FAFC] transition-all">
                              <div className="flex items-center gap-3">
                                <div className="border-r border-slate-200 pr-3 text-center shrink-0">
                                  <span className="text-xs text-slate-800 font-bold block">11:00</span>
                                  <span className="text-[9px] text-slate-400 block">45m</span>
                                </div>
                                <div>
                                  <span className="font-bold text-slate-800 text-xs block">DSA Graphs & Trees</span>
                                  <span className="text-[9px] text-slate-500 block mt-0.5">Retrieve Problem</span>
                                </div>
                              </div>
                              <Tag color="default" className="text-[9px] font-bold border-none bg-slate-100 text-slate-600">Pending</Tag>
                            </div>
                          </div>
                        )}

                        {activeScheduleTab === "week" && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between bg-white border border-slate-200/60 p-3 rounded-2xl hover:bg-[#F8FAFC] transition-all">
                              <div className="flex items-center gap-3">
                                <div className="border-r border-slate-200 pr-3 text-center shrink-0">
                                  <span className="text-xs text-slate-800 font-bold block">Weekly</span>
                                  <span className="text-[9px] text-slate-400 block">5h</span>
                                </div>
                                <div>
                                  <span className="font-bold text-slate-800 text-xs block">ML Model Evaluation</span>
                                  <span className="text-[9px] text-slate-500 block mt-0.5">Study Gaps Plan</span>
                                </div>
                              </div>
                              <Tag color="default" className="text-[9px] font-bold border-none bg-slate-100 text-slate-600">Pending</Tag>
                            </div>
                          </div>
                        )}
                      </Card>
                    </div>
                  </div>
                )}
                 {/* Tab 1: AI Coach */}
              {activeTab === "chat" && (
                <Card title="Vedha AI Career Coach" className="light-panel rounded-[24px] h-[70vh] flex flex-col border-[#e2e8f0]/60">
                  <div className="flex flex-col h-[52vh] justify-between">
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-4">
                      {chatHistory.length === 0 && (
                        <div className="text-center text-slate-500 py-12 max-w-md mx-auto space-y-4">
                          <div className="text-4xl">🤖</div>
                          <h4 className="font-bold text-slate-800 text-md">Welcome to AI Career Sync</h4>
                          <p className="text-xs">
                            Ask me about career switch advice, Python MLOps libraries, and salary benchmarks at UST, TCS, or Infopark.
                          </p>
                          <div className="flex justify-center gap-2 pt-2">
                            <Tag
                              className="cursor-pointer hover:bg-indigo-600 hover:text-white border-indigo-200 text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-lg"
                              onClick={() => setChatMsg("What skills do Kerala ML developers need?")}
                            >
                              ML Skills Info
                            </Tag>
                            <Tag
                              className="cursor-pointer hover:bg-indigo-600 hover:text-white border-indigo-200 text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-lg"
                              onClick={() => setChatMsg("How can I prepare for system design rounds?")}
                            >
                              System Design tips
                            </Tag>
                          </div>
                        </div>
                      )}

                      {chatHistory.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} items-end gap-2`}>
                          {msg.role !== "user" && <span className="text-xl">🤖</span>}
                          <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                            msg.role === "user"
                              ? "bg-indigo-600 text-white rounded-br-none"
                              : "bg-[#F1F5F9] border border-slate-250/60 text-slate-800 rounded-bl-none"
                          }`}>
                            <p className="whitespace-pre-line">{msg.message}</p>
                          </div>
                        </div>
                      ))}
                      {chatLoading && (
                        <div className="flex items-center gap-2 text-xs text-indigo-600">
                          <Skeleton.Button active size="small" shape="round" />
                          <span>Searching Knowledge Base...</span>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    <div className="flex gap-3 border-t border-slate-100 pt-4">
                      <Input
                        value={chatMsg}
                        onChange={(e) => setChatMsg(e.target.value)}
                        onPressEnter={sendChat}
                        placeholder="Ask about MLOps pipelines, local vacancies, or transition timelines..."
                        className="bg-[#F1F5F9] border-slate-200 text-slate-800 rounded-xl focus:border-indigo-500"
                        size="large"
                      />
                      <Button
                        type="primary"
                        onClick={sendChat}
                        loading={chatLoading}
                        className="bg-indigo-600 hover:bg-indigo-500 border-none rounded-xl"
                        size="large"
                      >
                        Send
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {/* Tab 2: Roadmap Gap */}
              {activeTab === "roadmap" && (
                <div className="space-y-8">
                  <Card title="Career Planner Sandbox" className="light-panel rounded-[24px] border-[#e2e8f0]/60">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <span className="text-xs text-[#64748B] font-semibold block mb-2">Target Switch Role</span>
                        <Select
                          value={roadmapRole}
                          onChange={(val) => setRoadmapRole(val)}
                          className="w-full text-slate-800"
                          size="large"
                          options={ROLES_LIST.map((r) => ({ value: r, label: r }))}
                        />
                      </div>

                      <div>
                        <span className="text-xs text-[#64748B] font-semibold block mb-2">Current Technical Skills (Comma Separated)</span>
                        <Input
                          value={roadmapSkillsText}
                          onChange={(e) => setRoadmapSkillsText(e.target.value)}
                          placeholder="e.g., Python, SQL, REST APIs, Git"
                          size="large"
                          className="bg-white border-slate-200 text-[#0F172A]"
                        />
                      </div>
                    </div>

                    <Button
                      type="primary"
                      onClick={handleRoadmapAnalysis}
                      loading={roadmapAnalysing}
                      size="large"
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 border-none rounded-xl font-bold mt-6 shadow-md shadow-indigo-100/50 cursor-pointer"
                    >
                      Analyze Skills Gap & Plan Roadmap
                    </Button>
                  </Card>

                  {roadmapAnalysis && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2 space-y-6">
                        {/* Missing Skills */}
                        <Card title={<span className="text-red-600 flex items-center gap-2"><AlertCircle size={16} /> Required Modules to Learn</span>} className="light-panel rounded-2xl border-[#e2e8f0]/60">
                          {roadmapAnalysis.missing_skills?.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {roadmapAnalysis.missing_skills.map((s: string, idx: number) => (
                                <Tag key={idx} color="error" className="px-3 py-1 text-xs font-bold border border-red-200/50 rounded-lg">
                                  {s}
                                </Tag>
                              ))}
                            </div>
                          ) : (
                            <p className="text-slate-400 text-xs">No missing skills detected! Profile matches benchmark targets.</p>
                          )}
                        </Card>

                        {/* Matched Skills */}
                        <Card title={<span className="text-emerald-600 flex items-center gap-2"><CheckCircle2 size={16} /> Retained Skill Capital</span>} className="light-panel rounded-2xl border-[#e2e8f0]/60">
                          {roadmapAnalysis.matched_skills?.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {roadmapAnalysis.matched_skills.map((s: string, idx: number) => (
                                <Tag key={idx} color="success" className="px-3 py-1 text-xs font-bold border border-emerald-200/50 rounded-lg">
                                  {s}
                                </Tag>
                              ))}
                            </div>
                          ) : (
                            <p className="text-slate-400 text-xs">No matched skills. Try typing different skillsets.</p>
                          )}
                        </Card>

                        {/* Resources */}
                        <Card title="Learning Curriculums & Blueprints" className="light-panel rounded-2xl border-[#e2e8f0]/60">
                          <div className="flex flex-col">
                            {(roadmapAnalysis.learning_resources || []).map((res: any, idx: number, arr: any[]) => (
                              <div key={idx} className={`py-4 ${idx !== arr.length - 1 ? "border-b border-slate-100" : ""}`}>
                                <div className="flex justify-between items-center w-full">
                                  <div>
                                    <Tag color="processing" className="mb-2 font-bold text-xs">{res.skill}</Tag>
                                    <h5 className="font-bold text-slate-800 text-sm mt-1">{res.platform}</h5>
                                  </div>
                                  <a
                                    href={res.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-150 font-bold px-4 py-2 rounded-xl text-xs transition-all"
                                  >
                                    Access Syllabus
                                  </a>
                                </div>
                              </div>
                            ))}
                          </div>
                        </Card>

                        <Card title="Structured Learning Curriculum" className="light-panel rounded-2xl border-[#e2e8f0]/60 mt-6">
                          <div className="space-y-4">
                            <p className="text-xs text-slate-500">
                              Generate an interactive 30/60/90-day learning curriculum tailored specifically to your missing skills using LLM analysis.
                            </p>
                            <Button
                              type="primary"
                              onClick={handleGenerateStructuredRoadmap}
                              loading={roadmapGenerating}
                              className="bg-indigo-600 hover:bg-indigo-500 border-none rounded-xl font-bold"
                            >
                              Generate Structured Roadmap (30/60/90 Days)
                            </Button>
                            
                            {structuredRoadmap && (
                              <div className="mt-6 border-t border-slate-100 pt-4 space-y-4 text-left">
                                <div className="bg-[#EEF2FF] border border-[#C7D2FE]/60 p-4 rounded-2xl">
                                  <h4 className="text-indigo-950 font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                    <Sparkles size={14} className="text-indigo-600" /> AI Career Mentor Output
                                  </h4>
                                  <p className="text-indigo-900 text-xs font-semibold">
                                    Learning Roadmap for {structuredRoadmap.target_role}
                                  </p>
                                </div>
                                <div className="bg-slate-50 border border-slate-200/50 p-5 rounded-2xl font-sans text-xs text-slate-800 leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto">
                                  {structuredRoadmap.roadmap}
                                </div>
                              </div>
                            )}
                          </div>
                        </Card>
                      </div>

                      <Card title="Readiness Blueprint" className="light-panel rounded-2xl text-center h-fit border-[#e2e8f0]/60">
                        <span className="text-xs text-[#64748B] uppercase block mb-1">Fit Index Score</span>
                        <div className="text-5xl font-black text-indigo-600 my-4">{roadmapAnalysis.score}%</div>
                        <div className="border-t border-slate-100 pt-4 text-left space-y-3 text-xs text-slate-600">
                          <div className="flex justify-between">
                            <span>Study Period:</span>
                            <span className="text-slate-800 font-bold">{roadmapAnalysis.estimated_timeline}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Recruiter targets:</span>
                            <span className="text-slate-800 font-bold truncate max-w-[140px]">{roadmapAnalysis.kerala_companies?.join(", ")}</span>
                          </div>
                        </div>
                      </Card>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Opportunities */}
              {activeTab === "opportunities" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Technopark & Infopark Matches</h3>
                    <p className="text-xs text-[#64748B] mt-1">Real-time matching scores against currently scraped roles</p>
                  </div>

                  <div className="flex bg-[#F1F5F9] border border-slate-200/60 rounded-xl p-1 mb-6 w-fit">
                    <button
                      onClick={() => setOppsTabType("keyword")}
                      className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        oppsTabType === "keyword"
                          ? "bg-white text-indigo-600 shadow-sm"
                          : "text-[#64748B] hover:text-[#0f172a]"
                      }`}
                    >
                      Scraped Vacancies (Keyword Match)
                    </button>
                    <button
                      onClick={() => setOppsTabType("semantic")}
                      className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        oppsTabType === "semantic"
                          ? "bg-white text-indigo-600 shadow-sm"
                          : "text-[#64748B] hover:text-[#0f172a]"
                      }`}
                    >
                      AI Semantic Recommendations (Embeddings)
                    </button>
                  </div>

                  {oppsTabType === "keyword" ? (
                    <Table
                      dataSource={jobs}
                      rowKey="id"
                      pagination={{ pageSize: 8 }}
                      className="custom-table"
                      columns={[
                        {
                          title: "Position Title",
                          dataIndex: "title",
                          key: "title",
                          render: (text) => <span className="font-bold text-slate-800">{text}</span>
                        },
                        {
                          title: "Company",
                          dataIndex: "company",
                          key: "company"
                        },
                        {
                          title: "Location",
                          dataIndex: "location",
                          key: "location"
                        },
                        {
                          title: "Salary Index",
                          dataIndex: "salary",
                          key: "salary"
                        },
                        {
                          title: "Keywords Matched",
                          dataIndex: "skills",
                          key: "skills",
                          render: (skills) => (
                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                              {skills.slice(0, 3).map((s: string, idx: number) => <Tag color="default" className="text-[10px]" key={idx}>{s}</Tag>)}
                            </div>
                          )
                        },
                        {
                          title: "Hiring Score",
                          dataIndex: "match_percent",
                          key: "match_percent",
                          sorter: (a, b) => a.match_percent - b.match_percent,
                          render: (pct) => (
                            <Tag color={pct > 70 ? "success" : pct > 40 ? "warning" : "error"} className="font-black text-xs">
                              {pct}% Match
                            </Tag>
                          )
                        },
                        {
                          title: "Action",
                          key: "action",
                          render: (_, record) => (
                            <a
                              href={record.url}
                              target="_blank"
                              rel="noreferrer"
                              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-all block text-center"
                            >
                              Apply
                            </a>
                          )
                        }
                      ]}
                    />
                  ) : (
                    <Table
                      dataSource={semanticRecommendations}
                      loading={semanticLoading}
                      rowKey="job_id"
                      pagination={{ pageSize: 8 }}
                      className="custom-table"
                      columns={[
                        {
                          title: "Position Title",
                          dataIndex: "title",
                          key: "title",
                          render: (text) => <span className="font-bold text-slate-800">{text}</span>
                        },
                        {
                          title: "Company",
                          dataIndex: "company",
                          key: "company"
                        },
                        {
                          title: "Location",
                          dataIndex: "location",
                          key: "location"
                        },
                        {
                          title: "AI Semantic Match",
                          dataIndex: "match_percent",
                          key: "match_percent",
                          sorter: (a, b) => a.match_percent - b.match_percent,
                          render: (pct) => (
                            <Tag color={pct > 75 ? "success" : pct > 50 ? "warning" : "error"} className="font-black text-xs">
                              {pct}% Semantic Match
                            </Tag>
                          )
                        },
                        {
                          title: "Action",
                          key: "action",
                          render: (_, record) => (
                            <a
                              href={`https://google.com/search?q=${encodeURIComponent(record.title + ' ' + record.company + ' job')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-all block text-center"
                            >
                              Search Job
                            </a>
                          )
                        }
                      ]}
                    />
                  )}
                </div>
              )}

              {/* Tab 4: Quiz Hub */}
              {activeTab === "quiz" && (
                <div className="space-y-6">
                  {!quizActive && !quizResult && (
                    <Card title="Skill assessment Quizzes" className="light-panel rounded-[24px] border-[#e2e8f0]/60">
                      <div className="max-w-md mx-auto space-y-4 py-8">
                        <span className="text-xs text-[#64748B] block font-semibold">Select Target Topic</span>
                        <Select
                          value={selectedQuizTopic}
                          onChange={(val) => setSelectedQuizTopic(val)}
                          placeholder="Select Topic to Start"
                          className="w-full"
                          size="large"
                          options={quizTopics.map((t) => ({ value: t, label: t }))}
                        />
                        <Button
                          type="primary"
                          onClick={() => loadQuizQuestions(selectedQuizTopic)}
                          disabled={!selectedQuizTopic}
                          size="large"
                          className="w-full bg-indigo-600 hover:bg-indigo-500 border-none rounded-xl"
                        >
                          Start Test Loop
                        </Button>
                      </div>
                    </Card>
                  )}

                  {quizActive && quizQuestions.length > 0 && (
                    <Card
                      title={`Assessment Loop: ${selectedQuizTopic} (${currentQuizIndex + 1}/${quizQuestions.length})`}
                      className="light-panel rounded-[24px] border-[#e2e8f0]/60"
                    >
                      <div className="space-y-6 py-4">
                        <h4 className="text-lg font-bold text-slate-800 leading-relaxed">
                          {quizQuestions[currentQuizIndex].question}
                        </h4>

                        <div className="grid grid-cols-1 gap-3">
                          {quizQuestions[currentQuizIndex].options.map((option: string, idx: number) => {
                            const isSelected = quizAnswers[quizQuestions[currentQuizIndex].id.toString()] === idx;
                            return (
                              <button
                                key={idx}
                                onClick={() => handleSelectAnswer(quizQuestions[currentQuizIndex].id, idx)}
                                className={`text-left p-4 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100/50"
                                    : "bg-[#F8FAFC] border-slate-200 text-slate-800 hover:bg-slate-100"
                                }`}
                              >
                                {option}
                              </button>
                            );
                          })}
                        </div>

                        <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-6">
                          <Button
                            disabled={currentQuizIndex === 0}
                            onClick={() => setCurrentQuizIndex((i) => i - 1)}
                            className="bg-white border-slate-200 text-slate-800 rounded-xl"
                          >
                            Previous
                          </Button>

                          {currentQuizIndex < quizQuestions.length - 1 ? (
                            <Button
                              type="primary"
                              disabled={quizAnswers[quizQuestions[currentQuizIndex].id.toString()] === undefined}
                              onClick={() => setCurrentQuizIndex((i) => i + 1)}
                              className="bg-indigo-600 hover:bg-indigo-500 border-none rounded-xl"
                            >
                              Next Question
                            </Button>
                          ) : (
                            <Button
                              type="primary"
                              loading={quizSubmitting}
                              disabled={Object.keys(quizAnswers).length < quizQuestions.length}
                              onClick={submitQuiz}
                              className="bg-emerald-600 hover:bg-emerald-500 border-none rounded-xl"
                            >
                              Submit Quiz
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  )}

                  {quizResult && (
                    <Card title="Assessment Report" className="light-panel rounded-[24px] text-center border-[#e2e8f0]/60">
                      <div className="max-w-xl mx-auto py-6 space-y-6">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Quiz Result Status</span>
                          <span className="text-5xl font-black text-indigo-600 mt-2 block">{quizResult.score}%</span>
                          <Tag color="indigo" className="mt-2 text-xs px-3 py-1 font-bold rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-700">
                            Grade: {quizResult.grade}
                          </Tag>
                        </div>

                        <p className="text-slate-600 text-xs">
                          Answered {quizResult.correct} questions correct out of {quizResult.total}. Your overall profile rank has been synced.
                        </p>

                        <div className="text-left space-y-3">
                          <h5 className="font-bold text-slate-800 text-sm mb-2">Question Breakdown</h5>
                          {quizResult.results?.map((res: any, idx: number) => (
                            <div key={idx} className="bg-[#F8FAFC] border border-slate-100 rounded-xl p-3 flex justify-between items-start gap-4">
                              <div>
                                <p className="font-semibold text-slate-800 text-xs leading-normal">{res.question}</p>
                                <div className="flex gap-4 mt-1.5 text-[10px]">
                                  <span className="text-[#64748B]">Chosen: <strong className="text-slate-700">{res.your_answer}</strong></span>
                                  <span className="text-[#64748B]">Correct: <strong className="text-indigo-600">{res.correct_answer}</strong></span>
                                </div>
                              </div>
                              <Tag color={res.is_correct ? "success" : "error"} className="text-[10px] font-bold shrink-0">
                                {res.is_correct ? "Correct" : "Wrong"}
                              </Tag>
                            </div>
                          ))}
                        </div>

                        <Button
                          type="primary"
                          onClick={() => {
                            setQuizResult(null);
                            setSelectedQuizTopic("");
                          }}
                          className="bg-indigo-600 hover:bg-indigo-500 border-none rounded-xl"
                        >
                          Finish & Return
                        </Button>
                      </div>
                    </Card>
                  )}
                </div>
              )}

              {/* Tab 5: DSA Practice */}
              {activeTab === "dsa" && (
                <div className="space-y-8">
                  <Card title="LeetCode Sync Workspace" className="light-panel rounded-[24px] border-[#e2e8f0]/60">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <span className="text-xs text-[#64748B] font-semibold block mb-2">Select Study Track</span>
                        <Select
                          value={selectedDsaTrack}
                          onChange={selectDsaTrack}
                          className="w-full"
                          size="large"
                          options={dsaTracks.map((tr) => ({ value: tr, label: tr }))}
                        />
                      </div>

                      <div>
                        <span className="text-xs text-[#64748B] font-semibold block mb-2">Choose Topic Module</span>
                        <Select
                          value={selectedDsaTopic}
                          onChange={(val) => setSelectedDsaTopic(val)}
                          disabled={!selectedDsaTrack}
                          className="w-full"
                          size="large"
                          options={dsaTopics.map((tp) => ({ value: tp, label: tp }))}
                        />
                      </div>
                    </div>

                    <Button
                      type="primary"
                      onClick={loadDsaProblem}
                      disabled={!selectedDsaTopic}
                      loading={dsaLoading}
                      size="large"
                      className="w-full bg-indigo-600 hover:bg-indigo-500 border-none rounded-xl font-bold mt-6 shadow-md shadow-indigo-100/50"
                    >
                      Retrieve AI Coding Challenge
                    </Button>
                  </Card>

                  {dsaProblem && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2 space-y-6">
                        <Card title="Problem Statement" className="light-panel rounded-2xl border-[#e2e8f0]/60">
                          <p className="text-slate-700 text-xs leading-relaxed whitespace-pre-line">
                            {dsaProblem.problem}
                          </p>
                        </Card>

                        <Card title="Code Editor Sandbox" className="light-panel rounded-2xl border-[#e2e8f0]/60">
                          <Input.TextArea
                            rows={12}
                            value={studentCode}
                            onChange={(e) => setStudentCode(e.target.value)}
                            className="font-mono bg-slate-950 text-emerald-450 border-slate-800 focus:border-indigo-500 rounded-xl text-xs"
                          />
                          <div className="flex gap-3 justify-end mt-4">
                            <Button
                              onClick={() => requestDsaHint(1)}
                              loading={hintLoading && hintLevel === 1}
                              className="bg-white border-slate-200 text-slate-800 rounded-xl text-xs font-semibold"
                            >
                              Small Hint
                            </Button>
                            <Button
                              onClick={() => requestDsaHint(2)}
                              loading={hintLoading && hintLevel === 2}
                              className="bg-white border-slate-200 text-slate-800 rounded-xl text-xs font-semibold"
                            >
                              Explain Approach
                            </Button>
                            <Button
                              onClick={() => requestDsaHint(3)}
                              loading={hintLoading && hintLevel === 3}
                              className="bg-indigo-600 hover:bg-indigo-500 border-none rounded-xl text-xs font-semibold"
                            >
                              Show Solution
                            </Button>
                          </div>
                        </Card>
                      </div>

                      <div className="space-y-6">
                        {hintResult && (
                          <Card title={`AI Mentor hint (Level ${hintResult.hint_level})`} className="light-panel border-indigo-150 bg-indigo-50/20 rounded-2xl">
                            <p className="text-slate-700 text-xs leading-relaxed whitespace-pre-line">
                              {hintResult.hint}
                            </p>
                          </Card>
                        )}

                        <Card title="Sync Log History" className="light-panel rounded-2xl border-[#e2e8f0]/60">
                          <div className="flex flex-col">
                            {dsaHistory.map((h: any, idx: number, arr: any[]) => (
                              <div key={idx} className={`py-3 ${idx !== arr.length - 1 ? "border-b border-slate-100" : ""}`}>
                                <div className="flex justify-between items-center w-full text-xs">
                                  <div>
                                    <span className="font-bold text-slate-800 block">{h.topic}</span>
                                    <span className="text-[#64748B] block mt-0.5">{h.track}</span>
                                  </div>
                                  <Tag color="indigo">Hint Lvl {h.hint_level}</Tag>
                                </div>
                              </div>
                            ))}
                          </div>
                        </Card>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 6: Resume Scanner */}
              {activeTab === "resume" && (
                <div className="space-y-8">
                  <Card title="Technopark Keyword Parser" className="light-panel rounded-[24px] border-[#e2e8f0]/60">
                    <form onSubmit={handleResumeScan} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <span className="text-xs text-[#64748B] font-semibold block mb-2">Target Benchmark Role</span>
                          <Select
                            value={resumeRole}
                            onChange={(val) => setResumeRole(val)}
                            className="w-full"
                            size="large"
                            options={ROLES_LIST.map((r) => ({ value: r, label: r }))}
                          />
                        </div>

                        <div>
                          <span className="text-xs text-[#64748B] font-semibold block mb-2">Upload Resume file (.pdf, .docx)</span>
                          <Upload
                            beforeUpload={(file) => {
                              setResumeFile(file);
                              return false;
                            }}
                            maxCount={1}
                            onRemove={() => setResumeFile(null)}
                            className="w-full block"
                          >
                            <Button size="large" icon={<UploadCloud size={16} />} className="w-full bg-[#F8FAFC] border-slate-200 text-slate-800 rounded-xl text-left">
                              Select PDF / DOCX
                            </Button>
                          </Upload>
                        </div>
                      </div>

                      <Button
                        type="primary"
                        htmlType="submit"
                        disabled={!resumeFile}
                        loading={resumeScanning}
                        size="large"
                        className="w-full bg-indigo-600 hover:bg-indigo-500 border-none rounded-xl font-bold mt-2"
                      >
                        {resumeScanning ? "Uploading & Analysing..." : "Process CV Scanning"}
                      </Button>
                    </form>
                  </Card>

                  {resumeScanResult && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2 space-y-6">
                        <Card title="Extracted Profile Keywords" className="light-panel rounded-2xl border-[#e2e8f0]/60">
                          <div className="flex flex-wrap gap-2">
                            {resumeScanResult.extracted_skills?.map((sk: string, idx: number) => (
                              <Tag color="indigo" key={idx} className="font-bold text-xs uppercase px-2 py-0.5 border border-indigo-200 bg-indigo-50 text-indigo-700 rounded-md">
                                {sk}
                              </Tag>
                            ))}
                          </div>
                        </Card>

                        <Card title="Mock recruiter assessments" className="light-panel rounded-2xl border-[#e2e8f0]/60">
                          <p className="text-slate-700 text-xs leading-relaxed whitespace-pre-line">
                            {resumeScanResult.ai_feedback}
                          </p>
                        </Card>
                      </div>

                      <Card title="Scanner Report" className="light-panel rounded-2xl text-center h-fit border-[#e2e8f0]/60">
                        <span className="text-xs text-[#64748B] block mb-1">Semantic Match Ratio</span>
                        <div className="text-5xl font-black text-indigo-600 my-4">
                          {resumeScanResult.match_result?.match_percent}%
                        </div>
                        <div className="border-t border-slate-100 pt-4 text-left space-y-3 text-xs text-slate-600">
                          <div className="flex justify-between">
                            <span>Keywords Found:</span>
                            <span className="text-emerald-600 font-bold">{resumeScanResult.match_result?.matched_skills?.length || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Key Gaps:</span>
                            <span className="text-red-500 font-bold truncate max-w-[130px]">{resumeScanResult.match_result?.missing_skills?.join(", ") || 0}</span>
                          </div>
                        </div>
                      </Card>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 7: Video Interview */}
              {activeTab === "interview" && (
                <div className="space-y-8">
                  <Card title="Video Interview loop setup" className="light-panel rounded-[24px] border-[#e2e8f0]/60">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                      <div>
                        <span className="text-xs text-[#64748B] font-semibold block mb-2">Target Interview role</span>
                        <Select
                          value={interviewRole}
                          onChange={(val) => setInterviewRole(val)}
                          className="w-full font-sans text-slate-800"
                          size="large"
                          options={ROLES_LIST.map((r) => ({ value: r, label: r }))}
                        />
                      </div>
                      <Button
                        type="primary"
                        onClick={loadInterviewQuestions}
                        loading={interviewLoading}
                        size="large"
                        className="w-full bg-indigo-600 hover:bg-indigo-500 border-none rounded-xl"
                      >
                        Generate Mock Loop Question
                      </Button>
                    </div>
                  </Card>

                  {activeQuestion && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2 space-y-6">
                        <Card title="Active Interview Loop question" className="light-panel border-indigo-150 bg-indigo-50/20 rounded-2xl">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <Tag color="indigo" className="mb-2 uppercase text-[10px] font-black">{activeQuestion.topic}</Tag>
                              <h4 className="text-md font-bold text-slate-800 leading-relaxed">{activeQuestion.question}</h4>
                            </div>
                            <Tag color="warning" className="uppercase text-[10px] font-black shrink-0">{activeQuestion.difficulty}</Tag>
                          </div>
                        </Card>

                        {/* Webcam Preview Screen */}
                        <Card title="Interactive Recorder loop" className="light-panel rounded-2xl overflow-hidden relative border-[#e2e8f0]/60">
                          <div className="w-full aspect-video bg-slate-950 border border-slate-850 rounded-xl relative overflow-hidden flex items-center justify-center">
                            {mediaStream ? (
                              <video ref={videoPreviewRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-gray-500 text-xs">Video Feed Inactive</span>
                            )}
                            {isRecording && (
                              <div className="absolute top-4 left-4 bg-red-600/90 border border-red-500 text-white font-bold text-xs px-3 py-1 rounded-xl flex items-center gap-2 animate-pulse">
                                <span className="w-2 h-2 bg-white rounded-full" /> REC {recordingSeconds}s
                              </div>
                            )}
                          </div>

                          <div className="flex justify-between items-center mt-4">
                            {!isRecording ? (
                              <Button
                                type="primary"
                                danger
                                icon={<Play size={14} />}
                                onClick={startRecording}
                                className="bg-red-600 hover:bg-red-500 border-none rounded-xl text-xs font-semibold cursor-pointer"
                              >
                                Start Response loop
                              </Button>
                            ) : (
                              <Button
                                type="primary"
                                onClick={stopRecording}
                                className="bg-white border-slate-200 text-slate-850 rounded-xl text-xs font-semibold cursor-pointer"
                              >
                                Stop response recording
                              </Button>
                            )}

                            {/* Demo file selector */}
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-[#64748B]">Or simulate file upload:</span>
                              <Upload
                                beforeUpload={(file) => {
                                  setMockVideoFile(file);
                                  return false;
                                }}
                                maxCount={1}
                                onRemove={() => setMockVideoFile(null)}
                              >
                                <Button size="small" className="text-xs bg-[#F8FAFC] border-slate-200 text-slate-800 rounded-lg">Select MP4</Button>
                              </Upload>
                            </div>
                          </div>

                          <Button
                            type="primary"
                            disabled={isRecording}
                            loading={interviewSubmitting}
                            onClick={handleInterviewUpload}
                            size="large"
                            className="w-full bg-emerald-600 hover:bg-emerald-500 border-none rounded-xl font-bold mt-6 cursor-pointer"
                          >
                            Upload Response for AI assessment
                          </Button>
                        </Card>
                      </div>

                      <div className="space-y-6">
                        {interviewResult && (
                          <>
                            <Card title="Assessment Scorecard" className="light-panel rounded-2xl text-center border-[#e2e8f0]/60">
                              <span className="text-xs text-[#64748B] block mb-1">Feedback Score</span>
                              <span className="text-5xl font-black text-emerald-600 my-4 block">{interviewResult.overall_score}/100</span>
                              <div className="border-t border-slate-100 pt-4 text-left space-y-3 text-xs text-slate-600">
                                <div className="flex justify-between">
                                  <span>Eye Contact Ratio:</span>
                                  <span className="text-slate-800 font-bold">{interviewResult.video_analysis?.eye_contact_percent}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Posture Index:</span>
                                  <span className="text-slate-800 font-bold">{interviewResult.video_analysis?.posture_score}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Filler rate:</span>
                                  <span className="text-slate-800 font-bold">{interviewResult.filler_analysis?.filler_rate}%</span>
                                </div>
                              </div>
                            </Card>

                            <Card title="Transcribed Response" className="light-panel rounded-2xl text-xs max-h-[220px] overflow-y-auto border-[#e2e8f0]/60">
                              <p className="text-slate-700 leading-normal italic">
                                "{interviewResult.transcript || "No transcript compiled"}"
                              </p>
                            </Card>

                            <Card title="AI critique assessment" className="light-panel rounded-2xl text-xs max-h-[350px] overflow-y-auto border-[#e2e8f0]/60">
                              <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                                {interviewResult.answer_feedback}
                              </p>
                            </Card>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 8: Tech Market Trends */}
              {activeTab === "trends" && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center bg-white border border-slate-200/60 p-6 rounded-[24px]">
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                        <TrendingUp className="text-indigo-600 w-6 h-6" /> Kerala AI Tech Market Trends Tracker
                      </h3>
                      <p className="text-xs text-[#64748B] mt-1">
                        Real-time market analytics from HackerNews, GitHub, and PyPI downloads, with custom AI recommendations.
                        {trendsData?.last_updated && (
                          <span className="text-[10px] text-slate-450 block mt-1 font-mono">
                            Last Updated: {new Date(trendsData.last_updated).toLocaleString()}
                          </span>
                        )}
                      </p>
                    </div>
                    <Button
                      type="primary"
                      onClick={handleRefreshTrends}
                      loading={trendsRefreshing || trendsLoading}
                      icon={<Cpu size={14} className={trendsRefreshing ? "animate-spin" : ""} />}
                      className="bg-indigo-600 hover:bg-indigo-500 border-none font-bold rounded-xl h-10 px-5 shadow-lg shadow-indigo-600/20 cursor-pointer"
                    >
                      Refresh Trends Feed
                    </Button>
                  </div>

                  {trendsLoading && (
                    <div className="min-h-[40vh] flex flex-col items-center justify-center">
                      <Skeleton active paragraph={{ rows: 6 }} className="w-full bg-white p-6 rounded-3xl" />
                    </div>
                  )}

                  {!trendsLoading && trendsData && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
                      {/* Left Column: AI Trend Analysis */}
                      <div className="lg:col-span-2 space-y-6">
                        <Card title={<span className="text-slate-800 font-extrabold text-sm flex items-center gap-1.5"><Sparkles size={16} className="text-indigo-500" /> AI Market Analysis & Recommendations</span>} className="light-panel rounded-[24px] border-[#e2e8f0]/60">
                          <div className="text-slate-800 text-xs leading-relaxed whitespace-pre-line bg-slate-50 border border-slate-200/50 p-6 rounded-2xl max-h-[700px] overflow-y-auto font-sans">
                            {trendsData.ai_analysis}
                          </div>
                        </Card>
                      </div>

                      {/* Right Column: Metrics & Demand lists */}
                      <div className="space-y-6">
                        {/* HackerNews hiring skills */}
                        <Card title={<span className="text-slate-800 font-extrabold text-sm flex items-center gap-1.5"><Flame size={16} className="text-amber-500" /> Hiring Demand Trend</span>} className="light-panel rounded-2xl border-[#e2e8f0]/60">
                          <div className="flex flex-col gap-3">
                            {trendsData.skill_demand?.map((s: any, idx: number) => (
                              <div key={idx} className="flex justify-between items-center bg-[#F8FAFC] border border-slate-100 p-2.5 rounded-xl text-xs">
                                <div>
                                  <span className="font-bold text-slate-800 block">{s.skill}</span>
                                  <span className="text-[10px] text-slate-400 block mt-0.5">{s.mentions} mentions</span>
                                </div>
                                <Tag color={s.trend?.includes("hot") ? "error" : "success"} className="font-bold text-[10px] border-none px-2.5 py-0.5">
                                  {s.trend}
                                </Tag>
                              </div>
                            ))}
                          </div>
                        </Card>

                        {/* GitHub trending repos */}
                        <Card title={<span className="text-slate-800 font-extrabold text-sm flex items-center gap-1.5"><Code size={16} className="text-indigo-500" /> Trending GitHub Projects</span>} className="light-panel rounded-2xl border-[#e2e8f0]/60">
                          <div className="flex flex-col gap-3">
                            {trendsData.github_trending?.map((r: any, idx: number) => (
                              <div key={idx} className="bg-[#F8FAFC] border border-slate-100 p-3 rounded-xl text-xs space-y-1.5">
                                <div className="flex justify-between items-start gap-2">
                                  <a href={r.url} target="_blank" rel="noreferrer" className="font-bold text-indigo-650 hover:underline truncate block">
                                    {r.name}
                                  </a>
                                  <Tag color="purple" className="text-[9px] font-bold border-none bg-purple-50 text-purple-650 shrink-0">
                                    ★ {r.stars.toLocaleString()}
                                  </Tag>
                                </div>
                                <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{r.description}</p>
                                <span className="text-[9px] text-[#64748B] font-semibold bg-slate-100 px-2 py-0.5 rounded-md">
                                  {r.language}
                                </span>
                              </div>
                            ))}
                          </div>
                        </Card>

                        {/* PyPI Downloads */}
                        <Card title={<span className="text-slate-800 font-extrabold text-sm flex items-center gap-1.5"><BookOpen size={16} className="text-emerald-500" /> PyPI Package Downloads</span>} className="light-panel rounded-2xl border-[#e2e8f0]/60">
                          <div className="flex flex-col gap-3">
                            {trendsData.pypi_downloads?.map((p: any, idx: number) => (
                              <div key={idx} className="flex justify-between items-center bg-[#F8FAFC] border border-slate-100 p-2.5 rounded-xl text-xs">
                                <div>
                                  <span className="font-bold text-slate-800 block">{p.package}</span>
                                  <span className="text-[10px] text-slate-400 block mt-0.5">{p.monthly_downloads?.toLocaleString()} / mo</span>
                                </div>
                                <Tag color="processing" className="font-bold text-[10px] border-none px-2.5 py-0.5">
                                  {p.popularity}
                                </Tag>
                              </div>
                            ))}
                          </div>
                        </Card>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </Content>
      </Layout>
    </Layout>
  </ConfigProvider>
  );
}

// Simple custom component to prevent jsx warnings
function AvatarIcon({ children, className }: any) {
  return <div className={className}>{children}</div>;
}