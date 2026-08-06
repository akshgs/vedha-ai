import { CheckCircle2, Clock, Lock } from "lucide-react";
import Card from "@/components/ui/card/Card";

interface TimelineNode {
  id: number;
  name: string;
  desc: string;
  status: "completed" | "in_progress" | "locked";
}

interface LearningTimelineProps {
  nodes: TimelineNode[];
  selectedNodeId: number;
  onSelectNode: (node: TimelineNode) => void;
}

export default function LearningTimeline({
  nodes,
  selectedNodeId,
  onSelectNode,
}: LearningTimelineProps) {
  return (
    <Card variant="glass" className="p-6">
      <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2.5 mb-6">
        Curriculum Roadmap Milestones
      </h3>
      <div className="relative border-l border-slate-800 ml-4 pl-8 space-y-6">
        {nodes.map((node) => {
          const isCompleted = node.status === "completed";
          const isInProgress = node.status === "in_progress";
          const isSelected = selectedNodeId === node.id;

          return (
            <div key={node.id} className="relative">
              {/* Node bullet */}
              <div
                className={`absolute -left-12 top-0.5 flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 ${
                  isCompleted
                    ? "bg-emerald-500/20 border-emerald-500 text-emerald-450"
                    : isInProgress
                    ? "bg-cyan-500/20 border-cyan-500 text-cyan-400 animate-pulse"
                    : "bg-slate-900 border-slate-800 text-slate-655"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 size={15} />
                ) : isInProgress ? (
                  <Clock size={15} />
                ) : (
                  <Lock size={12} />
                )}
              </div>

              {/* Box */}
              <div
                onClick={() => onSelectNode(node)}
                className={`cursor-pointer rounded-2xl border p-4 transition-all duration-300 ${
                  isSelected
                    ? "border-cyan-500 bg-cyan-500/5 shadow-inner"
                    : "border-slate-850 bg-slate-900/20 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">{node.name}</h4>
                  <span className="text-[9px] uppercase font-bold tracking-widest text-slate-500">
                    {node.status}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">{node.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
