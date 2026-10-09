---
id: 20261008-203459-feature-0010-cancel-reason
feature: 0010
title: Motivo al cancelar una reserva
mode: full
profile: delegate
status: draft
created: 2026-10-08
author: <git-user>
approvers:
  - role: dev-lead
    name: TBD
    approved_at: null
---

# Spec — Motivo al cancelar una reserva

🦆 Al cancelar una reserva hay que decir por qué: «cambio de planes», «sala ocupada» u «otro». Por ejemplo, quien cancela la reserva de la sala Norte del lunes indica «sala ocupada», y la cancelación queda guardada con ese motivo. Si no indica motivo, o indica uno que no está en la lista, la reserva no se cancela y se le dice cuáles puede elegir. Además hay una consulta nueva de reservas canceladas que enseña, para cada una, la sala, el día, la franja y el motivo.

## Capacidades

- Nuevas: `cancellations` — cancelar una reserva propia con motivo y consultar las canceladas

## ✋ Decisiones que he tomado yo — valida estas

Review de spec: ninguna (decisión del dev-lead; ver abajo). Señales contadas: capacidad nueva (1). Tamaño: ~40 líneas en 3 ficheros.

1. **Capacidad nueva `cancellations`**: el proyecto no tiene capacidades todavía, así que la fusión crea esta. Nace con el comportamiento de cancelar que ya existe (cancelar una reserva activa, «sin reserva» si no hay, la 0007: no tocar la de otro día con la misma hora) más lo nuevo. Slug en inglés kebab-case.
2. **Cómo se elige el motivo**: opción `--motivo <valor>` de `cancelar`, p. ej. `cancelar Norte lun --motivo sala-ocupada`. Valores: `cambio-de-planes`, `sala-ocupada`, `otro`. La entrevista fijó la lista, no la sintaxis ni los identificadores.
3. **El motivo es obligatorio**: sin `--motivo` o con un valor fuera de la lista no se cancela nada y la respuesta lista los valores válidos. Cambia el comportamiento actual de `cancelar Norte lun` (hoy cancela sin más): hay que actualizar los dos tests existentes de `cancelar`.
4. **El motivo se valida antes de buscar la reserva**: `cancelar Sur mar` sin motivo da el aviso de motivo, no «sin reserva Sur mar».
5. **El mensaje de éxito no cambia**: sigue siendo `cancelada <sala> <día>`; el motivo solo se ve en el listado.
6. **El listado es un comando nuevo `canceladas`**: hoy no existe ningún listado de canceladas, así que lo creo. Una línea por reserva cancelada: `<sala> <día> <franja> · <motivo>`, con el motivo con su texto en castellano (`cambio de planes`, `sala ocupada`, `otro`). Sin canceladas: `sin canceladas`. Orden: el de la lista de reservas, no el de cancelación.
7. **El listado solo enseña cancelaciones**, no anulaciones del responsable de sala (otro concepto del glosario, y la 0011 se ocupa de él).
8. **Los motivos no se guardan más allá del proceso**: la reserva es un dato en memoria como hoy; no hay persistencia nueva.

### Decisiones tomadas con el dev-lead

- La lista de motivos, que el listado de canceladas los enseña y que no hay review de spec — «al cancelar una reserva se elige un motivo de una lista (cambio de planes, sala ocupada, otro) y el listado de canceladas lo enseña. Sin review.»

## Intent

Hoy una reserva se cancela sin dejar rastro de por qué y no hay forma de ver las canceladas. Con el motivo se puede saber de un vistazo cuántas se cancelan por cambio de planes y cuántas porque la sala estaba ocupada.

## Scope

- Entra: `cancelar` pide un motivo de una lista cerrada y lo guarda en la reserva; comando `canceladas` con el motivo de cada una; actualizar los tests de `cancelar` y añadir los nuevos.
- Lo implementan `src/app.js` (`cancelBooking` y `run`) y se prueban en `test/cancel.test.js` y un fichero nuevo para `canceladas`. No hay más ficheros con esta regla (`README.md` y `PRODUCT.md` no la mencionan).
- No entra: anular reservas del responsable de sala (0011); la regla de 24 h del glosario; persistencia; filtros u orden del listado; motivo en texto libre; editar el motivo después.

## Approach

`cancelar` acepta `--motivo`, comprueba que está en la lista y, si es válido y hay reserva activa, la marca cancelada con ese motivo. `canceladas` recorre las reservas canceladas y escribe una línea por cada una.

## Dónde se prueba

- Cancelar con motivo, sin motivo, con motivo inválido y sin reserva: por `run('cancelar', …)`, como los tests actuales de `test/cancel.test.js`.
- Listado de canceladas: por `run('canceladas', [])`, tras cancelar con `run('cancelar', …)`, con el mismo patrón.

## Términos y ADR

- Términos resueltos: motivo — la razón, de una lista cerrada, por la que el cliente cancela su reserva; se evita «causa» y «razón». No se añade al glosario de `PRODUCT.md` en esta feature.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `cancellations`

**ADDED — Cancelar una reserva con motivo**
- GIVEN la reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun --motivo sala-ocupada`
- THEN responde `cancelada Norte lun`
- AND la reserva deja de estar activa: `libres 10:00-12:00` devuelve `Norte, Sur`

**ADDED — Sin motivo no se cancela**
- GIVEN la reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun` (sin `--motivo`)
- THEN responde `motivo requerido: cambio-de-planes, sala-ocupada, otro`
- AND la reserva sigue activa: `libres 10:00-12:00` devuelve `Sur`

**ADDED — Un motivo fuera de la lista no se cancela**
- GIVEN la reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun --motivo aburrimiento`
- THEN responde `motivo desconocido: aburrimiento. Opciones: cambio-de-planes, sala-ocupada, otro`
- AND la reserva sigue activa

**ADDED — Cancelar sin reserva lo dice**
- GIVEN no hay reserva activa Sur mar
- WHEN `cancelar Sur mar --motivo otro`
- THEN responde `sin reserva Sur mar`

**ADDED — Cancelar solo afecta al día indicado** (la 0007, hasta ahora sin capacidad)
- GIVEN la reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte mar --motivo otro`
- THEN responde `sin reserva Norte mar`
- AND la reserva de Norte lun sigue activa

**ADDED — El listado de canceladas enseña el motivo**
- GIVEN la reserva Norte lun 10:00-12:00 cancelada con `--motivo cambio-de-planes`
- WHEN `canceladas`
- THEN responde `Norte lun 10:00-12:00 · cambio de planes`

**ADDED — Sin canceladas**
- GIVEN ninguna reserva cancelada
- WHEN `canceladas`
- THEN responde `sin canceladas`

**ADDED — El listado no incluye anuladas**
- GIVEN la reserva Norte lun 10:00-12:00 anulada con `anular Norte lun`
- WHEN `canceladas`
- THEN responde `sin canceladas`

**Reglas de la capacidad**
- **Límites**: el motivo es uno de `cambio-de-planes` (se enseña «cambio de planes»), `sala-ocupada` («sala ocupada») u `otro` («otro»).
- **Avisos**: `motivo requerido: cambio-de-planes, sala-ocupada, otro` · `motivo desconocido: <valor>. Opciones: cambio-de-planes, sala-ocupada, otro` · `sin reserva <sala> <día>` · `sin canceladas`.
- **Dónde viven los datos**, **Idioma de los nombres**, **Regla ante conflicto**: no aplica.

## Enmiendas

(ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
