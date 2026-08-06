import { Navigate, useLocation } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

type UserRole =
  | "student"
  | "employee"
  | "mentor"
  | "recruiter"
  | "company"
  | "university"
  | "admin";

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
  
  const location = useLocation();

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

  const isOnboardingPath = location.pathname === "/onboarding";
  const isComplete = user.onboarding_complete || localStorage.getItem("onboarding_complete") === "true";

  // If student is not onboarded and tries to access general student routes, gate them to onboarding
  if (user.role === "student" && !isComplete && !isOnboardingPath) {
    return <Navigate to="/onboarding" replace />;
  }

  // If student is onboarded and tries to revisit onboarding page, redirect to dashboard
  if (user.role === "student" && isComplete && isOnboardingPath) {
    return <Navigate to="/student/dashboard" replace />;
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

      case "employee":
        return (
          <Navigate
            to="/employee/dashboard"
            replace
          />
        );

      case "mentor":
        return (
          <Navigate
            to="/mentor/dashboard"
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

      case "recruiter":
        return (
          <Navigate
            to="/recruiter/dashboard"
            replace
          />
        );

      case "university":
        return (
          <Navigate
            to="/university/dashboard"
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