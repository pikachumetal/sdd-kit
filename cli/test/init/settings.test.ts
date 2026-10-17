import { describe, it, expect } from 'vitest';
import { INIT_SETTINGS, mergeSettings } from '../../src/init/settings.ts';

describe('mergeSettings', () => {
  it('adds the whole block to an empty file', () => {
    expect(mergeSettings(null, false)).toEqual({ merged: INIT_SETTINGS, notes: [] });
  });

  it('keeps other keys', () => {
    const { merged } = mergeSettings({ permissions: { allow: ['Bash(npm test)'] } }, false);
    expect(merged.permissions).toEqual({ allow: ['Bash(npm test)'] });
    expect(merged.autoMemoryEnabled).toBe(false);
  });

  it('leaves a different leaf and notes it', () => {
    const current = { extraKnownMarketplaces: { 'sdd-kit': { source: { source: 'github', repo: 'otro/fork' } } } };
    const { merged, notes } = mergeSettings(current, false);
    expect(merged.extraKnownMarketplaces['sdd-kit'].source.repo).toBe('otro/fork');
    expect(merged.extraKnownMarketplaces['sdd-kit'].autoUpdate).toBe(true);
    expect(notes).toEqual(['extraKnownMarketplaces.sdd-kit.source.repo: se deja "otro/fork"']);
  });

  it('notes autoUpdate false and plugin false', () => {
    const current = {
      extraKnownMarketplaces: { 'superpowers-marketplace': { autoUpdate: false } },
      enabledPlugins: { 'sdd-kit@sdd-kit': false },
    };
    const { notes } = mergeSettings(current, false);
    expect(notes).toEqual([
      'extraKnownMarketplaces.superpowers-marketplace.autoUpdate: se deja false',
      'enabledPlugins.sdd-kit@sdd-kit: se deja false',
    ]);
  });

  it('asks before turning memory off', () => {
    const { merged, notes } = mergeSettings({ autoMemoryEnabled: true }, false);
    expect(merged.autoMemoryEnabled).toBe(true);
    expect(notes).toEqual(['autoMemoryEnabled: se deja true; pregunta al usuario si lo cambia']);
  });

  it('memory-off turns it false', () => {
    const { merged, notes } = mergeSettings({ autoMemoryEnabled: true }, true);
    expect(merged.autoMemoryEnabled).toBe(false);
    expect(notes).toEqual([]);
  });

  it('rejects a non-object node', () => {
    expect(() => mergeSettings({ enabledPlugins: [] }, false)).toThrow(
      '.claude/settings.json no se puede fusionar: enabledPlugins no es un objeto',
    );
  });
});
