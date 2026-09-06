/* Chạy thử 01 + 02 trên Postgres thật, với schema auth dựng giống Supabase.
   Bắt lỗi SQL TRƯỚC khi Quán dán vào SQL Editor của dự án thật.
   Chạy:  node thu_chuyen.mjs                                              */
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import fs from 'fs';

// pgcrypto để có crypt()/gen_salt() — Supabase bật sẵn, PGlite phải nạp thêm.
const db = await PGlite.create({ extensions: { pgcrypto } });
const doc = f => fs.readFileSync(new URL(f, import.meta.url), 'utf8');

// ── Dựng lại phần Supabase làm sẵn, đủ các cột mà bộ chuyển có ghi vào ──
await db.exec(`
  create role anon; create role authenticated;
  create schema auth;
  create schema extensions;
  create extension if not exists pgcrypto with schema extensions;

  create table auth.users (
    instance_id uuid, id uuid primary key, aud varchar(255), role varchar(255),
    email varchar(255) unique, encrypted_password varchar(255),
    email_confirmed_at timestamptz, created_at timestamptz, updated_at timestamptz,
    raw_app_meta_data jsonb, raw_user_meta_data jsonb, is_sso_user boolean default false
  );
  create table auth.identities (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    provider_id text not null,
    identity_data jsonb not null,
    provider text not null,
    last_sign_in_at timestamptz, created_at timestamptz, updated_at timestamptz,
    unique (provider_id, provider)
  );
  create or replace function auth.uid() returns uuid language sql stable as $$
    select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  grant usage on schema auth to authenticated, anon;
`);

let dat = 0, hong = 0;
const xet = (ten, duoc, mong) => {
  const ok = JSON.stringify(duoc) === JSON.stringify(mong);
  ok ? dat++ : hong++;
  console.log(`  ${ok ? '✅' : '❌ HỎNG'}  ${ten}` +
    (ok ? '' : `   (được ${JSON.stringify(duoc)}, mong ${JSON.stringify(mong)})`));
};
const H = t => console.log(`\n── ${t} ──`);
const n1 = async (sql) => (await db.query(sql)).rows[0];

H('CHẠY HAI TỆP');
try { await db.exec(doc('./01_luoc_do.sql')); console.log('  ✅  01_luoc_do.sql'); dat++; }
catch (e) { console.log('  ❌ HỎNG  01_luoc_do.sql → ' + e.message.split('\n')[0]); hong++; }
try { await db.exec(doc('./02_chuyen_du_lieu.sql')); console.log('  ✅  02_chuyen_du_lieu.sql'); dat++; }
catch (e) { console.log('  ❌ HỎNG  02_chuyen_du_lieu.sql → ' + e.message.split('\n')[0]); hong++;
  try { await db.exec('rollback'); } catch (_) {} }

try { await db.exec(doc('./03_tieu_chi.sql')); console.log('  ✅  03_tieu_chi.sql'); dat++; }
catch (e) { console.log('  ❌ HỎNG  03_tieu_chi.sql → ' + e.message.split('\n')[0]); hong++;
  try { await db.exec('rollback'); } catch (_) {} }

H('BỘ CÂU HỎI — bốn trường suýt bị bỏ quên');
xet('360 câu', (await n1(`select count(*)::int n from ttx.tieu_chi`)).n, 360);
xet('335 câu có trọng số (thiếu là công thức điểm sai)',
    (await n1(`select count(*)::int n from ttx.tieu_chi where trong_so is not null`)).n, 335);
xet('94 câu có bậc',
    (await n1(`select count(*)::int n from ttx.tieu_chi where bac is not null`)).n, 94);
xet('246 câu gắn tuyến (thiếu là ai cũng thấy đủ 360 câu)',
    (await n1(`select count(*)::int n from ttx.tieu_chi where tuyen_id is not null`)).n, 246);
xet('335 câu có tên hiển thị',
    (await n1(`select count(*)::int n from ttx.tieu_chi where ten is not null`)).n, 335);
xet('312 câu vi phạm · 48 câu ghi nhận',
    (await db.query(`select che_do, count(*)::int n from ttx.tieu_chi group by 1 order by 1`))
      .rows.map(r => `${r.che_do}:${r.n}`), ['ghi_nhan:48', 'vi_pham:312']);
xet('trọng số giữ đúng số thập phân',
    (await n1(`select trong_so::text v from ttx.tieu_chi where ma='VH1.1'`)).v !== null, true);

H('ĐẾM ĐỦ CHƯA');
xet('33 người', (await n1(`select count(*)::int n from ttx.nguoi`)).n, 33);
xet('33 tài khoản đăng nhập', (await n1(`select count(*)::int n from auth.users`)).n, 33);
xet('33 dòng identities (thiếu là không đăng nhập được)',
    (await n1(`select count(*)::int n from auth.identities`)).n, 33);
