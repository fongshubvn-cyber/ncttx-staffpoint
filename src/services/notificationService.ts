import { AppNotification, IncidentRecord, AuthUser } from '../types';
import { isPolicyIncident, isWorkViolation, isRecognitionIncident } from '../utils/calculator';

const NOTIFICATIONS_STORAGE_KEY = 'ncttx_notifications_v1';

/**
 * Play a gentle harmonic chime using Web Audio API
 */
export function playNotificationSound() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // Note 1 (E5 - 659.25Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, ctx.currentTime);
    gain1.gain.setValueAtTime(0.12, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.35);

    // Note 2 (A5 - 880Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
    gain2.gain.setValueAtTime(0.15, ctx.currentTime + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.1);
    osc2.stop(ctx.currentTime + 0.55);
  } catch (e) {
    // AudioContext blocked or not supported
  }
}

/**
 * Request permission for Web Browser Native Notifications
 */
export async function requestBrowserNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    return false;
  }
  if (Notification.permission === 'granted') {
    return true;
  }
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
}

/**
 * Check if Browser Notifications are supported and granted
 */
export function isBrowserNotificationGranted(): boolean {
  if (!('Notification' in window)) return false;
  return Notification.permission === 'granted';
}

/**
 * Send a Browser / Mobile Native Notification (Supports ServiceWorker for Android & iOS PWA)
 */
export function triggerBrowserNotification(title: string, body: string, data?: any) {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'granted') {
    try {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((reg) => {
          reg.showNotification(title, {
            body,
            icon: '/logo.png',
            badge: '/logo.png',
            vibrate: [200, 100, 200],
            data,
          } as any);
        }).catch(() => {
          new Notification(title, {
            body,
            icon: '/logo.png',
            badge: '/logo.png',
            data,
          });
        });
      } else {
        new Notification(title, {
          body,
          icon: '/logo.png',
          badge: '/logo.png',
          data,
        });
      }
    } catch (e) {
      console.warn('Native notification failed:', e);
    }
  }
}

/**
 * Get saved notifications from LocalStorage
 */
export function getSavedNotifications(): AppNotification[] {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list)) return list;
    }
  } catch (e) {}
  return [];
}

/**
 * Save notifications to LocalStorage
 */
export function persistNotifications(list: AppNotification[]) {
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(list.slice(0, 50)));
  } catch (e) {}
}

/**
 * Generate Notification from an Incident Record
 */
export function buildIncidentNotification(
  incident: IncidentRecord,
  isSelfRecipient: boolean = true
): AppNotification {
  const isPolicy = isPolicyIncident(incident);
  const isWorkVio = isWorkViolation(incident);
  
  let type: AppNotification['type'] = isPolicy ? 'noi_quy' : (isWorkVio ? 'vi_pham' : 'khen_thuong');
  let title = '';
  let body = '';

  if (isPolicy) {
    title = isSelfRecipient 
      ? `📖 Bạn có biên bản vi phạm nội quy mới`
      : `📖 Vi phạm quy định nội quy: ${incident.targetName}`;
    body = `[${incident.reporterName}] đã lập biên bản vi phạm quy định: "${incident.title}". Trừ -${incident.policyPenaltyPoints || 10}đ quỹ nội quy.`;
  } else if (isWorkVio) {
    title = isSelfRecipient
      ? `⚠️ Bạn có biên bản vi phạm tiêu chuẩn công việc`
      : `⚠️ Vi phạm công việc: ${incident.targetName}`;
    body = `[${incident.reporterName}] đã gửi biên bản vi phạm: "${incident.title}". Mức tác động: ${incident.impactPoints}đ (Thang 5.0).`;
  } else {
    title = isSelfRecipient
      ? `🌟 Bạn vừa được khen thưởng ghi nhận tốt!`
      : `🌟 Khen thưởng mới: ${incident.targetName}`;
    body = `[${incident.reporterName}] đã khen thưởng: "${incident.title}". Mức tác động: +${incident.impactPoints}đ.`;
  }

  return {
    id: `NOTIF-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    recipientId: incident.targetId,
    title,
    body,
    type,
    incidentId: incident.id,
    impactPoints: isPolicy ? -(incident.policyPenaltyPoints || 10) : incident.impactPoints,
    createdAt: new Date().toISOString(),
    isRead: false,
    senderName: incident.reporterName,
    reporterId: incident.reporterId,
  };
}
