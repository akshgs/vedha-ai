type Props = {
  title: string;
  value: number;
  color: string;
};

export default function ProgressCard({
  title,
  value,
  color,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

      <div className="flex items-center justify-between">

        <h3 className="text-lg font-semibold text-white">
          {title}
        </h3>

        <span className="text-2xl font-bold text-white">
          {value}%
        </span>

      </div>

      <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-800">

        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{
            width: `${Math.min(Math.max(value, 0), 100)}%`,
          }}
        />

      </div>

    </div>
  );
}