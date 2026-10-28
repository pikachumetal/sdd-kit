import { spawn, spawnSync } from 'node:child_process';
import { closeSync, existsSync, mkdirSync, mkdtempSync, openSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { connect, createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { delimiter, join } from 'node:path';
import { vi } from 'vitest';
import { resolveBash } from '../bash.ts';
import { cleanGitEnv, kitRoot, run, type RunResult } from '../process.ts';

vi.setConfig({ testTimeout: 120_000, hookTimeout: 120_000 });

export const bash = resolveBash();
export const headless = join(kitRoot, 'tests', 'headless');
export const slashed = (path: string): string => path.replaceAll('\\', '/');
export const runMjs = join(headless, 'run.mjs');
export const libSh = slashed(join(headless, 'lib.sh'));

export interface Campaign {
  spec: string;
  runs: string;
  kit: string;
  out: string;
  dry: string;
}

export interface CampaignOptions {
  keepName?: string;
  init?: string;
  launch?: string;
}

export const testRoot = (name: string): string => mkdtempSync(join(tmpdir(), `${name}-`));

export function write(path: string, content: string): string {
  mkdirSync(join(path, '..'), { recursive: true });
  writeFileSync(path, content);
  return path;
}

function subjectScript(options: CampaignOptions): string {
  const { keepName = 'readme.md', init = 'g init -q -b main; ', launch = 'subject_launch "Invoca la skill sdd-kit:sdd-plan."' } = options;
  return [
    '#!/usr/bin/env bash',
    'set -u',
    `. "${libSh}"`,
    'subject_init "$1" "$2" "$4" sdd-plan',
    "put README.md <<< 'salas'",
    `${init}commit "feat: base"`,
    launch,
    '{ echo "## home: $HOME/.claude"; echo "-rw-r--r-- 1 alice 197609 12 f"; } | subject_save',
    `subject_keep "$R/README.md" ${keepName}`,
  ].join('\n');
}

export function newCampaign(root: string, options: CampaignOptions = {}): Campaign {
  const spec = join(root, 'spec');
  const runs = join(root, 'scratchpad', 'runs');
  const kit = join(root, 'kit');
  mkdirSync(runs, { recursive: true });
  write(join(kit, 'skills', 'sdd-plan', 'SKILL.md'), '# sdd-plan\n');
  write(join(kit, 'cli', 'bin', 'sdd.js'), '');
  write(join(spec, 'red', 'subject.sh'), subjectScript(options));
  return { spec, runs, kit, out: join(runs, 'dry', 'red', 'out'), dry: join(runs, 'dry') };
}

export function fakeClaude(root: string, name: string, before = ''): string {
  const bin = join(root, `bin-${name}`);
  const stream = `echo '{"type":"result","num_turns":1,"total_cost_usd":0.5,"result":"hecho"}'`;
  write(join(bin, 'claude'), `#!/usr/bin/env bash\n${before}\n${stream}`);
  return bin;
}

export const withPath = (bin: string): string => `${bin}${delimiter}${process.env.PATH}`;

export type CampaignEnv = Record<string, string | null>;

const ALICE_DRY_RUN: NodeJS.ProcessEnv = { ...cleanGitEnv, USERPROFILE: 'C:\\Users\\alice', HOME: '/c/Users/alice', NODE: process.execPath, DRY_RUN: '1' };

// Un valor null quita la variable del entorno del hijo.
export function campaignEnv(campaign: Campaign, overrides: CampaignEnv): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = {
    ...ALICE_DRY_RUN,
    SPEC_DIR: campaign.spec,
    RUNS_DIR: campaign.runs,
    KIT_DIR: campaign.kit,
    SUBJECT_SH: join(campaign.spec, 'red', 'subject.sh'),
    SCENARIOS: 'a b c',
    SUBJECT_CAP: '10',
    COST_CAP: '10',
  };
  for (const [name, value] of Object.entries(overrides)) {
    if (value === null) delete env[name];
    else env[name] = value;
  }
  return env;
}

// A un fichero, no a una tubería: con los sujetos en Git Bash, se perdían a ratos líneas de la
// salida («write error: Bad file descriptor»), y así stdout y stderr quedan en su orden.
function runToFile(command: string, args: string[], env: NodeJS.ProcessEnv, cwd?: string): RunResult {
  const log = join(mkdtempSync(join(tmpdir(), 'run-log-')), 'output.txt');
  const fd = openSync(log, 'w');
  try {
    const result = spawnSync(command, args, { env, cwd, stdio: ['ignore', fd, fd], windowsHide: true });
    return { output: readFileSync(log, 'utf8').trimEnd(), code: result.status ?? 1 };
  } finally {
    closeSync(fd);
  }
}

export const runBash = (args: string[], env: NodeJS.ProcessEnv, cwd?: string): RunResult => runToFile(bash, args, env, cwd);

export const runCampaign = (campaign: Campaign, overrides: CampaignEnv = {}): RunResult =>
  runToFile(process.execPath, [runMjs], campaignEnv(campaign, overrides));

export function runLib(script: string, env: NodeJS.ProcessEnv = cleanGitEnv): RunResult {
  return run(bash, ['-c', `. '${libSh}'; ${script}`], { env });
}

function toolsFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .map((phase) => join(dir, phase, 'out'))
    .filter((out) => existsSync(out))
    .flatMap((out) => readdirSync(out).filter((name) => name.endsWith('.tools.txt')).map((name) => join(out, name)));
}

export const subjects = (campaign: Campaign): string[] => [...toolsFiles(campaign.spec), ...toolsFiles(campaign.dry)];

export const setTools = (dir: string, label: string, text: string): string => write(join(dir, `${label}.tools.txt`), `${text}\n`);

export const readLines = (path: string): string[] => readFileSync(path, 'utf8').replace(/\r?\n$/, '').split(/\r?\n/);

export const readText = (path: string): string => (existsSync(path) ? readFileSync(path, 'utf8') : '');

export function freePort(): Promise<number> {
  return new Promise((resolve) => {
    const probe = createServer().listen(0, '127.0.0.1', () => {
      const { port } = probe.address() as { port: number };
      probe.close(() => resolve(port));
    });
  });
}

export function isListening(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = connect(port, '127.0.0.1');
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('error', () => resolve(false));
  });
}

// Por el puerto, nunca por nombre: en la máquina corren otros node.
export function stopPort(port: number): void {
  run('pwsh', ['-NoProfile', '-Command', `Get-NetTCPConnection -LocalPort ${port} -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }`]);
}

export const serverScript = (root: string, name: string): string =>
  write(join(root, `${name}.mjs`), "import { createServer } from 'node:http'; createServer().listen(Number(process.argv[2]));\n");

// Arranca el servidor de juguete en PORT dentro del sujeto y espera a que escuche.
export const serverLaunch = (script: string, port: number): string =>
  `PORT=${port}; "$NODE" '${slashed(script)}' "$PORT" > /dev/null 2>&1 & for i in $(seq 50); do (: < /dev/tcp/127.0.0.1/$PORT) 2>/dev/null && break; sleep 0.1; done; `;

export function startServer(script: string, port: number): void {
  spawn(process.execPath, [script, String(port)], { detached: true, stdio: 'ignore', windowsHide: true }).unref();
}

export const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

export async function waitListening(port: number): Promise<void> {
  for (let attempt = 0; attempt < 50 && !(await isListening(port)); attempt++) await sleep(100);
}
