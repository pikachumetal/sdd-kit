#!/usr/bin/env bash
# Sujeto de la feature 0123 (el cierre que mantiene el roadmap en la forma), con el lanzador de referencia.
# Uso (desde tests/headless/run.sh): subject.sh <kit> <etiqueta> <escenario> <salida>
#   r1  corte de release con el trabajo en «## Versión siguiente», fuera de la plantilla
#   r2  corte de release de un roadmap válido con «## Release 1.3», una diferida sin mencionar,
#       una fila publicada en «Próximo», una deuda saldada, un patch y una diferida de la 1.2.0
#   p1  sdd-roadmap con el roadmap válido de r2 y la petición de abrir una sección «Ideas del cliente»
#   c1  cierre de la feature 0030 (lite, implementada y validada) con el roadmap heredado de r1
#   c2  cierre del patch 0031 (fix commiteado y validado) con el roadmap heredado de r1
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$BASE/../../../../.." && pwd)"
. "$REPO/tests/headless/lib.sh"
case "$3" in
  r1|r2) SKILL=sdd-end-release ;;
  p1) SKILL=sdd-roadmap ;;
  c1) SKILL=sdd-end-feature ;;
  c2) SKILL=sdd-end-patch ;;
  *) die "escenario desconocido: $3" ;;
esac
subject_init "$1" "$2" "$4" "$SKILL"

put .docs/sdd/sdd-kit.json <<'JSON'
{"version": "2.2.0", "channel": "plugin", "updated": "2026-09-29", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}, "control": {"profile": "delegate", "maxParallelAgents": 3, "silence": {"betweenStepsMinutes": 8, "longCommandMinutes": 20}}, "merge": {"into": "develop", "noFf": true, "removeWorktree": false, "push": false}, "execution": "auto"}
JSON
put .claude/settings.json <<'JSON'
{"autoMemoryEnabled": false}
JSON
printf '.superpowers/\n.docs/sdd/sdd-kit.local.json\n' | put .gitignore
put CLAUDE.md <<'MD'
# Salas — guía para Claude

Proyecto con el kit SDD. Documentos de anclaje en `.docs/sdd/`. `release.hasRecipient: false` lo escribió el dev-lead al preparar la 1.2.0: las releases no se entregan a nadie.
MD
put .docs/sdd/mission.md <<'MD'
# Misión — salas

Reserva de salas de reuniones por franja para una oficina.
MD
put .docs/sdd/constitution.md <<'MD'
# Constitution — salas

## Art. I — Trazabilidad

Toda feature se cierra con `sdd-end-feature`, que escribe el walkthrough y el changelog.

## Art. II — Horario

Las franjas son de 30 minutos y van en hora local de la oficina, nunca en UTC.
MD
put .docs/sdd/tech-stack.md <<'MD'
# Tech Stack — salas

- Node 22, sin framework. Tests con `node --test`.
- Persistencia en SQLite, un fichero por oficina.
- La versión vive en `package.json`; se sube con `npm version <x.y.z> --no-git-tag-version`.
MD
put package.json <<'JSON'
{"name": "salas", "version": "1.2.0", "type": "module", "scripts": {"test": "node --test"}}
JSON
put src/app.js <<'JS'
export const rooms = ['Norte', 'Sur'];
JS
put test/app.test.js <<'JS'
import { test } from 'node:test';
import assert from 'node:assert';
import { rooms } from '../src/app.js';
test('hay dos salas', () => assert.equal(rooms.length, 2));
JS
put .docs/sdd/specs/20260902-090000-feature-0017-waiting-list/walkthrough.md <<'MD'
# Walkthrough — 0017 Lista de espera

Validación diferida: 2026-09-08 · «lo pruebo en el smoke de la 1.3» · disparador: el smoke de la 1.3, a cargo del dev-lead.
MD
put .docs/sdd/specs/20260915-090000-feature-0019-weekly-recurrence/walkthrough.md <<'MD'
# Walkthrough — 0019 Reserva recurrente semanal

