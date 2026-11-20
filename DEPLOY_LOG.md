# 📋 Nhật Ký Triển Khai (Deploy Log) - NCTTX Staffpoint

## 🚀 [v1.031] - 20/11/2026 12:08
* **Mô tả:** \
* **Hạ tầng triển khai:** Tự động đồng bộ trên Vercel (Production) và GitHub Pages.

---

## 🚀 [v1.030] - 17/11/2026 23:23
* **Mô tả:** \
* **Hạ tầng triển khai:** Tự động đồng bộ trên Vercel (Production) và GitHub Pages.

---

## 🚀 [v1.029] - 17/11/2026 20:41
* **Mô tả:**
  * **Đồng bộ Banner chuyên biệt cho tất cả các tab phản hồi:**
    * 🌟 **Tab Ghi Nhận:** Bổ sung banner xanh ngọc *"Sổ Tuyên Dương & Ghi Nhận Khen Thưởng"* kèm huy hiệu `+ Thang 5.0đ Khen Thưởng` và nút bấm nhanh `[+ Lập Phiếu Ghi Nhận]`.
    * ⚠️ **Tab Vi Phạm CV:** Chuẩn hóa banner đỏ hồng *"Biên Bản Vi Phạm Tiêu Chuẩn Công Việc"* kèm huy hiệu `- Thang 5.0đ Chuyên Môn` và nút bấm nhanh `[+ Lập Phiếu Vi Phạm]`.
    * 📖 **Tab Nội Quy:** Chuẩn hóa banner vàng hổ phách *"Sổ Ghi Nhận Nội Quy Lao Động"* kèm nút `[+ Lập Phiếu Nội Quy]`.
    * ⚖️ **Tab Kháng Nghị 48h:** Bổ sung banner xanh chàm *"Sổ Kháng Nghị & Khiếu Nại 48h"*.
  * **Cải tiến Empty State thông minh theo từng Tab:**
    * Khi chưa có dữ liệu trong tab tương ứng, hiển thị thông điệp và lời giải thích hướng dẫn trực quan theo đúng ngữ cảnh của từng loại phiếu thay vì câu chung chung.
* **Hạ tầng triển khai:** Tự động đồng bộ trên Vercel (Production) và GitHub Pages.

---

## 🚀 [v1.028] - 17/11/2026 19:40
* **Mô tả:**
  * **Đồng bộ toàn diện 572 ca làm việc từ Google Sheet:**
    * Sửa thuật toán đọc dòng: Bắt đầu từ dòng 4 (Ngày 1 của tháng) thay vì dòng 16 (trước đó bỏ sót từ Ngày 1 đến Ngày 11).
    * Sửa lỗi lệch múi giờ 4 giây (`23:59:56 GMT+0700`) của Google Sheet bằng thuật toán làm tròn (+60s), giúp ánh xạ chuẩn xác từng ngày trong tháng.
    * Tích hợp sẵn bộ dữ liệu ca làm việc `initialShifts.ts` (572 ca và 19 nhân sự) vào bundle ứng dụng, nâng cấp key cache lên `ncttx_shift_cache_v2` để xoá sạch cache cũ bị lỗi trên máy người dùng.
    * Bổ sung cơ chế fallback CORS Proxies khi trình duyệt gọi trực tiếp Google Sheets.
  * **Cơ chế Smart Date Auto-Focus trong Modal Đánh Giá Ca:**
    * Tự động nhận diện và nhảy đến ngày gần nhất có ca làm việc của bộ phận tương ứng (ví dụ: Pha chế tự động chọn ngày 16/11, Thương mại & Dịch vụ ngày 17/11).
    * Bổ sung nút bấm chuyển nhanh *"👉 Bấm xem ca gần nhất"* và chip lọc *"Hôm nay"*, *"Hôm qua"*, *"Ca gần nhất"* giúp người dùng không bao giờ bị rơi vào màn hình trống.
* **Hạ tầng triển khai:** Tự động đồng bộ trên Vercel (Production) và GitHub Pages.

---

## 🚀 [v1.027] - 17/11/2026 19:24
* **Mô tả:**
  * **Bỏ hoàn toàn phần Góp ý Admin:** Loại bỏ tính năng, nút bấm, tab và modal Hòm thư góp ý Admin khỏi giao diện Phản Hồi (`Option1IncidentsView`), giữ giao diện tinh gọn, tập trung hoàn toàn vào 3 trụ cột cốt lõi: Nội Quy Lao Động (Quỹ 100đ), Ghi Nhận Công Việc (+5.0đ), Vi Phạm Chuyên Môn (-5.0đ) & Kháng Nghị 48h.
  * **Bổ sung và chuẩn hóa các bộ phận trong Ca theo Google Sheet:**
    * Sửa thuật toán trích xuất tên bộ phận từ tiêu đề Cell A1 của Google Sheet (`parts[3]` thay vì `parts[2]`).
    * Chuẩn hóa và phân loại đầy đủ các bộ phận: **☕ Pha chế**, **🛍️ Thương mại & Dịch vụ**, **💁 Phục vụ**, **🥖 Bếp Bánh**.
    * Tích hợp bộ lọc bộ phận linh hoạt trong Modal Đánh giá Ca làm việc (`ShiftEvaluationModal`).
* **Hạ tầng triển khai:** Tự động đồng bộ trên Vercel (Production) và GitHub Pages.

---

## 🚀 [v1.026] - 17/11/2026 19:00
* **Mô tả:** Tích hợp hiển thị số điểm bị trừ trực tiếp trên thông báo vi phạm nội quy:
  * Tiêu đề thông báo nêu rõ: *"📖 Bạn bị trừ -Xđ quỹ nội quy"* (cho nhân sự nhận) hoặc *"📖 Vi phạm nội quy (-Xđ): [Tên nhân sự]"* (cho Quản lý / Admin).
  * Thêm huy hiệu điểm trừ `-[X]đ Quỹ Nội Quy` màu vàng hổ phách nổi bật trên cả cửa sổ Toast thông báo nhanh lẫn Trung tâm thông báo.
* **Hạ tầng triển khai:** Tự động đồng bộ trên Vercel (Production) và GitHub Pages.

---

## 🚀 [v1.025] - 17/11/2026 18:52
* **Mô tả:** Khắc phục lỗi nội dung thông báo (Notification & Popup Toast):
  * Phiếu nội quy hiển thị chuẩn xác: *"📖 Bạn có biên bản vi phạm nội quy mới"* và *"Lập biên bản vi phạm quy định: [Tên phiếu]. Trừ điểm quỹ nội quy"* (kèm icon `BookOpen` và màu vàng hổ phách), tuyệt đối không bị nhầm thành *"Khen thưởng"*.
  * Cập nhật màn hình báo thành công sau khi lập phiếu trong `IncidentFormModal` phân biệt đúng 3 thể loại: Nội Quy, Vi Phạm Công Việc, Khen Thưởng.
* **Hạ tầng triển khai:** Tự động đồng bộ trên Vercel (Production) và GitHub Pages.

---

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
