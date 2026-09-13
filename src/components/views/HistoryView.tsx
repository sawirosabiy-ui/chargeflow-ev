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
  ChevronDown,
  ArrowRight
} from 'lucide-react';
import { useChargeFlowStore } from '../../store/useChargeFlowStore';
import { useTranslation } from '../../localization/useTranslation';

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

  // Dynamic user-isolated filtering
  const filteredHistory = history.filter((item) => 
    item.stationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.bayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Compute real metrics from the user's isolated history
  const totalSessions = history.length;
  const totalEnergyKwh = Number(history.reduce((sum, s) => sum + s.energyKwh, 0).toFixed(1));
  const totalCostEtb = Math.round(history.reduce((sum, s) => sum + s.totalCostEtb, 0));
  const avgKw = totalSessions > 0 ? Math.round(history.reduce((sum, s) => sum + (s.powerKw || 120), 0) / totalSessions) : 0;
  const avgCostPerKwh = totalEnergyKwh > 0 ? (totalCostEtb / totalEnergyKwh).toFixed(1) : "19.5";

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
          <div className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold ${isCream ? "bg-white border-stone-200 text-stone-700 shadow-sm" : "bg-[#0E131F] border-white/10 text-white"}`}>
            <Calendar className="w-3.5 h-3.5 text-[#2DD4BF]" />
            <span>Lifetime Sessions</span>
          </div>

          <div className="relative p-2 rounded-xl bg-[#0E131F] border border-white/5 text-slate-300">
            <Bell className="w-4 h-4" />
            {totalSessions > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#2DD4BF]"></span>}
          </div>
        </div>
      </div>

      {/* 2. Top Metrics Cards Row (Dynamically calculated from real sessions) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Card 1: Total Sessions */}
        <div className={`p-4 rounded-3xl border ${isCream ? "bg-white border-stone-200 shadow-sm" : "border-white/10 bg-[#0E131F]"} space-y-2`}>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Zap className="w-4 h-4" />
            </div>
            <span className="text-[10px] text-emerald-400 font-mono font-bold">Verified</span>
          </div>
          <div>
            <div className={`text-[11px] ${isCream ? "text-stone-500" : "text-slate-400"}`}>{t.totalSessions}</div>
            <div className="text-2xl font-black text-white font-mono">{totalSessions}</div>
          </div>
        </div>

        {/* Card 2: Total Energy */}
        <div className={`p-4 rounded-3xl border ${isCream ? "bg-white border-stone-200 shadow-sm" : "border-white/10 bg-[#0E131F]"} space-y-2`}>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <Battery className="w-4 h-4" />
            </div>
            <span className="text-[10px] text-cyan-400 font-mono font-bold">100% Green</span>
          </div>
          <div>
            <div className={`text-[11px] ${isCream ? "text-stone-500" : "text-slate-400"}`}>{t.totalEnergyCharged}</div>
            <div className="text-2xl font-black text-white font-mono">{totalEnergyKwh} <span className="text-xs font-normal text-slate-400">kWh</span></div>
          </div>
        </div>

        {/* Card 3: Total Cost */}
        <div className={`p-4 rounded-3xl border ${isCream ? "bg-white border-stone-200 shadow-sm" : "border-white/10 bg-[#0E131F]"} space-y-2`}>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Wallet className="w-4 h-4" />
            </div>
            <span className="text-[10px] text-emerald-400 font-mono font-bold">ETB</span>
          </div>
          <div>
            <div className={`text-[11px] ${isCream ? "text-stone-500" : "text-slate-400"}`}>{t.totalSpent}</div>
            <div className="text-2xl font-black text-white font-mono">ETB {totalCostEtb.toLocaleString()}</div>
          </div>
        </div>

        {/* Card 4: Avg Speed / Power */}
        <div className={`p-4 rounded-3xl border ${isCream ? "bg-white border-stone-200 shadow-sm" : "border-white/10 bg-[#0E131F]"} space-y-2`}>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-[10px] text-amber-400 font-mono font-bold">DC Fast</span>
          </div>
          <div>
            <div className={`text-[11px] ${isCream ? "text-stone-500" : "text-slate-400"}`}>{t.power}</div>
            <div className="text-2xl font-black text-white font-mono">{avgKw} <span className="text-xs font-normal text-slate-400">kW</span></div>
          </div>
        </div>

        {/* Card 5: Avg Cost / kWh */}
        <div className={`p-4 rounded-3xl border ${isCream ? "bg-white border-stone-200 shadow-sm" : "border-white/10 bg-[#0E131F]"} space-y-2`}>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <Tag className="w-4 h-4" />
            </div>
            <span className="text-[10px] text-cyan-400 font-mono font-bold">Tariff</span>
          </div>
          <div>
            <div className={`text-[11px] ${isCream ? "text-stone-500" : "text-slate-400"}`}>{t.avgCostPerKwh}</div>
            <div className="text-2xl font-black text-white font-mono">ETB {avgCostPerKwh}</div>
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

            {/* If 0 Sessions: Display Exact Clean Empty State Required by Spec */}
            {filteredHistory.length === 0 ? (
              <div className="py-16 px-4 text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mx-auto text-teal-400 shadow-[0_0_25px_rgba(45,212,191,0.2)]">
                  <Battery className="w-8 h-8" />
                </div>
                <div className="space-y-1 max-w-sm mx-auto">
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    No charging history yet.
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Your completed charging sessions will appear here once you reserve a bay and charge your EV.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setView('find_charge')}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-black text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow-[0_0_20px_rgba(45,212,191,0.3)] transition-all hover:scale-105 cursor-pointer"
                >
                  <span>Find a Charger</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
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
                            <span className="truncate">{row.stationName}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                            {row.bayName} • {row.powerKw} kW
                          </div>
                        </div>

                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20 shrink-0">
                          Completed
                        </span>
                      </div>

                      {/* Card Body: 3-column stats */}
                      <div className={`grid grid-cols-3 gap-2 pt-2.5 border-t ${isCream ? "border-stone-200" : "border-white/5"} text-xs font-mono`}>
                        <div>
                          <div className="text-[10px] text-slate-400 font-sans">Energy</div>
                          <div className="font-bold text-white mt-0.5">{row.energyKwh} kWh</div>
                          <div className="text-[9px] text-slate-500">{row.powerKw} kW</div>
                        </div>

                        <div>
                          <div className="text-[10px] text-slate-400 font-sans">Duration</div>
                          <div className="font-bold text-white mt-0.5">{row.durationMin} min</div>
                          <div className="text-[9px] text-slate-500">{row.date}</div>
                        </div>

                        <div className="text-right">
                          <div className="text-[10px] text-slate-400 font-sans">Total Cost</div>
                          <div className="font-black text-emerald-400 mt-0.5">ETB {row.totalCostEtb}</div>
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
                              <span>{row.stationName}</span>
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">{row.bayName} • {row.powerKw} kW</div>
                          </td>

                          <td className="py-3.5">
                            <div className="font-bold text-white">{row.energyKwh} kWh</div>
                            <div className="text-[10px] text-slate-400">Peak {row.powerKw} kW</div>
                          </td>

                          <td className="py-3.5 text-slate-300">
                            <div className="font-bold text-white">{row.durationMin} min</div>
                            <div className="text-[10px] text-slate-400">{row.time}</div>
                          </td>

                          <td className="py-3.5">
                            <div className="font-bold text-emerald-400">ETB {row.totalCostEtb}</div>
                            <div className="text-[10px] text-slate-400">ETB {row.ratePerKwh} /kWh</div>
                          </td>

                          <td className="py-3.5">
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                              Completed
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
                  <span>Showing {filteredHistory.length} of {history.length} sessions</span>
                  <div className="flex items-center gap-1">
                    <button className={`p-1 rounded ${isCream ? "bg-stone-100 text-stone-800" : "bg-[#131A29]"} text-slate-400 hover:text-white`}>
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button className="w-6 h-6 rounded bg-[#2DD4BF] text-slate-950 font-bold flex items-center justify-center">1</button>
                    <button className={`p-1 rounded ${isCream ? "bg-stone-100 text-stone-800" : "bg-[#131A29]"} text-slate-400 hover:text-white`}>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Off-Peak Charging Tip Banner */}
          <div className={`p-4 rounded-3xl border ${isCream ? "bg-white border-stone-200 shadow-sm" : "border-white/10 bg-[#0E131F]"} flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg`}>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className={`text-xs font-bold ${isCream ? "text-stone-900" : "text-white"}`}>{t.offPeakTip}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  You can save up to 15% on energy costs by reserving charging slots between 10:00 PM and 6:00 AM.
                </p>
              </div>
            </div>

            <button 
              onClick={() => setView('find_charge')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs shrink-0 transition-colors cursor-pointer"
            >
              View Off-Peak Stations
            </button>
          </div>
        </div>

        {/* Right Column: Energy Insights & Cost Breakdown Charts */}
        <div className="lg:col-span-4 space-y-5">
          {/* Card 1: Energy Insights & Environmental Impact */}
          <div className={`p-5 sm:p-6 rounded-3xl border ${isCream ? "bg-white border-stone-200 shadow-sm" : "border-white/10 bg-[#0E131F]"} space-y-4 shadow-xl`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold tracking-widest text-[#2DD4BF] uppercase">{t.energyInsightsTitle}</span>
              <Sparkles className="w-4 h-4 text-[#2DD4BF]" />
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Based on your EV driving data, your charging sessions at Addis EV Hub utilize 100% renewable hydroelectric power from GERD.
            </p>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <Leaf className="w-4 h-4" />
                <span>CO₂ Emissions Saved</span>
              </div>
              <div className="text-xl font-mono font-black text-white">
                {Number((totalEnergyKwh * 0.45).toFixed(1))} <span className="text-xs font-normal text-slate-400">kg CO₂</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Equivalent to planting ~{Math.max(1, Math.round(totalEnergyKwh * 0.08))} trees in Entoto Park.
              </p>
            </div>
          </div>

          {/* Card 2: Wallet Summary */}
          <div className={`p-5 sm:p-6 rounded-3xl border ${isCream ? "bg-white border-stone-200 shadow-sm" : "border-white/10 bg-[#0E131F]"} space-y-4 shadow-xl`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold tracking-widest text-[#2DD4BF] uppercase">ChargeFlow Wallet</span>
              <Receipt className="w-4 h-4 text-[#2DD4BF]" />
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-white/5 space-y-1">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Current Balance</div>
              <div className="text-2xl font-black font-mono text-emerald-400">
                {useChargeFlowStore.getState().wallet.balanceEtb.toFixed(2)} ETB
              </div>
            </div>

            <div className="text-xs text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>Vehicle:</span>
                <span className="font-bold text-white">{vehicle.model}</span>
              </div>
              <div className="flex justify-between">
                <span>Driver:</span>
                <span className="font-bold text-white">{user.name || "Guest"}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setView('find_charge')}
              className="w-full py-2.5 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/30 text-teal-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Book Next Charging Slot</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryView;
