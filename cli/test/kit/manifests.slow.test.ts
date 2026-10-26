import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { repoRoot } from './kit-files.ts';

const hasClaude = !spawnSync('claude', ['--version'], { windowsHide: true }).error;

function validate(target: string, strict: boolean): { success: boolean } {
  const args = ['plugin', 'validate', join(repoRoot, target), '--json', ...(strict ? ['--strict'] : [])];
  const { stdout } = spawnSync('claude', args, { encoding: 'utf8', windowsHide: true });
  try {
    return JSON.parse(stdout);
  } catch {
    throw new Error(`claude plugin validate no devolvió JSON para '${target}':\n${stdout}`);
  }
}

describe.skipIf(!hasClaude)('claude plugin validate', () => {
  it('acepta la carpeta skills/ en modo strict', () => {
    expect(validate('skills', true).success).toBe(true);
  });

  it('acepta marketplace.json en modo strict', () => {
    expect(validate('.claude-plugin/marketplace.json', true).success).toBe(true);
  });

  // Sin strict: el aviso por el CLAUDE.md de la raíz es inherente al repo.
  it('acepta plugin.json', () => {
    expect(validate('.claude-plugin/plugin.json', false).success).toBe(true);
  });
});
