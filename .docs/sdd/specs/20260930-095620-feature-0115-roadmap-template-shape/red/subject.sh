#!/usr/bin/env bash
# Sujeto de la migración del roadmap a la forma de la plantilla, con el lanzador de referencia.
# Uso (desde tests/headless/run.sh): subject.sh <kit> <etiqueta> <escenario> <salida>
#   m1  un roadmap desordenado (sección de trabajo fuera de la plantilla, filas ya publicadas, tabla de
#       validaciones diferidas, decisiones en prosa, deuda saldada y duplicada) y la petición de ordenarlo
#       (RED: kit sin el paso de migración, petición directa; GREEN: «ponme el proyecto al día»)
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$BASE/../../../../.." && pwd)"
. "$REPO/tests/headless/lib.sh"
subject_init "$1" "$2" "$4" sdd-init-brownfield
[ "$3" = m1 ] || die "escenario desconocido: $3"

put .docs/sdd/sdd-kit.json <<'JSON'
{"version": "2.2.0", "channel": "plugin", "updated": "2026-09-29", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}, "control": {"profile": "delegate", "maxParallelAgents": 3, "silence": {"betweenStepsMinutes": 8, "longCommandMinutes": 20}}, "merge": {"into": "develop", "noFf": true, "removeWorktree": false, "push": false}, "execution": "auto"}
JSON
put .claude/settings.json <<'JSON'
{"autoMemoryEnabled": false, "extraKnownMarketplaces": {"superpowers-marketplace": {"source": {"source": "github", "repo": "obra/superpowers-marketplace"}}}}
JSON
printf '.playwright-mcp/\n.superpowers/\n.docs/sdd/sdd-kit.local.json\n' | put .gitignore
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
put .docs/sdd/changelog.md <<'MD'
# Changelog

## [Unreleased]

## [1.2.0] - 2026-09-20

### Added

- Aviso por correo al liberar una sala (0021).

### Fixed

- La franja de las 23:30 ya no salta al día siguiente (patch 0020).

## [1.1.0] - 2026-09-05

### Added

- Reserva recurrente semanal (0019).
- Lista de espera por sala (0017).
- Exportar las reservas a CSV (0016).
MD
put .docs/sdd/specs/20260901-090000-feature-0016-csv-export/walkthrough.md <<'MD'
# Walkthrough — 0016 Exportar a CSV

Validación diferida: a la primera exportación real de la oficina de Vigo, a cargo de Marta.
MD
put .docs/sdd/specs/20260902-090000-feature-0017-waiting-list/walkthrough.md <<'MD'
# Walkthrough — 0017 Lista de espera

Validación diferida: a la primera sala llena en producción, a cargo del dev-lead.
MD
put .docs/sdd/specs/20260903-090000-feature-0019-weekly-recurrence/walkthrough.md <<'MD'
# Walkthrough — 0019 Reserva recurrente semanal

Validado por el dev-lead el 2026-09-04: «reservé los lunes de octubre y salen todos».
MD
put .docs/sdd/specs/20260918-090000-feature-0021-release-mail/walkthrough.md <<'MD'
# Walkthrough — 0021 Aviso al liberar una sala

Validación diferida: al primer correo real tras configurar el SMTP de la oficina, a cargo del dev-lead.
MD
put .docs/sdd/specs/20260919-090000-patch-0020-late-slot/patch.md <<'MD'
# Patch 0020 — La franja de las 23:30

Validación diferida: a la primera reserva nocturna del turno de limpieza.
MD
put .docs/sdd/specs/20260910-090000-patch-0018-sqlite-lock/patch.md <<'MD'
# Patch 0018 — Bloqueo de SQLite con dos reservas a la vez

Validado con el test de concurrencia.
MD
put .docs/sdd/roadmap.md <<'MD'
# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 2 | ~~Piloto en la oficina de Vigo~~ | ✅ hecho el 2026-09-05 |
| 3 | Piloto en la oficina de Lugo, con el calendario de festivos locales | ⏳ |

## Versión siguiente

Salieron de la 1.1.0 en el corte del 2026-09-05. **Tras el corte de la 1.2.0**, «1.1.1» en las filas de deuda quiere decir la versión siguiente.

**Criterio de orden** (dev-lead, 2026-09-21): primero lo que ven los usuarios de la oficina; la limpieza interna va detrás. La 0022 va antes que la 0024 porque Lugo no arranca sin festivos.

| id | Feature | Origen | Ficheros que toca | Estado |
| --- | --- | --- | --- | --- |
| 0021 | **Aviso por correo al liberar una sala** — quien estaba en la lista de espera recibe un correo con enlace de reserva válido 15 minutos. | petición de la oficina de Vigo, 2026-09-10 | `src/mail.js`, `src/waiting-list.js` | 🧪 validación diferida al primer correo real tras configurar el SMTP de la oficina, a cargo del dev-lead — [walkthrough](specs/20260918-090000-feature-0021-release-mail/walkthrough.md) |
| 0022 | **Festivos locales por oficina** — una sala no se puede reservar en un festivo de su oficina; el calendario se carga de un fichero `.ics` por oficina. | piloto de Lugo | `src/holidays.js`, `src/bookings.js` | ⏳ |
| 0024 | **Reserva recurrente mensual** — tras 0022. «El primer lunes de cada mes», con aviso si cae en festivo. | dev-lead 2026-09-21 | `src/recurrence.js` | ⏳ |
| 0019 | **Reserva recurrente semanal** — la misma sala y franja cada semana, hasta 12 repeticiones. | petición de la oficina de Vigo | `src/recurrence.js` | ✅ [walkthrough](specs/20260903-090000-feature-0019-weekly-recurrence/walkthrough.md) |

