const fs = require('fs');
const path = require('path');
const scratchDir = 'C:/Users/Optimus Prime/.gemini/antigravity-ide/brain/21000f53-2554-4289-be94-2cee610b7735/scratch';

const file8 = path.join(scratchDir, 'sheet_8____Th__ng_m_i___D_ch_v_.json');
const file14 = path.join(scratchDir, 'sheet_14____Nh_n_s__-_H_nh_ch_nh_-_Ph_p_.json');

console.log('=== SHEET 8: THƯƠNG MẠI & DỊCH VỤ ===');
if (fs.existsSync(file8)) {
  const data8 = JSON.parse(fs.readFileSync(file8, 'utf8'));
  data8.slice(15, 45).forEach((row, i) => {
    console.log(` Row ${i+15}:`, JSON.stringify(row.filter(c => c !== '')));
  });
}

console.log('=== SHEET 14: NHÂN SỰ - HÀNH CHÍNH - PHÁP CHẾ ===');
if (fs.existsSync(file14)) {
  const data14 = JSON.parse(fs.readFileSync(file14, 'utf8'));
  data14.slice(15, 45).forEach((row, i) => {
    console.log(` Row ${i+15}:`, JSON.stringify(row.filter(c => c !== '')));
  });
}
