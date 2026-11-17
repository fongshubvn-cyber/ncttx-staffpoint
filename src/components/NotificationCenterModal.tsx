import React, { useState } from 'react';
import { AppNotification, AuthUser } from '../types';
import { 
  Bell, 
  X, 
  CheckCheck, 
  Trash2, 
  Sparkles, 
  Megaphone, 
  BookOpen, 
  Scale, 
  Info, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Volume2
} from 'lucide-react';
import { requestBrowserNotificationPermission, isBrowserNotificationGranted } from '../services/notificationService';

interface NotificationCenterModalProps {
  show: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  currentUser?: AuthUser | null;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onSelectIncident?: (incidentId: string) => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  show,
  onClose,
  notifications,
  currentUser,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  onSelectIncident,
}) => {
  if (!show) return null;

  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [hasPermission, setHasPermission] = useState(isBrowserNotificationGranted());

  // Filter notifications for current user (or Admin/Co-Admin who can view all or their own)
  const userNotifications = notifications.filter(n => {
    if (!currentUser) return true;
    if (currentUser.isAdmin || currentUser.jobLevel === 'Founder' || currentUser.jobLevel === 'Trưởng phòng') {
      return true; // Admins & Managers see all store alerts + their own
    }
    return n.recipientId === currentUser.id || n.recipientId === 'ALL';
  });

  const unreadCount = userNotifications.filter(n => !n.isRead).length;

  const displayedList = filter === 'unread' 
    ? userNotifications.filter(n => !n.isRead) 
    : userNotifications;

  const handleRequestPermission = async () => {
    const granted = await requestBrowserNotificationPermission();
    setHasPermission(granted);
    if (granted) {
      alert('✅ Đã bật thông báo trên trình duyệt thành công! Mỗi khi có đánh giá hoặc phản hồi mới, trình duyệt sẽ gửi thông báo đến bạn.');
    } else {
      alert('⚠️ Trình duyệt chưa cấp quyền thông báo. Vui lòng bấm vào biểu tượng ổ khóa bên cạnh thanh địa chỉ web để bật Cho phép (Allow Notifications).');
    }
  };

  const formatRelativeTime = (isoStr: string) => {
    try {
      const diffMs = Date.now() - new Date(isoStr).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Vừa xong';
      if (diffMins < 60) return `${diffMins} phút trước`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours} giờ trước`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} ngày trước`;
    } catch (e) {
      return '';
    }
  };

  const getNotifIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'khen_thuong':
        return <Sparkles className="w-4 h-4 text-emerald-600" />;
      case 'nhac_nho':
        return <Megaphone className="w-4 h-4 text-amber-600" />;
      case 'vi_pham':
        return <BookOpen className="w-4 h-4 text-rose-600" />;
      case 'khang_nghi':
        return <Scale className="w-4 h-4 text-indigo-600" />;
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm animate-fade-in print:hidden">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-100 transform transition-all animate-scale-up overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-2xl relative">
              <Bell className="w-5 h-5 text-white" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-[#1B4332]" />
              )}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight">Trung Tâm Thông Báo</h2>
              <p className="text-[11px] text-emerald-100 font-medium">
                {unreadCount > 0 ? `Bạn có ${unreadCount} thông báo chưa đọc` : 'Bạn đã xem hết thông báo'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Browser Push Permission Banner */}
        {!hasPermission && (
          <div className="px-4 py-2.5 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200 flex items-center justify-between gap-2 text-xs shrink-0">
            <div className="flex items-center gap-2 text-amber-900 font-bold">
              <Volume2 className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Nhận thông báo nổi trên máy tính / điện thoại</span>
            </div>
            <button
              type="button"
              onClick={handleRequestPermission}
              className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-black text-[11px] shadow-2xs transition-all active:scale-95 cursor-pointer shrink-0 whitespace-nowrap"
            >
              Bật ngay
            </button>
          </div>
        )}

        {/* Filter & Action Tabs */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-[#1B4332] text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              Tất cả ({userNotifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                filter === 'unread'
                  ? 'bg-[#1B4332] text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              Chưa đọc ({unreadCount})
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:text-emerald-950 p-1 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                title="Đánh dấu tất cả đã đọc"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Đã đọc hết</span>
              </button>
            )}
            {userNotifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-rose-600 p-1 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="Xóa tất cả thông báo"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Xóa</span>
              </button>
            )}
          </div>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 sm:p-3 space-y-1">
          {displayedList.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Bell className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-700">Chưa có thông báo nào</p>
                <p className="text-xs text-slate-400">
                  Khi bạn được đánh giá, khen thưởng hoặc bị nhắc nhở, thông báo sẽ hiển thị tại đây.
                </p>
              </div>
            </div>
          ) : (
            displayedList.map((notif) => {
              const isUnread = !notif.isRead;
              return (
                <div
                  key={notif.id}
                  onClick={() => {
                    onMarkAsRead(notif.id);
                    if (notif.incidentId && onSelectIncident) {
                      onSelectIncident(notif.incidentId);
                      onClose();
                    }
                  }}
                  className={`p-3 rounded-2xl transition-all cursor-pointer flex items-start gap-3 relative ${
                    isUnread 
                      ? 'bg-emerald-50/70 border border-emerald-200/80 shadow-2xs hover:bg-emerald-100/70' 
                      : 'bg-white hover:bg-slate-50 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className={`p-2.5 rounded-2xl shrink-0 shadow-2xs ${
                    notif.type === 'khen_thuong' 
                      ? 'bg-emerald-100' 
                      : notif.type === 'vi_pham' 
                        ? 'bg-rose-100' 
                        : notif.type === 'nhac_nho' 
                          ? 'bg-amber-100' 
                          : 'bg-blue-100'
                  }`}>
                    {getNotifIcon(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={`text-xs font-black truncate ${isUnread ? 'text-slate-900' : 'text-slate-700'}`}>
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-medium shrink-0">
                        {formatRelativeTime(notif.createdAt)}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 line-clamp-2 font-medium leading-relaxed">
                      {notif.body}
                    </p>

                    {notif.impactPoints !== undefined && notif.impactPoints !== 0 && (
                      <div className="flex items-center gap-1.5 pt-0.5">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black font-mono ${
                          notif.impactPoints > 0 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {notif.impactPoints > 0 ? `+${notif.impactPoints}đ` : `${notif.impactPoints}đ`}
                        </span>
                        {notif.senderName && (
                          <span className="text-[10px] text-slate-400">
                            bởi {notif.senderName}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {isUnread && (
                    <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 mt-2" />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl bg-white border border-slate-200 text-xs font-extrabold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
