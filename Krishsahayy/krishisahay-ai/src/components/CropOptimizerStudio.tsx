import React, { useState } from 'react';
import {
  Sliders,
  Settings,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Droplets,
  Layers,
  ShieldCheck,
  Award,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  FarmProfile,
  OptimizationWeights,
  RotationPlan,
  SoilType,
  IrrigationType,
  StressScenario,
} from '../types/agricultural';
import { CROPS_DATABASE } from '../services/cropData';
import { DEMO_PRESETS } from '../data/demoFarms';
import { RotationTimeline } from './RotationTimeline';
import { StrategyComparisonView } from './StrategyComparisonView';

interface CropOptimizerStudioProps {
  farm: FarmProfile;
  setFarm: React.Dispatch<React.SetStateAction<FarmProfile>>;
  weights: OptimizationWeights;
  setWeights: React.Dispatch<React.SetStateAction<OptimizationWeights>>;
  activePlan: RotationPlan;
  profitPlan: RotationPlan;
  sustainabilityPlan: RotationPlan;
  balancedPlan: RotationPlan;
  onSelectPlan: (plan: RotationPlan) => void;
  onRunOptimization: () => void;
  onAskAiWhy: () => void;
  isOptimizing: boolean;
  activeScenario: StressScenario;
}

export const CropOptimizerStudio: React.FC<CropOptimizerStudioProps> = ({
  farm,
  setFarm,
  weights,
  setWeights,
  activePlan,
  profitPlan,
  sustainabilityPlan,
  balancedPlan,
  onSelectPlan,
  onRunOptimization,
  onAskAiWhy,
  isOptimizing,
  activeScenario,
}) => {
  const [showAdvancedInputs, setShowAdvancedInputs] = useState(false);
  const [activeStrategySubTab, setActiveStrategySubTab] = useState<'timeline' | 'compare'>('timeline');

  // Handle preset farm load
  const handleSelectPreset = (key: string) => {
    if (DEMO_PRESETS[key]) {
      setFarm(DEMO_PRESETS[key]);
    }
  };

  // Weight normalization display
  const totalWeight =
    weights.profitability +
    weights.yieldWeight +
    weights.soilHealth +
    weights.waterEfficiency +
    weights.diseaseRiskAversion;

  const pct = (val: number) => (totalWeight > 0 ? Math.round((val / totalWeight) * 100) : 20);

  return (
    <div className="space-y-6">
      {/* Top Controls: Farm Profile & Optimization Objective Weights */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-emerald-900/10 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-stone-100 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                <Settings className="w-4 h-4" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-emerald-950 font-serif">
                Crop Rotation Optimization Engine
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Configure farm constraints, planning horizons, and algorithmic optimization priorities.
            </p>
          </div>

          {/* Quick Preset Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-stone-500">Preset Holding:</span>
            <select
              value={Object.keys(DEMO_PRESETS).find((k) => DEMO_PRESETS[k].farmName === farm.farmName) || 'warangal_mixed'}
              onChange={(e) => handleSelectPreset(e.target.value)}
              className="bg-stone-50 border border-stone-200 text-xs font-semibold rounded-xl px-3 py-2 text-emerald-950 focus:border-emerald-600 outline-hidden"
            >
              <option value="warangal_mixed">Warangal Loam (3.0 Ha)</option>
              <option value="thanjavur_delta">Thanjavur Delta Clay (2.5 Ha)</option>
              <option value="anantapur_dryland">Anantapur Dryland Red (3.5 Ha)</option>
              <option value="malwa_plateau">Malwa Black Cotton (4.0 Ha)</option>
            </select>
          </div>
        </div>

        {/* Primary Inputs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mt-5 text-xs">
          {/* Farm Area */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
              Farm Area (Ha)
            </label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              max="50"
              value={farm.areaHa}
              onChange={(e) => setFarm({ ...farm, areaHa: parseFloat(e.target.value) || 1 })}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-bold text-emerald-950 focus:bg-white focus:border-emerald-600 outline-hidden"
            />
          </div>

          {/* Soil Type */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
              Soil Type
            </label>
            <select
              value={farm.soilType}
              onChange={(e) => setFarm({ ...farm, soilType: e.target.value as SoilType })}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-semibold text-emerald-950 focus:bg-white focus:border-emerald-600 outline-hidden"
            >
              <option value="Loamy">Loamy</option>
              <option value="Clay">Clay</option>
              <option value="Black Cotton">Black Cotton</option>
              <option value="Alluvial">Alluvial</option>
              <option value="Red Soil">Red Soil</option>
              <option value="Sandy">Sandy</option>
            </select>
          </div>

          {/* Planning Horizon */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
              Horizon (Years)
            </label>
            <select
              value={farm.planningHorizonYears}
              onChange={(e) => setFarm({ ...farm, planningHorizonYears: parseInt(e.target.value, 10) as any })}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-bold text-emerald-950 focus:bg-white focus:border-emerald-600 outline-hidden"
            >
              <option value={1}>1 Year Horizon</option>
              <option value={2}>2 Years Horizon</option>
              <option value={3}>3 Years Horizon</option>
              <option value={5}>5 Years Horizon</option>
            </select>
          </div>

          {/* Seasons per year */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
              Seasons / Year
            </label>
            <select
              value={farm.seasonsPerYear}
              onChange={(e) => setFarm({ ...farm, seasonsPerYear: parseInt(e.target.value, 10) as any })}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-bold text-emerald-950 focus:bg-white focus:border-emerald-600 outline-hidden"
            >
              <option value={1}>1 (Kharif only)</option>
              <option value={2}>2 (Kharif + Rabi)</option>
              <option value={3}>3 (Kharif + Rabi + Zaid)</option>
            </select>
          </div>

          {/* Available Water */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
              Water (m³/Ha)
            </label>
            <input
              type="number"
              step="500"
              min="1000"
              max="20000"
              value={farm.availableWaterM3PerHa}
              onChange={(e) => setFarm({ ...farm, availableWaterM3PerHa: parseInt(e.target.value, 10) || 3000 })}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-bold text-cyan-950 focus:bg-white focus:border-emerald-600 outline-hidden"
            />
          </div>

          {/* Irrigation Type */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
              Irrigation Type
            </label>
            <select
              value={farm.irrigationType}
              onChange={(e) => setFarm({ ...farm, irrigationType: e.target.value as IrrigationType })}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-semibold text-emerald-950 focus:bg-white focus:border-emerald-600 outline-hidden"
            >
              <option value="Drip Irrigation">Drip Irrigation</option>
              <option value="Sprinkler">Sprinkler</option>
              <option value="Tube-well Bore">Tube-well Bore</option>
              <option value="Canal / Flood">Canal / Flood</option>
              <option value="Rainfed">Rainfed</option>
            </select>
          </div>
        </div>

        {/* Toggle Advanced Inputs (Soil NPK, pH, Labour, Budget, Machinery) */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
          <button
            onClick={() => setShowAdvancedInputs(!showAdvancedInputs)}
            className="flex items-center space-x-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950"
          >
            <span>{showAdvancedInputs ? 'Hide Advanced Soil & Resource Constraints' : 'View / Edit Soil NPK, pH, Labour & Budget'}</span>
            {showAdvancedInputs ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Advanced Inputs Drawer */}
        {showAdvancedInputs && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mt-4 p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs animate-in fade-in duration-200">
            <div>
              <label className="text-[10px] font-bold uppercase text-stone-500 block mb-1">Soil pH</label>
              <input
                type="number"
                step="0.1"
                min="4.0"
                max="9.5"
                value={farm.soilPh}
                onChange={(e) => setFarm({ ...farm, soilPh: parseFloat(e.target.value) || 6.8 })}
                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-stone-500 block mb-1">Nitrogen (kg/ha)</label>
              <input
                type="number"
                value={farm.nitrogenKgPerHa}
                onChange={(e) => setFarm({ ...farm, nitrogenKgPerHa: parseInt(e.target.value, 10) || 200 })}
                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-stone-500 block mb-1">Phosphorus (kg/ha)</label>
              <input
                type="number"
                value={farm.phosphorusKgPerHa}
                onChange={(e) => setFarm({ ...farm, phosphorusKgPerHa: parseInt(e.target.value, 10) || 30 })}
                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-stone-500 block mb-1">Potassium (kg/ha)</label>
              <input
                type="number"
                value={farm.potassiumKgPerHa}
                onChange={(e) => setFarm({ ...farm, potassiumKgPerHa: parseInt(e.target.value, 10) || 200 })}
                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-stone-500 block mb-1">Budget (INR)</label>
              <input
                type="number"
                step="10000"
                value={farm.budgetInr}
                onChange={(e) => setFarm({ ...farm, budgetInr: parseInt(e.target.value, 10) || 100000 })}
                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 font-bold font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-stone-500 block mb-1">Labour (Days)</label>
              <input
                type="number"
                value={farm.labourAvailabilityDays}
                onChange={(e) => setFarm({ ...farm, labourAvailabilityDays: parseInt(e.target.value, 10) || 120 })}
                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 font-bold"
              />
            </div>
          </div>
        )}

        {/* Multi-Objective Optimization Weights Sliders (Auto-normalizes to 100%) */}
        <div className="mt-6 pt-5 border-t border-stone-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-1.5">
              <Sliders className="w-4 h-4 text-emerald-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-950 font-serif">
                Multi-Objective Scoring Weights (Auto-Normalized to 100%)
              </h3>
            </div>
            <span className="text-[11px] text-stone-500 hidden sm:inline">
              Adjust sliders to skew optimization towards specific agronomic goals
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 text-xs">
            {/* Profitability */}
            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-stone-700">Profitability</span>
                <span className="font-bold text-emerald-800 font-mono">{pct(weights.profitability)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weights.profitability}
                onChange={(e) => setWeights({ ...weights, profitability: parseInt(e.target.value, 10) })}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Expected Yield */}
            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-stone-700">Yield Volume</span>
                <span className="font-bold text-emerald-800 font-mono">{pct(weights.yieldWeight)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weights.yieldWeight}
                onChange={(e) => setWeights({ ...weights, yieldWeight: parseInt(e.target.value, 10) })}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Soil Health */}
            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-stone-700">Soil Health</span>
                <span className="font-bold text-emerald-800 font-mono">{pct(weights.soilHealth)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weights.soilHealth}
                onChange={(e) => setWeights({ ...weights, soilHealth: parseInt(e.target.value, 10) })}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Water Efficiency */}
            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-stone-700">Water Efficiency</span>
                <span className="font-bold text-cyan-800 font-mono">{pct(weights.waterEfficiency)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weights.waterEfficiency}
                onChange={(e) => setWeights({ ...weights, waterEfficiency: parseInt(e.target.value, 10) })}
                className="w-full accent-cyan-600 cursor-pointer"
              />
            </div>

            {/* Disease Risk Aversion */}
            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-stone-700">Disease Biosecurity</span>
                <span className="font-bold text-amber-800 font-mono">{pct(weights.diseaseRiskAversion)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weights.diseaseRiskAversion}
                onChange={(e) => setWeights({ ...weights, diseaseRiskAversion: parseInt(e.target.value, 10) })}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Action Button Row */}
        <div className="mt-6 pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={onRunOptimization}
              disabled={isOptimizing}
              className="flex items-center space-x-2 bg-emerald-900 hover:bg-emerald-950 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-95"
            >
              <Play className="w-4 h-4 fill-current text-lime-400" />
              <span>{isOptimizing ? 'Evaluating Permutations...' : 'Run Mathematical Optimization'}</span>
            </button>

            <button
              onClick={onAskAiWhy}
              className="flex items-center space-x-1.5 bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 font-bold px-3.5 py-2.5 rounded-xl text-xs transition-all"
            >
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Ask AI Why This Plan</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-stone-500">View Mode:</span>
            <div className="bg-stone-100 p-1 rounded-xl flex items-center space-x-1 text-xs">
              <button
                onClick={() => setActiveStrategySubTab('timeline')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  activeStrategySubTab === 'timeline'
                    ? 'bg-white text-emerald-950 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Multi-Year Schedule
              </button>
              <button
                onClick={() => setActiveStrategySubTab('compare')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  activeStrategySubTab === 'compare'
                    ? 'bg-white text-emerald-950 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Compare 3 Strategies
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main View: Timeline or Strategy Comparison */}
      {activeStrategySubTab === 'timeline' ? (
        <RotationTimeline plan={activePlan} />
      ) : (
        <StrategyComparisonView
          profitPlan={profitPlan}
          sustainabilityPlan={sustainabilityPlan}
          balancedPlan={balancedPlan}
          activePlan={activePlan}
          onSelectPlan={onSelectPlan}
        />
      )}
    </div>
  );
};
