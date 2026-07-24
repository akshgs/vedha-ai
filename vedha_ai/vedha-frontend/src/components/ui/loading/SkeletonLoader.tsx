export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-slate-800" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/2 rounded bg-slate-800" />
          <div className="h-3 w-1/3 rounded bg-slate-800" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-slate-800" />
        <div className="h-3 w-5/6 rounded bg-slate-800" />
      </div>
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 animate-pulse">
      <div className="flex justify-between border-b border-slate-800 pb-4">
        <div className="h-4 w-1/4 rounded bg-slate-800" />
        <div className="h-4 w-1/6 rounded bg-slate-800" />
      </div>
      <div className="space-y-3 pt-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex justify-between items-center py-2">
            <div className="h-3 w-1/3 rounded bg-slate-800" />
            <div className="h-3 w-1/4 rounded bg-slate-800" />
            <div className="h-3 w-12 rounded bg-slate-800" />
          </div>
        ))}
      </div>
    </div>
  );
}
