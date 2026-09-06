const fs = require('fs');
const path = require('path');
const scratchDir = 'C:/Users/Optimus Prime/.gemini/antigravity-ide/brain/21000f53-2554-4289-be94-2cee610b7735/scratch';

const files = fs.readdirSync(scratchDir);
files.forEach(f => {
  if (f.endsWith('.json') && !f.includes('package')) {
    console.log('====================================');
    console.log('FILE:', f);
    try {
      const content = fs.readFileSync(path.join(scratchDir, f), 'utf8');
      const data = JSON.parse(content);
      console.log('Length:', Array.isArray(data) ? data.length : typeof data);
      if (Array.isArray(data) && data.length > 0) {
        data.slice(0, 15).forEach((item, idx) => {
          console.log(` [${idx}]`, JSON.stringify(item));
        });
      }
    } catch(e) {
      console.log('Err:', e.message);
    }
  }
});
