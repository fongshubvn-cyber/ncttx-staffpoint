/**
 * MODULE 06: Phiếu chấm của MỘT THÁNG. Sinh một sheet tháng trong file năm của
 * một người. Mọi công thức chỉ tham chiếu tới sheet Tham số và sheet log nằm
 * cùng file, nên phiếu chạy độc lập sau khi xuất.
 *
 * ✅ CHỐT 30/8/2026 (Sen). Bản này thay hẳn bản trước. Bốn đổi lớn:
 *
 *   1. KHÔNG CÒN NGƯỜI CHẤM. Bỏ hai cột Tự chấm và Người chấm, còn MỘT cột
 *      Điểm. Điểm không do ai ngồi cân nhắc trong kỳ mà đi lên đi xuống theo
 *      biên bản vi phạm và phiếu ghi nhận do Phòng Nhân sự - Hành chính - Pháp
 *      chế lập. Điểm mặc định: nhóm đo VI PHẠM là 5, nhóm đo GHI NHẬN là 0.
 *   2. NHÂN SỰ NHÌN THẤY PHIẾU NÀY. Mọi ghi chú nội bộ, mọi lời tự giải thích
 *      quá trình soạn thảo và mọi dấu ⚠️ đã gỡ khỏi phần hiện ra.
 *   3. MỘT THÁNG MỘT SHEET, mười hai sheet trong một file năm. Xem 15_FileNam.gs.
 *   4. ĐIỂM TỔNG CÓ TRỌNG SỐ, đặt ngay đầu sheet ở địa chỉ cố định.
 *
 * BỐ CỤC CỘT, bảy cột, hai cột cuối ẩn
 *   A Mã  ·  B Nội dung  ·  C Điểm  ·  D Số biên bản  ·  E Sự việc
 *   F Nhãn ô máy dùng (ẩn)  ·  G Giá trị ô máy dùng (ẩn)
 */

/* Số cột của một loại nội dung, dùng thay số trần cho dễ đọc. */
/* ✅ ĐỔI TÊN 31/8/2026 (Sen): cột G từng tên là BAC vì nó giữ bậc của câu.
 * Bậc trong ngạch đã bỏ, cột G nay chỉ còn giữ bốn ô máy dùng ở dòng 2 tới 5. */
const PC = { MA: 1, ND: 2, DIEM: 3, SOBB: 4, SUVIEC: 5, PV: 6, MAY: 7 };

/* Điểm mặc định theo logic đo của nhóm. ✅ CHỐT 30/8/2026 (Sen). */
const DIEM_MAC_DINH = { 'vi phạm': 5, 'ghi nhận': 0 };

function _macDinh(logic) {
  const v = DIEM_MAC_DINH[String(logic)];
  return (v === undefined) ? 0 : v;
}

/**
 * Dựng phiếu chấm của một tháng.
 * @param {Spreadsheet} ssDich  file năm của người đó
 * @param {string} tenSheet     tên tab, ví dụ 'T01'
 * @param {string} tenTuyen
 * @param {Object} tt  {maNV, hoTen, viTri, cap, phong, diem, thang, nam,
 *                      nhomNN, quanLy, sheetTruoc}
 * @return {Object} bản đồ vị trí các vùng, để 15_FileNam.gs ghi vào sheet chỉ mục
 */
