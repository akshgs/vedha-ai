import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowRight, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import Button from "@/components/ui/button/Button";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [timer, setTimer] = useState(59);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Count down timer for Resend
  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  function handleChange(element: HTMLInputElement, index: number) {
    const value = element.value.replace(/[^0-9]/g, "");
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Focus next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, index: number) {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);

      // Focus previous input
      if (index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "").substring(0, 6);
    if (pastedData.length === 6) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      toast.error("Please enter all 6 digits of the verification code.");
      return;
    }

    setIsVerifying(true);
    try {
      // Mock verification success
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Email verified successfully!");
      navigate("/onboarding");
    } catch (err) {
      toast.error("Invalid verification code. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  }

  function handleResend() {
    setTimer(59);
    toast.success("Verification code resent to your email.");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#0B1220] px-6 overflow-hidden">
      <div className="w-full max-w-md rounded-2xl border border-[#1F2937] bg-[#111827] p-8 shadow-2xl relative z-10">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6]">
            <ShieldCheck size={28} />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-white tracking-tight">
            Verify Email
          </h1>

          <p className="mt-2 text-xs text-[#94A3B8] leading-relaxed">
            We sent a 6-digit verification code to your registered email address.
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-between gap-2">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                type="text"
                maxLength={1}
                value={digit}
                ref={(el) => { inputRefs.current[idx] = el; }}
                onChange={(e) => handleChange(e.target, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                onPaste={idx === 0 ? handlePaste : undefined}
                className="h-14 w-14 rounded-xl border border-[#1F2937] bg-[#0F172A] text-center text-lg font-bold text-white transition focus:border-[#3B82F6] focus:outline-none"
              />
            ))}
          </div>

          <Button
            type="submit"
            className="w-full mt-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white"
            disabled={isVerifying}
          >
            {isVerifying ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                Confirm Code
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          <div className="text-center text-xs text-[#94A3B8]">
            Didn't receive the code?{" "}
            {timer > 0 ? (
              <span className="font-semibold text-white">
                Resend in {timer}s
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="font-semibold text-[#3B82F6] hover:underline cursor-pointer"
              >
                Resend OTP
              </button>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
