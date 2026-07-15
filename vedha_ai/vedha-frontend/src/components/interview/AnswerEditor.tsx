type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function AnswerEditor({
  value,
  onChange,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h3 className="mb-4 text-xl font-semibold text-white">
        Your Answer
      </h3>

      <textarea
        rows={10}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your answer here..."
        className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none transition focus:border-cyan-500"
      />
    </div>
  );
}