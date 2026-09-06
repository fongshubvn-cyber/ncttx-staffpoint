import React, { useState } from 'react';
import { Staff, DepartmentLine, ParameterConfig, AuthUser, SpeechType } from '../../types';
import { getSalaryTierBadge } from '../../utils/calculator';
import { 
  Users, 
  Search, 
  Plus, 
  VolumeX, 
  X
} from 'lucide-react';

interface Option1StaffViewProps {
  staffList: Staff[];
  lines: DepartmentLine[];
  onAddStaff: (staff: Staff) => void;
  isManager: boolean;
  params: ParameterConfig;
  currentUser: AuthUser | null;
  onOpenIncidentModal?: (targetId?: string, type?: 'ghi_nhan' | 'vi_pham') => void;
}

export const Option1StaffView: React.FC<Option1StaffViewProps> = ({
  staffList,
  lines,
  onAddStaff,
  isManager,
  params,
  currentUser,
  onOpenIncidentModal,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedLine, setSelectedLine] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  // New staff form state
  const [newId, setNewId] = useState('');
  const [newName, setNewName] = useState('');
  const [newLine, setNewLine] = useState(lines[0]?.name || '');
  const [newDepartment, setNewDepartment] = useState('NCTTX Đà Lạt');
  const [newRole, setNewRole] = useState('Thành viên');
  const [speechCap, setSpeechCap] = useState<SpeechType>('Người nói');

  const filteredStaff = staffList.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLine = selectedLine === 'all' || s.line === selectedLine;
    return matchesSearch && matchesLine;
  });

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newId || !newName) return;

    const newStaffObj: Staff = {
      id: newId,
      name: newName,
      line: newLine,
      department: newDepartment,
      role: newRole,
      positionCategory: 'Nhân viên',
      speechCapability: speechCap,
      location: 'Đà Lạt',
      status: 'Đang làm việc',
      evaluationCount: 0,
      totalScore: 5.0,
      generalScore: 5.0,
      techScore: 5.0,
      salaryTier: 1,
      jobLevel: 'Nhân viên',
    };

    onAddStaff(newStaffObj);
    setShowAddModal(false);
    setNewId('');
    setNewName('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-3xl shadow-sm border border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-900">Danh Sách Nhân Sự ({staffList.length})</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">Quản lý danh sách, bậc lương P2 & đánh giá tiêu chí</p>
        </div>

        {currentUser?.isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Nhân Sự Mới</span>
          </button>
        )}
      </div>

      {/* Search & Line Filter Controls */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc mã nhân sự (ví dụ: TTX001)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
          />
        </div>

        {/* Scrollable Line Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedLine('all')}
            className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              selectedLine === 'all'
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Tất cả ngạch ({staffList.length})
          </button>

          {lines.map((line) => {
            const count = staffList.filter(s => s.line === line.name).length;
            return (
              <button
                key={line.id}
                onClick={() => setSelectedLine(line.name)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  selectedLine === line.name
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {line.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Staff Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map((staff) => {
          const overallScore = Math.round(((staff.generalScore * 0.4) + (staff.techScore * 0.6)) * 10) / 10;
          const tier = getSalaryTierBadge(overallScore);
          const isDeaf = staff.speechCapability === 'Người điếc/ khiếm thính';

          return (
            <div
              key={staff.id}
              onClick={() => setSelectedStaff(staff)}
              className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer space-y-4 relative group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center text-lg font-bold shadow-md shadow-emerald-600/10">
                    {staff.name.substring(0, 1)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                        {staff.id}
                      </span>
                      {isDeaf && (
                        <span className="px-1.5 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px] font-bold border border-purple-200 flex items-center gap-1">
                          <VolumeX className="w-3 h-3 inline" /> Khiếm thính
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5 group-hover:text-emerald-700 transition-colors">
                      {staff.name}
                    </h3>
                  </div>
                </div>

                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border ${tier.bgClass} ${tier.textClass}`}>
                  {tier.label}
                </span>
              </div>

              <div className="text-xs text-slate-500 space-y-1">
                <div className="flex justify-between">
                  <span>Ngạch / Vị trí:</span>
                  <span className="font-semibold text-slate-700">{staff.line} • {staff.role}</span>
                </div>
                <div className="flex justify-between">
                  <span>Điểm tổng hợp:</span>
                  <span className="font-bold text-emerald-700">{overallScore} / 5.0</span>
                </div>
              </div>

              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${(overallScore / 5) * 100}%` }}
                ></div>
              </div>

              {onOpenIncidentModal && isManager && (
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onOpenIncidentModal(staff.id, 'ghi_nhan')}
                    className="flex-1 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[11px] font-bold transition-all border border-emerald-200/60"
                  >
                    + Khen Thưởng
                  </button>
                  <button
                    onClick={() => onOpenIncidentModal(staff.id, 'vi_pham')}
                    className="flex-1 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-[11px] font-bold transition-all border border-rose-200/60"
                  >
                    + Ghi Vi Phạm
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Thêm Nhân Sự Mới</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Mã Nhân Sự (VD: TTX031)</label>
                <input
                  type="text"
                  required
                  placeholder="TTX031"
                  value={newId}
                  onChange={(e) => setNewId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Họ và Tên</label>
                <input
                  type="text"
                  required
                  placeholder="Nguyễn Văn A"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Ngạch Phòng Ban</label>
                <select
                  value={newLine}
                  onChange={(e) => setNewLine(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {lines.map((l) => (
                    <option key={l.id} value={l.name}>{l.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Vị Trí</label>
                <input
                  type="text"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-1">
                <label className="block text-slate-700 font-semibold mb-1">Đặc tính khả năng giao tiếp</label>
                <select
                  value={speechCap}
                  onChange={(e) => setSpeechCap(e.target.value as SpeechType)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Người nói">Người nói</option>
                  <option value="Người điếc/ khiếm thính">Người điếc/ khiếm thính</option>
                </select>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
                >
                  Lưu Nhân Sự
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Selected Staff Detail Modal */}
      {selectedStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center">
                  {selectedStaff.name.substring(0, 1)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedStaff.name}</h3>
                  <span className="text-xs text-slate-500">{selectedStaff.id} • {selectedStaff.line}</span>
                </div>
              </div>
              <button onClick={() => setSelectedStaff(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl flex justify-between items-center">
                <span className="font-semibold text-slate-700">Điểm Văn Hóa (One Voice - 40%):</span>
                <span className="font-bold text-emerald-700 text-sm">{selectedStaff.generalScore} / 5.0</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl flex justify-between items-center">
                <span className="font-semibold text-slate-700">Điểm Chuyên Môn Ngạch (60%):</span>
                <span className="font-bold text-emerald-700 text-sm">{selectedStaff.techScore} / 5.0</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-2xl flex justify-between items-center border border-emerald-200/60">
                <span className="font-semibold text-emerald-900">Bậc Lương P2 Dự Kiến:</span>
                <span className="font-bold text-emerald-800 text-sm">
                  {getSalaryTierBadge(Math.round(((selectedStaff.generalScore * 0.4) + (selectedStaff.techScore * 0.6)) * 10) / 10).label}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedStaff(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