function buildPhieuThang(ssDich, tenSheet, tenTuyen, tt) {
  const T = TUYEN[tenTuyen], C = CFG.COT;
  tt = tt || {};
  const cu = ssDich.getSheetByName(tenSheet);
  if (cu) ssDich.deleteSheet(cu);
  const sh = ssDich.insertSheet(tenSheet);

  const V = { chiMuc: [] };      // chiMuc: [mã câu, dòng, mục, nhóm, logic, mặc định]
  const QU = _docTrinhBayAn(ssDich);

  _banner(sh, '📋 PHIẾU ĐÁNH GIÁ THÁNG ' + (tt.thang || '') + '/' + (tt.nam || '') +
    '  ·  ' + (tt.hoTen || '') + '  ·  TUYẾN ' + tenTuyen.toUpperCase(),
    'Ô nền xanh nhạt do máy tính, không sửa. Điểm của từng câu đi lên đi xuống theo biên bản vi phạm và phiếu ghi nhận trong tháng.', C);

  /* ---------- Ô máy dùng, nằm ở hai cột ẩn F và G ---------- */
  /* Bốn giá trị này lọc câu hỏi vào hay ra phạm vi chấm. Trước đây chúng nằm
   * trong khối thông tin dưới dạng dòng có hộp chọn, tức bốn chỗ để bấm nhầm.
   * Nay máy điền lúc xuất phiếu và người đọc không thấy. */
  const oM = 2;
  /* ⛔ Ô này giữ THỨ HẠNG CẤP, không phải một cái bậc. Nó chỉ để máy so được
   * "cấp của người này có từ cấp ghi trong câu hỏi trở lên không". Con số không
   * hiện ra ở đâu người đọc thấy, và phiếu không in nó ra. ✅ ĐỔI 31/8/2026 (Sen). */
  sh.getRange(oM,   PC.PV).setValue('thứ hạng cấp');
  sh.getRange(oM,   PC.MAY).setValue(_hangCap(tt.cap));
  sh.getRange(oM+1, PC.PV).setValue('nhóm ngôn ngữ');
  sh.getRange(oM+1, PC.MAY).setValue(tt.nhomNN || '');
  sh.getRange(oM+2, PC.PV).setValue('có đầu việc tại điểm bán');
  sh.getRange(oM+2, PC.MAY).setValue(T.coDiemBan ? 'Có' : 'Không');
  sh.getRange(oM+3, PC.PV).setValue('có giữ vai trò quản lý');
  sh.getRange(oM+3, PC.MAY).setValue(tt.quanLy || 'Không');
  V.oHang    = '$G$' + oM;
  V.oNN      = '$G$' + (oM+1);
  V.oDiemBan = '$G$' + (oM+2);
  V.oQL      = '$G$' + (oM+3);
  const laQL = (tt.quanLy === 'Có');

  let r = 2;

  /* ---------- KẾT QUẢ THÁNG, khối đặt ở ĐẦU sheet ---------- */
  /* Địa chỉ cố định trên mọi sheet tháng của mọi người, nên app đọc được mà
   * không phải dò. Công thức điền ở cuối hàm, khi đã biết các dải dòng.
   *
   * ⛔ Khối này chỉ được ghi tới cột E, tức KQ_COT, không ghi tới cột F và G.
   * Lý do: bốn ô máy dùng ở trên nằm đúng cột F và G của các dòng 2 tới 5, mà
   * khối này bắt đầu ngay từ dòng 2. Ghi đủ bảy cột là _header xóa trắng ô
   * Nhóm ngôn ngữ, và bảy câu của nhóm NL1 rơi khỏi phạm vi chấm trong im lặng.
   * Đã mắc thật khi chạy thử lần đầu ngày 30/8/2026. */
  const KQ_COT = 5;
  r = _muc(sh, r, 'KẾT QUẢ THÁNG ' + (tt.thang || '') + '/' + (tt.nam || ''), KQ_COT);
  _header(sh, r, ['','Kết quả','Giá trị','Trọng số','Đóng góp vào điểm tổng']);
  r++;
  const KQ = {};
  /* ⛔ HAI DÒNG BẬC TRONG NGẠCH ĐÃ BỎ. ✅ CHỐT 31/8/2026 (Sen). Bậc trong ngạch
   * đi qua quyết định bổ nhiệm, nhịp chậm, không phải thứ một phiếu tháng quyết.
   * Giữ chúng lại là để chữ "bậc" mang hai nghĩa ngay trong cùng một khối.
   * Nay phiếu chỉ còn MỘT thứ mang chữ bậc: BẬC CÁCH LÀM VIỆC 1 tới 5. */
  const DONG_KQ = [
   ['vh','Điểm trung bình VĂN HÓA CHUNG'],
   ['cm','Điểm trung bình NGẠCH CHUYÊN MÔN'],
   ['ql','Điểm trung bình NGẠCH QUẢN LÝ'],
   ['tong','ĐIỂM TỔNG THÁNG, thang 5'],
   ['bacP2','BẬC CÁCH LÀM VIỆC CỦA THÁNG'],
   ['ranh','TRẠNG THÁI RANH GIỚI'],
   ['truoc','Bậc cách làm việc tháng trước']
  ];
  DONG_KQ.forEach(function (k) {
    sh.getRange(r, PC.ND).setValue(k[1]).setFontWeight('bold');
    KQ[k[0]] = r;
    r++;
  });
  _khung(sh, KQ.vh - 1, DONG_KQ.length, KQ_COT);
  sh.getRange(KQ.vh, PC.DIEM, DONG_KQ.length, 1).setBackground(CFG.MAU.CONG_THUC)
    .setHorizontalAlignment('center').setFontWeight('bold');
  sh.getRange(KQ.tong, PC.DIEM, 3, 1).setBackground(CFG.MAU.DAT).setFontSize(13);
  r += 2;

  /* ---------- Khối thông tin ---------- */
  r = _muc(sh, r, 'THÔNG TIN NHÂN SỰ', C);
  const TTIN = [
   ['Mã nhân sự', tt.maNV || ''],
   ['Họ và tên', tt.hoTen || ''],
   ['Vị trí', tt.viTri || ''],
   ['Cấp', tt.cap || ''],
   ['Phòng ban', tt.phong || ''],
   ['Điểm làm việc', tt.diem || ''],
   ['Tuyến', tenTuyen],
   ['Tháng đánh giá', (tt.thang || '') + '/' + (tt.nam || '')]
  ];
  const ttDau = r;
  TTIN.forEach(function (n) {
    sh.getRange(r, PC.ND).setValue(n[0]);
    sh.getRange(r, PC.DIEM).setValue(n[1]).setFontWeight('bold');
    sh.getRange(r, PC.DIEM, 1, 3).setBackground(CFG.MAU.NHAT);
    r++;
  });
  _khung(sh, ttDau - 1, TTIN.length, C);
  _gopDai(sh, ttDau, r - 1, PC.DIEM, PC.SUVIEC);
  r += 2;

  /* ---------- I. Ranh giới ---------- */
  const RG = [];
  RANH_GIOI_CHUNG.forEach(function (nh) {
    nh[1].forEach(function (g) { RG.push([nh[0], g]); });
  });
  T.ranhGioi.forEach(function (nh) {
    nh[1].forEach(function (g) { RG.push([nh[0] + ', tuyến ' + tenTuyen, g]); });
  });

  r = _muc(sh, r, 'I. RANH GIỚI KHÔNG THỎA HIỆP. Có vi phạm thì CHẶN cả hai kết quả, không bù trừ được bằng kết quả kinh doanh', C);
  _header(sh, r, ['#','Ranh giới','Kết quả','Số biên bản','Sự việc','','']);
  r++;
  V.rg = r;
  RG.forEach(function (g, i) {
    const maRG = 'RG' + (i + 1);
    sh.getRange(r, PC.MA).setValue(maRG).setHorizontalAlignment('center');
    sh.getRange(r, PC.ND).setValue(_sachChuoi('[' + g[0] + '] ' + g[1])).setWrap(true);
    sh.getRange(r, PC.DIEM).setValue('Không vi phạm').setHorizontalAlignment('center')
      .setBackground(CFG.MAU.NHAT);
    _oDemBienBan(sh, r, maRG, tenSheet);
    sh.getRange(r, PC.SUVIEC).setWrap(true).setBackground(CFG.MAU.NHAT);
    V.chiMuc.push([maRG, r, 'I', 'Ranh giới', 'vi phạm', 'Không vi phạm']);
    r++;
  });
  V.rgC = r - 1;
  _dvList(sh.getRange(V.rg, PC.DIEM, RG.length, 1), ['Không vi phạm','Có vi phạm']);
  _cfDo(sh, sh.getRange(V.rg, PC.DIEM, RG.length, 1).getA1Notation(),
        '=$C' + V.rg + '="Có vi phạm"');
  _khung(sh, V.rg - 1, RG.length, C);
  _apTrinhBay(sh, 'I', V.rg - 1, V.rgC, QU);
  r += 2;

  /* ---------- II. Văn hóa chung ---------- */
  /* ✅ CHỐT 30/8/2026 (Sen). Tên cũ là Cách làm việc. Danh sách nhóm vẫn lấy
   * từ _cauHoiChung ở 13_BoCauHoi.gs, là chỗ duy nhất ghép. */
  r = _muc(sh, r, 'II. VĂN HÓA CHUNG. Mỗi câu chấm theo thang 1 tới 5. Mỗi nhóm đo theo đúng một chiều, ghi ngay dưới tên nhóm', C);
  _header(sh, r, ['Mã','Câu hỏi','Điểm','Số biên bản','Sự việc','','']);
  r++;
  V.vh = r;
  r = _khoiNhom(sh, r, _cauHoiChung(T), laQL, V, tenSheet, 'II', false);
  V.vhC = r - 1;
  _khung(sh, V.vh - 1, V.vhC - V.vh + 1, C);
  r += 2;

  /* ---------- III. Ngạch chuyên môn ---------- */
  V.cm = 0; V.cmC = 0;
  const boCH = _cauHoiTuyen(tenTuyen);
  /* ✅ GỘP 31/8/2026 (Sen). Trước đây chỗ này có hai nhánh, khác nhau đúng ở chỗ
   * nhánh đầu tính thêm bậc của từng nhóm theo lưới phân bậc. Bậc trong ngạch đã
   * bỏ khỏi phiếu, nên hai nhánh làm y hệt nhau và nay còn một. */
  if (boCH && boCH.chuyenMon.length) {
    r = _muc(sh, r, 'III. NGẠCH CHUYÊN MÔN. Mỗi câu chấm theo thang 0 tới 5', C);
    _header(sh, r, ['Mã','Nhóm tiêu chí và câu hỏi','Điểm','Số biên bản','Sự việc','','']);
    r++;
    V.cm = r;
    r = _khoiNhom(sh, r, boCH.chuyenMon, laQL, V, tenSheet, 'III');
    V.cmC = r - 1;
    _khung(sh, V.cm - 1, V.cmC - V.cm + 1, C);
    r += 2;
  } else {
    /* Tuyến chưa soạn bộ câu hỏi chuyên môn. Mục vẫn hiện để dãy số mục giống
     * hệt nhau ở mọi phiếu, cùng lý do với mục IV ở dưới. */
    r = _muc(sh, r, 'III. NGẠCH CHUYÊN MÔN', C);
    sh.getRange(r, PC.ND).setValue(
      'Tuyến này chưa có bộ câu hỏi chuyên môn. Mục I, II và các mục sau vẫn chấm bình thường và vẫn ra kết quả.')
      .setFontColor(CFG.MAU.CHU_GHI).setFontSize(9).setWrap(true);
    try { sh.getRange(r, PC.ND, 1, PC.SUVIEC - PC.ND + 1).merge(); } catch (e) {}
    r += 2;
  }

  /* ---------- IV. Ngạch quản lý ---------- */
  V.ql = 0; V.qlC = 0;
  if (laQL && boCH && boCH.quanLy.length) {
    r = _muc(sh, r, 'IV. NGẠCH QUẢN LÝ. Mỗi câu chấm theo thang 0 tới 5', C);
    _header(sh, r, ['Mã','Nhóm tiêu chí và câu hỏi','Điểm','Số biên bản','Sự việc','','']);
    r++;
    V.ql = r;
    r = _khoiNhom(sh, r, boCH.quanLy, laQL, V, tenSheet, 'IV');
    V.qlC = r - 1;
    _khung(sh, V.ql - 1, V.qlC - V.ql + 1, C);
    r += 2;
  } else {
    /* Mục IV vẫn hiện dù không chấm, để dãy số mục I tới VII giống hệt nhau ở
     * MỌI phiếu. Dãy số nhảy cóc là chỗ người đọc tưởng phiếu thiếu trang, và
     * là chỗ app phải xử hai hình dạng thay vì một. */
    r = _muc(sh, r, 'IV. NGẠCH QUẢN LÝ', C);
    sh.getRange(r, PC.ND).setValue(
      'Không áp dụng với vị trí không giữ vai trò quản lý. Phần này không tính vào điểm tổng tháng.')
      .setFontColor(CFG.MAU.CHU_GHI).setFontSize(9).setWrap(true);
    try { sh.getRange(r, PC.ND, 1, PC.SUVIEC - PC.ND + 1).merge(); } catch (e) {}
    r += 2;
  }

  /* ---------- V. Việc ngoài vị trí ---------- */
  /* Đổ từ sheet log, không nhập tay. Loại ghi trong log là "Việc ngoài vị trí". */
  r = _muc(sh, r, 'V. VIỆC NGOÀI VỊ TRÍ TRONG THÁNG. Là bằng chứng cho tiêu chí Đa nhiệm ở mục II', C);
  _header(sh, r, ['','Việc đã nhận ngoài vị trí','Ngày','Số hiệu phiếu','Người lập','','']);
  r++;
  V.dn = r;
  r = _bangTuLog(sh, r, tenSheet, 'Việc ngoài vị trí', 'Tháng này chưa có việc ngoài vị trí nào được ghi nhận.', C);
  r += 2;

  /* ---------- VI. Vi phạm nội quy ---------- */
  r = _muc(sh, r, 'VI. VI PHẠM NỘI QUY TRONG THÁNG. Là một trong nhiều căn cứ khi chấm văn hóa chung. Phần này không tự trừ điểm và không tự trừ bậc', C);
  _header(sh, r, ['','Nội quy bị vi phạm và sự việc','Ngày','Số hiệu biên bản','Người lập','','']);
  r++;
  V.vp = r;
  r = _bangTuLog(sh, r, tenSheet, 'Vi phạm nội quy', 'Tháng này chưa có vi phạm nội quy nào được ghi nhận.', C);
  r += 2;

  /* ---------- VII. Bảo mật thu nhập ---------- */
  r = _muc(sh, r, 'VII. BẢO MẬT THU NHẬP CÁ NHÂN. Có vi phạm thì bậc cách làm việc của tháng trừ thẳng 1 bậc, sàn là bậc 1', C);
  _header(sh, r, ['','Nghĩa vụ','Kết quả','Số biên bản','Sự việc','','']);
  r++;
  V.bm = r;
  sh.getRange(r, PC.MA).setValue('BM1').setHorizontalAlignment('center');
  sh.getRange(r, PC.ND).setValue(_sachChuoi(BAO_MAT_THU_NHAP.noiDung)).setWrap(true);
  sh.getRange(r, PC.DIEM).setValue('Không vi phạm').setHorizontalAlignment('center')
    .setBackground(CFG.MAU.NHAT);
  _oDemBienBan(sh, r, 'BM1', tenSheet);
  sh.getRange(r, PC.SUVIEC).setWrap(true).setBackground(CFG.MAU.NHAT);
  _dvList(sh.getRange(r, PC.DIEM), ['Không vi phạm','Có vi phạm']);
  _cfDo(sh, sh.getRange(r, PC.DIEM).getA1Notation(), '=$C' + r + '="Có vi phạm"');
  _khung(sh, r - 1, 1, C);
  V.chiMuc.push(['BM1', r, 'VII', 'Bảo mật thu nhập', 'vi phạm', 'Không vi phạm']);
  r += 2;

  /* ---------- Điền công thức cho khối KẾT QUẢ ở đầu sheet ---------- */
  const chan = 'COUNTIF($C$' + V.rg + ':$C$' + V.rgC + ',"Có vi phạm")>0';

  sh.getRange(KQ.vh, PC.DIEM).setFormula(_F(_ctTrungBinhPhan(V.vh, V.vhC)));
  if (V.cm) sh.getRange(KQ.cm, PC.DIEM).setFormula(_F(_ctTrungBinhPhan(V.cm, V.cmC)));
  else      sh.getRange(KQ.cm, PC.DIEM).setValue('Chưa có bộ câu hỏi');
  if (V.ql) sh.getRange(KQ.ql, PC.DIEM).setFormula(_F(_ctTrungBinhPhan(V.ql, V.qlC)));
  else      sh.getRange(KQ.ql, PC.DIEM).setValue('Không áp dụng');

  const ts = _troNgSo(!!V.ql, !!V.cm);
  sh.getRange(KQ.vh, PC.SOBB).setFormula(_F('=' + ts.vh));
  sh.getRange(KQ.cm, PC.SOBB).setFormula(_F('=' + ts.cm));
  sh.getRange(KQ.ql, PC.SOBB).setFormula(_F('=' + ts.ql));
  [KQ.vh, KQ.cm, KQ.ql].forEach(function (rr) {
    _pct(sh.getRange(rr, PC.SOBB));
    sh.getRange(rr, PC.SOBB).setHorizontalAlignment('center')
      .setBackground(CFG.MAU.CONG_THUC);
    sh.getRange(rr, PC.SUVIEC).setFormula(
      _F('=IF(ISNUMBER($C$' + rr + '),ROUND($C$' + rr + '*$D$' + rr + ',2),"")'))
      .setHorizontalAlignment('center').setBackground(CFG.MAU.CONG_THUC);
  });

  sh.getRange(KQ.tong, PC.DIEM).setFormula(_F(
    '=ROUND(IFERROR(N($C$' + KQ.vh + ')*$D$' + KQ.vh +
    '+N($C$' + KQ.cm + ')*$D$' + KQ.cm +
    '+N($C$' + KQ.ql + ')*$D$' + KQ.ql + ',0),2)'));

  sh.getRange(KQ.bacP2, PC.DIEM).setFormula(_F(
    '=IF(' + chan + ',"Chặn: vi phạm ranh giới",IFERROR(MAX(1,' +
    'INDEX(NR_NG_BAC,MATCH($C$' + KQ.tong + '/5,NR_NG_TL,1))' +
    '-IF($C$' + V.bm + '="Có vi phạm",1,0)),""))'));

  sh.getRange(KQ.ranh, PC.DIEM).setFormula(_F(
    '=IF(' + chan + ',"CÓ VI PHẠM RANH GIỚI","Không vi phạm")'));
  _cfDo(sh, sh.getRange(KQ.ranh, PC.DIEM).getA1Notation(),
        '=$C$' + KQ.ranh + '="CÓ VI PHẠM RANH GIỚI"');

  sh.getRange(KQ.truoc, PC.DIEM).setFormula(tt.sheetTruoc
    ? _F("=IFERROR('" + tt.sheetTruoc + "'!$C$" + KQ.bacP2 + ',"")')
    : '');
  sh.getRange(KQ.truoc, PC.DIEM).setBackground(CFG.MAU.CONG_THUC)
    .setFontSize(10).setFontWeight('normal');

  V.KQ = KQ;
  V.cuoi = r;

  /* ---------- Trình bày ---------- */
  const rong = [70, 620, 120, 100, 320, 10, 10];
  for (let c = 1; c <= C; c++) sh.setColumnWidth(c, rong[c-1]);
  sh.hideColumns(PC.PV, 2);
  sh.setFrozenRows(1);
  sh.getRange(1, 1, r, C).setVerticalAlignment('middle').setFontFamily('Calibri');
  sh.getRange(2, 1, r, C).setFontSize(10);
  return V;
}


