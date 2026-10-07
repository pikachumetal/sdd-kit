import { describe, it, expect } from 'vitest';
import { join } from 'node:path';
import { writeFileSync } from 'node:fs';
import {
  defaultConfig, description, hook, newTranscript, newWorktree, pesterCall, readCall, tempDir, toolResult, toolUse, touch, watchOnce,
} from './helpers.ts';

describe('watch subagent --once', () => {
  it('avisa con un Read sin tool_result a los 8 min 30 s', async () => {
    const setup = newWorktree(defaultConfig);
    newTranscript(setup, [readCall()], 8.5);
    const [first] = await watchOnce(setup);
    expect(first).toMatch(/^SILENCIO:/);
    expect(first).toContain('umbral 8 min');
  });

  it('no avisa con un PowerShell sin tool_result a los 15 min', async () => {
    const setup = newWorktree(defaultConfig);
    newTranscript(setup, [pesterCall()], 15);
    expect((await watchOnce(setup))[0]).toMatch(/^EN MARCHA:/);
  });

  it('avisa con un PowerShell sin tool_result a los 20 min 30 s', async () => {
    const setup = newWorktree(defaultConfig);
    newTranscript(setup, [pesterCall()], 20.5);
    const [first] = await watchOnce(setup);
    expect(first).toMatch(/^SILENCIO:/);
    expect(first).toContain('umbral 20 min');
  });

  it('aplica betweenStepsMinutes 5 de sdd-kit.json', async () => {
    const setup = newWorktree({ control: { silence: { betweenStepsMinutes: 5, longCommandMinutes: 20 } } });
    newTranscript(setup, [readCall()], 5.5);
    const [first] = await watchOnce(setup);
    expect(first).toMatch(/^SILENCIO:/);
    expect(first).toContain('umbral 5 min');
  });

  it('aplica 8 y 20 sin el bloque control.silence', async () => {
    const setup = newWorktree({ version: '2.0.0' });
    newTranscript(setup, [readCall()], 8.5);
    expect((await watchOnce(setup))[0]).toContain('umbral 8 min');
  });

  it('da el diagnóstico del último evento', async () => {
    const setup = newWorktree(defaultConfig);
    const earlier = toolUse('Read', { file_path: 'C:\\repo\\plan.md' }, 'toolu_first', '2026-09-28T13:25:50.000Z');
    (earlier.message as { usage: { output_tokens: number } }).usage.output_tokens = 1200;
    const start = { type: 'user', timestamp: '2026-09-28T13:25:35.518Z', message: { content: 'encargo' } };
    newTranscript(setup, [start, earlier, hook('PreToolUse', 'toolu_first'), toolResult('toolu_first'), readCall()], 9);
    const text = (await watchOnce(setup)).join('\n');
    for (const expected of ['13:26:12Z', 'Read', 'review-final-0f264440.diff', 'offset 500', 'limit 420', 'sin PreToolUse', 'sin petición de permiso', '1200 tokens de salida']) {
      expect(text).toContain(expected);
    }
  });

  it('da las cuatro líneas del diagnóstico en su orden', async () => {
    const setup = newWorktree(defaultConfig);
    newTranscript(setup, [readCall()], 9);
    expect(await watchOnce(setup)).toEqual([
      'SILENCIO: Revisor final 0095 lleva 9 min sin escribir (umbral 8 min, betweenStepsMinutes)',
      'Último evento: 13:26:12Z · Read file_path review-final-0f264440.diff, offset 500, limit 420 · sin tool_result',
      'PreToolUse: sin PreToolUse',
      'Petición de permiso: sin petición de permiso',
      '0 tokens de salida',
    ]);
  });

  it('señala un PermissionRequest pendiente', async () => {
    const setup = newWorktree(defaultConfig);
    newTranscript(setup, [readCall(), hook('PermissionRequest', 'toolu_last')], 9);
    expect((await watchOnce(setup)).join('\n')).toContain('petición de permiso pendiente');
  });

  it('termina sin aviso cuando el subagente acabó', async () => {
    const setup = newWorktree(defaultConfig);
    const final = {
      type: 'assistant',
      timestamp: '2026-09-28T13:30:00.000Z',
      message: { id: 'msg_end', stop_reason: 'end_turn', usage: { output_tokens: 300 }, content: [{ type: 'text', text: 'listo' }] },
    };
    newTranscript(setup, [readCall(), toolResult('toolu_last'), final, hook('SubagentStop', '')], 13);
    expect(await watchOnce(setup)).toEqual([`TERMINADO: ${description} devolvió su resultado`]);
  });

  it('con --once toma el despacho más reciente de los que repiten description', async () => {
    const setup = newWorktree(defaultConfig);
    newTranscript(setup, [readCall()], 30);
    touch(join(setup.folder, 'agent-t1.meta.json'), 30);
    newTranscript(setup, [readCall()], 0, 'agent-t2');
    expect((await watchOnce(setup))[0]).toMatch(/^EN MARCHA:/);
  });

  it('con --once encuentra un despacho de hace 5 min que sigue en marcha', async () => {
    const setup = newWorktree(defaultConfig);
    newTranscript(setup, [readCall()], 1);
    touch(join(setup.folder, 'agent-t1.meta.json'), 5);
    expect((await watchOnce(setup))[0]).toMatch(/^EN MARCHA:/);
  });

  it('aplica longCommandMinutes si hay un PowerShell pendiente en paralelo con un Read ya respondido', async () => {
    const setup = newWorktree(defaultConfig);
    const shell = toolUse('PowerShell', { command: 'Invoke-Pester tests/' }, 'toolu_shell');
    const read = toolUse('Read', { file_path: 'C:\\repo\\plan.md' }, 'toolu_read');
    newTranscript(setup, [shell, read, toolResult('toolu_read')], 9);
    expect((await watchOnce(setup))[0]).toMatch(/^EN MARCHA:.*umbral 20 min/);
  });

  it.each([
    ['null', { betweenStepsMinutes: null, longCommandMinutes: 20 }],
    ['cero', { betweenStepsMinutes: 0, longCommandMinutes: 20 }],
    ['negativo', { betweenStepsMinutes: -3, longCommandMinutes: 20 }],
    ['de texto', { betweenStepsMinutes: 'abc', longCommandMinutes: 20 }],
    ['booleano', { betweenStepsMinutes: true, longCommandMinutes: 20 }],
  ])('aplica el default con un umbral %s en sdd-kit.json', async (_name, silence) => {
    const setup = newWorktree({ control: { silence } });
    newTranscript(setup, [readCall()], 5);
    expect((await watchOnce(setup))[0]).toMatch(/^EN MARCHA:.*umbral 8 min/);
  });

  it('aplica los defaults con un sdd-kit.json que no es JSON', async () => {
    const setup = newWorktree(null);
    writeFileSync(join(setup.repo, '.docs/sdd/sdd-kit.json'), '{ control: ');
    newTranscript(setup, [readCall()], 8.5);
    expect((await watchOnce(setup))[0]).toMatch(/^SILENCIO:.*umbral 8 min/);
  });

  it('avisa aunque el último evento no tenga timestamp', async () => {
    const setup = newWorktree(defaultConfig);
    newTranscript(setup, [toolUse('Read', { file_path: 'C:\\repo\\plan.md' }, 'toolu_last', null)], 9);
    const lines = await watchOnce(setup);
    expect(lines[0]).toMatch(/^SILENCIO:/);
    expect(lines.join('\n')).toContain('hora desconocida');
  });

  it('ignora un meta.json corrupto de otro despacho', async () => {
    const setup = newWorktree(defaultConfig);
    newTranscript(setup, [readCall()], 8.5);
    writeFileSync(join(setup.folder, 'agent-t2.meta.json'), '{ "descr');
    expect((await watchOnce(setup))[0]).toMatch(/^SILENCIO:/);
  });

  it('dice SIN TRANSCRIPT si no encuentra el despacho', async () => {
    const setup = newWorktree(defaultConfig);
    expect(await watchOnce(setup, ['--description', 'no existe'])).toEqual([
      'SIN TRANSCRIPT: no existe; el vigía de silencio no funciona en esta sesión',
    ]);
  });
});

describe('watch command --once', () => {
  it('vigila la salida de un comando con longCommandMinutes', async () => {
    const setup = newWorktree(defaultConfig);
    const log = join(tempDir(), 'pester.log');
    writeFileSync(log, 'Running tests');
    touch(log, 21);
    const [first] = await watchOnce(setup, ['--path', log]);
    expect(first).toMatch(/^SILENCIO: pester\.log lleva 21 min sin escribir/);
    expect(first).toContain('umbral 20 min');
  });

  it('dice SIN TRANSCRIPT si el fichero no existe', async () => {
    const setup = newWorktree(defaultConfig);
    const missing = join(tempDir(), 'nada.log');
    expect(await watchOnce(setup, ['--path', missing])).toEqual(['SIN TRANSCRIPT: nada.log; el vigía de silencio no funciona en esta sesión']);
  });
});

describe('watch subagent diagnóstico de valores', () => {
  it('muestra booleanos como PowerShell y null vacío', async () => {
    const setup = newWorktree(defaultConfig);
    newTranscript(setup, [toolUse('Bash', { run_in_background: true, flag: false, nothing: null })], 25);
    expect((await watchOnce(setup))[1]).toContain('Bash run_in_background True, flag False, nothing · sin tool_result');
  });
});
