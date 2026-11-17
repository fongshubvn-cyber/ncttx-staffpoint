import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Staff, Question, DepartmentLine, IncidentRecord, ParameterConfig, AuthUser } from '../types';
import { initialPolicyRules } from '../data/seedData';
import { INCIDENT_KEYWORDS } from './IncidentFormModal';
import { 
  fetchAndParseShiftWorkbook, 
  getCachedShiftData, 
  ShiftGroup, 
  ShiftMember,
  DEFAULT_SHIFT_SHEET_URL 
} from '../services/shiftService';
import { 
  Calendar, 
  Clock, 
  Users, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Sparkles, 
  Megaphone, 
  BookOpen, 
  ShieldCheck, 
  Image as ImageIcon, 
  Building2, 
  Layers, 
  Check, 
  VolumeX, 
  Info,
  ChevronDown
} from 'lucide-react';

interface ShiftEvaluationModalProps {
  show: boolean;
  onClose: () => void;
  staffList: Staff[];
  questions: Question[];
  lines: DepartmentLine[];
  onAddIncident: (incident: IncidentRecord) => void;
  currentUser?: AuthUser | null;
  params?: ParameterConfig;
}

export const ShiftEvaluationModal: React.FC<ShiftEvaluationModalProps> = ({
  show,
  onClose,
  staffList,
  questions,
  lines,
  onAddIncident,
  currentUser,
  params,
}) => {
  if (!show) return null;

  // Today formatted as YYYY-MM-DD
  const getTodayStr = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const defaultPenalty = params?.defaultShiftPenaltyPoints ?? -0.5;
  const defaultReward = params?.defaultShiftRewardPoints ?? 0.5;
  const sheetUrl = params?.shiftSheetUrl || DEFAULT_SHIFT_SHEET_URL;
  const scanInterval = params?.shiftScanIntervalSeconds || 60;

  // State: Shifts data from Google Sheet
  const [shifts, setShifts] = useState<ShiftGroup[]>(() => {
    const cached = getCachedShiftData();
    return cached?.shifts || [];
  });
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [lastScanTime, setLastScanTime] = useState<string>(() => {
    const cached = getCachedShiftData();
    if (cached?.lastUpdated) {
      const d = new Date(cached.lastUpdated);
      return d.toLocaleTimeString('vi-VN');
    }
    return '';
  });
  const [scanCountdown, setScanCountdown] = useState<number>(scanInterval);
  const [scanError, setScanError] = useState<string | null>(null);

  // Filter States
  const [selectedDate, setSelectedDate] = useState<string>(getTodayStr());
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedShiftKey, setSelectedShiftKey] = useState<string>('');

  // Shift Members Selection state
  const [selectedMemberIds, setSelectedMemberIds] = useState<Record<string, boolean>>({});

  // Evaluation Form State
  const [evalCategory, setEvalCategory] = useState<'nhac_nho' | 'khen_thuong' | 'vi_pham'>('nhac_nho');
  const [selectedKeyword, setSelectedKeyword] = useState<string>('all');
  const [title, setTitle] = useState<string>('Nhắc nhở nề nếp ca làm việc');
  const [description, setDescription] = useState<string>('');
  const [impactPoints, setImpactPoints] = useState<number>(defaultPenalty);
  const [policyRuleId, setPolicyRuleId] = useState<string>('NQ01');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Submission Status
  const [submittedMembers, setSubmittedMembers] = useState<{ count: number; names: string[]; points: number; type: string } | null>(null);

  const policyRulesList = (params?.policyRules && params.policyRules.length > 0)
    ? params.policyRules
    : initialPolicyRules;

  // Trigger Sheet Scan
  const scanSchedule = async (isSilent = false) => {
    if (!isSilent) setIsScanning(true);
    setScanError(null);
    try {
      const data = await fetchAndParseShiftWorkbook(sheetUrl);
      if (data && data.shifts) {
        setShifts(data.shifts);
        setLastScanTime(new Date().toLocaleTimeString('vi-VN'));
      }
    } catch (err: any) {
      console.warn('Shift sync failed:', err);
      if (!isSilent) {
        setScanError(err.message || 'Không thể đồng bộ lịch từ Google Sheet');
      }
    } finally {
      setIsScanning(false);
      setScanCountdown(scanInterval);
    }
  };

  // Initial Scan on Mount if no data
  useEffect(() => {
    if (shifts.length === 0) {
      scanSchedule(false);
    }
  }, []);

  // Polling Timer (Mỗi chu kỳ quét tự động từ cấu hình)
  useEffect(() => {
    const timer = setInterval(() => {
      setScanCountdown(prev => {
        if (prev <= 1) {
          scanSchedule(true);
          return scanInterval;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [scanInterval, sheetUrl]);

  // Department Options available in shifts (Pha chế, Thương mại & Dịch vụ, Phục vụ, Bếp Bánh)
  const departmentOptions = useMemo(() => {
    const standardDepts = [
      { id: 'Pha chế', label: '☕ Pha chế' },
      { id: 'Thương mại & Dịch vụ', label: '🛍️ Thương mại & Dịch vụ' },
      { id: 'Phục vụ', label: '💁 Phục vụ' },
      { id: 'Bếp Bánh', label: '🥖 Bếp Bánh' }
    ];

    const existing = new Set(standardDepts.map(d => d.id.toLowerCase()));
    const extras: { id: string; label: string }[] = [];

    shifts.forEach(s => {
      if (s.department && !existing.has(s.department.toLowerCase())) {
        extras.push({ id: s.department, label: `🏢 ${s.department}` });
        existing.add(s.department.toLowerCase());
      }
    });

    return [...standardDepts, ...extras];
  }, [shifts]);

  // Filter Shifts for Selected Date & Department
  const matchingShifts = useMemo(() => {
    return shifts.filter(s => {
      const dateMatch = s.date === selectedDate;
      if (!dateMatch) return false;
      if (selectedDept === 'all') return true;

      // Direct match
      if (s.department === selectedDept) return true;

      // Flexible matching for Phục vụ and Thương mại & Dịch vụ
      if (selectedDept === 'Phục vụ') {
        if (s.department === 'Phục vụ') return true;
        if (s.department.includes('Thương mại') || s.department.includes('Dịch vụ')) return true;
      }
      if (selectedDept === 'Thương mại' || selectedDept === 'Thương mại & Dịch vụ') {
        if (s.department.includes('Thương mại') || s.department.includes('Dịch vụ')) return true;
      }

      return false;
    });
  }, [shifts, selectedDate, selectedDept]);

  // Currently Selected Shift Group
  const currentShift = useMemo(() => {
    if (!selectedShiftKey) {
      return matchingShifts[0] || null;
    }
    return matchingShifts.find(s => `${s.department}_${s.shiftName}` === selectedShiftKey) || matchingShifts[0] || null;
  }, [matchingShifts, selectedShiftKey]);

  // Initialize selected members whenever currentShift changes
  useEffect(() => {
    if (currentShift) {
      const initMap: Record<string, boolean> = {};
      currentShift.members.forEach(m => {
        initMap[m.id] = true;
      });
      setSelectedMemberIds(initMap);
      setSelectedShiftKey(`${currentShift.department}_${currentShift.shiftName}`);
    } else {
      setSelectedMemberIds({});
    }
  }, [currentShift]);

  // Toggle Member selection
  const handleToggleMember = (id: string) => {
    setSelectedMemberIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSelectAllMembers = (select: boolean) => {
    if (!currentShift) return;
    const nextMap: Record<string, boolean> = {};
    currentShift.members.forEach(m => {
      nextMap[m.id] = select;
    });
    setSelectedMemberIds(nextMap);
  };

  const selectedMembersCount = useMemo(() => {
    return Object.values(selectedMemberIds).filter(Boolean).length;
  }, [selectedMemberIds]);

  // Handle Eval Category Change
  const handleChangeEvalCategory = (cat: 'nhac_nho' | 'khen_thuong' | 'vi_pham') => {
    setEvalCategory(cat);
    if (cat === 'nhac_nho') {
      setImpactPoints(defaultPenalty);
      setTitle('Nhắc nhở nề nếp ca làm việc');
    } else if (cat === 'khen_thuong') {
      setImpactPoints(defaultReward);
      setTitle('Khen thưởng sự phối hợp xuất sắc trong ca làm');
    } else {
      const rule = policyRulesList.find(r => r.id === policyRuleId) || policyRulesList[0];
      setImpactPoints(rule?.penaltyPoints ? -rule.penaltyPoints : -10);
      setTitle(rule ? `[${rule.code}] ${rule.title}` : 'Vi phạm nội quy điểm bán');
    }
  };

  // Handle Keyword Filter Change
  const handleSelectKeyword = (kwId: string) => {
    setSelectedKeyword(kwId);
    if (kwId !== 'all') {
      const kw = INCIDENT_KEYWORDS.find(k => k.id === kwId);
      if (kw) {
        if (evalCategory === 'vi_pham') {
          const matched = policyRulesList.filter(rule => {
            if (rule.active === false) return false;
            const targetText = `${rule.code} ${rule.title} ${rule.description} ${rule.category}`.toLowerCase();
            return kw.matchWords.some(w => targetText.includes(w.toLowerCase()));
          });
          if (matched.length > 0) {
            const first = matched[0];
            setPolicyRuleId(first.id);
            setImpactPoints(-first.penaltyPoints);
            setTitle(`[${first.code}] ${first.title}`);
            setDescription(first.description);
          }
        } else {
          // Pre-fill text for work evaluation
          setTitle(`${evalCategory === 'khen_thuong' ? 'Khen thưởng' : 'Nhắc nhở'} công tác ${kw.name.toLowerCase()} trong ca`);
          setDescription(`Ghi nhận về ${kw.description.toLowerCase()} của cả ca làm việc.`);
        }
      }
    }
  };

  // Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('Dung lượng ảnh tối đa là 10MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentShift) {
      alert('Vui lòng chọn ca làm việc để đánh giá!');
      return;
    }

    const selectedMembers = currentShift.members.filter(m => selectedMemberIds[m.id]);
    if (selectedMembers.length === 0) {
      alert('Vui lòng chọn ít nhất một nhân sự trong ca để áp dụng đánh giá!');
      return;
    }

    if (!title.trim()) {
      alert('Vui lòng nhập tiêu đề đánh giá!');
      return;
    }

    const batchSessionId = `SHIFT-${selectedDate.replace(/-/g, '')}-${currentShift.department.substring(0, 3).toUpperCase()}-${Date.now()}`;
    const allMemberNames = selectedMembers.map(m => m.name);

    // Create IncidentRecord for each selected member in this shift
    selectedMembers.forEach((member, index) => {
      // Find full staff info from staffList
      const fullStaff = staffList.find(s => s.id === member.id) || {
        id: member.id,
        name: member.name,
        role: member.role || 'Nhân viên',
        department: currentShift.department,
        line: currentShift.department,
      };

      const record: IncidentRecord = {
        id: `INC-CA-${Date.now()}-${index + 1}-${member.id}`,
        type: evalCategory === 'vi_pham' ? 'vi_pham' : 'ghi_nhan',
        reporterId: currentUser?.id || 'MANAGER',
        reporterName: currentUser?.name || 'Quản lý ca làm',
        targetId: member.id,
        targetName: member.name,
        targetRole: (fullStaff as any).role || member.role || 'Nhân sự ca làm',
        title: `[CA: ${currentShift.shiftName}] ${title}`,
        description: `${description || title}\n\n[Đánh giá tập thể ca]: ${currentShift.department} - ${currentShift.shiftName} ngày ${selectedDate} (Điểm bán: ${currentShift.location}).\nCác thành viên cùng ca: ${allMemberNames.join(', ')}.`,
        severity: evalCategory === 'vi_pham' ? 'Nghiêm trọng' : 'Vừa',
        date: selectedDate,
        createdAt: new Date().toISOString(),
        status: 'Đã ghi nhận',
        impactPoints: evalCategory === 'vi_pham' ? 0 : impactPoints,
        policyPenaltyPoints: evalCategory === 'vi_pham' ? Math.abs(impactPoints) : 0,
        policyRuleId: evalCategory === 'vi_pham' ? policyRuleId : undefined,
        imageUrl: imagePreview || undefined,
      };

      onAddIncident(record);
    });

    setSubmittedMembers({
      count: selectedMembers.length,
      names: allMemberNames,
      points: impactPoints,
      type: evalCategory === 'vi_pham' ? 'Trừ điểm chấp hành' : (evalCategory === 'khen_thuong' ? 'Cộng điểm chuyên môn' : 'Trừ điểm chuyên môn'),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm animate-fade-in print:hidden overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 transform transition-all animate-scale-up my-auto overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] text-white flex items-start justify-between relative shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-white/20 backdrop-blur-sm text-white">
                <Users className="w-5 h-5" />
              </span>
              <h2 className="text-lg sm:text-xl font-black tracking-tight">Đánh Giá Tập Thể Ca Làm Việc</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-400 text-[#1B4332] text-[10px] font-black uppercase tracking-wider">
                Theo Lịch Sheet
              </span>
            </div>
            <p className="text-xs text-emerald-100 font-medium">
              Đồng bộ lịch ca Google Sheet tự động 1 phút/lần • Điểm đánh giá áp dụng đồng thời cho tất cả nhân sự trong ca
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Realtime Scan Status Bar (Quét 1 phút 1 lần) */}
        <div className="px-4 sm:px-6 py-2.5 bg-emerald-50/90 border-b border-emerald-100 flex items-center justify-between flex-wrap gap-2 text-xs shrink-0">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
            </span>
            <span className="font-extrabold text-emerald-950">
              Quét tự động: <span className="font-mono text-emerald-700">{scanCountdown}s</span>
            </span>
            {lastScanTime && (
              <span className="text-[11px] text-emerald-700 hidden sm:inline">
                (Lần cuối: {lastScanTime} • {shifts.length} ca đã lưu)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {scanError && (
              <span className="text-[11px] text-rose-600 font-bold truncate max-w-xs" title={scanError}>
                ⚠️ {scanError}
              </span>
            )}
            <button
              onClick={() => scanSchedule(false)}
              disabled={isScanning}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] shadow-2xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              title="Quét lại toàn bộ Google Sheet ngay bây giờ"
            >
              <RefreshCw className={`w-3 h-3 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Đang quét...' : 'Quét ngay'}</span>
            </button>
          </div>
        </div>

        {/* Body Content */}
        {submittedMembers ? (
          /* Success Screen */
          <div className="p-8 text-center space-y-5 my-auto">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900">Đã Đánh Giá Thành Công Cả Ca!</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Điểm tác động <span className="font-bold text-emerald-800">{submittedMembers.points > 0 ? `+${submittedMembers.points}` : submittedMembers.points}đ</span> ({submittedMembers.type}) đã được ghi nhận và áp dụng cho toàn bộ <span className="font-black text-slate-900">{submittedMembers.count} nhân sự</span>:
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-lg mx-auto text-left space-y-2">
              <div className="text-xs font-bold text-slate-500 uppercase">Danh sách nhân sự được cập nhật:</div>
              <div className="flex flex-wrap gap-1.5">
                {submittedMembers.names.map((nm, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs">
                    👤 {nm}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={() => {
                  setSubmittedMembers(null);
                  setTitle('');
                  setDescription('');
                  setImagePreview(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-all cursor-pointer"
              >
                Đánh giá ca khác
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
              >
                Hoàn tất & Đóng
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* Step 1: Pick Date & Shift */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                  1. Chọn Ngày & Ca Làm Việc
                </span>
                <span className="text-[11px] font-bold text-slate-500">
                  {matchingShifts.length} ca tìm thấy
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Date Input */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Ngày làm việc</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-2xs"
                  />
                  <div className="flex gap-1.5 mt-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedDate(getTodayStr())}
                      className="text-[10px] font-extrabold text-emerald-700 hover:underline cursor-pointer"
                    >
                      Hôm nay
                    </button>
                    <span className="text-slate-300">•</span>
                    <button
                      type="button"
                      onClick={() => {
                        const d = new Date();
                        d.setDate(d.getDate() - 1);
                        const y = d.getFullYear();
                        const m = (d.getMonth() + 1).toString().padStart(2, '0');
                        const day = d.getDate().toString().padStart(2, '0');
                        setSelectedDate(`${y}-${m}-${day}`);
                      }}
                      className="text-[10px] font-extrabold text-slate-500 hover:underline cursor-pointer"
                    >
                      Hôm qua
                    </button>
                  </div>
                </div>

                {/* Department Filter */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Bộ phận</label>
                  <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-2xs cursor-pointer"
                  >
                    <option value="all">🏢 Tất cả bộ phận</option>
                    {departmentOptions.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.label}</option>
                    ))}
                  </select>
                </div>

                {/* Shift Selector */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Ca làm việc</label>
                  {matchingShifts.length === 0 ? (
                    <div className="px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl text-[11px] font-bold text-amber-900">
                      Chưa có ca trong ngày này
                    </div>
                  ) : (
                    <select
                      value={selectedShiftKey}
                      onChange={(e) => setSelectedShiftKey(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-extrabold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-2xs cursor-pointer"
                    >
                      {matchingShifts.map((s, idx) => (
                        <option key={idx} value={`${s.department}_${s.shiftName}`}>
                          ⏰ {s.shiftName} ({s.department} • {s.members.length} bạn)
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Shift Overview Card & Members Selection */}
              {currentShift && (
                <div className="mt-3 p-3.5 bg-white rounded-xl border border-emerald-200/90 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black font-mono">
                        {currentShift.department}
                      </span>
                      <span className="text-xs font-black text-slate-900">
                        Ca: {currentShift.shiftName}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        ({currentShift.dayOfWeek}, {currentShift.date})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSelectAllMembers(true)}
                        className="text-[11px] font-bold text-emerald-700 hover:underline cursor-pointer"
                      >
                        Chọn hết
                      </button>
                      <span className="text-slate-300">•</span>
                      <button
                        type="button"
                        onClick={() => handleSelectAllMembers(false)}
                        className="text-[11px] font-bold text-slate-500 hover:underline cursor-pointer"
                      >
                        Bỏ chọn
                      </button>
                    </div>
                  </div>

                  {/* List of members with checkboxes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
                    {currentShift.members.map((member) => {
                      const isChecked = !!selectedMemberIds[member.id];
                      const isDeaf = ['TTX009', 'TTX010', 'TTX011', 'TTX012', 'TTX013', 'TTX014', 'TV14'].includes(member.id);

                      return (
                        <div
                          key={member.id}
                          onClick={() => handleToggleMember(member.id)}
                          className={`flex items-center gap-2.5 p-2 rounded-xl border transition-all cursor-pointer ${
                            isChecked
                              ? 'bg-emerald-50/80 border-emerald-300 shadow-2xs'
                              : 'bg-slate-50/60 border-slate-200 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}} // Handled by parent div onClick
                            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
                          />
                          <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center text-xs font-bold shrink-0">
                            {member.name.substring(0, 1)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-black text-slate-900 truncate">
                                {member.name}
                              </span>
                              {isDeaf && (
                                <span title="Người khiếm thính">
                                  <VolumeX className="w-3 h-3 text-purple-600 shrink-0" />
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              {member.id} {member.inTime ? `(${member.inTime} - ${member.outTime})` : ''}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-900 bg-emerald-100/60 px-3 py-1.5 rounded-lg">
                    <Info className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>Đã chọn <strong>{selectedMembersCount} / {currentShift.members.length}</strong> nhân sự để áp dụng đánh giá cùng lúc.</span>
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Choose Evaluation Type */}
            <div className="space-y-3">
              <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
                2. Hình Thức Đánh Giá Ca
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Mode 1: Nhắc nhở ca */}
                <button
                  type="button"
                  onClick={() => handleChangeEvalCategory('nhac_nho')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                    evalCategory === 'nhac_nho'
                      ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-400/30 shadow-sm'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl ${evalCategory === 'nhac_nho' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <Megaphone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900">📢 Nhắc Nhở Ca</div>
                    <div className="text-[10px] text-slate-500 font-medium">Trừ thang 5.0đ (-0.2đ, -0.5đ)</div>
                  </div>
                </button>

                {/* Mode 2: Khen thưởng ca */}
                <button
                  type="button"
                  onClick={() => handleChangeEvalCategory('khen_thuong')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                    evalCategory === 'khen_thuong'
                      ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-400/30 shadow-sm'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl ${evalCategory === 'khen_thuong' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900">🌟 Khen Thưởng Ca</div>
                    <div className="text-[10px] text-slate-500 font-medium">Cộng thang 5.0đ (+0.2đ, +0.5đ)</div>
                  </div>
                </button>

                {/* Mode 3: Vi phạm nội quy ca */}
                <button
                  type="button"
                  onClick={() => handleChangeEvalCategory('vi_pham')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                    evalCategory === 'vi_pham'
                      ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-400/30 shadow-sm'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl ${evalCategory === 'vi_pham' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900">📋 Vi Phạm Nội Quy</div>
                    <div className="text-[10px] text-slate-500 font-medium">Trừ quỹ 100đ Chấp hành</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Keyword Filter Chips Bar */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-600 uppercase">
                🏷️ Nhóm Từ Khóa Gợi Ý:
              </label>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
                {INCIDENT_KEYWORDS.map(kw => {
                  const isSelected = selectedKeyword === kw.id;
                  return (
                    <button
                      key={kw.id}
                      type="button"
                      onClick={() => handleSelectKeyword(kw.id)}
                      className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-extrabold transition-all border whitespace-nowrap cursor-pointer ${
                        isSelected
                          ? 'bg-[#1B4332] text-white border-[#1B4332] shadow-2xs scale-105'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span>{kw.icon}</span>
                      <span>{kw.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Evaluation Details */}
            <div className="space-y-4 pt-1">
              {evalCategory === 'vi_pham' ? (
                /* Policy Rule Select */
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Chọn Điều Khoản Nội Quy Điểm Bán Vi Phạm *
                  </label>
                  <select
                    value={policyRuleId}
                    onChange={(e) => {
                      setPolicyRuleId(e.target.value);
                      const rule = policyRulesList.find(r => r.id === e.target.value);
                      if (rule) {
                        setImpactPoints(-rule.penaltyPoints);
                        setTitle(`[${rule.code}] ${rule.title}`);
                        setDescription(rule.description);
                      }
                    }}
                    className="w-full px-3 py-2.5 bg-white rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 shadow-2xs cursor-pointer"
                  >
                    {policyRulesList.map(rule => (
                      <option key={rule.id} value={rule.id}>
                        [{rule.code}] {rule.title} (Trừ -{rule.penaltyPoints}đ chấp hành)
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                /* Work Evaluation Points Buttons */
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Mức Điểm Tác Động Vào Điểm Ca (Thang 5.0đ)
                  </label>
                  <div className="flex gap-2">
                    {evalCategory === 'khen_thuong' ? (
                      [0.1, 0.2, 0.3, 0.5, 1.0].map(pt => (
                        <button
                          key={pt}
                          type="button"
                          onClick={() => setImpactPoints(pt)}
                          className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all border cursor-pointer ${
                            impactPoints === pt
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          +{pt}đ
                        </button>
                      ))
                    ) : (
                      [-0.1, -0.2, -0.3, -0.5, -1.0].map(pt => (
                        <button
                          key={pt}
                          type="button"
                          onClick={() => setImpactPoints(pt)}
                          className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all border cursor-pointer ${
                            impactPoints === pt
                              ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {pt}đ
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Title Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tiêu Đề Đánh Giá Ca *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: Vệ sinh bàn giao ca sạch sẽ, chăm sóc cây cối tốt..."
                  className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-2xs"
                  required
                />
              </div>

              {/* Description Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mô Tả Chi Tiết / Diễn Biến Trong Ca
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ghi nhận rõ tình huống, hành vi hoặc kết quả làm việc của các thành viên trong ca..."
                  className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-2xs"
                />
              </div>

              {/* Optional Photo Attachment */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Đính Kèm Ảnh Minh Chứng (Tùy chọn)
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {imagePreview ? (
                  <div className="relative inline-block mt-1">
                    <img
                      src={imagePreview}
                      alt="Minh chứng ca"
                      className="h-24 w-auto rounded-xl object-cover border border-slate-200 shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="absolute -top-2 -right-2 p-1 bg-rose-500 text-white rounded-full shadow-md hover:bg-rose-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 border border-dashed border-slate-300 hover:bg-slate-100 text-slate-600 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <ImageIcon className="w-4 h-4 text-slate-400" />
                    <span>Tải ảnh hiện trường ca làm (tối đa 10MB)</span>
                  </button>
                )}
              </div>
            </div>

            {/* Footer Submit Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold text-xs transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={selectedMembersCount === 0}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] hover:from-[#143225] hover:to-[#22533e] text-white font-extrabold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Ghi Nhận Cho {selectedMembersCount} Nhân Sự</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
