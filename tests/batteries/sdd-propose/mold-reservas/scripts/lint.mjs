import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
const tabs = source.split('\n').filter((line) => line.includes('\t')).length;
if (tabs > 0) {
  console.error(`lint: ${tabs} líneas con tabuladores en src/app.js`);
  process.exit(1);
}
console.log('lint: sin hallazgos');
