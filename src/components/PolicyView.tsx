import React, { useState } from 'react';
import { Staff, IncidentRecord, ParameterConfig, AuthUser, PolicyRule } from '../types';
import { getStaffPolicyScoreForPeriod, getPolicyHealthStatus } from '../utils/calculator';
import { PolicyHealthModal } from './PolicyHealthModal';
import { initialPolicyRules } from '../data/seedData';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  Edit3, 
  Check, 
  Award, 
  Clock, 
  User, 
  ChevronRight, 
  AlertCircle,
  RotateCw,
  Plus
} from 'lucide-react';

interface PolicyViewProps {
  staffList: Staff[];
  incidents: IncidentRecord[];
  params: ParameterConfig;
  onUpdateParams?: (newParams: ParameterConfig) => void;
  currentUser: AuthUser | null;
  onAppealIncident?: (incidentId: string, reason: string) => void;
  selectedPeriodKey: string;
  onOpenIncidentModal?: (targetId?: string, type?: 'ghi_nhan' | 'vi_pham') => void;
}

export const PolicyView: React.FC<PolicyViewProps> = ({
  staffList,
  incidents,
  params,
  onUpdateParams,
  currentUser,
  onAppealIncident,
  selectedPeriodKey,
  onOpenIncidentModal,
}) => {
  const [activeTab, setActiveTab] = useState<'rules' | 'staff_scores' | 'appeals'>('rules');
  const [isEditingRules, setIsEditingRules] = useState(false);
  const [rules, setRules] = useState<PolicyRule[]>(() => {
    if (params.policyRules && Array.isArray(params.policyRules) && params.policyRules.length > 0) {
      return params.policyRules;
    }
    return initialPolicyRules;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStaffForModal, setSelectedStaffForModal] = useState<Staff | null>(null);

  const isAdmin = Boolean(currentUser?.isAdmin);

  const handleSaveRules = () => {
    if (!onUpdateParams) return;
    onUpdateParams({
      ...params,
      policyRules: rules,
      defaultPolicyScore: 100,
    });
    setIsEditingRules(false);
    alert('Đã lưu cấu hình 10 Nội Quy & Điểm Phạt thành công!');
  };

  const filteredStaffList = staffList.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20">
      
      {/* Account Health Detail Modal */}
      {selectedStaffForModal && (
        <PolicyHealthModal
          isOpen={Boolean(selectedStaffForModal)}
          onClose={() => setSelectedStaffForModal(null)}
          staff={selectedStaffForModal}
          periodKey={selectedPeriodKey}
          incidents={incidents}
          params={params}
          currentUser={currentUser}
          onAppealIncident={onAppealIncident}
        />
      )}

      {/* Brand Header Banner (Solid Dark Green Background - High Contrast) */}
      <div className="p-6 rounded-3xl border-2 border-emerald-900/50 bg-[#1B4332] text-white shadow-xl space-y-3.5 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/40 text-[#52B788] text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-[#52B788]" />
              <span>Hệ Thống Nội Quy & Tình Trạng Nhân Sự (Account Health)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-heading text-white tracking-tight">
              10 Nội Quy Mặc Định & Điểm Tuân Thủ (100 Điểm Gốc) 🛡️
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl font-medium leading-relaxed">
              Mỗi nhân sự Nhà Của Thời Thanh Xuân được cấp <strong className="text-[#52B788]">100 điểm nội quy mặc định</strong>. Khi vi phạm sẽ bị trừ điểm theo mốc severity của nội quy.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => {
                if (isEditingRules) handleSaveRules();
                else setIsEditingRules(true);
              }}
              className="px-4 py-2 rounded-2xl bg-white hover:bg-emerald-100 text-[#1B4332] font-black text-xs shadow-md transition-all active:scale-95 shrink-0 flex items-center space-x-1.5 cursor-pointer border border-emerald-200"
            >
              <Edit3 className="w-4 h-4 text-[#2D6A4F]" />
              <span>{isEditingRules ? "💾 Lưu Cấu Hình Điểm Phạt" : "✏️ Chỉnh Sửa 10 Nội Quy"}</span>
            </button>
          )}
        </div>

        {/* Mốc Cảnh Báo Quick Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs relative z-10">
          <div className="bg-[#112d22] p-2.5 rounded-xl border border-emerald-700/60">
            <span className="text-emerald-400 font-extrabold block text-[10px] uppercase">🟢 Tốt (80 - 100đ)</span>
            <span className="font-extrabold text-white text-xs">Không Cưỡng Chế</span>
          </div>
          <div className="bg-[#112d22] p-2.5 rounded-xl border border-emerald-700/60">
            <span className="text-amber-400 font-extrabold block text-[10px] uppercase">🟡 Cần Chú Ý (50 - 79đ)</span>
            <span className="font-extrabold text-white text-xs">Tạm Khóa Đề Xuất Thưởng</span>
          </div>
          <div className="bg-[#112d22] p-2.5 rounded-xl border border-emerald-700/60">
            <span className="text-orange-400 font-extrabold block text-[10px] uppercase">🟠 Nghiêm Trọng (20 - 49đ)</span>
            <span className="font-extrabold text-white text-xs">Tạm Đình Chỉ Ca 3-7 Ngày</span>
          </div>
          <div className="bg-[#112d22] p-2.5 rounded-xl border border-emerald-700/60">
            <span className="text-rose-400 font-extrabold block text-[10px] uppercase">🔴 Đình Chỉ (&lt;20đ)</span>
            <span className="font-extrabold text-white text-xs">Xem Xét Chấm Dứt HĐLĐ</span>
          </div>
        </div>
      </div>

      {/* Sub Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('rules')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all whitespace-nowrap flex items-center space-x-2 cursor-pointer ${
            activeTab === 'rules'
              ? 'bg-[#1B4332] text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>📋 10 Nội Quy & Mức Điểm Phạt</span>
        </button>

        <button
          onClick={() => setActiveTab('staff_scores')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all whitespace-nowrap flex items-center space-x-2 cursor-pointer ${
            activeTab === 'staff_scores'
              ? 'bg-[#1B4332] text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <User className="w-4 h-4" />
          <span>📊 Điểm Tuân Thủ Của Nhân Sự</span>
        </button>
      </div>

      {/* TAB 1: 10 POLICY RULES & PENALTY POINTS */}
      {activeTab === 'rules' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold font-heading text-[#1B4332] uppercase tracking-wider">
              Danh Sách Quy Định Nội Quy Công Ty ({rules.length} Nội Quy)
            </h3>
            {isEditingRules && (
              <span className="text-xs text-rose-600 font-bold bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 animate-pulse">
                ✏️ Đang trong chế độ chỉnh sửa điểm phạt
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {rules.map((rule, idx) => (
              <div 
                key={rule.id}
                className="mobile-card p-4 space-y-2.5 border border-slate-200 bg-white hover:border-[#2D6A4F] transition-all shadow-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2 min-w-0">
                    <span className="px-2.5 py-0.5 rounded-full font-mono text-[11px] font-black bg-[#1B4332] text-[#52B788] shrink-0">
                      {rule.code || rule.id}
                    </span>
                    <h4 className="font-extrabold text-[#1B4332] text-sm truncate">{rule.title}</h4>
                  </div>

                  {isEditingRules ? (
                    <div className="flex items-center space-x-1 shrink-0">
                      <span className="text-rose-600 font-bold text-xs">-</span>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={rule.penaltyPoints}
                        onChange={(e) => {
                          const val = Math.max(1, Number(e.target.value));
                          const updated = [...rules];
                          updated[idx] = { ...updated[idx], penaltyPoints: val };
                          setRules(updated);
                        }}
                        className="w-14 p-1 bg-white border border-rose-400 rounded-xl text-center font-mono font-black text-rose-600 text-xs shadow-2xs focus:ring-1 focus:ring-rose-500"
                      />
                      <span className="text-xs font-bold text-slate-500">đ</span>
                    </div>
                  ) : (
                    <span className="px-3 py-1 rounded-xl text-xs font-mono font-black bg-rose-50 text-rose-700 border border-rose-200 shrink-0">
                      -{rule.penaltyPoints} điểm
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-medium bg-[#EDEAE3]/50 p-3 rounded-xl">
                  {rule.description}
                </p>

                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 border-t border-slate-100">
                  <span className="font-medium">
                    Phân loại: <strong className="text-slate-700">{rule.category}</strong>
                  </span>
                  <span className="font-bold text-[#2D6A4F]">Mức: {rule.severity}</span>
                </div>

                <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-200/70 text-[11px] text-emerald-900">
                  <strong>Biện pháp xử lý:</strong> {rule.enforcementMeasure}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: STAFF POLICY SCORE OVERVIEW */}
      {activeTab === 'staff_scores' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm nhân sự theo tên, mã NV..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#2D6A4F]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <span className="text-xs font-bold text-slate-500">
                Tổng số: <strong className="text-[#1B4332] font-mono font-black">{filteredStaffList.length} nhân sự</strong>
              </span>

              {onOpenIncidentModal && (
                <button
                  onClick={() => onOpenIncidentModal(undefined, 'vi_pham')}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center space-x-1 cursor-pointer"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>+ Lập Biên Bản Vi Phạm Mới</span>
                </button>
              )}
            </div>
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1B4332] text-white font-black border-b border-emerald-900">
                  <th className="p-3">Mã NV</th>
                  <th className="p-3">Họ và Tên</th>
                  <th className="p-3">Vị trí & Phòng ban</th>
                  <th className="p-3 text-center">Điểm Nội Quy (Gốc 100đ)</th>
                  <th className="p-3 text-center">Trạng Thái Health</th>
                  <th className="p-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStaffList.map((st) => {
                  const policyData = getStaffPolicyScoreForPeriod(st, selectedPeriodKey, incidents, params);
                  const { policyScore, totalDeduction, statusObj, violations } = policyData;

                  return (
                    <tr key={st.id} className="hover:bg-emerald-50/40 transition-all">
                      <td className="p-3 font-mono font-bold text-[#1B4332]">{st.id}</td>
                      <td className="p-3 font-extrabold text-slate-900">{st.name}</td>
                      <td className="p-3 text-slate-600">
                        <span className="font-medium block">{st.role}</span>
                        <span className="text-[10px] text-slate-400">{st.department}</span>
                      </td>
                      <td className="p-3 text-center">
                        <span className="font-mono text-base font-black text-[#1B4332]">{policyScore}</span>
                        <span className="text-slate-400 text-[10px]"> / 100</span>
                        {totalDeduction > 0 && (
                          <span className="block text-[10px] font-mono font-extrabold text-rose-600">
                            (-{totalDeduction}đ)
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${statusObj.badgeClass}`}>
                          {statusObj.level}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {onOpenIncidentModal && (
                            <button
                              onClick={() => onOpenIncidentModal(st.id, 'vi_pham')}
                              className="px-2.5 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold transition-all inline-flex items-center space-x-1 cursor-pointer"
                              title="Lập biên bản vi phạm nội quy cho nhân sự này"
                            >
                              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                              <span>Lập vi phạm</span>
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedStaffForModal(st)}
                            className="px-3 py-1.5 rounded-xl bg-[#2D6A4F] hover:bg-[#1B4332] text-white text-xs font-bold transition-all shadow-2xs inline-flex items-center space-x-1 cursor-pointer"
                          >
                            <span>Xem điểm nội quy</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
