/**
 * MODULE 07: Cây thư mục trên Drive, và xuất phiếu THỬ để xem mặt phiếu.
 *
 * ✅ CHỐT 30/8/2026 (Sen). Lối cũ mỗi đợt một file đã bỏ. Một người có ĐÚNG MỘT
 * link cho cả năm, dựng bằng 15_FileNam.gs. Module này còn giữ hai việc:
 * quản lý cây thư mục, và xuất một phiếu THỬ một tháng để xem mặt phiếu.
 *
 * CÂY THƯ MỤC, nằm ngay trong thư mục đang chứa FILE GỐC
 *   People / People Management / Đánh giá /
 *     2026 /
 *       Tuyến Thương mại & Dịch vụ /
 *         Đánh giá 2026 - TTX017 - Nguyễn Trọng Duy
 *     PHIEU-THU /                              phiếu thử, xóa lúc nào cũng được
 */

/* ==================== TẠO VÀ TÌM THƯ MỤC ==================== */

/**
 * Thư mục chứa các năm.
 * Mặc định là chính thư mục đang chứa file gốc, nên cây đánh giá luôn nằm cùng
 * chỗ với file gốc trong thư mục People. Ô TS_DRIVE_ID để đè khi cần đặt chỗ khác.
 */
function _thuMucGoc() {
  const ss = _ss();
  let id = '';
  try { id = String(ss.getRangeByName('TS_DRIVE_ID').getValue() || '').trim(); } catch (e) {}
  if (id) { try { return DriveApp.getFolderById(id); } catch (e) {} }

  const cha = DriveApp.getFileById(ss.getId()).getParents();
  if (cha.hasNext()) return cha.next();

  const it = DriveApp.getFoldersByName(CFG.DRIVE_ROOT);
  return it.hasNext() ? it.next() : DriveApp.createFolder(CFG.DRIVE_ROOT);
}

function _thuMucCon(cha, ten) {
  const it = cha.getFoldersByName(ten);
  return it.hasNext() ? it.next() : cha.createFolder(ten);
}

function moThuMucDrive() {
  const f = _thuMucGoc();
  _ui().alert('🗂️ Thư mục đánh giá',
    'Tên: ' + f.getName() + '\n\n' + f.getUrl() + '\n\n' +
    'Đây là thư mục đang chứa file gốc. Mỗi năm là một thư mục con, trong đó mỗi tuyến một thư mục.\n' +
    'Muốn đặt ở chỗ khác thì dán ID thư mục đó vào ô TS_DRIVE_ID ở sheet ' + CFG.SHEETS.TS + '.',
    _ui().ButtonSet.OK);
}


/* ==================== CHỌN TUYẾN ==================== */

/** Tuyến của một người: lấy từ sheet Nhân sự, chưa có thì hỏi. */
function _chotTuyen(ns) {
  ns.tuyen = _chuanTenTuyen(ns.tuyen);
  if (ns.tuyen && TUYEN[ns.tuyen]) return ns.tuyen;
  const ui = _ui(), ds = Object.keys(TUYEN);
  const q = ui.prompt('Chọn tuyến cho ' + ns.ten,
    'Người này chưa được gán tuyến ở sheet ' + CFG.SHEETS.NS + '. Gõ SỐ hoặc tên tuyến:\n\n' +
    ds.map(function (t, i) {
      return (i+1) + '. ' + t + (TUYEN[t].trangThai === 'đủ' ? '  đủ nội dung' : '  khung rỗng');
    }).join('\n') +
    '\n\nNên gán tuyến vào sheet ' + CFG.SHEETS.NS + ' để lần sau không phải chọn lại.',
    ui.ButtonSet.OK_CANCEL);
  if (q.getSelectedButton() !== ui.Button.OK) return null;
  let t = q.getResponseText().trim();
  const so = parseInt(t, 10);
  if (!isNaN(so) && so >= 1 && so <= ds.length) t = ds[so-1];
  if (!TUYEN[t]) { ui.alert('Không có tuyến "' + t + '".'); return null; }
  return t;
}

/**
 * Vị trí theo danh mục có phải vai trò quản lý không.
 * Đọc thẳng CAP_BAC của 03_DuLieuTuyen.gs: thuộc ngạch Quản lý thì là quản lý.
 */
function _laQuanLy(viTri) {
  const c = _capTuViTri(viTri);
  return !!c && c.ngach === 'Quản lý';
}

/**
 * Đưa cột Người điếc/ khiếm thính / Người nói của sheet Nhân sự về đúng một
 * trong hai giá trị dùng trên phiếu. Không nhận ra thì trả chuỗi rỗng.
 */
function _chuanNhomNN(v) {
  const s = String(v || '').trim().toLowerCase();
  if (!s) return '';
  if (s.indexOf('điếc') > -1) return 'Người điếc/ khiếm thính';
  if (s.indexOf('nói')  > -1) return 'Người nói';
  return '';
}

function _dua(ss, ten, vt) {
  const s = ss.getSheetByName(ten);
  if (!s) return;
  ss.setActiveSheet(s);
  ss.moveActiveSheet(vt);
}


/* ============================================================ phiếu thử */

/**
 * Xuất MỘT THÁNG để xem mặt phiếu, không ghi vào kho dữ liệu.
 * Khác file năm ở ba chỗ: chỉ có một sheet tháng thay vì mười hai, không gọi
 * _ghiLichSu, và file nằm ở thư mục con PHIEU-THU với tên có tiền tố [THỬ].
 * Xóa file thử đi là sạch, không để lại dấu vết trong dữ liệu đánh giá.
 */
