import { expect, test } from '@playwright/test';
import { login, typeInCell } from './helpers';

test('formatea una celda como moneda', async ({ page }) => {
  await login(page, '/hojas/demo');
  await typeInCell(page, 'B2', '1234.5');
  await page.getByTestId('cell-B2').click({ button: 'right' });
  await page.getByRole('menuitem', { name: 'Formato moneda' }).click();
  await expect(page.getByTestId('cell-B2')).toHaveText('1.234,50 €');
});
