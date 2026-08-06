import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/input/Input";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      // Mock reset request
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccess(true);
      toast.success("Password reset successfully!");
    } catch {
      toast.error("Failed to reset password. Link may have expired.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#0B1220] px-6 overflow-hidden">
      <div className="w-full max-w-md rounded-2xl border border-[#1F2937] bg-[#111827] p-8 shadow-2xl relative z-10">
        {!success ? (
          <>
            <div className="mb-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6]">
                <Lock size={24} />
              </div>

              <h1 className="mt-5 text-2xl font-bold text-white tracking-tight">
                Reset Password
              </h1>

              <p className="mt-2 text-xs text-[#94A3B8] leading-relaxed">
                Choose a strong new password to protect your account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                id="password"
                type="password"
                label="New Password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock size={14} />}
              />

              <Input
                id="confirmPassword"
                type="password"
                label="Confirm New Password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                icon={<Lock size={14} />}
              />

              <Button
                type="submit"
                className="w-full mt-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] mb-5">
              <CheckCircle2 size={24} />
            </div>

            <h1 className="text-xl font-bold text-white tracking-tight">
              Password Changed!
            </h1>

            <p className="mt-3 text-xs text-[#94A3B8] leading-relaxed">
              Your password has been successfully updated. You can now use your new password to sign in.
            </p>

            <div className="mt-6">
              <Button
                onClick={() => navigate("/login")}
                className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white"
              >
                Sign In Now
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
