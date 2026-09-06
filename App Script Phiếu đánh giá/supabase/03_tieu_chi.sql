-- ═══════════════════════════════════════════════════════════════════
--  03 · BỘ CÂU HỎI
--
--  360 câu, sinh từ dữ liệu app đang chạy.
--  Chạy sau 01_luoc_do.sql. Chạy lại được, câu nào có rồi thì ghi đè.
--
--  Về sau khi Sen sửa bộ câu trên sheet 📚 Bộ câu hỏi thì chạy mục menu
--  'Đẩy bộ câu hỏi sang Supabase' trong Sheet, không phải chạy lại tệp này.
-- ═══════════════════════════════════════════════════════════════════
begin;
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH1_1', 'VH1.1', 'VH1', 'ONE VOICE, MỘT TIẾNG NÓI THỐNG NHẤT', 'vi_pham', 'Nhân sự có phát ngôn cá nhân trái định hướng chung của Công ty', 'Nhân sự có phát ngôn cá nhân trái định hướng chung của Công ty',
  'all', null, null, 1, null, 0, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH1_2', 'VH1.2', 'VH1', 'ONE VOICE, MỘT TIẾNG NÓI THỐNG NHẤT', 'vi_pham', 'Nhân sự truyền đạt thông tin chưa được xác nhận', 'Nhân sự truyền đạt thông tin chưa được xác nhận',
  'all', null, null, 1, null, 1, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH1_3', 'VH1.3', 'VH1', 'ONE VOICE, MỘT TIẾNG NÓI THỐNG NHẤT', 'vi_pham', 'Nhân sự dùng sai hoặc bỏ qua kịch bản và quy chuẩn giao tiếp đã ban hành, cả với khách và trong nội bộ', 'Nhân sự dùng sai hoặc bỏ qua kịch bản và quy chuẩn giao tiếp đã ban hành, cả với khách và trong nội bộ',
  'all', null, null, 1, null, 2, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH1_4', 'VH1.4', 'VH1', 'ONE VOICE, MỘT TIẾNG NÓI THỐNG NHẤT', 'vi_pham', 'Nhân sự tự ý trả lời khách hoặc đồng nghiệp thông tin chưa chắc chắn thay vì xác nhận lại với người có thẩm quyền', 'Nhân sự tự ý trả lời khách hoặc đồng nghiệp thông tin chưa chắc chắn thay vì xác nhận lại với người có thẩm quyền',
  'all', null, null, 1, null, 3, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH1_5', 'VH1.5', 'VH1', 'ONE VOICE, MỘT TIẾNG NÓI THỐNG NHẤT', 'vi_pham', 'Nhân sự truyền đạt chính sách hoặc quyết định sai lệch, thiếu sót nội dung so với văn bản gốc đã ban hành', 'Nhân sự truyền đạt chính sách hoặc quyết định sai lệch, thiếu sót nội dung so với văn bản gốc đã ban hành',
  'all', null, null, 1, null, 4, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH2_1', 'VH2.1', 'VH2', 'OUTCOME, KẾT QUẢ CẦN ĐẠT THEO TIÊU CHÍ SMART', 'vi_pham', 'Nhân sự nhận việc mà không nêu được kết quả cần đạt, chỉ mô tả các hoạt động sẽ làm', 'Nhân sự nhận việc mà không nêu được kết quả cần đạt, chỉ mô tả các hoạt động sẽ làm',
  'all', null, null, 1, null, 5, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH2_2', 'VH2.2', 'VH2', 'OUTCOME, KẾT QUẢ CẦN ĐẠT THEO TIÊU CHÍ SMART', 'vi_pham', 'Kết quả cần đạt do nhân sự nêu không đo được bằng số hoặc bằng dữ kiện kiểm chứng được', 'Kết quả cần đạt do nhân sự nêu không đo được bằng số hoặc bằng dữ kiện kiểm chứng được',
  'all', null, null, 1, null, 6, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH2_3', 'VH2.3', 'VH2', 'OUTCOME, KẾT QUẢ CẦN ĐẠT THEO TIÊU CHÍ SMART', 'vi_pham', 'Kết quả cần đạt do nhân sự nêu không khả thi với nguồn lực và thời gian đang có', 'Kết quả cần đạt do nhân sự nêu không khả thi với nguồn lực và thời gian đang có',
  'all', null, null, 1, null, 7, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH2_4', 'VH2.4', 'VH2', 'OUTCOME, KẾT QUẢ CẦN ĐẠT THEO TIÊU CHÍ SMART', 'vi_pham', 'Kết quả cần đạt do nhân sự nêu không phục vụ đúng mục tiêu của bộ phận', 'Kết quả cần đạt do nhân sự nêu không phục vụ đúng mục tiêu của bộ phận',
  'all', null, null, 1, null, 8, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH2_5', 'VH2.5', 'VH2', 'OUTCOME, KẾT QUẢ CẦN ĐẠT THEO TIÊU CHÍ SMART', 'vi_pham', 'Kết quả cần đạt do nhân sự nêu không có thời hạn rõ ràng', 'Kết quả cần đạt do nhân sự nêu không có thời hạn rõ ràng',
  'all', null, null, 1, null, 9, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH2_6', 'VH2.6', 'VH2', 'OUTCOME, KẾT QUẢ CẦN ĐẠT THEO TIÊU CHÍ SMART', 'vi_pham', 'Nhân sự không chủ động báo cáo nghiệm thu kết quả công việc bằng số liệu hoặc dữ kiện thực tế khi đến hạn', 'Nhân sự không chủ động báo cáo nghiệm thu kết quả công việc bằng số liệu hoặc dữ kiện thực tế khi đến hạn',
  'all', null, null, 1, null, 10, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_vh2_7', 'VH2.7', 'VH2', 'OUTCOME, KẾT QUẢ CẦN ĐẠT THEO TIÊU CHÍ SMART', 'vi_pham', 'Nhân sự không chủ động báo cáo nghiệm thu kết quả công việc bằng số liệu hoặc dữ kiện thực tế khi đến hạn', 'Kết quả cần đạt nhân sự giao cho nhóm bị hiểu theo nhiều cách, tới lúc nghiệm thu mới phát sinh tranh cãi',
  'mgmt', null, null, 1, null, 11, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH3_1', 'VH3.1', 'VH3', 'PURPOSE, MỤC ĐÍCH VÀ VÌ SAO LÀM', 'vi_pham', 'Nhân sự không nhắc lại được vì sao việc mình nhận cần làm', 'Nhân sự không nhắc lại được vì sao việc mình nhận cần làm',
  'all', null, null, 1, null, 12, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH3_2', 'VH3.2', 'VH3', 'PURPOSE, MỤC ĐÍCH VÀ VÌ SAO LÀM', 'vi_pham', 'Nhân sự thực hiện công việc sai lệch so với mục tiêu chung của bộ phận hoặc kế hoạch ca đã giao', 'Nhân sự thực hiện công việc sai lệch so với mục tiêu chung của bộ phận hoặc kế hoạch ca đã giao',
  'all', null, null, 1, null, 13, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH3_3', 'VH3.3', 'VH3', 'PURPOSE, MỤC ĐÍCH VÀ VÌ SAO LÀM', 'vi_pham', 'Cách làm hiện tại không còn phục vụ đúng mục đích mà nhân sự không nêu lại với người phụ trách', 'Cách làm hiện tại không còn phục vụ đúng mục đích mà nhân sự không nêu lại với người phụ trách',
  'all', null, null, 1, null, 14, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH3_4', 'VH3.4', 'VH3', 'PURPOSE, MỤC ĐÍCH VÀ VÌ SAO LÀM', 'vi_pham', 'Nhân sự giao việc cho người khác mà chỉ nêu đầu việc, không nêu mục đích', 'Nhân sự giao việc cho người khác mà chỉ nêu đầu việc, không nêu mục đích',
  'mgmt', null, null, 1, null, 15, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH3_5', 'VH3.5', 'VH3', 'PURPOSE, MỤC ĐÍCH VÀ VÌ SAO LÀM', 'vi_pham', 'Nhân sự tự ý thay đổi cách làm hoặc cắt giảm công đoạn, gây ảnh hưởng xấu đến trải nghiệm của khách hoặc chất lượng chung', 'Nhân sự tự ý thay đổi cách làm hoặc cắt giảm công đoạn, gây ảnh hưởng xấu đến trải nghiệm của khách hoặc chất lượng chung',
  'all', null, null, 1, null, 16, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_vh3_6', 'VH3.6', 'VH3', 'PURPOSE, MỤC ĐÍCH VÀ VÌ SAO LÀM', 'vi_pham', 'Nhân sự tự ý thay đổi cách làm hoặc cắt giảm công đoạn, gây ảnh hưởng xấu đến trải nghiệm của khách hoặc chất lượng chung', 'Nhân sự truyền đạt một chủ trương chung mà không diễn giải thành lý do cụ thể cho bộ phận mình phụ trách',
  'mgmt', null, null, 1, null, 17, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH4_1', 'VH4.1', 'VH4', 'ACTION PLAN, KẾ HOẠCH HÀNH ĐỘNG', 'vi_pham', 'Nhân sự bắt tay vào việc mà chưa nêu được các bước sẽ làm', 'Nhân sự bắt tay vào việc mà chưa nêu được các bước sẽ làm',
  'all', null, null, 1, null, 18, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH4_2', 'VH4.2', 'VH4', 'ACTION PLAN, KẾ HOẠCH HÀNH ĐỘNG', 'vi_pham', 'Kế hoạch của nhân sự là một danh sách rời, không có thời gian và thứ tự', 'Kế hoạch của nhân sự là một danh sách rời, không có thời gian và thứ tự',
  'all', null, null, 1, null, 19, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH4_3', 'VH4.3', 'VH4', 'ACTION PLAN, KẾ HOẠCH HÀNH ĐỘNG', 'vi_pham', 'Nhân sự báo cáo bằng cách kể lại việc đã làm, không báo theo kế hoạch đã nêu', 'Nhân sự báo cáo bằng cách kể lại việc đã làm, không báo theo kế hoạch đã nêu',
  'all', null, null, 1, null, 20, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH4_4', 'VH4.4', 'VH4', 'ACTION PLAN, KẾ HOẠCH HÀNH ĐỘNG', 'vi_pham', 'Kế hoạch của nhân sự bỏ qua các rủi ro đã được cảnh báo trước, hoặc không có phương án xử lý khi phát sinh sự cố đã lường trước', 'Kế hoạch của nhân sự bỏ qua các rủi ro đã được cảnh báo trước, hoặc không có phương án xử lý khi phát sinh sự cố đã lường trước',
  'all', null, null, 1, null, 21, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH4_5', 'VH4.5', 'VH4', 'ACTION PLAN, KẾ HOẠCH HÀNH ĐỘNG', 'vi_pham', 'Kế hoạch nhân sự giao cho người khác thiếu thời gian, người phụ trách, nguồn lực hoặc mốc đánh giá', 'Kế hoạch nhân sự giao cho người khác thiếu thời gian, người phụ trách, nguồn lực hoặc mốc đánh giá',
  'mgmt', null, null, 1, null, 22, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH5_1', 'VH5.1', 'VH5', 'TIME MANAGEMENT, QUẢN LÝ THỜI GIAN', 'vi_pham', 'Nhân sự tập trung làm các công việc không quan trọng, bỏ quên công việc quan trọng hoặc khẩn cấp được giao trong ca', 'Nhân sự tập trung làm các công việc không quan trọng, bỏ quên công việc quan trọng hoặc khẩn cấp được giao trong ca',
  'all', null, null, 1, null, 23, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH5_2', 'VH5.2', 'VH5', 'TIME MANAGEMENT, QUẢN LÝ THỜI GIAN', 'vi_pham', 'Khi có nhiều việc cùng lúc, nhân sự không làm việc quan trọng và khẩn cấp trước', 'Khi có nhiều việc cùng lúc, nhân sự không làm việc quan trọng và khẩn cấp trước',
  'all', null, null, 1, null, 24, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH5_3', 'VH5.3', 'VH5', 'TIME MANAGEMENT, QUẢN LÝ THỜI GIAN', 'vi_pham', 'Nhân sự hoàn thành công việc trễ hạn', 'Nhân sự hoàn thành công việc trễ hạn',
  'all', null, null, 1, null, 25, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH5_4', 'VH5.4', 'VH5', 'TIME MANAGEMENT, QUẢN LÝ THỜI GIAN', 'vi_pham', 'Nhân sự không dành được thời gian cho việc quan trọng nhưng chưa khẩn cấp', 'Nhân sự không dành được thời gian cho việc quan trọng nhưng chưa khẩn cấp',
  'all', null, null, 1, null, 26, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH5_5', 'VH5.5', 'VH5', 'TIME MANAGEMENT, QUẢN LÝ THỜI GIAN', 'vi_pham', 'Nhân sự để việc quan trọng chưa khẩn cấp trở thành việc khẩn cấp', 'Nhân sự để việc quan trọng chưa khẩn cấp trở thành việc khẩn cấp',
  'all', null, null, 1, null, 27, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH5_6', 'VH5.6', 'VH5', 'TIME MANAGEMENT, QUẢN LÝ THỜI GIAN', 'vi_pham', 'Cách sắp xếp công việc của nhân sự làm người khác phải xử lý gấp. Không tính việc gấp phát sinh từ nguyên nhân khách quan hoặc thuộc trách nhiệm chung của bộ phận', 'Cách sắp xếp công việc của nhân sự làm người khác phải xử lý gấp. Không tính việc gấp phát sinh từ nguyên nhân khách quan hoặc thuộc trách nhiệm chung của bộ phận',
  'all', null, null, 1, null, 28, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH6_1', 'VH6.1', 'VH6', 'PROACTIVE, TƯ DUY CHỦ ĐỘNG', 'vi_pham', 'Nhân sự chờ có người nhắc mới bắt đầu việc thuộc phạm vi của mình', 'Nhân sự chờ có người nhắc mới bắt đầu việc thuộc phạm vi của mình',
  'all', null, null, 1, null, 29, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH6_2', 'VH6.2', 'VH6', 'PROACTIVE, TƯ DUY CHỦ ĐỘNG', 'vi_pham', 'Nhân sự làm việc đối phó: làm cho xong để báo cáo, chỉ làm khi có người kiểm, hoặc làm đúng chữ được giao mà sai mục đích của việc', 'Nhân sự làm việc đối phó: làm cho xong để báo cáo, chỉ làm khi có người kiểm, hoặc làm đúng chữ được giao mà sai mục đích của việc',
  'all', null, null, 1, null, 30, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH6_3', 'VH6.3', 'VH6', 'PROACTIVE, TƯ DUY CHỦ ĐỘNG', 'vi_pham', 'Nhân sự phát hiện sự cố hoặc vấn đề phát sinh tại điểm bán, tại xưởng nhưng không báo cho người phụ trách và không hỗ trợ xử lý theo quy trình', 'Nhân sự phát hiện sự cố hoặc vấn đề phát sinh tại điểm bán, tại xưởng nhưng không báo cho người phụ trách và không hỗ trợ xử lý theo quy trình',
  'all', null, null, 1, null, 31, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH6_4', 'VH6.4', 'VH6', 'PROACTIVE, TƯ DUY CHỦ ĐỘNG', 'vi_pham', 'Nhân sự dừng ở chỗ đã báo cáo hoặc đã chuyển cho người khác, không theo tiếp tới khi việc có kết quả', 'Nhân sự dừng ở chỗ đã báo cáo hoặc đã chuyển cho người khác, không theo tiếp tới khi việc có kết quả',
  'all', null, null, 1, null, 32, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH6_5', 'VH6.5', 'VH6', 'PROACTIVE, TƯ DUY CHỦ ĐỘNG', 'vi_pham', 'Nhân sự lặp lại cùng một sai sót, sự cố đã xảy ra trước đó mà không chủ động đề xuất phương án khắc phục với quản lý', 'Nhân sự lặp lại cùng một sai sót, sự cố đã xảy ra trước đó mà không chủ động đề xuất phương án khắc phục với quản lý',
  'all', null, null, 1, null, 33, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH7_1', 'VH7.1', 'VH7', 'SOLUTION FOCUS, ĐỊNH HƯỚNG GIẢI PHÁP', 'vi_pham', 'Nhân sự báo vấn đề chậm, hoặc báo không đúng người', 'Nhân sự báo vấn đề chậm, hoặc báo không đúng người',
  'all', null, null, 1, null, 34, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH7_2', 'VH7.2', 'VH7', 'SOLUTION FOCUS, ĐỊNH HƯỚNG GIẢI PHÁP', 'vi_pham', 'Khi nêu vấn đề, nhân sự kể lể tình tiết và cảm xúc thay vì mô tả đúng sự việc', 'Khi nêu vấn đề, nhân sự kể lể tình tiết và cảm xúc thay vì mô tả đúng sự việc',
  'all', null, null, 1, null, 35, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH7_3', 'VH7.3', 'VH7', 'SOLUTION FOCUS, ĐỊNH HƯỚNG GIẢI PHÁP', 'vi_pham', 'Nhân sự nêu vấn đề mà không kèm hướng xử lý nào', 'Nhân sự nêu vấn đề mà không kèm hướng xử lý nào',
  'all', null, null, 1, null, 36, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH7_4', 'VH7.4', 'VH7', 'SOLUTION FOCUS, ĐỊNH HƯỚNG GIẢI PHÁP', 'vi_pham', 'Nhân sự nhiều lần nói lại một vấn đề đã được cấp trên ghi nhận và đã báo thời hạn thực thi giải pháp', 'Nhân sự nhiều lần nói lại một vấn đề đã được cấp trên ghi nhận và đã báo thời hạn thực thi giải pháp',
  'all', null, null, 1, null, 37, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_vh7_5', 'VH7.5', 'VH7', 'SOLUTION FOCUS, ĐỊNH HƯỚNG GIẢI PHÁP', 'vi_pham', 'Nhân sự nhiều lần nói lại một vấn đề đã được cấp trên ghi nhận và đã báo thời hạn thực thi giải pháp', 'Một vấn đề lặp lại nhiều lần mà nhân sự chỉ xử lý phần ngọn, không truy nguyên nhân gốc',
  'all', null, null, 1, null, 38, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH8_1', 'VH8.1', 'VH8', 'SỨ MỆNH', 'vi_pham', 'Khách hỏi về dự án mà nhân sự trả lời sai thông tin, trả lời dài dòng, hoặc kể hoàn cảnh cá nhân của người khác', 'Khách hỏi về dự án mà nhân sự trả lời sai thông tin, trả lời dài dòng, hoặc kể hoàn cảnh cá nhân của người khác',
  'pos', null, null, 1, null, 39, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH8_2', 'VH8.2', 'VH8', 'SỨ MỆNH', 'vi_pham', 'Nhân sự chủ động thuyết giảng về sứ mệnh khi khách không hỏi', 'Nhân sự chủ động thuyết giảng về sứ mệnh khi khách không hỏi',
  'pos', null, null, 1, null, 40, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH8_3', 'VH8.3', 'VH8', 'SỨ MỆNH', 'vi_pham', 'Nhân sự có hành vi, lời nói hoặc hình ảnh làm khách, đối tác hiểu sai rằng Công ty đang dùng người điếc như một yếu tố xin lòng trắc ẩn để bán hàng', 'Nhân sự có hành vi, lời nói hoặc hình ảnh làm khách, đối tác hiểu sai rằng Công ty đang dùng người điếc/ khiếm thính như một yếu tố xin lòng trắc ẩn để bán hàng',
  'all', null, null, 1, null, 41, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH8_4', 'VH8.4', 'VH8', 'SỨ MỆNH', 'vi_pham', 'Nhân sự có hành vi hoặc lời nói phân biệt đối xử, làm hộ, tước đi quyền tự quyết và trách nhiệm công việc của đồng nghiệp người điếc', 'Nhân sự có hành vi hoặc lời nói phân biệt đối xử, làm hộ, tước đi quyền tự quyết và trách nhiệm công việc của đồng nghiệp người điếc/ khiếm thính',
  'all', null, null, 1, null, 42, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH8_5', 'VH8.5', 'VH8', 'SỨ MỆNH', 'vi_pham', 'Nhân sự lấy yếu tố mô hình xã hội hoặc người điếc ra làm lý do biện hộ khi sản phẩm, dịch vụ bị khách phản ánh về chất lượng', 'Nhân sự lấy yếu tố mô hình xã hội hoặc người điếc/ khiếm thính ra làm lý do biện hộ khi sản phẩm, dịch vụ bị khách phản ánh về chất lượng',
  'all', null, null, 1, null, 43, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_vh8_6', 'VH8.6', 'VH8', 'SỨ MỆNH', 'vi_pham', 'Nhân sự lấy yếu tố mô hình xã hội hoặc người điếc ra làm lý do biện hộ khi sản phẩm, dịch vụ bị khách phản ánh về chất lượng', 'Người nói và người điếc/ khiếm thính đang không hiểu nhau ngay trước mặt mà nhân sự không làm cầu nối',
  'all', null, null, 1, null, 44, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_vh8_7', 'VH8.7', 'VH8', 'SỨ MỆNH', 'vi_pham', 'Nhân sự lấy yếu tố mô hình xã hội hoặc người điếc ra làm lý do biện hộ khi sản phẩm, dịch vụ bị khách phản ánh về chất lượng', 'Nhân sự truyền đạt sai giá trị hoặc sứ mệnh của Công ty cho đồng nghiệp',
  'all', null, null, 1, null, 45, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH9_1', 'VH9.1', 'VH9', 'MÙI HƯƠNG, GIÁ TRỊ CỐT LÕI', 'vi_pham', 'Nhân sự giao hàng cho khách mà không xịt hương lên tay cầm túi, kể cả túi giấy nhỏ', 'Nhân sự giao hàng cho khách mà không xịt hương lên tay cầm túi, kể cả túi giấy nhỏ',
  'pos', null, null, 1, null, 46, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH9_2', 'VH9.2', 'VH9', 'MÙI HƯƠNG, GIÁ TRỊ CỐT LÕI', 'vi_pham', 'Nhân sự dùng mùi ngoài quy định chung của hệ thống', 'Nhân sự dùng mùi ngoài quy định chung của hệ thống',
  'pos', null, null, 1, null, 47, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH9_3', 'VH9.3', 'VH9', 'MÙI HƯƠNG, GIÁ TRỊ CỐT LÕI', 'vi_pham', 'Nhân sự vệ sinh không gian bằng thứ khác thay cho bình xịt sả chanh của Nhà', 'Nhân sự vệ sinh không gian bằng thứ khác thay cho bình xịt sả chanh của Nhà',
  'pos', null, null, 1, null, 48, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH9_4', 'VH9.4', 'VH9', 'MÙI HƯƠNG, GIÁ TRỊ CỐT LÕI', 'vi_pham', 'Nhân sự không vận hành bộ khuếch tán tinh dầu sả java trên khu vực và đúng định mức quy định trong ca', 'Nhân sự không vận hành bộ khuếch tán tinh dầu sả java trên khu vực và đúng định mức quy định trong ca',
  'pos', null, null, 1, null, 49, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH9_5', 'VH9.5', 'VH9', 'MÙI HƯƠNG, GIÁ TRỊ CỐT LÕI', 'vi_pham', 'Mùi trong không gian yếu hoặc lẫn mùi lạ mà nhân sự không xử lý, cho tới khi khách hoặc quản lý nhận ra', 'Mùi trong không gian yếu hoặc lẫn mùi lạ mà nhân sự không xử lý, cho tới khi khách hoặc quản lý nhận ra',
  'pos', null, null, 1, null, 50, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH10_1', 'VH10.1', 'VH10', 'ÂM THANH, VĂN HÓA TÔN TRỌNG KHÔNG GIAN', 'vi_pham', 'Trong ca của nhân sự, không gian không có nhạc phát, hoặc nhạc bị tắt giữa ca', 'Trong ca của nhân sự, không gian không có nhạc phát, hoặc nhạc bị tắt giữa ca',
  'pos', null, null, 1, null, 51, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH10_2', 'VH10.2', 'VH10', 'ÂM THANH, VĂN HÓA TÔN TRỌNG KHÔNG GIAN', 'vi_pham', 'Nhân sự để âm lượng lệch mức đã quy định', 'Nhân sự để âm lượng lệch mức đã quy định',
  'pos', null, null, 1, null, 52, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH10_3', 'VH10.3', 'VH10', 'ÂM THANH, VĂN HÓA TÔN TRỌNG KHÔNG GIAN', 'vi_pham', 'Nhân sự tự chỉnh âm lượng theo cảm xúc cá nhân mà không hỏi người phụ trách', 'Nhân sự tự chỉnh âm lượng theo cảm xúc cá nhân mà không hỏi người phụ trách',
  'pos', null, null, 1, null, 53, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH10_4', 'VH10.4', 'VH10', 'ÂM THANH, VĂN HÓA TÔN TRỌNG KHÔNG GIAN', 'vi_pham', 'Khi không gian bị ồn, nhân sự không chủ động dùng biển chỉ dẫn hoặc thẻ gợi ý ngôn ngữ ký hiệu để mời khách điều chỉnh âm lượng', 'Khi không gian bị ồn, nhân sự không chủ động dùng biển chỉ dẫn hoặc thẻ gợi ý ngôn ngữ ký hiệu để mời khách điều chỉnh âm lượng',
  'pos', null, null, 1, null, 54, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH10_5', 'VH10.5', 'VH10', 'ÂM THANH, VĂN HÓA TÔN TRỌNG KHÔNG GIAN', 'vi_pham', 'Nhân sự nhắc khách về độ ồn sai quy chuẩn giao tiếp, hoặc bằng thái độ thiếu khéo léo gây gắt gỏng', 'Nhân sự nhắc khách về độ ồn sai quy chuẩn giao tiếp, hoặc bằng thái độ thiếu khéo léo gây gắt gỏng',
  'pos', null, null, 1, null, 55, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH10_6', 'VH10.6', 'VH10', 'ÂM THANH, VĂN HÓA TÔN TRỌNG KHÔNG GIAN', 'vi_pham', 'Âm lượng hoặc tiếng ồn vượt mức quy định mà nhân sự không xử lý, cho tới khi khách phản ứng hoặc quản lý trực tiếp phải nhắc', 'Âm lượng hoặc tiếng ồn vượt mức quy định mà nhân sự không xử lý, cho tới khi khách phản ứng hoặc quản lý trực tiếp phải nhắc',
  'pos', null, null, 1, null, 56, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH11_1', 'VH11.1', 'VH11', 'CÂY XANH, Ý THỨC GÌN GIỮ GIÁ TRỊ TỰ NHIÊN', 'vi_pham', 'Nhân sự tự ý di chuyển hoặc tác động lên cây', 'Nhân sự tự ý di chuyển hoặc tác động lên cây',
  'pos', null, null, 1, null, 57, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH11_2', 'VH11.2', 'VH11', 'CÂY XANH, Ý THỨC GÌN GIỮ GIÁ TRỊ TỰ NHIÊN', 'vi_pham', 'Nhân sự không chăm sóc và giữ gìn phần cây trong khu vực mình phụ trách', 'Nhân sự không chăm sóc và giữ gìn phần cây trong khu vực mình phụ trách',
  'pos', null, null, 1, null, 58, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH11_3', 'VH11.3', 'VH11', 'CÂY XANH, Ý THỨC GÌN GIỮ GIÁ TRỊ TỰ NHIÊN', 'vi_pham', 'Nhân sự không chủ động nhắc nhở hoặc báo cáo quản lý khi phát hiện cây xanh trong khu vực bị hư hại, bị tác động sai quy định', 'Nhân sự không chủ động nhắc nhở hoặc báo cáo quản lý khi phát hiện cây xanh trong khu vực bị hư hại, bị tác động sai quy định',
  'pos', null, null, 1, null, 59, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH11_4', 'VH11.4', 'VH11', 'CÂY XANH, Ý THỨC GÌN GIỮ GIÁ TRỊ TỰ NHIÊN', 'vi_pham', 'Nhân sự nhắc khách về việc giữ gìn cây xanh bằng thái độ hoặc từ ngữ thiếu chuẩn mực giao tiếp', 'Nhân sự nhắc khách về việc giữ gìn cây xanh bằng thái độ hoặc từ ngữ thiếu chuẩn mực giao tiếp',
  'pos', null, null, 1, null, 60, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH11_5', 'VH11.5', 'VH11', 'CÂY XANH, Ý THỨC GÌN GIỮ GIÁ TRỊ TỰ NHIÊN', 'vi_pham', 'Nhân sự tư vấn hoặc trả lời sai thông tin ý nghĩa logo của Nhà khi khách hỏi', 'Nhân sự tư vấn hoặc trả lời sai thông tin ý nghĩa logo của Nhà khi khách hỏi',
  'pos', null, null, 1, null, 61, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH11_6', 'VH11.6', 'VH11', 'CÂY XANH, Ý THỨC GÌN GIỮ GIÁ TRỊ TỰ NHIÊN', 'vi_pham', 'Nhân sự thấy cây bị héo, hỏng hoặc đặt sai vị trí mà không báo người phụ trách', 'Nhân sự thấy cây bị héo, hỏng hoặc đặt sai vị trí mà không báo người phụ trách',
  'pos', null, null, 1, null, 62, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH12_1', 'VH12.1', 'VH12', 'KHÔNG GIAN, TRÁCH NHIỆM CỦA TẤT CẢ', 'vi_pham', 'Nhân sự bỏ qua chi tiết chưa sạch, chưa đẹp, chưa dễ chịu trong khu vực mình đứng', 'Nhân sự bỏ qua chi tiết chưa sạch, chưa đẹp, chưa dễ chịu trong khu vực mình đứng',
  'pos', null, null, 1, null, 63, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH12_2', 'VH12.2', 'VH12', 'KHÔNG GIAN, TRÁCH NHIỆM CỦA TẤT CẢ', 'vi_pham', 'Nhân sự không chủ động hỗ trợ dọn dẹp, chăm sóc khu vực chung hoặc khu vực lân cận khi khu vực đó đang quá tải hay chưa đạt chuẩn', 'Nhân sự không chủ động hỗ trợ dọn dẹp, chăm sóc khu vực chung hoặc khu vực lân cận khi khu vực đó đang quá tải hay chưa đạt chuẩn',
  'pos', null, null, 1, null, 64, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH12_3', 'VH12.3', 'VH12', 'KHÔNG GIAN, TRÁCH NHIỆM CỦA TẤT CẢ', 'vi_pham', 'Đầu ca, nhân sự không quan sát toàn bộ không gian và không xử lý xong trước khi khách vào', 'Đầu ca, nhân sự không quan sát toàn bộ không gian và không xử lý xong trước khi khách vào',
  'pos', null, null, 1, null, 65, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH12_4', 'VH12.4', 'VH12', 'KHÔNG GIAN, TRÁCH NHIỆM CỦA TẤT CẢ', 'vi_pham', 'Nhân sự không xử lý và không báo cáo quản lý khi phát hiện chi tiết lệch chuẩn trong không gian: vật dụng đặt sai chỗ, vết bẩn, hỏng hóc', 'Nhân sự không xử lý và không báo cáo quản lý khi phát hiện chi tiết lệch chuẩn trong không gian: vật dụng đặt sai chỗ, vết bẩn, hỏng hóc',
  'pos', null, null, 1, null, 66, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_VH12_5', 'VH12.5', 'VH12', 'KHÔNG GIAN, TRÁCH NHIỆM CỦA TẤT CẢ', 'vi_pham', 'Nhân sự ra về hoặc rời vị trí công tác mà không kiểm tra, không tắt các thiết bị điện và công cụ, gây lãng phí hoặc mất an toàn', 'Nhân sự ra về hoặc rời vị trí công tác mà không kiểm tra, không tắt các thiết bị điện và công cụ, gây lãng phí hoặc mất an toàn',
  'pos', null, null, 1, null, 67, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_TC1_1', 'TC1.1', 'TC1', 'GIAO TIẾP VÀ PHỐI HỢP', 'vi_pham', 'Nhân sự trao đổi không rõ trong phạm vi việc của mình, người khác phải hỏi lại mới hiểu', 'Nhân sự trao đổi không rõ trong phạm vi việc của mình, người khác phải hỏi lại mới hiểu',
  'all', null, null, 1, null, 68, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_TC1_2', 'TC1.2', 'TC1', 'GIAO TIẾP VÀ PHỐI HỢP', 'vi_pham', 'Nhân sự không thông tin cho người liên quan, cho tới khi họ phải hỏi', 'Nhân sự không thông tin cho người liên quan, cho tới khi họ phải hỏi',
  'all', null, null, 1, null, 69, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_TC1_3', 'TC1.3', 'TC1', 'GIAO TIẾP VÀ PHỐI HỢP', 'vi_pham', 'Bất đồng trong bộ phận thuộc thẩm quyền của nhân sự mà nhân sự không xử lý bằng trao đổi trực tiếp', 'Bất đồng trong bộ phận thuộc thẩm quyền của nhân sự mà nhân sự không xử lý bằng trao đổi trực tiếp',
  'all', null, null, 1, null, 70, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_TC1_4', 'TC1.4', 'TC1', 'GIAO TIẾP VÀ PHỐI HỢP', 'vi_pham', 'Nhân sự làm việc với bộ phận khác không trôi chảy khi hai bên có ưu tiên khác nhau', 'Nhân sự làm việc với bộ phận khác không trôi chảy khi hai bên có ưu tiên khác nhau',
  'all', null, null, 1, null, 71, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_TC3_1', 'TC3.1', 'TC3', 'CÔNG NGHỆ VÀ CÔNG CỤ, PHẦN CHUẨN', 'vi_pham', 'Nhân sự phải có người nhắc mới dùng bộ công cụ số bắt buộc của vị trí mình', 'Nhân sự phải có người nhắc mới dùng bộ công cụ số bắt buộc của vị trí mình',
  'all', null, null, 1, null, 72, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_TC3_2', 'TC3.2', 'TC3', 'CÔNG NGHỆ VÀ CÔNG CỤ, PHẦN CHUẨN', 'vi_pham', 'Nhân sự nhập dữ liệu sai chuẩn, phải sửa lại sau', 'Nhân sự nhập dữ liệu sai chuẩn, phải sửa lại sau',
  'all', null, null, 1, null, 73, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_TC3_3', 'TC3.3', 'TC3', 'CÔNG NGHỆ VÀ CÔNG CỤ, PHẦN CHUẨN', 'vi_pham', 'Nhân sự không thực hiện đúng các thao tác xử lý sự cố công cụ hoặc phần mềm cơ bản đã được hướng dẫn trong tài liệu chuẩn', 'Nhân sự không thực hiện đúng các thao tác xử lý sự cố công cụ hoặc phần mềm cơ bản đã được hướng dẫn trong tài liệu chuẩn',
  'all', null, null, 1, null, 74, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_TC3_4', 'TC3.4', 'TC3', 'CÔNG NGHỆ VÀ CÔNG CỤ, PHẦN CHUẨN', 'vi_pham', 'Nhân sự dùng kết quả do AI sinh ra mà không rà lại', 'Nhân sự dùng kết quả do AI sinh ra mà không rà lại',
  'all', null, null, 1, null, 75, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_TC3_5', 'TC3.5', 'TC3', 'CÔNG NGHỆ VÀ CÔNG CỤ, PHẦN CHUẨN', 'vi_pham', 'Nhân sự không cập nhật trạng thái công việc, báo cáo lên phần mềm và công cụ chung đúng thời gian quy định', 'Nhân sự không cập nhật trạng thái công việc, báo cáo lên phần mềm và công cụ chung đúng thời gian quy định',
  'all', null, null, 1, null, 76, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_tc3_6', 'TC3.6', 'TC3', 'CÔNG NGHỆ VÀ CÔNG CỤ, PHẦN CHUẨN', 'vi_pham', 'Nhân sự không cập nhật trạng thái công việc, báo cáo lên phần mềm và công cụ chung đúng thời gian quy định', 'Nhân sự dùng sai công cụ cho loại việc đang làm, và không nêu được căn cứ chọn',
  'all', null, null, 1, null, 77, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_tc3_7', 'TC3.7', 'TC3', 'CÔNG NGHỆ VÀ CÔNG CỤ, PHẦN CHUẨN', 'vi_pham', 'Nhân sự không cập nhật trạng thái công việc, báo cáo lên phần mềm và công cụ chung đúng thời gian quy định', 'Sản phẩm nhân sự giao phải làm lại vì chưa đúng chuẩn ngay lần đầu',
  'all', null, null, 1, null, 78, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_tc3_8', 'TC3.8', 'TC3', 'CÔNG NGHỆ VÀ CÔNG CỤ, PHẦN CHUẨN', 'vi_pham', 'Nhân sự không cập nhật trạng thái công việc, báo cáo lên phần mềm và công cụ chung đúng thời gian quy định', 'Người khác phải hỏi thêm mới dùng lại được sản phẩm nhân sự giao',
  'all', null, null, 1, null, 79, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_TC6_1', 'TC6.1', 'TC6', 'THẤU CẢM & HÒA HỢP TRONG ĐỘI NHÓM', 'vi_pham', 'Nhân sự trao đổi về sai sót của một đồng nghiệp trước mặt người khác, trong khi việc đó trao đổi riêng được', 'Nhân sự trao đổi về sai sót của một đồng nghiệp trước mặt người khác, trong khi việc đó trao đổi riêng được',
  'all', null, null, 1, null, 80, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_TC6_2', 'TC6.2', 'TC6', 'THẤU CẢM & HÒA HỢP TRONG ĐỘI NHÓM', 'vi_pham', 'Đồng nghiệp nêu ý kiến khác, nhân sự phản ứng về người nêu thay vì trao đổi về nội dung ý kiến', 'Đồng nghiệp nêu ý kiến khác, nhân sự phản ứng về người nêu thay vì trao đổi về nội dung ý kiến',
  'all', null, null, 1, null, 81, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_TC6_3', 'TC6.3', 'TC6', 'THẤU CẢM & HÒA HỢP TRONG ĐỘI NHÓM', 'vi_pham', 'Nhân sự hối thúc hoặc đòi hỏi bộ phận khác xử lý gấp việc của mình mà bỏ qua quy trình và thời gian xử lý chuẩn đã cam kết giữa các bên', 'Nhân sự hối thúc hoặc đòi hỏi bộ phận khác xử lý gấp việc của mình mà bỏ qua quy trình và thời gian xử lý chuẩn đã cam kết giữa các bên',
  'all', null, null, 1, null, 82, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_TC6_4', 'TC6.4', 'TC6', 'THẤU CẢM & HÒA HỢP TRONG ĐỘI NHÓM', 'vi_pham', 'Nhân sự thiếu kiên nhẫn hoặc bỏ qua việc dùng các công cụ hỗ trợ giao tiếp là viết giấy, ngôn ngữ ký hiệu, hình ảnh khi trao đổi công việc với đồng nghiệp người điếc và người nói', 'Nhân sự thiếu kiên nhẫn hoặc bỏ qua việc dùng các công cụ hỗ trợ giao tiếp là viết giấy, ngôn ngữ ký hiệu, hình ảnh khi trao đổi công việc với đồng nghiệp người điếc/ khiếm thính và người nói',
  'all', null, null, 1, null, 83, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_NL1_1', 'NL1.1', 'NL1', 'NGÔN NGỮ VÀ SỨ MỆNH', 'ghi_nhan', 'Nhân sự chào hỏi và trao đổi việc đơn giản bằng ngôn ngữ ký hiệu', 'Nhân sự chào hỏi và trao đổi việc đơn giản bằng ngôn ngữ ký hiệu',
  'all', null, null, 1, null, 84, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_NL1_3', 'NL1.3', 'NL1', 'NGÔN NGỮ VÀ SỨ MỆNH', 'ghi_nhan', 'Nhân sự kèm được đồng nghiệp học ngôn ngữ của nhóm kia', 'Nhân sự kèm được đồng nghiệp học ngôn ngữ của nhóm kia',
  'all', null, null, 1, null, 85, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_NL1_4', 'NL1.4', 'NL1', 'NGÔN NGỮ VÀ SỨ MỆNH', 'ghi_nhan', 'Nhân sự trao đổi công việc hằng ngày bằng ngôn ngữ ký hiệu mà không cần người phiên dịch', 'Nhân sự trao đổi công việc hằng ngày bằng ngôn ngữ ký hiệu mà không cần người phiên dịch',
  'hearing', null, null, 1, null, 86, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_NL1_5', 'NL1.5', 'NL1', 'NGÔN NGỮ VÀ SỨ MỆNH', 'ghi_nhan', 'Nhân sự trao đổi được nội dung chuyên môn của vị trí mình bằng ngôn ngữ ký hiệu', 'Nhân sự trao đổi được nội dung chuyên môn của vị trí mình bằng ngôn ngữ ký hiệu',
  'hearing', null, null, 1, null, 87, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_NL1_6', 'NL1.6', 'NL1', 'NGÔN NGỮ VÀ SỨ MỆNH', 'ghi_nhan', 'Nhân sự hướng dẫn được nhân sự người điếc về công việc bằng ngôn ngữ ký hiệu, không qua phiên dịch', 'Nhân sự hướng dẫn được nhân sự người điếc/ khiếm thính về công việc bằng ngôn ngữ ký hiệu, không qua phiên dịch',
  'hearing', null, null, 1, null, 88, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_NL1_7', 'NL1.7', 'NL1', 'NGÔN NGỮ VÀ SỨ MỆNH', 'ghi_nhan', 'Nhân sự đọc hiểu được văn bản công việc bằng tiếng Việt: quy trình, thông báo, tin nhắn', 'Nhân sự đọc hiểu được văn bản công việc bằng tiếng Việt: quy trình, thông báo, tin nhắn',
  'deaf', null, null, 1, null, 89, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_NL1_8', 'NL1.8', 'NL1', 'NGÔN NGỮ VÀ SỨ MỆNH', 'ghi_nhan', 'Nhân sự viết và nhắn tin công việc bằng tiếng Việt, người nhận hiểu đúng và không phải hỏi lại', 'Nhân sự viết và nhắn tin công việc bằng tiếng Việt, người nhận hiểu đúng và không phải hỏi lại',
  'deaf', null, null, 1, null, 90, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_NL1_9', 'NL1.9', 'NL1', 'NGÔN NGỮ VÀ SỨ MỆNH', 'ghi_nhan', 'Nhân sự trao đổi được nội dung chuyên môn của vị trí mình bằng tiếng Việt viết', 'Nhân sự trao đổi được nội dung chuyên môn của vị trí mình bằng tiếng Việt viết',
  'deaf', null, null, 1, null, 91, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_NL1_10', 'NL1.10', 'NL1', 'NGÔN NGỮ VÀ SỨ MỆNH', 'ghi_nhan', 'Nhân sự hướng dẫn được nhân sự người nói về công việc bằng tiếng Việt viết, không qua phiên dịch', 'Nhân sự hướng dẫn được nhân sự người nói về công việc bằng tiếng Việt viết, không qua phiên dịch',
  'deaf', null, null, 1, null, 92, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_NL2_3', 'NL2.3', 'NL2', 'LÀM CHỦ VIỆC VÀ NÂNG CHUẨN', 'ghi_nhan', 'Nhân sự đề xuất và nhận làm việc chưa ai giao mà bộ phận đang cần, và việc đó ra kết quả', 'Nhân sự đề xuất và nhận làm việc chưa ai giao mà bộ phận đang cần, và việc đó ra kết quả',
  'all', null, null, 1, null, 93, false)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_NL2_4', 'NL2.4', 'NL2', 'LÀM CHỦ VIỆC VÀ NÂNG CHUẨN', 'ghi_nhan', 'Trong việc liên quan nhiều bên, nhân sự là người đề xuất và điều phối chứ không phải người chờ', 'Trong việc liên quan nhiều bên, nhân sự là người đề xuất và điều phối chứ không phải người chờ',
  'all', null, null, 1, null, 94, false)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_NL3_4', 'NL3.4', 'NL3', 'CÔNG NGHỆ VÀ CÔNG CỤ, PHẦN NÂNG CAO', 'ghi_nhan', 'Nhân sự dùng công cụ hoặc AI để cải tiến việc của mình hoặc của nhóm', 'Nhân sự dùng công cụ hoặc AI để cải tiến việc của mình hoặc của nhóm',
  'all', null, null, 1, null, 95, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_NL3_5', 'NL3.5', 'NL3', 'CÔNG NGHỆ VÀ CÔNG CỤ, PHẦN NÂNG CAO', 'ghi_nhan', 'Nhân sự đề xuất công cụ cho bộ phận và hướng dẫn lại được người khác sử dụng', 'Nhân sự đề xuất công cụ cho bộ phận và hướng dẫn lại được người khác sử dụng',
  'mgmt', null, null, 1, null, 96, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_NL3_6', 'NL3.6', 'NL3', 'CÔNG NGHỆ VÀ CÔNG CỤ, PHẦN NÂNG CAO', 'ghi_nhan', 'Nhân sự xây được công cụ hoặc hệ thống khi sản phẩm có sẵn không đáp ứng đặc thù của Công ty', 'Nhân sự xây được công cụ hoặc hệ thống khi sản phẩm có sẵn không đáp ứng đặc thù của Công ty',
  'lv6', null, null, 1, null, 97, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_NL3_7', 'NL3.7', 'NL3', 'CÔNG NGHỆ VÀ CÔNG CỤ, PHẦN NÂNG CAO', 'ghi_nhan', 'Hệ thống do nhân sự xây có tài liệu vận hành đủ để người khác tiếp nhận', 'Hệ thống do nhân sự xây có tài liệu vận hành đủ để người khác tiếp nhận',
  'lv6', null, null, 1, null, 98, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_NL3_8', 'NL3.8', 'NL3', 'CÔNG NGHỆ VÀ CÔNG CỤ, PHẦN NÂNG CAO', 'ghi_nhan', 'Hệ thống do nhân sự xây tiếp tục chạy được khi người xây vắng mặt', 'Hệ thống do nhân sự xây tiếp tục chạy được khi người xây vắng mặt',
  'lv6', null, null, 1, null, 99, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_NL4_1', 'NL4.1', 'NL4', 'ĐA NHIỆM', 'ghi_nhan', 'Nhân sự hoàn thành tốt công việc chính và sẵn sàng nhận thêm việc hỗ trợ ngay trong ca làm việc', 'Nhân sự hoàn thành tốt công việc chính và sẵn sàng nhận thêm việc hỗ trợ ngay trong ca làm việc',
  'all', null, null, 1, null, 100, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_NL4_2', 'NL4.2', 'NL4', 'ĐA NHIỆM', 'ghi_nhan', 'Nhân sự hỗ trợ được việc ngoài vị trí khi bộ phận cần, trong thời gian ngắn', 'Nhân sự hỗ trợ được việc ngoài vị trí khi bộ phận cần, trong thời gian ngắn',
  'all', null, null, 1, null, 101, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_NL4_3', 'NL4.3', 'NL4', 'ĐA NHIỆM', 'ghi_nhan', 'Nhân sự đảm nhận thêm được một công việc ngoài việc chính mà không ảnh hưởng việc chính', 'Nhân sự đảm nhận thêm được một công việc ngoài việc chính mà không ảnh hưởng việc chính',
  'all', null, null, 1, null, 102, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_NL4_4', 'NL4.4', 'NL4', 'ĐA NHIỆM', 'ghi_nhan', 'Nhân sự làm chủ và kiêm nhiệm hiệu quả từ 02 vai trò hoặc vị trí công việc độc lập trở lên trong bộ phận', 'Nhân sự làm chủ và kiêm nhiệm hiệu quả từ 02 vai trò hoặc vị trí công việc độc lập trở lên trong bộ phận',
  'all', null, null, 1, null, 103, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_NL4_5', 'NL4.5', 'NL4', 'ĐA NHIỆM', 'ghi_nhan', 'Nhân sự thay thế được nhân sự khác trong bộ phận khi thiếu người', 'Nhân sự thay thế được nhân sự khác trong bộ phận khi thiếu người',
  'all', null, null, 1, null, 104, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_NL4_6', 'NL4.6', 'NL4', 'ĐA NHIỆM', 'ghi_nhan', 'Nhân sự làm được việc của vị trí khác hoặc của cấp bậc cao hơn khi Công ty cần', 'Nhân sự làm được việc của vị trí khác hoặc của cấp bậc cao hơn khi Công ty cần',
  'all', null, null, 1, null, 105, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_B1_1', 'B1.1', 'B1', 'BƯỚC 1, TẠO TÍN NHIỆM VỚI KHÁCH HÀNG', 'vi_pham', 'Nhân sự không dùng danh xưng Nhà, Quán, Xưởng, hoặc xưng hô với khách không đúng cách đã quy định', 'Nhân sự không dùng danh xưng Nhà, Quán, Xưởng, hoặc xưng hô với khách không đúng cách đã quy định',
  'all', 'chuyen_mon', 'Bậc 2', 1, 'tr_comm', 106, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_B1_2', 'B1.2', 'B1', 'BƯỚC 1, TẠO TÍN NHIỆM VỚI KHÁCH HÀNG', 'vi_pham', 'Tác phong của nhân sự thiếu lễ phép, không dùng dạ, vâng ạ, xin gửi, xin được trao đổi', 'Tác phong của nhân sự thiếu lễ phép, không dùng dạ, vâng ạ, xin gửi, xin được trao đổi',
  'all', 'chuyen_mon', 'Bậc 2', 1, 'tr_comm', 107, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_B1_3', 'B1.3', 'B1', 'BƯỚC 1, TẠO TÍN NHIỆM VỚI KHÁCH HÀNG', 'vi_pham', 'Nhân sự kì kèo, đánh giá khách hàng, hoặc chứng minh khách hàng sai', 'Nhân sự kì kèo, đánh giá khách hàng, hoặc chứng minh khách hàng sai',
  'all', 'chuyen_mon', 'Bậc 2', 1, 'tr_comm', 108, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_B1_4', 'B1.4', 'B1', 'BƯỚC 1, TẠO TÍN NHIỆM VỚI KHÁCH HÀNG', 'vi_pham', 'Nhân sự nói xấu đối thủ hoặc đem đối thủ ra so sánh', 'Nhân sự nói xấu đối thủ hoặc đem đối thủ ra so sánh',
  'all', 'chuyen_mon', 'Bậc 2', 1, 'tr_comm', 109, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_B1_5', 'B1.5', 'B1', 'BƯỚC 1, TẠO TÍN NHIỆM VỚI KHÁCH HÀNG', 'vi_pham', 'Nhân sự giới thiệu sai thông tin cốt lõi, hoặc cung cấp thông tin không đúng sự thật về Công ty cho khách', 'Nhân sự giới thiệu sai thông tin cốt lõi, hoặc cung cấp thông tin không đúng sự thật về Công ty cho khách',
  'all', 'chuyen_mon', 'Bậc 2', 1, 'tr_comm', 110, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_B1_6', 'B1.6', 'B1', 'BƯỚC 1, TẠO TÍN NHIỆM VỚI KHÁCH HÀNG', 'vi_pham', 'Nhân sự ngắt lời, phớt lờ hoặc không lắng nghe khi khách phản ánh vấn đề, băn khoăn', 'Nhân sự ngắt lời, phớt lờ hoặc không lắng nghe khi khách phản ánh vấn đề, băn khoăn',
  'all', 'chuyen_mon', 'Bậc 2', 1, 'tr_comm', 111, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_B1_7', 'B1.7', 'B1', 'BƯỚC 1, TẠO TÍN NHIỆM VỚI KHÁCH HÀNG', 'vi_pham', 'Nhân sự dùng từ "nhưng", thay vì dùng "và" kèm một câu trả lời có nội dung', 'Nhân sự dùng từ "nhưng", thay vì dùng "và" kèm một câu trả lời có nội dung',
  'all', 'chuyen_mon', 'Bậc 2', 1, 'tr_comm', 112, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_B2_1', 'B2.1', 'B2', 'BƯỚC 2, KHAI THÁC VẤN ĐỀ VÀ NHU CẦU', 'vi_pham', 'Nhân sự hỏi từ 03 câu trở lên nhưng không xác định được nhu cầu hoặc vấn đề chính của khách', 'Nhân sự hỏi từ 03 câu trở lên nhưng không xác định được nhu cầu hoặc vấn đề chính của khách',
  'all', 'chuyen_mon', 'Bậc 2', 1, 'tr_comm', 113, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_B2_2', 'B2.2', 'B2', 'BƯỚC 2, KHAI THÁC VẤN ĐỀ VÀ NHU CẦU', 'vi_pham', 'Câu hỏi của nhân sự không làm rõ được kết quả cần đạt, mục đích hoặc bước tiếp theo', 'Câu hỏi của nhân sự không làm rõ được kết quả cần đạt, mục đích hoặc bước tiếp theo',
  'all', 'chuyen_mon', 'Bậc 2', 1, 'tr_comm', 114, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_B2_3', 'B2.3', 'B2', 'BƯỚC 2, KHAI THÁC VẤN ĐỀ VÀ NHU CẦU', 'vi_pham', 'Nhân sự kết thúc lượt nói mà không có câu hỏi hoặc lời đề nghị, làm mạch trao đổi đứt', 'Nhân sự kết thúc lượt nói mà không có câu hỏi hoặc lời đề nghị, làm mạch trao đổi đứt',
  'all', 'chuyen_mon', 'Bậc 2', 1, 'tr_comm', 115, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_B2_5', 'B2.5', 'B2', 'BƯỚC 2, KHAI THÁC VẤN ĐỀ VÀ NHU CẦU', 'vi_pham', 'Nhân sự không đặt câu hỏi gợi mở, chỉ chờ khách tự nêu vấn đề mới tư vấn', 'Nhân sự không đặt câu hỏi gợi mở, chỉ chờ khách tự nêu vấn đề mới tư vấn',
  'all', 'chuyen_mon', 'Bậc 2', 1, 'tr_comm', 116, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_B2_6', 'B2.6', 'B2', 'BƯỚC 2, KHAI THÁC VẤN ĐỀ VÀ NHU CẦU', 'vi_pham', 'Nhân sự phải quay lại hỏi thêm sau khi đã đề xuất giải pháp, vì chưa xác định đúng vấn đề trong lượt tư vấn', 'Nhân sự phải quay lại hỏi thêm sau khi đã đề xuất giải pháp, vì chưa xác định đúng vấn đề trong lượt tư vấn',
  'all', 'chuyen_mon', 'Bậc 2', 1, 'tr_comm', 117, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_B3_1', 'B3.1', 'B3', 'BƯỚC 3 TỚI 6, CUNG CẤP GIẢI PHÁP, CHỐT ĐƠN VÀ XỬ LÝ TỪ CHỐI', 'vi_pham', 'Nhân sự chọn sản phẩm chỉ dựa vào yêu cầu bề ngoài của khách, không hỏi để xác định vấn đề thực sự cần giải quyết', 'Nhân sự chọn sản phẩm chỉ dựa vào yêu cầu bề ngoài của khách, không hỏi để xác định vấn đề thực sự cần giải quyết',
  'all', 'chuyen_mon', 'Bậc 4', 1, 'tr_comm', 118, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_B3_2', 'B3.2', 'B3', 'BƯỚC 3 TỚI 6, CUNG CẤP GIẢI PHÁP, CHỐT ĐƠN VÀ XỬ LÝ TỪ CHỐI', 'vi_pham', 'Nhân sự chọn sai sản phẩm cho vấn đề của khách', 'Nhân sự chọn sai sản phẩm cho vấn đề của khách',
  'all', 'chuyen_mon', 'Bậc 4', 1, 'tr_comm', 119, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_B3_3', 'B3.3', 'B3', 'BƯỚC 3 TỚI 6, CUNG CẤP GIẢI PHÁP, CHỐT ĐƠN VÀ XỬ LÝ TỪ CHỐI', 'vi_pham', 'Nhân sự không giải thích được vì sao chọn sản phẩm này thay vì sản phẩm khác', 'Nhân sự không giải thích được vì sao chọn sản phẩm này thay vì sản phẩm khác',
  'all', 'chuyen_mon', 'Bậc 4', 1, 'tr_comm', 120, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_B3_4', 'B3.4', 'B3', 'BƯỚC 3 TỚI 6, CUNG CẤP GIẢI PHÁP, CHỐT ĐƠN VÀ XỬ LÝ TỪ CHỐI', 'vi_pham', 'Sản phẩm của Công ty không phải giải pháp mà nhân sự vẫn bán, không nói ra và không từ chối', 'Sản phẩm của Công ty không phải giải pháp mà nhân sự vẫn bán, không nói ra và không từ chối',
  'all', 'chuyen_mon', 'Bậc 4', 1, 'tr_comm', 121, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_B3_5', 'B3.5', 'B3', 'BƯỚC 3 TỚI 6, CUNG CẤP GIẢI PHÁP, CHỐT ĐƠN VÀ XỬ LÝ TỪ CHỐI', 'vi_pham', 'Nhân sự không ghép được các sản phẩm thành một bộ giải quyết trọn một vấn đề cụ thể', 'Nhân sự không ghép được các sản phẩm thành một bộ giải quyết trọn một vấn đề cụ thể',
  'all', 'chuyen_mon', 'Bậc 4', 1, 'tr_comm', 122, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_B3_6', 'B3.6', 'B3', 'BƯỚC 3 TỚI 6, CUNG CẤP GIẢI PHÁP, CHỐT ĐƠN VÀ XỬ LÝ TỪ CHỐI', 'vi_pham', 'Nhân sự tự ý tư vấn kết hợp các sản phẩm nằm ngoài danh mục giải pháp đã được Công ty phê duyệt', 'Nhân sự tự ý tư vấn kết hợp các sản phẩm nằm ngoài danh mục giải pháp đã được Công ty phê duyệt',
  'all', 'chuyen_mon', 'Bậc 4', 1, 'tr_comm', 123, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_B3_7', 'B3.7', 'B3', 'BƯỚC 3 TỚI 6, CUNG CẤP GIẢI PHÁP, CHỐT ĐƠN VÀ XỬ LÝ TỪ CHỐI', 'vi_pham', 'Nhân sự chốt thử khi chưa có tín nhiệm, chưa rõ vấn đề, hoặc chưa đề xuất một giải pháp cụ thể', 'Nhân sự chốt thử khi chưa có tín nhiệm, chưa rõ vấn đề, hoặc chưa đề xuất một giải pháp cụ thể',
  'all', 'chuyen_mon', 'Bậc 4', 1, 'tr_comm', 124, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_B3_8', 'B3.8', 'B3', 'BƯỚC 3 TỚI 6, CUNG CẤP GIẢI PHÁP, CHỐT ĐƠN VÀ XỬ LÝ TỪ CHỐI', 'vi_pham', 'Khách đã có dấu hiệu sẵn sàng mà nhân sự vẫn nói tiếp', 'Khách đã có dấu hiệu sẵn sàng mà nhân sự vẫn nói tiếp',
  'all', 'chuyen_mon', 'Bậc 4', 1, 'tr_comm', 125, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_B3_9', 'B3.9', 'B3', 'BƯỚC 3 TỚI 6, CUNG CẤP GIẢI PHÁP, CHỐT ĐƠN VÀ XỬ LÝ TỪ CHỐI', 'vi_pham', 'Nhân sự dùng câu hỏi đóng kiểu hỏi khách có mua không, thay vì đặt lời đề nghị khẳng định', 'Nhân sự dùng câu hỏi đóng kiểu hỏi khách có mua không, thay vì đặt lời đề nghị khẳng định',
  'all', 'chuyen_mon', 'Bậc 4', 1, 'tr_comm', 126, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_B3_10', 'B3.10', 'B3', 'BƯỚC 3 TỚI 6, CUNG CẤP GIẢI PHÁP, CHỐT ĐƠN VÀ XỬ LÝ TỪ CHỐI', 'vi_pham', 'Nhân sự bỏ qua cơ hội bán chéo và bán nâng cấp tạo thêm giá trị cho khách', 'Nhân sự bỏ qua cơ hội bán chéo và bán nâng cấp tạo thêm giá trị cho khách',
  'all', 'chuyen_mon', 'Bậc 4', 1, 'tr_comm', 127, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_B3_11', 'B3.11', 'B3', 'BƯỚC 3 TỚI 6, CUNG CẤP GIẢI PHÁP, CHỐT ĐƠN VÀ XỬ LÝ TỪ CHỐI', 'vi_pham', 'Nhân sự bỏ dở cuộc tư vấn, hoặc hạ giá và ưu đãi trái quy định ngay khi khách vừa đưa ra băn khoăn về giá', 'Nhân sự bỏ dở cuộc tư vấn, hoặc hạ giá và ưu đãi trái quy định ngay khi khách vừa đưa ra băn khoăn về giá',
  'all', 'chuyen_mon', 'Bậc 4', 1, 'tr_comm', 128, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_B3_12', 'B3.12', 'B3', 'BƯỚC 3 TỚI 6, CUNG CẤP GIẢI PHÁP, CHỐT ĐƠN VÀ XỬ LÝ TỪ CHỐI', 'vi_pham', 'Nhân sự xử băn khoăn của khách khi chưa hỏi xác nhận đó có phải băn khoăn duy nhất không', 'Nhân sự xử băn khoăn của khách khi chưa hỏi xác nhận đó có phải băn khoăn duy nhất không',
  'all', 'chuyen_mon', 'Bậc 4', 1, 'tr_comm', 129, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_B3_13', 'B3.13', 'B3', 'BƯỚC 3 TỚI 6, CUNG CẤP GIẢI PHÁP, CHỐT ĐƠN VÀ XỬ LÝ TỪ CHỐI', 'vi_pham', 'Nhân sự tranh luận từng lý do thay vì nhắc lại vấn đề cốt lõi', 'Nhân sự tranh luận từng lý do thay vì nhắc lại vấn đề cốt lõi',
  'all', 'chuyen_mon', 'Bậc 4', 1, 'tr_comm', 130, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_B3_14', 'B3.14', 'B3', 'BƯỚC 3 TỚI 6, CUNG CẤP GIẢI PHÁP, CHỐT ĐƠN VÀ XỬ LÝ TỪ CHỐI', 'vi_pham', 'Phát sinh từ chối mới mà nhân sự bỏ dở, hoặc chuyển sang ép mua', 'Phát sinh từ chối mới mà nhân sự bỏ dở, hoặc chuyển sang ép mua',
  'all', 'chuyen_mon', 'Bậc 4', 1, 'tr_comm', 131, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_B5_1', 'B5.1', 'B5', 'BƯỚC 7, CHĂM SÓC SAU BÁN VÀ LAN TOẢ', 'vi_pham', 'Nhân sự hướng dẫn sử dụng chưa đủ để khách dùng đúng ngay lần đầu', 'Nhân sự hướng dẫn sử dụng chưa đủ để khách dùng đúng ngay lần đầu',
  'all', 'chuyen_mon', 'Bậc 5', 1, 'tr_comm', 132, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_B5_2', 'B5.2', 'B5', 'BƯỚC 7, CHĂM SÓC SAU BÁN VÀ LAN TOẢ', 'vi_pham', 'Nhân sự không cung cấp thông tin hậu mãi cho khách', 'Nhân sự không cung cấp thông tin hậu mãi cho khách',
  'all', 'chuyen_mon', 'Bậc 5', 1, 'tr_comm', 133, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_B5_3', 'B5.3', 'B5', 'BƯỚC 7, CHĂM SÓC SAU BÁN VÀ LAN TOẢ', 'vi_pham', 'Nhân sự cắt kết nối sau khi khách đã thanh toán', 'Nhân sự cắt kết nối sau khi khách đã thanh toán',
  'all', 'chuyen_mon', 'Bậc 5', 1, 'tr_comm', 134, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_B5_4', 'B5.4', 'B5', 'BƯỚC 7, CHĂM SÓC SAU BÁN VÀ LAN TOẢ', 'vi_pham', 'Nhân sự không chủ động nhắn tin hoặc gọi điện hỏi thăm trải nghiệm sử dụng của khách theo đúng lịch chăm sóc hậu mãi đã quy định', 'Nhân sự không chủ động nhắn tin hoặc gọi điện hỏi thăm trải nghiệm sử dụng của khách theo đúng lịch chăm sóc hậu mãi đã quy định',
  'all', 'chuyen_mon', 'Bậc 5', 1, 'tr_comm', 135, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_B5_5', 'B5.5', 'B5', 'BƯỚC 7, CHĂM SÓC SAU BÁN VÀ LAN TOẢ', 'vi_pham', 'Nhân sự không bàn giao đầy đủ thông tin đơn hàng cho các bộ phận liên quan là xưởng, vận chuyển, đội ca sau, làm gián đoạn trải nghiệm của khách', 'Nhân sự không bàn giao đầy đủ thông tin đơn hàng cho các bộ phận liên quan là xưởng, vận chuyển, đội ca sau, làm gián đoạn trải nghiệm của khách',
  'all', 'chuyen_mon', 'Bậc 5', 1, 'tr_comm', 136, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_B5_6', 'B5.6', 'B5', 'BƯỚC 7, CHĂM SÓC SAU BÁN VÀ LAN TOẢ', 'vi_pham', 'Nhân sự không hướng dẫn khách để lại đánh giá theo đúng quy chuẩn', 'Nhân sự không hướng dẫn khách để lại đánh giá theo đúng quy chuẩn',
  'all', 'chuyen_mon', 'Bậc 5', 1, 'tr_comm', 137, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_C6_1', 'C6.1', 'C6', 'KIẾN THỨC SẢN PHẨM, THỰC ĐƠN VÀ AN TOÀN SẢN PHẨM', 'vi_pham', 'Nhân sự không nắm tên và công dụng chính của các nhóm sản phẩm', 'Nhân sự không nắm tên và công dụng chính của các nhóm sản phẩm',
  'all', 'chuyen_mon', 'Bậc 2', 1, 'tr_comm', 138, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_C6_2', 'C6.2', 'C6', 'KIẾN THỨC SẢN PHẨM, THỰC ĐƠN VÀ AN TOÀN SẢN PHẨM', 'vi_pham', 'Nhân sự phải hỏi lại người khác về công dụng, cách dùng, thành phần, hạn sử dụng, cách bảo quản hoặc cảnh báo an toàn của một nhóm sản phẩm', 'Nhân sự phải hỏi lại người khác về công dụng, cách dùng, thành phần, hạn sử dụng, cách bảo quản hoặc cảnh báo an toàn của một nhóm sản phẩm',
  'all', 'chuyen_mon', 'Bậc 2', 1, 'tr_comm', 139, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_C6_3', 'C6.3', 'C6', 'KIẾN THỨC SẢN PHẨM, THỰC ĐƠN VÀ AN TOÀN SẢN PHẨM', 'vi_pham', 'Nhân sự không nắm thực đơn đồ uống và các set trà của Quán', 'Nhân sự không nắm thực đơn đồ uống và các set trà của Quán',
  'all', 'chuyen_mon', 'Bậc 2', 1, 'tr_comm', 140, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_C6_4', 'C6.4', 'C6', 'KIẾN THỨC SẢN PHẨM, THỰC ĐƠN VÀ AN TOÀN SẢN PHẨM', 'vi_pham', 'Nhân sự không nêu được các trường hợp chống chỉ định, hoặc đối tượng không nên sử dụng của sản phẩm khi tư vấn cho khách', 'Nhân sự không nêu được các trường hợp chống chỉ định, hoặc đối tượng không nên sử dụng của sản phẩm khi tư vấn cho khách',
  'all', 'chuyen_mon', 'Bậc 4', 1, 'tr_comm', 141, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_C6_6', 'C6.6', 'C6', 'KIẾN THỨC SẢN PHẨM, THỰC ĐƠN VÀ AN TOÀN SẢN PHẨM', 'vi_pham', 'Nhân sự không tư vấn được cho khách về sản phẩm của tuyến Pha chế và tuyến Bếp bánh', 'Nhân sự không tư vấn được cho khách về sản phẩm của tuyến Pha chế và tuyến Bếp bánh',
  'all', 'chuyen_mon', 'Bậc 4', 1, 'tr_comm', 142, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_C6_7', 'C6.7', 'C6', 'KIẾN THỨC SẢN PHẨM, THỰC ĐƠN VÀ AN TOÀN SẢN PHẨM', 'vi_pham', 'Người trong tuyến hỏi về sản phẩm mà nhân sự không trả lời được', 'Người trong tuyến hỏi về sản phẩm mà nhân sự không trả lời được',
  'all', 'chuyen_mon', 'Bậc 5', 1, 'tr_comm', 143, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_C6_8', 'C6.8', 'C6', 'KIẾN THỨC SẢN PHẨM, THỰC ĐƠN VÀ AN TOÀN SẢN PHẨM', 'vi_pham', 'Khách mua một sản phẩm mà nhân sự chưa nêu cảnh báo an toàn của chính sản phẩm đó, hoặc chỉ nêu khi khách hỏi', 'Khách mua một sản phẩm mà nhân sự chưa nêu cảnh báo an toàn của chính sản phẩm đó, hoặc chỉ nêu khi khách hỏi',
  'all', 'chuyen_mon', 'Bậc 2', 1, 'tr_comm', 144, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_C6_9', 'C6.9', 'C6', 'KIẾN THỨC SẢN PHẨM, THỰC ĐƠN VÀ AN TOÀN SẢN PHẨM', 'vi_pham', 'Khách mua một sản phẩm mà nhân sự không nêu những đối tượng không dùng được sản phẩm đó', 'Khách mua một sản phẩm mà nhân sự không nêu những đối tượng không dùng được sản phẩm đó',
  'all', 'chuyen_mon', 'Bậc 2', 1, 'tr_comm', 145, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_C6_10', 'C6.10', 'C6', 'KIẾN THỨC SẢN PHẨM, THỰC ĐƠN VÀ AN TOÀN SẢN PHẨM', 'vi_pham', 'Khách mua một sản phẩm cần thử trước khi dùng mà nhân sự không hướng dẫn cách dùng lần đầu', 'Khách mua một sản phẩm cần thử trước khi dùng mà nhân sự không hướng dẫn cách dùng lần đầu',
  'all', 'chuyen_mon', 'Bậc 2', 1, 'tr_comm', 146, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_C6_11', 'C6.11', 'C6', 'KIẾN THỨC SẢN PHẨM, THỰC ĐƠN VÀ AN TOÀN SẢN PHẨM', 'vi_pham', 'Khách mua một sản phẩm mà nhân sự không nêu hạn sử dụng và cách bảo quản khi bàn giao', 'Khách mua một sản phẩm mà nhân sự không nêu hạn sử dụng và cách bảo quản khi bàn giao',
  'all', 'chuyen_mon', 'Bậc 2', 1, 'tr_comm', 147, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_C7_1', 'C7.1', 'C7', 'BÁN CHO NHIỀU KHÁCH CÙNG LÚC', 'vi_pham', 'Có khách bị bỏ quên khi nhân sự tiếp nhiều khách cùng lúc', 'Có khách bị bỏ quên khi nhân sự tiếp nhiều khách cùng lúc',
  'all', 'chuyen_mon', 'Bậc 2', 1, 'tr_comm', 148, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_C7_2', 'C7.2', 'C7', 'BÁN CHO NHIỀU KHÁCH CÙNG LÚC', 'vi_pham', 'Trong khung giờ đông, nhân sự chọn sai lúc nào tư vấn một đối một và lúc nào giới thiệu cùng lúc cho cả nhóm', 'Trong khung giờ đông, nhân sự chọn sai lúc nào tư vấn một đối một và lúc nào giới thiệu cùng lúc cho cả nhóm',
  'all', 'chuyen_mon', 'Bậc 4', 1, 'tr_comm', 149, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_C7_3', 'C7.3', 'C7', 'BÁN CHO NHIỀU KHÁCH CÙNG LÚC', 'vi_pham', 'Chất lượng khai thác vấn đề của nhân sự tụt khi phải chia sự chú ý', 'Chất lượng khai thác vấn đề của nhân sự tụt khi phải chia sự chú ý',
  'all', 'chuyen_mon', 'Bậc 4', 1, 'tr_comm', 150, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_C7_4', 'C7.4', 'C7', 'BÁN CHO NHIỀU KHÁCH CÙNG LÚC', 'vi_pham', 'Với nhóm khách đi cùng nhau, nhân sự không nhận ra người ra quyết định và người ảnh hưởng tới quyết định', 'Với nhóm khách đi cùng nhau, nhân sự không nhận ra người ra quyết định và người ảnh hưởng tới quyết định',
  'all', 'chuyen_mon', 'Bậc 4', 1, 'tr_comm', 151, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_C7_5', 'C7.5', 'C7', 'BÁN CHO NHIỀU KHÁCH CÙNG LÚC', 'vi_pham', 'Tỷ lệ chốt của nhân sự trong khung giờ đông thấp hơn đáng kể so với khung giờ thường', 'Tỷ lệ chốt của nhân sự trong khung giờ đông thấp hơn đáng kể so với khung giờ thường',
  'all', 'chuyen_mon', 'Bậc 4', 1, 'tr_comm', 152, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_C7_6', 'C7.6', 'C7', 'BÁN CHO NHIỀU KHÁCH CÙNG LÚC', 'vi_pham', 'Nhân sự không đề xuất được cách tiếp khách cho khung giờ đông với người phụ trách đơn vị', 'Nhân sự không đề xuất được cách tiếp khách cho khung giờ đông với người phụ trách đơn vị',
  'all', 'chuyen_mon', 'Bậc 5', 1, 'tr_comm', 153, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_C8_1', 'C8.1', 'C8', 'TỰ TẠO NGUỒN KHÁCH QUA KÊNH CÁ NHÂN, VÀ GIỮ NỘI DUNG ĐĂNG ĐÚNG QUY CHUẨN THƯƠNG HIỆU, KHÔNG SAI LỆCH THÔNG TIN SẢN PHẨM', 'ghi_nhan', 'Có khách tự tìm đến nhân sự qua kênh cá nhân của nhân sự: nội dung đăng, livestream hoặc cách khác', 'Có khách tự tìm đến nhân sự qua kênh cá nhân của nhân sự: nội dung đăng, livestream hoặc cách khác',
  'all', 'chuyen_mon', 'Bậc 4', 1, 'tr_comm', 154, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_C8_2', 'C8.2', 'C8', 'TỰ TẠO NGUỒN KHÁCH QUA KÊNH CÁ NHÂN, VÀ GIỮ NỘI DUNG ĐĂNG ĐÚNG QUY CHUẨN THƯƠNG HIỆU, KHÔNG SAI LỆCH THÔNG TIN SẢN PHẨM', 'ghi_nhan', 'Nội dung nhân sự đăng trên kênh cá nhân đúng bộ nhận diện và thông điệp chuẩn của Thương hiệu, và đúng thông tin sản phẩm', 'Nội dung nhân sự đăng trên kênh cá nhân đúng bộ nhận diện và thông điệp chuẩn của Thương hiệu, và đúng thông tin sản phẩm',
  'all', 'chuyen_mon', 'Bậc 4', 1, 'tr_comm', 155, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_C8_3', 'C8.3', 'C8', 'TỰ TẠO NGUỒN KHÁCH QUA KÊNH CÁ NHÂN, VÀ GIỮ NỘI DUNG ĐĂNG ĐÚNG QUY CHUẨN THƯƠNG HIỆU, KHÔNG SAI LỆCH THÔNG TIN SẢN PHẨM', 'ghi_nhan', 'Nhân sự chủ động tương tác lại với khách đã mua qua kênh cá nhân của mình', 'Nhân sự chủ động tương tác lại với khách đã mua qua kênh cá nhân của mình',
  'all', 'chuyen_mon', 'Bậc 4', 1, 'tr_comm', 156, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_C8_5', 'C8.5', 'C8', 'TỰ TẠO NGUỒN KHÁCH QUA KÊNH CÁ NHÂN, VÀ GIỮ NỘI DUNG ĐĂNG ĐÚNG QUY CHUẨN THƯƠNG HIỆU, KHÔNG SAI LỆCH THÔNG TIN SẢN PHẨM', 'ghi_nhan', 'Nhân sự phản hồi thắc mắc và tin nhắn của khách tiềm năng đến qua kênh cá nhân trong thời hạn đã quy định', 'Nhân sự phản hồi thắc mắc và tin nhắn của khách tiềm năng đến qua kênh cá nhân trong thời hạn đã quy định',
  'all', 'chuyen_mon', 'Bậc 4', 1, 'tr_comm', 157, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_QG1', 'QG1', 'QG', 'GIỮ CHUẨN QUẢN LÝ', 'vi_pham', 'Nhân sự thấy hành vi vượt ranh giới mà không nhắc, không chặn tại chỗ, hoặc không báo lên trong ca', 'Nhân sự thấy hành vi vượt ranh giới mà không nhắc, không chặn tại chỗ, hoặc không báo lên trong ca',
  'mgmt', 'quan_ly', 'Bậc 3', 1, 'tr_comm', 158, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_QG2', 'QG2', 'QG', 'GIỮ CHUẨN QUẢN LÝ', 'vi_pham', 'Nhân sự chờ có sự việc mới kiểm tra, hoặc xử lý vi phạm không đúng thang', 'Nhân sự chờ có sự việc mới kiểm tra, hoặc xử lý vi phạm không đúng thang',
  'mgmt', 'quan_ly', 'Bậc 3', 1, 'tr_comm', 159, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_QG3', 'QG3', 'QG', 'GIỮ CHUẨN QUẢN LÝ', 'vi_pham', 'Nhân sự chi vượt định mức hoặc hạn mức được giao', 'Nhân sự chi vượt định mức hoặc hạn mức được giao',
  'mgmt', 'quan_ly', 'Bậc 3', 1, 'tr_comm', 160, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_QG4', 'QG4', 'QG', 'GIỮ CHUẨN QUẢN LÝ', 'vi_pham', 'Nhân sự ghi nhận sai dữ liệu bán vào hệ thống', 'Nhân sự ghi nhận sai dữ liệu bán vào hệ thống',
  'mgmt', 'quan_ly', 'Bậc 3', 1, 'tr_comm', 161, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_QG5', 'QG5', 'QG', 'GIỮ CHUẨN QUẢN LÝ', 'vi_pham', 'Nhân sự không kiểm tra tính tuân thủ quy trình của người trong đơn vị theo nhịp đã quy định, hoặc có kiểm tra mà không ghi lại kết quả', 'Nhân sự không kiểm tra tính tuân thủ quy trình của người trong đơn vị theo nhịp đã quy định, hoặc có kiểm tra mà không ghi lại kết quả',
  'mgmt', 'quan_ly', 'Bậc 3', 1, 'tr_comm', 162, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_QA1', 'QA1', 'QA', 'VẬN HÀNH TUYẾN', 'vi_pham', 'Nhân sự tổ chức được công việc trong phạm vi đơn vị mình phụ trách', 'Nhân sự tổ chức được công việc trong phạm vi đơn vị mình phụ trách',
  'mgmt', 'quan_ly', 'Bậc 3', 1, 'tr_comm', 163, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_QA2', 'QA2', 'QA', 'VẬN HÀNH TUYẾN', 'vi_pham', 'Nhân sự nhận chỉ tiêu và phân bổ xuống từng người theo năng lực thật, giải thích được bằng số liệu chứ không chia đều', 'Nhân sự nhận chỉ tiêu và phân bổ xuống từng người theo năng lực thật, giải thích được bằng số liệu chứ không chia đều',
  'mgmt', 'quan_ly', 'Bậc 3', 1, 'tr_comm', 164, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_QA4', 'QA4', 'QA', 'VẬN HÀNH TUYẾN', 'vi_pham', 'Nhân sự giữ đơn vị chạy được khi nhân sự chủ chốt vắng mặt', 'Nhân sự giữ đơn vị chạy được khi nhân sự chủ chốt vắng mặt',
  'mgmt', 'quan_ly', 'Bậc 4', 1, 'tr_comm', 165, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_QA5', 'QA5', 'QA', 'VẬN HÀNH TUYẾN', 'vi_pham', 'Nhân sự điều chỉnh phân bổ trong kỳ khi thực tế thay đổi', 'Nhân sự điều chỉnh phân bổ trong kỳ khi thực tế thay đổi',
  'mgmt', 'quan_ly', 'Bậc 4', 1, 'tr_comm', 166, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_QA6', 'QA6', 'QA', 'VẬN HÀNH TUYẾN', 'vi_pham', 'Nhân sự bảo đảm chỉ tiêu và chương trình đặt ra luôn có đường đạt kết quả mà vẫn giữ đúng quy định', 'Nhân sự bảo đảm chỉ tiêu và chương trình đặt ra luôn có đường đạt kết quả mà vẫn giữ đúng quy định',
  'mgmt', 'quan_ly', 'Bậc 5', 1, 'tr_comm', 167, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_QB1', 'QB1', 'QB', 'ĐỘI NGŨ, PHỐI HỢP VÀ KÈM NGHỀ', 'vi_pham', 'Nhân sự thiết lập lộ trình kèm nghề một kèm một cho nhân sự đang thử việc và cho nhân sự chưa đạt chuẩn ở kỳ đánh giá trước, rồi nghiệm thu theo lộ trình đó', 'Nhân sự thiết lập lộ trình kèm nghề một kèm một cho nhân sự đang thử việc và cho nhân sự chưa đạt chuẩn ở kỳ đánh giá trước, rồi nghiệm thu theo lộ trình đó',
  'mgmt', 'quan_ly', 'Bậc 3', 1, 'tr_comm', 168, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_QB2', 'QB2', 'QB', 'ĐỘI NGŨ, PHỐI HỢP VÀ KÈM NGHỀ', 'vi_pham', 'Nghe một lượt tiếp khách của người khác, nhân sự chỉ ra được người đó đang mắc ở bước nào', 'Nghe một lượt tiếp khách của người khác, nhân sự chỉ ra được người đó đang mắc ở bước nào',
  'mgmt', 'quan_ly', 'Bậc 3', 1, 'tr_comm', 169, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_QB3', 'QB3', 'QB', 'ĐỘI NGŨ, PHỐI HỢP VÀ KÈM NGHỀ', 'vi_pham', 'Nhân sự tổ chức buổi chia sẻ hoặc huấn luyện nội bộ ngắn cho đội ngũ trong tuyến theo nhịp tuần, nội dung về kỹ năng xử lý tình huống', 'Nhân sự tổ chức buổi chia sẻ hoặc huấn luyện nội bộ ngắn cho đội ngũ trong tuyến theo nhịp tuần, nội dung về kỹ năng xử lý tình huống',
  'mgmt', 'quan_ly', 'Bậc 3', 1, 'tr_comm', 170, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_QB6', 'QB6', 'QB', 'ĐỘI NGŨ, PHỐI HỢP VÀ KÈM NGHỀ', 'vi_pham', 'Nhân sự hệ thống hoá cách bán của tuyến thành tài liệu chuyển giao', 'Nhân sự hệ thống hóa cách bán của tuyến thành tài liệu chuyển giao',
  'mgmt', 'quan_ly', 'Bậc 6', 1, 'tr_comm', 171, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_QC1', 'QC1', 'QC', 'CHI PHÍ BÁN HÀNG VÀ CƠ CẤU HÀNG BÁN', 'vi_pham', 'Nhân sự đề xuất đẩy hoặc ngừng một sản phẩm kèm số liệu bán', 'Nhân sự đề xuất đẩy hoặc ngừng một sản phẩm kèm số liệu bán',
  'mgmt', 'quan_ly', 'Bậc 3', 1, 'tr_comm', 172, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_QC6', 'QC6', 'QC', 'CHI PHÍ BÁN HÀNG VÀ CƠ CẤU HÀNG BÁN', 'vi_pham', 'Đề xuất chương trình khuyến mãi của nhân sự kèm tính toán chi phí bán hàng, và tính toán đó khớp khi đối chiếu sau kỳ', 'Đề xuất chương trình khuyến mãi của nhân sự kèm tính toán chi phí bán hàng, và tính toán đó khớp khi đối chiếu sau kỳ',
  'mgmt', 'quan_ly', 'Bậc 6', 1, 'tr_comm', 173, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_QC8', 'QC8', 'QC', 'CHI PHÍ BÁN HÀNG VÀ CƠ CẤU HÀNG BÁN', 'vi_pham', 'Nhân sự đề xuất điều chỉnh hoặc dừng một chương trình khuyến mãi khi chương trình đó không đạt ngưỡng hiệu quả đã đặt ra từ đầu', 'Nhân sự đề xuất điều chỉnh hoặc dừng một chương trình khuyến mãi khi chương trình đó không đạt ngưỡng hiệu quả đã đặt ra từ đầu',
  'mgmt', 'quan_ly', 'Bậc 6', 1, 'tr_comm', 174, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_QD1', 'QD1', 'QD', 'THỊ TRƯỜNG VÀ BỘ SỐ', 'vi_pham', 'Nhân sự theo dõi bộ số của đơn vị mình phụ trách, gồm tỷ lệ chuyển đổi, giá trị đơn trung bình và tỷ lệ đơn có bán thêm, và đề xuất phương án cải thiện trong kỳ', 'Nhân sự theo dõi bộ số của đơn vị mình phụ trách, gồm tỷ lệ chuyển đổi, giá trị đơn trung bình và tỷ lệ đơn có bán thêm, và đề xuất phương án cải thiện trong kỳ',
  'mgmt', 'quan_ly', 'Bậc 3', 1, 'tr_comm', 175, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_QD2', 'QD2', 'QD', 'THỊ TRƯỜNG VÀ BỘ SỐ', 'vi_pham', 'Nhân sự trình bày số liệu cho người không quen đọc số', 'Nhân sự trình bày số liệu cho người không quen đọc số',
  'mgmt', 'quan_ly', 'Bậc 3', 1, 'tr_comm', 176, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_QD3', 'QD3', 'QD', 'THỊ TRƯỜNG VÀ BỘ SỐ', 'vi_pham', 'Nhân sự đọc bộ số của bộ phận và chỉ ra được người nào đang mắc ở đâu', 'Nhân sự đọc bộ số của bộ phận và chỉ ra được người nào đang mắc ở đâu',
  'mgmt', 'quan_ly', 'Bậc 4', 1, 'tr_comm', 177, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_QD4', 'QD4', 'QD', 'THỊ TRƯỜNG VÀ BỘ SỐ', 'vi_pham', 'Nhân sự nắm giá và chương trình khuyến mãi của đối thủ trong khu vực', 'Nhân sự nắm giá và chương trình khuyến mãi của đối thủ trong khu vực',
  'mgmt', 'quan_ly', 'Bậc 4', 1, 'tr_comm', 178, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_QD5', 'QD5', 'QD', 'THỊ TRƯỜNG VÀ BỘ SỐ', 'vi_pham', 'Nhân sự gửi báo cáo phân tích doanh thu và số liệu bán hàng tuần đúng hạn quy định', 'Nhân sự gửi báo cáo phân tích doanh thu và số liệu bán hàng tuần đúng hạn quy định',
  'mgmt', 'quan_ly', 'Bậc 3', 1, 'tr_comm', 179, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_QE2', 'QE2', 'QE', 'HIỂU NGHỀ CỦA CÁC TUYẾN KHÁC TRONG ĐIỂM BÁN', 'vi_pham', 'Nhân sự hiểu quy trình và điểm nghẽn của tuyến mình đủ để phân việc và nghiệm thu', 'Nhân sự hiểu quy trình và điểm nghẽn của tuyến mình đủ để phân việc và nghiệm thu',
  'mgmt', 'quan_ly', 'Bậc 3', 1, 'tr_comm', 180, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_QE3', 'QE3', 'QE', 'HIỂU NGHỀ CỦA CÁC TUYẾN KHÁC TRONG ĐIỂM BÁN', 'vi_pham', 'Nhân sự nghiệm thu được chất lượng của tuyến Pha chế và tuyến Bếp bánh', 'Nhân sự nghiệm thu được chất lượng của tuyến Pha chế và tuyến Bếp bánh',
  'mgmt', 'quan_ly', 'Bậc 5', 1, 'tr_comm', 181, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_QE4', 'QE4', 'QE', 'HIỂU NGHỀ CỦA CÁC TUYẾN KHÁC TRONG ĐIỂM BÁN', 'vi_pham', 'Nhân sự xử lý được sự cố liên quan nhiều tuyến trong điểm bán', 'Nhân sự xử lý được sự cố liên quan nhiều tuyến trong điểm bán',
  'mgmt', 'quan_ly', 'Bậc 5', 1, 'tr_comm', 182, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_QF1', 'QF1', 'QF', 'NÂNG CHUẨN', 'ghi_nhan', 'Nhân sự phát hiện cách làm hiệu quả trong đơn vị và báo lên', 'Nhân sự phát hiện cách làm hiệu quả trong đơn vị và báo lên',
  'mgmt', 'quan_ly', 'Bậc 3', 1, 'tr_comm', 183, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_QF2', 'QF2', 'QF', 'NÂNG CHUẨN', 'ghi_nhan', 'Nhân sự mô tả lại cách làm đủ rõ để người khác trong bộ phận dùng lại được', 'Nhân sự mô tả lại cách làm đủ rõ để người khác trong bộ phận dùng lại được',
  'mgmt', 'quan_ly', 'Bậc 3', 1, 'tr_comm', 184, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_QF3', 'QF3', 'QF', 'NÂNG CHUẨN', 'ghi_nhan', 'Nhân sự đề xuất chuẩn hoá sang Phòng Vận hành, mô tả đủ rõ để chuẩn hoá được mà không phải hỏi thêm', 'Nhân sự đề xuất chuẩn hóa sang Phòng Vận hành, mô tả đủ rõ để chuẩn hóa được mà không phải hỏi thêm',
  'mgmt', 'quan_ly', 'Bậc 4', 1, 'tr_comm', 185, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_QF4', 'QF4', 'QF', 'NÂNG CHUẨN', 'ghi_nhan', 'Đề xuất của nhân sự được chấp thuận thành chuẩn dùng chung của Công ty', 'Đề xuất của nhân sự được chấp thuận thành chuẩn dùng chung của Công ty',
  'mgmt', 'quan_ly', 'Bậc 4', 1, 'tr_comm', 186, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_QF6', 'QF6', 'QF', 'NÂNG CHUẨN', 'ghi_nhan', 'Nhân sự duyệt bộ giải pháp do ngạch chuyên môn ghép thành bộ dùng chung của Công ty', 'Nhân sự xét duyệt các cách kết hợp nhiều sản phẩm do nhân viên đề xuất, và cho áp dụng chung trong Công ty những cách đạt yêu cầu',
  'mgmt', 'quan_ly', 'Bậc 5', 1, 'tr_comm', 187, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_QH1', 'QH1', 'QH', 'HỎI VÀ LẮNG NGHE TRONG ĐỘI NHÓM', 'vi_pham', 'Nhân sự hỏi mà người trong nhóm không biết nhân sự đang cần làm rõ điều gì', 'Nhân sự hỏi mà người trong nhóm không biết nhân sự đang cần làm rõ điều gì',
  'mgmt', 'quan_ly', 'Bậc 3', 1, 'tr_comm', 188, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_QH3', 'QH3', 'QH', 'HỎI VÀ LẮNG NGHE TRONG ĐỘI NHÓM', 'vi_pham', 'Nhân sự kết luận nguyên nhân trước khi hỏi, nên phải sửa lại kết luận sau', 'Nhân sự nêu nguyên nhân của sự việc khi chưa hỏi người trong cuộc, sau khi hỏi thì phải nói lại khác đi',
  'mgmt', 'quan_ly', 'Bậc 4', 1, 'tr_comm', 189, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_QH5', 'QH5', 'QH', 'HỎI VÀ LẮNG NGHE TRONG ĐỘI NHÓM', 'vi_pham', 'Sau trao đổi, hai bên không thống nhất được bước tiếp theo', 'Sau trao đổi, hai bên không thống nhất được bước tiếp theo',
  'mgmt', 'quan_ly', 'Bậc 4', 1, 'tr_comm', 190, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_QH6', 'QH6', 'QH', 'HỎI VÀ LẮNG NGHE TRONG ĐỘI NHÓM', 'vi_pham', 'Nhân sự không nhận ra dấu hiệu một người trong nhóm đang có việc chưa nói ra', 'Nhân sự không nhận ra dấu hiệu một người trong nhóm đang có việc chưa nói ra',
  'mgmt', 'quan_ly', 'Bậc 5', 1, 'tr_comm', 191, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_QH7', 'QH7', 'QH', 'HỎI VÀ LẮNG NGHE TRONG ĐỘI NHÓM', 'vi_pham', 'Nhân sự không hướng dẫn lại được cách hỏi cho quản lý cấp dưới', 'Nhân sự không hướng dẫn lại được cách hỏi cho quản lý cấp dưới',
  'mgmt', 'quan_ly', 'Bậc 6', 1, 'tr_comm', 192, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_QK1', 'QK1', 'QK', 'THẤU CẢM VỚI NGƯỜI MÌNH PHỤ TRÁCH', 'vi_pham', 'Nhân sự chỉ trao đổi với người trong nhóm khi giao việc hoặc khi cần nhắc về sai sót', 'Nhân sự chỉ trao đổi với người trong nhóm khi giao việc hoặc khi cần nhắc về sai sót',
  'mgmt', 'quan_ly', 'Bậc 3', 1, 'tr_comm', 193, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_QK2', 'QK2', 'QK', 'THẤU CẢM VỚI NGƯỜI MÌNH PHỤ TRÁCH', 'vi_pham', 'Người trong nhóm nêu một khó khăn, nhân sự tiếp nhận nhưng không phản hồi lại hướng xử lý, cũng không nêu lý do chưa xử lý được', 'Người trong nhóm nêu một khó khăn, nhân sự tiếp nhận nhưng không phản hồi lại hướng xử lý, cũng không nêu lý do chưa xử lý được',
  'mgmt', 'quan_ly', 'Bậc 3', 1, 'tr_comm', 194, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_QK3', 'QK3', 'QK', 'THẤU CẢM VỚI NGƯỜI MÌNH PHỤ TRÁCH', 'vi_pham', 'Nhân sự nói sẽ xem xét một đề nghị của người trong nhóm rồi không trả lời lại', 'Nhân sự nói sẽ xem xét một đề nghị của người trong nhóm rồi không trả lời lại',
  'mgmt', 'quan_ly', 'Bậc 3', 1, 'tr_comm', 195, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_QK4', 'QK4', 'QK', 'THẤU CẢM VỚI NGƯỜI MÌNH PHỤ TRÁCH', 'vi_pham', 'Nhân sự không nắm được trở ngại của người trong nhóm, cho tới khi công việc trễ hạn hoặc người đó đề nghị nghỉ việc', 'Nhân sự không nắm được trở ngại của người trong nhóm, cho tới khi công việc trễ hạn hoặc người đó đề nghị nghỉ việc',
  'mgmt', 'quan_ly', 'Bậc 4', 1, 'tr_comm', 196, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_QK5', 'QK5', 'QK', 'THẤU CẢM VỚI NGƯỜI MÌNH PHỤ TRÁCH', 'vi_pham', 'Nhân sự ra quyết định ảnh hưởng trực tiếp tới một người trong nhóm, ví dụ đổi ca hoặc đổi phân công, mà không trao đổi với người đó trước', 'Nhân sự ra quyết định ảnh hưởng trực tiếp tới một người trong nhóm, ví dụ đổi ca hoặc đổi phân công, mà không trao đổi với người đó trước',
  'mgmt', 'quan_ly', 'Bậc 4', 1, 'tr_comm', 197, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_QK6', 'QK6', 'QK', 'THẤU CẢM VỚI NGƯỜI MÌNH PHỤ TRÁCH', 'vi_pham', 'Có thay đổi về cách làm hoặc về phân công, nhân sự thông báo chung mà không trao đổi trước với người chịu ảnh hưởng nhiều nhất', 'Có thay đổi về cách làm hoặc về phân công, nhân sự thông báo chung mà không trao đổi trước với người chịu ảnh hưởng nhiều nhất',
  'mgmt', 'quan_ly', 'Bậc 5', 1, 'tr_comm', 198, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trcomm_QK7', 'QK7', 'QK', 'THẤU CẢM VỚI NGƯỜI MÌNH PHỤ TRÁCH', 'vi_pham', 'Bất đồng kéo dài giữa hai người trong nhóm mà nhân sự không xử lý dứt điểm', 'Bất đồng kéo dài giữa hai người trong nhóm mà nhân sự không xử lý dứt điểm',
  'mgmt', 'quan_ly', 'Bậc 6', 1, 'tr_comm', 199, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N1_1', 'N1.1', 'N1', 'THIẾT KẾ CƠ CẤU TỔ CHỨC VÀ HỆ THỐNG VỊ TRÍ', 'vi_pham', 'Nhân sự dựng được bản mô tả công việc theo khung hiện hành cho một vị trí', 'Nhân sự dựng được bản mô tả công việc theo khung hiện hành cho một vị trí',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 200, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N1_2', 'N1.2', 'N1', 'THIẾT KẾ CƠ CẤU TỔ CHỨC VÀ HỆ THỐNG VỊ TRÍ', 'vi_pham', 'Bản mô tả công việc do nhân sự dựng nêu rõ vị trí đó quyết được gì, báo cáo ai và ai báo cáo mình', 'Bản mô tả công việc do nhân sự dựng nêu rõ vị trí đó quyết được gì, báo cáo ai và ai báo cáo mình',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 201, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N1_3', 'N1.3', 'N1', 'THIẾT KẾ CƠ CẤU TỔ CHỨC VÀ HỆ THỐNG VỊ TRÍ', 'vi_pham', 'Danh mục vị trí và sơ đồ cơ cấu tổ chức khớp nhau, không có vị trí nằm ngoài cơ cấu', 'Danh mục vị trí và sơ đồ cơ cấu tổ chức khớp nhau, không có vị trí nằm ngoài cơ cấu',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 202, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N1_4', 'N1.4', 'N1', 'THIẾT KẾ CƠ CẤU TỔ CHỨC VÀ HỆ THỐNG VỊ TRÍ', 'vi_pham', 'Nhân sự thiết kế được cơ chế giao quyền cho một vị trí', 'Nhân sự thiết kế được cơ chế giao quyền cho một vị trí',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 203, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N1_5', 'N1.5', 'N1', 'THIẾT KẾ CƠ CẤU TỔ CHỨC VÀ HỆ THỐNG VỊ TRÍ', 'vi_pham', 'Bộ tài liệu do nhân sự dựng nhân bản được cho điểm mới mà không phải thiết kế lại', 'Bộ tài liệu do nhân sự dựng nhân bản được cho điểm mới mà không phải thiết kế lại',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 204, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N2_1', 'N2.1', 'N2', 'TUÂN THỦ PHÁP LUẬT LAO ĐỘNG VÀ QUAN HỆ LAO ĐỘNG', 'vi_pham', 'Nhân sự nêu được điều luật và văn bản gốc cho từng nội dung, không dẫn theo trí nhớ', 'Nhân sự nêu được điều luật và văn bản gốc cho từng nội dung, không dẫn theo trí nhớ',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 205, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N2_2', 'N2.2', 'N2', 'TUÂN THỦ PHÁP LUẬT LAO ĐỘNG VÀ QUAN HỆ LAO ĐỘNG', 'vi_pham', 'Hợp đồng lao động, hồ sơ bảo hiểm và hồ sơ thuế do nhân sự lập đúng quy định đang hiệu lực', 'Hợp đồng lao động, hồ sơ bảo hiểm và hồ sơ thuế do nhân sự lập đúng quy định đang hiệu lực',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 206, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N2_3', 'N2.3', 'N2', 'TUÂN THỦ PHÁP LUẬT LAO ĐỘNG VÀ QUAN HỆ LAO ĐỘNG', 'vi_pham', 'Nhân sự thực hiện đúng trình tự luật định khi xử lý kỷ luật lao động', 'Nhân sự thực hiện đúng trình tự luật định khi xử lý kỷ luật lao động',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 207, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N2_4', 'N2.4', 'N2', 'TUÂN THỦ PHÁP LUẬT LAO ĐỘNG VÀ QUAN HỆ LAO ĐỘNG', 'vi_pham', 'Nhân sự phát hiện rủi ro pháp lý trước khi sự việc xảy ra', 'Nhân sự phát hiện rủi ro pháp lý trước khi sự việc xảy ra',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 208, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N2_5', 'N2.5', 'N2', 'TUÂN THỦ PHÁP LUẬT LAO ĐỘNG VÀ QUAN HỆ LAO ĐỘNG', 'vi_pham', 'Nhân sự cập nhật kịp thời khi quy định pháp luật thay đổi', 'Nhân sự cập nhật kịp thời khi quy định pháp luật thay đổi',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 209, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N3_1', 'N3.1', 'N3', 'THIẾT KẾ CƠ CẤU THU NHẬP', 'vi_pham', 'Nhân sự giải thích được vì sao một vị trí ở mức thu nhập đó bằng cấu trúc, không bằng thương lượng từng người', 'Nhân sự giải thích được vì sao một vị trí ở mức thu nhập đó bằng cấu trúc, không bằng thương lượng từng người',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 210, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N3_2', 'N3.2', 'N3', 'THIẾT KẾ CƠ CẤU THU NHẬP', 'vi_pham', 'Cơ cấu thu nhập giải thích được cho người lao động và cho Ban lãnh đạo bằng cùng một bộ số', 'Cơ cấu thu nhập giải thích được cho người lao động và cho Ban lãnh đạo bằng cùng một bộ số',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 211, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N3_3', 'N3.3', 'N3', 'THIẾT KẾ CƠ CẤU THU NHẬP', 'vi_pham', 'Tham số trong công thức tính lương được tách riêng, không nằm lẫn trong công thức', 'Tham số trong công thức tính lương được tách riêng, không nằm lẫn trong công thức',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 212, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N3_4', 'N3.4', 'N3', 'THIẾT KẾ CƠ CẤU THU NHẬP', 'vi_pham', 'Nhân sự tính đúng và không lẫn ba đại lượng quỹ lương, lương gộp và lương thực nhận', 'Nhân sự tính đúng và không lẫn ba đại lượng quỹ lương, lương gộp và lương thực nhận',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 213, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N3_5', 'N3.5', 'N3', 'THIẾT KẾ CƠ CẤU THU NHẬP', 'vi_pham', 'Bảng lương do nhân sự lập không phát sinh khiếu nại về cách tính', 'Bảng lương do nhân sự lập không phát sinh khiếu nại về cách tính',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 214, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N4_1', 'N4.1', 'N4', 'TUYỂN DỤNG VÀ HỘI NHẬP', 'vi_pham', 'Nhân sự dựng được chân dung vị trí trước khi mở tuyển', 'Nhân sự dựng được chân dung vị trí trước khi mở tuyển',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 215, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N4_2', 'N4.2', 'N4', 'TUYỂN DỤNG VÀ HỘI NHẬP', 'vi_pham', 'Nhân sự chọn đúng kênh tuyển cho từng loại vị trí', 'Nhân sự chọn đúng kênh tuyển cho từng loại vị trí',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 216, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N4_3', 'N4.3', 'N4', 'TUYỂN DỤNG VÀ HỘI NHẬP', 'vi_pham', 'Nhận định của nhân sự về ứng viên khi tuyển khớp với kết quả làm việc thực tế sau đó', 'Nhận định của nhân sự về ứng viên khi tuyển khớp với kết quả làm việc thực tế sau đó',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 217, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N4_4', 'N4.4', 'N4', 'TUYỂN DỤNG VÀ HỘI NHẬP', 'vi_pham', 'Nhân sự tổ chức được quá trình hội nhập để người mới vào việc được ngay', 'Nhân sự tổ chức được quá trình hội nhập để người mới vào việc được ngay',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 218, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N4_5', 'N4.5', 'N4', 'TUYỂN DỤNG VÀ HỘI NHẬP', 'vi_pham', 'Người do nhân sự tuyển ở lại sau 90 ngày', 'Người do nhân sự tuyển ở lại sau 90 ngày',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 219, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N5_1', 'N5.1', 'N5', 'ĐÀO TẠO VÀ PHÁT TRIỂN NĂNG LỰC', 'vi_pham', 'Nội dung đào tạo do nhân sự xác định dẫn từ vướng mắc có thật của công việc, không từ giáo trình bên ngoài', 'Nội dung đào tạo do nhân sự xác định dẫn từ vướng mắc có thật của công việc, không từ giáo trình bên ngoài',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 220, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N5_2', 'N5.2', 'N5', 'ĐÀO TẠO VÀ PHÁT TRIỂN NĂNG LỰC', 'vi_pham', 'Nhân sự thu thập được nội dung chuyên môn cần đào tạo từ các phòng chuyên môn', 'Nhân sự dựng được khung và nhịp để nơi nhân viên trực tiếp làm tổ chức được phần đào tạo chuyên môn',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 221, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N5_3', 'N5.3', 'N5', 'ĐÀO TẠO VÀ PHÁT TRIỂN NĂNG LỰC', 'vi_pham', 'Nhân sự thiết kế được chương trình đào tạo nghề dùng chung cho cả Công ty', 'Nhân sự thiết kế được chương trình đào tạo kỹ năng chung, dùng được cho mọi vị trí trong Công ty',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 222, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N5_4', 'N5.4', 'N5', 'ĐÀO TẠO VÀ PHÁT TRIỂN NĂNG LỰC', 'vi_pham', 'Nhân sự thiết kế được chương trình đào tạo văn hoá dùng chung cho cả Công ty', 'Nhân sự thiết kế được chương trình đào tạo văn hóa dùng chung cho cả Công ty',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 223, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N5_5', 'N5.5', 'N5', 'ĐÀO TẠO VÀ PHÁT TRIỂN NĂNG LỰC', 'vi_pham', 'Người được đào tạo tiến bộ đo được so với trước khi đào tạo', 'Người được đào tạo tiến bộ đo được so với trước khi đào tạo',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 224, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N5_6', 'N5.6', 'N5', 'ĐÀO TẠO VÀ PHÁT TRIỂN NĂNG LỰC', 'vi_pham', 'Thời gian một người mới đạt chuẩn nghề rút ngắn so với kỳ trước', 'Thời gian một người mới hoàn tất phần hội nhập và phần đào tạo chung rút ngắn so với kỳ trước',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 225, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N6_1', 'N6.1', 'N6', 'ĐÁNH GIÁ VÀ XẾP BẬC', 'vi_pham', 'Nhân sự dựng được bộ tiêu chí đánh giá cho một chức năng', 'Nhân sự dựng được bộ tiêu chí đánh giá cho một chức năng',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 226, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N6_2', 'N6.2', 'N6', 'ĐÁNH GIÁ VÀ XẾP BẬC', 'vi_pham', 'Bộ tiêu chí do nhân sự dựng đủ rõ để hai người chấm độc lập cho kết quả tương đương', 'Bộ tiêu chí do nhân sự dựng đủ rõ để hai người chấm độc lập cho kết quả tương đương',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 227, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N6_3', 'N6.3', 'N6', 'ĐÁNH GIÁ VÀ XẾP BẬC', 'vi_pham', 'Mỗi kết luận đánh giá dẫn được ra bằng chứng công việc cụ thể', 'Mỗi kết luận đánh giá dẫn được ra bằng chứng công việc cụ thể',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 228, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N6_4', 'N6.4', 'N6', 'ĐÁNH GIÁ VÀ XẾP BẬC', 'vi_pham', 'Hồ sơ đánh giá do nhân sự lập không có ô chấm bằng cảm nhận', 'Hồ sơ đánh giá do nhân sự lập không có ô chấm bằng cảm nhận',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 229, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N6_5', 'N6.5', 'N6', 'ĐÁNH GIÁ VÀ XẾP BẬC', 'vi_pham', 'Kết luận đánh giá không bị rút lại sau khi người được đánh giá nêu ý kiến', 'Kết luận đánh giá không bị rút lại sau khi người được đánh giá nêu ý kiến',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 230, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N7_1', 'N7.1', 'N7', 'TRỤC ĐIẾC-NGHE VÀ CÔNG BẰNG HỆ THỐNG', 'vi_pham', 'Nhân sự nêu được rào cản thật của từng đầu việc đối với người điếc', 'Nhân sự nêu được rào cản thật của từng đầu việc đối với người điếc/ khiếm thính',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 231, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N7_2', 'N7.2', 'N7', 'TRỤC ĐIẾC-NGHE VÀ CÔNG BẰNG HỆ THỐNG', 'vi_pham', 'Nhân sự đề xuất được cách thay thế rào cản đó', 'Nhân sự đề xuất được cách thay thế rào cản đó',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 232, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N7_3', 'N7.3', 'N7', 'TRỤC ĐIẾC-NGHE VÀ CÔNG BẰNG HỆ THỐNG', 'vi_pham', 'Nhân sự soạn được chuẩn giao tiếp nội bộ và chuẩn họp chung cho cả hai cộng đồng', 'Nhân sự soạn được chuẩn giao tiếp nội bộ và chuẩn họp chung cho cả hai cộng đồng',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 233, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N7_4', 'N7.4', 'N7', 'TRỤC ĐIẾC-NGHE VÀ CÔNG BẰNG HỆ THỐNG', 'vi_pham', 'Nhân sự tổ chức được đào tạo song ngữ hai chiều', 'Nhân sự tổ chức được đào tạo song ngữ hai chiều',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 234, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N7_5', 'N7.5', 'N7', 'TRỤC ĐIẾC-NGHE VÀ CÔNG BẰNG HỆ THỐNG', 'vi_pham', 'Nhân sự thiết kế lại được một vị trí do người nói giữ để người điếc đảm nhận được', 'Nhân sự thiết kế lại được một vị trí do người nói giữ để người điếc/ khiếm thính đảm nhận được',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 235, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N7_6', 'N7.6', 'N7', 'TRỤC ĐIẾC-NGHE VÀ CÔNG BẰNG HỆ THỐNG', 'vi_pham', 'Phân bố kết quả đánh giá và ghi nhận giữa hai cộng đồng không lệch vì khả năng nghe nói', 'Phân bố kết quả đánh giá và ghi nhận giữa hai cộng đồng không lệch vì khả năng nghe nói',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 236, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N8_1', 'N8.1', 'N8', 'VĂN HÓA THÀNH CƠ CHẾ SỐNG', 'vi_pham', 'Nhân sự đưa được bộ giá trị của Công ty vào nhịp vận hành hằng ngày, không dừng ở văn bản', 'Nhân sự đưa được bộ giá trị của Công ty vào nhịp vận hành hằng ngày, không dừng ở văn bản',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 237, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N8_2', 'N8.2', 'N8', 'VĂN HÓA THÀNH CƠ CHẾ SỐNG', 'vi_pham', 'Nhân sự vận hành được Chuẩn phản hồi trong Công ty', 'Nhân sự vận hành được Chuẩn phản hồi trong Công ty',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 238, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N8_3', 'N8.3', 'N8', 'VĂN HÓA THÀNH CƠ CHẾ SỐNG', 'vi_pham', 'Nhân sự tổ chức được các nghi lễ nội bộ theo nhịp đã định', 'Nhân sự tổ chức được các nghi lễ nội bộ theo nhịp đã định',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 239, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N8_4', 'N8.4', 'N8', 'VĂN HÓA THÀNH CƠ CHẾ SỐNG', 'vi_pham', 'Sau đợt truyền đạt của nhân sự, người trong Công ty nêu lại được giá trị bằng hành vi cụ thể chứ không bằng khẩu hiệu', 'Sau đợt truyền đạt của nhân sự, người trong Công ty nêu lại được giá trị bằng hành vi cụ thể chứ không bằng khẩu hiệu',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 240, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N8_5', 'N8.5', 'N8', 'VĂN HÓA THÀNH CƠ CHẾ SỐNG', 'vi_pham', 'Phản hồi đi qua kênh chính thức được đóng vòng đúng hạn', 'Phản hồi đi qua kênh chính thức được đóng vòng đúng hạn',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 241, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N9_1', 'N9.1', 'N9', 'ĐỐI TÁC CỦA CÁC BỘ PHẬN', 'vi_pham', 'Nhân sự nắm được tình hình con người của từng bộ phận, không chờ bộ phận báo lên', 'Nhân sự nắm được tình hình con người của từng bộ phận, không chờ bộ phận báo lên',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 242, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N9_2', 'N9.2', 'N9', 'ĐỐI TÁC CỦA CÁC BỘ PHẬN', 'vi_pham', 'Các trưởng bộ phận tìm đến nhân sự khi đang cân nhắc một quyết định chạm tới con người, không phải sau khi đã quyết', 'Các trưởng bộ phận tìm đến nhân sự khi đang cân nhắc một quyết định chạm tới con người, không phải sau khi đã quyết',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 243, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N9_3', 'N9.3', 'N9', 'ĐỐI TÁC CỦA CÁC BỘ PHẬN', 'vi_pham', 'Ý kiến nhân sự đưa ra khi được tham vấn đủ để bộ phận ra quyết định, không phải hỏi thêm vòng hai', 'Ý kiến nhân sự đưa ra khi được tham vấn đủ để bộ phận ra quyết định, không phải hỏi thêm vòng hai',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 244, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N9_4', 'N9.4', 'N9', 'ĐỐI TÁC CỦA CÁC BỘ PHẬN', 'vi_pham', 'Quyết định về con người của các bộ phận không phải làm lại vì bỏ qua bước tham vấn', 'Quyết định về con người của các bộ phận không phải làm lại vì bỏ qua bước tham vấn',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 245, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N10_1', 'N10.1', 'N10', 'THAM MƯU BAN LÃNH ĐẠO', 'vi_pham', 'Phương án nhân sự trình lên có đánh giá tác động', 'Phương án nhân sự trình lên có đánh giá tác động',
  'lv4', 'chuyen_mon', null, 1, 'tr_hr', 246, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N10_2', 'N10.2', 'N10', 'THAM MƯU BAN LÃNH ĐẠO', 'vi_pham', 'Phương án nhân sự trình lên nêu cả mặt trái của chính phương án đó', 'Phương án nhân sự trình lên nêu cả mặt trái của chính phương án đó',
  'lv4', 'chuyen_mon', null, 1, 'tr_hr', 247, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N10_3', 'N10.3', 'N10', 'THAM MƯU BAN LÃNH ĐẠO', 'vi_pham', 'Nhân sự phân biệt rõ trong phương án chỗ nào là số liệu, chỗ nào là ước lượng', 'Nhân sự phân biệt rõ trong phương án chỗ nào là số liệu, chỗ nào là ước lượng',
  'lv4', 'chuyen_mon', null, 1, 'tr_hr', 248, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N10_4', 'N10.4', 'N10', 'THAM MƯU BAN LÃNH ĐẠO', 'vi_pham', 'Phương án nhân sự trình lên được quyết ngay trong buổi, không phải quay lại bổ sung dữ kiện', 'Phương án nhân sự trình lên được quyết ngay trong buổi, không phải quay lại bổ sung dữ kiện',
  'lv4', 'chuyen_mon', null, 1, 'tr_hr', 249, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N10_5', 'N10.5', 'N10', 'THAM MƯU BAN LÃNH ĐẠO', 'vi_pham', 'Phương án nhân sự đã trình vẫn đứng vững khi nhìn lại sau một kỳ', 'Phương án nhân sự đã trình vẫn đứng vững khi nhìn lại sau một kỳ',
  'lv4', 'chuyen_mon', null, 1, 'tr_hr', 250, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N11_1', 'N11.1', 'N11', 'DỮ LIỆU NHÂN SỰ, BẢO MẬT VÀ RA QUYẾT ĐỊNH BẰNG SỐ', 'vi_pham', 'Dữ liệu nhân sự được tập trung một nơi, không tồn tại hai bản ở hai chỗ', 'Dữ liệu nhân sự được tập trung một nơi, không tồn tại hai bản ở hai chỗ',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 251, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N11_2', 'N11.2', 'N11', 'DỮ LIỆU NHÂN SỰ, BẢO MẬT VÀ RA QUYẾT ĐỊNH BẰNG SỐ', 'vi_pham', 'Nhân sự phân quyền truy cập dữ liệu theo vai và có lưu vết', 'Nhân sự phân quyền truy cập dữ liệu theo vai và có lưu vết',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 252, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N11_3', 'N11.3', 'N11', 'DỮ LIỆU NHÂN SỰ, BẢO MẬT VÀ RA QUYẾT ĐỊNH BẰNG SỐ', 'vi_pham', 'Kết luận nhân sự rút từ số liệu vẫn đúng khi kiểm lại ở kỳ sau', 'Kết luận nhân sự rút từ số liệu vẫn đúng khi kiểm lại ở kỳ sau',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 253, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N11_4', 'N11.4', 'N11', 'DỮ LIỆU NHÂN SỰ, BẢO MẬT VÀ RA QUYẾT ĐỊNH BẰNG SỐ', 'vi_pham', 'Đề xuất của nhân sự về con người có căn cứ số liệu, không dẫn từ cảm nhận', 'Đề xuất của nhân sự về con người có căn cứ số liệu, không dẫn từ cảm nhận',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 254, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_N11_5', 'N11.5', 'N11', 'DỮ LIỆU NHÂN SỰ, BẢO MẬT VÀ RA QUYẾT ĐỊNH BẰNG SỐ', 'vi_pham', 'Không xảy ra sự cố lộ dữ liệu trong phạm vi nhân sự quản lý', 'Không xảy ra sự cố lộ dữ liệu trong phạm vi nhân sự quản lý',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 255, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_HC1_1', 'HC1.1', 'HC1', 'VĂN THƯ, LƯU TRỮ VÀ KHO LƯU TRỮ SỐ', 'vi_pham', 'Văn bản do nhân sự soạn đúng thể thức ngay lần đầu', 'Văn bản do nhân sự soạn đúng thể thức ngay lần đầu',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 256, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_HC1_2', 'HC1.2', 'HC1', 'VĂN THƯ, LƯU TRỮ VÀ KHO LƯU TRỮ SỐ', 'vi_pham', 'Văn bản ban hành được đánh số, lưu và tra lại được', 'Văn bản ban hành được đánh số, lưu và tra lại được',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 257, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_HC1_3', 'HC1.3', 'HC1', 'VĂN THƯ, LƯU TRỮ VÀ KHO LƯU TRỮ SỐ', 'vi_pham', 'Kho lưu trữ số có cấu trúc thư mục và quy ước đặt tên thống nhất', 'Kho lưu trữ số có cấu trúc thư mục và quy ước đặt tên thống nhất',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 258, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_HC1_4', 'HC1.4', 'HC1', 'VĂN THƯ, LƯU TRỮ VÀ KHO LƯU TRỮ SỐ', 'vi_pham', 'Kho lưu trữ số được phân quyền theo vai và có nhịp rà định kỳ', 'Kho lưu trữ số được phân quyền theo vai và có nhịp rà định kỳ',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 259, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_HC1_5', 'HC1.5', 'HC1', 'VĂN THƯ, LƯU TRỮ VÀ KHO LƯU TRỮ SỐ', 'vi_pham', 'Người ở phòng khác tự tìm được tài liệu thuộc quyền xem của mình mà không phải hỏi', 'Người ở phòng khác tự tìm được tài liệu thuộc quyền xem của mình mà không phải hỏi',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 260, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_HC1_6', 'HC1.6', 'HC1', 'VĂN THƯ, LƯU TRỮ VÀ KHO LƯU TRỮ SỐ', 'vi_pham', 'Không tồn tại hai bản của cùng một tài liệu ở hai nơi khác nhau', 'Không tồn tại hai bản của cùng một tài liệu ở hai nơi khác nhau',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 261, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_HC4_1', 'HC4.1', 'HC4', 'TÀI SẢN, TRANG THIẾT BỊ VÀ KHÔNG GIAN LÀM VIỆC', 'vi_pham', 'Tài sản có danh mục, có người chịu trách nhiệm và có nhịp kiểm kê', 'Tài sản có danh mục, có người chịu trách nhiệm và có nhịp kiểm kê',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 262, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_HC4_2', 'HC4.2', 'HC4', 'TÀI SẢN, TRANG THIẾT BỊ VÀ KHÔNG GIAN LÀM VIỆC', 'vi_pham', 'Danh mục tài sản khớp với thực tế khi kiểm đột xuất', 'Danh mục tài sản khớp với thực tế khi kiểm đột xuất',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 263, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_HC4_3', 'HC4.3', 'HC4', 'TÀI SẢN, TRANG THIẾT BỊ VÀ KHÔNG GIAN LÀM VIỆC', 'vi_pham', 'Nhân sự xử lý yêu cầu về trang thiết bị trong thời hạn đã định', 'Nhân sự xử lý yêu cầu về trang thiết bị trong thời hạn đã định',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 264, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_HC4_4', 'HC4.4', 'HC4', 'TÀI SẢN, TRANG THIẾT BỊ VÀ KHÔNG GIAN LÀM VIỆC', 'vi_pham', 'Không gian làm việc đủ điều kiện cho cả hai cộng đồng ngôn ngữ', 'Không gian làm việc đủ điều kiện cho cả hai cộng đồng ngôn ngữ',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 265, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_HC5_1', 'HC5.1', 'HC5', 'CHI PHÍ HÀNH CHÍNH VÀ MUA SẮM NỘI BỘ', 'vi_pham', 'Khoản chi hành chính có căn cứ và có so sánh ít nhất hai phương án', 'Khoản chi hành chính có căn cứ và có so sánh ít nhất hai phương án',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 266, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_HC5_2', 'HC5.2', 'HC5', 'CHI PHÍ HÀNH CHÍNH VÀ MUA SẮM NỘI BỘ', 'vi_pham', 'Phương án mua sắm nhân sự trình lên được duyệt mà không phải cắt gọt lớn', 'Phương án mua sắm nhân sự trình lên được duyệt mà không phải cắt gọt lớn',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 267, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_HC5_3', 'HC5.3', 'HC5', 'CHI PHÍ HÀNH CHÍNH VÀ MUA SẮM NỘI BỘ', 'vi_pham', 'Nhân sự dừng đúng lúc khi một khoản chi không ra kết quả', 'Nhân sự dừng đúng lúc khi một khoản chi không ra kết quả',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 268, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_HC5_4', 'HC5.4', 'HC5', 'CHI PHÍ HÀNH CHÍNH VÀ MUA SẮM NỘI BỘ', 'vi_pham', 'Chi phí hành chính trên đầu người không tăng qua các kỳ khi quy mô không đổi', 'Chi phí hành chính trên đầu người không tăng qua các kỳ khi quy mô không đổi',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 269, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_HC6_1', 'HC6.1', 'HC6', 'THÔNG TIN NỘI BỘ VÀ SỰ KIỆN NỘI BỘ', 'vi_pham', 'Thông báo tới được mọi nhân sự cùng lúc và cùng nội dung', 'Thông báo tới được mọi nhân sự cùng lúc và cùng nội dung',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 270, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_HC6_2', 'HC6.2', 'HC6', 'THÔNG TIN NỘI BỘ VÀ SỰ KIỆN NỘI BỘ', 'vi_pham', 'Người điếc và nhân sự ở xa trung tâm nhận được thông tin cùng thời điểm với người khác', 'Người điếc/ khiếm thính và nhân sự ở xa trung tâm nhận được thông tin cùng thời điểm với người khác',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 271, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_HC6_3', 'HC6.3', 'HC6', 'THÔNG TIN NỘI BỘ VÀ SỰ KIỆN NỘI BỘ', 'vi_pham', 'Nhân sự kiểm tra lại mức độ nắm chính sách mới sau khi ban hành', 'Nhân sự kiểm tra lại mức độ nắm chính sách mới sau khi ban hành',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 272, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_HC6_4', 'HC6.4', 'HC6', 'THÔNG TIN NỘI BỘ VÀ SỰ KIỆN NỘI BỘ', 'vi_pham', 'Sự kiện nội bộ được tổ chức theo nhịp đã định', 'Sự kiện nội bộ được tổ chức theo nhịp đã định',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 273, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_HC6_5', 'HC6.5', 'HC6', 'THÔNG TIN NỘI BỘ VÀ SỰ KIỆN NỘI BỘ', 'vi_pham', 'Nội dung thông báo do nhân sự soạn không phải đính chính sau khi phát ra', 'Nội dung thông báo do nhân sự soạn không phải đính chính sau khi phát ra',
  'all', 'chuyen_mon', null, 1, 'tr_hr', 274, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_pc1_1', 'PC1.1', 'PC1', 'VĂN BẢN NỘI BỘ VÀ HIỆU LỰC THI HÀNH', 'vi_pham', null, 'Văn bản nội bộ do nhân sự soạn có đủ các nội dung mà pháp luật buộc phải có',
  'all', 'chuyen_mon', null, null, 'tr_hr', 275, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_pc1_2', 'PC1.2', 'PC1', 'VĂN BẢN NỘI BỘ VÀ HIỆU LỰC THI HÀNH', 'vi_pham', null, 'Nhân sự đưa văn bản đi đủ các bước lấy ý kiến, đăng ký và thông báo trước khi văn bản có hiệu lực',
  'all', 'chuyen_mon', null, null, 'tr_hr', 276, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_pc1_3', 'PC1.3', 'PC1', 'VĂN BẢN NỘI BỘ VÀ HIỆU LỰC THI HÀNH', 'vi_pham', null, 'Nhân sự nêu được điều luật cho từng ngưỡng, thời hạn và tỷ lệ ghi trong văn bản',
  'all', 'chuyen_mon', null, null, 'tr_hr', 277, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_pc1_4', 'PC1.4', 'PC1', 'VĂN BẢN NỘI BỘ VÀ HIỆU LỰC THI HÀNH', 'vi_pham', null, 'Nhân sự chuyển văn bản do chính phòng mình soạn sang một bên thẩm định độc lập trước khi trình ký',
  'lv4', 'chuyen_mon', null, null, 'tr_hr', 278, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_pc1_5', 'PC1.5', 'PC1', 'VĂN BẢN NỘI BỘ VÀ HIỆU LỰC THI HÀNH', 'vi_pham', null, 'Văn bản đã ban hành không phải sửa lại vì sai quy định',
  'all', 'chuyen_mon', null, null, 'tr_hr', 279, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_pc2_1', 'PC2.1', 'PC2', 'HỒ SƠ PHÁP NHÂN, CON DẤU VÀ GIẤY PHÉP', 'vi_pham', null, 'Con dấu được quản lý có kiểm soát và có lưu vết mỗi lần sử dụng',
  'all', 'chuyen_mon', null, null, 'tr_hr', 280, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_pc2_2', 'PC2.2', 'PC2', 'HỒ SƠ PHÁP NHÂN, CON DẤU VÀ GIẤY PHÉP', 'vi_pham', null, 'Hồ sơ pháp nhân đủ, còn hiệu lực và tra ra được khi cần',
  'all', 'chuyen_mon', null, null, 'tr_hr', 281, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_pc2_3', 'PC2.3', 'PC2', 'HỒ SƠ PHÁP NHÂN, CON DẤU VÀ GIẤY PHÉP', 'vi_pham', null, 'Nhân sự nắm danh mục giấy phép Công ty đang giữ, kèm ngày hết hiệu lực của từng giấy',
  'all', 'chuyen_mon', null, null, 'tr_hr', 282, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_pc2_4', 'PC2.4', 'PC2', 'HỒ SƠ PHÁP NHÂN, CON DẤU VÀ GIẤY PHÉP', 'vi_pham', null, 'Nhân sự khởi động thủ tục gia hạn trước khi giấy phép hết hiệu lực',
  'all', 'chuyen_mon', null, null, 'tr_hr', 283, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_pc2_5', 'PC2.5', 'PC2', 'HỒ SƠ PHÁP NHÂN, CON DẤU VÀ GIẤY PHÉP', 'vi_pham', null, 'Thay đổi về pháp nhân được đăng ký với cơ quan nhà nước trong thời hạn luật định',
  'all', 'chuyen_mon', null, null, 'tr_hr', 284, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_pc3_1', 'PC3.1', 'PC3', 'HỢP ĐỒNG VÀ THỎA THUẬN', 'vi_pham', null, 'Hợp đồng có mẫu chuẩn và được lưu tập trung một nơi',
  'all', 'chuyen_mon', null, null, 'tr_hr', 285, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_pc3_2', 'PC3.2', 'PC3', 'HỢP ĐỒNG VÀ THỎA THUẬN', 'vi_pham', null, 'Nhân sự theo dõi được thời hạn và nghĩa vụ của từng hợp đồng',
  'all', 'chuyen_mon', null, null, 'tr_hr', 286, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_pc3_3', 'PC3.3', 'PC3', 'HỢP ĐỒNG VÀ THỎA THUẬN', 'vi_pham', null, 'Nhân sự phát hiện điều khoản bất lợi ở khâu rà, trước khi ký',
  'all', 'chuyen_mon', null, null, 'tr_hr', 287, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_pc3_4', 'PC3.4', 'PC3', 'HỢP ĐỒNG VÀ THỎA THUẬN', 'vi_pham', null, 'Thỏa thuận bảo mật và biểu mẫu ký với khách hàng do nhân sự soạn đúng quy định đang hiệu lực',
  'all', 'chuyen_mon', null, null, 'tr_hr', 288, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_pc3_5', 'PC3.5', 'PC3', 'HỢP ĐỒNG VÀ THỎA THUẬN', 'vi_pham', null, 'Không có hợp đồng nào quá hạn mà không ai biết',
  'all', 'chuyen_mon', null, null, 'tr_hr', 289, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_pc3_6', 'PC3.6', 'PC3', 'HỢP ĐỒNG VÀ THỎA THUẬN', 'vi_pham', null, 'Không phát sinh vụ việc từ điều khoản đã ký',
  'all', 'chuyen_mon', null, null, 'tr_hr', 290, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_pc4_1', 'PC4.1', 'PC4', 'TUÂN THỦ CHUYÊN NGÀNH VÀ DỮ LIỆU CÁ NHÂN', 'vi_pham', null, 'Nhân sự nêu được nghĩa vụ pháp lý của từng ngành nghề Công ty đang đăng ký',
  'all', 'chuyen_mon', null, null, 'tr_hr', 291, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_pc4_2', 'PC4.2', 'PC4', 'TUÂN THỦ CHUYÊN NGÀNH VÀ DỮ LIỆU CÁ NHÂN', 'vi_pham', null, 'Nhân sự rà nội dung quảng cáo và nhãn sản phẩm trước khi phát ra bên ngoài',
  'all', 'chuyen_mon', null, null, 'tr_hr', 292, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_pc4_3', 'PC4.3', 'PC4', 'TUÂN THỦ CHUYÊN NGÀNH VÀ DỮ LIỆU CÁ NHÂN', 'vi_pham', null, 'Nhân sự lập được hồ sơ về việc xử lý dữ liệu cá nhân theo quy định đang hiệu lực',
  'all', 'chuyen_mon', null, null, 'tr_hr', 293, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_pc4_4', 'PC4.4', 'PC4', 'TUÂN THỦ CHUYÊN NGÀNH VÀ DỮ LIỆU CÁ NHÂN', 'vi_pham', null, 'Nhân sự nhận ra quy định mới của ngành trước mốc nó có hiệu lực, và nêu việc phải làm kèm thời hạn',
  'all', 'chuyen_mon', null, null, 'tr_hr', 294, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_pc4_5', 'PC4.5', 'PC4', 'TUÂN THỦ CHUYÊN NGÀNH VÀ DỮ LIỆU CÁ NHÂN', 'vi_pham', null, 'Không phát sinh xử phạt hành chính trong phạm vi nhân sự phụ trách',
  'all', 'chuyen_mon', null, null, 'tr_hr', 295, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_pc5_1', 'PC5.1', 'PC5', 'ĐẦU MỐI LUẬT SƯ VÀ XỬ LÝ VỤ VIỆC', 'vi_pham', null, 'Nhân sự chuẩn bị đủ câu hỏi và tài liệu để buổi tư vấn với luật sư ra kết luận dùng được ngay',
  'all', 'chuyen_mon', null, null, 'tr_hr', 296, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_pc5_2', 'PC5.2', 'PC5', 'ĐẦU MỐI LUẬT SƯ VÀ XỬ LÝ VỤ VIỆC', 'vi_pham', null, 'Vấn đề pháp lý nhân sự nêu ra được xử lý dứt điểm, không phải hỏi vòng thứ hai',
  'all', 'chuyen_mon', null, null, 'tr_hr', 297, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_pc5_3', 'PC5.3', 'PC5', 'ĐẦU MỐI LUẬT SƯ VÀ XỬ LÝ VỤ VIỆC', 'vi_pham', null, 'Nhân sự phân biệt được việc tự xử lý được và việc phải đưa ra luật sư',
  'all', 'chuyen_mon', null, null, 'tr_hr', 298, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_pc5_4', 'PC5.4', 'PC5', 'ĐẦU MỐI LUẬT SƯ VÀ XỬ LÝ VỤ VIỆC', 'vi_pham', null, 'Nhân sự lập và giữ hồ sơ của từng vụ việc pháp lý, đủ để người khác đọc lại và làm tiếp được',
  'all', 'chuyen_mon', null, null, 'tr_hr', 299, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_Q1_1', 'Q1.1', 'Q1', 'TỔ CHỨC CÔNG VIỆC CỦA ĐƠN VỊ', 'vi_pham', 'Nhân sự tổ chức được công việc trong phạm vi đơn vị mình phụ trách', 'Nhân sự tổ chức được công việc trong phạm vi đơn vị mình phụ trách',
  'all', 'quan_ly', null, 1, 'tr_hr', 300, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_Q1_2', 'Q1.2', 'Q1', 'TỔ CHỨC CÔNG VIỆC CỦA ĐƠN VỊ', 'vi_pham', 'Công việc của đơn vị có quy trình và biểu mẫu, không phụ thuộc trí nhớ của người phụ trách', 'Công việc của đơn vị có quy trình và biểu mẫu, không phụ thuộc trí nhớ của người phụ trách',
  'all', 'quan_ly', null, 1, 'tr_hr', 301, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_Q1_3', 'Q1.3', 'Q1', 'TỔ CHỨC CÔNG VIỆC CỦA ĐƠN VỊ', 'vi_pham', 'Nhân sự phân việc trong đơn vị theo năng lực thật của từng người, giải thích được bằng căn cứ chứ không chia đều', 'Nhân sự phân việc trong đơn vị theo năng lực thật của từng người, giải thích được bằng căn cứ chứ không chia đều',
  'all', 'quan_ly', null, 1, 'tr_hr', 302, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_Q1_4', 'Q1.4', 'Q1', 'TỔ CHỨC CÔNG VIỆC CỦA ĐƠN VỊ', 'vi_pham', 'Người khác tiếp nhận và làm tiếp được một mảng việc dựa trên tài liệu sẵn có', 'Người khác tiếp nhận và làm tiếp được một mảng việc dựa trên tài liệu sẵn có',
  'lv4', 'quan_ly', null, 1, 'tr_hr', 303, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_Q1_5', 'Q1.5', 'Q1', 'TỔ CHỨC CÔNG VIỆC CỦA ĐƠN VỊ', 'vi_pham', 'Công việc của đơn vị không đứng lại khi người phụ trách vắng mặt', 'Công việc của đơn vị không đứng lại khi người phụ trách vắng mặt',
  'lv4', 'quan_ly', null, 1, 'tr_hr', 304, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_Q2_1', 'Q2.1', 'Q2', 'CHỦ TRÌ CÔNG VIỆC LIÊN PHÒNG', 'vi_pham', 'Nhân sự lập được kế hoạch có mốc, người phụ trách và nguồn lực cho từng nhánh', 'Nhân sự lập được kế hoạch có mốc, người phụ trách và nguồn lực cho từng nhánh',
  'all', 'quan_ly', null, 1, 'tr_hr', 305, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_Q2_2', 'Q2.2', 'Q2', 'CHỦ TRÌ CÔNG VIỆC LIÊN PHÒNG', 'vi_pham', 'Mốc của công việc liên phòng đạt đúng hạn', 'Mốc của công việc liên phòng đạt đúng hạn',
  'all', 'quan_ly', null, 1, 'tr_hr', 306, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_Q2_3', 'Q2.3', 'Q2', 'CHỦ TRÌ CÔNG VIỆC LIÊN PHÒNG', 'vi_pham', 'Nhân sự là đầu mối các phòng tìm đến khi việc liên quan nhiều bên', 'Nhân sự là đầu mối các phòng tìm đến khi việc liên quan nhiều bên',
  'lv4', 'quan_ly', null, 1, 'tr_hr', 307, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_Q2_4', 'Q2.4', 'Q2', 'CHỦ TRÌ CÔNG VIỆC LIÊN PHÒNG', 'vi_pham', 'Nhân sự điều phối được các phòng khác bằng lập luận và bằng quyết định giao nhiệm vụ đã có', 'Nhân sự điều phối được các phòng khác bằng lập luận và bằng quyết định giao nhiệm vụ đã có',
  'lv6', 'quan_ly', null, 1, 'tr_hr', 308, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_Q2_5', 'Q2.5', 'Q2', 'CHỦ TRÌ CÔNG VIỆC LIÊN PHÒNG', 'vi_pham', 'Các nhánh chạy đúng nhịp mà không cần nhắc từng tuần và không phải nhờ Ban lãnh đạo can thiệp', 'Các nhánh chạy đúng nhịp mà không cần nhắc từng tuần và không phải nhờ Ban lãnh đạo can thiệp',
  'lv6', 'quan_ly', null, 1, 'tr_hr', 309, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_Q3_1', 'Q3.1', 'Q3', 'CHUẨN HÓA VIỆC LẶP LẠI VÀ NÂNG CHUẨN', 'vi_pham', 'Nhân sự nhận ra việc lặp lại và viết thành quy trình, biểu mẫu hoặc công cụ', 'Nhân sự nhận ra việc lặp lại và viết thành quy trình, biểu mẫu hoặc công cụ',
  'all', 'quan_ly', null, 1, 'tr_hr', 310, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_Q3_2', 'Q3.2', 'Q3', 'CHUẨN HÓA VIỆC LẶP LẠI VÀ NÂNG CHUẨN', 'vi_pham', 'Người mới làm được theo tài liệu do nhân sự viết mà không phải hỏi lại', 'Người mới làm được theo tài liệu do nhân sự viết mà không phải hỏi lại',
  'all', 'quan_ly', null, 1, 'tr_hr', 311, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_Q3_3', 'Q3.3', 'Q3', 'CHUẨN HÓA VIỆC LẶP LẠI VÀ NÂNG CHUẨN', 'vi_pham', 'Mỗi dữ liệu dùng chung chỉ có một nguồn duy nhất', 'Mỗi dữ liệu dùng chung chỉ có một nguồn duy nhất',
  'all', 'quan_ly', null, 1, 'tr_hr', 312, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_Q3_4', 'Q3.4', 'Q3', 'CHUẨN HÓA VIỆC LẶP LẠI VÀ NÂNG CHUẨN', 'vi_pham', 'Không phát hiện cùng một dữ liệu bị lệch giữa hai nơi', 'Không phát hiện cùng một dữ liệu bị lệch giữa hai nơi',
  'all', 'quan_ly', null, 1, 'tr_hr', 313, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_Q3_5', 'Q3.5', 'Q3', 'CHUẨN HÓA VIỆC LẶP LẠI VÀ NÂNG CHUẨN', 'vi_pham', 'Đề xuất chuẩn hoá của nhân sự được chấp thuận thành chuẩn dùng chung của Công ty', 'Đề xuất chuẩn hóa của nhân sự được chấp thuận thành chuẩn dùng chung của Công ty',
  'lv4', 'quan_ly', null, 1, 'tr_hr', 314, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_Q4_1', 'Q4.1', 'Q4', 'ĐẶT MỤC TIÊU VÀ PHÂN BỔ NGUỒN LỰC', 'vi_pham', 'Nhân sự đặt được mục tiêu cho đơn vị hoặc cho dự án đủ năm yếu tố SMART', 'Nhân sự đặt được mục tiêu cho đơn vị hoặc cho dự án đủ năm yếu tố SMART',
  'all', 'quan_ly', null, 1, 'tr_hr', 315, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_Q4_2', 'Q4.2', 'Q4', 'ĐẶT MỤC TIÊU VÀ PHÂN BỔ NGUỒN LỰC', 'vi_pham', 'Nhân sự phân bổ nguồn lực giữa các đầu việc theo thứ tự ưu tiên giải thích được bằng căn cứ', 'Nhân sự phân bổ nguồn lực giữa các đầu việc theo thứ tự ưu tiên giải thích được bằng căn cứ',
  'all', 'quan_ly', null, 1, 'tr_hr', 316, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_Q4_3', 'Q4.3', 'Q4', 'ĐẶT MỤC TIÊU VÀ PHÂN BỔ NGUỒN LỰC', 'vi_pham', 'Thứ tự ưu tiên của đơn vị giữ được khi có việc khẩn cấp chen vào', 'Thứ tự ưu tiên của đơn vị giữ được khi có việc khẩn cấp chen vào',
  'all', 'quan_ly', null, 1, 'tr_hr', 317, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_Q4_4', 'Q4.4', 'Q4', 'ĐẶT MỤC TIÊU VÀ PHÂN BỔ NGUỒN LỰC', 'vi_pham', 'Mốc quan trọng của đơn vị đạt đúng hạn kể cả khi trong kỳ có việc phát sinh', 'Mốc quan trọng của đơn vị đạt đúng hạn kể cả khi trong kỳ có việc phát sinh',
  'all', 'quan_ly', null, 1, 'tr_hr', 318, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_Q5_1', 'Q5.1', 'Q5', 'PHÁT TRIỂN ĐỘI NGŨ', 'vi_pham', 'Nhân sự kèm người mới của đơn vị theo nội dung đã có', 'Nhân sự kèm người mới của đơn vị theo nội dung đã có',
  'all', 'quan_ly', null, 1, 'tr_hr', 319, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_Q5_2', 'Q5.2', 'Q5', 'PHÁT TRIỂN ĐỘI NGŨ', 'vi_pham', 'Nhân sự nhận ra người trong đơn vị đang mắc ở đâu và tổ chức được cách gỡ', 'Nhân sự nhận ra người trong đơn vị đang mắc ở đâu và tổ chức được cách gỡ',
  'all', 'quan_ly', null, 1, 'tr_hr', 320, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_Q5_3', 'Q5.3', 'Q5', 'PHÁT TRIỂN ĐỘI NGŨ', 'vi_pham', 'Người được nhân sự kèm tự làm được việc sau thời gian kèm', 'Người được nhân sự kèm tự làm được việc sau thời gian kèm',
  'all', 'quan_ly', null, 1, 'tr_hr', 321, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_Q5_4', 'Q5.4', 'Q5', 'PHÁT TRIỂN ĐỘI NGŨ', 'vi_pham', 'Thời gian một người mới của đơn vị đạt chuẩn công việc rút ngắn so với kỳ trước', 'Thời gian một người mới của đơn vị đạt chuẩn công việc rút ngắn so với kỳ trước',
  'lv4', 'quan_ly', null, 1, 'tr_hr', 322, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_Q6_1', 'Q6.1', 'Q6', 'GIỮ CHUẨN VÀ XỬ LÝ VI PHẠM', 'vi_pham', 'Nhân sự nhắc và chặn tại chỗ khi thấy hành vi vượt ranh giới, và báo lên đúng người', 'Nhân sự nhắc và chặn tại chỗ khi thấy hành vi vượt ranh giới, và báo lên đúng người',
  'all', 'quan_ly', null, 1, 'tr_hr', 323, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_Q6_2', 'Q6.2', 'Q6', 'GIỮ CHUẨN VÀ XỬ LÝ VI PHẠM', 'vi_pham', 'Nhân sự kiểm tra chủ động và xử lý vi phạm theo đúng thang', 'Nhân sự kiểm tra chủ động và xử lý vi phạm theo đúng thang',
  'all', 'quan_ly', null, 1, 'tr_hr', 324, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_Q6_3', 'Q6.3', 'Q6', 'GIỮ CHUẨN VÀ XỬ LÝ VI PHẠM', 'vi_pham', 'Nhân sự ghi nhận hành vi đúng chuẩn kể cả khi hành vi đó làm giảm kết quả ngắn hạn', 'Nhân sự ghi nhận hành vi đúng chuẩn kể cả khi hành vi đó làm giảm kết quả ngắn hạn',
  'all', 'quan_ly', null, 1, 'tr_hr', 325, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_Q7_1', 'Q7.1', 'Q7', 'NGÂN SÁCH VÀ CHI PHÍ CỦA ĐƠN VỊ', 'vi_pham', 'Phương án chi của nhân sự có căn cứ cho từng khoản', 'Phương án chi của nhân sự có căn cứ cho từng khoản',
  'all', 'quan_ly', null, 1, 'tr_hr', 326, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_Q7_2', 'Q7.2', 'Q7', 'NGÂN SÁCH VÀ CHI PHÍ CỦA ĐƠN VỊ', 'vi_pham', 'Nhân sự tách phần không tốn chi phí ra làm trước', 'Nhân sự tách phần không tốn chi phí ra làm trước',
  'all', 'quan_ly', null, 1, 'tr_hr', 327, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_Q7_3', 'Q7.3', 'Q7', 'NGÂN SÁCH VÀ CHI PHÍ CỦA ĐƠN VỊ', 'vi_pham', 'Nhân sự dừng đúng lúc khi một khoản chi không ra kết quả', 'Nhân sự dừng đúng lúc khi một khoản chi không ra kết quả',
  'all', 'quan_ly', null, 1, 'tr_hr', 328, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_Q7_4', 'Q7.4', 'Q7', 'NGÂN SÁCH VÀ CHI PHÍ CỦA ĐƠN VỊ', 'vi_pham', 'Phương án nhân sự trình lên được duyệt mà không phải cắt gọt lớn', 'Phương án nhân sự trình lên được duyệt mà không phải cắt gọt lớn',
  'lv4', 'quan_ly', null, 1, 'tr_hr', 329, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_Q7_5', 'Q7.5', 'Q7', 'NGÂN SÁCH VÀ CHI PHÍ CỦA ĐƠN VỊ', 'vi_pham', 'Kết quả của từng khoản chi khớp với phương án đã trình', 'Kết quả của từng khoản chi khớp với phương án đã trình',
  'lv4', 'quan_ly', null, 1, 'tr_hr', 330, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_Q8_1', 'Q8.1', 'Q8', 'ĐIỀU CHỈNH KHI ĐIỀU KIỆN ĐỔI', 'vi_pham', 'Nhân sự điều chỉnh được cách tổ chức khi mục tiêu hoặc điều kiện thay đổi', 'Nhân sự điều chỉnh được cách tổ chức khi mục tiêu hoặc điều kiện thay đổi',
  'all', 'quan_ly', null, 1, 'tr_hr', 331, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_Q8_2', 'Q8.2', 'Q8', 'ĐIỀU CHỈNH KHI ĐIỀU KIỆN ĐỔI', 'vi_pham', 'Nhân sự bảo vệ được lập luận khi đề xuất bị phản biện', 'Nhân sự bảo vệ được lập luận khi đề xuất bị phản biện',
  'all', 'quan_ly', null, 1, 'tr_hr', 332, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_Q8_3', 'Q8.3', 'Q8', 'ĐIỀU CHỈNH KHI ĐIỀU KIỆN ĐỔI', 'vi_pham', 'Cách làm đã đổi cho kết quả tốt hơn trước khi đổi', 'Cách làm đã đổi cho kết quả tốt hơn trước khi đổi',
  'all', 'quan_ly', null, 1, 'tr_hr', 333, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_Q8_4', 'Q8.4', 'Q8', 'ĐIỀU CHỈNH KHI ĐIỀU KIỆN ĐỔI', 'vi_pham', 'Nhân sự đề xuất được thay đổi vượt ra ngoài phạm vi đơn vị mình', 'Nhân sự đề xuất được thay đổi vượt ra ngoài phạm vi đơn vị mình',
  'lv6', 'quan_ly', null, 1, 'tr_hr', 334, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_Q8_5', 'Q8.5', 'Q8', 'ĐIỀU CHỈNH KHI ĐIỀU KIỆN ĐỔI', 'vi_pham', 'Đề xuất phạm vi rộng của nhân sự được chấp thuận', 'Đề xuất phạm vi rộng của nhân sự được chấp thuận',
  'lv6', 'quan_ly', null, 1, 'tr_hr', 335, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_Q9_1', 'Q9.1', 'Q9', 'THỰC THI QUYỀN CHỨC NĂNG TRÊN TOÀN CÔNG TY', 'vi_pham', 'Nhân sự nắm được tình hình con người của các đơn vị không thuộc quyền trực tuyến của mình', 'Nhân sự nắm được tình hình con người của các đơn vị không thuộc quyền trực tuyến của mình',
  'all', 'quan_ly', null, 1, 'tr_hr', 336, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_Q9_2', 'Q9.2', 'Q9', 'THỰC THI QUYỀN CHỨC NĂNG TRÊN TOÀN CÔNG TY', 'vi_pham', 'Khi một đơn vị làm chưa đúng chuẩn nhân sự hoặc chuẩn hành chính, nhân sự trao đổi với người phụ trách đơn vị đó và việc được chỉnh', 'Khi một đơn vị làm chưa đúng chuẩn nhân sự hoặc chuẩn hành chính, nhân sự trao đổi với người phụ trách đơn vị đó và việc được chỉnh',
  'all', 'quan_ly', null, 1, 'tr_hr', 337, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_Q9_3', 'Q9.3', 'Q9', 'THỰC THI QUYỀN CHỨC NĂNG TRÊN TOÀN CÔNG TY', 'vi_pham', 'Nhân sự chủ trì xử lý vụ việc về con người của đơn vị khác cùng người phụ trách đơn vị đó', 'Nhân sự chủ trì xử lý vụ việc về con người của đơn vị khác cùng người phụ trách đơn vị đó',
  'lv4', 'quan_ly', null, 1, 'tr_hr', 338, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_Q9_4', 'Q9.4', 'Q9', 'THỰC THI QUYỀN CHỨC NĂNG TRÊN TOÀN CÔNG TY', 'vi_pham', 'Chuẩn nhân sự, chuẩn hành chính và chuẩn văn hoá do nhân sự ban hành được các phòng thực hiện', 'Chuẩn nhân sự, chuẩn hành chính, chuẩn văn hóa và chuẩn pháp chế do nhân sự ban hành được các phòng thực hiện',
  'lv6', 'quan_ly', null, 1, 'tr_hr', 339, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_Q9_5', 'Q9.5', 'Q9', 'THỰC THI QUYỀN CHỨC NĂNG TRÊN TOÀN CÔNG TY', 'vi_pham', 'Quyết định về con người của các đơn vị đi qua đúng luồng duyệt đã ban hành', 'Quyết định về con người của các đơn vị đi qua đúng luồng duyệt đã ban hành',
  'lv6', 'quan_ly', null, 1, 'tr_hr', 340, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_Q9_6', 'Q9.6', 'Q9', 'THỰC THI QUYỀN CHỨC NĂNG TRÊN TOÀN CÔNG TY', 'vi_pham', 'Khi các đơn vị chưa thống nhất về một nhân sự cụ thể, nhân sự chủ trì xử lý và ra được kết luận các bên chấp thuận', 'Khi các đơn vị chưa thống nhất về một nhân sự cụ thể, nhân sự chủ trì xử lý và ra được kết luận các bên chấp thuận',
  'lv6', 'quan_ly', null, 1, 'tr_hr', 341, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_Q9_7', 'Q9.7', 'Q9', 'THỰC THI QUYỀN CHỨC NĂNG TRÊN TOÀN CÔNG TY', 'vi_pham', 'Người phụ trách các khối và các điểm bán chủ động báo cáo chức năng về ba phạm trù, không chờ được hỏi', 'Người phụ trách các khối và các điểm bán chủ động báo cáo chức năng về bốn phạm trù, không chờ được hỏi',
  'lv6', 'quan_ly', null, 1, 'tr_hr', 342, true)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_NL1_2', 'NL1.2', 'NL1', 'NGÔN NGỮ VÀ SỨ MỆNH', 'ghi_nhan', 'Nhân sự là cầu nối khi người nói và người điếc chưa hiểu nhau', null,
  'all', null, null, 1, null, 343, false)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_NL1_11', 'NL1.11', 'NL1', 'NGÔN NGỮ VÀ SỨ MỆNH', 'ghi_nhan', 'Nhân sự truyền đạt được giá trị và sứ mệnh của Công ty cho đồng nghiệp đúng chuẩn', null,
  'all', null, null, 1, null, 344, false)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_NL2_1', 'NL2.1', 'NL2', 'LÀM CHỦ VIỆC VÀ NÂNG CHUẨN', 'ghi_nhan', 'Nhân sự đặt kết quả cần đạt cho nhóm hoặc cho một đợt việc, và nghiệm thu không phát sinh tranh cãi về cách hiểu', null,
  'mgmt', null, null, 1, null, 345, false)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_NL2_2', 'NL2.2', 'NL2', 'LÀM CHỦ VIỆC VÀ NÂNG CHUẨN', 'ghi_nhan', 'Nhân sự diễn giải được mục đích của một chủ trương chung thành lý do cụ thể cho từng bộ phận', null,
  'mgmt', null, null, 1, null, 346, false)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_NL2_5', 'NL2.5', 'NL2', 'LÀM CHỦ VIỆC VÀ NÂNG CHUẨN', 'ghi_nhan', 'Nhân sự tìm ra nguyên nhân gốc làm vấn đề lặp lại và đề xuất cách xử lý ở gốc', null,
  'all', null, null, 1, null, 347, false)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_NL3_1', 'NL3.1', 'NL3', 'CÔNG NGHỆ VÀ CÔNG CỤ, PHẦN NÂNG CAO', 'ghi_nhan', 'Nhân sự chọn đúng công cụ cho đúng loại việc, và giải thích được căn cứ chọn', null,
  'all', null, null, 1, null, 348, false)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_NL3_2', 'NL3.2', 'NL3', 'CÔNG NGHỆ VÀ CÔNG CỤ, PHẦN NÂNG CAO', 'ghi_nhan', 'Sản phẩm nhân sự tạo ra đúng chuẩn ngay lần đầu, không phải làm lại sau khi giao', null,
  'all', null, null, 1, null, 349, false)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_kc_NL3_3', 'NL3.3', 'NL3', 'CÔNG NGHỆ VÀ CÔNG CỤ, PHẦN NÂNG CAO', 'ghi_nhan', 'Sản phẩm nhân sự tạo ra được người khác dùng lại mà không phải hỏi thêm', null,
  'all', null, null, 1, null, 350, false)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_HC2_1', 'HC2.1', 'HC2', 'CON DẤU, HỒ SƠ PHÁP NHÂN VÀ PHÁP LÝ DOANH NGHIỆP', 'ghi_nhan', 'Con dấu được quản lý có kiểm soát và có lưu vết mỗi lần sử dụng', null,
  'all', 'chuyen_mon', null, 1, 'tr_hr', 351, false)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_HC2_2', 'HC2.2', 'HC2', 'CON DẤU, HỒ SƠ PHÁP NHÂN VÀ PHÁP LÝ DOANH NGHIỆP', 'ghi_nhan', 'Hồ sơ pháp nhân đủ, còn hiệu lực và tra ra được khi cần', null,
  'all', 'chuyen_mon', null, 1, 'tr_hr', 352, false)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_HC2_3', 'HC2.3', 'HC2', 'CON DẤU, HỒ SƠ PHÁP NHÂN VÀ PHÁP LÝ DOANH NGHIỆP', 'ghi_nhan', 'Nhân sự chuẩn bị đủ câu hỏi và tài liệu để buổi tư vấn với luật sư ra kết luận dùng được ngay', null,
  'all', 'chuyen_mon', null, 1, 'tr_hr', 353, false)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_HC2_4', 'HC2.4', 'HC2', 'CON DẤU, HỒ SƠ PHÁP NHÂN VÀ PHÁP LÝ DOANH NGHIỆP', 'ghi_nhan', 'Vấn đề pháp lý nhân sự nêu ra được xử lý dứt điểm, không phải hỏi vòng thứ hai', null,
  'all', 'chuyen_mon', null, 1, 'tr_hr', 354, false)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_HC3_1', 'HC3.1', 'HC3', 'HỢP ĐỒNG VỚI ĐỐI TÁC VÀ NHÀ CUNG CẤP', 'ghi_nhan', 'Hợp đồng có mẫu chuẩn và được lưu tập trung một nơi', null,
  'all', 'chuyen_mon', null, 1, 'tr_hr', 355, false)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_HC3_2', 'HC3.2', 'HC3', 'HỢP ĐỒNG VỚI ĐỐI TÁC VÀ NHÀ CUNG CẤP', 'ghi_nhan', 'Nhân sự theo dõi được thời hạn và nghĩa vụ của từng hợp đồng', null,
  'all', 'chuyen_mon', null, 1, 'tr_hr', 356, false)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_HC3_3', 'HC3.3', 'HC3', 'HỢP ĐỒNG VỚI ĐỐI TÁC VÀ NHÀ CUNG CẤP', 'ghi_nhan', 'Nhân sự phát hiện điều khoản bất lợi ở khâu rà, trước khi ký', null,
  'all', 'chuyen_mon', null, 1, 'tr_hr', 357, false)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_HC3_4', 'HC3.4', 'HC3', 'HỢP ĐỒNG VỚI ĐỐI TÁC VÀ NHÀ CUNG CẤP', 'ghi_nhan', 'Không có hợp đồng nào quá hạn mà không ai biết', null,
  'all', 'chuyen_mon', null, 1, 'tr_hr', 358, false)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
