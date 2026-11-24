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
  console.log(`✓ [SAVED] ${filename}: ${description}`);
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  console.log('========================================================');
  console.log('📸 BẮT ĐẦU CHỤP BỘ HÌNH ẢNH HƯỚNG DẪN SỬ DỤNG STAFFPOINT');
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
    console.log(`Đang truy cập: ${targetUrl}...`);
    await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 45000 });
    await sleep(3000);

    // 1. Màn hình Trang Chủ / Tổng quan
    await saveScreenshot(page, '01_trang_chu.png', 'Màn hình Trang Chủ / Tổng quan điểm số và bậc lương');

    // Helper: click by text
    async function clickByText(selector, textMatch) {
      return await page.evaluate(({ selector, textMatch }) => {
        const els = Array.from(document.querySelectorAll(selector));
        const found = els.find(el => el.textContent && el.textContent.toLowerCase().includes(textMatch.toLowerCase()));
        if (found) {
          found.click();
          return true;
        }
        return false;
      }, { selector, textMatch });
    }

    // 2. Mở Modal Đăng Nhập
    console.log('Mở modal đăng nhập...');
    const clickedLogin = await clickByText('button, a', 'Đăng Nhập');
    if (clickedLogin) {
      await sleep(1500);
      await saveScreenshot(page, '02_dang_nhap.png', 'Giao diện Đăng nhập & Chọn mã nhân viên');
      
      // Đóng modal đăng nhập
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const closeBtn = btns.find(b => b.textContent.includes('✕') || b.textContent.includes('Đóng') || b.textContent.includes('Hủy'));
        if (closeBtn) closeBtn.click();
      });
      await sleep(1000);
    }

    // 3. Mở Modal Cài Đặt App
    console.log('Mở modal cài đặt app...');
    const clickedInstall = await clickByText('button, a', 'Cài App');
    if (clickedInstall) {
      await sleep(1500);
      await saveScreenshot(page, '03_huong_dan_cai_app.png', 'Hướng dẫn ghim app lên màn hình chính (PWA)');
      
      // Đóng modal cài đặt
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const closeBtn = btns.find(b => b.textContent.includes('✕') || b.textContent.includes('Đóng'));
        if (closeBtn) closeBtn.click();
      });
      await sleep(1000);
    }

    // 4. Tab Nhân Sự: Xem chi tiết hồ sơ
    console.log('Chuyển sang tab Nhân sự...');
    await clickByText('nav button, nav a, button', 'Nhân sự');
    await sleep(2000);
    await saveScreenshot(page, '04_danh_sach_nhan_su.png', 'Danh sách nhân sự Nhà & Bậc lương');

    // Bấm vào thẻ nhân sự đầu tiên để mở chi tiết
    console.log('Mở chi tiết nhân sự...');
    const clickedStaff = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('div, button'));
      const found = cards.find(c => c.textContent && c.textContent.includes('TTX00') && c.textContent.includes('Điểm'));
      if (found) {
        found.click();
        return true;
      }
      return false;
    });
    if (clickedStaff) {
      await sleep(1500);
      await saveScreenshot(page, '05_chi_tiet_ho_so.png', 'Chi tiết bảng điểm văn hóa, chuyên môn và quỹ 100đ');
      
      // Đóng modal chi tiết
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const closeBtn = btns.find(b => b.textContent.includes('✕') || b.textContent.includes('Đóng'));
        if (closeBtn) closeBtn.click();
      });
      await sleep(1000);
    }

    // 5. Bấm nút [+] để mở Modal 3 Lựa chọn cốt lõi
    console.log('Mở modal tạo phản hồi...');
    const clickedPlus = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const fab = btns.find(b => {
        const hasPlusIcon = b.querySelector('svg.lucide-plus');
        const isFab = b.className && (b.className.includes('rounded-full') && (b.className.includes('bg-[#1B4332]') || b.className.includes('bg-emerald-700') || b.className.includes('p-3.5') || b.className.includes('p-4')));
        return hasPlusIcon || isFab;
      });
      if (fab) {
        fab.click();
        return true;
      }
      return false;
    });

    if (clickedPlus) {
      await sleep(1500);
      await saveScreenshot(page, '06_menu_chon_phan_hoi.png', 'Hộp thoại chọn 3 chức năng phản hồi cốt lõi');

      // 6. Bấm vào lựa chọn 1: "Ghi nhận & Khen thưởng" để mở Form Chấm Cá Nhân
      console.log('Mở form ghi nhận cá nhân...');
      const clickedGhiNhan = await clickByText('button', 'Ghi nhận & Khen thưởng');
      if (clickedGhiNhan) {
        await sleep(2000);
        await saveScreenshot(page, '07_form_cham_ca_nhan.png', 'Giao diện lập phiếu khen thưởng cho Cá Nhân');

        // 7. Chuyển sang tab "Theo Ca (Sheet)"
        console.log('Chuyển sang chế độ Chấm Theo Ca (Sheet)...');
        const clickedShift = await clickByText('button', 'Theo Ca');
        if (clickedShift) {
          await sleep(2000);
          await saveScreenshot(page, '08_form_cham_theo_ca.png', 'Giao diện chấm điểm đồng loạt theo Ca làm việc (Google Sheet)');
        }

        // Đóng modal form
        await page.evaluate(() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const closeBtn = btns.find(b => b.textContent.trim() === '✕');
          if (closeBtn) closeBtn.click();
        });
        await sleep(1000);
      }
    }

    // 8. Tab Phản Hồi: Sổ Phản Hồi & Mã Phiếu Chuẩn Hóa
    console.log('Chuyển sang tab Phản hồi / Sổ phản hồi...');
    await clickByText('nav button, nav a, button', 'Phản hồi');
    await sleep(2000);
    await saveScreenshot(page, '09_so_phan_hoi.png', 'Sổ phản hồi & Tra cứu mã phiếu (TD-, VP-, NQ-, CA-)');

    // 9. Mở Trung Tâm Thông Báo (🔔)
    console.log('Mở trung tâm thông báo...');
    const clickedBell = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const bell = btns.find(b => b.querySelector('svg.lucide-bell') || (b.getAttribute('title') && b.getAttribute('title').includes('Thông báo')));
      if (bell) {
        bell.click();
        return true;
      }
      return false;
    });
    if (clickedBell) {
      await sleep(1500);
      await saveScreenshot(page, '10_trung_tam_thong_bao.png', 'Trung tâm thông báo & Quyền khiếu nại trong 48 giờ');
      
      // Đóng modal thông báo
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const closeBtn = btns.find(b => b.textContent.includes('✕') || b.textContent.includes('Đóng'));
        if (closeBtn) closeBtn.click();
      });
      await sleep(1000);
    }

    // 10. Mở Trợ Lý AI NCTTX
    console.log('Mở Trợ lý AI NCTTX...');
    const clickedAI = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const aiBtn = btns.find(b => b.textContent.includes('AI') || b.querySelector('svg.lucide-sparkles') || (b.getAttribute('title') && b.getAttribute('title').includes('AI')));
      if (aiBtn) {
        aiBtn.click();
        return true;
      }
      return false;
    });
    if (clickedAI) {
      await sleep(1800);
      await saveScreenshot(page, '11_tro_ly_ai_ncttx.png', 'Trợ lý AI hỏi đáp nội quy và tiêu chuẩn làm việc 24/7');
      
      // Đóng modal AI
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const closeBtn = btns.find(b => b.textContent.includes('✕') || b.textContent.includes('Đóng'));
        if (closeBtn) closeBtn.click();
      });
    }

    console.log('========================================================');
    console.log('🎉 ĐÃ HOÀN TẤT CHỤP TẤT CẢ ẢNH MINH HỌA CHO HƯỚNG DẪN!');
    console.log('========================================================');
  } catch (err) {
    console.error('Lỗi khi chụp màn hình:', err);
  } finally {
    await browser.close();
  }
})();
