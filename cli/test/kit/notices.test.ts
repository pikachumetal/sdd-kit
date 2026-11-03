import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { noticeFiles, readRegistry, renderNotice, renderSourcesTable, type Registry } from '../../../build/sources.ts';
import { repoRoot } from './kit-files.ts';

const toy: Registry = {
  sources: {
    Juguete: { repo: 'acme/juguete', tagPrefix: 'v', license: 'MIT', copyright: 'Copyright (c) 2026 Acme' },
    Apache: { repo: 'acme/apache', tagPrefix: 'v', license: 'Apache-2.0', copyright: '' },
  },
  entries: [
    { kind: 'copy', source: 'Juguete', version: 'v1.2.0', paths: ['skills/a/SKILL.md', 'skills/a/ref.md'], kit: ['skills/sdd-a/'] },
    { kind: 'concept', source: 'Apache', version: 'v3.0.0', paths: ['docs/b.md'], kit: ['skills/sdd-b/'], note: 'Solo la idea.' },
  ],
};

describe('avisos de terceros desde upstream.json', () => {
  it('renders a notice per copy entry with its license text', () => {
    const notice = renderNotice(toy, 'skills/sdd-a') ?? '';
    expect(notice).toContain('https://github.com/acme/juguete, version v1.2.0 (skills/a/SKILL.md, skills/a/ref.md)');
    expect(notice).toContain('MIT License\n\nCopyright (c) 2026 Acme\n\nPermission is hereby granted, free of charge');
    expect(notice).toContain('OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n');
  });

  it('has no notice for a skill with only concepts', () => {
    expect(renderNotice(toy, 'skills/sdd-b')).toBeNull();
  });

  it('fails on a copy with a license without template', () => {
    const apacheCopy: Registry = { ...toy, entries: [{ ...toy.entries[1], kind: 'copy' }] };
    expect(() => renderNotice(apacheCopy, 'skills/sdd-b')).toThrow('Apache: licencia Apache-2.0 sin plantilla en build/notices.ts');
  });

  it('renders the sources table in registry order', () => {
    expect(renderSourcesTable(toy).split('\n')).toEqual([
      '## Fuentes',
      '',
      '| Fichero del kit | Fuente | Tipo | Versión | Rutas de la fuente | Licencia | Nota |',
      '| --- | --- | --- | --- | --- | --- | --- |',
      '| `skills/sdd-a/` | [Juguete](https://github.com/acme/juguete) | copia | `v1.2.0` | `skills/a/SKILL.md`, `skills/a/ref.md` | MIT, Copyright (c) 2026 Acme | |',
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
});
