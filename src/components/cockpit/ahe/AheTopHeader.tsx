import React, { useState } from 'react';
import { Zap, Hand, ChevronDown, Sparkles, Navigation, Layers, Check } from 'lucide-react';
import { useChargeFlowStore } from '../../../store/useChargeFlowStore';
import { AppView } from '../../../types';

interface AheTopHeaderProps {
  onToggleRotatePrompt?: () => void;
}

export const AheTopHeader: React.FC<AheTopHeaderProps> = ({ onToggleRotatePrompt }) => {
  const { currentView, setView, toggleCopilot } = useChargeFlowStore();
  const [isWorkflowMenuOpen, setIsWorkflowMenuOpen] = useState(false);

  const workflowSteps: { id: AppView | 'welcome_splash'; label: string; stepNum: string; targetView: AppView }[] = [
    { id: 'welcome_splash', label: 'Logo Splash', stepNum: '01', targetView: 'welcome' },
    { id: 'welcome', label: 'Welcome & Auth', stepNum: '02', targetView: 'welcome' },
    { id: 'cockpit', label: 'Vehicle Cockpit', stepNum: '03', targetView: 'cockpit' },
    { id: 'find_charge', label: 'Find Charging', stepNum: '04', targetView: 'find_charge' },
    { id: 'reservation', label: 'Bay Reservation', stepNum: '05', targetView: 'reservation' },
    { id: 'queue', label: 'Live Queue', stepNum: '06', targetView: 'queue' },
    { id: 'charging', label: 'Active Charging', stepNum: '07', targetView: 'charging' },
    { id: 'history', label: 'Charging History', stepNum: '08', targetView: 'history' },
    { id: 'settings', label: 'Settings', stepNum: '09', targetView: 'settings' },
  ];

  return (
    <header className="absolute top-0 inset-x-0 z-30 px-5 sm:px-8 py-4 flex items-center justify-between pointer-events-none select-none">
      {/* 1. Brand Logo: ChargeFlow | Drive Clean. Live Better. */}
      <div className="flex items-center gap-3 pointer-events-auto">
        <button
          onClick={() => setView('cockpit')}
          className="flex items-center gap-2.5 group cursor-pointer text-left focus:outline-none"
          title="Return to Cockpit Dashboard"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#06b6d4] to-[#10b981] flex items-center justify-center shadow-[0_0_16px_rgba(45,212,191,0.5)] group-hover:scale-105 transition-transform shrink-0">
            <Zap className="w-4 h-4 text-slate-950 fill-slate-950" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-black tracking-tight text-white font-sans group-hover:text-[#2DD4BF] transition-colors">
              ChargeFlow
            </span>
            <span className="hidden sm:inline text-slate-600 font-light">|</span>
            <span className="hidden md:inline text-xs font-medium text-slate-400 tracking-wide">
              Drive Clean. Live Better.
            </span>
          </div>
        </button>

        {/* Workflow Stage Navigator Dropdown Pill */}
        <div className="relative">
          <button
            onClick={() => setIsWorkflowMenuOpen(!isWorkflowMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0B1322]/80 hover:bg-[#111C30]/90 border border-teal-500/30 hover:border-teal-400/60 backdrop-blur-xl text-[11px] font-semibold text-teal-300 transition-all shadow-lg group"
            title="Step-by-step Workflow Navigator"
          >
            <span className="w-2 h-2 rounded-full bg-[#2DD4BF] animate-pulse" />
            <span className="font-mono text-white/90">STEP 07 / 09</span>
            <span className="hidden lg:inline text-slate-400">• Active Charging</span>
            <ChevronDown className={`w-3.5 h-3.5 text-teal-400 transition-transform duration-200 ${isWorkflowMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Workflow Stepper Dropdown */}
          {isWorkflowMenuOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 rounded-2xl bg-[#090F1C]/95 border border-teal-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-2 border-b border-white/10 text-[10px] font-mono uppercase tracking-widest text-slate-400">
                Operational Workflow Steps
              </div>
              <div className="py-1 space-y-0.5 max-h-80 overflow-y-auto">
                {workflowSteps.map((step) => {
                  const isCurrent = step.targetView === currentView && step.id === 'charging';
                  return (
                    <button
                      key={step.id}
                      onClick={() => {
                        setIsWorkflowMenuOpen(false);
                        setView(step.targetView);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                        isCurrent
                          ? 'bg-teal-500/20 text-teal-200 font-bold border border-teal-500/40'
                          : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-[10px] text-teal-400/80">{step.stepNum}</span>
                        <span>{step.label}</span>
                      </div>
                      {isCurrent && <Check className="w-3.5 h-3.5 text-[#2DD4BF]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Right Tip & Tooling: DRAG TO ROTATE (Exact match to ahe_update.png) */}
      <div className="flex items-center gap-3 pointer-events-auto">
        {/* DRAG TO ROTATE pill badge */}
        <div 
          onClick={onToggleRotatePrompt}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-teal-500/30 bg-[#0A1220]/80 backdrop-blur-xl shadow-[0_0_20px_rgba(45,212,191,0.15)] cursor-default group hover:border-teal-400/60 transition-all"
        >
          <div className="w-5 h-5 rounded-full bg-teal-500/20 flex items-center justify-center text-[#2DD4BF] group-hover:scale-110 transition-transform">
            <Hand className="w-3 h-3 text-[#2DD4BF]" />
          </div>
          <div className="text-left">
            <div className="text-[10px] font-black uppercase text-[#2DD4BF] tracking-wider font-sans leading-none">
              DRAG TO ROTATE
            </div>
            <div className="text-[9px] text-slate-400 leading-none mt-0.5">
              Explore the station
            </div>
          </div>
        </div>

        {/* AI Copilot Quick Button */}
        <button
          onClick={toggleCopilot}
          className="p-2 rounded-full border border-white/10 bg-[#0B1322]/80 hover:bg-white/10 text-slate-300 hover:text-white backdrop-blur-xl transition-all shadow-md"
          title="Open AI Assistant"
        >
          <Sparkles className="w-4 h-4 text-teal-400" />
        </button>
      </div>
    </header>
  );
};
