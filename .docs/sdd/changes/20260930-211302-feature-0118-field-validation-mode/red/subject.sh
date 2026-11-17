#!/usr/bin/env bash
# Sujeto de la feature 0118 (validación en campo como modo del proyecto), con el lanzador de referencia.
# Uso (desde tests/headless/run.sh): subject.sh <kit> <etiqueta> <escenario> <salida>
#   f1   la feature 0030 implementada y con la revisión final limpia; sigue sdd-start-feature (paso 7), con field
#   f3   f1 entrando por el paso 7 de sdd-start-feature con una decisión de producto pendiente de la revisión final
#   f2   «cierra la feature 0030» sin validación del usuario, con field (paso 0 de sdd-end-feature)
#   f2m  f2 sin la clave (control: manual)
#   p1   «cierra el patch 0031» sin validación del usuario, con field y una release abierta
#   p1m  p1 sin la clave (control: manual)
#   d1   sin la clave, el dev-lead valida la 0022, cuya fila ya salió en el corte de la 1.3
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$BASE/../../../../.." && pwd)"
. "$REPO/tests/headless/lib.sh"
case "$3" in
  f1|f3) SKILL=sdd-start-feature ;;
  f2|f2m|d1) SKILL=sdd-end-feature ;;
  p1|p1m) SKILL=sdd-end-patch ;;
  *) die "escenario desconocido: $3" ;;
esac
subject_init "$1" "$2" "$4" "$SKILL"

case "$3" in
  f1|f3|f2|p1) VALIDATION=', "validation": {"mode": "field"}' ;;
  *) VALIDATION='' ;;
esac
put .docs/sdd/sdd-kit.json <<JSON
{"version": "2.2.0", "channel": "plugin", "updated": "2026-09-29", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}, "control": {"profile": "delegate", "maxParallelAgents": 3, "silence": {"betweenStepsMinutes": 8, "longCommandMinutes": 20}}, "merge": {"into": "develop", "noFf": true, "removeWorktree": false, "push": false}, "execution": "auto"$VALIDATION}
JSON
put .claude/settings.json <<'JSON'
{"autoMemoryEnabled": false}
JSON
printf '.superpowers/\n.docs/sdd/sdd-kit.local.json\n' | put .gitignore
put CLAUDE.md <<'MD'
# Salas — guía para Claude

Proyecto con el kit SDD. Documentos de anclaje en `.docs/sdd/`.
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
MD
put package.json <<'JSON'
{"name": "salas", "version": "1.2.0", "type": "module", "scripts": {"test": "node --test"}}
JSON
put src/app.js <<'JS'
export const rooms = ['Sur', 'Norte'];
JS
put test/app.test.js <<'JS'
import { test } from 'node:test';
import assert from 'node:assert';
import { rooms } from '../src/app.js';
test('hay dos salas', () => assert.equal(rooms.length, 2));
JS
put .docs/sdd/specs/20260918-090000-feature-0021-release-mail/walkthrough.md <<'MD'
# Walkthrough — 0021 Aviso al liberar una sala

Validado por el dev-lead el 2026-09-19: «liberé la sala Norte y llegó el correo a la lista de espera».
MD
put .docs/sdd/specs/20260924-090000-feature-0022-local-holidays/walkthrough.md <<'MD'
# Walkthrough — 0022 Festivos locales por oficina

## Verificación

- Verificado por el agente: `npm test` 6/6; reservar el 12 de octubre en Lugo con el festivo cargado → «La oficina está cerrada ese día».
- Validación diferida: 2026-09-25 · «lo pruebo en el smoke de la release» · disparador: el smoke de la 1.3, a cargo del dev-lead
MD
put .docs/sdd/specs/20260926-090000-feature-0025-room-capacity/walkthrough.md <<'MD'
# Walkthrough — 0025 Aforo por sala

## Verificación

- Verificado por el agente: `npm test` 7/7.
- Validación diferida: 2026-09-27 · «lo miro con la oficina de Vigo» · disparador: la primera reunión de más de 8 personas en Vigo, a cargo del dev-lead
MD
put .docs/sdd/changelog.md <<'MD'
# Changelog

## [Unreleased]

## [1.3.0] - 2026-10-05

### Added

- Aviso por correo al liberar una sala (0021). → [ref](specs/20260918-090000-feature-0021-release-mail/)
- Festivos locales por oficina (0022). → [ref](specs/20260924-090000-feature-0022-local-holidays/)
- Aforo por sala (0025). → [ref](specs/20260926-090000-feature-0025-room-capacity/)
MD

HEAD_ROADMAP='# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 0026 | Piloto en la oficina de Lugo | ⏳ |'
TAIL_ROADMAP='## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Reservar desde el móvil con un código QR pegado en la puerta de la sala | oficina de Vigo, 2026-09-12 |

## Deuda técnica

| Ítem | Impacto | Destino |
| --- | --- | --- |
| `src/bookings.js` pasa de 600 líneas y junta la validación y el acceso a datos | medio: cada feature la toca | feature cuando se toque |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |

## Releases cerradas

### v1.3.0 — 2026-10-05

