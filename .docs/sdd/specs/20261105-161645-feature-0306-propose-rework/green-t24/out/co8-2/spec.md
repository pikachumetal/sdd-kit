---
id: 20261008-190000-feature-0021-slot-check
feature: 0021
title: Franja no válida en libres
mode: full
profile: delegate
status: draft
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - name: Laura
    approved_at: null
---

# Spec — Franja no válida en libres

## Capacidades

- Nuevas: `rooms` — ver las salas libres de una franja, y rechazar una franja que no es una franja.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: capacidad nueva (`rooms`) · tamaño: ~20 líneas en 2 ficheros
- Dominio+técnica (sonnet): que el requisito nuevo recoja lo que `libres` ya hace hoy (`libres 10:00-12:00` → `Sur`) sin cambiarlo, y que `10:00-10:00` y `12:00-10:00` caigan en el mismo THEN (señal: capacidad nueva)
- Mínimo razonable: el mismo, un solo revisor — no deja nada sin cubrir

1. El caso que reportó conserjería, `libres 10:00-10:00` (`freeRooms`, en `src/app.js`), lista Norte y Sur como libres en una franja de cero minutos: es el caso que esta spec cierra, y tiene su propio escenario.
2. Una franja es válida si el final va **después** del inicio: inicio igual al final (`10:00-10:00`) y final anterior (`12:00-10:00`) se rechazan por igual. Una franja que cruza la medianoche (`22:00-00:00`) también se rechaza: el final de `00:00` no va después de `22:00`.
3. El texto de la respuesta: «franja no válida: el final va después del inicio». El rechazo es una respuesta normal de `libres`, como el resto (no un error ni un código de salida distinto).
4. Capacidad nueva `rooms` (no existía ninguna en `capabilities/`): por eso el delta es `ADDED`, no `MODIFIED`. Solo recoge `libres`; reservar, cancelar y anular quedan fuera hasta que su propio cambio las toque. El primer requisito caracteriza lo que `libres` ya hace (su test actual sigue en verde sin tocarse); el segundo es el cambio.
5. Las horas se comparan como número (`9:00` es antes que `10:00`), no como texto: así `9:00-10:00` sigue valiendo. Si una de las dos partes no se puede leer como `H:MM` o `HH:MM`, `libres` se comporta como hoy: validar el formato sigue siendo la fila de deuda.
6. `libres` no recibe día y compara la franja entera con la de cada reserva activa: solo coincide si es idéntica (no hay solape parcial), como hoy. No se cambia; por eso `9:00-10:00` no choca con la reserva de 10:00 a 12:00.
7. El id 0021 no tiene fila en el roadmap (la rama `feature/0021-slot-check` es el enunciado). La fila de deuda «Sin validación del formato de franja horaria» no se cierra aquí: sigue abierta.
8. Delta probado sobre una copia de `.docs/sdd`: con `MODIFIED` la fusión rechazó la spec («`rooms` no tiene fichero en capabilities/»); con `Nuevas` + `ADDED` da «rooms.md: añadido «Ver las salas libres»» (exit 0).

### Hallazgos de la review

- **Aceptado** — «GIVEN cualquier reserva» no es verificable → todos los escenarios fijan la reserva de Norte del lunes de 10:00 a 12:00.
- **Aceptado** — el día no estaba claro → decisión 6.
- **Aceptado** — el primer escenario era comportamiento ya existente → decisión 4 y requisito propio.
- **Aceptado** — un requisito mezclaba consulta y rechazo → dos requisitos `ADDED`.
- **Aceptado** — comparar como texto rechazaba `9:00-10:00` → decisión 5 y un escenario.
- **Aceptado** — medianoche sin declarar → decisión 2.
- **Aceptado** — rechazo sin forma de salida → decisión 3; `freeRooms` se prueba solo por `run`.
- **Aceptado** — la fila de deuda queda abierta → decisión 7.
- **Segunda ronda (sonnet, sin Críticos)** — Aceptado: escenarios de `10:00-9:00`, `22:00-00:00` y `abc`; `AND no lista ninguna sala` en todos los rechazos; el solape exacto de la franja (decisión 6); sin número de línea; «responde» es el valor de `run`. Rechazado: lo de Laura, «conserjería» y mover la review, por lo mismo que arriba.
- **Rechazado** — Laura y «dev-lead» no cuadran con la misión → autor y aprobador los puso el dev-lead en la spec de partida; no es mío cambiarlos.
- **Rechazado** — quitar «conserjería» → es el origen que dio el dev-lead, y no es un nombre de persona.
- **Rechazado** — sacar la review y la prueba del delta de «Decisiones» → el bloque abre esa sección por la regla del kit.

## Intent

Hoy `libres` acepta cualquier franja y responde con salas libres aunque la franja no tenga sentido (`libres 10:00-10:00` lista Norte y Sur). Debe rechazarla con un mensaje que diga qué falla, y no cambiar nada para una franja correcta.

## Scope

- Entra: `freeRooms` y `run('libres', …)` en `src/app.js`; los tests en `test/app.test.js` (el test actual de `libres` no se toca, solo se añaden casos). «Responde» es el valor que devuelve `run`.
- No entra: el formato `HH:MM`, que es la fila de deuda «Sin validación del formato de franja horaria».

## Dónde se prueba

- La franja: por `run('libres', …)`, en `test/app.test.js`; `freeRooms` no se prueba directamente.

## Delta de comportamiento

### Capacidad: `rooms`

#### ADDED — Ver las salas libres

- GIVEN la reserva de Norte del lunes de 10:00 a 12:00
- WHEN `libres 10:00-12:00`
- THEN responde `Sur`

- GIVEN la reserva de Norte del lunes de 10:00 a 12:00
- WHEN `libres 9:00-10:00`
- THEN responde `Norte, Sur`

- GIVEN la reserva de Norte del lunes de 10:00 a 12:00
- WHEN `libres abc` (una franja que no se puede leer: la deuda de formato)
- THEN responde `Norte, Sur`, como hoy

#### ADDED — Rechazar una franja no válida

- GIVEN la reserva de Norte del lunes de 10:00 a 12:00
- WHEN `libres 10:00-10:00`
- THEN responde «franja no válida: el final va después del inicio»
- AND no lista ninguna sala

- GIVEN la reserva de Norte del lunes de 10:00 a 12:00
- WHEN `libres 12:00-10:00`
- THEN responde «franja no válida: el final va después del inicio»
- AND no lista ninguna sala

- GIVEN la reserva de Norte del lunes de 10:00 a 12:00
- WHEN `libres 10:00-9:00`
- THEN responde «franja no válida: el final va después del inicio»
- AND no lista ninguna sala

- GIVEN la reserva de Norte del lunes de 10:00 a 12:00
- WHEN `libres 22:00-00:00`
- THEN responde «franja no válida: el final va después del inicio»
- AND no lista ninguna sala

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
