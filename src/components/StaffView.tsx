import React, { useState } from 'react';
import { Staff, DepartmentLine, ParameterConfig, AuthUser } from '../types';
import { getSalaryTierBadge, calculateSalaryTier, calculateTotalScore } from '../utils/calculator';
import { 
  Users, 
  Search, 
  MapPin, 
  Volume2, 
  VolumeX, 
  Plus, 
  ChevronRight,
  Star,
  Leaf,
  Smile,
  Lock,
  ShieldCheck
} from 'lucide-react';

interface StaffViewProps {
  staffList: Staff[];
  lines: DepartmentLine[];
  onAddStaff: (staff: Staff) => void;
  isManager: boolean;
  params: ParameterConfig;
  currentUser: AuthUser | null;
  onOpenIncidentModal?: (targetId?: string, type?: 'ghi_nhan' | 'vi_pham') => void;
}

export const StaffView: React.FC<StaffViewProps> = ({
  staffList,
  lines,
  onAddStaff,
  isManager,
  params,
  currentUser,
  onOpenIncidentModal,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedLine, setSelectedLine] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  // Compute visible lines: Admin sees ALL lines, non-admin sees ONLY their department line
  const visibleLines = React.useMemo(() => {
    if (currentUser?.isAdmin) return lines;
    
    const userLineName = currentUser?.department || '';
    if (!userLineName) return lines;

    const filtered = lines.filter(l => {
      const lName = l.name.toLowerCase();
      const lId = l.id.toLowerCase();
      const target = userLineName.toLowerCase();

      if (lName === target || lId === target) return true;
      if (target.includes(lName) || lName.includes(target)) return true;
      if (target.includes('kho') && lName.includes('kho')) return true;
      if (target.includes('bếp') && (lName.includes('bếp') || lName.includes('bánh'))) return true;
      if (target.includes('sản xuất') && (lName.includes('sản xuất') || lId.includes('san_xuat') || lId.includes('bep_banh'))) return true;
      if (target.includes('nhân sự') && (lName.includes('nhân sự') || lId.includes('hr'))) return true;
      if (target.includes('kinh doanh') && (lName.includes('kinh doanh') || lId.includes('bd'))) return true;
      if (target.includes('pha chế') && lName.includes('pha chế')) return true;
      if ((target.includes('e-commerce') || target.includes('ecommerce')) && (lName.includes('e-commerce') || lId.includes('ecommerce'))) return true;
      if (target.includes('thương mại') && lName.includes('thương mại')) return true;
      return false;
    });

    return filtered.length > 0 ? filtered : lines;
  }, [lines, currentUser]);

  // Permission: Trưởng phòng trở lên hoặc Admin mới được thêm nhân sự, gán phòng ban & tạo mật khẩu
  const canAddStaff = currentUser?.isAdmin || ['Trưởng phòng', 'C-Level', 'Founder', 'Admin', 'Manager'].includes(currentUser?.jobLevel || '');

  // Form
  const [id, setId] = useState<string>(`TTX${String(staffList.length + 1).padStart(3, '0')}`);
  const [name, setName] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [jobLevel, setJobLevel] = useState<string>('Nhân viên');
  const [department, setDepartment] = useState<string>('Thương mại & Dịch vụ');
  const [line, setLine] = useState<string>('Thương mại & Dịch vụ');
  const [speechCapability, setSpeechCapability] = useState<'Người nói' | 'Người điếc/ khiếm thính'>('Người nói');
  const [location, setLocation] = useState<string>('Văn phòng');
  const [generalScore, setGeneralScore] = useState<number>(4.2);
  const [techScore, setTechScore] = useState<number>(4.2);
  const [mgmtScore, setMgmtScore] = useState<number>(0);
  const [isStaffManager, setIsStaffManager] = useState<boolean>(false);
  const [initialPassword, setInitialPassword] = useState<string>('123456');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) {
      alert('Vui lòng điền họ tên và vị trí làm việc nhé!');
      return;
    }

    const computedTotalScore = calculateTotalScore(
      generalScore,
      techScore,
      isStaffManager && mgmtScore > 0 ? mgmtScore : undefined,
      params
    );
    const computedSalaryTier = calculateSalaryTier(computedTotalScore, params);

    const newStaff: Staff = {
      id: id.trim() || `TTX${String(staffList.length + 1).padStart(3, '0')}`,
      name,
      role,
      positionCategory: role,
      department,
      line,
      speechCapability,
      location,
      status: 'Chính thức',
      evaluationCount: 0,
      generalScore,
      techScore,
      mgmtScore: isStaffManager ? mgmtScore : undefined,
      totalScore: computedTotalScore,
      salaryTier: computedSalaryTier,
      jobLevel: isStaffManager ? 'Quản lý' : 'Nhân viên',
      isManager: isStaffManager,
      joinDate: new Date().toISOString().split('T')[0],
    };

    onAddStaff(newStaff);
    setShowModal(false);
    setName('');
    setRole('');
  };

  // Privacy Scoping: Non-admin users only see their own staff profile
  const userStaffList = currentUser?.isAdmin
    ? staffList
    : staffList.filter(s => s.id === currentUser?.id);

  const filteredStaff = userStaffList.filter((staff) => {
    if (selectedLine !== 'all' && staff.line !== selectedLine) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        staff.name.toLowerCase().includes(term) ||
        staff.id.toLowerCase().includes(term) ||
        staff.role.toLowerCase().includes(term)
      );
    }
    return true;
  }).sort((a, b) => {
    const numA = parseInt(a.id.replace(/\D/g, ''), 10);
    const numB = parseInt(b.id.replace(/\D/g, ''), 10);
    return numA - numB;
  });

  return (
    <div className="space-y-4 pb-20">
      
      {/* Brand Header Card */}
      <div className="mobile-card p-5 space-y-2 border border-emerald-900/10 bg-white">
        <div className="flex items-center space-x-2 text-[#2D6A4F] text-xs font-bold font-heading uppercase tracking-wider">
          <Leaf className="w-4 h-4 text-[#2D6A4F]" />
          <span>Đội ngũ nhân sự ({filteredStaff.length} bạn)</span>
        </div>
        <h2 className="text-base sm:text-xl font-bold font-heading text-[#1B4332] flex items-center space-x-1.5 leading-snug">
          <span>Danh Sách Nhân Sự & Bậc Lương</span>
          <span className="shrink-0">⭐️</span>
        </h2>
      </div>

      {/* Search & Horizontal Line Filters */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm tên bạn nhân sự, vị trí..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-2xl text-xs text-[#2D3748] placeholder-slate-400 shadow-sm focus:outline-none focus:border-[#2D6A4F]"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedLine('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedLine === 'all'
                ? 'bg-[#1B4332] text-white shadow-md'
                : 'bg-white text-[#2D3748] border border-slate-200'
            }`}
          >
            Tất cả ⭐
          </button>
          {visibleLines.map((l) => (
            <button
              key={l.id}
              onClick={() => setSelectedLine(l.name)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedLine === l.name
                  ? 'bg-[#2D6A4F] text-white shadow-md'
                  : 'bg-white text-[#2D3748] border border-slate-200'
              }`}
            >
              {l.name}
            </button>
          ))}
        </div>
      </div>

      {/* Staff Cards List */}
      <div className="space-y-2.5">
        {filteredStaff.map((staff) => {
          const isDeaf = staff.speechCapability === 'Người điếc/ khiếm thính';

          return (
            <div
              key={staff.id}
              onClick={() => setSelectedStaff(staff)}
              className="mobile-card p-4 border border-slate-100 active:scale-[0.99] transition-all flex items-center justify-between gap-3 cursor-pointer hover:border-emerald-300"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-[10px] font-bold text-[#1B4332] bg-[#EDEAE3] px-2 py-0.5 rounded-full">
                    {staff.id}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#1B4332] text-[#52B788] flex items-center space-x-1">
                    <Star className="w-3 h-3 text-[#52B788] fill-[#52B788]" />
                    <span>Bậc {staff.salaryTier}</span>
                  </span>
                </div>

                <h3 className="text-sm font-bold font-heading text-[#1B4332] truncate">{staff.name}</h3>
                <p className="text-xs text-slate-600 font-medium truncate">{staff.role}</p>

                <div className="flex items-center space-x-2 text-[11px] text-slate-500 pt-0.5">
                  <span className="truncate">{staff.line}</span>
                  <span>•</span>
                  <span className="flex items-center space-x-1 font-semibold">
                    {isDeaf ? (
                      <span className="text-[#DD6B20] bg-amber-50 px-2 py-0.2 rounded-full border border-amber-200 flex items-center space-x-1">
                        <VolumeX className="w-3 h-3 text-[#DD6B20]" />
                        <span>Khiếm thính</span>
                      </span>
                    ) : (
                      <span className="text-slate-600 flex items-center space-x-1">
                        <Volume2 className="w-3 h-3 text-slate-400" />
                        <span>Người nói</span>
                      </span>
                    )}
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="text-[10px] text-slate-400 font-bold">Điểm làm việc</p>
                <p className="text-base font-black text-[#2D6A4F]">{staff.totalScore.toFixed(2)}</p>
                <ChevronRight className="w-4 h-4 text-slate-400 ml-auto mt-1" />
              </div>
            </div>
          );
        })}
      </div>

      {/* FAB: Visible for Managers/Heads/Admin */}
      {canAddStaff && (
        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-16 right-4 z-40 w-14 h-14 rounded-full brand-gradient text-white shadow-xl shadow-emerald-950 flex items-center justify-center border-2 border-white transform active:scale-95 transition-all"
          title="Thêm bạn nhân sự mới (Quyền Trưởng phòng trở lên)"
        >
          <Plus className="w-7 h-7" />
        </button>
      )}

      {/* Staff Detail Bottom Sheet */}
      {selectedStaff && (
        <div className="bottom-sheet animate-fadeIn">
          <div className="bottom-sheet-content space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono text-[#2D6A4F] font-bold">{selectedStaff.id}</span>
                <h2 className="text-lg font-bold font-heading text-[#1B4332]">{selectedStaff.name}</h2>
                <p className="text-xs text-slate-600 font-medium">{selectedStaff.role}</p>
              </div>
              <button onClick={() => setSelectedStaff(null)} className="text-slate-400 text-lg font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-[#EDEAE3]/60 border border-slate-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-bold">Bậc lương P2:</span>
                  <span className="px-3 py-1 rounded-full bg-[#1B4332] text-[#52B788] font-bold flex items-center space-x-1">
                    <Star className="w-3.5 h-3.5 text-[#52B788] fill-[#52B788]" />
                    <span>Bậc {selectedStaff.salaryTier} / 5</span>
                  </span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Phòng ban:</span>
                  <strong className="text-[#1B4332] font-bold">{selectedStaff.department}</strong>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Cấp bậc công việc:</span>
                  <strong className="text-[#1B4332] font-bold">{selectedStaff.jobLevel}</strong>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Điểm Văn hóa chung:</span>
                  <strong className="text-[#1B4332] font-bold">{selectedStaff.generalScore} / 5.0</strong>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Điểm Ngạch chuyên môn:</span>
                  <strong className="text-[#1B4332] font-bold">{selectedStaff.techScore} / 5.0</strong>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm">
                  <span className="font-bold text-[#1B4332]">ĐIỂM TỔNG HỢP:</span>
                  <span className="font-black text-[#2D6A4F]">{selectedStaff.totalScore.toFixed(2)}</span>
                </div>
              </div>

              <p className="text-slate-700">📍 <strong>Địa điểm làm việc:</strong> {selectedStaff.location}</p>
              <p className="text-slate-700">💬 <strong>Đối tượng giao tiếp:</strong> {selectedStaff.speechCapability}</p>

              {/* 2 Quick Action Buttons: Lập phiếu ghi nhận & Lập biên bản vi phạm */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    const sId = selectedStaff.id;
                    setSelectedStaff(null);
                    onOpenIncidentModal?.(sId, 'ghi_nhan');
                  }}
                  className="py-2.5 px-3 rounded-2xl bg-[#2D6A4F] hover:bg-[#1B4332] text-white text-xs font-extrabold font-heading flex items-center justify-center space-x-1 shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <span>🌟 Lập phiếu ghi nhận</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const sId = selectedStaff.id;
                    setSelectedStaff(null);
                    onOpenIncidentModal?.(sId, 'vi_pham');
                  }}
                  className="py-2.5 px-3 rounded-2xl bg-[#DD6B20] hover:bg-[#c05621] text-white text-xs font-extrabold font-heading flex items-center justify-center space-x-1 shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <span>📢 Lập biên bản vi phạm</span>
                </button>
              </div>
            </div>

            <button
              onClick={() => setSelectedStaff(null)}
              className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Manager Add Staff Sheet */}
      {showModal && (
        <div className="bottom-sheet animate-fadeIn">
          <div className="bottom-sheet-content space-y-3 text-xs max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h2 className="text-base font-bold font-heading text-[#1B4332]">Thêm Nhân Sự Mới ✨</h2>
                <p className="text-[10px] text-slate-500 font-medium">Quyền Trưởng phòng trở lên: Gán phòng ban, chức vụ & mật khẩu ban đầu</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 text-lg font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Mã Nhân Viên *</label>
                <input
                  type="text"
                  required
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#2D3748] font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Họ tên nhân sự *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#2D3748] font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Phòng Ban *</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#2D3748] font-medium"
                  >
                    <option value="Thương mại & Dịch vụ">Thương mại & Dịch vụ</option>
                    <option value="Pha chế">Pha chế</option>
                    <option value="Sản xuất">Sản xuất</option>
                    <option value="Kho & Đóng gói">Kho & Đóng gói</option>
                    <option value="Phát triển Kinh doanh">Phát triển Kinh doanh</option>
                    <option value="Nhân sự - Hành chính - Pháp chế">Nhân sự - Hành chính - Pháp chế</option>
                    <option value="Kế toán">Kế toán</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">Chức vụ / Vị trí *</label>
                  <input
                    type="text"
                    required
                    placeholder="Head of CS, Chuyên viên..."
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#2D3748]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Tuyến / Ngạch</label>
                  <select
                    value={line}
                    onChange={(e) => setLine(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#2D3748] font-medium"
                  >
                    {lines.map((l) => (
                      <option key={l.id} value={l.name}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">Cấp bậc công việc</label>
                  <select
                    value={jobLevel}
                    onChange={(e) => {
                      setJobLevel(e.target.value);
                      setIsStaffManager(['Trưởng phòng', 'C-Level', 'Founder', 'Quản lý'].includes(e.target.value));
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#2D3748] font-medium"
                  >
                    <option value="Nhân viên">Nhân viên</option>
                    <option value="Lead">Team Lead</option>
                    <option value="Quản lý">Quản lý</option>
                    <option value="Trưởng phòng">Trưởng phòng</option>
                    <option value="C-Level">C-Level</option>
                    <option value="Founder">Founder</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Mật khẩu khởi tạo đăng nhập</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={initialPassword}
                    onChange={(e) => setInitialPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#2D3748] font-mono font-bold"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1 italic">
                  💡 Nhập mật khẩu khởi tạo (mặc định: 123456). Nhân sự sẽ được yêu cầu đổi mật khẩu khi đăng nhập lần đầu.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold font-heading text-sm shadow-md"
              >
                Tạo Nhân Sự & Mật Khẩu ✨
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
