import { env } from '../../config/env.js';
import { PublicApiError } from '../../middleware/errorHandler.js';
import {
  rageShieldAnalysisSchema,
  type RageShieldAnalysis,
  type RageShieldRequest,
} from './schema.js';

type FetchLike = typeof fetch;

const riskLevels = new Set<RageShieldAnalysis['riskLevel']>([
  'many_signals',
  'some_signals',
  'insufficient_information',
  'no_clear_signals',
  'information_concerns',
]);

function text(value: unknown, fallback: string) {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function textList(value: unknown, fallback: string) {
  const values = Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    : [];
  return values.length ? values : [fallback];
}

function signalType(value: unknown) {
  const label = text(value, 'Dấu hiệu cần xem xét');
  const translated: Record<string, string> = {
    generalization: 'Khái quát hóa',
    'claim about student behavior': 'Nhận định về hành vi của học sinh',
    'emotional language': 'Ngôn từ kích động cảm xúc',
    'call to action': 'Kêu gọi phản ứng gấp',
    'lack of context': 'Thiếu ngữ cảnh',
    'unverified claim': 'Tuyên bố chưa được kiểm chứng',
  };
  return translated[label.toLowerCase()] ?? label;
}

function normalizeAnalysis(value: unknown): RageShieldAnalysis {
  const data = value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
  const signals = Array.isArray(data.signals)
    ? data.signals
        .filter((signal): signal is Record<string, unknown> => Boolean(signal && typeof signal === 'object'))
        .map((signal) => ({
          type: signalType(signal.type),
          evidence: text(signal.evidence, 'AI chưa trích được chi tiết cụ thể từ nội dung.'),
          explanation: text(signal.explanation, 'Cần thêm ngữ cảnh để đánh giá dấu hiệu này.'),
          alternativeExplanation: text(
            signal.alternativeExplanation,
            'Nội dung cũng có thể là ý kiến hoặc phản ứng nhất thời, không đủ để kết luận ý định.',
          ),
          limitation: text(signal.limitation, 'Chỉ có thể đánh giá dựa trên đoạn văn bản được cung cấp.'),
        }))
        .slice(0, 5)
    : [];
  const riskLevel = typeof data.riskLevel === 'string' && riskLevels.has(data.riskLevel as RageShieldAnalysis['riskLevel'])
    ? data.riskLevel
    : 'insufficient_information';

  return rageShieldAnalysisSchema.parse({
    riskLevel,
    summary: text(data.summary, 'Chưa đủ thông tin để đưa ra nhận định cụ thể.'),
    signals,
    pausePrompt: text(data.pausePrompt, 'Bạn có cần dừng lại trước khi bình luận hoặc chia sẻ không?'),
    verificationSteps: textList(data.verificationSteps, 'Tìm nguồn gốc và đọc thêm bối cảnh của nội dung.'),
    recommendedActions: textList(data.recommendedActions, 'Tạm thời không tương tác khi chưa đủ thông tin.'),
    replySuggestion: typeof data.replySuggestion === 'string' && data.replySuggestion.trim() ? data.replySuggestion.trim() : null,
    limitations: textList(data.limitations, 'AI không xác minh sự thật hoặc kết luận chắc chắn về ý định của người đăng.'),
  });
}

const systemPrompt = `Ban la Rage Shield AI, cong cu giao duc ky nang so cho hoc sinh THPT.
BAT BUOC: Tat ca gia tri chuoi trong JSON phai viet bang TIENG VIET CO DAU, ke ca tom tat, tieu de, giai thich, cau hoi va goi y. Khong viet tieng Anh, tru khi can giu nguyen mot cau trich dan tu noi dung nguoi dung gui. CHI tra ve JSON hop le theo schema da yeu cau.
Khong mac dinh noi dung gay tuc gian la Rage Bait. Phan biet ro: dau hieu quan sat duoc, do xac thuc cua thong tin va bang chung ve y dinh cau tuong tac. Khong khang dinh y dinh nguoi dang neu chi co mot doan van ban.
Neu co dau hieu, phai dan chung cum tu cu the tu noi dung, neu it nhat mot giai thich thay the va gioi han cua nhan dinh. Khong bao gio tao nguon, trich dan, du lieu da kiem chung, hoac tuyen bo da kiem chung.
Khong chan doan tam ly, cong kich, khuyen khich tra dua, doxxing, quay roi hay tan cong tap the. Uu tien khong tuong tac, kiem chung them, phan hoi lich su, bao cao hoac tim nguoi lon dang tin cay khi co nguy co.
riskLevel phai la mot trong: many_signals, some_signals, insufficient_information, no_clear_signals, information_concerns.
replySuggestion chi duoc tao khi nguoi dung co draftReply; neu khong phai la null. Gioi han luon phai noi ro AI khong xac minh su that va khong ket luan chac chan y dinh nguoi dang.`;

function hasEnglishAnswer(analysis: RageShieldAnalysis) {
  const visibleText = [
    analysis.summary,
    analysis.pausePrompt,
    ...analysis.signals.flatMap((signal) => [signal.type, signal.explanation, signal.alternativeExplanation, signal.limitation]),
    ...analysis.verificationSteps,
    ...analysis.recommendedActions,
    ...(analysis.replySuggestion ? [analysis.replySuggestion] : []),
    ...analysis.limitations,
  ].join(' ');
  return (visibleText.match(/\b(the|and|with|without|user|students?|claim|content|evidence|would|should|cannot|ask|provide|sources?|none|not|only|this|that|about|from|is|are|may|might|could|generalization|context|information)\b/gi) ?? []).length >= 1;
}

export function createRageShieldService(
  options: {
    apiKey?: string;
    baseUrl?: string;
    model?: string;
    fetcher?: FetchLike;
  } = {},
) {
  const apiKey = options.apiKey ?? env.GROQ_API_KEY;
  const baseUrl = (options.baseUrl ?? env.GROQ_BASE_URL).replace(/\/$/, '');
  const model = options.model ?? env.GROQ_MODEL;
  const fetcher = options.fetcher ?? fetch;

  return async (input: RageShieldRequest): Promise<RageShieldAnalysis> => {
    if (!apiKey)
      throw new PublicApiError(503, 'AI_NOT_CONFIGURED', 'Rage Shield AI chưa được cấu hình.');

    const userMessage = JSON.stringify({
      language: 'vi',
      content: input.content,
      draftReply: input.draftReply ?? null,
      requiredResponse: {
        riskLevel: 'enum',
        summary: 'string',
        signals: [{ type: 'string', evidence: 'string', explanation: 'string', alternativeExplanation: 'string', limitation: 'string' }],
        pausePrompt: 'string',
        verificationSteps: ['string'],
        recommendedActions: ['string'],
        replySuggestion: 'string | null',
        limitations: ['string'],
      },
    });
    const messages = [
      { role: 'system', content: systemPrompt },
      ...(input.conversation ?? []),
      { role: 'user', content: userMessage },
    ];

    async function requestAnalysis(extraMessages: Array<{ role: string; content: string }> = []) {
      let response: Response;
      try {
        response = await fetcher(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          temperature: 0.2,
          response_format: { type: 'json_object' },
          messages: [...messages, ...extraMessages],
        }),
      });
      } catch {
        throw new PublicApiError(503, 'AI_UNAVAILABLE', 'Rage Shield AI đang tạm thời không khả dụng.');
      }

      if (!response.ok) {
        if (response.status === 429)
          throw new PublicApiError(429, 'AI_RATE_LIMITED', 'Rage Shield AI đang bận. Vui lòng thử lại sau ít phút.');
        throw new PublicApiError(503, 'AI_UNAVAILABLE', 'Rage Shield AI đang tạm thời không khả dụng.');
      }

      const payload: unknown = await response.json().catch(() => undefined);
      const content = (payload as { choices?: Array<{ message?: { content?: unknown } }> })?.choices?.[0]?.message?.content;
      if (typeof content !== 'string')
        throw new PublicApiError(502, 'AI_INVALID_RESPONSE', 'Rage Shield AI trả về kết quả không hợp lệ.');

      let parsed: unknown;
      try {
        parsed = JSON.parse(content);
      } catch {
        throw new PublicApiError(502, 'AI_INVALID_RESPONSE', 'Rage Shield AI trả về kết quả không hợp lệ.');
      }

      try {
        return { analysis: normalizeAnalysis(parsed), raw: content };
      } catch {
        throw new PublicApiError(502, 'AI_INVALID_RESPONSE', 'Rage Shield AI trả về kết quả không hợp lệ.');
      }
    }

    const first = await requestAnalysis();
    if (!hasEnglishAnswer(first.analysis)) return first.analysis;
    const retry = await requestAnalysis([
      { role: 'assistant', content: first.raw },
      { role: 'user', content: 'Hay tra lai dung cung JSON nay, nhung toan bo gia tri phai la tieng Viet co dau. Khong giai thich them.' },
    ]);
    return retry.analysis;
  };
}

export const analyzeRageShield = createRageShieldService();
