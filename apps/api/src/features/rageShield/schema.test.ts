import { describe, expect, it } from 'vitest';
import { rageShieldRequestSchema } from './schema.js';

describe('rageShieldRequestSchema', () => {
  it('accepts content and an optional draft reply', () => {
    expect(
      rageShieldRequestSchema.parse({ content: 'Một đoạn nội dung cần xem xét.', draftReply: 'Tôi chưa đồng ý.' }),
    ).toEqual({ content: 'Một đoạn nội dung cần xem xét.', draftReply: 'Tôi chưa đồng ý.' });
  });

  it('rejects empty content', () => {
    expect(() => rageShieldRequestSchema.parse({ content: '   ' })).toThrow();
  });

  it('rejects content longer than 6,000 characters', () => {
    expect(() => rageShieldRequestSchema.parse({ content: 'a'.repeat(6001) })).toThrow();
  });
});
