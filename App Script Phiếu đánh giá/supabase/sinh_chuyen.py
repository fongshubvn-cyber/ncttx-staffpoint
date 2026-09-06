#!/usr/bin/env python3
"""Đọc DuLieu_DanhGiaNhanSu.json, sinh ra 02_chuyen_du_lieu.sql.

Chạy:  python3 sinh_chuyen.py <đường dẫn json>  >  02_chuyen_du_lieu.sql

Vì sao sinh SQL chứ không gọi thẳng API Supabase: tạo tài khoản đăng nhập qua
API phải dùng khoá service_role — khoá đi xuyên qua toàn bộ phân quyền. Sinh ra
SQL để Quán tự chạy trong SQL Editor thì khoá đó không phải rời khỏi chỗ của nó.
"""
import json, sys, hashlib, uuid

BAN = 'DuLieu_DanhGiaNhanSu.json'
MK_TAM = '123456'


def ma_uuid(ma: str) -> str:
    """UUID tính từ mã nhân viên. Cùng mã thì luôn ra cùng uuid, nên chạy lại
    bộ chuyển không đẻ ra người trùng."""
    return str(uuid.UUID(hashlib.md5(('ttx:' + ma.upper()).encode()).hexdigest()))


def q(v):
    """Một giá trị thành literal SQL."""
    if v is None or v == '':
        return 'null'
    if isinstance(v, bool):
        return 'true' if v else 'false'
    if isinstance(v, (int, float)):
        return str(v)
    if isinstance(v, (dict, list)):
        return qj(v)
    return "'" + str(v).replace("'", "''") + "'"


def qj(v):
    """Một giá trị thành literal JSONB.

    ⚠️ Phải tách khỏi q(). Bảng tham_so có cột gia_tri kiểu jsonb, mà giá trị
    trong đó gồm cả số và true/false — q() trả về 3 và true trần, Postgres từ
    chối với 'column gia_tri is of type jsonb but expression is of type integer'
    và cả tệp dừng giữa chừng. Ở đây bọc mọi thứ thành JSON rồi ép kiểu.
    """
    if v is None:
        return 'null'
    return "'" + json.dumps(v, ensure_ascii=False).replace("'", "''") + "'::jsonb"


