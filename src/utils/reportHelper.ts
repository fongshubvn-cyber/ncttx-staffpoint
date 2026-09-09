import { Staff, Question, IncidentRecord, DepartmentLine, ParameterConfig } from '../types';
import { isManagementRole } from './calculator';

export interface EvaluatedCriterion {
  id: string;
  groupCode: string;
  groupName: string;
  text: string;
  category: string; // 'Chung' | 'Phòng ban' | 'Quản lý' | 'Ranh giới'
  trackName: string; // 'Văn hóa chung' | 'Chuyên môn phòng ban' | 'Quản lý'
  basePoints: number;
  violationsCount: number;
  recognitionsCount: number;
  penaltyPoints: number;
  bonusPoints: number;
  effectiveScore: number;
  status: '✅ Đạt chuẩn' | '⚠️ Cần cải thiện (bổ sung)' | '❌ Có vi phạm' | '🌟 Khen thưởng';
  matchedIncidents: IncidentRecord[];
}

export interface GroupScoreDetail {
  groupCode: string;
  groupName: string;
  category: string;
  trackCategory: 'common' | 'dept' | 'mgmt';
  trackName: string;
  subCriteriaCount: number;
  basePoints: number;
  violationsCount: number;
  recognitionsCount: number;
  penaltyPoints: number;
  bonusPoints: number;
  achievedScore: number;
  items: EvaluatedCriterion[];
}

export interface TrackScoreInfo {
  trackKey: 'general' | 'tech' | 'mgmt';
  trackName: string;
  departmentName?: string;
  score: number;
  weightPercent: number;
  weightDecimal: number;
  weightedContribution: number;
  isApplicable: boolean;
  criteriaCount: number;
  description: string;
}

/**
 * Filter questions/criteria applicable to a specific staff member based on:
 * 1. General Culture criteria ('Chung' / 'VH') -> Applies to ALL personnel in company
 * 2. Department/Line criteria ('Phòng ban' / 'Chuyên môn') -> Applies to staff belonging to that line/department
 * 3. Management criteria ('Quản lý') -> Applies to staff holding a management role (Lead, Manager, Trưởng phòng...)
 */
