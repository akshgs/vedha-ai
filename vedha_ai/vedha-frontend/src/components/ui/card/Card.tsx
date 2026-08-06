import type { HTMLAttributes, ReactNode } from "react";

type CardVariant = "default" | "muted" | "interactive" | "glass";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: CardVariant;
  padding?: "none" | "sm" | "md" | "lg";
}

export default function Card({
  children,
  variant = "default",
  padding = "md",
  className = "",
  ...props
}: CardProps) {
  const base = "rounded-xl border transition-all duration-150 overflow-hidden";

  const variants: Record<CardVariant, string> = {
    default:
      "bg-[#111827] border-[#1F2937] text-white shadow-sm",
    muted:
      "bg-[#0F172A]/40 border-[#1F2937] text-slate-300",
    interactive:
      "bg-[#111827] border-[#1F2937] text-white shadow-sm hover:border-[#374151] hover:shadow-md cursor-pointer",
    glass:
      "bg-[#111827] border-[#1F2937] text-white shadow-sm",
  };

  const paddings: Record<"none" | "sm" | "md" | "lg", string> = {
    none: "",
    sm:   "p-4",
    md:   "p-6", // 24px
    lg:   "p-8",
  };

  return (
    <div
      className={`${base} ${variants[variant]} ${paddings[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

/* ── Sub-components ──────────────────────────────────────────── */

interface CardSectionProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className = "" }: CardSectionProps) {
  return (
    <div className={`flex items-center justify-between gap-3 pb-4 mb-4 border-b border-[#1F2937] ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "" }: CardSectionProps) {
  return (
    <h3 className={`text-[20px] font-medium text-white leading-tight ${className}`}>
      {children}
    </h3>
  );
}

export function CardBody({ children, className = "" }: CardSectionProps) {
  return (
    <div className={`${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = "" }: CardSectionProps) {
  return (
    <div className={`pt-4 mt-4 border-t border-[#1F2937] ${className}`}>
      {children}
    </div>
  );
}
