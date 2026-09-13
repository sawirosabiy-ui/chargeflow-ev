import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Zap, 
  Box, 
  Star, 
  ShieldCheck, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Info, 
  Lock, 
  CreditCard, 
  Calendar, 
  CheckCircle2, 
  Battery, 
  Bell, 
  Globe,
  Radio,
  Clock,
  Sparkles,
  Sliders
} from 'lucide-react';
import { useChargeFlowStore } from '../../store/useChargeFlowStore';
import { useTranslation } from '../../localization/useTranslation';
import { VehicleCutout } from '../vehicle/VehicleCutout';

interface BayDispenserVisualProps {
  status: 'available' | 'charging' | 'reserved' | 'offline';
  power?: string;
}

const BayDispenserVisual: React.FC<BayDispenserVisualProps> = ({ status, power = '120 kW' }) => {
  const color = 
    status === 'available' ? '#2DD4BF' :
    status === 'charging' ? '#38BDF8' :
    status === 'reserved' ? '#F59E0B' : '#EF4444';

  return (
    <div className="w-16 h-22 mx-auto flex flex-col items-center justify-center relative my-1 select-none">
      {/* Background Soft Glow */}
      <div 
        className="absolute inset-0 rounded-2xl blur-lg opacity-30 pointer-events-none" 
        style={{ backgroundColor: color }}
      />
      {/* High-Tech DC Fast Charging Pedestal */}
      <div className="relative z-10 w-12 h-20 rounded-xl bg-gradient-to-b from-[#1C2638] via-[#0F172A] to-[#0A0E1A] border border-white/15 p-1 flex flex-col items-center justify-between shadow-xl">
        {/* Illuminated Status Crown */}
        <div 
          className={`w-full h-1.5 rounded-full ${status === 'charging' ? 'animate-pulse' : ''}`}
          style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
        />
        
        {/* Digital OLED Telemetry Screen */}
        <div className="w-9 h-7 rounded-md bg-[#040810] border border-white/10 p-0.5 flex flex-col items-center justify-center text-center">
          <Zap className="w-2.5 h-2.5" style={{ color }} />
          <span className="text-[7px] font-mono font-bold text-white leading-none mt-0.5">{power}</span>
        </div>

        {/* Dual Cable Connector Ports */}
        <div className="w-full flex items-center justify-center gap-1">
          <div className="w-2.5 h-3 rounded-sm bg-slate-800 border border-white/20 flex items-center justify-center">
            <span className="w-1 h-1 rounded-full" style={{ backgroundColor: color }}></span>
          </div>
          <div className="w-2.5 h-3 rounded-sm bg-slate-800 border border-white/20 flex items-center justify-center">
            <span className="w-1 h-1 rounded-full" style={{ backgroundColor: color }}></span>
          </div>
        </div>

        {/* Bottom Stabilizer Plate */}
        <div className="w-10 h-1 bg-slate-700/80 rounded-full" />
      </div>

      {/* Ground Reflection Halo */}
      <div 
        className="absolute -bottom-1 w-10 h-1 rounded-full blur-xs opacity-80"
        style={{ backgroundColor: color }}
      />
    </div>
  );
};

