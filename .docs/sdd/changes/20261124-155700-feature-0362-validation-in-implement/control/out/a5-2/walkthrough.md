---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-25
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- Cancelar con motivo (`src/app.js`, `test/cancel.test.js`, 888dc95): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; sin motivo o fuera de la lista responde «motivo no válido: …».
- Listado de canceladas (`src/app.js`, `test/cancel.test.js`, 2dcdb9a): el comando `canceladas` lista «<sala> <día> — <motivo>» de las reservas con estado cancelada.
- Capacidad `bookings` creada desde el delta de la spec (`.docs/sdd/capabilities/bookings.md`, dos requisitos añadidos).
- Pieza de la 0009 (`parent: 0009`); la 0016 sigue a esta.

## 2. Tiempo y coste: estimado vs real

No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en «Por triar» de `debt.md`).

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 en verde, ejecutado por el agente al cerrar, sobre 2dcdb9a (el código no cambia después: solo `.docs/` y `ROADMAP.md`).
- Gate: `node --test` → tests: corrió 5/5 · sobre 2dcdb9a
- Revisión final: Spec y Código limpias sobre 2dcdb9a; Arquitectura no (plan).

### 4.2 Smoke / tests

Validación en campo: 2026-10-26 · smoke con una fila por THEN y suite en verde

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | suite · ejecución real | verificado por el agente |
| Motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | suite · ejecución real (`cancelar Sur mar --motivo "me aburro"`) | verificado por el agente |
| Sin `--motivo` responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`cancelar Norte lun`) | verificado por el agente |
| `canceladas` responde «Norte lun — sala ocupada» | suite · ejecución real | verificado por el agente |

### 4.3 Residuales / deuda generada

- Los tests de `cancel.test.js` dependen del orden (el de `canceladas` usa la cancelación del primero): fila en «Por triar» de `debt.md`.
- Las reservas viven en memoria hasta la 0014: `canceladas` solo enseña lo cancelado en el mismo proceso (límite de la spec, no deuda nueva).

## 5. Aprendizajes

- Sin aprendizajes que vuelvan a `constitution.md`, `architecture.md` ni `operations.md`; el comportamiento nuevo vive en `capabilities/bookings.md`.

Retro: sin señales

## 6. Adendas

- (ninguna)
