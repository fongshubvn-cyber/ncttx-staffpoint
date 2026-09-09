export type SpeechType = 'Người nói' | 'Người điếc/ khiếm thính';
export type IncidentType = 'vi_pham' | 'ghi_nhan';
export type IncidentStatus = 
  | 'Chờ duyệt' 
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
  line: string; // Tuyến
  speechCapability: SpeechType;
  location: string; // Điểm làm việc
  joinDate?: string;
  status: string;
  evaluationCount: number;
  lastQuarter?: string;
  generalScore: number; // Điểm văn hóa chung (thang 5.0)
  techScore: number; // Điểm ngạch chuyên môn
  mgmtScore?: number; // Điểm ngạch quản lý
  totalScore: number; // Điểm làm việc / Điểm tổng (0.0 - 5.0)
  salaryTier: number; // Bậc cách làm việc (1 đến 5)
  jobLevel: string; // Tập sự, Nhân viên, Lead, Trưởng phòng, Founder, CEO...
  isManager?: boolean;
  isAdmin?: boolean;
  password?: string;
  mustChangePassword?: boolean;
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
  groupCode?: string;
  title: string;
  description: string;
  severity: SeverityLevel;
  date: string;
  createdAt?: string; // Timestamp ISO format to accurately calculate 48h deadline
  status: IncidentStatus;
  impactPoints: number;
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
}

export interface ParameterConfig {
  majorityThreshold: number; // 0.6
  tier1Threshold: number; // 0.0 (< 40%)
  tier2Threshold: number; // 0.4 (40% - 55%)
  tier3Threshold: number; // 0.55 (55% - 70%)
  tier4Threshold: number; // 0.7 (70% - 85%)
  tier5Threshold: number; // 0.85 (>= 85%)
  weightGeneralNoMgmt: number; // 0.65
  weightTechNoMgmt: number; // 0.35
  weightGeneralWithMgmt: number; // 0.50
  weightMgmtWithMgmt: number; // 0.30
  weightTechWithMgmt: number; // 0.20
  defaultViolationPoints: number; // 5
  defaultRecognitionPoints: number; // 0
  
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
