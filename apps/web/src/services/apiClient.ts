import { z } from 'zod';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api';

export async function getJson<T>(path: string, schema: z.ZodType<T>): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, { headers: { Accept: 'application/json' } });
  const body: unknown = await response.json().catch(() => undefined);
  if (!response.ok) throw new Error('Unable to reach the API.');
  return schema.parse(body);
}

export async function postJson<T>(path: string, data: unknown, schema: z.ZodType<T>): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const body: unknown = await response.json().catch(() => undefined);
  if (!response.ok) {
    const message = (body as { error?: { message?: unknown } } | undefined)?.error?.message;
    throw new Error(typeof message === 'string' ? message : 'Unable to reach the API.');
  }
  return schema.parse(body);
}
