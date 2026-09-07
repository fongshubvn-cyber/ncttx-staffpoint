import React, { useState } from 'react';
import { Staff, Question, DepartmentLine, IncidentRecord, IncidentType, SeverityLevel, ParameterConfig, AuthUser } from '../types';
import { isManagementRole } from '../utils/calculator';
import { Trophy, Megaphone, Gift, Info, CheckCircle2, ShieldCheck, UserCheck } from 'lucide-react';

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

  // Form State
  const [type, setType] = useState<IncidentType>(initialType || 'ghi_nhan');
  const [reporterId, setReporterId] = useState<string>(currentUser?.id || staffList[0]?.id || '');
  const [targetId, setTargetId] = useState<string>(initialTargetId || staffList[1]?.id || staffList[0]?.id || '');
  const [criteriaScope, setCriteriaScope] = useState<string>('Chung'); // 'Chung', 'Department', 'Management', or 'Boundary'
  const [submittedSuccess, setSubmittedSuccess] = useState<IncidentRecord | null>(null);

  React.useEffect(() => {
    if (show) {
      if (currentUser?.id) setReporterId(currentUser.id);
      if (initialTargetId) setTargetId(initialTargetId);
      if (initialType) setType(initialType);
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

  // Dynamically filter questions based on Scope & Target's Department & Management Role
  const availableQuestions = questions.filter(q => {
    if (criteriaScope === 'Boundary') {
      return (
        q.groupCode.startsWith('RG') ||
        q.id.startsWith('RG') ||
        q.category === 'Ranh giới' ||
        (q.groupName && q.groupName.toUpperCase().includes('RANH GIỚI'))
      );
    }

    // Match type (vi phạm vs ghi nhận)
    if (type === 'vi_pham' && q.measurementType !== 'vi phạm') return false;
    if (type === 'ghi_nhan' && q.measurementType !== 'ghi nhận') return false;

    if (criteriaScope === 'Chung') {
      return q.category === 'Chung' || q.groupCode.startsWith('VH') || q.groupCode.startsWith('TC3') || q.groupCode.startsWith('NL');
    } else if (criteriaScope === 'Department') {
      // Must match Target Staff's specific Department Line!
      return q.lineId === targetStaff?.line || q.groupCode.startsWith('B') || q.groupCode.startsWith('C') || q.groupCode.startsWith('N') || q.groupCode.startsWith('HC') || q.groupCode.startsWith('PC');
    } else if (criteriaScope === 'Management') {
      return q.groupCode.startsWith('Q') || q.scope.includes('Trưởng') || q.scope.includes('Quản lý');
    }
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reporterId || !targetId || !description.trim()) {
      alert('Vui lòng điền đầy đủ nội dung chi tiết sự việc!');
      return;
    }

    const reporter = staffList.find(s => s.id === reporterId);
    const target = staffList.find(s => s.id === targetId);
    const selectedQ = questions.find(q => q.id === questionId);

    const isBoundaryRecord = criteriaScope === 'Boundary' || (selectedQ && selectedQ.groupCode.startsWith('RG'));

    // Configured Points from Parameters
    const recMin = params?.recMinorPoints ?? 0.5;
    const recMod = params?.recModeratePoints ?? 1.0;
    const recMaj = params?.recMajorPoints ?? 1.5;
    const vioMin = params?.vioMinorPoints ?? -0.2;
    const vioMod = params?.vioModeratePoints ?? -0.5;
    const vioMaj = params?.vioMajorPoints ?? -1.0;
    const vioBou = params?.vioBoundaryPoints ?? -1.5;

    const impactPoints = type === 'vi_pham' 
      ? (isBoundaryRecord ? vioBou : severity === 'Nghiêm trọng' ? vioMaj : severity === 'Vừa' ? vioMod : vioMin)
      : (isBoundaryRecord ? recMaj : severity === 'Nghiêm trọng' ? recMaj : severity === 'Vừa' ? recMod : recMin);

    const autoTitle = selectedQ ? selectedQ.text : (description.length > 50 ? `${description.substring(0, 50)}...` : description);

    const formattedTitle = isBoundaryRecord 
      ? (type === 'vi_pham' ? `[RANH GIỚI ĐỎ ⚠️] ${autoTitle}` : `[KHEN THƯỞNG RANH GIỚI 🌟] ${autoTitle}`)
      : autoTitle;

    const now = new Date();
    const realtimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;

    const newRecord: IncidentRecord = {
      id: `INC-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      type,
      reporterId,
      reporterName: reporter ? reporter.name : reporterId,
      targetId,
      targetName: target ? target.name : targetId,
      targetRole: target ? target.role : 'Nhân sự',
      questionId: questionId || undefined,
      groupCode: selectedQ ? selectedQ.groupCode : isBoundaryRecord ? 'RG1' : undefined,
      title: formattedTitle,
      description,
      severity: isBoundaryRecord && type === 'vi_pham' ? 'Nghiêm trọng' : severity,
      date: realtimeStr,
      createdAt: now.toISOString(),
      status: type === 'vi_pham' ? 'Đã ghi nhận' : 'Chờ HR duyệt',
      impactPoints,
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
      setDescription(q.text);
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
            <div className="bg-[#EDEAE3]/60 p-4 rounded-2xl border border-emerald-900/10 text-left space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-emerald-900/10 pb-2">
                <span className="font-mono font-bold text-[11px] text-slate-600 bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                  {submittedSuccess.id}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                  submittedSuccess.type === 'vi_pham'
                    ? 'bg-amber-100 text-[#DD6B20] border border-amber-300'
                    : 'bg-emerald-100 text-[#1B4332] border border-emerald-300'
                }`}>
                  {submittedSuccess.type === 'vi_pham' ? '📢 BIÊN BẢN VI PHẠM' : '🌟 PHIẾU KHEN THƯỞNG'}
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
                <span className="text-slate-500">Điểm tác động:</span>
                <span className={`font-black text-sm ${submittedSuccess.impactPoints > 0 ? 'text-[#2D6A4F]' : 'text-rose-600'}`}>
                  {submittedSuccess.impactPoints > 0 ? `+${submittedSuccess.impactPoints}` : submittedSuccess.impactPoints} điểm
                </span>
              </div>
            </div>

            {/* Notification Alert Info */}
            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-left text-xs text-emerald-900 space-y-1">
              <p className="font-bold flex items-center space-x-1">
                <span>🔔 Thông báo người nhận:</span>
              </p>
              <p className="text-[11px] leading-relaxed text-emerald-800">
                Hệ thống đã tự động gửi thông báo đến nhân sự <strong>{submittedSuccess.targetName}</strong>. 
                {submittedSuccess.type === 'vi_pham' ? ' Bạn ấy có 48 giờ để xem và gửi ý kiến/kháng nghị.' : ' Phiếu khen thưởng sẽ hiển thị sau khi duyệt.'}
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
                <h2 className="text-base font-extrabold font-heading text-[#1B4332]">
                  🎁 Lập Phiếu Khen Thưởng / Biên Bản Vi Phạm
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 font-bold flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          
          {/* 1. Toggle Type: Phiếu Khen Thưởng vs Biên Bản Vi Phạm */}
          <div>
            <label className="block text-slate-700 font-extrabold font-heading mb-1.5">
              1. Chọn Loại Phiếu <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('ghi_nhan')}
                className={`p-3 rounded-2xl border font-black font-heading flex items-center justify-center space-x-1.5 transition-all ${
                  type === 'ghi_nhan'
                    ? 'bg-[#2D6A4F] text-white border-[#2D6A4F] shadow-md ring-2 ring-[#2D6A4F]/30'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                <span>🌟 KHEN THƯỞNG</span>
              </button>

              <button
                type="button"
                onClick={() => setType('vi_pham')}
                className={`p-3 rounded-2xl border font-black font-heading flex items-center justify-center space-x-1.5 transition-all ${
                  type === 'vi_pham'
                    ? 'bg-[#DD6B20] text-white border-[#DD6B20] shadow-md ring-2 ring-[#DD6B20]/30'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                <span>📢 NHẮC NHỜ VI PHẠM</span>
              </button>
            </div>
          </div>

          {/* 2. Select Reporter */}
          <div>
            <label className="block text-slate-700 font-extrabold font-heading mb-1">
              2. Người Lập (Bạn) <span className="text-rose-500">*</span>
            </label>
            {currentUser && !currentUser.isAdmin ? (
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

          {/* 4. Select Criteria Scope (Khung chung vs Ngạch riêng bộ phận vs Ranh giới) */}
          <div>
            <label className="block text-slate-700 font-extrabold font-heading mb-1">
              4. Phạm Vi Tiêu Chí Áp Dụng <span className="text-rose-500">*</span>
            </label>
            <select
              value={criteriaScope}
              onChange={(e) => {
                setCriteriaScope(e.target.value);
                setQuestionId('');
              }}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#1B4332] font-bold focus:outline-none focus:border-[#2D6A4F]"
            >
              <option value="Chung">1. Khung chung (Áp dụng toàn công ty - 65% hoặc 50%)</option>
              <option value="Department">
                2. Ngạch chuyên môn riêng của bộ phận: {targetStaff?.line} (35% hoặc 20%)
              </option>
              {isTargetManager && (
                <option value="Management">
                  3. Ngạch Quản lý (Chỉ áp dụng Quản lý trở lên - 30%)
                </option>
              )}
              <option value="Boundary">
                4. Ranh Giới Không Thỏa Hiệp ⚠️ (Khen thưởng giữ ranh giới / Biên bản vi phạm ranh giới đỏ)
              </option>
            </select>

            {criteriaScope === 'Boundary' && (
              <div className="mt-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-[11px] text-rose-800 space-y-1">
                <p className="font-bold flex items-center space-x-1">
                  <span>⚠️ Ranh Giới Không Thỏa Hiệp (Zero-Tolerance):</span>
                </p>
                <p className="text-[10px] text-slate-700 leading-tight">
                  Tất cả vi phạm ranh giới đỏ (lấy hoàn cảnh khiếm thính bán hàng, nói quá sản phẩm, sai giá...) sẽ bị lập <strong>Biên bản xử lý nghiêm trọng (-1.5 điểm)</strong> hoặc <strong>Ghi nhận tuyên dương khen thưởng (+1.5 điểm)</strong> khi bảo vệ tính tử tế!
                </p>
              </div>
            )}

            {criteriaScope !== 'Boundary' && (
              <p className="text-[10px] text-[#2D6A4F] mt-1 font-medium italic">
                💡 Nhân sự thuộc bộ phận <strong>{targetStaff?.line}</strong> sẽ chỉ chịu tác động bởi Ngạch chuyên môn của bộ phận này.
              </p>
            )}
          </div>

          {/* 5. Select Question */}
          <div>
            <label className="block text-slate-700 font-extrabold font-heading mb-1">
              5. Chọn Tiêu Chí Cụ Thể
            </label>
            <select
              value={questionId}
              onChange={(e) => handleSelectQuestion(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#2D3748] font-medium focus:outline-none focus:border-[#2D6A4F]"
            >
              <option value="">-- Chọn tiêu chí cụ thể (Tùy chọn) --</option>
              {availableQuestions.map((q) => (
                <option key={q.id} value={q.id}>
                  [{q.id}] {q.groupCode}: {q.text}
                </option>
              ))}
            </select>
          </div>

          {/* 6. Detailed Description & Violation Details */}
          <div>
            <label className="block text-slate-700 font-extrabold font-heading mb-1">
              6. Nội Dung Chi Tiết & Lỗi Vi Phạm / Ghi Nhận <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Ghi rõ diễn biến sự việc thực tế, lỗi vi phạm hoặc thành tích ghi nhận..."
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
              {type === 'vi_pham' ? '📢 Lập Biên Bản Nhắc Nhở Vi Phạm' : '🌟 Lập Phiếu Ghi Nhận Khen Thưởng'}
            </button>
          </div>

        </form>
      </>
    )}

      </div>
    </div>
  );
};
