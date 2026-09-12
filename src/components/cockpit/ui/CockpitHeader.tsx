import React from 'react';
import { useChargeFlowStore } from '../../../store/useChargeFlowStore';
import { RotateCw, Settings, Zap, LayoutDashboard } from 'lucide-react';

export const CockpitHeader: React.FC = () => {
  const { cockpitCharging, setCockpitAutoRotate, setView } = useChargeFlowStore();
  const { status, battery, autoRotate } = cockpitCharging;

  const isCharging = status === 'charging';
  const isComplete = status === 'complete';
  const batteryPct = Math.round(battery);

  return (
    <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-8 py-5 pointer-events-none select-none">
      {/* Brand Logo & Name: ⚡ ChargeFlow (Click to return to Cockpit Dashboard) */}
      <button 
        onClick={() => setView('cockpit')}
        className="flex items-center gap-2.5 pointer-events-auto cursor-pointer group"
        title="ChargeFlow Dashboard"
      >
        <div className="text-emerald-400 group-hover:scale-110 transition-transform">
          <Zap className="w-6 h-6 fill-current" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white font-sans">
          ChargeFlow
        </span>
      </button>

      {/* Center Status Capsule: [🟢 CHARGE COMPLETE]  [100%] */}
      <div className="flex items-center gap-3 px-5 py-2 rounded-full border border-white/10 bg-[#0B1322]/80 backdrop-blur-xl shadow-lg pointer-events-auto">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              isComplete
                ? 'bg-emerald-400 shadow-[0_0_10px_#10B981]'
                : isCharging
                ? 'bg-emerald-400 shadow-[0_0_10px_#10B981] animate-pulse'
                : 'bg-amber-400 shadow-[0_0_8px_#F59E0B]'
            }`}
          />
          <span className="text-xs font-bold tracking-wider uppercase text-emerald-400">
            {isComplete ? 'CHARGE COMPLETE' : isCharging ? 'CHARGING' : status.toUpperCase()}
          </span>
        </div>
        <span className="text-xs font-bold text-white font-sans pl-2 border-l border-white/10">
          {batteryPct}%
        </span>
      </div>

      {/* Right Controls: 360°, Dashboard, Settings */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {/* 360 Auto-Rotate Toggle */}
        <button
          onClick={() => setCockpitAutoRotate(!autoRotate)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-200 backdrop-blur-xl ${
            autoRotate
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
              : 'bg-[#0B1322]/70 text-slate-300 border-white/10 hover:border-white/20 hover:text-white'
          }`}
          title="Toggle 360° View"
        >
          <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
          <span>360°</span>
        </button>

        {/* Back to Dashboard */}
        <button
          onClick={() => setView('cockpit')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-200 backdrop-blur-xl bg-[#0B1322]/70 text-slate-300 border-white/10 hover:border-white/20 hover:text-white"
          title="Back to Cockpit Dashboard"
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Dashboard</span>
        </button>

        {/* Settings Button */}
        <button
          onClick={() => setView('settings')}
          className="p-2 rounded-xl border border-white/10 bg-[#0B1322]/70 text-slate-300 hover:text-white hover:border-white/20 transition-colors backdrop-blur-xl"
          title="Settings"
          aria-label="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export default CockpitHeader;
