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

🦆 Hoy `cancelar Norte lun` libera la sala y no queda rastro de por qué. Con esta feature hay que decir el motivo: `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)», y sin motivo, o con uno que no está en la lista, no cancela. Un comando nuevo, `canceladas`, enseña cada cancelación con su motivo: «Norte lun 10:00-12:00 — sala ocupada».

## Capacidades

- Nueva: `reservas` — no existe `capabilities/`; `sdd-archive` crea `capabilities/reservas.md` con la línea base de v0.3.0 (cancelar una reserva activa por sala y día; «sin reserva <sala> <día>» si no hay una activa) y le aplica este delta. Así el MODIFIED tiene un requisito previo escrito.

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`reservas`), MODIFIED (cancelar sin motivo deja de funcionar), datos (el motivo se guarda con la reserva) · tamaño: ~50 líneas en 2 ficheros (`src/app.js`, `test/cancel.test.js`)
- Dominio (opus): si exigir `--motivo` rompe algún uso de «Cancelación» de `PRODUCT.md` y si el listado sin «quién» cubre lo que pide la fila 0010 (señal: MODIFIED)
- Técnica (sonnet): si guardar el motivo en la reserva en memoria basta para que `canceladas` lo enseñe, y si los mensajes de error son verificables por la salida del comando (señal: datos + capacidad nueva)
- Mínimo razonable: un revisor con los siete puntos — deja sin contrastar por separado el MODIFIED con el glosario de `PRODUCT.md`

1. La lista de motivos es cerrada: cambio de planes, sala ocupada, otro — decidido con el dev-lead en la entrevista, que es su única fuente escrita. «otro» no admite texto libre. **Valida esta:** dos revisores ven «sala ocupada» más propio de una Anulación (la del responsable de sala, «por cualquier motivo», 0011) que de una Cancelación del propio cliente; la mantengo porque la elegiste tú.
2. El listado de canceladas enseña sala, día, franja y motivo, **sin quién canceló**, porque la fila 0010 del roadmap no lo pide. **Conflicto entre fuentes, decide tú:** `PRODUCT.md` define la Reserva «a nombre de quien la pide» y habla de «los equipos de una oficina», y la fila 0011 de «reservas de otras personas»; la misión dice «No hay más usuarios»; y el código de hoy no guarda el titular de la reserva. Si quieres «quién», hay que añadir el titular a la reserva (más alcance, y encaja mejor con la 0011).
3. Cancelar sin `--motivo` (o con `--motivo` sin valor) deja de cancelar: MODIFIED del comportamiento de v0.3.0. El test `cancelar una reserva activa` de `test/cancel.test.js` pasa a llevar motivo.
4. Approach: una sola manera sensata — el motivo se guarda en la propia reserva al pasar al estado cancelada (identificador `cancelled` en el código), y `canceladas` filtra por ese estado. Una tabla aparte no aporta nada con las reservas en memoria. `--motivo` se lee a mano en `src/app.js`, sin librería (tech-stack: sin dependencias).
5. El motivo se compara exacto: mayúsculas, acentos y espacios cuentan («Sala ocupada» no vale).
6. Orden de comprobación al cancelar: falta el motivo → motivo no válido → reserva inexistente. El motivo se valida antes de buscar la reserva.
7. Cancelar una reserva ya cancelada responde como hoy con una inexistente («sin reserva Norte lun») y el motivo original se mantiene: `cancelar` solo encuentra reservas activas.
8. `canceladas` es un comando nuevo sin argumentos: una línea por cancelada, en el orden en que se cancelaron, sin cabecera; sin canceladas responde «sin canceladas».
9. `cancelar` sigue identificando la reserva por sala y día, como hoy; distinguir franjas al cancelar no entra (es el terreno del patch 0007).
10. Cada test parte de un estado limpio de reservas: `src/app.js` exporta una función que reinicia las reservas, con las iniciales o con las que le pasa el test (la de Sur del martes: `reservar` hoy no guarda nada), para que el orden de `node --test` no cambie el resultado. Es solo para los tests: no es un comando.
11. `--motivo` toma el argumento siguiente entero (`--motivo "sala ocupada"`); sin comillas, `--motivo sala ocupada` lee «sala» y responde «motivo no válido: …». Los argumentos de más se ignoran, como hoy.

### Hallazgos de la review

- **Aceptado** — (dominio, Crítico) la premisa «la reserva no guarda a nombre de quién está» contradice `PRODUCT.md` → decisión 2 reescrita: se justifica por la fila 0010 y el conflicto queda declarado para ti.
- **Aceptado** — (dominio, Crítico) `bookings` usa el término que `PRODUCT.md` manda evitar y va contra la constitución (punto 4) → capacidad renombrada a `reservas`.
- **Aceptado** — (técnica, Crítico) el GIVEN no dice de dónde sale la reserva ni el formato del día → los GIVEN citan la reserva inicial que trae `src/app.js` (Norte, `lun`, 10:00-12:00).
- **Aceptado** — (dominio y técnica) el MODIFIED no decía «antes → ahora» → añadido al requisito.
- **Aceptado** — (dominio) choque misión / `PRODUCT.md` resuelto en silencio → declarado en la decisión 2.
- **Aceptado** — (dominio) la franja falta en el listado → `canceladas` la enseña; al cancelar no entra (decisión 9).
- **Aceptado** — (dominio y técnica) cancelar una reserva cancelada o inexistente → decisión 7 y su escenario.
- **Aceptado** — (dominio) faltan las cinco reglas → sección «Reglas de la capacidad».
- **Aceptado** — (técnica) un escenario juntaba tres casos y «sigue activa» no se veía → separados, y se comprueba con `canceladas`.
- **Aceptado** — (técnica) faltaban listado vacío, varias canceladas y activa que no sale → escenarios añadidos.
- **Aceptado** — (técnica) cancelaciones anteriores sin motivo → «no aplica»: las reservas viven en memoria y no hay datos previos (Reglas).
- **Aceptado** — (técnica) decisiones sin escribir (comparación, orden, formato, comando nuevo) → decisiones 5, 6 y 8.
- **Aceptado** — (técnica) parseo de `--motivo` sin decir → decisión 4.
- **Aceptado** — (técnica) `capabilities/bookings.md` en los ficheros tocados → lo crea `sdd-archive`; fuera del tamaño.
- **Aceptado** — (técnica) estado compartido entre tests → decisión 10.
- **Aceptado** — (dominio) `cancelled` en inglés → «cancelada» en la spec, `cancelled` marcado como identificador.
- **Aceptado** — (dominio) «No entra: la regla de las 24 h» ambiguo → reescrito: el código no la aplica hoy y esta feature no la añade.
- **Rechazado** — (dominio) «sala ocupada» sería motivo de Anulación, no de Cancelación → la lista la decidió el dev-lead en la entrevista; queda como punto a validar en la decisión 1.
- **Aceptado** — (ronda 2, Crítico) la lista de motivos choca con el glosario y estaba solo como «Rechazado» → la decisión 1 la marca para que la valides.
- **Aceptado** — (ronda 2, Crítico) el comportamiento del listado estaba repetido en el MODIFIED → los AND del MODIFIED solo dicen que la reserva sigue activa; el listado vive en el ADDED.
- **Aceptado** — (ronda 2) la función de reinicio de reservas no estaba en el Scope → añadida al Scope y a la decisión 10; tamaño ~50 líneas.
- **Aceptado** — (ronda 2) el orden de comprobación (decisión 6) no tenía escenario → escenario de `cancelar Sur mar` sin motivo.
- **Rechazado** — (ronda 2) «sin reserva Norte lun» para una cancelada sería un cambio respecto a v0.3.0 → no lo es: hoy `cancelar` solo busca reservas activas y responde igual (`src/app.js`, `findBooking`).
- **Aceptado** — (ronda 2) `--motivo` sin valor y argumentos de más sin escenario → escenario de `--motivo` sin valor y decisión 11.
- **Aceptado** — (ronda 2) el formato de los avisos no estaba fijado → la regla «Avisos» cita los textos literales.
- **Aceptado** — (ronda 2) `reservas.md` nacía con un MODIFIED sin requisito previo → se crea con la línea base de v0.3.0 (Capacidades).
- **Aceptado** — (ronda 2) el Scope daba por cerrado «quién canceló» → marcado como pendiente de tu decisión 2.
- **Rechazado** — (ronda 2) los hallazgos de la review son historia del proceso → el kit pide esta subsección en las decisiones para que la puerta los vea; sí quito la decisión sobre «sin review».

## Intent

Hoy cancelar no deja rastro: nadie sabe por qué se liberó una sala. Se quiere el motivo de cada cancelación. Éxito: cada cancelación tiene un motivo de la lista y `canceladas` los enseña todos.

## Scope

- Entra: `cancelar <sala> <día> --motivo <motivo>`; comando `canceladas`; la función de `src/app.js` que reinicia las reservas para los tests (decisión 10).
- No entra: anulaciones del responsable de sala (0011); quién canceló (pendiente de tu decisión 2); distinguir franjas al cancelar; la regla de las 24 h de `PRODUCT.md` (el código no la aplica hoy y esta feature no la añade).

## Approach

El motivo se guarda con la reserva cancelada; `canceladas` lista las reservas con estado cancelada.

## Reglas de la capacidad

- Dónde vive el dato: el motivo, en la propia reserva, en memoria (como el resto de reservas); no hay datos previos que migrar.
- Idioma de los nombres: castellano en comandos, motivos y mensajes (constitución, punto 4); `cancelled` es identificador de código.
- Límites: solo los tres motivos de la lista, comparados exactos.
- Avisos: «falta el motivo: cambio de planes, sala ocupada, otro» y «motivo no válido: cambio de planes, sala ocupada, otro», literales, sin comillas, separados por coma y espacio.
- Regla ante conflicto: no aplica — una reserva cancelada ya no se cancela de nuevo (decisión 7).

## Dónde se prueba

- Motivo: por el comando `cancelar`, en `test/cancel.test.js`.
- Listado: por la salida del comando `canceladas`, en `test/cancel.test.js`.
- Cada test parte de las reservas iniciales (decisión 10).

## Delta de comportamiento

### Capacidad: `reservas`

**MODIFIED — Cancelar pide un motivo de la lista**
Antes (v0.3.0): `cancelar Norte lun` cancelaba y respondía «cancelada Norte lun». Ahora: pide `--motivo` de la lista.

- GIVEN la reserva inicial de Norte del lunes, 10:00-12:00
- WHEN `cancelar Norte lun --motivo "sala ocupada"`
- THEN responde «cancelada Norte lun (sala ocupada)»

- GIVEN la reserva inicial de Norte del lunes, 10:00-12:00
- WHEN `cancelar Norte lun`
- THEN responde «falta el motivo: cambio de planes, sala ocupada, otro»
- AND la reserva sigue activa: `cancelar Norte lun --motivo otro` la cancela después

- GIVEN la reserva inicial de Norte del lunes, 10:00-12:00
- WHEN `cancelar Norte lun --motivo` (sin valor)
- THEN responde «falta el motivo: cambio de planes, sala ocupada, otro»

- GIVEN la reserva inicial de Norte del lunes, 10:00-12:00
- WHEN `cancelar Norte lun --motivo "Sala ocupada"`
- THEN responde «motivo no válido: cambio de planes, sala ocupada, otro»
- AND la reserva sigue activa: `cancelar Norte lun --motivo otro` la cancela después

- GIVEN ninguna reserva de Sur el martes
- WHEN `cancelar Sur mar` (sin motivo)
- THEN responde «falta el motivo: cambio de planes, sala ocupada, otro» — el motivo se comprueba antes que la reserva

- GIVEN la reserva de Norte del lunes cancelada con «sala ocupada»
- WHEN `cancelar Norte lun --motivo otro`
- THEN responde «sin reserva Norte lun», como en v0.3.0
- AND su motivo sigue siendo «sala ocupada»

**ADDED — El listado de canceladas enseña el motivo**
- GIVEN la reserva de Norte del lunes, 10:00-12:00, cancelada con «sala ocupada»
- WHEN `canceladas`
- THEN responde «Norte lun 10:00-12:00 — sala ocupada»

- GIVEN las reservas iniciales, sin cancelar ninguna
- WHEN `canceladas`
- THEN responde «sin canceladas»

- GIVEN una reserva de Sur del martes, 09:00-10:00, además de la inicial; se cancela Sur mar con «otro» y después Norte lun con «cambio de planes»
- WHEN `canceladas`
- THEN responde dos líneas, en este orden: «Sur mar 09:00-10:00 — otro» y «Norte lun 10:00-12:00 — cambio de planes»

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
