import { describe, expect, it } from 'vitest';
import { getHealth } from './service.js';
describe('getHealth', () => {
  it('reports an operational API', () => {
    expect(getHealth()).toMatchObject({ status: 'ok', service: 'ragebait-api' });
  });
});
