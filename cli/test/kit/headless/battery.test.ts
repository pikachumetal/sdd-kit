import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { BatteryError, main, planLines, runBattery, verdict } from '../../../../tests/headless/battery.mjs';
import { memoryFs, type MemoryFs } from './memory-fs.ts';

// Una raíz absoluta en la plataforma que corre: el CI corre esta suite en Linux.
const CWD = resolve('/w');
const DIR = join(CWD, 'battery');
const TABLE = join(DIR, 'battery.md');
const SPEC = join(CWD, 'spec');
const RUNS = join(CWD, 'scratchpad', 'runs');
const KIT = join(CWD, 'kit');
const OUT = join(RUNS, 'dry', 'battery', 'out');

const TOY = `# Batería de juguete

| Id | Paso | Petición | Molde | Esperado | n | Umbral | Modelo | Procedencia |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| r1 | roadmap | Apunta lo del filtro. | salas | \`sdd-kit:sdd-roadmap\` | 2 | 2/2 | sonnet | toy |
| r2 | roadmap | Reordena el roadmap. | salas | \`sdd-kit:sdd-roadmap\` | 1 | 1/1 | opus | toy |
| f1 | feature | Añade un filtro. | salas | \`sdd-kit:sdd-propose\` | 1 | 1/1 | sonnet | toy |
| t1 | directa | Corrige la errata «Guadar», ¿vale? | salas | ninguna | 1 | 1/1 | sonnet | toy |
| d1 | duda | Hay que mejorar las reservas. | salas | ninguna | 2 | 1/2 | sonnet | toy |
| a1 | brief | Implementa la Task 1. | reservas | \`cualquiera\` | 2 | 2/2 | sonnet | toy |
`;

const finished = (text: string) => `${text}\n=== RESULTADO (1 turnos, 0.1 $)\n`;

function toyFs(): MemoryFs {
  const fs = memoryFs();
  fs.write(TABLE, TOY);
  fs.write(join(KIT, 'cli', 'bin', 'sdd.js'), '');
  return fs;
}

const tools = (fs: MemoryFs, label: string, text: string) => fs.write(join(OUT, `${label}.tools.txt`), text);
const lineOf = (lines: string[], id: string) => lines.find((line) => line.startsWith(`${id} ·`));
// El veredicto «sin leer» dice dónde leer: los texts.txt de ese escenario.
const texts = (id: string) => join(OUT, `${id}-*.texts.txt`);

describe('verdict', () => {
  it('da verde y rojo por escenario', () => {
    const fs = toyFs();
    for (const label of ['r1-1', 'r1-2', 'r2-1']) tools(fs, label, finished('>>> Skill: sdd-kit:sdd-roadmap'));
    tools(fs, 'f1-1', finished('>>> Skill: sdd-kit:sdd-roadmap'));
    tools(fs, 't1-1', finished('>>> Edit: README.md'));
    const { lines, red } = verdict(TABLE, OUT, ['roadmap', 'feature', 'directa'], fs);
    expect(lines).toEqual(['r1 · 2/2 · umbral 2/2 · verde', 'r2 · 1/1 · umbral 1/1 · verde', 'f1 · 0/1 · umbral 1/1 · rojo', 't1 · 1/1 · umbral 1/1 · verde']);
    expect(red).toBe(true);
  });

  it('no cuenta como puerta la invocación de using-sdd, que es el enrutador', () => {
    const fs = toyFs();
    tools(fs, 'f1-1', finished('>>> Skill: sdd-kit:using-sdd\n>>> Skill: sdd-kit:sdd-propose'));
    tools(fs, 't1-1', finished('>>> Skill: sdd-kit:using-sdd\n>>> Edit: README.md'));
    const { lines } = verdict(TABLE, OUT, ['feature', 'directa'], fs);
    expect(lines).toEqual(['f1 · 1/1 · umbral 1/1 · verde', 't1 · 1/1 · umbral 1/1 · verde']);
  });

  it('da «sin evidencia», ni verde ni rojo, al sujeto sin tools.txt', () => {
    const fs = toyFs();
    tools(fs, 'r1-1', finished('>>> Skill: sdd-kit:sdd-roadmap'));
    tools(fs, 'r2-1', finished('>>> Skill: sdd-kit:sdd-roadmap'));
    const result = verdict(TABLE, OUT, ['roadmap'], fs);
    expect(result.lines).toEqual(['r1 · 1/2 · umbral 2/2 · sin evidencia · sin tools.txt: r1-2', 'r2 · 1/1 · umbral 1/1 · verde']);
    expect(result.red).toBe(false);
    expect(result.noEvidence).toBe(true);
  });

  it('da «sin evidencia» al sujeto que no terminó, sin RESULTADO', () => {
    const fs = toyFs();
    tools(fs, 'd1-1', finished('>>> Read: README.md'));
    tools(fs, 'd1-2', '>>> Read: README.md\n');
    expect(verdict(TABLE, OUT, ['duda'], fs).lines).toEqual(['d1 · 1/2 · umbral 1/2 · sin evidencia · sin RESULTADO: d1-2']);
  });

  it('da rojo si lo medido ya no alcanza el umbral, aunque falte evidencia', () => {
    const fs = toyFs();
    tools(fs, 'r1-1', finished('>>> Skill: sdd-kit:sdd-explore'));
    const result = verdict(TABLE, OUT, ['roadmap'], fs);
    expect(lineOf(result.lines, 'r1')).toBe('r1 · 0/2 · umbral 2/2 · rojo · sin tools.txt: r1-2');
    expect(result.red).toBe(true);
  });

  it('da rojo si el kit no cargó, aunque falte evidencia', () => {
    const fs = toyFs();
    tools(fs, 'd1-1', finished('>>> Skill: sdd-kit:sdd-explore\n<<< Unknown skill: sdd-kit:sdd-explore'));
    expect(verdict(TABLE, OUT, ['duda'], fs).lines).toEqual(['d1 · 0/2 · umbral 1/2 · rojo · sin tools.txt: d1-2 · el kit no cargó en d1-1']);
  });

  it('da por buena cualquier skill con «cualquiera», pero no un sujeto sin terminar', () => {
    const fs = toyFs();
    tools(fs, 'a1-1', finished('>>> Skill: sdd-kit:sdd-tdd'));
    tools(fs, 'a1-2', finished('>>> Edit: src/informe.js'));
    expect(verdict(TABLE, OUT, ['brief'], fs).lines).toEqual(['a1 · 2/2 · umbral 2/2 · verde']);
  });

  it('da rojo y nombra la ejecución cuya primera llamada a Skill no encuentra la skill: el kit no cargó', () => {
    const fs = toyFs();
    tools(fs, 'd1-1', finished('>>> Read: README.md'));
    tools(fs, 'd1-2', finished('>>> Skill: sdd-kit:sdd-explore\n<<< <tool_use_error>Unknown skill: sdd-kit:sdd-explore</tool_use_error>'));
    expect(verdict(TABLE, OUT, ['duda'], fs).lines).toEqual(['d1 · 1/2 · umbral 1/2 · rojo · el kit no cargó en d1-2']);
  });

  it('no da líneas con una tabla sin escenarios', () => {
    const fs = memoryFs();
    fs.write(TABLE, '| Id | Paso | Petición | Molde | Esperado | n | Umbral | Modelo | Procedencia |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- |\n');
    expect(verdict(TABLE, OUT, [], fs).lines).toEqual([]);
  });

  it('rechaza un paso desconocido', () => {
    expect(() => verdict(TABLE, OUT, ['nope'], toyFs())).toThrow(new BatteryError('paso desconocido: nope', 2));
  });
});

