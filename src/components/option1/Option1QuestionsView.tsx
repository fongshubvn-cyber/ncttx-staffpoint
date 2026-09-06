import React, { useState, useMemo } from 'react';
import { Question, DepartmentLine, AuthUser } from '../../types';
import { 
  Layers, 
  Search, 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  CheckCircle2
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Department line scoping
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

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchesSearch = q.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            q.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            q.groupCode.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;

      if (activeTab === 'Chung') return q.scope === 'Chung';
      if (activeTab === 'Ranh giới') return q.scope === 'Ranh giới';
      if (activeTab === 'Quản lý') return q.scope === 'Quản lý';
      if (activeTab === 'Phòng ban') return q.scope === 'Phòng ban' && q.lineId === selectedLineId;

      return true;
    });
  }, [questions, searchTerm, activeTab, selectedLineId]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-3xl shadow-sm border border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-900">Ma Trận Tiêu Chí Đánh Giá</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">Bộ tiêu chí chất lượng thật cho 7 ngạch phòng ban NCTTX</p>
        </div>
      </div>

      {/* Scope Navigation Tabs */}
      <div className="bg-white rounded-2xl p-2 shadow-sm border border-slate-200/80 flex items-center gap-1 overflow-x-auto">
        {(['Chung', 'Phòng ban', 'Quản lý', 'Ranh giới'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl text-xs font-bold transition-all text-center ${
              activeTab === tab
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab === 'Chung' && '🌿 Khung Văn Hóa Chung'}
            {tab === 'Phòng ban' && '🏬 Ngạch Phòng Ban'}
            {tab === 'Quản lý' && '👑 Tiêu Chí Quản Lý'}
            {tab === 'Ranh giới' && '🛑 Ranh Giới Đỏ/Vàng'}
          </button>
        ))}
      </div>

      {/* Sub-line filter if activeTab === 'Phòng ban' */}
      {activeTab === 'Phòng ban' && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {visibleLines.map((line) => (
            <button
              key={line.id}
              onClick={() => setSelectedLineId(line.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                selectedLineId === line.id
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
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
          placeholder="Tìm tiêu chí theo từ khóa, mã nhóm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
        />
      </div>

      {/* Questions Accordion List */}
      <div className="space-y-3">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200/80">
            <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-600">Không tìm thấy tiêu chí nào trong danh mục này</p>
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const isExpanded = expandedId === q.id;
            return (
              <div
                key={q.id}
                className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 hover:border-emerald-300 transition-all space-y-3"
              >
                <div
                  className="flex items-start justify-between cursor-pointer gap-3"
                  onClick={() => setExpandedId(isExpanded ? null : q.id)}
                >
                  <div className="flex items-start gap-3">
                    <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 font-mono text-xs font-bold border border-emerald-200/60">
                      {q.id}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          Nhóm {q.groupCode} ({q.groupName})
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">{q.text}</h4>
                    </div>
                  </div>

                  <button className="text-slate-400 hover:text-slate-600 p-1">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="pt-3 border-t border-slate-100 text-xs space-y-2 text-slate-600">
                    <p><strong className="text-slate-800">Biểu hiện đạt chuẩn:</strong> Tuân thủ quy chuẩn chất lượng, minh bạch thông tin.</p>
                    {onDeleteQuestion && currentUser?.isAdmin && (
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => onDeleteQuestion(q.id)}
                          className="px-3 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs border border-rose-200/60 flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Xóa tiêu chí</span>
                        </button>
                      </div>
                    )}
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
