-- ═══════════════════════════════════════════════════════════════════
--  02 · CHUYỂN DỮ LIỆU CŨ SANG SUPABASE
--
--  Sinh tự động bởi sinh_chuyen.py — đừng sửa tay, sửa nguồn rồi sinh lại.
--  Nguồn: 33 người · 7 sự việc · 2 kháng nghị
--
--  Chạy TOÀN BỘ tệp này một lần trong SQL Editor, sau khi 01_luoc_do.sql
--  đã chạy xong. Chạy lại lần nữa cũng không sao: mọi lệnh đều là
--  'có rồi thì bỏ qua'.
--
--  MẬT KHẨU: mọi người nhận mật khẩu tạm '123456' và app bắt đổi
--  ngay lần đăng nhập đầu. Hàm băm cũ không nhập được vào bcrypt của
--  Supabase — nhưng 31/33 người vốn vẫn đang dùng đúng mật khẩu này.
-- ═══════════════════════════════════════════════════════════════════

begin;

-- ─────────────────────────────────────────── TẠO TÀI KHOẢN ĐĂNG NHẬP ──
-- Supabase đòi HAI dòng cho mỗi người: auth.users giữ mật khẩu, auth.identities
-- nối tài khoản với cách đăng nhập. Thiếu dòng identities thì tài khoản có tồn
-- tại, hiện trong bảng điều khiển, mà đăng nhập bằng mật khẩu luôn báo sai —
-- không có gì chỉ ra nguyên nhân. Đây là chỗ hay hỏng nhất khi chuyển nhà.
--
-- Cấu trúc auth.identities có đổi qua các phiên bản Supabase, nên hàm này tự dò
-- xem bản của mình có cột nào rồi mới ghi.
create or replace function pg_temp.ttx_tao_tk(p_id uuid, p_email text, p_mk text)
returns void language plpgsql as $fn$
declare
  co_provider_id boolean;
  kieu_id text;
  cot text; gia text;
