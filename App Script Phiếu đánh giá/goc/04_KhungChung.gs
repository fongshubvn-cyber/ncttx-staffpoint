/**
 * MODULE 04: Khung chung toàn Công ty. Áp cho MỌI vị trí ở MỌI tuyến.
 * Phần này cho ra kết quả thứ hai của phiếu là BẬC CÁCH LÀM VIỆC.
 * Nguồn nội dung: tài liệu đào tạo nhân sự của Công ty.
 */

/* Ranh giới không thỏa hiệp, phần chung. Vi phạm thì chặn mọi kết quả. */
const RANH_GIOI_CHUNG = [
 ['Chung toàn Công ty', [
  'Tài chính và uy tín doanh nghiệp',
  'Văn hóa và sứ mệnh của Thời Thanh Xuân',
  'Tôn trọng danh dự và nhân phẩm nhân sự',
  'Cố tình lừa dối, với bất kỳ ai: cấp trên, đồng nghiệp, khách hàng, đối tác, cơ quan quản lý. ' +
  'Báo sai sự thật về kết quả hoặc tiến độ công việc, giấu sự việc đã xảy ra, làm sai lệch số liệu ' +
  'hoặc chứng từ, hoặc biết người khác đang hiểu sai mà không đính chính. ' +
  'Ranh của ranh giới này là chữ CỐ TÌNH: nhầm lẫn, quên, hoặc truyền đạt thông tin chưa xác minh ' +
  'thì thuộc nhóm VH2 và VH5 ở mục II, không phải ranh giới.'
  /* Ranh giới thứ tư do Công ty bổ sung ngày 9/8/2026, không trích tài liệu đào
   * tạo như ba ranh giới trên. Ghi ở đây chứ KHÔNG ghi vào chuỗi hiện ra:
   * ✅ CHỐT 30/8/2026 (Sen), nhân sự đọc phiếu này nên phiếu không mang dấu vết
   * quá trình soạn thảo. */
 ]]
];

/* Bảo mật thu nhập cá nhân. ✅ CHỐT 11/8/2026 (Sen).
 * KHÁC ranh giới ở trên: ranh giới CHẶN mọi kết quả, còn mục này TRỪ THẲNG
 * một bậc của Bậc cách làm việc, sàn là bậc 1. Ví dụ bậc 3 xuống bậc 2.
 * Bậc cách làm việc chính là bậc tra hệ số ở sheet 📋 Đơn giá P2 của bảng lương
 * People Management, cột L sheet Nhân sự, nên phép trừ này chạm tiền P2 của kỳ.
 * KHÔNG đụng tới CẤP của người đó, vì cấp đi qua quyết định bổ nhiệm riêng. */
const BAO_MAT_THU_NHAP = {
  ten: 'Bảo mật thu nhập cá nhân',
  noiDung:
   'Nhân sự giữ kín mọi thông tin liên quan tới thu nhập của bản thân tại Công ty, ' +
   'gồm lương, thưởng, phụ cấp, hệ số, bậc cách làm việc và mọi khoản khác. ' +
   'Không trao đổi những thông tin này với người không có thẩm quyền, cả trong nội bộ lẫn ra bên ngoài.',
  hinhThuc:
   'Có vi phạm trong kỳ thì Bậc cách làm việc của kỳ trừ thẳng 1 bậc, sàn là bậc 1.'
};

