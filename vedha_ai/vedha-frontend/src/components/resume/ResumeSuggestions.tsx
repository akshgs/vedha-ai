interface ResumeSuggestionsProps {
  feedback: string;
}

export default function ResumeSuggestions({
  feedback,
}: ResumeSuggestionsProps) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-6">
      <h2 className="mb-4 text-lg font-semibold">
        💡 AI Suggestions
      </h2>

      <p className="leading-7 text-slate-300 whitespace-pre-line">
        {feedback}
      </p>
    </div>
  );
}