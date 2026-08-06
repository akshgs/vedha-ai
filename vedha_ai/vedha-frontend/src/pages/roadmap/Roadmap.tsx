import { useEffect, useState } from "react";
import {
  GraduationCap,
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  ExternalLink,
  Lock,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/layouts/DashboardLayout";
import Button from "@/components/ui/button/Button";
import Card from "@/components/ui/card/Card";
import SkillBadge from "@/components/roadmap/SkillBadge";
import PageHeader from "@/components/ui/layout/PageHeader";
import { getRoadmap, type RoadmapResponse } from "@/services/roadmap";

// Mock courses data
const COURSES = [
  {
    id: 101,
    title: "Vite + React: The Complete Guide",
    provider: "Vedha Learning Platform",
    duration: "24h video lessons",
    saved: true,
    progress: 85,
    certificateClaimed: false,
    level: "Beginner",
  },
  {
    id: 102,
    title: "Advanced System Design & Microservices",
    provider: "Industry Experts",
    duration: "18h lessons",
    saved: false,
    progress: 100,
    certificateClaimed: false,
    level: "Expert",
  },
  {
    id: 103,
    title: "Python Backends with FastAPI & SQL",
    provider: "Vedha AI Academics",
    duration: "15h video lessons",
    saved: false,
    progress: 25,
    certificateClaimed: false,
    level: "Intermediate",
  },
];

// Mock nodes for visual roadmap timeline
const ROADMAP_NODES = [
  { id: 1, name: "Python Foundations", desc: "Master core syntax, data structures, OOP, and script automation.", status: "completed" },
  { id: 2, name: "Machine Learning Fundamentals", desc: "Supervised/unsupervised models, regression, classification, and sklearn.", status: "completed" },
  { id: 3, name: "Deep Learning & Neural Networks", desc: "Tensors, backpropagation, CNNs, RNNs, PyTorch, and training optimization.", status: "in_progress" },
  { id: 4, name: "Large Language Models (LLMs)", desc: "Transformers, self-attention, fine-tuning, tokenization, and prompt engineering.", status: "locked" },
  { id: 5, name: "Retrieval-Augmented Generation (RAG)", desc: "Vector databases (ChromaDB/pgvector), semantic search, chunks splitting, and context injection.", status: "locked" },
  { id: 6, name: "Autonomous AI Agents", desc: "Agent loop designs, tools calling, planning architectures, LangGraph, and decision trees.", status: "locked" },
  { id: 7, name: "Model Context Protocol (MCP)", desc: "Build host-client servers, schema validation, tool definitions, and contextual resources routing.", status: "locked" },
  { id: 8, name: "Production AI Deployment", desc: "Model serialization, quantizations, high-throughput inference APIs, and serving endpoints.", status: "locked" },
  { id: 9, name: "MLOps Pipelines", desc: "CI/CD automated testing, metrics dashboards (Prometheus/Grafana), logging, and models monitoring.", status: "locked" },
];

export default function Roadmap() {
  const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState<"path" | "courses" | "certificates">("path");
  const [selectedNode, setSelectedNode] = useState(ROADMAP_NODES[2]);
  const [courses, setCourses] = useState(COURSES);

  useEffect(() => {
    async function loadRoadmap() {
      try {
        const data = await getRoadmap();
        setRoadmap(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load roadmap.");
      } finally {
        setLoading(false);
      }
    }
    loadRoadmap();
  }, []);

  function handleToggleBookmark(id: number) {
    setCourses(
      courses.map((c) => {
        if (c.id === id) {
          const nextState = !c.saved;
          toast.success(nextState ? "Course saved to bookmarks!" : "Course removed from bookmarks");
          return { ...c, saved: nextState };
        }
        return c;
      })
    );
  }

  function handleClaimCertificate(id: number) {
    setCourses(
      courses.map((c) => {
        if (c.id === id) {
          toast.success("Certificate compiled and claimed successfully! Available to download.");
          return { ...c, certificateClaimed: true };
        }
        return c;
      })
    );
  }

  function handleToggleNodeComplete(nodeId: number) {
    ROADMAP_NODES.forEach((node) => {
      if (node.id === nodeId) {
        node.status = node.status === "completed" ? "in_progress" : "completed";
        toast.success(`Updated status for: ${node.name}`);
      }
    });
    // Force refresh selected node reference
    const updatedNode = ROADMAP_NODES.find((n) => n.id === nodeId);
    if (updatedNode) setSelectedNode(updatedNode);
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl bg-slate-900 p-8 text-center text-white animate-pulse">
          Loading AI Learning Roadmap...
        </div>
      </DashboardLayout>
    );
  }

  if (error || !roadmap) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center">
          <h2 className="text-xl font-bold text-red-400">
            {error || "Failed to load roadmap."}
          </h2>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* Master Page Header */}
        <PageHeader
          title="AI Learning & Roadmap Academy"
          subtitle={`Target Role: ${roadmap.target_role} • Master skill milestones to unlock career opportunities.`}
          icon={<GraduationCap size={22} />}
          action={
            <div className="flex rounded-xl bg-[#111827] p-1 border border-[#1F2937]">
              {[
                { id: "path", label: "Learning Path", icon: GraduationCap },
                { id: "courses", label: "Ecosystem Courses", icon: BookOpen },
                { id: "certificates", label: "Credentials Hub", icon: Award },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as "path" | "courses" | "certificates")}
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

        {/* Global Progress Bar */}
        <Card variant="glass" className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Overall Roadmap completion</h3>
            <span className="text-xl font-black text-cyan-400">{roadmap.completion}%</span>
          </div>
          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
              style={{ width: `${roadmap.completion}%` }}
            />
          </div>
        </Card>

        {/* Tab 1: Interactive Learning Path Timeline */}
        {activeTab === "path" && (
          <div className="grid gap-8 lg:grid-cols-3">

            {/* Visual Node List */}
            <div className="lg:col-span-2 space-y-4">
              <Card variant="glass" className="p-6">
                <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 mb-6">Course Path Checklist</h3>
                <div className="relative border-l border-slate-800 ml-4 pl-8 space-y-6">
                  {ROADMAP_NODES.map((node) => {
                    const isCompleted = node.status === "completed";
                    const isInProgress = node.status === "in_progress";
                    const isSelected = selectedNode.id === node.id;

                    return (
                      <div key={node.id} className="relative">
                        {/* Bullet Icon */}
                        <div
                          className={`absolute -left-12 top-0.5 flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 ${isCompleted
                              ? "bg-emerald-500/25 border-emerald-500 text-emerald-400"
                              : isInProgress
                                ? "bg-cyan-500/25 border-cyan-500 text-cyan-400 animate-pulse"
                                : "bg-slate-900 border-slate-800 text-slate-500"
                            }`}
                        >
                          {isCompleted ? (
                            <CheckCircle size={16} />
                          ) : isInProgress ? (
                            <Clock size={16} />
                          ) : (
                            <Lock size={14} />
                          )}
                        </div>

                        {/* Title click */}
                        <div
                          onClick={() => setSelectedNode(node)}
                          className={`cursor-pointer rounded-2xl border p-4 transition-all duration-300 ${isSelected
                              ? "border-cyan-500 bg-cyan-500/5 shadow-inner"
                              : "border-slate-850 bg-slate-900/30 hover:border-slate-700"
                            }`}
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-white">{node.name}</h4>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                              {node.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{node.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>

            {/* Selected Node Details Box */}
            <div className="space-y-6">
              <Card variant="glass" className="p-6 space-y-6">
                <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Node Details</h3>
                  <button
                    onClick={() => handleToggleNodeComplete(selectedNode.id)}
                    className={`rounded-lg border px-2.5 py-1 text-[10px] font-bold uppercase transition ${selectedNode.status === "completed"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20"
                        : "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:bg-cyan-600 hover:text-white"
                      }`}
                  >
                    {selectedNode.status === "completed" ? "Mark Incomplete" : "Mark Completed"}
                  </button>
                </div>

                <div className="space-y-1">
                  <h4 className="text-base font-bold text-white">{selectedNode.name}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">{selectedNode.desc}</p>
                </div>

                {selectedNode.status !== "locked" ? (
                  <div className="space-y-4 pt-4 border-t border-slate-900">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Recommended Lessons</p>
                    <div className="space-y-2">
                      {[
                        { title: "Introduction Video lectures", time: "45 mins" },
                        { title: "Coding Assignment 1.1", time: "Practical quiz" },
                        { title: "Review Assessment test", time: "5 questions" },
                      ].map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center rounded-xl bg-slate-950/60 p-3 border border-slate-850 text-xs">
                          <span className="font-semibold text-slate-300">{item.title}</span>
                          <span className="text-[10px] text-slate-500">{item.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 flex items-start gap-2 text-xs text-red-400">
                    <Lock size={16} className="shrink-0 mt-0.5" />
                    <p>This node is currently locked. Complete the preceding roadmap milestones to unlock access.</p>
                  </div>
                )}
              </Card>

              {/* Skills checklist */}
              <Card variant="glass" className="p-6 space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">Skills Target Match</h3>
                <div className="flex flex-wrap gap-2">
                  {roadmap.completed_skills.slice(0, 4).map((s) => (
                    <SkillBadge key={s} skill={s} completed />
                  ))}
                  {roadmap.missing_skills.slice(0, 3).map((s) => (
                    <SkillBadge key={s} skill={s} />
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Tab 2: Recommended & Saved Courses */}
        {activeTab === "courses" && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Card key={course.id} variant="interactive" className="p-6 flex flex-col justify-between h-[250px]">
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <span className="rounded bg-slate-900 border border-slate-850 px-2 py-0.5 text-[9px] font-semibold text-slate-500">
                      {course.level}
                    </span>
                    <button
                      onClick={() => handleToggleBookmark(course.id)}
                      className="text-slate-400 hover:text-white transition"
                    >
                      {course.saved ? (
                        <BookmarkCheck size={16} className="text-cyan-400" />
                      ) : (
                        <Bookmark size={16} />
                      )}
                    </button>
                  </div>
                  <h4 className="text-sm font-bold text-white leading-snug line-clamp-2">{course.title}</h4>
                  <p className="text-[10px] text-slate-500">{course.provider} • {course.duration}</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-900">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Lesson Progress</span>
                    <span className="font-bold text-cyan-400">{course.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-500 transition-all duration-300"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Tab 3: Credentials / Claimable Certificates */}
        {activeTab === "certificates" && (
          <Card variant="glass" className="p-6">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 mb-4">Verified Certificates</h3>

            <div className="divide-y divide-slate-850">
              {courses
                .filter((c) => c.progress === 100)
                .map((course) => (
                  <div key={course.id} className="py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-slate-900 border border-slate-800 p-2.5 text-amber-400">
                        <Award size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{course.title}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">Completed via {course.provider}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {course.certificateClaimed ? (
                        <Button
                          variant="outline"
                          onClick={() => toast.success("Downloading PDF Certificate...")}
                          className="text-xs py-2 px-4 flex items-center gap-1.5"
                        >
                          <ExternalLink size={12} />
                          Download Certificate PDF
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleClaimCertificate(course.id)}
                          className="text-xs py-2 px-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                        >
                          Claim Certificate
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}