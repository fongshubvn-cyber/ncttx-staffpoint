import { ParameterConfig, Staff, IncidentRecord, PolicyRule, PolicyHealthStatus, BaselinePoint } from '../types';

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
 * Calculates Bậc cách làm việc / Bậc lương P2 (Bậc 1..5) from total score (0..5.0)
 * Dựa vào bảng: "ĐƠN GIÁ P2 - QUY ĐIỂM PHIẾU ĐÁNH GIÁ RA TIỀN"
 * - Bậc 5 (HS 1.10): 4.8 đến 5.0 (Vượt chuẩn rõ rệt, rất khó đạt)
 * - Bậc 4 (HS 1.00): 4.0 đến dưới 4.8 (ĐẠT CHUẨN - mức Công ty dự định trả)
 * - Bậc 3 (HS 0.90): 3.5 đến dưới 4.0 (Gần đạt chuẩn)
 * - Bậc 2 (HS 0.40): 2.5 đến dưới 3.5 (Đạt một phần)
 * - Bậc 1 (HS 0.10): 1.0 đến dưới 2.5 (Chưa đạt chuẩn vị trí)
 */
export function calculateSalaryTier(score: number, params?: ParameterConfig): number {
  const t5 = params?.tier5Threshold ? (params.tier5Threshold <= 1.0 ? params.tier5Threshold * 5.0 : params.tier5Threshold) : 4.8;
  const t4 = params?.tier4Threshold ? (params.tier4Threshold <= 1.0 ? params.tier4Threshold * 5.0 : params.tier4Threshold) : 4.0;
  const t3 = params?.tier3Threshold ? (params.tier3Threshold <= 1.0 ? params.tier3Threshold * 5.0 : params.tier3Threshold) : 3.5;
  const t2 = params?.tier2Threshold ? (params.tier2Threshold <= 1.0 ? params.tier2Threshold * 5.0 : params.tier2Threshold) : 2.5;

  if (score >= t5 - 0.001) return 5;
  if (score >= t4 - 0.001) return 4;
  if (score >= t3 - 0.001) return 3;
  if (score >= t2 - 0.001) return 2;
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

export function getDepartmentTrackName(departmentOrLine?: string): { fullName: string; shortName: string } {
  const s = (departmentOrLine || '').toLowerCase().trim();
  if (s.includes('thương mại') || s.includes('dịch vụ')) {
    return { fullName: 'Ngạch Thương Mại & Dịch Vụ', shortName: 'Ngạch Thương Mại' };
  }
  if (s.includes('nhân sự') || s.includes('hành chính') || s.includes('pháp chế')) {
    return { fullName: 'Ngạch Nhân Sự - Hành Chính - Pháp Chế', shortName: 'Ngạch Nhân Sự - HC - PC' };
  }
  if (s.includes('kế toán')) {
    return { fullName: 'Ngạch Kế Toán', shortName: 'Ngạch Kế Toán' };
  }
  if (s.includes('pha chế')) {
    return { fullName: 'Ngạch Pha Chế', shortName: 'Ngạch Pha Chế' };
  }
  if (s.includes('bếp bánh') || s.includes('bánh')) {
    return { fullName: 'Ngạch Bếp Bánh', shortName: 'Ngạch Bếp Bánh' };
  }
  if (s.includes('sản xuất')) {
    return { fullName: 'Ngạch Sản Xuất', shortName: 'Ngạch Sản Xuất' };
  }
  if (s.includes('kho') || s.includes('đóng gói')) {
    return { fullName: 'Ngạch Kho & Đóng Gói', shortName: 'Ngạch Kho & Đóng Gói' };
  }
  if (s.includes('kinh doanh') || s.includes('e-commerce') || s.includes('sàn')) {
    return { fullName: 'Ngạch Phát Triển Kinh Doanh / E-Commerce', shortName: 'Ngạch Kinh Doanh' };
  }
  return { fullName: 'Ngạch Phòng Ban', shortName: 'Ngạch Phòng Ban' };
}

export interface StaffBaselineInfo {
  generalScore: number;
  techScore: number;
  mgmtScore?: number;
  totalScore: number;
  salaryTier: number;
  departmentTrackName: string;
  departmentTrackShortName: string;
  isManager: boolean;
  weights: {
    general: number;
    tech: number;
    mgmt: number;
  };
  formulaStr: string;
}

/**
 * Tính toán điểm nền chuẩn ước tính theo sheet 📊 Điểm nền & ⚙️ Tham số của Phiếu đánh giá.xlsx:
 * Phân tách rõ ràng:
 * - Văn hóa:
 * - Ngạch phòng ban: (Ngạch TM&DV, Ngạch NSHC, Ngạch Pha chế, v.v.)
 * - Ngạch quản lý: (Áp dụng cho Quản lý)
 * 
 * Tiêu chí chuẩn hóa:
 * - Nhân viên: Văn hóa + Ngạch phòng ban (VD: 65% / 35%)
 * - Quản lý: Văn hóa + Ngạch phòng ban + Ngạch quản lý (VD: 50% / 20% / 30%)
 */
export function getStaffBaselineScores(staff: Staff, params?: ParameterConfig): StaffBaselineInfo {
  const isMgmt = isManagementRole(staff);
  const trackInfo = getDepartmentTrackName(staff.line || staff.department);
  const lineLower = (staff.line || '').toLowerCase().trim();
  const deptLower = (staff.department || '').toLowerCase().trim();

  const isTMDV = lineLower.includes('thương mại') || deptLower.includes('thương mại');
  const isNSHC = lineLower.includes('nhân sự') || deptLower.includes('nhân sự');

  // Trọng số cấu hình
  const wGen = isMgmt ? (params?.weightGeneralWithMgmt ?? 0.50) : (params?.weightGeneralNoMgmt ?? 0.65);
  const wTech = isMgmt ? (params?.weightTechWithMgmt ?? 0.20) : (params?.weightTechNoMgmt ?? 0.35);
  const wMgmt = isMgmt ? (params?.weightMgmtWithMgmt ?? 0.30) : 0;

  // Điểm thành phần từ tham số hệ thống
  // 1. Trụ cột Văn Hóa & Thái Độ: THỐNG NHẤT TOÀN NHÀ (Ưu tiên baselineCultureCommon)
  const generalScore = params?.baselineCultureCommon ?? 4.08;

  // 2. Trụ cột Ngạch Chuyên Môn Phòng Ban & 3. Trụ cột Ngạch Quản Lý
  let techScore: number;
  let mgmtScore: number | undefined = undefined;

  if (isTMDV) {
    techScore = params?.baselineTmdvTech ?? 4.06;
    if (isMgmt) {
      mgmtScore = params?.baselineTmdvMgmt ?? 4.44;
    }
  } else if (isNSHC) {
    techScore = params?.baselineNshcTech ?? 5.00;
    if (isMgmt) {
      mgmtScore = params?.baselineNshcMgmt ?? 5.00;
    }
  } else {
    // Tuyến khác
    techScore = params?.baselineOtherTech ?? 4.08;
    if (isMgmt) {
      mgmtScore = params?.baselineOtherMgmt ?? 4.08;
    }
  }

  // Tính điểm tổng chuẩn hóa từ điểm thành phần
  let totalScore: number;
  let formulaStr: string;

  if (isMgmt) {
    totalScore = Number((
      generalScore * wGen +
      techScore * wTech +
      (mgmtScore ?? 0) * wMgmt
    ).toFixed(2));
    formulaStr = `Văn hóa (${Math.round(wGen * 100)}%) + ${trackInfo.shortName} (${Math.round(wTech * 100)}%) + Ngạch Quản Lý (${Math.round(wMgmt * 100)}%)`;
  } else {
    totalScore = Number((
      generalScore * wGen +
      techScore * wTech
    ).toFixed(2));
    formulaStr = `Văn hóa (${Math.round(wGen * 100)}%) + ${trackInfo.shortName} (${Math.round(wTech * 100)}%)`;
  }

  const salaryTier = calculateSalaryTier(totalScore, params);

  return {
    generalScore,
    techScore,
    mgmtScore,
    totalScore,
    salaryTier,
    departmentTrackName: trackInfo.fullName,
    departmentTrackShortName: trackInfo.shortName,
    isManager: isMgmt,
    weights: {
      general: wGen,
      tech: wTech,
      mgmt: wMgmt,
    },
    formulaStr,
  };
}

/**
 * Tính toán danh sách bảng điểm nền ước tính chuẩn theo tham số hệ thống
 * Phân tách rõ ràng:
 * - Văn hóa:
 * - Ngạch phòng ban:
 * - Ngạch quản lý:
 */
export function getCalculatedBaselinePoints(params?: ParameterConfig): BaselinePoint[] {
  const cfg = params || {} as ParameterConfig;
  const wGenNo = cfg.weightGeneralNoMgmt ?? 0.65;
  const wTechNo = cfg.weightTechNoMgmt ?? 0.35;
  const wGenWith = cfg.weightGeneralWithMgmt ?? 0.50;
  const wTechWith = cfg.weightTechWithMgmt ?? 0.20;
  const wMgmtWith = cfg.weightMgmtWithMgmt ?? 0.30;

  // Điểm thành phần
  const bCultureCommon = cfg.baselineCultureCommon ?? 4.08;
  const bTmdvGen = cfg.baselineTmdvGeneral ?? 4.26;
  const bTmdvTech = cfg.baselineTmdvTech ?? 5.00;
  const bTmdvMgmt = cfg.baselineTmdvMgmt ?? 3.54;

  const bNshcGen = cfg.baselineNshcGeneral ?? 4.08;
  const bNshcTech = cfg.baselineNshcTech ?? 5.00;
  const bNshcMgmt = cfg.baselineNshcMgmt ?? 5.00;

  const bOtherTech = cfg.baselineOtherTech ?? 4.08;
  const bOtherMgmt = cfg.baselineOtherMgmt ?? 4.08;

  // Tính tổng
  const scoreTmdvStaff = Number((bTmdvGen * wGenNo + bTmdvTech * wTechNo).toFixed(2));
  const scoreTmdvMgmt = Number((bTmdvGen * wGenWith + bTmdvTech * wTechWith + bTmdvMgmt * wMgmtWith).toFixed(2));
  const scoreNshcStaff = Number((bNshcGen * wGenNo + bNshcTech * wTechNo).toFixed(2));
  const scoreNshcMgmt = Number((bNshcGen * wGenWith + bNshcTech * wTechWith + bNshcMgmt * wMgmtWith).toFixed(2));
  const scoreCommonStaff = Number((bCultureCommon * wGenNo + bOtherTech * wTechNo).toFixed(2));
  const scoreCommonMgmt = Number((bCultureCommon * wGenWith + bOtherTech * wTechWith + bOtherMgmt * wMgmtWith).toFixed(2));

  return [
    {
      lineFormName: 'Thương mại & Dịch vụ, nhân viên',
      baselineScore: scoreTmdvStaff,
      salaryTier: calculateSalaryTier(scoreTmdvStaff, params),
      roleType: 'Nhân viên',
      trackName: 'Ngạch Thương Mại & Dịch Vụ',
      generalScore: bTmdvGen,
      techScore: bTmdvTech,
      formulaStr: `Văn hóa (${bTmdvGen.toFixed(2)}) × ${Math.round(wGenNo * 100)}% + Ngạch TM (${bTmdvTech.toFixed(2)}) × ${Math.round(wTechNo * 100)}%`,
      weightsStr: `${Math.round(wGenNo * 100)}% VH / ${Math.round(wTechNo * 100)}% TM`,
      note: 'Áp dụng Khung chung + Tiêu chí chuyên môn TM&DV (TC1 - TC7).'
    },
    {
      lineFormName: 'Thương mại & Dịch vụ, quản lý',
      baselineScore: scoreTmdvMgmt,
      salaryTier: calculateSalaryTier(scoreTmdvMgmt, params),
      roleType: 'Quản lý',
      trackName: 'Ngạch Thương Mại & Dịch Vụ',
      generalScore: bTmdvGen,
      techScore: bTmdvTech,
      mgmtScore: bTmdvMgmt,
      formulaStr: `Văn hóa (${bTmdvGen.toFixed(2)}) × ${Math.round(wGenWith * 100)}% + Ngạch TM (${bTmdvTech.toFixed(2)}) × ${Math.round(wTechWith * 100)}% + Ngạch QL (${bTmdvMgmt.toFixed(2)}) × ${Math.round(wMgmtWith * 100)}%`,
      weightsStr: `${Math.round(wGenWith * 100)}% VH / ${Math.round(wTechWith * 100)}% TM / ${Math.round(wMgmtWith * 100)}% QL`,
      note: 'Áp dụng Khung chung + Chuyên môn + Ngạch Quản lý (QH1 - QH4).'
    },
    {
      lineFormName: 'Nhân sự - Hành chính - Pháp chế, nhân viên',
      baselineScore: scoreNshcStaff,
      salaryTier: calculateSalaryTier(scoreNshcStaff, params),
      roleType: 'Nhân viên',
      trackName: 'Ngạch Nhân Sự - HC - PC',
      generalScore: bNshcGen,
      techScore: bNshcTech,
      formulaStr: `Văn hóa (${bNshcGen.toFixed(2)}) × ${Math.round(wGenNo * 100)}% + Ngạch NS (${bNshcTech.toFixed(2)}) × ${Math.round(wTechNo * 100)}%`,
      weightsStr: `${Math.round(wGenNo * 100)}% VH / ${Math.round(wTechNo * 100)}% NS`,
      note: 'Áp dụng Khung chung + Tiêu chí chuyên môn Nhân sự.'
    },
    {
      lineFormName: 'Nhân sự - Hành chính - Pháp chế, quản lý',
      baselineScore: scoreNshcMgmt,
      salaryTier: calculateSalaryTier(scoreNshcMgmt, params),
      roleType: 'Quản lý',
      trackName: 'Ngạch Nhân Sự - HC - PC',
      generalScore: bNshcGen,
      techScore: bNshcTech,
      mgmtScore: bNshcMgmt,
      formulaStr: `Văn hóa (${bNshcGen.toFixed(2)}) × ${Math.round(wGenWith * 100)}% + Ngạch NS (${bNshcTech.toFixed(2)}) × ${Math.round(wTechWith * 100)}% + Ngạch QL (${bNshcMgmt.toFixed(2)}) × ${Math.round(wMgmtWith * 100)}%`,
      weightsStr: `${Math.round(wGenWith * 100)}% VH / ${Math.round(wTechWith * 100)}% NS / ${Math.round(wMgmtWith * 100)}% QL`,
      note: 'Áp dụng Khung chung + Chuyên môn + Ngạch Quản lý.'
    },
    {
      lineFormName: 'Tuyến chưa có ngạch riêng, nhân viên',
      baselineScore: scoreCommonStaff,
      salaryTier: calculateSalaryTier(scoreCommonStaff, params),
      roleType: 'Nhân viên',
      trackName: 'Ngạch Phòng Ban',
      generalScore: bCultureCommon,
      techScore: bOtherTech,
      formulaStr: `Văn hóa (${bCultureCommon.toFixed(2)}) × ${Math.round(wGenNo * 100)}% + Ngạch PB (${bOtherTech.toFixed(2)}) × ${Math.round(wTechNo * 100)}%`,
      weightsStr: `${Math.round(wGenNo * 100)}% VH / ${Math.round(wTechNo * 100)}% PB`,
      note: 'Pha chế, Sản xuất, Kho & Đóng gói, Kinh doanh... chưa có ngạch riêng.'
    },
    {
      lineFormName: 'Tuyến chưa có ngạch riêng, quản lý',
      baselineScore: scoreCommonMgmt,
      salaryTier: calculateSalaryTier(scoreCommonMgmt, params),
      roleType: 'Quản lý',
      trackName: 'Ngạch Phòng Ban',
      generalScore: bCultureCommon,
      techScore: bOtherTech,
      mgmtScore: bOtherMgmt,
      formulaStr: `Văn hóa (${bCultureCommon.toFixed(2)}) × ${Math.round(wGenWith * 100)}% + Ngạch PB (${bOtherTech.toFixed(2)}) × ${Math.round(wTechWith * 100)}% + Ngạch QL (${bOtherMgmt.toFixed(2)}) × ${Math.round(wMgmtWith * 100)}%`,
      weightsStr: `${Math.round(wGenWith * 100)}% VH / ${Math.round(wTechWith * 100)}% PB / ${Math.round(wMgmtWith * 100)}% QL`,
      note: 'Quản lý các tuyến kế thừa Khung chung + Quản lý.'
    }
  ];
}

export interface SalaryTierBadgeInfo {
  tier: number;
  name: string;
  label: string;
  shortLabel: string;
  coefficient: number;
  coefficientStr: string;
  meaning: string;
  scoreRange: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
}

export function getSalaryTierBadge(tier: number): SalaryTierBadgeInfo {
  switch (tier) {
    case 5:
      return {
        tier: 5,
        name: 'Bậc 5',
        label: 'Bậc 5 (HS: 1.10 - Vượt chuẩn)',
        shortLabel: 'Bậc 5',
        coefficient: 1.10,
        coefficientStr: '1,10',
        meaning: 'Vượt chuẩn rõ rệt, rất khó đạt',
        scoreRange: '4,8 đến 5,0',
        bgClass: 'bg-[#1B4332]',
        textClass: 'text-[#52B788]',
        borderClass: 'border-[#2D6A4F]',
      };
    case 4:
      return {
        tier: 4,
        name: 'Bậc 4',
        label: 'Bậc 4 (HS: 1.00 - Đạt chuẩn)',
        shortLabel: 'Bậc 4',
        coefficient: 1.00,
        coefficientStr: '1,00',
        meaning: 'ĐẠT CHUẨN - mức Công ty dự định trả',
        scoreRange: '4,0 đến dưới 4,8',
        bgClass: 'bg-emerald-100',
        textClass: 'text-[#1B4332]',
        borderClass: 'border-emerald-300',
      };
    case 3:
      return {
        tier: 3,
        name: 'Bậc 3',
        label: 'Bậc 3 (HS: 0.90 - Gần đạt chuẩn)',
        shortLabel: 'Bậc 3',
        coefficient: 0.90,
        coefficientStr: '0,90',
        meaning: 'Gần đạt chuẩn',
        scoreRange: '3,5 đến dưới 4,0',
        bgClass: 'bg-sky-100',
        textClass: 'text-sky-900',
        borderClass: 'border-sky-300',
      };
    case 2:
      return {
        tier: 2,
        name: 'Bậc 2',
        label: 'Bậc 2 (HS: 0.40 - Đạt một phần)',
        shortLabel: 'Bậc 2',
        coefficient: 0.40,
        coefficientStr: '0,40',
        meaning: 'Đạt một phần',
        scoreRange: '2,5 đến dưới 3,5',
        bgClass: 'bg-orange-100',
        textClass: 'text-[#DD6B20]',
        borderClass: 'border-orange-300',
      };
    case 1:
    default:
      return {
        tier: 1,
        name: 'Bậc 1',
        label: 'Bậc 1 (HS: 0.10 - Chưa đạt chuẩn)',
        shortLabel: 'Bậc 1',
        coefficient: 0.10,
        coefficientStr: '0,10',
        meaning: 'Chưa đạt chuẩn vị trí',
        scoreRange: '1,0 đến dưới 2,5',
        bgClass: 'bg-rose-100',
        textClass: 'text-rose-700',
        borderClass: 'border-rose-300',
      };
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

export type IncidentTargetPillar = 'general' | 'tech' | 'mgmt';

/**
 * Phân luồng chính xác phiếu phản hồi / biên bản tác động vào cột trụ nào:
 * 1. 'mgmt': Ngạch Quản Lý
 * 2. 'tech': Ngạch Chuyên Môn Phòng Ban
 * 3. 'general': Văn Hóa & Thái Độ (Mặc định)
 */
export function getIncidentTargetPillar(incident: any): IncidentTargetPillar {
  if (!incident) return 'general';
  const title = (incident.title || '').toLowerCase();
  const desc = (incident.description || '').toLowerCase();
  const group = (incident.groupCode || '').toUpperCase();
  const cat = (incident.category || '').toLowerCase();

  // 1. Ngạch Quản Lý
  if (
    group.startsWith('Q') || 
    group.startsWith('QH') || 
    title.includes('quản lý') || 
    desc.includes('ngạch quản lý') ||
    cat === 'quản lý'
  ) {
    return 'mgmt';
  }

  // 2. Ngạch Chuyên Môn Phòng Ban
  if (
    title.includes('chuyên môn') || 
    title.includes('nghiệp vụ') || 
    title.includes('phòng ban') ||
    desc.includes('chuyên môn') ||
    cat === 'chuyên môn' || 
    cat === 'phòng ban' ||
    group.startsWith('B') || 
    group.startsWith('C') || 
    group.startsWith('TC') || 
    group.startsWith('HC') || 
    group.startsWith('N') || 
    group.startsWith('PC') ||
    group.startsWith('KD')
  ) {
    return 'tech';
  }

  // 3. Văn Hóa & Thái Độ (Mặc định)
  return 'general';
}

/**
 * Calculates a staff member's scores (General Score, Tech Score, Mgmt Score, Total Score, Salary Tier)
 * dynamically for a specific monthly reporting period (e.g. "2026-10" vs "2026-09").
 * 
 * Rules:
 * - Each month is an independent evaluation cycle.
 * - Base general score starts at baseline (e.g. 4.08).
 * - ONLY non-deleted approved tickets recorded in that SPECIFIC period impact the score.
 * - Each ticket impacts the exact pillar it belongs to (Văn hóa, Chuyên môn, hoặc Quản lý).
 */
export function getStaffScoresForPeriod(
  staff: Staff,
  periodKey: string,
  incidents: any[],
  params: ParameterConfig
): {
  generalScore: number;
  techScore: number;
  hasCustomTechScore?: boolean;
  mgmtScore: number;
  hasCustomMgmtScore?: boolean;
  totalScore: number;
  salaryTier: number;
  violationsCount: number;
  recognitionsCount: number;
  departmentTrackName?: string;
  departmentTrackShortName?: string;
  hasMgmt?: boolean;
  weights?: { general: number; tech: number; mgmt: number };
  formulaStr?: string;
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
    i => (i.type === 'ghi_nhan' && (i.status === 'Đã duyệt' || i.status === 'Đã ghi nhận')) || 
         (i.type === 'vi_pham' && i.status !== 'Kháng nghị được chấp nhận')
  );

  const violationsCount = approvedIncidents.filter(i => i.type === 'vi_pham').length;
  const recognitionsCount = approvedIncidents.filter(i => i.type === 'ghi_nhan').length;

  const baselines = getStaffBaselineScores(staff, params);
  const hasMgmt = isManagementRole(staff);

  // Scores start from baseline
  let generalScore = baselines.generalScore;
  let techScore = baselines.techScore;
  let mgmtScore = hasMgmt ? (baselines.mgmtScore ?? 0) : 0;

  // Distribute impact points into the EXACT pillar
  approvedIncidents.forEach(inc => {
    if (typeof inc.impactPoints === 'number' && !isNaN(inc.impactPoints) && inc.impactPoints !== 0) {
      const pillar = getIncidentTargetPillar(inc);
      if (pillar === 'mgmt' && hasMgmt) {
        mgmtScore += inc.impactPoints;
      } else if (pillar === 'tech') {
        techScore += inc.impactPoints;
      } else {
        generalScore += inc.impactPoints;
      }
    }
  });

  generalScore = Math.max(0, Math.min(5, Number(generalScore.toFixed(2))));
  techScore = Math.max(0, Math.min(5, Number(techScore.toFixed(2))));
  if (hasMgmt) {
    mgmtScore = Math.max(0, Math.min(5, Number(mgmtScore.toFixed(2))));
  }

  const totalScore = approvedIncidents.length === 0
    ? baselines.totalScore
    : calculateTotalScore(
        generalScore,
        techScore,
        hasMgmt ? mgmtScore : undefined,
        params
      );

  const salaryTier = calculateSalaryTier(totalScore, params);

  return {
    generalScore,
    techScore,
    hasCustomTechScore: false,
    mgmtScore,
    hasCustomMgmtScore: false,
    totalScore,
    salaryTier,
    violationsCount,
    recognitionsCount,
    departmentTrackName: baselines.departmentTrackName,
    departmentTrackShortName: baselines.departmentTrackShortName,
    hasMgmt,
    weights: baselines.weights,
    formulaStr: baselines.formulaStr,
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
  _staffList?: Staff[]
): boolean {
  if (!user) return true;

  const cleanUserId = (user.id || '').trim().toUpperCase();
  const cleanReporterId = (incident.reporterId || '').trim().toUpperCase();
  const cleanTargetId = (incident.targetId || '').trim().toUpperCase();

  // 1. Liên quan trực tiếp (Người nhận phiếu HOẶC Người lập phiếu) -> Luôn thấy
  if (cleanUserId === cleanReporterId || cleanUserId === cleanTargetId) {
    return true;
  }

  // 2. CHỈ Admin hệ thống mới xem được toàn bộ phiếu của mọi nhân sự
  const isAdmin = Boolean(
    user.isAdmin || 
    cleanUserId === 'ADMIN' || 
    (user.jobLevel || '').toLowerCase() === 'admin'
  );
  if (isAdmin) {
    return true;
  }

  // Mọi người dùng khác chỉ thấy phiếu của bản thân mình
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
  const cleanUserId = (user.id || '').trim().toUpperCase();
  const isAdmin = Boolean(
    user.isAdmin || 
    cleanUserId === 'ADMIN' || 
    (user.jobLevel || '').toLowerCase() === 'admin'
  );

  // 1. Chỉ Admin mới có thể thấy nhân viên khác
  if (isAdmin) {
    return staffList;
  }

  // 2. Mọi cá nhân khác chỉ thấy chính bản thân mình
  const selfStaff = staffList.filter(s => s.id.trim().toUpperCase() === cleanUserId);
  if (selfStaff.length > 0) {
    return selfStaff;
  }

  // Fallback nếu tài khoản chưa nằm trong seed
  return [{
    id: user.id || 'ME',
    name: (user as any).name || 'Bản thân',
    role: user.role || 'Nhân viên',
    positionCategory: 'Thành viên',
    department: user.department || '',
    line: '',
    speechCapability: 'Người nói',
    location: 'Văn phòng',
    status: 'Chính thức',
    evaluationCount: 0,
    generalScore: 5.0,
    techScore: 5.0,
    mgmtScore: 5.0,
    totalScore: 5.0,
    salaryTier: 5,
    jobLevel: user.jobLevel || 'Nhân sự',
    isManager: false,
  }];
}

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


