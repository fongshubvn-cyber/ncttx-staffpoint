# AGENTS.md

Hướng dẫn cho mọi trợ lý AI làm việc trong kho này (Cursor, Copilot, Codex,
Gemini CLI, Claude Code…).

> **Đọc `CLAUDE.md` trước khi làm bất cứ việc gì.** Tệp đó là bản đầy đủ:
> kiến trúc, lệnh chạy kiểm thử, và **18 cái bẫy đã sụp** trong dự án này —
> phần lớn là loại không báo lỗi, app vẫn chạy và chỉ là sai.
>
> Dưới đây chỉ là những điều tuyệt đối không được vi phạm, chép lại ở đây
> phòng khi công cụ của bạn chỉ đọc tệp này.

## Ngôn ngữ

Tiếng Việt cho mọi thứ — tên hàm, biến, chú thích, thông báo lỗi, giao diện,
và cả câu trả lời cho người dùng. Người dùng tên **Phong**, xưng "anh".

## Dữ liệu thật của người thật

Kho này phục vụ **Nhà Của Thời Thanh Xuân**, doanh nghiệp xã hội với khoảng 33
nhân sự, phần lớn là người Điếc. Dữ liệu gồm tên thật, chức danh, mật khẩu đã
băm, và **nội dung biên bản kỷ luật về từng cá nhân**.

**Không bao giờ commit** `DuLieu_DanhGiaNhanSu.json`, `NhapVao.json`,
`SaoLuu_*.json`, `*.xlsx`. `.gitignore` đã chặn — đừng gỡ.
GitHub Pages bản miễn phí bắt repo phải public.

## Không sửa `goc/`

16 tệp trong `goc/` là của bên thứ ba, họ gửi bản mới hàng tháng.
**Không sửa một dòng nào.** Code của mình chỉ được *mượn* tên đã khai trong
hằng `APP_MUON` ở `app/App_MayChu.gs`.

Trước khi áp bản mới của họ: `python3 soat.py <thư-mục-mới>`.

## Luật nghiệp vụ đã chốt — hỏi trước khi đổi

- Biên bản vi phạm: **tự duyệt ngay**, không qua ai
- Phiếu ghi nhận: **chỉ phòng Nhân sự** duyệt
- Kháng nghị: **2 ngày làm việc**, gửi **một lần**
- Quyền xuất kết quả: **quản lý phòng Nhân sự trở lên**
- Ảnh trên Drive **luôn riêng tư**, không bao giờ công khai bằng link
- Người lập biên bản phải đứng tên chính mình, không tự lập cho mình

## Ba điều kỹ thuật hay làm hỏng nhất

1. **Bản chụp để so sánh phải là bản sao sâu**, không phải tham chiếu.
   App sửa thẳng vào `db`; giữ tham chiếu thì mọi thay đổi trông như "không có
   gì đổi" và dữ liệu mất trong im lặng.
2. **Trước khi thiết kế bảng, grep trong `index.html`** xem app thật sự đọc
   trường nào. Bảng `tieu_chi` từng thiếu 4 cột app đang dùng — điểm sai hết
   mà không ai biết.
3. **RLS lọc dòng chứ không ném lỗi.** Bài thử "phải bị chặn" phải đọc lại dữ
   liệu và hỏi *"có đổi không"*, đừng hỏi *"có báo lỗi không"*.

## Chạy kiểm thử trước khi giao

```bash
cd supabase && node thu_chuyen.mjs && node thu_rls.mjs && node thu_kho.mjs
```

84 phép thử, chạy trên Postgres 18 thật. Phải đạt hết.

## Cách làm việc

Đo rồi hãy nói — chạy thật, dẫn số, đừng khẳng định điều chưa kiểm.
Nói thẳng khi lỗi là của mình. Việc chưa xong thì nói là chưa xong.
