import { readFileSync, readdirSync } from 'node:fs';

const offending = readdirSync('test')
  .filter((name) => name.endsWith('.test.js'))
  .filter((name) => /\}\);\r?\ntest\(/.test(readFileSync(`test/${name}`, 'utf8')));

if (offending.length > 0) {
  console.error(`Falta una línea en blanco entre bloques test() en: ${offending.join(', ')}`);
  process.exit(1);
}
console.log('lint: sin avisos');
