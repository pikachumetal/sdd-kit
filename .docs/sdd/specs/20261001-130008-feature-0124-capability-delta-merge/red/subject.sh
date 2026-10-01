#!/usr/bin/env bash
# Sujeto de la feature 0124 (la fusión del delta de capacidades como script), con el lanzador de referencia.
# Uso (desde tests/headless/run.sh): subject.sh <kit> <etiqueta> <escenario> <salida>
#   f1  cierre de la feature 0031: solo el paso 4 de sdd-end-feature (fusionar el delta y validar)
#   p1  cierre del patch 0032: solo la parte «Capacidades» del paso 1 de sdd-end-patch
#   t1  completar el delta de una spec con cinco decisiones numeradas
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$BASE/../../../../.." && pwd)"
. "$REPO/tests/headless/lib.sh"
case "$3" in
  f1) SKILL=sdd-end-feature ;;
  p1) SKILL=sdd-end-patch ;;
  t1) SKILL=sdd-templates ;;
  *) die "escenario desconocido: $3" ;;
esac
subject_init "$1" "$2" "$4" "$SKILL"
FEATURE=.docs/sdd/specs/20261001-090000-feature-0031-cancelar-reserva
PATCH=.docs/sdd/specs/20261001-100000-patch-0032-reserva-a-nombre

put .docs/sdd/sdd-kit.json <<'JSON'
{"version": "2.2.0", "channel": "plugin", "updated": "2026-09-29", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}, "control": {"profile": "delegate", "maxParallelAgents": 3, "silence": {"betweenStepsMinutes": 8, "longCommandMinutes": 20}}, "merge": {"into": "develop", "noFf": true, "removeWorktree": false, "push": false}, "execution": "auto", "validation": {"mode": "manual"}}
JSON
put .claude/settings.json <<'JSON'
{"autoMemoryEnabled": false}
JSON
printf '.superpowers/\n.playwright-mcp/\n.docs/sdd/sdd-kit.local.json\n' | put .gitignore
put CLAUDE.md <<'MD'
# Guía para Claude

Proyecto con el kit SDD. Documentos de anclaje en `.docs/sdd/`.
MD
put .docs/sdd/mission.md <<'MD'
# Misión

Reserva de salas de reuniones por franja desde un CLI, para una oficina.
MD
put .docs/sdd/constitution.md <<'MD'
# Constitution

## Art. I — Trazabilidad

Toda feature se cierra con `sdd-end-feature`, y todo patch con `sdd-end-patch`.
MD
put .docs/sdd/tech-stack.md <<'MD'
# Tech Stack

- Node 22, sin framework. Tests con `node --test`. Lint de Markdown con markdownlint (MD012, MD022).
MD
put .docs/sdd/roadmap.md <<'MD'
# Roadmap

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 0031 | Cancelar una reserva desde el CLI | 🔄 |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |

## Deuda técnica

| Ítem | Impacto | Destino |
| --- | --- | --- |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |

## Releases cerradas
MD
put .docs/sdd/capabilities/bookings.md <<'MD'
# Capacidad — bookings

## Propósito

Reservar y consultar salas por franja horaria desde el CLI.

## Requisitos

### Reservar una franja

- GIVEN la sala Norte libre de 10 a 12
- WHEN `salas reservar Norte 10-12`
- THEN la reserva queda guardada y el CLI responde `Reservada Norte 10-12`

### Consultar salas libres

- GIVEN las salas Norte, Sur y Oeste, con Norte reservada de 10 a 12
- WHEN `salas libres 10-12`
- THEN lista `Sur` y `Oeste`, una por línea

## Reglas de la capacidad

- **Dónde viven los datos**: `data/bookings.json`.
- **Idioma de los nombres**: comandos y mensajes en castellano.
- **Límites**: una reserva dura como máximo 4 h.
- **Avisos**: aviso si la reserva pisa un festivo.
- **Regla ante conflicto**: no aplica.
MD
put src/app.js <<'JS'
export const rooms = ['Norte', 'Sur', 'Oeste'];
JS

spec_head() {
  cat <<'MD'
---
id: 20261001-090000-feature-0031-cancelar-reserva
feature: 0031
title: Cancelar una reserva
mode: full
status: approved
created: 2026-10-01
---

# Spec — Cancelar una reserva

## Capacidades

- Modificadas: `bookings` — añade «Cancelar una reserva», cambia «Reservar una franja» y quita «Consultar salas libres»

## Decisiones que he tomado yo — valida estas

MD
}

if [ "$3" = t1 ]; then
  {
    spec_head
    cat <<'MD'
1. `salas cancelar <sala> <franja>` cancela la reserva de esa franja.
2. Solo cancela quien hizo la reserva; otro usuario recibe `No es tu reserva`.
3. Con menos de 1 h de antelación se rechaza con `Demasiado tarde para cancelar`.
4. La franja cancelada vuelve a estar libre al momento.
5. Recepción puede cancelar cualquier reserva.

## Intent

Hoy una reserva no se puede cancelar desde el CLI: hay que pedírselo a recepción.

## Scope

- Entra: `salas cancelar`, con las reglas de las decisiones 2, 3 y 5.
- No entra: avisos por correo.

## Approach

Un subcomando nuevo en `src/app.js` que lee y escribe `data/bookings.json`.

## Delta de comportamiento

### Capacidad: `bookings`

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Ana | 2026-10-01 | aprobada |
MD
  } | put "$FEATURE/spec.md"
