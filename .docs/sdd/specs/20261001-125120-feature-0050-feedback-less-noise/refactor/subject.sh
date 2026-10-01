#!/usr/bin/env bash
# Sujeto de la feature 0050 (tickets de sdd-feedback con menos ruido), con el lanzador de referencia.
# Uso (desde tests/headless/run.sh): subject.sh <kit> <etiqueta> <escenario> <salida>
#   n1  sesión con ruido: ya escribió el ticket de la 0031 y ahora cierra la 0032 con fallo, desviación, menores y errores
#   l1  cierre limpio de la 0032: sin fricción y dentro de la estimación
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$BASE/../../../../.." && pwd)"
. "$REPO/tests/headless/lib.sh"
case "$3" in n1|l1) ;; *) die "escenario desconocido: $3" ;; esac
subject_init "$1" "$2" "$4" sdd-feedback

SPEC=.docs/sdd/specs/20261001-080000-feature-0032-etiquetas
put .docs/sdd/sdd-kit.json <<'JSON'
{"version": "2.2.0", "channel": "plugin", "updated": "2026-09-29", "ids": {"mode": "sequence"}, "control": {"profile": "delegate"}, "merge": {"into": "develop", "noFf": true, "push": false}, "execution": "auto"}
JSON
put CLAUDE.md <<'MD'
# Guía para Claude

Proyecto de Ferretería Lozano con el kit SDD. Documentos de anclaje en `.docs/sdd/`.
MD
put .docs/sdd/mission.md <<'MD'
# Misión

NotaLozano: notas internas de los dependientes de Ferretería Lozano, con etiquetas y exportación. Interlocutora del cliente: Marta Prieto.
MD
put .docs/sdd/tech-stack.md <<'MD'
# Tech Stack

- Node 22, sin framework. Tests con `node --test`.
- Lint de documentación: `bash tools/lint-docs.sh <ficheros .md>` (MD013, líneas de 200 caracteres como máximo). Lo corre el pre-commit sobre todo `.md` que se commitea.
MD
put tools/lint-docs.sh <<'SH'
#!/usr/bin/env bash
rc=0
for f in "$@"; do
  awk -v f="$f" 'length($0) > 200 { printf "%s:%d MD013/line-length %d > 200\n", f, NR, length($0); bad = 1 } END { exit bad }' "$f" || rc=1
done
exit $rc
SH
put .docs/sdd/estimation.md <<'MD'
# Estimación

El plan estima en horas; el walkthrough registra el tiempo real.
MD
put src/notes.js <<'JS'
export const notes = [];
export function tag(note, label) { note.tags = [...(note.tags ?? []), label]; return note; }
JS
put "$SPEC/spec.md" <<'MD'
---
id: 20261001-080000-feature-0032-etiquetas
feature: 0032
title: Etiquetas en las notas
mode: lite
status: done
---

# Spec — Etiquetas en las notas

## Delta de comportamiento

### Capacidad: `notes`

**ADDED — Una nota lleva etiquetas**
- GIVEN la nota «Pedido tornillos»
- WHEN el dependiente le pone la etiqueta «urgente»
- THEN el listado muestra «Pedido tornillos · urgente»

### Estimación y esfuerzo

- Estimación de implementación: 2 h
MD
g init -q -b main
commit "feat: notas con exportación CSV (0031)"
g checkout -q -b develop

if [ "$3" = n1 ]; then
  put .docs/sdd/kit-feedback/20261001-073000-feature-0031-exportar-csv.md <<'MD'
---
kit_version: 2.2.0
lane: feature
id: 20261001-073000-feature-0031-exportar-csv
task: 0031
mode: lite
date: 2026-10-01
---

# Ticket para el kit — feature 0031: exportar notas a CSV

## Contexto

- Carril y modo: feature lite

## Hallazgos

Sin hallazgos

## Funcionó, no tocar

- El modo lite con su predicado citado.
MD
  commit "docs(kit-feedback): ticket de la 0031"
  g tag ticket-0031
  put src/notes.js <<'JS'
export const notes = [];
export function tag(note, label) { note.tags = [...(note.tags ?? []), label]; return note; }
export function render(note) { return [note.title, ...(note.tags ?? [])].join(' · '); }
JS
  commit "feat(notes): etiquetas en las notas (0032)"
  put src/notes.js <<'JS'
export const notes = [];
export function tag(note, label) { note.tags = [...new Set([...(note.tags ?? []), label])]; return note; }
export function render(note) { return [note.title, ...(note.tags ?? [])].join(' · '); }
JS
  commit "fix(notes): no repetir una etiqueta (revisión final)"
  put "$SPEC/walkthrough.md" <<'MD'
# Walkthrough — feature 0032

## Tiempo

- Estimado: 2 h · Real: 3,5 h
- Desviación: ~45 min en la verificación visual (entrar en la pantalla con login desde un script de Playwright, sin receta de acceso) y ~30 min en la pasada de fix de la revisión final (etiquetas repetidas, commit `fix(notes): no repetir una etiqueta`). La spec no tuvo enmiendas.
MD
  commit "docs(sdd): cerrar la 0032"
  put session-log.md <<'MD'
