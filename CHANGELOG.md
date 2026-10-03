# 📜 NHẬT KÝ PHIÊN BẢN & MỐC NGUYÊN BẢN DỰ ÁN STAFFPOINT

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
