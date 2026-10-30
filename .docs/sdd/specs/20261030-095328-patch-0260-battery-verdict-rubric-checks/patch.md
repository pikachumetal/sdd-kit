---
id: 20261030-095328-patch-0260-battery-verdict-rubric-checks
task: 0260
title: Patch — battery.mjs verdict aplica las filas de la rúbrica que se comprueban con una máquina
type: patch
solution: dev-lead
status: done
created: 2026-10-30
branch: patch/0260-battery-verdict-rubric-checks
commit: <hash>
---

# Patch 0260 — `battery.mjs verdict` aplica las filas de la rúbrica que se comprueban con una máquina

## Capacidades

- Ninguna, porque ninguna capacidad describe `tests/headless/battery.mjs` ni el método de baterías de `tech-stack.md`.

## 1. Síntoma

Ticket de la 0257 §1: «`rc2-2` corrió `gh run list … ; node --test 2>&1 | tail -8` en una sola llamada. Busqué `node --test` con `grep -n ">>> .*node --test\|>>> .*gh run" … | cut -c1-150`, y el corte escondió el `node --test` que seguía al `gh`. Di `rc2` por 2/2». Ticket de la 0246 §2: «Califiqué la misma fila de la rúbrica distinto en el RED y en el GREEN», porque el molde daba dos salidas válidas y la fila nombraba una.

## 2. Solución fijada

Del dev-lead, en la petición: «La comprobación se declara como `tools: /<regex>/`, presente o ausente; las filas de juicio siguen a mano». «En tech-stack.md, «Baterías por skill», la regla «fila por fila» se sustituye por otra igual de corta: antes del RED, una fila cuyo hallazgo admite más de una salida correcta (adjudicar o parar como desvío) las nombra todas, y RED y GREEN se califican con esa misma fila». «Ninguna skill se alarga».

Lo que da por existente, comprobado: la tabla `| Fila | Escenarios | Falla si… |` está en las 13 baterías con rúbrica, y `K6` de `sdd-archive` es la fila del ticket. `verdict` hoy solo mira la puerta (`tests/headless/battery.mjs`, `judge`).

## 3. Fix

- **Fichero(s)**: `tests/headless/battery.mjs`, `cli/test/kit/headless/battery.test.ts`, `tests/batteries/sdd-archive/battery.md`, `.docs/sdd/tech-stack.md`
- **Cambio**: una fila cuya celda «Falla si…» es `` `tools: /<regex>/` presente `` o `` `tools: /<regex>/` ausente `` la aplica `verdict` a cada sujeto, y el sujeto que falla no cuenta. `K6` pasa a declararla.
- **Decisiones**:
  - La forma `tools: /<regex>/`, presente o ausente, y las filas de juicio a mano — dev-lead
  - La regex se aplica a cada llamada (`>>> …`) entera, no a los resultados ni al mensaje final: en la 0257, `rc2-1` nombra `node --test` en esos dos sitios sin correrlo, y el criterio del ticket pide 1/2 — ticket
  - Una declaración mal formada o con un escenario que no existe es un error, no una fila a mano: callada, la comprobación no correría — sin el dev-lead (no cambia lo que ve un usuario del kit)

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `battery.test.ts`: 7 tests en RED antes del fix (presente, ausente, llamada de varias líneas, mal escrita, K6 real) | ✅ 19/19 tras el fix |
| 2 | Criterio del ticket de la 0257 con sus salidas reales: `battery.mjs verdict` sobre `refactor3/out` | ✅ `rc2 · 1/2 · umbral 2/2 · rojo · K6 falla en rc2-2`; sobre `fix/out`, 2/2 |
| 3 | Criterio del ticket de la 0246: la fila nombra las dos salidas y falla el arreglo silencioso | ✅ por lectura: `C8` de `sdd-verify` ya lo hace desde la 0246, y la regla queda en `tech-stack.md`; no se lanzan sujetos, porque ninguna skill cambia |
| 4 | `battery.mjs plan` de las 13 baterías con el nuevo corte de celdas por `\|` | ✅ sin errores |

## 5. Tiempo (ligero)

- Estimación: 0,5 h + 0,2 h del gate de cierre (12 min, patch 0245)
- Inicio: 2026-10-30T09:53Z
- Coste de sujetos: no aplica
