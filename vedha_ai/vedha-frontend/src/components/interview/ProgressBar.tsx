type Props = {
  current: number;
  total: number;
};

export default function ProgressBar({
  current,
  total,
}: Props) {
  const progress =
    total === 0 ? 0 : (current / total) * 100;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm text-slate-400">
          Interview Progress
        </span>

        <span className="font-semibold text-cyan-400">
          {current}/{total}
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-cyan-500 transition-all duration-300"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
}