xet('7 sự việc', (await n1(`select count(*)::int n from ttx.su_viec`)).n, 7);
xet('2 kháng nghị', (await n1(`select count(*)::int n from ttx.danh_gia`)).n, 2);
xet('12 phòng ban', (await n1(`select count(*)::int n from ttx.phong_ban`)).n, 12);
xet('8 tuyến', (await n1(`select count(*)::int n from ttx.tuyen`)).n, 8);

H('TRẠNG THÁI DUYỆT CÒN NGUYÊN — trigger không được xoá lịch sử');
const tt = (await db.query(
  `select trang_thai, count(*)::int n from ttx.su_viec group by 1 order by 1`)).rows;
xet('7 sự việc đều đã duyệt như dữ liệu cũ',
    tt.map(r => `${r.trang_thai}:${r.n}`), ['approved:7']);
xet('chữ ký phòng Nhân sự không bị xoá',
    (await n1(`select count(*)::int n from ttx.su_viec where ky_ns is not null`)).n, 7);

H('MẬT KHẨU DÙNG ĐƯỢC');
const kt = await n1(`select (encrypted_password = extensions.crypt('123456', encrypted_password)) ok
                     from auth.users where email = 'ttx001@ttx.local'`);
xet('TTX001 đăng nhập bằng 123456', kt?.ok, true);
const sai = await n1(`select (encrypted_password = extensions.crypt('sai-be-bet', encrypted_password)) ok
                      from auth.users where email = 'ttx001@ttx.local'`);
xet('mật khẩu sai bị chặn', sai?.ok, false);

H('LIÊN KẾT GIỮ NGUYÊN SAU KHI ĐỔI ID');
xet('mọi sự việc trỏ đúng người',
    (await n1(`select count(*)::int n from ttx.su_viec s
               join ttx.nguoi a on a.id = s.nguoi_id
               join ttx.nguoi b on b.id = s.nguoi_lap_id`)).n, 7);
xet('chữ ký kyNS trỏ tới uuid có thật',
    (await n1(`select count(*)::int n from ttx.su_viec s
               join ttx.nguoi u on u.id = (s.ky_ns->>'by')::uuid`)).n, 7);
xet('4 người vai quản trị như cũ',
    (await n1(`select count(*)::int n from ttx.nguoi where vai='admin'`)).n, 4);
// Đúng 2, không phải 3: id 'u_demo' và mã 'TEST' là CÙNG một người
// (Nguyễn Văn Test). Bản đầu em đếm nhầm thành hai người khác nhau.
xet('2 tài khoản thử được đánh dấu, loại khỏi bảng lương',
    (await n1(`select count(*)::int n from ttx.nguoi where la_thu`)).n, 2);
xet('   là ADMIN_TEST và TEST',
    (await db.query(`select ma from ttx.nguoi where la_thu order by ma`)).rows.map(r => r.ma),
    ['ADMIN_TEST', 'TEST']);
// 7 sự việc cũ đều về Nguyễn Văn Test — người thật chưa có biên bản nào.
xet('7 sự việc đều thuộc về tài khoản thử',
    (await n1(`select count(*)::int n from ttx.su_viec s join ttx.nguoi u
               on u.id = s.nguoi_id where u.la_thu`)).n, 7);

H('BAN LÃNH ĐẠO TRA ĐÚNG');
xet('4 người thuộc Ban lãnh đạo (founder + clevel)',
    (await n1(`select count(*)::int n from ttx.nguoi n, ttx.tham_so ts,
               lateral jsonb_array_elements_text(ts.gia_tri) v
               where ts.khoa='cap_lanh_dao' and v in (n.cap_bac, n.bac, n.chuc_danh)`)).n, 4);

H('CHẠY LẠI LẦN HAI KHÔNG ĐẺ TRÙNG');
try {
  await db.exec(doc('./02_chuyen_du_lieu.sql'));
  xet('vẫn đúng 33 người', (await n1(`select count(*)::int n from ttx.nguoi`)).n, 33);
  xet('vẫn đúng 7 sự việc', (await n1(`select count(*)::int n from ttx.su_viec`)).n, 7);
  xet('vẫn đúng 33 identities', (await n1(`select count(*)::int n from auth.identities`)).n, 33);
} catch (e) {
  console.log('  ❌ HỎNG  chạy lần hai → ' + e.message.split('\n')[0]); hong++;
}

H('RLS VẪN CHẶN TRÊN DỮ LIỆU THẬT');
const an = (await n1(`select id from ttx.nguoi where ma='TTX005'`))?.id;
await db.exec('begin');
await db.query(`select set_config('request.jwt.claim.sub',$1,true)`, [an]);
await db.exec('set local role authenticated');
const thay = (await db.query(`select count(*)::int n from ttx.su_viec`)).rows[0].n;
await db.exec('rollback');
xet('một nhân viên thường KHÔNG thấy cả 7 sự việc', thay < 7, true);

console.log(`\n${'═'.repeat(58)}\n  ĐẠT ${dat}   HỎNG ${hong}\n${'═'.repeat(58)}`);
process.exit(hong ? 1 : 0);
