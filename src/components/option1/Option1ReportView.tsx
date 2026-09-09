import React, { useState, useEffect, useMemo } from 'react';
import { Staff, IncidentRecord, DepartmentLine, ParameterConfig, AuthUser, Question } from '../../types';
import { getSalaryTierBadge, calculateSalaryTier, getVisibleStaffListForUser } from '../../utils/calculator';
import { getStaffCriteriaBreakdown, getTrackScoreDetails, EvaluatedCriterion, GroupScoreDetail } from '../../utils/reportHelper';
import { 
  BarChart3, 
  Printer, 
  Clock, 
  User,
  FileSpreadsheet,
  Layers,
  Award,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Search,
  BookOpen,
  Building2,
  ShieldCheck,
  Star,
  ChevronDown,
  ChevronRight,
  ListTree
} from 'lucide-react';
import { exportReportToGoogleSheet } from '../../utils/exportDrive';

interface Option1ReportViewProps {
  staffList: Staff[];
  incidents: IncidentRecord[];
  lines: DepartmentLine[];
  params: ParameterConfig;
  currentUser: AuthUser | null;
  questions?: Question[];
}

export const Option1ReportView: React.FC<Option1ReportViewProps> = ({
  staffList,
  incidents,
  lines,
  params,
  currentUser,
  questions = [],
}) => {
  const [realtimeClock, setRealtimeClock] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isExportingSheet, setIsExportingSheet] = useState<boolean>(false);
  const [expandedGroupMap, setExpandedGroupMap] = useState<Record<string, boolean>>({});

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

  // Filter staff list according to user permission rank
  const visibleStaffList = useMemo(() => {
    return getVisibleStaffListForUser(currentUser, staffList).slice().sort((a, b) => {
      const numA = parseInt(a.id.replace(/\D/g, ''), 10);
      const numB = parseInt(b.id.replace(/\D/g, ''), 10);
      return numA - numB;
    });
  }, [staffList, currentUser]);

  const [selectedStaffId, setSelectedStaffId] = useState<string>(
    currentUser?.isAdmin ? (visibleStaffList[0]?.id || '') : (currentUser?.id || visibleStaffList[0]?.id || '')
  );

  useEffect(() => {
    if (visibleStaffList.length > 0 && !visibleStaffList.some(s => s.id === selectedStaffId)) {
      setSelectedStaffId(visibleStaffList[0].id);
    }
  }, [visibleStaffList, selectedStaffId]);

  const selectedStaff = visibleStaffList.find(s => s.id === selectedStaffId) || visibleStaffList[0];
  const staffIncidents = useMemo(() => {
    if (!selectedStaff) return [];
    return incidents.filter(i => !i.isDeleted && i.targetId === selectedStaff.id);
  }, [incidents, selectedStaff]);

  // Compute criteria matrix and track breakdown
  const criteriaBreakdown = useMemo(() => {
    if (!selectedStaff) return null;
    return getStaffCriteriaBreakdown(selectedStaff, questions, lines, staffIncidents);
  }, [selectedStaff, questions, lines, staffIncidents]);

  const trackInfo = useMemo(() => {
    if (!selectedStaff) return null;
    return getTrackScoreDetails(selectedStaff, params);
  }, [selectedStaff, params]);

  // Initialize all groups expanded by default
  useEffect(() => {
    if (criteriaBreakdown) {
      const map: Record<string, boolean> = {};
      criteriaBreakdown.groupedDetails.forEach(g => {
        map[g.groupCode] = true;
      });
      setExpandedGroupMap(map);
    }
  }, [selectedStaffId]);

  const toggleGroupExpand = (code: string) => {
    setExpandedGroupMap(prev => ({
      ...prev,
      [code]: !prev[code]
    }));
  };

  const expandAllGroups = () => {
    if (!criteriaBreakdown) return;
    const map: Record<string, boolean> = {};
    criteriaBreakdown.groupedDetails.forEach(g => { map[g.groupCode] = true; });
    setExpandedGroupMap(map);
  };

  const collapseAllGroups = () => {
    setExpandedGroupMap({});
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportSheet = async () => {
    if (!selectedStaff) return;
    setIsExportingSheet(true);
    try {
      await exportReportToGoogleSheet(selectedStaff, 'Tháng Hiện Tại', staffIncidents, params, questions, lines);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExportingSheet(false);
    }
  };

  if (!selectedStaff || !criteriaBreakdown || !trackInfo) return null;

  const salaryTierNum = calculateSalaryTier(selectedStaff.totalScore, params);
  const tier = getSalaryTierBadge(salaryTierNum);

  // Helper render for a Grouped List Section (Mục chung ➔ Chi tiết mục)
  const renderGroupedListSection = (
    title: string,
    groups: GroupScoreDetail[],
    trackScore: number,
    icon: React.ReactNode,
    badgeBg: string,
    badgeText: string
  ) => {
    const filteredGroups = groups.filter(g => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return g.groupCode.toLowerCase().includes(term) ||
        g.groupName.toLowerCase().includes(term) ||
        g.items.some(i => i.id.toLowerCase().includes(term) || i.text.toLowerCase().includes(term));
    });

    return (
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-slate-200 pb-2">
          <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
            {icon}
            <span>{title} ({groups.length} mục chính)</span>
          </h3>
          <span className={`text-[10px] font-black ${badgeText} ${badgeBg} px-2.5 py-0.5 rounded-full border border-slate-300 shadow-sm whitespace-nowrap`}>
            Điểm TB Ngạch: {trackScore.toFixed(2)} / 5.0đ
          </span>
        </div>

        <div className="space-y-3">
          {filteredGroups.length > 0 ? (
            filteredGroups.map((g) => {
              const isExpanded = expandedGroupMap[g.groupCode] !== false;
              return (
                <div 
                  key={g.groupCode}
                  className="rounded-2xl border-2 border-slate-200 bg-white overflow-hidden shadow-sm transition-all"
                >
                  {/* PARENT HEADER ROW (MỤC CHUNG) */}
                  <div 
                    onClick={() => toggleGroupExpand(g.groupCode)}
                    className="p-3 sm:p-3.5 bg-slate-50 hover:bg-slate-100/80 cursor-pointer flex items-center justify-between gap-2 border-b border-slate-200/80 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <button className="p-1 text-slate-500 hover:text-slate-900 rounded-lg shrink-0 print:hidden">
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>
                      
                      <span className="font-mono text-xs font-black text-emerald-950 bg-emerald-100 px-2.5 py-0.5 rounded border border-emerald-300 shrink-0">
                        {g.groupCode}
                      </span>

                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                          {g.groupName}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-medium">
                          {g.subCriteriaCount} tiêu chí chi tiết bên trong
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {g.violationsCount > 0 ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-300">
                          📢 {g.violationsCount} vi phạm (-{g.penaltyPoints}đ)
                        </span>
                      ) : g.recognitionsCount > 0 ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                          🌟 {g.recognitionsCount} khen thưởng (+{g.bonusPoints}đ)
                        </span>
                      ) : null}

                      <div className="text-right pl-2 border-l border-slate-200">
                        <span className="text-[9px] text-slate-400 font-bold block uppercase">Số điểm mục</span>
                        <strong className="text-sm sm:text-base font-black text-emerald-800 font-mono">
                          {g.achievedScore.toFixed(2)}đ
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* CHILD SUB-ITEMS LIST (CHI TIẾT MỤC) */}
                  {isExpanded && (
                    <div className="divide-y divide-slate-100 bg-white">
                      {g.items.map((c) => (
                        <div 
                          key={c.id}
                          className="p-3 sm:px-4 py-2.5 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/60 transition-colors pl-6 sm:pl-10 relative"
                        >
                          <div className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-[10px] font-black text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                                  {c.id}
                                </span>
                                <span className="text-[10px] font-bold text-slate-500">
                                  [{c.trackName}]
                                </span>
                              </div>
                              <p className="text-slate-800 font-medium text-[11px] leading-relaxed mt-0.5">
                                {c.text}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                            {c.violationsCount > 0 && (
                              <span className="text-[10px] font-extrabold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                                -{c.penaltyPoints}đ ({c.violationsCount} vụ)
                              </span>
                            )}

                            {c.recognitionsCount > 0 && (
                              <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                +{c.bonusPoints}đ ({c.recognitionsCount} phiếu)
                              </span>
                            )}

                            <div className="text-right">
                              <span className="text-[9px] text-slate-400 font-bold block">Điểm chi tiết</span>
                              <strong className="text-xs font-black text-emerald-900 font-mono">
                                {c.effectiveScore.toFixed(2)}đ
                              </strong>
                            </div>

                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${
                              c.status === '❌ Có vi phạm'
                                ? 'bg-rose-100 text-rose-800 border-rose-300'
                                : c.status === '🌟 Khen thưởng'
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : c.status === '⚠️ Cần cải thiện (bổ sung)'
                                ? 'bg-amber-100 text-amber-800 border-amber-300'
                                : 'bg-slate-100 text-slate-700 border-slate-300'
                            }`}>
                              {c.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-xs text-slate-400 italic py-4 text-center">Không tìm thấy tiêu chí phù hợp.</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-12 print:p-0 print:pb-0 print:space-y-3">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-3xl shadow-sm border border-slate-200/80 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-900">Báo Cáo Đánh Giá Nhân Sự (Dạng Danh Sách Mục Chung ➔ Chi Tiết Mục)</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-emerald-600 inline" />
            <span>Thời gian Realtime: {realtimeClock}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportSheet}
            disabled={isExportingSheet}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold border border-emerald-200 transition-all active:scale-95 disabled:opacity-50"
            title="Xuất báo cáo chi tiết sang Google Sheet"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>{isExportingSheet ? 'Đang xuất...' : 'Xuất Google Sheets'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold shadow-md transition-all active:scale-95"
            title="Xuất bản in A4 / PDF"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>In Báo Cáo A4 / PDF</span>
          </button>
        </div>
      </div>

      {/* Staff Selector & Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 print:hidden space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <User className="w-4 h-4 text-emerald-600" />
            <span>Chọn Nhân Sự Xem Báo Cáo:</span>
          </label>

          <div className="flex items-center gap-1.5">
            <button
              onClick={expandAllGroups}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-xl transition-all"
            >
              Mở tất cả mục
            </button>
            <button
              onClick={collapseAllGroups}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-xl transition-all"
            >
              Thu gọn mục
            </button>
          </div>
        </div>

        {currentUser?.isAdmin || visibleStaffList.length > 1 ? (
          <select
            value={selectedStaffId}
            onChange={(e) => setSelectedStaffId(e.target.value)}
            className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-extrabold text-slate-900 focus:ring-2 focus:ring-emerald-500"
          >
            {visibleStaffList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.id} - {s.name} ({s.role} - {s.line})
              </option>
            ))}
          </select>
        ) : (
          <div className="p-3 bg-emerald-950 text-white rounded-xl text-xs font-extrabold flex items-center justify-between">
            <span>{selectedStaff.name} ({selectedStaff.role})</span>
            <span className="font-mono text-emerald-400">{selectedStaff.id}</span>
          </div>
        )}

        {/* Search Box */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm mục chung (VH1, TC1...), tên nhóm tiêu chí hoặc nội dung chi tiết..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
          />
        </div>
      </div>

      {/* Main Printable Document Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6 printable-report print:p-0 print:border-none print:shadow-none">
        
        {/* Document Header for Print */}
        <div className="border-b border-slate-200 pb-4 text-center">
          <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 uppercase tracking-tight">
            NHÀ CỦA THỜI THANH XUÂN - STAFFPOINT v3.0
          </h1>
          <p className="text-xs font-bold text-emerald-700 mt-1 uppercase tracking-wider">
            BÁO CÁO ĐÁNH GIÁ NĂNG LỰC NHÂN SỰ P2 (DẠNG MỤC CHUNG ➔ CHI TIẾT MỤC)
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5 font-mono">Thời điểm kết xuất: {realtimeClock}</p>
        </div>

        {/* Staff Profile Summary Card */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Họ và Tên</span>
            <span className="text-sm font-extrabold text-slate-900">{selectedStaff.name}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Mã Nhân Sự</span>
            <span className="text-sm font-extrabold text-emerald-700 font-mono">{selectedStaff.id}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Ngạch Phòng Ban</span>
            <span className="text-xs font-bold text-slate-800">{selectedStaff.line}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Vị Trí / Chức Danh</span>
            <span className="text-xs font-bold text-slate-800">{selectedStaff.role}</span>
          </div>
        </div>

        {/* SECTION 1: SUMMARY OVERALL TRACK SCORES */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>1. Tổng Quan Điểm Số & Trọng Số Phân Rã Theo 3 Ngạch</span>
            </h3>
            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {trackInfo.hasManagementTrack ? '3 Ngạch (Quản lý)' : '2 Ngạch (Nhân viên)'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {trackInfo.tracks.filter(t => t.isApplicable).map((t) => (
              <div 
                key={t.trackKey}
                className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-emerald-50/30 border-2 border-emerald-950/10 space-y-2 relative overflow-hidden shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 uppercase font-heading">{t.trackName}</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-700 text-white text-[10px] font-black shadow-sm">
                    Trọng số: {t.weightPercent}%
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">Điểm TB Ngạch</span>
                    <span className="text-2xl font-black text-emerald-800 font-heading">{t.score.toFixed(2)}</span>
                    <span className="text-[10px] text-slate-400 font-bold"> / 5.0</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 font-bold block">Đóng góp tổng</span>
                    <span className="text-base font-black text-slate-800">+{t.weightedContribution}</span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-500 font-medium leading-tight border-t border-slate-200/80 pt-1.5">
                  {t.description}
                </p>
              </div>
            ))}
          </div>

          {/* Combined Total Score & Salary Tier Banner */}
          <div className={`p-4 rounded-2xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md ${tier.bgClass} ${tier.borderClass}`}>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider opacity-80 block">
                TỔNG ĐIỂM NĂNG LỰC P2 DỰ KIẾN KẾT HỢP
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl sm:text-3xl font-black font-heading">{selectedStaff.totalScore.toFixed(2)}</span>
                <span className="text-xs opacity-75 font-bold">/ 5.0 Điểm Chuẩn</span>
              </div>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <span className="text-[10px] font-black uppercase opacity-80 block">Bậc Cách Làm Việc Dự Kiến</span>
              <span className="text-lg font-black font-heading block">{tier.label}</span>
            </div>
          </div>
        </div>

        {/* SECTION 2: HIERARCHICAL LIST FOR GENERAL CULTURE TRACK (NGẠCH VĂN HÓA CHUNG) */}
        {renderGroupedListSection(
          "2. Ngạch Văn Hóa Chung (Danh sách Mục chung ➔ Chi tiết mục)",
          criteriaBreakdown.commonGroups,
          selectedStaff.generalScore,
          <ShieldCheck className="w-4 h-4 text-emerald-600" />,
          "bg-emerald-100",
          "text-emerald-900"
        )}

        {/* SECTION 3: HIERARCHICAL LIST FOR DEPARTMENT TECHNICAL TRACK (NGẠCH CHUYÊN MÔN PHÒNG BAN) */}
        {renderGroupedListSection(
          `3. Ngạch Chuyên Môn Phòng Ban [${selectedStaff.line}] (Danh sách Mục chung ➔ Chi tiết mục)`,
          criteriaBreakdown.deptGroups,
          selectedStaff.techScore,
          <Building2 className="w-4 h-4 text-teal-600" />,
          "bg-teal-100",
          "text-teal-900"
        )}

        {/* SECTION 4: HIERARCHICAL LIST FOR MANAGEMENT TRACK (IF APPLICABLE) */}
        {trackInfo.hasManagementTrack && criteriaBreakdown.mgmtGroups.length > 0 && (
          renderGroupedListSection(
            "4. Ngạch Quản Lý & Lãnh Đạo (Danh sách Mục chung ➔ Chi tiết mục)",
            criteriaBreakdown.mgmtGroups,
            selectedStaff.mgmtScore || 0,
            <Star className="w-4 h-4 text-purple-600" />,
            "bg-purple-100",
            "text-purple-900"
          )
        )}

        {/* Official Signature Block for Printed Report */}
        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-300 text-center text-xs print:pt-6">
          <div>
            <p className="font-extrabold text-slate-900 uppercase">NHÂN SỰ ĐƯỢC ĐÁNH GIÁ</p>
            <p className="text-[10px] text-slate-400 mt-0.5">(Ký và ghi rõ họ tên)</p>
            <div className="h-16"></div>
            <p className="font-bold text-slate-800">{selectedStaff.name}</p>
          </div>

          <div>
            <p className="font-extrabold text-slate-900 uppercase">TRƯỞNG PHÒNG NHÂN SỰ</p>
            <p className="text-[10px] text-slate-400 mt-0.5">(Ký duyệt báo cáo)</p>
            <div className="h-16"></div>
            <p className="font-bold text-slate-800">Trần Thị Thanh Hải</p>
          </div>
        </div>

      </div>
    </div>
  );
};
