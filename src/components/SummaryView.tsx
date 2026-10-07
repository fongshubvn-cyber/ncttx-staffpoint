import React, { useState, useEffect } from 'react';
import { Staff, IncidentRecord, Question, ParameterConfig, AuthUser } from '../types';
import { getSalaryTierBadge, isHRHeadRole, get3RecentPeriods, getVisibleStaffListForUser, getStaffScoresForPeriod, getStaffPolicyScoreForPeriod, isManagementRole } from '../utils/calculator';
import { PolicyHealthModal } from './PolicyHealthModal';
import { 
  Sparkles, 
  User, 
  Star, 
  Trophy, 
  Megaphone, 
  Building2,
  Briefcase,
  Target,
  Lightbulb,
  Leaf,
  Plus,
  Calendar,
  ShieldCheck,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

interface SummaryViewProps {
  staffList: Staff[];
  incidents: IncidentRecord[];
  questions: Question[];
  params: ParameterConfig;
  onOpenIncidentModal: () => void;
  isManager: boolean;
  currentUser: AuthUser | null;
  onAppealIncident?: (incidentId: string, reason: string) => void;
}

export const SummaryView: React.FC<SummaryViewProps> = ({
  staffList,
  incidents,
  questions,
  params,
  onOpenIncidentModal,
  isManager,
  currentUser,
  onAppealIncident,
}) => {
  const isHRManager = isHRHeadRole(currentUser);
  const recentPeriods = get3RecentPeriods();
  const [selectedPeriodKey, setSelectedPeriodKey] = useState<string>(recentPeriods[0].key);
  const [showPolicyModal, setShowPolicyModal] = useState<boolean>(false);
  const currentPeriodObj = recentPeriods.find(p => p.key === selectedPeriodKey) || recentPeriods[0];

  const visibleStaffList = getVisibleStaffListForUser(currentUser, staffList).slice().sort((a, b) => {
    const numA = parseInt(a.id.replace(/\D/g, ''), 10);
    const numB = parseInt(b.id.replace(/\D/g, ''), 10);
    return numA - numB;
  });

  const [selectedStaffId, setSelectedStaffId] = useState<string>(
    visibleStaffList[0]?.id || currentUser?.id || ''
  );

  useEffect(() => {
    if (!isHRManager && currentUser?.id) {
      setSelectedStaffId(currentUser.id);
    }
  }, [currentUser, isHRManager]);

  const staff = visibleStaffList.find(s => s.id === selectedStaffId) || visibleStaffList[0];

  if (!staff) return null;

  // Compute dynamic monthly scores for selected period key
  const periodScores = getStaffScoresForPeriod(staff, selectedPeriodKey, incidents, params);

  const [yStr, mStr] = selectedPeriodKey.split('-');
  const patternSlash = `${mStr}/${yStr}`; // "10/2026"
  const patternDash = `${yStr}-${mStr}`;  // "2026-10"

  const periodIncidents = incidents.filter(inc => {
    if (!inc || inc.isDeleted) return false;
    if (inc.createdAt && inc.createdAt.startsWith(patternDash)) return true;
    if (inc.date) {
      if (inc.date.includes(patternSlash) || inc.date.includes(patternDash)) return true;
    }
    return false;
  });

  const staffIncidents = periodIncidents.filter(i => i.targetId === staff.id);
  const recognitions = staffIncidents.filter(i => i.type === 'ghi_nhan' && (i.status === 'Đã duyệt' || i.status === 'Chờ HR duyệt'));
  const violations = staffIncidents.filter(i => i.type === 'vi_pham' && i.status !== 'Kháng nghị được chấp nhận');
  const policyData = getStaffPolicyScoreForPeriod(staff, selectedPeriodKey, incidents, params);

  const generateImprovementTips = () => {
    const tips = [];

    if (policyData.policyScore < 80) {
      tips.push({
        title: `Cải thiện Điểm Nội Quy & Tuân Thủ (${policyData.policyScore}/100 đ)`,
        type: 'vi_pham',
        description: `Điểm nội quy hiện tại là ${policyData.policyScore}/100 đ (${policyData.statusObj.level}). Đã bị trừ -${policyData.totalDeduction} đ do ${policyData.violations.length} vi phạm trong kỳ. Hãy rà soát 10 nội quy để lấy lại mốc Tốt (80+ điểm).`,
        priority: 'Cần chú ý',
      });
    }

    if (violations.length > 0) {
      violations.forEach(v => {
        tips.push({
          title: `Khắc phục vi phạm: ${v.title}`,
          type: 'vi_pham',
          description: `Biên bản ngày ${v.date}. Hãy rèn luyện tuân thủ quy chuẩn để khôi phục điểm nhóm ${v.groupCode || 'Khung chung'}.`,
          priority: 'Cần chú ý',
        });
      });
    }

    if (periodScores.generalScore < 4.5) {
      tips.push({
        title: 'Nâng cao Điểm Văn Hóa Chung (One Voice)',
        type: 'van_hoa',
        description: `Điểm văn hóa kỳ ${selectedPeriodKey} là ${periodScores.generalScore}/5.0. Thực hành giao tiếp chân thành, tôn trọng đồng nghiệp khiếm thính.`,
        priority: 'Rèn luyện',
      });
    }

    if (periodScores.techScore < 4.5) {
      tips.push({
        title: 'Hoàn thiện Năng Lực Chuyên Môn',
        type: 'chuyen_mon',
        description: `Điểm chuyên môn là ${periodScores.techScore}/5.0. Ôn luyện bộ tiêu chí chất lượng thật của tuyến ${staff.line}.`,
        priority: 'Rèn luyện',
      });
    }

    if (staff.mgmtScore !== undefined && periodScores.mgmtScore < 4.5) {
      tips.push({
        title: 'Vững Vàng Năng Lực Quản Lý OPA',
        type: 'quan_ly',
        description: `Điểm quản lý là ${periodScores.mgmtScore}/5.0. Thể hiện tư duy quản trị vững chãi và hỗ trợ sát sao cho đội nhóm.`,
        priority: 'Cần chú ý',
      });
    }

    if (periodScores.salaryTier < 5) {
      const nextTierScore = (params.tier5Threshold * 5.0).toFixed(2);
      const gap = (parseFloat(nextTierScore) - periodScores.totalScore).toFixed(2);
      tips.push({
        title: `Lộ trình chinh phục Bậc 5 (Xuất sắc - 85%+ điểm)`,
        type: 'lo_trinh',
        description: `Bạn đang ở Bậc ${periodScores.salaryTier} (Kỳ ${selectedPeriodKey}). Cần thêm khoảng +${gap} điểm làm việc để cán mốc Bậc 5.`,
        priority: 'Khuyến khích',
      });
    } else {
      tips.push({
        title: 'Duy trì phong độ Xuất sắc Bậc 5 ⭐️',
        type: 'duy_tri',
        description: `Chúc mừng bạn đã vững vàng ở Bậc 5 (Kỳ ${selectedPeriodKey})! Tiếp tục lan tỏa giá trị chữa lành và nâng đỡ đồng nghiệp.`,
        priority: 'Ghi nhận',
      });
    }

    return tips;
  };

  const improvementTips = generateImprovementTips();

  return (
    <div className="space-y-4 pb-20">
      
      {/* Policy Health Modal */}
      <PolicyHealthModal
        isOpen={showPolicyModal}
        onClose={() => setShowPolicyModal(false)}
        staff={staff}
        periodKey={selectedPeriodKey}
        incidents={incidents}
        params={params}
        currentUser={currentUser}
        onAppealIncident={onAppealIncident}
      />
      
      {/* REPORTING PERIOD SELECTOR */}
      <div className="mobile-card p-3 border border-slate-200 bg-white space-y-2 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
          <span className="text-xs font-black text-[#1B4332] flex items-center space-x-1.5">
            <Calendar className="w-4 h-4 text-[#2D6A4F] shrink-0" />
            <span>Kỳ tính điểm (Reset hàng tháng - Lưu 3 tháng gần nhất):</span>
          </span>
          <span className="text-[10px] font-mono font-extrabold text-[#2D6A4F] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 whitespace-nowrap">
            Đang xem: {currentPeriodObj.label}
          </span>
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto pb-0.5">
          {recentPeriods.map((p) => (
            <button
              key={p.key}
              onClick={() => setSelectedPeriodKey(p.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap active:scale-95 ${
                selectedPeriodKey === p.key
                  ? 'bg-[#2D6A4F] text-white shadow-sm border border-[#2D6A4F]'
                  : 'bg-[#EDEAE3] text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Current Staff Switcher Bar */}
      {visibleStaffList.length > 1 && (
        <div className="mobile-card p-3 flex items-center justify-between border border-[#1B4332]/10 bg-white">
          <div className="flex items-center space-x-2 text-xs">
            <User className="w-4 h-4 text-[#2D6A4F]" />
            <span className="font-bold text-[#2D3748]">Chọn nhân sự trong phạm vi quản lý:</span>
          </div>

          <select
            value={selectedStaffId}
            onChange={(e) => setSelectedStaffId(e.target.value)}
            className="p-1.5 bg-[#EDEAE3] border border-emerald-900/10 rounded-xl text-xs font-bold text-[#1B4332] focus:outline-none shadow-sm"
          >
            {visibleStaffList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.id} - {s.role})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 1. Main Personal Info & DUAL-SCORE CARD (Hệ thống 2 Mức Điểm 2 Bên) */}
      <div className="mobile-card p-5 sm:p-6 border border-emerald-900/15 bg-white space-y-4 shadow-sm relative overflow-hidden">
        
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-[10px] font-black text-[#1B4332] bg-[#EDEAE3] px-2.5 py-0.5 rounded-full border border-[#1B4332]/15 shadow-2xs">
                {staff.id}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-heading text-[#1B4332] tracking-tight leading-snug truncate">
              {staff.name}
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-[#2D6A4F]">{staff.role}</p>
          </div>

          <div className="flex flex-col items-end shrink-0">
            <span className="px-3.5 py-1.5 rounded-full bg-[#1B4332] text-[#52B788] text-xs font-black border border-[#2D6A4F] inline-flex items-center space-x-1.5 shadow-sm">
              <Star className="w-3.5 h-3.5 text-[#52B788] fill-[#52B788] shrink-0" />
              <span>Bậc {periodScores.salaryTier} / 5</span>
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 mt-1 tracking-tight">Hệ số P2 tháng</span>
          </div>
        </div>

        {/* Staff Department & Line details */}
        <div className="grid grid-cols-2 gap-2.5 text-xs pt-1 border-t border-slate-100">
          <div className="bg-[#EDEAE3]/60 p-3 rounded-2xl border border-slate-200/80 space-y-1">
            <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block">Phòng ban</span>
            <span className="font-bold text-xs sm:text-sm text-[#1B4332] flex items-center space-x-1.5">
              <Building2 className="w-4 h-4 text-[#2D6A4F] shrink-0" />
              <span className="truncate">{staff.department}</span>
            </span>
          </div>

          <div className="bg-[#EDEAE3]/60 p-3 rounded-2xl border border-slate-200/80 space-y-1">
            <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block">Ngạch / Tuyến</span>
            <span className="font-bold text-xs sm:text-sm text-[#1B4332] flex items-center space-x-1.5">
              <Briefcase className="w-4 h-4 text-[#2D6A4F] shrink-0" />
              <span className="truncate">{staff.line}</span>
            </span>
          </div>
        </div>

        {/* DUAL SCORE CONTAINER (2 MỨC ĐIỂM 2 BÊN) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          
          {/* BÊN TRÁI: ĐIỂM ĐÁNH GIÁ CÔNG VIỆC (0 - 5.0) */}
          {(() => {
            const targetBaseline = staff.totalScore && staff.totalScore > 0 ? staff.totalScore : 5.0;
            const overallScorePercent = Math.min(100, Math.round((periodScores.totalScore / targetBaseline) * 100));
            return (
              <div className="bg-gradient-to-br from-emerald-900/5 via-emerald-800/10 to-emerald-900/5 p-4 rounded-2xl border border-emerald-700/20 space-y-2.5 relative overflow-hidden shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black font-heading tracking-wide text-[#1B4332] flex items-center space-x-1.5">
                    <Star className="w-4 h-4 text-[#52B788] fill-[#52B788]" />
                    <span>ĐÁNH GIÁ CÔNG VIỆC (TỈ LỆ HOÀN THÀNH)</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#1B4332] text-[#52B788] text-xs font-black font-mono">
                    {overallScorePercent}%
                  </span>
                </div>
                
                <div className="flex items-baseline justify-between pt-0.5">
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-2xl sm:text-3xl font-black font-mono text-[#1B4332]">
                      {overallScorePercent}%
                    </span>
                    <span className="text-xs font-bold text-[#2D6A4F]">({periodScores.totalScore.toFixed(2)}đ)</span>
                  </div>
                  <span className="text-xs font-bold text-[#1B4332] bg-white px-2.5 py-1 rounded-xl border border-emerald-900/10 shadow-2xs">
                    {getSalaryTierBadge(periodScores.salaryTier).label}
                  </span>
                </div>

                {/* Work score mini progress */}
                <div className="w-full h-2.5 bg-white rounded-full overflow-hidden p-0.5 border border-emerald-900/15 shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-[#2D6A4F] to-[#52B788] rounded-full transition-all duration-500" 
                    style={{ width: `${overallScorePercent}%` }} 
                  />
                </div>

                {/* Clean Structured Breakdown Rows */}
                <div className="pt-1.5 space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs">
                    <span className="text-slate-700 font-semibold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                      <span>Văn Hóa & Thái Độ:</span>
                    </span>
                    <span className="font-mono font-bold text-emerald-800">
                      {periodScores.generalScore} / 5.0
                    </span>
                  </div>

                  {isManagementRole(staff) && (
                    <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs">
                      <span className="text-slate-700 font-semibold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                        <span>Ngạch Quản Lý:</span>
                      </span>
                      <span className="font-mono font-bold text-blue-800">
                        {periodScores.mgmtScore > 0 ? `${periodScores.mgmtScore} / ${periodScores.mgmtScore}` : '---'}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs gap-2">
                    <span className="text-slate-[#2D3748] font-semibold flex items-center gap-1.5 shrink-0">
                      <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0"></span>
                      <span>Ngạch Chuyên Môn:</span>
                    </span>
                    {periodScores.hasCustomTechScore ? (
                      <span className="font-mono font-bold text-purple-800 shrink-0">
                        {periodScores.techScore} / {periodScores.techScore}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 truncate">
                        Chưa tích ngạch (Mặc định 5.0 / 5.0)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* BÊN PHẢI: ĐIỂM NỘI QUY (ACCOUNT HEALTH - 0 TO 100) */}
          <div 
            onClick={() => setShowPolicyModal(true)}
            className="bg-gradient-to-br from-amber-500/5 via-emerald-500/5 to-teal-500/10 p-4 rounded-2xl border border-emerald-700/20 space-y-2.5 relative overflow-hidden shadow-xs hover:border-[#2D6A4F] cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black font-heading tracking-wide text-[#1B4332] flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-[#2D6A4F]" />
                <span>BÊN PHẢI: ĐIỂM NỘI QUY (TÌNH TRẠNG)</span>
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${policyData.statusObj.badgeClass}`}>
                {policyData.statusObj.level}
              </span>
            </div>

            <div className="flex items-baseline justify-between pt-0.5">
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl sm:text-3xl font-black font-mono text-[#1B4332]">
                  {policyData.policyScore}
                </span>
                <span className="text-xs font-bold text-slate-500">/ 100</span>
              </div>

              <button className="text-[11px] font-bold text-white bg-[#2D6A4F] group-hover:bg-[#1B4332] px-3 py-1 rounded-xl shadow-2xs transition-all flex items-center space-x-1">
                <span>Chi tiết UI</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Policy score progress track */}
            <div className="relative w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200 shadow-inner flex">
              <div className="h-full bg-rose-500 w-[20%]" title="Đình chỉ (<20)" />
              <div className="h-full bg-orange-400 w-[30%]" title="Nghiêm trọng (20-49)" />
              <div className="h-full bg-amber-400 w-[30%]" title="Cần chú ý (50-79)" />
              <div className="h-full bg-emerald-500 w-[20%]" title="Tốt (80-100)" />
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-600 pt-0.5 font-bold">
              <span>Đã trừ: <strong className="text-rose-600 font-mono">-{policyData.totalDeduction} điểm</strong></span>
              <span>Số vi phạm: <strong className="text-amber-700 font-mono">{policyData.violations.length} lần</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Incidents & Recognitions Count Card (WITH COMPACT TOP-RIGHT BUTTON) */}
      <div className="mobile-card p-4 border border-slate-100 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Leaf className="w-4 h-4 text-[#2D6A4F]" />
            <h3 className="text-sm font-extrabold font-heading text-[#1B4332]">Thống Kê Phiếu Đã Nhận</h3>
          </div>

          {/* Compact Small "+ Lập phiếu" button on top-right of stats card */}
          <button
            onClick={onOpenIncidentModal}
            className="px-3 py-1 rounded-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white text-xs font-bold shadow-sm transition-all flex items-center space-x-1 whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Lập phiếu</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 sm:p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center space-x-2 sm:space-x-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#2D6A4F] text-white flex items-center justify-center shrink-0 shadow-sm text-base">
              🌟
            </div>
            <div className="min-w-0 truncate">
              <p className="text-[10px] text-[#1B4332] font-bold whitespace-nowrap">Phiếu ghi nhận</p>
              <p className="text-xs sm:text-sm font-black text-[#2D6A4F] whitespace-nowrap">
                {recognitions.length} phiếu
              </p>
            </div>
          </div>

          <div className="p-2.5 sm:p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center space-x-2 sm:space-x-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#DD6B20] text-white flex items-center justify-center shrink-0 shadow-sm text-base">
              📢
            </div>
            <div className="min-w-0 truncate">
              <p className="text-[10px] text-amber-900 font-bold whitespace-nowrap">Biên bản vi phạm</p>
              <p className="text-xs sm:text-sm font-black text-[#DD6B20] whitespace-nowrap">
                {violations.length} biên bản
              </p>
            </div>
          </div>
        </div>

        {staffIncidents.length > 0 ? (
          <div className="space-y-1.5 pt-1">
            <p className="text-[11px] font-bold text-slate-500">Phiếu gần đây:</p>
            {staffIncidents.slice(0, 2).map((inc) => (
              <div key={inc.id} className="p-2.5 rounded-xl bg-[#EDEAE3]/40 border border-slate-200 flex items-center justify-between text-xs">
                <div className="truncate mr-2">
                  <span className={`px-2 py-0.2 rounded-full text-[9px] font-extrabold mr-1.5 ${
                    inc.type === 'ghi_nhan' ? 'bg-[#2D6A4F] text-white' : 'bg-[#DD6B20] text-white'
                  }`}>
                    {inc.type === 'ghi_nhan' ? 'KHEN THƯỞNG' : 'NHẮC NHỞ'}
                  </span>
                  <span className="font-bold text-[#2D3748]">{inc.title}</span>
                </div>
                <span className="text-[10px] font-bold text-slate-500 shrink-0">{inc.date}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic text-center py-1">Chưa có phiếu ghi nhận hay vi phạm nào.</p>
        )}
      </div>

      {/* 3. Phân tích Cải Thiện Điểm Nào */}
      <div className="mobile-card p-5 border border-[#1B4332]/10 bg-white space-y-3 shadow-sm">
        <div className="flex items-center space-x-2 text-[#1B4332]">
          <Target className="w-5 h-5 text-[#2D6A4F]" />
          <h3 className="text-sm font-extrabold font-heading text-[#1B4332]">Hiện Tại Đang Cần Cải Thiện Điểm Nào? 🎯</h3>
        </div>

        <p className="text-xs text-[#2D3748] font-medium leading-relaxed">
          Gợi ý lộ trình phát triển theo chuẩn năng lực thực tế tại Nhà Của Thời Thanh Xuân:
        </p>

        <div className="space-y-2.5 pt-1">
          {improvementTips.map((tip, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-2xl border text-xs space-y-1 transition-all ${
                tip.type === 'vi_pham'
                  ? 'bg-amber-50/80 border-amber-200'
                  : tip.type === 'lo_trinh'
                  ? 'bg-emerald-50/80 border-emerald-200'
                  : tip.type === 'duy_tri'
                  ? 'bg-[#EDEAE3] border-emerald-300'
                  : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-[#1B4332] flex items-center space-x-1.5 font-heading">
                  <Lightbulb className="w-3.5 h-3.5 text-[#2D6A4F] shrink-0" />
                  <span>{tip.title}</span>
                </span>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap shrink-0 leading-none ${
                    tip.priority === 'Cần chú ý'
                      ? 'bg-[#DD6B20] text-white'
                      : tip.priority === 'Khuyến khích'
                      ? 'bg-[#2D6A4F] text-white'
                      : tip.priority === 'Ghi nhận'
                      ? 'bg-[#52B788] text-[#1B4332]'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {tip.priority}
                </span>
              </div>

              <p className="text-[11px] text-[#2D3748] leading-relaxed pl-5 font-medium">
                {tip.description}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
