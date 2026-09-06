/**
 * 14_DinhTinh.gs · BỘ CÂU HỎI ĐÁNH GIÁ ĐỊNH TÍNH
 *
 * ⛔ FILE NÀY SINH TỰ ĐỘNG, KHÔNG SỬA TAY.
 * Nguồn: 3-Luong/Phuong-an/CAU-HOI-DINH-TINH_QUAN-LY-TRUC-TIEP.md
 * Sinh lại: python3 3-Luong/Phuong-an/sinh_bo_dinh_tinh_gs.py
 *
 * Đây là các câu ĐÃ RÚT khỏi phiếu chấm vì không lập được biên bản ghi
 * nhận hoặc biên bản vi phạm. Chúng KHÔNG tính điểm, KHÔNG vào tỷ lệ,
 * KHÔNG sinh ra bậc. Quản lý trực tiếp nhận xét bằng lời.
 *
 * ⚠️ Sheet này cố ý nằm RIÊNG, không nhập vào phiếu chấm, để không dòng
 * nào của nó lọt vào năm công thức tỷ lệ của phiếu.
 */

/** Câu áp dụng cho MỌI tuyến. [nhóm, mã, câu, phạm vi, bậc, lý do, phần] */
const DINH_TINH_CHUNG = [
  ['VH2. OUTCOME, KẾT QUẢ CẦN ĐẠT THEO TIÊU CHÍ SMART','OC2','Kết quả cần đạt do nhân sự nêu không cụ thể, hiểu được theo nhiều cách','Tất cả nhân sự','','Tạm treo','Cách làm việc'],
  ['VH7. SOLUTION FOCUS, ĐỊNH HƯỚNG GIẢI PHÁP','SF3','Khi nêu vấn đề, nhân sự quy trách nhiệm cho cá nhân hoặc cho hoàn cảnh','Tất cả nhân sự','','Không ghi lý do','Cách làm việc'],
  ['VH7. SOLUTION FOCUS, ĐỊNH HƯỚNG GIẢI PHÁP','SF5','Nhân sự nêu vấn đề mà không kèm đánh giá tác động: ảnh hưởng tới ai, tốn gì, rủi ro gì','Tất cả nhân sự','','Không ghi lý do','Cách làm việc'],
  ['VH7. SOLUTION FOCUS, ĐỊNH HƯỚNG GIẢI PHÁP','SF6','Việc xử lý vấn đề thuộc thẩm quyền của nhân sự mà nhân sự không phối hợp với bộ phận liên quan','Tất cả nhân sự','','Không ghi lý do','Cách làm việc'],
  ['NL2. LÀM CHỦ VIỆC VÀ NÂNG CHUẨN','MH6','Nhân sự đề xuất được cách giữ mùi ổn định cho cả điểm bán','Vị trí có đầu việc tại điểm bán','','Khó xác định hành vi cụ thể để ghi nhận','Cách làm việc'],
  ['QB. ĐỘI NGŨ, PHỐI HỢP VÀ KÈM NGHỀ','QB4','Nhân sự nêu đúng nội dung cần đào tạo sang Phòng Nhân sự - Hành chính - Pháp chế','Nhân sự giữ vai trò quản lý','Bậc 3','Tạm treo','Ngạch quản lý'],
  ['QF. NÂNG CHUẨN','QF5','Nhân sự theo dõi kết quả sau khi chuẩn được nhân rộng','Nhân sự giữ vai trò quản lý','Bậc 4','Mức độ thường xuyên không cao','Ngạch quản lý'],
  ['QH. HỎI VÀ LẮNG NGHE TRONG ĐỘI NHÓM','QH2','Nghe xong, nhân sự không tóm tắt lại vấn đề của người kia, hoặc tóm tắt sai ý, làm người đó phải giải thích lại từ đầu','Nhân sự giữ vai trò quản lý','Bậc 3','Đã viết lại cho dễ hiểu ngày 16/8/2026. Vẫn ở đây vì muốn ghi nhận thì người chấm phải có mặt trong cuộc trao đổi, và không có vật nào để lại','Ngạch quản lý'],
  ['QH. HỎI VÀ LẮNG NGHE TRONG ĐỘI NHÓM','QH4','Người trong nhóm không tự báo trở ngại với nhân sự, chỉ nói ra khi nhân sự hỏi thẳng','Nhân sự giữ vai trò quản lý','Bậc 4','Đã viết lại cho dễ hiểu ngày 16/8/2026. Vẫn ở đây vì chủ ngữ là NGƯỜI KHÁC, cùng dạng với B2.5 và AT5 mà bản rà soát đã bác. Đổi chủ ngữ sang nhân sự thì câu sẽ trùng QK4','Ngạch quản lý']
];

