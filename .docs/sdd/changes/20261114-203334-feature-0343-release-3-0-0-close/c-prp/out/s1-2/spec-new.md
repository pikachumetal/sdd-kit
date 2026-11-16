---
id: 20261116-110340-feature-0010-cancel-reason
feature: 0010
title: Motivo al cancelar
mode: full
status: draft
created: 2026-11-16
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Motivo al cancelar

🦆 Hoy `cancelar Norte lun` anula la reserva y no queda por qué. Con este cambio hay que decir el motivo (`cancelar Norte lun sala-ocupada`), y un comando nuevo, `canceladas`, enseña cada cancelación con su motivo: `Norte lun 10:00-12:00 · sala ocupada`. Por dentro, la reserva cancelada guarda el motivo y `canceladas` filtra las de estado cancelada.

Validación: dev-lead — es comportamiento que se ve en la terminal.

## Capacidades

- Nuevas: `booking-cancellation` — cancelar una reserva con un motivo de una lista y consultar las canceladas.

## ✋ Decisiones que he tomado yo — valida estas

Sin review de la spec: lo decidió el dev-lead («Sin review»). No se dispara ningún revisor; queda sin cubrir la lectura independiente de la spec.

1. Capacidad nueva `booking-cancellation` (slug en inglés kebab-case): hoy no hay ninguna en `capabilities/` y el comportamiento de cancelar no está recogido en ningún sitio.
2. Los motivos se escriben como clave sin espacios: `cambio-de-planes`, `sala-ocupada`, `otro`. En el listado salen con su texto: `cambio de planes`, `sala ocupada`, `otro`. Una clave sin espacios evita comillas en la terminal.
3. El motivo es el tercer argumento: `cancelar <sala> <día> <motivo>`.
4. El motivo es obligatorio. Sin motivo: `falta el motivo: elige cambio-de-planes, sala-ocupada u otro`, y no se cancela nada. Elegí obligatorio porque la petición dice que «se elige» uno; la alternativa, `otro` por defecto, llenaría el listado de motivos sin información.
5. Motivo no válido: `motivo no válido: elige cambio-de-planes, sala-ocupada u otro`, y no se cancela nada.
6. El motivo se comprueba antes de buscar la reserva: `cancelar Sur mar` sin motivo da el aviso del motivo, no `sin reserva Sur mar`.
7. Respuesta al cancelar con éxito: `cancelada Norte lun · cambio de planes`.
8. El listado es un comando nuevo, `canceladas`, sin argumentos. Hoy no existe ningún listado de canceladas: lo creo.
9. Formato del listado: una línea por cancelación, `<sala> <día> <franja> · <motivo>`, en orden de reserva. Sin canceladas: `sin canceladas`.
10. El listado solo enseña cancelaciones, no anulaciones: PRODUCT.md las distingue (cancela el cliente, anula el responsable) y `anular` no pide motivo.
11. Los motivos viven en memoria con la reserva, como el resto de datos del proyecto.
12. Enfoque: A, frente a B y C (ver Approach).
- Política de modelos: sin revisores de la spec · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte
- Delta probado en una copia con `sdd capability merge`: fusión limpia, `booking-cancellation.md` con 6 requisitos añadidos y las 5 reglas (rc 0); el `capabilities/` del repo no cambia.

### Decisiones tomadas con el dev-lead

- Al cancelar se elige un motivo de una lista cerrada: cambio de planes, sala ocupada, otro — «al cancelar una reserva se elige un motivo de una lista (cambio de planes, sala ocupada, otro)»
- El listado de canceladas enseña el motivo — «el listado de canceladas lo enseña»
- Sin review de la spec — «Sin review»

## Intent

Hoy cancelar una reserva no deja rastro de por qué. Quien gestiona las salas no puede ver si se cancela por cambio de planes o porque la sala estaba ocupada. Con el cambio, cada cancelación lleva un motivo de una lista cerrada y se puede consultar. Éxito: toda reserva cancelada aparece en `canceladas` con su motivo. Fracaso, aunque funcione: que se cancele sin motivo, o que se cuelen anulaciones en el listado.

## Scope

