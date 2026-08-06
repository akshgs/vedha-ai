import { useState, useEffect } from "react";
import {
  Code as CodeIcon,
  Trophy,
  ChevronRight,
  Play,
  CheckCircle,
  RefreshCw,
  Terminal,
  Activity,
  Send,
  Zap,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/layouts/DashboardLayout";
import Button from "@/components/ui/button/Button";
import Card from "@/components/ui/card/Card";
import MonacoEditor from "@/components/coding/MonacoEditor";
import Modal from "@/components/ui/modal/Modal";
import {
  getCodingProblems,
  executeCode,
  submitCode,
  getSubmissions,
  getCodingStats,
  getCodingLeaderboard,
  type CodingProblem,
  type Submission,
  type LeaderboardUser,
  type CodingStats,
} from "@/services/coding";
import { getCodingAssistantHelp, type CodingHelpResponse } from "@/ai";

export default function Coding() {
  const [activeTab, setActiveTab] = useState<"problems" | "workspace" | "contests" | "submissions">("problems");
  const [problems, setProblems] = useState<CodingProblem[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<CodingProblem | null>(null);
  const [editorLanguage, setEditorLanguage] = useState("JavaScript");
  const [code, setCode] = useState("");

  // Submissions state
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [stats, setStats] = useState<CodingStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);

  // Loader states
  const [loading, setLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [compilerOutput, setCompilerOutput] = useState<string | null>(null);
  const [compileStatus, setCompileStatus] = useState<"success" | "error" | null>(null);

  // AI Assistant states
  const [aiLoading, setAiLoading] = useState(false);
  const [aiHelp, setAiHelp] = useState<CodingHelpResponse | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const probs = await getCodingProblems();
        setProblems(probs);
        if (probs.length > 0) {
          setSelectedProblem(probs[0]);
          setCode(probs[0].starterCode);
        }
        const s = await getCodingStats();
        setStats(s);
        const l = await getCodingLeaderboard();
        setLeaderboard(l);
        const subs = await getSubmissions();
        setSubmissions(subs);
      } catch {
        toast.error("Failed to load sandbox resources.");
      } finally {
        setLoading(false);
      }
    }
    void loadData();
  }, []);

  function handleSelectProblem(problem: CodingProblem) {
    setSelectedProblem(problem);
    setCode(problem.starterCode);
    setCompilerOutput(null);
    setCompileStatus(null);
    setAiHelp(null);
    setActiveTab("workspace");
  }

  async function handleRunCode() {
    if (!selectedProblem) return;
    setIsRunning(true);
    setCompilerOutput(null);
    setCompileStatus(null);

    try {
      const res = await executeCode(selectedProblem.id, code, editorLanguage);
      setCompileStatus(res.status);
      setCompilerOutput(res.output);
      toast.success("Test cases evaluated.");
    } catch {
      setCompileStatus("error");
      setCompilerOutput("Compilation Error: Internal execution timeout.");
    } finally {
      setIsRunning(false);
    }
  }

  async function handleSubmitCode() {
    if (!selectedProblem) return;
    setIsRunning(true);
    setCompilerOutput(null);

    try {
      const res = await submitCode(selectedProblem.id, code, editorLanguage);
      setCompileStatus(res.status);
      setCompilerOutput(res.output);
      
      const newSubmission: Submission = {
        id: Math.floor(Math.random() * 1000),
        problemId: selectedProblem.id,
        problemTitle: selectedProblem.title,
        status: res.status === "success" ? "Accepted" : "Wrong Answer",
        language: editorLanguage,
        runtime: res.runtime,
        memory: res.memory,
        submittedAt: new Date().toISOString(),
        code: code,
      };

      setSubmissions((prev) => [newSubmission, ...prev]);
      toast.success("Solution submitted successfully!");
      
      setProblems((prev) =>
        prev.map((p) => (p.id === selectedProblem.id ? { ...p, solved: true } : p))
      );
    } catch {
      setCompileStatus("error");
      setCompilerOutput("Submission Error.");
    } finally {
      setIsRunning(false);
    }
  }

  async function handleCallAIAssistant() {
    if (!selectedProblem) return;
    setAiLoading(true);
    setIsAiModalOpen(true);
    try {
      const res = await getCodingAssistantHelp(code, selectedProblem.id, editorLanguage, compilerOutput || undefined);
      setAiHelp(res);
      toast.success("AI code review completed!");
    } catch {
      toast.error("Failed to generate AI helper metrics.");
      setIsAiModalOpen(false);
    } finally {
      setAiLoading(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl bg-slate-905 border border-slate-800 p-8 text-center text-slate-500 animate-pulse">
          Loading sandbox compiler variables...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-900 pb-5">
          <div>
            <h1 className="page-title flex items-center gap-2.5">
              <CodeIcon className="text-cyan-400" size={22} />
              Coding Practice Sandbox
            </h1>
            <p className="page-subtitle">
              Practice data structures, solve daily challenges, and participate in contests to level up your XP.
            </p>
          </div>

          {/* Sub Navigation */}
          <div className="flex rounded-xl bg-slate-950/40 p-1 border border-slate-850 self-start md:self-auto flex-wrap">
            {[
              { id: "problems", label: "Problems List", icon: Activity },
              { id: "workspace", label: "Sandbox Workspace", icon: Terminal },
              { id: "submissions", label: "My Submissions", icon: CheckCircle },
              { id: "contests", label: "Contests History", icon: Trophy },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-cyan-500/15 border border-cyan-500/25 text-cyan-400 shadow-md shadow-cyan-500/5"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Icon size={13} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab 1: Problems List */}
        {activeTab === "problems" && (
          <div className="grid gap-6 lg:grid-cols-3">
            
            {/* Main Problems Table */}
            <div className="lg:col-span-2 space-y-6">
              <Card variant="glass" className="p-0 overflow-hidden shadow-xl">
                <div className="ve-card-header px-6 pt-5 pb-3">
                  <h3 className="ve-card-title">Algorithm Challenges</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="ve-table">
                    <thead>
                      <tr>
                        <th>Status</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Difficulty</th>
                        <th className="text-right"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {problems.map((prob) => (
                        <tr key={prob.id}>
                          <td>
                            {prob.solved ? (
                              <CheckCircle className="text-emerald-400" size={15} />
                            ) : (
                              <div className="h-3.5 w-3.5 rounded-full border border-slate-700" />
                            )}
                          </td>
                          <td className="font-semibold text-white">{prob.title}</td>
                          <td className="text-slate-400">{prob.category}</td>
                          <td>
                            <span
                              className={`rounded px-2.5 py-0.5 text-xs font-bold ${
                                prob.difficulty === "Easy"
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : prob.difficulty === "Medium"
                                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                  : "bg-red-500/10 text-red-400 border border-red-500/20"
                              }`}
                            >
                              {prob.difficulty}
                            </span>
                          </td>
                          <td className="text-right">
                            <button
                              onClick={() => handleSelectProblem(prob)}
                              className="text-cyan-400 hover:text-cyan-300 transition text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                            >
                              Solve
                              <ChevronRight size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* Sidebar Stats Panel */}
            <div className="space-y-6">
              {stats && (
                <Card variant="glass" className="p-5 space-y-4">
                  <div className="ve-card-header pb-2 mb-3">
                    <h3 className="ve-card-title uppercase tracking-wider text-xs">Practice Stats</h3>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">Coding Streak</span>
                    <span className="text-xs font-bold text-amber-500 flex items-center gap-1.5">
                      <Zap size={13} className="fill-current" />
                      {stats.streak} Days
                    </span>
                  </div>

                  <div className="space-y-3 pt-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-emerald-400 font-semibold">Easy</span>
                      <span className="text-white font-bold">{stats.easy}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-amber-400 font-semibold">Medium</span>
                      <span className="text-white font-bold">{stats.med}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-red-400 font-semibold">Hard</span>
                      <span className="text-white font-bold">{stats.hard}</span>
                    </div>
                  </div>
                </Card>
              )}

              {/* Leaderboard widget */}
              <Card variant="glass" className="p-5 space-y-4">
                <div className="ve-card-header pb-2 mb-3">
                  <h3 className="ve-card-title uppercase tracking-wider text-xs flex items-center gap-2">
                    <Trophy size={14} className="text-amber-400" />
                    Ecosystem Leaders
                  </h3>
                </div>
                <div className="space-y-2.5">
                  {leaderboard.slice(0, 3).map((item) => (
                    <div key={item.rank} className="flex justify-between text-xs bg-slate-950/40 p-2.5 rounded-lg border border-slate-850">
                      <span className="text-slate-350">#{item.rank} {item.name}</span>
                      <span className="text-cyan-400 font-bold">{item.points} XP</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Tab 2: Split Sandbox Workspace */}
        {activeTab === "workspace" && selectedProblem && (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left side problem description */}
            <Card variant="glass" className="p-6 flex flex-col h-[580px] overflow-hidden">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedProblem.title}</h3>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 block">
                    {selectedProblem.category}
                  </span>
                </div>
                <span
                  className={`rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                    selectedProblem.difficulty === "Easy"
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                      : selectedProblem.difficulty === "Medium"
                      ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                      : "bg-red-500/15 text-red-400 border border-red-500/30"
                  }`}
                >
                  {selectedProblem.difficulty}
                </span>
              </div>

              {/* Scrollable Problem details */}
              <div className="flex-1 overflow-y-auto py-4 space-y-5 text-xs text-slate-300 leading-relaxed">
                <div>
                  <p>{selectedProblem.desc}</p>
                </div>

                <div className="space-y-2 bg-slate-950 border border-slate-900 rounded-2xl p-4">
                  <p className="font-bold text-white text-[10px] uppercase tracking-wider">Example Test Case:</p>
                  <pre className="text-cyan-400 font-mono mt-1 text-[11px]">{selectedProblem.testCases}</pre>
                  <p className="font-bold text-white text-[10px] uppercase tracking-wider mt-3">Expected Output:</p>
                  <pre className="text-emerald-400 font-mono mt-1 text-[11px]">{selectedProblem.expected}</pre>
                </div>

                <div className="space-y-1 text-slate-400 text-[11px]">
                  <p className="font-bold text-slate-300">Constraints:</p>
                  <p>• 1 &lt;= nums.length &lt;= 10⁴</p>
                  <p>• -10⁹ &lt;= nums[i] &lt;= 10⁹</p>
                  <p>• -10⁹ &lt;= target &lt;= 10⁹</p>
                </div>
              </div>
            </Card>

            {/* Right side Monaco Editor + compiler outputs */}
            <div className="flex flex-col h-[580px] gap-6">
              {/* Language Selector + Editor */}
              <Card variant="glass" className="flex-1 flex flex-col overflow-hidden">
                <div className="border-b border-slate-800 p-4 flex justify-between items-center bg-slate-950/40">
                  <span className="text-xs font-bold text-slate-400">Monaco Core Sandbox</span>
                  <select
                    value={editorLanguage}
                    onChange={(e) => setEditorLanguage(e.target.value)}
                    className="bg-slate-900 border border-slate-800 text-xs text-white rounded-lg px-2 py-1 outline-none"
                  >
                    <option>JavaScript</option>
                    <option>Python</option>
                    <option>C++</option>
                    <option>Java</option>
                  </select>
                </div>

                <div className="flex-1 min-h-0 bg-slate-950">
                  <MonacoEditor
                    code={code}
                    onChange={setCode}
                    language={editorLanguage}
                  />
                </div>

                <div className="border-t border-slate-800 p-3 bg-slate-950/40 flex justify-end gap-3">
                  <Button variant="outline" onClick={handleCallAIAssistant} className="text-xs py-2 px-5 rounded-xl border-violet-500/30 text-violet-400 hover:bg-violet-500/10">
                    <Sparkles size={12} className="mr-1.5" />
                    AI Assistant
                  </Button>
                  <Button variant="outline" onClick={handleRunCode} disabled={isRunning} className="text-xs py-2 px-5 rounded-xl">
                    <Play size={12} className="mr-1.5 fill-current" />
                    Run Code
                  </Button>
                  <Button onClick={handleSubmitCode} disabled={isRunning} className="text-xs py-2 px-5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600">
                    <Send size={12} className="mr-1.5" />
                    Submit Solution
                  </Button>
                </div>
              </Card>

              {/* Console output display */}
              <Card variant="default" className="h-44 border-slate-800 bg-slate-950 p-4 overflow-y-auto flex flex-col">
                <div className="flex items-center gap-2 border-b border-slate-900 pb-2 mb-2">
                  <Terminal size={14} className="text-slate-400" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Console Terminal Output</span>
                </div>
                {isRunning ? (
                  <div className="flex-1 flex items-center justify-center gap-2 text-xs text-slate-500">
                    <RefreshCw className="animate-spin" size={14} />
                    Executing compiler...
                  </div>
                ) : compilerOutput ? (
                  <pre className={`text-[10px] font-mono whitespace-pre-line leading-relaxed ${compileStatus === "error" ? "text-red-400" : "text-slate-300"}`}>
                    {compilerOutput}
                  </pre>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-[10px] text-slate-500 italic">
                    Output will display here when you compile or execute code.
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}

        {/* Tab 3: Submission History */}
        {activeTab === "submissions" && (
          <Card variant="glass" className="p-6">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 mb-4 flex items-center gap-2">
              <CheckCircle className="text-emerald-400" size={20} />
              Submission Logbook
            </h3>
            {submissions.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-6">No solution submissions saved yet.</p>
            ) : (
              <div className="space-y-4">
                {submissions.map((sub) => (
                  <div key={sub.id} className="rounded-xl border border-slate-850 p-4 bg-slate-950/60 flex justify-between items-center text-xs">
                    <div>
                      <h4 className="font-bold text-white">{sub.problemTitle}</h4>
                      <p className="text-slate-400 mt-1">Lang: {sub.language} | Runtime: {sub.runtime} | Memory: {sub.memory}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        sub.status === "Accepted" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}>
                        {sub.status}
                      </span>
                      <p className="text-[10px] text-slate-500 mt-1">{new Date(sub.submittedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Tab 4: Contests History */}
        {activeTab === "contests" && (
          <Card variant="glass" className="p-6">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 mb-4">Competitions Console</h3>
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 px-2 py-0.5 text-[9px] font-bold">UPCOMING</span>
                  <h4 className="text-sm font-bold text-white mt-2">Weekly LeetCode contest #421</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Time: July 28, 2026 at 09:30 AM • 4 Algorithm Problems</p>
                </div>
                <Button onClick={() => toast.success("Registered successfully for contest #421!")} className="text-xs py-2 px-6">
                  Register Now
                </Button>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="rounded bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 text-[9px] font-bold">COMPLETED</span>
                  <h4 className="text-sm font-bold text-slate-400 mt-2">Weekly contest #420</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Ranked: #405 out of 10,000 participants • Solved: 3/4</p>
                </div>
                <span className="text-xs font-bold text-slate-500">+120 Points Earned</span>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* AI Assistant Feedback Modal */}
      {isAiModalOpen && (
        <Modal isOpen={true} onClose={() => setIsAiModalOpen(false)} title="AI Code Assistant Review">
          {aiLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-xs text-slate-500">
              <Sparkles className="animate-spin text-cyan-400" size={24} />
              <span>Analyzing code complexity and boundary conditions...</span>
            </div>
          ) : (
            aiHelp && (
              <div className="space-y-5 text-xs text-slate-300 leading-relaxed max-h-[480px] overflow-y-auto pr-1">
                <div>
                  <h4 className="font-bold text-white text-[10px] uppercase tracking-wider text-cyan-400">Potential Bug & Boundary Hint:</h4>
                  <p className="mt-1 bg-slate-950 p-3 rounded-xl border border-slate-900 text-amber-400 italic">
                    "{aiHelp.debugHint}"
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-white text-[10px] uppercase tracking-wider text-cyan-400">Optimization Rationale:</h4>
                  <p className="mt-1">{aiHelp.explanation}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-center">
                    <span className="text-[9px] text-slate-500 block uppercase font-bold">Time Complexity</span>
                    <span className="text-white font-extrabold text-xs mt-0.5 block">{aiHelp.timeComplexity}</span>
                  </div>
                  <div className="bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-center">
                    <span className="text-[9px] text-slate-500 block uppercase font-bold">Space Complexity</span>
                    <span className="text-white font-extrabold text-xs mt-0.5 block">{aiHelp.spaceComplexity}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-white text-[10px] uppercase tracking-wider text-cyan-400">Recommended Optimization:</h4>
                  <pre className="mt-1 bg-slate-950 p-3.5 rounded-xl border border-slate-900 font-mono text-[10px] text-emerald-400 overflow-x-auto">
                    {aiHelp.suggestedFix}
                  </pre>
                </div>

                <div className="flex justify-end pt-2 border-t border-slate-900">
                  <Button onClick={() => setIsAiModalOpen(false)} className="text-xs">
                    Got it!
                  </Button>
                </div>
              </div>
            )
          )}
        </Modal>
      )}
    </DashboardLayout>
  );
}
