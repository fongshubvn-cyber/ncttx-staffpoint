/**
 * MODULE 13: Bộ câu hỏi đánh giá.
 *
 * ⛔ FILE NÀY SINH TỰ ĐỘNG, KHÔNG SỬA TAY.
 * Nguồn: ba file BO-CAU-HOI-DANH-GIA_*.md trong 3-Luong/Phuong-an/.
 * Sửa câu hỏi thì sửa file .md rồi chạy lại:
 *     python3 3-Luong/Phuong-an/sinh_bo_cau_hoi_gs.py
 *
 * Cấu trúc một nhóm: [mã nhóm, tên nhóm, [câu...], logic đo]
 * Cấu trúc một câu:   [mã câu, nội dung, phạm vi áp dụng]
 *
 * logic đo là 'vi phạm' hoặc 'ghi nhận'. Mọi câu trong một nhóm viết đúng
 * thể của logic đó. ✅ CHỐT 9/8/2026 (Sen), một kiểu chấm cho cả phiếu.
 *
 * ⛔ Ô THỨ TƯ 'bậc' ĐÃ BỎ. ✅ CHỐT 31/8/2026 (Sen). Lý do: chữ bậc từng
 * mang ba nghĩa cùng lúc, và hai ngạch dùng chung một dãy số nhưng tên
 * khác nhau, nên số 4 vừa là Lead bộ phận vừa là Chuyên viên. Nay bậc
 * chỉ còn MỘT nghĩa là BẬC CÁCH LÀM VIỆC 1 tới 5, thứ tra ra hệ số lương.
 * Mọi chỗ khác ghi thẳng TÊN CẤP.
 *
 * Phạm vi áp dụng loại câu ra khỏi phiếu của người không có đầu việc đó,
 * KHÔNG loại câu khó. Giá trị 'Từ <tên cấp> trở lên' ghi cấp thấp nhất mà
 * câu bắt đầu áp dụng. Xem quyết định 2 tại mục 0I của CLAUDE.md.
 */

