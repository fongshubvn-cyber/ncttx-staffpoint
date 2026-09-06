import React from 'react';
import { History, FileSpreadsheet, CheckCircle, ExternalLink, Calendar } from 'lucide-react';

export const HistoryView: React.FC = () => {
  const historyList = [
    {
      id: 'EV-2026-005',
      staffName: 'Hồ Đăng Phong',
      staffId: 'TTX029',
      period: '2026-Q3',
      line: 'Thương mại & Dịch vụ',
      createdDate: '2026-08-25',
      techTier: 'Chuyên gia',
      mgmtTier: 'Trưởng phòng',
      workTier: 'Bậc 5',
      link: 'https://docs.google.com/spreadsheets/d/11MTqXm-_KEPC7FBCE9ksYIZo0ad5Z-U4ocZIW6-OQpY/edit?usp=drivesdk',
    },
    {
      id: 'EV-2026-004',
      staffName: 'Nguyễn Trọng Duy',
      staffId: 'TTX017',
      period: '2026-08-07 Phát sinh',
      line: 'Thương mại & Dịch vụ',
      createdDate: '2026-08-07',
      techTier: 'Chuyên viên',
      mgmtTier: 'Trưởng phòng',
      workTier: 'Bậc 5',
      link: 'https://docs.google.com/spreadsheets/d/11Yu-g4Cln-m9ZvwwvMB18a2Lc4JWelcCahnLwrgkAM8/edit?usp=drivesdk',
    },
    {
      id: 'EV-2026-003',
      staffName: 'Nguyễn Trọng Duy',
      staffId: 'TTX017',
      period: '2026-08-05 Phát sinh',
      line: 'Thương mại & Dịch vụ',
      createdDate: '2026-08-05',
      techTier: 'Chuyên viên',
      mgmtTier: 'Trưởng phòng',
      workTier: 'Bậc 4',
      link: 'https://docs.google.com/spreadsheets/d/1DjsY0kXObgzeFQbt-S4bnFF_rX287D5GX44XnbMX_T4/edit?usp=drivesdk',
    }
  ];

  return (
    <div className="space-y-6">
      
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-semibold mb-2">
          <History className="w-3.5 h-3.5" />
          <span>Lịch sử xuất phiếu & Tổng hợp kết quả kỳ</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Lịch Sử Đánh Giá & Tổng Hợp Kỳ
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Lưu vết tự động mỗi lần xuất phiếu đánh giá và thu kết quả theo từng đợt của công ty.
        </p>
      </div>

      <div className="glass-card rounded-xl p-6 space-y-4">
        <div className="flex items-center space-x-2">
          <FileSpreadsheet className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-bold text-white">Danh Sách Phiếu Đã Tạo Trong Đợt</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] font-bold border-b border-slate-800">
              <tr>
                <th className="p-3">Mã NV</th>
                <th className="p-3">Họ tên nhân sự</th>
                <th className="p-3">Đợt đánh giá</th>
                <th className="p-3">Tuyến / Ngạch</th>
                <th className="p-3">Ngày tạo phiếu</th>
                <th className="p-3">Bậc cách làm việc (P2)</th>
                <th className="p-3">Đường dẫn phiếu Sheet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {historyList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-mono font-bold text-slate-400">{item.staffId}</td>
                  <td className="p-3 font-bold text-white">{item.staffName}</td>
                  <td className="p-3 font-semibold text-purple-300">{item.period}</td>
                  <td className="p-3 text-slate-300">{item.line}</td>
                  <td className="p-3 text-slate-400">{item.createdDate}</td>
                  <td className="p-3">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/40 font-bold">
                      {item.workTier}
                    </span>
                  </td>
                  <td className="p-3">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-indigo-400 hover:text-indigo-300 underline font-medium"
                    >
                      <span>Xem Sheet</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
