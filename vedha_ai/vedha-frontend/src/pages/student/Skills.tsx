import { useEffect, useState } from "react";
import {
  Star,
  CheckCircle,
  AlertTriangle,
  Play,
  TrendingUp,
  Award,
  ChevronRight,
  BookOpen,
  Trash2,
  Plus,
  Briefcase,
} from "lucide-react";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import DashboardLayout from "@/layouts/DashboardLayout";
import Button from "@/components/ui/button/Button";
import Card from "@/components/ui/card/Card";
import Input from "@/components/ui/input/Input";
import PageHeader from "@/components/ui/layout/PageHeader";
import {
  getSkills,
  createSkill,
  deleteSkill,
  type Skill,
} from "@/services/skillService";

// Mock assessment questions
const QUIZ_QUESTIONS = [
  {
    id: 1,
    q: "Which hook is used to perform side effects in React?",
    options: ["useState", "useEffect", "useContext", "useReducer"],
    answer: "useEffect",
  },
  {
    id: 2,
    q: "What is the time complexity of searching in a balanced binary search tree (BST)?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
    answer: "O(log n)",
  },
  {
    id: 3,
    q: "In CSS Flexbox, which property aligns flex items along the main axis?",
    options: ["align-items", "justify-content", "align-content", "flex-direction"],
    answer: "justify-content",
  },
];

// Mock skill history trend data
const SKILL_HISTORY_DATA = [
  { week: "Week 1", React: 60, Python: 40, SQL: 50 },
  { week: "Week 2", React: 65, Python: 45, SQL: 60 },
  { week: "Week 3", React: 75, Python: 45, SQL: 70 },
  { week: "Week 4", React: 80, Python: 50, SQL: 70 },
];

