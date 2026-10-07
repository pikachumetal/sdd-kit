import { describe, it, expect } from 'vitest';
import { existsSync, mkdtempSync, readFileSync, writeFileSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DomainError } from '../../src/cli/args.ts';
import { generateEstimationLog, writeEstimationLog } from '../../src/estimation/log.ts';
import { build, buildFixture, fixtures, row } from './helpers.ts';

const empty = '—';
const line = (...cells: string[]) => `| ${cells.join(' | ')} |`;

describe('proyecto fixture', () => {
  const { text, warnings } = buildFixture('proyecto');

  it('lleva cabecera AUTO-GENERADO', () => {
    expect(text).toMatch(/^<!-- AUTO-GENERADO por Build-EstimationLog\.ps1 \(sdd-kit\)/);
  });

  it.each([
    ['lee un walkthrough plano', '20260901-100000-task-0001-plain', line('2026-09-01', '0001', 'docs', '4', '2', '0.5', empty, empty, empty, empty, '20260901-100000-task-0001-plain')],
    ['tolera negrita, virgulilla, coma decimal, rango y Tipo compuesto', '20260902-100000-task-0002-fancy', line('2026-09-02', '0002', 'docs', '2', '0.5', '0.25', empty, empty, empty, empty, '20260902-100000-task-0002-fancy')],
    ['incluye una task sin plan con estimado y ratio vacíos', '20260903-100000-task-0003-sinplan', line('2026-09-03', '0003', 'infra/tooling', empty, '3', empty, empty, empty, empty, empty, '20260903-100000-task-0003-sinplan')],
    ['lee patch.md con tipo patch', '20260904-100000-patch-0000-fix', line('2026-09-04', '0000', 'patch', '0.5', '0.3', '0.6', empty, empty, empty, empty, '20260904-100000-patch-0000-fix')],
    ['lee hotfix.md legacy con tipo hotfix', '20260905-100000-task-0004-legacy', line('2026-09-05', '0004', 'hotfix', '1', '2', '2', empty, empty, empty, empty, '20260905-100000-task-0004-legacy')],
    ['lee hotfix.md sin frontmatter usando la carpeta para el id', '20260909-100000-hotfix-0007-sinfrontmatter', line('2026-09-09', '0007', 'hotfix', '1', '1', '1', empty, empty, empty, empty, '20260909-100000-hotfix-0007-sinfrontmatter')],
    ['lee un patch cuya sección se titula solo Tiempo', '20260910-100000-patch-0000-sinligero', line('2026-09-10', '0000', 'patch', '1', '0.5', '0.5', empty, empty, empty, empty, '20260910-100000-patch-0000-sinligero')],
    ['una carpeta fuera de convención sale con fecha y task vacíos', 'notas-sueltas', line(empty, empty, 'docs', '2', '1', '0.5', empty, empty, empty, empty, 'notas-sueltas')],
    ['no deja que un Real de otra sección secuestre el valor', '20260911-100000-patch-0000-real-en-diagnostico', line('2026-09-11', '0000', 'patch', '1', '1', '1', empty, empty, empty, empty, '20260911-100000-patch-0000-real-en-diagnostico')],
    ['admite la etiqueta de estimación sin «(del plan)»', '20260912-100000-task-0010-sin-etiqueta-plan', line('2026-09-12', '0010', 'docs', '3', '3', '1', empty, empty, empty, empty, '20260912-100000-task-0010-sin-etiqueta-plan')],
    ['usa Tipo — cuando falta la línea Tipo', '20260913-100000-task-0011-sin-tipo', line('2026-09-13', '0011', empty, '2', '1', '0.5', empty, empty, empty, empty, '20260913-100000-task-0011-sin-tipo')],
    ['lee los tres costes declarados por separado', '20260915-100000-task-0013-coste', line('2026-09-15', '0013', 'docs', '2', '1', '0.5', 'no medido', '342k', '1.85', empty, '20260915-100000-task-0013-coste')],
    ['muestra no aplica cuando la task no tuvo subagentes ni sujetos', '20260916-100000-task-0014-solo', line('2026-09-16', '0014', 'docs', '1', '1', '1', '120k', 'no aplica', 'no aplica', empty, '20260916-100000-task-0014-solo')],
    ['lee las etiquetas antiguas del corpus y los tokens en millones', '20260917-100000-task-0015-legacy', line('2026-09-17', '0015', 'docs', '2', '2', '1', empty, '1230k', '10.3', empty, '20260917-100000-task-0015-legacy')],
    ['lee el punto como separador de miles, no como decimal', '20260918-100000-task-0016-miles', line('2026-09-18', '0016', 'docs', '2', '1', '0.5', '148k', '1230k', '1850', empty, '20260918-100000-task-0016-miles')],
    ['no toca un decimal con punto', '20260919-100000-task-0017-decimal', line('2026-09-19', '0017', 'docs', empty, '1', empty, empty, empty, '1.85', empty, '20260919-100000-task-0017-decimal')],
  ])('%s', (_name, folder, expected) => {
    expect(row(text, folder)).toBe(expected);
  });

  it('avisa y excluye un bloque presente con real ilegible', () => {
    expect(row(text, '20260906-100000-task-0005-roto')).toBeUndefined();
    expect(warnings.join(' ')).toMatch(/20260906-100000-task-0005-roto/);
  });

  it('ignora en silencio un walkthrough o un patch sin bloque de tiempo', () => {
    expect(row(text, '20260907-100000-task-0006-sinbloque')).toBeUndefined();
    expect(row(text, '20260908-100000-patch-0000-sinbloque')).toBeUndefined();
    expect(warnings.join(' ')).not.toMatch(/sinbloque/);
  });

  it('no avisa del Real de otra sección', () => {
    expect(warnings.join(' ')).not.toMatch(/real-en-diagnostico/);
  });

  it('sigue probando patch.md si walkthrough.md no tiene bloque de tiempo', () => {
    expect(row(text, '20260914-100000-task-0012-walkthrough-vacio-con-patch')).toBeUndefined();
    expect(warnings.join(' ')).toMatch(/20260914-100000-task-0012-walkthrough-vacio-con-patch/);
  });

  it('escribe LF', () => {
    expect(text).not.toContain('\r');
  });

  it('calcula el factor global como mediana de los ratios', () => {
    expect(text).toMatch(/\*\*Factor de calibración\*\* \(ratio mediano real\/estimado, 14 artefactos\): \*\*0\.55\*\*/);
  });

  it('calcula la mediana por Tipo', () => {
    expect(text).toMatch(/^\| docs \| 8 \| 0\.5 \| [\d.]+–[\d.]+ \|$/m);
    expect(text).toMatch(/^\| patch \| 3 \| 0\.6 \| — \|$/m);
    expect(text).toMatch(/^\| hotfix \| 2 \| 1\.5 \| — \|$/m);
    expect(text).toMatch(/^\| — \| 1 \| 0\.5 \| — \|$/m);
  });

  it('no avisa de calibración orientativa con 10 o más ratios', () => {
    expect(text).not.toContain('Con menos de 10 tareas con ratio la calibración es orientativa');
  });

  it('con menos de 20 ratios la tendencia dice n insuficiente y hay p80', () => {
    expect(text).toContain('Tendencia: n insuficiente (hacen falta 20)');
    expect(text).toMatch(/^- p80: /m);
  });
});

