import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { listSources } from '../../../build/dist.ts';
import { noticeFiles, renderNotice, renderSourcesTable, seeNoticeWithout, versionsInText } from '../../../build/notices.ts';
import { classify, readRegistry, validateRegistry, type Registry } from '../../../build/sources.ts';
import { repoRoot } from './kit-files.ts';

const toy: Registry = {
  sources: {
    Juguete: { repo: 'acme/juguete', tagPrefix: 'v', license: 'MIT', copyright: 'Copyright (c) 2026 Acme' },
    Apache: { repo: 'acme/apache', tagPrefix: 'v', license: 'Apache-2.0', copyright: '' },
    Otra: { repo: 'acme/otra', tagPrefix: 'v', license: 'MIT', copyright: 'Copyright (c) 2026 Otra' },
  },
  entries: [
    { kind: 'copy', source: 'Juguete', version: 'v1.2.0', paths: ['skills/a/SKILL.md'], kit: ['skills/sdd-a/SKILL.md'] },
    {
      kind: 'copy',
      source: 'Juguete',
      version: 'v1.2.0',
      paths: ['skills/a/ref.md'],
      kit: ['skills/sdd-a/references/ref.md'],
      from: [{ source: 'Otra', version: 'v2.0.0', path: 'x/SKILL.md' }],
    },
    { kind: 'concept', source: 'Apache', version: 'v3.0.0', paths: ['docs/b.md'], kit: ['skills/sdd-b/'], note: 'Solo la idea.' },
  ],
  own: ['skills/sdd-b/', 'skills/sdd-a/references/own.md'],
};

