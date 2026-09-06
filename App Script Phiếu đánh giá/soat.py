#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SOÁT BẢN CODE MỚI TRƯỚC KHI DÁN VÀO APPS SCRIPT
===============================================================================

Mỗi tháng bên viết file gốc gửi một thư mục code mới. Có thể thêm file, có thể
bớt file, có thể đổi tên hàm. Chạy script này TRƯỚC khi dán, nó nói cho biết
bản mới có phá app hay không — và phá ở đâu.

    python soat.py  <đường dẫn thư mục mới>

Ví dụ trên máy Windows:

    python soat.py  "C:\\Users\\...\\Downloads\\code thang 10"

Script KHÔNG sửa gì cả. Nó chỉ đọc và in ra. Muốn áp bản mới vào thì chạy lại
với --ap ở cuối, lúc đó nó mới thay thư mục goc/.

-------------------------------------------------------------------------------
BỐN THỨ NÓ SOI
-------------------------------------------------------------------------------

  1. FILE      thêm, mất, sửa, y nguyên
                 → file MẤT là chỗ nguy nhất: Apps Script không tự xoá, code
                   chết nằm lại và có thể đè lên hàm cùng tên của bản mới

  2. MƯỢN      16 thứ module 17 gọi sang, còn đủ trong bản mới không
                 → mất cái nào thì app gãy im lặng, vẫn mở được, chỉ sai số

  3. ĐỤNG      tên hàm bản mới trùng với tên trong app/
                 → Apps Script chỉ giữ bản khai sau cùng và không báo lỗi

  4. CỬA WEB   bản mới có doGet hay doPost không
                 → một dự án chỉ chạy được một doGet, hai bên phải gộp
