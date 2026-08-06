import { useState } from "react";
import { FileCode, Upload, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import Button from "@/components/ui/button/Button";
import Card from "@/components/ui/card/Card";

interface AssignmentCardProps {
  id: number;
  title: string;
  desc: string;
  submitted: boolean;
  onSuccess?: () => void;
}

export default function AssignmentCard({
  title,
  desc,
  submitted,
  onSuccess,
}: AssignmentCardProps) {
  const [hasSubmitted, setHasSubmitted] = useState(submitted);
  const [loading, setLoading] = useState(false);

  function handleUpload() {
    setLoading(true);
    setTimeout(() => {
      setHasSubmitted(true);
      setLoading(false);
      toast.success(`Assignment '${title}' uploaded successfully!`);
      if (onSuccess) onSuccess();
    }, 1200);
  }

  return (
    <Card variant="glass" className="p-5 flex flex-col justify-between min-h-[140px] space-y-4">
      <div className="space-y-1.5">
        <div className="flex gap-2 items-center">
          <FileCode size={14} className="text-cyan-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">{title}</h4>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          {desc}
        </p>
      </div>

      <div className="flex justify-between items-center border-t border-slate-900 pt-3 text-xs select-none">
        {hasSubmitted ? (
          <span className="text-emerald-450 font-bold flex items-center gap-1">
            <CheckCircle2 size={12} />
            Submitted
          </span>
        ) : (
          <span className="text-slate-500 font-bold uppercase text-[9px]">Awaiting Upload</span>
        )}

        {!hasSubmitted && (
          <Button
            onClick={handleUpload}
            disabled={loading}
            className="text-[10px] py-1.5 px-4 bg-cyan-600 hover:bg-cyan-500 flex items-center gap-1"
          >
            <Upload size={10} />
            Upload File
          </Button>
        )}
      </div>
    </Card>
  );
}
