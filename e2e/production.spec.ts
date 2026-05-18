import { test, expect } from '@playwright/test';

test.describe('Production Application E2E Tests', () => {
  test('should navigate from login page to register page via "Create one" link', async ({ page }) => {
    // Open the application homepage
    await page.goto('https://sitezenshipapp.onrender.com/');

    // Verify we're on the login page
    await expect(page).toHaveTitle(/citizenship|login/i);
    await expect(page.locator('text=Sign in to continue')).toBeVisible({ timeout: 10000 });

    // Click the "Create one" button/link
    const createOneLink = page.locator('a:has-text("Create one")');
    await expect(createOneLink).toBeVisible();
    await createOneLink.click();

    // Verify navigation succeeds by checking we're on the register page
    await expect(page).toHaveURL(/register/i);
    await expect(page.locator('text=/create.*account|sign.*up|register/i')).toBeVisible({ timeout: 10000 });

    // Additional verification: check for register-specific elements
    const registerHeading = page.locator('text=Register');
    if (await registerHeading.count() > 0) {
      await expect(registerHeading).toBeVisible();
    }
  });

  test('should verify application is accessible and responsive', async ({ page }) => {
    // Navigate to the application
    await page.goto('https://sitezenshipapp.onrender.com/');

    // Verify basic accessibility
    const loginForm = page.locator('form');
    await expect(loginForm).toBeVisible({ timeout: 10000 });

    // Check for essential form elements
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();

    // Verify sign-in button is present
    const signInButton = page.locator('button:has-text("Sign In")');
    await expect(signInButton).toBeVisible();
  });
});