export default function Skills() {
  const navigate = useNavigate();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  // Skill inputs
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillProficiency, setNewSkillProficiency] = useState("Intermediate");
  const [newSkillRating, setNewSkillRating] = useState(70); // 0-100%

  // Assessment Quiz State
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [score, setScore] = useState<number | null>(null);

  // Skill Gap visualization data
  const gapData = [
    { subject: "React", current: 80, market: 90 },
    { subject: "Python", current: 50, market: 85 },
    { subject: "SQL", current: 70, market: 75 },
    { subject: "Docker", current: 30, market: 80 },
    { subject: "FastAPI", current: 40, market: 75 },
    { subject: "Git", current: 90, market: 95 },
  ];

  async function loadSkills() {
    try {
      setLoading(true);
      const data = await getSkills();
      setSkills(data);
    } catch {
      toast.error("Failed to load skills listing from backend.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const init = async () => {
      await loadSkills();
    };
    void init();
  }, []);

  async function handleAddSkill() {
    if (!newSkillName.trim()) {
      toast.error("Skill name cannot be empty.");
      return;
    }

    try {
      const added = await createSkill({
        skill_name: newSkillName.trim(),
        proficiency_level: `${newSkillProficiency} (${newSkillRating}%)`,
        is_primary: true,
      });
      setSkills((prev) => [...prev, added]);
      setNewSkillName("");
      toast.success("Skill added to profile successfully!");
    } catch {
      toast.error("Failed to add skill.");
    }
  }

  async function handleDeleteSkill(id?: number) {
    if (id === undefined) return;
    try {
      await deleteSkill(id);
      setSkills(skills.filter((s) => s.id !== id));
      toast.success("Skill removed from profile.");
    } catch {
      toast.error("Failed to delete skill.");
    }
  }

  // Quiz mechanics
  function handleStartQuiz() {
    setIsQuizActive(true);
    setCurrentQuestionIdx(0);
    setSelectedOption("");
    setScore(null);
  }

  function handleOptionSelect(option: string) {
    setSelectedOption(option);
  }

  function handleNextQuestion() {
    let newScore = score ?? 0;
    if (selectedOption === QUIZ_QUESTIONS[currentQuestionIdx].answer) {
      newScore += 1;
    }
    setScore(newScore);

    if (currentQuestionIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
      setSelectedOption("");
    } else {
      setIsQuizActive(false);
      toast.success(`Assessment completed! Score: ${newScore}/${QUIZ_QUESTIONS.length}`);
    }
  }

  function handleConnectJobSearch(skillName: string) {
    toast.info(`Filtering Ecosystem Job board for ${skillName} roles...`);
    navigate(`/student/jobs`);
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        
        {/* Master Page Header */}
        <PageHeader
          title="Skills & Skill Gap Intelligence"
          subtitle="Assess your professional capabilities, isolate technical skill gaps, and take tests to earn credentials."
          icon={<Star size={22} />}
        />

        <div className="grid gap-8 lg:grid-cols-3">
          
          {/* Skill Gap Analysis chart */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <Card variant="glass" className="p-6">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-6">
                  <TrendingUp className="text-cyan-400" />
                  <div>
                    <h3 className="text-md font-bold text-white">Proficiency Gap Radar</h3>
                    <p className="text-[10px] text-slate-500">Your level vs Market expectations</p>
                  </div>
                </div>
                <div className="h-[240px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={gapData}>
                      <PolarGrid stroke="#1e293b" />
                      <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={9} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={8} />
                      <Radar name="Your Skills" dataKey="current" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.25} />
                      <Radar name="Market Target" dataKey="market" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.15} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Skill history chart */}
              <Card variant="glass" className="p-6">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-6">
                  <TrendingUp className="text-violet-400" />
                  <div>
                    <h3 className="text-md font-bold text-white">Growth History Trends</h3>
                    <p className="text-[10px] text-slate-500">Weekly proficiency tracking</p>
                  </div>
                </div>
                <div className="h-[240px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={SKILL_HISTORY_DATA}>
                      <XAxis dataKey="week" stroke="#94a3b8" fontSize={10} />
                      <YAxis stroke="#94a3b8" fontSize={10} />
                      <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b" }} />
                      <Line type="monotone" dataKey="React" stroke="#06b6d4" strokeWidth={2} />
                      <Line type="monotone" dataKey="Python" stroke="#8b5cf6" strokeWidth={2} />
                      <Line type="monotone" dataKey="SQL" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {/* Quiz / Assessment Panel */}
            <Card variant="glass" className="p-6">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-6">
                <Award className="text-amber-400" />
                <div>
                  <h3 className="text-md font-bold text-white">Skill Assessment Simulator</h3>
                  <p className="text-[10px] text-slate-500">Complete tests to earn verified badges</p>
                </div>
              </div>

              {!isQuizActive ? (
                <div className="space-y-4">
                  {score !== null && (
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="text-emerald-400" />
                        <div>
                          <p className="text-xs font-bold text-white">Latest Assessment Completed</p>
                          <p className="text-[10px] text-slate-400">Score: {score}/{QUIZ_QUESTIONS.length}</p>
                        </div>
                      </div>
                      <span className="rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 text-[10px] font-bold">
                        VERIFIED
                      </span>
                    </div>
                  )}

                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">Ecosystem Core Skills Quiz</h4>
                      <p className="text-xs text-slate-400 mt-1">Covers React Hooks, DSA Binary Search Trees, and CSS Flexbox Layouts.</p>
                    </div>
                    <Button onClick={handleStartQuiz} className="flex items-center gap-2 text-xs py-2">
                      <Play size={12} className="fill-current" />
                      Start Assessment
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>Question {currentQuestionIdx + 1} of {QUIZ_QUESTIONS.length}</span>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white leading-relaxed">
                      {QUIZ_QUESTIONS[currentQuestionIdx].q}
                    </h4>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {QUIZ_QUESTIONS[currentQuestionIdx].options.map((opt) => {
                      const isSelected = selectedOption === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() => handleOptionSelect(opt)}
                          className={`rounded-xl border p-4 text-left text-xs font-semibold transition ${
                            isSelected
                              ? "border-cyan-500 bg-cyan-500/10 text-cyan-300 shadow-inner"
                              : "border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-white"
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex justify-end border-t border-slate-900 pt-4">
                    <Button onClick={handleNextQuestion} disabled={!selectedOption}>
                      Next Question
                      <ChevronRight size={14} className="ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Right Column: Skills list and Skill additions */}
          <div className="space-y-8">
            <Card variant="glass" className="p-6 space-y-6">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white">Configure Skills List</h3>
                <p className="text-[10px] text-slate-500">Add or remove skills in your profile</p>
              </div>

              <div className="space-y-4">
                <Input
                  label="Skill Name"
                  placeholder="e.g. React Native, AWS"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Proficiency</label>
                    <select
                      value={newSkillProficiency}
                      onChange={(e) => setNewSkillProficiency(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-cyan-500 outline-none"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Rating (0-100%)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={newSkillRating}
                      onChange={(e) => setNewSkillRating(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-cyan-500 outline-none"
                    />
                  </div>
                </div>
                <Button onClick={handleAddSkill} className="w-full flex items-center justify-center gap-1.5">
                  <Plus size={14} />
                  Add Skill
                </Button>
              </div>

              {loading ? (
                <div className="text-center text-xs text-slate-500 py-4 animate-pulse">Loading skills...</div>
              ) : skills.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-4">No skills loaded yet.</p>
              ) : (
                <div className="space-y-2 border-t border-slate-900 pt-4 max-h-[220px] overflow-y-auto">
                  {skills.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-xl bg-slate-950/40 border border-slate-850 p-2.5 px-3 text-xs"
                    >
                      <div>
                        <span className="font-semibold text-slate-200">{item.skill_name}</span>
                        <span className="text-[9px] uppercase font-bold text-cyan-400 ml-2 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/25">
                          {item.proficiency_level}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteSkill(item.id)}
                        className="text-slate-500 hover:text-red-400 transition"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* AI Recommendations connected to Jobs search */}
            <Card variant="glass" className="p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <BookOpen size={16} className="text-violet-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">AI Skill Gaps Tips</h3>
              </div>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    You have <span className="text-amber-400 font-bold">3 missing key skills</span> (Docker, FastAPI, SQL) for your target role.
                  </p>
                </div>
                
                <div className="space-y-2 pt-2">
                  {[
                    { name: "Docker", level: "Recommended" },
                    { name: "FastAPI", level: "Priority" },
                  ].map((rec) => (
                    <div key={rec.name} className="rounded-xl bg-slate-950/50 p-3 border border-slate-900 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-white text-[10px]">{rec.name}</span>
                        <span className="text-[8px] bg-violet-500/10 text-violet-400 border border-violet-500/20 px-1 rounded ml-2">{rec.level}</span>
                      </div>
                      <button
                        onClick={() => handleConnectJobSearch(rec.name)}
                        className="text-cyan-400 hover:text-cyan-300 font-bold text-[10px] flex items-center gap-0.5"
                      >
                        <Briefcase size={10} />
                        Jobs
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
