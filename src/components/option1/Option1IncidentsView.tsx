import React, { useState, useEffect } from 'react';
import { IncidentRecord, Staff, Question, AuthUser, IncidentStatus } from '../../types';
import { isHRHeadRole, getActiveHRHead, isDeptHeadOrAboveRole, canUserViewIncident, get3RecentPeriods, isSystemAdmin, isPolicyIncident, isWorkViolation, isRecognitionIncident, getIncidentDisplayCode } from '../../utils/calculator';
import { 
  Trophy, 
  Plus, 
  Search, 
  Clock, 
  Award, 
  ShieldAlert, 
  CheckCircle2, 
  Send, 
  X,
  Image as ImageIcon,
  UserCheck,
  FileText,
  Trash2,
  RotateCcw,
  Lock,
  Sparkles,
  Eye,
  Scale,
  XCircle,
  Check,
  BookOpen,
  Copy
} from 'lucide-react';

interface Option1IncidentsViewProps {
  incidents: IncidentRecord[];
  staffList: Staff[];
  questions: Question[];
  onAddIncident: (incident: IncidentRecord) => void;
  onDeleteIncident?: (incidentId: string) => void;
  onRestoreIncident?: (incidentId: string) => void;
  onPermanentDeleteIncident?: (incidentId: string) => void;
  onUpdateStatus: (id: string, status: IncidentStatus) => void;
  isManager: boolean;
  onOpenIncidentModal: (targetId?: string, type?: 'ghi_nhan' | 'vi_pham' | 'noi_quy') => void;
  currentUser: AuthUser | null;
  onAppealIncident: (incidentId: string, reason: string) => void;
  onResolveAppeal: (incidentId: string, approved: boolean) => void;
  initialFilterType?: string;
  onOpenChoiceModal?: () => void;
}

