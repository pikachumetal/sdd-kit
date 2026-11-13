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

function describeCall(block) {
  const input = block.input ?? {};
  const first = input.command ?? input.skill ?? input.file_path ?? input.pattern ?? input.query ?? input.url ?? input.description ?? JSON.stringify(input);
  return `> ${block.name}: ${String(first).replaceAll(/\s+/g, ' ').slice(0, ARG_MAX)}`;
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

export function render({ events, cut }, turns) {
  const lines = [];
  let turn = 0;
  const openTurn = () => turns[turn] && lines.push(`\n# turno ${turn + 1}\n## ${turns[turn].who}\n${turns[turn].text}`);
  openTurn();
  for (const event of events) {
    if (event.type === 'assistant') lines.push(...renderAssistant(event));
    if (event.type !== 'result' || PERSONA_TOTAL.test(event.result ?? '')) continue;
    turn += 1;
    openTurn();
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
