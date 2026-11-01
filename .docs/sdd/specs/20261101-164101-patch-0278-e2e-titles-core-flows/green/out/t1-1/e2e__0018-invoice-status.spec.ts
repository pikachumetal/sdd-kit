import { expect, test } from '@playwright/test';
import { login } from './helpers';

test('marca una factura como cobrada', async ({ page }) => {
  await login(page, '/facturas');
  await page.getByText('F-014').click();
  await page.getByRole('button', { name: 'Marcar cobrada' }).click();
  await expect(page.getByText('F-014 · Norte SL · 120 € · cobrada')).toBeVisible();
  await page.getByLabel('Estado').selectOption('cobrada');
  await expect(page.getByRole('listitem').filter({ hasText: 'F-014' })).toHaveText('F-014 · Norte SL · 120 € · cobrada');
});
