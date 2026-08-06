import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import Card from "@/components/ui/card/Card";

interface SkillRadarProps {
  data: { skill: string; current: number; benchmark: number }[];
  title?: string;
}

export default function SkillRadar({ data, title = "Skill Capability Matrix" }: SkillRadarProps) {
  return (
    <Card variant="glass" className="p-6">
      <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2 mb-4">
        {title}
      </h3>
      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="#1e293b" />
            <PolarAngleAxis dataKey="skill" stroke="#94a3b8" fontSize={9} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={8} />
            <Radar name="Your Level" dataKey="current" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.25} />
            <Radar name="Benchmark" dataKey="benchmark" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.15} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
