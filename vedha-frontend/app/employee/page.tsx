// app/employee/page.tsx — Employee Dashboard
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { skillsAPI, chatAPI, jobsAPI } from "@/lib/api";

const ROLES = ["ML Engineer","GenAI Developer","LLM Engineer","Full Stack Developer","DevOps Engineer","Data Scientist","NLP Engineer","Cloud Engineer"];

export default function EmployeeDashboard() {
  const router   = useRouter();
  const { user, logout, loadFromStorage } = useAuthStore();
  const [activeTab,   setActiveTab]   = useState("roadmap");
  const [skills,      setSkills]      = useState("");
  const [targetRole,  setTargetRole]  = useState("ML Engineer");
  const [analysis,    setAnalysis]    = useState<any>(null);
  const [analysing,   setAnalysing]   = useState(false);
  const [chatMsg,     setChatMsg]     = useState("");
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [jobs,        setJobs]        = useState<any[]>([]);

  useEffect(() => { loadFromStorage(); }, []);

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    if (user.role !== "employee") { router.push(`/${user.role}`); return; }
    fetchJobs();
  }, [user]);

  const fetchJobs = async () => {
    if (!user) return;
    try { const res = await jobsAPI.matchJobs(user.id); setJobs(res.data.matched_jobs || []); } catch {}
  };

  const analyseSkills = async () => {
    if (!user || !skills.trim()) return;
    setAnalysing(true);
    try {
      const skillList = skills.split(",").map((s) => s.trim()).filter(Boolean);
      const res = await skillsAPI.analyse({
        student_id: user.id, skills: skillList, target_role: targetRole
      });
      setAnalysis(res.data);
    } catch (e: any) {
      alert(e.response?.data?.detail || "Error!");
    } finally {
      setAnalysing(false);
    }
  };

  const sendChat = async () => {
    if (!chatMsg.trim() || !user) return;
    setChatHistory((h) => [...h, { role: "user", message: chatMsg }]);
    setChatMsg("");
    setChatLoading(true);
    try {
      const res = await chatAPI.send({ student_id: user.id, message: chatMsg });
      setChatHistory((h) => [...h, { role: "assistant", message: res.data.reply }]);
    } catch {
      setChatHistory((h) => [...h, { role: "assistant", message: "Error! Try again." }]);
    } finally {
      setChatLoading(false);
    }
  };

  const tabs = [
    { id: "roadmap", label: "🗺️ Career Roadmap" },
    { id: "jobs",    label: "💼 Opportunities" },
    { id: "chat",    label: "🤖 AI Mentor" },
  ];

  if (!user) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-purple-400">⚡ Vedha AI</h1>
          <p className="text-xs text-gray-400">Employee Portal</p>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sm">{user.name}</p>
          <button onClick={() => { logout(); router.push("/login"); }}
            className="text-xs text-gray-400 hover:text-white px-3 py-1 rounded-lg border border-gray-700">
            Logout
          </button>
        </div>
      </header>

      <div className="border-b border-gray-800 px-6">
        <div className="flex gap-1">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                activeTab === t.id ? "border-purple-500 text-purple-400" : "border-transparent text-gray-400 hover:text-white"
              }`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto">
        {/* Roadmap */}
        {activeTab === "roadmap" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-purple-400">Career Switch Planner</h2>
            <div className="bg-gray-900 rounded-xl p-6 space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Your current skills (comma separated)</label>
                <input
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="Python, SQL, Machine Learning, Docker..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Target role</label>
                <select value={targetRole} onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500">
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <button onClick={analyseSkills} disabled={analysing}
                className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 py-3 rounded-xl text-sm font-medium transition-all">
                {analysing ? "Analysing..." : "Analyse My Skills"}
              </button>
            </div>

            {analysis && (
              <div className="space-y-4">
                <div className="bg-gray-900 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">{analysis.target_role}</h3>
                    <span className={`text-2xl font-bold ${analysis.score > 60 ? "text-green-400" : analysis.score > 30 ? "text-yellow-400" : "text-red-400"}`}>
                      {analysis.score}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                    <div className="bg-purple-500 h-2 rounded-full transition-all" style={{ width: `${analysis.score}%` }} />
                  </div>
                  <p className="text-sm text-gray-400">Timeline: <span className="text-white">{analysis.estimated_timeline}</span></p>
                </div>

                {analysis.missing_skills?.length > 0 && (
                  <div className="bg-gray-900 rounded-xl p-6">
                    <h3 className="font-medium text-red-400 mb-3">Skills to Learn</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.missing_skills.map((s: string, i: number) => (
                        <span key={i} className="text-xs bg-red-900/40 text-red-300 px-3 py-1 rounded-lg">{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                {analysis.learning_resources?.length > 0 && (
                  <div className="bg-gray-900 rounded-xl p-6">
                    <h3 className="font-medium text-blue-400 mb-3">Free Learning Resources</h3>
                    <div className="space-y-2">
                      {analysis.learning_resources.map((r: any, i: number) => (
                        <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all">
                          <div>
                            <p className="text-sm font-medium">{r.skill}</p>
                            <p className="text-xs text-gray-400">{r.platform}</p>
                          </div>
                          <span className="text-xs text-green-400">{r.type} →</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Jobs */}
        {activeTab === "jobs" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-purple-400">Matched Opportunities</h2>
            {jobs.length === 0 ? (
              <p className="text-gray-400">No jobs found. Update your skills first!</p>
            ) : (
              jobs.map((job, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-purple-800 transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{job.title}</h3>
                      <p className="text-sm text-gray-400 mt-1">{job.company} • {job.location}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {job.skills?.slice(0, 4).map((s: string, j: number) => (
                          <span key={j} className="text-xs bg-purple-900/40 text-purple-300 px-2 py-1 rounded-lg">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <div className={`text-lg font-bold ${job.match_percent > 50 ? "text-green-400" : "text-yellow-400"}`}>
                        {job.match_percent}%
                      </div>
                      <a href={job.url} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-purple-400 hover:underline mt-1 block">Apply →</a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Chat */}
        {activeTab === "chat" && (
          <div className="flex flex-col h-[60vh]">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {chatHistory.length === 0 && (
                <div className="text-center text-gray-500 mt-20">
                  <p className="text-4xl mb-3">🤖</p>
                  <p>Hi {user.name}! Ask me about career switches, upskilling...</p>
                </div>
              )}
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
                    msg.role === "user" ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-100"
                  }`}>
                    {msg.message}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 px-4 py-3 rounded-2xl text-sm text-gray-400">Thinking...</div>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <input value={chatMsg} onChange={(e) => setChatMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendChat()}
                placeholder="Ask about career growth..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500"
              />
              <button onClick={sendChat} disabled={chatLoading}
                className="bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 px-6 py-3 rounded-xl text-sm font-medium transition-all">
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}