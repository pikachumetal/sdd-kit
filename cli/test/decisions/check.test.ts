import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { SECTIONS, adr, docsWith, emptyDocs, sdd } from './helpers.ts';

const template = readFileSync(new URL('../../../skills/sdd-templates/templates/adr-template.md', import.meta.url), 'utf8');
const check = (docs: string) => sdd(['decision', 'check', '--path', docs]);
const notStatus = (value: string) =>
  `0001-use-postgres.md: status «${value}» no es proposed, accepted, rejected, deprecated ni superseded by NNNN`;

describe('sdd decision check', () => {
  it('una ADR con la forma de la plantilla es válida', async () => {
    expect(await check(docsWith({ '0001-use-postgres.md': adr() }))).toEqual({ lines: ['Decisiones válidas'], code: 0 });
  });

  it.each([['aceptada'], ['superseded by 12']])('status %s no es válido', async (status) => {
    expect(await check(docsWith({ '0001-use-postgres.md': adr({ status }) }))).toEqual({ lines: [notStatus(status)], code: 1 });
  });

  it('superseded by una ADR que no existe falla', async () => {
    const result = await check(docsWith({ '0001-use-postgres.md': adr({ status: 'superseded by 0009' }) }));
    expect(result).toEqual({ lines: ['0001-use-postgres.md: sustituida por 0009, que no existe'], code: 1 });
  });

  it('date fuera de AAAA-MM-DD falla', async () => {
    const result = await check(docsWith({ '0001-use-postgres.md': adr({ date: '8/10/2026' }) }));
    expect(result).toEqual({ lines: ['0001-use-postgres.md: date «8/10/2026» no es AAAA-MM-DD'], code: 1 });
  });

  it.each([[null], ['rutas: []'], ['rutas:']])('sin rutas falla (%s)', async (rutas) => {
    const result = await check(docsWith({ '0001-use-postgres.md': adr({ rutas }) }));
    expect(result).toEqual({ lines: ['0001-use-postgres.md: falta rutas'], code: 1 });
  });

  it.each([['src/{a,b}/**'], ['src/?.ts'], ['!src/**'], ['src/[ab].ts']])('glob no soportado %s', async (glob) => {
    const result = await check(docsWith({ '0001-use-postgres.md': adr({ rutas: `rutas:\n  - ${glob}` }) }));
    expect(result).toEqual({ lines: [`0001-use-postgres.md: glob no soportado «${glob}»`], code: 1 });
  });

  it('check rechaza ./ al principio del glob', async () => {
    const result = await check(docsWith({ '0001-use-postgres.md': adr({ rutas: 'rutas: ["./src/**"]' }) }));
    expect(result).toEqual({ lines: ['0001-use-postgres.md: glob no soportado «./src/**»'], code: 1 });
  });

  it('rutas en línea, con comillas o sin ellas, es válida', async () => {
    const docs = docsWith({ '0001-use-postgres.md': adr({ rutas: `rutas: [src/db/**, "**/*.sql", '*.ts']` }) });
    expect(await check(docs)).toEqual({ lines: ['Decisiones válidas'], code: 0 });
  });

  it('rutas en bloque sin sangría es válida', async () => {
    const docs = docsWith({ '0001-use-postgres.md': adr({ rutas: 'rutas:\n- src/db/**' }) });
    expect(await check(docs)).toEqual({ lines: ['Decisiones válidas'], code: 0 });
  });

  it('falta una sección o va fuera de orden', async () => {
    const missing = await check(docsWith({ '0001-use-postgres.md': adr({ sections: SECTIONS.slice(0, 4) }) }));
    expect(missing.code).toBe(1);
    expect(missing.lines.join('\n')).toContain('### Confirmación');
    const swapped = [SECTIONS[0]!, SECTIONS[2]!, SECTIONS[1]!, SECTIONS[3]!, SECTIONS[4]!];
    const disordered = await check(docsWith({ '0001-use-postgres.md': adr({ sections: swapped }) }));
    expect(disordered.code).toBe(1);
    expect(disordered.lines.join('\n')).toContain('## Opciones consideradas');
  });

  it('un nombre sin NNNN- falla', async () => {
    const result = await check(docsWith({ 'use-postgres.md': adr() }));
    expect(result).toEqual({ lines: ['use-postgres.md: el nombre no es NNNN-<slug>.md'], code: 1 });
  });

  it('un número repetido falla', async () => {
    const result = await check(docsWith({ '0001-use-postgres.md': adr(), '0001-mysql.md': adr() }));
    expect(result).toEqual({ lines: ['número 0001 repetido: 0001-mysql.md, 0001-use-postgres.md'], code: 1 });
  });

  it('un fichero que no es .md no se lee; sin ADR dice Sin decisiones', async () => {
    expect(await check(docsWith({ 'notas.txt': 'x' }))).toEqual({ lines: ['Sin decisiones'], code: 0 });
    expect(await check(emptyDocs())).toEqual({ lines: ['Sin decisiones'], code: 0 });
  });

  it('check acepta CRLF y BOM', async () => {
    const windows = `﻿${adr().replace(/\n/g, '\r\n')}`;
    expect(await check(docsWith({ '0001-use-postgres.md': windows }))).toEqual({ lines: ['Decisiones válidas'], code: 0 });
  });

  it('adr-template.md calcada y rellenada pasa', async () => {
    const filled = template
      .replace('<AAAA-MM-DD>', '2026-10-08')
      .replace('<glob, p. ej. src/db/**>', 'src/db/**')
      .replace(/<[^>\n]+>/g, 'Texto');
    expect(await check(docsWith({ '0001-use-postgres.md': filled }))).toEqual({ lines: ['Decisiones válidas'], code: 0 });
  });

  it('adr-template.md sin rellenar falla solo por date', async () => {
    const result = await check(docsWith({ '0001-use-postgres.md': template }));
    expect(result).toEqual({ lines: ['0001-use-postgres.md: date «<AAAA-MM-DD>» no es AAAA-MM-DD'], code: 1 });
  });
});
