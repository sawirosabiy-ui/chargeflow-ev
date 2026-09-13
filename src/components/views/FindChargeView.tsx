import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Zap, 
  ChevronRight, 
  ChevronLeft,
  Filter, 
  Bookmark,
  Layers,
  Crosshair,
  Compass,
  ArrowRight,
  Check,
  Star,
  X,
  SlidersHorizontal,
  Wifi,
  Coffee,
  Clock,
  Car
} from 'lucide-react';
import { useChargeFlowStore } from '../../store/useChargeFlowStore';
import { useTranslation } from '../../localization/useTranslation';
import { Maximize2, Minimize2, Navigation, Plus, Minus } from 'lucide-react';

interface StationDetail {
  id: string;
  name: string;
  distanceKm: number;
  powerKw: number;
  type: string;
  status: 'available' | 'limited' | 'busy' | 'offline';
  rating: number;
  reviewCount: number;
  connectors: string[];
  pricePerKwh: number;
  chargersCount: number;
  operatingHours: string;
  parking: string;
  amenities: string[];
  imageUrl: string;
  coords: { x: number; y: number };
  pinCount: number;
}

export const FindChargeView: React.FC = () => {
  const { t } = useTranslation();
  const setView = useChargeFlowStore((s) => s.setView);
  const theme = useChargeFlowStore((s) => s.theme);
  const requireAuth = useChargeFlowStore((s) => s.requireAuth);
  const openDirectionsModal = useChargeFlowStore((s) => s.openDirectionsModal);
  const isFullScreenMap = useChargeFlowStore((s) => s.isFullScreenMap);
  const setIsFullScreenMap = useChargeFlowStore((s) => s.setIsFullScreenMap);
  const isCream = theme === 'cream';

  // Sub-views for mobile: 'map' (main screen), 'detail' (Station Details), 'filter' (Filters modal/view), 'nearby' (Nearby Stations list)
  const [mobileSubView, setMobileSubView] = useState<'map' | 'detail' | 'filter' | 'nearby'>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [isBookmarked, setIsBookmarked] = useState<Record<string, boolean>>({ 'addis-ev-hub': true });
  const [quickFilter, setQuickFilter] = useState<'ALL' | 'AVAILABLE' | 'DC_FAST' | 'AC' | 'GBT' | 'CCS' | '50KW'>('ALL');
  const [mapZoom, setMapZoom] = useState(1.0);
  const [mapPan, setMapPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = React.useRef({ x: 0, y: 0, startPanX: 0, startPanY: 0 });

  // Filter states
  const [speedFilter, setSpeedFilter] = useState<'all' | 'fast' | 'ac'>('all');
  const [connectorFilters, setConnectorFilters] = useState<Record<string, boolean>>({
    'GB/T': true,
    'CCS': true,
    'Type 2': false,
    'CHAdeMO': false,
  });
  const [availabilityFilters, setAvailabilityFilters] = useState<Record<string, boolean>>({
    available: true,
    limited: false,
    busy: false,
    offline: false,
  });
  const [priceMax, setPriceMax] = useState(35);

  // Stations matching mockup exactly
  const STATIONS: StationDetail[] = [
    {
      id: 'addis-ev-hub',
      name: 'Addis EV Hub',
      distanceKm: 2.4,
      powerKw: 120,
      type: '120 kW DC Fast',
      status: 'available',
      rating: 4.6,
      reviewCount: 128,
      connectors: ['GB/T', 'CCS', 'Type 2'],
      pricePerKwh: 24,
      chargersCount: 6,
      operatingHours: 'Open 24/7',
      parking: 'Parking available',
      amenities: ['Restrooms & Cafe', 'WiFi'],
      imageUrl: '/images/stations/addis-ev-hub.jpg',
      coords: { x: 64, y: 44 },
      pinCount: 4,
    },
    {
      id: 'bole-ev-station',
      name: 'Bole EV Station',
      distanceKm: 3.8,
      powerKw: 90,
      type: '90 kW DC Fast',
      status: 'available',
      rating: 4.8,
      reviewCount: 94,
      connectors: ['CCS', 'Type 2'],
      pricePerKwh: 26,
      chargersCount: 4,
      operatingHours: 'Open 24/7',
      parking: 'Dedicated EV bays',
      amenities: ['Coffee bar', 'Lounge'],
      imageUrl: '/images/stations/kazanchis.jpg',
      coords: { x: 74, y: 58 },
      pinCount: 2,
    },
    {
      id: 'kazanchis-charge-point',
      name: 'Kazanchis Charge Point',
      distanceKm: 4.6,
      powerKw: 60,
      type: '60 kW DC',
      status: 'available',
      rating: 4.4,
      reviewCount: 52,
      connectors: ['GB/T', 'Type 2'],
      pricePerKwh: 22,
      chargersCount: 4,
      operatingHours: 'Open 24/7',
      parking: 'Underground parking',
      amenities: ['ATM & Security'],
      imageUrl: '/images/stations/addis-ev-hub.jpg',
      coords: { x: 42, y: 38 },
      pinCount: 1,
    },
    {
      id: 'entoto-hills-charge',
      name: 'Entoto Hills Hub',
      distanceKm: 7.1,
      powerKw: 120,
      type: '120 kW DC Fast',
      status: 'limited',
      rating: 4.9,
      reviewCount: 61,
      connectors: ['GB/T', 'CCS'],
      pricePerKwh: 24,
      chargersCount: 4,
      operatingHours: 'Open 06:00 - 22:00',
      parking: 'Scenic overlook',
      amenities: ['Restaurant', 'Viewpoint'],
      imageUrl: '/images/stations/kazanchis.jpg',
      coords: { x: 50, y: 22 },
      pinCount: 3,
    },
  ];

  // Filtered station list based on quickFilter and search
  const filteredStations = STATIONS.filter((st) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = st.name.toLowerCase().includes(q);
      const matchType = st.type.toLowerCase().includes(q);
      if (!matchName && !matchType) return false;
    }
    if (quickFilter === 'AVAILABLE') return st.status === 'available';
    if (quickFilter === 'DC_FAST') return st.powerKw >= 50;
    if (quickFilter === 'AC') return st.powerKw <= 22;
    if (quickFilter === 'GBT') return st.connectors.includes('GB/T');
    if (quickFilter === 'CCS') return st.connectors.includes('CCS');
    if (quickFilter === '50KW') return st.powerKw >= 50;
    return true;
  });

  const [selectedStation, setSelectedStation] = useState<StationDetail>(STATIONS[0]);

  const handleSelectStation = (st: StationDetail) => {
    setSelectedStation(st);
  };

  const handleReserve = (st: StationDetail) => {
    useChargeFlowStore.setState({ selectedStationId: st.id });
    const hasAuth = requireAuth({ view: 'reservation' });
    if (hasAuth) {
      setView('reservation');
    }
  };

  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsBookmarked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className={`flex-1 flex flex-col h-full w-full select-none overflow-hidden relative font-sans ${
      isCream ? 'bg-[#FAF8F5] text-slate-900' : 'bg-[#06090E] text-slate-100'
    }`}>
      
      {/* ========================================================================= */}
      {/* 1. FILTER OVERLAY VIEW (Shown when user taps Filter / More)                */}
      {/* ========================================================================= */}
      {mobileSubView === 'filter' && (
        <div className="absolute inset-0 z-50 flex flex-col bg-[#070B12] text-white p-5 space-y-6 animate-in slide-in-from-right duration-200 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between pt-2">
            <button 
              onClick={() => setMobileSubView('map')}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-base font-bold tracking-tight">Filters</h2>
            <button 
              onClick={() => setMobileSubView('map')}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Charging Speed Filter */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Charging Speed</h3>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setSpeedFilter('all')}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  speedFilter === 'all'
                    ? 'bg-teal-500/20 border-teal-400 text-teal-300'
                    : 'bg-white/5 border-white/5 text-slate-400'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSpeedFilter('fast')}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  speedFilter === 'fast'
                    ? 'bg-teal-500/20 border-teal-400 text-teal-300'
                    : 'bg-white/5 border-white/5 text-slate-400'
                }`}
              >
                <div>DC Fast</div>
                <div className="text-[9px] font-normal opacity-70">(≥ 50 kW)</div>
              </button>
              <button
                onClick={() => setSpeedFilter('ac')}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  speedFilter === 'ac'
                    ? 'bg-teal-500/20 border-teal-400 text-teal-300'
                    : 'bg-white/5 border-white/5 text-slate-400'
                }`}
              >
                <div>AC</div>
                <div className="text-[9px] font-normal opacity-70">(≤ 22 kW)</div>
              </button>
            </div>
          </div>

          {/* Connectors Filter */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Connectors</h3>
            <div className="space-y-2">
              {['GB/T', 'CCS', 'Type 2', 'CHAdeMO'].map((conn) => (
                <div 
                  key={conn}
                  onClick={() => setConnectorFilters(prev => ({ ...prev, [conn]: !prev[conn] }))}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400 font-mono text-[10px] font-bold">
                      ⚡
                    </div>
                    <span className="text-xs font-semibold">{conn}</span>
                  </div>
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                    connectorFilters[conn] ? 'bg-teal-500 border-teal-400 text-slate-950' : 'border-white/20'
                  }`}>
                    {connectorFilters[conn] && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Availability Filter */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Availability</h3>
            <div className="space-y-2">
              {[
                { key: 'available', label: 'Available', color: 'bg-emerald-400' },
                { key: 'limited', label: 'Limited', color: 'bg-amber-400' },
                { key: 'busy', label: 'Busy', color: 'bg-rose-500' },
                { key: 'offline', label: 'Offline', color: 'bg-slate-500' }
              ].map(({ key, label, color }) => (
                <div 
                  key={key}
                  onClick={() => setAvailabilityFilters(prev => ({ ...prev, [key]: !prev[key] }))}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
                    <span className="text-xs font-semibold">{label}</span>
                  </div>
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                    availabilityFilters[key] ? 'bg-teal-500 border-teal-400 text-slate-950' : 'border-white/20'
                  }`}>
                    {availabilityFilters[key] && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Price Range (ETB/kWh)</h3>
              <span className="text-xs font-mono font-bold text-teal-400">Up to {priceMax} ETB</span>
            </div>
            <input 
              type="range"
              min={15}
              max={60}
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>0 ETB</span>
              <span>100+ ETB</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 pt-4">
            <button 
              onClick={() => {
                setSpeedFilter('all');
                setConnectorFilters({ 'GB/T': true, 'CCS': true, 'Type 2': false, 'CHAdeMO': false });
                setPriceMax(35);
              }}
              className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-bold text-xs hover:bg-white/10 transition-colors"
            >
              Reset
            </button>
            <button 
              onClick={() => setMobileSubView('map')}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(45,212,191,0.4)]"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. STATION DETAILS VIEW (Shown when user taps station card from map/list)   */}
      {/* ========================================================================= */}
      {mobileSubView === 'detail' && (
        <div className="absolute inset-0 z-50 flex flex-col bg-[#070B12] text-white overflow-y-auto animate-in slide-in-from-right duration-200 select-none">
          {/* Top Bar with Back & Bookmark */}
          <div className="flex items-center justify-between p-4 sticky top-0 z-20 bg-[#070B12]/80 backdrop-blur-md border-b border-white/5">
            <button 
              onClick={() => setMobileSubView('map')}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-sm font-bold tracking-wide">Station Details</h2>
            <button 
              onClick={(e) => toggleBookmark(selectedStation.id, e)}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white cursor-pointer"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked[selectedStation.id] ? 'fill-teal-400 text-teal-400' : 'text-slate-400'}`} />
            </button>
          </div>

          <div className="p-4 space-y-4 pb-28">
            {/* Hero Image Carousel Card */}
            <div className="relative w-full h-52 rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900">
              <img 
                src={selectedStation.imageUrl} 
                alt={selectedStation.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/stations/addis-ev-hub.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              {/* Photo Counter */}
              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/60 border border-white/10 backdrop-blur-md text-[10px] font-mono text-slate-200">
                1/5
              </div>
            </div>

            {/* Title & Badge */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-black tracking-tight">{selectedStation.name}</h1>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>available</span>
                </div>
              </div>

              {/* Sub-specs */}
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>{selectedStation.distanceKm} km</span>
                <span>•</span>
                <span>{selectedStation.type}</span>
              </div>

              {/* Reviews */}
              <div className="flex items-center gap-1.5 pt-1 text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-bold text-white">{selectedStation.rating}</span>
                <span className="text-slate-400">({selectedStation.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Connectors Pills */}
            <div className="flex items-center gap-2 pt-1 overflow-x-auto pb-1">
              {selectedStation.connectors.map((c) => (
                <div 
                  key={c}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 font-medium"
                >
                  <span className="text-teal-400 text-xs">⚡</span>
                  <span>{c}</span>
                </div>
              ))}
            </div>

            {/* Rate Price */}
            <div className="py-2 border-y border-white/5 flex items-baseline gap-1">
              <span className="text-xs text-slate-400 font-mono font-bold">ETB</span>
              <span className="text-2xl font-black text-white font-mono">{selectedStation.pricePerKwh}</span>
              <span className="text-xs text-slate-400">/kWh</span>
            </div>

            {/* Station Info Section */}
            <div className="space-y-3 pt-1">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Station Info</h3>
              
              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-3">
                  <Zap className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>{selectedStation.chargersCount} chargers • {selectedStation.type}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>{selectedStation.operatingHours}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Car className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>{selectedStation.parking}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Coffee className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>{selectedStation.amenities.join(' & ')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Wifi className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Free High-Speed WiFi</span>
                </div>
              </div>
            </div>

            {/* Mini Map Route Preview Card */}
            <div className="relative w-full h-32 rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-[#040711] flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
                <path d="M 40 100 Q 150 40 280 80 T 360 40" fill="none" stroke="#1D2A44" strokeWidth="6" />
                <path d="M 60 90 L 180 50 L 260 70" fill="none" stroke="#2DD4BF" strokeWidth="3" strokeDasharray="5 3" />
              </svg>
              <div className="absolute top-3 left-4 text-[10px] font-mono text-slate-400">
                አዲስ አበባ • Bole Hub
              </div>
              <button className="relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-teal-500/40 text-teal-300 font-bold text-xs shadow-md">
                <Compass className="w-3.5 h-3.5" />
                <span>Get Directions</span>
              </button>
            </div>
          </div>

          {/* Sticky Bottom Actions: Prominent Get Directions & Reserve for 50 ETB */}
          <div className="fixed bottom-0 inset-x-0 p-4 bg-[#070B12]/95 backdrop-blur-xl border-t border-white/10 z-30 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => openDirectionsModal({
                name: selectedStation.name,
                address: 'Bole Road, Near Bole Medhanialem, Addis Ababa',
                distanceKm: selectedStation.distanceKm,
                etaMin: 7,
                baysAvailable: `${selectedStation.pinCount} / ${selectedStation.chargersCount} bays available`,
                powerKw: selectedStation.powerKw,
              })}
              className="py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-teal-300 border border-teal-500/30 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Navigation className="w-4 h-4 stroke-[2.5]" />
              <span>GET DIRECTIONS</span>
            </button>

            <button
              type="button"
              onClick={() => handleReserve(selectedStation)}
              className="py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-transform hover:scale-[1.01] cursor-pointer"
            >
              <span>RESERVE FOR 50 ETB</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. NEARBY STATIONS LIST VIEW (Shown when user clicks "View list")           */}
      {/* ========================================================================= */}
      {mobileSubView === 'nearby' && (
        <div className="absolute inset-0 z-50 flex flex-col bg-[#070B12] text-white p-4 space-y-4 overflow-y-auto animate-in slide-in-from-bottom duration-200 select-none">
          {/* Top Bar */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setMobileSubView('map')}
                className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-base font-bold tracking-tight">Nearby Stations</h2>
            </div>
            <div className="text-xs text-slate-400 border border-white/10 px-2.5 py-1 rounded-xl bg-white/5">
              Sort by distance ▾
            </div>
          </div>

          {/* List of Stations */}
          <div className="space-y-3 pt-2">
            {STATIONS.map((st) => (
              <div 
                key={st.id}
                onClick={() => {
                  setSelectedStation(st);
                  setMobileSubView('detail');
                }}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-teal-500/40 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-slate-900">
                    <img 
                      src={st.imageUrl} 
                      alt={st.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/stations/addis-ev-hub.jpg';
                      }}
                    />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-white truncate">{st.name}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-bold shrink-0">
                        {st.pinCount} available
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {st.distanceKm} km • {st.type}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-300">
                      <span className="font-mono font-bold text-teal-400">ETB {st.pricePerKwh}/kWh</span>
                      <span>•</span>
                      <span className="opacity-70">{st.connectors.join(', ')}</span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MAIN MAP SCREEN (Interactive Dark Addis Map + Search + Floating Card)    */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        
        {/* Top Search & Filter Bar Overlay */}
        <div className="absolute top-3 inset-x-3 sm:inset-x-6 z-30 space-y-2 pointer-events-auto">
          {/* Header Title & Back */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <button 
                onClick={() => setView('cockpit')}
                className="p-2 rounded-xl bg-[#08101E]/80 backdrop-blur-md border border-white/10 hover:border-white/20 text-white cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div>
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white leading-tight">Find Charging</h1>
                <p className="text-[10px] text-slate-400">Find the best charger near you</p>
              </div>
            </div>

            {/* Full-Screen Map Mode Toggle Button */}
            <button
              onClick={() => setIsFullScreenMap(!isFullScreenMap)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl backdrop-blur-md border text-xs font-bold transition-all shadow-lg cursor-pointer ${
                isFullScreenMap
                  ? 'bg-teal-500 text-slate-950 border-teal-400'
                  : 'bg-[#08101E]/85 hover:bg-white/10 border-white/15 text-teal-300'
              }`}
              title={isFullScreenMap ? "Exit Fullscreen" : "Expand to Full Screen Map"}
            >
              {isFullScreenMap ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Exit Fullscreen</span>
                  <span className="sm:hidden">Exit</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Full Map</span>
                  <span className="sm:hidden">Full</span>
                </>
              )}
            </button>
          </div>

          {/* Search Input */}
          <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-[#09111E]/90 backdrop-blur-xl border border-white/10 shadow-2xl">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search station, area or address..."
              className="bg-transparent outline-none w-full text-xs text-white placeholder-slate-500"
            />
          </div>

          {/* Quick Filter Pill Badges matching user prompt */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
            {[
              { id: 'ALL', label: 'ALL' },
              { id: 'AVAILABLE', label: 'AVAILABLE', icon: true },
              { id: 'DC_FAST', label: 'DC FAST' },
              { id: 'AC', label: 'AC' },
              { id: 'GBT', label: 'GB/T' },
              { id: 'CCS', label: 'CCS' },
              { id: '50KW', label: '50+ kW' },
            ].map((chip) => {
              const active = quickFilter === chip.id;
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => setQuickFilter(chip.id as any)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer border ${
                    active
                      ? 'bg-teal-500/25 border-teal-400 text-teal-300 shadow-[0_0_12px_rgba(45,212,191,0.3)]'
                      : 'bg-[#0E1524]/80 backdrop-blur-md border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {chip.icon && <Zap className="w-3 h-3 fill-current text-emerald-400" />}
                  <span>{chip.label}</span>
                </button>
              );
            })}

            <button 
              onClick={() => setMobileSubView('filter')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#0E1524]/80 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white text-xs font-semibold shrink-0 cursor-pointer"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>More</span>
            </button>
          </div>
        </div>

        {/* High-Tech Dark Addis Ababa Map Canvas with Pan & Zoom */}
        <div 
          onPointerDown={(e) => {
            const target = e.target as HTMLElement;
            if (target.closest('button') || target.closest('.cursor-pointer')) return;
            setIsPanning(true);
            panStartRef.current = {
              x: e.clientX,
              y: e.clientY,
              startPanX: mapPan.x,
              startPanY: mapPan.y,
            };
          }}
          onPointerMove={(e) => {
            if (!isPanning) return;
            const dx = e.clientX - panStartRef.current.x;
            const dy = e.clientY - panStartRef.current.y;
            setMapPan({
              x: panStartRef.current.startPanX + dx,
              y: panStartRef.current.startPanY + dy,
            });
          }}
          onPointerUp={() => setIsPanning(false)}
          onPointerCancel={() => setIsPanning(false)}
          className={`w-full h-full relative bg-[#040711] overflow-hidden ${isPanning ? 'cursor-grabbing' : 'cursor-grab'} touch-none`}
        >
          {/* Scalable & Pannable Map Layer */}
          <div 
            style={{
              transform: `translate(${mapPan.x}px, ${mapPan.y}px) scale(${mapZoom})`,
              transformOrigin: '50% 50%',
              transition: isPanning ? 'none' : 'transform 0.2s cubic-bezier(0.2, 0, 0, 1)',
            }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Map Vector Graphic */}
            <svg className="absolute inset-0 w-full h-full opacity-65" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="roadGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#roadGrid)" />

            {/* Main Road Networks of Addis Ababa */}
            <path d="M 50 120 Q 200 80 400 160 T 600 450 T 200 650" fill="none" stroke="#121D32" strokeWidth="8" strokeLinecap="round" />
            <path d="M 120 400 L 320 320 L 520 220" fill="none" stroke="#1A2844" strokeWidth="5" />
            <path d="M 220 180 L 380 420 L 560 540" fill="none" stroke="#1A2844" strokeWidth="4" />
            
            {/* Route Pulse to Selected Station */}
            <path 
              d="M 180 360 C 240 330, 310 320, 380 290" 
              fill="none" 
              stroke="#2DD4BF" 
              strokeWidth="3.5" 
              strokeDasharray="6 4" 
              className="animate-pulse" 
            />
          </svg>

          {/* Area Labels (Addis Ababa / Kazanchis / Bole) */}
          <div className="absolute top-[38%] left-[28%] text-center pointer-events-none">
            <div className="text-xs font-black tracking-widest text-slate-500 uppercase">Addis Ababa</div>
            <div className="text-[10px] text-slate-600 font-medium font-amharic">አዲስ አበባ</div>
          </div>

          <div className="absolute top-[48%] left-[10%] text-center pointer-events-none">
            <div className="text-[10px] font-bold text-slate-500">Kazanchis</div>
            <div className="text-[9px] text-slate-600 font-amharic">ካዛንቺስ</div>
          </div>

          <div className="absolute top-[58%] right-[16%] text-center pointer-events-none">
            <div className="text-[10px] font-bold text-slate-500">Bole</div>
            <div className="text-[9px] text-slate-600 font-amharic">ቦሌ</div>
          </div>

          {/* User Location Pulse Marker */}
          <div className="absolute top-[50%] left-[36%] z-20 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
            <span className="w-8 h-8 rounded-full bg-cyan-400/25 animate-ping absolute" />
            <div className="w-5 h-5 rounded-full bg-cyan-400 border-2 border-slate-950 flex items-center justify-center shadow-[0_0_12px_#06b6d4]">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
          </div>

          {/* Station Map Pins (Filtered by QuickFilter with Standard Availability Colors) */}
          {filteredStations.map((st) => {
            const isSelected = selectedStation.id === st.id;
            return (
              <div 
                key={st.id}
                onClick={() => handleSelectStation(st)}
                style={{ top: `${st.coords.y}%`, left: `${st.coords.x}%` }}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110 active:scale-95"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-2xl border-2 transition-all ${
                  isSelected
                    ? 'bg-teal-400 text-slate-950 border-white scale-125 shadow-[0_0_20px_#2DD4BF]'
                    : st.status === 'available'
                    ? 'bg-[#0E1522] text-teal-300 border-teal-400 shadow-[0_0_12px_rgba(45,212,191,0.3)]'
                    : 'bg-[#0E1522] text-amber-400 border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.3)]'
                }`}>
                  {st.pinCount}
                </div>
              </div>
            );
          })}

          </div>

          {/* Google Watermark */}
          <div className="absolute bottom-32 left-4 z-20 text-[11px] font-bold text-slate-500/70 select-none pointer-events-none">
            Google
          </div>

          {/* Floating Right Map Tool Action Buttons: Zoom & Location */}
          <div className="absolute right-3.5 top-[32%] z-20 flex flex-col gap-2 pointer-events-auto">
            {/* Zoom In */}
            <button 
              onClick={() => setMapZoom((prev) => Math.min(2.0, +(prev + 0.15).toFixed(2)))}
              className="w-9 h-9 rounded-xl bg-[#08101E]/90 backdrop-blur-md border border-white/15 flex items-center justify-center text-slate-200 hover:text-white shadow-lg cursor-pointer hover:bg-white/10 transition-colors"
              title="Zoom In"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Zoom Out */}
            <button 
              onClick={() => setMapZoom((prev) => Math.max(0.75, +(prev - 0.15).toFixed(2)))}
              className="w-9 h-9 rounded-xl bg-[#08101E]/90 backdrop-blur-md border border-white/15 flex items-center justify-center text-slate-200 hover:text-white shadow-lg cursor-pointer hover:bg-white/10 transition-colors"
              title="Zoom Out"
            >
              <Minus className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Recenter Location */}
            <button 
              onClick={() => {
                setMapZoom(1.0);
                setMapPan({ x: 0, y: 0 });
              }}
              className="w-9 h-9 rounded-xl bg-[#08101E]/90 backdrop-blur-md border border-white/15 flex items-center justify-center text-teal-400 hover:text-teal-300 shadow-lg cursor-pointer hover:bg-white/10 transition-colors"
              title="Recenter Map"
            >
              <Crosshair className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Fullscreen Toggle */}
            <button 
              onClick={() => setIsFullScreenMap(!isFullScreenMap)}
              className="w-9 h-9 rounded-xl bg-[#08101E]/90 backdrop-blur-md border border-white/15 flex items-center justify-center text-teal-400 hover:text-teal-300 shadow-lg cursor-pointer hover:bg-white/10 transition-colors"
              title="Toggle Fullscreen"
            >
              {isFullScreenMap ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Bottom Floating Station Preview Card */}
          <div className="absolute bottom-3 inset-x-3 sm:inset-x-6 z-20 pointer-events-auto">
            <div 
              onClick={() => setMobileSubView('detail')}
              className="p-4 rounded-3xl bg-[#09111E]/95 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.9)] space-y-3 cursor-pointer group transition-all hover:border-teal-500/40"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-white/10 bg-slate-900 shadow-md">
                    <img 
                      src={selectedStation.imageUrl} 
                      alt={selectedStation.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/stations/addis-ev-hub.jpg';
                      }}
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-black text-white truncate">{selectedStation.name}</h3>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {selectedStation.distanceKm} km • {selectedStation.type}
                    </div>
                    {/* Connectors Tags */}
                    <div className="flex items-center gap-1.5 mt-1">
                      {selectedStation.connectors.slice(0, 2).map((c) => (
                        <span key={c} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 font-mono">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                    <Zap className="w-2.5 h-2.5 fill-current" />
                    <span>available</span>
                  </div>
                  <div className="text-xs font-black font-mono text-white mt-1.5">
                    ETB {selectedStation.pricePerKwh}/kWh
                  </div>
                </div>
              </div>

              {/* Prominent Action Buttons: Get Directions & Reserve for 50 ETB */}
              <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => openDirectionsModal({
                    name: selectedStation.name,
                    address: 'Bole Road, Near Bole Medhanialem, Addis Ababa',
                    distanceKm: selectedStation.distanceKm,
                    etaMin: 7,
                    baysAvailable: `${selectedStation.pinCount} / ${selectedStation.chargersCount} bays available`,
                    powerKw: selectedStation.powerKw,
                  })}
                  className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-teal-300 border border-teal-500/30 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>GET DIRECTIONS</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleReserve(selectedStation)}
                  className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.35)] transition-all hover:scale-[1.01] cursor-pointer"
                >
                  <span>RESERVE FOR 50 ETB</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                </button>
              </div>
            </div>

            {/* Quick Summary Strip Below Card */}
            <div className="flex items-center justify-between px-2 pt-2 text-[10px] text-slate-400">
              <span>Showing {STATIONS.length} stations in Addis Ababa</span>
              <button 
                onClick={() => setMobileSubView('nearby')}
                className="text-teal-400 font-bold hover:underline cursor-pointer"
              >
                View list
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindChargeView;
