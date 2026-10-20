import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runSdd, sddFolder } from '../capability/helpers.ts';

export const header = '| Id | Externo | Tarea | Estado | Tras | Tamaño |';
export const separator = '| --- | --- | --- | --- | --- | --- |';
export const brief =
  '<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261001-090000-proposal-0010-reports/proposal.md`, §Reglas de negocio<br>**Decisiones ya tomadas:** el aviso sale los lunes a las 8:00<br>**Salda:** nada<br>**Toca:** `src/avisos.js`</details>';
export const laterRow = '| 0020 | — | **Reservar con un código QR**<br>*Desde el móvil, sin pasar por la web.* | ⏳ |  |  |';

export interface RowSpec {
  id: string;
  task?: string;
  state?: string;
  after?: string;
  size?: string;
}

export function row({ id, task = `**Aviso ${id}**<br>*Avisa por correo al responsable.*${brief}`, state = '⏳', after = '', size = 'M' }: RowSpec): string {
  return `| ${id} | — | ${task} | ${state} | ${after} | ${size} |`;
}

export const validRoadmap = [
  '# Roadmap — salas',
  '',
  '## Now — 1.5.0 · en preparación',
  '',
  'Perfil de control: delegate',
  '',
  header,
  separator,
  row({ id: '0012', state: '✅' }),
  `| 0013 | [AB#4512](https://dev.azure.com/salas/_workitems/edit/4512) | **Aviso semanal**<br>*Cada lunes, las reservas de sus salas.*${brief} | ⏳ | 0012 | S |`,
  '',
  '## Next',
  '',
  header,
  separator,
  row({ id: '0014', after: '0012, 0013', size: 'S' }),
  '',
  '## Later',
  '',
  header,
  separator,
  laterRow,
];

export const debtHeaders: Record<string, [string, string]> = {
  'Por triar': ['| Ítem | Origen | Fecha |', '| --- | --- | --- |'],
  'En espera': ['| Ítem | Origen | Impacto | Falta | Fecha |', '| --- | --- | --- | --- | --- |'],
  Lista: ['| Ítem | Origen | Impacto | Evidencia | Destino |', '| --- | --- | --- | --- | --- |'],
  Descartadas: ['| Ítem | Origen | Motivo | Fecha |', '| --- | --- | --- | --- |'],
};

export const validDebt = [
  '# Deuda técnica — salas',
  '',
  '## Por triar',
  '',
  ...debtHeaders['Por triar'],
  '| La exportación a CSV pierde las tildes desde la 1.4.2 | [informe de QA](../../../docs/qa/2026-10-12-informe.md) | 2026-10-12 |',
  '',
  '## En espera',
  '',
  ...debtHeaders['En espera'],
  '| El aviso semanal sale duplicado | [ticket](t.md) | bajo | reproducirlo | 2026-09-15 |',
  '',
  '## Lista',
  '',
  ...debtHeaders.Lista,
  '| `libres --planta 2` lista salas de la planta 1 | [informe de QA](q.md) | alto | `node src/app.js libres --planta 2` → `Norte (planta 1)` | 0014 |',
  '',
  '## Descartadas',
  '',
  ...debtHeaders.Descartadas,
  '| El tema oscuro | [reunión](r.md) | fuera del producto | 2026-09-20 |',
];

export interface Project {
  roadmap?: string[];
  debt?: string[];
  changelog?: string[];
  legacy?: Record<string, string>;
  eol?: string;
  mode?: 'sequence' | 'tracker';
}

function write(path: string, content: string[] | undefined, eol: string): void {
  if (!content) return;
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content.join(eol) + eol);
}

export async function checkProject({ roadmap, debt, changelog, legacy = {}, eol = '\n', mode }: Project) {
  const config: Record<string, string> = mode === undefined ? {} : { 'sdd-kit.json': JSON.stringify({ ids: { mode } }) };
  const sdd = sddFolder({ ...config, ...legacy });
  const root = dirname(dirname(sdd));
  write(join(root, 'ROADMAP.md'), roadmap, eol);
  write(join(root, 'CHANGELOG.md'), changelog, '\n');
  write(join(sdd, 'steering', 'debt.md'), debt, eol);
  return runSdd(['roadmap', 'check', '--path', sdd]);
}

export function lineOf(content: string[], text: string): number {
  return content.indexOf(text) + 1;
}

export function templateLines(name: string): string[] {
  const text = readFileSync(fileURLToPath(new URL(`../../../skills/sdd-templates/templates/${name}`, import.meta.url)), 'utf8');
  const all = text.split(/\r?\n/);
  if (all.at(-1) === '') all.pop();
  return all;
}
