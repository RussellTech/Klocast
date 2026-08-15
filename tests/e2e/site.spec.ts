import { test, expect } from '@playwright/test';
import path from 'node:path';

test('homepage and episode navigation', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Klocast/);
  await expect(page.locator('h1')).toContainText('Talking about SEO and the Web');
  await page
    .getByRole('link', { name: /Beginner 1/ })
    .first()
    .click();
  await expect(page).toHaveURL(/beginner-1-your-own-domain/);
  await expect(page.locator('audio')).toHaveAttribute('aria-label', /Play/);
  await expect(page.getByRole('link', { name: /Download audio file/ })).toHaveAttribute('href', /audio/);
});

test('local episode audio exposes metadata and can start playback', async ({ page }) => {
  await page.route('https://media.klocast.com/audio/beginner-1-your-own-domain.mp3', (route) =>
    route.fulfill({
      path: path.resolve('tests/fixtures/audio/beginner-1-your-own-domain.mp3'),
      contentType: 'audio/mpeg',
    }),
  );
  await page.goto('/podcast/beginner-1-your-own-domain/');
  const audio = page.locator('audio');
  await expect
    .poll(() => audio.evaluate((element) => (element as HTMLMediaElement).readyState), { timeout: 15000 })
    .toBeGreaterThan(0);
  await audio.evaluate((element) => (element as HTMLMediaElement).play());
  await expect
    .poll(() =>
      audio.evaluate((element) => ({
        paused: (element as HTMLMediaElement).paused,
        duration: (element as HTMLMediaElement).duration,
      })),
    )
    .toMatchObject({ paused: false });
});

test('keyboard skip link and mobile layout', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.locator('.skip-link').focus();
  await expect(page.locator('.skip-link')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main-content$/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test('404 is genuine', async ({ page }) => {
  const response = await page.goto('/this-route-does-not-exist/');
  expect(response?.status()).toBe(404);
  await expect(page.locator('h1')).toContainText('not here');
});
