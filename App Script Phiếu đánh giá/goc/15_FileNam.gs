/**
 * MODULE 15: FILE NĂM của một người.
 *
 * ✅ CHỐT 30/8/2026 (Sen). Thay hẳn lối cũ mỗi đợt một file. Một người có ĐÚNG
 * MỘT link cho cả năm, và mười hai sheet tháng đã lập sẵn ngay từ lúc tạo file.
 * Chốt điểm tháng này xong thì sang tab kế bên, không phải xuất file mới, không
 * phải đi tìm link mới.
 *
 * CÂY THƯ MỤC
 *   People / People Management / Đánh giá /
 *     2026 /
 *       Tuyến Thương mại & Dịch vụ /
 *         Đánh giá 2026 - TTX017 - Nguyễn Trọng Duy
 *
 * CÁC SHEET TRONG MỘT FILE NĂM
 *   T01 tới T12          phiếu chấm của từng tháng, dựng bằng buildPhieuThang
 *   📐 <tên tuyến>       ma trận cấp bậc của tuyến, để tra chuẩn
 *   🧬 Khung chung       khung dùng chung toàn Công ty
 *   _log        ẩn      app HTML ghi từng biên bản và từng phiếu ghi nhận vào đây
 *   _chiMuc     ẩn      bản đồ mã câu sang số dòng, để app ghi đúng ô
 *   📝 Nhận xét định tính  ẩn
 *   ⚙️ Tham số            ẩn
 *
 * ⛔ MƯỜI HAI SHEET THÁNG CÓ SỐ DÒNG GIỐNG HỆT NHAU, vì cùng một tuyến và cùng
 * một cấp thì bộ câu hỏi không đổi trong năm. Nhờ vậy sheet _chiMuc chỉ cần một
 * bản đồ dùng cho cả mười hai tháng. Đổi cấp giữa năm thì phải dựng lại file,
 * xem hàm dungLaiFileNam.
 */

const THANG_SHEET = ['T01','T02','T03','T04','T05','T06','T07','T08','T09','T10','T11','T12'];

/* Vốn từ của cột Loại trong sheet _log. App chỉ được ghi một trong bốn giá trị này. */
const LOG_LOAI = ['Vi phạm', 'Ghi nhận', 'Vi phạm nội quy', 'Việc ngoài vị trí'];


/* ==================== MENU ==================== */

function taoFileNamMotNguoi() {
  const ui = _ui();
  _dongBoTruocKhiXuat();
  const q = ui.prompt('📅 Tạo file năm cho một người',
    'Nhập MÃ NHÂN SỰ, ví dụ TTX017.\n\n' +
    'Hệ tạo một file cho cả năm, bên trong có sẵn 12 sheet tháng T01 tới T12.',
    ui.ButtonSet.OK_CANCEL);
  if (q.getSelectedButton() !== ui.Button.OK) return;
  const ma = q.getResponseText().trim().toUpperCase();
  if (!ma) { ui.alert('Chưa nhập mã nhân sự.'); return; }

  const ns = _traNhanSu(ma);
  if (!ns) { ui.alert('Không có mã "' + ma + '" trong sheet ' + CFG.SHEETS.NS + '.'); return; }
  const tuyen = _chotTuyen(ns); if (!tuyen) return;
  const nam = _hoiNam();        if (!nam) return;

  const kq = taoFileNam(tuyen, nam, ns);
  ui.alert('Đã tạo file năm ✅',
    ns.ma + ' · ' + ns.ten + '\nNăm ' + nam + ' · 12 sheet tháng\n\n' + kq.url,
    ui.ButtonSet.OK);
}

