import { describe, it, expect } from 'vitest';
import { dirname } from 'node:path';
import { readRepoFile, runSdd, sddFolder } from '../capability/helpers.ts';
import { debtHeaders } from './project.ts';

const ANNOUNCE = 'El anuncio sale 4 de 6';
const announceRow = `| ${ANNOUNCE} | regla lejos de su paso | [a](a.md), [b](b.md) | medio | \`cmd\` | ninguno | mover regla | sin fila |`;
const promptRow = '| El prompt sale sin su forma | regla lejos de su paso | [c](c.md) | bajo | `cmd` | — | mover regla | sin fila |';
const floorRow = '| `--planta 2` lista otra planta | defecto del producto | [d](d.md) | alto | `cmd` | — | — | 0030 |';
const waitingRow = '| El aviso sale doble | regla lejos de su paso | [e](e.md) | bajo | 2.º caso | 2026-10-01 |';
const openHeader = ['## Abiertas en «Lista»', '', '| Ítem | Causa | Casos | Destino | Abierta desde |', '| --- | --- | --- | --- | --- |'];

interface OtherRows {
  waiting?: string[];
  untriaged?: string[];
}

function debt(list: string[], { waiting = [], untriaged = [] }: OtherRows = {}): string {
  return [
    '# Deuda técnica — salas', '',
    '## Por triar', '', ...debtHeaders['Por triar'], ...untriaged, '',
    '## En espera', '', ...debtHeaders['En espera'], ...waiting, '',
    '## Lista', '', ...debtHeaders.Lista, ...list, '',
  ].join('\n');
}

function retro(rows: [string, string][]): string {
  const lines = rows.map(([item, since]) => `| ${item} | regla lejos de su paso | 1 | sin fila | ${since} |`);
  return ['# Retro', '', ...openHeader, ...lines, ''].join('\n');
}

const retroTemplate = readRepoFile('skills/sdd-templates/templates/retro-template.md');
const fullDebt = debt([announceRow, promptRow, floorRow], { waiting: [waitingRow] });
const previousRetro = retro([[ANNOUNCE, '1.2.0'], ['La fila cerrada', '1.3.0']]);

function causes(files: Record<string, string>, ...extra: string[]) {
  return runSdd(['roadmap', 'causes', '--path', sddFolder(files), '--version', '1.4.0', ...extra]);
}

const withDebt = (content: string, retros: Record<string, string> = {}) => ({ 'steering/debt.md': content, ...retros });

