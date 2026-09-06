/**
 * MODULE 10: Danh sách nhân sự và lịch sử đánh giá.
 *
 * Nhân sự KHÔNG nhập tay ở đây. Nó đồng bộ từ file People Management, sheet
 * 👥 Nhân sự, để tránh hai nơi cùng giữ một dữ liệu rồi trôi lệch.
 * Đồng bộ chạy tự động mỗi ngày, và chạy lại ngay trước mỗi lần xuất phiếu,
 * nên danh sách không bao giờ cũ hơn một lần thao tác. Bấm tay được bất cứ lúc nào.
 *
 * MÃ NHÂN SỰ là khóa chính. Tên trùng nhau vẫn phân biệt được, và thống kê
 * qua các đợt gom đúng người. Cột Tuyến là dữ liệu do Công ty gán, đồng bộ
 * giữ lại theo mã nên thêm hay bớt người không làm lệch cột này.
 *
 * TẠO PHIẾU BẰNG MỘT LẦN TICK: điền Đợt đang mở ở dòng 2, rồi tick ô ▶ ở dòng
 * của người cần đánh giá. Xem module 12.
 */

/* Vị trí cột trong sheet 👥 Nhân sự của file People Management.
   A STT · B Mã NV · C Họ tên · D Người điếc/ khiếm thính hay người nói · E Phòng ban
   F Điểm làm việc · G Vị trí theo Danh mục · H Ngày vào làm · I Trạng thái
   Dòng phân nhóm bắt đầu bằng ký tự ▸ và không có mã, bỏ qua khi đọc. */
const PM = { SHEET: '👥 Nhân sự', MA: 2, TEN: 3, NGHE: 4, PHONG: 5, DIEM: 6, VITRI: 7, VAO: 8, TT: 9 };

/* Bố cục sheet 👥 Nhân sự của file gốc */
const NS = {
  R_DOT: 2,      // dòng chứa Đợt đang mở và mốc đồng bộ
  R_HEAD: 3,
  R_DAU: 4,      // dòng dữ liệu đầu tiên
  C_MA: 1, C_TEN: 2, C_TICK: 3, C_LINK: 4, C_TUYEN: 5, C_NGHE: 6, C_PHONG: 7,
  C_VITRI: 8, C_DIEM: 9, C_VAO: 10, C_TT: 11, C_SOLAN: 12, C_DOTGAN: 13, C_KQGAN: 14,
  SOCOT: 14
};

/* ==================== SHEET NHÂN SỰ ==================== */

