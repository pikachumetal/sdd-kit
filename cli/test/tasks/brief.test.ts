import { describe, it, expect } from 'vitest';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { isLiteSpec, writeBrief } from '../../src/tasks/brief.ts';

const liteSpec = ['---', 'id: 20261026-000000-feature-0009-aviso', 'mode: lite            # full | lite', 'status: approved', '---', '', '# Spec — Aviso', '', '## Approach', '', 'Aviso por correo.', ''].join('\n');

function specFile(text: string): { spec: string; out: string } {
  const dir = mkdtempSync(join(tmpdir(), 'sdd-brief-'));
  const spec = join(dir, 'spec.md');
  writeFileSync(spec, text);
  return { spec, out: join(dir, 'task-1-brief.md') };
}

describe('sdd task start con spec lite', () => {
  it('recognizes mode lite in the frontmatter', () => {
    expect(isLiteSpec(liteSpec)).toBe(true);
    expect(isLiteSpec(liteSpec.replace('mode: lite', 'mode: full'))).toBe(false);
    expect(isLiteSpec(liteSpec.replace('mode: lite', 'mode: spike'))).toBe(false);
    expect(isLiteSpec('# Plan\n\nmode: lite\n')).toBe(false);
    expect(isLiteSpec(liteSpec.replace('mode: lite', 'mode: lite-x'))).toBe(false);
  });

  it('writes the whole lite spec as the brief', async () => {
    const { spec, out } = specFile(liteSpec);
    await writeBrief({ plan: spec, task: '1', out });
    expect(readFileSync(out, 'utf8')).toBe(liteSpec);
  });

  it('keeps the not-found error without mode lite', async () => {
    const { spec, out } = specFile(liteSpec.replace('mode: lite', 'mode: full'));
    await expect(writeBrief({ plan: spec, task: '1', out })).rejects.toThrow(/task 1 not found in .* \(no heading matching 'Task 1'\)/);
  });
});

describe('sdd task start exige tasks.md con más de una task', () => {
  const oneTask = '# Plan\n\n### Task 1 — Primera\n\nUna.\n';
  const twoTasks = oneTask + '\n### Task 2 — Segunda\n\nOtra.\n';
  const fencedSecond = oneTask + '\n```\n### Task 2 — Ejemplo\n```\n';

  it('refuses a plan with two tasks and no tasks.md, without writing the brief', async () => {
    const { spec, out } = specFile(twoTasks);
    await expect(writeBrief({ plan: spec, task: '1', out })).rejects.toThrow(/plan with 2 tasks and no tasks\.md: write .*tasks\.md before the first task/);
    expect(existsSync(out)).toBe(false);
  });

  it('writes the brief once tasks.md exists next to the plan', async () => {
    const { spec, out } = specFile(twoTasks);
    writeFileSync(join(dirname(spec), 'tasks.md'), '# Tasks\n');
    await writeBrief({ plan: spec, task: '1', out });
    expect(readFileSync(out, 'utf8')).toContain('Task 1');
  });

  it('needs no tasks.md with a single task', async () => {
    const { spec, out } = specFile(oneTask);
    await writeBrief({ plan: spec, task: '1', out });
    expect(existsSync(out)).toBe(true);
  });

  it('does not count a task heading inside a fence', async () => {
    const { spec, out } = specFile(fencedSecond);
    await writeBrief({ plan: spec, task: '1', out });
    expect(existsSync(out)).toBe(true);
  });

  it('needs no tasks.md with a lite spec', async () => {
    const { spec, out } = specFile(liteSpec + '\n### Task 1\n\n### Task 2\n');
    await writeBrief({ plan: spec, task: '1', out });
    expect(existsSync(out)).toBe(true);
  });
});

function planWithTasksFile(text: string): { spec: string; outFor: (id: string) => string } {
  const { spec } = specFile(text);
  writeFileSync(join(dirname(spec), 'tasks.md'), '# Tasks\n');
  return { spec, outFor: (id) => join(dirname(spec), `task-${id}-brief.md`) };
}

async function briefOf(spec: string, outFor: (id: string) => string, task: string): Promise<string> {
  await writeBrief({ plan: spec, task, out: outFor(task) });
  return readFileSync(outFor(task), 'utf8');
}

