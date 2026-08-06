import { Link } from "react-router-dom";
import { AlertTriangle, ShieldAlert, Ghost, ArrowLeft } from "lucide-react";

export function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B1220] px-6 text-center text-white font-sans">
      <div className="max-w-md space-y-6">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-[#111827] border border-[#1F2937] text-[#3B82F6]">
          <Ghost size={48} className="animate-bounce" />
        </div>
        <div className="space-y-2">
          <h1 className="text-6xl font-black text-[#1F2937]">404</h1>
          <h2 className="text-2xl font-bold text-white">Page Not Found</h2>
          <p className="text-[#94A3B8] text-sm">
            We can't find the page you're looking for. It might have been moved or deleted.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl bg-[#3B82F6] px-5 py-3 text-sm font-semibold hover:bg-[#2563EB] text-white transition shadow-lg"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export function Forbidden() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B1220] px-6 text-center text-white font-sans">
      <div className="max-w-md space-y-6">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-[#111827] border border-[#1F2937] text-[#EF4444]">
          <ShieldAlert size={48} />
        </div>
        <div className="space-y-2">
          <h1 className="text-6xl font-black text-[#1F2937]">403</h1>
          <h2 className="text-2xl font-bold text-white">Access Denied</h2>
          <p className="text-[#94A3B8] text-sm">
            You do not have administrative permissions to view this resource. Contact platform owner if this is a mistake.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl bg-[#EF4444] px-5 py-3 text-sm font-semibold hover:bg-[#DC2626] text-white transition"
        >
          <ArrowLeft size={16} />
          Go back home
        </Link>
      </div>
    </div>
  );
}

export function ServerError() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B1220] px-6 text-center text-white font-sans">
      <div className="max-w-md space-y-6">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-[#111827] border border-[#1F2937] text-[#F59E0B]">
          <AlertTriangle size={48} className="animate-pulse" />
        </div>
        <div className="space-y-2">
          <h1 className="text-6xl font-black text-[#1F2937]">500</h1>
          <h2 className="text-2xl font-bold text-white">Internal Server Error</h2>
          <p className="text-[#94A3B8] text-sm">
            The platform server encountered an unexpected situation. Please try refreshing after some time.
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 rounded-xl bg-[#F59E0B] px-5 py-3 text-sm font-semibold hover:bg-[#D97706] text-white transition"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}
