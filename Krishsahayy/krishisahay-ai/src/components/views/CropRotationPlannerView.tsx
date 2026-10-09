import React, { useState } from 'react';
import { Repeat, Sprout, ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { FarmProfile } from '../../types/agricultural';

interface CropRotationPlannerViewProps {
  farm: FarmProfile;
  onNavigateToOptimizer: () => void;
}

export const CropRotationPlannerView: React.FC<CropRotationPlannerViewProps> = ({
  farm,
  onNavigateToOptimizer,
}) => {
  const [curCrop, setCurCrop] = useState('Rice');
  const [soil, setSoil] = useState('Black Cotton');
  const [defNutrient, setDefNutrient] = useState('Nitrogen');
  const [generated, setGenerated] = useState(false);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <Sprout className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-emerald-950 font-serif">
              Crop Rotation Planner
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Science-based crop sequencing to maintain soil fertility and break recurring pest and disease cycles.
          </p>
        </div>

        <button
          onClick={onNavigateToOptimizer}
          className="flex items-center space-x-2 bg-gradient-to-r from-emerald-800 to-green-700 hover:from-emerald-900 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all active:scale-98"
        >
          <Sparkles className="w-3.5 h-3.5 text-lime-300" />
          <span>Launch AI Multi-Season Optimizer</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm text-xs space-y-4">
          <h3 className="text-sm font-bold text-emerald-950 uppercase font-serif tracking-wider">
            Your Farm Parameters
          </h3>

          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Current / Last Crop</label>
            <select
              value={curCrop}
              onChange={(e) => setCurCrop(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-bold text-emerald-950"
            >
              <option>Rice</option>
              <option>Wheat</option>
              <option>Cotton</option>
              <option>Maize</option>
              <option>Tomato</option>
              <option>Chilli</option>
              <option>Sugarcane</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Soil Type</label>
            <select
              value={soil}
              onChange={(e) => setSoil(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-semibold text-emerald-950"
            >
              <option>Black Cotton</option>
              <option>Red Soil</option>
              <option>Alluvial</option>
              <option>Loamy</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Deficient Nutrient</label>
            <select
              value={defNutrient}
              onChange={(e) => setDefNutrient(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-semibold text-emerald-950"
            >
              <option>Nitrogen</option>
              <option>Phosphorus</option>
              <option>Potassium</option>
              <option>None / Balanced</option>
            </select>
          </div>

          <button
            onClick={() => setGenerated(true)}
            className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs shadow-xs transition-all active:scale-98"
          >
            📋 Generate Crop Rotation Plan
          </button>
        </div>

        {/* Generated Rotation Plan */}
        <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-emerald-950 uppercase font-serif tracking-wider mb-3">
              Recommended Rotational Sequence
            </h3>

            {generated ? (
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-emerald-950 text-sm font-serif">1. Immediate Next: Chickpea (Gram)</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                      Legume Break
                    </span>
                  </div>
                  <p className="text-stone-600 leading-relaxed text-[11px]">
                    Following {curCrop} with a legume restores biologically fixed nitrogen (+40 kg N/ha) and interrupts stem borer / fungal wilt soil inoculum.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-emerald-950 text-sm font-serif">2. Season 2: Maize (Corn)</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-200 text-stone-800">
                      Cereal Anchor
                    </span>
                  </div>
                  <p className="text-stone-600 leading-relaxed text-[11px]">
                    Efficient consumer of residual legume nitrogen, high biomass production, and dependable Mandi procurement.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-lime-50 border border-lime-200">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-lime-950 text-sm font-serif">3. Season 3: Finger Millet (Ragi)</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-lime-200 text-lime-900">
                      Climate-Hardy
                    </span>
                  </div>
                  <p className="text-stone-600 leading-relaxed text-[11px]">
                    Extreme drought tolerance; cuts irrigation water consumption by 60% while providing valuable fodder.
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-stone-400 text-xs">
                <div className="text-4xl mb-2">🔄</div>
                <p>Select your farm parameters and click "Generate Crop Rotation Plan"</p>
              </div>
            )}
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs">
            <span className="text-stone-500 text-[11px]">Need 3-to-5 year multi-objective simulation?</span>
            <button
              onClick={onNavigateToOptimizer}
              className="font-bold text-emerald-800 hover:text-emerald-950 underline"
            >
              Open Hero Optimizer ➔
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
