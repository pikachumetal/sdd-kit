import { APIRequestContext, Page } from '@playwright/test';

export async function login(page: Page, path: string) {
  await page.goto(`/dev/login?user=admin@hojas.test&next=${path}`);
}

export async function typeInCell(page: Page, cell: string, text: string) {
  await page.getByTestId(`cell-${cell}`).click();
  await page.keyboard.press('Enter');
  // CellEditor se carga con lazy(): sin esperar al editor, las teclas se pierden en la rejilla.
  const editor = page.getByTestId(`cell-${cell}`).getByLabel('Editor de celda');
  await editor.fill(text);
  await editor.press('Enter');
  await editor.waitFor({ state: 'detached' });
}

export async function cellValue(request: APIRequestContext, sheet: string, cell: string) {
  const res = await request.get(`http://localhost:3001/api/sheets/${sheet}/cells/${cell}`, { headers: { 'x-user': 'admin@hojas.test' } });
  return (await res.json()).value;
}

export async function copiedRange(request: APIRequestContext) {
  const res = await request.get('http://localhost:3001/api/clipboard', { headers: { 'x-user': 'admin@hojas.test' } });
  return res.json();
}
