import { test, expect } from '@playwright/test';
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
  await expect(page.getByRole('article')).toHaveCount(3);
  await page
    .getByRole('textbox', { name: 'Cari teknik atau deskripsikan gerakan' })
    .fill(
      'Saya mau objeknya diam di tengah saat scroll, lalu objek tersebut membesar dan berputar',
    );
  await page.getByRole('button', { name: 'Cari', exact: true }).click();
  await expect(page.getByRole('article')).toHaveCount(1);
  await expect(page.getByRole('article')).toContainText('Pin & Scrub');
  await page.getByRole('button', { name: 'Hapus pencarian' }).click();
  await page.getByLabel('Tingkat kesulitan').selectOption('ADVANCED');
  await expect(page.getByRole('article')).toHaveCount(1);
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
  await expect(page.getByRole('article')).toHaveCount(3);
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
  await page.getByRole('button', { name: 'Reset filter' }).click();
  await expect(page.getByRole('article')).toHaveCount(3);
  await page.goto('/animasi/not-found');
  await expect(
    page.getByRole('heading', { name: 'Animasi tidak ditemukan' }),
  ).toBeVisible();
  await page.route('**/api/animations?*', (route) =>
    route.fulfill({ status: 503, body: '{}' }),
  );
  await page.goto('/');
  await expect(page.getByText('Katalog belum dapat dimuat')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Coba lagi' })).toBeVisible();
});
