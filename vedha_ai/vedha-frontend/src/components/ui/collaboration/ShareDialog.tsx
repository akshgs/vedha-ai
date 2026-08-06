import { Copy, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Modal from "@/components/ui/modal/Modal";
import Button from "@/components/ui/button/Button";

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
}

export default function ShareDialog({ isOpen, onClose, postId }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/networking/feed/posts/${postId}`;

  function handleCopy() {
    void navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Post URL copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Professional Update">
      <div className="space-y-4 text-xs text-slate-350 leading-relaxed">
        <p>Copy the link below to share this discussion post with your network.</p>
        <div className="flex gap-2 items-center bg-slate-950 p-3 rounded-xl border border-slate-900">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="w-full bg-transparent outline-none text-slate-300 font-mono text-[11px]"
          />
          <button onClick={handleCopy} className="text-cyan-400 hover:text-cyan-300 transition shrink-0 p-1">
            {copied ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Copy size={14} />}
          </button>
        </div>
        <div className="flex justify-end pt-2 border-t border-slate-900">
          <Button onClick={onClose} className="text-xs">
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}
