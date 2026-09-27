import { readFileSync, readdirSync } from 'node:fs';

const config = JSON.parse(readFileSync('.checkrc.json', 'utf8'));
const files = readdirSync('src').map((f) => `src/${f}`).filter((f) => !config.ignore.includes(f));
const MAGIC = /\b(?:[2-9]|\d{2,})\b/;
const STRINGS = /(['"`]).*?\1/g;

let failures = 0;
for (const file of files) {
  readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    if (line.trim().startsWith('//') || !MAGIC.test(line.replace(STRINGS, ''))) return;
    failures++;
    console.error(`check: número mágico en ${file}:${i + 1}: ${line.trim()}`);
  });
}
if (failures) {
  console.error(`\ncheck: ${failures} aviso(s). Si es un falso positivo, añade el fichero a "ignore" en .checkrc.json.`);
  process.exit(1);
}
console.log('check: ok');
