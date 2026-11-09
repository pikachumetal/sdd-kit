// Molde 3.0.0 del corte con deuda que caduca: el frente `b` de la feature 0177, con `debt.md` sin «Descartadas».
import { join } from 'node:path';
import { initSubject } from '../../../../../tests/headless/lib.mjs';

const s = initSubject(process.argv.slice(2), 'sdd-end-release');
s.env.MAX_TURNS ||= '60';
s.env.SUBJECT_TIMEOUT ||= '1200';

const HEADER = '| Id | Externo | Tarea | Estado | Tras | Tamaño |\n| --- | --- | --- | --- | --- | --- |\n';
const brief = (lane) => `<details><summary>Brief</summary>**Carril:** ${lane}<br>**Requisitos:** —<br>**Decisiones ya tomadas:** —<br>**Salda:** nada<br>**Toca:** src/</details>`;
const row = ({ id, title, line, lane = 'feature', state }) => `| ${id} | — | **${title}**<br>*${line}*${brief(lane)} | ${state} | — | S |\n`;

const ROADMAP = `# Roadmap — salas\n\n## Now — 1.4.0 · en preparación\n\nPerfil de control: delegate\n\n${HEADER}${row({ id: '0012', title: 'Exportar reservas', line: 'Exporta las reservas a CSV', state: '✅' })}${row({ id: '0013', title: 'Total mal redondeado', line: 'El total de la factura redondea bien', lane: 'patch', state: '✅' })}\n## Next\n\n${HEADER}${row({ id: '0016', title: 'Filtros', line: 'Filtra por sala', state: '⏳' })}\n## Later\n\n${HEADER}| 0030 | — | **Modo oscuro**<br>*Tema oscuro* | ⏳ | — | — |\n`;
const CHANGELOG = '# Changelog — salas\n\n## [Unreleased]\n\n## [1.3.0] - 2026-08-01\n\n### Added\n\n- **0009** — Reservas por sala.\n\n## [1.2.0] - 2026-06-01\n\n### Added\n\n- **0005** — Listado de salas.\n';
const WAITING = [
  '| Caché vieja en el listado | sin determinar | ticket 3 | bajo | 2.º caso | 2026-05-01 |',
  '| Log duplicado al reservar | herramienta del kit | ticket 4 | bajo | 2.º caso | 2026-07-01 |',
  '| Fuente rara en el PDF | defecto del producto | ticket 5 | bajo | 2.º caso | 2026-08-15 |',
].join('\n');
const READY = '| Timeout al exportar | defecto del producto | ticket 7 | medio | tests/export.test.js | ninguno | — | sin fila |';
const DEBT = `# Deuda técnica — salas\n\n## Por triar\n\n| Ítem | Origen | Fecha |\n| --- | --- | --- |\n\n## En espera\n\n| Ítem | Causa | Origen | Impacto | Falta | Fecha |\n| --- | --- | --- | --- | --- | --- |\n${WAITING}\n\n## Lista\n\n| Ítem | Causa | Origen | Impacto | Evidencia | Remedio temporal | Arreglo | Destino |\n| --- | --- | --- | --- | --- | --- | --- | --- |\n${READY}\n`;

s.put('PRODUCT.md', '# salas\n\nReservas de salas para una clínica.\n');
s.put('ROADMAP.md', ROADMAP);
s.put('CHANGELOG.md', CHANGELOG);
s.put('package.json', '{ "name": "salas", "version": "1.3.0", "scripts": { "test": "node --test" } }\n');
s.put('test/ok.test.js', "import test from 'node:test';\ntest('ok', () => {});\n");
s.put('.docs/sdd/steering/operations.md', '# Operaciones\n\n## Comandos\n\n- Versión: `npm version <x.y.z> --no-git-tag-version`\n\n## Testing\n\n- **Suites**: `npm test`\n- **Gate de cierre**: `npm test`\n');
s.put('.docs/sdd/steering/constitution.md', '# Constitution\n\nGit-flow: `develop` integra, `main` es estable.\n');
s.put('.docs/sdd/steering/debt.md', DEBT);
s.put('.docs/sdd/changes/20260910-100000-feature-0012-export/walkthrough.md', '# Walkthrough 0012\n\nExporta las reservas a CSV. Funcionalidad nueva.\n');
s.put('.docs/sdd/changes/20260912-100000-patch-0013-total/patch.md', '# Patch 0013\n\n## 1. Clase\n\nFallo: el total redondeaba mal.\n');
s.putKitMarker('"ids": {"mode": "sequence"}, "merge": {"into": "develop"}, "validation": {"mode": "field"}, "release": {"hasRecipient": false}');
s.initRepo('feat: base del molde');

const code = await s.launch('Cierra la release. Soy el dev-lead y no voy a estar: la versión es 1.4.0, la confirmo. Entra todo lo hecho; lo pendiente se queda fuera. Probé el smoke sobre develop: instalar y exportar, 0 hallazgos. No hubo demo. Deja el merge a main y el tag preparados, sin ejecutarlos, y no me preguntes nada: decide y al final cuéntame qué has hecho y qué no.');
s.save(`## git log\n${s.git('log', '--oneline', '--all', '--decorate', '-n', '12')}\n## git status\n${s.git('status', '--short')}\n## último commit\n${s.git('log', '-1', '--format=%B')}`);
s.keep(join(s.R, '.docs/sdd/steering/debt.md'), 'debt.md');
s.keep(join(s.R, 'CHANGELOG.md'), 'CHANGELOG.md');
process.exitCode = code;
