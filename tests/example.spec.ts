import { test, expect } from '@playwright/test';

test('get started link', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Fitness Buddy/);

  // Click the get started link.
  await page.getByRole('link', { name: 'Get Started Now' }).click();

  // Wait for navigation and expect the page to have a heading with the name of the current URL.
  await page.waitForURL('**/auth/register');
  await expect(page.getByRole('heading', { name: 'Create an account' })).toBeVisible();
});
