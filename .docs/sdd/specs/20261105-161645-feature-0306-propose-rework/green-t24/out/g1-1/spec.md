---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Motivo al cancelar
mode: full
profile: delegate
status: draft
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - role: dev-lead
    name: Laura
    approved_at: null
---

# Spec — Motivo al cancelar

🦆 Hoy, al cancelar una reserva, la reserva se queda marcada como cancelada, pero no se sabe por qué. Con este cambio, `cancelar` exige elegir un motivo de una lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda en la reserva. Un comando nuevo, `canceladas`, lista las reservas canceladas con su motivo. Las anulaciones del responsable de sala no se tocan (son la 0011).

## Capacidades

- Modificadas: `bookings`. `cancelar` pide un motivo y el comando nuevo `canceladas` lo enseña.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores. Señales: MODIFIED (el comando `cancelar`, que ya existe), datos (campo nuevo `motivo` en la reserva), estado (reserva cancelada frente a anulada). Tamaño: ~30 líneas en 2 ficheros (`src/app.js`, `test/cancel.test.js`).
- Dominio (opus): si pedir el motivo cambia el comando `cancelar` de hoy y la «Cancelación» de PRODUCT.md, y qué no hace una reserva cancelada (señal: MODIFIED + estado)
- Técnica (sonnet): de dónde salen los datos de los escenarios, ramas de error sin escenario y el formato de salida de `cancelar` y `canceladas` (señal: MODIFIED + datos)
- Mínimo razonable: solo técnica. Deja sin mirar si un motivo como «sala ocupada» se confunde con una anulación del responsable de sala.

1. La lista de motivos es cerrada: cambio de planes, sala ocupada, otro. Se decidió con el dev-lead en la entrevista. «otro» no lleva texto libre. El motivo se compara literal: con mayúsculas o con otras palabras, no vale.
2. **El motivo es obligatorio.** `cancelar Norte lun` sin `--motivo` deja de cancelar y responde «falta el motivo: cambio de planes, sala ocupada, otro». Esto cambia el test actual «cancelar una reserva activa» de `test/cancel.test.js`. La alternativa es un motivo opcional, pero entonces habría canceladas sin motivo, que es justo lo que se quiere evitar.
3. **El listado no enseña quién canceló.** Antes la spec decía «sala, día, motivo y quién canceló». El ítem 0010 del roadmap solo pide el motivo, la CLI no sabe quién la usa y la misión dice que hay un solo usuario. Además, PRODUCT.md define la Reserva «a nombre de quien la pide», pero el código no guarda titular: es una divergencia que ya existía y esta feature no la arregla. Si quieres «quién», primero hay que guardar el titular, y eso es un ítem aparte.
4. La salida de `cancelar` cambia de «cancelada Norte lun» a «cancelada Norte lun (sala ocupada)». Cada línea de `canceladas` es «<sala> <día> — <motivo>», en el orden en que se crearon las reservas, y sin canceladas responde «sin canceladas».
5. `canceladas` lista solo las reservas con estado cancelada; las anuladas (`anular`, estado `voided`) no salen.
6. **Primero se comprueba la reserva y después el motivo.** Si no hay reserva activa (no existe, ya está cancelada o está anulada), la respuesta es «sin reserva <sala> <día>», venga o no un motivo válido. Un `--motivo` sin valor cuenta como si faltara el motivo. Los motivos de varias palabras van entre comillas y llegan como un solo argumento, que es lo que hace la shell.
7. **El plazo de 24 h no se toca.** PRODUCT.md dice que la Cancelación es «antes de 24 h», pero `cancelar` no aplica ese plazo hoy. Esta feature no lo cambia: lo propongo como fila de deuda en el roadmap cuando se cierre.
8. **`src/app.js` exporta `setBookings(lista)`**, que los tests usan para preparar las reservas de cada escenario. Hoy no hay forma de crear reservas desde la CLI, y sin esta función los tests se pisarían el estado. No cambia lo que ve el usuario.

### Decisiones tomadas con el dev-lead

- La lista cerrada de motivos (decisión 1), en la entrevista.

### Hallazgos de la review