/* Trụ văn hóa. [mã, tên, phạm vi, mô tả năm mức] */
const VAN_HOA = [
['VH1','One Voice, một tiếng nói thống nhất','chung',[
 'Không phát ngôn cá nhân trái định hướng chung, và không truyền đạt thông tin chưa được xác nhận.',
 'Dùng đúng kịch bản và quy chuẩn giao tiếp đã ban hành, cả với khách và trong nội bộ.',
 'Thông tin chưa chắc thì hỏi lại người có thẩm quyền trước khi trả lời, thay vì tự suy đoán.',
 'Truyền đạt lại một quyết định hoặc một chính sách cho người khác mà người nghe hiểu đúng, không phải hỏi lại.',
 'Là chỗ người khác tìm tới để xác nhận thông tin trước khi đưa ra ngoài.']],

['VH2','Outcome, kết quả cần đạt, đặt theo tiêu chí SMART','chung',[
 'Nêu được kết quả cần đạt của việc mình nhận, bằng một câu có con số hoặc có thời hạn.',
 'Kết quả mình nhận đủ năm yếu tố SMART là cụ thể, đo được, khả thi, liên quan, có thời hạn. Thiếu yếu tố nào thì hỏi lại người giao.',
 'Tự đặt được kết quả cần đạt cho phần việc của mình đủ năm yếu tố, cuối kỳ đối chiếu được bằng số.',
 'Đặt kết quả cần đạt cho nhóm hoặc cho một đợt việc, nghiệm thu được mà không tranh cãi về cách hiểu.',
 'Phát hiện và sửa được mục tiêu do người khác đặt còn thiếu yếu tố.']],

['VH3','Purpose, mục đích và vì sao làm','chung',[
 'Nhắc lại được vì sao việc mình nhận cần làm.',
 'Nói được việc đó phục vụ mục tiêu nào lớn hơn của bộ phận.',
 'Khi thấy cách làm hiện tại không phục vụ đúng mục đích thì nêu lại.',
 'Khi giao việc cho người khác thì nêu rõ mục đích, không chỉ nêu đầu việc.',
 'Diễn giải được mục đích của một chủ trương chung thành lý do cụ thể cho từng bộ phận.']],

['VH4','Action Plan, kế hoạch hành động','chung',[
 'Nêu được các bước sẽ làm trước khi bắt tay vào việc.',
 'Kế hoạch có thời gian và thứ tự, không phải một danh sách rời.',
 'Báo cáo tiến độ theo kế hoạch đã nêu, thay vì kể lại việc đã làm.',
 'Kế hoạch giao ra cho người khác nêu đủ thời gian, người phụ trách, nguồn lực và mốc đánh giá.',
 'Kế hoạch của mình được bộ phận khác dùng lại làm khuôn.']],

['VH5','Time Management, quản lý thời gian','chung',[
 'Phân loại được việc của mình theo bốn nhóm của ma trận, nói được việc nào thuộc nhóm nào.',
 'Việc nhóm 1 và nhóm 3 được xử lý trước, không để việc gấp trôi qua hạn.',
 'Có phần thời gian dành cho nhóm 2, tức việc quan trọng nhưng chưa khẩn cấp.',
 'Số việc nhóm 2 bị đẩy thành nhóm 1 vì để muộn giảm so với kỳ trước.',
 'Cách sắp xếp của người này làm giảm số việc gấp phát sinh cho người khác trong bộ phận.']],

['VH6','Proactive, tư duy chủ động','chung',[
 'Không đổ lỗi và không làm việc đối phó. Việc thuộc phạm vi của mình thì làm mà không cần nhắc.',
 'Nhìn thấy việc cần làm ngoài phạm vi của mình thì báo cho người phụ trách, kể cả khi mình không làm.',
 'Việc đã nhận thì theo tới khi xong, không dừng ở chỗ đã báo cáo hoặc đã chuyển cho người khác.',
 'Tự khởi xướng một việc chưa ai giao mà bộ phận đang cần, và việc đó ra kết quả.',
 'Giành được thế chủ động trong việc liên quan nhiều bên: là người đề xuất và điều phối.']],

['VH7','Solution Focus, định hướng giải pháp','chung',[
 'Phát hiện và báo cáo vấn đề kịp thời, đúng người, mô tả đúng sự việc. Không kể lể tình tiết và cảm xúc, không quy trách nhiệm cho cá nhân hay hoàn cảnh. BÁO VẤN ĐỀ MÀ CHƯA CÓ GIẢI PHÁP VẪN ĐẠT MỨC NÀY; biết có vấn đề mà không báo là CHƯA ĐẠT.',
 'Nêu vấn đề kèm ít nhất một hướng xử lý sơ bộ.',
 'Nêu vấn đề kèm phương án và đánh giá tác động: ảnh hưởng tới ai, tốn gì, rủi ro gì.',
 'Xử lý được vấn đề liên quan nhiều bộ phận mà không cần đưa lên cấp trên.',
 'Phát hiện được nguyên nhân gốc làm vấn đề lặp lại, và xử lý ở gốc.']],

['VH8','Làm việc giữa hai cộng đồng ngôn ngữ','chung',[
 'Chào hỏi và trao đổi việc đơn giản bằng ngôn ngữ của cộng đồng kia.',
 'Trao đổi công việc hằng ngày mà không cần người phiên dịch.',
 'Trao đổi được nội dung chuyên môn của vị trí mình.',
 'Nhận xét và hướng dẫn được người thuộc cộng đồng kia về công việc, không qua phiên dịch.',
 'Là cầu nối khi hai cộng đồng chưa hiểu nhau, và kèm được người khác học ngôn ngữ của cộng đồng kia.']],

['VH9','Mùi hương, giá trị cốt lõi','diem_ban',[
 'Xịt hương lên tay cầm túi trước khi giao khách, đủ mọi đơn kể cả túi giấy nhỏ.',
 'Chỉ dùng mùi trong quy định chung của hệ thống, và vệ sinh không gian bằng bình xịt sả chanh của Nhà.',
 'Trong ca của mình, không gian không rơi vào trạng thái mất mùi nhận diện là tinh dầu sả java.',
 'Nhận ra mùi đang yếu hoặc đang lẫn mùi lạ trước khi khách nhận ra, và xử lý ngay.',
 'Đề xuất được cách giữ mùi ổn định cho cả điểm bán.']],

['VH10','Âm thanh, văn hóa tôn trọng không gian','diem_ban',[
 'Giữ đúng mức âm lượng đã quy định trong suốt ca.',
 'Không tự chỉnh âm lượng theo cảm xúc cá nhân. Cần đổi thì hỏi người phụ trách.',
 'Khi khách đông và ồn, chủ động mời khách làm quen với ngôn ngữ ký hiệu, thay vì tăng âm lượng để át.',
 'Lời mời đó dẫn được khách vào trạng thái tĩnh, và khách nhận ra đây là mô hình có nhân sự người điếc/ khiếm thính trực tiếp làm việc.',
 'Nhận ra âm thanh đang phá trải nghiệm và xử lý trước khi khách phản ứng.']],

['VH11','Cây xanh, ý thức gìn giữ giá trị tự nhiên','diem_ban',[
 'Không tự ý di chuyển hoặc tác động lên cây.',
 'Chủ động chăm sóc và giữ gìn phần cây trong khu vực mình phụ trách, không chờ phân công.',
 'Nhắc được đồng đội và nhắc được khách khi thấy hành vi chưa phù hợp, theo cách không làm hỏng trải nghiệm.',
 'Kể được ý nghĩa của cây xanh và của logo cho khách khi có dịp, mà không biến thành bài thuyết trình.',
 'Nhận ra chỗ cây hoặc mảng xanh đang hỏng trải nghiệm và đề xuất cách xử lý.']],

['VH12','Không gian, trách nhiệm của tất cả','diem_ban',[
 'Xử lý ngay chi tiết chưa sạch, chưa đẹp, chưa dễ chịu trong khu vực mình đứng, không chờ phân công.',
 'Làm cả việc ngoài vị trí của mình khi thấy cần, ví dụ nhân sự bán hàng chủ động thu dọn ly khách đã dùng.',
 'Đầu ca lùi lại một bước quan sát toàn bộ không gian và xử lý xong trước khi khách vào.',
 'Nhận ra chi tiết mà người khác đi qua không thấy, và xử lý hoặc báo đúng người.',
 'Đề xuất được thay đổi về bố trí không gian, và thay đổi đó giữ được sau khi áp dụng.']],

['VH13','Diễn giải sứ mệnh, văn hóa bán hàng','diem_ban',[
 'Không dùng sứ mệnh và không dùng hoàn cảnh của nhân sự người điếc/ khiếm thính làm lý do để khách mua.',
 'Trả lời được câu hỏi của khách về dự án bằng thông tin đúng và ngắn, không kể hoàn cảnh cá nhân của ai.',
 'Để khách tự cảm nhận qua ngôn ngữ ký hiệu, qua không gian và qua cách phục vụ, thay vì nói về sứ mệnh.',
 'Khách tự hỏi và tự nói ra điều dự án đang làm, mà nhân sự chưa cần nhắc tới.',
 'Kèm được người khác cách diễn giải sứ mệnh đúng chuẩn.']]
];

