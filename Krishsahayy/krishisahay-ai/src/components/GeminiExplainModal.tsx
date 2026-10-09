import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Volume2,
  VolumeX,
  CheckCircle,
  ShieldCheck,
  Droplets,
  TrendingUp,
  Layers,
  FileText,
} from 'lucide-react';
import { RotationPlan } from '../types/agricultural';

interface GeminiExplainModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: RotationPlan;
  explanationText: string;
  source: string;
  isLoading: boolean;
}

export const GeminiExplainModal: React.FC<GeminiExplainModalProps> = ({
  isOpen,
  onClose,
  plan,
  explanationText,
  source,
  isLoading,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const clean = explanationText.replace(/[*_#]/g, '');
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-emerald-900/10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-950 via-emerald-900 to-green-950 text-white flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-lime-400 text-emerald-950 flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-bold font-serif text-white">Why This Rotation?</h3>
                <span className="text-[10px] font-bold bg-emerald-800 text-lime-300 px-2 py-0.5 rounded-full border border-emerald-700">
                  {source === 'gemini-3.8-flash' ? 'Gemini 3.8 Flash AI' : 'Deterministic Agronomic AI'}
                </span>
              </div>
              <p className="text-xs text-emerald-200">
                Ground-truth explainability grounded strictly in real numerical optimization outputs
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleSpeak}
              className={`p-2 rounded-xl border transition-all ${
                isSpeaking
                  ? 'bg-rose-500 text-white border-rose-400'
                  : 'bg-emerald-900 text-emerald-200 border-emerald-700 hover:text-white'
              }`}
              title="Read aloud with speech synthesis"
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-emerald-300 hover:text-white rounded-xl hover:bg-emerald-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-stone-700 leading-relaxed">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
            <div>
              <span className="text-[10px] text-stone-500 uppercase font-bold">Projected Net Profit</span>
              <div className="text-base font-bold text-emerald-950 font-serif mt-0.5">
                ₹{Math.round(plan.metrics.netProfitInr).toLocaleString()}
              </div>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 uppercase font-bold">Soil Health Trajectory</span>
              <div className="text-base font-bold text-emerald-900 font-serif mt-0.5">
                {plan.metrics.initialSoilHealth} ➔ {plan.metrics.finalSoilHealth} (+{plan.metrics.soilHealthDelta} pts)
              </div>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 uppercase font-bold">Water Consumed</span>
              <div className="text-base font-bold text-cyan-900 font-serif mt-0.5">
                {(plan.metrics.totalWaterUsedM3 / 1000).toFixed(1)}k m³
              </div>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 uppercase font-bold">Disease Biosecurity</span>
              <div className="text-base font-bold text-emerald-950 font-serif mt-0.5">
                {plan.metrics.averageDiseaseRisk}/100 Risk
              </div>
            </div>
          </div>

          {/* Explanation Text */}
          {isLoading ? (
            <div className="py-12 text-center text-stone-500">
              <Sparkles className="w-6 h-6 animate-spin mx-auto text-emerald-700 mb-2" />
              <span>Synthesizing multi-season agronomic rationale with Gemini 3.8 Flash...</span>
            </div>
          ) : (
            <div className="prose prose-stone prose-xs max-w-none text-stone-800 space-y-3">
              {explanationText.split('\n\n').map((paragraph, idx) => {
                if (paragraph.startsWith('###') || paragraph.startsWith('**')) {
                  return (
                    <div key={idx} className="font-bold text-emerald-950 text-sm mt-3 border-b border-stone-100 pb-1">
                      {paragraph.replace(/[#*]/g, '')}
                    </div>
                  );
                }
                return (
                  <p key={idx} className="leading-relaxed">
                    {paragraph.replace(/\*\*/g, '')}
                  </p>
                );
              })}
            </div>
          )}

          {/* Decision-Support Disclaimer */}
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
            <strong>Agronomic Decision-Support Notice:</strong> Mathematical rotation models are calibrated against regional ICAR extension guidelines. Farmers should verify localized weather forecasts and soil moisture probes prior to field tillage.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-900 text-white font-bold text-xs hover:bg-emerald-950 transition-all"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
