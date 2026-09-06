import React, { useState, useMemo, useEffect } from 'react';
import { Question, DepartmentLine, AuthUser } from '../types';
import { 
  Plus, 
  Layers, 
  Building2, 
  Search, 
  Inbox,
  Leaf,
  ShieldCheck,
  Info,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Trash2
} from 'lucide-react';

interface QuestionsViewProps {
  questions: Question[];
  lines: DepartmentLine[];
  onAddQuestion: (question: Question) => void;
  onDeleteQuestion?: (questionId: string) => void;
  isManager: boolean;
  currentUser: AuthUser | null;
}

export const QuestionsView: React.FC<QuestionsViewProps> = ({
  questions,
  lines,
  onAddQuestion,
  onDeleteQuestion,
  isManager,
  currentUser,
}) => {
  const [activeTab, setActiveTab] = useState<'Chung' | 'Phòng ban' | 'Quản lý' | 'Ranh giới'>('Chung');
  const [selectedLineId, setSelectedLineId] = useState<string>('TM_DV');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showModal, setShowModal] = useState(false);

  // Compute visible lines for user scoping: Admin sees ALL lines, non-admin sees ONLY their department line
  const visibleLines = useMemo(() => {
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

  // Keep selectedLineId aligned with visibleLines
  useEffect(() => {
    if (visibleLines.length > 0 && !visibleLines.some(l => l.id === selectedLineId)) {
      setSelectedLineId(visibleLines[0].id);
    }
  }, [visibleLines, selectedLineId]);

  // Permission Rule: Từ trưởng phòng đến quản lý được thêm tiêu chí, NGOẠI TRỪ bộ phận Kế toán
  const isAccounting = currentUser?.department?.includes('Kế toán') || currentUser?.role?.includes('Kế toán');
  const isManagerOrHead = currentUser?.isAdmin || (
    ['Trưởng phòng', 'C-Level', 'Founder', 'Manager', 'Lead', 'Quản lý'].includes(currentUser?.jobLevel || '')
  );
  const canAddCriteria = isManagerOrHead && !isAccounting;

  // Safety fallback if activeTab is 'Quản lý' but user is not manager
  useEffect(() => {
    if (!isManager && activeTab === 'Quản lý') {
      setActiveTab('Chung');
    }
  }, [isManager, activeTab]);

  // Track expanded main criteria group codes (accordion open/close state)
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    TC3: true,
    VH1: true,
    QG: true,
    QH: true,
    TC1: true,
    RG1: true,
    RG2: true,
    RG3: true,
    RG4: true,
  });

  // Unique list of existing main criteria groups
  const existingGroups = useMemo(() => {
    const map = new Map<string, string>();
    questions.forEach(q => {
      if (q.groupCode && !map.has(q.groupCode)) {
        map.set(q.groupCode, q.groupName || q.groupCode);
      }
    });
    return Array.from(map.entries()).map(([code, name]) => ({ code, name }));
  }, [questions]);

  // Form states for Add Criteria
  const [category, setCategory] = useState<'Chung' | 'Phòng ban' | 'Quản lý' | 'Ranh giới'>('Chung');
  const [lineId, setLineId] = useState<string>('TM_DV');
  const [customId, setCustomId] = useState<string>(''); // 1. Mã số tiêu chí
  const [isNewGroup, setIsNewGroup] = useState<boolean>(false);
  const [groupCode, setGroupCode] = useState<string>('VH1'); // 2. Tiêu chí chính (Code)
  const [groupName, setGroupName] = useState<string>('ONE VOICE, MỘT TIẾNG NÓI THỐNG NHẤT'); // 2. Tiêu chí chính (Tên)
  const [text, setText] = useState<string>(''); // 3. Tiêu chí phụ (Nội dung chi tiết)
  const [measurementType, setMeasurementType] = useState<'vi phạm' | 'ghi nhận' | 'thang 0-5' | 'đạt/chưa đạt'>('thang 0-5');
  const [defaultPoints, setDefaultPoints] = useState<number>(5);

  // Auto-generate suggested Code (Mã số tiêu chí) when opening modal or changing category/group
  useEffect(() => {
    if (showModal && !customId) {
      const prefix = category === 'Chung' ? 'VH' : category === 'Quản lý' ? 'Q' : category === 'Ranh giới' ? 'RG' : 'TC';
      const cleanGroup = groupCode.replace(/\D/g, '') || '1';
      const existingInGroup = questions.filter(q => q.groupCode === groupCode).length;
      setCustomId(`${prefix}${cleanGroup}.${existingInGroup + 1}`);
    }
  }, [showModal, category, groupCode, questions]);

  const handleOpenAddModal = () => {
    const initialGroup = existingGroups[0] || { code: 'VH1', name: 'ONE VOICE, MỘT TIẾNG NÓI THỐNG NHẤT' };
    setGroupCode(initialGroup.code);
    setGroupName(initialGroup.name);
    setIsNewGroup(false);
    
    const prefix = category === 'Chung' ? 'VH' : category === 'Quản lý' ? 'Q' : category === 'Ranh giới' ? 'RG' : 'TC';
    const cleanGroup = initialGroup.code.replace(/\D/g, '') || '1';
    const count = questions.filter(q => q.groupCode === initialGroup.code).length;
    setCustomId(`${prefix}${cleanGroup}.${count + 1}`);
    setText('');
    setShowModal(true);
  };

  const selectedLine = lines.find(l => l.id === selectedLineId);

  // Toggle group expansion
  const toggleGroup = (code: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [code]: !prev[code]
    }));
  };

  const expandAll = (codes: string[]) => {
    const next: Record<string, boolean> = { ...expandedGroups };
    codes.forEach(c => { next[c] = true; });
    setExpandedGroups(next);
  };

  const collapseAll = (codes: string[]) => {
    const next: Record<string, boolean> = { ...expandedGroups };
    codes.forEach(c => { next[c] = false; });
    setExpandedGroups(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !groupCode.trim()) {
      alert('Vui lòng nhập đầy đủ Tiêu chí chính và Tiêu chí phụ nhé!');
      return;
    }

    const defaultPts = defaultPoints ?? ((measurementType === 'vi phạm' || category === 'Ranh giới') ? 5 : measurementType === 'ghi nhận' ? 0 : 5);
    const prefix = category === 'Chung' ? 'VH' : category === 'Quản lý' ? 'Q' : category === 'Ranh giới' ? 'RG' : 'TC';
    const finalId = customId.trim() || `${prefix}${groupCode.replace(/\D/g,'') || '1'}.${questions.length + 1}`;

    const newQuestion: Question = {
      id: finalId,
      category: category === 'Ranh giới' ? 'Chung' : category,
      lineId: category === 'Phòng ban' ? lineId : undefined,
      groupCode: groupCode.trim().toUpperCase(),
      groupName: groupName.trim() || groupCode.trim(),
      text: text.trim(),
      scope: category === 'Quản lý' ? 'Trưởng ca đến Trưởng phòng' : 'Tất cả nhân sự',
      measurementType: category === 'Ranh giới' ? 'vi phạm' : measurementType,
      defaultPoints: defaultPts,
      active: true,
    };

    onAddQuestion(newQuestion);
    setShowModal(false);
    setText('');
    setCustomId('');
  };

  const handleDeleteCriteria = (q: Question) => {
    if (!onDeleteQuestion) return;
    if (confirm(`Bạn có chắc chắn muốn xóa / bỏ tiêu chí "[${q.id}] - ${q.text}" không?`)) {
      onDeleteQuestion(q.id);
    }
  };

  // Helper check if question belongs to Management Track
  const isMgmtQuestion = (q: Question) => {
    return (
      q.category === 'Quản lý' || 
      q.groupCode.startsWith('Q') || 
      q.id.startsWith('Q') ||
      (q.scope && (q.scope.includes('Trưởng') || q.scope.includes('Quản lý')))
    );
  };

  // Helper check if question belongs ONLY to Ranh Giới Không Thỏa Hiệp
  const isBoundaryQuestion = (q: Question) => {
    return (
      q.groupCode.startsWith('RG') ||
      q.id.startsWith('RG') ||
      q.category === 'Ranh giới' ||
      (q.groupName && q.groupName.toUpperCase().includes('RANH GIỚI'))
    );
  };

  // Dynamically group questions by groupCode
  const groupedData = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    // Filter by tab, search term, and management role visibility rule
    const filtered = questions.filter(q => {
      const isMgmt = isMgmtQuestion(q);

      // CRITICAL RULE: Management items ONLY visible if isManager === true
      if (!isManager && isMgmt) {
        return false;
      }

      if (activeTab === 'Chung') {
        // Tab 1: Ngạch Chung applies to all staff, excluding management & boundary questions
        if (q.category !== 'Chung' || isMgmt || isBoundaryQuestion(q)) return false;
      } else if (activeTab === 'Phòng ban') {
        // Tab 2: Ngạch Phòng Ban applies to specific department, excluding management & boundary questions
        if (q.category !== 'Phòng ban' || isMgmt || isBoundaryQuestion(q)) return false;
        if (selectedLineId && q.lineId && q.lineId !== selectedLineId) return false;
      } else if (activeTab === 'Quản lý') {
        // Tab 3: Ngạch Quản Lý (ONLY accessible when isManager === true)
        if (!isMgmt) return false;
      } else if (activeTab === 'Ranh giới') {
        // Tab 4: Ranh Giới Không Thỏa Hiệp (ONLY boundary questions)
        if (!isBoundaryQuestion(q)) return false;
      }

      if (term) {
        return (
          q.id.toLowerCase().includes(term) ||
          q.text.toLowerCase().includes(term) ||
          q.groupCode.toLowerCase().includes(term) ||
          (q.groupName && q.groupName.toLowerCase().includes(term))
        );
      }
      return true;
    });

    // Grouping
    const groupsMap = new Map<string, {
      code: string;
      name: string;
      scope: string;
      measurementType: string;
      questions: Question[];
    }>();

    filtered.forEach(q => {
      const code = q.groupCode || 'KHAC';
      if (!groupsMap.has(code)) {
        groupsMap.set(code, {
          code,
          name: q.groupName || code,
          scope: q.scope || 'Tất cả nhân sự',
          measurementType: q.measurementType || 'thang 0-5',
          questions: [],
        });
      }
      groupsMap.get(code)!.questions.push(q);
    });

    return Array.from(groupsMap.values());
  }, [questions, activeTab, selectedLineId, searchTerm, isManager]);

  const allCurrentGroupCodes = useMemo(() => groupedData.map(g => g.code), [groupedData]);

  return (
    <div className="space-y-4 pb-20">
      
      {/* Brand Header Card */}
      <div className="mobile-card p-5 space-y-3 border border-emerald-900/10 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[#2D6A4F] text-xs font-bold font-heading uppercase tracking-wider">
            <Leaf className="w-4 h-4 text-[#2D6A4F]" />
            <span>Ma Trận Tiêu Chí Đánh Giá Nhân Sự NCTTX</span>
          </div>
          {currentUser?.isAdmin && (
            <span className="text-[10px] font-extrabold text-[#2D6A4F] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              🔑 Admin Quản Trị
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-xl font-bold font-heading text-[#1B4332] flex items-center space-x-1.5 leading-snug">
            <span>Các Tiêu Chí Phản Hồi</span>
            <span className="shrink-0">🌸</span>
          </h2>

          {currentUser?.isAdmin && (
            <button
              onClick={handleOpenAddModal}
              className="px-3 py-1.5 rounded-xl bg-[#2D6A4F] hover:bg-[#1B4332] text-white text-xs font-bold shadow-sm transition-all flex items-center space-x-1 active:scale-95 shrink-0"
              title="Thêm tiêu chí mới vào ma trận"
            >
              <Plus className="w-4 h-4 text-[#52B788] shrink-0" />
              <span>Thêm Tiêu Chí</span>
            </button>
          )}
        </div>

        {/* Management Role Visibility Banner */}
        {isManager ? (
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-[#DD6B20] space-y-1">
            <p className="font-extrabold flex items-center space-x-1.5 text-xs text-[#DD6B20]">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Chế độ Quản lý (Trưởng ca ➔ Trưởng phòng):</span>
            </p>
            <p className="text-[11px] text-[#2D3748] font-medium">
              Bạn có quyền truy cập <strong>Nút 3: NGẠCH QUẢN LÝ 🛡️</strong> (QH, QG, QA, QB, QC, QD, QE, QF, QK, Q1..Q9). Nhân viên thường sẽ không thấy nút này.
            </p>
          </div>
        ) : (
          <div className="p-3 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-700 space-y-1">
            <p className="font-bold flex items-center space-x-1.5 text-xs text-[#1B4332]">
              <Info className="w-4 h-4 text-[#2D6A4F] shrink-0" />
              <span>Quyền xem Nhân viên:</span>
            </p>
            <p className="text-[11px] text-slate-600 font-medium">
              Các tiêu chí <strong>Ngạch Quản lý</strong> đã được tách riêng và chỉ hiển thị với vai trò từ <strong>Quản lý trở lên (Trưởng ca, Lead, Cửa hàng trưởng, Trưởng phòng)</strong>. Bạn đang xem các tiêu chí Văn hóa chung & Tiêu chí chuyên môn bộ phận.
            </p>
          </div>
        )}

        {/* Core Rules: Only show quote regarding evaluation tracks */}
        <div className="p-3.5 rounded-2xl bg-[#EDEAE3]/70 border border-slate-200 text-xs text-[#2D3748] space-y-2">
          <p className="font-bold text-[#1B4332] flex items-center space-x-1.5 text-xs">
            <Info className="w-4 h-4 text-[#2D6A4F] shrink-0" />
            <span>Trích dẫn quy tắc phân quyền ngạch đánh giá:</span>
          </p>
          <ul className="space-y-1.5 text-[11px] text-slate-700 font-medium pl-1">
            <li className="flex items-start space-x-1.5">
              <span className="text-[#2D6A4F] font-bold shrink-0">1️⃣ Ngạch Chung:</span>
              <span>Áp dụng cho <strong>TOÀN THỂ nhân viên</strong> Công ty (Khung văn hóa 16 nhóm: VH1..VH12, TC3, TC6, NL1..NL4).</span>
            </li>
            <li className="flex items-start space-x-1.5">
              <span className="text-[#2D6A4F] font-bold shrink-0">2️⃣ Theo Phòng Ban:</span>
              <span>Chỉ áp dụng <strong>RIÊNG cho phòng ban đó</strong>. Nhân sự bộ phận nào chịu tác động ma trận tiêu chí chuyên môn của bộ phận đó.</span>
            </li>
            <li className="flex items-start space-x-1.5">
              <span className="text-[#DD6B20] font-bold shrink-0">3️⃣ Ngạch Quản Lý 🛡️:</span>
              <span>Tách riêng nút 3. Chỉ hiển thị và tác động đến nhân sự từ <strong>Quản lý trở lên (Trưởng ca, Lead, Cửa hàng trưởng, Trưởng phòng)</strong>.</span>
            </li>
            <li className="flex items-start space-x-1.5">
              <span className="text-rose-700 font-bold shrink-0">4️⃣ Ranh Giới Không Thỏa Hiệp ⚠️:</span>
              <span>Tách riêng nút 4. Quy định các điều kiện và hành vi vi phạm ranh giới đỏ (Trừ thẳng điểm / Chặn kết quả đánh giá).</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Category Tabs: 1. NGẠCH CHUNG | 2. THEO PHÒNG BAN | 3. NGẠCH QUẢN LÝ (Only if isManager) | 4. RANH GIỚI KHÔNG THỎA HIỆP */}
      <div className={`grid ${isManager ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'} gap-2`}>
        <button
          onClick={() => setActiveTab('Chung')}
          className={`py-2.5 px-2 rounded-2xl text-[11px] sm:text-xs font-extrabold font-heading flex items-center justify-center space-x-1.5 min-h-[44px] text-center leading-tight transition-all ${
            activeTab === 'Chung'
              ? 'bg-[#1B4332] text-white shadow-md'
              : 'bg-white text-[#2D3748] border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5 shrink-0 text-[#52B788]" />
          <span>1. NGẠCH CHUNG</span>
        </button>

        <button
          onClick={() => setActiveTab('Phòng ban')}
          className={`py-2.5 px-2 rounded-2xl text-[11px] sm:text-xs font-extrabold font-heading flex items-center justify-center space-x-1.5 min-h-[44px] text-center leading-tight transition-all ${
            activeTab === 'Phòng ban'
              ? 'bg-[#1B4332] text-white shadow-md'
              : 'bg-white text-[#2D3748] border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Building2 className="w-3.5 h-3.5 shrink-0 text-[#52B788]" />
          <span>2. PHÒNG BAN</span>
        </button>

        {isManager && (
          <button
            onClick={() => setActiveTab('Quản lý')}
            className={`py-2.5 px-2 rounded-2xl text-[11px] sm:text-xs font-extrabold font-heading flex items-center justify-center space-x-1.5 min-h-[44px] text-center leading-tight transition-all ${
              activeTab === 'Quản lý'
                ? 'bg-[#DD6B20] text-white shadow-md'
                : 'bg-amber-50 text-[#DD6B20] border border-amber-300 hover:bg-amber-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>3. QUẢN LÝ 🛡️</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('Ranh giới')}
          className={`py-2.5 px-2 rounded-2xl text-[11px] sm:text-xs font-extrabold font-heading flex items-center justify-center space-x-1.5 min-h-[44px] text-center leading-tight transition-all ${
            activeTab === 'Ranh giới'
              ? 'bg-rose-700 text-white shadow-md'
              : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>4. RANH GIỚI ⚠️</span>
        </button>
      </div>

      {/* Search & Expansion Controls */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm tiêu chí, mã câu (TC3.8, VH1.2, QG1, RG...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-2xl text-xs text-[#2D3748] placeholder-slate-400 focus:outline-none focus:border-[#2D6A4F] shadow-sm"
          />
        </div>

        <button
          onClick={() => {
            const areAllExpanded = allCurrentGroupCodes.every(c => expandedGroups[c]);
            if (areAllExpanded) collapseAll(allCurrentGroupCodes);
            else expandAll(allCurrentGroupCodes);
          }}
          className="px-3 py-2 bg-white border border-slate-200 rounded-2xl text-[11px] font-bold text-[#2D6A4F] shrink-0 hover:bg-slate-50 transition-all shadow-sm"
        >
          Mở/Thu gọn
        </button>
      </div>

      {/* TAB 2: PHÒNG BAN SELECTOR PILLS (When activeTab === 'Phòng ban') */}
      {activeTab === 'Phòng ban' && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {currentUser?.isAdmin ? 'Chọn ngạch phòng ban:' : 'Ngạch phòng ban của bạn:'}
            </p>
            {!currentUser?.isAdmin && (
              <span className="text-[10px] text-[#2D6A4F] font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                🔒 Đã giới hạn theo ngạch nhân sự
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
            {visibleLines.map((l) => {
              const isSelected = selectedLineId === l.id;
              const isEmpty = l.status === '⬜ khung rỗng';
              return (
                <button
                  key={l.id}
                  onClick={() => setSelectedLineId(l.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 border ${
                    isSelected
                      ? 'bg-[#2D6A4F] text-white border-[#2D6A4F] shadow-md'
                      : 'bg-white text-[#2D3748] border-slate-200'
                  }`}
                >
                  <span>{l.name}</span>
                  {isEmpty ? (
                    <span className="px-2 py-0.2 rounded-full text-[9px] font-extrabold bg-[#DD6B20] text-white">
                      Rỗng
                    </span>
                  ) : (
                    <span className="px-2 py-0.2 rounded-full text-[9px] font-extrabold bg-[#52B788] text-[#1B4332]">
                      Có tiêu chí
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* MAIN ACCORDION DROPDOWN LIST */}
      {activeTab === 'Phòng ban' && selectedLine && selectedLine.status === '⬜ khung rỗng' && groupedData.length === 0 ? (
        /* Empty Department Matrix View (⬜ KHUNG RỖNG) */
        <div className="mobile-card p-6 text-center border-amber-200 space-y-3 bg-[#EDEAE3]/40">
          <div className="w-12 h-12 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center mx-auto text-[#DD6B20] shadow-sm">
            <Inbox className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full bg-[#DD6B20] text-white text-[10px] font-extrabold uppercase font-heading">
              RỖNG (⬜ Khung rỗng)
            </span>
            <h3 className="text-base font-bold font-heading text-[#1B4332] pt-1">
              Bộ Phận "{selectedLine.name}" Chưa Có Ma Trận Tiêu Chí Riêng
            </h3>
            <p className="text-xs text-[#2D3748] leading-relaxed font-medium">
              {selectedLine.scopeDescription}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-white text-xs text-slate-600 text-left space-y-1 border border-slate-200 shadow-sm">
            <p className="font-bold text-[#2D6A4F]">💡 Nguyên tắc tính điểm:</p>
            <p>Nhân sự bộ phận {selectedLine.name} tạm thời được đánh giá 100% theo <strong>Khung Văn Hóa Chung</strong> trong khi chờ Ban Giám Đốc ban hành ma trận chuyên môn riêng.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {groupedData.map((group) => {
            const isExpanded = !!expandedGroups[group.code];
            const isViolationGroup = group.measurementType === 'vi phạm' || group.code.startsWith('RG');
            const isRecognitionGroup = group.measurementType === 'ghi nhận';
            const isMgmtGroup = group.code.startsWith('Q');

            return (
              <div 
                key={group.code} 
                className={`mobile-card overflow-hidden bg-white shadow-sm border transition-all ${
                  isViolationGroup
                    ? 'border-rose-300 ring-1 ring-rose-200'
                    : isMgmtGroup
                    ? 'border-amber-300 ring-1 ring-amber-200'
                    : group.code.startsWith('TC3')
                    ? 'border-emerald-300 ring-1 ring-emerald-200'
                    : 'border-slate-200'
                }`}
              >
                
                {/* Collapsible Header (Tiêu chí chính / Nhóm lớn) */}
                <button
                  onClick={() => toggleGroup(group.code)}
                  className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-all border-b border-transparent data-[expanded=true]:border-slate-100"
                  data-expanded={isExpanded}
                >
                  <div className="flex items-center space-x-2.5 pr-2">
                    <span className={`font-mono text-xs font-extrabold px-2.5 py-1 rounded-lg border shrink-0 ${
                      isViolationGroup
                        ? 'bg-rose-100 text-rose-800 border-rose-300'
                        : isMgmtGroup
                        ? 'bg-amber-100 text-[#DD6B20] border-amber-300'
                        : group.code.startsWith('TC3')
                        ? 'bg-emerald-100 text-[#1B4332] border-emerald-300'
                        : 'bg-[#EDEAE3] text-[#1B4332] border-slate-300'
                    }`}>
                      {group.code}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-[#1B4332] leading-snug font-heading">
                        {group.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium line-clamp-1">{group.scope}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                      isViolationGroup 
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : isRecognitionGroup
                        ? 'bg-emerald-50 text-[#1B4332] border-emerald-200'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}>
                      {group.questions.length} tiêu chí nhỏ
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Dropdown Content: Danh sách các tiêu chí nhỏ bên trong */}
                {isExpanded && (
                  <div className="p-3 bg-slate-50/70 space-y-2 border-t border-slate-100 animate-fadeIn">
                    {group.questions.map((q) => {
                      const isViolation = q.measurementType === 'vi phạm' || q.id.startsWith('RG');
                      const isRecognition = q.measurementType === 'ghi nhận';

                      return (
                        <div 
                          key={q.id} 
                          className={`p-3 rounded-xl bg-white border shadow-sm space-y-2 ${
                            isViolation ? 'border-rose-200 bg-rose-50/10' :
                            q.id.startsWith('Q') ? 'border-amber-200 bg-amber-50/10' :
                            q.id.startsWith('TC3') ? 'border-emerald-200 bg-emerald-50/10' : 'border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="font-mono text-[11px] font-extrabold text-[#1B4332] bg-[#EDEAE3] px-2 py-0.5 rounded border border-slate-200">
                                {q.id}
                              </span>
                              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                                isViolation 
                                  ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                                  : isRecognition 
                                  ? 'bg-emerald-100 text-[#1B4332] border border-emerald-200' 
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}>
                                {isViolation 
                                  ? 'Vi phạm' 
                                  : isRecognition 
                                  ? 'Khen thưởng' 
                                  : `Thang ${q.measurementType}`}
                              </span>
                            </div>

                            {/* ADMIN ACTION: DELETE CRITERIA BUTTON */}
                            {currentUser?.isAdmin && onDeleteQuestion && (
                              <button
                                onClick={() => handleDeleteCriteria(q)}
                                className="px-2 py-0.5 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-extrabold transition-all flex items-center space-x-1 active:scale-95 shrink-0"
                                title="Admin: Xóa / bỏ tiêu chí này khỏi hệ thống"
                              >
                                <Trash2 className="w-3 h-3 text-rose-600 shrink-0" />
                                <span>Bỏ tiêu chí</span>
                              </button>
                            )}
                          </div>

                          <p className="text-xs font-medium text-[#2D3748] leading-relaxed">
                            {q.text}
                          </p>

                          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                            <span>Phạm vi: <strong>{q.scope || 'Tất cả nhân sự'}</strong></span>
                            <span className="font-bold text-[#2D6A4F]">Điểm chuẩn: {q.defaultPoints}đ</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* FAB: Add Question */}
      {/* FAB: Only visible to Managers & Department Heads EXCEPT Accounting Department */}
      {canAddCriteria && (
        <button
          onClick={handleOpenAddModal}
          className="fixed bottom-16 right-4 z-40 w-14 h-14 rounded-full brand-gradient text-white shadow-xl shadow-emerald-950 flex items-center justify-center border-2 border-white transform active:scale-95 transition-all"
          title="Thêm tiêu chí mới (Từ Quản lý đến Trưởng phòng, trừ Kế toán)"
        >
          <Plus className="w-7 h-7" />
        </button>
      )}

      {/* Add Question Sheet */}
      {showModal && (
        <div className="bottom-sheet animate-fadeIn">
          <div className="bottom-sheet-content space-y-3.5 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h2 className="text-base font-bold font-heading text-[#1B4332]">Thêm Tiêu Chí Đánh Giá Mới ✨</h2>
                <p className="text-[11px] text-slate-500 font-medium">Nhập thông tin mã số, tiêu chí chính và tiêu chí phụ chi tiết</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 text-lg font-bold p-1">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              
              {/* Category & Line Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-extrabold mb-1 text-[11px]">Ngạch Tiêu Chí *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#1B4332]"
                  >
                    <option value="Chung">1. Khung chung (Văn hóa 16 nhóm)</option>
                    <option value="Phòng ban">2. Tiêu chí chuyên môn Phòng ban</option>
                    {isManager && <option value="Quản lý">3. Ngạch Quản lý (Trưởng ca / Quản lý)</option>}
                    <option value="Ranh giới">4. Ranh giới không thỏa hiệp (Vi phạm)</option>
                  </select>
                </div>

                {category === 'Phòng ban' && (
                  <div>
                    <label className="block text-slate-700 font-extrabold mb-1 text-[11px]">Phòng Ban Áp Dụng *</label>
                    <select
                      value={lineId}
                      onChange={(e) => setLineId(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#1B4332]"
                    >
                      {lines.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* 1. MÃ SỐ TIÊU CHÍ (Criteria Code / ID) */}
              <div>
                <label className="block text-[#1B4332] font-extrabold mb-1 text-xs flex items-center justify-between">
                  <span>1. Mã Số Tiêu Chí (ID Cụ Thể) *</span>
                  <span className="text-[10px] text-slate-400 font-normal">VD: VH1.5, TC2.1, VP01, RG1.2</span>
                </label>
                <input
                  type="text"
                  required
                  value={customId}
                  onChange={(e) => setCustomId(e.target.value)}
                  placeholder="Nhập mã số tiêu chí (VD: VH1.5, VP01...)"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-extrabold text-[#1B4332] focus:outline-none focus:border-[#2D6A4F]"
                />
              </div>

              {/* 2. TIÊU CHÍ CHÍNH (Main Criterion Code & Name) */}
              <div className="space-y-2 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
                <div className="flex items-center justify-between">
                  <label className="block text-[#1B4332] font-black text-xs">
                    2. Tiêu Chí Chính (Nhóm Tiêu Chí Trục) *
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsNewGroup(!isNewGroup)}
                    className="text-[10px] font-extrabold text-[#2D6A4F] underline hover:text-[#1B4332]"
                  >
                    {isNewGroup ? "← Chọn từ nhóm có sẵn" : "+ Tạo Nhóm Tiêu Chí Chính Mới"}
                  </button>
                </div>

                {!isNewGroup ? (
                  <select
                    value={groupCode}
                    onChange={(e) => {
                      const selectedCode = e.target.value;
                      setGroupCode(selectedCode);
                      const matched = questions.find(q => q.groupCode === selectedCode);
                      if (matched && matched.groupName) {
                        setGroupName(matched.groupName);
                      }
                    }}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-[#1B4332]"
                  >
                    {existingGroups.map(g => (
                      <option key={g.code} value={g.code}>
                        [{g.code}] - {g.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    <div>
                      <input
                        type="text"
                        required
                        value={groupCode}
                        onChange={(e) => setGroupCode(e.target.value.toUpperCase())}
                        placeholder="Mã nhóm (VD: VH1)"
                        className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-[#1B4332]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        required
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="Tên tiêu chí chính (VD: Tinh thần đồng đội...)"
                        className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-[#1B4332]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 3. TIÊU CHÍ PHỤ (Sub Criterion Detail Text) */}
              <div>
                <label className="block text-[#1B4332] font-black mb-1 text-xs">
                  3. Tiêu Chí Phụ (Nội Dung Chi Tiết) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Nhập nội dung tiêu chí phụ chi tiết (VD: Luôn sẵn sàng hỗ trợ đồng nghiệp...)"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#2D3748] font-medium focus:outline-none focus:border-[#2D6A4F]"
                ></textarea>
              </div>

              {/* Measurement Type & Points */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-extrabold mb-1 text-[11px]">Hình Thức Đánh Giá</label>
                  <select
                    value={measurementType}
                    onChange={(e) => setMeasurementType(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#1B4332]"
                  >
                    <option value="thang 0-5">Thang 0 - 5 điểm</option>
                    <option value="vi phạm">📢 Tiêu chí Vi phạm</option>
                    <option value="ghi nhận">🌟 Tiêu chí Ghi nhận / Khen thưởng</option>
                    <option value="đạt/chưa đạt">Đạt / Chưa đạt</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-extrabold mb-1 text-[11px]">Điểm Mặc Định</label>
                  <input
                    type="number"
                    value={defaultPoints}
                    onChange={(e) => setDefaultPoints(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#1B4332]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold font-heading text-xs shadow-md transition-all active:scale-95 flex items-center justify-center space-x-1.5"
              >
                <span>Lưu Tiêu Chí Mới ✨</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
