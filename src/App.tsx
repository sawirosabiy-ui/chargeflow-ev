import React, { useEffect } from "react";
import { useChargeFlowStore } from "./store/useChargeFlowStore";
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { WelcomeView } from "./components/views/WelcomeView";
import { CockpitView } from "./components/views/CockpitView";
import { FindChargeView } from "./components/views/FindChargeView";
import { ReservationView } from "./components/views/ReservationView";
import { QueueView } from "./components/views/QueueView";
import { ActiveChargingView } from "./components/views/ActiveChargingView";
import { HistoryView } from "./components/views/HistoryView";
import { SettingsView } from "./components/views/SettingsView";
import { AICopilotModal } from "./components/copilot/AICopilotModal";
import { AuthModal } from "./components/auth/AuthModal";
import { Zap, X, ArrowRight } from "lucide-react";

export const App: React.FC = () => {
  const currentView = useChargeFlowStore((s) => s.currentView);
  const setView = useChargeFlowStore((s) => s.setView);
  const theme = useChargeFlowStore((s) => s.theme);
  const chargingStatus = useChargeFlowStore((s) => s.chargingSession.status);
  const tickChargingSession = useChargeFlowStore((s) => s.tickChargingSession);
  const completionNotification = useChargeFlowStore((s) => s.completionNotification);
  const dismissCompletionNotification = useChargeFlowStore((s) => s.dismissCompletionNotification);
  const isAuthModalOpen = useChargeFlowStore((s) => s.isAuthModalOpen);
  const authModalMode = useChargeFlowStore((s) => s.authModalMode);
  const closeAuthModal = useChargeFlowStore((s) => s.closeAuthModal);

  // Global background charging ticker across all views
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (chargingStatus === "CHARGING") {
      interval = setInterval(() => {
        tickChargingSession();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [chargingStatus, tickChargingSession]);

  // Fullscreen 4-Step Welcome / Onboarding
  if (currentView === "welcome") {
    return (
      <main className={`w-screen h-screen overflow-hidden ${theme === "cream" ? "bg-[#FBF9F5] text-slate-900" : "bg-[#0B0F17] text-slate-100"}`}>
        <WelcomeView />
        <AuthModal />
      </main>
    );
  }

  return (
    <div className={`flex h-screen w-screen overflow-hidden antialiased font-sans relative ${
      theme === "cream" ? "bg-[#F4F1EA] text-slate-900" : "bg-[#0B0F17] text-slate-100"
    }`}>
      {/* Universal 100% Full Battery Notification Banner across ALL views */}
      {completionNotification?.show && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-xl w-[92%] sm:w-auto bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white px-5 py-3.5 rounded-2xl shadow-[0_20px_60px_rgba(16,185,129,0.5)] border border-emerald-300/40 flex items-center gap-3.5 animate-in fade-in slide-in-from-top-4">
          <div className="w-9 h-9 rounded-xl bg-slate-950/30 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-white fill-white animate-bounce" />
          </div>
          <div className="flex-1 text-left min-w-0">
            <div className="text-xs font-black uppercase tracking-wider text-emerald-100">
              Charging Complete (100%)
            </div>
            <p className="text-xs text-white/95 font-medium leading-snug line-clamp-2">
              {completionNotification?.message}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                dismissCompletionNotification();
                setView("history");
              }}
              className="px-3 py-1.5 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-emerald-50 transition-all flex items-center gap-1 shadow"
            >
              <span>History</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <button
              onClick={dismissCompletionNotification}
              className="p-1 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Persistent Collapsible Sidebar */}
      <Sidebar />

      {/* Main App Workspace */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        {/* Top Header Bar */}
        <Header />

        {/* Dynamic Screen Views */}
        <main className="flex-1 overflow-hidden flex flex-col relative min-w-0">
          {currentView === "cockpit" && <CockpitView />}
          {currentView === "find_charge" && <FindChargeView />}
          {currentView === "reservation" && <ReservationView />}
          {currentView === "queue" && <QueueView />}
          {currentView === "charging" && <ActiveChargingView />}
          {currentView === "history" && <HistoryView />}
          {currentView === "settings" && <SettingsView />}
        </main>
      </div>

      {/* Interactive AI Copilot Chatbot Layer */}
      <AICopilotModal />

      {/* Auth Modal */}
      <AuthModal />
    </div>
  );
};

export default App;
