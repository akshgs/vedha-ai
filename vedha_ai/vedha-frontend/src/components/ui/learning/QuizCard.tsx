import { useState } from "react";
import { HelpCircle, CheckCircle2, AlertCircle } from "lucide-react";
import Button from "@/components/ui/button/Button";
import Card from "@/components/ui/card/Card";

interface QuizCardProps {
  id: number;
  title: string;
  question: string;
  options: string[];
  answer: string;
  onSuccess?: () => void;
}

export default function QuizCard({
  title,
  question,
  options,
  answer,
  onSuccess,
}: QuizCardProps) {
  const [selectedOption, setSelectedOption] = useState("");
  const [evaluated, setEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  function handleSubmit() {
    if (!selectedOption) return;
    const correct = selectedOption === answer;
    setIsCorrect(correct);
    setEvaluated(true);
    if (correct && onSuccess) onSuccess();
  }

  return (
    <Card variant="glass" className="p-6 space-y-5">
      <div className="flex gap-2 items-center border-b border-slate-800 pb-2.5">
        <HelpCircle size={16} className="text-cyan-400" />
        <h4 className="text-xs font-bold text-white uppercase tracking-wider">{title}</h4>
      </div>

      <p className="text-xs text-slate-200 leading-relaxed font-semibold">
        {question}
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((opt) => {
          const isSelected = selectedOption === opt;
          return (
            <button
              key={opt}
              type="button"
              disabled={evaluated}
              onClick={() => setSelectedOption(opt)}
              className={`rounded-xl border p-3.5 text-left text-xs font-semibold transition ${
                isSelected
                  ? "border-cyan-500 bg-cyan-500/10 text-cyan-300 shadow-inner"
                  : "border-slate-850 bg-slate-900/20 text-slate-400 hover:border-slate-700 hover:text-white"
              } disabled:opacity-75`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {evaluated ? (
        <div
          className={`rounded-xl border p-4 flex items-center gap-3 text-xs ${
            isCorrect
              ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-400"
              : "border-red-500/30 bg-red-500/5 text-red-400"
          }`}
        >
          {isCorrect ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <div>
            <p className="font-bold">{isCorrect ? "Correct Option!" : "Incorrect Option"}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {isCorrect ? "Earned +50 XP badges!" : `The correct answer was: ${answer}`}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex justify-end pt-2 border-t border-slate-900">
          <Button onClick={handleSubmit} disabled={!selectedOption} className="text-xs py-2 px-6">
            Evaluate Option
          </Button>
        </div>
      )}
    </Card>
  );
}