function buildNhanSu() {
  const ss = _ss();
  let sh = ss.getSheetByName(CFG.SHEETS.NS);

  // Giữ lại cột Tuyến do Công ty gán tay, khóa theo mã
  const ganCu = {};
  if (sh && sh.getLastRow() >= NS.R_DAU) {
    sh.getRange(NS.R_DAU, 1, sh.getLastRow()-NS.R_DAU+1, NS.C_TUYEN).getValues()
      .forEach(function (d) { if (d[0]) ganCu[String(d[0]).trim()] = _chuanTenTuyen(d[NS.C_TUYEN-1]); });
  }
  let dotCu = '';
  if (sh) { try { dotCu = sh.getRange(NS.R_DOT, 2).getValue(); } catch (e) {} ss.deleteSheet(sh); }
  sh = ss.insertSheet(CFG.SHEETS.NS);
  PropertiesService.getDocumentProperties().setProperty('NS_TUYEN_CU', JSON.stringify(ganCu));

  _banner(sh, '👥 NHÂN SỰ',
    'Đồng bộ từ People Management. Chỉ cột Tuyến là do Công ty gán. Tick ô ▶ để tạo file năm ngay cho người ở dòng đó.', NS.SOCOT);

  /* Dòng 2: đợt đang mở và mốc đồng bộ.
     ⚠️ KHÔNG gộp ô nào vắt qua ranh giới cột cố định. Sheet này cố định hai cột
     A và B, nên mọi ô gộp ở đây phải nằm HẲN trong A:B, hoặc HẲN từ C trở đi.
     Gộp vắt qua ranh giới thì Google Sheets từ chối cố định cột. */
  /* ✅ SỬA 30/8/2026 (Sen). Ô này nay là NĂM chứ không phải đợt, vì một người
   * chỉ còn một file cho cả năm và mười hai sheet tháng nằm sẵn trong đó. */
  sh.getRange(NS.R_DOT,1).setValue('NĂM ĐANG MỞ').setFontWeight('bold').setFontColor(CFG.MAU.DAM);
  _oNhap(sh.getRange(NS.R_DOT,2)).setValue(dotCu || new Date().getFullYear())
    .setFontWeight('bold').setHorizontalAlignment('center')
    .setNote('Mọi file tạo bằng ô tick ▶ sẽ vào năm này. Gõ đúng bốn chữ số, ví dụ 2026. Để trống thì hệ lấy năm hiện tại.');
  sh.getRange(NS.R_DOT,4).setValue('Đồng bộ lần cuối').setFontColor(CFG.MAU.CHU_GHI).setFontSize(9)
    .setHorizontalAlignment('right');
  sh.getRange(NS.R_DOT,5,1,2).merge().setBackground(CFG.MAU.CONG_THUC)
    .setHorizontalAlignment('center').setFontSize(9);
  sh.getRange(NS.R_DOT,7).setValue(
    'Tick ô ▶ là tạo file năm cho người ở dòng đó, gồm mười hai sheet tháng. Danh sách tự đồng bộ mỗi ngày.')
    .setFontColor(CFG.MAU.CHU_GHI).setFontSize(9).setWrap(true);
  sh.getRange(NS.R_DOT,7,1,NS.SOCOT-6).merge();
  sh.setRowHeight(NS.R_DOT, 30);
  _nr('NR_DOT_MO', sh.getRange(NS.R_DOT,2));

  _header(sh, NS.R_HEAD, ['Mã NV','Họ tên','▶','File năm','Tuyến (gán tay)',
    'Người điếc/ khiếm thính / Người nói','Phòng ban','Vị trí theo Danh mục','Điểm làm việc','Ngày vào làm',
    'Trạng thái','Số lần đã đánh giá','Kỳ gần nhất','Kết quả gần nhất']);
  sh.getRange(NS.R_HEAD, NS.C_TICK).setNote('Tick vào ô này để tạo FILE NĂM cho người ở dòng đó, theo NĂM ĐANG MỞ ở dòng 2. Ô tự bỏ tick sau khi tạo xong.');

  const rong = [90,190,40,150,160,140,140,150,120,110,110,110,180,220];
  for (let c = 0; c < rong.length; c++) sh.setColumnWidth(c+1, rong[c]);
  sh.setFrozenRows(NS.R_HEAD);
  _coDinhCot(sh, 2);
  return sh;
}

/**
 * Đọc People Management, đổ danh sách nhân sự vào sheet 👥 Nhân sự.
 * @param {boolean} im  true thì không hiện hộp thoại, dùng khi chạy tự động
 */
