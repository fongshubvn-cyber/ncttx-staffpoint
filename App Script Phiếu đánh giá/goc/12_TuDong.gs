/**
 * MODULE 12: Tự động. Tick một ô là tạo phiếu, và đồng bộ nhân sự chạy nền.
 *
 * HAI TRIGGER, cài một lần bằng menu ⚡ Bật chế độ tự động:
 *
 *   taoPhieuKhiTick   chạy mỗi khi có ô bị sửa. Nếu ô đó là ô tick ▶ trong
 *                     sheet 👥 Nhân sự thì tạo FILE NĂM cho người ở dòng đó.
 *   dongBoHangNgay    chạy mỗi sáng, làm mới danh sách nhân sự từ People Management.
 *
 * VÌ SAO PHẢI CÀI TRIGGER: hàm onEdit đơn giản của Google Sheets không được
 * phép gọi Drive nên không tạo file được. Trigger cài đặt thì chạy dưới quyền
 * của người cài nên làm được. Cài một lần, dùng mãi.
 */

/* ==================== CÀI VÀ GỠ ==================== */

function batCheDoTuDong() {
  const ui = _ui(), ss = _ss();
  const cu = ScriptApp.getProjectTriggers();
  cu.forEach(function (t) {
    if (['taoPhieuKhiTick','dongBoHangNgay'].indexOf(t.getHandlerFunction()) > -1)
      ScriptApp.deleteTrigger(t);
  });

  ScriptApp.newTrigger('taoPhieuKhiTick').forSpreadsheet(ss).onEdit().create();
  ScriptApp.newTrigger('dongBoHangNgay').timeBased().atHour(7).everyDays(1).create();

  _ghiNhatKy('Bật chế độ tự động', 'taoPhieuKhiTick khi sửa ô, dongBoHangNgay lúc 7 giờ');
  ui.alert('Đã bật ✅',
    'Từ giờ:\n\n' +
    '▶  Tick ô ▶ ở sheet ' + CFG.SHEETS.NS + ' là FILE NĂM của người ở dòng đó được tạo ngay, ' +
    'theo NĂM ghi ở dòng 2. Ô tự bỏ tick, đường dẫn file hiện ở cột bên cạnh.\n\n' +
    '🔃  Danh sách nhân sự tự đồng bộ với People Management mỗi sáng lúc 7 giờ, ' +
    'và đồng bộ lại ngay trước mỗi lần tạo file.',
    ui.ButtonSet.OK);
}

function tatCheDoTuDong() {
  const ui = _ui();
  let n = 0;
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (['taoPhieuKhiTick','dongBoHangNgay'].indexOf(t.getHandlerFunction()) > -1) {
      ScriptApp.deleteTrigger(t); n++;
    }
  });
  _ghiNhatKy('Tắt chế độ tự động', 'gỡ ' + n + ' trigger');
  ui.alert('Đã gỡ ' + n + ' trigger. Tick ô ▶ không còn tác dụng, dùng menu 📅 để tạo file năm.');
}

/* ==================== TRIGGER ==================== */

/** Chạy mỗi lần có ô bị sửa. Chỉ phản ứng với ô tick trong sheet Nhân sự. */
function taoPhieuKhiTick(e) {
  if (!e || !e.range) return;
  const sh = e.range.getSheet();
  if (sh.getName() !== CFG.SHEETS.NS) return;
  if (e.range.getColumn() !== NS.C_TICK) return;
  if (e.range.getNumRows() !== 1) return;
  const r = e.range.getRow();
  if (r < NS.R_DAU) return;
  if (e.range.getValue() !== true) return;

  const ss = _ss();
  function thoi(msg) {
    e.range.setValue(false);
    ss.toast(msg, '▶ Chưa tạo được phiếu', 8);
  }

  /* ✅ SỬA 30/8/2026 (Sen). Ô dòng 2 nay là NĂM đang mở, không phải đợt, vì một
   * người chỉ còn một file cho cả năm. Để trống thì lấy năm hiện tại. */
  let nam = parseInt(String(sh.getRange(NS.R_DOT, 2).getValue() || '').trim(), 10);
  if (isNaN(nam)) nam = new Date().getFullYear();

  const ns = _nhanSuTaiDong(sh, r);
  if (!ns)       { thoi('Dòng này không có mã nhân sự.'); return; }
  if (!ns.tuyen) { thoi(ns.ten + ' chưa được gán tuyến. Điền cột Tuyến rồi tick lại.'); return; }
  ns.tuyen = _chuanTenTuyen(ns.tuyen);
  if (!TUYEN[ns.tuyen]) { thoi('Tuyến "' + ns.tuyen + '" không có trong hệ.'); return; }

  ss.toast('Đang tạo file năm cho ' + ns.ten + '. Mười hai sheet tháng nên chờ khoảng một phút.',
           '▶ Đang chạy', 90);
  try {
    const kq = taoFileNam(ns.tuyen, nam, ns);
    e.range.setValue(false);
    sh.getRange(r, NS.C_LINK).setFormula(
      _F('=HYPERLINK("' + kq.url + '","Đánh giá ' + nam + '")'));
    SpreadsheetApp.flush();
    ss.toast(ns.ma + ' ' + ns.ten + ' · file năm ' + nam +
             '. Bấm ô bên cạnh để mở.', '✅ Đã tạo file năm', 10);
  } catch (err) {
    thoi('Lỗi: ' + err.message);
  }
}

/** Trigger theo giờ: làm mới danh sách nhân sự, không hiện hộp thoại. */
function dongBoHangNgay() {
  try {
    const n = dongBoNhanSu(true);
    if (n) _ghiNhatKy('Đồng bộ tự động', n + ' người');
  } catch (e) {
    _ghiNhatKy('Đồng bộ tự động LỖI', e.message);
  }
}

/** Đồng bộ ngầm ngay trước khi tạo file, để không dựng từ dữ liệu cũ. */
function _dongBoTruocKhiXuat() {
  try { dongBoNhanSu(true); } catch (e) {}
}

/* ==================== TRẠNG THÁI ==================== */

function xemTrangThaiTuDong() {
  const ds = ScriptApp.getProjectTriggers().filter(function (t) {
    return ['taoPhieuKhiTick','dongBoHangNgay'].indexOf(t.getHandlerFunction()) > -1;
  });
  const co = function (ten) {
    return ds.some(function (t) { return t.getHandlerFunction() === ten; }) ? '✅ đang bật' : '⬜ chưa bật';
  };
  _ui().alert('⚡ Chế độ tự động',
    'Tick ô ▶ để tạo phiếu:  ' + co('taoPhieuKhiTick') + '\n' +
    'Đồng bộ nhân sự hằng ngày:  ' + co('dongBoHangNgay') + '\n\n' +
    'Chưa bật thì chạy menu ⚡ Bật chế độ tự động. Lần đầu Google sẽ hỏi cấp quyền, chọn cho phép.',
    _ui().ButtonSet.OK);
}