/* Phần chung, áp dụng cho mọi tuyến. */
const CAU_HOI_CHUNG = [
  ['VH1','ONE VOICE, MỘT TIẾNG NÓI THỐNG NHẤT',[
   ['VH1.1','Nhân sự có phát ngôn cá nhân trái định hướng chung của Công ty','Tất cả nhân sự'],
   ['VH1.2','Nhân sự truyền đạt thông tin chưa được xác nhận','Tất cả nhân sự'],
   ['VH1.3','Nhân sự dùng sai hoặc bỏ qua kịch bản và quy chuẩn giao tiếp đã ban hành, cả với khách và trong nội bộ','Tất cả nhân sự'],
   ['VH1.4','Nhân sự tự ý trả lời khách hoặc đồng nghiệp thông tin chưa chắc chắn thay vì xác nhận lại với người có thẩm quyền','Tất cả nhân sự'],
   ['VH1.5','Nhân sự truyền đạt chính sách hoặc quyết định sai lệch, thiếu sót nội dung so với văn bản gốc đã ban hành','Tất cả nhân sự']
  ],'vi phạm'],
  ['VH2','OUTCOME, KẾT QUẢ CẦN ĐẠT THEO TIÊU CHÍ SMART',[
   ['VH2.1','Nhân sự nhận việc mà không nêu được kết quả cần đạt, chỉ mô tả các hoạt động sẽ làm','Tất cả nhân sự'],
   ['VH2.2','Kết quả cần đạt do nhân sự nêu không đo được bằng số hoặc bằng dữ kiện kiểm chứng được','Tất cả nhân sự'],
   ['VH2.3','Kết quả cần đạt do nhân sự nêu không khả thi với nguồn lực và thời gian đang có','Tất cả nhân sự'],
   ['VH2.4','Kết quả cần đạt do nhân sự nêu không phục vụ đúng mục tiêu của bộ phận','Tất cả nhân sự'],
   ['VH2.5','Kết quả cần đạt do nhân sự nêu không có thời hạn rõ ràng','Tất cả nhân sự'],
   ['VH2.6','Nhân sự không chủ động báo cáo nghiệm thu kết quả công việc bằng số liệu hoặc dữ kiện thực tế khi đến hạn','Tất cả nhân sự'],
   ['VH2.7','Kết quả cần đạt nhân sự giao cho nhóm bị hiểu theo nhiều cách, tới lúc nghiệm thu mới phát sinh tranh cãi','Nhân sự giữ vai trò quản lý']
  ],'vi phạm'],
  ['VH3','PURPOSE, MỤC ĐÍCH VÀ VÌ SAO LÀM',[
   ['VH3.1','Nhân sự không nhắc lại được vì sao việc mình nhận cần làm','Tất cả nhân sự'],
   ['VH3.2','Nhân sự thực hiện công việc sai lệch so với mục tiêu chung của bộ phận hoặc kế hoạch ca đã giao','Tất cả nhân sự'],
   ['VH3.3','Cách làm hiện tại không còn phục vụ đúng mục đích mà nhân sự không nêu lại với người phụ trách','Tất cả nhân sự'],
   ['VH3.4','Nhân sự giao việc cho người khác mà chỉ nêu đầu việc, không nêu mục đích','Nhân sự giữ vai trò quản lý'],
   ['VH3.5','Nhân sự tự ý thay đổi cách làm hoặc cắt giảm công đoạn, gây ảnh hưởng xấu đến trải nghiệm của khách hoặc chất lượng chung','Tất cả nhân sự'],
   ['VH3.6','Nhân sự truyền đạt một chủ trương chung mà không diễn giải thành lý do cụ thể cho bộ phận mình phụ trách','Nhân sự giữ vai trò quản lý']
  ],'vi phạm'],
  ['VH4','ACTION PLAN, KẾ HOẠCH HÀNH ĐỘNG',[
   ['VH4.1','Nhân sự bắt tay vào việc mà chưa nêu được các bước sẽ làm','Tất cả nhân sự'],
   ['VH4.2','Kế hoạch của nhân sự là một danh sách rời, không có thời gian và thứ tự','Tất cả nhân sự'],
   ['VH4.3','Nhân sự báo cáo bằng cách kể lại việc đã làm, không báo theo kế hoạch đã nêu','Tất cả nhân sự'],
   ['VH4.4','Kế hoạch của nhân sự bỏ qua các rủi ro đã được cảnh báo trước, hoặc không có phương án xử lý khi phát sinh sự cố đã lường trước','Tất cả nhân sự'],
   ['VH4.5','Kế hoạch nhân sự giao cho người khác thiếu thời gian, người phụ trách, nguồn lực hoặc mốc đánh giá','Nhân sự giữ vai trò quản lý']
  ],'vi phạm'],
  ['VH5','TIME MANAGEMENT, QUẢN LÝ THỜI GIAN',[
   ['VH5.1','Nhân sự tập trung làm các công việc không quan trọng, bỏ quên công việc quan trọng hoặc khẩn cấp được giao trong ca','Tất cả nhân sự'],
   ['VH5.2','Khi có nhiều việc cùng lúc, nhân sự không làm việc quan trọng và khẩn cấp trước','Tất cả nhân sự'],
   ['VH5.3','Nhân sự hoàn thành công việc trễ hạn','Tất cả nhân sự'],
   ['VH5.4','Nhân sự không dành được thời gian cho việc quan trọng nhưng chưa khẩn cấp','Tất cả nhân sự'],
   ['VH5.5','Nhân sự để việc quan trọng chưa khẩn cấp trở thành việc khẩn cấp','Tất cả nhân sự'],
   ['VH5.6','Cách sắp xếp công việc của nhân sự làm người khác phải xử lý gấp. Không tính việc gấp phát sinh từ nguyên nhân khách quan hoặc thuộc trách nhiệm chung của bộ phận','Tất cả nhân sự']
  ],'vi phạm'],
  ['VH6','PROACTIVE, TƯ DUY CHỦ ĐỘNG',[
   ['VH6.1','Nhân sự chờ có người nhắc mới bắt đầu việc thuộc phạm vi của mình','Tất cả nhân sự'],
   ['VH6.2','Nhân sự làm việc đối phó: làm cho xong để báo cáo, chỉ làm khi có người kiểm, hoặc làm đúng chữ được giao mà sai mục đích của việc','Tất cả nhân sự'],
   ['VH6.3','Nhân sự phát hiện sự cố hoặc vấn đề phát sinh tại điểm bán, tại xưởng nhưng không báo cho người phụ trách và không hỗ trợ xử lý theo quy trình','Tất cả nhân sự'],
   ['VH6.4','Nhân sự dừng ở chỗ đã báo cáo hoặc đã chuyển cho người khác, không theo tiếp tới khi việc có kết quả','Tất cả nhân sự'],
   ['VH6.5','Nhân sự lặp lại cùng một sai sót, sự cố đã xảy ra trước đó mà không chủ động đề xuất phương án khắc phục với quản lý','Tất cả nhân sự']
  ],'vi phạm'],
  ['VH7','SOLUTION FOCUS, ĐỊNH HƯỚNG GIẢI PHÁP',[
   ['VH7.1','Nhân sự báo vấn đề chậm, hoặc báo không đúng người','Tất cả nhân sự'],
   ['VH7.2','Khi nêu vấn đề, nhân sự kể lể tình tiết và cảm xúc thay vì mô tả đúng sự việc','Tất cả nhân sự'],
   ['VH7.3','Nhân sự nêu vấn đề mà không kèm hướng xử lý nào','Tất cả nhân sự'],
   ['VH7.4','Nhân sự nhiều lần nói lại một vấn đề đã được cấp trên ghi nhận và đã báo thời hạn thực thi giải pháp','Tất cả nhân sự'],
   ['VH7.5','Một vấn đề lặp lại nhiều lần mà nhân sự chỉ xử lý phần ngọn, không truy nguyên nhân gốc','Tất cả nhân sự']
  ],'vi phạm'],
  ['VH8','SỨ MỆNH',[
   ['VH8.1','Khách hỏi về dự án mà nhân sự trả lời sai thông tin, trả lời dài dòng, hoặc kể hoàn cảnh cá nhân của người khác','Vị trí có đầu việc tại điểm bán'],
   ['VH8.2','Nhân sự chủ động thuyết giảng về sứ mệnh khi khách không hỏi','Vị trí có đầu việc tại điểm bán'],
   ['VH8.3','Nhân sự có hành vi, lời nói hoặc hình ảnh làm khách, đối tác hiểu sai rằng Công ty đang dùng người điếc/ khiếm thính như một yếu tố xin lòng trắc ẩn để bán hàng','Tất cả nhân sự'],
   ['VH8.4','Nhân sự có hành vi hoặc lời nói phân biệt đối xử, làm hộ, tước đi quyền tự quyết và trách nhiệm công việc của đồng nghiệp người điếc/ khiếm thính','Tất cả nhân sự'],
   ['VH8.5','Nhân sự lấy yếu tố mô hình xã hội hoặc người điếc/ khiếm thính ra làm lý do biện hộ khi sản phẩm, dịch vụ bị khách phản ánh về chất lượng','Tất cả nhân sự'],
   ['VH8.6','Người nói và người điếc/ khiếm thính đang không hiểu nhau ngay trước mặt mà nhân sự không làm cầu nối','Tất cả nhân sự'],
   ['VH8.7','Nhân sự truyền đạt sai giá trị hoặc sứ mệnh của Công ty cho đồng nghiệp','Tất cả nhân sự']
  ],'vi phạm'],
  ['VH9','MÙI HƯƠNG, GIÁ TRỊ CỐT LÕI',[
   ['VH9.1','Nhân sự giao hàng cho khách mà không xịt hương lên tay cầm túi, kể cả túi giấy nhỏ','Vị trí có đầu việc tại điểm bán'],
   ['VH9.2','Nhân sự dùng mùi ngoài quy định chung của hệ thống','Vị trí có đầu việc tại điểm bán'],
   ['VH9.3','Nhân sự vệ sinh không gian bằng thứ khác thay cho bình xịt sả chanh của Nhà','Vị trí có đầu việc tại điểm bán'],
   ['VH9.4','Nhân sự không vận hành bộ khuếch tán tinh dầu sả java trên khu vực và đúng định mức quy định trong ca','Vị trí có đầu việc tại điểm bán'],
   ['VH9.5','Mùi trong không gian yếu hoặc lẫn mùi lạ mà nhân sự không xử lý, cho tới khi khách hoặc quản lý nhận ra','Vị trí có đầu việc tại điểm bán']
  ],'vi phạm'],
  ['VH10','ÂM THANH, VĂN HÓA TÔN TRỌNG KHÔNG GIAN',[
   ['VH10.1','Trong ca của nhân sự, không gian không có nhạc phát, hoặc nhạc bị tắt giữa ca','Vị trí có đầu việc tại điểm bán'],
   ['VH10.2','Nhân sự để âm lượng lệch mức đã quy định','Vị trí có đầu việc tại điểm bán'],
   ['VH10.3','Nhân sự tự chỉnh âm lượng theo cảm xúc cá nhân mà không hỏi người phụ trách','Vị trí có đầu việc tại điểm bán'],
   ['VH10.4','Khi không gian bị ồn, nhân sự không chủ động dùng biển chỉ dẫn hoặc thẻ gợi ý ngôn ngữ ký hiệu để mời khách điều chỉnh âm lượng','Vị trí có đầu việc tại điểm bán'],
   ['VH10.5','Nhân sự nhắc khách về độ ồn sai quy chuẩn giao tiếp, hoặc bằng thái độ thiếu khéo léo gây gắt gỏng','Vị trí có đầu việc tại điểm bán'],
   ['VH10.6','Âm lượng hoặc tiếng ồn vượt mức quy định mà nhân sự không xử lý, cho tới khi khách phản ứng hoặc quản lý trực tiếp phải nhắc','Vị trí có đầu việc tại điểm bán']
  ],'vi phạm'],
  ['VH11','CÂY XANH, Ý THỨC GÌN GIỮ GIÁ TRỊ TỰ NHIÊN',[
   ['VH11.1','Nhân sự tự ý di chuyển hoặc tác động lên cây','Vị trí có đầu việc tại điểm bán'],
   ['VH11.2','Nhân sự không chăm sóc và giữ gìn phần cây trong khu vực mình phụ trách','Vị trí có đầu việc tại điểm bán'],
   ['VH11.3','Nhân sự không chủ động nhắc nhở hoặc báo cáo quản lý khi phát hiện cây xanh trong khu vực bị hư hại, bị tác động sai quy định','Vị trí có đầu việc tại điểm bán'],
   ['VH11.4','Nhân sự nhắc khách về việc giữ gìn cây xanh bằng thái độ hoặc từ ngữ thiếu chuẩn mực giao tiếp','Vị trí có đầu việc tại điểm bán'],
   ['VH11.5','Nhân sự tư vấn hoặc trả lời sai thông tin ý nghĩa logo của Nhà khi khách hỏi','Vị trí có đầu việc tại điểm bán'],
   ['VH11.6','Nhân sự thấy cây bị héo, hỏng hoặc đặt sai vị trí mà không báo người phụ trách','Vị trí có đầu việc tại điểm bán']
  ],'vi phạm'],
  ['VH12','KHÔNG GIAN, TRÁCH NHIỆM CỦA TẤT CẢ',[
   ['VH12.1','Nhân sự bỏ qua chi tiết chưa sạch, chưa đẹp, chưa dễ chịu trong khu vực mình đứng','Vị trí có đầu việc tại điểm bán'],
   ['VH12.2','Nhân sự không chủ động hỗ trợ dọn dẹp, chăm sóc khu vực chung hoặc khu vực lân cận khi khu vực đó đang quá tải hay chưa đạt chuẩn','Vị trí có đầu việc tại điểm bán'],
   ['VH12.3','Đầu ca, nhân sự không quan sát toàn bộ không gian và không xử lý xong trước khi khách vào','Vị trí có đầu việc tại điểm bán'],
   ['VH12.4','Nhân sự không xử lý và không báo cáo quản lý khi phát hiện chi tiết lệch chuẩn trong không gian: vật dụng đặt sai chỗ, vết bẩn, hỏng hóc','Vị trí có đầu việc tại điểm bán'],
   ['VH12.5','Nhân sự ra về hoặc rời vị trí công tác mà không kiểm tra, không tắt các thiết bị điện và công cụ, gây lãng phí hoặc mất an toàn','Vị trí có đầu việc tại điểm bán']
  ],'vi phạm'],
  ['TC1','GIAO TIẾP VÀ PHỐI HỢP',[
   ['TC1.1','Nhân sự trao đổi không rõ trong phạm vi việc của mình, người khác phải hỏi lại mới hiểu','Tất cả nhân sự'],
   ['TC1.2','Nhân sự không thông tin cho người liên quan, cho tới khi họ phải hỏi','Tất cả nhân sự'],
   ['TC1.3','Bất đồng trong bộ phận thuộc thẩm quyền của nhân sự mà nhân sự không xử lý bằng trao đổi trực tiếp','Tất cả nhân sự'],
   ['TC1.4','Nhân sự làm việc với bộ phận khác không trôi chảy khi hai bên có ưu tiên khác nhau','Tất cả nhân sự']
  ],'vi phạm'],
  ['TC3','CÔNG NGHỆ VÀ CÔNG CỤ, PHẦN CHUẨN',[
   ['TC3.1','Nhân sự phải có người nhắc mới dùng bộ công cụ số bắt buộc của vị trí mình','Tất cả nhân sự'],
   ['TC3.2','Nhân sự nhập dữ liệu sai chuẩn, phải sửa lại sau','Tất cả nhân sự'],
   ['TC3.3','Nhân sự không thực hiện đúng các thao tác xử lý sự cố công cụ hoặc phần mềm cơ bản đã được hướng dẫn trong tài liệu chuẩn','Tất cả nhân sự'],
   ['TC3.4','Nhân sự dùng kết quả do AI sinh ra mà không rà lại','Tất cả nhân sự'],
   ['TC3.5','Nhân sự không cập nhật trạng thái công việc, báo cáo lên phần mềm và công cụ chung đúng thời gian quy định','Tất cả nhân sự'],
   ['TC3.6','Nhân sự dùng sai công cụ cho loại việc đang làm, và không nêu được căn cứ chọn','Tất cả nhân sự'],
   ['TC3.7','Sản phẩm nhân sự giao phải làm lại vì chưa đúng chuẩn ngay lần đầu','Tất cả nhân sự'],
   ['TC3.8','Người khác phải hỏi thêm mới dùng lại được sản phẩm nhân sự giao','Tất cả nhân sự']
  ],'vi phạm'],
  ['TC6','THẤU CẢM & HÒA HỢP TRONG ĐỘI NHÓM',[
   ['TC6.1','Nhân sự trao đổi về sai sót của một đồng nghiệp trước mặt người khác, trong khi việc đó trao đổi riêng được','Tất cả nhân sự'],
   ['TC6.2','Đồng nghiệp nêu ý kiến khác, nhân sự phản ứng về người nêu thay vì trao đổi về nội dung ý kiến','Tất cả nhân sự'],
   ['TC6.3','Nhân sự hối thúc hoặc đòi hỏi bộ phận khác xử lý gấp việc của mình mà bỏ qua quy trình và thời gian xử lý chuẩn đã cam kết giữa các bên','Tất cả nhân sự'],
   ['TC6.4','Nhân sự thiếu kiên nhẫn hoặc bỏ qua việc dùng các công cụ hỗ trợ giao tiếp là viết giấy, ngôn ngữ ký hiệu, hình ảnh khi trao đổi công việc với đồng nghiệp người điếc/ khiếm thính và người nói','Tất cả nhân sự']
  ],'vi phạm'],
  ['NL1','NGÔN NGỮ VÀ SỨ MỆNH',[
   ['NL1.1','Nhân sự chào hỏi và trao đổi việc đơn giản bằng ngôn ngữ ký hiệu','Tất cả nhân sự'],
   ['NL1.3','Nhân sự kèm được đồng nghiệp học ngôn ngữ của nhóm kia','Tất cả nhân sự'],
   ['NL1.4','Nhân sự trao đổi công việc hằng ngày bằng ngôn ngữ ký hiệu mà không cần người phiên dịch','Nhân sự người nói'],
   ['NL1.5','Nhân sự trao đổi được nội dung chuyên môn của vị trí mình bằng ngôn ngữ ký hiệu','Nhân sự người nói'],
   ['NL1.6','Nhân sự hướng dẫn được nhân sự người điếc/ khiếm thính về công việc bằng ngôn ngữ ký hiệu, không qua phiên dịch','Nhân sự người nói'],
   ['NL1.7','Nhân sự đọc hiểu được văn bản công việc bằng tiếng Việt: quy trình, thông báo, tin nhắn','Nhân sự người điếc/ khiếm thính'],
   ['NL1.8','Nhân sự viết và nhắn tin công việc bằng tiếng Việt, người nhận hiểu đúng và không phải hỏi lại','Nhân sự người điếc/ khiếm thính'],
   ['NL1.9','Nhân sự trao đổi được nội dung chuyên môn của vị trí mình bằng tiếng Việt viết','Nhân sự người điếc/ khiếm thính'],
   ['NL1.10','Nhân sự hướng dẫn được nhân sự người nói về công việc bằng tiếng Việt viết, không qua phiên dịch','Nhân sự người điếc/ khiếm thính']
  ],'ghi nhận'],
  ['NL2','LÀM CHỦ VIỆC VÀ NÂNG CHUẨN',[
   ['NL2.3','Nhân sự đề xuất và nhận làm việc chưa ai giao mà bộ phận đang cần, và việc đó ra kết quả','Tất cả nhân sự'],
   ['NL2.4','Trong việc liên quan nhiều bên, nhân sự là người đề xuất và điều phối chứ không phải người chờ','Tất cả nhân sự']
  ],'ghi nhận'],
  ['NL3','CÔNG NGHỆ VÀ CÔNG CỤ, PHẦN NÂNG CAO',[
   ['NL3.4','Nhân sự dùng công cụ hoặc AI để cải tiến việc của mình hoặc của nhóm','Tất cả nhân sự'],
   ['NL3.5','Nhân sự đề xuất công cụ cho bộ phận và hướng dẫn lại được người khác sử dụng','Nhân sự giữ vai trò quản lý'],
   ['NL3.6','Nhân sự xây được công cụ hoặc hệ thống khi sản phẩm có sẵn không đáp ứng đặc thù của Công ty','Từ Trưởng phòng trở lên'],
   ['NL3.7','Hệ thống do nhân sự xây có tài liệu vận hành đủ để người khác tiếp nhận','Từ Trưởng phòng trở lên'],
   ['NL3.8','Hệ thống do nhân sự xây tiếp tục chạy được khi người xây vắng mặt','Từ Trưởng phòng trở lên']
  ],'ghi nhận'],
  ['NL4','ĐA NHIỆM',[
   ['NL4.1','Nhân sự hoàn thành tốt công việc chính và sẵn sàng nhận thêm việc hỗ trợ ngay trong ca làm việc','Tất cả nhân sự'],
   ['NL4.2','Nhân sự hỗ trợ được việc ngoài vị trí khi bộ phận cần, trong thời gian ngắn','Tất cả nhân sự'],
   ['NL4.3','Nhân sự đảm nhận thêm được một công việc ngoài việc chính mà không ảnh hưởng việc chính','Tất cả nhân sự'],
   ['NL4.4','Nhân sự làm chủ và kiêm nhiệm hiệu quả từ 02 vai trò hoặc vị trí công việc độc lập trở lên trong bộ phận','Tất cả nhân sự'],
   ['NL4.5','Nhân sự thay thế được nhân sự khác trong bộ phận khi thiếu người','Tất cả nhân sự'],
   ['NL4.6','Nhân sự làm được việc của vị trí khác hoặc của cấp cao hơn khi Công ty cần','Tất cả nhân sự']
  ],'ghi nhận']
];

