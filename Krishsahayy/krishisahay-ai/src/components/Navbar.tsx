import React from 'react';
import { Sprout, Play, ShieldAlert, BookOpen, Bot, FileText, Sparkles, Droplets, TrendingUp, Layers } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onRunDemoFarm: () => void;
  onOpenKisanVaani: () => void;
  onOpenReport: () => void;
  onOpenArchitecture: () => void;
  confidenceScore: number;
  userRole?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onRunDemoFarm,
  onOpenKisanVaani,
  onOpenReport,
  onOpenArchitecture,
  confidenceScore,
  userRole = 'Farmer',
}) => {
  const isBuyer = userRole === 'Buyer';

  const allTabs = [
    { id: 'optimizer', label: 'Crop Optimizer', icon: Sprout, hero: true, farmerOnly: false },
    { id: 'soilsense', label: 'SoilSense', icon: Layers, farmerOnly: true },
    { id: 'watersense', label: 'WaterSense', icon: Droplets, farmerOnly: true },
    { id: 'agrimarket', label: 'AgriMarket', icon: TrendingUp, farmerOnly: false },
    { id: 'disease_vision', label: 'Disease Vision', icon: ShieldAlert, farmerOnly: true },
    { id: 'resilience', label: 'Resilience Center', icon: Sparkles, farmerOnly: false },
  ];

  const tabs = allTabs.filter((t) => !isBuyer || !t.farmerOnly);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-900/10 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Identity */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('optimizer')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-green-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
              <Sprout className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight text-emerald-950 font-serif">KRISHISAHAY</span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold tracking-widest bg-emerald-700 text-white rounded-md uppercase">AI</span>
                <span className="hidden md:inline-flex items-center text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Engine v2.4
                </span>
              </div>
              <p className="text-[11px] font-medium text-emerald-800 hidden sm:block">
                Multi-Season Crop Rotation Intelligence
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-900 text-white shadow-xs'
                      : 'text-stone-600 hover:text-emerald-900 hover:bg-emerald-50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-300' : 'text-stone-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Actions & Utilities */}
          <div className="flex items-center space-x-2">
            {/* Quick Demo Farm Button */}
            <button
              onClick={onRunDemoFarm}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-emerald-700 to-green-700 hover:from-emerald-800 hover:to-green-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-md shadow-emerald-900/15 hover:shadow-lg transition-all active:scale-95"
              title="Loads realistic farm data and runs full multi-season optimization in one click"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Demo Farm</span>
            </button>

            {/* KisanVaani Assistant */}
            <button
              onClick={onOpenKisanVaani}
              className="flex items-center space-x-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/80 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
              title="Multilingual AI Voice & Chat Assistant (Telugu / Hindi / English)"
            >
              <Bot className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden sm:inline">KisanVaani</span>
            </button>

            {/* Technical Architecture */}
            <button
              onClick={onOpenArchitecture}
              className="p-2 rounded-xl text-stone-600 hover:text-emerald-900 hover:bg-emerald-50 border border-stone-200"
              title="View Technical Optimization Architecture Pipeline"
            >
              <BookOpen className="w-4 h-4" />
            </button>

            {/* Export Report */}
            <button
              onClick={onOpenReport}
              className="p-2 rounded-xl text-stone-600 hover:text-emerald-900 hover:bg-emerald-50 border border-stone-200"
              title="Download Agronomic Advisory Report"
            >
              <FileText className="w-4 h-4" />
            </button>

            {/* Confidence Badge */}
            <div className="hidden xl:flex items-center space-x-1 px-2.5 py-1 bg-stone-100 rounded-lg border border-stone-200 text-[11px] font-mono">
              <span className="text-stone-500">Quality:</span>
              <span className={`font-bold ${confidenceScore >= 80 ? 'text-emerald-700' : 'text-amber-700'}`}>
                {confidenceScore}%
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="lg:hidden flex items-center space-x-1 py-2 overflow-x-auto border-t border-stone-100 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-800 text-white font-semibold'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
