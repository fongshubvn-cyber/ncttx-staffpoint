/**
 * MODULE 16: BỘ CÂU HỎI NẰM TRÊN SHEET, không nằm trong code.
 *
 * ✅ CHỐT 30/8/2026 (Sen). Đổi nguồn sự thật của bộ câu hỏi.
 *
 *   TRƯỚC:  ba file .md  ->  sinh_bo_cau_hoi_gs.py  ->  13_BoCauHoi.gs  ->  phiếu
 *   NAY:    sheet 📚 Bộ câu hỏi trên file gốc  ->  phiếu
 *
 * ⛔ HẰNG SỐ TRONG 13_BoCauHoi.gs NAY CHỈ LÀ HẠT GIỐNG. Nó chỉ được dùng đúng
 * một lần, lúc dựng sheet lần đầu. Sau đó sửa vào nó KHÔNG có tác dụng gì.
 * Ba file .md ở 3-Luong/Phuong-an/ cũng vậy, chúng thành BẢN XUẤT chứ không
 * còn là nguồn. Menu 📥 Xuất bộ câu hỏi ra file làm mới bản xuất đó.
 *
 * ⚠️ Google Sheet là vùng của mục 0.1 CLAUDE.md: hệ file không đọc được nó.
 * Nên sau mỗi đợt sửa, bấm 📥 Xuất bộ câu hỏi ra file.
 *
 * ============================================================================
 * MỘT SHEET, BA LOẠI DÒNG, BA TẦNG BẬT TẮT
 * ============================================================================
 *
 * ✅ SỬA 30/8/2026 lượt 2 (Sen). Bản trước để bật tắt nhóm ở một sheet RIÊNG,
 * nên nhìn sheet bộ câu hỏi chỉ thấy bật tắt từng câu, và muốn tắt cả nhóm thì
 * phải nhảy sang sheet khác. Nay gộp về MỘT sheet, có dải màu theo phần và theo
 * nhóm giống hệt phiếu xuất ra.
 *
 * Loại dòng nhận ra bằng CỘT NÀO CÓ CHỮ, không cần cột khai thêm:
 *
 *   Loại dòng   | Mã nhóm | Mã câu | Cột A Kích hoạt bật tắt cái gì
 *   ------------|---------|--------|--------------------------------
 *   DÒNG PHẦN   | trống   | trống  | cả một phần của một tuyến
 *   DÒNG NHÓM   | CÓ      | trống  | cả một nhóm
 *   DÒNG CÂU    | CÓ      | CÓ     | đúng một câu
 *
 * Một câu vào phiếu khi CẢ BA cùng bật. Cột L "Vào phiếu" là công thức gộp cả
 * ba tầng, và khối điểm nền đếm theo cột L chứ không theo cột A.
 *
 * BỐ CỤC
 *   Dòng 1        banner
 *   Dòng 2 tới 10 khối ĐIỂM NỀN, công thức sống, tự tính lại khi sửa một dòng
 *   Dòng 12       tiêu đề cột
 *   Dòng 13 trở đi  dữ liệu, xen kẽ ba loại dòng trên
 *
 *   A Kích hoạt · B Phần · C Tuyến · D Mã nhóm · E Tên nhóm · F Chiều đo
 *   G Mã câu · H Câu hỏi · I Phạm vi áp dụng · J Ghi chú
 *   K Vào phiếu, CÔNG THỨC · L Khóa tra, CÔNG THỨC, cột ẩn
 *
 * ============================================================================
 * ⛔ CỘT BẬC TRONG NGẠCH ĐÃ BỎ. ✅ CHỐT 31/8/2026 (Sen)
 * ============================================================================
 *
 * Lý do: chữ "bậc" từng mang ba nghĩa cùng lúc trong cùng một phiếu, và hai
 * ngạch dùng chung một dãy số nhưng tên khác nhau, nên số 4 vừa là Lead bộ phận
 * vừa là Chuyên viên. Bộ câu hỏi đã có sẵn một nhãn sai vì chuyện đó: năm câu
 * nhóm N10 ghi "Từ bậc 3 (Chuyên viên)" trong khi Chuyên viên là bậc 4.
 *
 * Nay chữ BẬC chỉ còn MỘT nghĩa trong toàn hệ: BẬC CÁCH LÀM VIỆC 1 tới 5, thứ
 * tra ra hệ số lương P2. Mọi chỗ khác ghi thẳng TÊN CẤP.
 *
 * Ngưỡng cấp của một câu nay nằm ở cột Phạm vi áp dụng, dạng
 * "Từ <tên cấp> trở lên", ví dụ "Từ Trưởng phòng trở lên". Đó là CẤP THẤP NHẤT
 * mà câu bắt đầu áp dụng. Danh sách cấp lấy từ CAP_BAC ở 03_DuLieuTuyen.gs, tức
 * vẫn một nguồn duy nhất theo mục 2A CLAUDE.md.
 */

const BCH = {
  SHEET: '📚 Bộ câu hỏi',
  R_KQ:   2,     // dòng đầu khối điểm nền
  R_HEAD: 12,
  R_DAU:  13,
  C_BAT: 1, C_PHAN: 2, C_TUYEN: 3, C_MANHOM: 4, C_TENNHOM: 5, C_CHIEU: 6,
  C_MACAU: 7, C_CAU: 8, C_PHAMVI: 9, C_GHICHU: 10,
  /* Hai cột cuối là CÔNG THỨC, không phải ô nhập. */
  C_VAO: 11, C_KHOA: 12,
  SOCOT: 12,
  PHAN: ['Chung', 'Chuyên môn', 'Quản lý'],
  CHIEU: ['vi phạm', 'ghi nhận'],
  BAT: ['Có', 'Không'],
  /* Giá trị của cột Phạm vi áp dụng không phải ngưỡng cấp. Ngưỡng cấp sinh ra
   * từ CAP_BAC, xem _bchDsPhamVi. */
  PHAMVI_CHUNG: ['Tất cả nhân sự',
                 'Nhân sự giữ vai trò quản lý',
                 'Vị trí có đầu việc tại điểm bán',
                 'Nhân sự người nói',
                 'Nhân sự người điếc/ khiếm thính']
};

