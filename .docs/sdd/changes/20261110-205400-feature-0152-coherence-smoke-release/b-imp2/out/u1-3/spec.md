---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Motivo al cancelar
mode: full
profile: delegate
status: approved
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - role: dev-lead
    name: Laura
    approved_at: 2026-10-08
---

# Spec — Motivo al cancelar

## Capacidades

- Modificadas: `bookings` — cancelar pide un motivo y el listado de canceladas lo enseña.

## Decisiones que he tomado yo — valida estas

1. La lista de motivos es cerrada: cambio de planes, sala ocupada, otro — decidido con el dev-lead en la entrevista.
2. El listado de canceladas enseña sala, día, motivo y quién canceló — la petición habla de «saber quién y por qué». El «quién» sale de `--por <nombre>` al cancelar (enmienda 2026-11-11).
3. `--por` es obligatorio, texto libre sin validar y declarativo (la aplicación no autentica a nadie); sin él, o vacío, responde «falta quién cancela: usa --por <nombre>». Se valida primero el motivo y luego `--por` (enmienda 2026-11-11).
4. Sin review de spec: dos señales (MODIFIED, datos).

## Intent

Hoy cancelar no deja rastro: nadie sabe por qué se liberó una sala. Se quiere el motivo de cada cancelación.

## Scope

- Entra: `cancelar <sala> <día> --motivo <motivo> --por <nombre>` (cambio incompatible: `cancelar` sin `--por` deja de valer); comando `canceladas`.
- No entra: anulaciones del responsable de sala (0011).

## Approach

El motivo se guarda con la reserva cancelada; `canceladas` lista las reservas con estado cancelada.

## Dónde se prueba

- Motivo: por el comando `cancelar`, como `test/cancel.test.js`.
- Listado: por la salida del comando `canceladas`, en `test/cancel.test.js`.

## Delta de comportamiento

### Capacidad: `bookings`

**ADDED — Cancelar pide un motivo de la lista**
- GIVEN la reserva de Norte del lunes, 10:00-12:00
- WHEN `cancelar Norte lun --motivo "sala ocupada" --por Ana`
- THEN responde «cancelada Norte lun (sala ocupada)»
- AND un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro»
- AND sin `--motivo` responde lo mismo: «motivo no válido: cambio de planes, sala ocupada, otro»

**ADDED — Cancelar pide quién cancela**
- GIVEN la reserva de Norte del lunes, 10:00-12:00
- WHEN `cancelar Norte lun --motivo "sala ocupada" --por Ana`
- THEN responde «cancelada Norte lun (sala ocupada)» y la reserva guarda que canceló Ana
- AND `--por` ausente o sin valor responde «falta quién cancela: usa --por <nombre>»
- AND con motivo no válido y sin `--por`, responde el error del motivo
- AND después, `canceladas` responde «Norte lun — sala ocupada — Ana»

**ADDED — El listado de canceladas enseña el motivo y quién canceló**
- GIVEN la reserva de Norte del lunes cancelada por Ana con «sala ocupada»
- WHEN `canceladas`
- THEN responde «Norte lun — sala ocupada — Ana»

## Enmiendas

- 2026-11-11 — enmienda: la aplicación no tiene usuarios, así que «quién canceló» no salía de ningún dato; `cancelar` pasa a recibir `--por <nombre>` y se guarda con la reserva (requisito nuevo «Cancelar pide quién cancela», el WHEN del requisito de motivo lleva `--por Ana`, y decisiones 2 y 3 y Scope actualizados). Review: dos Críticos aceptados (WHEN del requisito de motivo; aprobación de la enmienda pendiente), `--por` declarativo y orden de validación fijados; rechazados: reservas antiguas sin autor (el almacén está en memoria, no hay) y el nombre «Laura» (no aparece en ningún ejemplo). Afecta a la Task 1 → Task 3. Pendiente de aprobación del dev-lead.

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | 2026-10-08 | aprobada |
