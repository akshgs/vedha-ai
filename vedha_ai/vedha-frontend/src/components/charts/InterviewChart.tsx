import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

type Props = {
  score: number;
};

export default function InterviewChart({
  score,
}: Props) {
  const data = [
    {
      name: "Attempt 1",
      score: 45,
    },
    {
      name: "Attempt 2",
      score: 58,
    },
    {
      name: "Attempt 3",
      score: 72,
    },
    {
      name: "Attempt 4",
      score,
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="mb-6 text-2xl font-bold text-white">
        Interview Performance
      </h2>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              stroke="#334155"
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="name"
              stroke="#94A3B8"
            />

            <YAxis
              domain={[0, 100]}
              stroke="#94A3B8"
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="score"
              stroke="#06B6D4"
              strokeWidth={3}
              dot={{
                r: 5,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}