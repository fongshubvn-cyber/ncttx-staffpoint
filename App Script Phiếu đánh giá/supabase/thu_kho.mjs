/* Thử bộ nối kho_supabase.js bằng client giả — kiểm phần lắp db và phần so
   sánh trước khi ghi. Chạy:  node thu_kho.mjs                               */
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { taoKho } = require('./kho_supabase.js');

/* ── Client giả: trả dữ liệu dựng sẵn, và ghi lại mọi lệnh ghi ── */
function clientGia(ban, aiDangNhap) {
  const daGhi = [];
  const ket = (data) => Promise.resolve({ data, error: null });
  const q = (t) => {
    const o = {
      select: () => ket(ban[t] || []),
      insert: (h) => { daGhi.push({ b: t, kieu: 'them', hang: h }); return ket(null); },
      upsert: (h) => { daGhi.push({ b: t, kieu: 'up', hang: h }); return ket(null); },
      update: (h) => ({ eq: (_c, id) => { daGhi.push({ b: t, kieu: 'sua', id, hang: h }); return ket(null); } })
    };
    return o;
  };
  return {
    daGhi,
    schema: () => ({ from: q }),
    auth: {
      getSession: () => ket({ session: { access_token: 'x' } }),
      getUser: () => ket({ user: { id: aiDangNhap } }),
      signInWithPassword: ({ email }) =>
        /^ttx001@ttx\.local$/.test(email)
          ? ket({ user: {} })
          : Promise.resolve({ data: null, error: { message: 'Invalid login credentials' } }),
      updateUser: () => ket({}),
      signOut: () => ket({})
    }
  };
}

const AD = '00000000-0000-0000-0000-000000000001';
const NV = '00000000-0000-0000-0000-000000000005';

const BAN = {
  nguoi: [
    { id: AD, ma: 'ADMIN', ten: 'Quản trị', vai: 'admin', hoat_dong: true, phai_doi_mk: false },
    { id: NV, ma: 'TTX005', ten: 'Bạn An', vai: 'staff', hoat_dong: true, nghe: 'deaf' }
  ],
  su_viec: [{
    id: 'rc_an', loai: 'vi_pham', nguoi_id: NV, nguoi_lap_id: AD,
    ma_tieu_chi: 'C8.1', noi_dung: 'An đi trễ ba buổi',
    xay_ra_luc: '2026-08-06T00:00:00Z', ky: '2026-08', trang_thai: 'approved'
  }],
  danh_gia: [], tieu_chi: [{ id: 'c_1', ma: 'NL1.1', noi_dung: 'Đi làm đúng giờ', hoat_dong: true }],
  phong_ban: [{ id: 'dp_ns', ten: 'Nhân sự' }],
  diem_lam_viec: [{ id: 'si_office', ten: 'Văn phòng', la_quay: false }],
  tuyen: [{ id: 'tr_comm', ten: 'Thương mại', ngach: ['quan_ly'], bo_nhom: [], san_sang: true }],
  tham_so: [{ khoa: 'frame', gia_tri: 7 }, { khoa: 'minReviews', gia_tri: 3 }],
  ranh_gioi: [{ khoa: 'common', muc: ['Tài chính và uy tín doanh nghiệp'] }]
};

let dat = 0, hong = 0;
const xet = (t, d, m) => {
  const ok = JSON.stringify(d) === JSON.stringify(m);
  ok ? dat++ : hong++;
  console.log(`  ${ok ? '✅' : '❌ HỎNG'}  ${t}` +
    (ok ? '' : `\n        được ${JSON.stringify(d)}\n        mong  ${JSON.stringify(m)}`));
};
const H = t => console.log(`\n── ${t} ──`);

/* ═══════════════════════════════════════════════════════════ */
H('LẮP LẠI DB ĐÚNG HÌNH DẠNG APP QUEN DÙNG');
let c = clientGia(BAN, AD);
let kho = taoKho(c);
let db = await kho.tai();

xet('có đủ 9 nhánh app cần',
  ['users', 'records', 'reviews', 'criteria', 'depts', 'sites', 'tracks', 'settings', 'boundaries']
    .every(k => db[k] !== undefined), true);
xet('users dùng tên cũ: code, name, role',
  Object.keys(db.users[1]).sort().join(','), 'active,code,hearing,id,name,role');
