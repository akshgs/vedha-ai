import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  className?: string;
}

export default function PageHeader({
  title,
  subtitle,
  action,
  icon,
  badge,
  className = "",
}: PageHeaderProps) {
  return (
    <div className={`flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-[#1F2937] pb-8 ${className}`}>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6]">
              {icon}
            </div>
          )}
          <h1 className="text-[36px] font-bold text-white tracking-tight leading-tight flex items-center gap-3">
            {title}
          </h1>
          {badge}
        </div>
        {subtitle && (
          <p className="mt-2 text-[14px] text-[#94A3B8] max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {action && (
        <div className="flex items-center gap-4 shrink-0 self-start lg:self-auto">
          {action}
        </div>
      )}
    </div>
  );
}
