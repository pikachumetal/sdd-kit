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

- `src/app.js`, `test/cancel.test.js`: `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada — `7d25a81`.
- `src/app.js`, `test/cancel.test.js`: nuevo comando `canceladas`, que lista «sala día — motivo» — `8896d4f`.
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva, mergeada con `sdd capability merge` desde el delta de la spec.

## 2. Tiempo y coste: estimado vs real

No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_.

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en «Por triar» de `debt.md`).

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 en verde, sobre el commit de cierre (el cierre solo añade `.docs/` y esta rama no toca más código desde `8896d4f`).
- Gate: el proyecto no declara «Suites» ni gate más allá de `node --test` (constitución, art. 2): `node --test` corrió 5/5.
- Revisión final: Spec (opus, high) y Código (sonnet, high) limpias sobre `8896d4f`; Arquitectura no (lo dice el plan). Lo posterior a esa revisión es solo `tasks.md`: no hace falta re-revisión.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · `node --test` 5/5 · smoke 4/4 THEN con ejecución real (un proceso, las cuatro llamadas seguidas) · revisión final Spec y Código limpias sobre `8896d4f`. Quien usa el producto no ha probado nada a mano: no probado por el dev-lead.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real + suite | `cancelada Norte lun (sala ocupada)` |
| motivo fuera de la lista responde «motivo no válido: …» | ejecución real (`--motivo "me aburro"`) + suite | `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real (`cancelar Norte lun`) | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real + suite | `Norte lun — sala ocupada` |

### 4.3 Residuales / deuda generada

- Test de `canceladas` acoplado al orden de los tests: fila en «Por triar» de `debt.md`.

## 5. Aprendizajes

- Ninguno que cambie una convención, la estructura o las versiones: el comportamiento nuevo vive en `capabilities/bookings.md`.

Retro: sin señales

## 6. Adendas

- _Ninguna_.
