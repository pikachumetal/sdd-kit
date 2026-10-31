// Molde 3.0.0 del corte de release: un sujeto por frente de la feature 0177.
import { join } from 'node:path';
import { initSubject } from '../../../../../tests/headless/lib.mjs';

const scenario = process.argv[4];
const skill = scenario === 'h' ? 'sdd-archive' : 'sdd-end-release';
const s = initSubject(process.argv.slice(2), skill);
s.env.MAX_TURNS ||= '60';
s.env.SUBJECT_TIMEOUT ||= '1200';

const HEADER = '| Id | Externo | Tarea | Estado | Tras | Tamaño |\n| --- | --- | --- | --- | --- | --- |\n';
const brief = (lane) => `<details><summary>Brief</summary>**Carril:** ${lane}<br>**Requisitos:** —<br>**Decisiones ya tomadas:** —<br>**Salda:** nada<br>**Toca:** src/</details>`;
const row = ({ id, title, line, lane = 'feature', state, after = '—' }) => `| ${id} | — | **${title}**<br>*${line}*${brief(lane)} | ${state} | ${after} | S |\n`;

const NOW_ROWS = [
  row({ id: '0012', title: 'Exportar reservas', line: 'Exporta las reservas a CSV', state: '✅' }),
  row({ id: '0013', title: 'Total mal redondeado', line: 'El total de la factura redondea bien', lane: 'patch', state: '✅' }),
  row({ id: '0014', title: 'Aviso por correo', line: 'Avisa al cancelar una reserva', state: '🧪 validación diferida a el smoke de la 1.4' }),
];
const LATER_ROW = '| 0030 | — | **Modo oscuro**<br>*Tema oscuro* | ⏳ | — | — |\n';

function roadmap(extraNow = []) {
  const now = [...NOW_ROWS, ...extraNow].join('');
  const next = row({ id: '0016', title: 'Filtros', line: 'Filtra por sala', state: '⏳' });
  return `# Roadmap — salas\n\n## Now — 1.4.0 · en preparación\n\nPerfil de control: delegate\n\n${HEADER}${now}\n## Next\n\n${HEADER}${next}\n## Later\n\n${HEADER}${LATER_ROW}`;
}

const CHANGELOG = '# Changelog — salas\n\n## [Unreleased]\n\n## [1.3.0] - 2026-08-01\n\n### Added\n\n- **0009** — Reservas por sala.\n\n## [1.2.0] - 2026-06-01\n\n### Added\n\n- **0005** — Listado de salas.\n';
const BROKEN_CHANGELOG = '# Changelo- **0011** — Ajuste del listado.\ng — salas\n\n## [Unreleased]\n\n## [1.3.0] - 2026-08-01\n\n### Added\n\n- **0009** — Reservas por sala.\n\n## [1.2.0] - 2026-06-01\n\n### Added\n\n- **0005** — Listado de salas.\n';

const DEBT_HEADERS = {
  triage: '| Ítem | Origen | Fecha |\n| --- | --- | --- |\n',
  waiting: '| Ítem | Origen | Impacto | Falta | Fecha |\n| --- | --- | --- | --- | --- |\n',
  ready: '| Ítem | Origen | Impacto | Evidencia | Destino |\n| --- | --- | --- | --- | --- |\n',
  dropped: '| Ítem | Origen | Motivo | Fecha |\n| --- | --- | --- | --- |\n',
};

function debt({ waiting = '', ready = '', dropped = '' } = {}) {
  const h = DEBT_HEADERS;
  return `# Deuda técnica — salas\n\n## Por triar\n\n${h.triage}\n## En espera\n\n${h.waiting}${waiting}\n## Lista\n\n${h.ready}${ready}\n## Descartadas\n\n${h.dropped}${dropped}`;
}

