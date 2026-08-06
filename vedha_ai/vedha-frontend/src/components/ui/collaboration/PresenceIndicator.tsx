interface PresenceIndicatorProps {
  status: "online" | "offline" | "away";
  size?: "sm" | "md" | "lg";
}

export default function PresenceIndicator({ status, size = "md" }: PresenceIndicatorProps) {
  const sizeClasses = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-4 w-4",
  };

  const statusColors = {
    online: "bg-emerald-500 shadow-emerald-950/20",
    away: "bg-amber-500 shadow-amber-950/20",
    offline: "bg-slate-600",
  };

  return (
    <span
      className={`inline-block rounded-full border border-slate-950 shadow-sm ${sizeClasses[size]} ${statusColors[status]}`}
      title={`Status: ${status}`}
    />
  );
}
