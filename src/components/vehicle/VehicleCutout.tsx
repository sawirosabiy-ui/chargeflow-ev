import React, { useState } from 'react';

interface VehicleCutoutProps {
  modelId?: string;
  modelName?: string;
  paintColor?: string;
  className?: string;
  preferPhoto?: boolean;
}

export const VehicleCutout: React.FC<VehicleCutoutProps> = ({
  modelId = 'byd-seagull',
  modelName = 'BYD Seagull',
  paintColor,
  className = 'w-28 h-16',
  preferPhoto = true,
}) => {
  const [imgError, setImgError] = useState(false);
  const normalized = (modelId + ' ' + modelName).toLowerCase().replace(/[\s_]+/g, '-');

  // Exact 1-to-1 photo mapping (strictly authentic files only, never misassigned)
  let photoUrl = '';
  if (normalized.includes('seagull')) {
    photoUrl = paintColor && (paintColor.includes('84cc16') || paintColor.includes('10b981') || paintColor.includes('green') || paintColor.includes('lime'))
      ? '/images/cars/byd-seagull-green.jpg'
      : '/images/cars/byd-seagull.jpg';
  } else if (normalized.includes('tesla') || normalized.includes('model-y') || normalized.includes('model-3')) {
    photoUrl = '/images/cars/tesla-model-y.jpg';
  } else if (normalized.includes('atto') || normalized.includes('atto-3')) {
    photoUrl = '/images/cars/byd-atto-3.jpg';
  } else if (normalized.includes('polestar')) {
    photoUrl = '/images/cars/halo-car.jpg';
  }

  // If authentic photo is available and no load error, render the studio 2D photograph
  if (preferPhoto && photoUrl && !imgError) {
    return (
      <div className={`relative flex items-center justify-center select-none ${className}`}>
        <img
          src={photoUrl}
          alt={modelName || 'Electric Vehicle'}
          onError={() => setImgError(true)}
          className="w-full h-full object-contain mix-blend-screen drop-shadow-[0_10px_16px_rgba(0,0,0,0.9)] transform scale-110 pointer-events-none"
          loading="eager"
        />
      </div>
    );
  }

  // Dynamic automotive paint color
  const bodyColor = paintColor || (
    normalized.includes('seagull') ? '#84CC16' :
    normalized.includes('tesla') ? '#E2E8F0' :
    normalized.includes('atto') ? '#0284C7' :
    normalized.includes('seal') ? '#10B981' :
    normalized.includes('song') ? '#6366F1' :
    normalized.includes('u9') ? '#E11D48' :
    normalized.includes('u8') ? '#D97706' : '#2DD4BF'
  );

  // 1. Yangwang U9 Track Hypercar (Low-slung, rear GT wing, aerodynamic canards)
  if (normalized.includes('u9') || normalized.includes('yangwang-u9')) {
    return (
      <div className={`relative flex items-center justify-center select-none ${className}`}>
        <svg viewBox="0 0 340 140" className="w-full h-auto drop-shadow-[0_12px_22px_rgba(0,0,0,0.9)]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="u9Paint" x1="0%" y1="0%" x2="100%" y2="70%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
              <stop offset="25%" stopColor={bodyColor} />
              <stop offset="85%" stopColor={bodyColor} />
              <stop offset="100%" stopColor="#0B132B" />
            </linearGradient>
          </defs>
          <ellipse cx="170" cy="125" rx="155" ry="10" fill="#000000" opacity="0.95" />
          <path d="M 40 50 L 75 50 L 70 56 L 36 56 Z" fill="#0F172A" stroke="#475569" strokeWidth="1" />
          <line x1="52" y1="56" x2="56" y2="76" stroke="#0F172A" strokeWidth="3" />
          <path d="M 38 98 C 45 76, 68 70, 95 68 C 120 66, 145 42, 185 40 C 230 38, 275 66, 305 78 C 322 84, 326 96, 320 106 L 298 112 C 290 94, 270 86, 250 88 C 230 90, 218 104, 216 112 L 136 112 C 130 94, 110 86, 90 88 C 72 90, 60 104, 58 112 Z" fill="url(#u9Paint)" stroke="#FFFFFF" strokeWidth="1" />
          <path d="M 135 68 C 150 48, 175 42, 205 42 C 235 42, 255 52, 268 68 Z" fill="#090E17" stroke="#334155" strokeWidth="1" />
          <circle cx="90" cy="110" r="18" fill="#090D16" stroke="#475569" strokeWidth="2.5" />
          <circle cx="90" cy="110" r="11" fill="#1E293B" stroke="#94A3B8" strokeWidth="1.2" />
          <circle cx="250" cy="110" r="18" fill="#090D16" stroke="#475569" strokeWidth="2.5" />
          <circle cx="250" cy="110" r="11" fill="#1E293B" stroke="#94A3B8" strokeWidth="1.2" />
          <path d="M 305 84 L 322 92 L 315 96 Z" fill="#38BDF8" filter="drop-shadow(0 0 5px #38BDF8)" />
        </svg>
      </div>
    );
  }

  // 2. Yangwang U8 Luxury Offroad SUV (Tall, upright, boxy, roof LiDAR pod)
  if (normalized.includes('u8') || normalized.includes('yangwang-u8')) {
    return (
      <div className={`relative flex items-center justify-center select-none ${className}`}>
        <svg viewBox="0 0 320 160" className="w-full h-auto drop-shadow-[0_12px_22px_rgba(0,0,0,0.9)]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="u8Paint" x1="0%" y1="0%" x2="100%" y2="80%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
              <stop offset="30%" stopColor={bodyColor} />
              <stop offset="85%" stopColor={bodyColor} />
              <stop offset="100%" stopColor="#0B132B" />
            </linearGradient>
          </defs>
          <ellipse cx="160" cy="144" rx="145" ry="12" fill="#000000" opacity="0.95" />
          <rect x="175" y="24" width="30" height="7" rx="3" fill="#0F172A" stroke="#38BDF8" strokeWidth="1" />
          <path d="M 45 120 L 45 68 C 45 58, 55 52, 68 50 L 120 48 L 140 32 L 235 32 C 245 32, 252 40, 256 50 L 275 62 L 292 78 C 298 86, 298 98, 296 114 L 282 122 C 274 100, 252 90, 230 92 C 210 94, 196 110, 196 122 L 132 122 C 126 100, 104 90, 82 92 C 62 94, 52 110, 48 122 Z" fill="url(#u8Paint)" stroke="#FFFFFF" strokeWidth="1.2" />
          <path d="M 144 38 L 230 38 L 248 56 L 128 56 Z" fill="#090E17" stroke="#334155" strokeWidth="1.2" />
          <circle cx="82" cy="122" r="23" fill="#090D16" stroke="#475569" strokeWidth="3" />
          <circle cx="82" cy="122" r="15" fill="#1E293B" stroke="#94A3B8" strokeWidth="1.5" />
          <circle cx="230" cy="122" r="23" fill="#090D16" stroke="#475569" strokeWidth="3" />
          <circle cx="230" cy="122" r="15" fill="#1E293B" stroke="#94A3B8" strokeWidth="1.5" />
          <rect x="284" y="78" width="10" height="8" rx="2" fill="#F59E0B" filter="drop-shadow(0 0 4px #F59E0B)" />
        </svg>
      </div>
    );
  }

  // 3. BYD Seal U / Sealion 7 (Aerodynamic Sleek Ocean-Series Crossover)
  if (normalized.includes('seal') || normalized.includes('sealion')) {
    return (
      <div className={`relative flex items-center justify-center select-none ${className}`}>
        <svg viewBox="0 0 320 160" className="w-full h-auto drop-shadow-[0_12px_20px_rgba(0,0,0,0.85)]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="sealPaint" x1="0%" y1="0%" x2="100%" y2="80%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
              <stop offset="35%" stopColor={bodyColor} />
              <stop offset="85%" stopColor={bodyColor} />
              <stop offset="100%" stopColor="#0B132B" />
            </linearGradient>
          </defs>
          <ellipse cx="160" cy="140" rx="145" ry="12" fill="#000000" opacity="0.9" />
          <path d="M 48 118 C 38 106, 44 82, 66 72 C 98 58, 136 40, 175 34 C 218 28, 260 36, 284 62 C 295 72, 298 90, 292 108 L 280 120 C 272 98, 250 88, 228 90 C 208 92, 194 110, 194 120 L 132 120 C 126 98, 104 88, 82 90 C 62 92, 52 110, 48 118 Z" fill="url(#sealPaint)" stroke="#FFFFFF" strokeWidth="1.2" />
          <path d="M 104 70 C 134 52, 170 42, 206 36 C 240 32, 262 38, 272 58 C 278 68, 274 74, 266 74 L 108 74 Z" fill="#090E17" stroke="#334155" strokeWidth="1.2" />
          <circle cx="82" cy="120" r="21" fill="#090D16" stroke="#475569" strokeWidth="2.5" />
          <circle cx="82" cy="120" r="14" fill="#1E293B" stroke="#94A3B8" strokeWidth="1.2" />
          <circle cx="228" cy="120" r="21" fill="#090D16" stroke="#475569" strokeWidth="2.5" />
          <circle cx="228" cy="120" r="14" fill="#1E293B" stroke="#94A3B8" strokeWidth="1.2" />
          <path d="M 278 80 L 294 88 L 288 92 Z" fill="#2DD4BF" filter="drop-shadow(0 0 5px #2DD4BF)" />
        </svg>
      </div>
    );
  }

  // 1. BYD Seagull Vector Silhouette (Fallback)
  if (normalized.includes('seagull')) {
    return (
      <div className={`relative flex items-center justify-center select-none ${className}`}>
        <svg 
          viewBox="0 0 320 160" 
          className="w-full h-auto drop-shadow-[0_12px_20px_rgba(0,0,0,0.85)]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="seagullDynamicBody" x1="0%" y1="0%" x2="100%" y2="80%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
              <stop offset="30%" stopColor={bodyColor} />
              <stop offset="75%" stopColor={bodyColor} />
              <stop offset="100%" stopColor="#0B132B" />
            </linearGradient>
            <linearGradient id="seagullGlassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="50%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>
            <linearGradient id="seagullRimMetal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="40%" stopColor="#64748B" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>
          </defs>
          <ellipse cx="160" cy="140" rx="145" ry="12" fill="#000000" opacity="0.9" />
          <path d="M 60 120 L 260 120 L 255 128 L 65 128 Z" fill="#090D16" />
          <path 
            d="M 52 118 C 42 108, 48 85, 68 76 C 96 64, 130 46, 165 38 C 205 28, 252 35, 278 60 C 290 70, 296 88, 292 106 L 278 120 C 270 98, 250 88, 228 90 C 208 92, 194 110, 194 120 L 134 120 C 128 98, 108 88, 88 90 C 68 92, 55 110, 52 118 Z" 
            fill="url(#seagullDynamicBody)" 
            stroke="#FFFFFF" 
            strokeWidth="1.2" 
          />
          <path d="M 98 76 L 114 56 L 126 56 L 108 76 Z" fill="#0F172A" />
          <path 
            d="M 108 74 C 134 56, 165 46, 198 40 C 232 34, 256 40, 268 60 C 274 70, 270 76, 262 76 L 112 76 Z" 
            fill="url(#seagullGlassGrad)" 
            stroke="#475569" 
            strokeWidth="1.2" 
          />
          <line x1="188" y1="42" x2="182" y2="76" stroke="#090D16" strokeWidth="4" />
          <path d="M 68 82 Q 170 92 282 72" fill="none" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.8" />
          <path d="M 90 102 Q 170 108 268 94" fill="none" stroke="#0B132B" strokeWidth="1.2" opacity="0.6" />
          <path d="M 238 68 C 248 68, 252 74, 246 78 L 236 76 Z" fill="#334155" stroke="#E2E8F0" strokeWidth="0.8" />
          <path d="M 272 82 L 290 92 L 284 96 Z" fill="#38BDF8" filter="drop-shadow(0 0 5px #38BDF8)" />
          <path d="M 54 86 C 50 94, 52 102, 58 104 L 54 86 Z" fill="#EF4444" filter="drop-shadow(0 0 4px #DC2626)" />
          <g transform="translate(228, 120)">
            <circle cx="0" cy="0" r="22" fill="#090D16" stroke="#1E293B" strokeWidth="3" />
            <circle cx="0" cy="0" r="17" fill="#1E293B" />
            <circle cx="0" cy="0" r="15" fill="url(#seagullRimMetal)" stroke="#94A3B8" strokeWidth="1.2" />
            <line x1="0" y1="-14" x2="0" y2="14" stroke="#E2E8F0" strokeWidth="2" />
            <line x1="-13" y1="-5" x2="13" y2="5" stroke="#E2E8F0" strokeWidth="2" />
            <line x1="-8" y1="11" x2="8" y2="-11" stroke="#E2E8F0" strokeWidth="2" />
            <circle cx="0" cy="0" r="4.5" fill="#090D16" stroke="#38BDF8" strokeWidth="1" />
          </g>
          <g transform="translate(88, 120)">
            <circle cx="0" cy="0" r="22" fill="#090D16" stroke="#1E293B" strokeWidth="3" />
            <circle cx="0" cy="0" r="17" fill="#1E293B" />
            <circle cx="0" cy="0" r="15" fill="url(#seagullRimMetal)" stroke="#94A3B8" strokeWidth="1.2" />
            <line x1="0" y1="-14" x2="0" y2="14" stroke="#E2E8F0" strokeWidth="2" />
            <line x1="-13" y1="-5" x2="13" y2="5" stroke="#E2E8F0" strokeWidth="2" />
            <line x1="-8" y1="11" x2="8" y2="-11" stroke="#E2E8F0" strokeWidth="2" />
            <circle cx="0" cy="0" r="4.5" fill="#090D16" stroke="#38BDF8" strokeWidth="1" />
          </g>
        </svg>
      </div>
    );
  }

  // 2. Tesla Model Y Vector Silhouette (Fallback)
  if (normalized.includes('tesla') || normalized.includes('model-y')) {
    return (
      <div className={`relative flex items-center justify-center select-none ${className}`}>
        <svg viewBox="0 0 320 160" className="w-full h-auto drop-shadow-[0_12px_20px_rgba(0,0,0,0.85)]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="teslaDynamicBody" x1="0%" y1="0%" x2="100%" y2="80%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
              <stop offset="35%" stopColor={bodyColor} />
              <stop offset="100%" stopColor="#0B132B" />
            </linearGradient>
            <linearGradient id="teslaGlass" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>
          </defs>
          <ellipse cx="160" cy="140" rx="145" ry="12" fill="#000" opacity="0.9" />
          <path d="M 48 118 C 38 105, 45 80, 68 70 C 100 56, 140 38, 180 32 C 225 25, 265 34, 288 62 C 298 74, 300 92, 295 108 L 282 120 C 274 98, 252 86, 230 88 C 210 90, 196 108, 196 120 L 130 120 C 124 98, 102 86, 80 88 C 60 90, 50 108, 48 118 Z" fill="url(#teslaDynamicBody)" stroke="#E2E8F0" strokeWidth="1.2" />
          <path d="M 105 68 C 135 50, 175 38, 215 34 C 248 30, 268 36, 276 56 C 280 66, 278 72, 270 72 L 108 72 Z" fill="url(#teslaGlass)" stroke="#334155" strokeWidth="1.2" />
          <path d="M 280 78 L 296 88 L 290 92 Z" fill="#67E8F9" filter="drop-shadow(0 0 4px #22D3EE)" />
          <circle cx="230" cy="120" r="22" fill="#090D16" stroke="#475569" strokeWidth="2.5" />
          <circle cx="230" cy="120" r="14" fill="#1E293B" stroke="#94A3B8" strokeWidth="1.5" />
          <circle cx="80" cy="120" r="22" fill="#090D16" stroke="#475569" strokeWidth="2.5" />
          <circle cx="80" cy="120" r="14" fill="#1E293B" stroke="#94A3B8" strokeWidth="1.5" />
        </svg>
      </div>
    );
  }

  // 3. Universal Modern Electric SUV (Fallback)
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg viewBox="0 0 320 160" className="w-full h-auto drop-shadow-[0_12px_20px_rgba(0,0,0,0.85)]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="universalCarPaint" x1="0%" y1="0%" x2="100%" y2="80%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
            <stop offset="40%" stopColor={bodyColor} />
            <stop offset="100%" stopColor="#0B132B" />
          </linearGradient>
        </defs>
        <ellipse cx="160" cy="140" rx="145" ry="12" fill="#000" opacity="0.9" />
        <path d="M 50 118 C 40 106, 46 82, 66 72 C 96 58, 135 42, 172 35 C 215 28, 258 35, 282 60 C 294 72, 296 90, 292 108 L 280 120 C 272 98, 250 88, 228 90 C 208 92, 194 110, 194 120 L 132 120 C 126 98, 104 88, 82 90 C 62 92, 52 110, 50 118 Z" fill="url(#universalCarPaint)" stroke="#E2E8F0" strokeWidth="1.2" />
        <path d="M 104 70 C 132 52, 168 42, 204 36 C 238 32, 260 38, 270 58 C 276 68, 272 74, 264 74 L 108 74 Z" fill="#0F172A" stroke="#334155" strokeWidth="1.2" />
        <path d="M 276 80 L 292 90 L 286 94 Z" fill="#22D3EE" filter="drop-shadow(0 0 5px #22D3EE)" />
        <circle cx="228" cy="120" r="22" fill="#090D16" stroke="#64748B" strokeWidth="2.5" />
        <circle cx="228" cy="120" r="14" fill="#1E293B" stroke="#CBD5E1" strokeWidth="1.5" />
        <circle cx="82" cy="120" r="22" fill="#090D16" stroke="#64748B" strokeWidth="2.5" />
        <circle cx="82" cy="120" r="14" fill="#1E293B" stroke="#CBD5E1" strokeWidth="1.5" />
      </svg>
    </div>
  );
};

export default VehicleCutout;