/* ============================================================ khối câu hỏi */

/**
 * Dựng một khối gồm nhiều nhóm: mỗi nhóm là một dòng tiêu đề, một dòng logic đo,
 * rồi các dòng câu hỏi. Trả về dòng kế tiếp.
 */
function _khoiNhom(sh, r, NHOM, laQL, V, tenSheet, muc) {
  (NHOM || []).forEach(function (nh) {
    r = _dongTieuDeNhom(sh, r, nh[0], nh[1]);
    r = _dongCauHoi(sh, r, nh, laQL, V, tenSheet, muc);
  });
  return r;
}

/** Dòng tiêu đề của một nhóm. Gộp từ cột Nội dung tới cột Sự việc cho gọn mặt. */
function _dongTieuDeNhom(sh, r, ma, ten) {
  sh.getRange(r, PC.MA).setValue(ma).setFontWeight('bold');
  sh.getRange(r, PC.ND).setValue(ten).setFontWeight('bold').setWrap(true);
  sh.getRange(r, 1, 1, CFG.COT).setBackground(CFG.MAU.NHOM);
  try { sh.getRange(r, PC.ND, 1, PC.SUVIEC - PC.ND + 1).merge(); } catch (e) {}
  return r + 1;
}

/**
 * Các dòng câu hỏi của một nhóm, ngay dưới dòng tiêu đề nhóm.
 * Điểm mặc định theo logic đo của nhóm: vi phạm là 5, ghi nhận là 0.
 */