/** Toàn bộ giá trị hợp lệ của cột Phạm vi áp dụng, để làm hộp chọn và để soát. */
function _bchDsPhamVi() {
  return BCH.PHAMVI_CHUNG.concat(_dsCapNguong().map(function (t) {
    return 'Từ ' + t + ' trở lên';
  }));
}

/* Bộ nhớ đệm trong MỘT lần chạy. Tạo file năm dựng 12 sheet tháng, không có
 * đệm thì đọc sheet 12 lần. */
let _BCH_CACHE = null;
function _quenBoCauHoi() { _BCH_CACHE = null; }


/* ==================== DỰNG SHEET ==================== */

/**
 * Dựng sheet Bộ câu hỏi.
 * ⛔ CÓ DỮ LIỆU RỒI THÌ KHÔNG VẼ LẠI vùng dữ liệu, chỉ dựng lại banner, khối
 * điểm nền, tiêu đề, hộp chọn và dải màu. Vẽ lại vùng dữ liệu là xóa sạch mọi
 * chỉnh tay của Sen, đúng thứ module này sinh ra để tránh.
 */
function buildBoCauHoi() {
  const ss = _ss();
  let sh = ss.getSheetByName(BCH.SHEET);
  const daCo = !!(sh && sh.getLastRow() >= BCH.R_DAU);

  if (!sh) sh = ss.insertSheet(BCH.SHEET);
  if (!daCo) {
    sh.clear();
    _bchKhungSheet(sh);
    const dong = _bchHatGiong();
    if (dong.length) sh.getRange(BCH.R_DAU, 1, dong.length, BCH.SOCOT).setValues(dong);
  } else {
    /* ⛔ Chạy TRƯỚC _bchKhungSheet, vì hàm đó ghi đè dòng tiêu đề, mà dòng tiêu
     * đề chính là chỗ nhận ra sheet đang ở bản 13 cột hay 12 cột. */
    _bchBoCotBac(sh);
    _bchKhungSheet(sh);
    /* ⛔ SHEET DỰNG TỪ BẢN TRƯỚC CHỈ CÓ DÒNG CÂU. Chốt chặn "có dữ liệu thì
     * không vẽ lại" bảo vệ được chỉnh tay của Sen, nhưng cũng chặn luôn việc
     * chèn dòng phần và dòng nhóm, vì chúng nằm trong chính vùng dữ liệu.
     * Hàm dưới CHỈ CHÈN THÊM, không đụng một chữ nào của dòng đã có.
     * ✅ THÊM 30/8/2026 sau khi Sen chạy cập nhật mà sheet không đổi. */
    _bchBoSungDongKhoi(sh);
  }
  _bchTrangTri(sh);
  _quenBoCauHoi();

  /* Sheet bật tắt riêng của bản trước nay thừa, vì ba tầng đã nằm chung một
   * sheet. Đổi tên và ẩn đi thay vì xóa, phòng khi Sen đã chỉnh gì trong đó. */
  const cuBT = ss.getSheetByName('🎚️ Bật tắt nhóm');
  if (cuBT) { try { cuBT.setName('_cu Bật tắt nhóm'); cuBT.hideSheet(); } catch (e) {} }
  return sh;
}

/** Banner, khối điểm nền, dòng tiêu đề. Không đụng tới vùng dữ liệu. */
function _bchKhungSheet(sh) {
  _banner(sh, '📚 BỘ CÂU HỎI ĐÁNH GIÁ',
    'NGUỒN DUY NHẤT của bộ câu hỏi. Dòng nền xanh đậm là một PHẦN, dòng nền xanh nhạt là một NHÓM, dòng trắng là một CÂU. Cột A bật tắt đúng thứ nằm trên dòng đó.', BCH.SOCOT);
  _bchKhoiDiemNen(sh);
  _header(sh, BCH.R_HEAD, ['Kích hoạt','Phần','Tuyến','Mã nhóm','Tên nhóm','Chiều đo',
                           'Mã câu','Câu hỏi','Phạm vi áp dụng','Ghi chú',
                           'Vào phiếu','Khóa']);
  sh.setFrozenRows(BCH.R_HEAD);
}

/**
 * Bỏ cột Bậc trong ngạch khỏi một sheet dựng từ bản 13 cột.
 *
 * ⛔ Nhận ra bằng DÒNG TIÊU ĐỀ, không đếm số cột, vì Google Sheet luôn giữ dư
 * cột trống bên phải nên đếm cột không phân biệt được hai đời sheet.
 *
 * Xóa cột 10 kéo cột Ghi chú từ K về J và hai cột công thức từ L, M về K, L,
 * đúng bố cục mới. Công thức của hai cột đó bị hỏng khi cột dịch, nhưng
 * _bchTrangTri viết lại chúng ngay sau đây nên không cần xử riêng.
 *
 * ✅ THÊM 31/8/2026 (Sen). Cùng lớp với _bchBoSungDongKhoi: một chốt chặn
 * "có dữ liệu thì không vẽ lại" luôn phải đi kèm một đường DI CƯ, nếu không thì
 * bản mới chỉ đúng với người dựng sheet lần đầu.
 */
function _bchBoCotBac(sh) {
  const COT_CU = 10;                       // cột J của bố cục 13 cột
  if (sh.getMaxColumns() < COT_CU) return false;
  const nhan = String(sh.getRange(BCH.R_HEAD, COT_CU).getValue()).trim();
  if (nhan !== 'Bậc trong ngạch') return false;
  sh.deleteColumn(COT_CU);
  _ghiNhatKy('Bỏ cột Bậc trong ngạch',
             'Sheet ' + BCH.SHEET + ' còn ' + BCH.SOCOT + ' cột. Ngưỡng cấp nay nằm ở cột Phạm vi áp dụng');
  return true;
}

