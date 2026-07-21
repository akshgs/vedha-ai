import { Navigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const { loading, isAuthenticated, user } = useAuth();

  console.log("========== ProtectedRoute ==========");
  console.log("loading =", loading);
  console.log("isAuthenticated =", isAuthenticated);
  console.log("user =", user);
  console.log("token =", localStorage.getItem("access_token"));
  console.log("====================================");

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading...
      </main>
    );
  }

  if (!isAuthenticated) {
    console.log("Redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  console.log("Access Granted");

  return <>{children}</>;
}