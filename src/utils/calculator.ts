import { ParameterConfig, Staff, IncidentRecord, PolicyRule, PolicyHealthStatus } from '../types';

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

/**
 * Calculates a staff member's scores (General Score, Tech Score, Mgmt Score, Total Score, Salary Tier)
 * dynamically for a specific monthly reporting period (e.g. "2026-10" vs "2026-09").
 * 
 * Rules:
 * - Each month is an independent evaluation cycle.
 * - Base general score starts at 5.0 (or staff.generalScore base).
 * - ONLY non-deleted approved tickets recorded in that SPECIFIC period impact the score.
 * - Tickets from previous months stay in their respective month and DO NOT carry over into the new month!
 */
export function getStaffScoresForPeriod(
  staff: Staff,
  periodKey: string,
  incidents: any[],
  params: ParameterConfig
): {
  generalScore: number;
  techScore: number;
  mgmtScore: number;
  totalScore: number;
  salaryTier: number;
  violationsCount: number;
  recognitionsCount: number;
} {
  const [yStr, mStr] = periodKey.split('-');
  const patternSlash = `${mStr}/${yStr}`; // "10/2026"
  const patternDash = `${yStr}-${mStr}`;  // "2026-10"

  const periodIncidents = incidents.filter(inc => {
    if (!inc || inc.isDeleted) return false;
    if (inc.targetId !== staff.id) return false;

    if (inc.createdAt && inc.createdAt.startsWith(patternDash)) return true;
    if (inc.date) {
      if (inc.date.includes(patternSlash) || inc.date.includes(patternDash)) return true;
    }
    return false;
  });

  const approvedIncidents = periodIncidents.filter(
    i => i.status === 'Đã duyệt' || (i.type === 'vi_pham' && i.status !== 'Kháng nghị được chấp nhận')
  );

  const violationsCount = approvedIncidents.filter(i => i.type === 'vi_pham').length;
  const recognitionsCount = approvedIncidents.filter(i => i.type === 'ghi_nhan').length;

  let generalScore = 5.0;
  approvedIncidents.forEach(inc => {
    if (typeof inc.impactPoints === 'number' && !isNaN(inc.impactPoints)) {
      generalScore += inc.impactPoints;
    }
  });

  generalScore = Math.max(0, Math.min(5, Number(generalScore.toFixed(2))));
  const techScore = typeof staff.techScore === 'number' ? staff.techScore : 4.0;
  const hasMgmt = isManagementRole(staff);
  const mgmtScore = hasMgmt ? (typeof staff.mgmtScore === 'number' ? staff.mgmtScore : 4.0) : 0;

  const totalScore = calculateTotalScore(
    generalScore,
    techScore,
    hasMgmt ? mgmtScore : undefined,
    params
  );

  const salaryTier = calculateSalaryTier(totalScore, params);

  return {
    generalScore,
    techScore,
    mgmtScore,
    totalScore,
    salaryTier,
    violationsCount,
    recognitionsCount,
  };
}

/**
 * Permission Check: Can user view a specific incident ticket?
 * - Trưởng phòng / HR Head / C-Level / Admin: sees ALL tickets across company
 * - Quản lý / Lead / Trưởng ca: sees self tickets (as target or reporter) PLUS tickets of DIRECT SUBORDINATES in their department/line (excludes tickets written about superiors/managers).
 * - Regular Staff (Nhân sự thường): sees ONLY tickets where they are target or reporter
 */
export function canUserViewIncident(
  user: { id?: string; isAdmin?: boolean; isManager?: boolean; role?: string; department?: string; jobLevel?: string } | null | undefined,
  incident: { reporterId?: string; targetId?: string },
  staffList: Staff[]
): boolean {
  if (!user) return true;

  const cleanUserId = (user.id || '').trim().toUpperCase();
  const cleanReporterId = (incident.reporterId || '').trim().toUpperCase();
  const cleanTargetId = (incident.targetId || '').trim().toUpperCase();

  // 1. Direct involvement (User is target OR reporter) -> Always viewable
  if (cleanUserId === cleanReporterId || cleanUserId === cleanTargetId) {
    return true;
  }

  // 2. ONLY System Admin and HR Head (Trưởng phòng Nhân sự) can view tickets of ALL staff across the company
  if (user.isAdmin || cleanUserId === 'ADMIN' || isHRHeadRole(user)) {
    return true;
  }

  // 3. Other Department Heads / Managers / Leads of specific lines -> ONLY see tickets within their own line/department
  const roleLower = (user.role || '').toLowerCase();
  const levelLower = (user.jobLevel || '').toLowerCase();
  const userDept = (user.department || '').trim().toLowerCase();

  const isManagerOrLead = ['founder', 'ceo', 'c-level', 'c suite', 'trưởng phòng', 'head of', 'admin', 'quản lý', 'manager', 'lead', 'cửa hàng trưởng', 'trưởng ca'].some(
    kw => levelLower.includes(kw) || roleLower.includes(kw)
  ) || Boolean(user.isManager);

  if (isManagerOrLead) {
    const targetStaff = staffList.find(s => s.id.trim().toUpperCase() === cleanTargetId);
    const reporterStaff = staffList.find(s => s.id.trim().toUpperCase() === cleanReporterId);

    // Exclude tickets targeting superiors/upper management unless directly involved
    if (targetStaff) {
      const targetRoleLower = (targetStaff.role || '').toLowerCase();
      const targetLevelLower = (targetStaff.jobLevel || '').toLowerCase();
      const isTargetSuperior = ['founder', 'ceo', 'c-level', 'c suite', 'trưởng phòng', 'head of', 'admin'].some(
        kw => targetLevelLower.includes(kw) || targetRoleLower.includes(kw)
      );
      if (isTargetSuperior) {
        return false;
      }
    }

    const isMatch = (s: Staff | undefined) => {
      if (!s || !userDept) return false;
      const sDept = (s.department || '').trim().toLowerCase();
      const sLine = (s.line || '').trim().toLowerCase();
      return (
        sDept === userDept || sLine === userDept ||
        (userDept.length > 2 && sDept.includes(userDept)) ||
        (userDept.length > 2 && sLine.includes(userDept)) ||
        (sDept.length > 2 && userDept.includes(sDept)) ||
        (sLine.length > 2 && userDept.includes(sLine))
      );
    };

    if (isMatch(targetStaff) || isMatch(reporterStaff)) {
      return true;
    }
  }

  // 4. Regular staff: False
  return false;
}

