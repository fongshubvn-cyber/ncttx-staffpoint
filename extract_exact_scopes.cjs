const fs = require('fs');
const path = require('path');
const scratchDir = 'C:/Users/Optimus Prime/.gemini/antigravity-ide/brain/21000f53-2554-4289-be94-2cee610b7735/scratch';

const mapSheets = {
  'TM_DV': 'sheet_8____Th__ng_m_i___D_ch_v_.json',
  'ECOMMERCE': 'sheet_15____E-Commerce.json',
  'BD': 'sheet_9____Ph_t_tri_n_Kinh_doanh.json',
  'PHA_CHE': 'sheet_10____Pha_ch_.json',
  'BEP_BANH': 'sheet_11____B_p_b_nh_.json',
  'SAN_XUAT': 'sheet_12____S_n_xu_t.json',
  'KHO_DONGGOI': 'sheet_13____Kho_v____ng_g_i.json',
  'HR_ADMIN': 'sheet_14____Nh_n_s__-_H_nh_ch_nh_-_Ph_p_.json'
};

Object.entries(mapSheets).forEach(([key, filename]) => {
  const filePath = path.join(scratchDir, filename);
  console.log(`\n=== LINE: ${key} (${filename}) ===`);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    data.slice(0, 6).forEach((row, rIdx) => {
      if (Array.isArray(row) && row.some(c => c !== '')) {
        console.log(` Row ${rIdx}:`, row.filter(c => c !== '').join(' | '));
      }
    });
  } else {
    console.log(' File not found');
  }
});
