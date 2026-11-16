---
id: 20261112-161102-feature-0010-motivo-cancelar
feature: 0010
title: Motivo al cancelar una reserva
mode: full
profile: delegate
status: approved
created: 2026-11-12
author: Fixture
approvers:
  - name: Fixture
    approved_at: 2026-11-12
---

# Spec — Motivo al cancelar una reserva

🦆 Hoy `cancelar Norte lun` anula la reserva sin más. Con el cambio hay que decir por qué, eligiendo de una lista: `cancelar Norte lun sala-ocupada` responde `cancelada Norte lun (sala ocupada)`, y si el motivo falta o no está en la lista no se cancela nada. Un comando nuevo, `canceladas`, enseña las canceladas con su motivo: `Norte lun 10:00-12:00 · sala ocupada`. Por dentro, la reserva guarda un campo `reason` y `canceladas` filtra por estado.

Validación: dev-lead — es una orden de terminal que usa una persona; lo que responde se ve en la terminal.

## Capacidades

- Nuevas: `booking-cancellation` — cancelar una reserva con motivo de una lista y listar las canceladas.
- Modificadas: ninguna: el proyecto aún no tiene `capabilities/` y el comportamiento previo de `cancelar` no está especificado, por eso todo el delta es ADDED.
- Retiradas: ninguna.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor con los siete puntos — señales: capacidad nueva · tamaño: ~40 líneas en 1 fichero de código y 2 de test
- Revisor único (sonnet): si los THEN de «Cancelar exige un motivo de la lista» y de «Listar las canceladas» fijan todos los textos y no dejan ningún valor al ojo, y si el orden «motivo antes que reserva» y el filtro por estado `cancelled` casan con `src/app.js` tal como está (señal: capacidad nueva)
- Mínimo razonable: un solo revisor, que es lo que se despacha: el alcance es pequeño y la terminal solo la usa el dev-lead, sin contrato con terceros; la lente de dominio y la técnica van juntas, sin segunda lectura independiente

1. Enfoque: campo `reason` en la propia reserva y `canceladas` filtrando por estado, frente a una lista de cancelaciones aparte y a un motivo opcional (ver Approach).
2. Los valores de la lista, en la orden y sin espacios: `cambio-de-planes`, `sala-ocupada`, `otro`. En respuestas y listado salen con espacios: «cambio de planes», «sala ocupada», «otro». El dev-lead dio los tres nombres; los identificadores son míos.
3. El motivo es obligatorio y va como tercer argumento posicional: `cancelar <sala> <día> <motivo>`. La comparación es exacta (distingue mayúsculas; `sala ocupada` con espacio no vale) y los argumentos de más se ignoran. Sin motivo o con uno que no está en la lista, la respuesta es `motivo no válido: elige cambio-de-planes, sala-ocupada u otro` y la reserva sigue activa.
4. El motivo se valida antes de buscar la reserva: `cancelar Sur mar` responde `motivo no válido…`, no `sin reserva Sur mar`.
5. Respuesta de éxito: `cancelada Norte lun (cambio de planes)`: el texto de hoy más el motivo entre paréntesis.
6. Comando nuevo `canceladas`, sin argumentos; una línea por reserva cancelada: `<sala> <día> <franja> · <motivo>`, en el orden de la lista de reservas. Sin ninguna: `sin canceladas`.
7. `canceladas` no lista las anuladas (`anular`): son otro concepto en PRODUCT.md y no llevan motivo.
8. `otro` no pide texto libre: el motivo es solo uno de los tres valores.
9. La carpeta de la feature va en `.docs/sdd/changes/` (regla del kit), aunque las anteriores del proyecto están en `.docs/sdd/specs/`.
10. Sin `§Frontend`: es una CLI, sin pantalla.
11. Sin migración: las reservas viven en memoria; no hay canceladas anteriores sin motivo.
12. Capacidad nueva `booking-cancellation` (inglés, kebab-case). Delta probado en una copia de `.docs/sdd`: `sdd capability merge` añade los 8 requisitos (una línea «añadido» por cada uno) y sale con 0.
- Política de modelos: un revisor de spec en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo

