// Mensajes de texto del agente en un stream-json, en orden y numerados: los avisos de fase se leen aquí.
import { readFileSync } from 'node:fs';

const home = (process.env.USERPROFILE ?? process.env.HOME ?? '').replaceAll('\\', '/');
const homeForms = home ? [home, home.replaceAll('/', '\\'), home.replace(/^([A-Za-z]):/, (_, d) => `/${d.toLowerCase()}`), home.replace(/[:/]/g, '-')] : [];
const clean = (text) => homeForms.reduce((out, form) => out.replaceAll(form, '<home>'), text);

let turn = 0;
for (const line of readFileSync(process.argv[2], 'utf8').split('\n')) {
  if (!line.trim()) continue;
  const event = JSON.parse(line);
  if (event.type !== 'assistant') continue;
  turn += 1;
  for (const block of event.message?.content ?? []) {
    if (block.type === 'text' && block.text.trim()) console.log(`--- [${turn}]\n${clean(block.text.trim())}\n`);
  }
}
