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

- `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada — `src/app.js`, `test/cancel.test.js` (Task 1).
- `canceladas` lista las reservas canceladas con su motivo — `src/app.js`, `test/cancel.test.js` (Task 2).
- Capacidad nueva `bookings` fusionada con `sdd capability merge` en `.docs/sdd/capabilities/bookings.md`.

## 2. Tiempo y coste: estimado vs real

No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (deuda en `debt.md`).

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 en verde, sobre el commit de cierre (el cierre añade solo documentación y la capacidad). No hay `operations.md`: sin suites ni gate declarados.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 5/5 · smoke 3/3 THEN con ejecución real · revisión final Spec y Código sobre `5439a80` limpia, re-revisión del commit de documentación con 3 Minor a deuda.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| motivo fuera de la lista y sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (los dos casos) | ok |
| `canceladas` tras cancelar → «Norte lun — sala ocupada» | ejecución real (`run` en un mismo proceso: la CLI no conserva estado entre llamadas) | ok |

### 4.3 Residuales / deuda generada

- Sin test del escenario «sin `--motivo`» (se verificó a mano) → debt.md.
- La rama `sin reserva <sala> <día>` de `cancelBooking` quedó sin test al reemplazar los tests de la Task 1 → debt.md.
- Test de `canceladas` acoplado al orden de los tests → debt.md.

## 5. Aprendizajes

- Sin aprendizajes nuevos.

Retro: sin señales

## 6. Adendas

- 2026-11-12 — La re-revisión del commit de documentación devolvió 3 Minor, sin Critical ni Important; fueron a la deuda — agente.
