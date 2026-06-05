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
  opportunitiesAPI
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
  App
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
  AlertCircle
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

  const ROLES_LIST = [
    "ML Engineer", "Data Scientist", "LLM Engineer", "GenAI Developer",
    "Backend Developer", "Full Stack Developer", "DevOps Engineer",
    "Computer Vision Engineer", "Prompt Engineer", "MLOps Engineer",
    "Data Analyst", "Android Developer", "Cloud Engineer", "Cybersecurity Analyst", "NLP Engineer"
  ];

  useEffect(() => {
    loadFromStorage();
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
      const [rankRes, jobsRes, oppsRes] = await Promise.all([
        leaderboardAPI.myRank(user.id),
        jobsAPI.matchJobs(user.id),
        opportunitiesAPI.match(user.id)
      ]);
      setRank(rankRes.data);
      setJobs(jobsRes.data.matched_jobs || []);
      setOpportunities(oppsRes.data.opportunities || []);
      if (rankRes.data?.score) {
        setReadinessScore(rankRes.data.score);
      }
    } catch (e) {
      console.error("Error loading profile stats", e);
    } finally {
      setStatsLoading(false);
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
          <h1 className="text-2xl font-black bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent flex items-center gap-2">
            ⚡ Vedha AI
          </h1>
          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-md font-semibold uppercase tracking-wider">
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
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/35"
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
          <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-600/30 flex items-center justify-center text-indigo-400 font-bold">
            🎓
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
      <Sider
        collapsible
        collapsed={sidebarCollapsed}
        onCollapse={(val) => setSidebarCollapsed(val)}
        width={260}
        trigger={null}
        className="hidden lg:block bg-gray-900/60 border-r border-white/10 shrink-0"
      >
        {sidebarContent}
      </Sider>

      {/* Drawer for Mobile Sider */}
      <Drawer
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
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
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden text-gray-400 hover:text-white cursor-pointer"
            >
              <Menu size={20} />
            </button>
            <div className="text-[10px] text-gray-400 font-semibold bg-white/[0.03] border border-white/5 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Cpu size={12} className="text-indigo-400 animate-pulse" /> Platform Connected
            </div>
          </div>

          <div className="flex items-center gap-4 text-right">
            <div className="hidden sm:block">
              <span className="text-[10px] text-gray-500 block uppercase">Goal Stack:</span>
              <span className="text-xs text-white font-bold">{targetRole}</span>
            </div>
            <Badge dot status="success">
              <AvatarIcon className="w-8 h-8 rounded-full bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-bold text-xs uppercase">
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
                  {/* Banner */}
                  <Card className="glass-panel border-white/10 rounded-3xl relative overflow-hidden bg-gradient-to-r from-indigo-900/40 via-purple-950/20 to-indigo-950/40 glow-indigo">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
                    <div className="max-w-2xl space-y-4">
                      <Tag color="indigo" className="px-3 py-0.5 border border-indigo-500/20 rounded-full uppercase text-[10px] font-bold">
                        Kerala IT Market 2026 Ready
                      </Tag>
                      <h2 className="text-3xl font-extrabold text-white tracking-tight">
                        Hi, {user.name}! Step up your profile compatibility for <span className="text-indigo-400">{targetRole}</span>
                      </h2>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        Verify your skills gap matrix, attempts coding quizzes to top the leaderboard, or receive real-time posture assessments for recruiter loops.
                      </p>
                      <div className="flex flex-wrap gap-3 pt-2">
                        <Button
                          type="primary"
                          icon={<Compass size={14} />}
                          onClick={() => handleTabChange("roadmap")}
                          className="bg-indigo-600 hover:bg-indigo-500 border-none font-bold rounded-xl cursor-pointer"
                        >
                          Check Skill Gap
                        </Button>
                        <Button
                          icon={<MessageSquare size={14} />}
                          onClick={() => handleTabChange("chat")}
                          className="bg-white/5 border-white/10 hover:border-indigo-500 text-white rounded-xl cursor-pointer"
                        >
                          Chat AI Mentor
                        </Button>
                      </div>
                    </div>
                  </Card>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="glass-panel bg-white/5 border-white/10 rounded-2xl flex items-center">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                          <Award size={24} />
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 uppercase font-semibold">Leaderboard Rank</span>
                          <h3 className="text-xl font-extrabold mt-1 text-white">#{rank ? rank.rank : "—"}</h3>
                        </div>
                      </div>
                    </Card>

                    <Card className="glass-panel bg-white/5 border-white/10 rounded-2xl flex items-center">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                          <Briefcase size={24} />
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 uppercase font-semibold">Matched Roles</span>
                          <h3 className="text-xl font-extrabold mt-1 text-white">{jobs.length} Positions</h3>
                        </div>
                      </div>
                    </Card>

                    <Card className="glass-panel bg-white/5 border-white/10 rounded-2xl flex items-center">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                          <Sparkles size={24} />
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 uppercase font-semibold">Quiz Score</span>
                          <h3 className="text-xl font-extrabold mt-1 text-white">{rank ? `${rank.score}%` : "—"}</h3>
                        </div>
                      </div>
                    </Card>

                    <Card className="glass-panel bg-white/5 border-white/10 rounded-2xl flex items-center">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                          <Code size={24} />
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 uppercase font-semibold">Career Readiness</span>
                          <h3 className="text-xl font-extrabold mt-1 text-white">{readinessScore}%</h3>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Dual Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Circle readiness */}
                    <Card title="Target Role Readiness" className="glass-panel bg-white/5 border-white/10 rounded-3xl text-center flex flex-col justify-center items-center">
                      <div className="py-6 flex flex-col items-center">
                        <Progress
                          type="circle"
                          percent={readinessScore}
                          strokeColor={{ "0%": "#6366f1", "100%": "#8b5cf6" }}
                          railColor="rgba(255,255,255,0.05)"
                          size={150}
                          format={(percent) => <span className="text-white font-black text-2xl">{percent}%</span>}
                        />
                        <p className="text-gray-300 text-xs mt-6 leading-relaxed max-w-[240px] mx-auto">
                          Calculated comparing your registered skills against the active recruiters goal targets.
                        </p>
                      </div>
                    </Card>

                    {/* Quick navigation actions */}
                    <Card title="Recommended Upskilling Tracks" className="glass-panel bg-white/5 border-white/10 rounded-3xl lg:col-span-2">
                      <div className="flex flex-col">
                        {[
                          {
                            title: "Verify Skill Gap & Blueprint Map",
                            desc: "Analyse missing libraries against local company hiring standards.",
                            icon: Compass,
                            tab: "roadmap"
                          },
                          {
                            title: "Launch Interactive Mock Video Loops",
                            desc: "Evaluate postural alignment, eye contact ratios, and filler words.",
                            icon: Video,
                            tab: "interview"
                          },
                          {
                            title: "Upload & Verify Resume PDFs",
                            desc: "Parse file keywords to match against Technopark filters.",
                            icon: FileText,
                            tab: "resume"
                          }
                        ].map((item, idx, arr) => (
                          <div
                            key={item.title}
                            className={`flex items-center justify-between hover:bg-white/[0.02] rounded-xl px-4 py-3.5 transition-all ${
                              idx !== arr.length - 1 ? "border-b border-white/5" : ""
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                                <item.icon size={18} />
                              </div>
                              <div>
                                <span className="font-bold text-white text-sm block">{item.title}</span>
                                <span className="text-gray-400 text-xs block mt-0.5">{item.desc}</span>
                              </div>
                            </div>
                            <Button
                              type="text"
                              icon={<ChevronRight size={16} />}
                              onClick={() => handleTabChange(item.tab)}
                              className="text-gray-400 hover:text-white"
                            />
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {/* Tab 1: AI Coach */}
              {activeTab === "chat" && (
                <Card title="Vedha AI Career Coach" className="glass-panel bg-white/5 border-white/10 rounded-3xl h-[70vh] flex flex-col">
                  <div className="flex flex-col h-[52vh] justify-between">
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-4">
                      {chatHistory.length === 0 && (
                        <div className="text-center text-gray-500 py-12 max-w-md mx-auto space-y-4">
                          <div className="text-4xl">🤖</div>
                          <h4 className="font-bold text-white text-md">Welcome to AI Career Sync</h4>
                          <p className="text-xs">
                            Ask me about career switch advice, Python MLOps libraries, and salary benchmarks at UST, TCS, or Infopark.
                          </p>
                          <div className="flex justify-center gap-2 pt-2">
                            <Tag
                              className="cursor-pointer hover:bg-indigo-600 border-indigo-500/30"
                              onClick={() => setChatMsg("What skills do Kerala ML developers need?")}
                            >
                              ML Skills Info
                            </Tag>
                            <Tag
                              className="cursor-pointer hover:bg-indigo-600 border-indigo-500/30"
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
                              : "bg-white/5 border border-white/10 text-gray-100 rounded-bl-none"
                          }`}>
                            <p className="whitespace-pre-line">{msg.message}</p>
                          </div>
                        </div>
                      ))}
                      {chatLoading && (
                        <div className="flex items-center gap-2 text-xs text-indigo-400">
                          <Skeleton.Button active size="small" shape="round" />
                          <span>Searching Knowledge Base...</span>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    <div className="flex gap-3 border-t border-white/5 pt-4">
                      <Input
                        value={chatMsg}
                        onChange={(e) => setChatMsg(e.target.value)}
                        onPressEnter={sendChat}
                        placeholder="Ask about MLOps pipelines, local vacancies, or transition timelines..."
                        className="bg-white/5 border-white/10 text-white rounded-xl focus:border-indigo-500"
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
                  <Card title="Career Planner Sandbox" className="glass-panel bg-white/5 border-white/10 rounded-3xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <span className="text-xs text-gray-400 font-semibold block mb-2">Target Switch Role</span>
                        <Select
                          value={roadmapRole}
                          onChange={(val) => setRoadmapRole(val)}
                          className="w-full text-white"
                          size="large"
                          options={ROLES_LIST.map((r) => ({ value: r, label: r }))}
                        />
                      </div>

                      <div>
                        <span className="text-xs text-gray-400 font-semibold block mb-2">Current Technical Skills (Comma Separated)</span>
                        <Input
                          value={roadmapSkillsText}
                          onChange={(e) => setRoadmapSkillsText(e.target.value)}
                          placeholder="e.g., Python, SQL, REST APIs, Git"
                          size="large"
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </div>
                    </div>

                    <Button
                      type="primary"
                      onClick={handleRoadmapAnalysis}
                      loading={roadmapAnalysing}
                      size="large"
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 border-none rounded-xl font-bold mt-6 shadow-md shadow-indigo-600/25 cursor-pointer"
                    >
                      Analyze Skills Gap & Plan Roadmap
                    </Button>
                  </Card>

                  {roadmapAnalysis && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2 space-y-6">
                        {/* Missing Skills */}
                        <Card title={<span className="text-red-400 flex items-center gap-2"><AlertCircle size={16} /> Required Modules to Learn</span>} className="glass-panel bg-white/5 border-white/10 rounded-2xl">
                          {roadmapAnalysis.missing_skills?.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {roadmapAnalysis.missing_skills.map((s: string, idx: number) => (
                                <Tag key={idx} color="error" className="px-3 py-1 text-xs font-bold border border-red-500/20 rounded-lg">
                                  {s}
                                </Tag>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-400 text-xs">No missing skills detected! Profile matches benchmark targets.</p>
                          )}
                        </Card>

                        {/* Matched Skills */}
                        <Card title={<span className="text-emerald-400 flex items-center gap-2"><CheckCircle2 size={16} /> Retained Skill Capital</span>} className="glass-panel bg-white/5 border-white/10 rounded-2xl">
                          {roadmapAnalysis.matched_skills?.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {roadmapAnalysis.matched_skills.map((s: string, idx: number) => (
                                <Tag key={idx} color="success" className="px-3 py-1 text-xs font-bold border border-emerald-500/20 rounded-lg">
                                  {s}
                                </Tag>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-400 text-xs">No matched skills. Try typing different skillsets.</p>
                          )}
                        </Card>

                        {/* Resources */}
                        <Card title="Learning Curriculums & Blueprints" className="glass-panel bg-white/5 border-white/10 rounded-2xl">
                          <div className="flex flex-col">
                            {(roadmapAnalysis.learning_resources || []).map((res: any, idx: number, arr: any[]) => (
                              <div key={idx} className={`py-4 ${idx !== arr.length - 1 ? "border-b border-white/5" : ""}`}>
                                <div className="flex justify-between items-center w-full">
                                  <div>
                                    <Tag color="processing" className="mb-2 font-bold text-xs">{res.skill}</Tag>
                                    <h5 className="font-bold text-white text-sm mt-1">{res.platform}</h5>
                                  </div>
                                  <a
                                    href={res.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="bg-indigo-600/10 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/20 font-bold px-4 py-2 rounded-xl text-xs transition-all"
                                  >
                                    Access Syllabus
                                  </a>
                                </div>
                              </div>
                            ))}
                          </div>
                        </Card>
                      </div>

                      <Card title="Readiness Blueprint" className="glass-panel bg-white/5 border-white/10 rounded-2xl text-center h-fit">
                        <span className="text-xs text-gray-400 uppercase block mb-1">Fit Index Score</span>
                        <div className="text-5xl font-black text-indigo-400 my-4">{roadmapAnalysis.score}%</div>
                        <div className="border-t border-white/5 pt-4 text-left space-y-3 text-xs text-gray-300">
                          <div className="flex justify-between">
                            <span>Study Period:</span>
                            <span className="text-white font-bold">{roadmapAnalysis.estimated_timeline}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Recruiter targets:</span>
                            <span className="text-white font-bold truncate max-w-[140px]">{roadmapAnalysis.kerala_companies?.join(", ")}</span>
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
                    <h3 className="text-xl font-bold text-white">Technopark & Infopark Matches</h3>
                    <p className="text-xs text-gray-400 mt-1">Real-time matching scores against currently scraped roles</p>
                  </div>

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
                        render: (text) => <span className="font-bold text-white">{text}</span>
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
                </div>
              )}

              {/* Tab 4: Quiz Hub */}
              {activeTab === "quiz" && (
                <div className="space-y-6">
                  {!quizActive && !quizResult && (
                    <Card title="Skill assessment Quizzes" className="glass-panel bg-white/5 border-white/10 rounded-3xl">
                      <div className="max-w-md mx-auto space-y-4 py-8">
                        <span className="text-xs text-gray-400 block font-semibold">Select Target Topic</span>
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
                      className="glass-panel bg-white/5 border-white/10 rounded-3xl"
                    >
                      <div className="space-y-6 py-4">
                        <h4 className="text-lg font-bold text-white leading-relaxed">
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
                                    ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/10"
                                    : "bg-white/5 border-white/10 text-gray-200 hover:bg-white/10"
                                }`}
                              >
                                {option}
                              </button>
                            );
                          })}
                        </div>

                        <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-6">
                          <Button
                            disabled={currentQuizIndex === 0}
                            onClick={() => setCurrentQuizIndex((i) => i - 1)}
                            className="bg-white/5 border-white/10 text-white rounded-xl"
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
                    <Card title="Assessment Report" className="glass-panel bg-white/5 border-white/10 rounded-3xl text-center">
                      <div className="max-w-xl mx-auto py-6 space-y-6">
                        <div>
                          <span className="text-[10px] text-gray-500 uppercase font-semibold block">Quiz Result Status</span>
                          <span className="text-5xl font-black text-indigo-400 mt-2 block">{quizResult.score}%</span>
                          <Tag color="indigo" className="mt-2 text-xs px-3 py-1 font-bold rounded-lg border border-indigo-500/20">
                            Grade: {quizResult.grade}
                          </Tag>
                        </div>

                        <p className="text-gray-300 text-xs">
                          Answered {quizResult.correct} questions correct out of {quizResult.total}. Your overall profile rank has been synced.
                        </p>

                        <div className="text-left space-y-3">
                          <h5 className="font-bold text-white text-sm mb-2">Question Breakdown</h5>
                          {quizResult.results?.map((res: any, idx: number) => (
                            <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-3 flex justify-between items-start gap-4">
                              <div>
                                <p className="font-semibold text-white text-xs leading-normal">{res.question}</p>
                                <div className="flex gap-4 mt-1.5 text-[10px]">
                                  <span className="text-gray-400">Chosen: <strong className="text-gray-200">{res.your_answer}</strong></span>
                                  <span className="text-gray-400">Correct: <strong className="text-indigo-300">{res.correct_answer}</strong></span>
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
                  <Card title="LeetCode Sync Workspace" className="glass-panel bg-white/5 border-white/10 rounded-3xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <span className="text-xs text-gray-400 font-semibold block mb-2">Select Study Track</span>
                        <Select
                          value={selectedDsaTrack}
                          onChange={selectDsaTrack}
                          className="w-full"
                          size="large"
                          options={dsaTracks.map((tr) => ({ value: tr, label: tr }))}
                        />
                      </div>

                      <div>
                        <span className="text-xs text-gray-400 font-semibold block mb-2">Choose Topic Module</span>
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
                      className="w-full bg-indigo-600 hover:bg-indigo-500 border-none rounded-xl font-bold mt-6 shadow-md"
                    >
                      Retrieve AI Coding Challenge
                    </Button>
                  </Card>

                  {dsaProblem && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2 space-y-6">
                        <Card title="Problem Statement" className="glass-panel bg-white/5 border-white/10 rounded-2xl">
                          <p className="text-gray-300 text-xs leading-relaxed whitespace-pre-line">
                            {dsaProblem.problem}
                          </p>
                        </Card>

                        <Card title="Code Editor Sandbox" className="glass-panel bg-white/5 border-white/10 rounded-2xl">
                          <Input.TextArea
                            rows={12}
                            value={studentCode}
                            onChange={(e) => setStudentCode(e.target.value)}
                            className="font-mono bg-gray-950 text-emerald-400 border-white/10 focus:border-indigo-500 rounded-xl text-xs"
                          />
                          <div className="flex gap-3 justify-end mt-4">
                            <Button
                              onClick={() => requestDsaHint(1)}
                              loading={hintLoading && hintLevel === 1}
                              className="bg-white/5 border-white/10 text-white rounded-xl text-xs font-semibold"
                            >
                              Small Hint
                            </Button>
                            <Button
                              onClick={() => requestDsaHint(2)}
                              loading={hintLoading && hintLevel === 2}
                              className="bg-white/5 border-white/10 text-white rounded-xl text-xs font-semibold"
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
                          <Card title={`AI Mentor hint (Level ${hintResult.hint_level})`} className="glass-panel border-indigo-500/20 bg-indigo-950/10 rounded-2xl">
                            <p className="text-gray-300 text-xs leading-relaxed whitespace-pre-line">
                              {hintResult.hint}
                            </p>
                          </Card>
                        )}

                        <Card title="Sync Log History" className="glass-panel bg-white/5 border-white/10 rounded-2xl">
                          <div className="flex flex-col">
                            {dsaHistory.map((h: any, idx: number, arr: any[]) => (
                              <div key={idx} className={`py-3 ${idx !== arr.length - 1 ? "border-b border-white/5" : ""}`}>
                                <div className="flex justify-between items-center w-full text-xs">
                                  <div>
                                    <span className="font-bold text-white block">{h.topic}</span>
                                    <span className="text-gray-400 block mt-0.5">{h.track}</span>
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
                  <Card title="Technopark Keyword Parser" className="glass-panel bg-white/5 border-white/10 rounded-3xl">
                    <form onSubmit={handleResumeScan} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <span className="text-xs text-gray-400 font-semibold block mb-2">Target Benchmark Role</span>
                          <Select
                            value={resumeRole}
                            onChange={(val) => setResumeRole(val)}
                            className="w-full"
                            size="large"
                            options={ROLES_LIST.map((r) => ({ value: r, label: r }))}
                          />
                        </div>

                        <div>
                          <span className="text-xs text-gray-400 font-semibold block mb-2">Upload Resume file (.pdf, .docx)</span>
                          <Upload
                            beforeUpload={(file) => {
                              setResumeFile(file);
                              return false;
                            }}
                            maxCount={1}
                            onRemove={() => setResumeFile(null)}
                            className="w-full block"
                          >
                            <Button size="large" icon={<UploadCloud size={16} />} className="w-full bg-white/5 border-white/10 text-white rounded-xl text-left">
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
                        <Card title="Extracted Profile Keywords" className="glass-panel bg-white/5 border-white/10 rounded-2xl">
                          <div className="flex flex-wrap gap-2">
                            {resumeScanResult.extracted_skills?.map((sk: string, idx: number) => (
                              <Tag color="indigo" key={idx} className="font-bold text-xs uppercase px-2 py-0.5 border border-indigo-500/25 rounded-md">
                                {sk}
                              </Tag>
                            ))}
                          </div>
                        </Card>

                        <Card title="Mock recruiter assessments" className="glass-panel bg-white/5 border-white/10 rounded-2xl">
                          <p className="text-gray-300 text-xs leading-relaxed whitespace-pre-line">
                            {resumeScanResult.ai_feedback}
                          </p>
                        </Card>
                      </div>

                      <Card title="Scanner Report" className="glass-panel bg-white/5 border-white/10 rounded-2xl text-center h-fit">
                        <span className="text-xs text-gray-400 block mb-1">Semantic Match Ratio</span>
                        <div className="text-5xl font-black text-indigo-400 my-4">
                          {resumeScanResult.match_result?.match_percent}%
                        </div>
                        <div className="border-t border-white/5 pt-4 text-left space-y-3 text-xs text-gray-300">
                          <div className="flex justify-between">
                            <span>Keywords Found:</span>
                            <span className="text-emerald-400 font-bold">{resumeScanResult.match_result?.matched_skills?.length || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Key Gaps:</span>
                            <span className="text-red-400 font-bold truncate max-w-[130px]">{resumeScanResult.match_result?.missing_skills?.join(", ") || 0}</span>
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
                  <Card title="Video Interview loop setup" className="glass-panel bg-white/5 border-white/10 rounded-3xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                      <div>
                        <span className="text-xs text-gray-400 font-semibold block mb-2">Target Interview role</span>
                        <Select
                          value={interviewRole}
                          onChange={(val) => setInterviewRole(val)}
                          className="w-full font-sans"
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
                        <Card title="Active Interview Loop question" className="glass-panel border-indigo-500/20 bg-indigo-950/10 rounded-2xl">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <Tag color="indigo" className="mb-2 uppercase text-[10px] font-black">{activeQuestion.topic}</Tag>
                              <h4 className="text-md font-bold text-white leading-relaxed">{activeQuestion.question}</h4>
                            </div>
                            <Tag color="warning" className="uppercase text-[10px] font-black shrink-0">{activeQuestion.difficulty}</Tag>
                          </div>
                        </Card>

                        {/* Webcam Preview Screen */}
                        <Card title="Interactive Recorder loop" className="glass-panel bg-white/5 border-white/10 rounded-2xl overflow-hidden relative">
                          <div className="w-full aspect-video bg-gray-950 border border-white/10 rounded-xl relative overflow-hidden flex items-center justify-center">
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
                                className="bg-white/10 border-white/20 text-white rounded-xl text-xs font-semibold cursor-pointer"
                              >
                                Stop response recording
                              </Button>
                            )}

                            {/* Demo file selector */}
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-gray-500">Or simulate file upload:</span>
                              <Upload
                                beforeUpload={(file) => {
                                  setMockVideoFile(file);
                                  return false;
                                }}
                                maxCount={1}
                                onRemove={() => setMockVideoFile(null)}
                              >
                                <Button size="small" className="text-xs bg-white/5 border-white/10 text-white rounded-lg">Select MP4</Button>
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
                            <Card title="Assessment Scorecard" className="glass-panel bg-white/5 border-white/10 rounded-2xl text-center">
                              <span className="text-xs text-gray-400 block mb-1">Feedback Score</span>
                              <span className="text-5xl font-black text-emerald-400 my-4 block">{interviewResult.overall_score}/100</span>
                              <div className="border-t border-white/5 pt-4 text-left space-y-3 text-xs text-gray-300">
                                <div className="flex justify-between">
                                  <span>Eye Contact Ratio:</span>
                                  <span className="text-white font-bold">{interviewResult.video_analysis?.eye_contact_percent}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Posture Index:</span>
                                  <span className="text-white font-bold">{interviewResult.video_analysis?.posture_score}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Filler rate:</span>
                                  <span className="text-white font-bold">{interviewResult.filler_analysis?.filler_rate}%</span>
                                </div>
                              </div>
                            </Card>

                            <Card title="Transcribed Response" className="glass-panel bg-white/5 border-white/10 rounded-2xl text-xs max-h-[220px] overflow-y-auto">
                              <p className="text-gray-300 leading-normal italic">
                                "{interviewResult.transcript || "No transcript compiled"}"
                              </p>
                            </Card>

                            <Card title="AI critique assessment" className="glass-panel bg-white/5 border-white/10 rounded-2xl text-xs max-h-[350px] overflow-y-auto">
                              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
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
            </motion.div>
          </AnimatePresence>
        </Content>
      </Layout>
    </Layout>
  );
}

// Simple custom component to prevent jsx warnings
function AvatarIcon({ children, className }: any) {
  return <div className={className}>{children}</div>;
}