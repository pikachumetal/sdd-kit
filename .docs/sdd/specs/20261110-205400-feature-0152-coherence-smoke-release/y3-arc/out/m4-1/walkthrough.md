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

- **Cancelar con motivo** (`src/app.js`, `test/cancel.test.js`, `0480137`): `cancelar <sala> <día> --motivo <motivo>` acepta solo la lista cerrada (cambio de planes, sala ocupada, otro); un motivo fuera de la lista o sin `--motivo` responde «motivo no válido: …». La reserva cancelada guarda su motivo.
- **Listado de canceladas** (`src/app.js`, `test/cancel.test.js`, `060f5b9`): `canceladas` lista «sala día — motivo» de las reservas con estado cancelada.
- **Línea de `migrations/v3.0.0.md`** (juntada en el cierre): pasa a «Paso 3: borra `roadmap.md` al acabar.», como pedía el «Scope» de la spec.
- Revisión final y registro en `tasks.md` (juntados en el cierre).

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- El test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (comprobado en el cierre: `node --test --test-name-pattern=canceladas test/cancel.test.js` → 1 fallo). Va a «Por triar» de la deuda.

## 4. Verificación

### 4.1 Builds

- `node --test` entero: 5/5 en verde (salida guardada en el scratchpad de la sesión), sobre el commit de cierre.
- Gate: `node --test` → 5/5 tests · sobre el commit de cierre (el cierre solo añade `.docs/`, `ROADMAP.md` y la deuda sobre el código probado).
- Revisión final: Spec opus+high limpia · Código sonnet+high limpia · Arquitectura no (plan), sobre el commit de cierre (el único cambio posterior a lo revisado fue una línea de `tasks.md`, sin nueva revisión).

### 4.2 Smoke / tests

Validación en campo: 2026-11-12 · suite 5/5 · smoke 5/5 THEN con ejecución real (CLI y `run` en el mismo proceso) · revisión final Spec y Código limpia sobre el commit de cierre. Verificado por el agente; el dev-lead no ha dicho qué probó.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| motivo fuera de la lista (`--motivo "me aburro"`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` tras cancelar Norte lun con «sala ocupada» responde «Norte lun — sala ocupada» | ejecución real (mismo proceso, `run`) | `Norte lun — sala ocupada` |
| el listado enseña lo cancelado en el mismo proceso (límite del «Approach», hasta la 0014) | ejecución real | `node src/app.js canceladas` en un proceso aparte sale vacío, como dice la spec |

### 4.3 Residuales / deuda generada

- Test de `canceladas` acoplado al primer test (ver «Decisiones tomadas sin el dev-lead») → «Por triar» de `debt.md`.
- Las reservas viven en memoria hasta la 0014: ya es scope de la 0014, sin deuda nueva.

## 5. Aprendizajes

- Cancelar pide un motivo de una lista cerrada y `canceladas` lo enseña → `capabilities/bookings.md`, con `sdd capability merge`.
- Las reservas viven en la memoria del proceso hasta la 0014 → `steering/architecture.md`.

Retro: sin señales

## 6. Adendas

- _Ninguna_