function taoFileNamNhieuNguoi() {
  const ui = _ui();
  _dongBoTruocKhiXuat();
  const q = ui.prompt('📚 Tạo file năm cho nhiều người',
    'Dán danh sách MÃ NHÂN SỰ, mỗi dòng một mã hoặc ngăn nhau bằng dấu phẩy.\n\n' +
    'Mỗi lần tối đa 6 người, vì một file năm nặng gấp mười hai lần một phiếu cũ ' +
    'và Apps Script có giới hạn thời gian chạy.',
    ui.ButtonSet.OK_CANCEL);
  if (q.getSelectedButton() !== ui.Button.OK) return;

  const dsMa = q.getResponseText().split(/[\n,;]/)
    .map(function (x) { return x.trim().toUpperCase(); }).filter(function (x) { return x; });
  if (!dsMa.length) { ui.alert('Chưa nhập mã nào.'); return; }
  if (dsMa.length > 6) { ui.alert('Mỗi lần tối đa 6 người.'); return; }

  const nam = _hoiNam(); if (!nam) return;

  const xong = [], bo = [];
  dsMa.forEach(function (ma) {
    const ns = _traNhanSu(ma);
    if (!ns)       { bo.push(ma + ': không có trong danh sách nhân sự'); return; }
    if (!ns.tuyen) { bo.push(ma + ' ' + ns.ten + ': chưa gán tuyến'); return; }
    ns.tuyen = _chuanTenTuyen(ns.tuyen);
    if (!TUYEN[ns.tuyen]) { bo.push(ma + ' ' + ns.ten + ': tuyến "' + ns.tuyen + '" không có trong hệ'); return; }
    taoFileNam(ns.tuyen, nam, ns);
    xong.push(ma + ' ' + ns.ten);
  });

  ui.alert('Đã tạo ' + xong.length + ' file năm ✅',
    (xong.length ? xong.join('\n') : '') +
    (bo.length ? '\n\nBỏ qua ' + bo.length + ':\n' + bo.join('\n') : '') +
    '\n\nThư mục năm: ' + _thuMucCon(_thuMucGoc(), String(nam)).getUrl(),
    ui.ButtonSet.OK);
}

function _hoiNam() {
  const ui = _ui();
  const macDinh = new Date().getFullYear();
  const q = ui.prompt('Năm đánh giá',
    'Gõ năm, ví dụ ' + macDinh + '. Để trống thì lấy ' + macDinh + '.',
    ui.ButtonSet.OK_CANCEL);
  if (q.getSelectedButton() !== ui.Button.OK) return null;
  const t = q.getResponseText().trim();
  if (!t) return macDinh;
  const n = parseInt(t, 10);
  if (isNaN(n) || n < 2020 || n > 2100) { ui.alert('Năm không hợp lệ: "' + t + '".'); return null; }
  return n;
}


/* ==================== DỰNG FILE ==================== */

/**
 * Tạo file năm hoàn chỉnh cho một người. Trả về {url, id}.
 * @param {string} tuyen
 * @param {number} nam
 * @param {Object} ns  một dòng của sheet Nhân sự
 */
