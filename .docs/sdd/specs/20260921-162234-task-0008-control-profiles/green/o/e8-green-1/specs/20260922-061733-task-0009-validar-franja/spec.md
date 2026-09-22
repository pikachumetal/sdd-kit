---
id: 20260922-061733-task-0009-validar-franja
task: 0009
title: Validar formato de franja horaria en libres y reservar
mode: lite
profile: unattended
status: approved
created: 2026-09-22
author: agente (unattended)
approvers:
  - role: dev-lead
    name: agente (unattended)
    approved_at: 2026-09-22
---

# Spec — Validar formato de franja horaria en libres y reservar

## Decisiones que he tomado yo — valida estas

1. Franja válida = `HH:MM-HH:MM` con horas `00`-`23` y minutos `00`-`59` — por qué: es el único formato que usan hoy `libres` y las reservas (`10:00-12:00`).
2. La validación es solo de **formato** (regex), no de coherencia semántica (que la hora de inicio sea anterior a la de fin) — por qué: la task pide formato; validar el orden es un requisito distinto no pedido, YAGNI.
3. `reservar` pasa a tener firma `reservar <sala> <franja> [--cada-semana]` — por qué: hoy `reservar` no toma franja (solo sala y flag), así que no hay nada que validar salvo que se declare dónde va. Actualizo el test existente de `reservar --cada-semana` para incluir una franja válida, ya que ese test ejercita el mismo path que ahora exige el argumento.
4. El error se devuelve como valor de retorno de `run()` (no `throw`) — por qué: mantiene el contrato actual, `run()` siempre devuelve un string que se imprime.
5. Declaro la capacidad `bookings` (nueva, no existía `capabilities/`) — por qué: agrupa el comportamiento observable de `libres`/`reservar`/`cancelar` que hasta ahora no tenía dueño documentado.

En `unattended` apruebo esta spec yo mismo con estas decisiones registradas (no hay dev-lead presente).

## Intent

Hoy `libres` y `reservar` aceptan cualquier cadena como franja horaria: un valor mal escrito (`"10-12"`, `"25:00-26:00"`, vacío) no se rechaza, se cuela hasta la lógica de negocio. La task pide cortar eso antes: si el formato no es `HH:MM-HH:MM` válido, se informa en castellano y no se consulta disponibilidad ni se crea ninguna reserva.

## Scope

- Entra: validar el formato de la franja en `libres` (params[0]) y en `reservar` (params[1]); mensaje de error en castellano; cortocircuitar la operación si el formato es inválido.
- No entra: validar que la hora de inicio sea anterior a la de fin; validar franjas duplicadas o solapadas; tocar `cancelar` (no la menciona la task).

## Approach

Una función `parseSlot(slot)` compartida (single source of truth) que valida contra una regex `HH:MM-HH:MM` con rangos horarios reales. `libres` y `reservar` la llaman antes de tocar `bookings`; si no es válida, devuelven el mensaje de error y no ejecutan el resto de su lógica.

## Delta de comportamiento

### Capacidad: `bookings`

**ADDED — Rechazo de franja horaria con formato inválido**
- GIVEN un comando `libres` o `reservar`
- WHEN la franja horaria no cumple el formato `HH:MM-HH:MM` (horas 00-23, minutos 00-59)
- THEN se devuelve el mensaje de error en castellano `Formato de franja horaria inválido: "<valor>". Usa HH:MM-HH:MM.`
- AND no se consulta disponibilidad ni se crea ninguna reserva

**Reglas de la capacidad**
- **Dónde viven los datos**: no aplica (validación sin estado)
- **Idioma de los nombres**: mensajes de error en castellano; identificadores de código en inglés
- **Límites**: horas 00-23, minutos 00-59
- **Avisos**: mensaje de error literal citado arriba
- **Regla ante conflicto**: no aplica

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | agente (unattended) | 2026-09-22 | aprobada (unattended, sin dev-lead presente) |
