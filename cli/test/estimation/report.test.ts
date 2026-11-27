import { describe, it, expect } from 'vitest';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { buildReport } from '../../src/estimation/report.ts';
import { build, project } from './helpers.ts';

interface Closing {
  folder: string;
  type?: string;
  est: string;
  real: string;
  timing?: Record<string, unknown>;
}

const walkthroughOf = (closing: Closing): string =>
  `## 2. Tiempo: estimado vs real\n\n- Tipo: ${closing.type ?? 'feature'}\n- Estimación de implementación (del plan): ${closing.est}\n- Esfuerzo real: ${closing.real}\n`;

function files(closings: Closing[], base = 'changes'): Record<string, string> {
  const entries = closings.flatMap((closing) => [
    [`${base}/${closing.folder}/walkthrough.md`, walkthroughOf(closing)],
    ...(closing.timing ? [[`${base}/${closing.folder}/timing.json`, JSON.stringify(closing.timing)]] : []),
  ]);
  return { 'steering/estimation.md': '# Estimación\n', ...Object.fromEntries(entries) };
}

const folder = (n: number, type = 'feature'): string => `2026110${n}-100000-${type}-00${n}0-x`;

function report(root: string): { text: string; warnings: string[] } {
  const warnings: string[] = [];
  const text = buildReport(root, { release: null }, (message) => warnings.push(message));
  return { text, warnings };
}

function tableOf(text: string, header: string): string[] {
  const lines = text.split('\n');
  const start = lines.findIndex((line) => line.startsWith(header));
  if (start < 0) return [];
  const end = lines.findIndex((line, index) => index > start && line.trim() === '' && lines[index + 1] !== NOTE);
  return lines.slice(start, end < 0 ? undefined : end);
}

const LANE_HEADER = '| Carril | n | Real (h) | Ratio | Real > est |';
const PERSON_HEADER = '| Persona | n | Real (h) | Ratio | Real > est |';
const VERSION_HEADER = '| Versión marcada del kit | n | Real (h) | Ratio | Real > est |';
const PHASE_HEADER = '| Fase | Persona | n | Real (h) | Ratio |';
const NOTE = '* n < 5: mediana orientativa.';

const phase = (name: string, agent: number, exec: number, estimate: number | null): Record<string, unknown> => ({
  name, ceremony: name !== 'implementacion', measured: true, agentSeconds: agent, execSeconds: exec, waitSeconds: 0, idleSeconds: 0, gateSeconds: 0, estimateHours: estimate,
});
const unmeasured = (name: string): Record<string, unknown> => ({
  name, ceremony: true, measured: false, reason: 'sin eventos', agentSeconds: null, execSeconds: null, waitSeconds: null, idleSeconds: null, gateSeconds: null, estimateHours: null,
});
const timing = (phases: Record<string, unknown>[], withinMargin = true): Record<string, unknown> => ({ version: 1, measured: true, withinMargin, phases });

describe('sdd estimation report: tablas', () => {
  it('groups by lane with medians, ratio and over-estimate count', () => {
    const root = project({
      ...files([
        { folder: folder(1), est: '1 h', real: '1 h' },
        { folder: folder(2), est: '2 h', real: '3 h' },
      ]),
      [`changes/${folder(3, 'patch')}/patch.md`]: '## 5. Tiempo\n\n- Estimación: 0,5 h (post hoc)\n- Real: 1 h\n',
    });
    const { text } = report(root);
    const lanes = tableOf(text, LANE_HEADER);
    expect(lanes).toContain('| feature | 2 * | 2 | 1.25 | 1 |');
    expect(lanes).toContain('| patch | 1 * | 1 | — | 0 |');
    expect(lanes).toContain(NOTE);
    expect(tableOf(text, PERSON_HEADER)).toContain('| sin atribuir | 3 * | 1 | 1.25 | 1 |');
    expect(tableOf(text, VERSION_HEADER)).toContain('| sin marcador | 3 * | 1 | 1.25 | 1 |');
  });

  it('five closings drop the asterisk and the note', () => {
    const reals = [['1 h', '1 h'], ['2 h', '3 h'], ['1 h', '1 h'], ['1 h', '1 h'], ['1 h', '1 h']];
    const root = project(files(reals.map(([est, real], index) => ({ folder: folder(index + 1), est: est!, real: real! }))));
    const lanes = tableOf(report(root).text, LANE_HEADER);
    expect(lanes).toContain('| feature | 5 | 1 | 1 | 1 |');
    expect(lanes).not.toContain(NOTE);
  });

  it('phases by person', () => {
    const root = project(files([
      { folder: folder(1), est: '1 h', real: '1 h', timing: timing([phase('implementacion', 1800, 1800, 0.5), unmeasured('revision')]) },
      { folder: folder(2), est: '1 h', real: '1 h', timing: timing([phase('apertura', 600, 0, null), phase('implementacion', 3600, 1800, 1)]) },
      { folder: folder(3), est: '1 h', real: '1 h', timing: timing([phase('implementacion', 60, 60, 1)], false) },
      { folder: folder(4), est: '1 h', real: '1 h' },
    ]));
    const { text, warnings } = report(root);
    const phases = tableOf(text, PHASE_HEADER);
    const opening = phases.indexOf('| apertura | sin atribuir | 1 * | 0.17 | — |');
    const implementation = phases.indexOf('| implementación | sin atribuir | 2 * | 1.25 | 1.75 |');
    expect(opening).toBeGreaterThan(0);
    expect(implementation).toBeGreaterThan(opening);
    expect(phases.some((line) => line.startsWith('| revisión |'))).toBe(false);
    expect(warnings).toContain(`timing.json fuera del margen, fuera de la tabla de fases: ${folder(3)}.`);
    expect(tableOf(text, PERSON_HEADER)).toContain('| sin atribuir | 4 * | 1 | 1 | 0 |');
  });

  it('no closings', () => {
    const text = report(project({ 'steering/estimation.md': '# Estimación\n' })).text;
    expect(text.match(/^Sin cierres\.$/gm)).toHaveLength(3);
    expect(text).toContain('Sin datos: ninguna tarea tiene timing.json.');
  });

  it('reads the same docs folder as the log', () => {
    const root = project({ 'steering/estimation.md': '# Estimación\n' });
    const legacy = project({});
    const closings = files([{ folder: folder(1), est: '1 h', real: '2 h' }], 'specs');
    for (const [path, content] of Object.entries(closings)) {
      const target = join(legacy, 'docs/sdd', path);
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, content);
    }
    expect(build(legacy).text).toContain(`| ${folder(1)} |`);
    expect(tableOf(report(legacy).text, LANE_HEADER)).toContain('| feature | 1 * | 2 | 2 | 1 |');
    expect(report(root).text).toContain('Sin cierres.');
  });
});
