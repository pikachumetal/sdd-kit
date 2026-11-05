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

> 🦆 Hoy, cuando cancelas una reserva, la sala queda libre y no se sabe por qué. Con esta feature, `cancelar` pide un motivo de una lista cerrada de tres: cambio de planes, sala ocupada u otro. Si falta el motivo, o no está en la lista, la reserva no se cancela. Un comando nuevo, `canceladas`, lista las reservas canceladas con su franja y su motivo. Lo que cambia para ti: `cancelar Norte lun` sin motivo deja de funcionar.

## Capacidades

- Modificadas: `bookings`. Cancelar exige un motivo y un listado nuevo enseña las canceladas.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: MODIFIED (cambia «Cancelar una reserva propia» de v0.3.0), datos (motivo guardado en la reserva) · tamaño: ~40 líneas en 2 ficheros (`src/app.js`, `test/cancel.test.js`)
- Dominio (opus): si exigir `--motivo` rompe la cancelación de v0.3.0 sin declararlo, y de dónde sale «quién canceló» en una herramienta de un solo usuario (señal: MODIFIED)
- Técnica (sonnet): de dónde sale cada dato de la línea del listado y dónde vive el motivo entre comandos (señal: datos)
- Mínimo razonable: solo la técnica, en lugar de las dos que se lanzaron. Sin la de dominio, nadie habría comparado la spec con la misión, que dice que hay un solo usuario, y «quién canceló» habría seguido en el listado.
- Segunda ronda (sonnet, siete puntos): hubo Críticos aceptados. No sacó ningún Crítico.

1. La lista de motivos es cerrada y tiene tres: cambio de planes, sala ocupada, otro. Lo decidiste tú en la entrevista.
2. **El listado ya no enseña quién canceló.** Ahora enseña sala, día, franja y motivo. Antes ponía «quién»: lo saqué de «saber quién y por qué», pero ni el Intent ni la fila 0010 del roadmap lo piden. Además, la misión dice que hay un solo usuario, la reserva no guarda titular y `cancelar` no tiene de dónde sacarlo. Si lo quieres, hay que decidir de dónde sale.
3. **Cancelar sin `--motivo` se rechaza** y responde «falta el motivo: cambio de planes, sala ocupada, otro». No pongo «otro» por defecto, porque dejaría cancelaciones sin rastro real.
4. **El motivo se valida antes que la reserva.** Si el motivo falta o no está en la lista, ese error gana a «sin reserva».
5. El motivo va en `--motivo <motivo>`, detrás de la sala y el día, y se compara de forma exacta: en minúsculas, tal como sale en la lista y entre comillas cuando tiene espacios. «Sala ocupada» o `sala ocupada` sin comillas no son válidos. Un `--motivo` sin valor o vacío cuenta como «falta el motivo». «otro» no admite texto libre.
6. El motivo se guarda en la reserva cancelada, en memoria, como las reservas de hoy. Que dure entre ejecuciones del CLI queda fuera de esta feature.
7. `canceladas` no lleva argumentos. Escribe una línea por cancelación con el formato «<sala> <día> <franja> — <motivo>». Si no hay ninguna, responde «sin canceladas». Las reservas anuladas no salen. No fijo el orden de varias líneas: hoy ningún comando crea una segunda reserva, así que no se podría probar.
8. **La respuesta al cancelar cambia** de «cancelada Norte lun» a «cancelada Norte lun (sala ocupada)», para que confirmes el motivo que ha quedado guardado.
9. Una reserva anulada no se puede cancelar: responde «sin reserva», como hoy. `anular` no cambia.

### Hallazgos de la review

- **Aceptado** — Crítico (dominio 1): el ADDED de cancelar cambia «Cancelar una reserva propia» de v0.3.0, así que es un MODIFIED sin declarar → el delta lo declara como `MODIFIED`, con el comportamiento anterior y el nuevo.
- **Aceptado** — Crítico (dominio 2, técnica 3): no decía qué pasa sin `--motivo` → decisión 3 y su escenario.
- **Aceptado** — Crítico (técnica 1 y 2): «quién canceló» no tenía de dónde salir, y el GIVEN «cancelada por Ana» no se podía montar con el comando → decisión 2: el dato sale del listado y del escenario.
- **Aceptado** — Importante (dominio 3 y 6): «quién» era alcance oculto, y «Ana» chocaba con la misión, que dice que hay un solo usuario → resuelto con la decisión 2.
- **Aceptado** — Importante (técnica 4): faltaban el caso «sin reserva» con el formato nuevo y el orden de los errores → decisión 4 y sus escenarios.
- **Aceptado** — Importante (técnica 5): faltaban la lista vacía y la de varias filas → la lista vacía tiene escenario. El orden de varias filas se quita (decisión 7), porque ningún comando crea una segunda reserva.
- **Aceptado** — Importante (técnica 6, dominio 5): no decía dónde viven los datos, y faltaban las cinco reglas → decisión 6 y la sección «Reglas de la capacidad».
- **Aceptado** — Importante (técnica 7): no había regla de comparación del motivo → decisión 5.
- **Aceptado** — Importante (dominio 4): faltaba lo que no puede hacer una reserva cancelada → escenario: cancelarla otra vez responde «sin reserva».
- **Aceptado** — Menor (dominio 8): no decía si las anulaciones salen en el listado → decisión 7 y escenario: las anuladas no salen.
- **Aceptado** — Menor (dominio 9, técnica 8): la franja del GIVEN no se usaba, y el listado no distinguía dos reservas el mismo día → la línea del listado lleva la franja.
- **Aceptado** — Menor (técnica 9 y 10): faltaban el formato, los filtros y la sintaxis de `canceladas` → decisión 7 y Scope.
- **Aceptado** — Importante (2.ª ronda 1): la respuesta nueva al cancelar no estaba entre las decisiones → decisión 8.
- **Aceptado** — Importante (2.ª ronda 2): no decía qué pasa al cancelar una reserva anulada → decisión 9 y un AND en el escenario de las anuladas.
- **Aceptado** — Importante (2.ª ronda 3): el orden de varias filas no tenía escenario → se quita la regla (decisión 7).
- **Aceptado** — Importante (2.ª ronda 4 y 5): faltaban escenarios de mayúsculas, de `--motivo` sin valor y de la posición del flag → decisión 5 y dos escenarios.
- **Aceptado** — Menor (2.ª ronda 6): el Intent no mencionaba el listado ni el cambio incompatible → el Intent los menciona.
- **Aceptado** — Menor (2.ª ronda 7 y 9): la redacción del límite de 24 h, y la falta de un arranque en frío → «Reglas de la capacidad».
- **Aceptado** — Menor (2.ª ronda 8): el «Aceptado» de varias filas y la línea del mínimo razonable → corregidos.
- **Rechazado** — Importante (dominio 7): cambiar al aprobador «Laura» → es la dev-lead que aprueba esta spec, no un ejemplo; el campo exige a una persona real.
- **Rechazado** — Menor (dominio 10): el límite de 24 h de PRODUCT → hoy no está implementado, y esta feature no lo toca; queda en «Reglas de la capacidad» como «no cambia».

