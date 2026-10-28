import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { readText } from './kit-files.ts';
import { run } from './process.ts';

// El bloque bash del Step 2 («Project Setup») de sdd-worktrees, tal cual lo lee el agente (patch 0253).
const setupBlock = /^## Step 2: Project Setup\n[\s\S]*?^```bash\n([\s\S]*?)^```/m.exec(readText('skills/sdd-worktrees/SKILL.md').replace(/\r\n/g, '\n'))![1];

// En Windows, `bash` del PATH puede ser el de WSL: se usa el de Git, junto a `git --exec-path`.
const bash = process.platform === 'win32' ? join(dirname(dirname(dirname(run('git', ['--exec-path']).output))), 'bin', 'bash.exe') : 'bash';

// Los gestores son funciones que imprimen su llamada: ganan al PATH y no instalan nada.
const stubs = ['npm', 'pnpm', 'yarn'].map((name) => `${name}() { echo "${name} $*"; }`).join('\n');

function setupCommands(files: string[]): string {
  const dir = mkdtempSync(join(tmpdir(), 'sdd-setup-'));
  for (const file of files) writeFileSync(join(dir, file), '{}\n');
  return run(bash, ['-c', `${stubs}\n${setupBlock}`], { cwd: dir }).output;
}

describe('sdd-worktrees, Step 2: el gestor de Node sale del lockfile', () => {
  it.each([
    [['package.json', 'pnpm-lock.yaml'], 'pnpm install --frozen-lockfile'],
    [['package.json', 'yarn.lock'], 'yarn install --frozen-lockfile'],
    [['package.json', 'package-lock.json'], 'npm ci'],
    [['package.json'], 'npm install'],
  ])('%j → %s', (files, command) => {
    expect(setupCommands(files)).toBe(command);
  });
});