function _dongCauHoi(sh, r, nhom, laQuanLy, V, tenSheet, muc) {
  if (!nhom || !nhom[2] || !nhom[2].length) return r;
  const logic = String(nhom[3]);
  const md = _macDinh(logic);
  r = _dongLogic(sh, r, logic);
  nhom[2].forEach(function (c) {
    sh.getRange(r, PC.MA).setValue(c[0]).setFontColor(CFG.MAU.CHU_GHI);
    sh.getRange(r, PC.ND).setValue(_sachChuoi(c[1])).setWrap(true);
    sh.getRange(r, PC.DIEM).setValue(md).setHorizontalAlignment('center')
      .setBackground(CFG.MAU.NHAT);
    _oDemBienBan(sh, r, c[0], tenSheet);
    sh.getRange(r, PC.SUVIEC).setWrap(true).setBackground(CFG.MAU.NHAT);
    _oPhamVi(sh.getRange(r, PC.PV), _thuocPhamVi(c[2], laQuanLy, V));
    V.chiMuc.push([c[0], r, muc, nhom[0], logic, md]);
    r++;
  });
  const dau = r - nhom[2].length;
  _dvList(sh.getRange(dau, PC.DIEM, nhom[2].length, 1), [0,1,2,3,4,5]);
  return r;
}

