import { expect, test } from '@playwright/test';

test('test', async ({ page }) => {
  // Go to http://localhost:3000/
  await page.goto('http://localhost:3000/');
  // Click [placeholder="Search for a book"]
  await page.locator('[placeholder="Search for a book"]').click();
  // Fill [placeholder="Search for a book"]
  await page.locator('[placeholder="Search for a book"]').fill('Der Fremde');
  // Click button:has-text("Search")
  await page.locator('button:has-text("Search")').click();

  // Go to http://localhost:3000/
  await page.goto('http://localhost:3000/');
  // Click [placeholder="Search for a book"]
  await page.locator('[placeholder="Search for a book"]').click();
  // Fill [placeholder="Search for a book"]
  await page.locator('[placeholder="Search for a book"]').fill('Der Fremde');
  // Click button:has-text("Search")
  await page.locator('button:has-text("Search")').click();
  // Click a > .flex > .rounded >> nth=0
  await page.locator('a > .flex > .rounded').first().click();
  await expect(page).toHaveURL('http://localhost:3000/books/C5upAAAACAAJ');
  // Click text=log in >> nth=0
  await page.locator('text=log in').first().click();
  await expect(page).toHaveURL(
    'http://localhost:3000/login?returnTo=/books/C5upAAAACAAJ',
  );
  // Click [placeholder="username"]
  await page.locator('[placeholder="username"]').click();
  // Fill [placeholder="username"]
  await page.locator('[placeholder="username"]').fill('Ada');
  // Press Tab
  await page.locator('[placeholder="username"]').press('Tab');
  // Fill [placeholder="password"]
  await page.locator('[placeholder="password"]').fill('aaa');
  // Click button:has-text("login")
  await page.locator('button:has-text("login")').click();
  await expect(page).toHaveURL('http://localhost:3000/books/C5upAAAACAAJ');
  // Click text=put on your bookstack
  await page.locator('text=put on your bookstack').click();
});
