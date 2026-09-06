import React, { useState } from 'react';
import { 
  Staff, 
  IncidentRecord, 
  Question, 
  DepartmentLine, 
  ParameterConfig, 
  AuthUser 
} from '../../types';

import { Option1SummaryView } from './Option1SummaryView';
import { Option1StaffView } from './Option1StaffView';
import { Option1IncidentsView } from './Option1IncidentsView';
import { Option1QuestionsView } from './Option1QuestionsView';
import { Option1ReportView } from './Option1ReportView';
import { GuideView } from '../GuideView';

import { 
  LayoutDashboard, 
  Users, 
  Trophy, 
  Layers, 
  BarChart3, 
  HelpCircle, 
  Plus, 
  LogOut, 
  LogIn, 
  Sparkles,
  Smartphone,
  Monitor,
  Menu,
  X
} from 'lucide-react';

interface Option1LayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  staffList: Staff[];
  incidents: IncidentRecord[];
  questions: Question[];
  lines: DepartmentLine[];
  params: ParameterConfig;
  currentUser: AuthUser | null;
  isManager: boolean;
  onOpenIncidentModal: (targetId?: string, type?: 'ghi_nhan' | 'vi_pham') => void;
  onOpenLoginModal: () => void;
  onLogout: () => void;
  onAddStaff: (staff: Staff) => void;
  onAddQuestion: (question: Question) => void;
  onDeleteQuestion?: (questionId: string) => void;
  onAddIncident: (incident: IncidentRecord) => void;
  onUpdateStatus: (id: string, status: 'Đã duyệt' | 'Từ chối') => void;
  onAppealIncident: (incidentId: string, reason: string) => void;
  onResolveAppeal: (incidentId: string, approved: boolean) => void;
}

export const Option1Layout: React.FC<Option1LayoutProps> = ({
  activeTab,
  setActiveTab,
  staffList,
  incidents,
  questions,
  lines,
  params,
  currentUser,
  isManager,
  onOpenIncidentModal,
  onOpenLoginModal,
  onLogout,
  onAddStaff,
  onAddQuestion,
  onDeleteQuestion,
  onAddIncident,
  onUpdateStatus,
  onAppealIncident,
  onResolveAppeal,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'summary', label: 'Tổng Quan', icon: LayoutDashboard },
    { id: 'staff', label: 'Nhân Sự', icon: Users },
    { id: 'incidents', label: 'Phản Hồi', icon: Trophy, badge: incidents.length },
    { id: 'questions', label: 'Tiêu Chí', icon: Layers },
    { id: 'report', label: 'Báo Cáo', icon: BarChart3 },
    { id: 'guide', label: 'Hướng Dẫn', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Fixed Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo & UI Option Switcher */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-700 to-teal-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-emerald-700/20">
              🌱
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base tracking-tight text-slate-900">
                  StaffPoint <span className="text-emerald-600 font-mono text-xs">v3.0</span>
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                  Option 1
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                Nhà Của Thời Thanh Xuân
              </p>
            </div>
          </div>

          {/* Desktop Tab Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Header Controls: Account */}
          <div className="flex items-center gap-2">

            {/* Account Profile / Login Button */}
            {currentUser ? (
              <div className="flex items-center gap-2 bg-slate-50 p-1 pl-2.5 rounded-2xl border border-slate-200">
                <div className="text-left text-xs hidden lg:block">
                  <div className="font-bold text-slate-800 leading-tight">{currentUser.name}</div>
                  <div className="text-[10px] text-emerald-700 font-semibold">{currentUser.role}</div>
                </div>
                <button
                  onClick={onLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-all"
                  title="Đăng xuất"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLoginModal}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Đăng Nhập</span>
              </button>
            )}
          </div>
        </div>
      </header>

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
            onUpdateStatus={onUpdateStatus}
            isManager={isManager}
            onOpenIncidentModal={onOpenIncidentModal}
            currentUser={currentUser}
            onAppealIncident={onAppealIncident}
            onResolveAppeal={onResolveAppeal}
          />
        )}

        {activeTab === 'questions' && (
          <Option1QuestionsView
            questions={questions}
            lines={lines}
            onAddQuestion={onAddQuestion}
            onDeleteQuestion={onDeleteQuestion}
            isManager={isManager}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'report' && (
          <Option1ReportView
            staffList={staffList}
            incidents={incidents}
            lines={lines}
            params={params}
            currentUser={currentUser}
            questions={questions}
          />
        )}

        {activeTab === 'guide' && (
          <GuideView />
        )}
      </main>

      {/* Floating Action Button (FAB) on Mobile */}
      {isManager && (
        <button
          onClick={() => onOpenIncidentModal()}
          className="md:hidden fixed right-5 bottom-20 z-40 w-14 h-14 rounded-full bg-emerald-600 text-white shadow-xl shadow-emerald-600/40 flex items-center justify-center hover:bg-emerald-700 active:scale-95 transition-all print:hidden"
          title="Tạo phản hồi mới"
        >
          <Plus className="w-7 h-7" />
        </button>
      )}

      {/* Bottom Fixed Navigation Bar (Mobile iOS/Android Optimized) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-2 py-2 flex items-center justify-around shadow-lg print:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all relative ${
                isActive
                  ? 'text-emerald-700 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-600 font-medium'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] leading-tight">{item.label}</span>
              {isActive && (
                <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-0.5"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
