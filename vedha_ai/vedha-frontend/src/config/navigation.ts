import {
  LayoutDashboard,
  FileText,
  GraduationCap,
  MessageSquare,
  Briefcase,
  User,
  Settings,
  Users,
  Compass,
  Calendar,
  DollarSign,
  Star,
  Building,
  BarChart,
  ShieldAlert,
  ClipboardList,
  Code,
  Sparkles,
  BookOpen,
  Trophy,
} from "lucide-react";

export interface MenuItem {
  title: string;
  path: string;
  icon: any;
}

export interface PortalConfig {
  portalName: string;
  gradientFrom: string;
  gradientTo: string;
  menuItems: MenuItem[];
}

export const PORTAL_CONFIGS: Record<string, PortalConfig> = {
  student: {
    portalName: "Student Portal",
    gradientFrom: "from-cyan-400",
    gradientTo: "to-blue-500",
    menuItems: [
      { title: "Dashboard", path: "/student/dashboard", icon: LayoutDashboard },
      { title: "Learning Academy", path: "/student/learning", icon: BookOpen },
      { title: "Collaboration Feed", path: "/collaboration/feed", icon: Compass },
      { title: "Industry Mentoring", path: "/collaboration/mentors", icon: Users },
      { title: "Direct Messages", path: "/collaboration/messages", icon: MessageSquare },
      { title: "Resume AI", path: "/student/resume", icon: FileText },
      { title: "Skills & Assessment", path: "/student/skills", icon: Star },
      { title: "LeetCode Sandbox", path: "/coding/problems", icon: Code },
      { title: "Contest Arena", path: "/coding/contests", icon: Trophy },
      { title: "Roadmaps", path: "/student/roadmap", icon: GraduationCap },
      { title: "Career Intelligence", path: "/student/career", icon: Sparkles },
      { title: "AI Research Assistant", path: "/student/ai/research", icon: Compass },
      { title: "AI PDF Chat", path: "/student/ai/pdf-chat", icon: FileText },
      { title: "Interview AI", path: "/student/interview", icon: MessageSquare },
      { title: "Job Marketplace", path: "/recruitment/jobs", icon: Briefcase },
      { title: "Sent Applications", path: "/recruitment/applications", icon: ClipboardList },
      { title: "Interview Scheduler", path: "/recruitment/interviews", icon: Calendar },
      { title: "Student Analytics", path: "/student/analytics", icon: BarChart },
      { title: "Profile Settings", path: "/student/profile", icon: User },
      { title: "Settings", path: "/student/settings", icon: Settings },
    ],
  },
  employee: {
    portalName: "Employee Portal",
    gradientFrom: "from-violet-400",
    gradientTo: "to-fuchsia-500",
    menuItems: [
      { title: "Dashboard", path: "/employee/dashboard", icon: LayoutDashboard },
      { title: "Technical Blogs", path: "/employee/blogs", icon: BookOpen },
      { title: "Resume Reviews", path: "/employee/resumes", icon: ClipboardList },
      { title: "Industry Mentoring", path: "/collaboration/mentors", icon: Users },
      { title: "Direct Messages", path: "/collaboration/messages", icon: MessageSquare },
      { title: "Communities Feed", path: "/collaboration/feed", icon: Compass },
      { title: "Employee Analytics", path: "/employee/analytics", icon: BarChart },
      { title: "Profile", path: "/employee/profile", icon: User },
      { title: "Settings", path: "/employee/settings", icon: Settings },
    ],
  },
  mentor: {
    portalName: "Mentor Portal",
    gradientFrom: "from-emerald-400",
    gradientTo: "to-teal-500",
    menuItems: [
      { title: "Dashboard", path: "/mentor/dashboard", icon: LayoutDashboard },
      { title: "Calendar & Bookings", path: "/mentor/calendar", icon: Calendar },
      { title: "Session Logs", path: "/mentor/sessions", icon: ClipboardList },
      { title: "Student Reviews", path: "/mentor/reviews", icon: Star },
      { title: "Earnings Tracker", path: "/mentor/earnings", icon: DollarSign },
      { title: "Settings", path: "/mentor/settings", icon: Settings },
    ],
  },
  recruiter: {
    portalName: "Recruiter Portal",
    gradientFrom: "from-blue-400",
    gradientTo: "to-indigo-500",
    menuItems: [
      { title: "Dashboard", path: "/recruiter/dashboard", icon: LayoutDashboard },
      { title: "Candidate Search", path: "/recruiter/search", icon: Users },
      { title: "AI Candidate Ranking", path: "/recruiter/ranking", icon: Sparkles },
      { title: "Shortlisting Manager", path: "/recruiter/shortlist", icon: Star },
      { title: "Interviews Scheduler", path: "/recruiter/scheduling", icon: Calendar },
      { title: "Hiring Pipeline", path: "/recruiter/pipeline", icon: ClipboardList },
      { title: "Recruitment Analytics", path: "/recruiter/analytics", icon: BarChart },
      { title: "Settings", path: "/recruiter/settings", icon: Settings },
    ],
  },
  company: {
    portalName: "Company Portal",
    gradientFrom: "from-blue-500",
    gradientTo: "to-indigo-600",
    menuItems: [
      { title: "Dashboard", path: "/company/dashboard", icon: LayoutDashboard },
      { title: "Manage Jobs", path: "/company/jobs", icon: Briefcase },
      { title: "Internships", path: "/company/internships", icon: GraduationCap },
      { title: "Industry Insights", path: "/company/insights", icon: Sparkles },
      { title: "Employee Management", path: "/company/employees", icon: Users },
      { title: "Reports Dashboard", path: "/company/reports", icon: ClipboardList },
      { title: "Corporate Analytics", path: "/company/analytics", icon: BarChart },
      { title: "Company Profile", path: "/company/profile", icon: Building },
      { title: "Settings", path: "/company/settings", icon: Settings },
    ],
  },
  university: {
    portalName: "University Portal",
    gradientFrom: "from-amber-400",
    gradientTo: "to-orange-500",
    menuItems: [
      { title: "Dashboard", path: "/university/dashboard", icon: LayoutDashboard },
      { title: "Students Database", path: "/university/students", icon: Users },
      { title: "Placement Cell", path: "/university/placements", icon: Briefcase },
      { title: "Performance Charts", path: "/university/analytics", icon: BarChart },
      { title: "Settings", path: "/university/settings", icon: Settings },
    ],
  },
  admin: {
    portalName: "Admin Console",
    gradientFrom: "from-rose-500",
    gradientTo: "to-red-600",
    menuItems: [
      { title: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
      { title: "User Database", path: "/admin/users", icon: Users },
      { title: "Company Registries", path: "/admin/companies", icon: Building },
      { title: "Company Approvals", path: "/admin/approvals", icon: ShieldAlert },
      { title: "System Analytics", path: "/admin/analytics", icon: BarChart },
      { title: "Admin Profile", path: "/admin/profile", icon: User },
      { title: "Console Settings", path: "/admin/settings", icon: Settings },
    ],
  },
};
