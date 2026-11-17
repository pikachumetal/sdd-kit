---
id: 20261008-203806-feature-0010-cancel-reason
feature: 0010
title: Motivo al cancelar una reserva
mode: full
profile: delegate
status: in-review
created: 2026-10-08
author: <git-user>
approvers:
  - role: dev-lead
    name: TBD
    approved_at: null
---

# Spec — Motivo al cancelar una reserva

🦆 Hasta ahora cancelar una reserva no deja rastro de por qué: `cancelar Norte lun` y listo. Con esto, al cancelar hay que elegir un motivo de una lista (cambio de planes, sala ocupada u otro): `cancelar Norte lun --motivo sala-ocupada` responde «cancelada Norte lun (sala ocupada)». Sin motivo, o con uno que no está en la lista, no se cancela y se dice qué motivos hay. Además hay un listado nuevo, `canceladas`, que enseña cada reserva cancelada con su motivo («Norte lun · sala ocupada»). Las reservas anuladas por el responsable de sala no aparecen ahí: son otra cosa.

> **Estado**: in-review.
> **Siguiente paso**: modo full → `plan.md` con `superpowers:writing-plans`, tras la aprobación.

## Capacidades

- Nuevas: `booking-cancellation` — cancelar una reserva propia con motivo y listar las canceladas.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: capacidad nueva, MODIFIED · tamaño: ~25 líneas en 2 ficheros de código (más sus tests). Sin review por indicación del dev-lead; el repaso de coherencia lo he hecho yo.
- Mínimo razonable: ninguna — deja sin mirar a un segundo par de ojos sobre si el listado nuevo es lo que se quería (ver decisión 1).

1. **El listado de canceladas no existe hoy; lo creo.** El comando `canceladas` es nuevo (en el código solo hay `libres`, `reservar`, `cancelar`, `anular`). Lo enuncié así porque el roadmap dice «el listado de canceladas lo enseña» y no hay ninguno que enseñar. Si te referías a otro sitio, dímelo.
2. **Capacidad nueva `booking-cancellation`.** El proyecto no tiene `capabilities/`; esta es la primera y recoge la cancelación (hoy sin documentar) más el motivo.
3. **El motivo se pasa con `--motivo <código>`.** Códigos: `cambio-de-planes`, `sala-ocupada`, `otro`. Se muestran con espacios: «cambio de planes», «sala ocupada», «otro».
4. **El motivo es obligatorio.** `cancelar Norte lun` a secas ya no cancela. Cambia el comportamiento actual y el test existente `cancelar una reserva activa`.
5. **«otro» no lleva texto libre.** Es un valor más de la lista; YAGNI hasta que haga falta.
6. **Textos literales:**
   - éxito: `cancelada Norte lun (sala ocupada)`
   - motivo ausente o fuera de la lista: `motivo no válido: usa cambio-de-planes, sala-ocupada u otro`
   - listado: una línea por reserva, `Norte lun · sala ocupada`, en orden de cancelación
   - listado vacío: `sin canceladas`
7. **El motivo se valida antes de buscar la reserva.** `cancelar Sur mar` (sin reserva y sin motivo) responde el aviso del motivo, no «sin reserva».
8. **Las anuladas no salen en `canceladas`.** Cancelación y anulación son cosas distintas (PRODUCT.md); la anulación no lleva motivo en este cambio (eso es el 0011).
9. **Sin persistencia nueva.** Las reservas siguen en memoria, como hoy; el motivo es un campo más de la reserva.
10. **Sin `§Frontend`:** es una CLI, no cambia pantallas.

## Intent

Hoy cancelar una reserva no deja constancia de por qué, y no hay forma de ver las canceladas. Se quiere que la cancelación pida un motivo de una lista cerrada y que quede visible en un listado de canceladas.

## Scope

- Entra: `cancelar` exige un motivo de la lista; reserva cancelada guarda su motivo; comando `canceladas`; tests; la capacidad `booking-cancellation`.
- No entra: motivo en la anulación (0011); texto libre en «otro»; persistencia en disco; filtros u orden en el listado; cambios en `libres`, `reservar`, `anular`.
- Ficheros que lo implementan: `src/app.js` (`cancelBooking` y `run`, donde se aplica el requisito modificado) y `test/cancel.test.js`. No hay más sitios con el literal de la cancelación: `README.md` y `PRODUCT.md` no lo mencionan.

## Approach

`cancelar` recibe el motivo como opción. Se comprueba contra la lista cerrada antes de tocar nada; si es válido, la reserva activa pasa a cancelada y guarda el motivo. `canceladas` recorre las reservas canceladas y escribe una línea por cada una.

## Dónde se prueba

- Cancelar con motivo, motivo inválido o ausente, y reserva inexistente: por `run('cancelar', …)`, como los tests de `test/cancel.test.js`.
- Listado de canceladas: por `run('canceladas', [])`, en el mismo fichero de tests.

## Términos y ADR

- Términos resueltos: motivo — la razón, de una lista cerrada, por la que se cancela una reserva | ninguno más
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-cancellation`

**ADDED — Cancelar una reserva exige un motivo de la lista**
- GIVEN reserva activa Norte lun
- WHEN `cancelar Norte lun --motivo sala-ocupada`
- THEN responde `cancelada Norte lun (sala ocupada)` y la reserva queda cancelada con ese motivo
- AND los motivos válidos son `cambio-de-planes`, `sala-ocupada` y `otro`

**ADDED — Sin motivo válido no se cancela**
- GIVEN reserva activa Norte lun
- WHEN `cancelar Norte lun` (sin motivo) o `cancelar Norte lun --motivo aburrimiento`
- THEN responde `motivo no válido: usa cambio-de-planes, sala-ocupada u otro` y la reserva sigue activa
- AND con `cancelar Sur mar` (sin reserva y sin motivo) responde ese mismo aviso, no «sin reserva»

**ADDED — Cancelar una reserva inexistente lo dice**
- GIVEN no hay reserva activa en Sur mar
- WHEN `cancelar Sur mar --motivo otro`
- THEN responde `sin reserva Sur mar`

**ADDED — El listado de canceladas enseña el motivo**
- GIVEN Norte lun cancelada por `sala-ocupada` y Norte mar cancelada por `cambio-de-planes`, en ese orden
- WHEN `canceladas`
- THEN responde dos líneas: `Norte lun · sala ocupada` y `Norte mar · cambio de planes`

**ADDED — El listado de canceladas no incluye las anuladas**
- GIVEN Norte lun anulada por el responsable y Sur mie cancelada por `otro`
- WHEN `canceladas`
- THEN responde solo `Sur mie · otro`

**ADDED — Sin canceladas, el listado lo dice**
- GIVEN ninguna reserva cancelada
- WHEN `canceladas`
- THEN responde `sin canceladas`

**Reglas de la capacidad**
- **Límites**: motivos válidos `cambio-de-planes`, `sala-ocupada`, `otro` (lista cerrada).
- **Avisos**: `motivo no válido: usa cambio-de-planes, sala-ocupada u otro` · `sin reserva <sala> <día>` · `sin canceladas`.
- **Dónde viven los datos**: en memoria, en la propia reserva, como hoy.
- **Idioma de los nombres**: castellano en textos y códigos de motivo.
- **Regla ante conflicto**: el motivo se valida antes que la existencia de la reserva.

## Enmiendas

_Ninguna._

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
