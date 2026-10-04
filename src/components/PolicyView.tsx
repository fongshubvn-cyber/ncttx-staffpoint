import React, { useState } from 'react';
import { Staff, IncidentRecord, ParameterConfig, AuthUser, PolicyRule } from '../types';
import { getStaffPolicyScoreForPeriod, getPolicyHealthStatus, get3RecentPeriods } from '../utils/calculator';
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
  Plus,
  Calendar
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
  const recentPeriods = get3RecentPeriods();
  const [activePeriodKey, setActivePeriodKey] = useState<string>(selectedPeriodKey || recentPeriods[0].key);
  const activePeriodObj = recentPeriods.find(p => p.key === activePeriodKey) || recentPeriods[0];

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
          periodKey={activePeriodKey}
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
              10 Nội Quy Mặc Định & Điểm Tuân Thủ (100 Điểm Gốc Mỗi Tháng) 🛡️
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl font-medium leading-relaxed">
              Mỗi tháng, nhân sự được cấp <strong className="text-[#52B788]">100 điểm nội quy mặc định độc lập</strong>. Điểm trừ chỉ tính trong kỳ tháng đó. Sang tháng mới, điểm tuân thủ sẽ tự động <strong className="text-amber-300">Restart về 100đ</strong>.
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

        {/* Monthly Period Selector Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#112d22] p-3.5 rounded-2xl border border-emerald-700/60 relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-200">
            <Calendar className="w-4 h-4 text-[#52B788]" />
            <span>Kỳ Đánh Giá Nội Quy:</span>
            <span className="text-[10px] text-emerald-400/90 font-medium">
              (Tháng nào lưu tháng đó • Tự động restart 100đ khi sang tháng mới)
            </span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {recentPeriods.map((p) => (
              <button
                key={p.key}
                onClick={() => setActivePeriodKey(p.key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activePeriodKey === p.key
                    ? 'bg-[#52B788] text-[#1B4332] shadow-md font-extrabold scale-105'
                    : 'bg-emerald-950/80 text-emerald-200 hover:bg-emerald-900 border border-emerald-700/40'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <h3 className="text-sm font-extrabold font-heading text-[#1B4332] uppercase tracking-wider">
              Danh Sách Quy Định Nội Quy Công Ty ({rules.length} Nội Quy)
            </h3>
            {isEditingRules && (
              <span className="text-xs text-rose-600 font-bold bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 animate-pulse">
                ✏️ Đang trong chế độ chỉnh sửa nội quy
              </span>
            )}
          </div>

          {isEditingRules && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 font-medium">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Bạn đang ở <strong>Chế độ Chỉnh Sửa Nội Quy</strong>. Hãy thay đổi trực tiếp nội dung rồi bấm <strong>"💾 Lưu Cấu Hình Nội Quy"</strong> ở trên.</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const nextNum = rules.length + 1;
                  const numStr = nextNum < 10 ? `0${nextNum}` : `${nextNum}`;
                  const newRule: PolicyRule = {
                    id: `NQ${numStr}`,
                    code: `NQ-${numStr}`,
                    title: `Nội quy mới #${nextNum}`,
                    category: 'Quy định chung',
                    description: 'Nhập nội dung chi tiết của quy định nội quy mới tại đây...',
                    penaltyPoints: 10,
                    severity: 'Vừa',
                    enforcementMeasure: 'Nhắc nhở và lập biên bản xử lý vi phạm.',
                    active: true,
                  };
                  setRules([...rules, newRule]);
                }}
                className="px-3.5 py-2 bg-[#1B4332] text-[#52B788] hover:bg-[#2D6A4F] rounded-xl font-bold text-xs shadow-2xs flex items-center gap-1.5 shrink-0 cursor-pointer transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>+ Thêm Nội Quy Mới</span>
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {rules.map((rule, idx) => (
              <div 
                key={rule.id}
                className={`mobile-card p-4 space-y-3 border rounded-2xl transition-all shadow-2xs ${
                  isEditingRules 
                    ? 'bg-amber-50/30 border-amber-300 ring-1 ring-amber-400/20' 
                    : rule.active === false
                      ? 'bg-slate-50 border-slate-200 opacity-60'
                      : 'bg-white border-slate-200 hover:border-[#2D6A4F]'
                }`}
              >
                {isEditingRules ? (
                  /* EDIT MODE FOR ADMIN */
                  <div className="space-y-3 text-xs">
                    {/* Code & Title */}
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-500 mb-0.5 uppercase">Mã NQ</label>
                        <input
                          type="text"
                          value={rule.code || rule.id}
                          onChange={(e) => {
                            const updated = [...rules];
                            updated[idx] = { ...updated[idx], code: e.target.value };
                            setRules(updated);
                          }}
                          className="w-full p-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-xs focus:ring-1 focus:ring-[#2D6A4F]"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[10px] font-extrabold text-slate-500 mb-0.5 uppercase">Tên Nội Quy *</label>
                        <input
                          type="text"
                          value={rule.title}
                          onChange={(e) => {
                            const updated = [...rules];
                            updated[idx] = { ...updated[idx], title: e.target.value };
                            setRules(updated);
                          }}
                          className="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold text-xs text-[#1B4332] focus:ring-1 focus:ring-[#2D6A4F]"
                          placeholder="Nhập tên nội quy..."
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-500 mb-0.5 uppercase">Mô Tả Chi Tiết Quy Định *</label>
                      <textarea
                        rows={2}
                        value={rule.description}
                        onChange={(e) => {
                          const updated = [...rules];
                          updated[idx] = { ...updated[idx], description: e.target.value };
                          setRules(updated);
                        }}
                        className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 font-medium focus:ring-1 focus:ring-[#2D6A4F]"
                        placeholder="Mô tả nội dung quy định..."
                      />
                    </div>

                    {/* Penalty Points, Severity & Category */}
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-500 mb-0.5 uppercase">Điểm Trừ (100đ)</label>
                        <div className="flex items-center gap-1">
                          <span className="text-rose-600 font-extrabold text-xs">-</span>
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
                            className="w-full p-1.5 bg-white border border-rose-300 rounded-xl font-mono font-black text-rose-600 text-xs text-center focus:ring-1 focus:ring-rose-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-500 mb-0.5 uppercase">Mức Độ</label>
                        <select
                          value={rule.severity}
                          onChange={(e) => {
                            const updated = [...rules];
                            updated[idx] = { ...updated[idx], severity: e.target.value as any };
                            setRules(updated);
                          }}
                          className="w-full p-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                        >
                          <option value="Nhẹ">Nhẹ</option>
                          <option value="Vừa">Vừa</option>
                          <option value="Nghiêm trọng">Nghiêm trọng</option>
                          <option value="Rất nghiêm trọng">Rất nghiêm trọng</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-500 mb-0.5 uppercase">Phân Loại</label>
                        <input
                          type="text"
                          value={rule.category}
                          onChange={(e) => {
                            const updated = [...rules];
                            updated[idx] = { ...updated[idx], category: e.target.value };
                            setRules(updated);
                          }}
                          className="w-full p-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 font-medium"
                          placeholder="Phân loại"
                        />
                      </div>
                    </div>

                    {/* Enforcement Measure */}
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-500 mb-0.5 uppercase">Biện Pháp Xử Lý Kỷ Luật</label>
                      <input
                        type="text"
                        value={rule.enforcementMeasure}
                        onChange={(e) => {
                          const updated = [...rules];
                          updated[idx] = { ...updated[idx], enforcementMeasure: e.target.value };
                          setRules(updated);
                        }}
                        className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs text-emerald-900 font-medium focus:ring-1 focus:ring-[#2D6A4F]"
                        placeholder="Nhập biện pháp xử lý..."
                      />
                    </div>

                    {/* Active Switch & Delete Button */}
                    <div className="flex items-center justify-between pt-2 border-t border-amber-200/80">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...rules];
                          updated[idx] = { ...updated[idx], active: rule.active === false ? true : false };
                          setRules(updated);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                          rule.active === false
                            ? 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                        }`}
                      >
                        {rule.active === false ? '🔴 Đã Ẩn Quy Định' : '🟢 Đang Áp Dụng'}
                      </button>

                      {rules.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`⚠️ Admin chắc chắn muốn xóa quy định "${rule.title}"?`)) {
                              setRules(rules.filter((_, i) => i !== idx));
                            }
                          }}
                          className="px-3 py-1.5 rounded-xl bg-rose-100 text-rose-700 hover:bg-rose-200 text-xs font-bold transition-all cursor-pointer"
                        >
                          🗑️ Xóa Quy Định
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  /* DISPLAY MODE */
                  <>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-2 min-w-0">
                        <span className="px-2.5 py-0.5 rounded-full font-mono text-[11px] font-black bg-[#1B4332] text-[#52B788] shrink-0">
                          {rule.code || rule.id}
                        </span>
                        <h4 className="font-extrabold text-[#1B4332] text-sm truncate">{rule.title}</h4>
                      </div>

                      <span className="px-3 py-1 rounded-xl text-xs font-mono font-black bg-rose-50 text-rose-700 border border-rose-200 shrink-0">
                        -{rule.penaltyPoints} điểm
                      </span>
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
                  </>
                )}
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
                  <th className="p-3 text-center">Điểm Nội Quy Kỳ {activePeriodObj.mStr}/{activePeriodObj.year} (Gốc 100đ)</th>
                  <th className="p-3 text-center">Trạng Thái Health</th>
                  <th className="p-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStaffList.map((st) => {
                  const policyData = getStaffPolicyScoreForPeriod(st, activePeriodKey, incidents, params);
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
