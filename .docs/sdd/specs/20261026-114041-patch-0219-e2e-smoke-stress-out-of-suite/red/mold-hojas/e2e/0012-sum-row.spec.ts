import { expect, test } from '@playwright/test';
import { cellValue, login, typeInCell } from './helpers';

test('la fila de total suma la columna', async ({ page, request }) => {
  await login(page, '/hojas/demo');
  await typeInCell(page, 'A1', '100');
  await expect.poll(() => cellValue(request, 'demo', 'A1')).toBe('100');
  await typeInCell(page, 'A2', '250');
  await expect.poll(() => cellValue(request, 'demo', 'A2')).toBe('250');
  await typeInCell(page, 'A3', '=SUMA(A1:A2)');
  await expect(page.getByTestId('cell-A3')).toHaveText('350');
});
