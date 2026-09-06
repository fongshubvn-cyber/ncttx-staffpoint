import React, { useState, useEffect } from 'react';
import { Staff, IncidentRecord, DepartmentLine, ParameterConfig, AuthUser, Question } from '../../types';
import { getSalaryTierBadge } from '../../utils/calculator';
import { 
  BarChart3, 
  Printer, 
  Search, 
  Clock, 
  Award, 
  ShieldAlert, 
  User,
  FileSpreadsheet
} from 'lucide-react';
import { exportReportToGoogleSheet } from '../../utils/exportDrive';

interface Option1ReportViewProps {
  staffList: Staff[];
  incidents: IncidentRecord[];
  lines: DepartmentLine[];
  params: ParameterConfig;
  currentUser: AuthUser | null;
  questions?: Question[];
}

export const Option1ReportView: React.FC<Option1ReportViewProps> = ({
  staffList,
  incidents,
  lines,
  params,
  currentUser,
}) => {
  const [realtimeClock, setRealtimeClock] = useState<string>('');
  const [selectedStaffId, setSelectedStaffId] = useState<string>(staffList[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const dateStr = now.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
      setRealtimeClock(`${timeStr} - ${dateStr}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const selectedStaff = staffList.find(s => s.id === selectedStaffId) || staffList[0];
  const staffIncidents = selectedStaff ? incidents.filter(i => i.targetId === selectedStaff.id) : [];

  const handlePrint = () => {
    window.print();
  };

  const handleExportSheet = () => {
    if (selectedStaff) {
      exportReportToGoogleSheet(selectedStaff, 'Q3/2026', staffIncidents, params);
    }
  };

  if (!selectedStaff) return null;

  const overallScore = Math.round(((selectedStaff.generalScore * 0.4) + (selectedStaff.techScore * 0.6)) * 10) / 10;
  const tier = getSalaryTierBadge(overallScore);

  return (
    <div className="space-y-6 pb-12">
      {/* Printable Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-3xl shadow-sm border border-slate-200/80 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-900">Báo Cáo Phản Hồi & Bậc Lương P2</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-emerald-600 inline" />
            <span>Thời gian Realtime: {realtimeClock}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportSheet}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold border border-emerald-200 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Xuất Google Sheets</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold shadow-md transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>In Báo Cáo A4 / PDF</span>
          </button>
        </div>
      </div>

      {/* Staff Selection Dropdown */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 print:hidden space-y-3">
        <label className="block text-xs font-bold text-slate-800">Chọn Nhân Sự Xuất Báo Cáo:</label>
        <select
          value={selectedStaffId}
          onChange={(e) => setSelectedStaffId(e.target.value)}
          className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
        >
          {staffList.map((s) => (
            <option key={s.id} value={s.id}>
              {s.id} - {s.name} ({s.line})
            </option>
          ))}
        </select>
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/80 space-y-6 printable-report">
        {/* Company Header for Print */}
        <div className="border-b border-slate-200 pb-4 text-center">
          <h1 className="text-xl font-extrabold text-slate-900 uppercase tracking-tight">
            NHÀ CỦA THỜI THANH XUÂN - STAFFPOINT v3.0
          </h1>
          <p className="text-xs text-slate-500 mt-1">PHẦN MỀM GHI NHẬN PHẢN HỒI & ĐÁNH GIÁ NHÂN SỰ CHUẨN NĂNG LỰC P2</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Thời gian trích xuất: {realtimeClock}</p>
        </div>

        {/* Staff Profile Box */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Họ và Tên</span>
            <span className="text-sm font-bold text-slate-900">{selectedStaff.name}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Mã Nhân Sự</span>
            <span className="text-sm font-bold text-emerald-800">{selectedStaff.id}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Ngạch Phòng Ban</span>
            <span className="text-sm font-semibold text-slate-700">{selectedStaff.line}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Vị Trí / Vai Trò</span>
            <span className="text-sm font-semibold text-slate-700">{selectedStaff.role}</span>
          </div>
        </div>

        {/* Score & Tier Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
            <span className="text-xs text-emerald-800 font-medium block">Điểm Văn Hóa (40%)</span>
            <span className="text-2xl font-bold text-emerald-900 mt-1 block">{selectedStaff.generalScore} / 5.0</span>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200">
            <span className="text-xs text-teal-800 font-medium block">Điểm Chuyên Môn (60%)</span>
            <span className="text-2xl font-bold text-teal-900 mt-1 block">{selectedStaff.techScore} / 5.0</span>
          </div>

          <div className={`p-4 rounded-2xl border ${tier.bgClass} ${tier.textClass}`}>
            <span className="text-xs font-medium block opacity-80">Bậc Lương P2 Dự Kiến</span>
            <span className="text-2xl font-bold mt-1 block">{tier.label} ({overallScore}/5.0)</span>
          </div>
        </div>

        {/* Incident History Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
            Lịch Sử Ghi Nhận Phản Hồi ({staffIncidents.length} sự kiện)
          </h3>

          {staffIncidents.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-4 text-center">Không có sự kiện vi phạm hoặc khen thưởng nào trong kỳ.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold">
                    <th className="p-2 border border-slate-200">Loại</th>
                    <th className="p-2 border border-slate-200">Thời gian</th>
                    <th className="p-2 border border-slate-200">Tiêu đề / Nội dung</th>
                    <th className="p-2 border border-slate-200">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {staffIncidents.map((i) => (
                    <tr key={i.id} className="border-b border-slate-200">
                      <td className="p-2 border border-slate-200 font-bold">
                        {i.type === 'ghi_nhan' ? (
                          <span className="text-emerald-700">Tuyên Dương</span>
                        ) : (
                          <span className="text-rose-700">Vi Phạm</span>
                        )}
                      </td>
                      <td className="p-2 border border-slate-200">{i.date}</td>
                      <td className="p-2 border border-slate-200">
                        <div className="font-bold">{i.title}</div>
                        <div className="text-slate-600">{i.description}</div>
                      </td>
                      <td className="p-2 border border-slate-200 font-semibold">{i.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Signature Block */}
        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200 text-center text-xs">
          <div>
            <p className="font-bold text-slate-800">NHÂN SỰ ĐƯỢC ĐÁNH GIÁ</p>
            <p className="text-[10px] text-slate-400 mt-1">(Ký và ghi rõ họ tên)</p>
            <div className="h-16"></div>
            <p className="font-bold text-slate-700">{selectedStaff.name}</p>
          </div>

          <div>
            <p className="font-bold text-slate-800">TRƯỞNG PHÒNG NHÂN SỰ</p>
            <p className="text-[10px] text-slate-400 mt-1">(Ký và duyệt báo cáo)</p>
            <div className="h-16"></div>
            <p className="font-bold text-slate-700">Trần Thị Thanh Hải</p>
          </div>
        </div>
      </div>
    </div>
  );
};
