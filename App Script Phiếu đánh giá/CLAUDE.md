# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Ngôn ngữ

**Toàn bộ dự án dùng tiếng Việt** — tên biến, tên hàm, chú thích, thông báo lỗi,
giao diện. Đừng đặt tên hàm mới bằng tiếng Anh; nhìn `_appBatBuocVai`,
`sangApp`, `khongDoi` để thấy quy ước.

Người dùng là **Phong**, xưng "anh", gọi trợ lý là "em". Trả lời bằng tiếng Việt.

## Bối cảnh

Ứng dụng đánh giá nhân sự nội bộ của **Nhà Của Thời Thanh Xuân** — doanh nghiệp
xã hội, khoảng 33 nhân sự, phần lớn là người Điếc. Dữ liệu là tên thật, chức
danh thật, và **nội dung biên bản kỷ luật về từng cá nhân**. Mọi quyết định về
quyền xem phải cân nhắc điều đó.

## Kiến trúc: đang chuyển nhà, ba bản cùng tồn tại

| Bản | Tệp | Kho dữ liệu | Trạng thái |
|---|---|---|---|
| Cũ, đang chạy | `docs/index.html` | JSON trên Drive qua Apps Script | Bản thật, nhà đang dùng |
| Mới | `TTX-App-DanhGia/index.html` | Supabase (Postgres + RLS) | Đang dựng, chạy song song |
| Artifact | trên claude.ai | Kho chung của Artifact | **Giống `docs/index.html` từng byte** |

Ba kho **không tự chảy sang nhau**. Chuyển phải qua tệp SQL trong `supabase/`.

App là **một tệp HTML duy nhất** (~6900 dòng): giao diện, thuật toán tính điểm,
lọc câu theo tuyến/ngạch, bốn kiểu xuất Excel, kho ảnh. Đừng tách ra nhiều tệp.

### Lớp lưu trữ

`Storage` trong `index.html` có bốn đường, thử theo thứ tự:
`supabase` → `mayChu` (Apps Script) → `chung` (kho Artifact) → `local`.
Đường nào có cấu hình thì đi đường đó và **không rơi xuống đường dưới** — rơi
xuống nghĩa là người dùng thấy dữ liệu cũ của máy mình mà tưởng là mới.

### Bộ nối Supabase

`supabase/kho_supabase.js` được **nhúng thẳng** vào `TTX-App-DanhGia/index.html`.
Sửa tệp nguồn rồi nhúng lại, đừng sửa bản đã nhúng.

App viết quanh một object `db` khổng lồ; Supabase là bảng và dòng. Bộ nối:
- `tai()` đọc 8 bảng rồi lắp lại thành đúng `db` app quen dùng
- `ghi()` **so với bản chụp lúc tải, chỉ viết thứ đã đổi**

⛔ Không bao giờ ghi đè cả kho như đường Apps Script. RLS chỉ trả về phần của
từng người, nên `db` trong tay một nhân viên **không chứa** biên bản người khác.
Ghi đè là xoá sạch những gì họ không được thấy.

## Ranh giới không được vượt

**`goc/` là 16 module của bên thứ ba.** Họ gửi bản mới hàng tháng, có thể thêm
hoặc bớt tệp. **Tuyệt đối không sửa một dòng nào trong đó.**
`app/App_MayChu.gs` chỉ được *mượn* 16 tên đã khai trong hằng `APP_MUON`.

Trước khi áp bản mới của họ, chạy `soat.py` — nó soi tệp thêm/mất/đổi, 16 tên
mượn còn đủ không, tên hàm có đụng nhau không, và có `doGet`/`doPost` không.

**Không bao giờ commit dữ liệu.** `.gitignore` đã chặn
`DuLieu_DanhGiaNhanSu.json`, `NhapVao.json`, `SaoLuu_*.json`, `*.xlsx`.
Chúng chứa mật khẩu đã băm của 33 người thật và nội dung biên bản.
GitHub Pages bản miễn phí **bắt repo phải public** — đó là lý do phải canh.

## Luật nghiệp vụ — Phong đã chốt, đừng tự đổi

