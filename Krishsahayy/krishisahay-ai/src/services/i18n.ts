export type SupportedLanguage = 'en' | 'hi' | 'te' | 'ta' | 'mr';

export interface Translations {
  appName: string;
  tagline: string;
  nav: {
    dashboard: string;
    agrimarket: string;
    prices: string;
    marketplace: string;
    mylistings: string;
    soilsense: string;
    soilUpload: string;
    watersense: string;
    waterOptimizer: string;
    kisanvaani: string;
    voiceAssistant: string;
    weather: string;
    equipment: string;
    aiEngine: string;
    yieldAdvisor: string;
    cropSuggestion: string;
    diseaseDetection: string;
    seedQuality: string;
    xai: string;
    federated: string;
    alerts: string;
    history: string;
  };
  auth: {
    welcome: string;
    subtitle: string;
    signin: string;
    register: string;
    chooseLang: string;
    role: string;
    farmer: string;
    buyer: string;
    retailer: string;
    name: string;
    phone: string;
    email: string;
    location: string;
    acres: string;
    password: string;
    autoLocation: string;
    enterApp: string;
    createAccount: string;
    logout: string;
  };
  dashboard: {
    welcomeBack: string;
    detectedLoc: string;
    weatherPartlyCloudy: string;
    soilAnalysisDone: string;
    diseaseScanned: string;
    seedBatches: string;
    fedAccuracy: string;
    quickActions: string;
    soilTestCta: string;
    diseaseScanCta: string;
    voiceCta: string;
    waterAlertsCta: string;
    recentActivities: string;
    seasonalAlerts: string;
  };
  soil: {
    title: string;
    subtitle: string;
    uploadCard: string;
    uploadSub: string;
    analyzeBtn: string;
    extracting: string;
    resultsTitle: string;
    n: string;
    p: string;
    k: string;
    ph: string;
    oc: string;
    ec: string;
    deficiencies: string;
    fertilizerRec: string;
    downloadReport: string;
  };
  water: {
    title: string;
    subtitle: string;
    quotaToday: string;
    waterSaved: string;
    nextWatering: string;
    efficiency: string;
    smsAlertsTitle: string;
    phoneLabel: string;
    emailLabel: string;
    sendTestSms: string;
    sendTestEmail: string;
    alertScheduled: string;
    logTitle: string;
  };
  disease: {
    title: string;
    subtitle: string;
    uploadPrompt: string;
    cameraPrompt: string;
    kaggleDataset: string;
    diagnosing: string;
    detectedDisease: string;
    confidence: string;
    symptoms: string;
    remedyOrganic: string;
    chemicalTreatment: string;
  };
  seed: {
    title: string;
    subtitle: string;
    uploadPrompt: string;
    batchSize: string;
    analyzing: string;
    totalSeeds: string;
    viableSeeds: string;
    defectiveSeeds: string;
    germinationRate: string;
    grade: string;
  };
  voice: {
    title: string;
    subtitle: string;
    tapToSpeak: string;
    listening: string;
    typePrompt: string;
    askBtn: string;
    voiceFeedback: string;
    sttIlliterateNotice: string;
  };
  fed: {
    title: string;
    subtitle: string;
    learningRate: string;
    epochs: string;
    batchSize: string;
    trainLocally: string;
    trainingLocalModel: string;
    shareWeightsOnly: string;
    fedAvgConsensus: string;
    privacyNote: string;
  };
  xai: {
    title: string;
    subtitle: string;
    featureAttribution: string;
    trainingMetrics: string;
  };
  offline: {
    online: string;
    offlineMode: string;
    cachedNote: string;
  };
}