/* Phần riêng của từng tuyến hoặc chức năng. */
const CAU_HOI_TUYEN = {

'Thương mại & Dịch vụ': {
  chuyenMon: [
   ['B1','BƯỚC 1, TẠO TÍN NHIỆM VỚI KHÁCH HÀNG',[
    ['B1.1','Nhân sự không dùng danh xưng Nhà, Quán, Xưởng, hoặc xưng hô với khách không đúng cách đã quy định','Tất cả nhân sự'],
    ['B1.2','Tác phong của nhân sự thiếu lễ phép, không dùng dạ, vâng ạ, xin gửi, xin được trao đổi','Tất cả nhân sự'],
    ['B1.3','Nhân sự kì kèo, đánh giá khách hàng, hoặc chứng minh khách hàng sai','Tất cả nhân sự'],
    ['B1.4','Nhân sự nói xấu đối thủ hoặc đem đối thủ ra so sánh','Tất cả nhân sự'],
    ['B1.5','Nhân sự giới thiệu sai thông tin cốt lõi, hoặc cung cấp thông tin không đúng sự thật về Công ty cho khách','Tất cả nhân sự'],
    ['B1.6','Nhân sự ngắt lời, phớt lờ hoặc không lắng nghe khi khách phản ánh vấn đề, băn khoăn','Tất cả nhân sự'],
    ['B1.7','Nhân sự dùng từ "nhưng", thay vì dùng "và" kèm một câu trả lời có nội dung','Tất cả nhân sự']
   ],'vi phạm'],
   ['B2','BƯỚC 2, KHAI THÁC VẤN ĐỀ VÀ NHU CẦU',[
    ['B2.1','Nhân sự hỏi từ 03 câu trở lên nhưng không xác định được nhu cầu hoặc vấn đề chính của khách','Tất cả nhân sự'],
    ['B2.2','Câu hỏi của nhân sự không làm rõ được kết quả cần đạt, mục đích hoặc bước tiếp theo','Tất cả nhân sự'],
    ['B2.3','Nhân sự kết thúc lượt nói mà không có câu hỏi hoặc lời đề nghị, làm mạch trao đổi đứt','Tất cả nhân sự'],
    ['B2.5','Nhân sự không đặt câu hỏi gợi mở, chỉ chờ khách tự nêu vấn đề mới tư vấn','Tất cả nhân sự'],
    ['B2.6','Nhân sự phải quay lại hỏi thêm sau khi đã đề xuất giải pháp, vì chưa xác định đúng vấn đề trong lượt tư vấn','Tất cả nhân sự']
   ],'vi phạm'],
   ['B3','BƯỚC 3 TỚI 6, CUNG CẤP GIẢI PHÁP, CHỐT ĐƠN VÀ XỬ LÝ TỪ CHỐI',[
    ['B3.1','Nhân sự chọn sản phẩm chỉ dựa vào yêu cầu bề ngoài của khách, không hỏi để xác định vấn đề thực sự cần giải quyết','Tất cả nhân sự'],
    ['B3.2','Nhân sự chọn sai sản phẩm cho vấn đề của khách','Tất cả nhân sự'],
    ['B3.3','Nhân sự không giải thích được vì sao chọn sản phẩm này thay vì sản phẩm khác','Tất cả nhân sự'],
    ['B3.4','Sản phẩm của Công ty không phải giải pháp mà nhân sự vẫn bán, không nói ra và không từ chối','Tất cả nhân sự'],
    ['B3.5','Nhân sự không ghép được các sản phẩm thành một bộ giải quyết trọn một vấn đề cụ thể','Tất cả nhân sự'],
    ['B3.6','Nhân sự tự ý tư vấn kết hợp các sản phẩm nằm ngoài danh mục giải pháp đã được Công ty phê duyệt','Tất cả nhân sự'],
    ['B3.7','Nhân sự chốt thử khi chưa có tín nhiệm, chưa rõ vấn đề, hoặc chưa đề xuất một giải pháp cụ thể','Tất cả nhân sự'],
    ['B3.8','Khách đã có dấu hiệu sẵn sàng mà nhân sự vẫn nói tiếp','Tất cả nhân sự'],
    ['B3.9','Nhân sự dùng câu hỏi đóng kiểu hỏi khách có mua không, thay vì đặt lời đề nghị khẳng định','Tất cả nhân sự'],
    ['B3.10','Nhân sự bỏ qua cơ hội bán chéo và bán nâng cấp tạo thêm giá trị cho khách','Tất cả nhân sự'],
    ['B3.11','Nhân sự bỏ dở cuộc tư vấn, hoặc hạ giá và ưu đãi trái quy định ngay khi khách vừa đưa ra băn khoăn về giá','Tất cả nhân sự'],
    ['B3.12','Nhân sự xử băn khoăn của khách khi chưa hỏi xác nhận đó có phải băn khoăn duy nhất không','Tất cả nhân sự'],
    ['B3.13','Nhân sự tranh luận từng lý do thay vì nhắc lại vấn đề cốt lõi','Tất cả nhân sự'],
    ['B3.14','Phát sinh từ chối mới mà nhân sự bỏ dở, hoặc chuyển sang ép mua','Tất cả nhân sự']
   ],'vi phạm'],
   ['B5','BƯỚC 7, CHĂM SÓC SAU BÁN VÀ LAN TOẢ',[
    ['B5.1','Nhân sự hướng dẫn sử dụng chưa đủ để khách dùng đúng ngay lần đầu','Tất cả nhân sự'],
    ['B5.2','Nhân sự không cung cấp thông tin hậu mãi cho khách','Tất cả nhân sự'],
    ['B5.3','Nhân sự cắt kết nối sau khi khách đã thanh toán','Tất cả nhân sự'],
    ['B5.4','Nhân sự không chủ động nhắn tin hoặc gọi điện hỏi thăm trải nghiệm sử dụng của khách theo đúng lịch chăm sóc hậu mãi đã quy định','Tất cả nhân sự'],
    ['B5.5','Nhân sự không bàn giao đầy đủ thông tin đơn hàng cho các bộ phận liên quan là xưởng, vận chuyển, đội ca sau, làm gián đoạn trải nghiệm của khách','Tất cả nhân sự'],
    ['B5.6','Nhân sự không hướng dẫn khách để lại đánh giá theo đúng quy chuẩn','Tất cả nhân sự']
   ],'vi phạm'],
   ['C6','KIẾN THỨC SẢN PHẨM, THỰC ĐƠN VÀ AN TOÀN SẢN PHẨM',[
    ['C6.1','Nhân sự không nắm tên và công dụng chính của các nhóm sản phẩm','Tất cả nhân sự'],
    ['C6.2','Nhân sự phải hỏi lại người khác về công dụng, cách dùng, thành phần, hạn sử dụng, cách bảo quản hoặc cảnh báo an toàn của một nhóm sản phẩm','Tất cả nhân sự'],
    ['C6.3','Nhân sự không nắm thực đơn đồ uống và các set trà của Quán','Tất cả nhân sự'],
    ['C6.4','Nhân sự không nêu được các trường hợp chống chỉ định, hoặc đối tượng không nên sử dụng của sản phẩm khi tư vấn cho khách','Tất cả nhân sự'],
    ['C6.6','Nhân sự không tư vấn được cho khách về sản phẩm của tuyến Pha chế và tuyến Bếp bánh','Tất cả nhân sự'],
    ['C6.7','Người trong tuyến hỏi về sản phẩm mà nhân sự không trả lời được','Tất cả nhân sự'],
    ['C6.8','Khách mua một sản phẩm mà nhân sự chưa nêu cảnh báo an toàn của chính sản phẩm đó, hoặc chỉ nêu khi khách hỏi','Tất cả nhân sự'],
    ['C6.9','Khách mua một sản phẩm mà nhân sự không nêu những đối tượng không dùng được sản phẩm đó','Tất cả nhân sự'],
    ['C6.10','Khách mua một sản phẩm cần thử trước khi dùng mà nhân sự không hướng dẫn cách dùng lần đầu','Tất cả nhân sự'],
    ['C6.11','Khách mua một sản phẩm mà nhân sự không nêu hạn sử dụng và cách bảo quản khi bàn giao','Tất cả nhân sự']
   ],'vi phạm'],
   ['C7','BÁN CHO NHIỀU KHÁCH CÙNG LÚC',[
    ['C7.1','Có khách bị bỏ quên khi nhân sự tiếp nhiều khách cùng lúc','Tất cả nhân sự'],
    ['C7.2','Trong khung giờ đông, nhân sự chọn sai lúc nào tư vấn một đối một và lúc nào giới thiệu cùng lúc cho cả nhóm','Tất cả nhân sự'],
    ['C7.3','Chất lượng khai thác vấn đề của nhân sự tụt khi phải chia sự chú ý','Tất cả nhân sự'],
    ['C7.4','Với nhóm khách đi cùng nhau, nhân sự không nhận ra người ra quyết định và người ảnh hưởng tới quyết định','Tất cả nhân sự'],
    ['C7.5','Tỷ lệ chốt của nhân sự trong khung giờ đông thấp hơn đáng kể so với khung giờ thường','Tất cả nhân sự'],
    ['C7.6','Nhân sự không đề xuất được cách tiếp khách cho khung giờ đông với người phụ trách đơn vị','Tất cả nhân sự']
   ],'vi phạm'],
   ['C8','TỰ TẠO NGUỒN KHÁCH QUA KÊNH CÁ NHÂN, VÀ GIỮ NỘI DUNG ĐĂNG ĐÚNG QUY CHUẨN THƯƠNG HIỆU, KHÔNG SAI LỆCH THÔNG TIN SẢN PHẨM',[
    ['C8.1','Có khách tự tìm đến nhân sự qua kênh cá nhân của nhân sự: nội dung đăng, livestream hoặc cách khác','Tất cả nhân sự'],
    ['C8.2','Nội dung nhân sự đăng trên kênh cá nhân đúng bộ nhận diện và thông điệp chuẩn của Thương hiệu, và đúng thông tin sản phẩm','Tất cả nhân sự'],
    ['C8.3','Nhân sự chủ động tương tác lại với khách đã mua qua kênh cá nhân của mình','Tất cả nhân sự'],
    ['C8.5','Nhân sự phản hồi thắc mắc và tin nhắn của khách tiềm năng đến qua kênh cá nhân trong thời hạn đã quy định','Tất cả nhân sự']
   ],'ghi nhận']
  ],
  quanLy: [
   ['QG','GIỮ CHUẨN QUẢN LÝ',[
    ['QG1','Nhân sự thấy hành vi vượt ranh giới mà không nhắc, không chặn tại chỗ, hoặc không báo lên trong ca','Nhân sự giữ vai trò quản lý'],
    ['QG2','Nhân sự chờ có sự việc mới kiểm tra, hoặc xử lý vi phạm không đúng thang','Nhân sự giữ vai trò quản lý'],
    ['QG3','Nhân sự chi vượt định mức hoặc hạn mức được giao','Nhân sự giữ vai trò quản lý'],
    ['QG4','Nhân sự ghi nhận sai dữ liệu bán vào hệ thống','Nhân sự giữ vai trò quản lý'],
    ['QG5','Nhân sự không kiểm tra tính tuân thủ quy trình của người trong đơn vị theo nhịp đã quy định, hoặc có kiểm tra mà không ghi lại kết quả','Nhân sự giữ vai trò quản lý']
   ],'vi phạm'],
   ['QA','VẬN HÀNH TUYẾN',[
    ['QA1','Nhân sự tổ chức được công việc trong phạm vi đơn vị mình phụ trách','Nhân sự giữ vai trò quản lý'],
    ['QA2','Nhân sự nhận chỉ tiêu và phân bổ xuống từng người theo năng lực thật, giải thích được bằng số liệu chứ không chia đều','Nhân sự giữ vai trò quản lý'],
    ['QA4','Nhân sự giữ đơn vị chạy được khi nhân sự chủ chốt vắng mặt','Nhân sự giữ vai trò quản lý'],
    ['QA5','Nhân sự điều chỉnh phân bổ trong kỳ khi thực tế thay đổi','Nhân sự giữ vai trò quản lý'],
    ['QA6','Nhân sự bảo đảm chỉ tiêu và chương trình đặt ra luôn có đường đạt kết quả mà vẫn giữ đúng quy định','Nhân sự giữ vai trò quản lý']
   ],'vi phạm'],
   ['QB','ĐỘI NGŨ, PHỐI HỢP VÀ KÈM NGHỀ',[
    ['QB1','Nhân sự thiết lập lộ trình kèm nghề một kèm một cho nhân sự đang thử việc và cho nhân sự chưa đạt chuẩn ở kỳ đánh giá trước, rồi nghiệm thu theo lộ trình đó','Nhân sự giữ vai trò quản lý'],
    ['QB2','Nghe một lượt tiếp khách của người khác, nhân sự chỉ ra được người đó đang mắc ở bước nào','Nhân sự giữ vai trò quản lý'],
    ['QB3','Nhân sự tổ chức buổi chia sẻ hoặc huấn luyện nội bộ ngắn cho đội ngũ trong tuyến theo nhịp tuần, nội dung về kỹ năng xử lý tình huống','Nhân sự giữ vai trò quản lý'],
    ['QB6','Nhân sự hệ thống hóa cách bán của tuyến thành tài liệu chuyển giao','Nhân sự giữ vai trò quản lý']
   ],'vi phạm'],
   ['QC','CHI PHÍ BÁN HÀNG VÀ CƠ CẤU HÀNG BÁN',[
    ['QC1','Nhân sự đề xuất đẩy hoặc ngừng một sản phẩm kèm số liệu bán','Nhân sự giữ vai trò quản lý'],
    ['QC6','Đề xuất chương trình khuyến mãi của nhân sự kèm tính toán chi phí bán hàng, và tính toán đó khớp khi đối chiếu sau kỳ','Nhân sự giữ vai trò quản lý'],
    ['QC8','Nhân sự đề xuất điều chỉnh hoặc dừng một chương trình khuyến mãi khi chương trình đó không đạt ngưỡng hiệu quả đã đặt ra từ đầu','Nhân sự giữ vai trò quản lý']
   ],'vi phạm'],
   ['QD','THỊ TRƯỜNG VÀ BỘ SỐ',[
    ['QD1','Nhân sự theo dõi bộ số của đơn vị mình phụ trách, gồm tỷ lệ chuyển đổi, giá trị đơn trung bình và tỷ lệ đơn có bán thêm, và đề xuất phương án cải thiện trong kỳ','Nhân sự giữ vai trò quản lý'],
    ['QD2','Nhân sự trình bày số liệu cho người không quen đọc số','Nhân sự giữ vai trò quản lý'],
    ['QD3','Nhân sự đọc bộ số của bộ phận và chỉ ra được người nào đang mắc ở đâu','Nhân sự giữ vai trò quản lý'],
    ['QD4','Nhân sự nắm giá và chương trình khuyến mãi của đối thủ trong khu vực','Nhân sự giữ vai trò quản lý'],
    ['QD5','Nhân sự gửi báo cáo phân tích doanh thu và số liệu bán hàng tuần đúng hạn quy định','Nhân sự giữ vai trò quản lý']
   ],'vi phạm'],
   ['QE','HIỂU NGHỀ CỦA CÁC TUYẾN KHÁC TRONG ĐIỂM BÁN',[
    ['QE2','Nhân sự hiểu quy trình và điểm nghẽn của tuyến mình đủ để phân việc và nghiệm thu','Nhân sự giữ vai trò quản lý'],
    ['QE3','Nhân sự nghiệm thu được chất lượng của tuyến Pha chế và tuyến Bếp bánh','Nhân sự giữ vai trò quản lý'],
    ['QE4','Nhân sự xử lý được sự cố liên quan nhiều tuyến trong điểm bán','Nhân sự giữ vai trò quản lý']
   ],'vi phạm'],
   ['QF','NÂNG CHUẨN',[
    ['QF1','Nhân sự phát hiện cách làm hiệu quả trong đơn vị và báo lên','Nhân sự giữ vai trò quản lý'],
    ['QF2','Nhân sự mô tả lại cách làm đủ rõ để người khác trong bộ phận dùng lại được','Nhân sự giữ vai trò quản lý'],
    ['QF3','Nhân sự đề xuất chuẩn hóa sang Phòng Vận hành, mô tả đủ rõ để chuẩn hóa được mà không phải hỏi thêm','Nhân sự giữ vai trò quản lý'],
    ['QF4','Đề xuất của nhân sự được chấp thuận thành chuẩn dùng chung của Công ty','Nhân sự giữ vai trò quản lý'],
    ['QF6','Nhân sự xét duyệt các cách kết hợp nhiều sản phẩm do nhân viên đề xuất, và cho áp dụng chung trong Công ty những cách đạt yêu cầu','Nhân sự giữ vai trò quản lý']
   ],'ghi nhận'],
   ['QH','HỎI VÀ LẮNG NGHE TRONG ĐỘI NHÓM',[
    ['QH1','Nhân sự hỏi mà người trong nhóm không biết nhân sự đang cần làm rõ điều gì','Nhân sự giữ vai trò quản lý'],
    ['QH3','Nhân sự nêu nguyên nhân của sự việc khi chưa hỏi người trong cuộc, sau khi hỏi thì phải nói lại khác đi','Nhân sự giữ vai trò quản lý'],
    ['QH5','Sau trao đổi, hai bên không thống nhất được bước tiếp theo','Nhân sự giữ vai trò quản lý'],
    ['QH6','Nhân sự không nhận ra dấu hiệu một người trong nhóm đang có việc chưa nói ra','Nhân sự giữ vai trò quản lý'],
    ['QH7','Nhân sự không hướng dẫn lại được cách hỏi cho quản lý cấp dưới','Nhân sự giữ vai trò quản lý']
   ],'vi phạm'],
   ['QK','THẤU CẢM VỚI NGƯỜI MÌNH PHỤ TRÁCH',[
    ['QK1','Nhân sự chỉ trao đổi với người trong nhóm khi giao việc hoặc khi cần nhắc về sai sót','Nhân sự giữ vai trò quản lý'],
    ['QK2','Người trong nhóm nêu một khó khăn, nhân sự tiếp nhận nhưng không phản hồi lại hướng xử lý, cũng không nêu lý do chưa xử lý được','Nhân sự giữ vai trò quản lý'],
    ['QK3','Nhân sự nói sẽ xem xét một đề nghị của người trong nhóm rồi không trả lời lại','Nhân sự giữ vai trò quản lý'],
    ['QK4','Nhân sự không nắm được trở ngại của người trong nhóm, cho tới khi công việc trễ hạn hoặc người đó đề nghị nghỉ việc','Nhân sự giữ vai trò quản lý'],
    ['QK5','Nhân sự ra quyết định ảnh hưởng trực tiếp tới một người trong nhóm, ví dụ đổi ca hoặc đổi phân công, mà không trao đổi với người đó trước','Nhân sự giữ vai trò quản lý'],
    ['QK6','Có thay đổi về cách làm hoặc về phân công, nhân sự thông báo chung mà không trao đổi trước với người chịu ảnh hưởng nhiều nhất','Nhân sự giữ vai trò quản lý'],
    ['QK7','Bất đồng kéo dài giữa hai người trong nhóm mà nhân sự không xử lý dứt điểm','Nhân sự giữ vai trò quản lý']
   ],'vi phạm']
  ]
},

'Nhân sự - Hành chính - Pháp chế': {
  chuyenMon: [
   ['N1','THIẾT KẾ CƠ CẤU TỔ CHỨC VÀ HỆ THỐNG VỊ TRÍ',[
    ['N1.1','Nhân sự dựng được bản mô tả công việc theo khung hiện hành cho một vị trí','Tất cả nhân sự'],
    ['N1.2','Bản mô tả công việc do nhân sự dựng nêu rõ vị trí đó quyết được gì, báo cáo ai và ai báo cáo mình','Tất cả nhân sự'],
    ['N1.3','Danh mục vị trí và sơ đồ cơ cấu tổ chức khớp nhau, không có vị trí nằm ngoài cơ cấu','Tất cả nhân sự'],
    ['N1.4','Nhân sự thiết kế được cơ chế giao quyền cho một vị trí','Tất cả nhân sự'],
    ['N1.5','Bộ tài liệu do nhân sự dựng nhân bản được cho điểm mới mà không phải thiết kế lại','Tất cả nhân sự']
   ],'vi phạm'],
   ['N2','TUÂN THỦ PHÁP LUẬT LAO ĐỘNG VÀ QUAN HỆ LAO ĐỘNG',[
    ['N2.1','Nhân sự nêu được điều luật và văn bản gốc cho từng nội dung, không dẫn theo trí nhớ','Tất cả nhân sự'],
    ['N2.2','Hợp đồng lao động, hồ sơ bảo hiểm và hồ sơ thuế do nhân sự lập đúng quy định đang hiệu lực','Tất cả nhân sự'],
    ['N2.3','Nhân sự thực hiện đúng trình tự luật định khi xử lý kỷ luật lao động','Tất cả nhân sự'],
    ['N2.4','Nhân sự phát hiện rủi ro pháp lý trước khi sự việc xảy ra','Tất cả nhân sự'],
    ['N2.5','Nhân sự cập nhật kịp thời khi quy định pháp luật thay đổi','Tất cả nhân sự']
   ],'vi phạm'],
   ['N3','THIẾT KẾ CƠ CẤU THU NHẬP',[
    ['N3.1','Nhân sự giải thích được vì sao một vị trí ở mức thu nhập đó bằng cấu trúc, không bằng thương lượng từng người','Tất cả nhân sự'],
    ['N3.2','Cơ cấu thu nhập giải thích được cho người lao động và cho Ban lãnh đạo bằng cùng một bộ số','Tất cả nhân sự'],
    ['N3.3','Tham số trong công thức tính lương được tách riêng, không nằm lẫn trong công thức','Tất cả nhân sự'],
    ['N3.4','Nhân sự tính đúng và không lẫn ba đại lượng quỹ lương, lương gộp và lương thực nhận','Tất cả nhân sự'],
    ['N3.5','Bảng lương do nhân sự lập không phát sinh khiếu nại về cách tính','Tất cả nhân sự']
   ],'vi phạm'],
   ['N4','TUYỂN DỤNG VÀ HỘI NHẬP',[
    ['N4.1','Nhân sự dựng được chân dung vị trí trước khi mở tuyển','Tất cả nhân sự'],
    ['N4.2','Nhân sự chọn đúng kênh tuyển cho từng loại vị trí','Tất cả nhân sự'],
    ['N4.3','Nhận định của nhân sự về ứng viên khi tuyển khớp với kết quả làm việc thực tế sau đó','Tất cả nhân sự'],
    ['N4.4','Nhân sự tổ chức được quá trình hội nhập để người mới vào việc được ngay','Tất cả nhân sự'],
    ['N4.5','Người do nhân sự tuyển ở lại sau 90 ngày','Tất cả nhân sự']
   ],'vi phạm'],
   ['N5','ĐÀO TẠO VÀ PHÁT TRIỂN NĂNG LỰC',[
    ['N5.1','Nội dung đào tạo do nhân sự xác định dẫn từ vướng mắc có thật của công việc, không từ giáo trình bên ngoài','Tất cả nhân sự'],
    ['N5.2','Nhân sự dựng được khung và nhịp để nơi nhân viên trực tiếp làm tổ chức được phần đào tạo chuyên môn','Tất cả nhân sự'],
    ['N5.3','Nhân sự thiết kế được chương trình đào tạo kỹ năng chung, dùng được cho mọi vị trí trong Công ty','Tất cả nhân sự'],
    ['N5.4','Nhân sự thiết kế được chương trình đào tạo văn hóa dùng chung cho cả Công ty','Tất cả nhân sự'],
    ['N5.5','Người được đào tạo tiến bộ đo được so với trước khi đào tạo','Tất cả nhân sự'],
    ['N5.6','Thời gian một người mới hoàn tất phần hội nhập và phần đào tạo chung rút ngắn so với kỳ trước','Tất cả nhân sự']
   ],'vi phạm'],
   ['N6','ĐÁNH GIÁ VÀ XẾP BẬC',[
    ['N6.1','Nhân sự dựng được bộ tiêu chí đánh giá cho một chức năng','Tất cả nhân sự'],
    ['N6.2','Bộ tiêu chí do nhân sự dựng đủ rõ để hai người chấm độc lập cho kết quả tương đương','Tất cả nhân sự'],
    ['N6.3','Mỗi kết luận đánh giá dẫn được ra bằng chứng công việc cụ thể','Tất cả nhân sự'],
    ['N6.4','Hồ sơ đánh giá do nhân sự lập không có ô chấm bằng cảm nhận','Tất cả nhân sự'],
    ['N6.5','Kết luận đánh giá không bị rút lại sau khi người được đánh giá nêu ý kiến','Tất cả nhân sự']
   ],'vi phạm'],
   ['N7','TRỤC ĐIẾC-NGHE VÀ CÔNG BẰNG HỆ THỐNG',[
    ['N7.1','Nhân sự nêu được rào cản thật của từng đầu việc đối với người điếc/ khiếm thính','Tất cả nhân sự'],
    ['N7.2','Nhân sự đề xuất được cách thay thế rào cản đó','Tất cả nhân sự'],
    ['N7.3','Nhân sự soạn được chuẩn giao tiếp nội bộ và chuẩn họp chung cho cả hai cộng đồng','Tất cả nhân sự'],
    ['N7.4','Nhân sự tổ chức được đào tạo song ngữ hai chiều','Tất cả nhân sự'],
    ['N7.5','Nhân sự thiết kế lại được một vị trí do người nói giữ để người điếc/ khiếm thính đảm nhận được','Tất cả nhân sự'],
    ['N7.6','Phân bố kết quả đánh giá và ghi nhận giữa hai cộng đồng không lệch vì khả năng nghe nói','Tất cả nhân sự']
   ],'vi phạm'],
   ['N8','VĂN HÓA THÀNH CƠ CHẾ SỐNG',[
    ['N8.1','Nhân sự đưa được bộ giá trị của Công ty vào nhịp vận hành hằng ngày, không dừng ở văn bản','Tất cả nhân sự'],
    ['N8.2','Nhân sự vận hành được Chuẩn phản hồi trong Công ty','Tất cả nhân sự'],
    ['N8.3','Nhân sự tổ chức được các nghi lễ nội bộ theo nhịp đã định','Tất cả nhân sự'],
    ['N8.4','Sau đợt truyền đạt của nhân sự, người trong Công ty nêu lại được giá trị bằng hành vi cụ thể chứ không bằng khẩu hiệu','Tất cả nhân sự'],
    ['N8.5','Phản hồi đi qua kênh chính thức được đóng vòng đúng hạn','Tất cả nhân sự']
   ],'vi phạm'],
   ['N9','ĐỐI TÁC CỦA CÁC BỘ PHẬN',[
    ['N9.1','Nhân sự nắm được tình hình con người của từng bộ phận, không chờ bộ phận báo lên','Tất cả nhân sự'],
    ['N9.2','Các trưởng bộ phận tìm đến nhân sự khi đang cân nhắc một quyết định chạm tới con người, không phải sau khi đã quyết','Tất cả nhân sự'],
    ['N9.3','Ý kiến nhân sự đưa ra khi được tham vấn đủ để bộ phận ra quyết định, không phải hỏi thêm vòng hai','Tất cả nhân sự'],
    ['N9.4','Quyết định về con người của các bộ phận không phải làm lại vì bỏ qua bước tham vấn','Tất cả nhân sự']
   ],'vi phạm'],
   ['N10','THAM MƯU BAN LÃNH ĐẠO',[
    ['N10.1','Phương án nhân sự trình lên có đánh giá tác động','Từ Chuyên viên trở lên'],
    ['N10.2','Phương án nhân sự trình lên nêu cả mặt trái của chính phương án đó','Từ Chuyên viên trở lên'],
    ['N10.3','Nhân sự phân biệt rõ trong phương án chỗ nào là số liệu, chỗ nào là ước lượng','Từ Chuyên viên trở lên'],
    ['N10.4','Phương án nhân sự trình lên được quyết ngay trong buổi, không phải quay lại bổ sung dữ kiện','Từ Chuyên viên trở lên'],
    ['N10.5','Phương án nhân sự đã trình vẫn đứng vững khi nhìn lại sau một kỳ','Từ Chuyên viên trở lên']
   ],'vi phạm'],
   ['N11','DỮ LIỆU NHÂN SỰ, BẢO MẬT VÀ RA QUYẾT ĐỊNH BẰNG SỐ',[
    ['N11.1','Dữ liệu nhân sự được tập trung một nơi, không tồn tại hai bản ở hai chỗ','Tất cả nhân sự'],
    ['N11.2','Nhân sự phân quyền truy cập dữ liệu theo vai và có lưu vết','Tất cả nhân sự'],
    ['N11.3','Kết luận nhân sự rút từ số liệu vẫn đúng khi kiểm lại ở kỳ sau','Tất cả nhân sự'],
    ['N11.4','Đề xuất của nhân sự về con người có căn cứ số liệu, không dẫn từ cảm nhận','Tất cả nhân sự'],
    ['N11.5','Không xảy ra sự cố lộ dữ liệu trong phạm vi nhân sự quản lý','Tất cả nhân sự']
   ],'vi phạm'],
   ['HC1','VĂN THƯ, LƯU TRỮ VÀ KHO LƯU TRỮ SỐ',[
    ['HC1.1','Văn bản do nhân sự soạn đúng thể thức ngay lần đầu','Tất cả nhân sự'],
    ['HC1.2','Văn bản ban hành được đánh số, lưu và tra lại được','Tất cả nhân sự'],
    ['HC1.3','Kho lưu trữ số có cấu trúc thư mục và quy ước đặt tên thống nhất','Tất cả nhân sự'],
    ['HC1.4','Kho lưu trữ số được phân quyền theo vai và có nhịp rà định kỳ','Tất cả nhân sự'],
    ['HC1.5','Người ở phòng khác tự tìm được tài liệu thuộc quyền xem của mình mà không phải hỏi','Tất cả nhân sự'],
    ['HC1.6','Không tồn tại hai bản của cùng một tài liệu ở hai nơi khác nhau','Tất cả nhân sự']
   ],'vi phạm'],
   ['HC4','TÀI SẢN, TRANG THIẾT BỊ VÀ KHÔNG GIAN LÀM VIỆC',[
    ['HC4.1','Tài sản có danh mục, có người chịu trách nhiệm và có nhịp kiểm kê','Tất cả nhân sự'],
    ['HC4.2','Danh mục tài sản khớp với thực tế khi kiểm đột xuất','Tất cả nhân sự'],
    ['HC4.3','Nhân sự xử lý yêu cầu về trang thiết bị trong thời hạn đã định','Tất cả nhân sự'],
    ['HC4.4','Không gian làm việc đủ điều kiện cho cả hai cộng đồng ngôn ngữ','Tất cả nhân sự']
   ],'vi phạm'],
   ['HC5','CHI PHÍ HÀNH CHÍNH VÀ MUA SẮM NỘI BỘ',[
    ['HC5.1','Khoản chi hành chính có căn cứ và có so sánh ít nhất hai phương án','Tất cả nhân sự'],
    ['HC5.2','Phương án mua sắm nhân sự trình lên được duyệt mà không phải cắt gọt lớn','Tất cả nhân sự'],
    ['HC5.3','Nhân sự dừng đúng lúc khi một khoản chi không ra kết quả','Tất cả nhân sự'],
    ['HC5.4','Chi phí hành chính trên đầu người không tăng qua các kỳ khi quy mô không đổi','Tất cả nhân sự']
   ],'vi phạm'],
   ['HC6','THÔNG TIN NỘI BỘ VÀ SỰ KIỆN NỘI BỘ',[
    ['HC6.1','Thông báo tới được mọi nhân sự cùng lúc và cùng nội dung','Tất cả nhân sự'],
    ['HC6.2','Người điếc/ khiếm thính và nhân sự ở xa trung tâm nhận được thông tin cùng thời điểm với người khác','Tất cả nhân sự'],
    ['HC6.3','Nhân sự kiểm tra lại mức độ nắm chính sách mới sau khi ban hành','Tất cả nhân sự'],
    ['HC6.4','Sự kiện nội bộ được tổ chức theo nhịp đã định','Tất cả nhân sự'],
    ['HC6.5','Nội dung thông báo do nhân sự soạn không phải đính chính sau khi phát ra','Tất cả nhân sự']
   ],'vi phạm'],
   ['PC1','VĂN BẢN NỘI BỘ VÀ HIỆU LỰC THI HÀNH',[
    ['PC1.1','Văn bản nội bộ do nhân sự soạn có đủ các nội dung mà pháp luật buộc phải có','Tất cả nhân sự'],
    ['PC1.2','Nhân sự đưa văn bản đi đủ các bước lấy ý kiến, đăng ký và thông báo trước khi văn bản có hiệu lực','Tất cả nhân sự'],
    ['PC1.3','Nhân sự nêu được điều luật cho từng ngưỡng, thời hạn và tỷ lệ ghi trong văn bản','Tất cả nhân sự'],
    ['PC1.4','Nhân sự chuyển văn bản do chính phòng mình soạn sang một bên thẩm định độc lập trước khi trình ký','Từ Lead bộ phận trở lên'],
    ['PC1.5','Văn bản đã ban hành không phải sửa lại vì sai quy định','Tất cả nhân sự']
   ],'vi phạm'],
   ['PC2','HỒ SƠ PHÁP NHÂN, CON DẤU VÀ GIẤY PHÉP',[
    ['PC2.1','Con dấu được quản lý có kiểm soát và có lưu vết mỗi lần sử dụng','Tất cả nhân sự'],
    ['PC2.2','Hồ sơ pháp nhân đủ, còn hiệu lực và tra ra được khi cần','Tất cả nhân sự'],
    ['PC2.3','Nhân sự nắm danh mục giấy phép Công ty đang giữ, kèm ngày hết hiệu lực của từng giấy','Tất cả nhân sự'],
    ['PC2.4','Nhân sự khởi động thủ tục gia hạn trước khi giấy phép hết hiệu lực','Tất cả nhân sự'],
    ['PC2.5','Thay đổi về pháp nhân được đăng ký với cơ quan nhà nước trong thời hạn luật định','Tất cả nhân sự']
   ],'vi phạm'],
   ['PC3','HỢP ĐỒNG VÀ THỎA THUẬN',[
    ['PC3.1','Hợp đồng có mẫu chuẩn và được lưu tập trung một nơi','Tất cả nhân sự'],
    ['PC3.2','Nhân sự theo dõi được thời hạn và nghĩa vụ của từng hợp đồng','Tất cả nhân sự'],
    ['PC3.3','Nhân sự phát hiện điều khoản bất lợi ở khâu rà, trước khi ký','Tất cả nhân sự'],
    ['PC3.4','Thỏa thuận bảo mật và biểu mẫu ký với khách hàng do nhân sự soạn đúng quy định đang hiệu lực','Tất cả nhân sự'],
    ['PC3.5','Không có hợp đồng nào quá hạn mà không ai biết','Tất cả nhân sự'],
    ['PC3.6','Không phát sinh vụ việc từ điều khoản đã ký','Tất cả nhân sự']
   ],'vi phạm'],
   ['PC4','TUÂN THỦ CHUYÊN NGÀNH VÀ DỮ LIỆU CÁ NHÂN',[
    ['PC4.1','Nhân sự nêu được nghĩa vụ pháp lý của từng ngành nghề Công ty đang đăng ký','Tất cả nhân sự'],
    ['PC4.2','Nhân sự rà nội dung quảng cáo và nhãn sản phẩm trước khi phát ra bên ngoài','Tất cả nhân sự'],
    ['PC4.3','Nhân sự lập được hồ sơ về việc xử lý dữ liệu cá nhân theo quy định đang hiệu lực','Tất cả nhân sự'],
    ['PC4.4','Nhân sự nhận ra quy định mới của ngành trước mốc nó có hiệu lực, và nêu việc phải làm kèm thời hạn','Tất cả nhân sự'],
    ['PC4.5','Không phát sinh xử phạt hành chính trong phạm vi nhân sự phụ trách','Tất cả nhân sự']
   ],'vi phạm'],
   ['PC5','ĐẦU MỐI LUẬT SƯ VÀ XỬ LÝ VỤ VIỆC',[
    ['PC5.1','Nhân sự chuẩn bị đủ câu hỏi và tài liệu để buổi tư vấn với luật sư ra kết luận dùng được ngay','Tất cả nhân sự'],
    ['PC5.2','Vấn đề pháp lý nhân sự nêu ra được xử lý dứt điểm, không phải hỏi vòng thứ hai','Tất cả nhân sự'],
    ['PC5.3','Nhân sự phân biệt được việc tự xử lý được và việc phải đưa ra luật sư','Tất cả nhân sự'],
    ['PC5.4','Nhân sự lập và giữ hồ sơ của từng vụ việc pháp lý, đủ để người khác đọc lại và làm tiếp được','Tất cả nhân sự']
   ],'vi phạm']
  ],
  quanLy: [
   ['Q1','TỔ CHỨC CÔNG VIỆC CỦA ĐƠN VỊ',[
    ['Q1.1','Nhân sự tổ chức được công việc trong phạm vi đơn vị mình phụ trách','Tất cả nhân sự'],
    ['Q1.2','Công việc của đơn vị có quy trình và biểu mẫu, không phụ thuộc trí nhớ của người phụ trách','Tất cả nhân sự'],
    ['Q1.3','Nhân sự phân việc trong đơn vị theo năng lực thật của từng người, giải thích được bằng căn cứ chứ không chia đều','Tất cả nhân sự'],
    ['Q1.4','Người khác tiếp nhận và làm tiếp được một mảng việc dựa trên tài liệu sẵn có','Từ Lead bộ phận trở lên'],
    ['Q1.5','Công việc của đơn vị không đứng lại khi người phụ trách vắng mặt','Từ Lead bộ phận trở lên']
   ],'vi phạm'],
   ['Q2','CHỦ TRÌ CÔNG VIỆC LIÊN PHÒNG',[
    ['Q2.1','Nhân sự lập được kế hoạch có mốc, người phụ trách và nguồn lực cho từng nhánh','Tất cả nhân sự'],
    ['Q2.2','Mốc của công việc liên phòng đạt đúng hạn','Tất cả nhân sự'],
    ['Q2.3','Nhân sự là đầu mối các phòng tìm đến khi việc liên quan nhiều bên','Từ Lead bộ phận trở lên'],
    ['Q2.4','Nhân sự điều phối được các phòng khác bằng lập luận và bằng quyết định giao nhiệm vụ đã có','Từ Trưởng phòng trở lên'],
    ['Q2.5','Các nhánh chạy đúng nhịp mà không cần nhắc từng tuần và không phải nhờ Ban lãnh đạo can thiệp','Từ Trưởng phòng trở lên']
   ],'vi phạm'],
   ['Q3','CHUẨN HÓA VIỆC LẶP LẠI VÀ NÂNG CHUẨN',[
    ['Q3.1','Nhân sự nhận ra việc lặp lại và viết thành quy trình, biểu mẫu hoặc công cụ','Tất cả nhân sự'],
    ['Q3.2','Người mới làm được theo tài liệu do nhân sự viết mà không phải hỏi lại','Tất cả nhân sự'],
    ['Q3.3','Mỗi dữ liệu dùng chung chỉ có một nguồn duy nhất','Tất cả nhân sự'],
    ['Q3.4','Không phát hiện cùng một dữ liệu bị lệch giữa hai nơi','Tất cả nhân sự'],
    ['Q3.5','Đề xuất chuẩn hóa của nhân sự được chấp thuận thành chuẩn dùng chung của Công ty','Từ Lead bộ phận trở lên']
   ],'vi phạm'],
   ['Q4','ĐẶT MỤC TIÊU VÀ PHÂN BỔ NGUỒN LỰC',[
    ['Q4.1','Nhân sự đặt được mục tiêu cho đơn vị hoặc cho dự án đủ năm yếu tố SMART','Tất cả nhân sự'],
    ['Q4.2','Nhân sự phân bổ nguồn lực giữa các đầu việc theo thứ tự ưu tiên giải thích được bằng căn cứ','Tất cả nhân sự'],
    ['Q4.3','Thứ tự ưu tiên của đơn vị giữ được khi có việc khẩn cấp chen vào','Tất cả nhân sự'],
    ['Q4.4','Mốc quan trọng của đơn vị đạt đúng hạn kể cả khi trong kỳ có việc phát sinh','Tất cả nhân sự']
   ],'vi phạm'],
   ['Q5','PHÁT TRIỂN ĐỘI NGŨ',[
    ['Q5.1','Nhân sự kèm người mới của đơn vị theo nội dung đã có','Tất cả nhân sự'],
    ['Q5.2','Nhân sự nhận ra người trong đơn vị đang mắc ở đâu và tổ chức được cách gỡ','Tất cả nhân sự'],
    ['Q5.3','Người được nhân sự kèm tự làm được việc sau thời gian kèm','Tất cả nhân sự'],
    ['Q5.4','Thời gian một người mới của đơn vị đạt chuẩn công việc rút ngắn so với kỳ trước','Từ Lead bộ phận trở lên']
   ],'vi phạm'],
   ['Q6','GIỮ CHUẨN VÀ XỬ LÝ VI PHẠM',[
    ['Q6.1','Nhân sự nhắc và chặn tại chỗ khi thấy hành vi vượt ranh giới, và báo lên đúng người','Tất cả nhân sự'],
    ['Q6.2','Nhân sự kiểm tra chủ động và xử lý vi phạm theo đúng thang','Tất cả nhân sự'],
    ['Q6.3','Nhân sự ghi nhận hành vi đúng chuẩn kể cả khi hành vi đó làm giảm kết quả ngắn hạn','Tất cả nhân sự']
   ],'vi phạm'],
   ['Q7','NGÂN SÁCH VÀ CHI PHÍ CỦA ĐƠN VỊ',[
    ['Q7.1','Phương án chi của nhân sự có căn cứ cho từng khoản','Tất cả nhân sự'],
    ['Q7.2','Nhân sự tách phần không tốn chi phí ra làm trước','Tất cả nhân sự'],
    ['Q7.3','Nhân sự dừng đúng lúc khi một khoản chi không ra kết quả','Tất cả nhân sự'],
    ['Q7.4','Phương án nhân sự trình lên được duyệt mà không phải cắt gọt lớn','Từ Lead bộ phận trở lên'],
    ['Q7.5','Kết quả của từng khoản chi khớp với phương án đã trình','Từ Lead bộ phận trở lên']
   ],'vi phạm'],
   ['Q8','ĐIỀU CHỈNH KHI ĐIỀU KIỆN ĐỔI',[
    ['Q8.1','Nhân sự điều chỉnh được cách tổ chức khi mục tiêu hoặc điều kiện thay đổi','Tất cả nhân sự'],
    ['Q8.2','Nhân sự bảo vệ được lập luận khi đề xuất bị phản biện','Tất cả nhân sự'],
    ['Q8.3','Cách làm đã đổi cho kết quả tốt hơn trước khi đổi','Tất cả nhân sự'],
    ['Q8.4','Nhân sự đề xuất được thay đổi vượt ra ngoài phạm vi đơn vị mình','Từ Trưởng phòng trở lên'],
    ['Q8.5','Đề xuất phạm vi rộng của nhân sự được chấp thuận','Từ Trưởng phòng trở lên']
   ],'vi phạm'],
   ['Q9','THỰC THI QUYỀN CHỨC NĂNG TRÊN TOÀN CÔNG TY',[
    ['Q9.1','Nhân sự nắm được tình hình con người của các đơn vị không thuộc quyền trực tuyến của mình','Tất cả nhân sự'],
    ['Q9.2','Khi một đơn vị làm chưa đúng chuẩn nhân sự hoặc chuẩn hành chính, nhân sự trao đổi với người phụ trách đơn vị đó và việc được chỉnh','Tất cả nhân sự'],
    ['Q9.3','Nhân sự chủ trì xử lý vụ việc về con người của đơn vị khác cùng người phụ trách đơn vị đó','Từ Lead bộ phận trở lên'],
    ['Q9.4','Chuẩn nhân sự, chuẩn hành chính, chuẩn văn hóa và chuẩn pháp chế do nhân sự ban hành được các phòng thực hiện','Từ Trưởng phòng trở lên'],
    ['Q9.5','Quyết định về con người của các đơn vị đi qua đúng luồng duyệt đã ban hành','Từ Trưởng phòng trở lên'],
    ['Q9.6','Khi các đơn vị chưa thống nhất về một nhân sự cụ thể, nhân sự chủ trì xử lý và ra được kết luận các bên chấp thuận','Từ Trưởng phòng trở lên'],
    ['Q9.7','Người phụ trách các khối và các điểm bán chủ động báo cáo chức năng về bốn phạm trù, không chờ được hỏi','Từ Trưởng phòng trở lên']
   ],'vi phạm']
  ]
}
};

