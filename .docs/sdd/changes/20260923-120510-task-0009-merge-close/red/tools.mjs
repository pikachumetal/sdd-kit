// Extracto de un stream-json: cada tool call con el principio de su resultado, y el mensaje final. Sin rutas locales.
// Con --clean <run>, filtra la entrada estándar con la misma limpieza (para state.txt).
import { readFileSync } from 'node:fs';

const cleanMode = process.argv[2] === '--clean';
const [streamPath, runPath] = cleanMode ? [0, process.argv[3]] : process.argv.slice(2);
const runVariants = [runPath, runPath.replaceAll('/', '\\'), runPath.replace(/^\/([a-z])\//, (_, d) => `${d.toUpperCase()}:/`)];
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

if (cleanMode) {
  process.stdout.write(clean(readFileSync(0, 'utf8')));
  process.exit(0);
}
const describe = (block) => {
  const input = block.input ?? {};
  return input.command ?? input.skill ?? input.file_path ?? input.pattern ?? input.description ?? JSON.stringify(input);
};
const resultText = (block) => (Array.isArray(block.content) ? block.content.map((c) => c.text ?? '').join('') : String(block.content ?? ''));

for (const line of readFileSync(streamPath, 'utf8').split('\n')) {
  if (!line.trim()) continue;
  const event = JSON.parse(line);
  for (const block of event.message?.content ?? []) {
    if (block.type === 'tool_use') console.log(`\n>>> ${block.name}: ${clean(describe(block))}`);
    if (block.type === 'tool_result') console.log(`<<< ${clean(resultText(block)).slice(0, 600)}`);
  }
  if (event.type === 'result') console.log(`\n=== RESULTADO (${event.num_turns} turnos, ${event.total_cost_usd} $)\n${clean(event.result ?? '')}`);
}
