import React from "react";

interface VedhaLogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function VedhaLogo({
  className = "",
  showText = true,
  size = "md",
}: VedhaLogoProps) {
  // Determine dimensions based on size prop
  const iconDimensions = {
    sm: { width: 36, height: 36 },
    md: { width: 48, height: 48 },
    lg: { width: 64, height: 64 },
    xl: { width: 96, height: 96 },
  }[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* SVG Icon */}
      <svg
        width={iconDimensions.width}
        height={iconDimensions.height}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <defs>
          {/* Main Gradient */}
          <linearGradient id="vedha-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#071A52" />
            <stop offset="55%" stopColor="#0B5FFF" />
            <stop offset="100%" stopColor="#2DA8FF" />
          </linearGradient>
          {/* Circuit Gradient */}
          <linearGradient id="circuit-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2DA8FF" />
            <stop offset="100%" stopColor="#0B5FFF" />
          </linearGradient>
          {/* Glow Shadow */}
          <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Group containing the full icon */}
        <g filter="url(#logo-glow)">
          {/* Left Wing of the V (Digital/Circuit Board styling) */}
          <path
            d="M 32,22 L 50,75 L 44,75 L 26,22 Z"
            fill="url(#circuit-grad)"
            opacity="0.95"
          />

          {/* Circuit details on the Left Wing */}
          {/* Main vertical trace lines */}
          <line x1="30" y1="28" x2="41" y2="60" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.9" />
          <line x1="33" y1="26" x2="44" y2="58" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.9" />
          <line x1="36" y1="24" x2="47" y2="56" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.9" />
          
          {/* Circuit Nodes (endpoints) */}
          <circle cx="30" cy="28" r="2" fill="#FFFFFF" />
          <circle cx="33" cy="26" r="2" fill="#FFFFFF" />
          <circle cx="36" cy="24" r="2" fill="#FFFFFF" />
          <circle cx="41" cy="60" r="1.5" fill="#FFFFFF" />
          <circle cx="44" cy="58" r="1.5" fill="#FFFFFF" />
          <circle cx="47" cy="56" r="1.5" fill="#FFFFFF" />

          {/* Floating digital pixels/blocks (Top Left of the V) */}
          <rect x="22" y="24" width="4" height="4" rx="0.5" fill="#0B5FFF" />
          <rect x="18" y="28" width="3" height="3" rx="0.5" fill="#2DA8FF" />
          <rect x="24" y="32" width="3" height="3" rx="0.5" fill="#071A52" />
          <rect x="28" y="36" width="4" height="4" rx="0.5" fill="#0B5FFF" />
          <rect x="14" y="34" width="3" height="3" rx="0.5" fill="#2DA8FF" />
          <rect x="20" y="40" width="3" height="3" rx="0.5" fill="#0B5FFF" />
          
          {/* Right Wing of the V (Sleek Gradient Aerodynamic wing) */}
          <path
            d="M 50,75 L 76,22 C 70,22 64,25 58,35 L 50,75 Z"
            fill="url(#vedha-grad)"
          />
          
          {/* Book Pages (Base of the V) */}
          {/* Left Book Page */}
          <path
            d="M 50,75 C 42,73 34,70 30,68 C 36,74 44,77 50,81 Z"
            fill="#071A52"
          />
          <path
            d="M 50,77 C 43,75 36,73 32,71 C 37,76 45,79 50,82 Z"
            fill="#0B5FFF"
            opacity="0.8"
          />
          <path
            d="M 50,79 C 44,77 38,76 34,74 C 38,78 45,81 50,83 Z"
            fill="#2DA8FF"
            opacity="0.6"
          />

          {/* Right Book Page */}
          <path
            d="M 50,75 C 58,73 66,70 70,68 C 64,74 56,77 50,81 Z"
            fill="#071A52"
          />
          <path
            d="M 50,77 C 57,75 64,73 68,71 C 63,76 55,79 50,82 Z"
            fill="#0B5FFF"
            opacity="0.8"
          />
          <path
            d="M 50,79 C 56,77 62,76 66,74 C 62,78 55,81 50,83 Z"
            fill="#2DA8FF"
            opacity="0.6"
          />

          {/* Center Spine of the Book */}
          <path d="M 50,75 L 50,83.5" stroke="#071A52" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      </svg>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col justify-center">
          <span className="font-poppins font-black tracking-wider text-brand-primary text-lg sm:text-xl flex items-center leading-none">
            VEDHA<span className="text-brand-secondary ml-1">AI</span>
          </span>
          <span className="font-inter text-[8px] sm:text-[9px] uppercase tracking-widest text-brand-text-secondary font-bold leading-none mt-1">
            Knowledge • Innovation • Intelligence
          </span>
        </div>
      )}
    </div>
  );
}