/* Các trục chung. Đo CÁCH LÀM VIỆC, không đo mức thạo nghề của tuyến.
 * ✅ CHỐT 4/8/2026 (Sen): TC2 Định hướng Giải pháp và TC5 Tổ chức và Vận hành
 * đã rời bộ này ở MỌI tuyến, vì một hành vi chỉ được tính điểm một chỗ. TC2
 * trùng VH7 Solution Focus; TC5 trùng nhóm QA Vận hành tuyến của ngạch quản lý.
 * Trục nào chỉ bỏ ở MỘT tuyến thì khai bằng khóa boTruc của tuyến đó trong
 * 03_DuLieuTuyen.gs, KHÔNG xóa khỏi đây, vì tuyến khác vẫn cần chấm. */
const TRUC_CHUNG = [
['TC1','Giao tiếp và Phối hợp','moi nguoi',[
 'Trao đổi rõ ràng trong phạm vi việc của mình. Không để người khác phải hỏi lại mới hiểu.',
 'Chủ động thông tin cho người liên quan trước khi họ phải hỏi.',
 'Xử lý được bất đồng trong bộ phận mà không cần đưa lên cấp trên.',
 'Làm việc trôi chảy với bộ phận khác, kể cả khi hai bên có ưu tiên khác nhau.',
 'Là đầu mối được các bộ phận tìm đến khi việc liên quan nhiều bên.']],

['TC3','Công nghệ và Công cụ','moi nguoi',[
 'Dùng được bộ công cụ số bắt buộc của vị trí mình mà không cần nhắc.',
 'Thành thạo, nhập dữ liệu đúng chuẩn ngay từ đầu, tự xử lý được sự cố nhỏ.',
 'Dùng công cụ hoặc AI để cải tiến việc của mình hoặc của nhóm. Kết quả do AI sinh ra được rà lại trước khi dùng.',
 'Chọn và triển khai công cụ cho bộ phận, và đào tạo lại được người khác.',
 'Thay đổi được cách làm của nhiều bộ phận bằng công cụ, và bảo vệ được thay đổi đó khi bị phản biện.']],

['TC4','Đa nhiệm','moi nguoi',[
 'Làm trọn phần việc trong vị trí của mình.',
 'Hỗ trợ được việc ngoài vị trí khi bộ phận cần, trong thời gian ngắn.',
 'Đảm nhận thêm được MỘT công việc ngoài việc chính, mà không ảnh hưởng việc chính.',
 'Đảm nhận thêm nhiều công việc ngoài việc chính, và thay thế được nhân sự khác trong bộ phận khi thiếu người.',
 'Năng lực phát triển ra ngoài vị trí hiện tại, sang bộ phận khác hoặc cấp cao hơn, khi tổ chức cần.']]
];

