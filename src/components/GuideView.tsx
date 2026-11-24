import React, { useState } from 'react';
import { 
  BookOpen, 
  Award, 
  HeartHandshake, 
  Lock, 
  ShieldAlert, 
  Smartphone, 
  Key, 
  Users, 
  Plus, 
  Clock, 
  Bell, 
  Sparkles, 
  HelpCircle,
  CheckCircle2,
  FileText
} from 'lucide-react';

export const GuideView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'app_manual' | 'core_values'>('app_manual');

  return (
    <div className="space-y-5 pb-24 max-w-4xl mx-auto">
      
      {/* Header Banner - Formal SOP Style */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider border border-slate-700">
            <FileText className="w-3.5 h-3.5" />
            <span>TÀI LIỆU QUY TRÌNH THAO TÁC CHUẨN (SOP) • STAFFPOINT v1.041</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-heading tracking-tight text-white">
            HƯỚNG DẪN THAO TÁC HỆ THỐNG ĐÁNH GIÁ NHÂN SỰ
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl leading-relaxed">
            Công ty TNHH Nhà Của Thời Thanh Xuân. Quy định chi tiết các bước cài đặt, đăng nhập, theo dõi bậc lương, lập phiếu đánh giá cá nhân và theo ca làm việc.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveTab('app_manual')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
              activeTab === 'app_manual'
                ? 'bg-emerald-600 text-white shadow-md scale-102'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Hướng Dẫn Thao Tác Ứng Dụng (Có Hình Ảnh)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('core_values')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
              activeTab === 'core_values'
                ? 'bg-emerald-600 text-white shadow-md scale-102'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Quy Định Điểm Số & Khung Chế Tài</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: HƯỚNG DẪN THAO TÁC ỨNG DỤNG                                        */}
      {/* ========================================================================= */}
      {activeTab === 'app_manual' && (
        <div className="space-y-6 animate-in fade-in duration-200">

          {/* SECTION 1: Cài App */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                1
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">1. Cài Đặt Ứng Dụng Lên Màn Hình Chính (PWA)</h3>
                <p className="text-xs text-slate-500 font-medium">Ghim web app lên màn hình chính thiết bị di động cá nhân</p>
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
                <span className="font-extrabold text-slate-900">• iOS (iPhone / Safari):</span>
                <p className="text-slate-600 leading-relaxed">
                  Nhấn nút <strong>Chia sẻ (⎋ / 📤)</strong> → Chọn <strong>"Thêm vào MH chính" (➕)</strong> → Nhấn <strong>"Thêm"</strong>.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-extrabold text-slate-900">• Android (Google Chrome):</span>
                <p className="text-slate-600 leading-relaxed">
                  Nhấn biểu tượng <strong>Tùy chọn (⋮)</strong> → Chọn <strong>"Cài đặt ứng dụng"</strong> hoặc <strong>"Thêm vào Màn hình chính"</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 2: Đăng Nhập */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                2
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">2. Đăng Nhập & Bảo Mật Mật Khẩu</h3>
                <p className="text-xs text-slate-500 font-medium">Xác thực mã nhân viên và thiết lập mật khẩu cá nhân</p>
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

            <div className="space-y-1.5 text-xs text-slate-700 leading-relaxed font-medium">
              <p>• <strong>Mã nhân viên:</strong> Nhập chính xác mã định danh được cấp (VD: <code>TTX005</code>, <code>TTX009</code>...).</p>
              <p>• <strong>Mật khẩu mặc định:</strong> <code>123456</code> (Hệ thống yêu cầu đổi mật khẩu mới tối thiểu 6 ký tự tại lần đăng nhập đầu tiên).</p>
              <p>• <strong>Lưu phiên làm việc:</strong> Tích chọn <em>"Ghi nhớ đăng nhập trọn đời"</em> để duy trì đăng nhập trên thiết bị.</p>
            </div>
          </div>

          {/* SECTION 3: Bảng Điểm & Bậc Lương */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                3
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">3. Cơ Cấu Điểm Số & Bảng Bậc Lương</h3>
                <p className="text-xs text-slate-500 font-medium">Thang điểm 5.0 (Khung chung 70% + Chuyên môn 30%) & Quỹ 100 điểm nội quy</p>
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
                  Bảng điều khiển Tổng quan điểm số và bậc lương
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
                  Phân tích cấu phần điểm: 70% Khung chung & 30% Chuyên môn
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium space-y-1.5">
              <p>• <strong>Bậc 5 (4.80 - 5.00 điểm):</strong> Hệ số lương <strong>1.05</strong> (Xuất sắc / Vượt chuẩn).</p>
              <p>• <strong>Bậc 4 (4.50 - 4.79 điểm):</strong> Hệ số lương <strong>1.00</strong> (Hoàn thành tốt / Đạt chuẩn).</p>
              <p>• <strong>Bậc 3 (4.00 - 4.49 điểm):</strong> Hệ số lương <strong>0.95</strong> (Đạt yêu cầu cơ bản).</p>
              <p>• <strong>Bậc 2 (3.50 - 3.99 điểm):</strong> Hệ số lương <strong>0.90</strong> (Cần cải thiện chất lượng).</p>
              <p>• <strong>Bậc 1 (Dưới 3.50 điểm):</strong> Hệ số lương <strong>0.85</strong> (Tập sự / Cần kèm cặp).</p>
              <p>• <strong>Quỹ 100 điểm:</strong> Cấp định mức 100 điểm/tháng. Vi phạm nội quy bị trừ trực tiếp. Chốt xét thưởng chuyên cần cuối kỳ.</p>
            </div>
          </div>

          {/* SECTION 4: Tạo Phản Hồi (3 Nghiệp Vụ) */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                4
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">4. Quy Trình Lập Phiếu Phản Hồi (3 Nghiệp Vụ Cốt Lõi)</h3>
                <p className="text-xs text-slate-500 font-medium">Nhấn nút tác vụ nổi [ ＋ ] tại góc màn hình</p>
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
                  Hộp thoại 3 nghiệp vụ: Khen thưởng, Vi phạm hoặc Nội quy
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
                  Biểu mẫu nhập liệu phản hồi cho đối tượng Cá Nhân
                </p>
              </div>
            </div>

            <div className="space-y-1 text-xs text-slate-700 leading-relaxed font-medium">
              <p>• <strong>Ghi nhận & Khen thưởng:</strong> Cộng điểm Thang điểm 5.0 đối với hành động tốt, hỗ trợ đồng đội.</p>
              <p>• <strong>Vi phạm tiêu chuẩn công việc:</strong> Trừ điểm Thang điểm 5.0 đối với sự cố quy trình kỹ thuật.</p>
              <p>• <strong>Đánh giá nội quy - chấp hành:</strong> Trừ điểm trực tiếp vào Quỹ 100 điểm đối với vi phạm nề nếp, giờ giấc, trang phục.</p>
            </div>
          </div>

          {/* SECTION 5: Chấm Theo Ca (Google Sheet) */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                5
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">5. Chấm Điểm Đồng Loạt Theo Ca (Google Sheet)</h3>
                <p className="text-xs text-slate-500 font-medium">Áp dụng cho Quản lý ca hoặc đánh giá tập thể ca làm việc</p>
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

            <div className="space-y-1.5 text-xs text-slate-700 leading-relaxed font-medium">
              <p>• Tại <strong>Bước 3: Đối tượng được lập</strong>, nhấn chọn tab <strong>`[ 👥 Theo Ca (Sheet) ]`</strong>.</p>
              <p>• Chọn Ngày, Bộ phận và Ca làm việc → Hệ thống tự động truy xuất danh sách nhân sự có lịch làm việc trong ca.</p>
              <p>• Mã phiếu phát hành định dạng <code>CA-YYMM-XXX</code>, đồng thời ghi nhận điểm số cho tất cả nhân sự được chọn trong ca.</p>
            </div>
          </div>

          {/* SECTION 6: Thông Báo & Kháng Nghị 48h */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                6
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">6. Trung Tâm Thông Báo & Thời Hạn Kháng Nghị 48 Giờ</h3>
                <p className="text-xs text-slate-500 font-medium">Nhấn biểu tượng Chuông 🔔 trên thanh tiêu đề</p>
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
                  Trung tâm thông báo và thời hạn khiếu nại trong 48 giờ
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
                  Sổ Nhật Ký: Tra cứu mã định danh TD-, VP-, NQ-, CA-
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium">
              <strong>Thời hạn giải trình 48 giờ:</strong> Mọi phiếu nhắc nhở / vi phạm có hiệu lực chờ trong 48 giờ. Nhân sự có quyền đối thoại trực tiếp với người lập hoặc gửi giải trình đến Trưởng phòng Nhân sự / Quản trị viên để được xem xét hủy phiếu và hoàn trả điểm.
            </div>
          </div>

          {/* SECTION 7: Trợ Lý AI NCTTX */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                7
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">7. Tra Cứu Quy Chế Qua Trợ Lý AI</h3>
                <p className="text-xs text-slate-500 font-medium">Nhấn biểu tượng nút tròn [ ✦ ] tại góc dưới bên trái màn hình</p>
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
              <p>• Nhập câu hỏi bằng tiếng Việt: <em>"Quy định đi trễ trừ bao nhiêu điểm?", "Tiêu chuẩn phân loại rác?", "Điều kiện đạt Bậc 5 lương?"...</em></p>
              <p>• Hệ thống AI tự động đối chiếu cơ sở dữ liệu Nội quy lao động và Sổ tay nhân sự để phản hồi điều khoản tương ứng.</p>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: QUY ĐỊNH ĐIỂM SỐ & KHUNG CHẾ TÀI                                    */}
      {/* ========================================================================= */}
      {activeTab === 'core_values' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 space-y-3">
            <div className="flex items-center space-x-2 text-slate-900">
              <HeartHandshake className="w-5 h-5 text-emerald-700" />
              <h3 className="text-sm sm:text-base font-black font-heading text-slate-900">1. Quy Trình Ghi Nhận & Nhắc Nhở Hai Chiều</h3>
            </div>

            <div className="space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              <p>
                • <strong>Nguyên tắc bình đẳng:</strong> Mọi nhân sự có quyền lập phiếu Khen thưởng hoặc Biên bản vi phạm đối với đồng nghiệp hoặc cấp Quản lý trực tiếp khi có căn cứ rõ ràng.
              </p>
              <p>
                • <strong>Tác động điểm số:</strong> Phiếu Khen thưởng cộng điểm tích lũy vào Thang 5.0; Phiếu Vi phạm trừ điểm chuyên môn trong Thang 5.0.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 space-y-3">
            <div className="flex items-center space-x-2 text-slate-900">
              <Award className="w-5 h-5 text-emerald-700" />
              <h3 className="text-sm sm:text-base font-black font-heading text-slate-900">2. Bậc Lương Cách Làm Việc (P2)</h3>
            </div>

            <div className="space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              <p>
                • <strong>Bậc cách làm việc (P2):</strong> Đánh giá định kỳ hàng tháng xếp Bậc từ 1 đến 5 tương ứng với hệ số lương từ 0.85 đến 1.05.
              </p>
              <p>
                • <strong>Cấp chức danh bổ nhiệm:</strong> Do Ban Giám Đốc phê duyệt dựa trên quá trình công tác và năng lực thực tế.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-amber-200 bg-amber-50/40 space-y-3">
            <div className="flex items-center space-x-2 text-amber-900">
              <Lock className="w-5 h-5 text-amber-700" />
              <h3 className="text-sm sm:text-base font-black font-heading text-amber-950">3. Quy Chế Bảo Mật Thu Nhập Cá Nhân</h3>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-amber-200 text-xs sm:text-sm text-slate-800 font-bold">
              Vi phạm tiết lộ hoặc trao đổi thu nhập cá nhân bị xử lý kỷ luật trừ trực tiếp <strong>1 Bậc P2</strong> của kỳ đánh giá đó (sàn Bậc 1).
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
