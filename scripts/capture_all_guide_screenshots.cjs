const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outDir = path.resolve(__dirname, '..', 'public', 'guide-images');
const docsDir = path.resolve(__dirname, '..', 'docs', 'guide-images');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });

async function saveScreenshot(page, filename, description) {
  const filePath1 = path.join(outDir, filename);
  const filePath2 = path.join(docsDir, filename);
  await page.screenshot({ path: filePath1, type: 'png' });
  fs.copyFileSync(filePath1, filePath2);
  const stats = fs.statSync(filePath1);
  console.log(`✓ [SAVED] ${filename} (${stats.size.toLocaleString()} bytes): ${description}`);
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  console.log('========================================================');
  console.log('📸 BẮT ĐẦU CHỤP BỘ 11 HÌNH ẢNH HƯỚNG DẪN SỬ DỤNG STAFFPOINT');
  console.log('========================================================');

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--window-size=430,932'
    ]
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({
      width: 412,
      height: 892,
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true
    });

    const targetUrl = 'https://ncttx-staffpoint.vercel.app/';
    console.log(`1. Đang truy cập: ${targetUrl}...`);
    await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 45000 });
    await sleep(2500);

    // ----------------------------------------------------
    // BƯỚC 1: Chụp Màn hình Đăng Nhập Ban Đầu
    // ----------------------------------------------------
    console.log('\n📸 [1/11] Chụp màn hình Đăng Nhập...');
    await saveScreenshot(page, '02_dang_nhap.png', 'Màn hình Đăng nhập & Xác thực nhân viên Nhà Của Thời Thanh Xuân');

    // ----------------------------------------------------
    // BƯỚC 2: Mở Hướng dẫn Cài App (PWA) từ màn đăng nhập
    // ----------------------------------------------------
    console.log('\n📸 [2/11] Mở Modal Cài App từ màn đăng nhập...');
    const clickedInstall = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.textContent && (b.textContent.includes('Cài Đặt App') || b.textContent.includes('Cài App')));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });

    if (clickedInstall) {
      await sleep(1500);
      await saveScreenshot(page, '03_huong_dan_cai_app.png', 'Hướng dẫn ghim App lên màn hình chính điện thoại (PWA)');
      // Đóng modal cài app
      await page.evaluate(() => {
        const closeBtns = Array.from(document.querySelectorAll('button')).filter(b => b.textContent.includes('✕') || b.textContent.includes('Đóng'));
        if (closeBtns.length > 0) closeBtns[closeBtns.length - 1].click();
      });
      await sleep(1000);
    }

    // ----------------------------------------------------
    // BƯỚC 3: Đăng nhập vào hệ thống với tài khoản ADMIN
    // ----------------------------------------------------
    console.log('\n🔑 Đang điền thông tin đăng nhập ADMIN...');
    await page.waitForSelector('input[type="text"]', { timeout: 10000 });
    
    // Type username
    await page.click('input[type="text"]');
    await page.evaluate(() => {
      const input = document.querySelector('input[type="text"]');
      if (input) input.value = '';
    });
    await page.type('input[type="text"]', 'ADMIN', { delay: 50 });

    // Type password
    await page.click('input[type="password"]');
    await page.evaluate(() => {
      const input = document.querySelector('input[type="password"]');
      if (input) input.value = '';
    });
    await page.type('input[type="password"]', '123456A!', { delay: 50 });
    await sleep(500);

    // Click submit
    console.log('Bấm nút Đăng Nhập...');
    await page.evaluate(() => {
      const submitBtn = document.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.click();
    });
    await sleep(3500);

    // ----------------------------------------------------
    // BƯỚC 4: Chụp Màn hình Trang Chủ / Tổng Quan sau khi đăng nhập
    // ----------------------------------------------------
    console.log('\n📸 [3/11] Chụp Trang Chủ / Tổng quan điểm số...');
    await saveScreenshot(page, '01_trang_chu.png', 'Trang Chủ Tổng Quan: Bảng xếp hạng, điểm số & bậc lương cá nhân');

    // ----------------------------------------------------
    // BƯỚC 5: Mở Trung Tâm Thông Báo (Chuông 🔔)
    // ----------------------------------------------------
    console.log('\n📸 [4/11] Mở Trung Tâm Thông Báo...');
    const clickedBell = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const bell = btns.find(b => (b.getAttribute('title') && b.getAttribute('title').includes('Thông báo')) || b.querySelector('svg.lucide-bell'));
      if (bell) {
        bell.click();
        return true;
      }
      return false;
    });

    if (clickedBell) {
      await sleep(1800);
      await saveScreenshot(page, '10_trung_tam_thong_bao.png', 'Trung tâm thông báo: Quyền khiếu nại trong 48h minh bạch');
      // Đóng modal thông báo
      await page.evaluate(() => {
        const closeBtns = Array.from(document.querySelectorAll('button')).filter(b => b.textContent.includes('✕') || b.textContent.includes('Đóng'));
        if (closeBtns.length > 0) closeBtns[closeBtns.length - 1].click();
      });
      await sleep(1000);
    }

    // ----------------------------------------------------
    // BƯỚC 6: Mở Trợ Lý AI NCTTX (Nút Sparkles góc trái)
    // ----------------------------------------------------
    console.log('\n📸 [5/11] Mở Trợ lý AI NCTTX...');
    const clickedAI = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const aiBtn = btns.find(b => (b.getAttribute('title') && b.getAttribute('title').includes('NotebookLM')) || b.querySelector('svg.lucide-sparkles'));
      if (aiBtn) {
        aiBtn.click();
        return true;
      }
      return false;
    });

    if (clickedAI) {
      await sleep(2000);
      await saveScreenshot(page, '11_tro_ly_ai_ncttx.png', 'Trợ lý AI NCTTX: Tra cứu nội quy, tiêu chuẩn công việc 24/7');
      // Đóng modal AI
      await page.evaluate(() => {
        const closeBtns = Array.from(document.querySelectorAll('button')).filter(b => b.textContent.includes('✕') || b.textContent.includes('Đóng'));
        if (closeBtns.length > 0) closeBtns[closeBtns.length - 1].click();
      });
      await sleep(1000);
    }

    // ----------------------------------------------------
    // BƯỚC 7: Chuyển sang Tab "Nhân Sự"
    // ----------------------------------------------------
    console.log('\n📸 [6/11] Chuyển sang tab Nhân Sự...');
    await page.evaluate(() => {
      const navBtns = Array.from(document.querySelectorAll('nav button, button'));
      const staffTab = navBtns.find(b => b.textContent && b.textContent.includes('Nhân Sự'));
      if (staffTab) staffTab.click();
    });
    await sleep(2000);
    await saveScreenshot(page, '04_danh_sach_nhan_su.png', 'Danh sách nhân sự Nhà Của Thời Thanh Xuân theo phòng ban');

    // ----------------------------------------------------
    // BƯỚC 8: Mở Chi Tiết Bảng Điểm 1 Nhân Sự
    // ----------------------------------------------------
    console.log('\n📸 [7/11] Bấm vào hồ sơ nhân sự để xem chi tiết điểm...');
    const clickedStaffDetail = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('div, button')).filter(el => {
        const txt = el.textContent || '';
        return (txt.includes('Mã:') || txt.includes('TTX')) && txt.includes('Điểm') && (txt.includes('Bậc') || txt.includes('Quỹ'));
      });
      if (cards.length > 0) {
        cards[0].click();
        return true;
      }
      return false;
    });

    if (clickedStaffDetail) {
      await sleep(1800);
      await saveScreenshot(page, '05_chi_tiet_ho_so.png', 'Chi tiết bảng điểm cá nhân: Văn hóa 70%, Chuyên môn 30% & Quỹ 100đ');
      // Đóng modal chi tiết
      await page.evaluate(() => {
        const closeBtns = Array.from(document.querySelectorAll('button')).filter(b => b.textContent.includes('✕') || b.textContent.includes('Đóng'));
        if (closeBtns.length > 0) closeBtns[closeBtns.length - 1].click();
      });
      await sleep(1000);
    }

    // ----------------------------------------------------
    // BƯỚC 9: Bấm nút FAB [+] để mở Modal 3 Lựa Chọn Cốt Lõi
    // ----------------------------------------------------
    console.log('\n📸 [8/11] Bấm nút [+] tạo phản hồi...');
    const clickedFAB = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const fab = btns.find(b => (b.getAttribute('title') && b.getAttribute('title').includes('Tạo phản hồi')) || b.querySelector('svg.lucide-plus'));
      if (fab) {
        fab.click();
        return true;
      }
      return false;
    });

    if (clickedFAB) {
      await sleep(1500);
      await saveScreenshot(page, '06_menu_chon_phan_hoi.png', 'Hộp thoại chọn 3 chức năng phản hồi: Khen thưởng, Vi phạm & Nội quy');

      // ----------------------------------------------------
      // BƯỚC 10: Bấm vào "🌟 Ghi nhận & Khen thưởng" -> Form Chấm Cá Nhân
      // ----------------------------------------------------
      console.log('\n📸 [9/11] Mở Form Ghi nhận Cá Nhân...');
      const clickedKhenThuong = await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const btn = btns.find(b => b.textContent && (b.textContent.includes('Ghi nhận & Khen thưởng') || b.textContent.includes('Ghi nhận')));
        if (btn) {
          btn.click();
          return true;
        }
        return false;
      });

      if (clickedKhenThuong) {
        await sleep(2000);
        await saveScreenshot(page, '07_form_cham_ca_nhan.png', 'Giao diện lập phiếu Ghi nhận & Khen thưởng cho Cá Nhân');

        // ----------------------------------------------------
        // BƯỚC 11: Chuyển sang chế độ "Theo Ca (Sheet)"
        // ----------------------------------------------------
        console.log('\n📸 [10/11] Chuyển sang chế độ Chấm Theo Ca (Sheet)...');
        const clickedShiftMode = await page.evaluate(() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const shiftBtn = btns.find(b => b.textContent && b.textContent.includes('Theo Ca'));
          if (shiftBtn) {
            shiftBtn.click();
            return true;
          }
          return false;
        });

        if (clickedShiftMode) {
          await sleep(2500);
          await saveScreenshot(page, '08_form_cham_theo_ca.png', 'Giao diện Chấm Điểm Đồng Loạt Theo Ca Làm Việc từ Google Sheet');
        }

        // Đóng form modal
        await page.evaluate(() => {
          const closeBtns = Array.from(document.querySelectorAll('button')).filter(b => b.textContent.includes('✕') || b.textContent.includes('Đóng') || b.textContent.includes('Hủy'));
          if (closeBtns.length > 0) closeBtns[0].click();
        });
        await sleep(1000);
      }
    }

    // ----------------------------------------------------
    // BƯỚC 12: Chuyển sang Tab "Phản Hồi" (Sổ Phản Hồi)
    // ----------------------------------------------------
    console.log('\n📸 [11/11] Chuyển sang tab Phản Hồi...');
    await page.evaluate(() => {
      const navBtns = Array.from(document.querySelectorAll('nav button, button'));
      const incidentTab = navBtns.find(b => b.textContent && b.textContent.includes('Phản Hồi'));
      if (incidentTab) incidentTab.click();
    });
    await sleep(2500);
    await saveScreenshot(page, '09_so_phan_hoi.png', 'Sổ Phản Hồi minh bạch: Tra cứu mã phiếu (TD-, VP-, NQ-, CA-) & trạng thái');

    console.log('\n========================================================');
    console.log('🎉 TẤT CẢ 11 ẢNH ĐÃ ĐƯỢC CHỤP THÀNH CÔNG RỰC RỠ!');
    console.log('========================================================');
  } catch (err) {
    console.error('Lỗi khi chụp màn hình:', err);
  } finally {
    await browser.close();
  }
})();
