import { mkdtempSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import {
  findLeak,
  gitUserConfig,
  machineUserPattern,
  readEvidence,
  selectEvidencePath,
  USER_PATH_PATTERN,
  type EvidenceFile,
} from './privacy.ts';
import { cleanGitEnv, kitRoot, run, type RunResult } from './process.ts';

const tools = join(kitRoot, 'tests', 'headless', 'extract.mjs');
const ALICE_HOME = { USERPROFILE: 'C:\\Users\\alice', HOME: '/c/Users/alice' };

// Las formas en que el home y el usuario salían en las salidas.
const LEAKY = [
  'git: /c/Users/alice/.claude/plugins',
  'tmp: C:\\Users\\alice\\AppData\\Local\\Temp\\x',
  'fwd: C:/Users/alice/AppData',
  'json: "C:\\\\Users\\\\alice\\\\.claude"',
  'proj: C--Users-alice-AppData-Local-Temp',
  '-rw-r--r-- 1 alice 197609 12 Sep 25 file.txt',
  'repo: alicemetal/sdd-kit',
].join('\n');

const tempFile = (name: string, content: string): string => {
  const path = join(mkdtempSync(join(tmpdir(), 'privacy-')), name);
  writeFileSync(path, content);
  return path;
};

function runTools(args: string[], options: { input?: string; env?: NodeJS.ProcessEnv } = {}): RunResult {
  return run(process.execPath, [tools, ...args], { input: options.input, env: { ...cleanGitEnv, ...options.env } });
}

const toolsAsAlice = (args: string[], input?: string): string => runTools(args, { input, env: ALICE_HOME }).output;

// Una identidad de git fija: la global en un fichero propio y, si se pide, la del molde por GIT_CONFIG_*.
function gitUserEnv(globalName: string, options: { moldName?: string; globalEmail?: string } = {}): NodeJS.ProcessEnv {
  const email = options.globalEmail === undefined ? '' : `\n\temail = ${options.globalEmail}`;
  const env: NodeJS.ProcessEnv = { GIT_CONFIG_GLOBAL: tempFile('gitconfig', `[user]\n\tname = ${globalName}${email}\n`) };
  if (options.moldName === undefined) return env;
  return { ...env, GIT_CONFIG_COUNT: '1', GIT_CONFIG_KEY_0: 'user.name', GIT_CONFIG_VALUE_0: options.moldName };
}

describe('El lanzador de sujetos oculta el home y el usuario', () => {
  it('extract.mjs tools los sustituye en el extracto del stream', () => {
    const stream = tempFile('stream.jsonl', JSON.stringify({ message: { content: [{ type: 'tool_result', content: LEAKY }] } }));

    const out = toolsAsAlice(['tools', stream, '/c/runs/x']);

    expect(out).not.toMatch(/\balice\b/i);
    expect(out).toMatch(/<home>\/\.claude\/plugins/i);
    expect(out).toMatch(/<home>\\AppData/i);
    expect(out).toMatch(/1 <user> 197609/i);
    expect(out, 'solo se sustituye el usuario como palabra entera').toMatch(/alicemetal\/sdd-kit/i);
  });

  it('extract.mjs texts los sustituye en los mensajes del agente', () => {
    const stream = tempFile('texts.jsonl', JSON.stringify({ type: 'assistant', message: { content: [{ type: 'text', text: LEAKY }] } }));

    const out = toolsAsAlice(['texts', stream, '/c/runs/x']);

    expect(out).toMatch(/--- \[1\]/);
    expect(out).not.toMatch(/\balice\b/i);
    expect(out).toMatch(/<home>\/\.claude\/plugins/i);
  });

  it('extract.mjs clean sustituye la ruta de la campaña en todas sus formas', () => {
    const forms = 'a C:/tmpdir/runs/x/repo b C:\\tmpdir\\runs\\x c C:\\\\tmpdir\\\\runs\\\\x d /c/tmpdir/runs/x e /tmp/runs/x/repo';

    const out = runTools(['clean', 'C:/tmpdir/runs/x'], { input: forms, env: { ...ALICE_HOME, TEMP: 'C:\\tmpdir' } }).output;

    expect(out).toBe('a <run>/repo b <run> c <run> d <run> e <run>/repo');
  });

  it('extract.mjs clean filtra la entrada estándar (state.txt)', () => {
    const out = toolsAsAlice(['clean', '/c/runs/x'], LEAKY);

    expect(out).not.toMatch(/\balice\b/i);
    expect(out).toMatch(/<home>\/\.claude\/plugins/i);
  });

  it('extract.mjs clean falla con el user.name de git de la máquina, no con el del molde (ticket de la feature 0099 §1)', () => {
    const env = gitUserEnv('Alice Liddell', { moldName: 'Fixture' });
    const leak = runTools(['clean', '/c/runs/x'], { input: 'spec aprobada por Alice Liddell', env });
    const clean = runTools(['clean', '/c/runs/x'], { input: 'commits de Fixture', env });

    expect(leak.code).toBe(3);
    expect(leak.output).toMatch(/la salida lleva el nombre o el email de git de la máquina: no se guarda/i);
    expect(leak.output).not.toMatch(/Alice Liddell/i);
    expect(clean).toEqual({ output: 'commits de Fixture', code: 0 });
  });

  it('extract.mjs falla con el user.email de git de la máquina', () => {
    const env = gitUserEnv('Alice Liddell', { globalEmail: 'alice@example.org' });
    const leak = runTools(['clean', '/c/runs/x'], { input: 'Author: Fixture <alice@example.org>', env });

    expect(leak.code).toBe(3);
    expect(leak.output).not.toMatch(/alice@example\.org/i);
  });

  it.each([
    { mode: 'tools', kept: />>> Bash: ls/i, after: /=== RESULTADO/i },
    { mode: 'texts', kept: /--- \[1\]/i, after: /luego/i },
  ])('extract.mjs $mode salta una línea sin parsear y sigue (feature 0168)', ({ mode, kept, after }) => {
    const broken = '{"type":"assistant","message":{"content":[{"type":"text","text":"a"';
    const stream = tempFile(`broken-${mode}.jsonl`, [
      '{"type":"assistant","message":{"content":[{"type":"text","text":"antes"},{"type":"tool_use","name":"Bash","input":{"command":"ls"}}]}}',
      broken,
      '{"type":"assistant","message":{"content":[{"type":"text","text":"luego"}]}}',
      '{"type":"result","num_turns":2,"total_cost_usd":0.3,"result":"después"}',
    ].join('\n'));

    const result = runTools([mode, stream, '/c/runs/x']);

    expect(result.code, result.output).toBe(0);
    expect(result.output).toContain(`!!! línea 2 del stream sin parsear (${broken.length} caracteres): `);
    expect(result.output).toMatch(kept);
    expect(result.output).toMatch(after);
  });

  it('extract.mjs last salta una línea sin parsear', () => {
    const stream = tempFile('broken-last.jsonl', '{"type":"result","result":"¿seguimos?"}\n{"type":"assistant","message":\n');

    expect(runTools(['last', stream])).toEqual({ output: '¿seguimos?', code: 0 });
  });

  it('extract.mjs falla con el user.name de la máquina aunque lleve tilde y la consola no sea UTF-8', () => {
    const result = runTools(['clean', '/c/runs/x'], { input: 'aprobada por Àlice Liddell', env: gitUserEnv('Àlice Liddell') });

    expect(result.code).toBe(3);
  });

  it('extract.mjs no confunde un nombre corto con parte de otra palabra (revisión final de la feature 0214)', () => {
    const env = gitUserEnv('Ana');
    const clean = runTools(['clean', '/c/runs/x'], { input: 'Analizar la Anamnesis', env });
    const leak = runTools(['clean', '/c/runs/x'], { input: 'aprobada por Ana.', env });

    expect(clean.code, clean.output).toBe(0);
    expect(leak.code).toBe(3);
  });

  it('extract.mjs tools salta una línea que no es un evento', () => {
    const stream = tempFile('null.jsonl', 'null\n{"type":"result","num_turns":1,"total_cost_usd":0.1,"result":"hecho"}\n');

    const result = runTools(['tools', stream, '/c/runs/x']);

    expect(result.code, result.output).toBe(0);
    expect(result.output).not.toMatch(/undefined/i);
    expect(result.output).toMatch(/=== RESULTADO/i);
  });

  it('extract.mjs tools escribe bajo >>> Agent las cabeceras ## del prompt (ticket de la feature 0147 §3)', () => {
    const prompt = 'Contexto sin cabecera\n## Tarea\ntexto\n### Detalle\n## Entrega\nmás texto';
    const input = { subagent_type: 'general-purpose', model: 'sonnet', description: 'implementa', prompt };
    const stream = tempFile('agent.jsonl', JSON.stringify({ message: { content: [{ type: 'tool_use', name: 'Agent', input }] } }));

    const out = toolsAsAlice(['tools', stream, '/c/runs/x']);

    expect(out).toMatch(/>>> Agent: subagent_type=general-purpose model=sonnet · implementa\n {4}## Tarea\n {4}## Entrega/i);
    expect(out).not.toMatch(/### Detalle|más texto/i);
  });
});

function filesUnder(dir: string): string[] {
  return readdirSync(dir, { recursive: true, encoding: 'utf8' })
    .map((name) => join(dir, name))
    .filter((path) => statSync(path).isFile());
}

// Toda subcarpeta de la tarea: las fugas que se escaparon estaban en campaign/.
function repoEvidence(): string[] {
  const specs = join(kitRoot, '.docs', 'sdd', 'specs');
  const taskFolders = readdirSync(specs).map((name) => join(specs, name)).filter((path) => statSync(path).isDirectory());
  const outputs = taskFolders.flatMap((folder) =>
    readdirSync(folder).map((name) => join(folder, name)).filter((path) => statSync(path).isDirectory()).flatMap(filesUnder),
  );
  const campaigns = readdirSync(join(kitRoot, 'tests'))
    .filter((name) => /-(red|green)\.md$/i.test(name))
    .map((name) => join(kitRoot, 'tests', name));
  return [...outputs, ...campaigns].map((path) => relative(kitRoot, path).replaceAll('\\', '/'));
}

describe('La evidencia de los sujetos no lleva el home de la máquina', () => {
  const because = 'el repo es público: pasa las salidas por tests/headless/extract.mjs clean';
  let evidence: EvidenceFile[];

  beforeAll(() => {
    evidence = readEvidence(repoEvidence());
  });

  it('revisa también las salidas de las baterías, de las pasadas de fix y de las campañas', () => {
    expect(evidence.some((file) => /\/(battery|fix)[^/]*\/out\//i.test(file.path))).toBe(true);
    expect(evidence.some((file) => /\/campaign\/out\//i.test(file.path))).toBe(true);
  });

  it('ningún fichero de specs/*/red|green|refactor/ tiene una ruta de usuario', () => {
    expect(findLeak(evidence, USER_PATH_PATTERN), because).toEqual([]);
  });

  it('ni el usuario de esta máquina suelto (ls -l)', () => {
    expect(findLeak(evidence, machineUserPattern()), because).toEqual([]);
  });

  it('lee el user.name de git en UTF-8 aunque la consola no lo sea (ticket de la feature 0099 §1)', () => {
    expect(gitUserConfig('user.name', { ...cleanGitEnv, ...gitUserEnv('Àlice Liddell') })).toBe('Àlice Liddell');
  });

  it('ni el user.name de git de esta máquina (ticket del patch 0080 §2)', (context) => {
    const name = gitUserConfig('user.name');
    if (name === '') context.skip('esta máquina no tiene user.name en git');
    expect(findLeak(evidence, new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')), 'el repo es público: no se guarda una salida con la identidad de la máquina').toEqual([]);
  });

  it('ni el user.email de git de esta máquina', (context) => {
    const email = gitUserConfig('user.email');
    if (email === '') context.skip('esta máquina no tiene user.email en git');
    expect(findLeak(evidence, new RegExp(email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')), 'el repo es público: no se guarda una salida con la identidad de la máquina').toEqual([]);
  });

  it('el control del commit toma como evidencia todo lo que recorre esta revisión', () => {
    const paths = evidence.map((file) => file.path);
    expect(selectEvidencePath(paths)).toHaveLength(paths.length);
  });
});
