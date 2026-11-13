---
id: 20261111-090422-feature-0010-motivo-cancelar
feature: 0010
title: Motivo al cancelar una reserva
mode: full
status: approved
created: 2026-11-11
author: Fixture
approvers:
  - name: Fixture
    approved_at: 2026-11-11
---

# Spec — Motivo al cancelar una reserva

🦆 Hoy `cancelar Norte lun` cancela sin preguntar por qué. Después, hay que decir un motivo de una lista (`cambio-de-planes`, `sala-ocupada` u `otro`): `cancelar Norte lun sala-ocupada` responde `cancelada Norte lun (sala ocupada)`, y el nuevo comando `canceladas` lista `Norte lun · sala ocupada`. Sin motivo, o con uno que no está en la lista, no se cancela nada. Por dentro, la reserva guarda el motivo en un campo y `canceladas` filtra por estado.

Validación: dev-lead — lo usa una persona: texto de respuesta y listado nuevos. El listado no se ve desde la terminal (memoria, decisión 11): el dev-lead lo valida con el one-liner de node que le dé la validación.

## Capacidades

- Nuevas: `booking-cancellation` — cancelar una reserva con motivo y listar las canceladas.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`booking-cancellation`), contrato público (cambia la firma de `cancelar` y añade `canceladas`) · tamaño: ~35 líneas en 2 ficheros
- Dominio (sonnet): si la lista cerrada y el rechazo sin motivo cubren «se elige un motivo de una lista» sin dejar cancelar sin elegir, y si `canceladas` no mezcla las anuladas de 0011 (señal: capacidad nueva)
- Técnica (sonnet): si el orden «motivo antes que reserva» y el cambio de los dos tests existentes de `cancelar` quedan sin huecos (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin mirar si la lista de motivos y el texto del listado son lo que el negocio espera

### Hallazgos de la review

- **Aceptado** — dominio 1 y 2: «sin reserva» es base, no un ADDED engañoso → la decisión 1 lo dice; «sin motivo cancelaba» queda en la tabla de retirados, no hay capacidad previa que modificar.
- **Aceptado** — dominio 3 y 4: «propia» sin condición → quitado de la capacidad; reserva ya cancelada o anulada → decisión 13 y AND del escenario.
- **Rechazado** — dominio 5: sin comando `reservar` real no se puede reservar dos veces → decisión 13, conflicto «no aplica».
- **Aceptado** — dominio 6 y 7: idioma y límites → «Reglas de la capacidad» y decisión 12.
- **Aceptado** — dominio 8: limitación de la terminal → decisión 11 y línea de Validación.
- **Rechazado** — dominio 9: `anular` ya existe en `src/app.js` (`voidBooking`); el escenario se siembra con una reserva `voided`.
- **Aceptado** — técnica 1: un motivo por reserva y `canceladas` comprueba que persiste → escenario y «Dónde se prueba».
- **Aceptado** — técnica 2, 3 y 4: reservas sembradas, orden y anulada en el GIVEN → decisión 14 (`bookings` exportado) y escenario del listado con cuatro reservas.
- **Aceptado** — técnica 5: validación humana del listado → línea de Validación.
- **Aceptado** — técnica 6: el orden «motivo antes que reserva» → AND con `cancelar Sur mar`, test propio en el plan.
- **Aceptado** — técnica 7: `constructor` pasaría la validación → decisión 12 y AND.
- **Aceptado** — técnica 8 y 9: líneas que caducan y firma de `cancelBooking` → tabla por nombre de función y decisión 14.
- Sin Críticos: no hay segunda ronda.

1. Capacidad nueva `booking-cancellation` (slug inglés kebab-case): el proyecto no tiene ninguna y esta feature crea el primer requisito de cancelación; por eso todo va en `ADDED`. «Cancelar sin reserva activa» solo recoge el comportamiento de hoy como base, sin capacidad previa que modificar.
2. El motivo es **obligatorio**, tercer argumento de `cancelar`: `cancelar <sala> <día> <motivo>`. La fila dice «se elige un motivo»; uno opcional dejaría cancelar sin elegir.
3. Lista cerrada, con estos valores literales: `cambio-de-planes`, `sala-ocupada`, `otro` (con guiones, para ir en un solo argumento de terminal); al mostrarlos se escriben con espacios: «cambio de planes», «sala ocupada», «otro».
4. Respuesta de `cancelar`: `cancelada <sala> <día> (<motivo con espacios>)`, p. ej. `cancelada Norte lun (cambio de planes)`.
5. Motivo ausente o fuera de la lista: `motivo no válido: elige cambio-de-planes, sala-ocupada u otro`, y no se cancela nada. Esta comprobación va **antes** que la de reserva existente: `cancelar Sur mar` (sin reserva y sin motivo) responde el aviso de motivo, no `sin reserva`.
6. Con motivo válido y sin reserva activa: `sin reserva <sala> <día>` (el texto de hoy), sin tocar nada.
7. «El listado de canceladas» no existe hoy: lo creo como comando `canceladas`, una línea por reserva cancelada, `<sala> <día> · <motivo con espacios>`, en el orden de la lista de reservas; sin ninguna, `sin canceladas`.
8. `canceladas` solo lista las que están en estado `cancelled`: las anuladas por el responsable (`anular`, fila 0011) no entran.
9. Los dos tests existentes de `cancelar` (`test/cancel.test.js`) se reescriben con motivo; los textos de hoy `cancelada Norte lun` y `sin reserva Sur mar` pasan a ser los de las decisiones 4 y 6.
10. Enfoque: A (campo `reason` en la reserva y `canceladas` filtra por estado) frente a B (un array aparte de cancelaciones) y C (motivo opcional con `otro` por defecto); ver Approach.
11. Las reservas viven en memoria y cada ejecución del CLI arranca de cero: `canceladas` desde terminal solo ve lo cancelado en esa misma ejecución, y se verifica por `run()`. La persistencia queda fuera (no entra).
12. Validación del motivo: sensible a mayúsculas (`Otro` no vale) y solo cuenta el tercer argumento (`cancelar Norte lun sala ocupada` se rechaza por `sala`; los que sobren se ignoran). Se comprueba con `Object.hasOwn`, para que `constructor` o `toString` no pasen.
13. Una reserva ya cancelada o anulada no es activa: `cancelar` sobre ella con motivo válido responde `sin reserva <sala> <día>`. Dos reservas de la misma sala y día no se pueden crear hoy (no hay comando `reservar` real): regla ante conflicto, no aplica.
14. Para sembrar reservas en los tests, `src/app.js` exporta `bookings`, y `cancelBooking` pasa a `cancelBooking(room, day, reason)`; `git grep cancelBooking` solo da `src/app.js`.
- Repaso de coherencia: delta probado en una copia de `.docs/sdd` con `sdd capability merge` → 4 requisitos añadidos en `booking-cancellation.md`, sin rechazos; `git grep 0010` solo da la fila del roadmap.
- Política de modelos: revisores de la spec en sonnet (dominio y técnica) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

- Spec aprobada por delegación — «Apruebo la spec por delegación; cuando tengas el commit de la Task 1, para.» (2026-11-11)
- Parada tras el commit de la Task 1 — «cuando tengas el commit de la Task 1, para»
- Motivos de la lista — «cambio de planes, sala ocupada, otro»

## Intent

Hoy `cancelar` cancela sin dejar rastro de por qué, y no hay forma de ver qué se canceló. Con esta feature, cancelar exige un motivo de una lista cerrada y el listado de canceladas lo enseña. Éxito: ninguna reserva pasa a cancelada sin uno de los tres motivos, y `canceladas` los muestra tal cual se eligieron (dentro de una ejecución, decisión 11). Fracaso aunque «funcione»: que se pueda cancelar sin motivo, o que `canceladas` incluya reservas anuladas.

## Scope

- Entra: `cancelar` con motivo obligatorio de la lista; comando `canceladas`; exportar `bookings`; reescribir los dos tests existentes de `cancelar`.
- No entra: persistencia de las reservas; motivo libre; cambiar `anular` (0011); la regla de «antes de 24 h» de PRODUCT.md (no se aplica hoy).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Respuesta `cancelada <sala> <día>` (sin motivo) | `cancelBooking` en `src/app.js`, primer test de `test/cancel.test.js` | decisión 4; test reescrito (decisión 9) |
| `cancelar <sala> <día>` sin motivo ya cancelaba | rama `cancelar` de `run` en `src/app.js`, los dos tests de `test/cancel.test.js` | decisiones 2 y 5; tests reescritos |
| `cancelBooking(room, day)` | `src/app.js` (único uso) | decisión 14 |

- Filas que implementa: 0010 → la fila 0010 de `roadmap.md` (la define; pasa a ✅ al cerrar) · ningún otro fichero la nombra: comprobado con `git grep -n 0010`.

## Approach

- A: campo `reason` en la reserva; `canceladas` filtra `status === 'cancelled'` — un campo y un filtro; reutiliza el estado que ya existe.
- B: array `cancellations` aparte — duplica la reserva y obliga a mantener dos listas.
- C: motivo opcional con `otro` por defecto — deja cancelar sin elegir, contra la fila.
- Elegido: A — es lo mínimo y no duplica datos.

Constante `reasons = { 'cambio-de-planes': 'cambio de planes', 'sala-ocupada': 'sala ocupada', otro: 'otro' }` en `src/app.js`: clave que se teclea → texto que se muestra.

## Dónde se prueba

- Cancelar con motivo (un test por motivo, cada uno con su reserva sembrada en `bookings`), motivo no válido, `constructor` como motivo, sin reserva, ya cancelada y `canceladas`: por `run()`, como los tests de `test/cancel.test.js` actuales; sin pantalla.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-cancellation`

#### ADDED — Cancelar una reserva con motivo

- GIVEN reserva activa en Norte el lun
- WHEN `cancelar Norte lun cambio-de-planes`
- THEN responde `cancelada Norte lun (cambio de planes)` y la reserva queda cancelada con ese motivo
- AND con `sala-ocupada` responde `cancelada Norte lun (sala ocupada)`, y con `otro`, `cancelada Norte lun (otro)` (cada uno sobre su propia reserva activa)
- AND `canceladas` muestra después `Norte lun · cambio de planes`

#### ADDED — La cancelación exige un motivo de la lista

- GIVEN reserva activa en Norte el lun
- WHEN `cancelar Norte lun` (sin motivo) o `cancelar Norte lun aburrimiento` (fuera de la lista)
- THEN responde `motivo no válido: elige cambio-de-planes, sala-ocupada u otro` y la reserva sigue activa
- AND con `cancelar Sur mar` (sin reserva y sin motivo) responde también el aviso de motivo, no `sin reserva`
- AND `Otro` (mayúscula), `constructor` y `cancelar Norte lun sala ocupada` dan el mismo aviso

#### ADDED — Cancelar sin reserva activa

- GIVEN no hay reserva activa en Sur el mar
- WHEN `cancelar Sur mar otro`
- THEN responde `sin reserva Sur mar`
- AND con la reserva de Norte lun ya cancelada, `cancelar Norte lun otro` responde `sin reserva Norte lun`

#### ADDED — Listado de canceladas

- GIVEN reservas en este orden: Norte lun cancelada por `sala-ocupada`, Norte mie activa, Sur mar anulada con `anular`, Sur jue cancelada por `otro`
- WHEN `canceladas`
- THEN responde dos líneas, `Norte lun · sala ocupada` y `Sur jue · otro`
- AND la reserva anulada y la activa no aparecen
- AND sin ninguna cancelada responde `sin canceladas`

#### Reglas de la capacidad — booking-cancellation

- **Dónde viven los datos**: en memoria, campo `reason` de la reserva
- **Idioma de los nombres**: identificadores de código en inglés; motivos tecleados y mensajes en castellano
- **Límites**: tres motivos; sensible a mayúsculas; solo cuenta el tercer argumento
- **Avisos**: `motivo no válido: elige cambio-de-planes, sala-ocupada u otro`; `sin reserva <sala> <día>`; `sin canceladas`
- **Regla ante conflicto**: no aplica

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-11 | aprobada por delegación: «Apruebo la spec por delegación; cuando tengas el commit de la Task 1, para.» |
