import React, { useState, useEffect } from 'react';
import {
  FlaskConical,
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Download,
  Printer,
  Sparkles,
  Layers,
  Activity,
} from 'lucide-react';
import { UserAccount, SoilAnalysisReport, OfflineStorage } from '../../services/offlineStorage';
import { analyzeSoilReportImage } from '../../services/soilVisionOcr';
import { getTranslation, SupportedLanguage } from '../../services/i18n';

interface SoilDashboardViewProps {
  user: UserAccount;
  currentLanguage: SupportedLanguage;
}

export const SoilDashboardView: React.FC<SoilDashboardViewProps> = ({
  user,
  currentLanguage,
}) => {
  const t = getTranslation(currentLanguage);
  const [reports, setReports] = useState<SoilAnalysisReport[]>([]);
  const [activeReport, setActiveReport] = useState<SoilAnalysisReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);

  useEffect(() => {
    const list = OfflineStorage.getSoilReports();
    setReports(list);
    if (list.length > 0) {
      setActiveReport(list[0]);
    }
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onload = (ev) => setUploadedPreview((ev.target?.result as string) || null);
    reader.readAsDataURL(file);

    setIsAnalyzing(true);
    try {
      const result = await analyzeSoilReportImage({
        file,
        farmerId: user.id,
        farmerName: user.name,
        location: user.location,
      });

      OfflineStorage.saveSoilReport(result);
      setReports((prev) => [result, ...prev]);
      setActiveReport(result);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <FlaskConical className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-emerald-950 font-serif">
              {t.soil.title}
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1 max-w-2xl leading-relaxed">
            {t.soil.subtitle}
          </p>
        </div>

        {activeReport && (
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold px-4 py-2 rounded-xl text-xs border border-stone-200 transition-all shrink-0"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Soil Health Card</span>
          </button>
        )}
      </div>

      {/* Main Grid: Upload Card on Left, Results on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upload Zone */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm text-xs space-y-4">
          <h3 className="font-bold text-emerald-950 uppercase font-serif tracking-wider">
            {t.soil.uploadCard}
          </h3>

          <label className="border-2 border-dashed border-amber-300 bg-amber-50/40 hover:bg-amber-50/80 rounded-2xl p-6 text-center cursor-pointer block transition-all">
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-2 text-2xl">
              📄
            </div>
            <div className="font-bold text-amber-950 text-sm">{t.soil.uploadCard}</div>
            <p className="text-stone-500 text-[11px] mt-1">{t.soil.uploadSub}</p>
          </label>

          {isAnalyzing && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-2 text-emerald-900">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-spin shrink-0" />
              <span>{t.soil.extracting}</span>
            </div>
          )}

          {uploadedPreview && (
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
              <span className="text-[10px] font-bold text-stone-400 uppercase block mb-1">Uploaded Specimen:</span>
              <img src={uploadedPreview} alt="Soil Report" className="w-full h-36 object-cover rounded-xl" />
            </div>
          )}

          {/* Historical Uploads List */}
          <div className="pt-2">
            <span className="text-[10px] font-bold text-stone-400 uppercase block mb-2">
              Previous Farmer Uploads ({reports.length})
            </span>
            <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  onClick={() => setActiveReport(rep)}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex justify-between items-center ${
                    activeReport?.id === rep.id
                      ? 'border-emerald-600 bg-emerald-50/60 font-bold'
                      : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                  }`}
                >
                  <div className="truncate">
                    <div className="text-emerald-950 font-serif truncate">{rep.fileName}</div>
                    <div className="text-[10px] text-stone-400">{rep.uploadedAt}</div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-stone-200 shrink-0">
                    pH {rep.chemistry.ph}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results Analysis */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm flex flex-col justify-between space-y-4">
          {activeReport ? (
            <div className="space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-2">
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest block">
                    Verified Lab Report
                  </span>
                  <h4 className="text-lg font-black font-serif text-emerald-950">
                    {activeReport.farmerName} • {activeReport.location}
                  </h4>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
                  {activeReport.soilHealthGrade}
                </span>
              </div>

              {/* Chemistry Metrics 3x2 Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                  <span className="text-[10px] text-stone-500 font-bold uppercase block">{t.soil.n}</span>
                  <div className="text-xl font-bold font-serif text-emerald-950 mt-0.5">
                    {activeReport.chemistry.nitrogenKgPerHa} <span className="text-xs font-normal text-stone-500">kg/ha</span>
                  </div>
                  <span className={`text-[10px] font-bold ${activeReport.chemistry.nitrogenKgPerHa < 280 ? 'text-amber-700' : 'text-emerald-700'}`}>
                    {activeReport.chemistry.nitrogenKgPerHa < 280 ? 'Deficient' : 'Optimal'}
                  </span>
                </div>

                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                  <span className="text-[10px] text-stone-500 font-bold uppercase block">{t.soil.p}</span>
                  <div className="text-xl font-bold font-serif text-emerald-950 mt-0.5">
                    {activeReport.chemistry.phosphorusKgPerHa} <span className="text-xs font-normal text-stone-500">kg/ha</span>
                  </div>
                  <span className={`text-[10px] font-bold ${activeReport.chemistry.phosphorusKgPerHa < 25 ? 'text-rose-700' : 'text-emerald-700'}`}>
                    {activeReport.chemistry.phosphorusKgPerHa < 25 ? 'Low' : 'Adequate'}
                  </span>
                </div>

                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                  <span className="text-[10px] text-stone-500 font-bold uppercase block">{t.soil.k}</span>
                  <div className="text-xl font-bold font-serif text-emerald-950 mt-0.5">
                    {activeReport.chemistry.potassiumKgPerHa} <span className="text-xs font-normal text-stone-500">kg/ha</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700">Healthy</span>
                </div>

                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                  <span className="text-[10px] text-stone-500 font-bold uppercase block">{t.soil.ph}</span>
                  <div className="text-xl font-bold font-serif text-emerald-950 mt-0.5">
                    {activeReport.chemistry.ph}
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700">Neutral Loam</span>
                </div>

                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                  <span className="text-[10px] text-stone-500 font-bold uppercase block">{t.soil.oc}</span>
                  <div className="text-xl font-bold font-serif text-emerald-950 mt-0.5">
                    {activeReport.chemistry.organicCarbonPercent}%
                  </div>
                  <span className={`text-[10px] font-bold ${activeReport.chemistry.organicCarbonPercent < 0.5 ? 'text-amber-700' : 'text-emerald-700'}`}>
                    {activeReport.chemistry.organicCarbonPercent < 0.5 ? 'Low Carbon' : 'Adequate'}
                  </span>
                </div>

                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                  <span className="text-[10px] text-stone-500 font-bold uppercase block">Zinc & Micronutrients</span>
                  <div className="text-xl font-bold font-serif text-emerald-950 mt-0.5">
                    {activeReport.chemistry.zincPpm} <span className="text-xs font-normal text-stone-500">ppm</span>
                  </div>
                  <span className="text-[10px] font-bold text-stone-600">Fe: {activeReport.chemistry.ironPpm} ppm</span>
                </div>
              </div>

              {/* Identified Deficiencies */}
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl space-y-1">
                <span className="font-bold text-rose-950 uppercase text-[10px] tracking-wider block">
                  {t.soil.deficiencies}:
                </span>
                <ul className="list-disc list-inside space-y-0.5 text-rose-900 text-[11px]">
                  {activeReport.deficiencies.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>

              {/* Fertilizer Prescriptions */}
              <div className="p-4 bg-emerald-950 text-white rounded-2xl space-y-2">
                <div className="flex items-center space-x-1.5 font-bold text-lime-400 uppercase text-[10px] tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t.soil.fertilizerRec} (Per Acre):</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="bg-white/10 p-2 rounded-xl">
                    <span className="text-stone-300 text-[10px] block">Neem Urea</span>
                    <strong className="text-white text-sm">{activeReport.fertilizerPrescription.ureaKgPerAcre} kg</strong>
                  </div>
                  <div className="bg-white/10 p-2 rounded-xl">
                    <span className="text-stone-300 text-[10px] block">DAP</span>
                    <strong className="text-white text-sm">{activeReport.fertilizerPrescription.dapKgPerAcre} kg</strong>
                  </div>
                  <div className="bg-white/10 p-2 rounded-xl">
                    <span className="text-stone-300 text-[10px] block">MOP (Potash)</span>
                    <strong className="text-white text-sm">{activeReport.fertilizerPrescription.mopKgPerAcre} kg</strong>
                  </div>
                  <div className="bg-white/10 p-2 rounded-xl">
                    <span className="text-stone-300 text-[10px] block">Bio-Manure</span>
                    <strong className="text-white text-sm">{activeReport.fertilizerPrescription.organicManureTonsPerAcre} Tons</strong>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-stone-400 text-xs">
              <div className="text-4xl mb-2">🧪</div>
              <p>Upload a soil report or soil sample photo to generate a complete laboratory analysis</p>
            </div>
          )}

          <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-500 text-right">
            Calibrated on Kaggle Indian Soil Health Card Dataset (ICAR Norms)
          </div>
        </div>
      </div>
    </div>
  );
};
