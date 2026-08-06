import { DollarSign, Calendar, Check, X } from "lucide-react";
import Card from "@/components/ui/card/Card";
import Button from "@/components/ui/button/Button";

interface OfferCardProps {
  id: string;
  jobTitle: string;
  companyName: string;
  salary: string;
  deadline: string;
  status: "Accepted" | "Pending" | "Declined";
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}

export default function OfferCard({
  id,
  jobTitle,
  companyName,
  salary,
  deadline,
  status,
  onAccept,
  onDecline,
}: OfferCardProps) {
  const statusColors = {
    Accepted: "bg-emerald-500/10 text-emerald-450 border border-emerald-500/20",
    Pending: "bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse",
    Declined: "bg-red-500/10 text-red-400 border border-red-500/20",
  };

  return (
    <Card variant="glass" className="p-5 space-y-4">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h4 className="text-xs font-bold text-white leading-snug">{jobTitle}</h4>
          <p className="text-[10px] text-cyan-400 mt-0.5">{companyName}</p>
        </div>
        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${statusColors[status]}`}>
          {status}
        </span>
      </div>

      <div className="flex gap-4 text-[10px] text-slate-500 select-none font-semibold">
        <span className="flex items-center gap-1">
          <DollarSign size={12} className="text-slate-600" />
          Salary Package: {salary}
        </span>
        <span className="flex items-center gap-1">
          <Calendar size={12} className="text-slate-600" />
          Respond by: {deadline}
        </span>
      </div>

      {status === "Pending" && (
        <div className="flex justify-end gap-2 border-t border-slate-900 pt-3">
          <Button
            onClick={() => onDecline(id)}
            variant="outline"
            className="text-[9px] py-1.5 px-3 border-red-550/20 text-red-450 hover:bg-red-500/5"
          >
            <X size={10} className="mr-1" />
            Decline
          </Button>
          <Button
            onClick={() => onAccept(id)}
            className="text-[9px] py-1.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1"
          >
            <Check size={10} />
            Accept Offer
          </Button>
        </div>
      )}
    </Card>
  );
}
