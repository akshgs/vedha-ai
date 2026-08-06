import { Play, Send, Terminal } from "lucide-react";
import Button from "@/components/ui/button/Button";

interface CodeRunnerProps {
  onRun: () => void;
  onSubmit: () => void;
  loading: boolean;
  submitLoading: boolean;
  language: string;
  onLanguageChange: (lang: string) => void;
}

export default function CodeRunner({
  onRun,
  onSubmit,
  loading,
  submitLoading,
  language,
  onLanguageChange,
}: CodeRunnerProps) {
  return (
    <div className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-900 select-none">
      <div className="flex gap-2 items-center text-xs">
        <Terminal size={14} className="text-cyan-400" />
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="bg-slate-900 border border-slate-850 text-white rounded-lg px-2.5 py-1 text-[11px] outline-none focus:border-cyan-500 font-mono"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
        </select>
      </div>

      <div className="flex gap-2 text-xs">
        <Button
          onClick={onRun}
          disabled={loading || submitLoading}
          variant="outline"
          className="text-xs py-1.5 px-4 border-slate-800 text-slate-400 hover:text-white flex items-center gap-1.5"
        >
          <Play size={11} />
          {loading ? "Running..." : "Run Code"}
        </Button>
        <Button
          onClick={onSubmit}
          disabled={loading || submitLoading}
          className="text-xs py-1.5 px-5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 flex items-center gap-1.5 text-white"
        >
          <Send size={11} />
          {submitLoading ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </div>
  );
}
