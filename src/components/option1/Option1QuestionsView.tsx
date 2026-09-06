import React, { useState, useMemo } from 'react';
import { Question, DepartmentLine, AuthUser } from '../../types';
import { 
  Layers, 
  Search, 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  CheckCircle2,
  ShieldCheck,
  Building2,
  AlertTriangle,
  Leaf,
  Info
} from 'lucide-react';

interface Option1QuestionsViewProps {
  questions: Question[];
  lines: DepartmentLine[];
  onAddQuestion: (question: Question) => void;
  onDeleteQuestion?: (questionId: string) => void;
  isManager: boolean;
  currentUser: AuthUser | null;
}

export const Option1QuestionsView: React.FC<Option1QuestionsViewProps> = ({
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
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    TC3: true,
    VH1: true,
    QG: true,
    QH: true,
    TC1: true,
    RG1: true,
  });

  // Department line scoping based on user
  const visibleLines = useMemo(() => {
    if (currentUser?.isAdmin) return lines;
    const userLineName = currentUser?.department || '';
    if (!userLineName) return lines;
    const filtered = lines.filter(l => {
      const lName = l.name.toLowerCase();
      const target = userLineName.toLowerCase();
      return lName.includes(target) || target.includes(lName);
    });
    return filtered.length > 0 ? filtered : lines;
  }, [lines, currentUser]);

  // Helper check if question belongs to Management Track
  const isMgmtQuestion = (q: Question) => {
    return (
      q.category === 'Quản lý' || 
      q.groupCode.startsWith('Q') || 
      q.id.startsWith('Q') ||
      (q.scope && (q.scope.includes('Trưởng') || q.scope.includes('Quản lý')))
    );
  };

  // Helper check if question belongs ONLY to Ranh Giới
  const isBoundaryQuestion = (q: Question) => {
    return (
      q.groupCode.startsWith('RG') ||
      q.id.startsWith('RG') ||
      q.category === 'Ranh giới' ||
      (q.groupName && q.groupName.toUpperCase().includes('RANH GIỚI'))
    );
  };

  // Dynamically group questions by groupCode (same logic as running version)
  const groupedData = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    const filtered = questions.filter(q => {
      const isMgmt = isMgmtQuestion(q);

      if (!isManager && isMgmt) return false;

      if (activeTab === 'Chung') {
        if (q.category !== 'Chung' || isMgmt || isBoundaryQuestion(q)) return false;
      } else if (activeTab === 'Phòng ban') {
        if (q.category !== 'Phòng ban' || isMgmt || isBoundaryQuestion(q)) return false;
        if (selectedLineId && q.lineId && q.lineId !== selectedLineId) return false;
      } else if (activeTab === 'Quản lý') {
        if (!isMgmt) return false;
      } else if (activeTab === 'Ranh giới') {
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

    const groupsMap = new Map<string, {
      code: string;
      name: string;
      questions: Question[];
    }>();

    filtered.forEach(q => {
      const code = q.groupCode || 'KHAC';
      if (!groupsMap.has(code)) {
        groupsMap.set(code, {
          code,
          name: q.groupName || code,
          questions: [],
        });
      }
      groupsMap.get(code)!.questions.push(q);
    });

    return Array.from(groupsMap.values());
  }, [questions, activeTab, selectedLineId, searchTerm, isManager]);

  const toggleGroup = (code: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [code]: prev[code] === undefined ? false : !prev[code]
    }));
  };

  return (
    <div className="space-y-5 pb-16">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl shadow-sm border border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">Ma Trận Tiêu Chí Đánh Giá</h2>
              <p className="text-xs text-slate-500 font-medium">Bộ tiêu chí chất lượng thật cho 7 ngạch phòng ban NCTTX</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scope Navigation Tabs - ENSURE SINGLE LINE (whitespace-nowrap) */}
      <div className="bg-slate-200/60 p-1.5 rounded-2xl border border-slate-200/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('Chung')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 ${
            activeTab === 'Chung'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'text-slate-700 hover:bg-white/60'
          }`}
        >
          <Leaf className="w-3.5 h-3.5 shrink-0" />
          <span>🌿 Khung Văn Hóa</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('Phòng ban')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 ${
            activeTab === 'Phòng ban'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'text-slate-700 hover:bg-white/60'
          }`}
        >
          <Building2 className="w-3.5 h-3.5 shrink-0" />
          <span>🏢 Ngạch Phòng Ban</span>
        </button>

        {isManager && (
          <button
            type="button"
            onClick={() => setActiveTab('Quản lý')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 ${
              activeTab === 'Quản lý'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'text-amber-800 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>🛡️ Tiêu Chí Quản Lý</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setActiveTab('Ranh giới')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 ${
            activeTab === 'Ranh giới'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
              : 'text-rose-800 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>⚠️ Ranh Giới Đỏ/Vàng</span>
        </button>
      </div>

      {/* Sub-line Department Filter if activeTab === 'Phòng ban' */}
      {activeTab === 'Phòng ban' && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {visibleLines.map((line) => (
            <button
              key={line.id}
              onClick={() => setSelectedLineId(line.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all border ${
                selectedLineId === line.id
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {line.name}
            </button>
          ))}
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Tìm tiêu chí theo mã (TC3.8, VH1.2, QG1...), tên nhóm hoặc nội dung..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white rounded-2xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
        />
      </div>

      {/* Questions Accordion Group List */}
      <div className="space-y-4">
        {groupedData.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200/80">
            <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-600">Không tìm thấy tiêu chí nào trong danh mục này</p>
            <p className="text-xs text-slate-400 mt-1">Vui lòng thử tìm kiếm khác hoặc chuyển danh mục tiêu chí</p>
          </div>
        ) : (
          groupedData.map((group) => {
            const isExpanded = expandedGroups[group.code] !== false; // Default expanded
            return (
              <div
                key={group.code}
                className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden transition-all"
              >
                {/* Group Header Bar */}
                <div
                  onClick={() => toggleGroup(group.code)}
                  className="p-4 bg-slate-50/80 hover:bg-slate-100/80 cursor-pointer flex items-center justify-between border-b border-slate-200/60 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <span className="font-mono text-xs font-black bg-emerald-600 text-white px-2.5 py-1 rounded-xl shadow-sm shrink-0 whitespace-nowrap">
                      {group.code}
                    </span>
                    <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                      {group.name}
                    </h3>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap hidden sm:inline-block">
                      {group.questions.length} tiêu chí
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="p-1 rounded-xl bg-white border border-slate-200 text-slate-500">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Sub-Criteria Items inside Group */}
                {isExpanded && (
                  <div className="divide-y divide-slate-100 p-2 sm:p-4 space-y-2">
                    {group.questions.map((q) => (
                      <div
                        key={q.id}
                        className="p-3.5 rounded-2xl hover:bg-emerald-50/40 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-2.5"
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg shrink-0 whitespace-nowrap mt-0.5">
                            {q.id}
                          </span>
                          <div className="space-y-1">
                            <p className="text-xs font-extrabold text-slate-800 leading-relaxed">
                              {q.text}
                            </p>
                            {q.scope && (
                              <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                                <Info className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="whitespace-nowrap font-medium">Phạm vi: {q.scope}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-start mt-1 sm:mt-0">
                          <span className="text-[10px] font-bold px-2 py-1 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 whitespace-nowrap">
                            {q.measurementType || 'Thang 0-5'}
                          </span>
                          {onDeleteQuestion && currentUser?.isAdmin && (
                            <button
                              onClick={() => onDeleteQuestion(q.id)}
                              className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50 transition-all"
                              title="Xóa tiêu chí"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

