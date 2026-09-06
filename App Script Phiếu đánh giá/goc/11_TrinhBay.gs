/**
 * MODULE 11: Quy ước trình bày.
 *
 * Thay vì đoán cách trình bày, hệ HỌC từ một phiếu đã được chỉnh tay.
 * Cách dùng: mở một phiếu trên Drive, chỉnh ô gộp và căn chữ cho vừa ý, rồi
 * chạy menu 🎨 Học cách trình bày từ một phiếu. Hệ đọc file đó, ghi các quy ước
 * vào sheet 🎨 Quy ước trình bày, và mọi phiếu tạo sau đó làm theo.
 *
 * Nhờ vậy Sen chỉnh MỘT lần trên MỘT phiếu, không phải mô tả lại bằng lời và
 * cũng không phải chờ sửa code.
 */

/* Quy ước mặc định, dùng khi chưa học từ phiếu nào.
   [mã mục, cột đầu, cột cuối, mô tả] cột tính theo chữ cái A tới H. */
/* ✅ SỬA 30/8/2026 (Sen). Phiếu nay bảy cột và không còn mục XI Xác nhận, nên
 * hai dòng cũ của mục đó đã gỡ. Cột H không còn tồn tại. */
const TB_MAC_DINH = [];

function buildTrinhBay() {
  const ss = _ss();
  let sh = ss.getSheetByName(CFG.SHEETS.TB);
  const cu = (sh && sh.getLastRow() > 3)
    ? sh.getRange(4,1,sh.getLastRow()-3,4).getValues().filter(function (d) { return d[0]; })
    : null;
  if (sh) ss.deleteSheet(sh);
  sh = ss.insertSheet(CFG.SHEETS.TB);

  _banner(sh, '🎨 QUY ƯỚC TRÌNH BÀY',
    'Mọi phiếu tạo sau đây làm theo bảng này. Sửa trực tiếp ở đây, hoặc chỉnh trên một phiếu rồi chạy 🎨 Học cách trình bày từ một phiếu.', 5);

  sh.getRange(2,1).setValue(
    'Mỗi dòng là một quy ước gộp ô: ở mục nào, gộp từ cột nào tới cột nào. ' +
    'Mục ghi bằng số La Mã đúng như trên phiếu. Gộp áp cho cả dòng tiêu đề lẫn các dòng dữ liệu của mục đó.')
    .setWrap(true).setFontColor(CFG.MAU.CHU_GHI).setFontSize(9);
  sh.getRange(2,1,1,5).merge();
  sh.setRowHeight(2, 32);

  _header(sh, 3, ['Mục','Cột đầu','Cột cuối','Ghi chú','Nguồn']);
  const D = cu || TB_MAC_DINH.map(function (d) { return [d[0], d[1], d[2], d[3]]; });
  let r = 4;
  D.forEach(function (d) {
    _oNhap(sh.getRange(r,1,1,4)).setValues([[d[0], d[1], d[2], d[3] || '']]);
    sh.getRange(r,1,1,3).setHorizontalAlignment('center');
    sh.getRange(r,5).setValue(cu ? 'giữ từ bản trước' : 'mặc định')
      .setFontColor(CFG.MAU.CHU_GHI).setFontSize(9);
    r++;
  });
  for (let i = 0; i < 6; i++) { _oNhap(sh.getRange(r,1,1,4)); r++; }   // dòng trống để thêm tay
  _khung(sh, 3, r - 4, 5);

  const rong = [90,100,100,600,160];
  for (let c = 0; c < rong.length; c++) sh.setColumnWidth(c+1, rong[c]);
  sh.getRange(1,1,r,5).setVerticalAlignment('middle');
  return sh;
}

/** Đọc quy ước gộp ô. Trả về {mục: [[cotDau, cotCuoi], ...]} */
function _docTrinhBay() {
  const sh = _ss().getSheetByName(CFG.SHEETS.TB);
  const out = {};
  if (!sh || sh.getLastRow() < 4) return out;
  sh.getRange(4,1,sh.getLastRow()-3,3).getValues().forEach(function (d) {
    const muc = String(d[0] || '').trim().toUpperCase();
    const a = String(d[1] || '').trim().toUpperCase();
    const b = String(d[2] || '').trim().toUpperCase();
    if (!muc || !a || !b) return;
    if (!out[muc]) out[muc] = [];
    out[muc].push([_cotSo(a), _cotSo(b)]);
  });
  return out;
}

function _cotSo(cl) {
  let x = 0;
  for (let i = 0; i < cl.length; i++) x = x * 26 + (cl.charCodeAt(i) - 64);
  return x;
}

/**
 * Áp quy ước gộp cho một khối dòng của một mục.
 * @param {Sheet} sh
 * @param {string} muc   số La Mã của mục, ví dụ 'I'
 * @param {number} dau   dòng đầu, tính cả dòng tiêu đề
 * @param {number} cuoi  dòng cuối
 * @param {Object} qu    kết quả của _docTrinhBay
 */
function _apTrinhBay(sh, muc, dau, cuoi, qu) {
  const ds = qu[String(muc).toUpperCase()];
  if (!ds || !ds.length) return;
  ds.forEach(function (v) {
    const c1 = v[0], soCot = v[1] - v[0] + 1;
    if (soCot < 2) return;
    for (let r = dau; r <= cuoi; r++) {
      try { sh.getRange(r, c1, 1, soCot).merge(); } catch (e) {}
    }
  });
}

/* ==================== HỌC TỪ MỘT PHIẾU ==================== */

