import React, { useState, useEffect } from 'react';
import { IncidentRecord, Staff, Question, AuthUser } from '../../types';
import { isHRHeadRole, getActiveHRHead, isDeptHeadOrAboveRole, canUserViewIncident } from '../../utils/calculator';
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
  RotateCcw
} from 'lucide-react';

interface Option1IncidentsViewProps {
  incidents: IncidentRecord[];
  staffList: Staff[];
  questions: Question[];
  onAddIncident: (incident: IncidentRecord) => void;
  onDeleteIncident?: (incidentId: string) => void;
  onRestoreIncident?: (incidentId: string) => void;
  onPermanentDeleteIncident?: (incidentId: string) => void;
  onUpdateStatus: (id: string, status: 'Đã duyệt' | 'Từ chối') => void;
  isManager: boolean;
  onOpenIncidentModal: (targetId?: string, type?: 'ghi_nhan' | 'vi_pham') => void;
  currentUser: AuthUser | null;
  onAppealIncident: (incidentId: string, reason: string) => void;
  onResolveAppeal: (incidentId: string, approved: boolean) => void;
  initialFilterType?: string;
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
}) => {
  const [filterType, setFilterType] = useState<string>(initialFilterType);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedIncidentForAppeal, setSelectedIncidentForAppeal] = useState<IncidentRecord | null>(null);
  const [appealReason, setAppealReason] = useState<string>('');
  const [viewImageModal, setViewImageModal] = useState<string | null>(null);

  useEffect(() => {
    if (initialFilterType) {
      setFilterType(initialFilterType);
    }
  }, [initialFilterType]);

  const isHRManager = isHRHeadRole(currentUser);
  const isAdminUser = !!(currentUser?.isAdmin || currentUser?.id === 'ADMIN' || currentUser?.jobLevel === 'Admin');
  const isManagerOrDeptHead = isManager || isDeptHeadOrAboveRole(currentUser) || isHRManager || isAdminUser;
  const activeHRHead = getActiveHRHead(staffList);

  // Privacy & Access Scoping:
  const userIncidents = incidents.filter(item => !item.isPurged && canUserViewIncident(currentUser, item, staffList));
  const activeIncidents = userIncidents.filter(item => !item.isDeleted);
  const deletedIncidents = userIncidents.filter(item => Boolean(item.isDeleted) && !item.isPurged);

  const mySubmittedIncidents = activeIncidents.filter(i => i.reporterId === currentUser?.id);
  const myReceivedIncidents = activeIncidents.filter(i => i.targetId === currentUser?.id);

  const baseListToFilter = filterType === 'trash' ? deletedIncidents : activeIncidents;

  const filteredIncidents = baseListToFilter.filter((item) => {
    if (filterType === 'my_submitted') {
      return item.reporterId === currentUser?.id;
    }
    if (filterType === 'my_received') {
      return item.targetId === currentUser?.id;
    }
    if (filterType === 'ghi_nhan') return item.type === 'ghi_nhan';
    if (filterType === 'vi_pham') return item.type === 'vi_pham';
    if (filterType === 'khang_nghi') return item.status === 'Đang kháng nghị' || !!item.appealReason;

    const targetStaff = staffList.find(s => s.id === item.targetId);
    const staffName = targetStaff ? targetStaff.name : item.targetId;
    const reporterName = item.reporterName || '';
    const term = searchTerm.toLowerCase();
    const matchesSearch = !term || 
                          staffName.toLowerCase().includes(term) ||
                          reporterName.toLowerCase().includes(term) ||
                          item.title.toLowerCase().includes(term) ||
                          item.targetId.toLowerCase().includes(term) ||
                          (item.reporterId && item.reporterId.toLowerCase().includes(term));

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
            <h2 className="text-xl font-bold text-slate-900">Nhật Ký Phản Hồi ({activeIncidents.length})</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Ghi nhận khen thưởng, biên bản vi phạm & kháng nghị 48h (Hỗ trợ xem lại phiếu bạn nhận và phiếu bạn đã lập)
          </p>
        </div>

        {isManager && (
          <button
            onClick={() => onOpenIncidentModal()}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo Phản Hồi Mới</span>
          </button>
        )}
      </div>

      {/* Search & Filter Tabs */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tiêu đề, tên nhân sự nhận phiếu hoặc người lập..."
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
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
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
                  : 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
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
            Tất cả ({activeIncidents.length})
          </button>
          <button
            onClick={() => setFilterType('ghi_nhan')}
            className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border whitespace-nowrap ${
              filterType === 'ghi_nhan'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Ghi Nhận (+{activeIncidents.filter(i => i.type === 'ghi_nhan').length})
          </button>
          <button
            onClick={() => setFilterType('vi_pham')}
            className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border whitespace-nowrap ${
              filterType === 'vi_pham'
                ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Lập Biên Bản ({activeIncidents.filter(i => i.type === 'vi_pham').length})
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

      {/* Incident Feed List */}
      <div className="space-y-3">
        {filteredIncidents.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200/80">
            <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-600">Không tìm thấy phiếu phản hồi nào</p>
          </div>
        ) : (
          filteredIncidents.map((incident) => {
            const isRecognition = incident.type === 'ghi_nhan';
            const staff = staffList.find(s => s.id === incident.targetId);
            const canAppeal = !isRecognition &&
                              currentUser?.id === incident.targetId &&
                              incident.status === 'Đã duyệt';
            const isSubmittedByMe = currentUser?.id === incident.reporterId;
            const isReceivedByMe = currentUser?.id === incident.targetId;

            return (
              <div
                key={incident.id}
                className={`bg-white rounded-3xl p-5 shadow-sm border transition-all space-y-3 ${
                  isRecognition ? 'border-emerald-200/80 hover:border-emerald-300' : 'border-rose-200/80 hover:border-rose-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white flex-shrink-0 font-bold ${
                      isRecognition ? 'bg-emerald-600' : 'bg-rose-600'
                    }`}>
                      {isRecognition ? <Award className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          isRecognition ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {isRecognition ? 'Ghi Nhận' : 'Lập Biên Bản'}
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

                  <span className={`text-xs font-bold px-2.5 py-1 rounded-xl flex-shrink-0 ${
                    incident.status === 'Đã duyệt'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                      : incident.status === 'Đang kháng nghị'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
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
                  {incident.isDeleted ? (
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
                          title="Xóa vĩnh viễn khỏi cơ sở dữ liệu"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Xóa vĩnh viễn</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <>
                      {canAppeal && (
                        <button
                          onClick={() => setSelectedIncidentForAppeal(incident)}
                          className="px-3 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold border border-amber-200/60 transition-all"
                        >
                          Gửi Kháng Nghị 48h
                        </button>
                      )}

                      {/* HR Manager Resolve Buttons */}
                      {isHRManager && incident.status === 'Đang kháng nghị' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onResolveAppeal(incident.id, true)}
                            className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all shadow-sm"
                          >
                            Chấp Nhận Kháng Nghị (Hủy Phiếu)
                          </button>
                          <button
                            onClick={() => onResolveAppeal(incident.id, false)}
                            className="px-3 py-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-all shadow-sm"
                          >
                            Bác Kháng Nghị (Giữ Nguyên)
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
                          className="px-3 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-all flex items-center gap-1 active:scale-95 ml-auto"
                          title="Quyền Admin: Chuyển phiếu vào Thùng Rác"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Chuyển vào Thùng Rác</span>
                        </button>
                      )}
                    </>
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
