// app/login/page.tsx — Premium Glassmorphic Login & Register
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, Button, Input, Select, Alert, App } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, User, Sparkles, Briefcase } from "lucide-react";

// Schemas for forms
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  goal: z.string().min(2, "Goal cannot be empty"),
  role: z.enum(["student", "company", "employee"]),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function LoginPage() {
  useEffect(() => {
    document.body.classList.remove("light-theme");
    document.body.classList.add("dark-theme");
    return () => {
      document.body.classList.remove("dark-theme");
    };
  }, []);

  const { message } = App.useApp();
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      goal: "ML Engineer",
      role: "student",
    },
  });

  const handleLoginSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setServerError("");
    try {
      const res = await authAPI.login(data);
      const { token, user } = res.data;
      setAuth(user, token);
      message.success("Logged in successfully!");

      if (user.role === "company") router.push("/company");
      else if (user.role === "employee") router.push("/employee");
      else router.push("/student");
    } catch (err: any) {
      setServerError(err.response?.data?.detail || "Invalid email or password!");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    setServerError("");
    try {
      const res = await authAPI.register(data);
      const { token, user } = res.data;
      setAuth(user, token);
      message.success("Registered account successfully!");

      if (user.role === "company") router.push("/company");
      else if (user.role === "employee") router.push("/employee");
      else router.push("/student");
    } catch (err: any) {
      setServerError(err.response?.data?.detail || "Email already exists or invalid details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-indigo-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10" />

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Branding header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
            <Sparkles className="text-indigo-400 w-8 h-8 animate-pulse" /> Vedha AI
          </h1>
          <p className="text-gray-400 mt-2 text-sm">Kerala's AI-Powered Career Ecosystem</p>
        </div>

        {/* Form Panel card */}
        <Card className="glass-panel border-white/10 shadow-2xl rounded-3xl overflow-hidden bg-white/5 backdrop-blur-md">
          {/* Custom Tabs */}
          <div className="flex bg-white/5 border border-white/5 rounded-2xl p-1.5 mb-6">
            <button
              onClick={() => {
                setIsLogin(true);
                setServerError("");
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                isLogin
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setServerError("");
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                !isLogin
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Register
            </button>
          </div>

          {/* Form switch with animation */}
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                onSubmit={loginForm.handleSubmit(handleLoginSubmit)}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <Controller
                    name="email"
                    control={loginForm.control}
                    render={({ field, fieldState }) => (
                      <>
                        <Input
                          {...field}
                          prefix={<Mail className="w-4 h-4 text-gray-400" />}
                          placeholder="Email Address"
                          size="large"
                          className="bg-white/5 border-white/10 hover:border-indigo-500 focus:border-indigo-500 text-white"
                        />
                        {fieldState.error && (
                          <p className="text-red-400 text-xs mt-1 ml-1">{fieldState.error.message}</p>
                        )}
                      </>
                    )}
                  />
                </div>

                <div className="space-y-1">
                  <Controller
                    name="password"
                    control={loginForm.control}
                    render={({ field, fieldState }) => (
                      <>
                        <Input.Password
                          {...field}
                          prefix={<Lock className="w-4 h-4 text-gray-400" />}
                          placeholder="Password"
                          size="large"
                          className="bg-white/5 border-white/10 hover:border-indigo-500 focus:border-indigo-500 text-white"
                        />
                        {fieldState.error && (
                          <p className="text-red-400 text-xs mt-1 ml-1">{fieldState.error.message}</p>
                        )}
                      </>
                    )}
                  />
                </div>

                {serverError && (
                  <Alert title={serverError} type="error" showIcon className="bg-red-500/10 border-red-500/20 text-red-200 text-xs rounded-xl" />
                )}

                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 border-none font-semibold rounded-xl h-11 shadow-lg shadow-indigo-600/30 cursor-pointer mt-2"
                >
                  Access Platform
                </Button>
              </motion.form>
            ) : (
              <motion.form
                key="register"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                onSubmit={registerForm.handleSubmit(handleRegisterSubmit)}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <Controller
                    name="name"
                    control={registerForm.control}
                    render={({ field, fieldState }) => (
                      <>
                        <Input
                          {...field}
                          prefix={<User className="w-4 h-4 text-gray-400" />}
                          placeholder="Full Name"
                          size="large"
                          className="bg-white/5 border-white/10 hover:border-indigo-500 focus:border-indigo-500 text-white"
                        />
                        {fieldState.error && (
                          <p className="text-red-400 text-xs mt-1 ml-1">{fieldState.error.message}</p>
                        )}
                      </>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Controller
                      name="role"
                      control={registerForm.control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          size="large"
                          className="w-full custom-select"
                          options={[
                            { value: "student", label: "Student" },
                            { value: "company", label: "Recruiter" },
                            { value: "employee", label: "Employee / Admin" },
                          ]}
                        />
                      )}
                    />
                  </div>

                  <div className="space-y-1">
                    <Controller
                      name="goal"
                      control={registerForm.control}
                      render={({ field, fieldState }) => (
                        <>
                          <Input
                            {...field}
                            prefix={<Briefcase className="w-4 h-4 text-gray-400" />}
                            placeholder="Career Goal"
                            size="large"
                            className="bg-white/5 border-white/10 text-white"
                          />
                          {fieldState.error && (
                            <p className="text-red-400 text-xs mt-1 ml-1">{fieldState.error.message}</p>
                          )}
                        </>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Controller
                    name="email"
                    control={registerForm.control}
                    render={({ field, fieldState }) => (
                      <>
                        <Input
                          {...field}
                          prefix={<Mail className="w-4 h-4 text-gray-400" />}
                          placeholder="Email Address"
                          size="large"
                          className="bg-white/5 border-white/10 text-white"
                        />
                        {fieldState.error && (
                          <p className="text-red-400 text-xs mt-1 ml-1">{fieldState.error.message}</p>
                        )}
                      </>
                    )}
                  />
                </div>

                <div className="space-y-1">
                  <Controller
                    name="password"
                    control={registerForm.control}
                    render={({ field, fieldState }) => (
                      <>
                        <Input.Password
                          {...field}
                          prefix={<Lock className="w-4 h-4 text-gray-400" />}
                          placeholder="Create Password (min 6 chars)"
                          size="large"
                          className="bg-white/5 border-white/10 text-white"
                        />
                        {fieldState.error && (
                          <p className="text-red-400 text-xs mt-1 ml-1">{fieldState.error.message}</p>
                        )}
                      </>
                    )}
                  />
                </div>

                {serverError && (
                  <Alert title={serverError} type="error" showIcon className="bg-red-500/10 border-red-500/20 text-red-200 text-xs rounded-xl" />
                )}

                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 border-none font-semibold rounded-xl h-11 shadow-lg shadow-indigo-600/30 cursor-pointer mt-2"
                >
                  Create Account
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </Card>

        {/* Footer info */}
        <p className="text-center text-gray-500 text-xs mt-6">
          Vedha AI Platform v3.0 • Developed for Kerala Technology Hubs
        </p>
      </motion.div>
    </div>
  );
}