import { spawn } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterEach, beforeEach, expect, it } from 'vitest';
import { isAlive, killProcess } from '../../../../tests/headless/lib.mjs';
import { cleanGitEnv, kitRoot } from '../process.ts';

const realDeps = pathToFileURL(join(kitRoot, 'tests', 'headless', 'real-deps.mjs')).href;
mkdirSync(join(kitRoot, '.temp'), { recursive: true });
let root = '';
let pidFile = '';

beforeEach(() => {
  root = mkdtempSync(join(kitRoot, '.temp', 'l'));
  pidFile = join(root, 'grandchild.pid');
});

afterEach(() => {
  try {
    const pid = Number(readFileSync(pidFile, 'utf8'));
    if (isAlive(pid)) killProcess(pid);
  } catch {
    // Sin nieto que parar.
  }
  rmSync(root, { recursive: true, force: true });
});

// Un sujeto que deja un nieto con su salida heredada y sale, como el `find /` que dejó un bash en la feature 0311:
// desacoplado, porque un hijo de node sin detached muere con su padre en Windows (job object de libuv).
const LEAVES_GRANDCHILD = `import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
const child = spawn(process.execPath, ['-e', 'setTimeout(() => {}, 120000)'], { stdio: 'inherit', detached: true });
writeFileSync(${JSON.stringify(pidFile)}, String(child.pid));
child.unref();
process.exit(0);
`;

// Un sujeto que escribe más que el búfer del pipe y sale en cuanto el write acaba.
const WRITES_TAIL = `process.stdout.write('x'.repeat(65536) + '\\nFIN\\n', () => process.exit(0));\n`;

// La tanda: lanza el sujeto con launch de real-deps.mjs y espera su salida, como run.mjs.
function batchScript(subject: string): string {
  return `import { realDeps } from ${JSON.stringify(realDeps)};
const { exited } = realDeps().launch({ subjectSh: ${JSON.stringify(subject)}, args: [], env: process.env });
process.exitCode = await exited;
`;
}

function writeSubject(name: string, content: string): string {
  const path = join(root, name);
  writeFileSync(path, content);
  return path;
}

// La salida de la tanda va por un pipe, como cuando la lanza sdd watch command o un script del hilo.
function runBatch(subject: string): Promise<{ closedBefore: boolean; stdout: string }> {
  const batch = writeSubject('batch.mjs', batchScript(subject));
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [batch], { env: cleanGitEnv, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });
    let stdout = '';
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => process.stderr.write(chunk));
    const timer = setTimeout(() => resolve({ closedBefore: false, stdout }), 60_000);
    child.on('close', () => { clearTimeout(timer); resolve({ closedBefore: true, stdout }); });
  });
}

it('la tanda termina con un nieto que hereda la salida', { timeout: 90_000 }, async () => {
  const { closedBefore } = await runBatch(writeSubject('leaves.mjs', LEAVES_GRANDCHILD));
  expect(closedBefore).toBe(true);
});

it('reenvía la cola entera del sujeto', { timeout: 90_000 }, async () => {
  const { closedBefore, stdout } = await runBatch(writeSubject('tail.mjs', WRITES_TAIL));
  expect(closedBefore).toBe(true);
  expect(stdout.endsWith('FIN\n')).toBe(true);
});