function taoFileNam(tuyen, nam, ns) {
  const ssGoc = _ss();
  const thuMuc = _thuMucCon(_thuMucCon(_thuMucGoc(), String(nam)), 'Tuyến ' + tuyen);
  const ten = 'Đánh giá ' + nam + ' - ' + ns.ma + ' - ' + ns.ten;

  const cu = thuMuc.getFilesByName(ten);
  while (cu.hasNext()) cu.next().setTrashed(true);

  const ssMoi = SpreadsheetApp.create(ten);
  const fileMoi = DriveApp.getFileById(ssMoi.getId());
  thuMuc.addFile(fileMoi);
  DriveApp.getRootFolder().removeFile(fileMoi);

  // Sheet tra cứu chép từ file gốc
  [CFG.SHEETS.TS, CFG.SHEETS.CHUNG, CFG.MT_PREFIX + tuyen].forEach(function (t) {
    const s = ssGoc.getSheetByName(t);
    if (s) s.copyTo(ssMoi).setName(t);
  });
  _dungLaiNamedRange(ssMoi);

  const cap = _capTuViTri(ns.vitri);
  const laQL = _laQuanLy(ns.vitri);

  // Sheet log phải có TRƯỚC các sheet tháng, vì công thức của phiếu trỏ vào nó
  _buildLog(ssMoi);

  let chiMuc = null;
  THANG_SHEET.forEach(function (tn, i) {
    const V = buildPhieuThang(ssMoi, tn, tuyen, {
      maNV: ns.ma, hoTen: ns.ten, viTri: ns.vitri, cap: cap ? cap.cap : '',
      phong: ns.phong, diem: ns.diem,
      thang: ('0' + (i + 1)).slice(-2), nam: nam,
      quanLy: laQL ? 'Có' : 'Không',
      nhomNN: _chuanNhomNN(ns.nghe),
      sheetTruoc: i > 0 ? THANG_SHEET[i - 1] : ''
    });
    if (i === 0) chiMuc = V;
  });

  _buildChiMuc(ssMoi, tuyen, chiMuc);

  // Bộ câu hỏi định tính, một bản cho cả năm, ẩn đi
  buildDinhTinh(ssMoi, tuyen, { maNV: ns.ma, hoTen: ns.ten, dot: 'Năm ' + nam });

  ['Trang tính1','Sheet1'].forEach(function (t) {
    const s = ssMoi.getSheetByName(t);
    if (s && ssMoi.getSheets().length > 1) { try { ssMoi.deleteSheet(s); } catch (e) {} }
  });

  // Thứ tự tab: 12 tháng, rồi hai sheet tra cứu
  let vt = 1;
  THANG_SHEET.forEach(function (tn) { _dua(ssMoi, tn, vt); vt++; });
  _dua(ssMoi, CFG.MT_PREFIX + tuyen, vt); vt++;
  _dua(ssMoi, CFG.SHEETS.CHUNG, vt);

  /* Bốn sheet ẩn. ✅ CHỐT 30/8/2026 (Sen) với sheet định tính: nó không phải
   * phần nhân sự đọc trong tháng, và để hiện thì nó chiếm một tab ngang hàng
   * với mười hai tháng. */
  [CFG.SHEETS.TS, CFG.PDT_SHEET, CFG.LOG_SHEET, CFG.CHIMUC_SHEET].forEach(function (t) {
    const s = ssMoi.getSheetByName(t);
    if (s) s.hideSheet();
  });

  SpreadsheetApp.flush();
  const url = fileMoi.getUrl();
  _ghiLichSu(ns.ma, ns.ten, 'Năm ' + nam, tuyen, url);
  _ghiNhatKy('Tạo file năm', nam + ' · ' + tuyen + ' · ' + ns.ma + ' ' + ns.ten);
  return { url: url, id: ssMoi.getId() };
}


/* ==================== SHEET LOG ==================== */

/**
 * Sheet _log: nơi app HTML ghi vào. Mỗi biên bản vi phạm hoặc phiếu ghi nhận là
 * MỘT DÒNG. Phiếu của tháng đọc ngược lên đây bằng COUNTIFS và QUERY.
 *
 * ⛔ App ghi THÊM DÒNG vào cuối, không sửa dòng cũ và không xóa dòng cũ. Sửa một
 * biên bản đã lập thì ghi một dòng mới ghi rõ là bản thay thế. Nhờ vậy lịch sử
 * của tháng đọc lại được, và một điểm bất kỳ trên phiếu truy được về sự việc.
 */
