/**
 * MODULE 01: Lõi hệ. Cấu hình, menu, điều phối dựng và cập nhật, tiện ích dùng chung.
 *
 * HỆ PHIẾU ĐÁNH GIÁ NHÂN SỰ - CÔNG TY TNHH NHÀ CỦA THỜI THANH XUÂN
 *
 * KIẾN TRÚC
 *   File GỐC (file này)   giữ toàn bộ code, tham số, khung chung, và ma trận
 *                         cấp bậc kèm giải thích của TẤT CẢ các tuyến, mỗi
 *                         tuyến một sheet.
 *   File PHIẾU (xuất ra)  một file cho MỘT NGƯỜI, KHÔNG chứa code. Bên trong
 *                         có sheet giải thích và ma trận của đúng tuyến đó,
 *                         cộng phiếu chấm.
 *
 * CÂY THƯ MỤC TRÊN DRIVE, nằm ngay trong thư mục đang chứa FILE GỐC
 *   People / People Management / Đánh giá /   ← chỗ file gốc đang nằm
 *     2026-Q3 /                        đợt đánh giá định kỳ
 *       Tuyến Thương mại & Dịch vụ /
 *         Phiếu đánh giá - TTX017 - Nguyễn Trọng Duy - 2026-Q3
 *       Tuyến Pha chế /
 *     2026-08-20 Phát sinh - Thương mại & Dịch vụ /     đợt phát sinh, chỉ một tuyến
 *
 * CÁC MODULE
 *   01_Code          lõi, menu, cập nhật phiên bản, tiện ích
 *   02_ThamSo        mọi ngưỡng và trọng số
 *   03_DuLieuTuyen   dữ liệu từng tuyến. Thêm tuyến mới sửa ở đây
 *   04_KhungChung    ranh giới chung, và phần cách làm việc dùng chung
 *   05_MaTran        sinh sheet ma trận kèm giải thích, mỗi tuyến một sheet
 *   06_Phieu         sinh mẫu phiếu chấm
 *   07_XuatDrive     tạo cây thư mục và xuất phiếu cho từng người
 *   08_TongHop       tổng hợp kỳ, nhật ký phiên bản, chốt kỳ
 *   09_HuongDan      sheet hướng dẫn dùng chung
 *   10_NhanSu        đồng bộ nhân sự từ People Management
 *   11_TrinhBay      quy ước trình bày, học từ một phiếu đã chỉnh
 *   12_TuDong        chế độ chạy tự động hằng ngày
 *   13_BoCauHoi      ⛔ sinh tự động từ ba file .md, bộ câu hỏi CHẤM ĐIỂM
 *   14_DinhTinh      ⛔ sinh tự động từ file .md, bộ câu hỏi ĐỊNH TÍNH, không chấm điểm
 *   15_FileNam       file một năm của một người: 12 sheet tháng, log, chỉ mục
 *   16_BoCauHoiSheet ⛔ NGUỒN của bộ câu hỏi, nằm trên SHEET chứ không trong code.
 *                    Một sheet 📚 Bộ câu hỏi, ba loại dòng, ba tầng bật tắt
 */

const VERSION = '6.2 · 31/8/2026, bỏ cột Bậc trong ngạch, chữ bậc chỉ còn một nghĩa';