function xuatPhieuTest() {
  const ui = SpreadsheetApp.getUi();
  const ds = Object.keys(TUYEN);
  const tl = ui.prompt('🧪 Xuất phiếu THỬ',
    'Phiếu này CHỈ để xem mặt phiếu, không ghi vào Lịch sử đánh giá.\n\n' +
    'Nhập tên tuyến:\n' + ds.map(function (t, i) { return (i+1) + '. ' + t; }).join('\n') +
    '\n\nGõ số thứ tự hoặc tên đầy đủ:', ui.ButtonSet.OK_CANCEL);
  if (tl.getSelectedButton() !== ui.Button.OK) return;

  let tuyen = String(tl.getResponseText()).trim();
  const so = parseInt(tuyen, 10);
  if (!isNaN(so) && so >= 1 && so <= ds.length) tuyen = ds[so-1];
  if (!TUYEN[tuyen]) { ui.alert('Không có tuyến tên "' + tuyen + '".'); return; }

  /* Cấp quyết định hai thứ cùng lúc: có chấm phần ngạch quản lý không, và bậc
   * trong ngạch để lọc các câu "Từ bậc N trở lên". */
  const dsCap = _dsCap();
  const tc = ui.prompt('Xuất phiếu THỬ cho cấp nào',
    'Cấp quyết định phiếu chấm những câu nào.\n\n' +
    dsCap.map(function (c, i) {
      const t = _traCap(c);
      return (i+1) + '. ' + c + '  (bậc ' + t.bac + ', ngạch ' + t.ngach + ')';
    }).join('\n') +
    '\n\nGõ số thứ tự hoặc tên đầy đủ:', ui.ButtonSet.OK_CANCEL);
  if (tc.getSelectedButton() !== ui.Button.OK) return;

  let tenCap = String(tc.getResponseText()).trim();
  const soCap = parseInt(tenCap, 10);
  if (!isNaN(soCap) && soCap >= 1 && soCap <= dsCap.length) tenCap = dsCap[soCap-1];
  const cap = _traCap(tenCap);
  if (!cap) { ui.alert('Không có cấp tên "' + tenCap + '".'); return; }

  const url = _taoPhieuTest(tuyen, cap);
  ui.alert('Đã xuất phiếu THỬ ✅',
    'Tuyến: ' + tuyen + '\n' +
    'Cấp: ' + cap.cap + ', bậc ' + cap.bac + ', ngạch ' + cap.ngach + '\n' +
    'Vai trò quản lý: ' + (cap.ngach === 'Quản lý' ? 'Có' : 'Không') + '\n\n' +
    'File có MỘT sheet tháng là T01, cộng hai sheet tra cứu.\n' +
    'File nằm ở thư mục ' + CFG.DRIVE_ROOT + ' / PHIEU-THU. Xem xong xóa file là sạch.\n\n' + url,
    ui.ButtonSet.OK);
}

/** Dựng file phiếu thử một tháng. Trả về URL. */
function _taoPhieuTest(tuyen, cap) {
  const ssGoc = _ss();
  const thuMuc = _thuMucCon(_thuMucGoc(), 'PHIEU-THU');
  const dau = Utilities.formatDate(new Date(), CFG.TZ || 'Asia/Ho_Chi_Minh', 'dd-MM HH:mm');
  const ten = '[THỬ] ' + tuyen + ' - ' + (cap ? cap.cap : '') + ' - ' + dau;

  const ssMoi = SpreadsheetApp.create(ten);
  const fileMoi = DriveApp.getFileById(ssMoi.getId());
  thuMuc.addFile(fileMoi);
  DriveApp.getRootFolder().removeFile(fileMoi);

  [CFG.SHEETS.TS, CFG.SHEETS.CHUNG, CFG.MT_PREFIX + tuyen].forEach(function (t) {
    const s = ssGoc.getSheetByName(t);
    if (s) s.copyTo(ssMoi).setName(t);
  });
  _dungLaiNamedRange(ssMoi);

  _buildLog(ssMoi);
  const V = buildPhieuThang(ssMoi, THANG_SHEET[0], tuyen, {
    maNV: 'THU-01', hoTen: '[PHIẾU THỬ, không phải nhân sự thật]',
    viTri: cap ? cap.cap : 'chưa chọn', cap: cap ? cap.cap : '',
    phong: '', diem: '',
    thang: '01', nam: new Date().getFullYear(),
    quanLy: (cap && cap.ngach === 'Quản lý') ? 'Có' : 'Không',
    nhomNN: 'Người nói',
    sheetTruoc: ''
  });
  _buildChiMuc(ssMoi, tuyen, V);
  buildDinhTinh(ssMoi, tuyen, {
    maNV: 'THU-01', hoTen: '[PHIẾU THỬ, không phải nhân sự thật]', dot: 'THỬ ' + dau
  });

  ['Trang tính1','Sheet1'].forEach(function (t) {
    const s = ssMoi.getSheetByName(t);
    if (s && ssMoi.getSheets().length > 1) { try { ssMoi.deleteSheet(s); } catch (e) {} }
  });
  _dua(ssMoi, THANG_SHEET[0], 1);
  _dua(ssMoi, CFG.MT_PREFIX + tuyen, 2);
  _dua(ssMoi, CFG.SHEETS.CHUNG, 3);
  [CFG.SHEETS.TS, CFG.PDT_SHEET, CFG.LOG_SHEET, CFG.CHIMUC_SHEET].forEach(function (t) {
    const s = ssMoi.getSheetByName(t);
    if (s) s.hideSheet();
  });
  SpreadsheetApp.flush();

  return fileMoi.getUrl();
}