/* Cách làm việc là MỘT phần chấm duy nhất. ✅ CHỐT 4/8/2026 (Sen).
 * Trước đây chia làm hai phần có trọng số riêng giữa trụ văn hóa và các trục
 * chung. Nay hai nhóm nằm chung một danh sách, một tỷ lệ, một ngưỡng, nên
 * không còn trọng số nào phải chốt giữa chúng.
 *
 * Hàm này là chỗ DUY NHẤT ghép danh sách. Sheet khung chung và phiếu chấm đều
 * gọi nó, không nơi nào chép lại danh sách ra. Đây là cùng một nguyên tắc với
 * mục 2A của CLAUDE.md: một dữ liệu chỉ nằm một chỗ.
 *
 * Tham số T là một tuyến. Truyền null để lấy bản đầy đủ của mọi tuyến. */
/* ⚠️ ĐÃ THAY THẾ 5/8/2026. Bộ câu hỏi ở 13_BoCauHoi.gs nay là nguồn của phần
 * Cách làm việc. Hằng VAN_HOA và TRUC_CHUNG cùng hàm này chỉ còn giữ lại để
 * tra mô tả năm mức cũ, KHÔNG dùng để dựng phiếu nữa. Chờ Sen duyệt xóa hẳn,
 * vì giữ hai bộ nội dung mô tả cùng một tiêu chí là chỗ sinh lệch. */
