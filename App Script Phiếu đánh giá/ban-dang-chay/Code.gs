/**
 * HỆ THỐNG ĐÁNH GIÁ NHÂN SỰ — Nhà Của Thời Thanh Xuân
 * Máy chủ Google Apps Script.
 *
 * Việc của tệp này:
 *   1. Phục vụ trang app cho mọi người.
 *   2. Kiểm tra mã nhân sự và mật khẩu Ở MÁY CHỦ, không phải trên trình duyệt.
 *   3. Giữ MỘT bản dữ liệu dùng chung cho cả nhà, thay cho việc mỗi máy một bản.
 *   4. Ghi bằng chứng vào cột H của phiếu đánh giá.
 *
 * ⚠️ Tệp này phải nằm trong một DỰ ÁN APPS SCRIPT RIÊNG, tạo từ
 * script.google.com — KHÔNG dán vào dự án gắn với bảng Phiếu đánh giá.
 * Bảng đó do người khác viết và bảo trì; trộn hai bộ code vào một chỗ là
 * hai người sẽ đè lên nhau. Code ở đây chỉ dùng openById nên nó mở và ghi
 * được vào bảng của người ta mà không cần nằm bên trong bảng ấy. Việc duy
 * nhất cần là tài khoản chạy script có quyền chỉnh sửa các tệp liên quan.
 *
 * Cài đặt: xem sổ tay cài đặt. Sau khi dán code, chạy `caiDatLanDau` một lần.
 */

// ─────────────────────────────────────────────────────────────
// THAM SỐ CÀI ĐẶT
// ─────────────────────────────────────────────────────────────

/**
 * Mỗi nhân sự một phiếu riêng, mỗi đợt một thư mục.
 * ID_THU_MUC_DOT: thư mục chứa các phiếu của đợt đang chấm.
 *   Lấy từ đường dẫn thư mục trên Drive, đoạn sau /folders/.
 *   Để trống thì script dùng thư mục đang chứa bảng gốc ID_PHIEU_GOC.
 */
var ID_THU_MUC_DOT = '';

/**
 * Thư mục RIÊNG của app trên Drive: chứa tệp dữ liệu, ảnh biên bản, bản sao
 * lưu và file tháng xuất ra. Nên là một thư mục mới, của app, để không lẫn
 * vào thư mục của bên Nhân sự.
 * Lấy đoạn sau /folders/ trên đường dẫn thư mục.
 * Để trống thì script dùng thư mục đang chứa ID_PHIEU_GOC như trước.
 */
var ID_THU_MUC_APP = '';

/**
 * Bảng Phiếu đánh giá gốc. App chỉ ĐỌC tên nó để anh biết đã nối đúng bảng,
 * và bỏ qua nó khi quét thư mục đợt. App không ghi gì vào bảng này và không
 * cần đụng tới Apps Script của nó.
 */
var ID_PHIEU_GOC = '1fltQsP1kdtMJJ3xVkxrlLhuWJTHk3UMHCehpU3D97qM';

/** Nhãn đứng trước ô chứa mã nhân sự trong khối thông tin của phiếu. */
var NHAN_MA_NHAN_SU = 'Mã nhân sự';

/** Quét tối đa bao nhiêu cột và dòng đầu phiếu để tìm mã nhân sự. */
var QUET_DONG = 30;
var QUET_COT = 6;

/** Tên tệp dữ liệu trên Drive. Tệp này do script tự tạo, đừng sửa tay. */
var TEN_TEP_DU_LIEU = 'DuLieu_DanhGiaNhanSu.json';

/** File People Management — nguồn danh sách nhân sự chính thức. */
var ID_PEOPLE = '1Ruf3EeXiaiV0Jifnewe-HefXW4ncZHJvlItuoti4vus';
var SHEET_NHAN_SU = '👥 Nhân sự';

/** Mật khẩu tạm cấp cho người mới đồng bộ vào. */
var MAT_KHAU_TAM = '123456';

/** Tên thư mục chứa ảnh kèm biên bản. Script tự tạo nếu chưa có. */
var TEN_THU_MUC_ANH = 'Anh_BienBan_DanhGiaNhanSu';

/** Cột chứa mã câu và cột chứa bằng chứng trong phiếu. */
var COT_MA = 1;          // cột A
var COT_BANG_CHUNG = 8;  // cột H

/** Phiên đăng nhập sống bao lâu, tính bằng giây. Mặc định 12 tiếng. */
var HAN_PHIEN = 12 * 60 * 60;


// ─────────────────────────────────────────────────────────────
// PHỤC VỤ TRANG
// ─────────────────────────────────────────────────────────────

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Thông tin đánh giá nhân sự')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}


// ─────────────────────────────────────────────────────────────
// KHO DỮ LIỆU — một tệp JSON trên Drive, dùng chung cho cả nhà
// ─────────────────────────────────────────────────────────────

function _thuMucGoc_() {
  if (ID_THU_MUC_APP) {
    try { return DriveApp.getFolderById(ID_THU_MUC_APP); } catch (e) {}
  }
  try {
    var f = SpreadsheetApp.openById(ID_PHIEU_GOC);
    var parents = DriveApp.getFileById(f.getId()).getParents();
    if (parents.hasNext()) return parents.next();
  } catch (e) {}
  return DriveApp.getRootFolder();
}

function _tepDuLieu_() {
  var it = DriveApp.getFilesByName(TEN_TEP_DU_LIEU);
  while (it.hasNext()) {
    var f = it.next();
    if (!f.isTrashed()) return f;
  }
  return null;
}

function _docDB_() {
  var f = _tepDuLieu_();
  if (!f) return null;
  try {
    return JSON.parse(f.getBlob().getDataAsString('UTF-8'));
  } catch (e) {
    throw new Error('Tệp dữ liệu hỏng: ' + e.message);
  }
}

function _ghiDB_(db) {
  var noiDung = JSON.stringify(db);
  var f = _tepDuLieu_();
  if (f) {
    f.setContent(noiDung);
  } else {
    _thuMucGoc_().createFile(TEN_TEP_DU_LIEU, noiDung, 'application/json');
  }
  return true;
}


// ─────────────────────────────────────────────────────────────
// MẬT KHẨU — băm và so khớp ở máy chủ
// ─────────────────────────────────────────────────────────────

/** Băm giống hệt bản chạy trên trình duyệt, để mật khẩu cũ vẫn dùng được. */
function _bam_(matKhau, muoi) {
  var raw = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    muoi + '::' + matKhau,
    Utilities.Charset.UTF_8
  );
  var hex = raw.map(function (b) {
    return ('0' + (b & 0xff).toString(16)).slice(-2);
  }).join('');
  return 's256:' + hex;
}

function _muoiMoi_() {
  return Utilities.getUuid().replace(/-/g, '').slice(0, 22);
}


// ─────────────────────────────────────────────────────────────
// PHIÊN ĐĂNG NHẬP
// ─────────────────────────────────────────────────────────────

function _capPhien_(userId) {
  var token = Utilities.getUuid();
  CacheService.getScriptCache().put('phien_' + token, userId, HAN_PHIEN);
  return token;
}

function _nguoiCuaPhien_(token) {
  if (!token) return null;
  var id = CacheService.getScriptCache().get('phien_' + token);
  if (!id) return null;
  var db = _docDB_();
  if (!db) return null;
  for (var i = 0; i < db.users.length; i++) {
    if (db.users[i].id === id && db.users[i].active !== false) return db.users[i];
  }
  return null;
}

function _batBuocDangNhap_(token) {
  var u = _nguoiCuaPhien_(token);
  if (!u) throw new Error('Phiên đã hết hạn. Đăng nhập lại giúp em.');
  return u;
}

/* ═══════════════════════════════════════════════════════════════════════════
   PHÂN QUYỀN Ở MÁY CHỦ

   Ẩn nút trên màn hình KHÔNG phải là chặn. Ai mở Console trình duyệt cũng gọi
   thẳng được google.script.run.<tên hàm>. Nên mỗi hàm có sức nặng phải tự kiểm
   vai NGAY TẠI ĐÂY, không dựa vào giao diện.
   ═══════════════════════════════════════════════════════════════════════════ */

/** Tài khoản quản trị hệ thống. */
function _laAdmin_(u) { return !!u && u.role === 'admin'; }

/** Trưởng phòng hoặc quản lý của phòng Nhân sự. Khớp hrHeads() bên trình duyệt. */
function _laHR_(u) {
  if (!u) return false;
  if (_laAdmin_(u)) return true;
  var db = _docDB_();
  if (!db) return false;
  var dp = null;
  (db.depts || []).forEach(function (d) {
    if (!dp && /nh[âa]n s[ựu]/i.test(String(d.name || ''))) dp = d;
  });
  if (!dp) return false;
  return u.deptId === dp.id && (u.role === 'manager' || u.role === 'admin');
}

/** Ban lãnh đạo: từ bậc 7 trở lên, tức Founder và C-Level. */
function _laBanLanhDao_(u) { return _bacCapCua_(u) >= 7; }

/** Người được xuất kết quả cuối tháng: HR, admin và Ban lãnh đạo. */
function _duocXuat_(u) { return _laHR_(u) || _laAdmin_(u) || _laBanLanhDao_(u); }

/**
 * Bắt buộc đăng nhập RỒI kiểm vai. Không đủ quyền thì ném lỗi nói rõ
 * cần vai gì — người dùng biết phải nhờ ai, không phải đoán.
 */
function _batBuocVai_(token, vai) {
  var u = _batBuocDangNhap_(token);
  var duoc = {
    admin:   _laAdmin_,
    hr:      _laHR_,
    xuat:    _duocXuat_,
    quanLy:  function (x) { return x.role === 'manager' || x.role === 'admin'; },
    aiCung:  function () { return true; }
  }[vai];
  if (!duoc) throw new Error('Vai không hợp lệ: ' + vai);
  if (!duoc(u)) {
    var ten = {
      admin:  'quản trị hệ thống',
      hr:     'phòng Nhân sự',
      xuat:   'phòng Nhân sự, Ban lãnh đạo hoặc quản trị hệ thống',
      quanLy: 'cấp quản lý'
    }[vai] || vai;
    throw new Error('Việc này chỉ ' + ten + ' làm được. ' +
                    'Tài khoản ' + (u.code || u.name) + ' không đủ quyền.');
  }
  return u;
}

/** Gỡ mọi thứ bí mật trước khi gửi xuống trình duyệt. */
function _sach_(db) {
  var ban = JSON.parse(JSON.stringify(db));
  ban.users = ban.users.map(function (u) {
    delete u.pwHash;
    delete u.pwHashAlt;
    delete u.pwSalt;
    return u;
  });
  return ban;
}


// ─────────────────────────────────────────────────────────────
// HÀM CHO TRÌNH DUYỆT GỌI
// ─────────────────────────────────────────────────────────────

/** Đăng nhập. Trả về phiên và toàn bộ dữ liệu đã gỡ mật khẩu. */
function dangNhap(ma, matKhau) {
  var db = _docDB_();
  if (!db) throw new Error('Chưa có dữ liệu. Nhờ admin chạy caiDatLanDau.');
  var m = String(ma || '').trim().toUpperCase();
  var u = null;
  for (var i = 0; i < db.users.length; i++) {
    if (String(db.users[i].code).toUpperCase() === m) { u = db.users[i]; break; }
  }
  // Cùng một câu trả lời cho sai mã và sai mật khẩu, để không lộ mã nào có thật.
  var sai = { ok: false, loi: 'Mã hoặc mật khẩu không đúng.' };
  if (!u) return sai;
  if (u.active === false) return { ok: false, loi: 'Tài khoản đã bị khoá. Liên hệ quản lý.' };
  if (!u.pwSalt || !u.pwHash) return sai;
  if (_bam_(matKhau, u.pwSalt) !== u.pwHash) return sai;

  return { ok: true, token: _capPhien_(u.id), meId: u.id, db: _sach_(db) };
}

/** Khôi phục phiên còn hạn sau khi tải lại trang. */
function khoiPhucPhien(token) {
  var u = _nguoiCuaPhien_(token);
  if (!u) return { ok: false };
  return { ok: true, meId: u.id, db: _sach_(_docDB_()) };
}

/** Tải lại dữ liệu mới nhất. */
function taiDuLieu(token) {
  _batBuocVai_(token, 'aiCung');
  return _sach_(_docDB_());
}

/**
 * Lưu dữ liệu. Giữ nguyên phần mật khẩu ở máy chủ vì trình duyệt không có.
 * Dùng khoá để hai người lưu cùng lúc không ghi đè nhau.
 */
function luuDuLieu(token, dbMoi) {
  var me = _batBuocVai_(token, 'aiCung');
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) throw new Error('Có người đang lưu, thử lại sau vài giây.');
  try {
    var cu = _docDB_() || { users: [] };
    var bimat = {};
    cu.users.forEach(function (u) {
      bimat[u.id] = { pwHash: u.pwHash, pwHashAlt: u.pwHashAlt, pwSalt: u.pwSalt, mustChange: u.mustChange };
    });
    dbMoi.users.forEach(function (u) {
      var b = bimat[u.id];
      if (b) {
        u.pwHash = b.pwHash; u.pwHashAlt = b.pwHashAlt; u.pwSalt = b.pwSalt;
        if (u.mustChange === undefined) u.mustChange = b.mustChange;
      }
    });
    // Người gọi không phải quản trị thì CHỈ giữ lại những thay đổi họ được phép.
    // Cả kho dữ liệu đi lên mỗi lần lưu, nên không lọc là ai cũng sửa được điểm
    // của mình, xoá biên bản của mình, hay tự nâng vai thành quản trị.
    var sach = _laAdmin_(me) ? dbMoi : _locThayDoi_(cu, dbMoi, me);
    _ghiDB_(sach);
    return { ok: true, luuLuc: new Date().toISOString() };
  } finally {
    lock.releaseLock();
  }
}

/** Đổi mật khẩu của chính mình. */
function doiMatKhau(token, matKhauCu, matKhauMoi) {
  var me = _batBuocVai_(token, 'aiCung');
  if (String(matKhauMoi || '').length < 6) return { ok: false, loi: 'Mật khẩu tối thiểu 6 ký tự.' };
  if (!me.mustChange && _bam_(matKhauCu, me.pwSalt) !== me.pwHash)
    return { ok: false, loi: 'Mật khẩu hiện tại không đúng.' };
  return _datMatKhau_(me.id, matKhauMoi, false);
}

/** Quản lý hoặc admin đặt lại mật khẩu cho người khác. */
function datLaiMatKhau(token, userId, matKhauTam) {
  var me = _batBuocVai_(token, 'admin');
  var db = _docDB_();
  var dich = db.users.filter(function (u) { return u.id === userId; })[0];
  if (!dich) return { ok: false, loi: 'Không tìm thấy nhân sự.' };

  var laAdmin = me.role === 'admin';
  var cungTam = me.role === 'manager' && dich.role === 'staff' &&
    ((me.siteId && dich.siteId === me.siteId) || (me.deptId && dich.deptId === me.deptId));
  if (!laAdmin && !cungTam) return { ok: false, loi: 'Bạn không có quyền đặt lại mật khẩu cho người này.' };
  if (String(matKhauTam || '').length < 6) return { ok: false, loi: 'Mật khẩu tối thiểu 6 ký tự.' };

  return _datMatKhau_(userId, matKhauTam, true);
}

function _datMatKhau_(userId, matKhau, batDoi) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) throw new Error('Có người đang lưu, thử lại sau vài giây.');
  try {
    var db = _docDB_();
    for (var i = 0; i < db.users.length; i++) {
      if (db.users[i].id === userId) {
        var muoi = _muoiMoi_();
        db.users[i].pwSalt = muoi;
        db.users[i].pwHash = _bam_(matKhau, muoi);
        delete db.users[i].pwHashAlt;
        db.users[i].mustChange = !!batDoi;
        db.users[i].pwSetAt = new Date().toISOString();
        _ghiDB_(db);
        return { ok: true };
      }
    }
    return { ok: false, loi: 'Không tìm thấy nhân sự.' };
  } finally {
    lock.releaseLock();
  }
}


// ─────────────────────────────────────────────────────────────
// ẢNH KÈM BIÊN BẢN — lưu trên Drive, không nhét vào dữ liệu
// ─────────────────────────────────────────────────────────────

function _thuMucAnh_() {
  var it = DriveApp.getFoldersByName(TEN_THU_MUC_ANH);
  while (it.hasNext()) {
    var f = it.next();
    if (!f.isTrashed()) return f;
  }
  return _thuMucGoc_().createFolder(TEN_THU_MUC_ANH);
}

/** Nhận ảnh dạng base64 từ trình duyệt, cất lên Drive, trả về đường dẫn xem. */
function luuAnh(token, tenTep, base64, kieu) {
  _batBuocVai_(token, 'aiCung');
  var blob = Utilities.newBlob(
    Utilities.base64Decode(base64), kieu || 'image/jpeg', tenTep || 'anh.jpg');
  var f = _thuMucAnh_().createFile(blob);
  f.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return {
    ok: true,
    id: f.getId(),
    url: 'https://drive.google.com/uc?export=view&id=' + f.getId(),
    ten: f.getName()
  };
}


// ─────────────────────────────────────────────────────────────
// GHI BẰNG CHỨNG VÀO CỘT H CỦA PHIẾU
// ─────────────────────────────────────────────────────────────

function _dinhDangGio_(iso) {
  if (!iso) return '';
  var d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return Utilities.formatDate(d, Session.getScriptTimeZone(), "HH:mm 'ngày' dd/MM/yyyy");
}

/** Gom sự việc đã duyệt của một người trong một kỳ, theo mã câu. */
function _gomBangChung_(db, userId, ky) {
  var ten = {};
  db.users.forEach(function (u) { ten[u.id] = u.name; });

  // Người lập là tài khoản thử thì bản ghi chỉ dùng để tập, không vào phiếu.
  var laThu = {};
  (db.users || []).forEach(function (u) { if (u.demo) laThu[u.id] = true; });
  var choNguoiThu = laThu[userId];

  var theoMa = {};
  (db.records || []).forEach(function (r) {
    if (r.subjectId !== userId) return;
    if (r.status !== 'approved') return;
    if (!choNguoiThu && laThu[r.reporterId]) return;
    if (ky && r.period !== ky) return;
    var ma = r.critCode || '';
    if (!ma) return;
    var dau = r.isBoundary ? 'RANH GIỚI' : (r.type === 'vi_pham' ? 'Vi phạm' : 'Ghi nhận');
    var gio = _dinhDangGio_(r.xayRaLuc || r.createdAt);
    var anh = (r.anh || []).length ? ' [' + r.anh.length + ' ảnh]' : '';
    var dong = dau + ' · ' + gio + ' · ' + r.detail + ' (' + (ten[r.reporterId] || '?') + ' lập)' + anh;
    if (!theoMa[ma]) theoMa[ma] = [];
    theoMa[ma].push({ luc: r.xayRaLuc || r.createdAt, dong: dong });
  });

  var ket = {};
  Object.keys(theoMa).forEach(function (ma) {
    theoMa[ma].sort(function (a, b) { return String(a.luc).localeCompare(String(b.luc)); });
    ket[ma] = theoMa[ma].map(function (x) { return x.dong; }).join('\n');
  });
  return ket;
}

/** Thư mục chứa phiếu của đợt đang chấm. */
function _thuMucDot_() {
  if (ID_THU_MUC_DOT) return DriveApp.getFolderById(ID_THU_MUC_DOT);
  return _thuMucGoc_();
}

