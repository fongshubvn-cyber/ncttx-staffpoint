/**
 * MODULE 02: Tham số. Nguồn duy nhất cho mọi ngưỡng và trọng số.
 * Công thức toàn hệ tham chiếu qua NAMED RANGE, tuyệt đối không hardcode số.
 * Cập nhật phiên bản vẽ lại sheet này nhưng KHÔNG ghi đè các ô trong CFG.TS_GIU.
 */

function buildThamSo() {
  const sh = _tao(CFG.SHEETS.TS);
  _banner(sh, '⚙️ THAM SỐ',
    'Sửa ở đây, mọi phiếu tính lại theo. Không bao giờ sửa số trực tiếp trong công thức.', 6);
  _header(sh, 2, ['Nhóm','Tham số','Giá trị','Đơn vị','Giải thích','Bậc']);

  const D = [
   ['I. GHÉP RA BẬC TRONG NGẠCH'],
   [null,'Ngưỡng đa số tiêu chí', 0.6, 'tỷ lệ',
    'Chỉ dùng cho tuyến KHÔNG có thang cộng dồn. Người đó được coi là ở bậc b khi đạt bậc b ở ít nhất tỷ lệ này của số tiêu chí trong phạm vi. ⚠️ Chưa được chốt.',
    'TS_DA_SO','pct'],
   [null,'Mức tụt tối đa cho phép', 1, 'nấc',
    '⛔ KHÔNG CÒN CHỖ DÙNG từ 31/8/2026. Hai dòng bậc trong ngạch đã bỏ khỏi phiếu, nên tham số này không đi vào công thức nào nữa. Giữ lại chờ Ban lãnh đạo quyết bỏ hay giữ.',
    'TS_TUT_TOI_DA',null],
   [null,'Ngưỡng đạt của một dải cấp', 0.8, 'tỷ lệ đạt',
    '⛔ KHÔNG CÒN CHỖ DÙNG từ 31/8/2026, cùng lý do dòng trên.',
    'TS_NG_BAC','pct'],

   ['II. GHÉP RA BẬC CÁCH LÀM VIỆC'],
   [null,'Ngưỡng ra bậc 1', 0,    'tỷ lệ đạt','Tỷ lệ đạt của phần cách làm việc, quy ra bậc. ⚠️ Chưa hiệu chỉnh bằng dữ liệu thật.','TS_NG1','pct'],
   [null,'Ngưỡng ra bậc 2', 0.4,  'tỷ lệ đạt','','TS_NG2','pct'],
   [null,'Ngưỡng ra bậc 3', 0.55, 'tỷ lệ đạt','','TS_NG3','pct'],
   [null,'Ngưỡng ra bậc 4', 0.7,  'tỷ lệ đạt','','TS_NG4','pct'],
   [null,'Ngưỡng ra bậc 5', 0.85, 'tỷ lệ đạt','','TS_NG5','pct'],

   /* ✅ CHỐT 30/8/2026 (Sen). Ba phần chấm ghép thành một điểm tổng tháng bằng
    * trung bình cộng có trọng số. Hai bộ trọng số, chọn theo việc người đó có
    * chấm ngạch quản lý hay không. Mỗi bộ cộng lại đúng 100%. */
   ['III. TRỌNG SỐ GHÉP RA ĐIỂM TỔNG THÁNG'],
   [null,'Văn hóa chung, khi KHÔNG có ngạch quản lý', 0.65, 'trọng số',
    'Áp cho nhân sự chỉ chấm hai phần là văn hóa chung và ngạch chuyên môn. Cặp này phải cộng lại bằng 100%.',
    'TS_TS_VH1','pct'],
   [null,'Ngạch chuyên môn, khi KHÔNG có ngạch quản lý', 0.35, 'trọng số','',
    'TS_TS_CM1','pct'],
   [null,'Văn hóa chung, khi CÓ ngạch quản lý', 0.50, 'trọng số',
    'Áp cho nhân sự chấm cả ba phần. Bộ ba này phải cộng lại bằng 100%.',
    'TS_TS_VH2','pct'],
   [null,'Ngạch quản lý, khi CÓ ngạch quản lý', 0.30, 'trọng số','',
    'TS_TS_QL2','pct'],
   [null,'Ngạch chuyên môn, khi CÓ ngạch quản lý', 0.20, 'trọng số','',
    'TS_TS_CM2','pct'],

   ['IV. NỐI VỚI DRIVE VÀ VỚI FILE PEOPLE MANAGEMENT'],
   [null,'ID thư mục chứa các đợt', '', 'ID Drive',
    'ĐỂ TRỐNG là đúng trong hầu hết trường hợp: hệ tự dùng chính thư mục đang chứa file gốc này, nên cây đánh giá luôn nằm trong thư mục People cùng chỗ với file gốc. Chỉ dán ID vào đây khi muốn đặt các đợt ở một thư mục khác.',
    'TS_DRIVE_ID',null],
   [null,'ID file People Management', '1Ruf3EeXiaiV0Jifnewe-HefXW4ncZHJvlItuoti4vus', 'ID Drive',
    'Nguồn danh sách nhân sự. Menu 🔃 Đồng bộ nhân sự đọc sheet "' + PM.SHEET + '" của file này. Danh sách nhân sự KHÔNG nhập tay ở đây, để tránh hai nơi cùng giữ một dữ liệu rồi trôi lệch.',
    'TS_PM_ID',null],

   ['V. NGUYÊN TẮC CỐ ĐỊNH, KHÔNG PHẢI THAM SỐ'],
   [null,'Điểm mặc định đầu tháng, nhóm đo VI PHẠM', 5, 'điểm',
    'Đầu tháng chưa có biên bản nào thì câu ở nhóm đo vi phạm đứng ở 5, tức chưa vi phạm lần nào. Mỗi biên bản vi phạm kéo điểm xuống.',null,null],
   [null,'Điểm mặc định đầu tháng, nhóm đo GHI NHẬN', 0, 'điểm',
    'Đầu tháng chưa có phiếu nào thì câu ở nhóm đo ghi nhận đứng ở 0, tức chưa ghi nhận lần nào. Mỗi phiếu ghi nhận đẩy điểm lên.',null,null],
   [null,'Phiếu tự xếp CẤP cho nhân sự','Không','',
    '✅ CHỐT 31/8/2026 (Sen). Cấp, tức Chuyên viên, Lead bộ phận, Trưởng phòng, đi qua quyết định bổ nhiệm chứ không do một phiếu tháng quyết. Phiếu chỉ cho ra BẬC CÁCH LÀM VIỆC.',null,null],
   [null,'Vi phạm nội quy trừ thẳng ra bậc và ra tiền','Không, trừ một ngoại lệ','',
    'Pháp luật lao động nghiêm cấm phạt tiền và cắt lương thay cho xử lý kỷ luật. Vi phạm là MỘT TRONG NHIỀU căn cứ khi chấm trụ văn hóa, không có công thức tự trừ. Muốn xử nặng thì đi đường kỷ luật lao động, trong đó có hình thức kéo dài thời hạn nâng bậc tối đa 6 tháng.\n\n' +
    'NGOẠI LỆ DUY NHẤT, ✅ CHỐT 11/8/2026 (Sen): vi phạm bảo mật thu nhập cá nhân, mục VII của phiếu, trừ thẳng 1 bậc của Bậc cách làm việc, sàn là bậc 1. Chỉ trừ vào bậc đó, không đụng tới CẤP của người đó. ⚠️ Điều kiện để dùng làm căn cứ: nghĩa vụ bảo mật thu nhập phải nằm trong hợp đồng lao động hoặc nội quy lao động đã ban hành.',null,null],
   [null,'Tiêu chí ngoài phạm vi tính là chưa đạt','Không','',
    'Đặt cột Thuộc phạm vi bằng Không thì ô đó rời khỏi cả tử số lẫn mẫu số.',null,null],
   [null,'Phiếu tự quy kết quả ra số tiền','Không','',
    'Phiếu dừng ở bậc cách làm việc. Ban lãnh đạo nhìn hai thang chuyên môn và quản lý để quyết bổ nhiệm chức danh; chức danh nào ứng với số tiền nào do quy chế lương quy định.',null,null]
  ];

  let r = 3; const ng = [];
  D.forEach(function (d) {
    if (d.length === 1) {
      sh.getRange(r,1,1,6).setBackground(CFG.MAU.NHAT);
      sh.getRange(r,1).setValue(d[0]).setFontWeight('bold').setFontColor(CFG.MAU.DAM);
      r++; return;
    }
    sh.getRange(r,2).setValue(d[1]);
    const o = sh.getRange(r,3);
    o.setValue(d[2]).setHorizontalAlignment('center');
    if (d[5]) _oNhap(o); else o.setBackground(CFG.MAU.CONG_THUC).setFontColor(CFG.MAU.CHU_GHI);
    if (d[6] === 'pct') _pct(o);
    sh.getRange(r,4).setValue(d[3]);
    sh.getRange(r,5).setValue(d[4]).setFontColor(CFG.MAU.CHU_GHI).setFontSize(9).setWrap(true);
    if (d[5]) _nr(d[5], o);
    if (String(d[1]).indexOf('Ngưỡng ra bậc') === 0) ng.push(r);
    r++;
  });

  ng.forEach(function (rr,i) {
    sh.getRange(rr,6).setValue(i+1).setHorizontalAlignment('center').setFontColor(CFG.MAU.CHU_GHI);
  });
  sh.getRange(ng[0],6).setNote('Số bậc tương ứng. Cột phụ phục vụ hàm tra bậc, không xóa.');
  _nr('NR_NG_TL',  sh.getRange(ng[0],3,ng.length,1));
  _nr('NR_NG_BAC', sh.getRange(ng[0],6,ng.length,1));

  // Lưu vị trí named range để dựng lại được trong file phiếu xuất ra
  const map = {};
  CFG.TS_GIU.forEach(function (n) {
    try { map[n] = _ss().getRangeByName(n).getA1Notation(); } catch (e) {}
  });
  map['NR_NG_TL']  = sh.getRange(ng[0],3,ng.length,1).getA1Notation();
  map['NR_NG_BAC'] = sh.getRange(ng[0],6,ng.length,1).getA1Notation();
  PropertiesService.getDocumentProperties().setProperty('NR_MAP', JSON.stringify(map));

  sh.setColumnWidth(1,40); sh.setColumnWidth(2,330); sh.setColumnWidth(3,90);
  sh.setColumnWidth(4,110); sh.setColumnWidth(5,760); sh.setColumnWidth(6,55);
  sh.getRange(1,1,r,6).setVerticalAlignment('middle');
  _khung(sh,2,r-3,6);
}

/** Dựng lại named range trong một bảng tính khác, sau khi đã chép sheet Tham số sang. */
function _dungLaiNamedRange(ssTarget) {
  const map = JSON.parse(PropertiesService.getDocumentProperties().getProperty('NR_MAP') || '{}');
  const sh = ssTarget.getSheetByName(CFG.SHEETS.TS);
  if (!sh) return;
  Object.keys(map).forEach(function (n) {
    try { _nr(n, sh.getRange(map[n]), ssTarget); } catch (e) {}
  });
}
