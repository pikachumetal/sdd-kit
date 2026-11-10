// Las dependencias reales de campaign.mjs, que comparten run.mjs y battery.mjs run.
import { spawn, spawnSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { withLock } from '../../cli/src/git/lock.ts';
import { stopCampaign } from './campaign.mjs';
import { isAlive, killProcess, MAX_BUFFER, nodeFs } from './lib.mjs';

const LOCK_TIMEOUT_MINUTES = 120;

const running = new Set();

const DRAIN_GRACE_MS = 5000;

// La salida del sujeto va por pipes propios: con 'inherit', un nieto que el sujeto deje vivo retiene la salida de la
// tanda y quien la lee no ve el fin de fichero hasta que ese nieto muere (feature 0311, ~3 h). Tras el exit se espera
// el close, que vacía la cola; si un nieto retiene los pipes del sujeto, se destruyen pasada la gracia.
function launch({ subjectSh, args, env }) {
  const child = spawn(process.execPath, [subjectSh, ...args], { env, stdio: ['inherit', 'pipe', 'pipe'], windowsHide: true });
  child.stdout.pipe(process.stdout, { end: false });
  child.stderr.pipe(process.stderr, { end: false });
  running.add(child.pid);
  const exited = new Promise((resolve) => {
    let code = 1;
    let grace;
    child.on('exit', (exitCode) => {
      code = exitCode ?? 1;
      grace = setTimeout(() => {
        child.stdout.destroy();
        child.stderr.destroy();
      }, DRAIN_GRACE_MS);
      grace.unref();
    });
    child.on('close', () => {
      clearTimeout(grace);
      resolve(code);
    });
    child.on('error', () => resolve(1));
  }).finally(() => running.delete(child.pid));
  return { pid: child.pid, exited };
}

// Una línea por proceso, «<pid>\t<línea de órdenes>»: ConvertTo-Json deja sin escapar algún carácter de control
// de las líneas de órdenes de otros programas, y el JSON no se puede leer.
const PROCESS_QUERY = "Get-CimInstance Win32_Process | ForEach-Object { \"$($_.ProcessId)`t$($_.CommandLine -replace '[\\x00-\\x1f]', ' ')\" }";

const windows = process.platform === 'win32';

// Fuera de Windows (el CI corre esta suite en Linux), la línea de órdenes sale de /proc, sin depender de ps.
function linuxProcesses() {
  return readdirSync('/proc').filter((name) => /^\d+$/.test(name)).flatMap((pid) => {
    try {
      return [{ pid: Number(pid), commandLine: readFileSync(`/proc/${pid}/cmdline`, 'utf8').replaceAll('\0', ' ').trim() }];
    } catch {
      return [];
    }
  });
}

async function processes() {
  if (!windows) return linuxProcesses();
  const result = spawnSync('pwsh', ['-NoProfile', '-Command', PROCESS_QUERY], { encoding: 'utf8', windowsHide: true, maxBuffer: MAX_BUFFER });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`pwsh salió con ${result.status}: ${(result.stderr ?? '').trim()}`);
  return result.stdout.split(/\r?\n/).filter(Boolean).map((line) => {
    const tab = line.indexOf('\t');
    return { pid: Number(line.slice(0, tab)), commandLine: line.slice(tab + 1) };
  });
}

// Hasta la línea del error: lo que sigue es la pila de node y su versión.
function syntaxError(path) {
  const { status, stderr } = spawnSync(process.execPath, ['--check', path], { encoding: 'utf8', windowsHide: true });
  if (status === 0) return null;
  const lines = (stderr ?? '').trim().split(/\r?\n/);
  const errorLine = lines.findIndex((line) => /^\w*Error\b/.test(line));
  return (errorLine < 0 ? lines : lines.slice(0, errorLine + 1)).join('\n') || 'node --check falló sin mensaje';
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
    kill: killProcess,
    syntaxError,
  };
}

export function stopOnSignal(config, deps) {
  const stop = async () => {
    await stopCampaign(config, deps, [...running]);
    process.exit(130);
  };
  for (const signal of ['SIGINT', 'SIGTERM', 'SIGBREAK']) process.once(signal, stop);
}
