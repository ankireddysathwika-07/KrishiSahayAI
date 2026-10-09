import React from 'react';
import {
  Sparkles,
  Play,
  CloudSunRain,
  TrendingDown,
  ThermometerSun,
  AlertTriangle,
  HelpCircle,
  FileDown,
  Scale,
  RefreshCw,
} from 'lucide-react';
import { StressScenario } from '../types/agricultural';

interface HeroBannerProps {
  onRunOptimization: () => void;
  onSelectScenario: (scenarioId: StressScenario['id']) => void;
  activeScenarioId: string;
  onAskAiWhy: () => void;
  onOpenReport: () => void;
  onOpenCompare: () => void;
  isOptimizing: boolean;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onRunOptimization,
  onSelectScenario,
  activeScenarioId,
  onAskAiWhy,
  onOpenReport,
  onOpenCompare,
  isOptimizing,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-stone-900 text-white p-6 sm:p-8 shadow-xl border border-emerald-800/40">
      {/* Decorative agronomic pattern */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-10 w-72 h-72 bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-800/60 border border-emerald-600/40 text-emerald-300 text-xs font-semibold mb-4 backdrop-blur-xs">
          <Sparkles className="w-3.5 h-3.5 text-lime-400" />
          <span>Hackathon Engine: Multi-Season Agronomic Optimization</span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-serif leading-tight">
          Plan Every Season. <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-300 via-emerald-200 to-teal-300">Protect Every Acre.</span>
        </h1>

        <p className="mt-3 text-sm sm:text-base text-emerald-100/90 leading-relaxed font-normal max-w-2xl">
          A farmer shouldn't just ask <span className="italic font-medium text-lime-200">“What should I plant today?”</span> They need to know how today's planting affects{' '}
          <strong className="text-white font-semibold">Profit, Soil Health, Water Security, and Disease Risk</strong> over 1 to 5 years.
        </p>

        {/* Feature Pill Matrix */}
        <div className="flex flex-wrap gap-2 mt-4 pt-1">
          <span className="inline-flex items-center text-[11px] font-semibold bg-emerald-800/50 text-emerald-200 px-2.5 py-1 rounded-md border border-emerald-700/50">
            ✓ Deterministic Multi-Objective Pareto Search
          </span>
          <span className="inline-flex items-center text-[11px] font-semibold bg-emerald-800/50 text-emerald-200 px-2.5 py-1 rounded-md border border-emerald-700/50">
            ✓ Dynamic NPK & Organic Matter Simulation
          </span>
          <span className="inline-flex items-center text-[11px] font-semibold bg-emerald-800/50 text-emerald-200 px-2.5 py-1 rounded-md border border-emerald-700/50">
            ✓ Pathogen Disruption Modeling
          </span>
          <span className="inline-flex items-center text-[11px] font-semibold bg-emerald-800/50 text-emerald-200 px-2.5 py-1 rounded-md border border-emerald-700/50">
            ✓ Real-Time Mandi Price Coupling
          </span>
        </div>
      </div>

      {/* Prominent Judge Demo Button Bar */}
      <div className="relative z-10 mt-6 pt-5 border-t border-emerald-800/60">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
            ⚡ Interactive Hackathon Evaluation Controls
          </span>
          <span className="text-[11px] text-emerald-200/70 hidden sm:inline">
            Test system adaptability and resilience in real-time
          </span>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {/* Main Primary Trigger */}
          <button
            onClick={onRunOptimization}
            disabled={isOptimizing}
            className="flex items-center space-x-2 bg-gradient-to-r from-lime-500 to-emerald-500 hover:from-lime-400 hover:to-emerald-400 text-emerald-950 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-lg shadow-lime-500/20 active:scale-95 transition-all"
          >
            {isOptimizing ? (
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-950" />
            ) : (
              <Play className="w-4 h-4 fill-current text-emerald-950" />
            )}
            <span>{isOptimizing ? 'Optimizing Rotation...' : 'RUN AI OPTIMIZATION'}</span>
          </button>

          {/* Stress Scenario 1: Drought */}
          <button
            onClick={() => onSelectScenario('drought')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              activeScenarioId === 'drought'
                ? 'bg-amber-500 text-amber-950 border-amber-300 shadow-md'
                : 'bg-emerald-900/60 text-amber-200 border-amber-400/30 hover:bg-amber-900/30'
            }`}
          >
            <CloudSunRain className="w-3.5 h-3.5" />
            <span>SIMULATE DROUGHT</span>
          </button>

          {/* Stress Scenario 2: Market Crash */}
          <button
            onClick={() => onSelectScenario('market_crash')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              activeScenarioId === 'market_crash'
                ? 'bg-rose-500 text-white border-rose-300 shadow-md'
                : 'bg-emerald-900/60 text-rose-200 border-rose-400/30 hover:bg-rose-900/30'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5" />
            <span>SIMULATE MARKET CRASH</span>
          </button>

          {/* Stress Scenario 3: Extreme Weather */}
          <button
            onClick={() => onSelectScenario('extreme_weather')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              activeScenarioId === 'extreme_weather'
                ? 'bg-orange-500 text-white border-orange-300 shadow-md'
                : 'bg-emerald-900/60 text-orange-200 border-orange-400/30 hover:bg-orange-900/30'
            }`}
          >
            <ThermometerSun className="w-3.5 h-3.5" />
            <span>EXTREME WEATHER</span>
          </button>

          {/* Stress Scenario 4: Corrupt Sensor Test */}
          <button
            onClick={() => onSelectScenario('corrupt_sensor')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              activeScenarioId === 'corrupt_sensor'
                ? 'bg-purple-600 text-white border-purple-300 shadow-md'
                : 'bg-emerald-900/60 text-purple-200 border-purple-400/30 hover:bg-purple-900/30'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-purple-300" />
            <span>CORRUPT SENSOR TEST</span>
          </button>

          {/* Compare Rotations */}
          <button
            onClick={onOpenCompare}
            className="flex items-center space-x-1.5 bg-emerald-800/70 hover:bg-emerald-700/80 text-white px-3 py-2 rounded-xl text-xs font-semibold border border-emerald-600/40 transition-all"
          >
            <Scale className="w-3.5 h-3.5 text-emerald-300" />
            <span>COMPARE ROTATIONS</span>
          </button>

          {/* Ask AI Why */}
          <button
            onClick={onAskAiWhy}
            className="flex items-center space-x-1.5 bg-teal-800/80 hover:bg-teal-700 text-teal-100 px-3 py-2 rounded-xl text-xs font-semibold border border-teal-500/40 transition-all shadow-xs"
          >
            <HelpCircle className="w-3.5 h-3.5 text-teal-300" />
            <span>ASK AI WHY</span>
          </button>

          {/* Download Report */}
          <button
            onClick={onOpenReport}
            className="flex items-center space-x-1.5 bg-stone-800/80 hover:bg-stone-700 text-stone-200 px-3 py-2 rounded-xl text-xs font-semibold border border-stone-600/50 transition-all"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>DOWNLOAD REPORT</span>
          </button>

          {/* Normal baseline reset */}
          {activeScenarioId !== 'normal' && (
            <button
              onClick={() => onSelectScenario('normal')}
              className="text-[11px] underline text-emerald-300 hover:text-white px-2 py-1 ml-auto"
            >
              Reset to Normal Baseline
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
