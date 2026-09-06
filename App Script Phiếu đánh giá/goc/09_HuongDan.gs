/**
 * MODULE 09: Sheet hướng dẫn của FILE GỐC.
 * Phần giải thích cách đọc MA TRẬN nằm trong từng sheet ma trận của tuyến, ở
 * module 05, để nó đi theo phiếu khi xuất ra. Sheet này chỉ nói về cách VẬN
 * HÀNH hệ, dành cho người quản trị file gốc.
 */

function buildHuongDan() {
  const sh = _tao(CFG.SHEETS.HD);
  _banner(sh, '📖 HƯỚNG DẪN VẬN HÀNH HỆ ĐÁNH GIÁ NHÂN SỰ',
    'Công ty TNHH Nhà Của Thời Thanh Xuân · Phòng Nhân sự - Hành chính - Pháp chế · Phiên bản ' + VERSION, 2);

  const N = [
['I. ĐÂY LÀ FILE GÌ',''],
['File gốc','Bảng tính bạn đang mở là FILE GỐC. Nó giữ code, tham số, khung chung, và ma trận cấp bậc kèm giải thích của tất cả các tuyến, mỗi tuyến một sheet. KHÔNG chấm điểm trên file này.'],
['File năm','Mỗi người có ĐÚNG MỘT file cho cả năm, mười hai sheet tháng T01 tới T12 lập sẵn ngay từ lúc tạo. Chốt điểm tháng này xong thì sang tab kế bên, không tạo file mới và không đổi link. File năm không chứa code, nhưng mang theo sheet ma trận và khung chung của tuyến đó.'],
['Vì sao tách hai loại file','Một, mỗi người chỉ thấy file của chính mình, không thấy điểm của người khác. Hai, code nằm một nơi nên sửa một lần là xong, không phải đi sửa hàng chục file.'],
['Ai điền điểm','KHÔNG có người chấm ngồi cân nhắc từng ô. Điểm đầu tháng là mặc định, rồi đi lên đi xuống theo biên bản vi phạm và phiếu ghi nhận mà Phòng Nhân sự - Hành chính - Pháp chế lập. Ứng dụng ghi từng biên bản vào sheet ẩn ' + CFG.LOG_SHEET + ' của chính file năm đó.'],
['Điểm mặc định','Nhóm đo VI PHẠM bắt đầu ở 5, tức chưa có biên bản nào. Nhóm đo GHI NHẬN bắt đầu ở 0, tức chưa ghi nhận lần nào. Dòng chữ nhỏ ngay dưới tên mỗi nhóm nói rõ nhóm đó đo chiều nào.'],
['Chiều đo chọn thế nào','Nhóm nêu PHẦN VIỆC ĐƯỢC GIAO thì đo theo chiều vi phạm, vì không làm đúng phần được giao là một lỗi lập được biên bản. Nhóm nêu việc VƯỢT TRÊN phần được giao thì đo theo chiều ghi nhận. Chiều đo khai theo NHÓM, không khai theo từng câu.'],
['Điểm nền của tháng','Điểm nền của một phần chính bằng tỷ lệ câu thuộc nhóm vi phạm của phần đó. Sau đợt 30/8/2026, điểm nền của năm hình dạng phiếu nằm trong khoảng 3,96 tới 4,35 trên thang 5. Bốn hình dạng ra bậc 4, tức hệ số 1,00 đúng bằng mức Công ty dự định trả cho một tháng không có gì xảy ra. Riêng chức năng Nhân sự - Hành chính - Pháp chế cấp quản lý ra bậc 5, xem dòng 2c mục IX.'],
['',''],

['I b. CHỮ "BẬC" NAY CHỈ CÒN MỘT NGHĨA',''],
['Vì sao phải đọc mục này','Tới 30/8/2026 hệ có ba thứ khác hẳn nhau cùng gọi là bậc, và đó là chỗ lẫn nhiều nhất của cả hệ. ✅ CHỐT 31/8/2026 (Sen): chỉ giữ một nghĩa, hai thứ còn lại gọi bằng tên khác.'],
['ĐIỂM, thang 0 tới 5','Điểm của một câu hỏi. Mặc định đầu tháng là 5 với nhóm đo vi phạm và 0 với nhóm đo ghi nhận, rồi đi lên đi xuống theo biên bản. Gọi là ĐIỂM, không gọi là bậc.'],
['BẬC CÁCH LÀM VIỆC, 1 tới 5','⛔ Đây là thứ DUY NHẤT còn được gọi là bậc. ĐI RA từ phiếu mỗi tháng. Điểm tổng tháng quy ra bậc này, rồi tra hệ số 0,10 / 0,40 / 0,90 / 1,00 / 1,10 nhân vào phần P2 của cấp đó. Đây là thứ DUY NHẤT trong phiếu chạm tới tiền hàng tháng. Nhịp NHANH, nâng hạ được trong tháng.'],
['CẤP','Nấc trên con đường thăng tiến, ví dụ Chuyên viên, Lead bộ phận, Trưởng phòng. Trước 31/8/2026 gọi là bậc trong ngạch và ghi bằng số; nay ghi thẳng bằng TÊN. Nguồn duy nhất là 0-Nen-tang/Du-lieu/cap-bac.csv. Nhịp CHẬM, đổi bằng quyết định bổ nhiệm, không đổi theo tháng.'],
['Ngạch Chuyên môn có cấp nào','Tập sự · Nhân viên · Chuyên viên · Chuyên gia. Trần của ngạch là Chuyên gia.'],
['Ngạch Quản lý có cấp nào','Tập sự · Trưởng ca · Lead bộ phận · Quản lý khối · Trưởng phòng · C-Level · Tổng Giám đốc · Người sáng lập.'],
['Hai ngạch so ngang nhau thế nào','Lead bộ phận ngang Chuyên viên, Quản lý khối ngang Chuyên gia: ngang quyền và ngang tiền. Trên nữa chỉ ngạch quản lý còn đi tiếp, tới Trưởng phòng.'],
['⛔ Ba cấp KHÔNG chấm được','C-Level, Tổng Giám đốc và Người sáng lập xếp bằng quyết định bổ nhiệm và không tụt theo kỳ, nên không đặt ngưỡng ở ba cấp đó.'],
['Đặt ngưỡng cấp cho một câu ở đâu','Ở cột Phạm vi áp dụng của sheet Bộ câu hỏi, ghi "Từ <tên cấp> trở lên", ví dụ "Từ Trưởng phòng trở lên". Đó là cấp THẤP NHẤT mà câu bắt đầu áp dụng. Trên 343 câu hiện có 25 câu đặt ngưỡng, còn lại áp cho mọi người.'],
['',''],

['II. CÂY THƯ MỤC TRÊN DRIVE',''],
['Cấu trúc','<thư mục đang chứa file gốc>  /  <Năm>  /  Tuyến <tên>  /  Đánh giá <Năm> - <Mã nhân sự> - <Họ tên>'],
['Nằm ở đâu','Cây đánh giá nằm NGAY TRONG thư mục đang chứa chính file gốc này, không phải một thư mục riêng ở ngoài. Chuyển file gốc sang thư mục khác thì các năm tạo SAU đó đi theo, còn năm đã tạo TRƯỚC vẫn nằm chỗ cũ và phải kéo tay.'],
['Sắp theo thời gian','Thư mục cấp một là năm nên Drive tự sắp đúng thứ tự thời gian, không cần đánh số tay.'],
['Đổi chỗ thư mục gốc','ĐỂ TRỐNG ô TS_DRIVE_ID là đúng trong hầu hết trường hợp: cây đánh giá tự bám theo thư mục chứa file gốc, nên chuyển file là cây đi theo. Chỉ dán ID vào ô đó khi muốn đặt cây ở một thư mục KHÁC chỗ file gốc đang nằm.'],
['Xem đang nằm ở đâu','Menu 🗂️ Mở thư mục đánh giá chỉ HIỆN tên và đường dẫn thư mục hệ đang dùng. Nó không tạo và không di chuyển gì, bấm bao nhiêu lần cũng không đổi thứ gì.'],
['',''],

['III. QUY TRÌNH MỘT NĂM',''],
['Bước 0','Menu 🔃 Đồng bộ nhân sự từ People Management. Danh sách nhân sự KHÔNG nhập tay ở đây, nó đọc từ file People Management để hai nơi không giữ hai bản rồi trôi lệch. Sau khi đồng bộ, điền cột Tuyến cho từng người ở sheet ' + CFG.SHEETS.NS + '.'],
['Bước 1','Kiểm tra sheet ' + CFG.SHEETS.TS + ' xem các ngưỡng và trọng số đã đúng chưa.'],
['Bước 2','Menu 📅 Tạo file năm cho một người, nhập MÃ NHÂN SỰ. Hoặc 📚 Tạo file năm cho nhiều người, tối đa 6 người một lần. Hệ tự tra tên, vị trí, phòng ban, cấp và tuyến.'],
['Bước 3','Đưa link file năm cho nhân sự và cho ứng dụng lập biên bản. Trong tháng, mỗi biên bản vi phạm và mỗi phiếu ghi nhận được ứng dụng ghi vào sheet ' + CFG.LOG_SHEET + ' và cập nhật ô điểm tương ứng.'],
['Bước 4','Cuối tháng, đọc khối KẾT QUẢ THÁNG ở đầu sheet tháng đó. Không phải bấm gì, mọi số đều là công thức.'],
['Bước 5','Menu 📥 Thu kết quả một tháng để dồn kết quả mọi người của tháng đó về sheet ' + CFG.SHEETS.TH + '. Chạy lại nhiều lần được, dòng cũ của cùng kỳ sẽ bị thay chứ không nhân bản.'],
['Đổi cấp giữa năm','Menu 🔁 Dựng lại các tháng chưa chốt. Nói rõ tháng bắt đầu, các tháng trước giữ nguyên gồm cả điểm đã chốt.'],
['',''],

['IV. PHIẾU CHO RA MỘT KẾT QUẢ',''],
['⛔ Phiếu nay chỉ cho ra MỘT kết quả','✅ CHỐT 31/8/2026 (Sen). Hai dòng BẬC TRONG NGẠCH đã bỏ khỏi khối kết quả. Cấp đi qua quyết định bổ nhiệm, không phải thứ một phiếu tháng quyết.'],
['Bậc cách làm việc','Trả lời câu người này LÀM VIỆC THẾ NÀO. Lấy từ ĐIỂM TỔNG THÁNG. Nhịp NHANH, nâng hạ được trong tháng. Đây là kết quả duy nhất của phiếu.'],
['Điểm tổng tháng','Trung bình cộng có trọng số của ba phần. Không giữ vai trò quản lý thì Văn hóa chung 65% và Ngạch chuyên môn 35%. Có giữ vai trò quản lý thì Văn hóa chung 50%, Ngạch quản lý 30%, Ngạch chuyên môn 20%. Năm con số này nằm ở sheet ' + CFG.SHEETS.TS + ', mục III.'],
['Không gộp','Cấp và bậc cách làm việc không cộng và không quy đổi cho nhau. Một người có thể được quyết nhiều việc trong khi cách làm việc đang đi xuống, hoặc ngược lại; gộp lại thành một số là xóa mất đúng thông tin cần nhìn.'],
['Từ cấp sang chức danh','Ban lãnh đạo nhìn hai thang chuyên môn và quản lý đang ở đâu rồi tự quyết bổ nhiệm chức danh nào. Phiếu KHÔNG tự quyết việc này.'],
['Từ chức danh sang tiền','Tùy chức danh mà cùng một cấp ra số tiền khác nhau. Bảng đó thuộc quy chế lương, không nằm trong phiếu.'],
['',''],

['V. VI PHẠM NỘI QUY NỐI SANG TIỀN THẾ NÀO',''],
['Phiếu không tự trừ','Mục VI của phiếu liệt kê vi phạm nội quy trong tháng nhưng KHÔNG có công thức trừ điểm hay trừ bậc.'],
['Vì sao','Pháp luật lao động nghiêm cấm phạt tiền và cắt lương thay cho xử lý kỷ luật lao động. Một chuỗi cơ học đi thẳng từ số lần vi phạm sang số bậc rồi sang số tiền là phạt tiền trá hình, mức phạt doanh nghiệp từ 40 tới 80 triệu và buộc hoàn trả toàn bộ tiền đã trừ.'],
['Đường đi thứ nhất','Biên bản vi phạm kéo điểm của đúng những câu mà hành vi đó chạm tới, ở mục II hoặc mục III. Điểm phần xuống thì điểm tổng tháng xuống theo, và bậc cách làm việc xuống theo. Mỗi bước đều truy được về một biên bản cụ thể.'],
['Đường đi thứ hai','Vi phạm cụ thể đi đường kỷ luật lao động riêng. Trong đó có hình thức kéo dài thời hạn nâng bậc tối đa sáu tháng, và hình thức cách chức. Cả hai đều chạm tới tiền một cách hợp pháp.'],
['Điều kiện bắt buộc','Hành vi chỉ xử lý được khi đã được ghi trong nội quy lao động ĐÃ BAN HÀNH. Nội quy của Công ty chưa ban hành, nên tới khi có thì mục VII để trống và ghi rõ là chưa có căn cứ.'],
['Ngoại lệ duy nhất','✅ CHỐT 11/8/2026 (Sen). Bảo mật thu nhập cá nhân, mục VII của phiếu, CÓ trừ thẳng 1 bậc của Bậc cách làm việc, sàn là bậc 1. Khác mục VII ở ba điểm: chỉ một nghĩa vụ nên chỉ một mức; mức do Ban lãnh đạo ấn định trước chứ không do người chấm quyết trong kỳ; và chỉ chạm Bậc cách làm việc, là bậc nâng hạ được theo tháng, không chạm CẤP vốn nằm trong quyết định bổ nhiệm. ⚠️ Vẫn cần nghĩa vụ này nằm trong hợp đồng lao động hoặc nội quy lao động đã ban hành.'],
['',''],

['VI. THÊM MỘT TUYẾN MỚI',''],
['Bước 1','Mở Apps Script, file 03_DuLieuTuyen. Thêm một khối vào hằng TUYEN theo đúng cấu trúc đã chú thích ở đầu file đó.'],
['Bước 2','Lưu, quay lại bảng tính, chạy menu 🔄 Cập nhật phiên bản.'],
['Bước 3','Tuyến mới xuất hiện trong ' + CFG.SHEETS.DM + ', có sheet ma trận riêng, và tạo file năm được ngay.'],
['Không phải sửa','Khung chung, tham số, công thức tính bậc, quy trình tạo file và thu kết quả. Chúng dùng lại cho mọi tuyến.'],
['Tuyến khung rỗng','Tuyến chưa soạn lưới vẫn tạo file năm được và vẫn chấm được mục I ranh giới cùng mục II văn hóa chung. Mục III và mục IV hiện dòng chờ soạn.'],
['',''],

['VII. CẬP NHẬT PHIÊN BẢN GIỮ GÌ VÀ MẤT GÌ',''],
['Giữ nguyên','Các tham số đã chỉnh tay, sheet ' + CFG.SHEETS.TH + ', và sheet ' + CFG.SHEETS.NK + '.'],
['Vẽ lại','Toàn bộ cấu trúc, công thức và nội dung ma trận theo code mới.'],
['Sao lưu','Tự chép sheet Tham số và Tổng hợp kỳ vào sheet ẩn có tiền tố ' + CFG.BK_PREFIX + ' trước khi chạy.'],
['⚠️ Không tự lan','Các FILE NĂM đã tạo trên Drive KHÔNG tự cập nhật theo. Muốn dùng bản mới thì chạy 🔁 Dựng lại các tháng chưa chốt. Tháng đã chốt điểm thì giữ nguyên bản cũ, vì nó là hồ sơ của tháng đó.'],
['',''],

['VIII. CÁC SHEET TRONG FILE GỐC',''],
[CFG.SHEETS.HD,'Chính là sheet này. Cách vận hành hệ.'],
[CFG.SHEETS.TS,'Mọi ngưỡng và trọng số. Sửa ở đây, mọi phiếu xuất sau đó tính theo. Không sửa số trong công thức.'],
[CFG.SHEETS.NS,'Danh sách nhân sự, đồng bộ từ People Management. Chỉ cột Tuyến là nhập tay. Ba cột cuối cho biết mỗi người đã đánh giá bao nhiêu lần, kỳ gần nhất và kết quả gần nhất.'],
[CFG.SHEETS.LS,'Mỗi dòng là một file năm đã tạo, có đường dẫn tới file đó. Đây là chỗ tra lịch sử đánh giá của một người qua các năm.'],
[CFG.SHEETS.TB,'Quy ước gộp ô của phiếu. Chỉnh trình bày trên một sheet tháng rồi chạy 🎨 Học cách trình bày từ một phiếu, hệ đọc lại và mọi phiếu sau đó làm theo.'],
[CFG.SHEETS.DM,'Danh sách tuyến, trạng thái đủ nội dung hay khung rỗng, ngạch áp dụng, khung bậc.'],
[CFG.SHEETS.CHUNG,'Ranh giới chung, và phần văn hóa chung, đủ mô tả từng mức. Áp cho mọi tuyến.'],
[CFG.MT_PREFIX + '…','Ma trận cấp bậc của một tuyến, KÈM PHẦN GIẢI THÍCH CÁCH ĐỌC. Mỗi tuyến một sheet. Sheet này được chép sang file năm khi tạo.'],
[CFG.SHEETS.TH,'Kết quả các tháng đã thu về, mỗi người một dòng.'],
[CFG.SHEETS.NK,'Ghi lại mỗi lần dựng, cập nhật, tạo file năm, thu kết quả.'],
['',''],

['VIII b. CÁC SHEET TRONG MỘT FILE NĂM',''],
['T01 tới T12','Phiếu chấm của từng tháng. Số dòng giống hệt nhau ở cả mười hai tháng, vì cùng một tuyến và cùng một cấp thì bộ câu hỏi không đổi trong năm.'],
['Đầu mỗi sheet tháng','Khối KẾT QUẢ THÁNG, địa chỉ cố định ở mọi sheet của mọi người. Ba điểm trung bình phần, điểm tổng có trọng số, ba bậc, trạng thái ranh giới, và bậc tháng trước lấy tự động từ tab bên trái.'],
[CFG.LOG_SHEET + '  (ẩn)','Nơi ứng dụng ghi từng biên bản vi phạm và từng phiếu ghi nhận, mỗi thứ một dòng. Cột Tháng, Ngày, Loại, Mã câu, Sự việc, Số hiệu, Người lập, Điểm áp. Ghi thêm dòng vào cuối, không sửa và không xóa dòng cũ.'],
[CFG.CHIMUC_SHEET + '  (ẩn)','Bản đồ mã câu sang số dòng, cộng địa chỉ khối kết quả. Ứng dụng đọc sheet này rồi ghi thẳng vào đúng ô, không dò.'],
[CFG.PDT_SHEET + '  (ẩn)','Bộ câu hỏi định tính, một bản cho cả năm. Không tính điểm và không sinh ra bậc.'],
['',''],

['IX. NỘI DUNG CHỜ CHỐT TOÀN HỆ',''],
['1','⛔ Ba tham số TS_NG_BAC, TS_DA_SO và TS_TUT_TOI_DA nay KHÔNG CÒN chỗ dùng, vì hai dòng bậc trong ngạch đã bỏ khỏi phiếu ngày 31/8/2026. Chúng vẫn nằm ở sheet Tham số, chờ Ban lãnh đạo quyết bỏ hay giữ.'],
['1b','Ngưỡng đa số tiêu chí và mức tụt tối đa cho phép. Đang đặt tạm, chưa xếp bậc chính thức được.'],
['2','Ngưỡng phần trăm quy đổi ra bậc cách làm việc, chưa hiệu chỉnh bằng dữ liệu thật.'],
['2b','✅ ĐÃ XỬ 30/8/2026 qua ba lượt. Điểm nền của tháng chưa có biên bản nào nay là 3,96 tới 4,35 trên thang 5. Xử bằng hai việc: lật 29 nhóm sang chiều đo vi phạm, và chuyển 8 câu nằm nhầm nhóm về đúng nhóm chủ đề. Sáu nhóm cố ý giữ chiều ghi nhận vì nêu việc vượt trên phần được giao: NL1, NL2, NL3, NL4, C8, QF.'],
['2c','⚠️ CHƯA XỬ. Chức năng Nhân sự - Hành chính - Pháp chế cấp quản lý có điểm nền 4,35 tức 87%, vượt ngưỡng bậc 5 là 0,85, nên hình dạng phiếu đó bắt đầu tháng ở hệ số 1,10. Bốn hình dạng còn lại ở bậc 4. Sửa thì phải cắt lại ngưỡng, mà ngưỡng là thứ quyết định tiền.'],
['2c','Trọng số ghép ba phần, mục III sheet ' + CFG.SHEETS.TS + '. Đang là 65/35 khi không có quản lý và 50/30/20 khi có. Chưa hiệu chỉnh bằng dữ liệu thật.'],
['3','Thời gian tối thiểu ở mỗi bậc, và thời hạn của quyết định xếp bậc.'],
['4','Bảng chức danh nhân bậc ra số tiền. Thuộc quy chế lương, chưa ban hành.'],
['5','Nội quy lao động, làm căn cứ cho mục vi phạm trong tháng.'],
['6','Lưới phân bậc của các tuyến đang ở trạng thái khung rỗng, xem cột Trạng thái ở ' + CFG.SHEETS.DM + '.'],
['7','Thang cấp bậc chốt 24/8/2026: CÒN HAI NGẠCH, Quản lý và Chuyên môn. Ngạch tay nghề đã bỏ, các tuyến sản xuất và pha chế nay dùng ngạch chuyên môn. Bậc 5 Chuyên gia, bậc 4 Chuyên viên, bậc 3 chưa mở, bậc 2 Nhân viên, bậc 1 Tập sự. Nguồn duy nhất là 0-Nen-tang/Du-lieu/cap-bac.csv.'],
['8','Tuyến Phát triển Kinh doanh hiện vẫn chấm TC1 Giao tiếp và Phối hợp, trong khi tuyến Thương mại & Dịch vụ đã bỏ vì trùng B1. Rà lại khi ngạch chuyên môn của tuyến đó có tiêu chí tương đương.'],
['9','Bậc thủng trong lưới ngạch quản lý: QB, QC, QE chưa có câu nào ở bậc 4; QD, QF chưa có câu nào ở bậc 6. Công thức đang BỎ QUA bậc thủng và đi tiếp, tức coi như đạt. Soạn thêm câu cho các bậc đó khi lưới bậc được chốt.'],
['10','Ranh giới thứ tư, cố tình lừa dối, do TTX bổ sung 9/8/2026 và CHƯA có trong tài liệu đào tạo lẫn nội quy lao động. Ranh giới chặn kết quả nên phải nằm trong nội quy đã ban hành thì mới dùng làm căn cứ kỷ luật được.'],
['11','Bộ câu hỏi ngạch của chức năng Nhân sự - Hành chính - Pháp chế chưa gán bậc, nên phần đó chưa ra bậc. Toàn bộ 143 câu của chức năng này khai logic đo là ghi nhận, tức điểm nền bằng 0. Sáu tuyến còn lại chưa có bộ câu hỏi ngạch nào.'],
['12','Nghĩa vụ bảo mật thu nhập cá nhân, mục VII của phiếu, CHƯA có trong hợp đồng lao động lẫn nội quy lao động. Mục này trừ thẳng 1 bậc nên phải có căn cứ văn bản trước khi áp cho ai.']
  ];

  sh.getRange(3,1,N.length,2).setValues(N);
  N.forEach(function (d,i) {
    if (d[1] === '' && d[0] !== '') {
      sh.getRange(i+3,1,1,2).setBackground(CFG.MAU.NHAT);
      sh.getRange(i+3,1).setFontWeight('bold').setFontColor(CFG.MAU.DAM);
    }
  });
  sh.setColumnWidth(1,270); sh.setColumnWidth(2,960);
  sh.getRange(1,1,N.length+3,2).setWrap(true).setVerticalAlignment('top');
}
