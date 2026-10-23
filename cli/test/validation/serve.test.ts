import { afterEach, describe, expect, it } from 'vitest';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { request } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runInNewContext } from 'node:vm';
import { UsageError } from '../../src/cli/args.ts';
import { memoryIo } from '../../src/cli/io.ts';
import { run } from '../../src/main.ts';
import { parseSteps, startValidationServer } from '../../src/validation/server.ts';
import { panelPath } from '../../src/validation/verbs.ts';

const STEPS = [
  { id: '1', title: 'libres 10:00-12:00 → «Sur»' },
  { id: '2', title: 'cancelar mie 10:00 → «no hay reserva mie 10:00»' },
];
const BAD_STEPS = 'pasos.json: no es una lista de pasos {id, title}';
const USAGE = 'uso: sdd validation serve --steps <fichero> --out <fichero>';
const PENDING = STEPS.map((step) => ({ ...step, status: 'pending', comment: '', markedAt: null }));

const dirs: string[] = [];
const servers: { close(): Promise<void> }[] = [];

afterEach(async () => {
  await Promise.all(servers.splice(0).map((server) => server.close()));
  dirs.splice(0).forEach((dir) => rmSync(dir, { recursive: true, force: true }));
});

function tempDir(): string {
  const dir = mkdtempSync(join(tmpdir(), 'sdd-validation-'));
  dirs.push(dir);
  return dir;
}

async function serve() {
  const out = join(tempDir(), 'validation', '0008.json');
  const server = await startValidationServer({ steps: STEPS, out, panelSource: 'window.panelLoaded = true;' });
  servers.push(server);
  return { ...server, out };
}

type Reply = { status: number; body: string };

function send(url: string, options: { method?: string; headers?: Record<string, string>; body?: unknown } = {}): Promise<Reply> {
  const payload = options.body === undefined ? undefined : JSON.stringify(options.body);
  return new Promise((resolve, reject) => {
    const req = request(url, { method: options.method ?? 'GET', headers: { 'content-type': 'application/json', ...options.headers } }, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => resolve({ status: res.statusCode ?? 0, body }));
    });
    req.on('error', reject);
    req.end(payload);
  });
}

const mark = (url: string, body: unknown, headers: Record<string, string> = {}) => send(`${url}mark`, { method: 'POST', body, headers });
const saved = (out: string) => JSON.parse(readFileSync(out, 'utf8'));

