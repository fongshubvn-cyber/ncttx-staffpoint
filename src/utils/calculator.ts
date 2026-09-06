import { ParameterConfig, Staff } from '../types';

/**
 * Checks if a staff member holds a management position.
 * Management roles: Founder, CEO, C-Level, Trưởng phòng, Quản lý, Lead, Trưởng ca.
 * Non-management roles: Nhân viên, Tập sự, Chuyên viên, Kế toán chức năng, v.v.
 */
export function isManagementRole(staff: Staff): boolean {
  if (staff.isManager === true) return true;
  const roleLower = (staff.role || '').toLowerCase();
  const levelLower = (staff.jobLevel || '').toLowerCase();
  const posLower = (staff.positionCategory || '').toLowerCase();

  const mgmtKeywords = [
    'chủ tịch', 'founder', 'ceo', 'c-level', 'c suite', 
    'trưởng phòng', 'quản lý', 'manager', 'lead', 
    'trưởng ca', 'cửa hàng trưởng', 'head of'
  ];

  return mgmtKeywords.some(kw => 
    roleLower.includes(kw) || levelLower.includes(kw) || posLower.includes(kw)
  );
}

/**
 * Calculates Bậc cách làm việc (Salary Tier 1..5) from total score (0..5)
 */
export function calculateSalaryTier(score: number, params: ParameterConfig): number {
  const ratio = Math.max(0, Math.min(1, score / 5.0));
  if (ratio >= params.tier5Threshold) return 5;
  if (ratio >= params.tier4Threshold) return 4;
  if (ratio >= params.tier3Threshold) return 3;
  if (ratio >= params.tier2Threshold) return 2;
  return 1;
}

/**
 * Calculates total working score based on management role presence
 */
export function calculateTotalScore(
  generalScore: number,
  techScore: number,
  mgmtScore?: number,
  params?: ParameterConfig
): number {
  const p = params || {
    weightGeneralNoMgmt: 0.65,
    weightTechNoMgmt: 0.35,
    weightGeneralWithMgmt: 0.50,
    weightMgmtWithMgmt: 0.30,
    weightTechWithMgmt: 0.20,
  };

  if (mgmtScore !== undefined && mgmtScore > 0) {
    return Number((
      generalScore * p.weightGeneralWithMgmt +
      mgmtScore * p.weightMgmtWithMgmt +
      techScore * p.weightTechWithMgmt
    ).toFixed(2));
  } else {
    return Number((
      generalScore * p.weightGeneralNoMgmt +
      techScore * p.weightTechNoMgmt
    ).toFixed(2));
  }
}

/**
 * Calculates total working score specifically for a Staff object
 */
export function calculateTotalScoreForStaff(
  staff: Staff,
  params?: ParameterConfig
): number {
  const hasMgmt = isManagementRole(staff);
  return calculateTotalScore(
    staff.generalScore,
    staff.techScore,
    hasMgmt ? staff.mgmtScore : undefined,
    params
  );
}

export function getSalaryTierBadge(tier: number): { label: string; bgClass: string; textClass: string; borderClass: string } {
  switch (tier) {
    case 5:
      return { label: 'Bậc 5 (Xuất sắc)', bgClass: 'bg-[#1B4332]', textClass: 'text-[#52B788]', borderClass: 'border-[#2D6A4F]' };
    case 4:
      return { label: 'Bậc 4 (Đạt chuẩn)', bgClass: 'bg-emerald-100', textClass: 'text-[#1B4332]', borderClass: 'border-emerald-300' };
    case 3:
      return { label: 'Bậc 3 (Khá)', bgClass: 'bg-[#EDEAE3]', textClass: 'text-[#2D3748]', borderClass: 'border-slate-300' };
    case 2:
      return { label: 'Bậc 2 (Cần cố gắng)', bgClass: 'bg-orange-100', textClass: 'text-[#DD6B20]', borderClass: 'border-orange-300' };
    case 1:
    default:
      return { label: 'Bậc 1 (Chưa đạt)', bgClass: 'bg-rose-100', textClass: 'text-rose-700', borderClass: 'border-rose-300' };
  }
}

/**
 * Dynamic HR Head Permission Check
 * Admin OR any user assigned to Department 'Nhân sự' with 'Trưởng phòng' / 'Head' / 'Quản lý' role.
 */
export function isHRHeadRole(user: { isAdmin?: boolean; isManager?: boolean; role?: string; department?: string; jobLevel?: string } | null | undefined): boolean {
  if (!user) return false;
  if (user.isAdmin) return true;

  const roleLower = (user.role || '').toLowerCase();
  const deptLower = (user.department || '').toLowerCase();
  const levelLower = (user.jobLevel || '').toLowerCase();

  const isHRDept = deptLower.includes('nhân sự') || deptLower.includes('hr');
  const isHeadRole = levelLower.includes('trưởng phòng') || levelLower.includes('quản lý') || roleLower.includes('trưởng phòng') || roleLower.includes('head') || roleLower.includes('quản lý') || Boolean(user.isManager);

  return isHRDept && isHeadRole;
}

/**
 * Dynamic Department Head or Above Permission Check
 * Admin, Founder, C-Level, Trưởng phòng, Quản lý, Head, Lead.
 */
export function isDeptHeadOrAboveRole(user: { isAdmin?: boolean; isManager?: boolean; role?: string; department?: string; jobLevel?: string } | null | undefined): boolean {
  if (!user) return false;
  if (user.isAdmin || user.isManager) return true;

  const roleLower = (user.role || '').toLowerCase();
  const levelLower = (user.jobLevel || '').toLowerCase();

  const headKeywords = ['founder', 'c-level', 'c suite', 'trưởng phòng', 'quản lý', 'manager', 'head', 'lead', 'admin'];
  return headKeywords.some(kw => levelLower.includes(kw) || roleLower.includes(kw));
}

/**
 * Get active HR Head staff object for dynamic name display
 */
export function getActiveHRHead(staffList: Staff[]): Staff | undefined {
  return staffList.find(s => isHRHeadRole(s)) || staffList.find(s => s.id === 'TTX030');
}

export interface ReportingPeriod {
  key: string;      // "2026-09"
  label: string;    // "Tháng 09/2026 (Kỳ hiện tại)"
  mStr: string;     // "09"
  year: number;     // 2026
  isCurrent: boolean;
}

/**
 * Returns the 3 most recent monthly reporting periods (Current month + 2 previous months)
 * Points reset monthly and history is retained for the 3 most recent months.
 */
export function get3RecentPeriods(): ReportingPeriod[] {
  const now = new Date();
  const list: ReportingPeriod[] = [];
  for (let i = 0; i < 3; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const m = d.getMonth() + 1;
    const y = d.getFullYear();
    const mStr = String(m).padStart(2, '0');
    const key = `${y}-${mStr}`;
    const label = i === 0 
      ? `Tháng ${mStr}/${y} (Kỳ hiện tại)` 
      : `Tháng ${mStr}/${y}`;
    list.push({ key, label, mStr, year: y, isCurrent: i === 0 });
  }
  return list;
}


