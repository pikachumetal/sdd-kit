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

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; comando `canceladas` que lista «sala día — motivo» (Task 1, 3970477; Task 2, 84f6bf6).
- `test/cancel.test.js`: tests de `cancelar` con motivo y motivo fuera de la lista, y de `canceladas`.
- `.docs/sdd/steering/architecture.md`: la línea de estructura dice que `src/app.js` también valida el motivo al cancelar.
- `.docs/sdd/capabilities/bookings.md`: creada al fusionar el delta de la spec (dos requisitos ADDED).

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 tests verdes (verificado por el agente en el cierre, sobre el commit de cierre; el cierre solo añade documentación).
- Gate: sin «Suites» ni gate declarados en el proyecto (no hay `operations.md`); la suite de `node --test` es la que corre.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 5/5 · smoke 3/3 THEN con ejecución real (el de `canceladas` en el mismo proceso, porque las reservas viven en memoria hasta la 0014) · revisión final Spec y Código limpias, sin re-revisión (lo posterior a lo revisado es documentación). No probado: `cancelar` sin `--motivo` por la suite (solo por ejecución real).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| motivo fuera de la lista (`me aburro`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real + suite | ok |
| sin `--motivo` responde lo mismo | ejecución real | ok |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real + suite | ok |

### 4.3 Residuales / deuda generada

- Test de `canceladas` acoplado al orden de los tests (ruling de la Task 2) → fila en «Por triar» de `debt.md`.
- `cancelar` sin `--motivo` sin test en la suite → misma fila de deuda.

## 5. Aprendizajes

- La estructura (el fichero de entrada valida el motivo) → `.docs/sdd/steering/architecture.md`, ya escrita en la rama.
- El comportamiento observable → `.docs/sdd/capabilities/bookings.md`, por `sdd capability merge`.

Retro: sin señales

## 6. Adendas

- _Ninguna_
