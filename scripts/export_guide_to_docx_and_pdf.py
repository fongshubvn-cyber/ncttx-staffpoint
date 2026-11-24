import os
import sys
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def add_note_box(doc, text_content, title="LƯU Ý QUAN TRỌNG:"):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    
    cell = tbl.cell(0, 0)
    cell.width = Inches(6.5)
    set_cell_background(cell, "F8FAFC") # slate-50
    set_cell_margins(cell, top=120, bottom=120, left=180, right=180)
    
    tcPr = cell._tc.get_or_add_tcPr()
    borders = parse_xml(f'''
        <w:tcBorders {nsdecls("w")}>
            <w:top w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>
            <w:left w:val="single" w:sz="24" w:space="0" w:color="1B4332"/>
            <w:bottom w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>
            <w:right w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>
        </w:tcBorders>
    ''')
    tcPr.append(borders)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.line_spacing = 1.15
    run_title = p.add_run(title + " ")
    run_title.bold = True
    run_title.font.name = "Segoe UI"
    run_title.font.size = Pt(10)
    run_title.font.color.rgb = RGBColor(27, 67, 50) # #1B4332
    
    run_txt = p.add_run(text_content)
    run_txt.font.name = "Segoe UI"
    run_txt.font.size = Pt(10)
    run_txt.font.color.rgb = RGBColor(51, 65, 85)
    
    p_after = doc.add_paragraph()
    p_after.paragraph_format.space_before = Pt(0)
    p_after.paragraph_format.space_after = Pt(4)

def add_heading_1(doc, text):
    h = doc.add_paragraph()
    h.paragraph_format.space_before = Pt(16)
    h.paragraph_format.space_after = Pt(6)
    h.paragraph_format.keep_with_next = True
    run = h.add_run(text)
    run.bold = True
    run.font.name = "Segoe UI"
    run.font.size = Pt(14)
    run.font.color.rgb = RGBColor(27, 67, 50)
    return h

def add_heading_2(doc, text):
    h = doc.add_paragraph()
    h.paragraph_format.space_before = Pt(11)
    h.paragraph_format.space_after = Pt(4)
    h.paragraph_format.keep_with_next = True
    run = h.add_run(text)
    run.bold = True
    run.font.name = "Segoe UI"
    run.font.size = Pt(12)
    run.font.color.rgb = RGBColor(45, 106, 79) # #2D6A4F
    return h

def add_heading_3(doc, text):
    h = doc.add_paragraph()
    h.paragraph_format.space_before = Pt(8)
    h.paragraph_format.space_after = Pt(3)
    h.paragraph_format.keep_with_next = True
    run = h.add_run(text)
    run.bold = True
    run.font.name = "Segoe UI"
    run.font.size = Pt(10.5)
    run.font.color.rgb = RGBColor(27, 67, 50)
    return h

def add_p(doc, text="", bold_prefix="", space_after=4):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.2
    
    if bold_prefix:
        r_pre = p.add_run(bold_prefix + " ")
        r_pre.bold = True
        r_pre.font.name = "Segoe UI"
        r_pre.font.size = Pt(10)
        r_pre.font.color.rgb = RGBColor(27, 67, 50)
        
    if text:
        r = p.add_run(text)
        r.font.name = "Segoe UI"
        r.font.size = Pt(10)
        r.font.color.rgb = RGBColor(51, 65, 85)
    return p

def add_image_centered(doc, img_path, caption, width=Inches(3.3)):
    if os.path.exists(img_path):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(6)
        p_img.paragraph_format.space_after = Pt(3)
        p_img.paragraph_format.keep_with_next = True
        run = p_img.add_run()
        run.add_picture(img_path, width=width)
        
        p_cap = doc.add_paragraph()
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.paragraph_format.space_before = Pt(0)
        p_cap.paragraph_format.space_after = Pt(10)
        r_cap = p_cap.add_run(caption)
        r_cap.font.name = "Segoe UI"
        r_cap.font.size = Pt(9)
        r_cap.font.italic = True
        r_cap.font.color.rgb = RGBColor(100, 116, 139)
    else:
        print(f"Warning: Image not found: {img_path}")

