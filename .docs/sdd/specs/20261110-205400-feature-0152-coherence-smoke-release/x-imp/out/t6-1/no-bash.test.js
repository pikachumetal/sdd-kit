import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const dir = new URL('../scripts/', import.meta.url);

function ficheros(carpeta) {
  return readdirSync(carpeta, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? ficheros(new URL(`${e.name}/`, carpeta)) : [new URL(e.name, carpeta)],
  );
}

test('ningún script de scripts/ corre con bash', () => {
  const conBash = ficheros(dir).filter((f) => {
    const primera = readFileSync(f, 'utf8').split('\n')[0];
    return f.pathname.endsWith('.sh') || /^#!.*\b(ba)?sh\b/.test(primera);
  });
  assert.deepEqual(conBash.map((f) => f.pathname), []);
});

test('node scripts/deploy.mjs imprime desplegado', () => {
  const salida = execFileSync(process.execPath, [join(dir.pathname.replace(/^\/(\w:)/, '$1'), 'deploy.mjs')], { encoding: 'utf8' });
  assert.equal(salida.trim(), 'desplegado');
});
