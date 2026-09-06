const fs = require('fs');
const parsed = JSON.parse(fs.readFileSync('C:/Users/Optimus Prime/.gemini/antigravity-ide/brain/21000f53-2554-4289-be94-2cee610b7735/scratch/parsed_questions.json', 'utf8'));

const tc3 = parsed.filter(x => x.groupCode === 'TC3');
console.log('TC3 items total:', tc3.length);
tc3.forEach(item => {
  console.log(`- ID: ${item.id} | GroupCode: ${item.groupCode} | Category: ${item.category} | LineId: ${item.lineId} | Text: ${item.text}`);
});
