import React, { useState } from 'react';
import { 
  IncidentRecord, 
  Staff, 
  Question,
  AuthUser 
} from '../types';
import { 
  Trophy, 
  Plus, 
  Search, 
  Megaphone,
  Leaf,
  TrendingUp,
  TrendingDown,
  Sparkles,
  PlusCircle,
  Scale,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Send,
  Trash2
} from 'lucide-react';

import { isHRHeadRole, getActiveHRHead, isDeptHeadOrAboveRole, canUserViewIncident } from '../utils/calculator';

interface IncidentsViewProps {
  incidents: IncidentRecord[];
  staffList: Staff[];
  questions: Question[];
  onAddIncident: (incident: IncidentRecord) => void;
  onDeleteIncident?: (incidentId: string) => void;
  onUpdateStatus: (id: string, status: 'Đã duyệt' | 'Từ chối') => void;
  isManager: boolean;
  onOpenIncidentModal: () => void;
  currentUser: AuthUser | null;
  onAppealIncident: (incidentId: string, reason: string) => void;
  onResolveAppeal: (incidentId: string, approved: boolean) => void;
  initialFilterType?: string;
}

export const IncidentsView: React.FC<IncidentsViewProps> = ({
  incidents,
  staffList,
  questions,
  onAddIncident,
  onDeleteIncident,
  onUpdateStatus,
  isManager,
  onOpenIncidentModal,
  currentUser,
  onAppealIncident,
  onResolveAppeal,
  initialFilterType = 'all',
}) => {
  const [filterType, setFilterType] = useState<string>(initialFilterType);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  React.useEffect(() => {
    if (initialFilterType) {
      setFilterType(initialFilterType);
    }
  }, [initialFilterType]);

  // Appeal Modal State
  const [appealIncident, setAppealIncident] = useState<IncidentRecord | null>(null);
  const [appealReason, setAppealReason] = useState<string>('');

  const isHRManager = isHRHeadRole(currentUser);
  const isAdminUser = !!(currentUser?.isAdmin || currentUser?.id === 'ADMIN' || currentUser?.jobLevel === 'Admin');
  const isManagerOrDeptHead = isManager || isDeptHeadOrAboveRole(currentUser) || isHRManager || isAdminUser;
  const activeHRHead = getActiveHRHead(staffList);
  const activeHRHeadName = activeHRHead ? activeHRHead.name : 'Trưởng phòng Nhân sự';

  // Privacy Scoping:
  // - Admin, Trưởng phòng, HR Head: view all tickets across company
  // - Quản lý / Lead: view self tickets + tickets of direct team subordinates in their department/line
  // - Regular Staff: view ONLY tickets where they are reporter (submitted) or target (received)
  const userIncidents = incidents.filter(item => canUserViewIncident(currentUser, item, staffList));
  const activeIncidents = userIncidents.filter(item => !item.isDeleted);
  const deletedIncidents = userIncidents.filter(item => Boolean(item.isDeleted));

  // Filter specific lists for counts & tabs
  const mySubmittedIncidents = activeIncidents.filter(i => i.reporterId === currentUser?.id);
  const myReceivedIncidents = activeIncidents.filter(i => i.targetId === currentUser?.id);
  
  // Recipient notifications for active user
  const myReceivedViolations = myReceivedIncidents.filter(i => i.type === 'vi_pham' && i.status !== 'Kháng nghị được chấp nhận');
  const myReceivedRecognitions = myReceivedIncidents.filter(i => i.type === 'ghi_nhan' && (i.status === 'Đã duyệt' || i.status === 'Chờ HR duyệt'));

  const pendingApprovalCount = incidents.filter(
    i => (i.type === 'ghi_nhan' && (i.status === 'Chờ duyệt' || i.status === 'Chờ HR duyệt')) || i.status === 'Đang kháng nghị'
  ).length;

  const filteredIncidents = userIncidents.filter(item => {
    if (filterType === 'my_submitted') {
      return item.reporterId === currentUser?.id;
    }
    if (filterType === 'my_received') {
      return item.targetId === currentUser?.id;
    }
    if (filterType === 'duyet_don') {
      return (
        (item.type === 'ghi_nhan' && (item.status === 'Chờ duyệt' || item.status === 'Chờ HR duyệt')) ||
        item.status === 'Đang kháng nghị'
      );
    }
    if (filterType === 'ranh_gioi') {
      const isRG = (item.groupCode && item.groupCode.startsWith('RG')) || item.title.includes('RANH GIỚI');
      if (!isRG) return false;
    } else if (filterType !== 'all' && item.type !== filterType) {
      return false;
    }
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        item.targetName.toLowerCase().includes(term) ||
        item.reporterName.toLowerCase().includes(term) ||
        item.title.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const totalViolations = userIncidents.filter(i => i.type === 'vi_pham').length;
  const totalRecognitions = userIncidents.filter(i => i.type === 'ghi_nhan').length;

  const handleSubmitAppeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appealReason.trim()) {
      alert('Vui lòng nhập trình bày lý do/bằng chứng kháng nghị!');
      return;
    }
    if (appealIncident) {
      onAppealIncident(appealIncident.id, appealReason.trim());
      setAppealIncident(null);
      setAppealReason('');
      alert(`Đã gửi kháng nghị thành công đến Trưởng phòng Nhân sự (${activeHRHeadName})!`);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      
      {/* Dedicated Single-Row Button for "+ Lập Phiếu Khen Thưởng / Biên Bản Mới" */}
      <div className="w-full">
        <button
          onClick={onOpenIncidentModal}
          className="w-full py-3.5 px-5 rounded-2xl brand-gradient text-white font-extrabold font-heading text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 border border-[#52B788]/30 active:scale-[0.99] whitespace-nowrap cursor-pointer"
        >
          <span className="truncate">🌟 Lập Phiếu Khen Thưởng / Biên Bản Mới</span>
        </button>
      </div>

      {/* Recipient Target Notifications System */}
      {currentUser && (myReceivedViolations.length > 0 || myReceivedRecognitions.length > 0) && (
        <div className="space-y-2">
          {/* Violation Warning Alert Banner */}
          {myReceivedViolations.length > 0 && (
            <div className="bg-amber-500 text-white p-4 rounded-2xl shadow-md border border-amber-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
              <div className="flex items-start space-x-3">
                <span className="text-2xl shrink-0">🔔</span>
                <div className="space-y-0.5">
                  <p className="text-xs font-black font-heading tracking-wide uppercase text-amber-100">
                    Thông báo biên bản vi phạm ({currentUser.name})
                  </p>
                  <p className="text-xs font-bold leading-relaxed">
                    Bạn có <span className="bg-white text-amber-900 px-1.5 py-0.2 rounded-full font-black">{myReceivedViolations.length}</span> biên bản vi phạm nhắc nhở mới. Vui lòng kiểm tra và có <strong>48 giờ để gửi ý kiến/kháng nghị</strong> tới Trưởng phòng HR ({activeHRHeadName}).
                  </p>
                </div>
              </div>
              <button
                onClick={() => setFilterType('my_received')}
                className="shrink-0 w-full sm:w-auto px-4 py-2 bg-white text-amber-900 hover:bg-amber-50 font-black text-xs rounded-xl shadow transition-all active:scale-95 text-center whitespace-nowrap"
              >
                🎯 Xem phiếu của tôi
              </button>
            </div>
          )}

          {/* Commendation Celebration Alert Banner */}
          {myReceivedRecognitions.length > 0 && (
            <div className="bg-emerald-700 text-white p-4 rounded-2xl shadow-md border border-emerald-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
              <div className="flex items-start space-x-3">
                <span className="text-2xl shrink-0">🎉</span>
                <div className="space-y-0.5">
                  <p className="text-xs font-black font-heading tracking-wide uppercase text-emerald-200">
                    Chúc mừng bạn ({currentUser.name})!
                  </p>
                  <p className="text-xs font-bold leading-relaxed">
                    Bạn nhận được <span className="bg-white text-emerald-900 px-1.5 py-0.2 rounded-full font-black">{myReceivedRecognitions.length}</span> phiếu khen thưởng ghi nhận xuất sắc từ đồng đội!
                  </p>
                </div>
              </div>
              <button
                onClick={() => setFilterType('my_received')}
                className="shrink-0 w-full sm:w-auto px-4 py-2 bg-white text-emerald-900 hover:bg-emerald-50 font-black text-xs rounded-xl shadow transition-all active:scale-95 text-center whitespace-nowrap"
              >
                🎯 Xem phiếu khen thưởng
              </button>
            </div>
          )}
        </div>
      )}

      {/* Brand Header Banner */}
      <div className="mobile-card p-5 border border-[#1B4332]/10 bg-white space-y-3 relative overflow-hidden shadow-sm">
        <div className="flex items-center space-x-2 text-[#2D6A4F] text-xs font-bold font-heading uppercase tracking-wider">
          <Leaf className="w-4 h-4 text-[#2D6A4F]" />
          <span>Danh sách phiếu ghi nhận & biên bản</span>
        </div>

        <h2 className="text-xl font-bold font-heading text-[#1B4332] leading-tight">
          Ghi Nhận Khen Thưởng & Biên Bản Nhắc Nhở
        </h2>
        
        <p className="text-xs text-[#2D3748] leading-relaxed font-medium">
          Biên bản vi phạm có hiệu lực ngay và gửi thông báo đến nhân sự. Nhân sự có <strong>48 giờ để kháng nghị</strong> trực tiếp lên Trưởng phòng Nhân sự.
        </p>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="bg-[#EDEAE3]/50 p-2.5 sm:p-3 rounded-2xl border border-emerald-900/10 flex items-center space-x-2 sm:space-x-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#2D6A4F] text-white flex items-center justify-center shrink-0 shadow-sm text-base">
              🌟
            </div>
            <div className="min-w-0 truncate">
              <p className="text-[10px] text-slate-500 font-bold whitespace-nowrap">Khen thưởng</p>
              <p className="text-xs sm:text-sm font-black text-[#2D6A4F] whitespace-nowrap">
                {totalRecognitions} phiếu
              </p>
            </div>
          </div>

          <div className="bg-[#EDEAE3]/50 p-2.5 sm:p-3 rounded-2xl border border-emerald-900/10 flex items-center space-x-2 sm:space-x-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#DD6B20] text-white flex items-center justify-center shrink-0 shadow-sm text-base">
              📢
            </div>
            <div className="min-w-0 truncate">
              <p className="text-[10px] text-slate-500 font-bold whitespace-nowrap">Nhắc nhở</p>
              <p className="text-xs sm:text-sm font-black text-[#DD6B20] whitespace-nowrap">
                {totalViolations} biên bản
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên bạn nhân sự, tiêu đề..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-2xl text-xs text-[#2D3748] placeholder-slate-400 shadow-sm focus:outline-none focus:border-[#2D6A4F]"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
          {/* Quick Filter: Recipient's Own Tickets */}
          {currentUser && (
            <button
              onClick={() => setFilterType('my_received')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                filterType === 'my_received'
                  ? 'bg-emerald-800 text-white shadow-md'
                  : 'bg-emerald-50 text-emerald-900 border border-emerald-300 hover:bg-emerald-100'
              }`}
            >
              <span>🎯 Phiếu của tôi</span>
              {myReceivedIncidents.length > 0 && (
                <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black ml-0.5">
                  {myReceivedIncidents.length}
                </span>
              )}
            </button>
          )}

          {/* Quick Filter: Reporter's Submitted Tickets */}
          {currentUser && (
            <button
              onClick={() => setFilterType('my_submitted')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                filterType === 'my_submitted'
                  ? 'bg-blue-800 text-white shadow-md'
                  : 'bg-blue-50 text-blue-900 border border-blue-300 hover:bg-blue-100'
              }`}
            >
              <span>📝 Phiếu tôi đã lập</span>
              {mySubmittedIncidents.length > 0 && (
                <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black ml-0.5">
                  {mySubmittedIncidents.length}
                </span>
              )}
            </button>
          )}

          {isHRManager && (
            <button
              onClick={() => setFilterType('duyet_don')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                filterType === 'duyet_don'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
              }`}
            >
              <span>📋 Duyệt đơn</span>
              {pendingApprovalCount > 0 && (
                <span className="bg-rose-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black ml-0.5 animate-pulse">
                  {pendingApprovalCount}
                </span>
              )}
            </button>
          )}

          <button
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              filterType === 'all'
                ? 'bg-[#1B4332] text-white shadow-md'
                : 'bg-white text-[#2D3748] border border-slate-200'
            }`}
          >
            Tất cả ✨
          </button>
          <button
            onClick={() => setFilterType('ghi_nhan')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              filterType === 'ghi_nhan'
                ? 'bg-[#2D6A4F] text-white shadow-md'
                : 'bg-white text-[#2D3748] border border-slate-200'
            }`}
          >
            🌟 Ghi nhận
          </button>
          <button
            onClick={() => setFilterType('vi_pham')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              filterType === 'vi_pham'
                ? 'bg-[#DD6B20] text-white shadow-md'
                : 'bg-white text-[#2D3748] border border-slate-200'
            }`}
          >
            📢 Nhắc nhở
          </button>
          <button
            onClick={() => setFilterType('ranh_gioi')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              filterType === 'ranh_gioi'
                ? 'bg-rose-700 text-white shadow-md'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            ⚠️ Ranh giới đỏ
          </button>
        </div>
      </div>

      {/* Incidents List Cards */}
      <div className="space-y-3">
        {filteredIncidents.map((incident) => {
          const isViolation = incident.type === 'vi_pham';
          const isTargetedUser = currentUser?.id === incident.targetId || currentUser?.isAdmin;
          const isAppealed = incident.status === 'Đang kháng nghị';
          const isAppealApproved = incident.status === 'Kháng nghị được chấp nhận';
          const isAppealRejected = incident.status === 'Kháng nghị bị từ chối';

          return (
            <div
              key={incident.id}
              className={`mobile-card p-4 space-y-3 border transition-all ${
                isViolation
                  ? 'border-amber-200 bg-amber-50/20'
                  : 'border-emerald-200 bg-emerald-50/20'
              }`}
            >
              {/* Header Badges */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-slate-600 bg-[#EDEAE3] px-2 py-0.5 rounded-full">
                  {incident.id}
                </span>

                <div className="flex items-center space-x-1.5">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-heading ${
                      isViolation
                        ? 'bg-amber-100 text-[#DD6B20] border border-amber-200'
                        : 'bg-emerald-100 text-[#1B4332] border border-emerald-200'
                    }`}
                  >
                    {isViolation ? '📢 VI PHẠM' : '🌟 GHI NHẬN'}
                  </span>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      isAppealed
                        ? 'bg-purple-600 text-white'
                        : isAppealApproved
                        ? 'bg-emerald-600 text-white'
                        : isAppealRejected
                        ? 'bg-rose-600 text-white'
                        : isViolation
                        ? 'bg-[#DD6B20] text-white'
                        : incident.status === 'Đã duyệt'
                        ? 'bg-[#2D6A4F] text-white'
                        : incident.status === 'Từ chối'
                        ? 'bg-rose-600 text-white'
                        : 'bg-amber-500 text-white'
                    }`}
                  >
                    {isAppealed
                      ? '⚖️ Đang Kháng Nghị (Gửi HR)'
                      : isAppealApproved
                      ? '✅ Kháng Nghị Được Chấp Nhận'
                      : isAppealRejected
                      ? '❌ Kháng Nghị Bị Từ Chối'
                      : isViolation
                      ? '🔔 Đã ghi nhận & Thông báo'
                      : incident.status === 'Chờ HR duyệt'
                      ? '⏳ Chờ Trưởng phòng HR duyệt'
                      : incident.status}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-sm font-bold font-heading text-[#1B4332] leading-snug">{incident.title}</h3>
                <p className="text-xs text-[#2D3748] mt-1.5 bg-white p-2.5 rounded-xl border border-slate-200/80 leading-relaxed font-medium">
                  {incident.description}
                </p>

                {/* Attached Evidence Image */}
                {incident.imageUrl && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-1.5 space-y-1">
                    <p className="text-[10px] font-bold text-slate-500 flex items-center space-x-1">
                      <span>🖼️ Hình ảnh minh chứng đính kèm:</span>
                    </p>
                    <img
                      src={incident.imageUrl}
                      alt="Minh chứng đính kèm"
                      className="w-full max-h-56 object-cover rounded-lg border border-slate-200 cursor-pointer hover:opacity-95 transition-opacity"
                      onClick={() => window.open(incident.imageUrl, '_blank')}
                    />
                  </div>
                )}
              </div>

              {/* Reporter -> Target Metadata */}
              <div className="text-xs space-y-1 text-slate-500 pt-1 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span>Người lập: <strong className="text-[#1B4332] font-bold">{incident.reporterName}</strong></span>
                  <span className="text-[10px] font-bold text-slate-400">{incident.date}</span>
                </div>
                <div className="flex items-center space-x-1 text-[#2D3748]">
                  <span className="text-slate-500">Đối tượng được lập:</span>
                  <strong className="text-[#2D6A4F] font-bold">{incident.targetName}</strong>
                  <span className="text-[11px] text-slate-400">({incident.targetRole})</span>
                </div>
              </div>

              {/* Appeal Reason Display */}
              {incident.appealReason && (
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl text-xs space-y-1">
                  <div className="flex items-center space-x-1.5 text-purple-900 font-bold">
                    <Scale className="w-3.5 h-3.5 text-purple-700" />
                    <span>Lý do kháng nghị từ {incident.targetName}:</span>
                  </div>
                  <p className="text-[#2D3748] italic font-medium leading-relaxed bg-white p-2 rounded-xl border border-purple-100">
                    "{incident.appealReason}"
                  </p>
                  {incident.appealDate && (
                    <p className="text-[10px] text-purple-700 font-semibold text-right">Ngày gửi: {incident.appealDate}</p>
                  )}
                </div>
              )}

              {/* Score Impact & Action Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black flex items-center space-x-1 shrink-0 w-fit ${
                    isAppealApproved
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : isViolation
                      ? 'bg-amber-50 text-[#DD6B20] border border-amber-200'
                      : 'bg-emerald-50 text-[#1B4332] border border-emerald-200'
                  }`}
                >
                  {isViolation && !isAppealApproved ? (
                    <TrendingDown className="w-3.5 h-3.5 text-[#DD6B20]" />
                  ) : (
                    <TrendingUp className="w-3.5 h-3.5 text-[#2D6A4F]" />
                  )}
                  <span>
                    {isAppealApproved
                      ? 'Hoàn điểm 0'
                      : `${incident.impactPoints > 0 ? '+' : ''}${incident.impactPoints} điểm`}
                  </span>
                </span>

                {/* Violation Actions & Appeals */}
                {isViolation ? (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* HR Review Action for Appeal */}
                    {isAppealed && isHRManager && (
                      <div className="flex items-center space-x-1.5 w-full sm:w-auto">
                        <button
                          onClick={() => onResolveAppeal(incident.id, true)}
                          className="px-3 py-1.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-extrabold shadow-md flex items-center space-x-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
                          <span>Chấp Nhận Kháng Nghị (Hủy Vi Phạm)</span>
                        </button>
                        <button
                          onClick={() => onResolveAppeal(incident.id, false)}
                          className="px-3 py-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-extrabold shadow-md flex items-center space-x-1"
                        >
                          <XCircle className="w-3.5 h-3.5 text-rose-200" />
                          <span>Bác Kháng Nghị</span>
                        </button>
                      </div>
                    )}

                    {/* Target Staff 48h Appeal Button */}
                    {!isAppealed && !isAppealApproved && !isAppealRejected && isTargetedUser && (
                      <button
                        onClick={() => {
                          setAppealIncident(incident);
                          setAppealReason('');
                        }}
                        className="px-3 py-1.5 rounded-full bg-purple-700 hover:bg-purple-800 text-white text-[11px] font-extrabold shadow-md flex items-center space-x-1 border border-purple-400"
                        title="Bạn có 48 giờ để gửi kháng nghị trực tiếp lên Trưởng phòng Nhân sự"
                      >
                        <Scale className="w-3.5 h-3.5 text-purple-200" />
                        <span>⚖️ Gửi Kháng Nghị (48h)</span>
                      </button>
                    )}

                    {!isAppealed && !isAppealApproved && !isAppealRejected && !isTargetedUser && (
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-xl flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>⏱️ Hạn kháng nghị 48h dành cho {incident.targetName}</span>
                      </span>
                    )}
                  </div>
                ) : (
                  /* Commendation Approval Actions */
                  (incident.status === 'Chờ HR duyệt' || incident.status === 'Chờ duyệt') && isManager && (
                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => onUpdateStatus(incident.id, 'Đã duyệt')}
                        className="px-3.5 py-1.5 rounded-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white text-xs font-extrabold shadow-sm flex items-center space-x-1.5 transition-all active:scale-95"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#52B788]" />
                        <span>Duyệt (HR) ✨</span>
                      </button>
                      <button
                        onClick={() => onUpdateStatus(incident.id, 'Từ chối')}
                        className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold border border-slate-200 transition-all active:scale-95"
                      >
                        Từ chối
                      </button>
                    </div>
                  )
                )}

                {/* Admin Delete Action Button */}
                {isAdminUser && onDeleteIncident && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`⚠️ Admin xác nhận: Bạn có chắc chắn muốn XÓA VĨNH VIỄN phiếu [${incident.id}] "${incident.title}"?`)) {
                        onDeleteIncident(incident.id);
                      }
                    }}
                    className="px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold border border-rose-200 transition-all flex items-center space-x-1 active:scale-95 ml-auto"
                    title="Quyền Admin: Xóa vĩnh viễn phiếu này khỏi hệ thống"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa phiếu (Admin)</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* FAB */}
      <button
        onClick={onOpenIncidentModal}
        className="fixed bottom-16 right-4 z-40 w-14 h-14 rounded-full brand-gradient text-white shadow-xl shadow-emerald-950 flex items-center justify-center border-2 border-white transform active:scale-95 transition-all"
        title="Tạo lời khen hoặc nhắc nhở mới"
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* Appeal Submission Modal */}
      {appealIncident && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-purple-900 text-white p-5 text-center relative">
              <div className="w-12 h-12 rounded-2xl bg-purple-500 text-white flex items-center justify-center mx-auto mb-2 shadow-lg">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold font-heading">
                Gửi Kháng Nghị Biên Bản Vi Phạm (Trong vòng 48h)
              </h3>
              <p className="text-xs text-purple-200 mt-1">
                Gửi trực tiếp tới: <strong>{activeHRHeadName} (Trưởng phòng Nhân sự)</strong>
              </p>
              <button
                onClick={() => setAppealIncident(null)}
                className="absolute top-4 right-4 text-purple-200 hover:text-white text-sm font-bold bg-purple-800 px-2.5 py-1 rounded-full"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitAppeal} className="p-5 space-y-4">
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl text-xs space-y-1">
                <div className="font-bold text-purple-900">Biên bản bị kháng nghị:</div>
                <div className="text-purple-800 font-semibold">{appealIncident.title}</div>
                <div className="text-[11px] text-slate-600">Lập cho: <strong>{appealIncident.targetName}</strong> bởi <strong>{appealIncident.reporterName}</strong></div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Trình bày lý do & bằng chứng kháng nghị
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Viết chi tiết lý do bạn cho rằng biên bản vi phạm chưa thỏa đáng hoặc các sự thật/minh chứng cần Trưởng phòng HR làm rõ..."
                  value={appealReason}
                  onChange={(e) => setAppealReason(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAppealIncident(null)}
                  className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-lg flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Gửi Kháng Nghị (HR)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

