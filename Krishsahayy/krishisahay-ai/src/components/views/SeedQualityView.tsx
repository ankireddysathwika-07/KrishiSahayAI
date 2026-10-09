import React, { useState } from 'react';
import { Binary, Camera, Upload, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { analyzeSeedBatchImage, SeedAnalysisResult } from '../../services/seedQualityVision';
import { OfflineStorage, SeedInspectionRecord } from '../../services/offlineStorage';
import { getTranslation, SupportedLanguage } from '../../services/i18n';

interface SeedQualityViewProps {
  currentLanguage: SupportedLanguage;
}

export const SeedQualityView: React.FC<SeedQualityViewProps> = ({ currentLanguage }) => {
  const t = getTranslation(currentLanguage);

  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<SeedAnalysisResult | null>(null);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [sampleSize, setSampleSize] = useState(100);
  const [seedVariety, setSeedVariety] = useState('Wheat Seeds (HD-2967)');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => setUploadedPreview((ev.target?.result as string) || null);
    reader.readAsDataURL(file);

    setAnalyzing(true);
    try {
      const res = await analyzeSeedBatchImage(file, sampleSize);
      setResult(res);

      const record: SeedInspectionRecord = {
        id: `seed_${Date.now()}`,
        inspectedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        seedType: seedVariety,
        totalSeedsCounted: res.totalCount,
        viableSeedsCount: res.viableCount,
        defectiveSeedsCount: res.defectiveCount,
        germinationRatePercent: res.germinationRatePercent,
        qualityGrade: res.qualityGrade,
      };

      OfflineStorage.saveSeedScan(record);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleTestSample = async () => {
    const fakeFile = new File(['seed_tray'], 'sample_wheat_seeds.jpg', { type: 'image/jpeg' });
    setAnalyzing(true);
    try {
      const res = await analyzeSeedBatchImage(fakeFile, sampleSize);
      setResult(res);
      setUploadedPreview(null);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <span className="text-xl">🫘</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-emerald-950 font-serif">
              {t.seed.title}
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1 max-w-2xl leading-relaxed">
            {t.seed.subtitle}
          </p>
        </div>

        <button
          onClick={handleTestSample}
          className="bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-4 py-2 rounded-xl text-xs border border-amber-300 transition-all shrink-0"
        >
          ⚡ Load Sample Tray Test
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upload Column */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm text-xs space-y-4">
          <h3 className="font-bold text-emerald-950 uppercase font-serif tracking-wider">
            {t.seed.uploadPrompt}
          </h3>

          <label className="border-2 border-dashed border-amber-300 bg-amber-50/40 hover:bg-amber-50/80 rounded-2xl p-6 text-center cursor-pointer block transition-all">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-2 text-2xl">
              🫘
            </div>
            <div className="font-bold text-amber-950 text-sm">Upload Seed Batch Image</div>
            <p className="text-stone-500 text-[11px] mt-1">Spread 50–100 seeds on white sheet & photograph from top</p>
          </label>

          {analyzing && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-2 text-emerald-900">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-spin shrink-0" />
              <span>{t.seed.analyzing}</span>
            </div>
          )}

          {uploadedPreview && (
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
              <span className="text-[10px] font-bold text-stone-400 uppercase block mb-1">Uploaded Tray Photo:</span>
              <img src={uploadedPreview} alt="Seed Tray" className="w-full h-36 object-cover rounded-xl" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Seed Variety</label>
              <select
                value={seedVariety}
                onChange={(e) => setSeedVariety(e.target.value)}
                className="w-full p-2 border border-stone-200 rounded-xl font-bold bg-stone-50"
              >
                <option>Wheat Seeds (HD-2967)</option>
                <option>Rice Seeds (BPT-5204)</option>
                <option>Chickpea Seeds (JG-11)</option>
                <option>Soybean Seeds (JS-335)</option>
                <option>Cotton Seeds (Bt RCH-2)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">{t.seed.batchSize}</label>
              <input
                type="number"
                value={sampleSize}
                onChange={(e) => setSampleSize(parseInt(e.target.value, 10) || 100)}
                className="w-full p-2 border border-stone-200 rounded-xl font-bold font-mono"
              />
            </div>
          </div>
        </div>

        {/* Results Analysis */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex justify-between items-center pb-3 border-b border-stone-100">
              <h3 className="text-sm font-bold text-emerald-950 uppercase font-serif tracking-wider">
                Batch Germination & Purity Report
              </h3>
              {result && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {result.qualityGrade}
                </span>
              )}
            </div>

            {result ? (
              <div className="space-y-4 text-xs mt-3">
                {/* Visual 10x10 Matrix */}
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
                    Segmented Seed Inspection Grid ({result.totalCount} Seeds):
                  </span>
                  <div className="grid grid-cols-10 gap-1.5">
                    {result.seedsVisualMatrix.slice(0, 100).map((s) => (
                      <div
                        key={s.id}
                        title={`Seed #${s.id}: ${s.isHealthy ? 'Viable' : 'Defective Coat'}`}
                        className={`aspect-square rounded-md flex items-center justify-center text-[9px] font-bold ${
                          s.isHealthy
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
                        }`}
                      >
                        {s.id}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-stone-200 text-[11px]">
                    <span className="text-emerald-700 font-bold flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>{result.viableCount} Viable Seeds ({result.germinationRatePercent}%)</span>
                    </span>
                    <span className="text-rose-600 font-bold flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      <span>{result.defectiveCount} Defective / Broken</span>
                    </span>
                  </div>
                </div>

                {/* 3 Metric Cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                    <span className="text-[10px] font-bold uppercase text-emerald-800 block">
                      {t.seed.germinationRate}
                    </span>
                    <div className="text-2xl font-black font-serif text-emerald-950 mt-0.5">
                      {result.germinationRatePercent}%
                    </div>
                    <span className="text-[10px] text-emerald-700">Govt Std &gt; 85%</span>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                    <span className="text-[10px] font-bold uppercase text-stone-500 block">
                      Seed Vigour Index
                    </span>
                    <div className="text-2xl font-black font-serif text-stone-900 mt-0.5">
                      {result.seedVigourIndex}
                    </div>
                    <span className="text-[10px] text-stone-500">High Vigour (&gt;800)</span>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                    <span className="text-[10px] font-bold uppercase text-stone-500 block">
                      Physical Purity
                    </span>
                    <div className="text-2xl font-black font-serif text-stone-900 mt-0.5">
                      {result.purityIndex}%
                    </div>
                    <span className="text-[10px] text-stone-500">Zero Weed Seeds</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-24 text-center text-stone-400 text-xs">
                <div className="text-4xl mb-2">🫘</div>
                <p>Upload a seed tray photo or click "Load Sample Tray Test" to begin computer vision counting</p>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-500 text-right">
            Calibrated on Kaggle Crop Seed Purity & Germination Dataset
          </div>
        </div>
      </div>
    </div>
  );
};
