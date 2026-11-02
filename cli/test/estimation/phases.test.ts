import { describe, it, expect } from 'vitest';
import { build, project } from './helpers.ts';

const walkthrough = (folder: string): string =>
  ['---', `id: ${folder}`, '---', '', '# Walkthrough', '', '## 2. Tiempo y coste: estimado vs real', '', '- Tipo: backend', '- Estimación de implementación (del plan): 1h', '- Esfuerzo real: 2 h', ''].join('\n');

const phase = (name: string, seconds: { agent?: number; exec?: number; wait?: number; gate?: number; estimate?: number } = {}): Record<string, unknown> => ({
  name,
  ceremony: name !== 'implementacion',
  measured: true,
  agentSeconds: seconds.agent ?? 0,
  execSeconds: seconds.exec ?? 0,
  waitSeconds: seconds.wait ?? 0,
  idleSeconds: 0,
  gateSeconds: seconds.gate ?? 0,
  estimateHours: seconds.estimate ?? null,
});

const unmeasured = (name: string): Record<string, unknown> => ({ name, ceremony: name !== 'implementacion', measured: false, reason: 'sin eventos: su tiempo queda en apertura', agentSeconds: null, execSeconds: null, waitSeconds: null, idleSeconds: null, gateSeconds: null, estimateHours: null });

const timing = (phases: Record<string, unknown>[], extra: Record<string, unknown> = {}): string => JSON.stringify({ version: 1, measured: true, withinMargin: true, phases, ...extra });

const implementation = phase('implementacion', { agent: 900, exec: 2700, estimate: 1 });
const folderA = '20261001-100000-feature-0001-a';
const folderB = '20261002-100000-feature-0002-b';
const both = {
  [`specs/${folderA}/walkthrough.md`]: walkthrough(folderA),
  [`specs/${folderA}/timing.json`]: timing([phase('apertura', { agent: 600, exec: 300, estimate: 0.5 }), implementation]),
  [`specs/${folderB}/walkthrough.md`]: walkthrough(folderB),
  [`specs/${folderB}/timing.json`]: timing([unmeasured('apertura'), implementation]),
};

const sectionOf = (text: string): string => text.slice(text.indexOf('## Tiempos por fase'));
const rowOf = (text: string, name: string): string[] => sectionOf(text).split('\n').find((line) => line.startsWith(`| ${name} |`))!.split('|').map((cell) => cell.trim()).slice(1, -1);

describe('el log suma los tiempos por fase', () => {
  it('lleva la sección al final, con su cabecera', () => {
    const { text } = build(project(both));
    expect(sectionOf(text)).toContain('| Fase | n | Agente (h) | Ejecución (h) | Espera (h) | Gate (h) | % del trabajo | Ceremonia | Est (h) | Real (h) | Ratio |');
    expect(text.indexOf('## Tiempos por fase')).toBeGreaterThan(text.indexOf('| Fecha |'));
  });

  it('suma una fase medida frente a su estimado', () => {
    expect(rowOf(build(project(both)).text, 'apertura')).toEqual(['apertura', '1', '0.17', '0.08', '0', '0', '11 %', 'sí', '0.5', '0.25', '0.5']);
  });

  it('nombra las fases con tilde y suma las dos tareas', () => {
    expect(rowOf(build(project(both)).text, 'implementación')).toEqual(['implementación', '2', '0.5', '1.5', '0', '0', '89 %', 'no', '2', '2', '1']);
  });

  it('una tarea con una fase de ceremonia sin medir sale de la línea de ceremonia', () => {
    expect(sectionOf(build(project(both)).text)).toContain('Ceremonia: 20 % del trabajo (1 tareas, 1 fuera por una fase sin eventos).');
  });

  it('sin tareas fuera, la línea no las nombra', () => {
    const files = { [`specs/${folderA}/walkthrough.md`]: walkthrough(folderA), [`specs/${folderA}/timing.json`]: timing([phase('apertura', { agent: 600 }), phase('implementacion', { agent: 1800 })]) };
    expect(sectionOf(build(project(files)).text)).toContain('Ceremonia: 25 % del trabajo (1 tareas).');
  });

  it('el ratio solo cuenta las filas con estimado', () => {
    const files = { ...both, [`specs/${folderA}/timing.json`]: timing([phase('apertura', { agent: 1800, estimate: 1 }), implementation]), [`specs/${folderB}/timing.json`]: timing([phase('apertura', { agent: 3600 }), implementation]) };
    expect(rowOf(build(project(files)).text, 'apertura').slice(8)).toEqual(['1', '1.5', '0.5']);
  });

  it('sin estimado, el ratio es una raya', () => {
    const files = { [`specs/${folderA}/walkthrough.md`]: walkthrough(folderA), [`specs/${folderA}/timing.json`]: timing([phase('apertura', { agent: 600 })]) };
    expect(rowOf(build(project(files)).text, 'apertura').slice(8)).toEqual(['—', '0.17', '—']);
  });

  it('la tabla principal no cambia con timing.json', () => {
    const withoutTiming = { [`specs/${folderA}/walkthrough.md`]: walkthrough(folderA), [`specs/${folderB}/walkthrough.md`]: walkthrough(folderB) };
    const main = (text: string): string => text.slice(0, text.indexOf('## Tiempos por fase'));
    expect(main(build(project(both)).text)).toBe(main(build(project(withoutTiming)).text));
  });

  it('withinMargin false no entra y avisa', () => {
    const files = { [`specs/${folderA}/walkthrough.md`]: walkthrough(folderA), [`specs/${folderA}/timing.json`]: timing([phase('apertura', { agent: 600 })], { withinMargin: false }) };
    const { text, warnings } = build(project(files));
    expect(sectionOf(text)).toContain('Sin datos: ninguna tarea tiene timing.json.');
    expect(warnings.join('\n')).toContain(folderA);
  });

  it('un timing.json ilegible avisa y no entra', () => {
    const files = { [`specs/${folderA}/walkthrough.md`]: walkthrough(folderA), [`specs/${folderA}/timing.json`]: '{ roto' };
    const { text, warnings } = build(project(files));
    expect(sectionOf(text)).toContain('Sin datos: ninguna tarea tiene timing.json.');
    expect(warnings.join('\n')).toContain(folderA);
  });

  it('measured false no entra y no avisa', () => {
    const files = { [`specs/${folderA}/walkthrough.md`]: walkthrough(folderA), [`specs/${folderA}/timing.json`]: JSON.stringify({ version: 1, measured: false, reason: 'sin transcripts' }) };
    const { text, warnings } = build(project(files));
    expect(sectionOf(text)).toContain('Sin datos: ninguna tarea tiene timing.json.');
    expect(warnings).toEqual([]);
  });

  it('sin ningún timing.json dice que no hay datos', () => {
    expect(sectionOf(build(project({ [`specs/${folderA}/walkthrough.md`]: walkthrough(folderA) })).text)).toContain('Sin datos: ninguna tarea tiene timing.json.');
  });
});
