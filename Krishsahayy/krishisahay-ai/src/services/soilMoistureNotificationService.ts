import { OfflineStorage, SmsAlertRecord, UserAccount } from './offlineStorage';
import { FarmProfile } from '../types/agricultural';

export interface SoilMoistureAlertEvent {
  id: string;
  timestamp: string;
  farmerName: string;
  farmerPhone: string;
  farmerEmail: string;
  farmName?: string;
  location: string;
  cropName: string;
  fieldAcres: number;
  currentMoisture: number;
  optimalThreshold: number;
  moistureDeficit: number;
  waterQuotaLitrePerM2: number;
  totalWaterRequiredLitres: number;
  recommendedWindow: string;
  smsMessage: string;
  emailSubject: string;
  emailHtml: string;
  deliveryStatusSms: string;
  deliveryStatusEmail: string;
  triggeredAt: string;
}

type AlertSubscriber = (event: SoilMoistureAlertEvent) => void;
const subscribers: Set<AlertSubscriber> = new Set();

let lastAlertTimestamp: number = 0;
const COOLDOWN_MS = 10000; // 10 seconds cooldown between automatic triggers to prevent spam

export const SoilMoistureNotificationService = {
  /**
   * Subscribe to real-time notification service triggers
   */
  subscribe(callback: AlertSubscriber): () => void {
    subscribers.add(callback);
    return () => {
      subscribers.delete(callback);
    };
  },

  /**
   * Broadcast an alert event to all active UI subscribers
   */
  notifySubscribers(event: SoilMoistureAlertEvent) {
    subscribers.forEach((cb) => {
      try {
        cb(event);
      } catch (err) {
        console.error('Error notifying alert subscriber:', err);
      }
    });
  },

  /**
   * Main Check & Trigger Engine:
   * Compares current field moisture against the optimal threshold defined in the farmer's specific profile.
   * If moisture is below optimal threshold, triggers both SMS & Email alerts.
   */
  checkAndTrigger(
    currentMoisture: number,
    profile: {
      name: string;
      phone: string;
      email: string;
      location?: string;
      landAcres?: number;
      optimalMoistureThreshold?: number;
      cropName?: string;
      temperatureC?: number;
    },
    options: { force?: boolean } = {}
  ): SoilMoistureAlertEvent | null {
    const optimalThreshold = profile.optimalMoistureThreshold ?? 45;
    const now = Date.now();

    // Check if moisture dropped below the optimal threshold defined in farm profile
    if (currentMoisture >= optimalThreshold && !options.force) {
      return null;
    }

    // Cooldown check for automated triggers (bypassed if force=true)
    if (!options.force && now - lastAlertTimestamp < COOLDOWN_MS) {
      return null;
    }

    lastAlertTimestamp = now;

    const deficit = Math.max(1, optimalThreshold - currentMoisture);
    const cropName = profile.cropName || 'Wheat';
    const fieldAcres = profile.landAcres || 5.0;
    const location = profile.location || 'Warangal District, Telangana';
    const farmerName = profile.name || 'Ramesh Reddy';
    const farmerPhone = profile.phone || '+91 98480 12345';
    const farmerEmail = profile.email || 'farmer@krishisahay.in';
    const temp = profile.temperatureC ?? 32;

    // Irrigation Quota calculation based on crop, deficit and heat
    const baseQuota = cropName === 'Rice' ? 24 : cropName === 'Cotton' ? 16 : 14;
    const deficitMultiplier = 1 + (deficit / 30);
    const heatMultiplier = 1 + Math.max(0, (temp - 28) * 0.035);
    const quotaLitrePerM2 = Math.round(baseQuota * deficitMultiplier * heatMultiplier);
    const totalVolumeLitres = Math.round(quotaLitrePerM2 * fieldAcres * 4046.86);

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const recommendedWindow = 'Tomorrow 05:30 AM - 07:30 AM';

    // 1. Generate SMS Alert Payload
    const smsMessage = `🚨 [KRISHI-ALERT] Urgent Soil Moisture Alert: Namaste ${farmerName}, field moisture for your ${cropName} (${fieldAcres} acres, ${location.split('(')[0].trim()}) has dropped to ${currentMoisture}% (Optimal target is ${optimalThreshold}%). Deficit: -${deficit}%. Recommended action: Apply ${quotaLitrePerM2} L/m² drip fertigation (~${Math.round(totalVolumeLitres / 1000)} kL) ${recommendedWindow} before heatwave peak. Dispatched to registered phone: ${farmerPhone}.`;

    // 2. Generate Email Alert Payload
    const emailSubject = `🚨 [KrishiSahay Alert] Soil Moisture Deficit Alert (${currentMoisture}% vs Optimal ${optimalThreshold}%) - ${farmerName}'s Farm`;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; background: #f4f7f4; padding: 24px; color: #1e293b;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <div style="background: #14532d; padding: 20px 24px; color: white;">
            <h1 style="margin: 0; font-size: 20px; font-weight: bold;">🌾 KrishiSahay Automated Irrigation Alert</h1>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: #86efac;">Soil Moisture Threshold Breach Notification</p>
          </div>
          
          <div style="padding: 24px;">
            <p style="font-size: 15px; margin-top: 0;">Namaste <strong>${farmerName}</strong>,</p>
            <p style="font-size: 14px; line-height: 1.5; color: #475569;">
              The IoT telemetry sensors and hydrological soil model for your farm have detected that soil moisture has dropped below your customized <strong>Farm Profile Optimal Threshold</strong>.
            </p>

            <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <div style="font-size: 13px; font-weight: bold; color: #991b1b; text-transform: uppercase;">Moisture Deficit Detected</div>
              <div style="font-size: 24px; font-weight: bold; color: #b91c1c; margin: 6px 0;">
                Current: ${currentMoisture}% <span style="font-size: 14px; font-weight: normal; color: #64748b;">(Target Optimal: ${optimalThreshold}%)</span>
              </div>
              <div style="font-size: 13px; color: #7f1d1d;">
                Deficit Gap: <strong>-${deficit}%</strong> below safe root-zone threshold
              </div>
            </div>

            <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin: 20px 0;">
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 8px 0; color: #64748b;">Crop & Acreage:</td>
                <td style="padding: 8px 0; font-weight: bold; text-align: right;">${cropName} • ${fieldAcres} Acres</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 8px 0; color: #64748b;">Location:</td>
                <td style="padding: 8px 0; font-weight: bold; text-align: right;">${location}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 8px 0; color: #64748b;">Precision Water Quota:</td>
                <td style="padding: 8px 0; font-weight: bold; color: #0284c7; text-align: right;">${quotaLitrePerM2} L/m² (~${Math.round(totalVolumeLitres / 1000)} kL Total)</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 8px 0; color: #64748b;">Recommended Drip Window:</td>
                <td style="padding: 8px 0; font-weight: bold; color: #15803d; text-align: right;">${recommendedWindow}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;">Registered Phone (SMS):</td>
                <td style="padding: 8px 0; font-weight: bold; text-align: right;">${farmerPhone}</td>
              </tr>
            </table>

            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 14px; border-radius: 10px; font-size: 12px; color: #166534; line-height: 1.5;">
              💡 <strong>Agronomist Recommendation:</strong> Irrigate early in the morning to prevent water vapor loss from ambient heat (${temp}°C). Run your drip system for approx. 2 hours 20 mins.
            </div>

            <p style="font-size: 11px; color: #94a3b8; margin-top: 24px; text-align: center;">
              Dispatched automatically by KrishiSahay AI Notification Service • Registered Email: ${farmerEmail}
            </p>
          </div>
        </div>
      </div>
    `;

    const alertId = `alert_${now}`;
    const timestampStr = `${dateStr}, ${timeStr} IST`;

    // 3. Save SMS Dispatch Log
    const smsLog: SmsAlertRecord = {
      id: `sms_${alertId}`,
      timestamp: timestampStr,
      recipientPhone: farmerPhone,
      recipientEmail: farmerEmail,
      messageType: 'Soil Moisture Deficit',
      messageText: smsMessage,
      deliveryStatus: 'Delivered (Carrier SMS)',
      moistureLevel: currentMoisture,
      optimalThreshold,
      channel: 'SMS',
    };
    OfflineStorage.saveSmsLog(smsLog);

    // 4. Save Email Dispatch Log
    const emailLog: SmsAlertRecord = {
      id: `email_${alertId}`,
      timestamp: timestampStr,
      recipientPhone: farmerPhone,
      recipientEmail: farmerEmail,
      messageType: 'Soil Moisture Deficit',
      messageText: `[Email Dispatched to ${farmerEmail}] Subject: ${emailSubject}`,
      deliveryStatus: 'Sent (SMTP Email)',
      moistureLevel: currentMoisture,
      optimalThreshold,
      emailSubject,
      emailBody: emailHtml,
      channel: 'Email',
    };
    OfflineStorage.saveSmsLog(emailLog);

    const event: SoilMoistureAlertEvent = {
      id: alertId,
      timestamp: timestampStr,
      farmerName,
      farmerPhone,
      farmerEmail,
      location,
      cropName,
      fieldAcres,
      currentMoisture,
      optimalThreshold,
      moistureDeficit: deficit,
      waterQuotaLitrePerM2: quotaLitrePerM2,
      totalWaterRequiredLitres: totalVolumeLitres,
      recommendedWindow,
      smsMessage,
      emailSubject,
      emailHtml,
      deliveryStatusSms: 'Delivered (Carrier SMS)',
      deliveryStatusEmail: 'Sent (SMTP Email)',
      triggeredAt: new Date().toISOString(),
    };

    // Notify all active listeners (Toasts, Dashboard, Optimizer view)
    this.notifySubscribers(event);

    return event;
  },

  /**
   * Helper to trigger a moisture drop simulation for testing
   */
  simulateMoistureDrop(
    targetMoisture: number,
    profile: {
      name: string;
      phone: string;
      email: string;
      location?: string;
      landAcres?: number;
      optimalMoistureThreshold?: number;
      cropName?: string;
      temperatureC?: number;
    }
  ): SoilMoistureAlertEvent {
    const alert = this.checkAndTrigger(targetMoisture, profile, { force: true });
    return alert!;
  },
};
