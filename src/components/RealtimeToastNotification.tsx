import React, { useEffect } from 'react';
import { AppNotification } from '../types';
import { Sparkles, Megaphone, BookOpen, Scale, Info, X, ShieldAlert } from 'lucide-react';

interface RealtimeToastNotificationProps {
  notification: AppNotification | null;
  onClose: () => void;
  onClick?: (notif: AppNotification) => void;
}

export const RealtimeToastNotification: React.FC<RealtimeToastNotificationProps> = ({
  notification,
  onClose,
  onClick,
}) => {
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      onClose();
    }, 6000); // Auto-dismiss after 6s
    return () => clearTimeout(timer);
  }, [notification, onClose]);

  if (!notification) return null;

  const getIcon = () => {
    switch (notification.type) {
      case 'khen_thuong':
        return <Sparkles className="w-5 h-5 text-emerald-600" />;
      case 'noi_quy':
        return <BookOpen className="w-5 h-5 text-amber-900" />;
      case 'vi_pham':
        return <ShieldAlert className="w-5 h-5 text-rose-600" />;
      case 'nhac_nho':
        return <Megaphone className="w-5 h-5 text-amber-600" />;
      case 'khang_nghi':
        return <Scale className="w-5 h-5 text-indigo-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full animate-slide-in-right print:hidden">
      <div 
        onClick={() => {
          if (onClick) onClick(notification);
          onClose();
        }}
        className="p-4 rounded-3xl bg-white/95 backdrop-blur-xl border border-emerald-200/90 shadow-2xl shadow-emerald-950/15 cursor-pointer hover:scale-[1.02] transition-all flex items-start gap-3.5"
      >
        <div className={`p-2.5 rounded-2xl shrink-0 shadow-sm ${
          notification.type === 'khen_thuong' 
            ? 'bg-emerald-100' 
            : notification.type === 'noi_quy'
              ? 'bg-amber-100'
              : notification.type === 'vi_pham' 
                ? 'bg-rose-100' 
                : notification.type === 'nhac_nho' 
                  ? 'bg-amber-100' 
                  : 'bg-blue-100'
        }`}>
          {getIcon()}
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
              Thông Báo Mới
            </span>
            <span className="text-[10px] text-slate-400">Vừa xong</span>
          </div>
          <h4 className="text-xs font-black text-slate-900 truncate">
            {notification.title}
          </h4>
          <p className="text-[11px] text-slate-600 line-clamp-2 font-medium">
            {notification.body}
          </p>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
