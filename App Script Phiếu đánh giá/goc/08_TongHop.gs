/**
 * MODULE 08: Tổng hợp kỳ, nhật ký phiên bản, thu kết quả từ các file phiếu.
 *
 * Phiếu nằm rải trên Drive, mỗi người một file. Module này quét thư mục của
 * một đợt, đọc kết quả từng phiếu rồi dồn về sheet Tổng hợp kỳ trong file gốc.
 * Nhờ đó vẫn so được phân bố điểm giữa các bộ phận, là cách duy nhất phát hiện
 * thiên vị có hệ thống khi chấm.
 */

/* ✅ SỬA 30/8/2026 (Sen). Cột đổi theo phiếu mới: thêm ba điểm trung bình phần
 * và điểm tổng, bỏ cột Tỷ lệ cách làm việc và cột Số lần vi phạm nội quy.
 * Bảng này là NGUỒN DUY NHẤT của thứ tự cột, mọi chỗ khác đếm theo nó. */
const TH_COT = ['Thời điểm thu','Kỳ','Tuyến','Mã NV','Họ và tên','Vị trí','Vai trò quản lý',
                'Điểm văn hóa chung','Điểm ngạch chuyên môn','Điểm ngạch quản lý','ĐIỂM TỔNG',
                'Bậc cách làm việc','Bậc ngạch chuyên môn','Bậc ngạch quản lý',
                'Ranh giới','Bảo mật thu nhập','Đường dẫn file năm'];

function buildTongHop() {
  const ss = _ss();
  let sh = ss.getSheetByName(CFG.SHEETS.TH);

  /* Sheet cũ có dữ liệu nhưng SAI cột thì không xóa và cũng không dùng tiếp:
   * đổi tên rồi ẩn đi, dựng bảng mới bên cạnh. Ghi đè lên là mất dữ liệu kỳ cũ;
   * dùng tiếp là đọc số ở cột mang nghĩa khác. */
  if (sh && sh.getLastRow() > 2) {
    const dauCu = sh.getRange(2, 1, 1, TH_COT.length).getValues()[0].join('|');
    if (dauCu === TH_COT.join('|')) return;
    const moc = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'MMdd-HHmm');
    sh.setName('_cu 📊 Tổng hợp ' + moc);
    sh.hideSheet();
    sh = null;
  }
  if (!sh) sh = ss.insertSheet(CFG.SHEETS.TH);
  sh.clear();
  _banner(sh, '📊 TỔNG HỢP KỲ',
    'Kết quả các tháng đã thu về. Dữ liệu này để so phân bố giữa các bộ phận, và để về sau đối chiếu tiêu chí nào thật sự liên quan tới kết quả kinh doanh.', TH_COT.length);
  _header(sh, 2, TH_COT);
  sh.getRange(2, 16).setNote('Cột này cho biết Bậc cách làm việc ĐÃ bị trừ 1 hay chưa. Có vi phạm nghĩa là bậc đó đã trừ, sàn là bậc 1. Xem mục VII của phiếu.');
  const rong = [140,110,150,90,170,190,110,140,150,140,110,140,150,140,150,140,220];
  for (let c = 0; c < rong.length; c++) sh.setColumnWidth(c+1, rong[c]);
  sh.setFrozenRows(2);
  sh.getRange(3,1,1,1).setNote('Mỗi dòng là kết quả của một người trong một tháng. Chạy menu 📥 Thu kết quả một tháng để đổ dữ liệu về đây.');
}

function buildNhatKy() {
  const ss = _ss();
  let sh = ss.getSheetByName(CFG.SHEETS.NK);
  if (sh) return;
  sh = ss.insertSheet(CFG.SHEETS.NK);
  _banner(sh, '📜 NHẬT KÝ PHIÊN BẢN', 'Ghi lại mỗi lần dựng, cập nhật, xuất phiếu và thu kết quả.', 4);
  _header(sh, 2, ['Thời điểm','Hành động','Chi tiết','Phiên bản']);
  [180,220,700,140].forEach(function (w,i) { sh.setColumnWidth(i+1, w); });
  sh.setFrozenRows(2);
}

