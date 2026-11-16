# Tasks — feature 0036

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Almacén y cancelar | hecha | ver `git log` |

## Rulings

- Task 1: Ruling: `save` se llama en la entrada de la CLI (`if (command === 'cancelar')`), no dentro de `run`/`cancelBooking` — `test/cancel.test.js` llama a `run` en proceso y escribiría `data/bookings.json` en el repo, rompiendo `app.test.js` en la siguiente ejecución — si falla, la CLI no guardaría y el test de persistencia lo exhibe.
- Task 1: Ruling: trabajo en el checkout actual, sin worktree nuevo — el RED sin commitear vive en este árbol y la config no pide worktree — coste: ninguno, la rama es la de la feature.

Revisión final: autorrevisión (sin herramienta de subagentes; Spec, Código y Arquitectura en una pasada del hilo), sobre c06cdad — sin hallazgos Critical ni Important.
