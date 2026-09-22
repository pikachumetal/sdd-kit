---
id: 20260921-175246-task-0009-slot-format
task: 0009
title: Validar el formato de la franja horaria en libres
mode: full
status: draft
created: 2026-09-21
author: Claude
approvers:
  - role: dev-lead
    name: TBD
    approved_at: null
---

# Spec — Validar el formato de la franja horaria en libres

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: **sin review** — señales: capacidad nueva (`room-booking`). Una sola señal; no hay contrato público, datos ni dependencias. Mínimo razonable: el mismo, sin review — deja sin mirar solo si la decisión 5 (roadmap y deuda tras recortar el alcance) refleja lo que quieres.

Cambio respecto a la versión anterior, por tu indicación: **`reservar` sale del alcance**. Desaparece la decisión sobre la sintaxis de `reservar`.

1. **Formato válido = `HH:MM-HH:MM`**, con HH de `00` a `23` y MM de `00` a `59`, siempre dos dígitos. `24:00`, `9:00` y `10:00 - 12:00` (con espacios) son inválidos.
2. **No se valida el orden**: `12:00-10:00` pasa la validación. El ítem del roadmap dice «formato»; el orden es otra regla y no entra aquí.
3. **Mensaje de error** (castellano): `Franja horaria no válida: "<valor>". Usa el formato HH:MM-HH:MM, por ejemplo 10:00-12:00.`
4. **El error sale por stderr con código de salida 1**; el resto de mensajes de la herramienta siguen igual. Hoy nada devuelve código distinto de 0, así que esto lo introduce este error. **Una franja ausente no se valida**: `libres` sin franja sigue listando todas las salas.
5. **Roadmap al cerrar**: el ítem 0009 dice «`libres` y `reservar`» y esta task solo cubre `libres`. La fila de deuda técnica «Sin validación del formato de franja horaria» **no se elimina**: se reduce a `reservar`, y ahí sigue hasta que `reservar` lea una franja (hoy no lee ninguna: `reservar Norte --cada-semana` es la única forma que existe). El texto del ítem 0009 se ajusta a `libres` en el cierre.
6. **Capacidad nueva `room-booking`** (no existe ninguna en `capabilities/`): recoge este requisito. El comportamiento previo de `libres`/`reservar`/`cancelar` no está documentado en capacidades y no lo retro-documento aquí.
7. **Modo full**, no lite. Cumple las condiciones observables del predicado (flujo existente, sin schema ni migración, un solo módulo `src/app.js`, sin `estimation.md`), pero el modo lite lo activas tú. Si lo quieres, dilo y salto el plan.

## Intent

Hoy `libres` acepta cualquier texto como franja. `libres foo` responde con la lista completa de salas como si `foo` fuera una franja libre, y un error de tecleo (`10:0-12:00`) da un resultado falso en lugar de un aviso. Se quiere que una franja mal escrita se rechace con un mensaje claro y sin consultar nada.

## Scope

- Entra: validar el formato de la franja en `libres`; mensaje de error en castellano; código de salida 1 en error; tests de los escenarios de abajo.
- No entra: `reservar` (queda como deuda técnica); validar que el inicio sea anterior al fin; validar que la franja exista o esté dentro del horario del coworking; cambiar `cancelar` (recibe una hora suelta, no una franja); hacer obligatoria la franja en `libres`.

## Approach

Una comprobación de formato que `libres` ejecuta antes de consultar las salas. Si falla, el comando termina con el mensaje y sin consultar nada. El dónde y el cómo exactos van en `plan.md`.

## Delta de comportamiento

### Capacidad: `room-booking`

**ADDED — Franja horaria con formato válido**
- GIVEN una franja con formato `HH:MM-HH:MM`, HH entre `00` y `23`, MM entre `00` y `59`
- WHEN se ejecuta `libres <franja>`
- THEN el comando se ejecuta como hoy
- AND `12:00-10:00` (fin anterior al inicio) también se acepta: el orden no se valida

**ADDED — Franja horaria con formato inválido se rechaza**
- GIVEN una franja que no cumple el formato (`foo`, `10:0-12:00`, `24:00-25:00`, `10:00-12`, `10:00 - 12:00`)
- WHEN se ejecuta `libres <franja>`
- THEN se muestra por stderr `Franja horaria no válida: "<franja>". Usa el formato HH:MM-HH:MM, por ejemplo 10:00-12:00.`
- AND el código de salida es 1
- AND no se consulta ninguna sala

**ADDED — Franja ausente no se valida**
- GIVEN `libres` sin franja
- WHEN se ejecuta el comando
- THEN se comporta como hoy, sin error de formato

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
