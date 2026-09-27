---
id: 20260927-150000-feature-0012-franja
feature: 0012
title: Walkthrough — Validar el formato de la franja
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-27
---

# Walkthrough — Validar el formato de la franja

## 1. Cambios realizados

- `src/slots.js`: `reserve(room, slot)` y `free(slot)` validan que `slot` case con `/^\d{2}-\d{2}$/`; si no, lanzan `Franja no válida: usa HH-HH, p. ej. 10-12` (746c8d7, c596f81). La validación y el mensaje se extrajeron a `assertSlot()` para no repetirse entre las dos funciones (07f91e5).
- `tests/slot-format.test.js`, `tests/free-format.test.js`: cubren el rechazo de una franja sin guion en cada función.
- `tests/slots.test.js`: cubre el camino feliz de `reserve` (ya existía) y ahora también el de `free` con una franja válida (bbd00c6, ruling de cierre).
- `.docs/sdd/capabilities/booking.md`: creada (no existía `capabilities/` en el proyecto); fusiona el delta de la spec.

## 3. Desviaciones del plan

_Ninguna._

### Decisiones tomadas sin el dev-lead

- Compartir la validación entre `reserve` y `free` en una función `assertSlot()` (07f91e5) — respuesta a la pregunta del dev-lead sobre por qué se repetía; resuelve el primer minor diferido de la revisión final. Coste si está mal: bajo, es un refactor interno sin cambiar la salida observable (confirmado con la suite y con la prueba manual del dev-lead).
- Añadir el test que falta del segundo minor diferido — ninguna prueba, ni automática ni manual, cubría que `free` acepta una franja válida tras el refactor de 07f91e5 (bbd00c6). Coste si está mal: medio — sin este test, una regresión en `assertSlot()` que rompiera el camino feliz de `free` habría pasado desapercibida, porque la validación del dev-lead solo ejercitó el camino de error.
- `spec.md` declaraba la capacidad `booking` en el delta pero no tenía el bloque `## Capacidades` que exige `Test-Capabilities.ps1`; lo añadí (spec ya aprobada, no reabre la aprobación) y creé `capabilities/booking.md` desde la plantilla, porque el proyecto aún no tenía `capabilities/`.
- La tabla «Próximo» de `roadmap.md` no tenía columna «Estado» (la plantilla del kit sí la pide para marcar el cierre); añadí la columna con 0012 en ✅ y 0013 sin tocar, en ⏳.

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test tests/` → 4 pass, 0 fail · ~155 ms.

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-27 · probó `salas reservar Norte 1012` y `salas libres 1012`: los dos dan el error de franja esperado («Vale, funciona, cierra la feature»).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Reservar con franja que no casa con `HH-HH` falla con «Franja no válida: usa HH-HH, p. ej. 10-12» | suite (`slot-format.test.js`) + ejecución real (dev-lead, `salas reservar Norte 1012`) | ✅ |
| Consultar libres con franja que no casa con `HH-HH` falla con el mismo mensaje | suite (`free-format.test.js`) + ejecución real (dev-lead, `salas libres 1012`) | ✅ |

### 4.3 Residuales / deuda generada

- _Ninguna._

## 5. Aprendizajes

- Capacidad nueva `booking` (validar franja al reservar y al consultar libres) → `capabilities/booking.md` (creado; el proyecto no tenía `capabilities/` hasta ahora).
- Revisión de skills: `.claude/skills/` no existe en el proyecto; esta feature (una validación de formato compartida entre dos funciones) no revela un patrón lo bastante recurrente como para justificar una skill propia → no aplica.

## 6. Adendas

_Ninguna._
