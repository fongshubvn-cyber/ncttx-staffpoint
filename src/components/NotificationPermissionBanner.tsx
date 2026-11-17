import React, { useState, useEffect } from 'react';
import { Bell, X, Sparkles } from 'lucide-react';
import { requestBrowserNotificationPermission, isBrowserNotificationGranted } from '../services/notificationService';

export const NotificationPermissionBanner: React.FC = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only show if browser supports Notification and permission is 'default' (not yet asked)
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const isDismissed = sessionStorage.getItem('ncttx_dismiss_notif_banner');
      if (Notification.permission === 'default' && !isDismissed) {
        // Small delay so user sees app loaded first
        const timer = setTimeout(() => {
          setShow(true);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  if (!show) return null;

  const handleEnable = async () => {
    setLoading(true);
    try {
      const granted = await requestBrowserNotificationPermission();
      setShow(false);
      if (granted) {
        // Send a friendly test chime notification
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.ready.then((reg) => {
            reg.showNotification('Staffpoint - Nhà Của Thời Thanh Xuân', {
              body: '✅ Bạn đã bật nhận thông báo thành công! Mọi đánh giá và phản hồi sẽ gửi đến bạn ngay lập tức.',
              icon: '/favicon.png',
              badge: '/favicon.png',
            } as any);
          });
        }
      }
    } catch (e) {
      setShow(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    setShow(false);
    sessionStorage.setItem('ncttx_dismiss_notif_banner', 'true');
  };

  return (
    <div className="fixed bottom-4 inset-x-3 sm:inset-x-auto sm:right-5 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-gradient-to-r from-[#1B4332] via-[#2D6A4F] to-[#1B4332] text-white p-3.5 sm:p-4 rounded-3xl shadow-2xl border border-emerald-500/30 backdrop-blur-xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 shadow-inner">
            <Bell className="w-5 h-5 text-emerald-200 animate-bounce" />
          </div>
          <div className="min-w-0 text-left">
            <div className="text-xs font-black flex items-center gap-1.5 text-white">
              <span>Bật Thông Báo Trên Máy</span>
              <Sparkles className="w-3 h-3 text-emerald-300" />
            </div>
            <div className="text-[11px] text-emerald-100 font-medium leading-tight line-clamp-2 mt-0.5">
              Nhận thông báo ngay khi có đánh giá ca làm hoặc khen thưởng/vi phạm
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleEnable}
            disabled={loading}
            className="px-3 py-1.5 rounded-xl bg-white text-emerald-950 font-black text-xs hover:bg-emerald-50 active:scale-95 transition-all shadow-md cursor-pointer whitespace-nowrap"
          >
            {loading ? 'Đang bật...' : 'Bật Ngay'}
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            className="p-1.5 rounded-xl text-emerald-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Để sau"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