function _cachLamViec(T) {
  const bo = (T && T.boTruc) || [];
  return VAN_HOA.concat(TRUC_CHUNG.filter(function (t) { return bo.indexOf(t[0]) < 0; }));
}

/* ==================== DỰNG SHEET ==================== */

function buildKhungChung() {
  const sh = _tao(CFG.SHEETS.CHUNG);
  _banner(sh, '🧬 KHUNG CHUNG TOÀN CÔNG TY',
    'Áp cho MỌI vị trí ở MỌI tuyến. Phần này cho ra BẬC CÁCH LÀM VIỆC, là kết quả thứ hai của phiếu.', 8);
  let r = 2;

  r = _muc(sh, r, 'A. RANH GIỚI KHÔNG THỎA HIỆP, PHẦN CHUNG. Không tính điểm, không phân bậc. Có vi phạm thì chặn mọi kết quả', 8);
  RANH_GIOI_CHUNG.forEach(function (nh) {
    sh.getRange(r,1).setValue(nh[0]).setFontWeight('bold').setFontColor(CFG.MAU.DAM);
    r++;
    nh[1].forEach(function (g,i) {
      sh.getRange(r,1).setValue(i+1).setHorizontalAlignment('center');
      sh.getRange(r,2).setValue(g).setWrap(true);
      r++;
    });
  });
  r = _note(sh, r,
    'Mỗi tuyến có thể có thêm nhóm ranh giới riêng, xem sheet ma trận của tuyến đó. Nhóm đặt tên theo chủ đề để sau này phát sinh nội dung cùng chủ đề thì chỉ cần thêm dòng vào đúng nhóm mà không phải sửa cấu trúc.', 8, 34);
  r++;

  /* ✅ CHỐT 11/8/2026 (Sen). Cơ chế thứ hai, khác hẳn ranh giới ở trên. */
  r = _muc(sh, r, 'B. BẢO MẬT THU NHẬP CÁ NHÂN. Không chặn kết quả như ranh giới, mà TRỪ THẲNG 1 bậc của Bậc cách làm việc trong kỳ, sàn là bậc 1', 8);
  sh.getRange(r,1).setValue(1).setHorizontalAlignment('center');
  sh.getRange(r,2).setValue(BAO_MAT_THU_NHAP.noiDung).setWrap(true);
  sh.getRange(r,4).setValue(BAO_MAT_THU_NHAP.hinhThuc).setWrap(true).setFontSize(9);
  _khung(sh, r-1, 1, 8);
  r += 2;
  /* Điều kiện để dùng được làm căn cứ xử lý: nghĩa vụ bảo mật thu nhập phải nằm
   * trong hợp đồng lao động hoặc nội quy lao động đã ban hành, mà Nội quy của
   * Công ty chưa ban hành. Ghi ở đây, không ghi vào chuỗi hiện ra trên sheet. */
  r = _note(sh, r,
    'Bậc cách làm việc là bậc tra hệ số ở sheet Đơn giá P2 của bảng lương People Management, nên phép trừ này chạm phần tiền P2 của tháng. CẤP của người đó không bị đụng tới, vì cấp đi qua quyết định bổ nhiệm riêng.', 8, 30);
  r++;

  r = _muc(sh, r, 'C. VĂN HÓA CHUNG. Mỗi câu chấm theo thang 1 tới 5. Một phần chấm duy nhất, không chia nhỏ và không có trọng số giữa các nhóm. VH1 tới VH8 và TC1, TC3, TC4 áp dụng cho mọi nhân sự; VH9 tới VH13 chỉ áp dụng cho vị trí có đầu việc tại điểm bán', 8);
  r = _bangCauHoi(sh, r, _cauHoiChung(null));
  r = _note(sh, r,
    'VH2 Outcome đã bao gồm SMART: kết quả cần đạt phải đủ năm yếu tố SMART, nên SMART không còn là tiêu chí riêng. Mô hình OPA tách làm ba tiêu chí VH2, VH3, VH4. ' +
    'VH8 là năng lực HAI CHIỀU: người nói học ngôn ngữ ký hiệu, người điếc/ khiếm thính học tiếng Việt. Đây là văn hóa chung nên áp cho mọi tuyến, không thuộc chuyên môn của riêng tuyến nào. ' +
    'VH9 tới VH13 là năm yếu tố hội tụ về trải nghiệm không phòng vệ. Trải nghiệm không phòng vệ là KẾT QUẢ của năm yếu tố đó, không chấm thành một dòng riêng. ' +
    'TC3 Công nghệ và Công cụ là năng lực CHUNG của mọi nhân sự, không chia theo ngạch và không lặp lại trong lưới phân bậc của tuyến. Thang của nó định nghĩa TƯƠNG ĐỐI với bộ công cụ của chính vị trí đó, để không trừng phạt có hệ thống các khối dùng ít công cụ số. ' +
    'TC4 Đa nhiệm lấy bằng chứng từ bảng việc ngoài vị trí trên phiếu chấm.', 8, 46);
  /* ✅ CHỐT 4/8/2026 (Sen), giữ lại làm ghi chú mã nguồn: ba tiêu chí đã rời bộ
   * này là TC2 trùng VH7, TC5 trùng nhóm QA, và TC1 không chấm ở tuyến Thương
   * mại & Dịch vụ vì ngạch chuyên môn của tuyến đó đã đo tại B1. */
  r = _note(sh, r,
    'Một hành vi chỉ được tính điểm một chỗ. Bảng trên là bản đầy đủ của mọi tuyến; phiếu của một tuyến chỉ hiện phần thuộc tuyến đó.', 8, 26);

  const rong = [70,300,130,290,290,290,290,290];
  for (let c = 1; c <= 8; c++) sh.setColumnWidth(c, rong[c-1]);
  sh.getRange(1,1,r,8).setVerticalAlignment('top');
  sh.setFrozenRows(1);
}

