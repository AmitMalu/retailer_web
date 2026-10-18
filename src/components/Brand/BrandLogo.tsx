import React from "react";

interface BrandLogoProps {
  /** "light" for dark backgrounds (sidebar), "dark" for light backgrounds */
  tone?: "light" | "dark";
  size?: number;
  showText?: boolean;
  subtitle?: string;
}

export const BrandMark: React.FC<{ size?: number }> = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="scs-mark" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#34D399" />
        <stop offset="1" stopColor="#047857" />
      </linearGradient>
    </defs>
    <rect width="40" height="40" rx="11" fill="url(#scs-mark)" />
    <path
      d="M26.5 13.5c-1.4-1.3-3.4-2-5.6-2-3.6 0-6.1 1.9-6.1 4.6 0 5.6 11.4 3.3 11.4 8.1 0 1.9-2 3.3-5 3.3-2.4 0-4.5-.9-6-2.5"
      stroke="#fff"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <circle cx="28" cy="27.5" r="2.2" fill="#ECFDF5" />
  </svg>
);

const BrandLogo: React.FC<BrandLogoProps> = ({ tone = "dark", size = 36, showText = true, subtitle }) => (
  <div className="flex items-center gap-3 select-none">
    <BrandMark size={size} />
    {showText && (
      <div className="leading-tight">
        <div className={`font-extrabold tracking-tight text-[17px] ${tone === "light" ? "text-white" : "text-slate-900"}`}>
          Smart<span className="text-emerald-400">Credit</span>
        </div>
        <div className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${tone === "light" ? "text-slate-400" : "text-slate-500"}`}>
          {subtitle ?? "Solution"}
        </div>
      </div>
    )}
  </div>
);

export default BrandLogo;
