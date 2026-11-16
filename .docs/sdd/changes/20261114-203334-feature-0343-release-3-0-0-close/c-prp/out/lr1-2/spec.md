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

Review de spec propuesta: un revisor (sonnet) — señales: ninguna de contrato público ni `MODIFIED` declarado; área sin capacidades previas · tamaño: ~15 líneas en 2 ficheros
- Dominio y técnica (sonnet): si el escenario es verificable sin día, qué decir del comportamiento anterior y qué canal y código de salida tiene el mensaje (señal: lite, sin `capabilities/`)
- Mínimo razonable: el mismo revisor — sin él quedaría sin mirar el valor devuelto de `run` y su salida por consola

1. El mensaje es `falta la franja: libres <franja>`; el texto es mío, no sigue ninguna guía del proyecto.
2. `run` devuelve el mensaje como cualquier otra respuesta: sale por stdout y el código de salida no cambia (0).
3. `rooms` no tiene capacidad previa en `capabilities/`: el delta va como `ADDED` aunque cambia lo que hoy responde (`Norte, Sur`).
4. Reglas del mensaje: vive en `src/app.js`, en castellano (constitución 4); límites, avisos y conflicto, no aplica.

### Hallazgos de la review

- **Aceptado** — el GIVEN no dice qué día se consulta → `libres` no recibe día; el GIVEN lo dice.
- **Aceptado** — comportamiento anterior sin línea base → decisión 3 y «antes» en el THEN.
- **Rechazado** — falta escenario de `libres <franja>` (vacía, malformada) → lo cubre el test existente de `libres 10:00-12:00` (`test/app.test.js:5`); lo malformado queda fuera del Scope.
- **Aceptado** — «la forma de la guía» no se puede comprobar → decisión 1 reescrita.
- **Aceptado** — canal y código de salida sin fijar → decisión 2 y THEN.
- **Aceptado** — reglas del texto sin declarar → decisión 4.
- **Aceptado** — el AND no figuraba en «Dónde se prueba» → añadido, con el gate `node --test` entero.
- **Rechazado** — enumerar las cinco condiciones de lite → quedaron citadas con el dev-lead («sí, lite»); no son contenido de la spec.
- **Rechazado** — `libres` con argumentos extra → fuera del Scope; `run` solo lee `params[0]`.
- **Aceptado** — el Intent habla de reservar → reformulado.

### Decisiones tomadas con el dev-lead

- Modo lite, con sus cinco condiciones citadas — «sí, lite»

## Intent

Hoy `libres` sin franja responde `Norte, Sur`, como si las dos estuvieran libres a cualquier hora: quien lo escribe sin franja cree que están libres y puede reservar una sala ocupada.

## Scope

- Entra: `libres` sin franja, en `run` de `src/app.js`.
- No entra: `libres <franja>`, que responde igual que hoy.

## Dónde se prueba

- El mensaje: por `run('libres', [])`, en `test/app.test.js`.
- El AND: el test existente de `libres 10:00-12:00` (`test/app.test.js:5`), sin cambios.
- Gate de cierre: `node --test` entero.

## Delta de comportamiento

### Capacidad: `rooms`

#### ADDED — libres sin franja dice qué falta

- GIVEN el catálogo de `src/app.js`, con Norte reservada el lunes de 10:00 a 12:00 (`libres` no recibe día)
- WHEN `libres` sin franja
- THEN `run('libres', [])` devuelve `falta la franja: libres <franja>` (antes: `Norte, Sur`), que sale por stdout con código de salida 0
- AND `libres 10:00-12:00` responde `Sur`

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
