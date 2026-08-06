import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import {
  Search,
  LayoutDashboard,
  FileText,
  GraduationCap,
  MessageSquare,
  Briefcase,
  Settings,
  User,
  Users,
  Compass,
  CornerDownLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CommandItem {
  id: string;
  title: string;
  subtitle: string;
  path: string;
  icon: any;
  category: "Navigation" | "AI Features" | "Resources";
}

const COMMANDS: CommandItem[] = [
  {
    id: "dash",
    title: "Go to Dashboard",
    subtitle: "Navigate to your primary career dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    category: "Navigation",
  },
  {
    id: "resume",
    title: "AI Resume Analyzer",
    subtitle: "Check ATS score and improve resume",
    path: "/student/resume",
    icon: FileText,
    category: "AI Features",
  },
  {
    id: "roadmap",
    title: "AI Learning Roadmaps",
    subtitle: "Explore interactive custom career paths",
    path: "/student/roadmap",
    icon: GraduationCap,
    category: "AI Features",
  },
  {
    id: "interview",
    title: "AI Mock Interviews",
    subtitle: "Start mock interview session and review logs",
    path: "/student/interview",
    icon: MessageSquare,
    category: "AI Features",
  },
  {
    id: "jobs",
    title: "Job Portal",
    subtitle: "Browse personalized recommendations and apply",
    path: "/student/jobs",
    icon: Briefcase,
    category: "Navigation",
  },
  {
    id: "feed",
    title: "Networking News Feed",
    subtitle: "Connect with peers, view posts, share ideas",
    path: "/student/networking",
    icon: Compass,
    category: "Resources",
  },
  {
    id: "mentors",
    title: "Find a Mentor",
    subtitle: "Book session slots and seek expert advice",
    path: "/student/mentorship",
    icon: Users,
    category: "Resources",
  },
  {
    id: "profile",
    title: "View Profile",
    subtitle: "Configure resume details, skills, certifications",
    path: "/student/profile",
    icon: User,
    category: "Navigation",
  },
  {
    id: "settings",
    title: "Account Settings",
    subtitle: "Manage billing, connections, security preferences",
    path: "/student/settings",
    icon: Settings,
    category: "Navigation",
  },
];

export default function CommandPalette() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  // Toggle Command Palette on Ctrl + K or Cmd + K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter commands
  const filtered = COMMANDS.filter((cmd) =>
    cmd.title.toLowerCase().includes(search.toLowerCase()) ||
    cmd.subtitle.toLowerCase().includes(search.toLowerCase()) ||
    cmd.category.toLowerCase().includes(search.toLowerCase())
  );

  // Keyboard navigation inside list
  useEffect(() => {
    if (!isOpen) return;

    function handleNav(e: KeyboardEvent) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filtered.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          triggerAction(filtered[selectedIndex].path);
        }
      }
    }

    window.addEventListener("keydown", handleNav);
    return () => window.removeEventListener("keydown", handleNav);
  }, [isOpen, selectedIndex, filtered]);

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  function triggerAction(path: string) {
    let targetPath = path;
    const role = user?.role || "student";
    if (path === "/student/profile") {
      targetPath = `/${role}/profile`;
    } else if (path === "/student/settings") {
      targetPath = `/${role}/settings`;
    }
    navigate(targetPath);
    setIsOpen(false);
    setSearch("");
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[15vh]">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Palette Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/95 shadow-2xl backdrop-blur-2xl"
          >
            {/* Search Input */}
            <div className="flex items-center border-b border-slate-900 px-5 py-4">
              <Search size={20} className="text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search menus, features, filters... (Esc to exit)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="ml-3 w-full bg-transparent text-sm text-white placeholder-slate-500 outline-none"
                autoFocus
              />
              <span className="rounded-lg border border-slate-800 bg-slate-900/60 px-2 py-1 text-[10px] font-bold text-slate-400">
                ESC
              </span>
            </div>

            {/* Content List */}
            <div className="max-h-[350px] overflow-y-auto p-4 space-y-4">
              {filtered.length === 0 ? (
                <div className="py-12 text-center text-slate-500">
                  No commands matching "{search}" found.
                </div>
              ) : (
                <div>
                  {/* Categorized List */}
                  {["Navigation", "AI Features", "Resources"].map((cat) => {
                    const items = filtered.filter((i) => i.category === cat);
                    if (items.length === 0) return null;

                    return (
                      <div key={cat} className="space-y-1">
                        <h4 className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          {cat}
                        </h4>

                        {items.map((cmd) => {
                          const globalIndex = filtered.indexOf(cmd);
                          const isSelected = globalIndex === selectedIndex;
                          const IconComponent = cmd.icon;

                          return (
                            <button
                              key={cmd.id}
                              onClick={() => triggerAction(cmd.path)}
                              className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition-all duration-200 ${
                                isSelected
                                  ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                                  : "border border-transparent text-slate-300 hover:bg-slate-900/40 hover:text-white"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`rounded-lg p-2 transition ${
                                    isSelected
                                      ? "bg-cyan-500/20 text-cyan-400"
                                      : "bg-slate-900 text-slate-400"
                                  }`}
                                >
                                  <IconComponent size={18} />
                                </div>

                                <div>
                                  <p className="text-sm font-semibold">
                                    {cmd.title}
                                  </p>
                                  <p className="text-xs text-slate-400">
                                    {cmd.subtitle}
                                  </p>
                                </div>
                              </div>

                              {isSelected && (
                                <span className="flex items-center gap-1 text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                                  <CornerDownLeft size={10} />
                                  Enter
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-slate-900 bg-slate-950/60 px-5 py-3 text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <span>
                  <kbd className="rounded bg-slate-900 px-1.5 py-0.5 border border-slate-800">↑↓</kbd> to navigate
                </span>
                <span>
                  <kbd className="rounded bg-slate-900 px-1.5 py-0.5 border border-slate-800">Enter</kbd> to select
                </span>
              </div>
              <div>
                <span>Press <kbd className="rounded bg-slate-900 px-1.5 py-0.5 border border-slate-800">Ctrl+K</kbd> to close</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
