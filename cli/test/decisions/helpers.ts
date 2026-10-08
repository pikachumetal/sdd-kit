import { afterAll } from 'vitest';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { memoryIo } from '../../src/cli/io.ts';
import { run } from '../../src/main.ts';

const roots: string[] = [];

afterAll(() => {
  roots.splice(0).forEach((root) => rmSync(root, { recursive: true, force: true }));
});

export const SECTIONS = ['## Contexto y problema', '## Opciones consideradas', '## Decisión', '### Consecuencias', '### Confirmación'];

export interface AdrOptions {
  title?: string | null;
  status?: string;
  date?: string;
  rutas?: string | null;
  sections?: string[];
}

export function adr({ title = 'Usar Postgres', status = 'accepted', date = '2026-10-08', rutas = 'rutas:\n  - src/db/**', sections = SECTIONS }: AdrOptions = {}): string {
  const front = ['---', `status: ${status}`, `date: ${date}`, ...(rutas === null ? [] : [rutas]), '---', ''];
  const heading = title === null ? [] : [`# ${title}`, ''];
  return [...front, ...heading, ...sections.flatMap((section) => [section, '', 'Texto.', ''])].join('\n');
}

export function emptyDocs(): string {
  const root = mkdtempSync(join(tmpdir(), 'sdd-decisions-'));
  roots.push(root);
  const docs = join(root, '.docs/sdd');
  mkdirSync(docs, { recursive: true });
  return docs;
}

export function docsWith(files: Record<string, string>): string {
  const docs = emptyDocs();
  mkdirSync(join(docs, 'decisions'));
  for (const [name, content] of Object.entries(files)) writeFileSync(join(docs, 'decisions', name), content, 'utf8');
  return docs;
}

export async function sdd(args: string[]): Promise<{ lines: string[]; code: number }> {
  const io = memoryIo();
  const code = await run(args, io);
  return { lines: [...io.stdout, ...io.stderr], code };
}
