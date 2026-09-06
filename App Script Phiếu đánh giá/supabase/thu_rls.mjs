/* Thử vượt quyền trên Postgres thật (PGlite — Postgres 18 chạy trong WASM).
   Mỗi phép thử là một việc mà người thật có thể làm bằng DevTools, không phải
   qua giao diện. Chạy:  node thu_rls.mjs 01_luoc_do.sql                       */
import { PGlite } from '@electric-sql/pglite';
import fs from 'fs';

const db = await PGlite.create();
const SQL = fs.readFileSync(process.argv[2] || '01_luoc_do.sql', 'utf8');

// ── Giả lập phần Supabase dựng sẵn ──
await db.exec(`
  create role anon;
  create role authenticated;
  create schema auth;
  create table auth.users (id uuid primary key, email text unique);
  create or replace function auth.uid() returns uuid
    language sql stable as $$
      select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  grant usage on schema auth to authenticated, anon;
  grant select on auth.users to authenticated;
`);

await db.exec(SQL);

const ID = {
  admin: '00000000-0000-0000-0000-000000000001',
  hr:    '00000000-0000-0000-0000-000000000002',
  sep:   '00000000-0000-0000-0000-000000000003',   // Ban lãnh đạo
  ql:    '00000000-0000-0000-0000-000000000004',   // quản lý thường
  an:    '00000000-0000-0000-0000-000000000005',
  binh:  '00000000-0000-0000-0000-000000000006',
};
for (const [k, v] of Object.entries(ID))
  await db.query(`insert into auth.users values ($1,$2)`, [v, `${k}@ttx.local`]);

await db.exec(`
  insert into ttx.phong_ban values ('dp_ns','Nhân sự'), ('dp_bep','Bếp'), ('dp_fd','Founder');
  insert into ttx.tham_so values ('cap_lanh_dao', '["Founder","C-Level"]'::jsonb);
  insert into ttx.nguoi (id,ma,ten,vai,phong_ban_id,cap_bac) values
    ('${ID.admin}','ADMIN','Quản trị','admin','dp_fd','Founder'),
    ('${ID.hr}','TTX002','Chị HR','manager','dp_ns','Trưởng phòng'),
    ('${ID.sep}','TTX003','Anh Luân','manager','dp_fd','Founder'),
    ('${ID.ql}','TTX004','Quản lý bếp','manager','dp_bep','Tổ trưởng'),
    ('${ID.an}','TTX005','Bạn An','staff','dp_bep','Nhân viên'),
    ('${ID.binh}','TTX006','Bạn Bình','staff','dp_bep','Nhân viên');
`);

async function nhu(uid, sql, params = []) {
  await db.exec('begin');
  try {
    await db.query(`select set_config('request.jwt.claim.sub',$1,true)`, [uid]);
    await db.exec(`set local role authenticated`);
    const r = await db.query(sql, params);
    await db.exec('commit');
    return { ok: true, rows: r.rows };
  } catch (e) {
    await db.exec('rollback');
    return { ok: false, loi: e.message.split('\n')[0] };
  }
}

await db.exec(`
  insert into ttx.su_viec (id,loai,nguoi_id,nguoi_lap_id,ma_tieu_chi,noi_dung,xay_ra_luc,ky)
  values ('rc_an','vi_pham','${ID.an}','${ID.ql}','C8.1','An đi trễ ba buổi','2026-08-06','2026-08'),
         ('rc_binh','ghi_nhan','${ID.binh}','${ID.ql}','C8.2','Bình giúp khách rất khéo','2026-08-07','2026-08');
`);

let dat = 0, hong = 0;
function xet(ten, duoc, mong) {
  const ok = JSON.stringify(duoc) === JSON.stringify(mong);
  ok ? dat++ : hong++;
  console.log(`  ${ok ? '✅' : '❌ HỎNG'}  ${ten}${ok ? '' : `   (được ${JSON.stringify(duoc)}, mong ${JSON.stringify(mong)})`}`);
}
const H = t => console.log(`\n── ${t} ──`);

/* ⚠️ RLS lọc DÒNG, không ném lỗi. Một câu update trúng 0 dòng vẫn báo thành
   công. Nên với mọi phép thử "phải bị chặn" của update, đừng hỏi "có lỗi
   không" — phải đọc lại dữ liệu và hỏi "có đổi không". Bài thử bản đầu của em
   hỏi sai câu này nên báo hỏng ba chỗ mà luật thì đúng. */
