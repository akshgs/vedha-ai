import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
} from "recharts";

type Props = {
  score: number;
};

export default function ResumeGauge({
  score,
}: Props) {
  const data = [
    {
      name: "Resume",
      value: score,
      fill: "#06B6D4",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

      <h2 className="mb-6 text-2xl font-bold text-white">
        Resume Score
      </h2>

      <div className="relative h-72">

        <ResponsiveContainer width="100%" height="100%">

          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="65%"
            outerRadius="100%"
            barSize={16}
            data={data}
            startAngle={90}
            endAngle={-270}
          >

            <RadialBar
              dataKey="value"
              cornerRadius={10}
            />

          </RadialBarChart>

        </ResponsiveContainer>

        <div className="absolute inset-0 flex items-center justify-center">

          <div className="text-center">

            <h3 className="text-5xl font-bold text-cyan-400">
              {score}%
            </h3>

            <p className="mt-2 text-slate-400">
              ATS Score
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}