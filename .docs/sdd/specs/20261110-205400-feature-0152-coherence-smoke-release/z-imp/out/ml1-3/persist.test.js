import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const app = resolve('src/app.js');

function inFreshDirectory(body) {
  const dir = mkdtempSync(join(tmpdir(), 'salas-'));
  const cli = (...args) => spawnSync(process.execPath, [app, ...args], { cwd: dir, encoding: 'utf8' }).stdout.trim();
  try {
    body(cli);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test('una cancelación sobrevive a la siguiente ejecución', () => {
  inFreshDirectory((cli) => {
    assert.equal(cli('cancelar', 'Norte', 'lun'), 'cancelada Norte lun');
    assert.equal(cli('libres', '10:00-12:00'), 'Norte, Sur');
  });
});

test('sin cancelaciones guardadas, la reserva sigue activa', () => {
  inFreshDirectory((cli) => {
    assert.equal(cli('libres', '10:00-12:00'), 'Sur');
  });
});

test('usar run desde código no toca el disco', () => {
  const dir = mkdtempSync(join(tmpdir(), 'salas-'));
  try {
    const script = `import { run } from ${JSON.stringify(pathToFileURL(app).href)}; run('cancelar', ['Norte', 'lun']);`;
    spawnSync(process.execPath, ['--input-type=module', '-e', script], { cwd: dir });
    assert.deepEqual(readdirSync(dir), []);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
