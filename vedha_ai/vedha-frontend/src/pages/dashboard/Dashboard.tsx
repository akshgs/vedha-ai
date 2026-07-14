import useAuth from "@/hooks/useAuth";
import Button from "@/components/ui/button/Button";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <main className="min-h-screen bg-slate-950 p-10 text-white">
      <h1 className="text-4xl font-bold">
        Welcome {user?.name}
      </h1>

      <p className="mt-2 text-slate-400">
        {user?.email}
      </p>

      <p className="mt-2 text-cyan-400">
        {user?.role}
      </p>

      <Button
        className="mt-8"
        onClick={logout}
      >
        Logout
      </Button>
    </main>
  );
}