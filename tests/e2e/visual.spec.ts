import { test, expect } from '@playwright/test';

test('homepage visual baseline', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage.png', { fullPage: true, animations: 'disabled' });
});

test('episode visual baseline', async ({ page }) => {
  await page.goto('/podcast/episode-1/');
  await expect(page).toHaveScreenshot('episode-1.png', { fullPage: true, animations: 'disabled' });
});
