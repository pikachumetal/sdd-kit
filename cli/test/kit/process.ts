import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const kitRoot = fileURLToPath(new URL('../../../', import.meta.url));

const GIT_ENV_NAMES = ['GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE', 'GIT_COMMON_DIR', 'GIT_OBJECT_DIRECTORY'];

// Git exporta estas variables a sus hooks y ganan a `git -C`: heredadas del pre-commit, una fixture
// escribiría en el índice o en el repositorio del commit en curso.
export const cleanGitEnv: NodeJS.ProcessEnv = Object.fromEntries(
  Object.entries(process.env).filter(([name]) => !GIT_ENV_NAMES.includes(name.toUpperCase())),
);

export interface RunOptions {
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  input?: string;
}

export interface RunResult {
  output: string;
  code: number;
}

// stdout y stderr juntos, como `2>&1`: los tests comparan la salida entera del script.
export function run(command: string, args: string[], options: RunOptions = {}): RunResult {
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    env: options.env ?? cleanGitEnv,
    input: options.input,
    encoding: 'utf8',
    windowsHide: true,
    maxBuffer: 64 * 1024 * 1024,
  });
  return { output: `${result.stdout ?? ''}${result.stderr ?? ''}`.trimEnd(), code: result.status ?? 1 };
}
