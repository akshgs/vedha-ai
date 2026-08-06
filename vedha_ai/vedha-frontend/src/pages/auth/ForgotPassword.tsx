import { useState } from "react";
import { Link } from "react-router-dom";
import { KeyRound, Mail, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/input/Input";
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      // Mock reset request
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitted(true);
      toast.success("Reset link sent successfully!");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#0B1220] px-6 overflow-hidden">
      <div className="w-full max-w-md rounded-2xl border border-[#1F2937] bg-[#111827] p-8 shadow-2xl relative z-10">
        {!submitted ? (
          <>
            <div className="mb-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6]">
                <KeyRound size={24} />
              </div>

              <h1 className="mt-5 text-2xl font-bold text-white tracking-tight">
                Forgot Password
              </h1>

              <p className="mt-2 text-xs text-[#94A3B8] leading-relaxed">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                id="email"
                type="email"
                label="Email Address"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail size={14} />}
              />

              <Button
                type="submit"
                className="w-full mt-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Link...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#3B82F6] hover:underline"
                >
                  <ArrowLeft size={13} />
                  Back to Login
                </Link>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] mb-5">
              <Mail size={24} />
            </div>

            <h1 className="text-xl font-bold text-white tracking-tight">
              Check Your Inbox
            </h1>

            <p className="mt-3 text-xs text-[#94A3B8] leading-relaxed">
              We have sent a password reset link to <span className="font-semibold text-white">{email}</span>. Please click the link inside the email to choose a new password.
            </p>

            <div className="mt-6">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#3B82F6] hover:underline"
              >
                <ArrowLeft size={13} />
                Return to login
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
