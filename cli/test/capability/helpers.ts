import { afterAll } from 'vitest';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { run } from '../../src/main.ts';
import { memoryIo } from '../../src/cli/io.ts';

const roots: string[] = [];

afterAll(() => {
  roots.splice(0).forEach((root) => rmSync(root, { recursive: true, force: true }));
});

export const repoRoot = fileURLToPath(new URL('../../../', import.meta.url));

export function readRepoFile(relative: string): string {
  return readFileSync(join(repoRoot, relative), 'utf8').replace(/\r\n/g, '\n');
}

export const bookingsFixture = readFileSync(new URL('../fixtures/capabilities/bookings.md', import.meta.url), 'utf8').replace(
  /\r\n/g,
  '\n',
);

export function sddFolder(files: Record<string, string>): string {
  const root = mkdtempSync(join(tmpdir(), 'sdd-caps-'));
  roots.push(root);
  const sdd = join(root, '.docs/sdd');
  mkdirSync(sdd, { recursive: true });
  for (const [relative, content] of Object.entries(files)) {
    const target = join(sdd, relative);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, content, 'utf8');
  }
  return sdd;
}

export function setPurpose(content: string, body: string): string {
  return content.replace(/## Propósito\r?\n[\s\S]*?(?=\r?\n## )/, `## Propósito\n\n${body}\n`);
}

export type Outcome = { lines: string[]; stderr: string[]; code: number };

export async function runSdd(args: string[]): Promise<Outcome> {
  const io = memoryIo();
  const code = await run(args, io);
  return { lines: io.stdout, stderr: io.stderr, code };
}
