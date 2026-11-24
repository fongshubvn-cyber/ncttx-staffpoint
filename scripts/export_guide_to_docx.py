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

def add_callout(doc, text_content, title="💡 GHI NHỚ QUAN TRỌNG:"):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    
    cell = tbl.cell(0, 0)
    cell.width = Inches(6.5)
    set_cell_background(cell, "F0FDF4")
    set_cell_margins(cell, top=140, bottom=140, left=200, right=200)
    
    tcPr = cell._tc.get_or_add_tcPr()
    borders = parse_xml(f'''
        <w:tcBorders {nsdecls("w")}>
            <w:top w:val="none"/>
            <w:left w:val="single" w:sz="24" w:space="0" w:color="1B4332"/>
            <w:bottom w:val="none"/>
            <w:right w:val="none"/>
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
    run_title.font.size = Pt(10.5)
    run_title.font.color.rgb = RGBColor(27, 67, 50) # #1B4332
    
    run_txt = p.add_run(text_content)
    run_txt.font.name = "Segoe UI"
    run_txt.font.size = Pt(10)
    run_txt.font.color.rgb = RGBColor(45, 55, 72)
    
    # spacing after table
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
    run.font.size = Pt(15)
    run.font.color.rgb = RGBColor(27, 67, 50)
    return h

def add_heading_2(doc, text):
    h = doc.add_paragraph()
    h.paragraph_format.space_before = Pt(12)
    h.paragraph_format.space_after = Pt(4)
    h.paragraph_format.keep_with_next = True
    run = h.add_run(text)
    run.bold = True
    run.font.name = "Segoe UI"
    run.font.size = Pt(12.5)
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
    run.font.size = Pt(11)
    run.font.color.rgb = RGBColor(27, 67, 50)
    return h

def add_p(doc, text="", bold_prefix="", space_after=5):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.2
    
    if bold_prefix:
        r_pre = p.add_run(bold_prefix + " ")
        r_pre.bold = True
        r_pre.font.name = "Segoe UI"
        r_pre.font.size = Pt(10.5)
        r_pre.font.color.rgb = RGBColor(27, 67, 50)
        
    if text:
        r = p.add_run(text)
        r.font.name = "Segoe UI"
        r.font.size = Pt(10.5)
        r.font.color.rgb = RGBColor(45, 55, 72)
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
            
    # Row 0: Images
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
        
    # Row 1: Captions
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
    
    # Header row
    hdr_cells = tbl.rows[0].cells
    for i, header_text in enumerate(headers):
        cell = hdr_cells[i]
        cell.width = col_widths[i]
        set_cell_background(cell, "1B4332")
        set_cell_margins(cell, top=100, bottom=100, left=120, right=120)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(header_text)
        r.bold = True
        r.font.name = "Segoe UI"
        r.font.size = Pt(9.5)
        r.font.color.rgb = RGBColor(255, 255, 255)
        
    # Data rows
    for r_idx, row_data in enumerate(data):
        row = tbl.add_row()
        fill_color = "F8FAFC" if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, cell_value in enumerate(row_data):
            cell = row.cells[c_idx]
            cell.width = col_widths[c_idx]
            set_cell_background(cell, fill_color)
            set_cell_margins(cell, top=80, bottom=80, left=120, right=120)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(cell_value)
            r.font.name = "Segoe UI"
            r.font.size = Pt(9)
            r.font.color.rgb = RGBColor(45, 55, 72)
            if c_idx == 0:
                r.bold = True

def generate_handbook_docx():
    base_dir = r"G:\Jobs\ncttx-staffpoint"
    img_dir = os.path.join(base_dir, "public", "guide-images")
    logo_path = os.path.join(base_dir, "src", "assets", "logo.png")
    out_path_1 = os.path.join(base_dir, "HUONG_DAN_SU_DUNG_STAFFPOINT_NHAN_VIEN.docx")
    out_path_2 = os.path.join(base_dir, "docs", "HUONG_DAN_SU_DUNG_STAFFPOINT_NHAN_VIEN.docx")
    
    doc = Document()
    
    # Page Margins: 0.75 in (54 pt) all around
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(0.75)
        section.bottom_margin = Inches(0.75)
        section.left_margin = Inches(0.75)
        section.right_margin = Inches(0.75)
        
    # =========================================================================
    # HEADER / BRAND COVER
    # =========================================================================
    if os.path.exists(logo_path):
        p_logo = doc.add_paragraph()
        p_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_logo.paragraph_format.space_before = Pt(0)
        p_logo.paragraph_format.space_after = Pt(6)
        p_logo.add_run().add_picture(logo_path, width=Inches(1.8))
        
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(4)
    p_title.paragraph_format.space_after = Pt(2)
    r_title = p_title.add_run("SỔ TAY HƯỚNG DẪN SỬ DỤNG APP STAFFPOINT")
    r_title.bold = True
    r_title.font.name = "Segoe UI"
    r_title.font.size = Pt(20)
    r_title.font.color.rgb = RGBColor(27, 67, 50)
    
    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(4)
    r_sub = p_sub.add_run("DÀNH RIÊNG CHO TẬP THỂ NHÂN SỰ (NHÀ - QUÁN - XƯỞNG)")
    r_sub.bold = True
    r_sub.font.name = "Segoe UI"
    r_sub.font.size = Pt(12)
    r_sub.font.color.rgb = RGBColor(45, 106, 79)
    
    p_org = doc.add_paragraph()
    p_org.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_org.paragraph_format.space_before = Pt(0)
    p_org.paragraph_format.space_after = Pt(12)
    r_org = p_org.add_run("CÔNG TY TNHH NHÀ CỦA THỜI THANH XUÂN\nPhiên bản hệ thống: Đồng bộ v1.041 | Tối ưu cho cả Người Nói & Người Khiếm Thính")
    r_org.font.name = "Segoe UI"
    r_org.font.size = Pt(10)
    r_org.font.italic = True
    r_org.font.color.rgb = RGBColor(100, 116, 139)
    
    # Lời mở đầu
    add_callout(doc, 
        "Chào bạn – thành viên của đại gia đình Nhà Của Thời Thanh Xuân! "
        "Tại Nhà (bao gồm Quán và Xưởng), chúng ta cùng nhau làm việc, chia sẻ không gian tĩnh lặng, mùi hương sả Java, "
        "nâng niu từng mầm cây và phục vụ những vị khách ghé thăm bằng cả tấm lòng. Dù bạn là Người nói hay Người khiếm thính, "
        "mọi nỗ lực, sự cống hiến và sự trung thực của bạn đều là tài sản quý giá nhất của Nhà.\n\n"
        "Ứng dụng NCTTX StaffPoint được xây dựng KHÔNG PHẢI để soi xét hay trừng phạt, mà là công cụ bảo vệ sự công bằng, "
        "ghi nhận kịp thời từng việc tốt, giúp bạn tự theo dõi điểm số, bậc lương và đóng góp ý kiến xây dựng Nhà ngày một tốt đẹp hơn.",
        "🌿 LỜI MỞ ĐẦU THÂN THƯƠNG:"
    )
    
    # =========================================================================
    # PHẦN 1: CÀI ĐẶT ỨNG DỤNG LÊN ĐIỆN THOẠI
    # =========================================================================
    add_heading_1(doc, "📱 PHẦN 1: CÀI ĐẶT ỨNG DỤNG LÊN ĐIỆN THOẠI (PWA)")
    add_p(doc, "Ứng dụng NCTTX StaffPoint chạy trực tiếp trên web mà không cần tải từ App Store hay Google Play, nhưng bạn có thể ghim ra màn hình chính để mở nhanh như ứng dụng thật:")
    add_p(doc, "https://ncttx-staffpoint.vercel.app/", bold_prefix="• Địa chỉ web app chính thức:")
    add_p(doc, "https://fongshubvn-cyber.github.io/ncttx-staffpoint/", bold_prefix="• Địa chỉ dự phòng (GitHub Pages):")
    
    add_image_centered(doc, os.path.join(img_dir, "03_huong_dan_cai_app.png"), 
                       "Hình 1: Hộp thoại hướng dẫn cài app StaffPoint lên màn hình chính cho iPhone (Safari) và Android (Chrome)", 
                       width=Inches(3.3))
    
    add_p(doc, "Bấm nút Chia sẻ (⎋ / 📤) dưới đáy màn hình Safari → Chọn dòng 'Thêm vào MH chính' (➕) → Bấm 'Thêm' ở góc trên bên phải. Biểu tượng StaffPoint sẽ xuất hiện ngay trên màn hình chính của bạn!", 
          bold_prefix="🍏 Dành cho iPhone / iPad (Safari):")
    add_p(doc, "Bấm vào biểu tượng Ba chấm dọc (⋮) ở góc trên bên phải màn hình Chrome → Chọn 'Cài đặt ứng dụng' hoặc 'Thêm vào Màn hình chính' → Xác nhận 'Cài đặt'.", 
          bold_prefix="🤖 Dành cho Android (Google Chrome):")
    
    # =========================================================================
    # PHẦN 2: ĐĂNG NHẬP & BẢO MẬT MẬT KHẨU
    # =========================================================================
    add_heading_1(doc, "🔐 PHẦN 2: ĐĂNG NHẬP & BẢO MẬT MẬT KHẨU CÁ NHÂN")
    add_image_centered(doc, os.path.join(img_dir, "02_dang_nhap.png"), 
                       "Hình 2: Giao diện Đăng nhập – Điền mã nhân viên, mật khẩu và tích chọn lưu đăng nhập trọn đời", 
                       width=Inches(3.3))
    
    add_heading_2(doc, "1. Cách Đăng Nhập Lần Đầu")
    add_p(doc, "Nhập mã cá nhân của bạn (ví dụ: TTX005, TTX009, TTX012...).", bold_prefix="• Bước 1 (Mã số nhân viên):")
    add_p(doc, "Mật khẩu ban đầu mặc định của toàn hệ thống là: 123456.", bold_prefix="• Bước 2 (Mật khẩu mặc định):")
    add_p(doc, "Tích chọn dòng 'Ghi nhớ đăng nhập trọn đời' để máy lưu tài khoản, lần sau mở app không cần gõ lại.", bold_prefix="• Bước 3 (Ghi nhớ):")
    add_p(doc, "Bấm nút 'Đăng Nhập' màu xanh để vào trang tổng quan của Nhà.", bold_prefix="• Bước 4 (Hoàn tất):")
    
    add_heading_2(doc, "2. Đổi Mật Khẩu Cá Nhân")
    add_p(doc, "Sau khi đăng nhập lần đầu bằng mật khẩu mặc định 123456, hệ thống sẽ tự động hiện khung yêu cầu đổi mật khẩu mới (tối thiểu 6 ký tự). Bạn hãy đặt mật khẩu bí mật của riêng mình và bấm 'Lưu Mật Khẩu'.")
    add_callout(doc, "Nếu bạn lỡ quên mật khẩu, đừng lo lắng! Hãy báo ngay cho Trưởng phòng Nhân sự hoặc Admin hệ thống để được hỗ trợ đặt lại mật khẩu về mặc định 123456.", "⚠️ QUÊN MẬT KHẨU:")
    
    # =========================================================================
    # PHẦN 3: HIỂU BẢNG ĐIỂM, BẬC LƯƠNG & QUỸ 100Đ
    # =========================================================================
    add_heading_1(doc, "📊 PHẦN 3: HIỂU BẢNG ĐIỂM CỦA MÌNH (THANG 5.0Đ & QUỸ 100Đ)")
    add_p(doc, "Hệ thống đánh giá của Nhà Của Thời Thanh Xuân gồm 2 phần độc lập, công khai và minh bạch:")
    
    add_two_images_side_by_side(doc, 
        os.path.join(img_dir, "01_trang_chu.png"), "Hình 3: Trang Chủ: Điểm trung bình & Bậc lương", 
        os.path.join(img_dir, "05_chi_tiet_ho_so.png"), "Hình 4: Hồ sơ: Tỷ trọng 70% Văn hóa & 30% Chuyên môn"
    )
    
    add_heading_2(doc, "1. Điểm Năng Lực & Làm Việc (Thang Điểm 5.0)")
    add_p(doc, "Chiếm 70% tổng điểm công việc. Bao gồm các tiêu chuẩn cốt lõi: Giữ gìn không gian tĩnh lặng, âm lượng vừa phải, mùi hương sả Java; chăm sóc cây xanh mầm lá; phân loại rác và đổ rác đúng 4 dấu hiệu; tinh thần tương trợ giữa Người nói và Người khiếm thính.", bold_prefix="• Khung Chung Văn Hóa Nhà:")
    add_p(doc, "Chiếm 30% tổng điểm công việc. Bao gồm quy chuẩn kỹ thuật chuyên biệt theo bộ phận của bạn: Pha chế, Bếp bánh, Phục vụ & Thương mại, Sản xuất xưởng xà phòng/tinh dầu, Kho & Đóng gói...", bold_prefix="• Ngạch Chuyên Môn Riêng:")
    
    # Table of Salary Tiers
    add_heading_3(doc, "Bảng Xếp Bậc Lương Thực Nhận Dựa Trên Điểm Tổng:")
    tbl_tier = doc.add_table(rows=1, cols=4)
    style_table(tbl_tier, [Inches(1.2), Inches(1.4), Inches(1.2), Inches(2.7)], 
        ["Bậc Lương", "Khoảng Điểm Tổng", "Hệ Số Lương", "Mô Tả Xếp Loại"],
        [
            ["🌟 Bậc 5", "Từ 4.80 - 5.00đ", "1.05", "Xuất sắc, gương mẫu toàn diện"],
            ["🟢 Bậc 4", "Từ 4.50 - 4.79đ", "1.00", "Chuẩn hoàn thành tốt công việc"],
            ["🟡 Bậc 3", "Từ 4.00 - 4.49đ", "0.95", "Đạt chuẩn nề nếp cơ bản"],
            ["🟠 Bậc 2", "Từ 3.50 - 3.99đ", "0.90", "Cần cải thiện và kèm cặp thêm"],
            ["🔴 Bậc 1", "Dưới 3.50đ", "0.85", "Giai đoạn tập sự / thử thách"]
        ]
    )
    
    add_heading_2(doc, "2. Quỹ Điểm Chấp Hành Nội Quy (Quỹ 100đ)")
    add_p(doc, "Vào ngày mùng 1 hàng tháng, mỗi bạn nhân sự đều được cấp trọn vẹn 100 điểm chấp hành.")
    add_p(doc, "Khi có biên bản vi phạm nội quy lao động (đi trễ, quên đồng phục, vi phạm an toàn, hút thuốc sai nơi quy định...), điểm sẽ bị trừ tương ứng.")
    add_p(doc, "Cuối tháng, số điểm còn lại trong Quỹ 100đ là căn cứ chính để xét thưởng Chuyên cần và Ý thức thi đua.")
    
    add_image_centered(doc, os.path.join(img_dir, "04_danh_sach_nhan_su.png"), 
                       "Hình 5: Danh mục nhân sự toàn Nhà theo phòng ban – Bấm vào bất kỳ thành viên nào để xem chi tiết", 
                       width=Inches(3.3))
    
    # =========================================================================
    # PHẦN 4: HƯỚNG DẪN LẬP PHIẾU PHẢN HỒI
    # =========================================================================
    add_heading_1(doc, "✍️ PHẦN 4: HƯỚNG DẪN LẬP PHIẾU PHẢN HỒI (3 CHỨC NĂNG CỐT LÕI)")
    add_p(doc, "Tại góc dưới bên phải màn hình, bấm vào nút tròn [ ＋ ]. Bạn sẽ thấy hộp thoại 3 lựa chọn phản hồi cốt lõi:")
    
    add_two_images_side_by_side(doc, 
        os.path.join(img_dir, "06_menu_chon_phan_hoi.png"), "Hình 6: Chọn 3 chức năng phản hồi cốt lõi", 
        os.path.join(img_dir, "07_form_cham_ca_nhan.png"), "Hình 7: Form lập phiếu khen thưởng cho Cá Nhân"
    )
    
    add_p(doc, "Dùng khi bạn muốn khen ngợi, tuyên dương việc tốt của đồng nghiệp trong ca. Phiếu này giúp người được lập được cộng điểm vào Thang điểm 5.0.", bold_prefix="🌟 1. Ghi nhận & Khen thưởng (+ Thang 5.0đ):")
    add_p(doc, "Dùng khi có sự cố quy trình, sai sót công việc chuyên môn cần nhắc nhở. Phiếu này tác động trừ điểm trong Thang 5.0.", bold_prefix="⚠️ 2. Vi phạm tiêu chuẩn công việc (- Thang 5.0đ):")
    add_p(doc, "Dùng khi phản ánh các lỗi vi phạm nội quy, giờ giấc, đồng phục, an toàn, tài sản chung. Phiếu này tác động trừ vào Quỹ 100đ chấp hành.", bold_prefix="📖 3. Đánh giá nội quy - chấp hành (Quỹ 100đ):")
    
    add_heading_2(doc, "Quy Trình 7 Bước Lập Phiếu Hoàn Chỉnh:")
    add_p(doc, "Chọn 1 trong 3 nhóm ở trên.", bold_prefix="• Bước 1 (Thể loại):")
    add_p(doc, "Hệ thống tự động điền mã và tên của bạn đang đăng nhập.", bold_prefix="• Bước 2 (Người lập):")
    add_p(doc, "Chọn tab [ 👤 Cá Nhân ] để chọn 1 đồng đội cụ thể, hoặc chọn [ 👥 Theo Ca (Sheet) ] để đánh giá cả ca.", bold_prefix="• Bước 3 (Đối tượng):")
    add_p(doc, "Chọn Khung chung văn hóa, Ngạch chuyên môn hoặc Ranh giới không thỏa hiệp.", bold_prefix="• Bước 4 (Phạm vi):")
    add_p(doc, "Bấm vào các từ khóa gợi ý (Không gian, Cây cối, Rác thải, Giờ giấc...) để chọn nhanh tiêu chí chuẩn.", bold_prefix="• Bước 5 (Tiêu chí):")
    add_p(doc, "Ghi ngắn gọn, trung thực diễn biến: Việc xảy ra lúc nào, ở đâu, bạn đã hỗ trợ/nhắc nhở ra sao.", bold_prefix="• Bước 6 (Mô tả):")
    add_p(doc, "Bấm nút gửi màu xanh hoặc cam dưới cùng. Phiếu sẽ được lưu ngay vào Cloud và sinh mã số chuẩn hóa.", bold_prefix="• Bước 7 (Gửi phiếu):")
    
    # =========================================================================
    # PHẦN 5: CHẤM ĐIỂM THEO CA LÀM VIỆC (GOOGLE SHEET)
    # =========================================================================
    add_heading_1(doc, "👥 PHẦN 5: TÍNH NĂNG MỚI – CHẤM ĐIỂM THEO CA (GOOGLE SHEET)")
    add_p(doc, "Dành cho Trưởng ca hoặc khi bạn muốn ghi nhận/nhắc nhở nề nếp của toàn bộ các bạn cùng làm ca với mình hôm nay:")
    
    add_image_centered(doc, os.path.join(img_dir, "08_form_cham_theo_ca.png"), 
                       "Hình 8: Giao diện Chấm Điểm Đồng Loạt Theo Ca Làm Việc từ Google Sheet", 
                       width=Inches(3.3))
    
    add_p(doc, "Tại Bước 3 của Form lập phiếu, bấm vào nút chuyển [ 👥 Theo Ca (Sheet) ].", bold_prefix="1. Chuyển chế độ:")
    add_p(doc, "Chọn Ngày làm việc từ danh mục ngày mà hệ thống đã quét sẵn từ Google Sheet của Nhà.", bold_prefix="2. Chọn Ngày:")
    add_p(doc, "Chọn Bộ phận (Pha chế, Bếp bánh, Phục vụ...) và Ca làm việc tương ứng (Ca sáng, Ca chiều).", bold_prefix="3. Chọn Ca:")
    add_p(doc, "Hệ thống tự động tích chọn tất cả bạn có lịch làm việc trong ca. Nếu có bạn đổi ca hoặc nghỉ phép, bạn chỉ việc bấm bỏ tích bạn đó.", bold_prefix="4. Điểm danh:")
    add_p(doc, "Mã phiếu tạo ra có định dạng CA-YYMM-XXX (ví dụ: CA-2611-001). Từng thành viên được tích chọn đều nhận được thông báo riêng và được cập nhật điểm đồng loạt.", bold_prefix="5. Mã phiếu tạo ra:")
    
    # =========================================================================
    # PHẦN 6: THÔNG BÁO & QUYỀN KHÁNG NGHỊ 48 GIỜ
    # =========================================================================
    add_heading_1(doc, "🔔 PHẦN 6: TRUNG TÂM THÔNG BÁO & QUYỀN KHÁNG NGHỊ TRONG 48 GIỜ")
    add_p(doc, "Nhà luôn đặt sự thấu hiểu, minh bạch và tinh thần đối thoại hòa giải lên hàng đầu:")
    
    add_two_images_side_by_side(doc, 
        os.path.join(img_dir, "10_trung_tam_thong_bao.png"), "Hình 9: Trung tâm thông báo & Quyền khiếu nại trong 48h", 
        os.path.join(img_dir, "09_so_phan_hoi.png"), "Hình 10: Sổ phản hồi: Tra cứu mã phiếu TD-, VP-, NQ-, CA-"
    )
    
    add_p(doc, "Khi có người lập phiếu liên quan đến bạn (được khen ngợi hoặc bị nhắc nhở), biểu tượng Chuông ở góc trên màn hình sẽ báo chấm đỏ. Bấm vào Chuông để đọc chi tiết mã phiếu, người lập và nội dung.", bold_prefix="1. Chuông Thông Báo (🔔):")
    add_p(doc, "Mọi biên bản nhắc nhở sau khi lập đều có THỜI HẠN 48 GIỜ MỞ để bạn xem xét. Nếu bạn cảm thấy sự việc chưa chính xác, có hiểu lầm hoặc lý do khách quan, bạn có quyền gặp trao đổi trực tiếp với người lập hoặc báo Trưởng bộ phận. Sau khi làm rõ, nếu là hiểu lầm, Quản trị viên sẽ hủy biên bản và hoàn lại điểm cho bạn.", bold_prefix="2. Quyền Kháng Nghị Trong 48 Giờ:")
    
    # =========================================================================
    # PHẦN 7: SỔ PHẢN HỒI & MÃ PHIẾU
    # =========================================================================
    add_heading_1(doc, "📚 PHẦN 7: TRA CỨU LỊCH SỬ & SỔ PHẢN HỒI MINH BẠCH")
    add_p(doc, "Bấm vào tab 'Phản Hồi' trên thanh menu dưới cùng để mở Sổ Phản Hồi. Bạn có thể tra cứu toàn bộ lịch sử các phiếu:")
    
    tbl_codes = doc.add_table(rows=1, cols=3)
    style_table(tbl_codes, [Inches(1.8), Inches(2.2), Inches(2.5)], 
        ["Ký Hiệu Mã Phiếu", "Ý Nghĩa Thể Loại", "Tác Động Điểm Số"],
        [
            ["🌟 TD-YYMM-XXX", "Phiếu Tuyên Dương / Khen Thưởng", "+ Thang 5.0đ (Cộng điểm công việc)"],
            ["⚠️ VP-YYMM-XXX", "Biên Bản Vi Phạm Tiêu Chuẩn", "- Thang 5.0đ (Trừ điểm chuyên môn)"],
            ["📖 NQ-YYMM-XXX", "Biên Bản Vi Phạm Nội Quy Lao Động", "- Quỹ 100đ (Trừ quỹ chấp hành)"],
            ["👥 CA-YYMM-XXX", "Đánh Giá Tập Thể Ca Làm Việc", "Thang 5.0đ (Áp dụng cho cả ca)"]
        ]
    )
    
    # =========================================================================
    # PHẦN 8: TRỢ LÝ AI NCTTX
    # =========================================================================
    add_heading_1(doc, "🤖 PHẦN 8: TRÒ CHUYỆN & HỎI ĐÁP CÙNG TRỢ LÝ AI NCTTX")
    add_p(doc, "Ở góc dưới bên trái màn hình luôn có nút tròn màu xanh có ngôi sao lấp lánh ✦. Đây là Trợ Lý AI của Nhà:")
    
    add_image_centered(doc, os.path.join(img_dir, "11_tro_ly_ai_ncttx.png"), 
                       "Hình 11: Trợ lý AI NCTTX – Tra cứu nội quy, tiêu chuẩn công việc và giải đáp 24/7", 
                       width=Inches(3.3))
    
    add_p(doc, "Trợ lý AI đã được học toàn bộ Sổ tay nhân sự, Nội quy lao động và Giá trị cốt lõi của Nhà. Bạn có thể gõ câu hỏi bằng tiếng Việt bất kỳ lúc nào, ví dụ:")
    add_p(doc, "• '4 dấu hiệu nhận biết đổ rác của Nhà là gì?'")
    add_p(doc, "• 'Đi trễ bao nhiêu phút thì bị trừ điểm nội quy?'")
    add_p(doc, "• 'Người khiếm thính và người nói khi làm việc chung cần lưu ý gì?'")
    add_p(doc, "• 'Làm sao để tôi được lên Bậc 5 lương?'")
    add_p(doc, "• 'Hôm nay tôi đổi ca làm việc thì cần báo cho ai?'")
    
    # =========================================================================
    # PHẦN 9: CÂU HỎI THƯỜNG GẶP (FAQ)
    # =========================================================================
    add_heading_1(doc, "❓ PHẦN 9: CÁC CÂU HỎI THƯỜNG GẶP (FAQ)")
    
    add_heading_3(doc, "Q1: Tôi là người khiếm thính, tôi có thể dùng app này không?")
    add_p(doc, "Có, hoàn toàn thuận tiện! Toàn bộ giao diện app StaffPoint được thiết kế tối ưu bằng hình ảnh, màu sắc trực quan, chữ viết rõ ràng và các nhóm từ khóa gợi ý nhanh. Bạn không cần phải nghe nói mà vẫn có thể chấm điểm, xem điểm, nhận thông báo và gửi phản hồi 100% qua màn hình điện thoại.")
    
    add_heading_3(doc, "Q2: Nhân viên có được quyền lập phiếu khen thưởng cho Quản lý không?")
    add_p(doc, "Được! Văn hóa Nhà khuyến khích sự trung thực và bình đẳng hai chiều. Bất kỳ ai làm tốt đều xứng đáng được ghi nhận và tuyên dương.")
    
    add_heading_3(doc, "Q3: Em bị người khác lập biên bản hiểu lầm thì làm sao?")
    add_p(doc, "Đừng lo lắng! Bạn có 48 giờ để giải trình. Hãy bấm vào thông báo để xem rõ mã phiếu và nội dung, sau đó trao đổi lại với người lập hoặc báo Trưởng bộ phận để cùng lắng nghe và đối soát sự thật.")
    
    add_heading_3(doc, "Q4: Điểm tổng của em có ảnh hưởng trực tiếp đến thu nhập không?")
    add_p(doc, "Có! Điểm tổng (Thang 5.0) quyết định Bậc lương (Bậc 1 đến Bậc 5) kèm hệ số nhân lương tương ứng. Làm tốt, tích lũy điểm cao sẽ giúp bạn tăng bậc lương xứng đáng.")
    
    add_heading_3(doc, "Q5: Khi không có mạng Wifi/4G thì app có chạy được không?")
    add_p(doc, "App đã được tích hợp bộ nhớ Offline Cache. Khi mất mạng tạm thời, bạn vẫn có thể mở app xem lịch ca và bảng điểm đã lưu. Khi có mạng trở lại, hệ thống sẽ tự động đồng bộ lên Đám mây.")
    
    # Footer Quote
    add_callout(doc, 
        "“Mỗi ngày bước vào Nhà, chúng ta không chỉ làm một công việc, mà đang cùng nhau gìn giữ một nơi chốn bình yên và tử tế.”\n"
        "Chúc bạn có những ngày làm việc thật vui vẻ, tràn đầy năng lượng tại Nhà Của Thời Thanh Xuân! 🌿☕✨", 
        "🌸 LỜI CHÚC TỪ NHÀ:"
    )
    
    # Save documents
    doc.save(out_path_1)
    doc.save(out_path_2)
    print(f"✓ Successfully generated DOCX at:\n  1. {out_path_1}\n  2. {out_path_2}")

if __name__ == "__main__":
    generate_handbook_docx()
