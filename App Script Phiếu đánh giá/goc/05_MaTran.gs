/**
 * MODULE 05: Lưới phân bậc của từng tuyến. MỖI TUYẾN MỘT SHEET.
 *
 * ⚠️ Từ 31/8/2026 các cột của lưới ghi thẳng TÊN CẤP, không ghi số bậc nữa.
 * Chữ BẬC trong hệ nay chỉ còn một nghĩa là BẬC CÁCH LÀM VIỆC 1 tới 5. Tên
 * "lưới phân bậc" giữ nguyên vì nó là tên của chính bản lưới, được nhắc tới ở
 * JD mục 7, ở cap-bac.csv và ở mục 4 CLAUDE.md.
 * Mỗi sheet tự chứa đủ phần GIẢI THÍCH cách đọc, nên người mở ra không phải
 * tra thêm tài liệu nào khác. Sheet này được chép nguyên sang file phiếu khi xuất.
 */

function buildMaTran(tenTuyen) {
  const T = TUYEN[tenTuyen];
  const sh = _tao(CFG.MT_PREFIX + tenTuyen);
  const C = 7;
  _banner(sh, '📐 MA TRẬN CẤP BẬC · TUYẾN ' + tenTuyen.toUpperCase(),
    T.trangThai === 'đủ' ? 'Bản đầy đủ, dùng để chấm.' : 'KHUNG RỖNG, phần lưới chờ soạn nội dung.', C);
  let r = 2;

  /* ---------- Phạm vi tuyến ---------- */
  r = _muc(sh, r, 'TUYẾN NÀY GỒM AI', C);
  sh.getRange(r,2).setValue(T.moTa).setWrap(true); sh.setRowHeight(r,38); r++;
  sh.getRange(r,2).setValue(T.vidu).setWrap(true).setFontColor(CFG.MAU.CHU_GHI).setFontSize(9);
  sh.setRowHeight(r,34); r += 2;

  /* ---------- GIẢI THÍCH, luôn có, không phụ thuộc trạng thái ---------- */
  r = _muc(sh, r, 'CÁCH ĐỌC MA TRẬN NÀY', C);
  const GT = [
   ['Ma trận này trả lời câu gì',
    'Bản mô tả công việc trả lời vị trí này LÀM GÌ. Ma trận trả lời cùng một đầu việc thì BẬC NÀY KHÁC BẬC KIA Ở CHỖ NÀO.'],
   ['Phân bậc căn cứ vào cái gì',
    'Căn cứ vào QUYỀN TỰ QUYẾT và PHẠM VI ẢNH HƯỞNG: nội dung nào nhân sự tự quyết mà không cần trình phê duyệt, và cách làm của nhân sự tác động tới bao nhiêu người. KHÔNG căn cứ vào độ khó của công việc, vì độ khó là cảm nhận chủ quan, hai người chấm sẽ ra hai kết quả.'],
   ['Mỗi ô là gì',
    'Mỗi ô là MỘT câu hỏi có đúng hai câu trả lời: đạt hoặc chưa đạt. Không chấm mỗi ô theo thang điểm. Nhiều lần không làm được, hoặc làm sai, thì ô đó là chưa đạt.'],
   ['Các ô có cộng lại không',
    'KHÔNG. Mỗi tiêu chí là một loại quyền khác nhau, giỏi ở tiêu chí này không bù được cho việc chưa đủ ở tiêu chí kia. Nên đối chiếu từng tiêu chí, không cộng và không bù trừ.'],
   ['Cấp của một người xác định thế nào',
    T.chuoi.length
      ? 'Tuyến này có THANG CỘNG DỒN. Cấp theo thang là bước cuối cùng mà mọi bước từ đầu tới đó đều Đạt. Không nhảy cóc: chưa làm được bước trước thì không tính bước sau, dù bước sau có làm được. Sau đó cấp bị KÉO XUỐNG nếu một tiêu chí độc lập tụt quá mức cho phép, mức đó nằm ở sheet Tham số.'
      : 'Tuyến này KHÔNG có thang cộng dồn, nên dùng quy tắc đa số: người đó ở một cấp khi đạt cấp đó ở đa số tiêu chí trong phạm vi, VÀ không tiêu chí nào tụt quá mức cho phép. Hai con số này nằm ở sheet Tham số.'],
   ['Điều kiện lên cấp là gì',
    'Là chất lượng của ĐỀ XUẤT và QUYẾT ĐỊNH ở cấp hiện tại, đủ để tin rằng bỏ lớp duyệt đi thì vẫn đúng. KHÔNG lấy việc "đã tự quyết việc X" làm điều kiện, vì ở cấp dưới nhân sự chưa bao giờ được phép làm X, viết vậy thì không ai lên cấp được.'],
   ['Ô ghi "Duy trì" nghĩa là gì',
    'Cấp trên không đòi thêm nội dung mới ở tiêu chí đó, chỉ đòi giữ được mức đã đạt. Ô ghi "Chưa yêu cầu" nghĩa là cấp đó chưa đòi tiêu chí này.'],
   ['Cấp chưa thiết lập nghĩa là gì',
    'Công ty đã nhìn thấy nhu cầu nhưng chưa tách thành vị trí riêng ở thời điểm này. Đường phát triển KHÔNG bị chặn: khi có nhân sự đạt chuẩn thì thiết lập cấp đó.'],
   ['Hai ngạch có ngang nhau không',
    'Có. Lead bộ phận ngang Chuyên viên, Quản lý khối ngang Chuyên gia: ngang quyền và ngang tiền. Đi ngang giữa hai ngạch là chuyển nghề, không phải lên hay xuống. Trần ngạch chuyên môn dừng ở Chuyên gia, riêng ngạch quản lý đi tiếp tới Trưởng phòng. ✅ 24/8/2026: ngạch tay nghề đã bỏ, gộp vào ngạch chuyên môn; ngạch chuyên môn nay áp cho MỌI tuyến, gồm cả sản xuất và pha chế.'],
   ['Ma trận này sinh ra tiền không',
    'Không. Nó sinh ra CẤP. Ban lãnh đạo nhìn hai thang chuyên môn và quản lý để quyết bổ nhiệm chức danh; chức danh nào ứng với số tiền nào do quy chế lương quy định. Cùng một cấp ở hai chức danh khác nhau ra hai mức tiền khác nhau.'],
   ['Phần nào gắn với hợp đồng lao động',
    'Bản mô tả công việc cùng CỘT CẤP ĐANG GIỮ. Các cột cấp khác là thông tin về lộ trình phát triển, không phải phạm vi công việc được giao.']
  ];
  _header(sh, r, ['','Câu hỏi','Trả lời','','','','']);
  r++;
  const gtDau = r;
  GT.forEach(function (g) {
    sh.getRange(r,2).setValue(g[0]).setFontWeight('bold').setWrap(true).setBackground(CFG.MAU.NHAT);
    sh.getRange(r,3,1,5).merge().setValue(g[1]).setWrap(true).setVerticalAlignment('top');
    r++;
  });
  _khung(sh, gtDau-1, GT.length, C);
  r += 2;

  /* ---------- Ranh giới riêng của tuyến ---------- */
  r = _muc(sh, r, 'A. RANH GIỚI KHÔNG THỎA HIỆP, RIÊNG TUYẾN NÀY. Không phân bậc, không tính điểm. Vi phạm thì chặn mọi kết quả', C);
  if (!T.ranhGioi.length) {
    r = _choSoan(sh, r, 'Chưa soạn ranh giới riêng cho tuyến này. Phần ranh giới chung toàn Công ty vẫn áp dụng, xem sheet ' + CFG.SHEETS.CHUNG + '.', C);
  } else {
    T.ranhGioi.forEach(function (nh) {
      sh.getRange(r,1).setValue('▸').setHorizontalAlignment('center').setFontColor(CFG.MAU.DAM);
      sh.getRange(r,2).setValue(nh[0]).setFontWeight('bold').setFontColor(CFG.MAU.DAM);
      r++;
      nh[1].forEach(function (g,i) {
        sh.getRange(r,1).setValue(i+1).setHorizontalAlignment('center');
        sh.getRange(r,2,1,6).merge().setValue(g).setWrap(true);
        r++;
      });
    });
    r = _note(sh, r,
      'Nhóm ranh giới đặt tên theo CHỦ ĐỀ, phát sinh nội dung cùng chủ đề thì thêm một dòng vào đúng nhóm, không phải sửa cấu trúc phiếu. ' +
      'Việc áp dụng đúng giá và chương trình khuyến mãi nằm ở đây chứ không nằm trong lưới, vì nó chỉ có làm được hoặc không, không có nhiều mức. ' +
      'Ngược lại, một nghĩa vụ có nhiều mức làm được thì thuộc lưới chứ không thuộc đây: an toàn sản phẩm đã chuyển sang tiêu chí C6 ngày 11/8/2026 vì lý do đó.', C, 34);
  }
  r += 2;

  /* ---------- Bộ câu hỏi chấm, bản đầy đủ ---------- */
  /* ✅ CHỐT 5/8/2026 (Sen). Sheet này phải hiện ĐỦ câu hỏi của tuyến, để xem
   * được toàn bộ nội dung chấm mà không phải xuất phiếu thử. Cùng nguồn với
   * phiếu, đều gọi _cauHoiChung và _cauHoiTuyen ở 13_BoCauHoi.gs. */
  const boCH = _cauHoiTuyen(tenTuyen);
  const chungCH = _cauHoiChung(T);
  r = _muc(sh, r, 'B. BỘ CÂU HỎI CHẤM. Đây là toàn bộ nội dung sẽ hiện trên phiếu của tuyến này. Mỗi câu chấm theo thang 0 tới 5, theo ĐÚNG MỘT logic đo ghi ở dòng tên nhóm', C);

  sh.getRange(r,2).setValue('B.1. Phần chung, áp dụng cho mọi tuyến. ' +
    chungCH.length + ' nhóm, ' + _demCau(chungCH) + ' câu')
    .setFontWeight('bold').setFontColor(CFG.MAU.DAM);
  r++;
  r = _bangCauHoi(sh, r, chungCH);
  r++;

  if (boCH && boCH.chuyenMon.length) {
    sh.getRange(r,2).setValue('B.2. Ngạch ' + T.ngach[0] + '. ' +
      boCH.chuyenMon.length + ' nhóm, ' + _demCau(boCH.chuyenMon) + ' câu')
      .setFontWeight('bold').setFontColor(CFG.MAU.DAM);
    r++;
    r = _bangCauHoi(sh, r, boCH.chuyenMon);
    r++;
  }

  if (boCH && boCH.quanLy.length) {
    sh.getRange(r,2).setValue('B.3. Ngạch quản lý. ' +
      boCH.quanLy.length + ' nhóm, ' + _demCau(boCH.quanLy) + ' câu')
      .setFontWeight('bold').setFontColor(CFG.MAU.DAM);
    r++;
    r = _bangCauHoi(sh, r, boCH.quanLy);
    r++;
  }

  if (!boCH) {
    r = _choSoan(sh, r,
      'Tuyến này chưa soạn bộ câu hỏi riêng. Phần chung ở trên vẫn chấm bình thường.\n' +
      'Bộ câu hỏi soạn ở file .md trong 3-Luong/Phuong-an/ rồi chạy sinh_bo_cau_hoi_gs.py.', C);
  }
  r++;

  /* ---------- Ngạch chuyên môn ---------- */
  const tenNgach = T.ngach[0].toUpperCase();
  r = _muc(sh, r, 'C. LƯỚI PHÂN BẬC, NGẠCH ' + tenNgach + '. Từ ' + _tenCapHien(T.bacCM[0][1]) + ' tới ' + _tenCapHien(T.bacCM[T.bacCM.length-1][1]), C);

  if (T.chuoi.length) {
    sh.getRange(r,2).setValue('C.1. Thang cộng dồn. Bước thứ n CHÍNH LÀ nội dung của cấp thứ n')
      .setFontWeight('bold').setFontColor(CFG.MAU.DAM);
    r++;
    _header(sh, r, ['Cấp','Tên tiếng Anh','Chức danh thực tế','Mã','Phải làm được gì ở cấp này','','Cách kiểm']);
    r++;
    const d0 = r;
    T.chuoi.forEach(function (c, i) {
      const b = T.bacCM[i];
      sh.getRange(r,1).setValue(_tenCapHien(b[1])).setFontWeight('bold').setFontSize(12)
        .setWrap(true).setHorizontalAlignment('center').setBackground(CFG.MAU.NHAT);
      sh.getRange(r,2).setValue(b[2]).setWrap(true).setBackground(CFG.MAU.NHAT);
      sh.getRange(r,3).setValue(b[3]).setWrap(true).setFontSize(9).setBackground(CFG.MAU.NHAT);
      sh.getRange(r,4).setValue(c[0]).setFontWeight('bold').setHorizontalAlignment('center');
      sh.getRange(r,5,1,2).merge().setValue(c[1] + '\n\n' + c[2]).setWrap(true).setFontSize(9)
        .setVerticalAlignment('top');
      sh.getRange(r,7).setValue(c[3] || '').setWrap(true).setFontSize(9)
        .setVerticalAlignment('top').setFontColor(CFG.MAU.CHU_GHI);
      sh.setRowHeight(r, 168);
      r++;
    });
    _khung(sh, d0-1, T.chuoi.length, C);
    r++;
    r = _note(sh, r,
      'Đọc theo chiều dọc. Muốn ở một cấp thì phải Đạt cả ' +
      T.chuoi.slice(0,3).map(function(c){return c[0];}).join(', ') +
      '. Làm được bước sau mà chưa làm được bước trước thì cấp vẫn dừng ở bước trước, vì các bước là một trình tự nghề chứ không phải một danh sách rời.', C, 34);
    r++;
  }

  if (T.rieng.length) {
    sh.getRange(r,2).setValue(T.chuoi.length
      ? 'C.2. Tiêu chí độc lập. Không nằm trong trình tự bán hàng nên chấm riêng theo cấp'
      : 'C.1. Tiêu chí phân bậc. Chọn cấp cao nhất đạt được ở từng tiêu chí')
      .setFontWeight('bold').setFontColor(CFG.MAU.DAM);
    r++;
    _header(sh, r, ['Mã','Tiêu chí'].concat(T.bacCM.map(function (b) {
      return _tenCapHien(b[1]) + '\n' + (b[3] || ''); })));
    sh.setRowHeight(r, 54);
    r++;
    const d1 = r;
    T.rieng.forEach(function (t) {
      sh.getRange(r,1).setValue(t[0]).setFontWeight('bold').setBackground(CFG.MAU.NHAT);
      sh.getRange(r,2).setValue(t[1]).setWrap(true).setBackground(CFG.MAU.NHAT);
      for (let i = 0; i < T.bacCM.length; i++)
        sh.getRange(r, 3+i).setValue(t[2][i] || 'Duy trì.').setWrap(true).setFontSize(9);
      r++;
    });
    _khung(sh, d1-1, T.rieng.length, 2 + T.bacCM.length);
    r += 2;
  }

  if (!T.chuoi.length && !T.rieng.length) {
    r = _choSoan(sh, r,
      'Chưa soạn lưới phân bậc cho ngạch ' + T.ngach[0] + ' của tuyến này.\n' +
      'Khung cấp đã có sẵn ở bảng dưới. Nội dung từng ô soạn trong 03_DuLieuTuyen rồi chạy Cập nhật phiên bản.', C);
    _header(sh, r, ['Cấp','Tên tiếng Anh','Chức danh thực tế','','','','']);
    r++;
    const d2 = r;
    T.bacCM.forEach(function (b) {
      sh.getRange(r,1).setValue(_tenCapHien(b[1])).setFontWeight('bold');
      sh.getRange(r,2).setValue(b[2]);
      sh.getRange(r,3).setValue(b[3]).setFontSize(9).setFontColor(CFG.MAU.CHU_GHI);
      r++;
    });
    _khung(sh, d2-1, T.bacCM.length, 3);
    r += 2;
  }

  /* ---------- Ngạch quản lý ---------- */
  r = _muc(sh, r, 'D. LƯỚI PHÂN BẬC, NGẠCH QUẢN LÝ. Từ ' + _tenCapHien(T.bacQL[0][1]) + ' tới ' + _tenCapHien(T.bacQL[T.bacQL.length-1][1]), C);
  if (!T.quanLy.length) {
    r = _choSoan(sh, r,
      'Chưa soạn lưới phân bậc cho ngạch quản lý của tuyến này. Khung cấp và chức danh thực tế đã có ở bảng dưới.', C);
    _header(sh, r, ['Cấp','Tên tiếng Anh','Chức danh thực tế','','','','']);
    r++;
    const d3 = r;
    T.bacQL.forEach(function (b) {
      sh.getRange(r,1).setValue(_tenCapHien(b[1])).setFontWeight('bold');
      sh.getRange(r,2).setValue(b[2]);
      sh.getRange(r,3).setValue(b[3]).setFontSize(9).setFontColor(CFG.MAU.CHU_GHI);
      r++;
    });
    _khung(sh, d3-1, T.bacQL.length, 3);
    r += 2;
  } else {
    _header(sh, r, ['Mã','Nhóm tiêu chí'].concat(T.bacQL.map(function (b) {
      return _tenCapHien(b[1]) + '\n' + (b[3] || ''); })));
    sh.setRowHeight(r, 54);
    r++;
    const d4 = r;
    T.quanLy.forEach(function (t) {
      sh.getRange(r,1).setValue(t[0]).setFontWeight('bold').setBackground(CFG.MAU.NHAT)
        .setNote(t[2] ? 'Gộp từ: ' + t[2] : '');
      sh.getRange(r,2).setValue(t[1]).setWrap(true).setBackground(CFG.MAU.NHAT);
      for (let i = 0; i < T.bacQL.length; i++)
        sh.getRange(r, 3+i).setValue(t[3][i] || 'Duy trì.').setWrap(true).setFontSize(9);
      r++;
    });
    _khung(sh, d4-1, T.quanLy.length, 2 + T.bacQL.length);
    r++;
    r = _note(sh, r,
      'Mười hai tiêu chí gốc của ngạch quản lý gom thành các nhóm, chấm ở mức nhóm chứ không chấm từng tiêu chí rời. Rê chuột lên mã nhóm để xem nó gộp từ những gì.', C, 30);
    r += 2;
  }

  /* ---------- Nội dung chờ chốt ---------- */
  r = _muc(sh, r, 'E. NỘI DUNG CHỜ CHỐT CỦA TUYẾN NÀY', C);
  const CC = _choChot(tenTuyen, T);
  _header(sh, r, ['#','Nội dung','Đang chặn việc gì','','','','']);
  r++;
  const d5 = r;
  CC.forEach(function (c,i) {
    sh.getRange(r,1).setValue(i+1).setHorizontalAlignment('center');
    sh.getRange(r,2).setValue(c[0]).setWrap(true).setFontWeight('bold');
    sh.getRange(r,3,1,5).merge().setValue(c[1]).setWrap(true).setFontSize(9);
    r++;
  });
  _khung(sh, d5-1, CC.length, C);

  const rong = [70,260,230,250,250,250,250];
  for (let c = 1; c <= C; c++) sh.setColumnWidth(c, rong[c-1]);
  sh.getRange(1,1,r,C).setVerticalAlignment('top');
  sh.setFrozenRows(1);
}