begin
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data, is_sso_user
  ) values (
    '00000000-0000-0000-0000-000000000000', p_id, 'authenticated', 'authenticated',
    p_email, extensions.crypt(p_mk, extensions.gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, false
  ) on conflict (id) do nothing;

  select exists (select 1 from information_schema.columns
                 where table_schema='auth' and table_name='identities'
                   and column_name='provider_id') into co_provider_id;
  select data_type from information_schema.columns
    into kieu_id
   where table_schema='auth' and table_name='identities' and column_name='id';

  cot := 'user_id, identity_data, provider, last_sign_in_at, created_at, updated_at';
  gia := format('%L::uuid, %L::jsonb, ''email'', now(), now(), now()',
                p_id, json_build_object('sub', p_id::text, 'email', p_email)::text);

  if co_provider_id then
    cot := 'provider_id, ' || cot;
    gia := format('%L, ', p_id::text) || gia;
  end if;

  if kieu_id = 'uuid' then
    cot := 'id, ' || cot;  gia := 'gen_random_uuid(), ' || gia;
  elsif kieu_id = 'text' then
    cot := 'id, ' || cot;  gia := format('%L, ', p_id::text) || gia;
  end if;

  execute format('insert into auth.identities (%s) values (%s)
                  on conflict do nothing', cot, gia);
end $fn$;

-- ────────────────────────────────────────────────── BẢNG TRA CỨU ──
insert into ttx.phong_ban (id, ten) values ('dp_founder', 'Founder') on conflict (id) do update set ten = excluded.ten;
insert into ttx.phong_ban (id, ten) values ('dp_comm', 'Thương mại & Dịch vụ') on conflict (id) do update set ten = excluded.ten;
insert into ttx.phong_ban (id, ten) values ('dp_acc', 'Kế toán') on conflict (id) do update set ten = excluded.ten;
insert into ttx.phong_ban (id, ten) values ('dp_accfn', 'Kế toán chức năng & Thuế') on conflict (id) do update set ten = excluded.ten;
insert into ttx.phong_ban (id, ten) values ('dp_prod', 'Sản xuất') on conflict (id) do update set ten = excluded.ten;
insert into ttx.phong_ban (id, ten) values ('dp_soft', 'Phát triển Phần mềm') on conflict (id) do update set ten = excluded.ten;
insert into ttx.phong_ban (id, ten) values ('dp_hr', 'Nhân sự - Hành chính') on conflict (id) do update set ten = excluded.ten;
insert into ttx.phong_ban (id, ten) values ('dp_social', 'Social Media') on conflict (id) do update set ten = excluded.ten;
insert into ttx.phong_ban (id, ten) values ('dp_supply', 'Chuỗi cung ứng') on conflict (id) do update set ten = excluded.ten;
insert into ttx.phong_ban (id, ten) values ('dp_security', 'Bảo vệ') on conflict (id) do update set ten = excluded.ten;
insert into ttx.phong_ban (id, ten) values ('dp_barista', 'Pha chế') on conflict (id) do update set ten = excluded.ten;
insert into ttx.phong_ban (id, ten) values ('dp_pastry', 'Bếp Bánh') on conflict (id) do update set ten = excluded.ten;

insert into ttx.diem_lam_viec (id, ten, la_quay) values ('si_office', 'Văn phòng', false) on conflict (id) do update set ten = excluded.ten, la_quay = excluded.la_quay;
insert into ttx.diem_lam_viec (id, ten, la_quay) values ('si_remote', 'Làm từ xa', false) on conflict (id) do update set ten = excluded.ten, la_quay = excluded.la_quay;
insert into ttx.diem_lam_viec (id, ten, la_quay) values ('si_factory', 'Xưởng sản xuất', false) on conflict (id) do update set ten = excluded.ten, la_quay = excluded.la_quay;
insert into ttx.diem_lam_viec (id, ten, la_quay) values ('si_wh', 'Kho', false) on conflict (id) do update set ten = excluded.ten, la_quay = excluded.la_quay;
insert into ttx.diem_lam_viec (id, ten, la_quay) values ('si_shop', 'Cửa hàng 9 Triệu Việt Vương', true) on conflict (id) do update set ten = excluded.ten, la_quay = excluded.la_quay;

insert into ttx.tuyen (id, ten, ngach, bo_nhom, ql_cho_tat_ca, san_sang) values ('tr_comm', 'Thương mại & Dịch vụ', '{"chuyen_mon","quan_ly"}'::text[], '{"TC1"}'::text[], false, true) on conflict (id) do update set ten = excluded.ten, ngach = excluded.ngach, bo_nhom = excluded.bo_nhom, ql_cho_tat_ca = excluded.ql_cho_tat_ca, san_sang = excluded.san_sang;
insert into ttx.tuyen (id, ten, ngach, bo_nhom, ql_cho_tat_ca, san_sang) values ('tr_bizdev', 'Phát triển Kinh doanh', '{"chuyen_mon","quan_ly"}'::text[], '{}'::text[], false, false) on conflict (id) do update set ten = excluded.ten, ngach = excluded.ngach, bo_nhom = excluded.bo_nhom, ql_cho_tat_ca = excluded.ql_cho_tat_ca, san_sang = excluded.san_sang;
insert into ttx.tuyen (id, ten, ngach, bo_nhom, ql_cho_tat_ca, san_sang) values ('tr_barista', 'Pha chế', '{"tay_nghe","quan_ly"}'::text[], '{}'::text[], false, false) on conflict (id) do update set ten = excluded.ten, ngach = excluded.ngach, bo_nhom = excluded.bo_nhom, ql_cho_tat_ca = excluded.ql_cho_tat_ca, san_sang = excluded.san_sang;
insert into ttx.tuyen (id, ten, ngach, bo_nhom, ql_cho_tat_ca, san_sang) values ('tr_pastry', 'Bếp bánh', '{"tay_nghe","quan_ly"}'::text[], '{}'::text[], false, false) on conflict (id) do update set ten = excluded.ten, ngach = excluded.ngach, bo_nhom = excluded.bo_nhom, ql_cho_tat_ca = excluded.ql_cho_tat_ca, san_sang = excluded.san_sang;
insert into ttx.tuyen (id, ten, ngach, bo_nhom, ql_cho_tat_ca, san_sang) values ('tr_prod', 'Sản xuất', '{"tay_nghe","quan_ly"}'::text[], '{}'::text[], false, false) on conflict (id) do update set ten = excluded.ten, ngach = excluded.ngach, bo_nhom = excluded.bo_nhom, ql_cho_tat_ca = excluded.ql_cho_tat_ca, san_sang = excluded.san_sang;
insert into ttx.tuyen (id, ten, ngach, bo_nhom, ql_cho_tat_ca, san_sang) values ('tr_wh', 'Kho và Đóng gói', '{"tay_nghe","quan_ly"}'::text[], '{}'::text[], false, false) on conflict (id) do update set ten = excluded.ten, ngach = excluded.ngach, bo_nhom = excluded.bo_nhom, ql_cho_tat_ca = excluded.ql_cho_tat_ca, san_sang = excluded.san_sang;
insert into ttx.tuyen (id, ten, ngach, bo_nhom, ql_cho_tat_ca, san_sang) values ('tr_hr', 'Nhân sự - Hành chính', '{"chuyen_mon","quan_ly"}'::text[], '{}'::text[], false, false) on conflict (id) do update set ten = excluded.ten, ngach = excluded.ngach, bo_nhom = excluded.bo_nhom, ql_cho_tat_ca = excluded.ql_cho_tat_ca, san_sang = excluded.san_sang;
insert into ttx.tuyen (id, ten, ngach, bo_nhom, ql_cho_tat_ca, san_sang) values ('tr_ecom', 'E-Commerce', '{"chuyen_mon","quan_ly"}'::text[], '{}'::text[], false, false) on conflict (id) do update set ten = excluded.ten, ngach = excluded.ngach, bo_nhom = excluded.bo_nhom, ql_cho_tat_ca = excluded.ql_cho_tat_ca, san_sang = excluded.san_sang;

-- ─────────────────────────────────────────────────────── THAM SỐ ──
insert into ttx.tham_so (khoa, gia_tri) values ('minReviews', '3'::jsonb) on conflict (khoa) do update set gia_tri = excluded.gia_tri;
insert into ttx.tham_so (khoa, gia_tri) values ('sampleData', 'false'::jsonb) on conflict (khoa) do update set gia_tri = excluded.gia_tri;
insert into ttx.tham_so (khoa, gia_tri) values ('frame', '7'::jsonb) on conflict (khoa) do update set gia_tri = excluded.gia_tri;
insert into ttx.tham_so (khoa, gia_tri) values ('demoSeeded', '"cogio"'::jsonb) on conflict (khoa) do update set gia_tri = excluded.gia_tri;
insert into ttx.tham_so (khoa, gia_tri) values ('haiChuKy', 'true'::jsonb) on conflict (khoa) do update set gia_tri = excluded.gia_tri;
insert into ttx.tham_so (khoa, gia_tri) values ('recFilerFixed', 'true'::jsonb) on conflict (khoa) do update set gia_tri = excluded.gia_tri;

-- Ai là Ban lãnh đạo. Bản Apps Script tra bậc >= 7 trong CAP_BAC của file
-- gốc; database không với sang đó được nên danh sách nằm ở đây.
-- Khi nào chạy bộ đồng bộ từ sheet 👥 Nhân sự thì thêm cả tên tiếng Việt.
insert into ttx.tham_so (khoa, gia_tri) values ('cap_lanh_dao', '["clevel", "founder"]'::jsonb) on conflict (khoa) do update set gia_tri = excluded.gia_tri;

insert into ttx.ranh_gioi (khoa, muc) values ('common', '["Tài chính và uy tín doanh nghiệp", "Văn hoá và sứ mệnh của Thời Thanh Xuân", "Tôn trọng danh dự và nhân phẩm nhân sự", "Cố tình lừa dối, với bất kỳ ai: cấp trên, đồng nghiệp, khách hàng, đối tác, cơ quan quản lý. Báo sai sự thật về kết quả hoặc tiến độ công việc, giấu sự việc đã xảy ra, làm sai lệch số liệu hoặc chứng từ, hoặc biết người khác đang hiểu sai mà không đính chính. Ranh của ranh giới này là chữ CỐ TÌNH: nhầm lẫn, quên, hoặc truyền đạt thông tin chưa xác minh thì thuộc OV2 và PA2 ở mục II, không phải ranh giới. ⚠️ Ranh giới này do TTX bổ sung 9/8/2026, KHÔNG trích tài liệu đào tạo như ba ranh giới trên."]'::jsonb) on conflict (khoa) do update set muc = excluded.muc;
insert into ttx.ranh_gioi (khoa, muc) values ('byTrack', '{"tr_comm": ["Không sử dụng sứ mệnh để bán hàng, và không lấy hoàn cảnh của nhân sự người điếc làm công cụ thuyết phục khách. Sứ mệnh của Công ty là phá vỡ định kiến rằng doanh nghiệp lợi dụng người khuyết tật", "Không nói quá về khả năng của sản phẩm. Sản phẩm không giải quyết đúng vấn đề của khách thì không đề xuất", "Áp dụng đúng bảng giá và chương trình khuyến mãi đang có hiệu lực trên mọi kênh, không tự điều chỉnh. Ca ngoài khung chuyển sang người có thẩm quyền TRƯỚC khi hứa với khách"], "tr_bizdev": [], "tr_barista": [], "tr_pastry": [], "tr_prod": [], "tr_wh": [], "tr_hr": [], "tr_ecom": []}'::jsonb) on conflict (khoa) do update set muc = excluded.muc;

-- ───────────────────────────────────────────────────────── NGƯỜI ──
select pg_temp.ttx_tao_tk('1b0d6c77-5be7-1613-6c7f-9dff91479979'::uuid, 'admin@ttx.local', '123456');
insert into ttx.nguoi (id, ma, ten, chuc_danh, chuc_danh_en, cap_bac, bac, vai, phong_ban_id, diem_id, tuyen_id, ten_tuyen, nghe, co_diem_ban, hoat_dong, la_thu, phai_doi_mk, vao_lam, id_cu) values (
  '1b0d6c77-5be7-1613-6c7f-9dff91479979'::uuid, 'ADMIN', 'Quản trị hệ thống', 'Quản trị hệ thống', 'System Administrator', null, 'founder',
  'admin', null, null, null, null, null, false,
  true, false, true, '2026-08-24T16:18:26.038Z'::timestamptz, 'u_admin')
on conflict (id) do update set ma = excluded.ma, ten = excluded.ten, vai = excluded.vai, phong_ban_id = excluded.phong_ban_id, diem_id = excluded.diem_id, tuyen_id = excluded.tuyen_id, hoat_dong = excluded.hoat_dong, la_thu = excluded.la_thu;

select pg_temp.ttx_tao_tk('dd0f9bde-8cce-9fa2-2cf0-5102fca177e6'::uuid, 'admin_test@ttx.local', '123456');
insert into ttx.nguoi (id, ma, ten, chuc_danh, chuc_danh_en, cap_bac, bac, vai, phong_ban_id, diem_id, tuyen_id, ten_tuyen, nghe, co_diem_ban, hoat_dong, la_thu, phai_doi_mk, vao_lam, id_cu) values (
  'dd0f9bde-8cce-9fa2-2cf0-5102fca177e6'::uuid, 'ADMIN_TEST', 'Admin thử', 'Quản trị hệ thống (tài khoản thử)', 'System Administrator (test)', null, 'clevel',
  'admin', null, null, null, null, null, false,
  true, true, true, '2026-08-24T16:18:26.038Z'::timestamptz, 'u_admin_test')
on conflict (id) do update set ma = excluded.ma, ten = excluded.ten, vai = excluded.vai, phong_ban_id = excluded.phong_ban_id, diem_id = excluded.diem_id, tuyen_id = excluded.tuyen_id, hoat_dong = excluded.hoat_dong, la_thu = excluded.la_thu;

select pg_temp.ttx_tao_tk('2a81d48f-5563-3d07-eec2-364099a49605'::uuid, 'ttx001@ttx.local', '123456');
insert into ttx.nguoi (id, ma, ten, chuc_danh, chuc_danh_en, cap_bac, bac, vai, phong_ban_id, diem_id, tuyen_id, ten_tuyen, nghe, co_diem_ban, hoat_dong, la_thu, phai_doi_mk, vao_lam, id_cu) values (
  '2a81d48f-5563-3d07-eec2-364099a49605'::uuid, 'TTX001', 'Võ Thành Luân', 'Người sáng lập - Chủ tịch', 'Founder - Chairman', null, 'founder',
  'admin', 'dp_founder', 'si_office', null, null, 'hearing', false,
  true, false, true, '2026-08-24T16:18:26.012Z'::timestamptz, 'u_TTX001')
on conflict (id) do update set ma = excluded.ma, ten = excluded.ten, vai = excluded.vai, phong_ban_id = excluded.phong_ban_id, diem_id = excluded.diem_id, tuyen_id = excluded.tuyen_id, hoat_dong = excluded.hoat_dong, la_thu = excluded.la_thu;

select pg_temp.ttx_tao_tk('5b61f2a4-4248-4808-f186-ad191ae5603a'::uuid, 'ttx002@ttx.local', '123456');
insert into ttx.nguoi (id, ma, ten, chuc_danh, chuc_danh_en, cap_bac, bac, vai, phong_ban_id, diem_id, tuyen_id, ten_tuyen, nghe, co_diem_ban, hoat_dong, la_thu, phai_doi_mk, vao_lam, id_cu) values (
  '5b61f2a4-4248-4808-f186-ad191ae5603a'::uuid, 'TTX002', 'Nguyễn Hoàn Vũ', 'Tổng Giám đốc', 'CEO - Chief Executive', null, 'clevel',
  'admin', 'dp_comm', 'si_office', 'tr_comm', null, 'hearing', false,
  true, false, true, '2026-08-24T16:18:26.013Z'::timestamptz, 'u_TTX002')
on conflict (id) do update set ma = excluded.ma, ten = excluded.ten, vai = excluded.vai, phong_ban_id = excluded.phong_ban_id, diem_id = excluded.diem_id, tuyen_id = excluded.tuyen_id, hoat_dong = excluded.hoat_dong, la_thu = excluded.la_thu;

select pg_temp.ttx_tao_tk('d03a91d5-94bf-854d-cb7d-c914baabaebd'::uuid, 'ttx003@ttx.local', '123456');
insert into ttx.nguoi (id, ma, ten, chuc_danh, chuc_danh_en, cap_bac, bac, vai, phong_ban_id, diem_id, tuyen_id, ten_tuyen, nghe, co_diem_ban, hoat_dong, la_thu, phai_doi_mk, vao_lam, id_cu) values (
  'd03a91d5-94bf-854d-cb7d-c914baabaebd'::uuid, 'TTX003', 'Nguyễn Trọng Duy', 'Trưởng phòng Thương mại & Dịch vụ', 'Head of Commercial & Services', null, 'head',
  'manager', 'dp_comm', 'si_office', 'tr_comm', null, 'hearing', false,
  true, false, true, '2026-08-24T16:18:26.013Z'::timestamptz, 'u_TTX003')
on conflict (id) do update set ma = excluded.ma, ten = excluded.ten, vai = excluded.vai, phong_ban_id = excluded.phong_ban_id, diem_id = excluded.diem_id, tuyen_id = excluded.tuyen_id, hoat_dong = excluded.hoat_dong, la_thu = excluded.la_thu;

select pg_temp.ttx_tao_tk('a7fdbcfb-eb8e-a2db-032d-8cfd61ac03b0'::uuid, 'ttx004@ttx.local', '123456');
insert into ttx.nguoi (id, ma, ten, chuc_danh, chuc_danh_en, cap_bac, bac, vai, phong_ban_id, diem_id, tuyen_id, ten_tuyen, nghe, co_diem_ban, hoat_dong, la_thu, phai_doi_mk, vao_lam, id_cu) values (
  'a7fdbcfb-eb8e-a2db-032d-8cfd61ac03b0'::uuid, 'TTX004', 'Trần Ngọc Phương', 'Quản lý Sản xuất', 'Production Manager', null, 'head',
  'manager', 'dp_prod', 'si_factory', null, null, 'hearing', false,
  true, false, true, '2026-08-24T16:18:26.013Z'::timestamptz, 'u_TTX004')
on conflict (id) do update set ma = excluded.ma, ten = excluded.ten, vai = excluded.vai, phong_ban_id = excluded.phong_ban_id, diem_id = excluded.diem_id, tuyen_id = excluded.tuyen_id, hoat_dong = excluded.hoat_dong, la_thu = excluded.la_thu;

select pg_temp.ttx_tao_tk('e3daa954-6665-809f-7197-70370bd3d72c'::uuid, 'ttx005@ttx.local', '123456');
insert into ttx.nguoi (id, ma, ten, chuc_danh, chuc_danh_en, cap_bac, bac, vai, phong_ban_id, diem_id, tuyen_id, ten_tuyen, nghe, co_diem_ban, hoat_dong, la_thu, phai_doi_mk, vao_lam, id_cu) values (
  'e3daa954-6665-809f-7197-70370bd3d72c'::uuid, 'TTX005', 'Trần Thị Thanh Hải', 'Trưởng phòng Kế toán', 'Head of Accounting', null, 'head',
  'manager', 'dp_acc', 'si_remote', null, null, 'hearing', false,
  true, false, true, '2026-08-24T16:18:26.013Z'::timestamptz, 'u_TTX005')
on conflict (id) do update set ma = excluded.ma, ten = excluded.ten, vai = excluded.vai, phong_ban_id = excluded.phong_ban_id, diem_id = excluded.diem_id, tuyen_id = excluded.tuyen_id, hoat_dong = excluded.hoat_dong, la_thu = excluded.la_thu;

select pg_temp.ttx_tao_tk('8c4e23c4-b65c-2014-5ebf-7d5cb6037f27'::uuid, 'ttx006@ttx.local', '123456');
insert into ttx.nguoi (id, ma, ten, chuc_danh, chuc_danh_en, cap_bac, bac, vai, phong_ban_id, diem_id, tuyen_id, ten_tuyen, nghe, co_diem_ban, hoat_dong, la_thu, phai_doi_mk, vao_lam, id_cu) values (
  '8c4e23c4-b65c-2014-5ebf-7d5cb6037f27'::uuid, 'TTX006', 'Nguyễn Thị Nhật Nguyên', 'Lead Thương mại & Dịch vụ', 'Commercial & Services', null, 'lead',
  'staff', 'dp_comm', 'si_shop', 'tr_comm', null, 'hearing', false,
  true, false, true, '2026-08-24T16:18:26.013Z'::timestamptz, 'u_TTX006')
on conflict (id) do update set ma = excluded.ma, ten = excluded.ten, vai = excluded.vai, phong_ban_id = excluded.phong_ban_id, diem_id = excluded.diem_id, tuyen_id = excluded.tuyen_id, hoat_dong = excluded.hoat_dong, la_thu = excluded.la_thu;

select pg_temp.ttx_tao_tk('b87d0e14-55be-7a5e-8434-11336ba59f47'::uuid, 'ttx007@ttx.local', '123456');
insert into ttx.nguoi (id, ma, ten, chuc_danh, chuc_danh_en, cap_bac, bac, vai, phong_ban_id, diem_id, tuyen_id, ten_tuyen, nghe, co_diem_ban, hoat_dong, la_thu, phai_doi_mk, vao_lam, id_cu) values (
  'b87d0e14-55be-7a5e-8434-11336ba59f47'::uuid, 'TTX007', 'A Mỹ Ngọc', 'Nhân viên Thương mại & Dịch vụ', 'Commercial & Services', null, 'staff',
  'staff', 'dp_comm', 'si_shop', 'tr_comm', null, 'hearing', false,
  true, false, true, '2026-08-24T16:18:26.013Z'::timestamptz, 'u_TTX007')
on conflict (id) do update set ma = excluded.ma, ten = excluded.ten, vai = excluded.vai, phong_ban_id = excluded.phong_ban_id, diem_id = excluded.diem_id, tuyen_id = excluded.tuyen_id, hoat_dong = excluded.hoat_dong, la_thu = excluded.la_thu;

select pg_temp.ttx_tao_tk('4a562a11-0bd6-1542-4994-5275328c0e06'::uuid, 'ttx008@ttx.local', '123456');
insert into ttx.nguoi (id, ma, ten, chuc_danh, chuc_danh_en, cap_bac, bac, vai, phong_ban_id, diem_id, tuyen_id, ten_tuyen, nghe, co_diem_ban, hoat_dong, la_thu, phai_doi_mk, vao_lam, id_cu) values (
  '4a562a11-0bd6-1542-4994-5275328c0e06'::uuid, 'TTX008', 'Nguyễn Hương Lê', 'Nhân viên Kho & Đóng gói', 'Warehouse & Packaging', null, 'staff',
  'staff', 'dp_supply', 'si_wh', null, null, 'hearing', false,
  true, false, true, '2026-08-24T16:18:26.013Z'::timestamptz, 'u_TTX008')
on conflict (id) do update set ma = excluded.ma, ten = excluded.ten, vai = excluded.vai, phong_ban_id = excluded.phong_ban_id, diem_id = excluded.diem_id, tuyen_id = excluded.tuyen_id, hoat_dong = excluded.hoat_dong, la_thu = excluded.la_thu;

select pg_temp.ttx_tao_tk('c03a5a52-def3-eca9-00e5-999ad520ef5a'::uuid, 'ttx009@ttx.local', '123456');
insert into ttx.nguoi (id, ma, ten, chuc_danh, chuc_danh_en, cap_bac, bac, vai, phong_ban_id, diem_id, tuyen_id, ten_tuyen, nghe, co_diem_ban, hoat_dong, la_thu, phai_doi_mk, vao_lam, id_cu) values (
  'c03a5a52-def3-eca9-00e5-999ad520ef5a'::uuid, 'TTX009', 'Lê Tuấn Huy', 'Nhân viên Pha chế', 'Barista', null, 'staff',
  'staff', 'dp_barista', 'si_shop', null, null, 'deaf', false,
  true, false, true, '2026-08-24T16:18:26.013Z'::timestamptz, 'u_TTX009')
on conflict (id) do update set ma = excluded.ma, ten = excluded.ten, vai = excluded.vai, phong_ban_id = excluded.phong_ban_id, diem_id = excluded.diem_id, tuyen_id = excluded.tuyen_id, hoat_dong = excluded.hoat_dong, la_thu = excluded.la_thu;

select pg_temp.ttx_tao_tk('75618012-f63a-cc72-129c-630178c5538e'::uuid, 'ttx010@ttx.local', '123456');
insert into ttx.nguoi (id, ma, ten, chuc_danh, chuc_danh_en, cap_bac, bac, vai, phong_ban_id, diem_id, tuyen_id, ten_tuyen, nghe, co_diem_ban, hoat_dong, la_thu, phai_doi_mk, vao_lam, id_cu) values (
  '75618012-f63a-cc72-129c-630178c5538e'::uuid, 'TTX010', 'Trần Quang Tuấn', 'Lead Pha chế - Bếp Bánh', 'Barista & Pastry Lead', null, 'lead',
  'staff', 'dp_barista', 'si_shop', null, null, 'deaf', false,
  true, false, true, '2026-08-24T16:18:26.013Z'::timestamptz, 'u_TTX010')
on conflict (id) do update set ma = excluded.ma, ten = excluded.ten, vai = excluded.vai, phong_ban_id = excluded.phong_ban_id, diem_id = excluded.diem_id, tuyen_id = excluded.tuyen_id, hoat_dong = excluded.hoat_dong, la_thu = excluded.la_thu;

select pg_temp.ttx_tao_tk('61118e95-4a17-137d-87a8-e303a7b6eb8b'::uuid, 'ttx011@ttx.local', '123456');
insert into ttx.nguoi (id, ma, ten, chuc_danh, chuc_danh_en, cap_bac, bac, vai, phong_ban_id, diem_id, tuyen_id, ten_tuyen, nghe, co_diem_ban, hoat_dong, la_thu, phai_doi_mk, vao_lam, id_cu) values (
  '61118e95-4a17-137d-87a8-e303a7b6eb8b'::uuid, 'TTX011', 'Nguyễn Thị Ngọc Anh', 'Nhân viên Pha chế', 'Barista', null, 'staff',
  'staff', 'dp_barista', 'si_shop', null, null, 'deaf', false,
  true, false, true, '2026-08-24T16:18:26.013Z'::timestamptz, 'u_TTX011')
on conflict (id) do update set ma = excluded.ma, ten = excluded.ten, vai = excluded.vai, phong_ban_id = excluded.phong_ban_id, diem_id = excluded.diem_id, tuyen_id = excluded.tuyen_id, hoat_dong = excluded.hoat_dong, la_thu = excluded.la_thu;

select pg_temp.ttx_tao_tk('c8f7649c-2c31-e932-5609-7f52aa612a80'::uuid, 'ttx012@ttx.local', '123456');
insert into ttx.nguoi (id, ma, ten, chuc_danh, chuc_danh_en, cap_bac, bac, vai, phong_ban_id, diem_id, tuyen_id, ten_tuyen, nghe, co_diem_ban, hoat_dong, la_thu, phai_doi_mk, vao_lam, id_cu) values (
  'c8f7649c-2c31-e932-5609-7f52aa612a80'::uuid, 'TTX012', 'Huỳnh Ngọc Sơn', 'Nhân viên Bếp Bánh', 'Pastry', null, 'staff',
  'staff', 'dp_pastry', 'si_shop', null, null, 'deaf', false,
  true, false, true, '2026-08-24T16:18:26.013Z'::timestamptz, 'u_TTX012')
on conflict (id) do update set ma = excluded.ma, ten = excluded.ten, vai = excluded.vai, phong_ban_id = excluded.phong_ban_id, diem_id = excluded.diem_id, tuyen_id = excluded.tuyen_id, hoat_dong = excluded.hoat_dong, la_thu = excluded.la_thu;

select pg_temp.ttx_tao_tk('0a4e28d2-219a-e421-6b14-94beb83c9055'::uuid, 'ttx013@ttx.local', '123456');
insert into ttx.nguoi (id, ma, ten, chuc_danh, chuc_danh_en, cap_bac, bac, vai, phong_ban_id, diem_id, tuyen_id, ten_tuyen, nghe, co_diem_ban, hoat_dong, la_thu, phai_doi_mk, vao_lam, id_cu) values (
  '0a4e28d2-219a-e421-6b14-94beb83c9055'::uuid, 'TTX013', 'Hoàng Văn An', 'Nhân viên Bếp Bánh', 'Pastry', null, 'staff',
  'staff', 'dp_pastry', 'si_shop', null, null, 'deaf', false,
  true, false, true, '2026-08-24T16:18:26.013Z'::timestamptz, 'u_TTX013')
on conflict (id) do update set ma = excluded.ma, ten = excluded.ten, vai = excluded.vai, phong_ban_id = excluded.phong_ban_id, diem_id = excluded.diem_id, tuyen_id = excluded.tuyen_id, hoat_dong = excluded.hoat_dong, la_thu = excluded.la_thu;

select pg_temp.ttx_tao_tk('ae73ec74-f1de-869a-aa73-b1067d7d695f'::uuid, 'ttx014@ttx.local', '123456');
insert into ttx.nguoi (id, ma, ten, chuc_danh, chuc_danh_en, cap_bac, bac, vai, phong_ban_id, diem_id, tuyen_id, ten_tuyen, nghe, co_diem_ban, hoat_dong, la_thu, phai_doi_mk, vao_lam, id_cu) values (
  'ae73ec74-f1de-869a-aa73-b1067d7d695f'::uuid, 'TTX014', 'Nông Thị Diệu Thanh', 'Nhân viên Pha chế', 'Barista', null, 'staff',
  'staff', 'dp_barista', 'si_shop', null, null, 'deaf', false,
  true, false, true, '2026-08-24T16:18:26.013Z'::timestamptz, 'u_TTX014')
on conflict (id) do update set ma = excluded.ma, ten = excluded.ten, vai = excluded.vai, phong_ban_id = excluded.phong_ban_id, diem_id = excluded.diem_id, tuyen_id = excluded.tuyen_id, hoat_dong = excluded.hoat_dong, la_thu = excluded.la_thu;

select pg_temp.ttx_tao_tk('2ff6a67a-7e91-4344-105b-113a685180e2'::uuid, 'ttx015@ttx.local', '123456');
insert into ttx.nguoi (id, ma, ten, chuc_danh, chuc_danh_en, cap_bac, bac, vai, phong_ban_id, diem_id, tuyen_id, ten_tuyen, nghe, co_diem_ban, hoat_dong, la_thu, phai_doi_mk, vao_lam, id_cu) values (
  '2ff6a67a-7e91-4344-105b-113a685180e2'::uuid, 'TTX015', 'Trần Lâm Châu', 'Nhân viên Kho & Đóng gói', 'Warehouse & Packaging', null, 'staff',
  'staff', 'dp_supply', 'si_wh', null, null, 'deaf', false,
  true, false, true, '2026-08-24T16:18:26.013Z'::timestamptz, 'u_TTX015')
on conflict (id) do update set ma = excluded.ma, ten = excluded.ten, vai = excluded.vai, phong_ban_id = excluded.phong_ban_id, diem_id = excluded.diem_id, tuyen_id = excluded.tuyen_id, hoat_dong = excluded.hoat_dong, la_thu = excluded.la_thu;

select pg_temp.ttx_tao_tk('0a522de5-c6ef-a859-5ba2-28dbd7e6de7d'::uuid, 'ttx016@ttx.local', '123456');
insert into ttx.nguoi (id, ma, ten, chuc_danh, chuc_danh_en, cap_bac, bac, vai, phong_ban_id, diem_id, tuyen_id, ten_tuyen, nghe, co_diem_ban, hoat_dong, la_thu, phai_doi_mk, vao_lam, id_cu) values (
  '0a522de5-c6ef-a859-5ba2-28dbd7e6de7d'::uuid, 'TTX016', 'Nguyễn Thế Huy', 'Nhân viên Kho & Đóng gói', 'Warehouse & Packaging', null, 'staff',
  'staff', 'dp_supply', 'si_wh', null, null, 'hearing', false,
  true, false, true, '2026-08-24T16:18:26.013Z'::timestamptz, 'u_TTX016')
on conflict (id) do update set ma = excluded.ma, ten = excluded.ten, vai = excluded.vai, phong_ban_id = excluded.phong_ban_id, diem_id = excluded.diem_id, tuyen_id = excluded.tuyen_id, hoat_dong = excluded.hoat_dong, la_thu = excluded.la_thu;

select pg_temp.ttx_tao_tk('5735706d-00f5-2f34-e41a-5b970eb2303c'::uuid, 'ttx017@ttx.local', '123456');
insert into ttx.nguoi (id, ma, ten, chuc_danh, chuc_danh_en, cap_bac, bac, vai, phong_ban_id, diem_id, tuyen_id, ten_tuyen, nghe, co_diem_ban, hoat_dong, la_thu, phai_doi_mk, vao_lam, id_cu) values (
  '5735706d-00f5-2f34-e41a-5b970eb2303c'::uuid, 'TTX017', 'Phan Thị Thúy Ngân', 'Nhân viên Kho & Đóng gói', 'Warehouse & Packaging', null, 'staff',
  'staff', 'dp_supply', 'si_wh', null, null, 'deaf', false,
  true, false, true, '2026-08-24T16:18:26.013Z'::timestamptz, 'u_TTX017')
on conflict (id) do update set ma = excluded.ma, ten = excluded.ten, vai = excluded.vai, phong_ban_id = excluded.phong_ban_id, diem_id = excluded.diem_id, tuyen_id = excluded.tuyen_id, hoat_dong = excluded.hoat_dong, la_thu = excluded.la_thu;

select pg_temp.ttx_tao_tk('4a4c0868-e0de-6bfe-c5ab-06bcdc1986d7'::uuid, 'ttx018@ttx.local', '123456');
insert into ttx.nguoi (id, ma, ten, chuc_danh, chuc_danh_en, cap_bac, bac, vai, phong_ban_id, diem_id, tuyen_id, ten_tuyen, nghe, co_diem_ban, hoat_dong, la_thu, phai_doi_mk, vao_lam, id_cu) values (
  '4a4c0868-e0de-6bfe-c5ab-06bcdc1986d7'::uuid, 'TTX018', 'Nguyễn Thị Thúy', 'Nhân viên Kho & Đóng gói', 'Warehouse & Packaging', null, 'staff',
  'staff', 'dp_supply', 'si_wh', null, null, 'hearing', false,
  true, false, true, '2026-08-24T16:18:26.013Z'::timestamptz, 'u_TTX018')
on conflict (id) do update set ma = excluded.ma, ten = excluded.ten, vai = excluded.vai, phong_ban_id = excluded.phong_ban_id, diem_id = excluded.diem_id, tuyen_id = excluded.tuyen_id, hoat_dong = excluded.hoat_dong, la_thu = excluded.la_thu;

select pg_temp.ttx_tao_tk('a8cc26d9-a754-ac6e-3a1d-dd7989baaab2'::uuid, 'ttx019@ttx.local', '123456');
insert into ttx.nguoi (id, ma, ten, chuc_danh, chuc_danh_en, cap_bac, bac, vai, phong_ban_id, diem_id, tuyen_id, ten_tuyen, nghe, co_diem_ban, hoat_dong, la_thu, phai_doi_mk, vao_lam, id_cu) values (
  'a8cc26d9-a754-ac6e-3a1d-dd7989baaab2'::uuid, 'TTX019', 'Ngô Thị Thúy Lộc', 'Kế toán chức năng', 'Functional Accountant', null, 'staff',
  'staff', 'dp_accfn', 'si_remote', null, null, 'hearing', false,
  true, false, true, '2026-08-24T16:18:26.013Z'::timestamptz, 'u_TTX019')
on conflict (id) do update set ma = excluded.ma, ten = excluded.ten, vai = excluded.vai, phong_ban_id = excluded.phong_ban_id, diem_id = excluded.diem_id, tuyen_id = excluded.tuyen_id, hoat_dong = excluded.hoat_dong, la_thu = excluded.la_thu;

select pg_temp.ttx_tao_tk('82acd347-c0a5-f773-02b3-6ad9dae8bf9f'::uuid, 'ttx020@ttx.local', '123456');
insert into ttx.nguoi (id, ma, ten, chuc_danh, chuc_danh_en, cap_bac, bac, vai, phong_ban_id, diem_id, tuyen_id, ten_tuyen, nghe, co_diem_ban, hoat_dong, la_thu, phai_doi_mk, vao_lam, id_cu) values (
  '82acd347-c0a5-f773-02b3-6ad9dae8bf9f'::uuid, 'TTX020', 'Nguyễn Hoàng Thùy Nguyên', 'Kế toán chức năng', 'Functional Accountant', null, 'staff',
  'staff', 'dp_accfn', 'si_remote', null, null, 'hearing', false,
  true, false, true, '2026-08-24T16:18:26.013Z'::timestamptz, 'u_TTX020')
on conflict (id) do update set ma = excluded.ma, ten = excluded.ten, vai = excluded.vai, phong_ban_id = excluded.phong_ban_id, diem_id = excluded.diem_id, tuyen_id = excluded.tuyen_id, hoat_dong = excluded.hoat_dong, la_thu = excluded.la_thu;

select pg_temp.ttx_tao_tk('92ba15ed-572b-c944-d846-9afa176e70fb'::uuid, 'ttx021@ttx.local', '123456');
insert into ttx.nguoi (id, ma, ten, chuc_danh, chuc_danh_en, cap_bac, bac, vai, phong_ban_id, diem_id, tuyen_id, ten_tuyen, nghe, co_diem_ban, hoat_dong, la_thu, phai_doi_mk, vao_lam, id_cu) values (
  '92ba15ed-572b-c944-d846-9afa176e70fb'::uuid, 'TTX021', 'Nguyễn Thị Thư', 'Kế toán chức năng', 'Functional Accountant', null, 'staff',
  'staff', 'dp_accfn', 'si_remote', null, null, 'hearing', false,
  true, false, true, '2026-08-24T16:18:26.013Z'::timestamptz, 'u_TTX021')
on conflict (id) do update set ma = excluded.ma, ten = excluded.ten, vai = excluded.vai, phong_ban_id = excluded.phong_ban_id, diem_id = excluded.diem_id, tuyen_id = excluded.tuyen_id, hoat_dong = excluded.hoat_dong, la_thu = excluded.la_thu;

select pg_temp.ttx_tao_tk('27bbd99e-d451-7e92-edf8-f400f2cceb4c'::uuid, 'ttx022@ttx.local', '123456');
insert into ttx.nguoi (id, ma, ten, chuc_danh, chuc_danh_en, cap_bac, bac, vai, phong_ban_id, diem_id, tuyen_id, ten_tuyen, nghe, co_diem_ban, hoat_dong, la_thu, phai_doi_mk, vao_lam, id_cu) values (
  '27bbd99e-d451-7e92-edf8-f400f2cceb4c'::uuid, 'TTX022', 'Nguyễn Xuân Cảnh', 'Nhân viên Bảo vệ', 'Security', null, 'staff',
  'staff', 'dp_security', 'si_shop', null, null, 'hearing', false,
  true, false, true, '2026-08-24T16:18:26.013Z'::timestamptz, 'u_TTX022')
on conflict (id) do update set ma = excluded.ma, ten = excluded.ten, vai = excluded.vai, phong_ban_id = excluded.phong_ban_id, diem_id = excluded.diem_id, tuyen_id = excluded.tuyen_id, hoat_dong = excluded.hoat_dong, la_thu = excluded.la_thu;

select pg_temp.ttx_tao_tk('d227bb4e-b537-55f9-43e1-6b59a532b86c'::uuid, 'ttx023@ttx.local', '123456');
insert into ttx.nguoi (id, ma, ten, chuc_danh, chuc_danh_en, cap_bac, bac, vai, phong_ban_id, diem_id, tuyen_id, ten_tuyen, nghe, co_diem_ban, hoat_dong, la_thu, phai_doi_mk, vao_lam, id_cu) values (
  'd227bb4e-b537-55f9-43e1-6b59a532b86c'::uuid, 'TTX023', 'Nguyễn Lê Phương Uyên', 'Nhân viên Social Media', 'Social Media Staff', null, 'staff',
  'staff', 'dp_social', null, null, null, 'hearing', false,
  true, false, true, '2026-08-24T16:18:26.013Z'::timestamptz, 'u_TTX023')
on conflict (id) do update set ma = excluded.ma, ten = excluded.ten, vai = excluded.vai, phong_ban_id = excluded.phong_ban_id, diem_id = excluded.diem_id, tuyen_id = excluded.tuyen_id, hoat_dong = excluded.hoat_dong, la_thu = excluded.la_thu;

select pg_temp.ttx_tao_tk('c4290702-431d-f215-5c3f-02932e906d1e'::uuid, 'ttx024@ttx.local', '123456');
insert into ttx.nguoi (id, ma, ten, chuc_danh, chuc_danh_en, cap_bac, bac, vai, phong_ban_id, diem_id, tuyen_id, ten_tuyen, nghe, co_diem_ban, hoat_dong, la_thu, phai_doi_mk, vao_lam, id_cu) values (
  'c4290702-431d-f215-5c3f-02932e906d1e'::uuid, 'TTX024', 'Cao Gia Hân', 'Quản lý Chuỗi cung ứng', 'Supply Chain Manager', null, 'manager',
  'manager', 'dp_supply', 'si_wh', null, null, 'hearing', false,
  true, false, true, '2026-08-24T16:18:26.013Z'::timestamptz, 'u_TTX024')
on conflict (id) do update set ma = excluded.ma, ten = excluded.ten, vai = excluded.vai, phong_ban_id = excluded.phong_ban_id, diem_id = excluded.diem_id, tuyen_id = excluded.tuyen_id, hoat_dong = excluded.hoat_dong, la_thu = excluded.la_thu;

select pg_temp.ttx_tao_tk('d63ef418-582f-6ef6-cf7a-2129844d0c92'::uuid, 'ttx025@ttx.local', '123456');
insert into ttx.nguoi (id, ma, ten, chuc_danh, chuc_danh_en, cap_bac, bac, vai, phong_ban_id, diem_id, tuyen_id, ten_tuyen, nghe, co_diem_ban, hoat_dong, la_thu, phai_doi_mk, vao_lam, id_cu) values (
  'd63ef418-582f-6ef6-cf7a-2129844d0c92'::uuid, 'TTX025', 'Nguyễn Thụy Thùy Dương', null, null, null, 'manager',
  'manager', null, 'si_shop', null, null, 'hearing', false,
  true, false, true, '2026-08-24T16:18:26.013Z'::timestamptz, 'u_TTX025')
on conflict (id) do update set ma = excluded.ma, ten = excluded.ten, vai = excluded.vai, phong_ban_id = excluded.phong_ban_id, diem_id = excluded.diem_id, tuyen_id = excluded.tuyen_id, hoat_dong = excluded.hoat_dong, la_thu = excluded.la_thu;

select pg_temp.ttx_tao_tk('139f034f-e5f6-7bc3-ef9d-d7831f0c85e0'::uuid, 'ttx026@ttx.local', '123456');
insert into ttx.nguoi (id, ma, ten, chuc_danh, chuc_danh_en, cap_bac, bac, vai, phong_ban_id, diem_id, tuyen_id, ten_tuyen, nghe, co_diem_ban, hoat_dong, la_thu, phai_doi_mk, vao_lam, id_cu) values (
  '139f034f-e5f6-7bc3-ef9d-d7831f0c85e0'::uuid, 'TTX026', 'Nguyễn Mỹ Nhật Phương', 'Nhân viên Thương mại & Dịch vụ', 'Commercial & Services', null, 'staff',
  'staff', 'dp_comm', 'si_shop', 'tr_comm', null, 'hearing', false,
  true, false, true, '2026-08-24T16:18:26.013Z'::timestamptz, 'u_TTX026')
on conflict (id) do update set ma = excluded.ma, ten = excluded.ten, vai = excluded.vai, phong_ban_id = excluded.phong_ban_id, diem_id = excluded.diem_id, tuyen_id = excluded.tuyen_id, hoat_dong = excluded.hoat_dong, la_thu = excluded.la_thu;

select pg_temp.ttx_tao_tk('3ee5fcb3-ae46-c833-ebb4-a38022a9bb53'::uuid, 'ttx027@ttx.local', '123456');
insert into ttx.nguoi (id, ma, ten, chuc_danh, chuc_danh_en, cap_bac, bac, vai, phong_ban_id, diem_id, tuyen_id, ten_tuyen, nghe, co_diem_ban, hoat_dong, la_thu, phai_doi_mk, vao_lam, id_cu) values (
  '3ee5fcb3-ae46-c833-ebb4-a38022a9bb53'::uuid, 'TTX027', 'Nguyễn Thị Thuỳ Trang', 'Nhân viên Thương mại & Dịch vụ', 'Commercial & Services', null, 'staff',
  'staff', 'dp_comm', 'si_shop', 'tr_comm', null, 'hearing', false,
  true, false, true, '2026-08-24T16:18:26.013Z'::timestamptz, 'u_TTX027')
on conflict (id) do update set ma = excluded.ma, ten = excluded.ten, vai = excluded.vai, phong_ban_id = excluded.phong_ban_id, diem_id = excluded.diem_id, tuyen_id = excluded.tuyen_id, hoat_dong = excluded.hoat_dong, la_thu = excluded.la_thu;

select pg_temp.ttx_tao_tk('b13a0816-7d08-84ea-5f80-67e676770316'::uuid, 'ttx028@ttx.local', '123456');
insert into ttx.nguoi (id, ma, ten, chuc_danh, chuc_danh_en, cap_bac, bac, vai, phong_ban_id, diem_id, tuyen_id, ten_tuyen, nghe, co_diem_ban, hoat_dong, la_thu, phai_doi_mk, vao_lam, id_cu) values (
  'b13a0816-7d08-84ea-5f80-67e676770316'::uuid, 'TTX028', 'Trần Quốc Tuấn', 'Nhân viên Thương mại & Dịch vụ', 'Commercial & Services', null, 'staff',
  'staff', 'dp_comm', 'si_shop', 'tr_comm', null, 'hearing', false,
  true, false, true, '2026-08-24T16:18:26.013Z'::timestamptz, 'u_TTX028')
on conflict (id) do update set ma = excluded.ma, ten = excluded.ten, vai = excluded.vai, phong_ban_id = excluded.phong_ban_id, diem_id = excluded.diem_id, tuyen_id = excluded.tuyen_id, hoat_dong = excluded.hoat_dong, la_thu = excluded.la_thu;

select pg_temp.ttx_tao_tk('99cbfc2b-582e-ef11-c9e8-0079bea8b781'::uuid, 'ttx029@ttx.local', '123456');
insert into ttx.nguoi (id, ma, ten, chuc_danh, chuc_danh_en, cap_bac, bac, vai, phong_ban_id, diem_id, tuyen_id, ten_tuyen, nghe, co_diem_ban, hoat_dong, la_thu, phai_doi_mk, vao_lam, id_cu) values (
  '99cbfc2b-582e-ef11-c9e8-0079bea8b781'::uuid, 'TTX029', 'Hồ Đăng Phong', 'Trưởng phòng Phát triển Phần mềm', 'Head of Software Development', null, 'head',
  'manager', 'dp_soft', 'si_office', null, null, 'hearing', false,
  true, false, true, '2026-08-24T16:18:26.013Z'::timestamptz, 'u_TTX029')
on conflict (id) do update set ma = excluded.ma, ten = excluded.ten, vai = excluded.vai, phong_ban_id = excluded.phong_ban_id, diem_id = excluded.diem_id, tuyen_id = excluded.tuyen_id, hoat_dong = excluded.hoat_dong, la_thu = excluded.la_thu;

select pg_temp.ttx_tao_tk('32b1ad43-7fa0-b021-b588-9c0726cdc468'::uuid, 'ttx030@ttx.local', '123456');
insert into ttx.nguoi (id, ma, ten, chuc_danh, chuc_danh_en, cap_bac, bac, vai, phong_ban_id, diem_id, tuyen_id, ten_tuyen, nghe, co_diem_ban, hoat_dong, la_thu, phai_doi_mk, vao_lam, id_cu) values (
  '32b1ad43-7fa0-b021-b588-9c0726cdc468'::uuid, 'TTX030', 'Đoàn Anh Trung', 'Trưởng phòng Nhân sự', 'Head of People & Culture', null, 'head',
  'manager', 'dp_hr', 'si_office', null, null, 'hearing', false,
  true, false, true, '2026-08-24T16:18:26.013Z'::timestamptz, 'u_TTX030')
on conflict (id) do update set ma = excluded.ma, ten = excluded.ten, vai = excluded.vai, phong_ban_id = excluded.phong_ban_id, diem_id = excluded.diem_id, tuyen_id = excluded.tuyen_id, hoat_dong = excluded.hoat_dong, la_thu = excluded.la_thu;

select pg_temp.ttx_tao_tk('8879805a-1ffb-4e9e-77c7-d51524c61d82'::uuid, 'test@ttx.local', '123456');
insert into ttx.nguoi (id, ma, ten, chuc_danh, chuc_danh_en, cap_bac, bac, vai, phong_ban_id, diem_id, tuyen_id, ten_tuyen, nghe, co_diem_ban, hoat_dong, la_thu, phai_doi_mk, vao_lam, id_cu) values (
  '8879805a-1ffb-4e9e-77c7-d51524c61d82'::uuid, 'TEST', 'Nguyễn Văn Test', 'Nhân viên Thương mại & Dịch vụ', 'Commercial & Services', null, 'staff',
  'staff', 'dp_comm', 'si_shop', 'tr_comm', null, 'hearing', false,
  true, true, true, '2026-08-24T16:18:26.038Z'::timestamptz, 'u_demo')
on conflict (id) do update set ma = excluded.ma, ten = excluded.ten, vai = excluded.vai, phong_ban_id = excluded.phong_ban_id, diem_id = excluded.diem_id, tuyen_id = excluded.tuyen_id, hoat_dong = excluded.hoat_dong, la_thu = excluded.la_thu;

-- ─────────────────────────────────────────────────────── SỰ VIỆC ──
-- ⚠️ Tắt trigger đặt trạng thái. Nó ép mọi phiếu ghi nhận mới về 'pending'
-- và xoá chữ ký phòng Nhân sự — đúng khi ai đó lập biên bản mới, nhưng
-- sẽ xoá sạch lịch sử duyệt của 7 sự việc cũ nếu để nguyên lúc chuyển.
alter table ttx.su_viec disable trigger su_viec_trang_thai_dau;

insert into ttx.su_viec (id, loai, nguoi_id, nguoi_lap_id, ma_tieu_chi, id_tieu_chi, la_ranh_gioi, noi_dung, xay_ra_luc, ky, trang_thai, ky_ns, ky_ql, tu_choi, khieu_nai, tra_loi, ghi_chu, anh, quyet_luc, quyet_boi, tao_luc) values (
  'rc_3heizoc', 'ghi_nhan', '8879805a-1ffb-4e9e-77c7-d51524c61d82'::uuid, 'd03a91d5-94bf-854d-cb7d-c914baabaebd'::uuid, 'C8.1', 'c_trcomm_C8_1', false,
  'Có 4 khách tự nhắn tới hỏi mua sau khi xem bài bạn đăng trên trang cá nhân tuần 33.', '2026-08-06T03:15:00.000Z'::timestamptz, '2026-08', 'approved',
  '{"by": "32b1ad43-7fa0-b021-b588-9c0726cdc468", "at": "2026-08-24T16:18:26.039Z"}'::jsonb, '{"by": "d03a91d5-94bf-854d-cb7d-c914baabaebd", "at": "2026-08-24T16:18:26.039Z"}'::jsonb, null, null, null, null, '[]'::jsonb,
  '2026-08-24T16:18:26.039Z'::timestamptz, '1b0d6c77-5be7-1613-6c7f-9dff91479979'::uuid, '2026-08-24T16:18:26.039Z'::timestamptz)
on conflict (id) do nothing;

insert into ttx.su_viec (id, loai, nguoi_id, nguoi_lap_id, ma_tieu_chi, id_tieu_chi, la_ranh_gioi, noi_dung, xay_ra_luc, ky, trang_thai, ky_ns, ky_ql, tu_choi, khieu_nai, tra_loi, ghi_chu, anh, quyet_luc, quyet_boi, tao_luc) values (
  'rc_lr9409n', 'ghi_nhan', '8879805a-1ffb-4e9e-77c7-d51524c61d82'::uuid, '5b61f2a4-4248-4808-f186-ad191ae5603a'::uuid, 'C8.2', 'c_trcomm_C8_2', false,
  'Nội dung bạn đăng dùng đúng bộ nhận diện và thông điệp chuẩn của tuyến, không phải sửa lại.', '2026-08-09T04:15:00.000Z'::timestamptz, '2026-08', 'approved',
  '{"by": "32b1ad43-7fa0-b021-b588-9c0726cdc468", "at": "2026-08-24T16:18:26.039Z"}'::jsonb, '{"by": "5b61f2a4-4248-4808-f186-ad191ae5603a", "at": "2026-08-24T16:18:26.039Z"}'::jsonb, null, null, null, null, '[]'::jsonb,
  '2026-08-24T16:18:26.039Z'::timestamptz, '1b0d6c77-5be7-1613-6c7f-9dff91479979'::uuid, '2026-08-24T16:18:26.039Z'::timestamptz)
on conflict (id) do nothing;

insert into ttx.su_viec (id, loai, nguoi_id, nguoi_lap_id, ma_tieu_chi, id_tieu_chi, la_ranh_gioi, noi_dung, xay_ra_luc, ky, trang_thai, ky_ns, ky_ql, tu_choi, khieu_nai, tra_loi, ghi_chu, anh, quyet_luc, quyet_boi, tao_luc) values (
  'rc_vhk7fjo', 'ghi_nhan', '8879805a-1ffb-4e9e-77c7-d51524c61d82'::uuid, 'd03a91d5-94bf-854d-cb7d-c914baabaebd'::uuid, 'C8.3', 'c_trcomm_C8_3', false,
  'Chủ động nhắn lại hỏi thăm nhóm khách đã mua dịp lễ, hai người quay lại mua tiếp.', '2026-08-12T05:15:00.000Z'::timestamptz, '2026-08', 'approved',
  '{"by": "32b1ad43-7fa0-b021-b588-9c0726cdc468", "at": "2026-08-24T16:18:26.039Z"}'::jsonb, '{"by": "d03a91d5-94bf-854d-cb7d-c914baabaebd", "at": "2026-08-24T16:18:26.039Z"}'::jsonb, null, null, null, null, '[]'::jsonb,
  '2026-08-24T16:18:26.039Z'::timestamptz, '1b0d6c77-5be7-1613-6c7f-9dff91479979'::uuid, '2026-08-24T16:18:26.039Z'::timestamptz)
on conflict (id) do nothing;

insert into ttx.su_viec (id, loai, nguoi_id, nguoi_lap_id, ma_tieu_chi, id_tieu_chi, la_ranh_gioi, noi_dung, xay_ra_luc, ky, trang_thai, ky_ns, ky_ql, tu_choi, khieu_nai, tra_loi, ghi_chu, anh, quyet_luc, quyet_boi, tao_luc) values (
  'rc_qyvnra5', 'vi_pham', '8879805a-1ffb-4e9e-77c7-d51524c61d82'::uuid, 'd03a91d5-94bf-854d-cb7d-c914baabaebd'::uuid, 'B1.3', 'c_trcomm_B1_3', false,
  'Ngày 12/8 tranh luận với khách về việc khách nhớ sai chương trình khuyến mãi, khách bỏ về.', '2026-08-15T06:15:00.000Z'::timestamptz, '2026-08', 'approved',
  '{"by": "32b1ad43-7fa0-b021-b588-9c0726cdc468", "at": "2026-08-24T16:18:26.039Z"}'::jsonb, '{"by": "d03a91d5-94bf-854d-cb7d-c914baabaebd", "at": "2026-08-24T16:18:26.039Z"}'::jsonb, null, null, null, null, '[]'::jsonb,
  '2026-08-24T16:18:26.039Z'::timestamptz, '1b0d6c77-5be7-1613-6c7f-9dff91479979'::uuid, '2026-08-24T16:18:26.039Z'::timestamptz)
on conflict (id) do nothing;

insert into ttx.su_viec (id, loai, nguoi_id, nguoi_lap_id, ma_tieu_chi, id_tieu_chi, la_ranh_gioi, noi_dung, xay_ra_luc, ky, trang_thai, ky_ns, ky_ql, tu_choi, khieu_nai, tra_loi, ghi_chu, anh, quyet_luc, quyet_boi, tao_luc) values (
  'rc_0ldg4c6', 'vi_pham', '8879805a-1ffb-4e9e-77c7-d51524c61d82'::uuid, '5b61f2a4-4248-4808-f186-ad191ae5603a'::uuid, 'B3.2', 'c_trcomm_B3_2', false,
  'Tư vấn nến thơm cho khách hỏi về khó ngủ, trong khi vấn đề của khách cần sản phẩm khác.', '2026-08-18T07:15:00.000Z'::timestamptz, '2026-08', 'approved',
  '{"by": "32b1ad43-7fa0-b021-b588-9c0726cdc468", "at": "2026-08-24T16:18:26.039Z"}'::jsonb, '{"by": "5b61f2a4-4248-4808-f186-ad191ae5603a", "at": "2026-08-24T16:18:26.039Z"}'::jsonb, null, null, null, null, '[]'::jsonb,
  '2026-08-24T16:18:26.039Z'::timestamptz, '1b0d6c77-5be7-1613-6c7f-9dff91479979'::uuid, '2026-08-24T16:18:26.039Z'::timestamptz)
on conflict (id) do nothing;

insert into ttx.su_viec (id, loai, nguoi_id, nguoi_lap_id, ma_tieu_chi, id_tieu_chi, la_ranh_gioi, noi_dung, xay_ra_luc, ky, trang_thai, ky_ns, ky_ql, tu_choi, khieu_nai, tra_loi, ghi_chu, anh, quyet_luc, quyet_boi, tao_luc) values (
  'rc_3fn9gqk', 'vi_pham', '8879805a-1ffb-4e9e-77c7-d51524c61d82'::uuid, 'd03a91d5-94bf-854d-cb7d-c914baabaebd'::uuid, 'C6.4', 'c_trcomm_C6_4', false,
  'Bán tinh dầu cho khách đang mang thai mà không nêu trường hợp chống chỉ định.', '2026-08-21T08:15:00.000Z'::timestamptz, '2026-08', 'approved',
  '{"by": "32b1ad43-7fa0-b021-b588-9c0726cdc468", "at": "2026-08-24T16:18:26.039Z"}'::jsonb, '{"by": "d03a91d5-94bf-854d-cb7d-c914baabaebd", "at": "2026-08-24T16:18:26.039Z"}'::jsonb, null, null, null, null, '[]'::jsonb,
  '2026-08-24T16:18:26.039Z'::timestamptz, '1b0d6c77-5be7-1613-6c7f-9dff91479979'::uuid, '2026-08-24T16:18:26.039Z'::timestamptz)
on conflict (id) do nothing;

insert into ttx.su_viec (id, loai, nguoi_id, nguoi_lap_id, ma_tieu_chi, id_tieu_chi, la_ranh_gioi, noi_dung, xay_ra_luc, ky, trang_thai, ky_ns, ky_ql, tu_choi, khieu_nai, tra_loi, ghi_chu, anh, quyet_luc, quyet_boi, tao_luc) values (
  'rc_rfwgf25', 'vi_pham', '8879805a-1ffb-4e9e-77c7-d51524c61d82'::uuid, 'd03a91d5-94bf-854d-cb7d-c914baabaebd'::uuid, 'C7.1', 'c_trcomm_C7_1', false,
  'Chiều 21/8 quầy đông, một nhóm khách đứng chờ 15 phút không ai tiếp.', '2026-08-24T09:15:00.000Z'::timestamptz, '2026-08', 'approved',
  '{"by": "32b1ad43-7fa0-b021-b588-9c0726cdc468", "at": "2026-08-24T16:18:26.039Z"}'::jsonb, '{"by": "d03a91d5-94bf-854d-cb7d-c914baabaebd", "at": "2026-08-24T16:18:26.039Z"}'::jsonb, null, null, null, null, '[]'::jsonb,
  '2026-08-24T16:18:26.039Z'::timestamptz, '1b0d6c77-5be7-1613-6c7f-9dff91479979'::uuid, '2026-08-24T16:18:26.039Z'::timestamptz)
on conflict (id) do nothing;

alter table ttx.su_viec enable trigger su_viec_trang_thai_dau;

-- ────────────────────────────────────────────────────── ĐÁNH GIÁ ──
insert into ttx.danh_gia (id, nguoi_id, nguoi_cham_id, ky, diem, nhan_xet, ghi_chu, trang_thai, quyet_luc, quyet_boi, tao_luc) values (
  'rv_g6fdh5s', '8879805a-1ffb-4e9e-77c7-d51524c61d82'::uuid, '8c4e23c4-b65c-2014-5ebf-7d5cb6037f27'::uuid, '2026-08', '{"c_kc_VH1_1": 4, "c_kc_VH1_2": 3, "c_kc_VH2_1": 3, "c_kc_VH2_2": 4, "c_kc_VH5_3": 3, "c_trcomm_B1_1": 4, "c_trcomm_B1_3": 2, "c_kc_NL4_1": 3, "c_trcomm_B3_2": 1, "c_trcomm_C6_4": 2, "c_trcomm_C7_1": 2, "c_trcomm_C8_1": 4, "c_trcomm_C8_2": 4, "c_trcomm_C8_3": 5}'::jsonb,
  'Bốn sự việc trong tháng đều rơi vào bước tiếp khách: tranh luận với khách, chọn sai sản phẩm, thiếu cảnh báo chống chỉ định, và để khách chờ. Bù lại kênh cá nhân của bạn kéo khách về đều, phần đó chấm cao.', null, 'approved', '2026-08-24T16:18:26.038Z'::timestamptz, '1b0d6c77-5be7-1613-6c7f-9dff91479979'::uuid, '2026-08-24T16:18:26.038Z'::timestamptz)
on conflict (id) do nothing;

insert into ttx.danh_gia (id, nguoi_id, nguoi_cham_id, ky, diem, nhan_xet, ghi_chu, trang_thai, quyet_luc, quyet_boi, tao_luc) values (
  'rv_106fyrm', '8879805a-1ffb-4e9e-77c7-d51524c61d82'::uuid, 'd63ef418-582f-6ef6-cf7a-2129844d0c92'::uuid, '2026-08', '{"c_kc_VH1_1": 5, "c_kc_VH1_2": 4, "c_kc_VH2_1": 4, "c_kc_VH2_2": 4, "c_kc_VH5_3": 4, "c_trcomm_B1_1": 5, "c_trcomm_B1_3": 2, "c_kc_NL4_1": 5, "c_trcomm_B3_2": 2, "c_trcomm_C6_4": 2, "c_trcomm_C7_1": 3, "c_trcomm_C8_1": 5, "c_trcomm_C8_2": 4, "c_trcomm_C8_3": 5}'::jsonb,
  'Đồng ý với Lead. Điểm các câu có biên bản em để thấp đúng theo sự việc đã ký. Ba câu C8 chấm cao vì có phiếu ghi nhận kèm bằng chứng.', null, 'approved', '2026-08-24T16:18:26.038Z'::timestamptz, '1b0d6c77-5be7-1613-6c7f-9dff91479979'::uuid, '2026-08-24T16:18:26.038Z'::timestamptz)
on conflict (id) do nothing;

commit;

-- ══════════════════════════════════════════════════════ KIỂM LẠI ══
-- Bốn con số này phải khớp, không khớp thì đừng đi tiếp, báo em.
select 'người'    as thu, count(*)::text as co, '33' as phai from ttx.nguoi
union all select 'tài khoản', count(*)::text, '33' from auth.users where email like '%@ttx.local'
union all select 'sự việc', count(*)::text, '7' from ttx.su_viec
union all select 'kháng nghị', count(*)::text, '2' from ttx.danh_gia;

-- Trạng thái duyệt còn nguyên chứ không bị trigger xoá:
select trang_thai, count(*) from ttx.su_viec group by 1 order by 1;