/**
 * ĐỌC PHIẾU THEO NỘI DUNG, KHÔNG THEO TOẠ ĐỘ
 *
 * Mẫu phiếu sẽ còn đổi: thêm câu, bỏ câu, chèn dòng vào khối thông tin,
 * chèn cột, đổi thứ tự nhóm. Nếu code nhớ "cột H dòng 185" thì mỗi lần
 * mẫu đổi là ghi sai chỗ mà không ai biết.
 *
 * Nên ở đây không có một số dòng hay số cột cố định nào:
 *   Khối thông tin → tìm ô chứa nhãn, ghi vào ô liền bên phải nhãn đó.
 *   Bảng chấm      → nhận ra hàng tiêu đề vì nó có cả cột Mã lẫn cột
 *                    Bằng chứng, rồi đọc số cột theo TÊN cột.
 *   Mã câu → dòng  → quét cột Mã của từng bảng.
 *
 * Mã câu nào không còn trong phiếu thì báo là không tìm thấy, chứ không
 * đoán sang dòng bên cạnh.
 */

/** Tên có thể có của từng cột trong bảng chấm. */
var TEN_COT_PHIEU = {
  ma:        ['ma'],
  cau:       ['cauhoi', 'tieuchivacauhoi', 'nhomtieuchivacauhoi', 'noidung'],
  phamVi:    ['thuocphamvi', 'phamvi'],
  tuCham:    ['tucham'],
  nguoiCham: ['nguoicham'],
  soBienBan: ['sobienban'],
  diem:      ['diem'],
  suViec:    ['suviec'],
  bac:       ['bac'],
  bangChung: ['bangchung', 'minhchung', 'chungcu']
};

/* Vai nào khớp kiểu CHỨA, vai nào phải khớp TỪ ĐẦU.
   Tên ngắn như 'ma' hay 'bac' mà khớp kiểu chứa là đụng ngay 'Phạm vi',
   nên chỉ nới cho mấy tên đủ dài để không nhầm được với cột khác. */
var COT_KHOP_CHUA = { cau: true, nguoiCham: true, bangChung: true,
                      soBienBan: true, suViec: true };

/** Mã câu có dạng CHỮ + SỐ, có thể kèm .SỐ — ví dụ VH1.1, B3.2, QG1. */
var DANG_MA_CAU = /^[A-Za-z]{1,4}\d+(\.\d+)?$/;

/** Một hàng có phải hàng tiêu đề của bảng chấm không. Có thì trả về số cột. */
function _hangTieuDePhieu_(hang) {
  var cot = {};
  for (var c = 0; c < hang.length; c++) {
    var k = _chuan_(hang[c]);
    if (!k) continue;
    for (var vai in TEN_COT_PHIEU) {
      if (cot.hasOwnProperty(vai)) continue;
      var ds = TEN_COT_PHIEU[vai];
      for (var j = 0; j < ds.length; j++) {
        var vt = k.indexOf(ds[j]);
        if (COT_KHOP_CHUA[vai] ? vt >= 0 : vt === 0) { cot[vai] = c + 1; break; }
      }
      if (cot.hasOwnProperty(vai)) break;
    }
  }
  // Phải có cột Mã, cộng thêm một chỗ để ghi sự việc — phiếu đời cũ gọi là
  // "Bằng chứng", phiếu đời mới gọi là "Sự việc". Nhận cả hai.
  return (cot.ma && (cot.bangChung || cot.suViec)) ? cot : null;
}

/** Dò mọi bảng chấm trong một sheet đã đọc ra mảng. */
function _doBangPhieu_(o) {
  var bang = [];
  for (var r = 0; r < o.length; r++) {
    var cot = _hangTieuDePhieu_(o[r]);
    if (cot) bang.push({ dongTieuDe: r + 1, cot: cot });
  }
  return bang;
}

/** Dò mã câu trong từng bảng. Trả về { 'VH1.1': {dong: 40, cot: {...}} }. */
function _doMaCauPhieu_(o, bang) {
  var banDo = {};
  for (var i = 0; i < bang.length; i++) {
    var dau = bang[i].dongTieuDe;                                    // bỏ hàng tiêu đề
    var cuoi = (i + 1 < bang.length) ? bang[i + 1].dongTieuDe - 1 : o.length;
    var cotMa = bang[i].cot.ma - 1;
    for (var r = dau; r < cuoi; r++) {
      var v = o[r][cotMa];
      if (typeof v !== 'string') continue;
      var ma = v.trim();
      if (!DANG_MA_CAU.test(ma) || banDo.hasOwnProperty(ma)) continue;
      banDo[ma] = { dong: r + 1, cot: bang[i].cot };
    }
  }
  return banDo;
}

/** Bản đồ khối thông tin: nhãn đã bỏ dấu → ô liền bên phải để ghi giá trị. */
function _doKhoiThongTin_(o, quetDong, quetCot) {
  var banDo = {};
  var het = Math.min(o.length, quetDong || 60);
  for (var r = 0; r < het; r++) {
    var soCot = Math.min(o[r].length, quetCot || 6);
    for (var c = 0; c < soCot; c++) {
      var k = _chuan_(o[r][c]);
      if (!k || banDo.hasOwnProperty(k)) continue;
      banDo[k] = { dong: r + 1, cot: c + 2 };
    }
  }
  return banDo;
}

/** Tìm ô để ghi theo nhãn. Không thấy thì trả null, không đoán. */
function _oCuaNhan_(banDo, nhan) {
  var k = _chuan_(nhan);
  if (banDo.hasOwnProperty(k)) return banDo[k];
  for (var key in banDo) if (key.indexOf(k) === 0) return banDo[key];
  return null;
}

/**
 * Đọc mã nhân sự ghi trong khối thông tin của một phiếu.
 * Nhận diện theo NỘI DUNG chứ không theo tên tệp, nên đổi tên tệp vẫn chạy.
 */
function _maNhanSuTrongPhieu_(sh) {
  if (sh.getLastRow() < 1 || sh.getLastColumn() < 2) return '';
  var soDong = Math.min(QUET_DONG, sh.getLastRow());
  var soCot = Math.min(Math.max(QUET_COT, 4), sh.getLastColumn());
  var o = sh.getRange(1, 1, soDong, soCot).getValues();
  var banDo = _doKhoiThongTin_(o, soDong, soCot);
  var oGhi = _oCuaNhan_(banDo, NHAN_MA_NHAN_SU);
  if (!oGhi) return '';
  for (var c = oGhi.cot; c <= soCot; c++) {
    var v = String(o[oGhi.dong - 1][c - 1] || '').trim();
    if (v) return v.toUpperCase();
  }
  return '';
}

/**
 * Soi một phiếu và báo cấu trúc đọc được, KHÔNG ghi gì.
 * Chạy cái này trước khi ghi để biết mẫu mới có còn đọc được không.
 */
function _soiSheet_(sh) {
  if (sh.getLastRow() < 2 || sh.getLastColumn() < 2) return null;
  var o = sh.getRange(1, 1, sh.getLastRow(), sh.getLastColumn()).getValues();
  var bang = _doBangPhieu_(o);
  if (!bang.length) return null;
  return {
    sheet: sh.getName(),
    soBang: bang.length,
    soMaCau: Object.keys(_doMaCauPhieu_(o, bang)).length,
    cot: bang.map(function (b) { return b.cot; })
  };
}

function soiPhieu(token, idPhieu) {
  // ⛔ NGỪNG DÙNG từ 01/09/2026. App chỉ ĐỌC file gốc, không ghi vào
  // file của phòng Nhân sự. Giữ hàm lại để lời gọi cũ có câu trả lời rõ.
  return { ok: false, ngungDung: true, loi: 'App không đọc phiếu từng người nữa. Bộ câu lấy thẳng từ file gốc.' };

  _batBuocVai_(token, 'xuat');
  var ss;
  try { ss = SpreadsheetApp.openById(_layId_(idPhieu)); }
  catch (e) { return { ok: false, loi: 'Không mở được phiếu. Kiểm tra đường dẫn và quyền.' }; }
  var ds = [];
  ss.getSheets().forEach(function (sh) {
    var t = _soiSheet_(sh);
    if (t) ds.push(t);
  });
  return {
    ok: true, file: ss.getName(), ma: _maNhanSuTrongPhieu_(ss.getSheets()[0]),
    bang: ds,
    canhBao: ds.length ? '' : 'Không nhận ra bảng chấm nào. Phiếu phải có hàng tiêu đề chứa cả cột Mã lẫn cột Bằng chứng.'
  };
}

/**
 * Ghi bằng chứng vào MỘT sheet. Dò cột theo tiêu đề, không dùng cột cố định.
 * Trả về { daGhi: số dòng đã điền, thieu: [mã câu không tìm thấy] }.
 */
function _ghiVaoSheet_(sh, bc) {
  var ket = { daGhi: 0, thieu: [] };
  if (sh.getLastRow() < 2 || sh.getLastColumn() < 2) return ket;

  var o = sh.getRange(1, 1, sh.getLastRow(), sh.getLastColumn()).getValues();
  var bang = _doBangPhieu_(o);
  if (!bang.length) return ket;
  var banDo = _doMaCauPhieu_(o, bang);

  // Gom theo cột để ghi một lần mỗi cột, đỡ tốn lượt gọi.
  var theoCot = {};
  for (var ma in bc) {
    if (!banDo.hasOwnProperty(ma)) { ket.thieu.push(ma); continue; }
    var cot = banDo[ma].cot.bangChung || banDo[ma].cot.suViec;
    if (!cot) { ket.thieu.push(ma); continue; }
    if (!theoCot[cot]) theoCot[cot] = [];
    theoCot[cot].push({ dong: banDo[ma].dong, noiDung: bc[ma] });
  }

  for (var c in theoCot) {
    var soCot = Number(c);
    var giaTri = sh.getRange(1, soCot, o.length, 1).getValues();
    theoCot[c].forEach(function (x) {
      giaTri[x.dong - 1][0] = x.noiDung;
      ket.daGhi++;
    });
    sh.getRange(1, soCot, o.length, 1).setValues(giaTri).setWrap(true);
  }
  return ket;
}

/** Ghi bằng chứng vào MỌI sheet của một bảng tính phiếu. */
function _ghiVaoPhieu_(ss, bc) {
  var tong = 0, thieu = null;
  ss.getSheets().forEach(function (sh) {
    var k = _ghiVaoSheet_(sh, bc);
    tong += k.daGhi;
    // Mã thiếu chỉ đáng báo khi KHÔNG sheet nào ghi được nó.
    if (thieu === null) thieu = k.thieu.slice();
    else thieu = thieu.filter(function (m) { return k.thieu.indexOf(m) >= 0; });
  });
  return { daGhi: tong, thieu: thieu || [] };
}

/**
 * Ghi bằng chứng cho MỘT người vào MỘT phiếu chỉ định.
 * Dùng khi admin dán thẳng đường dẫn phiếu của người đó.
 */
function ghiBangChungMotPhieu(token, userId, ky, idPhieu) {
  // ⛔ NGỪNG DÙNG từ 01/09/2026. App chỉ ĐỌC file gốc, không ghi vào
  // file của phòng Nhân sự. Giữ hàm lại để lời gọi cũ có câu trả lời rõ.
  return { ok: false, ngungDung: true, loi: 'App không ghi vào phiếu của phòng Nhân sự. Dùng Xuất Google Sheet rồi dán sang.' };

  _batBuocVai_(token, 'xuat');
  var db = _docDB_();
  var bc = _gomBangChung_(db, userId, ky);
  if (!Object.keys(bc).length)
    return { ok: true, soDong: 0, thongBao: 'Kỳ này chưa có sự việc nào đã duyệt.' };
  var ss;
  try { ss = SpreadsheetApp.openById(_layId_(idPhieu)); }
  catch (e) { return { ok: false, loi: 'Không mở được phiếu. Kiểm tra đường dẫn.' }; }
  var k = _ghiVaoPhieu_(ss, bc);
  return {
    ok: true, soDong: k.daGhi, thieu: k.thieu,
    thongBao: 'Đã ghi ' + k.daGhi + ' dòng vào phiếu ' + ss.getName() + '.' +
      (k.thieu.length ? ' Không tìm thấy mã câu trong phiếu: ' + k.thieu.join(', ') +
                        '. Mẫu phiếu có thể đã bỏ những câu này.' : '')
  };
}

/** Nhận cả đường dẫn đầy đủ lẫn ID trần. */
function _layId_(s) {
  s = String(s || '').trim();
  var m = s.match(/\/d\/([a-zA-Z0-9_-]{20,})/);
  if (m) return m[1];
  m = s.match(/[-\w]{25,}/);
  return m ? m[0] : s;
}

/**
 * Ghi bằng chứng cho CẢ ĐỢT: quét mọi bảng tính trong thư mục đợt,
 * đọc mã nhân sự trong từng phiếu rồi điền đúng bằng chứng của người đó.
 * Đây là cách dùng chính khi mỗi bạn một file.
 *
 * MỘT script cho MỌI phiếu. File phiếu không chứa code — script này mở
 * lần lượt từng phiếu bằng openById. Ba mươi người hay ba trăm người
 * cũng chỉ một bản code duy nhất ở đây.
 *
 * Apps Script chỉ cho chạy 6 phút một lượt (30 phút với Workspace), mà
 * mở và ghi mỗi phiếu mất một vài giây. Nên hàm này làm tới đâu NHỚ tới
 * đó, hết giờ thì tự hẹn chạy tiếp sau một phút. Anh bấm một lần rồi thôi.
 */

var KHOA_TIEN_DO = 'tienDo_ghiBangChung';
var TEN_HAM_TIEP = 'chayTiepGhiBangChung';
var GIAY_MOI_LUOT = 4 * 60 * 1000;   // dừng ở phút thứ 4 cho an toàn

function _docTienDo_() {
  var t = PropertiesService.getScriptProperties().getProperty(KHOA_TIEN_DO);
  if (!t) return null;
  try { return JSON.parse(t); } catch (e) { return null; }
}

function _ghiTienDo_(td) {
  PropertiesService.getScriptProperties()
    .setProperty(KHOA_TIEN_DO, JSON.stringify(td));
}

function _xoaTienDo_() {
  PropertiesService.getScriptProperties().deleteProperty(KHOA_TIEN_DO);
  _xoaHenGio_();
}

function _xoaHenGio_() {
  ScriptApp.getProjectTriggers().forEach(function (tg) {
    if (tg.getHandlerFunction() === TEN_HAM_TIEP) ScriptApp.deleteTrigger(tg);
  });
}

function _henChayTiep_() {
  _xoaHenGio_();
  ScriptApp.newTrigger(TEN_HAM_TIEP).timeBased().after(60 * 1000).create();
}

/** Máy chủ tự gọi khi còn phiếu chưa làm. Không ai bấm hàm này bằng tay. */
function chayTiepGhiBangChung() {
  var td = _docTienDo_();
  if (!td) { _xoaHenGio_(); return; }
  _chayMotLuot_(td);
}

/** Làm một lượt cho tới khi hết giờ. Trả về tiến độ sau lượt đó. */
function _chayMotLuot_(td) {
  var db = _docDB_();
  var theoMa = {};
  db.users.forEach(function (u) {
    var bc = _gomBangChung_(db, u.id, td.ky);
    if (Object.keys(bc).length) theoMa[String(u.code).toUpperCase()] = { bc: bc, ten: u.name };
  });

  var tm = td.idThuMuc ? DriveApp.getFolderById(td.idThuMuc) : _thuMucDot_();
  var it = tm.getFilesByType(MimeType.GOOGLE_SHEETS);
  var xong = {};
  (td.daLam || []).forEach(function (id) { xong[id] = true; });

  var batDau = new Date().getTime();
  var hetGio = false;
  // Mỗi lượt phải xong ít nhất MỘT phiếu, kẻo ngưỡng đặt sai là đứng im mãi.
  var xongTrongLuot = 0;

  while (it.hasNext()) {
    var f = it.next();
    if (f.isTrashed() || xong[f.getId()] || f.getId() === ID_PHIEU_GOC) continue;
    if (xongTrongLuot > 0 && new Date().getTime() - batDau > GIAY_MOI_LUOT) { hetGio = true; break; }

    try {
      var ss = SpreadsheetApp.openById(f.getId());
      var ma = _maNhanSuTrongPhieu_(ss.getSheets()[0]);
      if (!ma) {
        td.boQua.push(f.getName() + ' — không đọc được mã nhân sự');
      } else if (!theoMa[ma]) {
        td.boQua.push(f.getName() + ' — ' + ma + ' không có sự việc nào trong kỳ');
      } else {
        var k = _ghiVaoPhieu_(ss, theoMa[ma].bc);
        td.tongDong += k.daGhi;
        td.soPhieu += 1;
        td.chiTiet.push({ ten: f.getName(), ma: ma, nguoi: theoMa[ma].ten, soDong: k.daGhi });
        if (k.thieu.length)
          td.boQua.push(f.getName() + ' — mã câu không có trong phiếu: ' + k.thieu.join(', '));
      }
    } catch (e) {
      td.loi.push(f.getName() + ' — ' + e.message);
    }
    td.daLam.push(f.getId());
    xongTrongLuot++;
  }

  td.xong = !hetGio;
  if (hetGio) { _ghiTienDo_(td); _henChayTiep_(); }
  else { _xoaTienDo_(); }
  return td;
}

function ghiBangChungCaDot(token, ky, idThuMuc, chayTiep) {
  // ⛔ NGỪNG DÙNG từ 01/09/2026. App chỉ ĐỌC file gốc, không ghi vào
  // file của phòng Nhân sự. Giữ hàm lại để lời gọi cũ có câu trả lời rõ.
  return { ok: false, ngungDung: true, loi: 'App không ghi vào phiếu của phòng Nhân sự. Dùng Xuất Google Sheet rồi dán sang.' };

  _batBuocVai_(token, 'xuat');

  // Đang dở dang thì làm tiếp, đừng bắt đầu lại từ đầu.
  var td = chayTiep ? _docTienDo_() : null;
  if (!td) {
    var db = _docDB_();
    var co = db.users.some(function (u) {
      return Object.keys(_gomBangChung_(db, u.id, ky)).length > 0;
    });
    if (!co) return { ok: true, soPhieu: 0, xong: true,
                      thongBao: 'Kỳ này chưa có sự việc nào đã duyệt.' };
    _xoaTienDo_();
    td = { ky: ky, idThuMuc: idThuMuc ? _layId_(idThuMuc) : '',
           daLam: [], chiTiet: [], boQua: [], loi: [],
           soPhieu: 0, tongDong: 0, batDauLuc: new Date().toISOString() };
  }

  td = _chayMotLuot_(td);

  return {
    ok: true,
    xong: td.xong,
    soPhieu: td.soPhieu,
    tongDong: td.tongDong,
    daDuyet: td.daLam.length,
    chiTiet: td.chiTiet.slice(-40),
    boQua: td.boQua,
    loi: td.loi,
    thongBao: td.xong
      ? 'Xong. Đã điền ' + td.tongDong + ' dòng vào ' + td.soPhieu + ' phiếu.' +
        (td.boQua.length ? ' Bỏ qua ' + td.boQua.length + ' tệp.' : '') +
        (td.loi.length ? ' Có ' + td.loi.length + ' lỗi.' : '')
      : 'Đã làm ' + td.daLam.length + ' phiếu rồi tạm dừng cho khỏi quá giờ. ' +
        'Máy chủ tự chạy tiếp sau một phút, anh không phải làm gì. ' +
        'Muốn xem tới đâu thì bấm Kiểm tra tiến độ.'
  };
}

/** Xem đang làm tới đâu, dùng khi đợt lớn phải chạy nhiều lượt. */
function tienDoGhiBangChung(token) {
  // ⛔ NGỪNG DÙNG từ 01/09/2026. App chỉ ĐỌC file gốc, không ghi vào
  // file của phòng Nhân sự. Giữ hàm lại để lời gọi cũ có câu trả lời rõ.
  return { ok: false, ngungDung: true, loi: 'App không ghi vào phiếu của phòng Nhân sự.' };

  _batBuocVai_(token, 'xuat');
  var td = _docTienDo_();
  if (!td) return { ok: true, dangChay: false };
  return {
    ok: true, dangChay: true, ky: td.ky,
    daDuyet: td.daLam.length, soPhieu: td.soPhieu, tongDong: td.tongDong,
    batDauLuc: td.batDauLuc, boQua: td.boQua.length, loi: td.loi.length
  };
}

