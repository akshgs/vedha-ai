import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Building2,
  Users,
  Briefcase,
  School,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Award,
  Globe,
  Star,
  BookOpen
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/input/Input";
import useAuth from "@/hooks/useAuth";

import {
  completeStudentOnboarding,
  getOnboardingTrends,
  getOnboardingRoadmap,
  type AssessedSkill,
  type IndustryIntelligence,
  type RoadmapTemplate
} from "@/services/onboarding";

// 11 Career path tracks for students
const CAREER_TRACKS = [
  { id: "Backend Engineer", title: "Backend Engineer", emoji: "🤖", desc: "Build backend logic, databases, performance, and scalable microservices." },
  { id: "Frontend Engineer", title: "Frontend Engineer", emoji: "🎨", desc: "Create interactive user interfaces, optimizations, and web layouts." },
  { id: "Full Stack Developer", title: "Full Stack Developer", emoji: "💻", desc: "Master both client interfaces and application server layers." },
  { id: "AI Engineer", title: "AI Engineer", emoji: "🧠", desc: "Integrate Large Language Models, agent frameworks, and context stores." },
  { id: "ML Engineer", title: "ML Engineer", emoji: "📊", desc: "Train statistical classifiers, evaluate neural models, and build pipelines." },
  { id: "Data Scientist", title: "Data Scientist", emoji: "📈", desc: "Extract business insights, run analysis, and present analytics models." },
  { id: "DevOps Engineer", title: "DevOps Engineer", emoji: "⚡", desc: "Manage server networks, Docker containers, AWS systems, and CI/CD pipelines." },
  { id: "Cloud Engineer", title: "Cloud Engineer", emoji: "☁️", desc: "Implement AWS setups, serverless patterns, and cluster scale controls." },
  { id: "Cyber Security", title: "Cyber Security Specialist", emoji: "🛡️", desc: "Audit server security protocols, configure firewalls, and fix leaks." },
  { id: "Mobile Developer", title: "Mobile Developer", emoji: "📱", desc: "Build iOS & Android apps using React Native or Native SDKs." },
  { id: "Other", title: "General Technologist", emoji: "🚀", desc: "Explore multi-domain tech stacks and general engineering tracks." }
];

