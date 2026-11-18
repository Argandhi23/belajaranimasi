import { test, expect } from '@playwright/test';

test('studio entry links to the catalogue and the lesson tools remain reachable', async ({
  page,
}) => {
  await page.goto('/');
  await page
    .getByRole('link', { name: 'Jelajahi animasi', exact: true })
    .click();
  await expect(page).toHaveURL(/#catalogue-heading$/);
  await page.getByRole('link', { name: 'ScrollTrigger Pin & Scrub' }).click();
  await expect(
    page.getByRole('region', { name: 'Materi praktik' }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Copy Code' })).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Copy AI Prompt' }),
  ).toBeVisible();
  await page.setViewportSize({ width: 650, height: 860 });
  for (const url of ['/', '/animasi/pin-scrub', '/demo/pin-scrub']) {
    await page.goto(url);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(650);
  }
});

test('the new motion studies can be found in the catalogue', async ({
  page,
}) => {
  await page.goto('/');
  for (const name of [
    'Horizontal Scroll Gallery',
    'Kinetic Typography Reveal',
    'FLIP Gallery Layout',
    'SVG Motion Path',
    'Magnetic Button',
    'Staggered Grid Reveal',
    'Interactive 3D Torus Knot',
    'Scramble Text Decode',
    'Multi-Stage Timeline Sequencer',
  ]) {
    await expect(page.getByRole('link', { name, exact: true })).toBeVisible();
  }
  await page.getByRole('button', { name: 'Horizontal storytelling' }).click();
  await expect(page.getByRole('article')).toHaveCount(1);
  await page.getByRole('link', { name: 'Horizontal Scroll Gallery' }).click();
  await expect(page.getByRole('button', { name: 'Copy Code' })).toBeVisible();
});
test('keyboard navigation exposes a working skip link and search', async ({
  page,
}) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('link', { name: 'Lewati navigasi' }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await page.getByRole('textbox').focus();
  await page.keyboard.type('beda kecepatan');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('article')).toHaveCount(1);
  await expect(page.getByRole('article')).toContainText('Depth Parallax');
});
test('catalogue discovery, filters, theme and navigation', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('article')).toHaveCount(14);
  await expect(page.locator('#catalogue-heading')).toContainText('01—14');
  await page
    .getByRole('textbox', { name: 'Cari teknik atau deskripsikan gerakan' })
    .fill(
      'Saya mau objeknya diam di tengah saat scroll, lalu objek tersebut membesar dan berputar',
    );
  await page.getByRole('button', { name: 'Cari', exact: true }).click();
  await expect(page.getByRole('article')).toHaveCount(1);
  await expect(page.getByRole('article')).toContainText('Pin & Scrub');
  await expect(page.locator('#catalogue-heading')).toContainText('01—14');
  await page.getByRole('button', { name: 'Hapus pencarian' }).click();
  await expect(page.getByRole('article')).toHaveCount(14);
  await page.getByLabel('Tingkat kesulitan').selectOption('BEGINNER');
  await expect(
    page.getByRole('link', {
      name: 'Scroll-linked SVG Stroke Draw',
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.getByRole('article')).toHaveCount(1);
  await expect(page.locator('#catalogue-heading')).toContainText('01—14');
  await page.getByLabel('Tingkat kesulitan').selectOption('ADVANCED');
  await expect(
    page.getByRole('link', {
      name: 'Scroll-controlled 3D Rotation',
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.getByRole('article')).toHaveCount(1);
  await expect(page.locator('#catalogue-heading')).toContainText('01—14');
  await page
    .getByRole('link', { name: /Scroll-controlled 3D Rotation/ })
    .click();
  await expect(
    page.getByRole('heading', {
      name: 'Scroll-controlled 3D Rotation',
      exact: true,
    }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Semua animasi', exact: true }).click();
  await expect(page.getByRole('article')).toHaveCount(14);
  await page.getByRole('button', { name: 'Aktifkan tema gelap' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
test('copy code and prompt contain exact runnable source and precise instructions', async ({
  page,
  context,
  browserName,
}) => {
  test.skip(browserName !== 'chromium');
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/animasi/pin-scrub');
  await page.getByRole('button', { name: 'Copy Code', exact: true }).click();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toContain('export default function');
  const source = await page.evaluate(() => navigator.clipboard.readText());
  expect(source).toContain('ScrollTrigger');
  expect(source).toContain('prefers-reduced-motion');
  await page
    .getByRole('button', { name: 'Copy AI Prompt', exact: true })
    .click();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toContain('useGSAP');
});
test('empty, not found and service unavailable states remain actionable', async ({
  page,
}) => {
  await page.goto('/?q=zzzznomatch');
  await expect(page.getByText('Belum ada gerakan yang cocok')).toBeVisible();
  await expect(page.locator('#catalogue-heading')).toContainText('01—14');
  await page.getByRole('button', { name: 'Reset filter' }).click();
  await expect(page.getByRole('article')).toHaveCount(14);
  await page.goto('/animasi/not-found');
  await expect(
    page.getByRole('heading', { name: 'Animasi tidak ditemukan' }),
  ).toBeVisible();
  await page.route('**/api/animations?*', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ items: [], total: 0, page: 1, limit: 12 }),
    }),
  );
  await page.goto('/');
  await expect(page.locator('#catalogue-heading')).toContainText('00');
  await page.unroute('**/api/animations?*');
  await page.route('**/api/animations?*', (route) =>
    route.fulfill({ status: 503, body: '{}' }),
  );
  await page.goto('/');
  await expect(page.getByText('Katalog belum dapat dimuat')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Coba lagi' })).toBeVisible();
});