def main():
    d = json.load(open(sys.argv[1] if len(sys.argv) > 1 else BAN, encoding='utf-8'))

    # id cũ (u_TTX001) → uuid mới
    do = {}
    for u in d['users']:
        do[u['id']] = ma_uuid(u['code'])

    def ai(old):
        return q(do[old]) + '::uuid' if old in do else 'null'

    def la_thu(u):
        return bool(u.get('demo')) or 'TEST' in str(u.get('code', '')).upper() \
            or 'test' in str(u.get('name', '')).lower()

    r = []
    P = r.append

    P("-- ═══════════════════════════════════════════════════════════════════")
    P("--  02 · CHUYỂN DỮ LIỆU CŨ SANG SUPABASE")
    P("--")
    P("--  Sinh tự động bởi sinh_chuyen.py — đừng sửa tay, sửa nguồn rồi sinh lại.")
    P(f"--  Nguồn: {len(d['users'])} người · {len(d['records'])} sự việc · "
      f"{len(d['reviews'])} kháng nghị")
    P("--")
    P("--  Chạy TOÀN BỘ tệp này một lần trong SQL Editor, sau khi 01_luoc_do.sql")
    P("--  đã chạy xong. Chạy lại lần nữa cũng không sao: mọi lệnh đều là")
    P("--  'có rồi thì bỏ qua'.")
    P("--")
    P("--  MẬT KHẨU: mọi người nhận mật khẩu tạm '" + MK_TAM + "' và app bắt đổi")
    P("--  ngay lần đăng nhập đầu. Hàm băm cũ không nhập được vào bcrypt của")
    P("--  Supabase — nhưng 31/33 người vốn vẫn đang dùng đúng mật khẩu này.")
    P("-- ═══════════════════════════════════════════════════════════════════")
    P("")
    P("begin;")
    P("")

    # ── hàm tạo tài khoản đăng nhập ─────────────────────────────────────────
    P("""-- ─────────────────────────────────────────── TẠO TÀI KHOẢN ĐĂNG NHẬP ──
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
""")

    # ── bảng tra cứu ────────────────────────────────────────────────────────
    P("-- ────────────────────────────────────────────────── BẢNG TRA CỨU ──")
    for s in d.get('depts', []):
        P(f"insert into ttx.phong_ban (id, ten) values ({q(s['id'])}, {q(s['name'])}) "
          f"on conflict (id) do update set ten = excluded.ten;")
    P("")
    for s in d.get('sites', []):
        P(f"insert into ttx.diem_lam_viec (id, ten, la_quay) values "
          f"({q(s['id'])}, {q(s['name'])}, {q(bool(s.get('isPos')))}) "
          f"on conflict (id) do update set ten = excluded.ten, la_quay = excluded.la_quay;")
    P("")
    for s in d.get('tracks', []):
        ng = '{' + ','.join('"%s"' % x for x in s.get('ngach', [])) + '}'
        bn = '{' + ','.join('"%s"' % x for x in s.get('noGroups', [])) + '}'
        P(f"insert into ttx.tuyen (id, ten, ngach, bo_nhom, ql_cho_tat_ca, san_sang) values "
          f"({q(s['id'])}, {q(s['name'])}, {q(ng)}::text[], {q(bn)}::text[], "
          f"{q(bool(s.get('qlForAll')))}, {q(bool(s.get('ready', True)))}) "
          f"on conflict (id) do update set ten = excluded.ten, ngach = excluded.ngach, "
          f"bo_nhom = excluded.bo_nhom, ql_cho_tat_ca = excluded.ql_cho_tat_ca, "
          f"san_sang = excluded.san_sang;")
    P("")

    # ── tham số ─────────────────────────────────────────────────────────────
    P("-- ─────────────────────────────────────────────────────── THAM SỐ ──")
    for k, v in (d.get('settings') or {}).items():
        P(f"insert into ttx.tham_so (khoa, gia_tri) values ({q(k)}, {qj(v)}) "
          f"on conflict (khoa) do update set gia_tri = excluded.gia_tri;")

    caps = sorted({u.get('level') for u in d['users']
                   if u.get('level') in ('founder', 'clevel')})
    P("")
    P("-- Ai là Ban lãnh đạo. Bản Apps Script tra bậc >= 7 trong CAP_BAC của file")
    P("-- gốc; database không với sang đó được nên danh sách nằm ở đây.")
    P("-- Khi nào chạy bộ đồng bộ từ sheet 👥 Nhân sự thì thêm cả tên tiếng Việt.")
    P(f"insert into ttx.tham_so (khoa, gia_tri) values ('cap_lanh_dao', {qj(caps)}) "
      f"on conflict (khoa) do update set gia_tri = excluded.gia_tri;")
    P("")
    for k, v in (d.get('boundaries') or {}).items():
        P(f"insert into ttx.ranh_gioi (khoa, muc) values ({q(k)}, {qj(v)}) "
          f"on conflict (khoa) do update set muc = excluded.muc;")
    P("")

    # ── người ───────────────────────────────────────────────────────────────
    P("-- ───────────────────────────────────────────────────────── NGƯỜI ──")
    for u in d['users']:
        uid = do[u['id']]
        email = u['code'].lower().replace(' ', '') + '@ttx.local'
        P(f"select pg_temp.ttx_tao_tk({q(uid)}::uuid, {q(email)}, {q(MK_TAM)});")
        P("insert into ttx.nguoi (id, ma, ten, chuc_danh, chuc_danh_en, cap_bac, bac,"
          " vai, phong_ban_id, diem_id, tuyen_id, ten_tuyen, nghe, co_diem_ban,"
          " hoat_dong, la_thu, phai_doi_mk, vao_lam, id_cu) values (")
        P(f"  {q(uid)}::uuid, {q(u['code'])}, {q(u.get('name'))}, {q(u.get('titleVi'))},"
          f" {q(u.get('titleEn'))}, {q(u.get('capBac'))}, {q(u.get('level'))},")
        P(f"  {q(u.get('role', 'staff'))}, {q(u.get('deptId'))}, {q(u.get('siteId'))},"
          f" {q(u.get('trackId'))}, {q(u.get('tenTuyen'))}, {q(u.get('hearing'))},"
          f" {q(bool(u.get('coDiemBan')))},")
        P(f"  {q(u.get('active', True) is not False)}, {q(la_thu(u))}, true,"
          f" {q(u.get('joinedAt'))}::timestamptz, {q(u['id'])})")
        P("on conflict (id) do update set ma = excluded.ma, ten = excluded.ten,"
          " vai = excluded.vai, phong_ban_id = excluded.phong_ban_id,"
          " diem_id = excluded.diem_id, tuyen_id = excluded.tuyen_id,"
          " hoat_dong = excluded.hoat_dong, la_thu = excluded.la_thu;")
        P("")

    # ── sự việc ─────────────────────────────────────────────────────────────
    P("-- ─────────────────────────────────────────────────────── SỰ VIỆC ──")
    P("-- ⚠️ Tắt trigger đặt trạng thái. Nó ép mọi phiếu ghi nhận mới về 'pending'")
    P("-- và xoá chữ ký phòng Nhân sự — đúng khi ai đó lập biên bản mới, nhưng")
    P("-- sẽ xoá sạch lịch sử duyệt của 7 sự việc cũ nếu để nguyên lúc chuyển.")
    P("alter table ttx.su_viec disable trigger su_viec_trang_thai_dau;")
    P("")

    def chuky(v):
        if not v or not isinstance(v, dict):
            return 'null'
        c = dict(v)
        if c.get('by') in do:
            c['by'] = do[c['by']]
        return qj(c)

    for s in d['records']:
        P("insert into ttx.su_viec (id, loai, nguoi_id, nguoi_lap_id, ma_tieu_chi,"
          " id_tieu_chi, la_ranh_gioi, noi_dung, xay_ra_luc, ky, trang_thai,"
          " ky_ns, ky_ql, tu_choi, khieu_nai, tra_loi, ghi_chu, anh,"
          " quyet_luc, quyet_boi, tao_luc) values (")
        P(f"  {q(s['id'])}, {q(s['type'])}, {ai(s['subjectId'])}, {ai(s['reporterId'])},"
          f" {q(s.get('critCode'))}, {q(s.get('critId'))}, {q(bool(s.get('isBoundary')))},")
        P(f"  {q(s.get('detail'))}, {q(s.get('xayRaLuc'))}::timestamptz,"
          f" {q(s.get('period'))}, {q(s.get('status', 'pending'))},")
        P(f"  {chuky(s.get('kyNS'))}, {chuky(s.get('kyQL'))}, {qj(s.get('tuChoi'))},"
          f" {qj(s.get('khieuNai'))}, {q(s.get('reply'))}, {q(s.get('note'))},"
          f" {qj(s.get('anh') or [])},")
        P(f"  {q(s.get('decidedAt'))}::timestamptz, {ai(s.get('decidedBy', ''))},"
          f" {q(s.get('createdAt'))}::timestamptz)")
        P("on conflict (id) do nothing;")
        P("")

    P("alter table ttx.su_viec enable trigger su_viec_trang_thai_dau;")
    P("")

    # ── đánh giá ────────────────────────────────────────────────────────────
    P("-- ────────────────────────────────────────────────────── ĐÁNH GIÁ ──")
    for s in d.get('reviews', []):
        P("insert into ttx.danh_gia (id, nguoi_id, nguoi_cham_id, ky, diem,"
          " nhan_xet, ghi_chu, trang_thai, quyet_luc, quyet_boi, tao_luc) values (")
        P(f"  {q(s['id'])}, {ai(s['revieweeId'])}, {ai(s['reviewerId'])},"
          f" {q(s.get('period'))}, {qj(s.get('scores') or {})},")
        P(f"  {q(s.get('comment'))}, {q(s.get('note'))}, {q(s.get('status', 'pending'))},"
          f" {q(s.get('decidedAt'))}::timestamptz, {ai(s.get('decidedBy', ''))},"
          f" {q(s.get('createdAt'))}::timestamptz)")
        P("on conflict (id) do nothing;")
        P("")

    P("commit;")
    P("")
    P("-- ══════════════════════════════════════════════════════ KIỂM LẠI ══")
    P("-- Bốn con số này phải khớp, không khớp thì đừng đi tiếp, báo em.")
    P("select 'người'    as thu, count(*)::text as co, "
      f"'{len(d['users'])}' as phai from ttx.nguoi")
    P("union all select 'tài khoản', count(*)::text, "
      f"'{len(d['users'])}' from auth.users where email like '%@ttx.local'")
    P("union all select 'sự việc', count(*)::text, "
      f"'{len(d['records'])}' from ttx.su_viec")
    P("union all select 'kháng nghị', count(*)::text, "
      f"'{len(d['reviews'])}' from ttx.danh_gia;")
    P("")
    P("-- Trạng thái duyệt còn nguyên chứ không bị trigger xoá:")
    P("select trang_thai, count(*) from ttx.su_viec group by 1 order by 1;")

    print('\n'.join(r))


if __name__ == '__main__':
    main()
