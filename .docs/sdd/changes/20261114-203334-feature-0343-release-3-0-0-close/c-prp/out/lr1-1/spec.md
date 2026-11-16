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

Review de spec propuesta: un revisor (sonnet), lite — señales: capacidad nueva · tamaño: ~3 líneas de código y 1 test en 2 ficheros
- Dominio+técnica (sonnet): si el escenario de `libres` sin franja se cumple sin comportamiento y si el ADDED esconde un MODIFIED (señal: capacidad nueva)
- Mínimo razonable: este mismo revisor — sin él quedaría sin mirar si el Intent promete más de lo que el Scope entrega

1. El mensaje es exactamente `falta la franja: libres <franja>`, con `<franja>` literal, tal cual.
2. Capacidad nueva: `rooms` (slug en inglés). Hoy `.docs/sdd/capabilities/` no existe; nace con esta feature y recoge solo este requisito.
3. «Sin franja» es no pasar argumento o pasar uno vacío; se responde con el mensaje normal, no como error ni con código de salida distinto.
4. Una franja mal formada no entra: es la deuda «Sin validación del formato de franja horaria» (`debt.md`).
5. Reglas de la capacidad: datos y mensaje en `src/app.js`, castellano, sin límites, avisos ni conflicto: no aplica. `run('libres', …)` mantiene su firma; solo cambia el texto devuelto.

### Hallazgos de la review

- **Rechazado** — (Crítico) `rooms` sin verdad viva con la que contrastar → es lo esperado en una capacidad nueva: no hay nada que contradecir; se declara su nacimiento en la decisión 2.
- **Rechazado** — `ADDED` es en realidad `MODIFIED` → sin capacidad previa no hay requisito que modificar; el comportamiento antiguo (`Norte, Sur`) se cita en el Intent.
- **Aceptado** — el `AND` y el «lunes» mezclan `libres <franja>` y un día que `libres` no recibe → el escenario queda en un solo comportamiento, sin día; la no regresión pasa a su propio escenario.
- **Aceptado** — batería sin argumento vacío ni no regresión → filas añadidas en «Dónde se prueba».
- **Aceptado** — decisiones sin declarar (error vs. mensaje, franja mal formada, salida) → decisiones 3 y 4.
- **Aceptado** — el Intent promete evitar reservar sala ocupada → Intent reformulado: evita una lectura engañosa; `reservar` no entra.
- **Aceptado** — «con la forma de la guía» no se puede comprobar → referencia quitada, decisión 1.
- **Aceptado** — reglas por nombre sin declarar y firma de `run` → decisión 5.
- **Rechazado** — Norte/Sur y Laura podrían ser reales → son el catálogo y el aprobador del proyecto, ya presentes en `src/app.js` y la spec.
- **Rechazado** — citar las cinco condiciones de lite → ya se citaron en la pregunta de modo; abajo queda la frase literal del dev-lead.

Sin Crítico aceptado ni decisión central reescrita: no hay segunda ronda.

### Decisiones tomadas con el dev-lead

- Modo lite, con sus cinco condiciones citadas — «sí, lite»

## Intent

Hoy `libres` sin franja responde `Norte, Sur`, como si las dos estuvieran libres a cualquier hora: una lectura engañosa del listado. Éxito: sin franja, `libres` dice qué falta en vez de listar salas.

## Scope

- Entra: `libres` sin franja, en `run` de `src/app.js`.
- No entra: `libres <franja>`, que responde igual que hoy; validar el formato de la franja; `reservar`, que sigue sin comprobar ocupación.

## Dónde se prueba

- El mensaje: por `run('libres', [])` y `run('libres', [''])`, en `test/app.test.js`.
- La no regresión: `run('libres', ['10:00-12:00'])` responde `Sur` (ya cubierto por el test existente).

## Delta de comportamiento

### Capacidad: `rooms`

#### ADDED — libres sin franja dice qué falta

- GIVEN el catálogo de `src/app.js`
- WHEN `libres` sin franja (sin argumento o con uno vacío)
- THEN responde `falta la franja: libres <franja>`

#### ADDED — libres con franja no cambia

- GIVEN el catálogo de `src/app.js`, con Norte reservada de 10:00 a 12:00
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
