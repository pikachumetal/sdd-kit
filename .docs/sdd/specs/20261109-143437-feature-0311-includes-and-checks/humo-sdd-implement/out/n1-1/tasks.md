# Tasks — Motivo al cancelar

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Cancelar con motivo | hecha | 307f7bd |
| 2 — Listado de canceladas | hecha | 142d7ef |

Revisión final: autorrevisión sin subagentes (la sesión no tiene herramienta de subagentes) — Spec: limpia · Código: 1 minor diferido · Arquitectura: no (sin señales en el diff), sobre 142d7ef
Gate: `node --test` → 7/7

## Rulings

- Setup: Ruling: trabajo en el checkout del repo, en feature/0010-cancel-reason, sin worktree nuevo — no es main y el dev-lead no está para consentir un worktree — si se quería worktree, nada que deshacer: la rama es la misma.
- Setup: Ruling: sesión con kit 2.3.4 cargado y proyecto en 3.0.0 (aviso del SessionStart); sigo con el kit cargado porque la actualización exige reiniciar Claude Code — si 3.0.0 cambia el formato de tasks.md/ledger/borradores de cierre, habrá que rehacerlos al actualizar.
- Task 1: Ruling: R1 — el test existente «cancelar una reserva activa» (sin --motivo) se sustituye por el THEN de la spec con --motivo «sala ocupada»; la spec manda que sin motivo responda «motivo no válido…» — si se quería conservar cancelar sin motivo, es una enmienda de spec.
- Task 1: Ruling: R4 — se comprueba primero que la reserva existe y después el motivo, para que «cancelar sin reserva lo dice» (Sur mar, sin motivo) siga respondiendo «sin reserva Sur mar»; la spec no fija el orden — si se quería validar el motivo antes, cambia el mensaje de ese caso.
- Task 2: Ruling: R2 — los tests de cancel.test.js comparten el estado en memoria y node:test corre los tests de un fichero en orden; el test del listado va después de la cancelación válida y la usa como GIVEN, sin añadir un reset de solo test al código de producción — si se reordena el fichero, el test del listado falla.
- Task 2: Ruling: R3 — `canceladas` une las líneas con salto de línea y, sin canceladas, devuelve cadena vacía; no invento texto que la spec no dice — si se quiere un mensaje para el vacío, es una enmienda.
- Final: Ruling: (declinado) `canceladas` lanzado como proceso aparte tras `cancelar` en otro proceso sale vacío — el estado es en memoria desde antes de esta feature (cancelar ya no persistía) y la spec lo prueba por `run` en el mismo proceso; persistir no entra en el Scope — si el dev-lead esperaba uso real por CLI, hace falta una feature de persistencia.

## Minors diferidos

- test/cancel.test.js quedó con LF en el índice cuando el repo guarda CRLF; el diff del fichero sale entero.
