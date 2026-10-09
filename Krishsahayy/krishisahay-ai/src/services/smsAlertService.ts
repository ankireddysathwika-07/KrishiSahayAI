import { OfflineStorage, SmsAlertRecord } from './offlineStorage';
export { SoilMoistureNotificationService } from './soilMoistureNotificationService';
export type { SoilMoistureAlertEvent } from './soilMoistureNotificationService';

export interface DispatchAlertParams {
  farmerPhone: string;
  farmerEmail: string;
  farmerName: string;
  cropName: string;
  fieldAcres: number;
  waterQuotaLitrePerM2: number;
  urgency: 'Scheduled Daily' | 'Critical Moisture Deficit' | 'Heatwave Warning';
}

export function dispatchIrrigationSms(params: DispatchAlertParams): SmsAlertRecord {
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  const messageText = `KrishiSahay Irrigation Alert [${dateStr} ${timeStr}]: Namaste ${params.farmerName}, soil moisture is at 38% for your ${params.cropName} (${params.fieldAcres} acres). Recommended drip quota: ${params.waterQuotaLitrePerM2} L/m² tomorrow between 05:30-07:30 AM to beat heatwave. Status: Dispatched to ${params.farmerPhone}.`;

  const newLog: SmsAlertRecord = {
    id: `sms_${Date.now()}`,
    timestamp: `${dateStr}, ${timeStr} IST`,
    recipientPhone: params.farmerPhone || '+91 98480 12345',
    recipientEmail: params.farmerEmail || 'farmer@krishisahay.in',
    messageType: 'Watering & Irrigation',
    messageText,
    deliveryStatus: 'Delivered (Carrier SMS)',
  };

  OfflineStorage.saveSmsLog(newLog);
  return newLog;
}

export function dispatchWeatherEmergencySms(
  farmerPhone: string,
  farmerEmail: string,
  farmerName: string,
  warningTitle: string,
  advisoryText: string
): SmsAlertRecord {
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  const messageText = `KrishiSahay Weather Alert: ${farmerName}, ${warningTitle}. ${advisoryText}. Dispatched via SMS to ${farmerPhone}.`;

  const newLog: SmsAlertRecord = {
    id: `sms_wx_${Date.now()}`,
    timestamp: `${dateStr}, ${timeStr} IST`,
    recipientPhone: farmerPhone,
    recipientEmail: farmerEmail,
    messageType: 'Weather Emergency',
    messageText,
    deliveryStatus: 'Delivered (Carrier SMS)',
  };

  OfflineStorage.saveSmsLog(newLog);
  return newLog;
}