function _buildLog(ssMoi) {
  const sh = ssMoi.insertSheet(CFG.LOG_SHEET);
  const H = ['Tháng','Ngày','Loại','Mã câu','Sự việc','Số hiệu','Người lập','Điểm áp'];
  sh.getRange(1, 1, 1, H.length).setValues([H])
    .setBackground(CFG.MAU.HEADER).setFontColor('#ffffff').setFontWeight('bold');
  sh.setFrozenRows(1);

  const rong = [70, 100, 140, 90, 520, 120, 160, 80];
  for (let c = 0; c < rong.length; c++) sh.setColumnWidth(c + 1, rong[c]);

  sh.getRange(2, 10).setValue(
    'Cột Tháng nhận đúng một trong: ' + THANG_SHEET.join(', ') + '.\n' +
    'Cột Loại nhận đúng một trong: ' + LOG_LOAI.join(' · ') + '.\n' +
    'Cột Mã câu là mã đúng như ở sheet ' + CFG.CHIMUC_SHEET + ', ví dụ VH1.1, B3.7, QA1, RG4, BM1.\n' +
    'Loại "Vi phạm nội quy" và "Việc ngoài vị trí" không cần mã câu, chúng đổ vào mục V và mục VI của phiếu.\n' +
    'Cột Điểm áp là điểm mà app đã ghi vào ô của mã câu đó, giữ lại để đối chiếu.\n' +
    'Ghi thêm dòng vào cuối, không sửa và không xóa dòng cũ.')
    .setWrap(true).setFontSize(9).setFontColor(CFG.MAU.CHU_GHI);
  sh.setColumnWidth(10, 640);
  return sh;
}


/* ==================== SHEET CHỈ MỤC ==================== */

/**
 * Sheet _chiMuc: bản đồ mã câu sang số dòng trên sheet tháng, cộng địa chỉ cố
 * định của khối kết quả. App đọc sheet này rồi ghi thẳng vào đúng ô, không dò.
 *
 * ⛔ Số dòng dùng chung cho CẢ MƯỜI HAI THÁNG. Đúng vì mười hai sheet dựng từ
 * cùng một bộ câu hỏi và cùng một cấp trong một lần chạy.
 */
function _buildChiMuc(ssMoi, tuyen, V) {
  const sh = ssMoi.insertSheet(CFG.CHIMUC_SHEET);
  let r = 1;

  sh.getRange(r, 1).setValue('BẢN ĐỒ Ô CỦA MỘT SHEET THÁNG. Áp cho cả 12 sheet T01 tới T12.')
    .setFontWeight('bold');
  r += 2;

  sh.getRange(r, 1, 1, 4).setValues([['Khóa','Dòng','Cột','Ý nghĩa']])
    .setBackground(CFG.MAU.HEADER).setFontColor('#ffffff').setFontWeight('bold');
  r++;

  const KQ = V.KQ || {};
  const CO = [
   ['tuyen',        '',            '',  tuyen],
   ['cot_ma',       '',            PC.MA,     'Mã câu'],
   ['cot_diem',     '',            PC.DIEM,   'Điểm, đây là ô app ghi vào'],
   ['cot_so_bien_ban','',          PC.SOBB,   'Số biên bản, công thức đếm từ _log'],
   ['cot_su_viec',  '',            PC.SUVIEC, 'Sự việc, app ghi vào được'],
   ['cot_pham_vi',  '',            PC.PV,     'Thuộc phạm vi, cột ẩn, máy dùng'],
   ['kq_diem_van_hoa',   KQ.vh,    PC.DIEM, 'Điểm trung bình văn hóa chung'],
   ['kq_diem_chuyen_mon',KQ.cm,    PC.DIEM, 'Điểm trung bình ngạch chuyên môn'],
   ['kq_diem_quan_ly',   KQ.ql,    PC.DIEM, 'Điểm trung bình ngạch quản lý'],
   ['kq_diem_tong',      KQ.tong,  PC.DIEM, 'Điểm tổng tháng, thang 5'],
   ['kq_bac_cach_lam_viec', KQ.bacP2, PC.DIEM, 'Bậc cách làm việc của tháng'],
   ['kq_ranh_gioi',      KQ.ranh,  PC.DIEM, 'Trạng thái ranh giới'],
   ['dai_van_hoa',       V.vh + ':' + V.vhC,  '', 'Dải dòng của mục II'],
   ['dai_chuyen_mon',    V.cm ? (V.cm + ':' + V.cmC) : '', '', 'Dải dòng của mục III'],
   ['dai_quan_ly',       V.ql ? (V.ql + ':' + V.qlC) : '', '', 'Dải dòng của mục IV'],
   ['dai_ranh_gioi',     V.rg + ':' + V.rgC,  '', 'Dải dòng của mục I'],
   ['o_bao_mat_thu_nhap', V.bm,    PC.DIEM, 'Ô kết quả bảo mật thu nhập, mục VII']
  ];
  CO.forEach(function (d) {
    sh.getRange(r, 1, 1, 4).setValues([[d[0], d[1], d[2], d[3]]]);
    r++;
  });
  r++;

  sh.getRange(r, 1).setValue('BẢN ĐỒ MÃ CÂU SANG DÒNG').setFontWeight('bold');
  r++;
  sh.getRange(r, 1, 1, 6).setValues([['Mã câu','Dòng','Mục','Nhóm','Logic đo','Điểm mặc định']])
    .setBackground(CFG.MAU.HEADER).setFontColor('#ffffff').setFontWeight('bold');
  r++;
  const ds = V.chiMuc || [];
  if (ds.length) {
    sh.getRange(r, 1, ds.length, 6).setValues(ds);
    r += ds.length;
  }

  const rong = [150, 120, 70, 200, 110, 120];
  for (let c = 0; c < rong.length; c++) sh.setColumnWidth(c + 1, rong[c]);
  return sh;
}


