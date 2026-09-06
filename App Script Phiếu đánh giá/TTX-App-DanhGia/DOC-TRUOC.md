# TTX · App đánh giá nhân sự — bản Supabase

Bản mới, đọc ghi thẳng vào Supabase. Bản cũ ở `docs/` vẫn chạy vào Drive qua
Apps Script — hai bản chạy song song, chỉ cắt khi anh đã thử hết một kỳ.

## Trong thư mục này

| Tệp | Là gì | Chạy ở đâu |
|---|---|---|
| `index.html` | **Toàn bộ app** — 196 hàm, 6 màn hình | Cloudflare Pages |
| `01_luoc_do.sql` | 9 bảng + 21 luật phân quyền | Supabase → SQL Editor |
| `02_chuyen_du_lieu.sql` | 33 người, 7 sự việc, 2 kháng nghị | Supabase → SQL Editor |
| `03_tieu_chi.sql` | 360 câu hỏi | Supabase → SQL Editor |
| `ttx_giu_thuc.gs` | Giữ dự án Supabase khỏi ngủ | Apps Script riêng |

`index.html` **không phải chỉ giao diện**. Nó chứa cả thuật toán tính điểm,
lọc câu theo tuyến và ngạch, bốn kiểu xuất file, ExcelJS, kho ảnh trong máy.
App một tệp, cố ý vậy.

## Thứ tự làm, đừng đảo

1. Chạy `01_luoc_do.sql`
2. **Project Settings → API → Exposed schemas → thêm `ttx`**
   Bỏ bước này thì SQL Editor vẫn chạy ngon mà app báo không tìm thấy bảng.
3. Chạy `02_chuyen_du_lieu.sql` — kiểm 4 con số ở cuối tệp
4. Chạy `03_tieu_chi.sql` — kiểm 5 con số ở cuối tệp
5. Đưa `index.html` lên Cloudflare Pages (Upload assets, kéo thả)

## Đăng nhập

Vẫn bằng **mã nhân viên** (`TTX001`), không phải email. App tự gắn `@ttx.local`
phía sau, người dùng không thấy gì khác. Mật khẩu tạm `123456`, bắt đổi lần đầu.

## ⚠️ Một việc CHƯA xong: ảnh

Phần gửi và xem ảnh vẫn gọi Apps Script (2 chỗ trong mã). Trên bản Supabase
đường đó chưa nối, nên **đính ảnh vào biên bản sẽ lỗi**.

Hiện chưa ảnh hưởng ai: cả 7 sự việc đang có đều không kèm ảnh nào. Nhưng phải
làm trước khi anh chị em dùng thật. Hai đường:

- **Supabase Storage** — đúng ý "tất cả trên một nền tảng", nhưng bản miễn phí
  giới hạn 1 GB
- **Giữ một cửa Apps Script ~80 dòng** — Drive rộng hơn, giữ được cây thư mục
  `[mã] - [tên]` mà anh đã thiết kế

## Về khoá nằm công khai trong `index.html`

Đó là khoá `anon`, để công khai là **đúng thiết kế** — nó không tự mở được gì.
Thứ giữ cửa là luật RLS: mỗi câu truy vấn đều bị Postgres cắt lại theo người
đang hỏi, trước khi trả về.

Khoá `service_role` thì đi xuyên qua toàn bộ phân quyền.
**Tuyệt đối không đưa vào tệp này, không gửi cho ai.**

## Khác gì bản cũ

- Nhân viên chỉ tải về đúng phần của mình. Bản cũ gửi cả kho về trình duyệt,
  ai mở DevTools cũng đọc được biên bản của mọi người.
- Không sửa được nội dung biên bản đã lập — database chặn, không phải giao diện.
- Kháng nghị chỉ gửi được một lần.
- Trạng thái duyệt do database đặt, không nghe theo thứ trình duyệt gửi lên.

## Đã kiểm tới đâu

Chạy trên Postgres 18 thật, không phải mô phỏng:

- **32/32** phép thử lược đồ và chuyển dữ liệu
- **28/28** phép thử vượt quyền — mọi đường lách đều bị chặn
- **24/24** phép thử bộ nối Supabase

Chạy lại: `cd supabase && node thu_chuyen.mjs && node thu_rls.mjs && node thu_kho.mjs`
