import React from 'react';
import { BookOpen, Award, HeartHandshake, Lock, Leaf, ShieldAlert } from 'lucide-react';

export const GuideView: React.FC = () => {
  return (
    <div className="space-y-4 pb-20">
      
      {/* Brand Header Banner */}
      <div className="mobile-card p-6 space-y-2 border border-emerald-900/10 bg-white shadow-sm">
        <div className="flex items-center space-x-2 text-[#2D6A4F] text-xs font-black font-heading uppercase tracking-wider">
          <Leaf className="w-4 h-4 text-[#2D6A4F]" />
          <span>Nhà Của Thời Thanh Xuân • Brand Rules</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black font-heading text-[#1B4332] tracking-tight">
          Hướng Dẫn Quy Trình & Giá Trị Cốt Lõi ✨
        </h2>
      </div>

      {/* Guide Cards */}
      <div className="space-y-4">
        
        {/* Card 1: Ghi nhận & Nhắc nhở */}
        <div className="mobile-card p-5 space-y-3 border border-slate-100 shadow-sm">
          <div className="flex items-center space-x-2 text-[#1B4332]">
            <HeartHandshake className="w-6 h-6 text-[#2D6A4F]" />
            <h3 className="text-base sm:text-lg font-black font-heading text-[#1B4332]">1. Quy Trình Ghi Nhận & Nhắc Nhở</h3>
          </div>

          <div className="space-y-2.5 text-sm text-[#2D3748] leading-relaxed font-medium">
            <p>
              • <strong className="text-[#1B4332]">Tôn trọng & Độc lập:</strong> Mọi bạn nhân sự khi vào app đều có quyền gửi lời <strong className="text-[#2D6A4F] font-bold">Khen thưởng 🌟</strong> hoặc <strong className="text-[#DD6B20] font-bold">Nhắc nhở vi phạm 📢</strong> cho đồng nghiệp hay Cấp trên / Quản lý.
            </p>
            <p>
              • <strong className="text-[#1B4332]">Tác động điểm lường:</strong>
              <br />
              - Nhóm <em>Khen thưởng</em> bắt đầu từ 0.0 điểm, tăng dần khi được ghi nhận.
              <br />
              - Nhóm <em>Vi phạm</em> bắt đầu từ 5.0 điểm, giảm dần khi có biên bản nhắc nhở được duyệt.
            </p>
          </div>
        </div>

        {/* Card 2: Bậc lương & Cấp bậc */}
        <div className="mobile-card p-5 space-y-3 border border-slate-100 shadow-sm">
          <div className="flex items-center space-x-2 text-[#2D6A4F]">
            <Award className="w-6 h-6" />
            <h3 className="text-base sm:text-lg font-black font-heading text-[#1B4332]">2. Bậc Lương Cách Làm Việc (P2)</h3>
          </div>

          <div className="space-y-2.5 text-sm text-[#2D3748] leading-relaxed font-medium">
            <p>
              • <strong className="text-[#1B4332]">Bậc cách làm việc (P2):</strong> Phiếu tháng cho ra Bậc từ 1 đến 5 (tương ứng với các khoảng tỷ lệ đạt từ dưới 40% cho đến trên 85%).
            </p>
            <p>
              • <strong className="text-[#1B4332]">Cấp bổ nhiệm:</strong> Do Ban Giám Đốc quyết định bổ nhiệm dựa trên năng lực và phẩm chất thật.
            </p>
          </div>
        </div>

        {/* Card 3: Ngoại lệ bảo mật thu nhập */}
        <div className="mobile-card p-5 space-y-3 border border-amber-200 bg-amber-50/40 shadow-sm">
          <div className="flex items-center space-x-2 text-[#DD6B20]">
            <Lock className="w-6 h-6" />
            <h3 className="text-base sm:text-lg font-black font-heading text-[#1B4332]">3. Bảo Mật Thu Nhập Cá Nhân</h3>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-amber-200 text-sm text-[#2D3748] font-bold">
            ⚠️ Vi phạm bảo mật thu nhập cá nhân bị trừ thẳng <strong className="text-rose-600">1 Bậc P2</strong> của tháng đó (sàn là Bậc 1).
          </div>
        </div>

      </div>

    </div>
  );
};
