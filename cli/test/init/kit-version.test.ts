import { describe, it, expect } from 'vitest';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { kitVersion } from '../../src/init/verbs.ts';

describe('kitVersion', () => {
  it('reads a plugin.json with BOM', () => {
    const dir = mkdtempSync(join(tmpdir(), 'sdd-kit-version-'));
    try {
      const file = join(dir, 'plugin.json');
      writeFileSync(file, '﻿{"version": "3.0.0"}', 'utf8');
      expect(kitVersion(file)).toBe('3.0.0');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
