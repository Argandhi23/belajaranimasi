import { describe, expect, it } from 'vitest';
import { demoIds, demos } from './index';

describe('animation demo registry', () => {
  it('registers svg-draw with lazy component and source loader', () => {
    expect(demoIds).toContain('svg-draw');
    expect(demos['svg-draw']).toBeDefined();
    expect(typeof demos['svg-draw'].loadSource).toBe('function');
  });
});
