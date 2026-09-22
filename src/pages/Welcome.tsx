import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Zap, 
  ArrowRight, 
  ChevronDown, 
  Check, 
  Globe, 
  RotateCw, 
  Sparkles, 
  MapPin, 
  ChevronRight,
  Battery,
  Gauge
} from 'lucide-react';
import { useChargeFlowStore } from '../store/useChargeFlowStore';
import { AVAILABLE_CARS, CarSpec, VEHICLE_COLORS } from '../data/cars';
import { ShowroomStage } from '../components/ShowroomStage';
import { Language } from '../types';
import { useTranslation } from '../localization/useTranslation';

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'EN', label: 'English' },
  { code: 'አማ', label: 'አማርኛ' },
  { code: 'ORM', label: 'Afaan Oromoo' },
  { code: 'TIR', label: 'ትግርኛ' },
];

export const Welcome: React.FC = () => {
  const { t, language, setLanguage } = useTranslation();
  const setView = useChargeFlowStore((s) => s.setView);
  const user = useChargeFlowStore((s) => s.user);
  const selectCar = useChargeFlowStore((s) => s.selectCar);
  const storedVehicle = useChargeFlowStore((s) => s.vehicle);
  const setVehicleColor = useChargeFlowStore((s) => s.setVehicleColor);
  const openAuthModal = useChargeFlowStore((s) => s.openAuthModal);
  const setCopilotOpen = useChargeFlowStore((s) => s.setCopilotOpen);
  const theme = useChargeFlowStore((s) => s.theme);
  const isCream = theme === 'cream';

  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [isAutoSpinning, setIsAutoSpinning] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!langDropdownOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLangDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [langDropdownOpen]);

  // Single source of truth for the selected car across the entire app
  const selectedCar = useMemo(() => {
    return AVAILABLE_CARS.find((c) => c.id === storedVehicle.id) || AVAILABLE_CARS[0];
  }, [storedVehicle.id]);

  const currentPaintColor = storedVehicle.paintColor || selectedCar.paintColor || '#2DD4BF';

  const handleSelectCar = (car: CarSpec) => {
    selectCar(car);
    if (car.paintColor) {
      setVehicleColor(car.paintColor, 'Factory Paint');
    }
  };

  const handleSelectColor = (hex: string, name: string) => {
    setVehicleColor(hex, name);
  };

  const handleGetStarted = () => {
    if (user.isAuthenticated) {
      setView('cockpit');
    } else {
      openAuthModal('signup');
    }
  };

  const handleSignInClick = () => {
    if (user.isAuthenticated) {
      setView('cockpit');
    } else {
      openAuthModal('signin');
    }
  };

  return (
    <div className={`relative min-h-screen w-full font-sans flex flex-col justify-between transition-colors duration-300 ${
      isCream ? 'bg-[#F4F1EA] text-slate-900' : 'bg-[#040711] text-white'
    }`}>
      {/* 1. Cinematic Background Elements (Atmospheric gradients and glowing accents) */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-transparent via-[#040711]/40 to-[#040711] pointer-events-none" />
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[480px] rounded-full bg-teal-500/10 blur-[140px] pointer-events-none" />
      <div className="fixed -top-32 -left-32 w-80 h-80 rounded-full bg-teal-500/10 blur-[120px] pointer-events-none" />
      <div className="fixed -bottom-32 -right-32 w-80 h-80 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />

      {/* 2. Top Header Navigation Bar (Compact & Responsive) */}
      <header className={`relative z-30 px-4 sm:px-8 lg:px-12 py-3 sm:py-3.5 flex items-center justify-between border-b backdrop-blur-xl transition-colors ${
        isCream ? 'border-slate-200/80 bg-white/75' : 'border-white/5 bg-[#040711]/70'
      }`}>
        {/* Brand Logo */}
        <button 
          type="button"
          onClick={() => setView('welcome')}
          aria-label="ChargeFlow Home"
          className="flex items-center gap-2.5 cursor-pointer group text-left bg-transparent border-0 p-0"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#2DD4BF] to-[#10B981] flex items-center justify-center shadow-[0_0_20px_rgba(45,212,191,0.4)] group-hover:scale-105 transition-transform">
            <Zap className="w-4 h-4 text-slate-950 fill-slate-950" />
          </div>
          <div className="flex flex-col">
            <span className={`text-sm font-black tracking-widest leading-none ${isCream ? 'text-slate-900' : 'text-white'}`}>
              CHARGEFLOW
            </span>
            <span className="text-[8px] font-mono tracking-widest text-[#0D9488] dark:text-[#2DD4BF] mt-0.5 font-bold">
              EV INTELLIGENCE
            </span>
          </div>
        </button>

        {/* Right Actions: Language & Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Selector Dropdown */}
          <div className="relative" ref={langDropdownRef}>
            <button 
              type="button"
              onClick={() => setLangDropdownOpen((prev) => !prev)}
              aria-haspopup="listbox"
              aria-expanded={langDropdownOpen}
              aria-label="Select Language"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                isCream 
                  ? 'bg-white border-slate-200 hover:border-teal-500 text-slate-800 shadow-sm' 
                  : 'bg-white/5 border-white/10 hover:border-teal-500/40 text-slate-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-teal-400" />
              <span className="font-mono">{language}</span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {langDropdownOpen && (
              <div 
                role="listbox"
                aria-label="Language options"
                className={`absolute right-0 mt-2 w-36 rounded-2xl border shadow-2xl p-1 z-50 space-y-0.5 ${
                  isCream ? 'bg-white border-slate-200' : 'bg-[#0C1220] border-white/10'
                }`}
              >
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    role="option"
                    aria-selected={language === l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors ${
                      language === l.code
                        ? 'bg-teal-500/20 text-teal-400 font-bold'
                        : isCream 
                          ? 'text-slate-700 hover:bg-slate-100' 
                          : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>{l.label}</span>
                    {language === l.code && <Check className="w-3.5 h-3.5 text-teal-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sign In / Cockpit Action */}
          <button
            type="button"
            onClick={handleSignInClick}
            aria-label={user.isAuthenticated ? t.cockpit : t.signIn}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all hover:scale-105 cursor-pointer flex items-center gap-1.5 ${
              isCream 
                ? 'bg-white border-slate-200 text-slate-900 shadow-sm hover:bg-slate-50' 
                : 'border-white/15 bg-white/5 hover:bg-white/10 text-white'
            }`}
          >
            <span>{user.isAuthenticated ? (user.name ? user.name.split(' ')[0] : t.cockpit) : t.signIn}</span>
            {user.isAuthenticated && <span className="w-2 h-2 rounded-full bg-emerald-400"></span>}
          </button>
        </div>
      </header>

      {/* 3. Main Body Container */}
      <main className="relative z-10 flex-1 flex flex-col justify-start max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-12 py-3 sm:py-6 space-y-4 sm:space-y-6">
        
        {/* Section A: Hero Typography (Apple Automotive Style) */}
        <section className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-2.5 pt-1 sm:pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-[9px] sm:text-[10px] font-mono tracking-widest uppercase font-bold shadow-[0_0_15px_rgba(45,212,191,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            <span>{t.networkBanner}</span>
          </div>

          <h1 className={`text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase leading-[1.15] ${
            isCream ? 'text-slate-900' : 'text-white'
          }`}>
            {t.heroHeading1} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-200">
              {t.heroHeading2}
            </span>
          </h1>

          <p className={`text-xs sm:text-sm max-w-xl mx-auto leading-normal sm:leading-relaxed ${
            isCream ? 'text-slate-600' : 'text-slate-400'
          }`}>
            {t.welcomeSubtitle}
          </p>
        </section>

        {/* Section B: Hero CTA Buttons (Directly Under Hero Text, Compact on Mobile) */}
        <section className="flex flex-col items-center max-w-2xl mx-auto w-full pt-0.5">
          <div className="w-full flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleGetStarted}
              className="w-full sm:w-auto px-6 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(45,212,191,0.35)] transition-all hover:scale-105 cursor-pointer"
            >
              <span>{user.isAuthenticated ? t.openCockpit : t.createAccount}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {!user.isAuthenticated && (
              <button
                type="button"
                onClick={handleSignInClick}
                className={`w-full sm:w-auto px-5 py-2.5 sm:py-3 rounded-2xl border text-xs font-bold transition-all hover:scale-105 cursor-pointer flex items-center justify-center gap-2 ${
                  isCream 
                    ? 'bg-white border-slate-200 text-slate-800 shadow-sm hover:bg-slate-50' 
                    : 'bg-white/5 hover:bg-white/10 border-white/15 text-white'
                }`}
              >
                <span>{t.signIn}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setView('find_charge')}
              className={`w-full sm:w-auto px-5 py-2.5 sm:py-3 rounded-2xl border text-xs font-bold transition-all hover:scale-105 cursor-pointer flex items-center justify-center gap-2 ${
                isCream 
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800' 
                  : 'bg-slate-900/80 hover:bg-slate-800 border-white/15 text-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              <span>{t.exploreStations}</span>
            </button>
          </div>
        </section>

        {/* Section C: Premium 3D Showroom (Hero Stage) */}
        <section className={`relative w-full rounded-3xl overflow-hidden border shadow-2xl p-3 sm:p-5 flex flex-col items-center ${
          isCream ? 'bg-white/90 border-slate-200 shadow-slate-200/50' : 'bg-[#040813] border-white/10'
        }`}>
          {/* Centered Showroom Terrace Photo Backdrop */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50 pointer-events-none transition-opacity duration-300"
            style={{ backgroundImage: `url('/images/showroom-bg.jpg')` }}
          />
          {/* Soft environmental blending gradients */}
          <div className="absolute inset-0 bg-radial from-transparent via-[#040813]/60 to-[#02050B]/95 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#02050B] via-transparent to-[#040813]/80 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#02050B]/80 via-transparent to-[#02050B]/80 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 rounded-full bg-teal-500/10 blur-[100px] pointer-events-none" />

          {/* Top Row: Left Unified 360° Toolbar | Right Dynamic Car Brand & Name */}
          <div className="w-full flex items-start justify-between z-20 pb-1 sm:pb-2">
            {/* Unified 360 View Badge with Integrated Auto-Spin Toggle */}
            <div className="flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl bg-black/60 border border-white/15 backdrop-blur-md text-left shadow-lg pointer-events-auto">
              <RotateCw className={`w-3.5 h-3.5 text-teal-400 shrink-0 ${isAutoSpinning ? 'motion-safe:animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
              <div>
                <div className="text-[9px] sm:text-[10px] font-mono font-black text-teal-300 uppercase tracking-widest leading-none">
                  {t.view360}
                </div>
                <div className="text-[8px] sm:text-[9px] text-slate-400 mt-0.5 leading-none hidden xs:block">
                  {t.dragToRotate}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAutoSpinning((prev) => !prev)}
                aria-label={isAutoSpinning ? t.pauseSpin : t.autoSpin}
                aria-pressed={isAutoSpinning}
                className={`ml-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[9px] sm:text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                  isAutoSpinning 
                    ? 'bg-teal-500/30 border-teal-400/50 text-teal-200' 
                    : 'bg-white/10 hover:bg-white/20 border-white/20 text-slate-200'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isAutoSpinning ? 'bg-teal-400 animate-ping' : 'bg-slate-400'}`} />
                <span>{isAutoSpinning ? t.pauseSpin : t.autoSpin}</span>
              </button>
            </div>

            {/* Top-Right: Brand & Car Model Name */}
            <div className="text-right">
              <div className="text-[10px] sm:text-[11px] font-mono font-black text-teal-400 uppercase tracking-widest drop-shadow">
                {selectedCar.brand}
              </div>
              <div className="text-xs sm:text-base font-black text-white tracking-wide drop-shadow">
                {selectedCar.name}
              </div>
            </div>
          </div>

          {/* 3D Canvas Box: Clean height framing */}
          <div className="w-full h-[46vh] min-h-[300px] max-h-[420px] sm:h-96 lg:h-[460px] relative flex items-center justify-center overflow-hidden z-10">
            <ShowroomStage 
              selectedCar={selectedCar} 
              paintColor={currentPaintColor} 
              autoRotate={isAutoSpinning} 
              onToggleAutoRotate={setIsAutoSpinning}
              hideBottomControls={true}
              hideTitle={true} 
            />
          </div>

          {/* Exterior Automotive Color Customizer Swatches */}
          <div 
            role="radiogroup" 
            aria-label={t.exteriorPaint}
            className="w-full flex items-center justify-center gap-2.5 pt-2 pb-1 z-10"
          >
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mr-1 hidden sm:inline">
              {t.exteriorPaint}:
            </span>
            <div className="flex items-center gap-2">
              {VEHICLE_COLORS.map((c) => {
                const isSelected = currentPaintColor.toLowerCase() === c.hex.toLowerCase();
                return (
                  <button
                    key={c.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={`Select ${c.name} paint`}
                    onClick={() => handleSelectColor(c.hex, c.name)}
                    title={`Select ${c.name} paint`}
                    className={`relative w-5 h-5 sm:w-6 sm:h-6 rounded-full transition-all cursor-pointer ${
                      isSelected
                        ? 'scale-125 ring-2 ring-teal-400 ring-offset-2 ring-offset-[#060C17] shadow-[0_0_12px_rgba(45,212,191,0.6)]'
                        : 'hover:scale-110 opacity-75 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: c.hex,
                      border: c.id === 'black' ? '1px solid #475569' : `1px solid ${c.borderHex}`,
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Vehicle Model Switcher Carousel with Edge Fade Indicators on Mobile */}
          <div className="relative w-full max-w-3xl pt-2 sm:pt-3 z-10">
            {/* Horizontal gradient masks to indicate scrollability on mobile */}
            <div className="pointer-events-none absolute left-0 top-2 bottom-1 w-6 bg-gradient-to-r from-[#040813] to-transparent z-20 sm:hidden" />
            <div className="pointer-events-none absolute right-0 top-2 bottom-1 w-6 bg-gradient-to-l from-[#040813] to-transparent z-20 sm:hidden" />

            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-2 scrollbar-none justify-start sm:justify-center px-2">
              {AVAILABLE_CARS.map((car) => (
                <button
                  key={car.id}
                  type="button"
                  onClick={() => handleSelectCar(car)}
                  aria-pressed={selectedCar.id === car.id}
                  className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border flex items-center gap-1.5 ${
                    selectedCar.id === car.id
                      ? 'bg-teal-500/20 border-teal-400 text-teal-300 shadow-[0_0_15px_rgba(45,212,191,0.25)]'
                      : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>{car.name}</span>
                  {selectedCar.id === car.id && <Check className="w-3 h-3 text-teal-400" />}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Section D: Live Vehicle Specs Ribbon (Real Showroom Specs) */}
        <section className="w-full max-w-2xl mx-auto grid grid-cols-3 gap-2.5 sm:gap-4 text-center font-mono">
          <div className={`p-2.5 sm:p-3.5 rounded-2xl border backdrop-blur-md shadow-lg ${
            isCream ? 'bg-white/80 border-slate-200' : 'bg-white/[0.03] border-white/10'
          }`}>
            <div className="text-[10px] text-slate-400 font-sans font-medium flex items-center justify-center gap-1">
              <Battery className="w-3 h-3 text-emerald-400" />
              <span>{t.batteryCapacity}</span>
            </div>
            <div className="text-sm sm:text-base font-black text-emerald-400 mt-0.5">
              {selectedCar.capacity || '60.5 kWh'}
            </div>
          </div>

          <div className={`p-2.5 sm:p-3.5 rounded-2xl border backdrop-blur-md shadow-lg ${
            isCream ? 'bg-white/80 border-slate-200' : 'bg-white/[0.03] border-white/10'
          }`}>
            <div className="text-[10px] text-slate-400 font-sans font-medium flex items-center justify-center gap-1">
              <Gauge className="w-3 h-3 text-teal-400" />
              <span>{t.estimatedRange}</span>
            </div>
            <div className={`text-sm sm:text-base font-black mt-0.5 ${isCream ? 'text-slate-900' : 'text-white'}`}>
              {selectedCar.range || '420 km'}
            </div>
          </div>

          <div className={`p-2.5 sm:p-3.5 rounded-2xl border backdrop-blur-md shadow-lg ${
            isCream ? 'bg-white/80 border-slate-200' : 'bg-white/[0.03] border-white/10'
          }`}>
            <div className="text-[10px] text-slate-400 font-sans font-medium flex items-center justify-center gap-1">
              <Zap className="w-3 h-3 text-cyan-400" />
              <span>{t.powertrainLabel}</span>
            </div>
            <div className="text-sm sm:text-base font-black text-teal-300 mt-0.5 truncate px-1">
              {selectedCar.drive || 'FWD'}
            </div>
          </div>
        </section>

        {/* Section E: Intelligent Charging 3-Step Flow */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 pt-1">
          <div className={`p-4 sm:p-5 rounded-3xl border space-y-2 transition-all ${
            isCream ? 'bg-white/80 border-slate-200' : 'bg-[#090F1C]/80 border-white/5'
          }`}>
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 font-mono font-bold text-xs">
              01
            </div>
            <h3 className={`text-sm font-bold ${isCream ? 'text-slate-900' : 'text-white'}`}>{t.step1Title}</h3>
            <p className={`text-xs leading-relaxed ${isCream ? 'text-slate-600' : 'text-slate-400'}`}>
              {t.step1Desc}
            </p>
          </div>

          <div className={`p-4 sm:p-5 rounded-3xl border space-y-2 transition-all ${
            isCream ? 'bg-white/80 border-slate-200' : 'bg-[#090F1C]/80 border-white/5'
          }`}>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono font-bold text-xs">
              02
            </div>
            <h3 className={`text-sm font-bold ${isCream ? 'text-slate-900' : 'text-white'}`}>{t.step2Title}</h3>
            <p className={`text-xs leading-relaxed ${isCream ? 'text-slate-600' : 'text-slate-400'}`}>
              {t.step2Desc}
            </p>
          </div>

          <div className={`p-4 sm:p-5 rounded-3xl border space-y-2 transition-all ${
            isCream ? 'bg-white/80 border-slate-200' : 'bg-[#090F1C]/80 border-white/5'
          }`}>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-mono font-bold text-xs">
              03
            </div>
            <h3 className={`text-sm font-bold ${isCream ? 'text-slate-900' : 'text-white'}`}>{t.step3Title}</h3>
            <p className={`text-xs leading-relaxed ${isCream ? 'text-slate-600' : 'text-slate-400'}`}>
              {t.step3Desc}
            </p>
          </div>
        </section>

        {/* Section F: Minimal Copilot Introduction */}
        <section className={`p-4 sm:p-5 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl ${
          isCream 
            ? 'bg-gradient-to-r from-teal-50/50 via-white to-emerald-50/50 border-teal-200' 
            : 'bg-gradient-to-r from-[#0C1628] via-[#091122] to-[#080E1C] border-teal-500/20'
        }`}>
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider">{t.copilotBadge}</div>
              <h4 className={`text-sm font-bold mt-0.5 ${isCream ? 'text-slate-900' : 'text-white'}`}>{t.copilotTitle}</h4>
              <p className={`text-xs ${isCream ? 'text-slate-600' : 'text-slate-400'}`}>
                {t.copilotDesc}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setCopilotOpen(true)}
            aria-label={t.copilotBtn}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-300 font-bold text-xs flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer"
          >
            <span>{t.copilotBtn}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer className={`relative z-10 px-4 sm:px-8 lg:px-12 py-4 border-t text-center text-[11px] font-mono ${
        isCream ? 'border-slate-200 text-slate-500' : 'border-white/5 text-slate-500'
      }`}>
        {t.footerRights}
      </footer>
    </div>
  );
};

export default Welcome;