const CFG = {
  SHEETS: {
    HD:    '📖 Hướng dẫn',
    TS:    '⚙️ Tham số',
    CHUNG: '🧬 Khung chung',
    DM:    '📇 Danh mục tuyến',
    NS:    '👥 Nhân sự',
    LS:    '🗂️ Lịch sử đánh giá',
    TB:    '🎨 Quy ước trình bày',
    TH:    '📊 Tổng hợp kỳ',
    NK:    '📜 Nhật ký phiên bản'
  },
  MT_PREFIX: '📐 ',            // sheet ma trận của một tuyến
  PH_SHEET:  '📋 Phiếu chấm',  // sheet phiếu trong file xuất ra
  /* ✅ THÊM 15/8/2026 (Sen). Sheet nhận xét định tính, nằm RIÊNG trong cùng
   * file xuất ra. Cố ý không nhập vào phiếu chấm để không dòng nào của nó
   * lọt vào năm công thức tỷ lệ. Nội dung ở `14_DinhTinh.gs`. */
  PDT_SHEET: '📝 Nhận xét định tính',
  /* ✅ THÊM 30/8/2026 (Sen). Hai sheet ẨN của file năm.
   * LOG_SHEET là nơi app HTML ghi từng biên bản vi phạm và từng phiếu ghi nhận,
   * mỗi thứ một dòng. Cột: A Tháng · B Ngày · C Loại · D Mã câu · E Sự việc ·
   * F Số hiệu · G Người lập · H Điểm áp.
   * CHIMUC_SHEET là bản đồ mã câu sang số dòng, để app ghi đúng ô mà không dò. */
  LOG_SHEET:    '_log',
  CHIMUC_SHEET: '_chiMuc',
  BK_PREFIX: '_bk ',
  // Thư mục chứa các đợt: MẶC ĐỊNH là thư mục đang chứa chính file gốc này,
  // để cây đánh giá luôn nằm cùng chỗ với file gốc trong thư mục People.
  DRIVE_ROOT: 'Đánh giá',

  // Tông xanh lá, thống nhất với hệ People Management của Công ty
  MAU: {
    DAM:'#0d652d', HEADER:'#188038', NHAT:'#e6f4ea', CONG_THUC:'#f3faf5',
    INPUT:'#fffdf0', CANH_BAO:'#fce8e6', DAT:'#d9ead3', VIEN:'#c8dccf',
    CHU_GHI:'#5f6368', NHOM:'#f5f9f2', CHO:'#fef7e0'
  },
  /* ✅ SỬA 30/8/2026 (Sen). Tám cột xuống BẢY. Bỏ hai cột Tự chấm và Người
   * chấm, còn một cột Điểm; bỏ cột trống số 7 vốn chỉ để chừa chỗ gộp ô.
   * Bố cục mới: A Mã · B Nội dung · C Điểm · D Số biên bản · E Sự việc ·
   * F Thuộc phạm vi (ẩn) · G Bậc của câu (ẩn). Bảng mã cột ở PC trong 06_Phieu.gs. */
  COT: 7,

  // Tham số người dùng chỉnh tay: cập nhật phiên bản KHÔNG ghi đè
  /* ⚠️ Mọi tham số có tên vùng PHẢI có mặt ở đây. Danh sách này làm HAI việc:
   * giữ giá trị người dùng đã chỉnh khi vẽ lại phiên bản, và dựng lại tên vùng
   * trong file phiếu xuất ra qua `_dungLaiNamedRange`. Thiếu một tên thì mọi
   * công thức dùng tên đó trong phiếu đã xuất trả về #NAME?.
   * ✅ SỬA 11/8/2026. `TS_NG_BAC` thêm từ bản 4.0 ngày 9/8 nhưng không được khai
   * ở đây, nên cột Bậc của mọi nhóm trong phiếu đã xuất đều lỗi #NAME?. */
  TS_GIU: ['TS_DA_SO','TS_TUT_TOI_DA','TS_NG_BAC',
           'TS_NG1','TS_NG2','TS_NG3','TS_NG4','TS_NG5','TS_DRIVE_ID','TS_PM_ID',
           /* ✅ THÊM 30/8/2026 (Sen). Trọng số ghép ba phần thành điểm tổng tháng. */
           'TS_TS_VH1','TS_TS_CM1','TS_TS_VH2','TS_TS_QL2','TS_TS_CM2']
};

/* ==================== MENU ==================== */