/**
 * Chuyển hằng số hạt giống thành các dòng của sheet, xen kẽ ba loại dòng.
 * Thứ tự: dòng phần, rồi từng nhóm gồm dòng nhóm và các dòng câu của nó.
 */
function _bchHatGiong() {
  const out = [];
  function dongPhan(phan, tuyen) {
    out.push(['Có', phan, tuyen, '', '', '', '', '', '', '', '', '']);
  }
  function khoiNhom(nhomList, phan, tuyen) {
    (nhomList || []).forEach(function (nh) {
      out.push(['Có', phan, tuyen, nh[0], nh[1], String(nh[3]), '', '', '', '', '', '']);
      nh[2].forEach(function (c) {
        out.push(['Có', phan, tuyen, nh[0], nh[1], String(nh[3]),
                  c[0], c[1], c[2], '', '', '']);
      });
    });
  }
  dongPhan('Chung', '');
  khoiNhom(CAU_HOI_CHUNG, 'Chung', '');
  Object.keys(CAU_HOI_TUYEN).forEach(function (t) {
    const b = CAU_HOI_TUYEN[t];
    if (b.chuyenMon && b.chuyenMon.length) { dongPhan('Chuyên môn', t); khoiNhom(b.chuyenMon, 'Chuyên môn', t); }
    if (b.quanLy    && b.quanLy.length)    { dongPhan('Quản lý',    t); khoiNhom(b.quanLy,    'Quản lý',    t); }
  });
  return out;
}

/**
 * Chèn DÒNG PHẦN và DÒNG NHÓM còn thiếu vào một sheet đã có dữ liệu.
 *
 * ⛔ CHỈ CHÈN THÊM. Mọi dòng đang có được chép lại NGUYÊN VĂN, kể cả cột Ghi chú
 * và mọi chỉnh tay của Sen. Không sửa, không sắp xếp lại, không xóa.
 *
 * Cách làm: đi dọc các dòng theo đúng thứ tự đang có. Gặp một bộ (Phần, Tuyến)
 * lần đầu thì chèn dòng phần; gặp một bộ (Phần, Tuyến, Mã nhóm) lần đầu thì chèn
 * dòng nhóm. Khóa đã chèn rồi thì không chèn lại, nên nhóm bị rải rác không sinh
 * ra hai dòng tiêu đề.
 *
 * Trả về số dòng đã chèn.
 */
function _bchBoSungDongKhoi(sh) {
  const cuoi = sh.getLastRow();
  if (cuoi < BCH.R_DAU) return 0;
  const v = sh.getRange(BCH.R_DAU, 1, cuoi - BCH.R_DAU + 1, BCH.SOCOT).getValues();

  const daCoPhan = {}, daCoNhom = {};
  v.forEach(function (d) {
    const phan = String(d[BCH.C_PHAN - 1]).trim();
    if (!phan) return;
    if (String(d[BCH.C_MACAU - 1]).trim()) return;    // dòng câu, bỏ qua
    const tuyen = String(d[BCH.C_TUYEN - 1]).trim();
    const maNh  = String(d[BCH.C_MANHOM - 1]).trim();
    if (maNh) daCoNhom[phan + '|' + tuyen + '|' + maNh] = true;
    else      daCoPhan[phan + '|' + tuyen] = true;
  });

  const out = [];
  let them = 0;
  const daChenPhan = {}, daChenNhom = {};
  v.forEach(function (d) {
    const phan  = String(d[BCH.C_PHAN - 1]).trim();
    const maCau = String(d[BCH.C_MACAU - 1]).trim();
    if (!phan) { out.push(d); return; }               // dòng trống, giữ nguyên
    if (!maCau) { out.push(d); return; }              // đã là dòng phần hoặc dòng nhóm

    const tuyen = String(d[BCH.C_TUYEN - 1]).trim();
    const maNh  = String(d[BCH.C_MANHOM - 1]).trim();
    const kPhan = phan + '|' + tuyen;
    const kNhom = kPhan + '|' + maNh;

    if (!daCoPhan[kPhan] && !daChenPhan[kPhan]) {
      daChenPhan[kPhan] = true; them++;
      const r = new Array(BCH.SOCOT).fill('');
      r[BCH.C_BAT - 1] = 'Có'; r[BCH.C_PHAN - 1] = phan; r[BCH.C_TUYEN - 1] = tuyen;
      out.push(r);
    }
    if (maNh && !daCoNhom[kNhom] && !daChenNhom[kNhom]) {
      daChenNhom[kNhom] = true; them++;
      const r = new Array(BCH.SOCOT).fill('');
      r[BCH.C_BAT - 1] = 'Có'; r[BCH.C_PHAN - 1] = phan; r[BCH.C_TUYEN - 1] = tuyen;
      r[BCH.C_MANHOM - 1] = maNh;
      r[BCH.C_TENNHOM - 1] = String(d[BCH.C_TENNHOM - 1]);
      r[BCH.C_CHIEU - 1]   = String(d[BCH.C_CHIEU - 1]);
      out.push(r);
    }
    out.push(d);
  });

  if (!them) return 0;
  /* Ghi đè cả vùng bằng mảng mới. Vùng cũ ngắn hơn nên phải xóa phần dư ở dưới
   * trước, nếu không thì dòng cuối của bản cũ còn sót lại bên dưới bản mới. */
  sh.getRange(BCH.R_DAU, 1, out.length, BCH.SOCOT).setValues(out);
  _ghiNhatKy('Bổ sung dòng khối', 'Chèn ' + them + ' dòng phần và dòng nhóm vào ' + BCH.SHEET);
  return them;
}

