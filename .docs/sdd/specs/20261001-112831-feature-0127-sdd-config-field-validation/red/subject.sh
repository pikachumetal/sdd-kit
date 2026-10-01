#!/usr/bin/env bash
# Sujeto de la feature 0127 (sdd-config pregunta validation.mode), con el lanzador de referencia.
# Uso (desde tests/headless/run.sh): subject.sh <kit> <etiqueta> <escenario> <salida>
#   c1  «revisa la configuración del kit», sdd-kit.json con todo salvo validation.mode (salas, aplicación web)
#   k1  c1 en un proyecto que es un kit de skills sin aplicación
#   c2  «quiero validación en campo solo para mí»
#   m1  «ponme el proyecto al día con sdd-init-brownfield» desde 2.2.0, roadmap válido, dev-lead presente
#   m2  m1 con el dev-lead fuera
#   c3  c1 con la respuesta field y su frase (fix de la revisión final)
#   m3  m1 con la respuesta field y su frase (fix de la revisión final)
#   g1  init greenfield en un repo vacío, con todas las respuestas salvo la de quién valida
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$BASE/../../../../.." && pwd)"
. "$REPO/tests/headless/lib.sh"
case "$3" in
  c1|k1|c2|c3) SKILL=sdd-config ;;
  m1|m2|m3) SKILL=sdd-init-brownfield ;;
  g1) SKILL=sdd-init-greenfield ;;
  *) die "escenario desconocido: $3" ;;
esac
subject_init "$1" "$2" "$4" "$SKILL"

if [ "$3" = g1 ]; then
  put README.md <<'MD'
# salas
MD
  g init -q -b main
  commit "chore: repo vacío"
  ASK='Prepara el proyecto para trabajar con SDD: empezamos «salas», sin código todavía. Te dejo las respuestas de la entrevista para que no tengas que preguntarlas:
1. Problema: en la oficina se reservan las salas de reuniones por correo y se pisan. 2. Lo usan los empleados (reservan) y recepción (gestiona salas y festivos). 3. Módulos: reservas, salas, festivos por oficina. 4. Fuera: pagos y catering. 5. Términos: franja (30 minutos), oficina, sala. 6. Datos en SQLite, un fichero por oficina. 7. Nombres de API y claves en inglés; mensajes en castellano. 8. Límites: reservas de hasta 4 horas, 50 resultados por búsqueda. 9. Avisar si una reserva pisa un festivo. 10. Manda el calendario de festivos de la oficina sobre el nacional. 11. Stack: Node 22 sin framework, pantalla web en HTML y JS. 12. Innegociable: franjas en hora local, nunca UTC. 13. Sí, changelog. 14. No, sin novedades para cliente. 15. Sin gestor de tickets. 16. git-flow. 17. Sí, worktrees. 18. No, basta con instalar dependencias. 20. No replica otro proyecto. 21. impeccable y Playwright, sin login.
Claves del kit: ids en sequence, perfil delegate, merge a develop con --no-ff y el worktree lo borro yo, push de develop sí, los frenos por defecto, ejecución auto.
Estaré fuera un rato: sigue hasta donde puedas y déjame al final lo que necesites de mí.'
else
  case "$3" in
    k1) MISSION='Kit de skills de Claude Code para el proceso del equipo. No tiene aplicación: se prueba usándolo en los proyectos del equipo.' ;;
    *) MISSION='Reserva de salas de reuniones por franja para una oficina, con una pantalla web para empleados y recepción.' ;;
  esac
  put .docs/sdd/sdd-kit.json <<'JSON'
{"version": "2.2.0", "channel": "plugin", "updated": "2026-09-29", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}, "control": {"profile": "delegate", "maxParallelAgents": 3, "silence": {"betweenStepsMinutes": 8, "longCommandMinutes": 20}}, "merge": {"into": "develop", "noFf": true, "removeWorktree": false, "push": false}, "execution": "auto"}
JSON
  put .claude/settings.json <<'JSON'
{"autoMemoryEnabled": false}
JSON
  printf '.superpowers/\n.playwright-mcp/\n.docs/sdd/sdd-kit.local.json\n' | put .gitignore
  put CLAUDE.md <<'MD'
# Guía para Claude

Proyecto con el kit SDD. Documentos de anclaje en `.docs/sdd/`.
MD
  printf '# Misión\n\n%s\n' "$MISSION" | put .docs/sdd/mission.md
  put .docs/sdd/constitution.md <<'MD'
# Constitution

## Art. I — Trazabilidad

Toda feature se cierra con `sdd-end-feature`, que escribe el walkthrough y el changelog.
MD
  put .docs/sdd/tech-stack.md <<'MD'
# Tech Stack

- Node 22, sin framework. Tests con `node --test`.
MD
  put .docs/sdd/changelog.md <<'MD'
# Changelog

## [Unreleased]

## [1.3.0] - 2026-09-20

### Added

- Festivos locales por oficina (0022).
MD
  put .docs/sdd/roadmap.md <<'MD'
# Roadmap

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 0026 | Piloto en la oficina de Lugo | ⏳ |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Reservar desde el móvil con un código QR | oficina de Vigo, 2026-09-12 |

## Deuda técnica

| Ítem | Impacto | Destino |
| --- | --- | --- |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |

## Releases cerradas

### v1.3.0 — 2026-09-20

Festivos locales (0022). [Changelog](changelog.md#130---2026-09-20).
MD
  put src/app.js <<'JS'
export const rooms = ['Norte', 'Sur'];
JS
  g init -q -b main
  commit "feat: proyecto con el kit 2.2.0"
  g checkout -q -b develop
  case "$3" in
    c1|k1) ASK='Revisa la configuración del kit y ponla al día.' ;;
    c2) ASK='Quiero validación en campo solo para mí: no me pares a validar al cerrar. Configúramelo.' ;;
    m1) ASK='Ponme el proyecto al día con sdd-init-brownfield. Estoy aquí para lo que necesites.' ;;
    c3) ASK='Revisa la configuración del kit y ponla al día. A la pregunta de quién valida te respondo ya: field, «aquí validamos en uso, no hay quien pruebe cada cierre». Commitea tú lo que cambies.' ;;
    m3) ASK='Ponme el proyecto al día con sdd-init-brownfield. Si me preguntas quién valida al cerrar: field, «aquí validamos en uso, no hay quien pruebe cada cierre».' ;;
    m2) ASK='Ponme el proyecto al día con sdd-init-brownfield. Estaré fuera un rato: déjame al final un informe con lo que has hecho.' ;;
  esac
fi

MAX_TURNS="${MAX_TURNS:-40}"
subject_launch "$ASK"

{
  echo "## HEAD antes: $BEFORE · después: $(g rev-parse --short HEAD) · rama: $(g branch --show-current)"
  echo "## git log"; g log --oneline --all
  echo "## cuerpo de los commits nuevos"; g log --format="--- %h%n%B" "$BEFORE..HEAD" 2>/dev/null
  echo "## status"; g status --short --untracked-files=all
  echo "## diff desde el molde"; g diff "$BEFORE"
  echo "## sdd-kit.json"; cat "$R/.docs/sdd/sdd-kit.json" 2>/dev/null
  echo; echo "## sdd-kit.local.json"; cat "$R/.docs/sdd/sdd-kit.local.json" 2>/dev/null
} | subject_save
