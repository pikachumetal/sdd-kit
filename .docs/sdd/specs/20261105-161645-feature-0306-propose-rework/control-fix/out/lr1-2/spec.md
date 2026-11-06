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

- Nuevas: `rooms` — `libres` sin franja dice qué falta en vez de listar todas las salas. Hoy no existe `capabilities/`: esta feature escribe el primer requisito de `rooms`.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor (lite) — señales: capacidad nueva (`rooms`) · tamaño: ~10 líneas en 2 ficheros
- Único (sonnet): si el escenario de `libres` sin franja se puede verificar con `run('libres', [])` y si el Scope deja casos sin cubrir (señal: capacidad nueva)
- Mínimo razonable: este mismo, es el nivel de lite — no deja nada por debajo

1. El mensaje es `falta la franja: libres <franja>`. Es mío: sigue el estilo de los mensajes de hoy (`sin reserva <sala> <día>`: minúsculas, sin punto final) y la constitución (castellano).
2. La capacidad nueva se llama `rooms` (slug en inglés, kebab-case; el contenido va en castellano).
3. «Sin franja» es `libres` sin ningún argumento detrás. `libres` con una franja vacía o mal formada no entra y responde como hoy.
4. La respuesta es la normal de `run`: una cadena, sin error ni código de salida distinto. El contrato de `run` no cambia.
5. Las cinco reglas del mensaje: vive como literal en `src/app.js`; en castellano; límites, avisos y conflicto, no aplica. La constitución no tiene «Reglas de producto».

### Hallazgos de la review

- **Aceptado** — `rooms` «Nueva» pero `libres` sin franja ya responde hoy → la spec dice que no hay `capabilities/` y que este es el primer requisito de `rooms`; el comportamiento nuevo sustituye al de hoy (Intent).
- **Aceptado** — el AND de `libres 10:00-12:00` ya existe y mezcla dos comportamientos → pasa a un escenario de no regresión, que ya prueba `test/app.test.js`.
- **Aceptado** — la reserva del GIVEN no pinta nada para `libres` sin franja → se quita del primer escenario y se deja en el de no regresión.
- **Aceptado** — «con la forma de la guía» no se puede verificar → la decisión 1 cita su fuente real; la 2 declara el nombre `rooms`.
- **Aceptado** — «sin franja» sin definir → decisión 3.
- **Aceptado** — faltaba el complemento y el canal de salida → AND «no lista ninguna sala» y decisión 4.
- **Aceptado** — cinco reglas sin declarar → decisión 5.
- **Aceptado** — contrato de `run` y documentación → decisión 4; `README.md`, `PRODUCT.md` y el resto del repo no mencionan `libres` sin franja (solo el changelog, con franja).
- **Aceptado** — `reservar` no se toca → «No entra».
- **Rechazado** — «las cinco condiciones de lite no se citan en la spec» → se citaron en la pregunta del carril y quedan en «Decisiones tomadas con el dev-lead»; la spec no repite la pregunta.
- **Pendiente de ti** — «Laura» como aprobadora: la misión dice que solo hay un usuario. Es el nombre que ya traía la spec; dime si lo cambio.

### Decisiones tomadas con el dev-lead

- Modo lite, con sus cinco condiciones citadas — «sí, lite»

## Intent

Hoy `libres` sin franja responde `Norte, Sur`, como si las dos estuvieran libres a cualquier hora: quien lo escribe sin franja reserva una sala ocupada.

## Scope

- Entra: `libres` sin franja, en `run` de `src/app.js`.
- No entra: `libres <franja>`, que responde igual que hoy; `libres` con franja vacía o mal formada; `reservar`, que no se toca.

## Dónde se prueba

- El mensaje: por `run('libres', [])`, en `test/app.test.js`.
- La no regresión: la prueba que ya existe, `libres excluye la sala reservada en la franja`, en el mismo fichero.

## Delta de comportamiento

### Capacidad: `rooms`

#### ADDED — libres sin franja dice qué falta

- GIVEN el catálogo de `src/app.js`
- WHEN `libres` sin franja
- THEN responde `falta la franja: libres <franja>`
- AND no lista ninguna sala

#### ADDED — libres con franja sigue excluyendo la sala reservada

- GIVEN Norte reservada el lunes de 10:00 a 12:00
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