/**
 * Determines rank hierarchy level for staff scoping:
 * Level 4: Admin, HR Head, Founder, CEO, C-Level (Full Company Visibility)
 * Level 3: Quản lý, Trưởng phòng (Non-HR Department Manager)
 * Level 2: Lead, Trưởng ca, Cửa hàng trưởng (Line Lead / Team Lead)
 * Level 1: Regular Staff (Nhân sự thường)
 */
export function getStaffRank(staff: { id?: string; isAdmin?: boolean; isManager?: boolean; role?: string; department?: string; jobLevel?: string } | null | undefined): number {
  if (!staff) return 1;
  const cleanId = (staff.id || '').trim().toUpperCase();
  if (staff.isAdmin || cleanId === 'ADMIN' || isHRHeadRole(staff)) {
    return 4;
  }

  const roleLower = (staff.role || '').toLowerCase();
  const levelLower = (staff.jobLevel || '').toLowerCase();

  const isLevel4 = ['founder', 'ceo', 'c-level', 'c suite', 'chủ tịch'].some(
    kw => levelLower.includes(kw) || roleLower.includes(kw)
  );
  if (isLevel4) return 4;

  const isLevel3 = ['trưởng phòng', 'quản lý', 'manager', 'head of'].some(
    kw => levelLower.includes(kw) || roleLower.includes(kw)
  );
  if (isLevel3) return 3;

  const isLevel2 = ['lead', 'trưởng ca', 'cửa hàng trưởng'].some(
    kw => levelLower.includes(kw) || roleLower.includes(kw)
  ) || Boolean(staff.isManager);
  if (isLevel2) return 2;

  return 1;
}

/**
 * Permission Check: Returns staff list visible to user
 * Scoping rule: Quản lý > Lead > Nhân sự
 * - Level 4 (Admin / HR Head / Top Leadership): sees ALL staff across the company
 * - Level 3 (Quản lý / Trưởng phòng): sees self + subordinate Leads (Level 2) and Staff (Level 1) in their department/line
 * - Level 2 (Lead / Trưởng ca): sees self + subordinate Regular Staff (Level 1) in their department/line
 * - Level 1 (Nhân sự thường): sees self only
 */
export function getVisibleStaffListForUser(
  user: { id?: string; isAdmin?: boolean; isManager?: boolean; role?: string; department?: string; jobLevel?: string } | null | undefined,
  staffList: Staff[]
): Staff[] {
  if (!user) return staffList;

  const userRank = getStaffRank(user);
  if (userRank >= 4) {
    return staffList;
  }

  const cleanUserId = (user.id || '').trim().toUpperCase();
  const userStaff = staffList.find(s => s.id.trim().toUpperCase() === cleanUserId);

  const cleanText = (str: string) => str.toLowerCase().replace(/[^\w\sàáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]/gi, '').trim();

  const userDept = cleanText(userStaff?.department || user.department || '');
  const userLine = cleanText(userStaff?.line || '');

  return staffList.filter(s => {
    const sId = s.id.trim().toUpperCase();
    if (sId === cleanUserId) return true; // Always see self

    const sRank = getStaffRank(s);

    // Rule: User can ONLY see staff with STRICTLY LOWER rank than themselves (subordinates)
    if (sRank >= userRank) {
      return false;
    }

    // Must be in the user's department or line
    const sDept = cleanText(s.department || '');
    const sLine = cleanText(s.line || '');

    const isMatch = Boolean(
      (userDept && sDept && (sDept.includes(userDept) || userDept.includes(sDept))) ||
      (userLine && sLine && (sLine.includes(userLine) || userLine.includes(sLine))) ||
      (userDept && sLine && (sLine.includes(userDept) || userDept.includes(sLine))) ||
      (userLine && sDept && (sDept.includes(userLine) || userLine.includes(sDept)))
    );

    return isMatch;
  });
}

