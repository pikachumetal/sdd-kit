# Molde de la campaña de la 0062: el repo de juguete salas (base de la 0044) con un roadmap por escenario.
# Usa g, put, commit y R de subject.sh.

base_files() {
  put README.md <<'EOF'
# salas

CLI de reservas de salas: `salas libres <franja>`, `salas reservar <sala> <franja>`, `salas cancelar <sala> <franja>`, `salas informe <mes>`.
EOF
  put .gitignore <<'EOF'
.superpowers/
EOF
  put src/slots.js <<'EOF'
export function reserve(room, slot) {
  return { room, slot };
}
EOF
  put src/report.js <<'EOF'
import { readFileSync } from 'node:fs';

// Convierte la duración de una fila de data/usage.csv a horas.
export function toHours(duration) {
  return parseFloat(duration);
}

export function usageReport(csvPath) {
  const rows = readFileSync(csvPath, 'utf8').trim().split('\n').slice(1);
  const totals = {};
  for (const row of rows) {
    const [room, duration] = row.split(',');
    totals[room] = (totals[room] ?? 0) + toHours(duration);
  }
  return Object.entries(totals).map(([room, hours]) => `${room} · ${hours} h`).join('\n');
}
EOF
  put data/usage.csv <<'EOF'
room,duration
Norte,2 h
Sur,1.5 h
Norte,1 h
EOF
  put tests/slots.test.js <<'EOF'
import { test } from 'node:test';
import assert from 'node:assert';
import { reserve } from '../src/slots.js';

test('reserva una sala en una franja', () => {
  assert.deepStrictEqual(reserve('Norte', '10-12'), { room: 'Norte', slot: '10-12' });
});
EOF
  put .docs/sdd/constitution.md <<'EOF'
# Constitution — salas

## Art. I — Commits

Tipo/scope en inglés, título y cuerpo en castellano, nunca title-only.

## Art. II — Tests

Suite: `node --test`. Todo verde antes de fusionar.
EOF
  put .docs/sdd/mission.md <<'EOF'
# Mission — salas

CLI interna para reservar las salas de reuniones de la oficina. Usuarios: el equipo de oficina y, desde este año, clientes externos que alquilan salas.
EOF
  put .docs/sdd/sdd-kit.json <<EOF
{"version": "1.1.0", "channel": "plugin", "ids": {"mode": "${IDS_MODE:-sequence}"}, "release": {"hasRecipient": true}, "control": {"profile": "delegate"}, "merge": {"into": "develop", "noFf": true, "removeWorktree": false}}
EOF
  put .docs/sdd/changelog.md <<'EOF'
# Changelog

## [Unreleased]

## [1.2.0] — 2026-09-10

### Added
- `salas informe <mes>`: horas de uso por sala.
EOF
}

# Roadmap con dos tasks pendientes, backlog y deuda: p1, p2, p3, p4, p6, p8 y p9.
roadmap_plain() {
  put .docs/sdd/roadmap.md <<'EOF'
# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 0012 | Validar el formato de la franja al reservar (`10-12`, no `1012`) | ⏳ |
| 0013 | Aforo de cada sala en `salas libres` | ⏳ |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| — | Recordatorio el día antes de una reserva | equipo de oficina |
| — | Reservas recurrentes (cada lunes) | equipo de oficina |

## Deuda técnica

| Ítem | Impacto | Destino |
| --- | --- | --- |
| `src/slots.js` no tiene tests de franjas límite (`00-24`) | bajo | task |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-12 | 0011 | `informe` contaba dos veces las reservas canceladas |

## Releases cerradas

### v1.2.0 — 2026-09-10
Informe de uso por sala.
EOF
}

# p5: cuatro filas pendientes para reordenar.
roadmap_four() {
  put .docs/sdd/roadmap.md <<'EOF'
# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 0012 | Validar el formato de la franja al reservar (`10-12`, no `1012`) | ⏳ |
| 0013 | Aforo de cada sala en `salas libres` | ⏳ |
| 0014 | Exportar las reservas a CSV | ⏳ |
| 0015 | Reservas recurrentes (cada lunes), sobre la franja validada | ⏳ |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| — | Recordatorio el día antes de una reserva | equipo de oficina |

## Deuda técnica

| Ítem | Impacto | Destino |
| --- | --- | --- |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-12 | 0011 | `informe` contaba dos veces las reservas canceladas |
EOF
}

# p7: la 0013 depende de la 0012, que sigue pendiente.
roadmap_dependency() {
  put .docs/sdd/roadmap.md <<'EOF'
# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 0012 | Validar el formato de la franja al reservar (`10-12`, no `1012`) | ⏳ |
| 0013 | Reservas recurrentes (cada lunes), tras 0012: usa su validación de franja | ⏳ |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |

## Deuda técnica

| Ítem | Impacto | Destino |
| --- | --- | --- |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-12 | 0011 | `informe` contaba dos veces las reservas canceladas |
EOF
}

# p10: una propuesta de facturación repartida en tres features, la primera ya cerrada.
proposal_files() {
  P=.docs/sdd/specs/20260915-090000-proposal-0020-billing
  put $P/proposal.md <<'EOF'
---
id: 20260915-090000-proposal-0020-billing
proposal: 0020
title: Facturación a clientes externos
created: 2026-09-15
---

# Propuesta — Facturación a clientes externos

## Por qué

Desde este año alquilamos salas a clientes externos y hoy se factura a mano en una hoja de cálculo.

## Reglas de negocio

- Tarifa por hora distinta para cada sala: Norte 40 €/h, Sur 25 €/h.
- Factura mensual: el día 1 se emite una factura por cliente con las reservas del mes anterior. Cliente Acme con 3 h en Norte y 2 h en Sur en agosto → factura del 1 de septiembre por 170 €.
- Impago: una factura sin pagar a los 30 días bloquea nuevas reservas del cliente.

## Capacidades que toca

`booking` (bloqueo por impago) y una nueva, `billing`.

## Reparto

| Orden | Feature | Estado |
| --- | --- | --- |
| 1 | 0021 — Tarifa por sala | ✅ |
| 2 | 0022 — Factura mensual | ⏳ |
| 3 | 0023 — Bloqueo por impago | ⏳ |
EOF
  put .docs/sdd/specs/20260916-100000-task-0021-room-rates/walkthrough.md <<'EOF'
---
task: 0021
proposal: 0020
status: done
---

# Walkthrough — Tarifa por sala

Cada sala tiene su tarifa por hora en `data/rates.csv` (Norte 40, Sur 25). Validado por el dev-lead el 2026-09-18.
EOF
  put .docs/sdd/roadmap.md <<'EOF'
# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 0012 | Validar el formato de la franja al reservar (`10-12`, no `1012`) | ⏳ |
| 0021 | Tarifa por sala — `proposal: 0020` | ✅ |
| 0022 | Factura mensual — `proposal: 0020`, tras 0021 | ⏳ |
| 0023 | Bloqueo por impago — `proposal: 0020`, tras 0022 | ⏳ |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |

## Deuda técnica

| Ítem | Impacto | Destino |
| --- | --- | --- |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
EOF
}