## Intent

Hoy, cancelar no deja rastro: nadie sabe por qué se liberó una sala. Se quiere guardar el motivo de cada cancelación y verlo con `canceladas`. A cambio, cancelar sin motivo deja de funcionar.

## Scope

- Entra: `cancelar <sala> <día> --motivo <motivo>`, con el motivo obligatorio; el comando nuevo `canceladas`, sin argumentos.
- No entra: las anulaciones del responsable de sala (0011), que no piden motivo de esta lista ni salen en `canceladas`; guardar las reservas en disco; quién canceló.

## Approach

El motivo validado se guarda en la reserva al pasar a estado cancelada. `canceladas` recorre las reservas en estado cancelada, en el orden en que se cancelaron.

## Reglas de la capacidad

- Dónde viven los datos: en la propia reserva, en memoria, igual que hoy. Nada persiste entre ejecuciones: en una ejecución nueva, `canceladas` responde «sin canceladas».
- Idioma de los nombres: castellano, por la regla 4 de la constitución (motivos, mensajes y el comando `canceladas`).
- Límites: lista cerrada de tres motivos; «otro» no admite texto libre. El límite de 24 h que define PRODUCT no se implementa en esta feature.
- Avisos: «falta el motivo: cambio de planes, sala ocupada, otro» y «motivo no válido: cambio de planes, sala ocupada, otro».
- Regla ante conflicto: con un motivo inválido y sin reserva a la vez, gana el aviso del motivo.

## Dónde se prueba

- Motivo: por el comando `cancelar`, en `test/cancel.test.js`. El test «cancelar una reserva activa» pasa a usar `--motivo`.
- Listado: por la salida del comando `canceladas`, en `test/cancel.test.js`.

## Delta de comportamiento

### Capacidad: `bookings`

**MODIFIED — Cancelar una reserva propia exige un motivo de la lista**
- Antes (v0.3.0): `cancelar Norte lun` respondía «cancelada Norte lun».
- GIVEN la reserva de Norte del lunes, 10:00-12:00
- WHEN `cancelar Norte lun --motivo "sala ocupada"`
- THEN responde «cancelada Norte lun (sala ocupada)»
- AND `cancelar Norte lun --motivo otro`, otra vez, responde «sin reserva Norte lun»

**Escenario — sin motivo**
- GIVEN la reserva de Norte del lunes, 10:00-12:00
- WHEN `cancelar Norte lun`
- THEN responde «falta el motivo: cambio de planes, sala ocupada, otro»
- AND la reserva sigue activa

**Escenario — motivo fuera de la lista**
- GIVEN la reserva de Norte del lunes, 10:00-12:00
- WHEN `cancelar Norte lun --motivo "me aburro"`
- THEN responde «motivo no válido: cambio de planes, sala ocupada, otro»
- AND la reserva sigue activa

**Escenario — sin reserva**
- GIVEN no hay reserva de Sur el martes
- WHEN `cancelar Sur mar --motivo otro`
- THEN responde «sin reserva Sur mar»
- AND `cancelar Sur mar --motivo "me aburro"` responde «motivo no válido: cambio de planes, sala ocupada, otro»

**Escenario — motivo con otra forma**
- GIVEN la reserva de Norte del lunes, 10:00-12:00
- WHEN `cancelar Norte lun --motivo "Sala ocupada"`
- THEN responde «motivo no válido: cambio de planes, sala ocupada, otro»
- AND `cancelar Norte lun --motivo` responde «falta el motivo: cambio de planes, sala ocupada, otro»
- AND la reserva sigue activa

**ADDED — El listado de canceladas enseña la franja y el motivo**
- GIVEN la reserva de Norte del lunes, 10:00-12:00, cancelada con `cancelar Norte lun --motivo "sala ocupada"`
- WHEN `canceladas`
- THEN responde «Norte lun 10:00-12:00 — sala ocupada»

**Escenario — sin canceladas**
- GIVEN ninguna reserva cancelada
- WHEN `canceladas`
- THEN responde «sin canceladas»

**Escenario — las anuladas no salen**
- GIVEN la reserva de Norte del lunes, 10:00-12:00, anulada con `anular Norte lun`
- WHEN `canceladas`
- THEN responde «sin canceladas»
- AND `cancelar Norte lun --motivo otro` responde «sin reserva Norte lun»

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
