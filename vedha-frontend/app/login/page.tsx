// app/login/page.tsx — Login & Register
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";

export default function LoginPage() {
  const router   = useRouter();
  const setAuth  = useAuthStore((s) => s.setAuth);
  const [isLogin, setIsLogin]   = useState(true);
  const [loading, setLoading]   = useState(false);
  const [error,   setError]     = useState("");
  const [form,    setForm]      = useState({
    name: "", email: "", password: "", goal: "ML Engineer", role: "student"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = isLogin
        ? await authAPI.login({ email: form.email, password: form.password })
        : await authAPI.register(form);

      const { token, user } = res.data;
      setAuth(user, token);

      // Redirect based on role
      if (user.role === "company")        router.push("/company");
      else if (user.role === "employee")  router.push("/employee");
      else                                router.push("/student");

    } catch (err: any) {
      setError(err.response?.data?.detail || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">⚡ Vedha AI</h1>
          <p className="text-blue-300">Kerala's AI Career Platform</p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
          {/* Tabs */}
          <div className="flex rounded-xl bg-white/10 p-1 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                isLogin ? "bg-white text-blue-900" : "text-white hover:text-blue-200"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                !isLogin ? "bg-white text-blue-900" : "text-white hover:text-blue-200"
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <input
                  type="text" placeholder="Full Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-300 focus:outline-none focus:border-blue-400"
                  required
                />
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-blue-400"
                >
                  <option value="student"  className="text-black">🎓 Student</option>
                  <option value="company"  className="text-black">🏢 Company</option>
                  <option value="employee" className="text-black">💼 Employee</option>
                </select>
                <input
                  type="text" placeholder="Goal (e.g. ML Engineer)"
                  value={form.goal}
                  onChange={(e) => setForm({ ...form, goal: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-300 focus:outline-none focus:border-blue-400"
                />
              </>
            )}

            <input
              type="email" placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-300 focus:outline-none focus:border-blue-400"
              required
            />
            <input
              type="password" placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-300 focus:outline-none focus:border-blue-400"
              required
            />

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 text-red-200 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full py-3 bg-blue-500 hover:bg-blue-400 disabled:bg-blue-800 text-white font-semibold rounded-xl transition-all"
            >
              {loading ? "Loading..." : isLogin ? "Login" : "Create Account"}
            </button>
          </form>
        </div>

        <p className="text-center text-blue-400 text-sm mt-4">
          Free & Open Source • Kerala IT Market
        </p>
      </div>
    </div>
  );
}