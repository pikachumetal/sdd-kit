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

- `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva — `src/app.js`, `test/cancel.test.js` (a3195fd).
- Comando `canceladas`: lista «sala día — motivo» de las reservas canceladas del proceso — `src/app.js`, `test/cancel.test.js` (b93d86e).
- `migrations/v3.0.0.md`: la línea pasa a «Paso 3: borra `roadmap.md` al acabar.», como pedía el Scope de la spec.
- Capacidad nueva `bookings` (`.docs/sdd/capabilities/bookings.md`), mezclada con `sdd capability merge`.

## 2. Tiempo y coste

Sin `.docs/sdd/steering/estimation.md`: el proyecto no estima, no hay tiempo que contrastar.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en la deuda).

## 4. Verificación

### 4.1 Builds

- `node --test` (gate de cierre de la constitución): 5 de 5 en verde, 0 fallos. Sobre el commit de cierre.
- Gate: `node --test` · sin tareas de build ni filtro: corrió 5/5.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 5/5 · smoke 4/4 THEN con ejecución real (CLI y mismo proceso) · revisión final Spec (opus+high) y Código (sonnet+high) limpias, arquitectura no (plan); tras ella solo cambió documentación.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) y suite | ok |
| Motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "me aburro"`) y suite | ok |
| Sin `--motivo` responde lo mismo | ejecución real (sin la suite: ningún test lo cubre) | ok |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real en el mismo proceso que `cancelar` (las reservas viven en memoria; en un proceso nuevo la salida es vacía, como dice la spec) y suite | ok |

### 4.3 Residuales / deuda generada

- Test de `canceladas` acoplado al orden de los tests → fila en «Por triar» de `debt.md`.
- Sin test para «cancelar sin `--motivo`»: verificado solo con ejecución real.

## 5. Aprendizajes

- Las reservas viven en la memoria del proceso hasta la 0014 → `steering/architecture.md`.
- Cancelar con motivo y listado de canceladas → `.docs/sdd/capabilities/bookings.md` (delta de la spec).

Retro: sin señales

## 6. Adendas

- _Ninguna_