insert into ttx.tieu_chi (id, ma, ma_nhom, nhom, che_do, ten, noi_dung, pham_vi, ngach, bac, trong_so, tuyen_id, thu_tu, hoat_dong) values (
  'c_trhr_HC3_5', 'HC3.5', 'HC3', 'HỢP ĐỒNG VỚI ĐỐI TÁC VÀ NHÀ CUNG CẤP', 'ghi_nhan', 'Không phát sinh vụ việc từ điều khoản đã ký', null,
  'all', 'chuyen_mon', null, 1, 'tr_hr', 359, false)
on conflict (id) do update set ma=excluded.ma, ma_nhom=excluded.ma_nhom, nhom=excluded.nhom, che_do=excluded.che_do, ten=excluded.ten, noi_dung=excluded.noi_dung, pham_vi=excluded.pham_vi, ngach=excluded.ngach, bac=excluded.bac, trong_so=excluded.trong_so, tuyen_id=excluded.tuyen_id, thu_tu=excluded.thu_tu, hoat_dong=excluded.hoat_dong, dong_bo_luc=now();
commit;

-- ══════════════════════════════════════════════════════ KIỂM LẠI ══
select 'tổng' t, count(*)::text co, '360' phai from ttx.tieu_chi
union all select 'có trọng số', count(*)::text, '335' from ttx.tieu_chi where trong_so is not null
union all select 'có bậc', count(*)::text, '94' from ttx.tieu_chi where bac is not null
union all select 'gắn tuyến', count(*)::text, '246' from ttx.tieu_chi where tuyen_id is not null
union all select 'có tên', count(*)::text, '335' from ttx.tieu_chi where ten is not null;
