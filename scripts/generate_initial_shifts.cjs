const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

function formatDateKey(raw) {
  if (!raw) return '';
  if (raw instanceof Date) {
    const d = new Date(raw.getTime() + 60 * 1000);
    const y = d.getFullYear();
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
  const str = String(raw).trim().split(' ')[0];
  if (str.includes('/')) {
    const parts = str.split('/');
    if (parts.length === 3) {
      const d = parts[0].padStart(2, '0');
      const m = parts[1].padStart(2, '0');
      const y = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
      return `${y}-${m}-${d}`;
    }
  }
  return str;
}

async function generate() {
  const url = 'https://docs.google.com/spreadsheets/d/1Mae0rgz6ozO5_PdnJgdsWPRUjw6ddxeHnJp23IcKUUQ/export?format=xlsx';
  console.log('Fetching Google Sheet...');
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  const wb = xlsx.read(buf, { cellDates: true });

  const shiftsMap = {};
  const sheetStaffList = [];

  // Parse Staff list
  const nsSheetName = wb.SheetNames.find(n => n.toLowerCase().includes('nhân sự') || n.toLowerCase().includes('nhan su'));
  if (nsSheetName && wb.Sheets[nsSheetName]) {
    const ws = wb.Sheets[nsSheetName];
    const rows = xlsx.utils.sheet_to_json(ws, { header: 1, defval: '' });
    for (let r = 4; r < rows.length; r++) {
      const row = rows[r];
      if (!row || !row[0]) continue;
      const id = String(row[0] || '').trim();
      const name = String(row[1] || '').trim();
      const dept = String(row[2] || '').trim();
      const status = String(row[3] || '').trim();
      const isWorking = String(row[6] || '').trim().toLowerCase() === 'có';

      sheetStaffList.push({
        id,
        name,
        department: dept,
        status: status.includes('Thử việc') ? 'Thử việc' : 'Chính thức',
        isWorking,
        role: dept.includes('Pha chế') ? 'Nhân viên Pha chế' : dept.includes('Bếp') ? 'Nhân viên Bếp Bánh' : dept.includes('Phục vụ') ? 'Nhân viên Phục vụ' : 'Nhân viên Thương mại & Dịch vụ',
        location: 'Cửa hàng số 9 Triệu Việt Vương',
      });
    }
  }

  for (const sname of wb.SheetNames) {
    if (sname.toLowerCase().includes('hướng dẫn') || sname.toLowerCase().includes('nhân sự') || sname.toLowerCase().includes('ca làm việc') || sname.toLowerCase().includes('phiếu ký')) {
      continue;
    }
    const ws = wb.Sheets[sname];
    if (!ws) continue;
    const rows = xlsx.utils.sheet_to_json(ws, { header: 1, defval: '' });
    if (rows.length < 5) continue;

    const titleCell = String(rows[0]?.[0] || '');
    let location = 'Cửa hàng số 9 Triệu Việt Vương';
    let dept = sname;
    if (titleCell.includes(' - ')) {
      const parts = titleCell.split(' - ').map(p => p.trim());
      if (parts.length >= 4) {
        location = parts[2] || location;
        dept = parts[3] || sname;
      } else if (parts.length === 3) {
        location = parts[1] || location;
        dept = parts[2] || sname;
      }
    }

    const deptUpper = (dept + ' ' + sname + ' ' + titleCell).toUpperCase();
    if (deptUpper.includes('PHA CHẾ') || deptUpper.includes('BARISTA')) {
      dept = 'Pha chế';
    } else if (deptUpper.includes('BẾP BÁNH') || deptUpper.includes('BẾP') || deptUpper.includes('BAKERY')) {
      dept = 'Bếp Bánh';
    } else if (deptUpper.includes('PHỤC VỤ') || deptUpper.includes('SERVICE')) {
      dept = 'Phục vụ';
    } else if (deptUpper.includes('THƯƠNG MẠI') || deptUpper.includes('OFFLINE') || deptUpper.includes('DỊCH VỤ') || sname.toLowerCase().includes('trang tính')) {
      dept = 'Thương mại & Dịch vụ';
    }

    const staffCols = {};
    const row2 = rows[2] || [];
    const row3 = rows[3] || [];
    for (let c = 3; c < Math.max(row2.length, row3.length); c += 4) {
      const id = String(row2[c] || '').trim();
      const name = String(row3[c] || '').split('\n')[0].trim();
      if (id && id !== 'None' && !id.toLowerCase().includes('mã nv')) {
        staffCols[c] = { id, name };
      }
    }

    // Rows 4 onwards contain daily shifts (r = 4 is Day 1)
    for (let r = 4; r < rows.length; r++) {
      const row = rows[r];
      if (!row || !row[0]) continue;
      const dateKey = formatDateKey(row[0]);
      if (!dateKey || dateKey.length < 8) continue;
      const dayOfWeek = String(row[1] || '').trim();

      for (const [colIdxStr, staff] of Object.entries(staffCols)) {
        const c = parseInt(colIdxStr, 10);
        const shiftVal = String(row[c] || '').trim();
        const inVal = String(row[c + 1] || '').trim();
        const outVal = String(row[c + 2] || '').trim();
        const otVal = String(row[c + 3] || '').trim();

        if (
          !shiftVal ||
          shiftVal === 'None' ||
          shiftVal.includes('Nghỉ tuần') ||
          shiftVal.includes('Nghỉ phép') ||
          shiftVal.includes('Phép năm') ||
          shiftVal.includes('Nghỉ không lương') ||
          shiftVal.includes('Nghỉ ốm') ||
          shiftVal.includes('Nghỉ lễ')
        ) {
          continue;
        }

        const groupKey = `${dateKey}_${dept}_${shiftVal}`;
        if (!shiftsMap[groupKey]) {
          shiftsMap[groupKey] = {
            date: dateKey,
            dayOfWeek,
            location,
            department: dept,
            shiftName: shiftVal,
            members: [],
          };
        }

        if (!shiftsMap[groupKey].members.some(m => m.id === staff.id)) {
          shiftsMap[groupKey].members.push({
            id: staff.id,
            name: staff.name,
            inTime: inVal,
            outTime: outVal,
            ot: otVal,
            isSelected: true,
          });
        }
      }
    }
  }

  const shifts = Object.values(shiftsMap);
  console.log(`Generated ${shifts.length} shift groups and ${sheetStaffList.length} staff records.`);

  const fileContent = `// Pre-bundled shift data synchronized from Google Sheets
// Generated at: ${new Date().toISOString()}

import { ShiftGroup, SheetStaffRecord } from '../services/shiftService';

export const initialShifts: ShiftGroup[] = ${JSON.stringify(shifts, null, 2)};

export const initialSheetStaffList: SheetStaffRecord[] = ${JSON.stringify(sheetStaffList, null, 2)};
`;

  const targetPath = path.join(__dirname, '..', 'src', 'data', 'initialShifts.ts');
  fs.writeFileSync(targetPath, fileContent, 'utf8');
  console.log('Successfully wrote:', targetPath);
}

generate().catch(console.error);
