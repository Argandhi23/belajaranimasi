import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

export const demoIds = [
  'pin-scrub',
  'depth-parallax',
  'scroll-cube',
  'svg-draw',
  'svg-morph',
  'horizontal-story',
  'kinetic-type',
  'flip-gallery',
] as const;
export type DemoId = (typeof demoIds)[number];
export const demos: Record<
  DemoId,
  {
    Component: LazyExoticComponent<ComponentType>;
    loadSource: () => Promise<string>;
  }
> = {
  'horizontal-story': {
    Component: lazy(() => import('./HorizontalStory')),
    loadSource: () =>
      import('./HorizontalStory.tsx?raw').then((m) => m.default),
  },
  'kinetic-type': {
    Component: lazy(() => import('./KineticType')),
    loadSource: () => import('./KineticType.tsx?raw').then((m) => m.default),
  },
  'flip-gallery': {
    Component: lazy(() => import('./FlipGallery')),
    loadSource: () => import('./FlipGallery.tsx?raw').then((m) => m.default),
  },
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
  'svg-draw': {
    Component: lazy(() => import('./SvgDraw')),
    loadSource: () => import('./SvgDraw.tsx?raw').then((m) => m.default),
  },
  'svg-morph': {
    Component: lazy(() => import('./SvgMorph')),
    loadSource: () => import('./SvgMorph.tsx?raw').then((m) => m.default),
  },
};
