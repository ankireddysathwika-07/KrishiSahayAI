import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Camera,
  Upload,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Bug,
  RefreshCw,
} from 'lucide-react';
import { RotationPlan } from '../types/agricultural';

interface DiseaseVisionModuleProps {
  plan: RotationPlan;
  onApplyPathogenBreakToRotation: (family: string) => void;
}

interface SampleLeafDisease {
  id: string;
  name: string;
  hostCrop: string;
  family: string;
  pathogen: string;
  symptoms: string;
  survivalMechanism: string;
  prescribedRotationBreak: string;
  imageThumbnail: string; // SVG or styled thumbnail
}

const SAMPLE_DISEASE_CASES: SampleLeafDisease[] = [
  {
    id: 'early_blight',
    name: 'Early Blight (Alternaria solani)',
    hostCrop: 'Tomato & Potato',
    family: 'Solanaceae',
    pathogen: 'Fungal (Alternaria solani)',
    symptoms: 'Concentric dark target-board rings on lower foliage; rapid defoliation.',
    survivalMechanism: 'Overwinters in soil and un-decomposed Solanaceae crop debris for 18–24 months.',
    prescribedRotationBreak: 'Enforce a minimum 2-season non-Solanaceae break with Poaceae (Maize) and Fabaceae (Chickpea) to starve spore inoculum.',
    imageThumbnail: '🍅',
  },
  {
    id: 'leaf_curl',
    name: 'Cotton Leaf Curl Virus (CLCuV)',
    hostCrop: 'Cotton',
    family: 'Malvaceae',
    pathogen: 'Begomovirus transmitted by Whitefly (Bemisia tabaci)',
    symptoms: 'Upward curling of leaves, vein thickening, stunted boll development.',
    survivalMechanism: 'Virus reservoirs survive in malvaceous weeds and continuous cotton ratoons.',
    prescribedRotationBreak: 'Rotate with non-host winter cereals (Wheat) and summer Millets to eliminate host bridge.',
    imageThumbnail: '🌱',
  },
  {
    id: 'rice_blast',
    name: 'Rice Blast (Magnaporthe oryzae)',
    hostCrop: 'Rice (Paddy)',
    family: 'Poaceae',
    pathogen: 'Fungal (Magnaporthe oryzae)',
    symptoms: 'Spindle-shaped lesions with gray centers and brownish borders on leaf blades and panicle neck.',
    survivalMechanism: 'Spres persist in straw residues and wetland puddle micro-environments.',
    prescribedRotationBreak: 'Drain fields and rotate with aerobic legumes (Black gram / Soybean) to break anaerobic fungal cycle.',
    imageThumbnail: '🌾',
  },
  {
    id: 'healthy_leaf',
    name: 'Healthy Crop Foliage (Negative Control)',
    hostCrop: 'Chickpea / Legume',
    family: 'Fabaceae',
    pathogen: 'None detected (Symbiotic Rhizobia active)',
    symptoms: 'Vibrant green canopy, vigorous nodulation, absence of chlorotic spots.',
    survivalMechanism: 'Optimal bio-sanitation through rotational diversity.',
    prescribedRotationBreak: 'Maintain active balanced rotation sequence to preserve biological pathogen suppression.',
    imageThumbnail: '✨',
  },
];

export const DiseaseVisionModule: React.FC<DiseaseVisionModuleProps> = ({
  plan,
  onApplyPathogenBreakToRotation,
}) => {
  const [selectedCase, setSelectedCase] = useState<SampleLeafDisease>(SAMPLE_DISEASE_CASES[0]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<SampleLeafDisease | null>(SAMPLE_DISEASE_CASES[0]);

  const handleRunScan = (c: SampleLeafDisease) => {
    setSelectedCase(c);
    setIsScanning(true);
    setTimeout(() => {
      setScanResult(c);
      setIsScanning(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-rose-100 text-rose-800">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-emerald-950 font-serif">
              Disease Vision Intelligence & Rotational Pathogen Breaks
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Detects foliar pathogens and dynamically feeds biosecurity constraints into the Crop Rotation Engine to break pest cycles.
          </p>
        </div>

        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center space-x-1.5">
          <Bug className="w-4 h-4 text-emerald-700" />
          <span>Biosecurity Rule Engine Connected</span>
        </span>
      </div>

      {/* Interactive Scan Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sample Selection Column */}
        <div className="bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
            Select Sample Field Specimen
          </h3>

          {SAMPLE_DISEASE_CASES.map((item) => {
            const isChosen = selectedCase.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => handleRunScan(item)}
                className={`cursor-pointer p-3.5 rounded-2xl border transition-all flex items-center space-x-3 ${
                  isChosen
                    ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                <div className="text-2xl p-2 rounded-xl bg-stone-100 shrink-0">
                  {item.imageThumbnail}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-emerald-950 truncate">{item.name}</div>
                  <div className="text-[11px] text-stone-500 truncate">Host: {item.hostCrop}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Diagnostic Results & Action Column */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>AI Vision Diagnostic & Spore Inoculum Analysis</span>
              </span>
              <span className="text-[11px] font-mono text-stone-400">
                Confidence: {selectedCase.id === 'healthy_leaf' ? '98.5%' : '94.2%'}
              </span>
            </div>

            {isScanning ? (
              <div className="py-16 text-center text-xs text-stone-500">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-700 mb-2" />
                <span>Analyzing foliar lesion morphology & fungal spore vectors...</span>
              </div>
            ) : scanResult ? (
              <div className="mt-4 space-y-4 text-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-black text-emerald-950 font-serif">
                      {scanResult.name}
                    </h4>
                    <p className="text-stone-500 mt-0.5">
                      Target Family: <strong className="text-emerald-900">{scanResult.family}</strong> • Pathogen: {scanResult.pathogen}
                    </p>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      scanResult.id === 'healthy_leaf'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {scanResult.id === 'healthy_leaf' ? 'Sanitary Low Risk' : 'Active Inoculum Detected'}
                  </span>
                </div>

                <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                  <span className="font-bold text-stone-700 block mb-1 text-[11px] uppercase tracking-wider">
                    Foliar Symptom Signature:
                  </span>
                  <p className="text-stone-600 leading-relaxed">{scanResult.symptoms}</p>
                </div>

                <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 text-amber-950">
                  <span className="font-bold block mb-1 text-[11px] uppercase tracking-wider text-amber-900">
                    Soil-Borne Survival Mechanism:
                  </span>
                  <p className="leading-relaxed">{scanResult.survivalMechanism}</p>
                </div>

                <div className="bg-emerald-950 p-4 rounded-2xl text-white">
                  <span className="font-bold text-lime-400 block mb-1 text-[11px] uppercase tracking-wider flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-lime-400" />
                    <span>Optimizer Biosecurity Prescription:</span>
                  </span>
                  <p className="text-emerald-100 leading-relaxed">
                    {scanResult.prescribedRotationBreak}
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
            <span className="text-stone-500 text-[11px]">
              Active Rotation Average Pathogen Score: <strong className="text-emerald-950">{plan.metrics.averageDiseaseRisk}/100</strong>
            </span>
            <button
              onClick={() => onApplyPathogenBreakToRotation(selectedCase.family)}
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-4 py-2 rounded-xl active:scale-95 transition-all shadow-xs"
            >
              Enforce Biosecurity Break in Optimizer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
