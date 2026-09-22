---
id: 20260922-061055-task-0009-slot-format
task: 0009
title: Validar formato de franja horaria en libres y reservar
mode: lite
profile: delegate
status: approved
created: 2026-09-22
author: Claude
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-22
---

# Spec — Validar formato de franja horaria en libres y reservar

## Decisiones que he tomado yo — valida estas

1. Modo lite — cumple las cuatro condiciones: el flujo de `libres` y `reservar` ya existe y se puede leer en `src/app.js`; no cambia contratos públicos (mismos comandos, mismos params); no toca schema de datos (`rooms`/`bookings` no cambian); cabe en un solo fichero (`src/app.js`). No existe `.docs/sdd/estimation.md`, así que esa condición no aplica.
2. Formato validado: `HH:MM-HH:MM`, horas `00`-`23`, minutos `00`-`59`. No valida que la hora de inicio sea anterior a la de fin — el roadmap pide validar *formato*, no rango; añadirlo sería alcance no pedido.
3. En `reservar`, la franja va en `params[1]` cuando ese argumento no es `--cada-semana` (mismo patrón posicional que `cancelar`: entidad + horario). Solo se añade la guarda de formato antes de cualquier lógica existente — no se implementa el flujo de reserva puntual completo si no existe ya. Con `reservar <sala> --cada-semana` (sin franja) no hay nada que validar y el comportamiento actual no cambia.
4. Mensaje de error único, reutilizado en los dos comandos: «Formato de franja horaria inválido. Usa HH:MM-HH:MM.»
5. Perfil: `delegate` (default del proyecto, `sdd-kit.json` no fija `control.profile`). Sin cambio.

### Decisiones tomadas con el dev-lead

- Aprobación de la spec sin cambios sobre la decisión 3 (franja de `reservar` en `params[1]`) — «Apruebo la spec.»

## Intent

Hoy `libres` y `reservar` aceptan cualquier string como franja horaria sin validar su formato. Una franja mal escrita (`10:00`, `25:00-26:00`, vacía…) puede colar una consulta o una reserva con datos erróneos sin avisar. Se quiere que un formato inválido corte la operación de inmediato, con un aviso en castellano, sin llegar a consultar salas libres ni crear una reserva.

## Scope

- Entra: validar el formato `HH:MM-HH:MM` de la franja en `libres` (`params[0]`) y en `reservar` (`params[1]`, cuando no es `--cada-semana`); mensaje de error en castellano; cortar la ejecución sin consultar ni reservar si el formato es inválido.
- No entra: validar que la hora de inicio sea anterior a la de fin; implementar el flujo de reserva puntual de `reservar` si no existe ya más allá de la guarda de formato; validar la hora suelta de `cancelar` (no es una franja).

## Approach

Una función de validación compartida en `src/app.js` que comprueba el string de franja contra el formato `HH:MM-HH:MM` (horas y minutos en rango). Se invoca al principio del manejo de `libres` y del manejo de `reservar` (caso no `--cada-semana`), antes de cualquier otra lógica: si la franja no es válida, `run` devuelve el mensaje de error y no llega a `freeRooms` ni a crear la reserva.

## Delta de comportamiento

### Capacidad: `time-slot`

**ADDED — Formato de franja horaria validado en `libres`**
- GIVEN un comando `libres <franja>`
- WHEN la franja no cumple el formato `HH:MM-HH:MM` (horas 00–23, minutos 00–59)
- THEN se devuelve el mensaje de error en castellano y no se consulta la disponibilidad de salas

**ADDED — Formato de franja horaria validado en `reservar`**
- GIVEN un comando `reservar <sala> <franja>` (sin `--cada-semana`)
- WHEN la franja no cumple el formato `HH:MM-HH:MM`
- THEN se devuelve el mensaje de error en castellano y no se crea la reserva

**Reglas de la capacidad**
- **Límites**: franja = `HH:MM-HH:MM`, horas `00`–`23`, minutos `00`–`59`
- **Avisos**: «Formato de franja horaria inválido. Usa HH:MM-HH:MM.», en castellano
- **Regla ante conflicto**: no aplica (no hay comprobación de orden inicio/fin en esta task)

## Enmiendas

_(sin enmiendas)_

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-22 | aprobada: «Apruebo la spec.» |
