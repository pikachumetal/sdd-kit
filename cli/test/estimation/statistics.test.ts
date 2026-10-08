import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { memoryIo } from '../../src/cli/io.ts';
import { run } from '../../src/main.ts';
import { build, buildFixture, project, repoRoot, row, walkthrough } from './helpers.ts';
import type { Time } from './helpers.ts';

const ratios = [0.2, 0.3, 0.4, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.0, 0.6, 0.7, 0.8, 1.0, 1.1, 1.2, 1.3, 1.5, 2.0, 3.0];
const pad = (value: number, width: number) => String(value).padStart(width, '0');

function completeTime(index: number): Time {
  const type = index < 11 ? 'docs' : index < 17 ? 'patch' : 'chore';
  const cost = index === 0 ? '2,5 $' : index === 1 ? 'no medido' : '';
  const sessions = ['1,25 $ (hilo 0,95 $ + subagentes 0,30 $)', 'sin precio (sin tabla pricing en sdd-kit.json)', '0,75 $ (hilo 0,75 $)'];
  return { type, est: '1h', real: `${ratios[index]}h`.replace('.', ','), cost, session: sessions[index] ?? '' };
}

function completeProject(): string {
  const files: Record<string, string> = {};
  ratios.forEach((_, index) => {
    files[`specs/202608${pad(index + 1, 2)}-100000-task-${pad(index + 1, 4)}-r/walkthrough.md`] = walkthrough(completeTime(index));
  });
  files['specs/20260803-120000-task-0099-sinest/walkthrough.md'] = walkthrough({ type: 'docs', est: '—', real: '1,5h', cost: '1,5 $' });
  files['specs/notas-sueltas/walkthrough.md'] = walkthrough({ type: 'docs', est: '—', real: '2h' });
  files['changelog.md'] = '# Changelog\n\n## [Unreleased]\n\n## [0.2.0] - 2026-08-10\n\n- algo\n\n## [0.1.0] — 2026-08-05\n\n- algo\n';
  return project(files);
}