function onOpen() {
  SpreadsheetApp.getUi().createMenu('📊 TTX Đánh giá')
    .addItem('🔧 Dựng lần đầu', 'setupAll')
    .addItem('🔄 Cập nhật phiên bản, giữ dữ liệu', 'capNhatPhienBan')
    .addSeparator()
    .addItem('⚡ Bật chế độ tự động', 'batCheDoTuDong')
    .addItem('🔍 Xem chế độ tự động đang bật gì', 'xemTrangThaiTuDong')
    .addSeparator()
    .addItem('🩹 Soát sheet Bộ câu hỏi', 'soatBoCauHoi')
    .addItem('📥 Xuất bộ câu hỏi ra file', 'xuatBoCauHoi')
    .addItem('🔁 Áp bộ câu hỏi mới cho các tháng chưa chốt', 'apBoCauHoiMoi')
    .addSeparator()
    .addItem('🔃 Đồng bộ nhân sự ngay', 'dongBoNhanSu')
    .addItem('🧪 Xuất phiếu THỬ, không ghi vào kho', 'xuatPhieuTest')
    .addItem('📅 Tạo FILE NĂM cho một người', 'taoFileNamMotNguoi')
    .addItem('📚 Tạo FILE NĂM cho nhiều người', 'taoFileNamNhieuNguoi')
    .addItem('🗂️ Mở thư mục đánh giá trên Drive', 'moThuMucDrive')
    .addSeparator()
    .addItem('📥 Thu kết quả một tháng về Tổng hợp', 'thuKetQuaThang')
    .addItem('🔁 Dựng lại các tháng chưa chốt', 'dungLaiFileNam')
    .addSeparator()
    .addItem('🎨 Học cách trình bày từ một phiếu', 'hocCachTrinhBay')
    .addItem('🩺 Kiểm 16 module đã dán đủ chưa', 'kiemModule')
    .addItem('🛑 Tắt chế độ tự động', 'tatCheDoTuDong')
    .addItem('❓ Về hệ này', 'veHeNay')
    .addToUi();
}

/* ============================================================ KIỂM MODULE
 * ✅ THÊM 19/8/2026 (Sen). Ca dựng: Sheet ném `BAO_MAT_THU_NHAP is not defined`
 * vì 06_Phieu.gs đã là bản mới, gọi hằng của mục VIII, còn 04_KhungChung.gs vẫn
 * là bản TRƯỚC 11/8/2026 nên chưa có hằng đó. Dán theo phần chênh sinh ra đúng
 * lớp lỗi này, và trước nay không có gì phát hiện được: `VIEC-TAY-NGOAI-HE.md`
 * chỉ là danh sách tự khai, mà mọi danh sách tự khai trong hệ đều đã hỏng.
 *
 * Hàm này biến việc đó thành phép kiểm chạy được ngay trên Sheet.
 *
 * ⚠️ GIỚI HẠN, phải nhớ: mốc chỉ nhận ra được ĐỜI code khi cột thứ ba là true.
 * Module có cột thứ ba là false thì chỉ kiểm được CÓ hay KHÔNG.
 * Thêm mốc mới cho một module thì sửa cột thứ hai và cột thứ tư của dòng đó.
 *
 * ✅ SỬA 30/8/2026 (Sen). Ca dựng lần hai: Sheet ném `buildPhieu is not defined`
 * khi xuất phiếu thử, vì `06_Phieu.gs` đã là bản 6.0 và không còn hàm `buildPhieu`,
 * còn `07_XuatDrive.gs` trên Sheet vẫn là bản cũ và vẫn gọi hàm đó. Bảng mốc lúc
 * ấy kiểm 07 bằng `typeof _chuanNhomNN === 'function'`, mà hàm đó có mặt ở CẢ HAI
 * đời, nên `🩺` báo đủ 16 module trong khi hai đời code đang gặp nhau.
 *
 * ⛔ LUẬT RÚT RA: mốc phải là thứ CHỈ bản mới mới có. Tên hàm còn nguyên qua hai
 * đời thì không phải mốc. Ba cách đặt mốc đúng, dùng theo thứ tự ưu tiên:
 *   1. một hằng hoặc một hàm chỉ bản mới mới khai, ví dụ TH_COT, DT_COT
 *   2. số tham số của một hàm đã đổi chữ ký, ví dụ _taoPhieuTest.length
 *   3. một chuỗi chỉ có trong thân hàm bản mới, đọc bằng String(fn).indexOf */
