/* ═══════════════════════════════════════════════════════════════════════════
   BỘ NỐI SUPABASE
   Nhà Của Thời Thanh Xuân · ứng dụng đánh giá nhân sự

   App được viết quanh MỘT object db khổng lồ: đọc cả kho, sửa thẳng vào đó,
   rồi ghi cả kho xuống. Supabase thì là bảng và dòng. Tệp này đứng giữa hai
   thế giới đó:

     tai()  đọc 8 bảng rồi lắp lại thành đúng cái db mà app quen dùng
     ghi()  so db mới với bản chụp lúc tải, chỉ viết đúng thứ đã đổi

   ⛔ VÌ SAO PHẢI SO SÁNH CHỨ KHÔNG GHI ĐÈ CẢ KHO
   Bản Apps Script nhận cả kho rồi tự lọc bằng _appLocThayDoi. Ở đây không làm
   thế được, và cũng không nên: RLS chỉ cho mỗi người thấy phần của mình, nên
   db trong tay một nhân viên KHÔNG chứa biên bản của người khác. Ghi đè cả kho
   nghĩa là xoá sạch những gì họ không được thấy. So sánh rồi chỉ đụng vào thứ
   đã đổi là cách duy nhất an toàn.
   ═══════════════════════════════════════════════════════════════════════════ */