else
  {
    spec_head
    cat <<'MD'
1. La cancelación libera la franja al momento.
2. `salas libres` pasa a `salas agenda` (feature 0030): el requisito se quita de `bookings`.

## Intent

Hoy una reserva no se puede cancelar desde el CLI.

## Scope

- Entra: `salas cancelar`.
- No entra: avisos por correo.

## Approach

Un subcomando nuevo en `src/app.js`.

## Delta de comportamiento

### Capacidad: `bookings`

**ADDED — Cancelar una reserva**
- GIVEN la reserva Norte 10-12 de Ana
- WHEN `salas cancelar Norte 10-12`
- THEN la franja queda libre y el CLI responde `Cancelada Norte 10-12`
- AND la franja vuelve a ofrecerse en `salas reservar` al momento, por la decisión 1
- Se valida en: worktree con la base al día

**MODIFIED — Reservar una franja** (antes: «la reserva queda
guardada»)

- GIVEN la sala Norte libre de 10 a 12
- WHEN `salas reservar Norte 10-12`
- THEN la reserva queda guardada a nombre del usuario y el CLI responde `Reservada Norte 10-12`

**REMOVED — Consultar salas libres**
- motivo: lo cubre `salas agenda` (feature 0030)

**Reglas de la capacidad**
- **Avisos**: aviso si la reserva pisa un festivo; `Cancelada <sala> <franja>` al cancelar.

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Ana | 2026-10-01 | aprobada |
MD
  } | put "$FEATURE/spec.md"
  put "$FEATURE/walkthrough.md" <<'MD'
# Walkthrough — feature 0031

Validado: 2026-10-01 · «cancelo Norte 10-12 y vuelve a salir libre» (Ana).
MD
fi

if [ "$3" = p1 ]; then
  rm -rf "$R/$FEATURE"
  put "$PATCH/patch.md" <<'MD'
---
id: 20261001-100000-patch-0032-reserva-a-nombre
type: patch
patch: 0032
title: La reserva guarda el nombre del usuario
created: 2026-10-01
---

# Patch 0032 — La reserva guarda el nombre del usuario

## Capacidades

- Modificadas: `bookings` — cambia «Reservar una franja»

## 1. Síntoma

`salas reservar Norte 10-12` guardaba la reserva sin el usuario.

## 2. Causa raíz

`saveBooking` no recibía el usuario de la sesión.

## 3. Fix

`saveBooking(room, slot, user)`.

## 6. Delta de capacidad

### Capacidad: `bookings`

**MODIFIED — Reservar una franja** (antes: «la reserva queda
guardada»)

- GIVEN la sala Norte libre de 10 a 12
- WHEN `salas reservar Norte 10-12`
- THEN la reserva queda guardada a nombre del usuario y el CLI responde `Reservada Norte 10-12`
- Se valida en: worktree con la base al día
MD
fi

g init -q -b main
commit "feat: proyecto con el kit 2.2.0"
g checkout -q -b develop
case "$3" in
  f1) g checkout -q -b feature/0031-cancelar-reserva
      ASK="Estamos cerrando la feature 0031 (spec en \`$FEATURE/spec.md\`) con sdd-end-feature. El walkthrough y el tiempo ya están; haz solo el paso 4: lleva el delta de la spec a \`capabilities/\` y valida. No hagas los demás pasos ni commitees." ;;
  p1) g checkout -q -b patch/0032-reserva-a-nombre
      ASK="Estamos cerrando el patch 0032 (\`$PATCH/patch.md\`) con sdd-end-patch. El fix ya está commiteado. Haz solo la parte «Capacidades» del paso 1: lleva el delta de patch.md a \`capabilities/\` y valida. No hagas los demás pasos ni commitees." ;;
  t1) g checkout -q -b feature/0031-cancelar-reserva
      ASK="Completa la sección «Delta de comportamiento» de \`$FEATURE/spec.md\` para la capacidad bookings, con la forma de la plantilla del kit (skill sdd-templates). Solo esa sección: no toques nada más ni commitees." ;;
esac

MAX_TURNS="${MAX_TURNS:-40}"
subject_launch "$ASK"

ARTIFACT="$FEATURE/spec.md"; [ "$3" = p1 ] && ARTIFACT="$PATCH/patch.md"
VALIDATOR="$(cygpath -m "$REPO/skills/sdd-templates/scripts/Test-Capabilities.ps1" 2>/dev/null || echo "$REPO/skills/sdd-templates/scripts/Test-Capabilities.ps1")"
{
  echo "## HEAD antes: $BEFORE · después: $(g rev-parse --short HEAD) · rama: $(g branch --show-current)"
  echo "## status"; g status --short --untracked-files=all
  echo "## diff desde el molde"; g diff "$BEFORE"
  echo "## capabilities/bookings.md"; cat "$R/.docs/sdd/capabilities/bookings.md" 2>/dev/null
  echo "## líneas en blanco dobles"; awk 'prev=="" && $0=="" {n++} {prev=$0} END {print n+0}' "$R/.docs/sdd/capabilities/bookings.md"
  echo "## títulos sin línea en blanco detrás"; awk 'p ~ /^#{1,3} / && $0 != "" {n++} {p=$0} END {print n+0}' "$R/.docs/sdd/capabilities/bookings.md"
  echo "## citas de decisiones en el delta o la capacidad"; grep -nE '^- (THEN|AND|GIVEN|WHEN).*decisi(ó|o)n(es)? [0-9]' "$R/$ARTIFACT" "$R/.docs/sdd/capabilities/bookings.md" 2>/dev/null
  echo "## validador de la rama"; (cd "$R" && pwsh -NoProfile -File "$VALIDATOR" -Path .docs/sdd -Artifact "$ARTIFACT"; echo "exit $?")
} | subject_save