/** Dòng thông báo phần chưa soạn. */
function _choSoan(sh, r, chu, soCot) {
  sh.getRange(r,1,1,soCot).setBackground(CFG.MAU.CHO);
  sh.getRange(r,2).setValue('⬜ ' + chu).setWrap(true).setFontColor('#b06000');
  sh.setRowHeight(r, 44);
  return r + 2;
}

/** Danh sách chờ chốt, phần chung cộng phần riêng của tuyến. */
function _choChot(ten, T) {
  const cc = [
   ['Ngưỡng đa số tiêu chí và mức tụt tối đa cho phép',
    'Hai con số này quyết định một người ở cấp nào. Đang đặt tạm ở sheet ' + CFG.SHEETS.TS + ', chưa được chốt nên chưa xếp cấp chính thức được.'],
   ['Thời gian tối thiểu ở mỗi cấp, và thời hạn của quyết định bổ nhiệm',
    'Chưa có số. Đây là điều kiện thứ hai của cơ chế lên cấp, cạnh điều kiện về nội dung.'],
   ['Chức danh nào ứng với số tiền nào ở từng cấp',
    'Lưới này sinh ra CẤP, không sinh ra tiền. Quy chế lương chưa ban hành.']
  ];
  if (T.trangThai !== 'đủ') {
    cc.unshift(['Toàn bộ nội dung lưới của tuyến này',
      'Tuyến đang ở trạng thái khung rỗng. Phần khung chung và ranh giới chung vẫn chấm được, riêng lưới phân bậc chưa soạn.']);
  }
  if (ten === 'Thương mại & Dịch vụ') {
    cc.push(['Vị trí Cửa hàng trưởng thuộc tuyến nào',
      'Vị trí này phụ trách cả Pha chế, Bếp bánh, Bảo vệ và Tạp vụ, không thuần tuyến Thương mại & Dịch vụ. Hiện chấm bằng ma trận tuyến này kèm nhóm QE bổ sung. Chưa quyết có lập một ma trận riêng cho vai trò phụ trách điểm bán hay không.']);
    cc.push(['Khung lợi nhuận và hạn mức ngân sách của từng cấp quản lý',
      'Ô Quản lý khối và Trưởng phòng của nhóm QC chưa xác định được ranh giữa trong khung và ngoài khung.']);
  }
  if (ten === 'E-Commerce') {
    cc.push(['Ranh giới với tuyến Thương mại & Dịch vụ',
      'Bán trên sàn cũng là bán cho người tiêu dùng cuối nên hai tuyến chồng lấn. Chưa chốt thì chưa soạn lưới được.']);
  }
  // ✅ 24/8/2026: trước đây lưu ý này neo vào ngạch tay nghề. Ngạch đó đã bỏ, nên
  // neo lại vào DANH SÁCH TUYẾN. Nếu không neo lại thì việc gộp ngạch làm mất luôn
  // lớp bảo vệ này, mà lý do gốc dựng ngạch thứ ba chính là chỗ đó.
  if (TUYEN_NGHE_THU_CONG.indexOf(ten) > -1) {
    cc.push(['Cách soạn lưới cho nhân sự người điếc/ khiếm thính',
      'Các tuyến nghề thủ công tập trung phần lớn nhân sự người điếc/ khiếm thính. Lưới và cách trình bày cần soạn cùng Điều phối viên Hòa nhập, và cần bản thị giác song song với bản chữ.']);
  }
  return cc;
}
