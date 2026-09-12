import React from 'react';

interface AheHologramFloorProps {
  batterySoc: number;
  isCharging: boolean;
}

export const AheHologramFloor: React.FC<AheHologramFloorProps> = ({ batterySoc, isCharging }) => {
  return (
    <div className="absolute left-1/2 bottom-[105px] sm:bottom-[16%] -translate-x-1/2 pointer-events-none select-none z-10 flex flex-col items-center justify-center scale-75 sm:scale-95 lg:scale-105 transition-all">
      {/* Dynamic Luminous Floor Projection */}
      <div className="relative w-[340px] sm:w-[420px] lg:w-[460px] h-[130px] sm:h-[160px] flex items-center justify-center">
        {/* Soft Ground Glow Ellipse */}
        <div 
          className={`absolute inset-0 rounded-[100%] transition-opacity duration-1000 ${
            isCharging 
              ? 'bg-gradient-to-r from-teal-500/25 via-emerald-400/30 to-cyan-400/25 blur-2xl opacity-90' 
              : 'bg-teal-500/10 blur-xl opacity-40'
          }`} 
        />

        {/* SVG Holographic Concentric Rings and Dashes with 3D Floor Perspective */}
        <svg 
          className="w-full h-full transform"
          viewBox="0 0 460 160" 
          style={{ transform: 'perspective(400px) rotateX(62deg)' }}
        >
          <defs>
            {/* Emerald to Cyan Gradient */}
            <linearGradient id="holoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#10b981" stopOpacity="1" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
            </linearGradient>

            <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Dashed Rotating Ring */}
          <circle
            cx="230"
            cy="80"
            r="75"
            fill="none"
            stroke="url(#holoGradient)"
            strokeWidth="1.8"
            strokeDasharray="14 10 6 10"
            filter="url(#cyanGlow)"
            className={isCharging ? 'animate-[spin_24s_linear_infinite]' : ''}
            style={{ transformOrigin: '230px 80px' }}
          />

          {/* Middle Energy Arc Segments */}
          <circle
            cx="230"
            cy="80"
            r="64"
            fill="none"
            stroke="#2DD4BF"
            strokeWidth="1.2"
            strokeDasharray="45 20 80 20"
            opacity={isCharging ? "0.85" : "0.4"}
            filter="url(#cyanGlow)"
            className={isCharging ? 'animate-[spin_16s_linear_infinite_reverse]' : ''}
            style={{ transformOrigin: '230px 80px' }}
          />

          {/* Inner Accent Ring */}
          <circle
            cx="230"
            cy="80"
            r="52"
            fill="none"
            stroke="#10B981"
            strokeWidth="1.5"
            strokeDasharray="8 6"
            opacity={isCharging ? "0.9" : "0.3"}
          />
        </svg>

        {/* Center Holographic Text Overlay (Exact match to ahe_update.png) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center tracking-wider font-sans z-10 -mt-2 sm:-mt-3">
          <div className="text-[10px] sm:text-[11px] font-black uppercase text-[#2DD4BF] tracking-[0.2em] drop-shadow-[0_0_12px_rgba(45,212,191,0.8)]">
            CONTACT CHARGING
          </div>
          <div className="text-[9px] sm:text-[10px] italic font-medium text-teal-200/90 tracking-wide mt-0.5 drop-shadow-[0_0_8px_rgba(45,212,191,0.6)]">
            {isCharging ? 'Energy transferring...' : 'Ready for contact'}
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight mt-0.5 drop-shadow-[0_0_14px_rgba(45,212,191,0.9)] flex items-baseline justify-center">
            <span>{Math.round(batterySoc)}</span>
            <span className="text-sm sm:text-base font-bold text-[#2DD4BF] ml-0.5">%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
