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
  ExternalLink
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
  onOpenIncidentModal: (targetId?: string, type?: 'ghi_nhan' | 'vi_pham') => void;
  onOpenLoginModal: () => void;
  onLogout: () => void;
  onAddStaff: (staff: Staff) => void;
  onUpdateStaff?: (staff: Staff) => void;
  onDeleteStaff?: (staffId: string) => void;
  onUpdatePassword?: (userId: string, newPass: string) => void;
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
  onOpenIncidentModal,
  onOpenLoginModal,
  onLogout,
  onAddStaff,
  onUpdateStaff,
  onDeleteStaff,
  onUpdatePassword,
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
    { id: 'config', label: 'Cấu Hình', icon: Sliders },
    { id: 'analytics', label: 'Báo Cáo & Hướng Dẫn', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-emerald-950/5 text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white pb-8">
      
      {/* Glassmorphic Floating Top Header */}
      <header className="sticky top-2 z-40 px-3 sm:px-6 max-w-7xl w-full mx-auto print:hidden">
        <div className="backdrop-blur-xl bg-white/75 border border-white/60 shadow-[0_8px_32px_0_rgba(16,185,129,0.08)] rounded-3xl px-4 py-2.5 flex items-center justify-between transition-all duration-300">
          
          {/* Brand Logo & Cloud Status Badge */}
          <div className="flex items-center gap-3">
            <img 
              src={logoImg} 
              alt="Nhà Của Thời Thanh Xuân Logo" 
              className="w-10 h-10 object-contain rounded-2xl bg-white p-1 shadow-md ring-2 ring-emerald-500/20 shrink-0 border border-emerald-100" 
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base tracking-tight text-slate-900 flex items-center gap-1.5 whitespace-nowrap">
                  StaffPoint 
                  <span className="text-emerald-600 font-mono text-xs bg-emerald-500/10 px-1.5 py-0.5 rounded-md border border-emerald-500/20">
                    v3.0
                  </span>
                </h1>

                {/* Cloud Sync Status Badge */}
                <div 
                  className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border backdrop-blur-md transition-all ${
                    cloudSyncInfo.status === 'error'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : cloudSyncInfo.status === 'connected'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                  title={cloudSyncInfo.status === 'connected' ? "Đã kết nối Firebase Cloud Realtime Sync" : "Trạng thái kết nối"}
                >
                  {cloudSyncInfo.status === 'connected' ? (
                    <>
                      <Cloud className="w-3 h-3 text-emerald-600 animate-pulse" />
                      <span>Cloud Live</span>
                    </>
                  ) : (
                    <>
                      <CloudOff className="w-3 h-3 text-rose-500" />
                      <span>Sync Off</span>
                    </>
                  )}
                </div>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                Nhà Của Thời Thanh Xuân
              </p>
            </div>
          </div>

          {/* Desktop Glass Pill Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-200/50 backdrop-blur-md p-1.5 rounded-2xl border border-white/80 shadow-inner">
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
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 relative whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30 transform scale-[1.02]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                      isActive ? 'bg-white text-emerald-700' : 'bg-emerald-500/20 text-emerald-800'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Header Controls: Actions & Profile */}
          <div className="flex items-center gap-2">

            {/* Quick Action Button for Managers (Desktop) */}
            {isManager && (
              <button
                onClick={() => onOpenIncidentModal()}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-600/25 active:scale-95 transition-all duration-200 whitespace-nowrap"
                title="Tạo ghi nhận / vi phạm mới"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tạo Phản Hồi</span>
              </button>
            )}

            {/* Account Profile / Login Button */}
            {currentUser ? (
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md p-1 pl-3 rounded-2xl border border-white/80 shadow-sm">
                <button
                  type="button"
                  onClick={onOpenLoginModal}
                  className="text-left text-xs hidden lg:block hover:opacity-80 transition-opacity cursor-pointer"
                  title="Xem thông tin tài khoản / Đổi mật khẩu"
                >
                  <div className="font-extrabold text-slate-800 leading-tight flex items-center gap-1 whitespace-nowrap">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-bold whitespace-nowrap">{currentUser.role}</div>
                </button>
                <button
                  onClick={onLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50/80 transition-all"
                  title="Đăng xuất"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLoginModal}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md shadow-slate-900/20 active:scale-95 transition-all whitespace-nowrap"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Đăng Nhập</span>
              </button>
            )}

            {/* Mobile Menu Button */}
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

      {/* Mobile Glass Menu Dropdown Modal */}
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

      {/* Main Content View Container */}
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

      {/* NotebookLM AI Knowledge Base Modal */}
      {showNotebookLmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn print:hidden">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                  <Sparkles className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base leading-tight">
                    Google NotebookLM — Trợ Lý AI Tra Cứu Quy Định & Lỗi Vi Phạm
                  </h3>
                  <p className="text-[11px] text-emerald-200 font-medium mt-0.5">
                    Hỏi đáp thông minh từ Sổ tay quy chế & Ma trận tiêu chí Nhà Của Thời Thanh Xuân
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowNotebookLmModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-7 space-y-5 overflow-y-auto flex-1 bg-gradient-to-b from-slate-50 to-white">
              
              {/* Google Security & Link Banner */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-slate-800 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-black text-emerald-900 uppercase tracking-wider">
                      Google NotebookLM AI Workspace
                    </span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md border border-emerald-200">
                    Bảo mật Google Cloud
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Để đảm bảo tính bảo mật và quyền truy cập tài khoản Google của bạn, Google NotebookLM hoạt động tối ưu nhất trên cửa sổ làm việc độc lập.
                </p>
              </div>

              {/* Main Action Launcher Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1B4332] via-[#2D6A4F] to-emerald-900 text-white shadow-xl space-y-5 border border-emerald-400/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none"></div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-400/20 text-emerald-200 text-xs font-extrabold border border-emerald-400/30">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Sổ Tay AI Trực Tuyến</span>
                    </div>
                    <h4 className="text-lg font-black tracking-tight text-white">
                      Nhà Của Thời Thanh Xuân — NotebookLM
                    </h4>
                    <p className="text-xs text-emerald-100/80 max-w-lg">
                      Đặt câu hỏi bằng ngôn ngữ tự nhiên để AI tổng hợp tức thì các quy định, thang điểm, tiêu chí vi phạm và hướng dẫn xử lý sự cố.
                    </p>
                  </div>

                  <a
                    href={params.notebookLmUrl || 'https://notebooklm.google.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-sm transition-all transform hover:scale-[1.03] active:scale-95 shadow-lg shadow-emerald-950/40 whitespace-nowrap group shrink-0"
                  >
                    <span>Mở NotebookLM Trong Tab Mới</span>
                    <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </div>

                {/* Prompt Suggestions */}
                <div className="border-t border-white/10 pt-4 space-y-2">
                  <span className="text-[11px] font-extrabold text-emerald-200 uppercase tracking-wider block">
                    Gợi ý câu hỏi phổ biến:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-emerald-50 hover:bg-white/15 transition-all">
                      💬 "Nội quy về giờ giấc & văn hóa ứng xử ở các nhà?"
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-emerald-50 hover:bg-white/15 transition-all">
                      💬 "Các tiêu chí vi phạm ranh giới đỏ gồm những mục nào?"
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-emerald-50 hover:bg-white/15 transition-all">
                      💬 "Quy trình giải trình & khiếu nại phản hồi nhân sự?"
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-emerald-50 hover:bg-white/15 transition-all">
                      💬 "Cách tính điểm thưởng & đánh giá xếp loại nhân sự?"
                    </div>
                  </div>
                </div>
              </div>

              {/* URL Reference Box */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 overflow-hidden w-full">
                  <span className="font-extrabold text-slate-700 shrink-0">Link NotebookLM:</span>
                  <code className="bg-slate-100 px-2.5 py-1 rounded-lg text-slate-600 truncate font-mono text-[11px] flex-1">
                    {params.notebookLmUrl || 'https://notebooklm.google.com'}
                  </code>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(params.notebookLmUrl || 'https://notebooklm.google.com');
                    alert('Đã sao chép đường dẫn NotebookLM!');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all text-xs shrink-0"
                >
                  Sao Chép Link
                </button>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-slate-500 font-medium">
                💡 Bạn có thể tùy chỉnh lại đường dẫn NotebookLM này tại mục <strong>Cấu hình ➔ Tham số hệ thống</strong>.
              </span>
              <button
                onClick={() => setShowNotebookLmModal(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-sm w-full sm:w-auto"
              >
                Đóng Cửa Sổ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


