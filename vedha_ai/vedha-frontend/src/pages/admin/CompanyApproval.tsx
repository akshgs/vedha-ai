import { useEffect, useState } from "react";
import { CheckCircle, RefreshCw, XCircle } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { getPendingCompanies, approveCompany, rejectCompany } from "@/services/admin";
import { toast } from "sonner";

export default function CompanyApproval() {
  const [pending, setPending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadPending() {
    try {
      setLoading(true);
      const data = await getPendingCompanies();
      setPending(data.companies ?? data ?? []);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load pending registrations.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPending();
  }, []);

  async function handleApprove(id: number) {
    try {
      await approveCompany(id);
      toast.success("Company profile approved!");
      loadPending();
    } catch {
      toast.error("Approval action failed.");
    }
  }

  async function handleReject(id: number) {
    const reason = prompt("Please provide a rejection explanation note:");
    if (!reason) return;
    try {
      await rejectCompany(id, reason);
      toast.success("Company registration rejected.");
      loadPending();
    } catch {
      toast.error("Rejection action failed.");
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center text-slate-400">
          <RefreshCw size={24} className="animate-spin mr-2" />
          Loading pending company accounts...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8 font-sans">
        <div>
          <h1 className="text-3xl font-bold">Pending Registrations</h1>
          <p className="mt-2 text-slate-400">
            Verify and approve newly registered company recruitment accounts.
          </p>
        </div>

        {pending.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center text-slate-500">
            <CheckCircle className="mx-auto mb-4 text-slate-600" size={48} />
            <h3 className="text-lg font-bold">No Pending Approvals</h3>
            <p className="mt-2 text-slate-400 text-sm max-w-xs mx-auto">
              All company recruiter accounts are fully screened and processed!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {pending.map((company) => (
              <div
                key={company.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-white">{company.company_name}</h3>
                    <p className="text-xs text-indigo-400 mt-0.5">{company.industry}</p>
                  </div>
                  <span className="rounded-full bg-amber-500/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    Pending Verification
                  </span>
                </div>

                <div className="text-xs text-slate-400 space-y-1 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                  <p>
                    <span className="font-semibold text-slate-300">Website:</span>{" "}
                    {company.website ? (
                      <a href={company.website} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">
                        {company.website}
                      </a>
                    ) : (
                      "None"
                    )}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-300">Location:</span> {company.location || "Not Specifed"}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-300">Size:</span> {company.company_size || "Not Specifed"}
                  </p>
                </div>

                {company.description && (
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{company.description}</p>
                )}

                <div className="flex gap-2 justify-end border-t border-slate-800/60 pt-4 mt-4">
                  <button
                    onClick={() => handleReject(company.id)}
                    className="flex items-center gap-1 rounded-lg border border-red-500/20 px-3.5 py-1.5 text-xs text-red-400 hover:bg-red-500/10 transition"
                  >
                    <XCircle size={12} />
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(company.id)}
                    className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs text-white hover:bg-emerald-500 transition"
                  >
                    <CheckCircle size={12} />
                    Approve Account
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
