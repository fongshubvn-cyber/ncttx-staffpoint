import React, { useState } from 'react';
import { Staff, IncidentRecord, ParameterConfig, AuthUser } from '../types';
import { getStaffPolicyScoreForPeriod, getPolicyHealthStatus } from '../utils/calculator';
import { 
  X, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  ThumbsUp, 
  HelpCircle, 
  ChevronRight, 
  FileText, 
  RotateCw,
  Clock,
  Award,
  AlertCircle
} from 'lucide-react';

interface PolicyHealthModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: Staff;
  periodKey: string;
  incidents: IncidentRecord[];
  params: ParameterConfig;
  currentUser: AuthUser | null;
  onAppealIncident?: (incidentId: string, reason: string) => void;
}

export const PolicyHealthModal: React.FC<PolicyHealthModalProps> = ({
  isOpen,
  onClose,
  staff,
  periodKey,
  incidents,
  params,
  currentUser,
  onAppealIncident,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'violations' | 'appeals'>('overview');
  const [appealModalIncId, setAppealModalIncId] = useState<string | null>(null);
  const [appealReasonText, setAppealReasonText] = useState<string>('');

  if (!isOpen || !staff) return null;

  const policyData = getStaffPolicyScoreForPeriod(staff, periodKey, incidents, params);
  const { policyScore, totalDeduction, violations, statusObj } = policyData;
  const defaultScore = params.defaultPolicyScore ?? 100;

  // Filter 48h appealable items
  const nowMs = Date.now();
  const appealableViolations = violations.filter(v => {
    if (v.status === 'Kháng nghị được chấp nhận' || v.status === 'Đang kháng nghị') return false;
    if (!v.createdAt) return true;
    const createdMs = new Date(v.createdAt).getTime();
    const diffHours = (nowMs - createdMs) / (1000 * 60 * 60);
    return diffHours <= 48;
  });

  const handleSendAppeal = (incId: string) => {
    if (!appealReasonText.trim()) {
      alert('Vui lòng nhập lý do kháng nghị chi tiết!');
      return;
    }
    if (onAppealIncident) {
      onAppealIncident(incId, appealReasonText.trim());
      alert('Đã gửi yêu cầu kháng nghị thành công! HR & Trưởng phòng sẽ xem xét trong 24h.');
      setAppealModalIncId(null);
      setAppealReasonText('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh] my-auto">
        
        {/* Top Header Bar (Matching TikTok Shop Account Health style) */}
        <div className="bg-[#1B4332] text-white p-4 sm:p-5 flex items-center justify-between relative shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white/10 flex items-center justify-center text-[#52B788] border border-white/15">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black font-heading tracking-tight flex items-center space-x-2">
                <span>Chi tiết Điểm tình trạng nội quy</span>
              </h2>
              <p className="text-xs text-emerald-200/90 font-medium">
                Nhân sự: <span className="font-bold text-white">{staff.name}</span> ({staff.id})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Main View Tabs */}
        <div className="flex items-center border-b border-slate-200 bg-[#EDEAE3]/50 px-4 pt-2 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 text-xs font-black transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-[#2D6A4F] text-[#1B4332] bg-white rounded-t-xl shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Tổng quan
          </button>

          <button
            onClick={() => setActiveTab('violations')}
            className={`px-4 py-2.5 text-xs font-black transition-all border-b-2 whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'violations'
                ? 'border-[#2D6A4F] text-[#1B4332] bg-white rounded-t-xl shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Hồ sơ vi phạm</span>
            {violations.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-white font-mono font-black">
                {violations.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('appeals')}
            className={`px-4 py-2.5 text-xs font-black transition-all border-b-2 whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'appeals'
                ? 'border-[#2D6A4F] text-[#1B4332] bg-white rounded-t-xl shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Kháng nghị (48h)</span>
            {appealableViolations.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-mono font-black">
                {appealableViolations.length}
              </span>
            )}
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          
          {activeTab === 'overview' && (
            <>
              {/* Status Banner Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 border border-emerald-200/80 shadow-xs space-y-3 relative overflow-hidden">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-black border ${statusObj.badgeClass}`}>
                        {statusObj.level}
                      </span>
                      {policyScore >= 80 && (
                        <span className="text-xs text-emerald-700 font-bold flex items-center space-x-1">
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>Xuất sắc</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed pt-1">
                      {statusObj.advice}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-3xl font-black font-mono text-[#1B4332]">
                      {policyScore}
                    </span>
                    <span className="text-xs font-bold text-slate-500 font-mono"> / {defaultScore}</span>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Điểm hiện tại</p>
                  </div>
                </div>

                {/* Score Progress Gauge Bar (Exact layout matching TikTok Shop screenshot) */}
                <div className="pt-2 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-500 font-mono">
                    <span>0</span>
                    <span>20</span>
                    <span>50</span>
                    <span>80 (Mặc định: 100)</span>
                    <span>100</span>
                  </div>

                  {/* Gradient score track */}
                  <div className="relative w-full h-3 rounded-full overflow-hidden bg-slate-200 flex p-0.5 border border-slate-300">
                    <div className="h-full bg-rose-500 w-[20%]" title="Đình chỉ (<20)"></div>
                    <div className="h-full bg-orange-400 w-[30%]" title="Nghiêm trọng (20-49)"></div>
                    <div className="h-full bg-amber-400 w-[30%]" title="Cần chú ý (50-79)"></div>
                    <div className="h-full bg-emerald-500 w-[20%]" title="Tốt (80-100)"></div>

                    {/* Score Indicator Pointer Arrow */}
                    <div 
                      className="absolute top-0 bottom-0 w-2.5 bg-slate-900 border-2 border-white rounded-full shadow-md transition-all duration-500 -ml-1.25"
                      style={{ left: `${Math.max(2, Math.min(98, policyScore))}%` }}
                    />
                  </div>

                  {/* Score legend breakdown */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
                    <div className="flex items-center space-x-1.5 text-slate-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                      <span><strong>Tốt:</strong> 80 - 100</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-slate-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                      <span><strong>Khá:</strong> 50 - 79</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-slate-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-400 shrink-0" />
                      <span><strong>Kém:</strong> 20 - 49</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-slate-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                      <span><strong>Đình chỉ:</strong> &lt;20</span>
                    </div>
                  </div>
                </div>

                {/* Explanation text box */}
                <div className="p-3 bg-white/80 rounded-xl border border-emerald-900/10 text-xs text-slate-600 space-y-1">
                  <p className="font-bold text-[#1B4332]">Mô tả quy tắc điểm nội quy:</p>
                  <p className="leading-relaxed text-[11px]">
                    Mỗi nhân sự khởi tạo mặc định <strong>100 điểm nội quy</strong>. Khi vi phạm bất kỳ nội quy nào trong 10 nội quy công ty, điểm sẽ bị trừ tương ứng mức độ severity. Khi điểm giảm còn 79, 49 hoặc dưới 20, các biện pháp cưỡng chế/xử lý tương ứng sẽ tự động kích hoạt.
                  </p>
                </div>
              </div>

              {/* Action Needed Card */}
              <div className="space-y-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                  <AlertCircle className="w-4 h-4 text-[#2D6A4F]" />
                  <span>Cần Hành Động</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1 hover:border-emerald-300 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-[#1B4332]">Bài kiểm tra / Đào tạo lại</span>
                      <span className="font-mono font-bold text-slate-400">0 &gt;</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Hoàn thành bài kiểm tra nội quy để được cộng lại điểm tình trạng.</p>
                  </div>

                  <div 
                    onClick={() => setActiveTab('appeals')}
                    className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1 hover:border-amber-300 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-[#1B4332]">Vi phạm có thể khiếu nại (48h)</span>
                      <span className="font-mono font-bold text-amber-600">{appealableViolations.length} &gt;</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Kháng nghị hình phạt vi phạm trong vòng 48h để khôi phục điểm.</p>
                  </div>
                </div>
              </div>

              {/* Enforcement Table (Biện pháp cưỡng chế) */}
              <div className="space-y-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                  <ShieldAlert className="w-4 h-4 text-[#2D6A4F]" />
                  <span>Bảng Mốc Điểm & Biện Pháp Cưỡng Chế / Xử Lý</span>
                </h3>

                <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs bg-white shadow-2xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#EDEAE3] text-[#1B4332] font-black border-b border-slate-200">
                        <th className="p-3">Trạng thái</th>
                        <th className="p-3 text-center">Điểm</th>
                        <th className="p-3">Biện pháp cưỡng chế / xử lý áp dụng</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr className={policyScore >= 80 ? 'bg-emerald-50/60 font-bold' : ''}>
                        <td className="p-3 font-extrabold text-emerald-700">Tốt</td>
                        <td className="p-3 text-center font-mono font-extrabold">&ge; 80</td>
                        <td className="p-3 text-slate-700">• Không cưỡng chế. (Hoạt động bình thường)</td>
                      </tr>
                      <tr className={policyScore >= 50 && policyScore < 80 ? 'bg-amber-50/60 font-bold' : ''}>
                        <td className="p-3 font-extrabold text-amber-700">Cần chú ý</td>
                        <td className="p-3 text-center font-mono font-extrabold">50 - 79</td>
                        <td className="p-3 text-slate-700 font-medium">
                          • Nhắc nhở ca làm việc & Tạm khóa đề xuất khen thưởng tháng.
                        </td>
                      </tr>
                      <tr className={policyScore >= 20 && policyScore < 50 ? 'bg-orange-50/60 font-bold' : ''}>
                        <td className="p-3 font-extrabold text-orange-700">Nghiêm trọng</td>
                        <td className="p-3 text-center font-mono font-extrabold">20 - 49</td>
                        <td className="p-3 text-slate-700 font-medium">
                          • Tạm đình chỉ ca làm việc 3 - 7 ngày.<br />
                          • Hạ 1 bậc làm việc (Hệ số P2 tháng).
                        </td>
                      </tr>
                      <tr className={policyScore < 20 ? 'bg-rose-50/60 font-bold' : ''}>
                        <td className="p-3 font-extrabold text-rose-700">Đình chỉ</td>
                        <td className="p-3 text-center font-mono font-extrabold">&lt; 20 / 0</td>
                        <td className="p-3 text-slate-700 font-medium">
                          • Đình chỉ công tác & Xem xét đơn phương chấm dứt hợp đồng lao động.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === 'violations' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-[#1B4332] font-heading">
                  Hồ Sơ Các Lần Vi Phạm Nội Quy (Kỳ {periodKey})
                </h3>
                <span className="text-xs text-slate-500 font-bold">
                  Tổng điểm bị trừ: <span className="text-rose-600 font-mono font-black">-{totalDeduction} điểm</span>
                </span>
              </div>

              {violations.length === 0 ? (
                <div className="p-8 text-center bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-[#2D6A4F] mx-auto" />
                  <p className="text-sm font-bold text-[#1B4332]">Không có vi phạm nội quy nào!</p>
                  <p className="text-xs text-slate-500">Bạn đang chấp hành cực kỳ tốt 10 nội quy Nhà Của Thời Thanh Xuân.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {violations.map((v) => (
                    <div key={v.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-700 border border-rose-200">
                              {v.policyRuleId || 'Vi phạm'}
                            </span>
                            <span className="text-xs font-bold text-slate-500">{v.date}</span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 mt-1">{v.title}</h4>
                        </div>

                        <span className="text-xs font-mono font-black text-rose-600 bg-rose-50 px-2.5 py-1 rounded-xl border border-rose-200 shrink-0">
                          -{v.policyPenaltyPoints || (v.severity === 'Nghiêm trọng' ? 20 : v.severity === 'Vừa' ? 10 : 5)} điểm
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed font-medium bg-[#EDEAE3]/40 p-2.5 rounded-xl">
                        {v.description}
                      </p>

                      <div className="flex items-center justify-between pt-1 text-xs">
                        <span className="text-slate-500">
                          Người ghi nhận: <strong className="text-slate-700">{v.reporterName}</strong>
                        </span>

                        {v.status === 'Đang kháng nghị' ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            ⏳ Đang chờ HR duyệt kháng nghị
                          </span>
                        ) : v.status === 'Kháng nghị được chấp nhận' ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            ✅ Kháng nghị thành công
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              setAppealModalIncId(v.id);
                              setAppealReasonText('');
                            }}
                            className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] shadow-2xs transition-all flex items-center space-x-1"
                          >
                            <RotateCw className="w-3 h-3" />
                            <span>Gửi Kháng Nghị (48h)</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'appeals' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-1">
                <span className="font-extrabold text-amber-900 flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Quy định Kháng Nghị Điểm Nội Quy trong 48 Giờ:</span>
                </span>
                <p className="text-amber-800 text-[11px] leading-relaxed">
                  Nếu bạn cho rằng quyết định trừ điểm nội quy chưa chính xác hoặc có lý do khách quan hợp lý, bạn có quyền gửi yêu cầu Kháng nghị trong vòng 48h tính từ lúc lập biên bản. HR & Trưởng phòng sẽ phản hồi giải quyết trong 24h làm việc.
                </p>
              </div>

              {appealableViolations.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-6">
                  Hiện tại không có biên bản vi phạm nào trong hạn 48h cần kháng nghị.
                </p>
              ) : (
                <div className="space-y-3">
                  {appealableViolations.map((v) => (
                    <div key={v.id} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-[#1B4332]">{v.title}</span>
                        <span className="text-[10px] font-bold text-slate-500">{v.date}</span>
                      </div>
                      <p className="text-xs text-slate-600">{v.description}</p>
                      
                      {appealModalIncId === v.id ? (
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-300 space-y-2 mt-2">
                          <label className="block text-xs font-bold text-slate-700">Lý do kháng nghị chi tiết:</label>
                          <textarea
                            value={appealReasonText}
                            onChange={(e) => setAppealReasonText(e.target.value)}
                            rows={3}
                            placeholder="Nhập rõ diễn biến sự việc, bằng chứng hoặc lý do khách quan..."
                            className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#2D6A4F]"
                          />
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => setAppealModalIncId(null)}
                              className="px-3 py-1 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold"
                            >
                              Hủy
                            </button>
                            <button
                              onClick={() => handleSendAppeal(v.id)}
                              className="px-4 py-1 rounded-xl bg-[#2D6A4F] text-white text-xs font-bold shadow-2xs"
                            >
                              Xác nhận gửi kháng nghị
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setAppealModalIncId(v.id);
                            setAppealReasonText('');
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-[#2D6A4F] text-white text-xs font-bold shadow-2xs flex items-center space-x-1.5"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                          <span>Viết Kháng Nghị Ngay</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#EDEAE3]/40 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#1B4332] text-white text-xs font-bold hover:bg-[#2D6A4F] transition-all shadow-sm"
          >
            Đóng cửa sổ
          </button>
        </div>

      </div>
    </div>
  );
};