export function getStaffCriteriaBreakdown(
  staff: Staff,
  questions: Question[],
  lines: DepartmentLine[],
  periodIncidents: IncidentRecord[]
): {
  evaluatedCriteria: EvaluatedCriterion[];
  commonCriteria: EvaluatedCriterion[];
  deptCriteria: EvaluatedCriterion[];
  mgmtCriteria: EvaluatedCriterion[];
  groupedDetails: GroupScoreDetail[];
  commonGroups: GroupScoreDetail[];
  deptGroups: GroupScoreDetail[];
  mgmtGroups: GroupScoreDetail[];
  totalViolations: number;
  totalRecognitions: number;
} {
  const isMgmt = isManagementRole(staff);
  const staffDeptLower = (staff.department || '').toLowerCase().trim();
  const staffLineLower = (staff.line || '').toLowerCase().trim();

  // Find lineId of staff
  const matchedLine = lines.find(l => {
    const lName = l.name.toLowerCase().trim();
    const lId = l.id.toLowerCase().trim();
    return lName === staffDeptLower || lName === staffLineLower || lId === staffDeptLower || lId === staffLineLower ||
      staffDeptLower.includes(lName) || staffLineLower.includes(lName) || lName.includes(staffDeptLower) || lName.includes(staffLineLower);
  });

  const staffLineId = matchedLine ? matchedLine.id : undefined;

  // Incidents for this staff member in current period
  const staffPeriodIncidents = periodIncidents.filter(
    i => !i.isDeleted && i.targetId === staff.id
  );

  const evaluatedCriteria: EvaluatedCriterion[] = questions.filter(q => q.active !== false).map(q => {
    const qCat = q.category || 'Chung';
    const isGeneral = qCat === 'Chung' || qCat === 'Ranh giới' || q.groupCode.startsWith('VH');
    const isMgmtCriterion = qCat === 'Quản lý' || q.groupCode.startsWith('Q') || q.groupCode.startsWith('QH');
    
    let isApplicable = false;
    let trackName = 'Văn hóa chung';

    if (isGeneral) {
      isApplicable = true;
      trackName = 'Văn hóa chung';
    } else if (isMgmtCriterion) {
      isApplicable = isMgmt;
      trackName = 'Quản lý & Lãnh đạo';
    } else {
      // Department/Line specific criteria
      trackName = `Chuyên môn ngạch (${staff.line || staff.department || 'Phòng ban'})`;
      
      if (q.lineId) {
        if (staffLineId && q.lineId === staffLineId) {
          isApplicable = true;
        } else {
          // Fallback fuzzy match lineId or line name
          const qLineIdLower = q.lineId.toLowerCase();
          if (staffLineLower.includes(qLineIdLower) || staffDeptLower.includes(qLineIdLower) ||
              (staffLineLower.includes('thương mại') && qLineIdLower.includes('tm')) ||
              (staffLineLower.includes('sản xuất') && (qLineIdLower.includes('san_xuat') || qLineIdLower.includes('bep'))) ||
              (staffLineLower.includes('pha chế') && qLineIdLower.includes('pha_che')) ||
              (staffLineLower.includes('kho') && qLineIdLower.includes('kho')) ||
              (staffLineLower.includes('nhân sự') && (qLineIdLower.includes('hr') || qLineIdLower.includes('nhan_su'))) ||
              (staffLineLower.includes('kinh doanh') && qLineIdLower.includes('bd')) ||
              (staffLineLower.includes('e-commerce') && qLineIdLower.includes('ecommerce'))) {
            isApplicable = true;
          }
        }
      } else {
        // If lineId is not specified on question, default to true for Department category
        isApplicable = true;
      }
    }

    if (!isApplicable) return null;

    // Match incidents for this question / groupCode
    const matchedIncidents = staffPeriodIncidents.filter(
      inc => inc.questionId === q.id || inc.groupCode === q.groupCode
    );

    const violations = matchedIncidents.filter(i => i.type === 'vi_pham');
    const recognitions = matchedIncidents.filter(i => i.type === 'ghi_nhan');

    const penaltyPoints = violations.reduce((acc, i) => acc + Math.abs(i.impactPoints || 0), 0);
    const bonusPoints = recognitions.reduce((acc, i) => acc + (i.impactPoints || 0), 0);

    // Determine baseline for criterion:
    // If q.defaultPoints is > 0 use it; otherwise default to staff track baseline (e.g. staff.generalScore, staff.techScore, staff.mgmtScore)
    const trackBase = isGeneral ? (staff.generalScore || 5.0) : isMgmtCriterion ? (staff.mgmtScore || 5.0) : (staff.techScore || 5.0);
    const basePoints = (q.defaultPoints && q.defaultPoints > 0) ? q.defaultPoints : trackBase;
    const effectiveScore = Math.max(0, Math.min(5.0, Number((basePoints + bonusPoints - penaltyPoints).toFixed(2))));

    let status: EvaluatedCriterion['status'] = '✅ Đạt chuẩn';
    if (violations.length > 0) {
      status = '❌ Có vi phạm';
    } else if (recognitions.length > 0) {
      status = '🌟 Khen thưởng';
    } else if (effectiveScore < 4.0) {
      status = '⚠️ Cần cải thiện (bổ sung)';
    }

    return {
      id: q.id,
      groupCode: q.groupCode,
      groupName: q.groupName,
      text: q.text,
      category: qCat,
      trackName,
      basePoints,
      violationsCount: violations.length,
      recognitionsCount: recognitions.length,
      penaltyPoints,
      bonusPoints,
      effectiveScore,
      status,
      matchedIncidents,
    };
  }).filter((item): item is EvaluatedCriterion => item !== null);

  const commonCriteria = evaluatedCriteria.filter(c => c.category === 'Chung' || c.category === 'Ranh giới' || c.groupCode.startsWith('VH'));
  const mgmtCriteria = evaluatedCriteria.filter(c => c.category === 'Quản lý' || c.groupCode.startsWith('Q') || c.groupCode.startsWith('QH'));
  const deptCriteria = evaluatedCriteria.filter(c => !commonCriteria.includes(c) && !mgmtCriteria.includes(c));

  // Build grouped details per Group Code
  const groupMap = new Map<string, GroupScoreDetail>();

  evaluatedCriteria.forEach(c => {
    const key = c.groupCode || 'OTHER';
    if (!groupMap.has(key)) {
      const isCommon = c.category === 'Chung' || c.category === 'Ranh giới' || c.groupCode.startsWith('VH');
      const isMgmtGrp = c.category === 'Quản lý' || c.groupCode.startsWith('Q') || c.groupCode.startsWith('QH');
      const trackCategory: GroupScoreDetail['trackCategory'] = isCommon ? 'common' : isMgmtGrp ? 'mgmt' : 'dept';
      const trackName = isCommon ? 'Văn hóa chung' : isMgmtGrp ? 'Quản lý & Lãnh đạo' : `Chuyên môn ngạch (${staff.line || staff.department})`;
      
      const defaultBase = isCommon ? (staff.generalScore || 5.0) : isMgmtGrp ? (staff.mgmtScore || 5.0) : (staff.techScore || 5.0);

      groupMap.set(key, {
        groupCode: key,
        groupName: c.groupName || key,
        category: c.category,
        trackCategory,
        trackName,
        subCriteriaCount: 0,
        basePoints: defaultBase,
        violationsCount: 0,
        recognitionsCount: 0,
        penaltyPoints: 0,
        bonusPoints: 0,
        achievedScore: defaultBase,
        items: []
      });
    }

    const grp = groupMap.get(key)!;
    grp.subCriteriaCount += 1;
    grp.violationsCount += c.violationsCount;
    grp.recognitionsCount += c.recognitionsCount;
    grp.penaltyPoints += c.penaltyPoints;
    grp.bonusPoints += c.bonusPoints;
    grp.items.push(c);
  });

  // Calculate final achieved score per group Code
  groupMap.forEach(grp => {
    if (grp.violationsCount > 0 || grp.bonusPoints > 0) {
      grp.achievedScore = Math.max(0, Math.min(5.0, Number((5.0 + grp.bonusPoints - grp.penaltyPoints).toFixed(2))));
    } else {
      grp.achievedScore = Number(grp.basePoints.toFixed(2));
    }
  });

  const groupedDetails = Array.from(groupMap.values());
  const commonGroups = groupedDetails.filter(g => g.trackCategory === 'common');
  const deptGroups = groupedDetails.filter(g => g.trackCategory === 'dept');
  const mgmtGroups = groupedDetails.filter(g => g.trackCategory === 'mgmt');

  const totalViolations = staffPeriodIncidents.filter(i => i.type === 'vi_pham').length;
  const totalRecognitions = staffPeriodIncidents.filter(i => i.type === 'ghi_nhan').length;

  return {
    evaluatedCriteria,
    commonCriteria,
    deptCriteria,
    mgmtCriteria,
    groupedDetails,
    commonGroups,
    deptGroups,
    mgmtGroups,
    totalViolations,
    totalRecognitions,
  };
}

