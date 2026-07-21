import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LogIn } from "lucide-react";

import Button from "@/components/ui/button/Button";
import useAuth from "@/hooks/useAuth";

import {
  loginSchema,
  type LoginFormData,
} from "@/schemas/auth";

export default function LoginForm() {
  const navigate = useNavigate();

  const {
    login,
    isAuthenticated,
    loading,
  } = useAuth();

  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/dashboard", {
        replace: true,
      });
    }
  }, [
    loading,
    isAuthenticated,
    navigate,
  ]);

  async function onSubmit(
    data: LoginFormData
  ) {
    alert("Login button clicked");

    console.log("onSubmit Fired");
    console.log("Login Data:", data);

    try {
      setError("");

      console.log("Before login");

      await login(data);

      console.log("After login");

      console.log(
        "TOKEN:",
        localStorage.getItem("access_token")
      );

      navigate("/dashboard", {
        replace: true,
      });
    } catch (err: any) {
      console.error("LOGIN ERROR:", err);

      setError(
        err?.response?.data?.detail ??
          "Login failed. Please try again."
      );
    }
  }

  return (
    <form
      onSubmit={(e) => {
        console.log("FORM SUBMITTED");
        handleSubmit(onSubmit)(e);
      }}
      className="space-y-6"
    >
      <div>
        <label className="mb-2 block text-sm text-slate-300">
          Email
        </label>

        <input
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          {...register("email")}
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
        />

        {errors.email && (
          <p className="mt-2 text-sm text-red-400">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm text-slate-300">
          Password
        </label>

        <input
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          {...register("password")}
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
        />

        {errors.password && (
          <p className="mt-2 text-sm text-red-400">
            {errors.password.message}
          </p>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || loading}
      >
        {isSubmitting || loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing In...
          </>
        ) : (
          <>
            <LogIn className="mr-2 h-4 w-4" />
            Login
          </>
        )}
      </Button>
    </form>
  );
}