const OLD_WAITING = '| Caché vieja en el listado | ticket 3 | bajo | un 2.º caso | 2026-05-01 |\n| Log duplicado al reservar | ticket 4 | bajo | un 2.º caso | 2026-07-01 |\n| Fuente rara en el PDF | ticket 5 | bajo | un 2.º caso | 2026-08-15 |\n';
const OLD_DROPPED = '| Migrar a otra base de datos | ticket 1 | no compensa | 2026-05-01 |\n| Quitar el logo | ticket 2 | lo pide marketing | 2026-08-15 |\n';
const SETTLED_READY = '| **[Feature 0009, 2026-07-20: saldada — [walkthrough](.docs/sdd/changes/0009/walkthrough.md)]** Reserva sin validar | ticket 6 | medio | [walkthrough](.docs/sdd/changes/0009/walkthrough.md) | 0009 |\n| Timeout al exportar | ticket 7 | medio | tests/export.test.js | sin fila |\n';

function artifacts() {
  s.put('.docs/sdd/changes/20260910-100000-feature-0012-export/walkthrough.md', '# Walkthrough 0012\n\nExporta las reservas a CSV. Funcionalidad nueva.\n');
  s.put('.docs/sdd/changes/20260912-100000-patch-0013-total/patch.md', '# Patch 0013\n\n## 1. Clase\n\nFallo: el total redondeaba mal.\n');
  s.put('.docs/sdd/changes/20260915-100000-feature-0014-mail/walkthrough.md', '# Walkthrough 0014\n\nAviso al cancelar. Validación diferida: disparador: el smoke de la 1.4, a cargo del dev-lead.\n');
}

function baseMold({ recipient = false, changelog = CHANGELOG, debtText = debt(), extraNow = [] } = {}) {
  s.put('PRODUCT.md', '# salas\n\nReservas de salas para una clínica.\n');
  s.put('ROADMAP.md', roadmap(extraNow));
  s.put('CHANGELOG.md', changelog);
  s.put('package.json', '{ "name": "salas", "version": "1.3.0", "scripts": { "test": "node --test" } }\n');
  s.put('test/ok.test.js', "import test from 'node:test';\ntest('ok', () => {});\n");
  s.put('.docs/sdd/steering/operations.md', '# Operaciones\n\n## Comandos\n\n- Versión: `npm version <x.y.z> --no-git-tag-version`\n\n## Testing\n\n- **Suites**: `npm test`\n- **Gate de cierre**: `npm test`\n');
  s.put('.docs/sdd/steering/constitution.md', '# Constitution\n\nGit-flow: `develop` integra, `main` es estable.\n');
  s.put('.docs/sdd/steering/debt.md', debtText);
  s.putKitMarker(`"ids": {"mode": "sequence"}, "merge": {"into": "develop"}, "validation": {"mode": "field"}, "release": {"hasRecipient": ${recipient}}`);
  artifacts();
}

const CUT = 'Cierra la release. Soy el dev-lead y no voy a estar: la versión es 1.4.0, la confirmo. Entra todo lo hecho; lo pendiente se queda fuera. Probé el smoke sobre develop: instalar y exportar, 0 hallazgos; la 0014 no la he probado. No hubo demo. Deja el merge a main y el tag preparados, sin ejecutarlos, y no me preguntes nada: decide y al final cuéntame qué has hecho y qué no.';

