import React from "react";
import { 
  Clock, 
  AlertTriangle, 
  MapPin, 
  RotateCcw, 
  Navigation, 
  X,
  ArrowRight
} from "lucide-react";
import { useChargeFlowStore } from "../../store/useChargeFlowStore";

export const ReservationExpiredModal: React.FC = () => {
  const isReservationExpiredModalOpen = useChargeFlowStore((s) => s.isReservationExpiredModalOpen);
  const closeReservationExpiredModal = useChargeFlowStore((s) => s.closeReservationExpiredModal);
  const reservation = useChargeFlowStore((s) => s.reservation);
  const setView = useChargeFlowStore((s) => s.setView);
  const cancelActiveReservation = useChargeFlowStore((s) => s.cancelActiveReservation);

  if (!isReservationExpiredModalOpen) return null;

  const handleReserveAgain = () => {
    cancelActiveReservation();
    closeReservationExpiredModal();
    setView("find_charge");
  };

  const handleExploreStations = () => {
    cancelActiveReservation();
    closeReservationExpiredModal();
    setView("find_charge");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      {/* Blurred Backdrop */}
      <div 
        onClick={closeReservationExpiredModal}
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      {/* Futuristic Glassmorphism Dialog */}
      <div className="relative w-full max-w-md rounded-3xl p-6 sm:p-7 backdrop-blur-2xl bg-[#090F1C]/95 border border-amber-500/30 text-slate-100 shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute -top-20 -right-20 w-44 h-44 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

        {/* Close Icon Button */}
        <button
          onClick={closeReservationExpiredModal}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with Warning Icon */}
        <div className="flex items-center gap-3 pb-4 border-b border-white/10">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold tracking-widest uppercase text-amber-400">
              TIME WINDOW ELAPSED
            </div>
            <h2 className="text-lg font-black tracking-tight text-white mt-0.5">
              Reservation Expired
            </h2>
          </div>
        </div>

        {/* Description Body */}
        <div className="space-y-4 pt-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            Your <span className="font-bold text-white">1-hour arrival window</span> for this charging bay has concluded. To keep charging points accessible for all drivers in Addis Ababa, bay holds are automatically released after 60 minutes.
          </p>

          {/* Bay & Station Info Card */}
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Station:</span>
              <span className="font-bold text-white truncate max-w-[200px]">
                {reservation?.stationName || "Bole Medhanialem Hub"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Bay Assigned:</span>
              <span className="font-mono font-bold text-amber-400">
                {reservation?.bayNumber || "Bay DC-01"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Status:</span>
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                EXPIRED
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              Ready to charge now? Create a fresh reservation or explore nearby available hubs with real-time bay availability.
            </span>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={handleReserveAgain}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(45,212,191,0.35)] transition-all hover:scale-[1.01] cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reserve Again</span>
            </button>

            <button
              onClick={handleExploreStations}
              className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-bold text-white transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              <span>Find Another Station</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationExpiredModal;
