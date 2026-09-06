/**
 * APP_MAYCHU — ỨNG DỤNG GHI BIÊN BẢN VÀ PHIẾU GHI NHẬN.
 *
 * ✅ THÊM 02/9/2026. Phần duy nhất của hệ chạy trên trình duyệt điện thoại.
 *
 * ============================================================================
 * VIỆC CỦA MODULE NÀY, VÀ VIỆC KHÔNG PHẢI CỦA NÓ
 * ============================================================================
 *
 *   LÀM        · nhận biên bản vi phạm và phiếu ghi nhận, ai cũng lập được
 *              · phòng Nhân sự duyệt phiếu ghi nhận; biên bản tự duyệt
 *              · người bị lập biên bản gửi kháng nghị trong 2 ngày làm việc
 *              · ghi từng sự việc vào sheet _log của FILE NĂM
 *
 *   KHÔNG LÀM  · dựng phiếu — đó là 06_Phieu.gs và 15_FileNam.gs
 *              · đồng bộ nhân sự — đó là 10_NhanSu.gs
 *              · thu kết quả — đó là 08_TongHop.gs
 *              · chấm điểm thay hội đồng — cột Điểm của phiếu app không đụng
 *
 * ⛔ FILE NÀY KHÔNG SỬA MỘT DÒNG NÀO CỦA 01 TỚI 16. Nó chỉ GỌI sang. Danh sách
 * những thứ mượn nằm ở khối MƯỢN GÌ bên dưới. Bên nào đổi tên hàm thì chỉ sửa
 * ở một chỗ trong khối đó.
 *
 * ⚠️ TÊN FILE CỐ Ý KHÔNG MANG SỐ. Bên kia đang có 16 file đánh số và có thể
 * thêm 17, 18 bất cứ tháng nào; đặt tên app theo số là tự chuốc ngày hai bên
 * giành nhau một chỗ. Cặp file của app luôn là App_MayChu.gs và
 * App_GiaoDien.html, đứng sau mọi số khi Apps Script xếp theo bảng chữ cái.
 *
 * ============================================================================
 * MƯỢN GÌ CỦA 01 TỚI 16
 * ============================================================================
 *
 *   CFG, CAP_BAC, TUYEN         hằng số        01, 03
 *   _ss, _ui                    tiện ích       01
 *   _traCap, _chuanTenTuyen     thang cấp bậc  03
 *   _macDinh                    điểm mặc định  06
 *   _troNgSo                    trọng số       06  ← chỉ đọc luật, không gọi
 *   _thuMucGoc, _thuMucCon      cây Drive      07
 *   _traNhanSu                  một nhân sự    10
 *   _docBoCauHoi                bộ câu hỏi     16
 *
 * ⚠️ Vì mượn được ngần ấy, module này KHÔNG khai lại thang cấp bậc, không khai
 * lại tên tuyến, không tự dò tiêu đề sheet Bộ câu hỏi. Bản trước của app tự
 * khai cả ba và cả ba đều đã lệch một nhịp so với file gốc.
 *
 * ============================================================================
 * KHO DỮ LIỆU RIÊNG
 * ============================================================================
 *
 * Biên bản, phiếu ghi nhận và tài khoản đăng nhập nằm trong MỘT TỆP JSON trên
 * Drive, không nằm trong bảng tính này. Lý do: nội dung biên bản là chuyện
 * riêng của từng người, mà file gốc thì chia sẻ cho cả phòng Nhân sự và hội
 * đồng. Sheet ẩn KHÔNG phải bảo mật — ai mở được file đều bỏ ẩn ra đọc được.
 */

/* ==================== THAM SỐ CỦA ỨNG DỤNG ==================== */

const APP = {
  /* Đổi số này mỗi lần sửa. Giao diện đọc nó để biết mình có đang nói chuyện
     với đúng đời máy chủ không. */
  PHIEN_BAN: '2.2 · 04/9/2026 · sửa băm mật khẩu, tạo admin đầu tiên, nạp kho cũ',

  /* Tệp kho và thư mục ảnh, đặt trong thư mục RIÊNG để quyền xem tách khỏi
     file gốc. Để trống ID thì dùng thư mục con "Ứng dụng" cạnh file gốc. */
  THU_MUC_ID:  '',
  THU_MUC_TEN: 'Ứng dụng đánh giá',
  TEP_KHO:     'DuLieu_DanhGiaNhanSu.json',
  THU_MUC_ANH: 'Ảnh',

  MAT_KHAU_TAM: '123456',
  HAN_PHIEN:    12 * 60 * 60,        // giây

  /* Kháng nghị: 2 ngày LÀM VIỆC kể từ lúc lập, khoá cứng sau đó. */
  NGAY_LAM:        [1, 2, 3, 4, 5],
  NGAY_KHANG_NGHI: 2,

  /* Bốn giá trị hợp lệ của cột Loại trong _log. Xem LOG_LOAI ở 15_FileNam.gs. */
  LOAI: { vi_pham: 'Vi phạm', ghi_nhan: 'Ghi nhận' }
};

/* ==================== KHO DỮ LIỆU ==================== */

function _appThuMuc() {
  if (APP.THU_MUC_ID) {
    try { return DriveApp.getFolderById(APP.THU_MUC_ID); } catch (e) {}
  }
  return _thuMucCon(_thuMucGoc(), APP.THU_MUC_TEN);
}

function _appTepKho() {
  const it = _appThuMuc().getFilesByName(APP.TEP_KHO);
  return it.hasNext() ? it.next() : null;
}

function _appDocKho() {
  const f = _appTepKho();
  if (!f) return null;
  try { return JSON.parse(f.getBlob().getDataAsString('UTF-8')); }
  catch (e) { throw new Error('Kho dữ liệu hỏng: ' + e.message); }
}

function _appGhiKho(db) {
  const noi = JSON.stringify(db);
  const f = _appTepKho();
  if (f) f.setContent(noi);
  else _appThuMuc().createFile(APP.TEP_KHO, noi, 'application/json');
}

/** Gỡ mật khẩu trước khi gửi xuống trình duyệt. */
function _appSachKho(db) {
  const ban = JSON.parse(JSON.stringify(db));
  ban.users = (ban.users || []).map(function (u) {
    delete u.pwHash; delete u.pwHashAlt; delete u.pwSalt;
    return u;
  });
  return ban;
}

/* ==================== MẬT KHẨU VÀ PHIÊN ==================== */

function _appMuoiMoi() {
  return 'ttx' + Utilities.getUuid().replace(/-/g, '').slice(0, 20);
}

/**
 * BĂM MẬT KHẨU — PHẢI GIỐNG HỆT BẢN CHẠY TRÊN TRÌNH DUYỆT.
 *
 * ⛔ SỬA 04/9/2026. Bản trước nối muối và mật khẩu bằng dấu '|', trong khi
 * hashPw() của giao diện nối bằng '::'. Chú thích thì ghi là "giống hệt", mà
 * số thì không. Hệ quả: mọi tài khoản có sẵn — 33 người thật — băm ra một
 * chuỗi khác, nên máy chủ báo sai mật khẩu với tất cả, kể cả mật khẩu đúng.
 * Không ai vào được và cũng không có cách nào biết vì sao.
 *
 * Nguồn đúng là giao diện, vì mật khẩu thật của mọi người đã băm theo nó:
 *     SHA-256( muối + '::' + mật khẩu )
 */
function _appBam(matKhau, muoi) {
  return _appBamKieu(matKhau, muoi, '::');
}

function _appBamKieu(matKhau, muoi, noi) {
  const b = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,
                                    String(muoi) + noi + String(matKhau),
                                    Utilities.Charset.UTF_8);
  return 's256:' + b.map(function (x) {
    return ('0' + (x < 0 ? x + 256 : x).toString(16)).slice(-2);
  }).join('');
}

/**
 * So mật khẩu. Nhận cả kiểu cũ '|' để tài khoản nào lỡ tạo bằng bản có lỗi
 * vẫn vào được, rồi lặng lẽ băm lại theo kiểu đúng.
 *
 * So bằng _appBangNhau (thời gian không đổi theo nội dung), đừng dùng !==.
 */
function _appKhopMatKhau(u, matKhau) {
  if (!u || !u.pwHash) return false;
  if (_appBangNhau(_appBam(matKhau, u.pwSalt), u.pwHash)) return true;

  if (_appBangNhau(_appBamKieu(matKhau, u.pwSalt, '|'), u.pwHash)) {
    u.pwHash = _appBam(matKhau, u.pwSalt);   // nâng về kiểu đúng
    u.pwNangCap = new Date().toISOString();
    return true;
  }
  return false;
}

function _appDatMatKhau(u, matKhau, batDoi) {
  u.pwSalt = _appMuoiMoi();
  u.pwHash = _appBam(matKhau, u.pwSalt);
  delete u.pwHashAlt;
  u.mustChange = !!batDoi;
  u.pwSetAt = new Date().toISOString();
}

/**
 * PHIÊN ĐĂNG NHẬP: TOKEN TỰ CHỨNG THỰC.
 *
 * ✅ ĐỔI 02/9/2026. Bản trước cất phiên trong CacheService. Cache của Apps
 * Script không có gì bảo đảm — Google dọn lúc nào cũng được, và khi giao diện
 * nằm ngoài tên miền này thì mất phiên nghĩa là cả nhà bị văng ra giữa chừng,
 * không hiểu vì sao. Nay token TỰ MANG nội dung và chữ ký, máy chủ không phải
 * nhớ gì cả:
 *
 *     <mã người>.<hết hạn>.<chữ ký HMAC-SHA256>
 *
 * Ai sửa một ký tự trong hai phần đầu thì chữ ký hỏng ngay. Khoá ký nằm trong
 * PropertiesService của dự án, sinh tự động lần đầu, không bao giờ ra khỏi máy
 * chủ. Muốn đá hết mọi người ra thì chạy appDoiKhoaKy().
 */
function _appKhoaKy() {
  const kho = PropertiesService.getScriptProperties();
  let k = kho.getProperty('APP_KHOA_KY');
  if (!k) {
    k = Utilities.getUuid() + Utilities.getUuid();
    kho.setProperty('APP_KHOA_KY', k);
  }
  return k;
}

function _appKy(noi) {
  const b = Utilities.computeHmacSha256Signature(String(noi), _appKhoaKy());
  return b.map(function (x) {
    return ('0' + (x < 0 ? x + 256 : x).toString(16)).slice(-2);
  }).join('');
}

function _appCapPhien(userId) {
  const han = Date.now() + APP.HAN_PHIEN * 1000;
  const than = userId + '.' + han;
  return than + '.' + _appKy(than);
}

/** So sánh không rò rỉ thời gian, để không ai dò được chữ ký từng ký tự. */
function _appBangNhau(a, b) {
  a = String(a); b = String(b);
  if (a.length !== b.length) return false;
  let x = 0;
  for (let i = 0; i < a.length; i++) x |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return x === 0;
}

function _appNguoiCuaPhien(token) {
  if (!token) return null;

  const p = String(token).split('.');
  if (p.length !== 3) return null;

  const id = p[0], han = Number(p[1]);
  if (!han || Date.now() > han) return null;
  if (!_appBangNhau(p[2], _appKy(id + '.' + han))) return null;

  const db = _appDocKho();
  if (!db) return null;
  let kq = null;
  (db.users || []).forEach(function (u) {
    if (u.id === id && u.active !== false) kq = u;
  });
  return kq;
}

/**
 * Đổi khoá ký. Mọi token đang lưu trên máy mọi người lập tức hết hiệu lực và
 * cả nhà phải đăng nhập lại. Dùng khi nghi có người lấy được token, hoặc khi
 * một người nghỉ việc mà máy họ còn đăng nhập.
 */
