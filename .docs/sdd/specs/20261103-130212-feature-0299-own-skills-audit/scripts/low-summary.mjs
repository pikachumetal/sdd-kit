import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// Uso: node low-summary.mjs <carpeta out> <salida.md>
// Junta los veredictos de los bloques bajo el umbral con su distancia y su skill de shared-low.md,
// y comprueba que hay uno por entrada, sin huecos ni repetidos.
const [outDir, output] = process.argv.slice(2);
const FILES = [1, 2, 3].map((n) => join(outDir, `shared-low-verdicts-${n}.md`));

function entries() {
  const meta = new Map();
  for (const line of readFileSync(join(outDir, 'shared-low.md'), 'utf8').split('\n')) {
    const m = /^- (S\d+) · \d+ frases · ([^·]+) · skills\/([^/]+)\//.exec(line);
    if (m) meta.set(m[1], { distance: m[2].trim(), skill: m[3] });
  }
  return meta;
}

function verdicts() {
  const out = new Map();
  for (const file of FILES) {
    for (const line of readFileSync(file, 'utf8').split('\n')) {
      const [id, kind, group = '', fourth = ''] = line.replace(/^- /, '').split('·').map((f) => f.trim());
      if (!/^S\d+$/.test(id) || !['confirmado', 'descartado'].includes(kind)) continue;
      if (out.has(id)) throw new Error(`repetido: ${id}`);
      out.set(id, { kind, group, differ: fourth.startsWith('difieren') });
    }
  }
  return out;
}

function main() {
  const meta = entries();
  const all = verdicts();
  const missing = [...meta.keys()].filter((id) => !all.has(id));
  if (missing.length) throw new Error(`sin veredicto: ${missing.join(', ')}`);
  const confirmed = [...all].filter(([, v]) => v.kind === 'confirmado').map(([id, v]) => ({ id, ...v, ...meta.get(id) }));
  const discarded = [...all].filter(([, v]) => v.kind === 'descartado').map(([, v]) => v);
  const isNew = (c) => c.group.startsWith('nuevo');
  const lines = [
    `Entradas: ${meta.size} · confirmadas ${confirmed.length} (en grupos existentes ${confirmed.filter((c) => !isNew(c)).length}, nuevas ${confirmed.filter(isNew).length}, difieren ${confirmed.filter((c) => c.differ).length}) · descartadas ${discarded.length}`,
    `Confirmadas por distancia: ${[...Map.groupBy(confirmed, (c) => c.distance)].map(([k, v]) => `${k} ${v.length}`).join(' · ')}`,
    `Nuevas por skill del primer sitio: ${[...Map.groupBy(confirmed.filter(isNew), (c) => c.skill)].sort((a, b) => b[1].length - a[1].length).map(([k, v]) => `${k} ${v.length}`).join(' · ')}`,
    `En grupos existentes: ${[...Map.groupBy(confirmed.filter((c) => !isNew(c)), (c) => c.group)].sort((a, b) => b[1].length - a[1].length).map(([k, v]) => `${k} ${v.length}`).join(' · ')}`,
    `Descartadas por clase: ${[...Map.groupBy(discarded, (d) => d.group)].sort((a, b) => b[1].length - a[1].length).map(([k, v]) => `${k} ${v.length}`).join(' · ')}`,
  ];
  writeFileSync(output, `# Resumen de los bloques bajo el umbral\n\n${lines.map((l) => `- ${l}`).join('\n')}\n`);
  console.log(lines.join('\n'));
}

main();
