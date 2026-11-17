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

🦆 Quien cancela una reserva elige un motivo de una lista cerrada, y un listado nuevo enseña las cancelaciones. Por ejemplo, al cancelar la sala Norte del lunes con «sala ocupada», el programa responde «cancelada Norte lun (sala ocupada)» y el listado enseña «Norte lun — sala ocupada — Ana». Un motivo fuera de la lista recibe un aviso con los motivos válidos. El motivo se guarda con la reserva cancelada. Falta decidir cómo sabe el programa quién cancela, qué pasa al cancelar sin motivo y cómo sobrevive el dato entre dos ejecuciones.

Validación: dev-lead — lo usa una persona desde la terminal.

## Capacidades

- Nuevas: `bookings` — reservas de salas y sus cancelaciones.

## Decisiones que he tomado yo — valida estas

1. Sin review de spec: dos señales (capacidad nueva, datos), por debajo de las cuatro que la proponen. Corregido en el repaso: la spec contaba MODIFIED, pero no hay requisito vigente que cambiar.
2. La capacidad nueva se llama `bookings`: el nombre es un fichero y va en inglés. Corregido en el repaso: figuraba como modificada y `sdd capability merge` la rechazaba.
3. La lista de motivos es cerrada: cambio de planes, sala ocupada, otro — según la spec, decidido con el dev-lead en la entrevista.
4. El listado enseña sala, día, motivo y quién canceló. La spec lo atribuye a la petición («saber quién y por qué»); la fila 0010 del roadmap solo pide el motivo.
5. Parámetro `--motivo` y comando `canceladas`: nombres sin origen en el roadmap.
6. Textos de respuesta: «cancelada Norte lun (sala ocupada)», «motivo no válido: cambio de planes, sala ocupada, otro» y «Norte lun — sala ocupada — Ana».
7. `sdd capability merge` sobre una copia: `bookings.md: añadido «Cancelar pide un motivo de la lista»` · `bookings.md: añadido «El listado de canceladas enseña el motivo y quién canceló»`. Solo comprueba el formato del delta, no los puntos sin resolver.
- Política de modelos: ningún revisor de spec · revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents`.

### Sin resolver — impiden cumplir la spec tal como está

- **Quién canceló**: `cancelar` no recibe ninguna persona y la reserva no guarda a nombre de quién está, así que «Ana» no sale de ningún dato.
- **Cancelar sin motivo**: ningún escenario lo cubre, y hoy `cancelar Norte lun` responde «cancelada Norte lun».
- **El dato entre ejecuciones**: las reservas viven en memoria y cada comando es un proceso nuevo, así que `canceladas` en otra ejecución no encuentra la cancelación.

## Intent

Hoy cancelar no deja rastro: nadie sabe por qué se liberó una sala. Se quiere el motivo de cada cancelación.

## Scope

- Entra: `cancelar <sala> <día> --motivo <motivo>`; comando `canceladas`.
- No entra: anulaciones del responsable de sala (0011).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Respuesta «cancelada Norte lun» → «cancelada Norte lun (sala ocupada)» | `src/app.js:17`, `test/cancel.test.js:6` | delta, ADDED «Cancelar pide un motivo de la lista»; el test cambia con él |

- Filas que implementa: 0010 → solo la nombra `.docs/sdd/roadmap.md:7`, que el cierre actualiza.

## Approach

El motivo se guarda con la reserva cancelada; `canceladas` lista las reservas con estado cancelada.

## Dónde se prueba

- Motivo: por el comando `cancelar`, como `test/cancel.test.js`.
- Listado: por la salida del comando `canceladas`, en `test/cancel.test.js`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

**ADDED — Cancelar pide un motivo de la lista**
- GIVEN la reserva de Norte del lunes, 10:00-12:00
- WHEN `cancelar Norte lun --motivo "sala ocupada"`
- THEN responde «cancelada Norte lun (sala ocupada)»
- AND un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro»

**ADDED — El listado de canceladas enseña el motivo y quién canceló**
- GIVEN la reserva de Norte del lunes cancelada por Ana con «sala ocupada»
- WHEN `canceladas`
- THEN responde «Norte lun — sala ocupada — Ana»

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