xet('records đổi nguoi_id → subjectId', db.records[0].subjectId, NV);
xet('records đổi noi_dung → detail', db.records[0].detail, 'An đi trễ ba buổi');
xet('settings phẳng thành object', db.settings, { frame: 7, minReviews: 3 });
xet('boundaries phẳng thành object', db.boundaries.common, ['Tài chính và uy tín doanh nghiệp']);
xet('tracks đổi bo_nhom → noGroups', db.tracks[0].noGroups, []);

H('KHÔNG ĐỔI GÌ THÌ KHÔNG GHI GÌ');
let r = await kho.ghi(db);
xet('báo không đổi', r.khong_doi, true);
xet('không gửi lệnh nào', c.daGhi.length, 0);

H('LẬP BIÊN BẢN MỚI');
c = clientGia(BAN, AD); kho = taoKho(c); db = await kho.tai();
db.records.push({
  id: 'rc_moi', type: 'ghi_nhan', subjectId: NV, reporterId: AD,
  critCode: 'C8.2', detail: 'Giúp khách rất khéo',
  xayRaLuc: '2026-09-01T00:00:00Z', period: '2026-09', status: 'pending'
});
r = await kho.ghi(db);
xet('ghi thành công', r.ok, true);
xet('đúng một lệnh thêm', c.daGhi.length, 1);
xet('vào bảng su_viec', c.daGhi[0].b, 'su_viec');
xet('tên cột đã dịch sang Supabase',
  Object.keys(c.daGhi[0].hang).sort().join(','),
  'id,ky,loai,ma_tieu_chi,nguoi_id,nguoi_lap_id,noi_dung,trang_thai,xay_ra_luc');

H('PHÒNG NHÂN SỰ DUYỆT — chỉ gửi phần đã đổi');
c = clientGia(BAN, AD); kho = taoKho(c); db = await kho.tai();
db.records[0].status = 'rejected';
db.records[0].kyNS = { by: AD, at: '2026-09-04' };
r = await kho.ghi(db);
xet('đúng một lệnh sửa', c.daGhi.length, 1);
xet('chỉ gửi hai cột đã đổi',
  Object.keys(c.daGhi[0].hang).sort().join(','), 'ky_ns,trang_thai');
xet('không gửi kèm nội dung biên bản', c.daGhi[0].hang.noi_dung, undefined);

H('SỬA THÂN BIÊN BẢN — phải bị lọc trước khi gửi');
c = clientGia(BAN, AD); kho = taoKho(c); db = await kho.tai();
db.records[0].detail = 'đổi lời khai';
db.records[0].subjectId = AD;
db.records[0].xayRaLuc = '2020-01-01T00:00:00Z';
r = await kho.ghi(db);
xet('không sinh lệnh ghi nào', c.daGhi.length, 0);
xet('báo không đổi', r.khong_doi, true);

H('NHÂN VIÊN THƯỜNG KHÔNG ĐỤNG ĐƯỢC NHÁNH QUẢN TRỊ');
c = clientGia(BAN, NV); kho = taoKho(c); db = await kho.tai();
db.users[1].role = 'admin';
db.settings.frame = 999;
db.criteria[0].text = 'câu tự chế';
r = await kho.ghi(db);
xet('không sinh lệnh nào', c.daGhi.length, 0);

H('QUẢN TRỊ SỬA THAM SỐ');
c = clientGia(BAN, AD); kho = taoKho(c); db = await kho.tai();
db.settings.frame = 9;
r = await kho.ghi(db);
xet('có gửi tham_so', c.daGhi.filter(v => v.b === 'tham_so').length > 0, true);
xet('gửi dạng khoa/gia_tri',
  Object.keys(c.daGhi[0].hang).sort().join(','), 'gia_tri,khoa');

H('ĐĂNG NHẬP BẰNG MÃ NHÂN VIÊN');
c = clientGia(BAN, NV); kho = taoKho(c);
xet('TTX001 vào được', await kho.dangNhap('TTX001', '123456'), true);
xet('mã lạ bị chặn bằng tiếng Việt',
  await kho.dangNhap('LINHTINH', 'x').catch(e => e.message),
  'Mã nhân sự hoặc mật khẩu chưa đúng.');
xet('chữ hoa chữ thường không quan trọng',
  await kho.dangNhap('ttx001', '123456'), true);

console.log(`\n${'═'.repeat(58)}\n  ĐẠT ${dat}   HỎNG ${hong}\n${'═'.repeat(58)}`);
process.exit(hong ? 1 : 0);
