import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { repoRoot } from './kit-files.ts';

const claude = spawnSync(process.platform === 'win32' ? 'where' : 'which', ['claude'], { encoding: 'utf8', windowsHide: true })
  .stdout?.split(/\r?\n/)
  .find(Boolean);

// Instalado con npm en Windows, claude es un .cmd, que solo arranca a través del shell.
function runClaude(args: string[]): string {
  const viaShell = /\.(cmd|bat)$/i.test(claude ?? '');
  const quoted = viaShell ? args.map((arg) => `"${arg}"`) : args;
  return spawnSync(viaShell ? `"${claude}"` : (claude ?? 'claude'), quoted, { encoding: 'utf8', windowsHide: true, shell: viaShell }).stdout;
}

function validate(target: string, strict: boolean): { success: boolean } {
  const stdout = runClaude(['plugin', 'validate', join(repoRoot, target), '--json', ...(strict ? ['--strict'] : [])]);
  try {
    return JSON.parse(stdout);
  } catch {
    throw new Error(`claude plugin validate no devolvió JSON para '${target}':\n${stdout}`);
  }
}

describe.skipIf(!claude)('claude plugin validate', () => {
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
