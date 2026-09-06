import React, { useState } from 'react';
import { BaselinePoint, ParameterConfig, AuthUser } from '../types';
import { BarChart3, Sliders, Award, Calculator, Star, Leaf, Check, Edit3 } from 'lucide-react';

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
  const [recMinor, setRecMinor] = useState(params.recMinorPoints ?? 0.5);
  const [recModerate, setRecModerate] = useState(params.recModeratePoints ?? 1.0);
  const [recMajor, setRecMajor] = useState(params.recMajorPoints ?? 1.5);
  const [vioMinor, setVioMinor] = useState(params.vioMinorPoints ?? -0.2);
  const [vioModerate, setVioModerate] = useState(params.vioModeratePoints ?? -0.5);
  const [vioMajor, setVioMajor] = useState(params.vioMajorPoints ?? -1.0);
  const [vioBoundary, setVioBoundary] = useState(params.vioBoundaryPoints ?? -1.5);
  const [appsScriptUrl, setAppsScriptUrl] = useState(params.googleAppsScriptUrl || '');

  const handleSavePoints = () => {
    if (!onUpdateParams) return;
    onUpdateParams({
      ...params,
      recMinorPoints: recMinor,
      recModeratePoints: recModerate,
      recMajorPoints: recMajor,
      vioMinorPoints: vioMinor,
      vioModeratePoints: vioModerate,
      vioMajorPoints: vioMajor,
      vioBoundaryPoints: vioBoundary,
      googleAppsScriptUrl: appsScriptUrl.trim(),
    });
    setIsEditing(false);
    alert('Đã lưu tham số hệ thống & Google Apps Script Webhook URL thành công!');
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

        {/* Google Apps Script Webhook URL Config */}
        <div className="pt-2 border-t border-slate-100 space-y-1.5">
          <label className="block text-xs font-bold text-[#1B4332] flex items-center justify-between">
            <span>🌐 Google Apps Script Webhook URL (Kết nối 16 file Apps Script):</span>
            <span className="text-[10px] text-slate-500 font-normal">Sheet / Drive Export</span>
          </label>
          {isEditing ? (
            <input
              type="text"
              placeholder="Dán link Web App URL từ Google Apps Script (VD: https://script.google.com/macros/s/.../exec)"
              value={appsScriptUrl}
              onChange={(e) => setAppsScriptUrl(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-emerald-300 rounded-xl text-xs text-[#2D3748] font-mono focus:outline-none focus:border-[#2D6A4F]"
            />
          ) : (
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 truncate">
              {params.googleAppsScriptUrl ? params.googleAppsScriptUrl : <span className="text-slate-400 font-sans italic">Chưa dán URL Google Apps Script (Sẽ tự động tải file CSV/Excel về máy khi bấm xuất)</span>}
            </div>
          )}
        </div>
      </div>

      {/* Baseline Points Mobile Cards */}
      <div className="mobile-card p-4 space-y-3 border border-slate-100 shadow-sm">
        <div className="flex items-center space-x-2 text-[#2D6A4F]">
          <Calculator className="w-4 h-4" />
          <h3 className="text-sm font-bold font-heading text-[#1B4332]">Bảng Điểm Nền Ước Tính</h3>
        </div>

        <div className="space-y-2 text-xs">
          {baselinePoints.map((bp, i) => (
            <div key={i} className="p-3 rounded-2xl bg-[#EDEAE3]/40 border border-slate-200/80 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1B4332]">{bp.lineFormName}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#1B4332] text-[#52B788] text-[10px] font-extrabold flex items-center space-x-1">
                  <Star className="w-3 h-3 text-[#52B788] fill-[#52B788]" />
                  <span>Bậc {bp.salaryTier}</span>
                </span>
              </div>
              <p className="text-[#2D6A4F] font-mono font-black text-sm">{bp.baselineScore.toFixed(2)} / 5.0</p>
              {bp.note && <p className="text-[11px] text-slate-500">{bp.note}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Parameter Weights Mobile Card */}
      <div className="mobile-card p-4 space-y-3 border border-slate-100 shadow-sm">
        <div className="flex items-center space-x-2 text-[#1B4332]">
          <Sliders className="w-4 h-4" />
          <h3 className="text-sm font-bold font-heading text-[#1B4332]">Trọng Số Ghép Điểm Tổng</h3>
        </div>

        <div className="space-y-2 text-xs">
          <div className="p-3 rounded-2xl bg-[#EDEAE3]/50 border border-slate-200 space-y-1">
            <p className="font-bold text-[#1B4332]">1. Không ngạch quản lý:</p>
            <div className="flex justify-between text-slate-700">
              <span>Văn hóa chung:</span>
              <strong className="text-[#2D6A4F] font-bold">{(params.weightGeneralNoMgmt * 100).toFixed(0)}%</strong>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Ngạch chuyên môn:</span>
              <strong className="text-[#2D6A4F] font-bold">{(params.weightTechNoMgmt * 100).toFixed(0)}%</strong>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#EDEAE3]/50 border border-slate-200 space-y-1">
            <p className="font-bold text-[#1B4332]">2. Có ngạch quản lý:</p>
            <div className="flex justify-between text-slate-700">
              <span>Văn hóa chung:</span>
              <strong className="text-[#2D6A4F] font-bold">{(params.weightGeneralWithMgmt * 100).toFixed(0)}%</strong>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Ngạch quản lý:</span>
              <strong className="text-[#2D6A4F] font-bold">{(params.weightMgmtWithMgmt * 100).toFixed(0)}%</strong>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Ngạch chuyên môn:</span>
              <strong className="text-[#2D6A4F] font-bold">{(params.weightTechWithMgmt * 100).toFixed(0)}%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Salary Tiers Mobile Card */}
      <div className="mobile-card p-4 space-y-3 border border-slate-100 shadow-sm">
        <div className="flex items-center space-x-2 text-[#2D6A4F]">
          <Award className="w-4 h-4" />
          <h3 className="text-sm font-bold font-heading text-[#1B4332]">Ngưỡng Phân Bậc Lương P2</h3>
        </div>

        <div className="space-y-1.5 text-xs">
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex justify-between">
            <span className="font-bold text-[#1B4332]">Bậc 5 (Xuất sắc):</span>
            <span className="font-bold text-[#2D6A4F]">&ge; 85%</span>
          </div>
          <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 flex justify-between">
            <span className="font-bold text-sky-900">Bậc 4 (Đạt chuẩn):</span>
            <span className="font-bold text-sky-800">70% - 85%</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between">
            <span className="font-bold text-slate-800">Bậc 3 (Khá):</span>
            <span className="font-bold text-slate-700">55% - 70%</span>
          </div>
          <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-200 flex justify-between">
            <span className="font-bold text-orange-900">Bậc 2 (Cần cố gắng):</span>
            <span className="font-bold text-orange-800">40% - 55%</span>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 flex justify-between">
            <span className="font-bold text-rose-900">Bậc 1 (Chưa đạt):</span>
            <span className="font-bold text-rose-800">&lt; 40%</span>
          </div>
        </div>
      </div>

    </div>
  );
};
