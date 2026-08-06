import { useEffect, useState } from "react";
import { ClipboardList, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/layouts/DashboardLayout";
import { getPipeline, updateCandidateStage, type PipelineStage } from "@/services/recruiter";

export default function HiringPipeline() {
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadPipeline() {
    try {
      setLoading(true);
      const data = await getPipeline();
      setStages(data);
    } catch {
      toast.error("Failed to load hiring pipeline dashboard.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadPipeline();
  }, []);

  async function handleMove(candidateId: number, fromStageId: string, toStageId: string) {
    try {
      await updateCandidateStage(candidateId, fromStageId, toStageId);
      
      // Update local state by relocating the candidate card
      const updated = stages.map((stage) => {
        if (stage.id === fromStageId) {
          return {
            ...stage,
            candidates: stage.candidates.filter((c) => c.id !== candidateId),
          };
        }
        if (stage.id === toStageId) {
          const movingCandidate = stages
            .find((s) => s.id === fromStageId)
            ?.candidates.find((c) => c.id === candidateId);
            
          if (movingCandidate) {
            return {
              ...stage,
              candidates: [...stage.candidates, movingCandidate],
            };
          }
        }
        return stage;
      });

      setStages(updated);
      toast.success("Candidate shifted in recruitment pipeline!");
    } catch {
      toast.error("Failed to transition candidate stage.");
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Title */}
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <ClipboardList className="text-cyan-400" />
            Hiring Pipeline Board
          </h1>
          <p className="mt-2 text-slate-400 text-sm">
            Drag, shift, or promote candidates across recruitment stages to maintain organized hiring flows.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-xs text-slate-500 py-12 animate-pulse">Loading stages board...</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 items-start">
            {stages.map((stage, sIdx) => (
              <div key={stage.id} className="rounded-2xl border border-slate-850 bg-slate-950/40 p-4 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                  <h3 className="font-bold text-white text-xs">{stage.title}</h3>
                  <span className="text-[10px] bg-slate-900 border border-slate-850 text-slate-400 px-2 py-0.5 rounded-full font-bold">
                    {stage.candidates.length}
                  </span>
                </div>

                <div className="space-y-3 min-h-[300px]">
                  {stage.candidates.length === 0 ? (
                    <div className="text-slate-600 text-[10px] italic text-center py-10">No candidates in stage.</div>
                  ) : (
                    stage.candidates.map((cand) => (
                      <div key={cand.id} className="rounded-xl bg-slate-900 border border-slate-850/60 p-3 space-y-2 hover:border-cyan-500/30 transition">
                        <div>
                          <h4 className="font-bold text-white text-xs">{cand.name}</h4>
                          <p className="text-[10px] text-slate-500">{cand.targetRole}</p>
                        </div>
                        {cand.notes && <p className="text-[9px] text-slate-400 leading-relaxed font-mono">{cand.notes}</p>}
                        
                        {sIdx < stages.length - 1 && (
                          <div className="flex justify-end pt-1">
                            <button
                              onClick={() => handleMove(cand.id, stage.id, stages[sIdx + 1].id)}
                              className="text-[9px] text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-0.5"
                            >
                              Promote
                              <ArrowRight size={10} />
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
