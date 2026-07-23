type Props = {
  title: string;
  score: number;
};

export default function ScoreCard({
  title,
  score,
}: Props) {
  const color =
    score >= 80
      ? "text-emerald-400"
      : score >= 60
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
      <p className="text-slate-400">
        {title}
      </p>

      <h2 className={`mt-3 text-4xl font-bold ${color}`}>
        {score}%
      </h2>
    </div>
  );
}