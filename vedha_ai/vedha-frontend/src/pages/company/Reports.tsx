import { useState } from "react";
import { ClipboardList, Download, FileText } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/layouts/DashboardLayout";
import Card from "@/components/ui/card/Card";
import Button from "@/components/ui/button/Button";

interface Report {
  id: number;
  title: string;
  type: string;
  date: string;
  size: string;
}

export default function Reports() {
  const [reports] = useState<Report[]>([
    { id: 1, title: "Q2 Recruitment Funnel Audit", type: "PDF Report", date: "2026-07-20", size: "2.4 MB" },
    { id: 2, title: "Time-to-Hire Analytics Log", type: "CSV Sheet", date: "2026-07-22", size: "840 KB" },
    { id: 3, title: "Ecosystem Placement Conversions", type: "PDF Report", date: "2026-07-24", size: "4.1 MB" },
  ]);

  function handleDownload(title: string) {
    toast.success(`Compiling and downloading: ${title}`);
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Title */}
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <ClipboardList className="text-cyan-400" />
            Recruitment Reports Exporter
          </h1>
          <p className="mt-2 text-slate-400 text-sm">
            Export structured candidate data, review weekly recruitment stats, and compile PDF reports for stakeholders.
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid gap-6 md:grid-cols-3 text-center">
          <Card variant="glass" className="p-5">
            <span className="text-[9px] uppercase font-bold text-slate-500 block">Resume Matches Checked</span>
            <span className="text-2xl font-black text-white mt-1 block">340 candidates</span>
          </Card>
          <Card variant="glass" className="p-5">
            <span className="text-[9px] uppercase font-bold text-slate-500 block">Offer Dispatch Success</span>
            <span className="text-2xl font-black text-emerald-400 mt-1 block">94.8% conversion</span>
          </Card>
          <Card variant="glass" className="p-5">
            <span className="text-[9px] uppercase font-bold text-slate-500 block">Campus Partners Linked</span>
            <span className="text-2xl font-black text-violet-400 mt-1 block">12 universities</span>
          </Card>
        </div>

        {/* Main List */}
        <Card variant="glass" className="p-6">
          <h3 className="text-base font-bold text-white mb-4 border-b border-slate-800 pb-2">Available Reports Registry</h3>
          <div className="divide-y divide-slate-850">
            {reports.map((rep) => (
              <div key={rep.id} className="py-4 flex justify-between items-center text-xs flex-wrap sm:flex-nowrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-slate-900 border border-slate-850 p-2 text-cyan-400">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{rep.title}</h4>
                    <p className="text-slate-400 mt-1">Format: {rep.type} • Size: {rep.size}</p>
                    <p className="text-[9px] text-slate-500 mt-0.5">Compiled on {rep.date}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleDownload(rep.title)}
                    className="text-xs py-1.5 px-4 flex items-center gap-1.5"
                  >
                    <Download size={12} />
                    Download File
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </DashboardLayout>
  );
}
