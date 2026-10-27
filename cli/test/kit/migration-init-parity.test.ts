import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve, sep } from 'node:path';
import { isMigration, repoRoot } from './kit-files.ts';

const migrationsDir = join(repoRoot, 'skills/sdd-upgrade/references/migrations');

const migrations = readdirSync(migrationsDir)
  .filter((name) => /^v.*\.md$/.test(name))
  .map((name) => ({ name, text: readFileSync(join(migrationsDir, name), 'utf8') }))
  .filter(({ text }) => text.includes('sdd-kit.json'));

function declaredTokens(migrationText: string): string[] {
  const line = migrationText.split(/\r?\n/).find((candidate) => candidate.startsWith('**Escribe**:'));
  return line ? [...line.matchAll(/`([^`]+)`/g)].map((match) => match[1]) : [];
}

function linkedMarkdown(path: string): string[] {
  return [...readFileSync(path, 'utf8').matchAll(/\]\((?!https?:)([^)#]+\.md)/g)]
    .map((match) => resolve(dirname(path), match[1]))
    .filter((target) => existsSync(target));
}

function markdownIn(dir: string): string[] {
  return existsSync(dir) ? readdirSync(dir).filter((name) => name.endsWith('.md')).map((name) => join(dir, name)) : [];
}

function initCorpus(): string {
  const skillDir = join(repoRoot, 'skills/sdd-init');
  const own = [join(skillDir, 'SKILL.md'), ...markdownIn(join(skillDir, 'references'))];
  const cli = readdirSync(join(repoRoot, 'cli/src/init')).filter((name) => name.endsWith('.ts')).map((name) => join(repoRoot, 'cli/src/init', name));
  const upgradeSkill = `${sep}skills${sep}sdd-upgrade${sep}`;
  const files = [...new Set([...own, ...own.flatMap(linkedMarkdown), ...cli])].filter((path) => !isMigration(path) && !path.includes(upgradeSkill));
  return files.map((path) => readFileSync(path, 'utf8')).join('\n');
}

describe('paridad migración–init', () => {
  const corpus = initCorpus();

  it('hay migraciones que escriben sdd-kit.json', () => {
    expect(migrations.length).toBeGreaterThanOrEqual(3);
  });

  it.each(['v1.0.0.md', 'v1.1.0.md', 'v2.0.0.md'])('%s declara lo que escribe en su línea **Escribe**', (name) => {
    expect(declaredTokens(readFileSync(join(migrationsDir, name), 'utf8')).length).toBeGreaterThan(0);
  });

  it('cada token declarado por una migración aparece en sdd-init', () => {
    const missing = migrations.flatMap(({ name, text }) => declaredTokens(text).filter((token) => !corpus.includes(token)).map((token) => `${name}: ${token}`));
    expect(missing).toEqual([]);
  });

  it('el corpus de una init no incluye las migraciones', () => {
    expect(corpus).not.toContain('**Escribe**:');
  });

  it('una clave inventada no aparece en el corpus', () => {
    expect(corpus).not.toContain('control.inventedKey');
  });
});
