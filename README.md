# Đánh giá nhân sự — GitHub Pages + Google Apps Script

## Kiến trúc

```text
GitHub Pages
    |
    v
Frontend HTML/JS
    |
    v
Cloudflare Worker (CORS proxy)
    |
    v
Google Apps Script Web App /exec
    |
    v
17_API.gs
    |
    v
16 module Apps Script
    |
    +--> Google Sheets
    +--> Google Drive
```

GitHub Pages chỉ host frontend tĩnh. Worker làm lớp proxy để trình duyệt trên GitHub Pages có thể gọi Apps Script API mà không phụ thuộc vào CORS của Apps Script.

## 1. Google Apps Script

API production hiện tại:

`https://script.google.com/macros/s/AKfycbxEilyFFFjEwCPTJR4Pni7Q8lsnBtjRe8M6ivlHKI8vV5BrBASpIahl_27S2ZBb8Z0Mbw/exec`

Giữ nguyên 16 module + `17_API.gs` hiện tại.

Trước khi release production, cần test các action:

- `login`
- `me`
- `changePassword`
- `employees`
- `employee`
- `criteria`
- `result`
- `records`
- `history`
- `yearFile`
- `summary`

## 2. Cloudflare Worker

Tạo một Worker mới và dùng file:

`proxy/worker.js`

Thiết lập biến môi trường:

```text
GAS_API_URL=https://script.google.com/macros/s/AKfycbxEilyFFFjEwCPTJR4Pni7Q8lsnBtjRe8M6ivlHKI8vV5BrBASpIahl_27S2ZBb8Z0Mbw/exec
ALLOWED_ORIGIN=https://YOUR_GITHUB_USERNAME.github.io
```

Nếu repo là project site, origin vẫn là domain GitHub Pages, ví dụ:

`https://YOUR_GITHUB_USERNAME.github.io`

không thêm `/ten-repo`.

## 3. GitHub Pages

Đưa:

`app/index.html`

vào repository.

Trong file này, thay:

```js
const API_URL = "https://YOUR-WORKER.workers.dev";
```

bằng URL Worker thật.

Sau đó bật GitHub Pages từ branch/folder hoặc GitHub Actions.

## 4. Bảo mật

Không commit vào GitHub:

- Google service-account private key
- OAuth client secret
- mật khẩu Admin
- token truy cập nội bộ
- thông tin đăng nhập Google

`GAS_API_URL` không phải credential, nhưng vẫn nên đặt ở Worker environment thay vì hard-code.

## 5. Giai đoạn tiếp theo

Bản release này giải quyết **hạ tầng GitHub → API**.

Sau khi proxy chạy ổn, bước tiếp theo là thay phần DB demo của `App_TrenClaude.html` bằng dữ liệu thật:

```text
employees
employee
criteria
result
records
history
yearFile
summary
```

để Dashboard không còn lấy `seed()` / localStorage làm nguồn chính.

---

## Test nhanh

Mở DevTools → Network.

Khi login phải thấy:

```text
POST https://YOUR-WORKER.workers.dev
```

Worker chuyển tiếp tới:

```text
POST https://script.google.com/macros/s/.../exec
```

Response phải là JSON có:

```json
{
  "ok": true,
  "data": {
    "token": "...",
    "user": {}
  }
}
```
