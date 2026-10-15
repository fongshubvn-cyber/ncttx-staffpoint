import React, { useState, useMemo } from 'react';
import { BaselinePoint, ParameterConfig, AuthUser, PolicyRule } from '../types';
import { initialPolicyRules } from '../data/seedData';
import { calculateTotalScore, calculateSalaryTier } from '../utils/calculator';
import { BarChart3, Sliders, Award, Calculator, Star, Leaf, Check, Edit3, ShieldCheck, ShieldAlert, Plus } from 'lucide-react';

interface BaselineViewProps {
  baselinePoints: BaselinePoint[];
  params: ParameterConfig;
  onUpdateParams?: (newParams: ParameterConfig) => void;
  currentUser?: AuthUser | null;
}

export const BaselineView: React.FC<BaselineViewProps> = ({
  baselinePoints,
  params,
  onUpdateParams,
  currentUser,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [policyRules, setPolicyRules] = useState<PolicyRule[]>(
    (params.policyRules && params.policyRules.length >= 6)
      ? params.policyRules
      : initialPolicyRules
  );
  const [recMinor, setRecMinor] = useState(params.recMinorPoints ?? 0.5);
  const [recModerate, setRecModerate] = useState(params.recModeratePoints ?? 1.0);
  const [recMajor, setRecMajor] = useState(params.recMajorPoints ?? 1.5);
  const [vioMinor, setVioMinor] = useState(params.vioMinorPoints ?? -0.2);
  const [vioModerate, setVioModerate] = useState(params.vioModeratePoints ?? -0.5);
  const [vioMajor, setVioMajor] = useState(params.vioMajorPoints ?? -1.0);
  const [vioBoundary, setVioBoundary] = useState(params.vioBoundaryPoints ?? -1.5);
  const [appsScriptUrl, setAppsScriptUrl] = useState(params.googleAppsScriptUrl || '');
  const [notebookLmUrl, setNotebookLmUrl] = useState(params.notebookLmUrl || 'https://notebooklm.google.com');
  const [geminiApiKey, setGeminiApiKey] = useState(params.geminiApiKey || '');

  // 3 Cột Trụ Điểm Nền Thành Phần (Văn Hóa, Ngạch Phòng Ban, Ngạch Quản Lý)
  const [bCultureCommon, setBCultureCommon] = useState(params.baselineCultureCommon ?? 4.08);
  const [bTmdvGen, setBTmdvGen] = useState(params.baselineTmdvGeneral ?? 4.26);
  const [bTmdvTech, setBTmdvTech] = useState(params.baselineTmdvTech ?? 5.00);
  const [bTmdvMgmt, setBTmdvMgmt] = useState(params.baselineTmdvMgmt ?? 3.54);

  const [bNshcGen, setBNshcGen] = useState(params.baselineNshcGeneral ?? 4.08);
  const [bNshcTech, setBNshcTech] = useState(params.baselineNshcTech ?? 5.00);
  const [bNshcMgmt, setBNshcMgmt] = useState(params.baselineNshcMgmt ?? 5.00);

  const [bOtherTech, setBOtherTech] = useState(params.baselineOtherTech ?? 4.08);
  const [bOtherMgmt, setBOtherMgmt] = useState(params.baselineOtherMgmt ?? 4.08);

  // Weight State - Matching official weights from Phiếu đánh giá.xlsx (65/35 & 50/30/20)
  const [wGenNoMgmt, setWGenNoMgmt] = useState(params.weightGeneralNoMgmt ?? 0.65);
  const [wTechNoMgmt, setWTechNoMgmt] = useState(params.weightTechNoMgmt ?? 0.35);
  const [wGenWithMgmt, setWGenWithMgmt] = useState(params.weightGeneralWithMgmt ?? 0.50);
  const [wMgmtWithMgmt, setWMgmtWithMgmt] = useState(params.weightMgmtWithMgmt ?? 0.30);
  const [wTechWithMgmt, setWTechWithMgmt] = useState(params.weightTechWithMgmt ?? 0.20);

  // Salary Tier Threshold State (Chuẩn Bảng Đơn Giá P2: 4.8đ, 4.0đ, 3.5đ, 2.5đ)
  const [t5, setT5] = useState(params.tier5Threshold ?? 0.96);
  const [t4, setT4] = useState(params.tier4Threshold ?? 0.80);
  const [t3, setT3] = useState(params.tier3Threshold ?? 0.70);
  const [t2, setT2] = useState(params.tier2Threshold ?? 0.50);

  React.useEffect(() => {
    setBCultureCommon(params.baselineCultureCommon ?? 4.08);
    setBTmdvGen(params.baselineTmdvGeneral ?? 4.26);
    setBTmdvTech(params.baselineTmdvTech ?? 5.00);
    setBTmdvMgmt(params.baselineTmdvMgmt ?? 3.54);

    setBNshcGen(params.baselineNshcGeneral ?? 4.08);
    setBNshcTech(params.baselineNshcTech ?? 5.00);
    setBNshcMgmt(params.baselineNshcMgmt ?? 5.00);

    setBOtherTech(params.baselineOtherTech ?? 4.08);
    setBOtherMgmt(params.baselineOtherMgmt ?? 4.08);

    setWGenNoMgmt(params.weightGeneralNoMgmt ?? 0.65);
    setWTechNoMgmt(params.weightTechNoMgmt ?? 0.35);
    setWGenWithMgmt(params.weightGeneralWithMgmt ?? 0.50);
    setWMgmtWithMgmt(params.weightMgmtWithMgmt ?? 0.30);
    setWTechWithMgmt(params.weightTechWithMgmt ?? 0.20);
    setT5(params.tier5Threshold ?? 0.96);
    setT4(params.tier4Threshold ?? 0.80);
    setT3(params.tier3Threshold ?? 0.70);
    setT2(params.tier2Threshold ?? 0.50);
  }, [params]);

  // Live computed scores for the 6 benchmark standard groups
  const calcTmdvStaff = Number((bTmdvGen * wGenNoMgmt + bTmdvTech * wTechNoMgmt).toFixed(2));
  const calcTmdvMgmt = Number((bTmdvGen * wGenWithMgmt + bTmdvTech * wTechWithMgmt + bTmdvMgmt * wMgmtWithMgmt).toFixed(2));
  const calcNshcStaff = Number((bNshcGen * wGenNoMgmt + bNshcTech * wTechNoMgmt).toFixed(2));
  const calcNshcMgmt = Number((bNshcGen * wGenWithMgmt + bNshcTech * wTechWithMgmt + bNshcMgmt * wMgmtWithMgmt).toFixed(2));
  const calcCommonStaff = Number((bCultureCommon * wGenNoMgmt + bOtherTech * wTechNoMgmt).toFixed(2));
  const calcCommonMgmt = Number((bCultureCommon * wGenWithMgmt + bOtherTech * wTechWithMgmt + bOtherMgmt * wMgmtWithMgmt).toFixed(2));

  // Live computed params using current state inputs
  const livePreviewParams: ParameterConfig = useMemo(() => ({
    ...params,
    baselineCultureCommon: bCultureCommon,
    baselineTmdvGeneral: bTmdvGen,
    baselineTmdvTech: bTmdvTech,
    baselineTmdvMgmt: bTmdvMgmt,
    baselineNshcGeneral: bNshcGen,
    baselineNshcTech: bNshcTech,
    baselineNshcMgmt: bNshcMgmt,
    baselineOtherTech: bOtherTech,
    baselineOtherMgmt: bOtherMgmt,
    baselineScoreCommon: calcCommonStaff,
    baselineScoreTmdvStaff: calcTmdvStaff,
    baselineScoreTmdvMgmt: calcTmdvMgmt,
    baselineScoreNshcStaff: calcNshcStaff,
    baselineScoreNshcMgmt: calcNshcMgmt,
    weightGeneralNoMgmt: wGenNoMgmt,
    weightTechNoMgmt: wTechNoMgmt,
    weightGeneralWithMgmt: wGenWithMgmt,
    weightMgmtWithMgmt: wMgmtWithMgmt,
    weightTechWithMgmt: wTechWithMgmt,
    tier5Threshold: t5,
    tier4Threshold: t4,
    tier3Threshold: t3,
    tier2Threshold: t2,
  }), [
    params, bCultureCommon, bTmdvGen, bTmdvTech, bTmdvMgmt,
    bNshcGen, bNshcTech, bNshcMgmt, bOtherTech, bOtherMgmt,
    calcCommonStaff, calcTmdvStaff, calcTmdvMgmt, calcNshcStaff, calcNshcMgmt,
    wGenNoMgmt, wTechNoMgmt, wGenWithMgmt, wTechWithMgmt, wMgmtWithMgmt,
    t5, t4, t3, t2
  ]);

  const handleSavePoints = () => {
    if (!onUpdateParams) return;
    onUpdateParams({
      ...params,
      policyVersion: '2026_v4',
      policyRules,
      defaultPolicyScore: 100,
      baselineCultureCommon: bCultureCommon,
      baselineTmdvGeneral: bCultureCommon,
      baselineTmdvTech: bTmdvTech,
      baselineTmdvMgmt: bTmdvMgmt,
      baselineNshcGeneral: bCultureCommon,
      baselineNshcTech: bNshcTech,
      baselineNshcMgmt: bNshcMgmt,
      baselineOtherTech: bOtherTech,
      baselineOtherMgmt: bOtherMgmt,
      baselineScoreCommon: calcCommonStaff,
      baselineScoreTmdvStaff: calcTmdvStaff,
      baselineScoreTmdvMgmt: calcTmdvMgmt,
      baselineScoreNshcStaff: calcNshcStaff,
      baselineScoreNshcMgmt: calcNshcMgmt,
      weightGeneralNoMgmt: wGenNoMgmt,
      weightTechNoMgmt: wTechNoMgmt,
      weightGeneralWithMgmt: wGenWithMgmt,
      weightMgmtWithMgmt: wMgmtWithMgmt,
      weightTechWithMgmt: wTechWithMgmt,
      tier5Threshold: t5,
      tier4Threshold: t4,
      tier3Threshold: t3,
      tier2Threshold: t2,
      recMinorPoints: recMinor,
      recModeratePoints: recModerate,
      recMajorPoints: recMajor,
      vioMinorPoints: vioMinor,
      vioModeratePoints: vioModerate,
      vioMajorPoints: vioMajor,
      vioBoundaryPoints: vioBoundary,
      googleAppsScriptUrl: appsScriptUrl.trim(),
      notebookLmUrl: notebookLmUrl.trim(),
      geminiApiKey: geminiApiKey.trim(),
    });
    setIsEditing(false);
    alert('Đã lưu toàn bộ điểm nền chuẩn (3 cột trụ) & trọng số hệ thống thành công!');
  };

  return (
    <div className="space-y-4 pb-20">
      
      {/* Brand Header Card */}
      <div className="mobile-card p-5 space-y-2 border border-emerald-900/10 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[#2D6A4F] text-xs font-bold font-heading uppercase tracking-wider">
            <Leaf className="w-4 h-4 text-[#2D6A4F]" />
            <span>Thông số hệ thống & Công thức</span>
          </div>
          {currentUser?.isAdmin && (
            <span className="text-[10px] font-extrabold text-[#2D6A4F] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              🔑 Admin Cấu Hình
            </span>
          )}
        </div>
        <h2 className="text-xl font-bold font-heading text-[#1B4332]">
          Điểm Nền, Trọng Số & Tham Số Cộng Trừ Điểm 📊
        </h2>
      </div>

      {/* NEW: Incident Point Impact Parameters Card */}
      <div className="mobile-card p-4 sm:p-5 space-y-3.5 border-2 border-emerald-600/30 bg-white shadow-md">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center space-x-2 text-[#1B4332]">
            <Award className="w-4.5 h-4.5 text-[#2D6A4F] shrink-0" />
            <h3 className="text-sm font-extrabold font-heading text-[#1B4332]">
              Tham Số Cộng / Trừ Điểm Phiếu Ghi Nhận & Vi Phạm 🎯
            </h3>
          </div>
          {currentUser?.isAdmin && (
            <button
              onClick={() => {
                if (isEditing) handleSavePoints();
                else setIsEditing(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-[#2D6A4F] hover:bg-[#1B4332] text-white text-xs font-bold shadow-sm transition-all active:scale-95 flex items-center space-x-1 shrink-0"
            >
              <span>{isEditing ? "💾 Lưu Tham Số" : "✏️ Chỉnh Sửa Tham Số"}</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* 🌟 Phiếu Ghi Nhận (Cộng Điểm) */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between font-black text-[#1B4332]">
              <span>🌟 Phiếu Ghi Nhận (Cộng Điểm)</span>
              <span className="text-[10px] text-[#2D6A4F] font-bold bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                Điểm Thưởng
              </span>
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-medium">Ghi nhận Mức Nhẹ:</span>
                {isEditing ? (
                  <input
                    type="number"
                    step="0.1"
                    value={recMinor}
                    onChange={(e) => setRecMinor(Number(e.target.value))}
                    className="w-20 p-1 bg-white border border-emerald-300 rounded font-mono font-bold text-center text-[#2D6A4F]"
                  />
                ) : (
                  <strong className="text-[#2D6A4F] font-mono font-black text-sm">+{params.recMinorPoints ?? 0.5}đ</strong>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-medium">Ghi nhận Mức Vừa:</span>
                {isEditing ? (
                  <input
                    type="number"
                    step="0.1"
                    value={recModerate}
                    onChange={(e) => setRecModerate(Number(e.target.value))}
                    className="w-20 p-1 bg-white border border-emerald-300 rounded font-mono font-bold text-center text-[#2D6A4F]"
                  />
                ) : (
                  <strong className="text-[#2D6A4F] font-mono font-black text-sm">+{params.recModeratePoints ?? 1.0}đ</strong>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-medium">Tuyên dương / Xuất sắc:</span>
                {isEditing ? (
                  <input
                    type="number"
                    step="0.1"
                    value={recMajor}
                    onChange={(e) => setRecMajor(Number(e.target.value))}
                    className="w-20 p-1 bg-white border border-emerald-300 rounded font-mono font-bold text-center text-[#2D6A4F]"
                  />
                ) : (
                  <strong className="text-[#2D6A4F] font-mono font-black text-sm">+{params.recMajorPoints ?? 1.5}đ</strong>
                )}
              </div>
            </div>
          </div>

          {/* 📢 Biên Bản Vi Phạm (Trừ Điểm) */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
            <div className="flex items-center justify-between font-black text-[#DD6B20]">
              <span>📢 Biên Bản Vi Phạm (Trừ Điểm)</span>
              <span className="text-[10px] text-[#DD6B20] font-bold bg-white px-2 py-0.5 rounded-full border border-amber-200">
                Điểm Phạt
              </span>
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-medium">Nhắc nhở Mức Nhẹ:</span>
                {isEditing ? (
                  <input
                    type="number"
                    step="0.1"
                    value={vioMinor}
                    onChange={(e) => setVioMinor(Number(e.target.value))}
                    className="w-20 p-1 bg-white border border-amber-300 rounded font-mono font-bold text-center text-[#DD6B20]"
                  />
                ) : (
                  <strong className="text-[#DD6B20] font-mono font-black text-sm">{params.vioMinorPoints ?? -0.2}đ</strong>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-medium">Vi phạm Mức Vừa:</span>
                {isEditing ? (
                  <input
                    type="number"
                    step="0.1"
                    value={vioModerate}
                    onChange={(e) => setVioModerate(Number(e.target.value))}
                    className="w-20 p-1 bg-white border border-amber-300 rounded font-mono font-bold text-center text-[#DD6B20]"
                  />
                ) : (
                  <strong className="text-[#DD6B20] font-mono font-black text-sm">{params.vioModeratePoints ?? -0.5}đ</strong>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-medium">Vi phạm Nghiêm trọng:</span>
                {isEditing ? (
                  <input
                    type="number"
                    step="0.1"
                    value={vioMajor}
                    onChange={(e) => setVioMajor(Number(e.target.value))}
                    className="w-20 p-1 bg-white border border-amber-300 rounded font-mono font-bold text-center text-[#DD6B20]"
                  />
                ) : (
                  <strong className="text-[#DD6B20] font-mono font-black text-sm">{params.vioMajorPoints ?? -1.0}đ</strong>
                )}
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-amber-200">
                <span className="text-rose-800 font-bold">Ranh Giới Đỏ ⚠️:</span>
                {isEditing ? (
                  <input
                    type="number"
                    step="0.1"
                    value={vioBoundary}
                    onChange={(e) => setVioBoundary(Number(e.target.value))}
                    className="w-20 p-1 bg-white border border-rose-300 rounded font-mono font-black text-center text-rose-700"
                  />
                ) : (
                  <strong className="text-rose-700 font-mono font-black text-sm">{params.vioBoundaryPoints ?? -1.5}đ</strong>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Gemini API Key Config for In-App AI Chat */}
        <div className="pt-2 border-t border-slate-100 space-y-1.5">
          <label className="block text-xs font-bold text-[#1B4332] flex items-center justify-between">
            <span>⚡ Google Gemini API Key (Cho Trợ Lý AI Trò Chuyện Trực Tiếp Trên App):</span>
            <span className="text-[10px] text-emerald-700 font-bold">Chat In-App</span>
          </label>
          {isEditing ? (
            <input
              type="password"
              placeholder="Dán Google Gemini API Key (VD: AIzaSy...)"
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-emerald-300 rounded-xl text-xs text-[#2D3748] font-mono focus:outline-none focus:border-[#2D6A4F]"
            />
          ) : (
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 truncate flex items-center justify-between">
              <span>{params.geminiApiKey ? '••••••••••••••••••••••••' : <span className="text-slate-400 font-sans italic">Chưa nhập API Key (App tự dùng AI Search thông minh sẵn có)</span>}</span>
              {params.geminiApiKey && <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">Đã kích hoạt API</span>}
            </div>
          )}
        </div>
      </div>

      {/* Bảng Điểm Nền Ước Tính Kết Quả (Phân tách rõ 3 cột trụ: Văn hóa, Ngạch phòng ban, Ngạch quản lý) */}
      <div className="mobile-card p-4 sm:p-5 space-y-4 border-2 border-emerald-600/30 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
          <div className="flex items-center space-x-2 text-[#2D6A4F]">
            <Calculator className="w-4.5 h-4.5 text-[#2D6A4F] shrink-0" />
            <h3 className="text-sm font-bold font-heading text-[#1B4332]">
              Phân Tách Điểm Nền Cho Điểm Đánh Giá Công Việc 📐
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
              {isEditing ? 'Đang chỉnh sửa 3 cột trụ' : 'Tính tự động theo Trọng số & Điểm nền'}
            </span>
            {currentUser?.isAdmin && (
              <button
                onClick={() => {
                  if (isEditing) handleSavePoints();
                  else setIsEditing(true);
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center space-x-1 ${
                  isEditing 
                    ? 'bg-[#1B4332] text-white hover:bg-[#2D6A4F] shadow-sm ring-2 ring-emerald-400' 
                    : 'bg-emerald-50 text-[#1B4332] border border-emerald-300 hover:bg-emerald-100'
                }`}
              >
                <span>{isEditing ? "💾 Lưu Điểm Chuẩn" : "✏️ Chỉnh Sửa"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Nguyên tắc phân tách & Tiêu chí chuẩn hóa */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50/90 to-teal-50/90 border border-emerald-200 text-xs space-y-2">
          <div className="font-extrabold text-[#1B4332] flex items-center gap-1.5">
            <Star className="w-4 h-4 text-emerald-600 fill-emerald-600" />
            <span>Tiêu chí chuẩn hóa điểm đánh giá công việc từ Điểm Nền:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <div className="p-2.5 bg-white/90 rounded-xl border border-emerald-100 shadow-2xs space-y-1">
              <span className="font-black text-emerald-800 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Đối với Nhân Viên:</span>
              </span>
              <p className="text-slate-600">
                Thực tế là <strong>Văn hóa ({Math.round(wGenNoMgmt * 100)}%)</strong> + <strong>Ngạch phòng ban ({Math.round(wTechNoMgmt * 100)}%)</strong>. Không tính ngạch quản lý.
              </p>
            </div>

            <div className="p-2.5 bg-white/90 rounded-xl border border-emerald-100 shadow-2xs space-y-1">
              <span className="font-black text-blue-800 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>Đối với Quản Lý:</span>
              </span>
              <p className="text-slate-600">
                Thực tế là <strong>Văn hóa ({Math.round(wGenWithMgmt * 100)}%)</strong> + <strong>Ngạch phòng ban ({Math.round(wTechWithMgmt * 100)}%)</strong> + <strong>Ngạch quản lý ({Math.round(wMgmtWithMgmt * 100)}%)</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Khối chỉnh sửa 3 Cột Trụ Điểm Nền khi Admin bật Chỉnh Sửa */}
        {isEditing && (
          <div className="p-4 rounded-2xl bg-amber-50/70 border-2 border-amber-300 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-amber-200 pb-2">
              <span className="font-extrabold text-xs text-amber-900 flex items-center gap-1.5">
                <Edit3 className="w-4 h-4 text-amber-700" />
                <span>Chỉnh sửa Điểm Nền Thành Phần (3 Cột Trụ Gốc):</span>
              </span>
              <span className="text-[10px] text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded">
                Điểm tổng bên dưới sẽ tự động tính theo
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {/* 1. Điểm nền Văn Hóa */}
              <div className="p-3 bg-white rounded-xl border border-amber-200 space-y-2">
                <span className="font-black text-emerald-800 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span>1. Điểm Nền Văn Hóa & Thái Độ</span>
                </span>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-bold">Chuẩn chung toàn Nhà:</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="5"
                      value={bCultureCommon}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setBCultureCommon(val);
                        setBTmdvGen(val);
                        setBNshcGen(val);
                      }}
                      className="w-16 p-1 bg-slate-50 border border-slate-300 rounded font-mono font-bold text-center text-emerald-800"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 italic leading-snug">
                    Trụ cột Văn hóa (One Voice) thống nhất áp dụng cho 100% nhân sự toàn Nhà.
                  </p>
                </div>
              </div>

              {/* 2. Điểm nền Ngạch Phòng Ban */}
              <div className="p-3 bg-white rounded-xl border border-amber-200 space-y-2">
                <span className="font-black text-purple-800 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                  <span>2. Điểm Nền Ngạch Phòng Ban</span>
                </span>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Ngạch Thương Mại & DV:</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="5"
                      value={bTmdvTech}
                      onChange={(e) => setBTmdvTech(Number(e.target.value))}
                      className="w-16 p-1 bg-slate-50 border border-slate-300 rounded font-mono font-bold text-center text-purple-800"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Ngạch Nhân Sự - HC - PC:</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="5"
                      value={bNshcTech}
                      onChange={(e) => setBNshcTech(Number(e.target.value))}
                      className="w-16 p-1 bg-slate-50 border border-slate-300 rounded font-mono font-bold text-center text-purple-800"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Ngạch Tuyến khác:</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="5"
                      value={bOtherTech}
                      onChange={(e) => setBOtherTech(Number(e.target.value))}
                      className="w-16 p-1 bg-slate-50 border border-slate-300 rounded font-mono font-bold text-center text-purple-800"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Điểm nền Ngạch Quản Lý */}
              <div className="p-3 bg-white rounded-xl border border-amber-200 space-y-2">
                <span className="font-black text-blue-800 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  <span>3. Điểm Nền Ngạch Quản Lý</span>
                </span>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Quản lý Thương Mại & DV:</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="5"
                      value={bTmdvMgmt}
                      onChange={(e) => setBTmdvMgmt(Number(e.target.value))}
                      className="w-16 p-1 bg-slate-50 border border-slate-300 rounded font-mono font-bold text-center text-blue-800"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Quản lý Nhân Sự - HC - PC:</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="5"
                      value={bNshcMgmt}
                      onChange={(e) => setBNshcMgmt(Number(e.target.value))}
                      className="w-16 p-1 bg-slate-50 border border-slate-300 rounded font-mono font-bold text-center text-blue-800"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Quản lý Tuyến khác:</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="5"
                      value={bOtherMgmt}
                      onChange={(e) => setBOtherMgmt(Number(e.target.value))}
                      className="w-16 p-1 bg-slate-50 border border-slate-300 rounded font-mono font-bold text-center text-blue-800"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6 Nhóm Điểm Chuẩn Hệ Thống (Phân Tách Chi Tiết Từng Ngạch & Bậc Lương) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {[
            {
              id: 'tmdv_staff',
              name: 'Thương mại & Dịch vụ, nhân viên',
              role: 'Nhân viên',
              trackName: 'Ngạch Thương Mại & Dịch Vụ',
              score: calcTmdvStaff,
              vh: bTmdvGen,
              wVh: wGenNoMgmt,
              pb: bTmdvTech,
              wPb: wTechNoMgmt,
              ql: undefined,
              wQl: 0,
              formula: `Văn hóa (${bTmdvGen.toFixed(2)}) × ${Math.round(wGenNoMgmt * 100)}% + Ngạch TM (${bTmdvTech.toFixed(2)}) × ${Math.round(wTechNoMgmt * 100)}%`,
            },
            {
              id: 'tmdv_mgmt',
              name: 'Thương mại & Dịch vụ, quản lý',
              role: 'Quản lý',
              trackName: 'Ngạch Thương Mại & Dịch Vụ',
              score: calcTmdvMgmt,
              vh: bTmdvGen,
              wVh: wGenWithMgmt,
              pb: bTmdvTech,
              wPb: wTechWithMgmt,
              ql: bTmdvMgmt,
              wQl: wMgmtWithMgmt,
              formula: `Văn hóa (${bTmdvGen.toFixed(2)}) × ${Math.round(wGenWithMgmt * 100)}% + Ngạch TM (${bTmdvTech.toFixed(2)}) × ${Math.round(wTechWithMgmt * 100)}% + Ngạch QL (${bTmdvMgmt.toFixed(2)}) × ${Math.round(wMgmtWithMgmt * 100)}%`,
            },
            {
              id: 'nshc_staff',
              name: 'Nhân sự - Hành chính - Pháp chế, nhân viên',
              role: 'Nhân viên',
              trackName: 'Ngạch Nhân Sự - HC - PC',
              score: calcNshcStaff,
              vh: bNshcGen,
              wVh: wGenNoMgmt,
              pb: bNshcTech,
              wPb: wTechNoMgmt,
              ql: undefined,
              wQl: 0,
              formula: `Văn hóa (${bNshcGen.toFixed(2)}) × ${Math.round(wGenNoMgmt * 100)}% + Ngạch NS (${bNshcTech.toFixed(2)}) × ${Math.round(wTechNoMgmt * 100)}%`,
            },
            {
              id: 'nshc_mgmt',
              name: 'Nhân sự - Hành chính - Pháp chế, quản lý',
              role: 'Quản lý',
              trackName: 'Ngạch Nhân Sự - HC - PC',
              score: calcNshcMgmt,
              vh: bNshcGen,
              wVh: wGenWithMgmt,
              pb: bNshcTech,
              wPb: wTechWithMgmt,
              ql: bNshcMgmt,
              wQl: wMgmtWithMgmt,
              formula: `Văn hóa (${bNshcGen.toFixed(2)}) × ${Math.round(wGenWithMgmt * 100)}% + Ngạch NS (${bNshcTech.toFixed(2)}) × ${Math.round(wTechWithMgmt * 100)}% + Ngạch QL (${bNshcMgmt.toFixed(2)}) × ${Math.round(wMgmtWithMgmt * 100)}%`,
            },
            {
              id: 'common_staff',
              name: 'Tuyến chưa có ngạch riêng, nhân viên',
              role: 'Nhân viên',
              trackName: 'Ngạch Phòng Ban',
              score: calcCommonStaff,
              vh: bCultureCommon,
              wVh: wGenNoMgmt,
              pb: bOtherTech,
              wPb: wTechNoMgmt,
              ql: undefined,
              wQl: 0,
              formula: `Văn hóa (${bCultureCommon.toFixed(2)}) × ${Math.round(wGenNoMgmt * 100)}% + Ngạch PB (${bOtherTech.toFixed(2)}) × ${Math.round(wTechNoMgmt * 100)}%`,
            },
            {
              id: 'common_mgmt',
              name: 'Tuyến chưa có ngạch riêng, quản lý',
              role: 'Quản lý',
              trackName: 'Ngạch Phòng Ban',
              score: calcCommonMgmt,
              vh: bCultureCommon,
              wVh: wGenWithMgmt,
              pb: bOtherTech,
              wPb: wTechWithMgmt,
              ql: bOtherMgmt,
              wQl: wMgmtWithMgmt,
              formula: `Văn hóa (${bCultureCommon.toFixed(2)}) × ${Math.round(wGenWithMgmt * 100)}% + Ngạch PB (${bOtherTech.toFixed(2)}) × ${Math.round(wTechWithMgmt * 100)}% + Ngạch QL (${bOtherMgmt.toFixed(2)}) × ${Math.round(wMgmtWithMgmt * 100)}%`,
            },
          ].map((item) => {
            const currentTier = calculateSalaryTier(item.score, livePreviewParams);
            const isManager = item.role === 'Quản lý';
            return (
              <div 
                key={item.id} 
                className="p-3.5 rounded-2xl border bg-[#EDEAE3]/40 border-slate-200/80 space-y-2.5 shadow-2xs"
              >
                <div className="flex items-start justify-between gap-1.5">
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-extrabold text-[#1B4332] text-xs sm:text-sm truncate">
                        {item.name}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.2 rounded-md border shrink-0 ${
                        isManager 
                          ? 'bg-blue-50 text-blue-700 border-blue-200' 
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {item.role}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-semibold block">
                      {item.trackName}
                    </span>
                  </div>

                  <div className="flex flex-col items-end shrink-0">
                    <span className="text-base sm:text-lg font-black font-mono text-emerald-800">
                      {item.score.toFixed(2)}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#1B4332] text-[#52B788] text-[10px] font-extrabold flex items-center space-x-1 shadow-2xs">
                      <Star className="w-2.5 h-2.5 text-[#52B788] fill-[#52B788]" />
                      <span>Bậc {currentTier}</span>
                    </span>
                  </div>
                </div>

                {/* 3 Thành Phần Phân Tách */}
                <div className="space-y-1 text-[11px] bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>Văn hóa & Thái độ:</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1 rounded">
                        {Math.round(item.wVh * 100)}%
                      </span>
                    </span>
                    <span className="font-mono font-bold text-emerald-800">{item.vh.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                      <span>Ngạch phòng ban:</span>
                      <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1 rounded">
                        {Math.round(item.wPb * 100)}%
                      </span>
                    </span>
                    <span className="font-mono font-bold text-purple-800">{item.pb.toFixed(2)}</span>
                  </div>

                  {item.ql !== undefined && (
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        <span>Ngạch quản lý:</span>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1 rounded">
                          {Math.round(item.wQl * 100)}%
                        </span>
                      </span>
                      <span className="font-mono font-bold text-blue-800">{item.ql.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                {/* Công thức ghép điểm */}
                <p className="text-[10px] text-slate-500 font-mono bg-slate-50 px-2 py-1 rounded-lg border border-slate-200 truncate" title={item.formula}>
                  📐 {item.formula}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Parameter Weights Mobile Card */}
      <div className="mobile-card p-4 space-y-3 border border-slate-100 shadow-sm">
        <div className="flex items-center space-x-2 text-[#1B4332]">
          <Sliders className="w-4 h-4" />
          <h3 className="text-sm font-bold font-heading text-[#1B4332]">Trọng Số Ghép Điểm Tổng</h3>
        </div>

        <div className="space-y-2 text-xs">
          <div className="p-3 rounded-2xl bg-[#EDEAE3]/50 border border-slate-200 space-y-2">
            <p className="font-bold text-[#1B4332]">1. Không ngạch quản lý:</p>
            <div className="flex items-center justify-between text-slate-700">
              <span>Văn hóa chung:</span>
              {isEditing ? (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="5"
                    min="0"
                    max="100"
                    value={Math.round(wGenNoMgmt * 100)}
                    onChange={(e) => setWGenNoMgmt(Number(e.target.value) / 100)}
                    className="w-16 p-1 bg-white border border-emerald-300 rounded font-mono font-bold text-center text-[#2D6A4F]"
                  />
                  <span>%</span>
                </div>
              ) : (
                <strong className="text-[#2D6A4F] font-bold">{(params.weightGeneralNoMgmt * 100).toFixed(0)}%</strong>
              )}
            </div>
            <div className="flex items-center justify-between text-slate-700">
              <span>Ngạch chuyên môn:</span>
              {isEditing ? (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="5"
                    min="0"
                    max="100"
                    value={Math.round(wTechNoMgmt * 100)}
                    onChange={(e) => setWTechNoMgmt(Number(e.target.value) / 100)}
                    className="w-16 p-1 bg-white border border-emerald-300 rounded font-mono font-bold text-center text-[#2D6A4F]"
                  />
                  <span>%</span>
                </div>
              ) : (
                <strong className="text-[#2D6A4F] font-bold">{(params.weightTechNoMgmt * 100).toFixed(0)}%</strong>
              )}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#EDEAE3]/50 border border-slate-200 space-y-2">
            <p className="font-bold text-[#1B4332]">2. Có ngạch quản lý:</p>
            <div className="flex items-center justify-between text-slate-700">
              <span>Văn hóa chung:</span>
              {isEditing ? (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="5"
                    min="0"
                    max="100"
                    value={Math.round(wGenWithMgmt * 100)}
                    onChange={(e) => setWGenWithMgmt(Number(e.target.value) / 100)}
                    className="w-16 p-1 bg-white border border-emerald-300 rounded font-mono font-bold text-center text-[#2D6A4F]"
                  />
                  <span>%</span>
                </div>
              ) : (
                <strong className="text-[#2D6A4F] font-bold">{(params.weightGeneralWithMgmt * 100).toFixed(0)}%</strong>
              )}
            </div>
            <div className="flex items-center justify-between text-slate-700">
              <span>Ngạch quản lý:</span>
              {isEditing ? (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="5"
                    min="0"
                    max="100"
                    value={Math.round(wMgmtWithMgmt * 100)}
                    onChange={(e) => setWMgmtWithMgmt(Number(e.target.value) / 100)}
                    className="w-16 p-1 bg-white border border-emerald-300 rounded font-mono font-bold text-center text-[#2D6A4F]"
                  />
                  <span>%</span>
                </div>
              ) : (
                <strong className="text-[#2D6A4F] font-bold">{(params.weightMgmtWithMgmt * 100).toFixed(0)}%</strong>
              )}
            </div>
            <div className="flex items-center justify-between text-slate-700">
              <span>Ngạch chuyên môn:</span>
              {isEditing ? (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="5"
                    min="0"
                    max="100"
                    value={Math.round(wTechWithMgmt * 100)}
                    onChange={(e) => setWTechWithMgmt(Number(e.target.value) / 100)}
                    className="w-16 p-1 bg-white border border-emerald-300 rounded font-mono font-bold text-center text-[#2D6A4F]"
                  />
                  <span>%</span>
                </div>
              ) : (
                <strong className="text-[#2D6A4F] font-bold">{(params.weightTechWithMgmt * 100).toFixed(0)}%</strong>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* BẢNG ĐƠN GIÁ P2 - QUY ĐIỂM PHIẾU ĐÁNH GIÁ RA TIỀN */}
      <div className="mobile-card p-0 overflow-hidden border border-emerald-700/30 shadow-md rounded-2xl bg-white space-y-0">
        <div className="bg-[#1B4332] text-white p-3.5 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-800">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-emerald-300 shrink-0" />
            <div>
              <h3 className="text-sm font-black font-heading text-white tracking-wide flex items-center gap-1.5">
                <span>📊 ĐƠN GIÁ P2 - QUY ĐIỂM PHIẾU ĐÁNH GIÁ RA TIỀN</span>
              </h3>
              <p className="text-[11px] text-emerald-200/90 font-medium mt-0.5">
                P2 thực nhận = "P2 ở bậc 4" của cấp × Hệ số của bậc.
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#2D6A4F] text-white font-extrabold text-[11px] border-b border-emerald-800">
                <th className="py-2.5 px-3 w-12 text-center">Bậc</th>
                <th className="py-2.5 px-3 w-20">Tên bậc</th>
                <th className="py-2.5 px-3">Điểm TỪ (Sen sửa)</th>
                <th className="py-2.5 px-3">Điểm đến</th>
                <th className="py-2.5 px-3 text-center w-28">HỆ SỐ (Sen sửa)</th>
                <th className="py-2.5 px-3">Ý nghĩa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800 text-[11px]">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-2.5 px-3 text-center font-bold text-slate-500">1</td>
                <td className="py-2.5 px-3 font-bold text-rose-800">Bậc 1</td>
                <td className="py-2.5 px-3 font-mono font-semibold">1,0 đến dưới 2,5</td>
                <td className="py-2.5 px-3 text-slate-500 font-mono">dưới 2,5 đến dưới 3,5</td>
                <td className="py-2.5 px-3 text-center font-mono font-black text-rose-700 bg-rose-50/50">0,10</td>
                <td className="py-2.5 px-3 text-slate-600 font-medium">Chưa đạt chuẩn vị trí</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-2.5 px-3 text-center font-bold text-slate-500">2</td>
                <td className="py-2.5 px-3 font-bold text-orange-800">Bậc 2</td>
                <td className="py-2.5 px-3 font-mono font-semibold">2,5 đến dưới 3,5</td>
                <td className="py-2.5 px-3 text-slate-500 font-mono">dưới 3,5 đến dưới 4,0</td>
                <td className="py-2.5 px-3 text-center font-mono font-black text-orange-700 bg-orange-50/50">0,40</td>
                <td className="py-2.5 px-3 text-slate-600 font-medium">Đạt một phần</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-2.5 px-3 text-center font-bold text-slate-500">3</td>
                <td className="py-2.5 px-3 font-bold text-sky-800">Bậc 3</td>
                <td className="py-2.5 px-3 font-mono font-semibold">3,5 đến dưới 4,0</td>
                <td className="py-2.5 px-3 text-slate-500 font-mono">dưới 4,0 đến dưới 4,8</td>
                <td className="py-2.5 px-3 text-center font-mono font-black text-sky-700 bg-sky-50/50">0,90</td>
                <td className="py-2.5 px-3 text-slate-600 font-medium">Gần đạt chuẩn</td>
              </tr>
              <tr className="bg-emerald-50/70 hover:bg-emerald-100/60 transition-colors border-l-4 border-l-emerald-600">
                <td className="py-2.5 px-3 text-center font-black text-emerald-900">4</td>
                <td className="py-2.5 px-3 font-black text-emerald-900 flex items-center gap-1">
                  <span>Bậc 4</span>
                  <span className="text-[9px] bg-emerald-600 text-white px-1 rounded font-bold">Chuẩn</span>
                </td>
                <td className="py-2.5 px-3 font-mono font-bold text-emerald-900">4,0 đến dưới 4,8</td>
                <td className="py-2.5 px-3 text-emerald-700 font-mono font-medium">dưới 4,8 đến 5,0</td>
                <td className="py-2.5 px-3 text-center font-mono font-black text-emerald-900 bg-emerald-100">1,00</td>
                <td className="py-2.5 px-3 font-bold text-emerald-900">ĐẠT CHUẨN - mức Công ty dự định trả</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-2.5 px-3 text-center font-bold text-slate-500">5</td>
                <td className="py-2.5 px-3 font-bold text-[#1B4332]">Bậc 5</td>
                <td className="py-2.5 px-3 font-mono font-semibold">4,8 đến 5,0</td>
                <td className="py-2.5 px-3 text-slate-500 font-mono">5,0</td>
                <td className="py-2.5 px-3 text-center font-mono font-black text-[#1B4332] bg-emerald-100/50">1,10</td>
                <td className="py-2.5 px-3 text-[#1B4332] font-semibold">Vượt chuẩn rõ rệt, rất khó đạt</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 10 POLICY RULES CONFIG CARD */}
      <div className="mobile-card p-4 sm:p-5 space-y-4 border-2 border-[#1B4332]/20 bg-white shadow-md">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2 text-[#1B4332]">
            <ShieldCheck className="w-5 h-5 text-[#2D6A4F] shrink-0" />
            <div>
              <h3 className="text-sm font-extrabold font-heading text-[#1B4332]">
                Cấu Hình Quy Định Mức Độ Chấp Hành & Hoàn Thành Công Việc (100 Điểm Gốc) 🛡️
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Admin tùy chỉnh quy tắc và mức trừ điểm dựa theo severity
              </p>
            </div>
          </div>

          {currentUser?.isAdmin && (
            <span className="text-[10px] font-mono font-bold bg-emerald-50 text-[#2D6A4F] px-2.5 py-1 rounded-full border border-emerald-200 whitespace-nowrap">
              100 Điểm Gốc
            </span>
          )}
        </div>

        <div className="space-y-2.5">
          {policyRules.map((rule, idx) => (
            <div key={rule.id} className="p-3.5 rounded-2xl bg-[#EDEAE3]/40 border border-slate-200/80 space-y-2 text-xs">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-full font-mono text-[10px] font-black bg-[#1B4332] text-[#52B788]">
                    {rule.code || rule.id}
                  </span>
                  <span className="font-extrabold text-[#1B4332] text-xs sm:text-sm">{rule.title}</span>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                    {rule.category}
                  </span>
                  {isEditing ? (
                    <div className="flex items-center space-x-1">
                      <span className="text-rose-600 font-bold">-</span>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={rule.penaltyPoints}
                        onChange={(e) => {
                          const val = Math.max(1, Number(e.target.value));
                          const updated = [...policyRules];
                          updated[idx] = { ...updated[idx], penaltyPoints: val };
                          setPolicyRules(updated);
                        }}
                        className="w-14 p-1 bg-white border border-rose-300 rounded text-center font-mono font-black text-rose-600"
                      />
                      <span className="font-bold text-slate-500">đ</span>
                    </div>
                  ) : (
                    <span className="font-mono font-black text-xs text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200">
                      -{rule.penaltyPoints} điểm
                    </span>
                  )}
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed text-[11px] font-medium">{rule.description}</p>

              <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px] text-slate-500">
                <span>Biện pháp: <strong className="text-slate-700 font-bold">{rule.enforcementMeasure}</strong></span>
                <span className="font-bold text-[#2D6A4F]">Mức: {rule.severity}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
