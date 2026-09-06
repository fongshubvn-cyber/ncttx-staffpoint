-- ═══════════════════════════════════════════════════════════════════════════
--  NHÀ CỦA THỜI THANH XUÂN · Ứng dụng đánh giá nhân sự
--  01 · LƯỢC ĐỒ VÀ PHÂN QUYỀN
--
--  Chạy một lần trong Supabase → SQL Editor. Chạy lại được, không hỏng gì.
--
--  ĐIỀU QUAN TRỌNG NHẤT CỦA TỆP NÀY
--  Bản Apps Script giữ luật phân quyền trong JavaScript (_appBatBuocVai,
--  _appLocThayDoi). Luật nằm trong code nghĩa là: code sai một chữ thì luật
--  sai, và không có gì đỡ phía sau. Vụ _appHopPhamVi viết 'giữ vai trò quản lý'
--  thay vì 'quản lý' là đúng kiểu đó — app vẫn chạy, chỉ là điểm sai.
--
--  Ở đây luật nằm trong chính database. App gửi câu truy vấn nào thì Postgres
--  cũng tự cắt phần người đó không được xem, TRƯỚC KHI trả về. Nhân viên mở
--  DevTools gọi thẳng API cũng chỉ nhận được dòng của mình.
--
--  ⚠️ MỘT THAY ĐỔI VỀ QUYỀN XEM, ANH CẦN BIẾT
--  Bản cũ gửi TOÀN BỘ kho về trình duyệt rồi mới lọc bằng giao diện. Nghĩa là
--  bất kỳ nhân viên nào mở DevTools cũng đọc được mọi biên bản của mọi người.
--  Ở đây không còn như vậy nữa: mặc định mỗi người chỉ thấy sự việc của chính
--  mình và sự việc mình lập; phòng Nhân sự, Ban lãnh đạo và quản trị thấy tất.
--  Nếu nhà mình muốn quản lý thấy được cả tổ của họ thì nói em mở thêm.
-- ═══════════════════════════════════════════════════════════════════════════

create schema if not exists ttx;

-- ───────────────────────────────────────────────────────── BẢNG TRA CỨU ────
-- Giữ nguyên mã chữ của bản cũ (dp_founder, si_office, tr_comm) để mọi liên
-- kết trong dữ liệu cũ còn nguyên, khỏi phải dịch.

create table if not exists ttx.phong_ban (
  id    text primary key,
  ten   text not null
);

create table if not exists ttx.diem_lam_viec (
  id      text primary key,
  ten     text not null,
  la_quay boolean not null default false     -- isPos: có quầy bán hàng
);

create table if not exists ttx.tuyen (
  id          text primary key,
  ten         text not null,
  ngach       text[] not null default '{}',  -- chuyen_mon · quan_ly
  bo_nhom     text[] not null default '{}',  -- noGroups
  ql_cho_tat_ca boolean not null default false,
  san_sang    boolean not null default true
);

-- ────────────────────────────────────────────────────────────── NGƯỜI ──────
-- id CHÍNH LÀ id của auth.users. Không có bảng mật khẩu riêng: Supabase Auth
-- giữ mật khẩu (bcrypt), mình không bao giờ chạm vào. Đây là chỗ khác hẳn bản
-- cũ — nơi em tự viết hàm băm và đã viết sai dấu nối một lần.

create table if not exists ttx.nguoi (
  id            uuid primary key references auth.users(id) on delete cascade,
  ma            text not null unique,        -- TTX001 — mã đăng nhập
  ten           text not null,
  chuc_danh     text,
  chuc_danh_en  text,
  cap_bac       text,                        -- tra sang CAP_BAC bên file gốc
  bac           text,                        -- 'level' của bản cũ
  vai           text not null default 'staff'
                check (vai in ('staff','manager','admin')),
  phong_ban_id  text references ttx.phong_ban(id),
  diem_id       text references ttx.diem_lam_viec(id),
  tuyen_id      text references ttx.tuyen(id),
  ten_tuyen     text,
  nghe          text check (nghe in ('deaf','hearing')),
  co_diem_ban   boolean not null default false,
  hoat_dong     boolean not null default true,
  la_thu        boolean not null default false,   -- tài khoản thử, loại khỏi bảng lương
  phai_doi_mk   boolean not null default true,    -- còn dùng mật khẩu tạm
  vao_lam       timestamptz,
  id_cu         text                             -- u_TTX001, để lần vết sau khi chuyển
);

create index if not exists nguoi_ma_idx  on ttx.nguoi (ma);
create index if not exists nguoi_vai_idx on ttx.nguoi (vai) where hoat_dong;

