import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  X, 
  Copy, 
  Check, 
  HelpCircle, 
  ExternalLink, 
  Key, 
  RefreshCw,
  BookOpen,
  ShieldAlert,
  Award,
  Minimize2,
  Maximize2,
  MessageSquare
} from 'lucide-react';
import { Question, Staff, DepartmentLine, ParameterConfig, AuthUser, PolicyRule } from '../types';
import { initialPolicyRules } from '../data/seedData';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

interface AiChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  staffList: Staff[];
  lines: DepartmentLine[];
  params: ParameterConfig;
  currentUser: AuthUser | null;
}

export const AiChatModal: React.FC<AiChatModalProps> = ({
  isOpen,
  onClose,
  questions,
  staffList,
  lines,
  params,
  currentUser,
}) => {
  const [apiKey, setApiKey] = useState<string>(() => {
    return params.geminiApiKey || localStorage.getItem('ncttx_gemini_key') || '';
  });
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const userName = currentUser?.name || 'bạn';

  const policyRulesList: PolicyRule[] = (params.policyRules && params.policyRules.length >= 6) 
    ? params.policyRules 
    : initialPolicyRules;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      sender: 'ai',
      text: `Chào ${userName} nhé! 🌿 Mình là **Thanh Xuân** — người bạn trợ lý AI đồng hành cùng bạn tại Nhà Của Thời Thanh Xuân.\n\nHôm nay công việc của bạn thế nào? Cần trò chuyện hay tra cứu về quy định Mức độ chấp hành & hoàn thành công việc (Trễ giờ, Điều phối, Deadline, Đồng phục, Vệ sinh, Điện thoại), tiền tips, cách khiếu nại 48h, công thức tính điểm hay tiêu chí cứ nhắn cho mình nhé!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (params.geminiApiKey) {
      setApiKey(params.geminiApiKey);
    }
  }, [params.geminiApiKey]);

  const saveLocalApiKey = (key: string) => {
    const trimmed = key.trim();
    setApiKey(trimmed);
    localStorage.setItem('ncttx_gemini_key', trimmed);
    setShowApiKeyInput(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  if (!isOpen) return null;

  // Build System Instruction for Natural Thinking Friend Persona
  const buildFriendlySystemInstruction = () => {
    const questionsSummary = questions.map(q => 
      `• Mã [${q.id}] | Nhóm: ${q.groupCode} (${q.groupName}) | Hạng mục: ${q.category} | Tuyến: ${q.lineId || 'Chung'} | Nội dung: "${q.text}"`
    ).join('\n');

    const policyRulesSummary = policyRulesList.map(r => 
      `• [${r.code}] | Ngạch: ${r.track || (r.id.startsWith('PQ') ? 'Pháp quy & Kỷ luật' : 'Văn hóa & Tác phong')} | "${r.title}" | Trừ: -${r.penaltyPoints}đ (Mức: ${r.severity}) | Nội dung: "${r.description}" | Biện pháp: "${r.enforcementMeasure}"`
    ).join('\n');

    const linesSummary = lines.map(l => 
      `• Tuyến: ${l.name} (${l.id}) | Áp dụng: ${l.applyTrack}`
    ).join('\n');

    const staffSummary = staffList.map(s => 
      `• NV: ${s.name} (${s.id}) | Vị trí: ${s.role} | Phòng: ${s.department} | Tuyến: ${s.line}`
    ).join('\n');

    const wGenNo = Math.round((params.weightGeneralNoMgmt ?? 0.65) * 100);
    const wTechNo = Math.round((params.weightTechNoMgmt ?? 0.35) * 100);
    const wGenWith = Math.round((params.weightGeneralWithMgmt ?? 0.50) * 100);
    const wTechWith = Math.round((params.weightTechWithMgmt ?? 0.20) * 100);
    const wMgmtWith = Math.round((params.weightMgmtWithMgmt ?? 0.30) * 100);

    return `Bạn là "Thanh Xuân" — người bạn đồng nghiệp AI thông minh, chân thành, thấu hiểu và am hiểu sâu sắc quy chế tại "Nhà Của Thời Thanh Xuân".

[PHONG CÁCH CHAT & XƯNG HÔ]
- Xưng hô: "mình" - "bạn" (hoặc gọi tên nhân sự: "${userName}").
- Tông giọng: Tự nhiên, ấm áp, lịch sự như bạn bè đồng nghiệp lâu năm nhắn tin hỗ trợ nhau.
- Khi nhân sự hỏi về quy chế, nội quy hoặc tình huống: Hãy trích dẫn chính xác mã điều khoản [Mã] (Ví dụ: [PQ-01], [VH-07]), số điểm bị trừ khỏi quỹ 100đ, mức độ nghiêm trọng và biện pháp xử lý.
- Nếu nhân sự hỏi về khiếu nại: Luôn nhắc nhở thời hạn 48 giờ để gửi khiếu nại trên hệ thống.
- Nếu nhân sự hỏi về công thức điểm: Giải thích rõ ràng 3 cột trụ (Văn hóa, Phòng ban, Quản lý) và 5 bậc lương P2.

[HỆ THỐNG NỘI QUY 2 NGẠCH (20 NỘI QUY - QUỸ 100 ĐIỂM GỐC ĐỘC LẬP MỖI THÁNG)]
Mỗi tháng nhân sự được cấp 100 điểm tuân thủ độc lập. Sang tháng mới tự động Restart về 100đ.
- Ngạch 1: Pháp quy & Kỷ luật lao động (Khung cứng theo Bộ luật Lao động - PQ-01 đến PQ-10).
- Ngạch 2: Văn hóa & Tác phong vận hành (Khung mềm theo Sổ tay nhân sự TTX - VH-01 đến VH-10).
${policyRulesSummary}

[CƠ CHẾ ĐIỂM ĐÁNH GIÁ CÔNG VIỆC P2 THEO NGẠCH]
- 3 Cột trụ:
  1. Điểm nền Văn Hóa chung: 100% nhân sự chịu tác động.
  2. Điểm Ngạch Phòng Ban / Chuyên Môn: Theo từng tuyến (Thương mại & Dịch vụ, Nhân sự, Pha chế, Sản xuất...).
  3. Điểm Ngạch Quản Lý: Dành riêng cho cấp Quản lý / Lead.
- Công thức tính:
  * Nhân viên: Văn hóa (${wGenNo}%) + Ngạch Phòng ban (${wTechNo}%).
  * Quản lý: Văn hóa (${wGenWith}%) + Ngạch Phòng ban (${wTechWith}%) + Ngạch Quản lý (${wMgmtWith}%).
- 5 Bậc lương P2:
  * Bậc 5 (4.8 - 5.0đ, HS: 1.10 - Vượt chuẩn)
  * Bậc 4 (4.0 - <4.8đ, HS: 1.00 - Đạt chuẩn Công ty dự định trả)
  * Bậc 3 (3.5 - <4.0đ, HS: 0.90 - Gần đạt chuẩn)
  * Bậc 2 (2.5 - <3.5đ, HS: 0.40)
  * Bậc 1 (1.0 - <2.5đ, HS: 0.10)

[DANH SÁCH ${questions.length} TIÊU CHÍ MA TRẬN]
${questionsSummary}

[DANH SÁCH PHÒNG BAN]
${linesSummary}

[DANH SÁCH NHÂN SỰ]
${staffSummary}`;
  };

  // Friendly Fallback Keyword RAG Engine with Complete Precision
  const handleFriendlyLocalSearch = (query: string): string => {
    const rawLower = query.toLowerCase().trim();

    // 1. Chào hỏi, xưng hô, hỏi tên
    const isGreeting = /^(xin chào|chào|chào bạn|hi|hello|helo|chào thanh xuân|bạn là ai|bạn tên gì|tên gì|cảm ơn|thank|tạm biệt|bye|ok|okie)/i.test(rawLower);
    if (isGreeting) {
      if (rawLower.includes('bạn là ai') || rawLower.includes('tên gì')) {
        return `Mình là **Thanh Xuân** — người bạn trợ lý AI đồng hành cùng bạn tại Nhà Của Thời Thanh Xuân đây! 🌿\n\nMình có thể giúp bạn giải đáp:\n• **Hệ thống 20 Nội quy 2 Ngạch** (Pháp quy & Văn hóa)\n• **Quỹ 100 điểm tuân thủ** & cách tính điểm\n• **Quy trình khiếu nại trong 48 giờ**\n• **Công thức tính điểm 3 cột trụ** (Văn hóa, Phòng ban, Quản lý) & 5 bậc lương P2\n\nBạn cần mình chia sẻ về nội dung nào cứ nhắn cho mình nha!`;
      }
      if (rawLower.includes('cảm ơn') || rawLower.includes('thank')) {
        return `Không có gì đâu nè ${userName}! ❤️ Rất vui được đồng hành và hỗ trợ bạn. Cần giải đáp gì về công việc hay quy định của Nhà cứ nhắn mình bất kỳ lúc nào nhé!`;
      }
      return `Chào ${userName} nhé! 🌸 Rất vui được trò chuyện với bạn hôm nay. Công việc hôm nay của bạn thế nào? Cần mình hỗ trợ tra cứu quy chế hay quy trình nào không nè?`;
    }

    // 2. Quy trình khiếu nại / kháng nghị trong 48h
    const isAppealQuery = /khiếu nại|giải trình|gửi khiếu nại|tạo khiếu nại|bị vi phạm thì làm|không đồng ý|bị phạt oan|kháng nghị/i.test(rawLower);
    if (isAppealQuery) {
      return `Chào ${userName} nhé! 🛡️ Để gửi **Khiếu Nại / Kháng Nghị** cho một phiếu ghi nhận hoặc biên bản vi phạm, bạn thực hiện 3 bước sau:\n\n` +
        `1️⃣ **Bước 1:** Vào tab **Phản Hồi** trên thanh menu chính của App.\n` +
        `2️⃣ **Bước 2:** Tìm phiếu vi phạm hoặc ghi nhận bạn cần giải trình, nhấp vào nút **"Gửi Khiếu Nại"** (hoặc biểu tượng lá thư/khiếu nại).\n` +
        `3️⃣ **Bước 3:** Nhập lý do khiếu nại chi tiết & đính kèm minh chứng (nếu có), sau đó bấm **Xác Nhận Gửi**.\n\n` +
        `⏱️ **LƯU Ý QUAN TRỌNG:**\n` +
        `• Bạn có **48 giờ** kể từ thời điểm phát hành phiếu để gửi khiếu nại.\n` +
        `• Trưởng phòng & HR sẽ đối soát và phản hồi trong vòng 24 - 48h làm việc.\n` +
        `• Nếu khiếu nại được chấp nhận, hệ thống sẽ **hủy bỏ phiếu vi phạm và hoàn lại 100% điểm phạt** cho bạn! ❤️`;
    }

    // 3. Tạo phiếu ghi nhận / biên bản vi phạm
    const isCreateTicketQuery = /tạo phiếu|lập biên bản|tạo ghi nhận|tạo phản hồi|tạo vi phạm|cách ghi nhận|cách tạo phiếu/i.test(rawLower);
    if (isCreateTicketQuery && !rawLower.includes('khiếu nại')) {
      return `Chào ${userName}! 📝 Để tạo mới phiếu trên hệ thống StaffPoint, bạn thực hiện theo các bước sau:\n\n` +
        `1️⃣ Nhấp vào nút **"+ Tạo Phản Hồi"** ở góc trên bên phải thanh Header (hoặc nút + ở góc dưới màn hình).\n` +
        `2️⃣ Chọn nhân sự cần lập phiếu.\n` +
        `3️⃣ Chọn 1 trong 2 hình thức phản hồi:\n` +
        `   • **Phiếu Phản Ánh Nội Quy:** Trừ điểm từ Quỹ 100đ Tuân thủ độc lập mỗi tháng (chọn 1 trong 20 điều khoản Ngạch 1 hoặc Ngạch 2).\n` +
        `   • **Phiếu Đánh Giá Công Việc:** Đánh giá rèn luyện theo Thang 5.0 (Khen thưởng 🌟 cộng điểm hoặc Nhắc nhở 📢 trừ điểm).\n` +
        `4️⃣ Chọn điều khoản/tiêu chí vi phạm, nhập mô tả sự việc thực tế và bấm **Xác Nhận Gửi**!`;
    }

    // 4. Quỹ 100 điểm nội quy & Tình trạng Account Health
    const isPolicyFundQuery = /100đ|100 điểm|quỹ 100|quỹ nội quy|điểm nội quy|điểm tuân thủ|restart 100|mốc cảnh báo|bị trừ điểm nội quy/i.test(rawLower);
    if (isPolicyFundQuery) {
      return `Chào ${userName}! 🛡️ Đây là quy chế về **Quỹ 100 Điểm Nội Quy (Account Health)** của Nhà mình:\n\n` +
        `🌱 **Cơ chế khởi tạo & Restart:**\n` +
        `• Mỗi tháng, tất cả nhân sự đều được cấp **100 điểm nội quy mặc định độc lập**.\n` +
        `• Điểm trừ do vi phạm chỉ tính trong kỳ tháng đó. Sang tháng mới, điểm tuân thủ sẽ tự động **Restart về 100đ**.\n\n` +
        `🚦 **4 Mốc cảnh báo & Biện pháp cưỡng chế:**\n` +
        `• 🟢 **Mức Tốt (80 - 100đ):** Trạng thái an toàn, không cưỡng chế.\n` +
        `• 🟡 **Mức Cần Chú Ý (50 - 79đ):** Tạm khóa đề xuất khen thưởng / tăng lương trong tháng.\n` +
        `• 🟠 **Mức Nghiêm Trọng (20 - 49đ):** Tạm đình chỉ ca 3 - 7 ngày & hạ 1 bậc làm việc (P2).\n` +
        `• 🔴 **Mức Đình Chỉ (< 20đ):** Đình chỉ công tác & xem xét đơn phương chấm dứt HĐLĐ.`;
    }

    // 5. Công thức tính điểm 3 cột trụ & 5 Bậc lương P2
    const isScoreFormulaQuery = /công thức tính|tính điểm thế nào|điểm nền|ngạch phòng ban|ngạch chuyên môn|ngạch quản lý|bậc lương|bậc 1|bậc 2|bậc 3|bậc 4|bậc 5|hệ số p2|hệ số lương/i.test(rawLower);
    if (isScoreFormulaQuery) {
      const wGenNo = Math.round((params.weightGeneralNoMgmt ?? 0.65) * 100);
      const wTechNo = Math.round((params.weightTechNoMgmt ?? 0.35) * 100);
      const wGenWith = Math.round((params.weightGeneralWithMgmt ?? 0.50) * 100);
      const wTechWith = Math.round((params.weightTechWithMgmt ?? 0.20) * 100);
      const wMgmtWith = Math.round((params.weightMgmtWithMgmt ?? 0.30) * 100);

      return `Chào ${userName}! 📊 Hệ thống điểm đánh giá công việc (P2) được phân tách minh bạch theo **3 Cột Trụ Điểm Nền**:\n\n` +
        `🏛️ **3 Cột trụ thành phần:**\n` +
        `1. **Văn hóa chung:** 100% nhân sự chịu tác động.\n` +
        `2. **Ngạch Phòng ban / Chuyên môn:** Theo tuyến chuyên môn (Thương mại & Dịch vụ, Nhân sự, Pha chế...).\n` +
        `3. **Ngạch Quản lý:** Dành riêng cho cấp Quản lý / Lead / Trưởng phòng.\n\n` +
        `📐 **Công thức tính điểm tổng P2:**\n` +
        `• **Nhân viên:** Văn hóa (${wGenNo}%) + Ngạch Phòng ban (${wTechNo}%)\n` +
        `• **Quản lý:** Văn hóa (${wGenWith}%) + Ngạch Phòng ban (${wTechWith}%) + Ngạch Quản lý (${wMgmtWith}%)\n\n` +
        `🏆 **5 Bậc cách làm việc & Hệ số P2:**\n` +
        `• **Bậc 5 (4.8 - 5.0đ):** Hệ số 1.10 (Vượt chuẩn rõ rệt, rất khó đạt)\n` +
        `• **Bậc 4 (4.0 - <4.8đ):** Hệ số 1.00 (Đạt chuẩn - mức Công ty dự định trả)\n` +
        `• **Bậc 3 (3.5 - <4.0đ):** Hệ số 0.90 (Gần đạt chuẩn)\n` +
        `• **Bậc 2 (2.5 - <3.5đ):** Hệ số 0.40 (Cần cải thiện)\n` +
        `• **Bậc 1 (1.0 - <2.5đ):** Hệ số 0.10 (Chưa đạt chuẩn)`;
    }

    // 6. Ranh giới không thỏa hiệp (Ranh giới đỏ)
    const isBoundaryQuery = /ranh giới đỏ|ranh giới không thỏa hiệp|ba ranh giới|3 ranh giới/i.test(rawLower);
    if (isBoundaryQuery) {
      return `${userName} ơi, **Ba Ranh Giới Không Thỏa Hiệp (Ranh giới đỏ ⚠️)** là những nguyên tắc cốt lõi tuyệt đối không được xâm phạm tại Nhà Của Thời Thanh Xuân:\n\n` +
        `1️⃣ **Tài chính và Uy tín:** Tuyệt đối không gian lận, biển thủ tiền bạc, mượn quỹ cá nhân hay làm điều gây tổn hại đến hình ảnh, lòng tin của Nhà.\n` +
        `2️⃣ **Văn hóa và Sứ mệnh:** Tuyệt đối **không thương mại hóa sự khiếm thính** (không dùng hoàn cảnh của đồng đội để câu kéo khách hay khơi gợi lòng thương hại); trung thực về công dụng sản phẩm, không thổi phồng.\n` +
        `3️⃣ **Danh dự và Nhân phẩm:** Nghiêm cấm mọi hành vi xúc phạm, hạ thấp, khinh miệt hay phân biệt đối xử với đồng nghiệp (người điếc lẫn người nói) và khách hàng.\n\n` +
        `⚖️ Vi phạm ranh giới đỏ sẽ bị lập biên bản kỷ luật nặng, trừ từ **-25đ đến -50đ** nội quy hoặc đình chỉ sa thải theo luật định!`;
    }

    // 7. NQ-01: Đi làm đúng giờ & Chấm công đầy đủ (Trễ giờ)
    if (/đi muộn|đi trễ|về sớm|chấm công|trễ giờ|muộn ca|giờ làm|quên chấm công/i.test(rawLower)) {
      return `Chào ${userName}! ⏰ Về quy định trễ giờ và giờ giấc:\n\n` +
        `Theo Nội quy lao động, quy định này thuộc mã **[NQ-01] - Đi làm đúng giờ & Chấm công đầy đủ (Trễ giờ)**:\n\n` +
        `• Vào ca đúng giờ, thực hiện chấm công và bàn giao ca đầy đủ. Trường hợp đến muộn quá 15 phút không báo trước sẽ bị tính vi phạm trễ giờ.\n` +
        `• **Mức phạt:** Trừ **-5đ nội quy** (Mức Nhẹ).\n` +
        `• **Biện pháp xử lý:** Nhắc nhở ca & Ghi chép nhật ký ca làm việc; vi phạm nhiều lần xem xét hạ bậc thi đua.`;
    }

    // NQ-02: Không chấp hành điều phối của quản lý
    if (/điều phối|chấp hành điều phối|không chấp hành|không tuân thủ|chống đối|phân công|sắp xếp công việc/i.test(rawLower)) {
      return `Chào ${userName}! 📋 Về việc chấp hành điều phối của quản lý:\n\n` +
        `Theo Nội quy lao động, quy định này thuộc mã **[NQ-02] - Không chấp hành điều phối của quản lý**:\n\n` +
        `• Không tuân thủ, từ chối hoặc chống đối sự phân công, điều động, sắp xếp công việc hợp lý từ Quản lý / Trưởng ca / Cấp trên trực tiếp trong ca làm việc.\n` +
        `• **Mức phạt:** Trừ **-15đ nội quy** (Mức Vừa).\n` +
        `• **Biện pháp xử lý:** Nhắc nhở, lập biên bản vi phạm kỷ luật điều phối và họp kiểm điểm ca làm việc.`;
    }

    // NQ-03: Không hoàn thành công việc đúng deadline
    if (/deadline|trễ deadline|chậm deadline|đúng hạn|đúng deadline|chậm tiến độ|chậm nộp báo cáo/i.test(rawLower)) {
      return `Chào ${userName}! ⏳ Về thời hạn hoàn thành công việc (deadline):\n\n` +
        `Theo Nội quy lao động, quy định này thuộc mã **[NQ-03] - Không hoàn thành công việc đúng deadline**:\n\n` +
        `• Không hoàn thành các nhiệm vụ, công việc được giao hoặc chậm trễ nộp báo cáo đúng thời hạn cam kết (deadline) mà không có lý do chính đáng hoặc không báo trước.\n` +
        `• **Mức phạt:** Trừ **-10đ nội quy** (Mức Vừa).\n` +
        `• **Biện pháp xử lý:** Nhắc nhở, đôn đốc tiến độ và trừ điểm chuyên cần/tiến độ công việc.`;
    }

    // NQ-04: Mặc đúng đồng phục & Diện mạo gọn gàng
    if (/đồng phục|diện mạo|bảng tên|tạp dề|đầu tóc|quần áo/i.test(rawLower)) {
      return `Chào ${userName}! 👕 Về quy định đồng phục và diện mạo:\n\n` +
        `Theo quy định của Nhà, nội dung này thuộc mã **[NQ-04] - Mặc đúng đồng phục & Diện mạo gọn gàng**:\n\n` +
        `• Mặc đồng phục sạch sẽ, đeo bảng tên đúng vị trí, đầu tóc gọn gàng khi trong ca làm việc và giao tiếp với khách hàng.\n` +
        `• **Mức phạt:** Trừ **-5đ** khỏi quỹ 100đ chấp hành (Mức Nhẹ).\n` +
        `• **Biện pháp xử lý:** Nhắc nhở chỉnh sửa tác phong trước khi vào ca.`;
    }

    // NQ-05: Vệ sinh sạch sẽ & Sắp xếp khu vực làm việc
    if (/vệ sinh|dọn dẹp|lau bàn|sắp xếp|rác|khu vực làm việc/i.test(rawLower)) {
      return `Chào ${userName}! 🧹 Về vệ sinh và sắp xếp nơi làm việc:\n\n` +
        `Theo quy định của Nhà, nội dung này thuộc mã **[NQ-05] - Vệ sinh sạch sẽ & Sắp xếp khu vực làm việc**:\n\n` +
        `• Vệ sinh sạch sẽ bàn ghế, dụng cụ pha chế/sản xuất, phân loại rác đúng quy định và dọn dẹp gọn gàng trước khi bàn giao ca.\n` +
        `• **Mức phạt:** Trừ **-10đ** khỏi quỹ 100đ chấp hành (Mức Vừa).\n` +
        `• **Biện pháp xử lý:** Yêu cầu khắc phục vệ sinh ngay trong ca & tạm khóa khen thưởng tuần.`;
    }

    // NQ-06: Không sử dụng điện thoại việc riêng trong ca
    if (/điện thoại|lướt mạng|chơi game|việc riêng trong ca/i.test(rawLower)) {
      return `Chào ${userName}! 📱 Về việc sử dụng điện thoại trong giờ làm việc:\n\n` +
        `Theo quy định của Nhà, nội dung này thuộc mã **[NQ-06] - Không sử dụng điện thoại việc riêng trong ca**:\n\n` +
        `• Không làm việc riêng, xem video hay chơi game trên điện thoại cá nhân trong giờ phục vụ khách hàng.\n` +
        `• **Mức phạt:** Trừ **-10đ** khỏi quỹ 100đ chấp hành (Mức Nhẹ).\n` +
        `• **Biện pháp xử lý:** Tạm giữ thiết bị cá nhân trong ca & nhắc nhở trực tiếp.`;
    }

    // 8. PQ-02: Bảo mật tiền lương / Hỏi lương / So sánh lương
    if (/bảo mật lương|tiền lương|hỏi lương|so sánh lương|tiết lộ lương|thu nhập cá nhân|thu nhập của/i.test(rawLower)) {
      return `Chào ${userName}! 🤫 Về quy định tiền lương và thu nhập:\n\n` +
        `Trong Nội quy lao động của Nhà (Điều 20), quy định này thuộc mã **[PQ-02] - Bảo mật tuyệt đối thông tin tiền lương & Điểm P2** (Ngạch 1: Pháp quy & Kỷ luật).\n\n` +
        `⚖️ **Quy định chi tiết:**\n` +
        `• Thông tin tiền lương, thưởng, phụ cấp và điểm đánh giá P2 là **tuyệt mật**.\n` +
        `• Tuyệt đối cấm dò hỏi, so sánh, thảo luận hoặc tiết lộ mức thu nhập của mình hoặc đồng nghiệp cho người khác hoặc phát tán ra ngoài.\n` +
        `• **Mức độ vi phạm:** Nghiêm trọng (Bị trừ **-25đ** khỏi quỹ 100đ nội quy).\n` +
        `• **Biện pháp xử lý:** Khiển trách bằng văn bản và hạ bậc lương P2; tái phạm sẽ áp dụng kéo dài thời hạn nâng lương hoặc sa thải.`;
    }

    // 9. VH-07: Tiền tips / Tiền khách tặng / Tiền boa
    if (/tiền tip|tips|tiền boa|khách tặng tiền|tiền khách gửi|quà khách tặng|khách cho tiền/i.test(rawLower)) {
      return `Chào ${userName}! ☕ Về tiền tips và tiền khách tặng:\n\n` +
        `Theo Sổ tay nhân sự (Phần IX), quy định này thuộc mã **[VH-07] - Quản lý tiền tips & Tiền khách tặng đúng quy định** (Ngạch 2: Văn hóa & Tác phong):\n\n` +
        `⚖️ **Nguyên tắc cốt lõi:**\n` +
        `• Toàn bộ tiền khách gửi lại, tiền tips hoặc quà tặng từ khách **thuộc về Quỹ chung của Nhà**, phục vụ cho đời sống và hoạt động tập thể.\n` +
        `• **Tuyệt đối không cá nhân nào được tự ý giữ riêng** cho mình.\n` +
        `• **Mức độ vi phạm:** Nghiêm trọng (Bị trừ **-30đ** khỏi quỹ 100đ nội quy).\n` +
        `• **Biện pháp xử lý:** Lập biên bản vi phạm tính trung thực, nộp lại 100% vào quỹ chung và tạm khóa quyền lợi khen thưởng tập thể.`;
    }

    // 10. PQ-03: Tiền mặt / Két quỹ / Thu ngân / Thất thoát
    if (/tiền mặt|két quỹ|thu ngân|thất thoát|doanh thu|mượn quỹ|gian lận quỹ/i.test(rawLower)) {
      return `Chào ${userName}! 💰 Về quản lý thu ngân và tiền mặt:\n\n` +
        `Theo Nội quy lao động (Điều 18), quy định này thuộc mã **[PQ-03] - Quản lý tiền mặt, két quỹ & Bàn giao doanh thu** (Ngạch 1: Pháp quy & Kỷ luật):\n\n` +
        `• Thu ngân và thủ kho phải kiểm đếm, đối soát tiền mặt chính xác, nộp doanh thu đúng hạn.\n` +
        `• Cấm giữ tiền mặt vượt định mức tồn quỹ, cấm tự ý mượn quỹ hoặc gian lận sổ sách tài chính.\n` +
        `• **Mức phạt:** Trừ **-30đ nội quy** (Mức Nghiêm trọng).\n` +
        `• **Biện pháp xử lý:** Tạm đình chỉ ca làm việc 7 ngày, bồi thường 100% thất thoát; xem xét chuyển cơ quan pháp luật nếu có dấu hiệu tham ô.`;
    }

    // 11. PQ-04: Bí mật kinh doanh / Công thức sản xuất
    if (/công thức|tinh dầu|xà phòng|nến thơm|bí mật kinh doanh|công nghệ|sao chép công thức/i.test(rawLower)) {
      return `Chào ${userName}! 🧪 Về bảo vệ bí mật công nghệ và công thức:\n\n` +
        `Theo Nội quy lao động (Điều 19), quy định này thuộc mã **[PQ-04] - Bảo vệ bí mật kinh doanh & Công thức độc quyền**:\n\n` +
        `• Tuyệt đối không sao chép, mang ra ngoài hay tiết lộ công thức sản xuất tinh dầu, nến thơm, xà phòng, trà và dữ liệu khách hàng/đối tác của Nhà ra bên ngoài.\n` +
        `• **Mức phạt:** Trừ **-50đ nội quy** (Mức Rất nghiêm trọng).\n` +
        `• **Biện pháp xử lý:** Kỷ luật **Sa thải ngay lập tức** và yêu cầu bồi thường toàn bộ thiệt hại thực tế theo quy định pháp luật.`;
    }

    // 12. PQ-05: PCCC / Cháy nổ / Tắt điện / An toàn lao động
    if (/pccc|cháy nổ|tắt điện|van gas|an toàn lao động|chập điện|phòng cháy/i.test(rawLower)) {
      return `Chào ${userName}! 🚒 Về an toàn lao động và PCCC:\n\n` +
        `Theo Nội quy lao động (Điều 13, 15), quy định này thuộc mã **[PQ-05] - An toàn vệ sinh lao động & Phòng cháy chữa cháy (PCCC)**:\n\n` +
        `• Tuân thủ nghiêm ngặt quy định PCCC, tắt toàn bộ thiết bị điện, khóa van gas, khóa cửa kho trước khi rời ca. Không tự ý câu móc nguồn điện gây nguy cơ chập cháy.\n` +
        `• **Mức phạt:** Trừ **-20đ nội quy** (Mức Nghiêm trọng).\n` +
        `• **Biện pháp xử lý:** Cảnh cáo văn bản, tạm đình chỉ ca 3 - 5 ngày; bồi thường nếu để xảy ra chập cháy, hư hại tài sản.`;
    }

    // 13. PQ-06: An toàn thực phẩm (ATTP) / Khẩu trang / Găng tay
    if (/attp|vệ sinh thực phẩm|an toàn thực phẩm|găng tay|bao tay|khẩu trang|lưu mẫu|bệnh truyền nhiễm|chế biến/i.test(rawLower)) {
      return `Chào ${userName}! 🍲 Về vệ sinh an toàn thực phẩm:\n\n` +
        `Theo Nội quy lao động (Điều 14), quy định này thuộc mã **[PQ-06] - Tiêu chuẩn An toàn vệ sinh thực phẩm (ATTP)**:\n\n` +
        `• Rửa tay sát khuẩn, đeo găng tay, khẩu trang, mũ bảo hộ khi chế biến đồ ăn, thức uống.\n` +
        `• Người mắc bệnh truyền nhiễm cấm tham gia chế biến. Thực hiện lưu mẫu thực phẩm đúng quy chuẩn.\n` +
        `• **Mức phạt:** Trừ **-15đ nội quy** (Mức Vừa).\n` +
        `• **Biện pháp xử lý:** Tạm dừng vị trí chế biến, đào tạo lại quy trình ATTP và kiểm tra đạt yêu cầu mới được nhận ca lại.`;
    }

    // 14. PQ-07: Quấy rối tình dục / Khiếm nhã
    if (/quấy rối|tình dục|đụng chạm|gạ gẫm|sờ soạng|tin nhắn nhạy cảm|gợi dục/i.test(rawLower)) {
      return `Chào ${userName}! 🛡️ Về phòng chống quấy rối tình dục:\n\n` +
        `Theo Nội quy lao động (Điều 16, 17), quy định này thuộc mã **[PQ-07] - Phòng chống Quấy rối tình dục tại nơi làm việc**:\n\n` +
        `• Nghiêm cấm mọi hành vi quấy rối bằng thể chất (đụng chạm, ôm ghì không mong muốn), lời nói (gạ gẫm, trêu cợt khiếm nhã) hoặc phi lời nói (tin nhắn, hình ảnh gợi dục).\n` +
        `• **Mức phạt:** Trừ **-50đ nội quy** (Mức Rất nghiêm trọng).\n` +
        `• **Biện pháp xử lý:** Lập biên bản điều tra độc lập trong 15 ngày; áp dụng hình thức **Kỷ luật Sa thải** và chuyển cơ quan chức năng nếu vi phạm pháp luật hình sự.`;
    }

    // 15. PQ-08: Rượu bia / Ma túy / Đánh bạc / Vay nặng lãi
    if (/rượu bia|say xỉn|ma túy|chất kích thích|đánh bạc|cho vay|đánh nhau|vũ khí/i.test(rawLower)) {
      return `Chào ${userName}! 🚫 Về trật tự nơi làm việc và các chất cấm:\n\n` +
        `Theo Nội quy lao động (Điều 12, 25), quy định này thuộc mã **[PQ-08] - Nghiêm cấm rượu bia, chất kích thích & Tệ nạn tại nơi làm việc**:\n\n` +
        `• Nghiêm cấm sử dụng hoặc tàng trữ rượu bia, ma túy, chất kích thích; cấm đánh bạc, cho vay nặng lãi, mang vũ khí/vật liệu nổ vào cơ sở; cấm xô xát, bạo lực.\n` +
        `• **Mức phạt:** Trừ **-50đ nội quy** (Mức Rất nghiêm trọng).\n` +
        `• **Biện pháp xử lý:** Đình chỉ ngay lập tức, áp dụng hình thức **Kỷ luật Sa thải** theo Điều 25 Nội quy lao động.`;
    }

    // 16. PQ-09: Hư hỏng máy móc / Làm vỡ / Bồi thường
    if (/hư máy|làm vỡ|hỏng đồ|hỏng máy|bồi thường|trách nhiệm vật chất|thất thoát tài sản/i.test(rawLower)) {
      return `Chào ${userName}! ⚙️ Về trách nhiệm vật chất và bảo quản máy móc:\n\n` +
        `Theo Nội quy lao động (Điều 27, 28), quy định này thuộc mã **[PQ-09] - Trách nhiệm vật chất & Bảo quản máy móc thiết bị**:\n\n` +
        `• Vận hành máy móc, trang thiết bị theo đúng quy trình. Không sử dụng thiết bị sai mục đích, không để thất thoát, hư hỏng công cụ dụng cụ do bất cẩn.\n` +
        `• **Mức phạt:** Trừ **-10đ nội quy** (Mức Vừa).\n` +
        `• **Biện pháp xử lý:** Lập biên bản kiểm tra; bồi thường thiệt hại theo quy định (mức khấu trừ tối đa không quá 30% lương tháng).`;
    }

    // 17. VH-01: Người điếc / Khiếm thính / Ngôn ngữ ký hiệu
    if (/người điếc|khiếm thính|ngôn ngữ ký hiệu|học ký hiệu|giao tiếp với bạn khiếm thính|bạn điếc/i.test(rawLower)) {
      return `Chào ${userName}! 🤟 Về văn hóa hòa nhập cùng Người điếc / khiếm thính:\n\n` +
        `Theo Sổ tay nhân sự (Phần I, III), quy định này thuộc mã **[VH-01] - Tôn trọng & Giao tiếp hòa nhập cùng Người điếc/khiếm thính**:\n\n` +
        `• Người nói có trách nhiệm chủ động học và kiên nhẫn dùng ngôn ngữ ký hiệu, chữ viết, cử chỉ để trao đổi cùng bạn khiếm thính.\n` +
        `• Mọi người làm việc bình đẳng, tương trợ, không cô lập, không gạt bạn ra ngoài công việc.\n` +
        `• **Mức phạt:** Trừ **-10đ nội quy** (Mức Vừa).\n` +
        `• **Biện pháp xử lý:** Nhắc nhở trong buổi họp ca, trừ điểm tác phong văn hóa và yêu cầu tham gia lớp ký hiệu bổ trợ.`;
    }

    // 18. VH-02: Không thương mại hóa sự khiếm thính / Nói quá sản phẩm
    if (/thương mại hóa|kể khổ|xin thương hại|bán hàng bằng khuyết tật|nói quá sản phẩm|thổi phồng|công dụng sản phẩm/i.test(rawLower)) {
      return `Chào ${userName}! 🌿 Về nguyên tắc giữ gìn sứ mệnh:\n\n` +
        `Theo Sổ tay nhân sự (Phần II, IV), quy định này thuộc mã **[VH-02] - Không thương mại hóa sự khiếm thính & Trung thực về sản phẩm** (Ranh giới không thỏa hiệp):\n\n` +
        `• **Tuyệt đối không đem hoàn cảnh hay sự khiếm thính của đồng đội ra để bán hàng** hay gợi lòng thương hại từ khách.\n` +
        `• Không thổi phồng, nói quá công dụng của tinh dầu, xà phòng hay đồ uống.\n` +
        `• **Mức phạt:** Trừ **-25đ nội quy** (Mức Nghiêm trọng).\n` +
        `• **Biện pháp xử lý:** Lập biên bản chấn chỉnh văn hóa, tạm khóa xét nâng bậc P2 trong kỳ và uốn nắn tác phong truyền thông.`;
    }

    // 19. VH-03: Giao tiếp khách hàng / 6 điều cấm / Nói xấu đối thủ
    if (/khách hàng|tiếp khách|xưng hô|kì kèo|nói xấu đối thủ|tranh cãi với khách|chứng minh khách sai|6 điều cấm/i.test(rawLower)) {
      return `Chào ${userName}! 🌸 Về chuẩn mực ứng xử với khách hàng:\n\n` +
        `Theo Sổ tay nhân sự (Phần V), quy định này thuộc mã **[VH-03] - Thực hiện 6 điều cấm khi giao tiếp với Khách hàng**:\n\n` +
        `• Xưng hô: Nơi làm việc là **"Nhà"**, gọi khách bằng **"anh/chị/bạn/mình"** lễ phép, niềm nở.\n` +
        `• **6 điều cấm khi tiếp khách:**\n` +
        `  1. Không kì kèo, đôi co với khách.\n` +
        `  2. Không phán xét diện mạo, tính cách khách.\n` +
        `  3. Không cố chứng minh khách sai.\n` +
        `  4. Không nói xấu đối thủ cạnh tranh hay nơi khác.\n` +
        `  5. Không so sánh khách này với khách khác.\n` +
        `  6. Luôn ưu tiên cảm xúc bình an của khách hàng lên hàng đầu.\n` +
        `• **Mức phạt:** Trừ **-15đ nội quy** (Mức Vừa). Đào tạo lại kỹ năng dịch vụ và xin lỗi khách.`;
    }

    // 20. VH-04: Đồng phục / Diện mạo / Móng tay / Nước hoa / Hình xăm
    if (/đồng phục|tạp dề|thẻ tên|móng tay|sơn móng|nhuộm tóc|nước hoa|hình xăm/i.test(rawLower)) {
      return `Chào ${userName}! 👔 Về diện mạo và tác phong:\n\n` +
        `Theo Sổ tay nhân sự (Phần VI, IV), quy định này thuộc mã **[VH-04] - Đồng phục, Diện mạo & Mùi hương đặc trưng của Nhà**:\n\n` +
        `• Đồng phục sạch sẽ, phẳng phiu, mang giày kín mũi, tạp dề đeo đúng cách, bảng tên ngay ngắn.\n` +
        `• Tóc tai gọn gàng (buộc cao khi chế biến); không nhuộm màu tóc chói lóa.\n` +
        `• Móng tay luôn cắt ngắn, sạch sẽ; **không sơn móng tay màu nổi**, không đính đá.\n` +
        `• Che chắn hình xăm lộ khi phục vụ khách.\n` +
        `• **Tuyệt đối không xịt nước hoa có mùi nồng gắt** làm át đi không gian mùi hương của Nhà.\n` +
        `• **Mức phạt:** Trừ **-5đ nội quy** (Mức Nhẹ). Yêu cầu chỉnh sửa diện mạo trước khi vào quầy/xưởng.`;
    }

    // 21. VH-05: 5 Yếu tố không gian / Mùi hương / Sả Java / Sả Chanh / Cây xanh / Âm thanh
    if (/5 yếu tố|không gian|mùi hương|sả java|sả chanh|nước hoa xuân|âm thanh|tiếng ồn|cây xanh|cây cổ thụ/i.test(rawLower)) {
      return `Chào ${userName}! 🍃 Về gìn giữ **5 Yếu tố Không Gian** của Nhà:\n\n` +
        `Theo Sổ tay nhân sự (Phần IV), quy định này thuộc mã **[VH-05] - Giữ gìn 5 Yếu tố không gian: Mùi hương, Âm thanh & Cây xanh**:\n\n` +
        `1. **Mùi hương:** Mùi nền Sả Java; túi giấy xịt Nước hoa Xuân khi giao khách; lau bàn ghế bằng cồn Sả Chanh; cấm mang thức ăn có mùi lạ vào quầy/xưởng.\n` +
        `2. **Âm thanh:** Giữ âm lượng nhẹ nhàng; điều tiết âm thanh khéo léo khi khách quá ồn.\n` +
        `3. **Cây xanh:** Chăm sóc và bảo vệ cây cổ thụ, nhắc nhở khách không hái hoa bẻ cành.\n` +
        `4. **Không gian:** Luôn lùi lại quan sát, thấy bẩn tự giác dọn ngay.\n` +
        `5. **Cách nói về sứ mệnh:** Chân thành, khiêm nhường, để khách tự cảm nhận.\n` +
        `• **Mức phạt:** Trừ **-5đ nội quy** (Mức Nhẹ). Khắc phục không gian ngay trong ca trực.`;
    }

    // 22. VH-06: Tự giác dọn dẹp / Thùng rác / Phân loại rác / Khăn lau
    if (/dọn dẹp|thùng rác|phân loại rác|khăn lau|rác tràn|tự giác dọn/i.test(rawLower)) {
      return `Chào ${userName}! 🧹 Về vệ sinh và giữ gìn không gian:\n\n` +
        `Theo Sổ tay nhân sự (Phần VIII), quy định này thuộc mã **[VH-06] - Tự giác dọn dẹp & Phân loại rác, Khăn lau đúng chuẩn**:\n\n` +
        `• Luôn lùi lại một bước để quan sát: Thấy rác bẩn, ly tách bừa bộn phải **tự giác dọn ngay không chờ phân công**.\n` +
        `• Thùng rác không được để tràn; phân loại rác đúng quy định.\n` +
        `• Dùng đúng màu khăn lau cho từng khu vực riêng (khăn bàn riêng, khăn ly riêng, khăn sàn riêng).\n` +
        `• **Mức phạt:** Trừ **-10đ nội quy** (Mức Vừa). Yêu cầu tổng vệ sinh lại khu vực phụ trách.`;
    }

    // 23. VH-08: Phương pháp OPA, SMART, Ghi chú ca (Take notes)
    if (/opa|smart|ghi chú|take note|sổ tay|kế hoạch công việc/i.test(rawLower)) {
      return `Chào ${userName}! 📓 Về phương pháp làm việc chuẩn tại Nhà:\n\n` +
        `Theo Sổ tay nhân sự (Phần III), quy định này thuộc mã **[VH-08] - Phương pháp làm việc OPA, SMART & Ghi chú (Take notes)**:\n\n` +
        `• **Làm việc theo OPA:** Xác định rõ Outcome (Kết quả mong đợi) ➔ Purpose (Mục đích) ➔ Action Plan (Kế hoạch hành động).\n` +
        `• **Đặt mục tiêu SMART:** Cụ thể, đo lường được, khả thi, thực tế và có thời hạn rõ ràng.\n` +
        `• **Ghi chú (Take notes):** Luôn mang sổ tay ghi chép việc ca, đơn đặt hàng, không làm việc tùy tiện theo thói quen.\n` +
        `• **Mức phạt:** Trừ **-5đ nội quy** (Mức Nhẹ). Quản lý ca kèm cặp và kiểm tra sổ tay đầu ca.`;
    }

    // 24. VH-09: Tinh thần Kaizen, Giải pháp thay vì đổ lỗi
    if (/kaizen|cải tiến|đổ lỗi|than phiền|giải pháp|tinh thần cải tiến/i.test(rawLower)) {
      return `Chào ${userName}! ✨ Về tinh thần làm việc tích cực:\n\n` +
        `Theo Sổ tay nhân sự (Phần III), quy định này thuộc mã **[VH-09] - Tinh thần Kaizen & Định hướng giải pháp thay vì đổ lỗi**:\n\n` +
        `• **Kaizen:** Không ngừng tinh chỉnh, cải tiến từ những chi tiết nhỏ mỗi ngày trong pha chế, đóng gói, phục vụ.\n` +
        `• **Định hướng giải pháp:** Khi gặp sai sót hay sự cố, chủ động mang đến giải pháp khắc phục thay vì than thở, trốn tránh hay đổ lỗi cho đồng đội.\n` +
        `• **Mức phạt:** Trừ **-5đ nội quy** (Mức Nhẹ). Thảo luận xây dựng trong buổi họp giao ban.`;
    }

    // 25. VH-10: Bàn giao ca & Sử dụng điện thoại
    if (/bàn giao ca|giao ca|điện thoại trong ca|lướt mạng|chơi game trong giờ/i.test(rawLower)) {
      return `Chào ${userName}! 📱 Về bàn giao ca và sử dụng điện thoại:\n\n` +
        `Theo Sổ tay nhân sự (Phần VII, VIII), quy định này thuộc mã **[VH-10] - Quy chuẩn bàn giao ca & Tác phong sử dụng điện thoại**:\n\n` +
        `• Bàn giao ca chi tiết bằng sổ sách: số lượng hàng tồn, doanh thu tiền mặt, các lưu ý từ khách hàng và sự cố chưa xử lý.\n` +
        `• **Không sử dụng điện thoại việc riêng**, lướt mạng xã hội hay chơi game trong giờ phục vụ khách hàng.\n` +
        `• **Mức phạt:** Trừ **-10đ nội quy** (Mức Vừa). Tạm giữ thiết bị cá nhân trong ca và bàn giao lại dưới sự giám sát của Trưởng ca.`;
    }

    // 26. Tổng quan Nội quy
    if (/nội quy|quy định công ty|quy chế|danh mục nội quy/i.test(rawLower)) {
      return `Chào ${userName}! 📋 Hệ thống nội quy Nhà Của Thời Thanh Xuân gồm các điều khoản trọng tâm:\n\n` +
        policyRulesList.map((r, i) => `${i + 1}️⃣ **[${r.code}] ${r.title}:** Trừ -${r.penaltyPoints}đ (${r.severity})\n• ${r.description}`).join('\n\n') +
        `\n\n🛡️ Mỗi tháng nhân sự được cấp **100 điểm tuân thủ độc lập**, tự động restart khi sang tháng mới. Bạn muốn hỏi chi tiết nội quy nào cứ nhắn cho mình nhé!`;
    }

    // 27. Smart Multi-Source Token Matching (Tra cứu song song cả 20 Nội quy và Tiêu chí Questions)
    const stopWords = new Set(['trường', 'hợp', 'mình', 'tôi', 'bị', 'là', 'gì', 'thuộc', 'khoản', 'mục', 'nào', 'thì', 'như', 'thế', 'có', 'ko', 'không', 'được', 'vào', 'khi', 'bằng', 'xin', 'chào', 'thế', 'nào', 'sao', 'làm', 'của', 'về', 'trong', 'với']);
    const tokens = rawLower
      .replace(/[^\w\sàáảãạănắằẳẵặânấầnẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]/gi, ' ')
      .split(/\s+/)
      .filter(t => t.length > 1 && !stopWords.has(t));

    if (tokens.length > 0) {
      // 27a. Search in Policy Rules first (20 Nội quy 2 Ngạch)
      const scoredRules = policyRulesList.map(r => {
        let score = 0;
        const textL = `${r.code} ${r.title} ${r.description} ${r.category} ${r.enforcementMeasure}`.toLowerCase();
        tokens.forEach(tok => {
          if (r.code.toLowerCase().includes(tok)) score += 10;
          if (r.title.toLowerCase().includes(tok)) score += 5;
          if (textL.includes(tok)) score += 2;
        });
        return { r, score };
      }).filter(s => s.score > 0).sort((a, b) => b.score - a.score);

      // 27b. Search in Evaluation Questions (Ma trận tiêu chí đánh giá)
      const scoredQuestions = questions.map(q => {
        let score = 0;
        const textL = `${q.id} ${q.text} ${q.groupCode} ${q.groupName} ${q.category}`.toLowerCase();
        tokens.forEach(tok => {
          if (q.id.toLowerCase().includes(tok)) score += 10;
          if (q.text.toLowerCase().includes(tok)) score += 4;
          if (textL.includes(tok)) score += 2;
        });
        return { q, score };
      }).filter(s => s.score > 0).sort((a, b) => b.score - a.score);

      if (scoredRules.length > 0 && scoredRules[0].score >= (scoredQuestions[0]?.score || 0)) {
        const topRule = scoredRules[0].r;
        let resp = `Chào ${userName}! 🌿 Về câu hỏi này, nội dung thuộc **${topRule.track || 'Hệ Thống Nội Quy'}** của Nhà:\n\n`;
        resp += `📋 **[${topRule.code}] ${topRule.title}**\n`;
        resp += `• **Nội dung:** ${topRule.description}\n`;
        resp += `• **Điểm phạt:** Trừ **-${topRule.penaltyPoints}đ** khỏi Quỹ 100đ nội quy (Mức: ${topRule.severity})\n`;
        resp += `• **Biện pháp xử lý:** ${topRule.enforcementMeasure}\n\n`;
        if (scoredRules.length > 1) {
          resp += `🔍 **Quy định liên quan khác:**\n`;
          scoredRules.slice(1, 3).forEach(({ r }) => {
            resp += `• [${r.code}] ${r.title} (-${r.penaltyPoints}đ)\n`;
          });
          resp += `\n`;
        }
        resp += `Bạn cần giải thích rõ hơn tình huống nào cứ nhắn mình nha!`;
        return resp;
      } else if (scoredQuestions.length > 0) {
        const topQ = scoredQuestions[0].q;
        let resp = `Chào ${userName}! 🌿 Về nội dung này, liên quan đến nhóm tiêu chí **${topQ.groupName}**:\n\n`;
        scoredQuestions.slice(0, 3).forEach(({ q }) => {
          resp += `• **[${q.id}]** ${q.text} *(Hạng mục: ${q.category})*\n`;
        });
        resp += `\n⚖️ Tùy mức độ ghi nhận hoặc vi phạm, bạn sẽ được cộng/trừ điểm đánh giá công việc (thang 5.0) tương ứng.\n\n`;
        resp += `Bạn cần làm rõ thêm tiêu chí nào cứ nhắn mình nhé!`;
        return resp;
      }
    }

    return `Mình đã lắng nghe câu hỏi của ${userName}. 🌿\n\n` +
      `Tuy chưa tìm thấy chính xác điều khoản, bạn có thể thử tra cứu các chủ đề như:\n` +
      `• *"20 nội quy 2 ngạch"*, *"đi muộn"*, *"bảo mật lương"*\n` +
      `• *"tiền tips"*, *"5 yếu tố không gian"*, *"khiếu nại 48h"*\n` +
      `• *"công thức tính điểm P2"*, *"3 ranh giới đỏ"*\n\n` +
      `Cứ nhắn từ khóa bạn muốn hỏi để mình hỗ trợ nhé!`;
  };

  // Call Google Gemini API with Multi-turn Memory Conversation
  const callGeminiApiWithMemory = async (userQuery: string): Promise<string> => {
    const keyToUse = apiKey.trim();
    if (!keyToUse) {
      return handleFriendlyLocalSearch(userQuery);
    }

    const contentsPayload = messages
      .filter(m => m.id !== 'welcome-msg')
      .slice(-6)
      .map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

    contentsPayload.push({
      role: 'user',
      parts: [{ text: userQuery }]
    });

    const models = ['gemini-1.5-flash', 'gemini-2.0-flash'];
    for (const modelName of models) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${keyToUse}`;
        
        const payload = {
          systemInstruction: {
            parts: [{ text: buildFriendlySystemInstruction() }]
          },
          contents: contentsPayload,
          generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 1000,
          }
        };

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const data = await response.json();
          const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (textResponse) return textResponse;
        }

        const fallbackPayload = {
          contents: [
            {
              role: 'user',
              parts: [{ text: `${buildFriendlySystemInstruction()}\n\n[LỊCH SỬ TRÒ CHUYỆN]\nCâu hỏi từ ${userName}: "${userQuery}"` }]
            }
          ],
          generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 1000,
          }
        };

        const resp2 = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fallbackPayload)
        });

        if (resp2.ok) {
          const data2 = await resp2.json();
          const text2 = data2.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text2) return text2;
        }
      } catch (err) {
        console.warn(`Gemini model ${modelName} error:`, err);
      }
    }

    return handleFriendlyLocalSearch(userQuery);
  };

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMsgId = `user-${Date.now()}`;
    const newMsg: Message = {
      id: userMsgId,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, newMsg]);
    if (!queryText) setInputQuery('');
    setIsLoading(true);

    const aiResponseText = await callGeminiApiWithMemory(textToSend);

    const aiMsg: Message = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: aiResponseText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (isMinimized) {
    return (
      <div className="fixed right-5 bottom-5 z-50 animate-in bounce-in duration-300">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] text-white shadow-2xl border-2 border-emerald-400/40 hover:scale-105 active:scale-95 transition-all group"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-emerald-300 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-white animate-ping"></span>
          </div>
          <span className="text-xs font-black tracking-tight">Thanh Xuân AI</span>
          <Maximize2 className="w-3.5 h-3.5 text-emerald-200" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 sm:inset-auto sm:right-6 sm:bottom-6 z-50 flex items-end justify-end p-2 sm:p-0 animate-in fade-in slide-in-from-bottom-6 duration-300 pointer-events-none">
      <div className="bg-white rounded-3xl w-full sm:w-[420px] h-[92vh] sm:h-[620px] shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col pointer-events-auto ring-1 ring-slate-900/10">
        
        {/* Friendly Header Bar */}
        <div className="p-3.5 bg-gradient-to-r from-[#1B4332] via-[#2D6A4F] to-emerald-800 text-white flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center relative shrink-0">
              <Bot className="w-5 h-5 text-emerald-300" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#1B4332] animate-pulse"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm tracking-tight leading-none">
                  Thanh Xuân — Người Bạn AI
                </h3>
                <span className="text-[9px] bg-emerald-400/20 text-emerald-200 font-extrabold px-1.5 py-0.2 rounded-full border border-emerald-400/30">
                  {apiKey ? '⚡ Live AI' : '💬 Chatbot'}
                </span>
              </div>
              <p className="text-[10px] text-emerald-100/80 font-medium mt-0.5">
                Đồng hành & thấu hiểu quy chế Nhà Của Thời Thanh Xuân
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowApiKeyInput(!showApiKeyInput)}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-200 hover:text-white transition-all text-xs font-bold"
              title="Nhập / Cấu hình Gemini API Key"
            >
              <Key className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-200 hover:text-white transition-all text-xs font-bold hidden sm:block"
              title="Thu nhỏ cửa sổ chat"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center transition-colors"
              title="Đóng cửa sổ"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* API Key Drawer Dropdown */}
        {showApiKeyInput && (
          <div className="p-3 bg-emerald-950 text-white border-b border-emerald-800 text-xs space-y-2 animate-in slide-in-from-top-2">
            <div className="flex items-center justify-between font-bold text-emerald-300">
              <span className="flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cấu Hình Gemini API Key:</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-normal">Tăng tư duy AI</span>
            </div>
            <div className="flex gap-2">
              <input
                type="password"
                placeholder="Dán mã API Key (AIzaSy...)"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-mono focus:outline-none focus:border-emerald-400"
              />
              <button
                onClick={() => saveLocalApiKey(apiKey)}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black transition-all text-xs"
              >
                Lưu
              </button>
            </div>
          </div>
        )}

        {/* Messages Body */}
        <div className="flex-1 p-3.5 overflow-y-auto space-y-3.5 bg-gradient-to-b from-slate-50 to-white">
          {messages.map((msg) => {
            const isAi = msg.sender === 'ai';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 max-w-[92%] ${isAi ? 'self-start' : 'self-end ml-auto flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 shadow-sm border ${
                  isAi 
                    ? 'bg-gradient-to-tr from-[#1B4332] to-[#2D6A4F] text-emerald-300 border-emerald-600/30' 
                    : 'bg-slate-900 text-white border-slate-700'
                }`}>
                  {isAi ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                </div>

                {/* Message Bubble */}
                <div className="space-y-1">
                  <div className={`p-3.5 rounded-2xl text-xs sm:text-xs leading-relaxed shadow-sm relative group ${
                    isAi
                      ? 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-xs font-normal'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-xs font-medium'
                  }`}>
                    <div className="whitespace-pre-wrap break-words space-y-1">
                      {msg.text.split('\n').map((line, idx) => {
                        const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                        return (
                          <div 
                            key={idx} 
                            dangerouslySetInnerHTML={{ __html: formattedLine }} 
                          />
                        );
                      })}
                    </div>

                    <button
                      onClick={() => handleCopyMessage(msg.id, msg.text)}
                      className={`absolute top-1.5 right-1.5 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity ${
                        isAi ? 'bg-slate-100 text-slate-500 hover:text-slate-900' : 'bg-emerald-700/50 text-emerald-100'
                      }`}
                      title="Sao chép"
                    >
                      {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>

                  <div className={`text-[9px] text-slate-400 font-mono px-1 ${isAi ? 'text-left' : 'text-right'}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-2.5 max-w-[85%] self-start animate-pulse">
              <div className="w-7 h-7 rounded-xl bg-[#1B4332] text-emerald-300 flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5 animate-spin" />
              </div>
              <div className="p-3 rounded-2xl rounded-tl-xs bg-white border border-slate-200 text-slate-500 text-xs flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-bounce" />
                <span>Thanh Xuân đang suy nghĩ & nhắn tin cho bạn...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-1.5 bg-slate-100/70 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[10px] scrollbar-none shrink-0">
          <span className="font-extrabold text-slate-400 shrink-0 uppercase text-[9px]">Gợi ý:</span>
          <button
            onClick={() => handleSendMessage('Khiếu nại 48h thế nào?')}
            className="px-2 py-0.5 rounded-lg bg-white hover:bg-emerald-50 text-emerald-900 font-bold border border-emerald-200 shrink-0 transition-all shadow-2xs"
          >
            🛡️ Khiếu nại 48h
          </button>
          <button
            onClick={() => handleSendMessage('20 nội quy 2 ngạch gồm những gì?')}
            className="px-2 py-0.5 rounded-lg bg-white hover:bg-emerald-50 text-emerald-900 font-bold border border-emerald-200 shrink-0 transition-all shadow-2xs"
          >
            📜 20 Nội quy
          </button>
          <button
            onClick={() => handleSendMessage('Quy định tiền tips của khách tặng thế nào?')}
            className="px-2 py-0.5 rounded-lg bg-white hover:bg-emerald-50 text-emerald-900 font-bold border border-emerald-200 shrink-0 transition-all shadow-2xs"
          >
            ☕ Tiền tips & Quỹ chung
          </button>
          <button
            onClick={() => handleSendMessage('Công thức tính điểm nền và bậc lương')}
            className="px-2 py-0.5 rounded-lg bg-white hover:bg-emerald-50 text-emerald-900 font-bold border border-emerald-200 shrink-0 transition-all shadow-2xs"
          >
            📊 Điểm nền & Bậc lương
          </button>
          <button
            onClick={() => handleSendMessage('3 ranh giới đỏ không thỏa hiệp là gì?')}
            className="px-2 py-0.5 rounded-lg bg-white hover:bg-emerald-50 text-emerald-900 font-bold border border-emerald-200 shrink-0 transition-all shadow-2xs"
          >
            ⚠️ 3 Ranh giới đỏ
          </button>
          <button
            onClick={() => handleSendMessage('5 yếu tố không gian của Nhà')}
            className="px-2 py-0.5 rounded-lg bg-white hover:bg-emerald-50 text-emerald-900 font-bold border border-emerald-200 shrink-0 transition-all shadow-2xs"
          >
            🌸 5 Yếu tố không gian
          </button>
          <button
            onClick={() => handleSendMessage('Quy định đi muộn và chấm công')}
            className="px-2 py-0.5 rounded-lg bg-white hover:bg-emerald-50 text-emerald-900 font-bold border border-emerald-200 shrink-0 transition-all shadow-2xs"
          >
            ⏰ Đi muộn & Chấm công
          </button>
          <button
            onClick={() => handleSendMessage('Hỏi thăm lương người khác có bị phạt không?')}
            className="px-2 py-0.5 rounded-lg bg-white hover:bg-emerald-50 text-emerald-900 font-bold border border-emerald-200 shrink-0 transition-all shadow-2xs"
          >
            🤫 Bảo mật lương
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-2.5 bg-white border-t border-slate-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Nhắn gì đó cho Thanh Xuân (ví dụ: Khiếu nại thế nào?)..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              disabled={isLoading}
              className="flex-1 px-3.5 py-2.5 bg-slate-100 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-emerald-600/30 transition-all active:scale-95 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
