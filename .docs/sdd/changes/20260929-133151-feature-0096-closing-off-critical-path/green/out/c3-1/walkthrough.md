---
id: 20260923-100000-feature-0012-franja
feature: 0012
title: Walkthrough — Validar el formato de la franja
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-29
---

# Walkthrough — Validar el formato de la franja

## 1. Cambios realizados

- `src/slots.js`: `reserve(room, slot)` y `free(slot)` lanzan «Franja no válida: usa HH-HH, p. ej. 10-12» si la franja no casa con `/^\d{2}-\d{2}$/`. Commits de las tasks: Task 1 `829bf4e` (reservar), Task 2 `bc6c449` (libres).
- Tests: `tests/slot-format.test.js` (reservar) y `tests/free-format.test.js` (libres).
- La revisión final de rama encontró 1 Important: `free` no usaba el mensaje literal de la spec. Arreglado con su test; una nota de formato en `slots.js` salió de la re-revisión. Ambos, junto con el cierre, quedan juntados en el commit de cierre.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_.

### Decisiones tomadas sin el dev-lead

- _Ninguna_.

## 4. Verificación

### 4.1 Builds

- `node --test` → 3 tests, 3 pasan, 0 fallan · 0,13 s.

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-29 · «He probado `salas reservar Norte 1012` y `salas libres 1012`: los dos dan el error de la franja. Vale, funciona.»
- Verificado por el agente: `node --test` y una ejecución directa de `reserve` y `free` con `1012` y con `10-12`.
- Revisión final de rama: `sdd-kit:effort-high` + opus, Needs fixes (1 Important) → pasada de fix → re-revisión del tramo posterior, limpia.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Reservar con una franja que no casa con `HH-HH` falla con «Franja no válida: usa HH-HH, p. ej. 10-12» | ejecución real (`reserve('Norte','1012')`) + suite | OK, mensaje literal; el dev-lead lo confirmó con `salas reservar Norte 1012` |
| Consultar libres con una franja que no casa falla con el mismo mensaje | ejecución real (`free('1012')`) + suite | OK, mensaje literal; el dev-lead lo confirmó con `salas libres 1012` |
| Una franja válida sigue funcionando (regresión) | ejecución real (`reserve('Norte','10-12')`, `free('10-12')`) + suite | OK |

### 4.3 Residuales / deuda generada

- La capacidad `booking` no tiene fichero en `capabilities/` (la carpeta no existe), así que el delta de la spec no se ha fusionado. Decisión del dev-lead: ver el informe de cierre.

## 5. Aprendizajes

- Ninguno que cambie una convención, la estructura o el stack: no hay volcado a `constitution.md`, `architecture.md` ni `tech-stack.md`.
- El delta de comportamiento (franja en `reserve` y `free`) queda pendiente de fusionar en `capabilities/booking.md` → decisión del dev-lead.

## 6. Adendas

- _Ninguna_.
