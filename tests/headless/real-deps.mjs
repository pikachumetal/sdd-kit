// Las dependencias reales de campaign.mjs, que comparten run.mjs y battery.mjs run.
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { withLock } from '../../cli/src/git/lock.ts';

const LOCK_TIMEOUT_MINUTES = 120;

export const nodeFs = {
  exists: existsSync,
  read: (path) => readFileSync(path, 'utf8'),
  write: (path, text) => {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, text);
  },
  remove: (path) => rmSync(path, { recursive: true, force: true }),
  list: (dir) => (existsSync(dir) ? readdirSync(dir).sort() : []),
  mkdir: (dir) => mkdirSync(dir, { recursive: true }),
};

function isAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return error.code === 'EPERM';
  }
}

// En Windows, el bash del PATH suele ser el lanzador de WSL, que no ejecuta scripts sin distro: se prefiere Git Bash.
// ponytail: los subject.sh siguen en bash; esta búsqueda se va cuando pasen a Node.
function gitBash() {
  const installed = [process.env.ProgramFiles, process.env['ProgramFiles(x86)']]
    .filter(Boolean)
    .map((root) => join(root, 'Git', 'bin', 'bash.exe'))
    .find((path) => existsSync(path));
  if (installed) return installed;
  const where = spawnSync('where', ['bash'], { encoding: 'utf8', windowsHide: true }).stdout ?? '';
  return where.split(/\r?\n/).find((path) => path !== '' && !/System32/i.test(path)) ?? 'bash';
}

function launch({ subjectSh, args, env }) {
  const command = subjectSh.endsWith('.mjs') ? process.execPath : gitBash();
  const child = spawn(command, [subjectSh, ...args], { env, stdio: 'inherit', windowsHide: true });
  const exited = new Promise((resolve) => {
    child.on('exit', (code) => resolve(code ?? 1));
    child.on('error', () => resolve(1));
  });
  return { pid: child.pid, exited };
}

export function realDeps() {
  const io = { out: (line) => console.log(line), err: (line) => console.error(line), json: (value) => console.log(JSON.stringify(value)) };
  return {
    fs: nodeFs,
    log: io.out,
    wait: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
    isAlive,
    lock: (path, body) => withLock({ path, label: 'lanzamiento de sujetos', io, owner: { branch: '', worktree: dirname(path) } }, LOCK_TIMEOUT_MINUTES, body),
    launch,
    cleanup: async () => undefined,
  };
}