describe('sdd validation serve', () => {
  it('serves the page with every step on 127.0.0.1', async () => {
    const { url, out } = await serve();
    expect(url).toMatch(/^http:\/\/127\.0\.0\.1:\d+\/$/);
    const page = await send(url);
    expect(page.status).toBe(200);
    expect(page.body).toContain('libres 10:00-12:00 → «Sur»');
    expect(page.body).toContain('cancelar mie 10:00 → «no hay reserva mie 10:00»');
    expect(page.body).toContain('<script src="/panel.js">');
    expect((await send(`${url}panel.js`)).body).toBe('window.panelLoaded = true;');
    expect(saved(out)).toHaveLength(2);
  });

  it('writes all steps pending at start', async () => {
    const { url, out } = await serve();
    expect(saved(out)).toEqual(PENDING);
    expect(JSON.parse((await send(`${url}results`)).body)).toEqual(PENDING);
  });

  it('stores a mark and returns it in results', async () => {
    const { url, out } = await serve();
    expect((await mark(url, { id: '1', status: 'ok' })).status).toBe(200);
    const [first, second] = saved(out);
    expect(first).toMatchObject({ id: '1', status: 'ok', comment: '' });
    expect(new Date(first.markedAt).toISOString()).toBe(first.markedAt);
    expect(second).toMatchObject({ id: '2', status: 'pending', markedAt: null });
    expect(JSON.parse((await send(`${url}results`)).body)).toEqual(saved(out));
  });

  it('the last mark of a step wins', async () => {
    const { url, out } = await serve();
    await mark(url, { id: '1', status: 'ok' });
    await mark(url, { id: '1', status: 'ko', comment: 'sale cancelada' });
    expect(saved(out)[0]).toMatchObject({ status: 'ko', comment: 'sale cancelada' });
  });

  it('a new mark renews markedAt even with the same status', async () => {
    const { url, out } = await serve();
    await mark(url, { id: '1', status: 'ok' });
    const first = saved(out)[0].markedAt;
    await new Promise((resolve) => setTimeout(resolve, 5));
    await mark(url, { id: '1', status: 'ok' });
    expect(saved(out)[0].markedAt).not.toBe(first);
  });

  it('a comment alone keeps the status and its markedAt', async () => {
    const { url, out } = await serve();
    await mark(url, { id: '1', status: 'ko' });
    const before = saved(out)[0];
    expect((await mark(url, { id: '1', comment: 'sale cancelada' })).status).toBe(200);
    expect(saved(out)[0]).toEqual({ ...before, comment: 'sale cancelada' });
  });

  it('rejects a body that is not a mark with 400', async () => {
    const { url } = await serve();
    expect((await send(`${url}mark`, { method: 'POST', body: 'no json' })).status).toBe(400);
    expect((await mark(url, { id: '1', comment: 3 })).status).toBe(400);
  });

  it('answers 500 and keeps listening when the marks cannot be saved', async () => {
    const { url, out } = await serve();
    rmSync(out);
    mkdirSync(out);
    expect((await mark(url, { id: '1', status: 'ok' })).status).toBe(500);
    expect((await send(`${url}results`)).status).toBe(200);
  });

  it('the page starts from the marks of this server, not from the browser', async () => {
    const { url } = await serve();
    const seed = `localStorage.setItem('sdd-validation-serve', ${JSON.stringify(JSON.stringify(PENDING))});`;
    expect((await send(url)).body).toContain(seed);
  });

  it('rejects a foreign origin with 403', async () => {
    const { url, out } = await serve();
    const before = readFileSync(out, 'utf8');
    expect((await mark(url, { id: '1', status: 'ok' }, { origin: 'http://evil.example' })).status).toBe(403);
    expect((await mark(url, { id: '1', status: 'ok' }, { host: `localhost:${new URL(url).port}` })).status).toBe(403);
    expect(readFileSync(out, 'utf8')).toBe(before);
  });

  it('rejects an unknown step or status with 400', async () => {
    const { url, out } = await serve();
    const before = readFileSync(out, 'utf8');
    expect((await mark(url, { id: '9', status: 'ok' })).status).toBe(400);
    expect((await mark(url, { id: '1', status: 'hecho' })).status).toBe(400);
    expect(readFileSync(out, 'utf8')).toBe(before);
  });

  it('serve fails before listening when --out cannot be written', async () => {
    const blocker = join(tempDir(), 'blocker');
    writeFileSync(blocker, 'not a folder');
    await expect(startValidationServer({ steps: STEPS, out: join(blocker, '0008.json'), panelSource: '' })).rejects.toThrow();
  });
});

describe('parseSteps', () => {
  it.each([
    ['no json', 'no json'],
    ['an object', '{}'],
    ['an empty list', '[]'],
    ['a repeated id', JSON.stringify([STEPS[0], STEPS[0]])],
    ['a title that is not text', JSON.stringify([{ id: '1', title: 3 }])],
  ])('parseSteps rejects bad step lists: %s', (_case, text) => {
    expect(() => parseSteps(text, 'pasos.json')).toThrow(new UsageError(BAD_STEPS));
  });

  it('returns the steps of a valid list', () => {
    expect(parseSteps(JSON.stringify(STEPS), 'pasos.json')).toEqual(STEPS);
  });
});

