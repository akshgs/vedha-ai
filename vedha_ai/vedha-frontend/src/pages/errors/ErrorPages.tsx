import { Link } from "react-router-dom";
import { AlertTriangle, ShieldAlert, Ghost, ArrowLeft } from "lucide-react";

export function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center text-white font-sans">
      <div className="max-w-md space-y-6">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-slate-900 border border-slate-800 text-cyan-400">
          <Ghost size={48} className="animate-bounce" />
        </div>
        <div className="space-y-2">
          <h1 className="text-6xl font-black text-slate-700">404</h1>
          <h2 className="text-2xl font-bold">Page Not Found</h2>
          <p className="text-slate-400 text-sm">
            We can't find the page you're looking for. It might have been moved or deleted.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold hover:bg-cyan-500 transition shadow-lg shadow-cyan-500/20"
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center text-white font-sans">
      <div className="max-w-md space-y-6">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-slate-900 border border-slate-800 text-red-400">
          <ShieldAlert size={48} />
        </div>
        <div className="space-y-2">
          <h1 className="text-6xl font-black text-slate-700">403</h1>
          <h2 className="text-2xl font-bold">Access Denied</h2>
          <p className="text-slate-400 text-sm">
            You do not have administrative permissions to view this resource. Contact platform owner if this is a mistake.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold hover:bg-red-500 transition"
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center text-white font-sans">
      <div className="max-w-md space-y-6">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-slate-900 border border-slate-800 text-amber-400">
          <AlertTriangle size={48} className="animate-pulse" />
        </div>
        <div className="space-y-2">
          <h1 className="text-6xl font-black text-slate-700">500</h1>
          <h2 className="text-2xl font-bold">Internal Server Error</h2>
          <p className="text-slate-400 text-sm">
            The platform server encountered an unexpected situation. Please try refreshing after some time.
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-3 text-sm font-semibold hover:bg-amber-500 transition"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}
