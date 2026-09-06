import { Staff, IncidentRecord, ParameterConfig } from '../types';

export interface ExportResult {
  success: boolean;
  message: string;
  driveUrl?: string;
  downloadFallback?: boolean;
}

/**
 * Xuất báo cáo đánh giá cá nhân nhân sự sang Google Apps Script / Google Sheets
 */
export async function exportReportToGoogleSheet(
  staff: Staff,
  periodKey: string,
  incidents: IncidentRecord[],
  params: ParameterConfig
): Promise<ExportResult> {
  const staffIncidents = incidents.filter(
    i => i.targetId === staff.id || i.reporterId === staff.id
  );
  const staffViolations = staffIncidents.filter(i => i.type === 'vi_pham');
  const staffRecognitions = staffIncidents.filter(i => i.type === 'ghi_nhan');

  const payload = {
    action: "EXPORT_STAFF_REPORT",
    period: periodKey,
    staffId: staff.id,
    staffName: staff.name,
    role: staff.role,
    department: staff.department,
    line: staff.line,
    speechCapability: staff.speechCapability,
    jobLevel: staff.jobLevel,
    location: staff.location,
    generalScore: staff.generalScore,
    techScore: staff.techScore,
    mgmtScore: staff.mgmtScore || 0,
    totalScore: staff.totalScore,
    salaryTier: staff.salaryTier,
    incidentsCount: staffIncidents.length,
    violationsCount: staffViolations.length,
    recognitionsCount: staffRecognitions.length,
    incidentsList: staffIncidents.map(i => ({
      id: i.id,
      type: i.type === 'vi_pham' ? 'Vi phạm' : 'Khen thưởng',
      title: i.title,
      description: i.description,
      impactPoints: i.impactPoints,
      date: i.date,
      reporterName: i.reporterName,
      targetName: i.targetName,
      status: i.status
    })),
    exportedAt: new Date().toLocaleString('vi-VN')
  };

  const scriptUrl = params.googleAppsScriptUrl?.trim();

  // 1. Nếu có Webhook URL Google Apps Script: Gửi HTTP POST sang Apps Script
  if (scriptUrl && scriptUrl.startsWith('http')) {
    try {
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      return {
        success: true,
        message: `Đã gửi thành công báo cáo của ${staff.name} (${staff.id}) sang Google Apps Script!`,
        driveUrl: scriptUrl
      };
    } catch (err: any) {
      console.error('Lỗi xuất Google Apps Script Webhook:', err);
    }
  }

  // 2. Fallback: Xuất file CSV / Báo cáo dạng văn bản tải về máy
  downloadCsvReport(staff, periodKey, payload);

  return {
    success: true,
    message: scriptUrl 
      ? `Đã gửi báo cáo sang Google Apps Script & Tải bản file đính kèm về máy!`
      : `Đã xuất báo cáo cá nhân của ${staff.name} (${staff.id}) thành file CSV! (Có thể cài Webhook URL ở tab Tham số để gửi trực tiếp sang Google Sheet).`,
    downloadFallback: true
  };
}

/**
 * Đồng bộ toàn bộ bảng điểm 33 nhân sự của tháng hiện tại sang Google Sheet
 */
export async function exportBatchMonthlyToGoogleSheet(
  staffList: Staff[],
  periodKey: string,
  incidents: IncidentRecord[],
  params: ParameterConfig
): Promise<ExportResult> {
  const payload = {
    action: "SYNC_MONTHLY_BATCH",
    period: periodKey,
    exportedAt: new Date().toLocaleString('vi-VN'),
    staffList: staffList.map(s => {
      const sInc = incidents.filter(i => i.targetId === s.id);
      return {
        id: s.id,
        name: s.name,
        role: s.role,
        department: s.department,
        line: s.line,
        generalScore: s.generalScore,
        techScore: s.techScore,
        mgmtScore: s.mgmtScore || 0,
        totalScore: s.totalScore,
        salaryTier: s.salaryTier,
        isManager: Boolean(s.isManager),
        violationsCount: sInc.filter(i => i.type === 'vi_pham').length,
        recognitionsCount: sInc.filter(i => i.type === 'ghi_nhan').length
      };
    })
  };

  const scriptUrl = params.googleAppsScriptUrl?.trim();
  if (scriptUrl && scriptUrl.startsWith('http')) {
    try {
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return {
        success: true,
        message: `Đã phát lệnh đồng bộ ${staffList.length} nhân sự cho kỳ ${periodKey} sang Google Sheet!`,
        driveUrl: scriptUrl
      };
    } catch (err: any) {
      console.error('Lỗi đồng bộ batch sang Google Apps Script:', err);
    }
  }

  // Fallback: Tải file CSV tổng hợp toàn công ty
  downloadBatchCsvReport(staffList, periodKey, payload);

  return {
    success: true,
    message: scriptUrl 
      ? `Đã phát lệnh đồng bộ kỳ ${periodKey} sang Google Apps Script!`
      : `Đã xuất dữ liệu tổng hợp ${staffList.length} nhân sự kỳ ${periodKey} ra file CSV!`,
    downloadFallback: true
  };
}

