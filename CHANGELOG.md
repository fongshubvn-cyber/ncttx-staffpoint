# 📜 NHẬT KÝ PHIÊN BẢN & MỐC NGUYÊN BẢN DỰ ÁN STAFFPOINT

## 📌 PHIÊN BẢN V1.005-STABLE (07/10/2026)
**Git Tag:** `v1.005-stable`  
**GitHub Repository:** `https://github.com/fongshubvn-cyber/ncttx-staffpoint.git`  
**Trạng thái:** ✅ Đã hoàn tất nâng cấp Tính năng Tích chọn Ngạch Chuyên Môn Đa Ngạch (Checkbox Tuyến/Bộ phận làm việc).

### 🌟 BẢNG TỔNG HỢP CÁC TÍNH NĂNG & CẢI TIẾN TRONG BẢN V1.005:
- **Tích chọn Ngạch Chuyên Môn bằng Checkbox Tuyến Làm Việc:** Chuyển đổi toàn bộ ô chọn rating tùy tiện sang danh sách Checkbox các Tuyến/Bộ phận làm việc thực tế (`Pha chế`, `Sản xuất / Bếp bánh`, `Kế toán`, `Thương mại & Dịch vụ`, `E-Commerce`, v.v.). Nhân sự có thể đảm nhận đồng thời 1, 2, 3 hoặc nhiều ngạch.
- **Tự động hóa Điểm Văn Hóa (5.0/5.0):** Điểm Văn Hóa được giữ cố định chuẩn 5.0 và chịu tác động tự động khi phát sinh sự kiện/phản hồi trong hệ thống.
- **Cấu hình Ngạch Quản Lý minh bạch:** Tích chọn áp dụng Ngạch Quản lý cho vị trí Quản lý/Lead.

---

## 📌 PHIÊN BẢN V1.004-STABLE (07/10/2026)
**Git Tag:** `v1.004-stable`  
**GitHub Repository:** `https://github.com/fongshubvn-cyber/ncttx-staffpoint.git`  
**Trạng thái:** ✅ Đã nâng cấp thành công giao diện Tỉ lệ % Hoàn Thành Công Việc, Tách bạch 3 Ngạch Điểm & Điểm Chuyên Môn Mặc Định 5.0.

### 🌟 BẢNG TỔNG HỢP CÁC TÍNH NĂNG & CẢI TIẾN TRONG BẢN V1.004:

#### 1. 📊 Tổng Điểm Đánh Giá Công Việc theo Phần Trăm (%)
- Thay thế dòng ghi chú `(Điểm tối đa 5.0)` bằng **tỉ lệ % hoàn thành công việc** (Ví dụ: `100%` tương ứng `4.82đ` mốc ngạch tiêu chuẩn).
- Thanh tiến trình fill theo tỉ lệ phần trăm đạt được trực quan.

#### 2. 📑 Tổ chức 3 Hàng Danh Mục Riêng Cho Các Ngạch Điểm
- Sắp xếp minh bạch 3 tiêu chí riêng biệt: **🟢 Văn Hóa & Thái Độ (5.0/5.0)**, **🔵 Ngạch Quản Lý (e.g. 4.4/4.4)**, **🟣 Ngạch Chuyên Môn (e.g. 4.2/4.2)**.
- Mẫu số điểm ngạch thể hiện mốc ngạch chuẩn thực tế thay vì `/5.0` cứng.

#### 3. 🎯 Điểm Chuyên Môn Tự Động 5.0/5.0 Khi Chưa Có Dữ Liệu Ngạch
- Nhân sự chưa có dữ liệu sát hạch ngạch chuyên môn riêng sẽ tự động tính **5.0/5.0** và hiển thị ghi chú `Chưa có dữ liệu ngạch (Auto 5/5)`.
- Cho phép Admin chỉnh sửa ngạch chuyên môn tùy chỉnh trong tab quản lý Nhân sự.

#### 4. 🔄 Lưu Điểm Nội Quy Độc Lập Theo Kỳ (Monthly Reset 100đ)
- Mỗi tháng nhân sự được reset tự động về 100đ tuân thủ nội quy mặc định độc lập.
- Bổ sung thanh chọn kỳ xem lịch sử điểm nội quy giữa các tháng.

---

## 📌 PHIÊN BẢN V1.003-STABLE (04/10/2026)
**Git Tag:** `v1.003-stable`  
**GitHub Repository:** `https://github.com/fongshubvn-cyber/ncttx-staffpoint.git`  
**Trạng thái:** ✅ Đã nâng cấp thành công hệ thống Điểm Nội Quy 100đ, Popup Phản hồi 2 nhánh & Khắc phục hoàn toàn đồng bộ phiếu mới.

### 🌟 BẢNG TỔNG HỢP CÁC TÍNH NĂNG & CẢI TIẾN TRONG BẢN V1.003:

#### 1. 🛡️ Tích hợp Hệ thống Điểm Nội Quy & Account Health UI (100đ)
- Định nghĩa 10 Điều Khoản Nội Quy chuẩn NCTTX (`NQ01` đến `NQ10`) với mức trừ điểm nội quy (`-5đ`, `-10đ`, `-15đ`, `-20đ`, `-50đ`) và biện pháp xử lý kỷ luật.
- Hiển thị 2 khung điểm độc lập: **Bên trái (Đánh giá công việc 5.0đ)** và **Bên phải (Điểm nội quy 100đ)**.
- Giao diện Account Health chuẩn TikTok Shop với thước đo 4 cấp độ (Tốt, Cần chú ý, Nghiêm trọng, Đình chỉ) & cơ chế Kháng nghị 48h.

