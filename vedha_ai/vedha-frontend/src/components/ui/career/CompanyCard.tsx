import { MapPin, Link as LinkIcon, Compass } from "lucide-react";
import Card from "@/components/ui/card/Card";

interface CompanyCardProps {
  name: string;
  industry: string;
  size: string;
  location: string;
  website: string;
  desc: string;
  openRoles: number;
}

export default function CompanyCard({
  name,
  industry,
  size,
  location,
  website,
  desc,
  openRoles,
}: CompanyCardProps) {
  return (
    <Card variant="glass" className="p-5 space-y-4">
      <div className="flex gap-4 items-start border-b border-slate-900 pb-3">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 flex items-center justify-center text-cyan-450 border border-slate-800 shrink-0 font-bold text-lg select-none">
          {name[0]}
        </div>
        <div>
          <h4 className="text-xs font-bold text-white leading-tight">{name}</h4>
          <p className="text-[10px] text-cyan-400 mt-0.5">{industry} • {size}</p>
        </div>
      </div>

      <p className="text-[11px] text-slate-400 leading-relaxed">
        {desc}
      </p>

      <div className="flex flex-col gap-2 pt-2 text-[10px] text-slate-500 font-semibold select-none">
        <span className="flex items-center gap-1.5">
          <MapPin size={12} className="text-slate-655" />
          Location: {location}
        </span>
        <span className="flex items-center gap-1.5">
          <LinkIcon size={12} className="text-slate-655" />
          Website: <a href={website} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">{website}</a>
        </span>
        <span className="flex items-center gap-1.5">
          <Compass size={12} className="text-slate-655" />
          Open Roles: {openRoles} active positions
        </span>
      </div>
    </Card>
  );
}
