import { AppNotification, IncidentRecord, AuthUser } from '../types';
import { isPolicyIncident, isWorkViolation, isRecognitionIncident, getIncidentDisplayCode } from '../utils/calculator';

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
  const code = getIncidentDisplayCode(incident);
  const codeBadge = code ? `[${code}] ` : '';
  
  let type: AppNotification['type'] = isPolicy ? 'noi_quy' : (isWorkVio ? 'vi_pham' : 'khen_thuong');
  let title = '';
  let body = '';

  if (isPolicy) {
    const penalty = incident.policyPenaltyPoints || 10;
    title = isSelfRecipient 
      ? `📖 Bạn bị trừ -${penalty}đ quỹ nội quy`
      : `📖 Vi phạm nội quy (-${penalty}đ): ${incident.targetName}`;
    body = `${codeBadge}[${incident.reporterName}] đã lập biên bản vi phạm quy định: "${incident.title}". Mức trừ: -${penalty}đ quỹ chấp hành nội quy.`;
  } else if (isWorkVio) {
    const impact = incident.impactPoints || 0;
    title = isSelfRecipient
      ? `⚠️ Bạn bị trừ ${impact}đ tiêu chuẩn công việc`
      : `⚠️ Vi phạm công việc (${impact}đ): ${incident.targetName}`;
    body = `${codeBadge}[${incident.reporterName}] đã gửi biên bản vi phạm: "${incident.title}". Mức tác động: ${impact}đ (Thang 5.0).`;
  } else {
    const impact = incident.impactPoints || 0;
    title = isSelfRecipient
      ? `🌟 Bạn được cộng +${impact}đ khen thưởng!`
      : `🌟 Khen thưởng (+${impact}đ): ${incident.targetName}`;
    body = `${codeBadge}[${incident.reporterName}] đã khen thưởng: "${incident.title}". Mức tác động: +${impact}đ (Thang 5.0).`;
  }

  return {
    id: `NOTIF-TARGET-${incident.id}-${incident.targetId}`,
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

/**
 * Tạo thông báo xác nhận cho NGƯỜI LẬP PHIẾU khi phiếu đã được ghi nhận thành công vào Database
 */
export function buildReporterConfirmationNotification(
  incident: IncidentRecord
): AppNotification {
  const isPolicy = isPolicyIncident(incident);
  const isWorkVio = isWorkViolation(incident);
  const code = getIncidentDisplayCode(incident);
  const codeBadge = code ? `[${code}] ` : '';

  let type: AppNotification['type'] = isPolicy ? 'noi_quy' : (isWorkVio ? 'vi_pham' : 'khen_thuong');
  let title = '';
  let body = '';

  if (isPolicy) {
    const penalty = incident.policyPenaltyPoints || 10;
    title = `✅ Đã lưu biên bản nội quy (-${penalty}đ)`;
    body = `${codeBadge}Phiếu đã được ghi nhận thành công vào database cho [${incident.targetName}]: "${incident.title}" (-${penalty}đ quỹ chấp hành).`;
  } else if (isWorkVio) {
    const impact = incident.impactPoints || 0;
    title = `✅ Đã lưu phiếu vi phạm (${impact}đ)`;
    body = `${codeBadge}Phiếu đã được ghi nhận thành công vào database cho [${incident.targetName}]: "${incident.title}" (${impact}đ thang 5.0).`;
  } else {
    const impact = incident.impactPoints || 0;
    title = `✅ Đã lưu phiếu khen thưởng (+${impact}đ)`;
    body = `${codeBadge}Phiếu đã được ghi nhận thành công vào database cho [${incident.targetName}]: "${incident.title}" (+${impact}đ thang 5.0).`;
  }

  return {
    id: `NOTIF-REPORTER-${incident.id}-${incident.reporterId}`,
    recipientId: incident.reporterId,
    title,
    body,
    type,
    incidentId: incident.id,
    impactPoints: isPolicy ? -(incident.policyPenaltyPoints || 10) : incident.impactPoints,
    createdAt: new Date().toISOString(),
    isRead: false,
    senderName: 'Hệ thống Database',
    reporterId: incident.reporterId,
  };
}
