# Tasks — 0010 Motivo al cancelar

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Cancelar con motivo | hecha, revisión limpia | ver `git log` (commit de la Task 1) |
| 2 — Listado de canceladas | hecha, revisión limpia | ver `git log` (commit de la Task 2) |

Revisión final: Spec opus+high, Yes · Código sonnet+high, Yes · Arquitectura no (plan), sobre 73229b1

## Rulings

Ruling: sin worktree nuevo — ya estoy en `feature/0010-cancel-reason` (no main), perfil delegate no espera consentimiento — si me equivoco, mover la rama a un worktree.
Ruling: plan `Ejecución: subagent` manda sobre `execution: native` de sdd-kit.json — el plan es el que decide — coste si me equivoco: algo más de tokens.
Ruling: los tasks no declaran `Modelo`; elijo sonnet con effort low — ficheros de 1 función, spec completa — coste: una ronda de fix.
Ruling: validación de `--motivo` después de comprobar que existe la reserva — la spec solo fija el caso con reserva; así «sin reserva X Y» no cambia — coste: si el dev-lead quería validar el motivo primero, 1 línea.
Ruling: los tests importan el módulo fresco con `import('../src/app.js?<n>')` por test — el estado en memoria se comparte y T1/T2 necesitan «Norte lun» activa — coste: un helper de test.
Ruling: sin línea «Modelo» en el plan ni artículo de calidad de código en «De código»: el bloque se copia tal cual — coste: ninguno.
Task 1: Ruling: minors diferidos — final de línea del test, aserción «sigue activa» tras rechazo, firma de cancelBooking(params), caso sin reserva sin --motivo — no bloquean — coste: pulido
Task 2: Ruling: minor diferido — sin test del caso vacío ni del separador con varias canceladas — la spec no define el caso — coste: pulido
Final: minor (deferred): rechazo de motivo sin aserción de que la reserva sigue activa (test/cancel.test.js)
Final: minor (deferred): `canceladas` sin canceladas imprime línea vacía; la spec no fija el texto — decisión del dev-lead
Final: minor (deferred): `cancelBooking(room, day, params)` recibe todos los params; mejor pasar el motivo ya leído
Final: minor (deferred): faltan tests de `--motivo` sin valor / seguido de otra bandera, de canceladas vacío y de anulada excluida
Final: minor (deferred): `cancelReasons` entre funciones en vez de con los datos del módulo; finales de línea del test reescritos
Final: Ruling: no verificado «--motivo "sala ocupada" por la CLI» — lo ejecuté: `node src/app.js cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)»; sin --motivo → «motivo no válido: …» — coste: ninguno
Final: Ruling: declined «persistencia entre invocaciones de la CLI» — el estado en memoria es del molde y la spec no pide persistencia; cancelar y canceladas por CLI en procesos distintos no se ven — coste: si el dev-lead lo quiere, feature aparte
Final: Ruling: declined «listado vacío» — línea en blanco, no es fallo; texto pendiente del dev-lead — coste: cosmético
Final: Ruling: declined «motivos con otra capitalización» — se rechazan, la lista es cerrada por decisión del dev-lead — coste: ninguno
Final: Ruling: declined «formato/split de app.js» — forma de código y arquitectura, sin hallazgo — coste: ninguno