function kiemModule() {
  const MOC = [
   ['01_Code.gs',        'VERSION là 6.2',              true,  function () { return String(VERSION).indexOf('6.2') === 0; }],
   ['02_ThamSo.gs',      'có mục trọng số TS_TS_VH1',   true,  function () { return String(buildThamSo).indexOf('TS_TS_VH1') > -1; }],
   ['03_DuLieuTuyen.gs', 'có _dsCapNguong',             true,  function () {
       return typeof CAP_BAC !== 'undefined' && typeof _dsCapNguong === 'function' &&
              _dsCapNguong().length > 0; }],
   ['04_KhungChung.gs',  'mục C tên VĂN HÓA CHUNG',     true,  function () {
       return typeof BAO_MAT_THU_NHAP !== 'undefined' && String(buildKhungChung).indexOf('VĂN HÓA CHUNG') > -1; }],
   ['05_MaTran.gs',      'có buildMaTran',              false, function () { return typeof buildMaTran === 'function'; }],
   ['06_Phieu.gs',       'PC.MAY thay PC.BAC',          true,  function () {
       /* Bản 6.1 có PC.BAC và ba hàm tính bậc trong ngạch. Bản 6.2 đổi cột G
        * thành PC.MAY và gỡ hẳn ba hàm đó. Đây là chỗ hai đời gặp nhau. */
       return typeof buildPhieuThang === 'function' && typeof PC !== 'undefined' &&
              PC.MAY === 7 && PC.BAC === undefined &&
              typeof _bacCuaNhom === 'undefined' && typeof _hangCap === 'function'; }],
   ['07_XuatDrive.gs',   '_taoPhieuTest nhận 2 tham số', true, function () {
       /* Bản cũ nhận ba tham số (tuyen, laQL, cap) và gọi buildPhieu. Bản 6.0
        * nhận hai (tuyen, cap) và gọi buildPhieuThang. Đây là chỗ vỡ ngày 30/8. */
       return typeof _taoPhieuTest === 'function' && _taoPhieuTest.length === 2 &&
              String(_taoPhieuTest).indexOf('buildPhieuThang') > -1; }],
   ['08_TongHop.gs',     'có TH_COT 17 cột',            true,  function () {
       return typeof TH_COT !== 'undefined' && TH_COT.length === 17; }],
   ['09_HuongDan.gs',    'hướng dẫn nói về FILE NĂM',   true,  function () {
       return String(buildHuongDan).indexOf('File năm') > -1; }],
   ['10_NhanSu.gs',      'dòng 2 là NĂM ĐANG MỞ',       true,  function () {
       return String(buildNhanSu).indexOf('NĂM ĐANG MỞ') > -1; }],
   ['11_TrinhBay.gs',    'TB_MAC_DINH đã rỗng',         true,  function () {
       return typeof TB_MAC_DINH !== 'undefined' && TB_MAC_DINH.length === 0; }],
   ['12_TuDong.gs',      'ô tick gọi taoFileNam',       true,  function () {
       return String(taoPhieuKhiTick).indexOf('taoFileNam') > -1; }],
   ['13_BoCauHoi.gs',    'có CAU_HOI_CHUNG',            true,  function () { return typeof CAU_HOI_CHUNG !== 'undefined'; }],
   ['14_DinhTinh.gs',    'có DT_COT',                   true,  function () {
       return typeof buildDinhTinh === 'function' && typeof DT_COT !== 'undefined'; }],
   ['15_FileNam.gs',     'có apBoCauHoiMoi',            true, function () {
       return typeof taoFileNam === 'function' && typeof apBoCauHoiMoi === 'function' &&
              typeof THANG_SHEET !== 'undefined' && THANG_SHEET.length === 12; }],
   ['16_BoCauHoiSheet.gs','BCH 12 cột, có _bchBoCotBac', true, function () {
       return typeof BCH !== 'undefined' && BCH.SOCOT === 12 &&
              BCH.C_BAC === undefined && typeof _bchBoCotBac === 'function' &&
              typeof _docBoCauHoi === 'function' && typeof BCH.SHEET_BT === 'undefined'; }]
  ];

  const hong = [], dat = [];
  let soDoi = 0;
  MOC.forEach(function (m) {
    let ok = false;
    try { ok = !!m[3](); } catch (e) { ok = false; }
    if (m[2]) soDoi++;
    const dong = m[0] + '   ' + m[1] + (m[2] ? '' : '   (chỉ kiểm được CÓ, không kiểm được đời)');
    if (ok) dat.push('✅ ' + dong); else hong.push('❌ ' + dong);
  });

  const ui = SpreadsheetApp.getUi();
  ui.alert(
    hong.length ? '❌ THIẾU HOẶC CŨ ' + hong.length + ' MODULE, phải dán lại'
                : '✅ Đủ ' + MOC.length + ' module, đúng đời ' + String(VERSION).split(' ')[0],
    (hong.length
      ? 'Những dòng ❌ dưới đây là file CHƯA DÁN hoặc dán bản CŨ:\n\n' + hong.join('\n') +
        '\n\n⛔ Cách sửa DUY NHẤT: dán đè CẢ ' + MOC.length + ' file theo đúng thứ tự 01 tới 15, ' +
        'rồi bấm 🔄 Cập nhật phiên bản. Đừng dán riêng file bị báo, vì file khác ' +
        'cũng có thể đang là bản cũ mà phép kiểm này không nhận ra.\n\n'
      : soDoi + ' trên ' + MOC.length + ' module có mốc nhận ra được ĐỜI code, và đều đúng bản ' +
        String(VERSION).split(' ')[0] + '.\n\n' +
        '⚠️ ' + (MOC.length - soDoi) + ' module còn lại chỉ kiểm được là CÓ mặt.\n\n') +
    dat.join('\n'),
    ui.ButtonSet.OK);
}