-- ───────────────────────────────────────────────────────────── SỰ VIỆC ─────
-- Biên bản vi phạm và phiếu ghi nhận. Cùng một bảng vì chúng chỉ khác nhau ở
-- 'loai' và ở luật duyệt.

create table if not exists ttx.su_viec (
  id           text primary key,
  loai         text not null check (loai in ('vi_pham','ghi_nhan')),
  nguoi_id     uuid not null references ttx.nguoi(id),   -- subjectId: người bị/được ghi
  nguoi_lap_id uuid not null references ttx.nguoi(id),   -- reporterId
  ma_tieu_chi  text not null,                            -- critCode: C8.1
  id_tieu_chi  text,                                     -- critId
  la_ranh_gioi boolean not null default false,
  noi_dung     text not null,                            -- detail
  xay_ra_luc   timestamptz not null,
  ky           text not null,                            -- '2026-08'
  trang_thai   text not null default 'pending'
               check (trang_thai in ('pending','approved','rejected')),
  ky_ns        jsonb,          -- {by, at} chữ ký phòng Nhân sự
  ky_ql        jsonb,          -- {by, at} chữ ký quản lý
  tu_choi      jsonb,
  khieu_nai    jsonb,          -- kháng nghị của người bị lập
  tra_loi      text,
  ghi_chu      text,
  anh          jsonb not null default '[]'::jsonb,
  quyet_luc    timestamptz,    -- decidedAt
  quyet_boi    uuid references ttx.nguoi(id),
  tao_luc      timestamptz not null default now()
);

create index if not exists su_viec_nguoi_idx on ttx.su_viec (nguoi_id, ky);
create index if not exists su_viec_lap_idx   on ttx.su_viec (nguoi_lap_id);
create index if not exists su_viec_cho_idx   on ttx.su_viec (trang_thai)
  where trang_thai = 'pending';

-- ──────────────────────────────────────────────────────────── ĐÁNH GIÁ ─────

create table if not exists ttx.danh_gia (
  id             text primary key,
  nguoi_id       uuid not null references ttx.nguoi(id),  -- revieweeId
  nguoi_cham_id  uuid not null references ttx.nguoi(id),  -- reviewerId
  ky             text not null,
  diem           jsonb not null default '{}'::jsonb,      -- {critId: điểm}
  nhan_xet       text,
  ghi_chu        text,
  trang_thai     text not null default 'pending'
                 check (trang_thai in ('pending','approved','rejected')),
  quyet_luc      timestamptz,
  quyet_boi      uuid references ttx.nguoi(id),
  tao_luc        timestamptz not null default now(),
  unique (nguoi_id, nguoi_cham_id, ky)
);

-- ──────────────────────────────────────────────────────────── TIÊU CHÍ ─────
-- 360 câu của bộ câu hỏi.
--
-- Bản Apps Script đọc thẳng từ sheet 📚 Bộ câu hỏi mỗi lần app khởi động, với
-- lý do "sheet là nguồn duy nhất, chép sang chỗ khác là tạo bản thứ hai rồi
-- hai bên lệch nhau". Lý do đó đúng, nhưng cái giá là app KHÔNG CHẠY ĐƯỢC nếu
-- thiếu Apps Script — mà nhà mình muốn app đứng một mình trên Supabase.
--
-- Nên đổi cách: sheet vẫn là nơi SOẠN (vì file gốc dựng phiếu từ đó), Supabase
-- giữ bản dùng, và một mục menu trong Sheet đẩy sang mỗi khi bộ câu đổi. Chỉ
-- một chiều, không bao giờ ngược lại, nên không có chuyện hai bên cãi nhau.
-- Cột dong_bo_luc cho biết bản này lấy về lúc nào.

create table if not exists ttx.tieu_chi (
  id          text primary key,          -- c_kc_VH1_1
  ma          text not null,             -- VH1.1
  ma_nhom     text,                      -- gcode
  nhom        text,                      -- tên nhóm
  che_do      text check (che_do in ('vi_pham','ghi_nhan')),
  ten         text,                      -- name  · câu ngắn hiện trên thẻ
  noi_dung    text,                      -- text  · câu đầy đủ trong phiếu
  pham_vi     text not null default 'all',
  ngach       text,                      -- null · chuyen_mon · quan_ly
  bac         text,                      -- bậc cách làm việc câu này thuộc về
  trong_so    numeric,                   -- weight · vào thẳng công thức điểm
  tuyen_id    text,                      -- trackId · null = khung chung
  thu_tu      int,
  hoat_dong   boolean not null default true,
  dong_bo_luc timestamptz not null default now()
);

