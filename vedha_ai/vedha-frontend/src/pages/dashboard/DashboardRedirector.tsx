import { Navigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

export default function DashboardRedirector() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white font-semibold">
        Loading redirection...
      </main>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case "student":
      return <Navigate to="/student/dashboard" replace />;
    case "employee":
      return <Navigate to="/employee/dashboard" replace />;
    case "mentor":
      return <Navigate to="/mentor/dashboard" replace />;
    case "company":
    case "recruiter":
      return <Navigate to="/company/dashboard" replace />;
    case "university":
      return <Navigate to="/university/dashboard" replace />;
    case "admin":
      return <Navigate to="/admin/dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
}
