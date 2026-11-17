---
id: 20261106-100134-feature-0010-cancel-reason
feature: 0010
title: Motivo al cancelar
mode: full
status: draft
created: 2026-11-06
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Motivo al cancelar

🦆 Hasta ahora `cancelar Norte lun` borra la reserva sin dejar rastro de por qué. Con esto, cancelar pide un motivo de una lista cerrada —`cambio-de-planes`, `sala-ocupada` u `otro`— y un nuevo comando `canceladas` enseña cada reserva cancelada con su motivo: `Norte lun 10:00-12:00 · cambio de planes`. Por dentro, la reserva guarda su motivo al pasar a cancelada y el listado solo recorre las canceladas (las anuladas del responsable de sala quedan fuera).

Validación: dev-lead — lo usa una persona desde la terminal: hay que ver el texto de los avisos y del listado.

## Capacidades

- Nuevas: `booking-cancellation` — cancelar una reserva con motivo y listar las canceladas.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — el dev-lead pidió «Sin review» (señales: capacidad nueva · tamaño: ~40 líneas en 3 ficheros)
- Mínimo razonable: un revisor con los siete puntos — deja sin cubrir lo que un segundo par de ojos vería en el texto de los avisos y en el listado.

1. **Enfoque (decisión central)**: el motivo se da como opción de la línea de comandos, `cancelar <sala> <día> --motivo <clave>`. Descartados: pedirlo por pregunta interactiva (la herramienta es de una sola orden y los tests llaman a `run()`) y un tercer argumento posicional (`cancelar Norte lun sala-ocupada`, que no dice qué es cada cosa).
2. **Claves de la lista**: `cambio-de-planes`, `sala-ocupada`, `otro`, en minúsculas y con guiones para escribirlas sin comillas. En el listado salen con espacios: `cambio de planes`, `sala ocupada`, `otro`.
3. **El motivo es obligatorio**: «se elige un motivo» lo leo como que no se cancela sin elegir. Sin `--motivo`: no cancela y responde `falta el motivo: usa --motivo cambio-de-planes | sala-ocupada | otro`. Con una clave que no está en la lista (`--motivo aburrimiento`): no cancela y responde `motivo no válido: aburrimiento; usa --motivo cambio-de-planes | sala-ocupada | otro`.
4. **El motivo se valida antes de buscar la reserva**: `cancelar Sur mar` sin motivo responde `falta el motivo…`, no `sin reserva Sur mar`.
5. **`otro` no pide texto libre**: es una clave más de la lista.
6. **La respuesta de una cancelación con éxito no cambia**: `cancelada Norte lun`, sin repetir el motivo.
7. **Comando nuevo `canceladas`** (el roadmap dice «el listado de canceladas», pero hoy no existe ningún listado): una línea por reserva cancelada, con el formato `<sala> <día> <franja> · <motivo con espacios>`, por orden de cancelación; sin ninguna responde `sin canceladas`.
8. **El listado solo enseña canceladas**: las reservas `anulada` (comando `anular`, fila 0011) no salen, porque la cancelación es del cliente y la anulación del responsable (PRODUCT.md, Terminology).
9. **Las reservas viven en memoria** (operations.md): un `node src/app.js canceladas` en una orden aparte siempre responderá `sin canceladas`, porque cada orden arranca de cero. El comportamiento se verifica dentro de un mismo proceso (`run()`), como los tests actuales. Persistir las reservas no entra: es otra feature.
10. **Capacidad nueva `booking-cancellation`**: hoy no hay `capabilities/`. Incluyo en ella, además de lo nuevo, la regla ya vigente de cancelar (activa → cancelada; sin reserva lo dice) para que la capacidad quede entera. Sin `MODIFIED`: no hay vivo que modificar.
11. **Los dos tests actuales de `cancelar`** (`test/cancel.test.js`) pasan a llevar `--motivo`, porque sin él ya no cancelan (decisión 3).
12. **Tamaño**: 3 tasks previstas (cancelar con motivo, listado, capacidad y términos): no se propone partir.
- Política de modelos: sin revisores de la spec (dev-lead: «Sin review») · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte
- Delta probado en una copia de `.docs/sdd` fuera del repo con `sdd capability merge`: exit 0, cinco requisitos añadidos a `booking-cancellation.md` (capacidad nueva); `capabilities/` del repo sin tocar. Pasada de coherencia: literales de avisos iguales en decisiones 3-4 y en los THEN; `git grep` de `cancel`, `0010`, `motivo`, `canceladas` fuera de `specs/` solo da `src/app.js`, `test/cancel.test.js`, el roadmap y `PRODUCT.md` (sin cambio)