/**
 * Returns breakdown of the 3 score tracks for a staff member (Điểm & Trọng số ngạch)
 */
export function getTrackScoreDetails(
  staff: Staff,
  params?: ParameterConfig
): {
  tracks: TrackScoreInfo[];
  hasManagementTrack: boolean;
  calculatedTotalScore: number;
} {
  const p = params || {
    weightGeneralNoMgmt: 0.65,
    weightTechNoMgmt: 0.35,
    weightGeneralWithMgmt: 0.50,
    weightMgmtWithMgmt: 0.30,
    weightTechWithMgmt: 0.20,
  };

  const hasMgmt = isManagementRole(staff);

  const generalWeight = hasMgmt ? (p.weightGeneralWithMgmt ?? 0.50) : (p.weightGeneralNoMgmt ?? 0.65);
  const techWeight = hasMgmt ? (p.weightTechWithMgmt ?? 0.20) : (p.weightTechNoMgmt ?? 0.35);
  const mgmtWeight = hasMgmt ? (p.weightMgmtWithMgmt ?? 0.30) : 0;

  const generalScore = staff.generalScore || 0;
  const techScore = staff.techScore || 0;
  const mgmtScore = hasMgmt ? (staff.mgmtScore || 0) : 0;

  const tracks: TrackScoreInfo[] = [
    {
      trackKey: 'general',
      trackName: 'Văn Hóa Chung Công Ty',
      score: generalScore,
      weightPercent: Math.round(generalWeight * 100),
      weightDecimal: generalWeight,
      weightedContribution: Number((generalScore * generalWeight).toFixed(2)),
      isApplicable: true,
      criteriaCount: 16,
      description: 'Áp dụng đồng bộ cho 100% nhân sự Nhà Của Thời Thanh Xuân (16 nhóm giá trị văn hóa).'
    },
    {
      trackKey: 'tech',
      trackName: 'Chuyên Môn Ngạch Phòng Ban',
      departmentName: staff.line || staff.department,
      score: techScore,
      weightPercent: Math.round(techWeight * 100),
      weightDecimal: techWeight,
      weightedContribution: Number((techScore * techWeight).toFixed(2)),
      isApplicable: true,
      criteriaCount: 7,
      description: `Tiêu chí chuyên môn đặc thù của ngạch ${staff.line || staff.department}.`
    },
    {
      trackKey: 'mgmt',
      trackName: 'Ngạch Quản Lý & Lãnh Đạo',
      score: mgmtScore,
      weightPercent: Math.round(mgmtWeight * 100),
      weightDecimal: mgmtWeight,
      weightedContribution: Number((mgmtScore * mgmtWeight).toFixed(2)),
      isApplicable: hasMgmt,
      criteriaCount: 4,
      description: 'Dành riêng cho nhân sự từ Trưởng ca, Lead đến Trưởng phòng và C-Level.'
    }
  ];

  const calculatedTotalScore = hasMgmt
    ? Number((generalScore * generalWeight + mgmtScore * mgmtWeight + techScore * techWeight).toFixed(2))
    : Number((generalScore * generalWeight + techScore * techWeight).toFixed(2));

  return {
    tracks,
    hasManagementTrack: hasMgmt,
    calculatedTotalScore,
  };
}
