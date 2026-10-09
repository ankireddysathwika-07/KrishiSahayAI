import React from 'react';
import {
  Layers,
  TrendingUp,
  Sparkles,
  Info,
  CheckCircle,
  FlaskConical,
  Sprout,
  Activity,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { FarmProfile, RotationPlan } from '../types/agricultural';

interface SoilSenseModuleProps {
  farm: FarmProfile;
  plan: RotationPlan;
}

export const SoilSenseModule: React.FC<SoilSenseModuleProps> = ({ farm, plan }) => {
  // Generate multi-season trajectory data for Recharts
  const trajectoryData = [
    {
      season: 'Baseline',
      crop: 'Initial Test',
      nitrogen: farm.nitrogenKgPerHa,
      phosphorus: farm.phosphorusKgPerHa,
      potassium: farm.potassiumKgPerHa,
      organicMatter: farm.organicMatterPercent,
      healthScore: plan.metrics.initialSoilHealth,
    },
  ];

  let runningN = farm.nitrogenKgPerHa;
  let runningP = farm.phosphorusKgPerHa;
  let runningK = farm.potassiumKgPerHa;
  let totalFixedN = 0;

  plan.seasons.forEach((season, idx) => {
    runningN = Math.max(70, Math.min(450, runningN + season.soilNitrogenDeltaKg));
    runningP = Math.max(10, Math.min(90, runningP + season.soilPhosphorusDeltaKg));
    runningK = Math.max(60, Math.min(380, runningK + season.soilPotassiumDeltaKg));

    if (season.soilNitrogenDeltaKg > 0) {
      totalFixedN += season.soilNitrogenDeltaKg * farm.areaHa;
    }

    trajectoryData.push({
      season: `Y${season.year} S${season.seasonIndex}`,
      crop: season.crop.name.split(' ')[0],
      nitrogen: Math.round(runningN),
      phosphorus: Math.round(runningP),
      potassium: Math.round(runningK),
      organicMatter: Number((farm.organicMatterPercent + idx * 0.12).toFixed(2)),
      healthScore: season.soilHealthScoreAfter,
    });
  });

  // Calculate synthetic urea fertilizer savings
  // 1 kg N ~ 2.17 kg Urea @ subsidized ₹6.5/kg ~ ₹14/kg N or commercial ₹35/kg N
  const estimatedUreaSavedKg = Math.round(totalFixedN * 2.17);
  const fertilizerCostSavingsInr = Math.round(totalFixedN * 28);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <FlaskConical className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-emerald-950 font-serif">
              SoilSense™ Dynamic Health Simulator
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Simulates dynamic multi-season soil health trajectories, Rhizobial nitrogen fixation, and macro-nutrient balance.
          </p>
        </div>

        {/* Top summary badges */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-200">
            <span className="text-[10px] uppercase font-bold text-emerald-800 block">Initial Soil Health</span>
            <span className="text-xl font-black text-emerald-950 font-serif">
              {plan.metrics.initialSoilHealth} <span className="text-xs font-normal text-stone-500">/ 100</span>
            </span>
          </div>

          <div className="bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-200">
            <span className="text-[10px] uppercase font-bold text-emerald-800 block">Final Soil Health</span>
            <span className="text-xl font-black text-emerald-950 font-serif">
              {plan.metrics.finalSoilHealth} <span className="text-xs font-normal text-stone-500">/ 100</span>
            </span>
          </div>

          <div className={`px-4 py-2 rounded-2xl border ${plan.metrics.soilHealthDelta >= 0 ? 'bg-lime-50 border-lime-300 text-lime-900' : 'bg-rose-50 border-rose-200 text-rose-900'}`}>
            <span className="text-[10px] uppercase font-bold block">Net Health Change</span>
            <span className="text-xl font-black font-serif">
              {plan.metrics.soilHealthDelta >= 0 ? `+${plan.metrics.soilHealthDelta}` : plan.metrics.soilHealthDelta} pts
            </span>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Season -> Soil Health Score */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-900/10 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-emerald-950 uppercase tracking-wide flex items-center space-x-1.5">
                <Activity className="w-4 h-4 text-emerald-700" />
                <span>Season ➔ Soil Health Score Index</span>
              </h3>
              <p className="text-xs text-stone-500">Combined index of NPK, Organic Carbon, and pH buffer capacity</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
              0 - 100 Scale
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trajectoryData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="soilHealthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="season" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis domain={[40, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-emerald-950 text-white p-3 rounded-xl text-xs shadow-xl border border-emerald-800">
                          <p className="font-bold text-lime-400">{data.season} ({data.crop})</p>
                          <p className="mt-1">Soil Health: <strong className="text-white text-sm">{data.healthScore}/100</strong></p>
                          <p className="text-stone-300">Available N: {data.nitrogen} kg/ha</p>
                          <p className="text-stone-300">Organic Matter: {data.organicMatter}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="healthScore"
                  stroke="#059669"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#soilHealthGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Multi-Season NPK Trajectory */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-900/10 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-emerald-950 uppercase tracking-wide flex items-center space-x-1.5">
                <Layers className="w-4 h-4 text-amber-700" />
                <span>Multi-Season Available NPK (kg/ha)</span>
              </h3>
              <p className="text-xs text-stone-500">Soil nutrient reserves across scheduled crop horizons</p>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trajectoryData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="season" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#064e3b', borderRadius: '0.75rem', color: '#fff', fontSize: '11px', border: '1px solid #047857' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line type="monotone" dataKey="nitrogen" name="Nitrogen (N)" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="phosphorus" name="Phosphorus (P)" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="potassium" name="Potassium (K)" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Legume Nitrogen Fixation & Fertilizer Offset Card */}
      <div className="bg-gradient-to-br from-emerald-900 to-green-950 rounded-3xl p-6 text-white border border-emerald-700 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-emerald-800 gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-lime-400 text-emerald-950 font-bold flex items-center justify-center">
              <Sprout className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif text-white">
                Biological Nitrogen Fixation & Fertilizer Savings
              </h3>
              <p className="text-xs text-emerald-200">
                Calculated contribution from rotational legume roots (Rhizobia nodules)
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[10px] text-lime-300 font-bold uppercase tracking-wider block">Total Bio-Fixed Nitrogen</span>
            <span className="text-2xl font-black font-serif text-white">{totalFixedN} kg N</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-xs">
          <div className="bg-emerald-800/60 p-3.5 rounded-2xl border border-emerald-700/50">
            <span className="text-emerald-300 block text-[10px] uppercase font-bold">Urea Equivalent Saved</span>
            <span className="text-xl font-bold font-serif text-white mt-1 block">
              ~{estimatedUreaSavedKg} kg Urea
            </span>
            <span className="text-[11px] text-emerald-200">~{Math.round(estimatedUreaSavedKg / 45)} standard 45kg bags</span>
          </div>

          <div className="bg-emerald-800/60 p-3.5 rounded-2xl border border-emerald-700/50">
            <span className="text-emerald-300 block text-[10px] uppercase font-bold">Estimated Cost Offset</span>
            <span className="text-xl font-bold font-serif text-lime-300 mt-1 block">
              ₹{fertilizerCostSavingsInr.toLocaleString()} Saved
            </span>
            <span className="text-[11px] text-emerald-200">Avoided synthetic fertilizer expenditure</span>
          </div>

          <div className="bg-emerald-800/60 p-3.5 rounded-2xl border border-emerald-700/50">
            <span className="text-emerald-300 block text-[10px] uppercase font-bold">Soil Organic Matter Trajectory</span>
            <span className="text-xl font-bold font-serif text-white mt-1 block">
              {farm.organicMatterPercent}% ➔ {(farm.organicMatterPercent + plan.seasons.length * 0.12).toFixed(2)}%
            </span>
            <span className="text-[11px] text-emerald-200">Carbon enrichment through crop residue incorporation</span>
          </div>
        </div>
      </div>
    </div>
  );
};