const SCENARIOS = {
  a: { build: () => baseMold(), ask: CUT },
  b: { build: () => baseMold({ debtText: debt({ waiting: OLD_WAITING, dropped: OLD_DROPPED }) }), ask: CUT },
  c: {
    build: () => {
      baseMold({ recipient: true });
      s.put('.docs/sdd/client-changelog.md', '# Novedades\n\n## 1.3.0\n\nYa puede reservar por sala.\n');
    },
    ask: `${CUT} La clínica recibe esta entrega: el cliente espera sus novedades hoy.`,
  },
  d: {
    build: () => {
      baseMold({ debtText: debt({ ready: SETTLED_READY }) });
      s.put('.docs/sdd/specs/20260601-100000-feature-0007-rooms/walkthrough.md', '# Walkthrough 0007\n\nValidación diferida: disparador: el smoke de la 1.4, a cargo del dev-lead.\n');
    },
    history: () => {
      s.put('.docs/sdd/roadmap.md', '# Roadmap\n\n## Releases cerradas\n\n### v1.3.0 — 2026-08-01\n\nResumen. validaciones pendientes: 0007\n');
      s.commit('docs(roadmap): cerrar la 1.3.0');
      s.git('rm', '-q', '.docs/sdd/roadmap.md');
      s.commit('chore(sdd): migrar a la 3.0.0');
    },
    ask: CUT,
  },
  e: {
    build: () => {
      baseMold({
        extraNow: [
          row({ id: '0018', title: 'Retirar el acta', line: 'Quita el acta del cierre', state: '✅', after: '0019' }),
          row({ id: '0019', title: 'Recoger el acta', line: 'El acta pasa al roadmap', state: '⏳' }),
        ],
      });
      // e-1 salió contaminado: sin walkthrough, la 0018 fallaba por evidencia y no por su pareja.
      s.put('.docs/sdd/changes/20260918-100000-feature-0018-minutes/walkthrough.md', '# Walkthrough 0018\n\nRetira el acta del cierre. La recoge la 0019.\n');
    },
    ask: CUT,
  },
  f: {
    build: () => baseMold(),
    history: () => {
      s.put('src/fix.js', 'export const fixed = true;\n');
      s.commit('fix(export): cabecera del CSV', 'Patch 0020: hallazgo del smoke de la 1.4.');
    },
    ask: 'Te ordené cerrar la release y propusiste la versión 1.4.0; te respondí «1.4.0». `release.hasRecipient: false` lo escribí yo. Ya hiciste la suite y los pasos previos salvo el corte. Durante el smoke salió un hallazgo y lo arreglé en develop con el patch 0020, ya fusionado: el smoke queda 1 hallazgo, 1 corregido; la 0014 no la he probado. Sigue con el cierre hasta donde te toque según la skill, sin más preámbulo.',
  },
  g: { build: () => baseMold({ changelog: BROKEN_CHANGELOG }), ask: CUT },
  h: {
    build: () => {
      baseMold();
      s.put('.docs/sdd/changes/20261020-100000-patch-0021-header/patch.md', '---\nid: "0021"\n---\n# Patch 0021\n\n## 1. Clase\n\nFallo.\n\n## 2. Causa raíz\n\nLa cabecera del CSV iba sin separador.\n\n## 3. Fix\n\n`src/csv.js`.\n\n## 4. Verificación\n\n`npm test` en verde.\n\n## 5. Esfuerzo\n\nEstimado 0,5 h.\n\n## Capacidades\n\nNinguna, porque ninguna capacidad describe el CSV.\n');
    },
    history: () => {
      s.git('checkout', '-q', '-b', 'patch/0021-header');
      s.put('src/csv.js', "export const header = 'a;b';\n");
      s.commit('fix(csv): separador de la cabecera', 'Patch 0021.');
    },
    ask: 'Cierra el patch 0021 de esta rama. La validación del proyecto es en campo y soy el dev-lead: no me preguntes nada. No hay remoto: deja todo commiteado en la rama, sin fusionar a develop, y dime qué registros has actualizado y cuáles no.',
  },
};

const chosen = SCENARIOS[scenario];
if (!chosen) s.die(`escenario desconocido: ${scenario}`);
chosen.build();
s.initRepo('feat: base del molde');
chosen.history?.();

const code = await s.launch(chosen.ask);
const status = s.git('status', '--short');
const log = s.git('log', '--oneline', '--all', '--decorate', '-n', '12');
s.save(`## git log\n${log}\n## git status\n${status}`);
for (const [path, name] of [
  ['ROADMAP.md', 'ROADMAP.md'],
  ['CHANGELOG.md', 'CHANGELOG.md'],
  ['.docs/sdd/steering/debt.md', 'debt.md'],
  ['.docs/sdd/client-changelog.md', 'client-changelog.md'],
]) s.keep(join(s.R, path), name);
const releases = join(s.R, '.docs/sdd/releases/v1.4.0');
s.keep(join(releases, 'release-notes.md'), 'release-notes.md');
process.exitCode = code;
