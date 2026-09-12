import React, { useState } from "react";
import { 
  Globe, 
  ChevronDown, 
  PanelLeftClose, 
  PanelLeftOpen, 
  Bell, 
  Check,
  ChevronDown as ArrowDown,
  Sparkles,
  Menu,
  Zap,
  Moon,
  Sun
} from "lucide-react";
import { useChargeFlowStore } from "../../store/useChargeFlowStore";
import { Language } from "../../types";
import { AVAILABLE_CARS } from "../../data/cars";
import { VehicleCutout } from "../vehicle/VehicleCutout";
import { useTranslation } from "../../localization/useTranslation";
import { getBatteryVisualState } from "../../utils/batteryVisualState";

export const Header: React.FC = () => {
  const user = useChargeFlowStore((s) => s.user);
  const vehicle = useChargeFlowStore((s) => s.vehicle);
  const selectCar = useChargeFlowStore((s) => s.selectCar);
  const isSidebarOpen = useChargeFlowStore((s) => s.isSidebarOpen);
  const toggleSidebar = useChargeFlowStore((s) => s.toggleSidebar);
  const toggleCopilot = useChargeFlowStore((s) => s.toggleCopilot);
  const setView = useChargeFlowStore((s) => s.setView);
  const theme = useChargeFlowStore((s) => s.theme);
  const toggleTheme = useChargeFlowStore((s) => s.toggleTheme);
  const openAuthModal = useChargeFlowStore((s) => s.openAuthModal);
  const { t, language, setLanguage } = useTranslation();

  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [carDropdownOpen, setCarDropdownOpen] = useState(false);

  const isCream = theme === "cream";
  const batteryVisual = getBatteryVisualState(vehicle.batterySoc || 66);

  const languages: { code: Language; label: string }[] = [
    { code: "EN", label: "English" },
    { code: "አማ", label: "አማርኛ" },
    { code: "ORM", label: "Afaan Oromoo" },
    { code: "TIR", label: "ትግርኛ" },
  ];

  return (
    <header className={`h-16 px-3 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 select-none shrink-0 border-b transition-colors duration-300 ${
      isCream ? "bg-[#FAF8F5] border-stone-300 text-stone-900" : "bg-[#06090F] border-white/5 text-slate-100"
    }`}>
      {/* Left: Mobile Hamburger / Desktop Sidebar Toggle & LIVE Status Badge */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Hamburger Button (< md) */}
        <button
          onClick={toggleSidebar}
          className={`p-2 rounded-xl border md:hidden flex items-center justify-center transition-all cursor-pointer ${
            isCream
              ? "bg-white border-stone-300 text-stone-800 shadow-sm"
              : "bg-[#101E2E] border-teal-500/40 text-teal-300 shadow-[0_0_12px_rgba(45,212,191,0.25)]"
          }`}
          title="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop Sidebar Toggle (>= md) */}
        <button
          onClick={toggleSidebar}
          className={`hidden md:flex p-2 rounded-xl border transition-all items-center justify-center cursor-pointer ${
            isSidebarOpen 
              ? isCream
                ? "bg-white border-stone-300 text-stone-800 shadow-sm"
                : "bg-[#0B111A] border-white/10 text-teal-400 shadow-[0_0_12px_rgba(45,212,191,0.2)]" 
              : isCream
                ? "bg-stone-100 border-stone-300 text-stone-700"
                : "bg-[#101E2E] border-teal-500/40 text-teal-300 shadow-[0_0_15px_rgba(45,212,191,0.3)] hover:scale-105"
          }`}
          title={isSidebarOpen ? "Hide Navigation Sidebar" : "Show Navigation Sidebar"}
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="w-4 h-4" />
          ) : (
            <PanelLeftOpen className="w-4 h-4" />
          )}
        </button>

        {/* Live System Status Pill */}
        <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-2xl border text-xs ${
          isCream ? "bg-white border-stone-200 text-stone-800 shadow-sm" : "bg-[#0B111A] border-white/5 text-slate-200"
        }`}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: batteryVisual.color }} />
          <span className="font-bold text-xs font-mono">LIVE</span>
          <span className={`text-[10px] hidden md:inline ${isCream ? "text-stone-500" : "text-slate-400"}`}>
            {t[batteryVisual.labelKey]}
          </span>
        </div>
      </div>

      {/* Center: Vehicle Name & Quick Switcher Dropdown */}
      <div className="relative">
        <button
          onClick={() => setCarDropdownOpen(!carDropdownOpen)}
          className="flex flex-col items-center group cursor-pointer"
        >
          <div className="flex items-center gap-1.5">
            <span className={`font-black text-xs sm:text-sm tracking-wider uppercase transition-colors ${
              isCream ? "text-stone-900 group-hover:text-emerald-700" : "text-white group-hover:text-teal-400"
            }`}>
              {vehicle.model}
            </span>
            <ArrowDown className={`w-3 h-3 transition-transform ${
              carDropdownOpen ? "rotate-180 text-teal-400" : isCream ? "text-stone-500" : "text-slate-400"
            }`} />
          </div>
          <span className={`text-[10px] font-mono tracking-wide ${isCream ? "text-stone-500" : "text-slate-400"}`}>
            {vehicle.plate || "ET-3-A49281"}
          </span>
        </button>

        {carDropdownOpen && (
          <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 border rounded-2xl shadow-2xl p-1.5 z-50 backdrop-blur-2xl space-y-1 ${
            isCream ? "bg-white border-stone-300 text-stone-900" : "bg-[#0E1522] border-white/10 text-slate-100"
          }`}>
            {AVAILABLE_CARS.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  selectCar(c);
                  setCarDropdownOpen(false);
                }}
                className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between gap-2.5 transition-colors cursor-pointer ${
                  vehicle.id === c.id
                    ? isCream
                      ? "bg-emerald-100 text-emerald-900 font-bold"
                      : "bg-teal-500/20 text-teal-300 font-bold"
                    : isCream
                      ? "text-stone-700 hover:bg-stone-100"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <VehicleCutout 
                    modelId={c.id} 
                    modelName={c.name} 
                    paintColor={c.paintColor} 
                    className="w-10 h-6 shrink-0" 
                  />
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{c.name}</div>
                    <div className={`text-[10px] font-mono ${isCream ? "text-stone-500" : "text-slate-400"}`}>
                      {c.capacity} · {c.drive}
                    </div>
                  </div>
                </div>
                {vehicle.id === c.id && <Check className="w-3.5 h-3.5 text-teal-400 shrink-0" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Actions: 3D Cockpit, Copilot, Language, Theme, Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Cockpit shortcut button (Desktop only, hidden on mobile to avoid overcrowding) */}
        <button
          onClick={() => setView("cockpit")}
          className={`hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition-all hover:scale-105 cursor-pointer ${
            isCream
              ? "bg-emerald-600 text-white border-emerald-700 shadow-sm"
              : "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.25)]"
          }`}
          title={t.cockpit}
        >
          <Zap className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
          <span>{t.cockpit}</span>
        </button>

        {/* AI Copilot Fast Trigger */}
        <button
          onClick={toggleCopilot}
          className={`hidden xs:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition-all hover:scale-105 cursor-pointer ${
            isCream
              ? "bg-white border-stone-300 text-stone-800 shadow-sm hover:border-emerald-600"
              : "bg-[#0C172B] border-teal-500/40 text-teal-300 shadow-[0_0_15px_rgba(45,212,191,0.2)] hover:border-teal-400"
          }`}
          title="ChargeFlow AI Copilot"
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
          <span className="hidden md:inline">AI Copilot</span>
        </button>

        {/* Language Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl border text-xs transition-all cursor-pointer ${
              isCream ? "bg-white border-stone-300 text-stone-800 shadow-sm" : "bg-[#0B111A] border-white/10 text-slate-200 hover:bg-white/5"
            }`}
            title="Select Language"
          >
            <Globe className="w-3.5 h-3.5 text-teal-400" />
            <span className="font-semibold font-mono text-xs">{language}</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>

          {langDropdownOpen && (
            <div className={`absolute right-0 mt-2 w-36 border rounded-2xl shadow-2xl p-1 z-50 space-y-1 ${
              isCream ? "bg-white border-stone-300 text-stone-900" : "bg-[#0E1522] border-white/10 text-slate-100"
            }`}>
              {languages.map((item) => (
                <button
                  key={item.code}
                  onClick={() => {
                    setLanguage(item.code);
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 text-xs rounded-xl flex items-center justify-between cursor-pointer ${
                    language === item.code
                      ? isCream
                        ? "bg-emerald-100 text-emerald-900 font-bold"
                        : "bg-teal-500/20 text-teal-300 font-bold"
                      : isCream
                        ? "text-stone-700 hover:bg-stone-100"
                        : "text-slate-300 hover:bg-white/5"
                  }`}
                >
                  <span>{item.label}</span>
                  {language === item.code && <Check className="w-3.5 h-3.5 text-teal-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-xl border transition-all cursor-pointer ${
            isCream ? "bg-white border-stone-300 text-stone-800 shadow-sm hover:bg-stone-100" : "bg-[#0B111A] border-white/10 text-slate-300 hover:text-white"
          }`}
          title={`Switch to ${isCream ? "Dark" : "Cream"} Theme`}
        >
          {isCream ? (
            <Sun className="w-4 h-4 text-amber-600" />
          ) : (
            <Moon className="w-4 h-4 text-teal-400" />
          )}
        </button>

        {/* User Profile Avatar Circle */}
        <div 
          onClick={() => openAuthModal("signin")}
          className="w-8 h-8 rounded-full bg-emerald-950/80 border border-emerald-500/40 p-0.5 shadow-md cursor-pointer hover:scale-105 transition-transform flex items-center justify-center shrink-0"
          title="Account / Sign In"
        >
          <span className="text-emerald-400 font-bold text-xs font-mono">
            {user.name ? user.name.slice(0, 2).toUpperCase() : "AT"}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
