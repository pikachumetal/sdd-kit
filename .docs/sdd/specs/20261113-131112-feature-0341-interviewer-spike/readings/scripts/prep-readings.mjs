// Baraja los brazos por escenario (c1…c6), copia los transcripts sin la ruta del kit y escribe la clave.
// Uso: node prep-readings.mjs <carpeta del spike> <destino de los encargos>
import { randomInt } from 'node:crypto';
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [spec, dest] = process.argv.slice(2);
const ARMS = ['control-a', 'matt', 'brainstorming', 'openspec', 'look-decide-ask', 'control-b'];
const SCENARIOS = ['g1', 'g9', 'rq', 'g2', 'g8', 'g3', 'p1', 'p2', 'p3', 'fp', 'pe'];
const SPLIT = new Set(['fp', 'pe']);
const KIT = /[A-Za-z]:[\\/]+code[\\/]+\.worktrees[\\/]+sdd-kit[\\/]+feature-0341-interviewer-spike[\\/]+\.temp[\\/]+i[\\/]+kit-[a-z-]+/g;

function shuffle(list) {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const key = ['# Clave de la lectura', '', 'Etiqueta neutra → brazo, barajada por escenario. Los lectores no la ven.', ''];
for (const sc of SCENARIOS) {
  const order = shuffle(ARMS);
  key.push(`## ${sc}`, '', '| Etiqueta | Brazo |', '| --- | --- |');
  order.forEach((arm, k) => {
    const label = `c${k + 1}`;
    key.push(`| ${label} | ${arm} |`);
    const reader = SPLIT.has(sc) ? `${sc}-${k < 3 ? 'a' : 'b'}` : sc;
    const outDir = join(dest, reader);
    mkdirSync(outDir, { recursive: true });
    const src = join(spec, arm, 'out');
    for (const file of readdirSync(src).filter((f) => f.startsWith(`${sc}-`) && f.endsWith('.transcript.txt'))) {
      const index = file.slice(sc.length + 1, -'.transcript.txt'.length);
      const text = readFileSync(join(src, file), 'utf8').replace(KIT, '<kit>');
      writeFileSync(join(outDir, `${label}-${index}.transcript.txt`), text);
    }
  });
  key.push('');
}
mkdirSync(join(spec, 'readings'), { recursive: true });
writeFileSync(join(spec, 'readings', 'key.md'), key.join('\n'));
console.log('ok');
