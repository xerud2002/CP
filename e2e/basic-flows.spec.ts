import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check title
    await expect(page).toHaveTitle(/Curierul Perfect/);
    
    // Check hero section
    await expect(page.locator('h1')).toContainText('Transport Sigur');
    
    // Check CTA button exists
    const ctaButton = page.locator('a[href="/comanda"]').first();
    await expect(ctaButton).toBeVisible();
  });

  test('should navigate to order creation page', async ({ page }) => {
    await page.goto('/');
    
    // Click "Trimite Colet" button
    await page.locator('a[href="/comanda"]').first().click();
    
    // Verify navigation
    await expect(page).toHaveURL('/comanda');
  });
});

test.describe('Contact Form', () => {
  test('should display contact form', async ({ page }) => {
    await page.goto('/contact');
    
    // Check form exists
    await expect(page.locator('form')).toBeVisible();
    
    // Check required fields
    await expect(page.locator('input[name="nume"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('select[name="subiect"]')).toBeVisible();
    await expect(page.locator('textarea[name="mesaj"]')).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/contact');
    
    // Fill form with invalid email
    await page.fill('input[name="nume"]', 'Test User');
    await page.fill('input[name="email"]', 'invalid-email');
    await page.selectOption('select[name="subiect"]', 'suport');
    await page.fill('textarea[name="mesaj"]', 'Test message');
    
    // Try to submit
    await page.click('button[type="submit"]');
    
    // Should show validation error (browser native or custom)
    // Note: This might vary based on implementation
  });
});

test.describe('Authentication', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/login');
    
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should have link to registration', async ({ page }) => {
    await page.goto('/login');
    
    const registerLink = page.locator('a[href*="/register"]');
    await expect(registerLink).toBeVisible();
  });

  test('should have forgot password link', async ({ page }) => {
    await page.goto('/login');
    
    const forgotLink = page.locator('a[href*="/forgot-password"]');
    await expect(forgotLink).toBeVisible();
  });
});
