import React, { useState, useTransition } from 'react';
import { 
  Zap, 
  ArrowRight, 
  ChevronDown, 
  Check, 
  ShieldCheck, 
  Leaf, 
  Globe, 
  Battery, 
  Milestone, 
  Sliders, 
  Info,
  Car
} from 'lucide-react';
import { useChargeFlowStore } from '../store/useChargeFlowStore';
import { AVAILABLE_CARS, CarSpec, searchCarsWithSmartMatch } from '../data/cars';
import { AuthModal } from '../components/auth/AuthModal';
import { Search, Sparkles } from 'lucide-react';
import { ShowroomStage } from '../components/ShowroomStage';
import { VehicleCutout } from '../components/vehicle/VehicleCutout';
import { Language } from '../types';
import { useTranslation } from '../localization/useTranslation';

export const Welcome: React.FC = () => {
  const { t } = useTranslation();
  const setView = useChargeFlowStore((s) => s.setView);
  const updateUserBatterySoc = useChargeFlowStore((s) => s.updateUserBatterySoc);
  const language = useChargeFlowStore((s) => s.language);
  const setLanguage = useChargeFlowStore((s) => s.setLanguage);

  const selectCar = useChargeFlowStore((s) => s.selectCar);
  const storedVehicle = useChargeFlowStore((s) => s.vehicle);
  const openAuthModal = useChargeFlowStore((s) => s.openAuthModal);
  const theme = useChargeFlowStore((s) => s.theme);
  const toggleTheme = useChargeFlowStore((s) => s.toggleTheme);
  const [carSearchQuery, setCarSearchQuery] = useState('');

  // React 18 useTransition for stutter-free 3D car model switching
  const [isPending, startTransition] = useTransition();
  const initialCar = AVAILABLE_CARS.find((c) => c.id === storedVehicle.id) || AVAILABLE_CARS[0];
  const [selectedCar, setSelectedCar] = useState<CarSpec>(initialCar);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [startingSoc, setStartingSoc] = useState(storedVehicle.batterySoc || 75);
  const searchResult = React.useMemo(() => searchCarsWithSmartMatch(carSearchQuery), [carSearchQuery]);

  const languages: { code: Language; label: string }[] = [
    { code: 'EN', label: 'EN' },
    { code: 'አማ', label: 'አማ' },
    { code: 'ORM', label: 'ORM' },
    { code: 'TIR', label: 'TIR' },
  ];

  const handleSelectCar = (car: CarSpec) => {
    setIsDropdownOpen(false);
    selectCar(car);
    startTransition(() => {
      setSelectedCar(car);
    });
  };

  const handleFinishOnboarding = () => {
    selectCar(selectedCar);
    updateUserBatterySoc(startingSoc);
    useChargeFlowStore.setState((state) => ({
      user: {
        ...state.user,
        name: 'Abiy Tesfaye',
        phone: '+251 91 234 5678',
        isAuthenticated: true,
      },
    }));
    setView('cockpit');
  };

  const handleQuickSignIn = () => {
    useChargeFlowStore.setState((state) => ({
      user: { ...state.user, isAuthenticated: true },
    }));
    setView('cockpit');
  };

  // Estimated remaining range based on starting battery level
  const baseRange = parseInt(selectedCar.range) || 405;
  const estimatedRange = Math.round(baseRange * (startingSoc / 100));

  return (
    <div className="relative min-h-screen w-full bg-[#040711] text-white overflow-y-auto lg:overflow-hidden select-none font-sans flex flex-col justify-between">
      {/* 1. Cinematic Night Showroom Terrace Backdrop */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-95 pointer-events-none"
        style={{ backgroundImage: `url('/images/showroom-bg.jpg')` }}
      />
      {/* Atmospheric Vignette Gradients for High Readability & 3D Contrast */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#040711]/90 via-transparent to-[#040711]/60 pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#040711]/90 via-transparent to-[#040711]/90 pointer-events-none" />

      {/* 2. Full-Bleed 3D Showroom Stage (3D Car & Turntable) */}
      <div className="hidden lg:block absolute inset-0 z-0 w-full h-full min-h-[300px]">
        <ShowroomStage selectedCar={selectedCar} autoRotate={true} hideTitle={true} />
      </div>

      {/* 3. Top-Level Layered UI Wrapper (Floating above the 3D scene) */}
      <div className="relative z-10 w-full min-h-screen flex flex-col justify-between pointer-events-none">
        {/* Top Header Navigation Bar */}
        <header className="px-4 sm:px-8 lg:px-12 py-3 sm:py-4 flex items-center justify-between pointer-events-auto">
          {/* Brand Logo with Teal Glow Bolt */}
          <div className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group" onClick={() => setView('welcome')}>
            <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-xl bg-gradient-to-tr from-[#2DD4BF] to-[#10B981] flex items-center justify-center shadow-[0_0_20px_rgba(45,212,191,0.5)] group-hover:scale-105 transition-transform">
              <Zap className="w-4 sm:w-5 h-4 sm:h-5 text-slate-950 fill-slate-950" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-black tracking-widest text-white leading-none">CHARGEFLOW</span>
              <span className="text-[8px] sm:text-[9px] font-mono tracking-widest text-[#2DD4BF] mt-0.5">EV INTELLIGENCE</span>
            </div>
          </div>

          {/* Right Actions: Language Selector & Sign In */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button 
              onClick={() => {
                const nextIdx = (languages.findIndex(l => l.code === language) + 1) % languages.length;
                setLanguage(languages[nextIdx].code);
              }}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-[#0B1220]/75 border border-white/10 hover:border-white/25 text-xs font-medium text-slate-200 backdrop-blur-xl transition-all shadow-[0_4px_16px_rgba(0,0,0,0.3)] hover:bg-[#0E1729]"
            >
              <Globe className="w-3.5 h-3.5 text-[#2DD4BF]" />
              <span className="font-semibold">{language}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            <button
              onClick={handleQuickSignIn}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-bold text-white backdrop-blur-xl transition-all shadow-[0_4px_16px_rgba(0,0,0,0.3)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              {t.signIn}
            </button>
          </div>
        </header>

        {/* Main Split Layout: Left Hero Safe Zone (4 cols) + Center Open Interactive Car Stage (5 cols) + Right Glass Setup Panel (3 cols) */}
        <main className="flex-1 px-4 sm:px-8 lg:px-12 py-4 flex items-center">
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* ZONE 1: Left Column - Welcome Copy, Branding, and Value Pillars (4 Cols) */}
            <div className="lg:col-span-4 max-w-sm space-y-3 sm:space-y-4 pointer-events-auto mx-auto lg:mx-0">
              {/* Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2DD4BF]/10 border border-[#2DD4BF]/30 text-[#2DD4BF] text-[9px] sm:text-[10px] font-mono tracking-[0.2em] uppercase font-bold shadow-[0_0_15px_rgba(45,212,191,0.2)] backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-pulse"></span>
                {t.welcomeTitle}
              </div>

              {/* Large Title & Tagline */}
              <div className="space-y-1">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-none drop-shadow-2xl">
                  CHARGEFLOW
                </h1>
                <p className="text-sm sm:text-base lg:text-lg font-bold bg-gradient-to-r from-[#2DD4BF] via-teal-300 to-emerald-400 bg-clip-text text-transparent drop-shadow">
                  {t.connectedAndReady}
                </p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed drop-shadow-md">
                {t.welcomeSubtitle}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => openAuthModal('signup')}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2DD4BF] to-[#14B8A6] hover:from-[#38BDF8] hover:to-[#2DD4BF] text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(45,212,191,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <span>{t.createAccount}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => openAuthModal('signin')}
                  className="px-4 py-2.5 rounded-xl bg-[#0B1220]/70 hover:bg-[#0E1729] border border-white/10 hover:border-white/20 text-white font-bold text-xs backdrop-blur-xl transition-all shadow-md cursor-pointer"
                >
                  {t.signIn}
                </button>
              </div>

              {/* 3 Value Pillars in Refined Glass Card */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-[#0B1220]/70 backdrop-blur-2xl border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)]">
                <div className="flex flex-col items-center text-center p-1.5">
                  <div className="w-6 h-6 rounded-lg bg-[#2DD4BF]/10 border border-[#2DD4BF]/25 flex items-center justify-center mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2DD4BF]" />
                  </div>
                  <span className="text-white font-bold text-[11px] leading-tight">Secure</span>
                  <span className="text-[8px] text-slate-400 mt-0.5">Encrypted</span>
                </div>

                <div className="flex flex-col items-center text-center p-1.5 border-x border-white/5">
                  <div className="w-6 h-6 rounded-lg bg-[#2DD4BF]/10 border border-[#2DD4BF]/25 flex items-center justify-center mb-1">
                    <Zap className="w-3.5 h-3.5 text-[#2DD4BF]" />
                  </div>
                  <span className="text-white font-bold text-[11px] leading-tight">Smart</span>
                  <span className="text-[8px] text-slate-400 mt-0.5">AI telemetry</span>
                </div>

                <div className="flex flex-col items-center text-center p-1.5">
                  <div className="w-6 h-6 rounded-lg bg-[#2DD4BF]/10 border border-[#2DD4BF]/25 flex items-center justify-center mb-1">
                    <Leaf className="w-3.5 h-3.5 text-[#2DD4BF]" />
                  </div>
                  <span className="text-white font-bold text-[11px] leading-tight">Clean</span>
                  <span className="text-[8px] text-slate-400 mt-0.5">Zero-emission</span>
                </div>
              </div>
            </div>

            {/* ZONE 2: Dedicated Center Showcase Space for Chosen Car & Quick Choice Selector (5 Cols) */}
            <div className="lg:col-span-5 w-full flex flex-col items-center justify-between pointer-events-auto py-2 space-y-3 z-20">
              {/* Prominent Chosen Vehicle Header */}
              <div className="flex flex-col items-center text-center space-y-1 bg-[#070D1A]/80 backdrop-blur-xl border border-white/10 px-5 py-2.5 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#2DD4BF] animate-pulse" />
                  <span className="text-[10px] font-mono tracking-[0.2em] text-[#2DD4BF] font-bold uppercase">
                    CHOSEN VEHICLE
                  </span>
                  {selectedCar.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-[9px] font-semibold text-slate-300 border border-white/10">
                      {selectedCar.badge}
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase">
                  {selectedCar.name}
                </h2>
              </div>

              {/* Mobile/Tablet dedicated 3D interactive viewport */}
              <div className="block lg:hidden w-full h-64 sm:h-80 relative rounded-3xl overflow-hidden border border-white/10 bg-[#060A14]/70 backdrop-blur-sm shadow-2xl">
                <ShowroomStage selectedCar={selectedCar} autoRotate={true} hideTitle={true} />
              </div>

              {/* Quick Car Choice Switcher Pills */}
              <div className="w-full space-y-1.5">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase tracking-wider">
                    Quick Switch Model
                  </span>
                  <span className="text-[9px] font-mono text-[#2DD4BF]">
                    {AVAILABLE_CARS.length} EV Models
                  </span>
                </div>
                
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
                  {AVAILABLE_CARS.map((car) => {
                    const isSelected = selectedCar.id === car.id;
                    return (
                      <button
                        key={car.id}
                        type="button"
                        onClick={() => handleSelectCar(car)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all shrink-0 cursor-pointer ${
                          isSelected
                            ? 'bg-[#2DD4BF] text-slate-950 border-[#2DD4BF] shadow-[0_0_15px_rgba(45,212,191,0.5)] scale-105'
                            : 'bg-[#0B1322]/80 hover:bg-white/10 text-slate-300 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <Car className="w-3.5 h-3.5" />
                        <span className="text-[11px] whitespace-nowrap">{car.name.replace(/^(BYD|Tesla|Audi|BMW|Mercedes)\s+/, '')}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Floating Bottom Telemetry / Spec Ribbon for Chosen Car */}
              <div className="w-full grid grid-cols-4 gap-1.5 p-2.5 rounded-2xl bg-[#060A14]/85 backdrop-blur-xl border border-white/10 shadow-lg text-center">
                <div className="flex flex-col items-center">
                  <span className="text-[9px] text-slate-400 font-mono">BATTERY</span>
                  <span className="text-xs font-black text-white font-mono">{selectedCar.capacity}</span>
                </div>
                <div className="flex flex-col items-center border-l border-white/5">
                  <span className="text-[9px] text-slate-400 font-mono">RANGE</span>
                  <span className="text-xs font-black text-[#2DD4BF] font-mono">{selectedCar.range}</span>
                </div>
                <div className="flex flex-col items-center border-l border-white/5">
                  <span className="text-[9px] text-slate-400 font-mono">0-100</span>
                  <span className="text-xs font-black text-white font-mono">{selectedCar.acceleration}</span>
                </div>
                <div className="flex flex-col items-center border-l border-white/5">
                  <span className="text-[9px] text-slate-400 font-mono">DRIVE</span>
                  <span className="text-xs font-black text-white font-mono truncate max-w-[65px]">{selectedCar.drive.split(' ')[0]}</span>
                </div>
              </div>
            </div>

            {/* ZONE 3: Right Column - Frosted Glassmorphism Setup Panel (3 Cols) */}
            <div className="lg:col-span-3 max-w-[325px] w-full mx-auto lg:ml-auto lg:mr-0 pointer-events-auto">
              <div className="bg-gradient-to-b from-[#0B132B]/85 via-[#080E1C]/80 to-[#050A14]/90 backdrop-blur-3xl border border-white/12 rounded-3xl p-4 sm:p-4.5 shadow-[0_20px_50px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.15)] space-y-3">
                {/* Step Timeline Header */}
                <div className="relative flex items-center justify-between pb-1">
                  <div className="absolute top-2.5 left-2 right-2 h-[2px] bg-slate-800/80 -z-0 rounded-full"></div>
                  <div className="absolute top-2.5 left-2 w-1/3 h-[2px] bg-gradient-to-r from-[#2DD4BF] to-emerald-400 -z-0 rounded-full shadow-[0_0_8px_#2DD4BF]"></div>

                  <div className="flex flex-col items-center gap-0.5 z-10">
                    <span className="text-[9px] font-mono text-slate-400 font-medium">01</span>
                    <span className="text-[8px] text-slate-400 font-medium">Profile</span>
                  </div>

                  <div className="flex flex-col items-center gap-0.5 z-10">
                    <span className="text-[9px] font-mono font-bold text-[#2DD4BF] drop-shadow-[0_0_8px_rgba(45,212,191,0.8)]">02</span>
                    <span className="text-[8px] font-bold text-[#2DD4BF]">Vehicle</span>
                  </div>

                  <div className="flex flex-col items-center gap-0.5 z-10">
                    <span className="text-[9px] font-mono text-slate-600">03</span>
                    <span className="text-[8px] text-slate-600 font-medium">Battery</span>
                  </div>

                  <div className="flex flex-col items-center gap-0.5 z-10">
                    <span className="text-[9px] font-mono text-slate-600">04</span>
                    <span className="text-[8px] text-slate-600 font-medium">Ready</span>
                  </div>
                </div>

                {/* Sub-step Title */}
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono tracking-widest text-[#2DD4BF] font-semibold uppercase">
                      STEP 02 / 04
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">{t.settings}</span>
                  </div>
                  <h2 className="text-lg font-black text-white tracking-tight leading-tight mt-0.5">
                    {t.vehicleModelLabel}
                  </h2>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {t.searchCar}
                  </p>
                </div>

                {/* EV Model Selector Dropdown with Car Thumbnail */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#060A14]/80 border border-white/10 hover:border-[#2DD4BF]/50 text-xs text-white transition-all shadow-inner group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <VehicleCutout 
                        modelId={selectedCar.id} 
                        modelName={selectedCar.name} 
                        paintColor={selectedCar.paintColor} 
                        className="w-10 h-6 shrink-0" 
                      />
                      <span className="font-bold text-white text-xs block leading-tight truncate max-w-[150px]">{selectedCar.name}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-[#2DD4BF]' : ''}`} />
                  </button>

                  {/* Dropdown Options Menu with Alphabetical Search & Smart Match */}
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 max-h-72 overflow-y-auto p-2 bg-[#090F1C] border border-teal-500/30 rounded-2xl shadow-2xl backdrop-blur-2xl z-50 space-y-2">
                      {/* Search Bar */}
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-teal-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={carSearchQuery}
                          onChange={(e) => setCarSearchQuery(e.target.value)}
                          placeholder={t.searchCar}
                          className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#050912] border border-white/10 text-xs text-white placeholder:text-slate-500 focus:border-teal-400 focus:outline-none"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>

                      {/* Direct Alphabetical Matches */}
                      <div className="space-y-1 max-h-48 overflow-y-auto">
                        {searchResult.matches.map((car) => {
                          const isSelected = selectedCar.id === car.id;
                          return (
                            <button
                              key={car.id}
                              type="button"
                              onClick={() => {
                                handleSelectCar(car);
                                setCarSearchQuery('');
                              }}
                              className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-all ${
                                isSelected
                                  ? 'bg-[#2DD4BF]/20 text-[#2DD4BF] font-bold border border-[#2DD4BF]/30 shadow-sm'
                                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
                              }`}
                            >
                              <div className="flex items-center gap-2 text-left min-w-0">
                                <VehicleCutout 
                                  modelId={car.id} 
                                  modelName={car.name} 
                                  paintColor={car.paintColor} 
                                  className="w-10 h-6 shrink-0" 
                                />
                                <div className="min-w-0">
                                  <span className="block font-bold text-xs truncate">{car.name}</span>
                                  <span className="text-[10px] text-slate-400">{car.capacity} · {car.drive}</span>
                                </div>
                              </div>
                              {isSelected && <Check className="w-4 h-4 text-[#2DD4BF] shrink-0" />}
                            </button>
                          );
                        })}

                        {/* Smart Reference Recommendation when not directly in stock */}
                        {searchResult.matches.length === 0 && searchResult.referenceMatch && (
                          <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-left space-y-2">
                            <div className="flex items-center gap-1.5 text-teal-300 font-bold text-xs">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Reference Recommendation</span>
                            </div>
                            <p className="text-[11px] text-slate-300 leading-snug">{searchResult.message}</p>
                            <button
                              type="button"
                              onClick={() => {
                                handleSelectCar(searchResult.referenceMatch!);
                                setCarSearchQuery('');
                              }}
                              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 hover:scale-[1.02] transition-all"
                            >
                              <span>Use {searchResult.referenceMatch.name} Profile</span>
                              <ArrowRight className="w-3 h-3 stroke-[3]" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Dynamic 3-Card Spec Matrix */}
                <div className="grid grid-cols-3 gap-1.5">
                  <div className="p-2.5 rounded-xl bg-[#060A14]/70 border border-white/5 flex flex-col items-center justify-center text-center hover:border-white/15 transition-colors">
                    <Battery className="w-3.5 h-3.5 text-[#2DD4BF] mb-1" />
                    <span className="text-[11px] font-black text-white font-mono leading-none">{selectedCar.capacity}</span>
                    <span className="text-[8px] text-slate-400 mt-1 uppercase font-medium">Capacity</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#060A14]/70 border border-white/5 flex flex-col items-center justify-center text-center hover:border-white/15 transition-colors">
                    <Milestone className="w-3.5 h-3.5 text-emerald-400 mb-1" />
                    <span className="text-[11px] font-black text-white font-mono leading-none">{selectedCar.range}</span>
                    <span className="text-[8px] text-slate-400 mt-1 uppercase font-medium">WLTP Range</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#060A14]/70 border border-white/5 flex flex-col items-center justify-center text-center hover:border-white/15 transition-colors">
                    <Sliders className="w-3.5 h-3.5 text-sky-400 mb-1" />
                    <span className="text-[11px] font-black text-white font-mono leading-none">{selectedCar.drive}</span>
                    <span className="text-[8px] text-slate-400 mt-1 uppercase font-medium">Drivetrain</span>
                  </div>
                </div>

                {/* Interactive Battery Slider with Live Charge % & Estimated KM */}
                <div className="space-y-1.5 p-2.5 rounded-xl bg-[#060A14]/60 border border-white/5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-semibold flex items-center gap-1.5 text-[11px]">
                      <Zap className="w-3.5 h-3.5 text-[#2DD4BF]" />
                      <span>{t.batteryStatus}</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-mono">~{estimatedRange} km</span>
                      <span className="text-xs font-black text-[#2DD4BF] font-mono px-1.5 py-0.5 rounded bg-[#2DD4BF]/10 border border-[#2DD4BF]/30">
                        {startingSoc}%
                      </span>
                    </div>
                  </div>

                  <div className="relative pt-1">
                    <input
                      type="range"
                      min="5"
                      max="100"
                      value={startingSoc}
                      onChange={(e) => setStartingSoc(Number(e.target.value))}
                      className="w-full accent-[#2DD4BF] cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
                    />
                    <div className="flex justify-between text-[8px] text-slate-500 font-mono pt-1">
                      <span>5%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>

                {/* Primary CTA Continue Button */}
                <button
                  onClick={handleFinishOnboarding}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#2DD4BF] to-[#14B8A6] hover:from-[#38BDF8] hover:to-[#2DD4BF] text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(45,212,191,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <span>{t.cockpit} • {t.next}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Bottom Segmented Regional Language Selector */}
                <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px]">
                  <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                    <Globe className="w-3.5 h-3.5 text-[#2DD4BF]" />
                    <span>{t.regionalLanguagePref}</span>
                  </div>

                  <div className="flex items-center gap-0.5 bg-slate-950/80 p-0.5 rounded-lg border border-white/5">
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => setLanguage(l.code)}
                        className={`px-2 py-0.5 rounded-md text-[9px] font-bold transition-all ${
                          language === l.code
                            ? 'bg-[#2DD4BF] text-slate-950 shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer Attribution / Links */}
        <footer className="px-4 sm:px-8 lg:px-12 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] sm:text-[11px] text-slate-500 pointer-events-auto text-center sm:text-left">
          <span>&copy; 2026 ChargeFlow Technologies. All rights reserved.</span>
          <div className="flex items-center gap-3 sm:gap-4 font-medium flex-wrap justify-center">
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Privacy Policy</span>
            <span>&bull;</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Terms of Service</span>
            <span>&bull;</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Help Center</span>
          </div>
        </footer>
      </div>
      {/* EV-Vibe Auth Modal */}
      <AuthModal />
    </div>
  );
};

export default Welcome;