- Entra: motivo obligatorio en `cancelar` (tres valores); comando `canceladas`; actualizar los dos tests de `test/cancel.test.js` al nuevo formato.
- No entra: motivos libres; pedir motivo en `anular`; persistencia fuera de memoria; filtros u orden del listado; cambiar el motivo de una reserva ya cancelada.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `cancelar <sala> <día>` sin motivo deja de cancelar | `src/app.js:30`, `test/cancel.test.js:6` y `:10` | Delta, `ADDED` en `booking-cancellation` (no hay capacidad viva que `MODIFIED`); los tests se reescriben en la task correspondiente |
| Respuesta `cancelada <sala> <día>` pasa a `cancelada <sala> <día> · <motivo>` | `src/app.js:17`, `test/cancel.test.js:6` | Delta, `ADDED` |

- Filas que implementa: 0010 → `ROADMAP.md:7` (su propia fila; ningún otro fichero la nombra) | comprobado con `git grep -nE "0010|cancelad|cancelar"`

## Approach

- A. Guardar `reason` en la reserva y añadir `canceladas`, que filtra las de estado cancelada — un campo y una función pura; se prueba por `run`, como los tests de cancelar actuales.
- B. Registro aparte de cancelaciones — duplica el estado y puede desincronizarse de la reserva.
- C. Motivo opcional con `otro` por defecto — menos fricción, pero el listado se llena de `otro` sin información.
- Elegido: A — es la forma mínima, usa el estado que ya existe y mantiene un solo sitio de verdad.

`cancelBooking(room, day, reason)` valida el motivo primero (lista en una constante) y guarda `booking.reason`. `run('canceladas')` recorre `bookings`, filtra las canceladas y las formatea.

## Dónde se prueba

- Cancelar con motivo, sin motivo y con motivo no válido: por `run('cancelar', …)`, como `test/cancel.test.js`.
- Listado `canceladas`: por `run('canceladas', [])`, mismo fichero.
- Anular no entra en el listado: por `run('anular', …)` seguido de `run('canceladas', [])`.

## Términos y ADR

- Términos resueltos: **Cancelación** y **Anulación** siguen como en `PRODUCT.md`; el listado y el motivo son solo de las cancelaciones.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-cancellation`

#### ADDED — Cancelar una reserva con motivo

- GIVEN una reserva activa de Norte el lun
- WHEN se ejecuta `cancelar Norte lun cambio-de-planes`
- THEN responde `cancelada Norte lun · cambio de planes`
- AND la reserva deja de estar activa

#### ADDED — El motivo es obligatorio y de la lista

- GIVEN una reserva activa de Norte el lun
- WHEN se ejecuta `cancelar Norte lun`
- THEN responde `falta el motivo: elige cambio-de-planes, sala-ocupada u otro`
- AND la reserva sigue activa

#### ADDED — Un motivo fuera de la lista no cancela

- GIVEN una reserva activa de Norte el lun
- WHEN se ejecuta `cancelar Norte lun porque-si`
- THEN responde `motivo no válido: elige cambio-de-planes, sala-ocupada u otro`
- AND la reserva sigue activa

#### ADDED — Cancelar sin reserva activa

- GIVEN que no hay reserva activa de Sur el mar
- WHEN se ejecuta `cancelar Sur mar otro`
- THEN responde `sin reserva Sur mar`

#### ADDED — Listado de canceladas

- GIVEN la reserva de Norte lun 10:00-12:00 cancelada con `sala-ocupada`
- WHEN se ejecuta `canceladas`
- THEN responde `Norte lun 10:00-12:00 · sala ocupada`

#### ADDED — Sin canceladas ni anuladas en el listado

- GIVEN que no hay ninguna reserva cancelada, y la de Norte lun anulada con `anular`
- WHEN se ejecuta `canceladas`
- THEN responde `sin canceladas`

#### Reglas de la capacidad — booking-cancellation

- **Dónde viven los datos**: en memoria, en el campo `reason` de la reserva
- **Idioma de los nombres**: claves de motivo en castellano sin espacios (`cambio-de-planes`, `sala-ocupada`, `otro`); mensajes en castellano
- **Límites**: lista cerrada de tres motivos
- **Avisos**: `falta el motivo: elige cambio-de-planes, sala-ocupada u otro` · `motivo no válido: elige cambio-de-planes, sala-ocupada u otro` · `sin canceladas`
- **Regla ante conflicto**: no aplica

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