function appDoiKhoaKy() {
  PropertiesService.getScriptProperties().deleteProperty('APP_KHOA_KY');
  _appKhoaKy();
  Logger.log('✅ Đã đổi khoá ký. Mọi người phải đăng nhập lại.');
}

/* ==================== PHÂN QUYỀN ==================== */

/**
 * Ẩn nút trên màn hình KHÔNG phải là chặn. Ai mở Console trình duyệt cũng gọi
 * thẳng được google.script.run.<tên hàm>. Nên mọi hàm có sức nặng phải tự kiểm
 * vai NGAY TẠI ĐÂY.
 */
const _appLaAdmin = function (u) { return !!u && u.role === 'admin'; };

/** Trưởng phòng hoặc quản lý của phòng Nhân sự. */
function _appLaHR(u) {
  if (!u) return false;
  if (_appLaAdmin(u)) return true;
  const db = _appDocKho();
  if (!db) return false;
  let dp = null;
  (db.depts || []).forEach(function (d) {
    if (!dp && /nh[âa]n s[ựu]/i.test(String(d.name || ''))) dp = d;
  });
  return !!dp && u.deptId === dp.id && (u.role === 'manager' || u.role === 'admin');
}

/** Thứ hạng cấp của một người, tra qua CAP_BAC ở 03_DuLieuTuyen.gs. */
function _appHangCap(u) {
  if (!u) return 0;
  const c = _traCap(u.capBac || u.titleVi || '');
  return c ? c.bac : 0;
}

/** Ban lãnh đạo: C-Level trở lên, tức thứ hạng 7 trong CAP_BAC. */
const _appLaBanLanhDao = function (u) { return _appHangCap(u) >= 7; };

/** Người được xuất kết quả: phòng Nhân sự, Ban lãnh đạo, quản trị hệ thống. */
function _appDuocXuat(u) {
  return _appLaHR(u) || _appLaAdmin(u) || _appLaBanLanhDao(u);
}

/** Bắt buộc đăng nhập RỒI kiểm vai. Không đủ quyền thì nói rõ cần vai gì. */
function _appBatBuocVai(token, vai) {
  const u = _appNguoiCuaPhien(token);
  if (!u) throw new Error('Phiên đã hết hạn. Đăng nhập lại giúp em.');

  const duoc = {
    admin:  _appLaAdmin,
    hr:     _appLaHR,
    xuat:   _appDuocXuat,
    aiCung: function () { return true; }
  }[vai];
  if (!duoc) throw new Error('Vai không hợp lệ: ' + vai);

  if (!duoc(u)) {
    const ten = {
      admin: 'quản trị hệ thống',
      hr:    'phòng Nhân sự',
      xuat:  'phòng Nhân sự, Ban lãnh đạo hoặc quản trị hệ thống'
    }[vai] || vai;
    throw new Error('Việc này chỉ ' + ten + ' làm được. Tài khoản ' +
                    (u.code || u.name) + ' không đủ quyền.');
  }
  return u;
}

/* ==================== BỘ CÂU HỎI ==================== */

/**
 * Bộ câu ở dạng PHẲNG để app dùng. Nguồn là _docBoCauHoi() ở 16, tức chính
 * sheet 📚 Bộ câu hỏi — app không dò lại tiêu đề và không giữ bản sao.
 *
 * Chiều đo khai theo NHÓM chứ không theo câu, nên nó nằm ở phần tử thứ tư của
 * mỗi nhóm và được rải xuống từng câu ở đây.
 */
function _appBoCauPhang() {
  const bc = _docBoCauHoi();
  if (!bc) return [];
  const ra = [];

  const nap = function (nhomList, ngach, tenTuyen) {
    (nhomList || []).forEach(function (nh) {
      const maNhom = nh[0], tenNhom = nh[1], cau = nh[2], chieu = nh[3];
      (cau || []).forEach(function (c) {
        ra.push({
          code:    String(c[0]).trim(),
          text:    String(c[1]),
          phamVi:  String(c[2] || ''),
          gcode:   maNhom,
          group:   tenNhom,
          mode:    (chieu === 'vi phạm') ? 'vi_pham' : 'ghi_nhan',
          ngach:   ngach,
          tenTuyen: tenTuyen || ''
        });
      });
    });
  };

  nap(bc.chung, null, '');
  Object.keys(bc.tuyen || {}).forEach(function (t) {
    nap(bc.tuyen[t].chuyenMon, 'chuyen_mon', t);
    nap(bc.tuyen[t].quanLy,    'quan_ly',    t);
  });
  return ra;
}

/**
 * Câu này có áp cho người này không.
 *
 * Ngưỡng cấp đọc bằng TÊN trước, con số sau. Bộ câu hỏi có một nhãn sai đã
 * biết: năm câu nhóm N10 ghi "Từ bậc 3 (Chuyên viên) trở lên" trong khi
 * Chuyên viên là bậc 4. Đọc tên thì ra đúng, đọc số thì sai.
 */
function _appHopPhamVi(phamVi, u) {
  const s = String(phamVi || '');
  if (!s) return true;

  /* ⛔ NĂM NHÁNH NÀY PHẢI GIỐNG HỆT _thuocPhamVi Ở 06_Phieu.gs, KỂ CẢ THỨ TỰ.
   *
   * Hàm bên đó trả về CÔNG THỨC cho ô Sheets nên không gọi thẳng được, nhưng
   * luật thì phải trùng từng chữ: nó quyết định câu nào vào cột "Thuộc phạm vi"
   * của phiếu, mà phiếu tính điểm bằng SUMIF cột đó. Hai bên hiểu khác nhau một
   * câu là điểm khác nhau, và điểm khác nhau đủ để rơi một bậc thì chạm tới
   * tiền lương tháng đó.
   *
   * ⚠️ Thứ tự có ý nghĩa: một câu ghi "người điếc giữ vai trò quản lý" rơi vào
   * nhánh điếc, không rơi vào nhánh quản lý. Đừng sắp lại cho gọn.
   *
   * ⚠️ Nhánh quản lý bắt CHUỖI CON "quản lý", không bắt riêng "giữ vai trò
   * quản lý". Bản trước của app hẹp hơn nên bỏ sót những câu ghi cách khác. */

  if (s.indexOf('người nói') >= 0)                return u.hearing !== 'deaf';
  if (s.indexOf('người điếc/ khiếm thính') >= 0)  return u.hearing === 'deaf';
  if (s.indexOf('quản lý') >= 0)                  return _appCoNgachQuanLy(u);
  if (s.indexOf('điểm bán') >= 0)                 return !!u.coDiemBan;

  /* Ngưỡng cấp ghi bằng TÊN: "Từ Trưởng phòng trở lên". Tên lạ thì trả về true,
   * tức áp cho mọi người — một ngưỡng gõ sai không được phép làm câu hỏi biến
   * mất trong im lặng. Đó cũng là cách file gốc xử. */
  const m = s.match(/^Từ\s+(.+?)\s+trở lên$/i);
  if (m) {
    const c = _traCap(m[1]);
    if (c) return _appHangCap(u) >= c.bac;
  }
  return true;
}

/** Người này có ngạch quản lý không. Tra qua CAP_BAC, không đoán theo chức danh. */
function _appCoNgachQuanLy(u) {
  const c = _traCap(u && (u.capBac || u.titleVi) || '');
  return !!c && c.ngach === 'Quản lý';
}

/** Bộ câu áp dụng cho một người, đã lọc theo tuyến, ngạch và phạm vi. */
function _appBoCauCua(u) {
  if (!u) return [];
  const tuyen = _chuanTenTuyen(u.tenTuyen || '');
  const coQL = _appCoNgachQuanLy(u);

  return _appBoCauPhang().filter(function (c) {
    if (c.ngach && _chuanTenTuyen(c.tenTuyen) !== tuyen) return false;
    if (c.ngach === 'quan_ly' && !coQL) return false;
    return _appHopPhamVi(c.phamVi, u);
  });
}

/* ==================== CHẤM ĐIỂM ==================== */

/** Đọc một tham số từ named range của sheet ⚙️ Tham số. */
function _appTS(ten, macDinh) {
  try {
    const v = Number(_ss().getRangeByName(ten).getValue());
    return isNaN(v) ? macDinh : v;
  } catch (e) { return macDinh; }
}

/**
 * Điểm của MỘT câu trong kỳ.
 * Điểm mặc định lấy từ _macDinh() ở 06_Phieu.gs, không khai lại ở đây.
 */
function _appDiemMotCau(c, suViec) {
  const logic = (c.mode === 'ghi_nhan') ? 'ghi nhận' : 'vi phạm';
  const khoi = _macDinh(logic);
  let vp = 0, gn = 0;
  (suViec || []).forEach(function (e) {
    if (e.type === 'vi_pham' && !e.isBoundary) vp++;
    else if (e.type === 'ghi_nhan') gn++;
  });
  const tho = khoi + gn - vp;
  return { khoi: khoi, viPham: vp, ghiNhan: gn,
           diem: Math.max(0, Math.min(5, tho)) };
}

/**
 * Trọng số ba phần, chia lại khi một phần không có mặt.
 * Chép ĐÚNG luật của _troNgSo() ở 06_Phieu.gs — hàm đó trả về công thức cho ô
 * Sheets nên không gọi thẳng được, nhưng luật thì giống hệt:
 *   có QL, có CM      → VH2 · QL2 · CM2
 *   có QL, không CM   → VH2 và QL2 chia lại cho nhau
 *   không QL, có CM   → VH1 · CM1
 *   không QL, không CM→ VH chiếm trọn
 */
function _appTrongSo(coQL, coCM) {
  const VH1 = _appTS('TS_TS_VH1', 0.65), CM1 = _appTS('TS_TS_CM1', 0.35);
  const VH2 = _appTS('TS_TS_VH2', 0.50), QL2 = _appTS('TS_TS_QL2', 0.30),
        CM2 = _appTS('TS_TS_CM2', 0.20);
  if (coQL && coCM)  return { kc: VH2, ql: QL2, cm: CM2 };
  if (coQL && !coCM) return { kc: VH2 / (VH2 + QL2), ql: QL2 / (VH2 + QL2), cm: 0 };
  if (!coQL && coCM) return { kc: VH1, ql: 0, cm: CM1 };
  return { kc: 1, ql: 0, cm: 0 };
}

/** Quy tỷ lệ đạt ra Bậc cách làm việc 1 tới 5. */
function _appBacTheoTyLe(tyLe) {
  if (tyLe === null || tyLe === undefined) return null;
  const ng = [_appTS('TS_NG1', 0), _appTS('TS_NG2', 0.4), _appTS('TS_NG3', 0.55),
              _appTS('TS_NG4', 0.7), _appTS('TS_NG5', 0.85)];
  let bac = 1;
  ng.forEach(function (n, i) { if (tyLe / 100 >= n) bac = i + 1; });
  return bac;
}

/** Sự việc ĐÃ DUYỆT của một người trong một kỳ. */
function _appSuViec(db, userId, ky) {
  return (db.records || []).filter(function (r) {
    return r.subjectId === userId && r.status === 'approved' &&
           (!ky || r.period === ky);
  });
}

