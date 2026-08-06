import { User, MessageSquare } from "lucide-react";
import Card from "@/components/ui/card/Card";
import Button from "@/components/ui/button/Button";

interface RecruiterCardProps {
  name: string;
  role: string;
  companyName: string;
  onContact: () => void;
}

export default function RecruiterCard({ name, role, companyName, onContact }: RecruiterCardProps) {
  return (
    <Card variant="glass" className="p-4 flex items-center justify-between border-slate-850">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 font-bold text-xs select-none">
          <User size={16} />
        </div>
        <div>
          <h4 className="text-xs font-bold text-white leading-tight">{name}</h4>
          <p className="text-[10px] text-slate-500 mt-0.5">{role} at {companyName}</p>
        </div>
      </div>

      <Button
        onClick={onContact}
        className="text-[9px] py-1.5 px-4 bg-slate-950 border border-slate-800 text-slate-400 hover:text-white flex items-center gap-1"
      >
        <MessageSquare size={10} />
        Message
      </Button>
    </Card>
  );
}
