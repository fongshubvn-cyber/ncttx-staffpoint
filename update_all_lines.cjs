const fs = require('fs');
const path = require('path');

const parsed = JSON.parse(fs.readFileSync('C:/Users/Optimus Prime/.gemini/antigravity-ide/brain/21000f53-2554-4289-be94-2cee610b7735/scratch/parsed_questions.json', 'utf8'));

const hrGroups = ['N1','N2','N3','N4','N5','N6','N7','N8','N9','N10','N11','HC1','HC4','HC5','HC6','PC1','PC2','PC3','PC4','PC5'];
const tmGroups = ['B1','B2','B3','B5','C6','C7','C8','TC1','TC2','TC3','TC4','TC5','TC6','TC7'];

const validQuestions = parsed.filter(q => q.id !== 'Mã câu' && q.id !== 'Mã nhóm' && q.text);

validQuestions.forEach(q => {
  if (hrGroups.includes(q.groupCode)) {
    q.lineId = 'HR_ADMIN';
    q.category = 'Phòng ban';
  } else if (tmGroups.includes(q.groupCode)) {
    q.lineId = 'TM_DV';
    if (q.category !== 'Chung') q.category = 'Phòng ban';
  }
});

const seedPath = path.join(__dirname, 'src/data/seedData.ts');
let seedContent = fs.readFileSync(seedPath, 'utf8');

// Update initialLines array
seedContent = seedContent.replace(
  `id: 'HR_ADMIN',\n    name: 'Nhân sự - Hành chính - Pháp chế',\n    status: '⬜ khung rỗng',`,
  `id: 'HR_ADMIN',\n    name: 'Nhân sự - Hành chính - Pháp chế',\n    status: '✅ đủ nội dung',`
).replace(
  `criteriaType: 'chưa soạn',`,
  `criteriaType: '20 nhóm tiêu chí chuyên môn (N1-N11, HC, PC)',`
);

const targetStr = 'export const initialQuestions: Question[] = [';
const idx = seedContent.indexOf(targetStr);
const incIdx = seedContent.indexOf('export const initialIncidents: IncidentRecord[] = [');

const before = seedContent.substring(0, idx + targetStr.length);
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
console.log('Updated seedData.ts with lineIds and HR_ADMIN status successfully!');
