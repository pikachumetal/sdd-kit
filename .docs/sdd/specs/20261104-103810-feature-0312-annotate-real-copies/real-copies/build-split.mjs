// node build-split.mjs <scratchpad>: el texto de destino de los seis ficheros de sdd-agent-writing con el reparto de writing-skills v7.0.2.
// Lo del kit sale de dist/ en 269a0957 (mech-k.md, test-k.md); lo nuevo de la 7.0.2 entra con git merge-file.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [dir] = process.argv.slice(2);
const read = (name) => readFileSync(join(dir, name), 'utf8').replace(/\r\n/g, '\n');
const body = (text) => (text.startsWith('---\n') ? text.slice(text.indexOf('\n---\n', 4) + 5) : text);

// Secciones de nivel ## fuera de recuadros; la primera, con clave '', es lo que va antes del primer ##.
function sections(text) {
  const out = new Map([['', []]]);
  let key = '';
  let fence = null;
  for (const line of text.split('\n')) {
    const opener = line.match(/^ {0,3}(`{3,}|~{3,})/)?.[1];
    if (opener && (!fence || opener.startsWith(fence))) fence = fence ? null : opener;
    if (!fence && !opener && /^## /.test(line)) out.set((key = line.slice(3)), []);
    out.get(key).push(line);
  }
  return new Map([...out].map(([name, lines]) => [name, `${lines.join('\n').replace(/\n+$/, '')}\n`]));
}

function pick(map, names) {
  return names.map((name) => {
    if (!map.has(name)) throw new Error(`sin sección «${name}»`);
    return map.get(name);
  });
}

function merge(kit, older, newer, name) {
  const files = { kit, older, newer };
  for (const [key, text] of Object.entries(files)) writeFileSync(join(dir, `m-${name}-${key}.md`), text);
  try {
    return execFileSync('git', ['merge-file', '-p', '-L', 'kit', '-L', 'v7.0.0', '-L', 'v7.0.2', ...['kit', 'older', 'newer'].map((key) => join(dir, `m-${name}-${key}.md`))], { encoding: 'utf8' });
  } catch (error) {
    console.log(`${name}: ${error.status} conflictos`);
    return error.stdout;
  }
}

// Un título que el kit bajó un nivel al meterlo en una sección vuelve al de la fuente, ya que la sección no existe.
function promote(text, original) {
  const heads = new Set(original.split('\n').filter((line) => /^#{1,6} /.test(line)));
  let fence = null;
  return text
    .split('\n')
    .map((line) => {
      const opener = line.match(/^ {0,3}(`{3,}|~{3,})/)?.[1];
      if (opener && (!fence || opener.startsWith(fence))) fence = fence ? null : opener;
      return !fence && /^#{2,6} /.test(line) && !heads.has(line) && heads.has(line.slice(1)) ? line.slice(1) : line;
    })
    .join('\n');
}

const mech = sections(read('mech-k.md'));
const test = sections(read('test-k.md'));
const old = sections(body(read('ws700.md')));
const links = (text) => text.replaceAll('[references/', '[').replaceAll('(references/', '(').replaceAll('see references/', 'see ');

// skill-mechanics.md: copia de SKILL.md v7.0.2.
const v702 = sections(body(read('v702-SKILL.md')));
const [head, ...invocation] = mech.get('').split(/\n(?=### )/);
// El kit juntaba en un párrafo las dos frases que la fuente separa con «Personal skills…», que el kit quita: vuelven a su párrafo.
const intro = test.get('').split('\n').slice(1).join('\n').trim().replace('documentation.** You write', 'documentation.**\n\nYou write');
const mechanics = [
  `${head.trim()}\n\n${intro}\n`,
  ...invocation.map((part) => `${part.trim()}\n`),
  ...pick(mech, ['What is a Skill?', 'TDD Mapping for Skills', 'When to Create a Skill', 'Skill Types', 'Directory Structure']),
  links(v702.get('Writing SKILL.md')),
  // El kit no copia graphviz-conventions.dot ni render-graphs.js: el puntero no promete lo que flowcharts.md quita.
  links(v702.get('Flowcharts')).replace(', the graphviz conventions, and how to render one', ''),
  ...pick(mech, ['Code Examples', 'File Organization']),
  ...pick(test, ['The Iron Law (Same as TDD)', 'Testing All Skill Types', 'Common Rationalizations for Skipping Testing']),
  mech.get('Match the Form to the Failure').replace('(see Bulletproofing below)', '(see bulletproofing.md)'),
  links(v702.get('Bulletproofing Against Rationalization')),
  test.get('RED-GREEN-REFACTOR for Skills').replace('**Testing methodology:** see «Testing with subagents» below.', links(v702.get('RED-GREEN-REFACTOR for Skills').match(/\*\*Testing methodology:\*\*[^\n]*(\n- [^\n]*)*/)[0]).replace('[testing-skills-with-subagents.md](testing-skills-with-subagents.md)', '[skill-testing.md](skill-testing.md)')),
  mech.get('Anti-Patterns'),
  ...pick(test, ['STOP: Before Moving to Next Skill', 'Skill Creation Checklist (TDD Adapted)']).map((text) => text.replace(' in [skill-mechanics.md](skill-mechanics.md))', ')')),
];
writeFileSync(join(dir, 't-skill-mechanics.md'), mechanics.join('\n'));

// Las copias nuevas: lo del kit, fusionado con su original de la 7.0.2 sobre la base de la 7.0.0.
const pieces = [
  ['discovery', pick(mech, ['SKILL.md Structure', 'Skill Discovery Optimization (SDO)']).join('\n'), pick(old, ['SKILL.md Structure', 'Skill Discovery Optimization (SDO)']).join('\n')],
  ['flowcharts', mech.get('Flowchart Usage'), old.get('Flowchart Usage')],
  ['bulletproofing', mech.get('Bulletproofing Skills Against Rationalization'), old.get('Bulletproofing Skills Against Rationalization')],
  ['persuasion-principles', test.get('Persuasion principles'), read('persuasion700.md')],
  ['testing-skills-with-subagents', test.get('Testing with subagents'), read('tsws700.md')],
];
for (const [name, kit, older] of pieces) {
  const newer = read(`v702-${name}.md`);
  writeFileSync(join(dir, `t-${name}.md`), promote(merge(kit, older, newer, name), newer));
}
