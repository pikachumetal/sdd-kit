import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { readText, repoRoot } from './kit-files.ts';

// Estos documentos describen el kit y no viajan con él. Nada en las skills los nombra, así que
// sin el marcador el desfase vuelve solo: pasó entre julio y septiembre de 2026, cuando siguieron
// describiendo el carril `hotfix` tres releases después de que se llamara `patch`.
const workflowRoot = join(repoRoot, '.docs/workflow');
// El anexo describe fuentes externas, no el kit: envejece con ellas, no con cada release.
const versionedDocs = ['greenfield.md', 'brownfield.md', 'usage-guide.md'];
const allDocs = [...versionedDocs, 'evidence-and-references.md'];
const pluginVersion: string = JSON.parse(readText('.claude-plugin/plugin.json')).version;

function compareVersions(left: string, right: string): number {
  const [a, b] = [left, right].map((version) => version.split('.').map(Number));
  return a.map((part, index) => part - b[index]).find((difference) => difference !== 0) ?? 0;
}

function markerIsCurrent(text: string, version: string): boolean {
  const marker = /Última revisión: kit v(\d+\.\d+\.\d+)/.exec(text);
  return marker !== null && compareVersions(marker[1], version) >= 0;
}

// El slug de GitHub: minúsculas, sin puntuación (las letras con tilde se quedan), espacios a guiones.
// shortcut: no numera los títulos repetidos (-1, -2) como GitHub; ningún enlace apunta hoy a uno.
function headingSlugs(path: string): string[] {
  const outsideCode = readFileSync(path, 'utf8').replace(/^```[\s\S]*?^```/gm, '');
  return [...outsideCode.matchAll(/^#{1,6} +(.+?) *$/gm)].map((match) =>
    match[1].toLowerCase().replace(/[^\p{L}\p{N} _-]/gu, '').replace(/ /g, '-'),
  );
}

function brokenRelativeLinks(text: string, baseDir: string): string[] {
  const targets = [...new Set([...text.matchAll(/\]\(([^)\s]+)\)/g)].map((match) => match[1]))];
  return targets
    .filter((target) => !target.includes(':') && !target.startsWith('#'))
    .filter((target) => {
      const [path, anchor] = target.split('#', 2);
      const full = join(baseDir, path);
      if (!existsSync(full)) return true;
      return Boolean(anchor) && !headingSlugs(full).includes(anchor);
    });
}

describe('documentación de flujo', () => {
  it.each(allDocs)('existe %s', (doc) => {
    expect(existsSync(join(workflowRoot, doc))).toBe(true);
  });

  it.each(versionedDocs)('%s declara la versión del kit que revisó', (doc) => {
    expect(
      markerIsCurrent(readFileSync(join(workflowRoot, doc), 'utf8'), pluginVersion),
      `${doc} describe el kit: si la versión subió, hay que releerlo y actualizar el marcador 'Última revisión: kit vX.Y.Z'`,
    ).toBe(true);
  });

  it.each(allDocs)('%s no tiene enlaces relativos rotos', (doc) => {
    expect(brokenRelativeLinks(readFileSync(join(workflowRoot, doc), 'utf8'), workflowRoot)).toEqual([]);
  });
});

describe('marcador de revisión', () => {
  it('acepta un marcador igual o posterior a plugin.json', () => {
    expect(markerIsCurrent('Última revisión: kit v2.0.0', '1.1.0')).toBe(true);
    expect(markerIsCurrent('Última revisión: kit v1.1.0', '1.1.0')).toBe(true);
  });

  it('rechaza un marcador anterior a plugin.json o ausente', () => {
    expect(markerIsCurrent('Última revisión: kit v1.0.0', '1.1.0')).toBe(false);
    expect(markerIsCurrent('Última revisión: kit v2.0.0', '2.0.1')).toBe(false);
    expect(markerIsCurrent('sin marcador', '1.1.0')).toBe(false);
  });
});

describe('enlaces relativos', () => {
  it('detecta un enlace relativo roto y descarta URLs y anclas del propio documento', () => {
    const text = '[x](brownfeld.md) [y](greenfield.md) [z](https://a.b/c.md) [w](#ancla) [v](brownfield.md#1-fase-1-onboarding-del-codebase)';
    expect(brokenRelativeLinks(text, workflowRoot)).toEqual(['brownfeld.md']);
  });

  it('detecta un ancla que no es ningún título del fichero destino', () => {
    const text = '[v](brownfield.md#1-fase) [u](usage-guide.md#validar-de-verdad)';
    expect(brokenRelativeLinks(text, workflowRoot)).toEqual(['brownfield.md#1-fase']);
  });
});
