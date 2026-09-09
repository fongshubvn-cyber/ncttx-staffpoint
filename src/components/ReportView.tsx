import React, { useState, useMemo, useEffect } from 'react';
import { Staff, IncidentRecord, DepartmentLine, ParameterConfig, AuthUser, Question } from '../types';
import { exportReportToGoogleSheet, exportBatchMonthlyToGoogleSheet } from '../utils/exportDrive';
import { getStaffCriteriaBreakdown, getTrackScoreDetails } from '../utils/reportHelper';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Star, 
  Trophy, 
  Megaphone, 
  Printer, 
  Building2, 
  ShieldCheck, 
  FileSpreadsheet,
  Award,
  AlertTriangle,
  CheckCircle2,
  PieChart,
  User,
  Clock,
  Calendar,
  Image as ImageIcon,
  FileText,
  FileDown,
  Search,
  Check,
  Scale,
  BookOpen,
  Layers
} from 'lucide-react';

interface ReportViewProps {
  staffList: Staff[];
  incidents: IncidentRecord[];
  lines: DepartmentLine[];
  params: ParameterConfig;
  currentUser: AuthUser | null;
  questions?: Question[];
}

export const ReportView: React.FC<ReportViewProps> = ({
  staffList,
  incidents,
  lines,
  params,
  currentUser,
  questions = [],
}) => {
  // Realtime Timestamp state (updates every second)
  const [realtimeClock, setRealtimeClock] = useState<string>('');
  const [globalFilter, setGlobalFilter] = useState<'all' | 'vi_pham' | 'ghi_nhan'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const dateStr = now.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
      setRealtimeClock(`${timeStr} - ${dateStr}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filtered staff list based on permissions
  const visibleStaffList = useMemo(() => {
    return (currentUser?.isAdmin 
      ? staffList 
      : staffList.filter(s => s.id === currentUser?.id)
    ).slice().sort((a, b) => {
      const numA = parseInt(a.id.replace(/\D/g, ''), 10);
      const numB = parseInt(b.id.replace(/\D/g, ''), 10);
      return numA - numB;
    });
  }, [staffList, currentUser]);

  // Selected staff ID for Individual Staff Report
  const [selectedStaffId, setSelectedStaffId] = useState<string>(
    currentUser?.isAdmin 
      ? (staffList[0]?.id || '')
      : (currentUser?.id || staffList[0]?.id || '')
  );

  useEffect(() => {
    if (!currentUser?.isAdmin && currentUser?.id) {
      setSelectedStaffId(currentUser.id);
    }
  }, [currentUser]);

  const targetStaff = visibleStaffList.find(s => s.id === selectedStaffId) || visibleStaffList[0];

  // Dynamically compute the 3 most recent monthly reporting periods
  const recentPeriods = useMemo(() => {
    const now = new Date();
    const list = [];
    for (let i = 0; i < 3; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const m = d.getMonth() + 1;
      const y = d.getFullYear();
      const mStr = String(m).padStart(2, '0');
      const key = `${y}-${mStr}`;
      const label = i === 0 
        ? `Tháng ${mStr}/${y} (Kỳ hiện tại)` 
        : `Tháng ${mStr}/${y}`;
      list.push({ key, label, mStr, year: y, isCurrent: i === 0 });
    }
    return list;
  }, []);

  const [selectedPeriodKey, setSelectedPeriodKey] = useState<string>(recentPeriods[0].key);
  const currentPeriodObj = recentPeriods.find(p => p.key === selectedPeriodKey) || recentPeriods[0];

  // Filter incidents for selected reporting period (last 3 months)
  const periodIncidents = useMemo(() => {
    return incidents.filter(inc => {
      if (inc.isDeleted) return false;
      const [yStr, mStr] = selectedPeriodKey.split('-');
      const patternSlash = `${mStr}/${yStr}`; // e.g. "09/2026"
      const patternDash = `${yStr}-${mStr}`;  // e.g. "2026-09"

      if (inc.createdAt && inc.createdAt.startsWith(patternDash)) return true;
      if (inc.date) {
        if (inc.date.includes(patternSlash)) return true;
        if (inc.date.startsWith(patternDash)) return true;
      }
      // Fallback for demo incidents if viewing current month
      if (selectedPeriodKey === recentPeriods[0].key) return true;
      return false;
    });
  }, [incidents, selectedPeriodKey, recentPeriods]);

  // Incidents for selected staff member in selected reporting period
  const staffIncidents = useMemo(() => {
    if (!targetStaff) return [];
    return periodIncidents.filter(i => i.targetId === targetStaff.id);
  }, [periodIncidents, targetStaff]);

  const staffViolations = useMemo(() => {
    return staffIncidents.filter(i => i.type === 'vi_pham');
  }, [staffIncidents]);

  const staffRecognitions = useMemo(() => {
    return staffIncidents.filter(i => i.type === 'ghi_nhan');
  }, [staffIncidents]);

  const criteriaBreakdown = useMemo(() => {
    if (!targetStaff) return null;
    return getStaffCriteriaBreakdown(targetStaff, questions, lines, staffIncidents);
  }, [targetStaff, questions, lines, staffIncidents]);

  const trackInfo = useMemo(() => {
    if (!targetStaff) return null;
    return getTrackScoreDetails(targetStaff, params);
  }, [targetStaff, params]);

  // Global Filtered Incidents across whole company for selected reporting period
  const filteredAllIncidents = useMemo(() => {
    return periodIncidents.filter(i => {
      if (globalFilter !== 'all' && i.type !== globalFilter) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          i.targetName.toLowerCase().includes(term) ||
          i.reporterName.toLowerCase().includes(term) ||
          i.description.toLowerCase().includes(term) ||
          (i.title && i.title.toLowerCase().includes(term)) ||
          (i.groupCode && i.groupCode.toLowerCase().includes(term))
        );
      }
      return true;
    });
  }, [periodIncidents, globalFilter, searchTerm]);

  // Global Analytics for selected period
  const totalStaff = staffList.length;

  const avgGeneralScore = useMemo(() => {
    if (totalStaff === 0) return 0;
    const sum = staffList.reduce((acc, s) => acc + (s.generalScore || 0), 0);
    return Number((sum / totalStaff).toFixed(2));
  }, [staffList, totalStaff]);

  const avgTechScore = useMemo(() => {
    if (totalStaff === 0) return 0;
    const sum = staffList.reduce((acc, s) => acc + (s.techScore || 0), 0);
    return Number((sum / totalStaff).toFixed(2));
  }, [staffList, totalStaff]);

  const avgTotalScore = useMemo(() => {
    if (totalStaff === 0) return 0;
    const sum = staffList.reduce((acc, s) => acc + (s.totalScore || 0), 0);
    return Number((sum / totalStaff).toFixed(2));
  }, [staffList, totalStaff]);

  // Active Report View Mode ('individual' | 'company')
  const [activeReportTab, setActiveReportTab] = useState<'individual' | 'company'>('individual');
  const [isExportingSheet, setIsExportingSheet] = useState(false);

  const handleExportPDF = () => {
    window.print();
  };

  const handleExportGoogleSheet = async () => {
    if (!targetStaff) return;
    setIsExportingSheet(true);
    try {
      const targetIncidents = incidents.filter(i => i.targetId === targetStaff.id);
      await exportReportToGoogleSheet(targetStaff, selectedPeriodKey, targetIncidents, params, questions, lines);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExportingSheet(false);
    }
  };

  const handleExportBatchGoogleSheet = async () => {
    setIsExportingSheet(true);
    try {
      await exportBatchMonthlyToGoogleSheet(staffList, selectedPeriodKey, incidents, params);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExportingSheet(false);
    }
  };

  const getQuestionText = (qId?: string, groupCode?: string) => {
    if (qId) {
      const q = questions.find(item => item.id === qId);
      if (q) return q.text;
    }
    return undefined;
  };

  return (
    <div className="space-y-4 pb-20 print:p-0 print:pb-0 print:space-y-2">
      
      {/* Realtime Clock Banner & Period Selector */}
      <div className="mobile-card p-3.5 sm:p-4 border border-[#1B4332]/10 bg-white space-y-2.5 shadow-sm print:p-2.5 print:space-y-1.5">
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center space-x-1.5 text-[#2D6A4F] text-[11px] sm:text-xs font-bold font-heading uppercase tracking-wider">
            <BarChart3 className="w-4 h-4 text-[#2D6A4F] shrink-0" />
            <span>Hệ thống Báo cáo Nhân sự NCTTX</span>
          </div>

          <div className="flex items-center space-x-1 text-[10px] sm:text-xs font-mono font-bold text-[#2D6A4F] bg-emerald-50 px-2.5 py-0.5 sm:py-1 rounded-full border border-emerald-200 shadow-sm shrink-0 whitespace-nowrap">
            <Clock className="w-3 h-3 text-[#2D6A4F] animate-pulse shrink-0" />
            <span>Realtime: {realtimeClock}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <h2 className="text-sm sm:text-lg font-bold font-heading text-[#1B4332] leading-tight">
            Báo Cáo Chi Tiết Điểm Số & Lỗi Vi Phạm Nhân Sự 📊
          </h2>
        </div>

        {/* REPORTING PERIOD SELECTOR (3 RECENT MONTHS) */}
        <div className="p-2 sm:p-2.5 rounded-2xl bg-[#EDEAE3]/70 border border-slate-200 space-y-1.5 print:bg-white print:border-none print:p-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
            <span className="text-[11px] sm:text-xs font-black text-[#1B4332] flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-[#2D6A4F] shrink-0" />
              <span>Chọn Kỳ Báo Cáo (Lưu 3 tháng gần nhất):</span>
            </span>
            <span className="text-[10px] font-mono font-extrabold text-[#2D6A4F] bg-white px-2 py-0.5 rounded-full border border-slate-200 whitespace-nowrap">
              Đang xem: {currentPeriodObj.label}
            </span>
          </div>

          {/* Period selector buttons */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-0.5 print:hidden">
            {recentPeriods.map((p) => (
              <button
                key={p.key}
                onClick={() => setSelectedPeriodKey(p.key)}
                className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-extrabold transition-all whitespace-nowrap active:scale-95 ${
                  selectedPeriodKey === p.key
                    ? 'bg-[#2D6A4F] text-white shadow-sm border border-[#2D6A4F]'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* TOP TAB VIEW SWITCHER BUTTONS */}
        <div className="flex items-center space-x-2 pt-1 border-t border-slate-100 print:hidden">
          <button
            onClick={() => setActiveReportTab('individual')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1.5 active:scale-95 ${
              activeReportTab === 'individual'
                ? 'bg-[#1B4332] text-white shadow-md border border-[#1B4332]'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5 text-[#52B788] shrink-0" />
            <span>Báo Cáo Cá Nhân Nhân Sự</span>
          </button>

          <button
            onClick={() => setActiveReportTab('company')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1.5 active:scale-95 ${
              activeReportTab === 'company'
                ? 'bg-[#1B4332] text-white shadow-md border border-[#1B4332]'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-[#52B788] shrink-0" />
            <span>Báo Cáo Toàn Công Ty</span>
          </button>
        </div>
      </div>

      {/* SECTION A: BÁO CÁO CÁ NHÂN HÓA DÀNH CHO 1 NHÂN SỰ */}
      {activeReportTab === 'individual' && targetStaff && (
        <div className="mobile-card p-4 sm:p-5 border-2 border-[#2D6A4F]/30 bg-white space-y-4 shadow-md relative overflow-hidden print:p-3 print:space-y-2">
          
          {/* Employee Selector & Dedicated Action Buttons Bar */}
          <div className="space-y-2 border-b border-slate-100 pb-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center space-x-1.5 text-xs font-extrabold text-[#1B4332] font-heading shrink-0">
                <User className="w-4 h-4 text-[#2D6A4F] shrink-0" />
                <span>Chọn Nhân Sự Để Báo Cáo:</span>
                {!currentUser?.isAdmin && (
                  <span className="text-[10px] font-bold text-[#2D6A4F] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    🔒 Cá nhân
                  </span>
                )}
              </div>

              {/* Action Buttons inline right next to Title */}
              <div className="flex items-center space-x-1.5 shrink-0 print:hidden">
                <button
                  onClick={handleExportGoogleSheet}
                  disabled={isExportingSheet}
                  className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] sm:text-xs font-bold shadow-sm transition-all flex items-center justify-center space-x-1.5 active:scale-95 min-h-[34px] disabled:opacity-50"
                  title="Xuất dữ liệu báo cáo cá nhân sang Google Sheet / Drive"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-100 shrink-0" />
                  <span>{isExportingSheet ? 'Đang xuất...' : 'Xuất Google Sheet'}</span>
                </button>

                <button
                  onClick={handleExportPDF}
                  className="px-2.5 py-1.5 rounded-xl bg-[#2D6A4F] hover:bg-[#1B4332] text-white text-[11px] sm:text-xs font-bold shadow-sm transition-all flex items-center justify-center space-x-1.5 active:scale-95 min-h-[34px]"
                  title="Xuất báo cáo cá nhân nhân sự ra tệp PDF"
                >
                  <FileDown className="w-3.5 h-3.5 text-[#52B788] shrink-0" />
                  <span>Xuất PDF</span>
                </button>

                <button
                  onClick={handleExportPDF}
                  className="px-2 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center space-x-1 min-h-[34px]"
                  title="In trực tiếp"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="hidden sm:inline">In</span>
                </button>
              </div>
            </div>

            {/* Employee Dropdown Select */}
            {currentUser?.isAdmin ? (
              <select
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
                className="w-full p-2.5 bg-[#EDEAE3] border border-emerald-900/20 rounded-xl text-xs font-black text-[#1B4332] focus:outline-none shadow-sm"
              >
                {visibleStaffList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.id} - {s.name} ({s.role} - {s.line})
                  </option>
                ))}
              </select>
            ) : (
              <div className="w-full p-2.5 bg-[#1B4332] text-white rounded-xl text-xs font-bold flex items-center justify-between">
                <span>{targetStaff.name} ({targetStaff.role})</span>
                <span className="font-mono text-[#52B788] font-black">{targetStaff.id}</span>
              </div>
            )}
          </div>

          {/* Individual Staff Summary Card */}
          <div className="bg-[#EDEAE3]/60 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-0.5">
                <span className="font-mono text-[10px] font-extrabold text-[#1B4332] bg-white px-2 py-0.5 rounded-full border border-slate-200">
                  {targetStaff.id}
                </span>
                <h3 className="text-base sm:text-lg font-bold font-heading text-[#1B4332]">{targetStaff.name}</h3>
                <p className="text-xs text-[#2D6A4F] font-bold">{targetStaff.role} • {targetStaff.line}</p>
              </div>

              <div className="text-right shrink-0">
                <span className="px-2.5 py-1 rounded-full bg-[#1B4332] text-[#52B788] text-xs font-black border border-[#2D6A4F] flex items-center space-x-1 shadow-sm">
                  <Star className="w-3 h-3 text-[#52B788] fill-[#52B788]" />
                  <span>Bậc {targetStaff.salaryTier} / 5</span>
                </span>
                <p className="text-[10px] font-bold text-slate-500 mt-1">Hệ số P2 tháng</p>
              </div>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
              <div className="bg-white p-1.5 sm:p-2 rounded-xl border border-slate-200">
                <span className="text-[9px] sm:text-[10px] text-slate-500 font-bold block">Văn Hóa</span>
                <strong className="text-[#1B4332] font-black text-xs sm:text-sm">{targetStaff.generalScore}</strong>
                <span className="text-[8px] sm:text-[9px] text-slate-400 block">/ 5.0</span>
              </div>

              <div className="bg-white p-1.5 sm:p-2 rounded-xl border border-slate-200">
                <span className="text-[9px] sm:text-[10px] text-slate-500 font-bold block">Chuyên Môn</span>
                <strong className="text-[#1B4332] font-black text-xs sm:text-sm">{targetStaff.techScore}</strong>
                <span className="text-[8px] sm:text-[9px] text-slate-400 block">/ 5.0</span>
              </div>

              <div className="bg-white p-1.5 sm:p-2 rounded-xl border border-slate-200">
                <span className="text-[9px] sm:text-[10px] text-slate-500 font-bold block">Quản Lý</span>
                <strong className="text-[#1B4332] font-black text-xs sm:text-sm">{targetStaff.mgmtScore ?? '---'}</strong>
                <span className="text-[8px] sm:text-[9px] text-slate-400 block">/ 5.0</span>
              </div>

              <div className="bg-[#2D6A4F] text-white p-1.5 sm:p-2 rounded-xl shadow-sm">
                <span className="text-[9px] sm:text-[10px] text-emerald-200 font-bold block">TỔNG ĐIỂM</span>
                <strong className="text-xs sm:text-base font-black">{targetStaff.totalScore.toFixed(2)}</strong>
                <span className="text-[8px] sm:text-[9px] text-emerald-200 block">/ 5.0</span>
              </div>
            </div>
          </div>

          {/* NEW: DETAILED SCORE BREAKDOWN FOR EVERY GROUP UNDER GENERAL & SPECIFIC TRACKS (DANH SÁCH MỤC CHUNG -> CHI TIẾT MỤC) */}
          {criteriaBreakdown && (
            <div className="space-y-4 pt-2">
              {/* Common Groups Breakdown (Mục chung -> Chi tiết mục) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <h4 className="text-xs font-black font-heading text-[#1B4332] flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#2D6A4F]" />
                    <span>Chi Tiết Ngạch Văn Hóa Chung (Mục chung ➔ Chi tiết mục)</span>
                  </h4>
                  <span className="text-[10px] font-bold text-[#2D6A4F] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Áp dụng 100% NV
                  </span>
                </div>

                <div className="space-y-2">
                  {criteriaBreakdown.commonGroups.map(g => (
                    <div key={g.groupCode} className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-[10px] font-black text-[#1B4332] bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                            {g.groupCode}
                          </span>
                          <strong className="text-xs font-black text-slate-900">{g.groupName}</strong>
                        </div>
                        <span className="text-xs font-black text-[#2D6A4F] font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {g.achievedScore.toFixed(2)} / 5.0đ
                        </span>
                      </div>

                      {/* Child Sub-items List (Chi tiết mục) */}
                      <div className="pl-4 pt-1 space-y-1 border-t border-slate-100 text-[11px]">
                        {g.items.map(item => (
                          <div key={item.id} className="flex items-center justify-between text-slate-700 py-0.5">
                            <span className="flex items-center space-x-1">
                              <span className="font-mono text-[9px] font-bold text-slate-500">{item.id}:</span>
                              <span>{item.text}</span>
                            </span>
                            <span className="font-mono font-bold text-[#1B4332] shrink-0 pl-2">
                              {item.effectiveScore.toFixed(2)}đ
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dept Specific Groups Breakdown (Mục chung -> Chi tiết mục) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <h4 className="text-xs font-black font-heading text-[#1B4332] flex items-center space-x-1.5">
                    <Building2 className="w-4 h-4 text-[#2D6A4F]" />
                    <span>Chi Tiết Ngạch Chuyên Môn [{targetStaff.line}] (Mục chung ➔ Chi tiết mục)</span>
                  </h4>
                  <span className="text-[10px] font-bold text-[#2D6A4F] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Ngạch riêng phòng ban
                  </span>
                </div>

                <div className="space-y-2">
                  {criteriaBreakdown.deptGroups.map(g => (
                    <div key={g.groupCode} className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-[10px] font-black text-teal-900 bg-teal-100 px-2 py-0.5 rounded border border-teal-300">
                            {g.groupCode}
                          </span>
                          <strong className="text-xs font-black text-slate-900">{g.groupName}</strong>
                        </div>
                        <span className="text-xs font-black text-teal-800 font-mono bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          {g.achievedScore.toFixed(2)} / 5.0đ
                        </span>
                      </div>

                      {/* Child Sub-items List (Chi tiết mục) */}
                      <div className="pl-4 pt-1 space-y-1 border-t border-slate-100 text-[11px]">
                        {g.items.map(item => (
                          <div key={item.id} className="flex items-center justify-between text-slate-700 py-0.5">
                            <span className="flex items-center space-x-1">
                              <span className="font-mono text-[9px] font-bold text-slate-500">{item.id}:</span>
                              <span>{item.text}</span>
                            </span>
                            <span className="font-mono font-bold text-teal-900 shrink-0 pl-2">
                              {item.effectiveScore.toFixed(2)}đ
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Individual Violations Section (Hiển thị CHI TIẾT ĐẦY ĐỦ LỖI VI PHẠM) */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold font-heading text-[#DD6B20] flex items-center space-x-1.5">
                <span>📢 Chi Tiết Các Lỗi Vi Phạm ({staffViolations.length} biên bản)</span>
              </h4>
              <span className="text-[10px] font-bold text-[#DD6B20] bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                Cập nhật Realtime
              </span>
            </div>

            {staffViolations.length > 0 ? (
              <div className="space-y-3">
                {staffViolations.map((v) => {
                  const matchedQuestionText = getQuestionText(v.questionId, v.groupCode);
                  return (
                    <div 
                      key={v.id}
                      className="p-4 rounded-2xl bg-amber-50/80 border-2 border-amber-300 space-y-2.5 text-xs shadow-sm"
                    >
                      {/* Badge Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-mono text-[10px] font-black text-amber-900 bg-amber-200 px-2.5 py-0.5 rounded-md border border-amber-400">
                            {v.id}
                          </span>
                          {v.groupCode && (
                            <span className="font-mono text-[10px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded border border-rose-300">
                              Mã: {v.groupCode}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-1.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-700 text-white shadow-sm">
                            {v.impactPoints}đ
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900 border border-amber-300">
                            {v.severity}
                          </span>
                        </div>
                      </div>

                      {/* Standard Matched Question Text if present */}
                      {matchedQuestionText && (
                        <div className="p-2 rounded-xl bg-amber-100/70 border border-amber-300/80 text-[11px] text-amber-950 font-semibold space-y-0.5">
                          <span className="text-[10px] font-extrabold text-[#DD6B20] block uppercase">Tiêu chí vi phạm chuẩn:</span>
                          <p>{matchedQuestionText}</p>
                        </div>
                      )}

                      {/* FULL VIOLATION ERROR DESCRIPTION */}
                      <div className="bg-white p-3 rounded-xl border border-amber-200 space-y-1 shadow-inner">
                        <p className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider flex items-center space-x-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-[#DD6B20] shrink-0" />
                          <span>Chi tiết diễn biến lỗi vi phạm:</span>
                        </p>
                        <p className="text-xs text-slate-900 font-medium leading-relaxed pt-0.5">
                          {v.description}
                        </p>
                      </div>

                      {/* Realtime creation timestamp & Reporter Info */}
                      <div className="flex items-center justify-between text-[11px] text-slate-700 pt-1 border-t border-amber-200/80 font-medium">
                        <span>Người lập biên bản: <strong className="text-[#1B4332] font-bold">{v.reporterName}</strong></span>
                        <span className="font-mono font-bold text-[#DD6B20] flex items-center space-x-1 bg-white px-2 py-0.5 rounded border border-amber-200">
                          <Clock className="w-3 h-3 text-[#DD6B20] shrink-0" />
                          <span>{v.date}</span>
                        </span>
                      </div>

                      {/* Attached Image Evidence */}
                      {v.imageUrl && (
                        <div className="pt-1">
                          <p className="text-[10px] font-extrabold text-slate-600 mb-1 flex items-center space-x-1">
                            <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                            <span>Hình ảnh minh chứng lỗi vi phạm:</span>
                          </p>
                          <img 
                            src={v.imageUrl} 
                            alt="Minh chứng vi phạm" 
                            className="w-full max-h-56 object-cover rounded-xl border border-amber-400 shadow-sm cursor-pointer hover:opacity-95 transition-opacity"
                            onClick={() => window.open(v.imageUrl, '_blank')}
                          />
                        </div>
                      )}

                      {/* 48h Appeal status indicator */}
                      {v.appealReason && (
                        <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-[11px] text-purple-900 space-y-1">
                          <div className="flex items-center justify-between font-bold text-purple-900">
                            <span className="flex items-center space-x-1">
                              <Scale className="w-3.5 h-3.5 text-purple-700" />
                              <span>Trình bày kháng nghị 48h:</span>
                            </span>
                            <span className="text-[10px] px-2 py-0.2 rounded-full bg-purple-200 text-purple-900">
                              {v.status}
                            </span>
                          </div>
                          <p className="italic text-slate-800 bg-white p-2 rounded-lg border border-purple-200">{v.appealReason}</p>
                          {v.appealDate && <p className="text-[9px] text-purple-700 font-mono">Thời gian kháng nghị: {v.appealDate}</p>}
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 italic">
                ✅ Nhân sự này tuân thủ tốt, không có biên bản vi phạm nào.
              </div>
            )}
          </div>

          {/* Individual Recognitions Section (GHI NHẬN KHEN THƯỞNG CHI TIẾT) */}
          <div className="space-y-2.5 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold font-heading text-[#2D6A4F] flex items-center space-x-1.5">
                <span>🌟 Chi Tiết Các Phiếu Khen Thưởng ({staffRecognitions.length} phiếu)</span>
              </h4>
              <span className="text-[10px] font-bold text-[#2D6A4F] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Cập nhật Realtime
              </span>
            </div>

            {staffRecognitions.length > 0 ? (
              <div className="space-y-2.5">
                {staffRecognitions.map((r) => (
                  <div 
                    key={r.id}
                    className="p-3.5 rounded-2xl bg-emerald-50/80 border-2 border-emerald-300 space-y-2 text-xs shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-[#1B4332] bg-emerald-100 px-2.5 py-0.5 rounded border border-emerald-300">
                        {r.id} {r.groupCode ? `• [${r.groupCode}]` : ''}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#2D6A4F] text-white shadow-sm">
                        +{r.impactPoints}đ
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-emerald-200 space-y-1">
                      <p className="text-[10px] font-extrabold text-[#2D6A4F] uppercase tracking-wider">Nội dung tuyên dương ghi nhận:</p>
                      <p className="text-xs font-medium text-slate-900 leading-relaxed">
                        {r.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-600 pt-0.5 font-medium">
                      <span>Người ghi nhận: <strong className="text-[#1B4332] font-bold">{r.reporterName}</strong></span>
                      <span className="font-mono font-bold text-[#2D6A4F] flex items-center space-x-1 bg-white px-2 py-0.5 rounded border border-emerald-200">
                        <Clock className="w-3 h-3 text-[#2D6A4F] shrink-0" />
                        <span>{r.date}</span>
                      </span>
                    </div>

                    {r.imageUrl && (
                      <div className="pt-1">
                        <img 
                          src={r.imageUrl} 
                          alt="Minh chứng khen thưởng" 
                          className="w-full max-h-48 object-cover rounded-xl border border-emerald-300 cursor-pointer hover:opacity-95 transition-opacity"
                          onClick={() => window.open(r.imageUrl, '_blank')}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-400 italic">
                Chưa có phiếu khen thưởng nào.
              </div>
            )}
          </div>

        </div>
      )}

      {/* SECTION B: BÁO CÁO TỔNG QUAN TOÀN CÔNG TY (BÁO CÁO CHUNG) */}
      {activeReportTab === 'company' && (
        <div className="space-y-4 pt-1">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h3 className="text-base font-extrabold font-heading text-[#1B4332] flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-[#2D6A4F] shrink-0" />
                <span>Báo Cáo Tổng Quan Toàn Công Ty 🌐</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Thống kê điểm số trung bình và toàn bộ nhật ký vi phạm/tuyên dương các phòng ban</p>
            </div>

            <div className="flex items-center space-x-2 print:hidden shrink-0">
              <button
                onClick={handleExportBatchGoogleSheet}
                disabled={isExportingSheet}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center space-x-1.5 active:scale-95 disabled:opacity-50"
                title="Đồng bộ bảng điểm của 33 nhân sự trong tháng này sang Google Sheet"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-100 shrink-0" />
                <span>{isExportingSheet ? 'Đang đồng bộ...' : 'Đồng bộ Cả Tháng sang Google Sheet'}</span>
              </button>

              <button
                onClick={handleExportPDF}
                className="px-3.5 py-1.5 rounded-xl bg-[#2D6A4F] hover:bg-[#1B4332] text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center space-x-1.5 active:scale-95"
              >
                <Printer className="w-4 h-4 text-[#52B788] shrink-0" />
                <span>In / Xuất PDF</span>
              </button>
            </div>
          </div>

        {/* 1. Executive Summary Grid (4 Metrics) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="mobile-card p-3 bg-white border border-slate-200 space-y-0.5">
            <div className="flex items-center justify-between text-slate-500 font-bold">
              <span>Tổng Nhân Sự</span>
              <Users className="w-3.5 h-3.5 text-[#2D6A4F]" />
            </div>
            <p className="text-lg sm:text-xl font-black text-[#1B4332]">{totalStaff} bạn</p>
            <p className="text-[9px] text-slate-400 font-medium">100% mã TTX</p>
          </div>

          <div className="mobile-card p-3 bg-white border border-slate-200 space-y-0.5">
            <div className="flex items-center justify-between text-slate-500 font-bold">
              <span>Đ.TB Văn Hóa</span>
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            </div>
            <p className="text-lg sm:text-xl font-black text-[#2D6A4F]">{avgGeneralScore} / 5.0</p>
            <p className="text-[9px] text-emerald-600 font-bold">16 nhóm văn hóa</p>
          </div>

          <div className="mobile-card p-3 bg-white border border-slate-200 space-y-0.5">
            <div className="flex items-center justify-between text-slate-500 font-bold">
              <span>Đ.TB Tổng Thể</span>
              <TrendingUp className="w-3.5 h-3.5 text-[#2D6A4F]" />
            </div>
            <p className="text-lg sm:text-xl font-black text-[#1B4332]">{avgTotalScore} / 5.0</p>
            <p className="text-[9px] text-slate-400 font-medium">Chuyên môn: {avgTechScore}</p>
          </div>

          <div className="mobile-card p-3 bg-white border border-slate-200 space-y-0.5">
            <div className="flex items-center justify-between text-slate-500 font-bold">
              <span>Tổng Phiếu</span>
              <Award className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <p className="text-lg sm:text-xl font-black text-purple-900">{incidents.filter(i => !i.isDeleted).length} phiếu</p>
            <p className="text-[9px] text-slate-500 font-medium">🌟 {incidents.filter(i => !i.isDeleted && i.type==='ghi_nhan').length} | 📢 {incidents.filter(i => !i.isDeleted && i.type==='vi_pham').length}</p>
          </div>
        </div>

        {/* 2. MOVED HERE AS REQUESTED: TOÀN BỘ NHẬT KÝ KHEN THƯỞNG & VI PHẠM REALTIME IN BÁO CÁO CHUNG */}
        <div className="mobile-card p-4 sm:p-5 bg-white border border-slate-200 space-y-3.5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
            <div>
              <h3 className="text-sm font-extrabold font-heading text-[#1B4332] flex items-center space-x-1.5">
                <FileText className="w-4 h-4 text-[#2D6A4F] shrink-0" />
                <span>Toàn Bộ Nhật Ký Khen Thưởng & Vi Phạm Realtime ({filteredAllIncidents.length} sự việc)</span>
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">Xem chi tiết các lỗi vi phạm và tuyên dương toàn bộ nhân sự công ty</p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center space-x-1 shrink-0 print:hidden">
              <button
                onClick={() => setGlobalFilter('all')}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                  globalFilter === 'all' ? 'bg-[#1B4332] text-white shadow' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setGlobalFilter('vi_pham')}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                  globalFilter === 'vi_pham' ? 'bg-[#DD6B20] text-white shadow' : 'bg-amber-50 text-[#DD6B20]'
                }`}
              >
                📢 Vi phạm
              </button>
              <button
                onClick={() => setGlobalFilter('ghi_nhan')}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                  globalFilter === 'ghi_nhan' ? 'bg-[#2D6A4F] text-white shadow' : 'bg-emerald-50 text-[#2D6A4F]'
                }`}
              >
                🌟 Khen thưởng
              </button>
            </div>
          </div>

          {/* Search Input for All Incidents */}
          <div className="relative print:hidden">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo tên bạn nhân sự, nội dung chi tiết lỗi vi phạm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#2D3748] placeholder-slate-400 focus:outline-none focus:border-[#2D6A4F]"
            />
          </div>

          {/* Incidents Timeline */}
          <div className="space-y-3 pt-1">
            {filteredAllIncidents.length > 0 ? (
              filteredAllIncidents.map((inc) => {
                const isV = inc.type === 'vi_pham';
                return (
                  <div 
                    key={inc.id}
                    className={`p-3.5 rounded-2xl border text-xs space-y-2 ${
                      isV ? 'bg-amber-50/60 border-amber-200' : 'bg-emerald-50/60 border-emerald-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                          isV ? 'bg-[#DD6B20] text-white' : 'bg-[#2D6A4F] text-white'
                        }`}>
                          {isV ? '📢 VI PHẠM' : '🌟 KHEN THƯỞNG'}
                        </span>
                        <span className="font-mono text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {inc.id}
                        </span>
                      </div>

                      <span className="font-mono text-[10px] font-bold text-slate-500 flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{inc.date}</span>
                      </span>
                    </div>

                    {/* Target & Reporter Header */}
                    <div className="flex items-center justify-between text-xs bg-white p-2 rounded-xl border border-slate-200/80">
                      <div>
                        <span className="text-slate-500">Đối tượng: </span>
                        <strong className="text-[#1B4332] font-extrabold">{inc.targetName}</strong>
                        <span className="text-[10px] text-slate-500"> ({inc.targetRole})</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Người lập: </span>
                        <strong className="text-slate-800 font-bold">{inc.reporterName}</strong>
                      </div>
                    </div>

                    {/* FULL ERROR DESCRIPTION */}
                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-0.5">
                      <p className="text-[10px] font-extrabold text-slate-500 uppercase">Nội dung chi tiết sự việc:</p>
                      <p className="text-xs text-slate-800 font-medium leading-relaxed">{inc.description}</p>
                    </div>

                    {inc.imageUrl && (
                      <div className="pt-0.5">
                        <img 
                          src={inc.imageUrl} 
                          alt="Minh chứng" 
                          className="w-full max-h-44 object-cover rounded-xl border border-slate-200"
                        />
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 italic text-center py-4">Không tìm thấy dữ liệu vi phạm hay khen thưởng tương ứng.</p>
            )}
          </div>
        </div>

      </div>
      )}

    </div>
  );
};
