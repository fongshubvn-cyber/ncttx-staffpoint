import React, { useState } from 'react';
import { 
  BookOpen, 
  Award, 
  HeartHandshake, 
  Lock, 
  Leaf, 
  ShieldAlert, 
  Smartphone, 
  Key, 
  Users, 
  Plus, 
  Clock, 
  Bell, 
  Sparkles, 
  HelpCircle,
  ExternalLink,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

export const GuideView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'app_manual' | 'core_values'>('app_manual');

  return (
    <div className="space-y-5 pb-24 max-w-4xl mx-auto">
      
      {/* Brand Header Banner */}
      <div className="bg-gradient-to-br from-[#1B4332] via-[#2D6A4F] to-emerald-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Leaf className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-emerald-200 text-xs font-black uppercase tracking-wider border border-white/20">
            <Leaf className="w-3.5 h-3.5 text-emerald-300" />
            <span>Nhà Của Thời Thanh Xuân • Sổ Tay Nhân Sự v1.040</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white">
            Cẩm Nang Hướng Dẫn & Quy Chuẩn Nhà 🌿
          </h2>

          <p className="text-xs sm:text-sm text-emerald-100 font-medium max-w-2xl leading-relaxed">
            Dành riêng cho tập thể nhân sự (Nhà, Quán, Xưởng). Đồng hành cùng cả Người nói và Người điếc / khiếm thính trong từng ca làm việc bình yên và tử tế.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="mt-5 pt-4 border-t border-white/15 flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveTab('app_manual')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
              activeTab === 'app_manual'
                ? 'bg-white text-[#1B4332] shadow-md scale-102'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Hướng Dẫn Sử Dụng App (Có Hình Ảnh)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('core_values')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
              activeTab === 'core_values'
                ? 'bg-white text-[#1B4332] shadow-md scale-102'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Quy Trình & Giá Trị Cốt Lõi</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: HƯỚNG DẪN SỬ DỤNG APP VỚI HÌNH ẢNH MINH HỌA TRỰC QUAN              */}
      {/* ========================================================================= */}
      {activeTab === 'app_manual' && (
        <div className="space-y-6 animate-in fade-in duration-200">

          {/* Quick Notice Card */}
          <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div className="text-xs text-emerald-900 leading-relaxed font-medium">
              <strong>Ghi nhớ:</strong> Toàn bộ giao diện StaffPoint được tối ưu cho cả <strong>Người nói</strong> và <strong>Người khiếm thính</strong>. Bạn có thể tự chấm điểm, xem bậc lương, theo dõi ca và trao đổi 100% bằng hình ảnh và văn bản trực quan.
            </div>
          </div>

          {/* SECTION 1: Cài App */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
                1
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Cài Đặt App Lên Màn Hình Chính Điện Thoại</h3>
                <p className="text-xs text-slate-500 font-medium">Ghim web app (PWA) để mở nhanh như ứng dụng thật</p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
              <img 
                src="/guide-images/03_huong_dan_cai_app.png" 
                alt="Hướng dẫn cài app StaffPoint" 
                className="w-full max-h-96 object-contain mx-auto"
                loading="lazy"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-extrabold text-[#1B4332]">🍏 iPhone (Safari):</span>
                <p className="text-slate-600 leading-relaxed">
                  Bấm nút <strong>Chia sẻ (⎋ / 📤)</strong> dưới đáy màn hình Safari → Chọn <strong>"Thêm vào MH chính" (➕)</strong> → Bấm <strong>"Thêm"</strong>.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-extrabold text-teal-800">🤖 Android (Chrome):</span>
                <p className="text-slate-600 leading-relaxed">
                  Bấm biểu tượng <strong>Ba chấm (⋮)</strong> góc trên Chrome → Chọn <strong>"Cài đặt ứng dụng"</strong> hoặc <strong>"Thêm vào Màn hình chính"</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 2: Đăng Nhập */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
                2
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Đăng Nhập & Bảo Mật Mật Khẩu Cá Nhân</h3>
                <p className="text-xs text-slate-500 font-medium">Nhập mã nhân viên và mật khẩu bảo mật</p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
              <img 
                src="/guide-images/02_dang_nhap.png" 
                alt="Giao diện đăng nhập StaffPoint" 
                className="w-full max-h-96 object-contain mx-auto"
                loading="lazy"
              />
            </div>

            <div className="space-y-2 text-xs text-slate-700 leading-relaxed font-medium">
              <p>• <strong>Mã số nhân viên:</strong> Nhập mã định danh của bạn (VD: <code>TTX005</code>, <code>TTX009</code>...).</p>
              <p>• <strong>Mật khẩu mặc định lần đầu:</strong> <code>123456</code> (Hệ thống sẽ yêu cầu bạn đổi sang mật khẩu riêng để bảo vệ thông tin).</p>
              <p>• <strong>Ghi nhớ đăng nhập:</strong> Tích chọn <em>"Ghi nhớ đăng nhập trọn đời"</em> để không bị thoát ra khi tắt điện thoại.</p>
            </div>
          </div>

          {/* SECTION 3: Bảng Điểm & Bậc Lương */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
                3
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Hiểu Bảng Điểm & Bậc Lương Của Bạn</h3>
                <p className="text-xs text-slate-500 font-medium">Thang điểm 5.0 (Văn hóa 70% + Chuyên môn 30%) & Quỹ 100đ chấp hành</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                <img 
                  src="/guide-images/01_trang_chu.png" 
                  alt="Trang chủ tổng quan điểm số" 
                  className="w-full h-auto object-contain mx-auto"
                  loading="lazy"
                />
                <p className="text-[11px] text-center text-slate-500 font-bold p-2 bg-slate-100">
                  Trang Chủ: Điểm trung bình & Bậc lương cá nhân
                </p>
              </div>

              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                <img 
                  src="/guide-images/05_chi_tiet_ho_so.png" 
                  alt="Chi tiết hồ sơ nhân sự" 
                  className="w-full h-auto object-contain mx-auto"
                  loading="lazy"
                />
                <p className="text-[11px] text-center text-slate-500 font-bold p-2 bg-slate-100">
                  Hồ Sơ: Phân tách 70% Văn hóa, 30% Chuyên môn & Quỹ 100đ
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium space-y-1.5">
              <p>• <strong>Bậc 5 (4.80 - 5.00đ):</strong> Hệ số lương <strong>1.05</strong> (Xuất sắc).</p>
              <p>• <strong>Bậc 4 (4.50 - 4.79đ):</strong> Hệ số lương <strong>1.00</strong> (Chuẩn hoàn thành tốt).</p>
              <p>• <strong>Bậc 3 (4.00 - 4.49đ):</strong> Hệ số lương <strong>0.95</strong> (Đạt chuẩn nề nếp).</p>
              <p>• <strong>Quỹ 100đ Chấp Hành:</strong> Đầu tháng có 100đ, vi phạm nội quy bị trừ điểm, cuối tháng xét thưởng chuyên cần.</p>
            </div>
          </div>

          {/* SECTION 4: Tạo Phản Hồi (3 Chức Năng Cốt Lõi) */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
                4
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Lập Phiếu Phản Hồi (3 Chức Năng Cốt Lõi)</h3>
                <p className="text-xs text-slate-500 font-medium">Bấm nút tròn [＋] ở góc màn hình để bắt đầu</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                <img 
                  src="/guide-images/06_menu_chon_phan_hoi.png" 
                  alt="Menu 3 lựa chọn cốt lõi" 
                  className="w-full h-auto object-contain mx-auto"
                  loading="lazy"
                />
                <p className="text-[11px] text-center text-slate-500 font-bold p-2 bg-slate-100">
                  Hộp thoại chọn: Ghi nhận, Vi phạm hoặc Nội quy
                </p>
              </div>

              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                <img 
                  src="/guide-images/07_form_cham_ca_nhan.png" 
                  alt="Form lập phiếu cho cá nhân" 
                  className="w-full h-auto object-contain mx-auto"
                  loading="lazy"
                />
                <p className="text-[11px] text-center text-slate-500 font-bold p-2 bg-slate-100">
                  Giao diện lập phiếu chi tiết cho Cá Nhân
                </p>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-700 leading-relaxed font-medium">
              <p>🌟 <strong>Ghi nhận & Khen thưởng (+ Thang 5.0đ):</strong> Biểu dương đồng đội hỗ trợ việc tốt trong ca.</p>
              <p>⚠️ <strong>Vi phạm tiêu chuẩn công việc (- Thang 5.0đ):</strong> Nhắc nhở sai sót quy trình hoặc sự cố chuyên môn.</p>
              <p>📖 <strong>Đánh giá nội quy (Quỹ 100đ):</strong> Phản ánh vi phạm giờ giấc, đồng phục, bảo quản tài sản.</p>
            </div>
          </div>

          {/* SECTION 5: Chấm Theo Ca (Google Sheet) */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
                5
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Chấm Điểm Đồng Loạt Theo Ca (Google Sheet)</h3>
                <p className="text-xs text-slate-500 font-medium">Dành cho Trưởng ca hoặc đánh giá chung cả ca làm việc hôm nay</p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
              <img 
                src="/guide-images/08_form_cham_theo_ca.png" 
                alt="Chấm điểm đồng loạt theo ca làm việc" 
                className="w-full max-h-96 object-contain mx-auto"
                loading="lazy"
              />
            </div>

            <div className="space-y-2 text-xs text-slate-700 leading-relaxed font-medium">
              <p>• Tại <strong>Bước 3: Đối tượng được lập</strong>, bấm chọn tab <strong>`[ 👥 Theo Ca (Sheet) ]`</strong>.</p>
              <p>• Chọn Ngày, Bộ phận và Ca làm việc → Hệ thống tự động nhận diện danh sách nhân sự đi làm trong ca.</p>
              <p>• Mã phiếu sinh ra dạng <code>CA-YYMM-XXX</code>, tất cả thành viên trong ca đều được ghi nhận điểm minh bạch.</p>
            </div>
          </div>

          {/* SECTION 6: Thông Báo & Kháng Nghị 48h */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
                6
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Trung Tâm Thông Báo & Quyền Kháng Nghị Trong 48 Giờ</h3>
                <p className="text-xs text-slate-500 font-medium">Bấm vào biểu tượng Chuông 🔔 trên thanh đầu trang</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                <img 
                  src="/guide-images/10_trung_tam_thong_bao.png" 
                  alt="Trung tâm thông báo" 
                  className="w-full h-auto object-contain mx-auto"
                  loading="lazy"
                />
                <p className="text-[11px] text-center text-slate-500 font-bold p-2 bg-slate-100">
                  Trung tâm thông báo & Quyền khiếu nại trong 48h
                </p>
              </div>

              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                <img 
                  src="/guide-images/09_so_phan_hoi.png" 
                  alt="Sổ phản hồi" 
                  className="w-full h-auto object-contain mx-auto"
                  loading="lazy"
                />
                <p className="text-[11px] text-center text-slate-500 font-bold p-2 bg-slate-100">
                  Sổ Phản Hồi: Tra cứu mã phiếu TD-, VP-, NQ-, CA-
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 leading-relaxed font-medium">
              🤝 <strong>Quyền lắng nghe & giải trình trong 48 giờ:</strong> Nếu có phiếu nhắc nhở bạn cảm thấy chưa chính xác hoặc có hiểu lầm, bạn có trọn vẹn 48 giờ để gặp trao đổi với người lập hoặc báo Quản trị viên để đối thoại và làm rõ sự thật.
            </div>
          </div>

          {/* SECTION 7: Trợ Lý AI NCTTX */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
                7
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Trợ Lý AI NCTTX – Tra Cứu Nội Quy 24/7</h3>
                <p className="text-xs text-slate-500 font-medium">Bấm vào biểu tượng lấp lánh ✦ ở góc dưới bên trái màn hình</p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
              <img 
                src="/guide-images/11_tro_ly_ai_ncttx.png" 
                alt="Trợ lý AI NCTTX" 
                className="w-full max-h-96 object-contain mx-auto"
                loading="lazy"
              />
            </div>

            <div className="space-y-1 text-xs text-slate-700 leading-relaxed font-medium">
              <p>• Bạn có thể hỏi bất kỳ điều gì bằng tiếng Việt: <em>"4 dấu hiệu đổ rác là gì?", "Đi trễ bị trừ bao nhiêu điểm?", "Làm sao lên Bậc 5?"...</em></p>
              <p>• Trợ lý AI được học đầy đủ Sổ tay nhân sự và Nội quy lao động, sẵn sàng hỗ trợ bạn bất kỳ lúc nào.</p>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: QUY TRÌNH & GIÁ TRỊ CỐT LÕI (BRAND RULES)                          */}
      {/* ========================================================================= */}
      {activeTab === 'core_values' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          
          {/* Card 1: Ghi nhận & Nhắc nhở */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 space-y-3">
            <div className="flex items-center space-x-2 text-[#1B4332]">
              <HeartHandshake className="w-6 h-6 text-[#2D6A4F]" />
              <h3 className="text-base sm:text-lg font-black font-heading text-[#1B4332]">1. Quy Trình Ghi Nhận & Nhắc Nhở</h3>
            </div>

            <div className="space-y-2.5 text-xs sm:text-sm text-[#2D3748] leading-relaxed font-medium">
              <p>
                • <strong className="text-[#1B4332]">Tôn trọng & Độc lập:</strong> Mọi bạn nhân sự khi vào app đều có quyền gửi lời <strong className="text-[#2D6A4F] font-bold">Khen thưởng 🌟</strong> hoặc <strong className="text-[#DD6B20] font-bold">Nhắc nhở vi phạm 📢</strong> cho đồng nghiệp hay Cấp trên / Quản lý.
              </p>
              <p>
                • <strong className="text-[#1B4332]">Tác động điểm số:</strong>
                <br />
                - Nhóm <em>Khen thưởng</em> bắt đầu từ 0.0 điểm, tăng dần khi được ghi nhận.
                <br />
                - Nhóm <em>Vi phạm</em> bắt đầu từ 5.0 điểm, giảm dần khi có biên bản nhắc nhở được duyệt.
              </p>
            </div>
          </div>

          {/* Card 2: Bậc lương & Cấp bậc */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 space-y-3">
            <div className="flex items-center space-x-2 text-[#2D6A4F]">
              <Award className="w-6 h-6" />
              <h3 className="text-base sm:text-lg font-black font-heading text-[#1B4332]">2. Bậc Lương Cách Làm Việc (P2)</h3>
            </div>

            <div className="space-y-2.5 text-xs sm:text-sm text-[#2D3748] leading-relaxed font-medium">
              <p>
                • <strong className="text-[#1B4332]">Bậc cách làm việc (P2):</strong> Phiếu tháng cho ra Bậc từ 1 đến 5 (tương ứng với các khoảng tỷ lệ đạt từ dưới 40% cho đến trên 85%).
              </p>
              <p>
                • <strong className="text-[#1B4332]">Cấp bổ nhiệm:</strong> Do Ban Giám Đốc quyết định bổ nhiệm dựa trên năng lực và phẩm chất thật.
              </p>
            </div>
          </div>

          {/* Card 3: Ngoại lệ bảo mật thu nhập */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-amber-200 bg-amber-50/40 space-y-3">
            <div className="flex items-center space-x-2 text-[#DD6B20]">
              <Lock className="w-6 h-6" />
              <h3 className="text-base sm:text-lg font-black font-heading text-[#1B4332]">3. Bảo Mật Thu Nhập Cá Nhân</h3>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-amber-200 text-xs sm:text-sm text-[#2D3748] font-bold">
              ⚠️ Vi phạm bảo mật thu nhập cá nhân bị trừ thẳng <strong className="text-rose-600">1 Bậc P2</strong> của tháng đó (sàn là Bậc 1).
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
