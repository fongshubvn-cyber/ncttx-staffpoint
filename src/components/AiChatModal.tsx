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
import { Question, Staff, DepartmentLine, ParameterConfig, AuthUser } from '../types';

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

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      sender: 'ai',
      text: `Chào ${userName} nhé! 🌿 Mình là **Thanh Xuân** — người bạn trợ lý AI đồng hành cùng bạn tại Nhà Của Thời Thanh Xuân.\n\nHôm nay công việc của bạn thế nào? Cần trò chuyện hay hỏi gì về cách khiếu nại, tạo phiếu, quy chế hay tiêu chí cứ nhắn cho mình nhé!`,
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

    const linesSummary = lines.map(l => 
      `• Tuyến: ${l.name} (${l.id}) | Áp dụng: ${l.applyTrack}`
    ).join('\n');

    const staffSummary = staffList.map(s => 
      `• NV: ${s.name} (${s.id}) | Vị trí: ${s.role} | Phòng: ${s.department} | Tuyến: ${s.line}`
    ).join('\n');

    return `Bạn là "Thanh Xuân" — người bạn đồng nghiệp AI thông minh, chân thành, thấu hiểu và có tư duy logic sắc bén tại "Nhà Của Thời Thanh Xuân".

[PHONG CÁCH CHAT & XƯNG HÔ]
- Xưng hô: "mình" - "bạn" (hoặc gọi tên nhân sự: "${userName}").
- Tông giọng: Tự nhiên, ấm áp, lịch sự như bạn bè đồng nghiệp lâu năm nhắn tin hỗ trợ nhau.
- Nếu người dùng hỏi hướng dẫn thao tác (Ví dụ: "Khiếu nại thế nào?", "Tạo phiếu sao?", "Xem điểm ở đâu?") ➔ Hãy hướng dẫn từng bước thao tác ứng dụng dễ hiểu, rõ ràng.
- Nếu người dùng chào hỏi (Xin chào, Hi, Chào bạn,...) ➔ Đáp lại bằng lời chào ấm áp, KHÔNG tra cứu tiêu chí cứng nhắc.
- Nếu người dùng tâm sự hoặc hỏi tình huống (Ví dụ: "Nói xấu đối thủ thì sao?", "Điểm vi phạm tính sao?") ➔ Phân tích suy luận như một người bạn am hiểu quy chế: giải thích thấu hiểu, trích dẫn lồng ghép tự nhiên mã tiêu chí [Mã] & điểm số, và đưa ra lời khuyên.

[CƠ SỞ DỮ LIỆU CÔNG TY]
- Điểm khen thưởng: Mức Nhẹ (+${params.recMinorPoints ?? 0.5}đ), Mức Vừa (+${params.recModeratePoints ?? 1.0}đ), Tuyên dương (+${params.recMajorPoints ?? 1.5}đ).
- Điểm vi phạm: Nhắc nhở nhẹ (${params.vioMinorPoints ?? -0.2}đ), Mức Vừa (${params.vioModeratePoints ?? -0.5}đ), Nghiêm trọng (${params.vioMajorPoints ?? -1.0}đ), Ranh Giới Đỏ ⚠️ (${params.vioBoundaryPoints ?? -1.5}đ - Tối đa Cần cải thiện).
- Hạn khiếu nại / giải trình: 48 giờ kể từ khi phát hành phiếu.
- Danh sách ${questions.length} tiêu chí ma trận:
${questionsSummary}
- Danh sách phòng ban:
${linesSummary}
- Danh sách nhân sự:
${staffSummary}`;
  };

  // Friendly Fallback RAG Engine with Smart Intent Classification
  const handleFriendlyLocalSearch = (query: string): string => {
    const rawLower = query.toLowerCase().trim();

    // Intent 0: Chit-chat / Greetings Filter
    const isGreeting = /^(xin chào|chào|chào bạn|hi|hello|helo|chào thanh xuân|bạn là ai|bạn tên gì|tên gì|cảm ơn|thank|tạm biệt|bye|ok|okie)/i.test(rawLower);
    
    if (isGreeting) {
      if (rawLower.includes('bạn là ai') || rawLower.includes('tên gì')) {
        return `Mình là **Thanh Xuân** — người bạn trợ lý AI đồng hành cùng bạn tại Nhà Của Thời Thanh Xuân đây! 🌿\n\nMình có thể nhắn tin tâm sự, tư vấn quy chế làm việc, cách tính điểm thưởng/phạt cũng như hướng dẫn quy trình khiếu nại trong 48h. Bạn cần trò chuyện về chủ đề gì cứ nói với mình nha!`;
      }
      if (rawLower.includes('cảm ơn') || rawLower.includes('thank')) {
        return `Không có gì đâu nè ${userName}! ❤️ Rất vui được đồng hành cùng bạn. Cần hỗ trợ bất kỳ điều gì về công việc hay quy định cứ nhắn mình bất kỳ lúc nào nhé!`;
      }
      return `Chào ${userName} nhé! 🌸 Rất vui được trò chuyện với bạn hôm nay. Công việc hôm nay của bạn thế nào? Có điều gì cần mình lắng nghe hoặc hỗ trợ không nè?`;
    }

    // Intent 1: Procedural Appeal / Dispute Guide (CRITICAL FIX FOR "Khiếu nại thế nào")
    const isAppealQuery = /khiếu nại|giải trình|gửi khiếu nại|tạo khiếu nại|bị vi phạm thì làm|không đồng ý|bị phạt oan|kháng nghị/i.test(rawLower);
    if (isAppealQuery) {
      return `Chào ${userName} nhé! 🛡️ Để gửi **Khiếu Nại** hoặc **Giải Trình** cho một phiếu ghi nhận / biên bản vi phạm, bạn thực hiện theo 3 bước cực đơn giản sau nha:\n\n` +
        `1️⃣ **Bước 1:** Vào tab **Phản Hồi** trên thanh menu chính của App.\n` +
        `2️⃣ **Bước 2:** Tìm phiếu vi phạm hoặc ghi nhận bạn cần giải trình, nhấp vào nút **"Gửi Khiếu Nại"** (hoặc biểu tượng lá thư/khiếu nại).\n` +
        `3️⃣ **Bước 3:** Nhập lý do khiếu nại chi tiết & đính kèm minh chứng (nếu có), sau đó bấm **Xác Nhận Gửi**.\n\n` +
        `⏱️ **LƯU Ý QUAN TRỌNG:** Bạn có **48 giờ** kể từ khi phiếu được phát hành để gửi khiếu nại. Trưởng phòng / Ban Giám Đốc sẽ đối soát và phản hồi duyệt/từ chối trong vòng 48h. Nếu khiếu nại được chấp nhận, điểm phạt sẽ được hủy bỏ và hoàn lại 100%! ❤️`;
    }

    // Intent 2: Create Ticket Guide (Tạo phiếu / Lập biên bản)
    const isCreateTicketQuery = /tạo phiếu|lập biên bản|tạo ghi nhận|tạo phản hồi|tạo vi phạm|cách ghi nhận|cách tạo/i.test(rawLower);
    if (isCreateTicketQuery && !rawLower.includes('khiếu nại')) {
      return `Chào ${userName}! 📝 Để tạo mới một **Phiếu Ghi Nhận** (tuyên dương) hoặc **Biên Bản Vi Phạm** (nhắc nhở):\n\n` +
        `1️⃣ Nhấp vào nút **"+ Tạo Phản Hồi"** ở góc trên bên phải thanh Header (hoặc nút + ở góc dưới màn hình).\n` +
        `2️⃣ Chọn nhân sự được ghi nhận hoặc bị vi phạm.\n` +
        `3️⃣ Chọn loại phiếu: **Ghi Nhận** hoặc **Vi Phạm**.\n` +
        `4️⃣ Nhập từ khóa tìm nhanh tiêu chí, viết mô tả thực tế và bấm **Lưu Phiếu**!`;
    }

    // Intent 3: View Score / Report Guide (Xem điểm / Báo cáo)
    const isReportQuery = /xem điểm|báo cáo|xuất excel|xuất sheet|bậc lương|bảng điểm|điểm làm việc/i.test(rawLower) && !rawLower.includes('điểm phạt') && !rawLower.includes('trừ điểm');
    if (isReportQuery) {
      return `Chào ${userName}! 📊 Để xem điểm làm việc, báo cáo xếp loại quý và xuất dữ liệu:\n\n` +
        `• Xem tổng quan điểm & bậc lương từng nhân sự: Vào tab **Nhân Sự**.\n` +
        `• Xem báo cáo phân tích & xuất Google Sheets / CSV: Vào tab **Báo Cáo & Hướng Dẫn** ➔ Chọn **Báo Cáo Phân Tích**.\n` +
        `• Bạn cũng có thể lọc theo từng quý, phòng ban hoặc tuyến làm việc!`;
    }

    // Intent 4: Nói xấu đối thủ / cạnh tranh
    if (rawLower.includes('nói xấu') || rawLower.includes('đối thủ') || rawLower.includes('so sánh')) {
      const match = questions.find(q => q.id === 'B1.4' || q.text.toLowerCase().includes('nói xấu đối thủ'));
      return `Chào ${userName} nhé! 🌿 Về tình huống nói xấu đối thủ hay đưa đối thủ ra so sánh, mình chia sẻ với bạn như thế này:\n\n` +
        `Trong bộ tiêu chí của Nhà mình, quy định này thuộc mã tiêu chí **[B1.4] - ${match?.text || 'Nhân sự nói xấu đối thủ hoặc đem đối thủ ra so sánh'}** (Nằm ở nhóm **B1: BƯỚC 1, TẠO TÍN NHIỆM VỚI KHÁCH HÀNG**).\n\n` +
        `⚖️ **Mức xử lý & Điểm số:**\n` +
        `• Hành vi này bị xem là vi phạm văn hóa giao tiếp, tùy mức độ sẽ bị tính vi phạm mức Nhẹ hoặc Vừa (trừ từ **${params.vioMinorPoints ?? -0.2}đ** đến **${params.vioModeratePoints ?? -0.5}đ**).\n` +
        `• Nếu có hiểu lầm hay lý do chính đáng, bạn hoàn toàn có thời hạn **48 giờ** để gửi phản hồi khiếu nại trên hệ thống nhé.\n\n` +
        `💡 **Lời khuyên từ Thanh Xuân:** Tín nhiệm của khách hàng dành cho Nhà mình xây dựng từ sự chân thành và chất lượng thực tế. Tập trung làm tốt công việc của mình luôn là cách tỏa sáng nhất bạn nha! ❤️`;
    }

    // Intent 5: Ranh giới đỏ
    if (rawLower.includes('ranh giới') || rawLower.includes('đỏ') || rawLower.includes('nghiêm trọng')) {
      const boundaryQuestions = questions.filter(q => 
        q.category.toLowerCase().includes('ranh giới') || 
        q.text.toLowerCase().includes('ranh giới') ||
        q.groupCode.toLowerCase().includes('rg')
      );
      let resp = `${userName} ơi, **Ranh giới đỏ ⚠️** là các nguyên tắc cốt lõi giúp giữ vững văn hóa tôn trọng và kỷ luật tại Nhà mình:\n\n`;
      boundaryQuestions.slice(0, 5).forEach((q, idx) => {
        resp += `${idx + 1}. **[${q.id}]** ${q.text} *(Nhóm ${q.groupCode} - ${q.groupName})*\n`;
      });
      resp += `\n⚖️ Vi phạm ranh giới đỏ sẽ bị trừ **${params.vioBoundaryPoints ?? -1.5}đ** và xếp loại quý tối đa **Cần cải thiện**.\n\n`;
      resp += `Bạn cần mình giải thích thêm trường hợp nào cứ hỏi mình nhé!`;
      return resp;
    }

    // Intent 6: Điểm thưởng phạt
    if (rawLower.includes('điểm') || rawLower.includes('trừ') || rawLower.includes('cộng') || rawLower.includes('thưởng') || rawLower.includes('phạt')) {
      return `Mình tóm tắt nhanh khung điểm phạt & thưởng để ${userName} dễ theo dõi nhé:\n\n` +
        `🌟 **Phiếu Ghi Nhận (Thưởng):** Mức Nhẹ (+${params.recMinorPoints ?? 0.5}đ), Mức Vừa (+${params.recModeratePoints ?? 1.0}đ), Tuyên Dương (+${params.recMajorPoints ?? 1.5}đ).\n\n` +
        `📢 **Biên Bản Vi Phạm (Phạt):** Nhắc nhở Nhẹ (${params.vioMinorPoints ?? -0.2}đ), Mức Vừa (${params.vioModeratePoints ?? -0.5}đ), Nghiêm trọng (${params.vioMajorPoints ?? -1.0}đ), Ranh giới đỏ ⚠️ (${params.vioBoundaryPoints ?? -1.5}đ).\n\n` +
        `🛡️ Hạn giải trình cho mọi phiếu là **48 giờ** kể từ khi phát hành đó bạn!`;
    }

    // Smart Token Matching (Excluding Stop Words)
    const stopWords = new Set(['trường', 'hợp', 'mình', 'tôi', 'bị', 'là', 'gì', 'thuộc', 'khoản', 'mục', 'nào', 'thì', 'như', 'thế', 'có', 'ko', 'không', 'được', 'vào', 'khi', 'bằng', 'xin', 'chào', 'thế', 'nào', 'sao', 'làm']);
    const tokens = rawLower
      .replace(/[^\w\sàáảãạănắằẳẵặânấầnẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]/gi, ' ')
      .split(/\s+/)
      .filter(t => t.length > 1 && !stopWords.has(t));

    if (tokens.length > 0) {
      const scored = questions.map(q => {
        let score = 0;
        const textL = q.text.toLowerCase();
        tokens.forEach(tok => {
          if (textL.includes(tok)) score += 3;
          if (q.groupName.toLowerCase().includes(tok)) score += 2;
        });
        return { q, score };
      }).filter(s => s.score > 0).sort((a, b) => b.score - a.score);

      if (scored.length > 0) {
        const best = scored[0].q;
        let resp = `À, về nội dung này thì liên quan đến nhóm **${best.groupName}** đó bạn ơi! 🌿\n\n`;
        resp += `📋 **Các tiêu chí liên quan:**\n`;
        scored.slice(0, 3).forEach(({ q }) => {
          resp += `• **[${q.id}]** ${q.text} *(Hạng mục: ${q.category})*\n`;
        });
        resp += `\n⚖️ Tùy mức độ vi phạm nhẹ hay vừa, bạn sẽ bị trừ từ **${params.vioMinorPoints ?? -0.2}đ** đến **${params.vioModeratePoints ?? -0.5}đ**.\n\n`;
        resp += `Nếu bạn muốn trò chuyện thêm về trường hợp này, cứ nhắn cho mình nha!`;
        return resp;
      }
    }

    return `Mình đã lắng nghe câu hỏi của ${userName}. 🌿\n\n` +
      `Tuy chưa thấy cụm từ này trong danh mục tiêu chí, nhưng bạn cứ chia sẻ rõ hơn hoặc thử các từ khóa như *"nói xấu đối thủ"*, *"giờ giấc làm việc"*, *"ranh giới đỏ"* để mình tư vấn chính xác cho bạn nhé!`;
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
            onClick={() => handleSendMessage('Khiếu nại thế nào?')}
            className="px-2 py-0.5 rounded-lg bg-white hover:bg-emerald-50 text-emerald-900 font-bold border border-emerald-200 shrink-0 transition-all shadow-2xs"
          >
            🛡️ Khiếu nại thế nào
          </button>
          <button
            onClick={() => handleSendMessage('Nói xấu đối thủ thì thuộc khoản nào vậy bạn?')}
            className="px-2 py-0.5 rounded-lg bg-white hover:bg-emerald-50 text-emerald-900 font-bold border border-emerald-200 shrink-0 transition-all shadow-2xs"
          >
            💬 Nói xấu đối thủ
          </button>
          <button
            onClick={() => handleSendMessage('Các lỗi ranh giới đỏ là gì?')}
            className="px-2 py-0.5 rounded-lg bg-white hover:bg-emerald-50 text-emerald-900 font-bold border border-emerald-200 shrink-0 transition-all shadow-2xs"
          >
            ⚠️ Ranh giới đỏ
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
