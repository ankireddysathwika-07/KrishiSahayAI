/**
 * KrishiSahay Offline Local Storage & IndexedDB Cache Layer
 * Designed for rural low-connectivity agricultural environments.
 */

export interface UserAccount {
  id: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  role: 'Farmer' | 'Buyer';
  landAcres: number;
  password?: string;
  registeredAt: string;
  optimalMoistureThreshold?: number; // Optimal soil moisture threshold in % (default 45%)
  facePhotoUrl?: string; // Captured biometric photo snapshot (data URL)
  faceEmbedding?: number[]; // 64-dimensional feature embedding vector for face recognition
}

export interface SoilAnalysisReport {
  id: string;
  farmerId: string;
  farmerName: string;
  location: string;
  uploadedAt: string;
  fileName: string;
  sampleType: 'Soil Health Card' | 'Lab Soil Test' | 'Soil Core Photo';
  chemistry: {
    nitrogenKgPerHa: number;
    phosphorusKgPerHa: number;
    potassiumKgPerHa: number;
    ph: number;
    organicCarbonPercent: number;
    electricalConductivityDsM: number;
    zincPpm: number;
    ironPpm: number;
    boronPpm: number;
  };
  deficiencies: string[];
  fertilizerPrescription: {
    ureaKgPerAcre: number;
    dapKgPerAcre: number;
    mopKgPerAcre: number;
    organicManureTonsPerAcre: number;
    zincSulphateKgPerAcre: number;
  };
  soilHealthGrade: 'Grade A (High Fertility)' | 'Grade B (Moderately Fertile)' | 'Grade C (Deficient)';
}

export interface DiseaseScanRecord {
  id: string;
  scannedAt: string;
  cropName: string;
  imagePreviewUrl: string;
  detectedPathogen: string;
  confidence: number;
  severityPercent: number;
  symptoms: string;
  organicRemedy: string;
  chemicalRemedy: string;
}

export interface SeedInspectionRecord {
  id: string;
  inspectedAt: string;
  seedType: string;
  totalSeedsCounted: number;
  viableSeedsCount: number;
  defectiveSeedsCount: number;
  germinationRatePercent: number;
  qualityGrade: string;
}

export interface SmsAlertRecord {
  id: string;
  timestamp: string;
  recipientPhone: string;
  recipientEmail: string;
  messageType: 'Watering & Irrigation' | 'Weather Emergency' | 'Disease Outbreak' | 'Mandi Price Shock' | 'Soil Moisture Deficit';
  messageText: string;
  deliveryStatus: 'Delivered (Carrier SMS)' | 'Sent (SMTP Email)' | 'Queued Offline';
  moistureLevel?: number;
  optimalThreshold?: number;
  emailSubject?: string;
  emailBody?: string;
  channel?: 'SMS' | 'Email' | 'Both';
}

const STORAGE_KEYS = {
  USERS: 'krishisahay_users_v2',
  ACTIVE_USER: 'krishisahay_active_user_v2',
  SOIL_REPORTS: 'krishisahay_soil_reports',
  DISEASE_SCANS: 'krishisahay_disease_scans',
  SEED_SCANS: 'krishisahay_seed_scans',
  SMS_LOGS: 'krishisahay_sms_logs',
  MARKET_CACHE: 'krishisahay_market_cache',
  FEDERATED_WEIGHTS: 'krishisahay_fed_weights',
  ACTIVE_LANG: 'krishisahay_active_lang',
};

// Default seed users if none exist
const DEFAULT_SEED_USERS: UserAccount[] = [
  {
    id: 'user_default_1',
    name: 'Ramesh Reddy',
    phone: '+91 98480 12345',
    email: 'ramesh.reddy@farmmail.in',
    location: 'Warangal District, Telangana',
    role: 'Farmer',
    landAcres: 5.0,
    optimalMoistureThreshold: 45,
    registeredAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'user_default_2',
    name: 'Sita Devi',
    phone: '+91 94401 56789',
    email: 'sitadevi.kisan@agrimail.org',
    location: 'Guntur District, Andhra Pradesh',
    role: 'Farmer',
    landAcres: 3.5,
    optimalMoistureThreshold: 42,
    registeredAt: '2026-02-10T10:30:00Z',
  },
  {
    id: 'user_default_3',
    name: 'Kisan Agro Traders',
    phone: '+91 98200 45678',
    email: 'traders@kisanmarket.com',
    location: 'Vashi Mandi, Navi Mumbai',
    role: 'Buyer',
    landAcres: 0,
    optimalMoistureThreshold: 40,
    registeredAt: '2026-03-01T12:00:00Z',
  },
  {
    id: 'user_default_4',
    name: 'Sri Balaji Agro Machinery & Retail',
    phone: '+91 97000 88990',
    email: 'balaji.retail@agrihub.in',
    location: 'Karimnagar, Telangana',
    role: 'Buyer',
    landAcres: 0,
    optimalMoistureThreshold: 40,
    registeredAt: '2026-03-05T09:15:00Z',
  },
];

