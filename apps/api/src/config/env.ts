import dotenv from 'dotenv';
import { z } from 'zod';
import { fileURLToPath } from 'node:url';

dotenv.config({ path: fileURLToPath(new URL('../../../../.env', import.meta.url)) });

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  HOST: z.string().default('0.0.0.0'),
  PORT: z.coerce
    .number()
    .int()
    .refine((value) => value === 9001, 'PORT must be 9001.')
    .default(9001),
  CORS_ORIGIN: z.string().min(1).default('http://localhost:9000'),
  GROQ_API_KEY: z.string().min(1).optional(),
  GROQ_BASE_URL: z.url().default('https://api.groq.com/openai/v1'),
  GROQ_MODEL: z.string().min(1).default('openai/gpt-oss-20b'),
  RAGE_SHIELD_MAX_REQUESTS: z.coerce.number().int().min(1).max(100).default(10),
});

const parsed = environmentSchema.safeParse(process.env);
if (!parsed.success)
  throw new Error(
    `Invalid environment: ${parsed.error.issues.map((issue) => issue.message).join(', ')}`,
  );

export const env = {
  ...parsed.data,
  corsOrigins: parsed.data.CORS_ORIGIN.split(',').map((origin) => origin.trim()),
};