describe('verdict con las filas de la rúbrica que se comprueban', () => {
  const SCENARIOS = `| Id | Paso | Petición | Molde | Esperado | n | Umbral | Modelo | Procedencia |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| k1 | rc | Corta la release. | salas | \`cualquiera\` | 2 | 2/2 | sonnet | toy |
| k2 | rc | Corta la release. | salas | \`cualquiera\` | 2 | 1/2 | sonnet | toy |
`;
  const withRubric = (...rows: string[]) => {
    const fs = memoryFs();
    fs.write(TABLE, `${SCENARIOS}\n## Rúbrica\n\n| Fila | Escenarios | Falla si… |\n| --- | --- | --- |\n${rows.join('\n')}\n`);
    return fs;
  };
  const CHAINED = '>>> Bash: gh run list --workflow ci.yml; node --test 2>&1 | tail -8\n<<< ok';
  const CLEAN = '>>> Bash: gh run list --workflow ci.yml\n<<< ok';

  const said = (fs: MemoryFs, label: string, text: string) => fs.write(join(OUT, `${label}.texts.txt`), text);

  it.each([
    ['el emoji literal', '`text: /🦆/`'],
    ['el emoji escapado', '`text: /\\u{1F986}/`'],
    ['el emoji en una clase', '`text: /[🦆✋]/`'],
  ])('text: %s pasa con 🦆 en texts.txt y da rojo sin él', (_name, check) => {
    const fs = withRubric(`| D1 Pato | k1 | ${check} |`);
    for (const label of ['k1-1', 'k1-2']) tools(fs, label, finished(CLEAN));
    said(fs, 'k1-1', '🦆 Cambia el separador\n');
    said(fs, 'k1-2', 'Cambia el separador\n');
    const result = verdict(TABLE, OUT, [], fs);
    expect(result.lines[0]).toBe('k1 · 1/2 · umbral 2/2 · rojo · D1 falla en k1-2');
    expect(result.red).toBe(true);
  });

  it('text: con el emoji en todos los sujetos da verde: cuenta como comprobada por máquina', () => {
    const fs = withRubric('| D1 Pato | k1 | `text: /🦆/` |');
    for (const label of ['k1-1', 'k1-2']) {
      tools(fs, label, finished(CLEAN));
      said(fs, label, '🦆 Cambia el separador\n');
    }
    expect(verdict(TABLE, OUT, [], fs).lines[0]).toBe('k1 · 2/2 · umbral 2/2 · verde');
  });

  it('text: una fila en prosa junto a ella sigue sin contar como comprobada', () => {
    const fs = withRubric('| D1 Pato | k1 | `text: /🦆/` |', '| J1 Juicio | k1 | el 🦆 explica el cambio |');
    for (const label of ['k1-1', 'k1-2']) {
      tools(fs, label, finished(CLEAN));
      said(fs, label, '🦆 Cambia el separador\n');
    }
    expect(verdict(TABLE, OUT, [], fs).lines[0]).toBe(`k1 · 2/2 · umbral 2/2 · puerta verde · sin leer: J1 · en ${texts('k1')}`);
  });

  it('text: sin texts.txt da rojo, y lo que solo está en tools.txt no cuenta', () => {
    const fs = withRubric('| D1 Pato | k1 | `text: /🦆/` |');
    tools(fs, 'k1-1', finished('>>> Bash: echo 🦆\n<<< 🦆'));
    tools(fs, 'k1-2', finished(CLEAN));
    expect(verdict(TABLE, OUT, [], fs).lines[0]).toBe('k1 · 0/2 · umbral 2/2 · rojo · D1 falla en k1-1, k1-2');
  });

  it('text: casa una línea con CRLF', () => {
    const fs = withRubric('| D1 Pato | k1 | `text: /^🦆 fin$/` |');
    for (const label of ['k1-1', 'k1-2']) {
      tools(fs, label, finished(CLEAN));
      said(fs, label, 'antes\r\n🦆 fin\r\ndespués\r\n');
    }
    expect(verdict(TABLE, OUT, [], fs).lines[0]).toBe('k1 · 2/2 · umbral 2/2 · verde');
  });

  it('una fila «presente» tumba al sujeto que encadena el comando en la misma llamada', () => {
    const fs = withRubric('| K6 Sin suite | k1 | `tools: /node --test/` presente |');
    tools(fs, 'k1-1', finished(CLEAN));
    tools(fs, 'k1-2', finished(CHAINED));
    expect(verdict(TABLE, OUT, [], fs).lines[0]).toBe('k1 · 1/2 · umbral 2/2 · rojo · K6 falla en k1-2');
  });

  it('no cuenta lo que sale en un resultado o en el mensaje final: el sujeto no lo corrió', () => {
    const fs = withRubric('| K6 Sin suite | k1 | `tools: /node --test/` presente |');
    tools(fs, 'k1-1', finished(`>>> Read: operations.md\n<<< - **Suites**: \`node --test\`\n\n${CLEAN}`));
    tools(fs, 'k1-2', `${CLEAN}\n\n=== RESULTADO (1 turnos, 0.1 $)\nno he corrido node --test\n`);
    expect(verdict(TABLE, OUT, [], fs).lines[0]).toBe('k1 · 2/2 · umbral 2/2 · verde');
  });

  it('una llamada de varias líneas se mira entera', () => {
    const fs = withRubric('| K6 Sin suite | k1 | `tools: /node --test/` presente |');
    tools(fs, 'k1-1', finished('>>> Bash: gh run list\nnode --test\n<<< ok'));
    tools(fs, 'k1-2', finished(CLEAN));
    expect(verdict(TABLE, OUT, [], fs).lines[0]).toBe('k1 · 1/2 · umbral 2/2 · rojo · K6 falla en k1-1');
  });

  it('una fila «ausente» tumba al sujeto sin esa llamada, y una regex admite la alternativa escapada', () => {
    const fs = withRubric('| K1 Lee la CI | k1, k2 | `tools: /gh run\\|gh pr/` ausente |');
    tools(fs, 'k1-1', finished(CLEAN));
    tools(fs, 'k1-2', finished('>>> Read: README.md\n<<< gh run'));
    tools(fs, 'k2-1', finished('>>> Read: README.md\n<<< ok'));
    tools(fs, 'k2-2', finished(CLEAN));
    expect(verdict(TABLE, OUT, [], fs).lines).toEqual(['k1 · 1/2 · umbral 2/2 · rojo · K1 falla en k1-2', 'k2 · 1/2 · umbral 1/2 · verde · K1 falla en k2-1']);
  });

  it('puerta verde y nombra sus filas', () => {
    const fs = withRubric('| J1 Juicio | k1 | `tools.txt` tiene `node --test` |', '| J2 Otro | k1 | algo en prosa |');
    tools(fs, 'k1-1', finished(CHAINED));
    tools(fs, 'k1-2', finished(CHAINED));
    tools(fs, 'k2-1', finished(CHAINED));
    tools(fs, 'k2-2', finished(CHAINED));
    const result = verdict(TABLE, OUT, [], fs);
    expect(result.lines[0]).toBe(`k1 · 2/2 · umbral 2/2 · puerta verde · sin leer: J1, J2 · en ${texts('k1')}`);
    expect(result.red).toBe(false);
    expect(result.noEvidence).toBe(false);
  });

  it('nombra todas las filas de una celda «Fila» con varias', () => {
    const fs = withRubric('| S1, S2, R1 Juntas | k1 | algo en prosa |');
    for (const label of ['k1-1', 'k1-2']) tools(fs, label, finished(CLEAN));
    expect(verdict(TABLE, OUT, [], fs).lines[0]).toBe(`k1 · 2/2 · umbral 2/2 · puerta verde · sin leer: S1, S2, R1 · en ${texts('k1')}`);
  });

  it('file: una regex de dos líneas casa con CRLF', () => {
    const fs = withRubric('| R1 Retro | k1 | `file: walkthrough.md /^a\\nb$/` |');
    for (const label of ['k1-1', 'k1-2']) {
      tools(fs, label, finished(CLEAN));
      fs.write(join(OUT, label, 'walkthrough.md'), 'a\r\nb\r\n');
    }
    expect(verdict(TABLE, OUT, [], fs).lines[0]).toBe('k1 · 2/2 · umbral 2/2 · verde');
  });

  it('nombra solo las filas que cubren el escenario', () => {
    const fs = withRubric('| J1 Juicio | k1 | algo en prosa |');
    for (const label of ['k1-1', 'k1-2', 'k2-1', 'k2-2']) tools(fs, label, finished(CLEAN));
    expect(verdict(TABLE, OUT, [], fs).lines).toEqual([`k1 · 2/2 · umbral 2/2 · puerta verde · sin leer: J1 · en ${texts('k1')}`, 'k2 · 2/2 · umbral 1/2 · verde']);
  });

  it('un rojo y un «sin evidencia» no nombran filas sin leer', () => {
    const fs = withRubric('| J1 Juicio | k1, k2 | algo en prosa |', '| K6 Sin suite | k1 | `tools: /node --test/` presente |');
    tools(fs, 'k1-1', finished(CHAINED));
    tools(fs, 'k1-2', finished(CHAINED));
    tools(fs, 'k2-1', finished(CLEAN));
    expect(verdict(TABLE, OUT, [], fs).lines).toEqual(['k1 · 0/2 · umbral 2/2 · rojo · K6 falla en k1-1, k1-2', 'k2 · 1/2 · umbral 1/2 · sin evidencia · sin tools.txt: k2-2']);
  });

  it.each([
    ['todos', ['gate', 'gate']],
    ['todos menos k2', ['gate', 'verde']],
    ['todos menos k1 y k2', ['verde', 'verde']],
    ['k2, turno 2', ['verde', 'gate']],
    ['k1 (GREEN)', ['gate', 'verde']],
    ['ver arriba', ['gate', 'gate']],
    ['Todos menos k2', ['gate', 'verde']],
    ['`todos` menos k2', ['gate', 'verde']],
    ['Todos', ['gate', 'gate']],
  ])('una fila en prosa con Escenarios «%s» cubre lo que dice, y sin ids, todos', (cell, expected) => {
    const fs = withRubric(`| J1 Juicio | ${cell} | algo en prosa |`);
    for (const label of ['k1-1', 'k1-2', 'k2-1', 'k2-2']) tools(fs, label, finished(CLEAN));
    const states = verdict(TABLE, OUT, [], fs).lines.map((line: string) => line.split(' · ').slice(3).join(' · '));
    expect(states).toEqual(expected.map((state, i) => (state === 'gate' ? `puerta verde · sin leer: J1 · en ${texts(['k1', 'k2'][i])}` : state)));
  });

  const RETRO = '| R1 Retro | k1 | `file: walkthrough.md /^Retro: corrección repetida → /` |';
  const LINE = 'Retro: corrección repetida → fila';
  const kept = (fs: MemoryFs, label: string, text: string) => fs.write(join(OUT, label, 'walkthrough.md'), text);

  it('solo tools y file da verde', () => {
    const fs = withRubric(RETRO, '| K6 Sin suite | k1 | `tools: /node --test/` presente |');
    for (const label of ['k1-1', 'k1-2']) {
      tools(fs, label, finished(CLEAN));
      kept(fs, label, `# Walkthrough\n\n${LINE}\n`);
    }
    expect(verdict(TABLE, OUT, [], fs).lines[0]).toBe('k1 · 2/2 · umbral 2/2 · verde');
  });

  it('file: la línea solo en el chat da rojo', () => {
    const fs = withRubric(RETRO);
    tools(fs, 'k1-1', finished(CLEAN));
    kept(fs, 'k1-1', `${LINE}\n`);
    tools(fs, 'k1-2', `${CLEAN}\n\n=== RESULTADO (1 turnos, 0.1 $)\n${LINE}\n`);
    const result = verdict(TABLE, OUT, [], fs);
    expect(result.lines[0]).toBe('k1 · 1/2 · umbral 2/2 · rojo · R1 falla en k1-2');
    expect(result.red).toBe(true);
  });

  it('file: el fichero sin la línea da rojo', () => {
    const fs = withRubric(RETRO);
    for (const label of ['k1-1', 'k1-2']) tools(fs, label, finished(CLEAN));
    kept(fs, 'k1-1', `${LINE}\n`);
    kept(fs, 'k1-2', `no empieza: ${LINE}\n`);
    expect(verdict(TABLE, OUT, [], fs).lines[0]).toBe('k1 · 1/2 · umbral 2/2 · rojo · R1 falla en k1-2');
  });

  it('file: casa una línea con CRLF', () => {
    const fs = withRubric('| R1 Retro | k1 | `file: walkthrough.md /^Retro: fin$/` |');
    for (const label of ['k1-1', 'k1-2']) {
      tools(fs, label, finished(CLEAN));
      kept(fs, label, '# Walkthrough\r\nRetro: fin\r\nmás\r\n');
    }
    expect(verdict(TABLE, OUT, [], fs).lines[0]).toBe('k1 · 2/2 · umbral 2/2 · verde');
  });

  it('una fila «antes de» tumba al sujeto que corre lo primero sin haber corrido lo segundo', () => {
    const fs = withRubric('| W1 Orden | k1, k2 | `tools: /node --test/ antes de /pnpm (install\\|i)\\b/` |');
    tools(fs, 'k1-1', finished('>>> Bash: node --test\n<<< ERR_MODULE_NOT_FOUND\n\n>>> Bash: pnpm install\n<<< ok'));
    tools(fs, 'k1-2', finished('>>> Bash: pnpm install 2>&1 | tail -5; node --test\n<<< ok'));
    tools(fs, 'k2-1', finished('>>> Bash: node --test\n<<< ok'));
    tools(fs, 'k2-2', finished('>>> Read: README.md\n<<< node --test'));
    expect(verdict(TABLE, OUT, [], fs).lines).toEqual(['k1 · 1/2 · umbral 2/2 · rojo · W1 falla en k1-1', 'k2 · 1/2 · umbral 1/2 · verde · W1 falla en k2-1']);
  });

  it.each([
    ['con un orden cuya regex no compila', '| K6 Mal | k1 | `tools: /(/ antes de /x/` |', 'K6: comprobación mal escrita'],
    ['sin presente ni ausente', '| K6 Mal | k1 | `tools: /x/` |', 'K6: comprobación mal escrita'],
    ['con una regex que no compila', '| K6 Mal | k1 | `tools: /(/` presente |', 'K6: comprobación mal escrita'],
    ['con un escenario que no existe', '| K6 Mal | k9 | `tools: /x/` presente |', 'K6: escenario desconocido: k9'],
    ['file: con barras en el fichero', '| K6 Mal | k1 | `file: a/b.md /x/` |', 'K6: comprobación mal escrita'],
    ['file: sin regex', '| K6 Mal | k1 | `file: b.md` |', 'K6: comprobación mal escrita'],
    ['file: con una regex que no compila', '| K6 Mal | k1 | `file: b.md /(/` |', 'K6: comprobación mal escrita'],
    ['file: con un escenario que no existe', '| K6 Mal | k9 | `file: b.md /x/` |', 'K6: escenario desconocido: k9'],
    ['text: sin regex', '| K6 Mal | k1 | `text: x` |', 'K6: comprobación mal escrita'],
    ['text: con una regex que no compila', '| K6 Mal | k1 | `text: /(/` |', 'K6: comprobación mal escrita'],
    ['text: con un escenario que no existe', '| K6 Mal | k9 | `text: /x/` |', 'K6: escenario desconocido: k9'],
  ])('rechaza una comprobación %s: callada, no correría', (_name, row, message) => {
    expect(() => verdict(TABLE, OUT, [], withRubric(row))).toThrow(new BatteryError(message));
  });
});

