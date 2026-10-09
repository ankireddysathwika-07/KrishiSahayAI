import React from 'react';
import {
  Home,
  TrendingUp,
  ShoppingBag,
  Package,
  Layers,
  Droplets,
  Mic,
  CloudSun,
  Tractor,
  Wheat,
  Sprout,
  ShieldAlert,
  Binary,
  Brain,
  Network,
  ClipboardList,
  Sparkles,
  LogOut,
  MapPin,
  RefreshCw,
  Globe,
  Radio,
} from 'lucide-react';
import { getTranslation, SupportedLanguage } from '../services/i18n';
import { UserAccount } from '../services/offlineStorage';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  user: UserAccount;
  location: string;
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
  onOpenAuth: () => void;
  onLogout?: () => void;
  onRefreshLocation: () => void;
  isLocating?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
  user,
  location,
  selectedLanguage,
  onLanguageChange,
  onOpenAuth,
  onLogout,
  onRefreshLocation,
  isLocating = false,
}) => {
  const langKey: SupportedLanguage =
    selectedLanguage === 'हिन्दी' || selectedLanguage === 'hi' ? 'hi' :
    selectedLanguage === 'తెలుగు' || selectedLanguage === 'te' ? 'te' :
    selectedLanguage === 'தமிழ்' || selectedLanguage === 'ta' ? 'ta' :
    selectedLanguage === 'मराठी' || selectedLanguage === 'mr' ? 'mr' : 'en';

  const t = getTranslation(langKey);

  const rawNavSections = [
    {
      title: 'Overview',
      items: [
        { id: 'dashboard', label: t.nav.dashboard, icon: Home },
      ],
    },
    {
      title: '🤖 Explainable AI & Federation (Hero)',
      items: [
        { id: 'xai', label: t.nav.xai, icon: Brain, hero: true },
        { id: 'federated', label: t.nav.federated, icon: Network, highlight: true },
        { id: 'yield', label: t.nav.yieldAdvisor, icon: Wheat },
        { id: 'cropsugg', label: t.nav.cropSuggestion, icon: Sprout },
      ],
    },
    {
      title: '🌱 Vision & Soil Intelligence',
      items: [
        { id: 'soil', label: t.nav.soilsense, icon: Layers },
        { id: 'disease', label: t.nav.diseaseDetection, icon: ShieldAlert },
        { id: 'seed', label: t.nav.seedQuality, icon: Binary },
        { id: 'water', label: t.nav.watersense, icon: Droplets },
      ],
    },
    {
      title: '💰 AgriMarket & Trade',
      items: [
        { id: 'prices', label: t.nav.prices, icon: TrendingUp },
        { id: 'marketplace', label: t.nav.marketplace, icon: ShoppingBag },
        { id: 'mylistings', label: t.nav.mylistings, icon: Package },
      ],
    },
    {
      title: '🎙️ KisanVaani Voice',
      items: [
        { id: 'assistant', label: t.nav.voiceAssistant, icon: Mic },
        { id: 'weather', label: t.nav.weather, icon: CloudSun },
        { id: 'equipment', label: t.nav.equipment, icon: Tractor },
      ],
    },
    {
      title: 'Offline Data',
      items: [
        { id: 'history', label: t.nav.history, icon: ClipboardList },
      ],
    },
  ];

  // For Buyer role: remove Yield Advisor, Crop Suggestion, SoilSense, Disease Detection, Seed Quality, WaterSense
  const isBuyer = user.role === 'Buyer';
  const buyerForbiddenIds = new Set(['yield', 'cropsugg', 'soil', 'disease', 'seed', 'water']);

  const navSections = rawNavSections
    .map((sec) => ({
      ...sec,
      items: sec.items.filter((item) => !isBuyer || !buyerForbiddenIds.has(item.id)),
    }))
    .filter((sec) => sec.items.length > 0);

  const initials = (user.name || 'Farmer')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside className="w-64 bg-white border-r border-stone-200 flex flex-col h-screen fixed top-0 left-0 z-40 select-none shadow-xs">
      {/* Brand Header */}
      <div className="p-4 border-b border-stone-100 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#14532d] to-[#15803d] flex items-center justify-center text-white shadow-xs text-lg">
            🌾
          </div>
          <div>
            <span className="font-extrabold text-[#14532d] font-serif text-lg tracking-tight block leading-tight">
              Krishi<span className="text-[#16a34a]">Sahay</span>
            </span>
            <span className="text-[10px] text-stone-500 font-medium block">
              Explainable AI & Edge Agronomy
            </span>
          </div>
        </div>
      </div>

      {/* Language Quick Switcher */}
      <div className="px-3 pt-3 pb-1 border-b border-stone-100 bg-stone-50/70">
        <div className="flex items-center justify-between text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
          <span className="flex items-center space-x-1">
            <Globe className="w-3 h-3 text-emerald-700" />
            <span>Language / भाषा</span>
          </span>
        </div>
        <div className="grid grid-cols-5 gap-1">
          {[
            { code: 'en', label: 'EN' },
            { code: 'hi', label: 'हिन्दी' },
            { code: 'te', label: 'తెలుగు' },
            { code: 'ta', label: 'தமிழ்' },
            { code: 'mr', label: 'मराठी' },
          ].map((l) => (
            <button
              key={l.code}
              onClick={() => onLanguageChange(l.label)}
              className={`py-1 text-[11px] rounded-lg font-bold transition-all ${
                selectedLanguage === l.label || (selectedLanguage === 'English' && l.code === 'en')
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-emerald-300'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Live Geolocation Tracker Bar */}
      <div className="px-3 py-2 bg-emerald-50/50 border-b border-emerald-100 text-[11px] text-emerald-950 flex items-center justify-between">
        <div className="flex items-center space-x-1.5 truncate">
          <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          <span className="truncate font-medium">{location || 'Locating GPS...'}</span>
        </div>
        <button
          onClick={onRefreshLocation}
          disabled={isLocating}
          title="Refresh browser GPS location"
          className="p-1 hover:bg-emerald-100 rounded-md text-emerald-800 transition-all shrink-0"
        >
          <RefreshCw className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Scrollable Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {navSections.map((sec, i) => (
          <div key={i} className="space-y-1">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider px-3 block">
              {sec.title}
            </span>
            {sec.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all relative ${
                    isActive
                      ? 'bg-emerald-800 text-white font-bold shadow-xs'
                      : item.hero
                      ? 'bg-purple-50 text-purple-900 border border-purple-200/80 hover:bg-purple-100'
                      : item.highlight
                      ? 'bg-emerald-50/80 text-emerald-900 hover:bg-emerald-100'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive
                        ? 'text-white'
                        : item.hero
                        ? 'text-purple-700'
                        : item.highlight
                        ? 'text-emerald-700'
                        : 'text-stone-500'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>

                  {item.hero && !isActive && (
                    <span className="ml-auto text-[9px] bg-purple-200 text-purple-900 px-1.5 py-0.5 rounded font-bold uppercase">
                      XAI
                    </span>
                  )}
                  {item.highlight && !isActive && (
                    <span className="ml-auto text-[9px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded font-bold uppercase">
                      FedAvg
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* User Profile & Auth Trigger / Logout */}
      <div className="p-3 border-t border-stone-200 bg-stone-50/70 flex items-center justify-between gap-2">
        <div
          onClick={onOpenAuth}
          className="flex-1 flex items-center space-x-2.5 p-1.5 rounded-2xl hover:bg-stone-200/60 transition-colors cursor-pointer min-w-0"
          title="Click to Switch User / Open Auth Modal"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-bold text-xs text-stone-900 block truncate">
              {user.name || 'User Profile'}
            </span>
            <span className="text-[10px] text-emerald-700 block truncate font-medium">
              {user.role} • {user.phone || 'Kiosk Connected'}
            </span>
          </div>
        </div>

        {onLogout && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLogout();
            }}
            className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200/80 transition-all shrink-0 cursor-pointer"
            title="Log Out (లాగ్ అవుట్ చేయండి)"
          >
            <LogOut className="w-4 h-4 text-rose-600" />
          </button>
        )}
      </div>
    </aside>
  );
};
