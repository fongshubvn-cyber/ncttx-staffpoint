/**
 * MODULE 03: Dữ liệu từng tuyến. ĐÂY LÀ NƠI DUY NHẤT PHẢI SỬA KHI THÊM TUYẾN.
 *
 * ================= CẤU TRÚC MỘT TUYẾN =================
 *  trangThai      'đủ' hoặc 'khung rỗng'. Khung rỗng vẫn xuất phiếu được,
 *                 nhưng phần lưới để trống chờ soạn.
 *  ngach          ['chuyên môn','quản lý']. ✅ 24/8/2026: ngạch tay nghề đã bỏ
 *  moTa           phạm vi tuyến, hiện trên đầu sheet ma trận và trên phiếu
 *  vidu           một câu ví dụ giúp người đọc nhận ra ai thuộc tuyến này
 *  ranhGioi       [[tên nhóm, [các ranh giới]]] không phân bậc, không tính điểm.
 *                 Vi phạm thì chặn mọi kết quả. Nhóm đặt tên theo CHỦ ĐỀ để
 *                 sau này thêm sản phẩm mới chỉ cần thêm dòng vào đúng nhóm.
 *  bacCM          [[số bậc, tên bậc, tên tiếng Anh, chức danh thực tế]]
 *  chuoi          THANG CỘNG DỒN. Phần tử thứ n là nội dung của BẬC THỨ n.
 *                 Chấm Đạt hoặc Chưa đạt. Bậc theo thang là n lớn nhất mà mọi
 *                 phần tử từ 1 tới n đều Đạt. Không nhảy cóc.
 *                 Để mảng rỗng nếu tuyến không có trình tự nghề tự nhiên.
 *  rieng          [[mã, tên, [nội dung bậc 1..N]]] tiêu chí phân bậc độc lập.
 *  bacQL, quanLy  như trên, cho ngạch quản lý.
 * ======================================================
 *
 * BẢNG BA NGẠCH CỦA CÔNG TY, lấy theo sơ đồ scale-up v3 ngày 31/7/2026.
 * Cùng một bậc thì ba ngạch ngang quyền và ngang tiền.
 *   Bậc 6  Trưởng phòng          | chưa mở                | chưa mở
 *   Bậc 5  Quản lý khối          | Chuyên gia
 *   Bậc 4  Lead bộ phận          | Chuyên viên
 *   Bậc 3  Trưởng ca             | chưa mở
 *   Bậc 2  chưa mở               | Nhân viên
 *   Bậc 1  Tập sự, chung cho cả hai ngạch
 */

/* Mẫu bậc dùng lại, để không gõ lại ở từng tuyến */
/* ✅ CHỐT 9/8/2026 (Sen). Ngạch chuyên môn còn BA bậc.
 * Tập sự KHÔNG phải một bậc của ngạch, nó là thử việc, intern hoặc trainee.
 * ✅ CHỐT 24/8/2026 (Sen). CÒN HAI NGẠCH. Ngạch tay nghề đã bỏ, gộp vào ngạch
 * chuyên môn, vì hai ngạch cùng hình dạng và cùng tiền, chỉ khác nhãn. Bốn tên
 * 'Chuyên viên chính', 'Nhân viên tay nghề cao', 'Nhân viên bậc cao', 'Nghệ nhân'
 * đều rời khỏi thang. ⚠️ Thứ phân biệt các tuyến nghề là LƯỚI PHÂN BẬC của từng
 * tuyến, không phải tên ngạch, nên gộp ngạch KHÔNG làm mất chỗ đứng của các tuyến
 * sản xuất và pha chế trên đường thăng tiến.
 * Số bậc giữ nguyên 2, 4, 5 để còn so ngang được với ngạch quản lý:
 *   bậc 2 Nhân viên · bậc 3 Trưởng ca (chỉ ngạch quản lý) · bậc 4 Lead và Chuyên viên
 *   · bậc 5 Quản lý khối và Chuyên gia · bậc 6 Trưởng phòng (chỉ ngạch quản lý).
 * Căn cứ: sheet People Management, Chuyên viên và Lead cùng 8.000.000. */
/* ✅ THÊM 24/8/2026 (Sen bỏ ngạch tay nghề). Danh sách tuyến làm nghề thủ công.
 * Trước đây lưới của các tuyến này nhận diện qua ngạch 'tay nghề'. Ngạch đó đã bỏ,
 * nên hằng này là chỗ DUY NHẤT còn khai chúng. Dùng ở 05_MaTran.gs để giữ lưu ý về
 * cách soạn lưới cho nhân sự người điếc/ khiếm thính. */