(function (global) {
  'use strict';

  const HAU_TO = '@ttx.local';   // mã nhân viên TTX001 → ttx001@ttx.local

  /* ── Bản đồ tên cột. Trái là Supabase, phải là tên app vẫn dùng. ──────────
     Viết ra hết chứ không đoán theo quy tắc: đoán thì sai một trường là app
     mất dữ liệu ở đúng chỗ đó mà không báo gì. */
  const MAP = {
    nguoi: {
      bang: 'nguoi', nhanh: 'users',
      cot: {
        id: 'id', ma: 'code', ten: 'name', chuc_danh: 'titleVi',
        chuc_danh_en: 'titleEn', cap_bac: 'capBac', bac: 'level', vai: 'role',
        phong_ban_id: 'deptId', diem_id: 'siteId', tuyen_id: 'trackId',
        ten_tuyen: 'tenTuyen', nghe: 'hearing', co_diem_ban: 'coDiemBan',
        hoat_dong: 'active', la_thu: 'demo', phai_doi_mk: 'mustChange',
        vao_lam: 'joinedAt'
      }
    },
    su_viec: {
      bang: 'su_viec', nhanh: 'records',
      cot: {
        id: 'id', loai: 'type', nguoi_id: 'subjectId', nguoi_lap_id: 'reporterId',
        ma_tieu_chi: 'critCode', id_tieu_chi: 'critId', la_ranh_gioi: 'isBoundary',
        noi_dung: 'detail', xay_ra_luc: 'xayRaLuc', ky: 'period',
        trang_thai: 'status', ky_ns: 'kyNS', ky_ql: 'kyQL', tu_choi: 'tuChoi',
        khieu_nai: 'khieuNai', tra_loi: 'reply', ghi_chu: 'note', anh: 'anh',
        quyet_luc: 'decidedAt', quyet_boi: 'decidedBy', tao_luc: 'createdAt'
      }
    },
    danh_gia: {
      bang: 'danh_gia', nhanh: 'reviews',
      cot: {
        id: 'id', nguoi_id: 'revieweeId', nguoi_cham_id: 'reviewerId',
        ky: 'period', diem: 'scores', nhan_xet: 'comment', ghi_chu: 'note',
        trang_thai: 'status', quyet_luc: 'decidedAt', quyet_boi: 'decidedBy',
        tao_luc: 'createdAt'
      }
    },
    /* ⚠️ Bản đồ này từng thiếu bốn thứ app thật sự đọc — weight, bac, trackId,
       name — và lại có tenTuyen mà app không dùng ở đâu. Trước khi đổi gì ở
       đây, grep trong index.html xem trường đó có được đọc thật không. */
    tieu_chi: {
      bang: 'tieu_chi', nhanh: 'criteria',
      cot: {
        id: 'id', ma: 'code', ma_nhom: 'gcode', nhom: 'group', che_do: 'mode',
        ten: 'name', noi_dung: 'text', pham_vi: 'scope', ngach: 'ngach',
        bac: 'bac', trong_so: 'weight', tuyen_id: 'trackId', hoat_dong: 'active'
      }
    },
    phong_ban:     { bang: 'phong_ban',     nhanh: 'depts',  cot: { id: 'id', ten: 'name' } },
    diem_lam_viec: { bang: 'diem_lam_viec', nhanh: 'sites',  cot: { id: 'id', ten: 'name', la_quay: 'isPos' } },
    tuyen:         { bang: 'tuyen',         nhanh: 'tracks',
                     cot: { id: 'id', ten: 'name', ngach: 'ngach', bo_nhom: 'noGroups',
                            ql_cho_tat_ca: 'qlForAll', san_sang: 'ready' } }
  };

  /* Cột app KHÔNG được phép sửa — máy chủ tự đặt hoặc luật cấm.
     Gửi lên cũng bị trigger chặn, nhưng lọc sẵn ở đây thì lỗi không nổ giữa
     mặt người dùng. */
  const CAM_SUA = {
    su_viec: ['loai', 'nguoi_id', 'nguoi_lap_id', 'ma_tieu_chi', 'la_ranh_gioi',
              'noi_dung', 'xay_ra_luc', 'ky', 'tao_luc']
  };

  function sangApp(m, dong) {
    const o = {};
    for (const c in m.cot) if (dong[c] !== undefined && dong[c] !== null) o[m.cot[c]] = dong[c];
    return o;
  }

  function sangDb(m, o) {
    const d = {};
    for (const c in m.cot) { const k = m.cot[c]; if (o[k] !== undefined) d[c] = o[k]; }
    return d;
  }

  const bang = o => JSON.stringify(o);

  /* ⛔ PHẢI CHÉP HẲN RA, ĐỪNG GIỮ THAM CHIẾU.
     App sửa THẲNG vào chính mảng db mà tai() vừa trả về. Nếu bản chụp chỉ trỏ
     vào cùng những object đó thì app sửa gì, bản chụp cũng đổi y hệt — và hàm
     so sánh luôn thấy "không có gì đổi".
     Hậu quả không phải là app báo lỗi: phòng Nhân sự bấm duyệt, màn hình báo
     đã lưu, mà database không nhận được gì. Mất dữ liệu trong im lặng, kiểu
     tệ nhất. Bài thử "phòng Nhân sự duyệt" là thứ bắt được nó. */
  const theoId = arr => {
    const m = {};
    (arr || []).forEach(x => { if (x && x.id) m[x.id] = JSON.parse(JSON.stringify(x)); });
    return m;
  };

  /* ══════════════════════════════════════════════════════════════════════ */

  function taoKho(sb) {
    let chup = null;      // ảnh chụp lúc tải, để so khi ghi
    let toi = null;       // người đang đăng nhập, dòng ttx.nguoi
    let bao = 'chưa nối';

    const q = t => sb.schema('ttx').from(t);

    async function dangNhap(ma, matKhau) {
      const email = String(ma || '').trim().toLowerCase() + HAU_TO;
      const { error } = await sb.auth.signInWithPassword({ email, password: matKhau });
      if (error) {
        // Đừng nói "email sai" — nhà mình đăng nhập bằng mã nhân viên.
        throw new Error(/Invalid login/i.test(error.message)
          ? 'Mã nhân sự hoặc mật khẩu chưa đúng.'
          : error.message);
      }
      return true;
    }

    async function doiMatKhau(moi) {
      if (String(moi || '').length < 6) throw new Error('Mật khẩu tối thiểu 6 ký tự.');
      const { error } = await sb.auth.updateUser({ password: moi });
      if (error) throw new Error(error.message);
      const { data: { user } } = await sb.auth.getUser();
      if (user) await q('nguoi').update({ phai_doi_mk: false }).eq('id', user.id);
      return true;
    }

    async function daDangNhap() {
      const { data } = await sb.auth.getSession();
      return !!(data && data.session);
    }

    async function tai() {
      if (!(await daDangNhap())) { bao = 'Supabase: chưa đăng nhập'; return null; }

      const ten = Object.keys(MAP);
      const ra = await Promise.all(
        ten.map(k => q(MAP[k].bang).select('*'))
          .concat([q('tham_so').select('*'), q('ranh_gioi').select('*')])
      );

      const loi = ra.find(r => r.error);
      if (loi) throw new Error(_docLoi(loi.error));

      const db = { version: 4 };
      ten.forEach((k, i) => {
        db[MAP[k].nhanh] = (ra[i].data || []).map(d => sangApp(MAP[k], d));
      });

      db.settings = {};
      (ra[ten.length].data || []).forEach(r => { db.settings[r.khoa] = r.gia_tri; });
      db.boundaries = {};
      (ra[ten.length + 1].data || []).forEach(r => { db.boundaries[r.khoa] = r.muc; });

      /* ⛔ Chép ra, đừng trỏ vào db.users. Nếu toi là chính object trong db thì
         chỉ cần gõ trong Console `DB.users[0].role = 'admin'` là bộ nối tưởng
         mình đang là quản trị và bắt đầu gửi lệnh sửa nhân sự, tiêu chí, tham
         số. RLS bên Supabase vẫn chặn hết — nhưng lúc đó app đã đứng gửi hàng
         loạt lệnh hỏng và báo lỗi loạn xạ. Hàng rào thật ở database, hàng rào
         này chỉ để đừng gửi thứ chắc chắn bị từ chối. */
      const { data: { user } } = await sb.auth.getUser();
      const me = user ? db.users.find(u => u.id === user.id) : null;
      toi = me ? JSON.parse(JSON.stringify(me)) : null;

      chup = {
        users:   theoId(db.users),
        records: theoId(db.records),
        reviews: theoId(db.reviews),
        criteria: theoId(db.criteria),
        depts:   theoId(db.depts),
        sites:   theoId(db.sites),
        tracks:  theoId(db.tracks),
        settings: bang(db.settings),
        boundaries: bang(db.boundaries)
      };
      bao = 'Supabase: đang dùng · ' + db.users.length + ' người, '
          + db.records.length + ' sự việc';
      return db;
    }

    /** Ghi phần đã đổi. Trả về { ok } hoặc { ok:false, loi, cach }. */
    async function ghi(db) {
      if (!chup) return { ok: false, loi: 'Chưa tải dữ liệu.', cach: 'Tải lại trang giúp em.' };
      const viec = [];

      // ── sự việc: thêm mới và sửa phần được phép ──
      for (const r of (db.records || [])) {
        const cu = chup.records[r.id];
        if (!cu) { viec.push(_them('su_viec', MAP.su_viec, r)); continue; }
        const d = _khac(MAP.su_viec, cu, r, CAM_SUA.su_viec);
        if (d) viec.push(_sua('su_viec', r.id, d));
      }

      // ── các nhánh chỉ quản trị đụng được. Người thường có gửi cũng bị RLS
      //    chặn, nên chỉ xếp việc khi đúng là quản trị, cho đỡ báo lỗi thừa. ──
      if (toi && toi.role === 'admin') {
        for (const k of ['users', 'reviews', 'criteria', 'depts', 'sites', 'tracks']) {
          const m = Object.values(MAP).find(x => x.nhanh === k);
          if (!m) continue;
          for (const o of (db[k] || [])) {
            const cu = chup[k][o.id];
            if (!cu) { viec.push(_them(m.bang, m, o)); continue; }
            const d = _khac(m, cu, o, []);
            if (d) viec.push(_sua(m.bang, o.id, d));
          }
        }
        if (bang(db.settings) !== chup.settings)
          for (const kk in (db.settings || {}))
            viec.push({ b: 'tham_so', kieu: 'up', hang: { khoa: kk, gia_tri: db.settings[kk] } });
        if (bang(db.boundaries) !== chup.boundaries)
          for (const kk in (db.boundaries || {}))
            viec.push({ b: 'ranh_gioi', kieu: 'up', hang: { khoa: kk, muc: db.boundaries[kk] } });
      }

      if (!viec.length) return { ok: true, khong_doi: true };

      for (const v of viec) {
        let e = null;
        if (v.kieu === 'them')      ({ error: e } = await q(v.b).insert(v.hang));
        else if (v.kieu === 'sua')  ({ error: e } = await q(v.b).update(v.hang).eq('id', v.id));
        else                        ({ error: e } = await q(v.b).upsert(v.hang));
        if (e) return { ok: false, loi: _docLoi(e), cach: _cach(e) };
      }

      chup = null;
      return { ok: true, taiLai: true };
    }

    function _them(b, m, o) { return { b, kieu: 'them', hang: sangDb(m, o) }; }
    function _sua(b, id, hang) { return { b, kieu: 'sua', id, hang }; }

    function _khac(m, cu, moi, cam) {
      const d = {};
      let co = false;
      for (const c in m.cot) {
        if (cam.indexOf(c) >= 0) continue;
        const k = m.cot[c];
        if (k === 'id') continue;
        if (bang(cu[k]) !== bang(moi[k])) { d[c] = moi[k] === undefined ? null : moi[k]; co = true; }
      }
      return co ? d : null;
    }

    /* Lỗi của Postgres nói bằng tiếng Anh và bằng mã. Dịch sang thứ người dùng
       hiểu được, giữ nguyên bản gốc ở cuối để còn tra khi cần. */
    function _docLoi(e) {
      const m = String((e && e.message) || e);
      if (/schema must be one of|does not exist/i.test(m) && /ttx/i.test(m))
        return 'Chưa mở cổng cho schema ttx. Vào Project Settings → API → Exposed schemas, thêm ttx.';
      if (/row-level security|violates row-level/i.test(m))
        return 'Việc này ngoài quyền của tài khoản đang dùng.';
      if (/JWT|token is expired/i.test(m))
        return 'Phiên đăng nhập đã hết hạn.';
      if (/Không sửa được nội dung sự việc/.test(m) || /kháng nghị/.test(m)
          || /phòng Nhân sự/.test(m)) return m;   // lỗi mình tự đặt, đã tiếng Việt
      return m;
    }

    function _cach(e) {
      const m = String((e && e.message) || e);
      if (/JWT|expired/i.test(m)) return 'Đăng nhập lại giúp em.';
      if (/row-level security/i.test(m)) return 'Nhờ phòng Nhân sự hoặc quản trị làm giúp.';
      if (/Exposed schemas/.test(_docLoi(e))) return 'Làm xong thì tải lại trang.';
      return 'Thử lại. Nếu vẫn vậy, báo em kèm dòng chữ này.';
    }

    return {
      dangNhap, doiMatKhau, daDangNhap, tai, ghi,
      dangXuat: () => sb.auth.signOut(),
      toi: () => toi,
      bao: () => bao
    };
  }

  global.KhoSupabase = { taoKho, MAP, HAU_TO };

  if (typeof module !== 'undefined' && module.exports) module.exports = global.KhoSupabase;

})(typeof globalThis !== 'undefined' ? globalThis : this);