/**
 * Hộp chọn, độ rộng cột, và DẢI MÀU theo loại dòng.
 *
 * ⚠️ Màu đặt bằng ĐỊNH DẠNG CÓ ĐIỀU KIỆN chứ không tô cứng, để Sen chèn thêm
 * dòng thì dòng mới tự nhận đúng màu mà không phải chạy lại gì.
 */
function _bchTrangTri(sh) {
  const n = Math.max(sh.getMaxRows() - BCH.R_DAU + 1, 1);
  const R = BCH.R_DAU;

  _dvList(sh.getRange(R, BCH.C_BAT,   n, 1), BCH.BAT);
  _dvList(sh.getRange(R, BCH.C_PHAN,  n, 1), BCH.PHAN);
  _dvList(sh.getRange(R, BCH.C_TUYEN, n, 1), Object.keys(TUYEN), true);
  _dvList(sh.getRange(R, BCH.C_CHIEU, n, 1), BCH.CHIEU);
  /* Cột Phạm vi áp dụng. Ngưỡng cấp ghi bằng TÊN, dạng "Từ <tên cấp> trở lên",
   * là cấp THẤP NHẤT mà câu bắt đầu áp dụng. Cho phép gõ giá trị khác hộp chọn,
   * vì vài câu cũ đang mang chuỗi mô tả dài; 🩹 Soát sẽ chỉ ra chúng. */
  _dvList(sh.getRange(R, BCH.C_PHAMVI, n, 1), _bchDsPhamVi(), true);

  /* Cột L, khóa tra. Dòng phần cho khóa "Phần|Tuyến|", dòng nhóm và dòng câu
   * cho khóa "Phần|Tuyến|Mã nhóm". Cột K tra ngược lên hai khóa đó. */
  sh.getRange(R, BCH.C_KHOA, n, 1).setFormula(_F(
    '=IF($B' + R + '="","",$B' + R + '&"|"&$C' + R + '&"|"&$D' + R + ')'));

  /* Cột K, gộp ba tầng. Dòng phần và dòng nhóm chỉ trả về chính cột A của nó,
   * dòng câu mới tra ngược lên. Điền xuống HẾT sheet để dòng Sen thêm sau có sẵn. */
  const A = '$A' + R, B = '$B' + R, C = '$C' + R, D = '$D' + R, G = '$G' + R;
  const M = "'" + BCH.SHEET + "'!$L$" + R + ':$L';
  const AA = "'" + BCH.SHEET + "'!$A$" + R + ':$A';
  const tra = function (khoa) {
    return 'IFERROR(INDEX(' + AA + ',MATCH(' + khoa + ',' + M + ',0)),"Có")';
  };
  sh.getRange(R, BCH.C_VAO, n, 1).setFormula(_F(
    '=IF(' + B + '="","",' +
    'IF(' + A + '<>"Có","Không",' +
    'IF(' + G + '="","Có",' +                                   // dòng phần và dòng nhóm
    'IF(' + tra(B + '&"|"&' + C + '&"|"') + '="Không","Không",' +   // tầng 1, cả phần
    'IF(' + tra(B + '&"|"&' + C + '&"|"&' + D) + '="Không","Không","Có")))))'))
    .setBackground(CFG.MAU.CONG_THUC).setHorizontalAlignment('center');

  const rong = [80, 100, 200, 90, 250, 90, 90, 560, 240, 200, 90, 10];
  for (let c = 0; c < rong.length; c++) sh.setColumnWidth(c + 1, rong[c]);
  sh.hideColumns(BCH.C_KHOA);
  sh.getRange(R, 1, n, BCH.SOCOT).setVerticalAlignment('top').setFontSize(10).setWrap(true);
  sh.getRange(R, BCH.C_BAT, n, 1).setHorizontalAlignment('center');

  /* Dải màu, cùng bảng màu với phiếu xuất ra:
   *   dòng PHẦN  nền CFG.MAU.NHAT, giống dòng tiêu đề mục của phiếu
   *   dòng NHÓM  nền CFG.MAU.NHOM, giống dòng tiêu đề nhóm của phiếu
   *   dòng đã TẮT chữ xám nền hồng, để nhìn lướt là thấy
   * ⚠️ Thứ tự luật quan trọng: luật đứng trước thắng, nên luật TẮT phải nằm đầu. */
  const vung = [sh.getRange(R, 1, n, BCH.SOCOT)];
  function luat(ct, nen, chu, dam) {
    let x = SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied(_F(ct)).setBackground(nen).setRanges(vung);
    if (chu) x = x.setFontColor(chu);
    if (dam) x = x.setBold(true);
    return x.build();
  }
  sh.setConditionalFormatRules([
    luat('=AND($B' + R + '<>"",$K' + R + '="Không")', CFG.MAU.CANH_BAO, '#9aa0a6', false),
    luat('=AND($B' + R + '<>"",$D' + R + '="",$G' + R + '="")', CFG.MAU.NHAT, CFG.MAU.DAM, true),
    luat('=AND($D' + R + '<>"",$G' + R + '="")', CFG.MAU.NHOM, null, true)
  ]);
}


/* ==================== KHỐI ĐIỂM NỀN, CÔNG THỨC SỐNG ==================== */

/**
 * ✅ CHỐT 30/8/2026 (Sen). Thêm một câu ghi nhận là điểm nền của cả Công ty tụt
 * xuống, mà không có gì báo. Khối này tính lại ngay mỗi lần Sen sửa một dòng.
 *
 * ⚠️ GIỚI HẠN: tính theo TỶ LỆ CÂU của từng phần, đã trừ nhóm mà tuyến không
 * chấm, nhưng CHƯA trừ phần lọc theo từng người là điểm bán, nhóm ngôn ngữ và
 * ngưỡng cấp. Nên nó lệch vài phần trăm so với con số thật trên phiếu.
 * Dùng để thấy xu hướng khi đang sửa, không dùng làm căn cứ chốt ngưỡng.
 */