/** Dừng hẳn đợt đang chạy dở. */
function dungGhiBangChung(token) {
  // ⛔ NGỪNG DÙNG từ 01/09/2026. App chỉ ĐỌC file gốc, không ghi vào
  // file của phòng Nhân sự. Giữ hàm lại để lời gọi cũ có câu trả lời rõ.
  return { ok: false, ngungDung: true, loi: 'App không ghi vào phiếu của phòng Nhân sự.' };

  _batBuocVai_(token, 'xuat');
  _xoaTienDo_();
  return { ok: true, thongBao: 'Đã dừng. Lần sau bấm là chạy lại từ đầu.' };
}

/** Xem trước thư mục đợt có những phiếu nào, khớp được với ai. */
function xemTruocThuMuc(token, idThuMuc) {
  // ⛔ NGỪNG DÙNG từ 01/09/2026. App chỉ ĐỌC file gốc, không ghi vào
  // file của phòng Nhân sự. Giữ hàm lại để lời gọi cũ có câu trả lời rõ.
  return { ok: false, ngungDung: true, loi: 'App không quét thư mục phiếu của phòng Nhân sự.' };

  _batBuocVai_(token, 'xuat');
  var db = _docDB_();
  var ma2ten = {};
  db.users.forEach(function (u) { ma2ten[String(u.code).toUpperCase()] = u.name; });

  var tm = idThuMuc ? DriveApp.getFolderById(_layId_(idThuMuc)) : _thuMucDot_();
  var it = tm.getFilesByType(MimeType.GOOGLE_SHEETS);
  var ds = [], dem = 0;
  while (it.hasNext() && dem < 60) {
    var f = it.next();
    if (f.isTrashed() || f.getId() === ID_PHIEU_GOC) continue;
    dem++;
    var ma = '';
    try { ma = _maNhanSuTrongPhieu_(SpreadsheetApp.openById(f.getId()).getSheets()[0]); } catch (e) {}
    ds.push({ ten: f.getName(), ma: ma, nguoi: ma2ten[ma] || '' });
  }
  return { thuMuc: tm.getName(), soPhieu: ds.length, ds: ds };
}

// ─────────────────────────────────────────────────────────────
// CÀI ĐẶT LẦN ĐẦU VÀ BẢO TRÌ — chạy tay từ trình soạn thảo
// ─────────────────────────────────────────────────────────────

/**
 * Chạy MỘT LẦN sau khi dán code.
 * Nếu chưa có tệp dữ liệu thì tạo tệp rỗng để app tự dựng dữ liệu gốc.
 */
function caiDatLanDau() {
  var f = _tepDuLieu_();
  if (f) {
    Logger.log('Đã có tệp dữ liệu: ' + f.getUrl());
  } else {
    _ghiDB_({ version: 3, users: [], criteria: [], records: [], reviews: [],
              sites: [], depts: [], tracks: [], settings: {} });
    Logger.log('Đã tạo tệp dữ liệu mới: ' + _tepDuLieu_().getUrl());
  }
  Logger.log('Thư mục ảnh: ' + _thuMucAnh_().getUrl());
  try {
    Logger.log('Phiếu đánh giá: ' + SpreadsheetApp.openById(ID_PHIEU_GOC).getName());
  } catch (e) {
    Logger.log('⚠️ CHƯA MỞ ĐƯỢC PHIẾU. Kiểm tra lại ID_PHIEU_GOC. Lỗi: ' + e.message);
  }
}

/**
 * Nạp dữ liệu từ bản cũ chạy trên trình duyệt.
 * Mở app cũ, vào Quản lý → Dữ liệu → Xuất, copy toàn bộ, dán vào giữa hai dấu nháy.
 */
function napTuBanCu() {
  var JSON_DAN_VAO = '';   // ← dán chuỗi JSON vào đây
  if (!JSON_DAN_VAO) {
    Logger.log('Chưa dán dữ liệu. Mở app cũ, Quản lý → Dữ liệu → Xuất, rồi dán vào biến JSON_DAN_VAO.');
    return;
  }
  var db = JSON.parse(JSON_DAN_VAO);
  _ghiDB_(db);
  Logger.log('Đã nạp ' + (db.users || []).length + ' nhân sự, ' +
             (db.records || []).length + ' bản ghi.');
}

/** Tải một bản sao lưu dữ liệu về Drive, đặt tên theo ngày. */
function saoLuu() {
  var db = _docDB_();
  if (!db) { Logger.log('Chưa có dữ liệu.'); return; }
  var ten = 'SaoLuu_DanhGia_' +
    Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd_HHmm') + '.json';
  _thuMucGoc_().createFile(ten, JSON.stringify(db), 'application/json');
  Logger.log('Đã sao lưu: ' + ten);
}

/** Đặt lịch sao lưu tự động hằng ngày lúc 1 giờ sáng. */
function datLichSaoLuu() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'saoLuu') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('saoLuu').timeBased().atHour(1).everyDays(1).create();
  Logger.log('Đã đặt lịch sao lưu hằng ngày lúc 1 giờ sáng.');
}


// ─────────────────────────────────────────────────────────────
// ĐỒNG BỘ NHÂN SỰ TỪ FILE PEOPLE MANAGEMENT
// Nguyên tắc: MÃ NHÂN SỰ là danh tính vĩnh viễn.
//   · Người mới  → thêm, cấp mật khẩu tạm
//   · Người nghỉ → đánh dấu nghỉ việc, KHÔNG xoá, giữ nguyên lịch sử
//   · Quay lại   → dùng lại đúng mã cũ, lịch sử nối tiếp
//   · Đổi tên hoặc chuyển bộ phận → cập nhật, mã giữ nguyên
// ─────────────────────────────────────────────────────────────

/** Bỏ dấu và ký tự lạ để so tên cột cho dễ. */
function _chuan_(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
    .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
    .replace(/[ìíịỉĩ]/g, 'i')
    .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
    .replace(/[ùúụủũưừứựửữ]/g, 'u')
    .replace(/[ỳýỵỷỹ]/g, 'y')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]/g, '');
}

/** Tìm chỉ số cột theo danh sách tên có thể có. */
function _timCot_(tieuDe, ten) {
  for (var i = 0; i < tieuDe.length; i++) {
    var t = _chuan_(tieuDe[i]);
    for (var j = 0; j < ten.length; j++) {
      if (t && t.indexOf(_chuan_(ten[j])) === 0) return i;
    }
  }
  return -1;
}

var CAP_BAC_MAP = {
  founder: 'founder', nguoisanglap: 'founder',
  clevel: 'clevel', tonggiamdoc: 'clevel', giamdoc: 'clevel',
  truongphong: 'head',
  quanly: 'manager',
  lead: 'lead', leadbophan: 'lead',
  nhanvien: 'staff'
};

/**
 * Đọc sheet Nhân sự của People Management và cập nhật danh sách trong app.
 * Chạy tay từ trình soạn thảo, hoặc bấm nút trong app.
 */
function dongBoNhanSu(token) {
  // ⛔ NGỪNG DÙNG từ 01/09/2026. App chỉ ĐỌC file gốc, không ghi vào
  // file của phòng Nhân sự. Giữ hàm lại để lời gọi cũ có câu trả lời rõ.
  return { ok: false, ngungDung: true, loi: 'Danh sách nhân sự lấy từ file gốc. Dùng Nạp từ file gốc.' };

  if (token) _batBuocVai_(token, 'admin');

  var ss;
  try { ss = SpreadsheetApp.openById(ID_PEOPLE); }
  catch (e) { return { ok: false, loi: 'Không mở được file People Management. Kiểm tra ID_PEOPLE và quyền truy cập.' }; }
  var sh = ss.getSheetByName(SHEET_NHAN_SU);
  if (!sh) {
    // thử tìm sheet có tên gần đúng
    ss.getSheets().forEach(function (x) {
      if (!sh && _chuan_(x.getName()).indexOf('nhansu') >= 0) sh = x;
    });
  }
  if (!sh) return { ok: false, loi: 'Không tìm thấy sheet "' + SHEET_NHAN_SU + '".' };

  var o = sh.getDataRange().getValues();
  if (!o.length) return { ok: false, loi: 'Sheet Nhân sự trống.' };

  // tìm dòng tiêu đề trong 10 dòng đầu
  var dongTieuDe = -1, cot = {};
  for (var r = 0; r < Math.min(10, o.length); r++) {
    var iMa = _timCot_(o[r], ['Mã NV', 'Mã nhân sự', 'Ma NV']);
    if (iMa >= 0) { dongTieuDe = r; cot.ma = iMa; break; }
  }
  if (dongTieuDe < 0) return { ok: false, loi: 'Không tìm thấy cột Mã NV trong 10 dòng đầu.' };

  var td = o[dongTieuDe];
  cot.ten     = _timCot_(td, ['Họ tên', 'Ho ten', 'Họ và tên']);
  cot.chucVi  = _timCot_(td, ['Chức danh', 'Vị trí']);
  cot.chucEn  = _timCot_(td, ['Chức danh tiếng Anh', 'Position', 'Title']);
  cot.phong   = _timCot_(td, ['Phòng ban', 'Bộ phận']);
  cot.diem    = _timCot_(td, ['Điểm làm việc', 'Nơi làm việc']);
  cot.tuyen   = _timCot_(td, ['Tuyến']);
  cot.nghe    = _timCot_(td, ['Người điếc', 'Điếc', 'Nhóm ngôn ngữ']);
  cot.cap     = _timCot_(td, ['Cấp bậc', 'Trạng thái', 'Cấp']);

  var db = _docDB_();
  if (!db) return { ok: false, loi: 'Chưa có dữ liệu app.' };
  db.depts = db.depts || []; db.sites = db.sites || []; db.tracks = db.tracks || [];

  function _timHoacTao_(ds, ten, tienTo) {
    ten = String(ten || '').trim();
    if (!ten) return null;
    for (var i = 0; i < ds.length; i++)
      if (_chuan_(ds[i].name) === _chuan_(ten)) return ds[i].id;
    var id = tienTo + '_' + Utilities.getUuid().slice(0, 6);
    ds.push({ id: id, name: ten });
    return id;
  }
  function _oGia_(hang, i) { return i >= 0 ? String(hang[i] || '').trim() : ''; }

  var theoMa = {};
  db.users.forEach(function (u) { theoMa[String(u.code).toUpperCase()] = u; });

  var themMoi = [], capNhat = [], quayLai = [], gapTrongSheet = {};

  for (var r = dongTieuDe + 1; r < o.length; r++) {
    var ma = _oGia_(o[r], cot.ma).toUpperCase();
    if (!ma) continue;
    var ten = _oGia_(o[r], cot.ten);
    if (!ten) continue;
    gapTrongSheet[ma] = true;

    var capChu = _oGia_(o[r], cot.cap);
    var level = CAP_BAC_MAP[_chuan_(capChu)] || 'staff';
    var ngheChu = _chuan_(_oGia_(o[r], cot.nghe));
    var hearing = ngheChu.indexOf('diec') >= 0 ? 'deaf'
                : ngheChu.indexOf('noi') >= 0 ? 'hearing' : '';

    var thongTin = {
      name: ten,
      titleVi: _oGia_(o[r], cot.chucVi),
      titleEn: _oGia_(o[r], cot.chucEn),
      deptId: _timHoacTao_(db.depts, _oGia_(o[r], cot.phong), 'dp'),
      siteId: _timHoacTao_(db.sites, _oGia_(o[r], cot.diem), 'si'),
      trackId: _timHoacTao_(db.tracks, _oGia_(o[r], cot.tuyen), 'tr'),
      hearing: hearing,
      level: level,
      role: level === 'founder' || level === 'clevel' ? 'admin'
          : level === 'head' || level === 'manager' ? 'manager' : 'staff'
    };

    var u = theoMa[ma];
    if (u) {
      var daNghi = u.active === false;
      Object.keys(thongTin).forEach(function (k) {
        if (thongTin[k] !== null && thongTin[k] !== '') u[k] = thongTin[k];
      });
      u.active = true;
      if (daNghi) quayLai.push(ma + ' ' + ten);
      else capNhat.push(ma);
    } else {
      // MÃ LÀ DANH TÍNH VĨNH VIỄN — không bao giờ dùng lại mã của người cũ.
      var muoi = _muoiMoi_();
      var moi = {
        id: 'u_' + ma, code: ma,
        pwSalt: muoi, pwHash: _bam_(MAT_KHAU_TAM, muoi), mustChange: true,
        active: true, joinedAt: new Date().toISOString()
      };
      Object.keys(thongTin).forEach(function (k) { moi[k] = thongTin[k]; });
      db.users.push(moi);
      themMoi.push(ma + ' ' + ten);
    }
  }

  // Ai không còn trong sheet thì đánh dấu nghỉ việc, KHÔNG xoá.
  var nghiViec = [];
  db.users.forEach(function (u) {
    if (u.id === 'u_admin' || u.id === 'u_admin_test' || u.demo) return;
    if (!gapTrongSheet[String(u.code).toUpperCase()] && u.active !== false) {
      u.active = false;
      nghiViec.push(u.code + ' ' + u.name);
    }
  });

  var lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) throw new Error('Có người đang lưu, thử lại sau vài giây.');
  try { _ghiDB_(db); } finally { lock.releaseLock(); }

  return {
    ok: true,
    themMoi: themMoi, quayLai: quayLai, nghiViec: nghiViec, soCapNhat: capNhat.length,
    thongBao: 'Thêm ' + themMoi.length + ' người mới, cập nhật ' + capNhat.length +
              ', cho nghỉ ' + nghiViec.length +
              (quayLai.length ? ', ' + quayLai.length + ' người quay lại' : '') + '.'
  };
}

/** Xem trước việc đồng bộ sẽ đổi những gì, không ghi gì cả. */
function xemTruocDongBo(token) {
  // ⛔ NGỪNG DÙNG từ 01/09/2026. App chỉ ĐỌC file gốc, không ghi vào
  // file của phòng Nhân sự. Giữ hàm lại để lời gọi cũ có câu trả lời rõ.
  return { ok: false, ngungDung: true, loi: 'Danh sách nhân sự lấy từ file gốc. Dùng Xem trước đồng bộ từ file gốc.' };

  _batBuocVai_(token, 'admin');
  var db = _docDB_();
  var truoc = JSON.stringify(db);
  var kq = dongBoNhanSu(null);
  // hoàn lại đúng như cũ
  _ghiDB_(JSON.parse(truoc));
  kq.xemTruoc = true;
  return kq;
}


// ─────────────────────────────────────────────────────────────
// XUẤT FILE THÁNG CHO PHÒNG NHÂN SỰ
//
// Mỗi tháng bấm một lần, app đẻ ra MỘT tệp .xlsx gồm hai trang:
//   Trang 1 "Tổng hợp kỳ"  — đúng 13 cột của sheet 📊 Tổng hợp kỳ trong
//                            file gốc, để xem nhanh cả nhà trong một bảng.
//   Trang 2 "Bằng chứng"   — mỗi sự việc một dòng, kèm sẵn một cột đã
//                            ghép đúng định dạng cột H của phiếu chấm.
//
// ⚠️ KHÔNG dán trang 1 đè lên sheet 📊 Tổng hợp kỳ của file gốc. File gốc
// đã có menu 📥 Thu kết quả một đợt tự dồn từ các phiếu — dán đè sẽ xoá
// mất kết quả thật mà phiếu vừa tính ra. Tệp này chỉ để xem và để gửi cho
// người không có quyền mở file gốc.
//
// Ba cột bậc và cột tỷ lệ để TRỐNG. App không xếp bậc thay hội đồng.
// ─────────────────────────────────────────────────────────────

/** 13 cột của sheet 📊 Tổng hợp kỳ. Thứ tự này do file gốc quy định. */
var COT_TONG_HOP = [
  'Thời điểm thu', 'Kỳ', 'Tuyến', 'Mã NV', 'Họ và tên', 'Vị trí',
  'Vai trò quản lý', 'Điểm văn hóa chung', 'Điểm ngạch chuyên môn',
  'Điểm ngạch quản lý', 'ĐIỂM TỔNG', 'Bậc cách làm việc',
  'Bậc ngạch chuyên môn', 'Bậc ngạch quản lý', 'Ranh giới',
  'Bảo mật thu nhập', 'Đường dẫn file năm'
];

/** Cột của trang Bằng chứng. Cột cuối ghép sẵn để dán vào cột H. */
var COT_CHUNG_CU = [
  'Mã NV', 'Họ và tên', 'Đợt', 'Loại', 'Mã câu', 'Ngạch', 'Nhóm',
  'Thời điểm xảy ra', 'Nội dung sự việc', 'Người lập', 'Trạng thái',
  'Số ảnh', 'Đường dẫn ảnh', 'Khiếu nại', 'Dòng để dán vào cột H'
];

/** Tên cấp bậc, khớp với cột Vai trò quản lý bên file gốc. */
var TEN_CAP = {
  founder: 'Founder', clevel: 'C-Level', head: 'Trưởng phòng',
  manager: 'Quản lý', lead: 'Lead bộ phận', staff: 'Nhân viên'
};

/** Tài khoản máy, không phải người. Không bao giờ xuất cho Nhân sự. */
var ID_TAI_KHOAN_MAY = ['u_admin', 'u_admin_test'];

function _laNguoiThat_(u, kemThu) {
  if (!u) return false;
  if (ID_TAI_KHOAN_MAY.indexOf(u.id) >= 0) return false;
  if (u.demo && !kemThu) return false;
  return true;
}

function _nhanCuaBanGhi_(r) {
  return r.isBoundary ? 'Ranh giới' : (r.type === 'vi_pham' ? 'Vi phạm' : 'Ghi nhận');
}

function _tenNgach_(c) {
  if (!c || !c.id) return '';
  if (c.ngach === 'quan_ly') return 'B.3 Quản lý';
  if (c.ngach === 'chuyen_mon' || c.ngach === 'tay_nghe') return 'B.2 Chuyên môn';
  return 'B.1 Khung chung';
}

/**
 * Trang 1 — mỗi nhân sự một dòng, đúng 13 cột.
 * chiNguoiCoViec: chỉ lấy người có ít nhất một sự việc trong kỳ.
 */
function _bangTongHop_(db, ky, tenDot, chiDaDuyet, chiNguoiCoViec, kemThu) {
  var thuLuc = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm');
  var tuyen = {};
  (db.tracks || []).forEach(function (t) { tuyen[t.id] = t.name; });

  // Đếm sự việc theo từng người trong kỳ. Chỉ dùng để lọc, không ghi ra cột nào.
  var demTatCa = {};
  (db.records || []).forEach(function (r) {
    if (ky && r.period !== ky) return;
    if (chiDaDuyet && r.status !== 'approved') return;
    demTatCa[r.subjectId] = (demTatCa[r.subjectId] || 0) + 1;
  });

  var nguoi = (db.users || []).filter(function (u) {
    if (u.active === false) return false;
    if (!_laNguoiThat_(u, kemThu)) return false;
    if (chiNguoiCoViec && !demTatCa[u.id]) return false;
    return true;
  });
  nguoi.sort(function (a, b) { return String(a.code).localeCompare(String(b.code)); });

  return nguoi.map(function (u) {
    var st = _tinhDiem_(db, u, ky);
    var kh = {};
    (st.khung || []).forEach(function (x) { kh[x.k] = x; });
    var d = function (k) {
      return kh[k] && kh[k].tb !== null ? Math.round(kh[k].tb * 100) / 100 : '';
    };
    return [
      thuLuc,                          // Thời điểm thu
      tenDot || ky || '',              // Kỳ
      tuyen[u.trackId] || '',          // Tuyến
      u.code || '',                    // Mã NV
      u.name || '',                    // Họ và tên
      u.titleVi || '',                 // Vị trí
      TEN_CAP[u.level] || '',          // Vai trò quản lý
      d('kc'),                         // Điểm văn hóa chung
      d('cm'),                         // Điểm ngạch chuyên môn
      d('ql'),                         // Điểm ngạch quản lý
      st.diemThang5 === null ? '' : Math.round(st.diemThang5 * 100) / 100,  // ĐIỂM TỔNG
      st.bac === null ? '' : st.bac,   // Bậc cách làm việc
      '',                              // Bậc ngạch chuyên môn — phiếu đã bỏ hai
      '',                              // Bậc ngạch quản lý     dòng bậc từ 31/8
      '',                              // Ranh giới — app chưa có mã RG nào
      st.viPhamBaoMat ? 'Có vi phạm' : '',   // Bảo mật thu nhập
      ''                               // Đường dẫn file năm — do file gốc điền
    ];
  });
}

