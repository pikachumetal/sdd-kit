# Tasks — 0010 Motivo al cancelar

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Cancelar con motivo | hecha, revisión limpia | 0bff724 |
| 2 — Listado de canceladas | hecha, revisión limpia | acc8cf3 |

Revisión final: Spec opus+high, With fixes (4 minor, diferidos) · Código sonnet+high, Yes (6 minor, diferidos) · Arquitectura no (plan), sobre 5cbab39

## Rulings

Ruling: spec manda sobre los tests previos — `cancelar` sin `--motivo` responde «motivo no válido…», así que los dos tests de cancel.test.js se actualizan en los RED de Task 1 (pasan `--motivo`) — spec: AND «sin --motivo» — si me equivoco, 2 asserts por reescribir.
Ruling: el motivo se valida antes de buscar la reserva (`cancelar Sur mar` sin motivo → «motivo no válido…») — el AND de la spec no condiciona a que exista la reserva — si me equivoco, cambia el orden de dos comprobaciones.
Ruling: el plan no trae línea **Modelo** — Task 1 y 2 son de 1-2 ficheros con spec completa: `sonnet` + `sdd-kit:effort-medium` (la prosa del brief, no código completo) — si me equivoco, más vueltas.
Ruling: trabajo en el sitio, en `feature/0010-cancel-reason` (no main), sin worktree aparte — nadie declaró preferencia y el perfil es delegate — si me equivoco, mover la rama.
Ruling: effort: el harness expone `sdd-kit:effort-medium`; se usa.
Task 1: Ruling: el RED se escribió en LF y el fichero original era CRLF; se devuelve a CRLF (solo formato) y se amenda al commit de la task con tasks.md — evita un diff de fichero entero — si me equivoco, ruido de EOL
Task 2: Ruling: commit docs aparte con el hash final en tasks.md (1 línea, revisado en el hilo) — un amend cambia el hash — si me equivoco, un hash viejo en un registro
Final: Ruling: Política de modelos — ejes Spec (opus+high) y Code (sonnet+high) como fija la tabla de sdd-verify; sin Arquitectura — si me equivoco, un eje menos de revisión sobre un cambio de 40 líneas
Final: minor (deferred): test de `canceladas` depende del orden de ejecución (test/cancel.test.js, último test) — lo señalan los dos ejes
Final: minor (deferred): falta un test que fije el orden «motivo antes que reserva» (`cancelar Sur mar` sin motivo → «motivo no válido…»)
Final: minor (deferred): `canceladas` sin canceladas imprime una línea vacía; la spec no dice nada (`libres` hace lo mismo)
Final: minor (deferred): `test/cancel.test.js` está en LF en el blob y era CRLF; unificar finales de línea (`.gitattributes`) en un commit de formato
Final: minor (deferred): `motivo no válido` no distingue «falta --motivo» de «motivo incorrecto» (la spec pide el mismo texto para ambos: no es un defecto)
Final: Ruling: Declined (Spec) persistencia entre procesos — cada invocación del CLI arranca con `bookings` en memoria, así que `canceladas` en un proceso aparte no ve lo cancelado antes; es el modelo de datos previo y la spec no habla de persistencia — si me equivoco, la feature no sirve en uso real por CLI y haría falta una feature de persistencia
Final: Ruling: Declined (Spec) `--motivo sala ocupada` sin comillas toma solo «sala» y lo rechaza listando los válidos — el shell parte los argumentos, la spec usa comillas — si me equivoco, mensaje confuso para quien olvida las comillas
Final: Ruling: Declined (Spec) `--motivo` antes de sala y día, y mayúsculas distintas («Sala ocupada») — la spec fija el orden posicional y una lista cerrada exacta, y el rechazo muestra los valores aceptados — si me equivoco, rechazos que la persona usuaria no esperaba
Final: Ruling: Declined (Spec) reserva `cancelled` sin `reason` saldría «undefined» en `canceladas` — inalcanzable hoy: los datos iniciales solo tienen una activa y `cancelBooking` exige motivo — si me equivoco (datos persistidos anteriores a la feature), líneas con «undefined»
Final: Ruling: Declined (Code) fronteras entre `cancelBooking`, `run` y el parseo de la CLI en el mismo módulo — es del eje Arquitectura, que el plan no sube — si me equivoco, deuda de modularidad en `src/app.js`
Final: Ruling: Declined (Code) renombre y cambio de dato de «cancelar una reserva activa» — ya adjudicado en el pre-flight (la spec manda sobre los tests previos) — si me equivoco, un test previo reescrito sin motivo

## Minors diferidos

Final: minor (deferred): test de `canceladas` depende del orden de ejecución (test/cancel.test.js, último test) — lo señalan los dos ejes
Final: minor (deferred): falta un test que fije el orden «motivo antes que reserva» (`cancelar Sur mar` sin motivo → «motivo no válido…»)
Final: minor (deferred): `canceladas` sin canceladas imprime una línea vacía; la spec no dice nada (`libres` hace lo mismo)
Final: minor (deferred): `test/cancel.test.js` está en LF en el blob y era CRLF; unificar finales de línea (`.gitattributes`) en un commit de formato
Final: minor (deferred): `motivo no válido` no distingue «falta --motivo» de «motivo incorrecto» (la spec pide el mismo texto para ambos: no es un defecto)
