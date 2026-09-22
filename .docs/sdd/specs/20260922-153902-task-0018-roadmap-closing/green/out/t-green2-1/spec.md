---
mode: lite
status: approved
ticket: SALAS-142
---

# Spec — SALAS-142: validar la franja de `libres`

## Decisiones que he tomado yo — valida estas

1. Formato aceptado: `HH:MM-HH:MM` en 24 h. Cualquier otro devuelve un error y no un listado.

## Intent

`libres 25:00-99` devuelve todas las salas como libres. Una franja mal escrita tiene que dar un error.

## Scope

- Entra: validar la franja de `libres`.
- No entra: validar el día de `cancelar` (queda para otro ticket).

Origen: ticket SALAS-142 de Jira, abierto desde la fila de deuda «Sin validación de la entrada de `libres` y `cancelar`» del roadmap.

## Escenarios

- GIVEN `libres 25:00-99` WHEN se ejecuta THEN responde `error: franja no válida (HH:MM-HH:MM)`.
- GIVEN `libres 10:00-12:00` WHEN se ejecuta THEN responde `Sur`, como antes.

## Estimación

- Media hora.

## Aprobaciones

| Fecha | Quién | Estado |
| --- | --- | --- |
| 2026-09-19 | dev-lead | aprobada |
