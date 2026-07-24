import { useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building,
  Briefcase,
  Users,
  Calendar,
  BarChart3,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
} from "lucide-react";
import useAuth from "@/hooks/useAuth";

const companyMenu = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/company/dashboard",
  },
  {
    title: "Company Profile",
    icon: Building,
    path: "/company/profile",
  },
  {
    title: "Job Management",
    icon: Briefcase,
    path: "/company/jobs",
  },
  {
    title: "Applicants Tracker",
    icon: Users,
    path: "/company/applicants",
  },
  {
    title: "Interview Scheduler",
    icon: Calendar,
    path: "/company/interviews",
  },
  {
    title: "Hiring Analytics",
    icon: BarChart3,
    path: "/company/analytics",
  },
];

type Props = {
  children: React.ReactNode;
};

export default function CompanyLayout({ children }: Props) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-white font-sans">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 shrink-0 flex-col border-r border-slate-800 bg-slate-950/80 backdrop-blur-xl transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-slate-800 p-6">
          <div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              Vedha AI
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-500">
              Company Portal
            </p>
          </div>
          <button
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-900 hover:text-white lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* User Card */}
        <div className="border-b border-slate-800 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 font-bold text-white shadow-md shadow-emerald-500/20">
              {user?.name?.charAt(0).toUpperCase() ?? "C"}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-sm font-semibold text-white">
                {user?.name ?? "Company User"}
              </h2>
              <p className="truncate text-xs text-slate-400">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto p-4">
          {companyMenu.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={() =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-emerald-300 shadow-inner"
                      : "text-slate-400 border border-transparent hover:bg-slate-900/60 hover:text-white"
                  }`
                }
              >
                <Icon size={18} className={isActive ? "text-emerald-400" : "text-slate-400"} />
                <span>{item.title}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-slate-800 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl border border-transparent px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Navbar */}
        <header className="flex h-20 items-center justify-between border-b border-slate-800 bg-slate-950/40 px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-900 hover:text-white lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>

            {/* Breadcrumbs */}
            <div className="hidden items-center gap-2 text-sm text-slate-400 md:flex">
              <Link to="/company/dashboard" className="hover:text-white">
                Recruitment
              </Link>
              {pathnames.slice(1).map((value, index) => {
                const to = `/${pathnames.slice(0, index + 2).join("/")}`;
                const isLast = index === pathnames.length - 2;
                const formatted = value.charAt(0).toUpperCase() + value.slice(1);

                return (
                  <div key={to} className="flex items-center gap-2">
                    <span className="text-slate-600">/</span>
                    {isLast ? (
                      <span className="font-medium text-emerald-400">{formatted}</span>
                    ) : (
                      <Link to={to} className="hover:text-white">
                        {formatted}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden max-w-xs md:block">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search candidates/jobs..."
                className="w-64 rounded-xl border border-slate-800 bg-slate-900/60 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none transition focus:border-emerald-500"
              />
            </div>

            <button className="relative rounded-xl border border-slate-800 bg-slate-900/60 p-2.5 text-slate-400 transition hover:bg-slate-800 hover:text-white">
              <Bell size={18} />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-emerald-500" />
            </button>

            <Link
              to="/company/profile"
              className="flex items-center gap-2 border-l border-slate-800 pl-4"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 font-bold text-white">
                {user?.name?.charAt(0).toUpperCase() ?? "C"}
              </div>
            </Link>
          </div>
        </header>

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}

          <footer className="mt-16 border-t border-slate-900 py-6 text-center text-xs text-slate-500">
            Vedha AI © {new Date().getFullYear()} • Corporate Recruiting Console
          </footer>
        </main>
      </div>
    </div>
  );
}
