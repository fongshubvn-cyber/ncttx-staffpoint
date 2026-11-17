const fs = require('fs');

function search(dir) {
  fs.readdirSync(dir).forEach(f => {
    const full = dir + '/' + f;
    if (fs.statSync(full).isDirectory()) {
      search(full);
    } else if (f.endsWith('.ts') || f.endsWith('.tsx')) {
      const content = fs.readFileSync(full, 'utf8');
      const lines = content.split('\n');
      lines.forEach((l, i) => {
        if (l.toLowerCase().includes('deletestaff') || (l.includes('setStaffList') && l.includes('filter')) || l.includes('Xóa nhân sự') || l.includes('xóa nhân viên') || l.includes('xóa nhân sự')) {
          console.log(`${full}:${i + 1}: ${l.trim()}`);
        }
      });
    }
  });
}

search('src');