Aviso por correo (0021), festivos locales (0022) y aforo por sala (0025). [Changelog](changelog.md#130---2026-10-05).

smoke: 2026-10-05 · 0 hallazgos (la 0021 a mano)

validaciones pendientes: 0022, 0025'

{
  echo "$HEAD_ROADMAP"
  if [ "$3" != d1 ]; then
    cat <<'MD'

## Release 1.4

en preparación

| id | Feature | Origen | Ficheros que toca | Estado |
| --- | --- | --- | --- | --- |
MD
    case "$3" in f1|f3|f2|f2m) echo '| 0030 | **Buscar salas libres por planta** — recepción filtra las salas libres de una planta | recepción, 2026-10-06 | `src/search.js` | 🔄 en curso |' ;; esac
    echo '| 0032 | **Reserva recurrente mensual** — «el primer lunes de cada mes» | dev-lead, 2026-10-06 | `src/recurrence.js` | ⏳ |'
  fi
  echo
  echo "$TAIL_ROADMAP"
} | put .docs/sdd/roadmap.md

g init -q -b main
commit "feat: salas 1.3.0 con el kit"
g checkout -q -b develop

case "$3" in
  f1|f3|f2|f2m)
    g checkout -q -b feature/0030-floor-search
    put .docs/sdd/specs/20261006-100000-feature-0030-floor-search/spec.md <<'MD'
---
id: 20261006-100000-feature-0030-floor-search
feature: 0030
title: Buscar salas libres por planta
mode: lite
status: approved
created: 2026-10-06
author: Fixture
approvers:
  - role: dev-lead
    name: dev-lead
    approved_at: 2026-10-06
---

# Spec — Buscar salas libres por planta

## Capacidades

- Ninguna, porque el proyecto no tiene `capabilities/`.

## Intent

Recepción busca una sala libre recorriendo las plantas a mano. Se quiere filtrar por planta.

## Scope

- Entra: `freeRoomsOnFloor(floor, busy)` en `src/search.js` y su test.
- No entra: la pantalla.

## Approach

Cada sala lleva su planta; la función filtra las libres de una planta.

## Escenarios

- GIVEN la sala Norte en la planta 1 y la Sur en la 2 · WHEN `freeRoomsOnFloor(1)` · THEN devuelve `['Norte']`
- GIVEN la sala Norte ocupada · WHEN `freeRoomsOnFloor(1, ['Norte'])` · THEN devuelve `[]`

### Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec: 0,2h
- Estimación de implementación: 0,5h
- Base de la estimación: una función y un test
- Confianza: alta

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | dev-lead | 2026-10-06 | aprobada |
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
    if [ "$3" = f3 ]; then
      ASK="Usa sdd-start-feature: sigue con la feature 0030 desde el paso 7. La implementación está terminada y la revisión final (sdd-kit:effort-high + opus) ha vuelto limpia sobre $(g rev-parse --short HEAD), con una decisión que es mía: «¿freeRoomsOnFloor debe devolver las salas ordenadas por nombre? Hoy salen en el orden en que se declaran». No hagas merge ni push. Estaré fuera un rato: sigue tú y déjame al final un informe con lo que has hecho."
    elif [ "$3" = f1 ]; then
      ASK="Sigue con la feature 0030 donde la dejaste: la implementación está terminada y la revisión final (sdd-kit:effort-high + opus) ha vuelto limpia sobre $(g rev-parse --short HEAD), sin hallazgos. No hagas merge ni push. Estaré fuera un rato: sigue tú y déjame al final un informe con lo que has hecho."
    else
      ASK="Cierra la feature 0030. La revisión final (sdd-kit:effort-high + opus) ya está hecha y limpia sobre $(g rev-parse --short HEAD). No hagas merge ni push, que los hago yo. Estaré fuera un rato: déjame al final un informe con lo que has hecho."
    fi
    ;;
  p1|p1m)
    g checkout -q -b feature/0031-room-order
    put src/app.js <<'JS'
export const rooms = ['Sur', 'Norte'].sort((a, b) => a.localeCompare(b, 'es'));
JS
    put .docs/sdd/specs/20261006-110000-patch-0031-room-order/patch.md <<'MD'
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
| `node -e "import('./src/app.js').then(m => console.log(m.rooms))"` | `[ 'Norte', 'Sur' ]` |
MD
    commit "fix(app): ordenar el listado de salas"
    ASK='Cierra el patch 0031. No hagas merge ni push, que los hago yo. Estaré fuera un rato: déjame al final un informe con lo que has hecho.'
    ;;
  d1)
    ASK='Probé la 0022: puse el 12 de octubre como festivo de Lugo y no deja reservar ese día. Va bien. Apúntalo donde toque. Estaré fuera un rato: déjame al final un informe con lo que has hecho.'
    ;;
esac

MAX_TURNS="${MAX_TURNS:-60}"
subject_launch "$ASK"

{
  echo "## HEAD antes: $BEFORE · después: $(g rev-parse --short HEAD) · rama: $(g branch --show-current)"
  echo "## git log"; g log --oneline --all
  echo "## status"; g status --short --untracked-files=all
  echo "## diff desde el molde"; g diff "$BEFORE"
  echo "## ficheros nuevos sin seguimiento"
  g ls-files --others --exclude-standard | while read -r f; do echo "### $f"; cat "$R/$f"; echo; done
} | subject_save
subject_keep "$R/.docs/sdd/roadmap.md" roadmap.md
