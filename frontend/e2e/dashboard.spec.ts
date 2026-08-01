import { test, expect } from '@playwright/test';

test.describe('Dashboard access', () => {
  test('should require authentication to view dashboard', async ({ page }) => {
    // Attempting to visit the dashboard without being logged in
    // Typically, applications redirect to login or show an unauthorized message
    await page.goto('/dashboard');
    
    // We expect the user to be redirected to login, or a message to be displayed
    // Adjust this expectation based on actual app behavior
    const currentURL = page.url();
    if (!currentURL.includes('/dashboard')) {
        await expect(page).toHaveURL(/.*login/);
    } else {
        // If it doesn't redirect, check if there's a login prompt
        const bodyText = await page.textContent('body');
        expect(bodyText?.toLowerCase()).toContain('login');
    }
  });
});
