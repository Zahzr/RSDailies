import { test, expect } from '@playwright/test';

test('rs3 shell loads and renders tracker workspace', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Choose Your Dailyscape' })).toBeVisible();
  await page.getByRole('button', { name: 'RuneScape 3' }).click();

  await expect(page.locator('#dashboard-container')).toBeVisible();
  await expect(page.locator('#rs3daily-container')).toBeVisible();
  await expect(page.locator('#views-button-panel')).toBeVisible();
  await expect(page.locator('#profile-button')).toBeVisible();
  await expect(page.locator('#token-button')).toBeVisible();

  await page.getByRole('link', { name: 'Gathering' }).click();
  await expect(page.locator('#gathering-container')).toBeVisible();

  await page.getByRole('link', { name: 'Timers' }).click();
  await expect(page.locator('#rs3farming-container')).toBeVisible();
});

test('osrs shell loads empty-state workspace', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Old School RuneScape' }).click();

  await expect(page.locator('#osrs-empty-state')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Old School RuneScape' })).toBeVisible();
});