/**
 * Dòng chữ nhỏ nói rõ nhóm này đo theo chiều nào. Không có ô nhập.
 *
 * ✅ SỬA 30/8/2026 (Sen). Câu chữ viết lại để đọc đúng với CẢ câu ở thể khẳng
 * định lẫn câu ở thể hành vi sai. Lý do: từ bản 6.0 không còn người chấm ngồi
 * đọc câu rồi chọn một con số, nên câu hỏi nay là chỗ NÊU CHUẨN, còn điểm là
 * khoảng cách giữa chuẩn đó với tháng vừa rồi. Bản cũ viết "Đo mức độ vi phạm"
 * chỉ đọc xuôi khi câu ở thể phủ định.
 */
function _dongLogic(sh, r, logic) {
  const t = (logic === 'vi phạm')
    ? 'Nhóm này nêu CHUẨN PHẢI GIỮ. Mặc định đầu tháng là 5, tức chưa có biên bản nào. Mỗi biên bản vi phạm về nội dung này kéo điểm xuống.'
    : 'Nhóm này nêu việc VƯỢT TRÊN phần được giao. Mặc định đầu tháng là 0, tức chưa ghi nhận lần nào. Mỗi phiếu ghi nhận đẩy điểm lên.';
  sh.getRange(r, PC.ND).setValue(t).setFontSize(8).setFontStyle('italic')
    .setFontColor(CFG.MAU.CHU_GHI).setWrap(true);
  try { sh.getRange(r, PC.ND, 1, PC.SUVIEC - PC.ND + 1).merge(); } catch (e) {}
  return r + 1;
}

