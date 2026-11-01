// Copias de dos suites reales, sin sus documentos ni su historia, y un molde sin E2E. Lanzador de RED y GREEN.
// MOLDS: carpeta con dm/, ody/ (solo código de apps/frontend y lo que importa) y sus node_modules ya instalados.
// a1, a2: una task que amplía un E2E, sin «Flujos core». m1: paso 2 de la migración con E2E. i1: init con E2E.
// n1: la guía sin E2E. n2: paso 2 de la migración sin E2E.
// Las salidas llevan títulos de producto de clientes: SPEC_DIR va fuera del repo y aquí no se guarda ninguno.
import { mkdirSync, rmSync, symlinkSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { initSubject } from '../../../../../tests/headless/lib.mjs';

const REPO = process.env.KIT_REPO;
const MOLDS = process.env.MOLDS;
const s = initSubject(process.argv.slice(2), 'sdd-tdd');
s.env.MAX_TURNS ||= '60';
s.env.SUBJECT_TIMEOUT ||= '1200';

const projects = {
  dm: { unit: '`unit` · `pnpm --dir apps/frontend exec vitest run` · ~1 min · unitario', e2e: 'apps/frontend/e2e/comments.spec.ts' },
  ody: { unit: '`e2e-check` · `pnpm --dir apps/frontend run e2e:check` · ~20 s · unitario', e2e: 'apps/frontend/e2e/a11y/csp.spec.ts' },
};

function realProject(name) {
  s.copy(join(MOLDS, `${name}-src`));
  s.put('.gitignore', 'node_modules/\ntest-results/\n.temp/\n');
  return projects[name];
}

function linkModules(name) {
  symlinkSync(resolve(MOLDS, name, 'node_modules'), join(s.R, 'node_modules'), 'junction');
  symlinkSync(resolve(MOLDS, name, 'apps/frontend/node_modules'), join(s.R, 'apps/frontend/node_modules'), 'junction');
}

function operations(unit, e2eLine) {
  return `# Operations\n\n## Testing\n\n- **Suites**: ${unit}${e2eLine ? `; ${e2eLine}` : ''}\n- **Gate de cierre**: la suite ${e2eLine ? 'E2E' : 'unit'}, entera\n`;
}

function task(project) {
  const F = '.docs/sdd/specs/20261101-090000-feature-0030-assert';
  s.git('checkout', '-q', '-b', 'feature/0030-assert');
  s.put(`${F}/spec.md`, `---\nfeature: 0030\nmode: full\nprofile: delegate\nstatus: approved\n---\n\n# Spec\n\n## Dónde se prueba\n\n- En el E2E existente: su primer test gana una aserción, sin cambiar de título.\n\n## Aprobaciones\n\n| 2026-11-01 | aprobada por delegación |\n`);
  s.put(`${F}/plan.md`, `# Plan\n\n**Ejecución**: Native.\n\n## Task 1: una aserción más\n\n- **Qué**: en el primer test de \`${project.e2e}\`, al acabar, comprueba con una aserción web-first que la página sigue con un \`body\` visible. Sin título nuevo.\n`);
  s.commit('docs(sdd): abrir la 0030');
  return `Invoca la skill sdd-kit:sdd-tdd y haz la Task 1 del plan de la 0030 (${F}/plan.md), también lo que la guía del kit pida al proyecto para esa task. Las dependencias ya están instaladas: no instales nada. Aquí no hay navegadores ni entorno levantado: el E2E escríbelo sin ejecutarlo. Haz commit de lo que deba quedar y para; acaba diciendo en dos líneas qué has dejado y qué pides al dev-lead.`;
}

function docs2x(testing) {
  s.putKitMarker('"version": "2.3.4", "channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}, "control": {"profile": "delegate"}, "validation": {"mode": "field"}');
  s.put('.docs/sdd/mission.md', '# Misión\n\n## Por qué existe\n\nUn producto de ejemplo.\n');
  s.put('.docs/sdd/tech-stack.md', `# Tech stack\n\n## Comandos\n\n- **Build**: \`pnpm build\`\n\n${testing}`);
  s.put('.docs/sdd/roadmap.md', '# Roadmap\n\n## Próximo\n');
}

const MIGRATE = 'Actualízame al kit con sdd-upgrade. Es una prueba: de la migración a v3.0.0 haz solo el paso 2, sin los demás. Con el paso 2, enseña su tabla entera, con la fila `## Testing` y lo que ofreces, y para en su gate.';

function noE2eHojas() {
  s.copy(join(REPO, 'tests/batteries/sdd-verify/mold-hojas'));
  rmSync(join(s.R, 'e2e'), { recursive: true });
  rmSync(join(s.R, 'playwright.config.ts'));
  s.put('.gitignore', 'node_modules/\n');
}

const scenarios = {
  a1: () => prepareTask('dm'),
  a2: () => prepareTask('ody'),
  m1() {
    const p = realProject('dm');
    docs2x(`## Testing\n\n${operations(p.unit, '`e2e` · `pnpm --dir apps/frontend exec playwright test` · ~10 min').split('## Testing\n\n')[1]}`);
    s.initRepo('feat: base');
    linkModules('dm');
    if (s.env.PHASE === 'green') s.env.TURN2 = 'Sí a la tabla y sí al test de títulos; ningún flujo core por ahora. Aplícalo: escribe `.docs/sdd/steering/operations.md` y el test, córrelo y haz commit. No hagas los demás pasos.';
    return MIGRATE;
  },
  i1() {
    realProject('dm');
    s.initRepo('feat: base');
    linkModules('dm');
    return 'Invoca sdd-kit:sdd-init en este proyecto. Es una prueba: no escribas nada ni me entrevistes. Mira el proyecto y acaba enseñándome qué propondrías para `## Testing` de `operations.md` y qué me preguntarías u ofrecerías en ese punto.';
  },
  n1() {
    noE2eHojas();
    s.put('.docs/sdd/steering/operations.md', operations('`unit` · `npm test` · ~10 s · unitario'));
    s.initRepo('feat: base');
    const F = '.docs/sdd/specs/20261101-090000-feature-0030-filter';
    s.git('checkout', '-q', '-b', 'feature/0030-filter');
    s.put(`${F}/plan.md`, '# Plan\n\n**Ejecución**: Native.\n\n## Task 1\n\n- **Qué**: un test de componente nuevo: con F-014 cobrada y el estado «cobrada», F-014 sale en la lista.\n');
    s.commit('docs(sdd): abrir la 0030');
    return `Invoca la skill sdd-kit:sdd-tdd y haz la Task 1 del plan de la 0030 (${F}/plan.md), también lo que la guía del kit pida al proyecto para esa task. No instales nada: el test escríbelo sin ejecutarlo. Haz commit de lo que deba quedar y para; acaba diciendo en dos líneas qué has dejado y qué pides al dev-lead.`;
  },
  n2() {
    noE2eHojas();
    rmSync(join(s.R, '.docs'), { recursive: true });
    docs2x(`## Testing\n\n${operations('`unit` · `npm test` · ~10 s').split('## Testing\n\n')[1]}`);
    s.initRepo('feat: base');
    return MIGRATE;
  },
};

function prepareTask(name) {
  const project = realProject(name);
  s.put('.docs/sdd/steering/operations.md', operations(project.unit, '`e2e` · `pnpm --dir apps/frontend exec playwright test` · ~10 min · E2E'));
  s.initRepo('feat: base');
  linkModules(name);
  return task(project);
}

mkdirSync(s.R, { recursive: true });
const ask = scenarios[s.SC]();
await s.launch(ask);
s.save(`## petición\n${ask}\n## git status (nombres)\n${s.git('status', '--short')}\n## ficheros de la rama\n${s.git('log', '--name-status', '--format=%s', '-3')}\n`);