function _ghiNhatKy(hd, ct) {
  const sh = _ss().getSheetByName(CFG.SHEETS.NK);
  if (!sh) return;
  sh.getRange(sh.getLastRow()+1, 1, 1, 4).setValues([[new Date(), hd, ct, VERSION]]);
}

/* ==================== THU KẾT QUẢ MỘT THÁNG ==================== */

/**
 * Quét thư mục của một NĂM, mở từng file năm, đọc sheet của THÁNG được chọn,
 * rồi dồn về sheet Tổng hợp kỳ.
 * ✅ SỬA 30/8/2026 (Sen). Trước đây quét theo đợt, nay quét theo năm và tháng,
 * vì một người chỉ còn một file cho cả năm.
 */
function thuKetQuaThang() {
  const ui = _ui();
  const goc = _thuMucGoc();

  const dsNam = [];
  const it = goc.getFolders();
  while (it.hasNext()) {
    const t = it.next().getName();
    if (/^\d{4}$/.test(t)) dsNam.push(t);
  }
  dsNam.sort();
  if (!dsNam.length) { ui.alert('Chưa có thư mục năm nào trong thư mục đánh giá.'); return; }

  const q1 = ui.prompt('📥 Thu kết quả một tháng',
    'Gõ SỐ hoặc tên năm:\n\n' + dsNam.map(function (d,i) { return (i+1) + '. ' + d; }).join('\n'),
    ui.ButtonSet.OK_CANCEL);
  if (q1.getSelectedButton() !== ui.Button.OK) return;
  let nam = q1.getResponseText().trim();
  const so = parseInt(nam, 10);
  if (!isNaN(so) && so >= 1 && so <= dsNam.length) nam = dsNam[so-1];
  const fNam = goc.getFoldersByName(nam);
  if (!fNam.hasNext()) { ui.alert('Không có thư mục năm "' + nam + '".'); return; }

  const q2 = ui.prompt('Tháng nào', 'Gõ số tháng, từ 1 tới 12.', ui.ButtonSet.OK_CANCEL);
  if (q2.getSelectedButton() !== ui.Button.OK) return;
  const thang = parseInt(String(q2.getResponseText()).trim(), 10);
  if (isNaN(thang) || thang < 1 || thang > 12) { ui.alert('Tháng không hợp lệ.'); return; }
  const tenSheet = THANG_SHEET[thang - 1];
  const ky = nam + '-' + ('0' + thang).slice(-2);

  const th = _ss().getSheetByName(CFG.SHEETS.TH);
  const out = [], loi = [];
  const itT = fNam.next().getFolders();
  while (itT.hasNext()) {
    const fT = itT.next();
    const tuyen = fT.getName().replace(/^Tuyến /, '');
    const itF = fT.getFilesByType(MimeType.GOOGLE_SHEETS);
    while (itF.hasNext()) {
      const f = itF.next();
      try {
        const d = _docMotThang(f, tenSheet, ky, tuyen);
        if (d) out.push(d);
      } catch (e) { loi.push(f.getName() + ': ' + e.message); }
    }
  }

  if (!out.length) {
    ui.alert('Không đọc được file nào của tháng này.' + (loi.length ? '\n\n' + loi.join('\n') : ''));
    return;
  }

  // Xóa dòng cũ của đúng kỳ này rồi ghi lại, để chạy nhiều lần không nhân bản
  if (th.getLastRow() > 2) {
    const v = th.getRange(3,1,th.getLastRow()-2,2).getValues();
    for (let i = v.length - 1; i >= 0; i--) {
      if (String(v[i][1]) === ky) th.deleteRow(i + 3);
    }
  }
  th.getRange(th.getLastRow()+1, 1, out.length, TH_COT.length).setValues(out);
  _ghiNhatKy('Thu kết quả', ky + ' · ' + out.length + ' người' + (loi.length ? ' · ' + loi.length + ' lỗi' : ''));

  ui.alert('Đã thu ' + out.length + ' người ✅',
    'Kỳ: ' + ky + (loi.length ? '\n\nKhông đọc được ' + loi.length + ' file:\n' + loi.join('\n') : ''),
    ui.ButtonSet.OK);
}