/** Ô đếm số biên bản của một mã trong tháng này, đọc từ sheet log. */
function _oDemBienBan(sh, r, ma, tenSheet) {
  sh.getRange(r, PC.SOBB).setFormula(_F(
    "=IFERROR(COUNTIFS(" + CFG.LOG_SHEET + "!$A:$A,\"" + tenSheet + "\"," +
    CFG.LOG_SHEET + "!$D:$D,\"" + ma + "\"),0)"))
    .setBackground(CFG.MAU.CONG_THUC).setHorizontalAlignment('center').setFontSize(9);
}


/* ============================================================ bảng đổ từ log */

/**
 * Một bảng lấy thẳng từ sheet log theo tháng và theo loại. Không có ô nhập tay.
 *
 * Cột log: A Tháng · B Ngày · C Loại · D Mã câu · E Sự việc · F Số hiệu ·
 *          G Người lập · H Điểm áp.
 * Bảng lấy E, B, F, G rồi đặt từ cột Nội dung, để cột rộng nhất gánh phần chữ dài.
 *
 * ⚠️ Số dòng chừa ra phải LỚN HƠN giới hạn của câu lệnh, nếu không kết quả tràn
 * xuống mục kế tiếp và Sheets trả về lỗi tràn vùng. Hai con số dưới đi cùng nhau.
 */