const TUYEN_NGHE_THU_CONG = ['Pha chế', 'Bếp bánh', 'Sản xuất', 'Kho và Đóng gói'];

const BAC_CHUYEN_MON = [
 [2,'Nhân viên','Junior Specialist',''],
 [4,'Chuyên viên','Senior Specialist',''],
 [5,'Chuyên gia','Expert','']
];
const BAC_QUAN_LY = [
 [3,'Trưởng ca','Shift Leader',''],[4,'Lead bộ phận','Lead',''],
 [5,'Quản lý khối','Manager',''],[6,'Trưởng phòng','Head of Department','']
];

/* ==================================================== THANG CẤP, VÀ THỨ HẠNG
 * ✅ CHỐT 19/8/2026 (Sen), sửa 31/8/2026 (Sen).
 *
 * Bảng dưới là chỗ DUY NHẤT khai thứ tự trước sau của các cấp. Cột số KHÔNG
 * phải một thang đo và KHÔNG hiện ra ở bất kỳ đâu người đọc thấy: nó chỉ là
 * thứ hạng để máy so được "cấp này có từ cấp kia trở lên không".
 *
 * ⛔ Chữ BẬC nay chỉ còn MỘT nghĩa trong toàn hệ: BẬC CÁCH LÀM VIỆC 1 tới 5,
 * thứ ĐI RA từ phiếu và tra hệ số ở sheet Đơn giá P2 ra tiền. Cái từng gọi là
 * "bậc trong ngạch" nay gọi thẳng bằng TÊN CẤP. Lý do đổi: hai ngạch dùng chung
 * một dãy số nhưng tên khác nhau, nên số 4 vừa là Lead bộ phận vừa là Chuyên
 * viên, và bộ câu hỏi đã có một nhãn sai vì chuyện đó.
 *
 * ⚠️ Chuyên viên xếp NGANG Lead bộ phận, theo chốt 9/8/2026. Căn cứ: People
 * Management trả Chuyên viên và Lead cùng 8.000.000. Cột Ghi chú của sheet Danh
 * mục vị trí còn ghi "ngang Trưởng ca", đó là chữ chưa sửa theo, không phải một
 * chốt. Trưởng ca đang trả 7.500.000. */
const CAP_BAC = [
 ['Tập sự',                 1, 'cả ba'],
 ['Nhân viên',              2, 'cả ba'],
 ['Trưởng ca',              3, 'Quản lý'],
 ['Lead',                   4, 'Quản lý'],
 ['Chuyên viên',            4, 'Chuyên môn'],
 ['Quản lý khối',           5, 'Quản lý'],
 ['Chuyên gia',             5, 'Chuyên môn'],
 ['Trưởng phòng',           6, 'Quản lý'],
 ['C-Level',                7, 'Quản lý'],
 ['CEO',                    8, 'Quản lý'],
 ['Founder',                9, 'Quản lý']
];

/* Tên khác của cùng một cấp, gặp thật trên sơ đồ và trong bacQL của các tuyến.
   Mỗi dòng là [tên gặp ngoài đời, tên chuẩn trong CAP_BAC]. */
const CAP_TEN_KHAC = [
 ['Cửa hàng trưởng', 'Quản lý khối'],
 ['Quản lý',         'Quản lý khối'],
 ['Lead bộ phận',    'Lead']
];

/* Tên CŨ của một tuyến, để phiếu vẫn xuất được khi Google Sheet chưa kịp đổi theo.
   Mỗi dòng là [tên cũ còn gặp trên sheet, tên chuẩn trong TUYEN].
   ✅ THÊM 23/8/2026: Phòng Nhân sự - Hành chính đổi tên khi pháp chế thành chức năng thứ ba. */
const TUYEN_TEN_KHAC = [
 ['Nhân sự - Hành chính', 'Nhân sự - Hành chính - Pháp chế']
];

/**
 * Chuẩn hóa một tên tuyến đọc từ sheet. Tên đã chuẩn thì trả về chính nó.
 * Dùng ở MỌI cửa vào đọc cột Tuyến, để việc đổi tên không phụ thuộc
 * thứ tự sửa giữa hệ file và Google Sheet.
 */
function _chuanTenTuyen(ten) {
  const s = String(ten || '').trim();
  if (!s) return s;
  for (let i = 0; i < TUYEN_TEN_KHAC.length; i++) {
    if (TUYEN_TEN_KHAC[i][0].toLowerCase() === s.toLowerCase()) return TUYEN_TEN_KHAC[i][1];
  }
  return s;
}

/** Danh sách tên cấp để hiện lên hộp chọn, giữ đúng thứ tự thăng tiến. */
function _dsCap() { return CAP_BAC.map(function (c) { return c[0]; }); }

