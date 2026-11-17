import { read, utils, WorkBook } from 'xlsx';
import { Staff, SpeechType } from '../types';

export const DEFAULT_SHIFT_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1Mae0rgz6ozO5_PdnJgdsWPRUjw6ddxeHnJp23IcKUUQ/edit';

export interface ShiftMember {
  id: string; // Mã NV (TTX009, TTX010...)
  name: string;
  role?: string;
  inTime?: string;
  outTime?: string;
  ot?: string;
  isSelected?: boolean;
}

export interface ShiftGroup {
  date: string; // YYYY-MM-DD
  dayOfWeek: string; // Thứ
  location: string; // Điểm bán
  department: string; // Bộ phận (Pha chế, Bếp Bánh, Thương mại & Dịch vụ...)
  shiftName: string; // 06:30-14:30, 14:00-22:00...
  members: ShiftMember[];
}

export interface SheetStaffRecord {
  id: string;
  name: string;
  department: string;
  status: string; // 'Chính thức' | 'Thử việc'
  isWorking: boolean;
  role: string;
  location: string;
}

export interface ParsedShiftData {
  shifts: ShiftGroup[];
  staffList: SheetStaffRecord[];
  lastUpdated: string;
  sheetCount: number;
}

// Convert Google Sheet URL to Export XLSX URL
export function getExportUrl(sheetUrl: string): string {
  const match = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return `https://docs.google.com/spreadsheets/d/${match[1]}/export?format=xlsx`;
  }
  return sheetUrl;
}

