import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const raiz = new URL('../scripts', import.meta.url).pathname.replace(/^\/(\w:)/, '$1');

function ficheros(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? ficheros(join(dir, e.name)) : [join(dir, e.name)]
  );
}

function usaBash(ruta) {
  const primera = readFileSync(ruta, 'utf8').split('\n')[0];
  return ruta.endsWith('.sh') || /^#!.*\b(ba)?sh\b/.test(primera);
}

test('ningún script de scripts/ corre con bash', () => {
  const conBash = ficheros(raiz).filter(usaBash);
  assert.deepEqual(conBash, []);
});

test('deploy.mjs imprime desplegado', () => {
  const salida = execFileSync('node', [join(raiz, 'deploy.mjs')], { encoding: 'utf8' });
  assert.equal(salida.trim(), 'desplegado');
});