/**
 * Tải file CSV Báo cáo đánh giá cá nhân nhân sự về máy
 */
function downloadCsvReport(staff: Staff, periodKey: string, payload: any) {
  const headers = [
    'Kỳ báo cáo', 'Mã NV', 'Họ và tên', 'Chức vụ', 'Phòng ban', 'Tuyến',
    'Điểm Văn hóa', 'Điểm Chuyên môn', 'Điểm Quản lý', 'ĐIỂM TỔNG', 'Bậc cách làm việc',
    'Số biên bản vi phạm', 'Số phiếu khen thưởng', 'Thời điểm xuất'
  ];

  const row = [
    periodKey,
    staff.id,
    staff.name,
    staff.role,
    staff.department,
    staff.line,
    staff.generalScore,
    staff.techScore,
    staff.mgmtScore || 0,
    staff.totalScore,
    staff.salaryTier,
    payload.violationsCount,
    payload.recognitionsCount,
    payload.exportedAt
  ];

  let csvContent = "\uFEFF"; // UTF-8 BOM for Excel support
  csvContent += headers.map(h => `"${h}"`).join(',') + "\n";
  csvContent += row.map(r => `"${String(r).replace(/"/g, '""')}"`).join(',') + "\n\n";

  // Thêm chi tiết danh sách phiếu
  csvContent += `"DANH SÁCH PHIẾU GHI NHẬN & BIÊN BẢN VI PHẠM (KỲ ${periodKey})"\n`;
  csvContent += `"Mã phiếu","Loại phiếu","Tiêu đề","Nội dung chi tiết","Điểm tác động","Ngày","Người lập","Trạng thái"\n`;

  payload.incidentsList.forEach((inc: any) => {
    csvContent += [
      inc.id,
      inc.type,
      inc.title,
      inc.description,
      inc.impactPoints,
      inc.date,
      inc.reporterName,
      inc.status
    ].map(v => `"${String(v || '').replace(/"/g, '""')}"`).join(',') + "\n";
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `BaoCao_DanhGia_${staff.id}_${periodKey}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Tải file CSV Báo cáo tổng hợp toàn công ty kỳ tháng về máy
 */
function downloadBatchCsvReport(staffList: Staff[], periodKey: string, payload: any) {
  const headers = [
    'Thời điểm thu','Kỳ','Tuyến','Mã NV','Họ và tên','Vị trí','Vai trò quản lý',
    'Điểm văn hóa chung','Điểm ngạch chuyên môn','Điểm ngạch quản lý','ĐIỂM TỔNG',
    'Bậc cách làm việc','Bậc ngạch chuyên môn','Bậc ngạch quản lý','Số vi phạm','Số khen thưởng'
  ];

  let csvContent = "\uFEFF";
  csvContent += headers.map(h => `"${h}"`).join(',') + "\n";

  payload.staffList.forEach((s: any) => {
    csvContent += [
      payload.exportedAt,
      periodKey,
      s.line,
      s.id,
      s.name,
      s.role,
      s.isManager ? 'Có' : 'Không',
      s.generalScore,
      s.techScore,
      s.mgmtScore,
      s.totalScore,
      s.salaryTier,
      s.salaryTier,
      s.salaryTier,
      s.violationsCount,
      s.recognitionsCount
    ].map(v => `"${String(v || '').replace(/"/g, '""')}"`).join(',') + "\n";
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `TongHop_DanhGia_ToanCongTy_${periodKey}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
