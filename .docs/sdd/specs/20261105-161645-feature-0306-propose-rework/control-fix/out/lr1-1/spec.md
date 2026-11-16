---
id: 20261008-170000-feature-0019-free-without-slot
feature: 0019
title: libres sin franja dice qué falta
mode: lite
profile: delegate
status: draft
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - name: Laura
    approved_at: null
---

# Spec — libres sin franja dice qué falta

🦆 Hoy, si escribes `libres` sin hora, la herramienta responde `Norte, Sur`, como si las dos salas estuvieran libres siempre. Con este cambio responde `falta la franja: libres <franja>`. `libres 10:00-12:00` sigue respondiendo `Sur`, igual que ahora.

## Capacidades

- Nuevas: `rooms` — `libres` sin franja dice qué falta en vez de listar todas las salas.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor (lite) — señales: capacidad nueva (`rooms`, no hay `capabilities/`) · tamaño: ~5 líneas en 2 ficheros
- Un revisor, sonnet, con los siete puntos: si el ADDED de `rooms` es verificable con el catálogo de `src/app.js`, y si `libres <franja>` queda igual que hoy (señal: capacidad nueva)
- Mínimo razonable: este mismo — un revisor ya es el nivel más bajo; no deja nada sin cubrir

1. Capacidad nueva `rooms` (kebab-case en inglés, será `capabilities/rooms.md`): el repo no tiene `capabilities/`, así que el delta la crea.
2. El mensaje es `falta la franja: libres <franja>`. No he encontrado «la guía» en `.docs/sdd/` ni en el repo: la forma `falta <qué>: <uso>` es mía y vale solo para este mensaje, no para otros comandos.
3. Enfoque: una sola forma sensata, una rama al inicio de `run` para `libres` sin `params[0]`; descarto cambiar `freeRooms`, porque `libres <franja>` no debe cambiar. La rama nueva salta solo si no hay franja (`params[0]` indefinido): `libres ''` sigue respondiendo como hoy.
4. Es salida normal por stdout, código de salida 0 (como el resto de respuestas de `run`), no un error.
5. Reglas del mensaje: el texto vive literal en `run`; en castellano (constitución, 4); límites, avisos y conflicto: no aplica.

### Hallazgos de la review

- **Aceptado** — Crítico: el escenario mezclaba `libres` sin franja con `libres <franja>` → separado en dos ADDED, el primero sin reserva en el GIVEN.
- **Rechazado** — Crítico: el ADDED es un MODIFIED encubierto → `rooms` no existe en `capabilities/`, así que no hay requisito vigente que modificar; el comportamiento actual no está escrito en ninguna capacidad y este delta la crea.
- **Aceptado** — Importante: el mensaje podía leerse como convención general o error → decisiones 2 y 4.
- **Aceptado** — Importante: reglas del mensaje sin declarar → decisión 5 (la constitución no tiene «Reglas de producto»).
- **Aceptado** — Importante/Menor: la regresión de `libres <franja>` ya la cubre el test existente «libres excluye la sala reservada en la franja»; `test/app.test.js` entra en el Scope y la franja vacía queda fuera.
- **Rechazado** — Importante: reconsiderar lite → lo confirmó el dev-lead con sus cinco condiciones («sí, lite»).
- **Rechazado** — Menor: Intent, `capabilities/rooms.md` en el Scope, aprobador y estimación → `reservar` existe y se elige de esa lista; el fichero lo crea `sdd-archive`; el aprobador viene de la apertura de la spec, confírmalo al aprobar; la regresión ya existe y la estimación no cambia.

- Segunda ronda (un revisor, sonnet), sin Críticos:
  - **Aceptado** — Importante: GIVEN sin salas ni reservas explícitas → escrito en el primer escenario.
  - **Aceptado** — Importante: el día en el segundo escenario → quitado, `libres` no mira el día; el test existente usa `['10:00-12:00']`.
  - **Aceptado** — Importante: franja vacía sin decidir → decisión 3.
  - **Rechazado** — Menor: enumerar las cinco condiciones de lite y justificar cada regla → constan en la respuesta del dev-lead al abrir la spec; el mensaje es de uso, no un aviso ni un límite.

### Decisiones tomadas con el dev-lead

- Modo lite, con sus cinco condiciones citadas — «sí, lite»

## Intent

Hoy `libres` sin franja responde `Norte, Sur`, como si las dos estuvieran libres a cualquier hora: quien lo escribe sin franja reserva una sala ocupada.

## Scope

- Entra: `libres` sin franja, en `run` de `src/app.js`, y su test en `test/app.test.js`.
- No entra: `libres <franja>`, que responde igual que hoy, ni una franja vacía (`libres ''`).

## Dónde se prueba

- El mensaje: por `run('libres', [])`, en `test/app.test.js`.
- Que `libres <franja>` no cambia: ya lo cubre el test existente «libres excluye la sala reservada en la franja».

## Delta de comportamiento

### Capacidad: `rooms`

#### ADDED — libres sin franja dice qué falta

- GIVEN las salas Norte y Sur, sin ninguna reserva
- WHEN `libres` sin franja
- THEN responde `falta la franja: libres <franja>`

#### ADDED — libres con franja no cambia

- GIVEN las salas Norte y Sur, con Norte reservada de 10:00 a 12:00 (`libres` no mira el día)
- WHEN `libres 10:00-12:00`
- THEN responde `Sur`

### Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec: 0,2 h
- Estimación de implementación: 0,5 h
- Base de la estimación: una rama en `run` y su test
- Confianza: alta

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
