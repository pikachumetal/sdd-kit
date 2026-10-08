import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { nodeVersionProblem } from './node-version.js';

function numericParts(version) {
  return [0, 1, 2].map((i) => parseInt(version.split('.')[i], 10) || 0);
}

function isOlder(a, b) {
  const [left, right] = [numericParts(a), numericParts(b)];
  for (let i = 0; i < 3; i++) {
    if (left[i] !== right[i]) return left[i] < right[i];
  }
  return false;
}

function readJsonVersion(file) {
  if (!existsSync(file)) return '';
  const match = readFileSync(file, 'utf8').match(/"version"\s*:\s*"([^"]*)"/);
  return match ? match[1] : '';
}

function latestMigration(directory) {
  if (!existsSync(directory)) return '';
  return readdirSync(directory)
    .filter((name) => /^v.*\.md$/.test(name))
    .map((name) => name.slice(1, -3))
    .reduce((latest, version) => (!latest || isOlder(latest, version) ? version : latest), '');
}

function escapeForJson(text) {
  return text.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
}

function versionWarnings(loaded, wanted, latest) {
  const warnings = [];
  if (loaded && wanted && isOlder(loaded, wanted)) {
    warnings.push(`AVISO sdd-kit: esta sesión carga el kit ${loaded} y el proyecto pide el ${wanted} (.docs/sdd/sdd-kit.json), así que las skills pueden ser las de una versión vieja. Actualiza con \`claude plugin update sdd-kit@sdd-kit --scope project\` y reinicia Claude Code: /reload-plugins no aplica una actualización de ámbito proyecto.`);
  }
  if (latest && wanted && isOlder(wanted, latest)) {
    warnings.push(`AVISO sdd-kit: el proyecto tiene aplicado el kit ${wanted} (.docs/sdd/sdd-kit.json) y el kit cargado trae migraciones hasta la ${latest}. Para aplicarlas, pide «ponme el proyecto al día con sdd-init-brownfield».`);
  }
  return warnings;
}

export function sessionStartOutput(projectDir, pluginRoot, nodeVersion) {
  if (!existsSync(join(projectDir, '.docs', 'sdd'))) return '';
  const loaded = readJsonVersion(join(pluginRoot, '.claude-plugin', 'plugin.json'));
  const wanted = readJsonVersion(join(projectDir, '.docs', 'sdd', 'sdd-kit.json'));
  const latest = latestMigration(join(pluginRoot, 'skills', 'sdd-init-brownfield', 'references', 'migrations'));
  const warnings = versionWarnings(loaded, wanted, latest);
  const nodeProblem = nodeVersionProblem(nodeVersion);
  if (nodeProblem) warnings.push(nodeProblem.replace(/^sdd /, 'sdd-kit '));
  const joined = warnings.join('\n\n');
  const skill = readFileSync(join(pluginRoot, 'skills', 'using-sdd', 'SKILL.md'), 'utf8').replace(/\n+$/, '');
  const context = joined ? `${joined}\n\n${skill}` : skill;
  const systemMessage = joined ? `  "systemMessage": "${escapeForJson(joined)}",\n` : '';
  return `{\n${systemMessage}  "hookSpecificOutput": {\n    "hookEventName": "SessionStart",\n    "additionalContext": "${escapeForJson(context)}"\n  }\n}\n`;
}

export function runSessionStart(pluginRoot) {
  try {
    const projectDir = resolve(process.env.CLAUDE_PROJECT_DIR || process.cwd());
    process.stdout.write(Buffer.from(sessionStartOutput(projectDir, pluginRoot, process.versions.node), 'utf8'));
  } catch {
    // el hook nunca debe romper el arranque de la sesión
  }
  return 0;
}