describe('resolución de la carpeta de docs', () => {
  it('usa docs/sdd cuando no existe .docs/sdd', () => {
    const { text } = buildFixture('legacy');
    expect(row(text, '20260801-100000-task-0009-old')).toBe(line('2026-08-01', '0009', 'backend', '3', '6', '2', empty, empty, empty, empty, '20260801-100000-task-0009-old'));
  });

  it('avisa de calibración orientativa con menos de 10 ratios', () => {
    expect(buildFixture('legacy').text).toContain('Con menos de 10 tareas con ratio la calibración es orientativa');
  });

  it('lee la estimación de un walkthrough lite (etiqueta con «de la spec»)', () => {
    expect(row(buildFixture('lite').text, '20260915-100000-task-0013-lite')).toBe(line('2026-09-15', '0013', 'docs', '1', '0.5', '0.5', empty, empty, empty, empty, '20260915-100000-task-0013-lite'));
  });

  it('corta la sección de tiempo en el siguiente encabezado', () => {
    expect(row(buildFixture('seccion').text, '20260916-100000-task-0014-seccion')).toBe(line('2026-09-16', '0014', 'docs', '2', '1', '0.5', empty, empty, empty, empty, '20260916-100000-task-0014-seccion'));
  });

  it('escribe el singular con un solo artefacto con ratio', () => {
    expect(buildFixture('lite').text).toMatch(/1 artefacto\)/);
  });

  it('falla con el mismo mensaje si la raíz no existe', () => {
    expect(() => build(join(tmpdir(), 'sdd-no-existe-xyz'))).toThrow(DomainError);
    expect(() => build(join(tmpdir(), 'sdd-no-existe-xyz'))).toThrow(/No se encuentra/);
  });

  it('falla con mensaje si no hay specs', () => {
    expect(() => build(mkdtempSync(join(tmpdir(), 'sdd-sin-specs-')))).toThrow(/No se encuentra '\.docs\/sdd\/specs' ni 'docs\/sdd\/specs'/);
  });
});

describe('escritura del log', () => {
  function copyProject(): string {
    const root = mkdtempSync(join(tmpdir(), 'sdd-log-'));
    cpSync(join(fixtures, 'proyecto'), root, { recursive: true });
    return root;
  }

  it('escribe UTF-8 sin BOM ni CR', () => {
    const root = copyProject();
    const out = join(root, 'out.md');
    writeEstimationLog(generateEstimationLog(root, () => {}).text, out, () => {});
    const bytes = readFileSync(out);
    expect([bytes[0], bytes[1], bytes[2]]).not.toEqual([0xef, 0xbb, 0xbf]);
    expect(bytes.includes(13)).toBe(false);
  });

  it('avisa antes de sobreescribir un log mantenido a mano, y no la segunda vez', () => {
    const root = copyProject();
    const out = join(root, '.docs/sdd/estimation-log.md');
    writeFileSync(out, '# Log manual\n', 'utf8');
    const text = generateEstimationLog(root, () => {}).text;
    const warnings: string[] = [];
    writeEstimationLog(text, out, (message) => warnings.push(message));
    expect(warnings.join(' ')).toMatch(/mantenido a mano/);
    expect(readFileSync(out, 'utf8').split('\n')[0]).toMatch(/^<!-- AUTO-GENERADO/);
    const again: string[] = [];
    writeEstimationLog(text, out, (message) => again.push(message));
    expect(again).toEqual([]);
    expect(existsSync(out)).toBe(true);
  });
});
