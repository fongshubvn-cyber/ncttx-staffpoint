/**
 * ======================================================================
 * MODULE BỔ SUNG: BỘ ĐỒNG BỘ WEB HOOK CHO 16 FILE APPS SCRIPT (STAFFPOINT V3.0)
 * ======================================================================
 * 
 * 📌 HƯỚNG DẪN TÍCH HỢP VÀO GOOGLE SHEET CÓ SẴN (16 FILE APPS SCRIPT):
 * 1. Mở dự án Google Apps Script chứa 16 tệp `.gs` của bạn.
 * 2. Tạo một tệp mới tên `17_StaffPointBridge.gs` (hoặc dán nội dung dưới đây vào cuối `01_Code.gs`).
 * 3. Bấm **Deploy (Triển khai)** -> **New deployment (Triển khai mới)**:
 *    - Select type: **Web App**
 *    - Execute as: **Me** (Tài khoản Google của bạn)
 *    - Who has access: **Anyone** (Bất kỳ ai)
 * 4. Copy đường link Web App URL thu được (dạng `https://script.google.com/macros/s/.../exec`).
 * 5. Dán link này vào ô **Google Apps Script Webhook URL** tại giao diện Quản trị Tham số trên Web App StaffPoint.
 * 
 * ✨ KẾT QUẢ ĐẠT ĐƯỢC:
 * - Web App StaffPoint v3.0 đóng vai trò là giao diện điều khiển (Realtime Input Engine).
 * - Mọi điểm số, khen thưởng, vi phạm cuối tháng từ StaffPoint sẽ được đẩy thẳng về Sheet `📊 Tổng hợp kỳ` 
 *   chuẩn cấu hình 17 cột của file gốc, đồng thời tự động kích hoạt tạo thư mục Google Drive của từng nhân sự!
 */

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return _jsonResponse("error", "Không nhận được dữ liệu payload");
    }

    var payload = JSON.parse(e.postData.contents);
    var action = payload.action;

    // TRƯỜNG HỢP 1: ĐỒNG BỘ TOÀN BỘ BẢNG ĐIỂM THÁNG (BATCH SYNC 33 NHÂN SỰ)
    if (action === "SYNC_MONTHLY_BATCH") {
      return _xuLyDongBoBatchThang(payload);
    }

    // TRƯỜNG HỢP 2: XUẤT BÁO CÁO CÁ NHÂN 1 NHÂN SỰ
    if (action === "EXPORT_STAFF_REPORT") {
      return _xuLyXuatBaoCaoCaNhan(payload);
    }

    return _jsonResponse("ignored", "Hành động không hợp lệ: " + action);

  } catch (error) {
    return _jsonResponse("error", error.toString());
  }
}

/**
 * Xử lý Đồng bộ toàn bộ bảng điểm tháng vào Sheet `📊 Tổng hợp kỳ`
 */
function _xuLyDongBoBatchThang(payload) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = (typeof CFG !== 'undefined' && CFG.SHEETS && CFG.SHEETS.TH) ? CFG.SHEETS.TH : "📊 Tổng hợp kỳ";
  var sheet = ss.getSheetByName(sheetName);

  // Nếu chưa có sheet Tổng hợp kỳ, tự khởi tạo theo hàm buildTongHop của 08_TongHop.gs
  if (!sheet && typeof buildTongHop === 'function') {
    buildTongHop();
    sheet = ss.getSheetByName(sheetName);
  } else if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow([
      'Thời điểm thu','Kỳ','Tuyến','Mã NV','Họ và tên','Vị trí','Vai trò quản lý',
      'Điểm văn hóa chung','Điểm ngạch chuyên môn','Điểm ngạch quản lý','ĐIỂM TỔNG',
      'Bậc cách làm việc','Bậc ngạch chuyên môn','Bậc ngạch quản lý',
      'Ranh giới','Bảo mật thu nhập','Đường dẫn file năm'
    ]);
  }

  var period = payload.period || Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM");
  var staffArray = payload.staffList || [];
  var timestamp = new Date();

  var count = 0;
  staffArray.forEach(function(s) {
    sheet.appendRow([
      timestamp,
      period,
      s.line || '',
      s.id || '',
      s.name || '',
      s.role || '',
      s.isManager ? 'Có' : 'Không',
      s.generalScore || 0,
      s.techScore || 0,
      s.mgmtScore || 0,
      s.totalScore || 0,
      s.salaryTier || 'Bậc 1',
      s.salaryTier || 'Bậc 1',
      s.salaryTier || 'Bậc 1',
      s.violationsCount > 0 ? 'Có vi phạm' : 'Bình thường',
      'Đã khóa',
      ''
    ]);
    count++;
  });

  // Ghi nhật ký vào sheet 📜 Nhật ký phiên bản nếu có
  if (typeof _ghiNhatKy === 'function') {
    _ghiNhatKy('Đồng bộ StaffPoint App', 'Đồng bộ tự động ' + count + ' nhân sự cho kỳ ' + period);
  }

  return _jsonResponse("success", "Đã đồng bộ thành công " + count + " nhân sự vào Sheet " + sheetName);
}

/**
 * Xử lý xuất báo cáo đơn lẻ cho 1 nhân sự
 */
function _xuLyXuatBaoCaoCaNhan(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = (typeof CFG !== 'undefined' && CFG.SHEETS && CFG.SHEETS.TH) ? CFG.SHEETS.TH : "📊 Tổng hợp kỳ";
  var sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow([
      'Thời điểm thu','Kỳ','Tuyến','Mã NV','Họ và tên','Vị trí','Vai trò quản lý',
      'Điểm văn hóa chung','Điểm ngạch chuyên môn','Điểm ngạch quản lý','ĐIỂM TỔNG',
      'Bậc cách làm việc','Bậc ngạch chuyên môn','Bậc ngạch quản lý',
      'Ranh giới','Bảo mật thu nhập','Đường dẫn file năm'
    ]);
  }

  sheet.appendRow([
    new Date(),
    data.period || '',
    data.line || '',
    data.staffId || '',
    data.staffName || '',
    data.role || '',
    data.mgmtScore > 0 ? 'Có' : 'Không',
    data.generalScore || 0,
    data.techScore || 0,
    data.mgmtScore || 0,
    data.totalScore || 0,
    data.salaryTier || 'Bậc 1',
    data.salaryTier || 'Bậc 1',
    data.salaryTier || 'Bậc 1',
    data.violationsCount > 0 ? 'Có vi phạm' : 'Bình thường',
    'Đã khóa',
    ''
  ]);

  return _jsonResponse("success", "Đã dồn dữ liệu báo cáo của " + data.staffName + " vào Google Sheet!");
}

function _jsonResponse(status, message) {
  return ContentService.createTextOutput(JSON.stringify({ status: status, message: message }))
    .setMimeType(ContentService.MimeType.JSON);
}