"""

import sys, os, re, hashlib, shutil, difflib

HERE = os.path.dirname(os.path.abspath(__file__))
GOC  = os.path.join(HERE, 'goc')
APP  = os.path.join(HERE, 'app')

# Những thứ module 17 gọi sang 01–16. Giữ khớp với APP_MUON trong 17_App.gs.
MUON = [
    ('CFG',            '01_Code.gs',          'tên các sheet'),
    ('VERSION',        '01_Code.gs',          'số phiên bản'),
    ('_ss',            '01_Code.gs',          'bảng tính hiện hành'),
    ('_ui',            '01_Code.gs',          'giao diện menu'),
    ('CAP_BAC',        '03_DuLieuTuyen.gs',   'thang 11 cấp bậc'),
    ('TUYEN',          '03_DuLieuTuyen.gs',   'danh mục tuyến'),
    ('_traCap',        '03_DuLieuTuyen.gs',   'tên cấp thành bậc và ngạch'),
    ('_chuanTenTuyen', '03_DuLieuTuyen.gs',   'chuẩn hoá tên tuyến'),
    ('_macDinh',       '06_Phieu.gs',         'điểm khởi đầu 5 hoặc 0'),
    ('PC',             '06_Phieu.gs',         'sơ đồ cột phiếu chấm'),
    ('_thuMucGoc',     '07_XuatDrive.gs',     'thư mục Đánh giá trên Drive'),
    ('_thuMucCon',     '07_XuatDrive.gs',     'tạo hoặc lấy thư mục con'),
    ('NS',             '10_NhanSu.gs',        'sơ đồ cột sheet Nhân sự'),
    ('_traNhanSu',     '10_NhanSu.gs',        'một nhân sự theo mã'),
    ('BCH',            '16_BoCauHoiSheet.gs', 'sơ đồ sheet Bộ câu hỏi'),
    ('_docBoCauHoi',   '16_BoCauHoiSheet.gs', 'đọc toàn bộ bộ câu hỏi'),
]

KHAI = re.compile(r'^(?:const|let|var|function)\s+([A-Za-z_$][\w$]*)', re.M)


def doc(p):
    with open(p, encoding='utf-8-sig') as f:
        return f.read()


def cac_gs(thu_muc):
    """Mọi file .gs và .html trong thư mục, không đệ quy."""
    if not os.path.isdir(thu_muc):
        return {}
    ra = {}
    for t in sorted(os.listdir(thu_muc)):
        if t.lower().endswith(('.gs', '.html', '.js')):
            ra[t] = doc(os.path.join(thu_muc, t))
    return ra


def bam(s):
    return hashlib.sha1(s.replace('\r\n', '\n').encode('utf-8')).hexdigest()[:10]


def ten_khai(noi_dung):
    return set(KHAI.findall(noi_dung))


def khung(tieu_de):
    print()
    print('─' * 74)
    print('  ' + tieu_de)
    print('─' * 74)


def main():
    tham_so = [a for a in sys.argv[1:] if not a.startswith('--')]
    ap = '--ap' in sys.argv

    if not tham_so:
        print(__doc__)
        print('Thiếu đường dẫn thư mục mới.')
        return 2

    moi_dir = tham_so[0].strip('"').strip("'")
    if not os.path.isdir(moi_dir):
        print('Không thấy thư mục: ' + moi_dir)
        return 2

    cu  = cac_gs(GOC)
    moi = cac_gs(moi_dir)
    app = cac_gs(APP)

    if not cu:
        print('Thư mục goc/ đang trống. Lần đầu thì chép 16 file vào đó trước.')
        return 2
    if not moi:
        print('Thư mục mới không có file .gs nào. Kiểm lại đường dẫn.')
        return 2

    print()
    print('╔' + '═' * 72 + '╗')
    print('║  SOÁT BẢN CODE MỚI' + ' ' * 53 + '║')
    print('╚' + '═' * 72 + '╝')
    print('  đang có   goc/  ' + str(len(cu)) + ' file')
    print('  bản mới   ' + os.path.basename(moi_dir.rstrip('/\\'))[:40] +
          '  ' + str(len(moi)) + ' file')
    print('  của app   app/  ' + str(len(app)) + ' file  (không đụng tới)')

    loi, canh, viec = [], [], []

    # ── 1. FILE ─────────────────────────────────────────────────────────
    khung('1. FILE  ·  thêm, mất, sửa')

    them = [t for t in moi if t not in cu]
    mat  = [t for t in cu  if t not in moi]
    doi  = [t for t in cu  if t in moi and bam(cu[t]) != bam(moi[t])]
    yen  = [t for t in cu  if t in moi and bam(cu[t]) == bam(moi[t])]

    for t in them:
        n = len(moi[t].splitlines())
        print('  + THÊM   ' + t.ljust(26) + str(n) + ' dòng')
        viec.append('Tạo file mới "' + t + '" trong Apps Script rồi dán nội dung')
    for t in mat:
        print('  - MẤT    ' + t.ljust(26) + 'bản mới không còn file này')
        loi.append('File "' + t + '" bị bỏ. PHẢI XOÁ nó khỏi Apps Script bằng tay '
                   '— Apps Script không tự xoá, code chết nằm lại sẽ đè lên hàm '
                   'cùng tên của bản mới.')
        viec.append('XOÁ file "' + t + '" khỏi Apps Script')
    for t in doi:
        a = cu[t].splitlines()
        b = moi[t].splitlines()
        d = list(difflib.unified_diff(a, b, n=0))
        cong = sum(1 for x in d if x.startswith('+') and not x.startswith('+++'))
        tru  = sum(1 for x in d if x.startswith('-') and not x.startswith('---'))
        print('  ~ SỬA    ' + t.ljust(26) + '+' + str(cong) + ' / -' + str(tru) + ' dòng')
        viec.append('Dán đè "' + t + '"')
    if yen:
        print('  = Y NGUYÊN ' + str(len(yen)) + ' file, không phải dán lại')
    if not (them or mat or doi):
        print('  Bản mới giống hệt bản đang có. Không phải làm gì.')

    # ── 2. MƯỢN ─────────────────────────────────────────────────────────
    khung('2. MƯỢN  ·  16 thứ module 17 gọi sang, còn đủ không')

    tat_ca_moi = '\n'.join(moi.values())
    o_dau = {}
    for t, s in moi.items():
        for n in ten_khai(s):
            o_dau.setdefault(n, []).append(t)

    thieu = []
    for ten, file_cu, viec_gi in MUON:
        noi = o_dau.get(ten)
        if not noi:
            print('  ❌ ' + ten.ljust(17) + 'MẤT   (trước ở ' + file_cu + ' — ' + viec_gi + ')')
            thieu.append(ten)
            loi.append('Bản mới không còn "' + ten + '", vốn ở ' + file_cu +
                       ' và app dùng để ' + viec_gi + '.')
        elif noi[0] != file_cu:
            print('  ⚠️ ' + ten.ljust(17) + 'CHUYỂN sang ' + noi[0])
            canh.append('"' + ten + '" chuyển từ ' + file_cu + ' sang ' + noi[0] +
                        '. App vẫn chạy, nhưng sửa lại chú thích trong 17_App.gs cho khỏi lạc.')
        else:
            print('  ✅ ' + ten.ljust(17) + noi[0])

    if not thieu:
        print()
        print('  Cả 16 thứ đều còn. App không phải sửa dòng nào.')

    # ── 3. ĐỤNG ─────────────────────────────────────────────────────────
    khung('3. ĐỤNG  ·  tên bản mới trùng với tên trong app/')

    ten_app = set()
    for s in app.values():
        ten_app |= ten_khai(s)
    ten_moi = set(o_dau.keys())
    trung = sorted(ten_app & ten_moi)

    if trung:
        for n in trung:
            print('  ❌ ' + n.ljust(22) + 'có ở cả ' + o_dau[n][0] + ' và app/')
            loi.append('Tên "' + n + '" có ở cả hai bên. Apps Script chỉ giữ bản '
                       'khai sau cùng và KHÔNG báo lỗi. Đổi tên bên app.')
    else:
        print('  ✅ Không trùng tên nào.')
        print('     ' + str(len(ten_moi)) + ' tên bản mới  ·  ' +
              str(len(ten_app)) + ' tên của app')

    # ── 4. CHIẾM TÊN FILE ───────────────────────────────────────────────
    khung('4. TÊN FILE  ·  bản mới có chiếm chỗ của app không')

    de = sorted(set(moi) & set(app))
    if de:
        for t in de:
            print('  ❌ ' + t.ljust(24) + 'bản mới có file trùng tên với app')
            loi.append('Bản mới có file "' + t + '" trùng tên với file của app. '
                       'Dán vào là mất app. Đổi tên một bên trước khi dán.')
    else:
        print('  ✅ Không file nào của bản mới trùng tên với app/.')
        print('     App dùng tiền tố "App_" không mang số, nên bên kia có mở rộng')
        print('     lên 17, 18, 20 file cũng không giành chỗ.')

    # ── 5. CỬA WEB ──────────────────────────────────────────────────────
    khung('5. CỬA WEB  ·  doGet và doPost')

    for cua in ('doGet', 'doPost'):
        ben_moi = o_dau.get(cua)
        ben_app = [t for t, s in app.items() if cua in ten_khai(s)]
        if ben_moi and ben_app:
            print('  ❌ ' + cua + '  có ở cả ' + ben_moi[0] + ' và ' + ben_app[0])
            loi.append('Cả hai bên đều khai ' + cua + '. Một dự án chỉ chạy được '
                       'một cái. Hai bên phải ngồi lại gộp làm một.')
        elif ben_moi:
            print('  ⚠️ ' + cua + '  bản mới có, app không. Bản mới sẽ chiếm cửa web.')
            canh.append('Bản mới thêm ' + cua + '. Nếu app cần cửa web thì phải gộp.')
        elif ben_app:
            print('  ✅ ' + cua + '  chỉ app có. Không đụng ai.')
        else:
            print('  ·  ' + cua + '  không bên nào có.')

    # ── KẾT ─────────────────────────────────────────────────────────────
    khung('KẾT')

    if not loi and not canh:
        print('  ✅ Bản mới không phá gì. Dán vào là dùng tiếp được ngay.')
    else:
        for x in loi:
            print('  ❌ ' + x)
            print()
        for x in canh:
            print('  ⚠️ ' + x)
            print()

    if viec:
        print()
        print('  VIỆC PHẢI LÀM TRONG APPS SCRIPT, theo thứ tự:')
        for i, v in enumerate(viec, 1):
            print('    ' + str(i).rjust(2) + '. ' + v)
        print('    ' + str(len(viec) + 1).rjust(2) +
              '. Chạy appSoatTuongThich trong Apps Script để soát lần cuối')
        print()
        print('  ⛔ Đừng xoá cả dự án rồi dán lại. Thay từng file theo tên.')
        print('     Dán xong phải còn ' + str(len(moi) + len(app)) +
              ' file, gồm ' + str(len(app)) + ' file của app.')

    # ── ÁP ──────────────────────────────────────────────────────────────
    if ap:
        if loi:
            print()
            print('  ⛔ Còn lỗi ở trên, chưa áp. Xử xong rồi chạy lại với --ap.')
            return 1
        luu = os.path.join(HERE, '_goc_cu')
        if os.path.isdir(luu):
            shutil.rmtree(luu)
        shutil.copytree(GOC, luu)
        shutil.rmtree(GOC)
        os.makedirs(GOC)
        for t, s in moi.items():
            with open(os.path.join(GOC, t), 'w', encoding='utf-8') as f:
                f.write(s)
        print()
        print('  ✅ Đã thay goc/ bằng bản mới. Bản cũ để ở _goc_cu/ phòng khi cần lùi.')
        print('     app/ không bị đụng tới.')
    elif them or mat or doi:
        print()
        print('  Xem xong thấy ổn thì chạy lại với --ap ở cuối để thay goc/.')

    print()
    return 1 if loi else 0


if __name__ == '__main__':
    sys.exit(main())