### Hallazgos de la review

- **Rechazado** (Crítico) — términos de PRODUCT.md («Cancelación» = la del cliente antes de 24 h) → `cancelar` sigue siendo la orden del cliente y no se redefine ningún término; la regla de 24 h ya está fuera en «No entra», y el código no la aplica hoy.
- **Aceptado** — un escenario con dos entradas → separado en dos, con AND observable por `canceladas`.
- **Aceptado** — «queda cancelada con ese motivo» no observable → AND por `canceladas`.
- **Aceptado en parte** — orden y filtro del listado → solo existe una reserva en memoria, así que no se puede probar un orden entre varias: se retira la promesa de orden por cancelación («orden de la lista de reservas») y el filtro se prueba con la reserva activa (`sin canceladas`).
- **Aceptado** — cancelar una ya cancelada → escenario nuevo: `sin reserva Norte lun` (hoy `findBooking` solo busca activas).
- **Aceptado** — `cancelar` previo no especificado → dicho en Capacidades.
- **Aceptado** — mayúsculas, espacios y argumentos de más → decisión 3.
- **Rechazado** — carpeta `changes/` fuera de la lista de decisiones → se queda: el dev-lead la ve en `git status` y es una desviación respecto a las carpetas anteriores.
- **Aceptado** — evidencia del merge → decisión 12.
- **Aceptado en parte** — anuladas → el GIVEN fija el estado (`anular` deja `voided`); no hay segunda reserva para probar cancelada y anulada a la vez.

### Decisiones tomadas con el dev-lead

- Aprobación de la spec delegada — «Apruebo la spec por delegación»
- Cambio pedido: motivo al cancelar elegido de una lista — «Añade un motivo al cancelar una reserva, de una lista: cambio de planes, sala ocupada, otro»
- Parada tras el commit de la Task 1 — «cuando tengas el commit de la Task 1, para»

## Intent

Hoy cancelar no deja rastro de por qué. Se quiere que cada cancelación lleve uno de tres motivos, que se pueda ver después y que no se pueda cancelar sin elegirlo. Éxito: tras `cancelar Norte lun otro`, `canceladas` imprime `Norte lun 10:00-12:00 · otro`. Fracaso aunque «funcione»: que una cancelación quede hecha con un motivo inventado o vacío.

## Scope

- Entra: `cancelar` con motivo obligatorio de la lista; el comando `canceladas`; los tests de ambos.
- Entra: actualizar `test/cancel.test.js` (la orden sin motivo ya no se acepta).
- No entra: motivo en `anular`; texto libre en `otro`; filtrar o ordenar `canceladas`; la regla de las 24 h de PRODUCT.md (el código no la aplica hoy ni se toca).
- Ficheros: `src/app.js` y los tests. `README.md` y `CHANGELOG.md` no cambian: el changelog lo escribe el corte de `sdd-end-release`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `cancelar <sala> <día>` sin motivo deja de aceptarse | `src/app.js:30` (`cancelBooking(params[0], params[1])`) · `test/cancel.test.js:5-7` | Scope y decisión 3; el test se actualiza en la Task 1 |
| Respuesta `cancelada <sala> <día>` pasa a llevar el motivo | `src/app.js:17` · `test/cancel.test.js:6` | decisión 5; el test se actualiza en la Task 1 |
| «Cancelar una reserva propia» (changelog histórico) | `CHANGELOG.md:20` | no cambia: es historia de una versión ya cortada |

- Filas que implementa: 0010 → `ROADMAP.md:7` (el cierre la pasa a ✅) · nada más la nombra: comprobado con `git grep -nE "0010|motivo"`.

## Approach

