---
id: 20260922-065341-task-0012-libres-json
task: 0012
title: "`libres --json` devuelve las salas libres en JSON"
mode: full
profile: delegate
status: draft
created: 2026-09-22
author: Claude (sdd-start-task)
approvers:
  - role: dev-lead
    name: TBD
    approved_at: null
---

# Spec — `libres --json` devuelve las salas libres en JSON

> **Estado**: draft.
> **Siguiente paso**: `plan.md` con `superpowers:writing-plans`.

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales contadas: capacidad nueva (declara `room-availability`), contrato público (el panel del coworking consume el JSON). 2 señales, por debajo del umbral de 4 que activa la recomendación de review.

1. Nombre de la capacidad: `room-availability` (kebab-case, no existía `capabilities/` en el proyecto) — es la primera vez que se formaliza el comportamiento de consultar disponibilidad; el nombre describe el dominio (disponibilidad de salas), no el ticket.
2. La capacidad solo documenta el comportamiento que este delta añade (`--json`); no retro-documento la salida en texto plano existente, que queda fuera de scope y sin tocar.
3. Posición del flag `--json`: se acepta en cualquier posición de los argumentos (`libres 10:00-12:00 --json` o `libres --json 10:00-12:00`); la franja es el primer argumento que no es `--json`. Evita acoplar el orden de argumentos a un contrato nuevo que nadie pidió.
4. Formato de salida: JSON compacto en una línea (`JSON.stringify`, sin indentar) — lo consume un panel, no una persona.
5. Sin salas libres: `"libres": []` — array vacío, nunca `null` ni ausente, para que el panel no tenga que distinguir casos.
6. Validación del formato de la franja (`HH:MM-HH:MM`): no entra en esta task — ya es la task 0009 del roadmap. `libres --json` con una franja mal formada tiene el mismo comportamiento (sin validar) que `libres` hoy.

## Intent

Hoy `libres <franja>` imprime las salas libres como texto separado por comas, pensado para una persona en la terminal. El panel del coworking necesita leer esa misma disponibilidad por código. Sin un formato estructurado, el panel tendría que parsear texto libre, frágil ante cualquier cambio de redacción.

## Scope

- Entra: flag `--json` en el comando `libres` que devuelve `{"franja": "<franja>", "libres": ["<sala>", …]}`.
- Entra: capacidad `room-availability` con el requisito ADDED de la salida JSON.
- No entra: cambiar la salida de texto plano de `libres` sin `--json`.
- No entra: validar el formato de la franja horaria (task 0009).
- No entra: `--json` en `reservar` o `cancelar`.

## Approach

Añadir en `src/app.js` una rama en `run()` que, cuando `cmd === 'libres'` y los parámetros incluyen `--json`, construye el objeto `{ franja, libres }` a partir del resultado ya calculado por `freeRooms()` y lo serializa con `JSON.stringify`. `freeRooms()` no cambia: sigue devolviendo el array de salas libres, que es lo que ya usa la rama de texto plano.

## Delta de comportamiento

### Capacidad: `room-availability`

**ADDED — Consultar disponibilidad en JSON**
- GIVEN una franja horaria y el comando `libres`
- WHEN se ejecuta `libres <franja> --json` (el flag en cualquier posición)
- THEN la salida es una sola línea JSON con forma `{"franja": "<franja>", "libres": ["<sala>", …]}`
- AND si ninguna sala está libre, `"libres"` es `[]`

**Reglas de la capacidad**
- **Dónde viven los datos**: en memoria, en `src/app.js` (`rooms`, `bookings`) — sin cambios respecto a hoy.
- **Idioma de los nombres**: el valor de `"franja"` es el literal recibido por argumento; los nombres de sala son los de `rooms` (castellano, sin traducir).
- **Límites**: no aplica.
- **Avisos**: no aplica.
- **Regla ante conflicto**: no aplica (no hay conflicto posible: `libres` es de solo lectura).

## Enmiendas

<ninguna>

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
