import { FileText, ArrowUpRight } from "lucide-react";

interface Citation {
  filename: string;
  page: number;
  snippet: string;
}

interface CitationPanelProps {
  citations: Citation[];
}

export default function CitationPanel({ citations }: CitationPanelProps) {
  if (citations.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-850 bg-slate-900/40 p-4 space-y-3">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <FileText size={14} className="text-cyan-400" />
        <h4 className="text-[10px] font-bold text-white uppercase tracking-wider">Source Reference Citations</h4>
      </div>
      <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-1">
        {citations.map((cite, idx) => (
          <div key={idx} className="rounded-xl bg-slate-950/60 p-3 border border-slate-900 text-xs">
            <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold">
              <span>{cite.filename} • Page {cite.page}</span>
              <ArrowUpRight size={10} className="text-cyan-400" />
            </div>
            <p className="text-slate-400 mt-1.5 leading-relaxed italic font-serif">
              "{cite.snippet}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