/** Trang 2 — mỗi sự việc một dòng. */
function _bangChungCu_(db, ky, tenDot, chiDaDuyet, kemThu) {
  var nguoiOK = {};
  (db.users || []).forEach(function (u) { if (_laNguoiThat_(u, kemThu)) nguoiOK[u.id] = true; });
  var ten = {}, ma = {};
  (db.users || []).forEach(function (u) { ten[u.id] = u.name; ma[u.id] = u.code; });
  var crit = {};
  (db.criteria || []).forEach(function (c) { crit[c.id] = c; });

  var hang = [];
  (db.records || []).forEach(function (r) {
    if (!nguoiOK[r.subjectId]) return;
    if (!nguoiOK[r.reporterId]) return;   // bản ghi do tài khoản thử lập cũng bỏ
    if (ky && r.period !== ky) return;
    if (chiDaDuyet && r.status !== 'approved') return;
    var c = crit[r.critId] || {};
    var anh = r.anh || [];
    var nhan = _nhanCuaBanGhi_(r);
    var gio = _dinhDangGio_(r.xayRaLuc || r.createdAt);
    var dongH = (r.isBoundary ? 'RANH GIỚI' : nhan) + ' · ' + gio + ' · ' + (r.detail || '') +
                ' (' + (ten[r.reporterId] || '?') + ' lập)' +
                (anh.length ? ' [' + anh.length + ' ảnh]' : '');
    hang.push([
      ma[r.subjectId] || '',
      ten[r.subjectId] || '',
      tenDot || r.period || '',
      nhan,
      r.critCode || '',
      _tenNgach_(c),
      c.group || '',
      gio,
      r.detail || '',
      ten[r.reporterId] || '',
      r.status === 'approved' ? 'Đã duyệt' : (r.status === 'rejected' ? 'Bị bác' : 'Đang chờ'),
      anh.length,
      anh.map(function (a) { return a.url || ''; }).filter(String).join(' | '),
      r.khieuNai ? (r.khieuNai.text || '') : '',
      dongH
    ]);
  });

  hang.sort(function (a, b) {
    var x = String(a[0]).localeCompare(String(b[0]));
    return x !== 0 ? x : String(a[7]).localeCompare(String(b[7]));
  });
  return hang;
}

function _ghiBang_(sh, cot, hang) {
  sh.clear();
  sh.getRange(1, 1, 1, cot.length).setValues([cot])
    .setFontWeight('bold').setBackground('#e6f0d4').setWrap(true);
  if (hang.length) sh.getRange(2, 1, hang.length, cot.length).setValues(hang);
  sh.setFrozenRows(1);
  for (var i = 1; i <= cot.length; i++) {
    try { sh.autoResizeColumn(i); } catch (e) {}
  }
  return sh;
}

/**
 * Xem trước trước khi xuất: bao nhiêu người, bao nhiêu sự việc.
 */
function xemTruocXuatThang(token, ky, chiDaDuyet, chiNguoiCoViec, kemThu) {
  _batBuocVai_(token, 'xuat');
  var db = _docDB_();
  if (!db) return { ok: false, loi: 'Chưa có dữ liệu.' };
  var td = _bangTongHop_(db, ky, ky, chiDaDuyet !== false, !!chiNguoiCoViec, !!kemThu);
  var cc = _bangChungCu_(db, ky, ky, chiDaDuyet !== false, !!kemThu);
  var choDuyet = (db.records || []).filter(function (r) {
    return (!ky || r.period === ky) && r.status !== 'approved' && r.status !== 'rejected';
  }).length;
  return {
    ok: true, soNguoi: td.length, soSuViec: cc.length, choDuyet: choDuyet,
    cotTongHop: COT_TONG_HOP, cotChungCu: COT_CHUNG_CU,
    mauTongHop: td.slice(0, 5), mauChungCu: cc.slice(0, 5)
  };
}

/**
 * XUẤT FILE THÁNG. Trả về đường dẫn tệp .xlsx trên Drive.
 * idThuMuc để trống thì lưu vào thư mục đang chứa bảng gốc.
 */
function xuatFileThang(token, ky, tenDot, chiDaDuyet, chiNguoiCoViec, idThuMuc, kemThu) {
  _batBuocVai_(token, 'xuat');
  var db = _docDB_();
  if (!db) return { ok: false, loi: 'Chưa có dữ liệu.' };

  var duyet = chiDaDuyet !== false;
  var td = _bangTongHop_(db, ky, tenDot, duyet, !!chiNguoiCoViec, !!kemThu);
  var cc = _bangChungCu_(db, ky, tenDot, duyet, !!kemThu);

  var thuMuc;
  try {
    thuMuc = idThuMuc ? DriveApp.getFolderById(_layId_(idThuMuc)) : _thuMucGoc_();
  } catch (e) {
    return { ok: false, loi: 'Không mở được thư mục đích. Kiểm tra đường dẫn và quyền.' };
  }

  var nhan = (ky || 'tat-ca').replace(/[^0-9A-Za-z\-_]/g, '');
  var tenTep = 'TongHopKy_' + nhan + '_NhaCuaThoiThanhXuan';

  // Dựng bảng tính tạm rồi đổi sang .xlsx. Bảng tạm bị xoá sau khi xong.
  var tam = SpreadsheetApp.create(tenTep);
  var idTam = tam.getId();
  try {
    var s1 = tam.getSheets()[0].setName('Tổng hợp kỳ');
    _ghiBang_(s1, COT_TONG_HOP, td);
    var s2 = tam.insertSheet('Bằng chứng');
    _ghiBang_(s2, COT_CHUNG_CU, cc);
    SpreadsheetApp.flush();

    var res = UrlFetchApp.fetch(
      'https://docs.google.com/spreadsheets/d/' + idTam + '/export?format=xlsx',
      { headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() }, muteHttpExceptions: true }
    );

    if (res.getResponseCode() === 200) {
      var tep = thuMuc.createFile(res.getBlob().setName(tenTep + '.xlsx'));
      DriveApp.getFileById(idTam).setTrashed(true);
      return {
        ok: true, dinhDang: 'xlsx', ten: tep.getName(), url: tep.getUrl(),
        soNguoi: td.length, soSuViec: cc.length, thuMuc: thuMuc.getName()
      };
    }

    // Đổi định dạng hỏng thì giữ nguyên bảng tính, vẫn dùng được.
    DriveApp.getFileById(idTam).moveTo(thuMuc);
    return {
      ok: true, dinhDang: 'sheet', ten: tenTep, url: tam.getUrl(),
      soNguoi: td.length, soSuViec: cc.length, thuMuc: thuMuc.getName(),
      canhBao: 'Không đổi được sang .xlsx nên em để nguyên dạng bảng tính. ' +
               'Mở link rồi chọn Tệp → Tải xuống → Microsoft Excel là ra tệp giống hệt.'
    };
  } catch (e) {
    try { DriveApp.getFileById(idTam).setTrashed(true); } catch (e2) {}
    return { ok: false, loi: 'Xuất hỏng giữa chừng: ' + e.message };
  }
}

/**
 * ĐẨY THẲNG: ghi trang Tổng hợp kỳ vào một bảng tính có sẵn.
 * Dùng khi Nhân sự muốn app ghi vào đúng file của họ thay vì gửi tệp rời.
 */
function xuatSangFile(token, idFile, tenSheet, ky, chiDaDuyet) {
  // ⛔ NGỪNG DÙNG từ 01/09/2026. App chỉ ĐỌC file gốc, không ghi vào
  // file của phòng Nhân sự. Giữ hàm lại để lời gọi cũ có câu trả lời rõ.
  return { ok: false, ngungDung: true, loi: 'App không ghi đè bảng tính của người khác. Dùng Xuất Google Sheet ra file riêng.' };

  _batBuocVai_(token, 'xuat');
  var db = _docDB_();
  var td = _bangTongHop_(db, ky, ky, chiDaDuyet !== false, false, false);

  var ss;
  try { ss = SpreadsheetApp.openById(_layId_(idFile)); }
  catch (e) { return { ok: false, loi: 'Không mở được file đích. Kiểm tra đường dẫn và quyền chỉnh sửa.' }; }

  tenSheet = tenSheet || 'NhapTuApp';
  var sh = ss.getSheetByName(tenSheet) || ss.insertSheet(tenSheet);
  _ghiBang_(sh, COT_TONG_HOP, td);
  sh.getRange(1, COT_TONG_HOP.length + 2).setValue('Cập nhật lúc');
  sh.getRange(1, COT_TONG_HOP.length + 3)
    .setValue(Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm'));

  return {
    ok: true, soDong: td.length, sheet: tenSheet, file: ss.getName(),
    thongBao: 'Đã ghi ' + td.length + ' dòng vào sheet ' + tenSheet + ' của ' + ss.getName() + '.'
  };
}

/**
 * KÉO: hàm cho script bên ngoài gọi sang, không cần token.
 * Chỉ trả bảng kết quả, không bao giờ trả tài khoản và mật khẩu.
 */
function docDuLieuApp_ChoBenNgoai(ky) {
  var db = _docDB_();
  if (!db) return { ok: false, loi: 'Chưa có dữ liệu.' };
  return {
    ok: true,
    ky: ky || '',
    cotTongHop: COT_TONG_HOP,
    tongHop: _bangTongHop_(db, ky, ky, true, false, false),
    cotChungCu: COT_CHUNG_CU,
    chungCu: _bangChungCu_(db, ky, ky, true, false),
    layLuc: new Date().toISOString()
  };
}

/** Danh sách kỳ đang có, để app và bên ngoài biết chọn gì. */
function danhSachKy() {
  var db = _docDB_();
  if (!db) return [];
  var co = {};
  (db.records || []).forEach(function (r) { if (r.period) co[r.period] = true; });
  var ds = Object.keys(co).sort().reverse();
  var thang = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM');
  if (ds.indexOf(thang) < 0) ds.unshift(thang);
  return ds;
}

/* ═══════════════════════════════════════════════════════════════════════════
   TẠO PHIẾU CẢ ĐỢT — nhân bản một mẫu Google Sheet ra thành mỗi người một phiếu

   Khác với ghiBangChungCaDot: hàm kia điền vào phiếu ĐÃ CÓ SẴN, hàm này TỰ TẠO
   phiếu rồi mới điền. Mỗi tháng bấm một lần là có đủ phiếu cho cả nhà.

   Ba việc trên mỗi phiếu, theo đúng thứ tự:
     1. makeCopy mẫu → một Google Sheet riêng cho người đó
     2. điền khối thông tin (Mã NV, Họ tên, Vị trí, Phòng ban, Điểm làm việc, Kỳ)
     3. điền cột Bằng chứng — KHÔNG động vào cột Người chấm, hội đồng tự chấm

   Chạy nhiều lượt: copy một Sheet mất vài giây, 30 người là quá 6 phút của
   Apps Script. Nên làm tới gần hết giờ thì cất tiến độ và tự hẹn chạy tiếp.
   ═══════════════════════════════════════════════════════════════════════════ */

/** Khoá cất tiến độ tạo phiếu. Khác khoá của việc ghi bằng chứng. */
var KHOA_TIEN_DO_TAO = 'tienDoTaoPhieu';

/** Làm tới giây thứ bao nhiêu thì nghỉ, chừa chỗ cho việc dọn dẹp. */
var GIAY_MOT_LUOT_TAO = 260;

/** Nhãn khối thông tin cần điền → lấy giá trị từ đâu. */
function _giaTriThongTin_(db, u, ky) {
  var boPhan = {}, diem = {}, tuyen = {};
  (db.depts || []).forEach(function (d) { boPhan[d.id] = d.name; });
  (db.sites || []).forEach(function (s) { diem[s.id] = s.name; });
  (db.tracks || []).forEach(function (t) { tuyen[t.id] = t.name; });
  var thang = String(ky || '').split('-');
  return {
    'Mã NV':            u.code || '',
    'Mã nhân sự':       u.code || '',
    'Họ và tên':        u.name || '',
    'Họ tên':           u.name || '',
    'Vị trí':           u.titleVi || '',
    'Chức danh':        u.titleVi || '',
    'Phòng ban':        boPhan[u.deptId] || '',
    'Bộ phận':          boPhan[u.deptId] || '',
    'Điểm làm việc':    diem[u.siteId] || '',
    'Nơi làm việc':     diem[u.siteId] || '',
    'Tuyến':            tuyen[u.trackId] || '',
    'Vai trò quản lý':  TEN_CAP[u.level] || '',
    'Kỳ':               thang[1] ? 'Tháng ' + Number(thang[1]) + '/' + thang[0] : (ky || ''),
    'Kỳ đánh giá':      thang[1] ? 'Tháng ' + Number(thang[1]) + '/' + thang[0] : (ky || ''),
    'Tháng':            thang[1] ? 'Tháng ' + Number(thang[1]) + '/' + thang[0] : (ky || '')
  };
}

/**
 * Điền khối thông tin vào MỘT sheet. Dò theo nhãn đã bỏ dấu, không dùng ô cố định
 * — mẫu đổi chỗ vẫn chạy. Nhãn nào không có trong phiếu thì bỏ qua, không đoán.
 */
function _dienThongTinSheet_(sh, gt) {
  if (sh.getLastRow() < 2) return 0;
  var het = Math.min(sh.getLastRow(), 60);
  var rong = Math.min(sh.getLastColumn(), 8);
  if (het < 1 || rong < 2) return 0;
  var o = sh.getRange(1, 1, het, rong).getValues();
  var banDo = _doKhoiThongTin_(o, het, rong);
  var da = 0;
  for (var nhan in gt) {
    if (!gt[nhan]) continue;
    var vt = _oCuaNhan_(banDo, nhan);
    if (!vt) continue;
    // Chỉ ghi vào ô đang trống — không đè lên thứ mẫu đã đặt sẵn.
    var cu = o[vt.dong - 1] && o[vt.dong - 1][vt.cot - 1];
    if (cu !== '' && cu !== null && cu !== undefined) continue;
    sh.getRange(vt.dong, vt.cot).setValue(gt[nhan]);
    da++;
  }
  return da;
}

/** Điền khối thông tin vào mọi sheet của một phiếu. */
function _dienThongTinPhieu_(ss, gt) {
  var tong = 0;
  ss.getSheets().forEach(function (sh) { tong += _dienThongTinSheet_(sh, gt); });
  return tong;
}

/** Tên tệp phiếu. Bắt đầu bằng mã NV để thư mục tự xếp theo mã. */
function _tenPhieu_(u, ky) {
  var thang = String(ky || '').split('-');
  var nhan = thang[1] ? Number(thang[1]) + '.' + thang[0] : (ky || '');
  return (u.code || u.id) + ' — ' + (u.name || '') + ' — Tháng ' + nhan;
}

/** Thư mục chứa phiếu của một kỳ. Có rồi thì dùng lại, chưa có thì tạo. */
function _thuMucKy_(ky, idThuMucCha) {
  var cha = idThuMucCha ? DriveApp.getFolderById(_layId_(idThuMucCha)) : _thuMucGoc_();
  var thang = String(ky || '').split('-');
  var ten = 'Phiếu đánh giá — Tháng ' + (thang[1] ? Number(thang[1]) + '.' + thang[0] : ky);
  var co = cha.getFoldersByName(ten);
  return co.hasNext() ? co.next() : cha.createFolder(ten);
}

function _docTienDoTao_() {
  var s = PropertiesService.getScriptProperties().getProperty(KHOA_TIEN_DO_TAO);
  if (!s) return null;
  try { return JSON.parse(s); } catch (e) { return null; }
}
function _ghiTienDoTao_(td) {
  PropertiesService.getScriptProperties()
    .setProperty(KHOA_TIEN_DO_TAO, JSON.stringify(td));
}
function _xoaTienDoTao_() {
  PropertiesService.getScriptProperties().deleteProperty(KHOA_TIEN_DO_TAO);
  _xoaHenGioTao_();
}
function _xoaHenGioTao_() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'chayTiepTaoPhieu') ScriptApp.deleteTrigger(t);
  });
}
function _henChayTiepTao_() {
  _xoaHenGioTao_();
  ScriptApp.newTrigger('chayTiepTaoPhieu').timeBased().after(60 * 1000).create();
}

/** Máy chủ tự gọi khi còn người chưa có phiếu. Không ai bấm hàm này bằng tay. */
function chayTiepTaoPhieu() {
  var td = _docTienDoTao_();
  if (!td) { _xoaHenGioTao_(); return; }
  _motLuotTao_(td);
}

/** Làm một lượt cho tới khi gần hết giờ. */
function _motLuotTao_(td) {
  var batDau = Date.now();
  // Mỗi lượt phải xong ít nhất MỘT phiếu. Không có chốt này thì lỡ ngưỡng thời
  // gian bị đặt sai là vòng lặp đứng im, hẹn giờ gọi lại mãi mà không tiến.
  var xongTrongLuot = 0;
  var db = _docDB_();
  var thuMuc = DriveApp.getFolderById(td.idThuMuc);
  var mau = DriveApp.getFileById(td.idMau);

  while (td.conLai.length) {
    if (xongTrongLuot > 0 && (Date.now() - batDau) / 1000 > GIAY_MOT_LUOT_TAO) {
      td.xong = false;
      _ghiTienDoTao_(td);
      _henChayTiepTao_();
      return td;
    }
    var uid = td.conLai[0];
    var u = null;
    for (var i = 0; i < db.users.length; i++) if (db.users[i].id === uid) u = db.users[i];
    if (!u) { td.conLai.shift(); continue; }

    try {
      var ten = _tenPhieu_(u, td.ky);
      // Đã có phiếu cùng tên trong thư mục thì dùng lại, không tạo trùng.
      var cu = thuMuc.getFilesByName(ten);
      var tep = cu.hasNext() ? cu.next() : mau.makeCopy(ten, thuMuc);
      var ss = SpreadsheetApp.openById(tep.getId());

      var soTT, soDong, thieu;
      if (_laPhieuDoiMoi_(ss)) {
        // Phiếu đời mới: ghi cờ phạm vi, khối thông tin, cột phạm vi,
        // điểm, sự việc và _log. Phiếu tự tính lấy điểm ba khung và bậc.
        var r = _dienPhieuMoi_(ss, db, u, td.ky);
        soTT = r.thongTin;
        soDong = r.suViec + r.diem;
        thieu = r.thieu.length;
        td.chiTiet.push({
          ma: u.code || '', ten: u.name || '', link: tep.getUrl(),
          soThongTin: r.thongTin, soDong: r.suViec, thieu: thieu,
          doiMoi: true, soCo: r.co, soPhamVi: r.phamVi, soDiem: r.diem, soLog: r.log
        });
      } else {
        soTT = _dienThongTinPhieu_(ss, _giaTriThongTin_(db, u, td.ky));
        var bc = _gomBangChung_(db, u.id, td.ky);
        var k = Object.keys(bc).length ? _ghiVaoPhieu_(ss, bc) : { daGhi: 0, thieu: [] };
        soDong = k.daGhi;
        thieu = k.thieu.length;
        td.chiTiet.push({
          ma: u.code || '', ten: u.name || '', link: tep.getUrl(),
          soThongTin: soTT, soDong: k.daGhi, thieu: thieu
        });
      }

      td.daLam.push(uid);
      td.soPhieu++;
      td.tongDong += soDong;
    } catch (e) {
      td.loi.push((u.code || u.id) + ' — ' + u.name + ': ' + e.message);
    }
    td.conLai.shift();
    xongTrongLuot++;
  }

  td.xong = true;
  _ghiTienDoTao_(td);
  _xoaHenGioTao_();
  return td;
}

