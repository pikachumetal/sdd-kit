import { describe, it, expect } from 'vitest';
import { adr, docsWith, sdd } from './helpers.ts';

const files = {
  '0001-use-postgres.md': adr({ title: 'Usar Postgres', rutas: 'rutas:\n  - src/db/**' }),
  '0002-node-scripts.md': adr({ title: 'Scripts en Node', rutas: 'rutas:\n  - skills/**/scripts/**' }),
  '0003-mysql.md': adr({ title: 'Usar MySQL', status: 'superseded by 0001', rutas: 'rutas:\n  - src/db/**' }),
  '0004-cache.md': adr({ title: 'Caché en memoria', status: 'proposed', rutas: 'rutas:\n  - src/db/cache.ts' }),
  '0005-orm.md': adr({ title: 'Usar un ORM', status: 'rejected', rutas: 'rutas:\n  - src/db/**' }),
  '0006-old.md': adr({ title: 'Vieja', status: 'deprecated', rutas: 'rutas:\n  - src/db/**' }),
};
const line = (number: string, title: string, status: string, file: string) =>
  `- \`${number}\` — ${title} (${status}) · \`.docs/sdd/decisions/${file}\``;
const index = (docs: string, ...extra: string[]) => sdd(['decision', 'index', '--path', docs, ...extra]);

describe('sdd decision index', () => {
  it('con --files da las vigentes y propuestas que casan, por número', async () => {
    const result = await index(docsWith(files), '--files', 'src/db/cache.ts', '--files', 'README.md');
    expect(result).toEqual({
      lines: [line('0001', 'Usar Postgres', 'accepted', '0001-use-postgres.md'), line('0004', 'Caché en memoria', 'proposed', '0004-cache.md')],
      code: 0,
    });
  });

  it('con barras de Windows casa igual; sin coincidencias no escribe nada', async () => {
    const docs = docsWith(files);
    const windows = await index(docs, '--files', 'skills\\x\\scripts\\run.ts');
    expect(windows.lines).toEqual([line('0002', 'Scripts en Node', 'accepted', '0002-node-scripts.md')]);
    expect(await index(docs, '--files', 'README.md')).toEqual({ lines: [], code: 0 });
  });

  it('sin --files lista todas con su status', async () => {
    const result = await index(docsWith(files));
    expect(result.lines).toHaveLength(6);
    expect(result.lines[2]).toBe(line('0003', 'Usar MySQL', 'superseded by 0001', '0003-mysql.md'));
  });

  it('sin título sale (sin título); con la forma rota sale igual', async () => {
    const docs = docsWith({ '0001-a.md': adr({ title: null }), '0002-b.md': adr({ title: 'Rota', date: 'ayer' }) });
    const result = await index(docs);
    expect(result.lines).toEqual([line('0001', '(sin título)', 'accepted', '0001-a.md'), line('0002', 'Rota', 'accepted', '0002-b.md')]);
  });
});
