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

## Capacidades

- Nuevas: `rooms` — `libres` sin franja dice qué falta en vez de listar todas las salas.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor (sonnet, lite) — señales: ninguna de la rúbrica (sin contrato nuevo, sin MODIFIED, sin datos) · tamaño: ~5 líneas en 2 ficheros
- Dominio y técnica (sonnet): si el escenario fija el mensaje exacto y el caso de «no entra» (señal: THEN de «libres sin franja»)
- Mínimo razonable: este mismo revisor — no hay nivel inferior defendible sin dejar sin mirar la contradicción con `libres <franja>`

1. El mensaje es `falta la franja: libres <franja>`, en minúscula inicial como `sin reserva <sala> <día>`; `<franja>` va **literal**, no se sustituye.
2. Es una respuesta, no un error: la devuelve `run` y se imprime por stdout como las demás; el código de salida no cambia.
3. «Sin franja» es `params[0]` ausente. `libres ''` o `libres <texto raro>` quedan como hoy (ver «No entra»).

### Decisiones tomadas con el dev-lead

- Modo lite, con sus cinco condiciones citadas (flujo existente y legible, sin contrato público nuevo, sin esquema de datos, un solo módulo, estimación ≤ medio día) — «sí, lite»

### Hallazgos de la review

- **Rechazado** — `ADDED` es en realidad `MODIFIED` (hoy `libres` sin franja responde `Norte, Sur`) → no existe `capabilities/rooms.md`: la spec crea la capacidad y no hay requisito previo que modificar; el comportamiento anterior queda en la Intent.
- **Aceptado** — el GIVEN fija un día que el WHEN no usa → el GIVEN solo fija la franja reservada (`freeRooms` compara franja, no día); el AND pasa a escenario propio.
- **Aceptado** — `<franja>` ambiguo y test por inspección → el THEN dice literal y el test compara la cadena exacta devuelta por `run`.
- **Aceptado** — «la forma de la guía» no comprobable → sustituida por la descripción de la forma (decisiones 1 y 2).
- **Aceptado** — faltan las cinco reglas → sección «Reglas de la capacidad».
- **Aceptado** — casos vecinos sin cubrir → `libres ''` y franja no reconocida, en «No entra».
- **Aceptado** — el AND sin fila de prueba → fila añadida en «Dónde se prueba».
- **Aceptado** — las cinco condiciones de lite no aparecen → enumeradas.
- **Aceptado** — la Intent promete algo sobre reservar → reformulada.

## Intent

Hoy `libres` sin franja responde `Norte, Sur`, como si las dos estuvieran libres a cualquier hora, aunque alguna pueda estar ocupada. Debe decir que falta la franja.

## Scope

- Entra: `libres` sin franja, en `run` de `src/app.js`.
- No entra: `libres <franja>` con franja presente (incluida `''` o una no reconocida), que responde igual que hoy.

## Dónde se prueba

- El mensaje: `run('libres', [])` devuelve exactamente `falta la franja: libres <franja>`, en `test/app.test.js`.
- La regresión: `run('libres', ['10:00-12:00'])` devuelve `Sur`, en `test/app.test.js`.

## Delta de comportamiento

### Capacidad: `rooms`

#### ADDED — libres sin franja dice qué falta

- GIVEN el catálogo de `src/app.js`, con Norte reservada en la franja 10:00-12:00
- WHEN `libres` sin franja
- THEN responde la cadena literal `falta la franja: libres <franja>`

#### ADDED — libres con franja no cambia

- GIVEN el mismo catálogo
- WHEN `libres 10:00-12:00`
- THEN responde `Sur`

### Reglas de la capacidad

- Dónde viven los datos: no aplica, sin datos nuevos.
- Idioma de los nombres: castellano (constitución, punto 4).
- Límites, avisos y regla de conflicto: no aplica.

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
