const fs = require('fs');
const path = require('path');
const scratchDir = 'C:/Users/Optimus Prime/.gemini/antigravity-ide/brain/21000f53-2554-4289-be94-2cee610b7735/scratch';

const parsed = JSON.parse(fs.readFileSync(path.join(scratchDir, 'parsed_questions.json'), 'utf8'));

// Filter out header item if any
const validQuestions = parsed.filter(q => q.id !== 'Mã câu' && q.id !== 'Mã nhóm' && q.text);

console.log('Valid questions to write:', validQuestions.length);

// Let's check sample items for TC3
const tc3Items = validQuestions.filter(q => q.groupCode === 'TC3');
console.log('TC3 items count:', tc3Items.length);
tc3Items.forEach(q => console.log(` - ${q.id}: ${q.text}`));

// Read existing seedData.ts up to `export const initialQuestions: Question[] = [`
const seedPath = path.join(__dirname, 'src/data/seedData.ts');
const seedContent = fs.readFileSync(seedPath, 'utf8');

const targetStr = 'export const initialQuestions: Question[] = [';
const idx = seedContent.indexOf(targetStr);

if (idx === -1) {
  console.log('Could not find target string in seedData.ts');
  process.exit(1);
}

const before = seedContent.substring(0, idx + targetStr.length);

// Find initialIncidents position
const incIdx = seedContent.indexOf('export const initialIncidents: IncidentRecord[] = [');
if (incIdx === -1) {
  console.log('Could not find initialIncidents string in seedData.ts');
  process.exit(1);
}

const after = seedContent.substring(incIdx);

const formattedQuestions = validQuestions.map(q => {
  return `  {
    id: ${JSON.stringify(q.id)},
    category: ${JSON.stringify(q.category)},
    lineId: ${q.lineId ? JSON.stringify(q.lineId) : 'undefined'},
    groupCode: ${JSON.stringify(q.groupCode)},
    groupName: ${JSON.stringify(q.groupName)},
    text: ${JSON.stringify(q.text)},
    scope: ${JSON.stringify(q.scope)},
    measurementType: ${JSON.stringify(q.measurementType)},
    defaultPoints: ${q.defaultPoints},
    active: ${q.active}
  }`;
}).join(',\n');

const newSeedContent = before + '\n' + formattedQuestions + '\n];\n\n' + after;

fs.writeFileSync(seedPath, newSeedContent, 'utf8');
console.log('Updated src/data/seedData.ts successfully!');
