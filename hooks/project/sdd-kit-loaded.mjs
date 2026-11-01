// Avisa si esta sesión no cargó el plugin sdd-kit. Lo copia el kit a cada proyecto, porque el hook
// del plugin no corre sin el plugin. Se ejecuta en UserPromptSubmit: en SessionStart los dos hooks van
// a la vez, y la marca del plugin podría no estar aún.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const OPENING = 'AVISO sdd-kit: esta sesión no tiene cargadas las skills del kit.';
const FIX = 'Instálalo o actualízalo con «claude plugin install sdd-kit@sdd-kit --scope project» y reinicia Claude Code.';

export function markerPath(id, base = tmpdir()) {
  return join(base, 'sdd-kit-sessions', id);
}

function parseInput(stdin) {
  try {
    const { session_id: id, cwd } = JSON.parse(stdin) ?? {};
    return { id: typeof id === 'string' && /^[A-Za-z0-9-]+$/.test(id) ? id : '', cwd: typeof cwd === 'string' ? cwd : '' };
  } catch {
    return { id: '', cwd: '' };
  }
}

function declaredVersion(projectDir) {
  try {
    const { version } = JSON.parse(readFileSync(join(projectDir, '.docs', 'sdd', 'sdd-kit.json'), 'utf8'));
    return /^\d+\.\d+\.\d+$/.test(version) ? version : '';
  } catch {
    return '';
  }
}

function warning(version, env) {
  if (!version) return `${OPENING} ${FIX}`;
  const config = env.CLAUDE_CONFIG_DIR || join(homedir(), '.claude');
  const route = join(config, 'plugins', 'cache', 'sdd-kit', 'sdd-kit', version, 'skills');
  const where = existsSync(route) ? `: léelas en ${route}/<skill>/SKILL.md.` : ` y esa versión no está en la caché (${route}).`;
  return `${OPENING} El proyecto declara el kit ${version}${where} ${FIX}`;
}

export function sessionNotice(stdin, env, base = tmpdir()) {
  const { id, cwd } = parseInput(stdin);
  const projectDir = env.CLAUDE_PROJECT_DIR || cwd;
  if (!id || !existsSync(join(projectDir, '.docs', 'sdd'))) return '';
  const marker = markerPath(id, base);
  if (existsSync(marker) || existsSync(`${marker}.warned`)) return '';
  mkdirSync(join(base, 'sdd-kit-sessions'), { recursive: true });
  writeFileSync(`${marker}.warned`, '');
  const message = warning(declaredVersion(projectDir), env);
  return JSON.stringify({ systemMessage: message, hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: message } });
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try {
    process.stdout.write(sessionNotice(readFileSync(0, 'utf8'), process.env));
  } catch {
    // un aviso no debe romper el mensaje del usuario
  }
}
