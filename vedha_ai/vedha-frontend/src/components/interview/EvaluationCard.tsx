type Props = {
  title: string;
  items: string[];
  color: string;
};

export default function EvaluationCard({
  title,
  items,
  color,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2
        className={`mb-5 text-2xl font-bold ${color}`}
      >
        {title}
      </h2>

      <ul className="space-y-3">
        {items.map((item, index) => (
          <li
            key={index}
            className="rounded-lg bg-slate-800 p-3 text-slate-200"
          >
            • {item}
          </li>
        ))}
      </ul>
    </div>
  );
}