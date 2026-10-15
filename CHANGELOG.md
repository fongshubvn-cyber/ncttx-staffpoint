# 📜 NHẬT KÝ PHIÊN BẢN & MỐC NGUYÊN BẢN DỰ ÁN STAFFPOINT

## 📌 PHIÊN BẢN V1.008-STABLE (15/10/2026)
**Git Tag:** `v1.008-stable`  
**GitHub Repository:** `https://github.com/fongshubvn-cyber/ncttx-staffpoint.git`  
**Trạng thái:** ✅ Đã hoàn tất Chuẩn hoá Thang Điểm 100 & Công thức 3 Trụ cột Tách bạch, Số hoá 20 Nội quy 2 Ngạch từ NQLĐ 2026 & Sổ tay Nhân sự TTX, và Nâng cấp Toàn diện AI Chatbox theo Keywords Intent RAG.

### 🌟 BẢNG TỔNG HỢP CÁC TÍNH NĂNG & CẢI TIẾN TRONG BẢN V1.008:
1. **Chuẩn Hoá Hệ Điểm 100 & Loại Bỏ Hoàn Toàn Điểm Thang 5 (`/5`):**
   - Loại bỏ triệt để điểm `/5` gây nhầm lẫn trên toàn bộ giao diện (Hồ sơ nhân sự, Bảng tổng kết, Báo cáo, Modal sức khỏe nội quy).
   - Khóa tính năng tự ý chỉnh sửa Điểm nền cá nhân; toàn bộ nhân sự chịu tác động công bằng từ Điểm nền chung của hệ thống (Điểm Văn hóa mặc định 100đ, Điểm Chuyên môn phòng ban 100đ, Điểm Quản lý 100đ).

2. **Phân Tách Rõ Ràng Điểm Đánh Giá Công Việc Theo 3 Trụ Cột Độc Lập:**
   - **Trụ cột 1 – Văn hóa & Tác phong:** Áp dụng 100% cho toàn bộ thành viên Nhà.
   - **Trụ cột 2 – Ngạch Chuyên môn Phòng ban:** Bám sát từng bộ phận thực tế (Pha chế, Bếp bánh/Sản xuất, Thương mại & Dịch vụ, E-Commerce, Kế toán, v.v.).
   - **Trụ cột 3 – Ngạch Quản lý:** Chỉ kích hoạt khi nhân sự được giao vai trò Quản lý / Tổ trưởng.
   - **Công thức tính điểm thực tế chuẩn hóa:**
     - Nhân viên: $\text{Điểm Thực tế} = \text{Văn hoá} + \text{Ngạch Phòng ban}$
     - Quản lý: $\text{Điểm Thực tế} = \text{Văn hoá} + \text{Ngạch Phòng ban} + \text{Ngạch Quản lý}$
   - Tích hợp liên kết phân hạng 5 Bậc lương $P_2$ (Bậc 1: $\ge 90đ$, Bậc 2: 80–89đ, Bậc 3: 70–79đ, Bậc 4: 50–69đ, Bậc 5: $< 50đ$) theo Quyết định NQ-TTX-01/2026.

3. **Số Hóa & Chuẩn Hóa 20 Nội Quy Theo 2 Ngạch (Thay Thế Toàn Bộ 10 Nội Quy Cũ):**
   - Xóa bỏ 10 nội quy đơn giản cũ, cập nhật bộ 20 quy chế chuẩn mực từ 2 tài liệu gốc (*Nội quy lao động số 01/2026/NQ-TTX* & *Sổ tay nhân sự TTX*):
     - **Ngạch 1 – Pháp quy & Kỷ luật Lao động (10 quy định, mã PQ-01 đến PQ-10):** Chấm công & giờ giấc làm việc; Bảo mật tiền lương (Điều 20 NQLĐ); Quản lý tiền mặt, két quỹ & thu ngân; Bảo vệ bí mật kinh doanh & công thức sản xuất; An toàn lao động & PCCC; An toàn vệ sinh thực phẩm (ATTP); Phòng chống quấy rối & xâm phạm nhân phẩm; Nghiêm cấm chất kích thích, cờ bạc & vũ khí; Trách nhiệm bảo vệ công cụ, máy móc; Quy trình xử lý kỷ luật lao động.
     - **Ngạch 2 – Văn hóa, Ứng xử & Tác phong Nhà (10 quy định, mã VH-01 đến VH-10):** Tôn trọng đồng đội Khiếm thính & Ngôn ngữ ký hiệu; Tinh thần tự lực & không thương mại hóa sự khiếm thính; Văn hóa tiếp khách & 6 điều cấm; Tiêu chuẩn đồng phục & diện mạo mộc mạc; Giữ gìn 5 yếu tố không gian linh hồn của Nhà; Tự giác vệ sinh & phân loại rác; Quy chế Tiền tips & Quỹ chung của Nhà; Phương pháp làm việc OPA, SMART & Ghi chép ca; Tinh thần Kaizen & tư duy hướng giải pháp; Tác phong bàn giao ca & sử dụng điện thoại.

