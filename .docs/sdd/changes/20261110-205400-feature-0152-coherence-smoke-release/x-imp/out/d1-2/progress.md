# SDD ledger — plan: .docs/sdd/specs/20261014-110000-feature-0024-drop-legacy/plan.md

## Pre-flight scan

| Task | Comprobado | Hallazgo |
| --- | --- | --- |
| 1 | Tests RED «ninguno: es una retirada» frente al THEN «test/legacy.test.js no existe»: la verificación es `node --test` sin el fichero; Ficheros solo `test/legacy.test.js` | coherente; una sola task, sin pares que compartan fichero |

Task 1: Ruling: base sin remoto; `develop` sin cambios desde 6bc77b8 — sin freno de alcance.
Task 1: Ruling: los dos casos de `test/legacy.test.js` (anular dos veces → «sin reserva»; libres de una franja sin reservas → «Norte, Sur») no los cubre ningún otro test — borro el fichero entero igualmente, porque la spec recoge la decisión literal del dev-lead («se borra entero — ese fichero ya no aporta, fuera») y migrarlos cambiaría el Scope; apunto el hueco en `debt.md` «Por triar» (fuera de los Ficheros del plan, solo documentación) — si el dev-lead no lo sabía, `anular` queda sin ningún test y una regresión en `voidBooking` o en `freeRooms` sin reservas pasaría en verde.
Task 1: complete (commits 2876b99..5b4cf01, tests: node --test → ℹ duration_ms 123.3417)
