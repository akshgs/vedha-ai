import { useNavigate } from "react-router-dom";
import {
  FileText,
  GraduationCap,
  MessageSquare,
  Briefcase,
} from "lucide-react";

const actions = [
  {
    title: "Resume Intelligence",
    description: "Analyze and optimize your ATS score.",
    icon: FileText,
    path: "/student/resume",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    title: "Learning Roadmap",
    description: "View and progress on your career path.",
    icon: GraduationCap,
    path: "/student/roadmap",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    title: "Interview Preparation",
    description: "Practice mock sessions with AI feedback.",
    icon: MessageSquare,
    path: "/student/interview",
    bgColor: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    title: "Job Opportunities",
    description: "Explore matched ecosystem job openings.",
    icon: Briefcase,
    path: "/recruitment/jobs",
    bgColor: "bg-amber-50",
    iconColor: "text-amber-600",
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
            className="group text-left ve-card ve-card-interactive"
            style={{ padding: 18, border: "1px solid #e2e8f0" }}
          >
            <div
              className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${action.bgColor} ${action.iconColor} transition-colors group-hover:bg-opacity-80`}
            >
              <Icon size={18} />
            </div>

            <h3 style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>
              {action.title}
            </h3>

            <p style={{ marginTop: 4, fontSize: 11, color: '#64748b', lineHeight: 1.4 }}>
              {action.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}