function _bangMuc(sh, r, DATA, headLeft, soMuc) {
  const head = headLeft.slice();
  for (let m = 1; m <= soMuc; m++) head.push('Mức ' + m);
  _header(sh, r, head);
  r++;
  const dau = r;
  DATA.forEach(function (d) {
    sh.getRange(r,1).setValue(d[0]).setFontWeight('bold').setBackground(CFG.MAU.NHAT);
    sh.getRange(r,2).setValue(d[1]).setWrap(true).setBackground(CFG.MAU.NHAT);
    sh.getRange(r,3).setValue(
        d[2] === 'diem_ban'    ? 'Chỉ vị trí tại điểm bán'
      : d[2] === 'chi quan ly' ? 'Chỉ vai trò quản lý' : 'Mọi nhân sự')
      .setWrap(true).setFontSize(9).setFontColor(CFG.MAU.CHU_GHI).setBackground(CFG.MAU.NHAT);
    for (let m = 0; m < soMuc; m++) sh.getRange(r, 4+m).setValue(d[3][m]).setWrap(true).setFontSize(9);
    r++;
  });
  _khung(sh, dau-1, DATA.length, 3 + soMuc);
  return r;
}

/**
 * Bảng bộ câu hỏi cho sheet khung chung. Hai tầng: dòng tên nhóm, rồi các câu.
 * Cùng nguồn với phiếu chấm, đều gọi _cauHoiChung ở 13_BoCauHoi.gs.
 */
