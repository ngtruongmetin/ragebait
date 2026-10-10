import type { Health } from './schema.js';
export function getHealth(): Health {
  return { status: 'ok', service: 'ragebait-api', timestamp: new Date().toISOString() };
}
