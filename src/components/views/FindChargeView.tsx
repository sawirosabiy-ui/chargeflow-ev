import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Zap, 
  Clock, 
  ChevronRight, 
  ChevronDown,
  Filter,
  Heart,
  Maximize2,
  Plus,
  Minus,
  Navigation,
  Crosshair,
  Sparkles,
  Info,
  Check
} from 'lucide-react';
import { useChargeFlowStore } from '../../store/useChargeFlowStore';
import { useTranslation } from '../../localization/useTranslation';
import { EVStation } from '../../types';

export const FindChargeView: React.FC = () => {
  const { t } = useTranslation();
  const stations = useChargeFlowStore((s) => s.stations);
  const selectedStationId = useChargeFlowStore((s) => s.selectedStationId);
  const setView = useChargeFlowStore((s) => s.setView);
  const vehicle = useChargeFlowStore((s) => s.vehicle);
  const theme = useChargeFlowStore((s) => s.theme);
  const isCream = theme === 'cream';

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    availableNow: true,
    dcFast: true,
    gbt: true,
  });
  const [favorites, setFavorites] = useState<Record<string, boolean>>({
    'addis-ev-hub-bole': false,
    'bole-ev-station': true,
  });
  const [mapZoom, setMapZoom] = useState(1);

  // Enhanced Station List matching Finding_charge.jpg
  const stationList = [
    {
      id: 'addis-ev-hub-bole',
      name: 'Addis EV Hub',
      openHours: 'Open 24/7',
      recommended: true,
      availableBays: 5,
      chargingBays: 2,
      waitingCount: 1,
      powerKw: 120,
      protocol: 'DC Fast • GB/T',
      distanceKm: 2.4,
      durationMin: 11,
      pricePerKwh: 24,
      area: 'Bole Medhanialem',
      mapPin: { x: 70, y: 38, count: 4, status: 'available' },
      img: '/images/stations/addis-ev-hub.jpg',
    },
    {
      id: 'bole-ev-station',
      name: 'Bole EV Station',
      openHours: 'Open 24/7',
      recommended: false,
      availableBays: 2,
      chargingBays: 1,
      waitingCount: 0,
      powerKw: 60,
      protocol: 'DC Fast • GB/T',
      distanceKm: 4.1,
      durationMin: 14,
      pricePerKwh: 22,
      area: 'Bole Airport Area',
      mapPin: { x: 82, y: 48, count: 2, status: 'available' },
      img: '/images/stations/kazanchis.jpg',
    },
    {
      id: 'entoto-charging-plaza',
      name: 'Entoto Charging Plaza',
      openHours: 'Open 24/7',
      recommended: false,
      availableBays: 3,
      chargingBays: 3,
      waitingCount: 2,
      powerKw: 120,
      protocol: 'DC Fast • GB/T',
      distanceKm: 6.7,
      durationMin: 18,
      pricePerKwh: 24,
      area: 'Entoto Hills / North Grid',
      mapPin: { x: 65, y: 58, count: 3, status: 'available' },
      img: '/images/stations/addis-ev-hub.jpg',
    },
    {
      id: 'sheger-city-charge',
      name: 'Sheger City Charge',
      openHours: 'Open 06:00 – 22:00',
      recommended: false,
      availableBays: 1,
      chargingBays: 2,
      waitingCount: 1,
      powerKw: 60,
      protocol: 'DC Fast • GB/T',
      distanceKm: 7.9,
      durationMin: 21,
      pricePerKwh: 21,
      area: 'Mexico Square / Central',
      mapPin: { x: 80, y: 70, count: 1, status: 'limited' },
      img: '/images/stations/kazanchis.jpg',
    },
  ];

  const selectedStation = stationList.find((s) => s.id === selectedStationId) || stationList[0];

  const handleSelectStation = (stId: string) => {
    useChargeFlowStore.setState({ selectedStationId: stId });
  };

  const handleReserveClick = (stId: string) => {
    handleSelectStation(stId);
    setView('reservation');
  };

  const toggleFavorite = (stId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [stId]: !prev[stId] }));
  };

  return (
    <div className={`flex-1 overflow-hidden flex flex-col select-none min-w-0 font-sans transition-colors duration-300 ${
      isCream ? 'bg-[#FAF7F2] text-slate-900' : 'bg-[#070B11] text-slate-100'
    }`}>
      {/* 1. Top Header & Search/Filter Controls */}
      <div className={`p-4 sm:p-6 border-b space-y-4 backdrop-blur-md shrink-0 ${
        isCream ? 'bg-[#FAF7F2]/95 border-amber-900/10' : 'bg-[#070B11]/95 border-white/5'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${
              isCream ? 'text-slate-900' : 'text-white'
            }`}>
              {t.findCharging}
            </h1>
            <p className={`text-xs mt-0.5 ${isCream ? 'text-slate-600' : 'text-slate-400'}`}>
              {t.findStationTitle} • <span className="font-semibold text-teal-600 dark:text-teal-400">{vehicle.model}</span>
            </p>
          </div>
        </div>

        {/* Search Bar & Filter Chips Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
            {/* Search Input Box */}
            <div className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs min-w-[220px] max-w-sm flex-1 shadow-inner border transition-all ${
              isCream ? 'bg-white border-amber-900/15 text-slate-900' : 'bg-[#0E131F] border-white/10 text-white'
            }`}>
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={t.searchStationPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`bg-transparent outline-none flex-1 text-xs ${
                  isCream ? 'text-slate-900 placeholder:text-slate-400' : 'text-white placeholder:text-slate-500'
                }`}
              />
            </div>

            {/* Filter Toggle Buttons */}
            <button className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              isCream ? 'bg-white border-amber-900/15 text-slate-800 hover:bg-slate-50' : 'bg-[#0E131F] border-white/10 hover:border-white/20 text-white'
            }`}>
              <Filter className="w-3.5 h-3.5 text-[#2DD4BF]" />
              <span>{t.settings}</span>
              <span className="w-4 h-4 rounded-full bg-[#2DD4BF] text-slate-950 text-[10px] font-bold flex items-center justify-center">2</span>
            </button>

            {/* Chip 1: Available Now */}
            <button 
              onClick={() => setActiveFilters(f => ({ ...f, availableNow: !f.availableNow }))}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                activeFilters.availableNow 
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/40' 
                  : (isCream ? 'bg-white text-slate-600 border-amber-900/10' : 'bg-[#0E131F] text-slate-400 border-white/5')
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>{t.ready}</span>
              <span className="text-slate-400 text-[10px]">✕</span>
            </button>

            {/* Chip 2: DC Fast */}
            <button 
              onClick={() => setActiveFilters(f => ({ ...f, dcFast: !f.dcFast }))}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                activeFilters.dcFast 
                  ? (isCream ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-slate-900 text-white border-white/20')
                  : (isCream ? 'bg-white text-slate-600 border-amber-900/10' : 'bg-[#0E131F] text-slate-400 border-white/5')
              }`}
            >
              <span>DC Fast</span>
              <span className="text-slate-400 text-[10px]">✕</span>
            </button>

            {/* Chip 3: GB/T */}
            <button 
              onClick={() => setActiveFilters(f => ({ ...f, gbt: !f.gbt }))}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                activeFilters.gbt 
                  ? (isCream ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-slate-900 text-white border-white/20')
                  : (isCream ? 'bg-white text-slate-600 border-amber-900/10' : 'bg-[#0E131F] text-slate-400 border-white/5')
              }`}
            >
              <span>GB/T</span>
              <span className="text-slate-400 text-[10px]">✕</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Split Content: Left Station Cards (5 Cols) + Right Interactive Map (7 Cols) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Column: Station List */}
        <div className={`lg:col-span-5 overflow-y-auto p-4 sm:p-5 space-y-4 border-r transition-colors ${
          isCream ? 'bg-[#FAF7F2] border-amber-900/10' : 'bg-[#070B11] border-white/5'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
            <span className={`font-bold font-mono ${isCream ? 'text-slate-800' : 'text-white'}`}>
              {stationList.length} stations
            </span>
            <div className="flex items-center gap-1 text-[11px]">
              <span>{t.findStationTitle}</span>
              <Info className="w-3 h-3 text-slate-400" />
            </div>
          </div>

          {/* Station Cards */}
          {stationList.map((st) => {
            const isSelected = selectedStation?.id === st.id;
            const isFav = !!favorites[st.id];

            return (
              <div
                key={st.id}
                onClick={() => handleSelectStation(st.id)}
                className={`p-4 rounded-3xl border transition-all cursor-pointer space-y-3.5 ${
                  isSelected
                    ? (isCream 
                        ? 'bg-white border-teal-500 shadow-[0_4px_20px_rgba(13,148,136,0.15)] ring-1 ring-teal-500/30'
                        : 'bg-[#0E131F] border-[#2DD4BF]/50 shadow-[0_0_20px_rgba(45,212,191,0.15)] ring-1 ring-[#2DD4BF]/30')
                    : (isCream
                        ? 'bg-white/80 border-amber-900/10 hover:border-amber-900/25 shadow-sm'
                        : 'bg-[#0E131F]/60 border-white/5 hover:border-white/20')
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {/* Station Photo Thumbnail */}
                  <div className="w-20 h-16 rounded-2xl bg-slate-900 border border-white/10 overflow-hidden relative shrink-0">
                    <img 
                      src={st.img} 
                      alt={st.name} 
                      className="w-full h-full object-cover"
                    />
                    {st.recommended && (
                      <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-emerald-500/90 text-slate-950 font-bold text-[8px] tracking-wide uppercase">
                        Recommended
                      </div>
                    )}
                  </div>

                  {/* Title, Open Hours & Favorite Button */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className={`text-sm font-bold tracking-tight ${
                          isCream ? 'text-slate-900' : 'text-white'
                        }`}>{st.name}</h3>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          <span>{st.openHours}</span>
                        </p>
                      </div>

                      <button 
                        onClick={(e) => toggleFavorite(st.id, e)}
                        className={`p-1.5 rounded-full border transition-colors cursor-pointer ${
                          isFav ? 'bg-rose-500/20 border-rose-500/30 text-rose-400' : (isCream ? 'bg-black/5 border-black/5 text-slate-400 hover:text-slate-700' : 'bg-white/5 border-white/5 text-slate-500 hover:text-white')
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-400' : ''}`} />
                      </button>
                    </div>

                    {/* Availability Stats */}
                    <div className="text-[11px] font-mono pt-1 flex items-center gap-1.5 flex-wrap">
                      <span className="text-emerald-500 font-bold">{st.availableBays} {t.availableBaysCount}</span>
                      <span className="opacity-40">•</span>
                      <span className="text-cyan-500">{st.chargingBays} {t.chargingTitle}</span>
                    </div>
                  </div>
                </div>

                {/* Specs: kW & Protocol */}
                <div className={`flex items-center gap-3 text-[11px] font-mono pt-1 border-t ${
                  isCream ? 'border-amber-900/10 text-slate-700' : 'border-white/5 text-slate-300'
                }`}>
                  <span className="flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-[#2DD4BF]" />
                    <strong className={isCream ? 'text-slate-900' : 'text-white'}>{st.powerKw} kW DC Fast</strong>
                  </span>
                  <span className="opacity-40">•</span>
                  <span>{st.protocol.split('• ')[1] || 'GB/T'}</span>
                </div>

                {/* Distance & Rate Bar */}
                <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-slate-400">
                  <div className="flex items-center gap-2">
                    <span>{st.distanceKm} {t.distanceKm}</span>
                    <span className="opacity-40">•</span>
                    <span className="text-[#0D9488] dark:text-[#2DD4BF] font-bold">ETB {st.pricePerKwh} /kWh</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReserveClick(st.id);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-[#2DD4BF]/10 hover:bg-[#2DD4BF] text-[#0D9488] dark:text-[#2DD4BF] hover:text-slate-950 font-bold text-xs border border-[#2DD4BF]/30 hover:border-[#2DD4BF] transition-all shadow-sm cursor-pointer"
                  >
                    {t.reserveThisBay}
                  </button>
                </div>

                <div className="text-[10px] text-emerald-500 font-medium flex items-center gap-1 pt-0.5">
                  <Check className="w-3 h-3" />
                  <span>{t.connectedAndReady}</span>
                </div>
              </div>
            );
          })}

          {/* Bottom "Why this station?" Card */}
          <div className="p-4 rounded-3xl border border-white/10 bg-[#0E131F] flex items-center justify-between gap-3 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#2DD4BF]/10 flex items-center justify-center text-[#2DD4BF] shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Why this station?</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Fastest compatible charger with high availability and low demand right now.
                </p>
              </div>
            </div>

            <button 
              onClick={() => handleReserveClick(selectedStation.id)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-[10px] shrink-0 transition-colors"
            >
              See all recommendations
            </button>
          </div>
        </div>

        {/* Right Column: High-Tech Dark Addis Ababa Map Canvas */}
        <div className="lg:col-span-7 relative bg-[#06090E] overflow-hidden flex flex-col justify-between p-6">
          {/* Map Vector Graphic with Addis Ababa Areas */}
          <div 
            className="absolute inset-0 pointer-events-none transition-transform duration-500"
            style={{ transform: `scale(${mapZoom})` }}
          >
            <svg className="w-full h-full opacity-75" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="cityGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.025)" strokeWidth="1" />
                </pattern>
                <radialGradient id="cityHalo" cx="65%" cy="45%" r="45%">
                  <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#06090E" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#cityGrid)" />
              <circle cx="65%" cy="45%" r="280" fill="url(#cityHalo)" />

              {/* Highway Curves & Ring Roads */}
              <path d="M 80 180 Q 380 90 680 200 T 640 560 T 180 500 Z" fill="none" stroke="#172238" strokeWidth="6" strokeLinecap="round" />
              <path d="M 280 240 L 520 340 L 680 480" fill="none" stroke="#213254" strokeWidth="4" />
              
              {/* Route Line from You to Addis EV Hub */}
              <path 
                d="M 360 380 C 440 330, 520 310, 590 290" 
                fill="none" 
                stroke="#2DD4BF" 
                strokeWidth="3" 
                strokeDasharray="6 4" 
                className="animate-pulse"
              />
            </svg>

            {/* Addis Ababa Neighborhood Labels */}
            <span className="absolute top-[16%] left-[22%] text-[10px] font-mono tracking-widest text-slate-600">GOTERA</span>
            <span className="absolute top-[28%] left-[16%] text-[10px] font-mono tracking-widest text-slate-600">ADDIS KETEMA</span>
            <span className="absolute top-[42%] left-[20%] text-[10px] font-mono tracking-widest text-slate-600">AIDETA</span>
            <span className="absolute top-[44%] left-[34%] text-[10px] font-mono tracking-widest text-slate-600">LIDETA</span>
            <span className="absolute top-[60%] left-[22%] text-[10px] font-mono tracking-widest text-slate-600">NIFAS SILK-LAFTO</span>
            <span className="absolute top-[72%] left-[45%] text-[10px] font-mono tracking-widest text-slate-600">AYAITI</span>
            
            <span className="absolute top-[18%] right-[18%] text-[10px] font-mono tracking-widest text-slate-600">YEKA</span>
            <span className="absolute top-[35%] right-[22%] text-[10px] font-mono tracking-widest text-slate-600">ARADA</span>
            <span className="absolute top-[52%] right-[26%] text-[10px] font-mono tracking-widest text-slate-600">BOLE</span>
            <span className="absolute top-[54%] right-[14%] text-[10px] font-mono tracking-widest text-slate-600">COCA COLA</span>
            <span className="absolute top-[75%] right-[10%] text-[10px] font-mono tracking-widest text-slate-600">Airport</span>
          </div>

          {/* User Location Pulse Marker ("You") */}
          <div className="absolute top-[48%] left-[42%] z-20 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="relative flex items-center justify-center">
              <span className="absolute w-8 h-8 rounded-full bg-cyan-400/30 animate-ping"></span>
              <div className="w-5 h-5 rounded-full bg-cyan-400 border-2 border-slate-950 shadow-[0_0_10px_#06b6d4] flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              </div>
            </div>
            <span className="mt-1 px-2 py-0.5 rounded-md bg-slate-950/80 text-[9px] font-bold text-cyan-300 border border-cyan-500/30">
              You
            </span>
          </div>

          {/* Interactive Station Pins */}
          {stationList.map((st) => {
            const isSelected = selectedStation?.id === st.id;
            const isAvailable = st.mapPin.status === 'available';

            return (
              <div
                key={st.id}
                onClick={() => handleSelectStation(st.id)}
                style={{ top: `${st.mapPin.y}%`, left: `${st.mapPin.x}%` }}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              >
                {/* Pin Circle with Bay Count */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs font-mono border-2 shadow-xl transition-all ${
                  isSelected
                    ? 'bg-[#2DD4BF] text-slate-950 border-white scale-125 shadow-[0_0_20px_#2DD4BF]'
                    : isAvailable
                    ? 'bg-[#0E131F] text-[#2DD4BF] border-[#2DD4BF]/80 hover:scale-110'
                    : 'bg-[#0E131F] text-amber-400 border-amber-400/80 hover:scale-110'
                }`}>
                  {st.mapPin.count}
                </div>

                {/* Pin Label Tag */}
                <div className={`mt-1.5 px-2.5 py-1 rounded-xl bg-slate-950/90 border text-[10px] font-bold whitespace-nowrap shadow-lg flex flex-col items-center ${
                  isSelected ? 'border-[#2DD4BF] text-[#2DD4BF]' : 'border-white/10 text-slate-300'
                }`}>
                  <span>{st.name}</span>
                  <span className="text-[9px] text-emerald-400 font-mono font-normal">{st.availableBays} available</span>
                </div>
              </div>
            );
          })}

          {/* Top Map Controls Bar */}
          <div className="relative z-30 flex items-center justify-between">
            <button className="px-3.5 py-1.5 rounded-xl bg-[#0E131F]/90 backdrop-blur-md border border-white/10 hover:border-white/20 text-xs font-semibold text-white flex items-center gap-2 shadow-lg">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search this area</span>
            </button>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setMapZoom(1)}
                className="p-2 rounded-xl bg-[#0E131F]/90 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white"
                title="Reset View"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>

              <div className="flex flex-col bg-[#0E131F]/90 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
                <button 
                  onClick={() => setMapZoom(Math.min(1.4, mapZoom + 0.1))}
                  className="p-2 text-slate-300 hover:text-white hover:bg-white/5 border-b border-white/5"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => setMapZoom(Math.max(0.8, mapZoom - 0.1))}
                  className="p-2 text-slate-300 hover:text-white hover:bg-white/5"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button className="p-2 rounded-xl bg-[#0E131F]/90 backdrop-blur-md border border-white/10 text-[#2DD4BF]">
                <Crosshair className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bottom Legend & Quick Reserve Card */}
          <div className="relative z-30 space-y-3">
            {/* Status Color Legend */}
            <div className="flex items-center gap-4 text-[10px] font-mono text-slate-400 bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/5 w-fit">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#2DD4BF]"></span>
                <span>Available (3+)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>Limited (1-2)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>Busy (0)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                <span>Offline</span>
              </span>
            </div>

            {/* Selected Station Quick Banner */}
            <div className={`p-4 rounded-3xl border backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl transition-all ${
              isCream
                ? 'border-amber-900/15 bg-white/95 text-slate-900 shadow-[0_10px_30px_rgba(40,20,10,0.1)]'
                : 'border-[#2DD4BF]/40 bg-[#0E131F]/95 text-white shadow-2xl'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#2DD4BF]/10 border border-[#2DD4BF]/30 flex items-center justify-center text-[#0D9488] dark:text-[#2DD4BF] font-black text-sm">
                  ⚡
                </div>
                <div>
                  <h4 className={`text-sm font-bold ${isCream ? 'text-slate-900' : 'text-white'}`}>{selectedStation.name}</h4>
                  <p className="text-xs opacity-70 font-mono mt-0.5">
                    {selectedStation.availableBays} {t.availableBaysCount} • {selectedStation.distanceKm} {t.distanceKm} • ETB {selectedStation.pricePerKwh}/kWh
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleReserveClick(selectedStation.id)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(45,212,191,0.4)] transition-all hover:scale-[1.02] cursor-pointer"
              >
                <span>{t.reserveBayAction}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindChargeView;
