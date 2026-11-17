---
id: 20261026-172719-feature-0221-affected-closing-gate
title: Tasks — El gate de cierre corre solo lo afectado
spec: ./spec.md
plan: ./plan.md
created: 2026-10-26
---

# Tasks — El gate de cierre corre solo lo afectado (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0221-affected-closing-gate`

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Molde con gate filtrado y RED de los cuatro escenarios | done | 6cbea7c | una tanda RED descartada (sin `cli/`) |
| 2 | La línea `Gate:` nombra cada tarea | done | 5e981f9 | k6 2/2 |
| 3 | El cierre repite solo lo afectado y corre una sola suite | done | 72d50b1 | g6 2/2, g5 1/2 + control; enmienda aprobada |
| 4 | La línea base con un gate filtrado corre las tareas del Scope | done | 5f6aa4a | w2 2/2 |

Revisión final: Spec opus+high, con arreglos · Código sonnet+high, con arreglos · Arquitectura no (plan), sobre 5f6aa4a
Pasada de fix: juntada en el cierre, 8 hallazgos Important (texto de skill; g5, k6 y a3n re-medidos) y 11 Minor
Re-revisión: 5f6aa4a..juntada en el cierre, sdd-kit:effort-high + opus, todos ADDRESSED, 3 Minor nuevos arreglados sin revisar

## Rulings

- Task 1: Ruling: k5 y el molde reservas-gate ya existían en la batería de sdd-propose — uso k6 y reservas-filtro — coste si es erróneo: un renombrado
- Task 1: Ruling: sin la tarea docs:check del plan — el Review Focus 1 no tiene sujeto y la tarea solo complicaba el molde — coste si es erróneo: un sujeto más si se quiere medir
- Task 1: Ruling: g6 usa develop_rooms_test en lugar de develop_advances — develop_advances reescribía src/rooms.js con el mismo contenido y la base solo traía docs — coste si es erróneo: ninguno
- Task 1: Ruling: el RED se lanza con run.sh (SUBJECT=1) en lugar de battery.sh, que corre n=2 — coste si es erróneo: ninguno
- Task 1: Ruling: primer RED inválido (copia del kit sin cli/, 4 sujetos, 1,28 $) — se relanza con cli y hooks en la copia — coste: 1,28 $ perdidos
- Task 3: Ruling: sin los controles a3, a3n y w1 — con la tanda RED descartada (1,28 $) superarían los 6 $ previstos; el texto conserva literal la rama sin filtro que miden — coste si es erróneo: una regresión de a3 que nadie mide hasta la batería de release
- Task 3: Ruling: recuperación tras caída del PC — se retoma con el GREEN de g5/g6/w2 ya en disco; se perdieron la Pester completa y la repetición de cli:test-min en la rama
- Task 3: Ruling: dev-lead aprueba otra tanda de g5 y g6 (~1,6 $, total ~7,1 $) y la enmienda de Validación en campo — opción «Apruebo»
- Baseline: Ruling: línea base en rojo — test/merge/hotfix.slow.test.ts «Error: Hook timed out in 10000ms.» (afterAll de helpers.ts:15) con 1497/1497; contraste en develop desanclado verde (79/79, 1497/1497, 10 min); repetido en la rama, hotfix.slow verde y otro rojo: registries.slow.test.ts «fatal: not a git repository» (fila de deuda de la 0204, parcial). Veredicto: no es de la rama; fila de intermitentes del afterAll al cerrar — coste si es erróneo: un rojo real de la rama tapado (la rama solo toca texto de skills y baterías)
- Task 3: Ruling: g5 1/2 en REFACTOR (g5-2 leyó «salvo A o B o C»); arreglo de precedencia en el paso 1 y un sujeto de control aprobado por el dev-lead (~0,5 $)
- Task 3: Ruling: las salidas GREEN de w2 entraron en el commit de la Task 3 (la carpeta green/ entera) — coste: ninguno
- Final: Ruling: dev-lead aprueba las dos enmiendas y la medición mínima (g5, k6, a3n; n=1, ~1,4 $)
