import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { filesUnder, frontmatter, isMigration, markdownFiles, readText, repoRoot, skillNames } from './kit-files.ts';

const skillsRoot = join(repoRoot, 'skills');
const skills = skillNames();

// Proyectos reales donde se usa el kit: skills/ se instala en cada consumidor, y la evidencia de
// campo se cita sin nombre propio. MDT se llama hoy Quartz.
const realProjectNames = ['Alybo', 'SifAcademy', 'SifRest', '\\bMDT\\b', '\\bQuartz\\b', 'LegalRep', 'Medysif'];

function relativeLinks(text: string): string[] {
  return [...text.matchAll(/\]\(((?:references|templates|scripts)\/[^)#]+)\)/g)].map((match) => match[1]);
}

function skillMarkdown(): string[] {
  return markdownFiles(skillsRoot).filter((path) => !isMigration(path));
}

function sortedUnique(values: string[]): string[] {
  return [...new Set(values)].sort();
}

describe.each(skills)('skill %s', (skill) => {
  const text = readText(`skills/${skill}/SKILL.md`);
  const fields = frontmatter(text);

  it('tiene frontmatter con name igual a la carpeta, en kebab-case', () => {
    expect(fields.name).toBe(skill);
    expect(skill).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it('tiene description de 1024 caracteres como máximo', () => {
    expect(fields.description?.length ?? 0).toBeGreaterThan(0);
    expect(fields.description.length).toBeLessThanOrEqual(1024);
  });

  it('no fuerza la carga de ficheros con @', () => {
    expect(text).not.toMatch(/@(references|templates|scripts|skills)\//);
  });

  it('enlaza solo a ficheros que existen', () => {
    expect(relativeLinks(text).filter((link) => !existsSync(join(skillsRoot, skill, link)))).toEqual([]);
  });

  it.skipIf(!existsSync(join(skillsRoot, skill, 'references')))('enlaza todos sus references/ desde SKILL.md', () => {
    const linked = relativeLinks(text).map((link) => link.replace(/^references\//, ''));
    const orphans = readdirSync(join(skillsRoot, skill, 'references')).filter((name) => name.endsWith('.md') && !linked.includes(name));
    expect(orphans).toEqual([]);
  });
});

describe('índice de sdd-templates', () => {
  it('lista cada plantilla de templates/ exactamente una vez', () => {
    const templates = readdirSync(join(skillsRoot, 'sdd-templates/templates')).filter((name) => name.endsWith('.md')).sort();
    const indexed = sortedUnique([...readText('skills/sdd-templates/SKILL.md').matchAll(/\]\(templates\/([^)]+)\)/g)].map((match) => match[1]));
    expect(templates.length).toBeGreaterThan(0);
    expect(indexed).toEqual(templates);
  });
});

describe('skills de superpowers citadas', () => {
  // El recuento y la lista son el contrato; el énfasis y la frase de cierre son redacción.
  const sentence = /invoca \*{0,2}(\d+) skills? de superpowers\*{0,2}: (.*?)\./.exec(readText('README.md'));
  const declared = sortedUnique([...(sentence?.[2] ?? '').matchAll(/`([a-z-]+)`/g)].map((match) => match[1]));
  const cited = sortedUnique(markdownFiles(skillsRoot).flatMap((path) => [...readFileSync(path, 'utf8').matchAll(/superpowers:([a-z-]+)/g)].map((match) => match[1])));

  it('el README declara la misma lista que citan las skills', () => {
    expect(cited.length).toBeGreaterThan(0);
    expect(declared).toEqual(cited);
  });

  it('el README declara el número correcto', () => {
    expect(Number(sentence?.[1])).toBe(cited.length);
  });
});

describe('manifests del plugin', () => {
  const plugin = JSON.parse(readText('.claude-plugin/plugin.json'));
  const marketplace = JSON.parse(readText('.claude-plugin/marketplace.json'));

  it('plugin.json lleva versión SemVer', () => {
    expect(plugin.version).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('plugin.json resuelve superpowers, y solo una vez, desde superpowers-marketplace', () => {
    const superpowers = plugin.dependencies.filter((dependency: { name: string }) => dependency.name === 'superpowers');
    expect(superpowers).toHaveLength(1);
    expect(superpowers[0].marketplace).toBe('superpowers-marketplace');
  });

  it('marketplace.json permite la dependencia de superpowers-marketplace y solo esa', () => {
    expect(marketplace.allowCrossMarketplaceDependenciesOn).toEqual(['superpowers-marketplace']);
  });

  it('marketplace.json publica el plugin desde la raíz del repo, con description', () => {
    const entry = marketplace.plugins.find((candidate: { name: string }) => candidate.name === plugin.name);
    expect(entry?.source).toBe('.');
    expect(marketplace.description).toBeTruthy();
  });
});

function missingInvocations(path: string): string[] {
  const text = readFileSync(path, 'utf8');
  const qualified = [...text.matchAll(/sdd-kit:([a-z]+(?:-[a-z]+)*)(?![-<a-z])/g)]
    .map((match) => match[1])
    .filter((name) => !existsSync(join(skillsRoot, name)) && !existsSync(join(repoRoot, 'agents', `${name}.md`)));
  const quoted = [...text.matchAll(/`(sdd-[a-z]+(?:-[a-z]+)*|using-sdd|add-to-changelog)`/g)]
    .map((match) => match[1])
    .filter((name) => !existsSync(join(skillsRoot, name)));
  return [...qualified, ...quoted].map((name) => `${relative(repoRoot, path)}: ${name}`);
}

describe('skills invocadas', () => {
  // Las migraciones nombran las skills viejas a propósito: las buscan en el proyecto que migran.
  it('toda skill invocada existe', () => {
    expect(skillMarkdown().flatMap(missingInvocations)).toEqual([]);
  });

  it('toda skill adaptada de otra fuente lleva NOTICE', () => {
    const adapted = skills.filter((skill) =>
      markdownFiles(join(skillsRoot, skill)).some((path) => /adapted from|adaptad[oa] de/i.test(readFileSync(path, 'utf8'))),
    );
    expect(adapted.length).toBeGreaterThan(0);
    expect(adapted.filter((skill) => !existsSync(join(skillsRoot, skill, 'NOTICE')))).toEqual([]);
  });
});

describe('privacidad', () => {
  const texts = filesUnder(skillsRoot, () => true).map((path) => ({ path: relative(repoRoot, path), text: readFileSync(path, 'utf8') }));

  it.each(realProjectNames)('ningún fichero de skills/ nombra el proyecto real %s', (name) => {
    const pattern = new RegExp(name, 'i');
    expect(texts.filter(({ text }) => pattern.test(text)).map(({ path }) => path), 'la evidencia de campo se cita sin el nombre del proyecto').toEqual([]);
  });
});
