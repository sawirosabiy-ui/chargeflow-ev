import React, { useState, useTransition } from 'react';
import { 
  Zap, 
  ArrowRight, 
  ChevronDown, 
  Check, 
  Globe, 
  Battery, 
  Sliders, 
  Car,
  RotateCw,
  Sparkles,
  MapPin,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useChargeFlowStore } from '../store/useChargeFlowStore';
import { AVAILABLE_CARS, CarSpec } from '../data/cars';
import { ShowroomStage } from '../components/ShowroomStage';
import { Language } from '../types';
import { useTranslation } from '../localization/useTranslation';

export const Welcome: React.FC = () => {
  const { t } = useTranslation();
  const setView = useChargeFlowStore((s) => s.setView);
  const user = useChargeFlowStore((s) => s.user);
  const language = useChargeFlowStore((s) => s.language);
  const setLanguage = useChargeFlowStore((s) => s.setLanguage);
  const selectCar = useChargeFlowStore((s) => s.selectCar);
  const storedVehicle = useChargeFlowStore((s) => s.vehicle);
  const openAuthModal = useChargeFlowStore((s) => s.openAuthModal);

  const [isPending, startTransition] = useTransition();
  const initialCar = AVAILABLE_CARS.find((c) => c.id === storedVehicle.id) || AVAILABLE_CARS[0];
  const [selectedCar, setSelectedCar] = useState<CarSpec>(initialCar);
  const [startingSoc, setStartingSoc] = useState(storedVehicle.batterySoc || 38);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const languages: { code: Language; label: string }[] = [
    { code: 'EN', label: 'English' },
    { code: 'አማ', label: 'አማርኛ' },
    { code: 'ORM', label: 'Afaan Oromoo' },
    { code: 'TIR', label: 'ትግርኛ' },
  ];

  const handleSelectCar = (car: CarSpec) => {
    selectCar(car);
    startTransition(() => {
      setSelectedCar(car);
    });
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

  const baseRange = parseInt(selectedCar.range) || 405;
  const estimatedRange = Math.round(baseRange * (startingSoc / 100));

  return (
    <div className="relative min-h-screen w-full bg-[#040711] text-white overflow-x-hidden font-sans select-none flex flex-col justify-between">
      {/* 1. Cinematic Background Elements */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 pointer-events-none"
        style={{ backgroundImage: `url('/images/showroom-bg.jpg')` }}
      />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#040711] via-[#040711]/80 to-[#040711] pointer-events-none" />
      <div className="fixed -top-40 -left-40 w-96 h-96 rounded-full bg-teal-500/10 blur-[120px] pointer-events-none" />
      <div className="fixed -bottom-40 -right-40 w-96 h-96 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />

      {/* 2. Top Header Navigation Bar (Compact & Responsive) */}
      <header className="relative z-30 px-4 sm:px-8 lg:px-12 py-3.5 sm:py-4 flex items-center justify-between border-b border-white/5 backdrop-blur-xl bg-[#040711]/60">
        {/* Brand Logo */}
        <div 
          onClick={() => setView('welcome')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#2DD4BF] to-[#10B981] flex items-center justify-center shadow-[0_0_20px_rgba(45,212,191,0.4)] group-hover:scale-105 transition-transform">
            <Zap className="w-4 h-4 text-slate-950 fill-slate-950" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-widest text-white leading-none">CHARGEFLOW</span>
            <span className="text-[8px] font-mono tracking-widest text-[#2DD4BF] mt-0.5">EV INTELLIGENCE</span>
          </div>
        </div>

        {/* Right Actions: Language & Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-teal-500/40 text-xs font-semibold text-slate-200 transition-all cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-teal-400" />
              <span className="font-mono">{language}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 rounded-2xl bg-[#0C1220] border border-white/10 shadow-2xl p-1 z-50 space-y-0.5">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs flex items-center justify-between cursor-pointer ${
                      language === l.code
                        ? 'bg-teal-500/20 text-teal-300 font-bold'
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
            onClick={handleSignInClick}
            className="px-3.5 py-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition-all hover:scale-105 cursor-pointer flex items-center gap-1.5"
          >
            <span>{user.isAuthenticated ? (user.name ? user.name.split(' ')[0] : 'Cockpit') : t.signIn}</span>
            {user.isAuthenticated && <span className="w-2 h-2 rounded-full bg-emerald-400"></span>}
          </button>
        </div>
      </header>

      {/* 3. Main Body Container */}
      <main className="relative z-10 flex-1 flex flex-col justify-between max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-12 py-6 sm:py-8 space-y-8">
        
        {/* Section A: Hero Typography (Apple Automotive Style) */}
        <section className="text-center max-w-3xl mx-auto space-y-3 pt-2 sm:pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-[10px] font-mono tracking-widest uppercase font-bold shadow-[0_0_15px_rgba(45,212,191,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            <span>ETHIOPIA'S PREMIER EV NETWORK</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-[1.1]">
            YOUR EV. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-400 to-teal-200">
              READY WHEN YOU ARE.
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Smart charging for electric mobility in Ethiopia. Ultra-fast 120kW hubs, real-time bay reservations, and underbody wireless power.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleGetStarted}
              className="px-7 py-3 rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_25px_rgba(45,212,191,0.4)] transition-all hover:scale-105 cursor-pointer"
            >
              <span>{user.isAuthenticated ? 'Open Cockpit' : 'Get Started'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setView('find_charge')}
              className="px-6 py-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-white/15 text-xs font-bold text-white transition-all hover:scale-105 cursor-pointer flex items-center gap-2"
            >
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              <span>Explore Stations</span>
            </button>
          </div>
        </section>

        {/* Section B: 3D Vehicle Stage (Hero Component matching IMPROVED design) */}
        <section className="relative w-full rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-[#060C17]/95 via-[#040813] to-[#02050B] shadow-2xl p-4 sm:p-6 flex flex-col items-center">
          
          {/* Top Row: Left Subtle 360° VIEW badge | Right Brand & Car Name */}
          <div className="w-full flex items-start justify-between z-20 pointer-events-none pb-2">
            {/* Top-Left: Subtle 360° VIEW Indicator with Rotate Icon */}
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-left">
              <RotateCw className="w-4 h-4 text-teal-400 shrink-0" />
              <div>
                <div className="text-[10px] font-mono font-black text-teal-300 uppercase tracking-widest leading-none">
                  360° VIEW
                </div>
                <div className="text-[9px] text-slate-400 mt-0.5 leading-none">
                  Drag to rotate
                </div>
              </div>
            </div>

            {/* Top-Right: Brand & Car Model Name */}
            <div className="text-right">
              <div className="text-[11px] font-mono font-black text-teal-400 uppercase tracking-widest">
                {selectedCar.brand}
              </div>
              <div className="text-sm sm:text-base font-black text-white tracking-wide">
                {selectedCar.name}
              </div>
            </div>
          </div>

          {/* 3D Canvas Box: Prominent Hero Car (Close-up, crisp, no clutter) */}
          <div className="w-full h-72 sm:h-84 lg:h-[420px] relative flex items-center justify-center -my-2 sm:my-0">
            <ShowroomStage selectedCar={selectedCar} autoRotate={true} hideTitle={true} />
          </div>

          {/* Live Specs Ribbon (Battery SoC, Est. Range, Powertrain) */}
          <div className="w-full max-w-2xl grid grid-cols-3 gap-2.5 sm:gap-4 pt-3 border-t border-white/10 text-center font-mono z-10">
            <div className="p-2.5 sm:p-3 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="text-[10px] text-slate-400 font-sans font-medium">Battery SoC</div>
              <div className="text-sm sm:text-base font-black text-emerald-400 mt-0.5">{startingSoc}%</div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="text-[10px] text-slate-400 font-sans font-medium">Est. Range</div>
              <div className="text-sm sm:text-base font-black text-white mt-0.5">{estimatedRange} km</div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="text-[10px] text-slate-400 font-sans font-medium">Powertrain</div>
              <div className="text-sm sm:text-base font-black text-teal-300 mt-0.5">{selectedCar.drive}</div>
            </div>
          </div>

          {/* Vehicle Model Switcher Carousel */}
          <div className="w-full max-w-3xl pt-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start sm:justify-center">
              {AVAILABLE_CARS.map((car) => (
                <button
                  key={car.id}
                  onClick={() => handleSelectCar(car)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border flex items-center gap-1.5 ${
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

        {/* Section C: Intelligent Charging 3-Step Flow */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-5 rounded-3xl bg-[#090F1C]/80 border border-white/5 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 font-mono font-bold text-sm">
              01
            </div>
            <h3 className="text-sm font-bold text-white">Find a Station</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explore 120kW DC fast charging stations across Addis Ababa with real-time bay availability.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-[#090F1C]/80 border border-white/5 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono font-bold text-sm">
              02
            </div>
            <h3 className="text-sm font-bold text-white">Reserve Your Slot</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Guarantee your bay in advance with a 50 ETB deposit directly from your ChargeFlow wallet.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-[#090F1C]/80 border border-white/5 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-mono font-bold text-sm">
              03
            </div>
            <h3 className="text-sm font-bold text-white">Charge Seamlessly</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pull onto the charging pad. Monitor real-time energy flow and completed session records.
            </p>
          </div>
        </section>

        {/* Section D: Minimal Copilot Introduction */}
        <section className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#0C1628] via-[#091122] to-[#080E1C] border border-teal-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider">AI EV Assistant</div>
              <h4 className="text-sm font-bold text-white mt-0.5">ChargeFlow AI Copilot</h4>
              <p className="text-xs text-slate-400">
                Context-aware guidance for charging speeds, battery preconditioning, and route planning.
              </p>
            </div>
          </div>

          <button
            onClick={() => useChargeFlowStore.getState().setCopilotOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-300 font-bold text-xs flex items-center gap-2 transition-all shrink-0 cursor-pointer"
          >
            <span>Ask AI Copilot</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-4 sm:px-8 lg:px-12 py-4 border-t border-white/5 text-center text-slate-500 text-[11px] font-mono">
        ChargeFlow Ethiopia © 2026 • Real-world EV Intelligence & Clean Energy
      </footer>
    </div>
  );
};

export default Welcome;
