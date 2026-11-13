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

```text
Review de spec propuesta: un revisor (lite, sonnet) — señales: capacidad nueva (`rooms`) · tamaño: ~5 líneas en 2 ficheros
- Único (sonnet): los siete puntos sobre el ADDED de `rooms` y su escenario (señal: capacidad nueva)
- Mínimo razonable: sin review — deja sin cubrir si el ADDED oculta un MODIFIED, porque no hay `capabilities/` donde contrastarlo
```

1. El mensaje es `falta la franja: libres <franja>`. Es texto plano devuelto por `run`, sin código de salida distinto, como los `sin reserva <sala> <día>` de `cancelar` y `anular`. No he encontrado ninguna guía en el repo que fije otra forma: si hay una, dime cuál.
2. `rooms` se declara nueva y el delta va como ADDED: el repo no tiene `capabilities/` y ninguna capacidad documenta hoy `libres`.

### Decisiones tomadas con el dev-lead

- Modo lite, con sus cinco condiciones citadas — «sí, lite»

### Hallazgos de la review

- **Rechazado** — Crítico: el ADDED es un MODIFIED no declarado → no hay capacidad `rooms` que lo documente; lo que hoy hace `libres` solo vive en el código. Queda dicho en la decisión 2.
- **Rechazado** — Crítico: el `AND libres 10:00-12:00 responde Sur` mezcla comportamientos y falta el día → es la guardia de no regresión de la misma capacidad, y `libres` no recibe día (filtra solo por franja), así que no depende de ninguno.
- **Rechazado** — Importante: el GIVEN con Norte reservada es irrelevante → el test compara la respuesta exacta, y un mensaje fijo que no mirase el catálogo es justo lo pedido.
- **Aceptado** — Importante: decisiones sin listar (texto plano, sin código de salida) → decisión 1 reescrita.
- **Rechazado** — Importante: franja vacía o malformada → `libres` filtra por igualdad exacta de franja y eso no cambia; entra solo el caso sin franja (Scope).
- **Rechazado** — Importante: las cinco reglas → el delta no añade datos, límites ni conflicto; el texto va en castellano (constitución, regla 4) y vive en `run`.
- **Aceptado** — Menor: enumerar las cinco condiciones de lite → abajo.
- **Rechazado** — Menor: falta `PRODUCT.md` → existe, en la raíz del repo, no en `steering/`.
- **Rechazado** — Menor: «Laura» → es la aprobadora del proyecto, no un dato de ejemplo.
- **Aceptado** — Menor: la estimación → la base incluye el test de no regresión que ya existe y el gate `node --test`.

Condiciones de lite: el flujo ya existe y se lee en `src/app.js`; no cambia contratos públicos; no toca datos; cabe en un módulo; la estimación (0,5 h) es ≤ medio día.

## Intent

Hoy `libres` sin franja responde `Norte, Sur`, como si las dos estuvieran libres a cualquier hora: quien lo escribe sin franja reserva una sala ocupada.

## Scope

- Entra: `libres` sin franja, en `run` de `src/app.js`.
- No entra: `libres <franja>`, que responde igual que hoy.

## Dónde se prueba

- El mensaje: por `run('libres', [])`, en `test/app.test.js`.

## Delta de comportamiento

### Capacidad: `rooms`

#### ADDED — libres sin franja dice qué falta

- GIVEN el catálogo de `src/app.js`, con Norte reservada el lunes de 10:00 a 12:00
- WHEN `libres` sin franja
- THEN responde `falta la franja: libres <franja>`
- AND `libres 10:00-12:00` responde `Sur`

### Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec: 0,2 h
- Estimación de implementación: 0,5 h
- Base de la estimación: una rama en `run` y su test; el test de no regresión de `libres <franja>` ya existe; gate `node --test` entero
- Confianza: alta

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