function dongBoNhanSu(im) {
  const ss = _ss();
  function bao(t, n) { if (!im) _ui().alert(t, n || '', _ui().ButtonSet.OK); }

  let pmId = '';
  try { pmId = String(ss.getRangeByName('TS_PM_ID').getValue() || '').trim(); } catch (e) {}
  if (!pmId) { bao('Chưa có ID file People Management.', 'Điền vào ô TS_PM_ID ở sheet ' + CFG.SHEETS.TS + '.'); return 0; }

  let pm;
  try { pm = SpreadsheetApp.openById(pmId); }
  catch (e) { bao('Không mở được file People Management.', e.message); return 0; }

  const shPM = pm.getSheetByName(PM.SHEET);
  if (!shPM) { bao('File People Management không có sheet "' + PM.SHEET + '".'); return 0; }

  const ds = [];
  shPM.getDataRange().getValues().forEach(function (row) {
    const ma = String(row[PM.MA-1] || '').trim();
    if (!ma || ma === 'Mã NV') return;
    if (String(row[0] || '').indexOf('▸') === 0) return;
    ds.push([ma, row[PM.TEN-1], row[PM.NGHE-1], row[PM.PHONG-1],
             row[PM.VITRI-1], row[PM.DIEM-1], row[PM.VAO-1], row[PM.TT-1]]);
  });
  if (!ds.length) { bao('Không đọc được nhân sự nào từ sheet ' + PM.SHEET + '.'); return 0; }

  const sh = buildNhanSu();
  const ganCu = JSON.parse(PropertiesService.getDocumentProperties().getProperty('NS_TUYEN_CU') || '{}');
  const n = ds.length, R = NS.R_DAU;

  const out = ds.map(function (d) {
    return [d[0], d[1], false, '', ganCu[d[0]] || '', d[2], d[3], d[4], d[5], d[6], d[7], '', '', ''];
  });
  sh.getRange(R,1,n,NS.SOCOT).setValues(out);

  // Ô tick
  sh.getRange(R,NS.C_TICK,n,1).insertCheckboxes().setHorizontalAlignment('center')
    .setBackground(CFG.MAU.INPUT);
  // Cột tuyến: nhập tay, có danh sách chọn
  _oNhap(sh.getRange(R,NS.C_TUYEN,n,1));
  _dvList(sh.getRange(R,NS.C_TUYEN,n,1), Object.keys(TUYEN));

  // Ba cột lịch sử: công thức tra từ sheet Lịch sử đánh giá
  const LS = "'" + CFG.SHEETS.LS + "'";
  const f = [];
  for (let i = 0; i < n; i++) {
    const r = R + i;
    f.push([
      _F('=COUNTIF(' + LS + '!$A:$A,$A' + r + ')'),
      _F('=IFERROR(INDEX(' + LS + '!$C:$C,MATCH(2,1/(' + LS + '!$A:$A=$A' + r + '))),"")'),
      _F('=IFERROR("CM "&INDEX(' + LS + '!$F:$F,MATCH(2,1/(' + LS + '!$A:$A=$A' + r + ')))&"  ·  QL "'
         + '&INDEX(' + LS + '!$G:$G,MATCH(2,1/(' + LS + '!$A:$A=$A' + r + ')))&"  ·  CLV "'
         + '&INDEX(' + LS + '!$H:$H,MATCH(2,1/(' + LS + '!$A:$A=$A' + r + '))),"chưa đánh giá")')
    ]);
  }
  sh.getRange(R,NS.C_SOLAN,n,3).setFormulas(f)
    .setBackground(CFG.MAU.CONG_THUC).setHorizontalAlignment('center');
  sh.getRange(R,NS.C_SOLAN,n,1).setFontWeight('bold');
  sh.getRange(R,NS.C_LINK,n,1).setBackground(CFG.MAU.CONG_THUC).setFontSize(9);
  _khung(sh, NS.R_HEAD, n, NS.SOCOT);

  // Nhân sự đã nghỉ: tô nhạt
  sh.setConditionalFormatRules([SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied(_F('=$K' + R + '<>"Đang làm"'))
    .setFontColor('#9aa0a6').setBackground('#f8f9fa')
    .setRanges([sh.getRange(R,1,n,NS.SOCOT)]).build()]);

  sh.getRange(NS.R_DOT,6).setValue(
    Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm') + ' · ' + n + ' người');

  if (!im) {
    _ghiNhatKy('Đồng bộ nhân sự', n + ' người từ People Management');
    _ui().alert('Đã đồng bộ ' + n + ' nhân sự ✅',
      'Hai việc nên làm ngay:\n' +
      '1. Điền CỘT TUYẾN cho từng người. Cột này giữ nguyên qua các lần đồng bộ sau.\n' +
      '2. Điền ĐỢT ĐANG MỞ ở dòng 2, rồi tick ô ▶ ở dòng của người cần đánh giá là phiếu tạo ngay.',
      _ui().ButtonSet.OK);
  }
  return n;
}

/* ==================== SHEET LỊCH SỬ ĐÁNH GIÁ ==================== */

function buildLichSu() {
  const ss = _ss();
  let sh = ss.getSheetByName(CFG.SHEETS.LS);
  if (sh && sh.getLastRow() > 2) return sh;      // đã có dữ liệu, không đụng
  if (!sh) sh = ss.insertSheet(CFG.SHEETS.LS);
  sh.clear();
  _banner(sh, '🗂️ LỊCH SỬ ĐÁNH GIÁ',
    'Mỗi dòng là một phiếu đã tạo. Ghi tự động khi xuất phiếu. Cột kết quả được điền khi chạy 📥 Thu kết quả một đợt.', 10);
  _header(sh, 2, ['Mã NV','Họ tên','Đợt','Tuyến','Ngày tạo phiếu',
                  'Bậc ngạch chuyên môn','Bậc ngạch quản lý','Bậc cách làm việc','Lần thứ','Đường dẫn phiếu']);
  const rong = [90,190,230,160,130,150,150,150,80,300];
  for (let c = 0; c < rong.length; c++) sh.setColumnWidth(c+1, rong[c]);
  sh.setFrozenRows(2);
  return sh;
}

/** Ghi một dòng khi vừa tạo phiếu. Trả về số thứ tự lần đánh giá của người đó. */
function _ghiLichSu(maNV, hoTen, dot, tuyen, url) {
  const sh = buildLichSu();
  const n = _demLichSu(maNV);
  sh.getRange(sh.getLastRow()+1, 1, 1, 10)
    .setValues([[maNV, hoTen, dot, tuyen, new Date(), '', '', '', n + 1, url]]);
  return n + 1;
}

function _demLichSu(maNV) {
  const sh = _ss().getSheetByName(CFG.SHEETS.LS);
  if (!sh || sh.getLastRow() < 3) return 0;
  return sh.getRange(3,1,sh.getLastRow()-2,1).getValues()
    .filter(function (d) { return String(d[0]).trim() === maNV; }).length;
}

function _phieuGanNhat(maNV) {
  const sh = _ss().getSheetByName(CFG.SHEETS.LS);
  if (!sh || sh.getLastRow() < 3) return '';
  const v = sh.getRange(3,1,sh.getLastRow()-2,10).getValues();
  for (let i = v.length - 1; i >= 0; i--) {
    if (String(v[i][0]).trim() === maNV) return v[i][9] || '';
  }
  return '';
}

/** Tra một nhân sự theo mã. Trả về null nếu không có. */
function _traNhanSu(maNV) {
  const sh = _ss().getSheetByName(CFG.SHEETS.NS);
  if (!sh || sh.getLastRow() < NS.R_DAU) return null;
  const v = sh.getRange(NS.R_DAU,1,sh.getLastRow()-NS.R_DAU+1,NS.SOCOT).getValues();
  for (let i = 0; i < v.length; i++) {
    if (String(v[i][0]).trim().toUpperCase() === String(maNV).trim().toUpperCase())
      return _dongThanhNS(v[i], NS.R_DAU + i);
  }
  return null;
}

/** Đọc nhân sự từ một dòng cụ thể của sheet. */
function _nhanSuTaiDong(sh, r) {
  const v = sh.getRange(r,1,1,NS.SOCOT).getValues()[0];
  if (!v[0]) return null;
  return _dongThanhNS(v, r);
}

function _dongThanhNS(v, r) {
  return { dong: r, ma: String(v[NS.C_MA-1]).trim(), ten: v[NS.C_TEN-1],
           tuyen: _chuanTenTuyen(v[NS.C_TUYEN-1]), nghe: v[NS.C_NGHE-1], phong: v[NS.C_PHONG-1],
           vitri: v[NS.C_VITRI-1], diem: v[NS.C_DIEM-1], vao: v[NS.C_VAO-1], tt: v[NS.C_TT-1] };
}
