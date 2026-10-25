import { lstatSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { isAbsolute, join } from 'node:path';

const MAX_AGE_MS = 24 * 3600 * 1000;
// el presupuesto de los SessionEnd es 1,5 s, y el timeout de un hook de plugin no lo sube
const BUDGET_MS = 1000;
const MAX_NAME = 200;
const WARNING = 'sdd-kit: no borro los temporales de Claude Code: ';

// la regla de Claude Code para <tmp>/claude/ y ~/.claude/projects, medida en la feature 0210
export function projectFolderName(path) {
  const name = path.replace(/[^a-zA-Z0-9]/g, '-');
  if (name.length <= MAX_NAME) return name;
  let hash = 0;
  for (const char of path) hash = ((hash << 5) - hash + char.charCodeAt(0)) | 0;
  return `${name.slice(0, MAX_NAME)}-${Math.abs(hash).toString(36)}`;
}

function sessionId(stdin) {
  try {
    const id = JSON.parse(stdin)?.session_id;
    return typeof id === 'string' && /^[A-Za-z0-9-]+$/.test(id) ? id : '';
  } catch {
    return '';
  }
}

// la fecha de la carpeta no avanza con un .output que crece en tasks/: cuenta el fichero más reciente
function lastWrite(dir) {
  let latest = 0;
  let files = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true, recursive: true })) {
    if (!entry.isFile()) continue;
    files++;
    latest = Math.max(latest, lstatSync(join(entry.parentPath, entry.name)).mtimeMs);
  }
  return files > 0 ? latest : lstatSync(dir).mtimeMs;
}

function removeIfStale(dir, now) {
  try {
    if (now - lastWrite(dir) > MAX_AGE_MS) rmSync(dir, { recursive: true, force: true });
  } catch {
    // otro cierre la está borrando o un .output sigue abierto: queda el borrado parcial
  }
}

export function cleanSessionTemp(stdin, env, now = Date.now(), deadline = Infinity) {
  const id = sessionId(stdin);
  if (!id) return `${WARNING}sin session_id válido en la entrada del hook`;
  const base = env.CLAUDE_CODE_TMPDIR || tmpdir();
  if (!isAbsolute(base)) return `${WARNING}${base} no es una ruta absoluta`;
  const projectPath = env.CLAUDE_PROJECT_DIR || JSON.parse(stdin).cwd || '';
  const name = projectFolderName(projectPath);
  if (!name) return `${WARNING}no sale el nombre de la carpeta del proyecto de ${projectPath}`;
  const project = join(base, 'claude', name);
  let entries;
  try {
    entries = readdirSync(project, { withFileTypes: true });
  } catch {
    return '';
  }
  for (const entry of entries) {
    if (Date.now() > deadline) break;
    // isDirectory() es falso en un enlace simbólico o un junction: no se siguen ni se borran
    if (entry.isDirectory() && entry.name !== id) removeIfStale(join(project, entry.name), now);
  }
  return '';
}

export function runSessionEnd() {
  try {
    // el plazo cuenta desde que arranca el proceso: el arranque de node ya se come parte del presupuesto
    const warning = cleanSessionTemp(readFileSync(0, 'utf8'), process.env, Date.now(), performance.timeOrigin + BUDGET_MS);
    if (warning) process.stderr.write(`${warning}\n`);
  } catch {
    // el hook nunca debe romper el cierre de la sesión
  }
  return 0;
}
