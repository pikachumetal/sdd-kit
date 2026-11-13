# Tasks — Motivo al cancelar

Registro vivo: estado y commit por task. Método: Native.

| Task | Estado | Commit |
| --- | --- | --- |
| Task 1 — Cancelar con motivo | pendiente | — |
| Task 2 — Listado de canceladas | pendiente | — |

## Ledger

- Baseline: `node --test` 5 tests, 4 pasan, 1 falla (`test/rooms.test.js` «salas en orden»: `run('salas')` devuelve `salas`, se espera `Norte, Sur`). Viene del commit f2a3568, anterior a la feature y fuera de su scope.
- Base: sin diferencias entre `develop` y la rama; sin remoto.