/* ==================== ÁP BỘ CÂU HỎI MỚI ==================== */

/**
 * Áp bộ câu hỏi mới cho các tháng CHƯA CHỐT của nhiều người một lượt.
 *
 * ✅ CHỐT 30/8/2026 (Sen). Bộ câu hỏi đổi giữa tháng cũng phải áp được, nên
 * hàm này dựng lại sheet tháng theo bộ mới nhưng GIỮ NGUYÊN điểm đã nhập.
 *
 * ⛔ LÀM ĐƯỢC VÌ MỌI THỨ KHÓA THEO MÃ CÂU, KHÔNG THEO SỐ DÒNG. Trước khi dựng
 * lại, đọc cặp {mã câu, điểm} và {mã câu, sự việc} của sheet cũ qua bản đồ
 * _chiMuc. Dựng xong thì ghi trả vào đúng mã đó ở vị trí mới.
 *
 *   Câu còn trong bộ mới  -> giữ nguyên điểm và sự việc
 *   Câu MỚI thêm vào      -> nhận điểm mặc định của chiều đo nhóm nó
 *   Câu đã tắt hoặc xóa   -> mất khỏi phiếu, và đó là đúng ý
 *
 * Sheet _log KHÔNG bị đụng tới, nên số biên bản và hai bảng mục V, VI vẫn đúng.
 */