function _bchKhoiDiemNen(sh) {
  const A = "'" + BCH.SHEET + "'!";
  const L = A + '$K$' + BCH.R_DAU + ':$K';   // Vào phiếu, đã gộp ba tầng
  const P = A + '$B$' + BCH.R_DAU + ':$B';   // Phần
  const T = A + '$C$' + BCH.R_DAU + ':$C';   // Tuyến
  const N = A + '$D$' + BCH.R_DAU + ':$D';   // Mã nhóm
  const C = A + '$F$' + BCH.R_DAU + ':$F';   // Chiều đo
  const G = A + '$G$' + BCH.R_DAU + ':$G';   // Mã câu, để loại dòng phần và dòng nhóm

  function tyLe(phan, tuyen, bo) {
    const dk = tuyen ? (',' + T + ',"' + tuyen + '"') : '';
    const nen = L + ',"Có",' + P + ',"' + phan + '"' + dk + ',' + G + ',"<>"';
    let vp = 'COUNTIFS(' + nen + ',' + C + ',"vi phạm")';
    let ts = 'COUNTIFS(' + nen + ')';
    (bo || []).forEach(function (m) {
      vp += '-COUNTIFS(' + nen + ',' + C + ',"vi phạm",' + N + ',"' + m + '")';
      ts += '-COUNTIFS(' + nen + ',' + N + ',"' + m + '")';
    });
    return 'IFERROR((' + vp + ')/(' + ts + '),0)';
  }

  let r = BCH.R_KQ;
  sh.getRange(r, 1, 1, BCH.SOCOT).setBackground(CFG.MAU.NHAT);
  sh.getRange(r, 1).setValue('ĐIỂM NỀN ƯỚC TÍNH, tự tính lại mỗi lần sửa một dòng bên dưới')
    .setFontWeight('bold').setFontColor(CFG.MAU.DAM);
  r++;
  _header(sh, r, ['','Hình dạng phiếu','Điểm nền','Bậc cách làm việc','Ghi chú','','','','','','','']);
  r++;

  const dsTuyen = Object.keys(TUYEN);
  const rong = [];
  const trong = dsTuyen.filter(function (t) {
    const b = _cauHoiTuyen(t);
    return !b || (!b.chuyenMon.length && !b.quanLy.length);
  });
  /* Nhóm phải LOẠI khỏi phần chung của một tuyến, đúng như _cauHoiChung làm:
   * nhóm khai trong boTruc, cộng năm nhóm điểm bán khi tuyến không có điểm bán.
   * ⚠️ Thiếu vế thứ hai là khối này báo cao hơn số thật khá nhiều: chức năng
   * Nhân sự - Hành chính - Pháp chế từng hiện 4,33 và 4,48 tức bậc 5, trong khi
   * số thật là 4,15 và 4,35 tức bậc 4. Đã mắc thật, Sen nhìn ra trên Sheet. */
  const DIEM_BAN = ['VH9','VH10','VH11','VH12','VH13'];
  function loai(t) {
    const bo = (TUYEN[t].boTruc || []).slice();
    if (!TUYEN[t].coDiemBan) DIEM_BAN.forEach(function (m) { bo.push(m); });
    return bo;
  }

  if (trong.length) {
    rong.push(['Tuyến chưa có ngạch riêng, ' + trong.length + ' tuyến',
               '5*(' + tyLe('Chung', '', loai(trong[0])) + ')']);
  }
  dsTuyen.forEach(function (t) {
    const b = _cauHoiTuyen(t);
    if (!b || (!b.chuyenMon.length && !b.quanLy.length)) return;
    const vh = tyLe('Chung', '', loai(t));
    const cm = b.chuyenMon.length ? tyLe('Chuyên môn', t, []) : '0';
    const ql = b.quanLy.length    ? tyLe('Quản lý',    t, []) : '0';
    if (b.chuyenMon.length)
      rong.push([t + ', nhân viên', '5*(TS_TS_VH1*' + vh + '+TS_TS_CM1*' + cm + ')']);
    if (b.quanLy.length)
      rong.push([t + ', quản lý', '5*(TS_TS_VH2*' + vh + '+TS_TS_QL2*' + ql + '+TS_TS_CM2*' + cm + ')']);
  });

  rong.forEach(function (d) {
    sh.getRange(r, 2).setValue(d[0]).setFontSize(10);
    sh.getRange(r, 3).setFormula(_F('=ROUND(' + d[1] + ',2)'))
      .setBackground(CFG.MAU.CONG_THUC).setHorizontalAlignment('center').setFontWeight('bold');
    sh.getRange(r, 4).setFormula(_F(
      '=IFERROR(INDEX(NR_NG_BAC,MATCH($C' + r + '/5,NR_NG_TL,1)),"")'))
      .setBackground(CFG.MAU.CONG_THUC).setHorizontalAlignment('center').setFontWeight('bold');
    _cfDo(sh, sh.getRange(r, 3, 1, 2).getA1Notation(), '=$D' + r + '<4');
    r++;
  });

  sh.getRange(r, 2).setValue(
    'CHỮ BẬC CHỈ CÒN MỘT NGHĨA: bậc cách làm việc 1 tới 5, thứ tra ra hệ số lương P2 của tháng. ' +
    'Cái từng gọi là "bậc trong ngạch" nay ghi thẳng bằng TÊN CẤP ở cột Phạm vi áp dụng, ' +
    'dạng "Từ Trưởng phòng trở lên", nghĩa là cấp THẤP NHẤT mà câu bắt đầu áp dụng. ' +
    'Các cấp xếp từ thấp lên cao: Tập sự · Nhân viên · Trưởng ca · Lead bộ phận và Chuyên viên ngang nhau · ' +
    'Quản lý khối và Chuyên gia ngang nhau · Trưởng phòng.')
    .setFontSize(9).setFontColor(CFG.MAU.CHU_GHI).setWrap(true);
  try { sh.getRange(r, 2, 1, 9).merge(); } catch (e) {}
  sh.setRowHeight(r, 52);
  r++;

  sh.getRange(r, 2).setValue(
    'Khối trên tính theo tỷ lệ câu của từng phần, đã trừ nhóm mà tuyến không chấm, ' +
    'nhưng chưa trừ phần lọc theo từng người là điểm bán, nhóm ngôn ngữ và ngưỡng cấp, ' +
    'nên lệch vài phần trăm so với con số thật trên phiếu. Ô đỏ nghĩa là hình dạng phiếu đó ' +
    'bắt đầu tháng dưới bậc 4, tức dưới mức Công ty dự định trả.')
    .setFontSize(9).setFontColor(CFG.MAU.CHU_GHI).setWrap(true);
  try { sh.getRange(r, 2, 1, 9).merge(); } catch (e) {}
  sh.setRowHeight(r, 40);
}


