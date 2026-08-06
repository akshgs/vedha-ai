import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts";
import { BarChart2, Star, Code, FileText, Zap, Award, Target } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import Card from "@/components/ui/card/Card";

// Mock metrics data
const RESUME_HISTORY = [
  { name: "Draft 1", score: 62 },
  { name: "Draft 2", score: 71 },
  { name: "Review V1", score: 82 },
  { name: "Current V2", score: 89 },
];

const SKILL_GROWTH = [
  { name: "React", before: 40, current: 80 },
  { name: "TypeScript", before: 30, current: 75 },
  { name: "FastAPI", before: 10, current: 70 },
  { name: "SQL", before: 50, current: 75 },
  { name: "Docker", before: 0, current: 50 },
];

const CODING_SOLVES = [
  { category: "Arrays", Easy: 15, Med: 8, Hard: 2 },
  { category: "Trees", Easy: 8, Med: 4, Hard: 1 },
  { category: "Dynamic Prog", Easy: 4, Med: 6, Hard: 2 },
  { category: "Graphs", Easy: 5, Med: 4, Hard: 0 },
];

const STUDY_HOURS = [
  { day: "Mon", hours: 2.5 },
  { day: "Tue", hours: 4 },
  { day: "Wed", hours: 3.2 },
  { day: "Thu", hours: 5.5 },
  { day: "Fri", hours: 2 },
  { day: "Sat", hours: 6.8 },
  { day: "Sun", hours: 4.5 },
];

export default function Analytics() {
  const [readinessScore] = useState(85);
  const [placementProbability] = useState(91);

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Title */}
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <BarChart2 className="text-cyan-400" />
            Learning & Placement Analytics
          </h1>
          <p className="mt-2 text-slate-400 text-sm">
            Evaluate your learning habits, technical strengths, and placement preparation scores dynamically.
          </p>
        </div>

        {/* Top summary row */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card variant="glass" className="p-6 space-y-2 border-cyan-500/10">
            <div className="flex justify-between items-center text-slate-500">
              <span className="text-xs uppercase font-bold tracking-wider">Career Readiness Score</span>
              <Target size={16} className="text-cyan-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-white">{readinessScore}%</span>
              <span className="text-[10px] text-emerald-400 font-bold">+5% this week</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-400" style={{ width: `${readinessScore}%` }} />
            </div>
          </Card>

          <Card variant="glass" className="p-6 space-y-2 border-emerald-500/10">
            <div className="flex justify-between items-center text-slate-500">
              <span className="text-xs uppercase font-bold tracking-wider">Placement Readiness</span>
              <Award size={16} className="text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-white">{placementProbability}%</span>
              <span className="text-[10px] text-emerald-400 font-bold">Excellent fit</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400" style={{ width: `${placementProbability}%` }} />
            </div>
          </Card>

          <Card variant="glass" className="p-6 space-y-2 border-violet-500/10">
            <div className="flex justify-between items-center text-slate-500">
              <span className="text-xs uppercase font-bold tracking-wider">Problem Solves Rate</span>
              <Code size={16} className="text-violet-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-white">47%</span>
              <span className="text-[10px] text-slate-500">Solved 47/300 tasks</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-violet-400" style={{ width: "47%" }} />
            </div>
          </Card>

          <Card variant="glass" className="p-6 space-y-2 border-amber-500/10">
            <div className="flex justify-between items-center text-slate-500">
              <span className="text-xs uppercase font-bold tracking-wider">Current Streak</span>
              <Zap size={16} className="text-amber-400 animate-pulse" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-white">12 Days</span>
              <span className="text-[10px] text-amber-500 font-bold">New Record!</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400" style={{ width: "80%" }} />
            </div>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Resume History Line */}
          <Card variant="glass" className="p-6 space-y-4">
            <div className="border-b border-slate-850 pb-3 flex items-center gap-2">
              <FileText className="text-cyan-400" size={18} />
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Resume ATS score history</h3>
                <p className="text-[10px] text-slate-500">Tracks improvements across resume draft iterations.</p>
              </div>
            </div>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={RESUME_HISTORY}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                  <YAxis domain={[0, 100]} stroke="#64748b" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b" }} />
                  <Line type="monotone" dataKey="score" stroke="#22d3ee" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 7 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Skill Growth Radar/Bar Comparison */}
          <Card variant="glass" className="p-6 space-y-4">
            <div className="border-b border-slate-850 pb-3 flex items-center gap-2">
              <Star className="text-violet-400" size={18} />
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Skill growth delta</h3>
                <p className="text-[10px] text-slate-500">Proficiency comparison (initial onboarding vs now).</p>
              </div>
            </div>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SKILL_GROWTH}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                  <YAxis domain={[0, 100]} stroke="#64748b" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b" }} />
                  <Bar dataKey="before" fill="#334155" radius={[2, 2, 0, 0]} name="Onboarding Level" />
                  <Bar dataKey="current" fill="#8b5cf6" radius={[2, 2, 0, 0]} name="Current Level" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Coding Solves Breakdown */}
          <Card variant="glass" className="p-6 space-y-4">
            <div className="border-b border-slate-850 pb-3 flex items-center gap-2">
              <Code className="text-emerald-400" size={18} />
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Coding analytics by difficulty</h3>
                <p className="text-[10px] text-slate-500">Distribution of solved algorithms across categories.</p>
              </div>
            </div>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CODING_SOLVES}>
                  <XAxis dataKey="category" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b" }} />
                  <Bar dataKey="Easy" fill="#10b981" stackId="a" />
                  <Bar dataKey="Med" fill="#f59e0b" stackId="a" />
                  <Bar dataKey="Hard" fill="#ef4444" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Learning Hours Chart */}
          <Card variant="glass" className="p-6 space-y-4">
            <div className="border-b border-slate-850 pb-3 flex items-center gap-2">
              <Target className="text-indigo-400" size={18} />
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">weekly Study & Practice Hours</h3>
                <p className="text-[10px] text-slate-500">Tracks hours spent solving tasks, building resumes, mock interviews.</p>
              </div>
            </div>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={STUDY_HOURS}>
                  <XAxis dataKey="day" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b" }} />
                  <Area type="monotone" dataKey="hours" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

      </div>
    </DashboardLayout>
  );
}
