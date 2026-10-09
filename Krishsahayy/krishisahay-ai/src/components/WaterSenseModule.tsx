import React from 'react';
import {
  Droplets,
  TrendingDown,
  ShieldCheck,
  AlertTriangle,
  Waves,
  CloudRain,
  Gauge,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { FarmProfile, RotationPlan } from '../types/agricultural';

interface WaterSenseModuleProps {
  farm: FarmProfile;
  plan: RotationPlan;
}

export const WaterSenseModule: React.FC<WaterSenseModuleProps> = ({ farm, plan }) => {
  // Format seasonal water consumption data
  const waterChartData = plan.seasons.map((season) => ({
    season: `Y${season.year} ${season.seasonName.split(' ')[0]}`,
    crop: season.crop.name.split(' ')[0],
    waterRequired: Math.round(season.waterRequiredM3),
    waterAvailable: Math.round(season.waterAvailableM3),
    waterSaved: Math.max(0, Math.round(season.waterAvailableM3 - season.waterRequiredM3)),
    waterDeficit: Math.max(0, Math.round(season.waterRequiredM3 - season.waterAvailableM3)),
  }));

  const totalQuota = plan.metrics.waterAvailableM3;
  const totalConsumed = plan.metrics.totalWaterUsedM3;
  const totalSaved = Math.max(0, totalQuota - totalConsumed);
  const waterSavedPercent = totalQuota > 0 ? Math.round((totalSaved / totalQuota) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-cyan-100 text-cyan-800">
              <Droplets className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-emerald-950 font-serif">
              WaterSense™ Irrigation & Hydrological Balancer
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Dynamic seasonal groundwater accounting, deficit penalization, and climate-adaptive low-water crop allocation.
          </p>
        </div>

        {/* Irrigation Method Badge */}
        <div className="flex items-center space-x-3">
          <div className="bg-cyan-50 px-4 py-2 rounded-2xl border border-cyan-200 text-cyan-950 text-right">
            <span className="text-[10px] uppercase font-bold text-cyan-800 block">Irrigation System</span>
            <span className="text-sm font-black font-serif">{farm.irrigationType}</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-bold uppercase text-emerald-900">Total Irrigation Quota</span>
            <CloudRain className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-black font-serif text-emerald-950">
            {(totalQuota / 1000).toFixed(1)}k <span className="text-xs font-normal text-stone-500">m³ available</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            {farm.availableWaterM3PerHa} m³/ha baseline across {farm.areaHa} ha
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-bold uppercase text-emerald-900">Total Water Consumed</span>
            <Waves className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black font-serif text-emerald-950">
            {(totalConsumed / 1000).toFixed(1)}k <span className="text-xs font-normal text-stone-500">m³ drawn</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            {plan.seasons.length} seasons combined footprint
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-bold uppercase text-emerald-900">Net Water Saved</span>
            <Gauge className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black font-serif text-emerald-700">
            {(totalSaved / 1000).toFixed(1)}k <span className="text-xs font-normal text-stone-500">m³ conserved</span>
          </div>
          <div className="flex items-center space-x-1 mt-1 text-[11px] text-emerald-800 font-semibold">
            <span>✓ {waterSavedPercent}% buffer preserved</span>
            {plan.metrics.waterDeficitM3 === 0 ? (
              <span className="text-emerald-700 font-bold">(Zero Overdraft)</span>
            ) : (
              <span className="text-rose-600 font-bold">(Deficit Alert!)</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Recharts Bar Chart: Available vs Used vs Saved */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-900/10 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <div>
            <h3 className="text-sm font-bold text-emerald-950 uppercase tracking-wide flex items-center space-x-1.5">
              <Droplets className="w-4 h-4 text-cyan-600" />
              <span>Seasonal Water Accounting: Quota vs Required (m³)</span>
            </h3>
            <p className="text-xs text-stone-500">
              Evaluated per season against operating irrigation thresholds
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="px-2 py-0.5 rounded-md bg-cyan-100 text-cyan-800 font-semibold">Available Quota</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-semibold">Required by Crop</span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={waterChartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="season" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-emerald-950 text-white p-3 rounded-xl text-xs shadow-xl border border-emerald-800">
                        <p className="font-bold text-lime-400">{data.season} ({data.crop})</p>
                        <p className="mt-1">Available: <strong>{data.waterAvailable.toLocaleString()} m³</strong></p>
                        <p className="text-cyan-300">Required: <strong>{data.waterRequired.toLocaleString()} m³</strong></p>
                        <p className="text-emerald-300">Surplus Saved: <strong>{data.waterSaved.toLocaleString()} m³</strong></p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Bar dataKey="waterAvailable" name="Available Water Quota (m³)" fill="#93c5fd" radius={[6, 6, 0, 0]} />
              <Bar dataKey="waterRequired" name="Crop Water Demand (m³)" fill="#059669" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Drought Adaptation Advisory */}
      <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 text-xs">
        <h4 className="font-bold text-emerald-950 uppercase tracking-wide flex items-center space-x-1.5 mb-2">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Hydrological Constraint & Drought Optimization Protocol</span>
        </h4>
        <p className="text-stone-600 leading-relaxed">
          When irrigation capacity falls below 4,000 m³/ha (or during active Drought stress scenarios), KrishiSahay AI automatically penalizes high-transpiration cereals (such as flood-irrigated Paddy at 12,000 m³/ha) and prioritizes drought-hardy legumes (Chickpea, Groundnut) and C4 nutri-cereals (Finger / Pearl Millet at only 2,500 m³/ha). This prevents catastrophic crop failure while preserving essential groundwater tables.
        </p>
      </div>
    </div>
  );
};