export const Option1IncidentsView: React.FC<Option1IncidentsViewProps> = ({
  incidents,
  staffList,
  questions,
  onAddIncident,
  onDeleteIncident,
  onRestoreIncident,
  onPermanentDeleteIncident,
  onUpdateStatus,
  isManager,
  onOpenIncidentModal,
  currentUser,
  onAppealIncident,
  onResolveAppeal,
  initialFilterType = 'all',
  onOpenChoiceModal,
}) => {
  const [filterType, setFilterType] = useState<string>(initialFilterType);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedIncidentForAppeal, setSelectedIncidentForAppeal] = useState<IncidentRecord | null>(null);
  const [appealReason, setAppealReason] = useState<string>('');
  const [viewImageModal, setViewImageModal] = useState<string | null>(null);
  const [copiedTicketId, setCopiedTicketId] = useState<string | null>(null);

  const recentPeriods = get3RecentPeriods();
  const [selectedMonthFilter, setSelectedMonthFilter] = useState<string>('all');

  useEffect(() => {
    if (initialFilterType) {
      setFilterType(initialFilterType);
    }
  }, [initialFilterType]);

  const isHRManager = isHRHeadRole(currentUser);
  const isAdminUser = isSystemAdmin(currentUser);
  const isManagerOrDeptHead = isManager || isDeptHeadOrAboveRole(currentUser) || isHRManager || isAdminUser;
  const activeHRHead = getActiveHRHead(staffList);

  // Privacy & Access Scoping:
  const userIncidents = incidents.filter(item => !item.isPurged && canUserViewIncident(currentUser, item, staffList));
  const activeIncidents = userIncidents.filter(item => !item.isDeleted);
  const deletedIncidents = userIncidents.filter(item => Boolean(item.isDeleted) && !item.isPurged);

  const mySubmittedIncidents = activeIncidents.filter(i => i.reporterId === currentUser?.id);
  const myReceivedIncidents = activeIncidents.filter(i => i.targetId === currentUser?.id);
  const policyIncidentsCount = activeIncidents.filter(isPolicyIncident).length;
  const recognitionCount = activeIncidents.filter(isRecognitionIncident).length;
  const workViolationsCount = activeIncidents.filter(isWorkViolation).length;

  const baseListToFilter = filterType === 'trash' ? deletedIncidents : activeIncidents;

  const filteredIncidents = baseListToFilter.filter((item) => {
    if (selectedMonthFilter !== 'all') {
      const [yStr, mStr] = selectedMonthFilter.split('-');
      const patternSlash = `${mStr}/${yStr}`;
      const patternDash = `${yStr}-${mStr}`;

      const matchesMonth = (item.createdAt && item.createdAt.startsWith(patternDash)) ||
                           (item.date && (item.date.includes(patternSlash) || item.date.includes(patternDash)));
      if (!matchesMonth) return false;
    }

    if (filterType === 'my_submitted') {
      if (item.reporterId !== currentUser?.id) return false;
    } else if (filterType === 'my_received') {
      if (item.targetId !== currentUser?.id) return false;
    } else if (filterType === 'cho_duyet') {
      if (item.status !== 'Đang xem xét' && item.status !== 'Chờ duyệt' && item.status !== 'Chờ HR duyệt') return false;
    } else if (filterType === 'noi_quy') {
      // 1. Tab Nội Quy: Chỉ các biên bản nội quy lao động (Quỹ 100đ)
      if (!isPolicyIncident(item)) return false;
    } else if (filterType === 'ghi_nhan') {
      // 2. Tab Ghi Nhận: Chỉ các phiếu tuyên dương / khen thưởng (+5.0đ)
      if (!isRecognitionIncident(item)) return false;
    } else if (filterType === 'vi_pham') {
      // 3. Tab Vi Phạm Công Việc: Chỉ các biên bản vi phạm chuyên môn / sự cố (-5.0đ)
      if (!isWorkViolation(item)) return false;
    } else if (filterType === 'khang_nghi') {
      if (item.status !== 'Đang kháng nghị' && !item.appealReason) return false;
    }

    const targetStaff = staffList.find(s => s.id === item.targetId);
    const staffName = targetStaff ? targetStaff.name : (item.targetId || '');
    const reporterName = item.reporterName || '';
    const displayCode = getIncidentDisplayCode(item);
    const term = (searchTerm || '').toLowerCase();
    const matchesSearch = !term || 
                          staffName.toLowerCase().includes(term) ||
                          reporterName.toLowerCase().includes(term) ||
                          (item.title && item.title.toLowerCase().includes(term)) ||
                          (item.targetId && item.targetId.toLowerCase().includes(term)) ||
                          (item.reporterId && item.reporterId.toLowerCase().includes(term)) ||
                          (item.id && item.id.toLowerCase().includes(term)) ||
                          displayCode.toLowerCase().includes(term) ||
                          (item.ticketCode && item.ticketCode.toLowerCase().includes(term));

    if (!matchesSearch) return false;

    return true;
  });

  const handleSendAppeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIncidentForAppeal || !appealReason.trim()) return;
    onAppealIncident(selectedIncidentForAppeal.id, appealReason);
    setSelectedIncidentForAppeal(null);
    setAppealReason('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-3xl shadow-sm border border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-900">Nhật Ký Phản Hồi Nhân Sự</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Ghi nhận khen thưởng, biên bản vi phạm chuyên môn, kỷ luật nội quy & kháng nghị 48h
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => onOpenChoiceModal ? onOpenChoiceModal() : onOpenIncidentModal()}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-95 whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo Phản Hồi Mới</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Tabs */}
      <div className="space-y-3">
        {/* Month Filter Selector Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="font-extrabold text-slate-400 uppercase text-[10px] shrink-0">Lọc Theo Tháng:</span>
          <button
            onClick={() => setSelectedMonthFilter('all')}
            className={`px-3 py-1 rounded-xl font-bold transition-all border whitespace-nowrap cursor-pointer ${
              selectedMonthFilter === 'all'
                ? 'bg-emerald-950 text-white border-emerald-950 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Tất cả các tháng
          </button>
          {recentPeriods.map(p => (
            <button
              key={p.key}
              onClick={() => setSelectedMonthFilter(p.key)}
              className={`px-3 py-1 rounded-xl font-bold transition-all border whitespace-nowrap cursor-pointer ${
                selectedMonthFilter === p.key
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo mã số phiếu (vd: VP-2611-001, NQ..., TD..., CA...), tiêu đề, tên nhân sự..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">

          {/* Quick Filter: My Received Tickets */}
          {currentUser && (
            <button
              onClick={() => setFilterType('my_received')}
              className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 whitespace-nowrap ${
                filterType === 'my_received'
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>🎯 Phiếu nhận của tôi</span>
              <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {myReceivedIncidents.length}
              </span>
            </button>
          )}

          {/* Quick Filter: My Submitted Tickets */}
          {currentUser && (
            <button
              onClick={() => setFilterType('my_submitted')}
              className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 whitespace-nowrap ${
                filterType === 'my_submitted'
                  ? 'bg-blue-700 text-white border-blue-700 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>📝 Phiếu tôi đã lập</span>
              <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {mySubmittedIncidents.length}
              </span>
            </button>
          )}

          <button
            onClick={() => setFilterType('all')}
            className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border whitespace-nowrap ${
              filterType === 'all'
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Tất cả phiếu ({activeIncidents.length})
          </button>

          {/* Quick Filter: Chờ HR Duyệt */}
          {activeIncidents.filter(i => i.status === 'Đang xem xét' || i.status === 'Chờ duyệt' || i.status === 'Chờ HR duyệt').length > 0 && (
            <button
              onClick={() => setFilterType('cho_duyet')}
              className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 whitespace-nowrap ${
                filterType === 'cho_duyet'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                  : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Chờ HR Duyệt</span>
              <span className="bg-amber-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-extrabold">
                {activeIncidents.filter(i => i.status === 'Đang xem xét' || i.status === 'Chờ duyệt' || i.status === 'Chờ HR duyệt').length}
              </span>
            </button>
          )}
          
          {/* 1. TAB NỘI QUY MÀU VÀNG NỔI BẬT */}
          <button
            onClick={() => setFilterType('noi_quy')}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-black transition-all border flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              filterType === 'noi_quy'
                ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-md ring-2 ring-amber-300 font-black'
                : 'bg-amber-100/80 text-amber-950 border-amber-300 hover:bg-amber-200 hover:border-amber-400'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-900" />
            <span>📖 Nội Quy</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
              filterType === 'noi_quy' ? 'bg-amber-950 text-white' : 'bg-amber-200 text-amber-950'
            }`}>
              {policyIncidentsCount}
            </span>
          </button>

          {/* 2. TAB GHI NHẬN MÀU XANH */}
          <button
            onClick={() => setFilterType('ghi_nhan')}
            className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              filterType === 'ghi_nhan'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm font-black'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-emerald-50 hover:text-emerald-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Ghi Nhận (+{recognitionCount})</span>
          </button>

          {/* 3. TAB VI PHẠM CÔNG VIỆC MÀU ĐỎ */}
          <button
            onClick={() => setFilterType('vi_pham')}
            className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              filterType === 'vi_pham'
                ? 'bg-rose-600 text-white border-rose-600 shadow-sm font-black'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-rose-50 hover:text-rose-800'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Vi Phạm CV ({workViolationsCount})</span>
          </button>

          <button
            onClick={() => setFilterType('khang_nghi')}
            className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border whitespace-nowrap ${
              filterType === 'khang_nghi'
                ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Kháng Nghị 48h ({activeIncidents.filter(i => i.status === 'Đang kháng nghị' || !!i.appealReason).length})
          </button>

          {/* Admin Trash Bin Filter Tab */}
          {isAdminUser && (
            <button
              onClick={() => setFilterType('trash')}
              className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 whitespace-nowrap ${
                filterType === 'trash'
                  ? 'bg-rose-700 text-white border-rose-700 shadow-sm'
                  : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Thùng Rác</span>
              <span className="bg-rose-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-extrabold">
                {deletedIncidents.length}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* INCIDENT FEED LIST */}
      <div className="space-y-3">
        {/* Banner Giới Thiệu Chuyên Biệt Khi Đang Ở Tab Nội Quy Màu Vàng */}
        {filterType === 'noi_quy' && (
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border border-amber-300/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-black shrink-0 shadow-xs">
                <BookOpen className="w-5 h-5 text-amber-950" />
              </div>
              <div>
                <h3 className="text-sm font-black text-amber-950 flex items-center gap-2">
                  <span>Sổ Ghi Nhận Nội Quy Lao Động</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-950 text-[10px] font-mono font-bold">100đ Quỹ Chấp Hành</span>
                </h3>
                <p className="text-xs text-amber-900 font-medium mt-0.5">
                  Tập hợp các biên bản ghi nhận việc chấp hành nội quy, giờ giấc, trật tự, tác phong và văn hóa ứng xử tại điểm bán.
                </p>
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => onOpenIncidentModal(undefined, 'noi_quy')}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-amber-950 font-black text-xs shadow-md shadow-amber-400/20 active:scale-95 transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-950" />
              <span>Lập Phiếu Nội Quy</span>
            </button>
          </div>
        )}

        {/* Banner Giới Thiệu Chuyên Biệt Khi Đang Ở Tab Ghi Nhận Khen Thưởng Màu Xanh */}
        {filterType === 'ghi_nhan' && (
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-500/15 border border-emerald-300/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black shrink-0 shadow-xs">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-black text-emerald-950 flex items-center gap-2">
                  <span>Sổ Tuyên Dương & Ghi Nhận Khen Thưởng</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-950 text-[10px] font-mono font-bold">+ Thang 5.0đ Khen Thưởng</span>
                </h3>
                <p className="text-xs text-emerald-900 font-medium mt-0.5">
                  Biểu dương những nỗ lực vượt trội, tinh thần trách nhiệm, sáng kiến và cống hiến xuất sắc của nhân sự trong ca làm việc.
                </p>
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => onOpenIncidentModal(undefined, 'ghi_nhan')}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Lập Phiếu Ghi Nhận</span>
            </button>
          </div>
        )}

        {/* Banner Giới Thiệu Chuyên Biệt Khi Đang Ở Tab Vi Phạm Công Việc Màu Đỏ */}
        {filterType === 'vi_pham' && (
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-rose-500/15 via-red-500/10 to-rose-500/15 border border-rose-300/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-black shrink-0 shadow-xs">
                <ShieldAlert className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-black text-rose-950 flex items-center gap-2">
                  <span>Biên Bản Vi Phạm Tiêu Chuẩn Công Việc</span>
                  <span className="px-2 py-0.5 rounded-full bg-rose-200 text-rose-950 text-[10px] font-mono font-bold">- Thang 5.0đ Chuyên Môn</span>
                </h3>
                <p className="text-xs text-rose-900 font-medium mt-0.5">
                  Ghi nhận các sự cố nghiệp vụ, vi phạm quy trình chuyên môn hoặc nhắc nhở ranh giới không thỏa hiệp.
                </p>
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => onOpenIncidentModal(undefined, 'vi_pham')}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 active:scale-95 transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Lập Phiếu Vi Phạm</span>
            </button>
          </div>
        )}

        {/* Banner Giới Thiệu Chuyên Biệt Khi Đang Ở Tab Kháng Nghị 48h */}
        {filterType === 'khang_nghi' && (
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-blue-500/15 via-indigo-500/10 to-blue-500/15 border border-blue-300/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shrink-0 shadow-xs">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-black text-blue-950 flex items-center gap-2">
                  <span>Sổ Kháng Nghị & Khiếu Nại 48h</span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-200 text-blue-950 text-[10px] font-mono font-bold">Quyền Lợi Nhân Sự</span>
                </h3>
                <p className="text-xs text-blue-900 font-medium mt-0.5">
                  Kênh tiếp nhận giải trình, khiếu nại minh bạch gửi trực tiếp tới Trưởng phòng Nhân sự trong vòng 48h kể từ khi nhận phiếu.
                </p>
              </div>
            </div>
          </div>
        )}

        {filteredIncidents.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200/80 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">
              {filterType === 'noi_quy' 
                ? 'Không tìm thấy phiếu vi phạm nội quy nào' 
                : filterType === 'ghi_nhan'
                ? 'Không tìm thấy phiếu ghi nhận khen thưởng nào'
                : filterType === 'vi_pham'
                ? 'Không tìm thấy phiếu vi phạm công việc nào'
                : filterType === 'khang_nghi'
                ? 'Hiện không có phiếu nào đang chờ giải quyết kháng nghị'
                : 'Không tìm thấy phiếu phản hồi nào'}
            </p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {filterType === 'noi_quy'
                ? 'Các biên bản chấp hành nội quy lao động (Quỹ 100đ) sẽ được lưu trữ và hiển thị tại đây.'
                : filterType === 'ghi_nhan'
                ? 'Các phiếu tuyên dương, khen thưởng nỗ lực xuất sắc (+5.0đ) sẽ được hiển thị tại đây.'
                : filterType === 'vi_pham'
                ? 'Các biên bản ghi nhận vi phạm tiêu chuẩn công việc (-5.0đ) sẽ được hiển thị tại đây.'
                : 'Thử thay đổi bộ lọc thời gian hoặc từ khóa tìm kiếm.'}
            </p>
          </div>
        ) : (
            filteredIncidents.map((incident) => {
              if (!incident) return null;
              const isRecognition = isRecognitionIncident(incident);
              const isPolicy = isPolicyIncident(incident);
              const staff = staffList.find(s => s.id === incident.targetId);
              const isTargetUser = currentUser?.id === incident.targetId;
              const canAppeal = !isRecognition &&
                                (isTargetUser || isAdminUser || isHRManager) &&
                                (incident.status === 'Đã ghi nhận' || incident.status === 'Đã duyệt');
              const isSubmittedByMe = currentUser?.id === incident.reporterId;
              const isReceivedByMe = currentUser?.id === incident.targetId;
              const displayCode = getIncidentDisplayCode(incident);

              return (
                <div
                  key={incident.id}
                  className={`bg-white rounded-3xl p-5 shadow-sm border transition-all space-y-3 ${
                    isRecognition 
                      ? 'border-emerald-200/80 hover:border-emerald-300' 
                      : isPolicy 
                      ? 'border-amber-300/80 hover:border-amber-400 bg-amber-50/15'
                      : 'border-rose-200/80 hover:border-rose-300 bg-rose-50/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 font-bold ${
                        isRecognition 
                          ? 'bg-emerald-600 text-white' 
                          : isPolicy 
                          ? 'bg-amber-400 text-amber-950 shadow-xs' 
                          : 'bg-rose-600 text-white shadow-xs'
                      }`}>
                        {isRecognition 
                          ? <Award className="w-5 h-5 text-white" /> 
                          : isPolicy 
                          ? <BookOpen className="w-5 h-5 text-amber-950" /> 
                          : <ShieldAlert className="w-5 h-5 text-white" />}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          {/* Mã Số Phiếu Tag */}
                          <div className="flex items-center gap-1">
                            <span className={`text-[11px] font-mono font-black px-2.5 py-0.5 rounded-full border shadow-2xs flex items-center gap-1 ${
                              isRecognition 
                                ? 'bg-emerald-50 text-emerald-900 border-emerald-300' 
                                : isPolicy 
                                ? 'bg-amber-50 text-amber-950 border-amber-300' 
                                : 'bg-rose-50 text-rose-900 border-rose-300'
                            }`} title={`Mã số phiếu: ${displayCode}`}>
                              <span className="opacity-60 text-[9px] font-sans font-extrabold uppercase">Mã:</span>
                              <span className="tracking-wide">{displayCode}</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(displayCode);
                                setCopiedTicketId(displayCode);
                                setTimeout(() => setCopiedTicketId(null), 2000);
                              }}
                              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                              title={`Sao chép mã ${displayCode}`}
                            >
                              {copiedTicketId === displayCode ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>

                          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            isRecognition 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : isPolicy 
                              ? 'bg-amber-100 text-amber-950 border border-amber-300 font-extrabold'
                              : 'bg-rose-100 text-rose-800 font-bold'
                          }`}>
                            {isRecognition 
                              ? '🌟 Ghi Nhận' 
                              : isPolicy 
                              ? (incident.policyRuleId ? `📖 Nội Quy (${incident.policyRuleId})` : '📖 Nội Quy Lao Động') 
                              : '⚠️ Vi Phạm Công Việc'}
                          </span>
                          <span className="text-xs font-semibold text-slate-900">
                            Đối tượng: <strong>{staff ? `${staff.name} (${staff.id})` : incident.targetId}</strong>
                          </span>
                          <span className="text-xs text-slate-400">• {incident.date}</span>

                          {isSubmittedByMe && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                              📝 Bạn đã lập phiếu
                            </span>
                          )}
                          {isReceivedByMe && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                              🎯 Phiếu dành cho bạn
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mt-1">{incident.title}</h3>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{incident.description}</p>
                      </div>
                    </div>

                    <span className={`text-xs font-bold px-2.5 py-1 rounded-xl flex-shrink-0 flex items-center gap-1.5 ${
                      incident.status === 'Đang xem xét' || incident.status === 'Chờ HR duyệt' || incident.status === 'Chờ duyệt'
                        ? 'bg-amber-50 text-amber-800 border border-amber-300'
                        : incident.status === 'Đang kháng nghị'
                        ? 'bg-orange-50 text-orange-800 border border-orange-300'
                        : incident.status === 'Kháng nghị được chấp nhận'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                        : incident.status === 'Kháng nghị bị từ chối'
                        ? 'bg-rose-50 text-rose-800 border border-rose-300'
                        : incident.status === 'Đã ghi nhận' || incident.status === 'Đã duyệt'
                        ? isRecognition
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                          : 'bg-rose-50 text-rose-800 border border-rose-300'
                        : incident.status === 'Từ chối'
                        ? 'bg-slate-100 text-slate-600 border border-slate-300'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {(incident.status === 'Đang xem xét' || incident.status === 'Chờ HR duyệt' || incident.status === 'Chờ duyệt') && (
                        <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                      )}
                      {incident.status === 'Đang kháng nghị' && (
                        <Clock className="w-3.5 h-3.5 text-orange-600 animate-pulse" />
                      )}
                      {(incident.status === 'Đã ghi nhận' || incident.status === 'Đã duyệt' || incident.status === 'Kháng nghị được chấp nhận') && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                      {incident.status}
                    </span>
                  </div>

                  {/* Evidence Image Thumbnail */}
                  {incident.imageUrl && (
                    <div className="pt-2">
                      <button
                        onClick={() => setViewImageModal(incident.imageUrl || null)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-all"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                        <span>Xem ảnh minh chứng</span>
                      </button>
                    </div>
                  )}

                  {/* Appeal Reason Display */}
                  {incident.appealReason && (
                    <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200/60 text-xs space-y-1">
                      <div className="font-bold text-amber-900 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Nội dung kháng nghị 48h gửi TP Nhân sự:</span>
                      </div>
                      <p className="text-amber-800 leading-relaxed">{incident.appealReason}</p>
                    </div>
                  )}

                  {/* Footer Action Bar */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-500">
                      Người lập/ghi nhận: <strong className="text-slate-800">{incident.reporterName || 'Quản lý'}</strong>
                      {incident.reporterId && <span className="text-slate-400 font-mono ml-1">({incident.reporterId})</span>}
                    </span>

                    {/* TRASH BIN ACTIONS FOR ADMIN */}
                    {incident.isDeleted && isAdminUser ? (
                      <div className="flex items-center gap-2 ml-auto">
                        {onRestoreIncident && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`↺ Admin xác nhận: Khôi phục phiếu [${incident.id}] "${incident.title}" từ Thùng Rác về hệ thống?`)) {
                                onRestoreIncident(incident.id);
                              }
                            }}
                            className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1 active:scale-95"
                            title="Khôi phục phiếu này về danh sách chính và cộng/trừ lại điểm"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Khôi phục phiếu</span>
                          </button>
                        )}
                        {(onPermanentDeleteIncident || onDeleteIncident) && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`⚠️ XÁC NHẬN: Bạn có chắc chắn muốn XÓA VĨNH VIỄN phiếu [${incident.id}] "${incident.title}"? Thao tác này KHÔNG THỂ KHÔI PHỤC!`)) {
                                if (onPermanentDeleteIncident) onPermanentDeleteIncident(incident.id);
                                else if (onDeleteIncident) onDeleteIncident(incident.id);
                              }
                            }}
                            className="px-3 py-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1 active:scale-95"
                            title="Xóa vĩnh viễn khỏi trường dữ liệu"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Xóa vĩnh viễn</span>
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 ml-auto flex-wrap">
                        {/* 1. NÚT KHÁNG NGHỊ DÀNH CHO PHIẾU LẬP BIÊN BẢN */}
                        {canAppeal && (
                          <button
                            type="button"
                            onClick={() => setSelectedIncidentForAppeal(incident)}
                            className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 active:scale-95 cursor-pointer"
                            title="Gửi kháng nghị lên Trưởng phòng Nhân sự xem xét"
                          >
                            <Scale className="w-3.5 h-3.5 text-amber-700" />
                            <span>Gửi Kháng Nghị</span>
                          </button>
                        )}

                        {/* 2. HR XỬ LÝ KHÁNG NGHỊ BIÊN BẢN */}
                        {(isHRManager || isAdminUser) && incident.status === 'Đang kháng nghị' && (
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => onResolveAppeal(incident.id, true)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1 active:scale-95 cursor-pointer"
                              title="HR chấp nhận kháng nghị: Hủy phạt và hoàn lại điểm"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Chấp Nhận Kháng Nghị (Hủy Phạt)</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onResolveAppeal(incident.id, false)}
                              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1 active:scale-95 cursor-pointer"
                              title="HR bác bỏ kháng nghị: Giữ nguyên mức trừ điểm"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Bác Kháng Nghị (Giữ Nguyên)</span>
                            </button>
                          </div>
                        )}

                        {/* 3. HR XEM XÉT & DUYỆT PHIẾU GHI NHẬN (Từ 'Đang xem xét' sang 'Đã ghi nhận') */}
                        {isRecognition && (isHRManager || isAdminUser) && (incident.status === 'Đang xem xét' || incident.status === 'Chờ HR duyệt' || incident.status === 'Chờ duyệt') && (
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => onUpdateStatus(incident.id, 'Đã ghi nhận')}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1 active:scale-95 cursor-pointer"
                              title="HR duyệt ghi nhận: Chuyển sang Đã ghi nhận và cộng điểm thành tích"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Duyệt Ghi Nhận</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onUpdateStatus(incident.id, 'Từ chối')}
                              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-300 text-xs font-bold transition-all shadow-2xs flex items-center gap-1 active:scale-95 cursor-pointer"
                              title="Từ chối ghi nhận thành tích này"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Từ Chối</span>
                            </button>
                          </div>
                        )}

                        {/* Admin Soft-Delete Action Button */}
                        {isAdminUser && onDeleteIncident && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`⚠️ Admin xác nhận: Chuyển phiếu [${incident.id}] "${incident.title}" vào Thùng Rác? (Có thể khôi phục lại sau)`)) {
                                onDeleteIncident(incident.id);
                              }
                            }}
                            className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
                            title="Quyền Admin: Chuyển phiếu vào Thùng Rác"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Chuyển vào Thùng Rác</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

      {/* Appeal Form Modal */}
      {selectedIncidentForAppeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Gửi Kháng Nghị Phiếu Vi Phạm</h3>
              <button onClick={() => setSelectedIncidentForAppeal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendAppeal} className="space-y-3 text-xs">
              <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200/60 text-rose-900">
                <span className="font-bold block">{selectedIncidentForAppeal.title}</span>
                <span className="text-[11px] opacity-80">{selectedIncidentForAppeal.date}</span>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Lý do kháng nghị (gửi trực tiếp tới TP Nhân sự {activeHRHead?.name || 'Trần Thị Thanh Hải'}):
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Nêu rõ lý do hoặc bằng chứng giải trình bổ sung..."
                  value={appealReason}
                  onChange={(e) => setAppealReason(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedIncidentForAppeal(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700 shadow-md shadow-amber-600/20 flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Gửi Kháng Nghị</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {viewImageModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          onClick={() => setViewImageModal(null)}
        >
          <div className="relative max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <img src={viewImageModal} alt="Minh chứng" className="w-full h-auto max-h-[80vh] object-contain rounded-2xl" />
            <button
              onClick={() => setViewImageModal(null)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-lg font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
