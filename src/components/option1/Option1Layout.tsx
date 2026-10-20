import React, { useState, useEffect } from 'react';
import logoImg from '../../assets/logo.png';
import { 
  Staff, 
  IncidentRecord, 
  IncidentStatus,
  Question, 
  DepartmentLine, 
  ParameterConfig, 
  BaselinePoint,
  AuthUser 
} from '../../types';

import { Option1SummaryView } from './Option1SummaryView';
import { Option1StaffView } from './Option1StaffView';
import { Option1IncidentsView } from './Option1IncidentsView';
import { Option1QuestionsView } from './Option1QuestionsView';
import { Option1ReportView } from './Option1ReportView';
import { BaselineView } from '../BaselineView';
import { GuideView } from '../GuideView';
import { PolicyView } from '../PolicyView';
import { AiChatModal } from '../AiChatModal';
import { AdminPasswordModal } from '../AdminPasswordModal';

import { 
  LayoutDashboard, 
  Users, 
  Trophy, 
  Layers, 
  BarChart3, 
  Sliders,
  HelpCircle, 
  Plus, 
  LogOut, 
  LogIn, 
  Sparkles,
  Cloud,
  CloudOff,
  Menu,
  X,
  BookOpen,
  ExternalLink,
  User,
  Key,
  RotateCw,
  ShieldCheck,
  Star,
  ShieldAlert,
  ClipboardCheck,
  ChevronRight
} from 'lucide-react';
import { onCloudStateChange, CloudSyncState } from '../../config/firebase';
import { canUserViewIncident, isHRHeadRole, isDeptHeadOrAboveRole, isSystemAdmin } from '../../utils/calculator';

interface Option1LayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  staffList: Staff[];
  incidents: IncidentRecord[];
  questions: Question[];
  lines: DepartmentLine[];
  params: ParameterConfig;
  baselinePoints?: BaselinePoint[];
  onUpdateParams?: (newParams: ParameterConfig) => void;
  currentUser: AuthUser | null;
  isManager: boolean;
  userPasswords?: Record<string, string>;
  onOpenIncidentModal: (targetId?: string, type?: 'ghi_nhan' | 'vi_pham') => void;
  onOpenLoginModal: () => void;
  onLogout: () => void;
  onAddStaff: (staff: Staff) => void;
  onUpdateStaff?: (staff: Staff) => void;
  onDeleteStaff?: (staffId: string) => void;
  onUpdatePassword?: (userId: string, newPass: string) => void;
  onResetAllPasswords?: () => void;
  onRefreshCloud?: () => void;
  isRefreshingCloud?: boolean;
  onAddQuestion: (question: Question) => void;
  onUpdateQuestion?: (question: Question) => void;
  onDeleteQuestion?: (questionId: string) => void;
  onAddIncident: (incident: IncidentRecord) => void;
  onDeleteIncident?: (incidentId: string) => void;
  onRestoreIncident?: (incidentId: string) => void;
  onPermanentDeleteIncident?: (incidentId: string) => void;
  onUpdateStatus: (id: string, status: IncidentStatus) => void;
  onAppealIncident: (incidentId: string, reason: string) => void;
  onResolveAppeal: (incidentId: string, approved: boolean) => void;
  uiOption?: 'default' | 'option1';
  onSelectUiOption?: (option: 'default' | 'option1') => void;
}

