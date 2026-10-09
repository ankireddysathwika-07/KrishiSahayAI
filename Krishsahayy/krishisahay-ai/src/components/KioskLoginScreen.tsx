import React, { useState } from 'react';
import {
  ShieldCheck,
  Camera,
  Scan,
  UserPlus,
  LogIn,
  Globe,
  Phone,
  Lock,
} from 'lucide-react';
import { UserAccount, OfflineStorage } from '../services/offlineStorage';
import { FaceRecognitionModal } from './FaceRecognitionModal';

interface KioskLoginScreenProps {
  onLoginSuccess: (user: UserAccount, lang: string) => void;
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
}

const KIOSK_I18N: Record<string, {
  kioskTag: string;
  subtitle: string;
  badge: string;
  heroTitlePrefix: string;
  heroTitleHighlight: string;
  heroTitleSuffix: string;
  heroDesc: string;
  feature1Title: string;
  feature1Desc: string;
  feature2Title: string;
  feature2Desc: string;
  tabFace: string;
  tabCredentials: string;
  tabRegister: string;
  faceTitle: string;
  faceDesc: string;
  faceBtn: string;
  demoProfilesTitle: string;
  phoneLabel: string;
  phonePlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  signInBtn: string;
  selectRoleLabel: string;
  roleFarmer: string;
  roleBuyer: string;
  fullNameLabel: string;
  fullNamePlaceholder: string;
  phoneRegLabel: string;
  acresLabel: string;
  acresPlaceholder: string;
  faceRegTitle: string;
  faceRegBtn: string;
  faceRegRescan: string;
  faceRegSuccess: string;
  registerBtn: string;
  errIdentifier: string;
  errNotFound: string;
  errName: string;
  errPhone: string;
  footerText: string;
  footerBadge: string;
}> = {
  en: {
    kioskTag: 'Gram Panchayat Kiosk',
    subtitle: 'Central Farmer Intelligence Portal',
    badge: 'Secure Biometric Kiosk Gateway',
    heroTitlePrefix: 'Effortless ',
    heroTitleHighlight: 'Face Login',
    heroTitleSuffix: ' for Farmers',
    heroDesc: 'Access your agricultural dashboard instantly at the Gram Panchayat server using facial recognition — no smartphone or password required.',
    feature1Title: 'Instant Facial Recognition',
    feature1Desc: 'AI 64-D Biometric Signature Matching',
    feature2Title: 'Role-Based Farmer & Buyer Portal',
    feature2Desc: 'Personalized Crop Advisory & Mandi Trade',
    tabFace: 'Face Login',
    tabCredentials: 'Phone / Password',
    tabRegister: 'New Register',
    faceTitle: 'Gram Panchayat Facial Login',
    faceDesc: 'Step in front of the camera and verify your identity in seconds.',
    faceBtn: 'Start Face Recognition Scan',
    demoProfilesTitle: '⚡ 1-Click Kiosk Demo Profiles:',
    phoneLabel: 'Phone Number or Name',
    phonePlaceholder: 'e.g. +91 98480 12345 or Ramesh Reddy',
    passwordLabel: 'Password (Optional)',
    passwordPlaceholder: 'Enter password',
    signInBtn: 'Sign In to Account →',
    selectRoleLabel: 'Select Role',
    roleFarmer: '🌾 Farmer',
    roleBuyer: '🛒 Buyer',
    fullNameLabel: 'Full Name *',
    fullNamePlaceholder: 'e.g. Ramesh Reddy',
    phoneRegLabel: 'Phone Number *',
    acresLabel: 'Farm Land (Acres)',
    acresPlaceholder: 'e.g. 5',
    faceRegTitle: '📷 Face Snapshot Registration',
    faceRegBtn: 'Capture & Save Face Photo',
    faceRegRescan: 'Re-scan Face Photo',
    faceRegSuccess: '✓ Registered',
    registerBtn: 'Complete Registration & Enter Portal →',
    errIdentifier: 'Please enter your phone number, email, or name',
    errNotFound: 'No registered profile found. Please register your account below.',
    errName: 'Please enter full farmer name',
    errPhone: 'Please provide phone number for alerts',
    footerText: 'Gram Panchayat Central Kiosk Portal • KrishiSahay AI Engine v2.4',
    footerBadge: 'Biometric Security Enabled',
  },
  te: {
    kioskTag: 'గ్రామ పంచాయతీ కియోస్క్',
    subtitle: 'కేంద్ర రైతు సేవా పోర్టల్',
    badge: 'రైతు బయోమెట్రిక్ ప్రవేశ ద్వారం',
    heroTitlePrefix: 'రైతుల కోసం సులభమైన ',
    heroTitleHighlight: 'ఫేస్ లాగిన్',
    heroTitleSuffix: '',
    heroDesc: 'స్మార్ట్‌ఫోన్ లేదా పాస్‌వర్డ్ అవసరం లేకుండా గ్రామ పంచాయతీ సెంట్రల్ సర్వర్ వద్ద మీ ముఖం చూపించి క్షణాల్లో ప్రవేశించండి.',
    feature1Title: 'తక్షణ ఫేస్ గుర్తింపు',
    feature1Desc: 'AI 64-D బయోమెట్రిక్ స్కాన్ మ్యాచింగ్',
    feature2Title: 'రైతు మరియు బయ్యర్ పోర్టల్',
    feature2Desc: 'వ్యక్తిగత పంట సలహాలు మరియు మార్కెట్ వర్తకం',
    tabFace: 'ఫేస్ లాగిన్',
    tabCredentials: 'ఫోన్ / పాస్‌వర్డ్',
    tabRegister: 'కొత్త నమోదు',
    faceTitle: 'గ్రామ పంచాయతీ ఫేస్ లాగిన్',
    faceDesc: 'కెమెరా ముందుకు వచ్చి మీ ముఖం చూపించండి. క్షణాల్లో సైన్-ఇన్ అవ్వండి.',
    faceBtn: 'ఫేస్ స్కాన్ ప్రారంభించు',
    demoProfilesTitle: '⚡ తక్షణ ప్రవేశ ప్రోఫైల్స్:',
    phoneLabel: 'మొబైల్ నంబర్ లేదా పేరు',
    phonePlaceholder: 'ఉదా. +91 98480 12345 లేదా రమేష్ రెడ్డి',
    passwordLabel: 'పాస్‌వర్డ్ (ఐచ్ఛికం)',
    passwordPlaceholder: 'పాస్‌వర్డ్ నమోదు చేయండి',
    signInBtn: 'ఖాతాలోకి ప్రవేశించు →',
    selectRoleLabel: 'హోదా ఎంచుకోండి',
    roleFarmer: '🌾 రైతు',
    roleBuyer: '🛒 బయ్యర్ / వ్యాపారి',
    fullNameLabel: 'పూర్తి పేరు *',
    fullNamePlaceholder: 'ఉదా. రమేష్ రెడ్డి',
    phoneRegLabel: 'ఫోన్ నంబర్ *',
    acresLabel: 'పొలం (ఎకరాలు)',
    acresPlaceholder: 'ఉదా. 5',
    faceRegTitle: '📷 ఫేస్ ఫోటో నమోదు',
    faceRegBtn: 'ఫేస్ ఫోటో స్కాన్ చేసి దాచు',
    faceRegRescan: 'మళ్ళీ ఫేస్ స్కాన్ చేయి',
    faceRegSuccess: '✓ నమోదయింది',
    registerBtn: 'నమోదు పూర్తి చేసి ప్రవేశించు →',
    errIdentifier: 'దయచేసి మీ ఫోన్ నంబర్ లేదా పేరు నమోదు చేయండి',
    errNotFound: 'ఈ నంబర్‌తో ఖాతా లభించలేదు. దయచేసి కొత్తగా నమోదు చేసుకోండి.',
    errName: 'దయచేసి పూర్తి పేరు నమోదు చేయండి',
    errPhone: 'దయచేసి అలర్ట్స్ కోసం ఫోన్ నంబర్ ఇవ్వండి',
    footerText: 'గ్రామ పంచాయతీ సెంట్రల్ కియోస్క్ పోర్టల్ • కృషిసహాయ్ AI వర్షన్ 2.4',
    footerBadge: 'బయోమెట్రిక్ రక్షణ ప్రారంభంలో ఉంది',
  },
  hi: {
    kioskTag: 'ग्राम पंचायत कियोस्क',
    subtitle: 'केंद्रीय किसान पोर्टल',
    badge: 'सुरक्षित बायोमेट्रिक प्रवेश द्वार',
    heroTitlePrefix: 'किसानों के लिए आसान ',
    heroTitleHighlight: 'फेस लॉगिन',
    heroTitleSuffix: '',
    heroDesc: 'स्मार्टफोन या पासवर्ड के बिना ग्राम पंचायत सर्वर पर चेहरा दिखाकर तुरंत प्रवेश करें।',
    feature1Title: 'त्वरित फेस पहचान',
    feature1Desc: 'AI 64-D बायोमेट्रिक मैचिंग',
    feature2Title: 'किसान एवं खरीदार पोर्टल',
    feature2Desc: 'व्यक्तिगत फसल सलाह एवं मंडी व्यापार',
    tabFace: 'फेस लॉगिन',
    tabCredentials: 'मोबाइल / पासवर्ड',
    tabRegister: 'नया पंजीकरण',
    faceTitle: 'ग्राम पंचायत फेस लॉगिन',
    faceDesc: 'कैमरे के सामने आएं और सेकंडों में सत्यापन करें।',
    faceBtn: 'फेस स्कैन शुरू करें',
    demoProfilesTitle: '⚡ 1-क्लिक कियोस्क डेमो प्रोफाइल:',
    phoneLabel: 'मोबाइल नंबर या नाम',
    phonePlaceholder: 'उदा. +91 98480 12345 या रमेश रेड्डी',
    passwordLabel: 'पासवर्ड (वैकल्पिक)',
    passwordPlaceholder: 'पासवर्ड दर्ज करें',
    signInBtn: 'खाते में प्रवेश करें →',
    selectRoleLabel: 'भूमिका चुनें',
    roleFarmer: '🌾 किसान',
    roleBuyer: '🛒 खरीदार / व्यापारी',
    fullNameLabel: 'पूरा नाम *',
    fullNamePlaceholder: 'उदा. रमेश रेड्डी',
    phoneRegLabel: 'मोबाइल नंबर *',
    acresLabel: 'खेत (एकड़)',
    acresPlaceholder: 'उदा. 5',
    faceRegTitle: '📷 फेस फोटो पंजीकरण',
    faceRegBtn: 'फेस फोटो स्कैन एवं सुरक्षित करें',
    faceRegRescan: 'पुनः फेस स्कैन करें',
    faceRegSuccess: '✓ पंजीकृत',
    registerBtn: 'पंजीकरण पूरा कर प्रवेश करें →',
    errIdentifier: 'कृपया अपना मोबाइल नंबर या नाम दर्ज करें',
    errNotFound: 'कोई खाता नहीं मिला। कृपया नया पंजीकरण करें।',
    errName: 'कृपया पूरा नाम दर्ज करें',
    errPhone: 'कृपया अलर्ट के लिए मोबाइल नंबर प्रदान करें',
    footerText: 'ग्राम पंचायत केंद्रीय कियोस्क पोर्टल • कृषि सहाय AI v2.4',
    footerBadge: 'बायोमेट्रिक सुरक्षा सक्रिय',
  },
};

