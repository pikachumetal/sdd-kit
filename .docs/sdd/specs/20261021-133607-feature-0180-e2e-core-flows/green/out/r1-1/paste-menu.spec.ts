import { expect, test } from '@playwright/test';
import { login } from './helpers';

test.describe('Copiar y pegar entre celdas (0025)', () => {
  test('pega con el menú contextual lo copiado con Ctrl+C', async ({ page }) => {
    // Hoja propia del test: no depende de datos de otro.
    await login(page, `/hojas/e2e-0025-${Date.now()}`);

    // Escribe 4321 en A1 esperando al editor visible antes de teclear.
    await page.getByTestId('cell-A1').click();
    await page.keyboard.press('Enter');
    const editor = page.getByRole('textbox', { name: 'Editor de celda' });
    await expect(editor).toBeFocused();
    await editor.fill('4321');
    await editor.press('Enter');
    await expect(page.getByTestId('cell-A1')).toHaveText('4321');

    // Copia y sigue como lo haría el usuario: sin esperar al servidor.
    await page.keyboard.press('Control+c');

    await page.getByTestId('cell-B1').click({ button: 'right' });
    await page.getByRole('menuitem', { name: 'Pegar' }).click();

    await expect(page.getByTestId('cell-B1')).toHaveText('4321');
  });
});