/* ==================== ĐỌC BỘ CÂU HỎI TỪ SHEET ==================== */

/**
 * Đọc sheet thành đúng hình dạng mà phiếu và ma trận đang dùng.
 * Trả về {chung: [...], tuyen: {tên: {chuyenMon: [...], quanLy: [...]}}}
 *
 * Ba loại dòng xử lý khác nhau:
 *   dòng PHẦN  không có mã nhóm và không có mã câu  -> ghi vào bảng tắt cả phần
 *   dòng NHÓM  có mã nhóm, không có mã câu          -> ghi vào bảng tắt cả nhóm
 *   dòng CÂU   có cả hai                            -> vào bộ, nếu cả ba tầng bật
 */
function _docBoCauHoi() {
  if (_BCH_CACHE) return _BCH_CACHE;
  const sh = _ss().getSheetByName(BCH.SHEET);
  if (!sh || sh.getLastRow() < BCH.R_DAU) return null;

  const v = sh.getRange(BCH.R_DAU, 1, sh.getLastRow() - BCH.R_DAU + 1, BCH.SOCOT).getValues();

  // Lượt một: đọc trạng thái bật tắt của dòng phần và dòng nhóm
  const tat = {};
  v.forEach(function (d) {
    const phan = String(d[BCH.C_PHAN - 1]).trim();
    if (!phan) return;
    if (String(d[BCH.C_MACAU - 1]).trim()) return;          // dòng câu, bỏ qua ở lượt này
    if (String(d[BCH.C_BAT - 1]).trim() === 'Có') return;   // đang bật, không cần ghi
    const tuyen = String(d[BCH.C_TUYEN - 1]).trim();
    tat[phan + '|' + tuyen + '|' + String(d[BCH.C_MANHOM - 1]).trim()] = true;
  });

  // Lượt hai: gom câu
  const chung = [], tuyen = {}, ban = {};
  v.forEach(function (d) {
    if (String(d[BCH.C_BAT - 1]).trim() !== 'Có') return;
    const maCau = String(d[BCH.C_MACAU - 1]).trim();
    if (!maCau) return;
    const phan  = String(d[BCH.C_PHAN - 1]).trim();
    const tTen  = String(d[BCH.C_TUYEN - 1]).trim();
    const maNh  = String(d[BCH.C_MANHOM - 1]).trim();
    if (!phan || !maNh) return;
    if (tat[phan + '|' + tTen + '|'])       return;   // tầng 1, cả phần bị tắt
    if (tat[phan + '|' + tTen + '|' + maNh]) return;  // tầng 2, cả nhóm bị tắt

    const chieu = String(d[BCH.C_CHIEU - 1]).trim() === 'vi phạm' ? 'vi phạm' : 'ghi nhận';
    let ds;
    if (phan === 'Chung') ds = chung;
    else {
      if (!tTen) return;
      if (!tuyen[tTen]) tuyen[tTen] = { chuyenMon: [], quanLy: [] };
      ds = (phan === 'Quản lý') ? tuyen[tTen].quanLy : tuyen[tTen].chuyenMon;
    }
    const khoa = phan + '|' + tTen + '|' + maNh;
    if (!ban[khoa]) {
      ban[khoa] = [maNh, String(d[BCH.C_TENNHOM - 1]).trim(), [], chieu];
      ds.push(ban[khoa]);
    }
    ban[khoa][2].push([maCau, String(d[BCH.C_CAU - 1]),
                       String(d[BCH.C_PHAMVI - 1])]);
  });

  Object.keys(TUYEN).forEach(function (t) {
    if (!tuyen[t]) tuyen[t] = { chuyenMon: [], quanLy: [] };
  });

  _BCH_CACHE = { chung: chung, tuyen: tuyen };
  return _BCH_CACHE;
}


/* ==================== XUẤT RA FILE ==================== */

/**
 * Ghi bộ câu hỏi hiện hành ra một file văn bản trên Drive, cạnh file gốc.
 * ⚠️ BẮT BUỘC sau mỗi đợt sửa. Hệ file của Công ty không đọc được Google Sheet,
 * nên không có bản xuất này thì phiên sau làm việc trên bản cũ.
 */
