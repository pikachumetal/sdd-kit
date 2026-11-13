import { expect, test } from '@playwright/test';
import { login, savedStatus } from './helpers';

test('recuerda el filtro de estado al volver a facturas', async ({ page, request }) => {
  await login(page, '/facturas');
  await page.getByLabel('Estado').selectOption('cobrada');
  await expect.poll(() => savedStatus(request)).toBe('cobrada');
  await page.getByRole('link', { name: 'Hojas' }).click();
  await page.getByRole('link', { name: 'Facturas' }).click();
  await expect(page.getByLabel('Estado')).toHaveValue('cobrada');
});

test('el desplegable de estado tiene cuatro opciones', async ({ page }) => {
  await login(page, '/facturas');
  await expect(page.getByLabel('Estado').locator('option')).toHaveCount(4);
});
