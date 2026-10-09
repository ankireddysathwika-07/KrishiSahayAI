import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertCircle,
  Sparkles,
  RefreshCw,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
  Sliders,
  Check,
} from 'lucide-react';
import { CURRENT_MARKET_INTELLIGENCE, MarketPriceForecast } from '../services/marketModel';
import { CROPS_DATABASE } from '../services/cropData';
import { FarmProfile, RotationPlan } from '../types/agricultural';

interface AgriMarketModuleProps {
  farm: FarmProfile;
  plan: RotationPlan;
  onUpdateCropPriceModifier?: (cropId: string, multiplier: number) => void;
  onTriggerReoptimization: () => void;
}

export const AgriMarketModule: React.FC<AgriMarketModuleProps> = ({
  farm,
  plan,
  onUpdateCropPriceModifier,
  onTriggerReoptimization,
}) => {
  // Local simulated price shocks for hackathon interactive testing
  const [customPriceMultipliers, setCustomPriceMultipliers] = useState<{ [id: string]: number }>({
    tomato: 1.0,
    cotton: 1.0,
    onion: 1.0,
    rice: 1.0,
    soybean: 1.0,
  });

  const handleSliderChange = (cropId: string, val: number) => {
    setCustomPriceMultipliers((prev) => ({
      ...prev,
      [cropId]: val,
    }));
    if (onUpdateCropPriceModifier) {
      onUpdateCropPriceModifier(cropId, val);
    }
  };

  const cropKeys = Object.keys(CURRENT_MARKET_INTELLIGENCE);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-emerald-950 font-serif">
              AgriMarket™ Live Price Forecasting & Rotation Coupling
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            AgriMarket directly feeds forward price forecasts into the optimization engine:
            <code className="bg-stone-100 text-emerald-900 px-1.5 py-0.5 rounded font-mono ml-1">
              Expected Revenue = Expected Yield × Market Price
            </code>{' '}
            ➔{' '}
            <code className="bg-stone-100 text-emerald-900 px-1.5 py-0.5 rounded font-mono">
              Net Profit = Revenue – Cost
            </code>
          </p>
        </div>

        <button
          onClick={onTriggerReoptimization}
          className="flex items-center space-x-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Apply Market Signals & Re-Optimize</span>
        </button>
      </div>

      {/* Interactive Price Sensitivity Stress Sliders */}
      <div className="bg-gradient-to-br from-stone-900 to-emerald-950 rounded-3xl p-5 sm:p-6 text-white border border-emerald-800/60 shadow-md">
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-emerald-800/60">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-lime-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-lime-300">
              Interactive Price Volatility Simulator
            </h3>
          </div>
          <span className="text-[11px] text-emerald-200">
            Slide to simulate sudden market shocks; see how the rotation adapts
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs mt-3">
          {/* Tomato Shock */}
          <div className="bg-emerald-900/40 p-3.5 rounded-2xl border border-emerald-700/40">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-white">Tomato Market Price</span>
              <span className={`font-mono font-bold ${customPriceMultipliers.tomato < 1 ? 'text-rose-400' : 'text-lime-400'}`}>
                {Math.round(customPriceMultipliers.tomato * 100)}% (₹{Math.round(14000 * customPriceMultipliers.tomato).toLocaleString()}/t)
              </span>
            </div>
            <input
              type="range"
              min="0.3"
              max="1.6"
              step="0.05"
              value={customPriceMultipliers.tomato}
              onChange={(e) => handleSliderChange('tomato', parseFloat(e.target.value))}
              className="w-full accent-lime-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-1">
              <span>-70% Crash</span>
              <span>Baseline</span>
              <span>+60% Surge</span>
            </div>
          </div>

          {/* Cotton Shock */}
          <div className="bg-emerald-900/40 p-3.5 rounded-2xl border border-emerald-700/40">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-white">Cotton Market Price</span>
              <span className={`font-mono font-bold ${customPriceMultipliers.cotton < 1 ? 'text-rose-400' : 'text-lime-400'}`}>
                {Math.round(customPriceMultipliers.cotton * 100)}% (₹{Math.round(71000 * customPriceMultipliers.cotton).toLocaleString()}/t)
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.05"
              value={customPriceMultipliers.cotton}
              onChange={(e) => handleSliderChange('cotton', parseFloat(e.target.value))}
              className="w-full accent-lime-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-1">
              <span>-50% Dip</span>
              <span>Baseline</span>
              <span>+50% Boom</span>
            </div>
          </div>

          {/* Onion Shock */}
          <div className="bg-emerald-900/40 p-3.5 rounded-2xl border border-emerald-700/40">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-white">Onion Market Price</span>
              <span className={`font-mono font-bold ${customPriceMultipliers.onion < 1 ? 'text-rose-400' : 'text-lime-400'}`}>
                {Math.round(customPriceMultipliers.onion * 100)}% (₹{Math.round(19000 * customPriceMultipliers.onion).toLocaleString()}/t)
              </span>
            </div>
            <input
              type="range"
              min="0.4"
              max="1.6"
              step="0.05"
              value={customPriceMultipliers.onion}
              onChange={(e) => handleSliderChange('onion', parseFloat(e.target.value))}
              className="w-full accent-lime-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-1">
              <span>-60% Glut</span>
              <span>Baseline</span>
              <span>+60% Spike</span>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Mandi Price Forecast & Rotation Impact Table */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-900/10 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-emerald-950 uppercase tracking-wide flex items-center space-x-1.5">
              <ShoppingBag className="w-4 h-4 text-emerald-700" />
              <span>Agronomic Commodity Matrix & Projected Mandi Rates</span>
            </h3>
            <p className="text-xs text-stone-500">
              MSP benchmarks, forecast modal rates, and per-hectare profit potential across farm holding ({farm.areaHa} Ha)
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[10px] bg-stone-50">
                <th className="py-2.5 px-3">Crop Name</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Govt MSP</th>
                <th className="py-2.5 px-3">Forecast Mandi Rate</th>
                <th className="py-2.5 px-3">Demand Outlook</th>
                <th className="py-2.5 px-3">Est. Cost / Ha</th>
                <th className="py-2.5 px-3">Gross Rev ({farm.areaHa} Ha)</th>
                <th className="py-2.5 px-3">Net Profit Potential</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {cropKeys.map((key) => {
                const info = CURRENT_MARKET_INTELLIGENCE[key];
                const crop = CROPS_DATABASE.find((c) => c.id === key) || CROPS_DATABASE[0];
                const multiplier = customPriceMultipliers[key] || 1.0;
                const effectivePrice = Math.round(info.projectedPriceInrPerTon * multiplier);
                const totalYield = crop.expectedYieldTonPerHa * farm.areaHa;
                const grossRev = Math.round(totalYield * effectivePrice);
                const totalCost = Math.round(crop.costPerHa * farm.areaHa);
                const netProfit = grossRev - totalCost;

                return (
                  <tr key={key} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3 px-3 font-bold text-emerald-950 font-serif text-sm">
                      {info.cropName}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 text-stone-700">
                        {crop.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-stone-600">
                      {info.currentMspInrPerTon > 0 ? `₹${info.currentMspInrPerTon.toLocaleString()}/t` : 'No MSP'}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-900">
                      ₹{effectivePrice.toLocaleString()}/t
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          info.demandOutlook === 'High Demand'
                            ? 'bg-emerald-100 text-emerald-800'
                            : info.demandOutlook === 'Balanced'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {info.priceTrend.includes('+') ? (
                          <ArrowUpRight className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3 text-amber-600" />
                        )}
                        <span>{info.demandOutlook}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-stone-600">
                      ₹{crop.costPerHa.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-stone-800">
                      ₹{grossRev.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-950">
                      <span className={netProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'}>
                        ₹{netProfit.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