/**
 * Tạo phiếu cho CẢ ĐỢT.
 * @param idMau      đường dẫn hoặc ID của Google Sheet mẫu
 * @param idThuMuc   thư mục cha để đặt thư mục kỳ. Bỏ trống thì dùng thư mục gốc của app.
 * @param chayTiep   true = làm tiếp đợt đang dở, đừng bắt đầu lại
 */
function taoPhieuCaDot(token, ky, idMau, idThuMuc, chayTiep) {
  // ⛔ NGỪNG DÙNG từ 01/09/2026. App chỉ ĐỌC file gốc, không ghi vào
  // file của phòng Nhân sự. Giữ hàm lại để lời gọi cũ có câu trả lời rõ.
  return { ok: false, ngungDung: true, loi: 'Tạo phiếu là việc của file gốc — menu 📄 Tạo file năm cho một người.' };

  _batBuocVai_(token, 'xuat');

  var td = chayTiep ? _docTienDoTao_() : null;
  if (!td) {
    if (!idMau) return { ok: false, loi: 'Chưa có mẫu phiếu. Dán đường dẫn Google Sheet mẫu vào.' };
    var mau;
    try { mau = DriveApp.getFileById(_layId_(idMau)); }
    catch (e) { return { ok: false, loi: 'Không mở được mẫu phiếu. Kiểm tra đường dẫn và quyền xem.' }; }
    try { SpreadsheetApp.openById(mau.getId()); }
    catch (e) { return { ok: false, loi: 'Tệp mẫu không phải Google Sheet.' }; }

    var db = _docDB_();
    // Tất cả nhân sự đang làm. Bỏ tài khoản máy; giữ tài khoản thử để tập dượt.
    // Tài khoản thử vẫn được tạo phiếu, để cả nhà tập dượt trên đó.
    var ds = db.users.filter(function (u) {
      return u.active !== false && _laNguoiThat_(u, true);
    }).map(function (u) { return u.id; });
    if (!ds.length) return { ok: false, loi: 'Không có nhân sự nào đang làm.' };

    var tm = _thuMucKy_(ky, idThuMuc);
    _xoaTienDoTao_();
    td = {
      ky: ky, idMau: mau.getId(), idThuMuc: tm.getId(), linkThuMuc: tm.getUrl(),
      conLai: ds, daLam: [], chiTiet: [], loi: [],
      soPhieu: 0, tongDong: 0, tong: ds.length,
      batDauLuc: new Date().toISOString()
    };
  }

  td = _motLuotTao_(td);

  return {
    ok: true,
    xong: !!td.xong,
    tong: td.tong,
    soPhieu: td.soPhieu,
    conLai: td.conLai.length,
    tongDong: td.tongDong,
    linkThuMuc: td.linkThuMuc,
    chiTiet: td.chiTiet.slice(-60),
    loi: td.loi,
    thongBao: td.xong
      ? 'Xong. Đã tạo ' + td.soPhieu + ' phiếu, điền ' + td.tongDong + ' dòng bằng chứng.' +
        (td.loi.length ? ' Có ' + td.loi.length + ' phiếu lỗi.' : '')
      : 'Đã tạo ' + td.soPhieu + '/' + td.tong + ' phiếu rồi tạm nghỉ cho khỏi quá giờ. ' +
        'Máy chủ tự chạy tiếp sau một phút, anh không phải làm gì.'
  };
}

/** Xem đang tạo tới đâu. */
function tienDoTaoPhieu(token) {
  // ⛔ NGỪNG DÙNG từ 01/09/2026. App chỉ ĐỌC file gốc, không ghi vào
  // file của phòng Nhân sự. Giữ hàm lại để lời gọi cũ có câu trả lời rõ.
  return { ok: false, ngungDung: true, loi: 'Tạo phiếu là việc của file gốc.' };

  _batBuocVai_(token, 'xuat');
  var td = _docTienDoTao_();
  if (!td) return { ok: true, dangChay: false };
  return {
    ok: true, dangChay: !td.xong, xong: !!td.xong,
    ky: td.ky, tong: td.tong, soPhieu: td.soPhieu, conLai: td.conLai.length,
    tongDong: td.tongDong, linkThuMuc: td.linkThuMuc,
    chiTiet: td.chiTiet.slice(-60), loi: td.loi
  };
}

/** Dừng hẳn đợt tạo phiếu đang dở. Phiếu đã tạo vẫn giữ nguyên. */
function dungTaoPhieu(token) {
  // ⛔ NGỪNG DÙNG từ 01/09/2026. App chỉ ĐỌC file gốc, không ghi vào
  // file của phòng Nhân sự. Giữ hàm lại để lời gọi cũ có câu trả lời rõ.
  return { ok: false, ngungDung: true, loi: 'Tạo phiếu là việc của file gốc.' };

  _batBuocVai_(token, 'xuat');
  var td = _docTienDoTao_();
  _xoaTienDoTao_();
  return { ok: true, thongBao: td ? 'Đã dừng. ' + td.soPhieu + ' phiếu đã tạo vẫn còn trong thư mục.'
                                  : 'Không có đợt nào đang chạy.' };
}

/* ═══════════════════════════════════════════════════════════════════════════
   CỬA KÉO — cho một Google Sheet bên ngoài gọi sang lấy dữ liệu

   Dùng khi nối bằng Thư viện (Library): Sheet thêm project này làm thư viện
   rồi gọi TTX.docPhieuMotNguoi(...). Không cần token vì Google đã kiểm quyền
   ở mức project — ai không được cấp quyền thì không gọi được.

   Mọi hàm ở khối này KHÔNG BAO GIỜ trả tài khoản, mật khẩu hay muối băm.
   ═══════════════════════════════════════════════════════════════════════════ */

/** Bậc nào được coi là có giữ vai trò quản lý. Khớp với bản chạy trên trình duyệt. */
var BAC_QUAN_LY = ['founder', 'clevel', 'head', 'manager', 'lead'];
/** Từ Trưởng phòng trở lên. */
var BAC_LV6 = ['founder', 'clevel', 'head'];

/** Tham số chấm điểm mặc định. Phải khớp SCORE_MAC_DINH bên trình duyệt. */
var DIEM_MAC_DINH = {
  khoiViPham: 5, khoiGhiNhan: 0,
  penalty: 1, bonus: 1,
  floor: 0, cap: 5,
  tsQL: { kc: 50, cm: 20, ql: 30 },
  ts:   { kc: 65, cm: 35 },
  nguongBac: [0, 40, 55, 70, 85]
};

function _thamSoDiem_(db) {
  var c = {}, mac = DIEM_MAC_DINH, k;
  for (k in mac) c[k] = mac[k];
  var dat = (db.settings || {}).scoring || {};
  for (k in dat) c[k] = dat[k];
  return c;
}

function _laQuanLy_(u) { return !!u && BAC_QUAN_LY.indexOf(u.level) >= 0; }
function _laLv6_(u)    { return !!u && BAC_LV6.indexOf(u.level) >= 0; }

function _hopPhamVi_(scope, u, db) {
  if (scope === 'mgmt')    return _laQuanLy_(u);
  if (scope === 'lv6')     return _laLv6_(u);
  if (scope === 'pos') {
    var s = null;
    (db.sites || []).forEach(function (x) { if (x.id === u.siteId) s = x; });
    return !!(s && s.isPos);
  }
  if (scope === 'hearing') return u.hearing === 'hearing';
  if (scope === 'deaf')    return u.hearing === 'deaf';
  return true;
}

/** Bộ câu áp dụng cho một người. Chép nguyên luật của bản trình duyệt. */
function _boCauCua_(db, u) {
  if (!u) return [];
  var tk = null;
  (db.tracks || []).forEach(function (t) { if (t.id === u.trackId) tk = t; });
  return (db.criteria || []).filter(function (c) {
    if (c.active === false) return false;
    if (c.appliesTo)
      return c.appliesTo.indexOf(u.role === 'admin' ? 'manager' : u.role) >= 0;
    if (c.trackId && c.trackId !== u.trackId) return false;
    if (!c.trackId) {
      if (tk && (tk.noGroups || []).indexOf(c.gcode) >= 0) return false;
      return _hopPhamVi_(c.scope, u, db);
    }
    if (tk && tk.qlForAll) return true;
    if (c.ngach === 'quan_ly' && !_laQuanLy_(u)) return false;
    return _hopPhamVi_(c.scope, u, db);
  });
}

/** Câu này thuộc khung nào: kc = khung chung, cm = chuyên môn, ql = quản lý. */
function _khungCua_(c) {
  if (!c) return null;
  if (!c.trackId) return 'kc';
  return c.ngach === 'quan_ly' ? 'ql' : 'cm';
}
var MA_KHUNG = { kc: 'B.1', cm: 'B.2', ql: 'B.3' };
var TEN_KHUNG = { kc: 'Khung chung', cm: 'Ngạch chuyên môn', ql: 'Ngạch quản lý' };

/** Điểm của MỘT câu trong kỳ. */
function _diemMotCau_(c, sv, cfg) {
  var vp = 0, gn = 0;
  (sv || []).forEach(function (e) {
    if (e.type === 'vi_pham' && !e.isBoundary) vp++;
    else if (e.type === 'ghi_nhan') gn++;
  });
  var khoi = c.mode === 'ghi_nhan' ? cfg.khoiGhiNhan : cfg.khoiViPham;
  var tho = khoi + gn * cfg.bonus - vp * cfg.penalty;
  var d = Math.max(cfg.floor, Math.min(cfg.cap, tho));
  return { khoi: khoi, viPham: vp, ghiNhan: gn, tho: tho, diem: d };
}

/** Quy tỷ lệ đạt (0–100) ra Bậc cách làm việc 1–5. */
function _bacTheoTyLe_(tyLe, cfg) {
  if (tyLe === null || tyLe === undefined) return null;
  var bac = 1;
  (cfg.nguongBac || []).forEach(function (n, i) { if (tyLe >= n) bac = i + 1; });
  return bac;
}

/** Sự việc ĐÃ DUYỆT của một người trong một kỳ. */
function _suVienCua_(db, userId, ky) {
  return (db.records || []).filter(function (r) {
    return r.subjectId === userId && r.status === 'approved' &&
           (!ky || r.period === ky);
  });
}

/**
 * Tính điểm đầy đủ cho một người trong một kỳ.
 * Trả về từng khung: điểm đạt / tối đa / tỷ lệ, và điểm tổng + bậc.
 */
function _tinhDiem_(db, u, ky) {
  var cfg = _thamSoDiem_(db);
  var cs = _boCauCua_(db, u);
  var evs = _suVienCua_(db, u.id, ky);

  var theoCau = {};
  evs.forEach(function (e) {
    if (!theoCau[e.critId]) theoCau[e.critId] = [];
    theoCau[e.critId].push(e);
  });

  var diemCau = {};
  cs.forEach(function (c) { diemCau[c.id] = _diemMotCau_(c, theoCau[c.id], cfg); });

  var khung = ['kc', 'cm', 'ql'].map(function (k) {
    var ds = cs.filter(function (c) { return _khungCua_(c) === k; });
    if (!ds.length) return null;
    var dat = 0, khoiDat = 0, vp = 0, gn = 0;
    ds.forEach(function (c) {
      var d = diemCau[c.id];
      dat += d.diem;
      khoiDat += d.khoi;
      vp += d.viPham; gn += d.ghiNhan;
    });
    var toiDa = ds.length * cfg.cap;
    var tb = ds.length ? dat / ds.length : null;
    return {
      k: k, ma: MA_KHUNG[k], ten: TEN_KHUNG[k],
      soCau: ds.length, soDoGhiNhan: ds.filter(function (c) { return c.mode === 'ghi_nhan'; }).length,
      dat: dat, toiDa: toiDa, khoiDat: khoiDat,
      tb: tb, khoiTb: ds.length ? khoiDat / ds.length : null,
      tyLe: tb === null || !cfg.cap ? null : tb / cfg.cap * 100,
      viPham: vp, ghiNhan: gn
    };
  }).filter(function (x) { return !!x; });

  var bang = _laQuanLy_(u) ? cfg.tsQL : cfg.ts;
  var co = khung.filter(function (x) { return x.tb !== null && (bang[x.k] || 0) > 0; });
  var tongTS = 0;
  co.forEach(function (x) { tongTS += bang[x.k]; });
  khung.forEach(function (x) { x.ts = bang[x.k] || 0; });

  // Ghép ĐIỂM các khung theo trọng số — cả ba cùng thang 0–5, đúng như phiếu.
  var tbNgach = null, tyLeTong = null, datTong = 0, toiDaTong = 0;
  if (tongTS) {
    var s = 0;
    co.forEach(function (x) { s += x.tb * bang[x.k]; datTong += x.dat; toiDaTong += x.toiDa; });
    tbNgach = s / tongTS;
    tyLeTong = cfg.cap ? tbNgach / cfg.cap * 100 : null;
  }

  var baoMat = evs.some(function (e) { return /^BM/i.test(String(e.critCode || '')); });
  var bacTho = _bacTheoTyLe_(tyLeTong, cfg);
  var bac = bacTho === null ? null : Math.max(1, bacTho - (baoMat ? 1 : 0));

  return {
    khung: khung, tyLeTong: tyLeTong, datTong: datTong, toiDaTong: toiDaTong,
    diemThang5: tbNgach,
    bac: bac, bacTho: bacTho, viPhamBaoMat: baoMat,
    laQuanLy: _laQuanLy_(u), soSuViec: evs.length,
    soViPham: evs.filter(function (e) { return e.type === 'vi_pham' && !e.isBoundary; }).length,
    soGhiNhan: evs.filter(function (e) { return e.type === 'ghi_nhan'; }).length,
    diemCau: diemCau
  };
}

/* ---- Ba hàm cho Sheet gọi ---- */

/** Danh sách nhân sự để Sheet đổ vào ô chọn. Không kèm mật khẩu. */
function danhSachNhanSu(kemThu) {
  var db = _docDB_();
  if (!db) return { ok: false, loi: 'Chưa có dữ liệu.' };
  var boPhan = {}, diem = {}, tuyen = {};
  (db.depts  || []).forEach(function (d) { boPhan[d.id] = d.name; });
  (db.sites  || []).forEach(function (s) { diem[s.id]   = s.name; });
  (db.tracks || []).forEach(function (t) { tuyen[t.id]  = t.name; });
  var ds = (db.users || []).filter(function (u) {
    return u.active !== false && _laNguoiThat_(u, kemThu !== false);
  }).map(function (u) {
    return {
      id: u.id, ma: u.code || '', ten: u.name || '', viTri: u.titleVi || '',
      boPhan: boPhan[u.deptId] || '', diemLamViec: diem[u.siteId] || '',
      tuyen: tuyen[u.trackId] || '', capBac: TEN_CAP[u.level] || '',
      laQuanLy: _laQuanLy_(u), laThu: !!u.demo
    };
  });
  return { ok: true, soNguoi: ds.length, ds: ds, layLuc: new Date().toISOString() };
}

/**
 * Toàn bộ phiếu của MỘT người trong MỘT kỳ:
 * khối thông tin, bộ câu áp dụng theo đúng thứ tự, bằng chứng từng câu, và điểm.
 * @param ai  mã nhân sự (TTX001) hoặc id (u_demo) — nhận cả hai
 */
function docPhieuMotNguoi(ai, ky) {
  var db = _docDB_();
  if (!db) return { ok: false, loi: 'Chưa có dữ liệu.' };

  var khoa = String(ai || '').trim().toUpperCase();
  var u = null;
  (db.users || []).forEach(function (x) {
    if (u) return;
    if (x.id === ai || String(x.code || '').toUpperCase() === khoa) u = x;
  });
  if (!u) return { ok: false, loi: 'Không tìm thấy nhân sự "' + ai + '".' };
  if (!_laNguoiThat_(u, true)) return { ok: false, loi: 'Đây là tài khoản máy, không có phiếu.' };

  var boPhan = {}, diem = {}, tuyen = {};
  (db.depts  || []).forEach(function (d) { boPhan[d.id] = d.name; });
  (db.sites  || []).forEach(function (s) { diem[s.id]   = s.name; });
  (db.tracks || []).forEach(function (t) { tuyen[t.id]  = t.name; });

  var thang = String(ky || '').split('-');
  var tenKy = thang[1] ? 'Tháng ' + Number(thang[1]) + '/' + thang[0] : (ky || '');

  var bc = _gomBangChung_(db, u.id, ky);
  var st = _tinhDiem_(db, u, ky);
  var cs = _boCauCua_(db, u);

  var cau = cs.map(function (c) {
    var d = st.diemCau[c.id] || { diem: 0, viPham: 0, ghiNhan: 0 };
    return {
      ma: c.code || '', nhom: c.group || '', maNhom: c.gcode || '',
      noiDung: c.text || '', kieu: c.mode === 'ghi_nhan' ? 'ghi nhận' : 'đo lỗi',
      khung: MA_KHUNG[_khungCua_(c)] || '', tenKhung: TEN_KHUNG[_khungCua_(c)] || '',
      diem: d.diem, soViPham: d.viPham, soGhiNhan: d.ghiNhan,
      bangChung: bc[c.code] || ''
    };
  });

  return {
    ok: true,
    ky: ky || '', tenKy: tenKy,
    thongTin: {
      'Mã NV': u.code || '', 'Họ và tên': u.name || '',
      'Vị trí': u.titleVi || '', 'Phòng ban': boPhan[u.deptId] || '',
      'Điểm làm việc': diem[u.siteId] || '', 'Tuyến': tuyen[u.trackId] || '',
      'Vai trò quản lý': TEN_CAP[u.level] || '', 'Kỳ đánh giá': tenKy
    },
    cau: cau,
    khung: st.khung,
    tyLeTong: st.tyLeTong, datTong: st.datTong, toiDaTong: st.toiDaTong,
    diemThang5: st.diemThang5, bac: st.bac, bacTho: st.bacTho,
    viPhamBaoMat: st.viPhamBaoMat, laQuanLy: st.laQuanLy,
    soSuViec: st.soSuViec, soViPham: st.soViPham, soGhiNhan: st.soGhiNhan,
    layLuc: new Date().toISOString()
  };
}

/** Điểm và bậc của TẤT CẢ nhân sự trong một kỳ — cho trang Tổng hợp. */
function bangDiemCaKy(ky, kemThu) {
  var db = _docDB_();
  if (!db) return { ok: false, loi: 'Chưa có dữ liệu.' };
  var tuyen = {};
  (db.tracks || []).forEach(function (t) { tuyen[t.id] = t.name; });
  var ds = (db.users || []).filter(function (u) {
    return u.active !== false && _laNguoiThat_(u, kemThu !== false);
  }).map(function (u) {
    var st = _tinhDiem_(db, u, ky);
    var o = {
      ma: u.code || '', ten: u.name || '', viTri: u.titleVi || '',
      tuyen: tuyen[u.trackId] || '', capBac: TEN_CAP[u.level] || '',
      laQuanLy: st.laQuanLy,
      tyLe: st.tyLeTong, dat: st.datTong, toiDa: st.toiDaTong,
      bac: st.bac, soSuViec: st.soSuViec,
      soViPham: st.soViPham, soGhiNhan: st.soGhiNhan
    };
    ['kc', 'cm', 'ql'].forEach(function (k) {
      var x = null;
      st.khung.forEach(function (y) { if (y.k === k) x = y; });
      o[k] = x ? { dat: x.dat, toiDa: x.toiDa, tyLe: x.tyLe, ts: x.ts } : null;
    });
    return o;
  });
  ds.sort(function (a, b) { return (b.tyLe || -1) - (a.tyLe || -1); });
  return { ok: true, ky: ky || '', soNguoi: ds.length, ds: ds,
           layLuc: new Date().toISOString() };
}

