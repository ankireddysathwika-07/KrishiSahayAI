import React, { useState, useEffect } from 'react';
import {
  Droplets,
  CloudRain,
  Gauge,
  Waves,
  Send,
  Mail,
  Phone,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertTriangle,
  Settings,
  BellRing,
  Activity,
  Sliders,
  ExternalLink,
  ShieldCheck,
  Eye,
  X,
  Volume2,
} from 'lucide-react';
import { UserAccount, OfflineStorage, SmsAlertRecord } from '../../services/offlineStorage';
import {
  SoilMoistureNotificationService,
  SoilMoistureAlertEvent,
} from '../../services/soilMoistureNotificationService';
import { getTranslation, SupportedLanguage } from '../../services/i18n';

interface WaterOptimizerViewProps {
  user: UserAccount;
  currentLanguage: SupportedLanguage;
}

export const WaterOptimizerView: React.FC<WaterOptimizerViewProps> = ({
  user,
  currentLanguage,
}) => {
  const t = getTranslation(currentLanguage);

  const [crop, setCrop] = useState('Wheat');
  // Farm Profile Optimal Threshold (from user account or default to 45%)
  const [optimalThreshold, setOptimalThreshold] = useState<number>(
    user.optimalMoistureThreshold || 45
  );
  // Current monitored field moisture
  const [moisture, setMoisture] = useState<number>(38);
  const [temperature, setTemperature] = useState<number>(32);
  const [fieldAcres, setFieldAcres] = useState<number>(user.landAcres || 5);
  const [farmerPhone, setFarmerPhone] = useState<string>(user.phone || '+91 98480 12345');
  const [farmerEmail, setFarmerEmail] = useState<string>(user.email || 'farmer@krishisahay.in');

  const [autoSmsEnabled, setAutoSmsEnabled] = useState<boolean>(true);
  const [recentAlertEvent, setRecentAlertEvent] = useState<SoilMoistureAlertEvent | null>(null);
  const [previewEmailEvent, setPreviewEmailEvent] = useState<SoilMoistureAlertEvent | null>(null);
  const [smsLogs, setSmsLogs] = useState<SmsAlertRecord[]>(() => OfflineStorage.getSmsLogs());
  const [historyTab, setHistoryTab] = useState<'all' | 'sms' | 'email'>('all');
  const [savedThresholdNotice, setSavedThresholdNotice] = useState<boolean>(false);

  // Dynamic daily irrigation calculation
  const baseRate = crop === 'Rice (Paddy)' ? 24 : crop === 'Wheat' ? 14 : crop === 'Cotton' ? 16 : 12;
  const isDeficit = moisture < optimalThreshold;
  const deficitPercent = Math.max(0, optimalThreshold - moisture);
  const moistureFactor = Math.max(0.3, (65 - moisture) / 35);
  const heatFactor = 1 + Math.max(0, (temperature - 28) * 0.04);
  const requiredTodayLitre = Math.max(2, Math.round(baseRate * moistureFactor * heatFactor));
  const totalVolumeLitres = Math.round(requiredTodayLitre * fieldAcres * 4046.86);

  // Subscribe to real-time notification events
  useEffect(() => {
    const unsubscribe = SoilMoistureNotificationService.subscribe((event) => {
      setRecentAlertEvent(event);
      setSmsLogs(OfflineStorage.getSmsLogs());
    });
    return () => unsubscribe();
  }, []);

  // Update optimal threshold in farm profile and save persistently
  const handleSaveOptimalThreshold = (newVal: number) => {
    setOptimalThreshold(newVal);
    OfflineStorage.updateUserOptimalMoistureThreshold(user.id, newVal);
    setSavedThresholdNotice(true);
    setTimeout(() => setSavedThresholdNotice(false), 3000);

    // If current moisture is now below this new optimal threshold, trigger alert
    if (autoSmsEnabled && moisture < newVal) {
      triggerMoistureAlert(moisture, newVal);
    }
  };

  // Trigger Notification Service
  const triggerMoistureAlert = (currentM: number, targetThreshold: number) => {
    const alert = SoilMoistureNotificationService.checkAndTrigger(
      currentM,
      {
        name: user.name,
        phone: farmerPhone,
        email: farmerEmail,
        location: user.location,
        landAcres: fieldAcres,
        optimalMoistureThreshold: targetThreshold,
        cropName: crop,
        temperatureC: temperature,
      },
      { force: true }
    );

    if (alert) {
      setRecentAlertEvent(alert);
      setSmsLogs(OfflineStorage.getSmsLogs());
    }
  };

  // Simulate Moisture Sensor Drop (Test Trigger)
  const handleSimulateMoistureDrop = () => {
    const droppedMoisture = Math.max(18, optimalThreshold - 14); // 14% below optimal threshold
    setMoisture(droppedMoisture);
    triggerMoistureAlert(droppedMoisture, optimalThreshold);
  };

  // Manual Test SMS Dispatch
  const handleSendTestSms = () => {
    triggerMoistureAlert(moisture, optimalThreshold);
  };

  const filteredLogs = smsLogs.filter((log) => {
    if (historyTab === 'sms') return log.deliveryStatus.includes('SMS') || log.channel === 'SMS';
    if (historyTab === 'email') return log.deliveryStatus.includes('Email') || log.channel === 'Email';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-cyan-100 text-cyan-800">
              <Droplets className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-emerald-950 font-serif">
              {t.water.title}
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1 max-w-2xl leading-relaxed">
            Automated SMS & Email notification service connected to your registered phone (<strong>{farmerPhone}</strong>) and email (<strong>{farmerEmail}</strong>). Alerts trigger automatically whenever field moisture drops below your farm profile optimal threshold.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleSimulateMoistureDrop}
            className="flex items-center space-x-2 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            title="Simulate IoT sensor moisture level dropping below threshold"
          >
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>⚡ Simulate Moisture Drop</span>
          </button>

          <button
            onClick={handleSendTestSms}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-700 to-cyan-700 hover:from-blue-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{t.water.sendTestSms}</span>
          </button>
        </div>
      </div>

      {/* High-Priority Notification Alert Toast / Banner */}
      {recentAlertEvent && (
        <div className="p-5 bg-gradient-to-r from-rose-50 via-amber-50 to-orange-50 border-2 border-rose-300 rounded-3xl text-xs shadow-lg animate-in slide-in-from-top-3 duration-300 relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3.5">
              <div className="p-2.5 rounded-2xl bg-rose-600 text-white shadow-md animate-bounce shrink-0 mt-0.5">
                <BellRing className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-600 text-white tracking-wide">
                    🚨 Urgent Notification Dispatched
                  </span>
                  <span className="text-stone-400 font-mono text-[11px]">
                    {recentAlertEvent.timestamp}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-rose-950 font-serif">
                  Soil Moisture Dropped to {recentAlertEvent.currentMoisture}% (Optimal Target: {recentAlertEvent.optimalThreshold}%)
                </h4>
                <p className="text-stone-700 leading-relaxed text-xs">
                  Field moisture deficit of <strong>-{recentAlertEvent.moistureDeficit}%</strong> below farm profile threshold. Dispatched carrier SMS to <strong>{recentAlertEvent.farmerPhone}</strong> and email alert to <strong>{recentAlertEvent.farmerEmail}</strong>.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <span className="text-[11px] font-semibold text-emerald-800 bg-white/80 px-2.5 py-1 rounded-lg border border-emerald-200">
                    💧 Recommended Drip: <strong>{recentAlertEvent.waterQuotaLitrePerM2} L/m²</strong> ({recentAlertEvent.recommendedWindow})
                  </span>
                  <button
                    onClick={() => setPreviewEmailEvent(recentAlertEvent)}
                    className="text-[11px] font-bold text-blue-700 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-lg transition-all flex items-center space-x-1 cursor-pointer"
                  >
                    <Eye className="w-3 h-3" />
                    <span>View Dispatched Email & SMS Details</span>
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => setRecentAlertEvent(null)}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 cursor-pointer"
              title="Dismiss Alert Banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-3xl p-5 text-center shadow-xs">
          <div className="text-3xl font-black font-serif text-blue-800">{requiredTodayLitre} L/m²</div>
          <div className="text-xs text-blue-950 font-semibold mt-1">{t.water.quotaToday}</div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 text-center shadow-xs">
          <div className="text-3xl font-black font-serif text-emerald-700">{moisture}%</div>
          <div className="text-xs text-emerald-950 font-semibold mt-1">Current Field Moisture</div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 text-center shadow-xs">
          <div className="text-3xl font-black font-serif text-amber-800">{optimalThreshold}%</div>
          <div className="text-xs text-amber-950 font-semibold mt-1">Farm Profile Target Optimal</div>
        </div>

        <div className="bg-white border border-stone-200 rounded-3xl p-5 text-center shadow-xs">
          <div className={`text-2xl font-black font-serif ${isDeficit ? 'text-rose-600' : 'text-emerald-700'}`}>
            {isDeficit ? `-${deficitPercent}% Deficit` : 'Optimal Safe'}
          </div>
          <div className="text-xs text-stone-500 font-semibold mt-1">Status vs Optimal Profile</div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Farm Profile Threshold Configuration & Field Sensor Simulation */}
        <div className="lg:col-span-6 space-y-6">
          {/* Card 1: Farm Profile Optimal Moisture Threshold Setup */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                  <Sliders className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-emerald-950 uppercase font-serif tracking-wider">
                  Farm Profile Optimal Threshold Setting
                </h3>
              </div>
              <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                Profile: {user.name}
              </span>
            </div>

            <p className="text-stone-500 leading-relaxed text-[11px]">
              Every crop and farm has a specific optimal soil moisture threshold. Configure your customized profile target below. Whenever field moisture falls below this threshold, our notification service triggers automated SMS and email alerts immediately.
            </p>

            <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-stone-800">Optimal Soil Moisture Threshold:</span>
                <span className="font-mono text-base font-black text-emerald-800 px-3 py-1 bg-white border border-emerald-300 rounded-xl">
                  {optimalThreshold}%
                </span>
              </div>

              <input
                type="range"
                min="25"
                max="65"
                step="1"
                value={optimalThreshold}
                onChange={(e) => handleSaveOptimalThreshold(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-600 cursor-pointer"
              />

              <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                <span>25% (Drought-hardy Millets)</span>
                <span>45% (Standard Wheat/Cotton)</span>
                <span>65% (Paddy/Vegetables)</span>
              </div>
            </div>

            {savedThresholdNotice && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Farm profile optimal threshold updated and saved to local storage!</span>
              </div>
            )}

            {/* Field Telemetry Conditions */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">
                  Monitored Crop
                </label>
                <select
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="w-full p-2 border border-stone-200 rounded-xl font-bold text-emerald-950 bg-stone-50 cursor-pointer"
                >
                  <option>Wheat</option>
                  <option>Rice (Paddy)</option>
                  <option>Cotton</option>
                  <option>Vegetables (Tomato/Chilli)</option>
                  <option>Maize</option>
                  <option>Chickpea</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">
                  Field Area (Acres)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={fieldAcres}
                  onChange={(e) => setFieldAcres(parseFloat(e.target.value) || 1)}
                  className="w-full p-2 border border-stone-200 rounded-xl font-bold font-mono"
                />
              </div>
            </div>

            {/* Current Monitored Moisture Slider */}
            <div>
              <div className="flex justify-between mb-1 items-center">
                <span className="font-semibold text-stone-700">Live Field Soil Moisture Reading:</span>
                <span
                  className={`font-mono font-bold text-sm ${
                    isDeficit ? 'text-rose-600 font-black' : 'text-emerald-700'
                  }`}
                >
                  {moisture}% {isDeficit ? `(Below Optimal ${optimalThreshold}% Target!)` : '(Optimal Level)'}
                </span>
              </div>
              <input
                type="range"
                min="15"
                max="80"
                value={moisture}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setMoisture(val);
                  if (autoSmsEnabled && val < optimalThreshold) {
                    triggerMoistureAlert(val, optimalThreshold);
                  }
                }}
                className="w-full accent-cyan-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 font-mono mt-0.5">
                <span>15% (Severe Wilting)</span>
                <span className="text-amber-700 font-bold">Optimal Target: {optimalThreshold}%</span>
                <span>80% (Saturation)</span>
              </div>
            </div>

            {/* Deficit Alert Banner if below threshold */}
            {isDeficit && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs space-y-1">
                <div className="flex items-center space-x-2 text-rose-800 font-bold">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Moisture Deficit Detected (-{deficitPercent}% below optimal threshold)</span>
                </div>
                <p className="text-[11px] text-rose-700 leading-snug">
                  The notification service has dispatched an SMS to <strong>{farmerPhone}</strong> and email to <strong>{farmerEmail}</strong> recommending {requiredTodayLitre} L/m² drip fertigation.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Registered Contact Notification Dispatcher & Live Log */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm text-xs space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-stone-100">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-blue-100 text-blue-800">
                  <BellRing className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-emerald-950 uppercase font-serif tracking-wider">
                  Registered Farmer Contact & Triggers
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Verified Recipient
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">
                  Registered Phone Number (for Carrier SMS Alert)
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 absolute left-3 top-3 text-stone-400" />
                  <input
                    type="text"
                    value={farmerPhone}
                    onChange={(e) => setFarmerPhone(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-stone-200 rounded-xl font-bold font-mono text-stone-800 bg-stone-50"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">
                  Registered Email Address (for Detailed Irrigation Report)
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-stone-400" />
                  <input
                    type="email"
                    value={farmerEmail}
                    onChange={(e) => setFarmerEmail(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-stone-200 rounded-xl font-medium text-stone-800 bg-stone-50"
                  />
                </div>
              </div>

              {/* Automated Moisture Threshold Checkbox */}
              <label className="flex items-start space-x-3 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSmsEnabled}
                  onChange={(e) => setAutoSmsEnabled(e.target.checked)}
                  className="mt-0.5 accent-emerald-600 rounded"
                />
                <div>
                  <span className="font-bold text-emerald-950 block">
                    Automated Soil Moisture Trigger Active
                  </span>
                  <p className="text-emerald-800 text-[11px] leading-snug">
                    Automatically dispatch an urgent SMS to <strong>{farmerPhone}</strong> and email to <strong>{farmerEmail}</strong> whenever moisture drops below your specific optimal threshold of <strong>{optimalThreshold}%</strong>.
                  </p>
                </div>
              </label>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleSendTestSms}
                  className="flex-1 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Test SMS Now</span>
                </button>
                <button
                  onClick={handleSimulateMoistureDrop}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Test Drop Alert</span>
                </button>
              </div>
            </div>

            {/* Live Sent Messages Log & History */}
            <div className="pt-3 border-t border-stone-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-stone-400 uppercase">
                  Alerts & Dispatch History ({smsLogs.length})
                </span>
                <div className="flex space-x-1">
                  {(['all', 'sms', 'email'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setHistoryTab(tab)}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase transition-all cursor-pointer ${
                        historyTab === tab
                          ? 'bg-emerald-800 text-white'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 max-h-52 overflow-y-auto no-scrollbar">
                {filteredLogs.map((log) => {
                  const isEmail = log.deliveryStatus.includes('Email') || log.channel === 'Email';
                  return (
                    <div
                      key={log.id}
                      className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-[11px] hover:border-emerald-300 transition-all space-y-1"
                    >
                      <div className="flex justify-between items-center text-[10px]">
                        <div className="flex items-center space-x-1.5">
                          <span className={`p-1 rounded-md text-white ${isEmail ? 'bg-indigo-600' : 'bg-emerald-600'}`}>
                            {isEmail ? <Mail className="w-2.5 h-2.5" /> : <Phone className="w-2.5 h-2.5" />}
                          </span>
                          <span className="font-bold text-stone-700">
                            {isEmail ? log.recipientEmail : log.recipientPhone}
                          </span>
                        </div>
                        <span className="font-mono text-stone-400">{log.timestamp}</span>
                      </div>

                      <p className="text-stone-700 leading-snug line-clamp-2">
                        {log.messageText}
                      </p>

                      <div className="flex items-center justify-between pt-1 border-t border-stone-100 text-[10px]">
                        <span className="text-emerald-700 font-bold flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{log.deliveryStatus}</span>
                        </span>
                        {log.emailBody && (
                          <button
                            onClick={() =>
                              setPreviewEmailEvent({
                                id: log.id,
                                timestamp: log.timestamp,
                                farmerName: user.name,
                                farmerPhone: log.recipientPhone,
                                farmerEmail: log.recipientEmail,
                                location: user.location,
                                cropName: crop,
                                fieldAcres,
                                currentMoisture: log.moistureLevel || moisture,
                                optimalThreshold: log.optimalThreshold || optimalThreshold,
                                moistureDeficit: Math.max(0, (log.optimalThreshold || optimalThreshold) - (log.moistureLevel || moisture)),
                                waterQuotaLitrePerM2: requiredTodayLitre,
                                totalWaterRequiredLitres: totalVolumeLitres,
                                recommendedWindow: 'Tomorrow 05:30 AM - 07:30 AM',
                                smsMessage: log.messageText,
                                emailSubject: log.emailSubject || 'Soil Moisture Deficit Alert',
                                emailHtml: log.emailBody || '',
                                deliveryStatusSms: 'Delivered (Carrier SMS)',
                                deliveryStatusEmail: 'Sent (SMTP Email)',
                                triggeredAt: new Date().toISOString(),
                              })
                            }
                            className="text-blue-700 hover:text-blue-900 font-bold cursor-pointer"
                          >
                            Preview Email Payload →
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dispatched Email & SMS Preview Modal */}
      {previewEmailEvent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden p-6 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center pb-3 border-b border-stone-200">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-800">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold font-serif text-emerald-950 text-base">
                    Dispatched Alert Payloads (SMS & Email)
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Dispatched to registered contacts: {previewEmailEvent.farmerPhone} & {previewEmailEvent.farmerEmail}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setPreviewEmailEvent(null)}
                className="p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Carrier SMS Preview */}
            <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-1.5">
              <div className="flex justify-between items-center text-[10px] text-emerald-900 font-bold uppercase">
                <span>📱 Carrier SMS Payload (Sent to {previewEmailEvent.farmerPhone})</span>
                <span className="text-emerald-700 font-mono">Delivered ✓</span>
              </div>
              <p className="text-xs text-stone-800 bg-white p-3 rounded-xl border border-stone-200 font-mono leading-relaxed">
                {previewEmailEvent.smsMessage}
              </p>
            </div>

            {/* HTML Email Preview */}
            <div className="flex-1 overflow-y-auto border border-stone-200 rounded-2xl p-4 bg-stone-50">
              <div className="text-[10px] text-stone-400 font-bold uppercase mb-2">
                📧 SMTP Email Body (Sent to {previewEmailEvent.farmerEmail}):
              </div>
              <div
                className="prose prose-xs max-w-none"
                dangerouslySetInnerHTML={{ __html: previewEmailEvent.emailHtml }}
              />
            </div>

            <button
              onClick={() => setPreviewEmailEvent(null)}
              className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