/**
 * Đọc kết quả một tháng trong một file năm. Trả về một dòng cho Tổng hợp kỳ.
 * Địa chỉ các ô lấy từ sheet _chiMuc, không dò và không đoán.
 */
function _docMotThang(file, tenSheet, ky, tuyen) {
  const ss = SpreadsheetApp.openById(file.getId());
  const cm = ss.getSheetByName(CFG.CHIMUC_SHEET);
  const sh = ss.getSheetByName(tenSheet);
  if (!cm || !sh) return null;

  const V = {};
  cm.getDataRange().getValues().forEach(function (d) {
    if (d[0]) V[String(d[0])] = { dong: d[1], cot: d[2] };
  });
  function lay(khoa) {
    const o = V[khoa];
    if (!o || !o.dong || !o.cot) return '';
    return sh.getRange(Number(o.dong), Number(o.cot)).getValue();
  }

  const ten = String(file.getName());
  const maNV = (ten.match(/-\s*(TTX\w+)\s*-/i) || ['',''])[1];
  const hoTen = sh.getRange(1,1).getValue();

  const row = [
    new Date(), ky, tuyen, maNV,
    _tenTuTieuDe(String(hoTen)),
    '',                                          // Vị trí, điền ở dưới theo nhãn
    '',                                          // Vai trò quản lý, điền ở dưới
    lay('kq_diem_van_hoa'), lay('kq_diem_chuyen_mon'), lay('kq_diem_quan_ly'),
    lay('kq_diem_tong'),
    lay('kq_bac_cach_lam_viec'), lay('kq_bac_chuyen_mon'), lay('kq_bac_quan_ly'),
    lay('kq_ranh_gioi'), lay('o_bao_mat_thu_nhap'),
    file.getUrl()
  ];

  /* Vị trí và vai trò quản lý đọc từ khối thông tin, tìm theo nhãn ở cột B để
   * không phụ thuộc vào số dòng. */
  const nhan = sh.getRange(1, 2, Math.min(sh.getLastRow(), 40), 2).getValues();
  nhan.forEach(function (d) {
    if (String(d[0]).trim() === 'Vị trí') row[5] = d[1];
    if (String(d[0]).trim() === 'Cấp')    row[6] = _laQuanLy(String(d[1])) ? 'Có' : 'Không';
  });

  if (!row[4]) return null;
  _capNhatLichSu(maNV, ky, row[12], row[13], row[11]);
  return row;
}

/** Rút họ tên khỏi dòng tiêu đề của sheet tháng. */
function _tenTuTieuDe(s) {
  const p = String(s).split('·');
  return p.length >= 2 ? String(p[1]).trim() : '';
}

/** Điền kết quả vào đúng dòng của sheet Lịch sử đánh giá. */
function _capNhatLichSu(maNV, ky, bCM, bQL, bP2) {
  const sh = _ss().getSheetByName(CFG.SHEETS.LS);
  if (!sh || sh.getLastRow() < 3) return;
  const v = sh.getRange(3,1,sh.getLastRow()-2,3).getValues();
  for (let i = 0; i < v.length; i++) {
    if (String(v[i][0]).trim() === String(maNV).trim() && String(v[i][2]).trim() === String(ky).trim()) {
      sh.getRange(i+3, 6, 1, 3).setValues([[bCM, bQL, bP2]]);
      return;
    }
  }
}
