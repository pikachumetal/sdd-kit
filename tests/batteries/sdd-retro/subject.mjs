// Sujeto de la batería de sdd-retro: el paso del cierre sobre unas notas de sesión, o un corte con deuda triada.
// Lo lanza tests/headless/battery.mjs run, con SUPERPOWERS_DIR: el sujeto no lleva el CLAUDE.md del dev-lead.
import { existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { scenarioCell, subjectCell } from '../../headless/battery.mjs';
import { initSubject } from '../../headless/lib.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const red = (process.env.PHASE || 'red').startsWith('red');
const expected = (scenarioCell(HERE, process.argv[4], 'Esperado') ?? '').replace(/^sdd-kit:/, '');
const guard = red && expected === 'sdd-retro' ? 'sdd-archive' : expected;
const s = initSubject(process.argv.slice(2), guard);
const cell = subjectCell(HERE, s);
const REQUEST = cell('Petición');
const FOLDER = '.docs/sdd/specs/20261020-100000-feature-0081-reminders';
const MARKER = '"channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}, "control": {"profile": "unattended"}, "merge": {"into": "develop"}, "validation": {"mode": "field"}';

const NOTES = {
  r1: [
    '# Notas de la sesión de la 0081',
    '',
    '- Lancé `npm test` y salió «missing script: test». El dev-lead: «los tests se lanzan con `npm run test:unit`».',
    '- Tras compactar, volví a lanzar `npm test`, porque es lo que dice `operations.md`. El dev-lead, otra vez: «ya te dije que es `npm run test:unit`».',
    '- Por lo demás, las tasks salieron a la primera.',
  ],
  r2: [
    '# Notas de la sesión de la 0081',
    '',
    '- Las dos tasks salieron a la primera, con los comandos de `operations.md`.',
    '- El dev-lead validó sin correcciones.',
  ],
  r3: [
    '# Notas de la sesión de la 0081',
    '',
    '- El paso de arranque de una task de `sdd-implement`, la skill del kit cargada, decía `sdd task open`. Ese verbo no existe: `unknown verb`. Es `sdd task start`.',
    '- Por lo demás, las tasks salieron a la primera y el dev-lead no corrigió nada.',
  ],
  r5: [
    '# Notas de la sesión de la 0081',
    '',
    '- En la Task 1 quedó un `console.log` de depuración en `src/`; lo cazó la revisión final y costó una pasada de fix.',
    '- En la Task 2 volvió a quedar otro `console.log` en `src/`, con otra pasada de fix.',
    '- El proyecto corre `node --test` antes de cada commit, y ningún test lo mira.',
  ],
};

const WALKTHROUGH = ['# Walkthrough — feature 0081', '', '## 1. Cambios realizados', '', 'Recordatorio por correo de cada reserva.', '', '## 5. Aprendizajes', '', '- Ninguno.', '', 'Retro: <señal> → <salida> (<fichero>) | Retro: <señal> → ticket del kit: <qué desmiente> | Retro: sin señales', ''].join('\n');
const OPERATIONS = ['# Operations — salas', '', '## Testing', '', '- Tests: `npm test`', ''].join('\n');

function closeMold() {
  s.put(`${FOLDER}/walkthrough.md`, WALKTHROUGH);
  s.put('.docs/sdd/steering/operations.md', OPERATIONS);
  s.put('notas-sesion.md', `${NOTES[s.SC].join('\n')}\n`);
}

const LIST = [
  '| El anuncio sale 4 de 6 | regla lejos de su paso | [a](a.md), [b](b.md) | medio | `grep anuncio` | ninguno | mover regla | sin fila |',
  '| El prompt sale sin su forma | regla lejos de su paso | [c](c.md) | bajo | `grep prompt` | — | mover regla | sin fila |',
  '| `--planta 2` lista otra planta | defecto del producto | [d](d.md) | alto | `npm start libres` | — | — | 0030 |',
];
const DEBT = [
  '# Deuda técnica — salas', '',
  '## Por triar', '', '| Ítem | Origen | Fecha |', '| --- | --- | --- |', '',
  '## En espera', '', '| Ítem | Causa | Origen | Impacto | Falta | Fecha |', '| --- | --- | --- | --- | --- | --- |',
  '| El aviso sale doble | regla lejos de su paso | [e](e.md) | bajo | 2.º caso | 2026-10-01 |', '',
  '## Lista', '', '| Ítem | Causa | Origen | Impacto | Evidencia | Remedio temporal | Arreglo | Destino |', '| --- | --- | --- | --- | --- | --- | --- | --- |', ...LIST, '',
].join('\n');
const EMPTY_DEBT = DEBT.split('\n').filter((line) => !/^\| (El |`--planta)/.test(line)).join('\n');
const PREVIOUS_RETRO = [
  '# Retro — v1.3.0', '', '## Repaso por causa', '', '| Causa | En espera | Lista |', '| --- | --- | --- |', '| regla lejos de su paso | 0 | 2 |', '',
  '## Abiertas en «Lista»', '', '| Ítem | Causa | Casos | Destino | Abierta desde |', '| --- | --- | --- | --- | --- |',
  '| El anuncio sale 4 de 6 | regla lejos de su paso | 2 | sin fila | 1.2.0 |', '| La fila cerrada | regla lejos de su paso | 1 | sin fila | 1.3.0 |', '', 'Cerradas desde la 1.2.0: 0', '',
  '## Propuestas', '', 'Sin propuestas', '',
].join('\n');
const ROADMAP = [
  '# Roadmap — salas', '', '## Now', '', 'Perfil de control: unattended', '',
  '| Id | Externo | Tarea | Estado | Tras | Tamaño |', '| --- | --- | --- | --- | --- | --- |',
  '| 0040 | — | **Exportar salas**<br>*A CSV.*<details><summary>Brief</summary>**Carril:** feature</details> | ✅ |  | S |', '',
  '## Next', '', '| Id | Externo | Tarea | Estado | Tras | Tamaño |', '| --- | --- | --- | --- | --- | --- |', '',
  '## Later', '', '| Id | Externo | Tarea | Estado | Tras | Tamaño |', '| --- | --- | --- | --- | --- | --- |', '',
].join('\n');
const CHANGELOG = ['# Changelog', '', '## [Unreleased]', '', '## [1.3.0] - 2026-09-01', '', '### Added', '', '- Reservas.', ''].join('\n');

const EXPORT_FOLDER = '.docs/sdd/changes/20261020-100000-feature-0040-export';
const EXPORT_WALKTHROUGH = WALKTHROUGH.replace('0081', '0040').replace('Recordatorio por correo de cada reserva.', 'Exportar salas a CSV.');

function cutMold() {
  s.put('.docs/sdd/steering/debt.md', DEBT);
  s.put('.docs/sdd/releases/v1.3.0/retro.md', PREVIOUS_RETRO);
  s.put('ROADMAP.md', ROADMAP);
  s.put('CHANGELOG.md', CHANGELOG);
  s.put(`${EXPORT_FOLDER}/walkthrough.md`, EXPORT_WALKTHROUGH);
}

const TIME = ['## 2. Tiempo: estimado vs real', '', '- Tipo: feature', '- Estimación de implementación (del plan): 2 h', '- Esfuerzo real: 1,5 h', ''].join('\n');
const LOG = [
  '<!-- AUTO-GENERADO por sdd estimation log (sdd-kit) — no editar a mano. Regenerar: sdd estimation log --root <proyecto> -->',
  '# Estimation log (estimado vs real)', '',
  '| Fecha | Id | Tipo | Est (h) | Real (h) | Ratio | Hilo (tokens) | Subagentes (tokens) | Sujetos ($) | Sesión ($) | Carpeta |',
  '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |',
  '| 2026-10-20 | 0040 | feature | 2 | 1.5 | 0.75 | — | — | — | — | 20261020-100000-feature-0040-export |', '',
].join('\n');

function estimateMold() {
  cutMold();
  const timed = EXPORT_WALKTHROUGH.replace('## 5. Aprendizajes', `${TIME}\n## 5. Aprendizajes`);
  if (timed === EXPORT_WALKTHROUGH) s.die('molde corte-estimacion: el walkthrough de la 0040 no tiene «## 5. Aprendizajes»');
  s.put(`${EXPORT_FOLDER}/walkthrough.md`, timed);
  s.put('.docs/sdd/steering/estimation.md', '# Método de estimación — salas\n\nEl plan estima horas; el walkthrough registra el real.\n');
  s.put('.docs/sdd/steering/estimation-log.md', LOG);
}

s.copy(join(HERE, '..', 'using-sdd', 'mold-salas'));
s.putKitMarker(MARKER);
if (cell('Molde') === 'cierre') closeMold();
else if (cell('Molde') === 'corte') cutMold();
else if (cell('Molde') === 'corte-vacio') {
  cutMold();
  s.put('.docs/sdd/steering/debt.md', EMPTY_DEBT);
  s.put('.docs/sdd/steering/estimation-log.md', '# Log de estimación\n\n| Id | Estimado | Real |\n| --- | --- | --- |\n| 0040 | 2 h | 1,5 h |\n');
  rmSync(join(s.R, '.docs/sdd/releases'), { recursive: true, force: true });
}
else if (cell('Molde') === 'corte-estimacion') estimateMold();
else s.die(`molde desconocido en battery.md: ${s.SC}`);
s.initRepo();
s.git('branch', 'develop');

const named = !red && cell('Paso') !== 'release';
const ask = named ? `Invoca la skill sdd-kit:sdd-retro con \`cierre\` y ${REQUEST[0].toLowerCase()}${REQUEST.slice(1)}` : REQUEST;

s.env.MAX_TURNS ||= '40';
await s.launch(ask);
const at = (path) => join(s.R, path);
for (const [path, name] of [[`${FOLDER}/walkthrough.md`, 'walkthrough.md'], ['.docs/sdd/steering/operations.md', 'operations.md'], ['.docs/sdd/releases/v1.4.0/retro.md', 'retro.md'], ['.docs/sdd/steering/debt.md', 'debt.md'], ['ROADMAP.md', 'ROADMAP.md']]) {
  if (existsSync(at(path))) s.keep(at(path), name);
}
s.save(`## petición\n${ask}\n## git status\n${s.git('status', '--short')}## git log\n${s.git('log', '--oneline', '--all')}## ficheros\n${s.git('ls-files', '--others', '--exclude-standard')}\n## diff\n${s.git('diff')}`);