/** Điểm ba khung, điểm tổng và bậc của một người trong một kỳ. */
function _appTinhDiem(db, u, ky) {
  const cs  = _appBoCauCua(u);
  const evs = _appSuViec(db, u.id, ky);

  const theoCau = {};
  evs.forEach(function (e) {
    if (!theoCau[e.critCode]) theoCau[e.critCode] = [];
    theoCau[e.critCode].push(e);
  });

  const diemCau = {};
  cs.forEach(function (c) { diemCau[c.code] = _appDiemMotCau(c, theoCau[c.code]); });

  const khung = [
    { k: 'kc', ma: 'B.1', ten: 'Khung chung',      loc: function (c) { return !c.ngach; } },
    { k: 'cm', ma: 'B.2', ten: 'Ngạch chuyên môn', loc: function (c) { return c.ngach === 'chuyen_mon'; } },
    { k: 'ql', ma: 'B.3', ten: 'Ngạch quản lý',    loc: function (c) { return c.ngach === 'quan_ly'; } }
  ].map(function (kh) {
    const ds = cs.filter(kh.loc);
    if (!ds.length) return null;
    let tong = 0, vp = 0, gn = 0;
    ds.forEach(function (c) {
      const d = diemCau[c.code];
      tong += d.diem; vp += d.viPham; gn += d.ghiNhan;
    });
    return { k: kh.k, ma: kh.ma, ten: kh.ten, soCau: ds.length,
             tb: tong / ds.length, viPham: vp, ghiNhan: gn };
  }).filter(function (x) { return !!x; });

  const co = {};
  khung.forEach(function (x) { co[x.k] = true; });
  const ts = _appTrongSo(!!co.ql, !!co.cm);
  khung.forEach(function (x) { x.ts = ts[x.k]; });

  let diemTong = null;
  if (khung.length) {
    diemTong = 0;
    khung.forEach(function (x) { diemTong += x.tb * ts[x.k]; });
  }
  const tyLe = diemTong === null ? null : diemTong / 5 * 100;

  const baoMat = evs.some(function (e) { return /^BM/i.test(String(e.critCode || '')); });
  const bacTho = _appBacTheoTyLe(tyLe);
  const bac = bacTho === null ? null : Math.max(1, bacTho - (baoMat ? 1 : 0));

  return {
    khung: khung, diemTong: diemTong, tyLe: tyLe,
    bac: bac, bacTho: bacTho, viPhamBaoMat: baoMat,
    coNgachQuanLy: !!co.ql, soSuViec: evs.length,
    soViPham: evs.filter(function (e) { return e.type === 'vi_pham' && !e.isBoundary; }).length,
    soGhiNhan: evs.filter(function (e) { return e.type === 'ghi_nhan'; }).length,
    diemCau: diemCau
  };
}

/* ==================== CỬA REST CHO GIAO DIỆN ==================== */

/**
 * GIAO DIỆN KHÔNG NẰM TRONG DỰ ÁN NÀY.
 *
 * ✅ ĐỔI 02/9/2026. App_GiaoDien.html chạy trên Cloudflare Pages, gọi vào đây
 * bằng fetch. Nhờ vậy sửa giao diện chỉ cần đẩy code lên Git, không phải mở
 * trình soạn thảo Apps Script.
 *
 * Cái giá phải trả là ba luật của cuộc gọi khác tên miền, và cả ba đều là thứ
 * lặng lẽ làm hỏng chứ không báo lỗi rõ ràng:
 *
 *   1. POST phải mang Content-Type "text/plain". Dùng "application/json" thì
 *      trình duyệt gửi một cuộc gọi OPTIONS dò đường trước, mà Apps Script
 *      không trả lời OPTIONS — cuộc gọi thật chưa bao giờ đi.
 *
 *   2. Mọi trả lời đều qua ContentService dạng JSON. HtmlService không kèm
 *      Access-Control-Allow-Origin nên trình duyệt vứt kết quả đi.
 *
 *   3. Triển khai phải là "Thực thi với tư cách: Tôi" và "Ai có quyền: Bất kỳ
 *      ai". Đó là cách duy nhất để mọi người dùng app mà KHÔNG phải có tài
 *      khoản Google — điều bắt buộc, vì phần lớn nhà mình là người Điếc dùng
 *      điện thoại cá nhân.
 *
 * ⛔ Vì "Bất kỳ ai" gọi được, ai biết đường dẫn đều gõ cửa được. Nên không có
 * một việc nào ở đây tin vào giao diện: mọi hàm tự kiểm vai qua _appBatBuocVai,
 * và appLuuDuLieu còn lọc lại từng thay đổi qua _appLocThayDoi.
 */

/** Bảng việc. Mỗi dòng: tên việc → [hàm, vai cần có, có đổi dữ liệu không]. */
function _appBangViec() {
  return {
    dangNhap:     [function (t, d) { return appDangNhap(d.maNV, d.matKhau); },      null,     true],
    toiLaAi:      [function (t)    { return appKhoiPhucPhien(t); },                 null,     false],
    taiDuLieu:    [function (t)    { return appTaiDuLieu(t); },                     'aiCung', false],
    luuDuLieu:    [function (t, d) { return appLuuDuLieu(t, d.db); },               'aiCung', true],
    doiMatKhau:   [function (t, d) { return appDoiMatKhau(t, d.cu, d.moi); },       'aiCung', true],
    luuAnh:       [function (t, d) { return appLuuAnh(t, d.ten, d.base64, d.kieu, d.maNV, d.loai); }, 'aiCung', true],
    docAnh:       [function (t, d) { return appDocAnh(t, d.id); },                  'aiCung', false],
    ghiLog:       [function (t, d) { return appGhiLogFileNam(t, d.maNV, d.ky); },   'xuat',   true],
    xuatPhieu:    [function (t, d) { return appXuatPhieu(t, d.maNV, d.ky, d.chiThu); }, 'xuat', true],
    napNhanSu:    [function (t)    { return appNapNhanSu(t); },                     'admin',  true]
  };
}

function _appTraLoi(o) {
  return ContentService.createTextOutput(JSON.stringify(o))
    .setMimeType(ContentService.MimeType.JSON);
}

function _appChay(viec, token, duLieu, laPost) {
  try {
    if (!viec) {
      return _appTraLoi({ ok: true, version: APP.PHIEN_BAN,
                          thongBao: 'API đánh giá nhân sự đang chạy.' });
    }
    const dong = _appBangViec()[viec];
    if (!dong) return _appTraLoi({ ok: false, loi: 'Không có việc tên "' + viec + '".' });

    // Việc đổi dữ liệu chỉ nhận qua POST. GET nằm trong lịch sử trình duyệt và
    // trong nhật ký máy chủ, không phải chỗ để mật khẩu đi qua.
    if (dong[2] && !laPost)
      return _appTraLoi({ ok: false, loi: 'Việc "' + viec + '" phải gửi bằng POST.' });

    if (dong[1]) _appBatBuocVai(token, dong[1]);
    return _appTraLoi({ ok: true, version: APP.PHIEN_BAN, data: dong[0](token, duLieu || {}) });

  } catch (e) {
    return _appTraLoi({ ok: false, loi: e.message || String(e) });
  }
}

/**
 * ⚠️ Một dự án Apps Script chỉ có MỘT doGet và MỘT doPost. Bản code mới của bên
 * kia mà thêm hai hàm này thì phải gộp vào đây, không thêm hàm thứ hai —
 * appSoatTuongThich soi đúng chỗ đó.
 */
function doGet(e) {
  const p = (e && e.parameter) || {};
  return _appChay(p.action, p.token, p, false);
}

function doPost(e) {
  let d = {};
  try { d = JSON.parse((e && e.postData && e.postData.contents) || '{}'); } catch (x) {}
  return _appChay(d.action, d.token, d, true);
}

/**
 * Sai mã hay sai mật khẩu đều báo CÙNG một câu. Nói "không có mã này" là chỉ
 * cho người lạ biết mã nào có thật, và bộ mã của nhà mình thì đoán được.
 */
function appDangNhap(ma, matKhau) {
  const db = _appDocKho();
  if (!db) throw new Error('Chưa có kho dữ liệu. Quản trị chạy appCaiDatLanDau giúp.');

  const khoa = String(ma || '').trim().toUpperCase();
  let u = null;
  (db.users || []).forEach(function (x) {
    if (!u && String(x.code || '').toUpperCase() === khoa && x.active !== false) u = x;
  });
  const hashCu = u ? u.pwHash : null;
  if (!u || !_appKhopMatKhau(u, matKhau))
    throw new Error('Mã nhân sự hoặc mật khẩu chưa đúng.');

  // _appKhopMatKhau có thể vừa nâng cấp cách băm — ghi lại thì lần sau khỏi dò.
  if (u.pwHash !== hashCu) { try { _appGhiKho(db); } catch (e) {} }

  return { token: _appCapPhien(u.id), meId: u.id,
           phaiDoiMatKhau: !!u.mustChange, db: _appKemTieuChi(_appSachKho(db)) };
}

function appKhoiPhucPhien(token) {
  const u = _appNguoiCuaPhien(token);
  if (!u) throw new Error('Phiên đã hết hạn. Đăng nhập lại giúp em.');
  return { meId: u.id, phaiDoiMatKhau: !!u.mustChange,
           db: _appKemTieuChi(_appSachKho(_appDocKho())) };
}

/**
 * BỘ TIÊU CHÍ CHO GIAO DIỆN.
 *
 * ⛔ ĐỌC TỪ SHEET, KHÔNG GIỮ BẢN SAO TRONG KHO JSON.
 * Sheet 📚 Bộ câu hỏi là nguồn duy nhất; chép sang JSON là tạo bản thứ hai,
 * rồi Sen sửa sheet mà app vẫn chạy bộ cũ, không ai biết cho tới lúc điểm sai.
 *
 * ⚠️ Kho do appCaiDatLanDau tạo KHÔNG có nhánh criteria. Trước đây giao diện
 * nhận kho thiếu nhánh đó rồi gãy ngay lúc vẽ, với một câu lỗi chẳng chỉ vào
 * đâu. Nay máy chủ luôn gửi kèm.
 */
function _appTieuChiChoApp() {
  const bc = _appBoCauPhang();
  const idTuyen = {};
  return bc.map(function (c) {
    return {
      id: 'c_' + String(c.code).replace(/[^\w]/g, '_'),
      code: c.code,
      gcode: c.gcode,
      group: c.group,
      mode: c.mode,                       // vi_pham · ghi_nhan
      name: c.text,
      text: c.text,
      scope: c.phamVi || 'all',
      ngach: c.ngach || null,             // null · chuyen_mon · quan_ly
      tenTuyen: c.tenTuyen || '',
      active: true
    };
  });
}

function appTaiDuLieu(token) {
  _appBatBuocVai(token, 'aiCung');
  const db = _appSachKho(_appDocKho());
  return _appKemTieuChi(db);
}

/** Gắn tiêu chí và bù các nhánh giao diện luôn cần. */
function _appKemTieuChi(db) {
  if (!db) return db;
  try { db.criteria = _appTieuChiChoApp(); }
  catch (e) { db.criteria = db.criteria || []; }

  ['users', 'records', 'reviews', 'sites', 'depts', 'tracks'].forEach(function (k) {
    if (!Array.isArray(db[k])) db[k] = [];
  });
  if (!db.settings || typeof db.settings !== 'object') db.settings = {};
  if (!db.boundaries || typeof db.boundaries !== 'object') db.boundaries = {};
  return db;
}

/**
 * ĐỔI MẬT KHẨU CỦA CHÍNH MÌNH.
 *
 * ⛔ NÉM LỖI, đừng trả { ok: false }. Cửa REST bọc mọi kết quả thành
 * { ok: true, data: <kết quả> }, nên một { ok: false } nằm bên trong data thì
 * giao diện thấy lớp ngoài ok:true và tưởng đã đổi xong — người dùng gõ sai
 * mật khẩu cũ vẫn nhận thông báo thành công. Ném lỗi thì router bắt và trả
 * { ok: false, loi } ở lớp ngoài, giao diện đọc đúng ngay.
 *
 * Lần đầu (mustChange đang bật) không đòi mật khẩu cũ, vì chính máy chủ đặt
 * mật khẩu tạm và bật cờ đó.
 */
