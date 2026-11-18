import { test, expect } from '@playwright/test';

test('motion path can be scrubbed with the keyboard in reduced motion', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/demo/motion-path');
  const range = page.getByRole('slider', { name: 'Progres lintasan' });
  const token = page.locator('[data-motion-path-token]');
  await expect(range).toHaveValue('0');
  const position = () =>
    token.evaluate(
      (element) =>
        (element as SVGGraphicsElement).transform.baseVal.getItem(0).matrix.e,
    );
  const start = await position();
  await range.press('End');
  await expect(range).toHaveValue('100');
  await expect.poll(position).toBeGreaterThan(start + 100);
  await range.press('Home');
  await expect(range).toHaveValue('0');
  await expect.poll(position).toBeCloseTo(start, 0);
});

test('magnetic button moves for a fine pointer and remains operable in reduced motion', async ({
  page,
}, testInfo) => {
  await page.goto('/demo/magnetic-button');
  const button = page.getByRole('button', { name: 'Medan magnet' });
  const surface = page.locator('[data-magnetic-surface]');
  await expect(button).toHaveAttribute('aria-pressed', 'false');
  if (testInfo.project.name === 'chromium') {
    await button.hover({ position: { x: 18, y: 35 } });
    await expect
      .poll(() =>
        surface.evaluate(
          (el) => new DOMMatrix(getComputedStyle(el).transform).m41,
        ),
      )
      .toBeLessThan(-1);
    await button.press('Enter');
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expect
      .poll(() => surface.evaluate((el) => getComputedStyle(el).transform))
      .toBe('none');
    await button.press('Enter');
    await expect(button).toHaveAttribute('aria-pressed', 'false');
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect
    .poll(() => surface.evaluate((el) => getComputedStyle(el).transform))
    .toBe('none');
  await button.press('Enter');
  await expect(button).toHaveAttribute('aria-pressed', 'true');
});

test('staggered grid replays and restores the static artwork when motion changes', async ({
  page,
}) => {
  await page.goto('/demo/stagger-grid');
  const replay = page.getByRole('button', { name: 'Putar ulang' });
  const tiles = page.locator('[data-stagger-tile]');
  await expect(tiles).toHaveCount(6);
  await expect(replay).toBeEnabled();
  await replay.press('Enter');
  await expect
    .poll(() =>
      tiles.last().evaluate((el) => Number(getComputedStyle(el).opacity)),
    )
    .toBeLessThan(1);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(replay).toBeDisabled();
  await expect
    .poll(() =>
      tiles.evaluateAll((items) =>
        items.every((item) => getComputedStyle(item).opacity === '1'),
      ),
    )
    .toBe(true);
});

test('horizontal gallery follows scroll on wide screens and reflows with reduced motion', async ({
  page,
}, testInfo) => {
  await page.goto('/demo/horizontal-story');
  const track = page.getByTestId('horizontal-track');
  const panels = track.getByRole('listitem');
  await expect(panels).toHaveCount(3);
  const pin = page.locator('.pin-spacer');
  if (testInfo.project.name === 'chromium') {
    const offset = () =>
      track.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41);
    await expect(pin).toHaveCount(1);
    await pin.evaluate((el) =>
      window.scrollTo(
        0,
        el.getBoundingClientRect().top + scrollY + el.clientHeight * 0.65,
      ),
    );
    await expect.poll(offset).toBeLessThan(-100);
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect.poll(offset).toBe(0);
    await page.setViewportSize({ width: 768, height: 850 });
    await expect(pin).toHaveCount(0);
    await page.setViewportSize({ width: 1280, height: 850 });
    await expect(pin).toHaveCount(1);
  } else {
    await expect(pin).toHaveCount(0);
  }
  await page.getByRole('link', { name: 'Belajar Animasi, beranda' }).click();
  await expect(pin).toHaveCount(0);
  await page.getByRole('link', { name: 'Horizontal Scroll Gallery' }).click();
  await expect(panels).toHaveCount(3);
  await expect(pin).toHaveCount(testInfo.project.name === 'chromium' ? 1 : 0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(pin).toHaveCount(0);
  await expect
    .poll(
      async () =>
        (await panels.last().boundingBox())!.y -
        (await panels.first().boundingBox())!.y,
    )
    .toBeGreaterThan(0);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(pin).toHaveCount(testInfo.project.name === 'chromium' ? 1 : 0);
});

test('kinetic title plays and restores all text when motion is reduced', async ({
  page,
}) => {
  await page.goto('/demo/kinetic-type');
  const heading = page.getByRole('heading', { name: 'Huruf ikut bergerak' });
  const replay = page.getByRole('button', { name: 'Putar ulang' });
  await expect(heading).toBeVisible();
  await expect(heading).toHaveText('Huruf ikut bergerak');
  const word = heading.getByText('Huruf', { exact: true });
  await replay.focus();
  await page.keyboard.press('Enter');
  await expect
    .poll(() => word.evaluate((el) => getComputedStyle(el).transform))
    .not.toBe('none');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(replay).toBeHidden();
  await expect(heading).toBeVisible();
  await expect
    .poll(() => word.evaluate((el) => getComputedStyle(el).transform))
    .toBe('none');
});

test('FLIP changes layout with the keyboard and works with reduced motion', async ({
  page,
}) => {
  await page.goto('/demo/flip-gallery');
  const grid = page.getByRole('button', { name: 'Grid', exact: true });
  const list = page.getByRole('button', { name: 'Daftar', exact: true });
  const gallery = page.getByRole('list', { name: 'Galeri bentuk' });
  const secondCard = gallery.getByRole('listitem').nth(1);
  await expect(grid).toHaveAttribute('aria-pressed', 'true');
  const start = (await secondCard.boundingBox())!;
  await list.focus();
  await page.keyboard.press('Enter');
  await expect(list).toHaveAttribute('aria-pressed', 'true');
  await expect
    .poll(() => secondCard.evaluate((el) => getComputedStyle(el).transform))
    .not.toBe('none');
  await expect
    .poll(async () => (await secondCard.boundingBox())!.x)
    .toBeLessThan(start.x - 20);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await grid.click();
  await expect(grid).toHaveAttribute('aria-pressed', 'true');
  expect(
    await secondCard.evaluate((el) => getComputedStyle(el).transform),
  ).toBe('none');
  expect((await secondCard.boundingBox())!.x).toBeCloseTo(start.x, 0);
});
test('actual WebGL canvas survives StrictMode and rotates on scroll', async ({
  page,
}) => {
  await page.goto('/demo/scroll-cube');
  await expect(page.locator('canvas')).toBeVisible();
  await expect(page.getByTestId('cube-fallback')).toHaveCount(0);
  await page.getByTestId('cube-stage').scrollIntoViewIfNeeded();
  const before = await page.locator('canvas').screenshot();
  await page
    .getByTestId('cube-track')
    .evaluate((el) =>
      window.scrollTo(
        0,
        el.getBoundingClientRect().top + scrollY + innerHeight * 0.65,
      ),
    );
  await expect
    .poll(async () =>
      Buffer.compare(before, await page.locator('canvas').screenshot()),
    )
    .not.toBe(0);
  await page
    .locator('canvas')
    .evaluate((canvas) =>
      canvas.dispatchEvent(new Event('webglcontextlost', { cancelable: true })),
    );
  await expect(page.getByTestId('cube-fallback')).toBeVisible();
});
test('pin scrub changes transforms, unpins on navigation and remounts once', async ({
  page,
}) => {
  await page.goto('/demo/pin-scrub');
  const square = page.getByTestId('pin-square');
  await expect(square).toBeVisible();
  const before = await square.evaluate((el) => getComputedStyle(el).transform);
  await page
    .getByTestId('pin-stage')
    .evaluate((el) =>
      window.scrollTo(
        0,
        el.getBoundingClientRect().top + scrollY + innerHeight,
      ),
    );
  await expect
    .poll(() => square.evaluate((el) => getComputedStyle(el).transform))
    .not.toBe(before);
  await expect(page.locator('.pin-spacer')).toHaveCount(1);
  await page.getByRole('link', { name: 'Belajar Animasi, beranda' }).click();
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  await page.getByRole('link', { name: 'ScrollTrigger Pin & Scrub' }).click();
  await expect(page.locator('.pin-spacer')).toHaveCount(1);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator('.pin-spacer')).toHaveCount(1);
});
test('parallax visibly moves the foreground faster than background', async ({
  page,
}) => {
  await page.goto('/demo/depth-parallax');
  await expect(page.getByTestId('parallax-front')).toBeAttached();
  await page
    .getByTestId('demo-depth-parallax')
    .evaluate((el) =>
      window.scrollTo(
        0,
        el.getBoundingClientRect().top + scrollY + innerHeight * 0.6,
      ),
    );
  await expect
    .poll(() =>
      page
        .getByTestId('parallax-front')
        .evaluate((el) =>
          Math.abs(new DOMMatrix(getComputedStyle(el).transform).m42),
        ),
    )
    .toBeGreaterThan(1);
  const back = await page
    .getByTestId('parallax-back')
    .evaluate((el) =>
      Math.abs(new DOMMatrix(getComputedStyle(el).transform).m42),
    );
  const front = await page
    .getByTestId('parallax-front')
    .evaluate((el) =>
      Math.abs(new DOMMatrix(getComputedStyle(el).transform).m42),
    );
  expect(front).toBeGreaterThan(back);
});
test('reduced motion cube uses explanatory static fallback and normal document flow', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/demo/scroll-cube');
  await expect(page.getByTestId('cube-fallback')).toContainText(
    'Pengurangan gerak aktif',
  );
  await expect(page.locator('canvas')).toHaveCount(0);
  expect(
    await page
      .getByTestId('cube-stage')
      .evaluate((el) => getComputedStyle(el).position),
  ).toBe('relative');
});
test('WebGL-unavailable cube has a usable fallback', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      contextId: string,
      ...args: unknown[]
    ) {
      if (contextId.includes('webgl')) return null;
      return Reflect.apply(original, this, [contextId, ...args]);
    } as typeof original;
  });
  await page.goto('/demo/scroll-cube');
  await expect(page.getByTestId('cube-fallback')).toBeVisible();
});
test('svg draw reduces strokeDashoffset on scroll, navigates cleanly and shows full path on reduced motion', async ({
  page,
}) => {
  await page.goto('/demo/svg-draw');
  const path = page.getByTestId('svg-draw-path');
  await expect(path).toBeVisible();
  const initialOffset = await path.evaluate((el) =>
    parseFloat(getComputedStyle(el).strokeDashoffset),
  );
  expect(initialOffset).toBeGreaterThan(100);
  await page
    .getByTestId('svg-draw-stage')
    .evaluate((el) =>
      window.scrollTo(
        0,
        el.getBoundingClientRect().top + scrollY + innerHeight * 0.5,
      ),
    );
  await expect
    .poll(() =>
      path.evaluate((el) => parseFloat(getComputedStyle(el).strokeDashoffset)),
    )
    .toBeLessThan(initialOffset);
  await page.getByRole('link', { name: 'Belajar Animasi, beranda' }).click();
  await expect(page.getByTestId('svg-draw-path')).toHaveCount(0);
  await page
    .getByRole('link', { name: 'Scroll-linked SVG Stroke Draw' })
    .click();
  await expect(page.getByTestId('svg-draw-path')).toBeVisible();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect
    .poll(() => path.evaluate((el) => getComputedStyle(el).strokeDashoffset))
    .toBe('0px');
});
test('svg morph interpolates path d attribute on scroll, navigates cleanly and reverts to static comparison on reduced motion', async ({
  page,
}) => {
  await page.goto('/demo/svg-morph');
  const path = page.getByTestId('svg-morph-path');
  await expect(path).toBeVisible();
  const initialD = await path.getAttribute('d');
  expect(initialD).toBeTruthy();
  await page
    .getByTestId('svg-morph-stage')
    .evaluate((el) =>
      window.scrollTo(
        0,
        el.getBoundingClientRect().top + scrollY + innerHeight * 0.5,
      ),
    );
  await expect.poll(() => path.getAttribute('d')).not.toBe(initialD);
  await page.getByRole('link', { name: 'Belajar Animasi, beranda' }).click();
  await expect(page.getByTestId('svg-morph-path')).toHaveCount(0);
  await page
    .getByRole('link', { name: 'Scroll-linked SVG Shape Morph' })
    .click();
  await expect(page.getByTestId('svg-morph-path')).toBeVisible();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(() => path.getAttribute('d')).toBe(initialD);
});