function apBoCauHoiMoi() {
  const ui = _ui();
  const goc = _thuMucGoc();

  const dsNam = [];
  const it = goc.getFolders();
  while (it.hasNext()) { const t = it.next().getName(); if (/^\d{4}$/.test(t)) dsNam.push(t); }
  dsNam.sort();
  if (!dsNam.length) { ui.alert('Chưa có thư mục năm nào.'); return; }

  const q1 = ui.prompt('🔁 Áp bộ câu hỏi mới cho các tháng chưa chốt',
    'Gõ SỐ hoặc tên năm:\n\n' + dsNam.map(function (d, i) { return (i+1) + '. ' + d; }).join('\n') +
    '\n\nĐiểm đã nhập của những câu còn trong bộ mới sẽ được GIỮ NGUYÊN.',
    ui.ButtonSet.OK_CANCEL);
  if (q1.getSelectedButton() !== ui.Button.OK) return;
  let nam = q1.getResponseText().trim();
  const so = parseInt(nam, 10);
  if (!isNaN(so) && so >= 1 && so <= dsNam.length) nam = dsNam[so-1];
  const fNam = goc.getFoldersByName(nam);
  if (!fNam.hasNext()) { ui.alert('Không có thư mục năm "' + nam + '".'); return; }

  const q2 = ui.prompt('Áp từ tháng nào',
    'Gõ số tháng, từ 1 tới 12. Các tháng TRƯỚC tháng này giữ nguyên hoàn toàn.\n\n' +
    'Đổi giữa tháng thì gõ chính tháng đang chạy, điểm đã nhập vẫn giữ.',
    ui.ButtonSet.OK_CANCEL);
  if (q2.getSelectedButton() !== ui.Button.OK) return;
  const tuThang = parseInt(String(q2.getResponseText()).trim(), 10);
  if (isNaN(tuThang) || tuThang < 1 || tuThang > 12) { ui.alert('Tháng không hợp lệ.'); return; }

  if (ui.alert('Xác nhận',
      'Sẽ dựng lại tháng ' + THANG_SHEET[tuThang-1] + ' tới T12 của MỌI file năm ' + nam + '.\n\n' +
      'Giữ nguyên: điểm và sự việc của những câu còn trong bộ mới, sheet ' + CFG.LOG_SHEET +
      ', và các tháng trước tháng ' + tuThang + '.\n\n' +
      'Mất: những câu đã tắt hoặc đã xóa khỏi bộ câu hỏi.\n\nTiếp tục?',
      ui.ButtonSet.YES_NO) !== ui.Button.YES) return;

  const xong = [], loi = [];
  const itT = fNam.next().getFolders();
  while (itT.hasNext()) {
    const fT = itT.next();
    const tuyen = fT.getName().replace(/^Tuyến /, '');
    if (!TUYEN[tuyen]) { loi.push('Bỏ qua thư mục "' + fT.getName() + '": không phải tên tuyến'); continue; }
    const itF = fT.getFilesByType(MimeType.GOOGLE_SHEETS);
    while (itF.hasNext()) {
      const f = itF.next();
      try {
        const n = _apChoMotFile(f, tuyen, nam, tuThang);
        if (n) xong.push(f.getName() + ': ' + n + ' tháng');
      } catch (e) { loi.push(f.getName() + ': ' + e.message); }
    }
  }

  _ghiNhatKy('Áp bộ câu hỏi mới', nam + ' · từ tháng ' + tuThang + ' · ' + xong.length + ' file');
  ui.alert('Đã áp cho ' + xong.length + ' file ✅',
    (xong.length ? xong.join('\n') : '') +
    (loi.length ? '\n\nKhông làm được ' + loi.length + ':\n' + loi.join('\n') : '') +
    '\n\n⚠️ Bản đồ ' + CFG.CHIMUC_SHEET + ' của các file này đã đổi. Báo bên IT đọc lại trước khi ghi tiếp.',
    ui.ButtonSet.OK);
}

/**
 * Áp cho MỘT file năm. Trả về số sheet tháng đã dựng lại.
 * Mã nhân sự và cấp lấy lại từ sheet Nhân sự để bắt kịp thay đổi vị trí.
 */
