---
id: 20261112-155321-feature-0010-cancel-reason
feature: 0010
title: Motivo al cancelar
mode: full
status: draft
created: 2026-11-12
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Motivo al cancelar

🦆 Hoy `cancelar Norte lun` anula la reserva sin más. Con el cambio, quien cancela debe elegir un motivo de una lista cerrada (cambio de planes, sala ocupada, otro): `cancelar Norte lun --motivo sala-ocupada`. Sin motivo, o con uno que no está en la lista, no se cancela y se muestra la lista. Un comando nuevo, `canceladas`, enseña cada reserva cancelada con su motivo: `Norte lun 10:00-12:00 · sala ocupada`. Las anuladas por el responsable no salen ahí.

Validación: dev-lead — lo usa una persona desde la terminal y lo que ve (mensajes, listado) lo decide el dev-lead.

## Capacidades

- Nuevas: `booking-cancellation` — cancelar una reserva con motivo y listar las canceladas

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — decidido por el dev-lead («Sin review»); señales: capacidad nueva · tamaño: ~40 líneas en 2 ficheros
- Mínimo razonable: un revisor técnico — deja sin mirar si la lista de motivos y el comando nuevo chocan con lo que el dev-lead dio por supuesto

1. Enfoque: lista de motivos fija en código, motivo guardado en la propia reserva (ver Approach), frente a un fichero de configuración y a un registro aparte.
2. Claves de la lista: `cambio-de-planes`, `sala-ocupada`, `otro`; se escriben en el comando con `--motivo <clave>`. Los textos que se muestran: «cambio de planes», «sala ocupada», «otro».
3. El motivo es obligatorio: `cancelar` sin `--motivo` no cancela y responde `falta el motivo: elige uno de cambio-de-planes, sala-ocupada, otro`.
4. Motivo fuera de la lista: no cancela y responde `motivo no válido: «<valor>»; elige uno de cambio-de-planes, sala-ocupada, otro`.
5. «otro» no pide texto libre: es solo una opción de la lista.
6. Se valida el motivo antes de buscar la reserva: `cancelar Sur mar` sin motivo da el aviso del motivo, no `sin reserva Sur mar`.
7. El mensaje de éxito no cambia: `cancelada Norte lun`.
8. Comando nuevo `canceladas`, sin argumentos. Una línea por reserva: `<sala> <día> <franja> · <texto del motivo>`, en el orden en que se hicieron las reservas. Sin ninguna: `sin canceladas`.
9. `canceladas` solo lista las canceladas por el cliente, no las anuladas por el responsable (PRODUCT.md distingue Cancelación de Anulación).
10. Capacidad nueva, nombre en inglés: `booking-cancellation`. Hoy no hay capacidades; este delta solo describe lo que añade, no el resto del comportamiento de reservas.
11. Sin `§Frontend`: es una herramienta de terminal, sin pantallas.
12. Delta comprobado sobre una copia de `.docs/sdd` (`sdd capability merge`): 8 requisitos y 5 reglas añadidos a `booking-cancellation`, sin rechazos; `capabilities/` del repo sin tocar.
- Política de modelos: ningún revisor de spec · ejes de la revisión final: Spec opus+high, Código sonnet+high · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents`

### Decisiones tomadas con el dev-lead

- Al cancelar se elige un motivo de una lista: cambio de planes, sala ocupada, otro — «al cancelar una reserva se elige un motivo de una lista (cambio de planes, sala ocupada, otro)»
- El listado de canceladas enseña el motivo — «y el listado de canceladas lo enseña»
- Sin review de la spec — «Sin review»

## Intent

Hoy cancelar no deja rastro del porqué. Se quiere saber, por cada reserva cancelada, por qué se canceló, con una lista cerrada que se pueda contar. Éxito: toda cancelación nueva queda con uno de los tres motivos y `canceladas` los muestra. Fracaso, aunque funcione: que se pueda cancelar sin motivo o con uno inventado, o que las anuladas se mezclen con las canceladas.

## Scope

- Entra: `--motivo` en `cancelar` con la lista cerrada; comando `canceladas`; los tests de `cancelar` que existen se actualizan al motivo obligatorio.
- No entra: texto libre en «otro»; motivo en `anular`; editar el motivo de una reserva ya cancelada; persistencia (las reservas siguen en memoria); cambiar el mensaje de éxito.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `cancelar <sala> <día>` sin motivo deja de cancelar | `src/app.js:13-18` (`cancelBooking`), `src/app.js:30` | Scope, decisión 3 · delta `ADDED` |
| Test «cancelar una reserva activa» sin motivo | `test/cancel.test.js:5-7` | Scope: se actualiza con `--motivo` |
| Test «cancelar sin reserva lo dice» sin motivo | `test/cancel.test.js:9-11` | Scope: se actualiza con `--motivo` (decisión 6) |

- Filas que implementa: 0010 → ningún otro fichero la nombra | comprobado con `git grep -n -i "cancel"` fuera de `.docs/sdd/specs`: salen `CHANGELOG.md` (entradas pasadas; se escribe al cortar la release), `PRODUCT.md` (término, no cambia), `ROADMAP.md`, `src/app.js` y `test/cancel.test.js`

## Approach

- A. Lista fija en código y el motivo guardado en la reserva (`reason`) — una constante y un campo; `canceladas` filtra las reservas con estado cancelado. Cuesta poco y sigue el modelo actual (reservas en memoria).
- B. Lista de motivos en un fichero de configuración — permite cambiarla sin tocar código, pero el proyecto no tiene configuración ni la necesita para tres valores.
- C. Registro aparte de cancelaciones (`{reserva, motivo}`) — separa datos, pero duplica el estado que ya vive en la reserva.
- Elegido: A — es lo mínimo que cumple lo decidido y lo que ya hace el código para el estado `cancelled`.

`cancelBooking(room, day, reason)` valida `reason` contra la lista antes de buscar la reserva; si es válido y hay reserva activa, la marca `cancelled` y guarda `reason`. `run` lee `--motivo <clave>` de los parámetros. `canceladas` devuelve las reservas con estado `cancelled`.

## Dónde se prueba

- Cancelar con motivo, sin motivo, con motivo inválido y sin reserva: por `run('cancelar', …)`, como `test/cancel.test.js`.
- Listado `canceladas`: por `run('canceladas', [])`, en el mismo fichero de tests.
- Anulada no aparece en `canceladas`: por `run('anular', …)` y luego `run('canceladas', [])`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-cancellation`

