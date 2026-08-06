import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold select-none whitespace-nowrap transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:opacity-40 disabled:pointer-events-none";

  const sizes: Record<Size, string> = {
    sm: "h-[36px] px-4 py-2 text-xs rounded-lg font-medium",
    md: "h-[48px] px-5 py-3.5 text-sm rounded-lg font-semibold", // 14px top/bottom, 20px left/right
    lg: "h-[54px] px-6 py-4 text-base rounded-lg font-semibold",
  };

  const variants: Record<Variant, string> = {
    primary:
      "bg-[#3B82F6] text-white hover:bg-[#2563EB] active:bg-[#1D4ED8] shadow-sm transition-all duration-150",
    secondary:
      "bg-[#1F2937] text-white hover:bg-[#374151] border border-[#374151] transition-all duration-150",
    outline:
      "bg-transparent text-[#94A3B8] border border-[#374151] hover:bg-[#1F2937] hover:text-white transition-all duration-150",
    ghost:
      "bg-transparent text-[#94A3B8] hover:bg-[#1F2937] hover:text-white transition-all duration-150",
    danger:
      "bg-[#EF4444] text-white hover:bg-[#DC2626] shadow-sm transition-all duration-150",
    success:
      "bg-[#22C55E] text-white hover:bg-[#16A34A] shadow-sm transition-all duration-150",
  };

  const isDisabled = disabled || loading;

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin h-4 w-4 shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12" cy="12" r="10"
            stroke="currentColor" strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
      ) : leftIcon ? (
        <span className="shrink-0">{leftIcon}</span>
      ) : null}
      {children}
      {!loading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
}