function _apChoMotFile(file, tuyen, nam, tuThang) {
  const ssP = SpreadsheetApp.openById(file.getId());
  const shCM = ssP.getSheetByName(CFG.CHIMUC_SHEET);
  if (!shCM) throw new Error('không có sheet ' + CFG.CHIMUC_SHEET + ', không phải file năm');

  const maNV = (String(file.getName()).match(/-\s*(TTX\w+)\s*-/i) || ['',''])[1];
  const ns = maNV ? _traNhanSu(maNV) : null;
  if (!ns) throw new Error('không tra được mã nhân sự từ tên file');
  const cap = _capTuViTri(ns.vitri);
  const laQL = _laQuanLy(ns.vitri);

  // Bản đồ mã câu sang dòng của bộ CŨ, để đọc lại điểm trước khi vẽ đè
  const cu = {};
  shCM.getDataRange().getValues().forEach(function (d) {
    const ma = String(d[0] || '').trim();
    const dong = Number(d[1]);
    if (ma && dong && !/^(tuyen|cot_|kq_|dai_|o_)/.test(ma)) cu[ma] = dong;
  });

  let dem = 0, chiMuc = null;
  for (let i = tuThang - 1; i < 12; i++) {
    const tenSheet = THANG_SHEET[i];
    const sh = ssP.getSheetByName(tenSheet);

    // Đọc lại điểm và sự việc theo MÃ CÂU
    const giu = {};
    if (sh) {
      Object.keys(cu).forEach(function (ma) {
        const r = cu[ma];
        try {
          giu[ma] = { diem: sh.getRange(r, PC.DIEM).getValue(),
                      suViec: sh.getRange(r, PC.SUVIEC).getValue() };
        } catch (e) {}
      });
    }

    const V = buildPhieuThang(ssP, tenSheet, tuyen, {
      maNV: ns.ma, hoTen: ns.ten, viTri: ns.vitri, cap: cap ? cap.cap : '',
      phong: ns.phong, diem: ns.diem,
      thang: ('0' + (i + 1)).slice(-2), nam: nam,
      quanLy: laQL ? 'Có' : 'Không',
      nhomNN: _chuanNhomNN(ns.nghe),
      sheetTruoc: i > 0 ? THANG_SHEET[i - 1] : ''
    });
    if (chiMuc === null) chiMuc = V;

    // Ghi trả điểm cũ vào vị trí MỚI của cùng mã câu
    const shMoi = ssP.getSheetByName(tenSheet);
    (V.chiMuc || []).forEach(function (d) {
      const ma = d[0], dongMoi = d[1];
      const g = giu[ma];
      if (!g) return;                                  // câu mới, để nguyên mặc định
      if (g.diem !== '' && g.diem !== null && g.diem !== undefined)
        shMoi.getRange(dongMoi, PC.DIEM).setValue(g.diem);
      if (g.suViec !== '' && g.suViec !== null && g.suViec !== undefined)
        shMoi.getRange(dongMoi, PC.SUVIEC).setValue(g.suViec);
    });

    _dua(ssP, tenSheet, i + 1);
    dem++;
  }

  ssP.deleteSheet(shCM);
  _buildChiMuc(ssP, tuyen, chiMuc);
  ssP.getSheetByName(CFG.CHIMUC_SHEET).hideSheet();
  SpreadsheetApp.flush();
  return dem;
}


/* ==================== DỰNG LẠI KHI ĐỔI CẤP ==================== */

/**
 * Đổi cấp hoặc đổi tuyến giữa năm làm bộ câu hỏi đổi, tức số dòng đổi theo, nên
 * sheet _chiMuc của file cũ không còn đúng. Hàm này dựng lại các sheet tháng
 * CHƯA CHỐT và giữ nguyên sheet _log.
 *
 * ⛔ Sheet tháng đã chốt điểm thì KHÔNG dựng lại, vì dựng lại là mất điểm đã chốt.
 * Người chạy phải nói rõ tháng bắt đầu dựng lại.
 */
