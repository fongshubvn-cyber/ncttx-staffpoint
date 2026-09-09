import React, { useState, useMemo } from 'react';
import { Staff, DepartmentLine, ParameterConfig, AuthUser, SpeechType } from '../../types';
import { getSalaryTierBadge, calculateTotalScoreForStaff, calculateSalaryTier, getVisibleStaffListForUser } from '../../utils/calculator';
import { 
  Users, 
  Search, 
  Plus, 
  VolumeX, 
  X,
  ShieldCheck,
  Lock,
  Building2,
  Layers,
  Grid,
  ListFilter
} from 'lucide-react';

interface Option1StaffViewProps {
  staffList: Staff[];
  lines: DepartmentLine[];
  onAddStaff: (staff: Staff) => void;
  onUpdateStaff?: (staff: Staff) => void;
  onDeleteStaff?: (staffId: string) => void;
  onUpdatePassword?: (userId: string, newPass: string) => void;
  isManager: boolean;
  params: ParameterConfig;
  currentUser: AuthUser | null;
  onOpenIncidentModal?: (targetId?: string, type?: 'ghi_nhan' | 'vi_pham') => void;
}

export const Option1StaffView: React.FC<Option1StaffViewProps> = ({
  staffList,
  lines,
  onAddStaff,
  onUpdateStaff,
  onDeleteStaff,
  onUpdatePassword,
  isManager,
  params,
  currentUser,
  onOpenIncidentModal,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedLine, setSelectedLine] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<'by_dept' | 'all'>('by_dept');

  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [editNewPass, setEditNewPass] = useState('');

  // New staff form state
  const [newId, setNewId] = useState('');
  const [newName, setNewName] = useState('');
  const [newLine, setNewLine] = useState(lines[0]?.name || '');
  const [newDepartment, setNewDepartment] = useState('Kế Toán');
  const [newRole, setNewRole] = useState('Thành viên');
  const [speechCap, setSpeechCap] = useState<SpeechType>('Người nói');

  const visibleStaff = getVisibleStaffListForUser(currentUser, staffList);

  const departmentOptions = useMemo(() => {
    const defaultDepts = [
      'Kế Toán',
      'Thương mại & Dịch vụ',
      'Sản xuất',
      'Pha chế',
      'Bếp Bánh',
      'Kho & Đóng gói',
      'Bảo vệ',
      'C Suite Level (C-Level)',
      'Founder'
    ];
    const currentDepts = staffList.map(s => s.department).filter(Boolean);
    const lineDepts = lines.map(l => l.name);
    const set = new Set([...defaultDepts, ...lineDepts, ...currentDepts]);
    return Array.from(set).sort();
  }, [staffList, lines]);

  // Extract unique departments
  const departmentsList = Array.from(new Set(visibleStaff.map(s => s.department || 'Phòng ban khác'))).filter(Boolean);

  const filteredStaff = visibleStaff.filter((s) => {
    const deptName = s.department || 'Phòng ban khác';
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLine = selectedLine === 'all' || s.line === selectedLine;
    const matchesDept = selectedDepartment === 'all' || deptName === selectedDepartment;
    return matchesSearch && matchesLine && matchesDept;
  });

  // Group staff by department
  const departmentGroups = departmentsList.map(dept => {
    const members = filteredStaff.filter(s => (s.department || 'Phòng ban khác') === dept);
    return {
      department: dept,
      members,
    };
  }).filter(g => g.members.length > 0);

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

  const handleSaveEditStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;

    if (onUpdateStaff) {
      onUpdateStaff(editingStaff);
    }
    if (editNewPass.trim() && onUpdatePassword) {
      onUpdatePassword(editingStaff.id, editNewPass.trim());
      alert(`Đã cập nhật mật khẩu mới cho ${editingStaff.name} thành công!`);
    }

    setShowEditModal(false);
    setEditingStaff(null);
    setEditNewPass('');
  };

  const renderRoleBadge = (staff: Staff, isModal = false) => {
    const roleLower = (staff.role || '').toLowerCase();
    const levelLower = (staff.jobLevel || '').toLowerCase();
    const posLower = (staff.positionCategory || '').toLowerCase();

    const badgeStyle = isModal 
      ? "text-xs px-2 py-0.5 rounded-md font-black shadow-xs flex items-center gap-1 border shrink-0" 
      : "px-2 py-0.5 rounded-md text-[10px] font-black shadow-xs flex items-center gap-1 border shrink-0";

    const isHead = levelLower === 'trưởng phòng' || roleLower.includes('trưởng phòng') || posLower.includes('head');
    if (isHead) {
      return (
        <span className={`${badgeStyle} bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-600`}>
          👑 Trưởng Phòng
        </span>
      );
    }

    const isLead = levelLower === 'lead' || roleLower.includes('lead') || posLower.includes('lead');
    if (isLead) {
      return (
        <span className={`${badgeStyle} bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-700`}>
          🎯 Lead
        </span>
      );
    }

    const isManagerRole = levelLower === 'quản lý' || levelLower === 'manager' || roleLower.includes('quản lý') || posLower.includes('manager');
    if (isManagerRole) {
      return (
        <span className={`${badgeStyle} bg-gradient-to-r from-pink-500 to-rose-500 text-white border-pink-600`}>
          👔 Quản Lý
        </span>
      );
    }

    return null;
  };

  const renderStaffCard = (staff: Staff) => {
    const overallScore = calculateTotalScoreForStaff(staff, params);
    const salaryTierNum = calculateSalaryTier(overallScore, params);
    const tier = getSalaryTierBadge(salaryTierNum);
    const isDeaf = staff.speechCapability === 'Người điếc/ khiếm thính';

    return (
      <div
        key={staff.id}
        onClick={() => setSelectedStaff(staff)}
        className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer space-y-4 relative group"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center text-lg font-bold shadow-md shadow-emerald-600/10 shrink-0">
              {staff.name.substring(0, 1)}
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                  {staff.id}
                </span>
                {renderRoleBadge(staff)}
                {staff.isAdmin && (
                  <span className="px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-900 text-[10px] font-black border border-amber-300 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-amber-700 inline" /> Co-Admin
                  </span>
                )}
                {staff.status === 'Đã khoá' && (
                  <span className="px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-800 text-[10px] font-black border border-rose-300 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-rose-700 inline" /> Đã khoá
                  </span>
                )}
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

          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border ${tier.bgClass} ${tier.textClass} shrink-0`}>
            {tier.label}
          </span>
        </div>

        <div className="text-xs text-slate-500 space-y-1">
          <div className="flex justify-between">
            <span>Phòng ban:</span>
            <span className="font-bold text-slate-800">{staff.department || 'Chưa xếp'}</span>
          </div>
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
          <p className="text-xs text-slate-500 mt-1">
            Quản lý phân chia nhân sự theo phòng ban, bậc lương P2 & đánh giá tiêu chí
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle Buttons */}
          <div className="bg-slate-100 p-1 rounded-2xl border border-slate-200 flex items-center gap-1">
            <button
              onClick={() => setViewMode('by_dept')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                viewMode === 'by_dept'
                  ? 'bg-[#1B4332] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Sắp xếp & Phân chia nhân sự theo từng Phòng ban"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Phân Theo Phòng Ban</span>
            </button>
            <button
              onClick={() => setViewMode('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                viewMode === 'all'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Hiển thị tất cả nhân sự dạng lưới phẳng"
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Tất Cả</span>
            </button>
          </div>

          {currentUser?.isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Nhân Sự Mới</span>
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter Controls */}
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

        {/* Scrollable Department Filter Badges */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase shrink-0">Phòng ban:</span>
            <button
              onClick={() => setSelectedDepartment('all')}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all border whitespace-nowrap ${
                selectedDepartment === 'all'
                  ? 'bg-[#1B4332] text-white border-[#1B4332] shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              🏢 Tất cả phòng ban ({visibleStaff.length})
            </button>

            {departmentsList.map((dept) => {
              const count = visibleStaff.filter(s => (s.department || 'Phòng ban khác') === dept).length;
              return (
                <button
                  key={dept}
                  onClick={() => setSelectedDepartment(dept)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all border whitespace-nowrap ${
                    selectedDepartment === dept
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  🏢 {dept} ({count})
                </button>
              );
            })}
          </div>

          {/* Scrollable Line Badges */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase shrink-0">Ngạch làm việc:</span>
            <button
              onClick={() => setSelectedLine('all')}
              className={`flex-shrink-0 px-3 py-1 rounded-xl text-[11px] font-bold transition-all border whitespace-nowrap ${
                selectedLine === 'all'
                  ? 'bg-slate-800 text-white border-slate-800'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Tất cả ngạch
            </button>

            {lines.map((line) => {
              const count = visibleStaff.filter(s => s.line === line.name).length;
              return (
                <button
                  key={line.id}
                  onClick={() => setSelectedLine(line.name)}
                  className={`flex-shrink-0 px-3 py-1 rounded-xl text-[11px] font-bold transition-all border whitespace-nowrap ${
                    selectedLine === line.name
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {line.name} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Staff View Rendering */}
      {viewMode === 'by_dept' ? (
        <div className="space-y-8">
          {departmentGroups.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
              <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-600">Không tìm thấy nhân sự trùng khớp</p>
            </div>
          ) : (
            departmentGroups.map((group) => {
              const deptStaffCount = group.members.length;
              const avgDeptScore = (
                group.members.reduce((sum, s) => sum + calculateTotalScoreForStaff(s, params), 0) / (deptStaffCount || 1)
              ).toFixed(2);

              return (
                <div key={group.department} className="space-y-3">
                  {/* Department Section Header Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-900 via-slate-800 to-[#1B4332] text-white p-4.5 rounded-3xl shadow-md border border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 backdrop-blur-md flex items-center justify-center text-emerald-300 font-bold border border-emerald-400/30 shrink-0">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-black text-base tracking-tight text-white">
                            🏢 PHÒNG BAN: {group.department.toUpperCase()}
                          </h3>
                          <span className="bg-emerald-500 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-full shadow-sm">
                            {deptStaffCount} Nhân sự
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 font-medium mt-0.5">
                          Tập thể nhân sự trực thuộc phòng {group.department}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 shrink-0">
                      <span className="text-emerald-200 font-bold">Điểm Trung Bình Phòng:</span>
                      <strong className="text-emerald-400 font-mono font-black text-sm">
                        {avgDeptScore} / 5.0
                      </strong>
                    </div>
                  </div>

                  {/* Staff Grid inside Department */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {group.members.map((staff) => renderStaffCard(staff))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Flat Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStaff.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-3xl border border-slate-200">
              <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-600">Không tìm thấy nhân sự trùng khớp</p>
            </div>
          ) : (
            filteredStaff.map((staff) => renderStaffCard(staff))
          )}
        </div>
      )}

      {/* STAFF DETAIL MODAL */}
      {selectedStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 overflow-y-auto max-h-[90vh]">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-xl flex items-center justify-center shadow-md">
                  {selectedStaff.name.substring(0, 1)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                      Mã: {selectedStaff.id}
                    </span>
                    {renderRoleBadge(selectedStaff, true)}
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                      Bậc {calculateSalaryTier(calculateTotalScoreForStaff(selectedStaff, params), params)}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mt-1">{selectedStaff.name}</h3>
                </div>
              </div>

              <button onClick={() => setSelectedStaff(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Phòng Ban Trực Thuộc:</span>
                  <strong className="text-slate-900">{selectedStaff.department || 'Chưa phân chia'}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ngạch Chuyên Môn:</span>
                  <strong className="text-slate-900">{selectedStaff.line}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Vị Trí / Chức Danh:</span>
                  <strong className="text-slate-900">{selectedStaff.role}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Khả Năng Giao Tiếp:</span>
                  <strong className="text-slate-900">{selectedStaff.speechCapability}</strong>
                </div>
              </div>

              <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-emerald-900">Điểm Tổng Hợp Làm Việc:</span>
                  <strong className="text-base font-black text-emerald-700 font-mono">
                    {calculateTotalScoreForStaff(selectedStaff, params)} / 5.0
                  </strong>
                </div>
                <div className="flex justify-between text-[#2D6A4F]">
                  <span>• Điểm Văn Hóa Chung:</span>
                  <strong className="font-mono">{selectedStaff.generalScore || 5.0}đ</strong>
                </div>
                <div className="flex justify-between text-[#2D6A4F]">
                  <span>• Điểm Ngạch Chuyên Môn:</span>
                  <strong className="font-mono">{selectedStaff.techScore || 5.0}đ</strong>
                </div>
              </div>

              {/* Action buttons for admin */}
              {currentUser?.isAdmin && (
                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => {
                      setEditingStaff(selectedStaff);
                      setShowEditModal(true);
                      setSelectedStaff(null);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all text-center"
                  >
                    ✏️ Chỉnh Sửa Thông Tin
                  </button>
                  {onDeleteStaff && (
                    <button
                      onClick={() => {
                        if (window.confirm(`⚠️ Bạn có chắc muốn xóa nhân sự ${selectedStaff.name} (${selectedStaff.id})?`)) {
                          onDeleteStaff(selectedStaff.id);
                          setSelectedStaff(null);
                        }
                      }}
                      className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold border border-rose-200"
                    >
                      Xóa
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ADD STAFF MODAL */}
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
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
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
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Phòng Ban Trực Thuộc</label>
                <select
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                >
                  {departmentOptions.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Ngạch Làm Việc</label>
                <select
                  value={newLine}
                  onChange={(e) => setNewLine(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                >
                  {lines.map((l) => (
                    <option key={l.id} value={l.name}>{l.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Vị Trí / Chức Danh</label>
                <input
                  type="text"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Khả năng giao tiếp</label>
                <select
                  value={speechCap}
                  onChange={(e) => setSpeechCap(e.target.value as SpeechType)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                >
                  <option value="Người nói">Người nói</option>
                  <option value="Người điếc/ khiếm thính">Người điếc/ khiếm thính</option>
                </select>
              </div>

              <div className="pt-2 flex gap-2">
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
                  Tạo Nhân Sự ✨
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT STAFF MODAL */}
      {showEditModal && editingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Chỉnh Sửa Nhân Sự: {editingStaff.name}</h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditStaff} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Họ và Tên</label>
                <input
                  type="text"
                  required
                  value={editingStaff.name}
                  onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Phòng Ban Trực Thuộc</label>
                <select
                  value={editingStaff.department || departmentOptions[0] || 'Kế Toán'}
                  onChange={(e) => setEditingStaff({ ...editingStaff, department: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                >
                  {departmentOptions.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Ngạch Làm Việc</label>
                <select
                  value={editingStaff.line}
                  onChange={(e) => setEditingStaff({ ...editingStaff, line: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                >
                  {lines.map((l) => (
                    <option key={l.id} value={l.name}>{l.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Vị Trí / Chức Danh</label>
                <input
                  type="text"
                  value={editingStaff.role}
                  onChange={(e) => setEditingStaff({ ...editingStaff, role: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Điểm Văn Hóa (0-5.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={editingStaff.generalScore}
                    onChange={(e) => setEditingStaff({ ...editingStaff, generalScore: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Điểm Chuyên Môn (0-5.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={editingStaff.techScore}
                    onChange={(e) => setEditingStaff({ ...editingStaff, techScore: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Đặt lại mật khẩu đăng nhập (để trống nếu giữ nguyên)</label>
                <input
                  type="text"
                  placeholder="Mật khẩu mới (vd: 123456)..."
                  value={editNewPass}
                  onChange={(e) => setEditNewPass(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-amber-950">
                  <input
                    type="checkbox"
                    checked={!!editingStaff.isAdmin}
                    onChange={(e) => setEditingStaff({ ...editingStaff, isAdmin: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded cursor-pointer"
                  />
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-amber-700" />
                    <span>Cấp Quyền Admin Hệ Thống (Co-Admin)</span>
                  </span>
                </label>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
                >
                  Lưu Thay Đổi ✨
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
