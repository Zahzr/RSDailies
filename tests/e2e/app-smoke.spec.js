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

  await page.getByRole('button', { name: 'Timers' }).click();
  await page.getByRole('link', { name: 'Farming' }).click();
  await expect(page.locator('#timers-container')).toBeVisible();
});

test('osrs shell loads blank tracker workspace', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Old School RuneScape' }).click();

  await expect(page.locator('#dashboard-container')).toBeVisible();
  await expect(page.locator('#osrsdaily-container')).toBeVisible();
  await expect(page.locator('#osrsweekly-container')).toBeVisible();
  await expect(page.locator('#osrsmonthly-container')).toBeVisible();
  await expect(page.locator('#views-button-panel')).toBeVisible();
  await expect(page.locator('#rs3daily-container')).not.toBeVisible();
});
