import { describe, expect, it } from 'vitest';
import { createRageShieldService } from './service.js';

const validAnalysis = {
  riskLevel: 'some_signals',
  summary: 'Nội dung dùng một số cách diễn đạt khái quát.',
  signals: [
    {
      type: 'Khái quát hóa',
      evidence: '"Ai cũng như vậy"',
      explanation: 'Câu nói mở rộng từ vài trường hợp sang cả một nhóm.',
      alternativeExplanation: 'Người viết có thể đang bày tỏ cảm xúc cá nhân.',
      limitation: 'Chưa có ngữ cảnh của bài đăng và các phản hồi trước đó.',
    },
  ],
  pausePrompt: 'Điều gì khiến bạn muốn phản hồi ngay lúc này?',
  verificationSteps: ['Tìm nguồn gốc của tuyên bố.', 'Đọc thêm ngữ cảnh trước khi chia sẻ.'],
  recommendedActions: ['Tạm dừng bình luận.', 'Chỉ phản hồi vào luận điểm, không công kích người viết.'],
  replySuggestion: null,
  limitations: ['AI không xác minh sự thật của nội dung này.'],
};

describe('createRageShieldService', () => {
  it('validates structured output from Groq', async () => {
    const service = createRageShieldService({
      apiKey: 'test-key',
      fetcher: async () => new Response(JSON.stringify({ choices: [{ message: { content: JSON.stringify(validAnalysis) } }] }), { status: 200 }),
    });
    await expect(service({ content: 'Ai cũng như vậy.' })).resolves.toEqual(validAnalysis);
  });

  it('fails safely when the API key is absent', async () => {
    const service = createRageShieldService({ apiKey: '' });
    await expect(service({ content: 'Nội dung' })).rejects.toMatchObject({
      status: 503,
      code: 'AI_NOT_CONFIGURED',
    });
  });

  it('fails safely when Groq returns malformed JSON', async () => {
    const service = createRageShieldService({
      apiKey: 'test-key',
      fetcher: async () => new Response(JSON.stringify({ choices: [{ message: { content: 'không phải JSON' } }] }), { status: 200 }),
    });
    await expect(service({ content: 'Nội dung' })).rejects.toMatchObject({
      status: 502,
      code: 'AI_INVALID_RESPONSE',
    });
  });

  it('fills safe defaults when Groq omits optional analysis fields', async () => {
    const service = createRageShieldService({
      apiKey: 'test-key',
      fetcher: async () => new Response(JSON.stringify({ choices: [{ message: { content: JSON.stringify({ summary: 'Cần thêm bối cảnh.' }) } }] }), { status: 200 }),
    });
    await expect(service({ content: 'Nội dung' })).resolves.toMatchObject({
      riskLevel: 'insufficient_information',
      summary: 'Cần thêm bối cảnh.',
      signals: [],
    });
  });

  it('translates upstream rate limits', async () => {
    const service = createRageShieldService({
      apiKey: 'test-key',
      fetcher: async () => new Response('{}', { status: 429 }),
    });
    await expect(service({ content: 'Nội dung' })).rejects.toMatchObject({
      status: 429,
      code: 'AI_RATE_LIMITED',
    });
  });
});