/* Tên hiển thị của một cấp. CAP_BAC ghi 'Lead' cho gọn, nhưng chuỗi Sen gõ và
 * bộ câu hỏi đang dùng là 'Lead bộ phận', khớp `0-Nen-tang/Du-lieu/cap-bac.csv`.
 * _traCap nhận cả hai nhờ CAP_TEN_KHAC, nên đây chỉ là chuyện hiển thị. */
const CAP_TEN_HIEN = { 'Lead': 'Lead bộ phận' };
function _tenCapHien(t) { return CAP_TEN_HIEN[String(t)] || String(t); }

/**
 * Tên các cấp dùng làm NGƯỠNG ở cột Phạm vi áp dụng của sheet Bộ câu hỏi,
 * xếp từ thấp lên cao. ✅ THÊM 31/8/2026 (Sen), thay cột Bậc trong ngạch.
 *
 * Bỏ Tập sự và Nhân viên, vì đặt ngưỡng ở đó nghĩa là áp cho mọi người, đã có
 * giá trị "Tất cả nhân sự" nói điều đó rõ hơn. Bỏ C-Level, CEO và Người sáng lập,
 * vì `cap-bac.csv` khai cột `cham` của ba cấp đó là `khong`: chúng xếp bằng
 * quyết định bổ nhiệm chứ không chấm.
 */
function _dsCapNguong() {
  return CAP_BAC
    .filter(function (c) { return c[1] >= 3 && c[1] <= 6; })
    .map(function (c) { return _tenCapHien(c[0]); });
}

/** Tra một tên cấp CHÍNH XÁC. Trả về {cap, bac, ngach} hoặc null. */
function _traCap(ten) {
  const s = String(ten || '').trim().toLowerCase();
  if (!s) return null;
  let chuan = s;
  CAP_TEN_KHAC.forEach(function (k) {
    if (k[0].toLowerCase() === s) chuan = k[1].toLowerCase();
  });
  let kq = null;
  CAP_BAC.forEach(function (c) {
    if (c[0].toLowerCase() === chuan) kq = { cap: c[0], bac: c[1], ngach: c[2] };
  });
  return kq;
}

/**
 * Suy cấp từ chuỗi VỊ TRÍ, ví dụ "Chuyên viên Thương mại & Dịch vụ" ra Chuyên viên.
 * Dò tên DÀI TRƯỚC, vì "Chuyên viên" chứa "viên" và
 * "Quản lý khối" chứa "Quản lý". Không khớp thì trả null, và phiếu để bậc 0.
 */
function _capTuViTri(viTri) {
  const s = String(viTri || '').toLowerCase();
  if (!s) return null;
  const ten = _dsCap().concat(CAP_TEN_KHAC.map(function (k) { return k[0]; }));
  ten.sort(function (a,b) { return b.length - a.length; });
  for (let i = 0; i < ten.length; i++) {
    if (s.indexOf(ten[i].toLowerCase()) > -1) return _traCap(ten[i]);
  }
  return null;
}

/** Sao chép mẫu bậc rồi gắn chức danh thực tế của tuyến. */
function _bac(mau, chucDanh) {
  return mau.map(function (b, i) {
    return [b[0], b[1], b[2], (chucDanh && chucDanh[i]) ? chucDanh[i] : 'chưa thiết lập'];
  });
}

