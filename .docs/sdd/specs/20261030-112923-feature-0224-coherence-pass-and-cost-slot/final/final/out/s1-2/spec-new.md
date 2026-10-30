---
id: 20261030-125832-feature-0010-cancel-reason
feature: 0010
title: Motivo al cancelar
mode: full
status: draft
created: 2026-10-30
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Motivo al cancelar

🦆 Hoy `cancelar Norte lun` cancela y ya. Con esto hay que decir por qué: `cancelar Norte lun sala-ocupada` cancela y guarda el motivo, que solo puede ser `cambio-de-planes`, `sala-ocupada` u `otro`; sin motivo o con uno que no está en la lista, no cancela y te dice cuáles valen. Un comando nuevo, `canceladas`, lista las reservas canceladas con su motivo: `Norte lun 10:00-12:00 — sala-ocupada`. Por dentro, la reserva guarda el motivo al pasar a cancelada.

## Capacidades

- Nuevas: `booking-cancellation` — cancelar una reserva con motivo de una lista y listar las canceladas.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: capacidad nueva (1) · tamaño: ~30 líneas en 2 ficheros (`src/app.js`, `test/cancel.test.js`). Sin review, como pediste.

1. Capacidad nueva `booking-cancellation`: hoy `capabilities/` está vacío y la cancelación no está descrita en ninguna capacidad — el delta solo recoge lo nuevo, no reescribe lo que ya hacía `cancelar`.
2. El motivo es **obligatorio** al cancelar (tercer argumento de `cancelar`). Dijiste «se elige un motivo de una lista»; no dijiste si podía omitirse.
3. Los valores se escriben y se muestran con guiones, en un solo argumento de terminal: `cambio-de-planes`, `sala-ocupada`, `otro`. «Otro» no pide texto libre.
4. Motivo ausente o fuera de la lista → no se cancela nada y responde `motivo no válido: usa cambio-de-planes, sala-ocupada u otro`. Se comprueba **antes** de buscar la reserva, así que `cancelar Sur mar` sin motivo responde esto y no `sin reserva Sur mar`.
5. Respuesta de una cancelación correcta: `cancelada Norte lun (sala-ocupada)`, con el motivo entre paréntesis (hoy: `cancelada Norte lun`).
6. El listado no existía: es el comando nuevo `canceladas`, sin argumentos; una línea por reserva cancelada, `<sala> <día> <franja> — <motivo>`, en orden de cancelación. Sin ninguna: `sin canceladas`.
7. `canceladas` solo muestra las canceladas por el cliente; las anuladas (`anular`) no salen, porque son otro concepto en `PRODUCT.md` (Anulación ≠ Cancelación) y su motivo es de la 0011.
8. `anular` no cambia: no pide motivo.
9. Las reservas viven en memoria (`operations.md`): el motivo no persiste entre ejecuciones, igual que la reserva.
10. Prueba del delta en copia temporal: `sdd capability merge` → 5 requisitos añadidos a `booking-cancellation.md`, sin rechazos.
- Política de modelos: sin revisores de la spec · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo

### Decisiones tomadas con el dev-lead

- Al cancelar se elige un motivo de una lista (cambio de planes, sala ocupada, otro) y el listado de canceladas lo enseña — «al cancelar una reserva se elige un motivo de una lista (cambio de planes, sala ocupada, otro) y el listado de canceladas lo enseña».
- Sin review de la spec — «Sin review».

## Intent

Hoy una cancelación no deja rastro de por qué se hizo. Pasa a pedir un motivo de una lista cerrada y a enseñarlo en el listado de canceladas. Éxito: `cancelar` sin motivo válido nunca cancela, y todo lo cancelado aparece en `canceladas` con su motivo. Fracaso aunque funcione: que una reserva quede cancelada sin motivo, o que una anulada salga en el listado.

## Scope

- Entra: motivo obligatorio en `cancelar` con los tres valores; comando `canceladas`; actualizar los dos tests de `test/cancel.test.js` al nuevo formato.
- No entra: motivo en `anular` (fila 0011); texto libre en `otro`; persistir fuera de memoria; filtrar o ordenar el listado; cambiar `libres` o `reservar`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `cancelar <sala> <día>` sin motivo deja de cancelar | `src/app.js:13` (`cancelBooking`), `src/app.js:30` (`run`) | Scope + decisiones 2 y 4 |
| Respuesta `cancelada <sala> <día>` pasa a `cancelada <sala> <día> (<motivo>)` | `src/app.js:17`, `test/cancel.test.js:5` | decisión 5 |
| `cancelar Sur mar` sin motivo ya no responde `sin reserva Sur mar` | `test/cancel.test.js:9` | decisión 4; el test se actualiza con un motivo |

- Filas que implementa: 0010 → ningún fichero la nombra salvo `roadmap.md` (cierra el archivo); búsqueda de «cancel» en `README.md`, `PRODUCT.md` y `scripts/`: sin hits.

## Approach

El motivo se guarda en la reserva al cancelarla. `cancelar` valida el motivo contra la lista antes de buscar la reserva. `canceladas` recorre las reservas con estado `cancelled`. Todo en `src/app.js`, sin dependencias nuevas.

## Dónde se prueba

- Cancelar con motivo, motivo inválido o ausente, y `canceladas`: por `run()`, en `test/cancel.test.js`, como los tests de cancelación actuales.

## Términos y ADR

- Términos resueltos: **Motivo** — la razón de una cancelación, uno de `cambio-de-planes`, `sala-ocupada`, `otro`. _Evitar_: causa, razón.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-cancellation`

#### ADDED — La cancelación exige un motivo de la lista

- GIVEN reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun sala-ocupada`
- THEN responde `cancelada Norte lun (sala-ocupada)` y la reserva queda cancelada con ese motivo
- AND los motivos válidos son `cambio-de-planes`, `sala-ocupada` y `otro`

#### ADDED — Un motivo ausente o fuera de la lista no cancela

- GIVEN reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun` o `cancelar Norte lun aburrimiento`
- THEN responde `motivo no válido: usa cambio-de-planes, sala-ocupada u otro` y la reserva sigue activa
- AND con la sala y el día sin reserva (`cancelar Sur mar`), responde lo mismo, no `sin reserva Sur mar`

#### ADDED — Cancelar sin reserva activa lo dice

- GIVEN no hay reserva activa en Sur mar
- WHEN `cancelar Sur mar otro`
- THEN responde `sin reserva Sur mar`

#### ADDED — El listado de canceladas enseña el motivo

- GIVEN Norte lun 10:00-12:00 cancelada con `sala-ocupada` y Norte mar 14:00-16:00 cancelada con `otro`
- WHEN `canceladas`
- THEN responde una línea por reserva, en orden de cancelación: `Norte lun 10:00-12:00 — sala-ocupada` y `Norte mar 14:00-16:00 — otro`

#### ADDED — El listado de canceladas no incluye las anuladas ni dice nada si no hay

- GIVEN una reserva anulada con `anular` y ninguna cancelada
- WHEN `canceladas`
- THEN responde `sin canceladas`

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
