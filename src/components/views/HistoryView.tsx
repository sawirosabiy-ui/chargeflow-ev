import React, { useState } from 'react';
import { 
  Zap, 
  Battery, 
  Clock, 
  Wallet, 
  Tag, 
  Search, 
  Filter, 
  Download, 
  ChevronRight, 
  ChevronLeft, 
  MapPin, 
  Info, 
  Leaf, 
  Calendar, 
  Bell, 
  Receipt, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useChargeFlowStore } from '../../store/useChargeFlowStore';
import { useTranslation } from '../../localization/useTranslation';

interface HistoryRecord {
  id: string;
  date: string;
  time: string;
  station: string;
  bay: string;
  power: string;
  energyKwh: number;
  avgKw: number;
  durationMin: number;
  costEtb: number;
  ratePerKwh: number;
  status: string;
}

export const HistoryView: React.FC = () => {
  const user = useChargeFlowStore((s) => s.user);
  const vehicle = useChargeFlowStore((s) => s.vehicle);
  const history = useChargeFlowStore((s) => s.history);
  const setView = useChargeFlowStore((s) => s.setView);
  const theme = useChargeFlowStore((s) => s.theme);
  const { t } = useTranslation();
  const isCream = theme === 'cream';

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Standard History dataset matching Charging history.jpg
  const defaultHistory: HistoryRecord[] = [
    {
      id: 'SES-0982',
      date: 'May 28, 2025',
      time: '14:30 – 15:02',
      station: 'Addis EV Hub',
      bay: 'Bay 03 • DC Fast',
      power: '120 kW',
      energyKwh: 24.6,
      avgKw: 86,
      durationMin: 32,
      costEtb: 576,
      ratePerKwh: 23.4,
      status: 'Completed',
    },
    {
      id: 'SES-0954',
      date: 'May 27, 2025',
      time: '10:12 – 10:44',
      station: 'Addis EV Hub',
      bay: 'Bay 05 • DC Fast',
      power: '120 kW',
      energyKwh: 22.1,
      avgKw: 82,
      durationMin: 32,
      costEtb: 508,
      ratePerKwh: 23.0,
      status: 'Completed',
    },
    {
      id: 'SES-0912',
      date: 'May 25, 2025',
      time: '16:45 – 17:21',
      station: 'Entoto Charging Plaza',
      bay: 'Bay 02 • DC Fast',
      power: '120 kW',
      energyKwh: 28.3,
      avgKw: 87,
      durationMin: 36,
      costEtb: 662,
      ratePerKwh: 23.4,
      status: 'Completed',
    },
    {
      id: 'SES-0881',
      date: 'May 23, 2025',
      time: '09:20 – 09:55',
      station: 'Bole EV Station',
      bay: 'Bay 01 • DC Fast',
      power: '120 kW',
      energyKwh: 25.7,
      avgKw: 85,
      durationMin: 35,
      costEtb: 601,
      ratePerKwh: 23.4,
      status: 'Completed',
    },
    {
      id: 'SES-0840',
      date: 'May 21, 2025',
      time: '18:10 – 18:40',
      station: 'Addis EV Hub',
      bay: 'Bay 04 • DC Fast',
      power: '120 kW',
      energyKwh: 19.8,
      avgKw: 79,
      durationMin: 30,
      costEtb: 455,
      ratePerKwh: 22.9,
      status: 'Completed',
    },
    {
      id: 'SES-0810',
      date: 'May 19, 2025',
      time: '11:05 – 11:36',
      station: 'Summit EV Center',
      bay: 'Bay 02 • DC Fast',
      power: '120 kW',
      energyKwh: 21.4,
      avgKw: 83,
      durationMin: 31,
      costEtb: 489,
      ratePerKwh: 22.9,
      status: 'Completed',
    },
  ];

  const filteredHistory = defaultHistory.filter((item) => 
    item.station.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.date.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-6 select-none min-w-0 font-sans transition-colors duration-300 ${isCream ? "bg-[#FAF8F5] text-stone-900" : "bg-[#070B11] text-slate-100"}`}>

      {/* 1. Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${isCream ? "text-stone-900" : "text-white"}`}>{t.historyTitle}</h1>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>LIVE</span>
            </span>
          </div>
          <p className={`text-xs mt-0.5 ${isCream ? "text-stone-500" : "text-slate-400"}`}>{t.pastChargingSessions}</p>
        </div>

        {/* Date Range Selector Pill */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0E131F] border border-white/10 text-xs font-semibold text-white shadow-sm hover:border-white/20 transition-all">
            <Calendar className="w-3.5 h-3.5 text-[#2DD4BF]" />
            <span>Date range: May 1 – May 31, 2025</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          <div className="relative p-2 rounded-xl bg-[#0E131F] border border-white/5 text-slate-300">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#2DD4BF]"></span>
          </div>
        </div>
      </div>

      {/* 2. Top 5 Metrics Cards Row (Matching Charging history.jpg) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Card 1: Total Sessions */}
        <div className={`p-4 rounded-3xl border ${isCream ? "bg-white border-stone-200 shadow-sm" : "border-white/10 bg-[#0E131F]"} space-y-2`}>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Zap className="w-4 h-4" />
            </div>
            <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> 14% vs Apr
            </span>
          </div>
          <div>
            <div className={`text-[11px] ${isCream ? "text-stone-500" : "text-slate-400"}`}>{t.totalSessions}</div>
            <div className="text-2xl font-black text-white font-mono">16</div>
          </div>
        </div>

        {/* Card 2: Total Energy */}
        <div className={`p-4 rounded-3xl border ${isCream ? "bg-white border-stone-200 shadow-sm" : "border-white/10 bg-[#0E131F]"} space-y-2`}>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <Battery className="w-4 h-4" />
            </div>
            <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> 18% vs Apr
            </span>
          </div>
          <div>
            <div className={`text-[11px] ${isCream ? "text-stone-500" : "text-slate-400"}`}>{t.totalEnergyCharged}</div>
            <div className="text-2xl font-black text-white font-mono">248.7 <span className="text-xs text-slate-400 font-normal">kWh</span></div>
          </div>
        </div>

        {/* Card 3: Total Time */}
        <div className={`p-4 rounded-3xl border ${isCream ? "bg-white border-stone-200 shadow-sm" : "border-white/10 bg-[#0E131F]"} space-y-2`}>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> 12% vs Apr
            </span>
          </div>
          <div>
            <div className={`text-[11px] ${isCream ? "text-stone-500" : "text-slate-400"}`}>{t.totalTime}</div>
            <div className="text-2xl font-black text-white font-mono">7h 24m</div>
          </div>
        </div>

        {/* Card 4: Total Cost */}
        <div className={`p-4 rounded-3xl border ${isCream ? "bg-white border-stone-200 shadow-sm" : "border-white/10 bg-[#0E131F]"} space-y-2`}>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="w-8 h-8 rounded-xl bg-[#2DD4BF]/10 flex items-center justify-center text-[#2DD4BF]">
              <Wallet className="w-4 h-4" />
            </div>
            <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> 16% vs Apr
            </span>
          </div>
          <div>
            <div className={`text-[11px] ${isCream ? "text-stone-500" : "text-slate-400"}`}>{t.totalSpent}</div>
            <div className="text-2xl font-black text-emerald-400 font-mono">ETB 5,678</div>
          </div>
        </div>

        {/* Card 5: Avg Cost / kWh */}
        <div className={`p-4 rounded-3xl border ${isCream ? "bg-white border-stone-200 shadow-sm" : "border-white/10 bg-[#0E131F]"} space-y-2`}>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400">
              <Tag className="w-4 h-4" />
            </div>
            <span className="text-[10px] text-cyan-400 font-mono font-bold flex items-center gap-0.5">
              <ArrowDownRight className="w-3 h-3" /> 3% vs Apr
            </span>
          </div>
          <div>
            <div className={`text-[11px] ${isCream ? "text-stone-500" : "text-slate-400"}`}>{t.avgCostPerKwh}</div>
            <div className="text-2xl font-black text-white font-mono">ETB 22.8</div>
          </div>
        </div>
      </div>

      {/* 3. Main Split Grid: Left Session History (8 Cols) + Right Insights (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Session History Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className={`p-5 sm:p-6 rounded-3xl border ${isCream ? "bg-white border-stone-200 shadow-sm" : "border-white/10 bg-[#0E131F]"} space-y-5 shadow-2xl`}>
            {/* Table Search & Export Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 min-w-0">
              <div className="text-[11px] font-mono font-bold tracking-widest text-[#2DD4BF] uppercase shrink-0">
                {t.sessionHistoryTitle}
              </div>

              <div className="flex flex-wrap items-center gap-2 min-w-0">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${isCream ? "bg-stone-100 text-stone-800" : "bg-[#131A29]"} border border-white/5 text-xs text-white flex-1 min-w-[150px] sm:w-48 md:w-56 sm:flex-initial`}>
                  <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder={t.searchSessionsPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent outline-none w-full text-xs text-white placeholder:text-slate-500"
                  />
                </div>

                <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl shrink-0 ${isCream ? "bg-stone-100 text-stone-800 hover:bg-stone-200" : "bg-[#131A29] hover:bg-[#1A2338]"} border border-white/5 text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer`}>
                  <Filter className="w-3.5 h-3.5 text-[#2DD4BF]" />
                  <span>{t.filterBtn}</span>
                </button>

                <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl shrink-0 ${isCream ? "bg-stone-100 text-stone-800 hover:bg-stone-200" : "bg-[#131A29] hover:bg-[#1A2338]"} border border-white/5 text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer`}>
                  <Download className="w-3.5 h-3.5 text-[#2DD4BF]" />
                  <span>{t.exportBtn}</span>
                </button>
              </div>
            </div>

            {/* Mobile View: Clean Stacked Cards (< md) */}
            <div className="block md:hidden space-y-3">
              {filteredHistory.map((row) => (
                <div
                  key={row.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isCream 
                      ? "bg-stone-50 border-stone-200 shadow-sm" 
                      : "bg-[#111726] border-white/5 hover:border-teal-500/30"
                  } space-y-3`}
                >
                  {/* Card Header: Station & Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 font-bold text-white text-sm">
                        <MapPin className="w-3.5 h-3.5 text-[#2DD4BF] shrink-0" />
                        <span className="truncate">{row.station}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {row.bay} • {row.power}
                      </div>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20 shrink-0">
                      {row.status}
                    </span>
                  </div>

                  {/* Card Body: 3-column stats */}
                  <div className={`grid grid-cols-3 gap-2 pt-2.5 border-t ${isCream ? "border-stone-200" : "border-white/5"} text-xs font-mono`}>
                    <div>
                      <div className="text-[10px] text-slate-400 font-sans">Energy</div>
                      <div className="font-bold text-white mt-0.5">{row.energyKwh} kWh</div>
                      <div className="text-[9px] text-slate-500">{row.avgKw} kW avg</div>
                    </div>

                    <div>
                      <div className="text-[10px] text-slate-400 font-sans">Duration</div>
                      <div className="font-bold text-white mt-0.5">{row.durationMin} min</div>
                      <div className="text-[9px] text-slate-500">{row.date.split(',')[0]}</div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 font-sans">Total Cost</div>
                      <div className="font-black text-emerald-400 mt-0.5">ETB {row.costEtb}</div>
                      <div className="text-[9px] text-slate-500">ETB {row.ratePerKwh}/kWh</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View: Full Sessions Table (>= md) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full min-w-[640px] text-xs font-mono text-left">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] text-slate-500 uppercase">
                    <th className="pb-3 font-normal">{t.dateLabel}</th>
                    <th className="pb-3 font-normal">{t.stationLabel}</th>
                    <th className="pb-3 font-normal">{t.power}</th>
                    <th className="pb-3 font-normal">{t.duration}</th>
                    <th className="pb-3 font-normal">{t.cost}</th>
                    <th className="pb-3 font-normal">{t.statusLabel}</th>
                    <th className="pb-3 font-normal"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredHistory.map((row) => (
                    <tr key={row.id} className="hover:bg-white/5 transition-colors cursor-pointer group">
                      <td className="py-3.5 font-sans">
                        <div className="font-bold text-white text-xs">{row.date}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{row.time}</div>
                      </td>

                      <td className="py-3.5">
                        <div className="flex items-center gap-1.5 font-sans font-bold text-white text-xs">
                          <MapPin className="w-3 h-3 text-[#2DD4BF]" />
                          <span>{row.station}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">{row.bay} • {row.power}</div>
                      </td>

                      <td className="py-3.5">
                        <div className="font-bold text-white">{row.energyKwh} kWh</div>
                        <div className="text-[10px] text-slate-400">Avg. {row.avgKw} kW</div>
                      </td>

                      <td className="py-3.5 text-slate-300">
                        <div className="font-bold text-white">{row.durationMin} min</div>
                        <div className="text-[10px] text-slate-400">{row.time}</div>
                      </td>

                      <td className="py-3.5">
                        <div className="font-bold text-emerald-400">ETB {row.costEtb}</div>
                        <div className="text-[10px] text-slate-400">ETB {row.ratePerKwh} /kWh</div>
                      </td>

                      <td className="py-3.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                          {row.status}
                        </span>
                      </td>

                      <td className="py-3.5 text-right">
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs text-slate-400 font-mono">
              <span>{t.showingSessions}</span>
              <div className="flex items-center gap-1">
                <button className={`p-1 rounded ${isCream ? "bg-stone-100 text-stone-800" : "bg-[#131A29]"} text-slate-400 hover:text-white`}>
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="w-6 h-6 rounded bg-[#2DD4BF] text-slate-950 font-bold flex items-center justify-center">1</button>
                <button className={`w-6 h-6 rounded ${isCream ? "bg-stone-100 text-stone-800" : "bg-[#131A29]"} text-slate-300 hover:text-white flex items-center justify-center`}>2</button>
                <button className={`w-6 h-6 rounded ${isCream ? "bg-stone-100 text-stone-800" : "bg-[#131A29]"} text-slate-300 hover:text-white flex items-center justify-center`}>3</button>
                <button className={`p-1 rounded ${isCream ? "bg-stone-100 text-stone-800" : "bg-[#131A29]"} text-slate-400 hover:text-white`}>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Off-Peak Charging Tip Banner (Matching Screenshot) */}
          <div className={`p-4 rounded-3xl border ${isCream ? "bg-white border-stone-200 shadow-sm" : "border-white/10 bg-[#0E131F]"} flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg`}>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className={`text-xs font-bold ${isCream ? "text-stone-900" : "text-white"}`}>{t.offPeakTip}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  You can save up to 15% on energy costs.
                </p>
              </div>
            </div>

            <button 
              onClick={() => setView('find_charge')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs shrink-0 transition-colors"
            >
              View Off-Peak Stations
            </button>
          </div>
        </div>

        {/* Right Column: Energy Insights & Cost Breakdown Charts */}
        <div className="lg:col-span-4 space-y-5">
          {/* Card 1: Energy Insights & Bar Chart */}
          <div className={`p-5 sm:p-6 rounded-3xl border ${isCream ? "bg-white border-stone-200 shadow-sm" : "border-white/10 bg-[#0E131F]"} space-y-4 shadow-2xl`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold tracking-widest text-[#2DD4BF] uppercase">
                {t.energyInsightsTitle}
              </span>
              <Info className="w-3.5 h-3.5 text-slate-500" />
            </div>

            {/* Top Stat Pills */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className={`p-3 rounded-2xl ${isCream ? "bg-stone-100 text-stone-800" : "bg-[#131A29]"} space-y-1`}>
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                  <Zap className="w-3 h-3 text-[#2DD4BF]" />
                  <span>{t.mostEnergy}</span>
                </div>
                <div className="text-sm font-black text-white font-mono">28.3 kWh</div>
                <div className="text-[9px] text-slate-500">May 25, 2025</div>
              </div>

              <div className={`p-3 rounded-2xl ${isCream ? "bg-stone-100 text-stone-800" : "bg-[#131A29]"} space-y-1`}>
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                  <MapPin className="w-3 h-3 text-[#2DD4BF]" />
                  <span>{t.mostFrequent}</span>
                </div>
                <div className="text-sm font-black text-white font-mono">Addis EV Hub</div>
                <div className="text-[9px] text-slate-500">9 sessions</div>
              </div>
            </div>

            {/* Energy Over Time Bar Chart */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>{t.energyOverTime}</span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">May 25: 28.3 kWh</span>
              </div>

              {/* Bar Chart Visualization */}
              <div className="h-28 flex items-end gap-1.5 pt-4 pb-2 px-2 bg-[#0A0E17] rounded-2xl border border-white/5">
                {[12, 24, 18, 30, 22, 28.3, 16, 20, 26, 14, 25, 22].map((val, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <div 
                      className={`w-full rounded-t-sm transition-all ${
                        idx === 5 ? 'bg-[#2DD4BF] shadow-[0_0_8px_#2DD4BF]' : 'bg-[#14B8A6]/60 hover:bg-[#2DD4BF]'
                      }`}
                      style={{ height: `${(val / 30) * 100}%` }}
                    ></div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                <span>May 1</span>
                <span>May 8</span>
                <span>May 15</span>
                <span>May 22</span>
                <span>May 29</span>
              </div>
            </div>
          </div>

          {/* Card 2: Cost Breakdown Donut Chart */}
          <div className={`p-5 sm:p-6 rounded-3xl border ${isCream ? "bg-white border-stone-200 shadow-sm" : "border-white/10 bg-[#0E131F]"} space-y-4 shadow-2xl`}>
            <div className="text-[11px] font-mono font-bold tracking-widest text-[#2DD4BF] uppercase">
              {t.costBreakdownTitle}
            </div>

            {/* Donut Chart with Center Text */}
            <div className="flex items-center justify-center py-2">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#131A29" strokeWidth="14" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#2DD4BF" strokeWidth="14" strokeDasharray="131 238" strokeDashoffset="0" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#0284C7" strokeWidth="14" strokeDasharray="52 238" strokeDashoffset="-131" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#F59E0B" strokeWidth="14" strokeDasharray="33 238" strokeDashoffset="-183" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#E11D48" strokeWidth="14" strokeDasharray="22 238" strokeDashoffset="-216" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                  <span className="text-[10px] text-slate-400">ETB</span>
                  <span className="text-base font-black text-white">5,678</span>
                  <span className="text-[9px] text-slate-500">Total</span>
                </div>
              </div>
            </div>

            {/* Slices Legend */}
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#2DD4BF]"></span>
                  <span>Addis EV Hub</span>
                </span>
                <span className="font-bold text-white">ETB 3,145 <span className="text-slate-500 font-normal">55%</span></span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#0284C7]"></span>
                  <span>Entoto Plaza</span>
                </span>
                <span className="font-bold text-white">ETB 1,263 <span className="text-slate-500 font-normal">22%</span></span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-400"></span>
                  <span>Bole EV Station</span>
                </span>
                <span className="font-bold text-white">ETB 781 <span className="text-slate-500 font-normal">14%</span></span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-sm bg-rose-500"></span>
                  <span>Others</span>
                </span>
                <span className="font-bold text-white">ETB 489 <span className="text-slate-500 font-normal">9%</span></span>
              </div>
            </div>

            {/* Green CO2 Impact Badge */}
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs text-emerald-400 pt-2">
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 shrink-0" />
                <span className="text-[11px] font-sans">{t.co2SavedMessage}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryView;