/* ⛔ SỬA 04/9/2026 — BỐN CỘT SUÝT THIẾU.
   Bản đầu của bảng này chỉ có ma, nhom, che_do, noi_dung, pham_vi, ngach,
   ten_tuyen. Nhưng đọc lại mã app thì nó dùng weight (4 chỗ), bac (5 chỗ),
   trackId (14 chỗ) và name (15 chỗ) — còn tenTuyen em bịa ra thì KHÔNG dùng
   ở đâu cả.
   Nếu nạp 360 câu vào bảng thiếu cột: trọng số mất nên công thức điểm sai,
   bậc mất, lọc theo tuyến hỏng nên ai cũng thấy đủ 360 câu, và 335 câu hiện
   ra trống chữ. App vẫn chạy, chỉ là sai — kiểu hỏng không ai phát hiện cho
   tới lúc trả lương.
   Thêm bằng ALTER để dự án đã chạy 01 lần trước đó cũng nâng được. */
alter table ttx.tieu_chi add column if not exists ten      text;
alter table ttx.tieu_chi add column if not exists bac      text;
alter table ttx.tieu_chi add column if not exists trong_so numeric;
alter table ttx.tieu_chi add column if not exists tuyen_id text;
alter table ttx.tieu_chi alter column noi_dung drop not null;

create index if not exists tieu_chi_ma_idx    on ttx.tieu_chi (ma);
create index if not exists tieu_chi_tuyen_idx on ttx.tieu_chi (tuyen_id) where hoat_dong;

-- ───────────────────────────────────────────────── THAM SỐ VÀ RANH GIỚI ────

create table if not exists ttx.tham_so (
  khoa    text primary key,
  gia_tri jsonb not null
);

create table if not exists ttx.ranh_gioi (
  khoa    text primary key,   -- 'common' hoặc mã tuyến
  muc     jsonb not null      -- mảng chuỗi
);

-- ═══════════════════════════════════════════════════════════════════════════
--  HÀM TRA VAI
--
--  ⚠️ BẮT BUỘC security definer. Chính sách RLS trên bảng ttx.nguoi mà lại đi
--  đọc ttx.nguoi thì Postgres quay vòng vô hạn rồi báo "infinite recursion
--  detected in policy". security definer cho hàm chạy vượt RLS nên cắt được
--  vòng đó.
--
--  ⚠️ BẮT BUỘC ghim search_path. Không ghim thì người dùng tự tạo một schema
--  tên 'ttx' của riêng họ, đặt trước trong search_path, và hàm security definer
--  sẽ đọc bảng giả của họ — tự phong admin trong một câu lệnh.
-- ═══════════════════════════════════════════════════════════════════════════

create or replace function ttx.toi()
returns ttx.nguoi
language sql stable security definer set search_path = ttx, pg_temp
as $$ select * from ttx.nguoi where id = auth.uid() and hoat_dong $$;

create or replace function ttx.la_admin() returns boolean
language sql stable security definer set search_path = ttx, pg_temp
as $$ select coalesce((select vai = 'admin' from ttx.nguoi
                       where id = auth.uid() and hoat_dong), false) $$;

-- Phòng Nhân sự: quản lý HOẶC quản trị, thuộc phòng có tên khớp "nhân sự".
-- Dò bằng tên y như _appLaHR bên Apps Script, để hai bên không lệch nhau.
create or replace function ttx.la_hr() returns boolean
language sql stable security definer set search_path = ttx, pg_temp
as $$
  select coalesce((
    select n.vai in ('manager','admin')
       and pb.ten ~* 'nh[âa]n s[ựu]'
    from ttx.nguoi n join ttx.phong_ban pb on pb.id = n.phong_ban_id
    where n.id = auth.uid() and n.hoat_dong
  ), false) or ttx.la_admin()
$$;

-- Ban lãnh đạo. Bản Apps Script tra CAP_BAC ở file gốc rồi lấy bậc >= 7.
-- Database không với sang file gốc được, nên danh sách cấp bậc nằm ở tham_so
-- 'cap_lanh_dao' và do bộ đồng bộ bên Apps Script ghi xuống.
-- ⚠️ So CẢ BA cột, đừng coalesce. Dữ liệu cũ ghi cấp vào 'bac' ('founder'),
-- còn bộ đồng bộ từ sheet 👥 Nhân sự sau này ghi vào 'cap_bac' bằng tiếng Việt
-- ('Trưởng phòng'). coalesce lấy cap_bac trước, nên một người vừa có cap_bac
-- tiếng Việt vừa có bac='founder' sẽ trượt — mất quyền xuất mà không hiểu vì sao.
create or replace function ttx.la_lanh_dao() returns boolean
language sql stable security definer set search_path = ttx, pg_temp
as $$
  select coalesce((
    select exists (
      select 1 from ttx.tham_so ts,
             lateral jsonb_array_elements_text(ts.gia_tri) v
      where ts.khoa = 'cap_lanh_dao'
        and v in (n.cap_bac, n.bac, n.chuc_danh)
    )
    from ttx.nguoi n where n.id = auth.uid() and n.hoat_dong
  ), false)