async function khongDoi(ten, uid, sqlSua, sqlDoc, mong) {
  await nhu(uid, sqlSua);
  const r = await nhu(ID.admin, sqlDoc);
  xet(ten, r.rows[0] && Object.values(r.rows[0])[0], mong);
}

H('QUYỀN XEM — bản cũ gửi cả kho về máy, ai mở DevTools cũng đọc hết');
let r = await nhu(ID.an, `select id from ttx.su_viec order by id`);
xet('An chỉ thấy sự việc của chính An', r.rows.map(x => x.id), ['rc_an']);
r = await nhu(ID.binh, `select id from ttx.su_viec order by id`);
xet('Bình không thấy biên bản của An', r.rows.map(x => x.id), ['rc_binh']);
r = await nhu(ID.ql, `select id from ttx.su_viec`);
xet('Quản lý thấy hai cái mình lập', r.rows.length, 2);
r = await nhu(ID.hr, `select id from ttx.su_viec`);
xet('Phòng Nhân sự thấy tất cả', r.rows.length, 2);
r = await nhu(ID.sep, `select id from ttx.su_viec`);
xet('Ban lãnh đạo thấy tất cả', r.rows.length, 2);

H('MẠO DANH');
r = await nhu(ID.an, `insert into ttx.su_viec (id,loai,nguoi_id,nguoi_lap_id,ma_tieu_chi,noi_dung,xay_ra_luc,ky)
  values ('x1','vi_pham','${ID.binh}','${ID.ql}','C1.1','giả chữ ký quản lý','2026-08-08','2026-08')`);
xet('An lập biên bản đứng tên quản lý → chặn', r.ok, false);
r = await nhu(ID.an, `insert into ttx.su_viec (id,loai,nguoi_id,nguoi_lap_id,ma_tieu_chi,noi_dung,xay_ra_luc,ky)
  values ('x2','ghi_nhan','${ID.an}','${ID.an}','C1.1','tự khen mình','2026-08-08','2026-08')`);
xet('An tự lập phiếu ghi nhận cho chính mình → chặn', r.ok, false);

H('TRẠNG THÁI DO MÁY CHỦ ĐẶT, KHÔNG NGHE TRÌNH DUYỆT');
await nhu(ID.ql, `insert into ttx.su_viec (id,loai,nguoi_id,nguoi_lap_id,ma_tieu_chi,noi_dung,xay_ra_luc,ky,trang_thai)
  values ('x3','ghi_nhan','${ID.an}','${ID.ql}','C1.1','gửi kèm approved','2026-08-08','2026-08','approved')`);
r = await nhu(ID.hr, `select trang_thai from ttx.su_viec where id='x3'`);
xet('Phiếu ghi nhận gửi kèm approved → vẫn thành pending', r.rows[0]?.trang_thai, 'pending');
await nhu(ID.ql, `insert into ttx.su_viec (id,loai,nguoi_id,nguoi_lap_id,ma_tieu_chi,noi_dung,xay_ra_luc,ky,trang_thai)
  values ('x4','vi_pham','${ID.an}','${ID.ql}','C1.1','gửi kèm pending','2026-08-08','2026-08','pending')`);
r = await nhu(ID.hr, `select trang_thai from ttx.su_viec where id='x4'`);
xet('Biên bản vi phạm gửi kèm pending → tự duyệt', r.rows[0]?.trang_thai, 'approved');

H('KHOÁ THÂN SỰ VIỆC');
await khongDoi('Người lập sửa nội dung → chặn', ID.ql,
  `update ttx.su_viec set noi_dung='đổi lời khai' where id='rc_an'`,
  `select noi_dung from ttx.su_viec where id='rc_an'`, 'An đi trễ ba buổi');
r = await nhu(ID.hr, `update ttx.su_viec set noi_dung='HR đổi lời khai' where id='rc_an'`);
xet('Phòng Nhân sự sửa nội dung → chặn', r.ok, false);
r = await nhu(ID.an, `update ttx.su_viec set noi_dung='người bị lập đổi lời khai' where id='rc_an'`);
xet('Người bị lập sửa nội dung → chặn', r.ok, false);

H('DUYỆT VÀ KHÁNG NGHỊ');
r = await nhu(ID.an, `update ttx.su_viec set trang_thai='rejected' where id='rc_an'`);
xet('An tự huỷ biên bản của mình → chặn', r.ok, false);
await khongDoi('Quản lý tự duyệt phiếu ghi nhận mình lập → chặn', ID.ql,
  `update ttx.su_viec set trang_thai='approved' where id='rc_binh'`,
  `select trang_thai from ttx.su_viec where id='rc_binh'`, 'pending');