def add_two_images_side_by_side(doc, img1_path, cap1, img2_path, cap2):
    tbl = doc.add_table(rows=2, cols=2)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    
    col_w = Inches(3.15)
    for row in tbl.rows:
        for cell in row.cells:
            cell.width = col_w
            
    if os.path.exists(img1_path):
        p1 = tbl.cell(0, 0).paragraphs[0]
        p1.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p1.paragraph_format.space_before = Pt(2)
        p1.paragraph_format.space_after = Pt(2)
        p1.add_run().add_picture(img1_path, width=Inches(2.95))
        
    if os.path.exists(img2_path):
        p2 = tbl.cell(0, 1).paragraphs[0]
        p2.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p2.paragraph_format.space_before = Pt(2)
        p2.paragraph_format.space_after = Pt(2)
        p2.add_run().add_picture(img2_path, width=Inches(2.95))
        
    p_cap1 = tbl.cell(1, 0).paragraphs[0]
    p_cap1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap1.paragraph_format.space_before = Pt(2)
    p_cap1.paragraph_format.space_after = Pt(6)
    r1 = p_cap1.add_run(cap1)
    r1.font.name = "Segoe UI"
    r1.font.size = Pt(8.5)
    r1.font.italic = True
    r1.font.color.rgb = RGBColor(100, 116, 139)
    
    p_cap2 = tbl.cell(1, 1).paragraphs[0]
    p_cap2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap2.paragraph_format.space_before = Pt(2)
    p_cap2.paragraph_format.space_after = Pt(6)
    r2 = p_cap2.add_run(cap2)
    r2.font.name = "Segoe UI"
    r2.font.size = Pt(8.5)
    r2.font.italic = True
    r2.font.color.rgb = RGBColor(100, 116, 139)
    
    p_after = doc.add_paragraph()
    p_after.paragraph_format.space_before = Pt(0)
    p_after.paragraph_format.space_after = Pt(4)

def style_table(tbl, col_widths, headers, data):
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    
    hdr_cells = tbl.rows[0].cells
    for i, header_text in enumerate(headers):
        cell = hdr_cells[i]
        cell.width = col_widths[i]
        set_cell_background(cell, "1B4332")
        set_cell_margins(cell, top=90, bottom=90, left=120, right=120)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(header_text)
        r.bold = True
        r.font.name = "Segoe UI"
        r.font.size = Pt(9.5)
        r.font.color.rgb = RGBColor(255, 255, 255)
        
    for r_idx, row_data in enumerate(data):
        row = tbl.add_row()
        fill_color = "F8FAFC" if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, cell_value in enumerate(row_data):
            cell = row.cells[c_idx]
            cell.width = col_widths[c_idx]
            set_cell_background(cell, fill_color)
            set_cell_margins(cell, top=75, bottom=75, left=120, right=120)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(cell_value)
            r.font.name = "Segoe UI"
            r.font.size = Pt(9)
            r.font.color.rgb = RGBColor(51, 65, 85)
            if c_idx == 0:
                r.bold = True

