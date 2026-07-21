import { useNavigate } from "react-router-dom";
import {
  FileText,
  GraduationCap,
  MessageSquare,
  Briefcase,
} from "lucide-react";

const actions = [
  {
    title: "Upload Resume",
    icon: FileText,
    path: "/resume",
    color: "bg-cyan-600",
  },
  {
    title: "Generate Roadmap",
    icon: GraduationCap,
    path: "/roadmap",
    color: "bg-violet-600",
  },
  {
    title: "Start Interview",
    icon: MessageSquare,
    path: "/interview",
    color: "bg-emerald-600",
  },
  {
    title: "Find Jobs",
    icon: Briefcase,
    path: "/jobs",
    color: "bg-amber-600",
  },
];

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {actions.map((action) => {
        const Icon = action.icon;

        return (
          <button
            key={action.title}
            onClick={() => navigate(action.path)}
            className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500 hover:bg-slate-800"
          >
            <div
              className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${action.color}`}
            >
              <Icon size={22} className="text-white" />
            </div>

            <h3 className="text-lg font-semibold text-white">
              {action.title}
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Open module
            </p>
          </button>
        );
      })}
    </div>
  );
}