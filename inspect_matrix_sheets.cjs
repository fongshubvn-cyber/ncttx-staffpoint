const fs = require('fs');
const path = require('path');
const scratchDir = 'C:/Users/Optimus Prime/.gemini/antigravity-ide/brain/21000f53-2554-4289-be94-2cee610b7735/scratch';

const files = fs.readdirSync(scratchDir);
files.forEach(f => {
  if (f.startsWith('sheet_') && f.endsWith('.json')) {
    console.log('====================================');
    console.log('FILE:', f);
    try {
      const data = JSON.parse(fs.readFileSync(path.join(scratchDir, f), 'utf8'));
      if (Array.isArray(data) && data.length > 0) {
        // Print first 15 non-empty rows
        let count = 0;
        data.forEach((row, i) => {
          if (count < 15 && Array.isArray(row) && row.some(c => c !== '')) {
            console.log(`  Row ${i}:`, JSON.stringify(row.filter(c => c !== '')));
            count++;
          }
        });
      }
    } catch(e) {
      console.log('Err:', e.message);
    }
  }
});
