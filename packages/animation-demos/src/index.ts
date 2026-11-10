import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

export const demoIds = ['pin-scrub', 'depth-parallax', 'scroll-cube'] as const;
export type DemoId = (typeof demoIds)[number];
export const demos: Record<
  DemoId,
  {
    Component: LazyExoticComponent<ComponentType>;
    loadSource: () => Promise<string>;
  }
> = {
  'pin-scrub': {
    Component: lazy(() => import('./PinScrub')),
    loadSource: () => import('./PinScrub.tsx?raw').then((m) => m.default),
  },
  'depth-parallax': {
    Component: lazy(() => import('./DepthParallax')),
    loadSource: () => import('./DepthParallax.tsx?raw').then((m) => m.default),
  },
  'scroll-cube': {
    Component: lazy(() => import('./ScrollCube')),
    loadSource: () => import('./ScrollCube.tsx?raw').then((m) => m.default),
  },
};
