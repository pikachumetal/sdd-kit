import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { cleanGitEnv, kitRoot, run } from './process.ts';

export interface EvidenceFile {
  path: string;
  text: string;
}

// X:\Users\…, X:\\Users\\… (JSON), X:/Users/…, /x/Users/… y la carpeta de proyecto X--Users-….
export const USER_PATH_PATTERN = /(?:\b[a-z]:|(?<![\w.])\/[a-z])(?:\\{1,2}|\/)Users(?:\\{1,2}|\/)(?![\\/<…])|\b[a-z]--Users-(?!<)/i;

export const escapeRegExp = (text: string): string => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Usuarios por defecto de GitHub Actions, de un contenedor y de las imágenes de nube: como palabra, casan con texto
// corriente de cualquier salida («el test runner nativo»), sin que sea una fuga (patch 0245).
export const COMMON_USERS = ['runner', 'root', 'user', 'admin', 'ubuntu'];

// Del home, no de USERNAME, que en Git Bash vale SYSTEM.
export function machineUser(env: NodeJS.ProcessEnv = process.env): string {
  return (env.USERPROFILE ?? env.HOME ?? '').split(/[\\/]/).pop() ?? '';
}

export const isCommonUser = (user: string): boolean => COMMON_USERS.includes(user.toLowerCase());

// Sin home o con un usuario corriente, un patrón que no casa: \b\b casaría con todo.
export function machineUserPattern(env: NodeJS.ProcessEnv = process.env): RegExp {
  const leaf = machineUser(env);
  return leaf === '' || isCommonUser(leaf) ? /(?!)/ : new RegExp(`\\b${escapeRegExp(leaf)}\\b`, 'i');
}

// Toda subcarpeta de una tarea: campaign/, ab/, micro/… también son salidas de sujetos.
export function selectEvidencePath(paths: string[]): string[] {
  return paths.filter((path) => /^\.docs\/sdd\/specs\/[^/]+\/[^/]+\/|^tests\/[^/]+-(red|green)\.md$/i.test(path));
}

// Sin limpiar el entorno de git: dentro del hook, GIT_INDEX_FILE dice qué índice se está commiteando.
export function stagedEvidence(): string[] {
  const args = ['-c', 'core.quotePath=false', 'diff', '--cached', '--name-only', '--diff-filter=ACMR'];
  const result = run('git', args, { cwd: kitRoot, env: process.env });
  // Un error de git no es «sin evidencia»: el control dejaría pasar la fuga.
  if (result.code !== 0) throw new Error(`git ${args.join(' ')}: ${result.output}`);
  return selectEvidencePath(result.output.split(/\r?\n/).filter((path) => path !== ''));
}

export function readEvidence(paths: string[]): EvidenceFile[] {
  return paths.map((path) => ({ path, text: readFileSync(join(kitRoot, path), 'utf8') }));
}

export function gitUserConfig(key: string, env: NodeJS.ProcessEnv = cleanGitEnv): string {
  const result = run('git', ['config', key], { cwd: kitRoot, env });
  return result.code === 0 ? result.output.trim() : '';
}

export function findLeak(evidence: EvidenceFile[], pattern: RegExp): string[] {
  return evidence.filter((file) => pattern.test(file.text)).map((file) => file.path);
}

export function findMachineLeak(evidence: EvidenceFile[]): string[] {
  const identity = [gitUserConfig('user.name'), gitUserConfig('user.email')]
    .filter((value) => value !== '')
    .map((value) => new RegExp(escapeRegExp(value), 'i'));
  const patterns = [USER_PATH_PATTERN, machineUserPattern(), ...identity];
  return [...new Set(patterns.flatMap((pattern) => findLeak(evidence, pattern)))].sort();
}
