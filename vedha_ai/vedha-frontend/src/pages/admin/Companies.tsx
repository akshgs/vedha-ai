import { useEffect, useState } from "react";
import { Search, RefreshCw, ChevronLeft, ChevronRight, CheckCircle2, XCircle } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { getCompanies, approveCompany, rejectCompany } from "@/services/admin";
import { toast } from "sonner";

import PageHeader from "@/components/ui/layout/PageHeader";

export default function Companies() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  async function loadCompanies() {
    try {
      setLoading(true);
      const data = await getCompanies({
        page,
        limit,
        search: search || undefined,
        status: status || undefined,
      });
      setCompanies(data.companies ?? data ?? []);
      setTotalPages(data.total_pages ?? Math.ceil((data.total ?? 1) / limit) ?? 1);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load corporate directory.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCompanies();
  }, [page, status]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    loadCompanies();
  }

  async function handleApprove(companyId: number) {
    try {
      await approveCompany(companyId);
      toast.success("Recruiter profile approved successfully!");
      loadCompanies();
    } catch {
      toast.error("Failed to approve recruiter account.");
    }
  }

  async function handleReject(companyId: number) {
    const reason = prompt("Explain rejection notice detail:");
    if (!reason) return;
    try {
      await rejectCompany(companyId, reason);
      toast.success("Recruiter registration rejected.");
      loadCompanies();
    } catch {
      toast.error("Failed to reject recruiter account.");
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8 font-sans">
        <PageHeader
          title="Companies Management"
          subtitle="Audit registered enterprise recruiters, verify company legitimacy, and clear inactive entries."
        />

        {/* Filter Row */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 shadow-sm flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by company name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-violet-500"
            />
          </form>

          <div className="flex items-center gap-3">
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-300 outline-none focus:border-violet-500"
            >
              <option value="">All Statuses</option>
              <option value="active">Active / Verified</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>

            <button
              onClick={() => {
                setSearch("");
                setStatus("");
                setPage(1);
              }}
              className="rounded-xl border border-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-900"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Table representation */}
        {loading ? (
          <div className="flex h-64 items-center justify-center text-slate-400">
            <RefreshCw size={24} className="animate-spin mr-2" />
            Fetching company data...
          </div>
        ) : companies.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center text-slate-500">
            No company profiles match criteria.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/60 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      <th className="p-4">Company Name</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Industry</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-sm">
                    {companies.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-900/40 transition">
                        <td className="p-4 font-semibold text-white">{c.company_name}</td>
                        <td className="p-4 text-slate-400">{c.location || "—"}</td>
                        <td className="p-4 text-slate-400">{c.industry || "—"}</td>
                        <td className="p-4">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              c.verification_status === "approved"
                                ? "bg-emerald-500/10 text-emerald-400"
                                : c.verification_status === "rejected"
                                ? "bg-red-500/10 text-red-400"
                                : "bg-amber-500/10 text-amber-400"
                            }`}
                          >
                            {c.verification_status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          {c.verification_status === "pending" && (
                            <>
                              <button
                                onClick={() => handleApprove(c.id)}
                                className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 transition animate-fade-in"
                              >
                                <CheckCircle2 size={12} />
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(c.id)}
                                className="inline-flex items-center gap-1 rounded-lg border border-red-500/20 px-2.5 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition animate-fade-in"
                              >
                                <XCircle size={12} />
                                Reject
                              </button>
                            </>
                          )}
                          {c.verification_status !== "pending" && (
                            <span className="text-xs text-slate-500 italic pr-3">Verified / Settled</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-900 pt-4 text-xs text-slate-400">
                <p>
                  Page <span className="font-semibold text-white">{page}</span> of{" "}
                  <span className="font-semibold text-white">{totalPages}</span>
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="flex items-center gap-1 rounded-lg border border-slate-800 px-3 py-1.5 hover:bg-slate-900 disabled:opacity-50"
                  >
                    <ChevronLeft size={14} />
                    Previous
                  </button>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="flex items-center gap-1 rounded-lg border border-slate-800 px-3 py-1.5 hover:bg-slate-900 disabled:opacity-50"
                  >
                    Next
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}