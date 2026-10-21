import { expect, test } from '@playwright/test';
import { login } from './helpers';

test.describe('0025 · Pegar desde el menú contextual', () => {
  test.afterEach(async ({ request }) => {
    for (const cell of ['A1', 'B1']) {
      await request.put(`http://localhost:3001/api/sheets/demo/cells/${cell}`, {
        headers: { 'x-user': 'admin@hojas.test' },
        data: { value: '' },
      });
    }
  });

  test('copia A1 con Ctrl+C y lo pega en B1 desde el clic derecho', async ({ page }) => {
    await login(page, '/hojas/demo');

    // A1 = 4321, esperando al editor antes de teclear (se carga en diferido).
    await page.getByTestId('cell-A1').click();
    await page.keyboard.press('Enter');
    const editor = page.getByRole('textbox', { name: 'Editor de celda' });
    await expect(editor).toBeFocused();
    await editor.fill('4321');
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('cell-A1')).toHaveText('4321');

    // Copiar y pegar sin esperar entre medias: el usuario no ve cuándo termina la copia.
    await page.getByTestId('cell-A1').click();
    await page.keyboard.press('Control+C');
    await page.getByTestId('cell-B1').click({ button: 'right' });
    await page.getByRole('menuitem', { name: 'Pegar' }).click();

    await expect(page.getByTestId('cell-B1')).toHaveText('4321');
  });
});