- **Aceptado**: [dominio, Crítico] El primer requisito era ADDED, pero cambia el `cancelar` que ya existe → ahora es MODIFIED, con el comportamiento anterior y la respuesta sin `--motivo` (decisión 2).
- **Aceptado**: [dominio, Crítico] «Quién canceló» choca con la «Cancelación» de PRODUCT.md (la hace el propio cliente) y con un GIVEN que no decía de quién era la reserva → sale del alcance (decisión 3).
- **Aceptado**: [técnica, Crítico] Ningún escenario decía de dónde sale «quién canceló» → sale del alcance (decisión 3).
- **Aceptado**: [dominio, Crítico] Faltaban las Reglas de la capacidad → se añade la sección con las cinco reglas.
- **Rechazado**: [dominio, Importante] Añadir un escenario de cancelación con menos de 24 h → `cancelar` no tiene hoy ese plazo. Añadirlo es una regla nueva que el 0010 no pide; si hace falta, va en su propia fila del roadmap.
- **Aceptado**: [dominio, Importante] Faltaba lo que no hace una reserva cancelada → escenarios de que no ocupa la franja y de que no se cancela dos veces. Ninguna de las dos cosas cambia: el código ya funciona así.
- **Rechazado**: [dominio, Importante] El dev-lead «Laura» como aprobador contradice la misión → la misión habla de los usuarios del producto; el dev-lead es quien desarrolla y aprueba. «Ana» desaparece con la decisión 3.
- **Aceptado**: [dominio, Importante] El Intent prometía saber por qué se libera cualquier sala, también por una anulación → se acota a las cancelaciones.
- **Aceptado**: [dominio, Menor] Qué significa cada motivo y si «otro» lleva texto → se define en las Reglas; «otro» no lleva texto.
- **Aceptado**: [técnica, Importante] El motivo no válido iba como AND dentro de otro escenario y faltaba el caso sin `--motivo` → cada uno tiene ahora su escenario.
- **Aceptado**: [técnica, Importante] No se veía cómo se crea la reserva del GIVEN ni qué pasa si no existe → es la reserva de ejemplo de `src/app.js`, y hay escenario para «sin reserva».
- **Aceptado**: [técnica, Importante] Faltaban el listado vacío y el orden → decisión 4 y su escenario. Datos heredados: no aplica, las reservas viven en memoria y no hay nada guardado de antes.
- **Aceptado**: [técnica, Importante] El modelo de datos no estaba declarado → en el Approach: campo `motivo` en la reserva, sin migración; la reserva cancelada ya se conserva y no bloquea la franja.
- **Aceptado**: [técnica, Importante] Decisiones del cuerpo que no estaban en la lista → decisiones 4 y 5.
- **Aceptado**: [técnica, Menor] La antigua decisión 3, «Sin review», iba contra la rúbrica → sustituida por el bloque de la review.
- **Aceptado**: [técnica, Menor] «Dónde se prueba» no decía qué tests cambian → se amplía `test/cancel.test.js` y se cambia su test «cancelar una reserva activa».
- Segunda ronda (sonnet, los siete puntos, sin Críticos):
- **Aceptado**: El plazo de 24 h de PRODUCT.md no coincide con `cancelar` y no se decía → decisión 7, con una fila de deuda.
- **Aceptado**: «La reserva no guarda titular» choca con la Reserva de PRODUCT.md → la decisión 3 lo dice como divergencia que ya existía.
- **Aceptado**: Faltaba el escenario de cancelar dos veces → escenario «Una reserva ya cancelada o anulada no se cancela».
- **Aceptado**: Las anuladas fuera del listado y el orden de varias canceladas no tenían escenario → escenarios nuevos.
- **Aceptado**: El orden de validación (reserva o motivo) y el caso de una reserva anulada no estaban fijados → decisión 6.
- **Aceptado**: La regla de idioma iba más allá de la constitución → se limita al texto de la interfaz; los identificadores del código siguen como están.
- **Aceptado**: La comparación literal no tenía escenario → escenario con «Sala ocupada».
- **Aceptado**: `--motivo` sin valor y los motivos con comillas → decisión 6 y escenario.
- **Rechazado**: Otros consumidores de la salida antigua de `cancelar`, y el texto de ayuda → la CLI no tiene texto de ayuda, y la misión dice que hay un solo usuario y nadie más lee esa salida.
- **Aceptado**: «sala ocupada» se podía confundir con una anulación → las Reglas dicen que es un motivo del cliente.

## Intent

Hoy, cuando un cliente cancela una reserva, no queda constancia del motivo. Se quiere guardar el motivo de cada cancelación y poder consultarlo.

## Scope

- Entra: `cancelar <sala> <día> --motivo <motivo>`, con el motivo obligatorio; el comando nuevo `canceladas`.
- No entra: anulaciones del responsable de sala (0011); quién canceló (decisión 3); plazo de 24 h para cancelar.

## Approach

