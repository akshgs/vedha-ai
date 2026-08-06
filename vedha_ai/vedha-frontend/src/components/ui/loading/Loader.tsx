import { Loader2 } from "lucide-react";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

export default function Loader({
  size = "md",
  className = "",
  label,
}: LoaderProps) {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Loader2 className={`animate-spin text-cyan-400 ${sizes[size]}`} />
      {label && <p className="text-sm font-medium text-slate-400">{label}</p>}
    </div>
  );
}
