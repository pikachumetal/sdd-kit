import { expect, test } from '@playwright/test';
import { login } from './helpers';

test('exporta la hoja a PDF', async ({ page }) => {
  await login(page, '/hojas/demo');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Exportar a PDF' }).click();
  expect((await download).suggestedFilename()).toBe('demo.pdf');
});
