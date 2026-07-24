import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UserPlus, GraduationCap, Building } from "lucide-react";
import { toast } from "sonner";

import Button from "@/components/ui/button/Button";
import { register as registerService } from "@/services/auth";
import { registerSchema, type RegisterFormData } from "@/schemas/auth";

export default function RegisterForm() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState<"student" | "company">("student");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "student",
    },
  });

  function selectRole(role: "student" | "company") {
    setSelectedRole(role);
    setValue("role", role);
  }

  async function onSubmit(data: RegisterFormData) {
    try {
      setError("");
      await registerService({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      });

      toast.success("Account created successfully! Please login.");
      navigate("/login", { replace: true });
    } catch (err: any) {
      console.error("REGISTRATION ERROR:", err);
      setError(
        err?.response?.data?.detail ??
          "Registration failed. Email might already exist."
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Role Selection Grid */}
      <div>
        <label className="mb-3 block text-sm font-semibold text-slate-300">
          I want to join as a:
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => selectRole("student")}
            className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition-all duration-300 ${
              selectedRole === "student"
                ? "border-cyan-500 bg-cyan-500/10 text-cyan-300"
                : "border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-white"
            }`}
          >
            <GraduationCap size={24} />
            <span className="text-xs font-bold">Student / Candidate</span>
          </button>

          <button
            type="button"
            onClick={() => selectRole("company")}
            className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition-all duration-300 ${
              selectedRole === "company"
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                : "border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-white"
            }`}
          >
            <Building size={24} />
            <span className="text-xs font-bold">Company / Recruiter</span>
          </button>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm text-slate-300">Full Name</label>
        <input
          type="text"
          placeholder="John Doe"
          {...register("name")}
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-500"
        />
        {errors.name && (
          <p className="mt-2 text-xs text-red-400">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm text-slate-300">Email Address</label>
        <input
          type="email"
          placeholder="you@example.com"
          {...register("email")}
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-500"
        />
        {errors.email && (
          <p className="mt-2 text-xs text-red-400">{errors.email.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-slate-300">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            {...register("password")}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-500"
          />
          {errors.password && (
            <p className="mt-2 text-xs text-red-400">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">Confirm Password</label>
          <input
            type="password"
            placeholder="••••••••"
            {...register("confirmPassword")}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-500"
          />
          {errors.confirmPassword && (
            <p className="mt-2 text-xs text-red-400">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
          {error}
        </div>
      )}

      <Button
        type="submit"
        className={`w-full ${selectedRole === "company" ? "bg-emerald-600 hover:bg-emerald-500" : ""}`}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Account...
          </>
        ) : (
          <>
            <UserPlus className="mr-2 h-4 w-4" />
            Sign Up
          </>
        )}
      </Button>

      <p className="text-center text-xs text-slate-400 mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-cyan-400 hover:underline">
          Sign In
        </Link>
      </p>
    </form>
  );
}