import React, { useState, useEffect } from 'react';
import { Staff, IncidentRecord, Question, ParameterConfig, AuthUser } from '../../types';
import { 
  getSalaryTierBadge, 
  calculateTotalScoreForStaff, 
  calculateSalaryTier, 
  isManagementRole,
  isHRHeadRole, 
  get3RecentPeriods 
} from '../../utils/calculator';
import { 
  Sparkles, 
  User, 
  Trophy, 
  Calendar,
  Award,
  ShieldAlert,
  CheckCircle2,
  ChevronDown,
  Search,
  Check,
  Plus
} from 'lucide-react';

interface Option1SummaryViewProps {
  staffList: Staff[];
  incidents: IncidentRecord[];
  questions: Question[];
  params: ParameterConfig;
  onOpenIncidentModal: (targetId?: string, type?: 'ghi_nhan' | 'vi_pham') => void;
  isManager: boolean;
  currentUser: AuthUser | null;
}

export const Option1SummaryView: React.FC<Option1SummaryViewProps> = ({
  staffList,
  incidents,
  questions,
  params,
  onOpenIncidentModal,
  isManager,
  currentUser,
}) => {
  const isHRManager = isHRHeadRole(currentUser);
  const recentPeriods = get3RecentPeriods();
  const [selectedPeriodKey, setSelectedPeriodKey] = useState<string>(recentPeriods[0].key);
  const currentPeriodObj = recentPeriods.find(p => p.key === selectedPeriodKey) || recentPeriods[0];

  const visibleStaffList = (isHRManager 
    ? staffList 
    : staffList.filter(s => s.id === currentUser?.id)
  ).slice().sort((a, b) => {
    const numA = parseInt(a.id.replace(/\D/g, ''), 10);
    const numB = parseInt(b.id.replace(/\D/g, ''), 10);
    return numA - numB;
  });

  const [selectedStaffId, setSelectedStaffId] = useState<string>(
    isHRManager 
      ? (staffList[0]?.id || '')
      : (currentUser?.id || staffList[0]?.id || '')
  );

  const [isStaffDropdownOpen, setIsStaffDropdownOpen] = useState(false);
  const [staffSearchQuery, setStaffSearchQuery] = useState('');

  const filteredStaffDropdownList = visibleStaffList.filter(s => 
    s.name.toLowerCase().includes(staffSearchQuery.toLowerCase()) ||
    s.id.toLowerCase().includes(staffSearchQuery.toLowerCase()) ||
    s.line.toLowerCase().includes(staffSearchQuery.toLowerCase())
  );

  useEffect(() => {
    if (!isHRManager && currentUser?.id) {
      setSelectedStaffId(currentUser.id);
    }
  }, [currentUser, isHRManager]);

  const staff = visibleStaffList.find(s => s.id === selectedStaffId) || visibleStaffList[0];

  if (!staff) return null;

  const staffIncidents = incidents.filter(i => i.targetId === staff.id);
  const pendingAppeals = incidents.filter(i => i.status === 'Đang kháng nghị');

  const overallScore = calculateTotalScoreForStaff(staff, params);
  const salaryTierNum = calculateSalaryTier(overallScore, params);
  const tier = getSalaryTierBadge(salaryTierNum);
  const hasMgmtRole = isManagementRole(staff);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner KPI Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white p-6 shadow-xl border border-emerald-700/40">
        <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>Giao Diện Option 1 - Streamlined WebApp</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight font-sans text-white">
              Ghi Nhận Phản Hồi Nhân Sự NCTTX
            </h2>
            <p className="text-emerald-100/80 text-sm mt-1">
              Nhà Của Thời Thanh Xuân • Đơn vị sản xuất & dịch vụ tử tế
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {recentPeriods.map((p) => (
              <button
                key={p.key}
                onClick={() => setSelectedPeriodKey(p.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-sm ${
                  selectedPeriodKey === p.key
                    ? 'bg-white text-emerald-900 font-bold shadow-md scale-105'
                    : 'bg-emerald-800/60 text-emerald-100 hover:bg-emerald-700/60 border border-emerald-600/30'
                }`}
              >
                <Calendar className="w-3 h-3 inline mr-1 opacity-70" />
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-emerald-700/50">
          <div className="bg-emerald-950/40 backdrop-blur-md rounded-2xl p-3.5 border border-emerald-500/20">
            <span className="text-xs text-emerald-200/80 font-medium block">Tổng Nhân Sự</span>
            <span className="text-xl font-bold text-white mt-1 block">{staffList.length} nhân sự</span>
          </div>

          <div className="bg-emerald-950/40 backdrop-blur-md rounded-2xl p-3.5 border border-emerald-500/20">
            <span className="text-xs text-emerald-200/80 font-medium block">Tuyên Dương</span>
            <span className="text-xl font-bold text-emerald-300 mt-1 block">+{incidents.filter(i => i.type === 'ghi_nhan').length} phiếu</span>
          </div>

          <div className="bg-emerald-950/40 backdrop-blur-md rounded-2xl p-3.5 border border-emerald-500/20">
            <span className="text-xs text-emerald-200/80 font-medium block">Biên Bản Vi Phạm</span>
            <span className="text-xl font-bold text-rose-300 mt-1 block">{incidents.filter(i => i.type === 'vi_pham').length} phiếu</span>
          </div>

          <div className="bg-emerald-950/40 backdrop-blur-md rounded-2xl p-3.5 border border-emerald-500/20">
            <span className="text-xs text-emerald-200/80 font-medium block">Kháng Nghị Chờ Xử Lý</span>
            <span className="text-xl font-bold text-amber-300 mt-1 block">{pendingAppeals.length} phiếu</span>
          </div>
        </div>
      </div>

      {/* Staff Selector Pillar Bar with Dropdown List */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 relative z-30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Pillar Selector Button */}
          <div className="relative flex-1">
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span>Nhân sự đang xem ({visibleStaffList.length})</span>
            </label>

            <button
              type="button"
              onClick={() => setIsStaffDropdownOpen(!isStaffDropdownOpen)}
              className="w-full flex items-center justify-between gap-3 p-2.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-slate-50 border border-emerald-500/30 hover:border-emerald-500/60 shadow-sm hover:shadow transition-all duration-200 group text-left"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md shadow-emerald-600/20 shrink-0">
                  {staff.name.substring(0, 1)}
                </div>
                <div className="min-w-0">
                  <div className="font-extrabold text-sm text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                    {staff.name}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium truncate mt-0.5">
                    <span className="font-mono text-emerald-700 font-bold bg-emerald-100/80 px-1.5 py-0.2 rounded text-[10px]">
                      {staff.id}
                    </span>
                    <span>•</span>
                    <span className="truncate">{staff.line}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="hidden md:inline-block text-xs font-bold text-emerald-700 bg-emerald-100/60 px-2 py-1 rounded-xl">
                  Đổi nhân sự
                </span>
                <div className="p-1 rounded-xl bg-white border border-slate-200 text-slate-500 group-hover:text-emerald-600 group-hover:border-emerald-300 transition-all">
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isStaffDropdownOpen ? 'rotate-180' : ''}`} />
                </div>
              </div>
            </button>

            {/* Dropdown Menu Overlay ("Xổ danh sách") */}
            {isStaffDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsStaffDropdownOpen(false)}
                ></div>
                <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-2xl rounded-3xl p-3 animate-in fade-in slide-in-from-top-2 duration-200 max-h-96 flex flex-col">
                  
                  {/* Search Filter Header */}
                  <div className="relative mb-2 shrink-0">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={staffSearchQuery}
                      onChange={(e) => setStaffSearchQuery(e.target.value)}
                      placeholder="Tìm theo tên hoặc mã nhân sự (TTX...)"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-100 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-white transition-all font-medium"
                      autoFocus
                    />
                  </div>

                  {/* Staff List Items */}
                  <div className="overflow-y-auto space-y-1 pr-1 flex-1 scrollbar-thin">
                    {filteredStaffDropdownList.length === 0 ? (
                      <div className="text-center py-6 text-xs text-slate-400 font-medium">
                        Không tìm thấy nhân sự phù hợp
                      </div>
                    ) : (
                      filteredStaffDropdownList.map((s) => {
                        const isSelected = selectedStaffId === s.id;
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => {
                              setSelectedStaffId(s.id);
                              setIsStaffDropdownOpen(false);
                              setStaffSearchQuery('');
                            }}
                            className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-xs transition-all ${
                              isSelected
                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-md shadow-emerald-600/20'
                                : 'hover:bg-emerald-50/80 text-slate-700 hover:text-slate-900 font-medium'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                                isSelected ? 'bg-white text-emerald-800' : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                {s.name.substring(0, 1)}
                              </div>
                              <div className="text-left min-w-0">
                                <div className="truncate font-semibold">{s.name}</div>
                                <div className={`text-[10px] truncate ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                                  {s.id} • {s.line}
                                </div>
                              </div>
                            </div>

                            {isSelected && (
                              <Check className="w-4 h-4 text-white shrink-0" />
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Action Buttons (+ Tuyên Dương / + Ghi Vi Phạm) */}
          {isHRManager && (
            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                onClick={() => onOpenIncidentModal(staff.id, 'ghi_nhan')}
                className="px-3.5 py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-all border border-emerald-200/80 shadow-sm flex items-center gap-1.5 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tuyên Dương</span>
              </button>
              <button
                onClick={() => onOpenIncidentModal(staff.id, 'vi_pham')}
                className="px-3.5 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold transition-all border border-rose-200/80 shadow-sm flex items-center gap-1.5 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5 text-rose-600" />
                <span>Ghi Vi Phạm</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Staff Dashboard Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card & Score Summary */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 md:col-span-1 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-emerald-600/20">
              {staff.name.substring(0, 1)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                  {staff.id}
                </span>
                <span className="text-xs text-slate-500 font-medium">{staff.role}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-1">{staff.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{staff.line} • {staff.department}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Điểm Đánh Giá Tổng Thể</span>
              <span className="text-xs font-bold text-emerald-700">{overallScore}/5.0</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${(overallScore / 5) * 100}%` }}
              ></div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs gap-2">
              <div>
                <span className="text-slate-400 block text-[10px] whitespace-nowrap">
                  Văn hóa ({hasMgmtRole ? '50%' : '65%'})
                </span>
                <span className="font-semibold text-slate-700">{staff.generalScore}/5.0</span>
              </div>
              {hasMgmtRole && (
                <div>
                  <span className="text-slate-400 block text-[10px] whitespace-nowrap">Quản lý (30%)</span>
                  <span className="font-semibold text-slate-700">{staff.mgmtScore ?? 5.0}/5.0</span>
                </div>
              )}
              <div className="text-right">
                <span className="text-slate-400 block text-[10px] whitespace-nowrap">
                  Chuyên môn ({hasMgmtRole ? '20%' : '35%'})
                </span>
                <span className="font-semibold text-slate-700">{staff.techScore}/5.0</span>
              </div>
            </div>
          </div>

          {/* Salary Tier Badge */}
          <div className={`p-4 rounded-2xl border ${tier.bgClass} ${tier.textClass} flex items-center justify-between`}>
            <div>
              <span className="text-[11px] uppercase tracking-wider font-semibold opacity-80 block">Xếp Bậc Lương P2</span>
              <span className="text-lg font-bold block">{tier.label}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] opacity-75 block">Chu kỳ: {currentPeriodObj.label}</span>
            </div>
          </div>
        </div>

        {/* Detailed Feed & History */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 md:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span>Lịch Sử Phản Hồi & Ghi Nhận</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Các sự kiện khen thưởng và vi phạm đã ghi nhận trong hệ thống
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
              {staffIncidents.length} sự kiện
            </span>
          </div>

          {staffIncidents.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-60" />
              <p className="text-sm font-medium text-slate-600">Chưa có sự kiện phản hồi nào trong kỳ này</p>
              <p className="text-xs text-slate-400 mt-1">Nhân sự duy trì kỷ luật và phong độ làm việc tốt</p>
            </div>
          ) : (
            <div className="space-y-3">
              {staffIncidents.map((incident) => {
                const isRecognition = incident.type === 'ghi_nhan';
                return (
                  <div
                    key={incident.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isRecognition
                        ? 'bg-emerald-50/50 border-emerald-200/80 text-emerald-950'
                        : 'bg-rose-50/50 border-rose-200/80 text-rose-950'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          isRecognition ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                        }`}>
                          {isRecognition ? <Award className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                              isRecognition ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {isRecognition ? 'Tuyên Dương' : 'Vi Phạm'}
                            </span>
                            <span className="text-xs text-slate-500">{incident.date}</span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 mt-1">{incident.title}</h4>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{incident.description}</p>
                          {incident.imageUrl && (
                            <img
                              src={incident.imageUrl}
                              alt="Minh chứng"
                              className="mt-2 w-24 h-16 object-cover rounded-lg border border-slate-200"
                            />
                          )}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                          incident.status === 'Đã duyệt'
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {incident.status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
