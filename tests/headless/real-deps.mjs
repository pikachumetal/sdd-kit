// Las dependencias reales de campaign.mjs, que comparten run.mjs y battery.mjs run.
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { withLock } from '../../cli/src/git/lock.ts';
import { stopCampaign } from './campaign.mjs';

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

const running = new Set();

function launch({ subjectSh, args, env }) {
  const child = spawn(process.execPath, [subjectSh, ...args], { env, stdio: 'inherit', windowsHide: true });
  running.add(child.pid);
  const exited = new Promise((resolve) => {
    child.on('exit', (code) => resolve(code ?? 1));
    child.on('error', () => resolve(1));
  }).finally(() => running.delete(child.pid));
  return { pid: child.pid, exited };
}

// Una línea por proceso, «<pid>\t<línea de órdenes>»: ConvertTo-Json deja sin escapar algún carácter de control
// de las líneas de órdenes de otros programas, y el JSON no se puede leer.
const PROCESS_QUERY = "Get-CimInstance Win32_Process | ForEach-Object { \"$($_.ProcessId)`t$($_.CommandLine -replace '[\\x00-\\x1f]', ' ')\" }";

// Fuera de Windows (el CI corre esta suite en Linux), ps da lo mismo: «<pid> <línea de órdenes>».
const windows = process.platform === 'win32';
const [PROCESS_COMMAND, PROCESS_ARGS, SEPARATOR] = windows
  ? ['pwsh', ['-NoProfile', '-Command', PROCESS_QUERY], '\t']
  : ['ps', ['-eo', 'pid=,args='], ' '];

async function processes() {
  const result = spawnSync(PROCESS_COMMAND, PROCESS_ARGS, { encoding: 'utf8', windowsHide: true, maxBuffer: 64 * 1024 * 1024 });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${PROCESS_COMMAND} salió con ${result.status}: ${(result.stderr ?? '').trim()}`);
  return result.stdout.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).map((line) => {
    const at = line.indexOf(SEPARATOR);
    return { pid: Number(line.slice(0, at)), commandLine: line.slice(at + 1) };
  });
}

// taskkill /T se lleva el árbol; un proceso que ya no existe no es un error. Fuera de Windows, solo ese PID.
function kill(pid, tree) {
  if (!windows) {
    try {
      process.kill(pid, 'SIGKILL');
    } catch {
      // Ya había salido.
    }
    return;
  }
  spawnSync('taskkill', [...(tree ? ['/T'] : []), '/F', '/PID', String(pid)], { stdio: 'ignore', windowsHide: true });
}

export function realDeps() {
  const io = { out: (line) => console.log(line), err: (line) => console.error(line), json: (value) => console.log(JSON.stringify(value)) };
  const owner = { branch: 'orquestador de sujetos', worktree: '' };
  return {
    fs: nodeFs,
    log: io.out,
    wait: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
    isAlive,
    lock: (path, body) => withLock({ path, label: 'lanzamiento de sujetos', io, owner: { ...owner, worktree: dirname(path) } }, LOCK_TIMEOUT_MINUTES, body),
    launch,
    processes,
    kill,
  };
}

export function stopOnSignal(config, deps) {
  const stop = async () => {
    await stopCampaign(config, deps, [...running]);
    process.exit(130);
  };
  for (const signal of ['SIGINT', 'SIGTERM', 'SIGBREAK']) process.once(signal, stop);
}