function appDoiMatKhau(token, cu, moi) {
  const me = _appBatBuocVai(token, 'aiCung');
  if (String(moi || '').length < 6)
    throw new Error('Mật khẩu tối thiểu 6 ký tự.');
  if (!me.mustChange && !_appKhopMatKhau(me, cu))
    throw new Error('Mật khẩu hiện tại chưa đúng.');

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) throw new Error('Có người đang lưu, thử lại sau vài giây.');
  try {
    const db = _appDocKho();
    let thay = false;
    (db.users || []).forEach(function (u) {
      if (u.id === me.id) { _appDatMatKhau(u, moi, false); thay = true; }
    });
    if (!thay) throw new Error('Không tìm thấy tài khoản trong kho.');
    _appGhiKho(db);
  } finally { lock.releaseLock(); }

  /* Cấp phiên mới: mật khẩu đổi rồi thì phiên cũ nên hết giá trị về mặt ý
     nghĩa, và giao diện cần một token còn hạn để đi tiếp. */
  return { ok: true, token: _appCapPhien(me.id) };
}

/** Nhận ảnh dạng base64, cất lên Drive, trả về đường dẫn xem. */
/* ==================== ẢNH TRÊN DRIVE ====================

   CÂY THƯ MỤC. Mỗi nhân sự một thư mục riêng, trong đó chia ba ngăn theo loại:

     Ứng dụng đánh giá/
       Ảnh/
         TTX001 - Võ Thành Luân/
            Chung/       ảnh hồ sơ, ảnh không gắn sự việc nào
            Vi phạm/     ảnh kèm biên bản vi phạm
            Ghi nhận/    ảnh kèm phiếu ghi nhận
         TTX002 - Nguyễn Hoàn Vũ/
            ...

   Xếp theo người trước, theo loại sau — vì việc hay làm nhất là "mở xem hồ sơ
   ảnh của một người", chứ không phải "xem hết ảnh vi phạm của cả nhà". Ai mở
   Drive cũng đọc được cây này mà không cần app.

   ⚠️ Tên thư mục mang cả mã lẫn tên, nhưng TÌM THEO MÃ. Người đổi tên thì thư
   mục cũ vẫn nhận ra được, không sinh ra thư mục thứ hai cho cùng một người. */

const APP_NGAN_ANH = { chung: 'Chung', vi_pham: 'Vi phạm', ghi_nhan: 'Ghi nhận' };

/** Thư mục gốc chứa toàn bộ ảnh. */
function _appThuMucAnhGoc() {
  return _thuMucCon(_appThuMuc(), APP.THU_MUC_ANH);
}

/**
 * Thư mục của một người, tạo nếu chưa có.
 * Tìm theo tiền tố "<mã> - " nên đổi tên người không sinh thư mục trùng.
 */
function _appThuMucNguoi(maNV, hoTen) {
  const goc = _appThuMucAnhGoc();
  const ma = String(maNV || '').trim();
  if (!ma) return _thuMucCon(goc, 'Chưa rõ nhân sự');

  const dau = ma + ' - ';
  const it = goc.getFolders();
  while (it.hasNext()) {
    const f = it.next();
    const t = f.getName();
    if (t === ma || t.indexOf(dau) === 0) return f;
  }
  return goc.createFolder(dau + (String(hoTen || '').trim() || 'chưa rõ tên'));
}

/** Ngăn theo loại trong thư mục của người đó. */
function _appNganAnh(maNV, hoTen, loai) {
  const ten = APP_NGAN_ANH[String(loai || '').trim()] || APP_NGAN_ANH.chung;
  return _thuMucCon(_appThuMucNguoi(maNV, hoTen), ten);
}

/**
 * NHẬN ẢNH VÀ CẤT VÀO ĐÚNG NGĂN.
 *
 * ⛔ KHÔNG mở chia sẻ "ai có link cũng xem". Cách đó làm ảnh hiện ngay trong
 * thẻ img, rất tiện — nhưng ảnh kèm biên bản là bằng chứng về hành vi của
 * người thật, và link rò ra một lần là người ngoài xem được vĩnh viễn, không
 * thu lại được. Ảnh ở lại riêng tư; ai muốn xem phải đi qua appDocAnh, và ở đó
 * máy chủ kiểm token trước.
 */
function appLuuAnh(token, tenTep, base64, kieu, maNV, loai) {
  const me = _appBatBuocVai(token, 'aiCung');

  /* Không có mã thì cất vào thư mục của chính người đang gửi — ảnh vẫn có chỗ
     thuộc về, không rơi vào một đống chung không ai dọn. */
  const ma = String(maNV || me.code || '').trim();
  let ten = '';
  const db = _appDocKho();
  (db && db.users || []).forEach(function (u) {
    if (String(u.code || '').toUpperCase() === ma.toUpperCase()) ten = u.name || '';
  });

  const thu = _appNganAnh(ma, ten, loai);
  const blob = Utilities.newBlob(Utilities.base64Decode(base64),
                                 kieu || 'image/jpeg', tenTep || 'anh.jpg');
  const f = thu.createFile(blob);
  return { ok: true, url: f.getUrl(), id: f.getId(),
           thuMuc: thu.getName(), cuaAi: ma };
}

/**
 * TRẢ MỘT ẢNH VỀ CHO NGƯỜI ĐÃ ĐĂNG NHẬP.
 *
 * ⛔ BẮT BUỘC KIỂM ẢNH NẰM TRONG CÂY ẢNH CỦA APP.
 * Không kiểm thì hàm này thành một cửa đọc mọi tệp trong Drive của người triển
 * khai: ai đăng nhập được — kể cả nhân viên — chỉ cần lấy được một mã tệp bất
 * kỳ là tải về được hợp đồng, bảng lương, bất cứ thứ gì.
 *
 * Cây sâu ba tầng nên không duyệt hết được, mà đi NGƯỢC từ tệp lên:
 *     tệp → ngăn loại → thư mục người → thư mục Ảnh
 * Ba lần hỏi cha, dừng ngay khi gặp gốc. Nhanh và không bỏ sót nhánh nào.
 */
function appDocAnh(token, id) {
  _appBatBuocVai(token, 'aiCung');
  const ma = String(id || '').trim();
  if (!ma) throw new Error('Thiếu mã ảnh.');

  const idGoc = _appThuMucAnhGoc().getId();
  let f;
  try { f = DriveApp.getFileById(ma); }
  catch (e) { throw new Error('Không mở được ảnh này.'); }

  let trong = false, buoc = 0;
  let cha = f.getParents();
  while (cha.hasNext() && buoc < 4) {
    const t = cha.next();
    if (t.getId() === idGoc) { trong = true; break; }
    cha = t.getParents();
    buoc++;
  }
  if (!trong) throw new Error('Ảnh này không thuộc kho của ứng dụng.');

  const b = f.getBlob();
  return { base64: Utilities.base64Encode(b.getBytes()),
           kieu: b.getContentType() || 'image/jpeg' };
}

/**
 * Lưu thay đổi. Người gọi không phải quản trị thì CHỈ giữ lại những gì họ được
 * phép sửa: cả kho đi lên mỗi lần lưu, không lọc là ai cũng sửa được điểm của
 * mình, xoá biên bản của mình, hay tự nâng vai.
 */
function appLuuDuLieu(token, dbMoi) {
  const me = _appBatBuocVai(token, 'aiCung');
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) throw new Error('Có người đang lưu, thử lại sau vài giây.');
  try {
    const cu = _appDocKho() || { users: [] };

    // Mật khẩu không bao giờ đi lên từ trình duyệt, lấy lại từ bản cũ.
    const bimat = {};
    (cu.users || []).forEach(function (u) {
      bimat[u.id] = { pwHash: u.pwHash, pwHashAlt: u.pwHashAlt,
                      pwSalt: u.pwSalt, mustChange: u.mustChange };
    });
    (dbMoi.users || []).forEach(function (u) {
      const b = bimat[u.id];
      if (b) {
        u.pwHash = b.pwHash; u.pwHashAlt = b.pwHashAlt; u.pwSalt = b.pwSalt;
        if (u.mustChange === undefined) u.mustChange = b.mustChange;
      }
    });

    /* ⛔ Không cất tiêu chí vào kho. Chúng đọc từ sheet mỗi lần tải, nên ghi
       vào đây là tạo bản sao thứ hai — rồi Sen sửa sheet mà app vẫn chạy bộ cũ. */
    const raGhi = _appLaAdmin(me) ? dbMoi : _appLocThayDoi(cu, dbMoi, me);
    delete raGhi.criteria;
    _appGhiKho(raGhi);
    return { ok: true, luuLuc: new Date().toISOString() };
  } finally { lock.releaseLock(); }
}

/* ==================== LỌC THAY ĐỔI ==================== */

/** Những nhánh chỉ quản trị được đụng. */
const APP_NHANH_QT = ['users', 'depts', 'sites', 'tracks', 'settings', 'reviews'];

/** Phần thân của một bản ghi, để so xem có ai sửa nội dung không. */
function _appChuKy(r) {
  const o = {};
  ['type', 'subjectId', 'reporterId', 'critCode', 'isBoundary',
   'detail', 'xayRaLuc', 'period', 'createdAt'].forEach(function (k) {
    o[k] = r ? r[k] : undefined;
  });
  return JSON.stringify(o);
}

/**
 * Luật:
 *   mọi người   lập biên bản và phiếu ghi nhận ĐỨNG TÊN CHÍNH MÌNH,
 *               gửi kháng nghị cho sự việc của chính mình
 *   phòng NS    duyệt hoặc từ chối, xử kháng nghị
 *   quản trị    mọi thứ còn lại
 */
function _appLocThayDoi(cu, moi, me) {
  const ra = JSON.parse(JSON.stringify(cu));
  const laHR = _appLaHR(me);

  APP_NHANH_QT.forEach(function (k) { ra[k] = cu[k]; });

  const cuTheoId = {};
  (cu.records || []).forEach(function (r) { cuTheoId[r.id] = r; });

  const raRecords = [];
  (moi.records || []).forEach(function (r) {
    const truoc = cuTheoId[r.id];

    if (!truoc) {
      if (r.reporterId !== me.id) return;          // mạo danh người khác
      const sach = JSON.parse(JSON.stringify(r));
      sach.kyNS = null;
      sach.tuChoi = null;

      /* Trạng thái do MÁY CHỦ đặt, không nhận thứ trình duyệt gửi lên.
       *   vi phạm    tự duyệt ngay — nhà mình chốt là không qua ai cả,
       *              người bị lập có 2 ngày làm việc để kháng nghị
       *   ghi nhận   luôn chờ, chỉ phòng Nhân sự duyệt
       * ⚠️ Bản trước chỉ ép nhánh ghi nhận, nên một biên bản vi phạm gửi lên
       * kèm status "pending" thì nằm chờ mãi mà không ai được duyệt. */
      sach.status = (sach.type === 'vi_pham') ? 'approved' : 'pending';
      raRecords.push(sach);
      return;
    }

    const giu = JSON.parse(JSON.stringify(truoc));
    if (_appChuKy(r) !== _appChuKy(truoc)) { raRecords.push(giu); return; }

    if (laHR) {
      giu.kyNS = r.kyNS;
      giu.tuChoi = r.tuChoi;
      giu.status = r.status;
      if (r.khieuNai && giu.khieuNai) giu.khieuNai = r.khieuNai;
    } else if (r.subjectId === me.id) {
      if (r.khieuNai && !truoc.khieuNai) giu.khieuNai = r.khieuNai;
    }
    raRecords.push(giu);
  });

  // Bản ghi cũ mà bản mới bỏ đi: giữ lại. Chỉ quản trị mới xoá được sự việc.
  const coTrongMoi = {};
  raRecords.forEach(function (r) { coTrongMoi[r.id] = true; });
  (cu.records || []).forEach(function (r) {
    if (!coTrongMoi[r.id]) raRecords.push(r);
  });

  ra.records = raRecords;
  return ra;
}

/* ==================== GHI VÀO _log CỦA FILE NĂM ==================== */

