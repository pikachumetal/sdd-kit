import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { run } from './process.ts';

function gitBashCandidates(): string[] {
  return [process.env.ProgramFiles, process.env['ProgramFiles(x86)']]
    .filter((root): root is string => root !== undefined)
    .map((root) => join(root, 'Git', 'bin', 'bash.exe'));
}

// En Windows, `bash` del PATH suele ser el lanzador de WSL, que no ejecuta scripts sin distro: se prefiere Git Bash.
export function resolveBash(): string {
  if (process.platform !== 'win32') return 'bash';
  const gitBash = gitBashCandidates().find((path) => existsSync(path));
  if (gitBash !== undefined) return gitBash;
  const onPath = run('where', ['bash']).output.split(/\r?\n/).find((path) => path !== '' && !/System32/i.test(path));
  if (onPath === undefined) throw new Error('no hay Git Bash ni otro bash fuera de System32');
  return onPath;
}