export const Option1Layout: React.FC<Option1LayoutProps> = ({
  activeTab,
  setActiveTab,
  staffList,
  incidents,
  questions,
  lines,
  params,
  baselinePoints = [],
  onUpdateParams,
  currentUser,
  isManager,
  userPasswords = {},
  onOpenIncidentModal,
  onOpenLoginModal,
  onLogout,
  onAddStaff,
  onUpdateStaff,
  onDeleteStaff,
  onUpdatePassword,
  onResetAllPasswords,
  onRefreshCloud,
  isRefreshingCloud = false,
  onAddQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
  onAddIncident,
  onDeleteIncident,
  onRestoreIncident,
  onPermanentDeleteIncident,
  onUpdateStatus,
  onAppealIncident,
  onResolveAppeal,
  uiOption = 'option1',
  onSelectUiOption,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotebookLmModal, setShowNotebookLmModal] = useState(false);
  const [showAdminPasswordModal, setShowAdminPasswordModal] = useState(false);
  const [showFeedbackChoiceModal, setShowFeedbackChoiceModal] = useState(false);
  const [adminPasswordTargetId, setAdminPasswordTargetId] = useState<string | undefined>(undefined);
  const [cloudSyncInfo, setCloudSyncInfo] = useState<{ status: CloudSyncState; errorDetails: string | null }>({
    status: 'connecting',
    errorDetails: null
  });

  useEffect(() => {
    const unsub = onCloudStateChange((state) => {
      setCloudSyncInfo(state);
    });
    return () => unsub();
  }, []);

  const [configSubTab, setConfigSubTab] = useState<'policy' | 'questions' | 'baseline'>('policy');
  const [analyticsSubTab, setAnalyticsSubTab] = useState<'report' | 'guide'>('report');

  useEffect(() => {
    if (activeTab === 'questions' || activeTab === 'baseline' || activeTab === 'policy') {
      setConfigSubTab(activeTab as any);
    }
    if (activeTab === 'report' || activeTab === 'guide') {
      setAnalyticsSubTab(activeTab);
    }
  }, [activeTab]);

  const visibleIncidentsBadgeCount = React.useMemo(() => {
    if (!currentUser) return 0;
    const isUpperManager = isSystemAdmin(currentUser) || isHRHeadRole(currentUser) || isDeptHeadOrAboveRole(currentUser);
    if (isUpperManager) {
      return incidents.filter(i => !i.isDeleted && canUserViewIncident(currentUser, i, staffList)).length;
    }
    // Subordinates below Trưởng phòng: show count of received tickets
    return incidents.filter(i => !i.isDeleted && i.targetId === currentUser.id).length;
  }, [currentUser, incidents, staffList]);

  const navItems = [
    { id: 'summary', label: 'Tổng Quan', icon: LayoutDashboard },
    { id: 'staff', label: 'Nhân Sự', icon: Users },
    { id: 'incidents', label: 'Phản Hồi', icon: Trophy, badge: visibleIncidentsBadgeCount > 0 ? visibleIncidentsBadgeCount : undefined },
    { id: 'config', label: 'Cấu Hình', icon: Sliders },
    { id: 'analytics', label: 'Báo Cáo & Hướng Dẫn', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-emerald-950/5 text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white pb-8">
      
      {/* Glassmorphic Floating Top Header */}
      <header className="sticky top-2 z-40 px-3 sm:px-6 max-w-7xl w-full mx-auto print:hidden">
        <div className="backdrop-blur-xl bg-white/90 border border-slate-200/70 shadow-[0_4px_24px_rgba(0,0,0,0.06)] rounded-3xl px-3 sm:px-5 py-2 flex items-center justify-between transition-all duration-300 gap-2">
          
          {/* Brand Logo & Cloud Status Pill (Clean & No "StaffPoint" App Name) */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('summary')}
              className="group flex items-center gap-2 p-0.5 rounded-2xl hover:scale-105 transition-transform duration-200 cursor-pointer"
              title="Nhà Của Thời Thanh Xuân — Về trang tổng quan"
            >
              <img 
                src={logoImg} 
                alt="Logo Nhà Của Thời Thanh Xuân" 
                className="w-9 h-9 sm:w-10 sm:h-10 object-contain rounded-2xl bg-white p-1 shadow-xs ring-1 ring-emerald-500/25 border border-emerald-100 group-hover:ring-emerald-500/50 transition-all shrink-0" 
              />
            </button>

            {/* Cloud Status Pill & Quick Refresh (Minimal & Modern) */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200/80 shadow-2xs">
              <span 
                className="flex items-center justify-center shrink-0"
                title={cloudSyncInfo.status === 'connected' ? "Firebase Cloud: Đang kết nối Realtime" : "Firebase Cloud: Mất kết nối"}
              >
                <span className={`w-2 h-2 rounded-full ${cloudSyncInfo.status === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              </span>

              {onRefreshCloud && (
                <button
                  type="button"
                  onClick={onRefreshCloud}
                  disabled={isRefreshingCloud}
                  className="text-slate-400 hover:text-emerald-700 transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center"
                  title="Làm mới dữ liệu từ Firebase Cloud"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isRefreshingCloud ? 'animate-spin text-emerald-600' : ''}`} />
                </button>
              )}

              <span className="text-[10px] font-mono font-bold text-slate-400 border-l border-slate-200 pl-1.5 shrink-0 select-none">
                v1.008
              </span>
            </div>
          </div>

          {/* Desktop Glass Pill Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 backdrop-blur-md p-1 rounded-2xl border border-slate-200/80 shadow-inner shrink-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = 
                activeTab === item.id ||
                (item.id === 'config' && (activeTab === 'config' || activeTab === 'questions' || activeTab === 'baseline')) ||
                (item.id === 'analytics' && (activeTab === 'analytics' || activeTab === 'report' || activeTab === 'guide'));
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 relative whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-700 to-teal-700 text-white shadow-sm font-extrabold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                      isActive ? 'bg-white text-emerald-800' : 'bg-emerald-500/20 text-emerald-800'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right-side Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowFeedbackChoiceModal(true)}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white text-xs font-extrabold shadow-sm active:scale-95 transition-all duration-200 whitespace-nowrap cursor-pointer"
              title="Tạo phản hồi mới (Đánh giá hoặc Phản ánh nội quy)"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              <span>Tạo Phản Hồi</span>
            </button>

            {currentUser ? (
              <div className="flex items-center gap-1 bg-slate-100/90 backdrop-blur-md p-1 rounded-2xl border border-slate-200/80 shadow-inner">
                {/* User Profile Button */}
                <button
                  type="button"
                  onClick={onOpenLoginModal}
                  className="relative px-2.5 py-1 rounded-xl bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 border border-slate-200 shadow-2xs transition-all duration-200 active:scale-95 flex items-center gap-1.5 cursor-pointer text-xs font-bold"
                  title={`${currentUser.name} (${currentUser.role}) — Bấm để xem thông tin & đổi mật khẩu`}
                >
                  <User className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span className="hidden sm:inline-block max-w-[90px] truncate text-[11px] font-bold">{currentUser.name.split(' ').pop()}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white shrink-0"></span>
                </button>

                {/* Admin Password Management Button (Tích hợp gọn trong Account Icon Group) */}
                {isSystemAdmin(currentUser) && (
                  <button
                    type="button"
                    onClick={() => {
                      setAdminPasswordTargetId(undefined);
                      setShowAdminPasswordModal(true);
                    }}
                    className="p-1.5 text-amber-800 hover:text-amber-950 rounded-xl hover:bg-amber-100 bg-amber-50 border border-amber-300 transition-all duration-200 active:scale-95 flex items-center justify-center cursor-pointer shadow-2xs"
                    title="Quản lý & Đổi mật khẩu tất cả thành viên (Admin)"
                  >
                    <Key className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  </button>
                )}

                {/* Logout Button */}
                <button
                  type="button"
                  onClick={onLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all duration-200 active:scale-95 flex items-center justify-center cursor-pointer"
                  title="Đăng xuất khỏi hệ thống"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLoginModal}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md active:scale-95 transition-all whitespace-nowrap cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Đăng Nhập</span>
              </button>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:text-slate-900 rounded-2xl hover:bg-slate-100 transition-all border border-slate-200/80 active:scale-95 cursor-pointer shadow-2xs"
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-slate-700" /> : <Menu className="w-5 h-5 text-slate-700" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Backdrop & Modular Block Menu */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop Overlay to close when clicking outside */}
          <div 
            className="md:hidden fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="md:hidden fixed inset-x-3 top-20 z-50 max-h-[calc(100vh-5.5rem)] overflow-y-auto backdrop-blur-2xl bg-white/95 border border-white/90 shadow-2xl rounded-3xl p-3.5 space-y-3.5 transition-all duration-300 animate-in fade-in slide-in-from-top-4">
            
            {/* KHỐI 1: THÔNG TIN NGƯỜI DÙNG */}
            {currentUser ? (
              <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-50/90 via-teal-50/60 to-slate-50 border border-emerald-100 shadow-2xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-black text-xs flex items-center justify-center shadow-xs">
                      {currentUser.name.split(' ').slice(-2).map(n => n[0]).join('') || 'U'}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-black text-slate-900 truncate">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] font-semibold text-emerald-800 bg-emerald-100/70 border border-emerald-200/60 px-1.5 py-0.5 rounded-md inline-block max-w-full truncate mt-0.5">
                      {currentUser.role}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenLoginModal();
                    }}
                    className="p-2 rounded-xl bg-white text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200 shadow-2xs active:scale-95 transition-all text-xs cursor-pointer"
                    title="Xem thông tin / Đổi mật khẩu"
                  >
                    <User className="w-4 h-4 text-emerald-700" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="p-2 rounded-xl bg-white text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 shadow-2xs active:scale-95 transition-all text-xs cursor-pointer"
                    title="Đăng xuất"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-black text-slate-800">Chưa Đăng Nhập</div>
                  <div className="text-[10px] text-slate-500 font-medium">Đăng nhập để xem điểm và gửi phản hồi</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenLoginModal();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-xs active:scale-95 cursor-pointer"
                >
                  Đăng Nhập
                </button>
              </div>
            )}

            {/* KHỐI 2: DANH MỤC ĐIỀU HƯỚNG */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Danh Mục Chức Năng
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  5 phân hệ
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {navItems.map((item, idx) => {
                  const Icon = item.icon;
                  const isActive = 
                    activeTab === item.id ||
                    (item.id === 'config' && (activeTab === 'config' || activeTab === 'questions' || activeTab === 'baseline')) ||
                    (item.id === 'analytics' && (activeTab === 'analytics' || activeTab === 'report' || activeTab === 'guide'));
                  
                  const isFullWidth = idx === 4;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`group relative flex items-center gap-2.5 p-2.5 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer ${
                        isFullWidth ? 'col-span-2' : ''
                      } ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-700 to-teal-700 text-white shadow-md shadow-emerald-700/25 border border-emerald-600'
                          : 'bg-slate-50/90 hover:bg-slate-100 text-slate-700 border border-slate-200/70 shadow-2xs'
                      }`}
                    >
                      <div className={`p-1.5 rounded-xl shrink-0 transition-colors ${
                        isActive ? 'bg-white/20 text-white' : 'bg-white text-emerald-800 shadow-2xs border border-slate-200/60'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-xs font-bold leading-tight">
                          {item.label}
                        </div>
                        {isFullWidth && (
                          <div className={`text-[10px] font-medium leading-tight truncate mt-0.5 ${isActive ? 'text-emerald-100' : 'text-slate-400'}`}>
                            Xuất báo cáo, ma trận chuẩn & cẩm nang
                          </div>
                        )}
                      </div>

                      {item.badge && (
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold shrink-0 ${
                          isActive ? 'bg-white text-emerald-800' : 'bg-rose-500 text-white'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* KHỐI 3: TÁC VỤ NHANH */}
            <div className="space-y-1.5 pt-1 border-t border-slate-100">
              <div className="px-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Tác Vụ Nhanh
                </span>
              </div>

              {/* Nút Tạo Phản Hồi Mới (Chính) */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setShowFeedbackChoiceModal(true);
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-md shadow-emerald-600/25 active:scale-[0.99] transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <Plus className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-black leading-tight">Tạo Ghi Nhận / Vi Phạm Mới</div>
                    <div className="text-[10px] text-emerald-100 font-medium leading-tight">Khen thưởng hoặc lập biên bản</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-200 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Grid Các Tiện Ích Phụ (Đồng Bộ Cloud & Quản Lý Mật Khẩu / AI) */}
              <div className="grid grid-cols-2 gap-2 pt-0.5">
                {onRefreshCloud && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onRefreshCloud();
                    }}
                    disabled={isRefreshingCloud}
                    className="flex items-center gap-2 p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-700 font-bold text-xs shadow-2xs active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 text-left"
                  >
                    <div className="p-1.5 rounded-xl bg-white text-emerald-700 border border-slate-200/60 shadow-2xs shrink-0">
                      <RotateCw className={`w-3.5 h-3.5 ${isRefreshingCloud ? 'animate-spin' : ''}`} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-slate-800 truncate">Đồng Bộ Cloud</div>
                      <div className="text-[9px] text-slate-400 font-medium truncate">Làm mới dữ liệu</div>
                    </div>
                  </button>
                )}

                {isSystemAdmin(currentUser) ? (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setAdminPasswordTargetId(undefined);
                      setShowAdminPasswordModal(true);
                    }}
                    className="flex items-center gap-2 p-2.5 rounded-2xl bg-amber-50/80 hover:bg-amber-100/80 border border-amber-200 text-amber-900 font-bold text-xs shadow-2xs active:scale-[0.98] transition-all cursor-pointer text-left"
                  >
                    <div className="p-1.5 rounded-xl bg-amber-500 text-white shadow-2xs shrink-0">
                      <Key className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-amber-950 truncate">Mật Khẩu</div>
                      <div className="text-[9px] text-amber-700 font-medium truncate">Quản trị toàn bộ</div>
                    </div>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setShowNotebookLmModal(true);
                    }}
                    className="flex items-center gap-2 p-2.5 rounded-2xl bg-teal-50/80 hover:bg-teal-100/80 border border-teal-200 text-teal-900 font-bold text-xs shadow-2xs active:scale-[0.98] transition-all cursor-pointer text-left"
                  >
                    <div className="p-1.5 rounded-xl bg-teal-600 text-white shadow-2xs shrink-0">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-teal-950 truncate">Trợ Lý AI</div>
                      <div className="text-[9px] text-teal-700 font-medium truncate">Hỏi đáp nội quy</div>
                    </div>
                  </button>
                )}
              </div>
            </div>

          </div>
        </>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'summary' && (
          <Option1SummaryView
            staffList={staffList}
            incidents={incidents}
            questions={questions}
            params={params}
            onOpenIncidentModal={onOpenIncidentModal}
            isManager={isManager}
            currentUser={currentUser}
            onRefreshCloud={onRefreshCloud}
            isRefreshingCloud={isRefreshingCloud}
            onAppealIncident={onAppealIncident}
          />
        )}

        {activeTab === 'staff' && (
          <Option1StaffView
            staffList={staffList}
            lines={lines}
            onAddStaff={onAddStaff}
            onUpdateStaff={onUpdateStaff}
            onDeleteStaff={onDeleteStaff}
            onUpdatePassword={onUpdatePassword}
            isManager={isManager}
            params={params}
            currentUser={currentUser}
            onOpenIncidentModal={onOpenIncidentModal}
            onOpenAdminPasswordModal={(targetId) => {
              setAdminPasswordTargetId(targetId);
              setShowAdminPasswordModal(true);
            }}
          />
        )}

        {activeTab === 'incidents' && (
          <Option1IncidentsView
            incidents={incidents}
            staffList={staffList}
            questions={questions}
            onAddIncident={onAddIncident}
            onDeleteIncident={onDeleteIncident}
            onRestoreIncident={onRestoreIncident}
            onPermanentDeleteIncident={onPermanentDeleteIncident}
            onUpdateStatus={onUpdateStatus}
            isManager={isManager}
            onOpenIncidentModal={onOpenIncidentModal}
            onOpenChoiceModal={() => setShowFeedbackChoiceModal(true)}
            currentUser={currentUser}
            onAppealIncident={onAppealIncident}
            onResolveAppeal={onResolveAppeal}
          />
        )}

        {/* CONSOLIDATED TAB: Cấu Hình (10 Nội Quy, Tiêu Chí & Tham Số) */}
        {(activeTab === 'config' || activeTab === 'questions' || activeTab === 'baseline' || activeTab === 'policy') && (
          <div className="space-y-6">
            {/* Glass Sub-tab Switcher Bar */}
            <div className="bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-2 max-w-xl">
              <button
                type="button"
                onClick={() => setConfigSubTab('policy')}
                className={`flex-1 py-2 px-3 sm:px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  configSubTab === 'policy'
                    ? 'bg-gradient-to-r from-emerald-700 to-teal-700 text-white shadow-md shadow-emerald-700/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>🛡️ Chấp Hành & Hoàn Thành (100đ)</span>
              </button>

              <button
                type="button"
                onClick={() => setConfigSubTab('questions')}
                className={`flex-1 py-2 px-3 sm:px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  configSubTab === 'questions'
                    ? 'bg-gradient-to-r from-emerald-700 to-teal-700 text-white shadow-md shadow-emerald-700/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Tiêu Chí Đánh Giá</span>
              </button>

              <button
                type="button"
                onClick={() => setConfigSubTab('baseline')}
                className={`flex-1 py-2 px-3 sm:px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  configSubTab === 'baseline'
                    ? 'bg-gradient-to-r from-emerald-700 to-teal-700 text-white shadow-md shadow-emerald-700/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>Tham Số System</span>
              </button>
            </div>

            {/* Sub-tab 1 Content: 10 Nội Quy (100đ) */}
            {configSubTab === 'policy' && (
              <PolicyView
                staffList={staffList}
                incidents={incidents}
                params={params}
                onUpdateParams={onUpdateParams}
                currentUser={currentUser}
                onAppealIncident={onAppealIncident}
                selectedPeriodKey="2026-10"
                onOpenIncidentModal={onOpenIncidentModal}
              />
            )}

            {/* Sub-tab 2 Content: Tiêu Chí */}
            {configSubTab === 'questions' && (
              <Option1QuestionsView
                questions={questions}
                lines={lines}
                onAddQuestion={onAddQuestion}
                onUpdateQuestion={onUpdateQuestion}
                onDeleteQuestion={onDeleteQuestion}
                isManager={isManager}
                currentUser={currentUser}
              />
            )}

            {/* Sub-tab 2 Content: Tham Số */}
            {configSubTab === 'baseline' && (
              <BaselineView
                baselinePoints={baselinePoints}
                params={params}
                onUpdateParams={onUpdateParams || (() => {})}
                currentUser={currentUser}
              />
            )}
          </div>
        )}

        {/* CONSOLIDATED TAB 2: Báo Cáo & Hướng Dẫn */}
        {(activeTab === 'analytics' || activeTab === 'report' || activeTab === 'guide') && (
          <div className="space-y-6">
            {/* Glass Sub-tab Switcher Bar */}
            <div className="bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-2 max-w-md">
              <button
                type="button"
                onClick={() => setAnalyticsSubTab('report')}
                className={`flex-1 py-2 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  analyticsSubTab === 'report'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Báo Cáo Phân Tích</span>
              </button>

              <button
                type="button"
                onClick={() => setAnalyticsSubTab('guide')}
                className={`flex-1 py-2 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  analyticsSubTab === 'guide'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>Hướng Dẫn Sử Dụng</span>
              </button>
            </div>

            {/* Sub-tab 1 Content: Báo Cáo */}
            {analyticsSubTab === 'report' && (
              <Option1ReportView
                staffList={staffList}
                incidents={incidents}
                lines={lines}
                params={params}
                currentUser={currentUser}
                questions={questions}
              />
            )}

            {/* Sub-tab 2 Content: Hướng Dẫn */}
            {analyticsSubTab === 'guide' && (
              <GuideView />
            )}
          </div>
        )}
      </main>

      {/* Sticky Floating Action Button (FAB) on Left: NotebookLM AI Rules & Guidelines Lookup */}
      <div className="fixed left-5 bottom-5 z-40 print:hidden flex items-center gap-2">
        <button
          onClick={() => setShowNotebookLmModal(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#1B4332] via-[#2D6A4F] to-emerald-500 text-white shadow-xl shadow-emerald-900/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-white/90 backdrop-blur-md relative group"
          title="Mở NotebookLM - Tra cứu Sổ tay quy định & Lỗi vi phạm AI"
        >
          <Sparkles className="w-6 h-6 text-emerald-300 animate-pulse" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white animate-ping"></span>
        </button>
      </div>

      {/* Floating Action Button (FAB) on Right for Mobile */}
      <button
        onClick={() => setShowFeedbackChoiceModal(true)}
        className="md:hidden fixed right-5 bottom-5 z-40 w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-xl shadow-emerald-600/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-white/80 backdrop-blur-md print:hidden cursor-pointer"
        title="Tạo phản hồi mới"
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* Modal Popup Lựa Chọn Loại Phản Hồi ("Đánh giá" vs "Phản ánh nội quy") */}
      {showFeedbackChoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in print:hidden">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-5 transform transition-all animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-2xl">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Tạo Phản Hồi Mới</h3>
                  <p className="text-xs text-slate-500 font-medium">Vui lòng chọn hình thức bạn muốn tạo</p>
                </div>
              </div>
              <button
                onClick={() => setShowFeedbackChoiceModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3.5 pt-1">
              {/* Lựa chọn 1: Ghi nhận và đánh giá */}
              <button
                onClick={() => {
                  setShowFeedbackChoiceModal(false);
                  onOpenIncidentModal(undefined, 'ghi_nhan');
                }}
                className="group relative p-4 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50/40 to-emerald-100/30 hover:from-emerald-100 hover:to-teal-100/80 border border-emerald-200 text-left transition-all duration-200 hover:shadow-md cursor-pointer flex items-start gap-4"
              >
                <div className="p-3 bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-2xl shadow-sm shrink-0 group-hover:scale-110 transition-all duration-200">
                  <ClipboardCheck className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-[#1B4332] group-hover:text-emerald-950">
                      📝 Ghi nhận và đánh giá
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900 text-[10px] font-black font-mono">
                      Thang 5.0đ
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Ghi nhận thành tích, khen thưởng tuyên dương hoặc đánh giá hiệu quả công việc (Thang điểm 5.0).
                  </p>
                </div>
              </button>

              {/* Lựa chọn 2: Nội quy */}
              <button
                onClick={() => {
                  setShowFeedbackChoiceModal(false);
                  onOpenIncidentModal(undefined, 'vi_pham');
                }}
                className="group relative p-4 rounded-2xl bg-gradient-to-br from-amber-50/80 via-rose-50/40 to-orange-100/30 hover:from-amber-100/90 hover:to-rose-100/80 border border-rose-200 text-left transition-all duration-200 hover:shadow-md cursor-pointer flex items-start gap-4"
              >
                <div className="p-3 bg-gradient-to-br from-rose-600 to-amber-600 text-white rounded-2xl shadow-sm shrink-0 group-hover:scale-110 transition-all duration-200">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-rose-950 group-hover:text-rose-900">
                      📋 Mức độ chấp hành & hoàn thành công việc
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-200/80 text-rose-900 text-[10px] font-black font-mono">
                      100đ Chấp hành
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Lập biên bản phản ánh vi phạm mức độ chấp hành & hoàn thành công việc (Quỹ điểm 100đ).
                  </p>
                </div>
              </button>
            </div>

            <div className="pt-2 text-center border-t border-slate-100">
              <button
                onClick={() => setShowFeedbackChoiceModal(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 py-1.5 px-4 rounded-xl transition-all cursor-pointer"
              >
                Đóng / Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Interactive In-App AI Chat Assistant Modal */}
      <AiChatModal
        isOpen={showNotebookLmModal}
        onClose={() => setShowNotebookLmModal(false)}
        questions={questions}
        staffList={staffList}
        lines={lines}
        params={params}
        currentUser={currentUser}
      />

      {/* Admin Password Reset & Management Modal */}
      <AdminPasswordModal
        isOpen={showAdminPasswordModal}
        onClose={() => setShowAdminPasswordModal(false)}
        staffList={staffList}
        userPasswords={userPasswords}
        onUpdatePassword={onUpdatePassword || (() => {})}
        onResetAllPasswords={onResetAllPasswords}
        currentUser={currentUser}
        initialSelectedStaffId={adminPasswordTargetId}
      />
    </div>
  );
};