- **Biên bản vi phạm**: tự duyệt ngay khi lập. Không qua ai.
- **Phiếu ghi nhận**: luôn chờ, **chỉ phòng Nhân sự** duyệt.
- **Kháng nghị**: 2 ngày làm việc kể từ lúc lập, gửi **một lần**, hết hạn là khoá.
- **Quyền xuất kết quả**: quản lý phòng Nhân sự trở lên (gồm Ban lãnh đạo, quản trị).
- **Ảnh trên Drive luôn riêng tư** — không bao giờ `ANYONE_WITH_LINK`.
- Người lập biên bản phải **đứng tên chính mình**, và không tự lập cho mình.

Trạng thái duyệt do **máy chủ** đặt, không nhận thứ trình duyệt gửi lên.

## Lệnh

```bash
# Ba bộ kiểm thử, chạy trên Postgres 18 thật (PGlite/WASM, không cần cài gì)
cd supabase && npm install @electric-sql/pglite   # lần đầu
node thu_chuyen.mjs    # 32 phép · lược đồ + chuyển dữ liệu + bộ câu hỏi
node thu_rls.mjs       # 28 phép · thử vượt quyền
node thu_kho.mjs       # 24 phép · bộ nối, dùng client giả

# Sinh lại tệp chuyển dữ liệu sau khi sửa nguồn
python3 supabase/sinh_chuyen.py <đường-dẫn.json> > supabase/02_chuyen_du_lieu.sql

# Soi bản mới của bên thứ ba trước khi áp
python3 soat.py <thư-mục-bản-mới>          # chỉ xem
python3 soat.py <thư-mục-bản-mới> --ap     # áp, giữ bản cũ ở _goc_cu/

# Kiểm cú pháp app sau khi sửa
node -e "const h=require('fs').readFileSync('TTX-App-DanhGia/index.html','utf8');
         new Function(h.match(/<script>([\s\S]*)<\/script>/)[1]); console.log('ok')"
```

Thứ tự chạy SQL trên Supabase: `01_luoc_do.sql` → **mở Exposed schemas cho
`ttx`** → `02_chuyen_du_lieu.sql` → `03_tieu_chi.sql`.

## Bẫy đã sụp — đừng sụp lại

Mỗi mục dưới đây là một lỗi thật đã xảy ra trong dự án này. Phần lớn **không
báo lỗi** — app vẫn chạy, chỉ là sai.

**Kiểu im lặng, nguy nhất**

1. **Bản chụp giữ tham chiếu thay vì bản sao.** App sửa thẳng vào chính mảng
   `db`, nên bản chụp đổi theo và hàm so sánh luôn thấy "không có gì đổi".
   Phòng Nhân sự bấm duyệt, màn hình báo đã lưu, database không nhận gì.
   → Mọi bản chụp phải `JSON.parse(JSON.stringify(...))`.
2. **Bảng thiếu cột mà app thật sự đọc.** `tieu_chi` từng thiếu `weight`,
   `bac`, `trackId`, `name` — điểm sai, lọc tuyến hỏng, 335 câu trống chữ.
   → Trước khi thiết kế bảng, **grep trong `index.html`** xem app đọc trường nào.
3. **Băm mật khẩu lệch dấu nối.** Máy chủ dùng `muối + '|' + mk`, trình duyệt
   dùng `muối + '::' + mk`. Chú thích ghi "giống hệt" mà số thì không.
   → Nguồn đúng là giao diện, vì mật khẩu thật đã băm theo nó.
4. **Textarea nuốt một dòng trống đầu** → 318 dòng dán vào trả về 317, lệch
   điểm cả cột. Gán `.value` bằng JS thay vì để trong HTML.
5. **.xlsx nhớ kết quả công thức cũ.** Điền 4 khắp nơi vẫn hiện 4.17.
   → `fullCalcOnLoad = true` và xoá kết quả đã lưu.

**Supabase / Postgres**

6. **Schema `ttx` không lộ qua API mặc định.** SQL Editor chạy ngon, app báo
   không tìm thấy bảng. → Project Settings → API → Exposed schemas → thêm `ttx`.
7. **Thiếu dòng `auth.identities`** → tài khoản hiện trong bảng điều khiển mà
   đăng nhập luôn báo sai mật khẩu, không gì chỉ ra nguyên nhân.
8. **Trigger `dat_trang_thai_dau` xoá lịch sử duyệt** khi chuyển dữ liệu cũ.
   → Tắt trigger trong lúc chuyển, bật lại sau.
