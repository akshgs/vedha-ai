import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import Button from "@/components/ui/button/Button";
import { register as registerService } from "@/services/auth";
import { registerSchema, type RegisterFormData } from "@/schemas/auth";

export default function RegisterForm() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("student");
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "student",
      password: "",
    },
  });

  const passwordValue = watch("password") || "";

  function getPasswordStrength(pass: string) {
    if (!pass) return { score: 0, label: "", color: "bg-slate-200", text: "text-slate-400" };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    
    if (score <= 1) return { score: 1, label: "Weak", color: "bg-red-500", text: "text-red-500" };
    if (score === 2) return { score: 2, label: "Medium", color: "bg-yellow-500", text: "text-yellow-600" };
    if (score === 3) return { score: 3, label: "Strong", color: "bg-blue-500", text: "text-blue-600" };
    return { score: 4, label: "Very Strong", color: "bg-green-600", text: "text-green-600" };
  }

  const strength = getPasswordStrength(passwordValue);

  function handleKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.getModifierState) {
      setCapsLockActive(e.getModifierState("CapsLock"));
    }
  }

  function selectRole(
    role: RegisterFormData["role"]
  ) {
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

      toast.success("Account created! Verify your email to complete registration.");
      
      // Store registering user info for onboarding
      localStorage.setItem("user_email", data.email);
      localStorage.setItem("user_role", data.role);
      localStorage.setItem("user_name", data.name);
      
      navigate("/verify-otp", { replace: true });
    } catch (err: unknown) {
      console.error("REGISTRATION ERROR:", err);
      let errorMsg = "Registration failed. Email might already exist.";
      if (err && typeof err === "object" && "response" in err) {
        const response = (err as { response?: { data?: { detail?: string } } }).response;
        if (response?.data?.detail) {
          errorMsg = response.data.detail;
        }
      }
      setError(errorMsg);
    }
  }

  async function handleOAuth(provider: "google" | "github") {
    setOauthLoading(provider);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      
      localStorage.setItem("access_token", "mock-oauth-token");
      localStorage.setItem("user_email", `oauth.${provider}@example.com`);
      localStorage.setItem("user_role", selectedRole);
      localStorage.setItem("user_name", `${provider === "google" ? "Google" : "GitHub"} User`);

      toast.success(`Registered successfully via ${provider === "google" ? "Google" : "GitHub"}!`);
      navigate("/onboarding");
    } catch {
      toast.error(`OAuth registration failed.`);
    } finally {
      setOauthLoading(null);
    }
  }

  return (
    <div className="space-y-5">
      {/* OAuth Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handleOAuth("google")}
          disabled={!!oauthLoading || isSubmitting}
          className="flex items-center justify-center gap-2 rounded-lg border border-[#1F2937] bg-[#0F172A] py-2 px-3 text-xs font-semibold text-white transition duration-150 hover:bg-[#1F2937] disabled:opacity-50 cursor-pointer shadow-xs"
        >
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#ea4335"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#4285f4"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#fbbc05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#34a853"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Google
        </button>

        <button
          onClick={() => handleOAuth("github")}
          disabled={!!oauthLoading || isSubmitting}
          className="flex items-center justify-center gap-2 rounded-lg border border-[#1F2937] bg-[#0F172A] py-2 px-3 text-xs font-semibold text-white transition duration-150 hover:bg-[#1F2937] disabled:opacity-50 cursor-pointer shadow-xs"
        >
          <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
            />
          </svg>
          GitHub
        </button>
      </div>

      <div className="flex items-center justify-between py-2">
        <span className="h-px w-full bg-[#1F2937]" />
        <span className="px-3 text-xs uppercase tracking-wider text-[#94A3B8]">or</span>
        <span className="h-px w-full bg-[#1F2937]" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Role Selection Cards */}
        <div className="ve-form-group">
          <label className="ve-label mb-2 block">
            Register Account As
          </label>
          <div className="grid grid-cols-1 gap-3">
            <button
              type="button"
              onClick={() => selectRole("student")}
              className={`flex flex-col text-left p-3.5 rounded-xl border transition cursor-pointer ${
                selectedRole === "student"
                  ? "bg-[#3B82F6]/10 border-[#3B82F6] text-white"
                  : "bg-[#0F172A] border-[#1F2937] hover:border-slate-700 text-[#94A3B8]"
              }`}
            >
              <span className="text-xs font-bold text-white">Student / Job Candidate</span>
              <span className="text-[10px] text-slate-400 mt-1 leading-relaxed">Build your roadmap, verify technical skills, and apply to job opportunities.</span>
            </button>

            <button
              type="button"
              onClick={() => selectRole("employee")}
              className={`flex flex-col text-left p-3.5 rounded-xl border transition cursor-pointer ${
                selectedRole === "employee"
                  ? "bg-[#3B82F6]/10 border-[#3B82F6] text-white"
                  : "bg-[#0F172A] border-[#1F2937] hover:border-slate-700 text-[#94A3B8]"
              }`}
            >
              <span className="text-xs font-bold text-white">Employee / Professional</span>
              <span className="text-[10px] text-slate-400 mt-1 leading-relaxed">Review candidate resumes, mentor students, and share industry insights.</span>
            </button>

            <button
              type="button"
              onClick={() => selectRole("company")}
              className={`flex flex-col text-left p-3.5 rounded-xl border transition cursor-pointer ${
                selectedRole === "company"
                  ? "bg-[#3B82F6]/10 border-[#3B82F6] text-white"
                  : "bg-[#0F172A] border-[#1F2937] hover:border-slate-700 text-[#94A3B8]"
              }`}
            >
              <span className="text-xs font-bold text-white">Company / Recruiter</span>
              <span className="text-[10px] text-slate-400 mt-1 leading-relaxed">Create job postings, search candidates, and run AI similarity ranking.</span>
            </button>
          </div>
        </div>

        <div className="ve-form-group">
          <label className="ve-label">Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            {...register("name")}
            className={`ve-input ${errors.name ? "ve-input-error" : ""}`}
          />
          {errors.name && (
            <p className="ve-error">{errors.name.message}</p>
          )}
        </div>

        <div className="ve-form-group">
          <label className="ve-label">Email Address</label>
          <input
            type="email"
            placeholder="you@example.com"
            {...register("email")}
            className={`ve-input ${errors.email ? "ve-input-error" : ""}`}
          />
          {errors.email && (
            <p className="ve-error">{errors.email.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="ve-form-group">
            <label className="ve-label">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
                onKeyUp={handleKeyUp}
                className={`ve-input pr-10 ${errors.password ? "ve-input-error" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {passwordValue && (
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                  <span>Strength</span>
                  <span className={strength.text}>
                    {strength.label}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-[#1F2937] rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${strength.color}`}
                    style={{ width: `${(strength.score / 4) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {errors.password && (
              <p className="ve-error">{errors.password.message}</p>
            )}
          </div>

          <div className="ve-form-group">
            <label className="ve-label">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("confirmPassword")}
                onKeyUp={handleKeyUp}
                className={`ve-input pr-10 ${errors.confirmPassword ? "ve-input-error" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-white transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="ve-error">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        {capsLockActive && (
          <p className="flex items-center gap-1.5 text-xs text-[#F59E0B] font-semibold animate-fade-in">
            <AlertTriangle size={14} />
            Caps Lock is on
          </p>
        )}

        {error && (
          <div className="rounded-lg border border-[#EF4444]/30 bg-[#EF4444]/10 p-3 text-xs text-[#EF4444] font-medium">
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white mt-2"
          disabled={isSubmitting}
          loading={isSubmitting}
        >
          Sign Up
        </Button>

        <p className="text-center text-xs text-[#94A3B8] mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-[#3B82F6] hover:underline font-semibold">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}