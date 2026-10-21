import { expect, test } from '@playwright/test';
import { cellValue, copiedRange, login } from './helpers';

test('pega con el menú contextual lo copiado con Ctrl+C', async ({ page, request }) => {
  await login(page, '/hojas/demo');

  // El editor se carga bajo demanda: se espera a que exista antes de escribir.
  await page.getByTestId('cell-A1').click();
  await page.keyboard.press('Enter');
  const editor = page.getByLabel('Editor de celda');
  await expect(editor).toBeFocused();
  await editor.fill('4321');
  await page.keyboard.press('Enter');
  await expect.poll(() => cellValue(request, 'demo', 'A1')).toBe('4321');

  // La copia se guarda en el servidor y tarda: se espera a que esté antes de pegar.
  await page.getByTestId('cell-A1').click();
  await page.keyboard.press('Control+C');
  await expect.poll(() => copiedRange(request)).toMatchObject({ values: [['4321']] });

  await page.getByTestId('cell-B1').click({ button: 'right' });
  await page.getByRole('menuitem', { name: 'Pegar' }).click();

  await expect(page.getByTestId('cell-B1')).toHaveText('4321');
  await expect.poll(() => cellValue(request, 'demo', 'B1')).toBe('4321');
});
