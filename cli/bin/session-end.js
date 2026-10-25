import { lstatSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { isAbsolute, join } from 'node:path';

const MAX_AGE_MS = 24 * 3600 * 1000;
// el presupuesto de los SessionEnd es 1,5 s, y el timeout de un hook de plugin no lo sube
const BUDGET_MS = 1000;
const MAX_NAME = 200;
const WARNING = 'sdd-kit: no borro los temporales de Claude Code: ';

// la regla de Claude Code para <tmp>/claude/ y ~/.claude/projects: sin documentar, medida con una sesión real
export function projectFolderName(path) {
  const name = path.replace(/[^a-zA-Z0-9]/g, '-');
  if (name.length <= MAX_NAME) return name;
  let hash = 0;
  for (let i = 0; i < path.length; i++) hash = ((hash << 5) - hash + path.charCodeAt(i)) | 0;
  return `${name.slice(0, MAX_NAME)}-${Math.abs(hash).toString(36)}`;
}

function parseInput(stdin) {
  try {
    const { session_id: id, cwd } = JSON.parse(stdin) ?? {};
    return {
      id: typeof id === 'string' && /^[A-Za-z0-9-]+$/.test(id) ? id : '',
      cwd: typeof cwd === 'string' ? cwd : '',
    };
  } catch {
    return { id: '', cwd: '' };
  }
}

function projectTempDir(cwd, env) {
  const base = env.CLAUDE_CODE_TMPDIR || tmpdir();
  if (!isAbsolute(base)) return { warning: `${base} no es una ruta absoluta` };
  const projectPath = env.CLAUDE_PROJECT_DIR || cwd;
  const name = projectFolderName(projectPath);
  if (!name) return { warning: `no sale el nombre de la carpeta del proyecto de ${projectPath}` };
  return { dir: join(base, 'claude', name) };
}

// la fecha de la carpeta no avanza con un .output que crece en tasks/: cuenta cualquier fichero de dentro
function writtenSince(dir, cutoff) {
  let hasFiles = false;
  for (const entry of readdirSync(dir, { withFileTypes: true, recursive: true })) {
    if (!entry.isFile()) continue;
    if (lstatSync(join(entry.parentPath ?? entry.path, entry.name)).mtimeMs >= cutoff) return true;
    hasFiles = true;
  }
  return !hasFiles && lstatSync(dir).mtimeMs >= cutoff;
}

function removeIfStale(dir, cutoff) {
  try {
    if (!writtenSince(dir, cutoff)) rmSync(dir, { recursive: true, force: true });
  } catch {
    // otro cierre la está borrando o un .output sigue abierto: queda el borrado parcial
  }
}

export function cleanSessionTemp(stdin, env, { now = Date.now(), deadline = Infinity } = {}) {
  const { id, cwd } = parseInput(stdin);
  if (!id) return `${WARNING}sin session_id válido en la entrada del hook`;
  const { dir, warning } = projectTempDir(cwd, env);
  if (warning) return `${WARNING}${warning}`;
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return '';
  }
  for (const entry of entries) {
    if (Date.now() > deadline) break;
    // isDirectory() es falso en un enlace simbólico o un junction: no se siguen ni se borran
    if (entry.isDirectory() && entry.name !== id) removeIfStale(join(dir, entry.name), now - MAX_AGE_MS);
  }
  return '';
}

export function runSessionEnd() {
  try {
    // el plazo cuenta desde que arranca el proceso: el arranque de node ya se come parte del presupuesto
    const deadline = performance.timeOrigin + BUDGET_MS;
    const warning = cleanSessionTemp(readFileSync(0, 'utf8'), process.env, { deadline });
    if (warning) process.stderr.write(`${warning}\n`);
  } catch {
    // el hook nunca debe romper el cierre de la sesión
  }
  return 0;
}
