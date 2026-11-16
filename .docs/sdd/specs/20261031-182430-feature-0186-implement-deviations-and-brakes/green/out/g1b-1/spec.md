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

🦆 Quien cancela una reserva tiene que elegir un motivo de una lista cerrada. Por ejemplo, Ana cancela la sala Norte del lunes con «sala ocupada», y la respuesta es «cancelada Norte lun (sala ocupada)». Un listado nuevo de canceladas enseña después «Norte lun — sala ocupada — Ana». El nombre sale de la persona a cuyo nombre está la reserva. Las reservas siguen en memoria, así que el listado solo enseña lo cancelado durante la misma ejecución.

Validación: dev-lead — lo usa una persona desde la terminal.

## Capacidades

- Nuevas: `bookings` — cancelar una reserva con motivo y listar las canceladas.

## ✋ Decisiones que he tomado yo — valida estas

1. La lista de motivos es cerrada: cambio de planes, sala ocupada, otro — decidido con el dev-lead en la entrevista.
2. El listado de canceladas enseña sala, día, motivo y quién canceló — la petición habla de «saber quién y por qué».
3. Sin review de spec: dos señales (capacidad nueva, datos), ~30 líneas en 2 ficheros. Corregido en el repaso: la versión anterior contaba `MODIFIED`, pero el delta solo tiene `ADDED`; el nivel no cambia.
4. `bookings` es una capacidad nueva, no modificada: `capabilities/` no existe. Corregido en el repaso: la prueba del delta rechazaba la versión anterior.
5. Quien cancela es el titular de la reserva, sin parámetro nuevo en el comando: `PRODUCT.md` define la cancelación como la que hace el propio cliente y la reserva «a nombre de quien la pide». Hoy las reservas no guardan titular, así que la reserva de ejemplo pasa a estar a nombre de Ana.
6. Las reservas siguen en memoria, como dice `operations.md`. Cada orden de terminal arranca de cero: comprobado, cancelar dos veces seguidas Norte lun responde «cancelada» las dos. Por eso `canceladas` solo enseña lo cancelado en el mismo proceso, y en dos órdenes de terminal seguidas responde «sin canceladas». Guardar en disco queda fuera de esta spec.
7. Sin `--motivo`, cancelar responde igual que con un motivo fuera de la lista y no cancela: «motivo no válido: cambio de planes, sala ocupada, otro».
8. Si no hay reserva, responde «sin reserva <sala> <día>» antes de mirar el motivo: mantiene la respuesta de hoy.
9. Sin ninguna cancelada, `canceladas` responde «sin canceladas».
10. Nombres y textos de esta spec: `--motivo`, `canceladas`, «cancelada Norte lun (sala ocupada)», «motivo no válido: cambio de planes, sala ocupada, otro» y «Norte lun — sala ocupada — Ana».
11. Las anulaciones no salen en `canceladas`: solo las reservas con estado cancelada.
12. Prevé una task, y el método es Native, fijado en `sdd-kit.json`.

- Política de modelos: revisores de la spec: ninguno · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte
- Prueba del delta: `sdd capability merge` sobre una copia: `bookings.md`, 2 requisitos añadidos, sin rechazos.

## Intent

Hoy cancelar no deja rastro: nadie sabe por qué se liberó una sala. Se quiere el motivo de cada cancelación.

## Scope

- Entra: `cancelar <sala> <día> --motivo <motivo>`; comando `canceladas`; titular en la reserva.
- No entra: anulaciones del responsable de sala (0011); guardar las reservas entre ejecuciones.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Respuesta «cancelada Norte lun» y `cancelar` sin motivo | `src/app.js:17`, `src/app.js:30`, `test/cancel.test.js:5-6` | Scope y delta, `ADDED`: pasa a «cancelada Norte lun (sala ocupada)»; no hay capacidad viva que modificar |

- Filas que implementa: 0010 → solo la nombra su fila de `.docs/sdd/roadmap.md`, que actualiza el cierre: comprobado con `grep -rnE "cancelada|cancelar|0010|Motivo al cancelar"`, sin `specs/`.

## Approach

El motivo se guarda con la reserva cancelada; `canceladas` lista las reservas con estado cancelada.

## Dónde se prueba

- Motivo: por el comando `cancelar`, como `test/cancel.test.js`.
- Listado: por la salida del comando `canceladas`, en `test/cancel.test.js`, cancelando y listando en el mismo proceso.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

#### ADDED — Cancelar pide un motivo de la lista

- GIVEN la reserva de Norte del lunes, 10:00-12:00, a nombre de Ana
- WHEN `cancelar Norte lun --motivo "sala ocupada"`
- THEN responde «cancelada Norte lun (sala ocupada)»
- AND un motivo fuera de la lista, o ninguno, responde «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa
- AND sin reserva, `cancelar Sur mar` responde «sin reserva Sur mar», con motivo o sin él

#### ADDED — El listado de canceladas enseña el motivo y quién canceló

- GIVEN la reserva de Norte del lunes, a nombre de Ana, cancelada con «sala ocupada» en esta ejecución
- WHEN `canceladas`
- THEN responde «Norte lun — sala ocupada — Ana»
- AND sin ninguna cancelada en esta ejecución, responde «sin canceladas»

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