/** Câu riêng của từng tuyến. Tuyến chưa soạn thì không có khóa. */
const DINH_TINH_TUYEN = {
  'Thương mại & Dịch vụ': [
   ['B1. BƯỚC 1, TẠO TÍN NHIỆM VỚI KHÁCH HÀNG','B1.8','Sau phần mở đầu của nhân sự, khách chưa biết thương hiệu vẫn không nói ra vấn đề của mình','Tất cả các bậc','Bậc 2','Khó ghi nhận','Ngạch chuyên môn'],
   ['B2. BƯỚC 2, KHAI THÁC VẤN ĐỀ VÀ NHU CẦU','B2.4','Nhân sự không bắt được tín hiệu từ khách, câu hỏi không chạm sinh hoạt thật của họ','Tất cả các bậc','Bậc 2','Khó ghi nhận','Ngạch chuyên môn'],
   ['C6. KIẾN THỨC SẢN PHẨM, THỰC ĐƠN VÀ AN TOÀN SẢN PHẨM','C6.5','Nhân sự không giải thích được cách sản phẩm được làm ra ở mức khách tin','Tất cả các bậc','Bậc 4','Cụm "ở mức khách tin" mang tính cảm tính của khách hàng, khó quy thành lỗi cụ thể','Ngạch chuyên môn'],
   ['QA. VẬN HÀNH TUYẾN','QA3','Nhân sự ghi nhận việc một nhân sự từ chối cơ hội bán không phù hợp là hành vi đúng','Nhân sự giữ vai trò quản lý','Bậc 3','Mức độ thường xuyên không cao','Ngạch quản lý'],
   ['QA. VẬN HÀNH TUYẾN','QA7','Nhân sự chuyển giao được cách tổ chức của tuyến khi Công ty mở điểm bán mới','Nhân sự giữ vai trò quản lý','Bậc 6','Mức độ thường xuyên không cao. Bản viết lại đã được gỡ ngày 15/8/2026, câu trở về nguyên bản. Chỉ xảy ra khi Công ty mở điểm bán mới nên không có sự việc để lập biên bản','Ngạch quản lý'],
   ['QB. ĐỘI NGŨ, PHỐI HỢP VÀ KÈM NGHỀ','QB5','Nhân sự là đầu mối các bộ phận trong điểm bán tìm đến khi việc liên quan nhiều bên','Nhân sự giữ vai trò quản lý','Bậc 5','Khó ghi nhận','Ngạch quản lý'],
   ['QC. CHI PHÍ BÁN HÀNG VÀ CƠ CẤU HÀNG BÁN','QC2','Nhân sự lập được ngân sách hoạt động của đơn vị mình trong target chi phí bán hàng được giao','Nhân sự giữ vai trò quản lý','Bậc 5','Mức độ thường xuyên không cao','Ngạch quản lý'],
   ['QC. CHI PHÍ BÁN HÀNG VÀ CƠ CẤU HÀNG BÁN','QC3','Chi phí bán hàng của đơn vị nằm trong tỷ lệ target do Giám đốc Kinh doanh giao','Nhân sự giữ vai trò quản lý','Bậc 5','Mức độ thường xuyên không cao. Bản viết lại ngày 15/8 là *chủ động cắt giảm hoặc tối ưu chi phí vận hành ca*. Không nhận vì chưa có định nghĩa khoản mục chi phí vận hành ca nên không có mốc trước và sau, và việc không cắt giảm không phải một lỗi nên không có chiều vi phạm','Ngạch quản lý'],
   ['QC. CHI PHÍ BÁN HÀNG VÀ CƠ CẤU HÀNG BÁN','QC4','Nhân sự tính được chi phí bán hàng của từng kênh, gồm phí sàn, phí vận chuyển và chiết khấu','Nhân sự giữ vai trò quản lý','Bậc 6','Mức độ thường xuyên không cao. Bản viết lại ngày 15/8 là *xây dựng hoặc tối ưu phương án phí vận chuyển và phí sàn giúp gia tăng biên lợi nhuận*. Không nhận vì biên lợi nhuận là đại lượng tuyến bán không được xem theo phân tầng thông tin tài chính','Ngạch quản lý'],
   ['QC. CHI PHÍ BÁN HÀNG VÀ CƠ CẤU HÀNG BÁN','QC5','Nhân sự đọc được lợi nhuận trước giá vốn hàng bán của nhóm hàng mình phụ trách','Nhân sự giữ vai trò quản lý','Bậc 6','Khó ghi nhận','Ngạch quản lý'],
   ['QC. CHI PHÍ BÁN HÀNG VÀ CƠ CẤU HÀNG BÁN','QC7','Nhân sự phân biệt được vai trò nhóm kéo khách, nhóm giữ hình ảnh thương hiệu và nhóm đóng góp lợi nhuận trước giá vốn hàng bán','Nhân sự giữ vai trò quản lý','Bậc 6','Mức độ thường xuyên không cao','Ngạch quản lý'],
   ['QD. THỊ TRƯỜNG VÀ BỘ SỐ','QD5 bản gốc','Nhân sự lập được dự báo bán có tính mùa vụ, tách được phần tăng do mùa khỏi phần tăng thực','Nhân sự giữ vai trò quản lý','Bậc 5','Mức độ thường xuyên không cao. ⚠️ Mã QD5 nay thuộc câu về báo cáo tuần. Nội dung đo mùa vụ hiện KHÔNG còn ở phiếu chấm. Với Đà Lạt, nơi mùa cao và mùa thấp chênh 1,5 tới 3 lần, đây là năng lực đáng có một câu riêng','Ngạch quản lý'],
   ['QD. THỊ TRƯỜNG VÀ BỘ SỐ','QD6','Nhận định về thị trường nhân sự đưa ra ở kỳ trước khớp với diễn biến kỳ sau','Nhân sự giữ vai trò quản lý','Bậc 5','Mức độ thường xuyên không cao','Ngạch quản lý'],
   ['QD. THỊ TRƯỜNG VÀ BỘ SỐ','QD7','Nhân sự không kết luận một chương trình có hiệu quả chỉ vì doanh thu tăng, khi kỳ đó trùng mùa cao điểm','Nhân sự giữ vai trò quản lý','Bậc 5','Mức độ thường xuyên không cao','Ngạch quản lý'],
   ['QE. HIỂU NGHỀ CỦA CÁC TUYẾN KHÁC TRONG ĐIỂM BÁN','QE1','Khi có việc thuộc tổ khác trong điểm bán, nhân sự chuyển đúng người phụ trách ngay từ lần đầu','Nhân sự giữ vai trò quản lý','Bậc 3','Đã viết lại cho dễ hiểu ngày 16/8/2026. ⚠️ Bản mới đo một sự việc cụ thể là chuyển việc sang tổ khác, nên ĐÃ lập được biên bản. Đây là ứng viên đưa trở lại phiếu chấm, chờ Sen quyết','Ngạch quản lý'],
   ['QE. HIỂU NGHỀ CỦA CÁC TUYẾN KHÁC TRONG ĐIỂM BÁN','QE5','Nhân sự chuyển giao được hiểu biết liên tuyến khi Công ty mở điểm bán mới','Nhân sự giữ vai trò quản lý','Bậc 6','Mức độ thường xuyên không cao','Ngạch quản lý']
  ]
};

