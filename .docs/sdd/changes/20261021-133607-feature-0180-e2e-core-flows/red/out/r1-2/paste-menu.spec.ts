import { expect, test } from '@playwright/test';
import { cellValue, copiedRange, login, typeInCell } from './helpers';

// Hoja propia: las demás specs escriben en A1 de «demo» y corren en paralelo (workers: 3).
const SHEET = 'pastemenu';

test('copia A1 y lo pega en B1 desde el menú contextual', async ({ page, request }) => {
  await login(page, `/hojas/${SHEET}`);
  await typeInCell(page, 'A1', '4321');
  await expect.poll(() => cellValue(request, SHEET, 'A1')).toBe('4321');

  await page.getByTestId('cell-A1').click();
  await page.keyboard.press('Control+C');
  // El copiado se guarda en el servidor y tarda entre 1 y 3 s: sin esperarlo, «Pegar» no tendría nada.
  await expect.poll(async () => (await copiedRange(request))?.values?.[0]?.[0], { timeout: 10_000 }).toBe('4321');

  await page.getByTestId('cell-B1').click({ button: 'right' });
  await page.getByRole('menuitem', { name: 'Pegar' }).click();

  await expect(page.getByTestId('cell-B1')).toHaveText('4321');
  await expect.poll(() => cellValue(request, SHEET, 'B1')).toBe('4321');
});
