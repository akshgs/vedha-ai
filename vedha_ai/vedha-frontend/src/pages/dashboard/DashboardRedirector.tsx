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
    case "company":
      return <Navigate to="/company/dashboard" replace />;
    case "admin":
      return <Navigate to="/admin/dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
}
