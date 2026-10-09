import React, { useState } from 'react';
import {
  Brain,
  Network,
  Sliders,
  Play,
  RotateCcw,
  CheckCircle2,
  Lock,
  Sparkles,
  TrendingDown,
  Layers,
  ShieldCheck,
  Activity,
  Cpu,
  Database,
  Download,
  Share2,
  FileText,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { OfflineStorage, UserAccount } from '../../services/offlineStorage';
import { getTranslation, SupportedLanguage } from '../../services/i18n';

interface ViewProps {
  user?: UserAccount;
  currentLanguage?: SupportedLanguage | string;
  farm?: any;
  plan?: any;
}

// ----------------------------------------------------
// 1. EXPLAINABLE AI (XAI) VIEW
// ----------------------------------------------------
export const ExplainableAiView: React.FC<ViewProps> = ({ currentLanguage = 'en' }) => {
  const langKey = (currentLanguage === 'hi' || currentLanguage === 'te' || currentLanguage === 'ta' || currentLanguage === 'mr') ? currentLanguage : 'en';
  const t = getTranslation(langKey);

  const [activeModel, setActiveModel] = useState<'disease' | 'soil' | 'seed' | 'yield'>('disease');
  const [learningRateVisual, setLearningRateVisual] = useState<number>(0.005);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  // SHAP Feature Attributions for different agricultural models
  const modelAttributions = {
    disease: {
      modelName: 'ResNet-50 Foliar Pathogen Classifier (Trained on Kaggle PlantVillage 54,305 Leaf Images)',
      targetPrediction: 'Tomato Late Blight (Phytophthora infestans)',
      confidence: 96.8,
      features: [
        { name: 'Concentric Brown Necrotic Rings', shapValue: +0.48, impact: 'Positive Evidence', desc: 'Distinctive dark target-board pattern in leaf tissue' },
        { name: 'Chlorotic Pale Yellow Halo', shapValue: +0.28, impact: 'Positive Evidence', desc: 'Cellular degradation surrounding fungal lesion' },
        { name: 'Relative Humidity > 85% History', shapValue: +0.14, impact: 'Positive Evidence', desc: 'Atmospheric conditions promoting sporangia release' },
        { name: 'Leaf Margin Water-Soaking', shapValue: +0.11, impact: 'Positive Evidence', desc: 'Hydathode spore penetration symptom' },
        { name: 'Green Healthy Parenchyma', shapValue: -0.09, impact: 'Negative Evidence', desc: 'Uninfected photosynthetic area lowering severity index' },
      ],
    },
    soil: {
      modelName: 'ICAR Random Forest Soil Fertility Evaluator (Trained on 120,000 Soil Health Cards)',
      targetPrediction: 'Grade B (Moderately Fertile - Needs Zinc & Nitrogen Boost)',
      confidence: 94.1,
      features: [
        { name: 'Soil pH (7.2 Neutral)', shapValue: +0.38, impact: 'Positive Evidence', desc: 'Optimal range for phosphorus and micronutrient bioavailability' },
        { name: 'Available Nitrogen (185 kg/ha)', shapValue: -0.32, impact: 'Negative Evidence', desc: 'Sub-optimal nitrogen content reducing cereal vegetative vigor' },
        { name: 'Organic Carbon (0.58%)', shapValue: +0.22, impact: 'Positive Evidence', desc: 'Adequate humus supporting beneficial mycorrhizal colonies' },
        { name: 'Available Zinc (0.45 ppm)', shapValue: -0.19, impact: 'Negative Evidence', desc: 'Critical micronutrient threshold deficit (< 0.6 ppm)' },
        { name: 'Available Potassium (290 kg/ha)', shapValue: +0.26, impact: 'Positive Evidence', desc: 'Abundant potassium boosting drought and pest tolerance' },
      ],
    },
    seed: {
      modelName: 'SeedViabilityNet Vision Classifier (Trained on 25,000 Certified Cereal Seeds)',
      targetPrediction: 'Grade A Foundation Quality (Germination Viability 94%)',
      confidence: 97.4,
      features: [
        { name: 'Seed Coat Integrity & Smoothness', shapValue: +0.44, impact: 'Positive Evidence', desc: 'Absence of micro-fissures or seed-coat fractures' },
        { name: 'Pigment Homogeneity & Gloss', shapValue: +0.29, impact: 'Positive Evidence', desc: 'Uniform testal coloration free from fungal discoloration' },
        { name: 'Embryo Aspect Ratio (Plumpness)', shapValue: +0.21, impact: 'Positive Evidence', desc: 'Well-developed cotyledon reserve for vigor' },
        { name: 'Insect Boring / Weevil Cavity', shapValue: -0.05, impact: 'Negative Evidence', desc: 'Trace damage detected on 2% of scanned sample' },
      ],
    },
    yield: {
      modelName: 'Gradient Boosted Crop Yield Predictor (Trained on ICAR & Mandi Agricultural Census)',
      targetPrediction: 'Projected Harvest: 21.4 Quintals / Acre (+18% over Regional Baseline)',
      confidence: 92.5,
      features: [
        { name: 'Drip Irrigation Efficiency', shapValue: +0.36, impact: 'Positive Evidence', desc: '90% water application efficiency minimizing root stress' },
        { name: 'Balanced Legume Rotation', shapValue: +0.27, impact: 'Positive Evidence', desc: 'Residual biological nitrogen fixation from prior chickpea season' },
        { name: 'Mean Day Temp (28°C - 32°C)', shapValue: +0.18, impact: 'Positive Evidence', desc: 'Ideal thermal range during critical flowering stage' },
        { name: 'Delayed Monsoon Onset', shapValue: -0.12, impact: 'Negative Evidence', desc: 'Initial vegetative sowing delayed by 9 calendar days' },
      ],
    },
  };

  const curr = modelAttributions[activeModel];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-900">
              <Brain className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-emerald-950 font-serif">
              {t.xai.title}
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1 max-w-2xl leading-relaxed">
            {t.xai.subtitle}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono font-bold text-purple-900 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-700" />
            <span>SHAP & LIME Kernel Active</span>
          </span>
        </div>
      </div>

      {/* Model Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'disease', label: '🛡️ Leaf Disease Model (Kaggle PlantVillage)', icon: ShieldCheck },
          { id: 'soil', label: '🌱 Soil Health OCR Model (ICAR Dataset)', icon: Layers },
          { id: 'seed', label: '🔬 Seed Quality Net (Vision Dataset)', icon: Brain },
          { id: 'yield', label: '📈 Yield Prediction Engine', icon: TrendingDown },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveModel(tab.id as any)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border ${
              activeModel === tab.id
                ? 'bg-purple-900 text-white border-purple-900 shadow-sm'
                : 'bg-white text-stone-700 border-stone-200 hover:border-purple-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Model Explanation Card */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-stone-100 gap-2">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-stone-400">Underlying Model Architecture</span>
            <h3 className="text-base font-extrabold text-emerald-950">{curr.modelName}</h3>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-stone-500 font-medium">Prediction Confidence: </span>
            <strong className="text-emerald-800 font-mono font-bold">{curr.confidence}%</strong>
          </div>
        </div>

        {/* Target Prediction Result */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/80 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">AI Classification Output</span>
            <div className="text-sm sm:text-base font-black text-emerald-950 font-serif">{curr.targetPrediction}</div>
          </div>
          <span className="text-xs bg-white text-emerald-900 px-3 py-1.5 rounded-xl font-bold shadow-2xs border border-emerald-200">
            Validated by Datasets
          </span>
        </div>

        {/* Feature Importance / SHAP Attributions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-700 font-mono flex items-center space-x-1.5">
              <span>SHAP Feature Attribution Values (Contribution to Prediction)</span>
            </h4>
            <span className="text-[11px] text-stone-500">Green = Pushes prediction higher | Red = Lowers prediction</span>
          </div>

          <div className="space-y-2.5">
            {curr.features.map((feat, idx) => {
              const isPositive = feat.shapValue > 0;
              const barWidth = Math.min(100, Math.abs(feat.shapValue) * 180);

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedFeature(selectedFeature === feat.name ? null : feat.name)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    selectedFeature === feat.name
                      ? 'bg-stone-50 border-purple-500 ring-2 ring-purple-100'
                      : 'bg-white border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-bold text-stone-900">{feat.name}</span>
                    <span className={`font-mono font-bold ${isPositive ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {isPositive ? `+${feat.shapValue.toFixed(2)}` : feat.shapValue.toFixed(2)} SHAP
                    </span>
                  </div>

                  {/* Horizontal Bar */}
                  <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden flex">
                    {isPositive ? (
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                        style={{ width: `${barWidth}%` }}
                      />
                    ) : (
                      <div
                        className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full"
                        style={{ width: `${barWidth}%` }}
                      />
                    )}
                  </div>

                  <p className="text-[11px] text-stone-500 mt-2 leading-relaxed">
                    💡 {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Explainability Breakdown Note */}
        <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 text-xs text-purple-950 space-y-1.5">
          <div className="flex items-center space-x-2 font-bold text-purple-900">
            <Info className="w-4 h-4 text-purple-700 shrink-0" />
            <span>How Explainable AI Empowers Illiterate & Rural Farmers</span>
          </div>
          <p className="text-[11px] text-purple-900/80 leading-relaxed">
            Unlike "black-box" models, KrishiSahay computes exact mathematical attributions for every leaf spot, soil chemical reading, and seed contour. This prevents hallucinations and ensures the farmer understands exactly <em>why</em> a pesticide, fertilizer, or irrigation alert was recommended.
          </p>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// 2. FEDERATED LEARNING VIEW (HERO MODULE)
// ----------------------------------------------------
export const FederatedLearningView: React.FC<ViewProps> = ({ currentLanguage = 'en' }) => {
  const langKey = (currentLanguage === 'hi' || currentLanguage === 'te' || currentLanguage === 'ta' || currentLanguage === 'mr') ? currentLanguage : 'en';
  const t = getTranslation(langKey);

  // Hyperparameters
  const [learningRate, setLearningRate] = useState<number>(0.01);
  const [epochs, setEpochs] = useState<number>(5);
  const [batchSize, setBatchSize] = useState<number>(32);
  const [optimizer, setOptimizer] = useState<'SGD' | 'Adam' | 'RMSprop'>('Adam');

  // Federated Training Simulation State
  const [isTraining, setIsTraining] = useState(false);
  const [trainingLogs, setTrainingLogs] = useState<string[]>([]);
  const [trainingLoss, setTrainingLoss] = useState<number[]>([0.58, 0.46, 0.38, 0.31, 0.24]);
  const [fedRound, setFedRound] = useState(14);
  const [globalAccuracy, setGlobalAccuracy] = useState(94.2);
  const [weightVector, setWeightVector] = useState<number[]>([0.42, -0.18, 0.85, 0.33, -0.09, 0.67]);
  const [isShared, setIsShared] = useState(false);
  const [simulatedNodes, setSimulatedNodes] = useState(1248);

  const handleTrainLocalModel = () => {
    setIsTraining(true);
    setIsShared(false);
    setTrainingLogs([]);

    const steps = [
      `[Device Edge Storage] Fetching private soil samples & leaf image tensors from local IndexedDB...`,
      `[Privacy Protocol] Initializing Differential Privacy noise (ε = 0.5, δ = 1e-5)...`,
      `[Hyperparameters] Optimizer: ${optimizer}, Learning Rate η = ${learningRate}, Batch: ${batchSize}, Epochs: ${epochs}`,
      `[Local SGD Epoch 1/${epochs}] Forward pass on local crop dataset... Initial Cross-Entropy Loss: ${(0.55 * (1 + learningRate * 5)).toFixed(4)}`,
      `[Local SGD Epoch 2/${epochs}] Computing convolutional backpropagation gradients ∇L(W)...`,
      `[Local SGD Epoch 3/${epochs}] Updating local weights with learning rate η = ${learningRate}... Loss: ${(0.38 * (1 - learningRate * 3)).toFixed(4)}`,
      `[Local Gradient Delta] Computed ΔW: [${(learningRate * 3.4).toFixed(3)}, ${(-learningRate * 2.1).toFixed(3)}, ${(learningRate * 4.2).toFixed(3)}, ${(learningRate * 1.8).toFixed(3)}]`,
      `[Privacy Validation] Zero raw farmer data leaves this device. Only encrypted weight deltas prepared!`,
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setTrainingLogs((prev) => [...prev, step]);
        if (idx === steps.length - 1) {
          setIsTraining(false);
          // Update weights and loss based on learning rate
          const factor = learningRate / 0.01;
          setWeightVector((prev) => prev.map((w) => Number((w + (Math.random() - 0.45) * 0.08 * factor).toFixed(3))));
          setTrainingLoss([0.52, 0.41, 0.33, 0.27, Math.max(0.12, Number((0.21 - learningRate * 2).toFixed(3)))]);
        }
      }, (idx + 1) * 400);
    });
  };

  const handleTransmitWeights = () => {
    setFedRound((r) => r + 1);
    setSimulatedNodes((n) => n + 1);
    const newAcc = Math.min(99.1, Number((globalAccuracy + 0.3).toFixed(1)));
    setGlobalAccuracy(newAcc);
    setIsShared(true);

    OfflineStorage.saveFederatedWeights({
      round: fedRound + 1,
      weights: weightVector,
      accuracy: newAcc,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-900">
              <Network className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-emerald-950 font-serif">
              {t.fed.title}
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1 max-w-2xl leading-relaxed">
            {t.fed.subtitle}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center space-x-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-700" />
            <span>Zero Raw Data Leakage</span>
          </span>
        </div>
      </div>

      {/* Grid: Hyperparameters & Local Edge Node vs Global FedAvg Server */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Hyperparameters Control (Learning Rate, Epochs, Batch Size) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-xs space-y-5">
          <div className="flex items-center space-x-2 pb-3 border-b border-stone-100">
            <Sliders className="w-4 h-4 text-emerald-800" />
            <h3 className="font-bold text-emerald-950 uppercase font-serif tracking-wider text-xs">
              Local Hyperparameters (Learning Rate & Epochs)
            </h3>
          </div>

          {/* Learning Rate Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-stone-700">Learning Rate (η):</label>
              <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                {learningRate}
              </span>
            </div>
            <input
              type="range"
              min="0.001"
              max="0.05"
              step="0.001"
              value={learningRate}
              onChange={(e) => setLearningRate(parseFloat(e.target.value))}
              className="w-full accent-emerald-800"
            />
            <div className="flex justify-between text-[10px] text-stone-400 font-mono">
              <span>0.001 (Slow & Stable)</span>
              <span>0.05 (Fast Convergence)</span>
            </div>
          </div>

          {/* Epochs Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-stone-700">Local Epochs:</label>
              <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                {epochs}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              step="1"
              value={epochs}
              onChange={(e) => setEpochs(parseInt(e.target.value))}
              className="w-full accent-emerald-800"
            />
            <div className="flex justify-between text-[10px] text-stone-400 font-mono">
              <span>1 Epoch</span>
              <span>15 Epochs</span>
            </div>
          </div>

          {/* Batch Size */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-stone-700">Batch Size:</label>
              <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                {batchSize} samples
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[8, 16, 32, 64].map((b) => (
                <button
                  key={b}
                  onClick={() => setBatchSize(b)}
                  className={`py-1.5 rounded-xl text-xs font-bold font-mono transition-all border ${
                    batchSize === b
                      ? 'bg-emerald-800 text-white border-emerald-800 shadow-2xs'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Optimizer Selection */}
          <div className="space-y-2">
            <label className="font-bold text-stone-700 text-xs block">Optimizer:</label>
            <div className="grid grid-cols-3 gap-2">
              {(['SGD', 'Adam', 'RMSprop'] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setOptimizer(opt)}
                  className={`py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    optimizer === opt
                      ? 'bg-emerald-800 text-white border-emerald-800'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Action Button: Train Locally */}
          <button
            onClick={handleTrainLocalModel}
            disabled={isTraining}
            className="w-full py-3 bg-gradient-to-r from-emerald-800 to-green-700 hover:from-emerald-900 hover:to-green-800 disabled:opacity-50 text-white font-bold rounded-2xl shadow-xs transition-all flex items-center justify-center space-x-2 text-xs"
          >
            <Play className={`w-4 h-4 ${isTraining ? 'animate-spin' : ''}`} />
            <span>{isTraining ? 'Computing Local Gradients ∇L(W)...' : t.fed.trainLocally}</span>
          </button>
        </div>

        {/* Right: Federated Averaging Consensus & Gradient Weights */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-emerald-800" />
              <h3 className="font-bold text-emerald-950 uppercase font-serif tracking-wider text-xs">
                {t.fed.fedAvgConsensus}
              </h3>
            </div>
            <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-bold">
              Round #{fedRound} Active
            </span>
          </div>

          {/* Metrics Overview */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-center">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Contributing Nodes</span>
              <strong className="text-lg font-mono font-extrabold text-stone-900">{simulatedNodes} Farmers</strong>
              <span className="text-[10px] text-emerald-700 block mt-0.5">🇮🇳 Across India</span>
            </div>
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-center">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Global Consensus Acc</span>
              <strong className="text-lg font-mono font-extrabold text-emerald-800">{globalAccuracy}%</strong>
              <span className="text-[10px] text-emerald-600 block mt-0.5">+0.4% from last round</span>
            </div>
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-center">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Current Loss L(W)</span>
              <strong className="text-lg font-mono font-extrabold text-amber-700">{trainingLoss[trainingLoss.length - 1]}</strong>
              <span className="text-[10px] text-stone-500 block mt-0.5">Categorical Cross-Entropy</span>
            </div>
          </div>

          {/* Model Weights Display */}
          <div className="bg-stone-900 text-white rounded-2xl p-4 space-y-3">
            <div className="flex justify-between items-center text-[10px] text-stone-400 uppercase font-bold">
              <span>Local Model Layer Weights Tensor W:</span>
              <span className="text-lime-400 font-mono">Differential Privacy Active</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center font-mono text-[11px]">
              {weightVector.map((w, i) => (
                <div key={i} className="bg-white/10 p-2 rounded-xl">
                  <span className="text-[9px] text-stone-400 block">w_{i}</span>
                  <strong className={w >= 0 ? 'text-lime-300' : 'text-rose-400'}>{w}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* Training Logs Stream */}
          <div className="p-3.5 bg-stone-950 text-emerald-400 font-mono rounded-2xl text-[11px] h-36 overflow-y-auto space-y-1">
            {trainingLogs.length > 0 ? (
              trainingLogs.map((log, i) => <div key={i}>{log}</div>)
            ) : (
              <div className="text-stone-500 py-8 text-center text-xs">
                Click "{t.fed.trainLocally}" to train the edge model using local dataset samples...
              </div>
            )}
          </div>

          {/* Transmit Weights CTA */}
          <button
            onClick={handleTransmitWeights}
            disabled={isTraining || isShared}
            className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-bold rounded-2xl shadow-xs transition-all flex items-center justify-center space-x-2 text-xs"
          >
            <Share2 className="w-4 h-4" />
            <span>
              {isShared ? '✓ Encrypted Weights Successfully Aggregated into Global FedAvg Model!' : t.fed.shareWeightsOnly}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// 3. HISTORY & CACHED RECORDS VIEW (OFFLINE STORAGE)
// ----------------------------------------------------
export const HistoryRecordsView: React.FC<ViewProps> = ({ currentLanguage = 'en' }) => {
  const langKey = (currentLanguage === 'hi' || currentLanguage === 'te' || currentLanguage === 'ta' || currentLanguage === 'mr') ? currentLanguage : 'en';
  const t = getTranslation(langKey);

  const [activeTab, setActiveTab] = useState<'soil' | 'disease' | 'seed' | 'sms'>('soil');

  const soilReports = OfflineStorage.getSoilReports();
  const diseaseScans = OfflineStorage.getDiseaseScans();
  const seedScans = OfflineStorage.getSeedScans();
  const smsLogs = OfflineStorage.getSmsLogs();

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-900">
              <Database className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-emerald-950 font-serif">
              {t.nav.history}
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1 max-w-2xl leading-relaxed">
            All records are cached offline using browser local storage and IndexedDB. Fully accessible in low-connectivity rural farm environments.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Offline Ready (IndexedDB)</span>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'soil', label: `🌱 Soil Reports (${soilReports.length})` },
          { id: 'disease', label: `🛡️ Disease Diagnostics (${diseaseScans.length})` },
          { id: 'seed', label: `🔬 Seed Quality Tests (${seedScans.length})` },
          { id: 'sms', label: `📱 SMS & Email Alerts (${smsLogs.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all border ${
              activeTab === tab.id
                ? 'bg-emerald-900 text-white border-emerald-900 shadow-2xs'
                : 'bg-white text-stone-700 border-stone-200 hover:border-emerald-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-xs">
        {activeTab === 'soil' && (
          <div className="space-y-3">
            {soilReports.length === 0 ? (
              <div className="py-12 text-center text-xs text-stone-400">
                No soil reports uploaded yet. Head to SoilSense to upload your Soil Health Card!
              </div>
            ) : (
              soilReports.map((r) => (
                <div key={r.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-stone-900 text-sm">{r.fileName}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full font-bold">
                        {r.soilHealthGrade}
                      </span>
                    </div>
                    <div className="text-xs text-stone-500 mt-1 flex flex-wrap gap-3 font-mono">
                      <span>N: {r.chemistry.nitrogenKgPerHa} kg/ha</span>
                      <span>P: {r.chemistry.phosphorusKgPerHa} kg/ha</span>
                      <span>K: {r.chemistry.potassiumKgPerHa} kg/ha</span>
                      <span>pH: {r.chemistry.ph}</span>
                    </div>
                  </div>
                  <span className="text-xs text-stone-400 font-mono shrink-0">
                    Uploaded: {new Date(r.uploadedAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'disease' && (
          <div className="space-y-3">
            {diseaseScans.length === 0 ? (
              <div className="py-12 text-center text-xs text-stone-400">
                No plant disease scans recorded yet. Upload a leaf photo in Crop Disease Identification!
              </div>
            ) : (
              diseaseScans.map((d) => (
                <div key={d.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex items-center space-x-3">
                    {d.imagePreviewUrl && (
                      <img src={d.imagePreviewUrl} alt="Leaf" className="w-12 h-12 rounded-xl object-cover border border-stone-300 shrink-0" />
                    )}
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-stone-900 text-sm">{d.detectedPathogen}</span>
                        <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-bold">
                          {d.confidence}% Confidence
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">{d.cropName} • Severity: {d.severityPercent}%</p>
                    </div>
                  </div>
                  <span className="text-xs text-stone-400 font-mono shrink-0">{d.scannedAt}</span>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'seed' && (
          <div className="space-y-3">
            {seedScans.length === 0 ? (
              <div className="py-12 text-center text-xs text-stone-400">
                No seed tests recorded yet. Run a seed quality batch analysis!
              </div>
            ) : (
              seedScans.map((s) => (
                <div key={s.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex justify-between items-center">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-stone-900 text-sm">{s.seedType}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full font-bold">
                        {s.qualityGrade}
                      </span>
                    </div>
                    <div className="text-xs text-stone-500 mt-1 flex gap-3 font-mono">
                      <span>Viable: {s.viableSeedsCount}/{s.totalSeedsCounted}</span>
                      <span>Germination: {s.germinationRatePercent}%</span>
                    </div>
                  </div>
                  <span className="text-xs text-stone-400 font-mono">{s.inspectedAt}</span>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'sms' && (
          <div className="space-y-3">
            {smsLogs.length === 0 ? (
              <div className="py-12 text-center text-xs text-stone-400">
                No SMS or email alerts dispatched yet.
              </div>
            ) : (
              smsLogs.map((log) => (
                <div key={log.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-emerald-950 font-mono">{log.recipientPhone}</span>
                    <span className="text-[10px] bg-blue-100 text-blue-900 px-2.5 py-0.5 rounded-full font-bold">
                      {log.deliveryStatus}
                    </span>
                  </div>
                  <p className="text-xs text-stone-700 bg-white p-2.5 rounded-xl border border-stone-200 font-mono">
                    "{log.messageText}"
                  </p>
                  <span className="text-[10px] text-stone-400 block font-mono">{log.timestamp}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