def generate_handbook():
    base_dir = r"G:\Jobs\ncttx-staffpoint"
    img_dir = os.path.join(base_dir, "public", "guide-images")
    logo_path = os.path.join(base_dir, "src", "assets", "logo.png")
    
    out_docx_1 = os.path.join(base_dir, "HUONG_DAN_SU_DUNG_STAFFPOINT_NHAN_VIEN.docx")
    out_docx_2 = os.path.join(base_dir, "docs", "HUONG_DAN_SU_DUNG_STAFFPOINT_NHAN_VIEN.docx")
    out_docx_desktop = r"C:\Users\Optimus Prime\Desktop\HUONG_DAN_SU_DUNG_STAFFPOINT_NHAN_VIEN.docx"
    
    out_pdf_1 = os.path.join(base_dir, "HUONG_DAN_SU_DUNG_STAFFPOINT_NHAN_VIEN.pdf")
    out_pdf_2 = os.path.join(base_dir, "docs", "HUONG_DAN_SU_DUNG_STAFFPOINT_NHAN_VIEN.pdf")
    out_pdf_desktop = r"C:\Users\Optimus Prime\Desktop\HUONG_DAN_SU_DUNG_STAFFPOINT_NHAN_VIEN.pdf"
    
    doc = Document()
    
    # Page Margins: 0.75 in (54 pt) all around
    for section in doc.sections:
        section.top_margin = Inches(0.75)
        section.bottom_margin = Inches(0.75)
        section.left_margin = Inches(0.75)
        section.right_margin = Inches(0.75)
        
    # =========================================================================
    # FORMAL TITLE & HEADER
    # =========================================================================
    if os.path.exists(logo_path):
        p_logo = doc.add_paragraph()
        p_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_logo.paragraph_format.space_before = Pt(0)
        p_logo.paragraph_format.space_after = Pt(6)
        p_logo.add_run().add_picture(logo_path, width=Inches(1.6))
        
    p_org = doc.add_paragraph()
    p_org.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_org.paragraph_format.space_before = Pt(0)
    p_org.paragraph_format.space_after = Pt(2)
    r_org = p_org.add_run("CÔNG TY TNHH NHÀ CỦA THỜI THANH XUÂN")
    r_org.bold = True
    r_org.font.name = "Segoe UI"
    r_org.font.size = Pt(11)
    r_org.font.color.rgb = RGBColor(71, 85, 105)
    
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(4)
    p_title.paragraph_format.space_after = Pt(2)
    r_title = p_title.add_run("HƯỚNG DẪN THAO TÁC HỆ THỐNG ĐÁNH GIÁ NHÂN SỰ STAFFPOINT")
    r_title.bold = True
    r_title.font.name = "Segoe UI"
    r_title.font.size = Pt(16)
    r_title.font.color.rgb = RGBColor(27, 67, 50)
    
    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(10)
    r_sub = p_sub.add_run("QUY TRÌNH THAO TÁC CHUẨN (SOP) DÀNH CHO NHÂN VIÊN VÀ QUẢN LÝ CA\nPhiên bản hệ thống: v1.041 | Nền tảng: Web App & PWA Di Động")
    r_sub.font.name = "Segoe UI"
    r_sub.font.size = Pt(9.5)
    r_sub.font.color.rgb = RGBColor(100, 116, 139)
    
    # Mục đích & Phạm vi áp dụng (Formal SOP style)
    add_note_box(doc, 
        "Tài liệu này quy định chi tiết các bước thao tác trên phần mềm NCTTX StaffPoint phục vụ công tác: "
        "(1) Cài đặt ứng dụng trên thiết bị di động cá nhân; (2) Đăng nhập và bảo mật thông tin; "
        "(3) Theo dõi bảng điểm năng lực, xếp bậc lương và quỹ điểm chấp hành nội quy; "
        "(4) Quy trình lập phiếu ghi nhận khen thưởng, biên bản vi phạm chuyên môn hoặc nội quy; "
        "(5) Thao tác chấm điểm đồng loạt theo ca làm việc từ lịch Google Sheet; "
        "(6) Quy trình tiếp nhận thông báo và quyền kháng nghị trong thời hạn 48 giờ.",
        "MỤC ĐÍCH & PHẠM VI ÁP DỤNG:"
    )
    
    # =========================================================================
    # 1. CÀI ĐẶT ỨNG DỤNG LÊN THIẾT BỊ DI ĐỘNG (PWA)
    # =========================================================================
    add_heading_1(doc, "1. CÀI ĐẶT ỨNG DỤNG TRÊN THIẾT BỊ DI ĐỘNG (PWA)")
    add_p(doc, "Ứng dụng NCTTX StaffPoint được triển khai theo mô hình Progressive Web App (PWA). Người dùng không cần cài đặt thông qua App Store hoặc Google Play, mà thực hiện ghim trực tiếp liên kết lên màn hình chính thiết bị:")
    add_p(doc, "https://ncttx-staffpoint.vercel.app/", bold_prefix="• Máy chủ chính thức:")
    add_p(doc, "https://fongshubvn-cyber.github.io/ncttx-staffpoint/", bold_prefix="• Máy chủ dự phòng:")
    
    add_image_centered(doc, os.path.join(img_dir, "03_huong_dan_cai_app.png"), 
                       "Hình 1: Hộp thoại hướng dẫn ghim ứng dụng lên màn hình chính thiết bị di động", 
                       width=Inches(3.3))
    
    add_p(doc, "Truy cập liên kết bằng trình duyệt Safari → Nhấn nút Chia sẻ (biểu tượng hình vuông có mũi tên chỉ lên) trên thanh công cụ → Chọn mục 'Thêm vào MH chính' (Add to Home Screen) → Nhấn 'Thêm'. Biểu tượng ứng dụng sẽ xuất hiện trên màn hình chính.", 
          bold_prefix="1.1. Thao tác trên hệ điều hành iOS (iPhone / iPad):")
    add_p(doc, "Truy cập liên kết bằng trình duyệt Google Chrome → Nhấn biểu tượng Tùy chọn (dấu ba chấm dọc góc trên bên phải) → Chọn 'Cài đặt ứng dụng' hoặc 'Thêm vào Màn hình chính' → Xác nhận 'Cài đặt'.", 
          bold_prefix="1.2. Thao tác trên hệ điều hành Android:")
    
    # =========================================================================
    # 2. ĐĂNG NHẬP VÀ QUẢN LÝ MẬT KHẨU
    # =========================================================================
    add_heading_1(doc, "2. ĐĂNG NHẬP VÀ BẢO MẬT TÀI KHOẢN")
    add_image_centered(doc, os.path.join(img_dir, "02_dang_nhap.png"), 
                       "Hình 2: Giao diện xác thực tài khoản đăng nhập hệ thống", 
                       width=Inches(3.3))
    
    add_heading_2(doc, "2.1. Quy trình đăng nhập")
    add_p(doc, "Nhập chính xác mã nhân viên được cấp (ví dụ: TTX005, TTX009, TTX012...). Hệ thống tự động chuyển đổi thành chữ in hoa.", bold_prefix="• Bước 1 (Mã nhân viên):")
    add_p(doc, "Mật khẩu khởi tạo mặc định cho toàn bộ nhân sự mới là: 123456.", bold_prefix="• Bước 2 (Mật khẩu mặc định):")
    add_p(doc, "Tích chọn ô 'Ghi nhớ đăng nhập trọn đời' để duy trì phiên xác thực an toàn trên thiết bị cá nhân.", bold_prefix="• Bước 3 (Lưu phiên làm việc):")
    add_p(doc, "Nhấn nút 'Đăng Nhập' để chuyển vào giao diện làm việc chính.", bold_prefix="• Bước 4 (Xác nhận):")
    
    add_heading_2(doc, "2.2. Quy trình đổi mật khẩu bắt buộc")
    add_p(doc, "Tại lần đăng nhập đầu tiên bằng mật khẩu mặc định (123456), hệ thống tự động kích hoạt màn hình đổi mật khẩu bắt buộc. Nhân sự cần thiết lập mật khẩu mới có độ dài tối thiểu 6 ký tự (không được trùng với mật khẩu mặc định 123456).")
    add_note_box(doc, "Trường hợp quên mật khẩu cá nhân, nhân sự liên hệ Trưởng phòng Nhân sự hoặc Quản trị viên hệ thống để thực hiện khôi phục (reset) mật khẩu về mặc định 123456.", "XỬ LÝ QUÊN MẬT KHẨU:")
    
    # =========================================================================
    # 3. CƠ CHẾ TÍNH ĐIỂM, BẬC LƯƠNG & QUỸ 100 ĐIỂM
    # =========================================================================
    add_heading_1(doc, "3. CƠ CẤU ĐIỂM SỐ, XẾP BẬC LƯƠNG VÀ QUỸ 100 ĐIỂM NỘI QUY")
    add_p(doc, "Hệ thống quản lý điểm số gồm 02 cấu phần đánh giá độc lập:")
    
    add_two_images_side_by_side(doc, 
        os.path.join(img_dir, "01_trang_chu.png"), "Hình 3: Bảng điều khiển Tổng quan điểm số và bậc lương", 
        os.path.join(img_dir, "05_chi_tiet_ho_so.png"), "Hình 4: Chi tiết cấu phần điểm Văn hóa (70%) & Chuyên môn (30%)"
    )
    
    add_heading_2(doc, "3.1. Điểm Năng lực & Chuyên môn (Thang điểm 5.0)")
    add_p(doc, "Điểm tổng hợp đánh giá công việc được tính theo công thức trọng số chuẩn hóa:", bold_prefix="• Công thức tính:")
    add_p(doc, "Điểm Tổng = (Điểm Khung Chung × 70%) + (Điểm Ngạch Chuyên Môn × 30%)", bold_prefix="  ")
    add_p(doc, "Bao gồm các tiêu chuẩn chung áp dụng cho mọi vị trí: Giữ gìn trật tự và không gian làm việc; chăm sóc bảo vệ tài sản, cảnh quan; thực hiện phân loại và xử lý rác thải đúng quy định; tác phong phối hợp làm việc.", bold_prefix="• Khung Chung (Tỷ trọng 70%):")
    add_p(doc, "Bao gồm các chỉ số chuyên biệt theo vị trí đảm nhiệm: Pha chế, Bếp bánh, Dịch vụ & Phục vụ, Sản xuất xưởng, Kho và Đóng gói...", bold_prefix="• Ngạch Chuyên Môn (Tỷ trọng 30%):")
    
    add_heading_3(doc, "Bảng Quy chuẩn Xếp Bậc Lương Theo Điểm Tổng Hợp:")
    tbl_tier = doc.add_table(rows=1, cols=4)
    style_table(tbl_tier, [Inches(1.2), Inches(1.5), Inches(1.2), Inches(2.6)], 
        ["Bậc Lương", "Khoảng Điểm Tổng", "Hệ Số Lương", "Phân Loại Đánh Giá"],
        [
            ["Bậc 5", "4.80 - 5.00 điểm", "1.05", "Xuất sắc / Vượt chuẩn"],
            ["Bậc 4", "4.50 - 4.79 điểm", "1.00", "Hoàn thành tốt / Đạt chuẩn"],
            ["Bậc 3", "4.00 - 4.49 điểm", "0.95", "Đạt yêu cầu cơ bản"],
            ["Bậc 2", "3.50 - 3.99 điểm", "0.90", "Cần cải thiện chất lượng"],
            ["Bậc 1", "Dưới 3.50 điểm", "0.85", "Tập sự / Cần kèm cặp"]
        ]
    )
    
    add_heading_2(doc, "3.2. Quỹ Điểm Chấp Hành Nội Quy (Quỹ 100 điểm)")
    add_p(doc, "Vào ngày đầu tiên của mỗi chu kỳ đánh giá (tháng), mỗi nhân sự được phân bổ định mức 100 điểm.")
    add_p(doc, "Các hành vi vi phạm nội quy lao động (giờ giấc, đồng phục, an toàn lao động, vệ sinh, hút thuốc không đúng nơi quy định...) sẽ bị trừ điểm trực tiếp theo biểu khung chế tài.")
    add_p(doc, "Điểm còn lại của Quỹ 100 điểm tại thời điểm chốt kỳ là căn cứ xét thưởng Chuyên cần và đánh giá kỷ luật.")
    
    add_image_centered(doc, os.path.join(img_dir, "04_danh_sach_nhan_su.png"), 
                       "Hình 5: Danh mục nhân sự toàn hệ thống theo phòng ban và trạng thái", 
                       width=Inches(3.3))
    
    # =========================================================================
    # 4. QUY TRÌNH LẬP PHIẾU PHẢN HỒI (3 NGHIỆP VỤ)
    # =========================================================================
    add_heading_1(doc, "4. QUY TRÌNH LẬP PHIẾU PHẢN HỒI (3 NGHIỆP VỤ CỐT LÕI)")
    add_p(doc, "Nhấn nút tác vụ nổi [ ＋ ] tại góc dưới màn hình. Hệ thống hiển thị 03 nghiệp vụ phản hồi chuẩn:")
    
    add_two_images_side_by_side(doc, 
        os.path.join(img_dir, "06_menu_chon_phan_hoi.png"), "Hình 6: Hộp thoại lựa chọn 3 nghiệp vụ phản hồi cốt lõi", 
        os.path.join(img_dir, "07_form_cham_ca_nhan.png"), "Hình 7: Biểu mẫu nhập liệu phản hồi cho đối tượng Cá Nhân"
    )
    
    add_p(doc, "Áp dụng ghi nhận đóng góp tích cực, hỗ trợ đồng đội hoặc sáng kiến cải tiến. Tác động cộng điểm vào Thang điểm 5.0.", bold_prefix="4.1. Nghiệp vụ 1 - Ghi nhận & Khen thưởng:")
    add_p(doc, "Áp dụng khi phát hiện sai sót quy trình kỹ thuật, sự cố công việc hoặc chất lượng chưa đạt. Tác động trừ điểm trong Thang điểm 5.0.", bold_prefix="4.2. Nghiệp vụ 2 - Vi phạm tiêu chuẩn công việc:")
    add_p(doc, "Áp dụng đối với các hành vi vi phạm nội quy lao động, trật tự, giờ giấc, trang phục. Tác động trừ điểm trực tiếp vào Quỹ 100 điểm.", bold_prefix="4.3. Nghiệp vụ 3 - Đánh giá nội quy - chấp hành:")
    
    add_heading_2(doc, "Quy trình thực hiện theo các bước chuẩn:")
    add_p(doc, "Chọn 1 trong 3 nhóm nghiệp vụ nêu trên.", bold_prefix="• Bước 1 (Thể loại):")
    add_p(doc, "Hệ thống tự động trích xuất thông tin nhân sự đang đăng nhập.", bold_prefix="• Bước 2 (Người lập):")
    add_p(doc, "Chọn 'Cá Nhân' (đánh giá 1 nhân sự) hoặc 'Theo Ca (Sheet)' (đánh giá tập thể ca).", bold_prefix="• Bước 3 (Đối tượng):")
    add_p(doc, "Lựa chọn tiêu chí đánh giá chuẩn thông qua danh mục từ khóa hoặc thanh tìm kiếm.", bold_prefix="• Bước 4 (Tiêu chí):")
    add_p(doc, "Nhập cụ thể thời gian, địa điểm, diễn biến sự việc và biện pháp xử lý đã thực hiện.", bold_prefix="• Bước 5 (Mô tả):")
    add_p(doc, "Tải tệp hình ảnh minh chứng nếu có (dung lượng tối đa 10MB/tệp).", bold_prefix="• Bước 6 (Minh chứng):")
    add_p(doc, "Nhấn nút hoàn tất để ghi nhận vào hệ thống đám mây (Cloud Database) và phát hành mã phiếu định danh.", bold_prefix="• Bước 7 (Phát hành):")
    
    # =========================================================================
    # 5. CHẤM ĐIỂM THEO CA LÀM VIỆC (GOOGLE SHEET)
    # =========================================================================
    add_heading_1(doc, "5. CHẤM ĐIỂM ĐỒNG LOẠT THEO CA LÀM VIỆC (DỮ LIỆU GOOGLE SHEET)")
    add_p(doc, "Tính năng hỗ trợ Quản lý ca hoặc người kiểm tra thực hiện đánh giá đồng loạt toàn bộ nhân sự tham gia ca làm việc:")
    
    add_image_centered(doc, os.path.join(img_dir, "08_form_cham_theo_ca.png"), 
                       "Hình 8: Giao diện chấm điểm đồng loạt theo ca làm việc đồng bộ từ Google Sheet", 
                       width=Inches(3.3))
    
    add_p(doc, "Tại Bước 3 của Form lập phiếu, nhấn chọn tab [ 👥 Theo Ca (Sheet) ].", bold_prefix="5.1. Kích hoạt:")
    add_p(doc, "Chọn ngày đánh giá từ danh sách ngày được đồng bộ tự động từ bảng phân ca Google Sheet của công ty.", bold_prefix="5.2. Chọn ngày:")
    add_p(doc, "Lựa chọn Bộ phận chuyên môn (Pha chế, Bếp bánh, Phục vụ...) và Ca làm việc tương ứng (Ca sáng / Ca chiều).", bold_prefix="5.3. Chọn ca:")
    add_p(doc, "Hệ thống tự động hiển thị danh sách nhân sự có lịch làm việc trong ca. Người lập có thể bỏ tích chọn đối với nhân sự vắng mặt hoặc chuyển ca.", bold_prefix="5.4. Xác nhận nhân sự:")
    add_p(doc, "Hệ thống phát hành mã phiếu duy nhất dạng CA-YYMM-XXX (ví dụ: CA-2611-001) và đồng thời cập nhật điểm số cho toàn bộ nhân sự được chọn.", bold_prefix="5.5. Cập nhật dữ liệu:")
    
    # =========================================================================
    # 6. TRUNG TÂM THÔNG BÁO & QUY TRÌNH KHÁNG NGHỊ 48 GIỜ
    # =========================================================================
    add_heading_1(doc, "6. TRUNG TÂM THÔNG BÁO VÀ THỜI HẠN KHÁNG NGHỊ 48 GIỜ")
    add_p(doc, "Quy chế bảo đảm tính khách quan, công bằng và quyền giải trình của nhân sự:")
    
    add_two_images_side_by_side(doc, 
        os.path.join(img_dir, "10_trung_tam_thong_bao.png"), "Hình 9: Trung tâm thông báo và thời hạn khiếu nại trong 48 giờ", 
        os.path.join(img_dir, "09_so_phan_hoi.png"), "Hình 10: Sổ nhật ký phản hồi và tra cứu mã phiếu"
    )
    
    add_p(doc, "Khi có phiếu đánh giá liên quan phát sinh, hệ thống kích hoạt thông báo chuông tức thời trên giao diện người dùng kèm chi tiết mã phiếu, người lập, nội dung và điểm tác động.", bold_prefix="6.1. Tiếp nhận thông báo:")
    add_p(doc, "Mọi phiếu nhắc nhở / vi phạm có hiệu lực chờ trong thời hạn 48 giờ kể từ thời điểm phát hành. Trong thời gian này, nhân sự có quyền:", bold_prefix="6.2. Cửa sổ kháng nghị 48 giờ:")
    add_p(doc, "• Trao đổi trực tiếp với Người lập phiếu để làm rõ các điểm chưa thống nhất.")
    add_p(doc, "• Gửi đơn giải trình hoặc phản ánh đến Trưởng phòng Nhân sự / Quản trị viên hệ thống.")
    add_p(doc, "Trường hợp xác nhận thông tin phản ánh chưa chính xác hoặc do nguyên nhân khách quan, Quản trị viên có thẩm quyền thu hồi phiếu và hoàn trả điểm số trên hệ thống.")
    
    # =========================================================================
    # 7. SỔ NHẬT KÝ PHẢN HỒI & QUY TẮC MÃ ĐỊNH DANH
    # =========================================================================
    add_heading_1(doc, "7. TRA CỨU SỔ NHẬT KÝ VÀ QUY TẮC MÃ ĐỊNH DANH PHIẾU")
    add_p(doc, "Mục 'Phản Hồi' lưu trữ toàn bộ lịch sử các giao dịch đánh giá đã phát sinh. Hệ thống áp dụng cấu trúc mã chuẩn hóa:")
    
    tbl_codes = doc.add_table(rows=1, cols=3)
    style_table(tbl_codes, [Inches(1.8), Inches(2.2), Inches(2.5)], 
        ["Cấu Trúc Mã Phiếu", "Loại Nghiệp Vụ", "Quy Chuẩn Tác Động Điểm"],
        [
            ["TD-YYMM-XXX", "Phiếu Tuyên Dương / Khen Thưởng", "Cộng điểm trực tiếp vào Thang 5.0"],
            ["VP-YYMM-XXX", "Biên Bản Vi Phạm Tiêu Chuẩn Công Việc", "Trừ điểm trực tiếp trong Thang 5.0"],
            ["NQ-YYMM-XXX", "Biên Bản Vi Phạm Nội Quy Lao Động", "Trừ điểm trực tiếp vào Quỹ 100 điểm"],
            ["CA-YYMM-XXX", "Đánh Giá Tập Thể Ca Làm Việc", "Cập nhật Thang 5.0 cho toàn bộ ca"]
        ]
    )
    
    # =========================================================================
    # 8. TRA CỨU QUY CHẾ QUA TRỢ LÝ AI
    # =========================================================================
    add_heading_1(doc, "8. TRA CỨU QUY ĐỊNH VÀ TIÊU CHUẨN QUA TRỢ LÝ AI")
    add_p(doc, "Phân hệ Trợ lý AI tích hợp cơ sở tri thức toàn diện về Nội quy lao động, Sổ tay nhân sự và Tiêu chuẩn vận hành:")
    
    add_image_centered(doc, os.path.join(img_dir, "11_tro_ly_ai_ncttx.png"), 
                       "Hình 11: Giao diện tương tác và tra cứu tiêu chuẩn công việc qua Trợ lý AI", 
                       width=Inches(3.3))
    
    add_p(doc, "Nhấn biểu tượng Trợ lý AI (nút tròn góc dưới bên trái màn hình).", bold_prefix="8.1. Thao tác kích hoạt:")
    add_p(doc, "Nhập câu hỏi bằng tiếng Việt có dấu. Hệ thống tự động đối chiếu cơ sở dữ liệu quy chế và phản hồi điều khoản, mức phạt hoặc tiêu chuẩn kỹ thuật tương ứng.", bold_prefix="8.2. Thao tác truy vấn:")
    
    # =========================================================================
    # 9. CÂU HỎI THƯỜNG GẶP (FAQ)
    # =========================================================================
    add_heading_1(doc, "9. XỬ LÝ CÁC TÌNH HUỐNG KỸ THUẬT THƯỜNG GẶP (FAQ)")
    
    add_heading_3(doc, "9.1. Nhân sự khiếm thính thao tác trên phần mềm như thế nào?")
    add_p(doc, "Toàn bộ giao diện được thiết kế trực quan hóa 100%, hỗ trợ phân loại màu sắc tiêu chuẩn (xanh: khen thưởng, đỏ: vi phạm, vàng: nội quy) và danh mục gợi ý dạng nút bấm. Không yêu cầu tương tác âm thanh hay giọng nói.")
    
    add_heading_3(doc, "9.2. Cấp bậc nhân viên có được lập phiếu đối với cấp Quản lý không?")
    add_p(doc, "Hệ thống cho phép nhân sự lập phiếu phản hồi đối với mọi đối tượng trong danh mục nhân sự nhằm duy trì sự minh bạch hai chiều.")
    
    add_heading_3(doc, "9.3. Khi xảy ra gián đoạn kết nối Internet (mất mạng Wifi/4G), ứng dụng có hoạt động không?")
    add_p(doc, "Ứng dụng trang bị bộ nhớ đệm Offline Cache. Dữ liệu bảng điểm và lịch ca đã tải sẽ duy trì hiển thị cục bộ. Dữ liệu mới sẽ được đồng bộ lên Cloud Database ngay khi thiết bị kết nối mạng trở lại.")
    
    add_heading_3(doc, "9.4. Điểm số trên phần mềm tác động đến thu nhập như thế nào?")
    add_p(doc, "Điểm tổng hợp Thang điểm 5.0 xác định Bậc lương thực nhận theo hệ số tương ứng quy định tại Mục 3.1 của tài liệu này.")
    
    # Save documents
    doc.save(out_docx_1)
    doc.save(out_docx_2)
    doc.save(out_docx_desktop)
    print(f"✓ Generated DOCX at:\n  - {out_docx_1}\n  - {out_docx_2}\n  - {out_docx_desktop}")

    # Convert to PDF
    try:
        from docx2pdf import convert
        print("\n⏳ Đang chuyển đổi sang file PDF...")
        convert(out_docx_desktop, out_pdf_desktop)
        import shutil
        shutil.copyfile(out_pdf_desktop, out_pdf_1)
        shutil.copyfile(out_pdf_desktop, out_pdf_2)
        print(f"✓ Generated PDF at:\n  - {out_pdf_1}\n  - {out_pdf_2}\n  - {out_pdf_desktop}")
    except Exception as e:
        print("Lỗi chuyển đổi PDF:", e)

if __name__ == "__main__":
    generate_handbook()
