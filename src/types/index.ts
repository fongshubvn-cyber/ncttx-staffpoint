export type SpeechType = 'Người nói' | 'Người điếc/ khiếm thính';
export type IncidentType = 'vi_pham' | 'ghi_nhan';
export type IncidentStatus = 
  | 'Chờ duyệt' 
  | 'Đang xem xét'
  | 'Đã duyệt' 
  | 'Từ chối' 
  | 'Đã ghi nhận' 
  | 'Chờ HR duyệt'
  | 'Đang kháng nghị'
  | 'Kháng nghị được chấp nhận'
  | 'Kháng nghị bị từ chối';

export type SeverityLevel = 'Nhẹ' | 'Vừa' | 'Nghiêm trọng';

export interface AuthUser {
  id: string; // 'admin' or Staff ID e.g. 'TTX005'
  name: string;
  role: string;
  positionCategory: string;
  department: string;
  jobLevel: string;
  isManager: boolean;
  isAdmin: boolean;
  mustChangePassword?: boolean;
}

export interface Staff {
  id: string; // Mã NV (TTX001...)
  name: string;
  role: string; // Vị trí
  positionCategory: string; // Vị trí theo Danh mục
  department: string; // Phòng ban
  line: string; // Tuyến chính
  assignedLines?: string[]; // Danh sách các ngạch chuyên môn được tích chọn (vd: ['Pha chế', 'Sản xuất'])
  managementTrack?: string; // Ngạch quản lý (vd: 'Quản lý Thương Mại & Dịch Vụ', 'Chưa xếp ngạch')
  speechCapability: SpeechType;
  location: string; // Điểm làm việc
  joinDate?: string;
  status: string;
  evaluationCount: number;
  lastQuarter?: string;
  generalScore: number; // Điểm văn hóa chung (thang 5.0)
  techScore: number; // Điểm ngạch chuyên môn
  hasCustomTechScore?: boolean; // Flag đánh dấu đã có dữ liệu đánh giá ngạch chuyên môn tùy chỉnh hay chưa
  mgmtScore?: number; // Điểm ngạch quản lý
  hasCustomMgmtScore?: boolean; // Flag đánh dấu đã có dữ liệu đánh giá ngạch quản lý tùy chỉnh hay chưa
  totalScore: number; // Điểm làm việc / Điểm tổng (0.0 - 5.0)
  salaryTier: number; // Bậc cách làm việc (1 đến 5)
  jobLevel: string; // Tập sự, Nhân viên, Lead, Trưởng phòng, Founder, CEO...
  isManager?: boolean;
  isAdmin?: boolean;
  password?: string;
  mustChangePassword?: boolean;
  policyScore?: number; // Điểm nội quy tuân thủ (mặc định 100)
}

export interface Question {
  id: string; // Mã câu (VH1.1, VH2.1, TC1.1...)
  category: 'Chung' | 'Phòng ban' | 'Chuyên môn' | 'Quản lý' | 'Ranh giới' | string;
  lineId?: string; // ID tuyến (Thương mại & Dịch vụ, Pha chế...)
  groupCode: string; // VH1, VH2...
  groupName: string; // ONE VOICE, OUTCOME...
  text: string; // Câu hỏi
  scope?: string; // Phạm vi áp dụng
  measurementType?: 'vi phạm' | 'ghi nhận' | 'thang 0-5' | 'đạt/chưa đạt' | string;
  defaultPoints?: number; // 5 cho vi phạm, 0 cho ghi nhận, 5 cho mặc định
  active?: boolean;
  tierRequirement?: string; // Bậc trong ngạch / Ngưỡng áp dụng
}

export interface IncidentRecord {
  id: string;
  type: IncidentType;
  reporterId: string; // Mã NV người tạo
  reporterName: string;
  targetId: string; // Mã NV người được ghi nhận / bị vi phạm
  targetName: string;
  targetRole: string;
  questionId?: string;
  policyRuleId?: string; // Mã ID nội quy vi phạm (NQ01 - NQ10) nếu có
  groupCode?: string;
  title: string;
  description: string;
  severity: SeverityLevel;
  date: string;
  createdAt?: string; // Timestamp ISO format to accurately calculate 48h deadline
  status: IncidentStatus;
  impactPoints: number;
  policyPenaltyPoints?: number; // Điểm bị trừ khỏi 100 điểm nội quy
  appealReason?: string;
  appealDate?: string;
  appealStatus?: 'none' | 'pending' | 'approved' | 'rejected';
  imageUrl?: string;
  isDeleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
  isPurged?: boolean;
}

export interface DepartmentLine {
  id: string;
  name: string;
  status: '✅ đủ nội dung' | '⬜ khung rỗng';
  applyTrack: string;
  scopeDescription: string;
  criteriaType: string;
  levels: string;
  hasSalesPoint: boolean;
  matrixSheetName: string;
  questionCount?: number;
}

export interface BaselinePoint {
  lineFormName: string;
  baselineScore: number;
  salaryTier: number;
  note?: string;
  generalScore?: number;
  techScore?: number;
  mgmtScore?: number;
  trackName?: string;
  roleType?: 'Nhân viên' | 'Quản lý';
  formulaStr?: string;
  weightsStr?: string;
}

