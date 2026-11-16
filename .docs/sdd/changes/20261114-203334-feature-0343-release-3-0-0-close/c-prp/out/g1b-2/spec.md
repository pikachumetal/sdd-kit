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

🦆 Hoy, cuando alguien cancela su reserva, la sala queda libre y no queda escrito por qué. Con esta feature, cancelar exige elegir un motivo de una lista corta (cambio de planes, sala ocupada, otro): `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)», y sin motivo o con uno inventado no cancela y enseña la lista. Un comando nuevo, `canceladas`, lista cada cancelación con sala, día, motivo y quién la hizo: «Norte lun — sala ocupada — Ana». Las anulaciones del responsable no salen ahí.

## Capacidades

- Nuevas: `bookings` — cancelar pide un motivo y el listado de canceladas lo enseña. No existe `capabilities/` en el proyecto: esta spec la crea.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor con los siete puntos — señales: capacidad nueva (`bookings`), datos nuevos en memoria (motivo y titular en la reserva, sin base de datos ni migración) · tamaño: ~50 líneas en 2 ficheros (`src/app.js`, `test/cancel.test.js`), sin contrato público ni `MODIFIED`
- Dominio y técnica (opus): si la regla «sin motivo válido no se cancela» choca con la Cancelación del glosario de `PRODUCT.md`, y si «quién canceló = titular» deja fuera algún caso (señal: capacidad nueva)
- Mínimo razonable: sin review — deja sin mirar si los THEN pasan sin el comportamiento y si falta algún caso de la lista de motivos

1. **Capacidad nueva `bookings`**: no hay `capabilities/`; la spec la crea con estos tres requisitos. El slug va en inglés porque es nombre de fichero (convención del kit); su contenido, en castellano.
2. **El listado de canceladas enseña sala, día, motivo y quién canceló** — la petición habla de «saber quién y por qué».
3. **Quién canceló = el titular de la reserva.** En `PRODUCT.md` la Cancelación la hace «el propio cliente», así que quien cancela es quien reservó: la reserva guarda su titular y `cancelar` no pide nombre. Hoy `reservar` no crea reservas (responde un texto fijo) y no cambia; la única reserva es la de ejemplo de `src/app.js` (Norte, lun, 10:00-12:00), que pasa a ser de Ana (nombre inventado).
4. **Sin `--motivo`, lo mismo que un motivo fuera de la lista**: no cancela y responde «motivo no válido: cambio de planes, sala ocupada, otro».
5. **Cambia la respuesta de hoy**: `cancelar Norte lun` responde hoy «cancelada Norte lun»; pasa a exigir motivo y a responder «cancelada Norte lun (sala ocupada)». El test `cancelar una reserva activa` de `test/cancel.test.js` se reescribe con motivo. «sin reserva Sur mar» no cambia.
6. **Enfoque**: A (motivo en la reserva cancelada y filtro por estado), frente a B (registro aparte) — ver Approach.
7. **Una task**: cancelar con motivo y listado, en `src/app.js` y `test/cancel.test.js`.
8. **El límite de 24 h no se valida en esta feature**: el glosario lo menciona, pero hoy `cancelar` no lo comprueba ni las reservas guardan hora de creación; va a «No entra».
9. **Motivo exacto**: se compara literal, en minúsculas y sin recortar espacios; «Sala ocupada» o «sala ocupada » no valen.
10. **Orden de comprobación**: primero que exista la reserva, luego el motivo. `cancelar Sur mar` sin motivo responde «sin reserva Sur mar».
11. **Anulación con estado propio**: `anular` sigue dejando la reserva en `voided` (como hoy) y `canceladas` solo lista las `cancelled`.
12. **Listado vacío**: `canceladas` sin ninguna cancelación responde «sin canceladas».
13. **Orden del listado**: en el orden en que se cancelaron, una por línea.
14. **Corregido en la pasada de coherencia**: `bookings` pasa de «Modificadas» a «Nuevas»; se retira «Sin review de spec» (la rúbrica decide cuántos revisores, no si hay review); se añaden las decisiones 3, 4 y 5.

Política de modelos: ejecución Native (`execution: native`, fijado en `sdd-kit.json`): la sesión implementa la única task con su modelo; revisor de spec en opus.

Delta en copia: `sdd capability merge` — crea `bookings.md` con los requisitos añadidos, sin rechazos.

### Hallazgos de la review

- **Rechazado** — renombrar la capacidad a `reservas` por el glosario → el slug de una capacidad va en inglés kebab-case porque es nombre de fichero (convención del kit); el contenido de `bookings.md` va en castellano y usa «reserva».
- **Aceptado** — el límite de 24 h del glosario queda sin decidir → decisión 8 y «No entra».
- **Aceptado** — el THEN del listado pasa con una cadena fija → GIVEN con dos cancelaciones y una reserva activa, más el caso vacío (decisión 12).
- **Aceptado** — solo se prueba «sala ocupada» y no se fija la regla de mayúsculas → un caso por cada motivo válido y la decisión 9 con su caso.
- **Aceptado** — las anulaciones podrían salir en `canceladas` → decisión 11 y escenario.
- **Aceptado** — no se dice cómo se fija el titular de las reservas nuevas → decisión 3: `reservar` no crea reservas hoy y no cambia; caso sin titular «no aplica».
- **Aceptado** — faltan las cinco reglas de la capacidad → sección «Reglas de la capacidad».
- **Aceptado** — orden de comprobación sin decidir → decisión 10 y escenario.
- **Rechazado** — la salida de `cancelar` como contrato público → la rúbrica cuenta como contrato lo que consume otro módulo o sistema; aquí la lee una persona en la terminal. El cambio visible ya está en la decisión 5.
- **Aceptado en parte** — nombres de persona → «Ana» queda marcado como inventado (decisión 3); «Laura» del frontmatter es el nombre del dev-lead que aprueba: confírmalo o lo dejo solo con el rol.

Sin Crítico aceptado ni decisión central reescrita: no hay segunda ronda.

## Decisiones tomadas con el dev-lead

1. La lista de motivos es cerrada: cambio de planes, sala ocupada, otro — decidido en la entrevista.

## Intent

Hoy cancelar no deja rastro: nadie sabe por qué se liberó una sala. Se quiere el motivo de cada cancelación y quién la hizo. Éxito: cada cancelación tiene un motivo de la lista y `canceladas` las enseña todas, sin anulaciones. Anti-objetivo: que se pueda cancelar sin motivo.

## Scope

- Entra: `cancelar <sala> <día> --motivo <motivo>` con la lista cerrada; comando `canceladas`; titular en la reserva; reescribir el test de cancelar en `test/cancel.test.js`.
- No entra: anulaciones del responsable de sala (0011) — `anular` no cambia; motivos libres o editables; el límite de 24 h de la Cancelación; que `reservar` cree reservas con titular.

## Approach

- **A (elegido)** — el motivo se guarda en la propia reserva al pasar a `cancelled`; `canceladas` filtra las reservas con ese estado. Un solo sitio para los datos, sin estructura nueva: encaja con un único `src/app.js` en memoria.
- **B** — un registro aparte de cancelaciones (sala, día, motivo, titular). Duplica datos de la reserva para nada mientras no haya historial que conservar.

## Reglas de la capacidad

- **Dónde vive el dato**: en memoria, en la reserva de `src/app.js` (`operations.md`: sin base de datos).
- **Idioma de los nombres**: lo visible en castellano (motivos, mensajes, comandos); los estados internos (`cancelled`, `voided`) no se enseñan y siguen como hoy.
- **Límites**: tres motivos cerrados; el de 24 h no aplica en esta feature (decisión 8).
- **Avisos**: «motivo no válido: cambio de planes, sala ocupada, otro»; «sin canceladas».
- **Regla ante conflicto**: reserva inexistente y motivo no válido a la vez → manda «sin reserva <sala> <día>» (decisión 10).

## Dónde se prueba

- Motivo: por el comando `cancelar`, en `test/cancel.test.js`.
- Listado: por la salida del comando `canceladas`, en `test/cancel.test.js`.

## Delta de comportamiento

### Capacidad: `bookings`

**ADDED — Cancelar pide un motivo de la lista**
- GIVEN la reserva de Norte del lunes, 10:00-12:00, de Ana
- WHEN `cancelar Norte lun --motivo <motivo>`
- THEN responde «cancelada Norte lun (<motivo>)», para cada uno: «cambio de planes», «sala ocupada», «otro» (un caso por motivo, con la reserva activa al empezar)
- AND `cancelar Norte lun --motivo "me aburro"` responde «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa
- AND `cancelar Norte lun --motivo "Sala ocupada"` responde lo mismo y la reserva sigue activa
- AND `cancelar Norte lun` sin `--motivo` responde lo mismo y la reserva sigue activa
- AND `cancelar Sur mar` sin `--motivo` responde «sin reserva Sur mar»

**ADDED — El listado de canceladas enseña el motivo y quién canceló**
- GIVEN la reserva de Norte del lunes, de Ana, cancelada con «sala ocupada», después la de Sur del martes, de Ana, cancelada con «otro», y la de Norte del miércoles, de Ana, activa
- WHEN `canceladas`
- THEN responde, en dos líneas, «Norte lun — sala ocupada — Ana» y «Sur mar — otro — Ana», y no lista Norte mié
- AND sin ninguna cancelación responde «sin canceladas»

**ADDED — Las anulaciones no salen en canceladas**
- GIVEN la reserva de Norte del lunes, de Ana, anulada con `anular Norte lun`
- WHEN `canceladas`
- THEN responde «sin canceladas»

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
