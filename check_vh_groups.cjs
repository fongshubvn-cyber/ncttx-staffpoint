const fs = require('fs');
const seedContent = fs.readFileSync('src/data/seedData.ts', 'utf8');

const parsed = JSON.parse(fs.readFileSync('C:/Users/Optimus Prime/.gemini/antigravity-ide/brain/21000f53-2554-4289-be94-2cee610b7735/scratch/parsed_questions.json', 'utf8'));

const vhQuestions = parsed.filter(q => q.groupCode && q.groupCode.startsWith('VH'));

console.log('Total VH questions in parsed_questions.json:', vhQuestions.length);

const vhGroupsMap = {};
vhQuestions.forEach(q => {
  if (!vhGroupsMap[q.groupCode]) {
    vhGroupsMap[q.groupCode] = {
      code: q.groupCode,
      name: q.groupName,
      count: 0,
      items: []
    };
  }
  vhGroupsMap[q.groupCode].count++;
  vhGroupsMap[q.groupCode].items.push(q.id);
});

console.log('=== VH GROUPS IN DATABASE ===');
Object.values(vhGroupsMap).forEach(g => {
  console.log(`[${g.code}] ${g.name}: ${g.count} items (${g.items[0]} -> ${g.items[g.items.length-1]})`);
});
