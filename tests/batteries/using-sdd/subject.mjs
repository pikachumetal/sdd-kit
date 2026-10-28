// Sujeto de la batería de using-sdd: una frase de battery.md sobre su molde (salas o ventas).
// Lo lanza tests/headless/battery.mjs run, con SUPERPOWERS_DIR: el sujeto no lleva el CLAUDE.md del dev-lead.
import { appendFileSync, cpSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { subjectCell } from '../../headless/battery.mjs';
import { initSubject } from '../../headless/lib.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const s = initSubject(process.argv.slice(2), 'using-sdd');
const cell = subjectCell(HERE, s);
const ASK = cell('Petición');
const SALAS_MARKER = '"channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}';
const VENTAS_MARKER = `${SALAS_MARKER}, "control": {"profile": "delegate", "maxParallelAgents": 3}, "merge": {"into": "develop", "noFf": true, "removeWorktree": false, "push": false}, "execution": "auto"`;

// i1 mide la init: el proyecto llega sin .docs/; i2, una init en curso, con sdd-kit.json con la clave init. t1 necesita la errata en el README.
// u1 lleva el marcador en 2.3.3, por debajo de la v2.3.4.md del kit: el hook avisa de migraciones pendientes.
function moldBase(mold, marker) {
  cpSync(join(HERE, `mold-${mold}`), s.R, { recursive: true });
  if (s.SC === 'i1') {
    rmSync(join(s.R, '.docs'), { recursive: true });
  } else if (s.SC === 'i2') {
    rmSync(join(s.R, '.docs'), { recursive: true });
    s.put('PRODUCT.md', '# Salas\n\n## Users\n\n- **Oficina**: reserva salas.\n');
    s.put('.docs/sdd/sdd-kit.json', '{"init": {"approved": ["PRODUCT.md"]}}\n');
  } else if (s.SC === 'u1') {
    s.put('.docs/sdd/sdd-kit.json', `{"version": "2.3.3", ${marker}}\n`);
  } else {
    s.putKitMarker(marker);
  }
  if (s.SC === 't1') appendFileSync(join(s.R, 'README.md'), 'Consulta las recervas libres con `libres <franja>`.\n');
  s.git('init', '-q', '-b', 'main');
  s.commit(`feat: base del molde ${mold}`);
  s.git('checkout', '-q', '-b', 'develop');
}

const markers = { salas: SALAS_MARKER, ventas: VENTAS_MARKER };
const mold = cell('Molde');
if (!markers[mold]) s.die(`molde desconocido en battery.md: ${s.SC}`);
moldBase(mold, markers[mold]);

s.env.MAX_TURNS ||= '8';
await s.launch(ASK);
s.save(`## petición\n${ASK}\n## git status\n${s.git('status', '--short')}## git log\n${s.git('log', '--oneline', '--all')}`);
