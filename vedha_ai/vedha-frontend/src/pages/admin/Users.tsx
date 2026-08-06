import { useEffect, useState } from "react";
import { Search, Trash2, RefreshCw, ChevronLeft, ChevronRight, UserX, UserCheck } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import Button from "@/components/ui/button/Button";
import { getUsers, deleteUser, updateUserStatus } from "@/services/admin";
import { toast } from "sonner";

import PageHeader from "@/components/ui/layout/PageHeader";

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  async function loadUsers() {
    try {
      setLoading(true);
      const data = await getUsers({
        page,
        limit,
        search: search || undefined,
        role: role || undefined,
        status: status || undefined,
      });
      setUsers(data.users ?? data ?? []);
      setTotalPages(data.total_pages ?? Math.ceil((data.total ?? 1) / limit) ?? 1);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load user directories.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, [page, role, status]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    loadUsers();
  }

  async function handleDelete(userId: number) {
    if (!window.confirm("Are you sure you want to permanently delete this user? All associations will be wiped.")) return;
    try {
      await deleteUser(userId);
      toast.success("User account deleted successfully.");
      loadUsers();
    } catch {
      toast.error("Failed to delete user account.");
    }
  }

  async function handleToggleStatus(userId: number, currentStatus: string) {
    const nextStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await updateUserStatus(userId, nextStatus);
      toast.success(`User set to: ${nextStatus}`);
      loadUsers();
    } catch {
      toast.error("Failed to toggle user status.");
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6 font-sans">
        <PageHeader
          title="User Management"
          subtitle="Control platform memberships, modify access states, and clean up inactive profiles."
        />

        {/* Filter Controls */}
        <div className="ve-card p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-450" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-650 outline-none focus:border-cyan-500"
            />
          </form>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-350 outline-none focus:border-cyan-500"
            >
              <option value="">All Roles</option>
              <option value="student">Student</option>
              <option value="company">Company</option>
              <option value="admin">Admin</option>
            </select>

            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-350 outline-none focus:border-cyan-500"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <Button
              onClick={() => {
                setSearch("");
                setRole("");
                setStatus("");
                setPage(1);
              }}
              variant="outline"
              className="text-xs h-8.5 px-3.5"
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="ve-card p-12 text-center text-slate-400 animate-pulse flex items-center justify-center gap-2">
            <RefreshCw size={14} className="animate-spin" />
            Fetching account data...
          </div>
        ) : users.length === 0 ? (
          <div className="ve-card p-12 text-center text-slate-500 italic">
            No accounts match the chosen search criteria.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="ve-card p-0 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="ve-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td className="font-semibold text-white">{u.name}</td>
                        <td className="text-slate-400">{u.email}</td>
                        <td>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              u.role === "admin"
                                ? "bg-violet-500/10 text-violet-400 border border-violet-500/20"
                                : u.role === "company"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              u.status === "active" 
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                                : "bg-slate-800 text-slate-500 border border-slate-750"
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="text-right space-x-2">
                          <button
                            onClick={() => handleToggleStatus(u.id, u.status)}
                            className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                              u.status === "active"
                                ? "border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white"
                                : "border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/10"
                            }`}
                          >
                            {u.status === "active" ? <UserX size={12} /> : <UserCheck size={12} />}
                            {u.status === "active" ? "Block" : "Activate"}
                          </button>
                          <button
                            onClick={() => handleDelete(u.id)}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-500/20 px-2.5 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition cursor-pointer"
                          >
                            <Trash2 size={12} />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-900/60 pt-4 text-xs text-slate-400">
                <p>
                  Page <span className="font-semibold text-white">{page}</span> of{" "}
                  <span className="font-semibold text-white">{totalPages}</span>
                </p>
                <div className="flex gap-2">
                  <Button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    variant="outline"
                    className="text-xs h-8 px-3"
                  >
                    <ChevronLeft size={13} />
                    Previous
                  </Button>
                  <Button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    variant="outline"
                    className="text-xs h-8 px-3"
                  >
                    Next
                    <ChevronRight size={13} />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}