export const OfflineStorage = {
  // --- USER AUTHENTICATION & REGISTRATION ---
  getUsers(): UserAccount[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USERS);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_SEED_USERS));
        return DEFAULT_SEED_USERS;
      }
      return JSON.parse(stored);
    } catch {
      return DEFAULT_SEED_USERS;
    }
  },

  registerUser(user: Omit<UserAccount, 'id' | 'registeredAt'>): UserAccount {
    const users = this.getUsers();
    const newUser: UserAccount = {
      ...user,
      id: `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      registeredAt: new Date().toISOString(),
    };
    users.unshift(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    this.setActiveUser(newUser);
    return newUser;
  },

  findUserByCredentials(query: string): UserAccount | null {
    const users = this.getUsers();
    const clean = query.trim().toLowerCase();
    const found = users.find(
      (u) =>
        u.phone.replace(/\s+/g, '') === clean.replace(/\s+/g, '') ||
        u.email.toLowerCase() === clean ||
        u.name.toLowerCase() === clean
    );
    return found || null;
  },

  getActiveUser(): UserAccount | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER);
      if (stored) return JSON.parse(stored);
      return null;
    } catch {
      return null;
    }
  },

  setActiveUser(user: UserAccount | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER);
    }
  },

  updateUserOptimalMoistureThreshold(userId: string, threshold: number): UserAccount | null {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx !== -1) {
      users[idx].optimalMoistureThreshold = threshold;
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      const active = this.getActiveUser();
      if (active && active.id === userId) {
        active.optimalMoistureThreshold = threshold;
        this.setActiveUser(active);
        return active;
      }
      return users[idx];
    }
    return null;
  },

  // --- SOIL REPORTS STORAGE ---
  getSoilReports(): SoilAnalysisReport[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SOIL_REPORTS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  saveSoilReport(report: SoilAnalysisReport): void {
    const list = this.getSoilReports();
    list.unshift(report);
    localStorage.setItem(STORAGE_KEYS.SOIL_REPORTS, JSON.stringify(list));
  },

  // --- DISEASE SCANS STORAGE ---
  getDiseaseScans(): DiseaseScanRecord[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DISEASE_SCANS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  saveDiseaseScan(scan: DiseaseScanRecord): void {
    const list = this.getDiseaseScans();
    list.unshift(scan);
    localStorage.setItem(STORAGE_KEYS.DISEASE_SCANS, JSON.stringify(list));
  },

  // --- SEED QUALITY STORAGE ---
  getSeedScans(): SeedInspectionRecord[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SEED_SCANS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  saveSeedScan(scan: SeedInspectionRecord): void {
    const list = this.getSeedScans();
    list.unshift(scan);
    localStorage.setItem(STORAGE_KEYS.SEED_SCANS, JSON.stringify(list));
  },

  // --- SMS / EMAIL ALERTS DISPATCH LOGS ---
  getSmsLogs(): SmsAlertRecord[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SMS_LOGS);
      if (stored) return JSON.parse(stored);
      // Initial realistic default alerts
      const initialLogs: SmsAlertRecord[] = [
        {
          id: 'sms_init_1',
          timestamp: 'Today, 06:00 IST',
          recipientPhone: '+91 98480 12345',
          recipientEmail: 'farmer@krishisahay.in',
          messageType: 'Watering & Irrigation',
          messageText: 'KrishiSahay Alert: Soil moisture dropped to 38%. Irrigate your Wheat field with 18 L/m² drip tomorrow at 06:00 AM before heatwave peak.',
          deliveryStatus: 'Delivered (Carrier SMS)',
        },
        {
          id: 'sms_init_2',
          timestamp: 'Yesterday, 18:30 IST',
          recipientPhone: '+91 98480 12345',
          recipientEmail: 'farmer@krishisahay.in',
          messageType: 'Weather Emergency',
          messageText: 'KrishiSahay Weather Warning: Thunderstorms & 20mm rainfall expected Friday. Delay synthetic fertilizer spraying to avoid wash-off.',
          deliveryStatus: 'Delivered (Carrier SMS)',
        },
      ];
      localStorage.setItem(STORAGE_KEYS.SMS_LOGS, JSON.stringify(initialLogs));
      return initialLogs;
    } catch {
      return [];
    }
  },

  saveSmsLog(log: SmsAlertRecord): void {
    const logs = this.getSmsLogs();
    logs.unshift(log);
    localStorage.setItem(STORAGE_KEYS.SMS_LOGS, JSON.stringify(logs));
  },

  // --- FEDERATED MODEL WEIGHTS ---
  getFederatedWeights(): { round: number; weights: number[]; accuracy: number } {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FEDERATED_WEIGHTS);
      if (stored) return JSON.parse(stored);
      return {
        round: 14,
        weights: [0.42, -0.18, 0.85, 0.33, -0.09, 0.67, 0.21, 0.54],
        accuracy: 94.2,
      };
    } catch {
      return { round: 14, weights: [0.42, -0.18, 0.85, 0.33], accuracy: 94.2 };
    }
  },

  saveFederatedWeights(data: { round: number; weights: number[]; accuracy: number }): void {
    localStorage.setItem(STORAGE_KEYS.FEDERATED_WEIGHTS, JSON.stringify(data));
  },

  // --- LANGUAGE PREFERENCE ---
  getActiveLanguage(): string {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_LANG) || 'English';
  },

  setActiveLanguage(lang: string): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_LANG, lang);
  },
};
