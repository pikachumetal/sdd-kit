# Tasks — 0010 Motivo al cancelar

| Task | Estado | Commit |
| --- | --- | --- |
| Task 1 — Cancelar con motivo | hecha | aaf4d6a |
| Task 2 — Listado de canceladas | hecha | c862a23 |

- Task 1: revisión de task limpia (spec ✅, calidad aprobada; 3 Minor: el test que cancela Norte/lun depende de ir el último, `readReason` toma lo que siga a `--motivo`, EOL del test restaurado a CRLF).
- Task 2: revisión de task limpia (spec ✅, calidad aprobada; Minor: el test de `canceladas` depende del anterior —documentado con un comentario—, la lista vacía imprime una línea en blanco, sin test de anuladas excluidas).

Revisión final: Spec opus+high, sin Critical/Important (3 Minor) · Código sonnet+high, sin Critical/Important (5 Minor) · Arquitectura no (plan), sobre c862a23

## Rulings

Ruling: sin línea «Modelo» en el plan — implementador `sonnet` con `sdd-kit:effort-low` (tasks de 1-2 ficheros con spec completa); revisores `sonnet` `sdd-kit:effort-medium` — coste si es erróneo: una ronda de fix.
Ruling: la spec no dice qué pasa con `cancelar` sin motivo Y sin reserva — se valida el motivo primero («motivo no válido»); el test `cancelar sin reserva lo dice` pasa a llevar un motivo válido — coste si es erróneo: cambiar el orden de dos comprobaciones.
Ruling: sin remote ni diff de base (develop == merge-base) — base check limpio, se sigue.
Final: minor (deferred): test de `canceladas` depende del anterior (estado compartido)
Final: minor (deferred): `canceladas` sin canceladas imprime una línea en blanco (spec muda)
Final: minor (deferred): sin test de que una anulada no sale en `canceladas`
Final: minor (deferred): `readReason` posicional (flag antes de sala/día; motivo sin comillas)
Final: minor (deferred): `src/app.js` mezcla finales de línea — 8 líneas de `listCancelled` en LF en un fichero CRLF (lo vio el eje Spec)
Final: Ruling: nada persiste entre ejecuciones, así que `canceladas` por CLI sale vacío — lo cubre la 0014 «Motivo guardado», fuera de esta spec — coste si es erróneo: la 0010 enseña un listado que solo vive en el proceso
Final: Ruling: coincidencia exacta y sensible a mayúsculas del motivo — lista cerrada decidida con el dev-lead, el mensaje enseña los valores válidos — coste: «Sala ocupada» se rechaza
Final: Ruling: CHANGELOG sin tocar — lo escribe el cierre (sdd-archive) — coste: ninguno
Final: Ruling: la numeración de «Decisiones» de la spec salta del 1 al 3 — no hay regla que cubrir en el diff; se lo señalo al dev-lead en el resumen — coste: si faltaba una decisión, quedaría sin implementar
