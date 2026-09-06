const fs = require('fs');
const path = require('path');
const scratchDir = 'C:/Users/Optimus Prime/.gemini/antigravity-ide/brain/21000f53-2554-4289-be94-2cee610b7735/scratch';

const files = fs.readdirSync(scratchDir);
files.forEach(f => {
  if (f.endsWith('.json')) {
    const content = fs.readFileSync(path.join(scratchDir, f), 'utf8');
    if (content.includes('TC3') || content.includes('VH') || content.includes('CÔNG NGHỆ VÀ CÔNG CỤ')) {
      console.log('=== MATCH IN FILE:', f);
      const data = JSON.parse(content);
      if (Array.isArray(data)) {
        data.forEach((row, i) => {
          const str = JSON.stringify(row);
          if (str.includes('TC3') || str.includes('CÔNG NGHỆ VÀ CÔNG CỤ') || str.includes('TC3.8')) {
            console.log(` Row ${i}:`, str);
          }
        });
      }
    }
  }
});
