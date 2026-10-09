import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  CloudSunRain,
  TrendingDown,
  ThermometerSun,
  Activity,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { RotationPlan, StressScenario } from '../types/agricultural';

interface ResilienceCenterProps {
  basePlan: RotationPlan;
  activePlan: RotationPlan;
  activeScenario: StressScenario;
  sensorWarnings: string[];
  dataConfidence: number;
  onSelectScenario: (scenarioId: StressScenario['id']) => void;
}

export const ResilienceCenter: React.FC<ResilienceCenterProps> = ({
  basePlan,
  activePlan,
  activeScenario,
  sensorWarnings,
  dataConfidence,
  onSelectScenario,
}) => {
  const isStressActive = activeScenario.id !== 'normal';

  // Compute what changed between base plan and stress tested plan
  const baseCrops = basePlan.seasons.map((s) => s.crop.name);
  const activeCrops = activePlan.seasons.map((s) => s.crop.name);
  const cropReplacements: { from: string; to: string; season: string }[] = [];

  basePlan.seasons.forEach((baseSeason, idx) => {
    const activeSeason = activePlan.seasons[idx];
    if (activeSeason && baseSeason.crop.id !== activeSeason.crop.id) {
      cropReplacements.push({
        from: baseSeason.crop.name,
        to: activeSeason.crop.name,
        season: `Year ${activeSeason.year} ${activeSeason.seasonName.split(' ')[0]}`,
      });
    }
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-900">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-emerald-950 font-serif">
              Adversarial Resilience & Agricultural Stress Center
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Simulates severe climate, economic, and sensor telemetry disruptions to evaluate algorithmic fault-tolerance and dynamic re-optimization.
          </p>
        </div>

        {/* Data Quality Confidence Badge */}
        <div className="flex items-center space-x-3">
          <div className="bg-stone-50 px-4 py-2 rounded-2xl border border-stone-200 text-right">
            <span className="text-[10px] uppercase font-bold text-stone-500 block">Telemetry Integrity</span>
            <span
              className={`text-lg font-black font-serif ${
                dataConfidence >= 80 ? 'text-emerald-700' : 'text-amber-700'
              }`}
            >
              {dataConfidence}% Confidence
            </span>
          </div>
        </div>
      </div>

      {/* Sensor Sanitization & Anomaly Detection Alert Card */}
      {sensorWarnings.length > 0 ? (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-5 sm:p-6 text-rose-950 shadow-md">
          <div className="flex items-center space-x-2 text-rose-800 font-bold mb-2">
            <AlertTriangle className="w-5 h-5 text-rose-600 animate-pulse" />
            <h3 className="text-sm uppercase tracking-wider font-serif">
              SUSPICIOUS SENSOR DATA DETECTED — ADVERSARIAL FILTER TRIGGERED
            </h3>
          </div>
          <p className="text-xs text-rose-900 leading-relaxed mb-3">
            The optimization engine detected corrupted or physically impossible telemetry values. Rather than crashing or blindly accepting poisoned inputs, the system safely neutralized the anomalies using regional soil default calibrations:
          </p>
          <ul className="space-y-1.5 text-xs font-mono bg-white/80 p-3.5 rounded-xl border border-rose-200">
            {sensorWarnings.map((warning, idx) => (
              <li key={idx} className="flex items-start space-x-2 text-rose-800">
                <span className="text-rose-500">▶</span>
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-4 flex items-center justify-between text-xs text-emerald-900">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span className="font-semibold">
              All IoT sensor telemetry within valid biological bounds (pH 6.2–7.8, NPK optimal).
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-700 font-bold">100% Signal Purity</span>
        </div>
      )}

      {/* Stress Scenario Selector Buttons */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm">
        <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-4">
          Select Active Agricultural Stressor
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <button
            onClick={() => onSelectScenario('normal')}
            className={`p-3 rounded-2xl border text-left transition-all ${
              activeScenario.id === 'normal'
                ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                : 'border-stone-200 hover:border-stone-300 bg-stone-50/40'
            }`}
          >
            <span className="font-bold text-emerald-950 block">Normal Baseline</span>
            <span className="text-[10px] text-stone-500 mt-1 block">Ideal conditions</span>
          </button>

          <button
            onClick={() => onSelectScenario('drought')}
            className={`p-3 rounded-2xl border text-left transition-all ${
              activeScenario.id === 'drought'
                ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-500/20'
                : 'border-stone-200 hover:border-amber-300 bg-stone-50/40'
            }`}
          >
            <span className="font-bold text-amber-950 block">Severe Drought</span>
            <span className="text-[10px] text-amber-700 mt-1 block">-45% water quota</span>
          </button>

          <button
            onClick={() => onSelectScenario('market_crash')}
            className={`p-3 rounded-2xl border text-left transition-all ${
              activeScenario.id === 'market_crash'
                ? 'border-rose-500 bg-rose-50 ring-2 ring-rose-500/20'
                : 'border-stone-200 hover:border-rose-300 bg-stone-50/40'
            }`}
          >
            <span className="font-bold text-rose-950 block">Market Crash</span>
            <span className="text-[10px] text-rose-700 mt-1 block">Tomato/Cotton -60%</span>
          </button>

          <button
            onClick={() => onSelectScenario('heavy_rain')}
            className={`p-3 rounded-2xl border text-left transition-all ${
              activeScenario.id === 'heavy_rain'
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20'
                : 'border-stone-200 hover:border-blue-300 bg-stone-50/40'
            }`}
          >
            <span className="font-bold text-blue-950 block">Heavy Rain / Flood</span>
            <span className="text-[10px] text-blue-700 mt-1 block">+65% pathogen surge</span>
          </button>

          <button
            onClick={() => onSelectScenario('extreme_weather')}
            className={`p-3 rounded-2xl border text-left transition-all ${
              activeScenario.id === 'extreme_weather'
                ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-500/20'
                : 'border-stone-200 hover:border-orange-300 bg-stone-50/40'
            }`}
          >
            <span className="font-bold text-orange-950 block">Heatwave Shock</span>
            <span className="text-[10px] text-orange-700 mt-1 block">-28% cereal yields</span>
          </button>

          <button
            onClick={() => onSelectScenario('corrupt_sensor')}
            className={`p-3 rounded-2xl border text-left transition-all ${
              activeScenario.id === 'corrupt_sensor'
                ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-500/20'
                : 'border-stone-200 hover:border-purple-300 bg-stone-50/40'
            }`}
          >
            <span className="font-bold text-purple-950 block">Corrupt Sensor</span>
            <span className="text-[10px] text-purple-700 mt-1 block">pH 13.8 anomaly</span>
          </button>
        </div>
      </div>

      {/* Comparison: Base Plan vs Stress-Tested Plan */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div>
            <h3 className="text-base font-black text-emerald-950 font-serif">
              Resilience Response: Base Plan vs Stress-Tested Adaptive Plan
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Active Stress Condition: <strong className="text-emerald-900">{activeScenario.name}</strong> ({activeScenario.description})
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
          {/* Base Plan */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
              Initial Baseline Schedule
            </span>
            <h4 className="text-sm font-bold text-stone-900 mb-2 font-serif">
              {basePlan.strategyName} (Unstressed)
            </h4>
            <div className="space-y-1.5">
              {basePlan.seasons.map((s, idx) => (
                <div key={idx} className="flex justify-between items-center py-1 border-b border-stone-200/60">
                  <span className="text-stone-600">Y{s.year} {s.seasonName.split(' ')[0]}:</span>
                  <span className="font-semibold text-stone-900">{s.crop.name}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-2 text-[11px] text-stone-600 flex justify-between font-mono font-semibold">
              <span>Profit: ₹{Math.round(basePlan.metrics.netProfitInr).toLocaleString()}</span>
              <span>Water: {(basePlan.metrics.totalWaterUsedM3 / 1000).toFixed(1)}k m³</span>
            </div>
          </div>

          {/* Stress-Tested Adapted Plan */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-300 text-xs">
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">
              Dynamic Re-Optimized Rotation
            </span>
            <h4 className="text-sm font-bold text-emerald-950 mb-2 font-serif">
              {activePlan.strategyName} under {activeScenario.name}
            </h4>
            <div className="space-y-1.5">
              {activePlan.seasons.map((s, idx) => {
                const changed = basePlan.seasons[idx] && basePlan.seasons[idx].crop.id !== s.crop.id;
                return (
                  <div key={idx} className={`flex justify-between items-center py-1 border-b border-emerald-200/60 ${changed ? 'bg-lime-200/60 px-2 rounded-md font-bold' : ''}`}>
                    <span className="text-stone-600">Y{s.year} {s.seasonName.split(' ')[0]}:</span>
                    <span className={changed ? 'text-emerald-950 font-bold' : 'font-semibold text-stone-900'}>
                      {s.crop.name} {changed && '(Replaced)'}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 pt-2 text-[11px] text-emerald-900 flex justify-between font-mono font-bold">
              <span>Profit: ₹{Math.round(activePlan.metrics.netProfitInr).toLocaleString()}</span>
              <span>Water: {(activePlan.metrics.totalWaterUsedM3 / 1000).toFixed(1)}k m³</span>
            </div>
          </div>
        </div>

        {/* Explainability Breakdown of the Change */}
        <div className="mt-5 p-4 rounded-2xl bg-emerald-950 text-white text-xs">
          <div className="flex items-center space-x-2 text-lime-400 font-bold uppercase tracking-wider text-[11px] mb-2">
            <Sparkles className="w-4 h-4 text-lime-400" />
            <span>Why Did the Optimizer Adjust the Rotation?</span>
          </div>

          {cropReplacements.length > 0 ? (
            <div className="space-y-2 text-emerald-100">
              <p>
                Under the stressor <strong>{activeScenario.name}</strong>, the original crop sequence breached critical operating constraints. The engine executed algorithmic replacement:
              </p>
              <ul className="list-disc list-inside space-y-1 font-mono text-[11px]">
                {cropReplacements.map((cr, idx) => (
                  <li key={idx}>
                    {cr.season}: Replaced <span className="line-through text-rose-300">{cr.from}</span> with{' '}
                    <span className="text-lime-300 font-bold">{cr.to}</span> to maintain feasibility and protect margins.
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-emerald-100">
              The baseline rotation was already resilient enough to absorb the stress conditions without requiring crop substitution, remaining completely feasible with zero deficit violations.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
