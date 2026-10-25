// Extractor de referencia de los sujetos headless: todo lo que se commitea de un sujeto pasa por aquí.
// Uso: node extract.mjs tools <stream.jsonl> <run>   tool calls con el principio de su resultado, y el mensaje final
//      node extract.mjs texts <stream.jsonl> <run>   mensajes de texto del agente, numerados por turno
//      node extract.mjs clean <run> < entrada         la misma limpieza sobre la entrada estándar (state.txt)
//      node extract.mjs last <stream.jsonl>           el texto del último result, sin limpiar: lo lee la persona, no se commitea
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const [mode, ...rest] = process.argv.slice(2);
if (mode === 'last') {
  const results = readFileSync(rest[0], 'utf8').split('\n').filter((line) => line.trim()).map((line) => JSON.parse(line)).filter((event) => event.type === 'result');
  process.stdout.write(results.at(-1)?.result ?? '');
  process.exit(0);
}
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
// El nombre y el email de git de la máquina: el sujeto los copia del contexto de la sesión (tickets de las features 0099 §1 y 0160).
// Sin los GIT_CONFIG_* que exporta subject_launch, que los tapan con Fixture.
const machineEnv = Object.fromEntries(Object.entries(process.env).filter(([key]) => !/^GIT_CONFIG_(COUNT|KEY_\d+|VALUE_\d+)$/.test(key)));
const gitConfig = (key) => {
  try {
    return execFileSync('git', ['config', key], { cwd: import.meta.dirname, env: machineEnv, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return ''; // sin la clave, git sale con 1
  }
};
const identity = [gitConfig('user.name'), gitConfig('user.email')].filter(Boolean);
// Sustituirla escondía que el sujeto había visto la identidad de la máquina: la salida no se guarda.
const write = (text) => {
  if (identity.some((value) => text.includes(value))) {
    console.error('la salida lleva el nombre o el email de git de la máquina: no se guarda');
    process.exit(3);
  }
  process.stdout.write(text);
};
const clean = (text) => {
  let out = String(text);
  for (const variant of runVariants) out = out.replaceAll(variant, '<run>');
  return user ? out.replace(homePattern, '<home>').replace(userPattern, '<user>') : out;
};

if (mode === 'clean') {
  write(clean(readFileSync(0, 'utf8')));
  process.exit(0);
}

const describe = (block) => {
  const input = block.input ?? {};
  // Las cabeceras ## del prompt: sin ellas, un despacho se leyó mal y se escribió un REFACTOR de más (ticket de la feature 0147 §3).
  if (block.name === 'Agent') {
    const headings = String(input.prompt ?? '').split(/\r?\n/).filter((line) => line.startsWith('## ')).map((line) => `\n    ${line}`);
    return `subagent_type=${input.subagent_type ?? '(sin tipo)'} model=${input.model ?? '(sin modelo)'} · ${input.description ?? ''}${headings.join('')}`;
  }
  return input.command ?? input.skill ?? input.file_path ?? input.pattern ?? input.description ?? JSON.stringify(input);
};
const resultText = (block) => (Array.isArray(block.content) ? block.content.map((c) => c.text ?? '').join('') : String(block.content ?? ''));

const lines = [];
let turn = 0;
for (const line of readFileSync(streamPath, 'utf8').split('\n')) {
  if (!line.trim()) continue;
  const event = JSON.parse(line);
  if (mode === 'texts') {
    if (event.type !== 'assistant') continue;
    turn += 1;
    for (const block of event.message?.content ?? []) {
      if (block.type === 'text' && block.text.trim()) lines.push(`--- [${turn}]\n${clean(block.text.trim())}\n`);
    }
    continue;
  }
  for (const block of event.message?.content ?? []) {
    if (block.type === 'tool_use') lines.push(`\n>>> ${block.name}: ${clean(describe(block))}`);
    if (block.type === 'tool_result') lines.push(`<<< ${clean(resultText(block)).slice(0, 600)}`);
  }
  // Un stream puede traer más de un result: run.sh suma solo el último de cada sujeto (task 0055).
  if (event.type === 'result') lines.push(`\n=== RESULTADO (${event.num_turns} turnos, ${event.total_cost_usd} $)\n${clean(event.result ?? '')}`);
}
write(lines.map((line) => `${line}\n`).join(''));