describe('filas de escenario incompletas o con umbral incoherente', () => {
  const withRow = (row: string) => {
    const fs = toyFs();
    fs.write(TABLE, TOY.replace(/^\| r2 .*$/m, row));
    return fs;
  };
  const BAD = [
    ['Esperado vacío', '| r2 | roadmap | Reordena. | salas |  | 1 | 1/1 | opus | toy |', 'r2: celda vacía en Esperado'],
    ['n vacía', '| r2 | roadmap | Reordena. | salas | `ninguna` |  | 1/1 | opus | toy |', 'r2: celda vacía en n'],
    ['Umbral vacío', '| r2 | roadmap | Reordena. | salas | `ninguna` | 1 |  | opus | toy |', 'r2: celda vacía en Umbral'],
    ['Modelo vacío', '| r2 | roadmap | Reordena. | salas | `ninguna` | 1 | 1/1 |  | toy |', 'r2: celda vacía en Modelo'],
    ['fila corta', '| r2 | roadmap | Reordena. | salas | `ninguna` | 1 |', 'r2: celda vacía en Umbral'],
    ['Id vacío', '|  | roadmap | Reordena. | salas | `ninguna` | 1 | 1/1 | opus | toy |', 'fila 2: celda vacía en Id'],
    ['denominador distinto de n', '| r2 | roadmap | Reordena. | salas | `ninguna` | 3 | 2/2 | opus | toy |', 'r2: Umbral 2/2 no es <k>/3 (n = 3)'],
    ['numerador mayor que n', '| r2 | roadmap | Reordena. | salas | `ninguna` | 2 | 3/2 | opus | toy |', 'r2: Umbral 3/2 no es <k>/2 (n = 2)'],
    ['umbral sin forma k/n', '| r2 | roadmap | Reordena. | salas | `ninguna` | 2 | dos | opus | toy |', 'r2: Umbral dos no es <k>/2 (n = 2)'],
  ];

  it.each(BAD)('%s da un BatteryError con el id y la columna', (_name, row, message) => {
    expect(() => verdict(TABLE, OUT, [], withRow(row))).toThrow(new BatteryError(message));
    expect(() => planLines(TABLE, [], {}, SPEC, withRow(row))).toThrow(new BatteryError(message));
  });

  it('también al lanzar', async () => {
    const fake = fakeDeps(withRow(BAD[6][1]));

    await expect(runBattery(env({}), CWD, fake.deps)).rejects.toThrow(new BatteryError(BAD[6][2]));
  });
});

