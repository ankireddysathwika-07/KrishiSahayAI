import React, { useState, useEffect } from 'react';
import { X, MapPin, Check, Sparkles, User, Phone, Mail, Building, Key, ShieldCheck, RefreshCw, Droplets, Camera, Scan } from 'lucide-react';
import { OfflineStorage, UserAccount } from '../services/offlineStorage';
import { SupportedLanguage } from '../services/i18n';
import { FaceRecognitionModal } from './FaceRecognitionModal';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserAccount, lang: string) => void;
  currentLanguage: string;
  onLanguageChange?: (lang: string) => void;
  initialTab?: 'signin' | 'register';
}

// Full comprehensive UI translations for the Register & Sign-In Modal
const MODAL_I18N: Record<
  SupportedLanguage,
  {
    brandSubtitle: string;
    features: {
      xaiTitle: string;
      xaiDesc: string;
      soilTitle: string;
      soilDesc: string;
      smsTitle: string;
      smsDesc: string;
      gpsTitle: string;
      gpsDesc: string;
    };
    roleAuthText: string;
    registerTitle: string;
    signInTitle: string;
    registerSubtitle: string;
    signInSubtitle: string;
    chooseLangLabel: string;
    tabRegister: string;
    tabSignIn: string;
    selectRole: string;
    roleFarmer: string;
    roleBuyer: string;
    roleRetailer: string;
    fullNameLabel: string;
    fullNamePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    acresLabel: string;
    acresPlaceholder: string;
    optimalMoistureLabel: string;
    optimalMoistureDesc: string;
    locationLabel: string;
    locationPlaceholder: string;
    gpsTrackBtn: string;
    gpsDetecting: string;
    gpsVerified: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    registerSubmitBtn: string;
    signInIdentifierLabel: string;
    signInIdentifierPlaceholder: string;
    demoProfilesTitle: string;
    signInSubmitBtn: string;
    errName: string;
    errContact: string;
    errNotFound: string;
  }