/**
 * Đổ sự việc đã duyệt của một người vào sheet _log của file năm.
 * Công thức COUNTIFS trong phiếu tự đếm, app không đụng cột Điểm.
 *
 * Link file năm lấy từ cột File năm ở sheet 👥 Nhân sự, do chính
 * 15_FileNam.gs điền vào lúc tạo. App không dò thư mục.
 */
/** Mở file năm của một người. Link lấy từ cột File năm ở sheet 👥 Nhân sự,
 *  do chính 15_FileNam.gs điền lúc tạo. App không dò thư mục Drive. */
function _appMoFileNam(maNV) {
  const ma = String(maNV || '').trim().toUpperCase();
  const ns = _traNhanSu(ma);
  if (!ns) throw new Error('Không có mã "' + maNV + '" trong sheet Nhân sự.');

  const sh = _ss().getSheetByName(CFG.SHEETS.NS);
  let link = '';
  const v = sh.getRange(NS.R_DAU, 1, sh.getLastRow() - NS.R_DAU + 1, NS.C_LINK).getValues();
  v.forEach(function (d) {
    if (String(d[NS.C_MA - 1]).trim().toUpperCase() === ma)
      link = String(d[NS.C_LINK - 1] || '').trim();
  });
  if (!link) throw new Error(ns.ten + ' chưa có file năm. Tạo bằng menu 📅 trước.');

  const m = link.match(/[-\w]{25,}/);
  if (!m) throw new Error('Cột File năm của ' + ns.ten + ' không chứa link hợp lệ.');

  try { return { ss: SpreadsheetApp.openById(m[0]), ns: ns }; }
  catch (e) { throw new Error('Không mở được file năm của ' + ns.ten + '. Kiểm tra quyền sửa.'); }
}

/**
 * ĐỌC BẢN ĐỒ PHIẾU TỪ SHEET _chiMuc.
 *
 * File gốc tự sinh sheet này lúc dựng phiếu, ghi rõ mã câu nào nằm dòng nào và
 * cột nào là cột Điểm. Nhờ vậy app KHÔNG đoán số dòng.
 *
 * ⚠️ Nhưng vẫn phải kiểm chứng. Chèn hay xoá một dòng trong phiếu là số dòng
 * trong _chiMuc lệch ngay mà không ai báo, và ghi điểm vào nhầm dòng thì không
 * ai nhận ra cho tới lúc trả lương. Nên mỗi mã câu chỉ được dùng sau khi ô A
 * của dòng đó ĐÚNG LÀ mã ấy; lệch thì bỏ qua và kể tên ra trong báo cáo.
 */
function _appBanDoPhieu(ssNam, tenSheetThang) {
  const shCM = ssNam.getSheetByName(CFG.CHIMUC_SHEET);
  if (!shCM) throw new Error('File năm không có sheet ' + CFG.CHIMUC_SHEET + '.');
  const shT = ssNam.getSheetByName(tenSheetThang);
  if (!shT) throw new Error('File năm không có sheet tháng ' + tenSheetThang + '.');

  const cm = shCM.getRange(1, 1, shCM.getLastRow(), 6).getValues();

  let cotMa = 1, cotDiem = 3, cotSuViec = 5;
  cm.forEach(function (d) {
    const k = String(d[0] || '').trim();
    if (k === 'cot_ma')      cotMa     = Number(d[2]) || cotMa;
    if (k === 'cot_diem')    cotDiem   = Number(d[2]) || cotDiem;
    if (k === 'cot_su_viec') cotSuViec = Number(d[2]) || cotSuViec;
  });

  const soDong = shT.getLastRow();
  const maTrenPhieu = shT.getRange(1, cotMa, soDong, 1).getValues();

  const banDo = {}, lech = [];
  cm.forEach(function (d) {
    const ma = String(d[0] || '').trim();
    const dong = Number(d[1]);
    const muc = String(d[2] || '').trim();
    if (!ma || !dong || dong < 1 || dong > soDong) return;
    if (!/^[IVX]+$/.test(muc)) return;                 // dòng cấu hình, không phải câu

    if (String(maTrenPhieu[dong - 1][0] || '').trim() === ma) {
      banDo[ma] = { dong: dong, muc: muc, nhom: String(d[3] || ''),
                    logic: String(d[4] || ''), macDinh: d[5] };
    } else {
      lech.push(ma);
    }
  });

  return { sheet: shT, banDo: banDo, lech: lech,
           cotDiem: cotDiem, cotSuViec: cotSuViec };
}

/**
 * ĐIỀN CỘT ĐIỂM CỦA MỘT NGƯỜI TRONG MỘT THÁNG.
 *
 * Phiếu tự đếm số biên bản bằng COUNTIFS đọc từ _log, nhưng cột ĐIỂM thì là số
 * gõ tay. Hàm này gõ hộ, để hội đồng ngồi xuống là đã có sẵn 5 với những câu
 * chưa có biên bản nào và số đã trừ với những câu có.
 *
 * ⛔ HAI NHÓM APP KHÔNG ĐỤNG, và cố ý không đụng:
 *
 *   RG · ranh giới không thỏa hiệp   vi phạm là CHẶN cả hai kết quả
 *   BM · bảo mật thu nhập cá nhân    vi phạm là HẠ một bậc
 *
 * Hai thứ đó nặng hơn hẳn phần còn lại và phải do người quyết, không do một
 * phép cộng trừ. App để nguyên giá trị mặc định của phiếu cho hội đồng tự đánh.
 *
 * ⚠️ CHẠY LẠI LÀ GHI ĐÈ. Chạy trước buổi họp, đừng chạy sau — sau thì mất hết
 * phần hội đồng đã sửa. Muốn xem thử mà không ghi thì để chiThu = true.
 */
function appXuatPhieu(token, maNV, ky, chiThu) {
  _appBatBuocVai(token, 'xuat');
  return _appXuatPhieuLoi(maNV, ky, chiThu);
}

/**
 * Lõi của việc xuất, KHÔNG kiểm quyền. Chỉ hai cửa dưới đây được gọi nó, và
 * mỗi cửa tự canh theo cách của mình:
 *
 *   appXuatPhieu        từ giao diện web  → kiểm token và vai 'xuat'
 *   appXuatPhieuMenu    từ menu trong Sheet → kiểm quyền sửa file gốc
 *
 * ⛔ Đừng thêm cửa thứ ba mà quên phần canh.
 */
function _appXuatPhieuLoi(maNV, ky, chiThu) {
  const thang = 'T' + String(ky || '').split('-')[1];
  if (!/^T\d\d$/.test(thang)) throw new Error('Kỳ phải có dạng 2026-09, nhận được "' + ky + '".');

  const mo = _appMoFileNam(maNV);
  const bd = _appBanDoPhieu(mo.ss, thang);

  const db = _appDocKho();
  if (!db) throw new Error('Chưa có kho dữ liệu của app.');
  let u = null;
  (db.users || []).forEach(function (x) {
    if (String(x.code || '').toUpperCase() === String(maNV).trim().toUpperCase()) u = x;
  });
  if (!u) throw new Error('Kho app chưa có mã ' + maNV + '. Chạy appNapNhanSu trước.');

  const st = _appTinhDiem(db, u, ky);

  // Sự việc của từng câu, gộp lại thành một dòng chữ cho ô Sự việc.
  const suViec = {};
  _appSuViec(db, u.id, ky).forEach(function (r) {
    if (!r.critCode) return;
    if (!suViec[r.critCode]) suViec[r.critCode] = [];
    suViec[r.critCode].push(String(r.detail || '').replace(/\s+/g, ' ').slice(0, 160));
  });

  const ghi = [], boQua = { rg: [], bm: [], khongCo: [] };

  Object.keys(bd.banDo).forEach(function (ma) {
    if (/^RG/i.test(ma)) { boQua.rg.push(ma); return; }
    if (/^BM/i.test(ma)) { boQua.bm.push(ma); return; }

    const d = st.diemCau[ma];
    if (!d) { boQua.khongCo.push(ma); return; }

    ghi.push({ dong: bd.banDo[ma].dong, diem: d.diem,
               suViec: (suViec[ma] || []).join(' · ') });
  });

  if (!chiThu && ghi.length) {
    const lock = LockService.getScriptLock();
    if (!lock.tryLock(30000)) throw new Error('File đang bận, thử lại sau vài giây.');
    try {
      ghi.forEach(function (x) {
        bd.sheet.getRange(x.dong, bd.cotDiem).setValue(x.diem);
        if (x.suViec) bd.sheet.getRange(x.dong, bd.cotSuViec).setValue(x.suViec);
      });
      SpreadsheetApp.flush();
    } finally { lock.releaseLock(); }
  }

  return {
    ten: mo.ns.ten, thang: thang, url: mo.ss.getUrl(), chiThu: !!chiThu,
    soCauTrenPhieu: Object.keys(bd.banDo).length,
    daGhi: ghi.length,
    deHoiDongTuDanh: boQua.rg.concat(boQua.bm),
    khongCoTrongApp: boQua.khongCo,
    lechBanDo: bd.lech,
    diemTong: st.diemTong, tyLe: st.tyLe, bac: st.bac,
    thongBao: (chiThu ? 'XEM THỬ, chưa ghi gì. ' : 'Đã ghi ') + ghi.length + '/' +
              Object.keys(bd.banDo).length + ' câu cho ' + mo.ns.ten +
              ' tháng ' + thang + '.' +
              (boQua.rg.length + boQua.bm.length
                ? ' Còn ' + (boQua.rg.length + boQua.bm.length) +
                  ' câu ranh giới và bảo mật để hội đồng tự đánh.' : '') +
              (bd.lech.length ? ' ⚠️ ' + bd.lech.length +
                  ' mã trong _chiMuc trỏ sai dòng, đã bỏ qua.' : '')
  };
}

function appGhiLogFileNam(token, maNV, ky) {
  _appBatBuocVai(token, 'xuat');

  const ns = _traNhanSu(String(maNV || '').trim().toUpperCase());
  if (!ns) return { ok: false, loi: 'Không có mã "' + maNV + '" trong sheet Nhân sự.' };

  const sh = _ss().getSheetByName(CFG.SHEETS.NS);
  let link = '';
  const v = sh.getRange(NS.R_DAU, 1, sh.getLastRow() - NS.R_DAU + 1, NS.C_LINK).getValues();
  v.forEach(function (d) {
    if (String(d[NS.C_MA - 1]).trim().toUpperCase() === String(maNV).trim().toUpperCase())
      link = String(d[NS.C_LINK - 1] || '').trim();
  });
  if (!link) return { ok: false, loi: ns.ten + ' chưa có file năm. Tạo bằng menu 📅 trước.' };

  const m = link.match(/[-\w]{25,}/);
  if (!m) return { ok: false, loi: 'Cột File năm không chứa link hợp lệ.' };

  let ssNam;
  try { ssNam = SpreadsheetApp.openById(m[0]); }
  catch (e) { return { ok: false, loi: 'Không mở được file năm. Kiểm tra quyền sửa.' }; }

  const shLog = ssNam.getSheetByName(CFG.LOG_SHEET);
  if (!shLog) return { ok: false, loi: 'File năm không có sheet ' + CFG.LOG_SHEET + '.' };

  const db = _appDocKho();
  let u = null;
  (db.users || []).forEach(function (x) {
    if (String(x.code || '').toUpperCase() === String(maNV).toUpperCase()) u = x;
  });
  if (!u) return { ok: false, loi: 'Kho app chưa có mã ' + maNV + '.' };

  const st = _appTinhDiem(db, u, ky);
  const ten = {};
  (db.users || []).forEach(function (x) { ten[x.id] = x.name; });

  const thang = 'T' + String(ky || '').split('-')[1];
  const dong = _appSuViec(db, u.id, ky)
    .filter(function (r) { return !!r.critCode; })
    .map(function (r) {
      const d = st.diemCau[r.critCode];
      return [
        thang,
        String(r.xayRaLuc || r.createdAt || '').slice(0, 10),
        APP.LOAI[r.type] || r.type,
        r.critCode,
        String(r.detail || '').slice(0, 400),
        r.id || '',
        ten[r.reporterId] || '',
        d ? d.diem : ''
      ];
    });

  // Xoá đúng những dòng của THÁNG NÀY, giữ nguyên các tháng khác.
  const cu = shLog.getLastRow() > 1
    ? shLog.getRange(2, 1, shLog.getLastRow() - 1, 8).getValues()
    : [];
  const giu = cu.filter(function (d) {
    return String(d[0]).trim() && String(d[0]).trim() !== thang;
  });
  if (shLog.getLastRow() > 1)
    shLog.getRange(2, 1, shLog.getLastRow() - 1, 8).clearContent();
  const mm = giu.concat(dong);
  if (mm.length) shLog.getRange(2, 1, mm.length, 8).setValues(mm);

  return {
    ok: true, ten: ns.ten, soDong: dong.length, url: ssNam.getUrl(),
    thongBao: 'Đã ghi ' + dong.length + ' sự việc của ' + ns.ten +
              ' vào _log tháng ' + thang + '.'
  };
}

