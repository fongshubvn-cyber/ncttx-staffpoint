---
name: ncttx-staffpoint-guide
description: Hướng dẫn quản trị, cấu hình và triển khai ứng dụng "Ghi nhận phản hồi nhân sự - Nhà Của Thời Thanh Xuân" (StaffPoint v1.001+).
---

# Hướng Dẫn Quản Trị & Triển Khai Ứng Dụng "Ghi Nhận Phản Hồi Nhân Sự NCTTX"

## 0. Quy Tắc Quản Lý Phiên Bản (Versioning Convention)
- **Quy tắc phiên bản**: Đánh số phiên bản hệ thống bắt đầu bằng **`v1.001`**, tăng dần theo từng bản phát hành/cập nhật hoàn thành (`v1.002`, `v1.003`...).
- **Hiển thị phiên bản**: Đã hiển thị nhãn phiên bản chuẩn trên logo thương hiệu ứng dụng (`Navbar.tsx` & `Option1Layout.tsx`) và file `package.json`.

## 1. Tổng Quan Hệ Thống (Phiên Bản Hiện Tại: v1.001)
Ứng dụng **Ghi nhận phản hồi nhân sự** (Phát triển bởi Nhà Của Thời Thanh Xuân) là ứng dụng Single Page Application (SPA) xây dựng trên nền tảng **React 18 + Vite + TypeScript + TailwindCSS**.

### Key Features:
- **Tài khoản & Quản lý Mật khẩu Admin (mới ở v1.001)**:
  - `admin` (Mật khẩu mặc định: `123456A!`): Quản trị viên tối cao Toàn quyền xem và kiểm soát tất cả 29 nhân sự & ngạch phòng ban.
  - **Quản Lý Mật Khẩu Admin (`AdminPasswordModal.tsx`)**: Cho phép Admin xem, tìm kiếm, chỉnh sửa mật khẩu của bất kỳ thành viên nào trong hệ thống.
  - **Reset Mật Khẩu Hàng Loạt**: Admin có nút `🔄 Reset Tất Cả Về 123456` đưa toàn bộ tài khoản về mật khẩu mặc định.
  - **Yêu cầu Đổi Mật Khẩu Lần Đầu**: Hệ thống tự động chặn truy cập và buộc thành viên phải đặt mật khẩu mới khi đăng nhập bằng mật khẩu mặc định `123456`.
- **Cơ Chế Firebase Cloud Realtime Sync & Nút Làm Mới (mới ở v1.001)**:
  - **Single Source of Truth**: Cloud Firestore là nguồn dữ liệu chuẩn duy nhất (loại bỏ hoàn toàn cơ chế gộp `localStorage` cũ lên Cloud làm quay lại dữ liệu cũ).
  - **Nút `🔄 Làm Mới Cloud`**: Đã trang bị trên Header và trang Tổng quan giúp kéo dữ liệu chuẩn từ Firestore bất cứ lúc nào.
- **Phân quyền ngạch phòng ban**: Nhân viên ngạch nào chỉ thấy ma trận tiêu chí của ngạch đó (E-Commerce, Pha chế, Sản xuất, Kho & Đóng gói, Kế Toán, Thương mại & Dịch vụ, C-Level, Founder).
- **Quản lý phiếu khen thưởng & vi phạm**:
  - Tự động lưu thời gian Realtime (ngày, giờ, phút, giây).
  - Cho phép đính kèm minh chứng hình ảnh dưới 10MB.
  - Cơ chế kháng nghị 48 giờ trực tiếp lên Trưởng phòng Nhân sự (`TTX005` - Trần Thị Thanh Hải).
- **Báo cáo Realtime & PDF**:
  - Báo cáo tổng điểm, bậc lương P2 (Bậc 1 ➔ Bậc 5).
  - Chi tiết lịch sử lỗi vi phạm & tuyên dương của 1 nhân sự.
  - Xuất báo cáo PDF / In ấn chuẩn khổ A4.

---

## 2. Hướng Dẫn Triển Khai Online (Deploy Web App)

Ứng dụng được đóng gói tĩnh (**Static SPA**) vào thư mục `dist/` khi chạy lệnh `npm run build`. Bạn có thể triển khai online cực kỳ dễ dàng qua các cách sau:

### Cách 1: Triển Khai Miễn Phí Qua Vercel (Khuyên Dùng - Nhanh Nhất 🚀)
1. Đưa mã nguồn ứng dụng lên **GitHub** (hoặc GitLab / Bitbucket).
2. Đăng nhập vào [Vercel.com](https://vercel.com) bằng tài khoản GitHub.
3. Bấm **"Add New Project"** ➔ Chọn Repository `ncttx-staffpoint`.
4. Cấu hình Build:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Bấm **Deploy**. Vercel sẽ cấp cho bạn một đường dẫn (URL) HTTPS miễn phí (dạng `https://ncttx-staffpoint.vercel.app`) để truy cập ngay từ điện thoại.

*(Hoặc dùng Vercel CLI trong terminal: `npx vercel`)*

---

### Cách 2: Triển Khai Qua Netlify (Miễn Phí)
1. Truy cập [Netlify.com](https://netlify.com) ➔ Đăng nhập.
2. Bấm **"Add new site"** ➔ **"Import an existing project"** ➔ Chọn GitHub repo.
3. Nhập cấu hình:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Bấm **"Deploy site"**.

---

### Cách 3: Triển Khai Lên Máy Chủ / Tên Miền Riêng (Private VPS / Nginx)
Nếu bạn có Server / VPS riêng (Ubuntu / CentOS) hoặc Tên miền công ty (ví dụ: `nhansu.nhacuathoithanhxuan.com`):
1. Chạy lệnh đóng gói trên máy:
   ```bash
   npm run build
   ```
2. Upload toàn bộ nội dung bên trong thư mục `dist/` lên thư mục root của web server (ví dụ: `/var/www/ncttx-staffpoint`).
3. Cấu hình Nginx file `nginx.conf`:
   ```nginx
   server {
       listen 80;
       server_name nhansu.nhacuathoithanhxuan.com;

       root /var/www/ncttx-staffpoint;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```
4. Kích hoạt SSL miễn phí qua Certbot: `sudo certbot --nginx`.

---

## 3. Quản Lý Dữ Liệu & Bảo Trì
- **Dữ liệu hiện tại**: Đã được nạp sẵn 29 nhân viên (`TTX001` đến `TTX030`) với đầy đủ vị trí, phòng ban, bậc lương và mã nhân sự.
- **Lưu trữ dữ liệu trình duyệt**: Ứng dụng tự động đồng bộ state vào `localStorage` của trình duyệt (`ncttx_staff_list`, `ncttx_incidents`, `ncttx_questions`, `ncttx_user_passwords`).
- **Nâng cấp Backend về sau**: Khi công ty muốn đồng bộ dữ liệu tập trung qua Cloud Server (Node.js/Firebase/Supabase), chỉ cần thay thế các hàm `localStorage` trong `App.tsx` bằng API Async Calls.