const TUYEN = {

/* ================================================================== */
/* TUYẾN THƯƠNG MẠI & DỊCH VỤ. Tuyến đầu tiên soạn đủ nội dung.                  */
/* ================================================================== */
'Thương mại & Dịch vụ': {
  trangThai: 'đủ',
  ngach: ['chuyên môn','quản lý'],
  moTa: 'Các vị trí tạo ra doanh thu do NGƯỜI TIÊU DÙNG CUỐI chi trả: bán tại Quán, bán trên các sàn thương mại điện tử với tư cách gian hàng chính thức của Công ty, và bán lẻ qua các kênh khác.',
  vidu: 'Ranh giới với tuyến Phát triển Kinh doanh xác định bằng đúng một câu hỏi: AI TRẢ TIỀN. Người tiêu dùng cuối trả thì thuộc tuyến này; một tổ chức trả thì thuộc tuyến Phát triển Kinh doanh.',
  coDiemBan: true,

  /* ✅ CHỐT 4/8/2026 (Sen). TC1 Giao tiếp và Phối hợp KHÔNG chấm ở tuyến này,
   * vì ngạch chuyên môn của tuyến đã đo cùng năng lực đó tại B1 Tạo tín nhiệm
   * với khách hàng. Một hành vi chỉ được tính điểm một chỗ.
   * Khai ở đây chứ không xóa khỏi hằng TRUC_CHUNG, vì tuyến Phát triển Kinh
   * doanh vẫn chấm TC1. */
  boTruc: ['TC1'],

  ranhGioi: [
   ['Bán hàng', [
    'Không sử dụng sứ mệnh để bán hàng, và không lấy hoàn cảnh của nhân sự người điếc/ khiếm thính làm công cụ thuyết phục khách. Sứ mệnh của Công ty là phá vỡ định kiến rằng doanh nghiệp lợi dụng người khuyết tật',
    'Không nói quá về khả năng của sản phẩm. Sản phẩm không giải quyết đúng vấn đề của khách thì không đề xuất',
    'Áp dụng đúng bảng giá và chương trình khuyến mãi đang có hiệu lực trên mọi kênh, không tự điều chỉnh. Ca ngoài khung chuyển sang người có thẩm quyền TRƯỚC khi hứa với khách'
   ]],
   /* ✅ CHỐT 11/8/2026 (Sen). Nhóm An toàn sản phẩm ĐÃ RỜI khỏi đây, chuyển sang
    * ngạch chuyên môn để chấm điểm, tại C6 Kiến thức sản phẩm và thực đơn.
    * Lý do: chính dòng ranh giới cũ đã trỏ nội dung của nó về C6, nên để lại đây
    * là một nội dung nằm hai nơi. Và ranh giới CHẶN mọi kết quả, tức mọi mức
    * thiếu sót đều thành một mức duy nhất, không phân biệt được người quên một
    * cảnh báo với người không bao giờ nêu cảnh báo nào. */
  ],

  bacCM: _bac(BAC_CHUYEN_MON, ['Nhân viên Thương mại & Dịch vụ','Chuyên viên Thương mại & Dịch vụ, đang tuyển','chưa thiết lập']),

  /* Năm bước đã gộp của Quy trình 7 bước bán hàng.
     Bước thứ n CHÍNH LÀ nội dung của bậc thứ n. */
  /* ✅ CHỐT 9/8/2026 (Sen). Bỏ thang cộng dồn. Mục III không còn logic mỗi B là
   * một bậc; mọi nhóm của ngạch chuyên môn nay nằm trong `rieng` và tính điểm
   * giống hệt các phần khác: mỗi nhóm tự ra một bậc từ điểm các câu, rồi ghép
   * bằng quy tắc đa số. */
  chuoi: [],

  /* Mọi nhóm phân bậc của ngạch chuyên môn nằm ở đây. Ba cột bậc ứng với
   * bậc 2 Nhân viên, bậc 4 Chuyên viên, bậc 5 Chuyên gia. */
  rieng: [
   ['B1','Bước 1. Tạo tín nhiệm với khách hàng',[
    'Giữ đủ quy tắc ứng xử trong mọi lần tiếp xúc và trên mọi kênh: danh xưng Nhà, Quán, Xưởng; gọi khách bằng anh, chị, bạn, mình; tác phong lễ phép; không kì kèo, không đánh giá khách, không chứng minh khách sai, không nói xấu đối thủ, không so sánh.',
    'Khách chưa biết thương hiệu vẫn mở lòng nói về vấn đề của mình sau phần mở đầu.',
    'Duy trì, và là chuẩn để người khác trong tuyến soi theo.']],

   ['B2','Bước 2. Khai thác vấn đề và nhu cầu',[
    'Đặt câu hỏi có trọng tâm, mỗi câu làm rõ kết quả cần đạt hoặc bước tiếp theo. Kết thúc mỗi lượt nói bằng một câu hỏi hoặc lời đề nghị.',
    'Khách nói ra vấn đề mà chưa cần được hỏi thẳng. Xác định đúng vấn đề ngay trong lượt tư vấn.',
    'Duy trì.']],

   ['B3','Bước 3 tới 6. Cung cấp giải pháp, chốt đơn và xử lý từ chối',[
    'Chọn đúng sản phẩm cho đúng vấn đề. Chốt thử khi đã có tín nhiệm, đã rõ vấn đề, đã đề xuất giải pháp cụ thể. Không dùng câu hỏi đóng kiểu hỏi khách có mua không.',
    'Tìm được nguyên nhân gốc phía sau điều khách nói. Nói được khi nào sản phẩm không phải giải pháp và từ chối bán. Ghép được bộ giải pháp. Phân loại đúng dạng từ chối và xử theo đúng dạng.',
    'Bộ giải pháp mình ghép được duyệt thành bộ dùng chung của Công ty.']],

   ['B5','Bước 7. Chăm sóc sau bán và lan toả',[
    'Hướng dẫn sử dụng đủ để khách dùng đúng ngay lần đầu. Cung cấp thông tin hậu mãi. Giữ kết nối sau thanh toán.',
    'Giúp khách đạt được điều họ cần khi mua, không dừng ở giao hàng đúng.',
    'Tạo được lý do để khách kể lại cho người khác, kể cả khách không mua hoặc mua ít.']],

   /* ✅ CHỐT 11/8/2026 (Sen). Nhóm này nhận thêm phần AN TOÀN SẢN PHẨM,
    * trước ngày này là ranh giới số 8 của tuyến. Nay chấm điểm ở bậc 2. */
   ['C6','Kiến thức sản phẩm, thực đơn và an toàn sản phẩm',[
    'Trả lời được công dụng, cách dùng, thành phần, hạn sử dụng, cách bảo quản và cảnh báo an toàn của mọi nhóm sản phẩm, cộng thực đơn đồ uống và các set trà, mà không phải hỏi lại người khác. Nêu đủ cảnh báo an toàn, đối tượng không dùng được, cách dùng lần đầu và hạn sử dụng theo quy định an toàn sản phẩm đang hiệu lực, nêu ngay khi tư vấn chứ không chờ khách hỏi.',
    'Nêu được thứ nào KHÔNG giải quyết vấn đề nào. Giải thích được cách sản phẩm được làm ra ở mức khách tin. Tư vấn được cả sản phẩm của tuyến Pha chế và tuyến Bếp bánh.',
    'Là đầu mối tuyến tham vấn về sản phẩm. Cùng Khối Sản xuất soạn phần thông tin sản phẩm dùng cho bán hàng.']],

   ['C7','Bán cho nhiều khách cùng lúc',[
    'Tiếp được nhiều khách cùng lúc mà không để khách nào bị bỏ quên.',
    'Trong khung giờ đông, chọn đúng lúc tư vấn một đối một và lúc giới thiệu cùng lúc cho cả nhóm. Nhận ra người ra quyết định trong nhóm khách. Tỷ lệ chốt khung giờ đông không thấp hơn khung giờ thường đáng kể.',
    'Thiết kế được luồng tiếp khách cho khung giờ đông và đề xuất sang người phụ trách đơn vị.']],

   /* ✅ THÊM 9/8/2026 (Sen). Tự tạo nguồn khách bằng kênh CÁ NHÂN của nhân sự,
    * không phải kênh chính thức của Công ty. Social Media và E-Commerce vẫn giữ
    * kênh chính thức; tuyến Thương mại & Dịch vụ nay cạnh tranh trên cùng sân.
    * Không có mô tả ở bậc 2: bậc Nhân viên không bị đòi tự tạo nguồn khách.
    * ✅ RÚT GỌN 11/8/2026 (Sen). Bộ câu hỏi còn đúng một câu, và yêu cầu về quy
    * chuẩn thương hiệu chuyển lên tên tiêu chí. Lưới bậc kéo theo hai chỗ:
    * bậc 4 bỏ vế "lặp lại qua các kỳ" vì câu đo vế đó đã xóa; bậc 5 chuyển thành
    * Duy trì, vì nội dung cũ của ô này chính là hai câu C8.4 và C8.5 vừa xóa.
    * ⚠️ Hệ quả: C8 không còn nội dung riêng ở bậc 5. */
   ['C8','Tự tạo nguồn khách qua kênh cá nhân, và giữ nội dung đăng đúng quy chuẩn thương hiệu, không sai lệch thông tin sản phẩm',[
    'Không yêu cầu ở bậc này. Nhân viên bán trên nguồn khách sẵn có của Công ty.',
    'Có khách tự tìm đến qua kênh cá nhân của nhân sự, bằng nội dung đăng, livestream hoặc cách khác. Nội dung đăng đúng quy chuẩn thương hiệu và không sai lệch thông tin sản phẩm.',
    'Duy trì.']]
  ],

  bacQL: _bac(BAC_QUAN_LY, ['Trưởng ca','Lead Thương mại & Dịch vụ','Cửa hàng trưởng','Trưởng phòng Thương mại & Dịch vụ']),

  quanLy: [
   ['QA','Vận hành tuyến','Tổ chức công việc, chỉ tiêu và phân bổ, bảo đảm thực thi quy định',[
    'Tổ chức công việc trong ca của mình. Nhận chỉ tiêu ca và phân việc cho nhân sự trong ca. Nhắc và chặn tại chỗ khi thấy hành vi vượt ranh giới, báo lên ngay trong ca.',
    'Tổ chức công việc của bộ phận qua nhiều ca. Nhận chỉ tiêu tháng rồi phân bổ xuống từng người theo năng lực thật, giải thích được bằng số liệu chứ không chia đều. Kiểm tra chủ động, xử theo thang, ghi nhận việc một nhân sự từ chối cơ hội bán không phù hợp là hành vi ĐÚNG.',
    'Tổ chức công việc của cả điểm bán, giữ chạy khi nhân sự chủ chốt vắng mặt. Điều chỉnh phân bổ trong kỳ khi thực tế đổi. Bảo đảm chỉ tiêu và chương trình đặt ra luôn có đường đạt kết quả mà vẫn giữ đúng quy định.',
    'Thiết kế cách tổ chức của cả tuyến trên mọi kênh, chuyển giao được khi mở điểm bán mới. Nhận chỉ tiêu tổng và phân bổ xuống kênh. Bổ khuyết phần cách làm khi một quy định mới chỉ có điều cấm mà chưa có cách làm thay thế.']],

   ['QB','Đội ngũ, phối hợp và kèm nghề','Phát triển đội ngũ, điều phối đơn vị khác, kèm nghề',[
    'Kèm nhân sự mới trong ca theo nội dung đã có. Báo nhu cầu phối hợp lên cấp trên.',
    'Kèm trực tiếp trên sàn bán. Nghe một lượt tiếp khách của người khác thì chỉ ra được người đó đang mắc ở bước nào. Kèm nhân sự mới cho tới khi tự làm được một lượt bán trọn vẹn. Nêu đúng nội dung cần đào tạo sang Phòng Nhân sự - Hành chính - Pháp chế.',
    'Chịu trách nhiệm về thời gian một người mới đạt chuẩn nghề. Là đầu mối các bộ phận trong điểm bán tìm đến khi việc liên quan nhiều bên.',
    'Đưa được việc bán vào ưu tiên của các phòng và khối khác bằng lập luận và uy tín nghề. Hệ thống hóa cách bán của tuyến thành tài liệu chuyển giao khi Công ty mở điểm bán mới.']],

   ['QC','Chi phí bán hàng và cơ cấu hàng bán','Ngân sách, chi phí bán hàng, cơ cấu hàng bán',[
    'Chi theo định mức ca. Chưa có quyền quyết định về giá và chương trình.',
    'Chi trong hạn mức bộ phận. Đọc được số liệu bán của nhóm hàng mình phụ trách. Đề xuất đẩy hoặc ngừng một sản phẩm kèm số liệu bán.',
    'Lập ngân sách hoạt động của điểm bán trong target chi phí bán hàng được Giám đốc Kinh doanh giao, và giữ chi phí bán hàng của điểm bán trong tỷ lệ đó.',
    'Chủ trì thiết kế chương trình khuyến mãi và cơ cấu hàng bán của tuyến trong khung chi phí bán hàng được giao. Tính được chi phí bán hàng từng kênh gồm phí sàn, phí vận chuyển và chiết khấu. Đọc được lợi nhuận trước giá vốn hàng bán. Nhận ra khi một chương trình chỉ chuyển doanh thu của kỳ sau về kỳ này.'
   ]],

   ['QD','Thị trường và bộ số','Thị trường và đối thủ, dự báo bán, bộ chỉ số, đọc bộ số của chính mình',[
    'Ghi nhận đúng dữ liệu bán của ca vào hệ thống. Đọc được bộ số của chính mình gồm tỷ lệ chuyển đổi, giá trị đơn trung bình, tỷ lệ đơn có bán thêm, tỷ lệ khách quay lại và tỷ lệ đổi trả. Báo lại điều nghe được từ khách và từ thị trường.',
    'Đọc bộ số của bộ phận, chỉ ra được người nào mắc ở đâu. Nắm giá và chương trình khuyến mãi của đối thủ trong khu vực.',
    'Lập dự báo bán của điểm bán có tính mùa vụ, tách được phần tăng do mùa khỏi phần tăng thực. Hiểu chu kỳ sản xuất thủ công và thời gian chuẩn bị nguyên liệu. Trình bày số liệu cho người không quen đọc số.',
    'Nêu được tuyến cần theo dõi những chỉ số nào và mỗi chỉ số ghi nhận thế nào, đề xuất sang Phòng Vận hành để đưa vào chuẩn ghi nhận dữ liệu. Nhận định về thị trường đưa ra ở kỳ trước khớp với diễn biến kỳ sau. Phân biệt được tương quan và nhân quả ở mức đủ để không kết luận sai từ một đợt khuyến mãi trùng mùa cao điểm.']],

   ['QE','Hiểu nghề của các tuyến khác trong điểm bán','Mới, chốt 02/8/2026',[
    'Nắm phần việc của tuyến mình. Biết ai phụ trách phần còn lại của điểm bán.',
    'Hiểu quy trình và điểm nghẽn của tuyến mình đủ để phân việc và nghiệm thu.',
    'Hiểu nghề của CẢ Pha chế, Bếp bánh và Thương mại & Dịch vụ ở mức nghiệm thu được chất lượng và xử lý được sự cố liên tuyến. Vị trí Cửa hàng trưởng có thể xuất phát từ bất kỳ tuyến nào trong ba tuyến, nên bậc này đòi hiểu đủ ba. Sản phẩm của Pha chế và Bếp bánh cũng là sản phẩm bán ra, nên đây là yêu cầu nghề chứ không phải yêu cầu hành chính.',
    'Duy trì, cộng phần chuyển giao hiểu biết liên tuyến khi Công ty mở điểm bán mới.']],

   ['QF','Nâng chuẩn','Đưa cách làm hiệu quả thành chuẩn',[
    'Phát hiện cách làm hiệu quả trong ca và báo lên.',
    'Mô tả lại cách làm đủ rõ để người khác trong bộ phận dùng lại được.',
    'Đề xuất chuẩn hóa sang Phòng Vận hành, mô tả đủ rõ để chuẩn hóa được mà không phải hỏi thêm. DUYỆT bộ giải pháp do ngạch chuyên môn ghép thành bộ dùng chung của Công ty.',
    'Đề xuất được chấp thuận thành chuẩn dùng chung của Công ty, và theo dõi kết quả sau khi nhân rộng.']],

   /* ✅ THÊM 11/8/2026 (Sen). Hai nhóm về cách làm việc với người.
    * Trước ngày này, ngạch quản lý chỉ đo kèm nghề và điều phối tại QB, không có
    * chỗ nào đo cách hỏi lẫn cách đối xử với người mình phụ trách.
    * QH soi từ nhóm B2 của ngạch chuyên môn: cùng kỹ năng hỏi, đổi đối tượng từ
    * khách hàng sang người trong nhóm.
    * QK chuyển sang từ nhóm TC6 của phần chung, vì đặt ở phần chung thì nó chỉ
    * chạm bậc cách làm việc, không chạm bậc quản lý.
    * ⚠️ Nội dung bốn ô bậc của cả hai nhóm là ĐỀ XUẤT, Sen chưa duyệt. */
   ['QH','Hỏi và lắng nghe trong đội nhóm','Cách đặt câu hỏi để người trong nhóm nói ra được vấn đề thật',[
    'Hỏi để nắm được việc đang vướng ở đâu trong ca. Nhắc lại được vấn đề của người kia bằng chính điều người đó vừa nói, trước khi xử lý.',
    'Hỏi để người trong bộ phận tự nói ra trở ngại, không phải chờ hỏi thẳng. Không kết luận nguyên nhân trước khi hỏi. Sau mỗi lần trao đổi, hai bên thống nhất được bước tiếp theo.',
    'Nhận ra dấu hiệu một người đang có việc chưa nói ra, và mở được cuộc trao đổi trước khi việc thành sự cố.',
    'Hướng dẫn lại được cách hỏi cho các quản lý cấp dưới, và cách đó thành cách làm chung của tuyến.']],

   ['QK','Thấu cảm với người mình phụ trách','Cách đối xử với người trong nhóm, đo bằng lời nói và hành động cụ thể',[
    'Trao đổi với người trong ca không chỉ khi giao việc hoặc khi có sai sót. Việc người kia nêu thì trả lời lại, kể cả khi chưa xử lý được thì nêu lý do.',
    'Nắm được trở ngại của từng người trong bộ phận trước khi công việc trễ hạn. Quyết định chạm trực tiếp tới một người thì trao đổi với người đó trước.',
    'Có thay đổi về cách làm hoặc về phân công thì trao đổi với người chịu ảnh hưởng nhiều nhất trước khi thông báo chung, và nêu được lý do thay đổi.',
    'Xử lý dứt điểm được trường hợp khó như bất đồng kéo dài giữa hai người, và đưa cách xử lý thành nội dung chuyển giao cho quản lý của điểm bán khác.']]
  ]
},

/* ================================================================== */
/* CÁC TUYẾN CÒN LẠI: KHUNG RỖNG, chờ soạn nội dung.                   */
/* Xuất phiếu vẫn chạy, phần lưới hiện dòng chờ soạn.                  */
/* ================================================================== */

'Phát triển Kinh doanh': _khungRong(
  'chuyên môn',
  'Các vị trí tự tạo ra nguồn khách hàng, không phụ thuộc lượng khách tự tìm tới Quán hay tới gian hàng trên sàn.',
  'Ranh giới với tuyến Thương mại & Dịch vụ: giao dịch do MỘT TỔ CHỨC chi trả thuộc tuyến này.',
  false, ['chưa thiết lập','chưa thiết lập','Chuyên viên Phát triển Kinh doanh','chưa thiết lập','chưa thiết lập'],
  ['chưa thiết lập','Lead Phát triển Kinh doanh','Quản lý Phát triển Kinh doanh','Trưởng phòng Phát triển Kinh doanh']),

'Pha chế': _khungRong(
  'chuyên môn',
  'Các vị trí pha chế đồ uống tại Quán theo bộ công thức và bộ quy trình pha chế của Công ty.',
  'Sản phẩm của tuyến này là hàng bán ra tại điểm bán, nên chất lượng của nó là một phần kết quả thương mại.',
  true, ['chưa thiết lập','Nhân viên Pha chế','chưa thiết lập','chưa thiết lập','chưa thiết lập'],
  ['Trưởng ca','Lead Pha chế - Bếp Bánh','Cửa hàng trưởng','chưa thiết lập']),

'Bếp bánh': _khungRong(
  'chuyên môn',
  'Các vị trí làm bánh phục vụ tại Quán.',
  'Cùng Lead với tuyến Pha chế trên sơ đồ hiện hành.',
  true, ['chưa thiết lập','Nhân viên Bếp Bánh','chưa thiết lập','chưa thiết lập','chưa thiết lập'],
  ['Trưởng ca','Lead Pha chế - Bếp Bánh','Cửa hàng trưởng','chưa thiết lập']),

'Sản xuất': _khungRong(
  'chuyên môn',
  'Các vị trí làm ra sản phẩm của Công ty: tinh dầu, xà phòng, nến thơm, xịt thơm phòng, nước hoa và tinh dầu bi lăn.',
  'Đây là nơi tập trung phần lớn nhân sự người điếc/ khiếm thính, nên lưới của tuyến này cần soạn cùng Điều phối viên Hòa nhập.',
  false, ['chưa thiết lập','Nhân viên Sản xuất','chưa thiết lập','chưa thiết lập','chưa thiết lập'],
  ['chưa thiết lập','Lead Sản xuất','Quản lý Sản xuất','chưa thiết lập']),

'Kho và Đóng gói': _khungRong(
  'chuyên môn',
  'Các vị trí nhận hàng, lưu kho, soạn đơn, đóng gói và giao vận.',
  'Thuộc Khối Chuỗi cung ứng.',
  false, ['chưa thiết lập','Nhân viên Kho, Nhân viên Đóng gói','chưa thiết lập','chưa thiết lập','chưa thiết lập'],
  ['chưa thiết lập','Lead Mua hàng và Kho, Lead Đóng gói','Quản lý Chuỗi cung ứng','chưa thiết lập']),

'Nhân sự - Hành chính - Pháp chế': _khungRong(
  'chuyên môn',
  'Các vị trí lo phần con người, phần hành chính và phần pháp chế: tuyển, xếp bậc, đánh giá, điều chuyển, đào tạo văn hóa và đào tạo kỹ năng chung, cơ sở vật chất, văn bản nội bộ, hồ sơ pháp nhân, hợp đồng và tuân thủ.',
  'Chức năng này gánh BA mảng, khi soạn lưới phải tách ba nhóm tiêu chí.',
  false, null, ['chưa thiết lập','chưa thiết lập','chưa thiết lập','Trưởng phòng Nhân sự - Hành chính - Pháp chế']),

'E-Commerce': _khungRong(
  'chuyên môn',
  'Các vị trí vận hành gian hàng của Công ty trên các sàn thương mại điện tử.',
  '⚠️ Chồng lấn phạm vi với tuyến Thương mại & Dịch vụ, vì bán trên sàn cũng là bán cho người tiêu dùng cuối. Cần chốt ranh trước khi soạn lưới.',
  false, null, ['chưa thiết lập','chưa thiết lập','Quản lý E-Commerce','chưa thiết lập'])

};

/** Sinh một tuyến khung rỗng: có đủ khung bậc và ranh giới chung, chưa có lưới. */
function _khungRong(ngach, moTa, vidu, coDiemBan, cdCM, cdQL) {
  const mau = BAC_CHUYEN_MON;  // ✅ 24/8/2026: chỉ còn một mẫu, ngạch tay nghề đã bỏ
  return {
    trangThai: 'khung rỗng',
    ngach: [ngach, 'quản lý'],
    moTa: moTa,
    vidu: vidu,
    coDiemBan: !!coDiemBan,
    ranhGioi: [],
    bacCM: _bac(mau, cdCM),
    chuoi: [],
    rieng: [],
    bacQL: _bac(BAC_QUAN_LY, cdQL),
    quanLy: []
  };
}
