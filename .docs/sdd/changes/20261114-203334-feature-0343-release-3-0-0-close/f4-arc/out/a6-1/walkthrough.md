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

- Cancelar con motivo (`src/app.js`, `test/cancel.test.js`, 39cf04b): `cancelar <sala> <día> --motivo <motivo>` acepta solo la lista cerrada (cambio de planes, sala ocupada, otro); un motivo fuera de la lista, o sin `--motivo`, responde «motivo no válido: cambio de planes, sala ocupada, otro».
- Listado de canceladas (`src/app.js`, `test/cancel.test.js`, a3bb2aa): `canceladas` enseña «<sala> <día> — <motivo>» de cada reserva cancelada.
- Capacidad `bookings` creada con los dos requisitos de la spec (`capabilities/bookings.md`).
- ADR: El motivo de una cancelación se guarda en la propia reserva — alternativa descartada: una tabla de motivos aparte → decisions/0003-cancel-reason-on-booking.md

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- El test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (Task 2; fila en «Por triar» de `debt.md`).

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 pasan, 0 fallos, 71 ms, sobre el commit de cierre.
- Gate: `node --test` → suite: corrió 5/5 · 71 ms · configuración: la del gate del plan · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-16 · suite 5/5 · smoke 4/4 THEN con ejecución real (CLI y un mismo proceso) · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre a3bb2aa; los commits posteriores solo tocan `.docs/` · Arquitectura no (plan) · no probado: que `canceladas` muestre lo cancelado en otro proceso, porque las reservas viven en memoria hasta la 0014.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | «cancelada Norte lun (sala ocupada)» |
| Un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `--motivo "me aburro"` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| Sin `--motivo` responde lo mismo | ejecución real | `cancelar Norte lun` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | en el mismo proceso tras cancelar → «Norte lun — sala ocupada» (también `suite`) |

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del orden de los tests (ver ruling): deuda en «Por triar».
- El caso «sin `--motivo`» no tiene test propio: solo lo cubre el smoke.

## 5. Aprendizajes

- Cambio de comportamiento observable (cancelar con motivo, listado de canceladas) → `capabilities/bookings.md`
- El motivo vive en la reserva y se pierde al reiniciar hasta la 0014 → `decisions/0003-cancel-reason-on-booking.md`
- `decisions/0002-node-test.md` no tenía «### Confirmación» y `sdd decision check` paraba el cierre: añadida → `decisions/0002-node-test.md`

Retro: sin señales

## 6. Adendas

- (ninguna)
