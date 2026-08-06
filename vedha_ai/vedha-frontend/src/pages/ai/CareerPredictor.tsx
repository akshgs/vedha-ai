import { useEffect, useState } from "react";
import { Sparkles, TrendingUp, DollarSign } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from "recharts";
import { toast } from "sonner";
import DashboardLayout from "@/layouts/DashboardLayout";
import Card from "@/components/ui/card/Card";
import PageHeader from "@/components/ui/layout/PageHeader";
import {
  predictCareerPath,
  CareerScoreCard,
  SkillRadar,
  type CareerPredictionResponse,
} from "@/ai";

export default function CareerPredictor() {
  const [data, setData] = useState<CareerPredictionResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPredictions() {
      try {
        setLoading(true);
        const res = await predictCareerPath();
        setData(res);
      } catch {
        toast.error("Failed to load predictions models.");
      } finally {
        setLoading(false);
      }
    }
    void loadPredictions();
  }, []);

  // Mock radar matching data
  const radarData = [
    { skill: "FastAPI", current: 40, benchmark: 85 },
    { skill: "React", current: 80, benchmark: 90 },
    { skill: "Docker", current: 25, benchmark: 75 },
    { skill: "PostgreSQL", current: 60, benchmark: 70 },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl bg-slate-905 border border-slate-800 p-8 text-center text-slate-500 animate-pulse">
          Analyzing career vectors...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        
        {/* Master Page Header */}
        <PageHeader
          title="AI Career & Salary Predictor"
          subtitle="Leverage LLM and regression modeling to predict your career milestones, region salary curves, and upskilling benchmarks."
          icon={<Sparkles size={22} />}
        />

        {/* Aggregate Cards */}
        {data && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <CareerScoreCard score={88} delta="+3% this month" verdict="High probability of matching backend role" />
            
            <Card variant="glass" className="p-6 space-y-2 border-violet-500/10">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-[10px] uppercase font-bold tracking-wider">Salary Growth Potential</span>
                <DollarSign size={16} className="text-violet-400" />
              </div>
              <p className="text-3xl font-black text-white">{data.growthProbability}%</p>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-violet-400" style={{ width: `${data.growthProbability}%` }} />
              </div>
              <span className="text-[9px] text-slate-500 mt-1 block">Accelerated by backend skillset adoption</span>
            </Card>

            <Card variant="glass" className="p-6 space-y-2 border-amber-500/10">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-[10px] uppercase font-bold tracking-wider">Projected Trajectory</span>
                <TrendingUp size={16} className="text-amber-400 animate-pulse" />
              </div>
              <p className="text-sm font-bold text-white truncate">{data.careerRoadmap[1]}</p>
              <span className="text-[10px] text-slate-400 block mt-1">Goal: {data.careerRoadmap[2]}</span>
            </Card>
          </div>
        )}

        {/* Charts & Graphs */}
        {data && (
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Radar chart */}
            <SkillRadar data={radarData} title="Target Skill Metrics Comparison" />

            {/* Salary Line */}
            <Card variant="glass" className="p-6 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-850 pb-2">Region Salary Progression (LPA INR)</h3>
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.salaryProjection[0].values}>
                    <XAxis dataKey="year" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b" }} />
                    <Area type="monotone" dataKey="lpa" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.15} strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Supply Demand */}
            <Card variant="glass" className="p-6 space-y-4 lg:col-span-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-850 pb-2">Skills Market Supply vs Demand Ratio</h3>
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.supplyDemandIndex}>
                    <XAxis dataKey="skill" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b" }} />
                    <Bar dataKey="supply" fill="#334155" name="Candidate Supply Index" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="demand" fill="#8b5cf6" name="Corporate Recruiter Demand" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