// Format Date object to YYYY-MM-DD
export function formatDateKey(raw: any): string {
  if (!raw) return '';
  if (raw instanceof Date) {
    const y = raw.getFullYear();
    const m = (raw.getMonth() + 1).toString().padStart(2, '0');
    const d = raw.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
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

/**
 * Fetch and Parse the Google Sheet Workbook
 */
export async function fetchAndParseShiftWorkbook(sheetUrl: string = DEFAULT_SHIFT_SHEET_URL): Promise<ParsedShiftData> {
  const exportUrl = getExportUrl(sheetUrl);
  const response = await fetch(exportUrl, {
    headers: {
      'Cache-Control': 'no-cache',
    },
  });

  if (!response.ok) {
    throw new Error(`Không thể tải dữ liệu từ Google Sheet (Mã lỗi ${response.status}). Vui lòng kiểm tra quyền chia sẻ link.`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const wb: WorkBook = read(arrayBuffer, { type: 'array', cellDates: true });

  const shiftsMap: Record<string, ShiftGroup> = {};
  const sheetStaffList: SheetStaffRecord[] = [];

  // 1. PARSE SHEET: "Nhân sự điểm bán"
  const nsSheetName = wb.SheetNames.find(n => n.toLowerCase().includes('nhân sự') || n.toLowerCase().includes('nhan su'));
  if (nsSheetName && wb.Sheets[nsSheetName]) {
    const ws = wb.Sheets[nsSheetName];
    const rows: any[][] = utils.sheet_to_json(ws, { header: 1, defval: '' });
    
    // Header is usually at row 4 (index 3)
    for (let r = 4; r < rows.length; r++) {
      const row = rows[r];
      if (!row || !row[0]) continue;
      const id = String(row[0]).trim();
      const name = String(row[1] || '').trim();
      if (!id || id === 'None' || id.toLowerCase().includes('mã nv')) continue;

      const dept = String(row[2] || 'Thương mại & Dịch vụ').trim();
      const status = String(row[3] || 'Chính thức').trim();
      const isWorking = String(row[6] || '').trim().toLowerCase() === 'có';

      sheetStaffList.push({
        id,
        name,
        department: dept,
        status: status.includes('Thử việc') ? 'Thử việc' : 'Chính thức',
        isWorking,
        role: dept.includes('Pha chế') ? 'Nhân viên Pha chế' : dept.includes('Bếp') ? 'Nhân viên Bếp Bánh' : 'Nhân viên Thương mại & Dịch vụ',
        location: 'Cửa hàng số 9 Triệu Việt Vương',
      });
    }
  }

  // 2. PARSE MONTHLY SHIFT SHEETS
  for (const sname of wb.SheetNames) {
    if (sname.toLowerCase().includes('hướng dẫn') || sname.toLowerCase().includes('nhân sự') || sname.toLowerCase().includes('ca làm việc') || sname.toLowerCase().includes('phiếu ký')) {
      continue;
    }

    const ws = wb.Sheets[sname];
    if (!ws) continue;
    const rows: any[][] = utils.sheet_to_json(ws, { header: 1, defval: '' });
    if (rows.length < 16) continue;

    // Detect Department and Location from Title (Cell A1)
    const titleCell = String(rows[0]?.[0] || '');
    let location = 'Cửa hàng số 9 Triệu Việt Vương';
    let dept = sname;
    if (titleCell.includes(' - ')) {
      const parts = titleCell.split(' - ');
      if (parts[1]) location = parts[1].trim();
      if (parts[2]) dept = parts[2].trim();
    } else {
      if (sname.includes('Pha chế')) dept = 'Pha chế';
      else if (sname.includes('Bếp Bánh')) dept = 'Bếp Bánh';
      else if (sname.includes('Thương mại') || sname.includes('Trang tính')) dept = 'Thương mại & Dịch vụ';
    }

    // Row 3 (index 2) contains Staff IDs, Row 4 (index 3) contains Staff Names
    const staffCols: Record<number, { id: string; name: string }> = {};
    const row3 = rows[2] || [];
    const row4 = rows[3] || [];

    for (let c = 3; c < row3.length; c += 4) {
      const id = String(row3[c] || '').trim();
      const name = String(row4[c] || '').split('\n')[0].trim();
      if (id && id !== 'None' && !id.toLowerCase().includes('mã nv')) {
        staffCols[c] = { id, name };
      }
    }

    // Rows 16 onwards (index 15) contain daily shifts
    for (let r = 15; r < rows.length; r++) {
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

        // Skip non-working statuses
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

        // Add member if not already in list
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

  const result: ParsedShiftData = {
    shifts: Object.values(shiftsMap),
    staffList: sheetStaffList,
    lastUpdated: new Date().toISOString(),
    sheetCount: wb.SheetNames.length,
  };

  // Cache to localStorage
  try {
    localStorage.setItem('ncttx_shift_cache_v1', JSON.stringify(result));
    localStorage.setItem('ncttx_shift_cache_time', Date.now().toString());
  } catch (e) {
    console.warn('Cannot cache shift data to localStorage', e);
  }

  return result;
}

/**
 * Get Cached Shift Data from LocalStorage
 */
export function getCachedShiftData(): ParsedShiftData | null {
  try {
    const raw = localStorage.getItem('ncttx_shift_cache_v1');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {}
  return null;
}

/**
 * Convert SheetStaffRecord to full Staff object
 */
export function convertSheetStaffToStaff(rec: SheetStaffRecord): Staff {
  const isDeaf = ['TTX009', 'TTX010', 'TTX011', 'TTX012', 'TTX013', 'TTX014', 'TV14'].includes(rec.id);
  const isChuyenVien = rec.id === 'TTX031';
  
  return {
    id: rec.id,
    name: rec.name,
    role: isChuyenVien ? 'Chuyên viên Thương mại & Dịch vụ' : rec.role,
    positionCategory: isChuyenVien ? 'Commercial & Services Specialist' : 'Commercial & Services Executive',
    department: rec.department.includes('Pha chế') ? 'Pha chế' : rec.department.includes('Bếp') ? 'Bếp Bánh' : 'Thương mại & Dịch vụ',
    line: rec.department.includes('Pha chế') ? 'Pha chế' : rec.department.includes('Bếp') ? 'Pha chế' : 'Thương mại & Dịch vụ',
    speechCapability: isDeaf ? 'Người điếc/ khiếm thính' : 'Người nói',
    location: rec.location || 'Cửa hàng số 9 Triệu Việt Vương',
    status: rec.status || 'Chính thức',
    evaluationCount: 0,
    generalScore: 4.0,
    techScore: 4.0,
    totalScore: 4.0,
    salaryTier: isChuyenVien ? 3 : 1,
    jobLevel: isChuyenVien ? 'Chuyên viên' : rec.status === 'Thử việc' ? 'Tập sự' : 'Nhân viên',
    policyScore: 100,
  };
}
