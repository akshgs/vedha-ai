// app/student/page.tsx — Student Dashboard
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { chatAPI, skillsAPI, quizAPI, leaderboardAPI, jobsAPI } from "@/lib/api";

export default function StudentDashboard() {
  const router      = useRouter();
  const { user, logout, loadFromStorage } = useAuthStore();
  const [activeTab, setActiveTab] = useState("chat");
  const [chatMsg,   setChatMsg]   = useState("");
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [rank,      setRank]      = useState<any>(null);
  const [jobs,      setJobs]      = useState<any[]>([]);

  useEffect(() => {
    loadFromStorage();
  }, []);

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    if (user.role !== "student") { router.push(`/${user.role}`); return; }
    fetchRank();
    fetchJobs();
  }, [user]);

  const fetchRank = async () => {
    if (!user) return;
    try {
      const res = await leaderboardAPI.myRank(user.id);
      setRank(res.data);
    } catch {}
  };

  const fetchJobs = async () => {
    if (!user) return;
    try {
      const res = await jobsAPI.matchJobs(user.id);
      setJobs(res.data.matched_jobs || []);
    } catch {}
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
      setChatHistory((h) => [...h, { role: "assistant", message: "Error! Try again." }]);
    } finally {
      setChatLoading(false);
    }
  };

  const tabs = [
    { id: "chat",  label: "🤖 AI Chat" },
    { id: "jobs",  label: "💼 Jobs" },
    { id: "rank",  label: "🏆 Rank" },
  ];

  if (!user) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-blue-400">⚡ Vedha AI</h1>
          <p className="text-xs text-gray-400">Student Portal</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-gray-400">{user.goal}</p>
          </div>
          {rank && (
            <div className="bg-blue-900/50 px-3 py-1 rounded-lg text-sm">
              Rank #{rank.rank}
            </div>
          )}
          <button onClick={() => { logout(); router.push("/login"); }}
            className="text-xs text-gray-400 hover:text-white px-3 py-1 rounded-lg border border-gray-700 hover:border-gray-500">
            Logout
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-gray-800 px-6">
        <div className="flex gap-1">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                activeTab === t.id
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-4xl mx-auto">

        {/* Chat Tab */}
        {activeTab === "chat" && (
          <div className="flex flex-col h-[60vh]">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
              {chatHistory.length === 0 && (
                <div className="text-center text-gray-500 mt-20">
                  <p className="text-4xl mb-3">🤖</p>
                  <p>Hi {user.name}! I'm Vedha AI.</p>
                  <p className="text-sm mt-1">Ask me about Kerala IT jobs, skills, career advice...</p>
                </div>
              )}
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-sm"
                      : "bg-gray-800 text-gray-100 rounded-bl-sm"
                  }`}>
                    {msg.message}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-sm text-sm text-gray-400">
                    Thinking...
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <input
                value={chatMsg}
                onChange={(e) => setChatMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendChat()}
                placeholder="Ask Vedha AI anything..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
              />
              <button onClick={sendChat} disabled={chatLoading}
                className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 px-6 py-3 rounded-xl text-sm font-medium transition-all">
                Send
              </button>
            </div>
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === "jobs" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-blue-400">Matched Jobs for You</h2>
            {jobs.length === 0 ? (
              <p className="text-gray-400">No jobs found. Update your skills first!</p>
            ) : (
              jobs.map((job, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-blue-800 transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-white">{job.title}</h3>
                      <p className="text-sm text-gray-400 mt-1">{job.company} • {job.location}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {job.skills?.slice(0, 4).map((s: string, j: number) => (
                          <span key={j} className="text-xs bg-blue-900/50 text-blue-300 px-2 py-1 rounded-lg">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <div className={`text-lg font-bold ${job.match_percent > 50 ? "text-green-400" : "text-yellow-400"}`}>
                        {job.match_percent}%
                      </div>
                      <p className="text-xs text-gray-500">match</p>
                      <a href={job.url} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:underline mt-1 block">
                        Apply →
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Rank Tab */}
        {activeTab === "rank" && (
          <div className="text-center py-12">
            {rank ? (
              <>
                <div className="text-6xl font-bold text-blue-400 mb-2">#{rank.rank}</div>
                <p className="text-gray-400 mb-4">Your current rank</p>
                <div className="bg-gray-900 rounded-xl p-6 inline-block">
                  <p className="text-2xl font-bold text-white">{rank.score}%</p>
                  <p className="text-gray-400 text-sm mt-1">Quiz Score</p>
                </div>
              </>
            ) : (
              <p className="text-gray-400">Take a quiz to get your rank!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}