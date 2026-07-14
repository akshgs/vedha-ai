import {
  LayoutDashboard,
  FileText,
  GraduationCap,
  Briefcase,
  MessageSquare,
  Settings,
  LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

import useAuth from "@/hooks/useAuth";

const menu = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    title: "Resume AI",
    icon: FileText,
    path: "/resume",
  },
  {
    title: "Roadmaps",
    icon: GraduationCap,
    path: "/roadmap",
  },
  {
    title: "Interview AI",
    icon: MessageSquare,
    path: "/interview",
  },
  {
    title: "Jobs",
    icon: Briefcase,
    path: "/jobs",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

export default function Sidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <aside className="flex h-screen w-72 shrink-0 flex-col border-r border-slate-800 bg-slate-950">
      {/* Logo */}
      <div className="border-b border-slate-800 p-6">
        <h1 className="text-3xl font-black text-white">
          Vedha AI
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Career Intelligence Platform
        </p>
      </div>

      {/* User */}
      <div className="border-b border-slate-800 p-6">
        <h2 className="text-lg font-semibold text-white">
          {user?.name ?? "Student"}
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          {user?.email}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 overflow-y-auto p-4">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                  isActive
                    ? "bg-cyan-500 text-white shadow-lg"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }`
              }
            >
              <Icon size={20} />
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-slate-800 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-400 transition hover:bg-red-500/10"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}