4. **Nâng Cấp AI Chatbox (Thanh Xuân AI) Theo Bộ Từ Khóa Intent RAG Đa Tầng:**
   - Tích hợp tri thức toàn bộ 20 nội quy 2 ngạch, công thức 3 trụ cột và 5 bậc lương vào System Instruction của Gemini.
   - Xây dựng động cơ nhận diện từ khóa tự nhiên siêu tốc (Offline & Online): hỗ trợ tra cứu chi tiết Khiếu nại 48h, Quy định tiền tips, Bảo mật lương, Giờ giấc, Két quỹ, Bí mật kinh doanh xưởng, 3 Ranh giới đỏ không thỏa hiệp, 5 Yếu tố không gian...
   - Bổ sung thanh Gợi ý nhanh (Quick Suggestion Chips) 8 chủ đề then chốt 1-chạm giúp nhân sự dễ dàng tương tác.

5. **Cơ Chế "Chưa Xếp Ngạch" & Điểm Mặc Định Bằng 0 (Cả Ngạch Chuyên Môn & Quản Lý):**
   - Nếu nhân sự chưa được phân bổ vào ngạch chuyên môn cụ thể (`staff.line` để trống hoặc chọn "Chưa xếp ngạch"): Hệ thống hiển thị rõ ràng là **"Chưa xếp ngạch"** và **mặc định điểm thành phần = 0.00** (thay vì tự động gán điểm ngạch dự phòng).
   - Tương tự đối với ngạch quản lý: Nếu nhân sự không giữ vai trò quản lý hoặc chưa được phân ngạch quản lý (`managementTrack` là "Chưa xếp ngạch"): Hệ thống hiển thị rõ ràng **"Chưa xếp ngạch"** và **mặc định điểm thành phần = 0.00**.
   - Bổ sung tùy chọn "Chưa xếp ngạch" vào danh mục ngạch hệ thống và các dropdown form Tạo mới / Sửa nhân sự.
   - Thể hiện minh bạch trên toàn bộ giao diện Bảng Tổng Kết (SummaryView & Option1SummaryView) và Hồ sơ nhân sự (StaffView & Option1StaffView).

---

## 📌 PHIÊN BẢN V1.007-STABLE (12/10/2026)
**Git Tag:** `v1.007-stable`  
**GitHub Repository:** `https://github.com/fongshubvn-cyber/ncttx-staffpoint.git`  
**Trạng thái:** ✅ Đã hoàn tất nâng cấp Tái thiết kế Menu Di động theo 3 Khối Card chuẩn, Phân quyền Bảo mật Tuyệt đối (Chỉ Admin thấy người khác) & Chuẩn hóa Luồng Duyệt Phiếu/Kháng nghị 48h.

### 🌟 BẢNG TỔNG HỢP CÁC TÍNH NĂNG & CẢI TIẾN TRONG BẢN V1.007:
1. **Thiết Kế Menu Di Động Dạng Khối (Modular Block Drawer):**
   - **Khối 1 – Thông Tin Người Dùng:** Avatar chữ cái với chấm xanh online, Tên & Chức danh rõ ràng, nút xem tài khoản/đổi mật khẩu và đăng xuất nhanh.
   - **Khối 2 – Danh Mục Chức Năng 5 Phân Hệ:** Chia lưới 2 cột chuẩn, phân hệ thứ 5 (*Báo Cáo & Hướng Dẫn*) trải rộng toàn hàng (`col-span-2`) kèm dòng mô tả phụ, không còn khoảng trống bị lệch.
   - **Khối 3 – Tác Vụ Nhanh:** Nút nổi bật gradient *"Tạo Ghi Nhận / Vi Phạm Mới"*, lưới 2 tiện ích phụ *"Đồng Bộ Cloud"* và *"Quản Lý Mật Khẩu / Trợ Lý AI"*.
   - **Lớp Phủ Nền (Backdrop Overlay):** Chạm bất kỳ đâu bên ngoài để đóng menu nhanh chóng.

