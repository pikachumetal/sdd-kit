---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-16
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; comando `canceladas` que lista «sala día — motivo». Task 1 (30b838e) y Task 2 (76c229f).
- `test/cancel.test.js`: tests de cancelar con motivo válido, con motivo fuera de la lista y de `canceladas`.
- `migrations/v3.0.0.md`: la línea pasa a «**Escribe**: `sdd-kit.json`, `operations.md`.», como pedía el Scope de la spec.
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva, con los dos requisitos ADDED de la spec (`sdd capability merge`).
- ADR: ninguna candidata en la spec.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en «Por triar» de la deuda).

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 en verde, sobre el commit de cierre (el cierre solo añade documentación: la última comprobación de código fue sobre el mismo código).
- Gate: `node --test` → 5/5 · sobre el commit de cierre
- Revisión final: Spec (opus, high) y Código (sonnet, high), limpias; Arquitectura no, por el plan.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-16 · suite 5/5 · smoke 4/4 THEN con ejecución real · revisión final Spec y Código limpia, sin cambios de código posteriores; `canceladas` desde un proceso aparte sale vacío, como dice el Approach de la spec (las reservas viven en memoria hasta la 0014)

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` (con `--motivo "me aburro"`) |
| sin `--motivo` responde lo mismo | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | `Norte lun — sala ocupada`, cancelando y listando en el mismo proceso |

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del orden de los tests: fila en «Por triar» de `debt.md`.
- Las cancelaciones no persisten entre procesos: lo resuelve la 0014 (en el roadmap).

## 5. Aprendizajes

- La capacidad `bookings` nace con esta feature → `.docs/sdd/capabilities/bookings.md`.

Retro: sin señales

## 6. Adendas

- _Ninguna_