export const KioskLoginScreen: React.FC<KioskLoginScreenProps> = ({
  onLoginSuccess,
  selectedLanguage,
  onLanguageChange,
}) => {
  const [activeTab, setActiveTab] = useState<'face' | 'credentials' | 'register'>('face');
  const [isFaceModalOpen, setIsFaceModalOpen] = useState<boolean>(false);
  const [faceModalMode, setFaceModalMode] = useState<'login' | 'register'>('login');

  // Credentials Login State
  const [signInIdentifier, setSignInIdentifier] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Registration Form State
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regLocation, setRegLocation] = useState('Warangal District, Telangana');
  const [regRole, setRegRole] = useState<'Farmer' | 'Buyer'>('Farmer');
  const [regAcres, setRegAcres] = useState('5');
  const [regFacePhoto, setRegFacePhoto] = useState<string | null>(null);
  const [regFaceEmbedding, setRegFaceEmbedding] = useState<number[] | null>(null);

  // Map language selection
  const langKey =
    selectedLanguage === 'తెలుగు' || selectedLanguage === 'te' ? 'te' :
    selectedLanguage === 'हिन्दी' || selectedLanguage === 'hi' ? 'hi' : 'en';

  const t = KIOSK_I18N[langKey] || KIOSK_I18N.en;

  const handleCredentialsSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!signInIdentifier.trim()) {
      setAuthError(t.errIdentifier);
      return;
    }

    const user = OfflineStorage.findUserByCredentials(signInIdentifier);
    if (user) {
      OfflineStorage.setActiveUser(user);
      onLoginSuccess(user, selectedLanguage);
    } else {
      setAuthError(t.errNotFound);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!regName.trim()) {
      setAuthError(t.errName);
      return;
    }
    if (!regPhone.trim() && !regEmail.trim()) {
      setAuthError(t.errPhone);
      return;
    }

    const newUser = OfflineStorage.registerUser({
      name: regName.trim(),
      phone: regPhone.trim() || '+91 98480 00000',
      email: regEmail.trim() || 'farmer@krishisahay.in',
      location: regLocation.trim() || 'Telangana Agri Zone',
      role: regRole,
      landAcres: parseFloat(regAcres) || 4.0,
      optimalMoistureThreshold: 45,
      password: '123',
      facePhotoUrl: regFacePhoto || undefined,
      faceEmbedding: regFaceEmbedding || undefined,
    });

    onLoginSuccess(newUser, selectedLanguage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-stone-900 to-green-950 text-white flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden font-sans select-none">
      {/* Background Decorative Blur Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-green-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between border-b border-emerald-800/40 pb-5 z-10">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-white text-2xl shadow-lg shadow-emerald-900/40">
            🌾
          </div>
          <div>
            <h1 className="text-2xl font-black font-serif tracking-tight text-white flex items-center gap-2">
              Krishi<span className="text-emerald-400">Sahay</span> AI
              <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full font-mono border border-emerald-500/40">
                {t.kioskTag}
              </span>
            </h1>
            <p className="text-xs text-stone-300 font-medium">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* Language Selector */}
        <div className="flex items-center space-x-2 bg-stone-900/90 border border-stone-800 px-3 py-1.5 rounded-2xl">
          <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="flex gap-1">
            {[
              { code: 'en', label: 'English' },
              { code: 'te', label: 'తెలుగు' },
              { code: 'hi', label: 'हिन्दी' },
            ].map((l) => (
              <button
                key={l.code}
                onClick={() => onLanguageChange(l.label)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedLanguage === l.label
                    ? 'bg-emerald-500 text-stone-950 shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Login Gateway Body */}
      <main className="max-w-5xl mx-auto w-full my-auto py-8 z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Welcome & Info Banner */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-full inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              {t.badge}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif leading-tight text-white">
              {t.heroTitlePrefix}<span className="text-emerald-400">{t.heroTitleHighlight}</span>{t.heroTitleSuffix}
            </h2>
            <p className="text-stone-300 text-sm leading-relaxed">
              {t.heroDesc}
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="p-3.5 bg-stone-900/80 border border-stone-800 rounded-2xl flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 text-lg">📷</div>
              <div>
                <h4 className="font-bold text-xs text-white">{t.feature1Title}</h4>
                <p className="text-stone-400 text-[11px]">{t.feature1Desc}</p>
              </div>
            </div>

            <div className="p-3.5 bg-stone-900/80 border border-stone-800 rounded-2xl flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 text-lg">🌾</div>
              <div>
                <h4 className="font-bold text-xs text-white">{t.feature2Title}</h4>
                <p className="text-stone-400 text-[11px]">{t.feature2Desc}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Login / Registration Panel */}
        <div className="lg:col-span-7 bg-stone-900/90 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative">
          {/* Mode Switcher Tabs */}
          <div className="flex p-1 bg-stone-950 rounded-2xl mb-6 border border-stone-800">
            <button
              onClick={() => setActiveTab('face')}
              className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                activeTab === 'face'
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-stone-950 shadow-md font-black'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Scan className="w-4 h-4" />
              <span>{t.tabFace}</span>
            </button>

            <button
              onClick={() => setActiveTab('credentials')}
              className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                activeTab === 'credentials'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>{t.tabCredentials}</span>
            </button>

            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>{t.tabRegister}</span>
            </button>
          </div>

          {authError && (
            <div className="mb-4 p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-xs text-rose-300 font-medium">
              ⚠️ {authError}
            </div>
          )}

          {/* TAB 1: FACE RECOGNITION LOGIN */}
          {activeTab === 'face' && (
            <div className="space-y-6 text-center py-4">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 border-2 border-emerald-400/50 mx-auto flex items-center justify-center text-emerald-400 shadow-inner group">
                <Scan className="w-12 h-12 animate-pulse text-emerald-400" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">{t.faceTitle}</h3>
                <p className="text-xs text-stone-300 mt-1">
                  {t.faceDesc}
                </p>
              </div>

              <button
                onClick={() => {
                  setFaceModalMode('login');
                  setIsFaceModalOpen(true);
                }}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-stone-950 font-black rounded-2xl text-sm shadow-xl transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
              >
                <Camera className="w-5 h-5" />
                <span>{t.faceBtn}</span>
              </button>

              {/* Quick Select Demo Accounts */}
              <div className="pt-4 border-t border-stone-800 text-left">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
                  {t.demoProfilesTitle}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: 'Ramesh Reddy', role: 'Farmer', phone: '+91 98480 12345' },
                    { name: 'Sita Devi', role: 'Farmer', phone: '+91 94401 56789' },
                    { name: 'Kisan Agro Traders', role: 'Buyer', phone: '+91 98200 45678' },
                  ].map((p) => (
                    <button
                      key={p.phone}
                      onClick={() => {
                        const user = OfflineStorage.findUserByCredentials(p.phone);
                        if (user) {
                          OfflineStorage.setActiveUser(user);
                          onLoginSuccess(user, selectedLanguage);
                        }
                      }}
                      className="p-2.5 bg-stone-950 border border-stone-800 hover:border-emerald-500 rounded-xl text-left transition-all cursor-pointer"
                    >
                      <strong className="block text-xs text-emerald-300 truncate">{p.name}</strong>
                      <span className="text-[10px] text-stone-400 block">{p.role} • {p.phone}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CREDENTIALS LOGIN */}
          {activeTab === 'credentials' && (
            <form onSubmit={handleCredentialsSignIn} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] font-bold text-stone-400 uppercase block mb-1">
                  {t.phoneLabel}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder={t.phonePlaceholder}
                    value={signInIdentifier}
                    onChange={(e) => setSignInIdentifier(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-white text-xs focus:border-emerald-500 outline-hidden transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-stone-400 uppercase block mb-1">
                  {t.passwordLabel}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    placeholder={t.passwordPlaceholder}
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-white text-xs focus:border-emerald-500 outline-hidden transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer active:scale-98"
              >
                {t.signInBtn}
              </button>
            </form>
          )}

          {/* TAB 3: REGISTER NEW USER */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[10px] font-bold text-stone-400 uppercase block mb-1">
                  {t.selectRoleLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Farmer', 'Buyer'] as const).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setRegRole(role)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        regRole === role
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                          : 'bg-stone-950 text-stone-400 border-stone-800'
                      }`}
                    >
                      {role === 'Farmer' ? t.roleFarmer : t.roleBuyer}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-stone-400 uppercase block mb-1">
                  {t.fullNameLabel}
                </label>
                <input
                  type="text"
                  placeholder={t.fullNamePlaceholder}
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-white text-xs focus:border-emerald-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-stone-400 uppercase block mb-1">
                    {t.phoneRegLabel}
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98480 12345"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-white text-xs focus:border-emerald-500 outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-stone-400 uppercase block mb-1">
                    {t.acresLabel}
                  </label>
                  <input
                    type="number"
                    placeholder={t.acresPlaceholder}
                    value={regAcres}
                    onChange={(e) => setRegAcres(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-white text-xs focus:border-emerald-500 outline-hidden font-mono"
                  />
                </div>
              </div>

              {/* Face Photo Capture for Registration */}
              <div className="p-3 bg-stone-950 border border-stone-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-emerald-400 uppercase block">
                    {t.faceRegTitle}
                  </label>
                  {regFacePhoto && (
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                      {t.faceRegSuccess}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFaceModalMode('register');
                    setIsFaceModalOpen(true);
                  }}
                  className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-emerald-300 font-bold border border-emerald-500/40 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-emerald-400" />
                  <span>{regFacePhoto ? t.faceRegRescan : t.faceRegBtn}</span>
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer active:scale-98"
              >
                {t.registerBtn}
              </button>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto w-full border-t border-emerald-800/30 pt-4 text-center text-xs text-stone-400 z-10 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>{t.footerText}</span>
        <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[11px] font-mono border border-emerald-500/20">
          {t.footerBadge}
        </span>
      </footer>

      {/* Face Scanner Modal */}
      <FaceRecognitionModal
        isOpen={isFaceModalOpen}
        onClose={() => setIsFaceModalOpen(false)}
        mode={faceModalMode}
        currentLanguage={selectedLanguage}
        onFaceCaptured={({ facePhotoUrl, faceEmbedding }) => {
          setRegFacePhoto(facePhotoUrl);
          setRegFaceEmbedding(faceEmbedding);
          setIsFaceModalOpen(false);
        }}
        onFaceLoginSuccess={(user) => {
          setIsFaceModalOpen(false);
          onLoginSuccess(user, selectedLanguage);
        }}
      />
    </div>
  );
};
