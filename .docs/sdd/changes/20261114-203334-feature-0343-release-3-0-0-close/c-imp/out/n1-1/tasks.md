# Tasks — Motivo al cancelar

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Cancelar con motivo | ✅ | 6480fc0 |
| 2 — Listado de canceladas | ✅ | cdd81d3 |

Revisión final: Spec autorrevisión (sin herramienta de subagentes), limpia · Código autorrevisión, 1 minor diferido · Arquitectura no (decidido en el despacho: sin señales), sobre cdd81d3

## Rulings

Setup: Ruling: trabajo en sitio sobre `feature/0010-cancel-reason`, sin worktree aparte — el dev-lead está fuera y la rama de feature ya aísla `develop`/`main`; baseline en worktree desacoplado `node --test` → 4/4 verde — coste si es erróneo: ninguno sobre otras ramas; habría que mover commits a un worktree.
Setup: Ruling: effort de la revisión final — este harness no expone herramienta de subagentes; «effort: no disponible en este harness, hereda el de la sesión»; la revisión final la hace el hilo en una pasada separada sobre el diff completo — coste si es erróneo: se pierde el par de ojos fresco; el dev-lead revisa en la validación.
Task 1: Ruling: los tests existentes de `test/cancel.test.js` se adaptan a la spec — «cancelar una reserva activa» pasa a ser el THEN con `--motivo "sala ocupada"` y «cancelar sin reserva lo dice» lleva `--motivo otro` para seguir probando su ruta — la spec es la autoridad y su AND fija la respuesta sin `--motivo` — coste si es erróneo: si se quería conservar cancelar sin motivo, es un cambio de comportamiento visible; lo fija la spec aprobada.
Task 1: Ruling: el motivo se valida antes de buscar la reserva — el AND «sin `--motivo` responde lo mismo» no condiciona a que exista reserva — coste si es erróneo: `cancelar Sur mar` sin motivo diría «motivo no válido» en vez de «sin reserva»; cambio de una línea.
Task 2: Ruling: los tests de `test/cancel.test.js` comparten el estado en memoria del módulo y corren en orden (node:test secuencial en un fichero); el de `canceladas` va tras el de cancelar con motivo, sin añadir un reset de test en producción — coste si es erróneo: un test dependiente del orden; si se reordenan, falla de forma visible.
Task 2: Ruling: `canceladas` lista solo las reservas en estado cancelada (no las anuladas de `anular`), una por línea, y sin canceladas responde vacío — la spec solo fija el caso con una; anulaciones son de 0011 («No entra») — coste si es erróneo: retocar el texto del caso vacío o el separador, una línea.
Final: Ruling: Eje Arquitectura decidido en el despacho como no — el único dato es un campo en memoria, sin esquema ni almacén; el almacén es la 0014 — coste si es erróneo: una revisión de fronteras que no se hizo, sobre un solo fichero.
Final: Ruling: (declinado) `cancelar` y `canceladas` no persisten entre invocaciones de la CLI, cada una es un proceso con el estado en memoria — ya era así antes de 0010 y guardar el motivo en el almacén es la 0014 del roadmap — coste si es erróneo: desde la shell `canceladas` sale vacío; la feature se ve solo dentro de un proceso.
Final: Ruling: (declinado) `canceladas` sin ninguna cancelada responde vacío — un texto como «sin canceladas» cambiaría la salida observable sin que la spec lo fije (freno de alcance) — coste si es erróneo: añadir una línea y su test.
Final: Ruling: (declinado) la spec declara la capacidad `bookings` modificada, pero `sdd capability index` dice «Sin capacidades»: no existe aún `capabilities/` — lo resuelve el merge del delta en el cierre (sdd-archive) — coste si es erróneo: la capacidad se crea desde el delta en vez de modificarse.
Final: minor (deferred): `test/cancel.test.js` pasó de CRLF a LF y el diff lo reescribe entero (pierde el blame de las dos líneas originales)
Final: Ruling: borrador del merge de capacidades no hecho — `sdd capability merge` rechaza la spec: «bookings» no tiene fichero en capabilities/ y el bloque no la declara en «Nuevas»; arreglarlo es editar el bloque «Capacidades» de la spec aprobada (pasar `bookings` a «Nuevas»), y lo dejo para sdd-archive con el dev-lead — coste si es erróneo: el cierre hace ese cambio de una línea antes del merge.
Final: Ruling: borrador de walkthrough no escrito — `sdd-templates` cita `templates/walkthrough-template.md` y el fichero no existe en el kit — coste si es erróneo: sdd-archive escribe el walkthrough entero en vez de completarlo.