2. **Cơ Chế Phân Quyền Bảo Mật Tuyệt Đối (Privacy & Security Scoping):**
   - **Chỉ duy nhất Admin** mới có quyền xem toàn bộ nhân sự công ty, tìm kiếm và chuyển đổi xem nhân sự khác.
   - **Mọi tài khoản khác (kể cả Trưởng phòng / Quản lý / Nhân sự):** Khóa cứng chỉ xem được duy nhất bản thân mình (`[selfStaff]`).
   - Khóa thanh chọn nhân sự trên trang Tổng quan: Ẩn nút "Đổi nhân sự" và dropdown khi không phải Admin.
   - Khoanh vùng chỉ số Banner KPI theo đúng hồ sơ cá nhân ("Hồ Sơ Của Bạn", "Tuyên Dương Của Bạn", "Biên Bản Của Bạn", "Kháng Nghị Của Bạn"), không còn cộng dồn vi phạm của toàn công ty.

3. **Chuẩn Hóa Luồng Duyệt Ghi Nhận & Kháng Nghị 48h:**
   - Phiếu ghi nhận (Tuyên dương): Khởi tạo ở trạng thái `'Đang xem xét'`, HR xem xét phê duyệt chuyển sang `'Đã ghi nhận'` mới được tính điểm.
   - Phiếu lập biên bản (Vi phạm): Người bị lập biên bản hoặc HR có quyền gửi `'Kháng nghị'`, HR xem xét chấp nhận (hủy phạt hoàn điểm) hoặc bác kháng nghị.

4. **Tinh Gọn Header Ứng Dụng:**
   - Loại bỏ chữ "StaffPoint" trên thanh tiêu đề, thay bằng capsule pill trạng thái Cloud Realtime, nút làm mới và mã phiên bản `v1.007`.

---

## 📌 PHIÊN BẢN V1.006-STABLE (12/10/2026)
**Git Tag:** `v1.006-stable`  
**GitHub Repository:** `https://github.com/fongshubvn-cyber/ncttx-staffpoint.git`  
**Trạng thái:** ✅ Đã hoàn tất khắc phục triệt để Lỗi Xung đột Đánh giá Đồng thời (Concurrent Evaluations) & Cơ chế Làm Mới Cloud An Toàn 2 Chiều.

### 🌟 BẢNG TỔNG HỢP CÁC TÍNH NĂNG & CẢI TIẾN TRONG BẢN V1.006:
- **Đồng bộ Giao dịch Nguyên tử (Firestore Transaction `runTransaction`):** Khắc phục triệt để hiện tượng nhiều người đánh giá/gửi phản hồi cùng một lúc bị ghi đè mất phiếu. Mọi phiếu tạo mới đều được xếp hàng và gộp an toàn vào Cloud mà không bị ghi đè.
- **Cơ chế "Làm Mới Cloud" Thông Minh (Smart 2-Way Merge):** Khi người dùng bấm nút làm mới, hệ thống tự động gộp các phiếu trên Cloud với phiếu local theo ID. Tuyệt đối không xóa nhầm dữ liệu trên máy, không làm tụt số lượng đánh giá hay reset điểm về 0.
- **Tính điểm & Tuyên dương Tức thì:** Phiếu ghi nhận tuyên dương và đánh giá công việc được kích hoạt ngay (`Đã ghi nhận`) và được tính lập tức vào bộ đếm phản hồi và điểm số kỳ hiện tại.
- **Bảo toàn Điểm Sàn Chuẩn 5.0:** Điểm số nền tảng của nhân sự được chốt chuẩn 5.0, không bị rơi về mốc 4.0 hay 0 khi làm mới hay tải lại trang.

---

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