/** Danh sách câu định tính của một tuyến: phần chung cộng phần riêng nếu có. */
function _cauDinhTinh(tuyen) {
  const rieng = DINH_TINH_TUYEN[tuyen] || [];
  return { chung: DINH_TINH_CHUNG, rieng: rieng, coRieng: rieng.length > 0 };
}

/* Sheet này có bảng riêng TÁM cột, không đi theo CFG.COT của phiếu chấm.
 * ✅ SỬA 30/8/2026: phiếu chấm xuống bảy cột, sheet này giữ tám. */
const DT_COT = 8;

/**
 * Dựng sheet nhận xét định tính trong file năm.
 * Một bản cho cả năm, và nằm ở sheet ẨN. ✅ CHỐT 30/8/2026 (Sen).
 */
function buildDinhTinh(ssDich, tenTuyen, tt) {
  const C = DT_COT, D = _cauDinhTinh(tenTuyen);
  tt = tt || {};
  const cu = ssDich.getSheetByName(CFG.PDT_SHEET);
  if (cu) ssDich.deleteSheet(cu);
  const sh = ssDich.insertSheet(CFG.PDT_SHEET, 1);

  _banner(sh, '📝 NHẬN XÉT ĐỊNH TÍNH · TUYẾN ' + tenTuyen.toUpperCase(),
    'Phần này KHÔNG tính điểm, KHÔNG vào tỷ lệ, KHÔNG sinh ra bậc. Quản lý trực tiếp nhận xét bằng lời ở cột cuối, kèm dẫn chứng nếu có.', C);

  let r = 2;
  r = _muc(sh, r, 'KHỐI THÔNG TIN', C);
  [['Mã nhân sự', tt.maNV || ''], ['Họ và tên', tt.hoTen || ''],
   ['Tuyến', tenTuyen], ['Kỳ đánh giá', tt.dot || ''],
   ['Người nhận xét, quản lý trực tiếp', '']].forEach(function (n) {
    sh.getRange(r, 2).setValue(n[0]);
    _oNhap(sh.getRange(r, 3, 1, 2));
    sh.getRange(r, 3).setValue(n[1]);
    r++;
  });
  r++;

  r = _note(sh, r,
    'Các câu ở đây nhận xét bằng lời, không cho điểm. Một câu chỉ vào phiếu chấm khi có đủ bốn thứ: ' +
    'một sự việc gắn thời điểm xác định, một chuẩn thành văn để đối chiếu, một vật làm bằng chứng, ' +
    'và người được nhận xét đối chiếu lại được bằng chính bốn thứ đó.',
    C, 40);
  r++;

  r = _bangDinhTinh(sh, r, 'I. ÁP DỤNG CHO MỌI TUYẾN', D.chung, C);
  r++;
  if (D.coRieng) {
    r = _bangDinhTinh(sh, r, 'II. RIÊNG TUYẾN ' + tenTuyen.toUpperCase(), D.rieng, C);
  } else {
    r = _muc(sh, r, 'II. RIÊNG TUYẾN ' + tenTuyen.toUpperCase(), C);
    r = _note(sh, r,
      'Tuyến này chưa có bộ câu hỏi định tính riêng. Phần trên vẫn áp dụng vì đó là phần chung của mọi tuyến.',
      C, 22);
  }

  sh.setColumnWidth(1, 24);
  sh.setColumnWidth(2, 210);
  sh.setColumnWidth(3, 80);
  sh.setColumnWidth(4, 420);
  sh.setColumnWidth(5, 150);
  sh.setColumnWidth(6, 60);
  sh.setColumnWidth(7, 200);
  sh.setColumnWidth(8, 320);
  sh.setFrozenRows(1);
  return sh;
}

