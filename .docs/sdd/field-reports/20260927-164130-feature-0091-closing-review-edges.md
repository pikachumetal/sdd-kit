---
kit_version: 1.1.0
superpowers_version: 6.4.2
lane: feature
id: 20260927-164130-feature-0091-closing-review-edges
task: 0091
mode: lite
date: 2026-09-27
---

# Ticket para el kit — feature 0091: `run.sh` lanza todos los escenarios a la vez y 10 sujetos tumbaron la sesión

## Contexto

- Carril y modo: feature lite, perfil `delegate`, spec aprobada por delegación en la primera pregunta
- Skills del kit usadas: `sdd-start-feature` (pasos 1, 2, 4, 6 y 7), `sdd-end-feature`, `add-to-changelog`, `sdd-feedback`; de superpowers, `brainstorming` y la plantilla `code-reviewer.md`
- Proyecto: el propio kit (skills en Markdown, Pester, campañas de sujetos headless), una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: revisor final Opus 5.5 (`sdd-kit:effort-high`); 23 sujetos Sonnet
- Coste en reloj: ~1,6 h de implementación y ~0,3 h de spec
- Coste en tokens: 23,5 M del hilo y 1,6 M del revisor final; 10,17 $ de sesión y 19,18 $ de sujetos

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. `run.sh` no limita cuántos sujetos corren a la vez

- **Qué pasó**: tres llamadas a `run.sh` en paralelo (`SUBJECT=1` con 5 escenarios, `SUBJECT=2` con 4 y `p1`) pusieron 10 `claude -p` a correr a la vez. Git Bash empezó a fallar con `fork: Resource temporarily unavailable`, ninguno de los 10 sujetos escribió su `result` y la sesión del hilo se cortó. Relanzado en dos tandas de 5, terminaron todos.
- **Dónde en el kit**: `tests/headless/run.sh`. El bucle lanza cada escenario de `SCENARIOS` con `&` sin límite, y `SUBJECT_CAP` y `COST_CAP` cuentan sujetos y dólares, no simultaneidad. `tech-stack.md` ya avisa de seis sujetos y el pre-commit (task 0021), pero no de la simultaneidad.
- **Por qué el kit no lo evitó**: el techo mira el total de la campaña, no cuántos corren. Varias llamadas a `run.sh` en paralelo, que es la forma de lanzar `SUBJECT=1` y `SUBJECT=2`, no se ven entre sí.
- **Coste**: una tanda entera perdida (10 sujetos, coste no medido) y una sesión caída que hubo que retomar.
- **Propuesta**: `MAX_PARALLEL` (por defecto 5) en `run.sh`, contado con los `claude -p` vivos bajo `RUNS_DIR`, de modo que también vean los de otras llamadas. El lanzador espera a que baje del límite antes de lanzar el siguiente. Lo que ya quedó escrito en `tech-stack.md` (feature 0091) pasa a ser el valor por defecto.
- **Criterio de aceptación**: GIVEN `DRY_RUN=1`, un `DRY_DELAY` que mantiene vivo cada sujeto y dos llamadas a `run.sh` con 4 escenarios cada una WHEN se lanzan a la vez THEN nunca hay más de 5 sujetos vivos, y el test de `HeadlessLauncher.Tests.ps1` cuenta el máximo simultáneo.

## Lo que hice por iniciativa propia

- **Un escenario más antes de proponer un recorte** (`l2`, 2 sujetos, 2,18 $). El RED de la pieza (3) salió limpio con una petición que apuntaba al paso 7, que ya contiene la conducta. Antes de proponer el recorte al dev-lead, medí la condición del campo: el sujeto implementa y sigue solo. Funcionó: el recorte se apoyó en 3 de 3 sujetos válidos y no solo en el escenario fácil.
- **Aplicar la regla nueva a su propia pasada de fix**: la pasada de la revisión final no abrió re-revisión, la verificó el Pester RED→GREEN, y la línea `Pasada de fix:` va en la presentación.

## Funcionó, no tocar

- Reusar por ruta el hook `deny-agent.mjs` de la 0085, sin copiarlo: mide el despacho y el encargo sin pagar revisores Opus.
- La guarda `rev-parse --show-toplevel` del molde, que nació del ticket de la 0086.
- La opción «apruebo la spec por delegación» en la primera pregunta: el único parón intermedio fue el desvío del recorte.
- `Measure-SessionTokens.ps1` con `-ProjectsRoot` explícito. Sin él, «no medido»: el patch 0090, que lo arregla, aún no está en `develop`.

## Errores míos, no huecos del kit

- Hice `export SPEC_DIR=… SUBJECT_SH=$SPEC_DIR/…` en la misma línea: `SUBJECT_SH` quedó en `/red/subject.sh` y la primera tanda del RED no lanzó nada.
- `Set-Content -Encoding utf8BOM` metió un BOM en un `.Tests.ps1` que no lo tenía. Lo quité antes del commit.
- Dos órdenes de PowerShell con `-replace` y regex (`(?=^\*\*`, `/throw`) las bloqueó el sandbox como si fueran «Remove-Item on system path». Las rehice con `Edit`.