const LOG_GIOI_HAN = 10;

function _bangTuLog(sh, r, tenSheet, loai, chuTrong, C) {
  sh.getRange(r, PC.ND).setFormula(_F(
    '=IFERROR(QUERY(' + CFG.LOG_SHEET + '!$A:$H,' +
    '"select E,B,F,G where A = \'' + tenSheet + '\' and C = \'' + loai + '\' limit ' +
    LOG_GIOI_HAN + '",0),"' + chuTrong + '")'));
  const so = LOG_GIOI_HAN + 1;
  sh.getRange(r, PC.ND, so, 4).setBackground(CFG.MAU.CONG_THUC).setWrap(true).setFontSize(9);
  _khung(sh, r - 1, so, C);
  return r + so;
}


/* ============================================================ điểm và trọng số */

/**
 * Điểm trung bình của một phần, thang 5. Ô đặt Thuộc phạm vi bằng Không rời
 * khỏi CẢ tử số lẫn mẫu số, nên phần không áp dụng không kéo điểm xuống.
 */
function _ctTrungBinhPhan(dau, cuoi) {
  return '=IFERROR(ROUND(SUMIF($F$' + dau + ':$F$' + cuoi + ',"Có",$C$' + dau + ':$C$' + cuoi + ')' +
         '/COUNTIF($F$' + dau + ':$F$' + cuoi + ',"Có"),2),0)';
}

/** Tỷ lệ đạt của một phần, 0 tới 1. Dùng khi cần con số phần trăm. */
function _ctTyLePhan(dau, cuoi) {
  return '=IFERROR(SUMIF($F$' + dau + ':$F$' + cuoi + ',"Có",$C$' + dau + ':$C$' + cuoi + ')' +
         '/(5*COUNTIF($F$' + dau + ':$F$' + cuoi + ',"Có")),0)';
}

/**
 * Trọng số của ba phần, trả về công thức cho từng ô.
 * ✅ CHỐT 30/8/2026 (Sen).
 *   Không có ngạch quản lý: Văn hóa 65%, Chuyên môn 35%.
 *   Có ngạch quản lý:       Văn hóa 50%, Quản lý 30%, Chuyên môn 20%.
 * Phần không có mặt trong phiếu thì trọng số bằng 0, và phần còn lại chia lại
 * theo đúng tỷ lệ giữa chúng, nên tổng ba trọng số luôn bằng 1.
 * Con số nằm ở sheet Tham số, không nằm trong công thức.
 */
function _troNgSo(coQL, coCM) {
  const Z = '0';
  if (coQL && coCM) return { vh: 'TS_TS_VH2', ql: 'TS_TS_QL2', cm: 'TS_TS_CM2' };
  if (coQL && !coCM) return {
    vh: 'TS_TS_VH2/(TS_TS_VH2+TS_TS_QL2)', ql: 'TS_TS_QL2/(TS_TS_VH2+TS_TS_QL2)', cm: Z };
  if (!coQL && coCM) return { vh: 'TS_TS_VH1', ql: Z, cm: 'TS_TS_CM1' };
  return { vh: '1', ql: Z, cm: Z };
}


/* ============================================================ phạm vi và bậc */

/**
 * Ô Thuộc phạm vi, cột ẩn F. Sinh công thức trỏ về bốn ô máy dùng ở đầu sheet.
 */
