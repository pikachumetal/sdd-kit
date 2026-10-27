import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { repoRoot } from './kit-files.ts';

// En Windows, `where` lista antes el shim sin extensión que deja npm, que no arranca fuera de bash.
function pickExecutable(lines: string[], platform: string): string | undefined {
  return lines.find((line) => line !== '' && (platform !== 'win32' || /\.(exe|cmd|bat)$/i.test(line)));
}

const claude = pickExecutable(
  spawnSync(process.platform === 'win32' ? 'where' : 'which', ['claude'], { encoding: 'utf8', windowsHide: true }).stdout?.split(/\r?\n/) ?? [],
  process.platform,
);

// Instalado con npm en Windows, claude es un .cmd, que solo arranca a través del shell.
function runClaude(args: string[]): string {
  if (!/\.(cmd|bat)$/i.test(claude ?? '')) return spawnSync(claude ?? 'claude', args, { encoding: 'utf8', windowsHide: true }).stdout;
  const command = [claude, ...args].map((part) => `"${part}"`).join(' ');
  return spawnSync(command, { encoding: 'utf8', windowsHide: true, shell: true }).stdout;
}

describe('ejecutable de claude', () => {
  it('en Windows salta el shim sin extensión y elige el .cmd', () => {
    expect(pickExecutable(['C:\\npm\\claude', 'C:\\npm\\claude.cmd', ''], 'win32')).toBe('C:\\npm\\claude.cmd');
    expect(pickExecutable(['/usr/local/bin/claude', ''], 'linux')).toBe('/usr/local/bin/claude');
  });
});

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
