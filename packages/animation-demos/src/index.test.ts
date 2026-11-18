import { describe, expect, it } from 'vitest';
import { demoIds, demos } from './index';

describe('animation demo registry', () => {
  it.each([
    'horizontal-story',
    'kinetic-type',
    'flip-gallery',
    'motion-path',
    'magnetic-button',
    'stagger-grid',
    'three-torus-orbit',
    'text-scramble',
    'timeline-choreography',
  ])('makes %s available as a demo with copyable source', async (id) => {
    expect(demoIds).toContain(id);
    const demo = Object.entries(demos).find(([slug]) => slug === id)?.[1];
    expect(await demo?.loadSource()).toContain('export default function');
  });

  it('registers svg-draw and svg-morph with lazy component and source loader', () => {
    expect(demoIds).toContain('svg-draw');
    expect(demos['svg-draw']).toBeDefined();
    expect(typeof demos['svg-draw'].loadSource).toBe('function');
    expect(demoIds).toContain('svg-morph');
    expect(demos['svg-morph']).toBeDefined();
    expect(typeof demos['svg-morph'].loadSource).toBe('function');
  });
});