/* ==================== MENU BỔ SUNG ==================== */

/**
 * Menu riêng của app.
 *
 * ✅ KHÔNG sửa onOpen ở 01_Code.gs. Hàm này chạy bằng TRIGGER CÀI ĐẶT, tức
 * Apps Script tự gọi nó mỗi lần mở file, song song với onOpen đơn giản của
 * module 01. Nhờ vậy số dòng module này đụng vào 01 tới 16 là ĐÚNG BẰNG KHÔNG,
 * và bản code mới của bên kia dán đè cả 16 file cũng không làm mất menu app.
 *
 * Cài trigger bằng appCaiDatLanDau, hoặc appCaiTrigger nếu menu biến mất.
 */
/* ==================== XUẤT KẾT QUẢ TỪ MENU ==================== */

/**
 * AI BẤM ĐƯỢC HAI MỤC MENU NÀY.
 *
 * Menu chạy trong bảng tính, không có token, nên nó canh bằng một thứ khác:
 * người bấm phải SỬA ĐƯỢC file gốc. Mà file gốc chỉ chia sẻ cho phòng Nhân sự
 * và hội đồng, nên lớp chia sẻ của Google chính là lớp phân quyền ở đây —
 * đúng bằng luật đã chốt: quản lý phòng Nhân sự trở lên.
 *
 * ⚠️ Nghĩa là chia sẻ file gốc cho ai là cho người đó quyền xuất. Trước khi
 * thêm một người vào file, nhớ điều đó.
 *
 * Mỗi lần xuất đều ghi một dòng vào 📜 Nhật ký phiên bản: ai, cho ai, tháng
 * nào, lúc nào. Có vết để lần lại khi cần.
 */
function _appCanhMenu() {
  const ss = _ss();

  let ai = '';
  try { ai = String(Session.getActiveUser().getEmail() || '').toLowerCase(); } catch (e) {}

  /* Hỏi thẳng Drive xem người này có nằm trong danh sách được sửa file gốc
   * không. Chủ file luôn được, nên kiểm cả hai. */
  let duoc = null;                       // null = không hỏi được, để rơi xuống dưới
  try {
    const f = DriveApp.getFileById(ss.getId());
    const chu = String(f.getOwner() ? f.getOwner().getEmail() : '').toLowerCase();
    const sua = f.getEditors().map(function (e) {
      return String(e.getEmail() || '').toLowerCase();
    });
    duoc = (ai && (ai === chu || sua.indexOf(ai) >= 0));
  } catch (e) { duoc = null; }

  if (duoc === false) {
    throw new Error('Tài khoản ' + (ai || 'này') + ' chỉ được xem file gốc, ' +
      'không được sửa, nên không xuất kết quả được. Việc này dành cho quản lý ' +
      'phòng Nhân sự trở lên.');
  }

  /* duoc === null: Drive không trả lời được — hay gặp khi file thuộc một tài
   * khoản tổ chức khác. Không chặn, vì chặn nhầm thì phòng Nhân sự không làm
   * được việc cuối tháng. Nhưng ghi rõ vào vết là đã không kiểm được. */
  return (ai || '(không rõ tài khoản)') + (duoc === null ? ' [chưa soát được quyền]' : '');
}

function _appGhiVetXuat(ai, noiDung) {
  try { _ghiNhatKy('App xuất kết quả', ai + ' · ' + noiDung); } catch (e) {}
}

/** Xuất cho MỘT người. Hỏi mã nhân sự và kỳ, xem thử trước rồi mới ghi. */
function appXuatPhieuMenu() {
  const ui = _ui();
  const ai = _appCanhMenu();

  const h1 = ui.prompt('📤 Xuất kết quả cho một người',
    'Mã nhân sự, ví dụ THU-01:', ui.ButtonSet.OK_CANCEL);
  if (h1.getSelectedButton() !== ui.Button.OK) return;
  const maNV = h1.getResponseText().trim();
  if (!maNV) return;

  const nay = new Date();
  const macDinh = nay.getFullYear() + '-' + ('0' + (nay.getMonth() + 1)).slice(-2);
  const h2 = ui.prompt('📤 Kỳ nào',
    'Kỳ dạng NĂM-THÁNG. Để trống thì lấy tháng này (' + macDinh + '):',
    ui.ButtonSet.OK_CANCEL);
  if (h2.getSelectedButton() !== ui.Button.OK) return;
  const ky = h2.getResponseText().trim() || macDinh;

  let thu;
  try { thu = _appXuatPhieuLoi(maNV, ky, true); }
  catch (e) { ui.alert('Chưa xuất được', e.message, ui.ButtonSet.OK); return; }

  const dong = ui.alert('Xem trước — chưa ghi gì',
    thu.ten + ' · tháng ' + thu.thang + '\n\n' +
    'Sẽ ghi   : ' + thu.daGhi + '/' + thu.soCauTrenPhieu + ' câu\n' +
    'Để hội đồng tự đánh: ' + thu.deHoiDongTuDanh.length + ' câu ranh giới và bảo mật\n' +
    (thu.khongCoTrongApp.length
      ? 'Không có trong app : ' + thu.khongCoTrongApp.length + ' câu\n' : '') +
    (thu.lechBanDo.length
      ? '⚠️ Bản đồ trỏ sai : ' + thu.lechBanDo.length + ' mã, đã bỏ qua\n' : '') +
    '\nĐiểm tổng ' + (thu.diemTong === null ? '—' : thu.diemTong.toFixed(2)) +
    '  ·  bậc ' + (thu.bac || '—') + '\n\n' +
    '⚠️ Ghi vào là ĐÈ LÊN cột Điểm đang có. Nếu hội đồng đã sửa tay thì mất.\n\n' +
    'Ghi vào phiếu?', ui.ButtonSet.YES_NO);
  if (dong !== ui.Button.YES) return;

  try {
    const kq = _appXuatPhieuLoi(maNV, ky, false);
    _appGhiVetXuat(ai, 'ghi ' + kq.daGhi + ' câu cho ' + kq.ten + ' tháng ' + kq.thang);
    ui.alert('Đã xuất ✅', kq.thongBao + '\n\nMở phiếu:\n' + kq.url, ui.ButtonSet.OK);
  } catch (e) {
    ui.alert('Hỏng giữa chừng', e.message, ui.ButtonSet.OK);
  }
}

/**
 * Xuất cho CẢ ĐỢT.
 *
 * ⚠️ Apps Script cắt ngang ở phút thứ sáu. Ba mươi người, mỗi người mở một file
 * năm riêng, là chạm ngưỡng đó. Nên hàm này làm theo lô: mỗi lần một số người,
 * nhớ chỗ đang dở trong PropertiesService, bấm lại là chạy tiếp — không bao giờ
 * làm lại từ đầu.
 */
function appXuatPhieuCaDot() {
  const ui = _ui();
  const ai = _appCanhMenu();
  const kho = PropertiesService.getScriptProperties();

  let dangDo = null;
  try { dangDo = JSON.parse(kho.getProperty('APP_DOT_XUAT') || 'null'); } catch (e) {}

  if (dangDo && dangDo.conLai && dangDo.conLai.length) {
    const tiep = ui.alert('📤 Đang dở một đợt',
      'Kỳ ' + dangDo.ky + ' · còn ' + dangDo.conLai.length + ' người chưa xuất.\n\n' +
      'CÓ  — chạy tiếp chỗ đang dở\n' +
      'KHÔNG — bỏ đợt cũ, bắt đầu đợt mới', ui.ButtonSet.YES_NO_CANCEL);
    if (tiep === ui.Button.CANCEL) return;
    if (tiep === ui.Button.NO) { kho.deleteProperty('APP_DOT_XUAT'); dangDo = null; }
  }

  if (!dangDo) {
    const nay = new Date();
    const macDinh = nay.getFullYear() + '-' + ('0' + (nay.getMonth() + 1)).slice(-2);
    const h = ui.prompt('📤 Xuất kết quả cả đợt',
      'Kỳ dạng NĂM-THÁNG. Để trống thì lấy tháng này (' + macDinh + '):',
      ui.ButtonSet.OK_CANCEL);
    if (h.getSelectedButton() !== ui.Button.OK) return;
    const ky = h.getResponseText().trim() || macDinh;

    const sh = _ss().getSheetByName(CFG.SHEETS.NS);
    const v = sh.getRange(NS.R_DAU, 1, sh.getLastRow() - NS.R_DAU + 1, NS.C_LINK).getValues();
    const ds = [];
    v.forEach(function (d) {
      const ma = String(d[NS.C_MA - 1] || '').trim();
      const link = String(d[NS.C_LINK - 1] || '').trim();
      if (ma && link) ds.push(ma);
    });
    if (!ds.length) {
      ui.alert('Chưa ai có file năm', 'Cột File năm ở sheet ' + CFG.SHEETS.NS +
        ' đang trống hết. Tạo file năm bằng menu 📅 trước.', ui.ButtonSet.OK);
      return;
    }
    if (ui.alert('📤 Xuất cả đợt', ds.length + ' người có file năm, kỳ ' + ky +
        '.\n\n⚠️ Ghi vào là ĐÈ LÊN cột Điểm đang có của cả ' + ds.length +
        ' phiếu.\n\nBắt đầu?', ui.ButtonSet.YES_NO) !== ui.Button.YES) return;
    dangDo = { ky: ky, conLai: ds, xong: [], hong: [] };
  }

  const batDau = Date.now();
  const HAN = 4 * 60 * 1000;      // dừng ở phút thứ tư, chừa chỗ để lưu và báo

  while (dangDo.conLai.length && Date.now() - batDau < HAN) {
    const ma = dangDo.conLai.shift();
    try {
      const kq = _appXuatPhieuLoi(ma, dangDo.ky, false);
      dangDo.xong.push(ma + ' (' + kq.daGhi + ' câu)');
    } catch (e) {
      dangDo.hong.push(ma + ': ' + e.message);
    }
  }

  const con = dangDo.conLai.length;
  if (con) kho.setProperty('APP_DOT_XUAT', JSON.stringify(dangDo));
  else kho.deleteProperty('APP_DOT_XUAT');

  _appGhiVetXuat(ai, 'đợt ' + dangDo.ky + ' · xong ' + dangDo.xong.length +
                     ' · hỏng ' + dangDo.hong.length + ' · còn ' + con);

  ui.alert(con ? '⏸️ Tạm nghỉ, chưa hết' : 'Đã xuất xong cả đợt ✅',
    'Xong  : ' + dangDo.xong.length + ' người\n' +
    'Hỏng  : ' + dangDo.hong.length + ' người' +
    (dangDo.hong.length ? '\n   ' + dangDo.hong.slice(0, 6).join('\n   ') : '') +
    (con ? '\n\nCòn ' + con + ' người. Apps Script chỉ chạy được sáu phút mỗi ' +
           'lượt, nên bấm lại mục này là chạy tiếp đúng chỗ đang dở.' : ''),
    ui.ButtonSet.OK);
}

