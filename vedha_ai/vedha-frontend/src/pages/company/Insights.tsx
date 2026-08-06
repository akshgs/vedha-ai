import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Sparkles, TrendingUp, DollarSign, Globe, Award } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import Card from "@/components/ui/card/Card";

const MOCK_SALARY_TRENDS = [
  { year: "2023", Backend: 8, Frontend: 7, DevOps: 9 },
  { year: "2024", Backend: 10, Frontend: 9, DevOps: 11 },
  { year: "2025", Backend: 12, Frontend: 10, DevOps: 13 },
  { year: "2026", Backend: 14, Frontend: 13, DevOps: 15 },
];

const MOCK_SUPPLY_DEMAND = [
  { skill: "FastAPI", supply: 45, demand: 88 },
  { skill: "React", supply: 90, demand: 95 },
  { skill: "Docker", supply: 30, demand: 78 },
  { skill: "Kubernetes", supply: 15, demand: 62 },
];

export default function Insights() {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Title */}
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="text-cyan-400" />
            Corporate Industry Insights
          </h1>
          <p className="mt-2 text-slate-400 text-sm">
            Inspect market salary curves, trace sector talent supply-demand loops, and adjust hiring plans dynamically.
          </p>
        </div>

        {/* Charts Grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Salary Curve */}
          <Card variant="glass" className="p-6 space-y-4">
            <div className="border-b border-slate-850 pb-3 flex items-center gap-2">
              <DollarSign className="text-cyan-400" size={18} />
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Salary Band Evolution (LPA INR)</h3>
                <p className="text-[10px] text-slate-500">Average starting package progression across corporate segments.</p>
              </div>
            </div>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_SALARY_TRENDS}>
                  <XAxis dataKey="year" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b" }} />
                  <Line type="monotone" dataKey="Backend" stroke="#06b6d4" strokeWidth={2.5} />
                  <Line type="monotone" dataKey="Frontend" stroke="#8b5cf6" strokeWidth={2.5} />
                  <Line type="monotone" dataKey="DevOps" stroke="#10b981" strokeWidth={2.5} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Supply vs Demand */}
          <Card variant="glass" className="p-6 space-y-4">
            <div className="border-b border-slate-850 pb-3 flex items-center gap-2">
              <TrendingUp className="text-violet-400" size={18} />
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Talent Supply vs Market Demand</h3>
                <p className="text-[10px] text-slate-500">Skill index comparison based on student profiles vs job posts.</p>
              </div>
            </div>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_SUPPLY_DEMAND}>
                  <XAxis dataKey="skill" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b" }} />
                  <Bar dataKey="supply" fill="#334155" radius={[2, 2, 0, 0]} name="Student Supply" />
                  <Bar dataKey="demand" fill="#8b5cf6" radius={[2, 2, 0, 0]} name="Recruiter Demand" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Dynamic highlights */}
        <div className="grid gap-6 sm:grid-cols-2">
          <Card variant="default" className="p-5 space-y-2 border-slate-850 bg-slate-900/40">
            <span className="text-[9px] uppercase font-bold text-emerald-400 flex items-center gap-1">
              <Award size={10} /> High demand skill
            </span>
            <h4 className="text-sm font-bold text-white mt-1">FastAPI Backend Development</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              FastAPI profiles show a <b>+43%</b> demand gap. Candidate matches possessing verified FastAPI certifications fetch shortlist times 40% faster.
            </p>
          </Card>

          <Card variant="default" className="p-5 space-y-2 border-slate-850 bg-slate-900/40">
            <span className="text-[9px] uppercase font-bold text-cyan-400 flex items-center gap-1">
              <Globe size={10} /> Regional highlight
            </span>
            <h4 className="text-sm font-bold text-white mt-1">Mumbai and Pune clusters</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              The western region demonstrates an accelerated DevOps hiring cycle. Average packages scaling to 15 LPA for cloud deployment professionals.
            </p>
          </Card>
        </div>

      </div>
    </DashboardLayout>
  );
}
