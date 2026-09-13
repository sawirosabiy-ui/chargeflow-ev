import React from 'react';
import { 
  CheckCircle2, 
  X, 
  MapPin, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  Navigation, 
  QrCode,
  Calendar,
  CreditCard
} from 'lucide-react';
import { useChargeFlowStore } from '../../store/useChargeFlowStore';

export const ReservationReceiptModal: React.FC = () => {
  const receiptModal = useChargeFlowStore((s) => s.receiptModal);
  const closeReceiptModal = useChargeFlowStore((s) => s.closeReceiptModal);
  const openDirectionsModal = useChargeFlowStore((s) => s.openDirectionsModal);
  const setView = useChargeFlowStore((s) => s.setView);
  const theme = useChargeFlowStore((s) => s.theme);
  const isCream = theme === 'cream';

  if (!receiptModal?.isOpen) return null;

  const {
    receiptNo,
    date,
    stationName,
    bayNumber,
    powerKw,
    amountEtb,
    status,
  } = receiptModal;

  const handleViewReservation = () => {
    closeReceiptModal();
    setView('cockpit');
  };

  const handleGetDirections = () => {
    closeReceiptModal();
    openDirectionsModal({
      name: stationName,
      address: 'Bole Road, Near Bole Medhanialem, Addis Ababa',
      distanceKm: 2.4,
      etaMin: 7,
      baysAvailable: '4 / 6 bays available',
      powerKw: powerKw || 120,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in select-none">
      <div className={`border rounded-3xl p-5 sm:p-7 max-w-sm w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-200 ${
        isCream
          ? 'bg-[#FAF7F2] border-amber-900/15 text-slate-900 shadow-[0_25px_60px_rgba(40,20,10,0.2)]'
          : 'bg-[#0A1220] border-teal-500/30 text-white shadow-[0_25px_60px_rgba(0,0,0,0.95)]'
      }`}>
        
        {/* Top Header */}
        <div className="text-center space-y-1 relative">
          <button
            onClick={closeReceiptModal}
            className={`absolute -top-1 -right-1 p-2 rounded-xl transition-colors ${
              isCream ? 'hover:bg-black/5 text-slate-500' : 'hover:bg-white/10 text-slate-400'
            }`}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div className="text-[10px] font-black uppercase text-emerald-400 tracking-widest pt-1">
            ✓ Payment Successful
          </div>
          <h3 className={`text-xl font-black tracking-tight ${isCream ? 'text-slate-900' : 'text-white'}`}>
            Reservation Confirmed
          </h3>
        </div>

        {/* Clean Paper Receipt Card */}
        <div className={`p-4 rounded-2xl border space-y-3 font-mono text-xs ${
          isCream ? 'bg-white border-amber-900/10' : 'bg-[#060B14] border-white/10'
        }`}>
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div>
              <div className="text-[10px] font-sans font-black tracking-wider text-teal-400">CHARGEFLOW</div>
              <div className="text-[9px] opacity-60 font-sans">OFFICIAL RECEIPT</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold text-slate-300">{receiptNo}</div>
              <div className="text-[9px] opacity-60">{date}</div>
            </div>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between">
              <span className="opacity-60 font-sans">Station</span>
              <span className="font-bold">{stationName}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-60 font-sans">Charging Bay</span>
              <span className="font-bold text-teal-400">{bayNumber} ({powerKw} kW)</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-60 font-sans">Reservation Fee</span>
              <span className="font-bold text-emerald-400">{amountEtb.toFixed(2)} ETB</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-60 font-sans">Payment Status</span>
              <span className="font-bold text-emerald-400 uppercase">{status}</span>
            </div>
          </div>

          {/* Realistic High-Res SVG QR Code Matrix (Safe Verification Reference Only) */}
          <div className="pt-2 border-t border-white/10 text-center space-y-1.5">
            <div className="p-2.5 bg-white rounded-xl inline-block shadow-inner mx-auto">
              <svg className="w-28 h-28 mx-auto" viewBox="0 0 100 100" fill="none">
                {/* SVG QR Pattern with Finder Corners */}
                {/* Top-Left Corner */}
                <rect x="5" y="5" width="26" height="26" fill="#000" />
                <rect x="8" y="8" width="20" height="20" fill="#fff" />
                <rect x="12" y="12" width="12" height="12" fill="#000" />
                
                {/* Top-Right Corner */}
                <rect x="69" y="5" width="26" height="26" fill="#000" />
                <rect x="72" y="8" width="20" height="20" fill="#fff" />
                <rect x="76" y="12" width="12" height="12" fill="#000" />
                
                {/* Bottom-Left Corner */}
                <rect x="5" y="69" width="26" height="26" fill="#000" />
                <rect x="8" y="72" width="20" height="20" fill="#fff" />
                <rect x="12" y="76" width="12" height="12" fill="#000" />
                
                {/* Simulated Data Matrix Dots */}
                <rect x="36" y="8" width="6" height="6" fill="#000" />
                <rect x="46" y="8" width="6" height="6" fill="#000" />
                <rect x="56" y="8" width="6" height="6" fill="#000" />
                <rect x="36" y="18" width="6" height="6" fill="#000" />
                <rect x="46" y="24" width="6" height="6" fill="#000" />
                <rect x="8" y="36" width="6" height="6" fill="#000" />
                <rect x="18" y="36" width="6" height="6" fill="#000" />
                <rect x="28" y="36" width="6" height="6" fill="#000" />
                <rect x="38" y="36" width="6" height="6" fill="#000" />
                <rect x="48" y="36" width="6" height="6" fill="#000" />
                <rect x="58" y="36" width="6" height="6" fill="#000" />
                <rect x="68" y="36" width="6" height="6" fill="#000" />
                <rect x="78" y="36" width="6" height="6" fill="#000" />
                <rect x="88" y="36" width="6" height="6" fill="#000" />
                <rect x="36" y="46" width="6" height="6" fill="#000" />
                <rect x="56" y="46" width="6" height="6" fill="#000" />
                <rect x="66" y="46" width="6" height="6" fill="#000" />
                <rect x="36" y="56" width="6" height="6" fill="#000" />
                <rect x="46" y="56" width="6" height="6" fill="#000" />
                <rect x="76" y="56" width="6" height="6" fill="#000" />
                <rect x="86" y="56" width="6" height="6" fill="#000" />
                <rect x="36" y="66" width="6" height="6" fill="#000" />
                <rect x="56" y="66" width="6" height="6" fill="#000" />
                <rect x="46" y="76" width="6" height="6" fill="#000" />
                <rect x="66" y="76" width="6" height="6" fill="#000" />
                <rect x="76" y="76" width="6" height="6" fill="#000" />
                <rect x="46" y="86" width="6" height="6" fill="#000" />
                <rect x="56" y="86" width="6" height="6" fill="#000" />
                <rect x="86" y="86" width="6" height="6" fill="#000" />

                {/* Center Badge */}
                <rect x="42" y="42" width="16" height="16" rx="4" fill="#0D9488" />
                <path d="M50 45 L47 51 L50 51 L49 55 L54 49 L51 49 Z" fill="#fff" />
              </svg>
            </div>
            <div className="text-[9px] opacity-60 font-sans leading-tight">
              Scan at Bay Dispenser to verify reservation reference.
            </div>
          </div>
        </div>

        {/* Explicit Financial Separation Notice */}
        <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-xs text-left space-y-1">
          <div className="font-bold text-teal-400 text-[11px] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>50 ETB Reservation Fee Paid</span>
          </div>
          <p className="text-[10px] text-slate-300 leading-relaxed">
            This payment is for the reservation only. Charging energy will be calculated and billed separately after charging ends.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleViewReservation}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.01] cursor-pointer"
          >
            <span>VIEW RESERVATION</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>

          <button
            onClick={handleGetDirections}
            className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-teal-300 border border-teal-500/30 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>GET DIRECTIONS</span>
          </button>
        </div>
      </div>
    </div>
  );
};
