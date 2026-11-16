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

🦆 Hoy, quien cancela una reserva escribe `cancelar Norte lun` y la reserva desaparece sin dejar ningún rastro. Con este cambio hay que dar también un motivo, elegido de una lista cerrada, y el nombre de quien cancela: `cancelar Norte lun --motivo "sala ocupada" --por Ana`. Un comando nuevo, `canceladas`, lista lo cancelado: `Norte lun — sala ocupada — Ana`. Cancelar sin motivo deja de funcionar y te dice qué motivos valen.

## Capacidades

- Modificadas: `bookings`. Cancelar pide motivo y quién cancela, y el listado de canceladas los enseña. No existe `capabilities/`: la verdad viva es el código, `src/app.js`, y `test/cancel.test.js`.

## Decisiones tomadas con el dev-lead

1. La lista de motivos es cerrada: cambio de planes, sala ocupada, otro. Se decidió en la entrevista.
2. Review de spec: «sin review». Lo dijo el dev-lead el 2026-11-15 al pedir la gate.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: MODIFIED (cambia la respuesta y la sintaxis de `cancelar`), datos (motivo y autor nuevos en la reserva) · tamaño: ~30 líneas en 2 ficheros
- Dominio (sonnet): si quitar `cancelar <sala> <día>` sin motivo rompe a quien ya lo usa, y si «otro» necesita texto libre (señal: MODIFIED)
- Técnica (sonnet): si motivo y autor caben en la reserva en memoria sin tocar `libres` ni `anular` (señal: datos)
Aplicado: sin review, nombrado por el dev-lead (ver «Decisiones tomadas con el dev-lead»): deja sin mirar a nadie de fuera la compatibilidad de `cancelar` sin motivo y los huecos de «otro».
```

1. **Enfoque**: A, frente a B (ver Approach).
2. **Quién cancela, con `--por <nombre>`, obligatorio.** Hoy la app no sabe quién la usa, y la petición pide saber «quién y por qué». La alternativa era el usuario del sistema operativo, pero no se puede probar sin trucos y no coincide con el nombre de la persona.
3. **Cancelar sin `--motivo` o sin `--por` se rechaza** con «falta el motivo: cambio de planes, sala ocupada, otro» o con «falta quién cancela (--por)», y la reserva sigue activa. Es un MODIFIED: `cancelar Norte lun` a secas, que hoy cancela, deja de hacerlo. El test actual «cancelar una reserva activa» cambia.
4. **La respuesta de cancelar añade el motivo**: «cancelada Norte lun (sala ocupada)».
5. **«otro» no pide texto libre.** Es un motivo más de la lista.
6. **`canceladas` sin ninguna cancelación responde «sin canceladas».** Varias van una por línea, en el orden en que se cancelaron.
7. **Las reservas anuladas (`anular`) no salen en `canceladas`**: son de la 0011.
8. **Los datos viven en memoria**, en la propia reserva, como el resto de la app. No hay migración.
9. **Una sola task.** El plan lo confirmará.

## Intent

Hoy cancelar no deja rastro: nadie sabe por qué se liberó una sala ni quién la liberó. Queremos guardar el motivo y el autor de cada cancelación. El cambio sale bien si `canceladas` responde quién canceló y por qué en cada reserva cancelada. Sale mal, aunque funcione, si una cancelación sin motivo libera la sala igualmente.

## Scope

- Entra: `cancelar <sala> <día> --motivo <motivo> --por <nombre>`, con sus dos rechazos; el comando `canceladas`.
- No entra: anulaciones del responsable de sala (0011); motivo en texto libre; persistencia en disco.

## Approach

- **A (elegido)**: el motivo y el autor se guardan como campos de la reserva cancelada (`reason`, `cancelledBy`). `canceladas` filtra las reservas con `status: 'cancelled'`. No hace falta una estructura nueva, y `libres` y `anular` no cambian.
- **B (descartado)**: un registro aparte de cancelaciones. Duplica la sala y el día y deja dos fuentes que pueden contradecirse, sin ganar nada mientras todo vive en memoria.

## Dónde se prueba

- Motivo, autor y rechazos: con el comando `cancelar`, en `test/cancel.test.js`.
- Listado: con la salida del comando `canceladas`, en `test/cancel.test.js`.

## Delta de comportamiento

### Capacidad: `bookings`

**MODIFIED — Cancelar pide un motivo de la lista y quién cancela** (antes: `cancelar <sala> <día>` respondía «cancelada <sala> <día>»)
- GIVEN la reserva de Norte del lunes, 10:00-12:00
- WHEN `cancelar Norte lun --motivo "sala ocupada" --por Ana`
- THEN responde «cancelada Norte lun (sala ocupada)»
- AND un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro», y la reserva sigue activa
- AND sin `--motivo` responde «falta el motivo: cambio de planes, sala ocupada, otro», y la reserva sigue activa
- AND sin `--por` responde «falta quién cancela (--por)», y la reserva sigue activa

**ADDED — El listado de canceladas enseña el motivo y quién canceló**
- GIVEN la reserva de Norte del lunes cancelada por Ana con «sala ocupada»
- WHEN `canceladas`
- THEN responde «Norte lun — sala ocupada — Ana»
- AND sin ninguna cancelación responde «sin canceladas»

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
