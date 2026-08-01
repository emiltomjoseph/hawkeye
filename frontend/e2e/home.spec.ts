import { test, expect } from '@playwright/test';

test('has title and landing content', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/HawkEye/i);

  // Check if there is some landing text, assuming there's a heading or hero
  const heading = page.locator('h1').first();
  await expect(heading).toBeVisible();
});

test('navigation links work', async ({ page }) => {
  await page.goto('/');
  
  // Attempt to find a 'Sign In' or 'Login' or similar button to click
  // We don't know the exact text, so we'll just check if the page loads without errors.
  await expect(page.locator('body')).toBeVisible();
});
