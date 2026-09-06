const fs = require('fs');
const parsed = JSON.parse(fs.readFileSync('C:/Users/Optimus Prime/.gemini/antigravity-ide/brain/21000f53-2554-4289-be94-2cee610b7735/scratch/parsed_questions.json', 'utf8'));

const groupsMap = {};
parsed.forEach(q => {
  if (!q.groupCode || q.id === 'Mã câu') return;
  if (!groupsMap[q.groupCode]) {
    groupsMap[q.groupCode] = {
      code: q.groupCode,
      name: q.groupName,
      category: q.category,
      questions: []
    };
  }
  groupsMap[q.groupCode].questions.push(q.id);
});

console.log('=== SUMMARY OF ALL MAIN CRITERIA GROUPS ===');
Object.values(groupsMap).forEach(g => {
  const ids = g.questions;
  console.log(`Group [${g.code}] (${g.category}) - ${g.name}`);
  console.log(`  Count: ${ids.length} items (${ids[0]} -> ${ids[ids.length - 1]})`);
});
