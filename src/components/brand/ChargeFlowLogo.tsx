import React from "react";

interface ChargeFlowLogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: "sm" | "md" | "lg";
  theme?: "dark" | "cream";
}

export const ChargeFlowLogo: React.FC<ChargeFlowLogoProps> = ({
  className = "",
  iconOnly = false,
  size = "md",
  theme = "dark",
}) => {
  const isCream = theme === "cream";

  // Icon sizing
  const iconSizeClass = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  }[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Dynamic Luminous Energy Icon */}
      <div className={`relative ${iconSizeClass} shrink-0 rounded-2xl flex items-center justify-center p-1.5 transition-transform group-hover:scale-105 ${
        isCream
          ? "bg-gradient-to-br from-emerald-500/10 via-teal-500/15 to-sky-500/10 border border-emerald-600/20 shadow-sm"
          : "bg-gradient-to-br from-[#0B1A28] via-[#081822] to-[#04101A] border border-teal-500/30 shadow-[0_0_20px_rgba(45,212,191,0.25)]"
      }`}>
        {/* Subtle Ambient Glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-teal-400/20 to-emerald-400/20 blur-md pointer-events-none" />

        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10"
        >
          <defs>
            {/* Energy Wave Gradient: Electric Blue to Luminous Teal */}
            <linearGradient id="flowGrad" x1="10" y1="50" x2="90" y2="50" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="45%" stopColor="#0EA5E9" />
              <stop offset="55%" stopColor="#2DD4BF" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>

            {/* Lightning Center Glow */}
            <linearGradient id="boltGrad" x1="45" y1="25" x2="55" y2="65" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#A7F3D0" />
              <stop offset="100%" stopColor="#34D399" />
            </linearGradient>
          </defs>

          {/* Background Aerodynamic Flute Rail */}
          <path
            d="M 12 50 H 88"
            stroke="url(#flowGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.75"
          />

          {/* Left Flute Cap */}
          <rect x="8" y="45" width="5" height="10" rx="2.5" fill="#38BDF8" />

          {/* Right Flute Mouthpiece & Harmonic Nodes */}
          <circle cx="68" cy="50" r="2" fill="#10B981" />
          <circle cx="75" cy="50" r="2" fill="#10B981" />
          <circle cx="82" cy="50" r="2" fill="#10B981" />

          {/* Primary Resonant Energy Wave (The iconic A-curve peak) */}
          <path
            d="M 22 50 C 26 38, 34 38, 38 50 C 42 66, 44 72, 48 50 C 50 15, 52 15, 54 50 C 58 74, 62 66, 66 50 C 69 40, 73 40, 76 50"
            stroke="url(#flowGrad)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Central High-Voltage Core Lightning Bolt */}
          <path
            d="M 52 24 L 46 44 H 51 L 47 64 L 56 42 H 51 L 54 24 Z"
            fill="url(#boltGrad)"
            className="filter drop-shadow-[0_0_4px_#34D399]"
          />
        </svg>
      </div>

      {/* Typography Section */}
      {!iconOnly && (
        <div className="flex flex-col min-w-0">
          <div className="flex items-center tracking-wider">
            <span className={`text-base font-black tracking-widest ${
              isCream ? "text-stone-900" : "text-white"
            }`}>
              CHARGE
            </span>
            <span className="text-base font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
              FLOW
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-teal-400/90">
              EV CONSOLE
            </span>
            <span className="w-1 h-1 rounded-full bg-emerald-400/60" />
            <span className={`text-[9px] font-mono font-medium ${isCream ? "text-stone-400" : "text-slate-500"}`}>
              ETHIOPIA
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
export default ChargeFlowLogo;