/**
 * Danh sách câu hỏi phần chung của một tuyến, đã lọc theo khóa boTruc
 * và theo việc tuyến có đầu việc tại điểm bán hay không.
 * Đây là chỗ DUY NHẤT ghép danh sách, sheet khung chung và phiếu chấm
 * đều gọi hàm này.
 */
function _cauHoiChung(T) {
  const bo = (T && T.boTruc) || [];
  return _nguonChung().filter(function (nh) {
    if (bo.indexOf(nh[0]) >= 0) return false;
    const chiDiemBan = ['VH9','VH10','VH11','VH12','VH13'];
    if (chiDiemBan.indexOf(nh[0]) >= 0 && !(T && T.coDiemBan)) return false;
    return true;
  });
}

/**
 * NGUON THAT cua phan chung la sheet Bo cau hoi tren file goc.
 * Hang CAU_HOI_CHUNG ben tren chi la HAT GIONG, dung dung mot lan luc dung sheet.
 * CHOT 30/8/2026 (Sen). Sua vao hang so khi sheet da co du lieu thi KHONG
 * co tac dung gi. Xem 16_BoCauHoiSheet.gs.
 */
function _nguonChung() {
  const bo = (typeof _docBoCauHoi === 'function') ? _docBoCauHoi() : null;
  return (bo && bo.chung.length) ? bo.chung : CAU_HOI_CHUNG;
}

/**
 * Bo cau hoi rieng cua mot tuyen. Tra ve null khi tuyen chua soan.
 * SUA 30/8/2026 (Sen). Doc tu sheet, hang so chi la hat giong.
 */
function _cauHoiTuyen(tenTuyen) {
  const bo = (typeof _docBoCauHoi === 'function') ? _docBoCauHoi() : null;
  if (bo) {
    const t = bo.tuyen[tenTuyen];
    return t || null;
  }
  return CAU_HOI_TUYEN[tenTuyen] || null;
}

/** Đếm số câu thuộc một mảng nhóm, dùng cho công thức và cho phép kiểm. */
function _demCau(nhomList) {
  let n = 0;
  (nhomList || []).forEach(function (nh) { n += nh[2].length; });
  return n;
}
