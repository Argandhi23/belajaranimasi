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

  it.each(demoIds)(
    'keeps %s source strictly monochrome and copyable',
    async (id) => {
      const source = await demos[id].loadSource();
      expect(source).toContain('export default function');
      const hexColors = source.matchAll(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g);
      for (const [, hex] of hexColors) {
        const [r, g, b] =
          hex.length === 3
            ? [hex[0] + hex[0], hex[1] + hex[1], hex[2] + hex[2]].map((c) =>
                Number.parseInt(c, 16),
              )
            : [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)].map((c) =>
                Number.parseInt(c, 16),
              );
        expect(
          Math.max(r, g, b) - Math.min(r, g, b),
          `#${hex}`,
        ).toBeLessThanOrEqual(10);
      }
    },
  );
});