- A. Campo `reason` en la reserva; `canceladas` filtra las de estado `cancelled` — un campo y un comando; reutiliza el estado que ya existe.
- B. Una lista de cancelaciones aparte, con su motivo — duplica el estado de la reserva y obliga a mantener dos fuentes de verdad.
- C. Motivo opcional con valor por defecto — mantiene compatible la orden de hoy, pero contradice «se elige un motivo» y deja canceladas sin motivo en el listado.
- Elegido: A — es lo mínimo que cumple lo pedido y no duplica estado.

Partes del cómo: `cancelBooking(room, day, reason)` valida `reason` contra la lista `{ 'cambio-de-planes': 'cambio de planes', 'sala-ocupada': 'sala ocupada', 'otro': 'otro' }` antes de llamar a `findBooking`; al cancelar guarda `booking.reason`. `listCancelled()` recorre `bookings`, filtra `status === 'cancelled'` y formatea. `run` enruta `canceladas`.

## Dónde se prueba

- Cancelar con motivo, motivo no válido o ausente, reserva inexistente: por `run('cancelar', …)`, como los tests actuales de `test/cancel.test.js`.
- Listado de canceladas: por `run('canceladas', [])`, en ficheros `test/canceladas*.test.js` (uno por estado de partida: cada fichero es un proceso y parte del estado inicial en memoria, con una sola reserva).

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-cancellation`

#### ADDED — Cancelar exige un motivo de la lista

- GIVEN la reserva activa `Norte lun 10:00-12:00`
- WHEN `cancelar Norte lun sala-ocupada`
- THEN responde `cancelada Norte lun (sala ocupada)`
- AND `canceladas` responde `Norte lun 10:00-12:00 · sala ocupada`

#### ADDED — Un motivo ausente no cancela

- GIVEN la reserva activa `Norte lun 10:00-12:00`
- WHEN `cancelar Norte lun`
- THEN responde `motivo no válido: elige cambio-de-planes, sala-ocupada u otro`
- AND `canceladas` responde `sin canceladas`

#### ADDED — Un motivo fuera de la lista no cancela

- GIVEN la reserva activa `Norte lun 10:00-12:00`
- WHEN `cancelar Norte lun aburrimiento` y WHEN `cancelar Norte lun Otro`
- THEN ambas responden `motivo no válido: elige cambio-de-planes, sala-ocupada u otro`
- AND `canceladas` responde `sin canceladas`

#### ADDED — El motivo se valida antes que la reserva

- GIVEN que no hay reserva `Sur mar`
- WHEN `cancelar Sur mar` y WHEN `cancelar Sur mar otro`
- THEN la primera responde `motivo no válido: elige cambio-de-planes, sala-ocupada u otro`
- AND la segunda responde `sin reserva Sur mar`

#### ADDED — Una reserva ya cancelada no se vuelve a cancelar

- GIVEN `Norte lun 10:00-12:00` cancelada con `cambio-de-planes`
- WHEN `cancelar Norte lun otro`
- THEN responde `sin reserva Norte lun`
- AND `canceladas` sigue respondiendo `Norte lun 10:00-12:00 · cambio de planes`

#### ADDED — Listar las canceladas con su motivo

- GIVEN `Norte lun 10:00-12:00` cancelada con `cambio-de-planes`
- WHEN `canceladas`
- THEN responde `Norte lun 10:00-12:00 · cambio de planes`
- AND una línea por cancelada, en el orden de la lista de reservas

#### ADDED — Sin canceladas lo dice

- GIVEN la reserva `Norte lun 10:00-12:00` activa
- WHEN `canceladas`
- THEN responde `sin canceladas`

#### ADDED — Las anuladas no se listan como canceladas

- GIVEN `Norte lun 10:00-12:00` anulada con `anular Norte lun` (queda en estado `voided`)
- WHEN `canceladas`
- THEN responde `sin canceladas`

## Enmiendas

- ninguna

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-12 | aprobada por delegación: «Apruebo la spec por delegación» |
