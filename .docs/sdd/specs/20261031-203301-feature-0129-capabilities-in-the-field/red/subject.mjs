// Uso: node subjects.mjs <etiqueta> [ref]. Lanza los sujetos de migración y de plantilla sobre una copia del kit.
import { execFileSync, spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, createWriteStream, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const [label, ref = ''] = process.argv.slice(2);
const root = resolve(dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), label);
rmSync(root, { recursive: true, force: true });
const kit = join(root, 'kit');
mkdirSync(kit, { recursive: true });

// Sin ref copia el working tree (GREEN); con ref, el commit (RED). Nunca lleva .docs/: un sujeto no debe leer la spec.
const paths = ['skills', '.claude-plugin', 'cli', 'hooks'];
if (ref) {
  const tar = join(root, 'kit.tar');
  execFileSync('git', ['archive', '-o', tar, ref, ...paths]);
  execFileSync('tar', ['-xf', tar.replace(/\\/g, '/'), '-C', kit.replace(/\\/g, '/')]);
} else {
  const tar = join(root, 'kit.tar');
  const stash = execFileSync('git', ['stash', 'create']).toString().trim() || 'HEAD';
  execFileSync('git', ['archive', '-o', tar, stash, ...paths]);
  execFileSync('tar', ['-xf', tar.replace(/\\/g, '/'), '-C', kit.replace(/\\/g, '/')]);
}

function write(dir, files) {
  for (const [name, content] of Object.entries(files)) {
    const target = join(dir, name);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, content, 'utf8');
  }
}

const migration = join(root, 'migration');
write(migration, {
  '.docs/sdd/capabilities/bookings.md': '# Capacidad — bookings\n\nReservas de salas por franja.\n\n## Requisitos\n\n### Reservar una franja\n\n- GIVEN la sala Norte libre\n- WHEN `salas reservar Norte 10-12`\n- THEN responde `Reservada Norte 10-12`\n',
  '.docs/sdd/capabilities/legacy.md': '# Documento funcional antiguo\n\nDescribe pantallas antiguas, anterior a las capacidades por fichero.\n\n## Pantallas\n\nEl listado de facturas tiene filtros.\n',
});
const migrationPrompt = `En este proyecto aplica SOLO dos cosas, en este orden, sin hacer commits ni preguntar:
1. El paso 7 («Propósito de las capacidades») de ${kit}/skills/sdd-upgrade/references/migrations/v2.0.0.md.
2. Después, la viñeta de \`sdd capability check\` de la sección «Verificación» de ${kit}/skills/sdd-upgrade/references/migrations/v3.0.0.md. La CLI es: node "${kit}/cli/bin/sdd.js" capability check --path .docs/sdd
Acaba con el informe que esos pasos piden, en castellano.`;

const template = join(root, 'template');
const longBlock = [
  '- GIVEN una reserva de la sala Norte de 10 a 12 hecha por Ana, con la sala Sur libre y con un festivo el día siguiente',
  '- WHEN Ana ejecuta `salas mover Norte Sur 10-12` y la sala Sur admite el aforo de la reserva original',
  '- THEN la reserva pasa a Sur, Norte queda libre y responde `Movida a Sur 10-12`, sin avisar del festivo porque no pisa la franja',
  '- AND si Sur está ocupada responde `Sur ocupada` y no cambia nada de la reserva original ni de la franja',
  '- AND si el aforo de Sur es menor responde `Aforo insuficiente en Sur` y la reserva sigue en Norte',
  '- AND el historial de la reserva guarda la sala anterior y la hora del cambio',
].join('\n');
write(template, {
  'capabilities/bookings.md': `# Capacidad — bookings\n\n## Propósito\n\nReservar salas.\n\n## Requisitos\n\n### Mover una reserva\n\n${longBlock}\n`,
});
const templatePrompt = `Lee la plantilla ${kit}/skills/sdd-templates/templates/capability-template.md y capabilities/bookings.md. Sin preguntar:
A. Escribe en delta-added.md, con la forma de requisitos de la plantilla, lo que haga falta para este comportamiento nuevo: «Cancelar reservas: \`salas cancelar <sala> <franja>\` libera la franja y responde \`Cancelada\`. Sin esa reserva responde \`No existe\`. Una franja ya empezada no se cancela y responde \`Ya empezada\`. Un administrador puede exportar las cancelaciones del mes con \`salas cancelaciones <mes>\`, y un mes sin cancelaciones responde \`Sin cancelaciones\`.»
B. El requisito «Mover una reserva» cambia: la respuesta pasa a ser \`Reserva movida a Sur 10-12\`. Escribe en delta-modified.md el bloque del requisito como quedaría.
Solo esos dos ficheros. Acaba diciendo qué has hecho, en dos líneas.`;

function launch(name, cwd, prompt) {
  const out = createWriteStream(join(root, `${name}.jsonl`));
  const child = spawn('claude', ['-p', '--model', 'sonnet', '--setting-sources', '', '--strict-mcp-config', '--add-dir', kit, '--permission-mode', 'acceptEdits', '--allowedTools', 'Bash(node:*)', 'Read', 'Write', 'Edit', 'Grep', 'Glob', '--max-turns', '25', '--output-format', 'stream-json', '--verbose', prompt], { cwd, stdio: ['ignore', 'pipe', 'inherit'], shell: process.platform === 'win32' && false });
  child.stdout.pipe(out);
  return new Promise((done) => child.on('close', (code) => { console.log(name, 'exit', code); done(); }));
}

await Promise.all(process.env.SKIP_TEMPLATE ? [launch('migration', migration, migrationPrompt)] : [launch('migration', migration, migrationPrompt), launch('template', template, templatePrompt)]);