describe('El id de una task admite letras y puntos', () => {
  const ids = ['# Plan', '', '## Task 6', 'seis', '## Task 6b', 'seis b', '## Task A1', 'a uno', '## Task Overview', 'resumen', '## Task 2', 'dos', '## Task 2.1', 'dos punto uno', ''].join('\n');
  const nested = ['# Plan', '', '### Task 7', 'siete', '#### Task 7a', 'siete a', '### Task 8', 'ocho', '### Task 1', 'uno', '#### Task 12', 'doce', ''].join('\n');

  it('briefs only the requested id', async () => {
    const { spec, outFor } = planWithTasksFile(ids);
    const sixB = await briefOf(spec, outFor, '6b');
    expect(sixB.startsWith('## Task 6b')).toBe(true);
    expect(sixB.match(/^## Task/gm)).toHaveLength(1);
    expect(await briefOf(spec, outFor, '6')).not.toContain('## Task 6b');
    expect(await briefOf(spec, outFor, '2')).not.toContain('## Task 2.1');
    expect(await briefOf(spec, outFor, 'A1')).toContain('## Task Overview');
  });

  it('keeps a deeper sub-task that extends the id', async () => {
    const { spec, outFor } = planWithTasksFile(nested);
    expect(await briefOf(spec, outFor, '7')).toContain('#### Task 7a');
    expect(await briefOf(spec, outFor, '1')).not.toContain('#### Task 12');
  });

  it('compares ids case-sensitively', async () => {
    const { spec, outFor } = planWithTasksFile(ids);
    await expect(writeBrief({ plan: spec, task: 'a1', out: outFor('a1') })).rejects.toThrow(/task a1 not found/);
  });
});

describe('Un bloque de código sin cerrar no alarga el brief', () => {
  const fence = '```';
  const unclosed = ['# Plan', '', '## Task 1: Primera', '', 'Texto.', '', `${fence}bash`, 'echo hola', '', '## Task 2: Segunda', '', 'Otra.', ''].join('\n');
  const stray = ['# Plan', '', '## Task 1: Primera', '', fence, 'code', fence, '', '## Task 2: Segunda', '', 'Otra.', fence, ''].join('\n');
  const hides = (plan: string) => `el bloque de código abierto en la línea 7 de ${plan} no se cierra y oculta los encabezados de task que le siguen: ciérralo en el plan y vuelve a lanzarlo`;

  it('refuses a brief an unclosed fence would run on', async () => {
    const { spec, outFor } = planWithTasksFile(unclosed);
    await expect(writeBrief({ plan: spec, task: '1', out: outFor('1') })).rejects.toThrow(hides(spec));
    expect(existsSync(outFor('1'))).toBe(false);
    const second = writeBrief({ plan: spec, task: '2', out: outFor('2') });
    await expect(second).rejects.toThrow(`${hides(spec)}\ntask 2 not found in ${spec} (no heading matching 'Task 2')`);
  });

  it('cites the same fence line in a CRLF plan', async () => {
    const { spec, outFor } = planWithTasksFile(unclosed.replace(/\n/g, '\r\n'));
    await expect(writeBrief({ plan: spec, task: '1', out: outFor('1') })).rejects.toThrow(hides(spec));
  });

  it('warns on a stray fence that hides no task', async () => {
    const { spec, outFor } = planWithTasksFile(stray);
    const warning = `el bloque de código abierto en la línea 12 de ${spec} no se cierra; no oculta ningún encabezado de task, así que el brief está completo`;
    expect((await writeBrief({ plan: spec, task: '2', out: outFor('2') })).warnings).toEqual([warning]);
    expect((await writeBrief({ plan: spec, task: '1', out: outFor('1') })).warnings).toEqual([]);
  });
});

describe('Un plan sin encabezados Task dice por qué no encuentra la task', () => {
  const hint = 'no hay encabezados de task: se escriben con la palabra inglesa «Task» («### Task 1: …») aunque el plan esté en otro idioma. Encabezados con forma de task:';

  it('lists task-shaped headings of a translated plan', async () => {
    const { spec, out } = specFile('# Plan\n\n## Tarea 1: Login\n\nA.\n\n## Tarea 2: Logout\n\nB.\n');
    const expected = [hint, '  ## Tarea 1: Login', '  ## Tarea 2: Logout', `task 1 not found in ${spec} (no heading matching 'Task 1')`].join('\n');
    await expect(writeBrief({ plan: spec, task: '1', out })).rejects.toMatchObject({ message: expected });
    const six = specFile(['# Plan', ...[1, 2, 3, 4, 5, 6].map((n) => `## Tarea ${n}: Paso`), ''].join('\n\n'));
    const error = await writeBrief({ plan: six.spec, task: '1', out: six.out }).catch((caught: Error) => caught);
    expect(String((error as Error).message).match(/^ {2}## Tarea/gm)).toHaveLength(5);
  });

  it('opens a lite spec whole without the hint', async () => {
    const text = `${liteSpec}\n## Fase 1\n\nHacer.\n`;
    const { spec, out } = specFile(text);
    await writeBrief({ plan: spec, task: '1', out });
    expect(readFileSync(out, 'utf8')).toBe(text);
  });
});
