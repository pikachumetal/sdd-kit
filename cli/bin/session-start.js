import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { gitBashTmpPath, repairGitBashTmp, withSystemMessage } from './git-bash-tmp.js';
import { nodeVersionProblem } from './node-version.js';

function numericParts(version) {
  return [0, 1, 2].map((i) => parseInt(version.split('.')[i], 10) || 0);
}

export function isOlder(a, b) {
  const [left, right] = [numericParts(a), numericParts(b)];
  for (let i = 0; i < 3; i++) {
    if (left[i] !== right[i]) return left[i] < right[i];
  }
  return false;
}

export function migrationVersions(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory)
    .flatMap((name) => /^v(\d+\.\d+\.\d+)\.md$/.exec(name)?.[1] ?? [])
    .sort((a, b) => (isOlder(a, b) ? -1 : isOlder(b, a) ? 1 : 0));
}

function readJsonVersion(file) {
  if (!existsSync(file)) return '';
  const match = readFileSync(file, 'utf8').match(/"version"\s*:\s*"([^"]*)"/);
  return match ? match[1] : '';
}

// una migración más nueva que el kit cargado aún no se publica: no se ofrece
function latestMigration(directory, loaded) {
  return migrationVersions(directory).filter((version) => !loaded || !isOlder(loaded, version)).at(-1) ?? '';
}

function escapeForJson(text) {
  return text.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
}

const OFFER_ORDER = 'Antes de atender la primera petición, ofrece aplicarlas con una pregunta de sí o no; si la petición ya pide ponerse al día, invoca la skill `sdd-upgrade` sin preguntar. Con el «sí», invoca `sdd-upgrade` y, tras su informe, atiende la petición; con el «no», atiende la petición y no lo vuelvas a ofrecer en esta sesión. Sin ese «sí», no migres. Con `control.profile: unattended` en `.docs/sdd/sdd-kit.json`, no ofrezcas ni migres: atiende la petición y anótalo en tu mensaje final.';

function versionWarning(loaded, wanted) {
  if (!loaded || !wanted || !isOlder(loaded, wanted)) return [];
  return [`AVISO sdd-kit: esta sesión carga el kit ${loaded} y el proyecto pide el ${wanted} (.docs/sdd/sdd-kit.json), así que las skills pueden ser las de una versión vieja. Actualiza con \`claude plugin update sdd-kit@sdd-kit --scope project\` y reinicia Claude Code: /reload-plugins no aplica una actualización de ámbito proyecto.`];
}

function migrationWarning(wanted, latest) {
  if (!latest || !wanted || !isOlder(wanted, latest)) return [];
  return [`AVISO sdd-kit: el proyecto tiene aplicado el kit ${wanted} (.docs/sdd/sdd-kit.json) y el kit cargado trae migraciones hasta la ${latest}. Para aplicarlas, pide «actualízame al kit».`];
}

export function sessionStartOutput(projectDir, pluginRoot, nodeVersion) {
  if (!existsSync(join(projectDir, '.docs', 'sdd'))) return '';
  const loaded = readJsonVersion(join(pluginRoot, '.claude-plugin', 'plugin.json'));
  const wanted = readJsonVersion(join(projectDir, '.docs', 'sdd', 'sdd-kit.json'));
  const latest = latestMigration(join(pluginRoot, 'skills', 'sdd-upgrade', 'references', 'migrations'), loaded);
  const migration = migrationWarning(wanted, latest);
  const warnings = [...versionWarning(loaded, wanted), ...migration];
  const nodeProblem = nodeVersionProblem(nodeVersion);
  if (nodeProblem) warnings.push(nodeProblem.replace(/^sdd /, 'sdd-kit '));
  const joined = warnings.join('\n\n');
  const skill = readFileSync(join(pluginRoot, 'skills', 'using-sdd', 'SKILL.md'), 'utf8').replace(/\n+$/, '');
  const order = migration.length > 0 ? [OFFER_ORDER] : [];
  const context = [...(joined ? [joined] : []), ...order, skill].join('\n\n');
  const systemMessage = joined ? `  "systemMessage": "${escapeForJson(joined)}",\n` : '';
  return `{\n${systemMessage}  "hookSpecificOutput": {\n    "hookEventName": "SessionStart",\n    "additionalContext": "${escapeForJson(context)}"\n  }\n}\n`;
}

function gitBashTmpNotice() {
  try {
    return repairGitBashTmp(gitBashTmpPath());
  } catch {
    return '';
  }
}

export function runSessionStart(pluginRoot) {
  const notice = gitBashTmpNotice();
  try {
    const projectDir = resolve(process.env.CLAUDE_PROJECT_DIR || process.cwd());
    const output = withSystemMessage(sessionStartOutput(projectDir, pluginRoot, process.versions.node), notice);
    process.stdout.write(Buffer.from(output, 'utf8'));
  } catch {
    // el hook nunca debe romper el arranque de la sesión
  }
  return 0;
}
