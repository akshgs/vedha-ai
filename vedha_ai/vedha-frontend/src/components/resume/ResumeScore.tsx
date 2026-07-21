interface ResumeScoreProps {
  score: number;
}

export default function ResumeScore({
  score,
}: ResumeScoreProps) {
  const color =
    score >= 80
      ? "text-green-400"
      : score >= 60
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <p className="text-slate-400">
        ATS Score
      </p>

      <h3 className={`mt-3 text-5xl font-bold ${color}`}>
        {score}/100
      </h3>

      <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-700">
        <div
          className="h-full rounded-full bg-cyan-500 transition-all duration-700"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}