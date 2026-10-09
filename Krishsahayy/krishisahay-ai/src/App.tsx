import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  FarmProfile,
  OptimizationWeights,
  RotationPlan,
  StressScenario,
} from './types/agricultural';
import { DEMO_FARM_DEFAULT, DEFAULT_WEIGHTS } from './data/demoFarms';
import { runOptimizationEngine } from './services/optimizationEngine';
import { requestRotationExplanation } from './services/geminiClient';
import { SCENARIO_DEFINITIONS } from './services/scenarioEngine';
import { OfflineStorage, UserAccount } from './services/offlineStorage';
import { SupportedLanguage } from './services/i18n';

import { Sidebar } from './components/Sidebar';
import { AuthModal } from './components/AuthModal';
import { DashboardView } from './components/views/DashboardView';
import { AgriMarketHubView } from './components/views/AgriMarketHubView';
import { SoilDashboardView } from './components/views/SoilDashboardView';
import { WaterOptimizerView } from './components/views/WaterOptimizerView';
import { VoiceAssistantView } from './components/views/VoiceAssistantView';
import { WeatherView } from './components/views/WeatherView';
import { EquipmentRentalView } from './components/views/EquipmentRentalView';
import { YieldAdvisorView, CropSuggestionView } from './components/views/YieldAdvisorView';
import { DiseaseDetectionView } from './components/views/DiseaseDetectionView';
import { SeedQualityView } from './components/views/SeedQualityView';
import {
  ExplainableAiView,
  FederatedLearningView,
  HistoryRecordsView,
} from './components/views/ExplainableAiView';
import { GeminiExplainModal } from './components/GeminiExplainModal';
import { ReportExportModal } from './components/ReportExportModal';
import { ArchitectureModal } from './components/ArchitectureModal';
import { MapPin, RefreshCw, Wifi, WifiOff, Globe, Sparkles, BellRing, X } from 'lucide-react';
import {
  SoilMoistureNotificationService,
  SoilMoistureAlertEvent,
} from './services/soilMoistureNotificationService';
import { KioskLoginScreen } from './components/KioskLoginScreen';

