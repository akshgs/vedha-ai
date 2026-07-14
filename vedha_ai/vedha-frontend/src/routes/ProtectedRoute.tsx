import { Navigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const {
    loading,
    isAuthenticated,
    user,
  } = useAuth();

  console.log({
    loading,
    isAuthenticated,
    user,
    token: localStorage.getItem("access_token"),
  });

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading...
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}