describe('validation serve usage', () => {
  it('serve without --steps exits 2 with usage', async () => {
    const io = memoryIo();
    expect(await run(['validation', 'serve', '--out', 'x.json'], io)).toBe(2);
    expect(io.stderr.join('\n')).toContain('falta la opción --steps');
    expect(io.stderr).toContain(USAGE);
  });

  it('serve without --out exits 2 with usage', async () => {
    const io = memoryIo();
    expect(await run(['validation', 'serve', '--steps', 'pasos.json'], io)).toBe(2);
    expect(io.stderr).toContain(USAGE);
  });

  it('serve --help shows the usage without listening', async () => {
    const io = memoryIo();
    expect(await run(['validation', 'serve', '--help'], io)).toBe(0);
    expect(io.stdout[0]).toBe(USAGE);
  });

  it('serve with a missing steps file exits 2 with the steps message', async () => {
    const io = memoryIo();
    const steps = join(tempDir(), 'pasos.json');
    expect(await run(['validation', 'serve', '--steps', steps, '--out', join(tempDir(), 'out.json')], io)).toBe(2);
    expect(io.stderr).toContain(`${steps}: no es una lista de pasos {id, title}`);
  });

  it('serve exits 1 with the system message when --out cannot be written', async () => {
    const steps = join(tempDir(), 'pasos.json');
    writeFileSync(steps, JSON.stringify(STEPS));
    const blocker = join(tempDir(), 'blocker');
    writeFileSync(blocker, 'not a folder');
    const io = memoryIo();
    expect(await run(['validation', 'serve', '--steps', steps, '--out', join(blocker, '0008.json')], io)).toBe(1);
    expect(io.stderr.join('\n')).toMatch(/EEXIST|ENOTDIR|EPERM/);
    expect(io.stdout.join('\n')).not.toContain('panel:');
  });

  it('serve with a bad steps file exits 2 without listening', async () => {
    const steps = join(tempDir(), 'pasos.json');
    writeFileSync(steps, '[]');
    const io = memoryIo();
    expect(await run(['validation', 'serve', '--steps', steps, '--out', join(tempDir(), 'out.json')], io)).toBe(2);
    expect(io.stderr.join('\n')).toContain(`${steps}: no es una lista de pasos {id, title}`);
    expect(io.stdout.join('\n')).not.toContain('panel:');
  });

  it('help lists validation serve', async () => {
    const io = memoryIo();
    expect(await run(['--help'], io)).toBe(0);
    expect(io.stdout.join('\n')).toContain('sdd validation serve');
  });
});

describe('plan B page script', () => {
  async function pageScript() {
    const { url } = await serve();
    const html = (await send(url)).body;
    const posts: unknown[] = [];
    const window: Record<string, (marks: unknown[]) => void> = {};
    const context = { window, localStorage: { setItem: () => {} }, sddValidationPanel: { mount: () => {} },
      fetch: async (_path: string, init: { body: string }) => posts.push(JSON.parse(init.body)) };
    runInNewContext(html.split('<script>')[1].split('</script>')[0], context);
    const change = async (marks: unknown[]) => {
      window.sddValidationPanelOnChange(marks);
      await new Promise((resolve) => setTimeout(resolve, 0));
    };
    return { change, posts };
  }

  it('posts only the step that changed, without its status when only the comment changed', async () => {
    const { change, posts } = await pageScript();
    await change([{ ...PENDING[0], status: 'ok' }, PENDING[1]]);
    expect(posts).toEqual([{ id: '1', status: 'ok', comment: '' }]);
    await change([{ ...PENDING[0], status: 'ok', comment: 'x' }, PENDING[1]]);
    expect(posts.at(-1)).toEqual({ id: '1', comment: 'x' });
  });
});

describe('validation panel contract', () => {
  it('the panel file the verb serves exposes the API the page calls', () => {
    expect(existsSync(panelPath)).toBe(true);
    const source = readFileSync(panelPath, 'utf8');
    expect(source).toContain('window.sddValidationPanel = { mount, read: loadMarks, clear }');
    expect(source).toContain('window.sddValidationPanelOnChange?.(marks)');
  });
});