export interface ParameterConfig {
  majorityThreshold: number; // 0.6
  tier1Threshold: number; // 0.0 (1.0 đến dưới 2.5đ, HS: 0.10)
  tier2Threshold: number; // 0.50 (2.5 đến dưới 3.5đ, HS: 0.40)
  tier3Threshold: number; // 0.70 (3.5 đến dưới 4.0đ, HS: 0.90)
  tier4Threshold: number; // 0.80 (4.0 đến dưới 4.8đ, HS: 1.00)
  tier5Threshold: number; // 0.96 (4.8 đến 5.0đ, HS: 1.10)
  weightGeneralNoMgmt: number; // 0.65
  weightTechNoMgmt: number; // 0.35
  weightGeneralWithMgmt: number; // 0.50
  weightMgmtWithMgmt: number; // 0.30
  weightTechWithMgmt: number; // 0.20
  defaultViolationPoints: number; // 5
  defaultRecognitionPoints: number; // 0
  
  // Baseline Benchmark Points (Admin Directly Editable)
  baselineScoreCommon?: number;    // Default 4.08 (Tuyến chưa có ngạch riêng, 6 tuyến)
  baselineScoreTmdvStaff?: number; // Default 4.52 (Thương mại & Dịch vụ, nhân viên)
  baselineScoreTmdvMgmt?: number;  // Default 4.19 (Thương mại & Dịch vụ, quản lý)
  baselineScoreNshcStaff?: number; // Default 4.40 (Nhân sự - Hành chính - Pháp chế, nhân viên)
  baselineScoreNshcMgmt?: number;  // Default 4.54 (Nhân sự - Hành chính - Pháp chế, quản lý)

  // Baseline Points Settings (Admin Configurable)
  baselineCultureCommon?: number; // Default 4.08 (Điểm nền Văn Hóa chung & Tuyến chưa có ngạch riêng)
  baselineTmdvGeneral?: number;   // Default 4.26 (Điểm nền Văn Hóa TM&DV)
  baselineTmdvTech?: number;      // Default 5.00 (Điểm nền Chuyên Môn TM&DV)
  baselineTmdvMgmt?: number;      // Default 3.54 (Điểm nền Quản Lý TM&DV)
  baselineNshcGeneral?: number;   // Default 4.08 (Điểm nền Văn Hóa NSHC)
  baselineNshcTech?: number;      // Default 5.00 (Điểm nền Chuyên Môn NSHC)
  baselineNshcMgmt?: number;      // Default 5.00 (Điểm nền Quản Lý NSHC)
  baselineOtherTech?: number;     // Default 4.08 (Điểm nền Chuyên Môn tuyến khác)
  baselineOtherMgmt?: number;     // Default 4.08 (Điểm nền Quản Lý tuyến khác)

  // Internal Policy Settings
  defaultPolicyScore?: number; // Default 100 points
  policyVersion?: string; // Phiên bản nội quy (vd: '2026_v3')
  policyRules?: PolicyRule[];
  
  // Configurable Incident / Ticket Point Impacts
  recMinorPoints?: number;    // +0.5 (Ghi nhận mức Nhẹ)
  recModeratePoints?: number; // +1.0 (Ghi nhận mức Vừa)
  recMajorPoints?: number;    // +1.5 (Ghi nhận Tuyên dương/Xuất sắc)
  vioMinorPoints?: number;    // -0.2 (Vi phạm Nhắc nhở nhẹ)
  vioModeratePoints?: number; // -0.5 (Vi phạm Mức Vừa)
  vioMajorPoints?: number;    // -1.0 (Vi phạm Nghiêm trọng)
  vioBoundaryPoints?: number; // -1.5 (Vi phạm Ranh giới đỏ ⚠️)
  googleAppsScriptUrl?: string; // Webhook URL từ Google Apps Script
  notebookLmUrl?: string; // Đường dẫn kết nối Trợ lý AI NotebookLM của công ty
  geminiApiKey?: string; // Google Gemini API Key cho Trợ Lý AI Chat Trực Tiếp
}

export interface PolicyRule {
  id: string; // 'NQ01', 'NQ02'...
  code: string; // 'PQ-01', 'VH-01'...
  track?: 'Pháp quy & Kỷ luật' | 'Văn hóa & Tác phong' | string; // Ngạch nội quy
  title: string;
  category: string;
  description: string;
  penaltyPoints: number; // Điểm phạt bị trừ khỏi 100 (5, 10, 15, 20, 25, 30, 50)
  severity: 'Nhẹ' | 'Vừa' | 'Nghiêm trọng' | 'Rất nghiêm trọng';
  enforcementMeasure: string;
  active: boolean;
}

export interface PolicyHealthStatus {
  score: number; // 0 - 100
  level: 'Tốt' | 'Cần chú ý' | 'Nghiêm trọng' | 'Đình chỉ vĩnh viễn';
  color: string;
  badgeClass: string;
  advice: string;
  enforcementAction: string;
}

export interface AdminFeedback {
  id: string;
  senderId?: string;
  senderName?: string;
  isAnonymous?: boolean;
  category: 'Cải tiến quy trình' | 'Môi trường làm việc' | 'Đề xuất văn hóa & chế độ' | 'Ý kiến đóng góp khác' | string;
  title: string;
  content: string;
  createdAt: string;
  status: 'Mới tiếp nhận' | 'Đã xem' | 'Đã ghi nhận & xử lý' | 'Đã đóng';
  adminNote?: string;
}