/**
 * Đọc một file phiếu đã được chỉnh tay, rút ra các vùng gộp ô trong sheet
 * phiếu chấm, quy về từng mục, rồi ghi vào sheet Quy ước trình bày.
 */
function hocCachTrinhBay() {
  const ui = _ui();
  const q = ui.prompt('🎨 Học cách trình bày từ một phiếu',
    'Dán ID hoặc đường dẫn của phiếu đã chỉnh tay.\n\n' +
    'Hệ sẽ đọc các ô đã gộp trong sheet ' + THANG_SHEET[0] + ' của phiếu đó, ' +
    'quy về từng mục, rồi ghi vào sheet ' + CFG.SHEETS.TB + '. Mọi phiếu tạo sau đó làm theo.',
    ui.ButtonSet.OK_CANCEL);
  if (q.getSelectedButton() !== ui.Button.OK) return;

  const raw = q.getResponseText().trim();
  const m = raw.match(/[-\w]{25,}/);
  if (!m) { ui.alert('Không nhận ra ID trong chuỗi vừa dán.'); return; }

  let ssP;
  try { ssP = SpreadsheetApp.openById(m[0]); }
  catch (e) { ui.alert('Không mở được file đó.\n\n' + e.message); return; }
  const shP = ssP.getSheetByName(THANG_SHEET[0]);
  if (!shP) { ui.alert('File đó không có sheet "' + THANG_SHEET[0] + '".'); return; }

  // Bản đồ dòng sang mục: quét cột A tìm các dòng tiêu đề mục La Mã
  const v = shP.getRange(1,1,shP.getLastRow(),1).getValues();
  const moc = [];   // [{muc, dong}]
  v.forEach(function (row, i) {
    const s = String(row[0] || '').trim();
    const mm = s.match(/^([IVX]+)\.\s/);
    if (mm) moc.push({ muc: mm[1], dong: i + 1 });
  });
  if (!moc.length) { ui.alert('Không tìm thấy mục La Mã nào trong phiếu đó.'); return; }

  function mucCuaDong(r) {
    let ten = '';
    for (let i = 0; i < moc.length; i++) { if (moc[i].dong <= r) ten = moc[i].muc; else break; }
    return ten;
  }

  // Gom các vùng gộp, bỏ trùng
  const gom = {};
  shP.getRange(1,1,shP.getLastRow(),CFG.COT).getMergedRanges().forEach(function (rg) {
    if (rg.getNumColumns() < 2) return;
    const muc = mucCuaDong(rg.getRow());
    if (!muc) return;
    const khoa = muc + '|' + rg.getColumn() + '|' + (rg.getColumn() + rg.getNumColumns() - 1);
    gom[khoa] = (gom[khoa] || 0) + 1;
  });

  const ds = Object.keys(gom).map(function (k) {
    const p = k.split('|');
    return [p[0], _chuCot(+p[1]), _chuCot(+p[2]), 'Học từ phiếu, ' + gom[k] + ' dòng'];
  });
  if (!ds.length) { ui.alert('Phiếu đó không có ô gộp nào trong phạm vi các mục.'); return; }

  // Ghi vào sheet quy ước
  const ss = _ss();
  const shTB = ss.getSheetByName(CFG.SHEETS.TB) || buildTrinhBay();
  ss.deleteSheet(shTB);
  const sh = ss.insertSheet(CFG.SHEETS.TB);
  _banner(sh, '🎨 QUY ƯỚC TRÌNH BÀY',
    'Học từ phiếu ngày ' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm') +
    '. Mọi phiếu tạo sau đây làm theo bảng này.', 5);
  sh.getRange(2,1).setValue(
    'Mỗi dòng là một quy ước gộp ô: ở mục nào, gộp từ cột nào tới cột nào. Sửa trực tiếp ở đây được.')
    .setWrap(true).setFontColor(CFG.MAU.CHU_GHI).setFontSize(9);
  sh.getRange(2,1,1,5).merge(); sh.setRowHeight(2,32);
  _header(sh, 3, ['Mục','Cột đầu','Cột cuối','Ghi chú','Nguồn']);
  let r = 4;
  ds.sort().forEach(function (d) {
    _oNhap(sh.getRange(r,1,1,4)).setValues([d]);
    sh.getRange(r,1,1,3).setHorizontalAlignment('center');
    sh.getRange(r,5).setValue(ssP.getName()).setFontColor(CFG.MAU.CHU_GHI).setFontSize(9);
    r++;
  });
  for (let i = 0; i < 6; i++) { _oNhap(sh.getRange(r,1,1,4)); r++; }
  _khung(sh, 3, r-4, 5);
  const rong = [90,100,100,600,260];
  for (let c = 0; c < rong.length; c++) sh.setColumnWidth(c+1, rong[c]);

  _ghiNhatKy('Học cách trình bày', ds.length + ' quy ước từ ' + ssP.getName());
  sapXepSheet();
  ss.setActiveSheet(sh);
  ui.alert('Đã học ' + ds.length + ' quy ước ✅',
    ds.map(function (d) { return 'Mục ' + d[0] + ': gộp ' + d[1] + ' tới ' + d[2]; }).join('\n') +
    '\n\nMọi phiếu xuất sau đây làm theo. Sửa thêm trực tiếp ở sheet ' + CFG.SHEETS.TB + '.',
    ui.ButtonSet.OK);
}

function _chuCot(n) {
  let s = '';
  while (n > 0) { const d = (n - 1) % 26; s = String.fromCharCode(65 + d) + s; n = (n - 1 - d) / 26; }
  return s;
}
