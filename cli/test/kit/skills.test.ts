import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { WHOLE_LINE_MARK } from '../../../build/dist.ts';
import { filesUnder, frontmatter, isMigration, markdownFiles, readText, repoRoot, skillNames } from './kit-files.ts';

const skillsRoot = join(repoRoot, 'skills');
// Lo que carga el agente: el texto de una inclusión solo existe en dist/.
const distSkills = join(repoRoot, 'dist', 'skills');
const skills = skillNames();

// Proyectos reales donde se usa el kit: skills/ se instala en cada consumidor, y la evidencia de
// campo se cita sin nombre propio. MDT se llama hoy Quartz.
const realProjectNames = ['Alybo', 'SifAcademy', 'SifRest', '\\bMDT\\b', '\\bQuartz\\b', 'LegalRep', 'Medysif'];

function relativeLinks(text: string): string[] {
  return [...text.matchAll(/\]\(((?:references|templates|scripts)\/[^)#]+)\)/g)].map((match) => match[1]);
}

function siblingLinks(text: string): string[] {
  return [...text.matchAll(/\]\(((?:\.\.\/|[a-z0-9-]+\.md)[^)#]*)(?:#[^)]*)?\)/g)].map((match) => match[1]);
}

// Las references/ a las que se llega desde SKILL.md, directo o por el puntero de otra reference, enlace o nombre
// («See persuasion-principles.md in this directory»), como el reparto de writing-skills de superpowers 7.0.2.
function reachableReferences(skill: string, skillText: string): Set<string> {
  const reached = new Set(relativeLinks(skillText).map((link) => link.replace(/^references\//, '')));
  const pending = [...reached];
  for (let name = pending.pop(); name !== undefined; name = pending.pop()) {
    const path = join(distSkills, skill, 'references', name);
    if (!existsSync(path) || !statSync(path).isFile()) continue;
    for (const [link] of readFileSync(path, 'utf8').matchAll(/(?<![\w/-])[a-z0-9-]+\.md\b/g)) {
      if (reached.has(link)) continue;
      reached.add(link);
      pending.push(link);
    }
  }
  return reached;
}

function skillMarkdown(): string[] {
  return markdownFiles(skillsRoot).filter((path) => !isMigration(path));
}

function sortedUnique(values: string[]): string[] {
  return [...new Set(values)].sort();
}

describe.each(skills)('skill %s', (skill) => {
  const text = readText(`dist/skills/${skill}/SKILL.md`);
  const fields = frontmatter(text);

  it('tiene frontmatter con name igual a la carpeta, en kebab-case', () => {
    expect(fields.name).toBe(skill);
    expect(skill).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it('tiene description de 1024 caracteres como máximo', () => {
    expect(fields.description?.length ?? 0).toBeGreaterThan(0);
    expect(fields.description.length).toBeLessThanOrEqual(1024);
  });

  // Sin comillas, «: » o « #» rompen el YAML y Claude Code deja la skill fuera de la lista del modelo.
  it('tiene una description que YAML lee sin comillas', () => {
    expect(fields.description).not.toMatch(/: | #/);
  });

  it('no fuerza la carga de ficheros con @', () => {
    expect(text).not.toMatch(/@(references|templates|scripts|skills)\//);
  });

  it('enlaza solo a ficheros que existen', () => {
    expect([...relativeLinks(text), ...siblingLinks(text)].filter((link) => !existsSync(join(distSkills, skill, link)))).toEqual([]);
  });

  it.skipIf(!existsSync(join(distSkills, skill, 'references')))('enlaza todos sus references/ desde SKILL.md', () => {
    const reached = reachableReferences(skill, text);
    const orphans = readdirSync(join(distSkills, skill, 'references')).filter((name) => name.endsWith('.md') && !reached.has(name));
    expect(orphans).toEqual([]);
  });
});

describe('índice de sdd-templates', () => {
  it('lista cada plantilla de templates/ exactamente una vez', () => {
    const templates = readdirSync(join(distSkills, 'sdd-templates/templates')).filter((name) => name.endsWith('.md')).sort();
    const indexed = sortedUnique([...readText('dist/skills/sdd-templates/SKILL.md').matchAll(/\]\(templates\/([^)]+)\)/g)].map((match) => match[1]));
    expect(templates.length).toBeGreaterThan(0);
    expect(indexed).toEqual(templates);
  });
});

describe('skills de superpowers citadas', () => {
  // El recuento y la lista son el contrato; el énfasis y la frase de cierre son redacción.
  const sentence = /invoca \*{0,2}(\d+) skills? de superpowers\*{0,2}: (.*?)\./.exec(readText('README.md'));
  const declared = sortedUnique([...(sentence?.[2] ?? '').matchAll(/`([a-z-]+)`/g)].map((match) => match[1]));
  // Lo que cita una marca del kit es el original que sustituye, y la marca no viaja.
  const loaded = (path: string): string => readFileSync(path, 'utf8').split('\n').filter((line) => !WHOLE_LINE_MARK.test(line)).join('\n');
  const cited = sortedUnique(skillMarkdown().flatMap((path) => [...loaded(path).matchAll(/superpowers:([a-z-]+)/g)].map((match) => match[1])));

  it('el README declara la misma lista que citan las skills', () => {
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

  it('plugin.json no declara dependencias: el kit carga solo', () => {
    expect(plugin.dependencies).toBeUndefined();
  });

  it('marketplace.json no permite dependencias de otros marketplaces', () => {
    expect(marketplace.allowCrossMarketplaceDependenciesOn).toBeUndefined();
  });

  it('marketplace.json publica el plugin desde dist/, con description', () => {
    const entry = marketplace.plugins.find((candidate: { name: string }) => candidate.name === plugin.name);
    expect(entry?.source).toBe('./dist');
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

// Quitar la última frase de una viñeta con un Edit puede comerse el salto de línea y fundirla con la siguiente.
const fusedBullets = (text: string) => text.split('\n').filter((line) => /[^\s-]\.- \*\*/.test(line));

describe('viñetas de las skills', () => {
  it('reconoce dos viñetas fundidas en una línea', () => {
    expect(fusedBullets('- **Approach**: the parts it fixes.- **✋ Decisiones**: every value')).toHaveLength(1);
    expect(fusedBullets('- **Approach**: the parts it fixes.\n- **✋ Decisiones**: every value')).toEqual([]);
  });

  it('ninguna línea de una skill funde dos viñetas', () => {
    const fused = markdownFiles(skillsRoot).flatMap((path) => fusedBullets(readFileSync(path, 'utf8')).map((line) => `${relative(repoRoot, path)}: ${line.slice(0, 80)}`));
    expect(fused).toEqual([]);
  });
});

describe('privacidad', () => {
  const texts = filesUnder(skillsRoot, () => true).map((path) => ({ path: relative(repoRoot, path), text: readFileSync(path, 'utf8') }));

  it.each(realProjectNames)('ningún fichero de skills/ nombra el proyecto real %s', (name) => {
    const pattern = new RegExp(name, 'i');
    expect(texts.filter(({ text }) => pattern.test(text)).map(({ path }) => path), 'la evidencia de campo se cita sin el nombre del proyecto').toEqual([]);
  });
});
