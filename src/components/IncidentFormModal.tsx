import React, { useState } from 'react';
import { Staff, Question, DepartmentLine, IncidentRecord, IncidentType, SeverityLevel, ParameterConfig, AuthUser } from '../types';
import { isManagementRole, isSystemAdmin } from '../utils/calculator';
import { initialPolicyRules } from '../data/seedData';
import { Trophy, Megaphone, Gift, Info, CheckCircle2, ShieldCheck, UserCheck, Search, Check, X, ShieldAlert, ClipboardCheck, BookOpen, AlertTriangle, Award } from 'lucide-react';

export interface KeywordCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  matchWords: string[];
}

export const INCIDENT_KEYWORDS: KeywordCategory[] = [
  {
    id: 'all',
    name: 'Tất cả',
    icon: '✨',
    description: 'Hiển thị tất cả tiêu chí và quy định',
    matchWords: [],
  },
  {
    id: 'khong_gian',
    name: 'Không gian',
    icon: '🌿',
    description: 'Âm thanh tĩnh lặng, mùi hương Sả Java, giữ trật tự không gian chung',
    matchWords: ['không gian', 'mùi', 'hương', 'âm thanh', 'tĩnh lặng', 'ồn', 'nhạc', 'khuôn viên', 'bầu không khí'],
  },
  {
    id: 'cay_coi',
    name: 'Cây cối',
    icon: '🌱',
    description: 'Chăm sóc cây xanh, bảo tồn cây cổ thụ, gìn giữ mầm cây Nhà',
    matchWords: ['cây', 'hoa', 'sân vườn', 'tưới', 'lá', 'cảnh quan', 'héo', 'mầm'],
  },
  {
    id: 'rac_thai',
    name: 'Rác thải & Vệ sinh',
    icon: '🗑️',
    description: 'Đổ rác đúng 4 dấu hiệu, phân loại rác, dọn dẹp vệ sinh quầy/xưởng/bàn ghế',
    matchWords: ['rác', 'vệ sinh', 'sạch', 'dọn', 'thùng', 'ly', 'tách', 'khăn', 'lau', 'khử trùng', 'bẩn'],
  },
  {
    id: 'hut_thuoc',
    name: 'Hút thuốc & PCCC',
    icon: '🚭',
    description: 'Nghiêm cấm hút thuốc sai nơi, an toàn điện nước, phòng cháy chữa cháy',
    matchWords: ['thuốc', 'cháy', 'pccc', 'lửa', 'thoát hiểm', 'an toàn', 'chập', 'điện'],
  },
  {
    id: 'noi_tuc',
    name: 'Nói tục & Ứng xử',
    icon: '🗣️',
    description: 'Không nói tục chửi thề, tôn trọng đồng đội khiếm thính, một tiếng nói thống nhất',
    matchWords: ['nói tục', 'chửi', 'giao tiếp', 'khiếm thính', 'điếc', 'xúc phạm', 'thái độ', 'ngôn ngữ', 'ký hiệu', 'tử tế', 'sứ mệnh', 'lời nói', 'phát ngôn'],
  },
  {
    id: 'gio_giac',
    name: 'Giờ giấc',
    icon: '⏰',
    description: 'Đi làm đúng giờ, chấm công, không bỏ vị trí trong ca, giao nhận ca đầy đủ',
    matchWords: ['giờ', 'trễ', 'muộn', 'ca', 'chấm công', 'bỏ vị trí', 'về sớm', 'vào ca', 'deadline', 'tiến độ'],
  },
  {
    id: 'tai_san',
    name: 'Tài sản & Thiết bị',
    icon: '🛠️',
    description: 'Bảo quản máy móc pha chế/xưởng, tránh hao hụt nguyên vật liệu, không dùng điện thoại riêng',
    matchWords: ['tài sản', 'thiết bị', 'điện thoại', 'máy', 'nguyên liệu', 'hỏng', 'mất', 'thất thoát', 'bảo quản', 'công cụ'],
  },
];

interface IncidentFormModalProps {
  show: boolean;
  onClose: () => void;
  staffList: Staff[];
  questions: Question[];
  lines: DepartmentLine[];
  onAddIncident: (incident: IncidentRecord) => void;
  isManager: boolean;
  initialTargetId?: string;
  initialType?: IncidentType;
  params?: ParameterConfig;
  currentUser?: AuthUser | null;
  onViewSubmittedList?: () => void;
}

