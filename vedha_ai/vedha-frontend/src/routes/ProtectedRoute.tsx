import { Navigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

type UserRole = "student" | "company" | "admin";

type Props = {
  children: React.ReactNode;
  role?: UserRole;
};

export default function ProtectedRoute({
  children,
  role,
}: Props) {
  const {
    loading,
    isAuthenticated,
    user,
  } = useAuth();

  // Loading State
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading...
      </main>
    );
  }

  // Not Logged In
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Role Authorization
  if (role && user.role !== role) {
    switch (user.role) {
      case "student":
        return (
          <Navigate
            to="/student/dashboard"
            replace
          />
        );

      case "company":
        return (
          <Navigate
            to="/company/dashboard"
            replace
          />
        );

      case "admin":
        return (
          <Navigate
            to="/admin/dashboard"
            replace
          />
        );

      default:
        return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
}