import React from 'react';
import { X, Printer, Download, Sprout, CheckCircle2, ShieldCheck, Droplets, Layers, TrendingUp } from 'lucide-react';
import { FarmProfile, RotationPlan } from '../types/agricultural';

interface ReportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: RotationPlan;
  farm: FarmProfile;
}

export const ReportExportModal: React.FC<ReportExportModalProps> = ({
  isOpen,
  onClose,
  plan,
  farm,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-emerald-900/10 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 bg-emerald-950 text-white flex items-center justify-between border-b border-emerald-800 print:hidden">
          <div className="flex items-center space-x-2">
            <Sprout className="w-5 h-5 text-lime-400" />
            <h3 className="font-bold font-serif text-lg text-white">
              Official Agronomic Multi-Season Advisory Report
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 bg-lime-400 hover:bg-lime-500 text-emerald-950 font-bold px-3.5 py-1.5 rounded-xl text-xs shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button onClick={onClose} className="p-2 text-emerald-300 hover:text-white rounded-xl hover:bg-emerald-900">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Content */}
        <div className="p-8 overflow-y-auto space-y-6 text-xs text-stone-800 font-sans print:p-0 print:space-y-4">
          {/* Letterhead */}
          <div className="border-b-2 border-emerald-900 pb-4 flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black font-serif text-emerald-950">KRISHISAHAY AI</span>
                <span className="text-xs font-bold uppercase tracking-widest bg-emerald-800 text-white px-2 py-0.5 rounded">
                  Agronomic Advisory
                </span>
              </div>
              <p className="text-stone-500 text-[11px] mt-0.5">
                AI Multi-Season Crop Rotation Optimization Engine • Plan Every Season. Protect Every Acre.
              </p>
            </div>
            <div className="text-right text-[11px] text-stone-500 font-mono">
              <div>Date: {new Date().toLocaleDateString()}</div>
              <div>Report ID: KS-OPT-{Date.now().toString().slice(-6)}</div>
            </div>
          </div>

          {/* Farm Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
            <div>
              <span className="text-[10px] text-stone-400 uppercase font-bold">Farm & Location</span>
              <div className="font-bold text-stone-900 mt-0.5">{farm.farmName}</div>
              <div className="text-stone-500 text-[11px]">{farm.location}</div>
            </div>
            <div>
              <span className="text-[10px] text-stone-400 uppercase font-bold">Farmer Name</span>
              <div className="font-bold text-stone-900 mt-0.5">{farm.farmerName}</div>
              <div className="text-stone-500 text-[11px]">Holding: {farm.areaHa} Hectares</div>
            </div>
            <div>
              <span className="text-[10px] text-stone-400 uppercase font-bold">Soil Profile</span>
              <div className="font-bold text-stone-900 mt-0.5">{farm.soilType} Soil</div>
              <div className="text-stone-500 text-[11px]">pH {farm.soilPh} • {farm.organicMatterPercent}% OM</div>
            </div>
            <div>
              <span className="text-[10px] text-stone-400 uppercase font-bold">Water Allocation</span>
              <div className="font-bold text-stone-900 mt-0.5">{farm.irrigationType}</div>
              <div className="text-stone-500 text-[11px]">{farm.availableWaterM3PerHa} m³/ha seasonal quota</div>
            </div>
          </div>

          {/* Executive Metrics */}
          <div>
            <h4 className="font-bold text-emerald-950 uppercase tracking-wider text-[11px] mb-2 font-serif">
              Cumulative Multi-Season Performance Summary ({plan.strategyName})
            </h4>
            <div className="grid grid-cols-4 gap-3 bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-800">Total Net Profit</span>
                <div className="text-lg font-bold font-serif text-emerald-950 mt-0.5">
                  ₹{Math.round(plan.metrics.netProfitInr).toLocaleString()}
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-800">Soil Health Delta</span>
                <div className="text-lg font-bold font-serif text-emerald-900 mt-0.5">
                  {plan.metrics.initialSoilHealth} ➔ {plan.metrics.finalSoilHealth} (+{plan.metrics.soilHealthDelta} pts)
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-800">Total Water Consumed</span>
                <div className="text-lg font-bold font-serif text-cyan-900 mt-0.5">
                  {(plan.metrics.totalWaterUsedM3 / 1000).toFixed(1)}k m³
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-800">Biosecurity Score</span>
                <div className="text-lg font-bold font-serif text-emerald-950 mt-0.5">
                  {plan.metrics.sustainabilityScore}/100 Index
                </div>
              </div>
            </div>
          </div>

          {/* Season by Season Table */}
          <div>
            <h4 className="font-bold text-emerald-950 uppercase tracking-wider text-[11px] mb-2 font-serif">
              Season-by-Season Crop Schedule
            </h4>
            <table className="w-full text-left text-xs border border-stone-200 rounded-xl overflow-hidden">
              <thead className="bg-stone-100 text-stone-600 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Horizon</th>
                  <th className="py-2.5 px-3">Scheduled Crop</th>
                  <th className="py-2.5 px-3">Duration</th>
                  <th className="py-2.5 px-3">Yield</th>
                  <th className="py-2.5 px-3">Water</th>
                  <th className="py-2.5 px-3">Net Profit</th>
                  <th className="py-2.5 px-3">Soil N Delta</th>
                  <th className="py-2.5 px-3">Disease Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {plan.seasons.map((s, idx) => (
                  <tr key={idx} className="hover:bg-stone-50">
                    <td className="py-2.5 px-3 font-semibold text-stone-700">
                      Year {s.year} {s.seasonName.split(' ')[0]}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-emerald-950">
                      {s.crop.name} ({s.crop.category})
                    </td>
                    <td className="py-2.5 px-3 font-mono">{s.crop.durationDays}d</td>
                    <td className="py-2.5 px-3 font-mono">{s.projectedYieldTons}t</td>
                    <td className="py-2.5 px-3 font-mono">{(s.waterRequiredM3 / 1000).toFixed(1)}k m³</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-900">
                      ₹{Math.round(s.netProfitInr).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-semibold">
                      {s.soilNitrogenDeltaKg >= 0 ? `+${s.soilNitrogenDeltaKg}kg (Fix)` : `${s.soilNitrogenDeltaKg}kg`}
                    </td>
                    <td className="py-2.5 px-3 font-mono">{s.diseaseRiskScore}/100</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Agronomic Recommendations */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
            <h5 className="font-bold text-stone-900 uppercase text-[10px] tracking-wider">
              Agronomic Implementation Directives:
            </h5>
            <p className="text-stone-600 leading-relaxed text-[11px]">
              1. <strong>Rhizobium Inoculation:</strong> Ensure seed treatment with Rhizobium culture prior to sowing legume breaks to maximize atmospheric nitrogen capture.<br />
              2. <strong>Soil Moisture Monitoring:</strong> Install tensiometers or soil moisture probes at 30cm root zone to maintain irrigation scheduling.<br />
              3. <strong>Sanitary Break Validation:</strong> Strictly do not intercrop with Solanaceae vegetables during pulse cycles to ensure complete pathogen starvation.
            </p>
          </div>

          {/* Signature Block */}
          <div className="pt-6 border-t border-stone-200 flex justify-between items-end text-stone-500 text-[10px]">
            <div>
              Certified by: KrishiSahay AI Agronomic Engine<br />
              Deterministic Multi-Objective Model v2.4
            </div>
            <div className="text-right">
              Farmer Acceptance Signature: _____________________
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
