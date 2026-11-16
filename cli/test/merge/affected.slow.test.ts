import { describe, it, expect, afterAll } from 'vitest';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, dirname, join } from 'node:path';
import { queryTasks } from '../../src/merge/affected.ts';

const dirs: string[] = [];
afterAll(() => dirs.forEach((dir) => rmSync(dir, { recursive: true, force: true })));

function fakeMoon(script: string): string {
  const dir = mkdtempSync(join(tmpdir(), 'fake-moon-'));
  dirs.push(dir);
  writeFileSync(join(dir, 'fake.mjs'), script);
  writeFileSync(join(dir, 'moon.cmd'), `@"${process.execPath}" "%~dp0fake.mjs" %*\r\n`);
  return dir;
}

async function withEnv<T>(env: Record<string, string | undefined>, body: () => Promise<T>): Promise<T> {
  const saved = Object.fromEntries(Object.keys(env).map((key) => [key, process.env[key]]));
  const apply = (values: Record<string, string | undefined>) =>
    Object.entries(values).forEach(([key, value]) => (value === undefined ? delete process.env[key] : (process.env[key] = value)));
  apply(env);
  try {
    return await body();
  } finally {
    apply(saved);
  }
}

const PRINT_TARGET = `const target = 'a:' + process.env.MOON_BASE + '-' + (process.env.GIT_DIR ?? 'limpio') + '-' + process.argv.slice(2).join('+');
console.log(JSON.stringify({ tasks: { a: { t: { target } } } }));
`;

describe.runIf(process.platform === 'win32')('moon query desde un moon.cmd', () => {
  it('asks a moon.cmd with its arguments intact and without GIT_DIR', async () => {
    const dir = fakeMoon(PRINT_TARGET);
    const path = [dir, dirname(process.execPath)].join(delimiter);

    const tasks = await withEnv({ PATH: path, GIT_DIR: 'otro-repo' }, () => queryTasks(dir, { base: 'b1', head: 'HEAD', relations: false }));

    expect(tasks).toEqual(['a:b1-limpio-query+tasks+--affected']);
  });

  it('reports a failing moon in one line', async () => {
    const dir = fakeMoon("console.log('sin json');\nconsole.log('segunda');\nprocess.exit(1);\n");
    const path = [dir, dirname(process.execPath)].join(delimiter);

    const failure = await withEnv({ PATH: path }, () => queryTasks(dir, { base: 'b1', head: 'HEAD', relations: false }).catch((error: Error) => error));

    expect(failure).toBeInstanceOf(Error);
    expect((failure as Error).message).not.toContain('\n');
  });
});
