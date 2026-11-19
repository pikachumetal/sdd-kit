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

## Capacidades

- Nuevas: `reservas` — cancelar pide un motivo y el listado de canceladas lo enseña. (El proyecto aún no tiene `capabilities/`: es la primera.)

## Decisiones que he tomado yo — valida estas

1. La lista de motivos es cerrada: cambio de planes, sala ocupada, otro — decidido con el dev-lead en la entrevista.
2. El listado de canceladas enseña sala, día, motivo y quién canceló — la petición habla de «saber quién y por qué». Formato: una línea por reserva, «<sala> <día> — <motivo> — <titular>», en el orden de los datos; `canceladas` no lleva argumentos.
3. Quién canceló es el titular de la reserva: PRODUCT define la cancelación como «la reserva que anula el propio cliente», así que `cancelar` no lleva un parámetro nuevo. Hoy la reserva no guarda titular: se añade el campo a todas las reservas de los datos fijos en memoria de `src/app.js`. `reservar` no cambia, porque hoy no crea reservas en esa lista; cuando las cree, tendrá que fijar el titular, y eso queda fuera.
4. `cancelar` sin `--motivo`, o con `--motivo ""`, no cancela y responde «falta el motivo: cambio de planes, sala ocupada, otro».
5. El motivo vale solo si coincide exactamente, mayúsculas incluidas, con uno de la lista; si no, no cancela y responde «motivo no válido: cambio de planes, sala ocupada, otro».
6. `canceladas` solo lista las reservas canceladas: quedan fuera las activas y las anuladas (el comando `anular` ya existe en `src/app.js`; la 0011 solo restringe quién lo usa). Sin ninguna, responde «sin canceladas».
7. El plazo de 24 h que PRODUCT pone a la cancelación no existe hoy en el código y queda fuera de esta feature: aquí «cancelar» se usa sin plazo.
8. La spec pasa por review (corregido en el pase de coherencia: decía «sin review», pero en full la review es obligatoria y su tamaño lo decide la rúbrica).

### Hallazgos de la review

Review de spec: un revisor con los siete puntos (opus) y segunda ronda (sonnet) por un Crítico aceptado. Señales: capacidad nueva, datos (motivo y titular). Tamaño: ~40 líneas en 2 ficheros. No toca contratos públicos ni tiene MODIFIED de capacidad: no existe `capabilities/`, y el cambio de la salida de `cancelar` va en «Lo que se retira o cambia de forma».

Primera ronda:

- **Rechazado** — Crítico: el escenario usa `anular`, que sería de la 0011 → `anular` ya existe en `src/app.js:20-25`; la 0011 solo limita quién lo usa (decisión 6).
- **Aceptado** — Crítico: no se dice cómo llega el titular a la reserva → decisión 3.
- **Aceptado** — faltaban las «Reglas de la capacidad» → sección añadida.
- **Aceptado** — la capacidad se llamaba `bookings` (PRODUCT: evitar «booking») → renombrada a `reservas`; en la spec, los estados van en castellano.
- **Rechazado** — `cancelar <sala> <día>` es ambiguo si hay dos franjas → es el contrato actual de `cancelar` (patch 0007), que esta feature no cambia.
- **Aceptado** — el THEN del listado pasaba sin filtrar por estado → GIVEN con una reserva activa y otra anulada, y el caso «sin canceladas».
- **Rechazado** — falta el plazo de 24 h → no existe hoy y queda fuera (decisión 7). La doble cancelación ya responde «sin reserva …» (reglas).
- **Aceptado** — el Intent no prometía el «quién» ni el listado → Intent reescrito.
- **Aceptado** — la regla de coincidencia del motivo no estaba entre las decisiones → decisión 5.
- **Rechazado** — aprobador «Laura» con nombre propio → es el registro de aprobación del proyecto, no un ejemplo; lo decides tú.

Segunda ronda (sin tercera):

- **Rechazado** — Crítico: el cambio de `cancelar` es un MODIFIED no declarado → no hay requisito vivo en `capabilities/` que modificar (el merge en una copia lo confirma). El cambio de forma de la salida actual queda en su tabla con el fichero y la línea.
- **Aceptado** — Crítico: los AND de error no tenían su propio WHEN, y faltaba el caso de mayúsculas → cada caso es un requisito con su WHEN, y «sigue activa» se comprueba con `canceladas`.
- **Aceptado** — faltaban el GIVEN con una reserva anulada, el orden con varias y el formato de línea → escenarios añadidos; formato en la decisión 2.
- **Aceptado** — la numeración de las decisiones estaba desordenada y faltaban decisiones → renumeradas; añadidos el formato, la ausencia de argumentos y el plazo.
- **Aceptado** — el titular solo existe en los datos fijos → decisión 3 y Scope lo dicen.
- **Aceptado** — divergencia con el término de PRODUCT (24 h) → decisión 7.
- **Aceptado** — conflicto entre cancelada y anulada, y motivo vacío → reglas y decisión 4.
- **Aceptado** — `canceladas` no distingue usuarios → anotado en las reglas: hay un solo usuario (PRODUCT).
- **Aceptado** — el gate es `node --test` entero → «Dónde se prueba». Ningún otro test usa la salida de `cancelar` (solo `test/cancel.test.js:6`).
- **Rechazado** — «Laura» → igual que en la primera ronda. «Ana» es un nombre de prueba inventado.

