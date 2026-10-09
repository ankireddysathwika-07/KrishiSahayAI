import React from 'react';
import {
  X,
  Workflow,
  Database,
  Layers,
  Droplets,
  TrendingUp,
  ShieldCheck,
  Cpu,
  Sparkles,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const pipelineSteps = [
    {
      step: 1,
      title: 'Farmer Inputs & Sensor Telemetry',
      desc: 'Area (ha), soil type, initial NPK, pH, available irrigation quota, seasonal budget, labour, and past crop history.',
      icon: Database,
      badge: 'Input Layer',
    },
    {
      step: 2,
      title: 'Adversarial Telemetry Validation',
      desc: 'Sanitizes corrupted/impossible probe readings (e.g. pH 13.8 or N 9999). Computes Data Quality & Confidence Index.',
      icon: ShieldCheck,
      badge: 'Resilience Layer',
    },
    {
      step: 3,
      title: 'Domain Intelligence Synthesis',
      desc: 'Couples SoilSense (nutrient dynamics), WaterSense (quota balance), AgriMarket (forward mandi price forecasts), and Weather.',
      icon: Layers,
      badge: 'Domain Models',
    },
    {
      step: 4,
      title: 'Agronomic Constraint Engine',
      desc: 'Hard-verifies seasonal irrigation limits, budget ceilings, labour days, and Solanaceae/Poaceae monoculture biosecurity.',
      icon: FileCheck,
      badge: 'Constraint Filter',
    },
    {
      step: 5,
      title: 'Multi-Objective Pareto Optimization',
      desc: 'Deterministic algorithmic search across candidate crop permutations balancing Profit, Yield, Soil, Water, and Disease Risk.',
      icon: Cpu,
      badge: 'Optimization Core',
    },
    {
      step: 6,
      title: 'Multi-Season Soil & Economic Simulation',
      desc: 'Simulates step-by-step biological Rhizobium N-fixation, nutrient drawdown, pathogen build-up, and cashflow across 1–5 years.',
      icon: Workflow,
      badge: 'Simulation Horizon',
    },
    {
      step: 7,
      title: 'Gemini 3.8 Flash Grounded Explainability',
      desc: 'Generates deep, transparent natural-language agronomic rationale strictly grounded in calculated numerical outputs.',
      icon: Sparkles,
      badge: 'AI Explainability',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-emerald-900/10 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 bg-gradient-to-r from-emerald-950 via-emerald-900 to-green-950 text-white flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-lime-400 text-emerald-950 flex items-center justify-center font-bold">
              <Workflow className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-serif text-white">System Technical Architecture</h3>
              <p className="text-xs text-emerald-200">
                End-to-end data flow: Inputs ➔ Constraints ➔ Deterministic Optimizer ➔ Gemini Rationale
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-emerald-300 hover:text-white rounded-xl hover:bg-emerald-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {pipelineSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.step} className="flex items-start space-x-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-200 hover:border-emerald-300 transition-all">
                <div className="w-8 h-8 rounded-xl bg-emerald-900 text-white flex items-center justify-center font-bold text-xs shrink-0 font-serif">
                  {step.step}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-emerald-950 text-sm font-serif">{step.title}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {step.badge}
                    </span>
                  </div>
                  <p className="text-stone-600 mt-1 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button onClick={onClose} className="px-5 py-2 rounded-xl bg-emerald-900 text-white font-bold text-xs hover:bg-emerald-950">
            Close Architecture
          </button>
        </div>
      </div>
    </div>
  );
};
