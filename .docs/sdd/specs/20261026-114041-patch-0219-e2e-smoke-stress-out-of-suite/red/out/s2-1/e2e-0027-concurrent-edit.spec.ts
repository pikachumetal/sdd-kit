import { expect, test } from '@playwright/test';
import { cellValue, login, typeInCell } from './helpers';

const SESSIONS = [1, 2, 3, 4, 5];
const COLUMNS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

// Flujo core: editar celdas de una hoja y que se guarden.
test('cinco sesiones editan 10 celdas distintas cada una y las 50 se guardan', async ({ browser, request }) => {
  const contexts = await Promise.all(SESSIONS.map(() => browser.newContext()));
  try {
    const pages = await Promise.all(contexts.map((c) => c.newPage()));
    await Promise.all(pages.map((page) => login(page, '/hojas/cierre', 'agente@hojas.test')));

    // La sesión N edita la fila N; todas a la vez.
    await Promise.all(pages.map(async (page, i) => {
      for (const col of COLUMNS) await typeInCell(page, `${col}${SESSIONS[i]}`, `v${col}${SESSIONS[i]}`);
    }));

    for (const row of SESSIONS) {
      for (const col of COLUMNS) {
        await expect.poll(() => cellValue(request, 'cierre', `${col}${row}`)).toBe(`v${col}${row}`);
      }
    }
  } finally {
    await Promise.all(contexts.map((c) => c.close()));
  }
});
