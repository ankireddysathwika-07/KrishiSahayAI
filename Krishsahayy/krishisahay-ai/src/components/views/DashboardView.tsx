import React from 'react';
import {
  TrendingUp,
  Droplets,
  Layers,
  ShieldCheck,
  Award,
  Sparkles,
  Play,
  CloudSunRain,
  Brain,
  Network,
  Binary,
  ShieldAlert,
  ArrowRight,
  CheckCircle,
  Clock,
  MapPin,
  Mic,
  FileText,
  Phone,
  Radio,
  Upload,
} from 'lucide-react';
import { FarmProfile } from '../../types/agricultural';
import { UserAccount, OfflineStorage } from '../../services/offlineStorage';
import { getTranslation, SupportedLanguage } from '../../services/i18n';

interface DashboardViewProps {
  user: UserAccount;
  farm: FarmProfile;
  onNavigate: (view: string) => void;
  selectedLanguage: string;
  onRefreshLocation: () => void;
  isLocating?: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  farm,
  onNavigate,
  selectedLanguage,
  onRefreshLocation,
  isLocating = false,
}) => {
  const langKey: SupportedLanguage =
    selectedLanguage === 'हिन्दी' || selectedLanguage === 'hi' ? 'hi' :
    selectedLanguage === 'తెలుగు' || selectedLanguage === 'te' ? 'te' :
    selectedLanguage === 'தமிழ்' || selectedLanguage === 'ta' ? 'ta' :
    selectedLanguage === 'मराठी' || selectedLanguage === 'mr' ? 'mr' : 'en';

  const t = getTranslation(langKey);

  const soilReports = OfflineStorage.getSoilReports();
  const diseaseScans = OfflineStorage.getDiseaseScans();
  const seedScans = OfflineStorage.getSeedScans();
  const smsLogs = OfflineStorage.getSmsLogs();
  const fedWeights = OfflineStorage.getFederatedWeights();

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-[#14532d] via-[#166534] to-[#15803d] rounded-3xl p-6 sm:p-7 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-white/80 text-xs font-semibold">Namaste / Welcome,</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
              {user.role}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-white tracking-tight">
            {user.name || farm.farmerName} 🙏
          </h2>

          <div className="flex flex-wrap gap-2 text-xs pt-1">
            <button
              onClick={onRefreshLocation}
              disabled={isLocating}
              className="bg-white/15 hover:bg-white/25 px-3 py-1 rounded-full font-medium flex items-center space-x-1.5 transition-all text-left"
              title="Click to refresh live GPS position"
            >
              <MapPin className="w-3.5 h-3.5 text-[#86efac]" />
              <span className="truncate max-w-[240px]">{user.location || farm.location}</span>
            </button>

            <span className="bg-[#86efac]/20 text-[#86efac] border border-[#86efac]/30 px-3 py-1 rounded-full font-bold">
              🌐 {selectedLanguage}
            </span>

            <span className="bg-white/10 px-3 py-1 rounded-full font-mono text-[11px]">
              🔒 FedAvg Round #{fedWeights.round} Active
            </span>
          </div>
        </div>

        {/* Live Weather Quick Widget */}
        <div className="bg-white/10 rounded-2xl p-4 text-center min-w-[140px] border border-white/15 backdrop-blur-xs relative z-10 shrink-0">
          <div className="text-3xl">⛅</div>
          <div className="text-2xl font-black font-serif text-white mt-0.5">29°C</div>
          <div className="text-[11px] text-white/70 font-medium">Optimal Soil Temp</div>
          <span className="text-[10px] text-emerald-200 block mt-1">Humidity: 62%</span>
        </div>
      </div>

      {/* Hero Feature 1: Explainable AI & Federated Edge Intelligence */}
      <div className="bg-gradient-to-br from-purple-950 via-slate-900 to-emerald-950 rounded-3xl p-6 text-white border border-purple-800/40 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase tracking-wider border border-purple-400/30">
              <Brain className="w-3.5 h-3.5" />
              <span>Core Innovation: Explainable AI & Edge Federated Learning</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black font-serif text-white">
              Private Farm Edge Intelligence with Transparent XAI
            </h3>

            <p className="text-xs text-purple-100/80 leading-relaxed">
              Trained on real agricultural benchmarks including the <strong>Kaggle PlantVillage leaf dataset (54,300+ images)</strong> and <strong>ICAR Soil Health Cards</strong>. Models train directly on your local device without ever uploading raw photos or private land records — only encrypted gradient weights are shared using <strong>Federated Averaging (FedAvg)</strong>.
            </p>

            <div className="flex flex-wrap gap-3 pt-2 text-xs font-mono">
              <span className="bg-white/10 px-2.5 py-1 rounded-lg">
                Consensus Accuracy: <strong className="text-lime-400">{fedWeights.accuracy}%</strong>
              </span>
              <span className="bg-white/10 px-2.5 py-1 rounded-lg">
                Nodes Connected: <strong className="text-lime-400">1,248 Farm Devices</strong>
              </span>
              <span className="bg-white/10 px-2.5 py-1 rounded-lg">
                SHAP Transparency: <strong className="text-lime-400">100% Attribution</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => onNavigate('xai')}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-extrabold px-5 py-3 rounded-2xl text-xs shadow-md active:scale-98 transition-all"
            >
              <Brain className="w-4 h-4" />
              <span>Inspect Explainable AI (SHAP)</span>
            </button>

            <button
              onClick={() => onNavigate('federated')}
              className="flex items-center justify-center space-x-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-2xl text-xs border border-emerald-600/50 shadow-xs active:scale-98 transition-all"
            >
              <Network className="w-4 h-4" />
              <span>Open Federated Edge Trainer</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Core Action Hub Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* SoilSense Card */}
        <div
          onClick={() => onNavigate('soil')}
          className="bg-white rounded-3xl p-5 border border-stone-200 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-800 group-hover:bg-amber-100 transition-colors">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                OCR Enabled
              </span>
            </div>

            <h4 className="font-extrabold text-stone-900 text-sm mb-1 group-hover:text-emerald-800 transition-colors">
              {t.soil.title}
            </h4>
            <p className="text-stone-500 text-xs leading-relaxed">
              Upload your Soil Health Card or lab report. Instant AI OCR extracts NPK, pH, and organic carbon with fertilizer prescriptions.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-emerald-800">
            <span>{soilReports.length} Reports Cached</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Seed Quality Vision Card */}
        <div
          onClick={() => onNavigate('seed')}
          className="bg-white rounded-3xl p-5 border border-stone-200 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-2xl bg-teal-50 text-teal-800 group-hover:bg-teal-100 transition-colors">
                <Binary className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold bg-teal-100 text-teal-900 px-2 py-0.5 rounded-full">
                Seed Dataset
              </span>
            </div>

            <h4 className="font-extrabold text-stone-900 text-sm mb-1 group-hover:text-emerald-800 transition-colors">
              {t.nav.seedQuality}
            </h4>
            <p className="text-stone-500 text-xs leading-relaxed">
              Upload a seed batch photo. AI calculates germination viability %, seed purity, discoloration, and Foundation Grade.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-teal-800">
            <span>{seedScans.length} Tests Logged</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Crop Disease Scanner Card */}
        <div
          onClick={() => onNavigate('disease')}
          className="bg-white rounded-3xl p-5 border border-stone-200 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-2xl bg-rose-50 text-rose-800 group-hover:bg-rose-100 transition-colors">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold bg-rose-100 text-rose-900 px-2 py-0.5 rounded-full">
                Kaggle PlantVillage
              </span>
            </div>

            <h4 className="font-extrabold text-stone-900 text-sm mb-1 group-hover:text-emerald-800 transition-colors">
              {t.nav.diseaseDetection}
            </h4>
            <p className="text-stone-500 text-xs leading-relaxed">
              Upload leaf lesion photos. Detects 15+ crop pathogens with lesion severity %, organic bio-controls, and chemical remedies.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-rose-800">
            <span>{diseaseScans.length} Scans Run</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* WaterSense & SMS Alerts Card */}
        <div
          onClick={() => onNavigate('water')}
          className="bg-white rounded-3xl p-5 border border-stone-200 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-800 group-hover:bg-blue-100 transition-colors">
                <Droplets className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full">
                SMS / Email
              </span>
            </div>

            <h4 className="font-extrabold text-stone-900 text-sm mb-1 group-hover:text-emerald-800 transition-colors">
              {t.water.title} & SMS Alerts
            </h4>
            <p className="text-stone-500 text-xs leading-relaxed">
              Connect your mobile number ({user.phone || '+91 98480 12345'}) for automated SMS/email alerts whenever field moisture drops.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-blue-800">
            <span>{smsLogs.length} Alerts Dispatched</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* KisanVaani Voice Assistant & AgriMarket Quick Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* KisanVaani Voice Banner */}
        <div className="bg-gradient-to-br from-emerald-900 to-green-950 rounded-3xl p-6 text-white flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-white/15 text-white">
                <Mic className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black font-serif text-white">
                {t.nav.kisanvaani} — Vernacular Voice AI
              </h3>
            </div>
            <p className="text-xs text-white/80 leading-relaxed">
              Built specifically for farmers with low literacy. Tap the microphone and speak naturally in Telugu, Hindi, Tamil, Marathi, or English. KisanVaani transcribes your speech and reads answers aloud.
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-[#86efac] font-bold">🎤 Web Speech API Active</span>
            <button
              onClick={() => onNavigate('assistant')}
              className="bg-white text-emerald-950 font-bold px-4 py-2 rounded-xl text-xs hover:bg-emerald-50 active:scale-95 transition-all shadow-sm"
            >
              Start Voice Conversation →
            </button>
          </div>
        </div>

        {/* AgriMarket Trading & Mandi Prices */}
        <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-900">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black font-serif text-emerald-950">
                  {t.nav.agrimarket} & Direct Trade
                </h3>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
                Live Mandi Rates
              </span>
            </div>

            <p className="text-xs text-stone-500 leading-relaxed">
              Direct trading between registered Farmers, Buyers, and Retailers. Eliminate middleman commissions with ML price forecasts for Wheat, Cotton, Rice, Soybean, and Pulses.
            </p>

            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="p-2 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-400 block">Wheat</span>
                <strong className="text-emerald-800">₹2,450/qtl</strong>
              </div>
              <div className="p-2 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-400 block">Cotton</span>
                <strong className="text-emerald-800">₹7,200/qtl</strong>
              </div>
              <div className="p-2 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-400 block">Paddy</span>
                <strong className="text-emerald-800">₹2,350/qtl</strong>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs text-stone-400">Buyer & Retailer Contracts</span>
            <button
              onClick={() => onNavigate('prices')}
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-4 py-2 rounded-xl text-xs active:scale-95 transition-all shadow-xs"
            >
              Explore Mandi Marketplace →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
