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

🦆 Hoy, si escribes `libres` sin decir la franja, el programa te contesta `Norte, Sur`, como si las dos salas estuvieran libres a cualquier hora, y puedes reservar una ocupada. Con este cambio, sin franja te contesta `falta la franja: libres <franja>` y no lista salas. Con franja todo sigue igual. Es un cambio de una rama en `run` y su test.

## Capacidades

- Nuevas: `rooms` — `libres` sin franja pide la franja en vez de listar todas las salas.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor (lite) — señales: capacidad nueva (`rooms`) · tamaño: ~10 líneas en 2 ficheros
- Único revisor (sonnet), siete puntos: si el escenario de `libres` sin franja pasa sin el comportamiento y si lo que cambia respecto a hoy (`Norte, Sur`) está declarado (señal: capacidad nueva)
- Mínimo razonable: este mismo, no hay nivel más bajo en lite — sin él quedaría sin mirar si el texto del mensaje está fijado en una fuente que existe

1. El mensaje es `falta la franja: libres <franja>`, con los `<` y `>` literales como marcador de la franja. **No existe ninguna guía de mensajes en el repo** (la primera versión de esta spec decía «la forma de la guía»; no es verificable y la quito): la forma es la de los demás mensajes de `run` en `src/app.js` (`sin reserva <sala> <día>`): texto en castellano, minúsculas.
2. Se devuelve como valor de `run`, igual que `sin reserva …`: sin excepción ni código de salida distinto.
3. «Sin franja» es que `params[0]` no viene (`run('libres', [])`).
4. La capacidad `rooms` es nueva: no existe `capabilities/` y esta es su primera spec; por eso el comportamiento de hoy (`Norte, Sur`) va como contexto del GIVEN y el requisito como ADDED, no MODIFIED.

### Hallazgos de la review

- **Aceptado** — el escenario mezclaba la no-regresión de `libres <franja>` → el AND pasa a un escenario aparte.
- **Aceptado** — el «lunes» del GIVEN no se explica → el GIVEN dice que `libres` no usa el día: compara solo la franja.
- **Aceptado** — «la forma de la guía» no existe → decisión 1 reescrita; se añaden las decisiones 2 y 3.
- **Aceptado** — franja inválida y argumentos sobrantes sin decir → entran en «No entra».
- **Aceptado** — el Intent prometía evitar reservas sobre salas ocupadas → ajustado: solo se exige la franja.
- **Aceptado** — ayuda o ejemplos de `libres` sin argumento → `git grep libres`: solo el CHANGELOG (`salas libres 10:00-12:00`, con franja) y el test; no hay ayuda que actualizar.
- **Rechazado** — ADDED debería ser MODIFIED → no hay capacidad `rooms` viva que modificar (decisión 4).
- **Rechazado** — escenario sin reservas → `params[0]` ausente se decide antes de mirar las reservas; no añade un camino.
- **Rechazado** — nombre `rooms` frente a «sala» → es el identificador de la capacidad; el texto que ve el usuario va en castellano.
- **Rechazado** — enumerar las cinco condiciones de lite → se citaron una a una en la pregunta de carril; copiarlas de memoria aquí arriesga cambiarlas.
- **Aceptado** — reglas de producto sin declarar → «Reglas de la capacidad» abajo: no aplica, salvo castellano.

### Decisiones tomadas con el dev-lead

- Modo lite, con sus cinco condiciones citadas — «sí, lite»

## Intent

Hoy `libres` sin franja responde `Norte, Sur`, como si las dos estuvieran libres a cualquier hora. Se exige la franja: sin ella no se lista nada y el mensaje dice cómo escribirla.

## Scope

- Entra: `libres` sin franja, en `run` de `src/app.js`.
- No entra: `libres <franja>`, que responde igual que hoy, ni una franja vacía o mal formada, ni argumentos sobrantes: siguen como hoy.

## Reglas de la capacidad

No aplica: sin datos nuevos, límites ni conflicto. El aviso es texto en castellano (constitución, regla 4); la constitución no tiene sección «Reglas de producto».

## Dónde se prueba

- El mensaje: por `run('libres', [])`, en `test/app.test.js`.
- La no-regresión: el test existente `libres excluye la sala reservada en la franja`.

## Delta de comportamiento

### Capacidad: `rooms`

#### ADDED — libres sin franja dice qué falta

- GIVEN el catálogo de `src/app.js`, con Norte reservada de 10:00 a 12:00 (`libres` compara solo la franja, no el día), y que hoy `libres` sin franja responde `Norte, Sur`
- WHEN `libres` sin franja
- THEN responde `falta la franja: libres <franja>`

#### ADDED — libres con franja sigue igual

- GIVEN el mismo catálogo
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
