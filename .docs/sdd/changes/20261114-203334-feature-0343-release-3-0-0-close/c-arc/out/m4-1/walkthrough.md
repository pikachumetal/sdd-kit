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

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; sin motivo o con uno fuera de la lista responde «motivo no válido: …». Commit de70f55.
- `src/app.js`, `test/cancel.test.js`: comando `canceladas`, que lista «sala día — motivo». Commit 657d2bb.
- `migrations/v3.0.0.md`: el «Paso 3» pasa a «borra `roadmap.md` al acabar.» (parte del scope de la spec).
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva con los dos requisitos de la spec, fusionada con `sdd capability merge`.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (queda en la deuda, «Por triar»).

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 en verde, verificado por el agente.
- Gate: `node --test` → 5/5 · 0,2 s · configuración: la del gate de la constitución · sobre el commit de cierre.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-15 · suite 5/5 · smoke 4/4 THEN con ejecución real · revisión final Spec y Código limpias; Arquitectura no (plan). No probado: nada.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| Un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `cancelar Norte lun --motivo "porque sí"` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| Sin `--motivo` responde lo mismo | ejecución real | `cancelar Norte lun` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | en el mismo proceso: `Norte lun — sala ocupada`; en un proceso nuevo sale vacío (las reservas viven en memoria hasta la 0014) |

### 4.3 Residuales / deuda generada

- Los tests de `cancel.test.js` dependen del orden (ruling de la Task 2) → fila en «Por triar» de `debt.md`.
- `canceladas` solo enseña lo cancelado en el mismo proceso hasta la 0014 (ya dicho en la spec).
- La línea del «Paso 3» de `migrations/v3.0.0.md` también la reescribe `develop` (0016) con otro texto: al integrar la base hay conflicto de contenido que decide una persona.

## 5. Aprendizajes

- `canceladas` depende de que las reservas se guarden: su límite actual se retira con la 0014 → fila 0014 del `ROADMAP.md` (ya existe).

Retro: sin señales

## 6. Adendas

- _Ninguna_