function appOnOpen() {
  try { appThemMenu(); } catch (e) { /* mở file không bao giờ được hỏng vì app */ }
}

function appCaiTrigger() {
  const ss = _ss();
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'appOnOpen') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('appOnOpen').forSpreadsheet(ss).onOpen().create();
  Logger.log('✅ Đã cài trigger mở menu. Tải lại trang là thấy 📱 Ứng dụng biên bản.');
}

function appThemMenu() {
  _ui().createMenu('📱 Ứng dụng biên bản')
    .addItem('🔗 Mở ứng dụng', 'appMoUngDung')
    .addSeparator()
    .addItem('📤 Xuất kết quả cho một người', 'appXuatPhieuMenu')
    .addItem('📤 Xuất kết quả cả đợt', 'appXuatPhieuCaDot')
    .addSeparator()
    .addItem('🔧 Cài đặt lần đầu', 'appCaiDatLanDau')
    .addItem('🩺 Kiểm tra cài đặt', 'appKiemTra')
    .addItem('🔑 Đặt lại mật khẩu cứu hộ', 'appDatLaiMatKhauCuuHo')
    .addToUi();
}

function appMoUngDung() {
  const url = ScriptApp.getService().getUrl();
  _ui().alert('📱 Ứng dụng biên bản',
    url ? ('Đường dẫn:\n\n' + url + '\n\nGửi link này cho cả nhà.')
        : 'Chưa triển khai. Vào Triển khai → Triển khai mới → Ứng dụng web.',
    _ui().ButtonSet.OK);
}

/* ==================== SOÁT SAU KHI BÊN KIA GỬI CODE MỚI ==================== */

/**
 * Mọi thứ app mượn của 16 file gốc. Bên kia đổi tên hay bỏ đi cái nào thì
 * hàm appSoatTuongThich() bên dưới chỉ đúng vào cái đó.
 *
 * ⚠️ Sửa danh sách này mỗi khi app mượn thêm thứ gì mới.
 */
const APP_MUON = [
  ['CFG',            'đối tượng', '01_Code.gs',      'tên các sheet'],
  ['VERSION',        'đối tượng', '01_Code.gs',      'số phiên bản, chỉ để ghi log'],
  ['_ss',            'hàm',       '01_Code.gs',      'bảng tính hiện hành'],
  ['_ui',            'hàm',       '01_Code.gs',      'giao diện menu'],
  ['CAP_BAC',        'đối tượng', '03_DuLieuTuyen.gs', 'thang 11 cấp bậc'],
  ['TUYEN',          'đối tượng', '03_DuLieuTuyen.gs', 'danh mục tuyến'],
  ['_traCap',        'hàm',       '03_DuLieuTuyen.gs', 'tên cấp → bậc và ngạch'],
  ['_chuanTenTuyen', 'hàm',       '03_DuLieuTuyen.gs', 'chuẩn hoá tên tuyến'],
  ['_macDinh',       'hàm',       '06_Phieu.gs',      'điểm khởi đầu 5 hoặc 0'],
  ['PC',             'đối tượng', '06_Phieu.gs',      'sơ đồ cột phiếu chấm'],
  ['_thuMucGoc',     'hàm',       '07_XuatDrive.gs', 'thư mục Đánh giá trên Drive'],
  ['_thuMucCon',     'hàm',       '07_XuatDrive.gs',      'tạo hoặc lấy thư mục con'],
  ['NS',             'đối tượng', '10_NhanSu.gs',     'sơ đồ cột sheet Nhân sự'],
  ['_traNhanSu',     'hàm',       '10_NhanSu.gs',     'một nhân sự theo mã'],
  ['BCH',            'đối tượng', '16_BoCauHoiSheet.gs', 'sơ đồ sheet Bộ câu hỏi'],
  ['_docBoCauHoi',   'hàm',       '16_BoCauHoiSheet.gs', 'đọc toàn bộ bộ câu hỏi']
];

/**
 * CHẠY HÀM NÀY MỖI LẦN BÊN KIA GỬI BẢN CODE MỚI, ngay sau khi dán xong.
 *
 * Nó không sửa gì, chỉ soi ba loại hỏng mà một bản cập nhật có thể gây ra:
 *
 *   1. THIẾU     bên kia đổi tên hoặc bỏ một thứ module 17 đang mượn
 *   2. TRÙNG     bên kia thêm hàm trùng tên với hàm của module 17
 *   3. RỜI       trigger mở menu bị mất, hoặc file giao diện 18 không còn
 *
 * Ba loại này đều gãy IM LẶNG nếu không soát: app vẫn mở được, chỉ sai số
 * hoặc mất nút, mà không ai biết cho tới cuối tháng.
 */
function appSoatTuongThich() {
  const loi = [], canh = [];
  Logger.log('══ SOÁT TƯƠNG THÍCH GIỮA APP VÀ 16 FILE GỐC ══');
  Logger.log('');

  /* 1. THIẾU ─────────────────────────────────────────────── */
  Logger.log('1. NHỮNG THỨ APP MƯỢN CỦA FILE GỐC');
  APP_MUON.forEach(function (m) {
    const ten = m[0], loai = m[1], o = m[2], viec = m[3];
    let co = false;
    try { co = (loai === 'hàm') ? (typeof this[ten] === 'function' ||
                                   eval('typeof ' + ten) === 'function')
                                : (eval('typeof ' + ten) !== 'undefined'); }
    catch (e) { co = false; }
    if (co) Logger.log('   ✅ ' + ten);
    else {
      Logger.log('   ❌ ' + ten + '  (' + o + ' — ' + viec + ')');
      loi.push('Thiếu ' + ten + ', vốn ở ' + o + ' và dùng để ' + viec);
    }
  });

  /* 2. TRÙNG ─────────────────────────────────────────────── */
  Logger.log('');
  Logger.log('2. TÊN CÓ THỂ ĐỤNG NHAU');
  Logger.log('   ⚠️ Apps Script chỉ giữ bản khai SAU CÙNG, không báo lỗi.');
  ['doGet', 'doPost', 'onOpen', 'onEdit'].forEach(function (t) {
    let n = 0;
    try { if (eval('typeof ' + t) === 'function') n = 1; } catch (e) {}
    const cua = (t === 'doGet' || t === 'doPost');
    Logger.log('   ' + (cua && n ? '✅' : '   ') + ' ' + t +
               (n ? ' — có' : ' — không có'));
  });
  Logger.log('   → App CẦN cả doGet và doPost. Bản mới của bên kia mà thêm một');
  Logger.log('     trong hai thì phải gộp, vì một dự án chỉ chạy được một cái.');

  /* 3. RỜI ───────────────────────────────────────────────── */
  Logger.log('');
  Logger.log('3. NHỮNG THỨ NẰM NGOÀI CODE');

  let coTrigger = false;
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'appOnOpen') coTrigger = true;
  });
  Logger.log(coTrigger ? '   ✅ Trigger mở menu còn'
                       : '   ❌ MẤT trigger mở menu → chạy appCaiTrigger');
  if (!coTrigger) loi.push('Mất trigger mở menu, chạy appCaiTrigger để cài lại');

  let coGiaoDien = false;
  try { HtmlService.createHtmlOutputFromFile('App_GiaoDien'); coGiaoDien = true; }
  catch (e) {}
  Logger.log(coGiaoDien ? '   ✅ File App_GiaoDien.html còn'
                        : '   ❌ MẤT file App_GiaoDien.html → app không mở được');
  if (!coGiaoDien) loi.push('Mất file App_GiaoDien.html');

  const f = _appTepKho();
  Logger.log(f ? '   ✅ Kho dữ liệu còn (' + f.getUrl() + ')'
               : '   ❌ MẤT kho dữ liệu → mọi biên bản không đọc được');
  if (!f) loi.push('Mất kho dữ liệu JSON trên Drive');

  /* 4. THỬ CHẠY THẬT ─────────────────────────────────────── */
  Logger.log('');
  Logger.log('4. THỬ CHẠY THẬT, KHÔNG GHI GÌ');
  try {
    const n = _appBoCauPhang().length;
    Logger.log('   ✅ Đọc bộ câu hỏi: ' + n + ' câu');
    if (!n) canh.push('Bộ câu hỏi đọc ra 0 câu — kiểm cột Vào phiếu');
  } catch (e) {
    Logger.log('   ❌ Đọc bộ câu hỏi hỏng: ' + e.message);
    loi.push('Không đọc được bộ câu hỏi: ' + e.message);
  }
  try {
    const t = _appTrongSo(true, true);
    Logger.log('   ✅ Trọng số: khung chung ' + t.kc + ' · quản lý ' + t.ql +
               ' · chuyên môn ' + t.cm);
    if (Math.abs(t.kc + t.ql + t.cm - 1) > 0.001)
      canh.push('Ba trọng số cộng lại ra ' + (t.kc + t.ql + t.cm) + ', không phải 1');
  } catch (e) {
    Logger.log('   ❌ Đọc trọng số hỏng: ' + e.message);
    loi.push('Không đọc được trọng số: ' + e.message);
  }

  /* KẾT ──────────────────────────────────────────────────── */
  Logger.log('');
  Logger.log('══ KẾT ══');
  if (!loi.length && !canh.length) {
    Logger.log('✅ Bản mới không phá gì. App dùng tiếp được ngay.');
  } else {
    loi.forEach(function (x) { Logger.log('❌ ' + x); });
    canh.forEach(function (x) { Logger.log('⚠️ ' + x); });
    Logger.log('');
    Logger.log('Gửi đúng khối chữ này cho người viết file gốc là họ hiểu ngay.');
  }
  return { ok: !loi.length, loi: loi, canh: canh };
}

/**
 * TÀI KHOẢN QUẢN TRỊ ĐẦU TIÊN.
 *
 * ⛔ SỬA 04/9/2026. Bản trước dựng kho với users: [] rồi bảo chạy appNapNhanSu,
 * mà hàm đó đặt mọi người là 'staff'. Kết quả: kho có 33 người và KHÔNG MỘT AI
 * là quản trị. Không ai mở được phần Quản lý, không ai phong quyền cho ai được,
 * và appDatLaiMatKhauCuuHo cũng chịu vì nó chỉ đặt lại một ADMIN đã có sẵn.
 * Cửa khoá, chìa nằm bên trong.
 *
 * Nay kho nào cũng phải có ít nhất một quản trị. Gọi được nhiều lần, đã có thì thôi.
 */
function _appBaoDamCoAdmin(db) {
  let ad = null;
  (db.users || []).forEach(function (u) {
    if (!ad && u.role === 'admin' && u.active !== false) ad = u;
  });
  if (ad) return { moi: false, u: ad };

  const u = { id: 'u_admin', code: 'ADMIN', name: 'Quản trị hệ thống',
              titleVi: 'Quản trị hệ thống', role: 'admin', active: true,
              hearing: 'hearing', joinedAt: new Date().toISOString() };
  _appDatMatKhau(u, APP.MAT_KHAU_TAM, true);
  db.users = db.users || [];
  db.users.push(u);
  return { moi: true, u: u };
}

