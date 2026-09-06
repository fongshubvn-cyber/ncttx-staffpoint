const fs = require('fs');

const seedContent = fs.readFileSync('src/data/seedData.ts', 'utf8');

console.log('Includes HR_ADMIN:', seedContent.includes('HR_ADMIN'));
console.log('Includes lineId:', (seedContent.match(/lineId:/g) || []).length);

// Check groupCodes with category Chuyên môn
const parsed = JSON.parse(fs.readFileSync('C:/Users/Optimus Prime/.gemini/antigravity-ide/brain/21000f53-2554-4289-be94-2cee610b7735/scratch/parsed_questions.json', 'utf8'));

const hrGroups = ['N1','N2','N3','N4','N5','N6','N7','N8','N9','N10','N11','HC1','HC4','HC5','HC6','PC1','PC2','PC3','PC4','PC5'];
const hrQuestions = parsed.filter(q => hrGroups.includes(q.groupCode));
console.log('HR/Admin/Legal questions count:', hrQuestions.length);

const tmGroups = ['B1','B2','B3','B5','C6','C7','C8','TC1','TC2','TC3','TC4','TC5','TC6','TC7'];
const tmQuestions = parsed.filter(q => tmGroups.includes(q.groupCode));
console.log('TM/DV questions count:', tmQuestions.length);
