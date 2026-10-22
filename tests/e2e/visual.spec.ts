import { test, expect } from '@playwright/test';
import path from 'node:path';

function screenshotOptions(projectName: string) {
  return {
    fullPage: true,
    animations: 'disabled' as const,
    ...(projectName === 'webkit' ? { maxDiffPixelRatio: 0.02 } : {}),
  };
}

test('homepage visual baseline', async ({ page }, testInfo) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage.png', screenshotOptions(testInfo.project.name));
});

test('episode visual baseline', async ({ page }, testInfo) => {
  await page.route('https://media.klocast.com/audio/Episode-1-28072019.mp3', (route) =>
    route.fulfill({
      path: path.resolve('tests/fixtures/audio/beginner-1-your-own-domain.mp3'),
      contentType: 'audio/mpeg',
    }),
  );
  await page.goto('/podcast/episode-1/');
  await expect
    .poll(() => page.locator('audio').evaluate((element) => (element as HTMLMediaElement).readyState))
    .toBeGreaterThan(0);
  await expect(page).toHaveScreenshot('episode-1.png', screenshotOptions(testInfo.project.name));
});