/**
 * Returns Policy Health Status object (Tốt, Cần chú ý, Nghiêm trọng, Đình chỉ vĩnh viễn)
 * based on the 100-point Internal Policy system inspired by Account Health.
 */
export function getPolicyHealthStatus(score: number): PolicyHealthStatus {
  const safeScore = Math.max(0, Math.min(100, score));

  if (safeScore >= 80) {
    return {
      score: safeScore,
      level: 'Tốt',
      color: '#10B981',
      badgeClass: 'bg-emerald-100 text-[#1B4332] border-emerald-300',
      advice: 'Tài khoản & Điểm nội quy của bạn ở trạng thái tốt (80 - 100). Hãy tiếp tục phát huy!',
      enforcementAction: 'Không cưỡng chế.',
    };
  } else if (safeScore >= 50) {
    return {
      score: safeScore,
      level: 'Cần chú ý',
      color: '#F59E0B',
      badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
      advice: 'Tài khoản ở mức Cần chú ý (50 - 79). Cần rà soát lại các nội quy vi phạm để tránh bị khóa quyền lợi thưởng.',
      enforcementAction: 'Nhắc nhở ca làm việc & Tạm khóa đề xuất khen thưởng / tăng lương trong tháng.',
    };
  } else if (safeScore >= 20) {
    return {
      score: safeScore,
      level: 'Nghiêm trọng',
      color: '#F97316',
      badgeClass: 'bg-orange-100 text-orange-900 border-orange-300',
      advice: 'Cảnh báo: Điểm nội quy giảm chạm mức Nghiêm trọng (20 - 49)! Hãy hoàn thành bài kiểm tra khắc phục.',
      enforcementAction: 'Tạm đình chỉ ca làm việc 3-7 ngày & Hạ 1 bậc làm việc (P2).',
    };
  } else {
    return {
      score: safeScore,
      level: 'Đình chỉ vĩnh viễn',
      color: '#EF4444',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
      advice: 'Tài khoản vi phạm mức kỷ luật cao nhất (Dưới 20 điểm)!',
      enforcementAction: 'Đình chỉ công tác & Xem xét đơn phương chấm dứt hợp đồng lao động.',
    };
  }
}

/**
 * Calculates a staff member's 100-point Policy Score for a specific monthly period.
 * Starts at 100 points, deducting penalty points for each policy violation in that month.
 */
export function getStaffPolicyScoreForPeriod(
  staff: Staff,
  periodKey: string,
  incidents: IncidentRecord[],
  params: ParameterConfig
): {
  policyScore: number;
  totalDeduction: number;
  violations: IncidentRecord[];
  statusObj: PolicyHealthStatus;
} {
  const [yStr, mStr] = periodKey.split('-');
  const patternSlash = `${mStr}/${yStr}`; // "10/2026"
  const patternDash = `${yStr}-${mStr}`;  // "2026-10"

  const defaultScore = params.defaultPolicyScore ?? 100;
  const rules = params.policyRules || [];

  const periodIncidents = incidents.filter(inc => {
    if (!inc || inc.isDeleted) return false;
    if (inc.targetId !== staff.id) return false;
    if (inc.type !== 'vi_pham') return false;
    if (inc.status === 'Kháng nghị được chấp nhận') return false;

    if (inc.createdAt && inc.createdAt.startsWith(patternDash)) return true;
    if (inc.date) {
      if (inc.date.includes(patternSlash) || inc.date.includes(patternDash)) return true;
    }
    return false;
  });

  let totalDeduction = 0;

  periodIncidents.forEach(inc => {
    if (typeof inc.policyPenaltyPoints === 'number' && !isNaN(inc.policyPenaltyPoints)) {
      totalDeduction += inc.policyPenaltyPoints;
    } else if (inc.policyRuleId) {
      const matchedRule = rules.find(r => r.id === inc.policyRuleId || r.code === inc.policyRuleId);
      if (matchedRule) {
        totalDeduction += matchedRule.penaltyPoints;
      } else {
        totalDeduction += 10;
      }
    } else {
      // Severity default deduction
      switch (inc.severity) {
        case 'Nghiêm trọng':
          totalDeduction += 20;
          break;
        case 'Vừa':
          totalDeduction += 10;
          break;
        case 'Nhẹ':
        default:
          totalDeduction += 5;
          break;
      }
    }
  });

  const finalScore = Math.max(0, defaultScore - totalDeduction);
  const statusObj = getPolicyHealthStatus(finalScore);

  return {
    policyScore: finalScore,
    totalDeduction,
    violations: periodIncidents,
    statusObj,
  };
}