function dungLaiFileNam() {
  const ui = _ui();
  const q1 = ui.prompt('🔁 Dựng lại các tháng chưa chốt',
    'Dán ID hoặc đường dẫn của FILE NĂM cần dựng lại.\n\n' +
    'Dùng khi người đó đổi cấp hoặc đổi tuyến giữa năm. Sheet _log giữ nguyên.',
    ui.ButtonSet.OK_CANCEL);
  if (q1.getSelectedButton() !== ui.Button.OK) return;
  const m = String(q1.getResponseText()).match(/[-\w]{25,}/);
  if (!m) { ui.alert('Không nhận ra ID trong chuỗi vừa dán.'); return; }

  const q2 = ui.prompt('Dựng lại từ tháng nào',
    'Gõ số tháng, ví dụ 9. Các tháng TRƯỚC tháng này giữ nguyên, gồm cả điểm đã chốt.',
    ui.ButtonSet.OK_CANCEL);
  if (q2.getSelectedButton() !== ui.Button.OK) return;
  const tuThang = parseInt(String(q2.getResponseText()).trim(), 10);
  if (isNaN(tuThang) || tuThang < 1 || tuThang > 12) { ui.alert('Tháng không hợp lệ.'); return; }

  let ssP;
  try { ssP = SpreadsheetApp.openById(m[0]); }
  catch (e) { ui.alert('Không mở được file đó.\n\n' + e.message); return; }

  const shCM = ssP.getSheetByName(CFG.CHIMUC_SHEET);
  if (!shCM) { ui.alert('File đó không có sheet ' + CFG.CHIMUC_SHEET + ', không phải file năm.'); return; }

  const q3 = ui.prompt('Mã nhân sự',
    'Nhập MÃ NHÂN SỰ của file này, để hệ lấy lại tuyến và cấp mới nhất.',
    ui.ButtonSet.OK_CANCEL);
  if (q3.getSelectedButton() !== ui.Button.OK) return;
  const ns = _traNhanSu(String(q3.getResponseText()).trim().toUpperCase());
  if (!ns) { ui.alert('Không có mã đó trong sheet ' + CFG.SHEETS.NS + '.'); return; }
  const tuyen = _chuanTenTuyen(ns.tuyen);
  if (!TUYEN[tuyen]) { ui.alert('Tuyến "' + tuyen + '" không có trong hệ.'); return; }

  const nam = String(ssP.getName().match(/\d{4}/) || [new Date().getFullYear()])[0];
  const cap = _capTuViTri(ns.vitri);
  const laQL = _laQuanLy(ns.vitri);

  let chiMuc = null;
  for (let i = tuThang - 1; i < 12; i++) {
    const V = buildPhieuThang(ssP, THANG_SHEET[i], tuyen, {
      maNV: ns.ma, hoTen: ns.ten, viTri: ns.vitri, cap: cap ? cap.cap : '',
      phong: ns.phong, diem: ns.diem,
      thang: ('0' + (i + 1)).slice(-2), nam: nam,
      quanLy: laQL ? 'Có' : 'Không',
      nhomNN: _chuanNhomNN(ns.nghe),
      sheetTruoc: i > 0 ? THANG_SHEET[i - 1] : ''
    });
    if (chiMuc === null) chiMuc = V;
    _dua(ssP, THANG_SHEET[i], i + 1);
  }

  ssP.deleteSheet(shCM);
  _buildChiMuc(ssP, tuyen, chiMuc);
  ssP.getSheetByName(CFG.CHIMUC_SHEET).hideSheet();
  SpreadsheetApp.flush();

  _ghiNhatKy('Dựng lại file năm', ns.ma + ' ' + ns.ten + ' · từ tháng ' + tuThang);
  ui.alert('Đã dựng lại ✅',
    'Dựng lại ' + (13 - tuThang) + ' sheet tháng, từ ' + THANG_SHEET[tuThang - 1] + ' tới T12.\n' +
    'Sheet ' + CFG.LOG_SHEET + ' giữ nguyên.\n\n' +
    '⚠️ Số dòng của các tháng dựng lại có thể khác các tháng cũ. Sheet ' +
    CFG.CHIMUC_SHEET + ' nay ghi theo bộ mới, nên app phải đọc lại trước khi ghi.',
    ui.ButtonSet.OK);
}
