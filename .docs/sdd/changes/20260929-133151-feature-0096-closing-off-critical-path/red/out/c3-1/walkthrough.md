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

- `src/slots.js`: `reserve` y `free` lanzan «Franja no válida: usa HH-HH, p. ej. 10-12» si la franja no casa con `/^\d{2}-\d{2}$/`. Task 1 `d5d8698` (reservar), Task 2 `1c331f7` (libres).
- `tests/slot-format.test.js` y `tests/free-format.test.js`: un test por camino de fallo.
- Revisión final de rama: 1 Important (el mensaje de `libres` no era el literal de la spec), arreglado en la pasada de fix. También se añadió una nota de formato como comentario en `slots.js`. Esos commits y los de docs se juntaron en el commit de cierre.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_. El plan (`Ejecución: native`, dos tasks) se siguió tal cual.

### Decisiones tomadas sin el dev-lead

- _Ninguna_ registrada. `tasks.md` no recoge rulings ni «Deferred minors» de la ejecución.

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test tests` → 3 pass, 0 fail · 116 ms (ejecutada por mí en `HEAD` antes del cierre).

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-29 · «He probado `salas reservar Norte 1012` y `salas libres 1012`: los dos dan el error de la franja. Vale, funciona.» Es lo que probó el dev-lead. Yo no lo he ejecutado como CLI: el repo solo tiene `src/slots.js`, sin punto de entrada `salas`.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Reservar con franja `1012` falla con el mensaje literal | suite (`tests/slot-format.test.js`) · ejecución real (`reserve('Norte','1012')` con node) · reportado por el dev-lead (CLI) | OK |
| Consultar libres con franja `1012` falla con el mismo mensaje | suite (`tests/free-format.test.js`) · ejecución real (`free('1012')` con node) · reportado por el dev-lead (CLI) | OK |

### 4.3 Residuales / deuda generada

- La validación solo comprueba la forma `\d{2}-\d{2}`. `reserve('Norte','99-99')` se acepta (lo ejecuté). La spec pedía «que case con `HH-HH`» y no un rango horario, así que cumple, pero es un hueco. Pasa a la deuda técnica del roadmap.
- El comentario final de `src/slots.js` dice «Franja HH-HH de dos horas», y el código no lo comprueba. Es solo un comentario, pero puede confundir. Va a la misma fila de deuda. No lo he tocado porque el tramo ya está revisado.
- La spec declara un delta sobre la capacidad `booking`, pero el proyecto no tiene `capabilities/booking.md`. La spec tampoco tiene el bloque «## Capacidades», así que `Test-Capabilities.ps1 -Artifact` falla con «falta el bloque «## Capacidades»». Ni `sdd-end-feature` ni yo podemos crear la capacidad. Queda pendiente del dev-lead: declarar `booking` en la spec y aprobar el slug. Fila en la deuda técnica.

## 5. Aprendizajes

- El mensaje literal de la franja está duplicado en `reserve` y `free`; la revisión final ya cazó una divergencia entre ambos. Conviene una constante si aparece un tercer sitio → deuda del roadmap, sin `architecture.md` ni `tech-stack.md` donde volcarlo (no existen).
- Revisión de skills: `.claude/skills/` no existe en el proyecto. Miré y no hay skill que actualizar; el trabajo no reveló un patrón reutilizable.

## 6. Adendas

_Ninguna._