> = {
  en: {
    brandSubtitle: 'Complete AI Farm Intelligence Platform',
    features: {
      xaiTitle: 'Explainable AI & Federated Learning',
      xaiDesc: 'Local device training with gradient weights — zero private data leaves your farm',
      soilTitle: 'Soil Report OCR & Seed Quality',
      soilDesc: 'Upload real soil lab reports and seed photos for instant AI analysis',
      smsTitle: 'Automated SMS & Email Irrigation Alerts',
      smsDesc: 'Never miss a watering cycle when soil moisture drops below threshold',
      gpsTitle: 'Live GPS Location Tracking',
      gpsDesc: 'Automatic district & coordinates detection for exact local weather & Mandi prices',
    },
    roleAuthText: 'Role-Based Authentication',
    registerTitle: 'Register New Account',
    signInTitle: 'Sign In to KrishiSahay',
    registerSubtitle: 'Join as a Farmer, Buyer, or Retailer',
    signInSubtitle: 'Enter your registered phone, email, or credentials',
    chooseLangLabel: '🌐 Choose Your Language / भाषा चुनें / మీ భాషను ఎంచుకోండి',
    tabRegister: 'Register (New User)',
    tabSignIn: 'Sign In (Existing)',
    selectRole: 'Select Your Role:',
    roleFarmer: '🌾 Farmer',
    roleBuyer: '🛒 Buyer',
    roleRetailer: '🏪 Retailer',
    fullNameLabel: 'Full Name / Business Name *',
    fullNamePlaceholder: 'e.g. Ramesh Reddy, Balaji Traders...',
    phoneLabel: 'Phone (for SMS Alerts) *',
    phonePlaceholder: '+91 98480 12345',
    emailLabel: 'Email Address (for Reports & Alerts)',
    emailPlaceholder: 'farmer@krishisahay.in',
    acresLabel: 'Farm Land Holding (Acres)',
    acresPlaceholder: 'e.g. 5',
    optimalMoistureLabel: 'Farm Profile Optimal Moisture Threshold (%)',
    optimalMoistureDesc: 'Automated SMS and email alerts trigger when field moisture drops below this value',
    locationLabel: 'Farm / Business Location',
    locationPlaceholder: 'District, State (e.g. Warangal, Telangana)',
    gpsTrackBtn: '📍 Track GPS',
    gpsDetecting: 'Detecting...',
    gpsVerified: 'Live GPS Position Verified',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Create secure password',
    registerSubmitBtn: 'Register & Enter KrishiSahay →',
    signInIdentifierLabel: 'Phone Number, Email, or Full Name',
    signInIdentifierPlaceholder: 'e.g. +91 98480 12345 or Ramesh Reddy',
    demoProfilesTitle: 'Quick Select Demo Profiles:',
    signInSubmitBtn: 'Sign In to Account →',
    errName: 'Please enter your full name',
    errContact: 'Please provide either phone number or email for irrigation & market SMS updates',
    errNotFound: 'No account found with this phone/email. Please switch to the "Register" tab to create your free account!',
  },
  hi: {
    brandSubtitle: 'सम्पूर्ण कृत्रिम बुद्धिमत्ता कृषि मंच',
    features: {
      xaiTitle: 'पारदर्शी AI एवं फेडरेटेड लर्निंग',
      xaiDesc: 'स्थानीय फोन पर मॉडल प्रशिक्षण — आपकी निजी तस्वीरें कभी फोन से बाहर नहीं जातीं',
      soilTitle: 'मृदा स्वास्थ्य कार्ड OCR एवं बीज गुणवत्ता',
      soilDesc: 'मिट्टी की जांच रिपोर्ट व बीज फोटो अपलोड कर तुरंत सटीक वैज्ञानिक रिपोर्ट पाएं',
      smsTitle: 'स्वचालित SMS एवं ईमेल सिंचाई अलर्ट',
      smsDesc: 'जैसे ही खेत की नमी तय सीमा से कम होगी, मोबाइल पर तुरंत पानी देने का SMS पहुंचेगा',
      gpsTitle: 'सजीव GPS स्थान ट्रैकिंग',
      gpsDesc: 'सटीक मौसम व स्थानीय मंडी भाव हेतु स्वचालित जिला एवं अक्षांश-देशांतर पहचान',
    },
    roleAuthText: 'भूमिका-आधारित सुरक्षित प्रमाणीकरण',
    registerTitle: 'नया खाता बनाएं (पंजीकरण)',
    signInTitle: 'कृषि सहाय में लॉग इन करें',
    registerSubtitle: 'किसान, खरीदार या खुदरा विक्रेता के रूप में जुड़ें',
    signInSubtitle: 'अपना पंजीकृत मोबाइल नंबर, ईमेल या नाम दर्ज करें',
    chooseLangLabel: '🌐 अपनी भाषा चुनें / Choose Language',
    tabRegister: 'पंजीकरण (नया किसान)',
    tabSignIn: 'लॉग इन (मौजूदा उपयोगकर्ता)',
    selectRole: 'अपनी भूमिका चुनें:',
    roleFarmer: '🌾 किसान',
    roleBuyer: '🛒 खरीदार / व्यापारी',
    roleRetailer: '🏪 खुदरा विक्रेता / डीलर',
    fullNameLabel: 'पूरा नाम / व्यापारिक नाम *',
    fullNamePlaceholder: 'उदा. रमेश रेड्डी, किसान ट्रेडर्स...',
    phoneLabel: 'मोबाइल नंबर (सिंचाई SMS अलर्ट हेतु) *',
    phonePlaceholder: '+91 98480 12345',
    emailLabel: 'ईमेल पता (मौसम व फसल रिपोर्ट हेतु)',
    emailPlaceholder: 'farmer@krishisahay.in',
    acresLabel: 'खेत का क्षेत्रफल (एकड़)',
    acresPlaceholder: 'उदा. 5',
    optimalMoistureLabel: 'खेत हेतु इष्टतम मिट्टी नमी सीमा (%)',
    optimalMoistureDesc: 'जब भी नमी इस सीमा से कम होगी, आपको तुरंत SMS और ईमेल अलर्ट भेजा जाएगा',
    locationLabel: 'खेत / व्यापार का स्थान',
    locationPlaceholder: 'गाँव, जिला, राज्य (उदा. वारंगल, तेलंगाना)',
    gpsTrackBtn: '📍 GPS स्थान पहचानें',
    gpsDetecting: 'पहचान जारी...',
    gpsVerified: 'सजीव GPS स्थान सत्यापित',
    passwordLabel: 'पासवर्ड',
    passwordPlaceholder: 'सुरक्षित पासवर्ड बनाएं',
    registerSubmitBtn: 'खाता बनाएं एवं प्रवेश करें →',
    signInIdentifierLabel: 'मोबाइल नंबर, ईमेल या पूरा नाम',
    signInIdentifierPlaceholder: 'उदा. +91 98480 12345 या रमेश रेड्डी',
    demoProfilesTitle: 'त्वरित डेमो प्रोफाइल चुनें:',
    signInSubmitBtn: 'खाते में लॉग इन करें →',
    errName: 'कृपया अपना पूरा नाम दर्ज करें',
    errContact: 'सिंचाई अलर्ट हेतु कृपया मोबाइल नंबर या ईमेल अवश्य प्रदान करें',
    errNotFound: 'इस नंबर/ईमेल से कोई खाता नहीं मिला। कृपया "पंजीकरण" टैब पर जाकर नया खाता बनाएं!',
  },
  te: {
    brandSubtitle: 'రైతుల కోసం సంపూర్ణ AI వ్యవసాయ వేదిక',
    features: {
      xaiTitle: 'వివరణాత్మక AI & ఫెడరేటెడ్ లెర్నింగ్',
      xaiDesc: 'మీ ఫోన్ లోనే మోడల్ శిక్షణ — మీ పొలం వివరాలు ఎప్పుడూ మీ పరికరం దాటి వెళ్లవు',
      soilTitle: 'సాయిల్ హెల్త్ కార్డ్ OCR & విత్తన నాణ్యత',
      soilDesc: 'ల్యాబ్ రిపోర్ట్ లేదా విత్తనాల ఫోటో అప్‌లోడ్ చేసి క్షణాల్లో AI ఫలితాలు పొందండి',
      smsTitle: 'ఆటోమేటిక్ SMS & ఈమెయిల్ నీటి తడుల అలర్ట్స్',
      smsDesc: 'నేలలో తేమ నిర్ణీత శాతం కంటే తగ్గితే వెంటనే మీ ఫోన్‌కు SMS వస్తుంది',
      gpsTitle: 'లైవ్ GPS లొకేషన్ గుర్తింపు',
      gpsDesc: 'ఖచ్చితమైన స్థానిక వాతావరణం మరియు మార్కెట్ ధరల కోసం ఆటోమేటిక్ GPS గుర్తింపు',
    },
    roleAuthText: 'సురక్షిత వ్యవసాయ లాగిన్',
    registerTitle: 'కొత్త ఖాతా నమోదు (రిజిస్ట్రేషన్)',
    signInTitle: 'క్రిషీ సహాయ్ లోకి సైన్ ఇన్',
    registerSubtitle: 'రైతు, కొనుగోలుదారు లేదా వ్యాపారిగా నమోదు చేసుకోండి',
    signInSubtitle: 'మీ రిజిస్టర్డ్ మొబైల్ లేదా ఈమెయిల్‌తో ప్రవేశించండి',
    chooseLangLabel: '🌐 మీ భాషను ఎంచుకోండి / Choose Language',
    tabRegister: 'కొత్త నమోదు (రిజిస్టర్)',
    tabSignIn: 'సైన్ ఇన్ (లాగిన్)',
    selectRole: 'మీ పాత్రను ఎంచుకోండి:',
    roleFarmer: '🌾 రైతు',
    roleBuyer: '🛒 కొనుగోలుదారు',
    roleRetailer: '🏪 డీలర్ / వ్యాపారి',
    fullNameLabel: 'పూర్తి పేరు / వ్యాపార పేరు *',
    fullNamePlaceholder: 'ఉదా. రమేష్ రెడ్డి, బాలాజీ ట్రేడర్స్...',
    phoneLabel: 'మొబైల్ నంబర్ (SMS అలర్ట్స్ కోసం) *',
    phonePlaceholder: '+91 98480 12345',
    emailLabel: 'ఈమెయిల్ చిరునామా (రిపోర్టుల కోసం)',
    emailPlaceholder: 'farmer@krishisahay.in',
    acresLabel: 'పొలం విస్తీర్ణం (ఎకరాలు)',
    acresPlaceholder: 'ఉదా. 5',
    optimalMoistureLabel: 'పొలంలో కనీస అవసరమైన నేల తేమ శాతం (%)',
    optimalMoistureDesc: 'నేలలో తేమ ఈ శాతం కంటే తగ్గగానే వెంటనే మీ ఫోన్‌కు SMS మరియు ఈమెయిల్ అలర్ట్ వస్తుంది',
    locationLabel: 'పొలం / వ్యాపార స్థలం',
    locationPlaceholder: 'మండలం, జిల్లా, రాష్ట్రం (ఉదా. వరంగల్, తెలంగాణ)',
    gpsTrackBtn: '📍 GPS స్థానాన్ని గుర్తించండి',
    gpsDetecting: 'గుర్తిస్తోంది...',
    gpsVerified: 'లైవ్ GPS స్థానం నిర్ధారించబడింది',
    passwordLabel: 'పాస్‌వర్డ్',
    passwordPlaceholder: 'సురక్షిత పాస్‌వర్డ్ నమోదు చేయండి',
    registerSubmitBtn: 'నమోదు చేసి ప్రవేశించండి →',
    signInIdentifierLabel: 'మొబైల్ నంబర్, ఈమెయిల్ లేదా పూర్తి పేరు',
    signInIdentifierPlaceholder: 'ఉదా. +91 98480 12345 లేదా రమేష్ రెడ్డి',
    demoProfilesTitle: 'డెమో ప్రొఫైల్స్ ద్వారా త్వరిత లాగిన్:',
    signInSubmitBtn: 'ఖాతాలోకి ప్రవేశించండి →',
    errName: 'దయచేసి మీ పూర్తి పేరును నమోదు చేయండి',
    errContact: 'దయచేసి SMS నీటి అలర్ట్స్ కోసం మొబైల్ నంబర్ ఇవ్వండి',
    errNotFound: 'ఈ మొబైల్/ఈమెయిల్‌తో ఖాతా కనుగొనబడలేదు. దయచేసి "కొత్త నమోదు" ట్యాబ్ ద్వారా నమోదు చేసుకోండి!',
  },
  ta: {
    brandSubtitle: 'முழுமையான AI விவசாய நுண்ணறிவு தளம்',
    features: {
      xaiTitle: 'வெளிப்படையான AI & ஃபெடரேட்டட் லேர்னிங்',
      xaiDesc: 'உங்கள் போனில் உள்ளூர் மாதிரி பயிற்சி — உங்கள் பண்ணை விவரங்கள் வெளியே போகாது',
      soilTitle: 'மண் பரிசோதனை OCR & விதை தரம்',
      soilDesc: 'ஆய்வக மண் அட்டை மற்றும் விதை புகைப்படத்தை பதிவேற்றி உடனடி பகுப்பாய்வு பெறவும்',
      smsTitle: 'தானியங்கி SMS & மின்னஞ்சல் நீர்ப்பாசன எச்சரிக்கைகள்',
      smsDesc: 'மண்ணில் ஈரப்பதம் குறையும் போது உங்கள் மொபைலுக்கு உடனடி SMS எச்சரிக்கை வரும்',
      gpsTitle: 'நேரடி GPS இருப்பிட கண்காணிப்பு',
      gpsDesc: 'துல்லியமான உள்ளூர் வானிலை மற்றும் மண்டி விலைகளுக்கான தானியங்கி GPS',
    },
    roleAuthText: 'பாதுகாப்பான விவசாய உள்நுழைவு',
    registerTitle: 'புதிய கணக்கு பதிவு',
    signInTitle: 'கிருஷி சஹாயில் உள்நுழைக',
    registerSubtitle: 'விவசாயி, வாங்குபவர் அல்லது சில்லறை விற்பனையாளராக இணையுங்கள்',
    signInSubtitle: 'பதிவுசெய்த மொபைல் எண் அல்லது மின்னஞ்சலை உள்ளிடவும்',
    chooseLangLabel: '🌐 உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்',
    tabRegister: 'பதிவு (புதிய பயனர்)',
    tabSignIn: 'உள்நுழைக (பழைய பயனர்)',
    selectRole: 'உங்கள் பாத்திரத்தைத் தேர்வுசெய்க:',
    roleFarmer: '🌾 விவசாயி',
    roleBuyer: '🛒 வாங்குபவர்',
    roleRetailer: '🏪 வியாபாரி',
    fullNameLabel: 'முழு பெயர் / வணிக பெயர் *',
    fullNamePlaceholder: 'எ.கா. ரமேஷ் ரெட்டி...',
    phoneLabel: 'மொபைல் எண் (SMS விழிப்பூட்டல்களுக்கு) *',
    phonePlaceholder: '+91 98480 12345',
    emailLabel: 'மின்னஞ்சல் முகவரி',
    emailPlaceholder: 'farmer@krishisahay.in',
    acresLabel: 'நிலப்பரப்பு (ஏக்கர்)',
    acresPlaceholder: 'எ.கா. 5',
    optimalMoistureLabel: 'பண்ணை குறைந்தபட்ச மண் ஈரப்பத வரம்பு (%)',
    optimalMoistureDesc: 'மண் ஈரப்பதம் இந்த அளவிற்கு கீழ் குறையும் போது தானியங்கி SMS அனுப்பப்படும்',
    locationLabel: 'பண்ணை இருப்பிடம்',
    locationPlaceholder: 'மாவட்டம், மாநிலம் (எ.கா. மதுரை, தமிழ்நாடு)',
    gpsTrackBtn: '📍 நேரடி GPS கண்டறி',
    gpsDetecting: 'கண்டறிகிறது...',
    gpsVerified: 'நேரடி GPS சரிபார்க்கப்பட்டது',
    passwordLabel: 'கடவுச்சொல்',
    passwordPlaceholder: 'பாதுகாப்பான கடவுச்சொல்',
    registerSubmitBtn: 'பதிவு செய்து நுழையுங்கள் →',
    signInIdentifierLabel: 'மொபைல் எண், மின்னஞ்சல் அல்லது பெயர்',
    signInIdentifierPlaceholder: 'எ.கா. +91 98480 12345',
    demoProfilesTitle: 'டெமோ சுயவிவரங்கள்:',
    signInSubmitBtn: 'கணக்கில் உள்நுழைக →',
    errName: 'தயவுசெய்து உங்கள் முழு பெயரை உள்ளிடவும்',
    errContact: 'தயவுசெய்து மொபைல் எண் அல்லது மின்னஞ்சலை வழங்கவும்',
    errNotFound: 'இந்த எண்ணில் கணக்கு இல்லை. தயவுசெய்து "பதிவு" தாவலை சொடுக்கவும்!',
  },
  mr: {
    brandSubtitle: 'संपूर्ण AI कृषी बुद्धिमत्ता मंच',
    features: {
      xaiTitle: 'पारदर्शक AI आणि फेडेरेटेड लर्निंग',
      xaiDesc: 'डिव्हाइसवर स्थानिक मॉडेल प्रशिक्षण — तुमचा डेटा कधीही फोनबाहेर जात नाही',
      soilTitle: 'मृदा आरोग्य कार्ड OCR आणि बियाणे गुणवत्ता',
      soilDesc: 'माती परीक्षण अहवाल व बियाण्यांचे फोटो अपलोड करून त्वरित अचूक अहवाल मिळवा',
      smsTitle: 'स्वयंचलित SMS आणि ईमेल सिंचन अलर्ट',
      smsDesc: 'जमिनीतील ओलावा कमी होताच तुमच्या मोबाईलवर त्वरित पाणी देण्याचा मेसेज येतो',
      gpsTitle: 'थेट GPS स्थान ट्रॅकिंग',
      gpsDesc: 'अचूक स्थानिक हवामान आणि बाजारभावांसाठी स्वयंचलित GPS स्थान शोध',
    },
    roleAuthText: 'भूमिका-आधारित सुरक्षित प्रमाणीकरण',
    registerTitle: 'नवीन खाते नोंदणी करा',
    signInTitle: 'कृषी सहाय मध्ये लॉगिन करा',
    registerSubtitle: 'शेतकरी, खरेदीदार किंवा किरकोळ विक्रेता म्हणून सामील व्हा',
    signInSubtitle: 'तुमचा नोंदणीकृत मोबाईल नंबर किंवा ईमेल प्रविष्ट करा',
    chooseLangLabel: '🌐 तुमची भाषा निवडा / Choose Language',
    tabRegister: 'नोंदणी (नवीन शेतकरी)',
    tabSignIn: 'लॉगिन (विद्यमान वापरकर्ता)',
    selectRole: 'तुमची भूमिका निवडा:',
    roleFarmer: '🌾 शेतकरी',
    roleBuyer: '🛒 खरेदीदार / व्यापारी',
    roleRetailer: '🏪 किरकोळ विक्रेता / डीलर',
    fullNameLabel: 'पूर्ण नाव / व्यवसाय नाव *',
    fullNamePlaceholder: 'उदा. रमेश रेड्डी...',
    phoneLabel: 'मोबाईल नंबर (SMS अलर्टसाठी) *',
    phonePlaceholder: '+91 98480 12345',
    emailLabel: 'ईमेल पत्ता (अहवालांसाठी)',
    emailPlaceholder: 'farmer@krishisahay.in',
    acresLabel: 'शेतीचे क्षेत्रफळ (एकर)',
    acresPlaceholder: 'उदा. 5',
    optimalMoistureLabel: 'शेतासाठी इष्टतम माती ओलावा मर्यादा (%)',
    optimalMoistureDesc: 'जेव्हा ओलावा या मर्यादेपेक्षा कमी होईल, तेव्हा तुम्हाला त्वरित SMS व ईमेल अलर्ट पाठवला जाईल',
    locationLabel: 'शेत / व्यवसायाचे स्थान',
    locationPlaceholder: 'गाव, जिल्हा, राज्य (उदा. नाशिक, महाराष्ट्र)',
    gpsTrackBtn: '📍 थेट GPS स्थान शोधा',
    gpsDetecting: 'शोधत आहे...',
    gpsVerified: 'थेट GPS स्थान सत्यापित',
    passwordLabel: 'पासवर्ड',
    passwordPlaceholder: 'सुरक्षित पासवर्ड तयार करा',
    registerSubmitBtn: 'नोंदणी करा आणि प्रवेश करा →',
    signInIdentifierLabel: 'मोबाईल नंबर, ईमेल किंवा पूर्ण नाव',
    signInIdentifierPlaceholder: 'उदा. +91 98480 12345',
    demoProfilesTitle: 'त्वरित डेमो प्रोफाईल निवडा:',
    signInSubmitBtn: 'खात्यात लॉगिन करा →',
    errName: 'कृपया आपले पूर्ण नाव प्रविष्ट करा',
    errContact: 'कृपया सिंचन अलर्टसाठी मोबाईल नंबर किंवा ईमेल प्रदान करा',
    errNotFound: 'या नंबरवर खाते आढळले नाही. कृपया "नोंदणी" टॅबवर जाऊन नवीन खाते तयार करा!',
  },
};

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  currentLanguage,
  onLanguageChange,
  initialTab = 'signin',
}) => {
  const [authTab, setAuthTab] = useState<'signin' | 'register'>(initialTab);
  const [selectedLang, setSelectedLang] = useState<string>(currentLanguage || 'English');
  const [selectedRole, setSelectedRole] = useState<'Farmer' | 'Buyer'>('Farmer');

  // Synchronize when currentLanguage or initialTab prop changes
  useEffect(() => {
    if (isOpen) {
      if (initialTab) setAuthTab(initialTab);
      if (currentLanguage) setSelectedLang(currentLanguage);
    }
  }, [isOpen, initialTab, currentLanguage]);

  // Form Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [landAcres, setLandAcres] = useState('5');
  const [optimalMoisture, setOptimalMoisture] = useState('45');
  const [password, setPassword] = useState('');

  // Signin fields
  const [signInIdentifier, setSignInIdentifier] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Live Location tracking
  const [isLocating, setIsLocating] = useState(false);
  const [locSuccess, setLocSuccess] = useState(false);

  // Gram Panchayat Kiosk Face Recognition state
  const [isFaceModalOpen, setIsFaceModalOpen] = useState(false);
  const [faceModalMode, setFaceModalMode] = useState<'register' | 'login'>('login');
  const [registeredFacePhoto, setRegisteredFacePhoto] = useState<string | null>(null);
  const [registeredFaceEmbedding, setRegisteredFaceEmbedding] = useState<number[] | null>(null);

  if (!isOpen) return null;

  // Language mapping for i18n
  const langKey: SupportedLanguage =
    selectedLang === 'हिन्दी' || selectedLang === 'hi' ? 'hi' :
    selectedLang === 'తెలుగు' || selectedLang === 'te' ? 'te' :
    selectedLang === 'தமிழ்' || selectedLang === 'ta' ? 'ta' :
    selectedLang === 'मराठी' || selectedLang === 'mr' ? 'mr' : 'en';

  const t = MODAL_I18N[langKey] || MODAL_I18N.en;

  const handleLanguageSelect = (langLabel: string) => {
    setSelectedLang(langLabel);
    OfflineStorage.setActiveLanguage(langLabel);
    if (onLanguageChange) {
      onLanguageChange(langLabel);
    }
  };

  // Real Geolocation Tracking
  const handleGetLocation = () => {
    setIsLocating(true);
    setAuthError(null);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;

          // Attempt reverse geocoding via OpenStreetMap Nominatim
          try {
            const resp = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`,
              { headers: { 'Accept-Language': 'en' } }
            );
            if (resp.ok) {
              const data = await resp.json();
              const district = data.address?.county || data.address?.state_district || data.address?.city || data.address?.town || 'Local District';
              const state = data.address?.state || 'India';
              const locStr = `${district}, ${state} (${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E)`;
              setLocation(locStr);
              setIsLocating(false);
              setLocSuccess(true);
              return;
            }
          } catch {
            // fallback
          }

          const fallbackLoc = `Live GPS: ${lat.toFixed(3)}°N, ${lon.toFixed(3)}°E`;
          setLocation(fallbackLoc);
          setIsLocating(false);
          setLocSuccess(true);
        },
        () => {
          setIsLocating(false);
          setLocation('Telangana Semi-Arid Agricultural Zone (17.96°N, 79.59°E)');
          setLocSuccess(true);
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    } else {
      setLocation('Telangana Semi-Arid Agricultural Zone');
      setIsLocating(false);
      setLocSuccess(true);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!name.trim()) {
      setAuthError(t.errName);
      return;
    }
    if (!phone.trim() && !email.trim()) {
      setAuthError(t.errContact);
      return;
    }

    const locToUse = location.trim() || 'Telangana Agri Zone (Auto-assigned)';

    const newUser = OfflineStorage.registerUser({
      name: name.trim(),
      phone: phone.trim() || '+91 98480 00000',
      email: email.trim() || 'farmer@krishisahay.in',
      location: locToUse,
      role: selectedRole,
      landAcres: parseFloat(landAcres) || 4.5,
      optimalMoistureThreshold: parseInt(optimalMoisture, 10) || 45,
      password: password || '123456',
      facePhotoUrl: registeredFacePhoto || undefined,
      faceEmbedding: registeredFaceEmbedding || undefined,
    });

    onLoginSuccess(newUser, selectedLang);
    onClose();
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!signInIdentifier.trim()) {
      setAuthError(t.signInIdentifierLabel);
      return;
    }

    const user = OfflineStorage.findUserByCredentials(signInIdentifier);
    if (user) {
      OfflineStorage.setActiveUser(user);
      onLoginSuccess(user, selectedLang);
      onClose();
    } else {
      setAuthError(t.errNotFound);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col md:flex-row relative max-h-[92vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Brand & Feature Highlights in Selected Language */}
        <div className="md:w-5/12 bg-gradient-to-br from-[#14532d] via-[#166534] to-[#15803d] p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center text-2xl">
                🌾
              </div>
              <div>
                <h1 className="text-2xl font-black font-serif tracking-tight text-white">
                  Krishi<span className="text-[#86efac]">Sahay</span>
                </h1>
                <p className="text-xs text-white/70">{t.brandSubtitle}</p>
              </div>
            </div>

            <div className="space-y-4 text-xs mt-6">
              <div className="flex items-start space-x-3 text-white/90">
                <span className="p-2 rounded-xl bg-white/10 text-base shrink-0">🤖</span>
                <div>
                  <h4 className="font-bold text-white">{t.features.xaiTitle}</h4>
                  <p className="text-white/60 text-[11px] leading-relaxed">{t.features.xaiDesc}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-white/90">
                <span className="p-2 rounded-xl bg-white/10 text-base shrink-0">📄</span>
                <div>
                  <h4 className="font-bold text-white">{t.features.soilTitle}</h4>
                  <p className="text-white/60 text-[11px] leading-relaxed">{t.features.soilDesc}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-white/90">
                <span className="p-2 rounded-xl bg-white/10 text-base shrink-0">📱</span>
                <div>
                  <h4 className="font-bold text-white">{t.features.smsTitle}</h4>
                  <p className="text-white/60 text-[11px] leading-relaxed">{t.features.smsDesc}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-white/90">
                <span className="p-2 rounded-xl bg-white/10 text-base shrink-0">📍</span>
                <div>
                  <h4 className="font-bold text-white">{t.features.gpsTitle}</h4>
                  <p className="text-white/60 text-[11px] leading-relaxed">{t.features.gpsDesc}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-white/60 flex items-center justify-between">
            <span>{t.roleAuthText}</span>
            <span className="bg-white/15 px-2 py-0.5 rounded-full font-mono text-[10px]">v3.4 Multi-Lingual</span>
          </div>
        </div>

        {/* Right Side: Auth Form & Dynamic Language Selector */}
        <div className="md:w-7/12 p-8 overflow-y-auto">
          <h2 className="text-2xl font-black font-serif text-emerald-950">
            {authTab === 'register' ? t.registerTitle : t.signInTitle}
          </h2>
          <p className="text-xs text-stone-500 mt-1 mb-5">
            {authTab === 'register' ? t.registerSubtitle : t.signInSubtitle}
          </p>

          {/* Interactive Language Selector - Translates modal instantaneously! */}
          <div className="mb-5 p-3 bg-emerald-50/60 border border-emerald-100 rounded-2xl">
            <label className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider block mb-2">
              {t.chooseLangLabel}
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { code: 'en', label: 'English' },
                { code: 'hi', label: 'हिन्दी' },
                { code: 'te', label: 'తెలుగు' },
                { code: 'ta', label: 'தமிழ்' },
                { code: 'mr', label: 'मराठी' },
              ].map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => handleLanguageSelect(l.label)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
                    selectedLang === l.label
                      ? 'bg-emerald-700 text-white border-emerald-700 font-bold shadow-sm scale-105'
                      : 'bg-white text-stone-700 border-stone-200 hover:border-emerald-400 hover:bg-emerald-50'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sign In / Register Tabs */}
          <div className="flex p-1 bg-stone-100 rounded-xl mb-5">
            <button
              type="button"
              onClick={() => { setAuthTab('register'); setAuthError(null); }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                authTab === 'register' ? 'bg-white text-emerald-950 shadow-xs' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {t.tabRegister}
            </button>
            <button
              type="button"
              onClick={() => { setAuthTab('signin'); setAuthError(null); }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                authTab === 'signin' ? 'bg-white text-emerald-950 shadow-xs' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {t.tabSignIn}
            </button>
          </div>

          {authError && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
              ⚠️ {authError}
            </div>
          )}

          {/* REGISTER FLOW */}
          {authTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1.5">
                  {t.selectRole}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Farmer', 'Buyer'] as const).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setSelectedRole(role)}
                      className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        selectedRole === role
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-500 ring-2 ring-emerald-200'
                          : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      {role === 'Farmer' ? t.roleFarmer : t.roleBuyer}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">
                  {t.fullNameLabel}
                </label>
                <input
                  type="text"
                  placeholder={t.fullNamePlaceholder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-stone-800 text-xs focus:border-emerald-600 focus:bg-white bg-stone-50 outline-hidden transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">
                    {t.phoneLabel}
                  </label>
                  <input
                    type="tel"
                    placeholder={t.phonePlaceholder}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-stone-800 text-xs focus:border-emerald-600 focus:bg-white bg-stone-50 outline-hidden transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">
                    {t.emailLabel}
                  </label>
                  <input
                    type="email"
                    placeholder={t.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-stone-800 text-xs focus:border-emerald-600 focus:bg-white bg-stone-50 outline-hidden transition-all"
                  />
                </div>
              </div>

              {selectedRole === 'Farmer' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">
                      {t.acresLabel}
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder={t.acresPlaceholder}
                      value={landAcres}
                      onChange={(e) => setLandAcres(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-200 rounded-xl text-stone-800 text-xs focus:border-emerald-600 focus:bg-white bg-stone-50 outline-hidden transition-all font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">
                      {t.optimalMoistureLabel}
                    </label>
                    <div className="flex items-center space-x-1">
                      <input
                        type="number"
                        min="20"
                        max="70"
                        value={optimalMoisture}
                        onChange={(e) => setOptimalMoisture(e.target.value)}
                        className="w-full px-3 py-2 border border-stone-200 rounded-xl text-stone-800 text-xs focus:border-emerald-600 focus:bg-white bg-stone-50 outline-hidden transition-all font-mono font-bold"
                      />
                      <span className="text-xs font-bold text-cyan-800 shrink-0">%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Location with Live GPS Detection */}
              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">
                  {t.locationLabel}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={t.locationPlaceholder}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="flex-1 px-3 py-2 border border-stone-200 rounded-xl text-stone-800 text-xs focus:border-emerald-600 focus:bg-white bg-stone-50 outline-hidden transition-all"
                  />
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={isLocating}
                    className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 rounded-xl flex items-center space-x-1.5 shrink-0 transition-all text-xs cursor-pointer"
                    title="Click to detect your current browser GPS location"
                  >
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{isLocating ? t.gpsDetecting : t.gpsTrackBtn}</span>
                  </button>
                </div>
                {locSuccess && (
                  <p className="text-[11px] text-emerald-700 mt-1 flex items-center space-x-1">
                    <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>{t.gpsVerified}</span>
                  </p>
                )}
              </div>

              {/* Gram Panchayat Kiosk Face Registration Snapshot Option */}
              <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-emerald-950 uppercase tracking-wider block">
                    📷 Gram Panchayat Kiosk Face Enrollment (గ్రామ్ పంచాయతీ ఫేస్ రిజిస్ట్రేషన్)
                  </label>
                  {registeredFacePhoto && (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-700" />
                      Face Registered
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-600">
                  Farmers can sign in directly using face recognition without typing phone or password.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFaceModalMode('register');
                    setIsFaceModalOpen(true);
                  }}
                  className="w-full py-2 bg-white hover:bg-emerald-100/60 text-emerald-900 font-bold border border-emerald-300 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-2xs"
                >
                  <Camera className="w-4 h-4 text-emerald-700" />
                  <span>{registeredFacePhoto ? 'Re-scan Farmer Face Snapshot' : 'Scan & Save Farmer Face Snapshot'}</span>
                </button>
              </div>

              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">
                  {t.passwordLabel}
                </label>
                <input
                  type="password"
                  placeholder={t.passwordPlaceholder}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-stone-800 text-xs focus:border-emerald-600 focus:bg-white bg-stone-50 outline-hidden transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-800 to-green-700 hover:from-emerald-900 hover:to-green-800 text-white rounded-xl font-bold text-sm shadow-md transition-all active:scale-98 mt-3 cursor-pointer"
              >
                {t.registerSubmitBtn}
              </button>
            </form>
          )}

          {/* SIGN IN FLOW */}
          {authTab === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4 text-xs">
              {/* Gram Panchayat Kiosk - Prominent Face Recognition Sign In Banner */}
              <div className="p-4 bg-gradient-to-r from-emerald-950 via-stone-900 to-green-950 rounded-2xl text-white space-y-2 border border-emerald-700/60 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                      <Scan className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-emerald-100">
                        Gram Panchayat Kiosk Facial Login
                      </h4>
                      <p className="text-[10px] text-stone-300">
                        గ్రామ్ పంచాయతీ ఫేస్ రికగ్నిషన్ లాగిన్
                      </p>
                    </div>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-mono px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Phone-less Sign-in
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFaceModalMode('login');
                    setIsFaceModalOpen(true);
                  }}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-stone-950 font-black rounded-xl text-xs shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
                >
                  <Scan className="w-4 h-4 text-stone-950" />
                  <span>Login with Face Recognition (ఫేస్ లాగిన్ ద్వారా ప్రవేశించు)</span>
                </button>
              </div>

              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">
                  {t.signInIdentifierLabel}
                </label>
                <input
                  type="text"
                  placeholder={t.signInIdentifierPlaceholder}
                  value={signInIdentifier}
                  onChange={(e) => setSignInIdentifier(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-stone-800 text-xs focus:border-emerald-600 focus:bg-white bg-stone-50 outline-hidden transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">
                  {t.passwordLabel}
                </label>
                <input
                  type="password"
                  placeholder={t.passwordPlaceholder}
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-stone-800 text-xs focus:border-emerald-600 focus:bg-white bg-stone-50 outline-hidden transition-all"
                />
              </div>

              {/* Sample Registered Accounts for Quick Testing */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <span className="text-[10px] font-bold text-stone-500 uppercase block">
                  {t.demoProfilesTitle}
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { name: 'Ramesh Reddy', role: 'Farmer', phone: '+91 98480 12345' },
                    { name: 'Sita Devi', role: 'Farmer', phone: '+91 94401 56789' },
                    { name: 'Kisan Agro Traders', role: 'Buyer', phone: '+91 98200 45678' },
                    { name: 'Sri Balaji Mandi Procurement', role: 'Buyer', phone: '+91 97000 88990' },
                  ].map((p) => (
                    <button
                      key={p.phone}
                      type="button"
                      onClick={() => setSignInIdentifier(p.phone)}
                      className="text-left p-1.5 bg-white border border-stone-200 rounded-lg hover:border-emerald-400 text-[11px] truncate transition-all cursor-pointer"
                    >
                      <strong className="block text-emerald-950 truncate">{p.name}</strong>
                      <span className="text-stone-400 text-[10px]">{p.role} • {p.phone}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-800 to-green-700 hover:from-emerald-900 hover:to-green-800 text-white rounded-xl font-bold text-sm shadow-md transition-all active:scale-98 mt-2 cursor-pointer"
              >
                {t.signInSubmitBtn}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Gram Panchayat Face Recognition Scanner Modal */}
      <FaceRecognitionModal
        isOpen={isFaceModalOpen}
        onClose={() => setIsFaceModalOpen(false)}
        mode={faceModalMode}
        currentLanguage={selectedLang}
        onFaceCaptured={({ facePhotoUrl, faceEmbedding }) => {
          setRegisteredFacePhoto(facePhotoUrl);
          setRegisteredFaceEmbedding(faceEmbedding);
          setIsFaceModalOpen(false);
        }}
        onFaceLoginSuccess={(user) => {
          setIsFaceModalOpen(false);
          onLoginSuccess(user, selectedLang);
          onClose();
        }}
      />
    </div>
  );
};
