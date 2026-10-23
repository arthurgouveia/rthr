import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const PAGES = [
  { path: '/', title: /^Arthur Gouveia — front-end developer$/ },
  { path: '/work', title: /Work history/ },
  { path: '/projects', title: /Open-source projects/ },
  { path: '/contact', title: /Contact/ },
];

// ?static=1 skips the animations, so the checks see the finished page.
for (const { path, title } of PAGES) {
  test(`${path} loads with its own title`, async ({ page }) => {
    const response = await page.goto(`${path}?static=1`);
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(title);
    await expect(page.getByRole('main')).toBeVisible();
  });
}

test('an unknown URL keeps its path and answers 404', async ({ page }) => {
  const response = await page.goto('/crypt/secrets?static=1');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('404');
  await expect(page.getByText('cd /crypt/secrets')).toBeVisible();
  await page.getByRole('link', { name: /cd ~/ }).click();
  await expect(page).toHaveURL('/');
});

test('navigation changes the page and the current-page marker', async ({ page }) => {
  await page.goto('/?static=1');
  await page
    .locator('nav:visible')
    .getByRole('link', { name: /projects/ })
    .click();
  await expect(page).toHaveURL('/projects');
  await expect(page.locator('nav:visible [aria-current="page"]')).toContainText('projects');
});

test('theme and accent are remembered across reloads', async ({ page }) => {
  await page.goto('/?static=1');
  await page.getByRole('button', { name: /switch to lame/ }).click();
  await page.getByRole('button', { name: 'flame' }).click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'lame');
  await expect(page.locator('html')).toHaveAttribute('data-accent', 'flame');
});

test('the detail card opens, closes on Escape and returns focus to its row', async ({ page }) => {
  await page.goto('/projects?static=1');
  const row = page.locator('[data-detail-trigger]').nth(1);
  await row.click();
  const card = page.getByRole('dialog').first();
  await expect(card).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(card).toBeHidden();
  await expect(row).toBeFocused();
});

test('the customize panel edits a token live and resets', async ({ page }) => {
  await page.goto('/?static=1');
  await page.getByRole('button', { name: 'customize me' }).click();
  await page.getByLabel('--soft hex').fill('#123456');
  // A <style> element has no visible text, so read its textContent.
  const overrides = () => page.locator('#token-overrides').evaluate((el) => el.textContent);
  await expect.poll(overrides).toContain('#123456');
  await page.getByRole('button', { name: 'reset' }).click();
  await expect.poll(overrides).toBe('');
});

// Accessibility: the same axe rules used by hand, on every page in both themes.
for (const theme of ['dark', 'lame']) {
  for (const { path } of PAGES) {
    test(`${path} has no accessibility violations (${theme})`, async ({ page }) => {
      await page.addInitScript((t) => localStorage.setItem('ag-theme', t), theme);
      await page.goto(`${path}?static=1`);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
        .analyze();
      expect(results.violations).toEqual([]);
    });
  }
}
