import { describe, it, expect } from 'vitest';
import { renumberLines } from '../../src/ids/renumber.ts';

const change = { from: '0203', to: '0205' };
const none = new Set<string>();

describe('renumberLines', () => {
  it('rewrites the row id', () => {
    expect(renumberLines(['| 0203 | — | **X** | ⏳ | 0197 | L |'], change, none)).toEqual(['| 0205 | — | **X** | ⏳ | 0197 | L |']);
  });

  it('rewrites the dated row id', () => {
    expect(renumberLines(['| 2026-10-01 | 0203 | Patch x |'], change, none)).toEqual(['| 2026-10-01 | 0205 | Patch x |']);
  });

  it('rewrites tras, parent and Tras', () => {
    const line = '| 0204 | — | **Otra** tras 0203, `parent: 0203` | ⏳ | 0203 | M |';
    expect(renumberLines([line], change, none)).toEqual(['| 0204 | — | **Otra** tras 0205, `parent: 0205` | ⏳ | 0205 | M |']);
  });

  it('rewrites one id inside a Tras list', () => {
    expect(renumberLines(['| 0204 | — | **Otra** | ⏳ | 0197, 0203 | M |'], change, none)).toEqual(['| 0204 | — | **Otra** | ⏳ | 0197, 0205 | M |']);
  });

  it('rewrites Actuar and the debt Destino', () => {
    const lines = ['| Lento | bajo | **Actuar → 0203** (2026-10-20) |', '| x | y | bajo | z | 0203 |', '| a | b | **Actuar**: 0203 |'];
    expect(renumberLines(lines, change, none)).toEqual(['| Lento | bajo | **Actuar → 0205** (2026-10-20) |', '| x | y | bajo | z | 0205 |', '| a | b | **Actuar**: 0205 |']);
  });

  it('keeps prose and remote lines', () => {
    const prose = '| 0204 | — | **Otra**: en la 0203 se vio el fallo | ⏳ | — | M |';
    const remote = '| 0203 | — | **La del otro** | ⏳ | — | S |';
    expect(renumberLines([prose, remote], change, new Set([remote]))).toEqual([prose, remote]);
  });

  it('rewrites artifact paths', () => {
    const line = '| 0203 | **Ids** — `proposal: 0203`, ver `specs/20261020-090000-proposal-0203-ids/proposal.md` | ⏳ |';
    expect(renumberLines([line], change, none)).toEqual(['| 0205 | **Ids** — `proposal: 0203`, ver `specs/20261020-090000-proposal-0205-ids/proposal.md` | ⏳ |']);
  });

  it('does not touch a longer number', () => {
    expect(renumberLines(['| 02030 | x |', 'tras 20203'], change, none)).toEqual(['| 02030 | x |', 'tras 20203']);
  });
});
