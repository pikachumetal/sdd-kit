---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-05
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>`: acepta solo los motivos de la lista (cambio de planes, sala ocupada, otro); con otro motivo, o sin `--motivo`, responde «motivo no válido: cambio de planes, sala ocupada, otro» (`src/app.js`, `test/cancel.test.js`, Task 1, 506a371).
- Comando `canceladas`: lista las reservas canceladas como «<sala> <día> — <motivo>» (`src/app.js`, `test/cancel.test.js`, Task 2, 6ca3a37).
- Capacidad nueva `bookings` en `.docs/sdd/capabilities/bookings.md`, mergida con `sdd capability merge`.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_ respecto a `plan.md`.

### Decisiones tomadas sin el dev-lead

- Task 2: se ejecutó `node --test --test-concurrency=1` en lugar de `node --test` para esquivar una supuesta carrera sobre el almacén en memoria — coste si está mal: la suite tarda más. La re-revisión del cierre dice que el motivo no se sostiene (cada fichero de test corre en su propio proceso) y la suite entera pasa igual con `node --test` (5/5, comprobado en el cierre). El flag no está escrito en ningún documento del proyecto: el gate de cierre sigue siendo `node --test`.

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 pasan, también con `--test-concurrency=1` (5/5).
- Gate: `node --test` → 5/5 · 124 ms · configuración: la del gate · sobre el commit de cierre
- Revisión final: Spec (opus) y Código (sonnet) limpias sobre 6ca3a37. Re-revisión del tramo posterior (solo `tasks.md`, opus): 1 Important (commit de la Task 1 mal anotado, corregido) y 1 Minor (ver 4.3).

### 4.2 Smoke / tests

- Validación en campo: 2026-11-05 · suite 5/5 · smoke con ejecución real de 4 de los 5 comportamientos de la spec (el 5.º, `canceladas` por CLI, no se puede ver en un proceso nuevo) · revisión final Spec y Código sobre 6ca3a37, re-revisión con 1 Important corregido

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | «cancelada Norte lun (sala ocupada)» |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real (`--motivo "me aburro"`) | «motivo no válido: cambio de planes, sala ocupada, otro» |
| sin `--motivo` responde lo mismo | ejecución real | «motivo no válido: cambio de planes, sala ocupada, otro» |
| `canceladas` responde «Norte lun — sala ocupada» (en la misma ejecución, tras cancelar) | ejecución real (módulo importado, `cancelar` y luego `canceladas`) + suite | «Norte lun — sala ocupada» |
| `canceladas` por CLI en una invocación nueva | ejecución real | salida vacía: el almacén es en memoria y no sobrevive al proceso; lo cubre la 0014 |

### 4.3 Residuales / deuda generada

- El motivo de una cancelación no sobrevive entre invocaciones del CLI porque el almacén es en memoria: ya está en el roadmap como 0014 (Motivo guardado), no se abre fila nueva.
- Minor: el ruling de `--test-concurrency=1` de `tasks.md` tiene un motivo que el código desmiente; se deja constancia en 3 y no se corrige el ruling, que es un registro.

## 5. Aprendizajes

- La lista de motivos es cerrada y vive en el código (`reasons` en `src/app.js`) → capacidad `bookings`, en `capabilities/bookings.md`.

Retro: error que cazaría un chequeo → ticket del kit: `tasks.md` aceptó dos tasks `done` con el mismo commit (la fila de la Task 1 apuntaba al commit de la Task 2) y solo lo cazó la re-revisión

## 6. Adendas

- (ninguna)
