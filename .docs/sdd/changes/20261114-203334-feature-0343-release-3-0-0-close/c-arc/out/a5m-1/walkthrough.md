---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-15
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; sin `--motivo` o con uno fuera de la lista responde «motivo no válido: …». Task 1, commit 2d44d7b.
- `src/app.js`: comando `canceladas`, que lista `<sala> <día> — <motivo>` de las reservas canceladas. Task 2, commit dbe1c21.
- `test/cancel.test.js`: tests de ambos comandos.
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva con los dos requisitos del delta.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- El test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (Task 2; fila en `debt.md`).

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 en verde, sobre el árbol del cierre (la rama solo cambia después documentación).
- Gate: `node --test` → corrió 5/5 · configuración: la del gate del plan, sin añadidos · sobre el commit de cierre
- Revisión final: Spec (opus, high) y Código (sonnet, high), limpias, sobre dbe1c21; los commits posteriores solo tocan documentación.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-15 · suite 5/5 · smoke 4/4 THEN con ejecución real (importando `run` en un mismo proceso y por la CLI) · revisión final Spec y Código limpias sobre dbe1c21. Verificado por el agente; el dev-lead no ha probado nada a mano.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `cancelar Sur mar --motivo "me aburro"` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real | `cancelar Norte lun` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | en el mismo proceso tras cancelar: `Norte lun — sala ocupada` |

Nota: `canceladas` por la CLI en un proceso aparte sale vacío, porque las reservas viven en memoria hasta la 0014 (la spec lo dice en «Approach»).

### 4.3 Residuales / deuda generada

- Test de `canceladas` acoplado al orden de los tests → «Por triar» de `debt.md`.

## 5. Aprendizajes

- Cambio de comportamiento observable (cancelar con motivo, listado de canceladas) → `.docs/sdd/capabilities/bookings.md` (capacidad nueva, creada con `sdd capability merge`).

Retro: sin señales

## 6. Adendas

- (ninguna)
