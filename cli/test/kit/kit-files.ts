import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const repoRoot = fileURLToPath(new URL('../../../', import.meta.url));

export function readText(relative: string): string {
  return readFileSync(join(repoRoot, relative), 'utf8');
}

export function filesUnder(dir: string, keep: (path: string) => boolean): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return filesUnder(path, keep);
    return keep(path) ? [path] : [];
  });
}

const migrationsPart = `${sep}references${sep}migrations${sep}`;

export function isMigration(path: string): boolean {
  return path.includes(migrationsPart);
}

export function markdownFiles(dir: string): string[] {
  return filesUnder(dir, (path) => path.endsWith('.md'));
}

export function frontmatter(text: string): Record<string, string> {
  const block = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!block) return {};
  const fields: Record<string, string> = {};
  for (const line of block[1].split(/\r?\n/)) {
    const field = /^([A-Za-z_-]+):\s*(.*)$/.exec(line);
    if (field) fields[field[1]] = field[2].trim();
  }
  return fields;
}

export function skillNames(): string[] {
  const skills = join(repoRoot, 'skills');
  return readdirSync(skills).filter((name) => statSync(join(skills, name)).isDirectory());
}