# Bitácora de la sesión (2026-10-01)

Modelo del hilo: Opus 5.5. Revisor final: Opus (sdd-kit:effort-high). Sin contador de tokens del hilo.

## Primera parte — feature 0031 (exportar CSV)

- Cerré la 0031 con sdd-end-feature y escribí su ticket con sdd-feedback (`.docs/sdd/kit-feedback/20261001-073000-feature-0031-exportar-csv.md`). Sin fricciones.

## Segunda parte — feature 0032 (etiquetas), modo lite

- 08:00 Arranque con sdd-start-feature, spec lite aprobada por Marta Prieto a la primera.
- 08:20 Escribí en el ejemplo de la spec un campo «color de etiqueta» que el modelo de datos no tiene; no miré `src/notes.js`. El repaso de coherencia de la spec no me pidió contrastar con el código. Lo cazó la revisión final: una enmienda y una pregunta al dev-lead, ~20 min.
- 09:10 Implementación en Native. Lancé `bash ~/.claude/plugins/cache/superpowers-marketplace/superpowers/6.4.2/skills/executing-plans/scripts/task-done 1 "node --test"` desde PowerShell: respondió `bash: /home/dev/.claude/plugins/cache/superpowers-marketplace/superpowers/6.4.2/skills/executing-plans/scripts/task-done: No such file or directory` (el `bash` de PowerShell es el de WSL). Lo repetí con la herramienta Bash (Git Bash) y funcionó. Me pasó dos veces, ~15 min en total.
- 09:40 `git commit -F -` desde PowerShell tomó el mensaje como pathspec (`error: pathspec 'feat(notes):...' did not match`); lo rehíce con `-m`. ~2 min.
- 10:00 Verificación visual: la pantalla pide login y §Frontend no dice cómo entrar desde Playwright. Probé tres formas hasta dar con la cookie de sesión. ~45 min.
- 10:50 Revisión final: un Important (etiquetas repetidas). Pasada de fix con su RED, ~30 min.
- 11:20 En el paso de estimación del cierre tardé en encontrar `Build-EstimationLog.ps1`: el paso no da la ruta del script. ~3 min.
- 11:25 La plantilla del walkthrough tiene un placeholder «<fase>» que no entendí si era la fase del plan o de la campaña. ~5 min.
- 11:30 Cierre. El dev-lead, al ver 3,5 h frente a 2 h: «es porque la spec tenía huecos».
- Por iniciativa propia: medí el reparto del tiempo con las marcas de hora de los commits, y así salió la desviación del walkthrough.
MD
else
  put src/notes.js <<'JS'
export const notes = [];
export function tag(note, label) { note.tags = [...(note.tags ?? []), label]; return note; }
export function render(note) { return [note.title, ...(note.tags ?? [])].join(' · '); }
JS
  commit "feat(notes): etiquetas en las notas (0032)"
  put "$SPEC/walkthrough.md" <<'MD'
# Walkthrough — feature 0032

## Tiempo

- Estimado: 2 h · Real: 1,5 h
MD
  commit "docs(sdd): cerrar la 0032"
  put session-log.md <<'MD'
# Bitácora de la sesión (2026-10-01)

Modelo del hilo: Sonnet 5.5. Sin subagentes. Sin contador de tokens del hilo.

## Feature 0032 (etiquetas), modo lite

- 08:00 Arranque con sdd-start-feature; la primera pregunta confirmó lite y perfil, y Marta Prieto aprobó la spec a la primera.
- 08:20 Tests RED de los THEN, implementación en Native, `node --test` en verde.
- 09:00 Smoke por THEN con ejecución real; validación en campo según el proyecto.
- 09:30 Cierre con sdd-end-feature: walkthrough, changelog y roadmap sin incidencias. Real 1,5 h frente a 2 h estimadas.
- Ningún paso del kit falló ni hubo que rodearlo, y no tomé decisiones fuera de lo que pedían las skills.
MD
fi
commit "chore: bitácora de la sesión"

ASK='Acabo de cerrar la feature 0032. Lo que pasó en la sesión está en `session-log.md`. Genera el ticket del kit para esta feature.'
MAX_TURNS="${MAX_TURNS:-30}"
subject_launch "$ASK"

{
  echo "## HEAD antes: $BEFORE · después: $(g rev-parse --short HEAD)"
  echo "## status"; g status --short --untracked-files=all
  echo "## diff del ticket de la 0031"; g diff "$BEFORE" -- .docs/sdd/kit-feedback/20261001-073000-feature-0031-exportar-csv.md
  for f in "$R"/.docs/sdd/kit-feedback/*.md; do
    [ -f "$f" ] || continue
    echo "## $(basename "$f") · $(wc -w < "$f") palabras · lint:"; bash "$R/tools/lint-docs.sh" "$f" && echo "lint ok"
    cat "$f"
  done
} | subject_save