$$;

create or replace function ttx.duoc_xuat() returns boolean
language sql stable security definer set search_path = ttx, pg_temp
as $$ select ttx.la_hr() or ttx.la_admin() or ttx.la_lanh_dao() $$;

-- ═══════════════════════════════════════════════════════════════════════════
--  KHOÁ THÂN SỰ VIỆC
--
--  Bản Apps Script so _appChuKy(cũ) với _appChuKy(mới) rồi vứt bản mới nếu
--  khác. Ở đây làm bằng trigger, nên không có đường vòng nào: sửa thẳng bằng
--  REST, bằng SQL Editor, bằng bất cứ gì, đều dội lại.
--
--  Lý do phải khoá: một biên bản đã lập mà người lập sửa được nội dung sau khi
--  phòng Nhân sự đã duyệt thì chữ ký duyệt chẳng còn nghĩa gì.
-- ═══════════════════════════════════════════════════════════════════════════

create or replace function ttx.khoa_than_su_viec()
returns trigger language plpgsql security definer set search_path = ttx, pg_temp
as $$
begin
  if ttx.la_admin() then return new; end if;

  if new.loai         is distinct from old.loai
  or new.nguoi_id     is distinct from old.nguoi_id
  or new.nguoi_lap_id is distinct from old.nguoi_lap_id
  or new.ma_tieu_chi  is distinct from old.ma_tieu_chi
  or new.la_ranh_gioi is distinct from old.la_ranh_gioi
  or new.noi_dung     is distinct from old.noi_dung
  or new.xay_ra_luc   is distinct from old.xay_ra_luc
  or new.ky           is distinct from old.ky
  or new.tao_luc      is distinct from old.tao_luc then
    raise exception
      'Không sửa được nội dung sự việc đã lập. Muốn đổi thì thu hồi rồi lập lại.';
  end if;

  -- Người bị lập chỉ được gửi kháng nghị MỘT lần, và không đụng gì khác.
  if not ttx.la_hr() and auth.uid() = old.nguoi_id then
    if old.khieu_nai is not null and new.khieu_nai is distinct from old.khieu_nai then
      raise exception 'Đã gửi kháng nghị rồi, không sửa lại được.';
    end if;
    if new.trang_thai is distinct from old.trang_thai
    or new.ky_ns      is distinct from old.ky_ns
    or new.tu_choi    is distinct from old.tu_choi then
      raise exception 'Duyệt hay từ chối là việc của phòng Nhân sự.';
    end if;
  end if;

  return new;
end $$;

drop trigger if exists su_viec_khoa_than on ttx.su_viec;
create trigger su_viec_khoa_than before update on ttx.su_viec
  for each row execute function ttx.khoa_than_su_viec();

