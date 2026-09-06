import React from 'react';
import { AuthUser } from '../types';
import { 
  LayoutDashboard, 
  HeartHandshake, 
  Users, 
  Sparkles, 
  BarChart3, 
  ShieldCheck, 
  Smile, 
  Smartphone,
  Leaf,
  UserCheck,
  Lock,
  User,
  LogIn,
  LogOut,
  Cloud,
  CloudOff
} from 'lucide-react';
import { isFirebaseConfigured, onCloudStateChange, CloudSyncState } from '../config/firebase';
import { isDeptHeadOrAboveRole } from '../utils/calculator';

import { IncidentRecord } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isManager: boolean;
  setIsManager: (isManager: boolean) => void;
  isMobileFrame: boolean;
  setIsMobileFrame: (isMobile: boolean) => void;
  currentUser: AuthUser | null;
  onOpenLoginModal: () => void;
  onLogout: () => void;
  incidents?: IncidentRecord[];
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isManager,
  setIsManager,
  isMobileFrame,
  setIsMobileFrame,
  currentUser,
  onOpenLoginModal,
  onLogout,
  incidents = [],
}) => {
  const [cloudSyncInfo, setCloudSyncInfo] = React.useState<{ status: CloudSyncState; errorDetails: string | null }>({
    status: 'connecting',
    errorDetails: null
  });

  React.useEffect(() => {
    const unsub = onCloudStateChange((state) => {
      setCloudSyncInfo(state);
    });
    return () => unsub();
  }, []);

  const isDepartmentHeadOrAbove = isDeptHeadOrAboveRole(currentUser) || isManager;

  // Calculate notifications for recipient user (targetId === currentUser.id)
  const recipientNotifCount = currentUser 
    ? incidents.filter(i => i.targetId === currentUser.id && (i.type === 'vi_pham' || i.status === 'Đã duyệt')).length
    : 0;

  const rawNavItems = [
    { id: 'summary', label: 'Tổng hợp', icon: LayoutDashboard },
    { id: 'incidents', label: 'Phiếu', icon: HeartHandshake },
    { id: 'staff', label: 'Đội ngũ', icon: Users },
    { id: 'questions', label: 'Tiêu chí', icon: Sparkles },
    { id: 'baseline', label: 'Tham số', icon: BarChart3 },
    { id: 'report', label: 'Báo cáo', icon: BarChart3, requiresDeptHead: true },
  ];

  const navItems = rawNavItems.filter(item => !item.requiresDeptHead || isDepartmentHeadOrAbove);

  return (
    <>
      {/* Top Mobile Header Bar (Forest Green Brand Header) */}
      <header className="sticky top-0 z-40 bg-[#1B4332] text-white px-4 py-3 shadow-md border-b border-[#2D6A4F]">
        
        {/* Top Status & Dedicated Auth Button System */}
        <div className="flex flex-wrap items-center justify-between text-[11px] text-emerald-100 font-bold pb-2 border-b border-[#2D6A4F]/60 mb-2 gap-2">
          
          {/* User Account Status Pill & Cloud Status Indicator */}
          <div className="flex items-center space-x-1.5">
            <div className="flex items-center space-x-1.5 truncate bg-[#112d22] px-2.5 py-1 rounded-full border border-[#2D6A4F]">
              <span className="w-2 h-2 rounded-full bg-[#52B788] animate-pulse shrink-0"></span>
              <span className="truncate text-white">
                {currentUser ? (
                  <>
                    <strong className="text-[#52B788]">[{currentUser.id}]</strong> {currentUser.name}
                  </>
                ) : (
                  <span className="text-amber-300 font-normal">Chưa đăng nhập</span>
                )}
              </span>
            </div>

            {/* Cloud Realtime Status Indicator */}
            <div 
              className={`flex items-center space-x-1 text-[10px] px-2.5 py-0.5 rounded-full font-extrabold border ${
                cloudSyncInfo.status === 'error'
                  ? 'bg-rose-950 text-rose-300 border-rose-500 animate-bounce'
                  : cloudSyncInfo.status === 'connected'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                  : 'bg-amber-950 text-amber-300 border-amber-500/40'
              }`}
              title={
                cloudSyncInfo.status === 'error'
                  ? `Lỗi kết nối Firestore: ${cloudSyncInfo.errorDetails}`
                  : "Đã kết nối Firebase Cloud Realtime Sync"
              }
            >
              {cloudSyncInfo.status === 'error' ? (
                <>
                  <CloudOff className="w-3 h-3 text-rose-400" />
                  <span>Mất Sync Cloud</span>
                </>
              ) : cloudSyncInfo.status === 'connected' ? (
                <>
                  <Cloud className="w-3 h-3 text-emerald-400 animate-pulse" />
                  <span className="hidden sm:inline">Cloud Realtime</span>
                </>
              ) : (
                <>
                  <Cloud className="w-3 h-3 text-amber-400 animate-spin" />
                  <span className="hidden sm:inline">Đang kết nối...</span>
                </>
              )}
            </div>
          </div>

          {/* Button System: Account, Đăng Nhập, Đăng Xuất */}
          <div className="flex items-center space-x-1.5 shrink-0">
            {/* Button 1: Account */}
            <button
              onClick={onOpenLoginModal}
              className="text-[10px] px-2.5 py-1 rounded-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-extrabold flex items-center space-x-1 border border-[#52B788]/40 shadow-sm transition-all active:scale-95"
              title="Xem thông tin Tài khoản / Hồ sơ nhân sự"
            >
              <User className="w-3 h-3 text-[#52B788]" />
              <span>Account</span>
            </button>

            {/* Button 2: Đăng Nhập */}
            <button
              onClick={onOpenLoginModal}
              className="text-[10px] px-2.5 py-1 rounded-full bg-[#52B788] text-[#1B4332] font-black hover:bg-emerald-300 flex items-center space-x-1 shadow-sm transition-all active:scale-95"
              title="Đăng nhập hoặc chuyển đổi tài khoản nhân sự"
            >
              <LogIn className="w-3 h-3 text-[#1B4332]" />
              <span>Đăng nhập</span>
            </button>

            {/* Button 3: Đăng Xuất */}
            {currentUser && (
              <button
                onClick={onLogout}
                className="text-[10px] px-2.5 py-1 rounded-full bg-rose-900/80 hover:bg-rose-800 text-rose-200 font-extrabold flex items-center space-x-1 border border-rose-500/40 shadow-sm transition-all active:scale-95"
                title="Đăng xuất khỏi hệ thống"
              >
                <LogOut className="w-3 h-3 text-rose-300" />
                <span>Đăng xuất</span>
              </button>
            )}

            {/* Frame toggle button */}
            <button
              onClick={() => setIsMobileFrame(!isMobileFrame)}
              className="text-[10px] px-2 py-1 rounded-full bg-[#112d22] hover:bg-[#2D6A4F] text-emerald-200 font-bold flex items-center space-x-1 border border-[#2D6A4F] transition-all"
            >
              <Smartphone className="w-3 h-3 text-[#52B788]" />
              <span>{isMobileFrame ? 'Khung App' : 'Full'}</span>
            </button>
          </div>
        </div>

        {/* Brand Header Title & Role Switcher */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5 min-w-0">
            <img 
              src="/logo.png" 
              alt="Thời Thanh Xuân Logo" 
              className="w-10 h-10 object-contain rounded-2xl bg-white p-1 shadow-md shrink-0 border border-emerald-200" 
            />
            <div className="min-w-0">
              <h1 className="font-black text-base sm:text-lg tracking-tight text-white flex items-center space-x-1.5 font-heading whitespace-nowrap">
                <span>Ghi nhận phản hồi nhân sự</span>
                <span className="text-[10px] sm:text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-[#52B788] text-[#1B4332] shrink-0 shadow-sm">
                  v3.0
                </span>
              </h1>
              <p className="text-xs text-emerald-100 font-semibold italic whitespace-nowrap truncate">
                Phát triển bởi Nhà Của Thời Thanh Xuân
              </p>
            </div>
          </div>
        </div>

      </header>

      {/* Bottom Mobile Tab Bar — FIX CONTRAST: High contrast dark forest background with crisp white text & mint active state */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#143326] border-t-2 border-[#2D6A4F] px-1 py-1.5 shadow-2xl max-w-[480px] mx-auto rounded-t-3xl">
        <div className={`grid gap-0.5 ${navItems.length === 6 ? 'grid-cols-6' : 'grid-cols-5'}`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center py-2 rounded-2xl transition-all relative ${
                  isActive
                    ? 'text-[#1B4332] font-black bg-[#52B788] shadow-md scale-105'
                    : 'text-white font-bold hover:bg-[#2D6A4F]/60'
                }`}
              >
                <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-[#1B4332] stroke-[2.5]' : 'text-white stroke-[2]'}`} />
                <span className="text-[11px] font-heading font-black tracking-tight">{item.label}</span>
                {item.id === 'incidents' && recipientNotifCount > 0 && (
                  <span className="absolute top-1 right-1.5 bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full animate-bounce shadow">
                    {recipientNotifCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