function xuatBoCauHoi() {
  const ui = _ui();
  const sh = _ss().getSheetByName(BCH.SHEET);
  if (!sh || sh.getLastRow() < BCH.R_DAU) { ui.alert('Chưa có sheet ' + BCH.SHEET + ', hoặc sheet đang trống.'); return; }
  const v = sh.getRange(BCH.R_DAU, 1, sh.getLastRow() - BCH.R_DAU + 1, BCH.SOCOT).getValues();
  const moc = Utilities.formatDate(new Date(), CFG.TZ || 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm');

  const out = [];
  out.push('# BỘ CÂU HỎI ĐÁNH GIÁ, bản xuất từ Google Sheet');
  out.push('');
  out.push('> ⛔ FILE NÀY LÀ BẢN XUẤT, KHÔNG PHẢI NGUỒN. Nguồn là sheet `' + BCH.SHEET +
           '` trên file gốc. Sửa vào file này không có tác dụng gì.');
  out.push('>');
  out.push('> Xuất lúc ' + moc + '. Xuất lại bằng menu 📥 Xuất bộ câu hỏi ra file.');
  out.push('');
  out.push('DEM');
  out.push('');

  const dem = { bat: 0, tat: 0, nhomTat: 0, phanTat: 0 };
  v.forEach(function (d) {
    const phan = String(d[BCH.C_PHAN - 1]).trim();
    if (!phan) return;
    const maNh = String(d[BCH.C_MANHOM - 1]).trim();
    const maCau = String(d[BCH.C_MACAU - 1]).trim();
    const bat = String(d[BCH.C_BAT - 1]).trim() === 'Có';
    const tuyen = String(d[BCH.C_TUYEN - 1]).trim();

    if (!maNh && !maCau) {                       // dòng PHẦN
      if (!bat) dem.phanTat++;
      out.push('');
      out.push('# PHẦN ' + phan.toUpperCase() + (tuyen ? '  ·  TUYẾN ' + tuyen.toUpperCase() : '') +
               (bat ? '' : '   ⛔ ĐANG TẮT CẢ PHẦN'));
      return;
    }
    if (maNh && !maCau) {                        // dòng NHÓM
      if (!bat) dem.nhomTat++;
      out.push('');
      out.push('## ' + maNh + '. ' + String(d[BCH.C_TENNHOM - 1]).trim() +
               (bat ? '' : '   ⛔ ĐANG TẮT CẢ NHÓM'));
      out.push('');
      out.push('Chiều đo: **' + String(d[BCH.C_CHIEU - 1]).trim() + '**');
      out.push('');
      out.push('| Kích hoạt | Mã | Câu hỏi | Phạm vi áp dụng | Ghi chú |');
      out.push('|---|---|---|---|---|');
      return;
    }
    bat ? dem.bat++ : dem.tat++;                 // dòng CÂU
    out.push('| ' + (bat ? 'Có' : '**Không**') + ' | ' + maCau + ' | ' +
             String(d[BCH.C_CAU - 1]).replace(/\|/g, '/') + ' | ' +
             String(d[BCH.C_PHAMVI - 1]) + ' | ' +
             String(d[BCH.C_GHICHU - 1]).replace(/\|/g, '/') + ' |');
  });

  const iDem = out.indexOf('DEM');
  out[iDem] = 'Đang bật **' + dem.bat + '** câu, đang tắt **' + dem.tat + '** câu. ' +
              'Cộng **' + dem.nhomTat + '** nhóm và **' + dem.phanTat + '** phần bị tắt cả khối.';

  const ten = 'BO-CAU-HOI-BAN-XUAT_' +
    Utilities.formatDate(new Date(), CFG.TZ || 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd') + '.md';
  const thuMuc = _thuMucGoc();
  const cu = thuMuc.getFilesByName(ten);
  while (cu.hasNext()) cu.next().setTrashed(true);
  const f = thuMuc.createFile(ten, out.join('\n'), MimeType.PLAIN_TEXT);

  _ghiNhatKy('Xuất bộ câu hỏi', dem.bat + ' câu bật, ' + dem.tat + ' câu tắt');
  ui.alert('Đã xuất ✅',
    'Đang bật ' + dem.bat + ' câu, đang tắt ' + dem.tat + ' câu.\n' +
    dem.nhomTat + ' nhóm và ' + dem.phanTat + ' phần bị tắt cả khối.\n\n' +
    'File: ' + ten + '\n' + f.getUrl() + '\n\n' +
    'Gửi đường dẫn này cho Claude khi cần soạn hoặc rà bộ câu hỏi, ' +
    'vì hệ file không đọc được Google Sheet.',
    ui.ButtonSet.OK);
}


/* ==================== SOÁT SHEET ==================== */

/** Bắt các lỗi nhập tay trước khi chúng đi vào phiếu. */
function soatBoCauHoi() {
  const ui = _ui();
  const sh = _ss().getSheetByName(BCH.SHEET);
  if (!sh || sh.getLastRow() < BCH.R_DAU) { ui.alert('Chưa có dữ liệu ở sheet ' + BCH.SHEET + '.'); return; }
  const v = sh.getRange(BCH.R_DAU, 1, sh.getLastRow() - BCH.R_DAU + 1, BCH.SOCOT).getValues();

  const loi = [], maDaCo = {}, chieuNhom = {}, coDongPhan = {}, coDongNhom = {};

  // Lượt một: ghi nhận dòng phần và dòng nhóm đã có
  v.forEach(function (d, i) {
    const phan = String(d[BCH.C_PHAN - 1]).trim();
    if (!phan || String(d[BCH.C_MACAU - 1]).trim()) return;
    const khoa = phan + '|' + String(d[BCH.C_TUYEN - 1]).trim() + '|' + String(d[BCH.C_MANHOM - 1]).trim();
    if (String(d[BCH.C_MANHOM - 1]).trim()) coDongNhom[khoa] = BCH.R_DAU + i;
    else coDongPhan[khoa] = BCH.R_DAU + i;
  });

  v.forEach(function (d, i) {
    const r = BCH.R_DAU + i;
    const phan  = String(d[BCH.C_PHAN - 1]).trim();
    const tTen  = String(d[BCH.C_TUYEN - 1]).trim();
    const maNh  = String(d[BCH.C_MANHOM - 1]).trim();
    const maCau = String(d[BCH.C_MACAU - 1]).trim();
    const cau   = String(d[BCH.C_CAU - 1]).trim();
    const chieu = String(d[BCH.C_CHIEU - 1]).trim();
    const bat   = String(d[BCH.C_BAT - 1]).trim();
    if (!phan && !maNh && !maCau && !cau) return;    // dòng trống

    if (BCH.BAT.indexOf(bat) < 0)    loi.push('Dòng ' + r + ': cột Kích hoạt là "' + bat + '", phải là Có hoặc Không');
    if (BCH.PHAN.indexOf(phan) < 0)  loi.push('Dòng ' + r + ': cột Phần là "' + phan + '", phải là một trong ' + BCH.PHAN.join(', '));
    if (phan !== 'Chung' && !TUYEN[tTen]) loi.push('Dòng ' + r + ': cột Tuyến là "' + tTen + '", không có trong hệ');
    if (phan === 'Chung' && tTen)    loi.push('Dòng ' + r + ': phần Chung thì cột Tuyến phải để trống');

    if (!maCau) {                                     // dòng PHẦN hoặc dòng NHÓM
      if (maNh && BCH.CHIEU.indexOf(chieu) < 0)
        loi.push('Dòng ' + r + ': dòng nhóm "' + maNh + '" thiếu Chiều đo');
      return;
    }

    // Từ đây là dòng CÂU
    if (!cau)  loi.push('Dòng ' + r + ': thiếu nội dung câu hỏi');
    if (!maNh) loi.push('Dòng ' + r + ': thiếu Mã nhóm');
    if (BCH.CHIEU.indexOf(chieu) < 0) loi.push('Dòng ' + r + ': cột Chiều đo là "' + chieu + '", phải là vi phạm hoặc ghi nhận');

    /* Phạm vi áp dụng. Chuỗi lạ vẫn cho qua vì phiếu hiểu là "áp cho mọi người",
     * nhưng phải báo, vì một ngưỡng cấp gõ sai chính là một ngưỡng bị mất im lặng. */
    const pv = String(d[BCH.C_PHAMVI - 1]).trim();
    const mNg = pv.match(/^Từ\s+(.+?)\s+trở lên$/i);
    if (mNg) {
      if (!_traCap(mNg[1]))
        loi.push('Dòng ' + r + ': Phạm vi áp dụng ghi "' + pv + '" mà "' + mNg[1] +
                 '" không phải tên cấp nào trong hệ. Các cấp đặt ngưỡng được: ' +
                 _dsCapNguong().join(', '));
    } else if (pv && _bchDsPhamVi().indexOf(pv) < 0) {
      loi.push('Dòng ' + r + ': Phạm vi áp dụng ghi "' +
               (pv.length > 50 ? pv.substring(0, 50) + '...' : pv) +
               '", không khớp giá trị nào. Câu này sẽ áp cho MỌI người. ' +
               'Muốn đặt ngưỡng cấp thì ghi "Từ <tên cấp> trở lên"');
    }
    if (/[Bb]ậc/.test(pv))
      loi.push('Dòng ' + r + ': Phạm vi áp dụng còn chữ "bậc". ' +
               'Từ 31/8/2026 ngưỡng ghi bằng TÊN CẤP, ví dụ "Từ Trưởng phòng trở lên"');

    const khoaMa = phan + '|' + tTen + '|' + maCau;
    if (maDaCo[khoaMa]) loi.push('Dòng ' + r + ': mã câu "' + maCau + '" đã có ở dòng ' + maDaCo[khoaMa] + '. Hai câu cùng mã thì một câu đè câu kia');
    else maDaCo[khoaMa] = r;

    const khoaNh = phan + '|' + tTen + '|' + maNh;
    if (chieuNhom[khoaNh] === undefined) chieuNhom[khoaNh] = { c: chieu, r: r };
    else if (chieuNhom[khoaNh].c !== chieu)
      loi.push('Dòng ' + r + ': nhóm "' + maNh + '" khai Chiều đo là "' + chieu +
               '" nhưng dòng ' + chieuNhom[khoaNh].r + ' của cùng nhóm khai "' + chieuNhom[khoaNh].c + '"');

    /* Thiếu dòng nhóm hoặc dòng phần thì câu vẫn chạy, nhưng Sen mất chỗ bật tắt
     * cả khối. Báo một lần cho mỗi khóa. */
    if (!coDongNhom[khoaNh]) { coDongNhom[khoaNh] = -1;
      loi.push('Dòng ' + r + ': nhóm "' + maNh + '" chưa có DÒNG NHÓM ở trên. ' +
               'Thêm một dòng có Phần, Tuyến, Mã nhóm, Tên nhóm, Chiều đo và để trống Mã câu, ' +
               'để bật tắt được cả nhóm'); }
    const khoaPh = phan + '|' + tTen + '|';
    if (!coDongPhan[khoaPh]) { coDongPhan[khoaPh] = -1;
      loi.push('Dòng ' + r + ': phần "' + phan + (tTen ? ' · ' + tTen : '') +
               '" chưa có DÒNG PHẦN. Thêm một dòng chỉ có Phần và Tuyến, để bật tắt được cả phần'); }
  });

  const bo = _docBoCauHoi();
  const demCau = bo ? (_demCau(bo.chung) + Object.keys(bo.tuyen).reduce(function (a, t) {
    return a + _demCau(bo.tuyen[t].chuyenMon) + _demCau(bo.tuyen[t].quanLy); }, 0)) : 0;

  ui.alert(loi.length ? '❌ ' + loi.length + ' chỗ phải sửa' : '✅ Sheet bộ câu hỏi sạch',
    (loi.length ? loi.slice(0, 40).join('\n') +
        (loi.length > 40 ? '\n\n... còn ' + (loi.length - 40) + ' chỗ nữa' : '') + '\n\n' : '') +
    'Đang có ' + demCau + ' câu vào phiếu, tính cả phần chung lẫn hai ngạch của mọi tuyến.',
    ui.ButtonSet.OK);
}