r = await nhu(ID.hr, `update ttx.su_viec set trang_thai='approved', ky_ns='{"by":"hr"}' where id='rc_binh'`);
xet('Phòng Nhân sự duyệt → được', r.ok, true);
r = await nhu(ID.an, `update ttx.su_viec set khieu_nai='{"ly_do":"hôm đó em xin phép rồi"}' where id='rc_an'`);
xet('An gửi kháng nghị lần đầu → được', r.ok, true);
r = await nhu(ID.an, `update ttx.su_viec set khieu_nai='{"ly_do":"đổi ý"}' where id='rc_an'`);
xet('An sửa kháng nghị lần hai → chặn', r.ok, false);
await khongDoi('Bình kháng nghị hộ biên bản của An → chặn', ID.binh,
  `update ttx.su_viec set khieu_nai='{"ly_do":"xen vào"}' where id='rc_an'`,
  `select khieu_nai->>'ly_do' from ttx.su_viec where id='rc_an'`,
  'hôm đó em xin phép rồi');

H('TỰ PHONG QUYỀN');
await nhu(ID.an, `update ttx.nguoi set vai='admin' where id='${ID.an}'`);
r = await nhu(ID.admin, `select vai from ttx.nguoi where id='${ID.an}'`);
xet('An tự phong admin → chặn', r.rows[0]?.vai, 'staff');
await nhu(ID.ql, `update ttx.nguoi set phong_ban_id='dp_ns' where id='${ID.ql}'`);
r = await nhu(ID.admin, `select phong_ban_id from ttx.nguoi where id='${ID.ql}'`);
xet('Quản lý tự chuyển mình sang phòng Nhân sự → chặn', r.rows[0]?.phong_ban_id, 'dp_bep');
await nhu(ID.an, `update ttx.tham_so set gia_tri='["Nhân viên"]' where khoa='cap_lanh_dao'`);
r = await nhu(ID.admin, `select gia_tri from ttx.tham_so where khoa='cap_lanh_dao'`);
xet('An sửa danh sách cấp lãnh đạo để thành sếp → chặn',
    r.rows[0]?.gia_tri, ['Founder', 'C-Level']);

H('BỘ CÂU HỎI — ai cũng phải đọc được, không ai được sửa trừ quản trị');
await db.exec(`insert into ttx.tieu_chi (id,ma,noi_dung,che_do)
  values ('c_NL1_1','NL1.1','Đi làm đúng giờ','vi_pham')`);
r = await nhu(ID.an, `select count(*)::int n from ttx.tieu_chi`);
xet('Nhân viên đọc được bộ câu hỏi', r.rows[0]?.n, 1);
await khongDoi('Nhân viên sửa nội dung câu hỏi → chặn', ID.an,
  `update ttx.tieu_chi set noi_dung='câu bịa' where id='c_NL1_1'`,
  `select noi_dung from ttx.tieu_chi where id='c_NL1_1'`, 'Đi làm đúng giờ');
await khongDoi('Quản lý tự thêm câu hỏi → chặn', ID.ql,
  `insert into ttx.tieu_chi (id,ma,noi_dung) values ('c_bia','X9.9','câu tự chế')`,
  `select count(*)::int from ttx.tieu_chi`, 1);
r = await nhu(ID.admin, `update ttx.tieu_chi set noi_dung='Đi làm đúng giờ giấc' where id='c_NL1_1'`);
xet('Quản trị đồng bộ bộ câu hỏi → được', r.ok, true);

H('XOÁ');
await nhu(ID.hr, `delete from ttx.su_viec where id='rc_an'`);
r = await nhu(ID.admin, `select count(*)::int n from ttx.su_viec where id='rc_an'`);
xet('Phòng Nhân sự xoá biên bản → chặn', r.rows[0]?.n, 1);
r = await nhu(ID.admin, `delete from ttx.su_viec where id='x4'`);
xet('Quản trị xoá → được', r.ok, true);

H('CHƯA ĐĂNG NHẬP');
await db.exec('begin');
await db.exec(`set local role anon`);
let anon;
try { await db.query(`select * from ttx.nguoi`); anon = 'ĐỌC ĐƯỢC'; }
catch (e) { anon = 'chặn'; }
await db.exec('rollback');
xet('Người lạ đọc danh bạ nhân sự → chặn', anon, 'chặn');

console.log(`\n${'═'.repeat(58)}\n  ĐẠT ${dat}   HỎNG ${hong}\n${'═'.repeat(58)}`);
process.exit(hong ? 1 : 0);