La reserva gana un campo `motivo`, que solo se rellena al cancelar. `cancelBooking` valida el motivo contra la lista antes de cambiar el estado: si el motivo falta o no es válido, la reserva no cambia. `canceladas` filtra las reservas con `status: 'cancelled'`. Las reservas viven en memoria (`src/app.js`), así que no hay migración. Una reserva cancelada ya se conserva con su estado y no ocupa la franja (`libres` solo cuenta las activas); eso no cambia.

## Reglas de la capacidad

- Dónde viven los datos: en la propia reserva (`motivo`), en memoria, como el resto de reservas.
- Idioma de los nombres: el texto de la interfaz va en castellano (constitución, punto 4): `--motivo`, `canceladas`, los motivos y los mensajes. Los identificadores del código siguen como están (`status: 'cancelled'`).
- Límites: solo los tres motivos de la lista; «otro» no lleva texto. Son motivos del cliente al cancelar su propia reserva: «sala ocupada» no es una anulación del responsable de sala (0011).
- Avisos: «falta el motivo: …» y «motivo no válido: …», los dos con la lista completa.
- Regla de conflicto: si el motivo falta o no es válido, no se cancela. Cancelar una reserva ya cancelada responde lo mismo que hoy, «sin reserva <sala> <día>».

## Dónde se prueba

- Todo por `run(...)` de `src/app.js`, en `test/cancel.test.js` (se amplía; cambia el test «cancelar una reserva activa»).
- Las reservas de cada escenario se preparan con una función exportada para los tests, `setBookings(lista)`, porque `reservar` no crea reservas de verdad y el estado en memoria se comparte entre tests (decisión 8).

## Delta de comportamiento

### Capacidad: `bookings`

**MODIFIED — Cancelar pide un motivo de la lista**
_Antes: `cancelar Norte lun` cancelaba y respondía «cancelada Norte lun»._
- GIVEN la reserva activa de Norte del lunes, 10:00-12:00 (la de ejemplo de `src/app.js`)
- WHEN `cancelar Norte lun --motivo "sala ocupada"`
- THEN responde «cancelada Norte lun (sala ocupada)»
- AND `libres 10:00-12:00` incluye Norte

**ADDED — Un motivo fuera de la lista no cancela**
- GIVEN la reserva activa de Norte del lunes
- WHEN `cancelar Norte lun --motivo "aburrimiento"`
- THEN responde «motivo no válido: cambio de planes, sala ocupada, otro»
- AND la reserva sigue activa (`libres 10:00-12:00` no incluye Norte)

**ADDED — El motivo se compara literal**
- GIVEN la reserva activa de Norte del lunes
- WHEN `cancelar Norte lun --motivo "Sala ocupada"`
- THEN responde «motivo no válido: cambio de planes, sala ocupada, otro»

**ADDED — Sin motivo no cancela**
- GIVEN la reserva activa de Norte del lunes
- WHEN `cancelar Norte lun`, o `cancelar Norte lun --motivo` sin valor
- THEN responde «falta el motivo: cambio de planes, sala ocupada, otro»
- AND la reserva sigue activa

**ADDED — Cancelar lo que no hay lo dice**
- GIVEN no hay reserva activa de Sur el martes
- WHEN `cancelar Sur mar --motivo otro`, o `cancelar Sur mar` sin motivo
- THEN responde «sin reserva Sur mar»

**ADDED — Una reserva ya cancelada o anulada no se cancela**
- GIVEN la reserva de Norte del lunes cancelada con «sala ocupada»
- WHEN `cancelar Norte lun --motivo otro`
- THEN responde «sin reserva Norte lun»
- AND `canceladas` sigue respondiendo «Norte lun — sala ocupada»
- AND con la reserva anulada (`anular Norte lun`) en vez de cancelada, la respuesta es la misma «sin reserva Norte lun»

**ADDED — El listado de canceladas enseña el motivo**
- GIVEN la reserva de Norte del lunes cancelada con «sala ocupada»
- WHEN `canceladas`
- THEN responde «Norte lun — sala ocupada»

**ADDED — El listado sigue el orden de las reservas y deja fuera las anuladas**
- GIVEN tres reservas creadas en este orden: Norte lun (cancelada con «otro»), Sur mar (anulada), Sur mié (cancelada con «cambio de planes»)
- WHEN `canceladas`
- THEN responde dos líneas, en este orden: «Norte lun — otro» y «Sur mié — cambio de planes»

**ADDED — Sin canceladas, el listado lo dice**
- GIVEN ninguna reserva cancelada
- WHEN `canceladas`
- THEN responde «sin canceladas»

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
