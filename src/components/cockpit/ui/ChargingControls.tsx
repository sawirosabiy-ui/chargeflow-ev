import React from 'react';
import { useChargeFlowStore } from '../../../store/useChargeFlowStore';
import { Play, Square, Pause, RotateCw } from 'lucide-react';

export const ChargingControls: React.FC = () => {
  const { cockpitCharging, startCockpitCharging, stopCockpitCharging, pauseCockpitCharging, resumeCockpitCharging } =
    useChargeFlowStore();
  const { status } = cockpitCharging;

  const isCharging = status === 'charging';
  const isStarting = status === 'starting';
  const isStopping = status === 'stopping';
  const isPaused = status === 'paused';
  const isComplete = status === 'complete';
  const isBusy = isStarting || isStopping;

  const handleMainAction = () => {
    if (isCharging || isPaused || isStarting) {
      stopCockpitCharging();
    } else {
      startCockpitCharging();
    }
  };

  const handlePauseResume = () => {
    if (isCharging) {
      pauseCockpitCharging();
    } else if (isPaused) {
      resumeCockpitCharging();
    }
  };

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 select-none pointer-events-auto">
      <div className="flex items-center gap-3 p-1.5 rounded-2xl bg-[#0F172A]/80 border border-white/10 backdrop-blur-2xl shadow-2xl">
        {/* Main Start / Stop Button */}
        <div className="relative group p-[1px] rounded-xl overflow-hidden">
          {/* Continuous Slow Emerald Sweep when charging */}
          {isCharging && (
            <div
              className="absolute inset-[-100%] rounded-xl animate-[spin_4s_linear_infinite]"
              style={{
                background:
                  'conic-gradient(from 0deg, transparent 0 320deg, #10B981 350deg, #34D399 360deg)'
              }}
            />
          )}

          <button
            onClick={handleMainAction}
            disabled={isBusy}
            className={`relative flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-mono text-sm font-bold tracking-wider uppercase transition-all duration-300 ${
              isCharging
                ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                : isStarting
                ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400 animate-pulse'
                : isStopping
                ? 'bg-slate-700/50 text-slate-400 border border-slate-600'
                : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.4)] border border-emerald-300'
            }`}
          >
            {isStarting ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin text-emerald-300" />
                <span>Initializing...</span>
              </>
            ) : isStopping ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin text-slate-400" />
                <span>Ramping Down...</span>
              </>
            ) : isCharging ? (
              <>
                <Square className="w-4 h-4 fill-current text-red-400" />
                <span>Stop Charging</span>
              </>
            ) : isComplete ? (
              <>
                <Play className="w-4 h-4 fill-current text-slate-950" />
                <span>Charge Again</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current text-slate-950" />
                <span>Start Charging</span>
              </>
            )}
          </button>
        </div>

        {/* Secondary Pause / Resume Button */}
        {(isCharging || isPaused) && (
          <button
            onClick={handlePauseResume}
            disabled={isBusy}
            className={`flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-mono text-xs font-semibold uppercase tracking-wider transition-all duration-200 border ${
              isPaused
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30'
                : 'bg-[#0B0F17]/80 text-slate-300 border-white/10 hover:border-white/20 hover:text-white'
            }`}
          >
            {isPaused ? (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Resume</span>
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Induction Field Safety Subtitle */}
      <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 tracking-wide">
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isCharging
              ? 'bg-emerald-400 animate-ping'
              : isPaused
              ? 'bg-amber-400'
              : 'bg-slate-600'
          }`}
        />
        <span>
          {isCharging
            ? 'HIGH-EFFICIENCY RESONANT MAGNETIC INDUCTION ACTIVE'
            : isPaused
            ? 'INDUCTION FIELD SUSPENDED (STANDBY 12%)'
            : 'VEHICLE DOCKED OVER GROUND COIL — READY'}
        </span>
      </div>
    </div>
  );
};