### Decisiones tomadas con el dev-lead

- Al cancelar se elige un motivo de una lista (cambio de planes, sala ocupada, otro) y el listado de canceladas lo enseña — «al cancelar una reserva se elige un motivo de una lista (cambio de planes, sala ocupada, otro) y el listado de canceladas lo enseña»
- Sin review de la spec — «Sin review»

## Intent

Hoy cancelar una reserva (`cancelar Norte lun`) no deja constancia de por qué. Se quiere que quien cancela elija un motivo de una lista corta y que el listado de canceladas lo muestre, para ver de un vistazo por qué se liberan las salas. Éxito: cada reserva cancelada sale en el listado con su motivo, y no hay forma de cancelar sin uno. Sería un fallo que una cancelación sin motivo pasase en silencio, o que el listado enseñase reservas que no son canceladas.

## Scope

- Entra: `cancelar` con `--motivo` obligatorio y validado contra la lista; comando `canceladas`; guardar el motivo en la reserva; actualizar los dos tests de `cancelar`; capacidad `booking-cancellation`.
- No entra: persistir las reservas entre órdenes; texto libre en `otro`; motivo al anular (fila 0011); la regla de las 24 h de PRODUCT.md; editar el motivo de una cancelación ya hecha; filtrar o ordenar el listado.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `cancelar <sala> <día>` sin motivo deja de cancelar | `src/app.js:13-18` y `:30`; `test/cancel.test.js:5-6` y `:9-10` | Delta (`ADDED` de la capacidad nueva), decisiones 3, 4 y 11; los tests pasan a llevar `--motivo` |

- Filas que implementa: 0010 → `.docs/sdd/roadmap.md:7` (pasa a hecha en el cierre) | sin otro fichero que la nombre: comprobado con `git grep -n 0010`

## Approach

Decisión 1: `--motivo <clave>` en `cancelar`. `cancelBooking` valida la clave contra una lista fija de tres, y al cancelar guarda el motivo en la reserva; `canceladas` filtra las reservas con estado cancelada y las escribe en el orden en que se cancelaron.

## Dónde se prueba

- Cancelar con motivo, sin motivo, con motivo no válido y sin reserva: por `run('cancelar', …)`, como los tests actuales de `test/cancel.test.js`.
- Listado de canceladas (vacío, con una, y sin anuladas): por `run('canceladas', [])` en el mismo proceso, tras cancelar con `run('cancelar', …)`; en `test/cancel.test.js`.

## Términos y ADR

- Términos resueltos: motivo — la razón elegida de la lista cerrada al cancelar; canceladas — reservas en estado cancelada, no las anuladas.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-cancellation`

#### ADDED — Cancelar una reserva con motivo

- GIVEN una reserva activa en Norte el lunes
- WHEN se ejecuta `cancelar Norte lun --motivo sala-ocupada`
- THEN responde `cancelada Norte lun` y la reserva pasa a cancelada con el motivo `sala-ocupada`

#### ADDED — El motivo es obligatorio y de la lista

- GIVEN una reserva activa en Norte el lunes
- WHEN se ejecuta `cancelar Norte lun` sin `--motivo`
- THEN responde `falta el motivo: usa --motivo cambio-de-planes | sala-ocupada | otro` y la reserva sigue activa
- AND con `cancelar Norte lun --motivo aburrimiento` responde `motivo no válido: aburrimiento; usa --motivo cambio-de-planes | sala-ocupada | otro` y la reserva sigue activa
- AND el motivo se comprueba antes de buscar la reserva: `cancelar Sur mar` sin motivo responde `falta el motivo: usa --motivo cambio-de-planes | sala-ocupada | otro`

#### ADDED — Cancelar sin reserva lo dice

- GIVEN no hay reserva activa en Sur el martes
- WHEN se ejecuta `cancelar Sur mar --motivo otro`
- THEN responde `sin reserva Sur mar`

#### ADDED — El listado de canceladas enseña el motivo

- GIVEN la reserva de Norte, lunes, `10:00-12:00`, cancelada con `cambio-de-planes`
- WHEN se ejecuta `canceladas`
- THEN responde `Norte lun 10:00-12:00 · cambio de planes`
- AND con varias canceladas, una línea por reserva, por orden de cancelación
- AND con las claves `sala-ocupada` y `otro` salen como `sala ocupada` y `otro`

#### ADDED — El listado no enseña lo que no está cancelado

- GIVEN una reserva activa y otra anulada con `anular`, y ninguna cancelada
- WHEN se ejecuta `canceladas`
- THEN responde `sin canceladas`

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
