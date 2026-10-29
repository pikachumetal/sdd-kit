---
id: 20261029-121440-patch-0247-ledger-rulings-and-done-count
task: 0247
title: Patch — los rulings del ledger sin filas de tabla y el recuento de tests en `sdd task done`
type: patch
solution: causa raíz
status: done
created: 2026-10-29
branch: patch/0247-ledger-rulings-and-done-count
commit: <hash>
---

# Patch 0247 — los rulings del ledger sin filas de tabla y el recuento de tests en `sdd task done`

## Capacidades

- Modificadas: `feature-flow` — «Los rulings del ledger se cosechan antes de borrar el workspace» (una fila de tabla no es un ruling) y «Las tasks Native se abren y cierran desde cualquier shell» (la línea del ledger lleva la de `Tests …`)

## 1. Síntoma

Fila 0247 del roadmap, con dos menores:

- [Ticket de la feature 0238](../../field-reports/20261028-192530-feature-0238-subject-lib-to-node.md): «`sdd ledger rulings` también devuelve la fila de la tabla del pre-flight que contiene «Ruling», y entra en `tasks.md` §Rulings como si fuera uno».
- [Ticket de la feature 0251](../../field-reports/20261029-110412-feature-0251-suite-lock-root-cause.md): «`sdd task done` anota en el ledger la última línea de la salida (`Duration  458.37s (tests 99%)`) y no la de `Tests N passed`; el eje Spec lo señaló como evidencia sin recuento».

## 2. Causa raíz

- `listRulings` (`cli/src/tasks/rulings.ts`) se queda con toda línea de `progress.md` que **contiene** `Ruling:` o `minor (deferred)` (`line.includes(marker)`), sin mirar la forma de la línea. El paso 6 de `sdd-implement` («Pre-flight scan») escribe en el ledger una tabla y pide «record each ruling beside its row»: una fila `| … | … |` que nombra el ruling cumple el `includes` y sale como si fuera uno.
- `completionLine` (`cli/src/tasks/done.ts`) anota `lines.filter(no vacía).at(-1)`: la última línea no vacía del log. vitest cierra su resumen con `Test Files …`, `Tests …`, `Start at …` y `Duration …`, por ese orden; la última es siempre `Duration`, y el recuento queda dos líneas más arriba.

## 3. Fix

- **Fichero(s)**: `cli/src/tasks/rulings.ts`, `cli/src/tasks/done.ts`, `cli/test/tasks/rulings.test.ts`, `cli/test/tasks/done.test.ts`
- **Cambio**: `listRulings` descarta las líneas que empiezan por `|` (filas de tabla). `completionLine` toma la última línea que empieza por `Tests ` (con su sangría) cuando la hay, y si no, la última no vacía, como hasta ahora.
- **Decisiones**:
  - Las filas de tabla del registro no cuentan como rulings — dev-lead
  - `sdd task done` anota la línea `Tests …` cuando la hay; si no, la última línea no vacía — dev-lead
  - El menor (g) de los tickets de la 0216 y la 0230 (el verbo imprime y no escribe en `tasks.md`) no entra — dev-lead
  - Una fila de tabla es una línea que, sin la sangría, empieza por `|`; la línea de vitest es la que, sin la sangría, empieza por `Tests ` (`Test Files` no cuenta) — sin el dev-lead (no cambia lo que el usuario ve: es cómo se reconoce lo que el dev-lead fijó)

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: `vitest run test/tasks/rulings.test.ts test/tasks/done.test.ts` antes del fix | 3 rojos: la fila de tabla sale en `listRulings` (`expected [ …(2) ] to deeply equal [ Array(1) ]`) y `resultLine is not a function` en los dos de `done.test.ts` |
| 2 | GREEN: `vitest run test/tasks` con el fix | 6 ficheros, 54/54 · `tsc --noEmit` limpio |

## 5. Tiempo (ligero)

- Estimación: 0,5 h + 0,2 h del gate de cierre (12 min, patch 0245)
- Inicio: 2026-10-29T12:13Z

## 6. Delta de capacidad

### Capacidad: `feature-flow`

#### MODIFIED — Los rulings del ledger se cosechan antes de borrar el workspace

- GIVEN el ledger de un plan con `Task 2: Ruling: el umbral queda en 30 s — el plan decía 20 y el test tarda 24`, `Final: minor (deferred) nombre de variable poco claro en parse()` y `Final: Ruling: no se renombra Foo — fuera de alcance`
- WHEN el cierre ejecuta `node sdd.js ledger rulings <plan.md>`
- THEN escribe esas tres líneas en el orden del ledger y sale con 0
- AND sin ledger escribe `Sin rulings` y sale con 0
- AND una fila de tabla del ledger (la del pre-flight) que contiene `Ruling:` no sale: solo cuentan las líneas que no empiezan por `|`

#### MODIFIED — Las tasks Native se abren y cierran desde cualquier shell

- GIVEN un plan con `Ejecución: native` en Windows, con PowerShell como shell principal, y una «Verificación» que no imprime nada si pasa
- WHEN el hilo abre y cierra cada task con `sdd task start` y `sdd task done <plan> <n> <base> -- pwsh -NoProfile -Command "Invoke-Pester -Path tests/Foo.Tests.ps1 -CI"` desde la herramienta PowerShell
- THEN `sdd task start` imprime la ruta del workspace en forma Windows (`D:\…`), y la línea `Task <N>: complete (…, tests: <comando> → (sin salida))` queda en el ledger a la primera
- AND si `sdd task start` falla o no imprime ruta, sale con un código distinto de 0 y el hilo no escribe en el ledger
- AND con un test en rojo, `sdd task done` no escribe `Task <N>: complete` y sale con el código del comando; con un comando que no existe, sale con 127 y tampoco lo escribe
- AND con una salida de vitest, que acaba en `Duration …`, la línea del ledger lleva la de `Tests N passed`; sin línea `Tests …`, la última línea no vacía de la salida