// Preselected assessment skills list
const PRESELECTED_SKILLS = [
  { name: "Python", category: "Backend" },
  { name: "JavaScript", category: "Frontend" },
  { name: "React", category: "Frontend" },
  { name: "TypeScript", category: "Frontend" },
  { name: "SQL", category: "Database" },
  { name: "FastAPI", category: "Backend" },
  { name: "Git", category: "DevOps" },
  { name: "Docker", category: "DevOps" },
  { name: "AWS Cloud", category: "Cloud" },
  { name: "Java", category: "Backend" },
  { name: "C++", category: "Backend" },
  { name: "PyTorch", category: "AI/ML" }
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [step, setStep] = useState(1);

  // Local onboarding state
  const [role, setRole] = useState<string>(user?.role || "student");

  // Student AI Onboarding States
  const [targetRole, setTargetRole] = useState<string>("Backend Engineer");
  const [assessedSkills, setAssessedSkills] = useState<Record<string, string>>({}); // skill_name -> proficiency
  const [trendsData, setTrendsData] = useState<IndustryIntelligence | null>(null);
  const [roadmapData, setRoadmapData] = useState<RoadmapTemplate | null>(null);
  const [loadingTrends, setLoadingTrends] = useState(false);
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);

  // Student fields (college, degree, experience level, bio/interests)
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [degree, setDegree] = useState("");
  const [college, setCollege] = useState("");
  const [experience, setExperience] = useState("Fresher"); // Fresher | Intern | 1-3 Years | Senior
  const [bio, setBio] = useState("");

  // Legacy Employee/Mentor fields
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [pricing, setPricing] = useState("");

  // Legacy Company fields
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [companyIndustry, setCompanyIndustry] = useState("");

  // Legacy University fields
  const [universityLocation, setUniversityLocation] = useState("");
  const [studentCount, setStudentCount] = useState("");

  // Handle skill cycle for assessment step
  function cycleSkillProficiency(skillName: string) {
    const current = assessedSkills[skillName];
    let next = "Beginner";
    if (current === "Beginner") next = "Intermediate";
    else if (current === "Intermediate") next = "Expert";
    else if (current === "Expert") {
      const copy = { ...assessedSkills };
      delete copy[skillName];
      setAssessedSkills(copy);
      return;
    }
    setAssessedSkills({ ...assessedSkills, [skillName]: next });
  }

  // Load trends when entering Step 5 (Student Onboarding)
  useEffect(() => {
    if (role === "student" && step === 5) {
      async function loadTrends() {
        setLoadingTrends(true);
        try {
          const data = await getOnboardingTrends(targetRole);
          setTrendsData(data);
        } catch {
          toast.error("Failed to query live industry intelligence.");
        } finally {
          setLoadingTrends(false);
        }
      }
      void loadTrends();
    }
  }, [step, targetRole, role]);

  // Load roadmap preview when entering Step 6 (Student Onboarding)
  useEffect(() => {
    if (role === "student" && step === 6) {
      async function loadRoadmap() {
        setLoadingRoadmap(true);
        try {
          const data = await getOnboardingRoadmap(targetRole);
          setRoadmapData(data);
        } catch {
          toast.error("Failed to fetch personalized learning roadmap.");
        } finally {
          setLoadingRoadmap(false);
        }
      }
      void loadRoadmap();
    }
  }, [step, targetRole, role]);

  function addSkill() {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  }

  function removeSkill(item: string) {
    setSkills(skills.filter((s) => s !== item));
  }

  async function handleFinish() {
    if (role === "student") {
      const formattedSkills: AssessedSkill[] = Object.entries(assessedSkills).map(([name, level]) => ({
        skill_name: name,
        proficiency_level: level
      }));

      try {
        await completeStudentOnboarding({
          target_role: targetRole,
          skills: formattedSkills,
          college: college || undefined,
          degree: degree || undefined,
          experience: experience || undefined,
          interests: bio || undefined
        });

        localStorage.setItem("onboarding_complete", "true");
        toast.success("AI Career Profile completed! Welcome to Vedha AI.");
      } catch {
        toast.error("Onboarding setup failed. Storing setup locally.");
        localStorage.setItem("onboarding_complete", "true");
      }
    } else {
      toast.success("Profile setup complete! Welcome to Vedha AI.");
    }

    if (refreshUser) {
      try {
        await refreshUser();
      } catch (e) {
        console.error(e);
      }
    }

    // Redirect based on selected role
    switch (role) {
      case "student":
        navigate("/student/dashboard");
        break;
      case "employee":
        navigate("/employee/dashboard");
        break;
      case "mentor":
        navigate("/student/dashboard");
        break;
      case "company":
      case "recruiter":
        navigate("/company/dashboard");
        break;
      case "university":
        navigate("/student/dashboard");
        break;
      default:
        navigate("/dashboard");
    }
  }

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  const totalSteps = role === "student" ? 6 : 3;

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-slate-950 px-6 py-8 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-slate-950 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950" />
      <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-xl relative z-10">

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-slate-400">
            <span>AI Career Ecosystem Onboarding</span>
            <span>Step {step} of {totalSteps}</span>
          </div>
          <div className="mt-2 h-1 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait" custom={step}>

          {/* STEP 1: General Role Selection / Welcome */}
          {step === 1 && (
            <motion.div
              key="step1"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-xl font-bold text-white tracking-tight">Choose Your Primary Role</h2>
                <p className="mt-1.5 text-xs text-slate-400">
                  Select how you will participate in the career ecosystem.
                </p>
              </div>

              <div className="mb-6 rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-xs leading-relaxed space-y-1.5 text-slate-400">
                <div><strong className="text-cyan-400 font-semibold uppercase tracking-wider text-[10px]">Why this exists:</strong> <span className="text-slate-300">We connect Students, Mentors, Companies, and Universities into one seamless environment.</span></div>
                <div className="mt-1"><strong className="text-violet-400 font-semibold uppercase tracking-wider text-[10px]">What you gain:</strong> <span className="text-slate-300">A personalized dashboard matching your specific role and responsibilities.</span></div>
                <div className="mt-1"><strong className="text-amber-400 font-semibold uppercase tracking-wider text-[10px]">What is next:</strong> <span className="text-slate-300">Setting your career goal to tailor your ecosystem roadmap.</span></div>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {[
                  { id: "student", label: "Student", icon: GraduationCap, color: "text-cyan-400 border-cyan-500/25 bg-cyan-500/5 hover:border-cyan-500/60" },
                  { id: "employee", label: "Industry Employee", icon: Briefcase, color: "text-violet-400 border-violet-500/25 bg-violet-500/5 hover:border-violet-500/60" },
                  { id: "mentor", label: "Professional Mentor", icon: Users, color: "text-emerald-400 border-emerald-500/25 bg-emerald-500/5 hover:border-emerald-500/60" },
                  { id: "company", label: "Company / Recruiter", icon: Building2, color: "text-blue-400 border-blue-500/25 bg-blue-500/5 hover:border-blue-500/60" },
                  { id: "university", label: "University Placement", icon: School, color: "text-amber-400 border-amber-500/25 bg-amber-500/5 hover:border-amber-500/60" },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = role === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setRole(item.id)}
                      className={`flex flex-col items-center gap-3 rounded-xl border p-5 text-center transition-all duration-300 cursor-pointer ${item.color} ${isSelected
                          ? "border-cyan-500 scale-102 shadow-lg shadow-cyan-500/5 bg-slate-900/80 text-white opacity-100"
                          : "opacity-60 text-slate-400"
                        }`}
                    >
                      <Icon size={24} />
                      <span className="text-xs font-semibold">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={() => setStep(2)}>
                  Next Step
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STUDENT - STEP 2: Choose Career Goal */}
          {role === "student" && step === 2 && (
            <motion.div
              key="student-step2"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-xl font-bold text-white tracking-tight flex justify-center items-center gap-2">
                  <Sparkles size={18} className="text-cyan-400 animate-pulse" />
                  Select Your Career Target Goal
                </h2>
                <p className="mt-1.5 text-xs text-slate-400">
                  Select your target role to lock in your curriculum.
                </p>
              </div>

              <div className="mb-6 rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-xs leading-relaxed space-y-1.5 text-slate-400">
                <div><strong className="text-cyan-400 font-semibold uppercase tracking-wider text-[10px]">Why this exists:</strong> <span className="text-slate-300">Aligns your ecosystem learning modules and recruiter matching to your target job profile.</span></div>
                <div className="mt-1"><strong className="text-violet-400 font-semibold uppercase tracking-wider text-[10px]">What you gain:</strong> <span className="text-slate-300">Customized learning milestones and targeted verified badges.</span></div>
                <div className="mt-1"><strong className="text-amber-400 font-semibold uppercase tracking-wider text-[10px]">What is next:</strong> <span className="text-slate-300">Self-assessing your current skills to isolate upskilling gaps.</span></div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 max-h-[250px] overflow-y-auto pr-1">
                {CAREER_TRACKS.map((track) => {
                  const isSelected = targetRole === track.id;
                  return (
                    <button
                      key={track.id}
                      onClick={() => setTargetRole(track.id)}
                      className={`flex items-start gap-3 rounded-xl border p-3.5 text-left transition duration-200 cursor-pointer ${isSelected
                          ? "border-cyan-500 bg-cyan-500/5 text-white"
                          : "border-slate-800 hover:border-slate-700 bg-slate-950/20 text-slate-400"
                        }`}
                    >
                      <span className="text-2xl mt-0.5">{track.emoji}</span>
                      <div>
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                          {track.title}
                          {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />}
                        </h4>
                        <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{track.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={() => setStep(3)}>
                  Next: Skill Assessment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STUDENT - STEP 3: Skill Self-Assessment */}
          {role === "student" && step === 3 && (
            <motion.div
              key="student-step3"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-xl font-bold text-white tracking-tight flex justify-center items-center gap-2">
                  <Star size={18} className="text-yellow-400 animate-pulse" />
                  Skill DNA Assessment
                </h2>
                <p className="mt-1.5 text-xs text-slate-400">
                  Tell us what you already know. Click a tool block to cycle proficiency level or remove it.
                </p>
              </div>

              <div className="mb-6 rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-xs leading-relaxed space-y-1.5 text-slate-400">
                <div><strong className="text-cyan-400 font-semibold uppercase tracking-wider text-[10px]">Why this exists:</strong> <span className="text-slate-300">Determines your professional starting baseline to bypass introductory concepts.</span></div>
                <div className="mt-1"><strong className="text-violet-400 font-semibold uppercase tracking-wider text-[10px]">What you gain:</strong> <span className="text-slate-300">Skip lessons you have already mastered and save learning hours.</span></div>
                <div className="mt-1"><strong className="text-amber-400 font-semibold uppercase tracking-wider text-[10px]">What is next:</strong> <span className="text-slate-300">Providing academic context to configure recruiter profiles.</span></div>
              </div>

              <div className="grid grid-cols-3 gap-3 max-h-[220px] overflow-y-auto pr-1">
                {PRESELECTED_SKILLS.map((item) => {
                  const level = assessedSkills[item.name];
                  const isSelected = !!level;
                  const levelColors = level === "Expert" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : level === "Intermediate" ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30" : "bg-violet-500/10 text-violet-400 border-violet-500/30";

                  return (
                    <button
                      key={item.name}
                      onClick={() => cycleSkillProficiency(item.name)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition duration-200 cursor-pointer ${isSelected
                          ? `border-cyan-500 bg-slate-900/60 scale-102`
                          : "border-slate-800 bg-slate-950/20 hover:border-slate-700 opacity-60 text-slate-400"
                        }`}
                    >
                      <span className="text-xs font-bold text-white text-center leading-snug">{item.name}</span>
                      <span className="text-[8px] text-slate-500 mt-1 uppercase font-bold tracking-wider">{item.category}</span>

                      {isSelected && (
                        <span className={`mt-2 rounded px-1.5 py-0.5 text-[8px] font-black uppercase border ${levelColors}`}>
                          {level}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(2)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={() => setStep(4)}>
                  Next: Education & Experience
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STUDENT - STEP 4: Current Education & Experience Level & Interests */}
          {role === "student" && step === 4 && (
            <motion.div
              key="student-step4"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-4"
            >
              <div className="text-center">
                <h2 className="text-xl font-bold text-white tracking-tight">Academic & Experience Background</h2>
                <p className="mt-1.5 text-xs text-slate-400">
                  Provide supplementary details to finalize your profile setup.
                </p>
              </div>

              <div className="mb-4 rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-xs leading-relaxed space-y-1.5 text-slate-400">
                <div><strong className="text-cyan-400 font-semibold uppercase tracking-wider text-[10px]">Why this exists:</strong> <span className="text-slate-300">Contextualizes your profile for corporate recruiters seeking candidates of specific graduation levels or experience tiers.</span></div>
                <div className="mt-1"><strong className="text-violet-400 font-semibold uppercase tracking-wider text-[10px]">What you gain:</strong> <span className="text-slate-300">Accurate indexing in hiring searches, matching projects, and target role suggestions.</span></div>
                <div className="mt-1"><strong className="text-amber-400 font-semibold uppercase tracking-wider text-[10px]">What is next:</strong> <span className="text-slate-300">Consulting market demand databases for live target role metrics.</span></div>
              </div>

              <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1 text-left">
                <Input
                  label="Degree / Program"
                  placeholder="e.g. B.Tech Computer Science"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                />
                <Input
                  label="College / Institution Name"
                  placeholder="e.g. Indian Institute of Technology"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                />
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Experience Tier</label>
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full rounded-xl border border-slate-850 bg-slate-950 px-4 py-2.5 text-xs text-white outline-none focus:border-cyan-500"
                  >
                    <option value="Fresher">Fresher (Looking for first job)</option>
                    <option value="Intern">Intern (Seeking internships)</option>
                    <option value="Intermediate">Intermediate (1-3 years preparation)</option>
                    <option value="Senior">Senior (3+ years experience)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Professional Interests & Bio</label>
                  <textarea
                    placeholder="e.g. Interested in building scalable APIs, machine learning pipelines, and cloud containers..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full rounded-xl border border-slate-850 bg-slate-950 p-3 text-xs text-white outline-none focus:border-cyan-500"
                    rows={2}
                  />
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={() => setStep(3)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={() => setStep(5)}>
                  Next: Industry Trends
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STUDENT - STEP 5: Industry Trends & AI Skill Gap Detection */}
          {role === "student" && step === 5 && (
            <motion.div
              key="student-step5"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-5"
            >
              <div className="text-center">
                <h2 className="text-xl font-bold text-white tracking-tight flex justify-center items-center gap-2">
                  <TrendingUp size={18} className="text-cyan-400" />
                  Trends & AI Skill Gap Analysis
                </h2>
                <p className="mt-1.5 text-xs text-slate-400">
                  Live market index metrics and key skill gaps compared for {targetRole}.
                </p>
              </div>

              <div className="mb-4 rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-xs leading-relaxed space-y-1.5 text-slate-400">
                <div><strong className="text-cyan-400 font-semibold uppercase tracking-wider text-[10px]">Why this exists:</strong> <span className="text-slate-300">Aligning targets with live market indicators ensures you are focusing on high-demand technical capabilities.</span></div>
                <div className="mt-1"><strong className="text-violet-400 font-semibold uppercase tracking-wider text-[10px]">What you gain:</strong> <span className="text-slate-300">Visualizing salary parameters, demand statistics, and direct gap analysis of skills you must acquire.</span></div>
                <div className="mt-1"><strong className="text-amber-400 font-semibold uppercase tracking-wider text-[10px]">What is next:</strong> <span className="text-slate-300">Reviewing stages of your personalized learning roadmap.</span></div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 text-left">
                {/* Trends info */}
                <div className="rounded-xl border border-slate-850 bg-slate-950/40 p-4 space-y-2">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <Globe size={11} /> Live Industry Statistics
                  </span>

                  {loadingTrends ? (
                    <div className="text-slate-500 text-xs italic py-8 text-center animate-pulse">Consulting trend database...</div>
                  ) : trendsData ? (
                    <div className="space-y-2.5 text-xs">
                      <div>
                        <span className="text-slate-500 text-[9px] block">Average Annual Package:</span>
                        <span className="text-white font-extrabold text-sm">{trendsData.average_salary} LPA</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[9px] block">Market Demand Index:</span>
                        <span className="text-emerald-400 font-extrabold block mt-0.5">{trendsData.demand_index}% (High Growth)</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[9px] block">Corporate Partners Hiring:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {trendsData.companies_hiring.slice(0, 3).map(c => (
                            <span key={c} className="text-[8px] bg-slate-900 border border-slate-850 px-1.5 py-0.5 rounded text-indigo-300">{c}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* AI Skill Gap Detection */}
                <div className="rounded-xl border border-slate-850 bg-slate-950/40 p-4 space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <Sparkles size={11} className="animate-spin" style={{ animationDuration: '6s' }} /> AI Skill Gap Detection
                    </span>
                    <p className="text-[10px] text-slate-500 mt-1">Self-rated vs Target Role expectations</p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-[9px] text-emerald-400 font-bold block">✓ Skills You Have:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {Object.keys(assessedSkills).length === 0 ? (
                          <span className="text-[9px] text-slate-650 italic">None selected</span>
                        ) : (
                          Object.keys(assessedSkills).slice(0, 3).map(s => (
                            <span key={s} className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded">{s}</span>
                          ))
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-[9px] text-red-400 font-bold block">⚠ Gap Skills Detected (To Acquire):</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {["FastAPI", "SQL", "Docker", "AWS Cloud"].filter(s => !assessedSkills[s]).map(s => (
                          <span key={s} className="text-[8px] bg-red-500/10 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={() => setStep(4)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={() => setStep(6)}>
                  Next: Roadmap & Courses
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STUDENT - STEP 6: Personalized Roadmap & Recommended Courses Preview */}
          {role === "student" && step === 6 && (
            <motion.div
              key="student-step6"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-5"
            >
              <div className="text-center">
                <h2 className="text-xl font-bold text-white tracking-tight flex justify-center items-center gap-2">
                  <Award size={18} className="text-violet-400" />
                  Personalized Roadmap & Courses
                </h2>
                <p className="mt-1.5 text-xs text-slate-400">
                  Your customized path and initial courses checklist to kickstart upskilling.
                </p>
              </div>

              <div className="mb-4 rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-xs leading-relaxed space-y-1.5 text-slate-400">
                <div><strong className="text-cyan-400 font-semibold uppercase tracking-wider text-[10px]">Why this exists:</strong> <span className="text-slate-300">A structured timeline with recommended academic courses keeps you focused on relevant credentials.</span></div>
                <div className="mt-1"><strong className="text-violet-400 font-semibold uppercase tracking-wider text-[10px]">What you gain:</strong> <span className="text-slate-300">Enrolling in courses that directly address your calculated skill gaps.</span></div>
                <div className="mt-1"><strong className="text-amber-400 font-semibold uppercase tracking-wider text-[10px]">What is next:</strong> <span className="text-slate-300">Saving this roadmap onto your dashboard operations control.</span></div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 text-left">
                {/* Roadmap Stages list */}
                <div className="rounded-xl border border-slate-850 bg-slate-950/40 p-4 space-y-2">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1.5">
                    <BookOpen size={11} /> Path Milestones Stages
                  </span>

                  {loadingRoadmap ? (
                    <div className="text-slate-500 text-xs italic py-8 text-center animate-pulse">Drafting roadmap stages...</div>
                  ) : roadmapData ? (
                    <div className="space-y-2.5 text-xs max-h-[140px] overflow-y-auto">
                      {roadmapData.stages.map((stage, idx) => (
                        <div key={idx} className="flex gap-2 border-l border-slate-800 pl-2 pb-1">
                          <div className="h-1.5 w-1.5 rounded-full bg-violet-500 mt-1 shrink-0" />
                          <div>
                            <p className="font-bold text-white text-[10px]">{stage.title} <span className="text-slate-500 text-[8px]">({stage.duration})</span></p>
                            <p className="text-[9px] text-slate-400 truncate max-w-[200px]">{stage.topics.join(", ")}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>

                {/* Recommended courses preview */}
                <div className="rounded-xl border border-slate-850 bg-slate-950/40 p-4 space-y-2">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                    <Star size={11} /> Recommended Starter Course
                  </span>
                  
                  <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-3 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded font-black uppercase">Beginner</span>
                      <span className="text-[8px] text-slate-500 font-semibold">15h lectures</span>
                    </div>
                    <h4 className="font-bold text-white leading-snug">
                      {targetRole.includes("Backend") || targetRole.includes("AI") 
                        ? "Python Backends with FastAPI & SQL" 
                        : targetRole.includes("Frontend")
                        ? "Vite + React: The Complete Guide"
                        : "Advanced System Design & Microservices"}
                    </h4>
                    <p className="text-[9px] text-slate-500">Includes sandbox coding practice and dynamic assessments.</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={() => setStep(5)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={handleFinish} className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
                  Start My Journey
                  <CheckCircle2 className="ml-2 h-4 w-4 text-emerald-400" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* LEGACY ROLES - STEP 2: Input details */}
          {role !== "student" && step === 2 && (
            <motion.div
              key="step2-legacy"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-xl font-bold text-white tracking-tight">Enter Your Details</h2>
                <p className="mt-1.5 text-xs text-slate-400">
                  Provide supplementary details to customize your dashboard experience.
                </p>
              </div>

              {/* Employee fields */}
              {role === "employee" && (
                <div className="space-y-4">
                  <Input
                    label="Job Title"
                    placeholder="e.g. Senior Software Engineer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                  />
                  <Input
                    label="Current Employer / Company"
                    placeholder="e.g. Google"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                  <Input
                    label="Years of Industry Experience"
                    placeholder="e.g. 5"
                    type="number"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                  />
                </div>
              )}

              {/* Mentor fields */}
              {role === "mentor" && (
                <div className="space-y-4">
                  <Input
                    label="Domain Expertise / Main Category"
                    placeholder="e.g. Frontend Web Dev, System Design"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                  />
                  <Input
                    label="Hourly Mentorship Session Rate (USD)"
                    placeholder="e.g. 50"
                    type="number"
                    value={pricing}
                    onChange={(e) => setPricing(e.target.value)}
                  />
                  <div className="ve-form-group">
                    <label className="ve-label">Short Bio</label>
                    <textarea
                      placeholder="Share a snippet of your mentorship goals and work experience..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-sm text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {/* Company fields */}
              {role === "company" && (
                <div className="space-y-4">
                  <Input
                    label="Company Name"
                    placeholder="e.g. Vercel Inc."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                  <Input
                    label="Corporate Website URL"
                    placeholder="e.g. https://vercel.com"
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                  />
                  <Input
                    label="Industry Sector"
                    placeholder="e.g. Software, Cloud Computing"
                    value={companyIndustry}
                    onChange={(e) => setCompanyIndustry(e.target.value)}
                  />
                </div>
              )}

              {/* University fields */}
              {role === "university" && (
                <div className="space-y-4">
                  <Input
                    label="Institution Location / Address"
                    placeholder="e.g. San Francisco, California"
                    value={universityLocation}
                    onChange={(e) => setUniversityLocation(e.target.value)}
                  />
                  <Input
                    label="Total Registered Students"
                    placeholder="e.g. 5000"
                    type="number"
                    value={studentCount}
                    onChange={(e) => setStudentCount(e.target.value)}
                  />
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={() => setStep(3)}>
                  Next Step
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* LEGACY ROLES - STEP 3: Keywords & Skills */}
          {role !== "student" && step === 3 && (
            <motion.div
              key="step3-legacy"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-xl font-bold text-white tracking-tight">Skills & Complete</h2>
                <p className="mt-1.5 text-xs text-slate-400">
                  Select keywords, skills, or tags to index your profile for searches.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <Input
                    placeholder="e.g. React, Python, Product Strategy"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                  />
                  <Button type="button" onClick={addSkill} className="shrink-0">
                     Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 min-h-[60px] p-4 rounded-xl border border-slate-800 bg-slate-950/30">
                  {skills.length === 0 ? (
                    <span className="text-xs text-slate-500 italic">No keywords added yet. Add some above!</span>
                  ) : (
                    skills.map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300"
                      >
                        {item}
                        <button
                          type="button"
                          onClick={() => removeSkill(item)}
                          className="hover:text-red-400 cursor-pointer"
                        >
                          &times;
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(2)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={handleFinish} className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
                  Finish Setup
                  <CheckCircle2 className="ml-2 h-4 w-4 text-emerald-400" />
                </Button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </main>
  );
}