export default function App() {
  // Navigation & User Account State
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [globalAlertToast, setGlobalAlertToast] = useState<SoilMoistureAlertEvent | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [authModalInitialTab, setAuthModalInitialTab] = useState<'signin' | 'register'>('signin');
  const [selectedLanguage, setSelectedLanguage] = useState<string>(() => OfflineStorage.getActiveLanguage());

  // Active User from Offline Storage (null if unauthenticated)
  const [activeUser, setActiveUser] = useState<UserAccount | null>(() => {
    return OfflineStorage.getActiveUser();
  });

  const [location, setLocation] = useState<string>(activeUser?.location || 'Warangal District, Telangana');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);

  // Farm and Plan Baseline (Preserved for compatibility and secondary calculations)
  const [farm, setFarm] = useState<FarmProfile>(() => ({
    ...DEMO_FARM_DEFAULT,
    farmerName: activeUser?.name || 'Kiosk Farmer',
    location: activeUser?.location || 'Warangal District, Telangana',
    areaHa: (activeUser?.landAcres || 5) * 0.404,
  }));

  const [weights, setWeights] = useState<OptimizationWeights>(DEFAULT_WEIGHTS);
  const [activeScenarioId, setActiveScenarioId] = useState<StressScenario['id']>('normal');
  const [optimizationResult, setOptimizationResult] = useState(() =>
    runOptimizationEngine(DEMO_FARM_DEFAULT, DEFAULT_WEIGHTS, 'normal')
  );
  const [activePlan, setActivePlan] = useState<RotationPlan>(optimizationResult.balancedPlan);

  // Modals
  const [isExplainModalOpen, setIsExplainModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState<boolean>(false);
  const [explanationText, setExplanationText] = useState<string>('');
  const [explanationSource, setExplanationSource] = useState<string>('gemini-3.8-flash');
  const [isExplainingLoading, setIsExplainingLoading] = useState<boolean>(false);

  // Map selected language to supported language key
  const langKey: SupportedLanguage =
    selectedLanguage === 'हिन्दी' || selectedLanguage === 'hi' ? 'hi' :
    selectedLanguage === 'తెలుగు' || selectedLanguage === 'te' ? 'te' :
    selectedLanguage === 'தமிழ்' || selectedLanguage === 'ta' ? 'ta' :
    selectedLanguage === 'मराठी' || selectedLanguage === 'mr' ? 'mr' : 'en';

  // Live GPS Location Tracking
  const handleRefreshLocation = useCallback(() => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          try {
            const resp = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`,
              { headers: { 'Accept-Language': 'en' } }
            );
            if (resp.ok) {
              const data = await resp.json();
              const district = data.address?.county || data.address?.state_district || data.address?.city || data.address?.town || 'District';
              const state = data.address?.state || 'India';
              const fullLoc = `${district}, ${state} (${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E)`;
              setLocation(fullLoc);
              setActiveUser((prev) => (prev ? { ...prev, location: fullLoc } : null));
              setFarm((prev) => ({ ...prev, location: fullLoc }));
              setIsLocating(false);
              return;
            }
          } catch {
            // fallback
          }

          const fallbackLoc = `Live GPS: ${lat.toFixed(3)}°N, ${lon.toFixed(3)}°E`;
          setLocation(fallbackLoc);
          setActiveUser((prev) => (prev ? { ...prev, location: fallbackLoc } : null));
          setFarm((prev) => ({ ...prev, location: fallbackLoc }));
          setIsLocating(false);
        },
        () => {
          setIsLocating(false);
        },
        { timeout: 7000, enableHighAccuracy: true }
      );
    } else {
      setIsLocating(false);
    }
  }, []);

  // Run live GPS location once on mount
  useEffect(() => {
    handleRefreshLocation();
  }, [handleRefreshLocation]);

  // Subscribe to real-time soil moisture alert triggers
  useEffect(() => {
    const unsub = SoilMoistureNotificationService.subscribe((event) => {
      setGlobalAlertToast(event);
    });
    return () => unsub();
  }, []);

  // Language Change handler
  const handleLanguageChange = (newLang: string) => {
    setSelectedLanguage(newLang);
    OfflineStorage.setActiveLanguage(newLang);
  };

  // Login Success Callback
  const handleLoginSuccess = (user: UserAccount, lang: string) => {
    setActiveUser(user);
    setLocation(user.location);
    setSelectedLanguage(lang);
    OfflineStorage.setActiveLanguage(lang);
    setFarm((prev) => ({
      ...prev,
      farmerName: user.name,
      location: user.location,
      areaHa: (user.landAcres || 5) * 0.404,
    }));
  };

  // Logout Handler
  const handleLogout = () => {
    OfflineStorage.setActiveUser(null);
    setActiveUser(null);
  };

  // View Guard: Redirect Buyer role if they access farmer-only agronomic features
  useEffect(() => {
    if (activeUser && activeUser.role === 'Buyer') {
      const buyerForbidden = ['yield', 'cropsugg', 'soil', 'disease', 'seed', 'water', 'soilsense', 'watersense', 'disease_vision'];
      if (buyerForbidden.includes(currentView)) {
        setCurrentView('dashboard');
      }
    }
  }, [activeUser, currentView]);

  // MANDATORY KIOSK GATEWAY: Show full-screen Login/Face Recognition page if not logged in
  if (!activeUser) {
    return (
      <KioskLoginScreen
        onLoginSuccess={handleLoginSuccess}
        selectedLanguage={selectedLanguage}
        onLanguageChange={handleLanguageChange}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F5F1] text-[#0f172a] font-sans flex antialiased">
      {/* Permanent Fixed Sidebar */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        user={activeUser}
        location={location}
        selectedLanguage={selectedLanguage}
        onLanguageChange={handleLanguageChange}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onRefreshLocation={handleRefreshLocation}
        isLocating={isLocating}
      />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-stone-200 px-6 py-2.5 flex items-center justify-between shadow-2xs">
          <div className="flex items-center space-x-2 text-xs">
            <span className="font-extrabold text-[#14532d] font-serif tracking-tight">KrishiSahay AI</span>
            <span className="text-stone-300">/</span>
            <span className="font-bold text-stone-700 capitalize">
              {currentView === 'xai'
                ? 'Explainable AI (SHAP)'
                : currentView === 'federated'
                ? 'Federated Edge Training'
                : currentView === 'soil'
                ? 'Soil Health Card OCR'
                : currentView === 'seed'
                ? 'Seed Quality Vision'
                : currentView === 'disease'
                ? 'Crop Disease Diagnostic'
                : currentView.replace('-', ' ')}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Low-Connectivity / Offline Mode Indicator */}
            <button
              onClick={() => setIsOfflineMode(!isOfflineMode)}
              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition-all flex items-center space-x-1.5 ${
                isOfflineMode
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}
              title="Click to toggle offline mode test"
            >
              {isOfflineMode ? <WifiOff className="w-3.5 h-3.5 text-amber-700" /> : <Wifi className="w-3.5 h-3.5 text-emerald-600" />}
              <span>{isOfflineMode ? 'Offline Cache (IndexedDB)' : 'Online Sync'}</span>
            </button>

            {/* Switch / Register Account CTA */}
            <button
              onClick={() => setIsAuthOpen(true)}
              className="bg-emerald-800 hover:bg-emerald-900 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              👤 {activeUser.name} ({activeUser.role})
            </button>

            {/* Explicit Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center space-x-1"
              title="Log out from Gram Panchayat Kiosk"
            >
              <span>Logout</span>
            </button>

            <button
              onClick={() => setIsReportModalOpen(true)}
              className="bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-1.5 rounded-xl text-xs font-semibold border border-stone-200"
            >
              📄 Report
            </button>
            <button
              onClick={() => setIsArchitectureOpen(true)}
              className="bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-1.5 rounded-xl text-xs font-semibold border border-stone-200"
            >
              ⚙️ Pipeline
            </button>
          </div>
        </header>

        {/* Global Floating Soil Moisture Deficit Toast Banner */}
        {globalAlertToast && (
          <div className="mx-6 mt-4 p-4 bg-gradient-to-r from-rose-600 via-rose-700 to-amber-600 text-white rounded-2xl shadow-xl flex items-center justify-between animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-xl animate-pulse">
                <BellRing className="w-5 h-5 text-white" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-sm block">
                  🚨 Soil Moisture Below Farm Optimal Threshold ({globalAlertToast.currentMoisture}% vs Target {globalAlertToast.optimalThreshold}%)
                </span>
                <span className="text-white/90">
                  Automated SMS dispatched to <strong>{globalAlertToast.farmerPhone}</strong> and email to <strong>{globalAlertToast.farmerEmail}</strong>.
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setCurrentView('water');
                  setGlobalAlertToast(null);
                }}
                className="px-3 py-1.5 bg-white text-rose-800 hover:bg-rose-50 font-bold rounded-xl text-xs transition-all shadow-xs cursor-pointer"
              >
                💧 View Irrigation & SMS Alerts →
              </button>
              <button
                onClick={() => setGlobalAlertToast(null)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white cursor-pointer"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Main Body Content */}
        <main className="flex-1 p-6 max-w-7xl w-full">
          {currentView === 'dashboard' && (
            <DashboardView
              user={activeUser}
              farm={farm}
              onNavigate={(v) => setCurrentView(v)}
              selectedLanguage={selectedLanguage}
              onRefreshLocation={handleRefreshLocation}
              isLocating={isLocating}
            />
          )}

          {currentView === 'xai' && (
            <ExplainableAiView
              user={activeUser}
              currentLanguage={langKey}
              farm={farm}
              plan={activePlan}
            />
          )}

          {currentView === 'federated' && (
            <FederatedLearningView
              user={activeUser}
              currentLanguage={langKey}
              farm={farm}
              plan={activePlan}
            />
          )}

          {currentView === 'soil' && (
            <SoilDashboardView
              user={activeUser}
              currentLanguage={langKey}
            />
          )}

          {currentView === 'seed' && (
            <SeedQualityView
              currentLanguage={langKey}
            />
          )}

          {currentView === 'disease' && (
            <DiseaseDetectionView
              currentLanguage={langKey}
            />
          )}

          {currentView === 'water' && (
            <WaterOptimizerView
              user={activeUser}
              currentLanguage={langKey}
            />
          )}

          {currentView === 'assistant' && (
            <VoiceAssistantView
              user={activeUser}
              currentLanguage={langKey}
            />
          )}

          {(currentView === 'prices' || currentView === 'marketplace' || currentView === 'mylistings') && (
            <AgriMarketHubView
              initialSubTab={currentView as any}
              farm={farm}
              onNavigateToOptimizer={() => setCurrentView('xai')}
            />
          )}

          {currentView === 'weather' && (
            <WeatherView farm={farm} />
          )}

          {currentView === 'equipment' && (
            <EquipmentRentalView
              farm={farm}
              user={activeUser}
              currentLanguage={langKey}
            />
          )}

          {currentView === 'yield' && (
            <YieldAdvisorView
              farm={farm}
              onNavigateToOptimizer={() => setCurrentView('xai')}
            />
          )}

          {currentView === 'cropsugg' && (
            <CropSuggestionView
              farm={farm}
              onNavigateToOptimizer={() => setCurrentView('xai')}
            />
          )}

          {currentView === 'history' && (
            <HistoryRecordsView
              user={activeUser}
              currentLanguage={langKey}
            />
          )}
        </main>
      </div>

      {/* Auth & Onboarding Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        currentLanguage={selectedLanguage}
        onLanguageChange={handleLanguageChange}
        initialTab={authModalInitialTab}
      />

      {/* Explainability Gemini Modal */}
      <GeminiExplainModal
        isOpen={isExplainModalOpen}
        onClose={() => setIsExplainModalOpen(false)}
        plan={activePlan}
        explanationText={explanationText}
        source={explanationSource}
        isLoading={isExplainingLoading}
      />

      {/* Official Report Export Modal */}
      <ReportExportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        plan={activePlan}
        farm={farm}
      />

      {/* Technical Pipeline Architecture Modal */}
      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />
    </div>
  );
}