describe('resumen estadístico', () => {
  const complete = build(completeProject()).text;
  const sparse = build(
    project({
      'specs/20260801-100000-task-0001-a/walkthrough.md': walkthrough({ type: 'docs', est: '2h', real: '1h' }),
      'specs/20260802-100000-task-0002-b/walkthrough.md': walkthrough({ type: 'docs', est: '1h', real: '1h' }),
      'specs/20260803-100000-task-0003-c/walkthrough.md': walkthrough({ type: 'docs', est: '1h', real: '2h' }),
    }),
  ).text;

  it.each([
    /\*\*Factor de calibración\*\* \(ratio mediano real\/estimado, 21 artefactos\): \*\*0\.8\*\* · media 0\.95/,
    /^- p25–p75: 0\.6–1\.1$/m,
    /^- p80: 1\.2 — para comprometer una fecha, multiplica la estimación por el p80: así cubre 4 de cada 5 artefactos\.$/m,
    /^\| Tramo del ratio \| n \| % \|$/m,
    /^\| <0\.5 \| 4 \| 19 % \|$/m,
    /^\| 0\.5–0\.8 \| 5 \| 24 % \|$/m,
    /^\| 0\.8–1\.25 \| 8 \| 38 % \|$/m,
    /^\| 1\.25–2 \| 2 \| 10 % \|$/m,
    /^\| ≥2 \| 2 \| 10 % \|$/m,
    /^- Dentro de ±25 %: 38 % · sobreestimadas: 43 % · infraestimadas: 19 %$/m,
    /^- Error absoluto \(h\): media 0\.44 · mediana 0\.3$/m,
    /^- Tendencia \(mediana de las 10 primeras frente a las 10 últimas\): 0\.55 frente a 1\.15$/m,
    /^\| Tipo \| n \| Mediana \| p25–p75 \|$/m,
    /^\| docs \| 11 \| 0\.6 \| 0\.4–0\.85 \|$/m,
    /^\| chore \| 4 \| 1\.75 \| — \|$/m,
    /^\| Release \| Artefactos \| Horas reales \| Mediana \| Sujetos \(\$\) \| Sesión \(\$\) \|$/m,
    /^\| 0\.1\.0 \| 6 \| 3\.3 \| 0\.4 \| 4 \| 2 \|$/m,
    /^\| 0\.2\.0 \| 5 \| 4 \| 0\.8 \| — \| — \|$/m,
    /^\| sin publicar \| 11 \| 14\.2 \| 1\.1 \| — \| — \|$/m,
    /^\| sin fecha \| 1 \| 2 \| — \| — \| — \|$/m,
    /^\| Fecha \| Id \| Tipo \| Est \(h\) \| Real \(h\) \| Ratio \| Hilo \(tokens\) \| Subagentes \(tokens\) \| Sujetos \(\$\) \| Sesión \(\$\) \| Carpeta \|$/m,
    /^\| 2026-08-01 \| 0001 \| docs \| 1 \| 0\.2 \| 0\.2 \| — \| — \| 2\.5 \| 1\.25 \| 20260801-100000-task-0001-r \|$/m,
    /^\| 2026-08-02 \| 0002 \| docs \| 1 \| 0\.3 \| 0\.3 \| — \| — \| no medido \| sin precio \| 20260802-100000-task-0002-r \|$/m,
    /^\| 2026-08-04 \| 0004 \| docs \| 1 \| 0\.4 \| 0\.4 \| — \| — \| — \| — \| 20260804-100000-task-0004-r \|$/m,
  ])('el log completo contiene %s', (expected) => {
    expect(complete).toMatch(expected);
  });

  it('ordena las releases de la más antigua a sin publicar', () => {
    expect(complete.indexOf('| 0.1.0 |')).toBeLessThan(complete.indexOf('| 0.2.0 |'));
    expect(complete.indexOf('| 0.2.0 |')).toBeLessThan(complete.indexOf('| sin publicar |'));
  });

  it('con menos de 5 ratios da mediana y media y dice n insuficiente', () => {
    expect(sparse).toMatch(/\*\*Factor de calibración\*\* \(ratio mediano real\/estimado, 3 artefactos\): \*\*1\*\* · media 1\.17/);
    expect(sparse).toContain('n insuficiente (hacen falta 5)');
    expect(sparse).not.toMatch(/p80|Tramo del ratio|Error absoluto/);
    expect(sparse).toMatch(/^\| docs \| 3 \| 1 \| — \|$/m);
  });

  it('con menos de 20 ratios la tendencia dice n insuficiente', () => {
    expect(sparse).toContain('Tendencia: n insuficiente (hacen falta 20)');
  });

  it('sin changelog no hay tabla por release', () => {
    expect(sparse).not.toContain('| Release |');
  });
});

describe('fecha de la fila', () => {
  const dated = (heading: string, front: string) => `---\n${front}\n---\n\n${heading}\n\n- Tipo: docs\n- Estimación: 1h\n- Real: 1h\n`;
  const walk = '## 2. Tiempo: estimado vs real';
  const { text } = build(
    project({
      'specs/20260923-214917-task-0053-noche/walkthrough.md': dated(walk, 'task: 0053\ncreated: 2026-09-24'),
      'specs/20260923-230000-patch-0060-noche/patch.md': dated('## 5. Tiempo', 'task: 0060\ncreated: 2026-09-24'),
      'specs/20260923-230500-task-0061-date/walkthrough.md': dated(walk, 'task: 0061\ndate: 2026-09-24'),
      'specs/20260923-231000-task-0062-plantilla/walkthrough.md': dated(walk, 'task: 0062\ncreated: <YYYY-MM-DD>'),
    }),
  );

  it.each([
    ['fecha un walkthrough con su created: y no con la carpeta', '20260923-214917-task-0053-noche', '| 2026-09-24 | 0053 |'],
    ['fecha un patch.md con su created:', '20260923-230000-patch-0060-noche', '| 2026-09-24 | 0060 |'],
    ['acepta date: en el frontmatter', '20260923-230500-task-0061-date', '| 2026-09-24 | 0061 |'],
    ['usa la carpeta si el campo no trae una fecha', '20260923-231000-task-0062-plantilla', '| 2026-09-23 | 0062 |'],
  ])('%s', (_name, folder, prefix) => {
    expect(row(text, folder)?.startsWith(prefix)).toBe(true);
  });
});

