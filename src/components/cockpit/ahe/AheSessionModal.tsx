import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw, 
  Zap, 
  CreditCard, 
  ShieldCheck, 
  Check, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { useChargeFlowStore } from '../../../store/useChargeFlowStore';
import { useTranslation } from '../../../localization/useTranslation';

interface AheSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  energyKwh: number;
  costEtb: number;
  durationMinutes: number;
  batterySoc: number;
}

export const AheSessionModal: React.FC<AheSessionModalProps> = ({
  isOpen,
  onClose,
  energyKwh,
  costEtb,
  durationMinutes,
  batterySoc,
}) => {
  const { t } = useTranslation();
  const { setView, reservation, theme, settleChargingPayment, wallet } = useChargeFlowStore();
  const isCream = theme === 'cream';

  const [selectedMethod, setSelectedMethod] = useState<'Telebirr' | 'CBE Birr' | 'Chapa' | 'Wallet'>('Telebirr');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [txId, setTxId] = useState('');

  if (!isOpen) return null;

  const handlePayAndFinish = () => {
    setIsProcessing(true);
    setErrorMsg('');

    setTimeout(() => {
      const res = settleChargingPayment(selectedMethod === 'Wallet' ? 'ChargeFlow Wallet' : selectedMethod);
      setIsProcessing(false);
      if (res.success) {
        setTxId(`TB-${Date.now().toString().slice(-8)}`);
        setIsPaid(true);
      } else {
        setErrorMsg(res.error || 'Payment failed. Please try again or select another payment method.');
      }
    }, 600);
  };

  const handleGoToHistory = () => {
    onClose();
    setView('history');
  };

  const handleGoToCockpit = () => {
    onClose();
    setView('cockpit');
  };

  const stationTitle = reservation?.stationName || t.stationHub;
  const bayName = reservation?.bayNumber || 'Bay 03';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in select-none">
      <div className={`border rounded-3xl p-5 sm:p-7 max-w-md w-full space-y-4 sm:space-y-5 animate-in zoom-in-95 duration-200 shadow-2xl ${
        isCream
          ? 'bg-[#FAF7F2] border-amber-900/15 text-slate-900 shadow-[0_25px_60px_rgba(40,20,10,0.2)]'
          : 'bg-[#0A1220] border-teal-500/30 text-white shadow-[0_25px_60px_rgba(0,0,0,0.9)]'
      }`}>
        
        {!isPaid ? (
          <>
            {/* 1. Header: Energy Delivery Stopped, Payment Due */}
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                <Zap className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h3 className={`text-xl font-black tracking-tight ${isCream ? 'text-slate-900' : 'text-white'}`}>
                Session Ended — Settle Payment
              </h3>
              <p className={`text-xs ${isCream ? 'text-slate-600' : 'text-slate-400'}`}>
                {stationTitle} • {bayName}
              </p>
            </div>

            {/* 2. Metrics Breakdown */}
            <div className={`grid grid-cols-2 gap-2.5 p-3 rounded-2xl border ${
              isCream ? 'bg-amber-50/60 border-amber-900/10' : 'bg-[#060B14] border-white/5'
            }`}>
              <div className={`p-2.5 rounded-xl ${isCream ? 'bg-white/80' : 'bg-white/[0.02]'}`}>
                <div className="text-[10px] uppercase font-bold opacity-60">Energy Delivered</div>
                <div className={`text-base font-black font-mono mt-0.5 ${isCream ? 'text-slate-900' : 'text-white'}`}>
                  {energyKwh.toFixed(1)} <span className="text-xs text-teal-500">kWh</span>
                </div>
              </div>

              <div className={`p-2.5 rounded-xl ${isCream ? 'bg-white/80' : 'bg-white/[0.02]'}`}>
                <div className="text-[10px] uppercase font-bold opacity-60">Final Battery SOC</div>
                <div className="text-base font-black text-teal-400 font-mono mt-0.5">
                  {Math.round(batterySoc)}%
                </div>
              </div>
            </div>

            {/* 3. Strict Two-Charge Financial Breakdown */}
            <div className={`p-4 rounded-2xl border space-y-2 text-xs ${
              isCream ? 'bg-white border-amber-900/10' : 'bg-[#08101E] border-white/10'
            }`}>
              <div className="flex items-center justify-between">
                <span className={isCream ? 'text-slate-600' : 'text-slate-400'}>Reservation Fee:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-slate-400 line-through">50.00 ETB</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px] border border-emerald-500/30">
                    PAID ✓
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className={isCream ? 'text-slate-600' : 'text-slate-400'}>Energy Consumption Cost:</span>
                {batterySoc >= 90 || costEtb === 0 ? (
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-slate-400 line-through">{(energyKwh * 19.5).toFixed(2)} ETB</span>
                    <span className="px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-400 font-bold text-[10px] border border-teal-500/30">
                      0.00 ETB (FREE TOP-OFF)
                    </span>
                  </div>
                ) : (
                  <span className="font-mono font-bold">{costEtb.toFixed(2)} ETB</span>
                )}
              </div>

              {(batterySoc >= 90 || costEtb === 0) && (
                <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/25 text-teal-300 text-[11px] leading-tight flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-teal-400" />
                  <span>
                    <strong>Courtesy Charge Exemption:</strong> Vehicles charged to ≥90% are exempt from energy usage fees to protect cell longevity.
                  </span>
                </div>
              )}

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-sm">
                <span className="font-bold">Charging Payment Due:</span>
                <span className="font-mono font-black text-emerald-400 text-base">
                  {(batterySoc >= 90 || costEtb === 0) ? '0.00 ETB' : `${costEtb.toFixed(2)} ETB`}
                </span>
              </div>
            </div>

            {/* 4. Payment Method Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider font-bold opacity-70">
                {(batterySoc >= 90 || costEtb === 0) ? 'Confirmation Mode' : 'Select Payment Method'}
              </label>
              {(batterySoc >= 90 || costEtb === 0) ? (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold flex items-center justify-between">
                  <span>✓ 100% Free Courtesy Discharge &amp; Release</span>
                  <Check className="w-4 h-4 text-emerald-400" />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {(['Telebirr', 'CBE Birr', 'Chapa', 'Wallet'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setSelectedMethod(method)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                        selectedMethod === method
                          ? 'bg-teal-500/20 border-teal-400 text-teal-300 shadow-[0_0_12px_rgba(45,212,191,0.25)]'
                          : isCream
                          ? 'bg-white border-stone-200 text-slate-700 hover:bg-stone-50'
                          : 'bg-slate-900/80 border-white/5 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>{method}</span>
                      {selectedMethod === method && <Check className="w-3.5 h-3.5 text-teal-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* 5. Primary Action: Pay & Release Bay */}
            <button
              onClick={handlePayAndFinish}
              disabled={isProcessing}
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 disabled:opacity-50 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all hover:scale-[1.01] cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>
                {isProcessing
                  ? 'Processing...'
                  : (batterySoc >= 90 || costEtb === 0)
                  ? 'Complete & Release Bay (0.00 ETB - Free)'
                  : `Pay & Finish (${costEtb.toFixed(2)} ETB)`}
              </span>
            </button>
          </>
        ) : (
          <>
            {/* Payment Completed & Bay Released State */}
            <div className="text-center space-y-2 py-2 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#06b6d4] to-[#10b981] flex items-center justify-center mx-auto text-slate-950 shadow-[0_0_30px_rgba(45,212,191,0.6)]">
                <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
              </div>
              <h3 className={`text-xl font-black tracking-tight ${isCream ? 'text-slate-900' : 'text-white'}`}>
                Payment Complete — Bay Released
              </h3>
              <p className={`text-xs max-w-xs mx-auto leading-relaxed ${isCream ? 'text-slate-600' : 'text-slate-300'}`}>
                {bayName} has been immediately released and is now available for the next driver.
              </p>
            </div>

            {/* Receipt Card */}
            <div className={`p-4 rounded-2xl border space-y-2 font-mono text-xs ${
              isCream ? 'bg-white border-amber-900/10' : 'bg-[#060B14] border-white/10'
            }`}>
              <div className="flex justify-between">
                <span className="opacity-60">Transaction ID:</span>
                <span className="font-bold text-teal-400">{txId}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-60">Energy Delivered:</span>
                <span className="font-bold">{energyKwh.toFixed(1)} kWh</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-60">Total Paid:</span>
                <span className="font-bold text-emerald-400">{costEtb.toFixed(2)} ETB</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-60">Payment Method:</span>
                <span className="font-bold">{selectedMethod}</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleGoToHistory}
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all hover:scale-[1.01] cursor-pointer"
              >
                <span>{t.proceedToHistory}</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>

              <button
                onClick={handleGoToCockpit}
                className={`w-full py-3 px-4 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                  isCream
                    ? 'bg-black/5 hover:bg-black/10 text-slate-700'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.returnToCockpit}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
