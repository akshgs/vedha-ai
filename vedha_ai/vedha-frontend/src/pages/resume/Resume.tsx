import { useState } from "react";
import {
  FileText,
  Upload,
  History,
  MessageSquare,
  Download,
  Trash2,
  Send,
  Sparkles,
  Columns,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/layouts/DashboardLayout";
import Button from "@/components/ui/button/Button";
import Card from "@/components/ui/card/Card";
import Input from "@/components/ui/input/Input";
import ResumeUploader from "@/components/resume/ResumeUploader";
import ResumeResult from "@/components/resume/ResumeResult";
import Modal from "@/components/ui/modal/Modal";
import type { ResumeAnalysisResponse } from "@/services/resume";

import PageHeader from "@/components/ui/layout/PageHeader";

export default function Resume() {
  const [activeTab, setActiveTab] = useState<"analyzer" | "builder" | "history">("analyzer");
  const [analysis, setAnalysis] = useState<ResumeAnalysisResponse | null>(null);

  // Chat with PDF State
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    { sender: "ai", text: "Hi! I have parsed your resume. Ask me anything about tailoring it or improving your ATS score." },
  ]);

  // Version History State
  const [versions, setVersions] = useState([
    { id: 1, name: "Akash_Resume_Software_Eng.pdf", role: "Software Engineer", date: "2026-07-10", score: 82, active: true, skills: ["React", "TypeScript", "Node.js", "Python"], missing: ["FastAPI", "Docker"] },
    { id: 2, name: "Akash_Resume_FullStack_v2.pdf", role: "Full Stack Developer", date: "2026-07-20", score: 89, active: false, skills: ["React", "TypeScript", "Node.js", "Python", "FastAPI", "Docker"], missing: ["AWS"] },
  ]);

  // Comparison State
  const [compareA, setCompareA] = useState<number | null>(null);
  const [compareB, setCompareB] = useState<number | null>(null);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Builder States
  const [builderData, setBuilderData] = useState({
    fullName: "Akash Patel",
    email: "akash@example.com",
    phone: "+91 98765 43210",
    linkedin: "linkedin.com/in/akashpatel",
    summary: "Dedicated Software Engineer with 2+ years of experience building modern web applications using React, TypeScript, and FastAPI.",
    skills: ["React", "TypeScript", "Node.js", "Python", "FastAPI", "PostgreSQL", "Docker"],
  });

  // Templates: "modern" | "tech" | "executive"
  const [activeTemplate, setActiveTemplate] = useState<"modern" | "tech" | "executive">("tech");

  const [newSkill, setNewSkill] = useState("");

  function handleSendChat() {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");

    setTimeout(() => {
      let aiResponse = "Based on your resume, I suggest emphasizing your cloud deployment (Docker/AWS) skills to better match generic Software Engineer specifications.";
      if (userMsg.toLowerCase().includes("python") || userMsg.toLowerCase().includes("fastapi")) {
        aiResponse = "Your resume includes Python and FastAPI. I highly recommend highlighting your API design choices and database performance optimizations in your projects section.";
      }
      setChatMessages((prev) => [...prev, { sender: "ai", text: aiResponse }]);
    }, 1000);
  }

  function handleAddBuilderSkill() {
    if (newSkill.trim() && !builderData.skills.includes(newSkill.trim())) {
      setBuilderData({ ...builderData, skills: [...builderData.skills, newSkill.trim()] });
      setNewSkill("");
    }
  }

  function handleRemoveBuilderSkill(skill: string) {
    setBuilderData({ ...builderData, skills: builderData.skills.filter((s) => s !== skill) });
  }

  function handleExportPDF() {
    toast.success(`Resume compiled using "${activeTemplate.toUpperCase()}" template and downloaded successfully as PDF!`);
  }

  function handleSetActive(id: number) {
    setVersions(versions.map((v) => ({ ...v, active: v.id === id })));
    toast.success("Active resume version updated!");
  }

  function handleCompare() {
    if (compareA === null || compareB === null) {
      toast.error("Please select two versions to compare.");
      return;
    }
    if (compareA === compareB) {
      toast.error("Please select different versions to compare.");
      return;
    }
    setShowCompareModal(true);
  }

  const verA = versions.find((v) => v.id === compareA);
  const verB = versions.find((v) => v.id === compareB);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Master Page Header */}
        <PageHeader
          title="AI Resume Suite"
          subtitle="Build, tailor, and analyze your resumes using state-of-the-art career insights."
          icon={<Sparkles size={22} />}
          action={
            <div className="flex rounded-xl bg-[#111827] p-1 border border-[#1F2937]">
              {[
                { id: "analyzer", label: "ATS Analyzer", icon: FileText },
                { id: "builder", label: "Resume Builder", icon: Upload },
                { id: "history", label: "Version History & Compare", icon: History },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as "analyzer" | "builder" | "history")}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-[#3B82F6] text-white shadow-md"
                        : "text-[#94A3B8] hover:text-white"
                    }`}
                  >
                    <Icon size={14} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          }
        />

        {/* Tab 1: ATS Resume Analyzer */}
        {activeTab === "analyzer" && (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {!analysis ? (
                <ResumeUploader onAnalysis={setAnalysis} />
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white">Analysis Results</h3>
                    <Button variant="outline" onClick={() => setAnalysis(null)}>
                      Analyze Another File
                    </Button>
                  </div>
                  
                  {/* ATS structured metrics card */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Aesthetic Layout</span>
                      <p className="text-sm font-bold text-white">Highly Readable</p>
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Action Verb Count</span>
                      <p className="text-sm font-bold text-emerald-400">Excellent (25+ verbs)</p>
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Formatting Check</span>
                      <p className="text-sm font-bold text-amber-500">Fix margin widths</p>
                    </div>
                  </div>

                  <ResumeResult analysis={analysis} />
                </div>
              )}
            </div>

            {/* Chat with parsed PDF Panel */}
            <div className="space-y-6">
              <Card variant="glass" className="flex flex-col h-[520px]">
                <div className="flex items-center gap-3 border-b border-slate-800 p-4">
                  <MessageSquare size={20} className="text-cyan-400" />
                  <div>
                    <h3 className="text-sm font-bold text-white">Resume AI Copilot</h3>
                    <p className="text-[10px] text-slate-500">Tailoring advice and skill gaps</p>
                  </div>
                </div>

                {/* Messages Box */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                          msg.sender === "user"
                            ? "bg-cyan-600 text-white rounded-tr-none"
                            : "bg-slate-900 text-slate-300 rounded-tl-none border border-slate-800"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input Bar */}
                <div className="border-t border-slate-800 p-3 flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask how to improve ATS score..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-500"
                  />
                  <button
                    onClick={handleSendChat}
                    className="flex items-center justify-center rounded-xl bg-cyan-600 p-2 text-white hover:bg-cyan-500 transition"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Tab 2: Resume Builder with multiple templates */}
        {activeTab === "builder" && (
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Input wizard */}
            <Card variant="glass" className="p-6 space-y-6">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-white">Resume Profile Data</h3>
                {/* Template picker */}
                <div className="flex items-center gap-1.5 bg-slate-900 rounded-lg p-0.5 border border-slate-800">
                  {(["modern", "tech", "executive"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setActiveTemplate(t)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded transition ${
                        activeTemplate === t ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {t.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Full Name"
                  value={builderData.fullName}
                  onChange={(e) => setBuilderData({ ...builderData, fullName: e.target.value })}
                />
                <Input
                  label="Email Address"
                  value={builderData.email}
                  onChange={(e) => setBuilderData({ ...builderData, email: e.target.value })}
                />
                <Input
                  label="Phone Number"
                  value={builderData.phone}
                  onChange={(e) => setBuilderData({ ...builderData, phone: e.target.value })}
                />
                <Input
                  label="LinkedIn URL"
                  value={builderData.linkedin}
                  onChange={(e) => setBuilderData({ ...builderData, linkedin: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Professional Summary</label>
                <textarea
                  value={builderData.summary}
                  onChange={(e) => setBuilderData({ ...builderData, summary: e.target.value })}
                  rows={4}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-400">Core Competencies / Skills</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g. Kubernetes, AWS"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddBuilderSkill())}
                  />
                  <Button onClick={handleAddBuilderSkill} className="px-6 shrink-0 py-2.5">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 rounded-xl bg-slate-950/40 p-3 border border-slate-800">
                  {builderData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300"
                    >
                      {skill}
                      <button onClick={() => handleRemoveBuilderSkill(skill)} className="hover:text-red-400">&times;</button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-800">
                <Button onClick={handleExportPDF} className="flex items-center gap-2">
                  <Download size={14} />
                  Export & Compile PDF
                </Button>
              </div>
            </Card>

            {/* Resume Live Preview Panel - changes dynamically based on activeTemplate */}
            <div className="space-y-4">
              {activeTemplate === "tech" && (
                <Card variant="default" className="p-8 bg-slate-950 text-slate-300 space-y-6 select-none relative overflow-hidden border-cyan-500/15">
                  <div className="absolute right-0 top-0 bg-cyan-500 text-slate-950 px-3 py-0.5 text-[8px] uppercase font-black">
                    Tech Premium
                  </div>
                  <div className="border-l-4 border-cyan-400 pl-4 space-y-1">
                    <h2 className="text-2xl font-black text-white tracking-tight">{builderData.fullName}</h2>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-400">
                      <span>{builderData.email}</span>
                      <span>•</span>
                      <span>{builderData.phone}</span>
                    </div>
                    <p className="text-[11px] text-cyan-400 font-semibold">{builderData.linkedin}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400">Executive Summary</h4>
                    <p className="text-xs leading-relaxed text-slate-400">{builderData.summary}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400">Capabilities</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {builderData.skills.map((s) => (
                        <span key={s} className="bg-slate-900 border border-slate-800 text-cyan-300 text-[10px] rounded px-2 py-0.5">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              )}

              {activeTemplate === "modern" && (
                <Card variant="default" className="p-8 bg-slate-900 text-slate-300 space-y-4 select-none relative overflow-hidden border-slate-800">
                  <div className="absolute right-0 top-0 bg-violet-500 text-white px-3 py-0.5 text-[8px] uppercase font-black">
                    Modern Minimalist
                  </div>
                  <div className="text-center space-y-1">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider">{builderData.fullName}</h2>
                    <p className="text-[10px] text-slate-400">{builderData.email} • {builderData.phone} • {builderData.linkedin}</p>
                  </div>
                  <hr className="border-slate-800" />
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-bold uppercase text-white">Summary</h4>
                    <p className="text-xs leading-relaxed text-slate-400">{builderData.summary}</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-bold uppercase text-white">Skills Inventory</h4>
                    <p className="text-xs text-slate-400 font-semibold">{builderData.skills.join(", ")}</p>
                  </div>
                </Card>
              )}

              {activeTemplate === "executive" && (
                <Card variant="default" className="p-8 bg-slate-950 text-slate-300 space-y-6 select-none border-t-8 border-slate-700">
                  <div className="text-center space-y-1">
                    <h2 className="text-2xl font-serif text-white">{builderData.fullName}</h2>
                    <p className="text-xs font-mono text-slate-400">{builderData.email} | {builderData.phone} | {builderData.linkedin}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider border-b border-slate-800 pb-1 text-slate-200">Career Summary</h4>
                    <p className="text-xs leading-relaxed text-slate-400 font-serif italic">{builderData.summary}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider border-b border-slate-800 pb-1 text-slate-200">Core Skills</h4>
                    <div className="grid grid-cols-3 gap-1.5 text-[11px] text-slate-300 font-serif">
                      {builderData.skills.map((s) => (
                        <div key={s}>• {s}</div>
                      ))}
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Version History and Compare */}
        {activeTab === "history" && (
          <div className="space-y-8">
            <Card variant="glass" className="p-6">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white">Saved Resume Analyses</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Select two versions below to launch the comparison engine.</p>
                </div>
                <Button
                  onClick={handleCompare}
                  disabled={compareA === null || compareB === null}
                  className="flex items-center gap-2 text-xs py-2 px-6"
                >
                  <Columns size={14} />
                  Compare Selected Resumes
                </Button>
              </div>

              <div className="divide-y divide-slate-850">
                {versions.map((ver) => {
                  const isCheckedA = compareA === ver.id;
                  const isCheckedB = compareB === ver.id;
                  return (
                    <div key={ver.id} className="py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col gap-1.5 mr-2">
                          <label className="flex items-center gap-1.5 text-[10px] text-slate-400 select-none cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isCheckedA}
                              onChange={() => setCompareA(isCheckedA ? null : ver.id)}
                              className="rounded border-slate-800 text-cyan-500 bg-slate-950 focus:ring-0"
                            />
                            A
                          </label>
                          <label className="flex items-center gap-1.5 text-[10px] text-slate-400 select-none cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isCheckedB}
                              onChange={() => setCompareB(isCheckedB ? null : ver.id)}
                              className="rounded border-slate-800 text-cyan-500 bg-slate-950 focus:ring-0"
                            />
                            B
                          </label>
                        </div>
                        <div className="rounded-xl bg-slate-900 border border-slate-800 p-2.5 text-cyan-400">
                          <FileText size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">{ver.name}</h4>
                          <p className="text-xs text-slate-400 mt-0.5">Target: {ver.role} • Uploaded {ver.date}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">ATS Score</span>
                          <p className="text-lg font-extrabold text-cyan-400">{ver.score}%</p>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant={ver.active ? "primary" : "outline"}
                            onClick={() => handleSetActive(ver.id)}
                            className="text-xs py-2 px-4 rounded-xl"
                          >
                            {ver.active ? "Active Version" : "Make Active"}
                          </Button>
                          <button
                            onClick={() => {
                              setVersions(versions.filter((v) => v.id !== ver.id));
                              toast.success("Resume version removed from logs.");
                            }}
                            className="rounded-xl border border-slate-800 bg-slate-900/40 p-2.5 text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Compare Modal */}
      {showCompareModal && verA && verB && (
        <Modal isOpen={true} onClose={() => setShowCompareModal(false)} title="Side-by-Side Resume Comparison Analytics">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-850">
                <span className="text-[9px] uppercase font-bold text-slate-500">Version A: {verA.name}</span>
                <div className="text-3xl font-black text-cyan-400 mt-2">{verA.score}%</div>
                <span className="text-xs text-slate-400 mt-1 block">Target: {verA.role}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-850">
                <span className="text-[9px] uppercase font-bold text-slate-500">Version B: {verB.name}</span>
                <div className="text-3xl font-black text-cyan-400 mt-2">{verB.score}%</div>
                <span className="text-xs text-slate-400 mt-1 block">Target: {verB.role}</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-400 border-b border-slate-850 pb-1">Comparison metrics</h4>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-emerald-400">Extracted Skills (A):</span>
                  <p className="text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-900">{verA.skills.join(", ")}</p>
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-emerald-400">Extracted Skills (B):</span>
                  <p className="text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-900">{verB.skills.join(", ")}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs mt-3">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-red-400">Missing Gaps (A):</span>
                  <p className="text-slate-400 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-900">{verA.missing.join(", ") || "None"}</p>
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-red-400">Missing Gaps (B):</span>
                  <p className="text-slate-400 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-900">{verB.missing.join(", ") || "None"}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-cyan-500/25 bg-cyan-500/5 p-4 text-xs text-cyan-300 flex items-center gap-2">
              <TrendingUp size={16} />
              <span>
                Version B shows an increase of <b>{verB.score - verA.score}%</b> in ATS alignment by matching critical skills like Docker and FastAPI!
              </span>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-900">
              <Button onClick={() => setShowCompareModal(false)} className="text-xs py-1.5 px-6">
                Close Comparison
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
}