export const ReservationView: React.FC = () => {
  const user = useChargeFlowStore((s) => s.user);
  const vehicle = useChargeFlowStore((s) => s.vehicle);
  const wallet = useChargeFlowStore((s) => s.wallet);
  const setView = useChargeFlowStore((s) => s.setView);
  const confirmReservation = useChargeFlowStore((s) => s.confirmReservation);
  const topupWalletBalance = useChargeFlowStore((s) => s.topupWalletBalance);
  const openAuthModal = useChargeFlowStore((s) => s.openAuthModal);
  const theme = useChargeFlowStore((s) => s.theme);
  const [reservationError, setReservationError] = useState('');
  const [showTopupModal, setShowTopupModal] = useState(false);
  const { t, language } = useTranslation();
  const isCream = theme === 'cream';

  // Selection states matching the screenshot
  const [selectedBay, setSelectedBay] = useState<'Bay 03' | 'Bay 01' | 'Bay 02' | 'Bay 04' | 'Bay 05'>('Bay 03');
  const [timingMode, setTimingMode] = useState<'now' | 'later' | 'flexible'>('later');
  const [selectedDate, setSelectedDate] = useState('Today, May 16');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('18:00 - 18:30');
  const [selectedPayment, setSelectedPayment] = useState<'telebirr' | 'cbe' | 'chapa' | 'cards'>('telebirr');

  // PIN modal state
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState('');

  const dates = [
    { id: 'Today, May 16', label: 'Today', sub: 'May 16' },
    { id: 'Sat, May 17', label: 'Sat', sub: 'May 17' },
    { id: 'Sun, May 18', label: 'Sun', sub: 'May 18' },
    { id: 'Mon, May 19', label: 'Mon', sub: 'May 19' },
    { id: 'Tue, May 20', label: 'Tue', sub: 'May 20' },
  ];

  const timeSlots = [
    '17:00 - 17:30',
    '17:30 - 18:00',
    '18:00 - 18:30',
    '18:30 - 19:00',
    '19:00 - 19:30',
    '19:30 - 20:00',
  ];

  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      if (nextPin.length === 4) {
        const bayId = selectedBay.toLowerCase().replace(/\s+/g, '-');
        setTimeout(() => {
          const res = confirmReservation('addis-ev-hub-bole', bayId, selectedTimeSlot, selectedDate);
          if (res.success) {
            setShowPinModal(false);
            setPin('');
            setReservationError('');
          } else {
            setReservationError(res.error || 'Failed to complete reservation');
          }
        }, 300);
      }
    }
  };

  const handleConfirmReservationClick = () => {
    if (!user.isAuthenticated) {
      openAuthModal('signup');
      return;
    }
    if (wallet.balanceEtb < 50) {
      setShowTopupModal(true);
      return;
    }
    setReservationError('');
    setShowPinModal(true);
  };

  const handleDeletePin = () => {
    setPin(pin.slice(0, -1));
  };

  return (
    <div className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 select-none min-w-0 font-sans transition-colors duration-300 ${isCream ? "bg-[#FAF8F5] text-stone-900" : "bg-[#07090E] text-slate-100"}`}>

      {/* Top Bar: Back Link & Header Badges */}
      <div className="flex items-center justify-between pb-2">
        <button
          onClick={() => setView('find_charge')}
          className="flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>{t.backToStation}</span>
        </button>

        <div className="flex items-center gap-3">
          <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs ${isCream ? "bg-white border-stone-200 text-stone-700 shadow-sm" : "bg-[#0E131F] border-white/5 text-slate-300"}`}>
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-mono font-bold">{language}</span>
          </div>

          <div className="relative p-2 rounded-full bg-[#0E131F] border border-white/5 text-slate-300">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400"></span>
          </div>

          <div className="flex items-center gap-2 pl-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-emerald-300 font-bold text-xs">
                {user.name.split(' ')[0][0]}{user.name.split(' ')[1]?.[0] || 'A'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Station Banner Card */}
      <div className={`rounded-3xl border overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 items-stretch ${isCream ? "bg-white border-stone-200" : "border-white/10 bg-[#0C101A]"}`}>

        {/* Left: Station Night Photo with Illuminated Canopy */}
        <div className="md:col-span-4 min-h-[220px] md:min-h-[260px] h-full self-stretch relative overflow-hidden bg-slate-900 group">
          <img 
            src="/images/stations/addis-ev-hub.jpg" 
            alt="Addis EV Hub" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/images/stations/kazanchis.jpg";
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0C101A]/30 to-[#0C101A] z-10 hidden md:block"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C101A] via-transparent to-transparent z-10 md:hidden"></div>
          <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono font-bold text-[#2DD4BF] shadow-lg flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-ping"></span>
            <span>★ 4.8 • 120kW ULTRA FAST</span>
          </div>
        </div>

        {/* Right: Station Information */}
        <div className="md:col-span-8 p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <h1 className={`text-xl sm:text-2xl font-black tracking-tight ${isCream ? "text-stone-900" : "text-white"}`}>{t.stationHub}</h1>
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Open 24/7</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>Bole Road, Near Bole Medhanialem, Addis Ababa</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 bg-[#121826] px-3 py-1 rounded-xl border border-white/5">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>DC Fast Charging</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#121826] px-3 py-1 rounded-xl border border-white/5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Up to 120 kW</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#121826] px-3 py-1 rounded-xl border border-white/5">
              <Box className="w-3.5 h-3.5 text-purple-400" />
              <span>GB/T Connector</span>
            </div>
          </div>

          {/* Ratings & Reliability Metrics */}
          <div className="flex items-center gap-6 pt-1 border-t border-white/5 text-xs">
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-white">4.8</span>
              <span className="text-slate-400 font-normal">(128 reviews)</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-400 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>98% reliability</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid: Left Controls (8 Cols) + Right Summary Card (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 1. Select Bay, 2. Choose Time, 3. Payment Method (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* SECTION 1: Select Bay */}
          <div className={`p-6 rounded-3xl border space-y-4 shadow-xl ${isCream ? "bg-white border-stone-200" : "border-white/10 bg-[#0C101A]"}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className={`text-base font-bold ${isCream ? "text-stone-900" : "text-white"}`}>{t.selectBayStep}</h3>
                <p className={`text-xs ${isCream ? "text-stone-500" : "text-slate-400"}`}>{t.chooseBaySubtitle}</p>
              </div>

              {/* Status Legend */}
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span> {t.available}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span> {t.reserved}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span> {t.chargingTitle}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span> {t.offline}
                </span>
              </div>
            </div>

            {/* Bay Cards Carousel/Grid (5 Bays as in screenshot) */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              {/* Bay 03 - AVAILABLE (SELECTED) */}
              <div
                onClick={() => setSelectedBay('Bay 03')}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 relative ${
                  selectedBay === 'Bay 03'
                    ? 'bg-[#0E1B22] border-emerald-400 ring-1 ring-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                    : 'bg-[#101522] border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Bay 03</span>
                  <div className="w-4 h-4 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  ● AVAILABLE
                </span>

                {/* Real Charger Dispenser Visual */}
                <BayDispenserVisual status="available" power="120 kW" />

                <div className="space-y-1 text-[10px] text-slate-300">
                  <div className="font-semibold text-white">120 kW DC Fast</div>
                  <div className="text-slate-400 font-mono">📦 GB/T</div>
                  <div className="text-emerald-400 font-medium flex items-center justify-between pt-1">
                    <span>✓ Compatible</span>
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center text-[9px] font-bold">✓</span>
                  </div>
                </div>
              </div>

              {/* Bay 01 - CHARGING */}
              <div
                onClick={() => setSelectedBay('Bay 01')}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 relative ${
                  selectedBay === 'Bay 01'
                    ? 'bg-[#0E1B22] border-emerald-400 ring-1 ring-emerald-400/50 shadow-md'
                    : 'bg-[#101522] border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Bay 01</span>
                  <Zap className="w-3 h-3 text-cyan-400" />
                </div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  ● CHARGING
                </span>

                {/* Real Charger Dispenser Visual */}
                <BayDispenserVisual status="charging" power="120 kW" />

                <div className="space-y-1 text-[10px] text-slate-300">
                  <div className="font-semibold text-white">120 kW DC Fast</div>
                  <div className="text-slate-400 font-mono">📦 GB/T</div>
                  <div className="text-cyan-400 font-medium pt-1">
                    <div className="flex justify-between font-mono">
                      <span>⚡ 78%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                      <div className="bg-gradient-to-r from-teal-400 to-cyan-400 h-full w-[78%] animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bay 02 - RESERVED */}
              <div
                onClick={() => setSelectedBay('Bay 02')}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 relative ${
                  selectedBay === 'Bay 02'
                    ? 'bg-[#0E1B22] border-emerald-400 ring-1 ring-emerald-400/50 shadow-md'
                    : 'bg-[#101522] border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Bay 02</span>
                  <Clock className="w-3 h-3 text-amber-400" />
                </div>
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                  ● RESERVED
                </span>

                {/* Real Charger Dispenser Visual */}
                <BayDispenserVisual status="reserved" power="120 kW" />

                <div className="space-y-1 text-[10px] text-slate-300">
                  <div className="font-semibold text-white">120 kW DC Fast</div>
                  <div className="text-slate-400 font-mono">📦 GB/T</div>
                  <div className="text-amber-400/90 text-[9px] pt-1 font-mono">
                    Reserved until 16:45
                  </div>
                </div>
              </div>

              {/* Bay 04 - AVAILABLE */}
              <div
                onClick={() => setSelectedBay('Bay 04')}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 relative ${
                  selectedBay === 'Bay 04'
                    ? 'bg-[#0E1B22] border-emerald-400 ring-1 ring-emerald-400/50 shadow-md'
                    : 'bg-[#101522] border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Bay 04</span>
                  <Zap className="w-3 h-3 text-emerald-400" />
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  ● AVAILABLE
                </span>

                {/* Real Charger Dispenser Visual */}
                <BayDispenserVisual status="available" power="120 kW" />

                <div className="space-y-1 text-[10px] text-slate-300">
                  <div className="font-semibold text-white">120 kW DC Fast</div>
                  <div className="text-slate-400 font-mono">📦 GB/T</div>
                  <div className="text-emerald-400 font-medium pt-1">
                    ✓ Compatible
                  </div>
                </div>
              </div>

              {/* Bay 05 - OFFLINE */}
              <div
                className="p-3.5 rounded-2xl border border-white/5 bg-[#101522]/50 opacity-60 flex flex-col justify-between space-y-3 relative cursor-not-allowed"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">Bay 05</span>
                  <Zap className="w-3 h-3 text-rose-500" />
                </div>
                <span className="text-[10px] font-mono font-bold text-rose-500 uppercase tracking-wider">
                  ● OFFLINE
                </span>

                {/* Real Charger Dispenser Visual */}
                <BayDispenserVisual status="offline" power="120 kW" />

                <div className="space-y-1 text-[10px] text-slate-400">
                  <div className="font-semibold text-slate-400">120 kW DC Fast</div>
                  <div className="text-slate-500 font-mono">📦 GB/T</div>
                  <div className="text-rose-400 text-[9px] pt-1 font-mono">
                    ⊘ Out of service
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Choose Time */}
          <div className={`p-6 rounded-3xl border space-y-5 shadow-xl ${isCream ? "bg-white border-stone-200" : "border-white/10 bg-[#0C101A]"}`}>
            <div>
              <h3 className={`text-base font-bold ${isCream ? "text-stone-900" : "text-white"}`}>{t.chooseTimeStep}</h3>
              <p className={`text-xs ${isCream ? "text-stone-500" : "text-slate-400"}`}>{t.arrivalTimeSubtitle}</p>
            </div>

            {/* 3 Arrival Timing Options */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Arrive now */}
              <button
                onClick={() => setTimingMode('now')}
                className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  timingMode === 'now'
                    ? 'bg-[#0E1B22] border-emerald-400 text-white'
                    : 'bg-[#101522] border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <div>
                  <div className={`text-xs font-bold ${isCream ? "text-stone-900" : "text-white"}`}>{t.arriveNow}</div>
                  <div className={`text-[10px] ${isCream ? "text-stone-500" : "text-slate-400"}`}>{t.arriveNowDesc}</div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${timingMode === 'now' ? 'border-emerald-400 bg-emerald-400 text-slate-950' : 'border-slate-600'}`}>
                  {timingMode === 'now' && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>

              {/* Reserve for later (Selected in screenshot) */}
              <button
                onClick={() => setTimingMode('later')}
                className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  timingMode === 'later'
                    ? 'bg-[#0E1B22] border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-400/40'
                    : 'bg-[#101522] border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <div>
                  <div className={`text-xs font-bold ${isCream ? "text-stone-900" : "text-white"}`}>{t.reserveForLater}</div>
                  <div className={`text-[10px] ${isCream ? "text-stone-500" : "text-slate-400"}`}>{t.reserveForLaterDesc}</div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${timingMode === 'later' ? 'border-emerald-400 bg-emerald-400 text-slate-950' : 'border-slate-600'}`}>
                  {timingMode === 'later' && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>

              {/* Flexible */}
              <button
                onClick={() => setTimingMode('flexible')}
                className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  timingMode === 'flexible'
                    ? 'bg-[#0E1B22] border-emerald-400 text-white'
                    : 'bg-[#101522] border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <div>
                  <div className={`text-xs font-bold ${isCream ? "text-stone-900" : "text-white"}`}>{t.flexibleTime}</div>
                  <div className={`text-[10px] ${isCream ? "text-stone-500" : "text-slate-400"}`}>{t.flexibleTimeDesc}</div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${timingMode === 'flexible' ? 'border-emerald-400 bg-emerald-400 text-slate-950' : 'border-slate-600'}`}>
                  {timingMode === 'flexible' && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            </div>

            {/* Date Selector Carousel */}
            <div className="flex items-center gap-2 pt-1">
              <button className="p-2 rounded-xl bg-[#101522] hover:bg-slate-800 border border-white/5 text-slate-400 hover:text-white">
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex-1 grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                {dates.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDate(d.id)}
                    className={`py-2 px-3 rounded-2xl border text-xs transition-all ${
                      selectedDate === d.id
                        ? 'bg-[#0E1B22] border-emerald-400 text-emerald-300 font-bold shadow-sm'
                        : 'bg-[#101522] border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="font-semibold">{d.label}</div>
                    <div className="text-[10px] font-mono text-slate-500">{d.sub}</div>
                  </button>
                ))}
              </div>

              <button className="p-2 rounded-xl bg-[#101522] hover:bg-slate-800 border border-white/5 text-slate-400 hover:text-white">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Time Slot Pills Carousel */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-6 gap-2 text-center">
                {timeSlots.map((ts) => (
                  <button
                    key={ts}
                    onClick={() => setSelectedTimeSlot(ts)}
                    className={`py-2 px-2 rounded-xl border text-[11px] font-mono transition-all ${
                      selectedTimeSlot === ts
                        ? 'bg-[#0E1B22] border-emerald-400 text-emerald-300 font-bold shadow-sm'
                        : 'bg-[#101522] border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {ts}
                  </button>
                ))}
              </div>
              <button className="p-2 rounded-xl bg-[#101522] hover:bg-slate-800 border border-white/5 text-slate-400 hover:text-white">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Info Pill */}
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#101522]/80 border border-white/5 text-xs text-slate-400">
              <Info className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{t.slotReservedNotice}</span>
            </div>
          </div>

          {/* SECTION 3: Payment Method */}
          <div className={`p-6 rounded-3xl border space-y-4 shadow-xl ${isCream ? "bg-white border-stone-200" : "border-white/10 bg-[#0C101A]"}`}>
            <div>
              <h3 className={`text-base font-bold ${isCream ? "text-stone-900" : "text-white"}`}>{t.paymentMethodStep}</h3>
              <p className={`text-xs ${isCream ? "text-stone-500" : "text-slate-400"}`}>{t.paymentMethodSubtitle}</p>
            </div>

            {/* 4 Ethiopian & Card Payment Options */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              {/* Telebirr (Selected in screenshot) */}
              <button
                onClick={() => setSelectedPayment('telebirr')}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between space-y-3 transition-all ${
                  selectedPayment === 'telebirr'
                    ? 'bg-[#0E1B22] border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-400/40'
                    : 'bg-[#101522] border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-white text-xs">
                    <span className="text-emerald-400 font-black">✦</span>
                    <span>ቴሌብር</span>
                  </div>
                  <div className="w-4 h-4 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 font-bold">telebirr</span>
              </button>

              {/* Commercial Bank of Ethiopia (CBE) */}
              <button
                onClick={() => setSelectedPayment('cbe')}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between space-y-3 transition-all ${
                  selectedPayment === 'cbe'
                    ? 'bg-[#0E1B22] border-emerald-400 text-white shadow-md'
                    : 'bg-[#101522] border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-amber-300 text-xs">
                    <span className="text-amber-400">❖</span>
                    <span>CBE</span>
                  </div>
                  <div className="w-3.5 h-3.5 rounded-full border border-slate-600"></div>
                </div>
                <span className="text-[11px] font-mono text-slate-400">CBE Birr</span>
              </button>

              {/* Chapa */}
              <button
                onClick={() => setSelectedPayment('chapa')}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between space-y-3 transition-all ${
                  selectedPayment === 'chapa'
                    ? 'bg-[#0E1B22] border-emerald-400 text-white shadow-md'
                    : 'bg-[#101522] border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-300 text-xs">
                    <span className="text-emerald-400">♾</span>
                    <span>Chapa</span>
                  </div>
                  <div className="w-3.5 h-3.5 rounded-full border border-slate-600"></div>
                </div>
                <span className="text-[11px] font-mono text-slate-400">Direct Pay</span>
              </button>

              {/* Other Cards */}
              <button
                onClick={() => setSelectedPayment('cards')}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between space-y-3 transition-all ${
                  selectedPayment === 'cards'
                    ? 'bg-[#0E1B22] border-emerald-400 text-white shadow-md'
                    : 'bg-[#101522] border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Other Cards</span>
                  <div className="w-3.5 h-3.5 rounded-full border border-slate-600"></div>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                  <span className="text-cyan-400 font-bold">VISA</span>
                  <span className="text-rose-400 font-bold">MC</span>
                  <span>•••</span>
                </div>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.securePaymentsNotice}</span>
            </div>
          </div>

          {/* Bottom Card: You're in control & Primary Confirm Button */}
          <div className={`p-4 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl ${isCream ? "bg-white border-stone-200" : "border-white/10 bg-[#0C101A]"}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className={`text-xs font-bold ${isCream ? "text-stone-900" : "text-white"}`}>{t.youAreInControl}</h4>
                <p className={`text-[11px] ${isCream ? "text-stone-500" : "text-slate-400"}`}>{t.inControlSubtitle}</p>
              </div>
            </div>

            <button
              onClick={handleConfirmReservationClick}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(20,184,166,0.4)] transition-all hover:scale-[1.02] shrink-0"
            >
              <span>{t.confirmReservationBtn}</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Right Column: {t.reservationSummary} Card (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className={`p-6 rounded-3xl border space-y-5 shadow-2xl ${isCream ? "bg-white border-stone-200" : "border-white/10 bg-[#0C101A]"}`}>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {t.reservationSummary}
            </h3>

            {/* Circular Halo Visual with Concentric Glowing Rings and Real EV Car Photo */}
            <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
              {/* Outer Cyan Glow Ring */}
              <div className="absolute inset-0 rounded-full border border-[#2DD4BF]/30 bg-gradient-to-b from-[#0A2628]/50 via-transparent to-[#041214]/60 shadow-[0_0_35px_rgba(45,212,191,0.2)] animate-pulse"></div>
              {/* Inner Circle Stage */}
              <div className="absolute inset-2 rounded-full border border-[#2DD4BF]/25 bg-gradient-to-b from-[#0B1320] to-[#040810] flex items-center justify-center p-2 overflow-hidden">
                {/* Turntable Floor Glow */}
                <div className="absolute bottom-2 inset-x-4 h-6 bg-[#2DD4BF]/15 blur-md rounded-full"></div>
                
                {/* Stall & Vehicle Composition */}
                <div className="relative z-10 w-full h-full flex items-center justify-between px-1">
                  {/* Glowing DC Fast Charger Stall */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-5 h-14 rounded-lg bg-[#070D18] border border-[#2DD4BF] p-0.5 flex flex-col items-center justify-between shadow-[0_0_12px_rgba(45,212,191,0.5)]">
                      <div className="w-2.5 h-1 rounded-full bg-[#2DD4BF] animate-pulse"></div>
                      <div className="w-3.5 h-4 rounded bg-slate-900 border border-[#2DD4BF]/40 flex items-center justify-center">
                        <Zap className="w-2.5 h-2.5 text-[#2DD4BF]" />
                      </div>
                      <span className="text-[6px] font-mono font-bold text-[#2DD4BF]">120k</span>
                    </div>
                    {/* Glowing Cable Beam */}
                    <div className="w-4 h-0.5 bg-gradient-to-r from-[#2DD4BF] to-transparent mt-1 shadow-[0_0_6px_#2DD4BF]"></div>
                  </div>

                  {/* Real 2D Selected Vehicle Photo Cutout */}
                  <div className="flex-1 flex items-center justify-center -ml-1">
                    <VehicleCutout 
                      modelId={vehicle.id} 
                      modelName={vehicle.model} 
                      paintColor={vehicle.paintColor} 
                      className="w-28 h-18" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Spec Sections */}
            <div className="space-y-3 text-xs divide-y divide-white/5">
              {/* Station */}
              <div className="pt-2">
                <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Station</span>
                <div className="font-bold text-white text-sm mt-0.5">Addis EV Hub</div>
                <div className="text-slate-400 text-[11px]">Bole Road, Addis Ababa</div>
              </div>

              {/* Bay */}
              <div className="pt-3">
                <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Bay</span>
                <div className="font-bold text-white text-sm mt-0.5">{selectedBay}</div>
                <div className="text-slate-400 text-[11px]">120 kW DC Fast • GB/T</div>
              </div>

              {/* Time */}
              <div className="pt-3">
                <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Time</span>
                <div className="font-bold text-white text-sm mt-0.5">{selectedDate}</div>
                <div className="text-slate-400 text-[11px] font-mono">{selectedTimeSlot}</div>
              </div>

              {/* Your Vehicle */}
              <div className="pt-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Your Vehicle</span>
                  <div className="font-bold text-white text-sm mt-0.5">{vehicle.model || 'BYD Seagull'}</div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="px-2 py-0.5 rounded-full bg-[#2DD4BF]/20 text-[#2DD4BF] font-mono text-[10px] font-bold border border-[#2DD4BF]/30 flex items-center gap-1">
                      <Battery className="w-3 h-3" />
                      <span>{vehicle.batterySoc}%</span>
                    </span>
                  </div>
                </div>

                {/* Dynamic Car Cutout */}
                <div className="w-20 h-12 rounded-xl bg-[#080D14] border border-white/10 flex items-center justify-center p-1">
                  <VehicleCutout 
                    modelId={vehicle.id} 
                    modelName={vehicle.model} 
                    paintColor={vehicle.paintColor} 
                    className="w-full h-full" 
                  />
                </div>
              </div>
            </div>

            {/* Why ChargeFlow Card */}
            <div className="p-4 rounded-2xl bg-[#101522] border border-white/5 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>{t.whyChargeFlow}</span>
              </div>
              <div className="space-y-1.5 text-[11px] text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{t.guaranteedBay}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{t.saveTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{t.smartCoordination}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{t.seamlessExperience}</span>
                </div>
              </div>
            </div>

            {/* Strict Two-Stage Pricing Disclosure */}
            <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 space-y-2 text-xs">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-teal-300">Stage 1: Reservation Fee</span>
                <span className="font-mono font-black text-emerald-400">50.00 ETB</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Mandatory 50 ETB paid now to confirm and lock your bay exclusively.
              </p>
              <div className="pt-1 border-t border-white/10 flex items-center justify-between text-[11px] font-semibold text-slate-300">
                <span>Stage 2: Charging Cost</span>
                <span className="font-mono text-teal-300">Billed After Charging</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Calculated as kWh delivered × rate (19.50 ETB/kWh). Paid separately upon disconnect.
              </p>
            </div>

            {reservationError && (
              <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs space-y-1 animate-in fade-in">
                <div className="font-bold flex items-center gap-1.5">
                  <span>⚠️ Reservation not completed</span>
                </div>
                <p className="text-[10px] opacity-90">{reservationError}</p>
              </div>
            )}

            {/* Real Wallet & Reservation Fee Row */}
            <div className="pt-3 border-t border-white/5 space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className={`font-semibold ${isCream ? "text-stone-600" : "text-slate-400"}`}>Reservation Fee (Required)</span>
                <span className="font-mono font-black text-emerald-400">50.00 ETB</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className={`font-semibold ${isCream ? "text-stone-600" : "text-slate-400"}`}>Current Wallet</span>
                <span className={`font-mono font-bold ${wallet.balanceEtb < 50 ? "text-rose-400" : isCream ? "text-stone-900" : "text-white"}`}>
                  {wallet.balanceEtb.toFixed(2)} ETB
                </span>
              </div>

              {wallet.balanceEtb < 50 ? (
                <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[11px] space-y-2">
                  <div className="font-bold flex items-center gap-1.5">
                    <span>⚠️ Insufficient Wallet Balance</span>
                  </div>
                  <p className="text-[10px] opacity-90">
                    A minimum of 50 ETB is required to hold your charging bay.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowTopupModal(true)}
                    className="w-full py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Top Up Wallet (+500 ETB)
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center text-xs pt-1 border-t border-white/5">
                  <span className={`font-semibold ${isCream ? "text-stone-600" : "text-slate-400"}`}>Balance After Deposit</span>
                  <span className="font-mono font-bold text-teal-300">
                    {(wallet.balanceEtb - 50).toFixed(2)} ETB
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Topup Modal */}
      {showTopupModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#111827] border border-emerald-500/30 rounded-3xl p-6 sm:p-7 max-w-sm w-full space-y-5 shadow-2xl">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Top Up ChargeFlow Wallet</h3>
              <p className="text-xs text-slate-400">
                Instant reload via Ethiopian Payment Gateways
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-400">Current Balance:</span>
              <span className="text-sm font-mono font-bold text-white">{wallet.balanceEtb.toFixed(2)} ETB</span>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Select Amount</span>
              <div className="grid grid-cols-3 gap-2">
                {[200, 500, 1000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => {
                      topupWalletBalance(amt, 'Telebirr');
                      setShowTopupModal(false);
                    }}
                    className="py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-mono font-bold text-xs transition-all active:scale-95 cursor-pointer"
                  >
                    +{amt} ETB
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowTopupModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4-Digit PIN Security Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#111827] border border-emerald-500/30 rounded-3xl p-6 sm:p-7 max-w-sm w-full space-y-5 shadow-2xl">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">{t.enterPinTitle}</h3>
              <p className="text-xs text-slate-400">
                {t.confirmBayPinSubtitle} <strong className="text-emerald-400">{user.name}</strong>
              </p>
            </div>

            {reservationError && (
              <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs text-center font-semibold">
                {reservationError}
              </div>
            )}
            {/* 4-Digit Masked Display */}
            <div className="flex justify-center gap-3 py-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-12 h-12 rounded-2xl border flex items-center justify-center text-xl font-mono transition-all ${
                    pin[i]
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                      : 'bg-slate-900 border-white/10 text-slate-600'
                  }`}
                >
                  {pin[i] ? '•' : ''}
                </div>
              ))}
            </div>

            {/* Numeric Keypad */}
            <div className="grid grid-cols-3 gap-2 text-sm font-mono">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((k) => (
                <button
                  key={k}
                  onClick={() => {
                    if (k === 'C') setPin('');
                    else if (k === '⌫') handleDeletePin();
                    else handlePinInput(k);
                  }}
                  className="py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/5 hover:border-emerald-500/30 text-white font-bold transition-all active:scale-95"
                >
                  {k}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setShowPinModal(false);
                setPin('');
                setReservationError('Reservation not completed. Payment was cancelled.');
              }}
              className="w-full py-2 text-xs text-slate-400 hover:text-white text-center transition-colors cursor-pointer"
            >
              {t.cancel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