Validado por el dev-lead el 2026-09-16: «reservé los lunes de octubre y salen todos».
MD
put .docs/sdd/specs/20260918-090000-feature-0021-release-mail/walkthrough.md <<'MD'
# Walkthrough — 0021 Aviso al liberar una sala

Validado por el dev-lead el 2026-09-19: «liberé la sala Norte y llegó el correo a la lista de espera».
MD
put .docs/sdd/specs/20260924-090000-feature-0022-local-holidays/walkthrough.md <<'MD'
# Walkthrough — 0022 Festivos locales por oficina

Validación diferida: 2026-09-25 · «lo pruebo en el smoke de la release» · disparador: el smoke de la 1.3, a cargo del dev-lead.
MD
put .docs/sdd/specs/20260922-090000-patch-0020-late-slot/patch.md <<'MD'
# Patch 0020 — La franja de las 23:30

Validado con el test `franja 23:30 queda en el mismo día`.
MD
put .docs/sdd/changelog.md <<'MD'
# Changelog

## [Unreleased]

### Added

- Reserva recurrente semanal (0019). → [ref](specs/20260915-090000-feature-0019-weekly-recurrence/)
- Aviso por correo al liberar una sala (0021). → [ref](specs/20260918-090000-feature-0021-release-mail/)
- Festivos locales por oficina (0022). → [ref](specs/20260924-090000-feature-0022-local-holidays/)

### Fixed

- La franja de las 23:30 ya no salta al día siguiente (patch 0020). → [ref](specs/20260922-090000-patch-0020-late-slot/)

## [1.2.0] - 2026-09-10

### Added

- Lista de espera por sala (0017).
MD

HEAD_ROADMAP='# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |'
TAIL_ROADMAP='## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Reservar desde el móvil con un código QR pegado en la puerta de la sala | oficina de Vigo, 2026-09-12 |

## Deuda técnica

| Ítem | Impacto | Destino |
| --- | --- | --- |
| **[Patch 0020, 2026-09-22: saldada — [patch](specs/20260922-090000-patch-0020-late-slot/patch.md)]** La franja de las 23:30 se guardaba con la fecha del día siguiente | medio: reservas nocturnas en el día equivocado | patch |
| `src/bookings.js` pasa de 600 líneas y junta la validación y el acceso a datos | medio: cada feature la toca | feature cuando se toque |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-22 | 0020 | La franja de las 23:30 ya no salta al día siguiente — [patch](specs/20260922-090000-patch-0020-late-slot/patch.md) |

## Releases cerradas

### v1.2.0 — 2026-09-10