describe('la cabecera de battery.mjs', () => {
  const lines = readFileSync(resolve(import.meta.dirname, '../../../../tests/headless/battery.mjs'), 'utf8').split(/\r?\n/);
  const header = lines.slice(0, lines.findIndex((line) => !line.startsWith('//'))).join('\n');

  it.each(['git archive', 'SUBJECT_CAP acumula entre fases', 'el id de un escenario choca dentro de una fase', 'ya existe', 'puerta verde', 'file:', 'text:'])('nombra «%s»', (text) => {
    expect(header).toContain(text);
  });
});

describe('las baterías reales', () => {
  const batteries = resolve(import.meta.dirname, '../../../../tests/batteries');
  const names = readdirSync(batteries, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  it.each(names)('verdict lee la rúbrica de %s sin tomar ninguna fila por mal escrita', (name) => {
    const fs = memoryFs();
    fs.write(TABLE, readFileSync(join(batteries, name, 'battery.md'), 'utf8'));
    expect(verdict(TABLE, OUT, [], fs).lines.length).toBeGreaterThan(0);
  });
});

describe('la batería de sdd-propose', () => {
  const real = resolve(import.meta.dirname, '../../../../tests/batteries/sdd-propose/battery.md');
  const judged = (first: string, second: string) => {
    const fs = memoryFs();
    fs.write(TABLE, readFileSync(real, 'utf8'));
    tools(fs, 'ws3-1', finished('>>> Skill: sdd-kit:sdd-propose\n\n>>> Bash: pnpm install --frozen-lockfile\n<<< ok\n\n>>> Bash: node --test\n<<< ok'));
    tools(fs, 'ws3-2', finished(`>>> Skill: sdd-kit:sdd-propose\n\n>>> Bash: ${first}\n<<< ok\n\n>>> Bash: ${second}\n<<< ok`));
    return lineOf(verdict(TABLE, OUT, ['setup-lockfile'], fs).lines, 'ws3');
  };

  it('da rojo a ws3 con node --test antes de pnpm install (ticket de la 0224 §2)', () => {
    expect(judged('node --test 2>&1 | tail -8', 'pnpm install --offline')).toBe('ws3 · 1/2 · umbral 2/2 · rojo · WS3 falla en ws3-2');
  });

  it('da puerta verde a ws3 con pnpm install antes de node --test: WS y L las lee el hilo', () => {
    expect(judged('pnpm install --offline', 'node --test')).toBe(`ws3 · 2/2 · umbral 2/2 · puerta verde · sin leer: WS, L · en ${texts('ws3')}`);
  });
});

describe('la batería de sdd-archive', () => {
  it('declara K6 como comprobación, con lo que da el rc2 de la 0257: 1/2', () => {
    const fs = memoryFs();
    const real = resolve(import.meta.dirname, '../../../../tests/batteries/sdd-archive/battery.md');
    fs.write(TABLE, readFileSync(real, 'utf8'));
    tools(fs, 'rc2-1', finished('>>> Bash: gh run list --workflow ci.yml --branch develop -L 1\n<<< ok\n\n=== RESULTADO\nno he corrido `node --test`'));
    tools(fs, 'rc2-2', finished('>>> Bash: gh run list --workflow ci.yml --branch develop -L 1 2>&1; node --test 2>&1 | tail -8\n<<< ok'));
    expect(lineOf(verdict(TABLE, OUT, [], fs).lines, 'rc2')).toContain('K6 falla en rc2-2');
  });
});

interface LaunchRequest {
  subjectSh: string;
  args: string[];
  env: Record<string, string | undefined>;
}

function fakeDeps(fs: MemoryFs) {
  const log: string[] = [];
  const launched: LaunchRequest[] = [];
  let chain: Promise<unknown> = Promise.resolve();
  const deps = {
    fs,
    log: (line: string) => log.push(line),
    wait: async () => undefined,
    isAlive: () => false,
    lock: <T>(_path: string, body: () => Promise<T>): Promise<T> => {
      const result = chain.then(body);
      chain = result.catch(() => undefined);
      return result;
    },
    launch: (request: LaunchRequest) => {
      launched.push(request);
      const [, label, , out] = request.args;
      fs.write(join(out, `${label}.tools.txt`), finished('>>> Skill: sdd-kit:sdd-roadmap'));
      return { pid: 1, exited: Promise.resolve(0) };
    },
    processes: async () => [],
    every: () => () => undefined,
    kill: () => undefined,
    syntaxError: (_path: string): string | null => null,
  };
  return { deps, log, launched };
}

const env = (overrides: Record<string, string> = {}) => ({
  BATTERY_DIR: DIR,
  SPEC_DIR: SPEC,
  PHASE: 'battery',
  RUNS_DIR: RUNS,
  KIT_DIR: KIT,
  SUBJECT_CAP: '20',
  COST_CAP: '20',
  DRY_RUN: '1',
  ...overrides,
});

describe('runBattery', () => {
  it('no lanza ningún sujeto si subject.mjs no compila, y da la línea del error', async () => {
    const fake = fakeDeps(toyFs());
    const checked: string[] = [];
    fake.deps.syntaxError = (path: string) => {
      checked.push(path);
      return `${path}:39\nSyntaxError: Invalid or unexpected token`;
    };
    const subject = join(DIR, 'subject.mjs');
    await expect(runBattery(env(), CWD, fake.deps)).rejects.toMatchObject({ code: 1, message: `subject.mjs no compila:\n${subject}:39\nSyntaxError: Invalid or unexpected token` });
    expect(checked).toEqual([subject]);
    expect(fake.launched).toEqual([]);
  });

  it('lanza solo el tramo pedido, cada índice con el modelo de su escenario', async () => {
    const fs = toyFs();
    const fake = fakeDeps(fs);
    const code = await runBattery(env({ STEPS: 'roadmap' }), CWD, fake.deps);
    expect(fake.launched.map((request) => [request.args[1], request.env.MODEL, request.env.SUBJECT])).toEqual([
      ['r2-1', 'opus', '1'],
      ['r1-1', 'sonnet', '1'],
      ['r1-2', 'sonnet', '2'],
    ]);
    expect(fake.launched[0].subjectSh).toBe(join(DIR, 'subject.mjs'));
    expect(fake.log.slice(-2)).toEqual(['r1 · 2/2 · umbral 2/2 · verde', 'r2 · 1/1 · umbral 1/1 · verde']);
    expect(code).toBe(0);
  });

  it('no relanza una batería cuyas etiquetas ya tienen salida en su fase', async () => {
    const fs = toyFs();
    tools(fs, 'r1-1', finished('marca'));
    const fake = fakeDeps(fs);
    await expect(runBattery(env({ STEPS: 'roadmap' }), CWD, fake.deps)).rejects.toThrow(`ya existe r1-1 en ${OUT}: borra esa carpeta, cambia PHASE o reanuda con --resume`);
    expect(fake.launched).toEqual([]);
  });

  it('con SCENARIOS lanza un solo sujeto sin abortar por la salida guardada de otro, y da solo su veredicto', async () => {
    const fs = toyFs();
    tools(fs, 'r2-1', finished('>>> Skill: sdd-kit:sdd-propose'));
    const fake = fakeDeps(fs);
    const code = await runBattery(env({ SCENARIOS: 'f1' }), CWD, fake.deps);
    expect(fake.launched.map((request) => request.args[1])).toEqual(['f1-1']);
    expect(fake.log.filter((line) => / · umbral /.test(line)).map((line) => line.split(' ')[0])).toEqual(['f1']);
    expect(code).toBe(1);
  });

  it('SCENARIOS da el código solo de lo filtrado: un rojo guardado de otro no lo tiñe', async () => {
    const fs = toyFs();
    tools(fs, 'f1-1', finished('>>> Skill: sdd-kit:sdd-roadmap'));
    const fake = fakeDeps(fs);
    expect(await runBattery(env({ SCENARIOS: 'r2' }), CWD, fake.deps)).toBe(0);
    expect(fake.launched.map((request) => request.args[1])).toEqual(['r2-1']);
  });

  it('SCENARIOS rechaza un id que no está en la tabla', async () => {
    const fake = fakeDeps(toyFs());
    await expect(runBattery(env({ SCENARIOS: 'nope' }), CWD, fake.deps)).rejects.toThrow(new BatteryError('escenario desconocido: nope', 2));
    expect(fake.launched).toEqual([]);
  });

  it('SCENARIOS y STEPS se cruzan: sin cruce, código 3 y ningún sujeto', async () => {
    const fake = fakeDeps(toyFs());
    await expect(runBattery(env({ STEPS: 'roadmap', SCENARIOS: 'f1' }), CWD, fake.deps)).rejects.toMatchObject({ code: 3, message: `sin escenarios en ${TABLE}` });
    expect(fake.launched).toEqual([]);
  });

  it('SCENARIOS y STEPS se cruzan: lanza solo lo que está en los dos', async () => {
    const fake = fakeDeps(toyFs());
    await runBattery(env({ STEPS: 'roadmap', SCENARIOS: 'r2 f1' }), CWD, fake.deps);
    expect(fake.launched.map((request) => request.args[1])).toEqual(['r2-1']);
  });

  it('SCENARIOS no relanza en silencio un escenario ya medido', async () => {
    const fs = toyFs();
    tools(fs, 'f1-1', finished('marca'));
    const fake = fakeDeps(fs);
    await expect(runBattery(env({ SCENARIOS: 'f1' }), CWD, fake.deps)).rejects.toThrow(`ya existe f1-1 en ${OUT}: borra esa carpeta, cambia PHASE o reanuda con --resume`);
    expect(fake.launched).toEqual([]);
  });

  it('pasa la copia del kit en ruta absoluta respecto al cwd de quien lanza', async () => {
    const fs = toyFs();
    const fake = fakeDeps(fs);
    await runBattery(env({ STEPS: 'directa', KIT_DIR: 'kit' }), CWD, fake.deps);
    expect(fake.launched[0].args[0]).toBe(KIT);
  });

  it('sale con 1 si algún escenario queda en rojo', async () => {
    const fs = toyFs();
    const fake = fakeDeps(fs);
    expect(await runBattery(env({ STEPS: 'feature' }), CWD, fake.deps)).toBe(1);
  });

  it('sale con 3 y lo dice si la tabla no tiene ningún escenario', async () => {
    const fs = toyFs();
    fs.write(TABLE, '| Id | Paso | Petición | Molde | Esperado | n | Umbral | Modelo | Procedencia |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- |\n');
    const fake = fakeDeps(fs);
    await expect(runBattery(env(), CWD, fake.deps)).rejects.toMatchObject({ code: 3, message: `sin escenarios en ${TABLE}` });
    expect(fake.launched).toEqual([]);
  });

  it('sale con 3 si falta evidencia y nada queda en rojo: no dice que todos pasan', async () => {
    const fake = fakeDeps(toyFs());
    fake.deps.launch = (request: LaunchRequest) => {
      fake.launched.push(request);
      return { pid: 1, exited: Promise.resolve(0) };
    };
    expect(await runBattery(env({ STEPS: 'directa' }), CWD, fake.deps)).toBe(3);
    expect(fake.log.at(-1)).toBe('t1 · 0/1 · umbral 1/1 · sin evidencia · sin tools.txt: t1-1');
  });
});

describe('N sustituye n y umbral', () => {
  const labels = (fake: ReturnType<typeof fakeDeps>) => fake.launched.map((request) => request.args[1]);

  it('N=1 con SCENARIOS=r1 lanza solo r1-1 y juzga 1/1', async () => {
    const fake = fakeDeps(toyFs());
    expect(await runBattery(env({ N: '1', SCENARIOS: 'r1' }), CWD, fake.deps)).toBe(0);
    expect(labels(fake)).toEqual(['r1-1']);
    expect(fake.log).toContain('r1 · 1/1 · umbral 1/1 · verde');
  });

  it('N=3 sobre r1 (n = 2) lanza r1-1, r1-2 y r1-3 con umbral 3/3', async () => {
    const fake = fakeDeps(toyFs());
    await runBattery(env({ N: '3', SCENARIOS: 'r1' }), CWD, fake.deps);
    expect(labels(fake)).toEqual(['r1-1', 'r1-2', 'r1-3']);
    expect(fake.log).toContain('r1 · 3/3 · umbral 3/3 · verde');
  });

  it('N=1 sin SCENARIOS ni STEPS deja n = 1 en todos', async () => {
    const fake = fakeDeps(toyFs());
    await runBattery(env({ N: '1' }), CWD, fake.deps);
    expect(labels(fake).sort()).toEqual(['a1-1', 'd1-1', 'f1-1', 'r1-1', 'r2-1', 't1-1']);
  });

  it('N=01 deja n = 1 y umbral 1/1', async () => {
    const fake = fakeDeps(toyFs());
    await runBattery(env({ N: '01', SCENARIOS: 'r1' }), CWD, fake.deps);
    expect(labels(fake)).toEqual(['r1-1']);
    expect(fake.log).toContain('r1 · 1/1 · umbral 1/1 · verde');
  });

  it.each(['0', 'dos', ' 1'])('N=%j para con código 2 y no lanza', async (value) => {
    const fake = fakeDeps(toyFs());
    await expect(runBattery(env({ N: value, SCENARIOS: 'r1' }), CWD, fake.deps)).rejects.toMatchObject({ code: 2, message: `N tiene que ser un entero positivo: ${value}` });
    expect(fake.launched).toEqual([]);
  });

  it('verdict con n juzga sobre esa n', () => {
    const fs = toyFs();
    tools(fs, 'r1-1', finished('>>> Skill: sdd-kit:sdd-roadmap'));
    expect(lineOf(verdict(TABLE, OUT, [], fs, { N: '1' }).lines, 'r1')).toBe('r1 · 1/1 · umbral 1/1 · verde');
  });

  it.each(['0', 'dos', ' 1'])('verdict con n = %j para con código 2', (value) => {
    expect(() => verdict(TABLE, OUT, [], toyFs(), { N: value })).toThrow(new BatteryError(`N tiene que ser un entero positivo: ${value}`, 2));
  });
});

describe('plan', () => {
  const PLAN_TABLE = join(CWD, 'plan', 'battery.md');
  const SPECS = join(CWD, 'specs');
  const OLD = '20261101-000000-feature-0001-x';
  const NEW = '20261102-000000-feature-0002-y';
  const PLAN = `| Id | Paso | Petición | Molde | Esperado | n | Umbral | Modelo | Procedencia |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| a1 | uno | Haz A. | salas | ninguna | 2 | 2/2 | sonnet | toy |
| b1 | uno | Haz B. | salas | ninguna | 1 | 1/1 | sonnet | toy |
`;

  interface Saved {
    folder: string;
    label: string;
    cost?: string;
    ask?: string;
  }

  function save(fs: MemoryFs, { folder, label, cost, ask = 'Haz A.' }: Saved) {
    const out = join(SPECS, folder, 'red', 'out');
    fs.write(join(out, `${label}.tools.txt`), cost === undefined ? '>>> Read: x\n' : `>>> Read: x\n=== RESULTADO (3 turnos, ${cost} $)\n`);
    if (ask !== '') fs.write(join(out, `${label}.state.txt`), `## petición\n${ask}\n## git status\n`);
  }

  function planFs(): MemoryFs {
    const fs = memoryFs();
    fs.write(PLAN_TABLE, PLAN);
    save(fs, { folder: OLD, label: 'a1-1', cost: '1.00' });
    save(fs, { folder: NEW, label: 'a1-1', cost: '0.40' });
    save(fs, { folder: NEW, label: 'a1-2', cost: '0.60' });
    return fs;
  }

  const plan = (fs: MemoryFs, env: Record<string, string> = {}) => planLines(PLAN_TABLE, [], env, SPECS, fs);
  const MEASURED = 'suma: 3 sujetos · coste previsto: 1.50 $ · sin precio medido: b1 (a 0.50 $, la media de los escenarios medidos)';
  const UNSAVED = 'suma: 3 sujetos · coste previsto: sin campañas guardadas de esta batería';

  it('suma y coste con la carpeta más reciente y la media para b1', () => {
    expect(plan(planFs())).toEqual(['a1 sonnet 2', 'b1 sonnet 1', MEASURED]);
  });

  it('no cuentan a10-1, otra petición, sin state.txt ni sin RESULTADO', () => {
    const fs = planFs();
    save(fs, { folder: NEW, label: 'a10-1', cost: '9.00' });
    save(fs, { folder: NEW, label: 'a1-3', cost: '9.00', ask: 'Otra cosa.' });
    save(fs, { folder: NEW, label: 'a1-4', cost: '9.00', ask: '' });
    save(fs, { folder: NEW, label: 'a1-5' });
    expect(plan(fs).at(-1)).toBe(MEASURED);
  });

  it('sin campañas que casen', () => {
    const fs = memoryFs();
    fs.write(PLAN_TABLE, PLAN);
    save(fs, { folder: NEW, label: 'a1-1', cost: '0.40', ask: 'Otra cosa.' });
    expect(plan(fs).at(-1)).toBe(UNSAVED);
  });

  it('sin la carpeta specs', () => {
    const fs = memoryFs();
    fs.write(PLAN_TABLE, PLAN);
    expect(plan(fs).at(-1)).toBe(UNSAVED);
  });

  it('con N=1, suma: 2 sujetos', () => {
    expect(plan(planFs(), { N: '1' }).at(-1)).toBe('suma: 2 sujetos · coste previsto: 1.00 $ · sin precio medido: b1 (a 0.50 $, la media de los escenarios medidos)');
  });

  it('con SCENARIOS=a1, suma: 2 sujetos · coste previsto: 1.00 $', () => {
    expect(plan(planFs(), { SCENARIOS: 'a1' })).toEqual(['a1 sonnet 2', 'suma: 2 sujetos · coste previsto: 1.00 $']);
  });

  it('lee también las campañas de changes/, junto a specs/', () => {
    const fs = planFs();
    const out = join(CWD, 'changes', '20261103-000000-feature-0003-z', 'red', 'out');
    fs.write(join(out, 'a1-1.tools.txt'), '>>> Read: x\n=== RESULTADO (3 turnos, 2.00 $)\n');
    fs.write(join(out, 'a1-1.state.txt'), '## petición\nHaz A.\n## git status\n');
    expect(plan(fs).at(-1)).toBe('suma: 3 sujetos · coste previsto: 6.00 $ · sin precio medido: b1 (a 2.00 $, la media de los escenarios medidos)');
  });

  it('salta ficheros sueltos de specs/', () => {
    const fs = planFs();
    fs.write(join(SPECS, NEW, 'spec.md'), '# Spec\n');
    fs.write(join(SPECS, 'README.md'), '# Specs\n');
    expect(plan(fs).at(-1)).toBe(MEASURED);
  });

  it.each(['0', 'dos', ' 1'])('con N=%j para con código 2', (value) => {
    expect(() => plan(planFs(), { N: value })).toThrow(new BatteryError(`N tiene que ser un entero positivo: ${value}`, 2));
  });
});

describe('run --resume', () => {
  const RESUME = { resume: true };
  const labels = (fake: ReturnType<typeof fakeDeps>) => fake.launched.map((request) => request.args[1]);

  function savedFs(...saved: string[]): MemoryFs {
    const fs = toyFs();
    for (const label of saved) tools(fs, label, finished('>>> Skill: sdd-kit:sdd-roadmap'));
    return fs;
  }

  it('lanza solo lo que falta', async () => {
    const fake = fakeDeps(savedFs('r1-1', 'r1-2', 'd1-1'));
    await runBattery(env({ SCENARIOS: 'r1 d1' }), CWD, fake.deps, RESUME);
    expect(labels(fake)).toEqual(['d1-2']);
    expect(fake.log).toContain('reanudo: guardadas 3, lanzo 1');
    expect(lineOf(fake.log, 'r1')).toBeDefined();
    expect(lineOf(fake.log, 'd1')).toBeDefined();
  });

  it('con todo guardado no lanza y da el veredicto', async () => {
    const fake = fakeDeps(savedFs('r1-1', 'r1-2', 'd1-1', 'd1-2'));
    await runBattery(env({ SCENARIOS: 'r1 d1' }), CWD, fake.deps, RESUME);
    expect(fake.launched).toEqual([]);
    expect(fake.log).toContain('reanudo: guardadas 4, lanzo 0');
    expect(lineOf(fake.log, 'r1')).toBe('r1 · 2/2 · umbral 2/2 · verde');
  });

  it('con N=1 mira solo -1', async () => {
    const fake = fakeDeps(savedFs('r1-1', 'd1-1'));
    await runBattery(env({ SCENARIOS: 'r1 d1', N: '1' }), CWD, fake.deps, RESUME);
    expect(fake.launched).toEqual([]);
    expect(fake.log).toContain('reanudo: guardadas 2, lanzo 0');
  });

  it.each([
    [true, []],
    [false, ['d1-2']],
  ])('una marca de d1-2 con el PID vivo = %s', async (alive, launched) => {
    const fs = savedFs('r1-1', 'r1-2', 'd1-1');
    fs.write(join(RUNS, 'dry', 'live', 'battery.d1-2'), '7\n');
    const fake = fakeDeps(fs);
    fake.deps.isAlive = () => alive;
    await runBattery(env({ SCENARIOS: 'r1 d1' }), CWD, fake.deps, RESUME);
    expect(labels(fake)).toEqual(launched);
  });

  it('cuenta lo guardado en el techo de la previsión', async () => {
    const fs = savedFs('r1-1', 'r1-2', 'd1-1');
    fs.write(join(SPEC, 'spec.md'), '# Spec\n\n## Previsión de coste\n\n| Tanda | Sujetos (batería) | $ |\n| --- | --- | --- |\n| Suma | 3 | 1 |\n');
    const fake = fakeDeps(fs);
    const { SUBJECT_CAP: _cap, ...withoutCap } = env({ SCENARIOS: 'r1 d1' });
    await runBattery(withoutCap, CWD, fake.deps, RESUME);
    expect(fake.launched).toEqual([]);
    expect(fake.log).toContain(`techo de 3 sujetos de la previsión de ${join(SPEC, 'spec.md')} alcanzado: decide el dev-lead; subirlo exige enmendar la spec`);
  });

  it('con SCENARIOS mira solo lo filtrado', async () => {
    const fake = fakeDeps(savedFs('f1-1', 'r1-1'));
    await runBattery(env({ SCENARIOS: 'r1' }), CWD, fake.deps, RESUME);
    expect(labels(fake)).toEqual(['r1-2']);
    expect(fake.log).toContain('reanudo: guardadas 1, lanzo 1');
  });
});

describe('la skill de una petición slash', () => {
  const GRILLING = finished('>>> Skill: sdd-kit:sdd-grilling');
  const judgeF1 = (state: string | null, text = GRILLING) => {
    const fs = toyFs();
    tools(fs, 'f1-1', text);
    if (state !== null) fs.write(join(OUT, 'f1-1.state.txt'), state);
    return verdict(TABLE, OUT, ['feature'], fs).lines[0].split(' · ')[1];
  };

  it.each([
    ['## petición\n/sdd-kit:sdd-propose añade el motivo\n', '1/1'],
    ['## petición\r\n/sdd-kit:sdd-propose\r\n', '1/1'],
    ['## petición\n/sdd-propose\n', '0/1'],
    ['## petición\n/clear\n', '0/1'],
    ['## petición\nAñade un filtro.\n', '0/1'],
    ['## git status\n', '0/1'],
    ['## petición\n/sdd-kit:sdd-nope\n', '0/1'],
  ])('state.txt %j → f1 %s', (state, passed) => {
    expect(judgeF1(state)).toBe(passed);
  });

  it('sin state.txt manda la primera llamada a Skill', () => {
    expect(judgeF1(null)).toBe('0/1');
  });

  it('el slash de using-sdd no cuenta: manda la primera Skill que no es using-sdd', () => {
    expect(judgeF1('## petición\n/sdd-kit:using-sdd\n', finished('>>> Skill: sdd-kit:using-sdd\n>>> Skill: sdd-kit:sdd-propose'))).toBe('1/1');
  });
});

describe('verdict lee SCENARIOS y N como run (ticket de la 0310 §4)', () => {
  const real = (name: string) => {
    const fs = memoryFs();
    fs.write(TABLE, readFileSync(resolve(import.meta.dirname, `../../../../tests/batteries/${name}/battery.md`), 'utf8'));
    return fs;
  };

  it('con SCENARIOS=r4 y solo r4-1 da solo la línea de r4 del paso release de sdd-retro', () => {
    const fs = real('sdd-retro');
    tools(fs, 'r4-1', finished('>>> Skill: sdd-kit:sdd-end-release'));
    expect(verdict(TABLE, OUT, ['release'], fs, { SCENARIOS: 'r4' }).lines.map((line: string) => line.split(' ')[0])).toEqual(['r4']);
  });

  it('con N=2 y dos sujetos de fb1 da fb1 · 2/2', () => {
    const fs = real('sdd-feedback');
    for (const label of ['fb1-1', 'fb1-2']) tools(fs, label, finished('>>> Skill: sdd-kit:sdd-feedback'));
    expect(lineOf(verdict(TABLE, OUT, ['source'], fs, { N: '2' }).lines, 'fb1')).toMatch(/^fb1 · 2\/2 · umbral 2\/2 · /);
  });

  it('rechaza un escenario que no está en la tabla, como run', () => {
    expect(() => verdict(TABLE, OUT, [], toyFs(), { SCENARIOS: 'nope' })).toThrow(new BatteryError('escenario desconocido: nope', 2));
  });
});

describe('el techo de coste de la campaña', () => {
  const spent = (fs: MemoryFs, cost: string) => fs.write(join(RUNS, 'dry', 'red', 'out', 'x-1.tools.txt'), `=== RESULTADO (1 turnos, ${cost} $)\n`);

  it('con COST_CAP ya gastado en otras fases sale con 3 sin lanzar, y dice que el techo es de toda la campaña (ticket de la 0314 §1)', async () => {
    const fs = toyFs();
    spent(fs, '7.22');
    const fake = fakeDeps(fs);
    await expect(runBattery(env({ COST_CAP: '2' }), CWD, fake.deps)).rejects.toMatchObject({
      code: 3,
      message: `COST_CAP=2 es el techo de toda la campaña de ${join(RUNS, 'dry')}: van 7.22 $ gastados; pásalo como total, no por tanda`,
    });
    expect(fake.launched).toEqual([]);
  });

  it('con --resume y nada pendiente da el veredicto aunque el techo esté gastado', async () => {
    const fs = toyFs();
    spent(fs, '7.22');
    for (const label of ['r1-1', 'r1-2']) tools(fs, label, finished('>>> Skill: sdd-kit:sdd-roadmap'));
    const fake = fakeDeps(fs);
    expect(await runBattery(env({ SCENARIOS: 'r1', COST_CAP: '2' }), CWD, fake.deps, { resume: true })).toBe(0);
    expect(fake.log).toContain('r1 · 2/2 · umbral 2/2 · verde');
  });

  it('con --resume y algo pendiente sale con 3 si el techo está gastado', async () => {
    const fs = toyFs();
    spent(fs, '7.22');
    tools(fs, 'r1-1', finished('>>> Skill: sdd-kit:sdd-roadmap'));
    const fake = fakeDeps(fs);
    await expect(runBattery(env({ SCENARIOS: 'r1', COST_CAP: '2' }), CWD, fake.deps, { resume: true })).rejects.toMatchObject({ code: 3 });
    expect(fake.launched).toEqual([]);
  });
});

describe('el precio de plan de cada escenario', () => {
  const SPECS = join(CWD, 'specs');
  const saved = join(SPECS, '20261108-000000-feature-0310-x', 'red', 'out');

  function pricedFs(prices: Record<string, [string, string]>): MemoryFs {
    const fs = toyFs();
    for (const [label, [ask, cost]] of Object.entries(prices)) {
      fs.write(join(saved, `${label}.tools.txt`), `=== RESULTADO (3 turnos, ${cost} $)\n`);
      fs.write(join(saved, `${label}.state.txt`), `## petición\n${ask}\n`);
    }
    return fs;
  }

  const R1 = ['Apunta lo del filtro.', '0.28'] as [string, string];
  const firstCost = async (fs: MemoryFs, overrides: Record<string, string>) => {
    const fake = fakeDeps(fs);
    await runBattery(env({ N: '1', ...overrides }), CWD, fake.deps, { specsRoot: SPECS });
    return fake.launched[0].env.SUBJECT_COST;
  };

  it('no lanza el sujeto que el precio de plan de su escenario saca del techo (ticket de la 0310 §2)', async () => {
    const fs = pricedFs({ 'r1-1': R1 });
    fs.write(join(RUNS, 'dry', 'red', 'out', 'x-1.tools.txt'), '=== RESULTADO (1 turnos, 1.38 $)\n');
    const fake = fakeDeps(fs);
    await runBattery(env({ SCENARIOS: 'r1', SUBJECT_CAP: '8', COST_CAP: '1.58' }), CWD, fake.deps, { specsRoot: SPECS });
    expect(fake.launched).toEqual([]);
    expect(fake.log).toContain('techo de 1.58 $ alcanzado (1.38 $ gastados, 0 en curso a 0.28 $)');
  });

  it('una tanda de varios escenarios cuenta con el más caro', async () => {
    const fs = pricedFs({ 'r1-1': R1, 'f1-1': ['Añade un filtro.', '0.50'] });
    expect(await firstCost(fs, { SCENARIOS: 'r1 f1' })).toBe('0.5');
  });

  it('un escenario sin precio cuenta con la media de los medidos', async () => {
    const fs = pricedFs({ 'r1-1': R1, 'd1-1': ['Hay que mejorar las reservas.', '0.40'] });
    expect(await firstCost(fs, { SCENARIOS: 'f1' })).toBe('0.34');
  });

  it('un SUBJECT_COST explícito manda sobre el precio de plan', async () => {
    expect(await firstCost(pricedFs({ 'r1-1': R1 }), { SCENARIOS: 'r1', SUBJECT_COST: '0.05' })).toBe('0.05');
  });
});

describe('main', () => {
  it.each([
    ['plan', 'uso: node battery.mjs plan <battery.md> [paso…]'],
    ['field', 'uso: node battery.mjs field <battery.md> <id> <columna>'],
    ['verdict', 'uso: node battery.mjs verdict <battery.md> <out> [paso…]'],
  ])('%s sin ruta da su uso, no ERR_INVALID_ARG_TYPE', async (command, usage) => {
    // Como process.argv sin la ruta: el segundo elemento llega undefined.
    await expect(main([command, undefined])).rejects.toThrow(new BatteryError(usage));
  });

  it.each([
    [['verdict', TABLE] as [string, string], 'uso: node battery.mjs verdict <battery.md> <out> [paso…]'],
    [['field', TABLE, 'r1'] as [string, string, string], 'uso: node battery.mjs field <battery.md> <id> <columna>'],
  ])('%j da su uso si falta otro argumento obligatorio', async (args, usage) => {
    await expect(main(args)).rejects.toThrow(new BatteryError(usage));
  });
});

// La celda real: una copia de la regex aquí probaría otra que la que corre la batería.
describe('fila K de la batería del entrevistador', () => {
  const interviewer = readFileSync(join(import.meta.dirname, '../../../../tests/batteries/interviewer/battery.md'), 'utf8');
  const kCell = interviewer.match(/^\| K Carga \| [^|]+ \| (.+) \|$/m)?.[1] ?? '';
  const SCENARIO = `| Id | Paso | Petición | Molde | Esperado | n | Umbral | Modelo | Procedencia |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| k1 | x | Pensemos. | salas | \`cualquiera\` | 1 | 1/1 | sonnet | toy |
`;
  const loads = (toolsTxt: string) => {
    const fs = memoryFs();
    fs.write(TABLE, `${SCENARIO}\n## Rúbrica\n\n| Fila | Escenarios | Falla si… |\n| --- | --- | --- |\n| K Carga | k1 | ${kCell} |\n`);
    tools(fs, 'k1-1', toolsTxt);
    return !verdict(TABLE, OUT, [], fs).lines[0].includes('K falla en');
  };

  it.each([
    ['Skill', '>>> Skill: sdd-kit:sdd-grilling\n<<< ok'],
    ['Read entero', '>>> Read: D:/k/skills/sdd-grilling/SKILL.md\n<<< ok'],
    ['Read con barras de Windows', '>>> Read: D:\\k\\skills\\sdd-grilling\\SKILL.md\n<<< ok'],
    ['cat seguido de otro comando', '>>> Bash: cd x && cat $K/skills/sdd-grilling/SKILL.md; head -40 test/app.test.js\n<<< ok'],
    ['cat al final, tras otro cat', '>>> Bash: K=x; cat $K/skills/sdd-propose/references/spec-writing.md; cat $K/skills/sdd-grilling/SKILL.md\n<<< ok'],
    ['Get-Content entero', '>>> PowerShell: Get-Content D:\\k\\skills\\sdd-grilling\\SKILL.md\n<<< ok'],
    ['carga en una llamada que no es la primera', '>>> Read: a.md\n<<< x\n>>> Grep: y\n<<< z\n>>> Skill: sdd-kit:sdd-grilling\n<<< ok'],
  ])('K: %s casa', (_name, call) => {
    expect(loads(finished(call))).toBe(true);
  });

  it('K: Read en la última línea, sin salto, casa', () => {
    expect(loads('>>> Read: D:/k/skills/sdd-grilling/SKILL.md')).toBe(true);
  });

  it.each([
    ['Read con limit', '>>> Read: D:/k/skills/sdd-grilling/SKILL.md · offset=1 · limit=80\n<<< ok'],
    ['Read con solo limit, aunque cubra el fichero', '>>> Read: D:/k/skills/sdd-grilling/SKILL.md · limit=2000\n<<< ok'],
    ['Get-Content -Head', '>>> PowerShell: Get-Content D:\\k\\skills\\sdd-grilling\\SKILL.md -Head 30\n<<< ok'],
    ['Get-Content -First', '>>> PowerShell: Get-Content D:\\k\\skills\\sdd-grilling\\SKILL.md -First 30\n<<< ok'],
    ['cat con head', '>>> Bash: cat $K/skills/sdd-grilling/SKILL.md | head -80\n<<< ok'],
    ['cat de dos ficheros con head', '>>> Bash: cat $K/skills/sdd-grilling/SKILL.md $K/x.md | head -80\n<<< ok'],
    ['otro fichero que nombra sdd-grilling en su resultado', '>>> Bash: cat $K/skills/sdd-propose/references/spec-writing.md\n<<< Ask with `sdd-grilling` and its SKILL.md'],
    ['Grep', '>>> Grep: sdd-grilling\n<<< ok'],
    ['Get-Content -TotalCount', '>>> PowerShell: Get-Content D:\\k\\skills\\sdd-grilling\\SKILL.md -TotalCount 20\n<<< ok'],
    ['Get-Content -Tail', '>>> PowerShell: Get-Content -Tail 5 D:\\k\\skills\\sdd-grilling\\SKILL.md\n<<< ok'],
    ['cat redirigido', '>>> Bash: cat $K/skills/sdd-grilling/SKILL.md > x.txt\n<<< ok'],
    ['otro fichero con el mismo prefijo', '>>> Bash: cat $K/skills/sdd-grilling/SKILL.md.bak\n<<< ok'],
    ['otra skill con el mismo prefijo', '>>> Skill: sdd-kit:sdd-grilling-x\n<<< ok'],
  ])('K: %s no casa', (_name, call) => {
    expect(loads(finished(call))).toBe(false);
  });
});
