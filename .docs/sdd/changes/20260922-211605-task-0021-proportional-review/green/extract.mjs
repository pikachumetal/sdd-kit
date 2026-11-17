// Extrae de un stream-json de claude -p las tool calls (una por línea), el texto final, el coste y la duración.
// Uso: node extract.mjs <stream.jsonl> <dir-salida>
import { readFileSync, writeFileSync } from 'node:fs';
const [, , streamPath, outDir] = process.argv;
const events = readFileSync(streamPath, 'utf8').split('\n').filter(Boolean).map((line) => {
  try { return JSON.parse(line); } catch { return null; }
}).filter(Boolean);
const summarize = (input) => input.command ?? input.file_path ?? input.skill ?? input.pattern ?? input.description ?? JSON.stringify(input).slice(0, 200);
const tools = events.filter((e) => e.type === 'assistant')
  .flatMap((e) => e.message.content.filter((c) => c.type === 'tool_use'))
  .map((c) => `${c.name}: ${String(summarize(c.input)).replace(/\s+/g, ' ').slice(0, 300)}`);
const result = events.find((e) => e.type === 'result') ?? {};
writeFileSync(`${outDir}/tools.txt`, tools.join('\n') + '\n');
writeFileSync(`${outDir}/final.md`, (result.result ?? '(sin resultado)') + '\n');
writeFileSync(`${outDir}/cost.txt`, `cost_usd=${result.total_cost_usd} duration_ms=${result.duration_ms} turns=${result.num_turns}\n`);
