import React from 'react';
import {
  TrendingUp,
  Droplets,
  Layers,
  ShieldCheck,
  ShieldAlert,
  Award,
  MapPin,
  Calendar,
} from 'lucide-react';
import { FarmProfile, RotationPlan } from '../types/agricultural';

interface KPICardsProps {
  plan: RotationPlan;
  farm: FarmProfile;
}

export const KPICards: React.FC<KPICardsProps> = ({ plan, farm }) => {
  const { metrics } = plan;

  // Format INR nicely
  const formatInr = (val: number) => {
    return '₹' + Math.round(val).toLocaleString('en-IN');
  };

  const isProfitable = metrics.netProfitInr > 0;
  const soilDeltaPositive = metrics.soilHealthDelta >= 0;
  const isWaterSafe = metrics.waterDeficitM3 === 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {/* 1. Farm Area & Profile */}
      <div className="bg-white rounded-2xl p-4 border border-emerald-900/10 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between text-stone-500 mb-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900">Farm Holding</span>
          <MapPin className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="text-xl sm:text-2xl font-black text-emerald-950 font-serif">
          {farm.areaHa} <span className="text-xs font-sans font-semibold text-stone-500">Ha</span>
        </div>
        <div className="flex items-center space-x-1 mt-1 text-[11px] text-stone-600 truncate">
          <span>{farm.soilType} Soil</span>
          <span>•</span>
          <span className="font-mono text-emerald-700 font-semibold">pH {farm.soilPh}</span>
        </div>
      </div>

      {/* 2. Current Soil Health */}
      <div className="bg-white rounded-2xl p-4 border border-emerald-900/10 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between text-stone-500 mb-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900">Soil Health</span>
          <Layers className="w-4 h-4 text-amber-600" />
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="text-xl sm:text-2xl font-black text-emerald-950 font-serif">
            {metrics.finalSoilHealth}
          </span>
          <span className="text-xs text-stone-400 font-medium">/ 100</span>
          <span
            className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${
              soilDeltaPositive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}
          >
            {soilDeltaPositive ? `+${metrics.soilHealthDelta}` : metrics.soilHealthDelta}
          </span>
        </div>
        <div className="text-[11px] text-stone-500 mt-1">
          From {metrics.initialSoilHealth} ➔ {metrics.finalSoilHealth} index
        </div>
      </div>

      {/* 3. Available Water vs Used */}
      <div className="bg-white rounded-2xl p-4 border border-emerald-900/10 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between text-stone-500 mb-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900">Water Quota</span>
          <Droplets className="w-4 h-4 text-cyan-600" />
        </div>
        <div className="text-xl sm:text-2xl font-black text-emerald-950 font-serif">
          {(metrics.totalWaterUsedM3 / 1000).toFixed(1)}k{' '}
          <span className="text-xs font-sans font-semibold text-stone-500">m³</span>
        </div>
        <div className="flex items-center space-x-1 mt-1 text-[11px]">
          {isWaterSafe ? (
            <span className="text-emerald-700 font-semibold flex items-center space-x-0.5">
              <span>✓ Safe</span>
              <span className="text-stone-400">({metrics.waterEfficiencyPercent}% saved)</span>
            </span>
          ) : (
            <span className="text-rose-600 font-bold">
              Deficit: -{(metrics.waterDeficitM3 / 1000).toFixed(1)}k m³
            </span>
          )}
        </div>
      </div>

      {/* 4. Projected Net Profit */}
      <div className="bg-white rounded-2xl p-4 border border-emerald-900/10 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between text-stone-500 mb-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900">Projected Profit</span>
          <TrendingUp className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="text-xl sm:text-2xl font-black text-emerald-950 font-serif truncate">
          {formatInr(metrics.netProfitInr)}
        </div>
        <div className="flex items-center space-x-1 mt-1 text-[11px] text-stone-600">
          <span className="font-semibold text-emerald-800">
            {metrics.totalCostInr > 0 ? `${Math.round((metrics.netProfitInr / metrics.totalCostInr) * 100)}% ROI` : 'N/A'}
          </span>
          <span>•</span>
          <span>{plan.seasons.length} seasons</span>
        </div>
      </div>

      {/* 5. Disease Risk Score */}
      <div className="bg-white rounded-2xl p-4 border border-emerald-900/10 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between text-stone-500 mb-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900">Disease Risk</span>
          {metrics.averageDiseaseRisk <= 35 ? (
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          ) : (
            <ShieldAlert className="w-4 h-4 text-amber-600" />
          )}
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="text-xl sm:text-2xl font-black text-emerald-950 font-serif">
            {metrics.averageDiseaseRisk}
          </span>
          <span className="text-xs text-stone-400 font-medium">/ 100</span>
          <span
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
              metrics.averageDiseaseRisk <= 32
                ? 'bg-emerald-100 text-emerald-800'
                : metrics.averageDiseaseRisk <= 55
                ? 'bg-amber-100 text-amber-800'
                : 'bg-rose-100 text-rose-800'
            }`}
          >
            {metrics.averageDiseaseRisk <= 32 ? 'Low' : metrics.averageDiseaseRisk <= 55 ? 'Moderate' : 'High'}
          </span>
        </div>
        <div className="text-[11px] text-stone-500 mt-1">
          {metrics.cropDiversityCount} family breaks active
        </div>
      </div>

      {/* 6. Sustainability Score */}
      <div className="bg-white rounded-2xl p-4 border border-emerald-900/10 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between text-stone-500 mb-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900">Sustainability</span>
          <Award className="w-4 h-4 text-lime-600" />
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="text-xl sm:text-2xl font-black text-emerald-950 font-serif">
            {metrics.sustainabilityScore}
          </span>
          <span className="text-xs text-stone-400 font-medium">/ 100</span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-lime-100 text-lime-900">
            {metrics.sustainabilityScore >= 75 ? 'Grade A' : metrics.sustainabilityScore >= 55 ? 'Grade B' : 'Grade C'}
          </span>
        </div>
        <div className="text-[11px] text-stone-500 mt-1">
          Overall score: {metrics.overallScore}/100
        </div>
      </div>
    </div>
  );
};
