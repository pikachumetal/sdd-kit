// Prueba de instalación de la feature 0300: instala la base (source ".") y actualiza a HEAD (source "./dist")
// con Claude Code, desde un marketplace git servido por HTTP en local y un CLAUDE_CONFIG_DIR aislado.
// Uso, desde la raíz del worktree: node .docs/sdd/specs/<carpeta>/install/install.mjs
// Escribe install.md junto a este script y sale con 0 si la caché de dist/ cumple.
import { execFileSync, spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:net';
import { join } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

const ROOT = process.cwd();
const HERE = import.meta.dirname;
// Ruta corta: el clon del marketplace anida rutas de .docs/ que pasan de 260 caracteres en Windows.
const SCRATCH = join(ROOT, '.temp', 'i0300');
const LONG_PATHS = { GIT_CONFIG_COUNT: '1', GIT_CONFIG_KEY_0: 'core.longpaths', GIT_CONFIG_VALUE_0: 'true' };
const WHITELIST = ['.claude-plugin', 'agents', 'cli', 'hooks', 'skills', 'LICENSE', 'THIRD_PARTY_NOTICES.md'];
const CLAUDE_OWN = ['.in_use', '.orphaned_at'];
const env = { ...process.env, ...LONG_PATHS, CLAUDE_CONFIG_DIR: join(SCRATCH, 'cfg') };
delete env.GIT_DIR;
delete env.GIT_INDEX_FILE;

function git(args, extraEnv = {}, input) {
  return execFileSync('git', args, { env: { ...env, ...extraEnv }, input, encoding: 'utf8' }).trim();
}

function claude(args) {
  const result = spawnSync('claude', args, { env, encoding: 'utf8' });
  return `${result.stdout}${result.stderr}`;
}

function nextPatch(version) {
  const [major, minor, patch] = version.split('.').map(Number);
  return `${major}.${minor}.${patch + 1}`;
}

// El commit «con dist/»: HEAD con otra versión en dist/.claude-plugin/plugin.json, para que Claude Code actualice.
function commitWithDist(bare) {
  const at = { GIT_DIR: bare, GIT_INDEX_FILE: join(SCRATCH, 'index') };
  const manifest = JSON.parse(git(['show', 'HEAD:dist/.claude-plugin/plugin.json'], at));
  const version = nextPatch(manifest.version);
  const blob = git(['hash-object', '-w', '--stdin'], at, `${JSON.stringify({ ...manifest, version }, null, 2)}\n`);
  git(['read-tree', 'HEAD'], at);
  git(['update-index', '--cacheinfo', `100644,${blob},dist/.claude-plugin/plugin.json`], at);
  const tree = git(['write-tree'], at);
  return { commit: git(['commit-tree', tree, '-p', 'HEAD', '-m', 'prueba: dist con versión de prueba'], at), version };
}

async function freePort() {
  const server = createServer().listen(0, '127.0.0.1');
  await new Promise((done) => server.once('listening', done));
  const { port } = server.address();
  await new Promise((done) => server.close(done));
  return port;
}

async function startServer(port) {
  const child = spawn(process.execPath, [join(HERE, 'githttp.mjs'), SCRATCH, String(port)], { env, stdio: ['ignore', 'pipe', 'inherit'] });
  await new Promise((done) => child.stdout.once('data', done));
  return child;
}

function filesUnder(dir) {
  return readdirSync(dir, { recursive: true, encoding: 'utf8' }).filter((path) => statSync(join(dir, path)).isFile());
}

function measure(dir) {
  const files = filesUnder(dir);
  const bytes = files.reduce((sum, path) => sum + statSync(join(dir, path)).size, 0);
  const marked = files.filter((path) => path.endsWith('.md') && readFileSync(join(dir, path), 'utf8').includes('<!-- kit:'));
  return { files: files.length, mb: (bytes / 1048576).toFixed(1).replace('.', ','), top: readdirSync(dir).sort(), marked };
}

function hookFrom(cache) {
  const project = join(SCRATCH, 'project');
  mkdirSync(join(project, '.docs', 'sdd'), { recursive: true });
  writeFileSync(join(project, '.docs', 'sdd', 'sdd-kit.json'), '{"version":"2.0.0"}\n');
  const result = spawnSync(process.execPath, [join(cache, 'cli', 'bin', 'sdd.js'), 'hook', 'session-start'], {
    env: { ...env, CLAUDE_PROJECT_DIR: project },
    input: '{"session_id":"install-0300"}',
    encoding: 'utf8',
  });
  return { usingSdd: result.stdout.includes('name: using-sdd'), stderr: result.stderr.trim() };
}

// Claude Code no refresca un marketplace refrescado hace menos de 30 s: se reintenta una vez.
async function updatePlugin(version) {
  for (const attempt of [1, 2]) {
    claude(['plugin', 'marketplace', 'update', 'sdd-kit']);
    const output = claude(['plugin', 'update', 'sdd-kit@sdd-kit']);
    if (output.includes(`to ${version}`)) return output;
    if (attempt === 1) await sleep(31_000);
  }
  throw new Error(`no actualizó a ${version}`);
}

function checks(after, before, hook) {
  const unexpected = after.top.filter((entry) => !WHITELIST.includes(entry) && !CLAUDE_OWN.includes(entry));
  return [
    ['Solo la lista blanca en la caché nueva', unexpected.length === 0, unexpected.join(', ') || 'nada más'],
    ['Ninguna línea `<!-- kit:` en sus `.md`', after.marked.length === 0, after.marked.join(', ') || 'ninguna'],
    ['La 2.3.4 queda con `.orphaned_at`', before.orphaned, before.orphaned ? 'sí' : 'no'],
    ['El hook `session-start` desde la caché entrega `using-sdd` sin stderr', hook.usingSdd && hook.stderr === '', hook.stderr || 'sí'],
  ];
}

function report(rows, results, versions) {
  const table = rows.map(([name, m]) => `| ${name} | ${m.top.join(', ')} | ${m.files} | ${m.mb} MB |`);
  const verdicts = results.map(([name, ok, detail]) => `| ${name} | ${ok ? 'sí' : 'NO'} | ${detail} |`);
  return [
    '# Prueba de instalación (feature 0300)',
    '',
    `Claude Code ${claude(['--version']).trim()}, \`CLAUDE_CONFIG_DIR\` aislado y un marketplace git servido por HTTP en local. Generado por \`install.mjs\` el ${new Date().toISOString().slice(0, 10)}.`,
    '',
    '| Escenario | Caché | Ficheros | Tamaño (suma de bytes) |',
    '| --- | --- | --- | --- |',
    ...table,
    '',
    `La rama \`dist\` autorreferenciada (fuente \`url\`, \`ref: dist\`) dio la misma caché en la apertura (234 ficheros; \`du\`, que cuenta bloques, dio 1,6 MB), con un \`dist/\` hecho a mano; no se repite porque se eligió \`dist/\` commiteado (ADR 0023). Versiones: ${versions}.`,
    '',
    '| Comprobación | Cumple | Detalle |',
    '| --- | --- | --- |',
    ...verdicts,
    '',
  ].join('\n');
}

async function install(port, base, withDist) {
  const bare = join(SCRATCH, 'mkt.git');
  const url = `http://127.0.0.1:${port}/mkt.git#main`;
  git(['--git-dir', bare, 'update-ref', 'refs/heads/main', base]);
  claude(['plugin', 'marketplace', 'add', url]);
  claude(['plugin', 'install', 'sdd-kit@sdd-kit']);
  git(['--git-dir', bare, 'update-ref', 'refs/heads/main', withDist.commit]);
  await updatePlugin(withDist.version);
  return join(env.CLAUDE_CONFIG_DIR, 'plugins', 'cache', 'sdd-kit', 'sdd-kit');
}

async function main() {
  rmSync(SCRATCH, { recursive: true, force: true });
  mkdirSync(SCRATCH, { recursive: true });
  const bare = join(SCRATCH, 'mkt.git');
  git(['clone', '-q', '--bare', '--single-branch', '-b', git(['branch', '--show-current']), ROOT, bare]);
  const base = git(['merge-base', 'HEAD', 'develop']);
  const withDist = commitWithDist(bare);
  const port = await freePort();
  const server = await startServer(port);
  try {
    const cache = await install(port, base, withDist);
    const oldVersion = JSON.parse(git(['show', `${base}:.claude-plugin/plugin.json`])).version;
    const before = { ...measure(join(cache, oldVersion)), orphaned: existsSync(join(cache, oldVersion, '.orphaned_at')) };
    const after = measure(join(cache, withDist.version));
    const results = checks(after, before, hookFrom(join(cache, withDist.version)));
    const rows = [[`${oldVersion} instalada con \`"source": "."\``, before], [`Actualizada a ${withDist.version} con \`"./dist"\` commiteado`, after]];
    writeFileSync(join(HERE, 'install.md'), report(rows, results, `${oldVersion} → ${withDist.version}`));
    process.exitCode = results.every(([, ok]) => ok) ? 0 : 1;
  } finally {
    server.kill();
    rmSync(SCRATCH, { recursive: true, force: true });
  }
}

await main();
