import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const raiz = new URL('../scripts/', import.meta.url);

function ficheros(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? ficheros(join(dir, e.name)) : [join(dir, e.name)]
  );
}

test('ningún script de scripts/ corre con bash', () => {
  const conBash = ficheros(raiz.pathname.replace(/^\/([A-Za-z]:)/, '$1')).filter((f) => {
    const primera = readFileSync(f, 'utf8').split('\n')[0];
    return f.endsWith('.sh') || /^#!.*\b(ba)?sh\b/.test(primera);
  });
  assert.deepEqual(conBash, []);
});

test('deploy corre con node e imprime desplegado', () => {
  const salida = execFileSync(process.execPath, [new URL('deploy.mjs', raiz).pathname.replace(/^\/([A-Za-z]:)/, '$1')], { encoding: 'utf8' });
  assert.equal(salida.trim(), 'desplegado');
});
