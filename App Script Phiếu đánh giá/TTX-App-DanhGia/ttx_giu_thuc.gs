/**
 * TTX · GIỮ THỨC
 *
 * Gọi Supabase mỗi tuần để dự án không bị coi là bỏ hoang. Bản miễn phí tự ngủ
 * sau 7 ngày không có hoạt động nào, mà đánh giá của nhà mình theo kỳ tháng —
 * có tuần chẳng ai lập biên bản.
 *
 * CÁCH CÀI
 *   1. script.google.com → New project → đặt tên "TTX · Giữ thức"
 *   2. Xoá nội dung mẫu, dán TOÀN BỘ tệp này vào, bấm Lưu
 *   3. Chọn hàm ttxGiuThuc ở thanh trên → Run → cấp quyền cho Google
 *      (Advanced → Go to ... (unsafe) → Allow. "unsafe" chỉ nghĩa là script
 *       do anh viết chứ Google chưa duyệt.)
 *   4. Xem Execution log, phải thấy "✅ Supabase còn thức (200)"
 *   5. Cột trái → biểu tượng đồng hồ (Triggers) → Add Trigger:
 *        Function to run      ttxGiuThuc
 *        Event source         Time-driven
 *        Type                 Week timer
 *        Day of week          Every Monday
 *        Time of day          6am to 7am
 *
 * ⛔ ĐỂ Ở DỰ ÁN RIÊNG, đừng bỏ chung với script gắn Google Sheet. Dự án đó là
 * nơi tháng nào bên kia cũng gửi bản mới và anh thay 16 tệp — hàm này bỏ vào
 * đó thì có ngày bị xoá theo mà không ai để ý, rồi ba tuần sau dự án ngủ và
 * cả nhà đăng nhập không được.
 */
function ttxGiuThuc() {
  const URL = 'https://uitxfdtaovntbjxgcvbi.supabase.co/rest/v1/';

  // Khoá anon public — KHÔNG phải service_role.
  // Khoá này nằm công khai trong app cũng được, thứ giữ cửa là luật RLS.
  const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIs' +
              'InJlZiI6InVpdHhmZHRhb3ZudGJqeGdjdmJpIiwicm9sZSI6ImFub24iLCJpYX' +
              'QiOjE3ODg1MDkwMTcsImV4cCI6MjEwNDA4NTAxN30.' +
              '1gsu6ft-bchgCeqPuqf3_-O9qFtrx7bCi13Nko42Jks';

  const r = UrlFetchApp.fetch(URL, {
    headers: {
      apikey: KEY,
      Authorization: 'Bearer ' + KEY   // ⚠️ thiếu dòng này là 401
    },
    muteHttpExceptions: true
  });

  const ma = r.getResponseCode();
  if (ma === 200) {
    Logger.log('✅ Supabase còn thức (200)');
  } else if (ma === 401) {
    Logger.log('⚠️ 401 — khoá sai, hoặc thiếu header Authorization');
  } else if (ma === 404) {
    Logger.log('⚠️ 404 — địa chỉ thiếu /rest/v1/ ở cuối');
  } else {
    Logger.log('⚠️ Trả về ' + ma + ' — ' + r.getContentText().slice(0, 200));
  }
}
