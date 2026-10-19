import { Router, type RequestHandler } from 'express';
import { env } from '../../config/env.js';
import { PublicApiError } from '../../middleware/errorHandler.js';
import { rageShieldRequestSchema } from './schema.js';
import { analyzeRageShield } from './service.js';

const windowMs = 60_000;
const attempts = new Map<string, number[]>();

const rateLimit: RequestHandler = (request, _response, next) => {
  const now = Date.now();
  const key = request.ip || 'unknown';
  const recent = (attempts.get(key) ?? []).filter((time) => now - time < windowMs);
  if (recent.length >= env.RAGE_SHIELD_MAX_REQUESTS)
    return next(new PublicApiError(429, 'RATE_LIMITED', 'Vui lòng đợi một phút trước khi phân tích thêm nội dung.'));
  recent.push(now);
  attempts.set(key, recent);
  return next();
};

export const rageShieldRouter = Router();
rageShieldRouter.post('/analyze', rateLimit, async (request, response, next) => {
  try {
    const input = rageShieldRequestSchema.parse(request.body);
    const analysis = await analyzeRageShield(input);
    return response.status(200).json({ data: analysis });
  } catch (error) {
    return next(error);
  }
});
