import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

function ficheros(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? ficheros(join(dir, e.name)) : [join(dir, e.name)],
  );
}

test('ningún script de scripts/ corre con bash', () => {
  const conBash = ficheros('scripts').filter((f) => {
    const primera = readFileSync(f, 'utf8').split('\n')[0];
    return f.endsWith('.sh') || /\b(ba|z)?sh\b/.test(primera);
  });
  assert.deepEqual(conBash, []);
});

test('scripts/deploy.mjs imprime desplegado', () => {
  const salida = execFileSync('node', ['scripts/deploy.mjs'], { encoding: 'utf8' });
  assert.equal(salida.trim(), 'desplegado');
});
