import { test, expect } from '@playwright/test';

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
  await page.goto('/podcast/episode-1/');
  await expect(page).toHaveScreenshot('episode-1.png', screenshotOptions(testInfo.project.name));
});
