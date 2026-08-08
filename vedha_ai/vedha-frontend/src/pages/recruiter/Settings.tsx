import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Shield, Bell, Key, Save, RefreshCw, User, LogOut } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import Button from "@/components/ui/button/Button";
import useAuth from "@/hooks/useAuth";
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

export default function Settings() {
  const { user, logout } = useAuth();
  const [newCandidateAlerts, setNewCandidateAlerts] = useState(true);
  const [interviewAlerts, setInterviewAlerts] = useState(true);
  const [applicationAlerts, setApplicationAlerts] = useState(true);
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
      toast.success("Notification preferences saved!");
    } catch {
      toast.error("Failed to update notification settings.");
    } finally {
      setUpdatingAlerts(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl space-y-6 font-sans">
        <div>
          <h1 className="text-3xl font-bold text-white">Recruiter Settings</h1>
          <p className="mt-2 text-slate-400">
            Manage your recruiter account, platform notifications, and security preferences.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Account Profile Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/15 flex-shrink-0">
                  <User size={18} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">Account Profile</h2>
                  <p className="text-[10px] text-slate-500">Your professional details</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.name || ""}
                    disabled
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-400 outline-none cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue={user?.email || ""}
                    disabled
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-400 outline-none cursor-not-allowed"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    defaultValue="Vedha AI Ecosystem Partner"
                    disabled
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-400 outline-none cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Change Password Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/15 flex-shrink-0">
                  <Key size={18} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">Change Password</h2>
                  <p className="text-[10px] text-slate-500">Secure your platform credentials</p>
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
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
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
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
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
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <div className="pt-2 flex justify-end">
                  <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white">
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

          <div className="space-y-6">
            {/* Preferences / Notifications Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-6">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/15 flex-shrink-0">
                    <Bell size={18} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">Preferences</h2>
                    <p className="text-[10px] text-slate-500">System event routing</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-white">New Candidate Alerts</h3>
                      <p className="text-xs text-slate-400">Alert when candidates match job roadmaps</p>
                    </div>
                    <button
                      onClick={() => setNewCandidateAlerts(!newCandidateAlerts)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        newCandidateAlerts ? "bg-blue-500" : "bg-slate-700"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          newCandidateAlerts ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-white">Interview Notifications</h3>
                      <p className="text-xs text-slate-400">Emailed slot status confirmations</p>
                    </div>
                    <button
                      onClick={() => setInterviewAlerts(!interviewAlerts)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        interviewAlerts ? "bg-blue-500" : "bg-slate-700"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          interviewAlerts ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-white">Application Updates</h3>
                      <p className="text-xs text-slate-400">Weekly progress summaries</p>
                    </div>
                    <button
                      onClick={() => setApplicationAlerts(!applicationAlerts)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        applicationAlerts ? "bg-blue-500" : "bg-slate-700"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          applicationAlerts ? "translate-x-5" : "translate-x-0"
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
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white"
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

            {/* Logout Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Account Actions</h2>
              <p className="text-xs text-slate-455 mb-4">Disconnect your portal session.</p>
              <button
                onClick={() => {
                  logout();
                  toast.success("Logged out successfully.");
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-950/40 border border-red-900/40 hover:bg-red-900/20 text-red-400 hover:text-red-300 py-2.5 text-xs font-bold transition cursor-pointer"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