describe('avisos de terceros desde upstream.json', () => {
  it('renders a notice per copy entry with its license text', () => {
    const notice = renderNotice(toy, 'skills/sdd-a') ?? '';
    expect(notice).toContain('https://github.com/acme/juguete, version v1.2.0 (skills/a/SKILL.md, skills/a/ref.md)');
    expect(notice).toContain('MIT License\n\nCopyright (c) 2026 Acme\n\nPermission is hereby granted, free of charge');
    expect(notice).toContain('OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n');
  });

  it('groups a notice by source and version', () => {
    const notice = renderNotice(toy, 'skills/sdd-a') ?? '';
    expect(notice.match(/Portions of this skill/g)).toHaveLength(2);
    expect(notice).toContain('https://github.com/acme/otra, version v2.0.0 (x/SKILL.md)');
    expect(notice).toContain('Copyright (c) 2026 Otra');
  });

  it('has no notice for a skill with only concepts', () => {
    expect(renderNotice(toy, 'skills/sdd-b')).toBeNull();
  });

  it('fails on a copy with a license without template', () => {
    const apacheCopy: Registry = { ...toy, entries: [{ ...toy.entries[2], kind: 'copy' }] };
    expect(() => renderNotice(apacheCopy, 'skills/sdd-b')).toThrow('Apache: licencia Apache-2.0 sin plantilla en build/notices.ts');
  });

  it('renders the sources table in registry order', () => {
    expect(renderSourcesTable(toy).split('\n')).toEqual([
      '## Fuentes',
      '',
      '| Fichero del kit | Fuente | Tipo | Versión | Rutas de la fuente | Licencia | Nota |',
      '| --- | --- | --- | --- | --- | --- | --- |',
      '| `skills/sdd-a/SKILL.md` | [Juguete](https://github.com/acme/juguete) | copia | `v1.2.0` | `skills/a/SKILL.md` | MIT, Copyright (c) 2026 Acme | |',
      '| `skills/sdd-a/references/ref.md` | [Juguete](https://github.com/acme/juguete) | copia | `v1.2.0` | `skills/a/ref.md` | MIT, Copyright (c) 2026 Acme | |',
      '| `skills/sdd-a/references/ref.md` | [Otra](https://github.com/acme/otra) | copia | `v2.0.0` | `x/SKILL.md` | MIT, Copyright (c) 2026 Otra | |',
      '| `skills/sdd-b/` | [Apache](https://github.com/acme/apache) | concepto | `v3.0.0` | `docs/b.md` | Apache-2.0 | Solo la idea. |',
      '',
    ]);
  });

  it('every notice is what upstream.json generates', () => {
    const differing = [...noticeFiles(readRegistry(join(repoRoot, 'upstream.json')), repoRoot)]
      .filter(([path, content]) => readFileSync(join(repoRoot, path), 'utf8').replace(/\r\n/g, '\n') !== content)
      .map(([path]) => `${path} no es lo que sale de upstream.json: ejecuta moon run kit:notices`);
    expect(differing).toEqual([]);
  });

  it('classifies every file of skills/', () => {
    const files = ['skills/sdd-a/SKILL.md', 'skills/sdd-a/references/ref.md', 'skills/sdd-a/references/own.md', 'skills/sdd-a/NOTICE', 'skills/sdd-b/SKILL.md'];
    expect(classify(toy, files)).toEqual([]);
    expect(classify(toy, [...files, 'skills/sdd-a/references/loose.md'])).toEqual([
      'skills/sdd-a/references/loose.md no está clasificado en upstream.json: ponlo en una entrada copy o en own',
    ]);
    const twice: Registry = { ...toy, own: [...(toy.own ?? []), 'skills/sdd-a/SKILL.md'] };
    expect(classify(twice, files)).toEqual(['skills/sdd-a/SKILL.md no está clasificado en upstream.json: ponlo en una entrada copy o en own']);
    const pending: Registry = { ...toy, entries: [{ kind: 'copy', source: 'Juguete', version: 'v1.0.0', paths: ['a', 'b'], kit: ['skills/sdd-c/'], pending: '0296' }] };
    expect(classify(pending, ['skills/sdd-c/SKILL.md', 'skills/sdd-c/references/x.md'])).toEqual([]);
    const overlap: Registry = { ...toy, entries: [...toy.entries, { kind: 'copy', source: 'Otra', version: 'v1.0.0', paths: ['a', 'b'], kit: ['skills/sdd-a/'], pending: '0297' }] };
    expect(classify(overlap, files)).toEqual([]);
    const pendingFile: Registry = { ...toy, entries: [{ kind: 'copy', source: 'Juguete', version: 'v1.0.0', paths: ['a'], kit: ['skills/sdd-b/SKILL.md'], pending: '0312' }] };
    expect(classify(pendingFile, ['skills/sdd-b/SKILL.md'])).toEqual(['skills/sdd-b/SKILL.md no está clasificado en upstream.json: ponlo en una entrada copy o en own']);
  });

  it('rejects a concept with pending or from', () => {
    const concept = toy.entries[2];
    for (const extra of [{ pending: '0312' }, { from: [{ source: 'Otra', version: 'v1.0.0', path: 'x.md' }] }])
      expect(() => validateRegistry({ ...toy, entries: [{ ...concept, ...extra }] })).toThrow('upstream.json: la entrada 1 es un concepto con pending o from; esos campos son de una copia');
  });

  it('every file of skills/ is a copy or own', async () => {
    const files = (await listSources(repoRoot)).filter((path) => path.startsWith('skills/'));
    expect(classify(readRegistry(join(repoRoot, 'upstream.json')), files)).toEqual([]);
  });

  it('rejects a copy without pending with more than one file', () => {
    const grouped = { ...toy, entries: [{ ...toy.entries[0], kit: ['skills/sdd-a/'], paths: ['a', 'b'] }] };
    expect(() => validateRegistry(grouped)).toThrow('upstream.json: la entrada 1 es una copia sin pending con más de un fichero; una copia anotada va fichero a fichero');
    expect(() => validateRegistry({ ...grouped, entries: [{ ...grouped.entries[0], pending: '0312' }] })).not.toThrow();
  });

  it('every skill that says see NOTICE has one', async () => {
    const files = (await listSources(repoRoot)).filter((path) => /^skills\/[^/]+\/.+\.md$/.test(path));
    expect(seeNoticeWithout(repoRoot, files)).toEqual([]);
    const root = mkdtempSync(join(tmpdir(), 'see-notice-'));
    try {
      for (const [path, text] of [['skills/a/SKILL.md', 'Adapted (MIT, see `NOTICE`).'], ['skills/b/SKILL.md', 'Adapted (MIT, see NOTICE).'], ['skills/c/SKILL.md', 'see `NOTICE`'], ['skills/c/NOTICE', 'x']]) {
        mkdirSync(join(root, path, '..'), { recursive: true });
        writeFileSync(join(root, path), text);
      }
      expect(seeNoticeWithout(root, ['skills/a/SKILL.md', 'skills/b/SKILL.md', 'skills/c/SKILL.md'])).toEqual([
        'skills/a/SKILL.md dice see NOTICE, y la skill no tiene NOTICE: una skill sin copias no lo genera',
        'skills/b/SKILL.md dice see NOTICE, y la skill no tiene NOTICE: una skill sin copias no lo genera',
      ]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('every skill text is free of source versions', async () => {
    const registry = readRegistry(join(repoRoot, 'upstream.json'));
    const files = (await listSources(repoRoot)).filter((path) => /^skills\/.+\.md$/.test(path));
    expect(versionsInText(repoRoot, files, registry)).toEqual([]);
    const root = mkdtempSync(join(tmpdir(), 'source-version-'));
    try {
      const texts: [string, string][] = [
        ['skills/a/SKILL.md', 'Forked from x of superpowers 7.0.0 (MIT)'],
        ['skills/b/SKILL.md', 'from `wondelai/skills` 1.8.0'],
        ['skills/c/SKILL.md', '<!-- kit: 0312 · sustituye: «superpowers 7.0.0» -->'],
        ['skills/sdd-upgrade/references/migrations/v2.0.0.md', 'superpowers 7.0.0'],
      ];
      for (const [path, text] of texts) {
        mkdirSync(join(root, path, '..'), { recursive: true });
        writeFileSync(join(root, path), text);
      }
      expect(versionsInText(root, texts.map(([path]) => path), registry)).toEqual([
        'skills/a/SKILL.md:1: la versión de una fuente vive en upstream.json, no en el texto: «superpowers 7.0.0»',
        'skills/b/SKILL.md:1: la versión de una fuente vive en upstream.json, no en el texto: «`wondelai/skills` 1.8.0»',
      ]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('rejects an entry with an unknown kind or source', () => {
    expect(() => validateRegistry({ ...toy, entries: [{ ...toy.entries[0], kind: 'copia' as 'copy' }] })).toThrow('upstream.json: la entrada 1 tiene kind «copia»; vale copy o concept');
    expect(() => validateRegistry({ ...toy, entries: [{ ...toy.entries[0], source: 'Ninguna' }] })).toThrow('upstream.json: la entrada 1 nombra la fuente «Ninguna», que no está en sources');
  });

  it('fails when THIRD_PARTY_NOTICES.md has no sources section', () => {
    const root = mkdtempSync(join(tmpdir(), 'notices-'));
    try {
      writeFileSync(join(root, 'THIRD_PARTY_NOTICES.md'), '# Avisos de terceros\n');
      expect(() => noticeFiles(toy, root)).toThrow('THIRD_PARTY_NOTICES.md no tiene la sección «## Fuentes»');
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('every kit path of upstream.json exists', () => {
    const missing = readRegistry(join(repoRoot, 'upstream.json')).entries.flatMap((entry) => entry.kit).filter((path) => !existsSync(join(repoRoot, path)));
    expect(missing).toEqual([]);
  });

  it('has no NOTICE outside the registry', () => {
    const generated = [...noticeFiles(readRegistry(join(repoRoot, 'upstream.json')), repoRoot).keys()].filter((path) => path.endsWith('/NOTICE'));
    const onDisk = readdirSync(join(repoRoot, 'skills'))
      .map((name) => `skills/${name}/NOTICE`)
      .filter((path) => existsSync(join(repoRoot, path)));
    expect(onDisk.sort()).toEqual(generated.sort());
  });
});