describe('tolerancia de formato en el bloque de tiempo', () => {
  const { text, warnings } = buildFixture('tolerante');

  it('lee un patch.md escrito con las etiquetas largas del walkthrough', () => {
    expect(row(text, '20260917-100000-patch-0000-etiqueta-larga')).toBe(
      '| 2026-09-17 | 0000 | patch | 1.5 | 1.2 | 0.8 | — | — | — | — | 20260917-100000-patch-0000-etiqueta-larga |',
    );
    expect(warnings.join(' ')).not.toMatch(/etiqueta-larga/);
  });

  it('tolera el símbolo de aproximación delante de la cifra', () => {
    expect(row(text, '20260918-100000-task-0015-aprox')).toBe(
      '| 2026-09-18 | 0015 | docs | 3 | 2.5 | 0.83 | — | — | — | — | 20260918-100000-task-0015-aprox |',
    );
    expect(warnings.join(' ')).not.toMatch(/aprox/);
  });
});

describe('unidad del tiempo', () => {
  const patch = (estimate: string, real: string) => `## 5. Tiempo (ligero)\n\n- Estimación: ${estimate}\n- Real: ${real}\n`;
  const { text, warnings } = build(
    project({
      'specs/20260924-100000-patch-0065-minutos/patch.md': patch('30 min', '25 min'),
      'specs/20260924-110000-patch-0070-horas/patch.md': patch('1 hora', '2 horas'),
      'specs/20260924-120000-patch-0071-dias/patch.md': patch('2 días', '3 h'),
      'specs/20260924-130000-patch-0072-real-semanas/patch.md': patch('1 h', '1 semana'),
      'specs/20260924-140000-patch-0094-horas-y-minutos/patch.md': patch('1h 30min', '~1 h 20 min'),
      'specs/20260924-150000-patch-0132-una-linea/patch.md': '## 4. Verificación\n\nEstimado: 0,5 h · Real: 0,7 h\n',
    }),
  );
  const all = warnings.join(' ');

  it('convierte los minutos a horas', () => {
    expect(row(text, '20260924-100000-patch-0065-minutos')).toBe('| 2026-09-24 | 0065 | patch | 0.5 | 0.42 | 0.83 | — | — | — | — | 20260924-100000-patch-0065-minutos |');
    expect(all).not.toMatch(/minutos/);
  });

  it('lee hora y horas como h', () => {
    expect(row(text, '20260924-110000-patch-0070-horas')).toBe('| 2026-09-24 | 0070 | patch | 1 | 2 | 2 | — | — | — | — | 20260924-110000-patch-0070-horas |');
    expect(all).not.toMatch(/patch-0070-horas/);
  });

  it('deja vacía y avisa una estimación en otra unidad, sin adivinar', () => {
    expect(row(text, '20260924-120000-patch-0071-dias')).toBe('| 2026-09-24 | 0071 | patch | — | 3 | — | — | — | — | — | 20260924-120000-patch-0071-dias |');
    expect(all).toMatch(/días.*patch-0071-dias/);
  });

  it('avisa y excluye un real en otra unidad', () => {
    expect(row(text, '20260924-130000-patch-0072-real-semanas')).toBeUndefined();
    expect(all).toMatch(/semana.*patch-0072-real-semanas/);
  });

  it('suma los minutos que siguen a las horas', () => {
    expect(row(text, '20260924-140000-patch-0094-horas-y-minutos')).toBe('| 2026-09-24 | 0094 | patch | 1.5 | 1.33 | 0.89 | — | — | — | — | 20260924-140000-patch-0094-horas-y-minutos |');
    expect(all).not.toMatch(/horas-y-minutos/);
  });

  it('avisa y excluye un patch con tiempo fuera del bloque de la plantilla', () => {
    expect(row(text, '20260924-150000-patch-0132-una-linea')).toBeUndefined();
    expect(all).toMatch(/patch-0132-una-linea/);
  });
});