test('interactive 3D torus orbit responds to controls and falls back on reduced motion', async ({
  page,
}) => {
  await page.goto('/demo/three-torus-orbit');
  await expect(page.locator('canvas')).toBeVisible();
  await expect(page.getByTestId('torus-fallback')).toHaveCount(0);

  const range = page.getByRole('slider', { name: 'Sudut rotasi' });
  await expect(range).toHaveValue('0');
  const before = await page.locator('canvas').screenshot();
  await range.press('End');
  await expect(range).toHaveValue('100');
  await expect
    .poll(async () =>
      Buffer.compare(before, await page.locator('canvas').screenshot()),
    )
    .not.toBe(0);

  await page.getByRole('button', { name: 'Mode rangka' }).click();
  await expect(
    page.getByRole('button', { name: 'Mode rangka' }),
  ).toHaveAttribute('aria-pressed', 'true');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.getByTestId('torus-fallback')).toBeVisible();
  await expect(page.locator('canvas')).toHaveCount(0);
});

test('text scramble updates phrase and disables replay in reduced motion', async ({
  page,
}) => {
  await page.goto('/demo/text-scramble');
  const target = page.getByTestId('scramble-target');
  const replay = page.getByTestId('scramble-replay');
  await expect(target).toHaveText('Gerak memberi makna');
  await expect(replay).toBeEnabled();

  await page.getByRole('button', { name: 'Kode membentuk ritme' }).click();
  await expect(target).toHaveText('Kode membentuk ritme');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(replay).toBeDisabled();
  await page.getByRole('button', { name: 'Interaksi terasa hidup' }).click();
  await expect(target).toHaveText('Interaksi terasa hidup');
});

test('timeline choreography scrubs with range slider and disables replay in reduced motion', async ({
  page,
}) => {
  await page.goto('/demo/timeline-choreography');
  const range = page.getByRole('slider', { name: 'Progres timeline' });
  const replay = page.getByTestId('timeline-replay');
  const firstCard = page.locator('[data-timeline-card]').first();

  await expect(range).toHaveValue('100');
  await expect(replay).toBeEnabled();

  await range.press('Home');
  await expect(range).toHaveValue('0');
  await expect
    .poll(() =>
      firstCard.evaluate((el) => Number(getComputedStyle(el).opacity)),
    )
    .toBeLessThan(1);

  await replay.click();
  await expect(range).toHaveValue('100');
  await expect
    .poll(() =>
      firstCard.evaluate((el) => Number(getComputedStyle(el).opacity)),
    )
    .toBe(1);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(replay).toBeDisabled();
});
