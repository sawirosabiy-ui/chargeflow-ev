import React from 'react';

interface BYDSeagull2DProps {
  className?: string;
  isCharging?: boolean;
  isLocked?: boolean;
}

export const BYDSeagull2D: React.FC<BYDSeagull2DProps> = ({
  className = "w-full max-w-lg",
  isCharging = false,
  isLocked = true,
}) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* 1. Emerald Glowing Radial Pedestal on Floor */}
      <div className="absolute -bottom-8 w-80 sm:w-96 h-28 pointer-events-none flex items-center justify-center">
        {/* Soft Radial Ambient Glow */}
        <div className="absolute inset-0 bg-emerald-500/15 rounded-[100%] blur-2xl transform scale-y-50"></div>
        
        {/* Crisp Glowing Ring */}
        <div className="w-full h-full rounded-[100%] border border-emerald-400/50 shadow-[0_0_25px_rgba(16,185,129,0.4)] transform scale-y-[0.38] relative flex items-center justify-center">
          {/* Inner Accent Ring */}
          <div className="w-[88%] h-[88%] rounded-[100%] border border-cyan-400/40 opacity-75"></div>
        </div>

        {/* Shadow Directly Under Vehicle Wheels */}
        <div className="absolute w-3/4 h-12 bg-black/80 rounded-[100%] blur-md transform scale-y-40 translate-y-2"></div>
      </div>

      {/* 2. High-Resolution 2D BYD Seagull Cutout Illustration */}
      <div className="relative z-10 w-full flex items-center justify-center transform hover:scale-[1.01] transition-transform duration-300">
        <svg 
          viewBox="0 0 720 380" 
          className="w-full h-auto drop-shadow-[0_20px_25px_rgba(0,0,0,0.8)]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Automotive Paint Shaders */}
            <linearGradient id="bodyPaint" x1="0%" y1="0%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="35%" stopColor="#059669" />
              <stop offset="70%" stopColor="#047857" />
              <stop offset="100%" stopColor="#064E3B" />
            </linearGradient>

            <linearGradient id="roofGlass" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0F172A" />
              <stop offset="60%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>

            <linearGradient id="rimMetal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#94A3B8" />
              <stop offset="50%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>

            <filter id="neonHeadlight" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Underbody Shadow */}
          <ellipse cx="360" cy="315" rx="310" ry="22" fill="#000000" opacity="0.9" />

          {/* Main Vehicle Chassis & Sculpted Bodywork */}
          <path
            d="M 120 280 
               C 110 260, 115 210, 155 190 
               C 210 165, 270 125, 340 100 
               C 420 72, 530 85, 595 140 
               C 625 165, 645 210, 640 260 
               C 635 285, 620 295, 595 295 
               L 550 295 
               C 545 250, 500 220, 455 225 
               C 410 230, 385 270, 385 295 
               L 260 295 
               C 255 250, 210 220, 165 225 
               C 125 230, 105 265, 105 295 
               Z"
            fill="url(#bodyPaint)"
            stroke="#10B981"
            strokeWidth="2.5"
          />

          {/* Sleek Aerodynamic Cabin Glass / Windshield & Side Windows */}
          <path
            d="M 235 180 
               C 285 140, 340 112, 410 95 
               C 480 80, 525 95, 560 145 
               C 575 168, 570 185, 550 185 
               L 245 185 
               Z"
            fill="url(#roofGlass)"
            stroke="#334155"
            strokeWidth="3"
          />

          {/* B-Pillar & Window Tint Divisor */}
          <line x1="390" y1="98" x2="385" y2="185" stroke="#0F172A" strokeWidth="6" />
          <line x1="480" y1="108" x2="475" y2="185" stroke="#0F172A" strokeWidth="5" />

          {/* Character Body Crease Lines */}
          <path d="M 155 205 Q 360 215 610 175" fill="none" stroke="#34D399" strokeWidth="2.5" opacity="0.7" />
          <path d="M 180 255 Q 360 265 580 245" fill="none" stroke="#064E3B" strokeWidth="3" />

          {/* Front Dynamic LED Headlight Projectors */}
          <path
            d="M 575 170 C 610 175, 630 195, 625 220 C 605 210, 580 195, 575 170 Z"
            fill="#E0F2FE"
            filter="url(#neonHeadlight)"
          />
          <path
            d="M 585 185 L 620 200"
            stroke="#38BDF8"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Rear LED Continuous Light Bar */}
          <path
            d="M 128 205 C 122 220, 125 240, 140 245 C 135 230, 132 215, 128 205 Z"
            fill="#EF4444"
            filter="url(#neonHeadlight)"
          />

          {/* BYD Seagull Front Wheel & 5-Spoke Blade Rim */}
          <g transform="translate(470, 275)">
            {/* Tire Outer */}
            <circle cx="0" cy="0" r="54" fill="#0F172A" stroke="#1E293B" strokeWidth="5" />
            <circle cx="0" cy="0" r="42" fill="#1E293B" />
            <circle cx="0" cy="0" r="38" fill="url(#rimMetal)" stroke="#64748B" strokeWidth="2" />
            {/* 5 Spoke Lines */}
            <line x1="0" y1="-36" x2="0" y2="36" stroke="#94A3B8" strokeWidth="4" />
            <line x1="-34" y1="-12" x2="34" y2="12" stroke="#94A3B8" strokeWidth="4" />
            <line x1="-22" y1="28" x2="22" y2="-28" stroke="#94A3B8" strokeWidth="4" />
            {/* Center Cap */}
            <circle cx="0" cy="0" r="10" fill="#10B981" />
          </g>

          {/* BYD Seagull Rear Wheel & 5-Spoke Blade Rim */}
          <g transform="translate(180, 275)">
            {/* Tire Outer */}
            <circle cx="0" cy="0" r="54" fill="#0F172A" stroke="#1E293B" strokeWidth="5" />
            <circle cx="0" cy="0" r="42" fill="#1E293B" />
            <circle cx="0" cy="0" r="38" fill="url(#rimMetal)" stroke="#64748B" strokeWidth="2" />
            {/* 5 Spoke Lines */}
            <line x1="0" y1="-36" x2="0" y2="36" stroke="#94A3B8" strokeWidth="4" />
            <line x1="-34" y1="-12" x2="34" y2="12" stroke="#94A3B8" strokeWidth="4" />
            <line x1="-22" y1="28" x2="22" y2="-28" stroke="#94A3B8" strokeWidth="4" />
            {/* Center Cap */}
            <circle cx="0" cy="0" r="10" fill="#10B981" />
          </g>

          {/* Front Wing DC Fast Charging Port Flap */}
          <g transform="translate(520, 195)">
            <rect x="0" y="0" width="24" height="18" rx="4" fill="#065F46" stroke="#34D399" strokeWidth="1.5" />
            {isCharging && (
              <circle cx="12" cy="9" r="5" fill="#38BDF8" className="animate-ping" />
            )}
          </g>

          {/* Door Handles (Flush aerodynamic design) */}
          <rect x="330" y="200" width="30" height="5" rx="2.5" fill="#064E3B" stroke="#34D399" strokeWidth="1" />
          <rect x="435" y="195" width="30" height="5" rx="2.5" fill="#064E3B" stroke="#34D399" strokeWidth="1" />
        </svg>
      </div>
    </div>
  );
};
