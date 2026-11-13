import React, { useState, useEffect } from 'react';
import { 
  X, 
  Smartphone, 
  Share, 
  PlusSquare, 
  Check, 
  Copy, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles,
  Info,
  ShieldCheck,
  RefreshCw,
  MoreVertical,
  Download
} from 'lucide-react';

interface AppInstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppInstallGuideModal: React.FC<AppInstallGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  // Auto-detect OS: default to iOS if on iPhone/iPad, otherwise Android
  const [platform, setPlatform] = useState<'ios' | 'android'>('ios');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const ua = navigator.userAgent || '';
      if (/iPhone|iPad|iPod/i.test(ua)) {
        setPlatform('ios');
      } else if (/Android/i.test(ua)) {
        setPlatform('android');
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://fongshubvn-cyber.github.io/ncttx-staffpoint/';

  const handleCopyUrl = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(currentUrl);
      } else {
        const input = document.createElement('input');
        input.value = currentUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-fade-in print:hidden">
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 flex flex-col max-h-[92vh] my-auto animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#1B4332] via-[#2D6A4F] to-[#1B4332] text-white p-4 sm:p-5 flex items-center justify-between relative shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-300 border border-white/20 shadow-inner shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black font-heading tracking-tight">
                  Cài Đặt Staffpoint Lên Màn Hình
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-emerald-950 text-[10px] font-black uppercase tracking-wider">
                  1 Chạm
                </span>
              </div>
              <p className="text-xs text-emerald-100 font-medium mt-0.5">
                Dùng mượt mà như app tải từ App Store / Google Play
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Platform Tabs Selector */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 border-b border-slate-200 shrink-0">
          <button
            type="button"
            onClick={() => setPlatform('ios')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
              platform === 'ios'
                ? 'bg-white text-[#1B4332] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="text-base">🍎</span>
            <span>iPhone / iPad (iOS)</span>
          </button>

          <button
            type="button"
            onClick={() => setPlatform('android')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
              platform === 'android'
                ? 'bg-white text-[#1B4332] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="text-base">🤖</span>
            <span>Android (Samsung, Xiaomi...)</span>
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-slate-800 text-xs sm:text-sm">
          
          {/* TAB 1: IPHONE / IOS SAFARI */}
          {platform === 'ios' && (
            <div className="space-y-3.5">
              
              {/* Important Note for iOS */}
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-extrabold text-amber-950">Lưu ý quan trọng trên iPhone:</strong> Phải mở link bằng trình duyệt <strong className="underline">Safari</strong> của Apple. Nếu đang mở link từ Zalo hay Facebook, bấm vào góc trên bên phải chọn <em>"Mở bằng trình duyệt Safari"</em>.
                </div>
              </div>

              {/* Step List */}
              <div className="space-y-2.5">
                
                {/* Step 1 */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-700 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    1
                  </div>
                  <div className="space-y-0.5 flex-1">
                    <div className="font-extrabold text-slate-900 text-xs sm:text-sm">
                      Mở link bằng trình duyệt Safari
                    </div>
                    <div className="text-[11px] sm:text-xs text-slate-500">
                      Đảm bảo bạn đang truy cập trang web này trên trình duyệt Safari mặc định của máy.
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-700 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    2
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5 flex-wrap">
                      <span>Bấm nút Chia sẻ</span>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-emerald-800 font-bold text-[10px]">
                        <Share className="w-3 h-3 text-emerald-700" /> Share
                      </span>
                    </div>
                    <div className="text-[11px] sm:text-xs text-slate-500">
                      Biểu tượng hình vuông có mũi tên chỉ lên (ở chính giữa thanh công cụ dưới đáy Safari).
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-700 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    3
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5 flex-wrap">
                      <span>Chọn "Thêm vào MH chính"</span>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-emerald-800 font-bold text-[10px]">
                        <PlusSquare className="w-3 h-3 text-emerald-700" /> Add to Home Screen
                      </span>
                    </div>
                    <div className="text-[11px] sm:text-xs text-slate-500">
                      Vuốt danh sách tùy chọn lên một chút để thấy dòng có biểu tượng dấu cộng [+].
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-700 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    4
                  </div>
                  <div className="space-y-0.5 flex-1">
                    <div className="font-extrabold text-slate-900 text-xs sm:text-sm">
                      Bấm "Thêm" (Add) ở góc trên bên phải
                    </div>
                    <div className="text-[11px] sm:text-xs text-slate-500">
                      Tên ứng dụng được đặt sẵn là <strong>Staffpoint</strong> với icon logo mầm cây xanh của Nhà Của Thời Thanh Xuân.
                    </div>
                  </div>
                </div>

              </div>

              {/* Success Badge */}
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center gap-2.5 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Icon <strong>Staffpoint</strong> sẽ nằm trên màn hình chính của iPhone, mở 1 chạm là vào thẳng app toàn màn hình!</span>
              </div>

            </div>
          )}

          {/* TAB 2: ANDROID / GOOGLE CHROME */}
          {platform === 'android' && (
            <div className="space-y-3.5">
              
              {/* Important Note for Android */}
              <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 text-xs font-medium flex items-start gap-2.5">
                <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  Nên sử dụng trình duyệt <strong className="font-extrabold text-emerald-900">Google Chrome</strong> (mặc định có sẵn trên hầu hết các dòng máy Samsung, Xiaomi, Oppo, Vivo, Realme, Pixel...).
                </div>
              </div>

              {/* Step List */}
              <div className="space-y-2.5">
                
                {/* Step 1 */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-700 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    1
                  </div>
                  <div className="space-y-0.5 flex-1">
                    <div className="font-extrabold text-slate-900 text-xs sm:text-sm">
                      Mở link bằng Google Chrome
                    </div>
                    <div className="text-[11px] sm:text-xs text-slate-500">
                      Truy cập đường link web app trên trình duyệt Google Chrome.
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-700 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    2
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5 flex-wrap">
                      <span>Bấm Menu 3 chấm dọc</span>
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-emerald-800 font-bold text-[10px]">
                        <MoreVertical className="w-3 h-3 text-emerald-700" /> Menu
                      </span>
                    </div>
                    <div className="text-[11px] sm:text-xs text-slate-500">
                      Nút 3 chấm nằm ở góc trên cùng bên phải màn hình Chrome.
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-700 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    3
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5 flex-wrap">
                      <span>Chọn "Cài đặt ứng dụng" hoặc "Thêm vào màn hình chính"</span>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-emerald-800 font-bold text-[10px]">
                        <Download className="w-3 h-3 text-emerald-700" /> Install app
                      </span>
                    </div>
                    <div className="text-[11px] sm:text-xs text-slate-500">
                      Tìm dòng có chữ <strong>"Cài đặt ứng dụng"</strong> (Install) hoặc <strong>"Thêm vào màn hình chính"</strong>.
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-700 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    4
                  </div>
                  <div className="space-y-0.5 flex-1">
                    <div className="font-extrabold text-slate-900 text-xs sm:text-sm">
                      Bấm xác nhận "Cài đặt" (hoặc "Thêm")
                    </div>
                    <div className="text-[11px] sm:text-xs text-slate-500">
                      Chờ 2-3 giây để điện thoại hoàn tất thêm icon ra màn hình chính.
                    </div>
                  </div>
                </div>

              </div>

              {/* Success Badge */}
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center gap-2.5 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Ứng dụng sẽ nằm trên màn hình chính và danh sách app y hệt như tải từ Google Play!</span>
              </div>

            </div>
          )}

          {/* Quick Copy Link Box */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
                <span>Link ứng dụng để dán vào Safari / Chrome:</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input 
                type="text" 
                readOnly 
                value={currentUrl} 
                className="flex-1 bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-600 font-mono truncate select-all focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopyUrl}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer shrink-0 ${
                  copied
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-[#1B4332] hover:bg-[#2D6A4F] text-white shadow-xs active:scale-95'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Đã Chép!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Sao Chép</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 3 Key Benefits */}
          <div className="grid grid-cols-3 gap-2 pt-1 text-center">
            <div className="p-2.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
              <Sparkles className="w-4 h-4 text-emerald-700 mx-auto" />
              <div className="text-[11px] font-extrabold text-emerald-950">1 Chạm Mở App</div>
              <div className="text-[9px] text-slate-500">Toàn màn hình không vướng thanh web</div>
            </div>

            <div className="p-2.5 rounded-2xl bg-teal-50/60 border border-teal-100 space-y-1">
              <ShieldCheck className="w-4 h-4 text-teal-700 mx-auto" />
              <div className="text-[11px] font-extrabold text-teal-950">Lưu Đăng Nhập</div>
              <div className="text-[9px] text-slate-500">Không bao giờ lo bị văng tài khoản</div>
            </div>

            <div className="p-2.5 rounded-2xl bg-slate-100/70 border border-slate-200/80 space-y-1">
              <RefreshCw className="w-4 h-4 text-slate-700 mx-auto" />
              <div className="text-[11px] font-extrabold text-slate-900">Tự Cập Nhật</div>
              <div className="text-[9px] text-slate-500">Vuốt xuống để nhận bản mới nhất</div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2 shrink-0">
          <div className="text-[11px] text-slate-500 font-medium">
            💡 Không tốn bộ nhớ máy (~1MB)
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-xs"
          >
            Đã Hiểu
          </button>
        </div>

      </div>
    </div>
  );
};

