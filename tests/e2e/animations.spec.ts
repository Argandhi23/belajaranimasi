import { test, expect } from '@playwright/test';
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
