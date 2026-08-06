import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Clock, Lightbulb, Terminal as TerminalIcon, Sparkles } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/layouts/DashboardLayout";
import Card from "@/components/ui/card/Card";
import CodeEditor from "@/components/coding/CodeEditor";
import CodeRunner from "@/components/ui/career/CodeRunner";
import SubmissionCard from "@/components/ui/career/SubmissionCard";
import { getProblemDetails, getProblemDiscussion, type CodingProblem, type DiscussionComment } from "@/services/problems";
import { executeSandboxCode, submitSandboxCode } from "@/services/compiler";
import { getProblemSubmissions, type Submission } from "@/services/submissions";
import { getCodingAssistantHelp } from "@/ai/services/ai";

export default function Details() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const problemId = Number(id) || 1;

  const [problem, setProblem] = useState<CodingProblem | null>(null);
  const [comments, setComments] = useState<DiscussionComment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [activeTab, setActiveTab] = useState<"desc" | "editorial" | "comments" | "submissions">("desc");

  // Output terminal logs
  const [terminalOutput, setTerminalOutput] = useState("");
  const [runLoading, setRunLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // AI assistant states
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<{ debugHint: string; explanation: string; suggestedFix: string; timeComplexity: string; spaceComplexity: string } | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [prob, discussion, history] = await Promise.all([
          getProblemDetails(problemId),
          getProblemDiscussion(problemId),
          getProblemSubmissions(problemId),
        ]);
        setProblem(prob);
        setCode(prob.starterCode);
        setComments(discussion);
        setSubmissions(history);
      } catch {
        toast.error("Failed to load problem statement details.");
      }
    }
    void loadData();
  }, [problemId]);

  async function handleRunCode() {
    setRunLoading(true);
    setTerminalOutput("Compiling execution binary and testing test cases inputs...");
    try {
      const res = await executeSandboxCode(problemId, code, language);
      setTerminalOutput(res.output + (res.runtime ? `\n\nRuntime: ${res.runtime}` : ""));
      toast.success("Code run execution completed.");
    } catch {
      setTerminalOutput("Compilation failed due to timeout constraints.");
      toast.error("Execution error.");
    } finally {
      setRunLoading(false);
    }
  }

  async function handleSubmitCode() {
    setSubmitLoading(true);
    setTerminalOutput("Running complete performance tests...");
    try {
      const res = await submitSandboxCode(problemId, code, language);
      setTerminalOutput(res.output + `\nRuntime: ${res.runtime || "N/A"} • Memory: ${res.memory || "N/A"}`);
      if (res.status === "success") {
        toast.success("Submission accepted!");
        // Add to history list locally
        const newSub: Submission = {
          id: Date.now(),
          problemId,
          problemTitle: problem?.title || "Solution",
          status: "Accepted",
          language,
          runtime: res.runtime || "42 ms",
          memory: res.memory || "41.2 MB",
          submittedAt: new Date().toLocaleTimeString(),
          code,
        };
        setSubmissions([newSub, ...submissions]);
      } else {
        toast.error("Submission rejected.");
      }
    } catch {
      setTerminalOutput("Compilation failed.");
      toast.error("Submission error.");
    } finally {
      setSubmitLoading(false);
    }
  }

  async function handleAskAI() {
    setAiLoading(true);
    try {
      const res = await getCodingAssistantHelp(code, problemId, language);
      setAiFeedback(res);
      toast.success("AI generated optimization suggestion!");
    } catch {
      toast.error("AI service is currently busy.");
    } finally {
      setAiLoading(false);
    }
  }

  if (!problem) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl bg-slate-905 border border-slate-800 p-8 text-center text-slate-500 animate-pulse">
          Loading coding problem environment...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Back navigation */}
        <div className="flex justify-between items-center select-none">
          <button
            onClick={() => navigate("/coding/problems")}
            className="flex items-center gap-1.5 text-slate-550 hover:text-white transition text-xs font-semibold"
          >
            <ArrowLeft size={12} />
            Back to Problems Catalog
          </button>
        </div>

        {/* Splits Layout Panel */}
        <div className="grid gap-6 lg:grid-cols-2">
          
          {/* Left panel description and solution tabs */}
          <div className="space-y-4 flex flex-col">
            <div className="flex gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-900 select-none">
              <button
                onClick={() => setActiveTab("desc")}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition ${
                  activeTab === "desc" ? "bg-slate-900 text-white font-bold" : "text-slate-500 hover:text-white"
                }`}
              >
                <BookOpen size={13} />
                Description
              </button>
              <button
                onClick={() => setActiveTab("editorial")}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition ${
                  activeTab === "editorial" ? "bg-slate-900 text-white font-bold" : "text-slate-500 hover:text-white"
                }`}
              >
                <Lightbulb size={13} />
                Editorial Solution
              </button>
              <button
                onClick={() => setActiveTab("submissions")}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition ${
                  activeTab === "submissions" ? "bg-slate-900 text-white font-bold" : "text-slate-500 hover:text-white"
                }`}
              >
                <Clock size={13} />
                Submissions
              </button>
              <button
                onClick={() => setActiveTab("comments")}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition ${
                  activeTab === "comments" ? "bg-slate-900 text-white font-bold" : "text-slate-500 hover:text-white"
                }`}
              >
                Discussion ({comments.length})
              </button>
            </div>

            <Card variant="glass" className="p-5 flex-1 min-h-[400px] overflow-y-auto space-y-4">
              {activeTab === "desc" && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      {problem.title}
                    </h2>
                    <span className="text-[9px] bg-slate-950 px-2 py-0.5 rounded text-cyan-400 font-extrabold uppercase mt-2 inline-block">
                      {problem.difficulty}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    {problem.desc}
                  </p>

                  <div className="border-t border-slate-900 pt-4 space-y-3">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Hints:</span>
                    <div className="space-y-2">
                      {(problem.hints || []).map((hint, idx) => (
                        <div key={idx} className="bg-slate-955/60 p-3 rounded-xl border border-slate-900 text-xs text-slate-400">
                          Hint {idx + 1}: {hint}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "editorial" && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Official Editorial Optimization</h3>
                  <p className="text-xs text-slate-350 leading-relaxed font-semibold bg-slate-950/60 p-4 rounded-xl border border-slate-900">
                    {problem.editorial}
                  </p>
                </div>
              )}

              {activeTab === "submissions" && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Submission History</h3>
                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                    {submissions.map((sub) => (
                      <SubmissionCard
                        key={sub.id}
                        id={sub.id}
                        status={sub.status}
                        language={sub.language}
                        runtime={sub.runtime}
                        memory={sub.memory}
                        submittedAt={sub.submittedAt}
                        code={sub.code}
                      />
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "comments" && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Community Discussion</h3>
                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                    {comments.map((c) => (
                      <div key={c.id} className="text-xs bg-slate-900/60 p-3.5 rounded-xl border border-slate-900">
                        <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold mb-1 select-none">
                          <span>{c.author}</span>
                          <span>{c.timestamp}</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">{c.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Right panel Code editor, compiler runner terminal, and AI Assistant */}
          <div className="space-y-4 flex flex-col">
            <CodeRunner
              onRun={handleRunCode}
              onSubmit={handleSubmitCode}
              loading={runLoading}
              submitLoading={submitLoading}
              language={language}
              onLanguageChange={setLanguage}
            />

            <div className="h-[300px] shrink-0">
              <CodeEditor code={code} onChange={setCode} language={language} />
            </div>

            {/* AI Assistant Drawer */}
            <Card variant="glass" className="p-4 border-cyan-550/10 bg-cyan-500/5 relative shrink-0">
              <div className="flex justify-between items-center select-none">
                <div className="flex gap-2 items-center text-xs font-bold text-white">
                  <Sparkles size={14} className="text-cyan-400 animate-pulse" />
                  <span>AI Coding Assistant</span>
                </div>
                <button
                  onClick={handleAskAI}
                  disabled={aiLoading}
                  className="text-[9px] bg-gradient-to-r from-cyan-600 to-blue-600 px-3.5 py-1 rounded font-bold text-white hover:opacity-90"
                >
                  {aiLoading ? "Optimizing..." : "Explain & Optimize Code"}
                </button>
              </div>

              {aiFeedback && (
                <div className="mt-3 bg-slate-950 p-3 rounded-xl border border-slate-900 space-y-2 text-[10px] text-slate-400 leading-relaxed font-semibold">
                  <p className="text-white"><strong className="text-cyan-400">Hint:</strong> {aiFeedback.debugHint}</p>
                  <p><strong className="text-cyan-400">Optimization:</strong> {aiFeedback.explanation}</p>
                  <p className="font-mono text-cyan-500 mt-1 select-all">{aiFeedback.suggestedFix}</p>
                  <div className="flex gap-4 pt-1 font-mono text-[9px] text-slate-500">
                    <span>Time: {aiFeedback.timeComplexity}</span>
                    <span>Space: {aiFeedback.spaceComplexity}</span>
                  </div>
                </div>
              )}
            </Card>

            {/* Console Terminal Output */}
            <Card variant="glass" className="p-4 flex-1 min-h-[120px] max-h-[160px] flex flex-col overflow-hidden">
              <div className="flex gap-1.5 items-center text-slate-500 border-b border-slate-900 pb-2 mb-2 select-none">
                <TerminalIcon size={12} className="text-cyan-400" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Console Test Execution Terminal</span>
              </div>
              <div className="flex-1 overflow-y-auto font-mono text-[10px] text-slate-350 bg-slate-950/60 p-2 rounded-lg border border-slate-900 leading-relaxed">
                {terminalOutput || "No executions performed yet. Code outputs will yield compile logs here."}
              </div>
            </Card>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