describe('sdd roadmap causes', () => {
  it('orders causes by listed then name', async () => {
    const tied = debt([floorRow, promptRow]);
    const { lines, code } = await causes(withDebt(tied));
    expect(code).toBe(0);
    expect(lines.slice(0, 6)).toEqual([
      '## Repaso por causa', '', '| Causa | En espera | Lista |', '| --- | --- | --- |',
      '| defecto del producto | 0 | 1 |', '| regla lejos de su paso | 0 | 1 |',
    ]);
    const { lines: full } = await causes(withDebt(fullDebt));
    expect(full.indexOf('| regla lejos de su paso | 1 | 2 |')).toBeLessThan(full.indexOf('| defecto del producto | 0 | 1 |'));
    expect(full).toContain('| regla lejos de su paso | 1 | 2 |');
  });

  it('orders open rows by version then debt order and inherits open since from the previous retro', async () => {
    const { lines } = await causes(withDebt(fullDebt, { 'releases/v1.3.0/retro.md': previousRetro }));
    const start = lines.indexOf('## Abiertas en «Lista»');
    expect(lines.slice(start + 2, start + 7)).toEqual([
      '| Ítem | Causa | Casos | Destino | Abierta desde |', '| --- | --- | --- | --- | --- |',
      `| ${ANNOUNCE} | regla lejos de su paso | 2 | sin fila | 1.2.0 |`,
      '| El prompt sale sin su forma | regla lejos de su paso | 1 | sin fila | 1.4.0 |',
      '| `--planta 2` lista otra planta | defecto del producto | 1 | 0030 | 1.4.0 |',
    ]);
  });

  it('counts closed since the previous retro in the last line', async () => {
    const { lines } = await causes(withDebt(fullDebt, { 'releases/v1.3.0/retro.md': previousRetro }));
    expect(lines.at(-1)).toBe('Cerradas desde la 1.3.0: 1');
  });

  it('keeps an item with escaped pipe and link', async () => {
    const item = 'a \\| b [x](y)';
    const row = `| ${item} | regla lejos de su paso | [c](c.md) | bajo | \`cmd\` | — | mover regla | sin fila |`;
    const { lines } = await causes(withDebt(debt([row]), { 'releases/v1.3.0/retro.md': retro([[item, '1.1.0']]) }));
    expect(lines).toContain(`| ${item} | regla lejos de su paso | 1 | sin fila | 1.1.0 |`);
    expect(lines.at(-1)).toBe('Cerradas desde la 1.3.0: 0');
  });

  it('compares versions numerically', async () => {
    const files = withDebt(fullDebt, {
      'releases/v1.9.0/retro.md': retro([[ANNOUNCE, '1.9.0']]),
      'releases/v1.10.0/retro.md': retro([[ANNOUNCE, '1.10.0']]),
    });
    const { lines } = await runSdd(['roadmap', 'causes', '--path', sddFolder(files), '--version', '1.11.0']);
    expect(lines.at(-1)).toMatch(/^Cerradas desde la 1\.10\.0: /);
    expect(lines).toContain(`| ${ANNOUNCE} | regla lejos de su paso | 2 | sin fila | 1.10.0 |`);
  });

  it('skips a retro without the section', async () => {
    const files = withDebt(fullDebt, {
      'releases/v1.1.0/retro.md': retro([[ANNOUNCE, '1.1.0']]),
      'releases/v1.3.0/retro.md': '# Retro\n\nSolo estimación.\n',
    });
    const { lines } = await causes(files);
    expect(lines.at(-1)).toMatch(/^Cerradas desde la 1\.1\.0: /);
  });

  it('ignores non-version folders', async () => {
    const { lines } = await causes(withDebt(fullDebt, { 'releases/draft/retro.md': previousRetro }));
    expect(lines.at(-1)).not.toMatch(/^Cerradas/);
  });

  it('skips the retro of the given version', async () => {
    const files = withDebt(fullDebt, {
      'releases/v1.4.0/retro.md': retro([[ANNOUNCE, '1.4.0']]),
      'releases/v1.1.0/retro.md': retro([[ANNOUNCE, '1.1.0']]),
    });
    const { lines } = await causes(files);
    expect(lines.at(-1)).toMatch(/^Cerradas desde la 1\.1\.0: /);
  });

  it('reads an empty previous table', async () => {
    const { lines } = await causes(withDebt(fullDebt, { 'releases/v1.3.0/retro.md': retro([]) }));
    expect(lines.at(-1)).toBe('Cerradas desde la 1.3.0: 0');
    expect(lines).toContain(`| ${ANNOUNCE} | regla lejos de su paso | 2 | sin fila | 1.4.0 |`);
  });

  it('ignores untriaged rows', async () => {
    const { lines } = await causes(withDebt(debt([floorRow], { untriaged: ['| Sin triar | [t](t.md) | 2026-10-12 |'] })));
    expect(lines.join('\n')).not.toContain('Sin triar');
    expect(lines.join('\n')).not.toContain('[t](t.md)');
  });

  it('ignores settled rows', async () => {
    const settled = '| **[Feature 0009, 2026-07-20: saldada — [w](w.md)]** Vieja | herramienta del kit | [c](c.md) | bajo | `cmd` | — | mover regla | 0009 |';
    const { lines } = await causes(withDebt(debt([settled, floorRow])));
    expect(lines.join('\n')).not.toContain('herramienta del kit');
    expect(lines.join('\n')).not.toContain('Vieja');
  });

  it('omits the closed line without a previous retro', async () => {
    const { lines } = await causes(withDebt(fullDebt));
    expect(lines.join('\n')).not.toContain('Cerradas desde');
    expect(lines).toContain(`| ${ANNOUNCE} | regla lejos de su paso | 2 | sin fila | 1.4.0 |`);
  });

  it('gives the report in json', async () => {
    const { lines } = await causes(withDebt(fullDebt, { 'releases/v1.3.0/retro.md': previousRetro }), '--json');
    const report = JSON.parse(lines.join('\n'));
    expect(report.closedSinceLast).toBe(1);
    expect(report.causes[0]).toEqual({ cause: 'regla lejos de su paso', waiting: 1, listed: 2 });
    expect(report.open[0]).toEqual({ item: ANNOUNCE, cause: 'regla lejos de su paso', cases: 2, destination: 'sin fila', openSince: '1.2.0' });
  });

  it('gives null closed in json', async () => {
    const { lines } = await causes(withDebt(fullDebt), '--json');
    expect(JSON.parse(lines.join('\n')).closedSinceLast).toBeNull();
  });

  it('says no triaged debt', async () => {
    const { lines, code } = await causes(withDebt(debt([], { untriaged: ['| Sin triar | [t](t.md) | 2026-10-12 |'] })));
    expect(lines).toEqual(['Sin deuda triada']);
    expect(code).toBe(0);
  });

  it('exits 2 without debt.md', async () => {
    const { stderr, code } = await causes({ 'x.md': '' });
    expect(stderr).toEqual(['roadmap causes: no existe steering/debt.md']);
    expect(code).toBe(2);
  });

  it.each([[['--version', '1.x']], [[]]])('exits 2 on a malformed or missing version', async (version) => {
    const { stderr, code } = await runSdd(['roadmap', 'causes', '--path', sddFolder(withDebt(fullDebt)), ...version]);
    expect(stderr[0]).toContain('--version debe ser X.Y.Z');
    expect(code).toBe(2);
  });

  it('accepts project-root', async () => {
    const docs = sddFolder(withDebt(fullDebt));
    const root = dirname(dirname(docs));
    const { lines, code } = await runSdd(['roadmap', 'causes', '--project-root', root, '--version', '1.4.0']);
    expect(code).toBe(0);
    expect(lines[0]).toBe('## Repaso por causa');
  });

  it('skips a retro whose table has another form', async () => {
    const swapped = ['# Retro', '', '## Abiertas en «Lista»', '', '| Ítem | Abierta desde | Causa |', '| --- | --- | --- |', `| ${ANNOUNCE} | 1.1.0 | sin fila |`, ''].join('\n');
    const { lines } = await causes(withDebt(fullDebt, { 'releases/v1.3.0/retro.md': swapped }));
    expect(lines.join('\n')).not.toContain('Cerradas desde');
    expect(lines).toContain(`| ${ANNOUNCE} | regla lejos de su paso | 2 | sin fila | 1.4.0 |`);
  });

  it('does not inherit an open since that is not a version', async () => {
    const { lines } = await causes(withDebt(fullDebt, { 'releases/v1.3.0/retro.md': retro([[ANNOUNCE, 'sin fila']]) }));
    expect(lines).toContain(`| ${ANNOUNCE} | regla lejos de su paso | 2 | sin fila | 1.4.0 |`);
  });

  it('lists the verb in the help', async () => {
    const { lines } = await runSdd(['--help']);
    expect(lines.join('\n')).toContain('sdd roadmap causes');
  });

  it('reads a retro traced from the template and filled with its output', async () => {
    const { lines: output } = await runSdd(['roadmap', 'causes', '--path', sddFolder(withDebt(debt([floorRow]))), '--version', '1.3.0']);
    const filled = retroTemplate.replace('<salida de `sdd roadmap causes`, sin tocar>', output.join('\n'));
    const { lines } = await causes(withDebt(debt([floorRow]), { 'releases/v1.3.0/retro.md': filled }));
    expect(lines).toContain('| `--planta 2` lista otra planta | defecto del producto | 1 | 0030 | 1.3.0 |');
    expect(lines.at(-1)).toBe('Cerradas desde la 1.3.0: 0');
  });

  it('skips a retro traced from the template and left untouched', async () => {
    const { lines } = await causes(withDebt(debt([floorRow]), { 'releases/v1.3.0/retro.md': retroTemplate }));
    expect(lines.join('\n')).not.toContain('Cerradas desde');
  });

  it('rejects path with project-root', async () => {
    const docs = sddFolder(withDebt(fullDebt));
    const { stderr, code } = await runSdd(['roadmap', 'causes', '--path', docs, '--project-root', dirname(dirname(docs)), '--version', '1.4.0']);
    expect(stderr[0]).toContain('--path y --project-root no van juntas');
    expect(code).toBe(2);
  });
});