## Intent

Hoy cancelar no deja rastro: nadie sabe quién liberó una sala ni por qué. Se quiere guardar el motivo de cada cancelación y consultar con `canceladas` quién canceló y por qué.

## Scope

- Entra: `cancelar <sala> <día> --motivo <motivo>`; comando `canceladas`; campos nuevos titular y motivo en los datos fijos de reservas. Ficheros: `src/app.js` (`cancelBooking`, `run`, datos de `bookings`), `test/cancel.test.js`.
- No entra: anulaciones del responsable de sala (0011); el plazo de 24 h; que `reservar` cree reservas con titular.

### Reglas de la capacidad

- Dónde vive el dato: motivo y titular, en la reserva, dentro de los datos en memoria de `src/app.js`, como el resto de reservas (sin persistencia, ver architecture).
- Idioma de los nombres: castellano en la interfaz y en los motivos (constitución, punto 4).
- Límites: lista cerrada de tres motivos, con coincidencia exacta; el motivo vacío cuenta como que falta.
- Avisos: no aplica.
- Regla en conflicto: solo se cancela una reserva activa. Cancelar una reserva cancelada o anulada responde «sin reserva <sala> <día>», como hoy, y no cambia su motivo. `anular` solo actúa sobre reservas activas, así que no toca una cancelada. `canceladas` no filtra por usuario, porque hay uno solo (PRODUCT).

### Lo que se retira o cambia de forma

| Qué | Dónde | Destino |
| --- | --- | --- |
| Salida «cancelada <sala> <día>» sin motivo | `src/app.js:17` | pasa a «cancelada <sala> <día> (<motivo>)» |
| `cancelar Norte lun` sin motivo espera «cancelada Norte lun» | `test/cancel.test.js:6` | se reescribe con `--motivo`; el caso sin motivo espera «falta el motivo: …» |
| Reserva sin titular | `src/app.js:3` | cada reserva de los datos fijos lleva titular |

## Approach

El motivo se guarda con la reserva cancelada; `canceladas` lista las reservas con estado cancelada.

## Dónde se prueba

- Motivo: por el comando `cancelar`, en `test/cancel.test.js`.
- Listado: por la salida del comando `canceladas`, en `test/cancel.test.js`.
- Gate: `node --test` entero en verde (constitución, punto 2).

## Delta de comportamiento

### Capacidad: `reservas`

**ADDED — Cancelar con un motivo de la lista**
- GIVEN la reserva activa de Norte del lunes
- WHEN `cancelar Norte lun --motivo "sala ocupada"`
- THEN responde «cancelada Norte lun (sala ocupada)»

**ADDED — Un motivo fuera de la lista no cancela**
- GIVEN la reserva activa de Norte del lunes
- WHEN `cancelar Norte lun --motivo "Sala ocupada"`
- THEN responde «motivo no válido: cambio de planes, sala ocupada, otro»
- AND `canceladas` responde «sin canceladas»

**ADDED — Sin motivo no cancela**
- GIVEN la reserva activa de Norte del lunes
- WHEN `cancelar Norte lun` sin `--motivo`, o con `--motivo ""`
- THEN responde «falta el motivo: cambio de planes, sala ocupada, otro»
- AND `canceladas` responde «sin canceladas»

**ADDED — El listado de canceladas enseña el motivo y quién canceló**
- GIVEN la reserva de Norte del lunes, a nombre de Ana, cancelada con «sala ocupada»; la de Sur del martes, a nombre de Ana, cancelada con «otro»; la de Norte del miércoles, activa; y la de Sur del jueves, anulada con `anular`
- WHEN `canceladas`
- THEN responde dos líneas, en este orden: «Norte lun — sala ocupada — Ana» y «Sur mar — otro — Ana»
- AND no aparecen ni la reserva activa ni la anulada

**ADDED — Sin canceladas el listado lo dice**
- GIVEN ninguna reserva cancelada
- WHEN `canceladas`
- THEN responde «sin canceladas»

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
