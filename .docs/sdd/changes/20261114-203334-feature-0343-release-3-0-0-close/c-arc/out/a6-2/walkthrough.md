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

- `cancelar <sala> <día> --motivo <motivo>`: el motivo es de una lista cerrada (cambio de planes, sala ocupada, otro) y se guarda en la reserva — `src/app.js`, `test/cancel.test.js` (5a1e773).
- `canceladas`: lista «sala día — motivo» de las reservas canceladas — `src/app.js`, `test/cancel.test.js` (fbdd1cb).
- Capacidad nueva `bookings` en `.docs/sdd/capabilities/bookings.md`, fusionada con `sdd capability merge`.
- ADR 0003 (el motivo vive en la reserva), de la «ADR candidata» de la spec. Las ADR 0001 y 0002 ya venían en la rama.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si está mal: el test falla si corre solo o en otro orden (fila en la deuda).
- Sin review de spec: dos señales (MODIFIED, datos) — decisión de la spec, validada con ella.

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 en verde, sobre el commit de cierre (el código no cambió desde fbdd1cb; lo posterior es solo `.docs/`).
- Gate: `node --test` · sobre el commit de cierre.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-15 · suite 5/5 · smoke 3/3 THEN con ejecución real, más el listado por la suite · revisión final Spec y Código sobre fbdd1cb, re-revisión limpia de lo posterior a fbdd1cb (solo docs). Verificado por el agente; el dev-lead no ha probado nada a mano.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` (con `--motivo vacaciones`) |
| sin `--motivo` responde lo mismo | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | suite | `canceladas enseña sala, día y motivo` en verde |
| `canceladas` en un proceso nuevo | ejecución real | salida vacía: las reservas viven en memoria (ADR 0001) y el `canceladas` de otro proceso no ve lo cancelado; es lo previsto en la spec hasta la 0014 |

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del orden de los tests → fila en «Por triar» de la deuda.
- El AND «sin `--motivo`» no tiene test propio (el código lo cubre; lo cubre solo el smoke de este cierre) → fila en «Por triar».
- ADR 0001 y 0002: la re-revisión anota dos Minor. `decision check` paró el cierre por la 0002 sin «Confirmación»: se la añadí. Queda la «Confirmación» vacía de la 0001 → fila en «Por triar» de la deuda.

## 5. Aprendizajes

- La capacidad `bookings` nace con esta feature → `capabilities/bookings.md`.
- El motivo vive en la reserva → ADR 0003.

Retro: sin señales

## 6. Adendas

- _Ninguna_
