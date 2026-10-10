import { z } from 'zod';
import { getJson } from '../../services/apiClient';

const healthResponseSchema = z.object({
  data: z.object({
    status: z.literal('ok'),
    service: z.literal('ragebait-api'),
    timestamp: z.string(),
  }),
});

export type HealthStatus = z.infer<typeof healthResponseSchema>['data'];

export function fetchHealth() {
  return getJson('/health', healthResponseSchema).then((response) => response.data);
}
