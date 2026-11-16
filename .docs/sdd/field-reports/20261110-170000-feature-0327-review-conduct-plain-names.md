---
kit_version: 2.3.4
lane: feature
id: 20261110-170000-feature-0327-review-conduct-plain-names
task: 0327
mode: full
date: 2026-11-10
---

# Ticket para el kit — feature 0327: el revisor de la spec ve la fila floja de la batería; el primer escenario ponía el defecto donde el revisor ya miraba

## Contexto

- Carril y modo: feature full, perfil `delegate`, ejecución Native
- Skills del kit usadas: `sdd-propose`, `sdd-implement-native`, `sdd-verify`, `sdd-parallel-agents`, `sdd-archive`, `sdd-feedback`
- Proyecto: el propio kit (plugin de Claude Code; Node, Vitest, moon), una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: opus (revisor de la spec, eje Spec), sonnet (eje Código, sujetos)
- Coste en reloj: 2,6 h aproximadas con los commits frente a 1 h estimada (+160 %)
- Coste en tokens: no medido (la sesión trabajó desde el checkout de `develop`)

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El primer escenario del RED ponía el defecto donde el revisor ya miraba

- **Qué pasó**: para probar que el revisor de la spec ve una fila de rúbrica que pasa sin la conducta, `rc1` escribió la fila floja dentro de la spec, junto a una frase que la delataba. Salió limpio 3/3 (1,69 $). El eje Spec de la revisión final vio que en la 0326 la fila vivía en la batería, que el revisor no lee; `rc2`, con la fila en la batería, salió 1/2 y la frase entró (GREEN 2/2). El dev-lead paró por el tiempo: «llevas 12h!!! por favor no puede ser tan dificil cerrar 3 patches sin dejar deuda».
- **Fuente**: `walkthrough.md` §3; `tests/sdd-propose-0327-red.md`.
- **Dónde en el kit**: `skills/sdd-propose/references/review-spec.md` (el revisor de la spec no miró si el escenario reproduce el sitio del fallo de origen).
- **Por qué el kit no lo evitó**: el revisor de la spec de la 0327 juzgó si `rc1` podía fallar por la conducta, no si ponía el defecto donde estaba en el ticket de origen.
- **Coste**: 1,69 $ de sujetos que no midieron el caso y una enmienda con parada.
- **Propuesta**: ninguna nueva: la frase de esta feature («scenario or battery row passes without the behavior») ya pide al revisor mirar la fila de la batería; falta un segundo caso de «escenario que no reproduce el sitio del fallo».
- **Verificada**: sí — `rc1` 3/3 limpio frente a `rc2` 1/2 con el mismo kit.
- **Criterio de aceptación**: GIVEN una spec cuyo RED reproduce un fallo de un ticket · WHEN la revisa el revisor · THEN dice si el escenario pone el defecto donde estaba en el ticket.

### 2. Dos paradas por dinero por un techo de previsión justo

- **Qué pasó**: la previsión de `rc1` usó la media de la batería (0,65 $) y la nota de precio avisaba de 1,10 $; con la enmienda de `rc2` el gasto pasó del techo de 3,85 $ por 0,44 $ y hubo que parar dos veces. El dev-lead: «subelo a lo que sea... dale caña y acaba por dios».
- **Fuente**: `spec.md` «Previsión de coste» y «Enmiendas»; `walkthrough.md` §2.
- **Dónde en el kit**: `skills/sdd-templates/templates/spec-template.md` (Previsión de coste).
- **Por qué el kit no lo evitó**: la regla existía (la previsión se pasa al dev-lead y se para al superarla) y la apliqué; el coste fue la parada misma.
- **Coste**: dos paradas del dev-lead.
- **Propuesta**: ninguna sin segundo caso.
- **Verificada**: sin verificar
- **Criterio de aceptación**: —

## Lo que hice por iniciativa propia

- Leer las filas de juicio (`RC1`, `RC2`, `R12`) en las salidas antes de dar el veredicto: `battery.mjs` las deja «sin leer». Funcionó.

## Funcionó, no tocar

- La decisión «un arreglo entra solo si su RED sale rojo, con n = 3 si sale limpio»: dejó fuera la frase del 🦆 (3/3 limpio) sin gastar en un GREEN.
- El eje Spec de la revisión final leyendo las salidas de los sujetos, no la evidencia: encontró que `rc1` no reproducía la 0326.

## Menores

- `sdd capability merge` pide `--artifact` y `--path` y su error nombra solo la que falta primero: dos intentos — `cli` (`capability merge`).
- `RUNS_DIR` en el scratchpad de la sesión pasa de 100 caracteres y la tanda no arranca; el mensaje ya dice «usa .temp/<corto> del worktree» — `tests/headless/lib.mjs`.
