import React from "react";
import { 
  LayoutDashboard,
  Zap, 
  Calendar, 
  Navigation, 
  Clock, 
  MapPin, 
  Settings, 
  ChevronRight, 
  Moon, Sun, 
  Globe, 
  ChevronDown,
  History as HistoryIcon,
  Sparkles,
  X
} from "lucide-react";
import { useChargeFlowStore } from "../../store/useChargeFlowStore";
import { AppView, Language } from "../../types";
import { VehicleCutout } from "../vehicle/VehicleCutout";
import { useTranslation } from "../../localization/useTranslation";
import { getBatteryVisualState } from "../../utils/batteryVisualState";
import { ChargeFlowLogo } from "../brand/ChargeFlowLogo";

export const Sidebar: React.FC = () => {
  const currentView = useChargeFlowStore((s) => s.currentView);
  const setView = useChargeFlowStore((s) => s.setView);
  const user = useChargeFlowStore((s) => s.user);
  const vehicle = useChargeFlowStore((s) => s.vehicle);
  const requireAuth = useChargeFlowStore((s) => s.requireAuth);
  const isSidebarOpen = useChargeFlowStore((s) => s.isSidebarOpen);
  const toggleSidebar = useChargeFlowStore((s) => s.toggleSidebar);
  const toggleCopilot = useChargeFlowStore((s) => s.toggleCopilot);
  const theme = useChargeFlowStore((s) => s.theme);
  const toggleTheme = useChargeFlowStore((s) => s.toggleTheme);
  const { t, language, setLanguage } = useTranslation();

  const isCream = theme === "cream";
  const batteryVisual = getBatteryVisualState(vehicle.batterySoc || 66);

  const navItems: { id: AppView; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: "cockpit", label: t.cockpit, icon: LayoutDashboard },
    { id: "find_charge", label: t.findCharging, icon: MapPin },
    { id: "reservation", label: t.reservation, icon: Calendar },
    { id: "queue", label: t.queue, icon: Clock },
    { id: "charging", label: t.charging, icon: Zap },
    { id: "history", label: t.history, icon: HistoryIcon },
    { id: "settings", label: t.settings, icon: Settings },
  ];

  const languages: { code: Language; label: string }[] = [
    { code: "EN", label: "English" },
    { code: "አማ", label: "አማርኛ" },
    { code: "ORM", label: "Afaan Oromoo" },
    { code: "TIR", label: "ትግርኛ" },
  ];

  const handleNavClick = (viewId: AppView) => {
    // Protected views require authentication
    const protectedViews: AppView[] = ["reservation", "queue", "charging", "history", "settings"];
    if (protectedViews.includes(viewId)) {
      const allowed = requireAuth({ view: viewId });
      if (!allowed) {
        if (typeof window !== "undefined" && window.innerWidth < 1024) {
          useChargeFlowStore.setState({ isSidebarOpen: false });
        }
        return;
      }
    }

    setView(viewId);
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      useChargeFlowStore.setState({ isSidebarOpen: false });
    }
  };

  return (
    <>
      {/* Mobile Dark Backdrop Overlay */}
      <div
        onClick={toggleSidebar}
        className={`fixed inset-0 z-40 transition-opacity duration-300 lg:hidden ${
          isSidebarOpen ? "opacity-100 pointer-events-auto bg-black/75 backdrop-blur-sm" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      {/* Main Sidebar Panel (Drawer on Mobile, Collapsible on Desktop) */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 flex flex-col justify-between h-screen shrink-0 select-none transition-all duration-300 ease-in-out border-r ${
          isCream 
            ? "bg-[#FAF8F5] border-stone-300/80 text-stone-900 shadow-stone-300/50" 
            : "bg-[#06090F] border-white/5 text-slate-100 shadow-black/80"
        } ${
          isSidebarOpen
            ? "w-72 translate-x-0 opacity-100 shadow-2xl lg:shadow-none"
            : "w-0 -translate-x-full lg:translate-x-0 lg:w-0 overflow-hidden opacity-0 pointer-events-none border-none p-0"
        }`}
      >
        <div className="w-72 flex flex-col justify-between h-full p-5 overflow-y-auto min-h-0 space-y-6">
          {/* Top Section: Brand & Nav Links */}
          <div className="space-y-6">
            {/* Header Brand Logo with Mobile Close Button */}
            <div className="flex items-center justify-between px-1 py-1">
              <div 
                onClick={() => handleNavClick("cockpit")}
                className="cursor-pointer group"
              >
                <ChargeFlowLogo theme={theme} size="md" />
              </div>

              {/* Close button visible on mobile */}
              <button
                onClick={toggleSidebar}
                className={`p-2 rounded-xl border lg:hidden ${
                  isCream ? "border-stone-300 hover:bg-stone-200/60" : "border-white/10 hover:bg-white/10"
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Section */}
            <div className="space-y-2">
              <div className="px-3 pb-1">
                <span className={`text-[11px] font-bold tracking-wider uppercase font-mono ${
                  isCream ? "text-stone-400" : "text-slate-500"
                }`}>
                  Navigation Menu
                </span>
              </div>

              {/* Navigation List with comfortable spacing and clear typography */}
              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer group ${
                        isActive
                          ? isCream
                            ? "bg-emerald-600 text-white shadow-md font-bold"
                            : "bg-[#0C2B25] text-emerald-400 border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.22)] font-bold"
                          : isCream
                            ? "text-stone-700 hover:text-stone-950 hover:bg-stone-200/60"
                            : "text-slate-300 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <Icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-105 ${
                          isActive 
                            ? (isCream ? "text-white" : "text-emerald-400") 
                            : (isCream ? "text-stone-500" : "text-slate-400")
                        }`} />
                        <span className="truncate tracking-wide">{item.label}</span>
                      </div>

                      {isActive && (
                        <div className="w-1.5 h-4 rounded-full bg-emerald-400 shadow-[0_0_8px_#34D399]" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Bottom Section: Vehicle Mini Status + Copilot + Controls + Profile */}
          <div className={`space-y-3.5 pt-4 border-t ${isCream ? "border-stone-200" : "border-white/10"}`}>
            {/* Selected Vehicle Mini Card */}
            <div 
              onClick={() => handleNavClick("cockpit")}
              className={`p-3 rounded-2xl border cursor-pointer transition-all group space-y-2 ${
                isCream
                  ? "bg-white border-stone-200 hover:border-emerald-500/50 shadow-sm"
                  : "bg-[#0B111A] border-white/10 hover:border-emerald-500/30"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <VehicleCutout 
                  modelId={vehicle.id} 
                  modelName={vehicle.model} 
                  paintColor={vehicle.paintColor} 
                  className="w-11 h-6.5 shrink-0" 
                />
                <div className="overflow-hidden min-w-0 flex-1">
                  <span className={`text-xs font-bold uppercase block truncate ${isCream ? "text-stone-900" : "text-white"}`}>
                    {vehicle.model || "BYD ATTO 3"}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold mt-0.5" style={{ color: batteryVisual.color }}>
                    <Zap className="w-3 h-3 fill-current shrink-0" />
                    <span className="truncate">{vehicle.batterySoc || 66}% {t.batteryStatus}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Copilot Widget */}
            <div 
              onClick={toggleCopilot}
              className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all group hover:scale-[1.02] ${
                isCream
                  ? "bg-white border-emerald-500/40 hover:border-emerald-600 shadow-sm"
                  : "bg-[#09111E] border-emerald-500/30 hover:border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.12)]"
              }`}
            >
              <div className="flex flex-col min-w-0 pr-2">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-black transition-colors ${
                    isCream ? "text-stone-900 group-hover:text-emerald-700" : "text-white group-hover:text-emerald-400"
                  }`}>
                    ChargeFlow AI
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-500 text-[9px] font-mono font-bold">
                    COPILOT
                  </span>
                </div>
                <span className={`text-[11px] truncate mt-0.5 ${isCream ? "text-stone-500" : "text-slate-400"}`}>
                  {t.aiCopilotHint}
                </span>
              </div>
              <div className="w-8.5 h-8.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 p-0.5 shadow shrink-0 flex items-center justify-center">
                <Sparkles className="w-4.5 h-4.5 text-emerald-500" />
              </div>
            </div>

            {/* Language & Theme Controls */}
            <div className="grid grid-cols-2 gap-2.5">
              <button 
                onClick={() => {
                  const nextIdx = (languages.findIndex(l => l.code === language) + 1) % languages.length;
                  setLanguage(languages[nextIdx].code);
                }}
                className={`flex items-center justify-between px-3.5 py-2 rounded-xl border text-xs transition-colors cursor-pointer ${
                  isCream 
                    ? "bg-white border-stone-200 text-stone-700 hover:bg-stone-100" 
                    : "bg-[#080D14] border-white/10 text-slate-200 hover:bg-white/5"
                }`}
                title="Switch Language (EN / አማ / ORM / TIR)"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="font-mono font-bold">{language}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button 
                onClick={toggleTheme}
                className={`flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                  isCream 
                    ? "bg-white border-stone-200 text-stone-700 hover:bg-stone-100" 
                    : "bg-[#080D14] border-white/10 text-slate-200 hover:bg-white/5"
                }`}
                title="Toggle Dark / Cream Theme"
              >
                {isCream ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-600" />
                    <span>Cream</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-teal-400" />
                    <span>Dark</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