/* ==================== DỰNG VÀ CẬP NHẬT ==================== */

/** Các khối cấu trúc của file gốc. */
function BUOC_NEN() {
  const b = [
    { ten: CFG.SHEETS.HD,    fn: buildHuongDan },
    { ten: CFG.SHEETS.TS,    fn: buildThamSo },
    { ten: CFG.SHEETS.DM,    fn: buildDanhMuc },
    { ten: CFG.SHEETS.TB,    fn: buildTrinhBay },
    { ten: CFG.SHEETS.CHUNG, fn: buildKhungChung }
  ];
  Object.keys(TUYEN).forEach(function (t) {
    b.push({ ten: CFG.MT_PREFIX + t, fn: function () { buildMaTran(t); } });
  });
  return b;
}

function setupAll() {
  const ss = _ss();
  /* ⛔ Bộ câu hỏi dựng TRƯỚC, vì sheet ma trận và khung chung đọc từ nó.
   * Và nó KHÔNG nằm trong BUOC_NEN, vì vòng lặp đó xóa sheet trước khi dựng lại,
   * mà sheet này là dữ liệu Sen nhập tay. Xem 16_BoCauHoiSheet.gs. */
  buildBoCauHoi();
  BUOC_NEN().forEach(function (b) {
    const cu = ss.getSheetByName(b.ten);
    if (cu) ss.deleteSheet(cu);
    b.fn();
  });
  buildNhanSu();
  buildLichSu();
  buildTongHop();
  buildNhatKy();
  ['Trang tính1','Sheet1'].forEach(function (t) {
    const s = ss.getSheetByName(t);
    if (s && s.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(s);
  });
  _ghiNhatKy('Dựng lần đầu', 'Phiên bản ' + VERSION + ' · ' + Object.keys(TUYEN).length + ' tuyến');
  sapXepSheet();
  ss.setActiveSheet(ss.getSheetByName(CFG.SHEETS.HD));
  _ui().alert('Đã dựng xong file gốc.',
    'File này giữ code, tham số và ma trận của mọi tuyến.\n\n' +
    'Hai bước tiếp theo:\n' +
    '1. Menu 🔃 Đồng bộ nhân sự từ People Management\n' +
    '2. Menu 📤 Xuất phiếu cho một người',
    _ui().ButtonSet.OK);
}

/**
 * Vẽ lại cấu trúc và nội dung theo code. GIỮ NGUYÊN tham số đã chỉnh tay,
 * Tổng hợp kỳ và Nhật ký. Sao lưu tự động trước khi chạy.
 * Phiếu đã xuất ra Drive KHÔNG bị đụng tới, xem cảnh báo trong hộp thoại.
 */
function capNhatPhienBan() {
  const ui = _ui();
  if (ui.alert('🔄 Cập nhật phiên bản',
      'Vẽ lại toàn bộ cấu trúc, công thức và nội dung ma trận theo code.\n\n' +
      'GIỮ NGUYÊN: tham số đã chỉnh tay, Tổng hợp kỳ, Nhật ký phiên bản, và toàn bộ sheet 📚 Bộ câu hỏi.\n\n' +
      '⚠️ Các file PHIẾU đã xuất ra Drive KHÔNG tự cập nhật theo. Muốn dùng bản mới thì xuất lại phiếu.\n\n' +
      'Tự sao lưu vào sheet ẩn trước khi chạy. Tiếp tục?',
      ui.ButtonSet.YES_NO) !== ui.Button.YES) return;

  const ss = _ss();
  _saoLuuAnToan();

  const giu = {};
  CFG.TS_GIU.forEach(function (n) {
    try { const v = ss.getRangeByName(n).getValue(); if (v !== '' && v !== null) giu[n] = v; } catch (e) {}
  });

  /* ⛔ Bộ câu hỏi KHÔNG bị vẽ lại. Hàm này chỉ làm mới banner, khối điểm nền và
   * hộp chọn; vùng dữ liệu Sen nhập tay giữ nguyên. Chạy trước vì sheet ma trận
   * và khung chung đọc từ nó. */
  buildBoCauHoi();

  BUOC_NEN().forEach(function (b) {
    const cu = ss.getSheetByName(b.ten);
    if (cu) ss.deleteSheet(cu);
    b.fn();
  });
  if (!ss.getSheetByName(CFG.SHEETS.NS)) buildNhanSu();
  buildLichSu();
  buildTongHop();
  buildNhatKy();

  Object.keys(giu).forEach(function (n) {
    try { ss.getRangeByName(n).setValue(giu[n]); } catch (e) {}
  });

  // Gỡ sheet ma trận của tuyến đã bị xóa khỏi code
  ss.getSheets().forEach(function (s) {
    const t = s.getName();
    if (t.indexOf(CFG.MT_PREFIX) !== 0) return;
    if (!TUYEN[t.substring(CFG.MT_PREFIX.length)]) {
      s.setName('_cu ' + t.substring(0, 24)); s.hideSheet();
    }
  });

  _ghiNhatKy('Cập nhật phiên bản', 'Phiên bản ' + VERSION + ' · ' + Object.keys(TUYEN).length + ' tuyến');
  sapXepSheet();
  ui.alert('Đã cập nhật ✅',
    'Cấu trúc và ma trận đã làm mới theo phiên bản ' + VERSION + '.\n' +
    'Tham số và dữ liệu lịch sử giữ nguyên.\n\n' +
    'Bản sao an toàn ở các sheet ẩn "' + CFG.BK_PREFIX + '...".',
    ui.ButtonSet.OK);
}

function veHeNay() {
  _ui().alert('Hệ phiếu đánh giá nhân sự TTX',
    'Phiên bản ' + VERSION + '\n' +
    'Số tuyến đang có: ' + Object.keys(TUYEN).length + '\n' +
    'Số tuyến đã đủ nội dung: ' + Object.keys(TUYEN).filter(function (t) {
      return TUYEN[t].trangThai === 'đủ'; }).length + '\n\n' +
    'File này là FILE GỐC: giữ code, tham số và ma trận của mọi tuyến.\n' +
    'Phiếu chấm của từng người xuất ra Drive thành file riêng, không chứa code.\n\n' +
    'Đọc sheet ' + CFG.SHEETS.HD + ' để biết cách dùng.',
    _ui().ButtonSet.OK);
}

/* ==================== SẮP XẾP VÀ SAO LƯU ==================== */

function sapXepSheet() {
  const ss = _ss();
  const dau = [CFG.SHEETS.HD, CFG.SHEETS.TS, BCH.SHEET, CFG.SHEETS.NS, CFG.SHEETS.DM,
               CFG.SHEETS.TB, CFG.SHEETS.CHUNG];
  let v = 1;
  dau.forEach(function (t) {
    const s = ss.getSheetByName(t);
    if (s) { ss.setActiveSheet(s); ss.moveActiveSheet(v); v++; }
  });
  Object.keys(TUYEN).forEach(function (t) {
    const s = ss.getSheetByName(CFG.MT_PREFIX + t);
    if (s) { ss.setActiveSheet(s); ss.moveActiveSheet(v); v++; }
  });
  [CFG.SHEETS.LS, CFG.SHEETS.TH, CFG.SHEETS.NK].forEach(function (t) {
    const s = ss.getSheetByName(t);
    if (s) { ss.setActiveSheet(s); ss.moveActiveSheet(v); v++; }
  });
}

function _saoLuuAnToan() {
  const ss = _ss();
  const moc = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'MMdd-HHmm');
  /* ✅ THÊM 30/8/2026: sheet Bộ câu hỏi nay là dữ liệu Sen nhập tay, và là thứ
   * quý nhất trên file gốc, nên phải nằm trong danh sách sao lưu. */
  [CFG.SHEETS.TS, CFG.SHEETS.NS, CFG.SHEETS.LS, CFG.SHEETS.TH, BCH.SHEET].forEach(function (t) {
    const s = ss.getSheetByName(t);
    if (!s) return;
    const bk = s.copyTo(ss);
    bk.setName(CFG.BK_PREFIX + moc + ' ' + t.substring(0, 18));
    bk.hideSheet();
  });
}

