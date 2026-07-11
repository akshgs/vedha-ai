import LoginForm from "@/components/auth/LoginForm";

export default function Login() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-2xl font-bold text-white">
            V
          </div>

          <h1 className="mt-6 text-3xl font-bold text-white">
            Welcome Back
          </h1>

          <p className="mt-2 text-slate-400">
            Sign in to continue to Vedha AI
          </p>
        </div>

        <LoginForm />
      </div>
    </main>
  );
}