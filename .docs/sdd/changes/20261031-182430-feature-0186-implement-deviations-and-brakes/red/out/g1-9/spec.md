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

🦆 Al cancelar la reserva de la sala Norte del lunes, dices el motivo, de una lista de tres, y quién cancela. Después, el listado de canceladas enseña «Norte lun — sala ocupada — Ana». Si el motivo no está en la lista o falta, la reserva sigue activa y la respuesta enseña los motivos válidos. El motivo y el nombre se guardan con la reserva cancelada. Las reservas siguen en memoria, así que el listado solo enseña lo cancelado en la misma ejecución.

Validación: dev-lead — es una salida que usa una persona.

## Capacidades

- Nuevas: `bookings` — cancelar una reserva con su motivo y listar las canceladas. El proyecto aún no tiene `capabilities/`.

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: capacidad nueva (`bookings`), cambio de un comportamiento existente (cancelar exige motivo), datos (motivo y nombre) · tamaño: ~40 líneas en 2 ficheros

1. La lista de motivos es cerrada: cambio de planes, sala ocupada, otro — según el borrador, decidido con el dev-lead en la entrevista; no tengo su frase literal, por eso sigue aquí.
2. El listado de canceladas enseña sala, día, motivo y quién canceló — el borrador lo atribuye a «saber quién y por qué»; esa frase no está en el roadmap ni en el Intent.
3. Quién canceló se indica con `--por <nombre>`, obligatorio — añadido en el repaso: ni el comando ni las reservas guardan hoy un nombre, y el escenario de Ana no se podía cumplir.
4. Sin `--motivo` responde como un motivo no válido, y sin `--por` pide el nombre; en los dos casos no cancela — añadido en el repaso: el borrador no lo decía.
5. Textos: «cancelada Norte lun (sala ocupada)», «motivo no válido: cambio de planes, sala ocupada, otro», «indica quién cancela con --por», «Norte lun — sala ocupada — Ana» y, sin canceladas, «sin canceladas».
6. Si no hay reserva, responde «sin reserva <sala> <día>» antes de mirar el motivo — así no cambia la respuesta actual.
7. Las reservas siguen en memoria, y guardarlas en disco no entra — `operations.md` lo declara así. Consecuencia, comprobada: cada ejecución de la terminal arranca de cero, así que `canceladas` en una ejecución aparte sale vacío y el rastro del Intent no se cumple en uso real hasta que haya persistencia.
8. La capacidad `bookings` pasa de «Modificadas» a «Nuevas» — corregido en el repaso, porque la prueba de fusión la rechazaba al no existir su fichero. El slug lo apruebas tú.
9. Sin review de spec: tres señales, ninguna regla pide revisor — corregido en el repaso: el borrador contaba dos.
- Prueba del delta sobre una copia: `sdd capability merge` sale con 0: `bookings.md` nueva, 2 requisitos y 5 reglas añadidos; `capabilities/` del repo sin cambios.
- Política de modelos: revisores de la spec: ninguno · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

## Intent

Hoy cancelar no deja rastro: nadie sabe por qué se liberó una sala. Se quiere el motivo de cada cancelación. Esta feature lo deja guardado y visible dentro de una ejecución; ver la decisión 7.

## Scope

- Entra: `cancelar <sala> <día> --motivo <motivo> --por <nombre>`; comando `canceladas`.
- No entra: anulaciones del responsable de sala (0011); guardar las reservas en disco; la regla de las 24 h de `PRODUCT.md`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `cancelar <sala> <día>` sin motivo deja de cancelar | `src/app.js` (`cancelBooking`, `run`); `test/cancel.test.js`, «cancelar una reserva activa» | delta y Scope; el test se actualiza |
| La respuesta «cancelada Norte lun» pasa a llevar el motivo | `src/app.js` (`cancelBooking`); `test/cancel.test.js` | delta y Scope |

- Filas que implementa: 0010 → solo `.docs/sdd/roadmap.md:7`; su estado lo actualiza el flujo: comprobado con `grep -rnE "0010|Motivo al cancelar|canceladas|cancelar" .docs/sdd PRODUCT.md README.md`

## Approach

El motivo y el nombre se guardan con la reserva cancelada; `canceladas` lista las reservas con estado cancelada.

## Dónde se prueba

- Motivo: por el comando `cancelar`, como `test/cancel.test.js`.
- Listado: por la salida del comando `canceladas`, en `test/cancel.test.js`.

## Delta de comportamiento

### Capacidad: `bookings`

**ADDED — Cancelar pide un motivo de la lista**
- GIVEN la reserva de Norte del lunes, 10:00-12:00
- WHEN `cancelar Norte lun --motivo "sala ocupada" --por Ana`
- THEN responde «cancelada Norte lun (sala ocupada)»
- AND un motivo fuera de la lista, o la falta de `--motivo`, responde «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa
- AND la falta de `--por` responde «indica quién cancela con --por» y la reserva sigue activa
- AND sin reserva de esa sala y ese día responde «sin reserva Sur mar», con motivo o sin él

**ADDED — El listado de canceladas enseña el motivo y quién canceló**
- GIVEN la reserva de Norte del lunes cancelada por Ana con «sala ocupada»
- WHEN `canceladas`, en la misma ejecución
- THEN responde «Norte lun — sala ocupada — Ana»
- AND sin reservas canceladas responde «sin canceladas»
- AND una reserva anulada no aparece

**Reglas de la capacidad — bookings**
- **Dónde viven los datos**: en memoria, con la reserva; se pierden al acabar la ejecución
- **Idioma de los nombres**: castellano
- **Límites**: no aplica
- **Avisos**: «motivo no válido: cambio de planes, sala ocupada, otro» · «indica quién cancela con --por»
- **Regla ante conflicto**: no aplica

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
