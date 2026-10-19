---
id: 20261019-122910-feature-0202-close-loose-ends
title: Tasks — Cierra lo que quedó abierto en la 0193 y la 0201
spec: ./spec.md
plan: ./plan.md
created: 2026-10-19
---

# Tasks — Cierra lo que quedó abierto en la 0193 y la 0201 (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0202-close-loose-ends`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | `tech-stack.md`, su tope y Mergiraf obligatorio | done | 3b8f97e3 | tope 18800 → 19280 |
| 2 | Mergiraf solo sobre código y tests que faltaban | done | 03348530 | sin `mergirafSolved` (ruling) |
| 3 | Ids repetidos | done | d05c68bf | columna de id: la primera (enmienda) |
| 4 | `session tokens` por ventana y con corte en el último merge | done | 67bfd0e3 | enmienda aprobada: también sin carpeta |
| 5 | Los menores de la 0201 | done | 27e6d6b7 | enmienda aprobada: una tabla con las dos filas; fix descubierto 1 |

## Verificación por task

- [x] Task 1 — `WordBudget.Tests.ps1` 71/0; `mergiraf.slow.test.ts` 5/5, y el test que falla sin `mergiraf` en el PATH
- [x] Task 2 — `test/merge` 122/122
- [x] Task 3 — `test/roadmap` y `test/merge` 241/241
- [x] Task 4 — `test/session` 44/44; medida real de la 0201
- [x] Task 5 — `test/merge` 132/132

Revisión final: Spec opus+high, con arreglos (7 Important, 7 Minor) · Código sonnet+high, con arreglos (1 Important, 6 Minor) · Arquitectura no (plan), sobre 27e6d6b7
Pasada de fix: juntada en el cierre, los 21 hallazgos de los dos ejes RED→GREEN (2 por ruling) y el fix descubierto 2
Re-revisión: juntada en el cierre, desde 27e6d6b7, sdd-kit:effort-high + opus, todos los hallazgos ADDRESSED; sus 2 Important y 5 Minor nuevos, arreglados y verificados por el mismo re-revisor en dos tramos más

## Fixes adicionales

1. Una fila nueva de la rama se insertaba tras las líneas en blanco del trozo y partía la tabla (Task 5, test «dos ramas que añaden la misma tabla nueva con filas distintas»).
2. La ventana de `session tokens` contaba la sesión de otro worktree que solo nombraba la rama (al cerrar, test «una sesión ajena que solo nombra la rama, sin crearla, no cuenta»).

## Rulings

- Task 2: Ruling: sin `MergeAttempt.mergirafSolved` — con Mergiraf solo sobre código, un fichero que resuelve difiere siempre del sha verificado, así que `onlyDocsSince` ya no omite `--verify`; lo fija un test de guarda — si me equivoco, un `--verified-at` omitiría la verificación de lo que unió Mergiraf.
- Final: Ruling: Spec I4 (`countable` usa el último merge) — se queda: con el primero, lo que pasa entre el primer merge y el del ticket contaría dos veces; enmienda aclaratoria del punto 8 — si me equivoco, el trabajo de antes del ticket no cuenta para la rama nueva.
- Final: Ruling: Spec Minor 7 (tests de limpieza en `cleanup.slow.test.ts`) — un fichero por requisito, como la 0187; anotado en Enmiendas — si me equivoco, mover tests.
- Final: Ruling: los fallos de «waits for the merge lock», «gives up when the lock» y «rolls back the target» eran de ejecutar vitest a mano sin `--test-timeout 120000`, que `moon run cli:test-slow` sí pasa — si me equivoco, un test lento inestable sin detectar.
- Final: Ruling: el fallo de push de «una fila idéntica en dos sitios queda una» en un gate completo no se reprodujo: `cli:test-min` aislado 1317/1317 y los tres gates siguientes en verde — si me equivoco, un test lento inestable bajo carga.
- Final: Ruling: la re-revisión se paró y se relanzó una vez para cubrir el fix descubierto 2 antes de que volviera; sus correcciones posteriores las verificó el mismo re-revisor, en vez de dejarlas «sin revisar» — si me equivoco, una re-revisión más larga de lo que pide la regla.
