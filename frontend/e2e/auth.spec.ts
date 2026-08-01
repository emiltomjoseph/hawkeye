import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should allow a user to navigate to login page', async ({ page }) => {
    await page.goto('/login');
    // Ensure we are on the login page
    await expect(page).toHaveURL(/.*login/);
    
    // Look for login form elements (email, password)
    // We assume standard placeholder or name attributes
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    const passwordInput = page.locator('input[type="password"], input[name="password"]');
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });

  test('should allow a user to navigate to signup page', async ({ page }) => {
    await page.goto('/signup');
    await expect(page).toHaveURL(/.*signup/);
    
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    const passwordInput = page.locator('input[type="password"], input[name="password"]');
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });
});
