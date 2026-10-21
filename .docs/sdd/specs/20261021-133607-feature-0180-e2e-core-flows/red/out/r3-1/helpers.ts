import { APIRequestContext, expect, Page } from '@playwright/test';

export async function login(page: Page, path: string) {
  await page.goto(`/dev/login?user=admin@hojas.test&next=${path}`);
}

export async function typeInCell(page: Page, cell: string, text: string) {
  await page.getByTestId(`cell-${cell}`).click();
  await page.keyboard.press('Enter');
  // CellEditor es lazy: sin esperar al foco se pierden las primeras teclas
  await expect(page.getByLabel('Editor de celda')).toBeFocused();
  await page.keyboard.type(text);
  await page.keyboard.press('Enter');
}

export async function cellValue(request: APIRequestContext, sheet: string, cell: string) {
  const res = await request.get(`http://localhost:3001/api/sheets/${sheet}/cells/${cell}`, { headers: { 'x-user': 'admin@hojas.test' } });
  return (await res.json()).value;
}

export async function copiedRange(request: APIRequestContext) {
  const res = await request.get('http://localhost:3001/api/clipboard', { headers: { 'x-user': 'admin@hojas.test' } });
  return res.json();
}
