import { CheckCircle2, AlertCircle } from "lucide-react";
import Card from "@/components/ui/card/Card";

interface SubmissionCardProps {
  id: number;
  status: "Accepted" | "Wrong Answer" | "Runtime Error" | "Compilation Error";
  language: string;
  runtime: string;
  memory: string;
  submittedAt: string;
  code: string;
}

export default function SubmissionCard({
  status,
  language,
  runtime,
  memory,
  submittedAt,
  code,
}: SubmissionCardProps) {
  const isAccepted = status === "Accepted";

  return (
    <Card variant="glass" className={`p-4 space-y-3 ${isAccepted ? "border-emerald-500/10 bg-emerald-500/5" : "border-red-500/10 bg-red-500/5"}`}>
      <div className="flex justify-between items-start gap-4">
        <div className="flex gap-2 items-center">
          {isAccepted ? (
            <CheckCircle2 size={16} className="text-emerald-450" />
          ) : (
            <AlertCircle size={16} className="text-red-450" />
          )}
          <div>
            <h4 className={`text-xs font-bold ${isAccepted ? "text-emerald-400" : "text-red-400"}`}>
              {status}
            </h4>
            <span className="text-[9px] text-slate-500 block mt-0.5">{submittedAt}</span>
          </div>
        </div>

        <div className="flex gap-3 text-[10px] text-slate-400 select-none">
          <span>{language}</span>
          <span>•</span>
          <span>{runtime}</span>
          <span>•</span>
          <span>{memory}</span>
        </div>
      </div>

      <pre className="bg-slate-950 p-3 rounded-xl border border-slate-900 font-mono text-[10px] text-slate-300 overflow-x-auto max-h-[120px] leading-relaxed">
        {code}
      </pre>
    </Card>
  );
}
