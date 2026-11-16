// Transcript de cada sujeto: turnos del usuario o de la persona, texto del agente y sus llamadas, intercalados.
// Uso: node transcript.mjs <runs de la fase> <out de la fase>
// texts.txt numera por mensaje del agente y tools.txt no lleva turnos: el lector necesita las dos cosas juntas.
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const EXTRACT = fileURLToPath(new URL('../../headless/extract.mjs', import.meta.url));
const ARG_MAX = 160;
const PERSONA_TOTAL = /^conversación con persona/;

const lastLine = (path) => (existsSync(path) ? readFileSync(path, 'utf8').trimEnd().split(/\r?\n/).at(-1) : undefined);

export function parseStream(text) {
  const events = [];
  for (const line of text.split(/\r?\n/).filter((l) => l.trim())) {
    try {
      events.push(JSON.parse(line));
    } catch {
      return { events, cut: true };
    }
  }
  return { events, cut: false };
}

// El rango de un Read dice si el sujeto leyó el fichero entero.
const readRange = (input) => ['offset', 'limit'].filter((key) => input[key] !== undefined).map((key) => ` · ${key}=${input[key]}`).join('');

// Solo se corta el volcado JSON: la llamada entera dice qué fichero lee el sujeto.
function describeCall(block) {
  const input = block.input ?? {};
  const known = input.command ?? input.skill ?? input.file_path ?? input.pattern ?? input.query ?? input.url ?? input.description;
  const text = known === undefined ? JSON.stringify(input).replaceAll(/\s+/g, ' ').slice(0, ARG_MAX) : `${known}${block.name === 'Read' ? readRange(input) : ''}`.replaceAll(/\s+/g, ' ');
  return `> ${block.name}: ${text}`;
}

function renderAssistant(event) {
  const out = [];
  for (const block of event.message?.content ?? []) {
    if (block.type === 'text' && block.text.trim()) out.push(`## agente\n${block.text.trim()}`);
    if (block.type === 'tool_use') out.push(describeCall(block));
  }
  return out;
}

export function userTurns(runsDir, label) {
  const turns = [{ who: 'usuario', text: lastLine(join(runsDir, `${label}.args`)) ?? '(sin petición)' }];
  const personas = readdirSync(runsDir).filter((f) => f.startsWith(`${label}.persona-`) && f.endsWith('.json')).sort((a, b) => personaIndex(a) - personaIndex(b));
  if (personas.length > 0) return turns.concat(personas.map((f) => ({ who: 'persona', text: JSON.parse(readFileSync(join(runsDir, f), 'utf8')).result ?? '' })));
  const second = lastLine(join(runsDir, `${label}.resume.args`));
  return second ? turns.concat({ who: 'usuario', text: second }) : turns;
}

const personaIndex = (file) => Number(/\.persona-(\d+)\.json$/.exec(file)[1]);

// Cada llamada a claude -p abre con un system:init; un aviso de tarea en segundo plano también reabre la sesión con otro init,
// justo tras su task_notification. Solo el init que sigue a un result (o el primero) es un turno nuevo del usuario.
const isInit = (event) => event.type === 'system' && event.subtype === 'init';
const isNotification = (event) => event.type === 'system' && event.subtype === 'task_notification';

export function render({ events, cut }, turns) {
  const lines = [];
  let turn = -1;
  let last = 'result';
  for (const event of events.filter((e) => !e.parent_tool_use_id)) {
    if (isInit(event) && last === 'result') {
      turn += 1;
      if (turns[turn]) lines.push(`\n# turno ${turn + 1}\n## ${turns[turn].who}\n${turns[turn].text}`);
    } else if (isInit(event)) lines.push('(aviso de una tarea en segundo plano)');
    if (event.type === 'assistant') lines.push(...renderAssistant(event));
    if (isNotification(event)) last = 'notification';
    if (event.type === 'result' && !PERSONA_TOTAL.test(event.result ?? '')) last = 'result';
  }
  if (cut) lines.push('(stream cortado)');
  return `${lines.join('\n')}\n`;
}

function cleaned(text, runPath) {
  const result = spawnSync(process.execPath, [EXTRACT, 'clean', runPath], { input: text, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`extract.mjs clean salió con ${result.status}: ${result.stderr.trim()}`);
  return result.stdout;
}

export function main(runsDir, outDir) {
  const labels = readdirSync(runsDir).filter((f) => f.endsWith('.jsonl')).map((f) => f.slice(0, -'.jsonl'.length));
  for (const label of labels) {
    const text = render(parseStream(readFileSync(join(runsDir, `${label}.jsonl`), 'utf8')), userTurns(runsDir, label));
    writeFileSync(join(outDir, `${label}.transcript.txt`), cleaned(text, join(runsDir, label)));
  }
  return labels.length;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const [runsDir, outDir] = process.argv.slice(2);
  if (!runsDir || !outDir) {
    console.error('uso: node transcript.mjs <runs de la fase> <out de la fase>');
    process.exit(2);
  }
  console.log(`transcripts: ${main(runsDir, outDir)}`);
}
