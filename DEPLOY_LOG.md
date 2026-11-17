# 📋 Nhật Ký Triển Khai (Deploy Log) - NCTTX Staffpoint

## 🚀 [v1.024] - 17/11/2026 18:38
* **Mô tả:** Phân tách hoàn toàn 3 thể loại phản hồi độc lập:
  * 🌟 **Ghi Nhận (Khen Thưởng):** Tác động điểm Đánh Giá Công Việc (+ Thang 5.0đ, màu Xanh Lục).
  * ⚠️ **Vi Phạm Công Việc:** Tác động điểm Đánh Giá Công Việc (- Thang 5.0đ, màu Đỏ).
  * 📖 **Nội Quy Lao Động:** Tác động Quỹ Điểm Kỷ Luật (- Quỹ 100đ, màu Vàng Hổ Phách).
  * Phân tách 3 Tab lọc riêng biệt trong tab **Phản Hồi**, 3 nút thao tác nhanh `[+ Ghi nhận]`, `[+ Vi phạm]`, `[+ Nội quy]` ngoài **Tổng Quan**, và 5 thẻ thống kê trực quan.
* **Hạ tầng triển khai:** Tự động đồng bộ trên Vercel (Production) và GitHub Pages.

---

## 🚀 [v1.023] - 17/11/2026 18:22
* **Mô tả:** Khắc phục lỗi sự cố hiển thị (ErrorBoundary do thiếu import BookOpen) trên tab Phản Hồi; tối ưu bộ lọc an toàn và hoàn thiện giao diện Tab Nội Quy màu vàng nổi bật.
* **Hạ tầng triển khai:** Tự động đồng bộ trên Vercel (Production) và GitHub Pages.

---

## 🚀 [v1.022] - 17/11/2026 18:09
* **Mô tả:** Ghi nhan noi quy trong Phan Hoi va thiet lap Tab Noi Quy mau vang
* **Hạ tầng triển khai:** Tự động đồng bộ trên Vercel (Production) và GitHub Pages.

---

Hệ thống ghi nhận và phản hồi nhân sự **Nhà Của Thời Thanh Xuân**.  
Địa chỉ triển khai chính thức:
* 🌐 **Vercel (Production):** [https://ncttx-staffpoint.vercel.app/](https://ncttx-staffpoint.vercel.app/)
* 🌐 **GitHub Pages (Backup):** [https://fongshubvn-cyber.github.io/ncttx-staffpoint/](https://fongshubvn-cyber.github.io/ncttx-staffpoint/)

---

## 🚀 [v1.021] - 17/11/2026 15:20
* **Tự động hóa triển khai (Auto Deploy & Version Bump):**
  * Tích hợp cơ chế tự động tăng số hiệu phiên bản (`v1.020` ➔ `v1.021`) mỗi khi phát hành.
  * Tự động đồng bộ hóa trên cả 2 nền tảng: **Vercel** (qua Git `main`) và **GitHub Pages** (qua `gh-pages`).
  * Ghi nhận tự động lịch sử phát hành vào file `DEPLOY_LOG.md`.
* **Thông báo đẩy (Web Push Native Banner):**
  * Thêm thanh Banner nổi thông minh (`NotificationPermissionBanner.tsx`) tự động xuất hiện khi nhân sự mở app từ màn hình chính để xin quyền thông báo 1 chạm theo tiêu chuẩn iOS 16.4+ và Android 13+.
  * Thêm nút *"Test thử thông báo"* trong Tab Cấu hình để nhân sự nghe âm thanh và xem thông báo mẫu.
* **Bộ nhớ đệm & Làm mới Cache (Hard Refresh):**
  * Tích hợp nút làm mới cache ở 3 vị trí: Header trên cùng (`🔄 v1.021`), Menu Mobile Drawer và Tab Cấu hình.
  * Tự động dọn sạch Service Worker và CacheStorage để nhận bản mới tức thì mà không cần cài lại app.
* **Ổn định môi trường biên dịch Vercel:**
  * Bổ sung thư viện `xlsx` vào danh mục phụ thuộc chính thức để tránh lỗi Rollup/Vite.
  * Chuẩn hóa cấu hình `package-lock.json` tương thích tuyệt đối với CI của Vercel.

---

## 📦 [v1.020] - 17/11/2026 14:00
* **Đánh giá ca làm việc trực tiếp từ Google Sheet:**
  * Đồng bộ ca làm việc từ Google Sheet điểm bán tự động mỗi 1 phút.
  * Cơ chế quét thời gian ca làm việc tự động hiển thị modal đánh giá khi hết ca.
* **Đồng bộ nhân sự định kỳ:**
  * Tự động quét và cập nhật danh sách nhân sự từ Sheet "Nhân sự điểm bán" mỗi 1 tiếng.
* **Quy chuẩn điểm trừ:**
  * Đặt mức điểm trừ mặc định khi lập biên bản là `-0.5 điểm` (Thang 5.0).
* **Tập trung hóa cấu hình:**
  * Đưa toàn bộ cài đặt ca làm, link Google Sheet, chu kỳ quét vào Tab "Cấu hình" -> Phân hệ Lịch Ca & Sheet.
* **Trung tâm thông báo (Notification Center):**
  * Biểu tượng quả chuông trên Header, huy hiệu thông báo chưa đọc, âm thanh chuông báo Web Audio API, và thông báo Toast góc dưới màn hình.

---

## 📦 [v1.019] - 17/11/2026 13:00
* **Điều chỉnh chế độ mặc định form đánh giá:**
  * Mặc định chuyển sang chế độ *"Nhắc nhở nhẹ"* khi mở form đánh giá công việc.
* **Hoàn thiện bộ tiêu chí văn hóa ứng xử:**
  * Khắc phục câu từ, nhấn mạnh tinh thần chân thành, sẻ chia và bao dung của Nhà Của Thời Thanh Xuân.

---

## 📦 [v1.018] - 17/11/2026 12:50
* **Tôn vinh cống hiến & ghi nhận:**
  * Đưa danh mục khen thưởng và cống hiến lên vị trí ưu tiên hàng đầu trong giao diện.
  * Thêm các nhãn phân loại nhanh giúp cán bộ quản lý dễ dàng ghi nhận đóng góp của nhân sự khiếm thính.
