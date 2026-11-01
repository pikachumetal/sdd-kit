// Sondas sobre el test de títulos que deja un sujeto. Imprime solo salida, recuento y si nombra el título sonda,
// nunca los títulos de la suite. Uso: node probes.mjs <repo del sujeto> <spec que se amplía> <spec que se borra> -- <comando del test>
import { spawnSync } from 'node:child_process';
import { appendFileSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [repo, extended, removed, , ...command] = process.argv.slice(2);
const full = join(repo, extended);
const original = readFileSync(full);
const removedPath = join(repo, removed);
const removedOriginal = readFileSync(removedPath);
const NEW = 'sonda título nuevo';
const LOOP = 'sonda en bucle';
const SLOW = 'sonda lenta';

function run() {
  const result = spawnSync(command[0], command.slice(1), { cwd: repo, encoding: 'utf8', shell: true, timeout: 180000 });
  return { code: result.status, out: `${result.stdout}${result.stderr}` };
}

function restore() {
  writeFileSync(full, original);
  writeFileSync(removedPath, removedOriginal);
}

function probe(name, change, expected) {
  change();
  const { code, out } = run();
  restore();
  const named = expected.map((text) => `${text}: ${out.includes(text) ? 'nombrado' : 'NO nombrado'}`).join(' · ');
  console.log(`${name}: salida ${code}${named ? ` · ${named}` : ''}`);
}

probe('sin cambios', () => {}, []);
probe('test nuevo', () => appendFileSync(full, `\ntest('${NEW}', async () => {});\n`), [NEW]);
probe('título dinámico', () => appendFileSync(full, `\nfor (const t of ['claro', 'oscuro']) test(\`${LOOP} \${t}\`, async () => {});\n`), [`${LOOP} claro`, `${LOOP} oscuro`]);
probe('@slow nuevo', () => appendFileSync(full, `\ntest('${SLOW} @slow', async () => {});\n`), [SLOW]);
probe('spec que lanza al cargar', () => appendFileSync(full, "\nthrow new Error('sonda carga');\n"), ['sonda carga']);
probe('heredados borrados', () => rmSync(removedPath), ['ya no existen']);