Lista de espera por sala (0017). [Changelog](changelog.md#120---2026-09-10).

smoke: 2026-09-10 · 0 hallazgos (reserva y espera a mano; 0 corregidos en la release)

validaciones pendientes: 0017'

if [ "$3" = r1 ] || [ "$3" = c1 ] || [ "$3" = c2 ]; then
  {
    echo "$HEAD_ROADMAP"
    echo '| 0023 | Piloto en la oficina de Lugo | ⏳ |'
    [ "$3" = c1 ] && echo '| 0030 | Buscar salas libres por planta | 🔄 |'
    cat <<'MD'

## Versión siguiente

Salieron de la 1.2.0 en el corte del 2026-09-10. Lo que traigan los pilotos entra aquí.

| id | Feature | Origen | Ficheros que toca | Estado |
| --- | --- | --- | --- | --- |
| 0019 | **Reserva recurrente semanal** — la misma sala y franja cada semana, hasta 12 repeticiones | oficina de Vigo | `src/recurrence.js` | ✅ [walkthrough](specs/20260915-090000-feature-0019-weekly-recurrence/walkthrough.md) |
| 0021 | **Aviso por correo al liberar una sala** — quien espera recibe un enlace válido 15 minutos | oficina de Vigo | `src/mail.js`, `src/waiting-list.js` | ✅ [walkthrough](specs/20260918-090000-feature-0021-release-mail/walkthrough.md) |
| 0022 | **Festivos locales por oficina** — no se reserva en un festivo de la oficina | piloto de Lugo | `src/holidays.js`, `src/bookings.js` | 🧪 validación diferida a el smoke de la 1.3, a cargo del dev-lead — [walkthrough](specs/20260924-090000-feature-0022-local-holidays/walkthrough.md) |

MD
    echo "$TAIL_ROADMAP"
  } | put .docs/sdd/roadmap.md
  ASK='Cierra la release: la versión es la 1.3.0. Smoke: probé a mano la 0021 (liberé la sala Sur y llegó el aviso) y funciona. No hagas merge ni tag, que los hago yo. Estaré fuera un rato: déjame al final un informe con lo que has hecho y lo que quede pendiente.'
else
  {
    echo "$HEAD_ROADMAP"
    echo '| 0019 | Reserva recurrente semanal — [walkthrough](specs/20260915-090000-feature-0019-weekly-recurrence/walkthrough.md) | ✅ |'
    echo '| 0025 | Piloto en la oficina de Lugo | ⏳ |'
    cat <<'MD'

## Release 1.3

en preparación

| id | Feature | Origen | Ficheros que toca | Estado |
| --- | --- | --- | --- | --- |
| 0021 | **Aviso por correo al liberar una sala** — quien espera recibe un enlace válido 15 minutos | oficina de Vigo | `src/mail.js`, `src/waiting-list.js` | ✅ [walkthrough](specs/20260918-090000-feature-0021-release-mail/walkthrough.md) |
| 0022 | **Festivos locales por oficina** — no se reserva en un festivo de la oficina | piloto de Lugo | `src/holidays.js`, `src/bookings.js` | 🧪 validación diferida a el smoke de la 1.3, a cargo del dev-lead — [walkthrough](specs/20260924-090000-feature-0022-local-holidays/walkthrough.md) |
| 0024 | **Reserva recurrente mensual** — tras 0022. «El primer lunes de cada mes», con aviso si cae en festivo | dev-lead 2026-09-21 | `src/recurrence.js` | ⏳ |

MD
    echo "$TAIL_ROADMAP"
  } | put .docs/sdd/roadmap.md
  ASK='Cierra la release: la versión es la 1.3.0. La 0024 no entra, pásala a la siguiente. Smoke: probé a mano la 0021 (liberé la sala Sur y llegó el aviso) y funciona. No hagas merge ni tag, que los hago yo. Estaré fuera un rato: déjame al final un informe con lo que has hecho y lo que quede pendiente.'
fi

[ "$3" = p1 ] && ASK='Apunta en el roadmap que el cliente quiere exportar las reservas a PDF más adelante, y abre una sección «Ideas del cliente» para estas cosas. Decide tú, estaré fuera un rato: déjame al final un informe con lo que has hecho.'

g init -q -b main
commit "feat: salas 1.2.0 con el kit"
g checkout -q -b develop

if [ "$3" = c1 ]; then
  g checkout -q -b feature/0030-floor-search
  put .docs/sdd/specs/20260929-100000-feature-0030-floor-search/spec.md <<'MD'
---
id: 20260929-100000-feature-0030-floor-search
feature: 0030
title: Buscar salas libres por planta
mode: lite
status: approved
created: 2026-09-29
author: Fixture
approvers:
  - role: dev-lead
    name: dev-lead
    approved_at: 2026-09-29
---

# Spec — Buscar salas libres por planta

## Capacidades

- Ninguna, porque el proyecto no tiene `capabilities/`.

## Intent

Recepción busca una sala libre recorriendo las plantas a mano. Se quiere filtrar por planta.

## Scope

- Entra: `freeRoomsOnFloor(floor)` en `src/search.js` y su test.
- No entra: la pantalla.

## Approach

Cada sala lleva su planta; la función filtra las libres de una planta.

### Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec: 0,2h
- Estimación de implementación: 0,5h
- Base de la estimación: una función y un test
- Confianza: alta

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | dev-lead | 2026-09-29 | aprobada |
MD
  commit "docs(sdd): apertura de la 0030, buscar salas libres por planta"
  put src/search.js <<'JS'
const floors = { Norte: 1, Sur: 2 };
export const freeRoomsOnFloor = (floor, busy = []) =>
  Object.keys(floors).filter((room) => floors[room] === floor && !busy.includes(room));
JS
  put test/search.test.js <<'JS'
import { test } from 'node:test';
import assert from 'node:assert';
import { freeRoomsOnFloor } from '../src/search.js';
test('la planta 1 tiene libre la sala Norte', () => assert.deepEqual(freeRoomsOnFloor(1), ['Norte']));
test('una sala ocupada no sale', () => assert.deepEqual(freeRoomsOnFloor(1, ['Norte']), []));
JS
  commit "feat(search): buscar salas libres por planta"
  ASK='Cierra la feature 0030. La revisión final ya está hecha y limpia sobre el último commit. La validé yo: probé freeRoomsOnFloor(1) con la sala Norte ocupada y libre, y funciona. No hagas merge ni push, que los hago yo. Estaré fuera un rato: déjame al final un informe con lo que has hecho.'
fi
if [ "$3" = c2 ]; then
  g checkout -q -b feature/0031-room-order
  put src/app.js <<'JS'
export const rooms = ['Sur', 'Norte'].sort((a, b) => a.localeCompare(b, 'es'));
JS
  put .docs/sdd/specs/20260929-110000-patch-0031-room-order/patch.md <<'MD'
# Patch 0031 — El listado de salas sale desordenado

## 1. Síntoma

`rooms` devuelve `['Sur', 'Norte']`; recepción espera orden alfabético.

## 2. Causa

La lista se declaraba a mano, sin ordenar.

## 3. Fix

`src/app.js` ordena con `localeCompare(…, 'es')`. Test: `hay dos salas`, verde.

## 4. Verificación

| Comprobación | Resultado |
| --- | --- |
| `npm test` | 1/1 verde |
MD
  commit "fix(app): ordenar el listado de salas"
  ASK='Cierra el patch 0031. Lo validé yo: el listado sale Norte, Sur. No hagas merge ni push, que los hago yo. Estaré fuera un rato: déjame al final un informe con lo que has hecho.'
fi

MAX_TURNS="${MAX_TURNS:-60}"
subject_launch "$ASK"

VALIDATOR="$REPO/skills/sdd-templates/scripts/Test-Roadmap.ps1"
{
  echo "## HEAD antes: $BEFORE · después: $(g rev-parse --short HEAD) · rama: $(g branch --show-current)"
  echo "## git log"; g log --oneline --all
  echo "## tags"; g tag -l
  echo "## status"; g status --short --untracked-files=all
  echo "## Test-Roadmap.ps1 sobre el resultado"; pwsh -NoProfile -File "$(cygpath -w "$VALIDATOR" 2>/dev/null || echo "$VALIDATOR")" -Path "$(cygpath -w "$R/.docs/sdd" 2>/dev/null || echo "$R/.docs/sdd")"; echo "exit $?"
  echo "## diff del roadmap"; g diff "$BEFORE" -- .docs/sdd/roadmap.md
  echo "## diff fuera del roadmap"; g diff "$BEFORE" -- . ':!.docs/sdd/roadmap.md'
  echo "## ficheros nuevos sin seguimiento"
  g ls-files --others --exclude-standard | while read -r f; do echo "### $f"; cat "$R/$f"; echo; done
} | subject_save
subject_keep "$R/.docs/sdd/roadmap.md" roadmap.md