#### ADDED — Cancelar exige un motivo de la lista

- GIVEN reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun --motivo sala-ocupada`
- THEN responde `cancelada Norte lun` y la reserva queda cancelada con el motivo «sala ocupada»

#### ADDED — Sin motivo no se cancela

- GIVEN reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun` sin `--motivo`
- THEN responde `falta el motivo: elige uno de cambio-de-planes, sala-ocupada, otro` y la reserva sigue activa

#### ADDED — Un motivo fuera de la lista no se acepta

- GIVEN reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun --motivo aburrimiento`
- THEN responde `motivo no válido: «aburrimiento»; elige uno de cambio-de-planes, sala-ocupada, otro` y la reserva sigue activa

#### ADDED — El motivo se valida antes de buscar la reserva

- GIVEN no hay reserva de Sur mar
- WHEN `cancelar Sur mar` sin `--motivo`
- THEN responde `falta el motivo: elige uno de cambio-de-planes, sala-ocupada, otro`

#### ADDED — Cancelar una reserva que no existe

- GIVEN no hay reserva de Sur mar
- WHEN `cancelar Sur mar --motivo otro`
- THEN responde `sin reserva Sur mar`

#### ADDED — El listado de canceladas enseña el motivo

- GIVEN Norte lun 10:00-12:00 cancelada con `cambio-de-planes` y Sur mar 09:00-10:00 cancelada con `otro`
- WHEN `canceladas`
- THEN responde dos líneas: `Norte lun 10:00-12:00 · cambio de planes` y `Sur mar 09:00-10:00 · otro`

#### ADDED — Sin canceladas

- GIVEN ninguna reserva cancelada
- WHEN `canceladas`
- THEN responde `sin canceladas`

#### ADDED — Las anuladas no salen en el listado de canceladas

- GIVEN Norte lun 10:00-12:00 anulada por el responsable con `anular Norte lun`
- WHEN `canceladas`
- THEN la respuesta no incluye Norte lun

#### Reglas de la capacidad — booking-cancellation

- **Dónde viven los datos**: el motivo se guarda en la reserva, en memoria como el resto
- **Idioma de los nombres**: castellano en textos; claves de los motivos en castellano con guiones
- **Límites**: lista cerrada de tres motivos
- **Avisos**: `falta el motivo: elige uno de cambio-de-planes, sala-ocupada, otro` · `motivo no válido: «<valor>»; elige uno de cambio-de-planes, sala-ocupada, otro`
- **Regla ante conflicto**: no aplica

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
