import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { INIT_SETTINGS } from '../../src/init/settings.ts';

const readme = readFileSync(fileURLToPath(new URL('../../../README.md', import.meta.url)), 'utf8');

describe('README', () => {
  it('README settings block equals INIT_SETTINGS', () => {
    const block = /<!-- sdd-init: settings -->\r?\n+```json\r?\n([\s\S]*?)```/.exec(readme);
    expect(block).not.toBeNull();
    expect(JSON.parse(block![1])).toEqual(INIT_SETTINGS);
  });
});
