import { describe, expect, it } from 'vitest';
import { demoIds, demos } from './index';

describe('animation demo registry', () => {
  it('registers svg-draw and svg-morph with lazy component and source loader', () => {
    expect(demoIds).toContain('svg-draw');
    expect(demos['svg-draw']).toBeDefined();
    expect(typeof demos['svg-draw'].loadSource).toBe('function');
    expect(demoIds).toContain('svg-morph');
    expect(demos['svg-morph']).toBeDefined();
    expect(typeof demos['svg-morph'].loadSource).toBe('function');
  });
});
