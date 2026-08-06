import type { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  rightIcon?: ReactNode;
  required?: boolean;
}

export default function Input({
  label,
  error,
  hint,
  icon,
  rightIcon,
  className = "",
  id,
  required,
  ...props
}: InputProps) {
  return (
    <div className="w-full ve-form-group" style={{ gap: "8px" }}>
      {label && (
        <label htmlFor={id} className="ve-label">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
            {icon}
          </div>
        )}

        <input
          id={id}
          className={`ve-input ${icon ? "pl-10" : ""} ${rightIcon ? "pr-10" : ""} ${
            error ? "ve-input-error" : ""
          } ${className}`}
          style={{
            background: "#1F2937",
            border: "1px solid #374151",
            color: "#FFFFFF",
          }}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          {...props}
        />

        {rightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500">
            {rightIcon}
          </div>
        )}
      </div>

      {error && (
        <p id={`${id}-error`} className="ve-error animate-fade-in" role="alert">
          {error}
        </p>
      )}

      {hint && !error && (
        <p id={`${id}-hint`} className="ve-caption">
          {hint}
        </p>
      )}
    </div>
  );
}
