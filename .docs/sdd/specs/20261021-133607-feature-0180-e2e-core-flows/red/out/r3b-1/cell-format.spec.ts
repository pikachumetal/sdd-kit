import { expect, test } from '@playwright/test';
import { cellValue, login, typeInCell, uniqueSheet } from './helpers';

test('formatea una celda como moneda', async ({ page, request }, testInfo) => {
  const sheet = uniqueSheet(testInfo);
  await login(page, `/hojas/${sheet}`);
  await typeInCell(page, 'B2', '1234.5');
  await expect.poll(() => cellValue(request, sheet, 'B2')).toBe('1234.5');
  await page.getByTestId('cell-B2').click({ button: 'right' });
  await page.getByRole('menuitem', { name: 'Formato moneda' }).click();
  await expect(page.getByTestId('cell-B2')).toHaveText('1.234,50 €');
});
