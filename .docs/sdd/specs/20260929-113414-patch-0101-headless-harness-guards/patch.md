---
id: 20260929-113414-patch-0101-headless-harness-guards
task: 0101
title: Patch — tres guardas del arnés headless (SUPERPOWERS_DIR, tope de reloj, --add-dir del sujeto)
type: patch
status: done
created: 2026-09-29
branch: feature/0101-headless-harness-guards
commit: fa0b8125
---

# Patch 0101 — tres guardas del arnés headless

## Capacidades

- Ninguna, porque ninguna capacidad describe `tests/headless/lib.sh`.

## 1. Síntoma

Fila de deuda del roadmap «Patch del arnés headless» (triaje 2026-09-29), tres fallos de `tests/headless/lib.sh`:

1. Sin `SUPERPOWERS_DIR`, el kit no carga en el sujeto y `lib.sh` lanza igual: «The plugin "sdd-kit" did not load in this session (unmet dependency)», 0,43 $ y ~10 min perdidos ([ticket de la feature 0095](../../field-reports/20260928-202858-feature-0095-silence-watch.md) §2).
2. Sin tope de reloj por sujeto: el arreglo improvisado `timeout 720 command claude` falló, porque `timeout` no ejecuta builtins, y la tanda no arrancó ([ticket de la feature 0098](../../field-reports/20260928-220334-feature-0098-visual-patch-lane.md) §4).
3. Los sujetos no pudieron abrir sus capturas guardadas fuera del molde (`<run>/shots`); uno se las copió a `node_modules/` ([ticket de la feature 0099](../../field-reports/20260929-091515-feature-0099-frontend-verification.md) §4).

Medido: los tres tests nuevos de `tests/HeadlessLauncher.Tests.ps1` en rojo antes del fix. (1) Con un kit que declara `dependencies` y sin `SUPERPOWERS_DIR`, `run.sh` lanzó el sujeto («[a-1] listo»). (2) Con un `claude` falso que duerme 60 s, la campaña tardó 67 s. (3) Ningún `--add-dir` del `.args` apuntaba a la carpeta del sujeto.

## 2. Causa raíz

1. `subject_init` (`lib.sh`) comprueba `RUNS_DIR` y la skill medida, pero no mira `.claude-plugin/plugin.json`. `build_claude_args` trata `SUPERPOWERS_DIR` como opcional: sin ella, el sujeto hereda una configuración que no resuelve la dependencia de superpowers.
2. `subject_launch` llama a `claude` sin tope, y `lib.sh` no ofrece forma de ponerlo. Un `subject.sh` que lo quiera tiene que redefinir `claude`, y `timeout` necesita un ejecutable, no `command`.
3. `build_claude_args` solo da `--add-dir "$KIT"`. El cwd del sujeto es el molde (`$R = $RUN/repo`), así que `$RUN`, donde guarda lo que no va a git, queda fuera de las carpetas que puede leer.

## 3. Fix

- **Fichero(s)**: `tests/headless/lib.sh`, `tests/HeadlessLauncher.Tests.ps1`, `.docs/sdd/tech-stack.md`.
- **Cambio**: (1) `subject_init` muere con «el kit declara dependencies: define SUPERPOWERS_DIR» si `plugin.json` tiene `dependencies` y la variable falta. (2) `subject_launch` ejecuta `timeout "${SUBJECT_TIMEOUT:-0}" "$(type -P claude)"`; con 0 `timeout` no pone tope, y con código 124 avisa «tope de N s». `type -P` da la ruta aunque un `subject.sh` defina la función `claude()`, como el de la 0098. (3) `build_claude_args` añade `--add-dir` con `$RUN` en ruta Windows (`cygpath -m`, como el kit).

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Pester: kit con `dependencies` y sin `SUPERPOWERS_DIR` aborta con «define SUPERPOWERS_DIR», sin `.args` ni sujetos | ✅ RED → verde |
| 2 | Pester: `SUBJECT_TIMEOUT=3` con un `claude` falso que duerme 60 s en `PATH`, dos escenarios: acaba en 11,8 s, avisa «tope de 3 s» y guarda los dos sujetos | ✅ RED (67 s) → verde |
| 3 | Pester: el `.args` lleva `--add-dir <C:/…/red/a-1>` | ✅ RED → verde |
| 4 | `HeadlessLauncher.Tests.ps1` y `SubjectOutputPrivacy.Tests.ps1` completos | ✅ 24/24, 1 skip (máquina sin `user.name`) |
| 5 | Sujeto real que abre con `Read` una captura en `<run>/shots/` (criterio del ticket 0099 §4) | ⏳ no lanzado: lo mide la próxima campaña con capturas |

Validación diferida: 2026-09-29 · «Diferir: lo pruebo en la próxima campaña headless con capturas, a cargo del dev-lead» · disparador: la próxima campaña headless con capturas, a cargo del dev-lead (caso 5)

Decisión tomada sin el dev-lead: `SUBJECT_TIMEOUT` sin valor no pone tope (`timeout 0`), en lugar de un tope por omisión: la fila no fijaba ninguno, y uno inventado cortaría campañas largas que hoy terminan.

## 5. Tiempo (ligero)

- Estimación: 0.5h
- Real: 0.6h