export const TRANSLATIONS: Record<SupportedLanguage, Translations> = {
  en: {
    appName: 'KrishiSahay AI',
    tagline: 'Complete AI Farm Intelligence Platform',
    nav: {
      dashboard: 'Dashboard',
      agrimarket: 'AgriMarket',
      prices: 'Price Prediction',
      marketplace: 'Direct Marketplace',
      mylistings: 'My Produce Listings',
      soilsense: 'SoilSense',
      soilUpload: 'Soil Test & Health Card',
      watersense: 'WaterSense & Alerts',
      waterOptimizer: 'Irrigation & SMS Alerts',
      kisanvaani: 'KisanVaani',
      voiceAssistant: 'Voice Assistant (STT/TTS)',
      weather: 'Weather Intelligence',
      equipment: 'Equipment Rental',
      aiEngine: 'AI Engine',
      yieldAdvisor: 'Yield Advisor',
      cropSuggestion: 'Crop Suggestion',
      diseaseDetection: 'Disease Detection (CNN)',
      seedQuality: 'Seed Quality Inspector',
      xai: 'Explainable AI (XAI)',
      federated: 'Federated Learning Hub',
      alerts: 'SMS / Email Notifications',
      history: 'History & Records',
    },
    auth: {
      welcome: 'Welcome to KrishiSahay',
      subtitle: 'Smart Agriculture for Every Farmer, Buyer & Retailer',
      signin: 'Sign In',
      register: 'Register New Account',
      chooseLang: '🌐 Choose Your Language / भाषा चुनें',
      role: 'I am a:',
      farmer: '🌾 Farmer',
      buyer: '🛒 Buyer',
      retailer: '🏪 Retailer',
      name: 'Full Name',
      phone: 'Mobile Phone Number (for SMS Alerts)',
      email: 'Email Address (for Weather & Irrigation Reports)',
      location: 'Village / District / State',
      acres: 'Land Holding (Acres)',
      password: 'Password',
      autoLocation: '📍 Detect Live GPS Location (Google)',
      enterApp: 'Sign In to KrishiSahay →',
      createAccount: 'Create Verified Account →',
      logout: 'Logout / Switch User',
    },
    dashboard: {
      welcomeBack: 'Welcome back,',
      detectedLoc: 'Location:',
      weatherPartlyCloudy: 'Partly Cloudy',
      soilAnalysisDone: 'Soil Tests Done',
      diseaseScanned: 'Foliar Scans Done',
      seedBatches: 'Seed Batches Graded',
      fedAccuracy: 'Federated Model Accuracy',
      quickActions: 'Quick Field Actions',
      soilTestCta: '🧪 Upload Soil Health Report',
      diseaseScanCta: '🔬 Scan Crop Leaf Disease',
      voiceCta: '🎙️ Speak to KisanVaani Voice Assistant',
      waterAlertsCta: '💧 Schedule Irrigation & SMS Alerts',
      recentActivities: 'Recent Field Telemetry & Logged Events',
      seasonalAlerts: 'Active Agricultural Advisories & Alerts',
    },
    soil: {
      title: 'SoilSense™ — Soil Report & Health Card Analysis',
      subtitle: 'Upload your lab soil health card or soil photo. Kaggle-trained model evaluates NPK, pH, Organic Carbon & Micronutrients.',
      uploadCard: 'Upload Soil Test Card / Soil Photo',
      uploadSub: 'Supports PNG, JPG, PDF • Extracts real NPK, pH, EC and micronutrients',
      analyzeBtn: '🧪 Analyze Soil Health & Prescribe Fertigation',
      extracting: 'Analyzing soil chemistry with Indian Soil Health Card Dataset (ICAR)...',
      resultsTitle: 'Soil Chemical Analysis & Nutrient Inventory',
      n: 'Available Nitrogen (N)',
      p: 'Available Phosphorus (P)',
      k: 'Available Potassium (K)',
      ph: 'Soil pH (Reaction)',
      oc: 'Organic Carbon (OC %)',
      ec: 'Electrical Conductivity (EC)',
      deficiencies: 'Identified Soil Deficiencies',
      fertilizerRec: 'Scientific Fertilizer & Bio-Agent Prescriptions',
      downloadReport: '📄 Download Official Soil Health Card (PDF/Print)',
    },
    water: {
      title: 'WaterSense™ — Irrigation Scheduling & Farmer SMS Alerts',
      subtitle: 'Precision irrigation planner connected to farmer mobile numbers for automated SMS & Email watering reminders.',
      quotaToday: 'Daily Water Needed',
      waterSaved: 'Groundwater Saved',
      nextWatering: 'Next Irrigation Window',
      efficiency: 'Drip System Efficiency',
      smsAlertsTitle: '📱 Farmer Mobile SMS & Email Dispatch Setup',
      phoneLabel: 'Farmer Mobile (for Instant SMS)',
      emailLabel: 'Farmer Email (for Advisory Reports)',
      sendTestSms: '📩 Send Test Watering Alert SMS Now',
      sendTestEmail: '📧 Send Detailed Irrigation Schedule to Email',
      alertScheduled: '✓ Automated SMS trigger active: Sends alert when moisture drops below 40%!',
      logTitle: 'Dispatch History & Sent Messages Log',
    },
    disease: {
      title: 'Crop Disease Detection (PlantVillage CNN Model)',
      subtitle: 'Upload a leaf photo or capture with camera. Trained on 54,000+ Kaggle PlantVillage images across 38 crop disease classes.',
      uploadPrompt: 'Upload Crop Leaf Image or Take Photo',
      cameraPrompt: 'Tap to Browse or Use Camera',
      kaggleDataset: 'Trained on Kaggle PlantVillage Benchmark (95.4% Validation Accuracy)',
      diagnosing: 'Evaluating foliar necrotic lesions & fungal spore signatures...',
      detectedDisease: 'Identified Pathogen / Disease',
      confidence: 'Diagnostic Confidence',
      symptoms: 'Observed Symptom Pathology',
      remedyOrganic: 'Organic & Bio-Control Solution',
      chemicalTreatment: 'Recommended Chemical Formulation & Dosage',
    },
    seed: {
      title: 'Seed Quality & Germination Inspector (OpenCV / CNN)',
      subtitle: 'Upload a photo of your seed tray or grain sample. Computer vision counts individual seeds, flags defects, and predicts germination %.',
      uploadPrompt: 'Upload Seed Batch Photo (Spread on white sheet)',
      batchSize: 'Batch Sample Size (Count)',
      analyzing: 'Counting seeds and classifying coat integrity...',
      totalSeeds: 'Total Seeds Counted',
      viableSeeds: 'Healthy Viable Seeds',
      defectiveSeeds: 'Broken / Discolored Seeds',
      germinationRate: 'Predicted Germination Potential',
      grade: 'Commercial Quality Grade',
    },
    voice: {
      title: 'KisanVaani Voice Assistant (Speech-to-Text for Farmers)',
      subtitle: 'Designed for illiterate farmers: Speak naturally in your native language. Speech-to-text converts voice to text and speaks back answers!',
      tapToSpeak: '🎤 Tap Microphone to Speak (Voice-to-Text)',
      listening: 'Listening to your voice... Speak now in your language',
      typePrompt: 'Or type your question here...',
      askBtn: 'Send Question',
      voiceFeedback: 'Audio speech readout automatically plays back the answers.',
      sttIlliterateNotice: 'Supports illiterate farmers with full voice in/voice out capabilities.',
    },
    fed: {
      title: 'Federated Learning Hub — Privacy-Preserving On-Device AI',
      subtitle: 'Farmer data stays on the local device! Only model gradient weights (ΔW) are shared to train the global consensus model.',
      learningRate: 'Local Learning Rate (η)',
      epochs: 'Local Training Epochs',
      batchSize: 'Local Batch Size',
      trainLocally: '⚡ Train On-Device with Local Samples',
      trainingLocalModel: 'Running on-device SGD backpropagation on local data...',
      shareWeightsOnly: '🌐 Transmit Encrypted Weight Deltas (ΔW) to Aggregator',
      fedAvgConsensus: 'FedAvg Global Consensus Model: v3.4-agri (AES-256 Protected)',
      privacyNote: '🔒 Zero Raw Data Leakage: Your field photos, soil reports, and GPS coordinates never leave your device.',
    },
    xai: {
      title: 'Explainable AI (XAI) & Model Training Metrics',
      subtitle: 'Inspect feature attributions, SHAP values, learning rate decay curves, and Kaggle training loss.',
      featureAttribution: 'Feature Importance & SHAP Values',
      trainingMetrics: 'Model Loss & Accuracy Convergence Curves',
    },
    offline: {
      online: 'Cloud Synchronized',
      offlineMode: 'Offline Mode Active (Low Connectivity)',
      cachedNote: 'Serving cached soil reports, market data, and on-device models from IndexedDB/localStorage.',
    },
  },

  hi: {
    appName: 'कृषि सहाय AI',
    tagline: 'सम्पूर्ण कृत्रिम बुद्धिमत्ता कृषि मंच',
    nav: {
      dashboard: 'डैशबोर्ड (मुख्य पृष्ठ)',
      agrimarket: 'कृषि बाज़ार',
      prices: 'मंडी भाव पूर्वानुमान',
      marketplace: 'सीधा किसान बाज़ार',
      mylistings: 'मेरी फसल लिस्टिंग',
      soilsense: 'सॉइलसेंस (मृदा जांच)',
      soilUpload: 'मृदा स्वास्थ्य कार्ड अपलोड',
      watersense: 'जल संरक्षण एवं अलर्ट',
      waterOptimizer: 'सिंचाई योजना व SMS अलर्ट',
      kisanvaani: 'किसानवाणी',
      voiceAssistant: 'आवाज सहायक (बोलकर पूछें)',
      weather: 'मौसम पूर्वानुमान',
      equipment: 'कृषि उपकरण किराया',
      aiEngine: 'AI इंजन',
      yieldAdvisor: 'उपज सलाहकार',
      cropSuggestion: 'फसल सुझाव',
      diseaseDetection: 'रोग पहचान (पत्ती स्कैन)',
      seedQuality: 'बीज गुणवत्ता जांच',
      xai: 'पारदर्शी AI (XAI)',
      federated: 'फेडरेटेड लर्निंग',
      alerts: 'SMS / ईमेल सूचनाएं',
      history: 'रिकॉर्ड व इतिहास',
    },
    auth: {
      welcome: 'कृषि सहाय में आपका स्वागत है',
      subtitle: 'भारत के प्रत्येक किसान, खरीदार और विक्रेता हेतु स्मार्ट कृषि',
      signin: 'लॉग इन करें',
      register: 'नया खाता बनाएं',
      chooseLang: '🌐 अपनी भाषा चुनें / Choose Language',
      role: 'मैं एक हूँ:',
      farmer: '🌾 किसान',
      buyer: '🛒 खरीदार / व्यापारी',
      retailer: '🏪 खुदरा विक्रेता / डीलर',
      name: 'पूरा नाम',
      phone: 'मोबाइल नंबर (SMS सिंचाई अलर्ट हेतु)',
      email: 'ईमेल पता (मौसम व फसल रिपोर्ट हेतु)',
      location: 'गाँव / जिला / राज्य',
      acres: 'खेत का क्षेत्रफल (एकड़)',
      password: 'पासवर्ड',
      autoLocation: '📍 असली GPS स्थान खोजें (Google)',
      enterApp: 'कृषि सहाय में प्रवेश करें →',
      createAccount: 'खाता तैयार करें →',
      logout: 'लॉगआउट / उपयोगकर्ता बदलें',
    },
    dashboard: {
      welcomeBack: 'स्वागत है,',
      detectedLoc: 'स्थान:',
      weatherPartlyCloudy: 'आंशिक बादल',
      soilAnalysisDone: 'मृदा जांच पूर्ण',
      diseaseScanned: 'रोग स्कैन पूर्ण',
      seedBatches: 'बीज बैच जांची गई',
      fedAccuracy: 'AI मॉडल सटीकता',
      quickActions: 'त्वरित कृषि कार्य',
      soilTestCta: '🧪 मिट्टी की रिपोर्ट अपलोड करें',
      diseaseScanCta: '🔬 पत्ती का रोग पहचानें',
      voiceCta: '🎙️ किसानवाणी से बोलकर पूछें',
      waterAlertsCta: '💧 सिंचाई अलर्ट और SMS सेट करें',
      recentActivities: 'हाल की गतिविधियां व लॉग',
      seasonalAlerts: 'सक्रिय मौसम व कृषि चेतावनियां',
    },
    soil: {
      title: 'सॉइलसेंस — मृदा स्वास्थ्य कार्ड व रिपोर्ट विश्लेषण',
      subtitle: 'प्रयोगशाला मृदा रिपोर्ट या मिट्टी का फोटो अपलोड करें। AI मॉडल NPK, pH, कार्बन और सूक्ष्म पोषक तत्वों का विश्लेषण करेगा।',
      uploadCard: 'मृदा स्वास्थ्य कार्ड / मिट्टी का फोटो अपलोड करें',
      uploadSub: 'PNG, JPG, PDF स्वीकार्य • वास्तविक NPK, pH, EC निकालता है',
      analyzeBtn: '🧪 मृदा स्वास्थ्य जांचें और खाद की मात्रा जानें',
      extracting: 'भारतीय मृदा स्वास्थ्य डेटासेट द्वारा विश्लेषण जारी...',
      resultsTitle: 'मृदा रासायनिक जांच व पोषक तत्व स्थिति',
      n: 'उपलब्ध नाइट्रोजन (N)',
      p: 'उपलब्ध फास्फोरस (P)',
      k: 'उपलब्ध पोटाश (K)',
      ph: 'मृदा pH (अम्लता/क्षारीयता)',
      oc: 'जैविक कार्बन (OC %)',
      ec: 'विद्युत चालकता (EC)',
      deficiencies: 'पहचानी गई पोषक तत्व कमियां',
      fertilizerRec: 'वैज्ञानिक खाद एवं जैविक उपाय',
      downloadReport: '📄 सरकारी प्रारूप में मृदा कार्ड डाउनलोड करें (PDF)',
    },
    water: {
      title: 'वॉटरसेंस — सिंचाई निर्धारण व किसान SMS अलर्ट',
      subtitle: 'सटीक सिंचाई प्रणाली जो किसान के मोबाइल नंबर पर स्वचालित SMS व ईमेल द्वारा पानी देने की सूचना भेजती है।',
      quotaToday: 'आज आवश्यक जल',
      waterSaved: 'बचाया गया भूजल',
      nextWatering: 'अगली सिंचाई का समय',
      efficiency: 'ड्रिप सिंचाई दक्षता',
      smsAlertsTitle: '📱 किसान मोबाइल SMS एवं ईमेल अलर्ट सेटअप',
      phoneLabel: 'किसान का मोबाइल नंबर (तत्काल SMS हेतु)',
      emailLabel: 'किसान का ईमेल (सलाहकार रिपोर्ट हेतु)',
      sendTestSms: '📩 सिंचाई अलर्ट SMS तुरंत भेजें',
      sendTestEmail: '📧 ईमेल पर सिंचाई शेड्यूल भेजें',
      alertScheduled: '✓ स्वचालित अलर्ट सक्रिय: नमी 40% से कम होने पर तुरंत SMS जाएगा!',
      logTitle: 'भेजे गए SMS संदेशों का विवरण',
    },
    disease: {
      title: 'फसल रोग पहचान (PlantVillage CNN मॉडल)',
      subtitle: 'पत्ती का फोटो लें या अपलोड करें। 54,000+ पत्तियों पर प्रशिक्षित मॉडल द्वारा 38 प्रकार के रोगों की तुरंत पहचान।',
      uploadPrompt: 'पत्ती का फोटो अपलोड करें या कैमरा चालू करें',
      cameraPrompt: 'फोटो खींचें या फाइल चुनें',
      kaggleDataset: 'Kaggle PlantVillage डेटासेट द्वारा प्रमाणित (95.4% सटीकता)',
      diagnosing: 'पत्ती पर फफूंद व रोग के लक्षणों का विश्लेषण जारी...',
      detectedDisease: 'पहचाना गया रोग / कीट',
      confidence: 'जांच सटीकता (कॉन्फिडेंस)',
      symptoms: 'रोग के प्रमुख लक्षण',
      remedyOrganic: 'जैविक एवं प्राकृतिक उपचार',
      chemicalTreatment: 'अनुशंसित रासायनिक कीटनाशक व खुराक',
    },
    seed: {
      title: 'बीज गुणवत्ता एवं अंकुरण क्षमता निरीक्षक (OpenCV / CNN)',
      subtitle: 'बीज की ट्रे या थाली का फोटो अपलोड करें। कंप्यूटर विजन तकनीक बीजों की गिनती कर खराब बीजों व अंकुरण % की गणना करती है।',
      uploadPrompt: 'सफेद पृष्ठभूमि पर फैले बीजों का फोटो अपलोड करें',
      batchSize: 'नमूना बीजों की संख्या',
      analyzing: 'बीजों की गिनती और गुणवत्ता वर्गीकरण जारी...',
      totalSeeds: 'कुल गिने गए बीज',
      viableSeeds: 'स्वस्थ अंकुरण योग्य बीज',
      defectiveSeeds: 'टूटे / रोगग्रस्त बीज',
      germinationRate: 'अनुमानित अंकुरण प्रतिशत',
      grade: 'व्यापारिक गुणवत्ता ग्रेड',
    },
    voice: {
      title: 'किसानवाणी आवाज सहायक (अनपढ़ किसान भाइयों हेतु बोलकर पूछने की सुविधा)',
      subtitle: 'अपनी स्थानीय भाषा में बोलकर सवाल पूछें। आवाज पहचान तकनीक आपके बोले शब्दों को पहचानकर बोलकर उत्तर सुनाती है!',
      tapToSpeak: '🎤 माइक दबाएं और अपनी भाषा में बोलें (आवाज से टेक्स्ट)',
      listening: 'आपकी आवाज सुनी जा रही है... अब बोलिए',
      typePrompt: 'या अपना प्रश्न यहाँ लिखें...',
      askBtn: 'प्रश्न पूछें',
      voiceFeedback: 'उत्तर आपको आवाज में बोलकर सुनाया जाएगा।',
      sttIlliterateNotice: 'अनपढ़ किसान भाइयों के लिए पूरी तरह आवाज पर आधारित तकनीक।',
    },
    fed: {
      title: 'फेडरेटेड लर्निंग — किसान डेटा की 100% गोपनीयता',
      subtitle: 'किसान का डेटा उसके फोन में ही रहता है! केवल गणितीय वजन (वेट्स) साझा होते हैं, जिससे सभी किसानों का ज्ञान एक-दूसरे से जुड़ता है।',
      learningRate: 'लर्निंग रेट (η)',
      epochs: 'प्रशिक्षण चक्र (Epochs)',
      batchSize: 'बैच साइज़',
      trainLocally: '⚡ अपने फोन पर स्थानीय डेटा से मॉडल ट्रेन करें',
      trainingLocalModel: 'स्थानीय डेटा पर बैकप्रॉपैगैशन प्रशिक्षण जारी...',
      shareWeightsOnly: '🌐 केवल सुरक्षित मॉडल वेट्स (ΔW) सर्वर पर भेजें',
      fedAvgConsensus: 'ग्लोबल सर्वसम्मति मॉडल: v3.4-agri (AES-256 सुरक्षित)',
      privacyNote: '🔒 डेटा की पूर्ण सुरक्षा: आपके खेत के फोटो और व्यक्तिगत जानकारी कभी बाहर नहीं जाते।',
    },
    xai: {
      title: 'पारदर्शी AI (XAI) एवं मॉडल मेट्रिक्स',
      subtitle: 'मॉडल द्वारा लिए गए निर्णयों का कारण (SHAP मान), लर्निंग रेट ग्राफ और सटीकता की पूरी पारदर्शिता।',
      featureAttribution: 'फीचर महत्व एवं SHAP मान',
      trainingMetrics: 'मॉडल लॉस व एक्यूरेसी ग्राफ',
    },
    offline: {
      online: 'क्लाउड से जुड़ा हुआ',
      offlineMode: 'ऑफलाइन मोड सक्रिय (कम इंटरनेट)',
      cachedNote: 'कैश की गई मृदा रिपोर्ट और मॉडल बिना इंटरनेट के फोन में चल रहे हैं।',
    },
  },

  te: {
    appName: 'క్రిషీ సహాయ్ AI',
    tagline: 'రైతు సమగ్ర కృత్రిమ మేధస్సు వేదిక',
    nav: {
      dashboard: 'డ్యాష్‌బోర్డ్ (హోమ్)',
      agrimarket: 'వ్యవసాయ మార్కెట్',
      prices: 'మార్కెట్ ధర అంచనా',
      marketplace: 'రైతు ప్రత్యక్ష మార్కెట్',
      mylistings: 'నా పంట జాబితా',
      soilsense: 'సాయిల్ సెన్స్ (నేల పరీక్ష)',
      soilUpload: 'సాయిల్ హెల్త్ కార్డు అప్‌లోడ్',
      watersense: 'నీటి యాజమాన్యం & అలర్ట్స్',
      waterOptimizer: 'నీటి తడులు & SMS అలర్ట్స్',
      kisanvaani: 'కిసాన్ వాణి (వాయిస్)',
      voiceAssistant: 'వాయిస్ అసిస్టెంట్ (మాట్లాడండి)',
      weather: 'వాతావరణం',
      equipment: 'వ్యవసాయ పరికరాల అద్దె',
      aiEngine: 'AI ఇంజిన్',
      yieldAdvisor: 'దిగుబడి సలహాదారు',
      cropSuggestion: 'పంట సూచనలు',
      diseaseDetection: 'తెగుళ్ల గుర్తింపు (ఆకు స్కాన్)',
      seedQuality: 'విత్తన నాణ్యత తనిఖీ',
      xai: 'పారదర్శక AI (XAI)',
      federated: 'ఫెడరేటెడ్ లెర్నింగ్',
      alerts: 'SMS / ఈమెయిల్ అలర్ట్స్',
      history: 'చరిత్ర & రికార్డులు',
    },
    auth: {
      welcome: 'క్రిషీ సహాయ్ కి స్వాగతం',
      subtitle: 'ప్రతి రైతు, కొనుగోలుదారు మరియు వ్యాపారికి స్మార్ట్ వ్యవసాయం',
      signin: 'సైన్ ఇన్ (లాగిన్)',
      register: 'కొత్త ఖాతా నమోదు',
      chooseLang: '🌐 మీ భాషను ఎంచుకోండి / Choose Language',
      role: 'నేను ఒక:',
      farmer: '🌾 రైతు',
      buyer: '🛒 కొనుగోలుదారు',
      retailer: '🏪 డీలర్ / వ్యాపారి',
      name: 'పూర్తి పేరు',
      phone: 'మొబైల్ నంబర్ (SMS తడుల అలర్ట్స్ కోసం)',
      email: 'ఈమెయిల్ చిరునామా',
      location: 'గ్రామం / మండలం / జిల్లా',
      acres: 'పొలం విస్తీర్ణం (ఎకరాలు)',
      password: 'పాస్‌వర్డ్',
      autoLocation: '📍 అసలైన GPS స్థానాన్ని గుర్తించండి',
      enterApp: 'క్రిషీ సహాయ్ లోకి ప్రవేశించండి →',
      createAccount: 'ఖాతా సృష్టించండి →',
      logout: 'లాగౌట్ / యూజర్ మార్చండి',
    },
    dashboard: {
      welcomeBack: 'నమస్కారం,',
      detectedLoc: 'స్థానం:',
      weatherPartlyCloudy: 'పాక్షిక మేఘావృతం',
      soilAnalysisDone: 'నేల పరీక్షలు పూర్తయ్యాయి',
      diseaseScanned: 'తెగుళ్ల స్కాన్లు',
      seedBatches: 'విత్తన బ్యాచ్‌లు',
      fedAccuracy: 'AI నమూనా ఖచ్చితత్వం',
      quickActions: 'త్వరిత వ్యవసాయ పనులు',
      soilTestCta: '🧪 సాయిల్ హెల్త్ రిపోర్ట్ అప్‌లోడ్ చేయండి',
      diseaseScanCta: '🔬 ఆకు తెగులును స్కాన్ చేయండి',
      voiceCta: '🎙️ కిసాన్ వాణితో మాట్లాడండి',
      waterAlertsCta: '💧 నీటి తడుల SMS అలర్ట్స్ సెట్ చేయండి',
      recentActivities: 'ఇటీవలి వ్యవసాయ కార్యకలాపాలు',
      seasonalAlerts: 'వాతావరణ & తెగుళ్ల హెచ్చరికలు',
    },
    soil: {
      title: 'సాయిల్ సెన్స్ — సాయిల్ హెల్త్ కార్డు విశ్లేషణ',
      subtitle: 'ల్యాబ్ రిపోర్ట్ లేదా నేల ఫోటోను అప్‌లోడ్ చేయండి. AI ఇంజిన్ నత్రజని, భాస్వరం, పొటాష్, pH లను విశ్లేషిస్తుంది.',
      uploadCard: 'సాయిల్ హెల్త్ కార్డు / నేల ఫోటో అప్‌లోడ్ చేయండి',
      uploadSub: 'PNG, JPG, PDF ఫార్మాట్లలో అప్‌లోడ్ చేయవచ్చు',
      analyzeBtn: '🧪 నేల సారాన్ని విశ్లేషించి ఎరువుల మోతాదు తెలుసుకోండి',
      extracting: 'భారతీయ సాయిల్ హెల్త్ డేటాసెట్‌తో విశ్లేషణ జరుగుతోంది...',
      resultsTitle: 'నేల రసాయన పరీక్ష ఫలితాలు',
      n: 'లభ్యమయ్యే నత్రజని (N)',
      p: 'లభ్యమయ్యే భాస్వరం (P)',
      k: 'లభ్యమయ్యే పొటాష్ (K)',
      ph: 'నేల pH (ఉదజని సూచిక)',
      oc: 'సేంద్రీయ కర్బనం (OC %)',
      ec: 'విద్యుత్ వాహకత (EC)',
      deficiencies: 'నేలలో గుర్తించిన లోపాలు',
      fertilizerRec: 'శాస్త్రీయ ఎరువుల యాజమాన్య సిఫార్సులు',
      downloadReport: '📄 సాయిల్ హెల్త్ కార్డు డౌన్‌లోడ్ చేయండి (PDF)',
    },
    water: {
      title: 'వాటర్ సెన్స్ — నీటి తడుల షెడ్యూల్ & రైతు SMS అలర్ట్స్',
      subtitle: 'రైతు మొబైల్ నంబరుకు నేరుగా SMS మరియు ఈమెయిల్ ద్వారా పంటకు నీరు పెట్టే సమయాలను తెలియజేసే వ్యవస్థ.',
      quotaToday: 'నేడు అవసరమైన నీరు',
      waterSaved: 'ఆదా చేసిన భూగర్భ జలాలు',
      nextWatering: 'తదుపరి తడి పెట్టవలసిన సమయం',
      efficiency: 'డ్రిప్ పద్ధతి సమర్థత',
      smsAlertsTitle: '📱 రైతు మొబైల్ SMS & ఈమెయిల్ అలర్ట్స్ సెటప్',
      phoneLabel: 'రైతు మొబైల్ నంబర్ (వెంటనే SMS కోసం)',
      emailLabel: 'రైతు ఈమెయిల్',
      sendTestSms: '📩 టెస్ట్ నీటి అలర్ట్ SMS ఇప్పుడే పంపండి',
      sendTestEmail: '📧 ఈమెయిల్‌కు వివరాలు పంపండి',
      alertScheduled: '✓ ఆటోమేటిక్ అలర్ట్ ఆన్ అయింది: నేలలో తేమ 40% కన్నా తగ్గితే SMS వస్తుంది!',
      logTitle: 'పంపిన SMS సందేశాల వివరాలు',
    },
    disease: {
      title: 'పంట తెగుళ్ల గుర్తింపు (PlantVillage CNN మోడల్)',
      subtitle: 'ఆకు ఫోటో తీయండి లేదా అప్‌లోడ్ చేయండి. 54,000 పైగా నమూనాలతో శిక్షణ పొందిన AI తెగులును తక్షణమే గుర్తిస్తుంది.',
      uploadPrompt: 'ఆకు ఫోటోను అప్‌లోడ్ చేయండి లేదా కెమెరా ఆన్ చేయండి',
      cameraPrompt: 'ఫోటో తీయడానికి తాకండి',
      kaggleDataset: 'Kaggle PlantVillage డేటాసెట్‌తో శిక్షణ పొందిన మోడల్ (95.4% ఖచ్చితత్వం)',
      diagnosing: 'ఆకు మచ్చలు, శిలీంధ్రాల లక్షణాలను విశ్లేషిస్తోంది...',
      detectedDisease: 'గుర్తించిన తెగులు / వ్యాధి',
      confidence: 'నిర్ధారణ ఖచ్చితత్వం',
      symptoms: 'తెగులు ప్రధాన లక్షణాలు',
      remedyOrganic: 'సేంద్రీయ & జీవ నియంత్రణ మందులు',
      chemicalTreatment: 'రసాయన మందులు & పిచికారీ మోతాదు',
    },
    seed: {
      title: 'విత్తన నాణ్యత & మొలక శాతం తనిఖీ (OpenCV / CNN)',
      subtitle: 'విత్తనాల ఫోటో అప్‌లోడ్ చేయండి. కంప్యూటర్ విజన్ విత్తనాలను లెక్కించి, దెబ్బతిన్న విత్తనాలను మరియు మొలక శాతాన్ని గణిస్తుంది.',
      uploadPrompt: 'తెల్లటి కాగితంపై పరిచిన విత్తనాల ఫోటో అప్‌లోడ్ చేయండి',
      batchSize: 'విత్తనాల నమూనా సంఖ్య',
      analyzing: 'విత్తనాలను లెక్కించి నాణ్యతను పరీక్షిస్తోంది...',
      totalSeeds: 'మొత్తం లెక్కించిన విత్తనాలు',
      viableSeeds: 'ఆరోగ్యకరమైన మొలకెత్తే విత్తనాలు',
      defectiveSeeds: 'దెబ్బతిన్న / రంగు మారిన విత్తనాలు',
      germinationRate: 'అంచనా వేసిన మొలక శాతం',
      grade: 'నాణ్యత గ్రేడ్',
    },
    voice: {
      title: 'కిసాన్ వాణి (చదువురాని రైతు సోదరుల కోసం మాట్లాడి అడిగే సదుపాయం)',
      subtitle: 'మీ స్వభాషలో నేరుగా మాట్లాడండి. స్పీచ్-టు-టెక్స్ట్ మీ మాటలను అర్థం చేసుకుని, సమాధానాన్ని వాయిస్‌లో తిరిగి వినిపిస్తుంది!',
      tapToSpeak: '🎤 మైక్ నొక్కి మాట్లాడండి (నోటి మాట ద్వారా)',
      listening: 'మీ మాటలను వింటోంది... మాట్లాడండి',
      typePrompt: 'లేదా ఇక్కడ టైప్ చేయండి...',
      askBtn: 'ప్రశ్నించండి',
      voiceFeedback: 'సమాధానం మీకు మాటల రూపంలో తిరిగి వినిపించబడుతుంది.',
      sttIlliterateNotice: 'చదువురాని రైతులకు పూర్తిస్థాయి వాయిస్ సహాయం అందుబాటులో ఉంది.',
    },
    fed: {
      title: 'ఫెడరేటెడ్ లెర్నింగ్ — రైతు డేటా 100% గోప్యత',
      subtitle: 'రైతు ఫోటోలు లేదా డేటా ఫోన్ దాటి బయటకు వెళ్ళవు! కేవలం గణిత వెయిట్స్ (ΔW) మాత్రమే షేర్ చేయబడతాయి.',
      learningRate: 'లెర్నింగ్ రేట్ (η)',
      epochs: 'ట్రైనింగ్ ఎపోక్స్',
      batchSize: 'బ్యాచ్ సైజు',
      trainLocally: '⚡ మీ ఫోన్‌లోనే స్థానిక డేటాతో ట్రైన్ చేయండి',
      trainingLocalModel: 'ఫోన్‌లో స్థానిక డేటాతో శిక్షణ జరుగుతోంది...',
      shareWeightsOnly: '🌐 భద్రపరచిన మోడల్ వెయిట్స్ (ΔW) మాత్రమే సర్వర్‌కు పంపండి',
      fedAvgConsensus: 'గ్లోబల్ కన్సెన్సస్ మోడల్: v3.4-agri (AES-256 భద్రత)',
      privacyNote: '🔒 పూర్తి గోప్యత: మీ వ్యక్తిగత సమాచారం ఎప్పటికీ సురక్షితంగా ఉంటుంది.',
    },
    xai: {
      title: 'పారదర్శక AI (XAI) & శిక్షణ గణాంకాలు',
      subtitle: 'AI నిర్ణయాల వెనుక ఉన్న కారణాలు (SHAP విలువలు), లెర్నింగ్ రేట్ గ్రాఫ్‌లు మరియు ఖచ్చితత్వ వివరాలు.',
      featureAttribution: 'ఫీచర్ ప్రాముఖ్యత & SHAP విలువలు',
      trainingMetrics: 'మోడల్ లాస్ & ఖచ్చితత్వ రేఖలు',
    },
    offline: {
      online: 'ఆన్‌లైన్ కనెక్ట్ అయింది',
      offlineMode: 'ఆఫ్‌లైన్ మోడ్ (తక్కువ సిగ్నల్)',
      cachedNote: 'గతంలో దాచిన నేల రిపోర్టులు మరియు మోడల్స్ ఇంటర్నెట్ లేకపోయినా పనిచేస్తాయి.',
    },
  },

  ta: {
    appName: 'கிஷிசஹாய் AI',
    tagline: 'முழுமையான விவசாய செயற்கை நுண்ணறிவு தளம்',
    nav: {
      dashboard: 'முகப்பு பலகை',
      agrimarket: 'விவசாய சந்தை',
      prices: 'விலை கணிப்பு',
      marketplace: 'நேரடி சந்தை',
      mylistings: 'எனது உற்பத்தி',
      soilsense: 'மண் பரிசோதனை',
      soilUpload: 'மண் அட்டை பதிவேற்றம்',
      watersense: 'நீர்ப்பாசன எச்சரிக்கை',
      waterOptimizer: 'பாசனம் & SMS எச்சரிக்கை',
      kisanvaani: 'கிசான் வாணி (குரல்)',
      voiceAssistant: 'குரல் உதவியாளர்',
      weather: 'வானிலை',
      equipment: 'கருவிகள் வாடகை',
      aiEngine: 'AI இயந்திரம்',
      yieldAdvisor: 'மகசூல் ஆலோசகர்',
      cropSuggestion: 'பயிர் பரிந்துரை',
      diseaseDetection: 'நோய் கண்டறிதல்',
      seedQuality: 'விதை தரம்',
      xai: 'விளக்கக்கூடிய AI',
      federated: 'கூட்டு கற்றல்',
      alerts: 'SMS / மின்னஞ்சல்',
      history: 'பதிவுகள்',
    },
    auth: {
      welcome: 'கிஷிசஹாய்க்கு நல்வரவு',
      subtitle: 'விவசாயிகளுக்கான நவீன செயற்கை நுண்ணறிவு தளம்',
      signin: 'உள்நுழைய',
      register: 'புதிய கணக்கு',
      chooseLang: '🌐 மொழியைத் தேர்வு செய்க',
      role: 'நான் ஒரு:',
      farmer: '🌾 விவசாயி',
      buyer: '🛒 வாங்குபவர்',
      retailer: '🏪 சில்லறை விற்பனையாளர்',
      name: 'முழு பெயர்',
      phone: 'தொலைபேசி எண்',
      email: 'மின்னஞ்சல்',
      location: 'கிராமம் / மாவட்டம்',
      acres: 'நில அளவு (ஏக்கர்)',
      password: 'கடவுச்சொல்',
      autoLocation: '📍 நேரடி இருப்பிடம்',
      enterApp: 'உள்நுழைக →',
      createAccount: 'கணக்கை உருவாக்கு →',
      logout: 'வெளியேறு',
    },
    dashboard: {
      welcomeBack: 'வணக்கம்,',
      detectedLoc: 'இடம்:',
      weatherPartlyCloudy: 'பகுதி மேகமூட்டம்',
      soilAnalysisDone: 'மண் பரிசோதனைகள்',
      diseaseScanned: 'நோய் ஸ்கேன்கள்',
      seedBatches: 'விதை தொகுப்புகள்',
      fedAccuracy: 'துல்லியம்',
      quickActions: 'விரைவு செயல்பாடுகள்',
      soilTestCta: '🧪 மண் அறிக்கையை பதிவேற்றுக',
      diseaseScanCta: '🔬 இலை நோயை ஸ்கேன் செய்க',
      voiceCta: '🎙️ கிசான் வாணியிடம் பேசுங்கள்',
      waterAlertsCta: '💧 பாசன SMS எச்சரிக்கையை அமைக்கவும்',
      recentActivities: 'சமீபத்திய நிகழ்வுகள்',
      seasonalAlerts: 'பருவகால எச்சரிக்கைகள்',
    },
    soil: {
      title: 'மண் பரிசோதனை & பகுப்பாய்வு',
      subtitle: 'மண் பரிசோதனை அறிக்கை அல்லது புகைப்படத்தை பதிவேற்றி NPK மற்றும் ஊட்டச்சத்து நிலையை அறியவும்.',
      uploadCard: 'மண் அட்டை / புகைப்படம் பதிவேற்றுக',
      uploadSub: 'PNG, JPG, PDF அனுமதிக்கப்படுகிறது',
      analyzeBtn: '🧪 மண் வளத்தை பகுப்பாய்வு செய்க',
      extracting: 'மண் தரவுத்தளத்துடன் பகுப்பாய்வு செய்யப்படுகிறது...',
      resultsTitle: 'மண் ஊட்டச்சத்து முடிவுகள்',
      n: 'நைட்ரஜன் (N)',
      p: 'பாஸ்பரஸ் (P)',
      k: 'பொட்டாசியம் (K)',
      ph: 'மண் pH',
      oc: 'கரிம கார்பன் (%)',
      ec: 'மின் கடத்துத்திறன் (EC)',
      deficiencies: 'கண்டறியப்பட்ட குறைபாடுகள்',
      fertilizerRec: 'உர பரிந்துரைகள்',
      downloadReport: '📄 அறிக்கையை பதிவிறக்குக (PDF)',
    },
    water: {
      title: 'நீர்ப்பாசனம் & SMS எச்சரிக்கை',
      subtitle: 'பயிருக்கு நீர் பாய்ச்ச வேண்டிய நேரங்களை தானியங்கி SMS மூலம் விவசாயியின் கைபேசிக்கு அனுப்பும் வசதி.',
      quotaToday: 'இன்றைய நீர் தேவை',
      waterSaved: 'சேமிக்கப்பட்ட நீர்',
      nextWatering: 'அடுத்த பாசன நேரம்',
      efficiency: 'சொட்டு நீர் திறன்',
      smsAlertsTitle: '📱 SMS & மின்னஞ்சல் எச்சரிக்கை அமைப்பு',
      phoneLabel: 'விவசாயி தொலைபேசி எண்',
      emailLabel: 'மின்னஞ்சல் முகவரி',
      sendTestSms: '📩 சோதனை SMS அனுப்புக',
      sendTestEmail: '📧 மின்னஞ்சல் அட்டவணையை அனுப்புக',
      alertScheduled: '✓ தானியங்கி எச்சரிக்கை தயார்: ஈரம் குறையும் போது SMS வரும்!',
      logTitle: 'அனுப்பப்பட்ட SMS விவரம்',
    },
    disease: {
      title: 'பயிர் நோய் கண்டறிதல் (CNN)',
      subtitle: 'இலை புகைப்படத்தை பதிவேற்றி உடனடியாக நோயை கண்டறிந்து சிகிச்சை முறைகளை அறியவும்.',
      uploadPrompt: 'இலை படத்தை பதிவேற்றுக',
      cameraPrompt: 'கேமராவை பயன்படுத்துக',
      kaggleDataset: 'Kaggle PlantVillage தரவுத்தளத்தால் சான்றளிக்கப்பட்டது',
      diagnosing: 'பகுப்பாய்வு செய்யப்படுகிறது...',
      detectedDisease: 'கண்டறியப்பட்ட நோய்',
      confidence: 'துல்லியம்',
      symptoms: 'அறிகுறிகள்',
      remedyOrganic: 'இயற்கை மருந்து',
      chemicalTreatment: 'வேதியியல் மருந்து',
    },
    seed: {
      title: 'விதை தரம் & முளைப்புத்திறன் ஆய்வு',
      subtitle: 'விதை புகைப்படத்தை பதிவேற்றி முளைப்புத்திறன் சதவீதத்தை அறியவும்.',
      uploadPrompt: 'விதை படத்தை பதிவேற்றுக',
      batchSize: 'விதை எண்ணிக்கை',
      analyzing: 'ஆய்வு செய்யப்படுகிறது...',
      totalSeeds: 'மொத்த விதைகள்',
      viableSeeds: 'ஆரோக்கியமான விதைகள்',
      defectiveSeeds: 'பாதிக்கப்பட்ட விதைகள்',
      germinationRate: 'முளைப்புத்திறன் %',
      grade: 'தர வகை',
    },
    voice: {
      title: 'கிசான் வாணி (குரல் வழி விவசாய உதவி)',
      subtitle: 'எழுத படிக்க தெரியாத விவசாயிகளுக்காக குரல் வழி சேவை. தமிழில் பேசுங்கள், பதிலையும் குரலில் கேளுங்கள்!',
      tapToSpeak: '🎤 மைக்கை அழுத்தி தமிழில் பேசுங்கள்',
      listening: 'கேட்கிறது... பேசுங்கள்',
      typePrompt: 'அல்லது தட்டச்சு செய்க...',
      askBtn: 'கேட்க',
      voiceFeedback: 'பதில் குரல் வடிவில் ஒலிக்கும்.',
      sttIlliterateNotice: 'முழுமையான குரல் வழி சேவை.',
    },
    fed: {
      title: 'கூட்டு கற்றல் (Federated Learning)',
      subtitle: 'உங்கள் தரவு உங்கள் போனிலேயே இருக்கும். மாடல் எடைகள் மட்டுமே பகிரப்படும்.',
      learningRate: 'கற்றல் வீதம் (η)',
      epochs: 'சுற்றுகள் (Epochs)',
      batchSize: 'தொகுதி அளவு',
      trainLocally: '⚡ உள்ளூர் மாதிரியை பயிற்றுவிக்குக',
      trainingLocalModel: 'பயிற்சி செய்யப்படுகிறது...',
      shareWeightsOnly: '🌐 எடைகளை மட்டும் அனுப்புக (ΔW)',
      fedAvgConsensus: 'உலகளாவிய மாதிரி: v3.4-agri',
      privacyNote: '🔒 முழுமையான பாதுகாப்பு மற்றும் தனியுரிமை.',
    },
    xai: {
      title: 'விளக்கக்கூடிய AI (XAI)',
      subtitle: 'மாதிரியின் முடிவுகளுக்கான காரணங்கள் மற்றும் வரைபடங்கள்.',
      featureAttribution: 'காரணிகளின் முக்கியத்துவம்',
      trainingMetrics: 'துல்லிய வரைபடம்',
    },
    offline: {
      online: 'இணையத்துடன் இணைக்கப்பட்டது',
      offlineMode: 'ஆஃப்லைன் முறை (இணையம் இல்லை)',
      cachedNote: 'சேமிக்கப்பட்ட தரவுகள் இணையம் இன்றியும் வேலை செய்யும்.',
    },
  },

  mr: {
    appName: 'कृषिसहाय AI',
    tagline: 'संपूर्ण कृत्रिम बुद्धिमत्ता शेती व्यासपीठ',
    nav: {
      dashboard: 'डॅशबोर्ड',
      agrimarket: 'कृषी बाजार',
      prices: 'बाजारभाव अंदाज',
      marketplace: 'थेट शेतकरी बाजार',
      mylistings: 'माझी शेतमाल यादी',
      soilsense: 'सॉइलसेन्स (माती तपासणी)',
      soilUpload: 'मृदा आरोग्य पत्रिका अपलोड',
      watersense: 'पाणी नियोजन व अलर्ट',
      waterOptimizer: 'सिंचन व SMS अलर्ट',
      kisanvaani: 'किसानवाणी (आवाज)',
      voiceAssistant: 'व्हॉइस असिस्टंट (बोलून विचारा)',
      weather: 'हवामान अंदाज',
      equipment: 'कृषी अवजारे भाडेतत्त्वावर',
      aiEngine: 'AI इंजिन',
      yieldAdvisor: 'उत्पादन सल्लागार',
      cropSuggestion: 'पीक शिफारस',
      diseaseDetection: 'रोग निदान (पान स्कॅन)',
      seedQuality: 'बियाणे गुणवत्ता तपासणी',
      xai: 'पारदर्शक AI (XAI)',
      federated: 'फेडरेटेड लर्निंग',
      alerts: 'SMS / ईमेल सूचना',
      history: 'इतिहास व नोंदी',
    },
    auth: {
      welcome: 'कृषिसहाय मध्ये आपले स्वागत आहे',
      subtitle: 'शेतकरी, खरेदीदार व विक्रेत्यांसाठी आधुनिक शेती तंत्रज्ञान',
      signin: 'लॉग इन करा',
      register: 'नवीन खाते नोंदणी',
      chooseLang: '🌐 भाषा निवडा / Choose Language',
      role: 'मी एक आहे:',
      farmer: '🌾 शेतकरी',
      buyer: '🛒 खरेदीदार / व्यापारी',
      retailer: '🏪 किरकोळ विक्रेता',
      name: 'पूर्ण नाव',
      phone: 'मोबाईल नंबर (SMS अलर्टसाठी)',
      email: 'ईमेल पत्ता',
      location: 'गाव / तालुका / जिल्हा',
      acres: 'जमीन (एकर)',
      password: 'पासवर्ड',
      autoLocation: '📍 थेट GPS स्थान शोधा',
      enterApp: 'कृषिसहाय मध्ये जा →',
      createAccount: 'खाते तयार करा →',
      logout: 'लॉगआउट / वापरकर्ता बदला',
    },
    dashboard: {
      welcomeBack: 'स्वागत आहे,',
      detectedLoc: 'स्थान:',
      weatherPartlyCloudy: 'अंशतः ढगाळ',
      soilAnalysisDone: 'माती परीक्षणे पूर्ण',
      diseaseScanned: 'रोग स्कॅनिंग',
      seedBatches: 'बियाणे बॅचेस',
      fedAccuracy: 'AI अचूकता',
      quickActions: 'त्वरित कृषी कृती',
      soilTestCta: '🧪 माती परीक्षण अहवाल अपलोड करा',
      diseaseScanCta: '🔬 पानांवरील रोग ओळखा',
      voiceCta: '🎙️ किसानवाणीशी बोलून विचारा',
      waterAlertsCta: '💧 पाणी देण्याचे SMS अलर्ट सेट करा',
      recentActivities: 'अलीकडील नोंदी व कृती',
      seasonalAlerts: 'हवामान व रोग चेतावणी',
    },
    soil: {
      title: 'सॉइलसेन्स — मृदा आरोग्य पत्रिका व माती विश्लेषण',
      subtitle: 'माती अहवाल किंवा मातीचा फोटो अपलोड करा. NPK, pH आणि सूक्ष्म अन्नद्रव्यांची संपूर्ण माहिती मिळवा.',
      uploadCard: 'मृदा पत्रिका / मातीचा फोटो अपलोड करा',
      uploadSub: 'PNG, JPG, PDF स्वीकार्य',
      analyzeBtn: '🧪 मातीचे आरोग्य तपासा व खत शिफारस मिळवा',
      extracting: 'माती आरोग्य डेटासेटद्वारे विश्लेषण सुरू आहे...',
      resultsTitle: 'मातीतील रासायनिक घटक व पोषकद्रव्ये',
      n: 'उपलब्ध नत्र (N)',
      p: 'उपलब्ध स्फुरद (P)',
      k: 'उपलब्ध पालाश (K)',
      ph: 'सामू (pH)',
      oc: 'सेंद्रिय कर्ब (OC %)',
      ec: 'विद्युत वाहकता (EC)',
      deficiencies: 'आढळलेली कमतरता',
      fertilizerRec: 'रासायनिक व सेंद्रिय खतांची शिफारस',
      downloadReport: '📄 मृदा आरोग्य पत्रिका डाऊनलोड करा (PDF)',
    },
    water: {
      title: 'वॉटरसेन्स — सिंचन नियोजन व शेतकरी SMS अलर्ट',
      subtitle: 'पिकाला पाणी देण्याची वेळ थेट शेतकऱ्याच्या मोबाईलवर SMS आणि ईमेलद्वारे कळवणारी प्रणाली.',
      quotaToday: 'आज आवश्यक पाणी',
      waterSaved: 'वाचवलेले पाणी',
      nextWatering: 'पुढील पाण्याची वेळ',
      efficiency: 'ठिबक सिंचन कार्यक्षमता',
      smsAlertsTitle: '📱 शेतकरी मोबाईल SMS व ईमेल सूचना',
      phoneLabel: 'मोबाईल नंबर (तात्काळ SMS साठी)',
      emailLabel: 'ईमेल पत्ता',
      sendTestSms: '📩 चाचणी SMS आत्ताच पाठवा',
      sendTestEmail: '📧 ईमेलवर वेळापत्रक पाठवा',
      alertScheduled: '✓ स्वयंचलित अलर्ट सुरू: जमिनीत ओलावा कमी झाल्यावर SMS येईल!',
      logTitle: 'पाठवलेल्या SMS चा तपशील',
    },
    disease: {
      title: 'पीक रोग ओळख (PlantVillage CNN मॉडेल)',
      subtitle: 'पानाचा फोटो अपलोड करा. 54,000+ पानांवर प्रशिक्षित मॉडेल रोगाची तात्काळ ओळख पटवते.',
      uploadPrompt: 'पानाचा फोटो अपलोड करा किंवा कॅमेरा सुरू करा',
      cameraPrompt: 'फोटो काढा किंवा निवडा',
      kaggleDataset: 'Kaggle PlantVillage डेटासेटद्वारे प्रमाणित',
      diagnosing: 'रोगाच्या लक्षणांचे विश्लेषण सुरू आहे...',
      detectedDisease: 'ओळखलेला रोग / कीड',
      confidence: 'अचूकता टक्केवारी',
      symptoms: 'रोगाची मुख्य लक्षणे',
      remedyOrganic: 'सेंद्रिय व जैविक उपाय',
      chemicalTreatment: 'रासायनिक औषधे व फवारणी प्रमाण',
    },
    seed: {
      title: 'बियाणे प्रत व उगवण क्षमता तपासणी',
      subtitle: 'बियाण्यांचा फोटो अपलोड करा. कॉम्प्युटर व्हिजनद्वारे निरोगी आणि खराब बियाणे मोजून उगवण % सांगते.',
      uploadPrompt: 'पांढऱ्या कागदावर पसरलेल्या बियाण्यांचा फोटो अपलोड करा',
      batchSize: 'बियाण्यांची संख्या',
      analyzing: 'बियाणे तपासणी सुरू आहे...',
      totalSeeds: 'एकूण मोजलेले बियाणे',
      viableSeeds: 'उगवणक्षम निरोगी बियाणे',
      defectiveSeeds: 'कीड लागलेले / तुटलेले बियाणे',
      germinationRate: 'अंदाजित उगवण क्षमता %',
      grade: 'गुणवत्ता प्रतवारी',
    },
    voice: {
      title: 'किसानवाणी व्हॉइस असिस्टंट (अशिक्षित शेतकरी बांधवांसाठी बोलून विचारण्याची सुविधा)',
      subtitle: 'आपल्या मातृभाषेत थेट बोला. सिस्टीम तुमचे बोलणे ऐकून बोलूनच उत्तर समजावून सांगते!',
      tapToSpeak: '🎤 माईक दाबा आणि मराठीत बोला',
      listening: 'ऐकत आहे... बोला',
      typePrompt: 'किंवा येथे प्रश्न टाईप करा...',
      askBtn: 'विचारा',
      voiceFeedback: 'उत्तर आवाजात ऐकवले जाईल.',
      sttIlliterateNotice: 'अशिक्षित शेतकऱ्यांसाठी संपूर्ण आवाज आधारित सुविधा.',
    },
    fed: {
      title: 'फेडरेटेड लर्निंग — शेतकऱ्यांच्या डेटाची १००% गुप्तता',
      subtitle: 'तुमचा डेटा तुमच्या फोनमध्येच सुरक्षित राहतो! फक्त मॉडेल वेट्स (ΔW) एकत्र करून AI शिकते.',
      learningRate: 'लर्निंग रेट (η)',
      epochs: 'सायकल्स (Epochs)',
      batchSize: 'बॅच साईझ',
      trainLocally: '⚡ फोनवरच स्थानिक डेटाने मॉडेल ट्रेन करा',
      trainingLocalModel: 'स्थानिक डेटावर प्रशिक्षण सुरू आहे...',
      shareWeightsOnly: '🌐 फक्त सुरक्षित मॉडेल वेट्स (ΔW) पाठवा',
      fedAvgConsensus: 'ग्लोबल मॉडेल: v3.4-agri (AES-256 सुरक्षित)',
      privacyNote: '🔒 पूर्ण गोपनीयता: तुमचे फोटो आणि माहिती कधीही बाहेर जात नाही.',
    },
    xai: {
      title: 'पारदर्शक AI (XAI) व मॉडेल्स',
      subtitle: 'AI ने निर्णय का घेतला याची कारणे (SHAP व्हॅल्यूज) आणि अचूकतेचे आलेख.',
      featureAttribution: 'घटकांचे महत्त्व व SHAP व्हॅल्यूज',
      trainingMetrics: 'प्रशिक्षण आलेख व अचूकता',
    },
    offline: {
      online: 'इंटरनेट सुरू आहे',
      offlineMode: 'ऑफलाइन मोड सुरू (इंटरनेट नसतानाही चालू)',
      cachedNote: 'फोनमध्ये सेव्ह असलेला डेटा इंटरनेट नसतानाही काम करतो.',
    },
  },
};

export function getTranslation(lang: string = 'en'): Translations {
  const code = (lang === 'hi' || lang === 'हिन्दी') ? 'hi' :
               (lang === 'te' || lang === 'తెలుగు') ? 'te' :
               (lang === 'ta' || lang === 'தமிழ்') ? 'ta' :
               (lang === 'mr' || lang === 'मराठी') ? 'mr' : 'en';
  return TRANSLATIONS[code] || TRANSLATIONS.en;
}
