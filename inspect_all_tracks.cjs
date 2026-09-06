const fs = require('fs');
const path = require('path');
const scratchDir = 'C:/Users/Optimus Prime/.gemini/antigravity-ide/brain/21000f53-2554-4289-be94-2cee610b7735/scratch';

const files = fs.readdirSync(scratchDir);
files.forEach(f => {
  if (f.startsWith('sheet_') && f.endsWith('.json')) {
    console.log('====================================================');
    console.log('SHEET FILE:', f);
    try {
      const data = JSON.parse(fs.readFileSync(path.join(scratchDir, f), 'utf8'));
      if (Array.isArray(data) && data.length > 0) {
        // Print first 10 rows
        data.slice(0, 10).forEach((row, rIdx) => {
          if (Array.isArray(row) && row.some(cell => cell)) {
            console.log(` Row ${rIdx}:`, JSON.stringify(row.filter(c => c !== '')));
          }
        });
      }
    } catch(e) {
      console.log('Error parsing:', e.message);
    }
  }
});
