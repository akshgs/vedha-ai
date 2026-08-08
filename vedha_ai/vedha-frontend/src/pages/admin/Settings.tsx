import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Shield, Bell, Key, Save, RefreshCw } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import Button from "@/components/ui/button/Button";
import { toast } from "sonner";
import { api } from "@/services/api";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Password confirmation is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function AdminSettings() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [updatingAlerts, setUpdatingAlerts] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  async function handlePasswordChange(data: PasswordFormData) {
    try {
      await api.put("/auth/password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success("Password updated successfully!");
      reset();
    } catch (err: any) {
      const msg = err?.response?.data?.detail ?? "Failed to update password.";
      toast.error(msg);
    }
  }

  async function handleSaveNotifications() {
    setUpdatingAlerts(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success("Notification settings saved!");
    } catch {
      toast.error("Failed to update notification settings.");
    } finally {
      setUpdatingAlerts(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl space-y-6 font-sans">
        <div>
          <h1 className="text-3xl font-bold">Portal Settings</h1>
          <p className="mt-2 text-slate-400">
            Configure system administration dashboard settings and update key credentials.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Notifications Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/15 flex-shrink-0">
                  <Bell size={18} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">Console Alerts</h2>
                  <p className="text-[10px] text-slate-500">Decide how we contact you</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Email Alerts</h3>
                    <p className="text-xs text-slate-400">Receive system audit alerts & user reports</p>
                  </div>
                  <button
                    onClick={() => setEmailAlerts(!emailAlerts)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      emailAlerts ? "bg-rose-500" : "bg-slate-700"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        emailAlerts ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Push Notifications</h3>
                    <p className="text-xs text-slate-400">Get instant recruiter registration queue alerts</p>
                  </div>
                  <button
                    onClick={() => setPushAlerts(!pushAlerts)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      pushAlerts ? "bg-rose-500" : "bg-slate-700"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        pushAlerts ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Weekly System Health Summary</h3>
                    <p className="text-xs text-slate-400">Statistical summaries of system indicators</p>
                  </div>
                  <button
                    onClick={() => setWeeklyDigest(!weeklyDigest)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      weeklyDigest ? "bg-rose-500" : "bg-slate-700"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        weeklyDigest ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Button
                onClick={handleSaveNotifications}
                disabled={updatingAlerts}
                className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500"
              >
                {updatingAlerts ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                Save Preferences
              </Button>
            </div>
          </div>

          {/* Change Password Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/15 flex-shrink-0">
                <Key size={18} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Change Password</h2>
                <p className="text-[10px] text-slate-500">Secure your admin account</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(handlePasswordChange)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register("currentPassword")}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-white outline-none focus:border-rose-500"
                />
                {errors.currentPassword && (
                  <p className="text-red-400 text-xs mt-1">{errors.currentPassword.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register("newPassword")}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-white outline-none focus:border-rose-500"
                />
                {errors.newPassword && (
                  <p className="text-red-400 text-xs mt-1">{errors.newPassword.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-white outline-none focus:border-rose-500"
                />
                {errors.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500">
                  {isSubmitting ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : (
                    <Shield size={14} />
                  )}
                  Update Password
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
