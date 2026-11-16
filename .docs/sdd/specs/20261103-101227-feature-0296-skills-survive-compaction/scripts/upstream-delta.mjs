import { readFileSync } from 'node:fs';
// Uso: node upstream-delta.mjs "<ficheros 7.0.0 separados por coma>" "<ficheros 7.0.1 separados por coma>"
// Frases que existen en una versión y no en la otra, tras normalizar espacios y saltos de línea.
const sentences = (files) => {
  const text = files.split(',').map((f) => readFileSync(f, 'utf8')).join('\n').replace(/\r\n/g, '\n');
  return new Set(
    text
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/\s+/g, ' ')
      .split(/(?<=[.!?:])\s+(?=[A-Z*`"(\-|])/)
      .map((s) => s.trim())
      .filter((s) => s.length > 25),
  );
};
const [a, b] = process.argv.slice(2);
const old = sentences(a);
const neu = sentences(b);
console.log('### Solo en 7.0.0 (quitado o reescrito)');
for (const s of old) if (!neu.has(s)) console.log('- ' + s.slice(0, 260));
console.log('\n### Solo en 7.0.1 (nuevo o reescrito)');
for (const s of neu) if (!old.has(s)) console.log('+ ' + s.slice(0, 260));
