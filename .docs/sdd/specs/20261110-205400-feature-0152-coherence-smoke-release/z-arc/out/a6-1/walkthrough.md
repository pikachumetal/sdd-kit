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

- Cancelar con motivo (`src/app.js`, `test/cancel.test.js`) — `1f6584f`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda en la reserva; sin `--motivo` o con uno fuera de la lista responde «motivo no válido: …».
- Listado de canceladas (`src/app.js`, `test/cancel.test.js`) — `c193406`: el comando `canceladas` lista `<sala> <día> — <motivo>` de las reservas con estado cancelada.
- Docs vivos en el cierre: capacidad `bookings` (nueva, mergeada con `sdd capability merge`), ADR 0003, fila de deuda y roadmap.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_.

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en «Por triar» de la deuda).

## 4. Verificación

### 4.1 Builds

- `node --test` → 5 pasan, 0 fallan (verificado por el agente, sobre el commit de cierre; la rama solo añade `.docs/` tras `c193406`, que es lo que revisó la revisión final).
- Gate: `node --test` → suite única: corrió 5/5 · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 5/5 · smoke 4/4 THEN con ejecución real (`node src/app.js` y `run()` en un mismo proceso) · revisión final Spec y Código limpia sobre `c193406` (los dos commits posteriores solo tocan `.docs/`)

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | verificado por el agente: `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (con `--motivo "me aburro"`) | verificado por el agente: `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real | verificado por el agente: `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real (cancelar y `canceladas` en un mismo proceso) | verificado por el agente: `Norte lun — sala ocupada` |

- No probado por una persona: nadie del equipo ha probado el flujo a mano.
- Las reservas viven en memoria (ADR 0001): lanzar `canceladas` por la CLI en un proceso nuevo no enseña nada, porque la cancelación del proceso anterior no persiste. La spec no pide persistencia; lo cubre la feature 0014 del roadmap.

### 4.3 Residuales / deuda generada

- Test de `canceladas` acoplado al orden de los tests → «Por triar» de la deuda.

## 5. Aprendizajes

- Cambio de comportamiento observable (cancelar con motivo, listado de canceladas) → `capabilities/bookings.md`, creada con `sdd capability merge`.
- Decisión «el motivo vive en la propia reserva» → `decisions/0003-cancel-reason-in-booking.md`.

ADR: El motivo de una cancelación se guarda en la propia reserva → decisions/0003-cancel-reason-in-booking.md

Retro: sin señales

## 6. Adendas

- _Ninguna_.