function _thuocPhamVi(phamVi, laQuanLy, V) {
  const s = String(phamVi || '');
  if (s.indexOf('người nói') >= 0)  return '=IF(' + V.oNN + '="Người nói","Có","Không")';
  if (s.indexOf('người điếc/ khiếm thính') >= 0) return '=IF(' + V.oNN + '="Người điếc/ khiếm thính","Có","Không")';
  if (s.indexOf('quản lý') >= 0)    return laQuanLy ? 'Có' : 'Không';
  if (s.indexOf('điểm bán') >= 0)   return '=IF(' + V.oDiemBan + '="Có","Có","Không")';

  /* Ngưỡng cấp, ghi bằng TÊN: "Từ Trưởng phòng trở lên". ✅ ĐỔI 31/8/2026 (Sen),
   * thay dạng cũ "Từ bậc 6 trở lên". Lý do: hai ngạch dùng chung một dãy số
   * nhưng tên khác nhau, nên số 4 vừa là Lead bộ phận vừa là Chuyên viên, và bộ
   * câu hỏi đã có một nhãn sai vì chuyện đó.
   *
   * Tên cấp quy về thứ hạng ngay tại đây, nên con số không đi vào phiếu dưới
   * dạng chữ. Tên lạ thì trả về 'Có', tức áp cho mọi người: một ngưỡng gõ sai
   * không được phép làm câu hỏi biến mất trong im lặng. 🩹 Soát bắt chỗ đó. */
  const m = s.match(/^Từ\s+(.+?)\s+trở lên$/i);
  if (m) {
    const h = _hangCap(m[1]);
    if (h) return '=IF(' + V.oHang + '>=' + h + ',"Có","Không")';
  }
  return 'Có';
}

/** Thứ hạng của một tên cấp, 0 khi không tra được. Xem CAP_BAC ở 03_DuLieuTuyen.gs. */
function _hangCap(ten) {
  const c = _traCap(ten);
  return c ? c.bac : 0;
}

function _oPhamVi(o, giaTri) {
  if (String(giaTri).charAt(0) === '=') o.setFormula(_F(giaTri)); else o.setValue(giaTri);
  return o.setHorizontalAlignment('center');
}

/* ⛔ BA HÀM TÍNH BẬC TRONG NGẠCH ĐÃ GỠ NGÀY 31/8/2026 (Sen): _bacCuaNhom,
 * _ctBacNhom, _ctDaSoRoi. Chúng chỉ phục vụ hai dòng BẬC TRONG NGẠCH ở khối kết
 * quả, mà hai dòng đó đã bỏ. Bản cũ đọc được ở lịch sử phiên bản của file này.
 *
 * ⚠️ Kéo theo: ba tham số TS_NG_BAC, TS_DA_SO và TS_TUT_TOI_DA nay KHÔNG CÒN
 * chỗ dùng nào trong hệ. Chúng vẫn nằm ở sheet ⚙️ Tham số, chờ Sen quyết bỏ hay
 * giữ, vì luật 11 mục 3 CLAUDE.md cấm tự xóa. */

/** Tìm một nhóm theo mã trong bộ câu hỏi của tuyến. */
function _timNhom(tenTuyen, phan, maNhom) {
  const bo = _cauHoiTuyen(tenTuyen);
  if (!bo || !bo[phan]) return null;
  let nhom = null;
  bo[phan].forEach(function (nh) { if (nh[0] === maNhom) nhom = nh; });
  return nhom;
}


/* ============================================================ dọn chữ */

/**
 * Gỡ ghi chú nội bộ khỏi mọi chuỗi hiện ra trên phiếu.
 * ✅ CHỐT 30/8/2026 (Sen). Nhân sự đọc phiếu này, nên phiếu không được mang
 * dấu vết quá trình soạn thảo: ngày chốt, tên người chốt, lời tự bình về việc
 * nội dung này lấy từ đâu, và các dấu cảnh báo dành cho người soạn.
 *
 * Cắt tại dấu ⚠️ trở về sau, rồi gỡ mọi icon còn lại và mọi cụm ngày chốt.
 */
function _sachChuoi(s) {
  let t = String(s == null ? '' : s);
  const i = t.indexOf('⚠️');
  if (i >= 0) t = t.substring(0, i);
  t = t.replace(/[✅⛔⏳🔴⚠]/g, '');
  t = t.replace(/\s*\(\s*Sen\s*\)\s*/g, ' ');
  t = t.replace(/\s*CHỐT\s*\d{1,2}\/\d{1,2}\/\d{4}\s*/g, ' ');
  t = t.replace(/\s{2,}/g, ' ');
  return t.trim();
}


/* ============================================================ trình bày */

/** Gộp một dải cột cho nhiều dòng liền nhau. Bỏ qua dòng không gộp được. */
function _gopDai(sh, dau, cuoi, cotDau, cotCuoi) {
  if (cotCuoi <= cotDau) return;
  for (let r = dau; r <= cuoi; r++) {
    try { sh.getRange(r, cotDau, 1, cotCuoi - cotDau + 1).merge(); } catch (e) {}
  }
}

/**
 * Quy ước gộp ô. Trong file năm không có sheet Quy ước trình bày, nên đọc từ
 * file gốc khi chạy trên file gốc, và trả về mặc định khi không đọc được.
 */
function _docTrinhBayAn(ssDich) {
  try { return _docTrinhBay(); } catch (e) { return {}; }
}
