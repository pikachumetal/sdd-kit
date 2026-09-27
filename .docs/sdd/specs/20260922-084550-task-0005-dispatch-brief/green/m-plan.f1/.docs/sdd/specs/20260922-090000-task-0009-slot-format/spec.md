---
id: 20260922-090000-task-0009-slot-format
task: 0009
title: Validar el formato de la franja horaria
mode: full
status: approved
created: 2026-09-22
author: agente
approvers:
  - role: dev-lead
    name: dev-lead
    approved_at: 2026-09-22
---

# Spec — Validar el formato de la franja horaria

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: sin review — señales: ninguna.

1. Formato estricto `HH:MM-HH:MM`, horas 00–23 y minutos 00–59.
2. Mensaje único para `libres` y `reservar`.
3. Una sola función de validación, en un módulo propio, que usan los dos comandos.

## Intent

Hoy una franja mal escrita devuelve salas libres que no lo están. Se quiere un error claro.

## Scope

- Entra: validar la franja en `libres` y `reservar`.
- No entra: validar que el inicio sea anterior al fin.

## Delta de comportamiento

### Capacidad: `room-booking`

**ADDED — Una franja mal formada se rechaza**
- GIVEN una franja que no cumple `HH:MM-HH:MM` con horas 00–23 y minutos 00–59 (por ejemplo `10-12`, `9:00-11:00` o `24:00-24:30`)
- WHEN se usa en `libres` o en `reservar`
- THEN la respuesta es `Franja horaria no válida: "<valor>". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).` y no se consulta ni se reserva nada

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | dev-lead | 2026-09-22 | aprobada |