/** Một bảng câu định tính. Cột H là ô nhập nhận xét, không phải ô điểm. */
function _bangDinhTinh(sh, r, tieuDe, rows, C) {
  r = _muc(sh, r, tieuDe, C);
  const dau = r;
  sh.getRange(r, 2, 1, 7).setValues([[
    'Nhóm tiêu chí', 'Mã', 'Câu hỏi', 'Phạm vi áp dụng', 'Bậc',
    'Lý do rút khỏi phiếu', 'Nhận xét của quản lý trực tiếp'
  ]]);
  sh.getRange(r, 2, 1, 7)
    .setFontWeight('bold').setBackground(CFG.MAU.HEADER).setFontColor('#ffffff')
    .setVerticalAlignment('middle').setWrap(true);
  r++;

  let phan = '';
  rows.forEach(function (c) {
    if (c[6] !== phan) {
      phan = c[6];
      sh.getRange(r, 2, 1, 7).merge().setValue(phan.toUpperCase())
        .setFontWeight('bold').setBackground(CFG.MAU.NHAT).setFontColor(CFG.MAU.DAM);
      r++;
    }
    sh.getRange(r, 2, 1, 6).setValues([[c[0], c[1], c[2], c[3], c[4], c[5]]]);
    _oNhap(sh.getRange(r, 8));
    sh.getRange(r, 2, 1, 7).setVerticalAlignment('top').setWrap(true);
    r++;
  });

  sh.getRange(dau, 2, r - dau, 7).setBorder(true, true, true, true, true, true,
    CFG.MAU.VIEN, SpreadsheetApp.BorderStyle.SOLID);
  return r;
}

/** Số câu định tính của một tuyến, dùng để kiểm sau khi dán code. */
function demCauDinhTinh() {
  const ra = [];
  Object.keys(TUYEN).forEach(function (t) {
    const D = _cauDinhTinh(t);
    ra.push(t + ': ' + D.chung.length + ' chung + ' + D.rieng.length + ' riêng = ' +
            (D.chung.length + D.rieng.length));
  });
  _ui().alert('Số câu định tính theo tuyến', ra.join('\n'), _ui().ButtonSet.OK);
}
