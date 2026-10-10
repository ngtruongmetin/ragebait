import 'dotenv/config';
import { z } from 'zod';

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  HOST: z.string().default('0.0.0.0'),
  PORT: z.coerce
    .number()
    .int()
    .refine((value) => value === 9001, 'PORT must be 9001.')
    .default(9001),
  CORS_ORIGIN: z.string().min(1).default('http://localhost:9000'),
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
