import { z } from 'zod';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api';

export async function getJson<T>(path: string, schema: z.ZodType<T>): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, { headers: { Accept: 'application/json' } });
  const body: unknown = await response.json().catch(() => undefined);
  if (!response.ok) throw new Error('Unable to reach the API.');
  return schema.parse(body);
}