9. **Cột `jsonb` không nhận số trần.** `gia_tri` nhận `3` thì cả tệp dừng giữa
   chừng. → Bọc thành `'3'::jsonb`.
10. **`security definer` là bắt buộc** cho hàm tra vai, không thì luật trên
    `nguoi` đi đọc `nguoi` → đệ quy vô hạn. Và **phải ghim `search_path`**,
    không thì người dùng tạo schema `ttx` giả để tự phong quyền.
11. **REST của Supabase đòi cả `apikey` lẫn `Authorization: Bearer`.** Thiếu
    một là 401. Địa chỉ phải có `/rest/v1/` ở cuối, không thì 404.
12. **`la_lanh_dao` phải so cả ba cột**, đừng `coalesce` — dữ liệu cũ ghi cấp
    vào `bac`, bộ đồng bộ từ Sheet ghi vào `cap_bac` bằng tiếng Việt.

**Apps Script**

13. **`/exec` chạy bản đã triển khai**, không phải code trong trình soạn thảo.
    Sửa xong phải tạo phiên bản triển khai mới.
14. **POST phải `Content-Type: text/plain`.** `application/json` gây preflight
    OPTIONS mà Apps Script không trả lời — lỗi hiện ra là "network error".
15. Hàm giữ thức Supabase phải để ở **dự án Apps Script riêng**, không chung
    với script gắn Sheet — chỗ đó tháng nào cũng bị thay tệp.

**Nền tảng**

16. **Vercel Hobby cấm dùng cho việc kinh doanh**, thực thi bằng khoá dự án.
    Dùng **Cloudflare Pages** (cho phép, không bắt repo public).
17. Kho chung của Artifact trả về **object đóng băng** — phải chép ra trước khi
    app sửa vào.
18. CDN được phép: `cdnjs.cloudflare.com`, `cdn.jsdelivr.net/npm/`,
    `cdn.tailwindcss.com`, `code.jquery.com`. Khác là bị chặn im lặng.

## Viết bài thử cho đúng

**RLS lọc DÒNG, không ném lỗi.** Một câu `update` trúng 0 dòng vẫn báo thành
công. Bài thử hỏi "có báo lỗi không" sẽ báo đạt trong khi luật thì sai — hoặc
báo hỏng trong khi luật thì đúng.

→ Với mọi phép thử "phải bị chặn": **đọc lại dữ liệu và hỏi "có đổi không"**,
đừng hỏi "có lỗi không". Xem hàm `khongDoi()` trong `thu_rls.mjs`.

Ba lần trong dự án này bài thử báo hỏng mà lỗi nằm ở chính bài thử, không ở
sản phẩm. Khi một phép thử hỏng, **kiểm kỳ vọng trước khi sửa code**.

## Cách làm việc Phong mong đợi

- **Đo rồi hãy nói.** Chạy thật trên dữ liệu thật, dẫn số. Đừng khẳng định
  điều chưa kiểm.
- **Nói thẳng khi lỗi là của mình**, và nói rõ nó sẽ gây ra chuyện gì nếu
  không bắt được.
- **Đừng tự đổi luật nghiệp vụ.** Hỏi.
- Việc nào chưa xong thì nói là chưa xong, đừng để lẫn vào phần đã xong.

## Chưa xong

- **Ảnh trên bản Supabase.** `luuAnh`/`docAnh` vẫn gọi Apps Script; đường đó
  chưa nối. Hiện chưa ảnh hưởng ai vì 7 sự việc đang có đều không kèm ảnh.
- **Bộ đồng bộ Sheet → Supabase** (bộ câu hỏi, nhân sự) chưa viết.
- **Xuất phiếu vào file năm** vẫn phải qua Apps Script — thao tác trên chính
  Google Sheet, Supabase không làm được.
- 23–25 trên 31–33 người **chưa gắn tuyến**, nên chỉ khung chung áp dụng.
- App thiếu tiêu chí **RG** (ranh giới) và **BM** (bảo mật) → mục I và VII của
  phiếu để trống.
- 8 câu phiếu có mà app không có: `NL1.7–NL1.10`, `TC3.6–TC3.8`, và một câu nữa.
- Chưa thống nhất mã nhân viên với HR: `TTX001` hay `THU-01`.
