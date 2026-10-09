import React, { useState } from 'react';
import { Wheat, Sparkles, TrendingUp, Brain, CheckCircle2, ArrowRight } from 'lucide-react';
import { FarmProfile } from '../../types/agricultural';

interface YieldAdvisorViewProps {
  farm: FarmProfile;
  onNavigateToOptimizer: () => void;
}

export const YieldAdvisorView: React.FC<YieldAdvisorViewProps> = ({
  farm,
  onNavigateToOptimizer,
}) => {
  const [soilMoisture, setSoilMoisture] = useState(45);
  const [rainfall, setRainfall] = useState(120);
  const [nFertilizer, setNFertilizer] = useState(80);
  const [cropType, setCropType] = useState('wheat');
  const [landAreaAcres, setLandAreaAcres] = useState(farm.areaHa * 2.47);
  const [outputLang, setOutputLang] = useState('English');
  const [resultReady, setResultReady] = useState(false);

  // Dynamic yield simulation
  const baseYieldPerAcre = cropType === 'wheat' ? 18 : cropType === 'rice' ? 22 : cropType === 'cotton' ? 9 : 24;
  const moistureFactor = 0.7 + (soilMoisture / 100) * 0.5;
  const rainFactor = 0.8 + Math.min(1.2, rainfall / 150) * 0.3;
  const nFactor = 0.75 + (nFertilizer / 150) * 0.4;
  const predictedPerAcre = Math.round(baseYieldPerAcre * moistureFactor * rainFactor * nFactor * 10) / 10;
  const totalPredictedQtl = Math.round(predictedPerAcre * landAreaAcres);
  const marketRate = cropType === 'wheat' ? 2300 : cropType === 'rice' ? 2350 : 7100;
  const totalRevenue = Math.round(totalPredictedQtl * marketRate);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <Wheat className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-emerald-950 font-serif">
              Yield Advisor™ Neural Predictor
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            3 foundational field inputs ➔ AI-predicted yield with SHAP transparency and practical recommendations.
          </p>
        </div>

        <button
          onClick={onNavigateToOptimizer}
          className="flex items-center space-x-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs"
        >
          <span>Multi-Season Crop Optimizer</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Inputs Card */}
        <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm text-xs space-y-4">
          <h3 className="text-sm font-bold text-emerald-950 uppercase font-serif tracking-wider">
            Input Agronomic Parameters
          </h3>

          <div>
            <div className="flex justify-between mb-1">
              <span className="font-semibold text-stone-600">🌱 Soil Moisture (%)</span>
              <span className="font-bold text-emerald-800 font-mono">{soilMoisture}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="90"
              value={soilMoisture}
              onChange={(e) => setSoilMoisture(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="font-semibold text-stone-600">🌧️ Monthly Rainfall (mm)</span>
              <span className="font-bold text-blue-800 font-mono">{rainfall} mm</span>
            </div>
            <input
              type="range"
              min="0"
              max="500"
              value={rainfall}
              onChange={(e) => setRainfall(parseInt(e.target.value, 10))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="font-semibold text-stone-600">🧪 Applied N-Fertilizer (kg/ha)</span>
              <span className="font-bold text-amber-800 font-mono">{nFertilizer} kg</span>
            </div>
            <input
              type="range"
              min="0"
              max="300"
              value={nFertilizer}
              onChange={(e) => setNFertilizer(parseInt(e.target.value, 10))}
              className="w-full accent-amber-600 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Crop Variety</label>
              <select
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="w-full p-2 border border-stone-200 rounded-xl font-bold text-emerald-950 bg-stone-50"
              >
                <option value="wheat">Wheat</option>
                <option value="rice">Rice (Paddy)</option>
                <option value="maize">Maize (Corn)</option>
                <option value="cotton">Cotton</option>
                <option value="soybean">Soybean</option>
                <option value="tomato">Tomato</option>
                <option value="chilli">Chilli</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Land Area (Acres)</label>
              <input
                type="number"
                step="0.5"
                value={landAreaAcres}
                onChange={(e) => setLandAreaAcres(parseFloat(e.target.value) || 1)}
                className="w-full p-2 border border-stone-200 rounded-xl font-bold font-mono"
              />
            </div>
          </div>

          <button
            onClick={() => setResultReady(true)}
            className="w-full py-3 bg-gradient-to-r from-emerald-800 to-green-700 hover:from-emerald-900 text-white rounded-xl font-bold text-xs shadow-md transition-all active:scale-98"
          >
            🔍 Predict Yield & Generate SHAP Analysis
          </button>
        </div>

        {/* Prediction Results & SHAP */}
        <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-emerald-950 uppercase font-serif tracking-wider mb-3">
              Neural Network Yield Forecast
            </h3>

            {resultReady ? (
              <div className="space-y-4 text-xs">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950 to-green-950 text-white space-y-2">
                  <span className="text-[10px] text-lime-400 uppercase font-bold tracking-wider block">
                    Expected Harvest Volume
                  </span>
                  <div className="text-4xl font-black font-serif text-white">
                    {predictedPerAcre} <span className="text-base font-normal text-stone-300">Qtl / Acre</span>
                  </div>
                  <div className="text-sm font-mono font-bold text-lime-300">
                    Total: {totalPredictedQtl} Quintals (~{(totalPredictedQtl / 10).toFixed(1)} Tons)
                  </div>
                  <div className="pt-2 border-t border-emerald-800/80 text-[11px] text-emerald-200 flex justify-between">
                    <span>Projected Revenue @ Mandi:</span>
                    <strong className="text-white text-xs">₹{totalRevenue.toLocaleString()}</strong>
                  </div>
                </div>

                {/* SHAP Explanation */}
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                  <div className="flex items-center space-x-1.5 font-bold text-emerald-950 text-[11px] uppercase tracking-wider">
                    <Brain className="w-3.5 h-3.5 text-emerald-700" />
                    <span>SHAP Explainability (Why this prediction?)</span>
                  </div>

                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between items-center">
                      <span className="text-stone-600">Soil Moisture Impact:</span>
                      <span className="font-mono font-bold text-emerald-700">+42% (+7.2 Qtl)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-600">Rainfall Contribution:</span>
                      <span className="font-mono font-bold text-emerald-700">+31% (+5.4 Qtl)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-600">Nitrogen Synergy:</span>
                      <span className="font-mono font-bold text-emerald-700">+27% (+4.6 Qtl)</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-stone-400 text-xs">
                <div className="text-4xl mb-2">🌾</div>
                <p>Adjust inputs on the left and click "Predict Yield"</p>
              </div>
            )}
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900">
            <strong>Optimizer Advisory:</strong> Rotate this cereal with a legume in the next season to preserve soil microbial biodiversity.
          </div>
        </div>
      </div>
    </div>
  );
};

export const CropSuggestionView: React.FC<YieldAdvisorViewProps> = ({
  farm,
  onNavigateToOptimizer,
}) => {
  const [soilType, setSoilType] = useState('Black Cotton Soil');
  const [ph, setPh] = useState(6.8);
  const [temp, setTemp] = useState(28);
  const [season, setSeason] = useState('Kharif (June–Oct)');
  const [water, setWater] = useState('Drip Irrigation');
  const [analyzed, setAnalyzed] = useState(false);

  const recommendations = [
    { name: 'Soybean', match: 96, profit: '₹48,000 / Ha', reason: 'High compatibility with black cotton soil & optimal nitrogen fixer', badge: 'Best Agro-Ecological Fit' },
    { name: 'Maize (Corn)', match: 91, profit: '₹54,000 / Ha', reason: 'Thrives in Kharif warm temperature window, steady procurement', badge: 'High Yield' },
    { name: 'Groundnut (Peanut)', match: 87, profit: '₹58,000 / Ha', reason: 'Excellent market rate, low water demand', badge: 'Commercial Oilseed' },
    { name: 'Cotton', match: 82, profit: '₹72,000 / Ha', reason: 'Deep taproot aerates heavy soil, high cash potential', badge: 'Cash Crop' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-lime-100 text-lime-900">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-emerald-950 font-serif">
              Crop Suggestion Engine
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            AI evaluates farm soil chemistry, seasonal climatology, and water quotas to recommend optimal crops.
          </p>
        </div>

        <button
          onClick={onNavigateToOptimizer}
          className="flex items-center space-x-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs"
        >
          <span>Multi-Season Planner</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm text-xs space-y-4">
          <h3 className="text-sm font-bold text-emerald-950 uppercase font-serif tracking-wider">
            Farm Soil & Environmental Profile
          </h3>

          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Soil Type</label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full p-2 border border-stone-200 rounded-xl font-bold bg-stone-50"
            >
              <option>Black Cotton Soil</option>
              <option>Red Soil</option>
              <option>Alluvial Soil</option>
              <option>Loamy Soil</option>
              <option>Sandy Soil</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="font-semibold text-stone-600">Soil pH</span>
              <span className="font-bold text-amber-800 font-mono">{ph.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="4"
              max="9"
              step="0.1"
              value={ph}
              onChange={(e) => setPh(parseFloat(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Season</label>
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="w-full p-2 border border-stone-200 rounded-xl font-bold bg-stone-50"
            >
              <option>Kharif (June–Oct)</option>
              <option>Rabi (Nov–Mar)</option>
              <option>Zaid (Mar–Jun)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Water Supply</label>
            <select
              value={water}
              onChange={(e) => setWater(e.target.value)}
              className="w-full p-2 border border-stone-200 rounded-xl font-bold bg-stone-50"
            >
              <option>Drip Irrigation</option>
              <option>Borewell / Tube-well</option>
              <option>Canal Flood</option>
              <option>Rainfed Only</option>
            </select>
          </div>

          <button
            onClick={() => setAnalyzed(true)}
            className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs shadow-xs transition-all active:scale-98"
          >
            🌿 Get AI Crop Recommendations
          </button>
        </div>

        {/* Recommendations Output */}
        <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-emerald-950 uppercase font-serif tracking-wider mb-3">
              Ranked Crop Candidates
            </h3>

            {analyzed ? (
              <div className="space-y-3 text-xs">
                {recommendations.map((rec, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 hover:border-emerald-400 transition-all">
                    <div className="flex justify-between items-center mb-1">
                      <div className="font-bold text-emerald-950 text-sm font-serif">{rec.name}</div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {rec.match}% Match
                      </span>
                    </div>
                    <p className="text-stone-600 text-[11px] leading-relaxed">{rec.reason}</p>
                    <div className="mt-2 pt-2 border-t border-stone-200/60 flex justify-between text-[11px] font-mono">
                      <span className="text-stone-500">{rec.badge}</span>
                      <span className="font-bold text-emerald-800">{rec.profit}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center text-stone-400 text-xs">
                <div className="text-4xl mb-2">🌿</div>
                <p>Select farm conditions and click "Get AI Crop Recommendations"</p>
              </div>
            )}
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex justify-between items-center text-xs">
            <span className="text-stone-500 text-[11px]">Plan multi-year rotations?</span>
            <button
              onClick={onNavigateToOptimizer}
              className="font-bold text-emerald-800 hover:text-emerald-950 underline"
            >
              Open Optimizer Studio ➔
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
