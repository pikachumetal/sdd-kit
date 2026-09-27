// Extracto de un stream-json: cada tool call con el principio de su resultado, y el mensaje final. Sin rutas locales.
import { readFileSync } from 'node:fs';

const [streamPath, runPath] = process.argv.slice(2);
const runVariants = [runPath, runPath.replaceAll('/', '\\'), runPath.replace(/^\/([a-z])\//, (_, d) => `${d.toUpperCase()}:/`)];
const home = process.env.USERPROFILE ?? process.env.HOME ?? '';
const clean = (text) => {
  let out = String(text);
  for (const variant of runVariants) out = out.replaceAll(variant, '<run>');
  return home ? out.replaceAll(home, '<home>').replaceAll(home.replaceAll('\\', '/'), '<home>') : out;
};
const describe = (block) => {
  const input = block.input ?? {};
  if (block.name === "Agent") return `subagent_type=${input.subagent_type ?? "(sin tipo)"} model=${input.model ?? "(sin modelo)"} · ${input.description ?? ""}`;
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
