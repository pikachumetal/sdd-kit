// Sondas sobre el test de títulos que deja un sujeto. Imprime solo salida y si nombra el título sonda, nunca los
// títulos de la suite. Uso: node probes.mjs <repo del sujeto> <spec que se amplía> <spec de la config secundaria o -> -- <comando>
import { spawnSync } from 'node:child_process';
import { appendFileSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [repo, extended, secondary, , ...command] = process.argv.slice(2);
const OPERATIONS = join(repo, '.docs/sdd/steering/operations.md');
const files = [join(repo, extended), OPERATIONS, ...(secondary === '-' ? [] : [join(repo, secondary)])];
const originals = new Map(files.map((file) => [file, readFileSync(file)]));
const addTest = (file, title) => appendFileSync(file, `\ntest('${title}', async () => {});\n`);

function run() {
  const result = spawnSync(command.join(' '), { cwd: repo, encoding: 'utf8', shell: true, timeout: 180000 });
  return { code: result.status, out: `${result.stdout}${result.stderr}` };
}

function restore() {
  for (const [file, content] of originals) writeFileSync(file, content);
}

function probe(name, change, expected = []) {
  try {
    change();
    const { code, out } = run();
    const named = expected.map((text) => `${text}: ${out.includes(text) ? 'nombrado' : 'NO nombrado'}`).join(' · ');
    console.log(`${name}: salida ${code}${named ? ` · ${named}` : ''}`);
  } finally {
    restore();
  }
}

// Copia la forma de la primera línea del bloque: cada sujeto la escribe a su manera.
function addInherited(title) {
  const lines = readFileSync(OPERATIONS, 'utf8').split('\n');
  const start = lines.findIndex((line) => line.includes('Títulos heredados'));
  const at = lines.findIndex((line, i) => i > start && /^\s*(- |`)/.test(line));
  const copy = lines[at].includes('`') ? lines[at].replace(/`[^`]*`/, `\`${title}\``) : lines[at].replace(/- .*/, `- ${title}`);
  lines.splice(at, 0, copy);
  writeFileSync(OPERATIONS, lines.join('\n'));
}

function addCore(title) {
  const lines = readFileSync(OPERATIONS, 'utf8').split('\n');
  const at = lines.findIndex((line) => line.includes('Flujos core'));
  const indent = lines[at].startsWith('#') ? '' : '  ';
  lines.splice(at + (indent ? 1 : 2), 0, `${indent}- sonda · \`archivo\` · ${title}`);
  writeFileSync(OPERATIONS, lines.join('\n'));
}

const NEW = 'sonda título nuevo';
const full = files[0];
probe('sin cambios', () => {});
probe('test nuevo', () => addTest(full, NEW), [NEW]);
probe('título dinámico', () => appendFileSync(full, "\nfor (const t of ['claro', 'oscuro']) test(`sonda en bucle ${t}`, async () => {});\n"), ['sonda en bucle claro', 'sonda en bucle oscuro']);
probe('@slow nuevo', () => addTest(full, 'sonda lenta @slow'), ['sonda lenta']);
probe('spec que lanza al cargar', () => appendFileSync(full, "\nthrow new Error('sonda carga');\n"), ['sonda carga']);
probe('título nuevo en Flujos core', () => { addTest(full, NEW); addCore(NEW); });
probe('heredado con su test', () => { addTest(full, 'sonda heredada'); addInherited('sonda heredada'); });
probe('heredado sin su test', () => addInherited('sonda heredada'), ['sonda heredada']);
if (secondary !== '-') probe('test nuevo en la config secundaria', () => addTest(files[2], 'sonda secundaria'), ['sonda secundaria']);
