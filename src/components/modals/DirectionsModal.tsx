import React from 'react';
import { 
  Navigation, 
  MapPin, 
  Clock, 
  ExternalLink, 
  X, 
  Zap, 
  Compass, 
  CornerUpRight, 
  ArrowUp, 
  CheckCircle2 
} from 'lucide-react';
import { useChargeFlowStore } from '../../store/useChargeFlowStore';

export const DirectionsModal: React.FC = () => {
  const directionsModal = useChargeFlowStore((s) => s.directionsModal);
  const closeDirectionsModal = useChargeFlowStore((s) => s.closeDirectionsModal);
  const theme = useChargeFlowStore((s) => s.theme);
  const isCream = theme === 'cream';

  if (!directionsModal?.isOpen) return null;

  const {
    stationName,
    address,
    distanceKm,
    etaMin,
    baysAvailable,
    powerKw,
  } = directionsModal;

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${stationName} ${address}`
  )}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in select-none">
      <div className={`border rounded-3xl p-5 sm:p-6 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-200 ${
        isCream
          ? 'bg-[#FAF7F2] border-amber-900/15 text-slate-900 shadow-[0_25px_60px_rgba(40,20,10,0.2)]'
          : 'bg-[#0A1220] border-teal-500/30 text-white shadow-[0_25px_60px_rgba(0,0,0,0.9)]'
      }`}>
        
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Navigation className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">
                Live Navigation Route
              </div>
              <h3 className={`text-lg font-black tracking-tight ${isCream ? 'text-slate-900' : 'text-white'}`}>
                {stationName}
              </h3>
            </div>
          </div>
          <button
            onClick={closeDirectionsModal}
            className={`p-2 rounded-xl transition-colors ${
              isCream ? 'hover:bg-black/5 text-slate-500' : 'hover:bg-white/10 text-slate-400'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Distance, ETA, and Bay Availability Pill */}
        <div className={`grid grid-cols-3 gap-2 p-3 rounded-2xl border ${
          isCream ? 'bg-white border-amber-900/10' : 'bg-[#060B14] border-white/5'
        }`}>
          <div className="text-center">
            <div className="text-[9px] uppercase font-bold opacity-60">Distance</div>
            <div className="text-sm font-black font-mono text-teal-400">{distanceKm} km</div>
          </div>
          <div className="text-center border-x border-white/10">
            <div className="text-[9px] uppercase font-bold opacity-60">Est. Time</div>
            <div className="text-sm font-black font-mono text-emerald-400">~{etaMin} min</div>
          </div>
          <div className="text-center">
            <div className="text-[9px] uppercase font-bold opacity-60">Fast Power</div>
            <div className="text-sm font-black font-mono text-cyan-400">{powerKw} kW</div>
          </div>
        </div>

        {/* Destination Address */}
        <div className="flex items-start gap-2 text-xs opacity-80 px-1">
          <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
          <span className="leading-snug">{address}</span>
        </div>

        {/* Turn-by-Turn Route Preview */}
        <div className={`p-3.5 rounded-2xl border space-y-2.5 text-xs ${
          isCream ? 'bg-white/70 border-stone-200' : 'bg-[#08101E] border-white/5'
        }`}>
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center justify-between">
            <span>Route Guidance</span>
            <span className="text-teal-400 font-mono font-bold">Optimal Fast Path</span>
          </div>

          <div className="space-y-2 text-[11px]">
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 text-[10px] font-bold">
                1
              </div>
              <div className="flex-1">
                <span className="font-semibold">Head North on Bole Road</span>
                <span className="block text-[10px] opacity-60">Drive 850m straight towards Cameroon St</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 text-[10px] font-bold">
                2
              </div>
              <div className="flex-1">
                <span className="font-semibold">At Bole Medhanialem roundabout, take 2nd exit</span>
                <span className="block text-[10px] opacity-60">Continue for 1.2 km past Edna Mall</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 text-[10px] font-bold">
                3
              </div>
              <div className="flex-1">
                <span className="font-semibold text-emerald-400">Arrive at {stationName}</span>
                <span className="block text-[10px] opacity-60">Dedicated EV charging bays on the right</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="space-y-2 pt-1">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.01] cursor-pointer"
          >
            <span>Open in Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
          </a>

          <button
            onClick={closeDirectionsModal}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center cursor-pointer ${
              isCream ? 'hover:bg-black/5 text-slate-700' : 'hover:bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            Close Directions
          </button>
        </div>
      </div>
    </div>
  );
};