function _bangCauHoi(sh, r, NHOM) {
  /* ✅ SỬA 31/8/2026 (Sen). Cột Bậc trong ngạch đã bỏ. Ngưỡng cấp nay nằm ngay
   * trong cột Phạm vi áp dụng, ghi bằng TÊN, dạng "Từ Trưởng phòng trở lên". */
  _header(sh, r, ['Mã', 'Câu hỏi', 'Phạm vi áp dụng']);
  r++;
  const dau = r;
  NHOM.forEach(function (nh) {
    sh.getRange(r,1).setValue(nh[0]).setFontWeight('bold').setFontColor(CFG.MAU.DAM);
    sh.getRange(r,2).setValue(nh[1] + '   ·   chấm theo mức độ ' + (nh[3] || 'ghi nhận'))
      .setFontWeight('bold').setWrap(true);
    sh.getRange(r,1,1,3).setBackground(CFG.MAU.NHAT);
    r++;
    nh[2].forEach(function (c) {
      sh.getRange(r,1).setValue(c[0]).setFontColor(CFG.MAU.CHU_GHI);
      sh.getRange(r,2).setValue(c[1]).setWrap(true);
      sh.getRange(r,3).setValue(c[2]).setWrap(true).setFontSize(9)
        .setFontColor(CFG.MAU.CHU_GHI);
      r++;
    });
  });
  _khung(sh, dau-1, r-dau, 3);
  return r;
}

/* ==================== DANH MỤC TUYẾN ==================== */

function buildDanhMuc() {
  const sh = _tao(CFG.SHEETS.DM);
  _banner(sh, '📇 DANH MỤC TUYẾN',
    'Thêm tuyến mới: mở Apps Script, thêm một khối vào hằng TUYEN trong 03_DuLieuTuyen, rồi chạy 🔄 Cập nhật phiên bản.', 8);
  _header(sh, 2, ['Tuyến','Trạng thái','Ngạch áp dụng','Phạm vi','Kiểu tiêu chí chuyên môn','Các cấp của lưới','Điểm bán','Sheet ma trận']);
  let r = 3;
  Object.keys(TUYEN).forEach(function (ten) {
    const T = TUYEN[ten];
    sh.getRange(r,1).setValue(ten).setFontWeight('bold').setBackground(CFG.MAU.NHAT);
    sh.getRange(r,2).setValue(T.trangThai === 'đủ' ? '✅ đủ nội dung' : '⬜ khung rỗng')
      .setBackground(T.trangThai === 'đủ' ? CFG.MAU.DAT : CFG.MAU.CHO).setHorizontalAlignment('center');
    sh.getRange(r,3).setValue(T.ngach.join(' + ')).setWrap(true);
    sh.getRange(r,4).setValue(T.moTa).setWrap(true).setFontSize(9);
    sh.getRange(r,5).setValue(
      T.chuoi.length ? 'Thang cộng dồn ' + T.chuoi.length + ' bước' +
        (T.rieng.length ? ' cộng ' + T.rieng.length + ' tiêu chí độc lập' : '')
      : T.rieng.length ? T.rieng.length + ' tiêu chí độc lập' : 'chưa soạn').setWrap(true).setFontSize(9);
    sh.getRange(r,6).setValue(
      'CM ' + _tenCapHien(T.bacCM[0][1]) + ' tới ' + _tenCapHien(T.bacCM[T.bacCM.length-1][1]) +
      ' · QL ' + _tenCapHien(T.bacQL[0][1]) + ' tới ' + _tenCapHien(T.bacQL[T.bacQL.length-1][1]))
      .setFontSize(9).setWrap(true);
    sh.getRange(r,7).setValue(T.coDiemBan ? 'Có' : 'Không').setHorizontalAlignment('center');
    sh.getRange(r,8).setValue(CFG.MT_PREFIX + ten).setFontSize(9).setFontColor(CFG.MAU.CHU_GHI);
    r++;
  });
  _khung(sh, 2, Object.keys(TUYEN).length, 8);
  r++;
  r = _note(sh, r,
    'Tuyến khung rỗng vẫn xuất phiếu được: phần khung chung, ranh giới chung và cách tính đều chạy đủ; riêng phần lưới phân bậc hiện dòng chờ soạn. ' +
    'Làm vậy để bắt đầu chấm phần cách làm việc ngay, không phải chờ soạn xong lưới của mọi tuyến.', 8, 34);
  const rong = [170,120,150,400,200,140,80,200];
  for (let c = 1; c <= 8; c++) sh.setColumnWidth(c, rong[c-1]);
  sh.getRange(1,1,r,8).setVerticalAlignment('top');
}
