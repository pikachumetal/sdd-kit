---
id: 20261015-103859-patch-0190-gate-mutex
task: 0190
title: Patch — el gate de cierre no corre a la vez las tareas que cargan la máquina
type: patch
solution: dev-lead
status: done
created: 2026-10-15
branch: patch/0190-gate-mutex
commit: <hash>
---

# Patch 0190 — el gate de cierre no corre a la vez las tareas que cargan la máquina

## Capacidades

- Ninguna, porque ninguna capacidad describe `moon.yml` ni `cli/moon.yml`

## 1. Síntoma

Fila de deuda «`FastSuiteBudget` falla con la máquina cargada», segundo caso (patch 0183): el gate de cierre de `tech-stack.md` §Testing, `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min`, corre `kit:test` en paralelo con `cli:test-slow` y `cli:test-min`, y el conjunto rápido midió 31,8 s, por encima de su tope de 30 s; solo, en verde.

Medido en esta rama, sobre `45c420a5`, sin el fix: el log de moon muestra `kit:test`, `cli:test-min` y `cli:test-slow` «running» a la vez de 30 s a 240 s, y `FastSuiteBudget.Tests.ps1` corre dentro de esa ventana: sus dos pasadas tardan 63,99 s. Esta vez pasó, porque se queda con la mejor de las dos y esa bajó de 30 s. El rojo de 31,8 s no salió, pero la carga que lo produce sí.

## 2. Solución fijada

Dev-lead, 2026-10-15: «mutex de moon». `kit:test`, `cli:test-slow` y `cli:test-min` comparten `options.mutex` en `moon.yml` y `cli/moon.yml`, para que el gate no los corra en paralelo; la línea del gate no cambia. Lo que da por existente, comprobado: las tres tareas están en `moon.yml` y `cli/moon.yml`, y moon 2.6.0 admite `options.mutex` (desde la v1.24).

## 3. Fix

- **Fichero(s)**: `moon.yml`, `cli/moon.yml`
- **Cambio**: `kit:test`, `cli:test-slow` y `cli:test-min` llevan `options.mutex: heavy-tests`: moon las sigue lanzando en el mismo pipeline, pero solo una corre a la vez.
- **Decisiones**:
  - `options.mutex` compartido por las tres tareas; la línea del gate en `tech-stack.md` no cambia — dev-lead (2026-10-15, «mutex de moon»)
  - El RED es el paralelismo del log de moon, no `FastSuiteBudget` en rojo, que no salió en el gate sin el fix — dev-lead (2026-10-15, «RED = paralelismo»)
  - El nombre del mutex, `heavy-tests` — sin el dev-lead (no se ve fuera del repo)

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Gate sin el fix → las tres tareas corren a la vez | ✅ RED: `kit:test`, `cli:test-min` y `cli:test-slow` «running» a la vez durante 240 s; `FastSuiteBudget` 63,99 s las dos pasadas (verde por la mejor de dos) |
| 2 | Gate con el fix (`moon run --force`, sin caché) → una a una, y `FastSuiteBudget` en verde | ✅ GREEN: `kit:test` solo (3m 55s, 1258/1258, `FastSuiteBudget` 49,79 s las dos pasadas), después `cli:test-min` (1m 46s, 1023/1023) y `cli:test-slow` (1m 39s, 157/157), uno tras otro; `cli:test` 866/866 y `cli:typecheck` en verde. Gate entero: 7m 21s, frente a 6m 26s en paralelo |
| 3 | Gate con el fix y otras sesiones corriendo suites (CPU al 96 %, dos `Invoke-KitTests.ps1` de otros worktrees) | ❌ `FastSuiteBudget` 39,8 s, y el mutex sí ordenó las tres tareas. Es el primer caso de la fila de deuda, la carga entre sesiones, y un mutex de moon no lo cubre: solo ordena las tareas de un mismo `moon run` |

## 5. Tiempo (ligero)

- Estimación: 0,5 h
- Inicio: 2026-10-15T10:38Z
- Real: <Yh>