function appCaiDatLanDau() {
  const f = _appTepKho();
  if (f) { Logger.log('Đã có kho: ' + f.getUrl()); }
  else {
    _appGhiKho({ version: 4, users: [], records: [], reviews: [],
                 sites: [], depts: [], tracks: [], settings: {}, boundaries: {} });
    Logger.log('✅ Đã tạo kho: ' + _appTepKho().getUrl());
  }

  const db = _appDocKho();
  const kq = _appBaoDamCoAdmin(db);
  if (kq.moi) {
    _appGhiKho(db);
    Logger.log('✅ Đã tạo tài khoản quản trị đầu tiên.');
    Logger.log('      Mã đăng nhập: ADMIN');
    Logger.log('      Mật khẩu tạm: ' + APP.MAT_KHAU_TAM + '  (app sẽ bắt đổi ngay lần đầu)');
  } else {
    Logger.log('Đã có quản trị: ' + kq.u.code + ' — ' + (kq.u.name || ''));
  }
  Logger.log('Thư mục app: ' + _appThuMuc().getUrl());

  /* Dựng luôn thư mục Ảnh. Không có nó thì lần đầu ai gửi ảnh mới tạo, mà lúc
     đó người dùng đang chờ — chậm và dễ tưởng là hỏng. */
  Logger.log('Thư mục ảnh: ' + _appThuMucAnhGoc().getUrl());
  Logger.log('   Ảnh xếp theo người: Ảnh / <mã> - <tên> / ' +
             Object.keys(APP_NGAN_ANH).map(function (k) { return APP_NGAN_ANH[k]; }).join(' · '));

  Logger.log('Bước tiếp: chạy appNapNhanSu để lấy danh sách từ sheet 👥 Nhân sự.');
}

/** Nạp danh sách nhân sự từ sheet 👥 Nhân sự của chính file này vào kho app. */
function appNapNhanSu(token) {
  if (token) _appBatBuocVai(token, 'admin');

  const sh = _ss().getSheetByName(CFG.SHEETS.NS);
  if (!sh) return { ok: false, loi: 'Không có sheet ' + CFG.SHEETS.NS + '.' };

  const db = _appDocKho() || { version: 4, users: [], records: [] };
  const v = sh.getRange(NS.R_DAU, 1, sh.getLastRow() - NS.R_DAU + 1, NS.SOCOT).getValues();

  const theoMa = {};
  (db.users || []).forEach(function (u) { theoMa[String(u.code || '').toUpperCase()] = u; });

  let them = 0, capNhat = 0, nghi = 0;
  const con = {};

  v.forEach(function (d) {
    const ma = String(d[NS.C_MA - 1] || '').trim();
    if (!ma) return;
    con[ma.toUpperCase()] = true;

    let u = theoMa[ma.toUpperCase()];
    if (!u) {
      u = { id: 'u_' + ma.toLowerCase(), code: ma, role: 'staff', active: true };
      _appDatMatKhau(u, APP.MAT_KHAU_TAM, true);
      db.users.push(u);
      them++;
    } else { capNhat++; }

    u.name     = String(d[NS.C_TEN - 1] || '').trim() || u.name;
    u.titleVi  = String(d[NS.C_VITRI - 1] || '').trim();
    u.capBac   = String(d[NS.C_TT - 1] || '').trim();
    u.tenTuyen = _chuanTenTuyen(String(d[NS.C_TUYEN - 1] || '').trim());
    u.hearing  = /điếc|khiếm/i.test(String(d[NS.C_NGHE - 1] || '')) ? 'deaf' : 'hearing';
    u.tenPhongBan = String(d[NS.C_PHONG - 1] || '').trim();
    u.tenDiemLamViec = String(d[NS.C_DIEM - 1] || '').trim();
    const t = TUYEN[u.tenTuyen];
    u.coDiemBan = !!(t && t.coDiemBan);
    u.active = true;
  });

  // Người sheet không còn: đánh dấu nghỉ, KHÔNG xoá, để biên bản cũ còn chỗ bám.
  (db.users || []).forEach(function (u) {
    if (u.active !== false && !con[String(u.code || '').toUpperCase()]) {
      u.active = false; nghi++;
    }
  });

  /* Sheet 👥 Nhân sự không có cột vai trò, nên ai nạp vào cũng là 'staff'.
     Nạp xong mà kho không còn quản trị nào thì lại khoá cửa. */
  const ad = _appBaoDamCoAdmin(db);

  _appGhiKho(db);
  let tb = 'Đã nạp: thêm ' + them + ', cập nhật ' + capNhat + ', nghỉ ' + nghi + '.';
  if (ad.moi) tb += ' Đã tạo tài khoản ADMIN (mật khẩu tạm ' + APP.MAT_KHAU_TAM + ').';
  Logger.log(tb);
  return { ok: true, them: them, capNhat: capNhat, nghi: nghi,
           adminMoi: ad.moi, thongBao: tb };
}

/**
 * ĐƯA KHO CŨ TỪ BẢN ARTIFACT SANG DRIVE.
 *
 * Ba kho khác nhau, không cái nào tự chảy sang cái nào:
 *   1. Kho của bản artifact  — nằm trong Claude, là nơi có 33 người và 7 sự việc
 *   2. localStorage          — nằm trong trình duyệt từng máy
 *   3. Tệp JSON trên Drive   — bản GitHub + Apps Script đang dùng, hiện rỗng
 *
 * Cách dùng:
 *   1. Ở bản cũ bấm Quản lý → Xuất dữ liệu, được tệp DuLieu_DanhGiaNhanSu.json
 *   2. Tải tệp đó lên thư mục "Ứng dụng đánh giá" trên Drive, đổi tên NhapVao.json
 *   3. Về Apps Script chạy hàm này
 *
 * Kho đang có được sao lưu trước khi ghi đè, nên chạy nhầm vẫn quay lại được.
 */
function appNapKhoCu() {
  const TEN = 'NhapVao.json';

  const it = _appThuMuc().getFilesByName(TEN);
  if (!it.hasNext()) {
    Logger.log('❌ Chưa thấy tệp "' + TEN + '" trong thư mục ' + APP.THU_MUC_TEN + '.');
    Logger.log('   Thư mục: ' + _appThuMuc().getUrl());
    Logger.log('   Tải tệp DuLieu_DanhGiaNhanSu.json lên đó rồi đổi tên thành ' + TEN + '.');
    return;
  }

  let moi;
  try { moi = JSON.parse(it.next().getBlob().getDataAsString('UTF-8')); }
  catch (e) { Logger.log('❌ Tệp không phải JSON hợp lệ: ' + e.message); return; }

  if (!moi || typeof moi !== 'object' || !Array.isArray(moi.users)) {
    Logger.log('❌ Tệp thiếu nhánh "users". Đây có đúng là tệp kho không?');
    return;
  }

  // Sao lưu bản đang có TRƯỚC khi động vào.
  const cu = _appDocKho();
  if (cu) {
    const ten = 'SaoLuu_' + Utilities.formatDate(new Date(),
                  Session.getScriptTimeZone(), 'yyyyMMdd_HHmmss') + '.json';
    _appThuMuc().createFile(ten, JSON.stringify(cu), MimeType.PLAIN_TEXT);
    Logger.log('💾 Đã sao lưu kho cũ: ' + ten +
               ' (' + (cu.users || []).length + ' người)');
  }

  ['records', 'reviews', 'sites', 'depts', 'tracks'].forEach(function (k) {
    if (!Array.isArray(moi[k])) moi[k] = [];
  });
  if (!moi.settings   || typeof moi.settings   !== 'object') moi.settings   = {};
  if (!moi.boundaries || typeof moi.boundaries !== 'object') moi.boundaries = {};
  moi.version = 4;

  const ad = _appBaoDamCoAdmin(moi);
  _appGhiKho(moi);

  const vai = {};
  moi.users.forEach(function (u) { vai[u.role || 'staff'] = (vai[u.role || 'staff'] || 0) + 1; });

  Logger.log('✅ ĐÃ NẠP XONG');
  Logger.log('   Người   : ' + moi.users.length + '  (' +
             Object.keys(vai).map(function (k) { return k + ' ' + vai[k]; }).join(' · ') + ')');
  Logger.log('   Sự việc : ' + moi.records.length);
  Logger.log('   Kháng nghị: ' + moi.reviews.length);
  if (ad.moi) Logger.log('   ⚠️ Tệp không có quản trị nào — đã tạo ADMIN, mật khẩu tạm ' + APP.MAT_KHAU_TAM);
  Logger.log('   Mật khẩu cũ của mọi người giữ nguyên, đăng nhập như trước.');
  Logger.log('   Tiêu chí vẫn đọc từ sheet 📚 Bộ câu hỏi, không lấy trong tệp này.');
}

/** Chạy thẳng từ trình soạn thảo khi không ai vào được Quản lý nữa. */
function appDatLaiMatKhauCuuHo() {
  const MA = 'ADMIN';          // ← mã của người cần đặt lại
  const MK = '';               // ← để trống thì dùng mật khẩu tạm

  const db = _appDocKho();
  if (!db) { Logger.log('❌ Chưa có kho. Chạy appCaiDatLanDau trước.'); return; }

  let u = null;
  (db.users || []).forEach(function (x) {
    if (!u && String(x.code || '').toUpperCase() === MA.toUpperCase()) u = x;
  });
  if (!u) {
    Logger.log('❌ Không có mã "' + MA + '". Các mã quản trị: ' +
      (db.users || []).filter(function (x) { return x.role === 'admin'; })
                      .map(function (x) { return x.code; }).join(', '));
    return;
  }
  const mk = MK || APP.MAT_KHAU_TAM;
  _appDatMatKhau(u, mk, true);
  _appGhiKho(db);
  Logger.log('✅ Đã đặt lại cho ' + u.code + ' — ' + u.name + '. Mật khẩu tạm: ' + mk);
}

/** Soi tình trạng, không sửa gì. */
function appKiemTra() {
  Logger.log('── KIỂM TRA ỨNG DỤNG ──');

  const f = _appTepKho();
  Logger.log(f ? '✅ Kho: ' + f.getUrl() : '❌ Chưa có kho. Chạy appCaiDatLanDau.');

  try {
    const ta = _appThuMucAnhGoc();
    let soNguoi = 0, soAnh = 0;
    const itn = ta.getFolders();
    while (itn.hasNext()) {
      soNguoi++;
      const itl = itn.next().getFolders();
      while (itl.hasNext()) {
        const itf = itl.next().getFiles();
        while (itf.hasNext()) { itf.next(); soAnh++; }
      }
    }
    Logger.log('✅ Thư mục ảnh: ' + soNguoi + ' nhân sự · ' + soAnh + ' ảnh');
    Logger.log('   ' + ta.getUrl());
  } catch (e) {
    Logger.log('❌ Không mở được thư mục ảnh: ' + e.message);
  }

  const db = f ? _appDocKho() : null;
  if (db) {
    const qt = (db.users || []).filter(function (u) { return u.role === 'admin'; });
    Logger.log('   ' + (db.users || []).length + ' nhân sự · ' +
               (db.records || []).length + ' sự việc');
    Logger.log(qt.length ? '✅ Quản trị: ' + qt.map(function (u) { return u.code; }).join(', ')
                         : '❌ KHÔNG có tài khoản quản trị nào.');
  }

  const bc = _docBoCauHoi();
  if (bc) {
    let n = 0;
    (bc.chung || []).forEach(function (nh) { n += nh[2].length; });
    Object.keys(bc.tuyen || {}).forEach(function (t) {
      (bc.tuyen[t].chuyenMon || []).forEach(function (nh) { n += nh[2].length; });
      (bc.tuyen[t].quanLy    || []).forEach(function (nh) { n += nh[2].length; });
    });
    Logger.log('✅ Bộ câu hỏi đọc được: ' + n + ' câu đang bật');
  } else {
    Logger.log('❌ Không đọc được sheet ' + BCH.SHEET + '.');
  }

  const url = ScriptApp.getService().getUrl();
  Logger.log(url ? '✅ Đường dẫn API: ' + url
                 : '⚠️ Chưa triển khai. Vào Triển khai → Triển khai mới → Ứng dụng web,');
  if (!url) Logger.log('     chọn "Thực thi: Tôi" và "Ai có quyền: Bất kỳ ai".');
  Logger.log('   Dán đường dẫn này vào API_URL của App_GiaoDien.html.');
  Logger.log('── HẾT ──');
}