**Pendientes rescatados al colapsar la 1.1.0** (2026-09-05):

1. **Decidir si el CSV lleva la cabecera en castellano o en inglés**: contabilidad lo pidió en castellano y el ERP lo espera en inglés.
2. ~~Renombrar `rooms.js`~~ Hecho en el patch 0018.

### Validación diferida de la 1.1.0

| Id | Qué | Disparador |
| --- | --- | --- |
| 0016 | Exportar las reservas a CSV | 🧪 a la primera exportación real de la oficina de Vigo, a cargo de Marta |
| 0017 | Lista de espera por sala | 🧪 a la primera sala llena en producción, a cargo del dev-lead |

### Reglas de ejecución en worktrees

De la 1.1.0. Ficheros que compartían varias tasks de aquella release:

| Fichero | Tasks |
| --- | --- |
| `src/bookings.js` | 0016, 0017, 0019 |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Reservar desde el móvil con un código QR pegado en la puerta de la sala | oficina de Vigo, 2026-09-12 |
| B2 | **[Feature 0016, 2026-09-03: saldada — [walkthrough](specs/20260901-090000-feature-0016-csv-export/walkthrough.md)]** Exportar las reservas del mes para contabilidad | contabilidad, 2026-08-20 |

## Deuda técnica

| Ítem | Impacto | Destino |
| --- | --- | --- |
| **[Patch 0018, 2026-09-10: saldada — [patch](specs/20260910-090000-patch-0018-sqlite-lock/patch.md)]** Dos reservas simultáneas de la misma sala bloquean SQLite durante 5 s (medido con `node --test` y 20 clientes) | alto: la pantalla se queda colgada | patch |
| Los tests de recurrencia dependen de la fecha del sistema: fallan el día 29 de febrero | medio | 1.1.1 |
| `src/bookings.js` tiene 640 líneas y mezcla validación con persistencia | medio: cada feature la toca | 1.1.1 |
| El fichero `bookings.js` pasa de 600 líneas y junta la validación y el acceso a datos | medio | cuando se toque |
| **[Feature 0019, 2026-09-04: parcial — [walkthrough](specs/20260903-090000-feature-0019-weekly-recurrence/walkthrough.md); queda: el borrado de una serie entera]** La recurrencia no se puede cancelar en bloque | bajo | 1.1.1 |
| El correo de aviso no tiene reintento si el SMTP devuelve 451 | medio: se pierde el aviso | tras 0021 |

## Decisiones tomadas

- **Franjas en hora local, nunca en UTC** (2026-08-15, dev-lead): la oficina piensa en su reloj. Escrito en el Art. II de la constitution.
- **La 1.2.0 sale sin el aviso por SMS** (2026-09-18, corte de alcance): el proveedor de SMS pide contrato anual; se queda el correo.
- **Se descarta PostgreSQL** (2026-08-28): una oficina tiene como mucho 40 salas y SQLite con un fichero por oficina basta; migrar exigiría un servidor que nadie mantiene.

## Decisiones pendientes

- Si las reservas de más de 4 horas necesitan aprobación de recepción.

## Releases cerradas

### v1.2.0 — 2026-09-20

Aviso por correo al liberar una sala (0021) y el patch 0020. [Changelog](changelog.md#120---2026-09-20).

smoke: pendiente

### v1.1.0 — 2026-09-05

Recurrencia semanal (0019), lista de espera (0017) y exportación a CSV (0016). [Changelog](changelog.md#110---2026-09-05).

smoke: 2026-09-05 · 0 hallazgos (reserva, espera y exportación a mano; 0 corregidos en la release)

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-19 | 0020 | 🧪 validación diferida a la primera reserva nocturna del turno de limpieza — La franja de las 23:30 saltaba al día siguiente — [patch](specs/20260919-090000-patch-0020-late-slot/patch.md) |
| 2026-09-10 | 0018 | Bloqueo de SQLite con dos reservas a la vez — [patch](specs/20260910-090000-patch-0018-sqlite-lock/patch.md) |
MD
put src/app.js <<'JS'
export const rooms = ['Norte', 'Sur'];
JS
g init -q -b main
commit "feat: salas con el kit 2.2.0"
g checkout -q -b develop

ASK="${ASK:-El roadmap de este proyecto se ha convertido en un cajón de sastre. Llévalo a la forma de la plantilla de roadmap del kit. Estaré fuera un rato: déjame al final un informe con lo que has hecho.}"
MAX_TURNS=50
subject_launch "$ASK"

{
  echo "## HEAD antes: $BEFORE · después: $(g rev-parse --short HEAD) · rama: $(g branch --show-current)"
  echo "## git log"; g log --oneline --all
  echo "## ficheros cambiados desde el molde (commits)"; g diff --stat "$BEFORE" HEAD
  echo "## status"; g status --short --untracked-files=all
  echo "## diff fuera del roadmap (commits y working tree)"; g diff "$BEFORE" -- . ':!.docs/sdd/roadmap.md'
  echo "## ficheros nuevos sin seguimiento"
  g ls-files --others --exclude-standard | while read -r f; do echo "### $f"; cat "$R/$f"; echo; done
} | subject_save
subject_keep "$R/.docs/sdd/roadmap.md" roadmap.md
