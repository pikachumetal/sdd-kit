import { describe, it, expect } from 'vitest';
import { finishMarker, mergeConfig, recordApproved } from '../../src/init/marker.ts';

describe('recordApproved', () => {
  it('approved deduplicates', () => {
    const once = recordApproved({}, 'PRODUCT.md');
    expect(recordApproved(once, 'PRODUCT.md')).toEqual({ init: { approved: ['PRODUCT.md'] } });
  });

  it('approved normalizes separators', () => {
    const marker = recordApproved({ init: { approved: ['.docs/sdd/steering/constitution.md'] } }, '.docs\\sdd\\steering\\constitution.md');
    expect(marker).toEqual({ init: { approved: ['.docs/sdd/steering/constitution.md'] } });
  });
});

describe('mergeConfig', () => {
  it('config ignores version channel updated init', () => {
    const { marker, notes } = mergeConfig({ init: { approved: [] } }, { ids: { mode: 'sequence' }, version: '9.9.9', channel: 'cli', updated: 'x', init: {} });
    expect(marker).toEqual({ init: { approved: [], config: { ids: { mode: 'sequence' } } } });
    expect(notes).toEqual([
      'version: la fija sdd init, se ignora',
      'channel: la fija sdd init, se ignora',
      'updated: la fija sdd init, se ignora',
      'init: la fija sdd init, se ignora',
    ]);
  });

  it('config deep-merges into init.config, the new leaf wins', () => {
    const start = { init: { config: { control: { profile: 'pair', maxParallelAgents: 3 } } } };
    const { marker } = mergeConfig(start, { control: { profile: 'delegate' } });
    expect(marker).toEqual({ init: { config: { control: { profile: 'delegate', maxParallelAgents: 3 } } } });
  });

  it('config merges at root without init', () => {
    const { marker } = mergeConfig({ version: '1.1.0' }, { ids: { mode: 'tracker' } });
    expect(marker).toEqual({ version: '1.1.0', ids: { mode: 'tracker' } });
  });
});

describe('finishMarker', () => {
  it('finish lifts config and removes init', () => {
    const marker = { init: { approved: ['PRODUCT.md'], config: { ids: { mode: 'sequence' } } } };
    expect(finishMarker(marker, '3.0.0', '2026-10-17')).toEqual({ version: '3.0.0', channel: 'plugin', updated: '2026-10-17', ids: { mode: 'sequence' } });
  });

  it('finish keeps an existing version', () => {
    expect(finishMarker({ version: '1.1.0', init: { approved: [] } }, '3.0.0', '2026-10-17').version).toBe('1.1.0');
  });

  it('finish keeps updated when nothing else changes', () => {
    const done = { version: '3.0.0', channel: 'plugin', updated: '2026-10-01', ids: { mode: 'sequence' } };
    expect(finishMarker(done, '3.0.0', '2026-10-17')).toEqual(done);
  });
});
