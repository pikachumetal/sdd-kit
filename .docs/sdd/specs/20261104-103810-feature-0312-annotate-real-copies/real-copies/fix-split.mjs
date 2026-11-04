// node fix-split.mjs <scratchpad>: resuelve los conflictos de build-split.mjs con la regla del reparto: lo que el kit ya quita sigue quitado, y un puntero que ahora vale entra de la fuente.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [dir] = process.argv.slice(2);

// Cada conflicto, por orden, se queda con el lado que se nombra.
function resolve(text, sides) {
  let index = 0;
  return text.replace(/<<<<<<< kit\n([\s\S]*?)=======\n([\s\S]*?)>>>>>>> v7\.0\.2\n/g, (_, kit, newer) => {
    const side = sides[index++];
    if (!side) throw new Error('conflicto sin resolver');
    return side === 'kit' ? kit : newer;
  });
}

const fixes = {
  flowcharts: { sides: ['kit'] },
  bulletproofing: { sides: ['v7.0.2'] },
  'testing-skills-with-subagents': { sides: ['kit', 'v7.0.2'], drop: '## Testing with subagents\n\n', title: '# Testing Skills With Subagents\n\n' },
  'persuasion-principles': { sides: [], drop: '## Persuasion principles\n\n', title: '# Persuasion Principles for Skill Design\n\n' },
  discovery: { sides: [] },
};
for (const [name, { sides, drop, title }] of Object.entries(fixes)) {
  const path = join(dir, `t-${name}.md`);
  let text = resolve(readFileSync(path, 'utf8'), sides).replaceAll('Part of superpowers:writing-skills', 'Part of sdd-agent-writing');
  if (drop) {
    if (!text.startsWith(drop)) throw new Error(`${name}: no empieza por ${drop}`);
    text = title + text.slice(drop.length);
  }
  writeFileSync(path, text);
}
