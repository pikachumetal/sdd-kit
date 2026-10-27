import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { run } from './process.ts';

function gitBashCandidates(env: NodeJS.ProcessEnv): string[] {
  return [env.ProgramFiles, env['ProgramFiles(x86)']]
    .filter((root): root is string => root !== undefined)
    .map((root) => join(root, 'Git', 'bin', 'bash.exe'));
}

function bashOnPath(env: NodeJS.ProcessEnv): string | undefined {
  const result = run('where', ['bash'], { env });
  if (result.code !== 0) return undefined;
  return result.output.split(/\r?\n/).find((path) => path !== '' && !/System32/i.test(path));
}

// En Windows, `bash` del PATH suele ser el lanzador de WSL, que no ejecuta scripts sin distro: se prefiere Git Bash.
export function resolveBash(env: NodeJS.ProcessEnv = process.env): string {
  if (process.platform !== 'win32') return 'bash';
  const bash = gitBashCandidates(env).find((path) => existsSync(path)) ?? bashOnPath(env);
  if (bash === undefined) throw new Error('no hay Git Bash ni otro bash fuera de System32');
  return bash;
}
