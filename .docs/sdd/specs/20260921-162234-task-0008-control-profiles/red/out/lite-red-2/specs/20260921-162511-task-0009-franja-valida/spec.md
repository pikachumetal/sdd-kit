---
id: 20260921-162511-task-0009-franja-valida
task: 0009
title: Validar el formato de la franja horaria en `libres` y `reservar`
mode: full
status: in-review
created: 2026-09-21
author: Àngel Delgado
approvers:
  - role: dev-lead
    name: TBD
    approved_at: null
---

# Spec — Validar el formato de la franja horaria en `libres` y `reservar`

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: sin review — señales: capacidad nueva (`time-slots`). El resto no se cumple: el delta es solo `ADDED`, hay un único módulo (`src/app.js`, leído entero) y no hay datos, dependencias ni roles.
- Mínimo razonable: sin review — no deja nada sin cubrir que una lente pudiera ver; la decisión 7 es la única con riesgo de contrato y está explícita abajo.

1. **Modo full, no lite.** La task cumple las condiciones de lite, pero no las has confirmado, así que va en full (con `plan.md` tras aprobar esta spec). Si prefieres lite, dilo al aprobar y se salta el plan.
2. **Capacidad nueva `time-slots`** (franja horaria). No hay `capabilities/` en el proyecto; se crea al cerrar la task fusionando este delta.
3. **Formato válido: `HH:MM-HH:MM` estricto.** Dos dígitos por campo, hora 00–23, minutos 00–59, un solo guion, sin espacios ni mayúsculas. `9:00-11:00`, `10:00 - 12:00` y `25:00-26:00` son inválidas.
4. **No se valida el orden.** `12:00-10:00` pasa la validación: el ítem del roadmap habla de *formato*, y comprobar inicio < fin es otra regla. Si la quieres, es otra task.
5. **Mensaje de error único**, en castellano, por la salida estándar, igual para `libres` y `reservar`: `Franja horaria no válida: "<valor>". Usa el formato HH:MM-HH:MM (por ejemplo 10:00-12:00).` El `<valor>` es lo recibido tal cual.
6. **`libres` sin franja** cuenta como mal formada: mismo mensaje, con `""` como valor.
7. **En `reservar`, la franja es el segundo argumento posicional** (`reservar <sala> <franja> [--cada-semana]`) y se valida solo si viene. Hoy `reservar` no lee ninguna franja, y el test existente `reservar Norte --cada-semana` (sin franja) debe seguir igual; hacer la franja obligatoria cambiaría el contrato y queda fuera. Si el segundo argumento empieza por `--` no se considera franja.
8. **El código de salida no cambia** (0, como el resto de mensajes). Devolver ≠ 0 exigiría tocar el arranque de `app.js` y no lo pide el roadmap.
9. **Al cerrar** se retira del roadmap la fila de deuda técnica «Sin validación del formato de franja horaria».

## Intent

Hoy `libres` con una franja mal escrita (`10-12`, `25:00-26:00`) no da error: responde con todas las salas como libres, y da la impresión de que esa franja está disponible. Con `reservar` ocurrirá lo mismo en cuanto lea la franja. Se quiere un error claro en castellano y que, ante una franja inválida, no se consulte ni se reserve nada.

## Scope

- Entra: validar la franja en `libres` y en `reservar`; mensaje de error; cortar antes de consultar o reservar.
- No entra: comprobar que inicio < fin; hacer obligatoria la franja en `reservar`; cambiar el código de salida; validar sala o día.

## Approach

Una única función de validación de franja, usada por los dos comandos al inicio de su manejo. Si falla, se devuelve el mensaje y no se llega a `freeRooms` ni a la reserva. Sin dependencias nuevas. El cómo concreto va en `plan.md`.

## Delta de comportamiento

### Capacidad: `time-slots`

**ADDED — Una franja con formato válido se acepta**
- GIVEN una franja `HH:MM-HH:MM` con hora 00–23 y minutos 00–59
- WHEN se ejecuta `libres` o `reservar` con esa franja
- THEN el comando se comporta como hasta ahora (p. ej. `libres 10:00-12:00` devuelve `Sur`)

**ADDED — `libres` rechaza una franja mal formada**
- GIVEN una franja que no cumple el formato (`10-12`, `9:00-11:00`, `25:00-26:00`) o ausente
- WHEN se ejecuta `libres <franja>`
- THEN devuelve `Franja horaria no válida: "<valor>". Usa el formato HH:MM-HH:MM (por ejemplo 10:00-12:00).`
- AND no se consulta ninguna sala

**ADDED — `reservar` rechaza una franja mal formada**
- GIVEN una franja que no cumple el formato en el segundo argumento
- WHEN se ejecuta `reservar <sala> <franja>`
- THEN devuelve el mismo mensaje de error
- AND no se crea ninguna reserva, tampoco con `--cada-semana`

**ADDED — `reservar` sin franja no cambia**
- GIVEN `reservar <sala>` sin franja, con o sin `--cada-semana`
- WHEN se ejecuta
- THEN el resultado es el de hoy (p. ej. `reservar Norte --cada-semana` devuelve `reserva semanal creada`)

**Reglas de la capacidad**
- **Dónde viven los datos**: no aplica
- **Idioma de los nombres**: castellano (constitution, art. 4)
- **Límites**: hora 00–23, minutos 00–59, dos dígitos; no se valida inicio < fin
- **Avisos**: el mensaje de la decisión 5, sin cambios entre comandos
- **Regla ante conflicto**: no aplica

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
