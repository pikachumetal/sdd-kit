// Extractor de referencia de los sujetos headless: todo lo que se commitea de un sujeto pasa por aquí.
// Uso: node extract.mjs tools <stream.jsonl> <run>   tool calls con el principio de su resultado, y el mensaje final
//      node extract.mjs texts <stream.jsonl> <run>   mensajes de texto del agente, numerados por turno
//      node extract.mjs clean <run> < entrada         la misma limpieza sobre la entrada estándar (state.txt)
import { readFileSync } from 'node:fs';

const [mode, ...rest] = process.argv.slice(2);
const [streamPath, runPath] = mode === 'clean' ? [0, rest[0]] : rest;
if (!['tools', 'texts', 'clean'].includes(mode) || !runPath) {
  console.error('uso: extract.mjs tools|texts <stream> <run> · extract.mjs clean <run>');
  process.exit(2);
}
// La ruta de la campaña en sus formas: node la recibe como C:/… (MSYS convierte /c/… y /tmp/… al pasarla),
// y el stream la trae con \, con \\ de JSON, como /c/… o, bajo %TEMP%, como /tmp/… de Git Bash.
const toForward = (path) => path.replaceAll('\\', '/').replace(/^\/([a-z])\//i, (_, d) => `${d.toUpperCase()}:/`);
const run = toForward(runPath);
const temp = process.env.TEMP ? toForward(process.env.TEMP) : '';
const runVariants = [
  run.replaceAll('/', '\\\\'),
  run.replaceAll('/', '\\'),
  run,
  run.replace(/^([A-Z]):/i, (_, d) => `/${d.toLowerCase()}`),
  ...(temp && run.toLowerCase().startsWith(`${temp.toLowerCase()}/`) ? [`/tmp${run.slice(temp.length)}`] : []),
];
// El usuario sale del home, no de $USERNAME, que en Git Bash vale SYSTEM (ticket 0068 §5).
const user = (process.env.USERPROFILE ?? process.env.HOME ?? '').split(/[\\/]/).pop();
const escaped = user.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Home en sus formas Windows (\, \\ de JSON, /) y Git Bash (/c/…); luego el usuario suelto (ls -l, C--Users-<user>).
const homePattern = new RegExp(`(?:[A-Za-z]:|/[A-Za-z])(?:\\\\{1,2}|/)Users(?:\\\\{1,2}|/)${escaped}\\b`, 'gi');
const userPattern = new RegExp(`\\b${escaped}\\b`, 'g');
const clean = (text) => {
  let out = String(text);
  for (const variant of runVariants) out = out.replaceAll(variant, '<run>');
  return user ? out.replace(homePattern, '<home>').replace(userPattern, '<user>') : out;
};

if (mode === 'clean') {
  process.stdout.write(clean(readFileSync(0, 'utf8')));
  process.exit(0);
}

const describe = (block) => {
  const input = block.input ?? {};
  if (block.name === 'Agent') return `subagent_type=${input.subagent_type ?? '(sin tipo)'} model=${input.model ?? '(sin modelo)'} · ${input.description ?? ''}`;
  return input.command ?? input.skill ?? input.file_path ?? input.pattern ?? input.description ?? JSON.stringify(input);
};
const resultText = (block) => (Array.isArray(block.content) ? block.content.map((c) => c.text ?? '').join('') : String(block.content ?? ''));

let turn = 0;
for (const line of readFileSync(streamPath, 'utf8').split('\n')) {
  if (!line.trim()) continue;
  const event = JSON.parse(line);
  if (mode === 'texts') {
    if (event.type !== 'assistant') continue;
    turn += 1;
    for (const block of event.message?.content ?? []) {
      if (block.type === 'text' && block.text.trim()) console.log(`--- [${turn}]\n${clean(block.text.trim())}\n`);
    }
    continue;
  }
  for (const block of event.message?.content ?? []) {
    if (block.type === 'tool_use') console.log(`\n>>> ${block.name}: ${clean(describe(block))}`);
    if (block.type === 'tool_result') console.log(`<<< ${clean(resultText(block)).slice(0, 600)}`);
  }
  // Un stream puede traer más de un result: run.sh suma solo el último de cada sujeto (task 0055).
  if (event.type === 'result') console.log(`\n=== RESULTADO (${event.num_turns} turnos, ${event.total_cost_usd} $)\n${clean(event.result ?? '')}`);
}
