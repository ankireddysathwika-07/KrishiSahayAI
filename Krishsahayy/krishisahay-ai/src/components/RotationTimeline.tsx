import React, { useState } from 'react';
import {
  Calendar,
  Droplets,
  TrendingUp,
  ShieldCheck,
  ShieldAlert,
  Layers,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { RotationPlan, SeasonCropAllocation } from '../types/agricultural';

interface RotationTimelineProps {
  plan: RotationPlan;
}

export const RotationTimeline: React.FC<RotationTimelineProps> = ({ plan }) => {
  const [selectedSeasonIdx, setSelectedSeasonIdx] = useState<number | null>(0);

  // Group allocations by Year
  const yearsMap: { [year: number]: SeasonCropAllocation[] } = {};
  plan.seasons.forEach((season) => {
    if (!yearsMap[season.year]) {
      yearsMap[season.year] = [];
    }
    yearsMap[season.year].push(season);
  });

  const years = Object.keys(yearsMap).map(Number).sort((a, b) => a - b);

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-emerald-900/10 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-stone-100 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl sm:text-2xl font-black text-emerald-950 font-serif">
              Multi-Year Crop Rotation Schedule
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900">
              {plan.strategyName}
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Interactive multi-season sequence calculated to optimize profitability, replenish soil NPK, and break pest lifecycles.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-stone-600 font-medium">Legume Restorative</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-stone-600 font-medium">Commercial Cash</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-stone-600 font-medium">Cereal Anchor</span>
          </div>
        </div>
      </div>

      {/* Timeline Grid by Year */}
      <div className="space-y-6 mt-6">
        {years.map((yearNum) => {
          const seasons = yearsMap[yearNum];
          return (
            <div key={yearNum} className="relative">
              {/* Year Header Marker */}
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-900 text-white font-bold font-serif text-sm flex items-center justify-center shadow-xs">
                  Y{yearNum}
                </div>
                <div className="text-sm font-black text-emerald-950 font-serif tracking-wide uppercase">
                  Year {yearNum} Horizon
                </div>
                <div className="h-px bg-stone-200 flex-1" />
              </div>

              {/* Season Cards row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {seasons.map((season, idx) => {
                  const globalIdx = plan.seasons.indexOf(season);
                  const isSelected = selectedSeasonIdx === globalIdx;
                  const isLegume = season.crop.category === 'Pulse / Legume';
                  const isMillet = season.crop.category === 'Millet';
                  const isVegetable = season.crop.category === 'Vegetable';
                  const isCash = season.crop.id === 'cotton';

                  let badgeColor = 'bg-blue-100 text-blue-900 border-blue-200';
                  if (isLegume) badgeColor = 'bg-emerald-100 text-emerald-900 border-emerald-300';
                  else if (isMillet) badgeColor = 'bg-lime-100 text-lime-900 border-lime-300';
                  else if (isVegetable || isCash) badgeColor = 'bg-amber-100 text-amber-900 border-amber-300';

                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedSeasonIdx(isSelected ? null : globalIdx)}
                      className={`cursor-pointer rounded-2xl p-4 border transition-all relative ${
                        isSelected
                          ? 'border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50/40 shadow-md'
                          : 'border-stone-200 hover:border-emerald-400 bg-white hover:bg-stone-50/50 shadow-xs'
                      }`}
                    >
                      {/* Top season label & crop category */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center space-x-1">
                          <Calendar className="w-3 h-3 text-emerald-700" />
                          <span>{season.seasonName.split(' ')[0]}</span>
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                          {season.crop.category}
                        </span>
                      </div>

                      {/* Crop Name & Duration */}
                      <div className="flex items-baseline justify-between">
                        <h4 className="text-lg font-black text-emerald-950 font-serif">
                          {season.crop.name}
                        </h4>
                        <span className="text-[11px] text-stone-500 font-mono">
                          {season.crop.durationDays} days
                        </span>
                      </div>

                      <p className="text-[11px] text-stone-600 line-clamp-1 italic mt-0.5">
                        {season.crop.scientificName} • Family {season.crop.diseaseFamily}
                      </p>

                      {/* Primary Metrics Grid */}
                      <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-stone-100 text-xs">
                        <div className="bg-stone-50 rounded-xl p-2">
                          <div className="text-[10px] text-stone-500 uppercase font-semibold">Yield & Net Profit</div>
                          <div className="font-bold text-emerald-900 mt-0.5">
                            {season.projectedYieldTons}t • ₹{Math.round(season.netProfitInr).toLocaleString()}
                          </div>
                        </div>

                        <div className="bg-stone-50 rounded-xl p-2">
                          <div className="text-[10px] text-stone-500 uppercase font-semibold">Water Drawn</div>
                          <div className="font-bold text-cyan-900 mt-0.5 flex items-center space-x-1">
                            <Droplets className="w-3 h-3 text-cyan-600" />
                            <span>{(season.waterRequiredM3 / 1000).toFixed(1)}k m³</span>
                          </div>
                        </div>
                      </div>

                      {/* Secondary metrics pills */}
                      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-stone-100 text-[11px]">
                        {/* Soil N Delta */}
                        <div className="flex items-center space-x-1">
                          <Layers className="w-3.5 h-3.5 text-stone-400" />
                          <span
                            className={`font-mono font-bold ${
                              season.soilNitrogenDeltaKg >= 0 ? 'text-emerald-700' : 'text-stone-600'
                            }`}
                          >
                            {season.soilNitrogenDeltaKg >= 0
                              ? `+${season.soilNitrogenDeltaKg}kg N (Fix)`
                              : `${season.soilNitrogenDeltaKg}kg N`}
                          </span>
                        </div>

                        {/* Disease Risk Badge */}
                        <div className="flex items-center space-x-1">
                          {season.diseaseRiskScore <= 35 ? (
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                          )}
                          <span className="font-mono text-stone-600 font-semibold">
                            {season.diseaseRiskScore}/100 Risk
                          </span>
                        </div>
                      </div>

                      {/* Rationale Snippet */}
                      <div className="mt-2.5 text-[11px] text-emerald-900 bg-emerald-100/50 p-2 rounded-xl flex items-start space-x-1.5">
                        <Sparkles className="w-3 h-3 text-emerald-700 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{season.agronomicRationale}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Drill-Down Drawer for the Selected Season */}
      {selectedSeasonIdx !== null && plan.seasons[selectedSeasonIdx] && (
        <div className="mt-6 p-5 rounded-2xl bg-emerald-950 text-white shadow-xl border border-emerald-800 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {(() => {
            const season = plan.seasons[selectedSeasonIdx];
            return (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-emerald-800 gap-2">
                  <div>
                    <span className="text-xs font-bold text-lime-400 uppercase tracking-widest">
                      Deep Agronomic Diagnostic • Year {season.year} {season.seasonName}
                    </span>
                    <h3 className="text-xl font-bold font-serif text-white mt-0.5">
                      {season.crop.name} ({season.crop.scientificName})
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedSeasonIdx(null)}
                    className="text-xs text-emerald-300 hover:text-white underline self-start sm:self-auto"
                  >
                    Close Diagnostics
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
                  <div className="bg-emerald-900/60 p-3 rounded-xl border border-emerald-700/40">
                    <span className="text-emerald-300 block text-[10px] uppercase font-bold">Projected Revenue</span>
                    <span className="text-lg font-bold text-white font-serif mt-1 block">
                      ₹{Math.round(season.projectedRevenueInr).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-emerald-200">
                      @ ₹{season.crop.marketPricePerTon.toLocaleString()}/t
                    </span>
                  </div>

                  <div className="bg-emerald-900/60 p-3 rounded-xl border border-emerald-700/40">
                    <span className="text-emerald-300 block text-[10px] uppercase font-bold">Production Cost</span>
                    <span className="text-lg font-bold text-white font-serif mt-1 block">
                      ₹{Math.round(season.projectedCostInr).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-emerald-200">
                      ₹{season.crop.costPerHa.toLocaleString()}/ha input
                    </span>
                  </div>

                  <div className="bg-emerald-900/60 p-3 rounded-xl border border-emerald-700/40">
                    <span className="text-emerald-300 block text-[10px] uppercase font-bold">Net Margin</span>
                    <span className="text-lg font-bold text-lime-300 font-serif mt-1 block">
                      ₹{Math.round(season.netProfitInr).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-emerald-200">
                      {Math.round((season.netProfitInr / season.projectedCostInr) * 100)}% ROI
                    </span>
                  </div>

                  <div className="bg-emerald-900/60 p-3 rounded-xl border border-emerald-700/40">
                    <span className="text-emerald-300 block text-[10px] uppercase font-bold">Water Requirement</span>
                    <span className="text-lg font-bold text-cyan-300 font-serif mt-1 block">
                      {season.waterRequiredM3.toLocaleString()} m³
                    </span>
                    <span className="text-[10px] text-emerald-200">
                      Balance: +{season.waterBalanceM3.toLocaleString()} m³
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-emerald-800/80 flex flex-col md:flex-row gap-4 text-xs">
                  <div className="flex-1">
                    <strong className="text-lime-400 font-semibold block mb-1">
                      Nutrient & Soil Dynamic Impact:
                    </strong>
                    <p className="text-emerald-100 leading-relaxed">
                      {season.soilNitrogenDeltaKg >= 0
                        ? `Symbiotic Rhizobia nodulation enriches topsoil with +${season.soilNitrogenDeltaKg} kg N/ha, boosting organic microbial activity and offsetting synthetic fertilizer dependency for the subsequent crop.`
                        : `Consumes ${Math.abs(season.soilNitrogenDeltaKg)} kg N/ha and ${Math.abs(season.soilPhosphorusDeltaKg)} kg P/ha. Balanced by preceding legume residue.`}
                    </p>
                  </div>
                  <div className="flex-1">
                    <strong className="text-lime-400 font-semibold block mb-1">
                      Pathogen Interruption Strategy:
                    </strong>
                    <p className="text-emerald-100 leading-relaxed">
                      Cultivating family {season.crop.diseaseFamily} terminates host specificity for fungal spores and root-knot nematodes from preceding cycles. Assessed Disease Risk: {season.diseaseRiskScore}/100 ({season.diseaseRiskScore <= 35 ? 'Low' : 'Controlled'}).
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
