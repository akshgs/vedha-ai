import { Award, Download } from "lucide-react";
import { toast } from "sonner";
import Card from "@/components/ui/card/Card";
import Button from "@/components/ui/button/Button";

interface CertificateCardProps {
  courseTitle: string;
  provider: string;
  date: string;
}

export default function CertificateCard({
  courseTitle,
  provider,
  date,
}: CertificateCardProps) {
  function handleDownload() {
    toast.success(`Compiling PDF credential for: ${courseTitle}...`);
  }

  return (
    <Card variant="glass" className="p-6 flex flex-col justify-between h-[200px] border-amber-500/10">
      <div className="flex justify-between items-start gap-4">
        <div className="flex gap-3">
          <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-2.5 text-amber-400">
            <Award size={22} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white leading-snug">{courseTitle}</h4>
            <p className="text-[10px] text-slate-500 mt-1">Verified Credentials via {provider}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center border-t border-slate-900 pt-4 text-xs select-none">
        <span className="text-[10px] text-slate-500">Issued on {date}</span>
        <Button onClick={handleDownload} className="text-xs py-1.5 px-4 flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
          <Download size={12} />
          Get PDF
        </Button>
      </div>
    </Card>
  );
}