-- Trạng thái lúc lập do MÁY CHỦ đặt, không nhận thứ trình duyệt gửi lên:
--   vi phạm   tự duyệt ngay, người bị lập có 2 ngày làm việc để kháng nghị
--   ghi nhận  luôn chờ, chỉ phòng Nhân sự duyệt
create or replace function ttx.dat_trang_thai_dau()
returns trigger language plpgsql security definer set search_path = ttx, pg_temp
as $$
begin
  new.trang_thai := case when new.loai = 'vi_pham' then 'approved' else 'pending' end;
  new.ky_ns   := null;
  new.tu_choi := null;
  if new.ky is null or new.ky = '' then
    new.ky := to_char(new.xay_ra_luc at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM');
  end if;
  return new;
end $$;

drop trigger if exists su_viec_trang_thai_dau on ttx.su_viec;
create trigger su_viec_trang_thai_dau before insert on ttx.su_viec
  for each row execute function ttx.dat_trang_thai_dau();

-- ═══════════════════════════════════════════════════════════════════════════
--  RLS
-- ═══════════════════════════════════════════════════════════════════════════

alter table ttx.nguoi         enable row level security;
alter table ttx.su_viec       enable row level security;
alter table ttx.danh_gia      enable row level security;
alter table ttx.phong_ban     enable row level security;
alter table ttx.diem_lam_viec enable row level security;
alter table ttx.tuyen         enable row level security;
alter table ttx.tham_so       enable row level security;
alter table ttx.ranh_gioi     enable row level security;
alter table ttx.tieu_chi      enable row level security;

-- ── NGƯỜI ──
-- Ai đăng nhập cũng xem được danh bạ: phải chọn được tên khi lập biên bản.
-- Bảng này KHÔNG chứa mật khẩu, nên xem danh bạ không lộ gì.
drop policy if exists nguoi_xem on ttx.nguoi;
create policy nguoi_xem on ttx.nguoi for select to authenticated using (true);

-- Chỉ quản trị mới thêm, sửa, xoá người. Nhân viên KHÔNG tự đổi vai của mình.
drop policy if exists nguoi_sua on ttx.nguoi;
create policy nguoi_sua on ttx.nguoi for all to authenticated
  using (ttx.la_admin()) with check (ttx.la_admin());

-- ── SỰ VIỆC ──
drop policy if exists su_viec_xem on ttx.su_viec;
create policy su_viec_xem on ttx.su_viec for select to authenticated
  using (
    nguoi_id = auth.uid()          -- sự việc của chính mình
    or nguoi_lap_id = auth.uid()   -- sự việc mình lập
    or ttx.duoc_xuat()             -- phòng NS, Ban lãnh đạo, quản trị
  );

-- Lập biên bản thì phải ĐỨNG TÊN CHÍNH MÌNH, và không tự lập cho mình.
drop policy if exists su_viec_lap on ttx.su_viec;
create policy su_viec_lap on ttx.su_viec for insert to authenticated
  with check (nguoi_lap_id = auth.uid() and nguoi_id <> auth.uid());

-- Sửa: phòng Nhân sự duyệt/từ chối; người bị lập gửi kháng nghị.
-- Sửa được gì thì trigger khoa_than_su_viec chốt tiếp.
drop policy if exists su_viec_sua on ttx.su_viec;
create policy su_viec_sua on ttx.su_viec for update to authenticated
  using (ttx.la_hr() or nguoi_id = auth.uid())
  with check (ttx.la_hr() or nguoi_id = auth.uid());

drop policy if exists su_viec_xoa on ttx.su_viec;
create policy su_viec_xoa on ttx.su_viec for delete to authenticated
  using (ttx.la_admin());

-- ── ĐÁNH GIÁ ──
drop policy if exists danh_gia_xem on ttx.danh_gia;
create policy danh_gia_xem on ttx.danh_gia for select to authenticated
  using (nguoi_id = auth.uid() or nguoi_cham_id = auth.uid() or ttx.duoc_xuat());

drop policy if exists danh_gia_cham on ttx.danh_gia;
create policy danh_gia_cham on ttx.danh_gia for insert to authenticated
  with check (nguoi_cham_id = auth.uid());

drop policy if exists danh_gia_sua on ttx.danh_gia;
-- Ngoặc viết rõ: 'and' bám chặt hơn 'or', không có ngoặc thì đọc dễ nhầm
-- thành "(mình chấm) và (đang chờ hoặc là HR)" — hiểu sai một dấu ngoặc ở đây
-- là mở cửa cho người chấm sửa lại điểm sau khi đã duyệt.
create policy danh_gia_sua on ttx.danh_gia for update to authenticated
  using      ((nguoi_cham_id = auth.uid() and trang_thai = 'pending') or ttx.la_hr())
  with check ((nguoi_cham_id = auth.uid() and trang_thai = 'pending') or ttx.la_hr());

-- ── BẢNG TRA CỨU: ai cũng đọc, chỉ quản trị sửa ──
do $$
declare t text;
begin
  foreach t in array array['phong_ban','diem_lam_viec','tuyen','tham_so','ranh_gioi','tieu_chi']
  loop
    execute format('drop policy if exists %I_xem on ttx.%I', t, t);
    execute format(
      'create policy %I_xem on ttx.%I for select to authenticated using (true)', t, t);
    execute format('drop policy if exists %I_sua on ttx.%I', t, t);
    execute format(
      'create policy %I_sua on ttx.%I for all to authenticated
         using (ttx.la_admin()) with check (ttx.la_admin())', t, t);
  end loop;
end $$;

-- ── Quyền dùng schema ──
grant usage on schema ttx to authenticated;
grant select, insert, update, delete on all tables in schema ttx to authenticated;
alter default privileges in schema ttx
  grant select, insert, update, delete on tables to authenticated;

-- ⛔ Không cấp gì cho 'anon'. Chưa đăng nhập thì không đọc được một dòng nào.
revoke all on schema ttx from anon;
