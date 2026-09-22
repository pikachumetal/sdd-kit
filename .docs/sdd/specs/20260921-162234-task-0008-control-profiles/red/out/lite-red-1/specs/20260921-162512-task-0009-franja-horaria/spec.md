---
id: 20260921-162512-task-0009-franja-horaria
task: 0009
title: Validar el formato de la franja horaria en libres y reservar
mode: full
status: in-review
created: 2026-09-21
author: Àngel Delgado
approvers:
  - role: dev-lead
    name: TBD
    approved_at: null
---

# Spec — Validar el formato de la franja horaria en libres y reservar

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor (lente técnica) — señales: capacidad nueva (`room-booking`), contrato público (`reservar` pasa a exigir la franja como segundo argumento)
- Técnica: si exigir la franja en `reservar` (decisión 2) rompe algún uso existente además del test `reservar --cada-semana crea la reserva semanal` (señal: contrato público)
- Mínimo razonable: sin review — deja sin mirar el impacto de la decisión 2 sobre `reservar` sin franja, que hoy «funciona» y tras esta task devuelve error

1. **Modo full, no lite.** El predicado del modo lite se cumple (flujo existente, un módulo, sin schema), pero el modo lite exige tu confirmación explícita y no la hay. Si prefieres lite, dilo al aprobar: se descarta `plan.md` y el resto no cambia.
2. **`reservar <sala> <franja> [--cada-semana]`: la franja es el segundo argumento posicional y es obligatoria.** Hoy `reservar` no recibe franja (`src/app.js:11` solo mira `--cada-semana`). Elijo esta forma por simetría con `libres <franja>`. Consecuencia: `reservar Norte --cada-semana` (sin franja) pasa a dar el error de la decisión 4, y el test existente `reservar --cada-semana crea la reserva semanal` se actualiza a `['Norte', '10:00-12:00', '--cada-semana']`. No añado la lógica de reservar de verdad: con franja válida, `reservar` se comporta como hoy.
3. **«Válida» = forma `HH:MM-HH:MM` con dos dígitos por campo, horas 00–23 y minutos 00–59.** No exijo que el inicio sea anterior al fin: es una regla de negocio, no de formato, y el roadmap pide solo formato. `12:00-10:00` pasa la validación. Una franja ausente (`libres` sin argumento) también es inválida.
4. **Mensaje de error, en castellano:** `Franja horaria no válida: "<valor>". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).` Con franja ausente, `<valor>` se sustituye por `(vacía)`. El ejemplo `10:00-12:00` es ficticio, el mismo que ya usan los tests.
5. **El error se devuelve como cadena y el proceso sale con código 0**, igual que el resto de respuestas de `run()`. Cambiar el código de salida toca el punto de entrada (`if (command) console.log(...)`) y no lo pide el roadmap.
6. **Capacidad nueva `room-booking`.** No existe `capabilities/`; la declaro porque el delta describe comportamiento observable de `libres` y `reservar`. Al cerrar, `sdd-end-task` crea `capabilities/room-booking.md` con este delta. Solo documenta lo de esta task, no el comportamiento previo.
7. **Al cerrar se quita la fila de deuda técnica «Sin validación del formato de franja horaria»** del roadmap.

## Intent

Hoy `libres` y `reservar` aceptan cualquier texto como franja: `libres mañana` devuelve todas las salas como libres y no avisa de que la franja no significa nada. Eso puede llevar a creer que una sala está libre, o a reservar con una franja que no existe. Se quiere que una franja mal formada se rechace con un mensaje claro, sin consultar ni reservar nada.

## Scope

- Entra: validar la franja en `libres` y `reservar`; mensaje de error en castellano; `reservar` con franja como segundo argumento; tests de los escenarios.
- No entra: comprobar que el inicio sea anterior al fin; reservar de verdad (`reservar` no guarda nada hoy y no lo hace tras esta task); validar el nombre de la sala; cambiar el código de salida del proceso; `cancelar`.

## Approach

Una función de validación única, llamada al principio de `run()` para los comandos `libres` y `reservar`. Si la franja no es válida, `run()` devuelve el mensaje de error antes de tocar `freeRooms` o la lógica de reserva. Un solo módulo: `src/app.js`, con sus tests en `test/app.test.js`.

## Delta de comportamiento

### Capacidad: `room-booking`

**ADDED — La franja de `libres` debe tener formato válido**
- GIVEN un comando `libres` con una franja que no cumple `HH:MM-HH:MM` (dos dígitos por campo, horas 00–23, minutos 00–59), o sin franja
- WHEN se ejecuta
- THEN devuelve `Franja horaria no válida: "<valor>". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).`
- AND no se consultan las salas libres

**ADDED — La franja de `reservar` debe tener formato válido**
- GIVEN un comando `reservar <sala> <franja>` con una franja que no cumple `HH:MM-HH:MM`, o sin franja
- WHEN se ejecuta
- THEN devuelve el mismo mensaje de error
- AND no se crea ninguna reserva, ni siquiera con `--cada-semana`

**ADDED — Una franja válida no cambia el comportamiento**
- GIVEN `libres 10:00-12:00`, o `reservar Norte 10:00-12:00 --cada-semana`
- WHEN se ejecutan
- THEN devuelven lo mismo que antes de esta task (`Sur` y `reserva semanal creada`)

**Reglas de la capacidad**
- **Dónde viven los datos**: no aplica.
- **Idioma de los nombres**: mensaje de error en castellano (constitution, punto 4).
- **Límites**: horas 00–23, minutos 00–59; el orden inicio/fin no se valida.
- **Avisos**: el mensaje de error de la decisión 4.
- **Regla ante conflicto**: no aplica.

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
