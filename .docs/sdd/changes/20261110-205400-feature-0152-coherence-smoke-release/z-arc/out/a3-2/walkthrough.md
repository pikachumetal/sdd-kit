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

- `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro): `src/app.js`, `test/cancel.test.js` (7245b0c).
- `canceladas` lista las reservas canceladas como `<sala> <día> — <motivo>`: `src/app.js`, `test/cancel.test.js` (05f3e62).

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (comprobado al cierre: corrido solo, falla).

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 en verde sobre el código de 05f3e62 (lo posterior es solo `tasks.md`). Si la base trae código en la fusión de sincronía, se repite allí.
- Gate: `node --test` → suite completa: corrió 5/5 · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 5/5 · smoke 4/4 THEN con ejecución real · revisión final Spec y Código limpias sobre 05f3e62 (Arquitectura no: plan sin cambios estructurales)

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "porque sí"`) | ok |
| sin `--motivo` responde lo mismo | ejecución real | ok |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real (un solo proceso: el almacén es en memoria) | ok |

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del primero: falla si corre solo → fila en «Por triar» de `debt.md`.

## 5. Aprendizajes

- Las reservas viven en memoria por proceso: la CLI no encadena `cancelar` y `canceladas` entre ejecuciones; lo guarda la 0014 (Motivo guardado) → roadmap 0014.

Retro: sin señales

## 6. Adendas

- (ninguna)
