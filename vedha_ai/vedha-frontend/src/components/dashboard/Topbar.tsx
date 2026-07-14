import { Bell, Search } from "lucide-react";
import useAuth from "@/hooks/useAuth";

export default function Topbar() {
  const { user } = useAuth();

  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-800 bg-slate-950 px-8">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Welcome back, {user?.name} 👋
        </h1>

        <p className="text-sm text-slate-400">
          Ready to continue your AI career journey?
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button className="rounded-xl bg-slate-900 p-3 transition hover:bg-slate-800">
          <Search size={20} />
        </button>

        <button className="rounded-xl bg-slate-900 p-3 transition hover:bg-slate-800">
          <Bell size={20} />
        </button>

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-white">
          {user?.name?.charAt(0).toUpperCase() ?? "U"}
        </div>
      </div>
    </header>
  );
}