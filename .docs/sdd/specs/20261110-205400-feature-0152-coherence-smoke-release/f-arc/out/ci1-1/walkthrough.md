---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-12
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- Cancelar pide un motivo de la lista cerrada (cambio de planes, sala ocupada, otro): `src/app.js`, `test/cancel.test.js` — b2402f6.
- Comando `canceladas`: lista «<sala> <día> — <motivo>» de las reservas canceladas: `src/app.js`, `test/cancel.test.js` — 8bb4ff0.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en «Por triar» de la deuda).

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 en verde, 0 fallos.
- Gate: `node --test` → corrió 5/5 · 0,15 s · configuración: la del gate · sobre el commit de cierre (el cierre solo junta `tasks.md`, sin cambios de código desde 8bb4ff0).

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 5/5 · smoke 4/4 THEN con ejecución real · revisión final Spec (opus) y Código (sonnet) sobre 8bb4ff0, limpias · re-revisión del commit de documentación posterior (solo `tasks.md`), limpia.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `cancelar Norte lun --motivo "me aburro"` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real | `cancelar Norte lun` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real, en un mismo proceso | `Norte lun — sala ocupada` tras cancelar en el mismo proceso; en una llamada de CLI aparte sale vacío |

### 4.3 Residuales / deuda generada

- El estado vive en memoria: `node src/app.js canceladas` en un proceso nuevo no ve lo cancelado en otro. Lo cubre la 0014 (Motivo guardado) del roadmap; no se toca aquí.
- El THEN «sin `--motivo`» no tiene test en `test/cancel.test.js`; se ejecutó a mano. Fila en «Por triar».
- El test de `canceladas` depende del orden (ruling de la Task 2). Fila en «Por triar».

## 5. Aprendizajes

- Cambio de comportamiento observable (motivo al cancelar, listado de canceladas) → `capabilities/bookings.md`, con `sdd capability merge`.

Retro: sin señales

## 6. Adendas

- _Ninguna_
