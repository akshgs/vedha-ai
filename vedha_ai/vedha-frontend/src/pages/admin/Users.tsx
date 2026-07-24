import { useEffect, useState } from "react";
import { Search, Trash2, RefreshCw, ChevronLeft, ChevronRight, UserX, UserCheck } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { getUsers, deleteUser, updateUserStatus } from "@/services/admin";
import { toast } from "sonner";

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
      <div className="mx-auto max-w-7xl space-y-8 font-sans">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="mt-2 text-slate-400">
            Control platform memberships, modify access states, and clean up inactive profiles.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 shadow-sm flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-violet-500"
            />
          </form>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-300 outline-none focus:border-violet-500"
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
              className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-300 outline-none focus:border-violet-500"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <button
              onClick={() => {
                setSearch("");
                setRole("");
                setStatus("");
                setPage(1);
              }}
              className="rounded-xl border border-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-900"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="flex h-64 items-center justify-center text-slate-400">
            <RefreshCw size={24} className="animate-spin mr-2" />
            Fetching account data...
          </div>
        ) : users.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center text-slate-500">
            No accounts match the chosen search criteria.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/60 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      <th className="p-4">Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-sm">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-900/40 transition">
                        <td className="p-4 font-semibold text-white">{u.name}</td>
                        <td className="p-4 text-slate-400">{u.email}</td>
                        <td className="p-4">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              u.role === "admin"
                                ? "bg-violet-500/10 text-violet-400"
                                : u.role === "company"
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-cyan-500/10 text-cyan-400"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              u.status === "active" ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-800 text-slate-500"
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleToggleStatus(u.id, u.status)}
                            className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${
                              u.status === "active"
                                ? "border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white"
                                : "border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10"
                            }`}
                          >
                            {u.status === "active" ? <UserX size={12} /> : <UserCheck size={12} />}
                            {u.status === "active" ? "Block" : "Activate"}
                          </button>
                          <button
                            onClick={() => handleDelete(u.id)}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-500/20 px-2.5 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition"
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