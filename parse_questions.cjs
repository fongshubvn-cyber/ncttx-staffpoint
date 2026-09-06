const fs = require('fs');
const path = require('path');
const scratchDir = 'C:/Users/Optimus Prime/.gemini/antigravity-ide/brain/21000f53-2554-4289-be94-2cee610b7735/scratch';

const file = path.join(scratchDir, 'active____B__c_u_h_i.json');
if (!fs.existsSync(file)) {
  console.log('File active____B__c_u_h_i.json not found!');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(file, 'utf8'));
console.log('Total questions in sheet_4 / active____B__c_u_h_i.json:', data.length);

const parsed = [];
data.forEach((row, i) => {
  if (i === 0) return; // Header row
  // Columns:
  // 0: Hoạt động (Có / Không)
  // 1: Loại (Chung / Phòng ban)
  // 2: Mã tuyến / Tuyến
  // 3: Nhóm
  // 4: Tên nhóm
  // 5: Hình thức đo lường (vi phạm / ghi nhận / thang 0-5)
  // 6: Mã câu (VH1.1, TC3.8, etc.)
  // 7: Nội dung câu hỏi
  // 8: Đối tượng áp dụng (Tất cả nhân sự, Từ Trưởng ca trở lên...)
  // 9: Điểm mặc định
  
  const [active, category, lineId, groupCode, groupName, measurementType, id, text, scope, defaultPoints] = row;
  if (id && text) {
    parsed.push({
      id: String(id).trim(),
      category: String(category || 'Chung').trim(),
      lineId: lineId ? String(lineId).trim() : undefined,
      groupCode: String(groupCode || '').trim(),
      groupName: String(groupName || '').trim(),
      text: String(text).trim(),
      scope: String(scope || 'Tất cả nhân sự').trim(),
      measurementType: String(measurementType || 'thang 0-5').trim().toLowerCase(),
      defaultPoints: Number(defaultPoints) || (measurementType === 'vi phạm' ? 5 : measurementType === 'ghi nhận' ? 0 : 5),
      active: active === 'Có' || active === true,
    });
  }
});

console.log('Successfully parsed questions count:', parsed.length);
console.log('Group codes summary:');
const groups = {};
parsed.forEach(q => {
  groups[q.groupCode] = (groups[q.groupCode] || 0) + 1;
});
console.log(JSON.stringify(groups, null, 2));

// Save to parsed_questions.json in scratch
fs.writeFileSync(path.join(scratchDir, 'parsed_questions.json'), JSON.stringify(parsed, null, 2));
console.log('Saved to parsed_questions.json');
