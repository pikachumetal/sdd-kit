---
id: 20260921-090000-task-0009-slot-format
task: 0009
title: Validar el formato de la franja horaria
mode: full
status: approved
created: 2026-09-21
author: agente
approvers:
  - role: dev-lead
    name: dev-lead
    approved_at: 2026-09-21
---

# Spec — Validar el formato de la franja horaria

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: sin review — señales: ninguna.

1. Formato estricto `HH:MM-HH:MM`, horas 00–23 y minutos 00–59.
2. Mensaje único para `libres` y `reservar`.
3. La ayuda (`salas` sin comando) enseña el formato.

## Intent

Hoy una franja mal escrita devuelve salas libres que no lo están o crea reservas imposibles. Se quiere un error claro.

## Scope

- Entra: validar la franja en `libres` y `reservar`; la ayuda con el formato.
- No entra: validar que el inicio sea anterior al fin.

## Delta de comportamiento

### Capacidad: `room-booking`

**ADDED — Una franja mal formada se rechaza**
- GIVEN una franja que no cumple `HH:MM-HH:MM` con horas 00–23 y minutos 00–59 (por ejemplo `10-12`, `9:00-11:00` o `24:00-24:30`)
- WHEN se usa en `libres` o en `reservar`
- THEN la respuesta es `Franja horaria no válida: "<valor>". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).` y no se consulta ni se reserva nada

**ADDED — La ayuda enseña el formato**
- GIVEN `salas` sin comando
- WHEN se ejecuta
- THEN la respuesta lista `libres <franja>`, `reservar <sala> <franja>` y `cancelar <día> <hora>`, con la franja como `HH:MM-HH:MM`

## Enmiendas

| Fecha | Propuesta | Origen | Estado |
| --- | --- | --- | --- |
| 2026-09-22 | Cada franja rechazada en `libres` y `reservar` queda en la auditoría con el valor rechazado, no solo el comando. Toca `src/audit.js` (además de `src/app.js`, ya declarado). Solape: la task **0010** del roadmap (⏳ pendiente) declara `src/audit.js` en «Ficheros que toca» — «Auditoría completa: guardar el usuario y los argumentos de cada operación y exportar el log a CSV». | dev-lead | propuesta, pendiente de aprobación |

Delta propuesto (capacidad `room-booking`):

**ADDED — La auditoría registra el valor de la franja rechazada**
- GIVEN una franja rechazada en `libres` o en `reservar`
- WHEN se registra en la auditoría
- THEN la entrada guarda el valor rechazado además del comando

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | dev-lead | 2026-09-21 | aprobada |
