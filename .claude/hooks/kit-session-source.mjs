// Avisa en SessionStart si las skills y los agentes del kit no salen de la rama,
// o si los hooks de git del repo no están activos.
//
// Compara SDD_KIT_SESSION_ROOT con la carpeta del proyecto. Si no casan, la sesión no se
// lanzó con start-kit-session.mjs (o desde otro worktree) y las skills y los agentes
// sdd-kit:* pueden venir de la caché del plugin. Aparte, si git config core.hooksPath no
// devuelve .githooks, el pre-commit no corre y un commit creado no prueba nada.
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const sourceContext = 'Las skills y los agentes sdd-kit:* de esta sesión no salen de la rama actual: vienen de la caché del plugin o de otra carpeta. Antes de ejecutar un paso de una skill cargada, contrasta su texto con skills/<nombre>/SKILL.md de la rama; si difieren, manda el de la rama. Si una skill no resuelve (Unknown skill), léela con Read de skills/<nombre>/SKILL.md de la rama y sigue su checklist.';
const hooksMessage = 'Los hooks de git de este clon no están activos: el pre-commit no corre. Actívalos una vez por clon con: git config core.hooksPath .githooks';
const hooksContext = 'git config core.hooksPath no devuelve .githooks: el pre-commit no corre en esta sesión, y un commit creado no prueba que pasó. No escribas «pre-commit en verde» sin haber ejecutado sus comprobaciones.';

function normalizedPath(path) {
  if (path.trim() === '') return null;
  return resolve(path).replace(/[\\/]+$/, '').replaceAll('\\', '/').toLowerCase();
}

function sessionSourceMessage(sessionRoot, projectDir) {
  if (!sessionRoot) {
    return 'Las skills y los agentes del kit de esta sesión no salen de la rama: se cargaron desde la caché del plugin. Si no lanzaste la sesión con node start-kit-session.mjs, sal y relánzala con él; para reanudar esta, node start-kit-session.mjs --resume o --continue con los mismos argumentos.';
  }
  return `Las skills y los agentes del kit de esta sesión no salen de la rama: la sesión se lanzó con start-kit-session.mjs desde ${sessionRoot}, pero el proyecto es ${projectDir}. Relánzala con node start-kit-session.mjs desde el proyecto; para reanudar esta, --resume o --continue con los mismos argumentos.`;
}

function hooksPath(projectDir) {
  return spawnSync('git', ['-C', projectDir, 'config', '--get', 'core.hooksPath'], { encoding: 'utf8' }).stdout?.trim();
}

const sessionRoot = process.env.SDD_KIT_SESSION_ROOT;
const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const messages = [];
const contexts = [];
const normalizedRoot = sessionRoot ? normalizedPath(sessionRoot) : null;
if (!(normalizedRoot && normalizedRoot === normalizedPath(projectDir))) {
  messages.push(sessionSourceMessage(sessionRoot, projectDir));
  contexts.push(sourceContext);
}
if (hooksPath(projectDir) !== '.githooks') {
  messages.push(hooksMessage);
  contexts.push(hooksContext);
}
if (messages.length > 0) {
  const payload = { systemMessage: messages.join(' '), hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: contexts.join(' ') } };
  process.stdout.write(JSON.stringify(payload));
}
