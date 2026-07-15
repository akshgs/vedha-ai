type Props = {
  question: string;
  questionNumber: number;
};

export default function QuestionCard({
  question,
  questionNumber,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-lg">
      <div className="mb-4 inline-flex rounded-full bg-cyan-500/20 px-4 py-2 text-sm font-semibold text-cyan-400">
        Question {questionNumber}
      </div>

      <h2 className="text-3xl font-bold leading-relaxed text-white">
        {question}
      </h2>
    </div>
  );
}