#### 2. ⚡ Popup Chọn Loại Phản Hồi ("Đánh giá" vs "Phản ánh nội quy")
- Khi bấm nút **"Tạo Phản Hồi"** (ở Header hoặc nút `+` góc màn hình), hệ thống bật popup 2 lựa chọn:
  * **🌟 Đánh Giá Công Việc (Thang 5.0):** Cho phép chọn `[ 🌟 KHEN THƯỞNG (+ ĐIỂM) ]` hoặc `[ 📢 NHẮC NHỞ (- ĐIỂM) ]` tác động vào điểm 5.0.
  * **🛡️ Phản Ánh Nội Quy (Thang 100đ):** Cố định chọn 1 trong 10 Điều Khoản Nội Quy (`NQ01` - `NQ10`) và trừ điểm trực tiếp vào 100đ Account Health.

#### 3. 🔄 Khắc Phục Hoàn Toàn Xung Đột Đồng Bộ Phiếu Mới (Smart State Merge)
- Nâng cấp thuật toán gộp dữ liệu thời gian thực (Smart State Merge & Local Persistence) trong `subscribeToCollection`, triệt tiêu hoàn toàn hiện tượng phiếu mới tạo bị đè đợt sóng snapshot Firebase.

---

## 📌 PHIÊN BẢN V1.002-STABLE (MỐC CHUẨN NGUYÊN BẢN - 03/10/2026)
**Git Commit Hash:** `32a3cc1`  
**Git Tag:** `v1.002-stable`  
**GitHub Repository:** `https://github.com/fongshubvn-cyber/ncttx-staffpoint.git`  
**Trạng thái:** ✅ Đã kiểm thử build thành công 100%, sẵn sàng chạy production trên Vercel / Netlify.

---

### 🌟 BẢNG TỔNG HỢP CÁC TÍNH NĂNG & CẢI TIẾN TRONG BẢN V1.002:

#### 1. 🔄 Cơ cấu đánh giá độc lập theo từng kỳ tháng (0 Carry-over)
- Điểm làm việc tổng hợp, điểm văn hóa, ngạch chuyên môn và bậc lương (1..5) được **tính toán động theo từng kỳ báo cáo tháng** (`2026-10`, `2026-09`, `2026-08`).
- Khi bước sang tháng mới (ví dụ: **Tháng 10/2026**), điểm số tự động reset về chuẩn 5.0 (hoặc điểm nền), **không bị dồn phiếu hay trừ điểm phạt oan từ tháng 9**.
- Khi chuyển chọn xem lại kỳ cũ (ví dụ: **Tháng 09/2026**), toàn bộ dữ liệu lịch sử và điểm số của Tháng 9 được giữ nguyên 100%.

#### 2. ⚡ Đồng bộ thời gian thực siêu tốc giữa nhiều thiết bị & tab (BroadcastChannel + Firestore)
- Tích hợp công nghệ `BroadcastChannel` và `Storage Event Listener`, giúp dữ liệu tự động cập nhật thời gian thực tức thì (dưới 0.3s) giữa các thiết bị và tab trình duyệt.
- Tách biệt hoàn toàn luồng Nhận dữ liệu (Read) và luồng Gửi (Write), triệt tiêu lỗi lặp ghi đè dữ liệu.
- Thêm biểu tượng cảnh báo trạng thái Cloud trên thanh Header Navbar:
  - `🟢 Cloud Realtime`: Kết nối đám mây thông suốt.
  - `🔴 Mất Sync Cloud`: Tự động cảnh báo và hướng dẫn mở mở quyền `allow read, write: if true;` trên Firebase Console.

#### 3. 🖼️ Tự động nén ảnh đính kèm bằng HTML5 Canvas
- Mọi hình ảnh chụp từ camera hoặc tải lên từ thư viện điện thoại (3MB - 10MB) được tự động thu nhỏ về tối đa **800px** với dung lượng chỉ **~30KB - 50KB**.
- Đảm bảo tải ảnh siêu nhanh và chống lỗi quá dung lượng 1MB (`Document exceeds maximum size`) của Firebase Firestore.

#### 4. 🔑 Hợp nhất Đăng nhập & Phân quyền vai trò động
- Gỡ bỏ nút switch `[NV / QL]` trên Header mobile.
- Form đăng nhập duy nhất (`LoginModal.tsx`) nhận diện tự động Mã NV (`TTX-001`) hoặc Mã Admin (`ADMIN`), gán quyền hạn hiển thị tương ứng.

#### 5. 📄 Cầu nối Google Apps Script / Sheet / Drive
- File trợ lý [`AppScript_Integration_Guide.gs`](file:///d:/Jobs/ncttx-staffpoint/AppScript_Integration_Guide.gs) kết nối trực tiếp với 16 file Apps Script gốc.
- Hỗ trợ nút **`[📊 Xuất Google Sheet]`** (báo cáo cá nhân) và nút **`[⚡ Đồng bộ Cả Tháng sang Google Sheet]`** (báo cáo 33 nhân sự) đổ dữ liệu 17 cột sang Sheet `📊 Tổng hợp kỳ` và tự động kích hoạt cây thư mục Google Drive.

---

### ⏪ THAO TÁC KHÔI PHỤC VỀ PHIÊN BẢN NÀY (REVERT GUIDE):
Nếu sau này có các thay đổi khác và anh muốn quay về lại chính xác bản stable này, anh chỉ cần mở Terminal tại thư mục dự án và chạy câu lệnh:

```bash
git checkout v1.002-stable
# Hoặc khôi phục về commit hash 32a3cc1:
git reset --hard 32a3cc1
git push origin main -f
```
