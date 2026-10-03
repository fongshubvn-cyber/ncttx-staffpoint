import React, { useState, useEffect } from 'react';
import logoImg from '../../assets/logo.png';
import { 
  Staff, 
  IncidentRecord, 
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
  ShieldCheck
} from 'lucide-react';
import { onCloudStateChange, CloudSyncState } from '../../config/firebase';
import { canUserViewIncident, isHRHeadRole, isDeptHeadOrAboveRole } from '../../utils/calculator';

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
  onUpdateStatus: (id: string, status: 'Đã duyệt' | 'Từ chối') => void;
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

  const [configSubTab, setConfigSubTab] = useState<'questions' | 'baseline'>('questions');
  const [analyticsSubTab, setAnalyticsSubTab] = useState<'report' | 'guide'>('report');

  useEffect(() => {
    if (activeTab === 'questions' || activeTab === 'baseline') {
      setConfigSubTab(activeTab);
    }
    if (activeTab === 'report' || activeTab === 'guide') {
      setAnalyticsSubTab(activeTab);
    }
  }, [activeTab]);

  const visibleIncidentsBadgeCount = React.useMemo(() => {
    if (!currentUser) return 0;
    const isUpperManager = currentUser.isAdmin || currentUser.id === 'ADMIN' || isHRHeadRole(currentUser) || isDeptHeadOrAboveRole(currentUser);
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
    { id: 'policy', label: '🛡️ Nội Quy (100đ)', icon: ShieldCheck },
    { id: 'config', label: 'Cấu Hình', icon: Sliders },
    { id: 'analytics', label: 'Báo Cáo & Hướng Dẫn', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-emerald-950/5 text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white pb-8">
      
      {/* Glassmorphic Floating Top Header */}
      <header className="sticky top-2 z-40 px-3 sm:px-6 max-w-7xl w-full mx-auto print:hidden">
        <div className="backdrop-blur-xl bg-white/85 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-3xl px-3.5 sm:px-5 py-2 flex items-center justify-between transition-all duration-300 gap-2 overflow-hidden">
          
          {/* Brand Logo & Cloud Status */}
          <div className="flex items-center gap-2.5 shrink-0">
            <img 
              src={logoImg} 
              alt="Nhà Của Thời Thanh Xuân Logo" 
              className="w-9 h-9 object-contain rounded-2xl bg-white p-1 shadow-sm ring-1 ring-emerald-500/20 shrink-0 border border-emerald-100" 
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 flex items-center gap-1.5 whitespace-nowrap font-sans">
                  StaffPoint 
                  <span className="text-emerald-700 font-mono text-[10px] font-extrabold bg-emerald-50 px-1.5 py-0.2 rounded-md border border-emerald-200 shrink-0">
                    v1.002
                  </span>
                </h1>

                {/* Cloud Status Dot Indicator: Green (Online) / Red (Offline) */}
                <div 
                  className={`flex items-center justify-center w-5 h-5 rounded-full border transition-all shrink-0 ${
                    cloudSyncInfo.status === 'connected'
                      ? 'bg-emerald-50 border-emerald-300'
                      : 'bg-rose-50 border-rose-300'
                  }`}
                  title={cloudSyncInfo.status === 'connected' ? "Firebase Cloud Sync: Online (Đang hoạt động)" : "Firebase Cloud Sync: Offline"}
                >
                  <span className={`w-2 h-2 rounded-full ${cloudSyncInfo.status === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                </div>

                {/* Refresh Cloud Button (Gọn gàng với Icon Refresh) */}
                {onRefreshCloud && (
                  <button
                    type="button"
                    onClick={onRefreshCloud}
                    disabled={isRefreshingCloud}
                    className="p-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-all cursor-pointer shadow-2xs active:scale-95 disabled:opacity-50 shrink-0 flex items-center justify-center"
                    title="Làm mới dữ liệu từ Firebase Cloud Firestore"
                  >
                    <RotateCw className={`w-3.5 h-3.5 text-emerald-700 ${isRefreshingCloud ? 'animate-spin' : ''}`} />
                  </button>
                )}
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden 2xl:block leading-tight">
                Nhà Của Thời Thanh Xuân
              </p>
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
          <div className="flex items-center gap-1.5 shrink-0">
            {isManager && (
              <button
                onClick={() => onOpenIncidentModal()}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white text-xs font-extrabold shadow-sm active:scale-95 transition-all duration-200 whitespace-nowrap cursor-pointer"
                title="Tạo ghi nhận / vi phạm mới"
              >
                <Plus className="w-3.5 h-3.5 shrink-0" />
                <span>Tạo Phản Hồi</span>
              </button>
            )}

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
                {currentUser.isAdmin && (
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
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-2xl hover:bg-slate-200/50 transition-all"
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-3 top-20 z-50 backdrop-blur-2xl bg-white/90 border border-white/80 shadow-2xl rounded-3xl p-4 transition-all duration-300 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-extrabold text-sm text-slate-900">Danh Mục Menu</span>
            </div>
            {currentUser && (
              <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {currentUser.name} ({currentUser.role})
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = 
                activeTab === item.id ||
                (item.id === 'config' && (activeTab === 'config' || activeTab === 'questions' || activeTab === 'baseline')) ||
                (item.id === 'analytics' && (activeTab === 'analytics' || activeTab === 'report' || activeTab === 'guide'));
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2.5 p-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'bg-slate-100/70 text-slate-700 hover:bg-slate-200/70'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="whitespace-nowrap">{item.label}</span>
                </button>
              );
            })}
          </div>

          {onRefreshCloud && (
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onRefreshCloud();
              }}
              disabled={isRefreshingCloud}
              className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
            >
              <RotateCw className={`w-4 h-4 ${isRefreshingCloud ? 'animate-spin' : ''}`} />
              <span>Làm Mới Dữ Liệu Cloud</span>
            </button>
          )}

          {currentUser?.isAdmin && (
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setAdminPasswordTargetId(undefined);
                setShowAdminPasswordModal(true);
              }}
              className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-amber-500 text-white font-bold text-xs shadow-md shadow-amber-500/20"
            >
              <Key className="w-4 h-4" />
              <span>Quản Lý Mật Khẩu Tất Cả Thành Viên</span>
            </button>
          )}

          {isManager && (
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenIncidentModal();
              }}
              className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-md shadow-emerald-600/30"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo Ghi Nhận / Vi Phạm Mới</span>
            </button>
          )}
        </div>
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
            currentUser={currentUser}
            onAppealIncident={onAppealIncident}
            onResolveAppeal={onResolveAppeal}
          />
        )}

        {activeTab === 'policy' && (
          <PolicyView
            staffList={staffList}
            incidents={incidents}
            params={params}
            onUpdateParams={onUpdateParams}
            currentUser={currentUser}
            onAppealIncident={onAppealIncident}
            selectedPeriodKey="2026-10"
          />
        )}

        {/* CONSOLIDATED TAB 1: Cấu Hình (Tiêu Chí & Tham Số) */}
        {(activeTab === 'config' || activeTab === 'questions' || activeTab === 'baseline') && (
          <div className="space-y-6">
            {/* Glass Sub-tab Switcher Bar */}
            <div className="bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-2 max-w-md">
              <button
                type="button"
                onClick={() => setConfigSubTab('questions')}
                className={`flex-1 py-2 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  configSubTab === 'questions'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Tiêu Chí Đánh Giá</span>
              </button>

              <button
                type="button"
                onClick={() => setConfigSubTab('baseline')}
                className={`flex-1 py-2 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  configSubTab === 'baseline'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>Tham Số System</span>
              </button>
            </div>

            {/* Sub-tab 1 Content: Tiêu Chí */}
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
      {isManager && (
        <button
          onClick={() => onOpenIncidentModal()}
          className="md:hidden fixed right-5 bottom-5 z-40 w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-xl shadow-emerald-600/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-white/80 backdrop-blur-md print:hidden"
          title="Tạo phản hồi mới"
        >
          <Plus className="w-7 h-7" />
        </button>
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


