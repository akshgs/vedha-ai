// app/page.tsx — Premium SaaS Landing Page for VEDHA AI
"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { motion, AnimatePresence } from "framer-motion";
import { ConfigProvider, theme, App } from "antd";
import {
  Sparkles,
  Brain,
  FileText,
  TrendingUp,
  Video,
  Compass,
  LayoutDashboard,
  Briefcase,
  ArrowRight,
  ChevronRight,
  Star,
  MessageSquare,
  Play,
  Check,
  HelpCircle,
  Send,
  Mail,
  User,
  Plus,
  Minus,
  Menu,
  X,
  Target,
  GraduationCap,
  Users,
  ShieldCheck,
  Building2,
  Calendar,
  Eye,
  Percent,
  CheckCircle2,
  Info
} from "lucide-react";
import VedhaLogo from "@/components/shared/VedhaLogo";

export default function LandingPage() {
  const router = useRouter();
  const { user, loadFromStorage } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFeatureTab, setActiveFeatureTab] = useState("student");

  // Load user status
  useEffect(() => {
    loadFromStorage();
  }, []);

  // Previews / Interactive States
  // 1. AI Chat simulation
  const [chatMsg, setChatMsg] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ sender: "user" | "bot"; text: string }>>([
    { sender: "bot", text: "Hello! I am Vedha, your AI Career Coach. Which role are you targeting, or what career choice can I help you map out today?" },
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // 2. Resume Scan Simulation
  const [resumeName, setResumeName] = useState("");
  const [resumeScanPercent, setResumeScanPercent] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  // 3. Placement prediction calculator
  const [cgpa, setCgpa] = useState("8.5");
  const [projectsCount, setProjectsCount] = useState("2");
  const [dsaProblems, setDsaProblems] = useState("100-200");
  const [hasBacklog, setHasBacklog] = useState("no");
  const [placementScore, setPlacementScore] = useState<number | null>(null);
  const [calculatingPlacement, setCalculatingPlacement] = useState(false);

  // 4. Contact Form
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // 5. Pricing Billing Toggle
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("yearly");

  // 6. FAQs Collapsible State
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // Auto-typing career simulation helper
  const handleChatQuickQuestion = (question: string) => {
    if (chatLoading) return;
    setChatHistory((prev) => [...prev, { sender: "user", text: question }]);
    setChatLoading(true);

    setTimeout(() => {
      let botResponse = "";
      if (question.includes("transition")) {
        botResponse = "To transition to Machine Learning from Web Dev:\n1. Focus on Python, NumPy, and Pandas.\n2. Master Supervised Learning algorithms (Linear/Logistic Regression, Trees).\n3. Build a practical recommendation engine or text classifier project.\n4. Vedha AI's Skill Switcher tool can map out a day-by-day 30/60/90 learning roadmap for this switch!";
      } else if (question.includes("in-demand")) {
        botResponse = "According to our crawler, the top 3 tech roles in Kerala right now are:\n1. GenAI / LLM Engineers (up 42% in Technopark/Infopark)\n2. React/Next.js Fullstack Developers\n3. MLOps & Cloud Architecture. \nCritical skill gaps include Docker, FastAPI, and vector search stores (ChromaDB/Pinecone).";
      } else {
        botResponse = "To establish a solid backend foundations, I recommend:\n- Month 1: Learn Python & FastAPI fundamentals, synchronous vs async endpoints.\n- Month 2: SQL, PostgreSQL databases, indexing, and ORM integrations (SQLAlchemy).\n- Month 3: Docker containers, authentication protocols (JWT), and basic unit testing.\nI've generated a 30-day curriculum with active exercises in your dashboard!";
      }
      setChatHistory((prev) => [...prev, { sender: "bot", text: botResponse }]);
      setChatLoading(false);
    }, 1200);
  };

  const handleCustomChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMsg.trim() || chatLoading) return;
    const msg = chatMsg;
    setChatMsg("");
    setChatHistory((prev) => [...prev, { sender: "user", text: msg }]);
    setChatLoading(true);

    setTimeout(() => {
      const replies = [
        "That's a great target! To stand out, you'll need to demonstrate concrete projects in that area. I highly recommend completing the 'Advanced Skill Checkup' in our Quiz portal.",
        "To break into that market, focus on building 2-3 end-to-end applications and scanning your resume against active JD requirements.",
        "I recommend checking the Career Opportunities hub, where we have matched 12 new openings that fit your profile perfectly."
      ];
      const botResponse = replies[Math.floor(Math.random() * replies.length)];
      setChatHistory((prev) => [...prev, { sender: "bot", text: botResponse }]);
      setChatLoading(false);
    }, 1000);
  };

  // Resume Analyzer simulation
  const handleSimulateResume = (name: string) => {
    setIsScanning(true);
    setResumeName(name);
    setResumeScanPercent(0);
    setScanResult(null);

    const interval = setInterval(() => {
      setResumeScanPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setScanResult({
            score: 84,
            role: "Machine Learning Engineer",
            skills: ["Python", "SQL", "Scikit-Learn", "FastAPI"],
            gaps: ["PyTorch", "Docker", "MLOps Pipelines"],
            readiness: "Ready to apply for Junior/Mid ML roles"
          });
          return 100;
        }
        return prev + 20;
      });
    }, 300);
  };

  // Placement score simulation
  const handleCalculatePlacement = (e: React.FormEvent) => {
    e.preventDefault();
    setCalculatingPlacement(true);
    setPlacementScore(null);

    setTimeout(() => {
      // Logic for score calculation
      let score = 35;
      const cg = parseFloat(cgpa);
      score += Math.min((cg - 5.0) * 8.5, 40); // Max 40 points from CGPA
      
      const proj = parseInt(projectsCount);
      score += proj * 6; // Max 18 points

      if (dsaProblems === "50-100") score += 10;
      else if (dsaProblems === "100-200") score += 20;
      else if (dsaProblems === "200+") score += 28;

      if (hasBacklog === "yes") score -= 25;

      const finalScore = Math.max(Math.min(Math.round(score), 98), 12);
      setPlacementScore(finalScore);
      setCalculatingPlacement(false);
    }, 1500);
  };

  // Contact Form submit
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail) return;
    setContactSubmitted(true);
    setContactName("");
    setContactEmail("");
    setContactMessage("");
    setTimeout(() => setContactSubmitted(false), 5000);
  };

  // Smooth scroll helper
  const scrollToId = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "#0B5FFF",
          borderRadius: 18,
          colorBgBase: "#ffffff",
          colorText: "#0F172A",
        },
      }}
    >
      <div className="bg-[#F8FAFC] text-[#0F172A] min-h-screen font-inter overflow-x-hidden selection:bg-brand-secondary selection:text-white">
        
        {/* Sticky Header */}
        <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-lg border-b border-brand-border/60 transition-all">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              <VedhaLogo showText={true} size="md" />
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8">
              <button onClick={() => scrollToId("features")} className="text-sm font-semibold text-brand-text-secondary hover:text-brand-secondary transition-all cursor-pointer">Features</button>
              <button onClick={() => scrollToId("how-it-works")} className="text-sm font-semibold text-brand-text-secondary hover:text-brand-secondary transition-all cursor-pointer">How It Works</button>
              <button onClick={() => scrollToId("previews")} className="text-sm font-semibold text-brand-text-secondary hover:text-brand-secondary transition-all cursor-pointer">Live Previews</button>
              <button onClick={() => scrollToId("pricing")} className="text-sm font-semibold text-brand-text-secondary hover:text-brand-secondary transition-all cursor-pointer">Pricing</button>
              <button onClick={() => scrollToId("faq")} className="text-sm font-semibold text-brand-text-secondary hover:text-brand-secondary transition-all cursor-pointer">FAQ</button>
              <button onClick={() => router.push("/demo")} className="text-sm font-semibold text-[#0B5FFF] bg-[#0B5FFF]/10 border border-[#0B5FFF]/20 px-3 py-1 rounded-full hover:bg-[#0B5FFF]/15 transition-all cursor-pointer">Try Demo</button>
            </nav>

            {/* Header CTAs */}
            <div className="hidden lg:flex items-center gap-4">
              {user ? (
                <button
                  onClick={() => router.push(`/${user.role}`)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white font-semibold text-sm rounded-2xl hover:bg-[#112d7c] hover:shadow-lg transition-all cursor-pointer"
                >
                  <LayoutDashboard size={16} /> Go to Dashboard <ArrowRight size={14} />
                </button>
              ) : (
                <>
                  <button
                    onClick={() => router.push("/login")}
                    className="text-sm font-bold text-brand-text-primary hover:text-brand-secondary transition-all cursor-pointer px-4"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => router.push("/login")}
                    className="px-5 py-2.5 bg-[#0B5FFF] text-white font-bold text-sm rounded-2xl shadow-lg shadow-brand-secondary/25 hover:bg-[#084bca] hover:shadow-xl transition-all cursor-pointer"
                  >
                    Get Started Free
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Icon */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-brand-text-primary hover:bg-brand-border/30 rounded-xl transition-all cursor-pointer"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation Drawer */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden border-t border-brand-border/60 bg-white overflow-hidden"
              >
                <div className="p-6 flex flex-col gap-4">
                  <button onClick={() => scrollToId("features")} className="text-left py-2 font-semibold text-brand-text-secondary">Features</button>
                  <button onClick={() => scrollToId("how-it-works")} className="text-left py-2 font-semibold text-brand-text-secondary">How It Works</button>
                  <button onClick={() => scrollToId("previews")} className="text-left py-2 font-semibold text-brand-text-secondary">Interactive Previews</button>
                  <button onClick={() => scrollToId("pricing")} className="text-left py-2 font-semibold text-brand-text-secondary">Pricing Plans</button>
                  <button onClick={() => scrollToId("faq")} className="text-left py-2 font-semibold text-brand-text-secondary">FAQ</button>
                  <button onClick={() => router.push("/demo")} className="text-left py-2 font-semibold text-brand-secondary">Interactive Sandbox Demo</button>
                  
                  <div className="h-px bg-brand-border my-2" />
                  {user ? (
                    <button
                      onClick={() => router.push(`/${user.role}`)}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-brand-primary text-white font-bold rounded-2xl"
                    >
                      <LayoutDashboard size={16} /> Go to Dashboard
                    </button>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => router.push("/login")}
                        className="w-full py-3 border border-brand-border font-bold text-center rounded-2xl"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => router.push("/login")}
                        className="w-full py-3 bg-brand-secondary text-white font-bold text-center rounded-2xl shadow-lg shadow-brand-secondary/25"
                      >
                        Register Account
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* Hero Section */}
        <section className="relative pt-16 pb-24 md:py-32 px-6 overflow-hidden">
          {/* Animated gradient light circles */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] md:w-[900px] h-[350px] bg-gradient-to-r from-brand-secondary/10 via-brand-accent/5 to-purple-500/10 rounded-full blur-[100px] -z-10" />
          
          <div className="max-w-7xl mx-auto text-center relative space-y-8">
            {/* Kerala Tag */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur border border-brand-border px-4 py-1.5 rounded-full shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0B5FFF]"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-text-primary">Kerala's Premier AI Career Ecosystem</span>
            </div>

            {/* Massive Heading */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-poppins font-black text-brand-primary tracking-tight max-w-5xl mx-auto leading-[1.1]">
              Shape Your Technical Career with <span className="bg-gradient-to-r from-[#071A52] via-[#0B5FFF] to-[#2DA8FF] bg-clip-text text-transparent">Intelligence</span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl text-brand-text-secondary font-medium max-w-3xl mx-auto leading-relaxed">
              Vedha AI leverages advanced LLMs and real-time tech park crawlers to bridge skill gaps, simulate custom recruiter loops, and boost student placement readiness.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => router.push("/login")}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-[#0B5FFF] text-white font-bold rounded-2xl shadow-xl shadow-brand-secondary/30 hover:bg-[#084bca] hover:shadow-2xl hover:-translate-y-0.5 transition-all cursor-pointer text-base"
              >
                Launch AI Coach Free <ArrowRight size={18} />
              </button>
              <button
                onClick={() => scrollToId("previews")}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand-primary border border-brand-border font-bold rounded-2xl hover:bg-slate-50 transition-all cursor-pointer text-base shadow-sm"
              >
                <Play size={16} fill="currentColor" /> Try Previews
              </button>
            </div>

            {/* Floating Cards / Visual Showcase Container */}
            <div className="pt-16 max-w-5xl mx-auto relative">
              {/* Main dashboard preview frame */}
              <div className="bg-white border border-brand-border/80 shadow-2xl rounded-3xl p-4 md:p-6 overflow-hidden hover:shadow-3xl transition-all duration-500">
                <div className="flex items-center justify-between border-b border-brand-border pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-400" />
                    <span className="w-3 h-3 rounded-full bg-yellow-400" />
                    <span className="w-3 h-3 rounded-full bg-green-400" />
                    <span className="text-[11px] font-semibold text-brand-text-secondary ml-2">platform_preview_v3.0.json</span>
                  </div>
                  <div className="bg-brand-bg px-3 py-1 rounded-full text-[10px] font-bold text-brand-secondary border border-brand-border">
                    STUDENT PORTAL
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  {/* Card 1 */}
                  <div className="bg-brand-bg p-5 rounded-2xl border border-brand-border relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-secondary/5 rounded-full blur-xl" />
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-xl bg-brand-secondary/10 flex items-center justify-center text-brand-secondary">
                        <Brain size={18} />
                      </div>
                      <span className="text-xs font-bold text-brand-primary">AI Career Mentor</span>
                    </div>
                    <p className="text-xs text-brand-text-secondary mb-4">"Vedha, what projects should I build to target LLM Engineer roles?"</p>
                    <div className="bg-white p-3 rounded-xl border border-brand-border text-[10px] font-semibold text-[#0B5FFF] flex items-center gap-2">
                      <Sparkles size={12} className="animate-pulse" /> Generating 3 Custom Roadmaps...
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-brand-bg p-5 rounded-2xl border border-brand-border relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-accent/5 rounded-full blur-xl" />
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-xl bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                        <FileText size={18} />
                      </div>
                      <span className="text-xs font-bold text-brand-primary">Resume ATS Checker</span>
                    </div>
                    <p className="text-xs text-brand-text-secondary mb-4">Upload resume against a Machine Learning Engineer job description.</p>
                    <div className="flex items-center justify-between text-xs font-bold bg-white p-3 rounded-xl border border-brand-border">
                      <span className="text-brand-text-primary">Match Rating</span>
                      <span className="text-brand-success bg-brand-success/10 px-2 py-0.5 rounded-md font-extrabold">87% Match</span>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-brand-bg p-5 rounded-2xl border border-brand-border relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl" />
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100/40 flex items-center justify-center text-brand-success">
                        <TrendingUp size={18} />
                      </div>
                      <span className="text-xs font-bold text-brand-primary">Placement prediction</span>
                    </div>
                    <p className="text-xs text-brand-text-secondary mb-4">Probability of secure tech placement inside 6 months.</p>
                    <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-brand-border">
                      <div className="flex-1">
                        <div className="flex justify-between text-[10px] font-bold text-brand-text-secondary mb-1">
                          <span>Readiness</span>
                          <span>92%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#22C55E] h-full rounded-full" style={{ width: "92%" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative side cards - Desktop only */}
              <div className="hidden lg:block absolute -left-12 bottom-12 w-48 bg-white border border-brand-border shadow-xl p-4 rounded-2xl text-left transform -rotate-3 hover:rotate-0 hover:-translate-y-2 transition-all duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-brand-success" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-text-secondary">Recent Match</span>
                </div>
                <p className="text-[11px] font-bold text-brand-primary leading-tight">FastAPI Dev at Technopark</p>
                <p className="text-[9px] text-brand-text-secondary mt-1">94% Skill Overlap</p>
              </div>

              <div className="hidden lg:block absolute -right-12 top-20 w-48 bg-white border border-brand-border shadow-xl p-4 rounded-2xl text-left transform rotate-3 hover:rotate-0 hover:-translate-y-2 transition-all duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={12} className="text-brand-secondary animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-secondary">AI Recommendation</span>
                </div>
                <p className="text-[11px] font-bold text-brand-primary leading-tight">Master Docker & CI/CD</p>
                <p className="text-[9px] text-brand-text-secondary mt-1">Top priority skill gap found.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section id="features" className="py-24 px-6 bg-white border-y border-brand-border/60">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#0B5FFF]">Comprehensive Platform</h2>
              <h3 className="text-3xl md:text-5xl font-poppins font-bold text-brand-primary tracking-tight">
                Engineered for Both Sides of the Market
              </h3>
              <p className="text-base text-brand-text-secondary max-w-2xl mx-auto">
                A unified ecosystem that powers student skill-building while granting recruiters intelligent analytics to hire matching talent.
              </p>
            </div>

            {/* Custom Tab Toggle */}
            <div className="flex items-center justify-center p-1.5 bg-brand-bg border border-brand-border rounded-2xl w-fit mx-auto">
              <button
                onClick={() => setActiveFeatureTab("student")}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeFeatureTab === "student"
                    ? "bg-brand-primary text-white shadow-md"
                    : "text-brand-text-secondary hover:text-brand-primary"
                }`}
              >
                Student Portal
              </button>
              <button
                onClick={() => setActiveFeatureTab("recruiter")}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeFeatureTab === "recruiter"
                    ? "bg-brand-primary text-white shadow-md"
                    : "text-brand-text-secondary hover:text-brand-primary"
                }`}
              >
                Recruiter & Employer
              </button>
            </div>

            {/* Feature Cards Grid */}
            <AnimatePresence mode="wait">
              {activeFeatureTab === "student" ? (
                <motion.div
                  key="student-features"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                  {/* F1 */}
                  <div className="bg-brand-bg border border-brand-border/70 p-8 rounded-3xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-80">
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-brand-secondary/10 flex items-center justify-center text-brand-secondary">
                        <Brain size={22} />
                      </div>
                      <h4 className="text-lg font-bold text-brand-primary">AI Career Mentor</h4>
                      <p className="text-sm text-brand-text-secondary leading-relaxed">
                        Instant chat mentor to clarify career roadmaps, recommend suitable projects, and suggest target job families.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-brand-secondary flex items-center gap-1">Powered by Llama 3.3-70b <ChevronRight size={14} /></span>
                  </div>

                  {/* F2 */}
                  <div className="bg-brand-bg border border-brand-border/70 p-8 rounded-3xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-80">
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#a855f7]/10 flex items-center justify-center text-[#a855f7]">
                        <FileText size={22} />
                      </div>
                      <h4 className="text-lg font-bold text-brand-primary">Resume ATS Scanner</h4>
                      <p className="text-sm text-brand-text-secondary leading-relaxed">
                        Analyzes PDF resumes against specific role parameters. Instantly parses technical skillsets and maps missing competencies.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#a855f7] flex items-center gap-1">Deep Parsing Algorithm <ChevronRight size={14} /></span>
                  </div>

                  {/* F3 */}
                  <div className="bg-brand-bg border border-brand-border/70 p-8 rounded-3xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-80">
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-brand-success/10 flex items-center justify-center text-brand-success">
                        <Target size={22} />
                      </div>
                      <h4 className="text-lg font-bold text-brand-primary">Placement Readiness Model</h4>
                      <p className="text-sm text-brand-text-secondary leading-relaxed">
                        Calculates an aggregate percentage based on academic standing, project counts, and DSA problem history to predict hiring likelihood.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-brand-success flex items-center gap-1">Predictive ML Model <ChevronRight size={14} /></span>
                  </div>

                  {/* F4 */}
                  <div className="bg-brand-bg border border-brand-border/70 p-8 rounded-3xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-80">
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#3b82f6]/10 flex items-center justify-center text-[#3b82f6]">
                        <Briefcase size={22} />
                      </div>
                      <h4 className="text-lg font-bold text-brand-primary">Job Crawling & Matching</h4>
                      <p className="text-sm text-brand-text-secondary leading-relaxed">
                        Consolidated scraping framework fetching active postings from major technoparks, matching roles matching student scores.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#3b82f6] flex items-center gap-1">Real-time Crawlers <ChevronRight size={14} /></span>
                  </div>

                  {/* F5 */}
                  <div className="bg-brand-bg border border-brand-border/70 p-8 rounded-3xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-80">
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-brand-accent/10 flex items-center justify-center text-[#0ea5e9]">
                        <Video size={22} />
                      </div>
                      <h4 className="text-lg font-bold text-brand-primary">AI Recruiter Simulation</h4>
                      <p className="text-sm text-brand-text-secondary leading-relaxed">
                        Allows students to simulate mock interview sessions, answering technical questions while the model evaluates answer completeness.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#0ea5e9] flex items-center gap-1">Video & Audio Feedback <ChevronRight size={14} /></span>
                  </div>

                  {/* F6 */}
                  <div className="bg-brand-bg border border-brand-border/70 p-8 rounded-3xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-80">
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-[#d97706]">
                        <Compass size={22} />
                      </div>
                      <h4 className="text-lg font-bold text-brand-primary">Skill Gap Roadmapping</h4>
                      <p className="text-sm text-brand-text-secondary leading-relaxed">
                        Provides a structured 30/60/90-day learning curriculum mapping current skills to targeted industry standards.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#d97706] flex items-center gap-1">Dynamic Roadmap Gen <ChevronRight size={14} /></span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="recruiter-features"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  {/* R1 */}
                  <div className="bg-brand-bg border border-brand-border/70 p-8 rounded-3xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-80">
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                        <Building2 size={22} />
                      </div>
                      <h4 className="text-lg font-bold text-brand-primary">Company Recruiter Dashboard</h4>
                      <p className="text-sm text-brand-text-secondary leading-relaxed">
                        Grants companies direct visibility into placement-ready student cohorts. Search, filter by readiness scores, and discover matching resumes immediately.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-brand-primary flex items-center gap-1">Recruiter Access Portal <ChevronRight size={14} /></span>
                  </div>

                  {/* R2 */}
                  <div className="bg-brand-bg border border-brand-border/70 p-8 rounded-3xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-80">
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-600">
                        <Users size={22} />
                      </div>
                      <h4 className="text-lg font-bold text-brand-primary">TPO & Employee Analytics</h4>
                      <p className="text-sm text-brand-text-secondary leading-relaxed">
                        Equips training and placement officers with cohort reports. Monitor aggregate student strengths, outstanding backlogs, and overall hiring velocity.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-indigo-600 flex items-center gap-1">Placement Officer Hub <ChevronRight size={14} /></span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-20 bg-brand-primary text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-brand-gradient opacity-10 -z-10" />
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <h4 className="text-4xl md:text-5xl font-poppins font-black text-brand-accent">14,200+</h4>
              <p className="text-xs md:text-sm text-slate-300 font-bold uppercase tracking-wider">Kerala Students Active</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-4xl md:text-5xl font-poppins font-black text-brand-accent">87.4%</h4>
              <p className="text-xs md:text-sm text-slate-300 font-bold uppercase tracking-wider">Placement Success Rate</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-4xl md:text-5xl font-poppins font-black text-brand-accent">120K+</h4>
              <p className="text-xs md:text-sm text-slate-300 font-bold uppercase tracking-wider">AI Mentoring Dialogs</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-4xl md:text-5xl font-poppins font-black text-brand-accent">160+</h4>
              <p className="text-xs md:text-sm text-slate-300 font-bold uppercase tracking-wider">Hiring Technopark Partners</p>
            </div>
          </div>
        </section>

        {/* Timeline - How It Works */}
        <section id="how-it-works" className="py-24 px-6 bg-[#F8FAFC]">
          <div className="max-w-4xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#0B5FFF]">Platform Workflow</h2>
              <h3 className="text-3xl md:text-4xl font-poppins font-bold text-brand-primary tracking-tight">
                Your Roadmap to Industry Placement
              </h3>
            </div>

            {/* Timeline structure */}
            <div className="space-y-12 relative before:absolute before:left-6 md:before:left-1/2 before:top-4 before:bottom-4 before:w-0.5 before:bg-brand-border">
              
              {/* Step 1 */}
              <div className="flex flex-col md:flex-row items-stretch md:justify-between relative">
                <div className="absolute left-3 md:left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[#0B5FFF] border-4 border-white shadow flex items-center justify-center text-white text-[10px] font-bold">1</div>
                <div className="pl-12 md:pl-0 md:w-[45%] text-left md:text-right space-y-2">
                  <h4 className="text-lg font-bold text-brand-primary">Profile Registration</h4>
                  <p className="text-xs text-brand-text-secondary leading-relaxed">
                    Students define their primary career aspirations (e.g. LLM Engineer, Backend Architect) and upload their background details.
                  </p>
                </div>
                <div className="hidden md:block w-[45%]" />
              </div>

              {/* Step 2 */}
              <div className="flex flex-col md:flex-row items-stretch md:justify-between relative">
                <div className="absolute left-3 md:left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[#0B5FFF] border-4 border-white shadow flex items-center justify-center text-white text-[10px] font-bold">2</div>
                <div className="hidden md:block w-[45%]" />
                <div className="pl-12 md:pl-0 md:w-[45%] text-left space-y-2">
                  <h4 className="text-lg font-bold text-brand-primary">Skill Gap Assessment</h4>
                  <p className="text-xs text-brand-text-secondary leading-relaxed">
                    The platform scans technical resumes and evaluates academic coursework metrics, comparing them directly against target job description standards.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col md:flex-row items-stretch md:justify-between relative">
                <div className="absolute left-3 md:left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[#0B5FFF] border-4 border-white shadow flex items-center justify-center text-white text-[10px] font-bold">3</div>
                <div className="pl-12 md:pl-0 md:w-[45%] text-left md:text-right space-y-2">
                  <h4 className="text-lg font-bold text-brand-primary">Interactive AI Coaching</h4>
                  <p className="text-xs text-brand-text-secondary leading-relaxed">
                    Vedha AI prescribes active study schedules, tracks progress on custom quizzes, and checks solution logic on DSA coding exercises.
                  </p>
                </div>
                <div className="hidden md:block w-[45%]" />
              </div>

              {/* Step 4 */}
              <div className="flex flex-col md:flex-row items-stretch md:justify-between relative">
                <div className="absolute left-3 md:left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[#0B5FFF] border-4 border-white shadow flex items-center justify-center text-white text-[10px] font-bold">4</div>
                <div className="hidden md:block w-[45%]" />
                <div className="pl-12 md:pl-0 md:w-[45%] text-left space-y-2">
                  <h4 className="text-lg font-bold text-brand-primary">Recruiter Pipeline Sync</h4>
                  <p className="text-xs text-brand-text-secondary leading-relaxed">
                    Once placement scores cross readiness thresholds, candidates profiles automatically surface in Technopark recruiter queries, leading to direct interview calls.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Previews / Interactive Sandbox Playground */}
        <section id="previews" className="py-24 px-6 bg-white border-y border-brand-border/60">
          <div className="max-w-7xl mx-auto space-y-20">
            <div className="text-center space-y-4">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#0B5FFF]">Interactive Sandbox</h2>
              <h3 className="text-3xl md:text-4xl font-poppins font-bold text-brand-primary tracking-tight">
                Try the Core AI Features Right Now
              </h3>
              <p className="text-base text-brand-text-secondary max-w-xl mx-auto">
                No sign-up required. Interact with these live mock integrations to preview the Vedha AI system.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Preview 1: AI Chat */}
              <div className="bg-brand-bg border border-brand-border rounded-3xl p-6 flex flex-col justify-between h-[520px]">
                <div>
                  <div className="flex items-center gap-2 mb-4 border-b border-brand-border pb-3">
                    <MessageSquare size={18} className="text-brand-secondary" />
                    <h4 className="text-sm font-bold text-brand-primary">AI Career Mentor Preview</h4>
                  </div>
                  
                  {/* Chat messages */}
                  <div className="h-[280px] overflow-y-auto space-y-3 pr-2 text-xs">
                    {chatHistory.map((ch, idx) => (
                      <div key={idx} className={`flex ${ch.sender === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                          ch.sender === "user"
                            ? "bg-brand-secondary text-white rounded-tr-none"
                            : "bg-white text-brand-primary border border-brand-border rounded-tl-none"
                        }`}>
                          {ch.text.split("\n").map((line, i) => (
                            <p key={i}>{line}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="flex justify-start">
                        <div className="bg-white text-brand-primary border border-brand-border p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-brand-secondary rounded-full animate-bounce" />
                          <span className="w-1.5 h-1.5 bg-brand-secondary rounded-full animate-bounce [animation-delay:0.2s]" />
                          <span className="w-1.5 h-1.5 bg-brand-secondary rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3 mt-4">
                  {/* Quick suggestion tabs */}
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => handleChatQuickQuestion("How to transition from Web Dev to ML?")}
                      className="text-[10px] bg-white border border-brand-border px-2.5 py-1 rounded-full text-brand-text-secondary hover:border-brand-secondary hover:text-brand-secondary transition-all cursor-pointer font-semibold"
                    >
                      Web Dev → ML Switch
                    </button>
                    <button
                      onClick={() => handleChatQuickQuestion("What are the current in-demand skills?")}
                      className="text-[10px] bg-white border border-brand-border px-2.5 py-1 rounded-full text-brand-text-secondary hover:border-brand-secondary hover:text-brand-secondary transition-all cursor-pointer font-semibold"
                    >
                      Technopark Demands
                    </button>
                  </div>

                  {/* Input Form */}
                  <form onSubmit={handleCustomChatSubmit} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ask the AI Coach..."
                      value={chatMsg}
                      onChange={(e) => setChatMsg(e.target.value)}
                      className="flex-1 bg-white border border-brand-border px-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-secondary"
                    />
                    <button
                      type="submit"
                      className="p-2.5 bg-brand-primary text-white rounded-xl hover:bg-brand-secondary transition-all cursor-pointer"
                    >
                      <Send size={14} />
                    </button>
                  </form>
                </div>
              </div>

              {/* Preview 2: Resume Check */}
              <div className="bg-brand-bg border border-brand-border rounded-3xl p-6 flex flex-col justify-between h-[520px]">
                <div>
                  <div className="flex items-center gap-2 mb-4 border-b border-brand-border pb-3">
                    <FileText size={18} className="text-purple-500" />
                    <h4 className="text-sm font-bold text-brand-primary">Resume ATS Checker Preview</h4>
                  </div>

                  <p className="text-xs text-brand-text-secondary mb-4 leading-relaxed">
                    Click a sample profile below to simulate how the scanner parses skills and evaluates job descriptions.
                  </p>

                  <div className="space-y-3">
                    <button
                      onClick={() => handleSimulateResume("rahul_cv_data_engineer.pdf")}
                      className="w-full text-left p-3.5 bg-white border border-brand-border rounded-2xl hover:border-brand-secondary transition-all flex items-center justify-between cursor-pointer"
                    >
                      <div>
                        <p className="text-xs font-bold text-brand-primary">Rahul_CV_Data.pdf</p>
                        <p className="text-[10px] text-brand-text-secondary">Data Engineer Role • 82KB</p>
                      </div>
                      <ChevronRight size={16} className="text-brand-text-secondary" />
                    </button>

                    <button
                      onClick={() => handleSimulateResume("anjali_s_resume_ml.pdf")}
                      className="w-full text-left p-3.5 bg-white border border-brand-border rounded-2xl hover:border-brand-secondary transition-all flex items-center justify-between cursor-pointer"
                    >
                      <div>
                        <p className="text-xs font-bold text-brand-primary">Anjali_S_Resume_ML.pdf</p>
                        <p className="text-[10px] text-brand-text-secondary">Machine Learning Role • 95KB</p>
                      </div>
                      <ChevronRight size={16} className="text-brand-text-secondary" />
                    </button>
                  </div>

                  {/* Loading State */}
                  {isScanning && (
                    <div className="mt-6 text-center space-y-2">
                      <p className="text-xs font-semibold text-brand-secondary">Scanning CV elements... {resumeScanPercent}%</p>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-brand-secondary h-full transition-all duration-300" style={{ width: `${resumeScanPercent}%` }} />
                      </div>
                    </div>
                  )}

                  {/* Scan Results */}
                  {scanResult && !isScanning && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-6 bg-white border border-brand-border p-4 rounded-2xl space-y-3 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-brand-primary">ATS Score:</span>
                        <span className="font-black text-brand-success bg-brand-success/10 px-2 py-0.5 rounded-md">{scanResult.score}% Match</span>
                      </div>
                      <div>
                        <span className="font-bold text-brand-primary block mb-1">Parsed Skills:</span>
                        <div className="flex flex-wrap gap-1">
                          {scanResult.skills.map((s: string, i: number) => (
                            <span key={i} className="bg-brand-bg border border-brand-border px-2 py-0.5 rounded text-[10px] font-semibold text-brand-primary">{s}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="font-bold text-brand-danger block mb-1">Identified Skill Gaps:</span>
                        <div className="flex flex-wrap gap-1">
                          {scanResult.gaps.map((g: string, i: number) => (
                            <span key={i} className="bg-red-50 border border-red-100 px-2 py-0.5 rounded text-[10px] font-semibold text-brand-danger">{g}</span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="text-[10px] text-brand-text-secondary text-center pt-2 border-t border-brand-border">
                  Simulation checks keywords and layout alignment.
                </div>
              </div>

              {/* Preview 3: Placement Score Calculator */}
              <div className="bg-brand-bg border border-brand-border rounded-3xl p-6 flex flex-col justify-between h-[520px]">
                <div>
                  <div className="flex items-center gap-2 mb-4 border-b border-brand-border pb-3">
                    <Target size={18} className="text-brand-success" />
                    <h4 className="text-sm font-bold text-brand-primary">Placement Probability Calc</h4>
                  </div>

                  <form onSubmit={handleCalculatePlacement} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-brand-text-secondary font-semibold mb-1">Current CGPA</label>
                      <input
                        type="number"
                        step="0.1"
                        min="5.0"
                        max="10.0"
                        value={cgpa}
                        onChange={(e) => setCgpa(e.target.value)}
                        className="w-full bg-white border border-brand-border px-3 py-2 rounded-xl focus:outline-none focus:border-brand-secondary font-medium"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-brand-text-secondary font-semibold mb-1">Tech Projects</label>
                        <select
                          value={projectsCount}
                          onChange={(e) => setProjectsCount(e.target.value)}
                          className="w-full bg-white border border-brand-border px-3 py-2 rounded-xl focus:outline-none focus:border-brand-secondary font-medium"
                        >
                          <option value="0">0 Projects</option>
                          <option value="1">1 Project</option>
                          <option value="2">2 Projects</option>
                          <option value="3">3+ Projects</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-brand-text-secondary font-semibold mb-1">DSA Solved</label>
                        <select
                          value={dsaProblems}
                          onChange={(e) => setDsaProblems(e.target.value)}
                          className="w-full bg-white border border-brand-border px-3 py-2 rounded-xl focus:outline-none focus:border-brand-secondary font-medium"
                        >
                          <option value="<50">&lt; 50 Problems</option>
                          <option value="50-100">50 - 100</option>
                          <option value="100-200">100 - 200</option>
                          <option value="200+">200+ Solved</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-brand-text-secondary font-semibold mb-1">Has Active Backlog?</label>
                      <div className="flex gap-4 mt-1">
                        <label className="flex items-center gap-1.5 font-medium">
                          <input type="radio" name="backlog" value="no" checked={hasBacklog === "no"} onChange={() => setHasBacklog("no")} /> No
                        </label>
                        <label className="flex items-center gap-1.5 font-medium">
                          <input type="radio" name="backlog" value="yes" checked={hasBacklog === "yes"} onChange={() => setHasBacklog("yes")} /> Yes
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={calculatingPlacement}
                      className="w-full py-2.5 bg-brand-primary hover:bg-[#084bca] text-white font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
                    >
                      {calculatingPlacement ? "Calculating Models..." : "Evaluate Placement Odds"}
                    </button>
                  </form>

                  {placementScore !== null && !calculatingPlacement && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-5 bg-white border border-brand-border p-4 rounded-2xl text-center space-y-1.5"
                    >
                      <p className="text-[10px] font-bold text-brand-text-secondary uppercase">Estimated Probability</p>
                      <h5 className="text-3xl font-black text-brand-primary">{placementScore}%</h5>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-2">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            placementScore >= 75
                              ? "bg-brand-success"
                              : placementScore >= 50
                              ? "bg-brand-warning"
                              : "bg-brand-danger"
                          }`}
                          style={{ width: `${placementScore}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-brand-text-secondary leading-tight">
                        {placementScore >= 75
                          ? "Solid alignment! Focus on Mock Interviews to convert."
                          : placementScore >= 50
                          ? "Decent chances. Build another project to strengthen portfolio."
                          : "High risk profile. Work on DSA practice and resolve any backlogs."}
                      </p>
                    </motion.div>
                  )}
                </div>

                <div className="text-[10px] text-brand-text-secondary text-center pt-2 border-t border-brand-border">
                  Estimated based on aggregate placement metrics.
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Student Testimonials */}
        <section className="py-24 px-6 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#0B5FFF]">Success Stories</h2>
              <h3 className="text-3xl md:text-4xl font-poppins font-bold text-brand-primary tracking-tight">
                Trusted by Kerala's Next-Gen Talent
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* T1 */}
              <div className="bg-white border border-brand-border p-8 rounded-3xl shadow-sm relative space-y-6">
                <div className="flex gap-1 text-amber-400">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                </div>
                <p className="text-xs sm:text-sm text-brand-text-secondary leading-relaxed italic">
                  "Vedha AI identified a skill gap in Docker and FastAPI on my resume. I followed the 30-day generated roadmap and cleared the technical rounds for a placement in Technopark Trivandrum!"
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-10 h-10 rounded-full bg-brand-secondary/10 flex items-center justify-center text-brand-secondary font-bold text-xs">AM</div>
                  <div>
                    <h5 className="text-xs font-bold text-brand-primary">Arjun M.</h5>
                    <p className="text-[10px] text-brand-text-secondary">Software Engineer, Technopark</p>
                  </div>
                </div>
              </div>

              {/* T2 */}
              <div className="bg-white border border-brand-border p-8 rounded-3xl shadow-sm relative space-y-6">
                <div className="flex gap-1 text-amber-400">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                </div>
                <p className="text-xs sm:text-sm text-brand-text-secondary leading-relaxed italic">
                  "As a Training and Placement Officer, monitoring cohort performance used to be a mess of excel sheets. The Vedha Employee dashboard gives me live metrics on student readiness instantly."
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-10 h-10 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent font-bold text-xs">SR</div>
                  <div>
                    <h5 className="text-xs font-bold text-brand-primary">Sajith R.</h5>
                    <p className="text-[10px] text-brand-text-secondary">TPO Coordinator, SCT College</p>
                  </div>
                </div>
              </div>

              {/* T3 */}
              <div className="bg-white border border-brand-border p-8 rounded-3xl shadow-sm relative space-y-6">
                <div className="flex gap-1 text-amber-400">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                </div>
                <p className="text-xs sm:text-sm text-brand-text-secondary leading-relaxed italic">
                  "We sourced 15 placement-ready candidates via the Recruiter Dashboard this quarter. The readiness filters saved us weeks of initial coding screening and candidate interviews."
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-10 h-10 rounded-full bg-brand-success/10 flex items-center justify-center text-brand-success font-bold text-xs">KN</div>
                  <div>
                    <h5 className="text-xs font-bold text-brand-primary">Kavya Nair</h5>
                    <p className="text-[10px] text-brand-text-secondary">HR Lead, Infopark Kochi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Tiers */}
        <section id="pricing" className="py-24 px-6 bg-white border-y border-brand-border/60">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#0B5FFF]">Simple Pricing</h2>
              <h3 className="text-3xl md:text-4xl font-poppins font-bold text-brand-primary tracking-tight">
                Empowering Students and Colleges
              </h3>

              {/* Billing Toggle */}
              <div className="flex items-center justify-center gap-3 pt-4">
                <span className={`text-xs font-bold ${billingPeriod === "monthly" ? "text-brand-primary" : "text-brand-text-secondary"}`}>Monthly Billing</span>
                <button
                  onClick={() => setBillingPeriod(billingPeriod === "monthly" ? "yearly" : "monthly")}
                  className="w-12 h-6 bg-brand-secondary/20 rounded-full p-1 transition-all cursor-pointer relative flex items-center"
                >
                  <div className={`w-4 h-4 bg-brand-secondary rounded-full transition-all ${billingPeriod === "yearly" ? "translate-x-6" : "translate-x-0"}`} />
                </button>
                <span className={`text-xs font-bold flex items-center gap-1.5 ${billingPeriod === "yearly" ? "text-brand-primary" : "text-brand-text-secondary"}`}>
                  Yearly Billing <span className="bg-brand-success/10 text-brand-success text-[9px] font-black px-2 py-0.5 rounded-full">Save 20%</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Plan 1 */}
              <div className="bg-brand-bg border border-brand-border p-8 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-[450px]">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-brand-text-secondary uppercase tracking-wider">Free Starter</h4>
                    <p className="text-2xl font-poppins font-black text-brand-primary mt-2">$0</p>
                    <p className="text-[10px] text-brand-text-secondary">Free forever for personal training</p>
                  </div>
                  <ul className="space-y-3 text-xs text-brand-text-secondary font-medium">
                    <li className="flex items-center gap-2"><Check size={14} className="text-brand-success" /> 3 AI Chat Queries per day</li>
                    <li className="flex items-center gap-2"><Check size={14} className="text-brand-success" /> 2 Resume Scans monthly</li>
                    <li className="flex items-center gap-2"><Check size={14} className="text-brand-success" /> Access to basic Roadmap Planner</li>
                    <li className="flex items-center gap-2"><Check size={14} className="text-brand-success" /> Placement odds calculator</li>
                  </ul>
                </div>
                <button onClick={() => router.push("/login")} className="w-full py-3 bg-white border border-brand-border text-brand-primary font-bold rounded-2xl hover:bg-slate-50 transition-all cursor-pointer text-xs">
                  Access Free Version
                </button>
              </div>

              {/* Plan 2 */}
              <div className="bg-brand-bg border-2 border-brand-secondary p-8 rounded-3xl shadow-md relative flex flex-col justify-between h-[450px]">
                <div className="absolute top-0 right-6 -translate-y-1/2 bg-brand-secondary text-white text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                  MOST POPULAR
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-brand-secondary uppercase tracking-wider">Student Pro</h4>
                    <p className="text-2xl font-poppins font-black text-brand-primary mt-2">
                      {billingPeriod === "yearly" ? "$12" : "$15"}<span className="text-xs text-brand-text-secondary font-normal"> / month</span>
                    </p>
                    <p className="text-[10px] text-brand-text-secondary">Comprehensive career switch suite</p>
                  </div>
                  <ul className="space-y-3 text-xs text-brand-text-secondary font-medium">
                    <li className="flex items-center gap-2"><Check size={14} className="text-brand-secondary" /> Unlimited AI Coach Chat</li>
                    <li className="flex items-center gap-2"><Check size={14} className="text-brand-secondary" /> Unlimited PDF Resume Scans</li>
                    <li className="flex items-center gap-2"><Check size={14} className="text-brand-secondary" /> Full 30/60/90 Day Roadmaps</li>
                    <li className="flex items-center gap-2"><Check size={14} className="text-brand-secondary" /> Video Recruiter Simulations</li>
                    <li className="flex items-center gap-2"><Check size={14} className="text-brand-secondary" /> Live Technopark Job matches</li>
                  </ul>
                </div>
                <button onClick={() => router.push("/login")} className="w-full py-3 bg-[#0B5FFF] text-white font-bold rounded-2xl shadow-lg shadow-brand-secondary/25 hover:bg-[#084bca] transition-all cursor-pointer text-xs">
                  Unlock Pro Access
                </button>
              </div>

              {/* Plan 3 */}
              <div className="bg-brand-bg border border-brand-border p-8 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-[450px]">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-brand-text-secondary uppercase tracking-wider">Institution & Recruiters</h4>
                    <p className="text-2xl font-poppins font-black text-brand-primary mt-2">Custom</p>
                    <p className="text-[10px] text-brand-text-secondary">For colleges and staffing platforms</p>
                  </div>
                  <ul className="space-y-3 text-xs text-brand-text-secondary font-medium">
                    <li className="flex items-center gap-2"><Check size={14} className="text-brand-success" /> Recruiter cohort search dashboard</li>
                    <li className="flex items-center gap-2"><Check size={14} className="text-brand-success" /> TPO analytics for entire campuses</li>
                    <li className="flex items-center gap-2"><Check size={14} className="text-brand-success" /> API access for placement reports</li>
                    <li className="flex items-center gap-2"><Check size={14} className="text-brand-success" /> Dedicated account manager support</li>
                  </ul>
                </div>
                <button onClick={() => scrollToId("contact")} className="w-full py-3 bg-brand-primary text-white font-bold rounded-2xl hover:bg-[#112d7c] transition-all cursor-pointer text-xs">
                  Contact Sales Office
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section id="faq" className="py-24 px-6 bg-[#F8FAFC]">
          <div className="max-w-3xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#0B5FFF]">Common Questions</h2>
              <h3 className="text-3xl font-poppins font-bold text-brand-primary tracking-tight">
                Frequently Asked Inquiries
              </h3>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "What is the Placement Readiness score and how is it calculated?",
                  a: "The Placement Readiness score is a predictive metric calculated by evaluating your academic performance (CGPA), the count and quality of technical projects, outstanding backlogs, and your consistency on DSA exercises. Scores above 75% match active recruiter thresholds."
                },
                {
                  q: "Does Vedha AI scrape jobs from Technopark and Infopark directly?",
                  a: "Yes, our background workers scrape active job directories and public job boards from major technology hubs in Kerala (Technopark Trivandrum, Infopark Kochi, Cyberpark Kozhikode) daily. The matching engine compares these job profiles with student portfolios."
                },
                {
                  q: "Can I simulate video interview questions for custom roles?",
                  a: "Yes! By navigating to the Video Interview portal, you can input any custom job title (e.g. Computer Vision Engineer). The system utilizes an LLM to generate targeted questions and uses video stream simulation to help you practice."
                },
                {
                  q: "How does college integration work for TPO coordinators?",
                  a: "Institutions receive custom cohort dashboards. Training & Placement Officers can monitor real-time class readiness scores, spot lagging students, and export filtered candidate listings directly to partner company HR teams."
                }
              ].map((faq, idx) => (
                <div key={idx} className="bg-white border border-brand-border rounded-2xl overflow-hidden transition-all shadow-sm">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                    className="w-full p-5 flex items-center justify-between text-left font-bold text-brand-primary text-sm focus:outline-none cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {expandedFaq === idx ? <Minus size={16} /> : <Plus size={16} />}
                  </button>
                  <AnimatePresence initial={false}>
                    {expandedFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-brand-border/60"
                      >
                        <p className="p-5 text-xs sm:text-sm text-brand-text-secondary leading-relaxed bg-[#F8FAFC]">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Us Section */}
        <section id="contact" className="py-24 px-6 bg-white border-t border-brand-border/60">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#0B5FFF]">Get in Touch</span>
              <h3 className="text-3xl font-poppins font-bold text-brand-primary tracking-tight">
                Connect with our Technical Team
              </h3>
              <p className="text-xs sm:text-sm text-brand-text-secondary leading-relaxed">
                Have questions about deployment parameters, campus licenses, or recruiter dashboards? Send us an inquiry and our team will get back to you within 24 hours.
              </p>

              <div className="space-y-4 text-xs font-semibold text-brand-text-secondary pt-4">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-brand-secondary" />
                  <span>support@vedha-ai.org</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users size={16} className="text-brand-secondary" />
                  <span>SCT Technology Hub, Trivandrum, Kerala</span>
                </div>
              </div>
            </div>

            <div className="bg-brand-bg border border-brand-border p-8 rounded-3xl shadow-sm">
              {contactSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8 space-y-3"
                >
                  <div className="w-12 h-12 bg-brand-success/15 text-brand-success rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={24} />
                  </div>
                  <h4 className="font-bold text-brand-primary">Inquiry Sent Successfully!</h4>
                  <p className="text-xs text-brand-text-secondary">We have logged your ticket and will email you shortly.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-brand-text-secondary font-bold mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Enter full name"
                      className="w-full bg-white border border-brand-border px-4 py-3 rounded-xl focus:outline-none focus:border-brand-secondary font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-brand-text-secondary font-bold mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="name@college.edu"
                      className="w-full bg-white border border-brand-border px-4 py-3 rounded-xl focus:outline-none focus:border-brand-secondary font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-brand-text-secondary font-bold mb-1">Message Detail</label>
                    <textarea
                      rows={3}
                      required
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Specify your inquiry details..."
                      className="w-full bg-white border border-brand-border px-4 py-3 rounded-xl focus:outline-none focus:border-brand-secondary font-medium"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#0B5FFF] hover:bg-[#084bca] text-white font-bold rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Submit Ticket
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-brand-primary text-slate-300 py-16 px-6 border-t border-slate-800">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <VedhaLogo showText={true} size="md" className="filter invert brightness-0" />
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Empowering student technical switch loops and bridging hiring gaps across Kerala's technology ecosystems.
              </p>
            </div>
            
            <div className="space-y-3">
              <h5 className="text-xs font-extrabold uppercase tracking-widest text-brand-accent">Student Links</h5>
              <ul className="space-y-2 text-[11px] text-slate-400">
                <li><button onClick={() => router.push("/login")} className="hover:text-white cursor-pointer">Register Student Account</button></li>
                <li><button onClick={() => router.push("/login")} className="hover:text-white cursor-pointer">Resume Checker Portal</button></li>
                <li><button onClick={() => router.push("/login")} className="hover:text-white cursor-pointer">AI Mock Recruiter</button></li>
                <li><button onClick={() => router.push("/login")} className="hover:text-white cursor-pointer">DSA track training</button></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h5 className="text-xs font-extrabold uppercase tracking-widest text-brand-accent">Institution</h5>
              <ul className="space-y-2 text-[11px] text-slate-400">
                <li><button onClick={() => scrollToId("features")} className="hover:text-white cursor-pointer">Campus Cohort System</button></li>
                <li><button onClick={() => scrollToId("pricing")} className="hover:text-white cursor-pointer">College Licensing</button></li>
                <li><button onClick={() => scrollToId("contact")} className="hover:text-white cursor-pointer">TPO Coordinator Support</button></li>
                <li><button onClick={() => scrollToId("faq")} className="hover:text-white cursor-pointer">Security & API parameters</button></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h5 className="text-xs font-extrabold uppercase tracking-widest text-brand-accent">System Parameters</h5>
              <p className="text-[10px] text-slate-400">
                Version 3.0.0 (Llama-3.3-70b/GROQ)<br />
                Powered by FastAPI backend and React 19 Next.js frontend portals.<br />
                © {new Date().getFullYear()} Vedha AI Foundation.
              </p>
            </div>
          </div>
        </footer>

      </div>
    </ConfigProvider>
  );
}