/** Sổ sự việc cả kỳ, mỗi sự việc một dòng — cho trang Bằng chứng. */
function soSuViecCaKy(ky, kemThu) {
  var db = _docDB_();
  if (!db) return { ok: false, loi: 'Chưa có dữ liệu.' };
  return {
    ok: true, ky: ky || '',
    cot: COT_CHUNG_CU,
    dong: _bangChungCu_(db, ky, ky, true, kemThu !== false),
    layLuc: new Date().toISOString()
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   XUẤT KẾT QUẢ THÁNG RA MỘT GOOGLE SHEET RIÊNG

   Mỗi tháng một file trong thư mục của app. KHÔNG bao giờ ghi vào file Phiếu
   đánh giá của Nhà — file đó có menu 📥 Thu kết quả một đợt cũng ghi vào cùng
   trang, hai bên đạp nhau là mất kết quả hội đồng đã chấm.

   File xuất có hai trang:
     📊 Tổng hợp kỳ   đúng 17 cột của mẫu, mỗi người một dòng
     📋 Bằng chứng    mỗi biên bản hoặc phiếu ghi nhận một dòng
   ═══════════════════════════════════════════════════════════════════════════ */

/** Thư mục chứa các file kết quả tháng. Có rồi thì dùng lại. */
function _thuMucKetQua_(idThuMucCha) {
  var cha = idThuMucCha ? DriveApp.getFolderById(_layId_(idThuMucCha)) : _thuMucGoc_();
  var ten = 'Kết quả tháng';
  var co = cha.getFoldersByName(ten);
  return co.hasNext() ? co.next() : cha.createFolder(ten);
}

function _tenFileKetQua_(ky, tenDot) {
  var t = String(ky || '').split('-');
  var nhan = t[1] ? 'Tháng ' + Number(t[1]) + '.' + t[0] : (ky || 'không rõ kỳ');
  return 'Tổng hợp kỳ — ' + nhan + (tenDot && tenDot !== ky ? ' · ' + tenDot : '');
}

/** Ghi một bảng vào sheet: dòng tiêu đề in đậm, cố định, tự giãn cột. */
function _dungTrangKetQua_(sh, tieu, cot, dong, chuThich) {
  sh.clear();
  sh.getRange(1, 1).setValue(tieu).setFontSize(13).setFontWeight('bold');
  if (chuThich) sh.getRange(2, 1).setValue(chuThich).setFontColor('#7a756a');
  sh.getRange(3, 1, 1, cot.length).setValues([cot])
    .setFontWeight('bold').setBackground('#eceff4');
  if (dong.length) sh.getRange(4, 1, dong.length, cot.length).setValues(dong);
  sh.setFrozenRows(3);
  for (var c = 1; c <= cot.length; c++) sh.autoResizeColumn(c);
  return dong.length;
}

/**
 * Xuất kết quả một kỳ ra Google Sheet riêng.
 * Cùng kỳ chạy lại thì GHI ĐÈ chính file đó, không sinh file trùng.
 */
function xuatGoogleSheetThang(token, ky, tenDot, chiDaDuyet, chiNguoiCoViec, idThuMuc, kemThu) {
  _batBuocVai_(token, 'xuat');
  var db = _docDB_();
  if (!db) return { ok: false, loi: 'Chưa có dữ liệu.' };
  if (!ky) return { ok: false, loi: 'Chưa chọn kỳ.' };

  var duyet = chiDaDuyet !== false;
  var td = _bangTongHop_(db, ky, tenDot, duyet, !!chiNguoiCoViec, !!kemThu);
  var cc = _bangChungCu_(db, ky, tenDot, duyet, !!kemThu);

  var thuMuc, ten = _tenFileKetQua_(ky, tenDot), ss, moi = false;
  try { thuMuc = _thuMucKetQua_(idThuMuc); }
  catch (e) { return { ok: false, loi: 'Không mở được thư mục đích. ' + e.message }; }

  var co = thuMuc.getFilesByName(ten);
  if (co.hasNext()) {
    ss = SpreadsheetApp.openById(co.next().getId());
  } else {
    ss = SpreadsheetApp.create(ten);
    var f = DriveApp.getFileById(ss.getId());
    thuMuc.addFile(f);
    try { DriveApp.getRootFolder().removeFile(f); } catch (e2) {}
    moi = true;
  }

  var t = ss.getSheetByName('📊 Tổng hợp kỳ') || ss.insertSheet('📊 Tổng hợp kỳ');
  var b = ss.getSheetByName('📋 Bằng chứng')  || ss.insertSheet('📋 Bằng chứng');

  _dungTrangKetQua_(t, '📊 TỔNG HỢP KỲ — ' + _tenFileKetQua_(ky, tenDot),
    COT_TONG_HOP, td,
    td.length + ' người · điểm và bậc do app tính theo đúng công thức Phiếu đánh giá tháng. ' +
    'Hai cột Bậc ngạch để trống vì phiếu đã bỏ hai dòng đó từ 31/8/2026.');

  _dungTrangKetQua_(b, '📋 BẰNG CHỨNG — ' + _tenFileKetQua_(ky, tenDot),
    COT_CHUNG_CU, cc,
    cc.length + ' sự việc đã duyệt trong kỳ.');

  // Bỏ trang Sheet1 mà Google tự tạo
  ss.getSheets().forEach(function (sh) {
    var n = sh.getName();
    if ((n === 'Sheet1' || n === 'Trang tính1') && ss.getSheets().length > 1) {
      try { ss.deleteSheet(sh); } catch (e3) {}
    }
  });

  return {
    ok: true, moi: moi, ten: ten,
    soNguoi: td.length, soSuViec: cc.length,
    url: ss.getUrl(), id: ss.getId(),
    thuMuc: thuMuc.getName(), urlThuMuc: thuMuc.getUrl(),
    thongBao: (moi ? 'Đã tạo ' : 'Đã cập nhật ') + ten + ': ' +
      td.length + ' người, ' + cc.length + ' sự việc.'
  };
}

/** Xem trước đúng những gì sẽ ghi, không tạo file nào. */
function xemTruocGoogleSheet(token, ky, tenDot, chiDaDuyet, chiNguoiCoViec, kemThu) {
  _batBuocVai_(token, 'xuat');
  var db = _docDB_();
  if (!db) return { ok: false, loi: 'Chưa có dữ liệu.' };
  var duyet = chiDaDuyet !== false;
  var td = _bangTongHop_(db, ky, tenDot, duyet, !!chiNguoiCoViec, !!kemThu);
  var cc = _bangChungCu_(db, ky, tenDot, duyet, !!kemThu);
  return {
    ok: true, ten: _tenFileKetQua_(ky, tenDot),
    cotTongHop: COT_TONG_HOP, soNguoi: td.length, mauTongHop: td.slice(0, 6),
    cotChungCu: COT_CHUNG_CU, soSuViec: cc.length, mauChungCu: cc.slice(0, 4)
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   ĐIỀN PHIẾU ĐỜI MỚI — loại có trang _log và cột Thuộc phạm vi

   Phiếu đời mới tự tính lấy điểm ba khung, điểm tổng, bậc và ranh giới bằng
   công thức của chính nó. App chỉ ghi NGUYÊN LIỆU vào sáu chỗ:

     1. G2:G5   bốn cờ phạm vi: thứ hạng cấp, nhóm ngôn ngữ, điểm bán, quản lý
     2. C14:C21 khối thông tin nhân sự
     3. cột 6   Thuộc phạm vi — Có/Không THEO TỪNG NGƯỜI. Bắt buộc ghi lại:
                mẫu đúc sẵn cho một hình dạng, để nguyên là chấm nhầm câu.
     4. cột 3   Điểm từng câu, app tính từ biên bản và ghi nhận
     5. cột 5   Sự việc, để hội đồng đọc ngay tại dòng đó
     6. _log    mỗi biên bản hoặc phiếu ghi nhận một dòng

   Công thức COUNTIFS của phiếu hard-code chuỗi "T01", nên _log ghi Tháng là
   "T01" bất kể kỳ nào. Mỗi người mỗi tháng một file, tên file mang tháng thật.
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Bản đồ cột do CHÍNH PHIẾU khai ở trang _chiMuc.
 * Cột "Thuộc phạm vi" là cột ẩn KHÔNG có tiêu đề, dò theo tiêu đề không ra —
 * nên phải đọc bản đồ này. Không có _chiMuc thì trả về {} và quay lại dò tiêu đề.
 */
function _banDoCot_(ss) {
  var sh = ss.getSheetByName('_chiMuc');
  if (!sh || sh.getLastRow() < 2) return {};
  var o = sh.getRange(1, 1, Math.min(sh.getLastRow(), 40),
                      Math.max(sh.getLastColumn(), 3)).getValues();
  var m = {};
  var doi = { cot_ma: 'ma', cot_diem: 'diem', cot_so_bien_ban: 'soBienBan',
              cot_su_viec: 'suViec', cot_pham_vi: 'phamVi' };
  o.forEach(function (r) {
    var k = String(r[0] || '').trim();
    var c = Number(r[2]);
    if (doi[k] && c > 0) m[doi[k]] = c;
  });
  return m;
}

/**
 * Tìm cột "Thuộc phạm vi" bằng chính NỘI DUNG của nó: cột ẩn không có tiêu đề,
 * ô nào cũng là Có hoặc Không.
 *
 * _chiMuc khai cột bằng SỐ TUYỆT ĐỐI. Ai chèn thêm một cột vào phiếu là con số
 * đó trỏ lệch, app ghi Có/Không vào nhầm cột và người ta bị chấm sai bộ câu.
 * Nên số lấy từ _chiMuc chỉ là gợi ý, phải soi lại nội dung mới tin.
 */
function _timCotPhamVi_(o, bang, goiY) {
  var dau = bang[0].dong, cuoi = o.length;
  var demCot = function (c) {
    var co = 0, khac = 0;
    for (var r = dau; r < cuoi; r++) {
      var v = String((o[r] || [])[c - 1] || '').trim();
      if (!v) continue;
      if (v === 'Có' || v === 'Không') co++; else khac++;
    }
    return { co: co, khac: khac };
  };

  if (goiY) {
    var g = demCot(goiY);
    if (g.co >= 10 && g.co > g.khac * 3) return goiY;   // gợi ý đúng, dùng luôn
  }
  var tot = 0, diem = 0;
  var rong = 0;
  o.forEach(function (r) { if (r && r.length > rong) rong = r.length; });
  for (var c = 1; c <= Math.min(rong, 20); c++) {
    var d = demCot(c);
    if (d.co >= 10 && d.co > d.khac * 3 && d.co > diem) { diem = d.co; tot = c; }
  }
  return tot || goiY || 0;
}

/** Nhãn cờ phạm vi trong phiếu → lấy giá trị từ đâu. Dò theo nhãn, không theo ô. */
function _coPhamVi_(db, u) {
  var s = null;
  (db.sites || []).forEach(function (x) { if (x.id === u.siteId) s = x; });
  return {
    'thứ hạng cấp':                 _bacCapCua_(u),
    'nhóm ngôn ngữ':                u.hearing === 'deaf' ? 'Người điếc/ khiếm thính' : 'Người nói',
    'có đầu việc tại điểm bán':     (s && s.isPos) ? 'Có' : 'Không',
    'có giữ vai trò quản lý':       _laQuanLy_(u) ? 'Có' : 'Không'
  };
}

/* Thang cấp bậc. Chép đúng bảng CAP_BAC ở 03_DuLieuTuyen.gs của file gốc —
   cột số KHÔNG phải thang đo, chỉ là thứ hạng để so "từ cấp này trở lên".
   Chuyên viên xếp NGANG Lead bộ phận: cùng bậc 4, cùng tiền. */
var BAC_CAP_GS = {
  founder: 9, ceo: 8, clevel: 7, head: 6,
  manager: 5,   // Quản lý khối
  expert:  5,   // Chuyên gia
  lead:    4,   // Lead bộ phận
  senior:  4,   // Chuyên viên — ngang Lead
  shift:   3,   // Trưởng ca
  staff:   2,   // Nhân viên
  intern:  1    // Tập sự
};
function _bacCapCua_(u) { return (u && BAC_CAP_GS[u.level]) || 0; }

/** Nhãn khối thông tin của phiếu đời mới → giá trị. */
function _thongTinPhieuMoi_(db, u, ky) {
  var boPhan = {}, diem = {}, tuyen = {};
  (db.depts  || []).forEach(function (d) { boPhan[d.id] = d.name; });
  (db.sites  || []).forEach(function (s) { diem[s.id]   = s.name; });
  (db.tracks || []).forEach(function (t) { tuyen[t.id]  = t.name; });
  var th = String(ky || '').split('-');
  var tenKy = th[1] ? 'Tháng ' + Number(th[1]) + '/' + th[0] : (ky || '');
  return {
    'Mã nhân sự':      u.code || '',
    'Mã NV':           u.code || '',
    'Họ và tên':       u.name || '',
    'Vị trí':          u.titleVi || '',
    'Cấp':             TEN_CAP[u.level] || '',
    'Phòng ban':       boPhan[u.deptId] || '',
    'Điểm làm việc':   diem[u.siteId] || '',
    'Tuyến':           tuyen[u.trackId] || '',
    'Tháng đánh giá':  tenKy,
    'Kỳ đánh giá':     tenKy
  };
}

/** Ghi bốn cờ phạm vi. Dò nhãn ở khối trên cùng, giá trị ghi vào ô liền bên phải. */
function _ghiCoPhamVi_(sh, co) {
  var het = Math.min(sh.getLastRow(), 12);
  var rong = Math.min(sh.getLastColumn(), 10);
  if (het < 1 || rong < 2) return 0;
  var o = sh.getRange(1, 1, het, rong).getValues();
  var da = 0;
  for (var r = 0; r < het; r++) {
    for (var c = 0; c < rong - 1; c++) {
      var k = _chuan_(o[r][c]);
      if (!k) continue;
      for (var nhan in co) {
        if (k === _chuan_(nhan)) {
          sh.getRange(r + 1, c + 2).setValue(co[nhan]);
          da++;
        }
      }
    }
  }
  return da;
}

/**
 * Điền MỘT phiếu đời mới cho một người trong một kỳ.
 * Trả về đã ghi được bao nhiêu ô ở từng phần, và những mã câu phiếu không có.
 */
function _dienPhieuMoi_(ss, db, u, ky) {
  var cfg = _thamSoDiem_(db);
  var cs  = _boCauCua_(db, u);
  var st  = _tinhDiem_(db, u, ky);
  var bc  = _gomBangChung_(db, u.id, ky);

  var trongPhamVi = {};
  cs.forEach(function (c) { trongPhamVi[c.code] = true; });

  var ket = { co: 0, thongTin: 0, phamVi: 0, diem: 0, suViec: 0, log: 0, thieu: [] };
  var co = _coPhamVi_(db, u);
  var tt = _thongTinPhieuMoi_(db, u, ky);
  var banDoCot = _banDoCot_(ss);   // phiếu tự khai, dùng cho cột ẩn không có tiêu đề

  ss.getSheets().forEach(function (sh) {
    var ten = sh.getName();
    if (ten.charAt(0) === '_' || ten.indexOf('⚙') === 0) return;   // trang máy dùng
    if (sh.getLastRow() < 2 || sh.getLastColumn() < 2) return;

    var o = sh.getRange(1, 1, sh.getLastRow(), sh.getLastColumn()).getValues();
    var bang = _doBangPhieu_(o);
    if (!bang.length) return;

    ket.co += _ghiCoPhamVi_(sh, co);

    var banDoTT = _doKhoiThongTin_(o, Math.min(o.length, 30), Math.min(o[0].length, 6));
    for (var nhan in tt) {
      if (!tt[nhan]) continue;
      var vt = _oCuaNhan_(banDoTT, nhan);
      if (!vt) continue;
      sh.getRange(vt.dong, vt.cot).setValue(tt[nhan]);
      ket.thongTin++;
    }

    var banDo = _doMaCauPhieu_(o, bang);
    // Gom theo cột rồi ghi một lần mỗi cột — đỡ tốn lượt gọi Sheets.
    var theoCot = {};
    var xepVao = function (cot, dong, giaTri) {
      if (!cot) return false;
      if (!theoCot[cot]) theoCot[cot] = [];
      theoCot[cot].push({ dong: dong, v: giaTri });
      return true;
    };

    // Cột phạm vi soi lại bằng nội dung — số trong _chiMuc lệch là chấm sai người.
    var cotPV = _timCotPhamVi_(o, bang, banDoCot.phamVi);

    for (var ma in banDo) {
      var vtc = banDo[ma], c = vtc.cot;
      // Bổ sung những cột phiếu khai ở _chiMuc mà hàng tiêu đề không có.
      for (var vai in banDoCot) if (!c[vai]) c[vai] = banDoCot[vai];
      if (cotPV) c.phamVi = cotPV;
      var thuoc = !!trongPhamVi[ma];

      if (xepVao(c.phamVi, vtc.dong, thuoc ? 'Có' : 'Không')) ket.phamVi++;

      if (thuoc) {
        var cau = null;
        cs.forEach(function (x) { if (x.code === ma) cau = x; });
        var d = cau && st.diemCau[cau.id];
        if (d && xepVao(c.diem, vtc.dong, d.diem)) ket.diem++;
      } else if (c.diem) {
        // Ngoài phạm vi thì xoá điểm, kẻo còn số của hình dạng phiếu mẫu.
        xepVao(c.diem, vtc.dong, '');
      }

      if (bc[ma] && xepVao(c.suViec || c.bangChung, vtc.dong, bc[ma])) ket.suViec++;
    }

    for (var sc in theoCot) {
      var soCot = Number(sc);
      var giaTri = sh.getRange(1, soCot, o.length, 1).getValues();
      theoCot[sc].forEach(function (x) { giaTri[x.dong - 1][0] = x.v; });
      sh.getRange(1, soCot, o.length, 1).setValues(giaTri);
    }

    // Mã câu app có mà phiếu không có dòng nào
    for (var m2 in bc) if (!banDo[m2] && ket.thieu.indexOf(m2) < 0) ket.thieu.push(m2);
  });

  ket.trongSo = _ghiTrongSo_(ss, db, u);
  ket.log = _ghiLog_(ss, db, u, ky);
  return ket;
}

/**
 * Đặt lại bộ TRỌNG SỐ cho đúng người.
 *
 * Mẫu phiếu Trưởng phòng hard-code bộ "CÓ ngạch quản lý" vào ba ô trọng số
 * (TS_TS_VH2 · TS_TS_CM2 · TS_TS_QL2). Dùng nguyên cho một nhân viên thì
 * ngạch quản lý bằng 0 vẫn bị nhân 30%, điểm tổng tụt hẳn một bậc rưỡi —
 * thử thật với Nguyễn Văn Test: 4,42 tụt còn 3,08.
 *
 * Ba ô đó nằm ngay bên phải ba ô điểm khung, mà _chiMuc khai sẵn dòng và cột.
 * Ghi tên dải chứ không ghi số, để Nhà sửa ⚙️ Tham số thì phiếu vẫn theo.
 */
function _ghiTrongSo_(ss, db, u) {
  var vt = _viTriTrongSo_(ss);
  if (!vt.kc) return 0;

  var laQL = _laQuanLy_(u);
  var ts = laQL
    ? { kc: '=TS_TS_VH2', cm: '=TS_TS_CM2', ql: '=TS_TS_QL2' }
    : { kc: '=TS_TS_VH1', cm: '=TS_TS_CM1', ql: 0 };

  // Trang nào có bảng chấm thì trang đó có khối kết quả.
  var da = 0;
  ss.getSheets().forEach(function (s2) {
    var n = s2.getName();
    if (n.charAt(0) === '_' || n.indexOf('⚙') === 0) return;
    if (s2.getLastRow() < 10) return;
    var o2 = s2.getRange(1, 1, Math.min(s2.getLastRow(), 60), s2.getLastColumn()).getValues();
    if (!_doBangPhieu_(o2).length) return;
    for (var k in vt) {
      if (ts[k] === undefined) continue;
      s2.getRange(vt[k].dong, vt[k].cot).setValue(ts[k]);
      da++;
    }
  });
  return da;
}

/** Ghi các sự việc đã duyệt vào trang _log. Xoá dòng cũ của kỳ trước rồi ghi lại. */
function _ghiLog_(ss, db, u, ky) {
  var sh = _timTrangLog_(ss);
  if (!sh) return 0;

  var LOAI = { vi_pham: 'Vi phạm', ghi_nhan: 'Ghi nhận' };
  var evs = _suVienCua_(db, u.id, ky).filter(function (r) { return !!r.critCode; });
  var cfg = _thamSoDiem_(db);
  var st  = _tinhDiem_(db, u, ky);
  var theoMa = {};
  (db.criteria || []).forEach(function (c) { theoMa[c.code] = c; });

  var dong = evs.map(function (r) {
    var c = theoMa[r.critCode];
    var d = c && st.diemCau[c.id];
    return [
      'T01',                                    // Tháng — công thức phiếu hard-code T01
      _dinhDangGio_(r.xayRaLuc || r.createdAt), // Ngày
      LOAI[r.type] || r.type,                   // Loại
      r.critCode,                               // Mã câu
      String(r.detail || '').slice(0, 400),     // Sự việc
      r.id || '',                               // Số hiệu
      (function () {                            // Người lập
        var n = '';
        (db.users || []).forEach(function (x) { if (x.id === r.reporterId) n = x.name; });
        return n;
      })(),
      d ? d.diem : ''                           // Điểm áp
    ];
  });

  if (sh.getLastRow() > 1) {
    sh.getRange(2, 1, sh.getLastRow() - 1, Math.max(sh.getLastColumn(), 8)).clearContent();
  }
  if (dong.length) sh.getRange(2, 1, dong.length, 8).setValues(dong);
  return dong.length;
}

/** Phiếu đời mới nhận ra bằng hai dấu: có trang _log và có cột Thuộc phạm vi. */
function _laPhieuDoiMoi_(ss) {
  if (!ss.getSheetByName('_log')) return false;
  if (_banDoCot_(ss).phamVi) return true;
  var co = false;
  ss.getSheets().forEach(function (sh) {
    if (co) return;
    var n = sh.getName();
    if (n.charAt(0) === '_' || n.indexOf('⚙') === 0) return;
    if (sh.getLastRow() < 2 || sh.getLastColumn() < 2) return;
    var o = sh.getRange(1, 1, Math.min(sh.getLastRow(), 60), sh.getLastColumn()).getValues();
    _doBangPhieu_(o).forEach(function (b) { if (b.cot.phamVi) co = true; });
  });
  return co;
}


/* ═══════════════════════════════════════════════════════════════════════════
   LỌC THAY ĐỔI — máy chủ quyết định ai được sửa gì

   App gửi CẢ kho dữ liệu lên mỗi lần lưu. Nếu nhận nguyên thì bất kỳ ai cũng
   sửa được mọi thứ rồi gửi lên. Hàm này so bản mới với bản cũ và chỉ nhận
   những thay đổi hợp lệ với vai của người gọi; phần còn lại lấy nguyên bản cũ.

   Luật:
     · mọi người   lập biên bản và phiếu ghi nhận đứng tên CHÍNH MÌNH,
                   gửi kháng nghị cho sự việc của chính mình
     · phòng NS    duyệt hoặc từ chối, xử kháng nghị
     · quản trị    mọi thứ còn lại — nhân sự, tiêu chí, tuyến, tham số
   ═══════════════════════════════════════════════════════════════════════════ */

/** Những nhánh chỉ quản trị được đụng. */
var NHANH_QUAN_TRI = ['users', 'criteria', 'tracks', 'depts', 'sites', 'settings', 'reviews'];

/** Chép một bản ghi, bỏ trường máy tự đặt, để so cho gọn. */
function _chuKy_(r) {
  var o = {};
  ['type', 'subjectId', 'reporterId', 'critId', 'critCode', 'isBoundary',
   'detail', 'xayRaLuc', 'period', 'createdAt'].forEach(function (k) {
    o[k] = r ? r[k] : undefined;
  });
  return JSON.stringify(o);
}

function _locThayDoi_(cu, moi, me) {
  var ra = JSON.parse(JSON.stringify(cu));
  var laHR = _laHR_(me);

  // 1. Nhánh quản trị: giữ nguyên bản cũ, bỏ qua mọi thứ người gọi gửi lên.
  NHANH_QUAN_TRI.forEach(function (k) { ra[k] = cu[k]; });

  // 2. Sự việc: xét từng bản ghi một.
  var cuTheoId = {};
  (cu.records || []).forEach(function (r) { cuTheoId[r.id] = r; });

  var raRecords = [];
  (moi.records || []).forEach(function (r) {
    var truoc = cuTheoId[r.id];

    if (!truoc) {
      // Bản ghi MỚI — chỉ nhận nếu người gọi đứng tên người lập.
      if (r.reporterId !== me.id) return;
      // Không cho tự duyệt sẵn: trạng thái do máy chốt lại.
      var sach = JSON.parse(JSON.stringify(r));
      sach.kyNS = null;
      sach.tuChoi = null;
      if (sach.type !== 'vi_pham') sach.status = 'pending';
      raRecords.push(sach);
      return;
    }

    // Bản ghi CŨ — phần thân không ai được sửa.
    var giu = JSON.parse(JSON.stringify(truoc));
    if (_chuKy_(r) !== _chuKy_(truoc)) { raRecords.push(giu); return; }

    if (laHR) {
      // Phòng Nhân sự: duyệt, từ chối, xử kháng nghị.
      giu.kyNS = r.kyNS;
      giu.tuChoi = r.tuChoi;
      giu.status = r.status;
      if (r.khieuNai && giu.khieuNai) giu.khieuNai = r.khieuNai;
    } else if (r.subjectId === me.id) {
      // Người bị lập biên bản: chỉ được GỬI kháng nghị, không xoá cái đã có.
      if (r.khieuNai && !truoc.khieuNai) giu.khieuNai = r.khieuNai;
    }
    raRecords.push(giu);
  });

  // Bản ghi cũ mà bản mới bỏ đi: giữ lại. Chỉ quản trị mới xoá được sự việc.
  var coTrongMoi = {};
  raRecords.forEach(function (r) { coTrongMoi[r.id] = true; });
  (cu.records || []).forEach(function (r) {
    if (!coTrongMoi[r.id]) raRecords.push(r);
  });

  ra.records = raRecords;
  return ra;
}

/* ═══════════════════════════════════════════════════════════════════════════
   NẠP DỮ LIỆU BAN ĐẦU TỪ MỘT TỆP TRÊN DRIVE

   Cách cũ là dán cả chuỗi JSON vào giữa hai dấu nháy trong code. Tệp dữ liệu
   nay hơn 200 KB nên dán vào là trình soạn thảo ì ra. Cách này gọn hơn: kéo
   tệp .json lên Drive, chép ID rồi chạy hàm.
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Nạp DuLieu_DanhGiaNhanSu.json từ Drive vào kho của app.
 * GHI ĐÈ toàn bộ dữ liệu đang có, nên tự sao lưu trước một bản.
 *
 * Cách chạy: sửa idTep bên dưới rồi bấm Chạy, hoặc gọi napTuTepDrive('<id>').
 */
function napTuTepDrive(idTep) {
  var id = idTep || '';          // ← dán ID tệp .json vào đây rồi bấm Chạy
  if (!id) {
    Logger.log('Chưa có ID tệp. Mở tệp .json trên Drive, chép đoạn giữa /d/ và /view,');
    Logger.log('dán vào biến id trong hàm này rồi chạy lại.');
    return;
  }
  var tep;
  try { tep = DriveApp.getFileById(_layId_(id)); }
  catch (e) { Logger.log('❌ Không mở được tệp. Kiểm tra ID và quyền xem.'); return; }

  var db;
  try { db = JSON.parse(tep.getBlob().getDataAsString('UTF-8')); }
  catch (e) { Logger.log('❌ Tệp không phải JSON hợp lệ: ' + e.message); return; }

  if (!db || !db.users || !db.criteria) {
    Logger.log('❌ Tệp thiếu users hoặc criteria. Không giống tệp dữ liệu của app.');
    return;
  }

  // Sao lưu bản đang có trước khi đè, để còn đường lùi.
  var cu = _docDB_();
  if (cu) {
    var ten = 'SaoLuu_TruocKhiNap_' +
      Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd_HHmm') + '.json';
    _thuMucGoc_().createFile(ten, JSON.stringify(cu), 'application/json');
    Logger.log('📦 Đã sao lưu bản cũ: ' + ten);
  }

  _ghiDB_(db);

  var dangDung = (db.criteria || []).filter(function (c) { return c.active !== false; }).length;
  var admin = (db.users || []).filter(function (u) { return u.role === 'admin'; })
                              .map(function (u) { return u.code; });
  Logger.log('✅ Đã nạp xong.');
  Logger.log('   ' + (db.users || []).length + ' nhân sự · ' +
             dangDung + ' câu đang dùng · ' +
             (db.records || []).length + ' sự việc');
  Logger.log('   Tài khoản quản trị: ' + admin.join(', '));
  Logger.log('   Kho dữ liệu: ' + _tepDuLieu_().getUrl());
}

/**
 * Xem app đang ở tình trạng nào. Chạy khi nghi có gì đó không đúng.
 */
function kiemTraCaiDat() {
  Logger.log('── KIỂM TRA CÀI ĐẶT ──');

  var f = _tepDuLieu_();
  Logger.log(f ? '✅ Kho dữ liệu: ' + f.getUrl()
               : '❌ Chưa có kho dữ liệu. Chạy caiDatLanDau trước.');

  var db = _docDB_();
  if (db) {
    var dangDung = (db.criteria || []).filter(function (c) { return c.active !== false; }).length;
    Logger.log('   ' + (db.users || []).length + ' nhân sự · ' + dangDung +
               ' câu đang dùng · ' + (db.records || []).length + ' sự việc');
    var admin = (db.users || []).filter(function (u) { return u.role === 'admin'; });
    Logger.log(admin.length ? '✅ Có ' + admin.length + ' tài khoản quản trị: ' +
                 admin.map(function (u) { return u.code; }).join(', ')
               : '❌ KHÔNG CÓ tài khoản quản trị nào — sẽ không ai vào được Quản lý.');
  }

  try { Logger.log('✅ Thư mục app: ' + _thuMucGoc_().getUrl()); }
  catch (e) { Logger.log('❌ Không mở được thư mục app: ' + e.message); }

  try { Logger.log('✅ Thư mục ảnh: ' + _thuMucAnh_().getUrl()); }
  catch (e) { Logger.log('❌ Không tạo được thư mục ảnh: ' + e.message); }

  if (ID_PHIEU_GOC) {
    try { Logger.log('✅ Phiếu đánh giá: ' + SpreadsheetApp.openById(ID_PHIEU_GOC).getName()); }
    catch (e) { Logger.log('⚠️ Chưa mở được Phiếu đánh giá. Kiểm tra ID_PHIEU_GOC và quyền.'); }
  }

  var tr = ScriptApp.getProjectTriggers().map(function (t) { return t.getHandlerFunction(); });
  Logger.log(tr.length ? '   Hẹn giờ đang đặt: ' + tr.join(', ') : '   Chưa đặt hẹn giờ nào.');
  Logger.log('── HẾT ──');
}

/**
 * CỨU HỘ — chạy thẳng từ trình soạn thảo Apps Script, không cần đăng nhập app.
 * Dùng khi không ai vào được Quản lý nữa: quên mật khẩu quản trị, hoặc vừa
 * nạp dữ liệu mới và chưa biết mật khẩu của tài khoản nào.
 *
 * Sửa hai dòng dưới rồi bấm Chạy. Người đó sẽ phải đổi mật khẩu ngay lần
 * đăng nhập kế tiếp.
 */
function datLaiMatKhauCuuHo() {
  var MA_NHAN_SU   = 'ADMIN';     // ← mã của người cần đặt lại
  var MAT_KHAU_MOI = '';          // ← để trống thì dùng mật khẩu tạm 123456

  var db = _docDB_();
  if (!db) { Logger.log('❌ Chưa có kho dữ liệu. Chạy caiDatLanDau trước.'); return; }

  var khoa = String(MA_NHAN_SU || '').trim().toUpperCase();
  var u = null;
  (db.users || []).forEach(function (x) {
    if (!u && String(x.code || '').toUpperCase() === khoa) u = x;
  });
  if (!u) {
    Logger.log('❌ Không có ai mang mã "' + MA_NHAN_SU + '".');
    Logger.log('   Các mã quản trị đang có: ' +
      (db.users || []).filter(function (x) { return x.role === 'admin'; })
                      .map(function (x) { return x.code; }).join(', '));
    return;
  }

  var mk = MAT_KHAU_MOI || MAT_KHAU_TAM;
  _datMatKhau_(u.id, mk, true);
  Logger.log('✅ Đã đặt lại mật khẩu cho ' + u.code + ' — ' + u.name);
  Logger.log('   Mật khẩu tạm: ' + mk);
  Logger.log('   Đăng nhập xong app sẽ bắt đổi mật khẩu ngay.');
}


/**
 * Tìm trang sổ sự việc. Ưu tiên tên _log, không có thì dò theo TIÊU ĐỀ CỘT —
 * đổi tên trang là chuyện người ta hay làm, mất sổ sự việc thì phiếu đếm ra 0
 * biên bản mà không báo gì.
 */
function _timTrangLog_(ss) {
  var sh = ss.getSheetByName('_log');
  if (sh) return sh;
  var tim = null;
  ss.getSheets().forEach(function (s2) {
    if (tim || s2.getLastColumn() < 4) return;
    var h = s2.getRange(1, 1, 1, Math.min(s2.getLastColumn(), 10)).getValues()[0];
    var co = {};
    h.forEach(function (x) { co[_chuan_(x)] = true; });
    if (co['thang'] && co['macau'] && (co['loai'] || co['suviec'])) tim = s2;
  });
  return tim;
}


/**
 * Ba ô trọng số nằm ngay bên phải ba ô điểm khung. Tìm chúng bằng hai đường:
 * _chiMuc khai sẵn dòng và cột, không có thì dò theo NHÃN ở cột bên trái.
 *
 * Mẫu nào bỏ trang _chiMuc thì app mất luôn đường đặt trọng số, và nhân viên
 * bị áp bộ trọng số của quản lý — thử thật: 4,42 tụt còn 4,33.
 */
function _viTriTrongSo_(ss) {
  var vt = {};

  // Đường 1: phiếu tự khai ở _chiMuc.
  var cm = ss.getSheetByName('_chiMuc');
  if (cm && cm.getLastRow() >= 2) {
    var o = cm.getRange(1, 1, Math.min(cm.getLastRow(), 40),
                        Math.max(cm.getLastColumn(), 3)).getValues();
    var doi = { kq_diem_van_hoa: 'kc', kq_diem_chuyen_mon: 'cm', kq_diem_quan_ly: 'ql' };
    o.forEach(function (r) {
      var k = String(r[0] || '').trim();
      if (!doi[k]) return;
      var dong = Number(r[1]), cot = Number(r[2]);
      if (dong > 0 && cot > 0) vt[doi[k]] = { dong: dong, cot: cot + 1 };
    });
    // Tin nhưng phải soi lại: _chiMuc khai dòng bằng SỐ TUYỆT ĐỐI. Ai chèn thêm
    // một dòng vào đầu phiếu là con số đó trỏ lệch, app ghi trọng số vào ô trống
    // còn ô thật giữ nguyên bộ của mẫu — nhân viên bị áp trọng số của quản lý.
    if (vt.kc && vt.cm && vt.ql && _dungChoTrongSo_(ss, vt)) return vt;
    vt = {};
  }

  // Đường 2: dò theo nhãn ở khối kết quả đầu phiếu.
  var dau = [
    { k: 'kc', re: /trung\s*b[ìi]nh.*V[ĂA]N\s*H[ÓO]A/i },
    { k: 'cm', re: /trung\s*b[ìi]nh.*CHUY[ÊE]N\s*M[ÔO]N/i },
    { k: 'ql', re: /trung\s*b[ìi]nh.*QU[ẢA]N\s*L[ÝY]/i }
  ];
  ss.getSheets().forEach(function (sh) {
    var n = sh.getName();
    if (n.charAt(0) === '_' || n.indexOf('⚙') === 0) return;
    if (sh.getLastRow() < 4) return;
    var o2 = sh.getRange(1, 1, Math.min(sh.getLastRow(), 30),
                         Math.min(sh.getLastColumn(), 8)).getValues();
    for (var r = 0; r < o2.length; r++) {
      for (var c = 0; c < o2[r].length - 2; c++) {
        var v = String(o2[r][c] || '');
        if (!v) continue;
        dau.forEach(function (d) {
          if (!vt[d.k] && d.re.test(v)) vt[d.k] = { dong: r + 1, cot: c + 3 };
        });
      }
    }
  });
  return vt;
}


/** Ba ô _chiMuc chỉ tới có đúng là ba ô điểm khung không — soi nhãn bên trái. */
function _dungChoTrongSo_(ss, vt) {
  var mong = {
    kc: /trung\s*b[ìi]nh.*V[ĂA]N\s*H[ÓO]A/i,
    cm: /trung\s*b[ìi]nh.*CHUY[ÊE]N\s*M[ÔO]N/i,
    ql: /trung\s*b[ìi]nh.*QU[ẢA]N\s*L[ÝY]/i
  };
  var dung = false;
  ss.getSheets().forEach(function (sh) {
    if (dung) return;
    var n = sh.getName();
    if (n.charAt(0) === '_' || n.indexOf('⚙') === 0) return;
    if (sh.getLastRow() < 6) return;
    var het = true;
    for (var k in vt) {
      var d = vt[k].dong, c = vt[k].cot;
      if (d > sh.getLastRow() || c < 3) { het = false; break; }
      // nhãn nằm ở cột bên trái ô điểm, tức cot - 2
      var v = String(sh.getRange(d, Math.max(1, c - 2)).getValue() || '');
      if (!mong[k].test(v)) { het = false; break; }
    }
    if (het) dung = true;
  });
  return dung;
}

/* ═══════════════════════════════════════════════════════════════════════════
   ĐỌC TỪ FILE GỐC — app CHỈ ĐỌC, không bao giờ ghi

   File gốc "Phiếu đánh giá" thuộc people@nhacuathoithanhxuan.com. Nó tự lo
   việc tạo file năm, đồng bộ nhân sự và thu kết quả — app không đụng vào.

   App chỉ đọc hai sheet để khỏi giữ bản sao rồi trôi lệch:
     📚 Bộ câu hỏi   nguồn duy nhất của tiêu chí
     👥 Nhân sự      danh sách người, chính nó đã đồng bộ từ People Management

   Mọi hàm ở khối này CHỈ ĐỌC. Muốn đổi gì trong file gốc thì báo phòng Nhân sự.
   ═══════════════════════════════════════════════════════════════════════════ */

/** File gốc trên Drive. Chỉ cần quyền XEM. */
var ID_FILE_GOC = '1bStClGQfelqxpkaOxY-TgJmi4-Dh6XX7UHymSEOm-xo';

/** Tên hai sheet cần đọc. Dò theo chữ chính, biểu tượng đổi vẫn nhận ra. */
var SHEET_BO_CAU = 'Bộ câu hỏi';
var SHEET_NHAN_SU_GOC = 'Nhân sự';

/** Tìm sheet theo tên chứa chuỗi, bỏ qua biểu tượng và dấu. */
function _timSheet_(ss, chua) {
  var k = _chuan_(chua), ra = null;
  ss.getSheets().forEach(function (sh) {
    if (!ra && _chuan_(sh.getName()).indexOf(k) >= 0) ra = sh;
  });
  return ra;
}

/** Mở file gốc. Báo lỗi bằng tiếng người nếu chưa được chia sẻ quyền xem. */
function _moFileGoc_() {
  try { return SpreadsheetApp.openById(_layId_(ID_FILE_GOC)); }
  catch (e) {
    throw new Error('Không mở được file gốc. Tài khoản chạy app cần được chia sẻ ' +
                    'quyền XEM file Phiếu đánh giá của phòng Nhân sự.');
  }
}

/** Đổi cách viết phạm vi bên file gốc sang mã app dùng. */
var DOI_PHAM_VI = {
  'tatcacacbac': 'all', 'tatcanhansu': 'all',
  'nhansugiuvaitroquanly': 'mgmt',
  'vitricodauviectaidiemban': 'pos',
  'nhansunguoidiec/khiemthinh': 'deaf', 'nhansunguoidieckhiemthinh': 'deaf',
  'nhansunguoinoi': 'hearing'
};

/* Tên cấp → thứ hạng. Chép CAP_BAC và CAP_TEN_KHAC của file gốc. */
var TEN_CAP_SANG_BAC = {
  'founder': 9, 'nguoisanglap': 9,
  'ceo': 8, 'tonggiamdoc': 8,
  'clevel': 7,
  'truongphong': 6,
  'quanlykhoi': 5, 'quanly': 5, 'cuahangtruong': 5,   // ba tên cùng một cấp
  'chuyengia': 5,
  'lead': 4, 'leadbophan': 4, 'chuyenvien': 4,
  'truongca': 3,
  'nhanvien': 2,
  'tapsu': 1
};

/* Tên tuyến cũ còn gặp trên sheet → tên chuẩn. Theo TUYEN_TEN_KHAC của file gốc. */
var TUYEN_TEN_KHAC_GS = { 'nhansuhanhchinh': 'nhansuhanhchinhphapche' };
function _chuanTenTuyen_(ten) {
  var k = _chuan_(ten);
  return TUYEN_TEN_KHAC_GS[k] || k;
}

/**
 * Đọc ngưỡng cấp từ cột Phạm vi áp dụng.
 *
 * Ưu tiên TÊN CẤP trước con số, vì bộ câu hỏi có một nhãn sai đã biết:
 * năm câu nhóm N10 ghi "Từ bậc 3 (Chuyên viên) trở lên" trong khi Chuyên viên
 * là bậc 4. File gốc đã bỏ cột số và nay ghi thẳng tên, nên tên mới là thứ đúng.
 */
function _docPhamVi_(s) {
  var k = _chuan_(s);
  if (DOI_PHAM_VI[k]) return DOI_PHAM_VI[k];

  // Dạng tên: "Từ Trưởng phòng trở lên", hoặc "Từ bậc 3 (Chuyên viên) trở lên"
  var m2 = String(s || '').match(/T[ừu]\s+(?:b[ậa]c\s*\d+\s*)?\(?\s*([^)]+?)\s*\)?\s+tr[ởo]\s*l[êe]n/i);
  if (m2) {
    var bac = TEN_CAP_SANG_BAC[_chuan_(m2[1])];
    if (bac) return 'lv' + bac;
  }
  // Chỉ khi không đọc được tên mới đành lấy con số.
  var m = String(s || '').match(/b[ậa]c\s*(\d)/i);
  if (m) return 'lv' + m[1];
  return 'all';
}

/**
 * Đọc bộ câu hỏi từ file gốc. CHỈ ĐỌC, trả về danh sách để đối chiếu.
 * Dò hàng tiêu đề theo tên cột chứ không dùng số dòng cố định.
 */
function _docBoCauGoc_() {
  var ss = _moFileGoc_();
  var sh = _timSheet_(ss, SHEET_BO_CAU);
  if (!sh) throw new Error('File gốc không có sheet nào tên chứa "' + SHEET_BO_CAU + '".');

  var o = sh.getRange(1, 1, sh.getLastRow(), sh.getLastColumn()).getValues();
  var dongTD = -1, cot = {};
  var can = { 'kichhoat': 'batTat', 'phan': 'phan', 'tuyen': 'tuyen',
              'manhom': 'gcode', 'tennhom': 'group', 'chieudo': 'mode',
              'macau': 'code', 'cauhoi': 'text', 'phamviapdung': 'scope',
              'vaophieu': 'vaoPhieu' };
  for (var r = 0; r < Math.min(o.length, 40); r++) {
    var tam = {}, dem = 0;
    for (var c = 0; c < o[r].length; c++) {
      var k = _chuan_(o[r][c]);
      if (can[k] && tam[can[k]] === undefined) { tam[can[k]] = c; dem++; }
    }
    if (tam.code !== undefined && tam.text !== undefined && dem >= 5) {
      dongTD = r; cot = tam; break;
    }
  }
  if (dongTD < 0) throw new Error('Không tìm được hàng tiêu đề của sheet Bộ câu hỏi. ' +
                                  'Cần có ít nhất cột Mã câu và Câu hỏi.');

  var tuyenId = {};
  var db = _docDB_();
  (db && db.tracks || []).forEach(function (t) { tuyenId[_chuanTenTuyen_(t.name)] = t.id; });

  var ds = [];
  var NG = { chung: null, chuyenmon: 'chuyen_mon', quanly: 'quan_ly' };
  for (var r2 = dongTD + 1; r2 < o.length; r2++) {
    var lay = function (k) { return cot[k] === undefined ? '' : o[r2][cot[k]]; };
    var ma = String(lay('code') || '').trim();
    if (!ma) continue;
    // Cột "Vào phiếu" là CÔNG THỨC gộp cả ba tầng bật tắt: phần, nhóm, câu.
    // Cột "Kích hoạt" chỉ bật tắt riêng dòng đó, tắt cả nhóm thì cột này vẫn "Có".
    if (cot.vaoPhieu !== undefined && _chuan_(lay('vaoPhieu')) === 'khong') continue;
    if (cot.vaoPhieu === undefined && cot.batTat !== undefined &&
        _chuan_(lay('batTat')) === 'khong') continue;

    var phan = _chuan_(lay('phan'));
    var tenTuyen = _chuanTenTuyen_(lay('tuyen'));
    ds.push({
      code: ma,
      text: String(lay('text') || '').trim(),
      gcode: String(lay('gcode') || '').trim(),
      group: String(lay('group') || '').trim(),
      mode: _chuan_(lay('mode')).indexOf('ghinhan') >= 0 ? 'ghi_nhan' : 'vi_pham',
      ngach: NG[phan] === undefined ? null : NG[phan],
      trackId: tuyenId[tenTuyen] || null,
      tenTuyen: String(lay('tuyen') || '').trim(),
      scope: _docPhamVi_(lay('scope')),
      vaoPhieu: cot.vaoPhieu === undefined ? true : _chuan_(lay('vaoPhieu')) !== 'khong'
    });
  }
  return { ds: ds, tenSheet: sh.getName(), dongTieuDe: dongTD + 1 };
}

/** Đọc danh sách nhân sự từ file gốc. CHỈ ĐỌC. */
function _docNhanSuGoc_() {
  var ss = _moFileGoc_();
  var sh = _timSheet_(ss, SHEET_NHAN_SU_GOC);
  if (!sh) throw new Error('File gốc không có sheet nào tên chứa "' + SHEET_NHAN_SU_GOC + '".');

  var o = sh.getRange(1, 1, sh.getLastRow(), sh.getLastColumn()).getValues();
  var can = { 'manv': 'code', 'manhansu': 'code', 'hoten': 'name', 'hovaten': 'name',
              'tuyengantay': 'tuyen', 'tuyen': 'tuyen',
              'nguoidiec/khiemthinh': 'hearing', 'nguoidieckhiemthinh': 'hearing',
              'phongban': 'dept', 'vitritheodanhmuc': 'titleVi', 'vitri': 'titleVi',
              'diemlamviec': 'site', 'ngayvaolam': 'joinedAt', 'trangthai': 'level' };
  var dongTD = -1, cot = {};
  for (var r = 0; r < Math.min(o.length, 20); r++) {
    var tam = {}, dem = 0;
    for (var c = 0; c < o[r].length; c++) {
      var k = _chuan_(o[r][c]);
      if (can[k] && tam[can[k]] === undefined) { tam[can[k]] = c; dem++; }
    }
    if (tam.code !== undefined && tam.name !== undefined && dem >= 3) {
      dongTD = r; cot = tam; break;
    }
  }
  if (dongTD < 0) throw new Error('Không tìm được hàng tiêu đề của sheet Nhân sự.');

  var ds = [];
  for (var r2 = dongTD + 1; r2 < o.length; r2++) {
    var lay = function (k) { return cot[k] === undefined ? '' : o[r2][cot[k]]; };
    var ma = String(lay('code') || '').trim();
    if (!ma) continue;
    ds.push({
      code: ma,
      name: String(lay('name') || '').trim(),
      titleVi: String(lay('titleVi') || '').trim(),
      tenPhongBan: String(lay('dept') || '').trim(),
      tenDiemLamViec: String(lay('site') || '').trim(),
      tenTuyen: String(lay('tuyen') || '').trim(),
      capBac: String(lay('level') || '').trim(),
      hearing: _chuan_(lay('hearing')).indexOf('diec') >= 0 ? 'deaf' : 'hearing',
      joinedAt: lay('joinedAt') || ''
    });
  }
  return { ds: ds, tenSheet: sh.getName(), dongTieuDe: dongTD + 1 };
}

/**
 * XEM TRƯỚC việc đồng bộ từ file gốc. Không ghi gì cả.
 * Cho biết chênh lệch giữa file gốc và app: thiếu, thừa, lệch chiều đo, lệch phạm vi.
 */
function xemTruocDongBoGoc(token) {
  _batBuocVai_(token, 'xuat');
  var db = _docDB_();
  if (!db) return { ok: false, loi: 'Chưa có dữ liệu.' };

  var bc, ns;
  try { bc = _docBoCauGoc_(); } catch (e) { return { ok: false, loi: e.message }; }
  try { ns = _docNhanSuGoc_(); } catch (e) { ns = { ds: [], loi: e.message }; }

  var appC = {};
  (db.criteria || []).forEach(function (c) { appC[c.code] = c; });
  var gocC = {};
  bc.ds.forEach(function (c) { gocC[c.code] = c; });

  var themCau = [], boCau = [], lechMode = [], lechScope = [], lechText = 0;
  bc.ds.forEach(function (g) {
    var a = appC[g.code];
    if (!a) { themCau.push(g.code); return; }
    if (a.mode !== g.mode) lechMode.push({ ma: g.code, app: a.mode, goc: g.mode });
    if ((a.scope || 'all') !== g.scope) lechScope.push({ ma: g.code, app: a.scope || 'all', goc: g.scope });
    if (String(a.text || '').trim() !== g.text) lechText++;
  });
  (db.criteria || []).forEach(function (a) {
    if (!gocC[a.code] && a.active !== false) boCau.push(a.code);
  });

  var appU = {};
  (db.users || []).forEach(function (u) { appU[String(u.code || '').toUpperCase()] = u; });
  var themNguoi = [], nghiViec = [];
  ns.ds.forEach(function (g) {
    if (!appU[String(g.code).toUpperCase()]) themNguoi.push(g.code + ' — ' + g.name);
  });
  var gocU = {};
  ns.ds.forEach(function (g) { gocU[String(g.code).toUpperCase()] = true; });
  (db.users || []).forEach(function (u) {
    if (!_laNguoiThat_(u, true)) return;
    if (u.active !== false && !gocU[String(u.code || '').toUpperCase()])
      nghiViec.push((u.code || '') + ' — ' + u.name);
  });

  return {
    ok: true,
    sheetCau: bc.tenSheet, dongTieuDeCau: bc.dongTieuDe,
    soCauGoc: bc.ds.length, soCauApp: (db.criteria || []).filter(function (c) {
      return c.active !== false; }).length,
    themCau: themCau, boCau: boCau,
    lechMode: lechMode.slice(0, 60), soLechMode: lechMode.length,
    lechScope: lechScope.slice(0, 60), soLechScope: lechScope.length,
    lechText: lechText,
    sheetNguoi: ns.tenSheet || '', soNguoiGoc: ns.ds.length,
    themNguoi: themNguoi, nghiViec: nghiViec,
    loiNhanSu: ns.loi || '',
    xemLuc: new Date().toISOString()
  };
}

/**
 * NẠP bộ câu và nhân sự từ file gốc vào kho của app.
 *
 * Nguyên tắc giữ dấu vết:
 *   · câu đã có sự việc  → giữ nguyên id, chỉ cập nhật nội dung
 *   · câu file gốc bỏ    → ẨN, không xoá, để sự việc cũ còn chỗ bám
 *   · người nghỉ việc    → đánh dấu nghỉ, không xoá
 *   · mật khẩu           → giữ nguyên, file gốc không có và không cần biết
 */
function napTuFileGoc(token, kemNhanSu) {
  _batBuocVai_(token, 'admin');
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) throw new Error('Có người đang lưu, thử lại sau vài giây.');
  try {
    var db = _docDB_();
    if (!db) return { ok: false, loi: 'Chưa có kho dữ liệu.' };

    var bc;
    try { bc = _docBoCauGoc_(); } catch (e) { return { ok: false, loi: e.message }; }

    // Sao lưu trước khi đổi — bộ câu là thứ mọi điểm số dựa vào.
    var ten = 'SaoLuu_TruocKhiNapGoc_' +
      Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd_HHmm') + '.json';
    _thuMucGoc_().createFile(ten, JSON.stringify(db), 'application/json');

    var cu = {};
    (db.criteria || []).forEach(function (c) { cu[c.code] = c; });

    var moi = [], tk = { giu: 0, them: 0, an: 0, doiMode: 0, doiScope: 0, doiText: 0 };
    bc.ds.forEach(function (g) {
      var c = cu[g.code];
      if (c) {
        c = JSON.parse(JSON.stringify(c));
        if (c.mode !== g.mode) tk.doiMode++;
        if ((c.scope || 'all') !== g.scope) tk.doiScope++;
        if (String(c.text || '').trim() !== g.text) tk.doiText++;
        tk.giu++;
      } else {
        c = { id: 'c_' + g.code.replace(/\./g, '_').toLowerCase() };
        tk.them++;
      }
      c.code = g.code; c.text = g.text; c.mode = g.mode; c.scope = g.scope;
      c.gcode = g.gcode; c.group = g.group;
      c.active = g.vaoPhieu;
      if (g.trackId) c.trackId = g.trackId; else delete c.trackId;
      if (g.ngach) c.ngach = g.ngach; else delete c.ngach;
      moi.push(c);
    });

    // Câu file gốc không còn: ẩn chứ không xoá.
    var coGoc = {};
    bc.ds.forEach(function (g) { coGoc[g.code] = true; });
    (db.criteria || []).forEach(function (c) {
      if (coGoc[c.code]) return;
      var x = JSON.parse(JSON.stringify(c));
      if (x.active !== false) tk.an++;
      x.active = false;
      moi.push(x);
    });
    db.criteria = moi;

    var tkNS = { them: 0, capNhat: 0, nghi: 0 };
    var loiNS = '';
    if (kemNhanSu) {
      var ns;
      try { ns = _docNhanSuGoc_(); } catch (e) { ns = null; loiNS = e.message; }
      if (ns) {
        var boPhan = {}, diem = {}, tuyen = {};
        (db.depts  || []).forEach(function (d) { boPhan[_chuan_(d.name)] = d.id; });
        (db.sites  || []).forEach(function (s) { diem[_chuan_(s.name)]   = s.id; });
        (db.tracks || []).forEach(function (t) { tuyen[_chuan_(t.name)]  = t.id; });
        var CAP = { founder: 'nguoisanglap', clevel: 'clevel', head: 'truongphong',
                    manager: 'quanly', lead: 'leadbophan', staff: 'nhanvien' };
        var docCap = function (s) {
          var k = _chuan_(s);
          for (var lv in CAP) if (CAP[lv] === k) return lv;
          if (k.indexOf('truongphong') >= 0) return 'head';
          if (k.indexOf('lead') >= 0) return 'lead';
          if (k.indexOf('quanly') >= 0) return 'manager';
          if (k.indexOf('clevel') >= 0 || k.indexOf('tonggiamdoc') >= 0) return 'clevel';
          if (k.indexOf('sanglap') >= 0 || k.indexOf('founder') >= 0) return 'founder';
          return 'staff';
        };

        var theoMa = {};
        (db.users || []).forEach(function (u) { theoMa[String(u.code || '').toUpperCase()] = u; });
        var coNguoi = {};
        ns.ds.forEach(function (g) {
          var khoa = String(g.code).toUpperCase();
          coNguoi[khoa] = true;
          var u = theoMa[khoa];
          if (!u) {
            u = { id: 'u_' + khoa.toLowerCase(), code: g.code, role: 'staff',
                  active: true, mustChange: true };
            _datMatKhauTam_(u);
            db.users.push(u);
            tkNS.them++;
          } else { tkNS.capNhat++; }
          u.name = g.name || u.name;
          u.titleVi = g.titleVi || u.titleVi;
          u.hearing = g.hearing;
          u.level = docCap(g.capBac);
          u.active = true;
          var d = boPhan[_chuan_(g.tenPhongBan)]; if (d) u.deptId = d;
          var s2 = diem[_chuan_(g.tenDiemLamViec)]; if (s2) u.siteId = s2;
          var t2 = tuyen[_chuan_(g.tenTuyen)];      if (t2) u.trackId = t2;
        });

        // Người file gốc không còn: đánh dấu nghỉ, KHÔNG xoá.
        (db.users || []).forEach(function (u) {
          if (!_laNguoiThat_(u, true)) return;
          if (u.active !== false && !coNguoi[String(u.code || '').toUpperCase()]) {
            u.active = false; tkNS.nghi++;
          }
        });
      }
    }

    _ghiDB_(db);
    var dangDung = db.criteria.filter(function (c) { return c.active !== false; }).length;
    return {
      ok: true, saoLuu: ten,
      soCau: db.criteria.length, dangDung: dangDung,
      cau: tk, nhanSu: tkNS, loiNhanSu: loiNS,
      thongBao: 'Đã nạp từ file gốc: ' + dangDung + ' câu đang dùng' +
        (tk.them ? ', thêm ' + tk.them : '') +
        (tk.an ? ', ẩn ' + tk.an : '') +
        (tk.doiMode ? ', sửa chiều đo ' + tk.doiMode : '') +
        (kemNhanSu ? ' · nhân sự: thêm ' + tkNS.them + ', nghỉ ' + tkNS.nghi : '') + '.'
    };
  } finally { lock.releaseLock(); }
}

/** Cấp mật khẩu tạm cho người mới, bắt đổi ngay lần đăng nhập đầu. */
function _datMatKhauTam_(u) {
  var muoi = _muoiMoi_();
  u.pwSalt = muoi;
  u.pwHash = _bam_(MAT_KHAU_TAM, muoi);
  u.mustChange = true;
  u.pwSetAt = new Date().toISOString();
}