/* ==================== TIỆN ÍCH DÙNG CHUNG ==================== */

function _ss() { return SpreadsheetApp.getActiveSpreadsheet(); }
function _ui() { return SpreadsheetApp.getUi(); }

/** Đổi dấu phẩy sang chấm phẩy theo locale Việt Nam. Bỏ qua phẩy trong chuỗi. */
function _F(ct) {
  if (ct == null) return ct;
  let out = '', inStr = false;
  for (let i = 0; i < ct.length; i++) {
    const c = ct[i];
    if (c === '"') { inStr = !inStr; out += c; continue; }
    if (c === ',' && !inStr) { out += ';'; continue; }
    out += c;
  }
  return out;
}

function _tao(ten, ssTarget) {
  const ss = ssTarget || _ss();
  const cu = ss.getSheetByName(ten);
  return cu ? cu : ss.insertSheet(ten);
}

/** Banner dòng 1. KHÔNG merge ô: merge ngang xung đột với cố định cột. */
function _banner(sh, tieuDe, moTa, soCot) {
  sh.getRange(1,1,1,soCot).setBackground(CFG.MAU.DAM);
  sh.getRange(1,1).setValue(tieuDe + (moTa ? '  -  ' + moTa : ''))
    .setFontColor('#ffffff').setFontWeight('bold').setFontSize(11)
    .setVerticalAlignment('middle').setWrap(false);
  sh.setRowHeight(1,34);
}