export const IncidentFormModal: React.FC<IncidentFormModalProps> = ({
  show,
  onClose,
  staffList,
  questions,
  lines,
  onAddIncident,
  isManager,
  initialTargetId,
  initialType,
  params,
  currentUser,
  onViewSubmittedList,
}) => {
  if (!show) return null;

  const policyRulesList = (params?.policyRules && params.policyRules.length > 0) 
    ? params.policyRules 
    : initialPolicyRules;

  // Form State: 3 phân hệ độc lập: 'ghi_nhan' | 'vi_pham' | 'noi_quy'
  const isInitialPolicy = initialType === 'noi_quy';
  const isInitialGhiNhan = initialType === 'ghi_nhan';
  const [formCategory, setFormCategory] = useState<'policy' | 'work'>(isInitialPolicy ? 'policy' : 'work');
  const [workEvalMode, setWorkEvalMode] = useState<'plus' | 'minus'>(isInitialGhiNhan ? 'plus' : 'minus');
  const [type, setType] = useState<IncidentType>(initialType || 'vi_pham');
  const [reporterId, setReporterId] = useState<string>(currentUser?.id || staffList[0]?.id || '');
  const [targetId, setTargetId] = useState<string>(initialTargetId || staffList[1]?.id || staffList[0]?.id || '');
  const [criteriaScope, setCriteriaScope] = useState<string>('Chung'); // 'Chung', 'Department', 'Management', or 'Boundary'
  const [policyRuleId, setPolicyRuleId] = useState<string>(() => (policyRulesList[0]?.id || 'NQ01'));
  const [selectedKeyword, setSelectedKeyword] = useState<string>('all');
  const [submittedSuccess, setSubmittedSuccess] = useState<IncidentRecord | null>(null);

  React.useEffect(() => {
    if (show) {
      if (currentUser?.id) setReporterId(currentUser.id);
      if (initialTargetId) setTargetId(initialTargetId);
      
      if (initialType === 'noi_quy') {
        setFormCategory('policy');
        setType('noi_quy');
        const firstRule = policyRulesList.find(r => r.active !== false) || policyRulesList[0];
        if (firstRule) {
          setPolicyRuleId(firstRule.id);
          setTitle(`[${firstRule.code}] ${firstRule.title}`);
          setDescription(firstRule.description);
        }
      } else if (initialType === 'ghi_nhan') {
        setFormCategory('work');
        setWorkEvalMode('plus');
        setType('ghi_nhan');
        setTitle('');
        setDescription('');
      } else {
        // Mặc định hoặc 'vi_pham' (Vi phạm công việc)
        setFormCategory('work');
        setWorkEvalMode('minus');
        setType('vi_pham');
        setTitle('');
        setDescription('');
      }

      setSelectedKeyword('all');
      setSearchCriteriaTerm('');
      setSubmittedSuccess(null);
    }
  }, [show, initialTargetId, initialType, currentUser]);
  const [questionId, setQuestionId] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [severity, setSeverity] = useState<SeverityLevel>('Vừa');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('Kích thước hình ảnh phải dưới 10MB! Vui lòng chọn tệp nhỏ hơn 10MB.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
          setImagePreview(dataUrl);
        } else {
          setImagePreview(event.target?.result as string);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
  };

  const targetStaff = staffList.find(s => s.id === targetId) || staffList[0];
  const isTargetManager = targetStaff ? isManagementRole(targetStaff) : false;

  // Xác định chính xác người dùng đang lập phiếu: 'ghi_nhan' | 'vi_pham' | 'noi_quy'
  const currentEvalType: IncidentType = formCategory === 'policy'
    ? 'noi_quy'
    : workEvalMode === 'minus'
      ? 'vi_pham'
      : 'ghi_nhan';

  // Dynamically filter questions based on Scope & Target's Department & Management Role
  const availableQuestions = questions.filter(q => {
    // 1. Phân loại chuẩn xác: Khi ghi nhận CHỈ HIỆN tiêu chí ghi nhận, và ngược lại
    if (currentEvalType === 'vi_pham' && q.measurementType !== 'vi phạm') return false;
    if (currentEvalType === 'ghi_nhan' && q.measurementType !== 'ghi nhận') return false;

    // 2. Phân loại theo phạm vi tiêu chí
    const isRG = (
      q.groupCode.startsWith('RG') ||
      q.id.startsWith('RG') ||
      q.category === 'Ranh giới' ||
      (q.groupName && q.groupName.toUpperCase().includes('RANH GIỚI'))
    );

    // CRITICAL: RG sẽ không nằm trong Khung chung vì nó nằm trong "Ranh giới không thoả hiệp"
    if (criteriaScope === 'Boundary') {
      return isRG;
    }

    // RG tuyệt đối KHÔNG thuộc Khung chung, Chuyên môn, hay Quản lý
    if (isRG) {
      return false;
    }

    if (criteriaScope === 'Chung') {
      return (
        (q.category === 'Chung' || q.groupCode.startsWith('VH') || q.groupCode.startsWith('TC') || q.groupCode.startsWith('NL')) &&
        !q.groupCode.startsWith('Q')
      );
    } else if (criteriaScope === 'Department') {
      // Must match Target Staff's specific Department Line!
      return q.lineId === targetStaff?.line || q.groupCode.startsWith('B') || q.groupCode.startsWith('C') || q.groupCode.startsWith('N') || q.groupCode.startsWith('HC') || q.groupCode.startsWith('PC');
    } else if (criteriaScope === 'Management') {
      return q.groupCode.startsWith('Q') || (q.scope && (q.scope.includes('Trưởng') || q.scope.includes('Quản lý')));
    }
    return true;
  });

  const [searchCriteriaTerm, setSearchCriteriaTerm] = useState<string>('');

  const filteredPolicyRules = policyRulesList.filter(rule => {
    if (rule.active === false) return false;
    if (selectedKeyword === 'all') return true;
    const kw = INCIDENT_KEYWORDS.find(k => k.id === selectedKeyword);
    if (!kw || kw.matchWords.length === 0) return true;
    const targetText = `${rule.code} ${rule.title} ${rule.description} ${rule.category}`.toLowerCase();
    return kw.matchWords.some(w => targetText.includes(w.toLowerCase()));
  });

  const handleSelectKeyword = (kwId: string) => {
    setSelectedKeyword(kwId);
    setSearchCriteriaTerm('');
    if (formCategory === 'policy' && kwId !== 'all') {
      const kw = INCIDENT_KEYWORDS.find(k => k.id === kwId);
      if (kw) {
        const matched = policyRulesList.filter(rule => {
          if (rule.active === false) return false;
          const targetText = `${rule.code} ${rule.title} ${rule.description} ${rule.category}`.toLowerCase();
          return kw.matchWords.some(w => targetText.includes(w.toLowerCase()));
        });
        if (matched.length > 0) {
          const first = matched[0];
          setPolicyRuleId(first.id);
          setTitle(`[${first.code}] ${first.title}`);
          setDescription(first.description);
        }
      }
    }
  };

  const filteredAvailableQuestions = availableQuestions.filter(q => {
    if (selectedKeyword !== 'all') {
      const kw = INCIDENT_KEYWORDS.find(k => k.id === selectedKeyword);
      if (kw && kw.matchWords.length > 0) {
        const qText = `${q.id} ${q.groupCode} ${q.groupName} ${q.text} ${q.scope || ''}`.toLowerCase();
        const hasMatch = kw.matchWords.some(w => qText.includes(w.toLowerCase()));
        if (!hasMatch) return false;
      }
    }
    if (!searchCriteriaTerm) return true;
    const term = searchCriteriaTerm.toLowerCase().trim();
    return (
      q.id.toLowerCase().includes(term) ||
      q.groupCode.toLowerCase().includes(term) ||
      (q.groupName && q.groupName.toLowerCase().includes(term)) ||
      q.text.toLowerCase().includes(term)
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reporterId || !targetId) {
      alert('Vui lòng chọn người đánh giá và nhân sự được đánh giá!');
      return;
    }

    const isPolicy = formCategory === 'policy';
    const isMinusWork = formCategory === 'work' && workEvalMode === 'minus';

    // Bắt buộc bước 5: Phải chọn tiêu chí (với Đánh giá công việc) hoặc điều khoản (với Nội quy)
    if (!isPolicy && !questionId) {
      alert('⚠️ Bước 5 là bắt buộc: Vui lòng chọn tiêu chí đánh giá từ danh sách!');
      return;
    }
    if (isPolicy && !policyRuleId) {
      alert('⚠️ Bước 5 là bắt buộc: Vui lòng chọn điều khoản nội quy vi phạm!');
      return;
    }

    // Bắt buộc bước 6: Phải nhập nội dung chi tiết
    if (!description.trim()) {
      alert('⚠️ Bước 6 là bắt buộc: Vui lòng nhập nội dung chi tiết diễn biến sự việc hoặc lỗi vi phạm!');
      return;
    }

    const reporter = staffList.find(s => s.id === reporterId);
    const target = staffList.find(s => s.id === targetId);
    const selectedQ = questions.find(q => q.id === questionId);
    const selectedPolicyRule = policyRulesList.find(r => r.id === policyRuleId);

    const isBoundaryRecord = !isPolicy && (criteriaScope === 'Boundary' || (selectedQ && selectedQ.groupCode.startsWith('RG')));

    // Configured Points from Parameters
    const recMin = params?.recMinorPoints ?? 0.5;
    const recMod = params?.recModeratePoints ?? 1.0;
    const recMaj = params?.recMajorPoints ?? 1.5;

    const vioMin = params?.vioMinorPoints ?? -0.5;
    const vioMod = params?.vioModeratePoints ?? -0.5;
    const vioMaj = params?.vioMajorPoints ?? -1.0;
    const vioBou = params?.vioBoundaryPoints ?? -1.5;

    const impactPoints = isPolicy 
      ? 0 
      : isMinusWork
        ? (isBoundaryRecord ? vioBou : severity === 'Nghiêm trọng' ? vioMaj : severity === 'Vừa' ? vioMod : vioMin)
        : (isBoundaryRecord ? recMaj : severity === 'Nghiêm trọng' ? recMaj : severity === 'Vừa' ? recMod : recMin);

    const recordType: IncidentType = isPolicy ? 'noi_quy' : (isMinusWork ? 'vi_pham' : 'ghi_nhan');

    let formattedTitle = title;
    if (isPolicy) {
      formattedTitle = selectedPolicyRule 
        ? `[${selectedPolicyRule.code}] ${selectedPolicyRule.title}`
        : (title || 'Vi phạm nội quy');
    } else {
      const autoTitle = selectedQ ? selectedQ.text : (description.length > 50 ? `${description.substring(0, 50)}...` : description);
      if (isBoundaryRecord) {
        formattedTitle = isMinusWork ? `[RANH GIỚI ĐỎ ⚠️] ${autoTitle}` : `[KHEN THƯỞNG RANH GIỚI 🌟] ${autoTitle}`;
      } else {
        formattedTitle = isMinusWork ? `[NHẮC NHỞ CHUYÊN MÔN 📢] ${autoTitle}` : autoTitle;
      }
    }

    const now = new Date();
    const realtimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;

    const mappedSeverity: SeverityLevel = isPolicy
      ? (selectedPolicyRule?.severity === 'Rất nghiêm trọng' ? 'Nghiêm trọng' : (selectedPolicyRule?.severity as SeverityLevel) || severity)
      : severity;

    const newRecord: IncidentRecord = {
      id: `INC-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      type: recordType,
      reporterId,
      reporterName: reporter ? reporter.name : reporterId,
      targetId,
      targetName: target ? target.name : targetId,
      targetRole: target ? target.role : 'Nhân sự',
      questionId: !isPolicy ? (questionId || undefined) : undefined,
      policyRuleId: isPolicy ? (policyRuleId || undefined) : undefined,
      groupCode: isPolicy ? (selectedPolicyRule?.code || 'NQ') : (selectedQ ? selectedQ.groupCode : isBoundaryRecord ? 'RG1' : undefined),
      title: formattedTitle,
      description,
      severity: mappedSeverity,
      date: realtimeStr,
      createdAt: now.toISOString(),
      status: recordType === 'ghi_nhan' ? 'Đang xem xét' : 'Đã ghi nhận',
      impactPoints,
      policyPenaltyPoints: isPolicy
        ? (selectedPolicyRule ? selectedPolicyRule.penaltyPoints : 5)
        : undefined,
      imageUrl: imagePreview || undefined,
    };

    onAddIncident(newRecord);
    setSubmittedSuccess(newRecord);
    setTitle('');
    setDescription('');
    setImagePreview(null);
  };

  const handleSelectQuestion = (qId: string) => {
    setQuestionId(qId);
    const q = questions.find(item => item.id === qId);
    if (q) {
      setTitle(q.text.length > 55 ? `${q.text.substring(0, 55)}...` : q.text);
      // Giữ trống ô nội dung chi tiết bước 6 theo yêu cầu, không tự điền
    }
  };

  return (
    <div className="bottom-sheet animate-fadeIn">
      <div className="bottom-sheet-content space-y-4 max-h-[92vh] overflow-y-auto">
        
        {/* Render Success Screen if ticket submitted */}
        {submittedSuccess ? (
          <div className="space-y-4 text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#2D6A4F] mx-auto flex items-center justify-center text-3xl shadow-sm border border-emerald-300">
              🎉
            </div>
            
            <div className="space-y-1">
              <h2 className="text-lg font-black font-heading text-[#1B4332]">
                Lập Phiếu Thành Công!
              </h2>
              <p className="text-xs text-slate-600 font-medium px-4">
                Phiếu của bạn đã được ghi nhận thành công vào hệ thống.
              </p>
            </div>

            {/* Incident Summary Card */}
            {(() => {
              const isSubPolicy = submittedSuccess.type === 'noi_quy' || Boolean(submittedSuccess.policyRuleId);
              const isSubVio = submittedSuccess.type === 'vi_pham';
              return (
                <div className="bg-[#EDEAE3]/60 p-4 rounded-2xl border border-emerald-900/10 text-left space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-emerald-900/10 pb-2">
                    <span className="font-mono font-bold text-[11px] text-slate-600 bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                      {submittedSuccess.id}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                      isSubPolicy
                        ? 'bg-amber-100 text-amber-950 border border-amber-300'
                        : isSubVio
                        ? 'bg-rose-100 text-rose-900 border border-rose-300'
                        : 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                    }`}>
                      {isSubPolicy 
                        ? '📖 BIÊN BẢN NỘI QUY' 
                        : isSubVio 
                        ? '⚠️ VI PHẠM CÔNG VIỆC' 
                        : '🌟 PHIẾU KHEN THƯỞNG'}
                    </span>
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Người nhận phản hồi:</p>
                    <p className="font-extrabold text-[#1B4332] text-sm">
                      {submittedSuccess.targetName} ({submittedSuccess.targetRole})
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Nội dung ghi nhận:</p>
                    <p className="font-bold text-[#2D3748]">{submittedSuccess.title}</p>
                  </div>

                  <div className="pt-1 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Mức tác động:</span>
                    <span className={`font-black text-sm ${
                      isSubPolicy 
                        ? 'text-amber-800' 
                        : isSubVio 
                        ? 'text-rose-600' 
                        : 'text-emerald-700'
                    }`}>
                      {isSubPolicy
                        ? `-${submittedSuccess.policyPenaltyPoints || 10}đ (Quỹ 100đ)`
                        : isSubVio
                        ? `${submittedSuccess.impactPoints}đ (Thang 5.0đ)`
                        : `+${submittedSuccess.impactPoints}đ (Thang 5.0đ)`}
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* Notification Alert Info */}
            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-left text-xs text-emerald-900 space-y-1">
              <p className="font-bold flex items-center space-x-1">
                <span>🔔 Thông báo người nhận:</span>
              </p>
              <p className="text-[11px] leading-relaxed text-emerald-800">
                Hệ thống đã tự động gửi thông báo đến nhân sự <strong>{submittedSuccess.targetName}</strong>. 
                {submittedSuccess.type === 'noi_quy' 
                  ? ' Bạn ấy đã nhận thông báo vi phạm quy định nội quy và có 48 giờ để xem và gửi ý kiến/kháng nghị.' 
                  : submittedSuccess.type === 'vi_pham'
                  ? ' Bạn ấy đã nhận thông báo vi phạm tiêu chuẩn công việc và có 48 giờ để xem và gửi ý kiến/kháng nghị.'
                  : ' Phiếu khen thưởng đã được gửi thành công đến nhân sự.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setSubmittedSuccess(null);
                  if (onViewSubmittedList) onViewSubmittedList();
                }}
                className="w-full py-3 px-4 rounded-xl bg-[#2D6A4F] text-white font-extrabold text-xs shadow-md hover:bg-[#1B4332] transition-all flex items-center justify-center space-x-2"
              >
                <span>📝 Xem Danh Sách Phiếu Tôi Đã Lập</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSubmittedSuccess(null)}
                  className="py-2.5 px-3 rounded-xl bg-emerald-100 text-[#1B4332] font-bold text-xs hover:bg-emerald-200 transition-all"
                >
                  ➕ Lập phiếu khác
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setSubmittedSuccess(null);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-all"
                >
                  ✕ Đóng
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-extrabold font-heading text-[#1B4332] flex items-center gap-2">
                  {formCategory === 'policy' ? (
                    <>
                      <BookOpen className="w-5 h-5 text-amber-700" />
                      <span>Phiếu Ghi Nhận Nội Quy Lao Động (Quỹ 100đ)</span>
                    </>
                  ) : workEvalMode === 'minus' ? (
                    <>
                      <ShieldAlert className="w-5 h-5 text-rose-600" />
                      <span>Biên Bản Vi Phạm Công Việc (Thang 5.0đ)</span>
                    </>
                  ) : (
                    <>
                      <Award className="w-5 h-5 text-emerald-600" />
                      <span>Phiếu Ghi Nhận & Tuyên Dương (Thang 5.0đ)</span>
                    </>
                  )}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 font-bold flex items-center justify-center text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          
          {/* 1. Universal 3-way Category Switcher */}
          <div className="space-y-1.5">
            <label className="block text-slate-700 font-extrabold font-heading text-xs">
              1. Thể Loại Phản Hồi (Chọn 1 trong 3 nhóm độc lập) <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {/* Option 1: Ghi nhận */}
              <button
                type="button"
                onClick={() => {
                  setFormCategory('work');
                  setWorkEvalMode('plus');
                  setType('ghi_nhan');
                  if (criteriaScope === 'Boundary') setCriteriaScope('Chung');
                  setQuestionId('');
                  setTitle('');
                  setDescription('');
                }}
                className={`p-2.5 sm:p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  formCategory === 'work' && workEvalMode === 'plus'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/30'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center gap-1 text-xs font-black">
                  <Award className="w-4 h-4" />
                  <span>Ghi Nhận</span>
                </div>
                <span className={`text-[10px] font-bold ${
                  formCategory === 'work' && workEvalMode === 'plus' ? 'text-emerald-100' : 'text-emerald-700'
                }`}>
                  + Điểm 5.0đ
                </span>
              </button>

              {/* Option 2: Vi phạm công việc */}
              <button
                type="button"
                onClick={() => {
                  setFormCategory('work');
                  setWorkEvalMode('minus');
                  setType('vi_pham');
                  setQuestionId('');
                  setTitle('');
                  setDescription('');
                }}
                className={`p-2.5 sm:p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  formCategory === 'work' && workEvalMode === 'minus'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-500/30'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50 hover:border-rose-300'
                }`}
              >
                <div className="flex items-center gap-1 text-xs font-black">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Vi Phạm CV</span>
                </div>
                <span className={`text-[10px] font-bold ${
                  formCategory === 'work' && workEvalMode === 'minus' ? 'text-rose-100' : 'text-rose-700'
                }`}>
                  - Điểm 5.0đ
                </span>
              </button>

              {/* Option 3: Nội quy */}
              <button
                type="button"
                onClick={() => {
                  setFormCategory('policy');
                  setType('noi_quy');
                  const firstRule = policyRulesList.find(r => r.active !== false) || policyRulesList[0];
                  if (firstRule) {
                    setPolicyRuleId(firstRule.id);
                    setTitle(`[${firstRule.code}] ${firstRule.title}`);
                    setDescription(firstRule.description);
                  }
                }}
                className={`p-2.5 sm:p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  formCategory === 'policy'
                    ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-md ring-2 ring-amber-300 font-black'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-50 hover:border-amber-300'
                }`}
              >
                <div className="flex items-center gap-1 text-xs font-black">
                  <BookOpen className="w-4 h-4 text-amber-900" />
                  <span>Nội Quy</span>
                </div>
                <span className={`text-[10px] font-bold ${
                  formCategory === 'policy' ? 'text-amber-950' : 'text-amber-800'
                }`}>
                  Quỹ 100đ
                </span>
              </button>
            </div>
          </div>

          {/* 2. Select Reporter */}
          <div>
            <label className="block text-slate-700 font-extrabold font-heading mb-1">
              2. Người Lập (Bạn) <span className="text-rose-500">*</span>
            </label>
            {currentUser && !isSystemAdmin(currentUser) ? (
              <div className="w-full p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl text-[#1B4332] font-black text-xs flex items-center justify-between">
                <span>
                  <strong>[{currentUser.id}]</strong> {currentUser.name} ({currentUser.role})
                </span>
                <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                  Bạn (Tài khoản đang đăng nhập)
                </span>
              </div>
            ) : (
              <select
                value={reporterId}
                onChange={(e) => setReporterId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#2D3748] font-medium"
              >
                {staffList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.id} - {s.name} ({s.role})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* 3. Select Target (Any Employee) */}
          <div>
            <label className="block text-slate-700 font-extrabold font-heading mb-1">
              3. Đối Tượng Được Lập (Bất kỳ ai, kể cả Cấp trên / Quản lý) <span className="text-rose-500">*</span>
            </label>
            <select
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              className="w-full p-2.5 bg-[#EDEAE3] border border-emerald-900/10 rounded-xl text-[#1B4332] font-black"
            >
              {staffList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — {s.role} ({s.department})
                </option>
              ))}
            </select>

            {/* Management Role Status Notice */}
            <div className="mt-1.5 p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-[11px]">
              <div className="flex items-center space-x-1.5">
                {isTargetManager ? (
                  <ShieldCheck className="w-4 h-4 text-[#2D6A4F] shrink-0" />
                ) : (
                  <UserCheck className="w-4 h-4 text-slate-500 shrink-0" />
                )}
                <span className="font-semibold text-slate-700">Chức vụ của {targetStaff?.name}:</span>
              </div>

              <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                isTargetManager ? 'bg-[#1B4332] text-[#52B788]' : 'bg-slate-200 text-slate-700'
              }`}>
                {isTargetManager ? 'Bị tác động Ngạch Quản lý (30%)' : 'KHÔNG tác động Ngạch Quản lý (0%)'}
              </span>
            </div>
          </div>

          {/* Quick Keyword Group Filter (Nhóm Từ Khóa Gợi Ý Nhanh) */}
          <div className="space-y-1.5 p-3 rounded-2xl bg-[#EDEAE3]/70 border border-emerald-900/10">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <span className="font-extrabold text-[#1B4332]">🏷️ Nhóm Từ Khóa Gợi Ý:</span>
                {selectedKeyword !== 'all' && (
                  <span className="text-[10px] bg-[#1B4332] text-[#52B788] px-2 py-0.5 rounded-full font-black">
                    {INCIDENT_KEYWORDS.find(k => k.id === selectedKeyword)?.name}
                  </span>
                )}
              </span>
              {selectedKeyword !== 'all' && (
                <button
                  type="button"
                  onClick={() => handleSelectKeyword('all')}
                  className="text-[10px] text-emerald-800 hover:text-emerald-950 font-bold underline cursor-pointer"
                >
                  ✕ Xem tất cả
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {INCIDENT_KEYWORDS.map((kw) => {
                const isSelected = selectedKeyword === kw.id;
                return (
                  <button
                    key={kw.id}
                    type="button"
                    onClick={() => handleSelectKeyword(kw.id)}
                    className={`shrink-0 px-2.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1 border ${
                      isSelected
                        ? 'bg-[#1B4332] text-white border-[#1B4332] shadow-sm ring-2 ring-[#2D6A4F]/30 scale-102'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-emerald-50/70 hover:border-emerald-300'
                    }`}
                  >
                    <span>{kw.icon}</span>
                    <span>{kw.name}</span>
                  </button>
                );
              })}
            </div>
            {selectedKeyword !== 'all' && (
              <p className="text-[10px] text-[#2D6A4F] font-medium italic pt-0.5">
                💡 {INCIDENT_KEYWORDS.find(k => k.id === selectedKeyword)?.description}
              </p>
            )}
          </div>

          {/* 4 & 5. SELECT CRITERIA (BIÊN BẢN NỘI QUY (100đ) VS ĐÁNH GIÁ CÔNG VIỆC (5.0đ)) */}
          {formCategory === 'policy' ? (
            /* DÀNH CHO NỘI QUY: HIỂN THỊ CÁC NỘI QUY (HỖ TRỢ LỌC TỪ KHÓA) */
            <div className="space-y-3 p-3.5 bg-amber-50/70 border border-amber-300 rounded-2xl">
              <div className="flex items-center justify-between">
                <label className="block text-amber-950 font-extrabold font-heading text-xs flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-amber-700" />
                  <span>4. Chọn Điều Khoản Nội Quy Lao Động (Thang 100đ)</span>
                </label>
                <span className="text-[10px] text-amber-900 font-bold bg-white px-2 py-0.5 rounded-full border border-amber-200">
                  {filteredPolicyRules.length} Quy định {selectedKeyword !== 'all' ? 'phù hợp' : ''}
                </span>
              </div>

              {/* Quick Clickable Suggestions for Policy Rules when keyword selected */}
              {selectedKeyword !== 'all' && filteredPolicyRules.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-rose-800 uppercase">
                    Quy định khớp từ khóa "{INCIDENT_KEYWORDS.find(k => k.id === selectedKeyword)?.name}":
                  </p>
                  <div className="space-y-1 max-h-36 overflow-y-auto">
                    {filteredPolicyRules.map(r => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => {
                          setPolicyRuleId(r.id);
                          setTitle(`[${r.code}] ${r.title}`);
                          setDescription(r.description);
                        }}
                        className={`w-full text-left p-2 rounded-xl border text-xs transition-all cursor-pointer flex items-start justify-between gap-2 ${
                          policyRuleId === r.id
                            ? 'bg-rose-100 border-rose-400 text-rose-950 font-bold shadow-xs'
                            : 'bg-white border-rose-200 text-slate-700 hover:bg-rose-50'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[10px] font-black px-1.5 py-0.2 rounded bg-rose-200 text-rose-900">{r.code}</span>
                            <span className="text-[11px] font-extrabold line-clamp-1">{r.title}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{r.description}</p>
                        </div>
                        <span className="shrink-0 font-mono text-[10px] font-black text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                          -{r.penaltyPoints}đ
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <select
                value={policyRuleId}
                onChange={(e) => {
                  const rId = e.target.value;
                  setPolicyRuleId(rId);
                  const r = policyRulesList.find(item => item.id === rId);
                  if (r) {
                    setTitle(`[${r.code}] ${r.title}`);
                    setDescription(r.description);
                  }
                }}
                className="w-full p-2.5 bg-white border border-rose-300 rounded-xl text-slate-900 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
              >
                <option value="">-- Chọn Điều Khoản Quy Định Vi Phạm --</option>
                {(filteredPolicyRules.length > 0 ? filteredPolicyRules : policyRulesList).map((rule) => (
                  <option key={rule.id} value={rule.id}>
                    [{rule.code}] {rule.title} (Trừ -{rule.penaltyPoints}đ • Mức {rule.severity})
                  </option>
                ))}
              </select>

              {/* Selected Rule Detail Box */}
              {policyRulesList.find(r => r.id === policyRuleId) && (
                <div className="p-3 bg-white rounded-xl border border-rose-200 space-y-1.5 text-xs">
                  {(() => {
                    const rule = policyRulesList.find(r => r.id === policyRuleId)!;
                    return (
                      <>
                        <div className="flex items-center justify-between font-extrabold text-rose-950 flex-wrap gap-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span>📋 [{rule.code}] {rule.title}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                              rule.track === 'Pháp quy & Kỷ luật'
                                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            }`}>
                              {rule.track === 'Pháp quy & Kỷ luật' ? '🔴 Ngạch 1: Pháp quy' : '🟢 Ngạch 2: Văn hóa'}
                            </span>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-mono font-black text-[11px]">
                            -{rule.penaltyPoints}đ Nội quy
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed font-medium">{rule.description}</p>
                        <div className="text-[10px] text-rose-800 font-semibold pt-1 border-t border-rose-100 flex items-center justify-between gap-2 flex-wrap">
                          <span>Phân loại: <strong>{rule.category}</strong></span>
                          <span>Biện pháp: <strong>{rule.enforcementMeasure}</strong></span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          ) : (
            /* DÀNH CHO ĐÁNH GIÁ CÔNG VIỆC: HIỂN THỊ TIÊU CHÍ CÔNG VIỆC (THANG 5.0) */
            <div className="space-y-3">
              {/* 4. Select Criteria Scope (Khung chung vs Ngạch riêng bộ phận vs Ranh giới) */}
              <div>
                <label className="block text-slate-700 font-extrabold font-heading mb-1">
                  4. Phạm Vi Tiêu Chí Đánh Giá (Thang 5.0) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={criteriaScope}
                  onChange={(e) => {
                    setCriteriaScope(e.target.value);
                    setQuestionId('');
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#1B4332] font-bold focus:outline-none focus:border-[#2D6A4F]"
                >
                  <option value="Chung">1. Khung chung (Văn hóa & Kỷ luật chung)</option>
                  <option value="Department">
                    2. Ngạch chuyên môn riêng của bộ phận: {targetStaff?.line}
                  </option>
                  {isTargetManager && (
                    <option value="Management">
                      3. Ngạch Quản lý (Chỉ áp dụng Quản lý trở lên)
                    </option>
                  )}
                  {currentEvalType === 'vi_pham' && (
                    <option value="Boundary">
                      4. Ranh Giới Không Thỏa Hiệp ⚠️ (Vi phạm ranh giới đỏ)
                    </option>
                  )}
                </select>

                {criteriaScope === 'Boundary' && (
                  <div className="mt-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-[11px] text-rose-900 space-y-1">
                    <p className="font-bold flex items-center space-x-1.5 text-rose-800">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>⚠️ Ranh Giới Không Thỏa Hiệp (Độc lập khỏi Khung chung):</span>
                    </p>
                    <p className="text-[10px] text-slate-700 leading-tight">
                      Quy định các hành vi vi phạm ranh giới đỏ (Trừ thẳng điểm / Chặn kết quả đánh giá).
                    </p>
                  </div>
                )}

                {criteriaScope !== 'Boundary' && (
                  <p className="text-[10px] text-[#2D6A4F] mt-1 font-medium italic">
                    💡 Nhân sự thuộc bộ phận <strong>{targetStaff?.line}</strong> sẽ chỉ chịu tác động bởi Ngạch chuyên môn của bộ phận này.
                  </p>
                )}
              </div>

              {/* 5. Select Question with Quick Search */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-slate-700 font-extrabold font-heading">
                    5. Chọn Tiêu Chí {currentEvalType === 'ghi_nhan' ? 'Ghi Nhận (Khen Thưởng)' : 'Nhắc Nhở (Vi Phạm)'} <span className="text-rose-500">*</span>
                  </label>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    currentEvalType === 'ghi_nhan'
                      ? 'text-emerald-800 bg-emerald-100 border border-emerald-300'
                      : 'text-amber-800 bg-amber-100 border border-amber-300'
                  }`}>
                    {filteredAvailableQuestions.length} tiêu chí {currentEvalType === 'ghi_nhan' ? 'ghi nhận' : 'nhắc nhở'}
                  </span>
                </div>

                {/* Quick Search Input Field */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#2D6A4F]" />
                  <input
                    type="text"
                    placeholder={`🔍 Tìm nhanh tiêu chí ${currentEvalType === 'ghi_nhan' ? 'ghi nhận (NL1, NL3...)' : 'nhắc nhở (VH1, TC1...)'}...`}
                    value={searchCriteriaTerm}
                    onChange={(e) => setSearchCriteriaTerm(e.target.value)}
                    className="w-full pl-9 pr-8 py-2.5 bg-[#EDEAE3]/70 border border-emerald-900/20 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#2D6A4F] font-medium"
                  />
                  {searchCriteriaTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchCriteriaTerm('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 font-bold p-1"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Dropdown Select */}
                <select
                  required
                  value={questionId}
                  onChange={(e) => handleSelectQuestion(e.target.value)}
                  className={`w-full p-2.5 bg-slate-50 border rounded-xl font-medium focus:outline-none focus:border-[#2D6A4F] ${
                    !questionId ? 'border-amber-300 text-slate-600' : 'border-slate-200 text-[#2D3748]'
                  }`}
                >
                  <option value="">-- [Bắt buộc] Chọn tiêu chí {currentEvalType === 'ghi_nhan' ? 'Ghi Nhận' : 'Nhắc Nhở'} từ danh sách --</option>
                  {filteredAvailableQuestions.map((q) => (
                    <option key={q.id} value={q.id}>
                      [{q.id}] [{q.measurementType === 'ghi nhận' ? '🌟 Ghi nhận' : '⚠️ Vi phạm'}] {q.groupCode}: {q.text}
                    </option>
                  ))}
                </select>

                {/* Quick Clickable Suggestions List */}
                {(searchCriteriaTerm || selectedKeyword !== 'all') && filteredAvailableQuestions.length > 0 && (
                  <div className="space-y-1 max-h-48 overflow-y-auto p-2 bg-emerald-50/80 rounded-xl border border-emerald-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-[#1B4332] font-black uppercase tracking-wider block">
                        🎯 {selectedKeyword !== 'all' ? `Tiêu chí khớp từ khóa "${INCIDENT_KEYWORDS.find(k => k.id === selectedKeyword)?.name}":` : 'Kết quả tìm kiếm:'}
                      </span>
                      <span className="text-[10px] text-emerald-800 font-bold">
                        {filteredAvailableQuestions.length} tiêu chí
                      </span>
                    </div>
                    {filteredAvailableQuestions.slice(0, 10).map((q) => (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => {
                          handleSelectQuestion(q.id);
                          setSearchCriteriaTerm('');
                        }}
                        className={`w-full text-left p-2 rounded-xl text-xs transition-all flex items-start justify-between gap-2 cursor-pointer ${
                          questionId === q.id 
                            ? 'bg-[#2D6A4F] text-white font-bold shadow-sm' 
                            : 'bg-white hover:bg-emerald-100/70 text-slate-800 border border-emerald-100'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className={`font-mono text-[10px] font-black px-1.5 py-0.2 rounded ${
                              questionId === q.id ? 'bg-white/20 text-white' : 'bg-emerald-100 text-[#1B4332]'
                            }`}>
                              {q.id}
                            </span>
                            {q.groupCode && (
                              <span className="text-[10px] opacity-75">[{q.groupCode}]</span>
                            )}
                          </div>
                          <p className="text-[11px] leading-snug font-medium line-clamp-2 mt-0.5">{q.text}</p>
                        </div>
                        {questionId === q.id && <Check className="w-4 h-4 shrink-0 text-emerald-300 mt-0.5" />}
                      </button>
                    ))}
                  </div>
                )}

                {(searchCriteriaTerm || selectedKeyword !== 'all') && filteredAvailableQuestions.length === 0 && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 text-center space-y-1">
                    <p className="font-bold">Không tìm thấy tiêu chí nào phù hợp trong phạm vi đang chọn.</p>
                    <p className="text-[10px] text-amber-700">
                      Vui lòng thử đổi "Phạm vi tiêu chí" (Khung chung / Ngạch bộ phận) hoặc chọn "✨ Tất cả".
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 6. Detailed Description & Violation Details */}
          <div>
            <label className="block text-slate-700 font-extrabold font-heading mb-1">
              6. Nội Dung Chi Tiết & Lỗi Vi Phạm / Ghi Nhận <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="Bắt buộc nhập: Ghi rõ diễn biến sự việc thực tế, lỗi vi phạm hoặc thành tích ghi nhận..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#2D3748] focus:outline-none focus:border-[#2D6A4F]"
            ></textarea>
          </div>

          {/* 8. Image Upload (Under 10MB) */}
          <div>
            <label className="block text-slate-700 font-extrabold font-heading mb-1">
              8. Đính Kèm Hình Ảnh Minh Chứng (Tùy chọn, tối đa 10MB) 🖼️
            </label>
            
            {imagePreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 p-2 space-y-2">
                <img 
                  src={imagePreview} 
                  alt="Minh chứng" 
                  className="w-full max-h-48 object-cover rounded-xl border border-slate-200"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="w-full py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-all flex items-center justify-center space-x-1"
                >
                  <span>🗑️ Xóa hình ảnh</span>
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 hover:border-[#2D6A4F] rounded-2xl cursor-pointer bg-slate-50 hover:bg-emerald-50/40 transition-all">
                <span className="text-xl mb-1">📷</span>
                <span className="text-xs font-bold text-[#1B4332]">Bấm để chọn hình ảnh minh chứng</span>
                <span className="text-[10px] text-slate-400 mt-0.5 font-medium">Hỗ trợ JPG, PNG, WEBP (Dung lượng &lt; 10MB)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Submit Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              className={`w-full py-3.5 rounded-2xl text-white font-extrabold font-heading text-sm shadow-md transition-all ${
                type === 'vi_pham' ? 'bg-[#DD6B20] hover:bg-[#c05621]' : 'bg-[#2D6A4F] hover:bg-[#1B4332]'
              }`}
            >
              {type === 'vi_pham' ? '📢 Lập Biên Bản Vi Phạm' : '🌟 Lập Phiếu Ghi Nhận'}
            </button>
          </div>

        </form>
      </>
    )}

      </div>
    </div>
  );
};
