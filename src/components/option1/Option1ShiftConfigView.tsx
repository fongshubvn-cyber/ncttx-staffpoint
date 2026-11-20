import React, { useState } from 'react';
import { ParameterConfig, AuthUser } from '../../types';
import { DEFAULT_SHIFT_SHEET_URL, fetchAndParseShiftWorkbook } from '../../services/shiftService';
import { isSystemAdmin } from '../../utils/calculator';
import { 
  Clock, 
  Link as LinkIcon, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Save, 
  RotateCcw, 
  Sparkles, 
  Megaphone, 
  Users, 
  FileSpreadsheet,
  Info,
  Bell,
  Volume2
} from 'lucide-react';
import { 
  triggerBrowserNotification, 
  playNotificationSound, 
  requestBrowserNotificationPermission,
  isBrowserNotificationGranted 
} from '../../services/notificationService';

interface Option1ShiftConfigViewProps {
  params: ParameterConfig;
  onUpdateParams?: (newParams: ParameterConfig) => void;
  currentUser?: AuthUser | null;
}

export const Option1ShiftConfigView: React.FC<Option1ShiftConfigViewProps> = ({
  params,
  onUpdateParams,
  currentUser,
}) => {
  const [sheetUrl, setSheetUrl] = useState<string>(params.shiftSheetUrl || DEFAULT_SHIFT_SHEET_URL);
  const [scanInterval, setScanInterval] = useState<number>(params.shiftScanIntervalSeconds || 60);
  const [defaultPenalty, setDefaultPenalty] = useState<number>(params.defaultShiftPenaltyPoints ?? -0.5);
  const [defaultReward, setDefaultReward] = useState<number>(params.defaultShiftRewardPoints ?? 0.5);
  const [staffSheetName, setStaffSheetName] = useState<string>(params.shiftStaffSheetName || '👥 Nhân sự điểm bán');
  const [staffSyncInterval, setStaffSyncInterval] = useState<number>(params.staffSyncIntervalHours ?? 1);
  const [enableNotifications, setEnableNotifications] = useState<boolean>(params.enableWebNotifications ?? true);

  // Test Connection State
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; details?: string } | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const isAdmin = isSystemAdmin(currentUser);

  // Test Google Sheet connection
  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const data = await fetchAndParseShiftWorkbook(sheetUrl.trim() || DEFAULT_SHIFT_SHEET_URL);
      setTestResult({
        success: true,
        message: `Kết nối thành công! Đã phát hiện ${data.shifts.length} ca làm việc và ${data.staffList.length} nhân sự trong sheet "${staffSheetName}".`,
        details: `Cập nhật lúc: ${new Date().toLocaleTimeString('vi-VN')} • Số sheet đã duyệt: ${data.sheetCount}`,
      });
    } catch (err: any) {
      setTestResult({
        success: false,
        message: 'Không thể kết nối hoặc đọc Google Sheet.',
        details: err.message || 'Vui lòng kiểm tra quyền chia sẻ link (Bất kỳ ai có link đều có thể xem).',
      });
    } finally {
      setIsTesting(false);
    }
  };

  // Reset to default
  const handleResetDefaults = () => {
    if (confirm('Bạn có chắc muốn khôi phục toàn bộ cài đặt Lịch Ca về mặc định ban đầu không?')) {
      setSheetUrl(DEFAULT_SHIFT_SHEET_URL);
      setScanInterval(60);
      setDefaultPenalty(-0.5);
      setDefaultReward(0.5);
      setStaffSheetName('👥 Nhân sự điểm bán');
      setStaffSyncInterval(1);
      setEnableNotifications(true);
      setTestResult(null);
    }
  };

  // Save Settings
  const handleSave = () => {
    if (!isAdmin) {
      alert('Chỉ Quản trị viên (Admin / Co-Admin) mới có quyền lưu cấu hình hệ thống!');
      return;
    }

    if (!onUpdateParams) return;

    const newParams: ParameterConfig = {
      ...params,
      shiftSheetUrl: sheetUrl.trim() || DEFAULT_SHIFT_SHEET_URL,
      shiftScanIntervalSeconds: Number(scanInterval) > 0 ? Number(scanInterval) : 60,
      defaultShiftPenaltyPoints: Number(defaultPenalty),
      defaultShiftRewardPoints: Number(defaultReward),
      shiftStaffSheetName: staffSheetName.trim() || '👥 Nhân sự điểm bán',
      staffSyncIntervalHours: Number(staffSyncInterval),
      enableWebNotifications: enableNotifications,
      vioMinorPoints: Number(defaultPenalty), // Đồng bộ mức trừ nhẹ mặc định về mức này
    };

    onUpdateParams(newParams);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
    alert('✅ Đã lưu cấu hình Lịch Ca Làm Việc & Thông Báo thành công!');
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#1B4332] via-[#2D6A4F] to-[#40916C] text-white shadow-lg space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-2xl">
              <Clock className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight">Cấu Hình Lịch Ca & Google Sheet</h2>
              <p className="text-xs text-emerald-100 font-medium">
                Thiết lập liên kết bảng chấm công Google Sheet, chu kỳ quét tự động và mức điểm mặc định
              </p>
            </div>
          </div>

          {isAdmin && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetDefaults}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all backdrop-blur-sm cursor-pointer"
                title="Khôi phục link và thông số ban đầu"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Mặc định</span>
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-[#1B4332] text-xs font-black shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isSaved ? 'Đã lưu!' : 'Lưu Cấu Hình'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Settings Card */}
      <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
        
        {/* Section 1: Google Sheet URL */}
        <div className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              1. Đường Link Google Sheet Lịch Ca & Điểm Bán
            </label>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Cửa hàng số 9 Triệu Việt Vương
            </span>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <LinkIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="url"
                value={sheetUrl}
                disabled={!isAdmin}
                onChange={(e) => setSheetUrl(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/.../edit"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-2xl border border-slate-300 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition-all disabled:opacity-60 shadow-2xs"
              />
            </div>

            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting || !sheetUrl.trim()}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs shadow-sm transition-all active:scale-95 disabled:opacity-50 cursor-pointer shrink-0"
              title="Kiểm tra xem link sheet có truy cập được và đọc đúng format không"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? 'Đang kiểm tra...' : 'Kiểm tra link'}</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-500 font-medium">
            💡 Lưu ý: Bảng tính Google Sheet cần được bật chế độ <strong>"Bất kỳ ai có đường liên kết đều có thể xem"</strong> để hệ thống tự động quét lịch ca mà không cần đăng nhập Google.
          </p>

          {/* Test Result Message Box */}
          {testResult && (
            <div className={`p-4 rounded-2xl border transition-all ${
              testResult.success 
                ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950' 
                : 'bg-rose-50/90 border-rose-200 text-rose-950'
            }`}>
              <div className="flex items-start gap-2.5">
                {testResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <div className="text-xs font-black">{testResult.message}</div>
                  {testResult.details && (
                    <div className="text-[11px] text-slate-600 font-medium">{testResult.details}</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <hr className="border-slate-100" />

        {/* Section 2: Polling Scan Interval */}
        <div className="space-y-3">
          <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
            2. Chu Kỳ Quét Thời Gian Làm Việc Tự Động
          </label>
          <p className="text-[11px] text-slate-500 font-medium">
            Hệ thống sẽ chạy ngầm và quét lại dữ liệu ca làm việc mới nhất từ Google Sheet theo chu kỳ này:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { val: 30, label: '30 Giây', sub: 'Quét siêu nhanh' },
              { val: 60, label: '60 Giây (1 Phút)', sub: 'Khuyên dùng (Chuẩn)', badge: 'Mặc định' },
              { val: 120, label: '2 Phút', sub: '120 giây' },
              { val: 300, label: '5 Phút', sub: '300 giây' },
            ].map(opt => {
              const isSelected = scanInterval === opt.val;
              return (
                <button
                  key={opt.val}
                  type="button"
                  disabled={!isAdmin}
                  onClick={() => setScanInterval(opt.val)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-400/30 shadow-2xs'
                      : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {opt.badge && (
                    <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[9px] font-black uppercase">
                      {opt.badge}
                    </span>
                  )}
                  <div className="text-xs font-black text-slate-900">{opt.label}</div>
                  <div className="text-[10px] text-slate-500 font-medium mt-0.5">{opt.sub}</div>
                </button>
              );
            })}
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Section 3: Default Deduction & Reward Points */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-slate-900 uppercase tracking-wider">
              3. Mức Điểm Mặc Định Khi Đánh Giá (Thang 5.0đ)
            </label>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Áp dụng cho Nhắc nhở & Khen thưởng</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Box 1: Điểm trừ Nhắc nhở mặc định (YÊU CẦU: 0.5đ) */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-500 text-white">
                    <Megaphone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900">Điểm Trừ Nhắc Nhở Mặc Định</div>
                    <div className="text-[10px] text-slate-500">Mức điểm trừ sẵn khi mở phiếu</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-950 text-xs font-black font-mono">
                  {defaultPenalty}đ
                </span>
              </div>

              <div className="flex gap-2">
                {[-0.2, -0.5, -1.0].map(val => (
                  <button
                    key={val}
                    type="button"
                    disabled={!isAdmin}
                    onClick={() => setDefaultPenalty(val)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all border cursor-pointer ${
                      defaultPenalty === val
                        ? 'bg-amber-600 text-white border-amber-600 shadow-2xs scale-105'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {val}đ {val === -0.5 ? '★' : ''}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] text-slate-600 font-bold shrink-0">Tự nhập số:</span>
                <input
                  type="number"
                  step="0.1"
                  max="0"
                  value={defaultPenalty}
                  disabled={!isAdmin}
                  onChange={(e) => setDefaultPenalty(Number(e.target.value))}
                  className="w-24 px-2 py-1 bg-white rounded-lg border border-amber-300 text-xs font-mono font-bold text-center text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
            </div>

            {/* Box 2: Điểm cộng Khen thưởng mặc định */}
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-600 text-white">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900">Điểm Cộng Khen Thưởng Mặc Định</div>
                    <div className="text-[10px] text-slate-500">Mức thưởng cộng sẵn khi mở phiếu</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-950 text-xs font-black font-mono">
                  +{defaultReward}đ
                </span>
              </div>

              <div className="flex gap-2">
                {[0.2, 0.5, 1.0].map(val => (
                  <button
                    key={val}
                    type="button"
                    disabled={!isAdmin}
                    onClick={() => setDefaultReward(val)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all border cursor-pointer ${
                      defaultReward === val
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs scale-105'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    +{val}đ {val === 0.5 ? '★' : ''}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] text-slate-600 font-bold shrink-0">Tự nhập số:</span>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={defaultReward}
                  disabled={!isAdmin}
                  onChange={(e) => setDefaultReward(Number(e.target.value))}
                  className="w-24 px-2 py-1 bg-white rounded-lg border border-emerald-300 text-xs font-mono font-bold text-center text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Section 4: Sheet Name for Store Staff */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-4 h-4 text-emerald-700" />
            4. Tên Sheet Nhân Sự Điểm Bán Để Đồng Bộ
          </label>
          <input
            type="text"
            value={staffSheetName}
            disabled={!isAdmin}
            onChange={(e) => setStaffSheetName(e.target.value)}
            placeholder="👥 Nhân sự điểm bán"
            className="w-full max-w-md px-3.5 py-2.5 bg-slate-50 rounded-2xl border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition-all disabled:opacity-60 shadow-2xs"
          />
          <p className="text-[11px] text-slate-500 font-medium">
            Hệ thống sẽ tìm sheet có chứa từ khóa này để đồng bộ danh sách mã nhân viên, họ tên và phân quyền nhân sự điểm bán.
          </p>
        </div>

        <hr className="border-slate-100" />

        {/* Section 5: Chu kỳ tự động đồng bộ nhân sự (1 tiếng 1 lần) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-700" />
              5. Chu Kỳ Tự Động Đồng Bộ Nhân Sự (Google Sheet ➔ App)
            </label>
            <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Quét ngầm định kỳ
            </span>
          </div>

          <p className="text-[11px] text-slate-500 font-medium">
            Hệ thống sẽ chạy ngầm và tự động quét sheet <strong>"{staffSheetName}"</strong> để bổ sung ngay các bạn nhân sự mới vào hệ thống:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {[
              { val: 1, label: '1 Tiếng', sub: 'Mỗi 60 phút', badge: 'Khuyên dùng' },
              { val: 2, label: '2 Tiếng', sub: 'Mỗi 120 phút' },
              { val: 6, label: '6 Tiếng', sub: '4 lần/ngày' },
              { val: 12, label: '12 Tiếng', sub: '2 lần/ngày' },
              { val: 24, label: '24 Tiếng', sub: '1 lần/ngày' },
            ].map(opt => {
              const isSelected = staffSyncInterval === opt.val;
              return (
                <button
                  key={opt.val}
                  type="button"
                  disabled={!isAdmin}
                  onClick={() => setStaffSyncInterval(opt.val)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-400/30 shadow-2xs'
                      : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {opt.badge && (
                    <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[9px] font-black uppercase">
                      {opt.badge}
                    </span>
                  )}
                  <div className="text-xs font-black text-slate-900">{opt.label}</div>
                  <div className="text-[10px] text-slate-500 font-medium mt-0.5">{opt.sub}</div>
                </button>
              );
            })}
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Section 6: Cấu hình Notification cho Web App */}
        <div className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-emerald-700" />
              6. Cơ Chế Thông Báo Web App (Web Push & Âm Thanh)
            </label>
            <span className="text-[11px] font-extrabold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
              Thông báo tức thì
            </span>
          </div>

          <p className="text-[11px] text-slate-500 font-medium">
            Mỗi khi nhân sự bị đánh giá, nhắc nhở hoặc được khen thưởng, hệ thống sẽ gửi thông báo đến chuông thông báo trong app và thông báo nổi của trình duyệt.
          </p>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900">Âm thanh chuông báo & Thông báo nổi trình duyệt</div>
                <div className="text-[11px] text-slate-500 font-medium">Phát âm thanh chuông nhẹ và bật popup thông báo khi có phản hồi mới</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={async () => {
                  playNotificationSound();
                  const granted = await requestBrowserNotificationPermission();
                  if (granted) {
                    triggerBrowserNotification('🌟 Thông báo thử nghiệm', 'Cơ chế thông báo Web App Staffpoint đang hoạt động hoàn hảo!');
                  } else {
                    alert('Âm thanh chuông đã phát. Vui lòng cho phép quyền thông báo (Allow Notifications) trên trình duyệt để nhận thông báo nổi!');
                  }
                }}
                className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
              >
                🔔 Test thử thông báo
              </button>

              <button
                type="button"
                disabled={!isAdmin}
                onClick={() => setEnableNotifications(!enableNotifications)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  enableNotifications ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    enableNotifications ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* KHỐI: BỘ NHỚ ĐỆM & CẬP NHẬT APP (1 CHẠM) */}
        <div className="p-4 sm:p-5 rounded-3xl bg-slate-50 border border-slate-200/80 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 shadow-2xs">
              <RefreshCw className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900 flex items-center gap-2">
                <span>Bộ Nhớ Đệm & Cập Nhật Phiên Bản</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-[10px] font-mono font-black">v1.037</span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                Xoá sạch bộ nhớ đệm (CacheStorage) và nạp lại phiên bản mới nhất ngay lập tức mà không cần cài lại app.
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={async () => {
              const { forceRefreshAppCache } = await import('../../utils/cacheManager');
              await forceRefreshAppCache();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-200 font-black text-xs shadow-2xs transition-all active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-700" />
            <span>Xoá Cache & Tải Lại App</span>
          </button>
        </div>

        {/* Save Bar at Bottom */}
        {isAdmin && (
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <Info className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Cấu hình này được lưu trực tiếp và áp dụng tức thì cho toàn bộ người dùng app.</span>
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] hover:from-[#143225] hover:to-[#22533e] text-white font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSaved ? 'Đã lưu cấu hình!' : 'Lưu Thay Đổi'}</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
