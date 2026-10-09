import React from 'react';
import {
  Check,
  TrendingUp,
  Droplets,
  Layers,
  ShieldCheck,
  Award,
  AlertTriangle,
  ArrowRight,
  Scale,
} from 'lucide-react';
import { RotationPlan } from '../types/agricultural';

interface StrategyComparisonViewProps {
  profitPlan: RotationPlan;
  sustainabilityPlan: RotationPlan;
  balancedPlan: RotationPlan;
  activePlan: RotationPlan;
  onSelectPlan: (plan: RotationPlan) => void;
}

export const StrategyComparisonView: React.FC<StrategyComparisonViewProps> = ({
  profitPlan,
  sustainabilityPlan,
  balancedPlan,
  activePlan,
  onSelectPlan,
}) => {
  const plans = [
    {
      plan: balancedPlan,
      tag: 'RECOMMENDED PARETO',
      theme: 'border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50/20',
      badge: 'bg-emerald-800 text-white',
      accentText: 'text-emerald-950',
    },
    {
      plan: profitPlan,
      tag: 'FINANCIAL MAXIMIZATION',
      theme: 'border-amber-400 bg-amber-50/20',
      badge: 'bg-amber-700 text-white',
      accentText: 'text-amber-950',
    },
    {
      plan: sustainabilityPlan,
      tag: 'ECOLOGICAL RESTORATION',
      theme: 'border-lime-500 bg-lime-50/20',
      badge: 'bg-lime-800 text-white',
      accentText: 'text-lime-950',
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-emerald-900/10 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-stone-100 gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <Scale className="w-5 h-5 text-emerald-700" />
            <h2 className="text-xl sm:text-2xl font-black text-emerald-950 font-serif">
              Three Strategic Rotation Pathways
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Compare algorithmic trade-offs across Profit, Soil Health, Water Stewardship, and Disease Risk. No single plan is universally best—the farmer chooses based on seasonal priorities.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-6">
        {plans.map(({ plan, tag, theme, badge, accentText }) => {
          const isActive = activePlan.id === plan.id || activePlan.strategyName === plan.strategyName;
          const { metrics } = plan;

          return (
            <div
              key={plan.strategyName}
              className={`rounded-2xl p-5 border flex flex-col justify-between transition-all ${
                isActive ? 'border-emerald-700 ring-2 ring-emerald-600/30 shadow-lg bg-white' : 'border-stone-200 bg-stone-50/40 hover:bg-white hover:border-emerald-400 shadow-xs'
              }`}
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${badge}`}>
                    {tag}
                  </span>
                  {isActive && (
                    <span className="flex items-center space-x-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>Active Plan</span>
                    </span>
                  )}
                </div>

                <h3 className={`text-xl font-black font-serif ${accentText}`}>
                  {plan.strategyName}
                </h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  {plan.description}
                </p>

                {/* Crop Sequence Flow */}
                <div className="mt-4 p-3 rounded-xl bg-white border border-stone-200/80 shadow-2xs">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1.5">
                    Crop Trajectory ({plan.seasons.length} Seasons):
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-emerald-950">
                    {plan.seasons.map((s, idx) => (
                      <React.Fragment key={idx}>
                        <span className="px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200">
                          {s.crop.name.split(' ')[0]}
                        </span>
                        {idx < plan.seasons.length - 1 && (
                          <ArrowRight className="w-3 h-3 text-stone-400 shrink-0" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Numerical Trade-Off Metrics Matrix */}
                <div className="space-y-2.5 mt-4 text-xs">
                  {/* Profit */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-stone-50">
                    <span className="text-stone-600 flex items-center space-x-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Net Profit:</span>
                    </span>
                    <span className="font-bold font-serif text-sm text-emerald-950">
                      ₹{Math.round(metrics.netProfitInr).toLocaleString()}
                    </span>
                  </div>

                  {/* Water Used */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-stone-50">
                    <span className="text-stone-600 flex items-center space-x-1.5">
                      <Droplets className="w-3.5 h-3.5 text-cyan-600" />
                      <span>Water Consumption:</span>
                    </span>
                    <span className="font-bold text-stone-800">
                      {(metrics.totalWaterUsedM3 / 1000).toFixed(1)}k m³
                      {metrics.waterDeficitM3 > 0 && (
                        <span className="text-rose-600 text-[10px] ml-1 font-bold">
                          (Deficit!)
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Soil Health Delta */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-stone-50">
                    <span className="text-stone-600 flex items-center space-x-1.5">
                      <Layers className="w-3.5 h-3.5 text-amber-600" />
                      <span>Soil Health Delta:</span>
                    </span>
                    <span
                      className={`font-bold ${
                        metrics.soilHealthDelta >= 0 ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {metrics.soilHealthDelta >= 0 ? `+${metrics.soilHealthDelta}` : metrics.soilHealthDelta} pts ({metrics.finalSoilHealth}/100)
                    </span>
                  </div>

                  {/* Disease Risk */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-stone-50">
                    <span className="text-stone-600 flex items-center space-x-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-stone-500" />
                      <span>Pathogen Risk:</span>
                    </span>
                    <span className="font-bold text-stone-800">
                      {metrics.averageDiseaseRisk}/100 ({metrics.averageDiseaseRisk <= 32 ? 'Low' : 'Moderate'})
                    </span>
                  </div>

                  {/* Sustainability Score */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-stone-50">
                    <span className="text-stone-600 flex items-center space-x-1.5">
                      <Award className="w-3.5 h-3.5 text-lime-600" />
                      <span>Sustainability Index:</span>
                    </span>
                    <span className="font-bold text-lime-900 font-serif">
                      {metrics.sustainabilityScore}/100
                    </span>
                  </div>
                </div>

                {/* Feasibility Check */}
                {!plan.isFeasible && (
                  <div className="mt-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold block">Hard Constraint Warning:</strong>
                      <span className="text-[11px] leading-snug block">
                        {plan.rejectionReasons[0] || 'Violates operational capacity thresholds.'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Activation CTA */}
              <div className="mt-5 pt-4 border-t border-stone-100">
                <button
                  onClick={() => onSelectPlan(plan)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-900 text-white cursor-default shadow-xs'
                      : 'bg-stone-100 hover:bg-emerald-800 hover:text-white text-stone-800 active:scale-95'
                  }`}
                >
                  {isActive ? '✓ Currently Selected Strategy' : `Activate ${plan.strategyName}`}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