describe('carpetas feature y task heredadas', () => {
  const { text } = buildFixture('features');

  it.each([
    ['lee el id de una task heredada', '20260920-100000-task-0063-a', /^\| 2026-09-20 \| 0063 \|/],
    ['lee el id del campo feature', '20261001-091500-feature-0079-b', /^\| 2026-10-01 \| 0079 \|/],
    ['lee el id de una carpeta feature sin frontmatter', '20261003-100000-feature-0081-c', /^\| 2026-10-03 \| 0081 \|/],
  ])('%s', (_name, folder, expected) => {
    expect(row(text, folder)).toMatch(expected);
  });

  it('titula Id la columna del id', () => {
    expect(text).toMatch(/^\| Fecha \| Id \| Tipo \| Est \(h\) \| Real \(h\) \| Ratio \| Hilo \(tokens\) \| Subagentes \(tokens\) \| Sujetos \(\$\) \| Sesión \(\$\) \| Carpeta \|$/m);
  });
});

describe('walkthrough con evidencia por THEN', () => {
  const template = readFileSync(join(repoRoot, 'skills/sdd-templates/templates/walkthrough-template.md'), 'utf8');
  const filled = template
    .replace(/^- Tipo: <[^\n]*/m, '- Tipo: docs')
    .replace(/^- Estimación de implementación \(del plan\): <Yh>/m, '- Estimación de implementación (del plan): 2h')
    .replace(/^- Esfuerzo real: <Zh>/m, '- Esfuerzo real: 3h')
    .replace(/^feature: <id>/m, 'feature: 0100');
  const closedFolder = readdirSync(join(repoRoot, '.docs/sdd/specs')).find((name) => name.includes('-task-0077-'))!;
  const closed = readFileSync(join(repoRoot, '.docs/sdd/specs', closedFolder, 'walkthrough.md'), 'utf8');
  const { text, warnings } = build(
    project({
      'specs/20260926-100000-feature-0100-nuevo/walkthrough.md': filled,
      [`specs/${closedFolder}/walkthrough.md`]: closed,
    }),
  );

  it('lee la plantilla nueva rellena', () => {
    expect(row(text, '20260926-100000-feature-0100-nuevo')).toMatch(/^\| 2026-09-26 \| 0100 \| docs \| 2 \| 3 \| 1\.5 \|/);
  });

  it('sigue leyendo un walkthrough cerrado con la tabla 4.2 vieja', () => {
    expect(row(text, closedFolder)).toMatch(/^\| 2026-09-25 \| 0077 \| /);
  });

  it('no avisa de nada', () => {
    expect(warnings).toEqual([]);
  });
});

describe('verbo estimation log', () => {
  it('escribe por defecto en <docs>/estimation-log.md y cuenta las filas', async () => {
    const root = completeProject();
    const io = memoryIo();
    const code = await run(['estimation', 'log', '--root', root], io);
    expect(code).toBe(0);
    expect(existsSync(join(root, '.docs/sdd/estimation-log.md'))).toBe(true);
    expect(io.stdout.join('\n')).toMatch(/^Generado .*estimation-log\.md con 23 filas\.$/);
  });

  it('sale con 1 y el mensaje del dominio si no hay specs', async () => {
    const io = memoryIo();
    const code = await run(['estimation', 'log', '--root', join(repoRoot, 'cli/test')], io);
    expect(code).toBe(1);
    expect(io.stderr.join('\n')).toMatch(/No se encuentra/);
  });
});