/** Dòng tiêu đề một mục. Trả về dòng kế tiếp. */
function _muc(sh, r, chu, soCot) {
  sh.getRange(r,1,1,soCot).setBackground(CFG.MAU.NHAT);
  sh.getRange(r,1).setValue(chu).setFontWeight('bold').setFontColor(CFG.MAU.DAM)
    .setVerticalAlignment('middle').setWrap(false);
  sh.setRowHeight(r,26);
  return r + 1;
}

/** Dòng ghi chú nhỏ. Trả về dòng kế tiếp. */
function _note(sh, r, chu, soCot, cao) {
  sh.getRange(r,2).setValue(chu).setFontColor(CFG.MAU.CHU_GHI).setFontSize(9)
    .setWrap(true).setVerticalAlignment('top');
  sh.setRowHeight(r, cao || 50);
  return r + 1;
}

function _header(sh, dong, cots) {
  sh.getRange(dong,1,1,cots.length).setValues([cots])
    .setBackground(CFG.MAU.HEADER).setFontColor('#ffffff')
    .setFontWeight('bold').setWrap(true).setVerticalAlignment('middle');
  sh.setRowHeight(dong,38);
}

function _khung(sh, dongHeader, soDong, soCot) {
  sh.getRange(dongHeader,1,soDong+1,soCot)
    .setBorder(true,true,true,true,true,true,CFG.MAU.VIEN,SpreadsheetApp.BorderStyle.SOLID);
  sh.getRange(dongHeader,1,1,soCot)
    .setBorder(null,null,true,null,null,null,CFG.MAU.DAM,SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
}

function _dvList(range, values, allowInvalid) {
  range.setDataValidation(SpreadsheetApp.newDataValidation()
    .requireValueInList(values,true).setAllowInvalid(allowInvalid === true).build());
}

/** Named range trên bảng tính bất kỳ, ghi đè nếu trùng tên. */
function _nr(ten, range, ssTarget) {
  const ss = ssTarget || _ss();
  ss.getNamedRanges().filter(function (n) { return n.getName() === ten; })
    .forEach(function (n) { n.remove(); });
  ss.setNamedRange(ten, range);
}

function _pct(range) { range.setNumberFormat('0%'); }

function _cfDo(sh, rangeA1, congThuc) {
  const rules = sh.getConditionalFormatRules();
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied(_F(congThuc))
    .setBackground(CFG.MAU.CANH_BAO)
    .setRanges([sh.getRange(rangeA1)]).build());
  sh.setConditionalFormatRules(rules);
}

/** Ô nhập tay: nền vàng, có viền. */
function _oNhap(range) {
  return range.setBackground(CFG.MAU.INPUT)
    .setBorder(true,true,true,true,true,true,CFG.MAU.VIEN,SpreadsheetApp.BorderStyle.SOLID);
}

/**
 * Cố định n cột đầu, an toàn với ô gộp.
 *
 * Google Sheets từ chối cố định cột nếu có ô gộp VẮT QUA ranh giới, tức bắt đầu
 * trong vùng cố định và kết thúc ngoài vùng đó. Hàm này tách rời đúng những ô
 * gộp phạm lỗi rồi mới cố định, nên không bao giờ ném lỗi.
 *
 * Lỗi này đã xảy ra hai lần nên dùng hàm này thay cho setFrozenColumns trực tiếp.
 */
function _coDinhCot(sh, n) {
  try {
    sh.getRange(1,1,sh.getMaxRows(),sh.getMaxColumns()).getMergedRanges()
      .forEach(function (rg) {
        const c1 = rg.getColumn(), c2 = c1 + rg.getNumColumns() - 1;
        if (c1 <= n && c2 > n) rg.breakApart();      // vắt qua ranh giới
      });
  } catch (e) {}
  sh.setFrozenColumns(n);
}
