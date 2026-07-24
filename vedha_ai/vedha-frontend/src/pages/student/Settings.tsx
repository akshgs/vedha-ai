import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Shield, Bell, Key, Save, RefreshCw } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import Button from "@/components/ui/button/Button";
import { toast } from "sonner";

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

export default function Settings() {
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
      // Mock API call since password change is not fully standard / exposed directly
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Password change requested:", data);
      toast.success("Password updated successfully!");
      reset();
    } catch {
      toast.error("Failed to update password.");
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
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Portal Settings</h1>
          <p className="mt-2 text-slate-400">
            Configure your notifications, security parameters, and profile visibility.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Notifications Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm">
            <div className="mb-6 flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                <Bell size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold">Notifications</h2>
                <p className="text-xs text-slate-400">Decide how we contact you</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Email Alerts</h3>
                  <p className="text-xs text-slate-400">Receive job updates & interview alerts</p>
                </div>
                <button
                  onClick={() => setEmailAlerts(!emailAlerts)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    emailAlerts ? "bg-cyan-500" : "bg-slate-700"
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
                  <p className="text-xs text-slate-400">Get instant mock interview reminders</p>
                </div>
                <button
                  onClick={() => setPushAlerts(!pushAlerts)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    pushAlerts ? "bg-cyan-500" : "bg-slate-700"
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
                  <h3 className="text-sm font-semibold text-white">Weekly Learning Digest</h3>
                  <p className="text-xs text-slate-400">Summary of skill gap suggestions</p>
                </div>
                <button
                  onClick={() => setWeeklyDigest(!weeklyDigest)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    weeklyDigest ? "bg-cyan-500" : "bg-slate-700"
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

            <div className="mt-8 flex justify-end">
              <Button
                onClick={handleSaveNotifications}
                disabled={updatingAlerts}
                className="flex items-center gap-2"
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
            <div className="mb-6 flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                <Key size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold">Change Password</h2>
                <p className="text-xs text-slate-400">Secure your portal account</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(handlePasswordChange)} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register("currentPassword")}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-violet-500"
                />
                {errors.currentPassword && (
                  <p className="mt-1 text-xs text-red-400">{errors.currentPassword.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register("newPassword")}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-violet-500"
                />
                {errors.newPassword && (
                  <p className="mt-1 text-xs text-red-400">{errors.newPassword.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-violet-500"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-400">{errors.confirmPassword.message}</p>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
                  {isSubmitting ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <Shield size={16} />
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
